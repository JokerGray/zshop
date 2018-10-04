/**
 * Created by caisheng on 2017/9/11.
 */
(function ($) {
  var shopId = getUrlParams('shopId');
  var flag = true;
  var layer = layui.layer;

  //app下载地址
  var $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
  var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";

  const REQUEST_URL = {
    GETTHISSHOPACTION: 'shop/getThisShopAction',//云店线下店铺获取该店铺的优惠活动信息
    GETPHONECODE: 'shop/getPhoneCode',//获取手机短信验证码
    SAVESCANNINGLOGIN: 'shop/saveScanningLogin',//扫描店铺二维码登录注册
    /*GETSCANNINGSHOPOFLATE: 'shop/getScanningShopOfLate',//返回刚才扫描的店铺id,超过24小时返回空字符串
    GETMYTHISSHOPACTION: 'shop/getMyThisShopAction'//获取我在该店铺可以享用的优惠活动信息*/
  }

  //ios快速点击初始化
  $(function () {
    FastClick.attach(document.body);
  })

  var param = {
    shopId: shopId
  }
  var res = reqAjax(REQUEST_URL.GETTHISSHOPACTION, JSON.stringify(param));

  //店铺优惠信息初始化
  function init(res) {
    if (res.code == 1) {
      if (res.data.id) {
        var data = res.data;
        $('.info').show();
        if (data.acType == 0) {
          $('.info .item-name:eq(0)').html('活动名称：减免金额');
        } else if (data.acType == 1) {
          $('.info .item-name:eq(0)').html('活动名称：提供折扣');
        } else if (data.acType == 2) {
          $('.info .item-name:eq(0)').html('活动名称：实物赠送');
        }
        $('.info .item-name:eq(1)').html(data.acContent);
        $('.info .item-name:eq(2)').html(data.acBgTime);
        $('.info .item-name:eq(3)').html(data.acEdTime);
      }
    } else {
      $('#shopQrcode').hide();
      layer.msg(res.msg);
    }
  }

  init(res);


  //获取短信验证码
  $('.get').on('click', function () {
    var $this = $(this);
    var phone = $.trim($('#phone').val());
    if (!is_mobile(phone)) {
      layer.msg('请输入正确的手机号码!')
      return;
    }
    var param = {
      userCode: phone
    }
    if (flag) {
      var seconds = 60;
      var timer = null;
      timer = setInterval(function () {
        if (seconds > 0) {
          seconds--;
          $this.html('正在获取中(' + seconds + ')');
        } else {
          $this.html('获取验证码');
          clearInterval(timer);
          flag = true;
        }
      }, 1000);
      flag = false;
      reqAjaxAsync(REQUEST_URL.GETPHONECODE, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
          layer.msg(res.msg);
        } else {
          layer.msg(res.msg);
        }
      });
    }
  })

  //登录注册
  $('.submit').click(function () {
    var userPhone = $.trim($('#phone').val());
    var phoneCode = $.trim($('#code').val());
    if (!is_mobile(userPhone) || !phoneCode) {
      layer.msg('手机号或验证码错误!');
      return
    }

    var param = {
      userPhone: userPhone,
      phoneCode: phoneCode,
      shopId: 123
    }

    var res = reqAjax(REQUEST_URL.SAVESCANNINGLOGIN, JSON.stringify(param));
    if (res.code == 1) {
      layer.msg(res.msg);
      setTimeout(function () {
        if (navigator.userAgent.match(/android/i)) {
          window.location.href = $android_url;
        }//判断为IOS
        else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
          window.location.href = $ios_url;
        } else {
          //判断为pc
          window.location.href = $ios_url;
        }
      }, 2000);
    } else {
      layer.msg(res.msg);
    }
  })


//手机正则匹配
  function is_mobile(val) {
    var reg = /^1[3,5,7-8][0-9]{9}$/i;
    return reg.test(val);
  }

})(jQuery);