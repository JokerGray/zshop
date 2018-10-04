/**
 * Created by Administrator on 2017/5/18.
 */
(function ($) {
  //获取参数
  var shopId = getUrlParams('shopid') || '';
  var goodsId = getUrlParams('goodsid') || '';
  var apptype = getUrlParams('apptype') || '';
  var subtype = getUrlParams('subtype') || '';
  var fromscan = getUrlParams('fromscan') || '';
  var jumpParams = getUrlParams("jumpParams") || '';
  var yw = getUrlParams('yw') || '';//页面板块id
  var sn = getUrlParams('sn') || '';//推荐人sn
  var packUrl = '/24hours/share24/getPackage.html?yw=' + yw + '&sn=' + sn + '&cp=1';

  //购买跳转app地址
  var $ios_app = "CityNRH://?apptype=" + apptype + "&subtype=" + subtype + "&shopid=" + shopId + "&fromscan=" + fromscan + "&goodsid=" + goodsId;
  var $android_app = "selfapp://izxcs/openwith_shopGoods?apptype=" + apptype + "&subtype=" + subtype + "&shopId=" + shopId + "&shopid=" + shopId + "&fromscan=" + fromscan + "&goodsid=" + goodsId;

  //礼包跳转app地址
  var $iosApp = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
  var $androidApp = "smartcity://android/gateway?jumpParams=" + jumpParams;


  //app下载地址
  var $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
  var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";

  //ajax入参
  var sHtml = '';
  var param = "{'shopId':110, 'goodsId':356}";
  /*var param = "{'shopId':" + shopId + ",'goodsId':" + goodsId + "}";*/
  var res = reqAjax('shop/goodsDetail', param);

  //页面初始化
  function init(res) {
    if (res.code == 1) {
      var data = res.data;
      sHtml +=
        '<div class="title">' +
        '<div class="swiper-container">' +
        '<div class="swiper-wrapper">';
      if (data.imageList.length > 1) {
        for (var i = 0; i < data.imageList.length; i++) {
          var row = data.imageList[i];
          sHtml +=
            '<div class="swiper-slide">' +
            '<img src="' + row.bigFilePath + '">' +
            '</div>';
        }
        sHtml +=
          '</div><div class="swiper-pagination"></div>' +
          '</div></div>';
      } else {
        sHtml +=
          '<img src="' + data.imageList[0].bigFilePath + '"></div></div></div>';
      }
      sHtml +=
        '<div class="commodity-info">' +
        '<p>' + data.goodsName
      if (data.descTitle) {
        sHtml += '，' + data.descTitle
      }
      sHtml +=
        '</p>' +
        '<p class="price">￥<span>' + data.price + '</span></p>' +
        '<p class="sales"><span>库存' + isNull(data.stockBalance) + '</span><span>销量' + isNull(data.payCount) + '</span></p>' +
        '</div>';

      //是否有赠品
      if (data.isHasGift == 0) {
        sHtml +=
          '<div class="gift-info">' +
          '  <span>赠品</span>' +
          '  <i></i>' +
          '<div class="gift-name">' + data.gift.goodsName +
          /*'  <p>1' + data.gift.units + '</p>' +*/
          '</div>' +
          '</div>'
      }

      //判断是否有评论
      if (data.commentFirst) {
        sHtml +=
          '<div class="commodity-assess">' +
          '<div class="assess-count">' +
          '<p>商品评价</p>' +
          '</div>' +
          '<div class="assess-details">' +
          '<p>' + data.commentFirst.userCode + '</p>' +
          '<div class="star-rating"><a></a><a></a><a></a><a></a><a></a></div></div>' +
          '<div class="assess-content">' + data.commentFirst.commentContent + '</div>';

        //判断用户是否上传评论图片
        if (data.commentFirst.imgNameList) {
          sHtml +=
            '<div class="commodity-img">'
          for (var z = 0; z < data.commentFirst.imgNameList.length; z++) {
            sHtml +=
              '<a href="javascript:void(0)" style="background-image: url(' + data.commentFirst.imgNameList[z] + ')"></a>'
          }
          sHtml += '</div>';
        }


        sHtml += '<div class="specification">';
        if (data.commentFirst.stockName != null && data.commentFirst.stockName != '') {
          sHtml += '<p><span>' + data.commentFirst.stockName + '</span></p>'
        }
        sHtml += '<div class="date">' + data.commentFirst.commentDate + '</div></div></div>'
      }

      //店铺信息
      sHtml +=
        '<div class="shop"><i></i>' +
        '<div class="shop-name">' + data.shopName + '</div>' +
        '<p>' + data.shopDesc + '</p>' +
        '</div>';

      if (data.descContent) {
        sHtml += '<div class="details">' +
          '<div class="subtitle">商品详情</div>' +
          '<div class="details-content">' + data.descContent + '</div></div>'
      }
      sHtml +=
        '<div class="sub">' +
        '<button>立即购买</button>' +
        '</div>' +
        '<div class="app-download">' +
        '<a href="javascript:void(0)">' +
        '<img src="img/btn.png" alt="按钮">' +
        '</a></div>';
      $('#commodityShare').html(sHtml);

      //评论星级
      if (data.commentFirst) {
        if ($('html').attr('data-dpr') == '2') {
          $('.star-rating a:lt(' + data.commentFirst.score + ')').addClass('active');
        } else if ($('html').attr('data-dpr') == '3') {
          $('.star-rating a:lt(' + data.commentFirst.score + ')').addClass('active');
        } else if ($('html').attr('data-dpr') == '1') {
          $('.star-rating a:lt(' + data.commentFirst.score + ')').addClass('active');
        }
      }

      //商店logo
      if (data.shopLogoUrl) {
        $('#commodityShare .shop i').css('backgroundImage', 'url(' + data.shopLogoUrl + ')');
      }

      //赠品
      if (data.isHasGift == 0) {
        $('#commodityShare .gift-info i').css('backgroundImage', 'url(' + data.gift.pictureUrl + ')')
      }

    } else {
      console.log(res.msg);
    }
  }

  init(res);

  //轮播初始化
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    autoplay: 2000,//轮播间隔时间
    autoplayDisableOnInteraction: false,
    grabCursor: true,//悬浮手型
    loop: true,
    // 如果需要分页器
    pagination: '.swiper-pagination',
    paginationClickable: true
  })


  //页面跳转app or商店
  $('#commodityShare').on('click', '.sub button', function () {
//android
    if (navigator.userAgent.match(/android/i)) {
      //微信
      if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
        //android微信
        $('#weixin_pageto').show();
        $('#commodityShare').hide();
      } else {
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
            window.location.href = $android_url;
          }
        }, 3000);
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
          window.location.href = $ios_url;
        }, 3000);
      }
    } else {
      //判断为pc
      window.location.href = $android_url;
    }
  })


  //跳转礼包下载
  $('#commodityShare').on('click', '.app-download', function () {
    //安卓
    if (navigator.userAgent.match(/android/i)) {
      //微信
      if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
        $('#weixin_pageto').show();
        $('#commodityShare').hide();
      } else {
        var last = Date.now();
        var doc = window.document;
        var ifr = doc.createElement('iframe');
        ifr.src = $androidApp;
        ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
        doc.body.appendChild(ifr);
        setTimeout(function () {
          doc.body.removeChild(ifr);
          //setTimeout回小于2000一般为唤起失败
          if (Date.now() - last < 4000) {
            window.location.href = packUrl;
          }
        }, 3000);
      }
      //判断为IOS
    } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
      //微信&微博
      if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
        $('#weixin_pageto').show();
        $('#commodityShare').hide();
        //QQ内置浏览器
      } else if (navigator.userAgent.indexOf(' QQ') > -1) {
        $('#weixin_pageto').show();
        $('#commodityShare').hide();
      } else {
        window.location.href = $iosApp;
        setTimeout(function () {
          window.location.href = packUrl;
        }, 3000);
      }
    } else {
      //判断为pc
      window.location.href = packUrl;
    }
  })

  var title = res.data.goodsName || '智享City-云店';
  var desc = res.data.descTitle || '';
  var img = res.data.pictureUrl || res.data.imageList[0].bigFilePath;
  document.title = title;

  //分享初始化
  share(title, desc, img);

})(jQuery);