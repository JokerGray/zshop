$(function () {
	var type = getRequestAddressUrlParameter("type");
	var merchantId = getRequestAddressUrlParameter("merchantId");

	var jsonData = "{'type': '"+type+"','id': '" + merchantId + "'}";

	var res = reqAjax('payStatistics/selectUserInfo', jsonData);
	if(res.code == 1){
		if(type == 1){
			$("#userCode").val(res.data.userCode);//账号
			$("#phone").val(res.data.phone);//手机号
			$("#userName").val(res.data.userName).on('mouseover', function(){ //用户昵称
			    var that = this;
			    layer.tips(that.value, that, {tips: 1}); //在元素的事件回调体中，follow直接赋予this即可
			});	
			$("#locked").val(res.data.locked);//是否锁定
      $("#userSex").val(res.data.userSex);//性别
			$("#registType").val(res.data.registType);//注册状态
			$("#trade").val(res.data.trade);
		}
	} else {
		layer.alert(res.msg);
	}
});


