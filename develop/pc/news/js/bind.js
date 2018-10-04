var layer = layui.layer;
$(function() {
    // 账号文本框
    var regUsercode = $("#regUsercode");
    // 密码文本框
    var regPassword = $("#regPassword");
    // 验证码
    var codeTxt = $("#codeTxt");
    var qqName = localStorage.getItem('qqName') || "";
    $("#qqName").html(qqName);
    var register = function() {
        this.url = {
            checkUsercode: "user/findUserByUsercode",
            getCode: "user/reqCode",
            login: "user/login",
            reg: "user/reg",
            bind: "cms_new/qqbindings"
        }
    };
    register.prototype = {
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
                    return layer.confirm("该手机号码已注册,是否绑定？", function(index) {
                        $(".sexBox,.codeBox,.regBox").slideUp(100);
                        $(".loginDiv").slideDown(100);
                        layer.close(index);
                    });
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
                    localStorage.setItem('userId', res.data.scSysUser.id);
                    localStorage.setItem('subscriptionImgUrl', res.data.scSysUser.userpic);
                    localStorage.setItem('subscriptionName', res.data.scSysUser.username);
                    var param = {
                        userId: res.data.scSysUser.id,
                        accessToken: localStorage.getItem("accessToken") || ""
                    };
                    reqAjaxAsync(_this.url.bind, param).done(function(res) {
                        localStorage.setItem('subscriptionName', res.data.nickname);
                        localStorage.setItem('subscriptionImgUrl', res.data.avatar.avatarURL30);
                        layer.msg(res.msg, function() {
                            location.href = 'index.html';
                        });
                    });
                }
            });
        },
        // 发送绑定
        sendBind: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.login, d).done(function(res) {
                if (res.code == 1) {
                    var param = {
                        userId: res.data.scSysUser.id,
                        accessToken: localStorage.getItem("accessToken") || ""
                    };
                    localStorage.setItem('userId', res.data.scSysUser.id);
                    localStorage.setItem('subscriptionImgUrl', res.data.scSysUser.userpic);
                    localStorage.setItem('subscriptionName', res.data.scSysUser.username);
                    reqAjaxAsync(_this.url.bind, param).done(function(res) {
                        localStorage.setItem('subscriptionName', res.data.nickname);
                        localStorage.setItem('subscriptionImgUrl', res.data.avatar.avatarURL30);
                        layer.msg(res.msg, function() {
                            location.href = 'index.html';
                        });
                    });
                } else {
                    layer.msg(res.msg);
                    // 如果该用户修改了手机号未注册则显示注册，隐藏登录
                    if (res.code == 9 && res.msg == "该用户不存在，请先注册！") {
                        $(".loginDiv").slideUp(100);
                        $(".sexBox,.codeBox,.regBox").slideDown(100);
                    }
                }
            });
        }
    };

    //开启登录
    var start = new register();
    // 切换性别
    $('.label-control').click(function() {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // 登录召唤
    $("#loginSpan").click(function() {
        if ($(this).text() == "注册") {
            $(this).text("登录");
            $("#tabSpan").text("已有账号去");
            $(".sexBox,.codeBox,.regBox").slideDown(100);
            $(".loginDiv").slideUp(100);
        } else {
            $(this).text("注册");
            $("#tabSpan").text("没有账号去");
            $(".sexBox,.codeBox,.regBox").slideUp(100);
            $(".loginDiv").slideDown(100);
        }
    });
    // 注册召唤模态框
    $("#registerSpan").click(function() {
        $("#regLi").click();
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
    $("#loginBtn").click(function() {
        start.sendBind({
            usercode: regUsercode.val().trim(),
            password: regPassword.val().trim()
        });
    });
});