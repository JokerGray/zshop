(function($) {
	var page = 1;
	var rows = 15;
//	sessionStorage.setItem('curr', 1);  1
	var userNo = yyCache.get("userno");
	var userId = yyCache.get("userId");
	var pid = '';
	var locked = true;
	var USER_URL = {
		RESOURLIST: 'operations/newMerchantListPage', //(查询列表)
		LOCK: 'operations/lockedMerchant', //(锁定商户/启用商户)
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		UPDATE: 'operations/updateMerchantUser', //修改商户信息
		ADDONE: 'operations/addAppuserAndMerchantInfo', //添加商户信息(第一步)
		CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
		ADDSECOND: 'operations/addCMSInfo', //第二步
		INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
		ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
		ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
		ADDTHIRD: 'operations/addAppUserAccountInfo', //(第三部)
		ADDFORTH: 'operations/addMerchantRolePermissionInfo', //(第四步)
		RESETPWD: 'operations/resetMerchantPassword', //(重置)
		CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
		/*UPDATEINFO :'operations/previewUpgradingInfo', //（商户升级信息查询）*/
		UPDATEINFO: 'operations/findMerchantReferrals', //(查找商户推荐人是否为公司员工)
		UPGRADE: 'operations/merchantUpgradeApply', //商户升级'
		GETRECOMMEND: 'operations/getTypeFourRecommendPage' //获取所有推荐关系为公司员工的列表并分页
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	//初始化加载省市
	loadProvinceAndCity({
		'parentcode': 0
	}, 1);

	//加载省市数据
	function loadProvinceAndCity(param, _sort) {
		var res = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
		if(res.code == 1) {
			if(_sort != 2) {
				var sHtml = '<option value="">---请选择---</option>';
			}
			for(var i = 0, len = res.data.length; i < len; i++) {
				sHtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
			}
			_sort = _sort ? _sort : 1;
			if(param['parentcode'] == 0) {
				proviceArr = res.data;
				$("#provinceSelector" + _sort).html(sHtml);
				$("#addMervhant").attr("data-cid", res.data[0].code);
			} else {
				$("#citySelector" + _sort).html(sHtml);
				$("#citySelector" + _sort).prop("disabled", false);
			}
		}
	}

	//加载市
	function getCity(cityid) {
		var param = {
			parentcode: cityid
		}
		reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).done(function(res) {
			if(res.code == 1) {
				var mhtml = "";
				for(var i = 0, len = res.data.length; i < len; i++) {
					mhtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
				}
				if(cityid == 0) {
					$("#provinceSelector2").html(mhtml);
				} else {
					$("#citySelector2").html(mhtml);
				}
				form.render();
			} else {
				layer.msg(res.msg);
			}

		});

	}

	//根据省的选择切换对应的市内容
	$("#provinceSelector1").change(function() {
		var _value = $(this).val();
		if(_value == "") {
			$("#citySelector1").prop("disabled", true).find("option:eq(0)").prop("selected", true);
		} else {
			loadProvinceAndCity({
				'parentcode': _value
			}, 1);
		}
	});

    // CHARGELEVE
    reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
        console.log(res);
        if(res.code ==1){
            var bHtml = "<option value=''>--请选择--</option>";
            var datas = res.data;
            $.map(datas, function(n, index) {
                bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
            })
            $("#orgLevele").html(bHtml);
        }else{
            layer.msg('加载商户等级失败')
        }

        // form.render();
    });

    //加载行业
    reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
        var row = res.data.merchantTrade;
        //行业
        var bHtml = "<option value=''>--请选择--</option>";
        $.map(row, function(n, index) {
            bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
        })
        $("#allTrade").html(bHtml);

        var rows = res.data.regularTypeList;
        //行业
        var tHtml = "";
        $.map(rows, function(n, index) {
            tHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
        })
        $("#regulare").append(tHtml);

        form.render();
    });
	//渲染表单
	function _tableInit() {
		var objs = tableInit('tableNo', [
				[{
						title: '序号',
						/*sort: true,*/
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '手机号',
						/* sort: true,*/
						align: 'left',
						field: 'phone',
						width: 200
					}, {
						title: '商户名称',
						/* sort: true,*/
						align: 'left',
						field: 'orgName',
						width: 200
					},
					{
						title: '商户等级',
						/* sort: true,*/
						align: 'left',
						field: 'levelName',
						width: 100
					}, {
						title: '商户类型',
						/* sort: true,*/
						align: 'left',
						field: 'regularName',
						width: 100
					}, {
						title: '商户行业',
						/*                        sort: true,*/
						align: 'left',
						field: 'tradeName',
						width: 100
					}, {
						title: 'APP用户昵称',
						/* sort: true,*/
						align: 'left',
						templet: '#titleTpl',
						width: 200
					}, {
						title: '是否锁定',
						/* sort: true,*/
						align: 'left',
						field: 'lockedName',
						width: 100
					},{
						title: '是否签协议',
						align: 'left',
						field: '_isAgreement',
						width: 100,
                	}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 200
					}
				]
			],

			pageCallback, 'laypageLeft', 0
		);

		/* 表格初始化
		 * tableId:
		 * cols: []
		 * pageCallback: 同步调用接口方法
		 */
		function tableInit(tableId, cols, pageCallback, test) {
			var tableIns, tablePage;
			//1.表格配置
			tableIns = table.render({
				id: tableId,
				elem: '#' + tableId,
				height: 'full-249',
				cols: cols,
				page: false,
				even: true,
				skin: 'row'
			});

			//2.第一次加载
			var res = pageCallback(page, rows);
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
				elem: test,
				count: res ? res.total : 0,
				layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
				limits: [15, 30],
				limit: 15
			}
			page_options.jump = function(obj, first) {
				tablePage = obj;

				sessionStorage.setItem('curr', tablePage.curr)
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
	}
	_tableInit();

	//左侧表格数据处理
	function getData(url, parms) {
//		var curr = sessionStorage.getItem('curr');   全体排序方法  先不采纳 如需采纳 一次解开页面1,2,3标记
		var res = reqAjax(url, parms);
		var data = res.data;
		console.log(data)
		$.each(data, function(i, item) {
//			if(curr == 1) {2
				$(item).attr('eq', (i + 1));
//			} else {
//				$(item).attr('eq', (15 * (curr - 1) + (i + 1)));3
//			}
// 			if(item.regular == 0) {
// 				$(item).attr('regularname', '正式'); //商户用户类型 0 正式  1 测试
// 			} else if(item.regular == 1) {
// 				$(item).attr('regularname', '测试');
// 			};
            if(item.merchantStatus == 0) { //是否锁定  1 否 0 是
                $(item).attr('lockedName', '是');
            } else if(item.merchantStatus == 1) {
                $(item).attr('lockedName', '否');
            };
            //
			// if(item.orgLevel == 1) { //是否锁定  1 是 0 否
			// 	$(item).attr('orgLevelName', '普通商户');
			// } else if(item.orgLevel == 2) {
			// 	$(item).attr('orgLevelName', '合作商户');
			// } else if(item.orgLevel == 3) {
			// 	$(item).attr('orgLevelName', '代理商户');
			// };

			if(item.sex == 0) {
				$(item).attr('sexname', '男'); //0-男 1-女
			} else if(item.sex == 1) {
				$(item).attr('sexname', '女');
			}
            if(item.isAgreement == 0){
                $(item).attr('_isAgreement', '否'); //是否签协议 0 否 1 是
            }else{
                $(item).attr('_isAgreement', '是');
            }

		});

		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit) {
		var username = $.trim($("#phone").val());
		var locked = $("#locked").val();
		var provinceId = $("#provinceSelector1").val();
		var cityId = $("#citySelector1").val();
		var usercode = $.trim($("#usercode").val());
		var orgName = $.trim($('#orgNamee').val());
		var orgLevel = $.trim($('#orgLevele').val());
		var regular = $.trim($('#regulare').val());
        var trade = $.trim($('#allTrade').val());
        var isAgreement = $('#isAgreementSelector').val();
		var param = {
			page: index,
			rows: limit,
			usercode: usercode, //账号
			phone: username, //手机号
            merchantStatus: locked, //锁定状态
			provinceId: provinceId, //省
			cityId: cityId, // 市
			orgName: orgName,
			orgLevel: orgLevel,
			regular: regular,
            trade:trade,
            agreement:isAgreement,
		}
		return getData(USER_URL.RESOURLIST, JSON.stringify(param));
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
			page: page,
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

	//修改弹窗省市联动
	form.on('select(provinceSelector3)', function(data) {
		var cityHtml;
		var val = data.value;
		var parmm = {
			parentcode: val
		};
		var ress = reqAjax(USER_URL.PROVINCE, JSON.stringify(parmm));
		$.each(ress.data, function(i, item) {
			cityHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
		})
		$('#citySelector3').html(cityHtml);
		form.render('select');
	});

	//表格相关操作
	table.on('tool(tableNo)', function(obj) {
		var data = obj.data;
		var oldId = data.id;
		//查看
		if(obj.event === 'nodetail') {
			layer.open({
				title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['850px', '500px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				end: function() {
					$('#lookDemo').hide();
				},
				success: function(layero, index) {
					$(".looktit").hide();
					$("#sysName").val(data.usercode);
					$("#sysdesig").val(data.username || "");
					$("#userName").val(data.usercode);
					$("#userdesig").val(data.orgName);
                    $("#userType").val(data.regularName);
					// if(data.regular == 0) {
                    //
					// } else if(data.regular == 1) {
					// 	$("#userType").val("测试");
					// }
					//省
					var param = {
						code: data.provinceId
					};
					var req = reqAjax(USER_URL.PROVINCEBYID, JSON.stringify(param));
					if(req.code == 1) {
						$("#userprovi").val(req.data.areaname);
					} else {
						layer.msg(req.msg);
					};
					//市
					var params = {
						code: data.cityId
					};
					var reqs = reqAjax(USER_URL.PROVINCEBYID, JSON.stringify(params));
					if(req.code == 1) {
						$("#usercity").val(reqs.data.areaname);
					} else {
						layer.msg(req.msg);
					};
				}
			})
		} else if(obj.event === 'change') {
			//修改
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#changeDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['850px', '550px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				btn: ['保存'],
				end: function() {
					$('#changeDemo').hide();
				},
				success: function(layero, index) {
					console.log(data)
					//给保存按钮添加form属性
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo1");
					$("#changeName").val(data.usercode);
					$("#changeDesig").val(data.username || "");
					var list = $("#statusTypebox dl dd");
					var userno = yyCache.get('userno');
					var username = data.username;
					var orgName = data.orgName;
					var regular = data.regular;
					var trade = data.trade;
					var provinceId = data.provinceId;
					var cityId = data.cityId;
					var locked = data.locked;
					$('#nicname').val(username);
					$('#orgName').val(orgName);
					$('#regular').val(regular);
					$('#trade').val(trade);
					$('#statusType').val(locked);
					form.render('select');
					var parm = {
						parentcode: 0
					};
					var parmm = {
						parentcode: provinceId
					};
					var res = reqAjax(USER_URL.PROVINCE, JSON.stringify(parm));
					var ress = reqAjax(USER_URL.PROVINCE, JSON.stringify(parmm));
					var provinceHtml = '',
						cityHtml = '';
					$.each(res.data, function(i, item) {
						provinceHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
					})
					$.each(ress.data, function(i, item) {
						cityHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
					})
					$('#provinceSelector3').html(provinceHtml);
					$('#provinceSelector3').val(provinceId);
					$('#citySelector3').html(cityHtml);
					$('#citySelector3').val(cityId);
					form.render();

				},
				yes: function(index, layero) {
					form.on('submit(formdemo1)', function(data) {
						if(data) {
							var username = $.trim($("#changeDesig").val()); //用户昵称
							var locked = $('#statusType').val(); //是否锁定
							var id = data.id;
							var nicname = $('#nicname').val();
							var orgName = $('#orgName').val();
							var regular = $('#regular').val();
							var trade = $('#trade').val();
							var provinceId = $('#provinceSelector3').val();
							var cityId = $('#citySelector3').val();
							var parm = {
								id: oldId,
								locked: locked,
								userId: userId,
								userno: userNo,
								nickname: nicname,
								orgName: orgName,
								regular: regular,
								trade: trade,
								provinceId: provinceId,
								cityId: cityId
							}
							if(locked) {
								locked = false;
								reqAjaxAsync(USER_URL.UPDATE, JSON.stringify(parm)).done(function(res) {
									if(res.code == 1) {
										layer.msg(res.msg);
										layer.close(index);
										var username = $.trim($("#phone").val());
										var locked = $("#statusSelector").val();
										var provinceId = $("#provinceSelector1").val();
										var cityId = $("#citySelector1").val();
										setTimeout(function() {
											getTable(username, locked, provinceId, cityId);
											locked = true;
										}, 500);
									} else {
										layer.msg(res.msg);
										locked = true;
									}
								})
							}
						}
						return false; //禁止刷新
					});
				}
			})
		} else if(obj.event === 'del') {
			//重置密码
			layer.confirm("确认重置密码？", {
				icon: 0,
				title: "提示"
			}, function(index) {
				var parms = {
					id: oldId
				}
				reqAjaxAsync(USER_URL.RESETPWD, JSON.stringify(parms)).done(function(res) {
					if(res.code == 1) {
						layer.close(index);
						layer.alert("已重置，默认密码为123456");
					} else {
						layer.msg(res.msg);
					}
				})
			})
		} else if(obj.event === 'replenishment') {
			//补填
			console.log(data)
			layer.open({
				title: ['补填身份信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#replenishment'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['850px', '360px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				btn: ['保存'],
				end: function() {
					$('#replenishment').hide();
					$('#uploadImg3').attr('src', '')
					$('#uploadImg4').attr('src', '')
				},
				success: function(layero, index) {

				},
				yes: function(index, layero) {
					var UPDATEMERCHANUSER = "operations/updateMerchantUserLicense"
					var id = data.id;
					var licenseHold = $('#uploadImg3').attr('src');
					var licenseFront = $('#uploadImg4').attr('src');
					if((licenseHold || licenseFront) == '') {
						layer.msg('请上传相关照片')
					} else {
						var parms = {
							id: id,
							licenseHold: licenseHold,
							licenseFront: licenseFront
						}
						reqAjaxAsync(UPDATEMERCHANUSER, JSON.stringify(parms)).done(function(res) {
							if(res.code == 1) {
								layer.close(index);
								layer.alert("更新资料成功");
								getTable();
							} else {
								layer.msg(res.msg);
							}
						})
					}

				}
			})
		} else if(obj.event === 'canAgreement'){
            layer.confirm("商户【"+data.orgName+"】的协议号为:"+data.merchantId, {
                title: "提示",
                btn:'确定'
            }, function(index) {
                layer.close(index);
            })
        }
	});

	//点击表格变色
	$('body').on('click', '.layui-form .layui-table-body tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	});

	//加了入参的公用方法
	function getTable(username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular) {
		var initPage = objs.tablePage;
		var initTable = objs.tableIns;
		var res = pageCallback(1, 15, username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular);
		initTable.reload({
			data: res.data
		});
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
				var resTwo = pageCallback(obj.curr, obj.limit, username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular);
				if(resTwo && resTwo.code == 1)
					initTable.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}
		layui.laypage.render(page_options);
	}

	//商户升级
	$("#merchantUp").on("click", function() {
		var indx = $('#noAudit').find("tr.layui-table-click").index();
		var merchantId = $('#noAudit').find("tr.layui-table-click").find(".merchantId").text();
		var phone = $('#noAudit').find("tr.layui-table-click").find(".laytable-cell-1-orgName").text();
		var tatus = $('#noAudit').find("tr.layui-table-click").find(".laytable-cell-1-lockName").text();
		if(indx == -1) {
			layer.msg("请选中表中的行");
		} else {
			if(tatus == "锁定") {
				layer.msg("锁定状态不能升级哟")
			} else {
				locked = true;
				layer.open({
					title: ['商户升级', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#updateDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['850px', '460px'],
					closeBtn: 1,
					shade: [0.1, '#fff'],
					btn: ['保存'],
					end: function() {
						$('#updateDemo').hide();
						$("#payName").val("");
						$("#payAccount").val("");
						$("#recommend").val("");
						$(".infoReaves").hide();
						$(".inputarea").css("height", "38px");
						$(".inputReave").addClass("flex");
						$(".inputReave").show();
					},
					success: function(layero, index) {
						//给保存按钮添加form属性
						$("div.layui-layer-page").addClass("layui-form");
						$("a.layui-layer-btn0").attr("lay-submit", "");
						$("a.layui-layer-btn0").attr("lay-filter", "formdemoOne");
						//商户昵称
						$("#merrName").val(phone);
						//加载商户
						var dataList = {
							page: 1,
							rows: 10
						}
						reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify(dataList)).done(function(res) {
							if(res.code == 1) {
								var lHtml = "";
								for(var i = 1, len = res.data.length; i < len; i++) {
									lHtml += '<option data-money="' + res.data[i].amount + '" value="' + res.data[i].id + '">' + res.data[i].levelName + '</option>'
								}
								$("#updateType").html(lHtml);
								form.render();
								var listss = $("#updateType").find("option");
								var numv = listss.eq(0).attr("data-money");
								$("#money").val(numv);
							} else {
								layer.msg(res.msg);
							}

						});
						//选择不同商户金额变化
						form.on('select(test)', function(data) {
							var val = data.value;
							var listss = $("#updateType").find("option");
							for(var i = 0; i < listss.length; i++) {
								if(val == listss.eq(i).val()) {
									var numv = listss.eq(i).attr("data-money");
									$("#money").val(numv);
								}
							}
						});
						//加载相关升级信息例如推荐人等
						var dataLi = "{'merchantId':" + merchantId + "}";
						reqAjaxAsync(USER_URL.UPDATEINFO, dataLi).done(function(res) {
							if(res.code == 1) {
								$("#recommend").val(res.data.username);
								$("#recommend").attr("data-referrerId", res.data.id);
								$("#recommend").attr("data-type", 1);
								$(".inputhide").css("z-index", -1);
								$(".inputhide").css("display", "none");
								$("#yyname").val(0);
							} else {
								$(".inputhide").css("display", "block");
								$(".inputhide").css("z-index", 33);
								$("#recommend").attr("data-type", 0);
								$("#recommend").attr("placeholder", "请选择推荐人");
								$(".inputhide").click(function() {
									//延时弹出
									setTimeout(function() {
										$("#layui-layer-shade13").hide();
										layer.open({
											title: ['推荐人', 'font-size:12px;background-color:#0678CE;color:#fff'],
											type: 1,
											content: $('#recommendTip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
											area: ['850px', '460px'],
											closeBtn: 1,
											btn: ['确定'],
											shade: 0,
											end: function() {
												$('#recommendTip').hide();
											},
											success: function(layero, index) {
												var obja = tableInit('tableRe', [
														[{
															title: '序号',
															/* sort: true,*/
															align: 'left',
															field: 'eq',
															width: 80,
															event: 'changetable'
														}, {
															title: 'APP用户昵称',
															/* sort: true,*/
															align: 'left',
															field: 'appUserNickName',
															width: 150,
															event: 'changetable'
														}, {
															title: 'APP用户手机',
															/*  sort: true,*/
															align: 'left',
															field: 'appUserPhone',
															width: 200,
															event: 'changetable'
														}, {
															title: '平台用户昵称',
															/*  sort: true,*/
															align: 'left',
															field: 'yyptNickName',
															width: 150,
															event: 'changetable'
														}, {
															title: '平台用户手机',
															/*  sort: true,*/
															align: 'left',
															field: 'yyptPhone',
															width: 200,
															event: 'changetable'
														}]
													],

													pageCallbackTip, 'laypageTip'
												);

												/* 表格初始化
												 * tableId:
												 * cols: []
												 * pageCallback: 同步调用接口方法
												 */
												function tableInit(tableId, cols, pageCallback, test) {
													var tableIns, tablePage;
													//1.表格配置
													tableIns = table.render({
														id: tableId,
														elem: '#' + tableId,
														height: '300',
														cols: cols,
														page: false,
														even: true,
														skin: 'row'
													});

													//2.第一次加载
													var res = pageCallbackTip(page, rows);
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
														elem: test,
														count: res ? res.total : 0,
														layout: ['count', 'prev', 'page', 'next', 'limit'],
														limit: 15
													}
													page_options.jump = function(obj, first) {
														tablePage = obj;

														//首次不执行
														if(!first) {
															var resTwo = pageCallbackTip(obj.curr, obj.limit);
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

												//pageCallback回调
												function pageCallbackTip(index, limit, appUserPhone) {
													if(appUserPhone == undefined) {
														appUserPhone = ''
													}
													var param = {
														page: index,
														rows: limit,
														appUserPhone: appUserPhone
													}
													return getData(USER_URL.GETRECOMMEND, JSON.stringify(param));
												}

												//加了入参的公用方法
												function getTip(appUserPhone) {
													var initPage = obja.tablePage;
													var initTable = obja.tableIns;
													var res = pageCallbackTip(1, 15, appUserPhone);
													initTable.reload({
														data: res.data
													});
													layui.use('laypage');
													var page_options = {
														elem: 'laypageTip',
														count: res ? res.total : 0,
														layout: ['count', 'prev', 'page', 'next', 'limit'],
														limit: 15
													}
													page_options.jump = function(obj, first) {
														tablePage = obj;

														//首次不执行
														if(!first) {
															var resTwo = pageCallbackTip(obj.curr, obj.limit, appUserPhone);
															if(resTwo && resTwo.code == 1)
																initTable.reload({
																	data: resTwo.data
																});
															else
																layer.msg(resTwo.msg);
														}
													}
													layui.laypage.render(page_options);
												}

												//搜索
												$("#toolSearch1").click(function() {
													var appUserPhone = $.trim($("#appUserPhone").val());
													getTip(appUserPhone)
												});

												//选中行
												table.on('tool(tableRe)', function(objs) {
													var datas = objs.data;
													var tr = objs.tr; //获得当前行 tr 的DOM对象
													if(objs.event === 'changetable') {
														var userId = datas.userId;
														var appUserNickName = datas.appUserNickName;
														var appUserPhone = datas.appUserPhone;
														var yyptNickName = datas.yyptNickName;
														var yyptPhone = datas.yyptPhone;
														sessionStorage.setItem("referrerId", userId);
														sessionStorage.setItem("appUserNickName", appUserNickName);
														sessionStorage.setItem("appUserPhone", appUserPhone);
														sessionStorage.setItem("yyptNickName", yyptNickName);
														sessionStorage.setItem("yyptPhone", yyptPhone);
													}
												})

											},
											yes: function(index, layero) {
												$(".infoReaves").show();
												$(".inputarea").css("height", "100px");
												$(".inputReave").removeClass("flex");
												$(".inputReave").hide();
												$("#recommend").val("2");

												//填入推荐
												$("#yyname").val("平台用户昵称：" + sessionStorage.getItem("yyptNickName") + "；平台用户手机：" + sessionStorage.getItem("yyptPhone") + "；APP用户昵称：" + sessionStorage.getItem("appUserNickName") + "；APP用户手机：" + sessionStorage.getItem("appUserPhone"));
												layer.close(index);
											}
										})
									}, 500);
								});
							}

						});
					},
					yes: function(index, layero) {
						form.on('submit(formdemoOne)', function(data) {
							if(data) {
								var upgradeType = $("#updateTypebox").find("dl dd.layui-this").attr("lay-value");
								var datatype = $("#recommend").attr("data-type"); //1-内部 2- 非内部
								var payerName = $.trim($("#payName").val());
								var payerNo = $.trim($("#payAccount").val());
								var ngx = /[\u4e00-\u9fa5]+/;
								if(ngx.test(payerNo)) {
									layer.msg("请输入正确的账户");
									$("#payAccount").val("");
									return false;
								}

								if(datatype == 1) {
									var referrerId = $("#recommend").attr("data-referrerId");
								} else {
									var referrerId = sessionStorage.getItem("referrerId"); //选择之后的推荐人id
								}
								var param = {
									referrerId: referrerId, //推荐人ID
									merchantId: merchantId, //商户id
									chargeLevelTypeId: upgradeType, //升级类型
									payerName: payerName,
									payerNo: payerNo //打款账户（银行卡号/支付宝账号）
								}
								if(locked) {
									locked = false;
									reqAjaxAsync(USER_URL.UPGRADE, JSON.stringify(param)).done(function(res) {
										if(res.code == 1) {
											layer.msg(res.msg);
											layer.close(index);
											var username = $.trim($("#phone").val());
											var locked = $("#statusSelector").val();
											var provinceId = $("#provinceSelector1").val();
											var cityId = $("#citySelector1").val();
											setTimeout(function() {
												getTable(username, locked, provinceId, cityId);
												locked = true;
											}, 500);
										} else {
											layer.msg(res.msg);
											layer.close(index);
											locked = true;
										}

									});
								}
							}
							return false;
						})
					}
				})
			}
		}
	});

	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200);
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click', function() {
//		sessionStorage.setItem('curr', 1);
		var username = $.trim($("#phone").val());
		var locked = $("#statusSelector").val();
		var provinceId = $("#provinceSelector1").val();
		var cityId = $("#citySelector1").val();
		var usercode = $.trim($("#usercode").val());
		var orgName = $.trim($('#orgNamee').val());
		var orgLevel = $.trim($('#orgLevele').val());
		var regular = $.trim($('#regulare').val());
		var locked = $.trim($('#locked').val())
		_tableInit();
	})

	//重置
	$("#toolRelize").click(function() {
		$("#phone").val("");
		$("#statusSelector").val("");
		$("#provinceSelector1").val("");
		$("#citySelector1").val("").prop('disabled', true);
		$("#usercode").val("");
		$('#orgNamee').val("");
		$('#orgLevele').val("");
		$('#regulare').val("");
        $('#locked').val('')
		$('#isAgreementSelector').val('');
		$('#allTrade').val('');
        _tableInit();
	});
})(jQuery);