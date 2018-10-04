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
              searchOnEnterKey: true,
              searchText: '',
              pagination: true,          //是否显示分页（*）
              sortable: false,           //是否启用排序
              sortName: "billTime",     //排序的字段
              sortOrder: "desc",          //排序方式
              contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
              queryParams: oTableInit.queryParams,//传递参数（*）
              sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
              pageNumber: 1,            //初始化加载第一页，默认第一页
              pageSize: 10,            //每页的记录行数（*）
              pageList: [10], //可供选择的每页的行数（*）
              // strictSearch: true,
              // clickToSelect: true,        //是否启用点击选中行
              // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
              cardView: false,          //是否显示详细视图
              detailView: false,          //是否显示父子表
              showPaginationSwitch: true,

              ajaxOptions:{
            	  beforeSend: function(request){
        				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
        			}
              },
            responseHandler:function(res){
                if(res.code == 1){
                    res.total = res.data.total;
                    //$('#sum').text(res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2));
                    totalAmount = res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
                    minAmount = res.data.minSum == null ? "0.00" : parseFloat(res.data.minSum).toFixed(2);
                    res.rows = res.data.list;
                    return res;
                }
            },
            columns: [
				{
                field: 'Number', title:'序号', align : "center", width: 80, sortable: true,
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
                },//流水号
                { field: 'profitTypeStr', title:'盈利类型', width: 150, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res="-";
                        }else{
                            return res;
                        }
                    }
                },//盈利类型
                /*{ field: 'billTypeStr', title:'交易类型', width: 150, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res="-";
                        }else{
                            return res;
                        }
                    }
                },*/  //交易类型
				{ field: 'accountName', title:'账户名称', width: 150, align : "center", 
					formatter: function(res){
                        if(res==null){
                            return '-';
                        }else{
                            return res;
                        }
                    }
				}, //账户名称
				{ field: 'phone', title:'手机号码', width: 150, align : "center", 
					formatter: function(res){
                        if(res==null){
                            return '-';
                        }else{
                            return res;
                        }
                    }
				}, //手机号码
				{ field: 'billMark', title:'交易内容', width: 150, align : "center", 
					formatter: function(res){
                        if(res==null){
                            return '-';
                        }else{
                            return res;
                        }
                    }
				}, // 交易内容
				{ field: 'money', title:'收入金额', width: 150, align : "center",
					formatter: function(money){
						return fmoney(money, 2);
					}
				},// 金额格式化  // 收入金额
				{ field: 'billTime', title:'交易时间',  sortable: true, width: 160, align : "center" },// 收入时间
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
        var cmd = "profitExtractLog/selProfitDetail";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
        var station=$('#accountnamer').val();
        var serialNo = $('#serial').val();
        var profitType = "4";
        //var selectplate=$("#selectplate option:selected").text();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();

        //jsonData = "{'accountName':'"+station+"','profitType':'"+profitType+"','billTimeStart':'"+startTimes+"','billTimeEnd':'"+endTimes+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";

        var jsonData = {
        		accountName:station,
        		profitType: profitType,
        		billTimeStart: startTimes,
        		billTimeEnd: endTimes,
        		serialNo: serialNo,
        		pageNo: pageNo,
        		pageSize: pageSize
            }

        return {
            cmd: cmd,
            data: JSON.stringify(jsonData),
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
            var station=$('#accountnamer').val();
            var profitType = "4";
            //var selectplate=$("#selectplate option:selected").text();
            var startTimes=$('#qBeginTime').val();
            var endTimes=$('#qEndTime').val();

            jsonData = "{'accountName':'"+station+"','profitType':'"+profitType+"','billTimeStart':'"+startTimes+"','billTimeEnd':'"+endTimes+"'}";

            var excelUrl = reqAjax('payExcel/exportAccountProfitDetail', jsonData);
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

