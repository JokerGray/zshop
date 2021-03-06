var dataRaw;
if (localStorage.hasOwnProperty('serviceData')) {
    dataRaw = JSON.parse(localStorage.getItem('serviceData'));
    localStorage.removeItem('serviceData');
}
$(function() {
    dataInit();
    // 三个上传分别处理
    $('.well').each(function() {
        uploaderInit(this);
    })
});

// 初始化加载各种数据
// flag，1、2、3，新增主分类，新增子分类，修改分类
function dataInit() {
    if (!dataRaw) return parent.layer.closeAll()
    var flag = dataRaw._flag;
    if (flag == 1) return;
    // 子分类没有封面图 coverPic
    if (flag == 2) return $('#coverPic').parents('.hasInputFile').remove();

    $('#categoryName').val(dataRaw.categoryName);
    $('#sort').val(dataRaw.sort);
    if (dataRaw.categoryIcon) {
        $('#categoryIcon').attr('src', dataRaw.categoryIcon);
        $('#categoryIcon').siblings('h3').hide();
    }
    if (dataRaw.greyUrl) {
        $('#greyUrl').attr('src', dataRaw.greyUrl);
        $('#greyUrl').siblings('h3').hide();
    }
    // 判断是子分类还是主分类，主分类 parentCategoryId 为0
    if (dataRaw.parentCategoryId != 0) {
        return $('#coverPic').parents('.hasInputFile').remove();
    }
    if (dataRaw.coverPic) {
        $('#coverPic').attr('src', dataRaw.coverPic);
        $('#coverPic').siblings('h3').hide();
    }

}

// 上传文件分别初始化
function uploaderInit(dom) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: dom,
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
    // 直接在 uploader 这里加上 randomName ，避免多次上传的冲突
    uploader.randomName = randomName();
    uploader.bind('FilesAdded', function(up, files) {
        statrUpload(up);
        $(dom).find('.progressContent').show();
        plupload.each(files, function(file) {
            $(dom).find('.progressContent .text-info').attr('id', file.id).text(file.name + ' ' + plupload.formatSize(file.size));
            $(dom).find('.progressContent .progress-bar').css('width', file.percent + "%");
        });
    });
    uploader.bind('UploadProgress', function(up, file) {
        $(dom).find('.progressContent .progress-bar').css('width', file.percent + "%");
    });
    uploader.bind('Error', function(up, err) {
        if (err.code == -600) {
            layer.msg("选择的文件过大");
        } else if (err.code == -500) {
            layer.msg('初始化错误')
        } else if (err.code == -601) {
            layer.msg("选择的文件后缀不对");
        } else if (err.code == -602) {
            layer.msg("这个文件已经上传过一遍了");
        } else {
            layer.msg("系统繁忙，请稍后再试!");
        }
    });
    uploader.bind('FileUploaded', function(up, file, info) {
        if (info && info.status == 200) {
            $(dom).find('h3').hide();
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + up.randomName;
            $(dom).find('img').attr('src', src);
            $(dom).find('.progressContent').fadeOut(200);
            $(dom).siblings('.moxie-shim').css('height', $(dom).height());
            up.randomName = randomName();
        } else {
            layer.msg("上传失败，请重试");
        }
    });
    uploader.init();
}

// 多个文件上传
function statrUpload(up) {
    getOssParams().then(function(data) {
        var fileName = data['dir'] + '/' + up.randomName;
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
        up.start();
    });
}

// 修改或新增
function insertOrUpdate() {
    var flag = dataRaw._flag;
    var title = '确定新增服务分类？';
    var params = {
        parentCategoryId: 0,
        sort: $('#sort').val(),
        categoryName: $('#categoryName').val(),
        categoryIcon: $('#categoryIcon').attr('src'),
        greyUrl: $('#greyUrl').attr('src'),
    };
    // 主分类新增
    if (flag == 1) {
        params.coverPic = $('#coverPic').attr('src');
    }
    // 子分类新增
    if (flag == 2) {
        params.parentCategoryId = dataRaw.categoryId;
        title = '确定新增子服务分类？'
    }
    // 修改
    if (flag == 3) {
        title = '确定修改子服务分类？'
        params.categoryId = dataRaw.categoryId;
        params.parentCategoryId = dataRaw.parentCategoryId;
        // 主分类才有封面
        if (dataRaw.parentCategoryId == 0) {
            title = '确定修改主服务分类？'
            params.coverPic = $('#coverPic').attr('src');
        }
    }
    if (!check()) return;
    var successFunc = function(data) {
        parent.layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) {
            parent.refreshTable();
            parent.layer.closeAll('iframe');
        }
    }
    var index = parent.layer.confirm(title, function() {
        parent.layer.close(index);
        myAjax('newservice/addOrModifyCategory', JSON.stringify(params), successFunc);
    });
}

function cancle() {
    parent.layer.closeAll('iframe');
}

// 检测
function check() {
    var categoryName = $.trim($('#categoryName').val());
    $('#categoryName').val(categoryName);
    if (categoryName.length < 2) {
        layer.msg('分类名称不能少于2个字！', {
            icon: 2
        })
        return false;
    }
    var sort = parseInt($('#sort').val());
    if (isNaN(sort)) {
        layer.msg('排序请输入数字！', {
            icon: 2
        })
        return false;
    }
    var categoryIcon = $('#categoryIcon').attr('src');
    if (!categoryIcon) {
        layer.msg('请上传分类图标！', {
            icon: 2
        })
        return false;
    }
    var greyUrl = $('#greyUrl').attr('src');
    if (!greyUrl) {
        layer.msg('请上传夜间模式图标！', {
            icon: 2
        })
        return false;
    }
    return true;
}