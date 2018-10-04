import './signin.scss';
import '../common/iconfonts/iconfont.css';
import util from '../util/util.js';

// 添加表单校验方案
jQuery.validator.addMethod("isPhone", function(value, element, param) {
    var reg = /^[1][3-9][0-9]{9}$/;
    return reg.test(value);
}, $.validator.format('请输入正确格式的手机号！'));

// 轮播图
var mySwiper = new Swiper('.swiper-container', {
    autoplay: true,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function(i, className){
            return '<span class="'+className+'"><i></i></span>'
        }
    }
});

// 初始化
init();

// 初始化
function init(){
    // 记住密码处理
    $('#remember').on('click', function(){
        if ($('#remember .icon-check').hasClass('active')){
            $('#remember .icon-check').removeClass('active');
        }else{
            $('#remember .icon-check').addClass('active');
        }
        // localStorage.remembered = $(this).is(':checked');
    });
    // 表单校验初始化
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
            }
        },
        submitHandler: signin
    });
}
// 点击显示密码
$('#showPwd').on('click', function () {
    if ($(this).hasClass('icon-eye-close')){
        $(this).removeClass('icon-eye-close');
        $(this).addClass('icon-eye');
        $('#pwd').hideShowPassword(true);
    }else{
        $(this).removeClass('icon-eye');
        $(this).addClass('icon-eye-close');
        $('#pwd').hideShowPassword(false);
    }
});

// 登陆方法，成功后处理数据
function signin(){
    var layerIndex = setLoading()
    var def = util.reqAjax('user/login', {
        usercode: $('#phone').val(),
        password: $('#pwd').val()
    });
    def.then(function (res){
        layer.msg(res.msg, {icon: res.code == 1 ? 1: 2});
        clearLoading(layerIndex);
        if(res.code == 1)signinSuccess(res.data);
    });
    def.fail(function(){
        clearLoading(layerIndex);
        layer.msg('请检查网络！',{icon: 2});
    })
}
// 设置加载样式
function setLoading(){
    $('#form button[type=submit]').attr('disabled', true);
    return layer.msg('正在登陆...', {icon: 16, time: 0, shade: [0.3, '#fff']});
}
// 清除加载样式
function clearLoading(index){
    $('#form button[type=submit]').attr('disabled', false);
    layer.close(index)
}

// 登陆成功后处理，存入apikey和用户数据，跳转到首页
function signinSuccess(data){
    localStorage.apikey = data.apikey;
    localStorage.username = data.scSysUser.username;
    localStorage.userpic = data.scSysUser.userpic;
    location.href = '/';
}