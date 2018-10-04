var oTable;
var laborCostsSum = "";
var laborTaxSum = "";
var totalSaveSum = "";
var shouldSaveSum = "";

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
            uniqueId: "businessType",           //每一行的唯一标识，一般为主键列
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
                	//求各字段数据之和
                	laborCostsSum = res.data.laborCostsSum;
                	laborCostsSum = parseFloat(laborCostsSum).toFixed(2);
        			laborTaxSum = res.data.laborTaxSum;
        			laborTaxSum = parseFloat(laborTaxSum).toFixed(2);
        			totalSaveSum = res.data.totalSaveSum;
        			totalSaveSum = parseFloat(totalSaveSum).toFixed(2);
        			shouldSaveSum = res.data.shouldSaveSum;
        			shouldSaveSum = parseFloat(shouldSaveSum).toFixed(2);
                	
                	res.rows = res.data.list;
                    return res;
                }
            },

            columns: [
              	{field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'businessTypeStr', title:'业务类型', align : "center", width: 80,
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getMonthInfo(\''+row.businessType+'\', \''+row.businessTypeStr+'\')">'+row.businessTypeStr+'</button>';
						return btn;
					}
				},
				{ field: 'laborCostsTotal', title:'劳务费总计', align : "center", width: 80 ,
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},
				{ field: 'laborTaxTotal', title:'劳务税总计', align : "center", width: 150 ,
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},
				{ field: 'totalSave', title:'已存劳务费',  width: 100, align : "center" ,
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},
				{ field: 'shouldSave', title:'应存劳务费', width: 150, align : "center" ,
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},
				{
					field:'_z', title: '操作', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn1 = '<button type="button" class="btn btn-xs btn-link" onclick="openReview('+row.businessType+')">存入劳务费</button>';
						var btn2 = '<button type="button" class="btn btn-xs btn-link" onclick="getStoreDetail(\''+row.businessType+'\', \''+row.businessTypeStr+'\')">历史记录</button>';
						return btn1 + '     ' + btn2;
					}
				}
			],
            onLoadSuccess: function (data) {
				//合计
            	addLine();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "profitExtractLog/laborList";
        
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
    var jsonData = {
		entity: {
			merchantName:merchantName,
			name: name,
			serialNumber: serialNumber,
			taxType: '劳务报税',
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


//存入按钮
function openReview(extractType){
	var tempRow = $('#table').bootstrapTable('getRowByUniqueId', extractType);
	layer.open({
	  type: 1,
	  area: ['800px', '500px'],
	  fix: false, //不固定
	  maxmin: false,
	  title : "劳务费存入",
	  content: template('reviewTpl',{
		  
	  }),
	  success: function(layero, index){
		
		$('#sendBtn').on('click', function(){
			var name = yyCache.get("username");
			var yyUserName = $('#yyUserName').val();
			var amount = $("#money").val();					
			var yyUserId = yyCache.get("userId");

			if(!(amount && amount)){
				layer.msg('请填写存入金额');
				return;
			}else if(!amountCheck(amount)){
				layer.msg('请正确输入金额');
				return;
			}else if(amount > tempRow.shouldSave){
				layer.msg('存入金额超过剩余可存入的金额,请重新输入');
				return;
			}else if(!(yyUserName && yyUserName)){
				layer.msg('存入人不能为空');
				return;
			}
			
			var data = {
				t: {
					yyUserId:yyUserId,
					yyUserName:yyUserName,
					yyName:name,
					extractMoney:amount,
					extractType:extractType
				}
			};
			var res = reqAjax('profitExtractLog/addLaborProfitExtractLog', JSON.stringify(data));
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
	if( /^(0{1}|[1-9]\d*)(\.\d{0,2})?$/.test(obj)){
		if(obj <= 0) {
			return false;
		}
		return true;
		}
		return false;

}
	
function getMonthInfo(businessType, businessTypeStr){
	
	var name = businessTypeStr + "劳务费存入月统计";
	var url = "finance/profitExtract/laborCostStoreMonthlyInfo.html?businessType="+businessType;
	addTabs(url, name);	
}

function getStoreDetail(businessType, businessTypeStr){
	var name = businessTypeStr + "劳务费存入明细";
	var scale = 'all';
	var url = "finance/profitExtract/laborCostStoreLog.html?businessType="+businessType+"&scale="+scale;
	addTabs(url, name);	
}

function addLine(){
	var htmlTxt = "<tr> "
    + "<td align='center'><label class='notice'>合计</label></td>"
    + "<td align='center'>——</td>"
    + "<td align='center'>"+laborCostsSum+"</td>"
    + "<td align='center'>"+laborTaxSum+"</td>"
    + "<td align='center'>"+totalSaveSum+"</td>"
    + "<td align='center'>"+shouldSaveSum+"</td>"
    + "<td align='center'>——</td>"
    + "</tr>";

	$('#table').append(htmlTxt);
}


	