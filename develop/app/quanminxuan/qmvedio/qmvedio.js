var userId = GetQueryString('userId');
var serviceVideoId = GetQueryString('serviceVideoId');
// alert
var USER_SERVER={
    SELECTVIDEO:'newservice/selectServiceVideo?temp='+ Math.random(),//获取视频列表
    INSERTCONLL:'newservice/insertVideoEnshrine?temp='+ Math.random(),//收藏
    DELCONLL:'newservice/delVideoEnshrine?temp='+ Math.random(),//取消收藏
    GETSHOPLIST:'newservice/findVideoShop?temp='+ Math.random(),//获取店铺
    GETSHOPLISTNEW:'shop/getMercartIdShopList?temp='+ Math.random(),//获取店铺新接口
}
$(function(){
    var videoShopId = '';
    var isShowShop = 0;
    var dataOld= {};
    var videoObj={
        data:{
            el:$('#video'),//视频
            plays:$("#play"),//播放按钮
            box:$('.text_bottom'),
            times:0,//总时间
            times1:0,//滑动时间
            ev:$('#range'),//滑块
            evLeft:$('#range').position().left,
            percent:0,//百分比
            tmove:0,//滑动距离
            cw:0,
            ch:0,
            collection:$('.collection'),
            fullBtn:$('.fullPage'),
            btnBox:$('.text_right'),
        },
        init:function () {
            
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
                    // if(elBox.attr('data-type') == 'min'){
                    //     elBox.css({
                    //         'transform':'rotate(90deg)',
                    //         // width:'100%',
                    //         // height:'100%',
                    //         'object-fit':'none',
                    //         '-webkit-object-fit':'none',
                    //     }).attr('data-type','max')
                    //     hideAll();
                    // }else{
                    //     elBox.removeAttr('style').attr('data-type','min');
                    //     showAll()
                    // }
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
                    setDataTime()
                })

                function setDataTime(){
                    videoObj.data.times = el0.duration;
                    $('#time2').html(videoObj.methods.getMinutes(videoObj.data.times))
                }
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
                    console.log( e.targetTouches[0].pageX)
                }).on('touchmove',function (e) {
                    var tStart = $('.text_bottom')[0].offsetLeft;
                    var waiBox = $('.text_bottom').width();
                    tmove = e.targetTouches[0].pageX;
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
                $('#shop_list').animate({
                    bottom:'-200%'
                },300);
                $('.video_bg').hide();
                setTimeout(function () {
                    if(videoObj.data.plays.attr('data-type') == 'off' || videoObj.data.plays.attr('data-type') == 'ended'){
                        return false
                    }
                    $('.text_bottom,.text_left,.text_right').animate({
                        opacity:0
                    },300)
                },3000)
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
    
    //通过window.orientation来判断设备横竖屏
    function checkOrient(e) {
        $('#video').attr('data-w',videoObj.data.cw)
        $('#video').attr('data-h',videoObj.data.ch)
        var ori = e.path[0].orientation;
        console.log(window)
        if (ori == 0 || ori == 180){
            //ipad、iphone横屏；Andriod竖屏
            console.log('竖屏')
            return 'portrait';
        }
        else if (ori == 90 || ori == -90){
            //ipad、iphone竖屏；Andriod横屏
            console.log('横屏')
            return 'landscape';
        }
    }
    //取消收藏
    function delCollection() {
        var params ={
            userId:userId,
            serviceVideoIds:[$('#video').attr('data-id')||3]
        }
        reqAjaxAsync(USER_SERVER.DELCONLL,JSON.stringify(params),function (res) {
            if(res.code ===1){
                $('#collection').removeClass('collection-hover').next().html('收藏')
            }
        })
    }
    function insertCollection() {

        var params ={
            userId:userId,
            serviceVideoId:$('#video').attr('data-id') || 5,
            //
        }
        reqAjaxAsync(USER_SERVER.INSERTCONLL,JSON.stringify(params),function (res) {
            if(res.code ===1){
                $('#collection').addClass('collection-hover').next().html('已收藏')
            }
        })
    }
    videoObj.init();
    getVideo()
    // 阻止冒泡
    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
    function getVideo(){
        var params = {
            userId:userId,
            serviceVideoId:serviceVideoId,
        }
        reqAjaxAsync(USER_SERVER.SELECTVIDEO,JSON.stringify(params),function (res) {
            if(res.code == 1){
                $('.vidio_null').hide().prev().show();
                $(".house").find('img').addClass('animate')
                var datas = dataOld =res.data;
                // console.log(datas)
                if(datas.isGohome == 1){
                    $('#isGohome').show()
                }else{
                    $('#isGohome').hide()
                }
                if(datas.isGoshop == 1){
                    $('#isGoshop').show()
                }else{
                    $('#isGoshop').show()
                }
                $('#video').attr('src',datas.videoUrl).attr('data-id',datas.id)
                videoShopId = datas.videoShopid || '';
                isShowShop = datas.isShowShop || 0;
               
                console.log()
                $('#username').html(datas.scSysUser.username)
                $('#videoIntroduce').html(datas.videoIntroduce)
                $("#isGoshop i img").attr('src',datas.scSysUser.userpic+"?x-oss-process=image/circle,r_100/format,png");
                // console.log(datas.coverUrl);
            
                // console.log(datas.coverUrl.width);
                
                
                $('#video').attr('poster',datas.coverUrl)
                // .css({
                //     position:'absolute',
                //     width:'100%',
                //     // height:h+'px',
                //     background:'url('+datas.coverUrl+')',
                //     top:'50%',
                //     // marginTop:'-'+h/2+'px',
                //     zIndex:100,
                // })
                if(datas.videoWidth > datas.videoHeight){
                    $('.fullPage').show();
                }else{
                    $('#video').css({
                        objectFit:'cover'
                    })
                }
                if(datas.collection){
                    $('#collection').addClass('collection-hover').next().html('已收藏')
                }else{
                    $('#collection').removeClass('collection-hover').next().html('收藏')
                }
               
            }else{
                // alert(res.msg)
                $('.vidio_null').show().prev().hide();
            }
            var btnBox = $('.text_right');
            btnBox.show();
            if(!isShowShop){
                btnBox.find('ul').css({marginTop:'20px'}).find('li:first-child').hide();
            }
            btnBox.on('click',function (e) {
                stopPropagation(e)
                if($(this)[0].style.opacity == 1 && $('#shop_list')[0].style.bottom != '0px'){
                    getCoupon();
                }
            })
        })
    }

    function getCoupon(){
        var outLink='//erweima.izxcs.com/erweima.php';
        // var jumpParams=GetQueryString("jumpParams")||"";
        var jumpParams='';
        // app跳转地址
        var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
        var $android_app ="smartcity://service/firstpage";
        // 判断为android
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
                        window.location.href = outLink;
                    }
                }, 3000);
            } else {
                //android微信
                // $(".model").show();
                if(isShowShop){
                    getShopList()
                }else{
                    $(".model").show();
                    // layer.msg('用户未开启到店服务')
                }

            }
            //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                // $(".model").show();
                //QQ内置浏览器
                if(isShowShop){
                    getShopList()
                }else{
                    $(".model").show();
                    // layer.msg('用户未开启到店服务')
                }
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                $(".model").show();
            } else {
                window.location.href = $ios_app;
                setTimeout(function () {
                    window.location.href =outLink;
                },3000);
            }
        } else {
            //判断为pc
            window.location.href =outLink;
        }


        // if(isShowShop){
        //     getShopList()
        // }else{
        //     layer.msg('用户未开启到店服务')
        // }

    }
    function getShopList() {
        var params = {
            "page": 0,
            "userId": userId,
            "rows": 20
        }
        return reqAjaxAsync(USER_SERVER.GETSHOPLISTNEW,JSON.stringify(params),function (res) {
            if(res.code == 1 && res.data.length>0){
                console.log(res.data)
                var datas = res.data;
                var str = ``
                $.each(datas,function (i, item) {
                    str+=` <div class="swiper-slide">
                            <div class="shop_list_box" data-id="${item.id}"
 data-url="http://share.zxtest.izxcs.com/shopShare/shopShare.html?
shopId=${item.id}&shopName=${encodeURI(item.shopName)}&address=${encodeURI(item.address)}&bgImg=${item.bgImage}&longitude=${item.longitude}&latitude=${item.latitude}&logo=${item.logoUrl}">
                                <div class="shop_list_mb"></div>
                                <img class="img_null" src="img/bgnull.png" style="${item.bgImage?'display: none;':''}"  alt="">
                                <img class="img_yes" src="${item.bgImage}" style="${item.bgImage?'':'display: none;'}" alt="">
                                <h4 class="h4">${item.shopName}</h4>
                                <i class="go" data-type="${item.shopId}"></i>
                            </div>
                        </div>`
                })
                var el = $('.swiper-wrapper')
                $('#shop_list').show().animate({
                    bottom:0
                },300);
                el.html(str);

            }else{
                layer.msg('暂无店铺信息')
            }

        })
    }

})
/**
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
// ajax获取参数
function reqAjaxAsync(cmd, data,callback) {
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function (request) {
            request.setRequestHeader("apikey", apikey);
        },
        success: function (res) {
            // console.log(res);
            callback(res);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

$('body').on('click','.shop_list_box',function () {
    var url = $(this).attr('data-url')
    var ids = $(this).attr('data-id')
    if(ids && ids > 0){
        window.location.href = url
        // `http://share.zxtest.izxcs.com/shopShare/shopShare.html?shopId=${shopId}&shopName=${shopName}&address=${address}&bgImg=${bgImg}&longitude=${longitude}&latitude=${latitude}&logo=${logo}`
        // 'code.html?shopId='+ids+'&shopName='+name+'&imgUrl='+img

        // http://share.zxtest.izxcs.com/shopShare/shopShare.html?shopName="+data[i].shopName
        //                     +"&address="+data[i].address+"&bgImg="+res.data[i].bgImage+"&longitude="+res.data[i].longitude
        //                     +"&latitude="+res.data[i].latitude+"&logo="+res.data[i].logoUrl+"&shopId="+res.data[i].id+"

    }else{
        layer.msg('此店尚未入驻，入驻后方可进入小程序');
    }

})
var mySwiper = new Swiper('.swiper-container', {
    slidesPerView : 'auto',
    observer:true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents:true//修改swiper的父元素时，自动初始化swiper

})
$(".model").on("click",function(){
    $(this).hide();
});
$(".model_cont").on("click",function(event){
    event.stopPropagation();
});