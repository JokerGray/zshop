import './zshop.scss';
$(function(){
    //菜单变色
    $(".nav-list li").removeClass("active");
    $(".nav-list").find("li").eq(1).addClass("active");
    var _left = $('.nav-header .nav-list>li.active').offset().left - $('.nav-container .nav-line-block').offset().left;
    $('.nav-container .nav-line').css('left', _left);

    $('#superContainer').fullpage({
        verticalCentered: false,
        // anchors: ['page1', 'page2', 'page3', 'page4','page5','page6'],
        css3: true,
        slidesColor: ['#F0F2F4', '#fff', '#fff', '#fff'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['智享店务', '销售篇', '前台服务', '员工操作', '店长管理','智享店务下载'],//提示信息
        resize:true,
        scrollingSpeed       :1000,
        afterLoad:function(anchorLink, index){
            // if(index == 6){
            //     index = 0;
            // }
            $('.next').click(function () {
                $.fn.fullpage.moveTo(index+1);
            })
        },
    });

    $("video").on("play", function() {
        $(this).siblings("i").addClass("gone")
    })
    $("video").on("pause", function() {
        $(this).siblings("i").removeClass("gone")
    })
    $("video").siblings("i").on("click", function() {
        $(this).siblings("video")[0].play()
    })
    $("video").on("click", function() {
        if ($(this).siblings("i").hasClass("gone")) {
            $(this)[0].pause()
        } else {
            $(this)[0].play()
        }
    })
})