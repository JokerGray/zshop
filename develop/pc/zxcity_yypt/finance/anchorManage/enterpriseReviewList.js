var oTable;
$(function () {
    oTable = new TableInit();
    oTable.Init();
});

var TableInit = function () {
    var oTableInit = new Object();

    oTableInit.Init = function () {
        $('#table').bootstrapTable('destroy').bootstrapTable({
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
            queryParams: oTableInit.queryParams,//传递参数（*）
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
      				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	// 获取服务端返回的list
                	// 获取服务端返回的合计金额(sum)
                	res.total = res.data.total;
                	//totalAmount = res.data.sum;
                	res.rows = res.data.list;
                    return res;
                }
            },

            columns: [
				{
					field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'serialNumber', title:'流水号', align : "center", width: 80 },
				{ field: 'merchantName', title:'申请商户', align : "center", width: 150 },
				{ field: 'invoiceNo', title:'发票号',  width: 100, align : "center" },
				{ field: 'money', title:'猪仔数量', width: 160, align : "center" },
				{ field: 'payMoney', title:'支付金额(人民币)',  width: 150, align : "center",
					formatter: function(value,row,index){
						return fmoney(row.realMoney, 2);
					}
				},
				{ field: 'createTime', title:'申请时间', width: 160, align : "center" },
				{
					field:'invoiceBtn', title: '发票审核', align: 'center', width: 160,
					formatter: function(value,row,index){
						//alert(row.reviewStatus);
						if(row.reviewType == 1 && row.reviewStatus == 1){
							return '已审核';
						}else if(row.reviewType == 1 && row.reviewStatus == 2){
							return '已过期';
						}
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="openInvoiceReview('+row.id+')">发票审核('+row.overDay+'天)</button>';
						return btn;
					}
				},
				{
					field:'msgBtn', title: '消息发送', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="openMsg('+row.id+')">消息发送</button>';
						return btn;
					}
				},
				{
					field:'_z', title: '财务审核', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn = '发票待审';
						if(row.reviewType == 1 && row.reviewStatus == 1){
							btn = '<button type="button" class="btn btn-xs btn-link" onclick="openReview('+row.id+')">审核</button>';
							return btn;
						}
						
					}
				}
			],
            onLoadSuccess: function (data) {
				//合计
            	//callBack();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "anchorManager/laborCostsReviewList";
        
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
		var jsonData = getSearchParam(pageNo, pageSize);
        return {
            cmd: cmd,
            data: jsonData,
            version: version
        }
    };
    return oTableInit;

};

// 拼接查询参数
function getSearchParam(pageNo, pageSize){
	var merchantName=$('#merchantName').val();
    //var startTimes=$('#qBeginTime').val();
    //var endTimes=$('#qEndTime').val();
    var name = $('#name').val();
    var serialNumber = $('#serialNumber').val();
	var invoiceNo = $('#invoiceNo').val();
    var jsonData = {
		entity: {
			merchantName:merchantName,
			invoiceNo: invoiceNo,
			serialNumber: serialNumber,
			taxType: '企业报税',
			'status': 0
		}
    }
    if(pageNo && pageNo){
    	jsonData.entity.pageNo = pageNo;
    	jsonData.entity.pageSize = pageSize;
    }else{
    }
    return JSON.stringify(jsonData);
}

    //查询搜索事件
    $("#searchbtn").bind("click", function(){
        oTable.Init();
        accountDynamicColumn.initCookie();
    });

    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() {
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var excelUrl = reqAjax('anchorManager/laborCostsReviewListExport', getSearchParam());
            if(excelUrl.code != 1){
				layer.msg(excelUrl.msg);
			} else {
				//2.获取下载URL
	            excelFilePathName = excelUrl.data;
	            //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
	            if(""!=excelFilePathName){
	                var aIframe = document.createElement("iframe");
	                aIframe.src = excelFilePathName;
	                aIframe.style.display = "none";
	                document.body.appendChild(aIframe);
	            }
			}
        }catch(e){
            alert("异常："+e);
        }
    });

	//发票审核提交按钮
	function openInvoiceReview(id){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', id);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  btn: ['提交'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "主播企业发票审核",
		  content: template('invoiceTpl',{
			  row: tempRow
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
						reviewId: id,
						reviewRemark: $('#comment').val(),
						reviewInvoiceCompany: co,
						reviewInvoiceTin: tin,
						reviewInvoiceAmount: amt,
						reviewStatus: stat,
						reviewSerialNumber: tempRow.serialNumber,
						reviewType: 1//0-劳务审核;1-发票审核;2-企业审核
				  },
				  invoiceLog: {
					  serialNo: tempRow.serialNumber,
					  merchantId: tempRow.merchantId,
					  amount: tempRow.realMoney,//申报金额
					  pigsCount: tempRow.money,//猪仔数量
					  invoiceNo: tempRow.invoiceNo,//发票号
					  invoiceAmount: amount,//发票金额
					  invoiceCompany: tempRow.invoiceCompany,//发票公司名称
					  invoiceTin: tempRow.invoiceTIN,//发票纳税人识别号
					  status: stat
				  },
				  liveCommissionReviewList: {
					  
						money: tempRow.money
				  }
			};
			
			var res = reqAjax('anchorManager/review', JSON.stringify(data));
			if(res.code == 1){
				layer.msg("成功！");
				layer.close(index);
				oTable.Init();
			}else{
				layer.msg(res.msg);
			}
		  }
		});
	}
	
	//消息发送按钮
	function openMsg(id){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', id);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "消息发送",
		  content: template('reviewMessageTpl',{
			  row: tempRow
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
						oTable.Init();
					}else{
						layer.msg(res.msg);
					}
			 });
			 
			 //加载消息列表
			 $('#tableMsg').bootstrapTable('destroy').bootstrapTable({
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
						request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
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
			
		  }
		});
	}
	
	// 企业审核提交按钮
	function openReview(id){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', id);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "主播企业佣金审核",
		  content: template('reviewTpl',{
			  row: tempRow
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
							reviewSerialNumber: tempRow.serialNumber,
							reviewRemark: $('#comment').val(),
							reviewStatus: stat,
							reviewType: 2//0-劳务审核;1-发票审核;2-企业审核
						},
						liveCommissionReviewList: tempRow
					};
					
					var res = reqAjax('anchorManager/review', JSON.stringify(data));
					if(res.code == 1){
						layer.msg("成功！");
						layer.close(index);
						oTable.Init();
					}else{
						layer.msg(res.msg);
					}
			});
		  }
		});
	}
	
	function amountCheck(obj){
		//debugger;
		if( /^(0{1}|[1-9]\d*)(\.\d{0,2})?$/.test(obj)){
			if(obj < 0) {
				return false;
			}
			return true;
			}
			return false;

	}
	
	