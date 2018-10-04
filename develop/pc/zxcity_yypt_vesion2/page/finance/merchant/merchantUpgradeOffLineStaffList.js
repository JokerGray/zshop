layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
			var form = layui.form,
				layer = layui.layer,
				$ = layui.jquery,
				laydate = layui.laydate,
				table = layui.table,
				laypage = layui.laypage;

			var userNo = sessionStorage.getItem("userno") || "";

			//接口
			var server = {
				selMerchantUpgradePageList: 'merchantUpgrade/selMerchantUpgradePageList', //(查询列表)
				selectUserInfo: 'payStatistics/selectUserInfo', //(商户查询)
				exportScAlipayPoundage : 'scAlipayPoundage/exportScAlipayPoundage',//(下载地址)
				auditEmployeeCommission : 'merchantUpgrade/auditEmployeeCommission'
			}



			//搜索
			$('#searchBtn').on('click', function() {
				tableInit();
			})
			//重置
			$('#resetBtn').on('click', function() {
				location.reload()
			})
			
			
			
				//表格操作
			table.on('tool(merchantTable)', function(obj) {
				var data = obj.data;
				//查看
				if(obj.event === 'showMerchant') {
						layer.open({
						title: ['商户账户详细信息', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addLayer'),
						area: ['1400px', '700px'],
						end: function() {
							addInit();
						},
						success: function(index,layero) {
							var parms = {
								type:1,
								id:data.merchantId
							}
							reqAjaxAsync(server.selectUserInfo,JSON.stringify(parms)).then(function(res){
								var data = res.data;
								$('#one').val(data.userCode);
								$('#two').val(data.userName);
								$('#three').val(data.regular);
								$('#four').val(data.locked);
								$('#five').val(data.platformUserCode);
								$('#six').val(data.registType);
								$('#seven').val(data.phone);
								$('#eight').val(data.trade);
								$('#nine').val(data.provinceName);
								$('#ten').val(data.cityName);
							})
						},
						yes: function(index,layero) {
							layer.close(index)
						}
					})
				}else if(obj.event === 'doPay'){
					layer.open({
						title: ['线下员工佣金发放', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addPay'),
						area: ['1400px', '700px'],
						end: function() {
							addInitPay();
						},
						success: function(index,layero) {
							$('#tone').val(data.referenceUserName)
							$('#ttwo').val(data.referenceRealAmount)
							$('#tthree').val(data.employeeState)
						},
						yes: function(index,layero) {
							var parms = {
								id:data.id,
								employeeCommissionStatus:$('#tfour').val(),
								employeeCommissionUserId:data.upgradeAuditUserId,
								employeeCommissionUserName:data.upgradeAuditUserName
							}
							reqAjaxAsync(server.auditEmployeeCommission,JSON.stringify(parms)).then(function(res){
								layer.msg(res.msg)
								layer.close(index)
							})
						}
					})
				}else if(obj.event === 'showUser'){
					layer.open({
						title: ['用户账户详细信息', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addUser'),
						area: ['1400px', '700px'],
						end: function() {
							addInito();
						},
						success: function(index,layero) {
							var parms = {
								type:0,
								id:data.referenceUserId
							}
							reqAjaxAsync(server.selectUserInfo,JSON.stringify(parms)).then(function(res){
								var data = res.data;
								$('#oone').val(data.userCode);
								$('#otwo').val(data.userSex);
								$('#othree').val(data.userbirth);
								$('#ofour').val(data.userName);
								$('#ofive').val(data.residence);
								$('#osix').val(data.locked);
								$('#oseven').val(data.phone);
								$('#oeight').val(data.registType);
								$('#onine').val(data.regMode);
								$('#oten').val(data.isrealname);
							})
						},
						yes: function(index,layero) {
							layer.close(index)
						}
					})
				}else if(obj.event === 'view'){
					layer.open({
						title: ['商户升级详情', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addView'),
						area: ['1400px', '700px'],
						end: function() {
							addInitView();
						},
						success: function(index,layero) {
							$('#ooone').val(data.merchantOrgName);
							$('#ootwo').val(data.referenceStrategyName);
							$('#oothree').val(data.upgradeAmount);
							$('#oofour').val(data.upgradeRealAmount);
							$('#oofive').val(data.statusStr);
							$('#oosix').val(data.upgradeAutitTime);
							$('#ooseven').val(data.remark);
						},
						yes: function(index,layero) {
							layer.close(index)
						}
					})
				}
			})
	
			//清空表单
			function addInit(){
				$('#one').val("");
				$('#two').val("");
				$('#three').val("");
				$('#four').val("");
				$('#five').val("");
				$('#six').val("");
				$('#seven').val("");
				$('#eight').val("");
				$('#nine').val("");
				$('#ten').val("");
			}
			//清空表单
			function addInito(){
				$('#oone').val("");
				$('#otwo').val("");
				$('#othree').val("");
				$('#ofour').val("");
				$('#ofive').val("");
				$('#osix').val("");
				$('#oseven').val("");
				$('#oeight').val("");
				$('#onine').val("");
				$('#oten').val("");
			}
			//清空表单
			function addInitView(){
				$('#ooone').val("");
				$('#ootwo').val("");
				$('#oothree').val("");
				$('#oofour').val("");
				$('#oofive').val("");
				$('#oosix').val("");
				$('#ooseven').val("");
			}

			
			
			//导出excel
			$('#addButton').on('click', function(){
					var parms = {
						startTime: $('.startDate').eq(0).attr('data-date') || "",
						endTime: $('.endDate').eq(0).attr('data-date') || "",
						moduleId: $('#moduleId').val() || ""
					};
					downloadFile(server.exportScAlipayPoundage,JSON.stringify(parms))
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



				//pageCallback
				function pageCallback(index, limit, callback) {
					var parms = {
						pageSize: limit,
						pageNo: index,
						status: $('#moduleId').val() || "",
						commissionStatus: "-1",
						onOffLine: "2",
						merchantOrgName: $('#merchantOrgName').val() || "",
						serialNo: $('#serialNo').val() || ""
					};
					reqAjaxAsync(server.selMerchantUpgradePageList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var data = res.data.list;
						$.each(data, function(i, item) {
							$(item).attr('eq', (i + 1));
							if(item.upgradeType == "1"){
								$(item).prop('_upgradeType',"合作商户")
							} else if (item.upgradeType == "2"){
								$(item).prop('_upgradeType',"代理商户")
							} else if (item.upgradeType == "3"){
								$(item).prop('_upgradeType',"合作商户续费")
							} else if (item.upgradeType == "4"){
								$(item).prop('_upgradeType',"代理商户续费")
							}
							if(item.employeeState == "0"){
								$(item).prop('employeeState',"在职")
							} else if (item.employeeState == "1"){
								$(item).prop('employeeState',"离职")
							} else if (item.employeeState == "2"){
								$(item).prop('employeeState',"非员工")
							}
							
							if(item.employeeCommissionStatus == 1){
								$(item).prop('employeeCommissionStatus','已结算')
							}else if(item.employeeCommissionStatus == 2){
								$(item).prop('employeeCommissionStatus','离职不予结算')
							}else if(item.employeeCommissionStatus == 0){
								$(item).prop('employeeCommissionStatus','0')
							}else{
								$(item).prop('employeeCommissionStatus','-')
							}
							
							$(item).prop('upgradeAmount',fmoney(item.upgradeAmount,2))
							$(item).prop('referenceRealAmount',fmoney(item.referenceRealAmount,2))
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
							}, {
								title: '流水号',
								align: 'left',
								field: 'serialNo',
							}, {
								title: '账户名称',
								align: 'left',
								templet: '#merchantName',
								event:'showMerchant'
							}, {
								title: '商户名称',
								align: 'left',
								templet: '#merchantOrgNameFer',
								event:'showMerchant'
							}, {
								title: '商户升级详情',
								align: 'left',
								templet: '#view',
							}, {
								title: '办理人员',
								align: 'left',
								templet: '#referenceUserName',
								event:'showUser'
							}, {
								title: '员工状态',
								align: 'left',
								field: 'employeeState',
							}, {
								title: '升级类型',
								align: 'left',
								field: '_upgradeType',
							}, {
								title: '缴费金额',
								align: 'left',
								field: 'upgradeAmount',
							},{
								title: '业务提成',
								align: 'left',
								field: 'referenceRealAmount',
							},{
								title: '审核时间',
								align: 'left',
								field: 'upgradeAutitTime',
							},{
								title: '员工结算',
								align: 'left',
								templet: '#pay'
							}]
						],
						pageCallback, 
						'layTablePage'
					)
					return _obj.cols;
				}
				tableInit()
				
				tableArr = tableInit();
				var Dynamic = function() {};
			
				Dynamic.prototype.creatBtn = function() {
					$('<button class="layui-btn my-btn add" lay-event="set" id="dtHead" style="margin-right:10px">设置</button>').appendTo($('.tool-add-box'));
					$('#dtHead').on('click', function() {
						dynamic.setLayer()
					})
				}
			
				Dynamic.prototype.checkbox = "";
			
				Dynamic.prototype.getCols = function(t) {
					var that = this;
					t = t[0];
					that.checkbox += '<div class="layui-form" id="layuiCheck" style="padding: 40px;"  lay-filter="mytest">'
					t.forEach(function(c, i, a) {
						that.checkbox += '<div class="my-layui-checkbox" style="float: left;padding: 20px;"><input type="checkbox" name=' + c.field + "|"+ c.templet + "|" + c.title +"|"+ c.event + '  title=' + c.title + '><div class="layui-unselect layui-form-checkbox" lay-skin=""><span>' + c.title + '</span><i class="layui-icon"></i></div></div>'
					})
					that.checkbox += '</div>'
					return this.checkbox
				}
			
				Dynamic.prototype.initLayer = function() {
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit", "");
					$("a.layui-layer-btn0").attr("lay-filter", "formtest");
					form.render(null, 'mytest');
				}
			
				Dynamic.prototype.endLayer = function() {
					this.checkbox = ""
				}
			
				Dynamic.prototype.yesLayer = function() {
					form.on('submit(formtest)', function(data) {
						if(JSON.stringify(data.field)!= "{}") {
							var obj = [];
							var j = data.field;
							for(var i in j) {
								var arr1=[];
								var arr = i.split('|');
								if(arr[1]=='undefined'){
									Array.prototype.push.call(obj, {
										title: arr[2],
										align: "left",
										field: arr[0]
									
									});									
								}else if(arr[0]=='undefined'){
									Array.prototype.push.call(obj, {
										title: arr[2],
										align: "left",
										templet: arr[1],
										event:arr[3]
									});										
								}

							}
							_tableInit('merchantTable', [obj], pageCallback, 'layTablePage')
							layer.closeAll();
						} else {
							layer.msg('请至少选择一项')
						}
					})
				}
			
				Dynamic.prototype.setLayer = function() {
					var that = this;
					layer.open({
						title: ['设置', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定', '取消'],
						type: 1,
						anim: 5,
						content: dynamic.getCols(tableArr),
						area: ['1000px', '250px'],
						end: function() {
							that.endLayer();
						},
						success: function(index, layero) {
							that.initLayer();
						},
						yes: function(index, layero) {
							that.yesLayer();
						},
						btn2: function(index, layero) {
							that.endLayer();
						}
					})
				}
			
				var dynamic = new Dynamic();
				dynamic.creatBtn();
				
				
				
				// 金额格式化
				function fmoney(s, n){ 
					if(null==s || undefined ==s ) {
						return "";
					}
				   n = n > 0 && n <= 20 ? n : 2;   
				   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
				   var l = s.split(".")[0].split("").reverse(),   
				   r = s.split(".")[1];   
				   t = "";   
				   for(i = 0; i < l.length; i ++ ){   
					  t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
				   }   
				   return t.split("").reverse().join("") + "." + r;
				}

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
						height: 'full-250',
						cols: cols,
						page: false,
						even: true,
						limit: 15,
						cellMinWidth:80,
						done: function(res, curr, count) {
							$('body').on('click', '.layui-table-body table tr', function() {
								$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
							})
						}
					});

					//2.第一次加载
					pageCallback(1, 15, function(res) {
						tableIns.reload({
							data: res.data.list
						})
						//第一页，一页显示15条数据
						layui.use('laypage');
						var page_options = {
							elem: pageDomName,
							count: res ? res.data.total : 0,
							layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
							limits: [15],
							limit: 15
						}
						page_options.jump = function(obj, first) {
							tablePage = obj;
							//首次不执行
							if(!first) {
								pageCallback(obj.curr, obj.limit, function(resTwo) {
									tableIns.reload({
										data: resTwo.data.list
									});
								});
							}
						}
						layui.laypage.render(page_options);
					});
					return {
						cols:cols
					}

				}




		})