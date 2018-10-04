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
			dataList: 'scAlipayPoundage/selStoreDetailByPage', //(查询列表)
			exportExcel: 'scAlipayPoundage/exportPoundageStoreLog'//(下载地址)
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
		
		//接收url传参
		var scale = getRequestAddressUrlParameter("scale");
	    var year = getRequestAddressUrlParameter("year");
	    var month = getRequestAddressUrlParameter("month");
	    if(scale && scale == 'all'){
	    	// 获取当前日期
	    	var endDate = formatDate(new Date().getTime()/1000);
	    	 $('#startDate').val();
	        $('#endDate').val(endDate);
	    }else if(year && month){
	    	//查询指定月份存入记录
	    	
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
		
		// 拼接查询参数
		function getSearchParam(pageNo, pageSize){
		    var jsonData = {
		    	startTime: $('#startDate').val(),
		    	endTime: $('#endDate').val()
		    }
		    if(pageNo && pageNo){
		    	jsonData.pageNo = pageNo;
		    	jsonData.pageSize = pageSize;
		    }
		    return JSON.stringify(jsonData);
	    }
		
		//导出excel
		$('#addButton').on('click', function(){
			var parms = getSearchParam();
			downloadFile(server.exportExcel, parms);
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
			var parms = getSearchParam(index, limit);
			reqAjaxAsync(server.dataList, parms).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData=res.data;
				$('#amount').text('合计 : '+resData.sum+'')
				var data = res.data.list;
				$.each(data, function(i, item) {
					$(item).attr('eq', (i + 1));
					
					//表格字段转义
					//流水号
					if(item.serialNo == null){
						$(item).attr('serialNo', '-');
					}
					//存入金额
					$(item).attr('taxation', fmoney(item.taxation, 2));
					//操作账户
					if(item.yyName == null){
						$(item).attr('yyName', '-');
					}
					//存入人
					if(item.yyUsername == null){
						$(item).attr('yyUsername', '-');
					}
					//备注
					if(!item.remark){
						$(item).attr('remark', '-');
					}else{
						var note='<div class="note">'+newStrByNum(item.remark, 20)+'</div>';
						$(item).attr('remark', note);
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
						field: 'serialNo'
					}, {
						title: '类型',
						align: 'left',
						field: 'feeTypeStr'
					}, {
						title: '存入金额',
						align: 'center',
						field: 'taxation'
					}, {
						title: '存入时间',
						align: 'left',
						field: 'payTime'
					}, {
						title: '操作账户',
						align: 'left',
						field: 'yyName'
					}, {
						title: '存入人',
						align: 'left',
						field: 'yyUsername'
					}, {
						title: '备注',
						align: 'left',
						field: 'remark'
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