$(function() {
    // 判断是否为手机访问
    var u = navigator.userAgent;
    var isPhone = /Android|webOS|iPhone|iPod|iPad|pad|BlackBerry/i.test(u);
    // 
    if (isPhone) {
        var newUrl=window.location.href;
        var commonUrl="http://share.izxcs.com/toutiao/index.html#/";
        // var commonUrl='http://192.168.14.104:8080/#/';
        var url;
        if(newUrl.indexOf('articleDetail')!=-1){
            url=commonUrl+'newsInfo/'+GetQueryString("articleId");
        }else if(newUrl.indexOf('imgDetail')!=-1){
            url=commonUrl+'pictures/'+GetQueryString("articleId");
        }else if(newUrl.indexOf('quesDetail')!=-1){
            url=commonUrl+'answerInfo/'+GetQueryString("articleId");
        }else if(newUrl.indexOf('voteDetail')!=-1){
            url = "http://share.izxcs.com/toutiao/index.html#/home";
            // url= "http://192.168.14.104:8080/#/home";
        }else if(newUrl.indexOf('videoDetail')!=-1){
            url=commonUrl+'videoInfo/'+GetQueryString("articleId");
        }else{
            url='http://share.izxcs.com/toutiao/index.html#/home';
            // url='http://192.168.14.104:8080/#/home';
        }
        location.href = url;
        return false;
    }
    //首页初始化
    indexInit();
    //登录初始化
    loginInit();
    //第三方登录初始化
    qcLoginInit();

    // 初始化加载,默认回到顶部
    document.body.onload = function() {
        setTimeout(function() {
            document.body.scrollTop = 0
        }, 600);
    };
    //浏览器滚动事件
    $(document).scroll(function() {
        var wTop = $(window).scrollTop();
        if (wTop > 500) {
            $("#scrollTop").fadeIn(500);
        } else {
            $("#scrollTop").fadeOut(500);
        }
    });
    // 返回顶部
    $("#scrollTop").click(function() {
        $("body,html").animate({
            "scrollTop": 0
        }, 500);
    });

    // 点击详情页的编辑评论效果
    if(window.location.href.indexOf("voteDetail")>0){
        $(".writerimg").hide();
        $(".fenxiangimg").css("marginTop","0");
    }
    $(".writerimg").click(function(){
        // 如果是问答详情页，就定位编辑器
        if(window.location.href.indexOf("quesDetail")>0){
            var editor=$("#editor").offset().top-50;
            console.log(22);
            $("body,html").animate({
                "scrollTop": editor,
            }, 500);
        }else{
            var commonEditH=$("#commonEdit").offset().top-50;
            $("body,html").animate({
                "scrollTop": commonEditH,
            }, 500);
        }
    })
    // 导航选中
    $("#navUl").on("click", "li", function() {
        var type = $(this).find("a").html();
        localStorage.setItem("nav", type || "首页");
        localStorage.setItem("more", "");
    });
    $("#navUl").on("click", ".nav_box a", function(e) {
        e.stopPropagation();
        var type = $(this).html();
        localStorage.setItem("nav", "更多");
        localStorage.setItem("more", type || "");
    });
    // 点击logo，设置缓存为首页
    $(".pageLogo,#indexA").click(function() {
        localStorage.setItem("nav", "首页");
    });
    $("#navChildA").click(function() {
        localStorage.setItem("nav", $(this).html());
    });
    // 点击搜索跳转搜索页
    $("#searchI").click(function() {
        if(isNull($("#searchTxt").val())){ 
            location.href = 'search.html?search=智享头条'
        }else{
            location.href = 'search.html?search=' + $("#searchTxt").val();
        }
    });
    // 初始化回到首页
    function indexInit() {
        var flag = localStorage.getItem("flag") || false;
        if (isNull(flag)) {
            localStorage.setItem("flag", "1");
            localStorage.setItem("nav", "首页");
            location.href = "index.html";
        }
    }
    // 登录初始化
    function loginInit() {
        var username = localStorage.getItem("newsUsername");
        var password = localStorage.getItem("newsPassword");
        var subscriptionImgUrl = localStorage.getItem('subscriptionImgUrl');
        var subscriptionName = localStorage.getItem('subscriptionName');
        //判断是否保存账户密码
        if (!isNull(username) && !isNull(password)) {
            $("#usercodeInp").val(username);
            $("#passwordInp").val(password);
            $("#remember").addClass("active");
        } else {
            $("#usercodeInp").val('');
            $("#passwordInp").val('');
        }
        if (!isNull(subscriptionImgUrl)) {
            //隐藏登录注册
            $(".userOperate").hide();
            //显示用户登录的信息
            $(".userInfo").show();
            $("#avatarImg").attr("src", subscriptionImgUrl);
        }
        if (!isNull(subscriptionName)) {
            //隐藏登录注册
            $(".userOperate").hide();
            //显示用户登录的信息
            $(".userInfo").show();
            $("#username").html(subscriptionName);
        }
    }
    // 第三方登录操作
    function qcLoginInit() {
        QC.Login({
            btnId: "loginA",
            //用户需要确认的scope授权项，可选，默认all
            scope: "all",
            //按钮尺寸，可用值[A_XL| A_L| A_M| A_S|  B_M| B_S| C_S]，可选，默认B_S
            size: "A_M"
        }, function(reqData, opts) { //登录成功
            //根据返回数据，更换按钮显示状态方法
            QC.Login.getMe(function(openId, accessToken) {
                reqAjaxAsync("cms_new/qqafterlogin", {
                    accessToken: accessToken
                }).done(function(res) {
                    if (isNull(res.data)) {
                        return layer.msg("数据异常，请联系管理员!");
                    }
                    if (res.code == 10001) {
                        QC.Login.signOut();
                        // QC.Login.check()
                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem('qqName', res.data.scCmsqqUserNickName);
                        localStorage.setItem('qqImgUrl', res.data.scCmsqqUserAvatarurl30);
                        location.href = "bind.html";
                    }
                    if (res.code == 10002) {
                        //显示用户登录的信息
                        $(".userInfo").show();
                        //隐藏登录注册
                        $(".userOperate").hide();
                        $("#loginModal").modal("hide");
                        $("#avatarImg").attr('src', res.data.userImg);
                        $("#username").html(res.data.userName);
                        $("#exit").attr("href", "javascript:QC.Login.signOut();");
                        //存储缓存
                        localStorage.setItem('subscriptionImgUrl', res.data.userImg);
                        localStorage.setItem('subscriptionName', res.data.userName);
                    }
                });
            });
        }, function(opts) { //注销成功
            console.log("注销成功");
        });
    }
    // 详情页的微信分享
    $(".weixin").hover(function(){$(".erweima").show()},function(){$(".erweima").hide()});
    // js over
});

//是否关注接口函数
function isFollowState(obj, callback) {
    reqAjaxAsync("concern/" + obj.url, obj.data).done(function(res) {
        layer.msg(res.msg);
        if (res.code == 1) {
            $('#FollowAuthor').toggleClass('active');
            callback();
        }
    })
}

//我的作家信息
function getUserInfo() {
    var loginUserId = localStorage.getItem('userId');
    reqAjaxAsync('cms_new/querySubscriptionDetail', {
        byVisitUser: GetQueryString('userId'),
        userId:loginUserId
    }).done(function(res) {
        if (res.code != 1) {
            return layer.msg(res.msg)
        };
        if (res.code == 1) {
            var data = res.data || '';
            $('#myHeadIcon').attr('src', data.scSysUser.userpic || '');
            $('#myIntroName').html(data.scSysUser.username);
            var str = '智享头条' + authorType(data.writerRank);
            $('#myAuthorType').html(str);
            $('#myIntroTalk').html(data.scSysUser.signature);
            $('#myFollowNum').html(data.followNum);
            $('#enshrinedNum').html(data.enshrinedNum);
            $("#topFollowBtn").attr("myid",data.scSysUser.id);  
            if(loginUserId==data.scSysUser.id){
                $('#topFollowBtn').hide();
            }else{
                $('#topFollowBtn').show();
                if(data.scSysUser.hasConcern==0){
                    $('#topFollowBtn').html('筑城').removeClass('active').attr('isFollow', 0);
                }else{
                    $('#topFollowBtn').html('已筑城').addClass('active').attr('isFollow', 1);
                }
            }
        }
    })
}
