import './common.scss';
import './iconfonts/iconfont.css';
import tplHeader from './tpl-header.html';
import tplFooter from './tpl-footer.html';
import tplAnchor from './tpl-anchor.html';
import util from '../util/util.js';

// 初始化
setHeader();
setAnchor();

// 设置顶部导航
function setHeader(){
    // // 二级菜单下拉列表
    // $('.dropdown').on('click', function(e){
    //     $(this).toggleClass('open');
    //     e.stopPropagation();
    // })
    // $(document).on('click', function(e){
    //     $('.dropdown').removeClass('open');
    // });
    // 设置导航线段样式
    // $('.nav-container .nav-line-block').css('left', $('.nav-header .nav-list>li').first().offset().left);
    // // 检测当前链接地址,加上active样式
    // var p = location.pathname;
    // $('.nav-header .nav-list a').each(function(){
    //     var h = $(this).attr('href');
    //     if(p.indexOf(h) > -1) $(this).parent().addClass('active').siblings().removeClass('active');
    // });
    // // 产品中心的二级页面，则加上一级页面的acitve
    // var pList = $('.nav-header .navbar-nav li.active').parent();
    // if(pList.hasClass('dropdown-menu')) {
    //     pList.parent().addClass('active').siblings().removeClass('active');
    // };
    // // 设置active样式
    // $('.nav-header .nav-line').css('left', $('.nav-header .navbar-nav>li.active').index()*120);
    //点击菜单
    $(".nav-container").on("click",".nav-list>li",function(){
        $(".nav-container .nav-list>li").removeClass("active");
        $(this).addClass("active");
    });

    // 鼠标移入滑动
     $('.nav-header .nav-list').on('mouseover', '>li', function(){
         var _left = $(this).offset().left - $('.nav-container .nav-line-block').offset().left;
         $('.nav-container .nav-line').css('left', _left);
     });
     // 鼠标移出返回
    $('.nav-header .nav-list').on('mouseout', function(){
         var _left = $('.nav-header .nav-list>li.active').offset().left - $('.nav-container .nav-line-block').offset().left;
         $('.nav-container .nav-line').css('left', _left);
    });
    //鼠标滑过隐藏菜单出现
    $('.nav-list').on('mouseover','.dropdown',function(){
        $(".sub-nav").addClass('active');
        $(".sub-nav").on('mouseover',function(){
            var _left = $('.nav-list li').eq(1).offset().left - $('.nav-container .nav-line-block').offset().left;
            $('.nav-container .nav-line').css('left', _left);
            $(".sub-nav").addClass('active');
        });
    });
    //鼠标划出隐藏菜单
    $('.nav-list').on('mouseout','.dropdown',function(){
         $(".sub-nav").removeClass('active');
    });
    $(".sub-nav").on('mouseout',function(){
         $(".sub-nav").removeClass('active');
    });

}

// 设置锚点
function setAnchor(){
    $(document.body).append(tplAnchor);
    $('.btn-advice').eq(0).on('click', function(e){
        $('.anchor-modal').toggleClass('active');
    })
    // 咨询表单处理
    $('#form-advice').validate({
        rules:{
            phone: 'isPhone',
            email: 'email',
        },
        messages:{
            phone: {
                required: '请输入手机号！'
            },
            email: {
                required: '请输入邮箱地址！'
            },
            content: {
                required: '请输入内容！'
            }
        },
        submitHandler: addFeedback
    });
}
// 添加表单校验方案
jQuery.validator.addMethod("isPhone", function(value, element, param) {
    var reg = /^[1][3-9][0-9]{9}$/;
    return reg.test(value);
}, $.validator.format('请输入正确格式的手机号！'));

// 意见反馈
function addFeedback(){
    var layerIndex = setLoading()
    var def = util.reqAjax('operations/feedBackAddition', {
        userId: '官网用户',
        content: $('#form-advice [name=content]').val(),
        pics: '官网用户',
        phone: $('#form-advice [name=phone]').val(),
        type: 2,
        MoreField1: 5,
        qq_code: $('#form-advice [name=qq_code]').val(),
        email: $('#form-advice [name=email]').val()
    });
    def.then(function(res){
        clearLoading(layerIndex);
        layer.msg(res.msg, {icon: res.code == 1 ? 1: 2});
        $('#form-advice').validate().resetForm();
        $('.btn-advice').eq(0).click();
    });
    def.fail(function(err){
        clearLoading(layerIndex);
        layer.msg('提交失败，请检查网络！',{icon: 2});
    })
}

// 设置加载样式
function setLoading(){
    $('#form-advice button[type=submit]').attr('disabled', true);
    return layer.msg('正在提交...', {icon: 16, time: 0, shade: [0.3, '#fff']});
}
// 清除加载样式
function clearLoading(index){
    $('#form-advice button[type=submit]').attr('disabled', false);
    layer.close(index);
}

// 检测自动登陆
function checkAutoLogin(){
    var remembered = localStorage.remembered == 'true';
    if(remembered && localStorage.apikey) {
        // 显示用户头像和菜单等
        return;
    }
    // 否则清除数据
    localStorage.clear();
    // getAccount();
}


// 账户余额接口
function getAccount(){
    var def = util.reqAjax('payAU/selAccountUser', {
        "userId": 17
    });
    def.then(function(res){
        console.log('账户余额='+res.data.scAccountUser.accountBalance)
    });
    def.fail(function(err){
        console.log(err)
    });
}