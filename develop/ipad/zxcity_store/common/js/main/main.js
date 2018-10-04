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

function loadMenu(){
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var apikey = theRequest['apikey'];
	var backUserId = theRequest['backUserId'];
	var shopID = theRequest['shopID'];

	$.ajax({
		type: "POST",
		url: "/zxcity_restful/ws/rest",
		dateType: "json",
		data: {
			"cmd": "backUser/getStoreMenu",
			"data": "{'backUserId': " + backUserId + ", 'shopID': " + shopID + "}",
			"version": "1"
		},
		beforeSend: function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success: function(re){
			var str1 = JSON.stringify(re);
			//console.log(str1);
			//alert(str1);

			// 存储数据
			sessionStorage.shopID="Smith";
			document.write(sessionStorage.shopID);
		},
		error: function(re){
			var str1 = JSON.stringify(re);
			//console.log(str1)
			//alert(str1);
		}
	});
}

function changeMenu(page){
	$("#mainNav li a[data-page='"+page+"']").addClass("active-menu").parent().siblings().find("a").removeClass("active-menu");
	var src = "";
	switch (page) {
		case "1":
			src = "../../../myHomePage/html/myHomePage.html";
			break;
		case "2":
			src = "../../../storeHomePage/html/storeHomePage.html";
			break;
		case "3"://厨师屏
			window.location.href="../../../cookscreen/cookscreen.html";
			break;
		case "4":
			src = "../../../customerReservation/html/customerReservation.html";
			break;
		case "5":
			src = "../../../consumptionBilling/html/consumptionBilling.html";
			break;
		case "6":
			src = "../../../workOrderManagement/html/workOrderManagement.html";
			break;
		case "7":
			src = "../../../scheduling/html/scheduling.html";
			break;
		case "8":
			src = "../../../orderManagement/html/orderManagement.html";
			break;
		case "9":
			src = "../../../customerManagement/html/customerManagement.html";
			break;
		case "10":
			src = "../../../statisticalReport/html/statisticalReport.html";
			break;
		case "11":
			src = "../../../fsj/html/fsj.html";
			break;
		case "12":
			src="../../../fsj/html/tree.html";
			break;
		case "13"://取餐屏
			window.location.href="../../../takemealScreen/takeMealScreen.html";
			break;
		default:
			src = "../../../myHomePage/html/myHomePage.html";
	}

	$("#pageView").attr("src",src);
	window.location.hash = "";
}

function backToPrevPage(){
	var prevPage = sessionStorage.getItem("prevPage");
	changeMenu(prevPage);
}

$(function(){
	$("#mainNav li>a").each(function(index, item){
		$(item).click(function(){
			var page = $(this).attr("data-page");
			sessionStorage.removeItem("prevPage");
			sessionStorage.removeItem("accountId");
			changeMenu(page);
		});
	});
	 backToPrevPage();
	//var reg = new RegExp("(^|&)page=([^&]*)(&|$)");
	//var pageNum = window.location.hash.substring(1).match(reg);
	//if(pageNum != null){
	//	changeMenu(pageNum[2]);
	//}

});
