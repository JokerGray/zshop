(function($){
    var accountId = getUrlParams("accountId"),
    accountName = getUrlParams("accountName"),
    accountMobile = getUrlParams("mobile");
    sessionStorage.setItem("accountId", accountId);
    sessionStorage.setItem("accountName", accountName);
    sessionStorage.setItem("accountMobile", accountMobile);

    $(".side-nav li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var dataRel = $(this).attr("data-rel");
        $("#reservationFrame").attr("src", dataRel+".html");
    });

    //返回
    $(".side-top .return-icon").click(function(){
        if(sessionStorage.getItem("prevPage") == null || sessionStorage.getItem("prevPage") == "null"){
            sessionStorage.setItem("prevPage", 5);
        }else{
            sessionStorage.setItem("prevPage", sessionStorage.getItem("prevPage"));
        }

        $(this).attr("href", '../../index.html');
    });
})(jQuery);
