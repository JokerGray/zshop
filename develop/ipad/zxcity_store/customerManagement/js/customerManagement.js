(function($){
	var shopId = sessionStorage.getItem('shopId');
	var backUserId = sessionStorage.getItem('backUserId');
	var pageNo = 1, pageSize = 10;

	function showCustomerList(res){
		if(res.code == 1){
			var obj = res.data, sHtml = '';
			if(obj.length > 0){
				for(var i=0, len=obj.length; i<len; i++){
					sHtml += '<tr data-accountId="'+obj[i].accountId+'">'
						+ '<td>'+obj[i].accountName+'</td>'
						+ '<td>'+obj[i].mobile+'</td>'
						+ '<td>'+obj[i].cardNumber+'</td>'
						+ '<td>'+(obj[i].businessName ? obj[i].businessName : "")+'</td>'
						+'</tr>'
				}
			}else{
				sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
			}

			$("#customerTable tbody").html(sHtml);
		}else{
			layer.alert(res.msg);
		}
	}

	function loadCustomerListData(){
		var keyword = $("#keyword").val() == "" ? "" : $("#keyword").val();
		var jsonData = "{'employeeId': " + backUserId + ", 'keyword': '" + keyword + "', 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
		var resData = reqAjax('shop/queryRegularCustomers', jsonData);
		if(keyword != "" && resData.data.code == 1 && resData.data.length == 0){
			layer.msg("对不起，列表中没有您搜索的客户！");
			return;
		}
		showCustomerList(resData);
		if(resData.total > 0){
			$("#customerPage").bootpag({
				total: Math.ceil(resData.total / pageSize),
				page: 1,
				maxVisible: 10
			}).on('page', function(event, num){
				jsonData = "{'employeeId': " + backUserId + ", 'keyword': '" + keyword + "', 'pageNo': " + num + ", 'pageSize': " + pageSize + "}";
				var resData = reqAjax('shop/queryRegularCustomers', jsonData);
				showCustomerList(resData);
			});
		}
	}

	$("#customerTable tbody").delegate("tr", 'click', function(){
		parent.location.href = "customerOverview.html?accountId=" + $(this).attr('data-accountId');
	});

	$(function(){
		loadCustomerListData();
	});

	$("#btnSel").click(function(){
		var trLen = $("#customerTable tbody").find("tr").length;
		if(trLen > 1){
			loadCustomerListData();
		}else{
			layer.msg("对不起，您的熟客列表为空，请先添加熟客！");
		}

    });


	$("#btnAdd").click(function(){
		layer.open({
			type: 2,
			title: '熟客管理',
			area: ['1600px', '1200px'], //宽高
			closeBtn: 1, //不显示关闭按钮
			shadeClose: true, //开启遮罩关闭
			content: ['addOftenCustomer.html', 'no'] //iframe的url，no代表不显示滚动条
		});
    });


})(jQuery);
