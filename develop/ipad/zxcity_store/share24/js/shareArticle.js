(function($){
	function getUrlParams(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null){
			r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
			return decodeURI(decodeURIComponent(r[2]));
		}
		return "";
	}
    var userId = getUrlParams("userId"), articleId = getUrlParams("articleId"), praiseUser = "";

    function reqAjax(cmd, data){
    	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    	var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

    	var reData;
    	$.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		async: false,
    		data: {
    			"cmd": cmd,
    			"data": data,
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(re){
    			reData = re;
    		},
    		error: function(re){
    			var str1 = JSON.stringify(re);
    			re.code = 9;
    			re.msg = str1;
    			reData = re;
    		}
    	});
    	return reData;
    }


    //文章初始化
    function articleInit(){
        var param = "{'userId':"+userId+",'articleId': "+articleId+", 'praiseUser':'"+praiseUser+"'}";
        var resData = reqAjax('cms_new/queryArticleDetail', param);
        if(resData.code == 1){
            var obj = resData.data;
            //标题
            $(".article-title").html(obj.articleTitle);
            //作者头像
            $(".anthor-info .anthor-pic").html('<img src="'+obj.scSysUser.userpic+'">');
            //作者名称
            $(".anthor-info .name").text(obj.scSysUser.username);
            //发布时间
            $(".anthor-info .time").text(obj.releaseTime);
            //文章内容
            $(".article-content").html(obj.articleContent);
            //点赞数量
            $(".article-box .like .count").html(obj.praiseNumber);
            //$(".article-box .unlike .count").html();
            //推荐列表
            var recommendList = obj.recommendArticleList;
            showRecomendList(recommendList);
			loadCommentsList(1);
        }else{

        }
    }
    articleInit();

    //推荐列表
    function showRecomendList(recList){
        if(recList.length > 0){
            var sHtml = '', len = recList.length > 5 ? 5 : recList.length;
            for(var i=0; i<len; i++){
                var imgUrl = "";
                if(recList[i].previewImgType == 1){
                    sHtml += '<li class="show-img">'
                    imgUrl = recList[i].scCmsResourcesList[0].resourcesUrl
                }else{
                    sHtml += '<li>'
                }

                sHtml += '<div class="info">'
                    + '<a class="title" href="javascript:void(0);">'+recList[i].articleTitle+'</a>'
                    + '<div class="detail"><span class="name">'+recList[i].scSysUser.username+'</span>'
                    + '<span class="count">'+recList[i].commentNum+'</span><span class="time">'+recList[i].releaseTime+'</span>'
                    + '</div></div>'
                if(recList[i].previewImgType == 1){
                    sHtml += '<div class="poster"><img src="'+imgUrl+'">'
                    + '</div>'
                }
                    sHtml +='</li>'
            }
            $(".recomend-list ul").html(sHtml);
        }
    }

    //评论初始化
    function loadCommentsList(page){
        var param = "{'userId':"+userId+",'articleId': "+articleId+", 'pagination':'{\"page\":"+page+",\"rows\":10}'}";
        var resData = reqAjax('cms_new/selectTimeNewCmsComment', param);
        var sHtml = '';
        if(resData.code == 1){
            var obj = resData.data;
            for(var i=0; i<obj.length; i++){
                sHtml += '<li>'
                + '<div class="ava"><img src="'+obj[i].userImgUrl+'"></div>'
                + '<div class="info"><p class="name">'+obj[i].userName+'</p>'
                + '<div class="content">'+obj[i].commentComment+'</div>'
                + '<div><span class="time">'+obj[i].commentTime+'</span></div>'
                + '</div><div class="handle-box">'
                + '<a class="icon like-icon" href="javascript:void(0);"></a>'
                + '<span class="count">'+obj[i].praiseNumber+'</span></div></li>'
            }
            $(".comments-box .comment-title .count").text(obj.length);
        }

		if(sHtml == ''){
			$(".comments-box .more-btn").hide();
			sHtml = '<li class="empty">暂无评论</li>'
		}else{
			$(".comments-box .more-btn").show();
		}
		$(".comments-box .comments-list ul").append(sHtml);
    }

    //加载更多评论
    $(".comments-box .more-btn").click(function(){
        var curPage = $(this).attr("data-cur") ? $(this).attr("data-cur") : 1;
        var newPage = parseInt(curPage)+1;
        $(this).attr("data-cur", newPage);
        loadCommentsList(newPage);
    });
})(jQuery);
