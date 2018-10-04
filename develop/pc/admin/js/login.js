var layer = layui.layer;
$(function() {
    var user = $("#username");
    var code = $("#password");
    var sendSubmit = $("#sendSubmit");
    var username = localStorage.getItem("usernameAdmin") || "";
    var password = localStorage.getItem("passwordAdmin") || "";
    var isMonthNew = localStorage.getItem("isMonthAdmin") || "";
    var key = GetQueryString("key");
    //当前时间戳
    var timestamp = Date.parse(new Date()) / 1000;

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
        REQUEST_URL: {
            login: "login",
            specialLogin: "specialLogin"
        },
        specialLoginAjax: function(d) {
            var _this = this;
            reqNewAjaxAsync(_this.REQUEST_URL.specialLogin, d).then(function(res) {
                var reData = res.data;
                if (res.code == 1) {
                    localStorage.setItem('userCode', reData.userCode);
                    localStorage.setItem('userId', reData.userId);
                    localStorage.setItem('userImg', reData.userImg);
                    localStorage.setItem('userName', reData.userName);
                    localStorage.setItem('roleName', reData.roleName);
                    localStorage.setItem('scCmsNewPermissions', JSON.stringify(reData.scCmsNewPermissions));
                    location.href = "index.html";
                } else {
                    layer.msg(res.msg)
                }
            });
        },
        sendSubmit: function() {
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
            var _this = this;
            var url = login.REQUEST_URL.login;
            var data = {
                'usercode': user.val(),
                'password': code.val()
            };
            reqNewAjaxAsync(url, data).then(function(reData) {
                layer.msg(reData.msg);
                if ($("#remember").attr("checked") == "checked") {
                    //是否有一个月
                    var isMonthOld = timestamp + 60 * 60 * 24 * 30;
                    if (isNull(isMonthNew)) {
                        //保存一个月后的时间
                        localStorage.setItem("isMonthAdmin", isMonthOld);
                    }
                    //保存账户密码
                    localStorage.setItem("usernameAdmin", user.val());
                    localStorage.setItem("passwordAdmin", code.val());
                } else {
                    //清空
                    localStorage.setItem("isMonthAdmin", "");
                    localStorage.setItem("usernameAdmin", "");
                    localStorage.setItem("passwordAdmin", "");
                }
                if (reData.code == 1) {
                    localStorage.setItem('userCode', user.val());
                    localStorage.setItem('userId', reData.data.userId);
                    localStorage.setItem('userImg', reData.data.userImg);
                    localStorage.setItem('userName', reData.data.userName);
                    localStorage.setItem('roleName', reData.data.roleName);
                    localStorage.setItem('scCmsNewPermissions', JSON.stringify(reData.data.scCmsNewPermissions));
                    location.href = "index.html";
                } else {
                    layer.msg(reData.msg);
                }
            });
        }
    };

    //禁止输入空格
    user.keyup(function() {
        $(this).val($(this).val().replace(/\s/g, ""));
    });
    //监听回车事件
    code.keyup(function(e) {
        $(this).val($(this).val().replace(/\s/g, ""));
        if (e && e.keyCode == 13) {
            login.sendSubmit();
        }
    });
    //提交
    sendSubmit.click(function() {
        login.sendSubmit();
    });

    // 判断是否其他后台登录
    if (!isNull(key)) {
        login.specialLoginAjax({
            "key": GetQueryString("key"),
            "value": GetQueryString("value")
        });
    }

    //jsover
});