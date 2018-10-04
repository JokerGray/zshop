(function(){
	checkUserLogin();
	$(".user-name").text(sessionStorage.getItem('username'));
	$("#author").text(sessionStorage.getItem('username'));
	$("#face").attr("src",sessionStorage.getItem('userpic')+'?x-oss-process=image/resize,w_110/crop,x_10,y_10,w_100,h_100');
	if (sessionStorage.getItem("subscriptionInfo") != null){
		var subscriptionInfo = JSON.parse(sessionStorage.getItem("subscriptionInfo"));
		var subscriptionTypeName = "";
		switch (subscriptionInfo.subscriptionType){
			case 0:
				subscriptionTypeName = "个人号";
				break;
			case 1:
				subscriptionTypeName = "企业号";
			break;
		}
		$(".user-type").text(subscriptionTypeName);
	}else{
		layer.alert("您还没有申请成为24小时公众号，赶快去申请吧！",function(){
			location.href = "register_step2.html";
		})
	}
})(jQuery)