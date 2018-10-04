$(function(){
	init();
	
	$('input,textarea').bind('input propertychange change',function(){
		detaInteract()
	})
})
var params = getParams() ,OSSParams;
function init(){
	var datas = {
		cmd : 'circle/getCircleByID20',
		data : JSON.stringify({
		userId : params.userId,
		detailId : params.circleId
	})
	},
	apikey = params.apikey||"test";
	ajaxAsync(datas,apikey).then(function(re){
		if(re.code==1){
			initUpload({
				dom:"setFace",
				showDom : "upFace"
			})
			if(re.data.isManager>0){
				var data = re.data
				$('#upFace').attr('src', data.detailTitlePic + '?x-oss-process=image/resize,m_fill,w_340,h_220,limit_0');
				$('#url').val(data.detailTitlePic);
				$('#detailName').val(data.detailName);
				ajaxAsync({
					cmd: 'circle/getShopNameByShopId',
					data: JSON.stringify({
						shopId: params.shopId
					})
				}, apikey).then(function(msg) {
					$('.storeName').html(msg.data.shopName);
					detaInteract()
				});
				
				ajaxAsync({
					cmd: 'circle/getMLNew',
					data: JSON.stringify({
						sStartpage: 1, markBusiness: "B" ,sPagerows: 40
					})
				}, apikey).then(function(re) {
					if(re.code == 1) {
						console.log(data)
						var detailMarkName = data.detailMarkName.split(',');
						$('#detailMarkName').val(data.detailMarkName);
						for(var i = 0; i < re.data.length; i++) {
							var sp;
							if(detailMarkName.hasVal(re.data[i].markContent)){
								sp = '<button class="btn btn-info btn-sm serviceMark" type="button"  disabled="disabled" value="' + re.data[i].markContent + '">' + re.data[i].markContent + '</button>'
							}else{
								sp = '<button class="btn btn-white btn-sm serviceMark" type="button"  disabled="disabled" value="' + re.data[i].markContent + '">' + re.data[i].markContent + '</button>'
							}
							$('#markBox').append(sp);
						}
						$('.serviceMark').on('click', function() {
							var input = $(this).siblings('input');
							var arr = [];
							var cke = $('.serviceMark.btn-info').length
							if(cke < 4 || $(this).hasClass('btn-info')) {
								$(this).toggleClass('btn-info').toggleClass('btn-white');
							} else {
								return
							}
							$('.serviceMark.btn-info').each(function() {
								arr.push($(this).attr('value'));
							});
							$('#detailMarkName').val(arr.join());
							detaInteract()
						})
						detaInteract()
					}
				});
				if(data.isValidate=="0"){
					$('label[for="r1"]').trigger('click');
				}else{
					$('label[for="r2"]').trigger('click');
				}
				$('input[type="radio"]').attr('disabled','disabled');
				$('#detailTitle').val(data.detailTitle)
				detaInteract()
			}
		}
	})
}

// 通用异步请求
function ajaxAsync(params, apikey) {
    var def = $.Deferred();
    $.ajax({
        url: '/zxcity_restful/ws/rest',
        type: 'post',
        dataType: "json",
        headers: {
            apikey: apikey
        },
        data: params,
        success: function(data) {
            def.resolve(data)
        },
        error: function(err) {
            layer.msg('连接失败！请检查网络或稍后再试！', {icon: 2});
            def.reject(err);
        }
    });
    return def;
}

function getParams(){
	var url = location.search;
	var params = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return params
}

//
Array.prototype.hasVal = function(val){
	for(let i = 0 ; i< this.length; i++){
		if(this[i]==val){
			return true ;
		}
	}
	return false;
};

$('.glyphicon-edit').off().on('click',function(){
	$('.glyphicon-edit').show();
	$('.edit').hide();
	var group =  $(this).parents('.form-group');
	group.siblings('.form-group').find('input,button,textarea').attr('disabled','disabled');
	$(this).hide().siblings('.edit').show();
	group.find('input,button,textarea').removeAttr('disabled');
	group.find('.mylabel').trigger('click');
	$('.glyphicon-remove').off().on('click',function(){
		$('.edit').hide();
		$('.glyphicon-edit').show();
		$('.form-group').find('input,button,textarea').attr('disabled','disabled');
	})
})

function initUpload(arg){
	var uploader =  new plupload.Uploader({
                runtimes: 'html5,html4',
                browse_button: arg.dom,
                multi_selection: false,
                unique_names:true,
                url: 'https://oss.aliyuncs.com',
                filters: {
                    mime_types: [{
        			title: "图片文件",
        			extensions: "jpg,png"
        			}],
                    max_file_size: "10mb",
                    prevent_duplicates: false
                }
        });
        	uploader.init();
        	uploader.bind('Error', function(up, err, file){
        		if(err.code == -600){
        			layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内");
        		} else if(err.code == -500){
        			layer.msg('初始化错误')
        		} else if(err.code == -601){
        			layer.msg("不支持该文件格式");
        		} else if(err.code == -602){
        			layer.msg("这个文件已经上传过一遍了");
        		} else {
        			layer.msg("系统繁忙，请稍后再试!");
        		}
        	});
        	uploader.bind('FilesAdded', function(up, files){
        		statrUpload(up,files[0])
        	});
        	uploader.bind('FileUploaded', function(up, file, info){
        		if(info && info.status == 200){
        			var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
        			var oldSrc = $('#'+arg.showDom).attr('src')
        				$('#'+arg.showDom).attr('src', src+'?x-oss-process=image/resize,m_fill,w_340,h_220,limit_0');
        				$('#url').val(src)
        				detaInteract()
        			var apikey = params.apikey || 'test'; 
        				ajaxAsync({
        					cmd : "circle/uptCircle",
        					data : JSON.stringify({
        						sPersonUserId : params.userId,
        						detailId :params.circleId,
        						detailTitlePic : src
        					})
        				},apikey).then(function(re){
        						if(re.code==0){
        							index.circleData.data[index.swiperActiveIndex].url=src
        						}else{
        							parent.window.index.sweetAlert(re.msg,"warning");
        							$('#'+arg.showDom).attr('src', oldSrc);
        							detaInteract()
        						}
        					})
        		} else {
        			parent.window.index.sweetAlert("背景图上传失败，请重试","warning");
        		}
        	});
        	function statrUpload(up, file){
        		getOssParams().then(function(data){
        			file.name = randomName()+file.name;
        			var fileName = data['dir'] + '/' + file.name;
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
        	function randomName(len){
        		len = len || 23;
        		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        		var maxPos = chars.length;
        		var str = '';
        		for(i = 0; i < len; i++){
        			str += chars.charAt(Math.floor(Math.random() * maxPos));
        		}
        		return new Date().getTime() + str;
        	}
       
        	function getOssParams(){
        		var defer = $.Deferred();
        		if(OSSParams && OSSParams.expire > new Date().getTime() / 1000){
        			defer.resolve(OSSParams);
        		} else {
        			$.ajax({
        				url: '/zxcity_restful/ws/oss/ossUpload',
        				dataType: 'json',
        				success: function(data){
        					OSSParams = data;
        					defer.resolve(data);
        				},
        				error: function(){
        					defer.reject();
        					console.log('上传参数获取失败！')
        				}
        			});
        		}
        		return defer.promise();
        	}
}

$('.glyphicon-ok').click(function(){
	var _self =this
	var keyVal = $(this).data('type'),
	apikey = params.apikey || "test" ,
	datas = {
		sPersonUserId : params.userId,
        detailId :params.circleId
	};
	if($('#'+keyVal).val()=="" || $('#detailName').val().length<2){
		var msg ;
		if(keyVal=="detailName")msg="请正确输入圈子名";
		if(keyVal=="detailMarkName")msg="请选择标签";
		if(keyVal=="detailTitle")msg="请正确输入圈子介绍";
		return parent.window.index.sweetAlert(msg,"warning");
	};
	if(keyVal=="isValidate"){
		datas.isValidate = $('input[name="isValidate"]:checked').val();
	}else{
		datas[keyVal] = $('#'+keyVal).val();
	}
	ajaxAsync({
		cmd : 'circle/uptCircle',
		data : JSON.stringify(datas)
	},apikey).then(function(re){
		if(re.code==1){
			parent.index.uploadCircleData(function(){
				parent.index.sweetAlert("修改成功","success");
				$(_self).siblings('.glyphicon-remove').trigger('click');
			});
		}else{
			parent.index.sweetAlert(re.msg,"warning");
		}
	})	
})
function detaInteract(){
			var evt = new Event('detaInteract');
			evt.prefix = 'setCircle';
			evt.params = {
				url:$('#url').val(),
				name:$('#detailName').val(),
				markName:$('#detailMarkName').val(),
				title:$('#detailTitle').val(),
				storeName:$('.storeName').html().trim()
			};
			parent.window.dispatchEvent(evt);
		}