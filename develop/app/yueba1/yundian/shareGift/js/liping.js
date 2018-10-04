//填写手机号，点击获取验证码
//获取url中的参数:
     var userId=GetQueryString('userId') || '';
     var shopId=GetQueryString('shopId') || '';
    //  var shopId=770;
    var loginFlag = true;
    //app下载地址
    var $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
    var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //页面进来清空input
     $('#registerTel').val('');
     $('#registerIdentify').val('');
    //填写手机号
    var oldTelNumber = 0;
    var flag = true;
var seconds = 60, timer = null;
$('#getIdentify').on('click', function (){
    clearInterval(timer);
    var telNumber = $('#registerTel').val();
    if(telNumber){
        if(is_mobile(telNumber)){
             reqAjaxAsync('user/findUserByUsercodeAtv', JSON.stringify({usercode: telNumber})).done(function (res){
                if(res.code == 1) {
                    layer.open({
                        content: '该用户已注册',
                        time: 2
                        ,btn: ['下载APP', '重新输入']
                        ,yes: function(index){
                            layer.close(index);
                            window.location.href = 'http://erweima.izxcs.com/erweima.php';
                        }
                        ,no: function(index) {
                            layer.close(index);
                            $('#registerTel').val('');
                        }
                    });
                }else if(res.code == 9){
                    timer = setInterval(function () {
                    seconds--;
                    if (seconds > 0) {
                         $('#getIdentify').html('正在获取中(' + seconds + ')').attr('disabled',true).addClass('zhezhao');
                    } else {
                         $('#getIdentify').html('获取验证码').attr('disabled',false).removeClass('zhezhao');
                         seconds=60;
                         clearInterval(timer);
                        }
                    }, 1000);
                    reqAjaxAsync('user/reqCodeNew', JSON.stringify({ 'usercode': telNumber, 'operaType': 'userReg' })).done(function (res) {
                                 if (res.code == 1) {
                                     oldTelNumber = $('#registerTel').val();
                                     loginFlag = true;
                                     layer.open({
                                         content: '新用户密码为验证码',
                                         skin: 'msg',
                                         time: 5
                                     });
                                 } else {
                                     layer.open({
                                         content: res.msg,
                                         skin: 'msg',
                                         time: 2
                                     });
                                 }
                             })
                }else{
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2
                    });
                }
             })
        }else {
            layer.open({
                content: '手机号不正确',
                skin: 'msg',
                time: 2
            });
        }
              
    }else{
        layer.open({
            content: '请填写手机号',
            skin: 'msg',
            time: 2
        });
    }
});
 $('#getGiftBtnSpan').on('click', function () {
        var userName = $('#registerTel').val();
        var codeValue = $('#registerIdentify').val();
        if (!is_mobile(userName) || isNull(codeValue)) {
            return layer.open({ content: '手机号或验证码错误', skin: 'msg', time: 2 });
        }
        //提交的用户名与获取验证码的用户名是否一致
        if(oldTelNumber != userName) {return layer.open({ content: '两次输入手机号不一致', skin: 'msg', time: 2 })};
        var cData = { 'usercode': userName, 'usersex': '男','recommendUserId': userId, 'captcha': codeValue, 'password': codeValue };
        //注册用户
        reqAjaxAsync('user/reg', JSON.stringify(cData)).done(function (res) {
            if (res.code == 1) {
                if(loginFlag) {
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2
                    });
                }
                var userId = res.data.scSysUser.id || '';
                var fData = {
                    "shopId": shopId
                }
                // 领取礼包  
                if(shopId){
                    reqAjaxAsync('coupon/selectScCouponExchange', JSON.stringify(fData)).done(function (res){
                        if(res.code==1){
                            if(res.data !=null){
                                window.location.href = '/yueba/yundian/shareGift/usePackage.html?shopId=' + shopId   //店铺ID
                            } 
                        }
                    })
                }
            } else {
                if(loginFlag) {
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2
                    });
                }
            }
        })
    })

function is_mobile(val) {
    var reg = /^1[3,5,7-8][0-9]{9}$/i;
    return reg.test(val);
}
//调用ajax
function reqAjaxAsync(cmd, data, async) {
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'); //获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version'); //获取缓存 版本号
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function (request) {
            request.setRequestHeader("apikey", apikey);
        },
        success: function (data) {
            defer.resolve(data);
        },
        error: function (err) {
            $('.WindowBox').addClass('hide').removeClass('show');
            $('#warningMsg').html("系统繁忙，请稍后再试!");
        }
    });
    return defer.promise();
}
//根据参数名获取地址栏URL里的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "") {
        return true;
    }
    return false;
}