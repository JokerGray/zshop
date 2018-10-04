var layer = layui.layer;
$(function() {
    var register = {
        isSubmit: false,
        isGetCode: false,
        i: false,
        mobile: $("#mobile"),
        pass: $("#password"),
        surepass: $("#surepassword"),
        code: $("#code"),
        checkInput: function() {
            var mobile = $.trim(this.mobile.val());
            var pass = $.trim(this.pass.val());
            var surepass = $.trim(this.surepass.val());
            if (isNull(mobile)) {
                layer.msg('账号不能为空', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    time: 3000
                });
                register.isGetCode = false;
            } else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile.trim()))) {
                layer.msg('请填写正确的手机号码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    register.mobile.focus();
                });
                register.isGetCode = false;
            } else if (isNull(pass) || isNull(surepass)) {
                layer.msg('密码不能为空', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    time: 3000
                });
                register.isGetCode = false;
            } else if (pass != surepass) {
                layer.msg('两次密码不一致', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    time: 3000
                });
                register.isGetCode = false;
            } else {
                register.isGetCode = true;
            }
        },
        getCode: function() {
            this.checkInput();
            if (this.isGetCode) {
                var usercode = this.mobile.val().trim();
                var cmd = "user/findUserByUsercode";
                var data = '{"usercode":"' + usercode + '"}';
                //检测手机号码是否注册
                reqAjaxAsync(cmd, data).done(function(res) {
                    if (res.code == 1) {
                        $(".codestr").text("");
                        $("#codestr").hide();
                        layer.msg('该手机号码已注册！', {
                            icon: 2,
                            shade: [0.1, '#fff'],
                            offset: '20%'
                        }, function() {
                            register.mobile.focus();
                        });
                        register.isGetCode = false;
                    } else {
                        var cmd = "user/reqCode";
                        var data = '{"usercode":"' + usercode + '"}';
                        //请求验证码
                        reqAjaxAsync(cmd, data).done(function(res) {
                            if (res.code == 1) {
                                register.isGetCode = true;
                                var randomcode = res.data.randomcode;
                                layer.msg(res.msg);
                                // $(".codestr").text(randomcode);
                                // $("#codestr").show();
                            } else {
                                layer.msg(res.msg);
                                register.isGetCode = false;
                            }
                        })
                    }
                });
            }
        },
        submitRegister: function() {
            this.checkInput();
            if (this.isGetCode) {
                if (isNull($.trim(this.code.val()))) {
                    layer.msg('验证码不能为空', {
                        icon: 2,
                        shade: [0.1, '#fff'],
                        time: 3000
                    });
                    return false;
                } else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test($.trim(this.mobile.val())))) {
                    layer.msg('请填写正确的手机号码！', {
                        icon: 2,
                        shade: [0.1, '#fff'],
                        offset: '20%'
                    }, function() {
                        register.mobile.focus();
                    });
                    return false;
                }
                var usercode = this.mobile.val().trim();
                var pass = this.pass.val();
                var surepass = this.surepass.val();
                var captcha = this.code.val().trim();
                var sure = $("#surepassword").val();
                var cmd = "user/reg";
                var data = '{"usercode":"' + usercode + '","captcha":"' + captcha + '","password":"' + pass + '","usersex":"男"}';
                layer.load();
                $.when(reqAjaxAsync(cmd, data)).done(function(re) {
                    setTimeout(function() {
                        layer.closeAll('loading');
                        if (re.code == 1) {
                            layer.msg("注册成功！", {
                                icon: 6
                            }, function() {
                                localStorage.setItem('operationPhone', usercode);
                                location.href = 'login.html';
                            });
                        } else {
                            layer.msg(re.msg);
                        }
                    }, 1000)
                });
            }
            //  else {
            //     layer.msg('请按要求填写资料', { icon: 2, shade: [0.1, '#fff'], time: 3000 });
            // }
        }
    }
    $(".code-btn").on("click", function() {
        register.getCode();
    })
    $("#sendSubmit").on("click", function() {
        register.submitRegister();
    })
});