var oTable;
$(function () {
	//获取跳转前页面传参
	var startTime = getRequestAddressUrlParameter("startTime");
	var endTime = getRequestAddressUrlParameter("endTime");
	
    // 设置本月起止日期
    $('#qBeginTime').val(startTime);
    $('#qEndTime').val(endTime);
	
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
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "referenceAuditTime",     //排序的字段
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
            // singleSelect : true,        //是否只能选中一个
            showPaginationSwitch: true,

            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
              if(res.code == 1){
                res.total = res.data.total;
                $('#sum').text(res.data.sum);
                res.rows = res.data.list;
                totalAmount = res.data.sum;
                minAmount = res.data.minSum == null ? "0.00" : parseFloat(res.data.minSum).toFixed(2);
                return res;
              }
            },
            columns: [
            { field: 'Number', title:'序号', align : "center", width: 80, sortable: true,
              formatter: function(value,row,index){
                return index+1;
              }
            },
            { field: 'serialNo', title:'流水号', width: 150, align : "center",
                formatter: function(res){
                  if(res==null){
                    return res="-";
                  }else{
                    return res;
                  }
                }
            }, //流水号
            { field: 'merchantName', title:'商户名称', width: 150, align : "center",
                formatter: function(res){
                  if(res==null){
                    return res="-";
                  }else{
                    return res;
                  }
                }
            }, //商户名称
            { field: 'merchantPhone', title:'商户手机号', width: 150, align : "center",
                formatter: function(res){
                  if(res==null){
                    return res="-";
                  }else{
                    return res;
                  }
                }
            }, //商户手机号
            { field: 'upgradeTypeStr', title:'升级类型', width: 150, align : "center",
                formatter: function(res){
                  if(res==null){             
                    return res="-";
                  }else{
                    return res;
                  }
                }
            }, //升级类型   1 合作商户/2 代理商户/3 合作商户续费/4 代理商户续费
            { field: 'applyTime', title:'申请时间',  sortable: true, width: 160, align : "center",
              formatter: function(res){
                if(res==null){
                  return res="-";
                }else{
                  return res;
                }
              }
            },// 申请时间
            { field: 'referenceAuditTime', title:'收入时间',  sortable: true, width: 160, align : "center",
                formatter: function(res){
                  if(res==null){
                    return res="-";
                  }else{
                    return res;
                  }
                }
            },// 收入时间
            { field: 'upgradeAmount', title:'收入金额', width: 150, align : "center",
              formatter: function(money){
                return fmoney(money, 2);
              }
            }// 收入金额
            ],
            onLoadSuccess: function () {
            	callBack();
              //layer.msg('加载成功');
            },
            onLoadError: function(){
              // layer.msg('未检索到**信息');
            }
      });
};

    //得到查询的参数
    oTableInit.queryParams = function (params) {
    	
        var cmd = "profitExtractLog/selMerchantUpgradeProfitDetail";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
        var commissionStatus = "1";
        var onOffLine = "1";
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
        
        
        if(startTimes =="" && endTimes == ""){
          jsonData = "{'pageNo':"+pageNo+",'pageSize':"+pageSize+",'commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
        }else if(startTimes !=="" && endTimes ==""){
          jsonData = "{'referenceAuditTimeStart':'"+startTimes+' 00:00:00'+"','pageNo':"+pageNo+",'pageSize':"+pageSize+",'commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
        }else if(startTimes =="" && endTimes !==""){
          jsonData = "{'referenceAuditTimeEnd':'"+endTimes+' 23:59:59'+"','pageNo':"+pageNo+",'pageSize':"+pageSize+",'commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
        }else if(startTimes !=="" && endTimes !==""){
          jsonData = "{'referenceAuditTimeStart':'"+startTimes+' 00:00:00'+"','referenceAuditTimeEnd':'"+endTimes+' 23:59:59'+"','pageNo':"+pageNo+",'pageSize':"+pageSize+",'commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
        }
        
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

    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() { 
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var jsonData="";
            var commissionStatus = "1";
            var onOffLine = "1";
            var startTimes=$('#qBeginTime').val();
            var endTimes=$('#qEndTime').val();
            
            if(startTimes =="" && endTimes ==""){               
              jsonData = "{'commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
            }else if(startTimes !=="" && endTimes ==""){
              jsonData = "{'referenceAuditTimeStart':'"+startTimes+' 00:00:00'+"','commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
            }else if(startTimes =="" && endTimes !==""){
              jsonData = "{'referenceAuditTimeEnd':'"+endTimes+' 23:59:59'+"','commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
            }else if(startTimes !=="" && endTimes !==""){
              jsonData = "{'referenceAuditTimeStart':'"+startTimes+' 00:00:00'+"','referenceAuditTimeEnd':'"+endTimes+' 23:59:59'+"','commissionStatus':"+commissionStatus+",'onOffLine':"+onOffLine+"}";
            }
            var excelUrl = reqAjax('payExcel/exportMerchantUpgradeProfitDetail', jsonData);
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

