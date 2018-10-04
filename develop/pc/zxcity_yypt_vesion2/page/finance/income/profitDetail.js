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
			dataList: 'profitExtractLog/selProfitDetail', //(查询列表)
			exportExcel: 'payExcel/exportAccountProfitDetail'//(下载地址)
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
		
		//接收url传参, 初始化日期控件
		var startTime = getRequestAddressUrlParameter("startTime");
		var endTime = getRequestAddressUrlParameter("endTime");
		$("#startDate").val(startTime);
		$("#endDate").val(endTime);

		//搜索
		$('#searchBtn').on('click', function() {
			tableInit();
		})
		//重置
		$('#resetBtn').on('click', function() {
			location.reload()
		})
		
		//封装请求参数
		function getSearchParam(index, limit){
			var uname = $('#accountnamer').val();
            var profitType = getRequestAddressUrlParameter("type");
            var startTime = $('#startDate').val();
            var endTime = $('#endDate').val();
            
            var param = {
        		pageNo: index,
        		pageSize: limit,
        		accountName: uname,
        		profitType: profitType,
        		billTimeStart: startTime,
        		billTimeEnd: endTime
            }
            return JSON.stringify(param);
		}
		
		//导出excel
		$('#exportBtn').on('click', function(){
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
		
		
		//pageCallback
		function pageCallback(index, limit, callback) {
			var parms = getSearchParam(index, limit);
			reqAjaxAsync(server.dataList, parms).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData = res.data;
				$('#amount').text('合计 : '+ fmoney(resData.sum, 2) +'');
				var data = res.data.list;
				$.each(data, function(i, item) {
					$(item).attr('eq', (i + 1));
					
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
						field: 'serialNo',
						templet: function(d){
							if(d.serialNo == null){
	                            return res="-";
	                        }else{
	                            return d.serialNo;
	                        }
						}
					}, {
						title: '盈利类型',
						align: 'left',
						field: 'profitTypeStr',
						templet: function(d){
							if(d.profitTypeStr == null){
	                            return res="-";
	                        }else{
	                            return d.profitTypeStr;
	                        }
						}
					}, {
						title: '账户名称',
						align: 'center',
						field: 'accountName',
						templet: function(d){
							if(d.accountName == null){
	                            return res="-";
	                        }else{
	                            return d.accountName;
	                        }
						}
					}, {
						title: '手机号码',
						align: 'left',
						field: 'phone',
						templet: function(d){
							if(d.phone == null){
	                            return res="-";
	                        }else{
	                            return d.phone;
	                        }
						}
					}, {
						title: '交易内容',
						align: 'left',
						field: 'billMark',
						templet: function(d){
							if(d.billMark == null){
	                            return res="-";
	                        }else{
	                            return d.billMark;
	                        }
						}
					}, {
						title: '收入金额',
						align: 'left',
						field: 'money',
						templet: function(d){
							return fmoney(d.money, 2);
						}
					}, {
						title: '交易时间',
						align: 'left',
						field: 'billTime'
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