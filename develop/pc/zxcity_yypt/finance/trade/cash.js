
$(function () {
    oTable = new TableInit();
    oTable.Init();
});

var TableInit = function () {
    var oTableInit = new Object();

    oTableInit.Init = function () {
    	
    	$('#table').bootstrapTable("destroy");
    	
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
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "applyTime",     //排序的字段
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
            // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            showPaginationSwitch: true,

            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                    res.total = res.data.total;
                    $('#sum').text(res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2));
                    totalAmount = res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
                    res.rows = res.data.list;
                    return res;
                } else {
                	layer.msg(res.msg);
                }
            },
            columns: [
                { 	
                	field: 'checkBox',
                	title:'选择框',
                	checkbox:true
                },
				{ field: 'Number', title:'序号', align : "center", width: 50,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'serialNo', title:'提现单号',  width: 100, align : "center" }, //提现单号
				{ field: 'regularStr', title:'账户类别',  width: 100, align : "center" },// 账户类别
				{ field: 'accountName', title:'账户名称',  width: 100, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                }, //账户名称
				{ field: 'accountBalance', title:'账户余额', width: 100, align : "center",
					formatter: function(res){
						return fmoney(res, 2);
					}
				}, // 金额格式化 // 账户余额
				{
					field: 'phone', title:'联系方式', width: 100, align : "center"//联系方式
				},
				{
					field: 'employeeName', title:'员工姓名', width: 100, align : "center"//员工姓名
				},
				{ field: 'amount', title:'提现金额', width: 100, align : "center",
					formatter: function(res){
						return fmoney(res, 2);
					}
				}, // 金额格式化 // 提现金额
				// { field: '', title:'手续费', width: 150, align : "center",
				// 	formatter: function(res){
				// 		return fmoney(res, 2);
				// 	}
				// }, // 金额格式化 // 手续费
				// { field: '', title:'是否扣费', width: 100, align : "center",
				// 	formatter: function(res){
				// 		if(res==0){
				// 			return '扣费';
				// 		}else if(res==1){
				// 			return '不扣费';
				// 		}
				// 	} 
				// },// 是否扣费
				// { field: '', title:'支付金额', width: 150, align : "center",
				// 	formatter: function(res){
				// 		return fmoney(res, 2);
				// 	}
				// }, // 金额格式化 // 支付金额
				{ field: 'applyTime', title:'申请时间', sortable: true, width: 200, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                },// 申请时间
				{ field: 'auditTime', title:'审核时间', sortable: true, width: 200, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                },// 审核时间
				{ field: 'stateStr', title:'状态', width: 100, align : "center"},//状态 0 待审核/1 审核通过/2 审核不通过/3 支付完成/4 退回申请
				{ field: 'remark', title:'备注', align : "center",
					formatter: function(remark){
                        if(remark==""){
                            return remark='-';
                        }else{
                            var note='<div>'+newStrByNum(remark,15)+'</div>'
                            return note;
                        }
					}
				}//备注
			],
            onLoadSuccess: function () {
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
        var cmd = "payTransactionLog/withdrawCash";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
        var station=$('#accountnamer').val();
        var selectplate=$("#selectplate option:selected").text();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
		var phone=$('#inputPhone').val();

        if(selectplate=='-- 全部 --'){
           selectplate='-1';
        }else if(selectplate=='商户'){
           selectplate='1';
        }else if(selectplate=='平台用户'){
           selectplate='0';
        };

        jsonData = '{phone:"'+phone+'","state":"1","ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+'","applyTimeEnd":"'+endTimes+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}';
        
        return {
            cmd: cmd,
            data: jsonData,
            version: version
        }
    };
    return oTableInit;

};
    //查询搜索事件
    $("#searchbtn").bind("click", function(){
        oTable.Init();
        accountDynamicColumn.initCookie();
    });

    //支付
    $("#cashYes").bind("click", function(event) {
        var selectIndex = $('input[name="btSelectItem"]:checked').val();
        var selRow = $('#table').bootstrapTable('getSelections');
        if(selectIndex==undefined){
            alert('请选择支付对象');
        }else{
            var id="";
            $.each(selRow, function (i, data) {
                var params="";
                id+=data.id+',';
            });
            id=id.substring(0, id.length-1);
            params = '{"ids":"'+id+'"}';
            res = reqAjax("payTransactionLog/withdrawCashPay", params);
            if(res.code != 1){
            	layer.msg(res.msg);
            }
        }
        oTable = new TableInit();
		oTable.Init();
        //oTable.Init();
    });

    //退回申请
    $("#cashNo").bind("click", function(event) {
        var selectIndex = $('input[name="btSelectItem"]:checked').val();
        var selRow = $('#table').bootstrapTable('getSelections');
        
        // alert(selectIndex);
        if(selectIndex==undefined){
            alert('请选择退回申请对象');
        }
        /*
        else if(selRow.length != 1){
        	alert('退回申请只能退回单条记录！');
        }
        */
        else{
            $.each(selRow, function (i, data) {
                var params="";
                var id=data.id;
                var state=data.state;
                var remark=data.remark;//状态 0 待审核/1 审核通过/2 审核不通过/3 支付完成/4 退回申请

                if(state=='1'){
                    params = '{"id":"'+id+'","remark":"'+remark+'"}'   
                    res = reqAjax("payTransactionLog/withdrawCashReturn", params);
                    if(res.code != 1){
		            	layer.msg("退回申请成功");
		            } else {
		            	layer.msg(res.msg);
		            }
                }else{
                    alert('只能退回审核通过的数据');
                }
            });
        }
        
        oTable = new TableInit();
		oTable.Init();
        //oTable.Init();
    });

    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() { 
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var jsonData="";
            var station=$('#accountnamer').val();
            var selectplate=$("#selectview1 option:selected").text();
            var startTimes=$('#qBeginTime').val();
            var endTimes=$('#qEndTime').val();
			var phone=$('#inputPhone').val();

            if(selectplate=='-- 全部 --'){
	           selectplate='-1';
	        }else if(selectplate=='商户'){
	           selectplate='1';
	        }else if(selectplate=='平台用户'){
	           selectplate='0';
	        };

            jsonData = '{phone:"'+phone+'","state":"1","ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+'","applyTimeEnd":"'+endTimes+'"}';

            var excelUrl = reqAjax('payExcel/exportWithdrawCash', jsonData);
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


