(function($){

	var orderId = getUrlParams('orderId');

	function init(){
        var jsonData = "{'orderId':"+orderId+"}";
		var res = reqAjax('shop/queryIpadConsumptions', jsonData);
		var sHtml = "";
		if(res.code == 1){
			var obj = res.data;
			if(obj.length > 0){
				for(var i=0; i<obj.length; i++){
					sHtml += '<li class="list-item">'
						+ '<div class="customer-info"><span>客户：'+obj[i].accountName+'</span>'
						+ '<span>订单号：'+obj[i].orderId+'</span><span>开单者：'+obj[i].operator+'</span>'
						+ '<span>日期：'+obj[i].consumeTime.substring(0,10)+'</span></div>'
						+ '<div class="order-info"><div class="media">'
						+ '<div class="media-left pull-left"><img src="'+obj[i].purchasePicture+'" class="img" alt="'+obj[i].purchaseName+'"/></div>'
						+ '<div class="media-body">'
						+ '<h4 class="media-heading">'+obj[i].purchaseName+'</h4>'
						+ '<p>工单号：'+obj[i].consumeNo+'</p>'
						+ '<p>技师：'+obj[i].waiter+'</p></div></div>'
						+ '</div></li>'
				}
			}else{
				layer.msg('暂无数据');
			}
		}else{
			layer.alert(res.msg);
		}
		$("#detailList ul").html(sHtml);

	}
    init();


})(jQuery);
