var layero;
// 文件上传初始化
function initUpload(data) {
  var uploader = new plupload.Uploader({
    runtimes: 'html5,html4',
    browse_button: data.btn,
    multi_selection: false,
    url: 'http://oss.aliyuncs.com',
    filters: {
      mime_types: filter(data),
      max_file_size: "5mb",
      prevent_duplicates: false
    }
  });

  // 上传之前回调
  uploader.bind('FilesAdded', function (up, files) {
    plupload.each(files, function (file) {

      // 审批上传图片回调
      if (data.type == '3') {
        return picStart(up);
      }
    });
    statrUpload(up);
  });
  // 错误处理
  uploader.bind('Error', function (up, err) {
    if (err.code == -600) {
      layerMsg("选择的文件过大");
    } else if (err.code == -500) {
      layerMsg('初始化错误')
    } else if (err.code == -601) {
      layerMsg("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
    } else if (err.code == -602) {
      layerMsg("这个文件已经上传过一遍了");
    } else {
      layerMsg("系统繁忙，请稍后再试!");
    }
  });
  // 成功处理
  uploader.bind('FileUploaded', function (up, file, info) {
    if (info && info.status == 200) {
      var src = OSSParams.host + '/' + OSSParams.dir + '/' + up.randomName;
       if (data.type == '3') {
        return picEnd(src);
      }
    } else {
      layerMsg("上传失败，请重试");
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
      extensions: "jpg,png,jpeg"
    }]
  } else if (data.flag == "word") {
    obj = [{
      title: "文档文件",
      extensions: "doc,docx,xlsx,xlsm,xltx,xlsb,xlam"
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



//审批图片上传预览回调
function picStart(up) {
  //动态添加
  up.randomName = randomName();
  layer.open({
    type: 2
    ,content: '上传中'
  });
}

//审批图片上传完成回调
function picEnd(src) {
  layer.closeAll();
  $('.havechoosedImg').prepend('<div class="imgBox" data-fileUrl="'+src+'"> <img src="'+src+'" class="addCommom"> <span class="deletPicBtn"> <img src="img/createType/delPic.png" alt=""></span> </div>')
}

