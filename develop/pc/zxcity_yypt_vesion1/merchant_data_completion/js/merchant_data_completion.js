(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno") || "";
	var pid = '';
	var USER_URL = {
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		UPDATE: 'operations/updateMerchantUser', //修改商户信息
		ADDONE: 'operations/addAgentMerchantInfo', //添加商户信息(第一步)
		CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
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
		
		RESOURLIST: 'operations/platformUserList', //(查询状态)
		ADDRESOURCE: 'operations/realNameStatus', //(用户实名认证审核)
		CHANGESTATU: 'operations/userStatusToggle', //(状态启用/0 未锁/1 已锁)
		//  RESOURCESIZE : 'operations/upgradeToMerchant', //(升级为商户)
		UPDATEUSER: 'operations/updateSysUser', //(修改用户信息)
		ADDONEAPP: 'operations/appUserAddMerchantInfo', //升级为商户第一步
		LOOKDETAIL: 'operations/getMerchantRegApplyDetail', //(查看详情)
		ADDSECONDAPP: 'operations/appUserAddCMSInfoApprove', //第二步
		ADDTHIRDAPP:'operations/appUserAddRolePermissionApprove'//第三步

	};
	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

	//tab切换
	$(".tab-title").on("click", 'ul li', function() {
		$(".tab-title ul li").removeClass("active");
		$(this).addClass("active");
		getTbl();
	});

	//渲染表单
	function getTbl() {
		objs = tableInit('tableNo', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80,
					templet: '#titleTpl'
				}, {
					title: '手机号',
					/*sort: true,*/
					align: 'left',
					field: 'phone',
					width: 400
				}, {
					title: '商户名',
					/* sort: true,*/
					align: 'left',
					field: 'orgName',
					width: 400
				},{
					title: '操作',
					fixed: 'right',
					align: 'left',
					toolbar: '#barDemo',
					width: 300
				}]
			],

			pageCallback, 'laypageLeft'
		);
	}

	//初始化
	getTbl();

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
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
		});

		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit) {
		var dUrl = $('.tab-li.active').attr('data-d');
		var merchantPhone = $('#merchantName').val();
		var merchantName = $('#merchant_nickname').val();
		var param = {
			page: index,
			rows: limit,
			phone: merchantPhone,
			orgName: merchantName
		}
		return getData(dUrl, JSON.stringify(param));
	}
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

	table.on('tool(tableNo)', function(obj) {
		var data = obj.data;
		if(obj.event === 'pass') {
			var step = data.step ? data.step : '', //步数
				sysUserId = data.sysUserId,
				log = data.log;
			var parm = {sysUserId:sysUserId};
			if(log === "app用户升级为商户-添加商户信息成功!" || log === 'app用户升级为商户-添加头条信息成功!'){//app
				reqAjaxAsync('operations/findMaxAddAppMerchantLogStep',JSON.stringify(parm)).then(function(res){
					var innerStep = res.data;
					if(step != innerStep){
						 layer.msg("步数不吻合", { icon: 2, shade: [0.1, '#fff'], offset: '50%' })
						 return
					}else{
						doStep(innerStep,2,data);
					}
				})
			}else{//商户
				reqAjaxAsync('operations/findMaxAddMerchantLogStep',JSON.stringify(parm)).then(function(res){
					var innerStep = res.data;
					if(step != innerStep){
						layer.msg("步数不吻合", { icon: 2, shade: [0.1, '#fff'], offset: '50%' })
						 return
					}else{
						doStep(innerStep,1,data);
					}
				})
			}
			

		}
	});
	
	function doStep(step,type,data){
		if(type == 1){//1 商户 2 APP
			var dataid = data.sysUserId;
			
			if(step == 1) {
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
						$('#addName').val('');
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
						form.on('submit(formdemo3)', function(err) {
							if(err) {
								var id = $("#addMervhant").attr("data-sysId");
								var subscriptionName = $.trim($("#addName").val()); //头条名
								var subscriptionTypeId = $("#subscription").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //头条类型ID
								var subscriptionSynopsis = $.trim($("#addnote").val());
								var pam = {
									sysUserId: dataid,
									subscriptionName: subscriptionName, //公众号名
									subscriptionTypeId: subscriptionTypeId, //公众号类型ID
									subscriptionSynopsis: subscriptionSynopsis //公众号简介
								}
								reqAjaxAsync(USER_URL.ADDSECOND, JSON.stringify(pam)).done(function(res1) {
									if(res1.code == 1) {
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
														var balance = $.trim($("#addmoney").val());

														//金额正则
														/*var mony = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
														if(!mony.test(balance)){
														    layer.alert("请输入正确的金额");
														    $("#addmoney").val("");
														    return;
														}*/
														
														var pm = {
															'sysUserId': dataid,
															balance: balance
														}
														console.log(pm)
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
																			getTree(roleName,'merchant');
																			$('#mervchantRole').on("click", "li", function() {
																				var name = $(this).text();
																				$('#mervchantRole li').removeClass("aee");
																				$(this).addClass("aee");
																				getTree(name,'merchant');
																			});
																		} else {
																			layer.msg(res01.msg);
																		}
																	},
																	yes: function(index, layero) {
																		var odId = $("#addMervhant").attr("data-sysId2");
																		var pram = {
																			sysUserId: dataid
																		}
																		reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
																			if(res3.code == 1) {
																				layer.msg(res3.msg);
																				layer.close(index);
																				var username = $.trim($("#phone").val());
																				var locked = $("#statusSelector").val();
																				var provinceId = $("#provinceSelector1").val();
																				var cityId = $("#citySelector1").val();
																				getTbl()
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

			} else if(step == 2) {

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
									sysUserId: dataid,
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
													getTree(roleName,'merchant');
													$('#mervchantRole').on("click", "li", function() {
														var name = $(this).text();
														$('#mervchantRole li').removeClass("aee");
														$(this).addClass("aee");
														getTree(name,'merchant');
													});
												} else {
													layer.msg(res01.msg);
												}
											},
											yes: function(index, layero) {
												var odId = $("#addMervhant").attr("data-sysId2");
												var pram = {
													sysUserId: dataid
												}
												reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
													if(res3.code == 1) {
														layer.msg(res3.msg);
														layer.close(index);
														var username = $.trim($("#phone").val());
														var locked = $("#statusSelector").val();
														var provinceId = $("#provinceSelector1").val();
														var cityId = $("#citySelector1").val();
														getTbl()
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

			} else if(step == 3) {

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
							getTree(roleName,'merchant');
							$('#mervchantRole').on("click", "li", function() {
								var name = $(this).text();
								$('#mervchantRole li').removeClass("aee");
								$(this).addClass("aee");
								getTree(name,'merchant');
							});
						} else {
							layer.msg(res01.msg);
						}
					},
					yes: function(index, layero) {
						var odId = $("#addMervhant").attr("data-sysId2");
						var pram = {
							sysUserId: dataid
						}
						reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
							if(res3.code == 1) {
								layer.msg(res3.msg);
								layer.close(index);
								var username = $.trim($("#phone").val());
								var locked = $("#statusSelector").val();
								var provinceId = $("#provinceSelector1").val();
								var cityId = $("#citySelector1").val();
								getTbl()
							} else {
								layer.msg(res3.msg);
							}
						})
					}

				})

			}
		}else if(type == 2){
			var isrealname = data.isrealname;
			var oldId = data.sysUserId;
			console.log
			if(step == 1){
				//第二步
				layer.open({
					title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#secondDemoAPP'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['850px', '400px'],
					closeBtn: 1,
					shade: [0.1, '#fff'],
					btn: ['下一步'],
					end: function() {
						$('#secondDemoAPP').hide();
						$("#addNameAPP").val("");
					},
					success: function(layero, index) {
						//给保存按钮添加form属性
						$("div.layui-layer-page").addClass("layui-form");
						$("a.layui-layer-btn0").attr("lay-submit", "");
						$("a.layui-layer-btn0").attr("lay-filter", "formdemo1");
						//频道类型
						var raw = reqAjax(USER_URL.CONFIG, "");
						if(raw.code == 1) {
							var data = raw.data.cmsChannelList;
							var sHtmldept = '';
							$.each(data, function(i, item) {
								sHtmldept += "<option value='" + item.channelId + "'>" + item.channelName + "</option>";
							});
							$('#fixdepartmentAPP').html(sHtmldept);
							form.render();
						} else {
							layer.msg(raw.msg);
						}
					},
					yes: function(index, layero) {
						//form监听事件
						form.on('submit(formdemo1)', function(data) {
							if(data) {
								var subscriptionName = $.trim($("#addNameAPP").val()); //个人频道名称
								var subscriptionTypeId = $("#subscriptionAPP").find("dl dd.layui-this").attr("lay-value"); //个人频道类型ID
								if(subscriptionName.indexOf("script") != -1) {
									$("#addNameAPP").val("");
									layer.msg("请输入正确的个人频道名称");
									return;
								}

								var params = {
									appUserId: oldId,
									subscriptionName: subscriptionName,
									subscriptionTypeId: subscriptionTypeId
								}
								reqAjaxAsync(USER_URL.ADDSECONDAPP, JSON.stringify(params)).done(function(res) {
									if(res.code == 1) {
										layer.msg(res.msg);
										layer.close(index);
										getTbl();
										//第三步
										layer.open({
											title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
											type: 1,
											content: $('#thirdDemoAPP'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
											area: ['850px', '600px'],
											closeBtn: 1,
											shade: [0.1, '#fff'],
											btn: ['保存'],
											end: function() {
												$('#thirdDemoAPP').hide();
											},
											success: function(layero, index) {
												//角色名称
												var pm1 = {
													page: 1,
													rows: 15
												}
												var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
                                                if(res01.code == 1) {
                                                    var datarole = res01.data;
                                                    var sHtmldept = '';
                                                    $.each(datarole, function(i, item) {
                                                        sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</li>";
                                                    });
                                                    $('#mervchantRoleAPP').html(sHtmldept);
                                                    $('#mervchantRoleAPP').find("li").eq(0).addClass("aee");
                                                    var roleName = $('#mervchantRoleAPP').find("li.aee").text();
                                                    getTree(roleName,'app');
                                                    $('#mervchantRoleAPP').on("click", "li", function() {
                                                        var name = $(this).text();
                                                        $('#mervchantRoleAPP li').removeClass("aee");
                                                        $(this).addClass("aee");
                                                        getTree(name,'app');
                                                    });
                                                } else {
                                                    layer.msg(res01.msg);
                                                }


											},
											yes: function(index, layero) {
												var pram = {
													appUserId: oldId
												}
												reqAjaxAsync(USER_URL.ADDTHIRDAPP, JSON.stringify(pram)).done(function(res3) {
													if(res3.code == 1) {
														layer.msg(res3.msg);
														layer.close(index);
														getTbl();
													} else {
														layer.msg(res3.msg);
													}
												})
											}

										})

									} else {
										layer.msg(res.msg);
									}
								})
							}
						})
					}
				})
			}else if(step == 2){
				layer.open({
					title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#thirdDemoAPP'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['850px', '600px'],
					closeBtn: 1,
					shade: [0.1, '#fff'],
					btn: ['保存'],
					end: function() {
						$('#thirdDemoAPP').hide();
					},
					success: function(layero, index) {
						//角色名称
						var pm1 = {
							page: 1,
							rows: 15
						}
						var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
						if(res01.code == 1) {
							var datarole = res01.data;
							var sHtmldept = '';
							$.each(datarole, function(i, item) {
								sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
							});
							$('#mervchantRoleAPP').html(sHtmldept);
							$('#mervchantRoleAPP').find("li").eq(0).addClass("aee");
							var roleName = $('#mervchantRoleAPP').find("li.aee").text();
							getTree(roleName,'app');
							$('#mervchantRoleAPP').on("click", "li", function() {
								var name = $(this).text();
								$('#mervchantRoleAPP li').removeClass("aee");
								$(this).addClass("aee");
								getTree(name,'app');
							});
						} else {
							layer.msg(res01.msg);
						}
					},
					yes: function(index, layero) {
						var pram = {
							appUserId: oldId
						}
						reqAjaxAsync(USER_URL.ADDTHIRDAPP, JSON.stringify(pram)).done(function(res3) {
							if(res3.code == 1) {
								layer.msg(res3.msg);
								layer.close(index);
								getTbl();
							} else {
								layer.msg(res3.msg);
							}
						})
					}

				})
			}
		}
		
		
	
	}

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
		if(type == 'app'){
			treeObj = $.fn.zTree.init($("#treedemAPP"), setting, treeData);
			treeObj.expandAll(true);
		}else if(type == 'merchant'){
			treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
			treeObj.expandAll(true);
		}
		
	}

	//加了入参的公用方法
	function  tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-338',
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

	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click', function() {
		getTbl();
	})

	//重置
	$("#toolRelize").click(function() {
		$("#merchantName").val("");
		$("#merchant_nickname").val("");
		getTbl();
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