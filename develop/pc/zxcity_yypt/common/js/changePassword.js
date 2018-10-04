$(function(){

    var userImg = sessionStorage.getItem('userImg') || "";
    var username = sessionStorage.getItem('username') || "";
    var apikey = sessionStorage.getItem('apikey') || "test";
    var version = sessionStorage.getItem('version') || "1";
    var userId = sessionStorage.getItem("userId") || "";
    var password = sessionStorage.getItem("password") || "";
    var param = "{'apikey':'"+ apikey +"'}"; //退出入参
    var cmd = "operations/loginout"; //退出接口
    var cmdChange="operations/modifyUserPwd"//修改密码接口
    function saveParameter(){
        var passStr = $('#oldpassword').val();
        var newStr = $('#newpassword').val();
        var conStr = $('#newpasswords').val();
        console.log(password)
        if(newStr==''||passStr==''||conStr==''){
            layer.msg('请输入密码')
        }else if(newStr!=conStr){
                layer.msg('两次密码不相同')
        }else if(passStr!=password){
                layer.msg('原密码输入错误')
        }else{
           layer.msg("修改成功", function() {
            var d1 = {
                        id:userId,
                        oldPwd:password,
                        newPwd:newStr,
                        confirmPwd:conStr
                    }

            d1 = JSON.stringify(d1)
            var t= reqAjax(cmdChange,d1);
            location.href="login.html"
           $('#saveParameter').attr('data-dismiss','modal')
         });
        }
    }
    $('body').on('click','#saveParameter',saveParameter)
})