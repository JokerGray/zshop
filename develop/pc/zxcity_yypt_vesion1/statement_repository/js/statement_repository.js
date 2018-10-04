(function($){
   $(".service-left").on("click","span",function(){
       var index = $(this).index();
       $(this).addClass("acv");
       $(this).siblings().removeClass("acv");
       switch(index)
       {
           case 0:
               $(".j-iframe").attr("src",'repository_question.html');
               break;
           case 1:
               $(".j-iframe").attr("src",'repository_knowledge.html');
               break;
       }
   });


})(jQuery);