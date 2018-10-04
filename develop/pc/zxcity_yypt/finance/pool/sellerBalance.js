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
            sortName : "merchantId",     //排序的字段
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
                	res.rows = res.data;
                    return res;
                }
            },
            columns: [
                { field: 'Number', title:'序号', align : "center", width: 80, 
                    formatter: function(value,row,index){
                        return index+1;
                    }
                },
                { field: 'merchantType', title:'商户类型', width: 150, align : "center",// 账户类别
                    formatter: function(res){
                        if(res==1){
                            return '试用商户';
                        }else if(res==0){
                            return '正式商户';
                        } 
                    } 
                },
                { field: 'accountName', title:'账户名称',  width: 150, align : "center",
                    formatter: function(res,data){
						if(res == null){
							return '-';
						}else{
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+data.userId+')">'+res+'</button>';
						}
			        }
                }, //账户名称
                { field: 'merchantName', title:'商户名称',  width: 150, align : "center" }, //商家名称
                { field: 'phone', title:'电话号码',  width: 150, align : "center" }, // 电话号码
                { field: 'createTime', title:'注册时间',  sortable: true, width: 170, align : "center" ,// 交易时间
                    formatter:function(value,row,index){
//                        return getYMDHmm(value);
                        if(value==null){
                            return value="-";
                          }else{
                            return getYMDHmm(value);
                          }
                    }
                },// 交易时间
                { field: 'accountBalacne', title:'余额',  width: 150, align : "center",
                    formatter: function(money){
                        return fmoney(money, 2);
                    }
                } // 金额格式化 // 余额
                /*
                { field: 'remark', title:'操作', width: 150, align : "center",
                    formatter: function(remark){
                        var note='<div class="">查看</div>'
                        return note;
                    }
                }//操作
                */
            ],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payStatistics/selectAllMerchantAccountBalance";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;//每页显示的10行
        var version = "1";
        var station=$('#accountnamer').val();
        var selectview=$("#selectview1 option:selected").text();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
        
        if(selectview=='-- 全部 --'){
            selectview='';
        }else if(selectview=='正式商户'){
            selectview='0';
        }else if(selectview=='试用商户'){
            selectview='1';
        };

        if(startTimes =="" & endTimes ==""){
            jsonData = "{'dataTable':{'merchantType':'"+selectview+"','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}}";
        }else if(startTimes =="" && endTimes !=""){
            jsonData = '{"dataTable":{"merchantType":"'+selectview+'","accountName":"'+station+'","createTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}}';
        }else if(startTimes !=="" && endTimes ==""){
            jsonData = '{"dataTable":{"merchantType":"'+selectview+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}}';
        }else if(startTimes !=="" && endTimes !==""){
            jsonData = '{"dataTable":{"merchantType":"'+selectview+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}}';
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
            var station=$('#accountnamer').val();
            var selectview=$("#selectview1 option:selected").text();
            var startTimes=$('#qBeginTime').val();
            var endTimes=$('#qEndTime').val();
            
            if(selectview=='-- 全部 --'){
                selectview='';
            }else if(selectview=='正式商户'){
                selectview='0';
            }else if(selectview=='试用商户'){
                selectview='1';
            };

            if(startTimes ==""){
                jsonData = "{'dataTable':{'merchantType':'"+selectview+"','accountName':'"+station+"'}}";
            }else if(startTimes !=="" && endTimes ==""){
                jsonData = '{"dataTable":{"merchantType":"'+selectview+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'"}}';
            }else if(startTimes !=="" && endTimes !==""){
                jsonData = '{"dataTable":{"merchantType":"'+selectview+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'"}}';
            };

            var excelUrl = reqAjax('payExcel/exportAllMerchantAccountBalance', jsonData);
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

