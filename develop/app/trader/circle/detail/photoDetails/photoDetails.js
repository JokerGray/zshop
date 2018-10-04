$(function(){
	init();
	//上传图片
	initUpload(document.querySelector("#upPhoto"));
	//图片弹出
	
	
	//返回
	$('#cancel').on('click',toClose);

	$('#batchBtn').on('click',function(){
		$('#cancel').off('click',toClose).on('click',toOff);
		
		$('.imgPreview').off();
		$('.btnBro li').toggle();
		$('.iconCheck').show();
		$('.priData').on('click',function(e){
			var state = $(this).attr('data-selected');
		
			if(state=="0"){
				$(this).find('.iconCheck').toggleClass('active');
				$(this).attr('data-selected','1');
				
			}else{
				$(this).find('.iconCheck').toggleClass('active');
				$(this).attr('data-selected','0');
				
			}
			var size = $('.priData[data-selected="1"]').length
			$('#removeBtn').html('删除('+size+')');
			$('#downloadBtn').html('下载('+size+')');
		})
	}) 
})
//批量删除图片
$('#removeBtn').click(removePris);
function removePris(){
	var idArr = [] ;
	$('.priData[data-selected="1"]').each(function(index, el) {
		idArr.push($(el).find('input[name="id"]').val())
	});
	if(idArr.length==0){
		return parent.window.index.sweetAlert('请选择照片','warning');
	}else{
		parent.layer.confirm('是否删除照片', {
			  btn: ['确定','取消'] //按钮
		},function(){
			var cmd = "circle/delBackPhotos";
			var data = {
				id: idArr.join(','),
				circleId: params.circleId,
				userId: params.userId
			}
			ajaxAsy(cmd, data, function(re) {
				$('.priData[data-selected="1"]').remove();
				parent.layer.closeAll();
				
				$('#removeBtn').html('删除(0)');
				$('#downloadBtn').html('下载(0)');
			});
		})
	}
}
//取消
function toClose(){
	parent.window.index.prisBack();
}
//取消批量管理
function toOff(){
	$('.imgPreview').on('click',imgContent);
	$('.btnBro li').toggle();
	$('.iconCheck').removeClass('active').hide();
	$('.priData').attr('data-selected','0').off('click');
	$('#removeBtn').html('删除(0)');
	$('#downloadBtn').html('下载(0)');
	$('#cancel').off('click',toOff).on('click',toClose);
}
	
//图片弹框
function imgContent(){
	var $dom = $(this).parents('.priData'),
	id = $dom.find('input[name="id"]').val(),
	url = $dom.find('.photosImg').attr('src'),
	userName = $dom.find('.puberName').text().trim(),
	albumTime = $dom.find('.pubDate').text().trim();
	circleId = params.circleId;
	userId = params.userId
	$dom.addClass('opened');
	parent.window.index.openImg({id,url,userName,albumTime,circleId,userId});
}

// 文件上传初始化
function initUpload(dom) {
	var OSSrls=[]
	var uploader = new plupload.Uploader({
		runtimes: 'html5,html4',
		browse_button: dom,
		multi_selection: true,
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
	uploader.randomName = randomName();
	  // 添加文件则直接上传
            uploader.bind('FilesAdded', function(up, files) {
//            	statrUpload(up,files);
            	getOssParams().then(function(data){
            		up.start();
            	},function(){
            		up.stop();
            	})
            	parent.window.index.progress(up,files);
            	
            });
            uploader.bind('BeforeUpload',function(up, file) {
					file.name = randomName();
					var fileName = OSSParams['dir'] + '/' + file.name;
	                up.setOption({
                    url: OSSParams['host'],
                    multipart_params: {
                        key: fileName,
                        policy: OSSParams['policy'],
                        OSSAccessKeyId: OSSParams['accessid'],
                        success_action_status: 200,
                        signature: OSSParams['signature']
                    }
                });
            })
            // 错误处理
            uploader.bind('Error', function(up, err) {
            	if(err.code == -600) {
            		return window.parent.index.sweetAlert('文件过大');
            	} else if(err.code == -500) {
            		return window.parent.index.sweetAlert('初始化错误');
            	} else if(err.code == -601) {
            		return window.parent.index.sweetAlert('不支持该文件类型');
            	} else if(err.code == -602) {
            		return window.parent.index.sweetAlert('这个文件已经上传过一遍了');
            	} else {
            		return window.parent.index.sweetAlert('系统繁忙，请稍后再试!'); 
            	}
            });
            // 成功处理
            uploader.bind('FileUploaded', function(up, file, info) {
            	if(info && info.status == 200) {
            		var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
            		OSSrls.push(src);
            	} else {
            		console.log("上传失败，请重试");
            	}
            });
            uploader.bind('UploadComplete', function(up, files) {
 				postImg(OSSrls)
 				OSSrls=[];
            });
            // 最后初始化
            uploader.init();
            }



// 自定义随机名称，共36位
function randomName(len) {
	len = len || 23;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var str = '';
	for(i = 0; i < len; i++) {
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
            success: function(data) {
                OSSParams = data;
                defer.resolve(data);
            },
            error: function() {
            	defer.reject();
                console.log('上传参数获取失败！')
            }
        });
    }
    return defer.promise();
}
function postImg(arg){
	var imgUrl = arg.join(",");
	var cmd = 'circle/addBackPhones';
	var data = {
		urls:imgUrl,
		albumId:params.albumId,
		userId:params.userId,
		circleId:params.circleId
	};
	ajaxAsy(cmd,data,init);
}

//批量下载
$('#downloadBtn').click(downPris)
function downPris(){ 
	var idArr = [] ;
	$('.priData[data-selected="1"]').each(function(index, el) {
		var url = $(el).find('.photosImg').attr('src')
		idArr.push(url);
//		idArr.push($(el).find('.photosImg').arrt('src'))
	});
	if(idArr.length==0){
	return parent.window.index.sweetAlert('请选择照片','warning');
	}else{
		idArr.map(function(i){
			var a = document.createElement('a');
			a.setAttribute('download','');
			a.href=i;
			document.body.appendChild(a);
			a.click();
			a.remove();
		})
	}
}
 var params = new Object(),valve=true;
function init(){
	  var url = location.search;
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
       	var cmd = "circle/getBackPhones";
       	var callback = function(re){
       		console.log(re)
       		var html = template('pList',re);
       		$('.priList').html(html);
       		$('.imgPreview').on('click',imgContent);
       	}
       	ajaxAsy(cmd,{albumId:params.albumId,circleId:params.circleId},callback)
}
function ajaxAsy(cmd,data,callback){
	var apikey = params.apikey || 'test';
	var version = params.version || "1";
	var data = JSON.stringify(data);
	if(valve) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				cmd: cmd,
				data: data
			},
			beforeSend: function(request) {
				valve = false
				request.setRequestHeader("apikey", apikey);
			},
			success: function(re) {
				valve = true;
				if(re.code == 1) {
					callback(re);
				} else {
					console.log(re)
				}
			},
			error: function(re) {
				//console.log(re);
			},
			complete: function() {
				valve = true
			}
		});
	}
}
