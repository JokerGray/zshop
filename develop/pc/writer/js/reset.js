var layer = layui.layer;
$(function() {
    var newpass1 = $("#newpass1");
    var newpass2 = $("#newpass2");
    var username = localStorage.getItem("username") || "";
    var reset = {
        sendSubmit: function() {
            var Id = localStorage.getItem("id");
            if (newpass1.val() == "" || newpass2.val() == "") {
                layer.msg('请输入新密码和确认密码！', {
                    icon: 2,
                    shade: [0.1, '#fff'],
                    offset: '20%'
                }, function() {
                    newpass1.val().trim() == "" ? newpass2.focus() : newpass1.focus();
                });
                return false;
            } else if (newpass1.val() == newpass2.val()) {
                $.ajax({
                    type: "POST",
                    url: "/zxcity_restful/ws/rest",
                    dateType: "json",
                    data: {
                        "cmd": "user/updateScSysUser",
                        "version": "1",
                        "data": "{'username': '" + username + "','password': '" + newpass1.val() + "','id': " + Id + "}"
                    },
                    beforeSend: function(request) {
                        layer.load(0, {
                            shade: [0.1, '#fff']
                        });
                    },
                    success: function(re) {
                        layer.closeAll('loading');
                        if (re.code == 1) {
                            location.href = 'login.html';
                        } else {
                            layer.msg(re.msg);
                        }
                    },
                    error: function() {
                        layer.closeAll('loading');
                        layer.msg("系统繁忙,请稍后再试");
                    }
                });
            } else {
                layer.msg("两次密码不一致")
            }
        }
    };

    //禁止输入空格
    newpass1.keyup(function() {
        $(this).val($(this).val().replace(/\s/g, ""));
    });

    newpass2.keyup(function() {
        $(this).val($(this).val().replace(/\s/g, ""));
    });

    //提交
    $("#sendSubmit").click(function() {
        reset.sendSubmit();
    })
});