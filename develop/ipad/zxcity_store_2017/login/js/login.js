(function($){
    var REQUEST_URL = {
        'login':'backUser/login'
    };

    function login(){
        var usercode = $.trim($("#usercode").val()),
            password = $.trim($("#password").val());
        if(usercode == ""){
            layer.msg("请输入你的登录账号！");
            return;
        }

        if(password == ""){
            layer.msg("请输入你的登录密码！");
            return ;
        }

        var param = {
            'usercode':usercode,
            'password':password
        };
        reqAjaxAsync(REQUEST_URL['login'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                sessionStorage.setItem("apikey", res.data.apikey);
                var oShopInfo = res.data.ScShopInfo,
                    oUserInfo = res.data.ScSysBackUser,
                    oRoleInfo = res.data.ScSysRole[0];

                sessionStorage.setItem("merchantId", oUserInfo.merchantId);
                sessionStorage.setItem("backUserId", oUserInfo.id);
                sessionStorage.setItem("userId", oUserInfo.userId);
                sessionStorage.setItem("usercode", oUserInfo.usercode);
                sessionStorage.setItem("username", oUserInfo.username);
                sessionStorage.setItem("userImg", oUserInfo.userImg);
                sessionStorage.setItem("roleCode", oRoleInfo.roleCode);

                if(oShopInfo.length > 0){
                    if(oShopInfo.length == 1){
                        sessionStorage.setItem("shopId", oShopInfo[0].id);
                        sessionStorage.setItem("shopName", oShopInfo[0].shopName);
                        layer.closeAll();
                        parent.location.reload();
                    }else{
                        var sHtml = '<div class="list-box"><div class="list-inner"><ul>';
                        for(var i=0; i<oShopInfo.length; i++){
                            sHtml += '<li id="'+oShopInfo[i].id+'" data-name="'+oShopInfo[i].shopName+'">'+oShopInfo[i].shopName+'</li>';
                        }
                        sHtml += '</ul></div></div>';
                        layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: false,
                            content:sHtml,
                            success: function(layero, index){
                                $(".list-box ul>li").click(function(){
                                    sessionStorage.setItem("shopId", $(this).attr("id"));
                                    sessionStorage.setItem("shopName", $(this).attr("data-name"));
                                    layer.closeAll();
                                    parent.location.reload();
                                });
                            }
                        });
                    }
                }
            }else{
                layer.msg(res.msg);
            }
        });
    }

    $("#loginBtn").click(function(){
        login();
    });
    // 标题栏回车事件
    $("#usercode, #password").keypress(function(event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === 13)  {
            event.preventDefault();
            login();
        }
    });

})(jQuery);
