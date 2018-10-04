$(function() {
    $(".loader").slideUp("slow")
    $("#full").slideDown("slow")
    $(".index-nav").slideDown("slow")
    resize()
        // 刷新页面  NAV a 标签的 样式
    $.each($("#headnav a"), function(i, item) {
        $(item).removeClass("visited")
         if(location.hash==""){
            return false
         }
        if ($(item).attr("href") == location.hash) {
            $(item).addClass("visited")
        }

    })
    var timer; //定时器
    $(".section").addClass("animated")

    $('.section').on('mouseover mouseout', '.lunbo_cont', function(e){
        $(this).toggleClass('hovered', e.type == 'mouseover');
    })

    $("#full").fullpage({
            anchors: ['首页', '脸圈', '全民炫', '约吧', '玩家挣钱', '圈子', '粉天地', '云店', '智享头条', '娱乐', '泡圈聊天', 'footerPage'],
            menu: '#menunav',
            navigation: true,
            navigationPosition: "left",
            // navigationTooltips: ['首页', '脸圈', '全民炫', '约吧', '玩家挣钱', '圈子', '粉天地', '云店', '智享头条', '娱乐'],
            // resize: true,
            // css3: true,
            // loopBottom: true,
            // easing: true,
            // scrollOverflow: true,
            scrollingSpeed: 700,
            fitToSection: true,
            // 加载后处理底部样式
            afterRender: function(){
            	$('.footerPage>div').css('width', '100%');
            },
            afterLoad: function(anchorLink, index) {
                // 删掉所有的 animationclass
                clearInterval(timer)

                if (!$(this).find(".fl").hasClass('flr') && !$(this).find(".fr").hasClass('flr')) {
                    $(this).find(".fl").addClass("flr")
                    $(this).find(".fr").addClass("flr")
                }
                // console.log($(this))
                $('.section').removeClass('animation');
                // console.log(anchorLink)
                //index-nav  border-bottom 动画
                $.each($(".index-nav a"), function(i, item) {
                    $(item).removeClass("visited")
                    if ($(item).text() == anchorLink) {
                        $(item).addClass("visited")
                    }
                })
                    //轮播动画
                $(".lunbo_cont li").addClass("animated")
                var $lunbo = $(this).find(".lunbo_cont li");

                var len = $lunbo.length;
                $lunbo.eq(0).children(".icon").addClass("transX0")
                var index = 0;
                timer = setInterval(function() {
                    index++;
                    if (len == 1) {
                        return false;
                    }
                    if (index > len - 1) {
                        index = 0
                    }
                    if($lunbo.parent().parent().hasClass('hovered')) return;
                    $lunbo.children(".icon").removeClass("transX0").addClass('transX300').parent().removeClass("fadeIn").addClass('fadeOut')
                    $lunbo.eq(index).removeClass("fadeOut").addClass("fadeIn").children(".icon").removeClass("transX300").addClass("transX0")
                }, 3000)

                // nav a 颜色改变
                if (anchorLink == "首页" || anchorLink =="footerPage") {
                    $(".index-nav a").css('color', "#fff")
                } else {
                    $(".index-nav a").css('color', "#000")
                }
                
              
                    // 为当前页添加animationclass
                    // 首页 默认执行的速度太快了 还没看到 就执行完毕了 所以延迟一点
                    // setTimeout(function() {
                    //     // $('.section').css("height", "100%")
                    //     // $('.section>div').css("height", "100%")
                    //     $('.section').eq(index - 1).addClass('animation');
                    // }, 10)
            }
        })
        // headnav  点击
    $("#headnav a").on('click', function() {
        if ($(this).text() == location.hash.replace(/#/g, "")) {
            // console.log("1")
            return false
        }
        $("#headnav a").removeClass("visited")
        $(this).addClass("visited")
        var $this = $(this)
        $.each($("#headnav a"), function(i, item) {
            if ($(item) == $this) {
                var $that = $('.section').eq(i + 1)
                console.log($that)
            }
        })
        clearInterval(timer)
    })
    $("#headnav a").addClass("animated")
    $("#headnav a").on("mouseenter", function() {
        $("#headnav a").removeClass("tada")
        $(this).addClass("tada")
    })
      $("#headnav a").hover(function() {
                       
                        $(this).css("color", "rgb(232,69,69)")
                    }, function() {
                        // console.log(location.hash)
                        if(location.hash==""||location.hash=="#首页" || location.hash=="#footerPage"){
                            // console.log(1)
                             $(this).css("color", "#fff")
                        }else {
                            // console.log(2)
                            $(this).css("color", "#000")
                        }
                        
                    })

    function resize() {
        var boWidth = $('body').width()
        if (boWidth < 1024) {
            $("html").css("font-size", 1024 / 1920)
        } else {
            var fz = (boWidth / 1920) * 100
            // console.log(fz)
            $("html").css("font-size", fz)
        }
    }

    $(window).on("resize", function() {
        resize()
    });
    
    
})