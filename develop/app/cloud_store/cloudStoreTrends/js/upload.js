// 文件上传初始化
function initUpload(data) {
  var uploader = new plupload.Uploader({
    runtimes: 'html5,html4',
    browse_button: data.btn,
    multi_selection: false,
    url: 'http://oss.aliyuncs.com',
    filters: {
      mime_types: filter(data),
      max_file_size: '20mb',
      prevent_duplicates: false
    }
  });
  var layer = layui.layer;

  // 上传之前回调
  uploader.bind('FilesAdded', function (up, files) {
    var name = files[0].name;
    var fileSize = files[0].size;
    console.log(fileSize);
    name = name.slice(name.length - 3, name.length);

    if (name == "jpg" || name == "png") {
      //图片最大5m

      if (fileSize > 1024 * 1024 * 5) {

        up.trigger('Error', {
          code: plupload.FILE_SIZE_ERROR,
          msg: 'aaaaaaa'
        })
        up.removeFile(files[0]);
        return;
      }
    }else{
      //视频最大20m
      if (fileSize > 1024 * 1024 * 20) {

        up.trigger('Error', {
          code: plupload.FILE_SIZE_ERROR,
          msg: 'aaaaaaa'
        })
        up.removeFile(files[0]);
        return;
      }
    }


    // var maxSize = data.type == 3? 1*10*1024 : 10*1024*1024
    // var fileSize = files[0].size;
    //
    // if(fileSize > maxSize) {
    //   console.log('过大')
    //   up.trigger('Error', {
    //     code: plupload.FILE_SIZE_ERROR,
    //     msg: 'aaaaaaa'
    //   })
    //   up.removeFile(files[0]);
    //   return;
    // }

    plupload.each(files, function (file) {
      //上传视频回调
      if (data.type == '1') {
        return vedioStart(up, file);
      }//上传封面之前回调
      else if (data.type == '2') {
        return approvalStart(up, file);
      }
      // 上传图片视频回调
      else if (data.type == '3') {
        return picStart(up, file,uploader);
      }
    });
    statrUpload(up);
  });
  // 错误处理
  uploader.bind('Error', function (up, err, file) {
    console.log(up)
    console.log(file);
    console.log(err)
    if (err.code == -600) {
      layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内");
      // return
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
        return vedioEnd(src);
      } else if (data.type == '2') {
        return approvalEnd(src);
      }
      else if (data.type == '3') {
        // debugger
        return picEnd(src, file);

      }
    } else {
      layer.msg("上传失败，请重试");
    }
  });
  // 最后初始化
  uploader.init();
  return uploader;
}

//文件类型选择
function filter(data) {
  var obj = "";
  if (data.flag == "videoImg") {
    obj = [{
      title: "视频图片文件",
      extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv,jpg,png"
    }]
  }
  else if (data.flag == "image") {
    obj = [{
      title: "图片文件",
      extensions: "jpg,png"
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

//上传封面之前回调
function approvalStart(up,file) {
  //动态添加
  up.randomName = randomName();

  console.log(file.size);

    if (file.size > 1024 * 1024 * 5) {
      layer.msg("封面图片限制在5M以内！");
      return;
    }
    // else{
    //   videoImgtip = layer.load(1);
    // }
}

//封面上传完成
function approvalEnd(src) {
  // layer.close(videoImgtip);
  console.log(src);
  $('.previewContent .previewIMG')
    .append('<div class="vedioIMGBox"><i class="layui-icon toDelvideoIMG">&#x1007;</i><img src="' + src + '"></div>');

}

//图片视频上传预览回调
function picStart(up, file) {
  up.randomName = randomName();
  //动态添加
  var name = file.name;
  name = name.slice(name.length - 3, name.length);
  if (name == "jpg" || name == "png") {

    }else {
     videotip = layer.load(1);
     layer.msg("正在上传视频，请等待")
  }
}

//图片视频上传完成回调
function picEnd(src, file) {
  var name = file.name;
  name = name.slice(name.length - 3, name.length);
  if (name == "jpg" || name == "png") {

    $('.previewContent .previewIMG').append('<div class="parentPic" data-name="' + name + '"><i class="layui-icon toDelPic">&#x1007;</i><img src="' + src + '"  class="layui-upload-img"></div>');
//上传类型
    $('.previewContent .previewIMG').attr("data-type", 1);

    //上传视频
  } else {
    layer.close(videotip);
    layer.msg('视频已上传完成,请上传视频封面');
    //上传类型
    $('.previewContent .previewIMG').attr("data-type", 2);

    $('.previewContent .previewIMG').append('<div class="vedioBox"><i class="layui-icon toDelvideo">&#x1007;</i><video src="' + src + '"  id="video" width="300" height="240" controls></video></div>');

    $(".add_tips").show();
  }
}


