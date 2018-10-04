(function($){
	var orderId = getUrlParams('orderId');


	function loadDetails(orderId){
		var jsonData = "{'orderId':"+orderId+"}";
		var res = reqAjax("shop/orderDetails", jsonData);
		var sHtml = "";
		if(res.code == 1){
			var obj = res.data;
			if(obj.length > 0){
				for(var i=0; i<obj.length; i++){
					sHtml += '<li class="list-item">'
						+ '<div class="customer-info"><span>客户：'+obj[i].accountName+'</span>'
						+ '<span>订单号：'+obj[i].orderNo+'</span><span>开单者：'+obj[i].operator+'</span>'
						+ '<span>日期：'+obj[i].consumeTime.substring(0,10)+'</span></div>'
						+ '<div class="order-info"><div class="media">'
						+ '<div class="media-left pull-left"><img src="'+obj[i].purchasePicture+'" class="img" alt="'+obj[i].purchaseName+'"/></div>'
						+ '<div class="media-body">'
						+ '<h4 class="media-heading">'+obj[i].purchaseName+'</h4>'
						+ '<p>单价：'+obj[i].price+'元</p>'
						+ '<p><span class="num">数量：'+obj[i].purchaseNum+'</span><span>合计：'+obj[i].fee+'元</span></p></div></div>'
						+ '<div class="state">'
						+ '<span class="money">￥<b>'+obj[i].actualPayment+'</b></span>'
						+ '<span class="status">'+(obj[i].payType ? obj[i].payType : "")+'</span>'
						+ '</div></div></li>'
				}
			}else{
				layer.msg('暂无数据');
			}
		}else{
			layer.alert(res.msg);
		}
		$("#saleList ul").html(sHtml);
	}
	
	$(function(){
		loadDetails(orderId);
	});

})(jQuery);
