(function($){
   $(".service-left").on("click","span",function(){
       var index = $(this).index();
       $(this).addClass("acv");
       $(this).siblings().removeClass("acv");
       switch(index)
       {
           case 0:
               $(".j-iframe").attr("src",'service_workload.html');
               break;
           case 1:
               $(".j-iframe").attr("src",'service_order.html');
               break;
       }
   });

})(jQuery);