$(function () {
    var CMD_QUERYANSWER = "cms_new/queryQuestionDetail",
        CMD_QUESTION = 'cms_new/queryAnswerList';

    var userId = getUrlParams("userId") || "",
        articleId = getUrlParams("articleId") || "",
        yw = getUrlParams('yw'),
        cp = getUrlParams("cp"),
        sn = getUrlParams('sn'),
        jumpParams = getUrlParams("jumpParams") || "";
    // 跳转广告页面
    // var getPackLink = "getPackage.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn;
    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //跳转app商品详情页地址
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
    // 初始化文章详情
    var detailData={
        userId: userId,
        articleId:articleId
    }
    reqAjaxAsync(CMD_QUERYANSWER, JSON.stringify(detailData)).done(function (res) {
        console.log(res)
        var headHtml=template("queQues",res);
        $('#question').html(headHtml)
    });
    // 初始化的数据
    var data = {
        userId: userId,
        pagination: {
            page: 1,
            rows: 10
        },
        articleId: articleId
    }
    reqAjaxAsync(CMD_QUESTION, JSON.stringify(data)).done(function (res) {
        if (res.code == 1) {
            if (!isNull(res.data)) {
                var htmls = template('queItem', res);
                $('#qesList').html(htmls)
                $('#answerNum').html(res.total + '个回答');
                // 微信分享内容定义
                var shareObj = {
                    title: "智享城市文章回答",
                    desc: "智享城市文章回答",
                    link: location.href,
                    imgUrl: res.data[0].scSysUser.userpic
                }
                share(shareObj);
                //分享打开APP
                //页面跳转app or商店
                $(".user-info,.toApp,.ans-tit").on('click', function () {
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
                        } else if (navigator.userAgent.indexOf('QQ') > -1) {
                            showMsg();
                        } else {
                            window.location.href = $ios_app;
                            setTimeout(function () {
                                window.location.href = $ios_app_download;
                            }, 3000);
                        }
                    } else {
                        //判断为pc
                        window.location.href = $android_app_download;
                    }
                });
            } else {
                $('#qesList').html('<div class="no-article">暂无回答或已删除...</div>')
            }
        } else {
            $('#qesList').html('<div class="no-article">暂无回答或已删除...</div>')
        }

    });
    // 微信中引导用户浏览器打开
    function showMsg() {
        $('#wxLayer').unbind('click');
        $('#msgBox').unbind('click');
        $('#wxLayer').show();
        $('#wxLayer').on("click", function () {
            $('#wxLayer').hide();
        });
        $('#msgBox').on("click", function (event) {
            event.stopPropagation();
        });
    }

})

//判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "undefined" || val == "") {
        return true;
    }
    return false;
}