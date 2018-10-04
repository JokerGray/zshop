(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno") || "";
	var userId = yyCache.get("userId") || "";
	var pid = '';
	var locked = true;
	var dataTr = {};
	var USER_URL = {
		RESOURLIST: 'operations/newMerchantListPage', //(查询列表)
		LOCK: 'operations/lockedMerchant', //(锁定商户/启用商户)
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		UPDATE: 'operations/updateMerchantUser', //修改商户信息
		ADDONE: 'operations/addAppuserAndMerchantInfo', //添加商户信息(第一步)
		CONFIG: 'operations/getSysConfigList ', //获取系统信息接口(计费类型,行业类型,公众号类型)
		TEMPLET:'operations/getAllMerchantTradeTemplateList',//行业模板接口
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
		GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取所有推荐关系为公司员工的列表并分页
		RECHARGEAPPLY: 'operations/merchantRechargeApply', //续费申请提交
		GETCHARGELEVELBY : 'operations/getChargeLevelByMerchantId',//升级，续费查时间
		UPDATEAGENCCY : "operations/updateToRegionalAgency",//设置区域代理
		CANCELAGENCCY : "operations/cancelRegionalAgency",//取消区域代理
		UPDATEAGREEMENT:"operations/updateAgreementNumber",//签订协议
        WORKSOURCE:'payZyzz/newZyzzSourcePage',//工单来源
		SHAREUSERlIST:'user/shareUserList',//分享人列表
		SHAREUSERINFO:'user/selShareUserInfo',//查看分享人
		QUERYMONEYLIST:'operations/getPaymentMethodList',//获取打款方式列表
		QUERYCHARGLEVEL:'operations/getBackuserRegularTypeList',//获取商户类型
		QUERYCHARGLOG:'operations/merchantChargeLog',//缴费
		QUERYSHOPINFO:'operations/merchantShopInfo',//店铺
		QUERYADDRESS:'operations/merchantUserAddress',//实名信息
		EXCELCMD:'operations/newMerchantList',//导出excel
		GETSCTRADEBYID:'operations/getScTradeProcessByMerchantTradeId',//根据行业ID查询行业流程配置
    };

	var layer = layui.layer;
	var table = layui.table;
    var element = layui.element;
    var form = null;
	layui.use('form', function() {
		form = layui.form;
	})
	//下单类型相关操作
    var xuan = 1;
    form.on('checkbox(set2)',function (obj) {
        var checked = obj.elem.checked
        if(!checked){
            $('.xiadan_box').hide()
            xuan-=1;
        }else{
            $('.xiadan_box').show()
            xuan+=1;
        }
    })
    form.on('checkbox(set1)',function (obj) {
        var checked = obj.elem.checked
        if(!checked){
            xuan-=1;
        }else{
            xuan+=1;
        }
    })
	form.on('select(uBussiness)',function (obj) {
		var el = $('.xiadan_box');
        setSctradeById(obj.value)
	})
	function setSctradeById(ids){
        var params = {
            merchantTradeId:ids
        }
        reqAjaxAsync(USER_URL.GETSCTRADEBYID,JSON.stringify(params)).done(function (res) {
            if(res.code == 1){
                var reData = res.data;
                console.log(reData)
                // setDatas(el,datas);

                if(reData.set1 == 1){
                    $('#set1').prop('checked',true)
                }else{
                    $('#set1').prop('checked',false)
				}
                if(reData.set2 == 1){
                    $('#set2').prop('checked',true)
                    $('.xiadan_box').show();
                }else{
                    $('#set2').prop('checked',false)
                    $('.xiadan_box').hide();
                }
                $('input[name="set3"][value="'+reData.set3+'"]').prop('checked',true)
                $('input[name="set4"][value="'+reData.set4+'"]').prop('checked',true)
                $('input[name="set5"][value="'+reData.set5+'"]').prop('checked',true)

            }else{
                $('#set1').prop('checked',true)
                $('#set2').prop('checked',false);
                $('input[name="set3"][value="0"]').prop('checked',true)
                $('input[name="set4"][value="0"]').prop('checked',true)
                $('input[name="set5"][value="0"]').prop('checked',true)
                $('.xiadan_box').hide();
			}
            form.render();
        })
	}
    /*导出excel*/
    function downloadFile(url,parms) {
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        //1. 发送下载请求 , 业务不同，向server请求的地址不同
        reqAjaxAsync(url,parms).then(function(excelUrl) {
            if(excelUrl.code != 1) {
                layer.msg(excelUrl.msg);
            } else {
                //2.获取下载URL
                excelFilePathName = excelUrl.data;
                //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
                if("" != excelFilePathName) {
                    var aIframe = document.createElement("iframe");
                    aIframe.src = excelFilePathName;
                    aIframe.style.display = "none";
                    document.body.appendChild(aIframe);
                }
            }

        })
    }
    $('#excelBtn').click(function () {
        var param = {
            phone: $.trim($('#phone').val())||'', //手机号
            merchantStatus: $.trim($('#statusSelector').val())||'', //锁定状态
            provinceId: $.trim($('#provinceSelector1').val())||'', //省
            cityId: $.trim($('#citySelector1').val())||'', // 市
            orgName: $.trim($('#orgNamee').val())||'',
            orgLevel:  $.trim($('#orgLevele').val())||'',
            regular: $.trim($('#regulare').val())||'',//商户类型
            isRegionalAgent: $.trim($('#isAgent').val())||'',
            trade:$.trim($('#allTrade').val())||'',
            agreement:$.trim($('#isAgreementSelector').val())||'',//签订协议
        }
        downloadFile(USER_URL.EXCELCMD,JSON.stringify(param))
    })
    //一些事件监听
    element.on('tab(tabDemo)', function(data){
    	var merchantId = dataTr.merchantId||'';
        // var merchantId = 1051;
        var userId = dataTr.appUserId||'';
        // var userId = 16;
        if(data.index ==2){
    		getMoneyTabel(merchantId)
		}else if(data.index ==3){
            getShopTabel(merchantId)
		}else if(data.index == 4){
            reqAjaxAsync(USER_URL.QUERYADDRESS,JSON.stringify({userId:userId})).done(function (res) {
            	console.log(res.data)
            	if(res.code == 1 && res.data){
                    setDatas($('#nameBox'),res.data[0])
				}

            })
		}
    });
    //渲染数据
    function setDatas(demo,data){
        var inputArr = demo.find('input');
        var imgArr = demo.find('img');
        setArr(inputArr,data);
        setArr(imgArr,data,'');
        form.render()

    }
    //遍历数组，填充数据
    function setArr(arr,data,img){
        var ids = '';
        $.each(arr,function (index, item) {
            ids = $(this).attr('id');
            if(data.hasOwnProperty(ids)){
                if(img !== undefined){
                    $(this).attr('src',data[ids] || 'img/upload.png')
                }else{
                    $(this).val(data[ids]);
                }
            }
        })
    }
	function getShopTabel(merchantId){
        tableInit('tableShop', [
            [{
                title: '序号',
                align: 'left',
                field: 'eq',
            }, {
                title: '店铺名',
                align: 'left',
                field: 'orgName',
            },{
                title: '行业',
                align: 'left',
                field: 'tradeName',
            }]
        ],pageCallbackShop)
        function pageCallbackShop(index, limit) {
            var ress =  reqAjax(USER_URL.QUERYSHOPINFO,JSON.stringify({merchantId:merchantId}));
            console.log(ress)
            if(ress.code ==1){
                var datas = ress.data;
                var shops =ress.dataExpansion;
                $.each(datas,function (i, item) {
                    $(item).attr('eq', (i + 1));
                    $(item).attr('tradeName',shops[item.trade]);
                })
			}
			return ress
        }
	}
    function getMoneyTabel(merchantId){
        tableInit('tableMoney', [
            [{
                title: '序号',
                align: 'left',
                field: 'eq',
            }, {
                title: '缴费类型',
                align: 'left',
                field: 'upgradeTypeName',
            },{
                title: '费用',
                align: 'left',
                field: 'upgradeAmount',
            },{
                title: '缴费时间',
                align: 'left',
                field: 'applyTime',
            }]
        ],pageCallbackMoney)
        function pageCallbackMoney(index, limit) {
            var ress =  reqAjax(USER_URL.QUERYCHARGLOG,JSON.stringify({merchantId:merchantId}));
            console.log(ress)
            if(ress.code ==1){
                var datas = ress.data;
                var shops =ress.dataExpansion;
                $.each(datas,function (i, item) {
                    $(item).attr('eq', (i + 1));
                    $(item).attr('upgradeTypeName',shops[item.upgradeType]);
                })
            }
            return ress
        }
    }
	$('.signform-face-img').click(function () {
		console.log($(this).attr('src'))
		var el = $('#tong');
        el.find('img').attr('src',$(this).attr('src'))
		if($(this).attr('src') != "img/upload.png"){
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: ['700px','700px'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                skin: 'myBg',
                content:el,
				end:function () {
                    el.find('img').attr('src','')
                }
            });
		}
    })
	//加载分享人
	function getShareName(appUserId) {
		return reqAjaxAsync(USER_URL.SHAREUSERINFO,JSON.stringify({userId:appUserId}))
    }
	//初始化加载省市
	loadProvinceAndCity({
		'parentcode': 0
	}, 1);

	//加载省市数据
	function loadProvinceAndCity(param, _sort) {
		reqAjaxAsync(USER_URL.PROVINCE,JSON.stringify(param)).then(function(res){
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
		})
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


	//加载打款方式
    reqAjaxAsync(USER_URL.QUERYMONEYLIST,{}).done(function (res) {
        if(res.code == 1){
            var lHtml = "<option value=''>--请选择--</option>";
            for(var i = 0, len = res.data.length; i < len; i++) {
                lHtml += '<option value="' + res.data[i].id + '">' + res.data[i].paymentName +'</option>'
            }
            $('#paymentName').html(lHtml)
            form.render();
        }
    })
	
	//加载行业  //类型
	reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
				var row = res.data.merchantTrade;
				//行业
				var bHtml = "<option value=''>--请选择--</option>";
				$.map(row, function(n, index) {
					bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
				})
				$("#allTrade").html(bHtml);
                //
				// var rows = res.data.regularTypeList;
				// //行业
				// var tHtml = "";
				// $.map(rows, function(n, index) {
                 //    tHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
				// })
				// $("#regulare").append(tHtml);
				// $('#regular').append(tHtml)

				form.render();
	});
    //加载行业  //类型
    reqAjaxAsync(USER_URL.QUERYCHARGLEVEL, {}).done(function(res) {
        var rows = res.data;
        //行业
        var tHtml = "";
        $.map(rows, function(n, index) {
            tHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
        })
        $("#regulare").append(tHtml);
        $('#regular').append(tHtml)

        form.render();
    });



    //加载商户等级
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

	//渲染表单
	var objs = tableInit('tableNo', [
			[{
					title: '序号',
					align: 'left',
					field: 'eq',
					width: 80,
					event: 'tClick'
				}, {
					title: '手机号',
					align: 'left',
					field: 'phone',
					width: 130,
					event: 'tClick'
				}, {
					title: '商户名称',
					align: 'left',
					field: 'orgName',
					width: 130,
					event: 'tClick'
				},
				{
					title: '商户等级',
					align: 'left',
					field: 'levelName',
					width: 150,
					event: 'tClick'
				}, {
					title: '商户类型',
					align: 'left',
					field: 'regularName',
					width: 80,
					event: 'tClick'
				}, {
					title: '商户行业',
					align: 'left',
					field: 'tradeName',
					width: 100,
					event: 'tClick'
				}, {
					title: 'APP用户昵称',
					align: 'left',
					templet: '#titleTpl',
					width: 150,
					event: 'tClick'
				}, {
					title: '是否锁定',
					align: 'left',
					field: 'lockedName',
					width: 100,
					event: 'tClick'
				}, {
                    title: '是否签协议',
                    align: 'left',
                    field: '_isAgreement',
                    width: 100,
                    event: 'tClick'
                }, {
					title: '操作',
					fixed: 'right',
					align: 'left',
					toolbar: '#barDemo',
					width: 550,
					event: 'tClick'
				}
			]
		],

		pageCallback, 'laypageLeft'
	);

	/* 表格初始化
	 * tableId:
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback, pagetion) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full',
			cols: cols,
			page: false,
			even: true,
			skin: 'row',
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
			elem: pagetion,
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

	//左侧表格数据处理
	function getData(url, parms) {
		var res = reqAjax(url, parms);
		var data = res.data;
		console.log(data);
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.isAgreement == 0){
                $(item).attr('_isAgreement', '否'); //是否签协议 0 否 1 是
			}else{
                $(item).attr('_isAgreement', '是');
            }
			// if(item.regular == 0) {
			// 	$(item).attr('regularname', '正式'); //商户用户类型 0 正式  1 测试
			// } else if(item.regular == 1) {
			// 	$(item).attr('regularname', '测试');
			// };
			if(item.merchantStatus == 0) { //是否锁定  1 否 0 是
				$(item).attr('lockedName', '是');
			} else if(item.merchantStatus == 1) {
				$(item).attr('lockedName', '否');
			};

			// if(item.orgLevel == 1) {
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
		});
		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit, username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular,isRegionalAgent,trade,isAgreement) {
		if(username == undefined) {
			username =  $.trim($('#phone').val())||'';
		}
		if(locked == undefined) {
			locked = $.trim($('#statusSelector').val())||'';
		}
		if(provinceId == undefined) {
			provinceId = $.trim($('#provinceSelector1').val())||'';
		}
		if(cityId == undefined) {
			cityId = $.trim($('#citySelector1').val())||'';
		}
		if(usercode == undefined) {
			usercode = ''
		}
		if(orgName == undefined) {
			orgName = $.trim($('#orgNamee').val())||'';
		}
		if(orgLevel == undefined) {
			orgLevel = $.trim($('#orgLevele').val())||'';
		}
		if(regular == undefined) {
			regular = $.trim($('#regulare').val())||'';
		}
		if(isRegionalAgent == undefined) {
			isRegionalAgent = ''
		}
		if(trade == undefined) {
			trade = $.trim($('#allTrade').val())||'';
		}
		if(isAgreement == undefined){
            isAgreement = $.trim($('#isAgreementSelector').val())||'';
		}
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
			regular: regular,//商户类型
			isRegionalAgent:isRegionalAgent,
			trade:trade,
            // locked:locked,
            agreement:isAgreement,//签订协议
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
		
		reqAjaxAsync(USER_URL.ROLEID, JSON.stringify(paras)).then(function(trees){
			var treeData = trees.data;
			for(var i = 0; i < treeData.length; i++) {
				treeData[i].id = Number(treeData[i].permissionId);
				treeData[i].pid = Number(treeData[i].parentid);
				treeData[i].name = treeData[i].permissionName;
				treeData[i].icon = "";
			}
			treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
			treeObj.expandAll(true);
		})
	}

	//修改弹窗省市联动
	form.on('select(provinceSelector3)', function(data) {
		var cityHtml;
		var val = data.value;
		var parmm = {
			parentcode: val
		};
		reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(parmm)).then(function(ress){
			$.each(ress.data, function(i, item) {
			cityHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
			})
			$('#citySelector3').html(cityHtml);
			form.render('select');
		})		
	});


	//表格相关操作
	table.on('tool(tableNo)', function(obj) {
		var data = obj.data;
        dataTr = data;
		console.log(dataTr)
		var oldId = data.id;
		var merchantId = data.merchantId;
		if(obj.event === 'tClick') {
			$('#merchantPay').data('tableData', data);
		}
		//查看
		else if(obj.event === 'nodetail') {
			layer.open({
				title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['850px', '500px'],
				closeBtn: 1,
				btn:['确定'],
				shade: [0.1, '#fff'],
				end: function() {
					$('#yyzzfont，#cardHoldPhoto，#yyzzback').attr('src',"img/upload.png");
					$('#lookDemo').hide();
                   $('#tabDemo>ul li:first-child').addClass('layui-this').siblings().removeClass('layui-this')
					$('.layui-tab-content>div:first-child').addClass('layui-show').siblings().removeClass('layui-show')
				},
				success: function(layero, index) {
					$(".looktit").hide();
					$("#sysName").val(data.usercode);
					$("#sysdesig").val(data.username || "");
					$("#userName").val(data.usercode);
					$("#userdesig").val(data.orgName);
					$('#userType').val(data.regularName);
					if(data.isBusinessPayment == 0) {
						$("#ispay").val("否");
					} else if(data.isBusinessPayment == 1) {
						$("#ispay").val("是");
					};
					// if(data.regular == 0) {
					// 	$("#userType").val("正式");
					// } else if(data.regular == 1) {
					// 	$("#userType").val("测试");
					// }
					//
					var timeList = {
							merchantId:merchantId
						}
						
				reqAjaxAsync(USER_URL.GETCHARGELEVELBY,JSON.stringify(timeList)).then(function(res){
					console.log(res);
					if(res.data){
                        $('#createTimeSee').val(res.data.createTime);
                        $('#endTimeSee').val(res.data.endTime);
                        $('#orgLevelSee').val(res.data.levelName);
					}

				});
				$('#yyzzfont').prop('src',data.licenseFront ||'img/upload.png');
				$('#yyzzback').prop('src',data.licenseHold || 'img/upload.png');
					
					form.render()
					
					//省
					var param = {
						code: data.provinceId
					};
					
					reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(param)).then(function(req){
						if(req.code == 1) {
							$("#userprovi").val(req.data.areaname);
						} else {
							layer.msg(req.msg);
						};
					})
					
					//市
					var params = {
						code: data.cityId
					};
					
					reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(params)).then(function(reqs){
						if(reqs.code == 1) {
							$("#usercity").val(reqs.data.areaname);
						} else {
							layer.msg(reqs.msg);
						};
					})
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
					//给保存按钮添加form属性
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formdemo1");
					$("#changeName").val(data.usercode);
					$("#changeDesig").val(data.username || "");
					var list = $("#statusTypebox dl dd");
					var userno = sessionStorage.getItem('userno');
					var username = data.username;
					var orgName = data.orgName;
					var regular = data.regular;
					var trade = data.trade;//行业
					var templet=data.templateId;//模板
					var provinceId = data.provinceId;
					var cityId = data.cityId;
					var locked = data.merchantStatus;
					var payment = data.isBusinessPayment; //是否生活缴费
					$('#nicname').val(username);
					$('#orgName').val(orgName);
					$('#regular').val(regular);
					$('#payment').val(payment); //是否生活缴费
					
					reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {

							var row = res.data.merchantTrade;
							//行业
							var bHtml = "";
							$.map(row, function(n, index) {
								bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
							})
							$("#trade").html(bHtml);
							$('#trade').val(trade);
							form.render();
					});
					
					reqAjaxAsync(USER_URL.TEMPLET, "").done(function(res) {

							var row = res.data;
							//模板
							var bHtml = "";
							$.map(row, function(n, index) {
								bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
							})
							$("#templet").html(bHtml);
							$('#templet').val(templet);
							form.render();
					});					
					

					$('#statusType').val(locked);
					form.render('select');
					var parm = {
						parentcode: 0
					};
					var parmm = {
						parentcode: provinceId
					};
					reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(parm)).then(function(res){
						var provinceHtml = "";
						$.each(res.data, function(i, item) {
							provinceHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
						})
						$('#provinceSelector3').html(provinceHtml);
						$('#provinceSelector3').val(provinceId);
						form.render();
					})
					reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(parmm)).then(function(ress){
						var provinceHtml = '',
						cityHtml = '';
						$.each(ress.data, function(i, item) {
							cityHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
						})
						$('#citySelector3').html(cityHtml);
						$('#citySelector3').val(cityId);
						form.render();
					})
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
							var templet=$('#templet').val();
							var provinceId = $('#provinceSelector3').val();
							var cityId = $('#citySelector3').val();
							var payment = $('#payment').val(); //是否生活缴费
							var parm = {
								id: oldId,
								merchantStatus: locked,
								userId: userId,
								userno: userNo,
								nickname: nicname,
								orgName: orgName,
								regular: regular,
								trade: trade,
								templateId:templet,
								provinceId: provinceId,
								cityId: cityId,
								isBusinessPayment: payment //是否生活缴费
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
		}else if(obj.event === 'setAgent') {
			//重置密码
			layer.confirm("确定设置为区域代理？", {
				icon: 0,
				title: "提示"
			}, function(index) {
				var parms = {
					id: oldId
				}
				reqAjaxAsync(USER_URL.UPDATEAGENCCY, JSON.stringify(parms)).done(function(res) {
					if(res.code == 1) {
						layer.close(index);
						layer.alert("设置区域代理成功");
						getTable();
					} else {
						layer.msg(res.msg);
					}
				})
			})
		}else if(obj.event === 'canAgent') {
			//重置密码
			layer.confirm("确定取消区域代理？", {
				icon: 0,
				title: "提示"
			}, function(index) {
				var parms = {
					id: oldId
				}
				reqAjaxAsync(USER_URL.CANCELAGENCCY, JSON.stringify(parms)).done(function(res) {
					if(res.code == 1) {
						layer.close(index);
						layer.alert("取消区域代理成功");
						getTable();
					} else {
						layer.msg(res.msg);
					}
				})
			})
		}  else if(obj.event === 'replenishment') {
			//补填
			layer.open({
				title: ['补填营业执照', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#replenishment'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['850px', '360px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				btn: ['保存'],
				end: function() {
					$('#replenishment').hide();
					$('#uploadImg3').attr('src', 'img/upload.png')
					$('#uploadImg4').attr('src', 'img/upload.png')
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
		} else if(obj.event === 'setAgreement'){
            layer.confirm("是否为商户【"+data.orgName+"】签订协议？", {
                icon: 0,
                title: "提示"
            }, function(index) {
                var parms = {
                    id: oldId
                }
                reqAjaxAsync(USER_URL.UPDATEAGREEMENT, JSON.stringify(parms)).done(function(res) {
                    if(res.code == 1) {
                        layer.close(index);
                        layer.alert("签订协议成功");
                        getTable();
                    } else {
                        layer.msg(res.msg);
                    }
                })
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
	function getTable(username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular,isRegionalAgent,trade,isAgreement) {
		var initPage = objs.tablePage;
		var initTable = objs.tableIns;
		var res = pageCallback(1, 15, username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular,isRegionalAgent,trade,isAgreement);
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
				var resTwo = pageCallback(obj.curr, obj.limit, username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular,isRegionalAgent,trade,isAgreement);
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
	function getSources () {
        var paramSource = {
            page: 1,
            rows: 999,
        };
        reqAjaxAsync(USER_URL.WORKSOURCE,JSON.stringify(paramSource)).then(function (res) {
            if(res.code == 1){
                var wHtml = "<option value=''>--请选择来源--</option>";
                var datas = res.data;
                for(var i = 0, len = datas.length; i < len; i++) {
                    wHtml += '<option value="'+datas[i].id+'">'+datas[i].name+'</option>'
                }
                $('#orderSource').html(wHtml);

            }
        })
    }
    getSources();
	//商户升级
	$("#merchantUp").on("click", function() {
		var indx = $('#noAudit').find("tr.layui-table-click").index();
		var merchantId = $('#noAudit').find("tr.layui-table-click").find(".merchantId").text();
		var phone = $('#noAudit').find("tr.layui-table-click").find(".laytable-cell-1-orgName").text();
		var tatus = $('#noAudit').find("tr.layui-table-click").find(".laytable-cell-1-lockName").text();

		if(indx == -1) {
			layer.msg("请选中表中的行");
		} else {
			if(tatus == "是") {
				layer.msg("锁定状态不能升级哟")
			} else {
				locked = true;
				layer.open({
					title: ['商户升级', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#updateDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['80%', '80%'],
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
						$("#paypayName").val("")
						$("#paypayAccount").val("")
                        $('#moneyRemark,#orderSource').val('');
                        $('input[name="moneyMode"]:eq(1)').prop('checked',true);
                        $('#recommendUserName').val('').prev().val('')
						$('#paymentName').val("");
                        form.render();
						sessionStorage.removeItem("referrerId");
					},
					success: function(layero, index) {
						//给保存按钮添加form属性
						$("div.layui-layer-page").addClass("layui-form");
						$("a.layui-layer-btn0").attr("lay-submit", "");
						$("a.layui-layer-btn0").attr("lay-filter", "formdemoOne");
						//商户昵称
						$("#merrName").val(phone);
						//商户等级
						$('#orgLevelUp').val(dataTr.levelName);
						//加载商户
						var dataList = {
							page: 1,
							rows: 10
						}
						var timeList = {
							merchantId:merchantId
						}

						reqAjaxAsync(USER_URL.GETCHARGELEVELBY,JSON.stringify(timeList)).then(function(res){
							if(res.data){
                                $('#createTimeUp').val(res.data.createTime);
                                $('#endTimeUp').val(res.data.endTime);
							}
						})

						reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify(dataList)).done(function(res) {
							if(res.code == 1) {
								var lHtml = "";
								for(var i = 0, len = res.data.length; i < len; i++) {
									lHtml += '<option data-money="' + res.data[i].amount + '" value="' + res.data[i].id + '">' + res.data[i].levelName + "/" + res.data[i].numValidDays + "天/" +res.data[i].amount + "元" + '</option>'
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
							$("#yyname").val(0);
							$(".inputhide").css("display", "block");
							$(".inputhide").css("z-index", 33);
							$("#recommend").attr("data-type", 0);
							$("#recommend").attr("placeholder", "请选择推荐人");

						});
                        getShareName(dataTr.appUserId).done(function (res) {
							if(res.code == 1){
								if(res.data){
                                    $('#recommendUserName').val(res.data.appUserName||'').prev().val(res.data.appUserId||'').prev().val(res.data.orgLevel)
                                    $('#userNow').html('当前分享人：' + res.data.appUserName||'')
									$('#recommendUserBtn').hide();
								}else{
                                    if(dataTr.hasOwnProperty('recommendUserName')){
                                        $('#recommendUserName').val(dataTr.recommendUserName||'').prev().val(dataTr.recommendUserId||'').prev().val(dataTr.orgLevel)
                                        $('#userNow').html('当前分享人：'+dataTr.recommendUserName||'')
                                        $('#recommendUserBtn').show();
                                    }
								}

							}else{

							}
                        })


					},
					yes: function(index, layero) {
						form.on('submit(formdemoOne)', function(data) {
							if(data) {
								var upgradeType = $("#updateTypebox").find("dl dd.layui-this").attr("lay-value");
								var datatype = $("#recommend").attr("data-type"); //1-内部 2- 非内部
								var payerName = $.trim($("#payName").val());
								var payerNo = $.trim($("#payAccount").val());
								var sourcees = $('#orderSource').val();
								var moneyRemark = $.trim($("#moneyRemark").val());
								// var moneyMode = $('#paymentName').val();
								var shareUserId = $('#recommendUserId').val()||0;
								var shareUserLevel = $('#orgLevel').val()||-2;
								var appUserId = dataTr.appUserId;
								// var shareUserLevel
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
								};
								if(referrerId==null){
									referrerId=-1
								}
								var param = {
									referrerId: referrerId, //推荐人ID
									merchantId: merchantId, //商户id
									chargeLevelTypeId: upgradeType, //升级类型
									payerName: payerName,
									payerNo: payerNo, //打款账户（银行卡号/支付宝账号）
                                    appUserId:appUserId,
                                    source:sourcees,//商户来源
                                    moneyRemark:moneyRemark,//打款备注
                                    // moneyMode:moneyMode,//打款方式
                                    shareUserId:shareUserId,//分享人id
                                    shareUserLevel:shareUserLevel,//分享人等级
                                    payeeType:$('input[name="payeeType"]:checked').val()
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
	//重新选择分享人
	$('#recommendUserBtn').bind('click',function () {
		var demo = $('#recommendUserTip')
        layer.open({
            title: ['分享人', 'font-size:12px;background-color:#0678CE;color:#fff'],
            type: 1,
            content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['850px', '460px'],
            closeBtn: 1,
            btn: [],
            shade: [0.1, '#000'],
            end: function () {
                demo.hide().find('input').val('');
            },
			success:function (layero,index) {
                getTable();
            	function getTable() {
                    tableInit('recommendUserTab', [
                            [{
                                title: '序号',
                                align: 'left',
                                field: 'eq',
                                width: 80,

                            }, {
                                title: '手机号',
                                align: 'left',
                                field: 'phone',
                                width: 150,

                            }, {
                                title: '商户名',
                                align: 'left',
                                field: 'orgName',
                                width: 200,

                            }, {
                                title: 'App用户昵称',
                                align: 'left',
                                field: 'appUserName',
                                width: 150,

                            }, {
                                title: '操作',
                                align: 'left',
                                field: 'yyptPhone',
                                toolbar:'#barDemoUser',
                                width: 120,

                            }]
                        ],
                        pageCallbackRecommend, 'laypageUser'
                    );
                }
                function pageCallbackRecommend(page,rows){
                	var orgName =$.trim($('#recommendOrgName').val())|| '';
					var phone = $.trim($('#recommendUserPhone').val())||'';
					var params={
						page:page||1,rows:rows||15,
                        orgName,phone
					}
                    return getUserData(USER_URL.SHAREUSERlIST,JSON.stringify(params))

				}
                function getUserData(cmd,param) {
                	var res = reqAjax(cmd,param);
                    console.log(res)
                	if(res.code==1){
                		let data = res.data;

                		$.each(data,function (i, item) {
                            $(item).attr('eq', (i + 1));
                        })
					}
                	return res;
                }
                $('#toolSearch2').click(function () {
                    getTable();
                })
                $('#toolRelize2').click(function () {
                	$(this).parent().find('input').val('');
                    getTable();
                })
                table.on('tool(recommendUserTab)',function (obj) {
					if(obj.event == 'ok'){
						console.log(obj.data)
                        $('#recommendUserName').val(obj.data.appUserName).prev().val(obj.data.appUserId).prev().val(obj.data.orgLevel)
						layer.close(index);

					}
                })
            }
        })

    })
	//商户续费
	$("#merchantPay").on("click", function(e) {
		var data = $(this).data('tableData');
		if(!data) {
			layer.msg("请选中表中的行");
		} else {
			var orgLevel = data.orgLevel || "";
			if(orgLevel == 1){
				layer.msg("普通商户无法续费！");
				return
			}
			var merchantId = data.merchantId || "";
			var phone = data.phone || "";
			var orgName = data.orgName || "";
			var locked = data.locked || "";
			var orgLevelName = data.orgLevelName ||"";
			var orgLevel = data.orgLevel || "";
			if(locked == 1) {
				layer.msg("锁定状态不能续费哟")
			} else {
				layer.open({
					title: ['商户续费', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#payDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['850px', '460px'],
					closeBtn: 1,
					shade: [0.1, '#fff'],
					btn: ['保存'],
					end: function() {
						$('#payDemo').hide();
						$("#paypayName").val("");
						$("#paypayAccount").val("");
						$("#payrecommend").val("");
						$(".infoReaves").hide();
						$(".inputarea").css("height", "38px");
						$(".inputReave").addClass("flex");
						$(".inputReave").show();
						$("#paypayName").val("")
						$("#paypayAccount").val("")
						sessionStorage.removeItem("referrerId");
					},
					success: function(layero, index) {
						//给保存按钮添加form属性
						$("div.layui-layer-page").addClass("layui-form");
						$("a.layui-layer-btn0").attr("lay-submit", "");
						$("a.layui-layer-btn0").attr("lay-filter", "formdemoOne");
						var parm = '{"page":1,"rows":10}';
						reqAjaxAsync(USER_URL.CHARGELEVE,parm).then(function(res){
							var data = res.data;
							var redata = data[orgLevel-1];
							$('#paymoney').val(redata.amount);
							var myHtml = ""
							$.each(data, function(i,item) {
								if(orgLevelName == item.levelName){
									myHtml = ""+orgLevelName+"/"+item.numValidDays +"天/"+item.amount+"元"
								}
							});
							//加载商户
							$('#payupdateType').val(myHtml);
						})
						
						var timeList = {
							merchantId:merchantId
						}
						
						reqAjaxAsync(USER_URL.GETCHARGELEVELBY,JSON.stringify(timeList)).then(function(res){
							$('#createTimeDon').val(res.data.createTime);
							$('#endTimeDon').val(res.data.endTime);
							if(res.data.orgLevel == '1'){
								$('#orgLevelDon').val('普通商户')
							}else if(res.data.orgLevel == '2'){
								$('#orgLevelDon').val('合作商户')
							}else if(res.data.orgLevel == '3'){
								$('#orgLevelDon').val('代理商户')
							}
						})
						
						//商户昵称
						$("#paymerrName").val(orgName);
						
						
						//加载相关升级信息例如推荐人等
						var dataLi = "{'merchantId':" + merchantId + "}";
						reqAjaxAsync(USER_URL.UPDATEINFO, dataLi).done(function(res) {
							$("#yyname").val(0);
							$(".inputhidepay").css("display", "block");
							$(".inputhidepay").css("z-index", 33);
							$("#recommend").attr("data-type", 0);
							$("#recommend").attr("placeholder", "请选择推荐人");

						});
					},
					yes: function(index, layero) {
						form.on('submit(formdemoOne)', function(data) {
							if(data) {
								var upgradeType = $("#updateTypebox").find("dl dd.layui-this").attr("lay-value");
								var datatype = $("#recommend").attr("data-type"); //1-内部 2- 非内部
								var payerName = $.trim($("#paypayName").val());
								var payerNo = $.trim($("#paypayAccount").val());
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
								};
								if(referrerId==null){
									 referrerId=-1;
								};

								
								var param = {
									referrerId: referrerId, //推荐人ID
									merchantId: merchantId, //商户id
									payerName: payerName,
									payerNo: payerNo //打款账户（银行卡号/支付宝账号）
								}
									reqAjaxAsync(USER_URL.RECHARGEAPPLY, JSON.stringify(param)).done(function(res) {
										if(res.code == 1) {
											layer.msg(res.msg);
											layer.close(index);
											var username = $.trim($("#phone").val());
											var locked = $("#statusSelector").val();
											var provinceId = $("#provinceSelector1").val();
											var cityId = $("#citySelector1").val();
											setTimeout(function() {
												getTable(username, locked, provinceId, cityId);
											}, 500);
										} else {
											layer.msg(res.msg);
											layer.close(index);
										}
									});
							}
							return false;
						})
					}
				})
			}
		}
	});

	//textarea点击再次激活layer
	//获取信息之后textarea 点击
	$('#yyname').on('click', function() {
		setTimeout(reClick("#yyname"), 500);
	})
    //开始点击
    $(".inputhide").bind('click',function() {
        //延时弹出
        setTimeout(reClick("#yyname"), 500);
    });
	$('#payyyname').on('click', function() {
		setTimeout(reClick("#payyyname"), 500);
	})
	//商户续费点击
    $(".inputhidepay").click(function() {
        //延时弹出
        setTimeout(reClick("#payyyname"), 500);
    });

	//商户新增
	$("#addMervhant,#addModel").on("click", function() {
		var type = $(this).attr('data-type');
		layer.open({
			title: ['商户新增', 'font-size:12px;background-color:#0678CE;color:#fff'],
			type: 1,
			offset: '80px',
			content: $('#oneDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: ['900px', '720px'],
			closeBtn: 1,
			shade: [0.1, '#fff'],
			btn: ['下一步'],
			end: function() {
				$('#oneDemo').hide();
				$('#realName').val("");
				$('#idNum').val("");
				$("#uName").val("");
				$("#onepwd").val("");
				$("#onedesig").val("");
				$("#udesig").val("");
				$("#udesigName").val("");
				$("#upwd").val("");
				$("#oneName").val("");
				$("#uploadImg1").attr("src", "img/upload.png");
				$("#uploadImg2").attr("src", "img/upload.png");
				$("#uploadImg01").attr("src", "img/upload.png");
				$("#uploadImg02").attr("src", "img/upload.png");
				$("#uploadImg03").attr("src", "img/upload.png");
				$('.xiadan_box').hide();
                xuan = 1;
			},
			success: function(layero, index) {
				//给保存按钮添加form属性
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit", "");
				$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
				//加载类型以及所属行业
				$(".looktit").show();
				reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
					if(res.code == 1) {
						var row = res.data.merchantTrade;
                        var rows = res.data.regularTypeList;
						//行业
						var bHtml = "";
						var thtml = '';
						$.map(row, function(n, index) {
							bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
						})
                        $.map(rows, function(n, index) {
                            thtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
                        })

                        if(!type){//演示就锁定type
                            $('#uType').html(thtml).removeAttr('disabled');
						}else{
                            $('#uType').attr('disabled',true).html(thtml).val(5)
						}
						$("#uBussiness").html(bHtml)
                        setSctradeById($("#uBussiness").val())
						form.render();
					} else {
						layer.msg(res.msg);
					}
				});

                //账号判断
                if(type === undefined){//演示就不判断手机号码是否正确
                    $("#uName").blur(function() {
                        var num = $(this).attr("data-num");
                        var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
                        if(!mobileExp.test($(this).val())) {
                            if(num == 0) {
                                $(this).val("");
                                $(this).attr("data-num", "1");
                                layer.msg("账号请输入正确的手机号",
                                    function(index) {
                                        $("#uName").attr("data-num", "0");
                                        layer.close(index);
                                    });
                                return false;
                            }
                        }
                        $("#oneName").val($(this).val());
                    });
                }else{
                    $("#uName").blur(function() {
                        var num = $(this).attr("data-num");
                        var ysExp = /^[_a-zA-Z0-9]+$/; //演示正则
                        if(!ysExp.test($(this).val())) {
                            if(num == 0) {
                                $(this).val("");
                                $(this).attr("data-num", "1");
                                layer.msg("账号请输入正确的账号",
                                    function(index) {
                                        $("#uName").attr("data-num", "0");
                                        layer.close(index);
                                    });
                                return false;
                            }
                        }
                        $("#oneName").val($(this).val());
                        return false;
                    });
				}
				
					reqAjaxAsync(USER_URL.TEMPLET, "").done(function(res) {
							var row = res.data;
							//模板
							var bHtml = "";
							$.map(row, function(n, index) {
								bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
							})
							$("#industry").html(bHtml);
							form.render();
					});				

				//加载省市
				getCity(0);
				var cod = $("#addMervhant").attr("data-cid");
				getCity(cod);
				//根据省的选择切换对应的市内容
				form.on('select(provinceSelector2)', function(data) {
					var val = data.value;
					getCity(val);
				});




			},
			yes: function(index, layero) {

				form.on('submit(formdemo2)', function(data) {

					if(data) {
						var appUserPhone = $.trim($("#uName").val());
						var appUserPass = $.trim($("#onepwd").val());
						var appUserName = $.trim($("#onedesig").val());
						var appUerSex = $("#uTypeBoxs dl dd.layui-this").text();
						var orgName = $.trim($("#udesig").val());
						var merchantUserName = $.trim($("#udesigName").val());
						var mercgantPass = $.trim($("#upwd").val());
						var merchantRegular = $("#uTypebox dl dd.layui-this").attr("lay-value");
						var merchantTrade = $("#uBussinessbox dl dd.layui-this").attr("lay-value");
						var templateId=$("#industryBox dl dd.layui-this").attr("lay-value");//行业模板
						var prId = $('#provinceSelector2').val();
						var cId = $('#citySelector2').val();
						var realname = $.trim($("#realName").val());
						var idNum = $.trim($("#idNum").val());
						var idFront = $("#uploadImg01").attr("src"); //身份证正面
						var idback = $("#uploadImg02").attr("src"); //身份证反面
						var hanid = $("#uploadImg03").attr("src"); //手持身份证
						var bussfront = $("#uploadImg1").attr("src"); //营业执照正面
						var handbuss = $("#uploadImg2").attr("src"); //手持营业执照
						var nameExp = /^[\u4e00-\u9fa5a-zA-Z]+$/; //中文或者英文
						var nameEp = /^[\u4E00-\u9FA5]{2,10}$/; //真实姓名
						var idcard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //身份证
						var pay = $.trim($("#pay").val()); //是否生活缴费


						if(idFront == "img/upload.png") {
							layer.msg("请上传身份证正面照");
							return;
						};

						if(idback == "img/upload.png") {
							layer.msg("请上传身份证反面照");
							return;
						};

						if(hanid == "img/upload.png") {
							hanid = ''
						};
						if(bussfront=='img/upload.png'){//y营业执照正面
							bussfront=null
						};
						if(handbuss=='img/upload.png'){
							handbuss=null
						};

						if(!nameExp.test(merchantUserName)) {
							layer.msg("商户昵称必须为中文或者英文");
							return;
						}

						if(!nameEp.test(realname)) {
							layer.msg("请填写正确的真实姓名");
							return;
						}

						if(!idcard.test(idNum)) {
							layer.msg("请填写正确的身份证号");
							return;
						}

						if(appUserPass.length < 6) {
							layer.msg("请输入6-12位长度的平台用户密码");
							return;
						};
						if(appUserPass.length > 12) {
							layer.msg("请输入6-12位长度的平台用户密码");
							return;
						}

						if(mercgantPass.length < 6) {
							layer.msg("请输入6-12位长度的商户密码");
							return;
						};
						if(mercgantPass.length > 12) {
							layer.msg("请输入6-12位长度的商户密码");
							return;
						}
						var pram2 = {
							provinceId: prId,
							cityId: cId, //市
							appUserPhone: appUserPhone, //app手机号，平台账号和商户管理员账号
							appUserPass: appUserPass, //app用户密码
							appUserName: appUserName, //app用户昵称
							appUserSex: appUerSex, //app用户性别
							orgName: orgName, //商户名
							merchantPass: mercgantPass, //商户密码
							merchantUserName: merchantUserName, //商户管理员昵称
							merchantRegular: merchantRegular, //商户类型
							merchantTrade: merchantTrade, //所属行业
							templateId:templateId,//行业模板
							name: realname, //真实姓名
							identificationNo: idNum, //身份证号
							cardFrontPhoto: idFront, //身份证正面
							cardBackPhoto: idback, //身份证反面
							cardHoldPhoto: hanid, //手持身份证
							licenseFront: bussfront, //营业执照正面
							licenseHold: handbuss, //营业执照手持
							isBusinessPayment: pay //是否生活缴费

						}
                        if(xuan < 1){
                            layer.msg('请至少选择一项下单类型', {
                                icon: 2,
                                anim: 6,
                            });
                            return false
                        }else{
                            var set1 = $('#set1')[0].checked?pram2.set1=1:pram2.set1=0;
                            var set2 =  $('#set2')[0].checked?pram2.set2=1:pram2.set2=0;
                            var set3 = 0;
                            var set4 = 0;
                            var set5 = 0;
                            if(set2 == 1){
                                set3 = $('input[name="set3"]:checked').val();
                                set4 = $('input[name="set4"]:checked').val();
                                set5 = $('input[name="set5"]:checked').val();
                            }
                            pram2.set3 = set3
                            pram2.set4 = set4
                            pram2.set5 = set5
                        }
						reqAjaxAsync(USER_URL.ADDONE, JSON.stringify(pram2)).done(function(res) {
							if(res.code == 1) {
								layer.msg(res.msg);
								layer.close(index);
								var sysUserId = res.data; //app用户ID
								$("#addMervhant").attr("data-sysId", sysUserId);
								//第二步
								layer.open({
									title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
									type: 1,
									content: $('#secondDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
									area: ['850px', '500px'],
									closeBtn: 1,
									btn: ['下一步'],
									shade: [0.1, '#fff'],
									end: function() {
										$('#secondDemo').hide();
										$('#addName').val("");
										$('#fixdepartment').val("");
										$('#addnote').val("");
									},
									success: function(layero, index) {
										//给保存按钮添加form属性
										$("div.layui-layer-page").addClass("layui-form");
										$("a.layui-layer-btn0").attr("lay-submit", "");
										$("a.layui-layer-btn0").attr("lay-filter", "formdemo3");
										//频道类型
										var raw = reqAjax(USER_URL.CONFIG, "");
										if(raw.code == 1) {
											var data = raw.data.cmsChannelList;
											var sHtmldept = '';
											$.each(data, function(i, item) {
												sHtmldept += "<option value='" + item.channelId + "'>" + item.channelName + "</option>";
											});
											$('#fixdepartment').html(sHtmldept);
											form.render();
										} else {
											layer.msg(raw.msg);
										}
									},
									yes: function(index, layero) {
										//form监听事件
										form.on('submit(formdemo3)', function(data) {
											if(data) {
												var id = $("#addMervhant").attr("data-sysId");
												var subscriptionName = $.trim($("#addName").val()); //头条名
												var subscriptionTypeId = $("#subscription").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //头条类型ID
												var subscriptionSynopsis = $.trim($("#addnote").val());
												var pam = {
													sysUserId: id,
													subscriptionName: subscriptionName, //公众号名
													subscriptionTypeId: subscriptionTypeId, //公众号类型ID
													subscriptionSynopsis: subscriptionSynopsis //公众号简介
												}
												reqAjaxAsync(USER_URL.ADDSECOND, JSON.stringify(pam)).done(function(res1) {
													if(res1.code == 1) {
														layer.msg(res.msg);
														layer.close(index);
														var sysUserId1 = res1.data; //app用户ID
														$("#addMervhant").attr("data-sysId1", sysUserId1);
														//第三步
														layer.open({
															title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
															type: 1,
															content: $('#userDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
															area: ['850px', '450px'],
															closeBtn: 1,
															btn: ['下一步'],
															shade: [0.1, '#fff'],
															end: function() {
																$('#userDemo').hide();
															},
															success: function(layero, index) {
																//给保存按钮添加form属性
																$("div.layui-layer-page").addClass("layui-form");
																$("a.layui-layer-btn0").attr("lay-submit", "");
																$("a.layui-layer-btn0").attr("lay-filter", "formdemo4");
															},
															yes: function(index, layero) {
																//form监听事件
																form.on('submit(formdemo4)', function(data) {
																	if(data) {
																		var sysUserId1 = $("#addMervhant").attr("data-sysId1");
																		var balance = $.trim($("#addmoney").val());
																		//金额正则
																		/*var mony = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
																		if(!mony.test(balance)){
																		    layer.alert("请输入正确的金额");
																		    $("#addmoney").val("");
																		    return;
																		}*/
																		var pm = {
																			sysUserId: sysUserId1,
																			balance: balance
																		}
																		reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pm)).done(function(res2) {
																			if(res2.code == 1) {
																				layer.msg(res2.msg);
																				layer.close(index);
																				var oldId = res2.data;
																				$("#addMervhant").attr("data-sysId2", oldId);
																				//第四步
																				layer.open({
																					title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
																					type: 1,
																					content: $('#thirdDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
																					area: ['850px', '600px'],
																					closeBtn: 1,
																					btn: ['保存'],
																					shade: [0.1, '#fff'],
																					offset: '100px',
																					end: function() {
																						$('#thirdDemo').hide();
																					},
																					success: function(layero, index) {
																						//角色名称
																						var pm1 = {
																							page: page,
																							rows: 15
																						}
																						var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
																						if(res01.code == 1) {
																							var datarole = res01.data;
																							var sHtmldept = '';
																							$.each(datarole, function(i, item) {
																								sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
																							});
																							$('#mervchantRole').html(sHtmldept);
																							$('#mervchantRole').find("li").eq(0).addClass("aee");
																							var roleName = $('#mervchantRole').find("li.aee").text();
																							getTree(roleName);
																							$('#mervchantRole').on("click", "li", function() {
																								var name = $(this).text();
																								$('#mervchantRole li').removeClass("aee");
																								$(this).addClass("aee");
																								getTree(name);
																							});
																						} else {
																							layer.msg(res01.msg);
																						}
																					},
																					yes: function(index, layero) {
																						var odId = $("#addMervhant").attr("data-sysId2");
																						var pram = {
																							sysUserId: odId
																						}
																						reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
																							if(res3.code == 1) {
																								layer.msg(res3.msg);
																								layer.close(index);
																								var username = $.trim($("#phone").val());
																								var locked = $("#statusSelector").val();
																								var provinceId = $("#provinceSelector1").val();
																								var cityId = $("#citySelector1").val();
																								getTable(username, locked, provinceId, cityId);
																							} else {
																								layer.msg(res3.msg);
																							}
																						})
																					}

																				})

																				//4end
																			} else {
																				layer.msg(res2.msg);
																			}
																		});
																	}
																	return false;
																})
															}
														})
														//3end
													} else {
														layer.msg(res1.msg);
													}
												})
											}
											return false;
										});
									}
								})
								//2end
							} else {
								layer.msg(res.msg);
							}
						})
					}
					return false; //阻止刷新页面
				})
			}
		})
	});

	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200);
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click', function() {
		var username = $.trim($("#phone").val());
		var locked = $("#statusSelector").val();
		var provinceId = $("#provinceSelector1").val();
		var cityId = $("#citySelector1").val();
		var usercode = $.trim($("#usercode").val());
		var orgName = $.trim($('#orgNamee').val());
		var orgLevel = $.trim($('#orgLevele').val());
		var regular = $.trim($('#regulare').val());
		var isRegionalAgent =  $.trim($('#isAgent').val());
		var trade = $.trim($('#allTrade').val());
		var isAgreement =  $.trim($('#isAgreementSelector').val());
		getTable(username, locked, provinceId, cityId, usercode, orgName, orgLevel, regular,isRegionalAgent,trade,isAgreement);
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
		$('#isAgent').val("")
		$('#allTrade').val("")
		$('#isAgreementSelector').val('');
		getTable();
	});
	
	//激活再次点击
	function reClick(objDom) {
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
								align: 'left',
								field: 'eq',
								width: 80,
								event: 'changetable'
							}, {
								title: 'APP用户昵称',
								align: 'left',
								field: 'appUserNickName',
								width: 150,
								event: 'changetable'
							}, {
								title: 'APP用户手机',
								align: 'left',
								field: 'appUserPhone',
								width: 200,
								event: 'changetable'
							}, {
								title: '平台用户昵称',
								align: 'left',
								field: 'yyptNickName',
								width: 150,
								event: 'changetable'
							}, {
								title: '平台用户手机',
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
							skin: 'row',
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
							appUserPhone: appUserPhone,
                            yyptNickName:$.trim($('#yyptNickName').val())||''
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
					$('#toolRelize1').click(function () {

                        $(this).parents('.input-group').find('input').val('');
                        getTip();
                    })

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
					//填入推荐
					$(objDom).val("平台用户昵称：" + sessionStorage.getItem("yyptNickName") + "；平台用户手机：" + sessionStorage.getItem("yyptPhone") + "；APP用户昵称：" + sessionStorage.getItem("appUserNickName") + "；APP用户手机：" + sessionStorage.getItem("appUserPhone"));
					layer.close(index);
				}
			})
		}

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

	//上传图片
	uploadOss({
		btn: "uploadImg01",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg02",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg03",
		flag: "img",
		size: "5mb"
	});
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
})(jQuery);