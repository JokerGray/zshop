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
				exportMerchantUpgrade : 'payExcel/exportMerchantUpgrade'//(下载地址)
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
							console.log(data);
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
				}else if(obj.event === 'adut'){
					layer.open({
						title: ['推荐人佣金详情审核', 'font-size:12px;background-color:#424651;color:#fff'],
						btn: ['确定'],
						type: 1,
						anim: 5,
						content: $('#addUser'),
						area: ['1400px', '700px'],
						end: function() {
							addInito();
						},
						success: function(index,layero) {
							$('#oone').val(data.merchantOrgName);
							$('#otwo').val(data.upgradeAmount);
							$('#othree').val(data.upgradeType);
							$('#ofour').val(data.referenceUserName);
							$('#ofive').val(data.referenceMerchantLevel);
							$('#osix').val(data.referenceRealAmount);
							$('#oseven').val(data.referenceTaxation);
							$('#oeight').val(data.referenceMoney);
							$('#onine').val(data.copartnerUserName);
							$('#oten').val(data.copartnerRealAmount);
							$('#oevelen').val(data.copartnerTaxation);
							$('#otwice').val(data.copartnerMoney);
							$('#otrety').val(data.profitAmount);
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
							console.log(data);
							$('#ooone').val(data.upgradeType);
							$('#ootwo').val(data.upgradeAmount);
							$('#oothree').val(data.serialNo);
							$('#oofour').val(data.aliPayPoundage);
							$('#oofive').val(data.aliPayMoney);
							$('#oosix').val(data.aliPay);
							$('#ooseven').val(data.upgradeRealAmount);
							$('#ooeight').val(data.auditName);
							$('#oonine').val(data.referenceUserName);
							$('#ooten').val(data.referenceAmount);
							$('#ooeleven').val(data.statusStr);
							$('#ootwice').val(data.remark);
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
				$('#oevelen').val("");
				$('#otwice').val("");
				$('#otrety').val("");
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
				$('#ooeight').val("");
				$('#oonine').val("");
				$('#ooten').val("");
				$('#ooeleven').val("");
				$('#ootwice').val("");
			}

			
			
			//导出excel
			$('#addButton').on('click', function(){
					var parms = {
						startTime: $('.startDate').eq(0).attr('data-date') || "",
						endTime: $('.endDate').eq(0).attr('data-date') || "",
						moduleId: $('#moduleId').val() || ""
					};
					downloadFile(server.exportMerchantUpgrade,JSON.stringify(parms))
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
						onOffLine: "1",
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
								$(item).prop('upgradeType',"合作商户")
							} else if (item.upgradeType == "2"){
								$(item).prop('upgradeType',"代理商户")
							} else if (item.upgradeType == "3"){
								$(item).prop('upgradeType',"合作商户续费")
							} else if (item.upgradeType == "4"){
								$(item).prop('upgradeType',"代理商户续费")
							}else{
								$(item).prop('upgradeType',"-")
							}
							
							if(item.employeeState == "0"){
								$(item).prop('employeeState',"在职")
							} else if (item.employeeState == "1"){
								$(item).prop('employeeState',"离职")
							} else if (item.employeeState == "2"){
								$(item).prop('employeeState',"非员工")
							}else{
								$(item).prop('upgradeType',"-")
							}
							
							if(item.employeeCommissionStatus == "0"){
								$(item).prop('employeeCommissionStatus',"结算")
							} else if (item.employeeState == "1"){
								$(item).prop('employeeCommissionStatus',"已结算")
							} else if (item.employeeState == "2"){
								$(item).prop('employeeCommissionStatus',"离职不予结算")
							}else{
								$(item).prop('upgradeType',"-")
							}
							
							if(item.referenceMerchantLevel == "1"){
								$(item).prop('referenceMerchantLevel',"个人")
							} else if (item.referenceMerchantLevel == "2"){
								$(item).prop('referenceMerchantLevel',"普通商户")
							} else if (item.referenceMerchantLevel == "3"){
								$(item).prop('referenceMerchantLevel',"合作商户")
							} else if (item.referenceMerchantLevel == "4"){
								$(item).prop('referenceMerchantLevel',"代理商户")
							}else if (item.referenceMerchantLevel == "5"){
								$(item).prop('referenceMerchantLevel',"合伙人")
							}else if (item.referenceMerchantLevel == "6"){
								$(item).prop('referenceMerchantLevel',"内部员工")
							}else{
								$(item).prop('referenceMerchantLevel',"-")
							}
							
							
							if(item.commissionStatus == "0"){
								$(item).prop('commissionStatus',"未发放")
							} else if (item.commissionStatus == "1"){
								$(item).prop('commissionStatus',"已发放")
							}else{
								$(item).prop('commissionStatus',"-")
							}
							if(item.merchantOrgName){
								return 
							}else{
								$(item).prop('merchantOrgName',"")
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
								title: '合伙人',
								align: 'left',
								field:'copartnerUserName',
								event:'showUser'
							}, {
								title: '推荐人商户等级',
								align: 'left',
								field: 'referenceMerchantLevel',
							}, {
								title: '缴费金额',
								align: 'left',
								field: 'upgradeAmount',
							}, {
								title: '税前劳务费',
								align: 'left',
								field: 'referenceRealAmount',
							},{
								title: '扣税金额',
								align: 'left',
								field: 'referenceTaxation',
							},{
								title: '公司盈利',
								align: 'left',
								field: 'profitAmount',
							},{
								title: '佣金状态',
								align: 'left',
								field: 'commissionStatus',
							},{
								title: '操作',
								align: 'left',
								templet: '#adut',
							}]
						],
						pageCallback, 'layTablePage'
					)
				}
				tableInit();
				
				
				
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
						return {
							tablePage,
							tableIns
						};
					});
				}

		})