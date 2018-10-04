var init = "";
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
			dataList: 'payTransactionLog/withdrawCash', //(查询列表)
			exportExcel: 'payExcel/exportWithdrawCash'//(下载地址)
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
		
		//接收url传参, 初始化日期控件, 初始化下拉框
		var startTime = getRequestAddressUrlParameter("startTime");
		var endTime = getRequestAddressUrlParameter("endTime");
		$("#startDate").val(startTime);
		$("#endDate").val(endTime);
		
		var state = getRequestAddressUrlParameter("state");
		$("#selectview2").val(state);
		form.render('select');
		
		
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
		    var parms = {
	    		state: $("#selectview2").val(),
	    		accountName: $('#accountnamer').val(),
	    		applyTimeStart: $("#startDate").val(),
    			applyTimeEnd: $("#endDate").val(),
				pageNo : index,
				pageSize : limit
		    }
		    
		    return JSON.stringify(parms);
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
						align: 'center',
						width: 70,
						field: 'eq'
					}, {
						title: '提现单号',
						align: 'center',
						field: 'serialNo'
					}, {
						title: '账户类别',
						align: 'center',
						field: 'regularStr',
						templet: function(d){
							if(d.regularStr == null){
	                            return '-';
	                        }else{
	                            return d.regularStr;
	                        }
						}
					}, {
						title: '账户名称',
						align: 'center',
						field: 'accountName',
						templet: function(d){
							if(d.accountName == null){
								return '-';
							}else{
								return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+d.userId+')">'+d.accountName+'</button>';
							}
						}
					}, {
						title: '电话号码',
						align: 'center',
						field: 'phone'
					}, {
						title: '申请时间',
						align: 'center',
						field: 'applyTime'
					}, {
						title: '提现金额',
						align: 'center',
						field: 'amount',
						templet: function(d){
							return fmoney(d.amount, 2);
						}
					}, {
						title: '账户余额',
						align: 'center',
						field: 'accountBalance',
						templet: function(d){
							 return fmoney(d.accountBalance, 2);
						}
					}, {
						title: '状态',
						align: 'center',
						field: 'stateStr'
					}, {
						title: '备注',
						align: 'center',
						field: 'remark',
						templet: function(d){
							if(!d.remark){
	                            return "-";
	                        }else{
	                            var note='<div class="note">'+newStrByNum(d.remark, 20)+'</div>'
	                            return note;
	                        }
						}
					}, {
						title: '时间',
						align: 'center',
						field: 'state',
						width: 120,
						templet: function(d){
							if(d.state == 0){
								return d.applyTime;
							}else if(d.state == 1){
								return d.auditTime;
							}else if(d.state == 2){
								return d.auditTime;
							}else if(d.state == 3){
								return d.payTime;
							}else if(d.state == 4){
								return d.returnTime;
							}
						}
					}]
				],
				pageCallback, 'layTablePage'
			)
		}
		tableInit();
		
		init = tableInit;

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
