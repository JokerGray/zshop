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
            sortName : "transactionTime",     //排序的字段
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
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	res.rows = res.data.list;
                	totalAmount = res.data.sum == null ? "0.00" : parseFloat(res.data.sum).toFixed(2);
                    minAmount = res.data.minSum == null ? "0.00" : parseFloat(res.data.minSum).toFixed(2);
                    return res;
                }
            },
            columns: [
                { field: 'Number', title:'序号', align : "center", width: 80,
                    formatter: function(value,row,index){
                        return index+1;
                    }
                },
                /*{ field: 'accountNo', title:'账户类别', width: 150, align : "center",// 账户类别
                    formatter: function(res){
                        if(res==0){
                            return '免费试用';
                        }else if(res==1){
                            return '正式用户';
                        }else if(res==2){
                            return '会员';
                        }else if(res==3){
                            return '散户';
                        }else{
                            return '-';
                        }
                    } 
                },*/
                { field: 'accountName', title:'买家账户名称', width: 150, align : "center",
                	formatter:function(res,row){
                        if(res && res){
                            return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+row.id+')">'+res+'</button>';
                        }
                  }
                }, //账户名称
                //{ field: 'userName', title:'姓名', width: 150, align : "center", //姓名
                //	formatter: function(res,data){
					//	if(res == null){
					//		return '-';
					//	}else{
					//		return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+data.id+')">'+res+'</button>';
					//	}
			     //   }
                //},
                { field: 'phone', title:'电话号码', width: 150, align : "center", // 电话号码
                	formatter:function(res){
                        if(res && res) {
                            return res;
                        }
                    }
                },
                {
                    field: 'mjdpmc',
                    title: '商户名称',
                    width: 150,
                    align: 'center',
                    formatter: function(data,row){
                        if(row.saleUserId && row.saleUserId){
                            return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+row.saleUserId+')">'+row.saleUserName+'</button>';
                        }
                    }
                },
                {
                    field: 'saleUserPhone',
                    title: '商户电话',
                    width: 150,
                    align: 'center',
                    formatter:function(res){
                        if(res && res) {
                            return res;
                        }
                    }
                },
                {
                    field: 'ddh',
                    title: '订单号',
                    width: 150,
                    align: 'center',
                    formatter: function(res,row){
                        if(row.relationNo && row.relationNo){
                            return '<button type="button" class="btn btn-xs btn-link" onclick="openOrderView(\''+row.relationNo+'\')">'+row.relationNo+'</button>';
                        }
                    }
                },
                { field: 'transactionTime', title:'交易时间', sortable: true, width: 200, align : "center" ,// 交易时间
                    formatter:function(value,row,index){
//                        return getYMDHmm(value);
                        if(value==null){
                            return value="-";
                          }else{
                            return getYMDHmm(value);
                          }
                    }
                },
                { field: 'transactionAmount', title:'交易金额', width: 150, align : "center",
                    formatter: function(res){
                        return fmoney(res, 2);
                    }
                }, // 金额格式化
                { field: 'remark', title:'备注', width: 300, align : "center",
                    formatter: function(remark){
                        if(remark==""){
                            remark='-';
                        }else{
                          var note='<div class="note" title="remark">'+newStrByNum(remark,20)+'</div>'
                          return note;
                        }
                    }
                }//备注
                /*
                { field: 'remark', title:'操作', width: 150, align : "center",//操作
                    formatter: function(remark){
                        var note='<div class="">查看</div>'
                        return note;
                    }
                }
                */
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
        var cmd = "payStatistics/selScBusinessWithOutComplete";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        // var pageNo = params.pageNumber;
        var pageSize = params.limit;
        var version = "1";
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
        var station=$('#accountnamer').val();
        var merchantOrgName = $('#merchantOrgName').val();
        var selectview=$("#selectview1 option:selected").text();
        var phone = $('#phone').val();

        if(selectview=='-- 全部 --'){
            selectview='-1';
        }else if(selectview=='免费试用'){
            selectview='0';
        }else if(selectview=='正式'){
            selectview='1';
        }else if(selectview=='会员'){
            selectview='2';
        }else if(selectview=='散户'){
            selectview='3';
        }

        if(startTimes ==""){
            jsonData = "{'dataTable':{'phone':'"+phone+"','accountNo':'"+selectview+"','saleUserName':'"+merchantOrgName+"','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}}";
        }else if(startTimes !=="" && endTimes ==""){
            jsonData = '{"dataTable":{"phone":"'+phone+'","accountNo":"'+selectview+'","saleUserName":"'+merchantOrgName+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","pageNo":"'+pageNo+'","pageSize":"'+pageSize+'"}}';
        }else if(startTimes !=="" && endTimes !==""){
            jsonData = '{"dataTable":{"phone":"'+phone+'","accountNo":"'+selectview+'","saleUserName":"'+merchantOrgName+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":"'+pageNo+'","pageSize":"'+pageSize+'"}}';
        };

        

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
            var startTimes=$('#qBeginTime').val();
            var endTimes=$('#qEndTime').val();
            var station=$('#accountnamer').val();
            var selectview=$("#selectview1 option:selected").text();
            var phone = $('#phone').val();

            if(selectview=='-- 全部 --'){
                selectview='-1';
            }else if(selectview=='免费试用'){
                selectview='0';
            }else if(selectview=='正式'){
                selectview='1';
            }else if(selectview=='会员'){
                selectview='2';
            }else if(selectview=='散户'){
                selectview='3';
            };

            if(startTimes ==""){
                jsonData = "{'dataTable':{'phone':'"+phone+"','accountNo':"+selectview+",'accountName':'"+station+"}}";
            }else if(startTimes !=="" && endTimes ==""){
                jsonData = '{"dataTable":{"phone":"'+phone+'","accountNo":'+selectview+',"accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'"}}';
            }else if(startTimes !=="" && endTimes !==""){
                jsonData = '{"dataTable":{"phone":"'+phone+'","accountNo":'+selectview+',"accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'"}}';
            };
            
            var excelUrl = reqAjax('payExcel/exportScBusinessWithOutComplete', jsonData);
            //2.获取下载URL
            excelFilePathName = excelUrl.data;
            //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
            if(""!=excelFilePathName){
                var aIframe = document.createElement("iframe"); 
                aIframe.src = excelFilePathName;
                aIframe.style.display = "none";
                document.body.appendChild(aIframe); 
            }
        }catch(e){ 
            alert("异常："+e);
        } 
    });

// 打开订单详情
function openOrderView(id){
    layer.open({
        type: 2,
        area: ['980px', '600px'],
        fix: false, //不固定
        maxmin: true,
        title : "订单详情表",
        content: 'undoneBalance_relation_dialog.html?id='+id,
        success : function() {

        }
    });
}

