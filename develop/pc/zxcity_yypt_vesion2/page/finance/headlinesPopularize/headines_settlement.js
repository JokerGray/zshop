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
			dataList: 'headlinesPopularize/selectOrderSettlementLIst' //(查询列表)
			//exportExcel: 'headlines/exportStatisticsList'//(下载地址)
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
		/*$('#addButton').on('click', function(){
				var parms = {
					username: $('#accountnamer').val() || "",
					prizeType: $("#selectview2").val(),
					startTime: $('#startDate').val(),
					endTime: $('#endDate').val()
				};
				downloadFile(server.exportExcel,JSON.stringify(parms))
		})*/
		
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
			var username = $('#username').val();
			var serialNumber = getRequestAddressUrlParameter('serialNumber');
			
			var parms = {
				pageSize: limit,
				pageNo: index,
				serialNumber:serialNumber,
		        username:username
			};
			reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				
				var data = res.data;
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
						title: '订单编号',
						align: 'left',
						field: 'serialNumber'
					}, {
						title: '用户名称',
						align: 'left',
						field: 'username',
						templet: function(d){
							if (d.username) {
				              return '<a href="#" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo(' + d.advUserId + ')">' + d.username + '</a>';
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '用户类型',
						align: 'center',
						field: 'userType',
						templet: function(d){
							if(d.userType == 1){
								return "广告主";
		                    }else if(d.userType == 2){
		                    	return "供应商";
		                    }else if (d.userType == 3) {
		                        return "智享头条";
		                    }
						}
					}, {
						title: '盈利金额',
						align: 'center',
						field: 'lncomeAmount',
						templet: function(d){
							if(d.lncomeAmount == null){
								return "-";
							}else{
								return fmoney(d.lncomeAmount, 2);
							}
						}
					}, {
						title: '盈利类型',
						align: 'left',
						field: 'businessType',
						templet: function(d){
							if(d.businessType == 1){
			                    return "收入";
			                }else{
			                    return "退款";
			                }
						}
					}, {
						title: '创建时间',
						align: 'left',
						field: 'createTime'
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
				return {
					tablePage,
					tableIns
				};
			});
		}

})

