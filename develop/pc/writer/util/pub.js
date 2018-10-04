var layer = layui.layer;
$(function() {
    //判断身份显示头像  0(个人)   1(企业)
    var subscriptionType = localStorage.getItem('subscriptionType') || "";
    var subscriptionImgUrl = localStorage.getItem('subscriptionImgUrl') || "";
    var subscriptionName = localStorage.getItem('subscriptionName') || "";
    var apikey = localStorage.getItem('apikey') || "";
    var version = localStorage.getItem('version') || "1";
    var userId = localStorage.getItem("userId") || "";
    // 是否商户
    var isShop = localStorage.getItem("isShop") || "";
    // 商户初始化
    isShopInit(isShop);
    var salf = "";
    var str = '';
    var str1 = '';
    var idcard = '';

    //判断新用户能否进入页面
    function isTrue() {
        var menuHidVal = $("#menuHid").val();
        if (isNull(subscriptionType) && menuHidVal == "register_type") {
            return false;
        } else if (isNull(subscriptionType) && menuHidVal == "register_buss") {
            return false;
        } else if (isNull(subscriptionType) && menuHidVal == "register_single") {
            return false;
        } else if (!isNull(subscriptionType)) {
            return false;
        }
        return true;
    }

    //判断是否登录
    if (isNull(userId)) {
        layer.msg("登录异常，请重新登录!", function() {
            location.href = 'login.html';
        });
    } else if (isTrue()) {
        layer.msg("入驻资料以后才能访问!", function() {
            location.href = 'register_type.html';
        });
    }

    //判断个人和企业
    if (!isNull(subscriptionType)) {
        str = subscriptionType == 0 ? '<div class="user-type">个人号</div>' : '<div class="user-type">企业号</div>';
        idcard = subscriptionType == 0 ? "作者" : "商家";
    } else {
        str = '<div class="user-type" style="background:#ccc;"><a href="register_type.html" style="color:#fff;">去认证</a></div>';
        idcard = '暂无身份';
    }
    str1 += '<div class="user-group clearfix">';
    str1 += '<div class="face pull-left">';
    if (isNull(subscriptionImgUrl)) {
        str1 += '<img src="images/zhanwei.png" />';
    } else {
        str1 += '<img src="' + subscriptionImgUrl + '" />';
    }
    str1 += '<ul class="dropdown"><li><i class="fa fa-leaf"></i>' + idcard + '<div class="name"><a href="index.html">' + subscriptionName + '</a></div></li>';
    str1 += '<li class="line"><a href="javascript:;" id="exit"><i class="fa fa-sign-out"></i>退出</a></li></ul></div>';
    str1 += '<div class="pull-left">' + str + '<div class="user-name">' + subscriptionName + '</div></div>';
    $(".user").html(str1);

    //退出登录清空id
    $(".header").on('click', '#exit', function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('articleData');
        localStorage.removeItem('subscriptionName');
        localStorage.removeItem('subscriptionType');
        localStorage.removeItem('subscriptionInfo');
        localStorage.removeItem('userpic');
        localStorage.removeItem('apikey');
        localStorage.removeItem('operationPhone');
        location.href = "login.html";
    });

    //tab切换
    $(".tabinner").find("li a").click(function() {
        var index = $(this).index();
        $(this).parent().addClass("active").siblings().removeClass("active");
        $(".tab-content").eq(index).removeClass("hide").siblings().addClass("hide");
    });

    //导航切换
    $("a.sidebar-item").each(function(i, v) {
        var type = $(v).attr("type");
        if (type == $("#menuHid").val()) {
            $("a.sidebar-item").removeClass("active");
            $(v).addClass("active");
        }
    });
    //js over
});