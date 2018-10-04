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
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
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
				{ field: 'merchantName', title:'申请商户', align : "center", width: 150 },
				/*{ field: 'applyTotalAmount', title:'申请总金额',  width: 100, align : "center" ,
					formatter: function(value){
						return fmoney(value,2);
					}
				},*/
				{ field: 'laborCount', title:'劳务结算次数', width: 150, align : "center",
					formatter: function(value){
						return value && value ? fmoney(value,2) : null;
					}

				},
				{ field: 'laborTotalAmount', title:'劳务结算总金额', width: 160, align : "center" ,
					formatter: function(value){
						return value && value ? fmoney(value,2) : null;
					}
				},
				{ field: 'laborTaxTotalAmount', title:'扣税总金额',  width: 150, align : "center",
					formatter: function(value){
						return value && value ? fmoney(value,2) : null;
					}
				},
				{ field: 'enterpriseCount', title:'企业结算次数',  width: 150, align : "center"  },
				{ field: 'enterpriseTotalAmount', title:'企业结算总金额', width: 160, align : "center" ,
					formatter: function(value){
						return fmoney(value,2);
					}
				},
				{ field: 'paymentTotalAmount', title: '支付总金额(人民币)', align: 'center', width: 160 ,
					formatter: function(value){
						return fmoney(value,2);
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
        var cmd = "anchorManager/merchantCountList";
        
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
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    var name = $('#name').val();
    var serialNumber = $('#serialNumber').val();
    var jsonData = {
		t: {
			commissionType:0,//0-佣金审核记录; 1-发票审核记录 根据此字段拼接in查询
			merchantName:merchantName,
			name: name,
			serialNumber: serialNumber,
			startTime: startTimes,
			endTime: endTimes
		}
    }
    if(pageNo && pageNo){
    	jsonData.t.pageNo = pageNo;
    	jsonData.t.pageSize = pageSize;
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
            var excelUrl = reqAjax('anchorManager/merchantCountListExport', getSearchParam());
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
	
	
	