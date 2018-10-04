// 文件上传初始化
function initUpload(data) {
  var uploader = new plupload.Uploader({
    runtimes: 'html5,html4',
    browse_button: data.btn,
    multi_selection: false,
    url: 'http://oss.aliyuncs.com',
    filters: {
      mime_types: filter(data),
      max_file_size: "10mb",
      prevent_duplicates: false
    }
  });

  // 上传之前回调
  uploader.bind('FilesAdded', function (up, files) {
    plupload.each(files, function (file) {
      if (data.type == '1') {
        announcementStart(up, file);
      }
      else if (data.type == '2') {
      }
      else if (data.type == '3') {
      }
    });
    statrUpload(up);
  });
  // 错误处理
  uploader.bind('Error', function (up, err) {
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
  uploader.bind('FileUploaded', function (up, file, info) {
    if (info && info.status == 200) {
      var src = OSSParams.host + '/' + OSSParams.dir + '/' + up.randomName;
      if (data.type == '1') {
        return announcementEnd(src);
      } else if (data.type == '2') {
      }
      else if (data.type == '3') {
      }
    } else {
      layer.msg("上传失败，请重试");
    }
  });
  // 最后初始化
  uploader.init();
}

//文件类型选择
function filter(data) {
  var obj = "";
  if (data.flag == "video") {
    obj = [{
      title: "视频文件",
      extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv"
    }]
  } else if (data.flag == "image") {
    obj = [{
      title: "图片文件",
      extensions: "jpg,png"
    }]
  } else if (data.flag == "word") {
    obj = [{
      title: "文档文件",
      extensions: "doc,docx,xlsx,xlsm,xltx,xlsb,xlam,xls"
    }]
  }
  return obj;
}

// 文件上传正式方法
function statrUpload(up) {
  getOssParams().then(function (data) {
    var fileName = data['dir'] + '/' + up.randomName;
    up.setOption({
      url: data['host'],
      headers: {
        'Content-Disposition': 'attachment;filename=oss_download.jpg'
      },
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
      aynsc: false,
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

// 图片预览
/*
function imgPreview(file, callback) {
  // 文件必须是图片
  if (!file || !/image\//.test(file.type)) return;
  // gif使用 FileReader 进行预览,moxie.Image只支持jpg和png
  if (file.type == 'image/gif') {
    var fr = new moxie.file.FileReader();
    fr.onload = function () {
      callback(fr.result);
      fr.destroy();
      fr = null;
    }
    fr.readAsDataURL(file.getSource());
    return;
  }
  var preloader = new moxie.image.Image();
  preloader.onload = function () {
    // preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
    // 得到图片src,实质为一个base64编码的数据
    var imgsrc = preloader.getAsDataURL();
    callback && callback(imgsrc); //callback传入的参数为预览图片的url
    preloader.destroy();
    preloader = null;
  };
  preloader.load(file.getSource());
}*/

//模板上传预览回调
function announcementStart(up, file) {
  up.randomName = file.name;
}

//模板上传成功回调
function announcementEnd(src) {
  $('#upload').attr('data-excelPath', src);
  $('#upload').click();
}