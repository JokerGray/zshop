//获取缓存 通行证码
var apikey = localStorage.getItem('apikey') || "";
//获取缓存 版本号
var version = localStorage.getItem('version') || "1";

var BASE_URL = window.location.protocol + "//" + window.location.host;
var pathName = window.location.pathname,
    projectFile = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
/**常量*/
var sysConfig = {
    //手机号验证正则表达式
    'REG_MOBILE': /^[1]([3][0-9]{1}|[5][0-9]{1}|[7][0-9]{1}|[8][0-9]{1}|[4][0-9])[0-9]{8}$/,
    //非零正整数
    'REG_NUM_UP_ZERO': /^[1-9]\d*$/,
    //中文
    'REG_CN': /[\u4e00-\u9fa5]/,
    //手机验证码再次获取间隔时间
    'DELAY_TIME': 60
}

/**登录注册相关事件*/
function LoginBoxFun() {}
LoginBoxFun.prototype = {
    constructor: LoginBoxFun,
    showLoginInfo: function() {
        var userpic = localStorage.getItem('userpic'),
            username = localStorage.getItem('usercode');
        $(".header .login-info .user-pic").html('<img src="' + userpic + '">');
        $(".header .login-info .username").html(username);
        $(".header .login-info").removeClass("hidden").siblings().addClass("hidden");
    },
    toLogin: function() {
        var formData = decodeURIComponent($("form.login").serialize().split("&")).split(",");
        var tempJson = {};
        for (var k in formData) {
            var arr = formData[k].split("=");
            tempJson[arr[0]] = arr[1];
        }

        var jsonData = "{'usercode':'" + tempJson.loginName + "','password':'" + tempJson.loginPassword + "'}";
        var res = CommonUtil.ajaxData('user/login', jsonData);
        if (res.code == 1) {
            var userInfo = res.data.scSysUser;
            localStorage.setItem('apikey', res.data.apikey);
            localStorage.setItem('usercode', userInfo.usercode);
            localStorage.setItem('userpic', userInfo.userpic);
            location.reload();
        } else {
            alert(res.msg);
        }
    },
    toRegister: function() {
        var formData = decodeURIComponent($("form.register").serialize().split("&")).split(",");
        var tempJson = {};
        for (var k in formData) {
            var arr = formData[k].split("=");
            tempJson[arr[0]] = arr[1];
        }

        var jsonData = "{'usercode':'" + tempJson.registName + "','captcha':'" + tempJson.registerCode + "', 'password':'" + tempJson.registPassword + "','cityId':" + CommonUtil.cityId + ", 'cityName':'" + CommonUtil.cityName + "'}";
        var res = CommonUtil.ajaxData('user/reg', jsonData);
        if (res.code == 1) {
            var userInfo = res.data.scSysUser;
            localStorage.setItem('apikey', res.data.apikey);
            localStorage.setItem('usercode', userInfo.usercode);
            localStorage.setItem('userpic', userInfo.userpic);
            localStorage.setItem('cityId', userInfo.cityId);
            localStorage.setItem('cityName', userInfo.cityName);
            location.reload();
        } else {
            alert(res.msg);
        }
    }
};

/**share function**/
function ShareUtil(args) {
    this.wbParams = this.getWbParams(args);
    this.qqParams = this.getQQParams(args);
}
ShareUtil.prototype = {
    constructor: ShareUtil,
    getWbParams: function(args) { //获取微博分享参数
        /**
         * url:分享页面链接
         * searchPic:是否要自动抓取页面上的图片。true|falsetrue:自动抓取,false:不自动抓取。
         * title:分享的文字内容(可选，默认为所在页面的title)
         * language:语言设置：zh_cn|zh_tw
         * pics:分享图片的路径(可选)，多张图片通过"||"分开。
         * width:指定宽度
         * height:指定高度，根据按钮样式的不同而不同
         */
        var wbp = new Object();
        wbp.language = "";
        wbp.title = "";
        wbp.pic = "";
        wbp.appkey = "1547635066";
        wbp.url = window.location.href;
        if (args) {
            if ("undefined" != typeof args.language) {
                wbp.language = args.language;
            }
            if ("undefined" != typeof args.title) {
                wbp.title = args.title;
            }
            if ("undefined" != typeof args.pic) {
                wbp.pic = args.pic;
            }
            if ("undefined" != typeof args.appkey) {
                wbp.appkey = args.appkey;
            }
            if ("undefined" != typeof args.url) {
                wbp.url = args.url;
            }
        }
        var s = [];
        for (var i in wbp) {
            s.push(i + '=' + encodeURIComponent(wbp[i] || ''));
        }
        wbp.wbUrl = s.join('&');
        return wbp;
    },
    getQQParams: function(args) { //获取QQ分享参数
        /**
         * url:可加上来自分享到QQ标识，方便统计
         * desc:分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）
         * title:分享标题(可选)
         * summary:分享摘要(可选)
         * pics:分享图片(可选)
         * flash: 视频地址(可选)
         * site:分享来源(可选) 如：QQ分享
         * style:'203',
         * width:24,
         * height:24
         */
        var qqp = new Object();
        qqp.url = window.location.href;
        qqp.desc = "";
        qqp.title = "";
        qqp.pics = "";
        //qqp.site = "";
        qqp.summary = "";
        qqp.flash = "";
        qqp.style = "202";
        qqp.width = "24";
        qqp.height = "24";
        if (args) {
            if ("undefined" != typeof args.url) {
                qqp.url = args.url;
            }
            if ("undefined" != typeof args.desc) {
                qqp.desc = args.desc;
            }
            if ("undefined" != typeof args.title) {
                qqp.title = args.title;
            }
            if ("undefined" != typeof args.pics) {
                qqp.pics = args.pics;
            }
            //if("undefined" != typeof args.site){
            //	qqp.site = args.site;
            //}
            if ("undefined" != typeof args.summary) {
                qqp.summary = args.summary;
            }
            if ("undefined" != typeof args.flash) {
                qqp.flash = args.flash;
            }
            if ("undefined" != typeof args.style) {
                qqp.style = args.style;
            }
            if ("undefined" != typeof args.width) {
                qqp.width = args.width;
            }
            if ("undefined" != typeof args.height) {
                qqp.height = args.height;
            }
        }
        var s = [];
        for (var i in qqp) {
            s.push(i + '=' + encodeURIComponent(qqp[i] || ''));
        }
        qqp.qUrl = s.join('&');
        return qqp;
    },
    shareWeibo: function() { //分享至微博
        var weiboUrl = 'http://service.weibo.com/share/share.php?';
        weiboUrl += this.wbParams.wbUrl + '&content=utf-8';
        window.open(weiboUrl, '_blank', 'width=615,height=505');
    },
    shareQQ: function() { //分享至QQ
        var qqUrl = 'http://connect.qq.com/widget/shareqq/index.html?';
        qqUrl += this.qqParams.qUrl;
        window.open(qqUrl);
    },
    shareQzone: function() { //分享至QQ空间
        var qqUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        qqUrl += this.qqParams.qUrl;
        window.open(qqUrl);
    }
};
/**commonUtil function*/
function CommonUtil() {}
CommonUtil.prototype = {
    constructor: CommonUtil,
    cityName: "",
    cityId: "",
    shareUtil: new ShareUtil(), //分享
    ajaxData: function(cmd, param) { //ajax请求
        var resData = "";
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dateType: "json",
            async: false,
            data: {
                "cmd": cmd,
                "data": param,
                "version": version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(res) {
                isApikey(res);
                resData = res;
            },
            error: function(res) {
                resData = res;
            }
        });
        return resData;
    },
    getUrlParam: function(name) { //根据参数名获取参数值
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
            return decodeURI(r[2]);
        }
        return "";
    },
    getParams: function() { //获取请求地址中的参数，返回结果为对象
        var url = location.search;
        var params = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                params[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return params;
    },
    enterEventHandler: function(obj, callback) { //输入框回车事件
        obj.keydown(function(event) {
            if (event.keyCode == 13) {
                callback();
            }
        });
    },
    HTMLDecodeHandler: function(str) { //内容显示解码
        if (str != null) {
            var s = str.replace(/&amp;/g, "&");
            s = s.replace(/&lt;|&amp;lt;/g, "<");
            s = s.replace(/&gt;|&amp;gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/'/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/ <br>/g, "\n");
            return s;
        }
        return str;
    },
    getLocationInfo: function() { //获取登录人信息
        var _that = this;
        $.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function() {
            var provinceName = remote_ip_info["province"];
            _that.cityName = remote_ip_info["city"];
            $.get(BASE_URL + projectFile + '/common/scripts/sc_base_area.json').done(function(data) {
                for (var k in data.RECORDS) {
                    if (data.RECORDS[k].shortname.search(_that.cityName) > -1) {
                        _that.cityId = data.RECORDS[k].code;
                        break;
                    }
                }
            });
        });
    },
    getPhoneCodeNum: function(el, phoneNum) { //获取手机验证码
        var _that = el;
        _that.sec = _that.sec ? _that.sec : sysConfig.DELAY_TIME;
        if ($.trim(phoneNum) == "") {
            alert("请输入手机号！");
            return;
        }
        //校验手机号是否正确
        if (!sysConfig.REG_MOBILE.test(phoneNum)) {
            alert('请输入正确有效的手机号码！');
            clearTimeout(_that.t);
            $(_that).html("免费获取验证码");
            delete _that.t;
            delete _that.sec;
            return;
        }
        if (_that.t) {
            //倒计时范围内重复点击提示
            alert("请1分钟后再试");
            return;
        } else {
            //调用获取手机验证码的接口
            var jsonData = "{'usercode':'" + phoneNum + "'}";
            var res = CommonUtil.ajaxData("user/reqCode", jsonData);
            if (res.code == 1) {
                alert(res.msg);
            } else {
                clearTimeout(_that.t);
                $(_that).html("免费获取验证码");
                delete _that.t;
                delete _that.sec;
                alert(res.msg);
            }

            _that.t = setTimeout(function() {
                if ((_that.sec--) > 0) {
                    $(_that).html("重新发送(" + _that.sec + ")");
                    _that.t = setTimeout(arguments.callee, 1000);
                } else {
                    clearTimeout(_that.t);
                    $(_that).html("免费获取验证码");
                    delete _that.t;
                    delete _that.sec;
                }
            }, 1000);
        }
    },
    exit: function() { //退出
        localStorage.clear();
        location.reload();
    },
    openLoginDialog: function(type) { //打开登录注册窗口
        $("#loginPopBox").load('login.html', function() {
            var popTitle = (type == 'register') ? '注册智享账号' : (type == 'find-pwd' ? '找回密码' : '手机号登录');
            $("#loginPopBox .pop-box .pop-title").html(popTitle);
            $("#loginPopBox .pop-box ." + type).removeClass('hide').siblings().addClass('hide');
            $("#loginPopBox .pop-box").fadeIn();

            //关闭弹框
            $(".pop-box .close-btn").click(function() {
                $("#loginPopBox .pop-box").fadeOut();
            });

            //登录注册相互切换
            $(".pop-box .pop-con .change-btn").click(function() {
                var type = $(this).attr("data-rel");
                var popTitle = (type == 'register') ? '注册智享账号' : '手机号登录';
                $("#loginPopBox .pop-box .pop-title").html(popTitle);
                $("#loginPopBox .pop-box ." + type).removeClass('hide').siblings().addClass('hide');
            });
            //切换至找回密码
            $(".pop-box .pop-con .login .forget-pwd").click(function() {
                $(this).attr("href", BASE_URL + projectFile + '/findPwd/findPwd.html')
            });

            //获取手机验证码
            $(".pop-box form.register .get-phone-code").click(function() {
                var phoneNum = $(".pop-box form.register input[name=registName]").val();
                CommonUtil.getPhoneCodeNum(this, phoneNum);
            });
            $(".pop-box form.find-pwd .get-phone-code").click(function() {
                var phoneNum = $(".pop-box form.find-pwd input[name=registName]").val();
                CommonUtil.getPhoneCodeNum(this, phoneNum);
            });


            //注册
            $(".pop-box form.register .register-btn").click(function() {
                new LoginBoxFun().toRegister();
            });
            //登录
            $(".pop-box form.login .login-btn").click(function() {
                new LoginBoxFun().toLogin();
            });

        });
    }
}
window.CommonUtil = new CommonUtil();
//初始化执行获取用户地区信息
CommonUtil.getLocationInfo();

//页面加载导航与页脚
$("#header").load(BASE_URL + projectFile + "/header.html", function() {
    if (localStorage.getItem("apikey") != null) {
        LoginBoxFun.prototype.showLoginInfo();
    }
    $(".header-top .link-btn a").click(function() {
        var dataRel = $(this).attr("data-rel");
        CommonUtil.openLoginDialog(dataRel);
    });
    $(".header-top .exit-link").click(function() {
        CommonUtil.exit();
    });

});
$("#footer").load(BASE_URL + projectFile + "/footer.html");