(function($){
    var userNo = yyCache.get("userno","");
    var workNo = sessionStorage.getItem("workphone") || "";
    var nimToken = yyCache.get("nimToken");

   $(".service-left").on("click","span",function(){
       var index = $(this).index();
       $(this).addClass("acv");
       $(this).siblings().removeClass("acv");
       switch(index)
       {
           case 0:
               $(".j-iframe").attr("src",'phone_view.html');
               break;
           case 1:
               $(".j-iframe").attr("src",'phone_detail.html');
               break;
           case 2:
               $(".j-iframe").attr("src",'phone_satisfaction.html');
               break;
           case 3:
               $(".j-iframe").attr("src",'phone_order.html');
               break;
           default:
               $(".j-iframe").attr("src",'phone_analysis.html');
       }
   });

})(jQuery);