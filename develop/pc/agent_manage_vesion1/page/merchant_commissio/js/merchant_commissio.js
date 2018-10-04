layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
			var form = layui.form,
				layer = layui.layer,
				$ = layui.jquery,
				laydate = layui.laydate,
				table = layui.table,
				laypage = layui.laypage;

			var userNo = sessionStorage.getItem("userno") || "";
			var id=sessionStorage.getItem('id')||"";
			//接口
			var server = {
				dataList: 'operations/queryAgentCustomerBackUserChargeCountList' ,//(查询列表)
				statisticalList:'operations/queryAgentCustomerBackUserChargeCount' //统计图
			}

			//日期控件
			laydate.render({
				elem: '#startDate',
				done: function(value) {
					$('.startDate').eq(0).attr('data-date', value)
				}
			});
			laydate.render({
				elem: '#endDate',
				done: function(value) {
					$('.endDate').eq(0).attr('data-date', value)
				}
			});

			//搜索
			$('#searchBtn').on('click', function() {
				tableInit();
				eChart();
			})
			//重置
			$('#resetBtn').on('click', function() {
				location.reload()
			})
			
			//点击变色
			$('body').on('click', '.layui-table-body table tr', function() {
				$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
			})


				//pageCallback
				function pageCallback(index, limit, callback) {
					var parms = {				
							pageNo:index,
							pageSize:limit,
							t_userid:id,
							startDate: $('.startDate').eq(0).attr('data-date') || "",
							endDate: $('.endDate').eq(0).attr('data-date') || ""									
					};
					reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var data = res.data;
						$.each(data, function(i, item) {
							$(item).attr('eq',(i+1));
							if(item.upgrade_type==1){
								$(item).attr('type','合作商户')
							}else if(item.upgrade_type==2){
								$(item).attr('type','代理商户')
							}else if(item.upgrade_type==3){
								$(item).attr('type','合作商户续费')
							}else if(item.upgrade_type==4){
								$(item).attr('type','代理商户续费')
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
								field: 'eq'
							}, {
								title: '商户名称',
								align: 'left',
								field: 'orgName'
							}, {
								title: '商户手机号',
								align: 'left',
								field: 'phone'
							}, {
								title: '升级类型',
								align: 'left',
								field: 'type'
							}, {
								title: '申请时间',
								align: 'left',
								field: 'apply_time'
							}, {
								title: '收入时间',
								align: 'left',
								field: 'reference_audit_time'
							}, {
								title: '佣金金额',
								align: 'left',
								field: 'reference_real_amount'
							}]
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
						height: '310',
						cols: cols,
						page: false,
						even: true,
						//skin: 'row',
						limit: 10,
						cellMinWidth:80
					});

					//2.第一次加载
					pageCallback(1, 10, function(res) {
						tableIns.reload({
							data: res.data
						})
						//第一页，一页显示15条数据
						layui.use('laypage');
						var page_options = {
							elem: pageDomName,
							count: res ? res.total : 0,
							layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
							limits: [10, 20],
							limit: 10
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

		//统计图
		function eChart(){
			    var myChart = echarts.init(document.getElementById('myChart'));
					var parms = {				
							t_userid:id,
							startDate: $('.startDate').eq(0).attr('data-date') || "",
							endDate: $('.endDate').eq(0).attr('data-date') || ""									
					};
				reqAjaxAsync(server.statisticalList, JSON.stringify(parms)).then(function(res) {
					console.log(res)
					var data=res.data;
					
				    myChart.setOption(option = {
				        title: {
				            text: '商户佣金统计'
				        },
				        tooltip: {
				            trigger: 'axis'
				        },
				        xAxis: {
				            data: data.map(function (item) {
				                return item['auditTime'];
				            }),
				            splitLine:{
				            	show:true
				            }
				        },
				        yAxis: {
				            splitLine: {
				                show: true
				            }
				        },
				        series: 
					        {
					            name: '商户佣金统计',
					            type: 'line',
					            smooth: true,
				                itemStyle: {
							        normal: {
							            lineStyle: {
							                color: "#008acd"
							            }
							        }
							    },
							    areaStyle: {
					                normal: {
					                    color:'#009688'
					                }
					            },
					            data: data.map(function (item) {
					                return item['totalAmount'];
					            })
					            
					        }
				        
				    });
				});
		};
		
		eChart();
	
})