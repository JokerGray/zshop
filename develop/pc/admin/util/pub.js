var layer = layui.layer;
$(function() {
    var userImg = !isNull(localStorage.getItem("userImg")) ? localStorage.getItem("userImg") : "";
    var userId = !isNull(localStorage.getItem("userId")) ? localStorage.getItem("userId") : "";
    var userName = !isNull(localStorage.getItem("userName")) ? localStorage.getItem("userName") : "";
    var roleName = !isNull(localStorage.getItem("roleName")) ? localStorage.getItem("roleName") : "";
    var scCmsNewPermissions = localStorage.getItem('scCmsNewPermissions') || "";
    // 启动菜单
    isNull(scCmsNewPermissions) ? location.href = "login.html" : menu(scCmsNewPermissions);

    //判断个人和企业
    var str1 = "";
    str1 += '<div class="user-group clearfix">';
    str1 += '<div class="face pull-left">';
    if (isNull(userImg)) {
        str1 += '<img src="images/facenormal.png" />';
    } else {
        str1 += '<img src="' + userImg + '" />';
    }
    str1 += '<ul class="dropdown"><li><i class="fa fa-leaf"></i>' + roleName + '<div class="name"><a href="index.html" userId="' + userId + '">' + userName + '</a></div></li>';
    str1 += '<li class="line"><a href="javascript:;" id="exit"><i class="fa fa-sign-out"></i>退出</a></li></ul></div>';
    str1 += '<div class="pull-left">' + roleName + '<div class="user-name">' + userName + '</div></div>';
    $(".user").html(str1);

    //退出登录清空id
    $(".header").on('click', '#exit', function() {
        localStorage.clear();
        location.href = "login.html";
    });

    //tab切换
    $(".tabinner").find("li").click(function() {
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
    });

    //导航切换
    $("a.sidebar-item").each(function(i, v) {
        var type = $(v).attr("type");
        if (type == $("#menuHid").val()) {
            $("a.sidebar-item").removeClass("active");
            $(v).addClass("active");
        }
    });

    // 生成菜单
    function menu(d) {
        var d = JSON.parse(d);
        var ul = $("#leftMenuUl");
        // 加上移除已经使用过的数据
        for (var i = 0; i < d.length; i++) {
            var data = d[i];
            if (data['parentid'] == 0) {
                var li = $('<li></li>');
                li.data(data)
                var a = $('<a href="' + data.url + '" class="sidebar-item" type="' + data.percode + '"><i class="menu-icon" style="background:url(images/menu/' + data.iconUrl + ') no-repeat"></i><span>' + data.name + '</span></a>');
                li.append(a);
                ul.append(li);
            }
        }
        ul.find('>li').each(function() {
            var pid = $(this).data('id');
            var _ul = $('<ul class="sidebar-sub"></ul>')
            $.each(d, function() {
                var data = this
                if (data['parentid'] == pid) {
                    var li = $('<li class="level2"></li>');
                    li.data(data)
                    var a = $('<a href="' + data.url + '" class="sidebar-item" type="' + data.percode + '">' + data.name + '</a>');
                    _ul.append(li.append(a))
                }
            })
            $(this).append(_ul);
        })
        ul.find('li.level2').each(function() {
            var pid = $(this).data('id');
            var _ul = $('<ul style="padding-left:20px;"></ul>')
            $.each(d, function() {
                var data = this
                if (data['parentid'] == pid) {
                    var li = $('<li></li>');
                    li.data(data)
                    var a = $('<a href="' + data.url + '" class="sidebar-item gray" type="' + data.percode + '"> · ' + data.name + '</a>');
                    _ul.append(li.append(a))
                }
            })
            $(this).append(_ul);
        })
        return false;
    }
    //js over
});