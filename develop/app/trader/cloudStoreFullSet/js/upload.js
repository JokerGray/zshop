
var shopId = 8;
var layer = layui.layer;

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

  // 上传之前回调
  uploader.bind('FilesAdded', function (up, files) {
    var name = files[0].name;
    var fileSize = files[0].size;
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

   plupload.each(files, function (file) {
      //上传首页封面回调
      if (data.type == '1') {
        return fistScreenStart(up, file);
      }//上传视频之前回调
      else if (data.type == '2') {
        return secondVideoStart(up, file);
      }
      // 上传视频封面回调
      else if (data.type == '3') {
        return coverImgStart(up, file,uploader);
      }//替换封面之前回调
      else if (data.type == '4') {
        return coverLoadStart(up, file);
      }//上传图片之前回调
      else if (data.type == '5') {
        return ImgLoadStart(up, file);
      }
      else if (data.type == '6') {
        return goodLoadStart(up, file);
      }
    });
    startUpload(up);
  });
  // 错误处理
  uploader.bind('Error', function (up, err, file) {
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
        return fistScreenEnd(src);
      } else if (data.type == '2') {
        return secondVideoEnd(src);
      }
      else if (data.type == '3') {
        return coverImgEnd(src, file);
      }
      else if (data.type == '4') {
        return coverLoadEnd(src);
      }
      else if (data.type == '5') {
        return ImgLoadEnd(src);
      }
      else if (data.type == '6') {
        return goodLoadEnd(src);
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
  else if (data.flag == "video") {
    obj = [{
      title: "视频文件",
      extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv"
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
function startUpload(up) {
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

//上传首页封面之前回调
function fistScreenStart(up,file) {
  //动态添加
  up.randomName = randomName();
  videoImgtip = layer.load(1);
  // $(function(){
	// 	$('#imgUploadBtn').click(function(){
	// 		var _this = $(this);//存储触发元素，以备后面调用
	// 		$(this).attr('disabled',true);//禁用按钮
	// 		$('#load-layout').show();
	// 	});
	// });
}

//首页封面上传完成
function fistScreenEnd(src) {
  layer.close(videoImgtip);
  $(".blank_img").hide();
  $(".fistcenter_img").show().css("backgroundImage",'url('+src+')');

  // 上传封面
  var param = {
      coverImg: src,
      shopId: shopId
  }
  reqAjaxAsync('shopFullScreen/updateFirstPagePicture', JSON.stringify(param));
}

//上传视频之前回调
function secondVideoStart(up, file) {
  up.randomName = randomName();
  videotip = layer.load(1);
}

//上传视频完成回调
function secondVideoEnd(src, file) {
  layer.close(videotip);
  layer.msg('视频已上传完成，请继续上传视频封面');
   layer.open({
    type: 1,
    title: ['上传视频封面','text-align:center'],
    area: ['600px', '600px'],
    btn: ['确定'],
    anim: 5,
     closeBtn: 0,
    content: $('#cover_box'),
     end:function () {
       $('#cover_box').hide();
       $("#cover_box .goodsChooseFather").show();
       $("#cover_box .haveUpload").hide();
     },
    yes: function(indexs, layero){
      //如果没有上传封面不能保存
      if(!$("#cover_box .goodsChooseFather").is(":hidden")){
        return layer.msg("请上传视频封面")
      }

      var albumId = $("#choose_videoBox .centerBtn .active").attr("data-id");
      var coverPath=$("#cover_box .choosedCoverImg").attr("src");
      var param = {
        albumId: albumId,
        remark: "",
        contentUrl: src,
        extend1: '',
        shopId: shopId,
        coverPath: coverPath,
        contentType: 1
      }
      reqAjaxAsync('shopFullScreen/savePhoto', JSON.stringify(param)).done(function(res) {
        if(res.code==1){
          layer.close(indexs);
          var index = $("#choose_videoBox .centerBtn .active").index();
          $("#choose_videoBox .centerBtn li").eq(index).click();
        }
      });
    }
  });
}

//上传封面预览回调
function coverImgStart(up, file) {
  up.randomName = randomName();
  videoCovertip = layer.load(1);
}

//封面上传完成回调
function coverImgEnd(src, file) {
  layer.close(videoCovertip);
  $("#cover_box .goodsChooseFather").hide();
  $("#cover_box .haveUpload").show();
  $("#cover_box .haveUpload .choosedCoverImg").attr('src',src)
}

//替换封面之前回调
function coverLoadStart(up, file) {
  up.randomName = randomName();
  videoCovertip2= layer.load(1);
}
    
//封面上传完成
function coverLoadEnd(src) {
  layer.close(videoCovertip2);
  // 替换封面
  $("#cover_box .choosedCoverImg").attr("src", src);
}

//上传图片
function ImgLoadStart(up, file) {
  up.randomName = randomName();
  IMGCovertip= layer.load(1);
}

//上传图片完成回调
function ImgLoadEnd(src) {
  layer.close(IMGCovertip);

  var albumId = $("#choose_videoBox .centerBtn .active").attr("data-id");
  var param = {
    albumId: albumId,
    remark: "",
    contentUrl: src,
    extend1: '',
    shopId: shopId,
    coverPath: '',
    contentType: 0
  }
  reqAjaxAsync('shopFullScreen/savePhoto', JSON.stringify(param)).done(function(res) {
    if(res.code==1){
      var index = $("#choose_videoBox .centerBtn .active").index();
      $("#choose_videoBox .centerBtn li").eq(index).click();
    }
  });
}

//上传商品图片预览
function goodLoadStart(up, file) {
  up.randomName = randomName();
  goodImg= layer.load(1);
}
//上传商品完成
function goodLoadEnd(src) {
  layer.close(goodImg);
$("#add_goods").hide();
$("#choose_goodsBox .haveUpload").show();
  $("#choose_goodsBox .choosedGoodImg").attr("src", src);

}