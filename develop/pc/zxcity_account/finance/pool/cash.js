
$(function () {
    var oTable = new TableInit();
    oTable.Init();
});

var TableInit = function () {
    var oTableInit = new Object();

    oTableInit.Init = function () {
        $('#table').bootstrapTable({
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
            sortName : "applyTime",     //排序的字段
            sortOrder: "desc",          //排序方式
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 10,            //每页的记录行数（*）
            // pageList: [10, 25, 50, 100],    //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "desc",
            
            showPaginationSwitch: true,
            apikey: sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'),
            responseHandler:function(res){
                if(res.code == 1){
                    res.total = res.data.total;
                    $('#sum').text(res.data.sum);
                    res.data = res.data.list;
                    return res;
                }
            },
            columns: [
                { field: 'Number', title:'序号', align : "center", width: 50,
                    formatter: function(value,row,index){
                        return index+1;
                    }
                },
                { field: 'ismerchant', title:'账户类别', sortable: true, width: 100, align : "center",
                    formatter: function(res){
                        if(res=='0'){
                            return '平台用户';
                        }else if(res=='-1'){
                            return '所有';
                        }else if(res=='1'){
                            return '商户';
                        }
                    } 
                },// 账户类别
                { field: 'accountName', title:'账户名称', sortable: true, width: 150, align : "center" ,
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                }, //账户名称
                { field: '', title:'姓名', sortable: true, width: 150, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                }, //姓名
                { field: 'accountNo', title:'电话号码', sortable: true, width: 150, align : "center" }, // 电话号码
                { field: 'createtime', title:'注册时间',  sortable: true, width: 170, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                },// 注册时间
                { field: 'amount', title:'提现金额', sortable: true, width: 150, align : "center",
                    formatter: function(res){
                        return fmoney(res, 2);
                    }
                }, // 金额格式化 // 提现金额
                // { field: 'merchantType', title:'手续费', sortable: true, width: 150, align : "center",
                //     formatter: function(money){
                //         return fmoney(money, 2);
                //     }
                // }, // 金额格式化 // 手续费
                { field: 'accountBalance', title:'余额', sortable: true, width: 150, align : "center",
                    formatter: function(res){
                        return fmoney(res, 2);
                    }
                }, // 金额格式化 // 余额
                { field: 'remark', title:'备注', sortable: true, width: 300, align : "center",
                    formatter: function(remark){
                        var note='<div class="note">'+newStrByNum(remark,20)+'</div>'
                        return note;
                    }
                },//备注
                { field: 'remark', title:'操作', sortable: true, width: 150, align : "center",
                    formatter: function(remark){
                        var note='<div class="">查看</div>'
                        return note;
                    }
                }//操作
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
        var cmd = "payTransactionLog/withdrawCash";
        var jsonData="";
        var pageNo = params.pageNumber;
        var pageSize = params.pageSize;
        var version = "1";
        var station=$('#accountnamer').val();
        var selectplate=$("#selectplate option:selected").text();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();

        if(selectplate=='-- 全部 --'){
           selectplate='-1';
        }else if(selectplate=='商户'){
           selectplate='1';
        }else if(selectplate=='平台用户'){
           selectplate='0';
        };

        if($('#accountnamer').val() =="" && startTimes ==""){
            jsonData = "{'ismerchant':'"+selectplate+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        }else if(startTimes !=="" && endTimes ==""){
            jsonData = '{"ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}';
        }else if(startTimes !=="" && endTimes !==""){
            jsonData = '{"ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'","applyTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}';
        }else{
            jsonData = "{'ismerchant':'"+selectplate+"','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        }

        return {
            sort: params.sort,
            order: params.order,
            page: params.offset/params.limit+1,
            rows: params.limit,
            cmd: cmd,
            data: jsonData,
            version: version
        }
    };
    return oTableInit;

};
    
    //查询搜索事件
    $("#searchbtn").bind("click", function(){
        $('#table').bootstrapTable('refresh');
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

            if(selectplate=='-- 全部 --'){
               selectplate='-1';
            }else if(selectplate=='商户'){
               selectplate='1';
            }else if(selectplate=='平台用户'){
               selectplate='0';
            };

            if($('#accountnamer').val() =="" && startTimes ==""){
                jsonData = "{'ismerchant':'"+selectplate+"'}";
            }else if(startTimes !=="" && endTimes ==""){
                jsonData = '{"ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'"}';
            }else if(startTimes !=="" && endTimes !==""){
                jsonData = '{"ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'","applyTimeEnd":"'+endTimes+' 23:59:59'+'"}';
            }else{
                jsonData = "{'ismerchant':'"+selectplate+"','accountName':'"+station+"'}";
            }

            var excelUrl = reqAjax('payExcel/exportWithdrawCash', jsonData);
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


