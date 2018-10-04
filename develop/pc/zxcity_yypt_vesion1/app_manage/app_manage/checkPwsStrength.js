(function($){
    //密码强度校验
    function checkPwdStrength(pwd){
        //判断字符是哪个类型
        function CharMode(iN){
            if (iN>=48 && iN <=57) //数字
                return 1;
            if (iN>=65 && iN <=90) //大写
                return 2;
            if (iN>=97 && iN <=122) //小写
                return 4;
            else
                return 8;
        }
        //bitTotal函数
        //计算密码模式
        function bitTotal(num){
            var mode = 0;
            for (i=0;i<4;i++){
                if (num & 1) {
                    mode++;
                }
                num>>>=1;
            }
            return mode;
        }

        var modes = 0, strength = 0;
        if(pwd.length >= 6){
            for(var i=0; i<pwd.length; i++){
                modes|=CharMode(pwd.charCodeAt(i));
            }
            strength =  bitTotal(modes);
        }

        return strength;
    }

//校验密码强度
    $("#password").keyup(function(){
        var strength = checkPwdStrength($(this).val());
        switch (strength) {
            case 1:
                $(".pwd-strength .level1").addClass("active").siblings().removeClass("active");
                break;
            case 2:
                $(".pwd-strength .level3").removeClass("active").siblings().addClass("active");
                break;
            case 3:
                $(".pwd-strength .s-level").addClass("active");
                break;
            default:
                $(".pwd-strength .s-level").removeClass("active");

        }
    });
})(jQuery);
