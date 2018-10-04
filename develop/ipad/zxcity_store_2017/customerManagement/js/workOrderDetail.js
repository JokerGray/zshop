(function($){
	var REQUEST_URL = {
		'detail': 'shopStatistics/getOneConsumptionsDetail'
	};
	var consumeNo = getUrlParams('consumeNo');
	var param = {'consumeNo': consumeNo};

	function init(){

		reqAjaxAsync(REQUEST_URL['detail'], JSON.stringify(param)).done(function(res){
			var sHtml = "";
			if(res.code == 1){
				$("#orderId").text(res.data.orderId);
				$("#consumeNo").text(res.data.consumeNo);
				$("#customerName").text(res.data.accountName);
				$("#serviceName").text(res.data.purchaseName);
				$("#waiter").text(res.data.waiter);
				$("#status").text(res.data.status);
				$("#salesMan").text(res.data.salesMan);
				$("#consumeTime").text(res.data.consumeTime);
			}else{
				layer.alert(res.msg);
			}
			$("#detailList ul").html(sHtml);

		});

	}
    init();

})(jQuery);
