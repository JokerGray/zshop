
$(function () {
		
		var data = {};
		
		try {
			var re = reqAjax('pay/selSysBalance', JSON.stringify(data));
			if (re.code != 1) {
				layer.msg(re.msg);
			} else if(re.data) {
				$("#totalMoney").html(re.data.totalMoney);
				$("#trusteeshipMoney").html(re.data.trusteeshipMoney);
				$("#settlementMoney").html(re.data.settlementMoney);
				$("#profitMoney").html(re.data.profitMoney);
				$("#sunMoney").html(re.data.sunMoney);
				$("#upgradeMoney").html(re.data.upgradeMoney);
				$("#taxMoney").html(re.data.taxMoney);
				$("#poundageMoney").html(re.data.poundageMoney);
				$("#classRoomMoney").html(re.data.classRoomMoney);
				$("#sumMoney").html(re.data.sumMoney);
				$("#aliMoney").html(re.data.aliMoney);
				$("#wxMoney").html(re.data.wxMoney);
			}
		} catch (e) {
			layer.msg("异常：" + e);
		}
		
});







