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
			dataList: 'scAlipayPoundage/selPoundageInfoByMonth'//(查询列表)
			//store: 'scAlipayPoundage/storeAlipayPoundage'//(存入)
		}
		
		//日期控件
		laydate.render({
			elem: '#startDate',
			type: 'year',
			done: function(value) {
				$('.startDate').eq(0).attr('data-date', value)
			}
		});
		//初始化日期控件
		var date = new Date();
		$('#startDate').val(date.getFullYear());
		
		//搜索
		$('#searchBtn').on('click', function() {
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
		
		/**
		 * 去掉null空字符，且返回N个字符
		 */
		function newStrByNum(str,num) { 
			if (str == '' || str == null || str == undefined) {
				str = '';
			} 
			str = $.trim(str);
			if(str.length>=num){
				return str.substring(0,num);
			}
		    return str;
		}
		
		//pageCallback
		function pageCallback(index, limit, callback) {
			var parms = {year: $("#startDate").val()};
			reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData=res.data;
				
				//$('#amount').text('合计 : '+resData.sum+'')
				var data = res.data.list;
				//截止当前未存手续费
				$("#amount").text(fmoney(res.data.amountUntilNow, 2));
				
				$.each(data, function(i, item){
					$(item).attr('eq', (i + 1));
					
				});
				
				return callback(res);
			})
		}

		//当前表格渲染
		function tableInit() {  
			var _obj = _tableInit('merchantTable', [
					[{
						title: '月份',
						align: 'center',
						field: 'eq'
					}, {
						title: '类型',
						align: 'center',
						field: 'type',
						templet: function(d){
							if(d.type == null){
								return "-";	
							}
							return d.type;
						}
					}, {
						title: '应存手续费',
						align: 'center',
						field: 'shouldStore',
						templet: function(d){
							if(d.shouldStore == null){
								return "0.00";	
							}
							return fmoney(d.shouldStore, 2);
						}
					}, {
						title: '已存手续费',
						align: 'center',
						field: 'totalStore',
						templet: function(d){
							if(d.totalStore == null){
								return "0.00";	
							}
							return fmoney(d.totalStore, 2);
						}
					}, {
						title: '未存手续费',
						align: 'center',
						field: 'notStore',
						templet: function(d){
							return fmoney((d.shouldStore - d.totalStore), 2);
						}
					}, {
						title: '操作',
						align: 'center',
						field: '_z',
						//toolbar: "#op",
						templet: function(d){
							if(!(d.eq > 0)){
								return "——";
							}else{
								var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getStoreDetail(\''+d.eq+'\')">操作记录</button>';
								return btn;
							}
						}
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
					
					//获取当前年、月
	            	var date = new Date();
	            	var thisYear = date.getFullYear();
	            	var thisMonth = date.getMonth();
	            	//当前月数据高亮显示
	            	if($("#startDate").val() == thisYear){
	            		var trs = document.getElementsByTagName('tr');
	        			var thisLine = trs[(thisMonth + 1)];
	        			thisLine.className = "highLight";
	            	}
					
				}
			});
			
			//2.第一次加载
			pageCallback(1, 15, function(res) {
				var data = res.data.list;
				var sumLine = {eq: '<label class="notice">合计</label>',
						type: '——',
						notStore: res.data.notStoreSum, 
						shouldStore: res.data.shouldStoreSum, 
						totalStore: res.data.totalStoreSum, 
						_z: '——'
				}
				data.push(sumLine);
				tableIns.reload({
					data: data
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
							//添加合计行
							var data = resTwo.data.list;
							var sumLine = {eq: '<label class="notice">合计</label>',
									type: '——',
									notStore: resTwo.data.notStoreSum, 
									shouldStore: resTwo.data.shouldStoreSum, 
									totalStore: resTwo.data.totalStoreSum, 
									_z: '——'
							}
							data.push(sumLine);
							
							tableIns.reload({
								data: data
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

function getStoreDetail(month){
	var year = $('#startDate').val();
	var name = "支付宝手续费存入明细";
	var url = "page/finance/profitExtract/alipayPoundageStoreLog.html?year="+year+"&month="+month;
	parent.addTabs(url, name);	
}