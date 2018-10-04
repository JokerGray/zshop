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
    function quit(){
        var q= reqAjax(cmd,param);
            location.href="http://localhost:1088/zxcity_yypt/login.html"
    }
    $('#quit').on('click',quit)
    $('#contorl-quit').on('click',quit)
})