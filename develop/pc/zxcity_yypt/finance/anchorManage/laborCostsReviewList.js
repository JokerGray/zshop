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
      				request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
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
				{ field: 'serialNumber', title:'流水号', align : "center", width: 80 },
				{ field: 'merchantName', title:'申请商户', align : "center", width: 150 },
				{ field: 'name', title:'劳务纳税人',  width: 100, align : "center" },
				{ field: 'phone', title:'联系电话', width: 150, align : "center" },
				{ field: 'money', title:'猪仔数量', width: 160, align : "center" },
				{ field: 'payMoney', title:'支付金额(人民币)',  width: 150, align : "center",
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="openView('+row.id+')">'+fmoney(row.laborTaxCalculationVo.paymentAmount,2)+'</button>';
						return btn;
					}
				},
				{ field: 'createTime', title:'申请时间', width: 160, align : "center" },
				{
					field:'_z', title: '操作', align: 'center', width: 160,
					formatter: function(value,row,index){
						return '<button type="button" class="btn btn-xs btn-link" onclick="openReview('+row.id+')">审核</button>';
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
        var cmd = "anchorManager/laborCostsReviewList";
        
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
            var excelUrl = reqAjax('anchorManager/laborCostsReviewListExport', getSearchParam());
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

	//审核提交按钮
	function openReview(id){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', id);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "主播劳务佣金审核",
		  content: template('reviewTpl',{
			  row: tempRow
		  }),
		  success: function(layero, index){
				$('#reviewBtn').on('click', function(){
					
					var stat = $('input[name="status"]:checked').val();
					var id = $('#dialogReviewId').val();
					var comment = $('#comment').val();
					
					if(!(stat && stat)){
						layer.msg('请填写审核意见');
						return;
					}else if(!(comment && comment)){
						layer.msg('请填写意见信息');
						return;
					}else if(!(id && id)){
						layer.msg('ID找不到,请联系管理员');
						return;
					}
					
					var data = {
						liveCommissionReviewList: tempRow,
						commissionRecord:{
							reviewId: id,
							reviewSerialNumber: tempRow.serialNumber,
							reviewRemark: $('#comment').val(),
							reviewStatus: stat,
							reviewType: 0//0-劳务审核;1-发票审核;2-企业审核
						}
					};
					
					var res = reqAjax('anchorManager/review', JSON.stringify(data));
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
	
	function openView(id){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', id);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "商户劳务佣金详情清单",
		  content: template('viewTpl',{
			  row: tempRow
		  }),
		  success: function(layero, index){
			  
		  }
		});
	}
	
	