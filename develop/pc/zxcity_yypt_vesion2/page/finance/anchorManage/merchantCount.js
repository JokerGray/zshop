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
				dataList: 'anchorManager/merchantCountList', //(查询列表)
				exportPayScInvoiceLog : 'anchorManager/merchantCountListExport'//(下载地址)
			}

			//日期控件
			var startDate = laydate.render({
				elem: '#startDate',
				min:"1970-1-1",//设置min默认最小值  
				done: function(value,dates) {
					$('.startDate').eq(0).attr('data-date', value)
					if(JSON.stringify(dates) == "{}"){
						endDate.config.min ={ 
			                 year:1970,   
			                 month:1, //关键  
			                 date: 1,   
			                 hours: 0,   
			                 minutes: 0,   
			                 seconds : 0  
				        }; 
					}else{
						endDate.config.min ={ 
			                 year:dates.year,   
			                 month:dates.month-1, //关键  
			                 date: dates.date,   
			                 hours: 0,   
			                 minutes: 0,   
			                 seconds : 0  
				        }; 
					}
				}
			});
		
			var endDate = laydate.render({
				elem: '#endDate',
				max:"2099-12-31",//设置一个默认最大值 
				done: function(value,dates) {
					$('.endDate').eq(0).attr('data-date', value)
					if(JSON.stringify(dates) == "{}"){
						startDate.config.max ={ 
			                 year:2099,   
			                 month:12, //关键  
			                 date: 31,   
			                 hours: 0,   
			                 minutes: 0,   
			                 seconds : 0  
				        }; 
					}else{
						startDate.config.max={  
				        year:dates.year,   
			                month:dates.month-1,//关键   
			                date: dates.date,   
			                hours: 0,   
			                minutes: 0,   
			                seconds : 0  
				       }   
					}
				}
			});

			//搜索
			$('#searchBtn').on('click', function() {
				tableInit();
			});
			//重置
			$('#resetBtn').on('click', function() {
				location.reload()
			});

			// 金额格式化
			function fmoney(s, n) {
				if(null == s || undefined == s) {
					return "";
				}
				n = n > 0 && n <= 20 ? n : 2;
				s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
				var l = s.split(".")[0].split("").reverse(),
					r = s.split(".")[1];
				t = "";
				for(i = 0; i < l.length; i++) {
					t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
				}
				return t.split("").reverse().join("") + "." + r;
			}
			
			//导出excel
			$('#addButton').on('click', function(){
					var parms = {					
							t:{
								commissionType:0,
								merchantName:$('#merchantName').val()||"",
								startTime: $('.startDate').eq(0).attr('data-date') || "",
								endTime: $('.endDate').eq(0).attr('data-date') || ""								
							}												
					};
					downloadFile(server.exportPayScInvoiceLog,JSON.stringify(parms))
			});
				//pageCallback
				function pageCallback(index, limit, callback) {
					var parms = {
							t:{
								pageNo:index,
								pageSize:limit,
								commissionType:0,
								merchantName:$('#merchantName').val()||"",
								startTime: $('.startDate').eq(0).attr('data-date') || "",
								endTime: $('.endDate').eq(0).attr('data-date') || ""								
							}

					};
					reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var data = res.data.list;
						$.each(data, function(i, item) {
							$(item).attr('eq', (i + 1));
							if(item.laborTotalAmount==null){
								$(item).attr('laborTotalAmount','-');
							};
							if(item.laborTaxTotalAmount==null){
								$(item).attr('laborTaxTotalAmount','-');
							};
							$(item).attr('money1',fmoney(item.enterpriseTotalAmount),2);
							$(item).attr('money2',fmoney(item.paymentTotalAmount),2);
						});
						return callback(res);
					})
				}

				//当前表格渲染
				function tableInit() {
					var _obj = _tableInit('merchantTable', [
							[{
								title: '序号',
								align: 'center',
								field: 'eq'
							}, {
								title: '申请商户',
								align: 'center',
								field: 'merchantName'
							}, {
								title: '劳务结算次数',
								align: 'center',
								field: 'laborCount'
							}, {
								title: '劳务结算总金额',
								align: 'center',
								field: 'laborTotalAmount'
							}, {
								title: '扣税总金额',
								align: 'center',
								field: 'laborTaxTotalAmount'
							}, {
								title: '企业结算次数',
								align: 'center',
								field: 'enterpriseCount'
							}, {
								title: '企业结算总金额',
								align: 'center',
								field: 'money1'
							}, {
								title: '支付总金额(人民币)',
								align: 'center',
								field: 'money2'
							}]
						],
						pageCallback, 'layTablePage'
					)
					return _obj.cols;
				}
				tableInit();
				
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
						that.checkbox += '<div class="my-layui-checkbox" style="float: left;padding: 20px;"><input type="checkbox" name=' + c.field + "|" + c.title + ' title=' + c.title + '><div class="layui-unselect layui-form-checkbox" lay-skin=""><span>' + c.title + '</span><i class="layui-icon"></i></div></div>'
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
						if(JSON.stringify(data.field) != "{}") {
							var obj = [];
							var j = data.field;
							for(var i in j) {
								var arr = i.split('|');
								Array.prototype.push.call(obj, {
									title: arr[1],
									align: "left",
									field: arr[0]
								});
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
						area: ['1000px'],
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
						height: 'full-300',
						cols: cols,
						page: false,
						even: true,
						limit: 15,
						cellMinWidth:80,
						done: function(res, curr, count) {
							$('body').on('click', '.layui-table-body table tr', function() {
								$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
							});					
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
					return{
						cols:cols
					}
				}
		})