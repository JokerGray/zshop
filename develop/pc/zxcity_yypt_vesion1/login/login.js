(function ($) {
    var form = layui.form;
    form.render("checkbox")
    var user = $("#username");
    var code = $(".passwordpass");
    var sendSubmit = $("#sendSubmit");
    var username = getCookie("username");
    var password = getCookie("password");
    var btn = getCookie("reserve");
    
   
    /****************************** Cookie *****************************/
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }

    function setCookie(c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    }

    function checkCookie() {
        username = getCookie("username")
        if (username != null && username != "") { 
            alert("Welcome again " + username + "!") }
        else {
            username = prompt("Please enter your name:", "")
            if (username != null && username != "") {
                setCookie("username", username, 365)
            }
        }
    }
            
    function deleteCookie(name) {
        setCookie(name,"",-1);
    }

    /****************************** ./Cookie *****************************/


    function sendRequest(cmd, data, async, successfn) {
        var defer = $.Deferred();

        console.log("new");
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            async: async || true, //默认为异步
            data: {
                "cmd": cmd,
                "data": data || "",
                "version": version
            },
            beforeSend: function(request) {
                layer.load(0, { shade: [0.1, '#fff'] });
                request.setRequestHeader("apikey", "test");// 登录时用test,不然会由于localstroage没清（非正常退出）而造成使用一个过期的apikey(redis过期)，造成接口访问失败。
            },
            success: function(data) {
                layer.closeAll('loading');
                defer.resolve(data);
            },
            error: function(err) {
                layer.closeAll('loading');
                layer.msg("系统繁忙，请稍后再试!");
                console.log(err.status + ":" + err.statusText);
            }
        });
        return defer.promise();
    }



    //判断是否保存账户密码
    if (btn == "true") {
        $("#username").val(username);
        $(".passwordpass").val(password);
        $("#radio").attr("checked", "checked");
        form.render("checkbox");
    } else {
        $("#username").val("");
        $(".passwordpass").val("");
        $("#radio").attr("checked", false);
        form.render("checkbox");
    } 

    form.on("checkbox(test)", function (data) {
        //sessionStorage.setItem("btn", data.elem.checked)

        setCookie("reserve", data.elem.checked, 7);
    });

    //点击placeholder变化
    $('#username,.passwordpass,#security').on('focus', function () {
        var _thisPlaceholder = $(this).attr('placeholder');
        $(this).attr('placeholder', '');
        $('#username,.passwordpass,#security').on('blur', function () {
            $(this).attr('placeholder', _thisPlaceholder)
        })
    })
    // 点击显示密码 
    $('.passwordpass').hideShowPassword({
        innerToggle: true,
        top: '50%'
    });
    $('.hideShowPassword-toggle-show').css({
        'cursor': 'pointer',
        'color': 'transparent',
        'right': '10px'
    });

    // 点击清除用户名
    $('i.setIcon-x').on('click', function () {
        $('#username').val('')
    })

    //初始化加载登录
    var login = {
        checkInput: function () {
            if ($.trim(user.val()) == '' || $.trim(code.val()) == '') {
                layer.msg('请输入正确的用户名或者密码！', { icon: 2, shade: [0.1, '#fff'], offset: '50%' }, function () {
                    user.val().trim() == "" ? user.focus() : code.focus();
                });
                return false;
            };
            this.sendSubmit();
        },
        sendSubmit: function () {
            layer.load(0, { shade: [0.1, '#fff'] });
            var _this = this;
            var cmd = "operations/login";
            var param = "{'usercode':'" + user.val() + "','password':'" + code.val() + "'}";
            sendRequest(cmd, param).then(function (res) {
                if (res.code == 1) {
                    if (form.on('checkbox(test)', function (data) {
                        data.elem.checked = true
                    })) {
                        setCookie("username", user.val(), 7);
                        setCookie("password", code.val(), 7);

                    } else {
                        //清空cookie
                        deleteCookie("username");
                        deleteCookie("password");
                        deleteCookie("reserve");
                    }
                    layer.msg('登录成功！');

                    var userData = res.data;
                    var userId = userData.ScSysBackUser.id;
                    var userImg = userData.ScSysBackUser.userImg;
                    var roleId = userData.roleIds;
                    var workphone = userData.workphone || "";
                    yyCache.set("apikey", userData.apikey);
                    yyCache.set("phone", userData.ScSysBackUser.phone);
                    yyCache.set("name", userData.ScSysBackUser.name);
                    yyCache.set("username", user.val());
                    yyCache.set("password", code.val());
                    yyCache.set("userImg", userImg);
                    yyCache.set("roleIds", roleId);
                    yyCache.set("roleName", userData.roleNames);
                    yyCache.set("nimToken", userData.ScSysBackUser.nimToken);
                    yyCache.set("pcNickname", userData.ScSysBackUser.name); //用户昵称
                    yyCache.set("userId", userId);
                    yyCache.set("userno", userData.ScSysBackUser.userno);
                    yyCache.set("organizationId", userData.ScSysBackUser.orgno); //所属组织机构id
                    sessionStorage.setItem("workphone", workphone);
                    sessionStorage.setItem("administration", userData.administration); //1-管理员 0-非管理员
                    location.href = "login_success.html";
                } else {
                    layer.msg(res.msg);
                }
            })
        }
    };

    //禁止输入空格
    user.keyup(function () {
        $(this).val($(this).val().replace(/\s/g, ""));
    });


    //监听回车事件
    code.keyup(function (e) {
        $(this).val($(this).val().replace(/\s/g, ""));
        if (e && e.keyCode == 13) {
            login.checkInput();
        }
    });


    //提交
    sendSubmit.click(function () {
        login.checkInput();
    });


    $("#username").focus(function () {
        $(this).siblings(".setIcon-amdin").addClass("act");
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).siblings(".setIcon-amdin").removeClass("act");
        } else {
            return false;
        }

    })

    
    $(".passwordpass").focus(function () {
        $(this).parent().siblings(".setIcon-key").addClass("act");
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).parent().siblings(".setIcon-key").removeClass("act");
        } else {
            return false;
        }

    })

})(jQuery);





