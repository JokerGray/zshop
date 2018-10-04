var laytpl = layui.laytpl;
var totalCount;
$(function(){
    var userId = localStorage.getItem("userId") || "1";
    var friendCircleList=$("#friendCircleList").html();
    var understandList=$("#understand").html();
    var targetUserId=getParams("targetUserId");
    var targetUserCode=getParams("targetUserCode");
    var share=function(){
        this.requestUrl={
            navHead:"user/findSysUserFansNumberById",
            friendCircleUrl:"msgpush/getPublishStatusByUserCode2N",
            personCenter:"user/userHomePage"
        }
        this.nav={
            loginUserId: "",
            targetUserId: targetUserId
        }
        this.friendCircle={
            myUserCode: "0",
            userCode: targetUserCode,
            temprow: "10",
            userId: targetUserId,
            temppage: "0"
        }
        this.understand={
            queryType: "-1",
            loginUserId: "0",
            targetUserId: targetUserId,
            pageSize: "10",
            pageNum: "0",
            appVersion:"1.5.2"
        }
    };
    share.prototype={
        getNav:function(d){
            var _this=this;
            reqAjaxAsync(_this.requestUrl.navHead, d).done(function(res) {
                if(res.code!=1){return layer.msg(res.msg)};
                var data = res.data;
                if(!isNull(data)){
                    var mydath;
                    // 获取的当前月份
                    var newm=new Date().getMonth()+1;
                    if(isNull(data.userbirth)){
                        mydath=0;
                    }else{
                        var dath=data.userbirth.substr(5,2);
                        if(dath-newm>=0){
                            mydath=new Date().getFullYear()-data.userbirth.substr(0,4)-1;
                        }else{
                            mydath=new Date().getFullYear()-data.userbirth.substr(0,4);
                        }
                    }
                    var headerContent={
                        headericon:'<img class="portrait" src='+data.userpic+' alt="">',
                        zcimg:data.isConcerned==1?'<img class="zc" src="img/zc.png" alt="">':'<img class="zc" src="img/yzc.png" alt="">',
                        userName:data.username,
                        sex:data.sex=="女"?'<img src="img/nv.png">':'<img src="img/nan.png">',
                        age:mydath,
                        address:isNull(data.cityName)?'暂无地址':data.cityName,
                        zcnuml:isNull(data.concernedNumber)?"0":data.concernedNumber,
                        fansnuml:isNull(data.fansNumber)?"0":data.fansNumber
                    }
                    for(var v in headerContent){
                        $(".header ."+v).html(headerContent[v]);
                    }
                    $("title").html(headerContent.userName+"的个人主页");
                }
            })
        },
        getfriendList:function(url,d,index){
            var _this=this;
            reqAjaxAsync(url,d,index).done(function(res) {
                if(res.code!=1){return layer.msg(res.msg)};
                if(!isNull(res.data)){
                    if(index==0){
                        if(res.data.total==0){
                            $(".friendCircle .zanwei").show();
                            return;
                        }
                        totalCount=res.data.total;
                        laytpl(friendCircleList).render(res.data.dynamics, function(html){
                            $(".friendCircle ul").html(html);
                        });
                    }else{
                        if(isNull(res.data.circle)&&isNull(res.data.face_circle_content)&&isNull(res.data.shop)&&isNull(res.data.service)&&isNull(res.data.earnmoney)&&isNull(res.data.toutiao_content)&&isNull(res.data.xuan_content)){
                            $(".understand .zanwei").show();
                            return;
                        }
                        $(".understand .intro .indes").html(res.data.signature);
                        // 圈子
                        var quanZi=res.data.circle;
                        if(!isNull(quanZi)){
                            var qz='';
                            for(var i =0;i<quanZi.length;i++){
                                qz +='<div class="quanCon clear">'
                                +'<img class="quanImg" src='+quanZi[i].circlePortrait+' alt="">'
                                +'<p class="quanW ellipsis">'+quanZi[i].circleName+'</p>'
                                    +'</div>';
                            }
                            $(".quanScroll").html(qz);
                        }else{
                            $(".quanziwrap").hide();
                        }

                        // 脸圈
                        var lianquanZi=res.data.face_circle_content;
                        if(!isEmptyObject(lianquanZi)){
                            var qz='';
                            for(var i =0;i<lianquanZi.length;i++){
                                qz +='<div class="lianCon">'
                                        +'<img class="yunImg" src='+lianquanZi[i].pictureList[0].fileUrl+' alt="">'
                                    +'</div>';
                            }
                            $(".lianScroll").html(qz);
                        }else{
                            $(".lianquanwrap").hide();
                        }
                        // 云店
                        var yundain=res.data.shop;
                        if(!isNull(yundain)){
                            var qz='';
                            for(var i =0;i<yundain.length;i++){
                                qz +='<div class="yunCon">'
                                        +'<img class="yunImg" src='+yundain[i].bgImage+' alt="">'
                                        // 0是我的店铺
                                        if(yundain[i].isMyFav==0){
                                            qz+='<span class="icon"><img src="img/tshop.png" alt=""><span>Ta的店</span></span>';
                                        }else{
                                            qz+='<span class="icon"><img src="img/zcshop.png" alt=""><span>筑城的店</span></span>';
                                        }
                                    qz+='</div>';
                            }
                            $(".yd").html(qz);
                        }else{
                            $(".yundianwrap").hide();
                        }

                        // 约吧
                        // queryType": "String   #",-1全部信息，1-云店更多，2-圈子更多，3,社群(暂不查询) 4- 全民炫更多 5- 约吧服务
                        // 51-我能服务,52-约吧我要服务  6- 玩家挣钱61- 抢标赚,62- 转文赚,63- 分享赚8- 头条,9-脸圈
                        var yueba=res.data.service;
                        if(!isNull(yueba)){
                            var qz='';
                            for(var i =0;i<yueba.length;i++){
                                qz +='<div class="yueCon clear">'
                                        +'<div class="left yueImg">'
                                            if(yueba[i].queryType==52){
                                                qz+='<img class="yunImg" src='+yueba[i].serviceWant.userPic+' alt="">'
                                                qz+='<span class="pos"><span>我要</span></span>'
                                            }else{
                                                if(yueba[i].serviceCan.resourceList[0].length!=0){
                                                    qz+='<img class="yunImg" src='+yueba[i].serviceCan.resourceList[0].resourceUrl+' alt="">'
                                                }else{
                                                    qz+='<img class="wanImg" src="img/moren.png" alt="">'
                                                }
                                                qz+='<span class="pos" style="border-left-color:#2699e9;"><span>我能</span></span>'
                                            }
                                        qz+='</div>'
                                        qz+='<div class="left renwu">'
                                            if(yueba[i].queryType==51){
                                                qz+='<p class="ellipsis">'+yueba[i].serviceCan.serviceName+'</p>'
                                                qz+='<p><span class="yang">￥</span><span class="price">'+yueba[i].serviceCan.servicePrice+'</span><span class="unit">元</span></p>'
                                            }else{
                                                qz+='<p class="ellipsis">'+yueba[i].serviceWant.demandName+'</p>'
                                                if(yueba[i].serviceWant.demandPrice!=0||yueba[i].serviceWant.demandPrice!=null){
                                                    qz+='<p><span class="yang">￥</span><span class="price">'+yueba[i].serviceWant.demandPrice+'</span>元</p>'
                                                }
                                            }
                                        qz+='</div>'
                                   qz+='</div>';
                            }
                            $(".yueba").html(qz);
                        }else{
                            $(".yuebawrap").hide();
                        }
                        // 全名炫
                        var quanmingxuan=res.data.xuan_content;
                        if(!isNull(quanmingxuan)){
                            var qz='';
                            for(var i =0;i<quanmingxuan.length;i++){
                                qz +='<div class="xuanCon">'
                                        +'<img class="yunImg" src='+quanmingxuan[i].coverUrl+' alt="">'
                                        +'<img src="img/video.png" alt="">'
                                    +'</div>';
                            }
                            $(".quanmingxun").html(qz);
                        }else{
                            $(".qmxwrap").hide();
                        }
                        // 头条
                        var toutiao=res.data.toutiao_content;
                        if(!isNull(toutiao)){
                            var qz='';
                            for(var i =0;i<toutiao.length;i++){
                                qz+='<div class="yueCon clear">'
                                        +'<div class="left wanImg play">'
                                            +'<img class="wanImg" src='+toutiao[i].scCmsResourcesList[0].resourcesUrl+' alt="">'
                                        +'</div>'
                                        +'<div class="left renwu toutiao">'
                                            +'<p class="ellipsis">'+toutiao[i].articleTitle+'</p>'
                                            +'<p><span class="unit">'+toutiao[i].releaseTime+'</span><span class="unit">'+(!isNull(toutiao[i].visitorNum)?toutiao[i].visitorNum:0)+'浏览</span></p>'
                                        +'</div>'
                                    +'</div>';
                            }
                            $(".toutiao").html(qz);
                        }else{
                            $(".toutiaowrap").hide();
                        }

                        // 玩家赚钱
                        var wanjia=res.data.earnmoney;
                        if(!isNull(wanjia)){
                            var qz='';
                            for(var i =0;i<wanjia.length;i++){
                                qz +='<div class="yueCon clear">'
                                        +'<div class="left wanImg play">'
                                            if(wanjia[i].queryType==61){
                                                        if(wanjia[i].earnmoneyTask.resourceList.length!=0){
                                                            qz+='<img class="wanImg" src='+wanjia[i].earnmoneyTask.resourceList[0].resourceUrl+' alt="">'
                                                        }else{
                                                            qz+='<img class="wanImg" src="img/moren.png" alt="">'
                                                        }
                                                        qz+='<span class="flag">抢标任务</span>'
                                                    qz+='</div>'
                                                    qz+='<div class="left renwu">'
                                                        qz+='<p class="ellipsis">'+wanjia[i].earnmoneyTask.taskTitle+'</p>'
                                                        qz+='<p><span class="zuan">赚</span><span class="yang">￥</span><span class="price">'+wanjia[i].earnmoneyTask.taskPrice+'</span><span class="unit">元/人</span></p>'
                                                qz+='</div>'
                                            }else if(wanjia[i].queryType==62){
                                                        if(!isNull(wanjia[i].earnmoneyReprint.taskPic)){
                                                            qz+='<img class="wanImg" src='+wanjia[i].earnmoneyReprint.taskPic+' alt="">'
                                                        }else{
                                                            qz+='<img class="wanImg" src="../img/moren.png" alt="">'
                                                        }
                                                        qz+='<span class="flag" style="background:#ff5653;color:#fff;">转文任务</span>'
                                                    qz+='</div>'
                                                    qz+='<div class="left renwu">'
                                                        qz+='<p class="ellipsis">'+wanjia[i].earnmoneyReprint.taskTitle+'</p>'
                                                        qz+='<p><span class="zuan" style="background:#ff5653;color:#fff;">赚</span><span class="yang">￥</span><span class="price">'+wanjia[i].earnmoneyReprint.taskPrice+'</span><span class="unit">元/人</span></p>'
                                                qz+='</div>'
                                            }else{
                                                qz+='<img class="wanImg" src='+wanjia[i].earnmoneyShare.couponPic+' alt="">'
                                                        qz+='<span class="flag" style="background:#4baffd;color:#fff;">分享任务</span>'
                                                    qz+='</div>'
                                                    qz+='<div class="left renwu">'
                                                        qz+='<p class="ellipsis">'+wanjia[i].earnmoneyShare.couponName+'</p>'
                                                        qz+='<p><span class="zuan" style="background:#4baffd;color:#fff;">赚</span><span class="yang">￥</span><span class="price">'+wanjia[i].earnmoneyShare.couponPresentPrice+'</span><span class="unit">元/人</span></p>'
                                                qz+='</div>'
                                            }
                                        
                                    qz+='</div>';
                            }
                            $(".wanjia").html(qz);
                        }else{
                            $(".wanjiawrap").hide();
                        }
                    }
                }
                
            })
        }
    }
    $(".tabNav li").click(function(){
        var index=$(this).index();
        $(".tabNav li").removeClass("active");
        $(this).addClass("active");
        $(".content>div").eq(index).show().siblings().hide();
        if(index==0){
            personCenter.getfriendList(personCenter.requestUrl.friendCircleUrl,personCenter.friendCircle,0);
        }else{
            personCenter.getfriendList(personCenter.requestUrl.personCenter,personCenter.understand,1);
        }
    })
    var personCenter = new share();
    personCenter.getNav(personCenter.nav);
    personCenter.getfriendList(personCenter.requestUrl.friendCircleUrl,personCenter.friendCircle,0);
    
    // 点击voteThree的投票也需要执行点击$("#downloadA")的方法执行跳转下载
    $(document).on('click', '.posBom>img,.moreL', function() {  
        $('#downloadA').trigger('click');
    });

    // 复制代码，注释可以不看；
    //分享礼包跳转APP
    //跳转app商品详情页地址
    var articleId = getParams("articleId"),
    yw = getParams("yw") || "",
    cp = getParams("cp") || "",
    sn = getParams("sn") || "",
    isGift = getParams("isGift") || "",
    scCmsReadingDevicetype = "h5";
    // var getPackLink = "/24hours/share24/getPackage.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn;
    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smtPackLink";
    //分享礼包跳转APP
    //跳转app商品详情页地址
    var jumpParams = getParams("jumpParams") || "";
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
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
    //了解他里面所有执行downloadA的点击事件方法
    $(".intro,.yundianwrap,.qmxwrap,.lianquanwrap,.yuebawrap,.wanjiawrap,.quanziwrap,.toutiaowrap").click(function(){
        $("#downloadA").click();
    })
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
    $(".swipebox").swipebox({
		useCSS : true,
		hideBarsDelay : 3000 
	});
    $('.show-big-img').swipebox()
})