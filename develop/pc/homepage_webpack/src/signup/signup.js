import './signup.scss';
import util from '../util/util.js';

$(document).ready(function(){
    // 初始化轮播
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: true,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function(i, className){
                return '<span class="'+className+'"><i></i></span>'
            }
        }
    });
    // 只有输入正确的手机号才能获取验证码
    $('#captchaBtn').on('click', sendCaptcha)
    // 表单校验
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
            },
            protocol: {
                required: '请勾选并同意协议！'
            }
        },
        // 修改checkbox提示位置
        errorPlacement: function(error, element){
            if(element.attr('name') == 'protocol') {
                error.insertAfter("#protocol");
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: signup
    });
});

// 点击显示密码
$('#showPwd').on('click', function () {
    if ($(this).hasClass('icon-eye-close')) {
        $(this).removeClass('icon-eye-close');
        $(this).addClass('icon-eye');
        $('#pwd').hideShowPassword(true);
    } else {
        $(this).removeClass('icon-eye');
        $(this).addClass('icon-eye-close');
        $('#pwd').hideShowPassword(false);
    }
});

// 注册，成功后跳转到登陆页
function signup(){
    var layerIndex = layer.msg('提交中……', {icon: 16, time: 0, shade: [0.3, '#fff']})
    var def = util.reqAjax('user/reg', {
        usersex: '男',
        usercode: $('#phone').val(),
        captcha: $('#captcha').val(),
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