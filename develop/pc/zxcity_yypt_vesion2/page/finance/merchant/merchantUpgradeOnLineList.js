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
							console.log(data);
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
							console.log(data);
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
						status: null,
						commissionStatus: null,
						onOffLine: "1",
						merchantOrgName: $.trim($('#merchantOrgName').val()) || "",
						serialNo: $.trim($('#serialNo').val()) || ""
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
						status: null,
						commissionStatus: null,
						onOffLine: "1",
						merchantOrgName: $.trim($('#merchantOrgName').val()) || "",
						serialNo: $.trim($('#serialNo').val()) || ""
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
							
							if(item.referenceMerchantLevel == "6"){
								$(item).prop('referenceMerchantLevel',"是")
							} else{
								$(item).prop('referenceMerchantLevel',"否")
							}
							
							if(!item.referenceUserName){
								$(item).prop('referenceUserName',"-")
							}
							if(!item.merchantOrgName){
								$(item).prop('merchantOrgName',"-")
							}
							
							if(item.employeeCommissionStatus == "0"){
								$(item).prop('employeeCommissionStatus',"结算")
							} else if (item.employeeState == "1"){
								$(item).prop('employeeCommissionStatus',"已结算")
							} else if (item.employeeState == "2"){
								$(item).prop('employeeCommissionStatus',"离职不予结算")
							}
							
							if(item.status == "0"){
								$(item).prop('status',"申请")
							} else if (item.status == "1"){
								$(item).prop('status',"商户升级审核通过")
							} else if (item.status == "2"){
								$(item).prop('status',"商户升级审核不通过")
							} else if (item.status == "3"){
								$(item).prop('status',"商户升级完成")
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
								field: 'eq'
							}, {
								title: '流水号',
								align: 'left',
								field: 'serialNo'
							}, {
								title: '账户名称',
								align: 'left',
								templet: '#merchantName',
								event:'showMerchant'
							}, {
								title: '商户名称',
								align: 'left',
								templet: '#merchantOrgNameFer'

							}, {
								title: '升级类型',
								align: 'left',
								field: '_upgradeType'
							}, {
								title: '缴费金额',
								align: 'left',
								field: 'upgradeAmount'
								
							}, {
								title: '推荐人是否员工',
								align: 'left',
								field: 'referenceMerchantLevel'
							}, {
								title: '办理人员',
								align: 'left',
								templet: '#referenceUserName'
							}, {
								title: '劳务金额',
								align: 'left',
								field: 'referenceRealAmount'
							},{
								title: '审核时间',
								align: 'left',
								field: 'upgradeAutitTime'
							},{
								title: '审核状态',
								align: 'left',
								field: 'status',
							},{
								title: '操作',
								align: 'left',
								toolbar: '#barDemo'
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