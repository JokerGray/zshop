var oTable;

$(function () {
	//获取跳转前页面传参
	//var startTime = getRequestAddressUrlParameter("startTime");
    
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
            //sortName : "transTime",     //排序的字段
            //sortOrder: "desc",          //排序方式
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
				{ field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'userRealName', title:'用户姓名',  width: 150, align : "center" }, 
				{ field: 'userName', title:'用户昵称',  width: 150, align : "center" }, 
				{ field: 'userPhone', title:'手机号', align : "center", width: 150 },
				{ field: 'accountBalance', title:'账户余额',  width: 150, align : "center" }, 
				{ field: 'inspectionTime', title:'检查时间',  width: 200, align : "center"}, 
				{ field: 'inspectionStatus', title:'流水质检',  width: 150, align : "center",
					formatter: function(val){
						if(val === "0"){
							return "<span style='color:green;'>正常</span>";
						}else if(val === "1"){
							return "<span style='color:red;'>异常</span>";
						}
					}
				},
				{ field: 'bizInspectionStatus', title:'业务质检', width: 150, align : "center",
					formatter:function(val){
						if(val === "0"){
							return "<span style='color:green;'>正常</span>";
						}else if(val === "1"){
							return "<span style='color:red;'>异常</span>";
						}
					}
				},
				{ field: '_z', title:'详情', width: 150, align : "center", 
					formatter: function(val, row, index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getBizInspectionDetail(\'' + row.id + '\',\'' + row.userName + '\',\'' + row.userPhone + '\')">业务质检详情</button>';
						return btn;
					}
				}
			],
            onLoadSuccess: function (data) {
                //layer.msg('加载成功');
            	//callBack();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "accountQualityInspection/selAccountInspectionDetailByPage";
        
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
	    var username = $('#username').val();
	    var phone = $('#phone').val();
	    var status = $("#selectview2").val();
	    
	    var jsonData = {
	    	username: username,
	    	phone: phone,
	    	status: status
	    };
	    if(pageNo && pageSize){
	    	jsonData.pageNo = pageNo;
	    	jsonData.pageSize = pageSize;
	    }
	    
	    return JSON.stringify(jsonData);
	}

    //查询搜索事件
    $("#searchbtn").bind("click", function(){
    	
    		oTable.Init();
    		accountDynamicColumn.initCookie();
    });
    
    //业务质检详情
    function getBizInspectionDetail(id, userName, userPhone){
		var name = "业务质检详情";
		var url = "finance/accountQualityInspection/bizInspectionDetail.html?id="+id+"&userName="+userName+"&userPhone="+userPhone;
		//解决中文乱码
		url = encodeURI(url)
		addTabs(url, name);	
    	
    }
    
    // 导出excel
    /*$("#excelbtn").bind("click", function downloadFile() {
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var excelUrl = reqAjax('payExcel/exportLiveCZDetail', getSearchParam());
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
    });*/
    
