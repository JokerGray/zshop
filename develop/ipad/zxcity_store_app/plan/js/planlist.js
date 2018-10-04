(function($){
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
    var pageNo = 1, pageSize = 8, totalPage = -1;

    function getUrlParams(name){
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null){
    		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
    }

    var projectType = getUrlParams("projectType") || 0;

    //加载方案内容
    function getPlanList(){
        var params = "{'projectType': " + projectType + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		async: false,
    		data: {
    			"cmd": 'shop/getShopProjectList',
    			"data": params,
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
    			if(res.code == 1){
                    totalPage = Math.ceil(res.total/pageSize);
                    showList(res.data);
                }
    		},
    		error: function(re){
    			console.error(re);
    		}
    	});
    }

   getPlanList();

    function showList(data){
        var sHtml = '';
        if(data.length && data.length > 0){
            for(var i=0; i<data.length; i++){
                var obj = data[i];
                var userHead = obj.userHead == null ? 'image/default_ava.png' : obj.userHead;
                var imgArr = (!obj.imageLinks || obj.imageLinks == "") ? [] : obj.imageLinks.split(",");
                var imgTotal = imgArr.length;
                if(imgTotal == 1){
                    sHtml += '<li class="list-item show-type1">'
                        + '<a href="plandetail.html?id='+obj.id+'"><div class="row">'
                        + '<div class="large-8 medium-8 small-8 columns">'
                        + '<div class="title">'+obj.title+'</div>'
                        + '<div class="publish-time">'+obj.createTime+'</div>'
                        + '<div class="publish-info">'
                        + '<div class="source left">'
                        + '<img class="pic" src="'+userHead+'" alt="'+obj.author+'" />'
                        + '<span class="name">'+obj.author+'</span></div>'
                        + '<div class="handle-btn right"><div class="like list-inline">'
                        + '<a class="icon like-btn" href="javascript:;"></a>'
                        + '<span class="num">'+obj.favCount+'</span></div>'
                        + '<div class="view list-inline"><i class="icon view-icon"></i>'
                        + '<span class="num">'+(obj.viewCount||0)+'</span></div></div></div></div>'
                        + '<div class="large-4 medium-4 small-4 columns">'
                        + '<div class="pic-show"><img src="'+obj.imageLinks+'">'
                        + '</div></div></div></a></li>'
                }else if(imgTotal == 2){
                    sHtml += '<li class="list-item show-type2">'
                        + '<a href="plandetail.html?id='+obj.id+'"><div class="row">'
                        + '<div class="large-12 medium-12 small-12 columns">'
                        + '<div class="title">'+obj.title+'</div>'
                        + '<div class="publish-time">'+obj.createTime+'</div></div></div>'
                        + '<div class="pic-show"><div class="row">'
                        + '<div class="large-6 medium-6 small-6 columns"><img src="'+imgArr[0]+'"></div>'
                        + '<div class="large-6 medium-6 small-6 columns"><img src="'+imgArr[1]+'"></div>'
                        + '</div></div>'
                        + '<div class="publish-info"><div class="source left">'
                        + '<img class="pic" src="'+userHead+'" alt="'+obj.author+'" />'
                        + '<span class="name">'+obj.author+'</span></div>'
                        + '<div class="handle-btn right"><div class="like list-inline">'
                        + '<a class="icon like-btn" href="javascript:;"></a>'
                        + '<span class="num">'+obj.favCount+'</span></div>'
                        + '<div class="view list-inline"><i class="icon view-icon"></i>'
                        + '<span class="num">'+(obj.viewCount||0)+'</span>'
                        + '</div></div></div></a></li>'

                }else if(imgTotal == 3){
                    sHtml += '<li class="list-item show-type3">'
                        + '<a href="plandetail.html?id='+obj.id+'"><div class="row">'
                        + '<div class="large-12 medium-12 small-12 columns">'
                        + '<div class="title">'+obj.title+'</div>'
                        + '<div class="publish-time">'+obj.createTime+'</div></div></div>'
                        + '<div class="pic-show"><div class="row">'
                        + '<div class="large-4 medium-4 small-4 columns"><img src="'+imgArr[0]+'"></div>'
                        + '<div class="large-4 medium-4 small-4 columns"><img src="'+imgArr[1]+'"></div>'
                        + '<div class="large-4 medium-4 small-4 columns"><img src="'+imgArr[2]+'"></div>'
                        + '</div></div>'
                        + '<div class="publish-info"><div class="source left">'
                        + '<img class="pic" src="'+userHead+'" alt="'+obj.author+'" />'
                        + '<span class="name">'+obj.author+'</span></div>'
                        + '<div class="handle-btn right"><div class="like list-inline">'
                        + '<a class="icon like-btn" href="javascript:;"></a>'
                        + '<span class="num">'+obj.favCount+'</span></div>'
                        + '<div class="view list-inline"><i class="icon view-icon"></i>'
                        + '<span class="num">'+(obj.viewCount||0)+'</span>'
                        + '</div></div></div></a></li>'

                }else if(imgTotal > 3){
                    sHtml += '<li class="list-item show-type4">'
                        + '<a href="plandetail.html?id='+obj.id+'"><div class="multi-pic-show">'
                        + '<div class="pic-box">'
                        + '<img src="'+imgArr[0]+'">'
                        + '</div>'
                        + '<div class="pic-total">'+imgTotal+'张图</div>'
                        + '</div>'
                        + '<div class="row"><div class="large-12 medium-12 small-12 columns">'
                        + '<div class="title">'+obj.title+'</div>'
                        + '<div class="publish-time">'+obj.createTime+'</div>'
                        + '</div></div>'
                        + '<div class="publish-info">'
                        + '<div class="source left">'
                        + '<img class="pic" src="'+userHead+'" alt="'+obj.author+'" />'
                        + '<span class="name">'+obj.author+'</span></div>'
                        + '<div class="handle-btn right">'
                        + '<div class="like list-inline">'
                        + '<a class="icon like-btn" href="javascript:;"></a>'
                        + '<span class="num">'+obj.favCount+'</span></div>'
                        + '<div class="view list-inline">'
                        + '<i class="icon view-icon"></i>'
                        + '<span class="num">'+obj.viewCount+'</span>'
                        + '</div></div></div></a></li>'
                }else{
                    sHtml += '<li class="list-item show-type0">'
                        + '<a href="plandetail.html?id='+obj.id+'"><div class="row">'
                        + '<div class="large-12 medium-12 small-12 columns">'
                        + '<div class="title">'+obj.title+'</div>'
                        + '<div class="publish-time">'+obj.createTime+'</div></div></div>'
                        + '<div class="publish-info"><div class="source left">'
                        + '<img class="pic" src="'+userHead+'" alt="'+obj.author+'" />'
                        + '<span class="name">'+obj.author+'</span></div>'
                        + '<div class="handle-btn right"><div class="like list-inline">'
                        + '<a class="icon like-btn" href="javascript:;"></a>'
                        + '<span class="num">'+obj.favCount+'</span></div>'
                        + '<div class="view list-inline"><i class="icon view-icon"></i>'
                        + '<span class="num">'+(obj.viewCount||0)+'</span>'
                        + '</div></div></div></a></li>'
                }
            }
        }else{
            //sHtml += '<li>暂无数据</li>'
        }
        $("#planList").append(sHtml);
    }

    $(function(){
        $(window).scroll(function () {
            //$(window).scrollTop()当前滚动条滚动的距离
            //$(window).height()获取当前窗体的高度
            //$(document).height()获取当前文档的高度
            var bot = 100; //bot是底部距离的高度
            if ((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
                //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
                //异步加载数据
                pageNo += 1;
                if(totalPage != -1 && pageNo <= totalPage){
                    getPlanList();
                }
            }
        });
    });




    //showList(res.data);
})(jQuery);
