import './zcity.css';
import 'animate.css';
$(function() {
     $(".swiper-slide").slideDown("slow")
    resize()
      
    //菜单变色
    $(".nav-list li").removeClass("active");
    $(".nav-list").find("li").eq(1).addClass("active");
    var _left = $('.nav-header .nav-list>li.active').offset().left - $('.nav-container .nav-line-block').offset().left;
    $('.nav-container .nav-line').css('left', _left);
    var timer; //定时器
    $(".section").addClass("animated")

    $('.section').on('mouseover mouseout', '.lunbo_cont', function(e){
        $(this).toggleClass('hovered', e.type == 'mouseover');
    })
    var mySwiper = new Swiper('.swiper-container',{
        direction : 'vertical', //选择垂直模式，
        // autoplay: true,
        speed : 500, //设置动画持续时间500ms
        mousewheelControl : true,
        mousewheel : true,
        mousewheel: {
             releaseOnEdges: true,
          },
        autoplayDisableOnInteraction : false,
        keyboard : true,
        slidesPerView: 'auto',
        // pagination : '.swiper-pagination',  //分页器启动
        // direction: 'vertical',      //垂直方向（默认是水平）
        mousewheelControl : true, //鼠标滚轮控制（默认false）
         keyboardControl : true,  //键盘方向盘控制（默认false，如果水平方向，方向键左右起作用，如果是垂直，则是方向键上下起作用）

        //回调函数：当画面滑动开始的时候执行...
        on:{
            mousewheelControl : true,
            init: function(){
                $(".section").eq(0).find(".fl").addClass("flr")
                $(".section").eq(0).find(".fr").addClass("flr")
              }, 
            slideChangeTransitionEnd: function(swiper){
                //当前页面的下标
               clearInterval(timer);
               var indx=mySwiper.activeIndex;
               if (!$(".section").eq(indx).find(".fl").hasClass('flr') && !$(".section").eq(indx).find(".fr").hasClass('flr')) {
                $(".section").eq(indx).find(".fl").addClass("flr")
                $(".section").eq(indx).find(".fr").addClass("flr")
            }
                $(".lunbo_cont li").addClass("animated")
                var indx=mySwiper.activeIndex;
                var $lunbo = $(".section").eq(indx).find(".lunbo_cont li");
                var len = $lunbo.length;
                $(".section").eq(indx).children(".icon").addClass("transX0")
                var index = 0;
                timer = setInterval(function() {
                    index++;
                    if (len == 1) {
                        index=1;
                        $lunbo.children(".icon").removeClass("transX0").addClass('transX300').parent().removeClass("fadeIn").addClass('fadeOut')
                    }
                    if (index > len - 1) {
                        index = 0
                    }
                    if($lunbo.parent().parent().hasClass('hovered')) return;
                    $lunbo.children(".icon").removeClass("transX0").addClass('transX300').parent().removeClass("fadeIn").addClass('fadeOut')
                    $lunbo.eq(index).removeClass("fadeOut").addClass("fadeIn").children(".icon").removeClass("transX300").addClass("transX0")
                }, 2000)
           }
        }
    })
    function resize() {
        var boWidth = $('body').width()
        if (boWidth < 768) {
            $("html").css("font-size", 1024 / 1920)
        } else {
            var fz = (boWidth / 1920) * 100
            $("html").css("font-size", fz)
        }
    }

    $(window).on("resize", function() {
        resize()
        
        
    });
    
    
})

function newFunction() {
    return 3000;
}
