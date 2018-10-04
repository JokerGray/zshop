var dataList = "";
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
		dataList: 'anchorManager/laborCostsReviewList', //(查询列表)
		exportExcel: 'anchorManager/laborCostsReviewListExport'//(下载地址)
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

	//封装请求参数
	function getSearchParam(index, limit){
		var merchantName=$('#merchantName').val();
		var name = $('#name').val();
	    var serialNumber = $('#serialNumber').val();
		var invoiceNo = $('#invoiceNo').val();
		var startTimes=$('#startDate').val();
	    var endTimes=$('#endDate').val();
		
	    var parms = {
    		entity: {
    			merchantName:merchantName,
    			invoiceNo: invoiceNo,
    			serialNumber: serialNumber,
    			taxType: '企业报税',
    			status: 0,
    			startTime : startTimes,
    			endTime : endTimes
    		}
        }
	    if(index && limit){
	    	parms.entity.pageNo = index;
	    	parms.entity.pageSize = limit;
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
				dataList = res.data.list;
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
						field: 'eq'
					}, {
						title: '流水号',
						align: 'center',
						field: 'serialNumber'
					}, {
						title: '申请商户',
						align: 'center',
						field: 'merchantName'
					}, {
						title: '发票号',
						align: 'center',
						field: 'invoiceNo'
					}, {
						title: '猪仔数量',
						align: 'center',
						field: 'money'
					}, {
						title: '支付金额(人民币)',
						align: 'center',
						field: 'payMoney',
						templet: function(d){
							return fmoney(d.realMoney, 2);
						}
					}, {
						title: '申请时间',
						align: 'center',
						field: 'createTime'
					}, {
						title: '发票审核',
						align: 'center',
						field: 'invoiceBtn',
						templet: function(d){
							if(d.reviewType == 1 && d.reviewStatus == 1){
								return '已审核';
							}else if(d.reviewType == 1 && d.reviewStatus == 2){
								return '已过期';
							}
							var btn = '<button type="button" class="btn btn-xs btn-link" onclick="openInvoiceReview('+d.LAY_INDEX+')">发票审核('+d.overDay+'天)</button>';
							return btn;
						}
					}, {
						title: '消息发送',
						align: 'center',
						field: 'msgBtn',
						templet: function(d){
							var btn = '<button type="button" class="btn btn-xs btn-link" onclick="openMsg('+d.LAY_INDEX+')">消息发送</button>';
							return btn;
						}
					}, {
						title: '财务审核',
						align: 'center',
						field: '_z',
						templet: function(d){
							var btn = '发票待审';
							if(d.reviewType == 1 && d.reviewStatus == 1){
								btn = '<button type="button" class="btn btn-xs btn-link" onclick="openReview('+d.LAY_INDEX+')">审核</button>';
								return btn;
							}
							return "-";
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


//发票审核提交按钮
function openInvoiceReview(index){     
	if(!index){
		return false;
	}
	//获取当前行数据
	var row = dataList[index - 1];
	
	layer.open({
	  type: 1,
	  area: ['800px', '500px'],
	  btn: ['提交'],
	  fix: false, //不固定
	  maxmin: false,
	  title : "主播企业发票审核",
	  content: template('invoiceTpl',{
		  row: row
	  }),
	  success: function(layero, index){
			
	  },
	  btn1: function(index){
		  var amount = $('#invoiceAmount').val();
		  var stat = $('input[name="reviewStatus"]:checked').val();
		   if(!(stat && stat)){
			  layer.msg('请填写审核意见');
			  return;
		  }else if(!(amount && amount)){
			  layer.msg('请填写发票金额');
			  return;
		  }else if(!amountCheck(amount)){
				layer.msg('请正确输入金额');
				return;
			}
		  var tin = $('input[name="reviewInvoiceTin"]:checked').val();
		  var amt = $('input[name="reviewInvoiceAmount"]:checked').val();
		  var co = $('input[name="reviewInvoiceCompany"]:checked').val();
		  
		  var commissionId = $('#commissionId').val();
		  var data = {
			  commissionRecord:{
					id: commissionId,//发票审核的ID,有值作为修改,无值默认新增发票审核记录
					reviewId: row.id,
					reviewRemark: $('#comment').val(),
					reviewInvoiceCompany: co,
					reviewInvoiceTin: tin,
					reviewInvoiceAmount: amt,
					reviewStatus: stat,
					reviewSerialNumber: row.serialNumber,
					reviewType: 1//0-劳务审核;1-发票审核;2-企业审核
			  },
			  invoiceLog: {
				  serialNo: row.serialNumber,
				  merchantId: row.merchantId,
				  amount: row.realMoney,//申报金额
				  pigsCount: row.money,//猪仔数量
				  invoiceNo: row.invoiceNo,//发票号
				  invoiceAmount: amount,//发票金额
				  invoiceCompany: row.invoiceCompany,//发票公司名称
				  invoiceTin: row.invoiceTIN,//发票纳税人识别号
				  status: stat
			  },
			  liveCommissionReviewList: {
				  
					money: row.money
			  }
		};
		
		var res = reqAjax('anchorManager/review', JSON.stringify(data));
		if(res.code == 1){
			layer.msg("成功！");
			layer.close(index);
			
			init();
		}else{
			layer.msg(res.msg);
		}
	  }
	});
}



//消息发送按钮
function openMsg(index){        
	if(!index){
		return false;
	}
	//获取当前行数据
	var row = dataList[index - 1];
	
	layer.open({
	  type: 1,
	  area: ['800px', '500px'],
	  fix: false, //不固定
	  maxmin: false,
	  title : "消息发送",
	  content: template('reviewMessageTpl',{
		  row: row
	  }),
	  success: function(layero, index){
		 var dialogReviewId = null;
		 var receiverId = $('#receiverId').val();
		 var senderId = sessionStorage.getItem('userId');
		 var content = null;
		 var data = data = {
			 t:{
				 msgSender:senderId,
				 msgReceiver:receiverId,
				 msgContent:content
			 }
		 };
		  //注册发送消息事件
		 $('#sendBtn').on('click', function(){
			  dialogReviewId = $('#dialogReviewId').val();
			  receiverId = $('#receiverId').val();
			  senderId = sessionStorage.getItem('userId');
			  content = $('#comment').val();
			  data = {
				 t:{
					 msgSender:senderId,
					 msgReceiver:receiverId,
					 msgContent:content
				 }
			 };
			 
			 if(!(content && content)){
				 layer.msg('请填写消息内容');
				 return;
			 }
			 
			 var res = reqAjax('anchorManager/sendMsg', JSON.stringify(data));
				if(res.code == 1){
					layer.msg("成功！");
					layer.close(index);
					
					init();
				}else{
					layer.msg(res.msg);
				}
		 });
		 
		 //加载消息列表
/*		 $('#tableMsg').bootstrapTable('destroy').bootstrapTable({
			url: '/zxcity_restful/ws/rest',
			method: 'POST',           //请求方式（*）
			striped: true,           //是否显示行间隔色
			cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
			strictSearch: true,
			showColumns: true,     //是否显示所有的列
			showRefresh: true,     //是否显示刷新按钮
			minimumCountColumns: 2,    //最少允许的列数
			search: true,
			searchOnEnterKey: true,
			searchText: '',
			pagination: true,          //是否显示分页（*）
			sortable: false,           //是否启用排序
			sortName : "payTime",     //排序的字段
			sortOrder: "desc",          //排序方式
			contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
			queryParams: function(params){
				var pageNo = params.offset / params.limit + 1;
				var pageSize = params.limit;
				var version = "1";
				
				data.t.msgSender = null;
				if(pageNo && pageNo){
					data.t.pageNo = pageNo;
					data.t.pageSize = pageSize;
				}else{
				}
				
				var cmd = 'anchorManager/sendMsgList';
				return {
					cmd: cmd,
					data: JSON.stringify(data),
					version: version
				}
			},//传递参数（*）
			sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
			pageNumber:1,            //初始化加载第一页，默认第一页
			pageSize: 10,            //每页的记录行数（*）
			pageList: [10], //可供选择的每页的行数（*）
			// strictSearch: true,
			// clickToSelect: true,        //是否启用点击选中行
			// height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId: "id",           //每一行的唯一标识，一般为主键列
			cardView: false,          //是否显示详细视图
			detailView: false,          //是否显示父子表
			// singleSelect : true,        //是否只能选中一个
			sortOrder: "desc",
			showPaginationSwitch: true,
			ajaxOptions:{
			  beforeSend: function(request){
					request.setRequestHeader("apikey", yyCache.get('apikey') == null ? "test" : yyCache.get('apikey'));
				}
			},
			responseHandler:function(res){
				if(res.code == 1){
					// 获取服务端返回的list
					res.total = res.data.total;
					res.rows = res.data.list;
					return res;
				}
			},
			columns: [
				{
					field: 'Number', title:'序号', align : "center", width: 68,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'msgContent', title:'消息内容', align : "left", width: 700,
					cellStyle:function(){
						return {
							css:{
								'word-break':'break-all'
							}
						}
					}
				},
				{field: 'msgTime', title: '发送时间',width: 200}
				
			]
		});//table end
*/		
	  }
	});
}

// 企业审核提交按钮
function openReview(index){
	if(!index){
		return false;
	}
	//获取当前行数据
	var row = dataList[index - 1];
	
	layer.open({
	  type: 1,
	  area: ['800px', '500px'],
	  fix: false, //不固定
	  maxmin: false,
	  title : "主播企业佣金审核",
	  content: template('reviewTpl',{
		  row: row
	  }),
	  success: function(layero, index){
		  $('#reviewBtn').on('click', function(){
				
				var stat = $('input[name="status"]:checked').val();
				var id = $('#dialogReviewId').val();
				var comment = $('#comment').val();
				
				if(!(stat && stat)){
					layer.msg('请填写审核意见');
					return;
				}else if(!(comment && comment)){
					layer.msg('请填写意见信息');
					return;
				}else if(!(id && id)){
					layer.msg('ID找不到,请联系管理员');
					return;
				}
				
				var data = {
					commissionRecord:{
						reviewId: id,
						reviewSerialNumber: row.serialNumber,
						reviewRemark: $('#comment').val(),
						reviewStatus: stat,
						reviewType: 2//0-劳务审核;1-发票审核;2-企业审核
					},
					liveCommissionReviewList: row
				};
				
				var res = reqAjax('anchorManager/review', JSON.stringify(data));
				if(res.code == 1){
					layer.msg("成功！");
					layer.close(index);
					
					init();
				}else{
					layer.msg(res.msg);
				}
		});
	  }
	});
}

function amountCheck(obj){
	if( /^(0{1}|[1-9]\d*)(\.\d{0,2})?$/.test(obj)){
		if(obj < 0) {
			return false;
		}
		return true;
		}
		return false;

}
