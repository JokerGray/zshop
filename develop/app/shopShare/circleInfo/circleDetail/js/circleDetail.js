/**
 * Created by Administrator on 2018/8/31.
 */
(function($){
    var page = 0;
    var rows = 10;
    var circleId = getQueryString("circleId");
    var loginUserId =getQueryString("loginUserId");
    var USER_URL = {
        RESOURLIST : 'circle/getCircleInfoHasMember', //(查询圈子详细信息含成员)
        QUERLIST : 'circle/findCircleRecordListByCircleId',//(圈子动态-根据圈子Id查询所在用户的动态列表)
        GETSHOP : 'shop/getMercartIdShopList', //(获取店铺信息)
        GETACTIVE:'circle/findSendActivityByCircleId' //获得活动列表
    };

    var count = 0;//动态
    var counts = 0; //活动
    var isStop = true; //动态标识
    var isStops = false; //活动标识

    $(window).on("scroll",function(){
       var scrollTop = $(this).scrollTop();
       var scrollHeight = $(document).height();
       var windowHeight =  $(this).height();
        if(scrollTop + windowHeight == scrollHeight){
            var index = $(".list-tab .tab-nav.active").index();
            if(index == 0){
                if(isStop){
                    active(1);
                }

            }else{
                if(isStops){
                    condition(1);
                }

            }
        }

    });

    $(function() {// 初始化内容
        getCirlce();
        active(0);
    });

    //查询圈子详细信息含成员
    function getCirlce(){
        var param = {
            circleId:circleId,
            loginUserId:loginUserId
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var data= res.data;
                $(".bg").css({
                    "background":"url('"+ data.circlePortrait +"') no-repeat",
                    "background-size":"100%"
                });
                $(".circle-name").text(data.circleName);
                $(".add-num .num").text(data.joinTotal);
                $(".add-num .label").text(data.labelName);
                $(".remark").text(data.circleIntroduce);
                $(".top-left img").attr("src",data.circlePortrait);
                if(data.isJoin==0){
                    $(".top-right span").text("加入");
                }else{
                    $(".top-right span").text("未加入");
                }
                if(data.isConcern==0){
                    $(".care span").text("筑城");
                    $(".care div").attr("class","care-icon");
                }else{
                    $(".care span").text("已筑城");
                    $(".care .care-icon").addClass("acve");
                }

                if(data.backUser){
                    getShop();
                }else{
                    $(".shop").css("visibility","hidden");
                }
            } else {
                layer.msg(res.msg);
            }
        })
    }

    //获取店铺信息
    function getShop(){
        var param = {
            "userId": loginUserId,
            "page": page,
            "rows": rows
        }
        reqAjaxAsync(USER_URL.GETSHOP,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var data= res.data;
                if(data.length>0){
                    $(".shop").css("visibility","visible");
                    var str = '';
                    $(".shop-logo").attr("src",data[0].logoUrl);
                    for(var i=0;i<res.data.length;i++){
                        var row = data[i];
                        str += '<div class="shop-items">' +
                        '<div class="shop-left">' +
                        '<img src="'+ row.logoUrl +'">' +
                        '</div>' +
                        '<div class="shop-center">' +
                        '<h4>' + row.shopName + '</h4>' +
                        '<div class="shop-address">' +
                        '<i class="address-icon"></i>' + row.address+
                        '</div>' +
                        '<div class="shop-right">' +
                        '<span>进店</span>' +
                        '</div>'+
                        '</div>'
                    }
                    $(".hid-shop").html(str);
                }else{
                    $(".shop").css("visibility","hidden");
                }
            } else {
                layer.msg(res.msg);
            }
        })
    }

    //查看店铺
    $(".look").on(function(){
        $(".hid-shop").toggle();
    });


    //圈子动态
    function active(type){ //type为1的时候下拉加载 0-正常加载
        layer.load(0, {
            shade: [0.1,'#000'] //0.1透明度的白色背景
        });
        if(type==0){
            var param = {
                "page": page,
                "row": rows,
                "circleId": circleId,
                "userId":loginUserId
            }
        }else{

            count++;
            var param = {
                "page": count,
                "row": rows,
                "circleId": circleId,
                "userId":loginUserId
            }
        }


        reqAjaxAsync(USER_URL.QUERLIST,JSON.stringify(param)).done(function(res) {
            layer.closeAll();
            if (res.code == 1) {
                var data= res.data;
                if(data.length>0){
                    $(".dynamic .have-data").show();
                    $(".dynamic .no-data").hide();
                    var str = "";
                    for(var i=0;i<data.length;i++){
                        var row = data[i];
                        str += '<div class="item" data-id="'+ row.id +'"  data-circleId="'+ row.circleId +'">' +
                                    '<div class="dynamic-top">' +
                                        '<div class="dynamic-tl">' +
                                            '<img src="' + row.userPic + '">' +
                                        '</div>' +
                                        '<div class="dynamic-tc">' +
                                            '<div class="dynamic-name">' + row.userName +'</div>'
                                            if(row.modifyTime && row.modifyTime!=""){
                                                str +=   '<div class="dynamic-time">' + row.modifyTime + '</div>'
                                            }else{
                                                str +=   '<div class="dynamic-time">' + row.createTime + '</div>'
                                            }
                        str +=   '</div>' +
                                    ' <div class="dynamic-tr">' +
                                        '<i class="more-icon"></i>' +
                                    '</div>' +
                            '</div>' +
                            '<div class="dynamic-center">' +
                                '<div class="dynamic-text">' + row.recordTitle + '</div>'
                            if(row.videoList && row.videoList.length>0){
                                str += '<div class="dynamic-video" data-id ="'+ row.videoList[0].id +'">' +
                                            '<video src="'+ row.videoList[0].videoUrl  +'" controls="controls" poster="'+ row.videoList[0].videoCover +'"> ' +
                                '</video>' +
                                        '</div>' +
                                    '</div>'
                            }else if(row.pictureList && row.pictureList.length>0){
                                str += '<div class="dynamic-img">' +
                                            '<div class="item-img">'
                                if(row.pictureList.length>3){
                                    for(var k=0;k<3;k++){
                                        str += '<div class="img-list">' +
                                            '<img src="'+ row.pictureList[k].picUrl +'">' +
                                        '</div>'
                                    }
                                }else{
                                    for(var k=0;k<row.pictureList.length;k++){
                                        str += '<div class="img-list">' +
                                                    '<img src="'+ row.pictureList[k].picUrl +'">' +
                                                '</div>'
                                    }

                                }
                                str+= '</div>'
                                if(row.pictureList.length>2){
                                    str+= '<div class="img-num">共'+ row.pictureList.length +'张</div>'
                                }
                                str+= '</div>' +
                                '</div>'
                            }else{
                                str+= '</div>'
                            }
                        str+=  '<div class="dynamic-bottom">' +
                                    '<div class="dynamic-button openAp">' +
                                        '<i class="share-icon"></i>' +
                                        '<span>分享</span>' +
                                    '</div>' +
                                    '<div class="dynamic-button openAp">' +
                                        '<i class="discuss-icon"></i>' +
                                        '<span>'+ row.praiseNum +'</span>' +
                                    '</div>' +
                                    '<div class="dynamic-button openAp" >' +
                                        '<i class="cars-icon"></i>' +
                                        '<span>'+ row.commentNum +'</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'

                    }
                    if(type==0){
                        $(".dynamic .have-data").html(str);
                    }else{
                        $(".dynamic .have-data").append(str);
                    }



                }else{
                    if(type==0){
                        $(".dynamic .have-data").hide();
                        $(".dynamic .no-data").show();
                    }else{ //绑定
                        layer.msg("到底了哟");
                        isStop = false;
                    }



                }
            } else {
                layer.msg(res.msg);
            }
        })
    }

    $("#shade").on("click",function(){

        $('#model').hide();
        $(this).hide();
    });
    $("#model").on("click",function(){
        $('#shade').hide();
        $(this).hide();
    });

    //圈子活动
    function condition(type){//0-正常加载 1-下拉加载
        layer.load(0, {
            shade: [0.1,'#000'] //0.1透明度的白色背景
        });
        if(type==0){
            var param = {
                "userId":loginUserId,
                "page": page,
                "row": rows,
                "circleId": circleId
            }
        }else{
            counts ++;
            var param = {
                "userId":loginUserId,
                "page": counts,
                "row": rows,
                "circleId": circleId
            }
        }

        reqAjaxAsync(USER_URL.GETACTIVE,JSON.stringify(param)).done(function(res) {
            layer.closeAll();
            if (res.code == 1) {
                var data = res.data;
                if (data.length > 0) {
                    $(".actively .have-data").show();
                    $(".actively .no-data").hide();
                    var str = '';

                    for(var i=0;i<data.length;i++){
                    var row = data[i];
                    str += '<div class="item" data-activid="'+ row.id +'">' +
                                '<div class="actively-left">' +
                                    '<img src="' + row.activityCover + '">'
                            if(row.state == 0){ //0未开始，1进行中，2已结束
                                str +=    '<div class="actively-tip gray">' +
                                '<span>未开始</span>' +
                                '</div>'
                            }else if(row.state == 1){
                                str +=    '<div class="actively-tip">' +
                                '<span>报名中</span>' +
                                '</div>'
                            }else{
                                str +=    '<div class="actively-tip gray">' +
                                '<span>已结束</span>' +
                                '</div>'
                            }

                    str +=    '</div>'+
                              '<div class="actively-right">'  +
                                    '<div class="actively-title">' + row.activityName + '</div>' +
                                    '<div class="active-adress">' + row.activityAddress + '</div>' +
                                    '<div class="actively-date">' +
                                        '<div>' + row.activityBegin + '</div>' +
                                        '<div><span>￥</span>' + row.activityAveprice  + '</div>' +
                                    '</div>'
                                if(row.state == 1){
                                    if(row.isApply==0){ //未报名
                                        '<div class="active-add openAp" >' + '去报名' + '</div>'
                                    }else{
                                        '<div class="active-add al-add openAp" >' + '去报名' + '</div>'
                                    }

                                }

                    str +=     '</div>' +
                            '</div>'
                    }
                    if(type==0){ //正常加载
                        $(".actively .have-data").html(str);
                    }else{ //下拉加载
                        $(".actively .have-data").append(str);
                    }

                } else {
                    if(type==0){
                        $(".actively .have-data").hide();
                        $(".actively .no-data").show();
                    }else{
                       layer.msg("到底了哟");
                        isStops=false;
                    }
                }
            } else {
                layer.msg(res.msg);
            }
        })
    }

    //判断进入app还是应用商品方法
    function openStor(){


        //跳转app商品详情页地址
        var jumpParams = getUrlParams("jumpParams") || "";
        var $ios_app = "smartcity://iOS/gateway?open_type=circle_detail&circleId=" + circleId,
            $android_app = "selfapp://izxcs/openwith_circle_detail?circleId=" + circleId,
            $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782",
            $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
        //页面跳转app or 商店

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
                    if (Date.now() - last < 2000) {
                        window.location.href = $android_url;
                    }
                }, 1000);
            } else {
                //android微信
                $(".model_cont .text1 span").css("background-image","url(img/moreshu@2x.png)");
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
            }
            //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
                //QQ内置浏览器
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
            } else {
                window.location.href = $ios_app;
                setTimeout(function () {
                    window.location.href = $ios_url;
                }, 250);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        } else {
            //判断为pc
            window.location.href = $android_url;
        }

    }


    //点击唤起手机分享
    $(".contain").on("click",".openAp",function(){
        openStor();
    });

    //点击图片事件
    $(".dynamic").on("click",".item-img .img-list",function(){
        var index = $(this).index();
        toBigPic(index,$(this))
    });

    //tab点击切换
    $(".list-tab").on("click",".tab-nav",function(){
        var index = $(this).index();
        $(".list-tab .tab-nav").removeClass("active");
        $(".list-tab .tab-nav").eq(index).addClass("active");
        $(".shop-list .list-detail").hide();
        $(".shop-list .list-detail").eq(index).show();
         count = 0;//动态
         counts = 0; //活动
         isStop = true; //动态标识
         isStops = true; //活动标识
        if(index==1){
           condition(0);
        }else{
            active(0);
        }

    });

    ////跳转到活动详情页
    //$(".actively").on("click",".item",function(){
    //    var activityId = $(this).attr("data-activid");
    //    window.location.href = "../activityInfo/activityInfo.html?activityId=" + activityId + "&loginUserId=" + loginUserId;
    //})
    //
    ////跳转到动态详情页
    //$(".dynamic").on("click",".item .dynamic-top",function(){
    //    var circleId = $(this).parent().attr("data-circleId");
    //    var videoId = $(this).parent().find(".dynamic-video").attr("data-id");
    //    var circleRecordId = $(this).parent().attr("data-id");
    //    window.location.href = "../DynamicImg/dynamicImg.html?circleId=" + circleId + "&circleRecordId=" + circleRecordId + "&loginUserId=" + loginUserId + "&videoId=" +videoId;
    //})




})(jQuery);