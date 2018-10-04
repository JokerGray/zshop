var layer = layui.layer;
$(function() {
    // 账号文本框
    var user = $("#usercodeInp");
    var regUsercode = $("#regUsercode");
    // 密码文本框
    var code = $("#passwordInp");
    var regPassword = $("#regPassword");
    // 验证码
    var codeTxt = $("#codeTxt");
    //当前时间戳
    var timestamp = Date.parse(new Date()) / 1000;
    // 获取一个月后的时间
    var isMonthNew = localStorage.getItem("isMonth");
    var login = function() {
        this.url = {
            login: "user/login",
            checkUsercode: "user/findUserByUsercode",
            getCode: "user/reqCode",
            reg: "user/reg",
            userInfo: "cms_back/querySubScriptionByUserId" //查询作家信息
        }
    };
    login.prototype = {
        // 登录验证
        checkInput: function(d) {
            if (isNull(user.val().trim()) || isNull(code.val().trim())) {
                layer.msg('请输入用户名和密码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    user.val().trim() == "" ? user.focus() : code.focus();
                });
                return false;
            }
            if (!is_mobile(user.val().trim())) {
                layer.msg('用户名格式不正确！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    user.val().trim() == "" ? user.focus() : code.focus();
                });
                return false;
            }
            this.sendSubmit(d);
        },
        // 注册验证
        regCheckInput: function() {
            if (isNull(regUsercode.val().trim()) || isNull(regPassword.val().trim())) {
                layer.msg('请输入用户名和密码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    regUsercode.val().trim() == "" ? regUsercode.focus() : regPassword.focus();
                });
                return false;
            }
            if (!is_mobile(regUsercode.val().trim())) {
                layer.msg('用户名格式不正确！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    regUsercode.focus();
                });
                return false;
            }
            return true;
        },
        // 手机号码是否注册,获取验证码
        getCode: function(d) {
            var _this = this;
            if (!_this.regCheckInput()) {
                return false;
            }
            reqAjaxAsync(_this.url.checkUsercode, d).done(function(res) {
                var data = res.data;
                if (res.code == "1") {
                    return layer.msg("该手机号码已注册！");
                }
                reqAjaxAsync(_this.url.getCode, d).done(function(res) {
                    return layer.msg(res.msg);
                });
            });
        },
        // 提交注册
        sendReg: function(d) {
            var _this = this;
            if (!_this.regCheckInput()) {
                return false;
            }
            if (isNull(codeTxt.val().trim())) {
                layer.msg('请输入验证码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    codeTxt.focus();
                });
                return false;
            }
            reqAjaxAsync(_this.url.reg, d).done(function(res) {
                layer.msg(res.msg);
                if (res.code == "1") {
                    _this.getUserData(res.data);
                }
            });
        },
        sendSubmit: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.login, d).done(function(res) {
                if (res.code != "1") {
                    layer.msg(res.msg);
                }
                else {
                    if (!isNull(res.data)) {
                        var userData = res.data;
                        var userId = userData.scSysUser.id;
                        // 是否选中记住密码
                        if ($("#remember").hasClass("active")) {
                            //保存一个月
                            var isMonthOld = timestamp + 60 * 60 * 24 * 30;
                            if (isNull(isMonthNew)) {
                                localStorage.setItem("isMonth", isMonthOld);
                            }
                            //保存账户密码
                            localStorage.setItem("newsUsername", user.val());
                            localStorage.setItem("newsPassword", code.val());
                        } else {
                            //清空缓存
                            localStorage.setItem("isMonth", "");
                            localStorage.setItem("username", "");
                            localStorage.setItem("password", "");
                        }
                        // 查询用户信息
                        _this.getUserInfo({
                            'userId': userId,
                            'data': res.data
                        });
                    }
                }
            });
        },
        // 获取用户信息
        getUserData: function(d) {
            // 关闭模态框
            $("#loginModal").modal("hide");
            $("#exit").attr("href", "javascript:;");
            //隐藏登录注册
            $(".userOperate").hide();
            //显示用户登录的信息
            $(".userInfo").show();
            // 填写信息到页面头部
            $("#avatarImg").attr("src", d.scSysUser.userpic);
            $("#username").html(d.scSysUser.username);
            //存储缓存
            // localStorage.setItem('apikey', userData.apikey);
            localStorage.setItem('subscriptionImgUrl', d.scSysUser.userpic);
            localStorage.setItem('subscriptionName', d.scSysUser.username);
            localStorage.setItem('userId', d.scSysUser.id);
        },
        // 根据id查询用户信息
        getUserInfo: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.userInfo, {
                userId: d.userId
            }).done(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                if (isNull(res.data)) {
                    return _this.getUserData(d.data);
                }
                // 关闭模态框
                $("#loginModal").modal("hide");
                $("#exit").attr("href", "javascript:;");
                //隐藏登录注册
                $(".userOperate").hide();
                //显示用户登录的信息
                $(".userInfo").show();
                // 填写信息到页面头部
                $("#avatarImg").attr("src", res.data.subscriptionImgUrl);
                $("#username").html(res.data.subscriptionName);
                //存储缓存
                // localStorage.setItem('apikey', userData.apikey);
                localStorage.setItem('userId', d.userId);
                localStorage.setItem('subscriptionImgUrl', res.data.subscriptionImgUrl);
                localStorage.setItem('subscriptionName', res.data.subscriptionName);
                localStorage.setItem('subscriptionId', res.data.subscriptionId);
                localStorage.setItem('subscriptionType', 1);
                location.reload();
            });
        }
    };

    //开启登录
    var start = new login();
    // 切换性别
    $('.label-control').click(function() {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // 注册召唤模态框
    $("#registerSpan").click(function() {
        $("#regLi").click();
    });
    //记住密码
    $("#remember").click(function() {
        $(this).toggleClass("active");
    });
    //登录点击
    $("#loginBtn").click(function() {
        var d = $("#loginForm").serializeJson();
        start.checkInput(d);
    });
    // 获取验证码
    $("#codeBtn").click(function() {
        start.getCode({
            usercode: regUsercode.val().trim()
        });
    });
    // 注册
    $("#regBtn").click(function() {
        start.sendReg({
            usercode: regUsercode.val().trim(),
            password: regPassword.val().trim(),
            captcha: codeTxt.val().trim(),
            usersex: $(".label-control.active").find('.usersex').text()
        });
    });
    //监听回车事件
    code.keyup(function(e) {
        var d = $("#loginForm").serializeJson();
        $(this).val($(this).val().replace(/\s/g, ""));
        if (e && e.keyCode == 13) {
            start.checkInput(d);
        }
    });
    // 切换登录和注册
    $(".title_ul li").click(function() {
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".loginBox").eq(index).addClass("active").siblings().removeClass("active");
    });
    // 退出登录
    $("#exit").click(function() {
        //隐藏登录注册
        $(".userOperate").show();
        //显示用户登录的信息
        $(".userInfo").hide();
        // 填写信息到页面头部
        $("#avatarImg").attr("src", '');
        $("#username").html('');
        //存储缓存
        localStorage.removeItem('userId');
        localStorage.removeItem('subscriptionImgUrl');
        localStorage.removeItem('subscriptionName');
        localStorage.removeItem('subscriptionType');
        if(isNull($(this).attr('isDraw'))) {
            location.reload();
        } else {
            window.location.href = 'index.html';
        }
    });
    // js over
});

//点击登录用户跳转至我的页面
$('#avatarImg').click(function() {
    window.location.href = 'myArticle.html?userId=' + localStorage.getItem('userId');
})
$('#username').click(function() {
    window.location.href = 'myArticle.html?userId=' + localStorage.getItem('userId');
})