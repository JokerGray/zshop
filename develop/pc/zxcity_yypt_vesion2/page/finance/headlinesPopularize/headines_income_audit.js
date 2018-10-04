var apikey = sessionStorage.getItem("apikey");
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
			dataList: 'scIncomeAudit/selectIncomeAuditList',//(查询列表)
			audit: 'scIncomeAudit/auditOperation'  //(审核)
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
		
		$('#queryStatus').val(queryStatus);
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
			var startTime = $('#startDate').val();
			var endTime = $('#endDate').val();
			
			var parms = {
				pageSize: limit,
				pageNo: index,
				username: username,
			    startTime: startTime,
			    endTime: endTime
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
						title: '选择框',
						align: 'center',
						checkbox: true,
						field: 'choose',
						templet: function(d){
							if(d.auditStatus != 1){
								return {
									disabled: true, //设置是否可用
							        checked: false //设置选中  
								}
							}
							return d.choose;
						}
					}, {
						title: '序号',
						align: 'left',
						field: 'eq'
					}, {
						title: '订单编号',
						align: 'left',
						field: 'tradeNo'
					}, {
						title: '用户名称',
						align: 'left',
						field: 'username'
					}, {
						title: '业务类型',
						align: 'center',
						field: 'businessType',
						templet: function(d){
							if (d.businessType == 1) {
				               return "头条推广";
				            } else if (d.businessType == 2) {
				               return "主播佣金";
				            }
						}
					}, {
						title: '结算金额',
						align: 'left',
						field: 'withdrawMoney',
						templet: function(d){
							if (d.withdrawMoney) {
				              return fmoney(d.withdrawMoney, 2);
				            } else {
				              return "-";
				            }
						}
					}, {
						title: '结算类型',
						align: 'center',
						field: 'withdrawType',
						templet: function(d){
							if (d.withdrawType == 1) {
				               return "个人";
				            } else if (d.withdrawType == 2) {
				               return "企业";
				            }
						}
					}, {
						title: '创建时间',
						align: 'left',
						field: 'createTime'
					}, {
						title: '审核时间',
						align: 'left',
						field: 'updateTime',
						templet: function(d){
							if(d.updateTime){
								return d.updateTime;
							}
							return "-";
						}
					}, {
						title: '审核状态',
						align: 'center',
						field: 'auditStatus',
						templet: function(d){
							if (d.auditStatus == 1) {
								return '申请中';
				            } else if (d.auditStatus == 2) {
				                return '<p style="color:#4cae4c;">成功</p>';
				            } else if (d.auditStatus == 3) {
				                return '<p style="color:#E91E63;">失败</p>';
				            }
						}
					}, {
						title: '描述',
						align: 'center',
						field: 'auditDescription',
						templet: function(d){
							if(d.auditDescription){
								return d.auditDescription;
							}
							return "-";
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
					
					$(".layui-table-body.layui-table-main").find("input[name='layTableCheckbox']").each(function(i){
						if(res.data.length > 0 && res.data[i].auditStatus != 1){
							$(".layui-table-header").find("input[name='layTableCheckbox']").each(function(){
								$(this).attr("disabled", 'disabled').next().removeClass("layui-form-checked");
							})
							$(this).attr("disabled", 'disabled').removeAttr("checked");
							form.render('checkbox');
						}
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
		
		//获取选中行
		function getRows(){
			var checkStatus = table.checkStatus('merchantTable');
			return checkStatus.data;
		}
		
		// 审核通过
		$("#auditSuccess").bind("click", function() {
		  var auditData = getRows();
		  if (auditData.length > 0) {
		    var layers = layer.confirm('确认审核通过吗？', {
		      btn: ['通过', '取消'] //按钮
		    }, function(index) {
		      $.each(auditData, function(index, obj) {
		        if (obj.auditStatus == 1) {
		          var params = {
		            id: obj.id,
		            auditStatus: 2,
		            tradeNo: obj.tradeNo
		          }
		          var cmd = 'scIncomeAudit/auditOperation';
		          var code = requestAjax(cmd, params);
		          if (code == 9) {
		            return false;
		          }
		        }
		      });
		      tableInit();
		      layer.close(layers);
		    });
		  } else {
		    layer.msg('审核数据不能为空');
		  }
		});
		
		// 审核不通过
		$("#auditFailure").bind("click", function downloadFile() {
			var auditData = getRows();
		  if (auditData.length > 0) {
		    var layers = layer.confirm('确认审核不通过吗？', {
		      btn: ['不通过', '取消'] //按钮
		    }, function(index) {
		      $.each(auditData, function(index, obj) {
		        if (obj.auditStatus == 1) {
		          var params = {
		            id: obj.id,
		            auditStatus: 3,
		            tradeNo: obj.tradeNo
		          }
		          var cmd = 'scIncomeAudit/auditOperation';
		          var code = requestAjax(cmd, params);
		          if (code == 9) {
		            return false;
		          }
		        }
		      });
		      tableInit();
		      layer.close(layers);
		    });
		  } else {
		    layer.msg('审核数据不能为空');
		  }
		});

})

//ajax方法
function requestAjax(cmd, params) {
  var code = 1;
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    async: false,
    data: {
      "cmd": cmd,
      "data": JSON.stringify(params),
      "version": '1'
    },
    beforeSend: function(request) {
      request.setRequestHeader("apikey", apikey ? apikey : 'test');
    },
    success: function(re) {
      if (re.code == 1) {} else {
        layer.msg("订单编号：" + params.tradeNo + "," + re.msg);
        code = re.code;
      }
    },
    error: function(re) {
      layer.msg('系统繁忙！');
    }
  });
  return code;
}