(function($){
    var url = sessionStorage.getItem("backlogUrl") || "";

   $("#articFrame").attr("src",url);

    //返回
    $("#backBtn").click(function(){
        history.back();
    });
})(jQuery);