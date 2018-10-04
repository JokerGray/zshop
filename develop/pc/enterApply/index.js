// 通用Ajax请求
function reqAjax(cmd, data){
    var deferred = $.Deferred();
    $.ajax({
        type:"post",
        dataType: 'json',
        url:"/zxcity_restful/ws/rest",
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(data),
            version: 1 // 版本号根据情况默认
        },
        success: function(data){
            deferred.resolve(data)
        },
        error: function(){
            deferred.reject()
        }
    });
    return deferred;
}
// block元素垂直居中
function blockVetically(dom){
    var $dom = dom instanceof jQuery ? dom : $(dom);
    $dom.each(function(i, v){
        var ele = this;
        // 图片在加载完成之后才能有具体宽高
        if(ele.nodeName == 'IMG'){
            var $ele = $(ele)
            var interval = setInterval(function(){
                if(ele.complete) {
                    $ele.css('margin-top', parseInt(($ele.parent().height() - $ele.height()) / 2));
                    clearInterval(interval);
                }
            }, 20);
        } else {
            var $ele = $(ele)
            $ele.css('margin-top', parseInt(($ele.parent().height() - $ele.height()) / 2));
        }
    })
}
var noSeePassword = true;

$(document).ready(function(){
    // 重设td宽度
    $('.setWidth').css('width', $('table').width()/2 - 150)
    // 下拉框优化
    $('.selectpicker').selectpicker();
    // 省市处理
    getNextCities(0, $('#province'));
    $('#province').on('changed.bs.select', function (e) {
        getNextCities($('#province').selectpicker('val'), $('#city'));
    });
    // 行业
    getTradeList();
    // 提交处理
    $('.btn-yes').on('click', function(){
        $('.btn-yes').attr('disabled', true);
        if(!checkFields()) {
            $('.btn-yes').attr('disabled', false);
            return
        };
        saveData();
    })
    //密码是否可见
    $('.pass-icon').on('click', function(){
        var v = document.getElementById('password')
        if (noSeePassword) {
            v.type="text";
            noSeePassword=false;
            $('.pass-icon').addClass('see-pass')
        }else{
            v.type="password";
            noSeePassword=true;
            $('.pass-icon').removeClass('see-pass')
        }
    })
})

// 检测字段
function checkFields(){
    // 商户名称
    var merchantName = $.trim($('#merchantName').val());
    $('#merchantName').val(merchantName);
    if(merchantName.length < 3) {
        layer.msg('商户名称不得少于3个字！', {icon: 2});
        return false;
    }
    // 店铺名
    var shopName = $.trim($('#shopName').val());
    $('#realName').val(shopName);
    if(shopName.length == 0) {
        layer.msg('店铺名称不得少于3个字！', {icon: 2});
        return false;
    }
    // 联系方式
    var phone = $.trim($('#phone').val());
    $('#phone').val(phone);
    if(!/^[1][3-9][0-9]{9}$/.test(phone)) {
        layer.msg('请输入正确格式的手机号！', {icon: 2});
        return false;
    }
    // 密码
    var password = $.trim($('#password').val());
    $('#password').val(password);
    if(password.length < 6) {
        layer.msg('密码不得少于6位！', {icon: 2});
        return false;
    }
    // 营业执照正面
    var license01 = $.trim($('#license01').val());
    $('#license01').val(license01);
    if(license01.length < 1) {
        layer.msg('请上传营业执照正面！', {icon: 2});
        return false;
    }
    // 身份证正面
    var idCardFront = $.trim($('#idCardFront').val());
    $('#idCardFront').val(idCardFront);
    if(idCardFront.length < 1) {
        layer.msg('请上传身份证正面！', {icon: 2});
        return false;
    }
    // 手持身份证
    var idCardBack = $.trim($('#idCardBack').val());
    $('#idCardBack').val(idCardBack);
    if(idCardBack.length < 1) {
        layer.msg('请上传手持身份证照片！', {icon: 2});
        return false;
    }

    // 省市加载
    if($('#province').is(':disabled') || $('#city').is(':disabled')) {
        layer.msg('请等待省市加载完毕！', {icon: 2});
    }
    return true
}

// 保存数据
function saveData() {
    $('.btn-yes').attr('disabled', true);
    var layerIndex = layer.msg('提交中……', {icon: 16})

    var data = {};
    // $('#table input[type="text"],#table input[type="hidden"]').each(function(i, dom){
    //     data[dom.id] = dom.value;
    // });
    data.shareRegType = '2'; 
    data.phone = $('#phone').val(); //手机号
    data.shopName = $('#shopName').val(); //店铺名
    data.orgName = $('#merchantName').val(); //商户名
    data.adminName = $('#merchantName').val(); //管理员名字
    data.captcha = $('#captcha').val(); //验证码
    data.provinceName = $('#province').find("option:selected").text();
    data.cityName = $('#city').find("option:selected").text();
    data.password = $('#password').val();

    data.license01 = $('#license01').val();
    data.license02 = $('#license02').val();
    data.idCardFront = $('#idCardFront').val();
    data.idCardBack = $('#idCardBack').val();

    data.trade = $('#trade').val();
    data.cityId = $('#city').val();
    data.provinceId = $('#province').val();
    console.log(data)
    var def = reqAjax('share/shareReg', data);
    def.then(function(res){
        if(res.code == 1){
            layer.close(layerIndex)
            $('.success-modal').show()
        }else{
            layer.msg(res.msg, {icon: 2});
        }
        // layer.msg(res.msg, {icon: res.code == 1 ? 1: 2});
        if(res.code == 1) disableAll()
        $('.btn-yes').attr('disabled', false);
    });
    def.fail(function(err){
        $('.btn-yes').attr('disabled', false);
        layer.msg('提交异常，请检查网络或稍后再试！', {icon: 2})
    });
}

// 列表禁止变动
function disableAll(){
    $('#table input, #table select').attr('disabled', true);
    $('.selectpicker').selectpicker('refresh');
    $('.btn-yes').text('已提交').attr('disabled', true);
    for(var i=0; i<window.pluploadList.length; i++) {
        window.pluploadList[i].destroy()
    }
}
//获取行业
function getTradeList(){
    var prom = reqAjax('operations/getAllMerchantTradeList');
    prom.then(function(res){
        var code = res.code;
        if(code != 1) {
            return layer.msg(res.msg, {icon: 2});
        }
        $('#trade').empty();
        $(res.data).each(function(i, obj){
            var $option = $('<option></option>').text(obj.name).val(obj.id)
            $('#trade').append($option);
            $('#trade').selectpicker('refresh')
        });
        // 取消禁止
        $('#trade').prop('disabled', false);
        $('#trade').selectpicker('refresh');
    })
    prom.fail(function(err){
        layer.msg('请检查网络，刷新后再试！', {icon: 2})
        $('#trade').prop('disabled', false);
        $('#trade').selectpicker('refresh');
    })
}
// 获取下一级城市
function getNextCities(pcode, $dom) {
    if(!pcode) pcode = 0;
    if(!$dom) return;
    // 禁止选择
    $dom.prop('disabled', true);
    $dom.selectpicker('refresh');

    var def = reqAjax('operations/getProvinceList', {
        'parentcode': pcode
    });
    def.then(function(res){
        var code = res.code;
        if(code != 1) {
            return layer.msg(res.msg, {icon: 2});
        }
        $dom.empty();
        $(res.data).each(function(i, obj){
            var $option = $('<option></option>').text(obj.shortname).val(obj.code)
            $dom.append($option);
            $dom.selectpicker('refresh')
        });
        // 取消禁止
        $dom.prop('disabled', false);
        $dom.selectpicker('refresh');
        // 第一次获取省之后，继续获取市
        if(!pcode) getNextCities(res.data[0].code, $('#city'))
    })
    def.fail(function(err){
        layer.msg('请检查网络，刷新后再试！', {icon: 2})
        $dom.prop('disabled', false);
        $dom.selectpicker('refresh');
    })
}

var OSSParams;
window.pluploadList = [];
// oss上传
function initUpload(arg) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,html4',
        browse_button: arg.dom,
        multi_selection: false,
        unique_names: true,
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: arg.flag,
            max_file_size: arg.fileSize,
            prevent_duplicates: false
        }
    });
    uploader.init();
    uploader.bind('FilesAdded', function (up, files) {
        $(arg.dom).siblings('.cover').addClass('active')
        startUpload(up, files[0]);
    });
    uploader.bind('UploadProgress', function(up, file) {
        // console.log(file.percent)
        $(arg.dom).siblings('.cover').find('p').eq(0).text(file.percent + '%');
    });
    uploader.bind('Error', function (up, err, file) {
        if (err.code == -600) {
            layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内", {icon: 2});
        } else if (err.code == -500) {
            layer.msg('初始化错误', {icon: 2})
        } else if (err.code == -601) {
            layer.msg("不支持该文件格式", {icon: 2});
        } else if (err.code == -602) {
            layer.msg("这个文件已经上传过一遍了", {icon: 2});
        } else {
            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
        }
        $(arg.dom).siblings('.cover').find('p').eq(0).text('0%');
        $(arg.dom).siblings('.cover').removeClass('active')
    });
    uploader.bind('FileUploaded', function (up, file, info) {
        if (info && info.status == 200) {
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
            $(arg.dom).attr('src', src);
            $(arg.dom).siblings('input[type="hidden"]').val(src);
            layer.msg('上传成功！', {icon: 1})
        } else {
            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
        }
        $(arg.dom).siblings('.cover').find('p').eq(0).text('0%');
        $(arg.dom).siblings('.cover').removeClass('active')
    });
    window.pluploadList.push(uploader);
};

//身份证正面
initUpload({
    dom: $('#idCardFront').siblings()[0], 
    flag: [{
        title: '请上传身份证正面照',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});
//手持身份证
initUpload({
    dom: $('#idCardBack').siblings()[0], 
    flag: [{
        title: '请上传身份证反面照',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});
//营业执照正面
initUpload({
    dom: $('#license01').siblings()[0], 
    flag: [{
        title: '请上传营业执照正面照',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});
//营业执照副
initUpload({
    dom: $('#license02').siblings()[0], 
    flag: [{
        title: '请上传营业执照正面照',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});

function startUpload(up, file) {
    getOssParams().then(function (data) {
        file.name = randomName();
        var fileName = data['dir'] + '/' + file.name;
        up.setOption({
            url: data['host'],
            multipart_params: {
                key: fileName,
                policy: data['policy'],
                OSSAccessKeyId: data['accessid'],
                success_action_status: 200,
                signature: data['signature']
            }
        });
        up.start()
    });
}
function randomName(len) {
    len = len || 23;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return new Date().getTime() + str;
}

function getOssParams() {
    var defer = $.Deferred();
    if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
        defer.resolve(OSSParams);
    } else {
        var def = reqAjax('oss/ossUpload');
        def.then(function(res){
            OSSParams = res;
            defer.resolve(res);
        });
        def.fail(function(err){
            defer.reject();
            layer.msg("系统繁忙，请稍后再试!");
        });
    }
    return defer.promise();
}


 
var countdown = 60;
var sending = false;
// 获取验证码
function send() {
    sending = true;
    
    // 联系方式
    var phone = $.trim($('#phone').val());
    $('#phone').val(phone);
    if(!/^[1][3-9][0-9]{9}$/.test(phone)) {
        layer.msg('请输入正确格式的手机号！', {icon: 2});
        return false;
    }else{
        getCaptcha(phone)
    }

    var obj = $("#captcha-btn");
    settime(obj);
}

function settime(obj) { //发送验证码倒计时
    if (countdown == 0) {
        obj.attr('disabled', false);
        obj.text("获取验证码");
        countdown = 60;
        sending = false;
        return;
    } else {
        obj.attr('disabled', true);
        obj.text("重新获取(" + countdown + ")");
        countdown--;
    }
    setTimeout(function () {
        settime(obj);
    }, 1000)
}
// 获取验证码接口
function getCaptcha(phone){
    var phoneDef = reqAjax('backUser/getCode', {
        userphone: phone
    })
    phoneDef.then(function(res){
        layer.msg("获取验证码成功!");
    })
    phoneDef.fail(function(err){
        layer.msg("系统繁忙，请稍后再试!");
    });
}

function closeModal(){
    $('.success-modal').hide()
}