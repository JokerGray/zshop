
layui.use([ 'layer', 'jquery'], function() {
		var layer = layui.layer,
		    $ = layui.jquery
	var parm={};
	reqAjaxAsync('pay/selSysBalance',JSON.stringify(parm)).then(function(res){
		var data=res.data;
		console.log(data)
		if(res.code==1){
			$('#totalMoney').text(data.totalMoney);
			$('#trusteeshipMoney').text(data.trusteeshipMoney);
			$('#settlementMoney').text(data.settlementMoney);
			$('#profitMoney').text(data.profitMoney);
			$('#sunMoney').text(data.sunMoney);
			$('#upgradeMoney').text(data.upgradeMoney);
			$('#taxMoney').text(data.taxMoney);
			$('#poundageMoney').text(data.poundageMoney);
			$('#aliMoney').text(data.aliMoney);
		}else{
			layer.msg(res.msg)
		}
	})
})


