 // 原始数据
 var dataRaw;
 if (localStorage.hasOwnProperty('certificateData')) {
     dataRaw = JSON.parse(localStorage.getItem('certificateData'));
     localStorage.removeItem('certificateData');
 }
 $(function() {
     initData();
     initUploader($('.well')[0]);
 })

 // 初始化数据
 function initData() {
     if (!dataRaw) return parent.layer.closeAll();
     var params = {
         id: dataRaw.id,
         serviceId: dataRaw.serviceId
     }
     var successFunc = function(data) {
         if (data.code != 1) layer.msg(data.msg, {
             icon: 2
         })
         if (data.code == 1) {
             var skill = data.data.skill;
             $('table td').each(function() {
                 if (this.id && this.id != 'certList') $('#' + this.id).text(skill[this.id])
             })
             $('#userPic').attr('src', skill.userPic);
             $('#certUrl').attr('src', data.data.cert.certUrl);
             var certList = skill.certList;
             if (certList.length == 0) return $('#certList').parent().remove();
             for (var i = 0; i < certList.length; i++) {
                 $('#certList').append('<img src="' + certList[i].certUrl + '">');
             }
         }
     }
     myAjax('newservice/findExaminingCertDetail', JSON.stringify(params), successFunc)
 }

 // 上传初始化
 function initUploader(dom) {
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
     uploader.bind('FilesAdded', function(up, files) {
         statrUpload(up);
         $(dom).find('.progressContent').show()
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
             var src = OSSParams.host + '/' + OSSParams.dir + '/' + OSSParams.randomName;
             $(dom).find('img').attr('src', src);
             $(dom).find('.progressContent').fadeOut(200);
             $(dom).siblings('.moxie-shim').css('height', $(dom).height());
         } else {
             layer.msg("上传失败，请重试");
         }
     });
     uploader.init();
 }

 // 文件上传
 function statrUpload(up) {
     getOssParams().then(function(data) {
         var fileName = data['dir'] + '/' + data['randomName'];
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

 // 通过或拒绝
 function changeStatus(status) {
     var params = {
         id: dataRaw.id,
         serviceId: dataRaw.serviceId,
         status: status,
         remark: $('#remark').val(),
         imageUrl: $('#imageUrl').attr('src')
     };
     // 通过时校验图片
     if (status == 2) {
         var imageUrl = $('#imageUrl').attr('src');
         if (imageUrl.length == 0) return layer.msg('审核通过请上传对应图片！', {
             icon: 2
         });
     }
     // 不通过时校验备注
     if (status == 3) {
         var remark = $.trim($('#remark').val());
         if (remark.length == 0) return layer.msg('审核不通过请填写审核意见！', {
             icon: 2
         });
     }
     var successFunc = function(data) {
         layer.msg(data.msg, {
             icon: data.code == 1 ? 1 : 2
         })
         if (data.code == 1) {
             parent.refreshTable();
             parent.layer.closeAll('iframe');
         }
     }
     myAjax('newservice/checkCertStatus', JSON.stringify(params), successFunc)
 }