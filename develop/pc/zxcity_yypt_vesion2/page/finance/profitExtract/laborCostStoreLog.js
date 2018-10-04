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
				dataList: 'profitExtractLog/selProfitExtractLog', //(查询列表)
				exportExcel: 'payExcel/exportProfitExtractLog'//(下载地址)
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
			
			//获取url传参
			var startTime = getRequestAddressUrlParameter("startTime");
			var endTime = getRequestAddressUrlParameter("endTime");
			$('#startDate').val(startTime);
		    $('#endDate').val(endTime);
			
			var businessType = getRequestAddressUrlParameter("businessType");
			var extractType = "";
			if(businessType && businessType == 1){
				extractType = 8;
			}else if(businessType && businessType == 2){
				extractType = 9;
			}else if(businessType && businessType == 3){
				extractType = 10;
			}
		    
		    var scale = getRequestAddressUrlParameter("scale");
		    var year = getRequestAddressUrlParameter("year");
		    var month = getRequestAddressUrlParameter("month");
		    if(scale && scale == 'all'){
		    	//查询指定版块所有记录所有提取记录
		    	$("#selectview2").val(extractType);
		    	form.render('select');
		    	
		    	// 获取当前日期
		    	var endDate = formatDate(new Date().getTime()/1000);
		    	$('#startDate').val();
		        $('#endDate').val(endDate);
		    }else if(year && month){
		    	//查询指定版块指定月份提取记录
		    	$("#selectview2").val(extractType);
		    	form.render('select');
		    	
		    	// 获取该月第一天
		        var MonthFirstDay=new Date(year,month-1,1);
				//获取该月最后一天
				var day = new Date(year,month,0); 
				//获取天数：
				var daycount = day.getDate();
				var MonthLastDay = new Date(year,month-1,daycount);
		    	 
		        MonthFirstDay=formatDate(MonthFirstDay.getTime()/1000);
		        MonthLastDay=formatDate(MonthLastDay.getTime()/1000);
		        // 设置本月起止日期
		        $('#startDate').val(MonthFirstDay);
		        $('#endDate').val(MonthLastDay);
		    }
			

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
						extractType: $('#selectview2').val() || "",
						extractTimeStart: $('#startDate').val(),
						extractTimeEnd: $('#endDate').val()
					};
					downloadFile(server.exportExcel,JSON.stringify(parms))
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
						extractType: $('#selectview2').val() || "",
						extractTimeStart: $('#startDate').val(),
						extractTimeEnd: $('#endDate').val()
					};
					reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
						if(res.code != 1) {
							return layer.msg(res.msg);
						}
						var resData=res.data;
						$('#amount').text('合计 : '+resData.sum+'')
						var data = res.data.list;
						$.each(data, function(i, item) {
							$(item).attr('eq', (i + 1));
							$(item).attr('money',fmoney(item.extractMoney,2));
							if(item.yyName==null){
								$(item).attr('yyName','-')
							};
							if(item.yyUserName==""){
								$(item).attr('yyUserName','-')
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
								align: 'center',
								field: 'eq',
								width:100
							}, {
								title: '业务类型',
								align: 'center',
								field: 'extractTypeStr'
							}, {
								title: '操作账户',
								align: 'center',
								field: 'yyName'
							}, {
								title: '存入人',
								align: 'center',
								field: 'yyUserName'
							}, {
								title: '存入金额(人民币)',
								align: 'center',
								field: 'money'
							}, {
								title: '存入时间',
								align: 'center',
								field: 'extractTime'
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
					return{
						cols:cols
					}
				}

		})