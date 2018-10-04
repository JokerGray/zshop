(function($){

    //点赞和取消
    $(".show-article-body").on("click",".btn",function(){
        var val = $(this).text();
        alert(val)
        if(val == "点赞"){
            $(this).addClass("ave");
            $(this).text("已赞");
        }else{
            $(this).removeClass("ave");
            $(this).text("点赞");
        }
    });

})(jQuery);
