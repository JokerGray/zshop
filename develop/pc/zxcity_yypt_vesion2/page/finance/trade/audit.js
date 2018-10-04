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
	
	//获取url传参, 初始化日期控件
	var startTime = getRequestAddressUrlParameter("startTime");
	var endTime = getRequestAddressUrlParameter("endTime");
	$('#startDate').val(startTime);
    $('#endDate').val(endTime);
    
	
	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload()
	})
	
	//审核通过
    $("#auditYes").bind("click", function(event) {
    	//获取选中行
    	var checkStatus = table.checkStatus('merchantTable'); 
    	var selRow = checkStatus.data;
    	
    	if(selRow && selRow.length > 0){
    		 $.each(selRow, function (i, data) {
                 var params="";
                 var id = data.id;
                 var state = data.state;
                 var remark = data.remark;
                 if(state=='0'){
                     state='1';
                     params = '{"id":"'+id+'","state":"'+state+'","remark":"'+remark+'"}';
                     res = reqAjax("payTransactionLog/withdrawCashAudit", params);
                     if(res.code == 1){
                     	layer.msg("操作成功！");
 					 } else {
 						layer.msg(res.msg);
 					 }
                 }else{
                	 alert('不是待审核对象');
                 }        
             });
    	}else{
    		alert("请选择申请对象");
    	}
    	
    	tableInit();
    });


    //审核不通过
    $("#auditNo").bind("click", function(event) {
    	//获取选中行
    	var checkStatus = table.checkStatus('merchantTable'); 
    	var selRow = checkStatus.data;
    	
    	if(selRow && selRow.length > 0){
            $.each(selRow, function (i, data) {
                var params="";
                var id=data.id;
                var state=data.state;
                var remark=data.remark;
                if(state=='0'){
                    state='2';
                    params = '{"id":"'+id+'","state":"'+state+'","remark":"'+remark+'"}';
                    res = reqAjax("payTransactionLog/withdrawCashAudit", params);
                    if(res.code == 1){
                    	layer.msg("操作成功！");
					} else {
						layer.msg(res.msg);
					}
                }else{
                	alert('不是待审核对象');
                }
            });
    	}else{
    		alert('请选择申请对象');
    	}
    	
    	tableInit();
    });
	
    
    //监听工具条
    table.on('tool(merchantTable)', function(obj){
    	var data = obj.data;       //获得当前行数据
        var layEvent = obj.event;  //获得 lay-event 对应的值
        var tr = obj.tr;           //获得当前行 tr 的DOM对象
     
        if(layEvent === 'inspect'){ //自检
        	var parms = {userId: data.userId};
        	var res = reqAjax("accountQualityInspection/doAQIByUserId", JSON.stringify(parms));
        	if(res.code == 1){
    			layer.msg("自检成功！");
    			
    			var status = '<span style="color: red">账户异常</span>';	// 默认自检失败
    			if(res.data == 0){
    				status = '<span style="color: green">账户正常</span>';
    			}
    			//更新
    			obj.update({
    			  inspectionStatus: status,
		          title: '自检状态'
		        });
    		} else {
    			layer.msg(res.msg);
    		}
        }
    });
    
	//封装请求参数
	function getSearchParam(index, limit){
		var station = $('#accountnamer').val();
        var selectplate = $("#selectview1 option:selected").text();
        var startTimes = $('#startDate').val();
        var endTimes = $('#endDate').val();
		var phone = $('#inputPhone').val();

        if(selectplate == '所有'){
           selectplate = '-1';
        }else if(selectplate == '商户'){
           selectplate = '1';
        }else if(selectplate == '平台用户'){
           selectplate = '0';
        };
		
		var params = {
			phone: phone,
			state: "0",
			ismerchant: selectplate,
			accountName: station,
			applyTimeStart: startTimes,
			applyTimeEnd: endTimes,
			pageNo: index,
			pageSize: limit
		}
		return JSON.stringify(params);
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
				var data = res.data.list;
				//合计
				$('#amount').html("合计： " + fmoney(resData.sum, 2));
				
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
						type: 'checkbox',
						width: 70,
						field: 'checkBox'
					}, {
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
						field: 'regularStr'
					}, {
						title: '账户名称',
						align: 'center',
						field: 'accountName',
						templet: function(d){
							if(d.accountName == null){
	                            return '-';
	                        }
	                        return d.accountName;
						}
					}, {
						title: '联系方式',
						align: 'center',
						field: 'phone'
					}, {
						title: '员工姓名',
						align: 'center',
						field: 'employeeName'
					}, {
						title: '账户余额',
						align: 'center',
						field: 'accountBalance',
						templet: function(d){
							return fmoney(d.accountBalance, 2);
						}
					}, {
						title: '提现金额',
						align: 'center',
						field: 'amount',
						templet: function(d){
							return fmoney(d.amount, 2);
						}
					}, {
						title: '申请时间',
						align: 'center',
						field: 'applyTime'
					}, {
						title: '状态',
						align: 'center',
						field: 'stateStr'
					}, {
						title: '备注',
						align: 'center',
						field: 'remark',
						templet: function(d){
							if(d.remark == ""){
	                            return '-';
	                        }else{
	                            var note = '<div>'+newStrByNum(d.remark, 15)+'</div>';
	                            return note;
	                        }
						}
					}, {
						title: '自检状态',
						align: 'center',
						field: 'inspectionStatus',
						templet: function(d){
							if (d.inspectionStatus == "0") {
								return '<span style="color: green">账户正常</span>';
							} else if(d.inspectionStatus == "1"){
								return '<span style="color: red">账户异常</span>';
							} else{
								return "-";
							}
						}
					}, {
						title: '手动自检',
						align: 'center',
						field: 'id',
						toolbar: '#selfCheck'
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