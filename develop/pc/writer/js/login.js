var layer = layui.layer;
$(function() {
    // localStorage.clear();
    var user = $("#username");
    var code = $("#password");
    var sendSubmit = $("#sendSubmit");
    var username = localStorage.getItem("username") || "";
    var password = localStorage.getItem("password") || "";
    var isMonthNew = localStorage.getItem("isMonth") || "";
    //当前时间戳
    var timestamp = Date.parse(new Date()) / 1000;
    var param = location.search;

    //判断是否保存账户密码
    if (!isNull(username) && !isNull(password)) {
        $("#username").val(username);
        $("#password").val(password);
        $("#remember").attr("checked", "checked");
    }

    //判断是否选中一个月免登录
    $("#remember").click(function() {
        var checked = $(this).attr("checked");
        if (checked == "checked") {
            $("#remember").attr("checked", false);
        } else {
            $("#remember").attr("checked", "checked");
        }
    });

    //初始化加载登录
    var login = {
        checkInput: function() {
            if ($.trim(user.val()) == '' || $.trim(code.val()) == '') {
                layer.msg('请输入用户名或者密码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    user.val().trim() == "" ? user.focus() : code.focus();
                });
                return false;
            }
            if (!is_mobile($.trim(user.val()))) {
                layer.msg('用户名格式不正确！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    user.val().trim() == "" ? user.focus() : code.focus();
                });
                return false;
            }
            this.sendSubmit();
        },
        sendSubmit: function() {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            var _this = this;
            var cmd = "user/login";
            var data = "{'usercode':'" + user.val() + "','password':'" + code.val() + "'}";
            reqAjaxAsync(cmd, data).then(function(reData) {
                // var reData = reqAjax(cmd, data);
                if (reData.code == 1) {
                    if ($("#remember").attr("checked") == "checked") {
                        //是否有一个月
                        var isMonthOld = timestamp + 60 * 60 * 24 * 30;
                        if (isNull(isMonthNew)) {
                            //保存一个月后的时间
                            localStorage.setItem("isMonth", isMonthOld);
                        }
                        //保存账户密码
                        localStorage.setItem("username", user.val());
                        localStorage.setItem("password", code.val());
                    } else {
                        //清空cookie
                        localStorage.setItem("isMonth", "");
                        localStorage.setItem("username", "");
                        localStorage.setItem("password", "");
                    }
                    layer.msg('登录成功！');
                    var userData = reData.data;
                    var userId = userData.scSysUser.id;
                    localStorage.setItem('apikey', userData.apikey);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem("scSysUserInfo", JSON.stringify(userData.scSysUser));
                    localStorage.setItem('signature', userData.scSysUser.signature);
                    localStorage.setItem('operationPhone', user.val());
                    //获取用户信息
                    getUserInfo(userId, userData.apikey);
                } else {
                    layer.msg(reData.msg);
                }
            }, function(err) {
                console.log(err);
                layer.msg("系统繁忙, 请稍后再试!~");
            });
            //ajax over
        }
    };

    var userId = "",
        salt = "",
        shopId = "",
        send = "";
    //判断url后面是否有参数
    if (isNull(GetQueryString("userId")) && isNull(GetQueryString("salt"))) {
        userId = localStorage.getItem('userId') || "";
    } else {
        userId = GetQueryString("userId");
        salt = GetQueryString("salt");
        shopId = GetQueryString("shopId");
        send = GetQueryString("send");
        //根据url查询商户地址传过来的参数
        getUserId({
            userId: userId,
            salt: salt
        }, userId, send);
    }

    // 判断是否其他后台访问
    if (!isNull(GetQueryString("m")) && GetQueryString("m") == 1) {
        localStorage.setItem('isShop', 1);
    }

    // 判断是否其他后台访问
    if (!isNull(GetQueryString("m")) && GetQueryString("m") == 2) {
        localStorage.setItem('isM', 2);
    }
    // 存入商户id
    if (!isNull(GetQueryString("merchantid"))) {
        localStorage.setItem('merId', GetQueryString("merchantid"));
    }
    //根据url查询商户地址传过来的参数
    function getUserId(data, userId, send) {
        var cmd = "cms_back/verificationByUserId";
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dateType: "json",
            data: {
                "cmd": cmd,
                "version": version,
                "data": JSON.stringify(data),
            },
            beforeSend: function(request) {
                layer.load(0, {
                    shade: [0.1, '#fff']
                });
                request.setRequestHeader("apikey", "test");
            },
            success: function(res) {
                layer.closeAll('loading');
                if (res.code == 1) {
                    localStorage.setItem('apikey', res.data.apikey);
                    getUserInfo(res.data.userId, "test", send);
                } else {
                    localStorage.setItem('isShop', "");
                    layer.msg(res.msg, function() {
                        location.href = 'login.html';
                    });
                }
                console.log(res);
            },
            error: function() {
                layer.msg("系统繁忙，请稍后再试！");
            }
        })
    }
    //ajax根据ID获取其他信息
    function getUserInfo(userId, apikey, send) {
        var cmd = "cms_back/querySubScriptionByUserId";
        var data = "{'userId':'" + userId + "'}";
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            data: {
                "cmd": cmd,
                "data": data,
                "version": version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(re) {
                layer.closeAll('loading');
                isApikey(re);
                var reData = re;
                localStorage.setItem('articleData', JSON.stringify(reData.data));
                if (reData.code == 1) {
                    var loginData = reData.data;
                    if (isNull(loginData)) {
                        localStorage.setItem('subscriptionImgUrl', '');
                        localStorage.setItem('subscriptionName', '');
                        localStorage.setItem('subscriptionType', '');
                        localStorage.setItem("subscriptionInfo", '');
                        location.href = 'register_type.html';
                    } else {
                        localStorage.setItem('userId', loginData.userId);
                        localStorage.setItem('subscriptionImgUrl', loginData.subscriptionImgUrl);
                        localStorage.setItem('subscriptionName', loginData.subscriptionName);
                        localStorage.setItem('subscriptionType', loginData.subscriptionType);
                        localStorage.setItem("subscriptionInfo", JSON.stringify(loginData));
                        localStorage.setItem("isExamine", loginData.isExamine);
                        if (!isNull(send) && send == 1) {
                            return location.href = 'send_article.html' + param + '&isShop=1';
                        }
                        location.href = 'index.html';
                    }
                } else {
                    layer.msg(reData.msg, {
                        icon: 2,
                        shade: [0.1, '#fff'],
                        offset: '20%'
                    });
                }
            },
            error: function(re) {
                layer.closeAll('loading');
                var str1 = JSON.stringify(re);
                re.code = 9;
                re.msg = str1;
                reData = re;
            }
        });
    }

    //禁止输入空格
    // user.keyup(function() {
    //     $(this).val($(this).val().replace(/\s/g, ""));
    // });
    //监听回车事件
    code.keyup(function(e) {
        $(this).val($(this).val().replace(/\s/g, ""));
        if (e && e.keyCode == 13) {
            login.checkInput();
        }
    });
    //提交
    sendSubmit.click(function() {
        login.checkInput();
    });

    //jsover
});