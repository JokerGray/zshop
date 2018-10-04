(function($) {
    // 初始化调用
    //测试环境标示
    var articleId = getUrlParams("articleId"),
        userId = getUrlParams("userId"),
        praiseUser = "";
    
    //利用``帆布指纹``调用接口生成阅读量
    new Fingerprint2().get(function(result, components){
        var macId = setMacId(articleId, result);
        imgInit(macId);
    });
    moreWord(".image-text", 210);

    //判断在苹果还是安卓并且要在APP内
    function isIOS() {
      var u = window.navigator.userAgent;
      return !!u.match(/\(i[^;]+;( u;)? CPU.+Mac OS X/) && u.indexOf('SmartCity') > -1;
    }
    function isAndroid () {
        var u = window.navigator.userAgent;
        return (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && u.indexOf('SmartCity') > -1;
    }
    //当文章被删除时返提示信息
    function articleMissing(tips) {
        if(isAndroid()){
            window.jsObj.articleMissing(tips);
        } else if(isIOS()){
            window.webkit.messageHandlers.winPrize.articleMissing({tips: tips});
        }
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

    function reqAjaxAsync(cmd, data) {
        var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
        var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
        var defer = $.Deferred();
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            data: {
                "cmd": cmd,
                "data": data || "",
                "version": version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(data) {
                defer.resolve(data);
            },
            error: function(err) {
                alert("系统繁忙，请稍后再试!");
                console.log(err.status + ":" + err.statusText);
            }
        });
        return defer.promise();
    }

    //文字超出部分用省略号代替
    function moreWord(event, num) {
        $(event).each(function() {
            var val = $(this).text();
            var valLength = val.length;
            var subVal = val.substring(0, num) + "...";
            if (valLength > num) {
                $(this).text(subVal);
            } else {
                $(this).text();
            }
        });
    }

    //判断是否为空
    function isNull(val) {
        if (val == null || val == "null" || val == undefined || val == "") {
            return true;
        }
        return false;
    }

    //图集初始化
    function imgInit(macId) {
        var param = "{'userId':'" + userId + "','articleId':'" + articleId + "','praiseUser':'" + praiseUser + "', 'scCmsMacId': '"+ macId +"'}";
        reqAjaxAsync('cms_new/queryArticleDetail', param).done(function(res) {
            var sHtml = "";
            var sum = 0;
            var obj = res.data;
            var imgArr = [];
            if (res.code == 1) {
                var userpic = obj.scSysUser ? obj.scSysUser.userpic : "";
                var username = obj.scSysUser ? obj.scSysUser.username : "";
                if (!isNull(obj.scCmsResourcesList)) {
                    $.each(obj.scCmsResourcesList, function(i, v) {
                        if (v.resourcesType == "image") {
                            sHtml += '<div class="swiper-slide">' +
                                '<div class="image-body">' +
                                '<img src="' + v.resourcesUrl + '"/>' +
                                '</div>' +
                                '<div class="image-info">' +
                                '<div class="images-nums">' +
                                '<span class="images-num">' + (++sum) + '</span>/' + '<span class="images-total"></span>' +
                                '</div><div class="image-text">' + v.resourcesRemarks + '</div>';
                        }
                        sHtml += '</div></div>';
                        if (v.resourcesType == "cover") {
                            imgArr.push(v.resourcesUrl);
                        }
                    });
                    $(".image-content").append(sHtml);
                    $(".image-content").find(".images-total").html(sum);
                    //图集轮播
                    var swiper = new Swiper('.swiper-container', {
                        autoplay: 2500,
                    });
                    // 分享
                    var desc = "来自：" + username + "智享城市： 智享头条";
                    $("title").html(obj.articleTitle);
                    var meta = '<meta name="description" itemprop="description" content="' + desc + '"><meta itemprop="image" content="' + imgArr[0] + '">';
                    $("head").prepend(meta);
                    // 分享调用
                    share({
                        imgUrl: imgArr[0] || "",
                        title: obj.articleTitle,
                        desc: "来自：" + username + "　　智享城市：智享头条",
                        link: location.href
                    });
                }
            } else {
                if(res.code == 8) {
                    articleMissing(res.msg)
                } 
                layer.open({
                    content: res.msg,
                    skin: 'msg',
                    time: 5
                });
            }
        });
    }

    //分享礼包跳转APP
    //跳转app商品详情页地址
    var jumpParams = getUrlParams("jumpParams") || "";

    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //跳转app地址
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
    
    //页面跳转app or商店
    $("#downloadA").on('click', function() {
        //判断为android
        if (navigator.userAgent.match(/android/i)) {
            //android非微信
            if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {
                var last = Date.now();
                var doc = window.document;
                var ifr = doc.createElement('iframe');
                ifr.src = $android_app;
                ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
                doc.body.appendChild(ifr);
                setTimeout(function () {
                    doc.body.removeChild(ifr);
                    //setTimeout回小于2000一般为唤起失败
                    if (Date.now() - last < 4000) {
                        window.location.href = $android_app_download;
                    }
                }, 3000);
            } else {
                //android微信
                showMsg();
            }
        //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                showMsg();
            //QQ内置浏览器
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                showMsg();
            } else {
                window.location.href = $ios_app;
                setTimeout(function () {
                    window.location.href = $ios_app_download;
                }, 3000);
                // setTimeout(function () {
                //     window.location.reload();
                // }, 1000);
            }
        } else {
            //判断为pc
            window.location.href = $android_app_download;
        }    
    });

    // 微信中引导用户浏览器打开
    function showMsg(){
        $('.wx_layer').unbind('click');
        $('#msgBox').unbind('click');
        $('.wx_layer').show();
        $('.wx_layer').on("click",function(){
            $('.wx_layer').hide();
        });
        $('#msgBox').on("click",function(event){
            event.stopPropagation();
        });
    }

})(jQuery);