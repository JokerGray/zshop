$(function() {
    //判断身份显示头像
    var userImg = yyCache.get('userImg');
    var username = yyCache.get('username');
    var apikey = yyCache.get('apikey',"test");
    var version = yyCache.get('version', "1");
    var userId = yyCache.get("userId");
    var password = yyCache.get("password");
    var userno = yyCache.get("userno");
    var nimToken = yyCache.get("nimToken");
    var name = yyCache.get("name");
    var roleId = yyCache.get("roleIds"); // 角色数组
    var isSames;
    var USER_URL = {
        LOGINSERVICE : 'operations/loginCustomerServiceAddOnline'   //客服登陆在线状态
    }

    //点击登录的时候调接口
    function getService(){
        var param = {
            'usercode':username,
            'username':name,
            'userid':userId
        }
        reqAjaxAsync(USER_URL.LOGINSERVICE,JSON.stringify(param)).done(function(res){
            if(res.code == 1){

            }else{
                layer.msg(res.msg);
            }
        })
    }

    function isSame(names){
        var list = $(".menu-head li",parent.document);
        var listarr=[];
        for(var i=0;i<list.length;i++){
            listarr.push(list.eq(i).find(".head-txt").text());
        }
        if(listarr.indexOf(names)==-1){
            getService();
        }
    }

    //判断nimToken是否为空来设置聊天
    if(nimToken && nimToken != "" && nimToken != 'null' && roleId[0]=='SERVICE_ROLE_ID'){ //必须是客服
        console.log("云信登录pub");
        console.log("nimToken:"+nimToken);
        document.cookie = "uid="+username.toLocaleLowerCase()+";/zxcity_yypt";
        document.cookie = "sdktoken="+ nimToken +";/zxcity_yypt";
        $("#yxa").attr("src","web_chat/3rd/Web_SDK_Base_v2.4.0.js");
        $("#yxb").attr("src","web_chat/3rd/Web_SDK_NIM_v2.4.0.js");
        $("#yxc").attr("src","web_chat/im/js/config.js");
        $("#yxd").attr("src","web_chat/im/js/md5.js");
        $("#yxe").attr("src","web_chat/im/js/util.js");
        $(".navchat").removeClass("hide");
        //聊天相关
        var isHide = $("#contorl-wechat").attr("class");
        console.log(isHide+':isHide')
        if(isHide == "navchat"){
            console.log("可以聊天")



        //点击在线聊天
            $("#contorl-wechat").click(function(){
                var key = $(this).text();
                var url = $(this).attr("data-href");
                
                admin.addOpen(key, url); 
                // $(".navchat>span").show();
                $(".message").hide();
                $("#contorl-wechat").removeClass("navchat");
                isSame('客服工作台');
            });



            $(".message").click(function(){
                //  $(".navchat>span").show();
                var key = $(this).prev().text();
                var url = $(this).parent().attr("data-href");
                
                admin.addOpen(key, url);  
                $(".message").hide();
                $("#contorl-wechat").removeClass("navchat");
            });

            //定时获取消息

            function getMessage(){
                var number = $("#webindex").contents().find(".u-unread").text();
                if(number != 0){
                    $(".message").text('new');
                    $(".message").show();
                }
            }


            window.onload=function(){
                getMessage();
            };

            //设置定时30s加载一次
            var ref = "";
            ref = setInterval(function(){
                getMessage();
            },30000);

            //点击聊天关闭按钮
            $(".smallicon").click(function(){
                layer.confirm(
                    "确认关闭?",
                    {icon: 3, title:'提示'},
                    function(index){
                        $(".navchat>span").hide();
                        //   $("#webchatBody").addClass("hide");
                        $("#contorl-wechat").addClass("navchat");
                    })
            });
        }
    }else{
        console.log("nimToken:"+nimToken);
    }

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //点击跳到相应页面(客服首页专用)
    $(".down-box").on("click",".downlist .listicon",function(){
        var index = $(this).parent().index();

        if(index==0){
            if(nimToken && nimToken != "" && nimToken != 'null'){
                $("#webicon").removeClass("acv");
                $("#webicon").next("span").css("color","#3b96e5");
                isSame('客服工作台');
                top.window.admin.addOpen("客服工作台", 'web_chat/main.html');
            }

        }else if(index==1){
            top.window.admin.addOpen("工单", 'order/order.html');
        }else if(index==2){
            top.window.admin.addOpen("知识库", 'repository_new/repository_new.html');
        }else if(index==3){
            top.window.admin.addOpen("意见反馈", 'advice_feedback_v2/advice_feedback_v2.html');
        }
    });

    $("body").on('click', '#contorl-quit,#quit', function() {
        $.cookie('uid', null);
        $.cookie('sdktoken', null);
    });
});