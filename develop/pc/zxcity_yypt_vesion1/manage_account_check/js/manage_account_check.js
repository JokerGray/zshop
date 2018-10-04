(function($) {
	var userno = yyCache.get("userno") || "";
	var USER_URL = {
		RESOURLIST: 'operations/platformUserList', //(查询状态)
		ADDRESOURCE: 'operations/realNameStatus', //(用户实名认证审核)
		CHANGESTATU: 'operations/userStatusToggle', //(状态启用/0 未锁/1 已锁)
		//  RESOURCESIZE : 'operations/upgradeToMerchant', //(升级为商户)
		INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
		UPDATEUSER: 'operations/updateSysUser', //(修改用户信息)
		ADDONE: 'operations/appUserAddMerchantInfo', //升级为商户第一步
		LOOKDETAIL: 'operations/getMerchantRegApplyDetail', //(查看详情)
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
		ADDSECOND: 'operations/appUserAddCMSInfoApprove', //第二步
		ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
		ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
		ADDTHIRD: 'operations/appUserAddRolePermissionApprove' //(第三部)
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
		form.verify({
			username: function(value, item) { //value：表单的值、item：表单的DOM对象
				if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
					return '用户名不能有特殊字符';
				}
				if(/(^\_)|(\__)|(\_+$)/.test(value)) {
					return '用户名首尾不能出现下划线\'_\'';
				}
				if(/^\d+\d+\d$/.test(value)) {
					return '用户名不能全为数字';
				}
			},
			pass: function(value, item) {
				if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
					return '密码不能有特殊字符';
				}
				if(/(^\_)|(\__)|(\_+$)/.test(value)) {
					return '密码首尾不能出现下划线\'_\'';
				}
			}
		});
	})

	//搜索
	$('#toolSearch').on('click', function() {
		init_obj();
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#usercode").val('');
		$("#username").val('');
		$('#locked').val('');
		init_obj();
	})

	function init_obj() {
		var _obj = tableInit('demo', [
				[{

					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '账号',

					align: 'left',
					field: 'phone',
					width: 150
				}, {
					title: '昵称',

					align: 'left',
					field: 'username',
					width: 150
				}, {
					title: '性别',

					align: 'left',
					field: 'usersex',
					width: 80
				}, {
					title: '锁定状态',

					align: 'left',
					field: '_locked',
					width: 100,
					event: 'changeSwitch'
				}, {
					title: '用户性质',

					align: 'left',
					field: '_ismerchant',
					width: 250
				}, {
					title: '认证状态',

					align: 'left',
					templet: '#status',
					width: 250
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 400
				}]
			],
			pageCallback
		)
	}

	initForAct();

	function initForAct(replystatus) {
		init_obj();
	}

	//数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.ismerchant == 0) {
				$(item).attr('_ismerchant', '平台用户');
			} else {
				$(item).attr('_ismerchant', '商户');
			}
			if(item.locked == 1) {
				$(item).attr('_locked', '锁定');
			} else {
				$(item).attr('_locked', '启用');
			}
		});
		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit, usercode, username, locked, isrealname) {
		var usercode = $('#usercode').val();
		var username = $('#username').val();
		var locked = $('#locked').val();
		if(usercode == undefined) {
			usercode = ''
		}
		if(username == undefined) {
			username = ''
		}
		if(locked == undefined) {
			locked = ''
		}
		if(isrealname == undefined) {
			isrealname = ''
		}
		return getData(USER_URL.RESOURLIST, "{'page':" + index + ",'rows':" + limit + ",'usercode':'" + usercode + "','username':'" + username + "','locked':'" + locked + "','isrealname':'" + isrealname + "'}");
	}

	//第三步角色权限
	function getTree(roleName) {
		var setting = {
			check: {
				enable: false,
				chkStyle: "checkbox",
				radioType: "all",
				nocheckInherit: true,
				chkDisabledInherit: true
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: 0
				},
				key: {
					checked: "Checked"
				}
			},
			view: {
				showIcon: true,
				showLine: true
			}
		};
		var data = {};
		var paras = {
			page: 1,
			rows: 1000000,
			roleName: roleName,
			sort: "role_code",
			order: "ASC"
		}
		var trees = reqAjax(USER_URL.ROLEID, JSON.stringify(paras));
		var treeData = trees.data;
		for(var i = 0; i < treeData.length; i++) {
			treeData[i].id = Number(treeData[i].permissionId);
			treeData[i].pid = Number(treeData[i].parentid);
			treeData[i].name = treeData[i].permissionName;
			treeData[i].icon = "";
		}
		treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
		treeObj.expandAll(true);
	}

	table.on('tool(demo)', function(obj) {
		var form = layui.form;
		var data = obj.data;
		//查看
		if(obj.event === 'detail') {
			layer.open({
				title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
				},
				success: function(layero, index) {
					//图片加载错误处理
					$('img').error(function() {
						$(this).attr('src', '../common/image/placeholder.png');
					});
					var paramInfo = "{'userId':" + data.id + "}";
					var res = reqAjax(USER_URL.INFORMATION, paramInfo);
					if(res.code == 1) {
						var row = res.data;
						var phone = (row.user.phone == null ? "" : row.user.phone);
						var username = (row.user.username == null ? "" : row.user.username);
						var residence = (row.user.residence == null ? "" : row.user.residence);
						var userbirth = (row.user.userbirth == null ? "" : row.user.userbirth);
						var usersex = (row.user.usersex == null ? "" : row.user.usersex);
						var remark = (row.user.remark == null ? "" : row.user.remark);
						var adress = (row.address == null ? "" : row.address);
						var name = (adress.name == null ? "" : adress.name);
						var mail = (adress.mail == null ? "" : adress.mail);
						var identificationno = (adress.identificationno == null ? "" : adress.identificationno);
						var cardFrontPhoto = (adress.cardFrontPhoto == null ? "" : adress.cardFrontPhoto);
						var cardHoldPhoto = (adress.cardHoldPhoto == null ? "" : adress.cardHoldPhoto);
						var cardBackPhoto = (adress.cardBackPhoto == null ? "" : adress.cardBackPhoto);
						$("#infoAccount").val(phone);
						$("#infoName").val(username);
						$("#infoCity").val(residence);
						$("#infoBirthday").val(userbirth);
						$("#infoSex").val(usersex);
						$("#infoTag").val(remark);
						$("#infotrueName").val(name);
						$("#infoEmail").val(mail);
						$("#infoNumber").val(identificationno);
						$("#infoIDz").attr("src", cardFrontPhoto);
						$("#infoIDhand").attr("src", cardHoldPhoto);
						$("#infoIDf").attr("src", cardBackPhoto);
					}
				},
				yes: function(index, layero) {

				}
			});

		} else if(obj.event === 'reset') {
			var userId = data.id;
			var data = "{'userId':'" + userId + "'}"
			layer.confirm("确认重置密码？", {
				icon: 0,
				title: "提示"
			}, function(index) {
				var a = reqAjax("operations/appUserPasswordReset", data);
				if(a.code == 1) {
					layer.alert("已重置，默认密码为123456")
				} else {
					layer.msg(a.msg);
				}
				layer.close(index);
			})
		}
	});

	//检测密码强度
	function checkLevel(ele, elee, con) {
		var regxs = [];
		regxs.push(/[^a-zA-Z0-9_]/g);
		regxs.push(/[a-zA-Z]/g);
		regxs.push(/[0-9]/g);
		$('body').on('keyup', elee, function() {
			var val = $(this).val();  
			var len = val.length;
			var sec = 0;
			if(len >= 6) { // 至少六个字符
				    
				for(var i = 0; i < regxs.length; i++) {      
					if(val.match(regxs[i])) {        
						sec++;      
					}    
				}  
			}
			var result = (sec / regxs.length) * 100;  
			if(result > 0 && result <= 50) {    
				con.find('li').eq(0).addClass('act').siblings('').removeClass('act')  
			} else if(result > 50 && result < 100) {    
				con.find('li').eq(1).addClass('act').siblings('').removeClass('act')  
			} else if(result == 100) {    
				con.find('li').eq(2).addClass('act').siblings('').removeClass('act')  
			}

		})
	}

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})

	//点击变色
	$('#tableBox').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');

	})

	//刷新
	function refresh() {
		location.reload();
	}
	$('#refresh').click(function() {
		refresh()
	});

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-200',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(1, 15);
		//第一页，一页显示15条数据
		if(res) {
			if(res.code == 1) {
				tableIns.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			}
		}

		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}

	//获取权限类型
	function jurisdictionSize() {
		var res = reqAjax("operations/getSysConfigList", "");
		var sHtml = ""; //计费等级
		var pHtml = ""; //频道类型
		if(res.code == 1) {
			var row = res.data;
			for(var i = 0; i < row.cmsChannelList.length; i++) {
				var rowA = row.cmsChannelList[i];
				pHtml += '<option value="' + rowA.channelId + '">' + rowA.channelName + '</option>';
			};
			for(var j = 0; j < row.chargeLevel.length; j++) {
				var rowA = row.chargeLevel[j];
				sHtml += '<option value="' + rowA.id + '">' + rowA.levelName + '</option>';
			};
			$("#jurisLevel").append(sHtml);
			var val = $("#jurisLevel").children('option').eq(1).val();
			$("#jurisLevel").val(val);
			$("#jurisLevel").children('option').eq(1).select();
			$("#jurisChannel").append(pHtml);
			form.render();

		} else {
			layer.msg(res.msg);
		}
	};

	function loadprovince(code) {
		var param = '{"parentcode":' + code + '}';
		var res = reqAjax("operations/getProvinceList", param);
		var lHtml = ""; //省市
		if(res.code == 1) {
			for(var i = 0; i < res.data.length; i++) {
				var row = res.data[i];
				lHtml += '<option value="' + row.code + '">' + row.areaname + '</option>';
			};
			if(code == '0') {
				$('#provinceId').append(lHtml);
				$('#cityId').attr('disabled');
			} else if(code != "") {
				$('#cityId').html(lHtml);
				$('#cityId').prop("disabled", false);
			}
			form.render();
		}
	}

	form.on('select(province)', function(data) {
		loadprovince(data.value);
	});

	//新增模态框 input限制输数字
	$("#upgradeLevel").keyup(function() {
		$(this).val($(this).val().replace(/^0/, ''));
	})

	//升级保存
	function updateSub(account, index) {
		var userno = yyCache.get('userno');
		var levelTypeId = $('#jurisLevel').val(); //计费等级
		var orgName = $('#upgradeName').val(); //商户名
		var priority = $('#upgradeLevel').val(); //优先级
		var usercode = $('#upgradeManage').val(); //登录名(用户账号)商户管理员账号4-32位英文
		var username = $('#upgradeManagename').val(); //商户管理员呢称
		var password = $('#password').val(); //密码
		var subscriptionName = $('#channelName').val(); //频道名
		var subscriptionTypeId = $('#jurisChannel').val(); //公众号类型
		var subscriptionSynopsis = $('#upgradeNote').val(); //公众号简介
		var provinceId = $('#provinceId').val(); //省id
		var cityId = $('#cityId').val(); //市id
		var isenglish = /^[a-z]{4,32}$/;
		var param = {
			password: password,
			usercode: usercode,
			username: username,
			parentId: userno,
			platformuserId: account,
			orgName: orgName,
			isAdmin: '01',
			priority: priority,
			userNo: userno,
			subscriptionName: subscriptionName,
			subscriptionTypeId: subscriptionTypeId,
			subscriptionSynopsis: subscriptionSynopsis,
			levelTypeId: levelTypeId,
			cityId: cityId, //市id
			provinceId: provinceId //省id
		};
		var res = reqAjax(USER_URL.RESOURCESIZE, JSON.stringify(param));
		if(res.code == 1) {
			layer.msg('升级成功')
			layer.close(index);
			initForAct();
		} else {
			layer.msg(res.msg);
		}

	}

	uploadOss({
		btn: "uploadImg1",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg2",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg3",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg4",
		flag: "img",
		size: "5mb"
	});

})(jQuery)