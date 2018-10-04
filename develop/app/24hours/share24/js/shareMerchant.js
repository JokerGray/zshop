$(function () {
    var merchantId = getUrlParams("merchantId"),
        shopStatus = getUrlParams("shopStatus"),
        yw = getUrlParams('yw'),
        cp = getUrlParams("cp"),
        sn = getUrlParams('sn'),
        jumpParams = getUrlParams("jumpParams") || "";
    var CMD_QUERYSHOP = "cms_new/advShopByMerchantId";
    // 跳转广告页面
    // var getPackLink = "getPackage.html?yw=" + yw + "&cp=" + cp + "&sn=" + sn;
    var $ios_app_download = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_app_download = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //跳转app商品详情页地址
    var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
    var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;
    /*
     *初始化查询   
    */
    var data = {
        shopStatus: shopStatus,
        merchantId: merchantId
    }
    reqAjaxAsync(CMD_QUERYSHOP, JSON.stringify(data)).done(function (res) {
        console.log(res)
        showInfo(res.data);
    });
    /*
     *初始化查询   
    */
    function showInfo(re) {
        // console.log(re)
        $('.user').html('<img src="' + re.backUserImg + '?x-oss-process=image/resize,m_fill,w_70,h_70,limit_0" alt="">');
        $('.shop-name').text(re.backUserName);
        var shopHtml = "";
        for (var i = 0; i < re.shopList.length; i++) {
            // 奇数位店铺信息
            if (i % 2 == 0) {
                shopHtml += '<div class="shop-box shop-sg">' +
                    '<div class="shop">' +
                    '<div class="shopImg">' +
                    '<img src="' + re.shopList[i].bgImage + '" alt="图片">' +
                    '<div class="shop-local">' +
                    '<span class="loca-lg"></span>' +
                    ' <p>' + re.shopList[i].address + '</p>' +
                    '</div></div>' +
                    '<div class="shopInfo">' +
                    '<img src="' + re.shopList[i].logoUrl + '" alt="图片">' +
                    '<div class="user-img-bt"></div>' +
                    '<p class="shopName">' + re.shopList[i].shopName + '</p>' +
                    '<p class="fans">粉丝：' + re.shopList[i].shopFavCount + '</p>' +
                    '<p class="phone-num">' + (re.shopList[i].mobile || '无') + '</p>' +
                    '<span class="phone-logo"></span>' +
                    '<div class="enter" data-shopid="' + re.shopList[i].id + '"></div>' +
                    '</div></div></div>';
            } else if (i % 2 == 1) {
                shopHtml += '<div class="shop-box shop-db">' +
                    '<div class="shop">' +
                    '<div class="shopInfo">' +
                    '<img src="' + re.shopList[i].logoUrl + '" alt="图片">' +
                    '<div class="user-img-bt"></div>' +
                    '<p class="shopName">' + re.shopList[i].shopName + '</p>' +
                    '<p class="fans">粉丝：' + re.shopList[i].shopFavCount + '</p>' +
                    '<p class="phone-num">' + (re.shopList[i].mobile || '无') + '</p>' +
                    '<span class="phone-logo"></span>' +
                    '<div class="enter" data-shopid="' + re.shopList[i].id + '"></div>' +
                    '</div>' +
                    '<div class="shopImg">' +
                    '<img src="' + re.shopList[i].bgImage + '" alt="图片">' +
                    '<div class="shop-local">' +
                    '<span class="loca-lg"></span>' +
                    '<p>' + re.shopList[i].address + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        }
        $('.shop-list').html(shopHtml);
        // 微信分享内容定义
        var shareObj = {
            title: re.backUserName,
            desc: "查看" + re.backUserName + "的所有店铺",
            link: location.href,
            imgUrl: re.backUserImg
        }
        share(shareObj);
        //分享打开APP
        //页面跳转app or商店
        $(".user,.toApp").on('click', function () {
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
        // 进入店铺按钮
        $('.enter').on('click', function () {
            var shopId = $(this).attr('data-shopid');
            toShop(shopId);
        });
    }
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
    // 跳转到云店
    function toShop(shopId) {
        var cloudShop = location.host + '/cloud_store/scan/ewm.html?apptype=cityshop&subtype=shophome&shopid=' + shopId + '&fromscan=yes&sn=4A&yw=shop&cp=1&visitFrom=1';
        window.location.href = 'http://' + cloudShop;
    }
});

