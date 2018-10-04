$(document).ready(function(){
    FastClick.attach(document.body);
});

$(function(){
    function orient() {//判断手机横竖屏
        if (navigator.userAgent.match(/android/i)) {//判断为android
            if (window.orientation == 90 || window.orientation == -90) {//竖屏
                $("body").attr("class", "landscape");
                orientation = 'landscape';
                return false;
            }
            else if (window.orientation == 0 || window.orientation == 180) {//横屏
                $("body").attr("class", "portrait");
                orientation = 'portrait';
                return false;
            }
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {//判断为IOS
            if (window.orientation == 0 || window.orientation == 180) {//竖屏
                $("body").attr("class", "landscape");
                orientation = 'landscape';
                return false;
            }
            else if (window.orientation ==90 || window.orientation == -90) {//横屏
                $("body").attr("class", "portrait");
                orientation = 'portrait';
                return false;
            }
        } 
    }
        //用户变化屏幕方向时调用
    $(window).bind( 'orientationchange', function(e){
        orient();
    });
    orient();
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
    var CMD_RECOM='dazzle/findRecommendDazzle';//查询推荐列表
    var CMD_XUAN='dazzle/findDazzleDetail';//查询当前炫
    var USERID=GetQueryString('userid');
    var DAZZLEID=GetQueryString('dazzleid');
    // 跳转领取礼包页面
    var outHtml=toadverHtml();
    // console.log(outHtml);

//异步ajax
function reqAjaxAsync(cmd, data,url) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url:url|| "/zxcity_restful/ws/rest",
        dataType: "json",
        async: true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(2, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
            layer.closeAll('loading');
            defer.resolve(data);
        },
        error: function(err) {
            layer.closeAll('loading');
            layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}


    function queryVideo(){
            var queryXuan={
                dazzleId:Number(DAZZLEID),
                userId:Number(USERID)
            }

        return reqAjaxAsync(CMD_XUAN,JSON.stringify(queryXuan)).done(function(res){
        })
        // return new Promise(function(resolve,reject){
        //     //查询炫视频详情,测试588
        //     var queryXuan={
        //         dazzleId:Number(DAZZLEID),
        //         userId:Number(USERID)
        //     }
        //     var queryData=JSON.stringify(queryXuan);
        //     $.ajax({
        //         type: "POST",
        //         url: "/zxcity_restful/ws/rest",
        //         dataType: "json",
        //         data: {
        //             "cmd":CMD_XUAN,
        //             "data": queryData || "",
        //             "version": version
        //         },
        //         // data: {
        //         //     "cmd":'dazzle/findDazzleDetail',
        //         //     "data": queryData || "1",
        //         //     "version": version//本地获取
        //         // },
        //         beforeSend: function (request) {
                   
        //             request.setRequestHeader("apikey", apikey);
        //         },
        //         success: function (res) {
        //             resolve(res);

        //         },
        //         error: function (err) {
        //             reject(err);
        //         }
        //     });
        // })
    }

    function queryList(){
        var queryRec={
            userId:USERID,
            pagination:{
                page:1,
                rows:8
            }
        }
        return reqAjaxAsync(CMD_RECOM,JSON.stringify(queryRec)).done(function(res){
            // layer.msg('请求成功2')
        })

        // return new Promise(function(resolve,reject){
        //     //查询炫推荐列表
        //     var queryRec={
        //         userId:USERID,
        //         pagination:{
        //             page:1,
        //             rows:8
        //         }
        //     }
        //     var queryRecData=JSON.stringify(queryRec);
        //     $.ajax({
        //         type: "POST",
        //         url: "/zxcity_restful/ws/rest",
        //         dataType: "json",
        //         data: {
        //             "cmd":CMD_RECOM,
        //             "data": queryRecData || "",
        //             "version": version
        //         },
        //         beforeSend: function (request) {
        //             request.setRequestHeader("apikey", apikey);
        //         },
        //         success: function (res) {
        //             resolve(res);
        //         },
        //         error: function (err) {
        //             reject(err);
        //         }
        //     });
        // })
    }

    //收藏按钮
    function clickCollection(){
        return new Promise(function(resolve,reject){
            var collected={
                dazzleId:Number(DAZZLEID),
                userId:Number(USERID)
            }
             var sel=JSON.stringify(collected);
             $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    cmd: cmd,
                    data: JSON.stringify(params),
                    version: sessionStorage.getItem('version') || "1"
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
    var videoObj={
        data:{
            el:$('#theVideo'),//视频
            plays:$("#playb"),//播放按钮
            box:$('.text_bottom'),
            times:0,//总时间
            times1:0,//滑动时间
            ev:$('#range'),//滑块
            evLeft:0,
            percent:0,//百分比
            tmove:0,//滑动距离
            cw:0,
            ch:0,
            collection:$('.collection'),
            fullBtn:$('.fullPage'),
            btnBox:$('.text_right')
        },
        init:function () {
            this.data.el = $('#theVideo');
            this.data.plays = $('#playb');
            this.data.ev = $('#range');
            this.data.fullBtn = $('.fullPage');

            this.methods.getTime();
            this.methods.addListen();
            if (navigator.userAgent.match(/android/i)) {
                $(".text_bottom").hide();
            }
        },
        methods:{
            getTime:function () {
                var el = videoObj.data.el[0];

                setTimeout(function () {
                    var duration = el.duration;
                    if(isNaN(duration)){
                        videoObj.methods.getTime();
                    }
                    else{
                        // console.log(videoObj);
                        videoObj.data.times = el.duration;
                        videoObj.data.cw = el.videoWidth;
                        videoObj.data.ch = el.videoHeight;
                        $('#time2').html(videoObj.methods.getMinutes(videoObj.data.times))
                    }
                }, 10);
            },getMinutes:function(times){
                 //将秒转换为分秒
                 return Math.floor(times/60)+":"+(times%60/100).toFixed(2).slice(-2)
            },addListen:function () {
                var obj =videoObj.data;
                var methods = videoObj.methods;
                var showAll = videoObj.methods.showAll;
                var hideAll = videoObj.methods.hideAll;
                var el = obj.el;
                var ev = obj.ev;
                var el0 = el[0];
                var plays = obj.plays;
                var percent = obj.percent;
                // var times = obj.times;
                var times1 = obj.times1;
                var evLeft = 0;
                var tmove = obj.tmove;


                var fullBtn = obj.fullBtn;
                var btnBox = obj.btnBox;
                fullBtn.on('tap',function () {
                   var elBox =   $('.vedio_box_vedio')
                   layer.msg('请将手机横向观看视频')
                })
                plays.on('tap',function(){
                    el0.play()
                    $(this).hide().attr('data-type','on');
                    hideAll()
                    // console.log(el.duration)
                })
                el.on('tap',function () {
                    if(plays.attr('data-type') == 'off'){
                        el0.play()
                        plays.hide().attr('data-type','on');
                        hideAll()
                    }else if(plays.attr('data-type') == 'on'){
                        el0.pause()
                        plays.show().attr('data-type','off');
                        showAll()
                    }else if(plays.attr('data-type') == 'ended'){
                        times1 = 0;
                        el0.currentTime = 0;
                        el0.play();
                        plays.hide().attr('data-type','on');
                        hideAll()
                    }
                })
                btnBox.on('tap',function () {
                    // console.log($(this)[0].style.opacity)
                    if($(this)[0].style.opacity == 1 && $('#shop_list')[0].style.bottom != '0px'){
                        getCoupon();
                    }

                })
                function setDataTime(){
                    videoObj.data.times = el0.duration;
                    $('#time2').html(videoObj.methods.getMinutes(videoObj.data.times))
                }
                el[0].ontimeupdate=function (event) {
                    if (navigator.userAgent.match(/android/i)) {
                        setDataTime()
                        $(".text_bottom").show()
                     }
                    times1 = this.currentTime
                    $('#time1').html(methods.getMinutes(times1));
                    percent = (times1/obj.times)*100
                    // evLeft=$('.text_bottom').width()*percent
                    ev.css({
                        left:percent+'%'
                    });
                    $('.range-bg-face').css({
                        width:percent+'%'
                    })


                }
                el[0].addEventListener("ended",function(){
                    showAll()
                    plays.show().attr('data-type','ended');
                })
                el[0].addEventListener("play",function(){
                    videoObj.data.times = el0.duration;
                    $('#time2').html(videoObj.methods.getMinutes(videoObj.data.times))
                })
                // obj.collection.on('tap',function () {
                //     if($(this).hasClass('collection-hover')){
                //         delCollection()
                //     }else{
                //         insertCollection()
                //     }
                // })
                ev.on('touchstart',function (e) {
                    el0.pause();
                    plays.show().attr('data-type','off');
                    console.log( e.originalEvent.touches[0].pageX)
                }).on('touchmove',function (e) {
                    var tStart = $('.text_bottom')[0].offsetLeft;
                    var waiBox = $('.text_bottom').width();
                    tmove = e.originalEvent.touches[0].pageX;
                    console.log(tStart)
                    console.log(tmove-tStart)
                    evLeft = tmove-tStart;
                    if(evLeft< 0 || evLeft>waiBox){
                        return false;
                    }

                    percent = evLeft/waiBox;//获取时间百分比
                    times1=percent*obj.times;
                    $('#time1').html(methods.getMinutes(times1))
                    percent = (times1/obj.times)*100
                    ev.css({
                        left:percent+'%'
                    });
                    $('.range-bg-face').css({
                        width:percent+'%'
                    })

                }).on('touchend',function (e) {
                    el0.play();
                    plays.hide().attr('data-type','on');
                    el0.currentTime = times1;
                    hideAll()
                    $(this).off('touchstart','touchmove');
                })
            },
            hideAll:function () {
                // $('#shop_list').animate({
                //     bottom:'-200%'
                // },300);
                // $('.video_bg').hide();
                // setTimeout(function () {
                //     if(videoObj.data.plays.attr('data-type') == 'off' || videoObj.data.plays.attr('data-type') == 'ended'){
                //         return false
                //     }
                //     $('.text_bottom,.text_left,.text_right').animate({
                //         opacity:0
                //     },300)
                // },3000)
            },
            showAll:function () {
                $('#shop_list').animate({
                    bottom:'-200%'
                },300);
                $('.text_bottom,.text_left,.text_right').animate({
                    opacity:1
                },300)
            }
        }

    }

    // 查询当前video
    var qv = queryVideo()
   
    qv.then(function(res){
        if(res.code == 1 && res.data) {
            var datas = res.data;
            var h = template('vdhtml', res);
            document.getElementById('xuanVd').innerHTML = h;
            // 跳转
            $('.toApp').on('click',function(){
                getCoupon();
            });
            $('.toAds').on('click',function(){
                toAds($(this));
            })

            $('#openShopList').on('click',function(){
                //判断为android
                // if (navigator.userAgent.match(/android/i)) {
                //     //android非微信
                //     if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {

                //     } else {
                //         //android微信
                //         $("#model").show();
                //         $('#listShade').show();
                //         return
                //     }
                // //判断为IOS
                // } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
                //     //微信
                //     if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                //         $("#model").show();
                //         $('#listShade').show();
                //         return
                //     //QQ内置浏览器
                //     } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                //         $("#model").show();
                //         $('#listShade').show();
                //         return
                //     } 
                // } 
                $('#shopBox').show();
                $('#listShade').show();
                $("#shopList").scrollTop(0)
            })

            console.log(res);
            if(datas.width > datas.height){
                $('.fullPage').show();
            }
            
            playvideo();
            videoObj.init();
            // 分享
            var title = res.data ? res.data.introduce : "快来加入全民炫视频吧~！";
            var content = res.data ? (res.data.scSysUser.username+"的全民炫") : "全民炫视频";
            var imgUrl = res.data.coverUrl;
            var dazzleId = res.data.dazzleId;
            var userId = res.data.userId;
            var hVideo = res.data.height, wVideo = res.data.width;
            $('body .page .player-contain .vd-wrap video').attr({'data-h':hVideo,'data-w':wVideo}).css('object-fit', hVideo / wVideo >= 1 ? 'cover': 'contain');
            share(title,content,imgUrl);

            // 新增名片处理
            var dazzleType = res.data.dazzleType;
            var cardType = res.data.cardType;
            //判断是否电子名片
            if(dazzleType == 1) showCard(cardType, res.data);
            $('.icon-card').toggle(dazzleType == 1);
            sessionStorage.setItem('isShowShop',res.data.isShowShop);
            if(res.data.isShowShop==1){//按钮显示
                $('#openShopList').show().addClass('animate');
            }
        } else {
            $('#xuanVd').html('<p class="delAll">'+ res.msg +'</p>')
        }
    });
    // qv.catch(function(err){
    //     $('#xuanVd').html('<a class="delAll" href="">连接失败,请检查网络或重试!</a>')
    // })

    //通过window.orientation来判断设备横竖屏
    function checkOrient() {

        if (window.orientation == 0 || window.orientation == 180){
            //ipad、iphone横屏；Andriod竖屏
            return 'portrait';

        }
        else if (window.orientation == 90 || window.orientation == -90){
            //ipad、iphone竖屏；Andriod横屏
            return 'landscape';
        }
    }


    $(window).bind( 'orientationchange', function(e){
        var orient =  checkOrient();
        var h =$('body .page .player-contain .vd-wrap video').attr('data-h'),
        w = $('body .page .player-contain .vd-wrap video').attr('data-w');

        if('portrait' == orient){
            $('body .page .player-contain .vd-wrap video').css('object-fit','contain');
        }else{
            $('body .page .player-contain .vd-wrap video').css('object-fit','cover');
        }

    });

    $(window).resize(function(){
        if(sessionStorage.getItem('isShowShop')==0){
            $('#openShopList').hide();
        }
    })

    // 添加事件监听
    addEventListener('load', function(){
        window.onorientationchange = checkOrient();
        console.log(window.onorientationchange);

    });

    // 查询推荐列表
    var ql = queryList();
    ql.then(function(res){
        if(res.code == 1 && res.data) {
            var html2 = template('recList', res);
            document.getElementById('vdList').innerHTML = html2;
            toHtml($('.toHtml'));
        } else {
            $('#vdList').html('<p class="no-recommend">'+ res.msg +'</p>')
        }
    });
    // ql.catch(function(err){
    //     $('#vdList').html('<a class="no-recommend" href="">连接失败,请检查网络或重试!</a>')
    // })

   
    // 点击播放
    function playvideo(){
        // var vdtag = document.getElementById('theVideo'),
        //     playbtn = document.getElementById('playb');
        // playbtn.onclick=function(event){
        //     vdtag.play();
        // }
        // vdtag.addEventListener('click',function(){
        //     this.paused ? this.play(): this.pause();
        // })
        // vdtag.addEventListener('pause',function(){
        //     playbtn.style.display="block";
        //     $('.vd-copor, .vd-des').show();
        //     // if(this.offsetHeight < window.innerHeight) {
        //     //     $('.vd-copor, .vd-des').hide();
        //     // }
        // })
        // vdtag.addEventListener('play',function(){
        //     playbtn.style.display="none";
        //     $('.vd-copor, .vd-des').show();
        // });
        // vdtag.addEventListener('ended',function(){
        //     playbtn.style.display="block";
        //     $('.vd-copor, .vd-des').show();
        // })
    }
    

    function getShopList(params){
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            data: {
                "cmd":'shop/getMercartIdShopList',
                "data": JSON.stringify(params),
                "version": version
            },
            beforeSend: function (request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function (res) {
                if(res.code==1){
                    let html=$('#shopList').html(),
                        data=res.data;
                    sessionStorage.setItem('total',res.data.total);
                    for(let i=0;i<data.length;i++){
                        html+="<li><a href='http://share.zxtest.izxcs.com/shopShare/shopShare.html?shopName="+data[i].shopName
                            +"&address="+data[i].address+"&bgImg="+res.data[i].bgImage+"&longitude="+res.data[i].longitude
                            +"&latitude="+res.data[i].latitude+"&logo="+res.data[i].logoUrl+"&shopId="+res.data[i].id+"' class='goShop'><img src='"+data[i].logoUrl+"' class='logo'>"
                            +"<div class='infoBox'><div class='shopName'>"+data[i].shopName+"</div>"
                            +"<div class='address'><img class='addressIcon' src='img/qmx_location.png'>"+(data[i].address||'-')+"</div></div>"
                            +"<div class='enterShop'>进店</div><a></li>"
                    }
                    $('#shopList').html(html);
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }

    var count=0,
    shopParams={
        page: count,
        userId: USERID,
        rows: 10
    }
    getShopList(shopParams);

    $('#shopList').scroll(function(){
        let scrollTop=$('#shopList').scrollTop(),
            h=$('#shopList').height(),
            h1=$('#shopList li').height(),
            size=$('#shopList li').size();
        if(scrollTop>=(h1*size-h)){
            count+=1;
            if(count> Math.ceil(sessionStorage.getItem('total') / 10-1)){
                let params={
                    page: count,
                    userId: USERID,
                    rows: 10
                }
                getShopList(params);
            }else{
                // layer.msg('已经到底了');
                return
            }
        }
    })

    $('#close').click(function(){
        hideShopList()
    })
    function hideShopList(){
        $('#shopBox').hide();
        $('#listShade').hide();
    }

    $('#listShade').click(function(){
        $('#model').hide(); 
        hideShopList()
    })
    $('.title').on('touchstart',function(e){
        hideShopList()
        stopPropagation(e)
       
    })
    $("#shopList").scroll(function(e){
        stopPropagation(e)//阻止冒泡
    })
    $('#shopBox').on('touchmove',function(e){
        stopPropagation(e)
    })
    $("#listShade").on('touchmove',function(e){
        stopPropagation(e)
        $(this).hide();
        hideShopList()
        
    })
    $('#allWrapper').scroll(function(){
        $("#shopBox").hide();
        // layer.msg('sdfds')
        var h2=$('#vdList').height(),
            dis=$(this).scrollTop();
        if(dis>h2){
            $('#openApp').fadeIn();
        }else{
            $('#openApp').fadeOut();
        }
    })

});

// 处理电子名片 0,个人,1公司
function showCard(type, obj){
    $('.vd-des').empty();
    $('.vd-des').append('<p class="card">电子名片</p>');
    var arr;
    if(type == 0){
        arr = [['name','姓名'], ['sex','性别'], ['education', '学历'], ['careerWebsite', '职业'], ['phone', '电话']];
    } else {
        arr = [['name','公司名称'], ['employeeName','姓名'], ['companyPosition', '职位'], ['careerWebsite', '公司网站'], ['phone', '联系方式']];
    }
    $(arr).each(function(i, v){
        if(null == obj[v[0]] || '' == obj[v[0]]) return;
        var $p = $('<p class="text"></p>').text(v[1] + ':'+ obj[v[0]]);
        // 额外处理公司网站
        if(type == 1 && v[0] == 'careerWebsite') {
            $p.empty();
            var webUrl = obj[v[0]].search('http') > -1 ? obj[v[0]] : 'http://'+obj[v[0]];
            $a = $('<a class="website"></a>').attr('href', webUrl);
            $p.text(v[1]+':').append($a);
        }
        $('.vd-des').append($p);
    });

}

// 通用获取数据
function reqAjax(cmd, params){
    var def = new $.Deferred();
    $.ajax({
        type: 'post',
        url: '/zxcity_restful/ws/rest',
        dataType: 'json',
        headers: {
            apikey: sessionStorage.getItem('apikey') || "test"
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(params),
            version: sessionStorage.getItem('version') || "1"
        },
        success: function(res){
            return def.resolve(res)

        },
        error: function(err){
            return def.reject(err)
        }
    })
    return def;
}
$('.model_cont').click(function (e) { 
    e.preventDefault();
    stopPropagation(e)
});
$('#model').click(function (e) { 
    e.preventDefault();
    $(this).hide();
    $("#listShade").hide();
});
// 阻止冒泡
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}

