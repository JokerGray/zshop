(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno") || "";
	var pid = '';
	var USER_URL = {
		RESOURLIST: 'operations/getAgentMerchantRegPageListForAdmin', //(查询列表)
		REFUSE: 'operations/refuseAgentMerchantReg', //不通过
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		UPDATE: 'operations/updateMerchantUser', //修改商户信息
		ADDONE: 'operations/addAgentMerchantInfo', //添加商户信息(第一步)
		CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
		ADDSECOND: 'operations/addAgentMerchantCMSInfo', //第二步
		INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
		ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
		ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
		ADDTHIRD: 'operations/addAgentAppUserAccountInfo', //(第三部)
		ADDFORTH: 'operations/addAgentMerchantRolePermissionInfo', //(第四步)
		RESETPWD: 'operations/resetMerchantPassword', //(重置)
		CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
		/*UPDATEINFO :'operations/previewUpgradingInfo', //（商户升级信息查询）*/
		UPDATEINFO: 'operations/findMerchantReferrals', //(查找商户推荐人是否为公司员工)
		UPGRADE: 'operations/merchantUpgradeApply', //商户升级'
		GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取所有推荐关系为公司员工的列表并分页
		TRADELIST:'operations/getAllMerchantTradeList',//行业
		TEMPLATELIST :'operations/getAllMerchantTradeTemplateList'//行业模板查询

	};
	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	//日期选择
	$('#datetimepicker1 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker2 .datepicker").hide();
	});
	
	//行业初始化
	function loadMerchantTrade(domId){
		var res = reqAjax(USER_URL.TRADELIST);
		var data = res.data;
		var option = '<option value="">--请选择--</option>';
		$.each(data, function(i, item) {
			option += "<option value=" + item.value + ">" + item.name + "</option>"
		})
		$('#' + domId).html(option);
		form.render();
	}
	loadMerchantTrade('merchant_trade');
	
	
	//模板初始化
	function loadMerTemplate(domId){
		var res = reqAjax(USER_URL.TEMPLATELIST);
		var data = res.data;
		var option = '';
		$.each(data, function(i, item) {
			option += "<option value=" + item.id + ">" + item.templateName + "</option>"
		})
		$('#' + domId).html(option);
		form.render();
	}
	
	

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker1 .datepicker").hide();
	});

	//tab切换
	$(".tab-title").on("click", 'ul li', function() {
		var index = $(this).index();
		var num = $(this).attr("data-num");
		$(".tab-title ul li").removeClass("active");
		$(this).addClass("active");
		getTbl();
	});
	
	//省市初始化
	function loadProvinceCity(prov,cit) {
		//省 =》0 
		var param = "{'parentcode':" + 0 + "}";
		var option = '';
		var nextOption = '';
		reqAjaxAsync(USER_URL.PROVINCE, param).then(function(res) {
			var data = res.data;
			$.each(data, function(i, item) {
				option += "<option value=" + item.code + ">" + item.areaname + "</option>"
			})
			$('#provinceSelector2').html(option);
			
		   	if(prov && cit){
		   		var param = "{'parentcode':" + prov + "}";
	   			reqAjaxAsync(USER_URL.PROVINCE, param).then(function(res) {
					var data = res.data;
					$.each(data, function(i, item) {
						nextOption += "<option value=" + item.code + ">" + item.areaname + "</option>"
					})
					$('#citySelector2').html(nextOption);
					$('#provinceSelector2').val(prov);
					$('#citySelector2').val(cit);
					form.render('select');
		   		})
		   	}
		})
	}

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
					field: 'merchantPhone',
					width: 250
				}, {
					title: '商户名',
					/* sort: true,*/
					align: 'left',
					field: 'merchantName',
					width: 250
				}, {
					title: '商户行业',
					/*sort: true,*/
					align: 'left',
					field: 'tradeName',
					width: 150
				}, {
					title: '代理商',
					/*sort: true,*/
					align: 'left',
					field: 'orgName',
					width: 150
				}, {
					title: '申请时间',
					/*sort: true,*/
					align: 'left',
					field: 'createtime',
					width: 250
				}, {
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

	//			 layer.msg(""+step+"", { icon: 2, shade: [0.1, '#fff'], offset: '50%' }, function() {
	//			 		return false;
	//           });

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
			if(item.merchantTrade === 0) {
				$(item).attr('_merchantTrade', '服务业')
			} else if(item.merchantTrade == 1) {
				$(item).attr('_merchantTrade', '零售业')
			} else if(item.merchantTrade == 2) {
				$(item).attr('_merchantTrade', '餐饮业')
			}
		});

		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit) {
		var status = $('.tab-li.active').attr('data-num');
		var merchantPhone = $.trim($('#merchantName').val());
		var merchantName = $.trim($('#merchant_nickname').val());
		var merchantTrade = $('#merchant_trade').val();
		var param = {
			page: index,
			rows: limit,
			status: status,
			merchantPhone: merchantPhone,
			merchantTrade: merchantTrade,
			merchantName: merchantName
		}
		return getData(USER_URL.RESOURLIST, JSON.stringify(param));
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
		//查看
		if(obj.event === 'nodetail') {
			layer.open({
				title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['850px', '590px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				end: function() {
					$('#sysUserNickname').val('');
					$('#merchantNickname').val('');
					$('#merchantPhone').val('');
					$('#merchantTrade').val('');
					$('#uploadImg1').attr('src', '');
					$('#uploadImg2').attr('src', '');
					$('#uploadImg01').attr('src', '');
					$('#uploadImg02').attr('src', '');
					$('#uploadImg03').attr('src', '');
					$('#sysUserSex').val('');
					$('#advice').val('');
					$('#updatetime').val('');
					$('#lookDemo').hide();
				},
				success: function(layero, index) {
					console.log(data)
					var sysUserNickname = data.orgName; //代理商名
					var merchantNickname = data.merchantName; //商户名
					var merchantPhone = data.merchantPhone; //商户手机号
					var merchantTrade = data.tradeName; //所属行业
					var licenseFront = data.licenseFront; //营业执照正面
					var licenseHold = data.licenseHold; //手持营业执照
					var sysUserIdcardFront = data.sysUserIdcardFront; //身份证正面
					var sysUserIdcardBack = data.sysUserIdcardBack; //身份证反面
					var sysUserIdcardHold = data.sysUserIdcardHold; //手持身份证
					var sysUserSex = data.sysUserSex; //性别
					if(sysUserSex = 0) {
						sysUserSex = "男"
					} else {
						sysUserSex = "女"
					}
					var advice = data.advice; //建议
					var updatetime = data.updatetime; //申请时间
					var province = data.province; //省
					var city = data.city; //市
					//省
					var param = {
						code: data.province
					};
					var req = reqAjax(USER_URL.PROVINCEBYID, JSON.stringify(param));
					if(req.code == 1) {
						$("#province").val(req.data.areaname);
					} else {
						layer.msg(req.msg);
					};
					//市
					var params = {
						code: data.city
					};
					var reqs = reqAjax(USER_URL.PROVINCEBYID, JSON.stringify(params));
					if(req.code == 1) {
						$("#city").val(reqs.data.areaname);
					} else {
						layer.msg(req.msg);
					};

					$('#sysUserNickname').val(sysUserNickname);
					$('#merchantNickname').val(merchantNickname);
					$('#merchantPhone').val(merchantPhone);
					$('#merchantTrade').val(merchantTrade);
					$('#licenseFront').attr('src', licenseFront);
					$('#licenseHold').attr('src', licenseHold);
					$('#sysUserIdcardFront').attr('src', sysUserIdcardFront);
					$('#sysUserIdcardBack').attr('src', sysUserIdcardBack);
					$('#sysUserIdcardHold').attr('src', sysUserIdcardHold);
					$('#sysUserSex').val(sysUserSex);
					$('#advice').val(advice);
					$('#updatetime').val(updatetime);
				}
			})
		} else if(obj.event === 'noPass') {
			layer.open({
				title: '不通过',
				type: 1,
				btn: ['确定', '取消'],
				area: ['800px', '400px'],
				content: `<div class='layui-form-item'  style='padding: 20px 30px 0 0;'>
					    	<label class='layui-form-label'>不通过理由:</label>
					    	<div class='layui-input-block'>
					      		<input  name='' placeholder='请输入不通过理由' autocomplete='off' class='layui-input' id='passSp'>
					    	</div>
					  	  </div>`,
				closeBtn: 1,
				shade: 0.1,
				yes: function(index, layro) {
					var advice = $('#passSp').val();
					var id = data.id;
					var nopass = {
						id: id,
						advice: advice
					}
					var res = reqAjax(USER_URL.REFUSE, JSON.stringify(nopass))
					if(res.code == 1) {
						layer.msg('操作成功');
						layer.close(index);
						getTbl();
					} else {
						layer.msg(res.msg);
					}
				}
			})
		} else if(obj.event === 'pass') {
			var step = data.step ? data.step : '', //步数
				dataid = data.id;
			if(step == 0) {
				layer.open({
					title: ['通过新增商户申请', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					offset: '80px',
					content: $('#oneDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['900px', '720px'],
					closeBtn: 1,
					shade: [0.1, '#fff'],
					btn: ['下一步'],
					end: function() {
						$('#oneDemo').hide();
						$('#noPassDiv').show();
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
					},
					success: function(layero, index) {
						console.log(data)
						$('#noPassDiv').hide();
						//给保存按钮添加form属性
						$("div.layui-layer-page").addClass("layui-form");
						$("a.layui-layer-btn0").attr("lay-submit", "");
						$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
						//加载类型以及所属行业
						loadMerchantTrade('uBussiness');
						//加载行业模板
						loadMerTemplate('bussTemplate')
						var province = data.province;
						var city = data.city;
						loadProvinceCity(province,city);
						
						var cod = $("#addMervhant").attr("data-cid");
						
						//根据省的选择切换对应的市内容
						form.on('select(provinceSelector2)', function(data) {
							var val = data.value;
							getCity(val);
						});

						//账号判断
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

						$('#uName').val(data.merchantPhone);
						$('#upwd').val('123456');
						$('#onepwd').val('123456');
						$('#udesigName').val(data.merchantNickname);
						$('#udesig').val(data.merchantName);
						$('#uBussiness').val(data.merchantTrade);
						$('#uploadImg1').val(data.licenseFront);
						$('#oneName').val(data.merchantPhone);
						$('#onedesig').val(data.sysUserNickname);
						$('#onesex').val(data.sysUserSex);
						$('#uploadImg01').attr('src',data.sysUserIdcardFront);
						$('#uploadImg02').attr('src',data.sysUserIdcardBack);
						$('#uploadImg03').attr('src',data.sysUserIdcardHold);
						$('#provinceSelector2').val(data.province);
						$('#citySelector2').val(data.city)
						form.render('select')

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
								var templateId = $('#bussTemplate').val();//行业模板

								if(idFront == "img/upload.png") {
									layer.msg("请上传身份证正面照");
									return;
								}

								if(idback == "img/upload.png") {
									layer.msg("请上传身份证反面照");
									return;
								}

								if(hanid == "img/upload.png") {
									hanid = ''
								}

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
									id: dataid,
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
									name: realname, //真实姓名
									identificationNo: idNum, //身份证号
									cardFrontPhoto: idFront, //身份证正面
									cardBackPhoto: idback, //身份证反面
									cardHoldPhoto: hanid, //手持身份证
									licenseFront: bussfront, //营业执照正面
									licenseHold: handbuss, //营业执照手持
									templateId:templateId//行业模板
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
															id: dataid,
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
																					id: dataid,
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
																									id: dataid,
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
																										getTbl();
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
			} else if(step == 1) {
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
									id: dataid,
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
															id: dataid,
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
																			id: dataid,
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
																				getTbl();
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
									id: dataid,
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
													id: dataid,
													sysUserId: odId
												}
												reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
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
							id: dataid,
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
								getTbl();
							} else {
								layer.msg(res3.msg);
							}
						})
					}

				})

			}
			
		}
	});

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

	//加了入参的公用方法
	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-220',
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
		$("#merchant_trade").val("");
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