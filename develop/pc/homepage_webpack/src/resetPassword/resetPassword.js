 import './resetPassword.scss';
import util from '../util/util';

$(function(){
     // 只有输入正确的手机号才能获取验证码
     $('#captchaBtn').on('click',sendCaptcha)
    // 表单校验重置密码
    $('#form').validate({
        rules:{
            phone: 'isPhone'
        },
        messages:{
            phone: {
                required: '请输入手机号！'
            },
            pwd: {
                required: '请输入密码！'
            },
            captcha: {
                required: '请输入验证码！'
            }
        },
        // 修改checkbox提示位置
        errorPlacement: function(error, element){
            error.insertAfter(element);
        },
        submitHandler: signup
    });
    // 表单校验确认重置密码
    $('#formResert').validate({
        rules:{
            phone: 'isPsw',
            newPwd: "required",
            pwd: {
                equalTo: "#newPwd"
            }
        },
        messages:{
            newPwd: {
                required: '请输入新密码！'
            },
            pwd:{ 
                required: '请确认密码！' ,
                equalTo:"两次密码输入不一致"  
            } 
        },
        // 修改checkbox提示位置
        errorPlacement: function(error, element){
            error.insertAfter(element);
        },
        submitHandler: sureSignup
    });
});

// 重置密码
function signup(){
    var layerIndex = layer.msg('提交中……', {icon: 16, time: 0, shade: [0.3, '#fff']})
    var def = util.reqAjax('user/checkCode', {
        usersex: '男',
        usercode: $('#phone').val(),
        captcha: $('#captcha').val()
    });
    def.then(function (res){
        layer.close(layerIndex);
        layer.msg(res.msg, {icon: res.code == 1 ? 1: 2}, function(){
            if(res.code == 1) {
                $(".surePass").show();
                $(".resertPass").hide();
            }
        });
    });
    def.fail(function(){
        layer.close(layerIndex);
        layer.msg('请检查网络！',{icon: 2});
    })
}
// 确认重置密码
function sureSignup(){
    var layerIndex = layer.msg('提交中……', {icon: 16, time: 0, shade: [0.3, '#fff']})
    var def = util.reqAjax('user/updateScSysUser', {
        usersex: '男',
        usercode: $('#phone').val(),
        password: $('#pwd').val()
    });
    def.then(function (res){
        layer.close(layerIndex);
        layer.msg(res.msg, {icon: res.code == 1 ? 1: 2}, function(){
            if(res.code == 1) location.href = '/signin.html';
        });
    });
    def.fail(function(){
        layer.close(layerIndex);
        layer.msg('请检查网络！',{icon: 2});
    })  
}
// 发送手机验证码
function sendCaptcha(){
    if(!$('#phone').valid()) return;
    setLoading()
    var def = util.reqAjax('user/reqValidatCodeNew', {
        usercode: $('#phone').val(),
        operaType: 'userReg'
    });
    def.then(function (res){
        layer.msg(res.msg, {icon: res.code == 1 ? 1: 2});
        res.code == 1 ? setTimer() : clearLoading();
    });
    def.fail(function(){
        clearLoading();
        layer.msg('请检查网络！',{icon: 2});
    })
}

// 设置定时器
function setTimer(){
    var time = 60;
    var $btn = $('#captchaBtn');
    $btn.html(`重新发送(${time}s)`);
    var interval = setInterval(function(){
        if(time < 2){
            clearInterval(interval);
            clearLoading();
            return;
        }
        time--;
        $btn.html(`重新发送(${time}s)`);
    }, 1000)
}
// 设置加载样式
function setLoading(){
    $('#captchaBtn').attr('disabled', true);
    $('#captchaBtn').html('<i class="fa fa-loading"></i> 正在发送...');
}
// 清除加载样式
function clearLoading(){
    $('#captchaBtn').attr('disabled', false);
    $('#captchaBtn').html('获取验证码');
}

// 添加表单校验方案
jQuery.validator.addMethod("isPhone", function(value, element, param) {
    var reg = /^[1][3-9][0-9]{9}$/;
    return reg.test(value);
}, $.validator.format('请输入正确格式的手机号！'));
jQuery.validator.addMethod("isPsw", function(value, element, param) {
    var reg = /^[1][3-9][0-9]{9}$/;
    return reg.test(value);
}, $.validator.format('请输入正确格式密码！'));