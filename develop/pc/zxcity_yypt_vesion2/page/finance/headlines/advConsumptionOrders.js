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
				selectScAdvConsumptionOrdersList: 'headlines/selectScAdvConsumptionOrdersList', //(查询列表)
				selectModuleList: 'scAlipayPoundage/selectModuleList', //(模块列表)
				exportScAdvConsumptionOrdersList : 'headlines/exportScAdvConsumptionOrdersList'//(下载地址)
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
			})
			//重置
			$('#resetBtn').on('click', function() {
				location.reload()
			})


			
			
			//导出excel
			$('#addButton').on('click', function(){
					var parms = {
						id: $('#serialNo').val() || "",
						advStatus: $('#advStatus').val() || "",
						startTimeStrQuery: $('.startDate').eq(0).attr('data-date') || "",
						endTimeStrQuery: $('.endDate').eq(0).attr('data-date') || ""
					};
					downloadFile(server.exportScAdvConsumptionOrdersList,JSON.stringify(parms))
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
						id: $('#serialNo').val() || "",
						advStatus: $('#advStatus').val() || "",
						startTimeStrQuery: $('.startDate').eq(0).attr('data-date') || "",
						endTimeStrQuery: $('.endDate').eq(0).attr('data-date') || ""
					};
					reqAjaxAsync(server.selectScAdvConsumptionOrdersList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var data = res.data;
						$.each(data, function(i, item) {
							$(item).attr('eq', (i + 1))
							if(item.supplierType == 1){
								$(item).prop('supplierType',"代理商")
							}else if(item.supplierType == 2){
								$(item).prop('supplierType',"签约作者")
							}
							if(item.advStatus == 1){
								$(item).prop('advStatus',"进行中")
							}else if(item.advStatus == 2){
								$(item).prop('advStatus',"已结束")
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
								title: '流水号',
								align: 'left',
								field: 'id'
							}, {
								title: '广告主',
								align: 'left',
								field: 'advUsername'
							}, {
								title: '手机号',
								align: 'left',
								field: 'advPhone'
							}, {
								title: '余额',
								align: 'left',
								field: 'accountBalance'
							}, {
								title: '扣除金额',
								align: 'left',
								field: 'deductAmount'
							}, {
								title: '消耗金额',
								align: 'left',
								field: 'amountConsumption'
							}, {
								title: '公司收入',
								align: 'left',
								field: 'companyIncome'
							}, {
								title: '平台供应商',
								align: 'left',
								field: 'supplierName'
							}, {
								title: '供应商类型',
								align: 'left',
								field: 'supplierType'
							}, {
								title: '劳务费',
								align: 'left',
								field: 'laborCosts'
							}, {
								title: '状态',
								align: 'left',
								field: 'advStatus'
							}, {
								title: '时间',
								align: 'left',
								field: 'startTime'
							}]
						],
						pageCallback, 'layTablePage'
					)
					return _obj.cols;
				}
				tableInit();
				//动态表头
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
							data: res.data
						})
						//第一页，一页显示15条数据
						layui.use('laypage');
						var page_options = {
							elem: pageDomName,
							count: res ? res.total : 0,
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
										data: resTwo.data
									});
								});
							}
						}
						layui.laypage.render(page_options);
					});
					return{
						cols:cols
					}
				}

		})