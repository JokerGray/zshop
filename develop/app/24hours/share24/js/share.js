(function($) {
    var start, share = function() {};
    share.prototype = {
        getData: function(d) {
            var Response = JSON.stringify(d);
            var res = reqAjax("cms_new/getCmsSpecialResponse", Response);
            if (res.data != null) {
                if (res.data.scCmsResourcesList) {
                    $("#resourcesUrl").attr("src", res.data.scCmsResourcesList[0].resourcesUrl);
                    $(".header_bg").css({
                        "background": "url(" + res.data.scCmsResourcesList[0].resourcesUrl + ") no-repeat",
                        "background-size": "cover"
                    });
                }
                $("#scCmsSpecialName").html(res.data.scCmsSpecialName);
                $("#specialBrowser").html(res.data.specialBrowser);
                $("#commentNumber").html(res.data.commentNumber);
                $("#scCmsSpecialDescribe").html("专题描述：" + res.data.scCmsSpecialDescribe);
            } else {
                alert("系统繁忙,请稍后再试");
                $("#resourcesUrl").attr("src", "img/logo.png");
                $(".header_bg").css({
                    "background": "url(img/logo.png) no-repeat",
                    "background-size": "cover"
                });
            }
        },
        getDataList: function(d) {
            $("#container").html("");
            var Response = JSON.stringify(d);
            var res = reqAjax("cms_new/getScCmsArticles", Response);
            var str = "";
            if (res.data) {
                $.each(res.data, function(i, v) {
                    if (v.previewImgType == 1) {
                        str = previewImgType1(v, "shareArticle");
                    } else if (v.previewImgType == 2) {
                        str = previewImgType2(v);
                    } else if (v.previewImgType == 3) {
                        str = previewImgType1(v, "shareImage");
                    } else if (v.previewImgType == 5) {
                        str = previewImgType5(v);
                    }
                    $("#container").append(str);
                });
                var w = $("section .small_img img").width();
                $("section .small_img img").height(w);
                // $("section").on('click', '.playA', function() {
                //     $(this).siblings("video").attr("autoplay", "autoplay");
                // });
            }
        }
    };
    start = new share();
    //头部信息
    start.getData({
        scCmsSpecialId: getUrlParams("id") || 0
    });
    //文章列表
    start.getDataList({
        "scCmsSpecialId": getUrlParams("id") || 0,
        "pagination": {
            "rows": "15",
            "page": "1"
        }
    });
    //js over
})(jQuery);

//单图文章,图集
function previewImgType1(r, url) {
    var d = "";
    d += '<div class="content clear article_box">';
    d += '<a class="block" href="' + url + '.html?userId=0&articleId=' + r.articleId + '">';
    d += '<div class="fl article_con">';
    d += '<p class="font32 text-overflow3 article_title">' + r.articleTitle + '</p>';
    d += '<div class="foot_content clear">';
    d += '<div class="fl">';
    d += '<span class="name">' + r.scSysUser.username + '</span>';
    d += '<i class="iconfont icon-info ml22 mr8"></i>';
    d += '<span class="seeNum">' + r.commentNum + '</span>';
    d += '</div>';
    d += '<div class="dateDiv fr" class="">' + (r.releaseTime).substr(0, 11) + '</div>';
    d += '</div>';
    d += '</div>';
    d += '<div class="fr article_cover">';
    $.each(r.scCmsResourcesList, function(k, v) {
        if (v.resourcesType == "cover") {
            d += '<img src="' + v.resourcesUrl + '" alt="pic" class="cover lazy">';
        }
    });
    d += '</div>';
    d += '</a>';
    d += '</div>';
    return d;
};

//三图文章
function previewImgType2(r) {
    var d = "";
    d += '<div class="content clear">';
    d += '<a class="block" href="shareArticle.html?userId=0&articleId=' + r.articleId + '">';
    d += '<div class="title text-overflow2">' + r.articleTitle + '</div>';
    d += '<div class="imgs">';
    d += '<div class="small_img">';
    $.each(r.scCmsResourcesList, function(k, v) {
        if (v.resourcesType == "cover") {
            d += '<img src="' + v.resourcesUrl + '" alt="pic">';
        }
    });
    d += '</div>';
    d += '<div class="small_label clear">';
    d += '<i class="iconfont icon-img"></i>';
    d += '<span>3</span>图';
    d += '</div>';
    d += '</div>';
    d += '<div class="foot_content clear">';
    d += '<div class="fl">';
    d += '<span class="name">' + r.scSysUser.username + '</span>';
    d += '<i class="iconfont icon-info ml22 mr8"></i>';
    d += '<span class="seeNum">' + r.commentNum + '</span>';
    d += '</div>';
    d += '<div class="dateDiv fr" class="">' + (r.releaseTime).substr(0, 11) + '</div>';
    d += '</div>';
    d += '</a>';
    d += '</div>';
    return d;
}

//视频
function previewImgType5(r) {
    var d = "";
    d += '<div class="content clear video_box">';
    d += '<a class="block" href="shareVideo.html?userId=0&articleId=' + r.articleId + '">';
    d += '<p class="text-overflow2">' + r.articleTitle + '</p>';
    $.each(r.scCmsResourcesList, function(k, v) {
        if (v.resourcesType == "video") {
            d += '<div class="playA cur-p"></div>';
            d += '<div class="poster_img" style="background:url(' + v.resourcesUrl + ') center center no-repeat;background-size:cover;"></div>';
            // d += '<video src="' + v.videoUrl + '" controls="controls"></video>';
        }
    });
    d += '</a>';
    d += '</div>';
    return d;
}


function getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
    }
    return "";
}
var userId = getUrlParams("userId"),
    articleId = getUrlParams("articleId"),
    praiseUser = "";

function reqAjax(cmd, data) {
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
    var reData = "";
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
        beforeSend: function(request) {
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            reData = re;
            if (reData.code != 1) {
                alert(re.msg);
                return false;
            }
        },
        error: function(re) {
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return reData;
}