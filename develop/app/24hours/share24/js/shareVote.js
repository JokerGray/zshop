(function($) {	
    var articleId = getUrlParams("articleId"),
        yw = getUrlParams("yw") || "",
        cp = getUrlParams("cp") || "",
        sn = getUrlParams("sn") || "",
        isGift = getUrlParams("isGift") || "",
        scCmsReadingDevicetype = "h5";
    // var getPackLink = "getPackage.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn;
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
    // 根据后端返回字段判断哪部分显示
    //文字  未投票     scCmsVoteType：1  scCmsIsOverdue：非1    voteThree  
    // 文字  已完成     scCmsVoteType：1  scCmsIsOverdue：1   voteRanking
    // 图文 未投票     scCmsVoteType：0  scCmsIsOverdue：非1   voteFirst 
    // 图文 已完成。  scCmsVoteType：0 scCmsIsOverdue：1     voteSecond
    function articleInit(macId) {
	    var param = "{'articleId': " + articleId + ", 'scCmsReadingDevicetype':'" + scCmsReadingDevicetype + "', 'scCmsMacId': '"+ macId +"'}";
	    reqAjaxAsync('cms_new/queryAppVoteDetail', param).done(function(resData) {
            if(!isNull(resData)){
                // 动态获取轮播的图片
                if(resData.data.scCmsVoteOption==0){
                    $(".nameDes").html("【实名】");
                }else{
                    $(".nameDes").html("【匿名】");
                }
                $(".nameTitle").html(resData.data.articleTitle)
                var blunce =resData.data.scCmsResourcesList;
                var blunceList="";
                // 如果只有一张图，轮播的下面的点点，就不显示；
                if(blunce.length==1){
                    $(".swiper-pagination").hide();
                }
                for(var i=0;i<blunce.length;i++){
                    blunceList= '<div class="swiper-slide" style="background:url('+blunce[i].resourcesUrl+') center center no-repeat">'+
                    '</div>';
                }
                $(".swiper-wrapper").html(blunceList);
                // resData.data["scCmsVoteType"]=1;
                // resData.data["scCmsIsOverdue"]=0;
                // 头部部分内容自段读取
                $(".nameTitle").html();
                $(".nameDes").html();
                $(".recreation").html(resData.data.scSysUser.username);
                $(".userpic").attr("src",resData.data.scSysUser.userpic)
                $(".numberOfPlayers").html(resData.data.numberOfPlayers);
                $(".voteNumber").html(resData.data.voteNumber);
                $(".articleBrowser").html(resData.data.articleBrowser);
                $(".releaseTime").html(resData.data.releaseTime);
                $(".scCmsVoteStartTime").html(resData.data.scCmsVoteStartTime);
                $(".scCmsVoteEndTime").html(resData.data.scCmsVoteEndTime);
                $(".articleContent").html(resData.data.articleContent);
                // 活动描述文字<13就隐藏三角，>10就出现三角
                var pDes=$(".articleContent").html();
                getByteLen(pDes)>13?$(".jtx").show(): $(".jtx").hide();
                // 根据返回字段判断投票规则
                if(resData.data.scCmsVoteMethod==1){
                    $(".scCmsVoteMethod").html("一个用户每天能投一票");
                }else  if(resData.data.scCmsVoteMethod==0){
                    $(".scCmsVoteMethod").html("一个用户只能投一票");
                }
                // 根据返回字段，判断底部不同内容的出现影藏
                if(resData.data["scCmsVoteType"]==1 && resData.data["scCmsIsOverdue"]!=1){
                    $(".content .voteThree").show().siblings().hide();
                    $(".search").hide();
                    var voteThree="";
                    var dataList=resData.data.scCmsVoteList;
                    for(var i=0;i<dataList.length;i++){
                        voteThree += '<li>'+' <input type="radio" id="female'+i+'" name="sex" />'+ 
                        '<label for="female'+i+'">'+dataList[i]["scCmsVoteTitle"]+'</label>'+ ' </li>';
                    }
                    voteThree +='<li>'+ '<p class="voteBtn">投票</p>'+'</li>';
                    $(".content .voteThree ul").html(voteThree);
                }else  if(resData.data["scCmsVoteType"]==1 && resData.data["scCmsIsOverdue"]==1){
                    $(".content .voteRanking").show().siblings().hide();
                    $(".search").hide();
                    var voteRanking="";
                    var dataList=resData.data.scCmsVoteList;
                    for(var i=0;i<dataList.length;i++){
                        // 排名dataList[i].scCmsVoteALLNumber
                        voteRanking += '<li>'+
                                    '<span class="ranking">'+(i+1)+'</span>'+
                                    '<p class="endDes">'+dataList[i].scCmsVoteTitle+'</p>'+
                                    '<div>'+
                                        '<p class="number left"><img src="img/shareVote/huo.png" alt="" /><span>'+dataList[i].scCmsVoteALLNumber+'票</span></p>'+
                                        '<p class="probability right"><span>'+(dataList[i].scCmsVoteALLNumber/resData.data.voteNumber)*100+'%</span></p>'+
                                    '</div>'+
                                '</li>';
                    }  
                    $(".voteRanking ul").html(voteRanking);
                    colorRanking($(".voteRanking ul li"));
                }else if(resData.data["scCmsVoteType"]==0 && resData.data["scCmsIsOverdue"]!=1){
                    $(".content .voteFirst").show().siblings().hide();
                    $(".search").hide();
                    var  voteFirst="";
                    var dataList=resData.data.scCmsVoteList;
                    for(var i=0;i<dataList.length;i++){
                        voteFirst += '<li>'+
                                '<p class="listImg"><img src="'+dataList[i].scCmsVoteUrl+'"/></p>'+
                                '<p class="voteBh">'+
                                    '<span>'+dataList[i].scCmsVoteNumber+'</span>'+
                                    '<span>'+dataList[i].scCmsVoteTitle+'</span>'+
                                '</p>'+
                                '<p class="number">'+
                                    ' <span><img src="img/shareVote/huo.png" alt="" />'+dataList[i].scCmsVotePeepleNumber+'票</span>'+
                                '<span>投票</span>'+
                                '</p>'+
                            '</li>';
                    }
                    $(".voteFirst ul").html(voteFirst);

                }else if(resData.data["scCmsVoteType"]==0 && resData.data["scCmsIsOverdue"]==1){
                    $(".content .voteSecond").show().siblings().hide();
                    $(".search").show();
                    var  voteSecond="";
                    var dataList=resData.data.scCmsVoteList;
                    for(var i=0;i<dataList.length;i++){
                        voteSecond += '<li>'+
                            ' <div class="left imgDes">'+
                                '<span class="ranking">'+(i+1)+'</span><img src="'+dataList[i].scCmsVoteUrl+'"/>'+
                                '<span class="bh">'+dataList[i].scCmsVoteNumber+'</span><span class="name">'+dataList[i].scCmsVoteTitle+'</span>'+
                            '</div>'+
                            '<div class="right number">'+
                                '<img src="img/shareVote/huo.png" alt="" /><span>'+dataList[i].scCmsVoteALLNumber+'票</span>'+
                            '</div>'+
                        '</li>';
                    }
                    $(".voteSecond ul").html(voteSecond);
                    colorRanking($(".voteSecond ul li"));
                }
            }
	    });
    };

    // 文字  已完成  voteRanking和图文 已完成 voteSecond 前三名添加不同的颜色
    function colorRanking(element){
        element.eq(0).find(".ranking").addClass("rankingfirst");
        element.eq(1).find(".ranking").addClass("rankingsecond");
        element.eq(2).find(".ranking ").addClass("rankingthird");
    }
    
    // 点击投票描述的小三角 // 点击投票描述的小三角
    $(".voteTime li .jtx").click(function(){
        if($(this).hasClass("rotate")){ 
            $(this).removeClass("rotate");
            $(this).addClass("rotate1");
            $(".text-overflowp").removeClass("disapper");
        }else{
            $(this).removeClass("rotate1");
            $(this).addClass("rotate");
            $(".text-overflowp").addClass("disapper");
        }
    })
    // 判断字符的公共函数
    function getByteLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    }

    //分享礼包跳转APP
    //跳转app商品详情页地址
    var jumpParams = getUrlParams("jumpParams") || "";

    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //跳转app地址
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
    
    // 点击voteThree的投票也需要执行点击$("#downloadA")的方法执行跳转下载
    $(document).on('click', '.voteBtn', function() {   	
        $('#downloadA').trigger('click');
    });
    
    $(document).on('click', '.voteList .number span:last-child', function() {   	
        $('#downloadA').trigger('click');
    });
    
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