var localFlag = false;

//页面加载完毕  调用后台查询
$(function() {
   reqAjax();
});

function goToProcessing(local){
    if(localFlag==true){
      var url ='';
      if(local=='finance/merchant/referrerAmount.html'){
         //推荐人佣金审核
         url='finance/merchant/referrerAmount.html';
      }else if (local=='finance/merchant/merchantUpdateApply.html') {
         //商户升级审核
         url='finance/merchant/referrerAmount.html';
      }else if (local=='finance/trade/audit.html') {
         //提现申请审核
         url='finance/trade/seller.html';
      }else if (local=='finance/account/merchantTest.html') {
         // 试用商户到期短信通知
         url='finance/account/seller.html';
      }else if (local=='finance/anchorManage/anchorAccountAudit.html') {
         // 直播佣金审核
         url='finance/anchorManage/anchorAccountCount.html';
      }else if (local=='finance/trade/cash.html') {
         // 提现出账支付
         url='finance/trade/seller.html';
      }
      window.location.href='../../'+local+'';
      parent.changeUrl(url);
    }
}

function reqAjax() {
   $("#dataLoadingId").empty().html('<p>正在努力地加载数据中，请稍候……</p>');
  var version = '1';
  var reData;
  $.ajax({
    type : "POST",
    url : "/zxcity_restful/ws/rest",
    dataType : "json",
    // timeout: 10000, //超时时间：30秒
    // async : false,
    data : {"cmd" : "agencyMatters/selectAgencyMatters","data" : "","version" : version},
    beforeSend : function(xml) {
      xml.setRequestHeader("apikey","test");
    },
    success : function(re) {
      localFlag=true;
      reData = re;
      $("#txsqshId").html(reData.data.applicationReviewSum);//提现申请审核
      $("#txczzfId").html(reData.data.cashWithdrawalSum);//提现出账支付
      $("#tjryjshId").html(reData.data.recommendedCommissionReviewSun);//推荐人佣金审核
      $("#shsjskId").html(reData.data.businessUpgradeAuditSum);//商户升级审核
      $("#syqshdxtzId").html(reData.data.merchantSMSNotificationSum);//试用商户到期短信通知
      $("#zbyjshId").html(reData.data.liveCommissionReviewSum);//直播佣金审核
      $("#dataLoadingId").empty().html('');
      $("#contentId").show();
    },
    error : function(re) {
      $("#dataLoadingId").empty().html('<p style="font-size: 18px;color: red;">数据加载异常......</p>');
    }
  });
}
