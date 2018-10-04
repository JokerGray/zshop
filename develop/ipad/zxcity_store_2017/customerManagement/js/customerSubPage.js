(function($){
    var params = getParams();
	if (typeof (params["accountId"]) != "undefined" && sessionStorage.getItem("accountId") != params["accountId"]) {
		sessionStorage.setItem("accountId", params["accountId"]);
	}
	var shopId = sessionStorage.getItem("shopId");
	var accountId = sessionStorage.getItem("accountId");

    $(".side-nav li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var dataRel = $(this).attr("data-rel"),
            dataIndex = $(this).attr("data-index");
        $("#customerFrame").attr("src", dataRel+".html?tabIndex="+dataIndex);
    });

    //返回
	$(".side-top .return-icon").click(function(){
		if(sessionStorage.getItem("prevPage") == null || sessionStorage.getItem("prevPage") == "null"){
			sessionStorage.setItem("prevPage", 10);
		}else{
			sessionStorage.setItem("prevPage", sessionStorage.getItem("prevPage"));
		}

		$(this).attr("href", '../../index.html');
	});
})(jQuery);
