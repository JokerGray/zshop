(function($){
    //tabs页切换
    $('#dp-main .aside-nav .btn').click(function () {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.content-box .content').eq(index).removeClass('hidden').siblings().addClass('hidden');
    });
    $(function(){
        $(".content-box").html($("#dpTemplate").html());
    });

    //图片轮播
    $(".content-box").delegate(".content-1 .add-pic-link", "click", function(){
        window.parent.layer.open({
            type: 2,
            title: ['图片设置-自动轮播', 'height:46px;'],
            shadeClose: false,
            area: ['1024px', '768px'],
            offset: '75px',
            anim: 5,
            content: ['storeCarousel.html', 'no']
        });
    });

    $(".carousel").delegate(".carousel-inner .item", "click", function(){
        window.parent.layer.open({
            type: 2,
            title: ['图片设置-自动轮播', 'height:46px;'],
            shadeClose: false,
            area: ['1024px', '768px'],
            offset: '75px',
            anim: 5,
            content: ['storeCarousel.html', 'no']
        });
    });

    //图片轮播
    function initLoadContent_1(_index, obj){
        var str_1 = '', str_2 = '';
        if(obj.length > 0){
            for(var i=0; i<obj.length; i++){
                var picDesc = obj[i].desc ? obj[i].desc : "";
                if(_index == 0){
                    str_1 += '<a href="javascript:;" class="item active"><img src="'+obj[i].imgUrl+'"><div class="carousel-caption">'+picDesc+'</div></a>'
                    str_2 += '<li data-slide-to="0" data-target="#storePicList_2" class="active"></li>'
                }else{
                    str_1 += '<a href="javascript:;" class="item"><img src="'+obj[i].imgUrl+'"><div class="carousel-caption">'+picDesc+'</div></a>'
                    str_2 += '<li data-slide-to="'+_index+'" data-target="#storePicList_1"></li>'
                }
            }
            $("#storePicList_1 .carousel-inner").html(str_1);
            $("#storePicList_1 .carousel-indicators").html(str_2);
        }

    }
    //员工展示
    function initLoadContent_2(obj){
        var str_1 = '', str_2 = '';
        if(obj.length > 0){
            for(var i=0; i<obj.length; i++){
                var picDesc = obj[i].desc ? obj[i].desc : "";
                if(_index == 0){
                    str_1 += '<a href="javascript:;" class="item active"><img src="'+obj[i].imgUrl+'"><div class="carousel-caption">'+picDesc+'</div></a>'
                    str_2 += '<li data-slide-to="0" data-target="#storePicList_2" class="active"></li>'
                }else{
                    str_1 += '<a href="javascript:;" class="item"><img src="'+obj[i].imgUrl+'"><div class="carousel-caption">'+picDesc+'</div></a>'
                    str_2 += '<li data-slide-to="'+_index+'" data-target="#storePicList_2"></li>'
                }
            }
            $("#storePicList_2 .carousel-inner").html(str_1);
            $("#storePicList_2 .carousel-indicators").html(str_2);
        }
    }
    //视频展示
    function initLoadContent_3(obj){
        if(obj.length > 0){
            var sHtml = '';
            for(var i=0; i<obj.length; i++){
                sHtml += '<li id="'+obj[i].videoId+'" data-videoUrl="'+obj[i].videoUrl+'">'
                    + '<a class="video-pic" href="javascript:;"><img src="'+obj[i].imgUrl+'"></a>'
                    + '<p class="video-title">'+obj[i].title+'</p></li>'
            }
            $(".content-3 .video-list ul").html(sHtml);
            $(".content-3 .video-list").removeClass("hidden").siblings().addClass("hidden");
        }else{
            $(".content-3 .video-list").addClass("hidden").siblings().removeClass("hidden");
        }
    }
    //点击视频列表弹框播放视频
    $(".content-3 .video-list ul").delegate("li .video-pic", "click", function(){
        var videoId = $(this).parent().attr("id"),
            videoUrl = $(this).parent().attr("data-videoUrl"),
            videoTitle = $(this).parent().find(".video-title").text();
        window.parent.layer.open({
            type: 2,
            title: ['视频展示——'+videoTitle, 'height:46px;'],
            shadeClose: false,
            area: ['600px', '600px'],
            offset: '75px',
            anim: 5,
            content:'<video src="' + videoUrl + '"></video>'
        });
    });

    //720度全景
    function initLoadContent_4(){

    }
    //直播空间
    function initLoadContent_5(){

    }
    //虚拟空间
    function initLoadContent_6(){

    }

})(jQuery);
