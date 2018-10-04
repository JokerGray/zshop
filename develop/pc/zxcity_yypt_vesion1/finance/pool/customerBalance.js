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
            sortName : "createTime",     //排序的字段
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
                { field: 'Number', title:'序号', align : "center", width: 80, sortable: true,
                    formatter: function(value,row,index){
                        return index+1;
                    }
                },
                { field: 'userType', title:'账户类别',  width: 150, align : "center",
                    formatter: function(res){
                        if(res==0){
                            return 'APP注册';
                        }else if(res==1){
                            return '老板账户';
                        }else if(res==2){
                            return '商户会员';
                        }else if(res==3){
                            return '商户员工';
                        }else if(res==4){
                            return '小程序注册';
                        }else{
                            return '-';
                        }
                    }
                },// 账户类别
                { field: 'accountName', title:'账户名称', width: 150, align : "center",
                    formatter: function(res,data){
						if(res == null){
							return '-';
						}else{
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+data.id+')">'+res+'</button>';
						}
			        }
                }, //账户名称
                { field: 'userName', title:'姓名', width: 150, align : "center" ,
                	formatter:function(value,row,index){
	                    if(value){
	                          return value;
	                    }else{
	                    	return "-";
	                    }
                  }
                }, //姓名
                { field: 'phoneNum', title:'电话号码', width: 150, align : "center" ,
                	formatter:function(value,row,index){
                		if(value){
	                          return value;
	                    }else{
	                    	return "-";
	                    }
                  }
                }, // 电话号码
                { field: 'createTime', title:'注册时间', sortable: true, width: 200, align : "center" ,// 注册时间
                    formatter:function(value,row,index){
//                        return getYMDHmm(value);
                        if(value==null){
                            return value="-";
                          }else{
                            return getYMDHmm(value);
                          }
                    }
                },
                { field: 'accountBalance', title:'余额', width: 150, align : "center",
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
            	callBack();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payStatistics/selectAllUserAccountBalance";
        var jsonData="";
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
        var station=$('#accountnamer').val();
        var selectplate=$("#selectplate option:selected").val();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();
        var phone = $('#phone').val();

      

        if(startTimes ==""){
//            jsonData = "{'dataTable':{'userType':'"+selectplate+"','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}}";
            jsonData = "{'dataTable':{'accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+",'userType':"+selectplate+"}}";
        }else if(startTimes !=="" && endTimes ==""){
//            jsonData = '{"dataTable":{"userType":"'+selectplate+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}}';
            jsonData = '{"dataTable":{"accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+',"userType":'+selectplate+'}}';
        }else if(startTimes !=="" && endTimes !==""){
//            jsonData = '{"dataTable":{"userType":"'+selectplate+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}}';
            jsonData = '{"dataTable":{"accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+',"userType":'+selectplate+'}}';
        };

        jsonData = {
    		dataTable : {
    			accountName : station,
    			createTimeStart : startTimes,
    			createTimeEnd : endTimes ? (endTimes + ' 23:59:59') : endTimes,
    			phoneNum : phone,
    			pageNo : pageNo,
    			pageSize : pageSize,
    			userType : selectplate
    		}	
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
            var selectplate=$("#selectplate option:selected").text();
            var startTimes=$('#qBeginTime').val();
            var endTimes=$('#qEndTime').val();

            if(selectplate=='APP注册'){
                selectplate='0';
            }else if(selectplate=='商户注册'){
               selectplate='1';
            }else if(selectplate=='商户会员'){
               selectplate='2';
            }else if(selectplate=='-- 全部 --'){
            	selectplate='';
            }

            if(startTimes ==""){
                jsonData = "{'dataTable':{'userType':'"+selectplate+"','accountName':'"+station+"'}}";
            }else if(startTimes !=="" && endTimes ==""){
                jsonData = '{"dataTable":{"userType":"'+selectplate+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'"}}';
            }else if(startTimes !=="" && endTimes !==""){
                jsonData = '{"dataTable":{"userType":"'+selectplate+'","accountName":"'+station+'","createTimeStart":"'+startTimes+' 00:00:00'+'","createTimeEnd":"'+endTimes+' 23:59:59'+'"}}';
            };
            
            var excelUrl = reqAjax('payExcel/exportAllUserAccountBalance', jsonData);
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

