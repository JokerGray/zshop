$(function() {
	var params = getParams();
	if (typeof (params["backUserID"]) != "undefined" && sessionStorage.getItem("backUserId") != params["backUserID"]) {
		sessionStorage.clear();
		sessionStorage.setItem("apikey", params["apikey"]);
		sessionStorage.setItem("backUserId", params["backUserID"]);
		sessionStorage.setItem("shopId", params["shopID"]);
		sessionStorage.setItem("shopName", getUrlParams("shopName"));
		sessionStorage.setItem("merchantId", params["merchantId"]);
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dateType: "json",
			data: {
				"cmd": "backUser/userInfo",
				"data": "{'id': " + sessionStorage.getItem("backUserId") + "}",
				"version": "1"
			},
			beforeSend: function(request){
				request.setRequestHeader("apikey", sessionStorage.getItem("apikey"));
			},
			success: function(re){
				if(re.data != null){
					sessionStorage.setItem("merchantId", re.data.merchantId);
					sessionStorage.setItem("username", re.data.username);
					sessionStorage.setItem("usercode", re.data.usercode);
				}
			},
			error: function(re){
				var data = JSON.stringify(re);
			}
		});
	}
});

//function changeMenu(page){
//	$("#mainNav li a[data-page='"+page+"']").addClass("active").parent().siblings().find("a").removeClass("active");
//	var pageUrl = "";
//	switch (page) {
//		case "1":
//			pageUrl = "../index.html";
//			break;
//		case "2":
//			pageUrl = "storehomepage/storehomepage.html";
//			break;
//		default:
//			pageUrl = "../index.html";
//	}
//	window.location.href = pageUrl;
//}
//
////导航切换
//$("#mainNav li>a").each(function(index, item){
//	$(item).click(function(){
//		if(!$(this).hasClass("disabled") && !$(this).hasClass("active") ){
//			var page = $(this).attr("data-page");
//			changeMenu(page)
//		}
//	});
//});
