var userId = getUrlParam('userId');
var shopId = getUrlParam('shopId');
// lx添加
$(document).ready(function(){
    $('.area-content>select').bind('change', function(){
        getAreasByCode(this);
    })
    getAreasByCode();
})
// 根据上一级，获取下级省市区等
function getAreasByCode(pSelect) {
    // 判断是否第一个
    var pCode = $(pSelect).val() || 0;
    var $pSelect, $select;
    if(pSelect) {
        $pSelect = $(pSelect);
        $select = $pSelect.nextAll('select').eq(0);
    } else {
        $pSelect = $('.area-content>select').eq(0);
        $select = $('.area-content>select').eq(0);
    }
    $pSelect.nextAll('select').attr('disabled', true);
    // 判断是否最后一个，若获取不到下一个select，则无需继续
    // 加上ended用于第一次判断结尾
    if($select.length == 0) {
        return $pSelect.addClass('ended');
    }

    // 获取省市区数据
    var def = reqAjax('cms_new/queryScCmsAdvProvinces', {code: pCode});
    def.then(function(res){
        if(res.code == 1) {
        $select.empty();
        // 最后一个加全部的选项
        if($select.nextAll('select').length == 0) $select.append($('<option>--- 全部 ---</option>').val(pCode));
        $(res.data).each(function(i, v){
            var $opt = $('<option></option>').val(v.code).text(v.areaname)
            $select.append($opt);
        })

        // 判断是否需要根据地图默认标记更换城市，前提是省市区已经加载完毕
        var code = $select.data('areacode');
        if(code && $select.hasClass('ended')){
            // 若能找到，则使用该code，否则不变
            $select.val(code);
            if(!$select.val()) $select.val($select.find('option').eq(0).val())
            $select.data('areacode', '');
        }
        $select.trigger('change');
        $select.removeAttr('disabled');
        }
    })
}
// 根据areaCode设置默认选项
function setAreaByCode(code) {
    var province = code.substring(0, 2);
    var city = code.substring(0, 4);
    var district = code.substring(0, 6);
    var $selectArr = $('.area-content>select');
    $selectArr.eq(0).data('areacode', province);
    $selectArr.eq(1).data('areacode', city);
    $selectArr.eq(2).data('areacode', district);
    // 检测城市是否加载完毕，即街道数据都有了
    var index = setInterval(function(){
      if($selectArr.last().hasClass('ended')) {
        $selectArr.eq(0).val(province);
        $selectArr.eq(0).trigger('change');
        clearInterval(index);
      }
    }, 100)
  }
  
  // 设置详细位置和经纬度
  function setAddress(obj){
    $('#activityAddress').text(obj.address);
    $('#lat').val(obj.lat);
    $('#lng').val(obj.lng);
    // 重设区域仅执行一次
    if(window.hasSetArea) return;
    window.hasSetArea = true;
    var areaCode = obj.areaCode;
    if(areaCode) setAreaByCode(areaCode)
  }

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

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


$.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
}
// 时间选择器初始化
$('#activityBegin, #activityEnd').datetimepicker({
    language: 'zh-CN',
    autoclose: true,
    todayBtn: true,
    format: 'yyyy-mm-dd hh:ii:ss',
    // minView: 2,
    minuteStep: 10,
    startDate: '2000-01-01',
    // endDate: '2020-12-30'
});
// 时间选择器互动
$('#activityBegin').on('changeDate', function(ev){
    $('#activityEnd').datetimepicker('setStartDate', ev.date);
    var d = $('#activityEnd').val();
    if (d) {
        var date = new Date(d.replace(/-/g, '/'));
        if(date != 'Invalid Date' && date < ev.date){
            $('#activityEnd').datetimepicker('setDate', ev.date)
        }
    }
});
//editor初始化
var editor;
KindEditor.ready(function (K) {
    editor = K.create('#activityIntroduce', {
        width: '100%',
        resizeType: 1,
        allowPreviewEmoticons: false,
        imageSizeLimit: '10MB', //批量上传图片单张最大容量
        imageUploadLimit: 100, //批量上传图片同时上传最多个数
        // allowImageUpload: true,
        uploadJson: '/zxcity_restful/ws/fans/upload_article_images.do',
        items: [
            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'image', 'multiimage', 'link'],
        afterSelectFile: function (params) {
            console.log(params)   
        },
        afterChange: function () {
            $('#processContent').html(this.html());
        }
    });
});

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
//上传封面
initUpload({
    dom: $('#activityCover').siblings()[0], 
    flag: [{
        title: '请上传身份证正面照',
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




// 检测字段
function checkFields(){
    // 活动封面
    var activityCover = $.trim($('#activityCover').val());
    $('#activityCover').val(activityCover);
    if(activityCover.length < 1) {
        layer.msg('请上传活动封面！', {icon: 2});
        return false;
    }

    // 活动名称
    var activityName = $.trim($('#activityName').val());
    $('#activityName').val(activityName);
    // if(/(.+)?\d(.+)?/.test(activityName)  ) {
    //     layer.msg('活动名称不能有数字！', {icon: 2});
    //     return false;
    // }
    if(activityName.length < 3 ) {
        layer.msg('活动名称不得少于3个字！', {icon: 2});
        return false;
    }

    // 人均价格
    if ($('#activityAveprice').val() == "" || !/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test($('#activityAveprice').val())) {
        canClick = true;
        parent.layer.msg('请输入0-999999元的人均价格', {icon: 2})
        return false;
    }
      // 开始时间
    var activityBegin = $('#activityBegin').val();
    if(activityBegin.length < 1) {
        layer.msg('请选择开始时间！', {icon: 2});
        return false;
    }
    // 结束时间
    var activityEnd = $('#activityEnd').val();
    if(activityEnd.length < 1) {
        layer.msg('请选择结束时间！', {icon: 2});
        return false;
    }
    // 报名规则
    if(!$("input[name='enrolmentType']:checked").length) {
        parent.layer.msg('请选择报名规则', {icon: 2})
        return false;
    }

    // 联系方式 手机号
    var activityPhone = $.trim($('#activityPhone').val());
    $('#activityPhone').val(activityPhone);
    if(!/^[1][3-9][0-9]{9}$/.test(activityPhone)) {
        layer.msg('请输入正确格式的手机号！', {icon: 2});
        return false;
    }

    // 活动提醒
    if(!$("input[name='tipTime']:checked").length) {
        parent.layer.msg('请选择报名规则', {icon: 2})
        return false;
    }
    // 能否被赞助
    if(!$("input[name='isSponsor']:checked").length) {
        parent.layer.msg('请选择报名规则', {icon: 2})
        return false;
    }
    // 能否被冠名
    if(!$("input[name='isName']:checked").length) {
        parent.layer.msg('请选择报名规则', {icon: 2})
        return false;
    }

    // 省市加载
    // if($('#province').is(':disabled') || $('#city').is(':disabled')) {
    //     layer.msg('请等待省市加载完毕！', {icon: 2});
    // }
    return true
}
$('#save').on('click', function(){
    $('#save').attr('disabled', true);
    if(!checkFields()) {
        $('#save').attr('disabled', false);
        return
    };
    saveData();
})
// 保存数据
function saveData() {
    $('#save').attr('disabled', true);
    var layerIndex = layer.msg('提交中……', {icon: 16})
    var data = {};
    data.type = 1;
    data.userId = userId;  // 用户ID
    data.activityCover = $('#activityCover').val(); // 活动封面 
    data.activityAveprice = $('#activityAveprice').val(); // 均价
    data.activityPhone = $('#activityPhone').val(); //手机号
    data.activityName = $.trim($('#activityName').val()); //活动名称
    data.activityIntroduce = $('#activityIntroduce').val(); // 活动说明
    data.activityBegin = $('#activityBegin').val(); //开始时间
    data.activityEnd = $('#activityEnd').val(); //结束时间
    data.circleId = $('#circleId').val(); // 圈子ID
    data.activityAddress = $('#activityAddress').val(); // 详细地址
    data.tipTime = $("input[name='tipTime']:checked").val()  // 提醒时间 提前1 6 12 24小时
    data.isSponsor = $("input[name='isSponsor']:checked").val()  // 能否被赞助
    data.isName = $("input[name='isName']:checked").val()  // 能否被冠名

    data.releaseCity = $('#city').val();
    data.releaseProvince = $('#province').val();
    data.activityAddress = $('#activityAddress').text();

    var def = reqAjax('circle/insertCircleActivity', data);
    def.then(function(res){
        if(res.code == 1){
            layer.close(layerIndex)
            $('.success-modal').show()
        }else{
            layer.msg(res.msg, {icon: 2});
        }
        if(res.code == 1) disableAll()
        $('#save').attr('disabled', false);
    });
    def.fail(function(err){
        $('#save').attr('disabled', false);
        layer.msg('提交异常，请检查网络或稍后再试！', {icon: 2})
    });
}

// 列表禁止变动
function disableAll(){
    $('#table input, #table select').attr('disabled', true);
    $('.selectpicker').selectpicker('refresh');
    $('#save').text('已提交').attr('disabled', true);
    for(var i=0; i<window.pluploadList.length; i++) {
        window.pluploadList[i].destroy()
    }
}

