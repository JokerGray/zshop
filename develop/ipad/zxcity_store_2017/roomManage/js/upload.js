
window.initUpload = function(dom,canvas,param) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,html4',
        browse_button: dom,
        multi_selection: false,
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: [{
                title: "图片文件",
                extensions: 'jpg,jpeg,gif,png,bmp'
            }],
            max_file_size: "20Mb",
            prevent_duplicates: false
        }
    });
    //禁用选择文件按钮
    // uploader.disableBrowse(true);
    // 直接设置当前随机名称，避免多个上传的命名问题
    uploader.randomName = randomName();
    //将签名图片转换成blob，并放入uploader上传队列中
    //需要异步添加上传文件，要不然无法添加文件
    setTimeout(function () {
        uploader.addFile(dataURLtoBlob(canvas.toDataURL()));
    },200);
    // canvas.toBlob(function (blob) {
    //
    // });

    // 添加文件则直接上传
    uploader.bind('FilesAdded', function (up, files) {
        if (files[0].name.indexOf('lx') > -1) {
            up.removeFile(files[0]);
            return;
        }
        statrUpload(up);
    });

    // 错误处理
    uploader.bind('Error', function (up, err) {
        if (err.code == -600) {
            console.log("选择的文件过大");
        } else if (err.code == -500) {
            console.log('初始化错误')
        } else if (err.code == -601) {
            console.log("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
        } else if (err.code == -602) {
            console.log("这个文件已经上传过一遍了");
        } else {
            console.log("系统繁忙，请稍后再试!");
        }
    });

    // 成功处理
    uploader.bind('FileUploaded', function (up, file, info) {
        // console.log('success');
        if (info && info.status == 200) {
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + up.randomName;
            console.log(src);
            param.signatureUrl = src;
            // window.updateStatus('shopDisplayTerminal/completedService', param, 2);
            reqAjaxAsync('shopDisplayTerminal/completedService', JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("状态更新成功！");
                    loadRoomList();
                }else{
                    layer.msg(res.msg);
                }
            });
            $('.detail .row:nth-of-type(2)').css('visibility','visible');
            layer.closeAll();
        } else {
            console.log("上传失败，请重试");
        }
    });
    // 最后初始化
    uploader.init()
};

// 文件上传正式方法
function statrUpload(up) {
    //使用layer弹窗插件，实现加载动画
    layer.load(2, {
        shade: [0.1, '#fff']
    });
    getOssParams().done(function (data) {
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

// 自定义随机名称，共36位
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

// 每次上传一个参数，因此把当前文件的名称放在里面了
var OSSParams;
// 获取oss参数，返回deferred
// 每次获取参数后添加一个随机名称
// 若参数存在且未超时，直接返回之前的数据，否则ajax请求数据
function getOssParams() {
    var defer = $.Deferred();
    if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
        defer.resolve(OSSParams);
    } else {
        $.ajax({
            url: '/zxcity_restful/ws/oss/ossUpload',
            dataType: 'json',
            success: function (data) {
                OSSParams = data;
                defer.resolve(data);
            },
            error: function () {
                defer.reject();
                console.log('上传参数获取失败！')
            }
        });
    }
    return defer.promise();
}

//base64转blob对象
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

