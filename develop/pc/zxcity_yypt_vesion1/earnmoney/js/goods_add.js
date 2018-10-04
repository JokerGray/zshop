var areaArr = [];
var uploader;
$(function() {
    initCityAndMerchant();
    initUpload();
})

// 初始化，获取下拉框中的数据
function initCityAndMerchant() {
    var params = {}
    var successFunc = function(data) {
        if (data.code == 2) layer.msg(data.msg, {
            icon: 2
        })
        if (data.code == 1) {
            areaArr = data.data.area;
            initCity();
            // 商户初始化
            var merchant = data.data.sso;
            for (var i = 0; i < merchant.length; i++) {
                var option = $('<option></option>');
                option.val(merchant[i].merchantId).text(merchant[i].orgName);
                $('#merchantId').append(option)
            }
        }
    }
    myAjax('earnmoney/getPlayerOrgAndArea', JSON.stringify(params), successFunc)
}

// 省市初始化
function initCity() {
    // 省下拉框改变事件
    $('#areaId').on('change', function(i, v) {
        $('#cityId').html('');
        var code = $('#areaId').val();
        for (var i = 0; i < areaArr.length; i++) {
            if (code != areaArr[i].parentcode || areaArr[i].level != 2) continue;
            var option = $('<option></option>');
            option.val(areaArr[i].code);
            option.text(areaArr[i].areaname);
            $('#cityId').append(option);
        }
    });
    // 加载省数据
    for (var i = 0; i < areaArr.length; i++) {
        if (areaArr[i].level != 1) continue;
        var option = $('<option></option>');
        option.val(areaArr[i].code);
        option.text(areaArr[i].areaname);
        option.data(areaArr[i]);
        $('#areaId').append(option);
    }
    // 触发change事件
    $('#areaId').trigger('change');
}

// 文件上传初始化
function initUpload() {
    uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'choose',
        multi_selection: false,
        flash_swf_url: '../assets/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: '../assets/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: [{
                title: "图片文件",
                extensions: 'jpg,jpeg,gif,png,bmp'
            }],
            max_file_size: "10mb",
            prevent_duplicates: false
        }
    });
    // 添加文件则直接上传
    uploader.bind('FilesAdded', function(up, files) {
        statrUpload();
        $('#ossfile').show();
        plupload.each(files, function(file) {
            $('#ossfile .text-info').attr('id', file.id).text(file.name + ' ' + plupload.formatSize(file.size));
            $('#ossfile .progress-bar').css('width', file.percent + "%");
        });
    });
    // 上传进度条
    uploader.bind('UploadProgress', function(up, file) {
        $('#ossfile .progress-bar').css('width', file.percent + "%");
    });
    // 错误处理
    uploader.bind('Error', function(up, err) {
        if (err.code == -600) {
            layer.msg("选择的文件过大");
        } else if (err.code == -500) {
            layer.msg('初始化错误')
        } else if (err.code == -601) {
            layer.msg("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
        } else if (err.code == -602) {
            layer.msg("这个文件已经上传过一遍了");
        } else {
            layer.msg("系统繁忙，请稍后再试!");
        }
    });
    // 成功处理
    uploader.bind('FileUploaded', function(up, file, info) {
        if (info && info.status == 200) {
            $('#prizeStyle').siblings('h3').hide();
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + OSSParams.randomName;
            $('#prizeStyle').attr('src', src);
            $('#ossfile').fadeOut(200);
            $('#choose').siblings('.moxie-shim').css('height', $('#choose').height())
        } else {
            layer.msg("上传失败，请重试");
        }
    });
    // 最后初始化
    uploader.init();
}

// 文件上传正式方法
function statrUpload() {
    getOssParams().then(function(data) {
        var fileName = data['dir'] + '/' + data['randomName'];
        uploader.setOption({
            url: data['host'],
            multipart_params: {
                // key: data['dir'],
                key: fileName,
                policy: data['policy'],
                OSSAccessKeyId: data['accessid'],
                success_action_status: 200,
                signature: data['signature']
            }
        });
        uploader.start()
    });
}

function add() {
    if (!check()) return;
    var params = {
        merchantId: $('#merchantId').val(),
        prizePrice: $('#prizePrice').val(),
        prizeTitle: $('#prizeTitle').val(),
        prizeExplain: $('#prizeExplain').val(),
        prizeStyle: $('#prizeStyle').attr('src'),
        cityId: $('#cityId').val()
    };
    var successFunc = function(data) {
        parent.layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) {
            parent.refreshTable();
            parent.layer.closeAll('iframe');
        }
    }
    var index = parent.layer.confirm('确定添加实物奖品？', function() {
        parent.layer.close(index);
        myAjax('earnmoney/addPlayerGoods', JSON.stringify(params), successFunc);
    });
}

function check() {
    var prizeTitle = $.trim($('#prizeTitle').val());
    $('#prizeTitle').val(prizeTitle.substr(0, 6));
    if (prizeTitle.length == 0) {
        layer.msg('实物标题不能为空！', {
            icon: 2
        })
        return false;
    }
    if($('#prizePrice').val().length == 0){
         layer.msg('请输入奖券面额！', { icon: 2 })
        return false;
    }
    var prizePrice = parseInt($.trim($('#prizePrice').val()));
    $('#prizePrice').val(isNaN(prizePrice) ? '': prizePrice);
    if (isNaN(prizePrice) || prizePrice < 1) {
        layer.msg('奖券面额为 1~99999 的整数！', { icon: 2 })
        return false;
    }
    if ($('#prizeStyle').attr('src').length == 0) {
        layer.msg('请上传实物图片！', { icon: 2 })
        return false;
    }
    if ($('#prizeExplain').val().length == 0) {
        layer.msg('说明不能为空！', { icon: 2 })
        return false;
    }
    return true;
}