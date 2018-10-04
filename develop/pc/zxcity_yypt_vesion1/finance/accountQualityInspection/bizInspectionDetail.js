
$(function () {
	var id = getUrlParams("id");
	var userName = getUrlParams("userName");
	var userPhone = getUrlParams("userPhone");
	
	$("#username").val(userName);
	$("#phone").val(userPhone);
	
	if(!id || !userName || !userPhone){
		layer.msg('参数异常！');
	}else{
		var data = {id: id};
	
		try {
			var re = reqAjax('accountQualityInspection/getInSpectionDetailById', JSON.stringify(data));
			if (re.code != 1) {
				layer.msg(re.msg);
			} else if(re.data) {
				//交易类型 0 充值/1 消费/2 退货/3 提现结算/4 提现退回/5 转出到子账户/6 子账户转入/7 确认收货/8 产生盈利/9 收入提取\r\n	// 10 商户升级支付/11 商户升级退款/12 商户升级佣金发放/13 主播佣金发放/14 给其他用户转账
				//15 接受其他用户转账\r\n	// 16 分享赚支付/17 确认分享赚收货/18 分享赚退货/19 发红包/20 领取红包/21 红包退回/22 红包托管收入/23 红包托管支出/24 智扮提成发放',	
				// 0 充值
				$("#typeRecharge").html(re.data.typeRecharge.toFixed(2));
				$("#bizRecharge").html(re.data.bizRecharge.toFixed(2));  
				if(re.data.typeRecharge != re.data.bizRecharge){
					$("#typeRecharge").parent().parent().parent().addClass('unnormal');
				}
				//1 消费
				$("#typeConsumption").html(re.data.typeConsumption.toFixed(2));
				$("#bizConsumption").html(re.data.bizConsumption.toFixed(2));
				if(re.data.typeConsumption != re.data.bizConsumption){
					$("#typeConsumption").parent().parent().parent().addClass('unnormal');
				}
				//2 退货
				$("#typeReturn").html(re.data.typeReturn.toFixed(2));
				$("#bizReturn").html(re.data.bizReturn.toFixed(2));
				if(re.data.typeReturn != re.data.bizReturn){
					$("#typeReturn").parent().parent().parent().addClass('unnormal');
				}
				//3 提现结算
				$("#typeWithdraw").html(re.data.typeWithdraw.toFixed(2));
				$("#bizWithdraw").html(re.data.bizWithdraw.toFixed(2));
				if(re.data.typeWithdraw != re.data.bizWithdraw){
					$("#typeWithdraw").parent().parent().parent().addClass('unnormal');
				}
				//4 提现退回
				$("#typeWithdrawReturn").html(re.data.typeWithdrawReturn.toFixed(2));
				$("#bizWithdrawReturn").html(re.data.bizWithdrawReturn.toFixed(2));
				if(re.data.typeWithdrawReturn != re.data.bizWithdrawReturn){
					$("#typeWithdrawReturn").parent().parent().parent().addClass('unnormal');
				}
				//5 转出到子账户
				$("#typeTransferSun").html(re.data.typeTransferSun.toFixed(2));
				$("#bizTransferSun").html(re.data.bizTransferSun.toFixed(2));
				if(re.data.typeTransferSun != re.data.bizTransferSun){
					$("#typeTransferSun").parent().parent().parent().addClass('unnormal');
				}
				//6 子账户转入
				$("#typeTransferAccount").html(re.data.typeTransferAccount.toFixed(2));
				$("#bizTransferAccount").html(re.data.bizTransferAccount.toFixed(2));
				if(re.data.typeTransferAccount != re.data.bizTransferAccount){
					$("#typeTransferAccount").parent().parent().parent().addClass('unnormal');
				}
				//7 确认收货
				$("#typeConfirm").html(re.data.typeConfirm.toFixed(2));
				$("#bizConfirm").html(re.data.bizConfirm.toFixed(2));
				if(re.data.typeConfirm != re.data.bizConfirm){
					$("#typeConfirm").parent().parent().parent().addClass('unnormal');
				}
				//8 产生盈利
				$("#typeProfit").html(re.data.typeProfit.toFixed(2));
				$("#bizProfit").html(re.data.bizProfit.toFixed(2));
				if(re.data.typeProfit != re.data.bizProfit){
					$("#typeProfit").parent().parent().parent().addClass('unnormal');
				}
				//10 商户升级支付
				$("#typeMerchantUpgrade").html(re.data.typeMerchantUpgrade.toFixed(2));
				$("#bizMerchantUpgrade").html(re.data.bizMerchantUpgrade.toFixed(2));
				if(re.data.typeMerchantUpgrade != re.data.bizMerchantUpgrade){
					$("#typeMerchantUpgrade").parent().parent().parent().addClass('unnormal');
				}
				//11 商户升级退款
				$("#typeMerchantReturn").html(re.data.typeMerchantReturn.toFixed(2));
				$("#bizMerchantReturn").html(re.data.bizMerchantReturn.toFixed(2));
				if(re.data.typeMerchantReturn != re.data.bizMerchantReturn){
					$("#typeMerchantReturn").parent().parent().parent().addClass('unnormal');
				}
				//12 商户升级佣金发放
				$("#typeMerchantCommission").html(re.data.typeMerchantCommission.toFixed(2));
				$("#bizMerchantCommission").html(re.data.bizMerchantCommission.toFixed(2));
				if(re.data.typeMerchantCommission != re.data.bizMerchantCommission){
					$("#typeMerchantCommission").parent().parent().parent().addClass('unnormal');
				}
				//13 主播佣金发放
				$("#typeAnchor").html(re.data.typeAnchor.toFixed(2));
				$("#bizAnchor").html(re.data.bizAnchor.toFixed(2));
				if(re.data.typeAnchor != re.data.bizAnchor){
					$("#typeAnchor").parent().parent().parent().addClass('unnormal');
				}
				//14 给其他用户转账
				$("#typeTransferOut").html(re.data.typeTransferOut.toFixed(2));
				$("#bizTransferOut").html(re.data.bizTransferOut.toFixed(2));
				if(re.data.typeTransferOut != re.data.bizTransferOut){
					$("#typeTransferOut").parent().parent().parent().addClass('unnormal');
				}
				//15 接受其他用户转账
				$("#typeTransferIn").html(re.data.typeTransferIn.toFixed(2));
				$("#bizTransferIn").html(re.data.bizTransferIn.toFixed(2));
				if(re.data.typeTransferIn != re.data.bizTransferIn){
					$("#typeTransferIn").parent().parent().parent().addClass('unnormal');
				}
				//16 分享赚支付
				$("#typeShare").html(re.data.typeShare.toFixed(2));
				$("#bizShare").html(re.data.bizShare.toFixed(2));
				if(re.data.typeShare != re.data.bizShare){
					$("#typeShare").parent().parent().parent().addClass('unnormal');
				}
				//17 确认分享赚收货
				$("#typeShareConfirm").html(re.data.typeShareConfirm.toFixed(2));
				$("#bizShareConfirm").html(re.data.bizShareConfirm.toFixed(2));
				if(re.data.typeShareConfirm != re.data.bizShareConfirm){
					$("#typeShareConfirm").parent().parent().parent().addClass('unnormal');
				}
				//18 分享赚退货
				$("#typeShareReturn").html(re.data.typeShareReturn.toFixed(2));
				$("#bizShareReturn").html(re.data.bizShareReturn.toFixed(2));
				if(re.data.typeShareReturn != re.data.bizShareReturn){
					$("#typeShareReturn").parent().parent().parent().addClass('unnormal');
				}
				//19 发红包
				$("#typeRedPacket").html(re.data.typeRedPacket.toFixed(2));
				$("#bizRedPacket").html(re.data.bizRedPacket.toFixed(2));
				if(re.data.typeRedPacket != re.data.bizRedPacket){
					$("#typeRedPacket").parent().parent().parent().addClass('unnormal');
				}
				//20 领取红包/21 红包退回
				$("#typeRedPacketOut").html((re.data.typeRedPacketReceive + re.data.typeRedPacketReturn).toFixed(2));
				$("#bizRedPacketOut").html(re.data.bizRedPacketOut.toFixed(2));
				if(re.data.typeRedPacketReceive + re.data.typeRedPacketReturn != re.data.bizRedPacketOut){
					$("#typeRedPacketOut").parent().parent().parent().addClass('unnormal');
				}
				//24 智扮提成发放
				$("#typeDecorationCommission").html(re.data.typeDecorationCommission.toFixed(2));
				$("#bizDecorationCommission").html(re.data.bizDecorationCommission.toFixed(2));
				if(re.data.typeDecorationCommission != re.data.bizDecorationCommission){
					$("#typeDecorationCommission").parent().parent().parent().addClass('unnormal');
				}
				//25智享课堂消费
				$("#typePayClass").html(re.data.typePayClass.toFixed(2));
				$("#bizPayClass").html(re.data.bizPayClass.toFixed(2));
				if(re.data.typePayClass != re.data.bizPayClass){
					$("#typePayClass").parent().parent().parent().addClass('unnormal');
				}
				//26智享课堂退款
				$("#typePayClassReturn").html(re.data.typePayClassReturn.toFixed(2));
				$("#bizPayClassReturn").html(re.data.bizPayClassReturn.toFixed(2));
				if(re.data.typePayClassReturn != re.data.bizPayClassReturn){
					$("#typePayClassReturn").parent().parent().parent().addClass('unnormal');
				}
				//智享课堂收入
				$("#typePayClassProfit").html(re.data.typePayClassProfit.toFixed(2));
				$("#bizPayClassProfit").html(re.data.bizPayClassProfit.toFixed(2));
				if(re.data.typePayClassProfit != re.data.bizPayClassProfit){
					$("#typePayClassProfit").parent().parent().parent().addClass('unnormal');
				}
				

			}
		} catch (e) {
			layer.msg("异常：" + e);
		}
		
	}
		
});


