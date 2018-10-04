(function($){
    var phoneNum = "", uid = "";

    $(".check-form .get-check-code").click(function(){
        phoneNum = $(".check-form input[name=phoneNum]").val();
        if($.trim(phoneNum) == ''){
            alert('请输入手机号！');
            return ;
        }
        CommonUtil.getPhoneCodeNum(this, phoneNum);
    });

    //身份验证-
    function checkValidate(){
        phoneNum = $(".check-form input[name=phoneNum]").val();
        var checkCode = $(".check-form input[name=checkCode]").val();
        if($.trim(phoneNum) == ''){
            alert('请输入手机号！');
            return ;
        }
        if($.trim(checkCode) == ''){
            alert('请输入验证码！');
            return ;
        }
        var jsonData = "{'usercode':'"+phoneNum+"', 'captcha':'"+checkCode+"'}";
        var res = CommonUtil.ajaxData('user/checkCode', jsonData);
        if(res.code == 1){
            uid = res.data.id;
            $(".state-bar ul>li:nth-child(3)").addClass("active");
            $(".state-bar ul>li:nth-child(2)").addClass("state2").removeClass("state1");
            $(".state-bar ul>li:nth-child(4)").addClass("state1");
            $(".form-content .set-new-pwd").removeClass("hidden").siblings().addClass("hidden");
        }else{
            alert(res.msg);
        }
    }
    //设置新密码
    function setNewPassword(){
        var pwd = $(".set-new-pwd input[name=newPwd]").val(),
            pwd2 = $(".set-new-pwd input[name=newPwd2]").val();
        if(pwd !== pwd2){
            alert("两次密码输入的不一致！");
            return ;
        }
        var jsonData = "{'id':"+uid+", 'password':'"+pwd+"'}";
        var res = CommonUtil.ajaxData('user/updateScSysUser', jsonData);
        var sHtml = ''
        if(res.code == 1){
            sHtml = '<div class="success"><i></i><span>恭喜您，新密码设置成功,赶紧登录吧！</span></div>';
        }else{
            sHtml = '<div class="failure"><i></i><span>抱歉设置失败，请刷新页面重新操作！</span></div>';
            console.error(res.msg);
        }
        $(".state-bar ul>li.state-item").addClass("active");
        $(".state-bar ul>li.line").addClass("state2").removeClass("state1");``

        $(".form-content .set-state").html(sHtml).removeClass("hidden").siblings().addClass("hidden");
    }




    $(".check-form .submit-btn").click(function(){
        checkValidate();
    });

    $(".set-new-pwd .submit-btn").click(function(){
        setNewPassword();
    });

})(jQuery);
