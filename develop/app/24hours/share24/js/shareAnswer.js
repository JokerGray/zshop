$(function () {
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
    var userId = getUrlParams("userId")||"",
        articleId = getUrlParams("articleId")||"",
        yw=getUrlParams('yw'),
        cp=getUrlParams("cp")||"1",
        sn=getUrlParams('sn')||"",
        jumpParams=getUrlParams("jumpParams")||"";
    var CMD_QUERYANSWER= "cms_new/queryAnswerDetail",
        CMD_QUERYLIST="cms_new/selectTimeNewCmsComment";
    // 跳转广告页面
    // var getPackLink = "getPackage.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn;
    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //跳转app商品详情页地址
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;

    function queryArticle(){
        return new Promise(function(resolve,reject){
            //查询文章详情
            var queryArticle={
                userId: userId,
                articleId:articleId
            }
            var queryData=JSON.stringify(queryArticle);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_QUERYANSWER,
                    "data": queryData || "",
                    "version": version
                },
                beforeSend: function (request) {
                    request.setRequestHeader("apikey", apikey);
                },
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            });            
        })
    }

    function queryList(){
        return new Promise(function(resolve,reject){
            //查询评论
            var queryRec={
                userId:userId,
                pagination:{
                    page:1,
                    rows:5
                },
                commentId:0,
                articleId:articleId
            }
            var queryRecData=JSON.stringify(queryRec);            
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd":CMD_QUERYLIST,
                    "data": queryRecData || "",
                    "version": version
                },
                beforeSend: function (request) {
                    request.setRequestHeader("apikey", apikey);
                },
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            }); 
        })
    }

    Promise.all([queryArticle(),queryList()]).then(function(dataArr){
            // console.log(dataArr)
            if(dataArr[0].code==1){
                var htmlCont=template('showPage',dataArr[0])
                $('#pageCont').html(htmlCont);
                var htmlCom=template('comments',dataArr[1]);
                $('#commentArea').html(htmlCom);                
            }else{
                $('.page').html('<div class="no-article">回答不存在或被删除！</div>')
            }
            // console.log(dataArr[0])
            // 微信分享内容定义
            var shareObj={
                title:dataArr[0].data.scSysUser.username,
                desc:"查看"+dataArr[0].data.scSysUser.username+"的回答",
                link:location.href,
                imgUrl:dataArr[0].data.articleTitle
            }
            // console.log(shareObj);
            share(shareObj);
        //分享打开APP
        //页面跳转app or商店
        $(".toApp").on('click', function() {
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
    });
    // 微信中引导用户浏览器打开
    function showMsg(){
        $('#wxLayer').unbind('click');
        $('#msgBox').unbind('click');
        $('#wxLayer').show();
        $('#wxLayer').on("click",function(){
            $('#wxLayer').hide();
        });
        $('#msgBox').on("click",function(event){
            event.stopPropagation();
        });
    }

});