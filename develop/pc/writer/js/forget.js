var layer = layui.layer;
$(function() {
    var apikey = localStorage.getItem('apikey') || ""; //获取缓存 通行证码
    var version = localStorage.getItem('version') || "1"; //获取缓存 版本号
    var usernameTxt = $("#usernameTxt");
    var passwordTxt = $("#passwordTxt");
    var codeTxt = $("#codeTxt");
    var getCode = $("#getCode");
    var sendSubmit = $("#sendSubmit");

    var forget = {
        flag: false,
        checkInput: function() {
            if (isNull($('#usernameTxt').val())) {
                layer.msg("请输入手机号");
                this.flag = false;
            } else if (!is_mobile($('#usernameTxt').val())) {
                layer.msg('请填写正确的手机号码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    usernameTxt.focus();
                });
                this.flag = false;
            } else {
                this.flag = true;
            }
        },
        isThere: function() {
            this.checkInput();
            if (this.flag) {
                $.ajax({
                    type: "POST",
                    url: "/zxcity_restful/ws/rest",
                    dataType: "json",
                    data: {
                        "cmd": "cms_back/queryScSysUser",
                        "version": "1",
                        "data": JSON.stringify({
                            userCode: $('#usernameTxt').val()
                        })
                    },
                    beforeSend: function(request) {
                        layer.load(0, {
                            shade: [0.1, '#fff']
                        });
                    },
                    success: function(res) {
                        layer.closeAll('loading');
                        if (res.code == 1) {
                            forget.getCodeAjax();
                        } else {
                            layer.msg(res.msg);
                        }
                    },
                    error: function(re) {
                        layer.closeAll('loading');
                        layer.msg("系统繁忙,请稍后再试")
                    }
                });
            }
        },
        getCodeAjax: function() {
            localStorage.setItem("username", usernameTxt.val());
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                data: {
                    "cmd": "user/reqCode",
                    "version": version,
                    "data": JSON.stringify({
                        usercode: $('#usernameTxt').val()
                    })
                },
                beforeSend: function(request) {
                    layer.load(0, {
                        shade: [0.1, '#fff']
                    });
                },
                success: function(res) {
                    layer.closeAll('loading');
                    if (res.code == 1) {
                        $("#showCode").text("您的验证码为:" + res.data.randomcode);
                        localStorage.setItem("randomcode", res.data.randomcode);
                        forget.flag = true;
                    } else {
                        forget.flag = false;
                    }
                    layer.msg(res.msg);
                },
                error: function(res) {
                    forget.flag = false;
                    layer.closeAll('loading');
                    layer.msg("系统繁忙,请稍后再试!");
                    console.log(res);
                }
            });
        },
        sendSubmit: function() {
            this.checkInput();
            if (this.flag) {
                if (isNull(codeTxt.val())) {
                    layer.msg("验证码不能为空");
                } else if (isNull(passwordTxt.val())) {
                    layer.msg("密码不能为空");
                } else {
                    $.ajax({
                        type: "post",
                        url: "/zxcity_restful/ws/rest",
                        dataType: "json",
                        data: {
                            "cmd": "user/checkCode",
                            "version": version,
                            "data": "{'usercode':'" + usernameTxt.val() + "','captcha':'" + codeTxt.val() + "'}"
                        },
                        beforeSend: function(res) {
                            layer.load(0, {
                                shade: [0.1, '#fff']
                            });
                        },
                        success: function(res) {
                            layer.closeAll('loading');
                            if (res.code == 1) {
                                layer.msg("验证通过");
                                setTimeout(function() {
                                    location.href = "reset.html";
                                }, 1000);
                                localStorage.setItem('id', res.data.id);
                            } else {
                                layer.msg(res.msg);
                            }
                        },
                        error: function() {
                            layer.closeAll('loading');
                            layer.msg("系统繁忙,请稍后再试");
                        }
                    });
                }
            }
        }
    };

    //禁止输入空格
    usernameTxt.keyup(function() {
        $(this).val($(this).val().replace(/\s/g, ""));
    });

    passwordTxt.keyup(function() {
        $(this).val($(this).val().replace(/\s/g, ""));
    });

    codeTxt.keyup(function() {
        $(this).val($(this).val().replace(/\s/g, ""));
    });

    // 获取验证码
    getCode.click(function() {
        forget.isThere();
    });

    // 提交
    sendSubmit.click(function() {
        forget.sendSubmit();
    });

})