import './enterApply.scss'
import util from '../util/util';

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
    // 提交处理
    $('.btn-submit').on('click', function(){
        $('.btn-submit').attr('disabled', true);
        if(!checkFields()) {
            $('.btn-submit').attr('disabled', false);
            return
        };
        saveData();
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
    // 姓名
    var realName = $.trim($('#realName').val());
    $('#realName').val(realName);
    if(realName.length == 0) {
        layer.msg('请输入姓名！', {icon: 2});
        return false;
    }
    // 联系方式
    var phone = $.trim($('#phone').val());
    $('#phone').val(phone);
    if(!/^[1][3-9][0-9]{9}$/.test(phone)) {
        layer.msg('请输入正确格式的手机号！', {icon: 2});
        return false;
    }
    // 身份证号
    var idCardNo = $.trim($('#idCardNo').val());
    $('#idCardNo').val(idCardNo);
    if(idCardNo.length == 0) {
        layer.msg('身份证号不能为空', {icon: 2});
        return false;
    }
    if(!checkIdCard(idCardNo)) {
        layer.msg('请输入合法的身份证号！', {icon: 2});
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
    $('.btn-submit').attr('disabled', true);
    var layerIndex = layer.msg('提交中……', {icon: 16})

    var data = {};
    $('#table input[type="text"],#table input[type="hidden"]').each(function(i, dom){
        data[dom.id] = dom.value;
    });
    data.usersex = $('#usersex').val();
    data.cityId = $('#city').val();
    data.provinceId = $('#province').val();
    
    var def = util.reqAjax('operations/addScMerchantSettleinApply', data);
    def.then(function(res){
        layer.msg(res.msg, {icon: res.code == 1 ? 1: 2});
        if(res.code == 1) disableAll()
        $('.btn-submit').attr('disabled', false);
    });
    def.fail(function(err){
        $('.btn-submit').attr('disabled', false);
        layer.msg('提交异常，请检查网络或稍后再试！', {icon: 2})
    });
}

// 列表禁止变动
function disableAll(){
    $('#table input, #table select').attr('disabled', true);
    $('.selectpicker').selectpicker('refresh');
    $('#table .btn-submit').text('已提交').attr('disabled', true);
    for(var i=0; i<window.pluploadList.length; i++) {
        window.pluploadList[i].destroy()
    }
}

// 检测身份证号
function checkIdCard(id) {
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    if(!format.test(id)) return false;
    var year = id.substr(6,4),
        month = id.substr(10,2),
        date = id.substr(12,2),
        time = Date.parse(month+'-'+date+'-'+year),
        now_time = Date.parse(new Date()),
        dates = (new Date(year,month,0)).getDate();
    if(time>now_time||date>dates) return false;
    var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
    var b = new Array('1','0','X','9','8','7','6','5','4','3','2');
    var id_array = id.split('');
    var sum = 0;
    for(var k=0;k<17;k++){
        sum+=parseInt(id_array[k])*parseInt(c[k]);
    }
    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
        return false
    }
    return true
}

// 获取下一级城市
function getNextCities(pcode, $dom) {
    if(!pcode) pcode = 0;
    if(!$dom) return;
    // 禁止选择
    $dom.prop('disabled', true);
    $dom.selectpicker('refresh');

    var def = util.reqAjax('operations/getProvinceList', {
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
        console.log(file.percent)
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
    dom: $('#cardFrontPhoto').siblings()[0], 
    flag: [{
        title: '请上传身份证正面照',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});
//身份证反面
initUpload({
    dom: $('#cardBackPhoto').siblings()[0], 
    flag: [{
        title: '请上传身份证反面照',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});
//营业执照正面
initUpload({
    dom: $('#licenseFront').siblings()[0], 
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
        var def = util.reqAjax('oss/ossUpload');
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