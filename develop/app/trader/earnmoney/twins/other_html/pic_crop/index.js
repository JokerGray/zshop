var imgOss = '';
//转换成http 形式
$(document).ready(function(){
    initUpload2(document.querySelector("#uploadNow"));
    initJcrop();
})

// 文件上传，直传
function initUpload2(dom){
    window.uploader = new plupload.Uploader({
         runtimes: 'html5,html4',
         browse_button: dom,
         multi_selection: false,
         url: 'http://oss.aliyuncs.com',
         filters: {
             mime_types: [{
                 title: "图片文件",
                 extensions: 'jpg,jpeg,png,bmp'
             }],
             max_file_size: "10mb",
             prevent_duplicates: false
         }
    });
    // 直接设置当前随机名称，避免多个上传的命名问题
    window.uploader.randomName = randomName();
     // 添加文件则直接上传
     window.uploader.bind('FilesAdded', function(up, files) {
        // console.log('准备文件上传');
         startUpload(up)
     });
     // 错误处理
     window.uploader.bind('Error', function(up, err) {
         if (err.code == -600) {
             layer.alert("选择的文件过大");
         } else if (err.code == -500) {
             layer.alert('初始化错误')
         } else if (err.code == -601) {
             layer.alert("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
         } else if (err.code == -602) {
             layer.alert("这个文件已经上传过一遍了");
         } else {
             layer.alert("系统繁忙，请稍后再试!");
         }
     });
     // 成功处理
     window.uploader.bind('FileUploaded', function(up, file, info) {
         if (info && info.status == 200) {
             var src = OSSParams.host + '/' + OSSParams.dir + '/' + up.randomName;
            layer.alert('图片裁剪成功');
            imgOss = src;
         } else {
             layer.alert("上传失败，请重试");
         }
        up.removeFile(up.files[0]);
        up.randomName = randomName();
     });
     // 最后初始化
     window.uploader.init();
}

 // 文件上传正式方法
 function startUpload(up) {
    // console.log('获取上传参数...')
     getOssParams().then(function(data) {
        // console.log('上传参数获取成功，正在上传...')
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
        var loadIndex=layer.load();
        $.ajax({
            url: '/zxcity_restful/ws/oss/ossUpload',
            dataType: 'json',
            success: function(data) {
                OSSParams = data;
                defer.resolve(data);
                layer.close(loadIndex);
            },
            error: function() {
                layer.close(loadIndex);
                defer.reject();
                layer.alert('上传参数获取失败！');
            }
        });
    }
    return defer.promise();
}

 var imgCrop;
 var imgClass;
 $(function() {
     imgClass = $("#imgClass").val();
         maxW = 172;
         maxH = 125;
   
     $('.previewContainer').width(maxW).height(maxH);
     $('.desc').html('图片尺寸:' + maxW + '*' + maxH + '像素').show();

     $("#ipt").change(function(ev) {
         var reader = new FileReader();
         var files =  ev.target.files;
         if(!/image\/\jpeg|jpg|png/.test(files[0].type)){ 
             alert("只支持jpg,png格式");
             $(this).val("");
             return ; 
         }
         if(files[0].size>5*1024*1024){
             alert('文件过大');
             $(this).val("");
             return ;
         }
         reader.readAsDataURL(this.files[0]);
         reader.onload = function() {
             var imgUrl = reader.result;
             imgURL = imgUrl;
            // 每次上传图片时，showImg宽高初始化为0
            $('#showImg').css({'width':0,'height':0});

             $('#showImg').attr('src', imgUrl);
             $('.jcropPreview').attr('src', imgUrl);
             initJcrop();
         }
     });
 })
var maxW, maxH, jcrop_api, boundx, boundy, $previewContainer = $('.previewContainer');

 function initJcrop() {
     if (window.jcrop_api) {
         window.jcrop_api.destroy();
     }
     $('#showImg').Jcrop({
         onChange : updatePreview,
         allowSelect:false,
         boxWidth : 432,
         boxHeight : 242,
         minSize : [ 10, 10 ],
         aspectRatio : maxW / maxH,
         minSize : [172,125]
     }, function() {
         jcrop_api = this;
         jcrop_api.animateTo([ 0, 0, 300, 300 ]);

         var bounds = this.getBounds();
         boundx = bounds[0];
         boundy = bounds[1];
     });



     function updatePreview(c) {
        var selectHeight = $('.jcrop-holder>div:first-of-type').height();
        var selectWidth = $('.jcrop-holder>div:first-of-type').width();

         if (parseInt(c.w) > 0) {
             var rx = maxW / c.w;
             var ry = maxH / c.h;
         }

         $('.jcropPreview').css({
             width : Math.round(rx * boundx) + 'px',
             height : Math.round(ry * boundy) + 'px',
             marginLeft : '-' + Math.round(rx * c.x) + 'px',
             marginTop : '-' + Math.round(ry * c.y) + 'px'
         });


         if (!window.myCanvas) {
             window.myCanvas = document.createElement("canvas");
         }
         myCanvas.width = c.w;
         myCanvas.height = c.h;
         myCanvas.getContext('2d').drawImage($('#showImg')[0], c.x, c.y, c.w,
                 c.h, 0, 0, c.w, c.h);
         imgCrop = myCanvas.toDataURL("image/png");
         window.imgCrop = imgCrop;
     }
 };


function uploadCrop(){

     if(boundx < 172 && boundy < 125){
        layer.alert('建议选取图片宽度大于172像素 高度大于125像素');
        return false;
     }


    var def = $.Deferred();
    window.myCanvas.toBlob(function (blob) {
        window.uploader.addFile(blob)
    });
}

var callbackdata = function() {
    uploadCrop();
     var data = {
         imgClass : imgClass,
         imgCrop : imgCrop,
        fileImg : $('#ipt')[0].value,
        imgOss : imgOss
    };
    return data;
}