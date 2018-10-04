(function($){
	var shopId = sessionStorage.getItem('shopId'),
	merchantId = sessionStorage.getItem("merchantId");
	$(function() {

		//1.初始化Table
		var oTable = new TableInit();
		oTable.Init();
		$(".fixed-table-pagination").hide();


		$("#btnSel").click(function(){
			$('#customerTable').bootstrapTable('refresh');
		});

	});



	var TableInit = function () {
		var oTableInit = new Object();
		//初始化Table
		oTableInit.Init = function () {
			$('#customerTable').bootstrapTable({
				url: '/zxcity_restful/ws/rest',     //请求后台的URL（*）
				method: 'POST',           //请求方式（*）
				toolbar: '#toolbar',        //工具按钮用哪个容器
				striped: true,           //是否显示行间隔色
				cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true,          //是否显示分页（*）
				sortable: false,           //是否启用排序
				sortName : "id",     //排序的字段
				sortOrder: "desc",          //排序方式
				contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
				queryParams: oTableInit.queryParams,//传递参数（*）
				sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
				pageNumber:1,            //初始化加载第一页，默认第一页
				pageSize: 10,            //每页的记录行数（*）
				// pageList: [10, 25, 50, 100],    //可供选择的每页的行数（*）
				strictSearch: true,
				clickToSelect: true,        //是否启用点击选中行
				// height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId: "id",           //每一行的唯一标识，一般为主键列
				cardView: false,          //是否显示详细视图
				detailView: false,          //是否显示父子表
				//singleSelect : true,        //是否只能选中一个
				apikey: sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'),
				onClickRow: function (row) {
                    console.log(row);
                    // 调用父窗口方法
					parent.selCustomer(row);
					closeWin();
					// 接受值		$.query.get("accountId");
				},
				responseHandler:function(res){
					//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
					//在ajax后我们可以在这里进行一些事件的处理
					if(res.code == 1){
						if(res.data.length > 0){
							$(".fixed-table-pagination").show();
							return res;
						}else{
							$(".fixed-table-pagination").hide();
							//layer.msg("该员工还没有添加自己的熟客列表！");
							//return false;
						}
						return res;

					}else{
						layer.alert(res.msg);
						return false;
					}
				},
				columns: [{
					field : 'accountName',
					title : '姓名',
					align : "center"
				}, {
					field : 'mobile',
					title : '电话',
					align : "center"
				}, {
					field : 'businessName',
					title : '会员类型',
					align : "center"
				}]
			});
		};

		//得到查询的参数
		oTableInit.queryParams = function (params) {
			var cmd = "shopDisplayTerminal/queryShopAccountList";
			var backUserId = getUrlParams('backUserId');
			var keyword = $("#keyword").val() == "" ? "" : $("#keyword").val();

			var pageNo = params.pageNumber;
			var pageSize = params.pageSize;
			var jsonData = {
				'merchantId':merchantId,
				'keyword':keyword,
				'pageNo':pageNo,
				'pageSize':pageSize
			};
			//var jsonData = "{'employeeId': " + backUserId + ", 'shopId':"+shopId+",'keyword': '" + keyword + "', 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";

			var version = "1";

			return{
				sort: params.sort,
				order: params.order,
				page: params.offset/params.limit+1,
				rows: params.limit,
				cmd: cmd,
				data: JSON.stringify(jsonData),
				version: version
			}
		};

		return oTableInit;
	};



	function closeWin(){
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
		parent.layer.close(index);
	}
	window.closeWin = closeWin;

})(jQuery);
