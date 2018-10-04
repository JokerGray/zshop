(function($){
    //图片轮播
    $(".jp-add-pic .add-pic-link").click(function(){
        window.parent.layer.open({
            type: 2,
            title: ['图片设置-自动轮播', 'height:46px;'],
            shadeClose: false,
            area: ['1024px', '814px'],
            offset: '75px',
            anim: 5,
            content: ['addCarouselPic.html', 'no']
        });
    });
})(jQuery);
