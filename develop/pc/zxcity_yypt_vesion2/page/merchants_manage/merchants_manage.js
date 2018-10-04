var element,userno,dataTr;
layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function() {
	    form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		element = layui.element,
		userno = sessionStorage.getItem('userno') || "",
        dataTr = {};

	var USER_URL = {
		RESOURLIST: 'operations/newMerchantListPage', //(查询列表)
		LOCK: 'operations/lockedMerchant', //(锁定商户/启用商户)
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		UPDATE: 'operations/updateMerchantUser', //修改商户信息
		ADDONE: 'operations/addAppuserAndMerchantInfo', //添加商户信息(第一步)
		CONFIG: 'operations/getSysConfigList ', //获取系统信息接口(计费类型,行业类型,公众号类型)
		TEMPLET: 'operations/getAllMerchantTradeTemplateList', //行业模板接口
		ADDSECOND: 'operations/addCMSInfo', //第二步
		INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
		ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
		ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
		ADDTHIRD: 'operations/addAppUserAccountInfo', //(第三部)
		ADDFORTH: 'operations/addMerchantRolePermissionInfo', //(第四步)
		RESETPWD: 'operations/resetMerchantPassword', //(重置)
		CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
		UPDATEINFO: 'operations/findMerchantReferrals', //(查找商户推荐人是否为公司员工)
		UPGRADE: 'operations/merchantUpgradeApply', //商户升级'
		GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取所有推荐关系为公司员工的列表并分页
		RECHARGEAPPLY: 'operations/merchantRechargeApply', //续费申请提交
		GETCHARGELEVELBY: 'operations/getChargeLevelByMerchantId', //升级，续费查时间
		UPDATEAGENCCY: "operations/updateToRegionalAgency", //设置区域代理
		CANCELAGENCCY: "operations/cancelRegionalAgency", //取消区域代理
        UPDATEAGREEMENT:"operations/updateAgreementNumber",//签订协议
        WORKSOURCE:'payZyzz/newZyzzSourcePage',//工单来源
        SHAREUSERlIST:'user/shareUserList',//分享人列表
        SHAREUSERINFO:'user/selShareUserInfo',//查看分享人
        EXCELCMD:'operations/newMerchantList',//导出excel
        QUERYCHARGLOG:'operations/merchantChargeLog',//缴费
        QUERYSHOPINFO:'operations/merchantShopInfo',//店铺
		QUERYADDRESS:'operations/merchantUserAddress',//实名信息
		GETSCTRADEBYID:'operations/getScTradeProcessByMerchantTradeId',//根据行业ID查询行业流程配置

    };
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

	//自定义几种验证
	form.verify({
		IDcard: [
			/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, '请输入正确的身份证'
		],
		realName: [
			/^[\u4E00-\u9FA5]{2,10}$/, "请输入正确的姓名"
		],
		nickName: [
			/^[\u4e00-\u9fa5a-zA-Z]+$/, "只能输入英文或中文"
		],
		password: function(value) {
			if(value.length < 6) {
				return "密码长度不能低于6位"
			}
		}
	});
	$('#searchToggle').click(function () {
		$('#tool-box-ul').slideToggle();
    })
    $('#excelBtn').click(function () {
        var param = {
            phone: $.trim($('#phone').val())||'', //手机号
            orgName: $.trim($('#orgNames').val())||'',
            orgLevel:  $.trim($('#orgLevel').val())||'',
            regular: $.trim($('#mRegular').val())||'',//商户类型
            trade:$.trim($('#allTrade').val())||'',
            merchantStatus: $.trim($('#locked').val())||'', //锁定状态
            provinceId: $.trim($('#provinceSelector1').val())||'', //省
            cityId: $.trim($('#citySelector1').val())||'', // 市
            agreement:$.trim($('#isAgreementSelector').val())||'',//签订协议

            isRegionalAgent: $.trim($('#isAgent').val())||'',
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
    function getShopTabel(merchantId){
        _tableInit('tableShop', [
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
        function pageCallbackShop(index, limit,callback) {
            reqAjaxAsync(USER_URL.QUERYSHOPINFO,JSON.stringify({merchantId:merchantId})).done(function (ress) {
                console.log(ress)
                if(ress.code ==1){
                    var datas = ress.data;
                    var shops =ress.dataExpansion;
                    $.each(datas,function (i, item) {
                        $(item).attr('eq', (i + 1));
                        $(item).attr('tradeName',shops[item.trade]);
                    })
                }
                return callback(ress)
            })


        }
    }
    function getMoneyTabel(merchantId){
        _tableInit('tableMoney', [
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
        function pageCallbackMoney(index, limit,callback) {
            reqAjaxAsync(USER_URL.QUERYCHARGLOG,JSON.stringify({merchantId:merchantId})).done(function (ress) {
                console.log(ress)
                if(ress.code ==1){
                    var datas = ress.data;
                    var shops =ress.dataExpansion;
                    $.each(datas,function (i, item) {
                        $(item).attr('eq', (i + 1));
                        $(item).attr('upgradeTypeName',shops[item.upgradeType]);
                    })
                }
                return callback(ress)
			});
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
				var tHtml =  "<option value=''>--请选择--</option>";
				$.map(rows, function(n, index) {
					tHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
				})
				$("#uType").html(tHtml);
				$('#mRegular').html(tHtml)

				form.render();
	});

    // CHARGELEVE
    reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
        // console.log(res);
        if(res.code ==1){
            var bHtml = "<option value=''>--请选择--</option>";
            var datas = res.data;
            $.map(datas, function(n, index) {
                bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
            })
            $("#orgLevel").html(bHtml);
            form.render();
        }else{
            layer.msg('加载商户等级失败')
        }

        // form.render();
    });
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
                form.render();
            }
        })
    }
    getSources();

	//省市初始化
	function loadProvince(parentcode, prodom, citydom) {
		var param = {
			"parentcode": parentcode
		};
		reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).then(function(res) {
			if(res.code == 1) {
				var row = res.data;
				var sHtml = "";
				$.each(row, function(i, item) {
					sHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
				});
				$("#" + prodom).html(sHtml);
				form.render();
				var citycode = row[0].code || "";
				var cityParam = {
					"parentcode": citycode
				};
				reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(cityParam)).then(function(res) {
					var row = res.data;
					var yHtml = "";
					$.each(row, function(i, item) {
						yHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
					});
					$("#" + citydom).html(yHtml);
					form.render();
					form.on('select(provinceSelector2)', function(data) {
						var v = data.value;
						var cityParam = {
							"parentcode": v
						};
						reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(cityParam)).then(function(res) {
							var row = res.data;
							var mHtml = "";
							$.each(row, function(i, item) {
								mHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
							});
							$("#" + citydom).html(mHtml);
							form.render();
						})
					});
				})
			} else {
				layer.msg(res.msg);
			}
		})
	};
		//省市初始化
	function loadProvince1(parentcode, prodom, citydom) {
		var param = {
			"parentcode": parentcode
		};
		reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).then(function(res) {
			if(res.code == 1) {
				var row = res.data;
				var sHtml = '<option value="">--请选择--</option>';
				$.each(row, function(i, item) {
					sHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
				});
				$("#" + prodom).html(sHtml);
				form.render();
				var citycode = row[0].code || "";
				var cityParam = {
					"parentcode": citycode
				};
				reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(cityParam)).then(function(res) {
					var row = res.data;
					var yHtml ='<option value="">--请选择--</option>';
					$.each(row, function(i, item) {
						yHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
					});
					$("#" + citydom).html(yHtml);
					form.render();
					form.on('select(provinceSelector1)', function(data) {
						var v = data.value;

						if(v!==""){
							$('#citySelector1').attr('disabled',false);
						
							var cityParam = {
								"parentcode": v
							};
							reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(cityParam)).then(function(res) {
								var row = res.data;
								var mHtml = '<option value="">--请选择--</option>';
								$.each(row, function(i, item) {
									mHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
								});
								$("#" + citydom).html(mHtml);
								form.render();
							})
						}
					});
				})
			} else {
				layer.msg(res.msg);
			}
		})
	};
    loadProvince1(0, "provinceSelector1", "citySelector1");
	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
        $('.tool-box-ul').find('input,select').val('')
		$('#citySelector1').html('<option value="">--请选择--</option>');
        form.render();
        tableInit();
	})

	//layer展开
	$('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
		if($(this).children('i.description').html() == '展开') {
			$(this).children('i.description').html('收起')
			$(this).children('i.icon').addClass('deg');
			$(this).parent().siblings('.app-layer-content').children('ul').hide();
			$(this).parent().siblings('.app-layer-content').children('.layer-place').show();
		} else {
			$(this).children('i.description').html('展开')
			$(this).children('i.icon').removeClass('deg');
			$(this).parent().siblings('.app-layer-content').children('ul').show();
			$(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
		}
	})
	$('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
		$(this).hide();
		$(this).siblings('ul').show();
		$(this).parent().siblings().children('.package-some').children('.description').html('展开');
		$(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
	})

	//表格操作
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		var oldId = data.id;
		$('#merchantPay').data('tableData',data);
		$('#upgradeBtn').data('data',data);
		//查看
        dataTr = obj.data;
		if(obj.event === 'view') {
			var el = $('#addLayer');
			layer.open({
				title: ['查看', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定'],
				type: 1,
				anim: 5,
				content: el,
				area: ['60%','70%'],
				end: function() {
                    el.hide();
                    emptyInput(el);
					// $('#addLayer').hide();
					// clearInput(['one', 'two', 'three', 'four', 'five', 'six'])
				},
				success: function(index, layero) {
					console.log(data)
					data['usercode1'] = data.usercode;
					setDatas(el,data);
					el.find('input').attr('readonly','readonly')
                    var timeList = {
                        merchantId:data.merchantId
                    }
                    reqAjaxAsync(USER_URL.GETCHARGELEVELBY,JSON.stringify(timeList)).then(function(res){
                        console.log(res);
                        if(res.data){
                            $('#createTimeSee').val(res.data.createTime);
                            $('#endTimeSee').val(res.data.endTime);
                            $('#orgLevelSee').val(res.data.levelName)
						}
                    });
                    if(data.isBusinessPayment == 0) {
                        $("#ispay").val("否");
                    } else if(data.isBusinessPayment == 1) {
                        $("#ispay").val("是");
                    };

					var parms = {
						"code": data.provinceId
					};
					var cityParms = {
						"code": data.cityId
					};
					reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(parms)).then(function(res) {
						$('#userprovi').val(res.data.areaname);
					})
					reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(cityParms)).then(function(res) {
						$('#usercity').val(res.data.areaname);
					})

				},
				yes: function(index, layero) {
					layer.close(index)
				}
			})
		} else if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定'],
				type: 1,
				anim: 5,
				content: $('#changeDemo'),
				area: ['1400px'],
				end: function() {
					$('#changeDemo').hide();
//					clearInput(['one', 'two', 'three', 'four', 'five', 'six'])
				},
				success: function(index, layero) {
					//给保存按钮添加form属性
					addForm("formdemoChange");
					var usercode=data.usercode;				
					var username = data.username;
					var orgName = data.orgName;					
					var regular = data.regular;
					var trade = data.trade;//行业
					var templet=data.templateId;//模板
					var provinceId = data.provinceId;
					var cityId = data.cityId;
					var locked = data.merchantStatus;
					var payment = data.isBusinessPayment; //是否生活缴费
					$('#changeName').val(data.usercode);//商户账号
					$('#nicname').val(username);//昵称
					$('#orgNamec').val(orgName);//商户名称
					$('#regular').val(regular);//商户类型
					$('#payment').val(payment); //是否生活缴费
					$('#statusType').val(locked);//是否锁定
					
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
					
					//省市初始化
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
					});
					reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(parmm)).then(function(ress){
						var provinceHtml = '',
						cityHtml = '';
						$.each(ress.data, function(i, item) {
							cityHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
						})
						$('#citySelector3').html(cityHtml);
						$('#citySelector3').val(cityId);
						form.render();
					});
					form.on('select(provinceSelector3)', function(data) {
						var v = data.value;
						var cityParam = {
							"parentcode": v
						};
						reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(cityParam)).then(function(res) {
							var row = res.data;
							var mHtml = "";
							$.each(row, function(i, item) {
								mHtml += '<option value="' + item.code + '">' + item.areaname + '</option>'
							});
							$('#citySelector3').html(mHtml);
							form.render();
						})
					});
							
					
				},
				yes: function(index, layero) {
				form.on('submit(formdemoChange)', function(data) {
					if(data) {
						    var userId=sessionStorage.getItem("referrerId");
						    var userno=sessionStorage.getItem('userno');
						    console.log(userno)
							var username = $.trim($("#changeDesig").val()); //用户昵称
							var locked = $('#statusType').val(); //是否锁定
							var id = data.id;
							var nicname = $('#nicname').val();
							var orgName = $('#orgNamec').val();
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
								userno: userno,
								nickname: nicname,
								orgName: orgName,
								regular: regular,
								trade: trade,
								templateId:templet,
								provinceId: provinceId,
								cityId: cityId,
								isBusinessPayment: payment //是否生活缴费
							}
														
								reqAjaxAsync(USER_URL.UPDATE, JSON.stringify(parm)).done(function(res) {
									if(res.code == 1) {
										layer.msg(res.msg);
										layer.close(index);
										tableInit();
									} else {
										layer.msg(res.msg);
										
									}
								})
													
					}
					return false;//禁止刷新
				})					
				}
			})
		}else if(obj.event==='del'){
			//重置密码
			layer.confirm('确认重置密码?',{
				icon:0,
				title:'提示'
			},function(index){
				var parms={
					id:oldId
				};
				reqAjaxAsync(USER_URL.RESETPWD,JSON.stringify(parms)).done(function(res){
					if(res.code==1){
						layer.close(index);
						layer.msg('已重置,默认密码为123456')
					}else{
						layer.msg(res.msg)
					};
				})
			})
		}else if(obj.event==='replenishment'){
			//补填营业执照
			layer.open({
				title: ['补填营业执照', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['保存'],
				type: 1,
				anim: 5,
				content: $('#replenishment'),
				area: ['900px'],
				end: function() {
					$('#replenishment').hide();
					$('#uploadImg6').attr('src', 'img/upload.png')
					$('#uploadImg7').attr('src', 'img/upload.png')
				},
				success: function(index, layero) {
					//给保存按钮添加form属性
					addForm("replenishment");				
				},
				yes: function(index, layero) {
					form.on('submit(replenishment)',function(data){
						if(data){
							var UPDATEMERCHANUSER = "operations/updateMerchantUserLicense"
							console.log(oldId)
							var licenseHold = $('#uploadImg6').attr('src');
							var licenseFront = $('#uploadImg7').attr('src');
							if((licenseHold || licenseFront) == '') {
								layer.msg('请上传相关照片')
							} else {
								var parms = {
									id: oldId,
									licenseHold: licenseHold,
									licenseFront: licenseFront
								};
								reqAjaxAsync(UPDATEMERCHANUSER, JSON.stringify(parms)).done(function(res) {
									if(res.code == 1) {
										layer.close(index);
										layer.alert("更新资料成功");
										tableInit();
									} else {
										layer.msg(res.msg);
									}
								});
							}							
						}
					});
				}
			});			
		}else if(obj.event==='setAgent'){
			//设置区域代理
			layer.confirm('确定设置为区域代理?',{icon:0,title:'提示'},function(index){
				var parms={
					id:oldId
				};
				reqAjaxAsync(USER_URL.UPDATEAGENCCY,JSON.stringify(parms)).done(function(res){
					if(res.code==1){
						layer.close(index);
						layer.msg('设置区域代理成功');
						tableInit();
					}else{
						layer.msg(res.msg)
					}
				})
			})
		}else if(obj.event==='canAgent'){
			//取消区域代理
			layer.confirm('确定取消区域代理?',{icon:0,title:'提示'},function(index){
				var parms={
					id:oldId
				};
				reqAjaxAsync(USER_URL.CANCELAGENCCY,JSON.stringify(parms)).done(function(res){
					if(res.code==1){
						layer.close(index);
						layer.msg('取消区域代理成功');
						tableInit();
					}else{
						layer.msg(res.msg)
					}
				})
			});
		}else if(obj.event === 'setAgreement'){
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
                        tableInit();
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

	//新增商户
	$("#addButton").on('click', function() {
		layer.open({
			title: ['第一步：商户信息', 'font-size:12px;background-color:#424651;color:#fff'],
			btn: ['下一步'],
			type: 1,
			anim: 5,
			content: $('#addMerchant'),
			area: ['60%','80%'],
			end: function() {
				//清空表单
				$('#uType').val("");
				clearInput(['uName', 'udesigName', 'udesig', 'pay', 'uType', 'uBussiness', 'industry', 'oneName', 'onesex', 'onedesig', 'realName', 'idNum']);
				//清空图片
				clearPicSrc(['uploadImg1', 'uploadImg2', 'uploadImg3', 'uploadImg4', 'uploadImg5']);
				$('#addMerchant').hide();
                $('.xiadan_box').hide();
                xuan = 1;
			},
			success: function(index, layero) {
				//给保存按钮添加form属性
				addForm("formdemo2")
				//默认展开第二个
				$('#firstExpree').click();

                setSctradeById($("#trade").val())
                form.render();
				//进度条运动
				setTimeout(function() {
					element.progress('progross', '25%');
				}, 300)
				//加载行业
				loadTrade("uBussiness")
				//行业模板
				loadTemplate("industry")
				//省市初始化,监听省市选择
				loadProvince(0, "provinceSelector2", "citySelector2");
				//监听账号
				monitorAccunt();

			},
			yes: function(index, layero) {
				form.on('submit(formdemo2)', function(passed) {
					if(passed) {
						merchantDone(index, layero);
						tableInit()
					}
				})
			}
		})
	})

	/*商户升级*/
	$("#upgradeBtn").on('click', function() {
		var that = this;
		var indx = $('.app-table').find("tr.layui-table-click").index();
		if(indx!==-1){
			layer.open({
				title: ['商户升级', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['保存'],
				type: 1,
				anim: 5,
				content: $('#upgradeLayer'),
				area:  ['60%','80%'],
				end: function() {
					$('#upgradeLayer').hide();
					//清空表单
                    $('#orderSource').val('')
                    clearInput(['payName','payAccount','recommend']);

				},
				success: function(index, layero) {
					//给保存按钮添加form属性
					addForm("formUpgrade")
					//升级类型
					upgradeType("updateType");
					//绑定信息
					mesBind();
					//推荐人选择
					$("#recommend").on('click', function() {
						reClick();
					});
					
					$("#recommend").attr("data-type", 0);
				},
				yes: function(index, layero) {
					form.on('submit(formUpgrade)', function(passed) {
						if(passed) {
							var upgradeType = $('#updateType').val();
							var datatype = $("#recommend").attr("data-type"); //1-内部 2- 非内部
							var payerName = $('#payName').val();//打款人
							var payerNo = $("#payAccount").val();
                            var moneyRemark = $.trim($("#moneyRemark").val());
                            var shareUserId = $('#recommendUserId').val()||0;
                            var shareUserLevel = $('#orgLevel').val()||-2;
							var ngx = /[\u4e00-\u9fa5]+/;
							if(ngx.test(payerNo)) {
								layer.msg("请输入正确的账户");
								$("#payAccount").val("");
								return false;
							};
							var referrerId = sessionStorage.getItem("referrerId");
							if(referrerId==null){
								referrerId=-1
							};
							var merchantId=sessionStorage.getItem('merchantId');
							var param = {
								referrerId: referrerId, //推荐人ID
								merchantId: merchantId, //商户id
								chargeLevelTypeId: upgradeType, //升级类型
								payerName: payerName,
								payerNo: payerNo, //打款账户（银行卡号/支付宝账号）
                                moneyRemark:moneyRemark,
                                // moneyMode:moneyMode,//打款方式
                                shareUserId:shareUserId,//分享人id
                                shareUserLevel:shareUserLevel,//分享人等级
                                payeeType:$('input[name="payeeType"]:checked').val()
							}							
							reqAjaxAsync(USER_URL.UPGRADE, JSON.stringify(param)).done(function(res) {
								if(res.code == 1) {
									layer.msg(res.msg);
									layer.close(index);
									tableInit();
								} else {
									layer.msg(res.msg);
									layer.close(index);
									
								}

						})				
						}
						return false;
					});
				}
			})
		}else{
			layer.msg('请选择行');
			return;
		}

	});

    //重新选择分享人
    $('#recommendUserBtn').bind('click',function () {
        var demo = $('#recommendUserTip')
		TITLE[0] = '分享人'
        layer.open({
            title: TITLE,
            type: 1,
            content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['45%', '460px'],
            closeBtn: 1,
            btn: [],
            shade: SHADE,
            end: function () {
                demo.hide().find('input').val('');
            },
            success:function (layero,index) {
                getTable();
                function getTable() {
                    _tableInit('recommendUserTab', [
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
                function pageCallbackRecommend(page,rows,callback){
                    var orgName =$.trim($('#recommendOrgName').val())|| '';
                    var phone = $.trim($('#recommendUserPhone').val())||'';
                    var params={
                        page:page||1,rows:rows||15,
                        orgName,phone
                    }
                    reqAjaxAsync(USER_URL.SHAREUSERlIST,JSON.stringify(params)).done(function (res) {
                        if(res.code ==1){
                            let data = res.data;

                            $.each(data,function (i, item) {
                                $(item).attr('eq', (i + 1));
                            })
                            return callback(res)
                        }
                    });
                }

                $('#toolSearch2').click(function () {
                    getTable();
                })
                $('#toolRelize2').click(function () {
                    $(this).parents('.topsearch').find('input').val('');
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
	/*商户续费*/
	$("#merchantPay").on('click', function() {
		var data=$('#merchantPay').data('tableData');
		if(!data){
			layer.msg('请选中行')
		}else{
			var orgLevelName = data._orgLevel ||"";
			var orgLevel=data.orgLevel;
			var merchantId=data.merchantId;
			if(orgLevel==1){
				layer.msg('普通商户无续费');
				return;
			};
			var locked=data.locked;
			if(locked==1){
				layer.msg('锁定状态不能续费哟')
			}else{
				layer.open({
					title: ['商户续费', 'font-size:12px;background-color:#424651;color:#fff'],
					btn: ['保存'],
					type: 1,
					anim: 5,
					content: $('#payDemo'),
					area: ['1400px', "600px"],
					end: function() {
						$('#payDemo').hide();
						//清空表单
						clearInput(['paypayName','paypayAccount','payrecommend']);
						
					},
					success: function(index, layero) {
						//给保存按钮添加form属性
						addForm("formPay");
						//续费类型
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
						});
						$('#paymerrName').val(data.orgName);
						
						var timeList = {
							merchantId:merchantId
						};
						
						reqAjaxAsync(USER_URL.GETCHARGELEVELBY,JSON.stringify(timeList)).then(function(res){
							$('#createTimeDon').val(res.data.createTime);
							$('#endTimeDon').val(res.data.endTime);
						// 	if(res.data.orgLevel == '1'){
						// 		$('#orgLevelDon').val('普通商户')
						// 	}else if(res.data.orgLevel == '2'){
						// 		$('#orgLevelDon').val('合作商户')
						// 	}else if(res.data.orgLevel == '3'){
						// 		$('#orgLevelDon').val('代理商户')
						// 	}
						})
						//推荐人选择
						$("#payrecommend").on('click', function() {
							payClick();
						});
						
//						$("#payrecommend").attr("data-type", 0);
					},yes:function(index, layero) {
						form.on('submit(formPay)', function(passed) {
							if(passed) {					
								var datatype = $("#recommend").attr("data-type"); //1-内部 2- 非内部
								var payerName = $('#paypayName').val();//打款人
								var payerNo = $("#paypayAccount").val();
								var ngx = /[\u4e00-\u9fa5]+/;
								if(ngx.test(payerNo)) {
									layer.msg("请输入正确的账户");
									$("#paypayAccount").val("");
									return false;
								};
								var referrerId = sessionStorage.getItem("referrerId");
								if(referrerId==null){
									referrerId=-1
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
										tableInit()
									} else {
										layer.msg(res.msg);
										layer.close(index);
										
									}
	
							})				
							}
							return false;
						});
					}
				})
				
			};
		};




	})
	$('#toolSearch1').click(function () {
        appTabel()
    })
	$('#restBtn1').click(function () {
		$('#appUserPhone').val('')
        appTabel()
    })
	//pageCallback
	function pageCallbackTip(index, limit, callback) {
		var parms = {
			page: index,
			rows: limit,
			appUserPhone: $('#appUserPhone').val() || ""
		};
		reqAjaxAsync(USER_URL.GETRECOMMEND, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
			});
			return callback(res);
		})
	}

	function refereeTable() {
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
	}

	function reClick(dom) {
		layer.open({
			title: ['推荐人', 'font-size:12px;background-color:#424651;color:#fff'],
			type: 1,
			content: $('#recommendTip'),
			area: ['1400px', "800px"],
			closeBtn: 1,
			btn: ['确定'],
			shade: 0,
			end: function() {
				$('#recommendTip').hide();
			},
			success: function(layero, index) {
                appTabel()

			},
			yes: function(index, layero) {
				layer.close(index)
				//填入推荐
				$("#recommend").val("平台用户昵称：" + sessionStorage.getItem("yyptNickName") + "；平台用户手机：" + sessionStorage.getItem("yyptPhone") + "；APP用户昵称：" + sessionStorage.getItem("appUserNickName") + "；APP用户手机：" + sessionStorage.getItem("appUserPhone"));

			}
		})
	};
	function appTabel(){
        var obja = _tableInit('tableRe', [
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
                    event: 'changetable'
                }, {
                    title: 'APP用户手机',
                    align: 'left',
                    field: 'appUserPhone',
                    event: 'changetable'
                }, {
                    title: '平台用户昵称',
                    align: 'left',
                    field: 'yyptNickName',
                    event: 'changetable'
                }, {
                    title: '平台用户手机',
                    align: 'left',
                    field: 'yyptPhone',
                    event: 'changetable'
                }]
            ],
            pageCallbackTip, 'laypageTip'
        );
        refereeTable();
	}
	function payClick(dom) {
		layer.open({
			title: ['推荐人', 'font-size:12px;background-color:#424651;color:#fff'],
			type: 1,
			content: $('#recommendTip'),
			area: ['1400px', "800px"],
			closeBtn: 1,
			btn: ['确定'],
			shade: 0,
			end: function() {
				$('#recommendTip').hide();
			},
			success: function(layero, index) {
				var obja = _tableInit('tableRe', [
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
							event: 'changetable'
						}, {
							title: 'APP用户手机',
							align: 'left',
							field: 'appUserPhone',
							event: 'changetable'
						}, {
							title: '平台用户昵称',
							align: 'left',
							field: 'yyptNickName',
							event: 'changetable'
						}, {
							title: '平台用户手机',
							align: 'left',
							field: 'yyptPhone',
							event: 'changetable'
						}]
					],
					pageCallbackTip, 'laypageTip'
				);
				refereeTable();
			},
			yes: function(index, layero) {
				layer.close(index)
				//填入推荐
				$("#payrecommend").val("平台用户昵称：" + sessionStorage.getItem("yyptNickName") + "；平台用户手机：" + sessionStorage.getItem("yyptPhone") + "；APP用户昵称：" + sessionStorage.getItem("appUserNickName") + "；APP用户手机：" + sessionStorage.getItem("appUserPhone"));

			}
		})
	}	

	//商户升级-信息绑定
	function mesBind() {
		let data = $("#upgradeBtn").data('data');
		let merchantId = data.merchantId;
		sessionStorage.setItem('merchantId',merchantId)
		let timeList = {
			merchantId: merchantId
		};
		let orgName = data.orgName;
		$('#merrName').val(orgName);
		reqAjaxAsync(USER_URL.GETCHARGELEVELBY, JSON.stringify(timeList)).then(function(res) {
			$('#createTimeUp').val(res.data.createTime);
			$('#endTimeUp').val(res.data.endTime);
			$('#orgLevelUp').val(res.data.levelName)
			// if(res.data.orgLevel == '1') {
			// 	$('#orgLevelUp').val('普通商户')
			// } else if(res.data.orgLevel == '2') {
			// 	$('#orgLevelUp').val('合作商户')
			// } else if(res.data.orgLevel == '3') {
			// 	$('#orgLevelUp').val('代理商户')
			// }
		})
	}

	//商户升级-升级类型
	function upgradeType(dom) {
		var dataList = {
			page: 1,
			rows: 10
		}
		reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify(dataList)).done(function(res) {
			if(res.code == 1) {
				let row = res.data;
				let bHtml = "";
				for(let i = 0; i < row.length; i++) {
					bHtml += '<option data-money="' + row[i].amount + '" value="' + row[i].id + '">' + row[i].levelName + "/" + row[i].numValidDays + "天/" + row[i].amount + "元" + '</option>'
				}
				$("#" + dom).html(bHtml);
				$('#money').val(row[0].amount);
				form.render();
				//监听角色名切换权限
				form.on('select(' + dom + ')', function(data) {
					var money = $(data.elem).find('option:selected').attr('data-money')
					$('#money').val(money);
				});
			} else {
				layer.msg(res.msg);
			}
		});
	}

	//商户yes回调
	function merchantDone(index, layero) {
		var appUserPhone = $.trim($("#uName").val());
		var appUserPass = $.trim($("#onepwd input").val());
		var appUserName = $.trim($("#onedesig").val());
		var appUerSex = $("#onesex").val();
		var orgName = $.trim($("#udesig").val());
		var merchantUserName = $.trim($("#udesigName").val());
		var mercgantPass = $.trim($("#upwd input").val());
		var merchantRegular = $("#uType").val();
		var merchantTrade = $("#uBussiness").val();
		var templateId = $("#industry").val(); //行业模板
		var prId = $('#provinceSelector2').val();
		var cId = $('#citySelector2').val();
		var realname = $.trim($("#realName").val());
		var idNum = $.trim($("#idNum").val());
		var idFront = $("#uploadImg3").attr("src"); //身份证正面
		var idback = $("#uploadImg4").attr("src"); //身份证反面
		var hanid = $("#uploadImg5").attr("src"); //手持身份证
		var bussfront = $("#uploadImg1").attr("src"); //营业执照正面
		var handbuss = $("#uploadImg2").attr("src"); //手持营业执照
		var pay = $.trim($("#pay").val()); //是否生活缴费
		if(idFront == "img/upload.png") {
			layer.msg("请上传身份证正面照");
			return;
		}
		if(idback == "img/upload.png") {
			layer.msg("请上传身份证反面照");
			return;
		}
//		if(bussfront == "img/upload.png") {
//			layer.msg("请上传营业执照正面");
//			return;
//		}
//		if(hanid == "img/upload.png") {
//			layer.msg("请上传手持身份证");
//			return;
//		}
//		if(handbuss == "img/upload.png") {
//			layer.msg("请上传手持营业执照");
//			return;
//		}
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
			templateId: templateId, //行业模板
			name: realname, //真实姓名
			identificationNo: idNum, //身份证号
			cardFrontPhoto: idFront, //身份证正面
			cardBackPhoto: idback, //身份证反面
			cardHoldPhoto: hanid, //手持身份证
			licenseFront: bussfront, //营业执照正面
			licenseHold: handbuss, //营业执照手持
			isBusinessPayment: pay //是否生活缴费
		};
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
				$('body').data("sysUserId", sysUserId) //用户id绑定在body上;
				layer.open({
					title: ['第二步：头条初始化', 'font-size:12px;background-color:#424651;color:#fff'],
					btn: ['下一步'],
					type: 1,
					anim: 5,
					content: $('#addHeadlines'),
					area: ['1400px', '700px'],
					end: function() {
						$('#addHeadlines').hide();
						//清空表单
						clearInput(['addName']);
					},
					success: function(index, layero) {
						//给保存按钮添加form属性
						addForm("formdemo3")
						//进度条运动
						setTimeout(function() {
							element.progress('progross', '50%');
						}, 300)
						//频道类型
						headlinesType("fixdepartment")
					},
					yes: function(index, layero) {
						form.on('submit(formdemo3)', function(passed) {
							var id = $("body").data("sysUserId");
							var subscriptionName = $.trim($("#addName").val()); //头条名
							var subscriptionTypeId = $("#fixdepartment").val(); //头条类型ID
							var subscriptionSynopsis = $.trim($("#addnote").val());
							var pam = {
								sysUserId: id,
								subscriptionName: subscriptionName, //公众号名
								subscriptionTypeId: subscriptionTypeId, //公众号类型ID
								subscriptionSynopsis: subscriptionSynopsis //公众号简介
							}
							reqAjaxAsync(USER_URL.ADDSECOND, JSON.stringify(pam)).done(function(res) {
								if(res.code == 1) {
									layer.close(index);
									layer.open({
										title: ['第三步：个人账户信息初始化', 'font-size:12px;background-color:#424651;color:#fff'],
										btn: ['下一步'],
										type: 1,
										anim: 5,
										content: $('#moneyReset'),
										area: ['1400px','700px'],
										end: function() {
											$('#moneyReset').hide();
											//清空表单
											clearInput(['addmoney']);
										},
										success: function(index, layero) {
											//给保存按钮添加form属性
											addForm("formdemo4")
											$('#addmoney').val(0);
											//进度条运动
											setTimeout(function() {
												element.progress('progross', '75%');
											}, 300)
										},
										yes: function(index, layero) {
											form.on('submit(formdemo4)', function(passed) {
												var sysUserId = $("body").data("sysUserId");
												var balance = $.trim($("#addmoney").val());
												var pam = {
													sysUserId: sysUserId,
													balance: balance
												}
												reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pam)).done(function(res) {
													if(res.code == 1) {
														layer.msg(res.msg);
														layer.close(index)
														var oldId = res.data;
														$("body").data("oldId", oldId);
														layer.close(index);
														layer.open({
															title: ['第四步：商户权限初始化', 'font-size:12px;background-color:#424651;color:#fff'],
															btn: ['完成'],
															type: 1,
															anim: 5,
															content: $('#promissReset'),
															area: ['1400px','90%'],
															end: function() {
																$('#promissReset').hide();
															},
															success: function(index, layero) {
																//进度条运动
																setTimeout(function() {
																	element.progress('progross', '100%');
																}, 300)
																//角色名
																roleNameSelect("roleNameSelect");
																// var roleName = $("body").data("roleName") || "";
																// //角色tree
																// getTree(roleName);
															},
															yes: function(index, layero) {
																var oldId = $("body").data("oldId");
																var pam = {
																	sysUserId: oldId
																}
																reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pam)).done(function(res) {
																	if(res.code == 1) {
																		layer.msg("新增商户成功");
																		layer.close(index);
																		tableInit();
																	} else {
																		layer.msg(res.msg)
																	}
																})
															}
														})

													} else {
														layer.msg(res.msg)
													}
												})
											})
										}

									})
								} else {
									layer.msg(res.msg)
								}
							})
						})
					}
				})
			} else {
				layer.msg(res.msg)
			}
		})
	}


    // roleNameSelect("roleNameSelect");
	//角色名称&监听角色名切换权限
	function roleNameSelect(dom) {
		var p = '{"page":1,"rows":100}';
		reqAjaxAsync(USER_URL.ROLENAME, p).done(function(res) {

			if(res.code == 1) {
				var row = res.data;
				console.log(row)
				$("body").data("roleName", roleName);
				var bHtml = "";


                $.each(row, function(i, item) {
                    bHtml += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
                });
                //
				// $.each(row, function(i, item) {
				// 	bHtml += '<option value=' + item.roleName + '>' + item.roleName + '</option>'
				// })

				$("#" + dom).html(bHtml);

                $('#'+dom).find("li").eq(0).addClass("aee");

				form.render();
				//监听角色名切换权限
				// form.on('select(' + dom + ')', function(data) {
				// 	var roleName = data.value;
				// 	//角色tree
				// 	getTree(roleName);
				// });
                var roleName = $('#'+dom).find("li.aee").text();
                getTree(roleName,'merchant');
                $('#'+dom).on("click", "li", function() {
                    var name = $(this).text();
                    // $('#'+dom).find('li').removeClass("aee");
                    $(this).addClass("aee").siblings().removeClass('aee');
                    getTree(name,'merchant');
                });
			} else {
				layer.msg(res.msg);
			}
		});
	}

	//频道类型
	function headlinesType(dom) {
		reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
			if(res.code == 1) {
				var row = res.data.cmsChannelList;
				var bHtml = "";
				$.map(row, function(n, index) {
					bHtml += '<option value="' + n.channelId + '">' + n.channelName + '</option>'
				})
				$("#" + dom).html(bHtml);
				form.render();
			} else {
				layer.msg(res.msg);
			}
		});
	}

	//监听账号
	function monitorAccunt() {
		$('#uName').on("keyup", function(e) {
			var v = $(this).val();
			if(!isNaN(v)) {
				$('#oneName').val(v);
			} else {
				v = v.substring(0, v.length - 1);
				$(this).val(v);
			}
		})
	}



	//行业模板
	function loadTemplate(dom) {
		reqAjaxAsync(USER_URL.TEMPLET, "").done(function(res) {
			if(res.code == 1) {
				var row = res.data;
				//模板
				var bHtml = "";
				$.map(row, function(n, index) {
					bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
				})
				$("#" + dom).html(bHtml);
				form.render();
			} else {
				layer.msg(res.msg);
			}
		});
	}

	//加载行业
	function loadTrade(dom) {
		reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
			if(res.code == 1) {
				var row = res.data.merchantTrade;
				//行业
				var bHtml = "";
				$.map(row, function(n, index) {
					bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
				})
				$("#" + dom).html(bHtml);
				form.render();
			} else {
				layer.msg(res.msg);
			}
		});
	}

	//清空表单
	function clearInput(inputArr) {
		if(inputArr.constructor == Array) {
			$.each(inputArr, function(i, item) {
				var u = "#" + item;
				$(u).val("")
			})
		} else {
			console.log("请传入数组")
		}
	}
	//清空图片路径
	function clearPicSrc(picSrc) {
		if(picSrc.constructor == Array) {
			$.each(picSrc, function(i, item) {
				var u = "#" + item;
				$(u).prop('src', "img/upload.png")
			})
		} else {
			console.log("请传入数组")
		}
	}

	//给保存按钮添加form属性
	function addForm(filter) {
		$("div.layui-layer-page").addClass("layui-form");
		$("a.layui-layer-btn0").attr("lay-submit", "");
		$("a.layui-layer-btn0").attr("lay-filter", filter);
	}

	//上传图片
	sentImage(["uploadImg1", "uploadImg2", "uploadImg3", "uploadImg4", "uploadImg5","uploadImg6","uploadImg7" ]);

	function sentImage(imgArr) {
		if(imgArr.constructor == Array) {
			$.each(imgArr, function(i, item) {
				uploadOss({
					btn: item,
					flag: "img",
					size: "5mb"
				});
			})
		} else {
			console.log("请传入数组")
		}
	}

	//角色权限方法
	// function getTree(roleName) {
	// 	var setting = {
	// 		check: {
	// 			enable: false,
	// 			chkStyle: "checkbox",
	// 			radioType: "all",
	// 			nocheckInherit: true,
	// 			chkDisabledInherit: true
	// 		},
	// 		data: {
	// 			simpleData: {
	// 				enable: true,
	// 				idKey: "id",
	// 				pIdKey: "pid",
	// 				rootPId: 0
	// 			},
	// 			key: {
	// 				checked: "Checked"
	// 			}
	// 		},
	// 		view: {
	// 			showIcon: true,
	// 			showLine: true
	// 		}
	// 	};
	// 	var data = {};
	// 	var paras = {
	// 		page: 1,
	// 		rows: 1000000,
	// 		roleName: roleName,
	// 		sort: "role_code",
	// 		order: "ASC"
	// 	}
    //
	// 	reqAjaxAsync(USER_URL.ROLEID, JSON.stringify(paras)).then(function(trees) {
	// 		var treeData = trees.data;
	// 		for(var i = 0; i < treeData.length; i++) {
	// 			treeData[i].id = Number(treeData[i].permissionId);
	// 			treeData[i].pid = Number(treeData[i].parentid);
	// 			treeData[i].name = treeData[i].permissionName;
	// 			treeData[i].icon = "";
	// 		}
	// 		treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
	// 		treeObj.expandAll(true);
	// 	})
	// }
    //第三步角色权限
    function getTree(roleName,type) {
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
        if(type == 'app'){
            treeObj = $.fn.zTree.init($("#treedemAPP"), setting, treeData);
            treeObj.expandAll(true);
        }else if(type == 'merchant'){
            treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
            treeObj.expandAll(true);
        }

    }

	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			t_userid: userno,
			phone: $.trim($('#phone').val()) || "",//手机号
			orgName: $.trim($('#orgNames').val()) || "",//商户名
			orgLevel: $.trim($('#orgLevel').val()) || "",//用户等级
			regular: $.trim($('#mRegular').val()) || "",//商户类型
			// locked: $.trim($('#locked').val()) || "",//是否锁定
			trade: $.trim($('#allTrade').val()) || "",//是否锁定
			provinceId:$.trim($('#provinceSelector1').val())||"",//省
			cityId:$.trim($('#citySelector1').val())||"",//省
            merchantStatus:$('#locked').val(),//是否锁定
            agreement:$('#isAgreementSelector').val()||'',//签协议
			
		};
		reqAjaxAsync(USER_URL.RESOURLIST, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			console.log(data)
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
				switch(item.orgLevel) {
					case(1):
						$(item).prop('_orgLevel', '普通商户');
						break;
					case(2):
						$(item).prop('_orgLevel', '合作商户');
						break;
					case(3):
						$(item).prop('_orgLevel', '代理商户');
						break;
				}
				switch(item.regular) {
					case(0):
						$(item).prop('_regular', '正式');
						break;
					case(1):
						$(item).prop('_regular', '测试');
						break;
				}
				switch(item.merchantStatus) {
					case(1):
						$(item).prop('_locked', '否')
						break;
					case(0):
						$(item).prop('_locked', '是')
						break;
				}
				//_isAgreement
                switch(item.isAgreement) {
                    case(0):
                        $(item).prop('_isAgreement', '否')
                        break;
                    case(1):
                        $(item).prop('_isAgreement', '是')
                        break;
                }
				switch(item.isBusinessPayment) {
					case('0'):
						$(item).prop('_isBusinessPayment', '否')
						break;
					case('1'):
						$(item).prop('_isBusinessPayment', '是')
						break;
				}
			});
			return callback(res);
		})
	}

	//当前表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantTable', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 50,
						event: 'eventMes'
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						width: 120,
						event: 'eventMes'
					}, {
						title: '商户名称',
						align: 'left',
						field: 'orgName',
						width: 180,
						event: 'eventMes'
					},
					{
						title: '商户等级',
						align: 'left',
						field: 'levelName',
						width: 100,
						event: 'eventMes'
					}, {
						title: '商户类型',
						align: 'left',
						field: 'regularName',
						width: 80,
						event: 'eventMes'
					}, {
						title: '商户行业',
						align: 'left',
						field: 'tradeName',
						width: 100,
						event: 'eventMes'
					}, {
						title: 'APP用户昵称',
						align: 'left',
						field: 'username',
						width: 120,
						event: 'eventMes'
					}, {
						title: '是否锁定',
						align: 'left',
						field: '_locked',
						width: 80,
						event: 'eventMes'
					},{
						title: '是否签协议',
						align: 'left',
						field: '_isAgreement',
						width: 80,
						event: 'tClick'
					},{
						title: '操作',
						align: 'left',
						toolbar: '#barDemo',
						width: 530,
						event: 'eventMes'
					}
				]
			],
			pageCallback, 'layTablePage'
		)
	}
	tableInit();

	//表格方法
	/* 表格初始化
	 * tableId: 表格容器ID
	 * cols:table配置
	 * pageCallback回调(异步)
	 * pageDomName:分页容器ID
	 */
	function _tableInit(tableId, cols, pageCallback, pageDomName) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full',
			cols: cols,
			page: false,
			even: true,
			limit: 15,
			done: function(res, curr, count) {
				$('body').on('click', '.layui-table-body table tr', function() {
					$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
				})
			}
		});

		//2.第一次加载
		pageCallback(1, 15, function(res) {
			tableIns.reload({
				data: res.data
			})
			//第一页，一页显示15条数据
			layui.use('laypage');
			var page_options = {
				elem: pageDomName,
				count: res ? res.total : 0,
				layout: ['count', 'prev', 'page', 'next', 'limit'],
				limits: [15],
				limit: 15
			}
			page_options.jump = function(obj, first) {
				tablePage = obj;
				//首次不执行
				if(!first) {
					pageCallback(obj.curr, obj.limit, function(resTwo) {
						tableIns.reload({
							data: resTwo.data
						});
					});
				}
			}
			layui.laypage.render(page_options);
			return {
				tablePage,
				tableIns
			};
		});
	}
})