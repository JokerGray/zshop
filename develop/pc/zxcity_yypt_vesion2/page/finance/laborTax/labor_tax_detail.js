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
			dataList: 'scLaborTaxList/selectList' //(查询列表)
			//exportExcel: 'headlines/exportStatisticsList'//(下载地址)
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
		var queryStatus = getRequestAddressUrlParameter('queryStatus');
		$("#startDate").val(startTime);
		$("#endDate").val(endTime);
		$("#selectview2").val(queryStatus);
		form.render('select');
		
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
			var serialNo = $('#serialNo').val();
		    var taxpayerName = $('#taxpayerName').val();
		    var queryStatus=$('#queryStatus').val();
		    var orderByType = getRequestAddressUrlParameter('orderByType');

		    if(queryStatus){
		      if(queryStatus == 1){
		        $("#selectview2").val("1");
		      }else if(queryStatus == 2){
		        $("#selectview2").val("2");
		      }else if(queryStatus == 3){
		        $("#selectview2").val("3");
		      }else if (queryStatus == 0) {
		        $("#selectview2").val("-1");
		      }
		      form.render('select');
		    }else{
		        queryStatus =$("#selectview2").val();
		    }
			
			var parms = {
				pageSize: limit,
				pageNo: index,
				serialNo: serialNo,
		        startTime: $("#startDate").val(),
		        endTime: $("#endDate").val(),
		        businessType: queryStatus,
		        taxpayerName: taxpayerName,
		        orderByType: orderByType
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
						title: '流水号',
						align: 'left',
						field: 'serialNo'
					}, {
						title: '业务类型',
						align: 'left',
						field: 'businessType',
						templet: function(d){
							if(d.businessType == 1){
			                     return "直播佣金";
			                }else if (d.businessType == 2) {
			                     return "商户升级";
			                }else if (d.businessType == 3) {
			                     return "头条推广";
			                }
						}
					}, {
						title: '纳税人名称',
						align: 'center',
						field: 'taxpayerName',
						templet: function(d){
							if(d.taxpayerName){
			                     return '<a href="javascript:" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo('+d.userId+')">'+d.taxpayerName+'</a>';
			                }else{
			                     return "-";
			                }
						}
					}, {
						title: '身份证号码',
						align: 'left',
						field: 'identificationNumber'
					}, {
						title: '手机号',
						align: 'center',
						field: 'phone',
						templet: function(d){
							if(d.phone){
								return d.phone;
							}
							return "-";
						}
					}, {
						title: '劳务费',
						align: 'left',
						field: 'laborCosts',
						templet: function(d){
							if(d.laborCosts){
			                     return fmoney(d.laborCosts, 2);
			                }else{
			                     return "-";
			                }
						}
					}, {
						title: '劳务费当月总计',
						align: 'center',
						field: 'laborCostsMonthlyTotal',
						templet: function(d){
							if(d.laborCostsMonthlyTotal){
			                     return fmoney(d.laborCostsMonthlyTotal, 2);
			                }else{
			                     return "-";
			                }
						}
					}, {
						title: '劳务税',
						align: 'center',
						field: 'laborTax',
						templet: function(d){
							if (d.laborTax) {
				              return fmoney(d.laborTax, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '劳务税月总计',
						align: 'center',
						field: 'laborTaxMonthlyTotal',
						templet: function(d){
							if (d.laborTaxMonthlyTotal) {
				              return fmoney(d.laborTaxMonthlyTotal, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '税后金额',
						align: 'center',
						field: 'afterTaxAmount',
						templet: function(d){
							if (d.afterTaxAmount) {
				              return fmoney(d.afterTaxAmount, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '打款时间',
						align: 'left',
						field: 'playingTime'
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