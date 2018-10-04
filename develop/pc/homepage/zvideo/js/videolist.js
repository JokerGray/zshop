(function($){
	changeTop()
    //tab切换
    $(".list-tab .tab-item").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var dataRel = $(this).attr("data-rel");
        $(".list-box .video-list."+dataRel).removeClass("hide").siblings().addClass("hide");
        // 处理底部样式
        changeTop();
        $('.headerNav>li.active').removeClass('active');
        $('.headerNav>li').eq($(this).index() + 1).addClass('active');
    });

	$('.headerNav>li').click(function(){
		$('.headerNav>li.active').removeClass('active');
		$(this).addClass('active');
		var hash = $(this).find('a').attr('href').split('#')[1];
		if(!hash) return;
		$(".list-tab .tab-item[data-rel="+hash+"]").addClass("active").siblings().removeClass("active");
    	$(".list-box .video-list."+hash).removeClass("hide").siblings().addClass("hide");
    	changeTop();
	});

    $(function(){
        var hash = location.hash.substring(1);
	    if(!hash) return;
	    $(".list-tab .tab-item[data-rel="+hash+"]").addClass("active").siblings().removeClass("active");
	    $(".list-box .video-list."+hash).removeClass("hide").siblings().addClass("hide");
	    changeTop();
    });

    //查看视频
    $(".list-box .video-list").delegate(".video-item", "click", function(){
        var videoUrl = $(this).attr("data-url");
        var sHtml = '<div class="video-box"><video id="videoShow" src="'+videoUrl+'" width="100%" height="98%">'
            + '您的浏览器不支持 HTML5 video 标签~'
            + '</video><a href="javascript:;" class="play-btn"></a></div>';
        layer.prompt({title: '输入观看密码！', formType: 1}, function(pass, index){
        	if(pass != 'jtnrhdzxsh'){
        		layer.msg('密码错误！',{icon: 2})
        	} else{
        		openVideo(sHtml)
        	}
        	layer.close(index);
		});
    });
})(jQuery);

function changeTop(){
//	var last = $('.video-item').not(':hidden').last();
//	var h = 100
//	if(last.length != 0){
//		h = last.offset().top + last.height() - $('.banner-box').height() + 100;
//	   $('.footerPage').css('margin-top', h);
//	}
	$('.footerPage').css('margin-top', 300);
}

function openVideo(sHtml){
	layer.open({
	    type: 1,
	    title: '视频教程',
	    area: ['600px', '450px'], //宽高
	    content: sHtml,
	    success:function(index, layero){
	        var myVideo = document.getElementById("videoShow");
	        $(".video-box .play-btn").click(function(){
	            if (myVideo.paused){
	                myVideo.play();
	                $(this).hide();
	            }else {
	                myVideo.pause();
	                $(this).show();
	            }
	        });
	    }
	});
}
