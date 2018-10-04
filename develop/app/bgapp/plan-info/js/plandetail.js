(function($){
    var REQUEST_URL = {
        'detail':'shop/getOne',//详情
        'preview':'shop/getOneInfo',//预览
        'updateFav':'shop/updateFav',//点赞
        'delFav':'shop/delFav'//取消点赞
    }

    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

    function getUrlParams(name){
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null){
    		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
    }

    var planId = getUrlParams("id"), userId = getUrlParams("userId");

    //加载方案内容
    function getPlanDetailById(){
        var cmd = "", param = {'id':planId};
        if(userId == ""){
            cmd = REQUEST_URL['preview'];
            $(".other .like-btn").hide();
        }else{
            cmd = REQUEST_URL['detail'];
            param['userId'] = userId;
            $(".other .like-btn").show();
        }

        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		data: {
    			"cmd": cmd,
    			"data": JSON.stringify(param),
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
    			if(res.code == 1){
    				if(res.data==null){
    					window.location.href='blank.html';
    				}else{
    					$(".main-content .title").html(res.data.title);
	                    $(".main-content .time .time-txt").html(res.data.createTime);
	                    $(".main-content .content").html(res.data.content);
	                    $(".other .publisher .name").html(res.data.author);
	                    if(res.data.userHead != null){
	                        $(".other .publisher .pic").attr('src', res.data.userHead);
	                    }
                        if(res.data.isFav && res.data.isFav == 1){
                            $(".other .like-btn").addClass("active");
                        }
						var imgArr = $(".main-content .content").find("img");
						$.each(imgArr, function(i, item){
							$(item).attr("src", $(item).attr("src")+"?x-oss-process=image/format,jpg");
							$(item).addClass("content-img");
						});
    				}
                }else{
                	window.location.href='blank.html';
                }
    		},
    		error: function(re){
    			console.error(re);
    			window.location.href='blank.html';
    		}
    	});
    }

    //点赞
    function updateFav(){
        var param = {
            'id':planId,
            'userId':userId
        };
        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		data: {
    			"cmd": REQUEST_URL['updateFav'],
    			"data": JSON.stringify(param),
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
                $(".other .like-btn").addClass("active");
    		},
    		error: function(re){
    			console.error(re);
    		}
    	});
    }

    //取消点赞
    function delFav(){
        var param = {
            'id':planId,
            'userId':userId
        };
        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		data: {
    			"cmd": REQUEST_URL['delFav'],
    			"data": JSON.stringify(param),
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
                $(".other .like-btn").removeClass("active");
    		},
    		error: function(re){
    			console.error(re);
    		}
    	});
    }

    //点赞
    $(".other .like-btn").click(function(){
        if(userId != ""){
            if($(this).hasClass("active")){
                delFav();
            }else{
                updateFav();
            }
        }
    });


    $(function(){
    	if (navigator.onLine) { 
    		getPlanDetailById();
    	} else {
    		$('.main-content').html("<div class='netTip'>当前没有网络连接，请稍后再试</div>")
    	}
    });

})(jQuery);
