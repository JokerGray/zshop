(function($){
	var REQUEST_URL = {
		'order_detail_url':'shopStatistics/getOneOrderDetail'
	}
	var orderId = getUrlParams('orderId');


	function loadDetails(orderId){
		var jsonData = "{'orderId':"+orderId+"}";
		reqAjaxAsync(REQUEST_URL['order_detail_url'], jsonData).done(function(res){
			var sHtml = "";
			if(res.code == 1){
				var obj = res.data.goodsList;
				sHtml += '<div class="list-box"><ul>'
				if(obj.length > 0){
					for(var i=0; i<obj.length; i++){
						sHtml += '<li class="list-item">'
							+ '<div class="order-info"><div class="media">'
							+ '<div class="media-left pull-left"><img src="'+obj[i].purchasePicture+'" class="img" alt="'+obj[i].purchaseName+'"/></div>'
							+ '<div class="media-body">'
							+ '<h4 class="media-heading">'+obj[i].purchaseName+'</h4>'
							+ '<p>单价：'+obj[i].unitPrice+'元</p>'
							+ '<p><span class="num">数量：'+obj[i].num+'</span><span>合计：'+obj[i].totelPrice+'元</span></p></div></div>'
							+ '<div class="state">'
							+ '<span class="money">￥<b>'+obj[i].actualPayment+'</b></span>'
						if(obj[i].payType){
							sHtml += '<span class="status">'+(obj[i].payType ? obj[i].payType : "")+'</span>'
						}

						sHtml += '</div></div></li>'
					}
				}else{
					sHtml += '<li class="nodata">暂无数据</li>'
				}
				sHtml += '</ul></div>'
				if(res.data.acName != "" && res.data.discountMoney != ""){
					sHtml += '<div class="other-info"><label>活动折扣：</label><span>'+res.data.acName+'</span><label>整单优惠：</label><span>'+res.data.discountMoney+'</span></div>'
				}else if(res.data.acName != "" && res.data.discountMoney == ""){
					sHtml += '<div class="other-info"><label>活动折扣：</label><span>'+res.data.acName+'</span></div>'
				}else if(res.data.acName == "" && res.data.discountMoney != ""){
					sHtml += '<div class="other-info"><label>整单优惠：</label><span>'+res.data.discountMoney+'</span></div>'
				}
			}else{
				layer.alert(res.msg);
			}
			$("#saleList").html(sHtml);
		});

	}

	$(function(){
		loadDetails(orderId);
	});

})(jQuery);
