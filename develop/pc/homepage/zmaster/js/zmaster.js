$(function() {

    $.each( $(".title-lists a"),function(i,item){
        if($(item).attr("href")==location.hash){
            $(item).addClass("visited")
        }
    })


    $(".title-lists a").on("click",function(){
        $(".title-lists a").removeClass("visited")
        $(this).addClass("visited")
    })


    $(".loader").hide("slow")
    $(".Top").slideDown("slow")
    $("#full").slideDown("normal")
    resize()
    $("#full").fullpage({
    	menu: '#myMenu',
        anchors: ['index', '大师圈', '智经营', '直播', '我的云店', '工作台', 'footerPage'],
        // resize: true,
        // css3: true,
        // loopBottom: true,
        scrollingSpeed: 700,
        fitToSection: true,
        // 加载后处理底部样式
        afterRender: function(){
        	$('.footerPage>div').css('width', '100%');
        },
        afterLoad: function(anchorLink, index) {
            $("#full")[0].style.transform="translate3d(0, -"+(index-1)+"00%, 0)"
             // $('#full').css("transform", "translate3d(0, 0, 0)")
             $(".title-lists a").removeClass("visited")
            $.each( $(".title-lists a"),function(i,item){
        if($(item).attr("href")==location.hash){
            $(item).addClass("visited")
        }
    })


            // 删掉所有的 animationclass
            $('.section').removeClass('animation');
            $('.section').css("height", "100%")
            $('.section>div').css("height", "100%")
                // 为当前页添加animationclass
                // 首页 默认执行的速度太快了 还没看到 就执行完毕了 所以延迟一点
            setTimeout(function() {
                $('.section').css("height", "100%")
                $('.section>div').css("height", "100%")
                $('.section').eq(index - 1).addClass('animation');
            }, 10)

        }
    })

    function resize() {
        var boWidth = $('body').width()
        if (boWidth < 1024) {
            $("html").css("font-size", 1024 / 1920)
        } else {
            var fz = (boWidth / 1920) * 100
            $("html").css("font-size", fz)
        }
    }

    $(window).on("resize", function() {
        resize()
    });
    $('.icontop').click(function(){
    	$("#full").fullpage.moveTo(1);
    })
})