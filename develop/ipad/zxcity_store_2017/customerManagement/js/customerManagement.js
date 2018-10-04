(function($){
	var REQUEST_URL	 = {
		'all':'shopDisplayTerminal/queryShopAccountList',
		'regular':'shop/queryRegularCustomers'
	};
	var merchantId = sessionStorage.getItem("merchantId"),
		shopId = sessionStorage.getItem('shopId');
	var backUserId = sessionStorage.getItem('backUserId');
	var pageNo = 1, pageSize = 10;

	//渲染客户列表
	function showAllList(res){
		if(res.code == 1){
			var obj = res.data, sHtml = '';
			if(obj.length > 0){
				for(var i=0, len=obj.length; i<len; i++){
					sHtml += '<tr data-accountId="'+obj[i].id+'">'
						+ '<td>'+obj[i].accountName+'</td>'
						+ '<td>'+obj[i].mobile+'</td>'
						+ '<td>'+obj[i].cardNumber+'</td>'
						+ '<td>'+(obj[i].businessName ? obj[i].businessName : "—")+'</td>'
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

	//加载全部客户
	function getAllCustomerList(){
		var keyword = $.trim($("#keyword").val()) == "" ? "" : $.trim($("#keyword").val());
		var param = {
			'merchantId': merchantId,
			'shopId': shopId,
			'keyword': keyword,
			"pageNo": pageNo,
			"pageSize": pageSize
		};
		reqAjaxAsync(REQUEST_URL['all'], JSON.stringify(param)).done(function(resData){
			showAllList(resData);
			pagingInit('#customerPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['all'], JSON.stringify(param)).done(function(resData){
                    showAllList(resData);
                });
            })
			// if(resData.total > 0){
			// 	$("#customerPage").bootpag({
			// 		total: Math.ceil(resData.total / pageSize),
			// 		page: 1,
			// 		leaps: false,
			// 		maxVisible: 10
			// 	}).on('page', function(event, num){
			// 		param['pageNo'] = num;
			// 		reqAjaxAsync(REQUEST_URL['all'], JSON.stringify(param)).done(function(resData){
			// 			showAllList(resData);
			// 		});
            //
			// 	}).removeClass("invisible");
			// }else{
			// 	$("#customerPage").addClass("invisible");
			// }
		});

	}


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
		var keyword = $.trim($("#keyword").val()) == "" ? "" : $.trim($("#keyword").val());
		var param = {
			'employeeId':backUserId,
			'shopId':shopId,
			'keyword':keyword,
			'pageNo':pageNo,
			'pageSize':pageSize
		};

		reqAjaxAsync(REQUEST_URL['regular'], JSON.stringify(param)).done(function(resData){
			if(keyword != "" && resData.data.code == 1 && resData.data.length == 0){
				layer.msg("对不起，列表中没有您搜索的客户！");
				return;
			}
			showCustomerList(resData);
			pagingInit('#customerPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['regular'], JSON.stringify(param)).done(function(resData){
                    showCustomerList(resData);
                });
            })
			// if(resData.total > 0){
			// 	$("#customerPage").bootpag({
			// 		total: Math.ceil(resData.total / pageSize),
			// 		page: 1,
			// 		leaps: false,
			// 		maxVisible: 10
			// 	}).on('page', function(event, num){
			// 		param['pageNo'] = num;
			// 		reqAjaxAsync(REQUEST_URL['regular'], JSON.stringify(param)).done(function(resData){
			// 			showCustomerList(resData);
			// 		});
			// 	}).removeClass("invisible");
			// }else{
			// 	$("#customerPage").addClass("invisible");
			// }
		});

	}

	$("#customerTable tbody").delegate("tr", 'click', function(){
		parent.location.href = "html/customerSubPage.html?accountId=" + $(this).attr('data-accountId');
	});

	//tab切换
	$("#mainTab .btn").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		var dataRel = $(this).attr("data-rel");
		$("#keyword").val("");
		if(dataRel == "all"){
			getAllCustomerList();
			$("#btnAdd").addClass("hide");
		}else if(dataRel == "regular"){
			loadCustomerListData();
			$("#btnAdd").removeClass("hide");
		}
	});

	$(function(){
		getAllCustomerList();
	});

	$("#searchBtn").click(function(){
		var dataRel = $("#mainTab .btn.active").attr("data-rel");
		if(dataRel == "all"){
			getAllCustomerList();
		}else if(dataRel == "regular"){
			loadCustomerListData();
		}
    });


	$("#btnAdd").click(function(){
		layer.open({
			type: 2,
			title: '熟客管理',
			area: ['80%', '500px'], //宽高
			scrollbar: false,
			closeBtn: 1,
			shadeClose: true, //开启遮罩关闭
			content: ['html/addOftenCustomer.html', 'no'], //iframe的url，no代表不显示滚动条
			cancel: function(index, layero){
				loadCustomerListData();
			}
		});
    });

	$("#birthLink").click(function(){
		parent.location.href = "html/customerBirth.html"
	});


})(jQuery);
