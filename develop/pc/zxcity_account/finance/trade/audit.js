
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
            clickToSelect: true,
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
                { checkbox:true,},
				{ field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
                { field: 'ismerchant', title:'账户类别', width: 100, align : "center",
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
				{ field: 'accountName', title:'账户名称', width: 100, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return '-';
                        }else{
                            return res;
                        }
                    }
                }, //账户名称
				{ field: 'accountBalance', title:'账户余额',  width: 100, align : "center",
                    formatter: function(res){
                        return fmoney(res, 2);
                    }
                }, 
                { field: 'amount', title:'提现金额', width: 100, align : "center",
                    formatter: function(res){
                        return fmoney(res, 2);
                    }
                },
				// { field: '', title:'支付金额',  width: 150, align : "center",
    //                 formatter: function(res){
    //                     if(res==""){
    //                         return res="-";
    //                     }else{
    //                         return fmoney(res, 2);
    //                     }
    //                 }
    //              },// 支付时间
                { field: 'orgName', title:'收款账户',  width: 100, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res="-";
                        }else{
                            return res;
                        }
                    }
                },
                { field: 'applyTime', title:'申请时间',  sortable: true, width: 150, align : "center" },// 申请时间
                { field: 'auditTime', title:'审核时间',  sortable: true, width: 150, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res='-';
                        }else{
                            return res;
                        }
                    }
                },// 申请时间
				{ field: 'stateStr', title:'状态', width: 100, align : "center"},//状态 0 待审核/1 审核通过/2 审核不通过/3 支付完成/4 退回申请
                { field: 'orderNo', title:'订单号', width: 150, align : "center" },// 订单号
                { field: 'remark', title:'备注', width: 200, align : "center",
					formatter: function(remark){
						if(remark==""){
                            return remark='-';
                        }else{
                            var note='<div class="note" title="'+remark+'">'+newStrByNum(remark,15)+'</div>'
                            return note;
                        }
					}
				}//备注
			],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            },
            onLoadError: function() {
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
        var selectplate=$("#selectview1 option:selected").text();
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();

        if(selectplate=='所有'){
           selectplate='-1';
        }else if(selectplate=='商户'){
           selectplate='1';
        }else if(selectplate=='平台用户'){
           selectplate='0';
        };

        if($('#accountnamer').val() =="" && startTimes ==""){
            jsonData = "{'state':'0','ismerchant':'"+selectplate+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        }else if(startTimes !=="" && endTimes ==""){
            jsonData = '{"state":"0","ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}';
        }else if(startTimes !=="" && endTimes !==""){
            jsonData = '{"state":"0","ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'","applyTimeEnd":"'+endTimes+' 23:59:59'+'","pageNo":'+pageNo+',"pageSize":'+pageSize+'}';
        }else{
            jsonData = "{'state':'0','ismerchant':'"+selectplate+"','accountName':'"+station+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
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


    //审核通过
    $("#auditYes").bind("click", function(event) {
        var selectIndex = $('input[name="btSelectItem"]:checked').val();
        var selRow = $('#table').bootstrapTable('getSelections');
 
        if(selectIndex==undefined){
            alert('请选择申请对象');
        }else{
            $.each(selRow, function (i, data) {
                var params="";
                var id=data.id;
                var state=data.state;
                var remark=data.remark;
                if(state=='0'){
                    params = '{"id":"'+id+'","state":"'+state+'","remark":"'+remark+'"}'   
                    res = reqAjax("payTransactionLog/withdrawCashAudit", params);
                }else{
                    alert('不是待审核对象');
                }        
            });
        }
        $('#table').bootstrapTable('refresh');
    });


    //审核不通过
    $("#auditNo").bind("click", function(event) {
        var selectIndex = $('input[name="btSelectItem"]:checked').val();
        var selRow = $('#table').bootstrapTable('getSelections');
        // alert(selectIndex);
        if(selectIndex==undefined){
            alert('请选择不申请对象');
        }else{
            $.each(selRow, function (i, data) {
                var params="";
                var id=data.id;
                var state=data.state;
                var remark=data.remark;
                if(state=='0'){
                    params = '{"id":"'+id+'","state":"'+state+'","remark":"'+remark+'"}'   
                    res = reqAjax("payTransactionLog/withdrawCashAudit", params);
                }else{
                    alert('不是待审核对象');
                }
            });
        }
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

            if(selectplate=='所有'){
               selectplate='-1';
            }else if(selectplate=='商户'){
               selectplate='1';
            }else if(selectplate=='平台用户'){
               selectplate='0';
            };

            if($('#accountnamer').val() =="" && startTimes ==""){
                jsonData = "{'state':'0','ismerchant':'"+selectplate+"''}";
            }else if(startTimes !=="" && endTimes ==""){
                jsonData = '{"state":"0","ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'"}';
            }else if(startTimes !=="" && endTimes !==""){
                jsonData = '{"state":"0","ismerchant":"'+selectplate+'","accountName":"'+station+'","applyTimeStart":"'+startTimes+' 00:00:00'+'","applyTimeEnd":"'+endTimes+' 23:59:59'+'"}';
            }else{
                jsonData = "{'state':'0','ismerchant':'"+selectplate+"','accountName':'"+station+"'}";
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


