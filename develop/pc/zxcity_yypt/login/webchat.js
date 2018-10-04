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
    //判断nimToken是否为空来设置聊天
    /*if(nimToken && nimToken != "" && nimToken != 'null'){
        console.log("云信登录pub");
        document.cookie = "uid="+username.toLocaleLowerCase()+";/zxcity_yypt";
        document.cookie = "sdktoken="+ nimToken +";/zxcity_yypt";
        $("#yxa").attr("src","web_chat/3rd/Web_SDK_Base_v2.4.0.js");
        $("#yxb").attr("src","web_chat/3rd/Web_SDK_NIM_v2.4.0.js");
        $("#yxc").attr("src","web_chat/im/js/config.js");
        $("#yxd").attr("src","web_chat/im/js/md5.js");
        $("#yxe").attr("src","web_chat/im/js/util.js");
        $(".navchat").removeClass("hide");
        $("#webindex").attr("src","web_chat/main.html");
        //聊天相关
        var isHide = $("#contorl-wechat").attr("class");
        console.log(isHide+':isHide')
        if(isHide == "ml40 navchat"){
            console.log("可以聊天")
            //点击即时聊天
            $("#contorl-wechat").click(function(){
                $(".navchat>span").show();
                $("#webchatBody").removeClass("hide");
                $(".message").hide();
            });
            $(".message").click(function(){
                $(".navchat>span").show();
                $("#webchatBody").removeClass("hide");
                $(".message").hide();
            });

            //定时获取消息

            function getMessage(){
                var number = $("#webindex").contents().find(".u-unread").text();
                if(number != 0){
                    $(".message").text(number+'条消息');
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
                $(".navchat>span").hide();
                $("#webchatBody").addClass("hide");
            });
        }
    }else{
        console.log("nimToken:"+nimToken);
    }*/

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    if(nimToken && nimToken != "" && nimToken != 'null'){
        document.cookie = "uid="+username.toLocaleLowerCase()+";/zxcity_yypt";
        document.cookie = "sdktoken="+ nimToken +";/zxcity_yypt";
        $("#yxa").attr("src","web_chat/3rd/Web_SDK_Base_v2.4.0.js");
        $("#yxb").attr("src","web_chat/3rd/Web_SDK_NIM_v2.4.0.js");
        $("#yxc").attr("src","web_chat/im/js/config.js");
        $("#yxd").attr("src","web_chat/im/js/md5.js");
        $("#yxe").attr("src","web_chat/im/js/util.js");
        $(".navchat").removeClass("hide");
        var isHide = $("#contorl-wechat").attr("class");
        console.log(isHide+':isHide')
        if(isHide == "ml40 navchat"){
            console.log("可以聊天")

            //点击即时聊天
            $("#contorl-wechat").click(function(){
                /*$(".navchat>span").show();*/
                $(".message").hide();
                var clas = $("#contorl-wechat a").attr("class");
                var isShow = $("#layer-layui1").index();
                if(clas == "weba" && isShow == -1){
                    layer.open({
                        type: 2,
                        title: ['', 'background:#f3f9ff;color:#000;height: 22px;'],
                        skin: 'layer-ext-myskin',
                        area: ['1006px', '652px'],
                        offset:['58px','380px'],
                        shade: 0,
                        closeBtn: 0,
                        shadeClose: false,
                        content: 'web_chat/main.html',
                        success:function(layero, index){
                        $(".layui-layer-title").after('<span class="layui-layer-setwin minicon"><a class="layui-layer-min" href="javascript:;">一</a></span>');
                        $(".layui-layer-title").parents(".layui-layer").attr("data-type","show");
                            $(".layui-layer-setwin").click(function(){
                            $(this).parents(".layui-layer").addClass("webtip hide");
                            $(this).parents(".layui-layer").attr("data-type","hide");
                        })
                        }
                    });
                    $("#contorl-wechat a").attr("class","webacve");
                }

                var isTip = $(".webtip").attr("data-type");

                if(clas == "webacve" && isTip == "hide"){
                    $(".webtip").removeClass("hide");
                    $(".webtip").attr("data-type","show");
                };
                if(clas == "webacve" && isTip == "show"){
                    $(".webtip").addClass("hide");
                    $(".webtip").attr("data-type","hide");
                };
            });
            $(".message").click(function(){
                $(".message").hide();
            //    var clas = $("#contorl-wechat a").attr("class");
                var isTip = $(".webtip").attr("data-type");
                if(clas == "webacve" && isTip == "hide"){
                    $(".webtip").removeClass("hide");
                    $(".webtip").attr("data-type","show");
                }
            });

            //定时获取消息

            function getMessage(){
                var number = sessionStorage.getItem("mesNum") || "";
                var isTip = $(".webtip").attr("data-type");
                if(isTip == "hide"){
                    if(number == ""){
                        $(".message").hide();
                    }else{
                        if(number != 0){
                            $(".message").text(number+'条消息');
                            $(".message").show();
                            console.log(number)
                        }
                    }
                }
            }


            window.onload=function(){
                getMessage();
            };

            //设置定时10s加载一次
            var ref = "";
            ref = setInterval(function(){
                getMessage();
            },10000);
        }

    }

    $("body").on('click', '#contorl-quit,#quit', function() {
        $.cookie('uid', null);
        $.cookie('sdktoken', null);
    });
});