$(function() {
    //判断身份显示头像
    var userImg = sessionStorage.getItem('userImg') || "";
    var username = sessionStorage.getItem('username') || "";
    var apikey = sessionStorage.getItem('apikey') || "test";
    var version = sessionStorage.getItem('version') || "1";
    var userId = sessionStorage.getItem("userId") || "";
    var password = sessionStorage.getItem("password") || "";
    var userno = sessionStorage.getItem("userno") || "";
    var nimToken = sessionStorage.getItem("nimToken") || "";
    var param = "{'apikey':'"+ apikey +"'}"; //退出入参
    var cmd = "operations/loginout"; //退出接口
    var salf = "";
    var str = '';
    var str1 = '';
    var idcard = '';

    /*var rootDir = "/zxcity_yypt/";
    var loginPage = "login.html";

    function getLoginPath() {
        return rootDir + loginPage;
    }*/
    
    //判断新用户能否进入页面
   /* function isTrue() {
        *//*var menuHidVal = $("#menuHid").val();*//*
        if (isNull(subscriptionType) && menuHidVal == "register_type") {
            return false;
        } else if (isNull(subscriptionType) && menuHidVal == "register_buss") {
            return false;
        } else if (isNull(subscriptionType) && menuHidVal == "register_single") {
            return false;
        } else if (!isNull(subscriptionType)) {
            return false;
        }
        return true;
    }*/


    //判断是否登录
    if (isNull(userId)||isNull(userno)){
        layer.msg("登录异常，请重新登录!", function() {
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userImg');
            sessionStorage.removeItem('apikey');
            sessionStorage.removeItem('resourceTree');
            sessionStorage.removeItem('padpid');
            sessionStorage.removeItem('padpaid');
            sessionStorage.removeItem('userno');
            sessionStorage.removeItem('changeId');
            sessionStorage.removeItem('dataType');
            sessionStorage.removeItem('type');
            sessionStorage.removeItem('typeid');
            sessionStorage.removeItem('state');
            sessionStorage.removeItem('giveRoleId');
            sessionStorage.removeItem('merchantid');
            sessionStorage.removeItem('selectRoleId');
            sessionStorage.removeItem('selectIsadminrole');
            sessionStorage.removeItem('localUrl');
            sessionStorage.removeItem('nimToken');
            sessionStorage.removeItem('mesNum');
            top.location.href = "login.html";
        });
    };

    if(userImg == "" || userImg == null){
        $("#user-pic").attr("src","common/image/logo.png");
    }else{
        $("#user-pic").attr("src",userImg);
    }

    if(username == ""){
        $("#user-name").html(" ");
    }else{
        $("#user-name").html(username);
    };



    //退出登录清空id
       $("body").on('click', '#contorl-quit,#quit', function() {
        var res = reqAjax(cmd,param);
        if(res.code == 1){
           sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userImg');
            sessionStorage.removeItem('apikey');
            sessionStorage.removeItem('resourceTree');
            sessionStorage.removeItem('padpid');
            sessionStorage.removeItem('padpaid');
            sessionStorage.removeItem('userno');
            sessionStorage.removeItem('changeId');
            sessionStorage.removeItem('dataType');
            sessionStorage.removeItem('type');
            sessionStorage.removeItem('typeid');
            sessionStorage.removeItem('state');
            sessionStorage.removeItem('giveRoleId');
            sessionStorage.removeItem('merchantid');
            sessionStorage.removeItem('selectRoleId');
            sessionStorage.removeItem('selectIsadminrole');
            sessionStorage.removeItem('localUrl');
            sessionStorage.removeItem('nimToken');
            sessionStorage.removeItem('mesNum');
           $.cookie('uid', null);
            $.cookie('sdktoken', null);
            top.location.href = 'login.html';
        }else{
            layer.msg(res.msg);
        }
    });

//判断当前页面是否在权限树里限制自定义的url输入
//  var localHref = location.href;
//  var localHrefArr=localHref.split('/')
//  var localHrefArrLength=localHrefArr.length-1
//  localHref=localHrefArr[localHrefArrLength]
//  localHref=localHref.split('?')
//  var thisRresourceTree=sessionStorage.getItem('resourceTree');
//  thisRresourceTree=JSON.parse(thisRresourceTree)
//  var arr=[];
//  if(thisRresourceTree){
//  for(var i=0;i<thisRresourceTree.length;i++){
//      var children =thisRresourceTree[i].children;
//      for(var j=0;j<children.length;j++){
//          var childrenUrl = children[j].url;
//          arr.push(childrenUrl)
//          }
//      }
//      // console.log(localHref[0]);
//      // console.log(arr)
//      if((arr.indexOf(localHref[0])==-1||0)&&(localHref[0]!="login_success.html"))
//          layer.msg("登录异常，请重新登录!", function() {
//      sessionStorage.removeItem('userId');
//          sessionStorage.removeItem('username');
//          sessionStorage.removeItem('userImg');
//          sessionStorage.removeItem('apikey');
//          sessionStorage.removeItem('resourceTree');
//          sessionStorage.removeItem('padpid');
//          sessionStorage.removeItem('padpaid');
//      location.href = getLoginPath();});
//  }else{
//
//      console.log('thisRresourceTree不存在')
//  }
});