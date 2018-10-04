(function($) {
    var articleId = getUrlParams("articleId"),
        yw = getUrlParams("yw") || "",
        cp = getUrlParams("cp") || "",
        sn = getUrlParams("sn") || "",
        isGift = getUrlParams("isGift") || "",
        isComment=getUrlParams("isComment"),
        praiseUser = "",
        userId="",
        shopId="";
    // var getPackLink = "getPackage.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn;
    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //判断有没有isGift字段，如果有隐藏领取礼包盒子    isGift == 1  ||  智享城市运营平台不显示点击礼包
    //判断是在苹果APP内，隐藏领取礼包盒子    isIOS()
    if((isNull(yw) && isNull(cp) && isNull(sn)) || isIOS() || isGift == 1) {
        $('.app-download').hide();
    } 
    //不在苹果APP内，显示领取礼包盒子
    else {
        $('.app-download').show();
    }
    //判断在苹果还是安卓
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

    //利用``帆布指纹``调用接口生成阅读量
    new Fingerprint2().get(function(result, components){
        var macId = setMacId(articleId, result);
        articleInit(macId);
    });

    //文章初始化
    function articleInit(macId) {
        var param = "{'articleId': " + articleId + ", 'praiseUser':'" + praiseUser + "', 'scCmsMacId': '"+ macId +"'}";
        reqAjaxAsync('cms_new/queryArticleDetail', param).done(function(resData) {
            if (resData.code == 1) {
                var obj = resData.data;
                shopId=obj.shopId;
                console.log("shopId",shopId)
                userId=obj.scSysUser.id;
                var userpic = obj.scSysUser ? obj.scSysUser.userpic : "";
                var username = obj.scSysUser ? obj.scSysUser.username : "";
                $("title").html(obj.articleTitle);
                //标题
                $(".article-title").html(obj.articleTitle);
                //作者头像
                $(".anthor-info .anthor-pic").html('<img src="' + userpic + '">');
                //作者名称
                $(".anthor-info .name").text(username);
                //发布时间
                $(".anthor-info .time").text(obj.releaseTime);
                //文章内容
                $(".article-content").html(formatImg(obj.articleContent));
                //点赞数量
                $(".article-box .like .count").html(obj.praiseNumber || 0);
                //踩数量
                $(".article-box .unlike .count").html(obj.retortNumber || 0);
                //推荐列表
                var recommendList = obj.recommendArticleList;
                showRecomendList(recommendList);
                loadCommentsList(1);
                shopList(0);
                var imgArr = [];
                if (!isNull(obj.scCmsResourcesList)) {
                    $.each(obj.scCmsResourcesList, function(i, v) {
                        if (v.resourcesType == "cover") {
                            imgArr.push(v.resourcesUrl);
                        }
                    });
                } else {
                    console.log("数据异常,缺少封面");
                }
                var desc = "来自：" + username + "智享城市： 智享头条";
                $("title").html(obj.articleTitle);
                var meta = '<meta name="description" itemprop="description" content="' + desc + '"><meta itemprop="image" content="' + imgArr[0] + '">';
                $("head").prepend(meta);
                // 分享调用
                share({
                    imgUrl: imgArr[0] || "",
                    title: obj.articleTitle,
                    desc: desc,
                    link: location.href
                });
            } else {
                if(resData.code == 8) {
                    articleMissing(resData.msg)
                } 
                layer.open({
                    content: resData.msg,
                    skin: 'msg',
                    time: 5
                });
            }
        });

    }

    //推荐列表
    function showRecomendList(recList) {
        if (recList.length > 0) {
            var sHtml = '',
                len = recList.length > 5 ? 5 : recList.length;
            var arr = [];
            for (var i = 0; i < len; i++) {
                var imgUrl = "";
                sHtml += '<li class="show-img">'
                if (!isNull(recList[i].scCmsResourcesList)) {
                    $.each(recList[i].scCmsResourcesList, function(i, v) {
                        if (v.resourcesType == "cover") {
                            arr.push(v.resourcesUrl);
                        }
                    });
                }
                imgUrl = arr[0];
                arr = [];
                sHtml += '<div class="info">' +
                    '<a class="title" >' + recList[i].articleTitle + '</a>' +
                    '<div class="detail"><span class="name">' + recList[i].scSysUser.username + '</span>' +
                    '<a class="icon msg_icon"></a>' +
                    '<span class="count">' + recList[i].commentNum + '</span><span class="time">' + recList[i].releaseTime.substr(0, 11) + '</span>' +
                    '</div></div>'
                sHtml += '<div class="poster"><img src="' + imgUrl + '">' +
                    '</div></li>';
            }
            $(".recomend-list ul").html(sHtml);
        }
    }

    //评论初始化
    function loadCommentsList(page) {
        var param = "{'articleId': " + articleId + ", 'pagination':'{\"page\":" + page + ",\"rows\":10}'}";
        reqAjaxAsync('cms_new/selectTimeNewCmsComment', param).done(function(resData) {
            var sHtml = '';
            if (resData.code == 1) {
                var obj = resData.data.scCmsCommentList;
                if (!obj) return false;
                for (var i = 0; i < obj.length; i++) {
                    sHtml += '<li>' +
                        '<div class="ava"><img src="' + obj[i].userImgUrl + '"></div>' +
                        '<div class="info"><p class="name">' + obj[i].userName + '</p>' +
                        '<div class="content">' + obj[i].commentComment + '</div>' +
                        '<div><span class="time">' + obj[i].commentTime + '</span></div>' +
                        '</div><div class="handle-box">' +
                        '<a class="icon like-icon" href="javascript:void(0);"></a>' +
                        '<span class="count">' + obj[i].praiseNumber + '</span></div></li>'
                }
                $(".comments-box .comment-title .count").text(obj.length);
            } else {
                layer.open({
                    content: resData.msg,
                    skin: 'msg',
                    time: 5
                });
            }

            if (sHtml == '') {
                $(".comments-box .more-btn").hide();
                sHtml = '<li class="empty">暂无评论</li>'
            } else {
                $(".comments-box .more-btn").show();
            }
            $(".comments-box .comments-list ul").append(sHtml);
        });

    }

    //加载更多评论
    $(".comments-box .more-btn").click(function() {
        var curPage = $(this).attr("data-cur") ? $(this).attr("data-cur") : 1;
        var newPage = parseInt(curPage) + 1;
        $(this).attr("data-cur", newPage);
        loadCommentsList(newPage);
    });
    //店铺列表
    var objList=[];
    function shopList(index){
        var param='{"userId":"'+userId+'","shopIds":"'+shopId+'"}';
            reqAjaxAsync('cms_new/listManageOnlineShop', param).done(function(res) {
                if(res.code==1&&res.data.length>0&&isComment!=1){
                $(".shop").show();
                objList=res.data;
                console.log(objList);
                if(index==0){
                    if(objList.length>5){
                        shopFor(objList,0,5); 
                        $(".more").show();
                    }else{
                        shopFor(objList,0,objList.length); 
                        $(".more").hide();
                    }
                }
            }
        })
        
    }

    $(".more").click(function(){
        shopFor(objList,5,objList.length);
    })

    function shopFor(res,flag,length){
        if(flag==5){
            $(".more").hide();
        }
        var sHtml='';
        for(var i=flag;i<length;i++){
             sHtml+= '<div class="list" data-id='+res[i].id+' data-longitude='+res[i].longitude+' data-latitude='+res[i].latitude+' data-shopName='+res[i].shopName+' data-shopId='+res.id+' data-address='+res[i].address+' data-bgImg='+res.bgImage+' data-logo='+res[i].bgImage+'>'+
                    '<div class="left">'+
                        '<img class="ic" src="'+res[i].bgImage+'" alt="">'+
                    '</div>'+
                    '<div class="left infolist">'+
                        '<p class="titnav">'+res[i].shopName+'</p>'+
                        '<p class="address">'+
                            '<img src="img/address.png" alt="">'+res[i].address+''+
                        '</p>'+
                    '</div>'+
                '</div>'
        }
    
        $(".shop .content_list").append(sHtml);
    }
    $("body").on("click",".list",function(){
        //点击跳转
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        //获取当前店铺id
        var longitude=$(this).attr("data-longitude");
        var latitude=$(this).attr("data-latitude");
        var shopName=$(this).attr("data-shopName");
        var shopId=$(this).attr("data-id");
        var address=$(this).attr("data-address");
        var bgImg=$(this).attr("data-bgImg");
        var logo=$(this).attr("data-logo");
        if (isWeixin) {
            window.location.href = "/shopShare/shopShare.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn+"&longitude="+longitude+"&latitude="+latitude+"&shopName="+shopName+"&shopId="+shopId+"&address="+address+"&bgImg="+bgImg+"&logo="+logo;
        }else{
            $("#downloadA").click();
        } 
    })

    $("body").on("click",".info",function(){
        $("#downloadA").click();
    })
    //分享礼包跳转APP
    //跳转app商品详情页地址
    var jumpParams = getUrlParams("jumpParams") || "";
    console.log(jumpParams);
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

