$(function () {
    //获取url中的参数:
    var yw = GetQueryString('yw') || '';          //板块业务ID
    var sn = GetQueryString('sn') || '';          //sn转码
    var cp = GetQueryString('cp') || '';          //1代表手机移动端
    var packsId = '7a4b98cb-d19b-4462-93b9-21fe41d43fa7';
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
    $('#getIdentify').on('click', function () {
        if(flag) {
            var telNumber = $('#registerTel').val();
            if (telNumber) {
                if (is_mobile(telNumber)) {
                    reqAjaxAsync('user/findUserByUsercode', JSON.stringify({usercode: telNumber})).done(function (res) {
                        //code1表示已注册
                        if(res.code == 1) {
                            layer.open({
                                content: '该用户已注册'
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
                        }
                        //code9表示未注册
                        else if(res.code == 9) {
                            var seconds = 60, timer = null;
                            timer = setInterval(function () {
                                if (seconds > 0) {
                                    seconds--;
                                    $('#getIdentify').html('正在获取中(' + seconds + ')');
                                } else {
                                    $('#getIdentify').html('获取验证码');
                                    clearInterval(timer);
                                    flag = true;
                                }
                            }, 1000);
                            flag = false;
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
                        }
                        else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 2
                            });
                        }
                    });
                } else {
                    layer.open({
                        content: '手机号不正确',
                        skin: 'msg',
                        time: 2
                    });
                }
            } else {
                layer.open({
                    content: '请填写手机号',
                    skin: 'msg',
                    time: 2
                });
            }
        }
    });
    //点击领取礼包,注册账号,然后 获取礼包ID
    $('#getGiftBtnSpan').on('click', function () {
        var userName = $('#registerTel').val();
        var codeValue = $('#registerIdentify').val();
        if (!is_mobile(userName) || isNull(codeValue)) {
            return layer.open({ content: '手机号或验证码错误', skin: 'msg', time: 2 });
        }
        //提交的用户名与获取验证码的用户名是否一致
        if(oldTelNumber != userName) {return layer.open({ content: '两次输入手机号不一致', skin: 'msg', time: 2 })};
        var cData = { 'usercode': userName, 'usersex': '男', 'captcha': codeValue, 'password': codeValue };
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
                // 领取礼包  
                var gData = {
                    receiveUserId: userId,    //领取人ID
                    sectionBusinessId: yw,    //板块业务ID
                    packsId: packsId,    //礼包ID
                    cp: cp                                    //1代表手机移动端
                }
                reqAjaxAsync('operations/addPacksReceive', JSON.stringify(gData)).done(function (res) {
                    if (res.code == 1) {
                        loginFlag = false;
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2
                        });
                        window.location.href = '/24hours/share24/usePackage.html?packsId=' + packsId;   //礼包ID
                    } else {
                        loginFlag = false;
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2
                        });
                    }
                })
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
})
//判断手机正则
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