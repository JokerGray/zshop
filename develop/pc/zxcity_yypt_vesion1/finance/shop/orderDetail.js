var oTable;

$(function () {
	//获取跳转前页面传参
	var startTime = getRequestAddressUrlParameter("startTime");
	var endTime = getRequestAddressUrlParameter("endTime");
	var status = getRequestAddressUrlParameter("status");
	var bussinessType = getRequestAddressUrlParameter("bussinessType");
	
    // 设置本月起止日期
    $('#qBeginTime').val(startTime);
    $('#qEndTime').val(endTime);
    
    if(bussinessType && bussinessType == 1){
    	//设置状态
    	$('#selectview2').val(status);
	    $('#selectview2').selectpicker('render');
	    $('#selectview2').selectpicker('refresh');
    }else{
    	$('#select').hide();
    }
    
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
            //sortName : "transTime",     //排序的字段
            //sortOrder: "desc",          //排序方式
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 10,            //每页的记录行数（*）
            pageList: [10], //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "desc",

            showPaginationSwitch: true,

            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	// 获取服务端返回的list
                	// 获取服务端返回的合计金额(sum)
                	res.total = res.data.total;
                	totalAmount = res.data.sum;
                	//保留两位小数
                	totalAmount = totalAmount.toFixed(2);
                	minAmount = res.data.minSum == null ? "0.00" : parseFloat(res.data.minSum).toFixed(2);
                	res.rows = res.data.list;
                    return res;
                }
            },
            
            columns: [
				{ field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'orderNo', title:'订单编号',  width: 150, align : "center" }, //订单编号
				{ field: 'amount', title:'订单金额', align : "center", width: 80,
					formatter: function(money){
						return fmoney(money,2);
					}
				},//订单金额
				{ field: 'realMoney', title:'实际支付金额',  width: 150, align : "center",
					formatter: function(money){
						if(money != null ){
							return fmoney(money,2);
						}
						return "-";
					}
				}, //实际支付金额
				{ field: 'orderStatus', title:'订单状态',  width: 150, align : "center",
					formatter: function(res){
						if(res == 0){
							return  "待发货";
						}else if(res == 1){
							return  "配送中";
						}else if(res == 2){
							return  "已收货";
						}else if(res == 3){
							return  "配送失败";
						}else if(res == 4){
							return  "取消";
						}else if(res == 5){
							return  "异常订单";
						}else if(res == 6){
							return  "已退货";
						}
						return "-";
					}
				}, // 订单状态   /待发货0 /配送中1 /已收货2 / 配送失败3 /取消4 /异常订单5 /已退货6
				{ field: 'payType', title:'支付方式',  width: 100, align : "center",
					formatter: function(res){
						if(res == 0){
							return  "货到付款";
						}else if(res == 1){
							return  "在线支付";
						}else if(res == 2){
							return  "支付宝支付";
						}else if(res == 3){
							return  "微信支付";
						}
						return "-";
					}
				},// 支付方式（货到付款0，在线支付1，支付宝支付2，微信支付3）
				{ field: 'payStatus', title:'支付状态', width: 150, align : "center",
					formatter: function(res){
						if(res == 0){
							return  "未支付";
						}else if(res == 1){
							return  "成功";
						}else if(res == 2){
							return  "失败";
						}
						return "-";
					}
				
				},// 支付状态（未支付0，成功1，失败2）
				{ field: 'contactName', title:'顾客姓名', width: 150, align : "center",
					formatter: function(res){
						if(res){
							return res;
						}
						return "-";
					}
				},// 顾客姓名
				{ field: 'contactMobile', title:'顾客联系电话', width: 160, align : "center",
					formatter: function(res){
						if(res){
							return res;
						}
						return "-";
					}
				}, //顾客联系电话
				{ field: 'createTime', title:'创建时间',  width: 150, align : "center" } //创建时间
			],
            onLoadSuccess: function (data) {
                //layer.msg('加载成功');
            	callBack();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payTransactionLog/orderDetail";
        
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
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    var status = "";
    var contactName = $("#accountnamer").val();
    var bussinessType = getRequestAddressUrlParameter("bussinessType");
    var phone = $('#phone').val();
    var relationNo = $('#relationNo').val();
    if(bussinessType && bussinessType == 1){
    	status = $('#selectview2').val();
    }else{
    	status = -2;
    }
    
    var jsonData = {
		status: status,
		contactName: contactName,
		bussinessType: bussinessType,
		phone: phone,
    	relationNo: relationNo,
		startTime: startTimes,
		endTime: endTimes
    };
    if(pageNo && pageSize){
    	jsonData.pageNo = pageNo;
    	jsonData.pageSize = pageSize;
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
            var excelUrl = reqAjax('payExcel/exportOrderDetail', getSearchParam());
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
    
