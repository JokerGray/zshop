import './zmaster.scss';

$(function(){
    //菜单变色
    $(".nav-list li").removeClass("active");
    $(".nav-list").find("li").eq(1).addClass("active");
    var _left = $('.nav-header .nav-list>li.active').offset().left - $('.nav-container .nav-line-block').offset().left;
    $('.nav-container .nav-line').css('left', _left);
    $("#full").slideDown("normal");
    resize();
    $("#full").fullpage({
        navigation: true,
        navigationPosition: 'right',
        scrollingSpeed: 700,
        fitToSection: true,
        // 加载后处理底部样式
        afterRender: function(){
        },
        afterLoad: function(anchorLink, index) {      
            // 删掉所有的 animationclass
            $('.section').removeClass('animation');
            $('.section').css("height", "100%");
            $('.section>div').css("height", "100%");
                // 为当前页添加animationclass
                // 首页 默认执行的速度太快了 还没看到 就执行完毕了 所以延迟一点
            setTimeout(function() {
                $('.section').css("height", "100%");
                $('.section>div').css("height", "100%");
                $('.section').eq(index - 1).addClass('animation');
            }, 10)

        }
    });

    function resize() {
        var boWidth = $('body').width()
        if (boWidth < 768) {
            $("html").css("font-size", 768 / 1920)
        } else {
            var fz = (boWidth / 1920) * 100
            $("html").css("font-size", fz)
        }
    };

    $(window).on("resize", function() {
        resize();
    });
    
});

