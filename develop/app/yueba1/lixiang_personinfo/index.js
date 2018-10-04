$(document).ready(function() {
    bgMaxHeight();
    // checkPlatform();
    getData();
    //分享礼包跳转APP
    //跳转app商品详情页地址
    var sn = getQueryString('sn') || "";
    var jumpParams = getQueryString("jumpParams") || "";
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
    var getPackLink = '/24hours/share24/getPackage.html?sn='+ sn +'&yw=service&cp=1';
    //页面跳转app or商店
    $(".download").on('click', function() {
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
                        window.location.href = getPackLink;
                    }
                }, 3000);
            } else {
                //android微信
                $('#weixin_pageto').show();
                $('#commodityShare').hide();
            }
        //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                $('#weixin_pageto').show();
                $('#commodityShare').hide();
            //QQ内置浏览器
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                $('#weixin_pageto').show();
                $('#commodityShare').hide();
            } else {
                window.location.href = $ios_app;
                setTimeout(function () {
                    window.location.href = getPackLink;
                }, 3000);
            }
        } else {
            //判断为pc
            window.location.href = getPackLink;
        }
    });
});

// 分享页面
function share(title, introduce, imgUrl){
    $.ajax({
        type: "post",
        url: "/zxcity_restful/ws/rest",
        dataType: 'json',
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: 'game/getSign',
            data: JSON.stringify({
                url: location.href
            }),
            version: 1
        },
        success: function(res) {
            wx.config({
                debug: false,
                appId: 'wxe50dd59beab1e644',
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo', 'onMenuShareQZone', 'onMenuShareQZone']
            });
            var options = {
                title: title,
                desc: introduce,
                link: location.href,
                imgUrl: imgUrl
            }
            wx.ready(function(){
                wx.onMenuShareTimeline({
                    title: introduce,
                    link: location.href,
                    imgUrl: imgUrl
                });
                wx.onMenuShareAppMessage($.extend({
                    type: '',
                    dataUrl: ''
                }, options));
                wx.onMenuShareQQ(options);
                wx.onMenuShareWeibo(options);
                wx.onMenuShareQZone(options);
                wx.onMenuShareQZone(options);
            })
        }
    });
}

// 获取url参数，没有就''
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    return r !== null ? decodeURI(r[2]) : ''
}
// 设置背景图片的高度最高不能超过 content
function bgMaxHeight() {
    $('.resourceContent').css('max-height', window.innerWidth*0.625);
}

// 获取数据
function getData() {
    var params = {
        serviceId: getQueryString('serviceid'),
        skillUserId: getQueryString('skilluserid'),
        userId: getQueryString('userid'),
        sn: getQueryString('sn'),                
    }
    $.ajax({
        type: "post",
        url: "/zxcity_restful/ws/rest",
        data: {
            cmd: 'newservice/getSkillDetailInfo',
            data: JSON.stringify(params),
            version: 3
        },
        beforeSend: function() {
            // 不知道为什么，这玩意有个偏移
            setTimeout(function() {
                layer.load(1, {
                    shade: [0.1, '#fff']
                });
            }, 200)
        },
        success: function(data) {
            layer.closeAll('loading')
            if (data.code != 1) return layer.msg(data.msg, {
                icon: 2
            });
            initData(data.data);
            // 以下分享
            if(!data.data) return;
            var title = data.data.userName + '的服务详情';
            document.title = title;
            var introduce = data.data.serviceComment;
            var imgUrl = data.data.userPic;
            var resourceList = data.data.resourceList;
            if(resourceList.length > 0){
                imgUrl = resourceList[0]['resourceUrl']
            }
            share(title, introduce, imgUrl);
        },
        error: function() {
            layer.msg('系统繁忙！', {
                icon: 2
            });
        },
        complete: function() {
            setTimeout(function() {
                layer.closeAll('loading')
            }, 200)
        }
    });
}

// 初始化页面数据
function initData(data) {
    if(!data) return layer.msg('暂无数据！', {icon: 2});
    if(!data.shopId) $('#shopName').parents('tr').hide();
    // 有ID的span，一般需要更改文字
    $('span[id]').each(function() {
        var id = this.id;
        var val = data[id];
        if (id == 'isSkill' || id == 'ismerchant') {
//                  $(this).toggle(!!val);
        } else if (id == 'serviceTime') {
            $(this).text(formatWeek(val))
        } else if (id == 'servicePrice'){
            $(this).text(parseFloat(val).toFixed(2))
        } else if (id == 'serviceMode'){
            var str = val.replace('1', 'Ta来找我');
            str = str.replace('2', '我去找Ta');
            $(this).text(str);
        } else {
            $(this).text(val);
        }
    });
    // 处理等级
    var startLevel = parseInt(data.startLevel);
    for (var i = 0; i < startLevel; i++) {
        $('.star').eq(i).addClass('up');
    }
    // 处理性别
    var isBoy = data.userSex == '男';
    $('.sex').eq(0).toggle(isBoy);
    $('.sex').eq(1).toggle(!isBoy);
    // 处理图片
    $('#userPic').attr('src', data.userPic);
    var resourceList = data.resourceList;
    for (var i = 0; i < resourceList.length; i++) {
        var $div = $('<div class="swiper-slide"><img><div class="remark"></div></div>');
        $div.find('img').attr('src', resourceList[i]['resourceUrl']);
        var remark = resourceList[i]['remark'] || '';
        $div.find('.remark').text(resourceList[i]['remark'] || '');
        if(remark.length == 0) $div.find('.remark').hide();
        $('#resourceList .swiper-wrapper').append($div);
    }
    initSwiper();
    // 展开折叠处理
    foldSpan(true, $('#serviceComment'));
    if(data.characteristic == null  || data.characteristic == '') {
        $('#characteristic').parent().parent().remove();
    } else {
        foldSpan(true, $('#characteristic'));
    }

    $('.service_content').on('click', '.folder', function () {
        var isFolder = $(this).hasClass('off');
        $(this).find('span').text(isFolder ? '收起': '展开');
        $(this).siblings('.service_info').toggleClass('on');
        foldSpan(!isFolder, $(this).siblings('.service_info').find('>span'));
        $(this).toggleClass('off');
    })
    // 处理证书
    var certList = data.certList;
    if (!certList || certList.length == 0) $('#certList').hide();
    $('#listNum').text(certList.length || 0);
    for (var i = 0; i < certList.length; i++) {
        var certBox = $('.cert_box').first().clone();
        certBox.css('background-image', 'url("' + certList[i].certDealUrl + '")');
        certBox.find('.cover_info').text(certList[i].certName);
        certBox.css('display', 'inline-block');
        $('.cert_box_content').append(certBox);
    }
    $('.cert_box').first().remove();
    // domVM($('#resourceUrl'));
}

// 初始化swiper
function initSwiper(){
    new Swiper('#resourceList', {
        onInit: function (swiper) {
            $('#resourceList .tag').text(1 + '/' + swiper.slides.length)
        },
        onTransitionEnd: function(swiper){
            $('#resourceList .tag').text((swiper.activeIndex + 1) + '/' + swiper.slides.length)
        }
    });
}

// 处理服务时间week
function formatWeek(str) {
    var arr = str.split(',');
    arr.sort();
    var obj = {
        d1: '周一',
        d2: '周二',
        d3: '周三',
        d4: '周四',
        d5: '周五',
        d6: '周六',
        d7: '周日'
    }
    var result = [];
    for (var i = 0; i < arr.length; i++) result.push(obj['d' + parseInt(arr[i])]);
    return result.join(', ');
}

// 图片上下居中
function domVM(dom){
    var $dom = dom instanceof jQuery ? dom : $(dom);
    $dom.each(function(i, v){
        var img = this
        var interval = setInterval(function(){
            if(img.complete) {
                $(img).css('margin-top', parseInt(($(img).parent().height() - $(img).height()) / 2));
                clearInterval(interval);
            }
        }, 20)
    })
}

// 加省略号
function foldSpan(flag, $dom) {
    if(flag) {
        var txt = $dom.text();
        $dom.data('txt', txt);
        var h = $dom.parent().height();
        var h_ = $dom.height();
        var needFolder = h_ > h;
        $dom.parent().siblings('.folder').toggle(needFolder);
        if(!needFolder) return;
        while(h_ > h) {
            txt = txt.substr(0,txt.length -1);
            $dom.text(txt);
            h_ = $dom.height();
        }
        txt = txt.substr(0,txt.length - 3) + '...';
        $dom.text(txt);
        return;
    }
    var txt = $dom.data('txt');
    $dom.text(txt);
}