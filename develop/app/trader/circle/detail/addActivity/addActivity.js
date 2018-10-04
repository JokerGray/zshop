$(function(){
	$('input,textarea').bind('input propertychange change',function(){
		detaInteract()
	})
	detaInteract();
	function AddActivity(){
		this.init();
		
	}
	$.extend(true, AddActivity.prototype,{
		init:function(){
			this.getParams();
			this.getData();
		},
		getParams: function() {
				var url = location.search;
				var params = new Object();
				if(url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for(var i = 0; i < strs.length; i++) {
						params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
					}
				}
				this.params = params;
			},
		ajaxAsy: function(cmd, datas, callback) {
				var that = this;
				var apikey = that.params.apikey || 'test';
				var data = JSON.stringify(datas);
				if(that.permit){
					$.ajax({
						type: "POST",
						url: "/zxcity_restful/ws/rest",
						dataType: "json",
						data: {
							cmd: cmd,
							data: data
						},
						beforeSend: function(request) {
							
							layer.load(1,{shade:[0.3,"#fff"]})
							request.setRequestHeader("apikey", apikey);
							that.permit = false;
						},
						success: function(re) {
								
								callback(re);
						},
						error: function(re) {
							parent.window.index.sweetAlert('网络错误,稍后重试',"warning")
						},
						complete:function(re){
							layer.closeAll();
							that.permit = true;
						}
					});
				}
			},
		getData: function() {
				var that = this;
				var cmd = "circle/getCanIReleaseVideoAndActivity";
				var datas = {
					type : 2, userId: that.params.userId, circleId: that.params.circleId||"",shopId:that.params.shopId
				};
				var callback = that.setData;
				that.ajaxAsy(cmd, datas, callback);
			},
		setData:function(re){
			console.log(re)
			if(re.code==1){
				$('.container-fluid').show();
				for(var i = 0; i < re.data.length; i++) {
					var options = $('<option value="' + re.data[i].circleId + '"  data-img="' + re.data[i].logo + '" data-place="'+ re.data[i].place+'" data-lng="'+re.data[i].lng+'" data-lat="'+re.data[i].lat+'">' + re.data[i].circleName + '</option>');
					$('#selectCircle').append(options);
				}
				$('#selectCircle').select2({
				templateResult: formatState,
				templateSelection: formatState
			})
			$('#selectCircle').on("select2:select",function(e){
				detaInteract()
			})
			function formatState(state){
				if(!state.id){return state.text;};
				var $state = $('<span><img src="' + $(state.element).attr('data-img') + '" class="imgFlag"  /> ' + state.text + '</span>');
				return $state; 
			};
			detaInteract();
			}else if(re.code==9){
				parent.index.sweetAlert('当前帐号暂无权限','warning');
				setTimeout(function(){
					parent.$('#aDetaBack').trigger()
				},1000)
				
			}
		},
		permit:true
	})
	window.addActivity = new AddActivity();
	var date = new Date();
	$('.activityDate').datetimepicker({
		format: 'yyyy-mm-dd hh:ii:ss',
		autoclose:true,
		startDate: date,
		language:'zh-CN',
		showMeridian:true
	});
	 $('#address').on("click",function(){
	 	var place =$('option:selected').attr("data-place");
	 	var lng = $('option:selected').attr("data-lng");
	 	var lat = $('option:selected').attr("data-lat");
	 	layer.open({
	 		type: 2,
	 		area: ['800px', '500px'],
	 		btn: ['确定','取消'],
	 		fix: false, 
	 		maxmin: true,
	 		title : "选择地址", 
	 		content: './map.html?place='+place+'&lng='+lng+'&lat='+lat,
	 		yes:function(index,layero){
	 			var info = window["layui-layer-iframe" + index].callbackdata();
	 			var adcode = info.adcode+"";
	 			adcode = adcode.slice(0,4);
	 			$('input[name="address"]').val(info.address);
	 			$('input[name="lat"]').val(info.lat);
	 			$('input[name="lng"]').val(info.lng);
	 			$('input[name="adcode"]').val(adcode);
	 			layer.close(index);
	 			detaInteract()
	 		}
	 	})
	 })
	$('.imgshadow').off().on('click',function(){
		$('#upFace').click();
	})
	initUpload({dom:"upFace",flag:[{
		title: "图片文件",
		extensions: "jpg,png"
	}],fileSize:"10mb",UploadedCallback:function(src){
		$('#url').val(src);
		$('#upFace').attr('src',src);
		$('.imgshadow').show();
	}});
	initUpload({dom:"videoShow",flag:[{
		title: "视频文件",
		extensions: "mp4,avi,rmvb,mkv,wmv,m4v,3gp"
	}],fileSize:"50mb",AddedCallback:getVideoPoster,UploadedCallback:function(src){
		$('input[name="videoUrl"]').val(src)
	}});
	createImg();
})
var size = 0;
var OSSParams;
function createImg(){
	var imgContent = $('#imgBox').clone();
	imgContent.attr('id', '');
	var imgShowId = 'imgShow' + size;
	imgContent.find('#imgShow').attr('id', imgShowId).load(function(){
		$(this).siblings('.closeImg').show();
		$(this).parents('.imgContent').addClass('active');
		$(this).siblings('.noSrc').hide();
		if($('.pictureBox .noSrc').not(':hidden').length < 1 && $('.imgContent').length < 10) createImg();
		// dataInteract();
	});
	$('#imgBox').parent().append(imgContent.show());
	initUpload({dom:imgShowId,flag:[{
		title: "图片文件",
		extensions: "jpg,png"
	}],fileSize:"10mb"})
	size++;
}

// oss上传
function initUpload(arg){
	var uploader =  new plupload.Uploader({
		runtimes: 'html5,html4',
		browse_button:arg.dom,
		multi_selection: false,
		unique_names:true,
		url: 'https://oss.aliyuncs.com',
		filters: {
			mime_types:arg.flag,
			max_file_size: arg.fileSize,
			prevent_duplicates: false
		}
	});
	uploader.init();
	uploader.bind('FilesAdded', function(up, files) {
		statrUpload(up,files[0]);
		if(arg.AddedCallback){
			arg.AddedCallback(files)
		}
		// 进度
		parent.window.index.progress(up,files,function(){
			if($('#'+arg.dom).siblings('.closeImg')){
				$('#'+arg.dom).siblings('.closeImg').trigger('click');
			}else{
				$('#upFace').attr('src','./image/upFace.png');
				$('.imgshadow').hide();
				$('#url').val('');
			}
			
		});
	});
	uploader.bind('Error', function(up, err, file) {
		if(err.code == -600) {
			parent.layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内");
		} else if(err.code == -500) {
			parent.layer.msg('初始化错误')
		} else if(err.code == -601) {
			parent.layer.msg("不支持该文件格式");
		} else if(err.code == -602) {
			parent.layer.msg("这个文件已经上传过一遍了");
		} else {
			parent.layer.msg("系统繁忙，请稍后再试!");
		}
	});
	uploader.bind('FileUploaded', function(up, file, info) {
		if(info && info.status == 200) {
			var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
			if(arg.UploadedCallback){
				arg.UploadedCallback(src);
			}else{
				$('#'+arg.dom).attr('src',src);
			}
			detaInteract()
		} else {
			parent.layer.msg("系统繁忙，请稍后再试!");
		}
	});
	function statrUpload(up,file) {
		getOssParams().then(function(data) {
			  file.name = randomName();
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
	
	function getOssParams() {
		var defer = $.Deferred();
		if(OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
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
					parent.layer.closeAll();
					parent.layer.msg("系统繁忙，请稍后再试!");
				}
			});
		}
		return defer.promise();
	}
};

//上传视频前拿到封面
function getVideoPoster(files){
	var video = $('<video></video>');
	var file = files[0].getNative();
	video.attr('src', getObjectURL(file));
	video[0].addEventListener('loadeddata', function() {
		if(!window.canvas) {
			window.canvas = document.createElement("canvas");
		}
		canvas.width = $('#videoShow').width();
		canvas.height = $('#videoShow').height();
		canvas.getContext('2d').drawImage(video[0], 0, 0, canvas.width, canvas.height);
		var posterSrc;
		if(canvas.toDataURL("image/png")) {
			posterSrc = canvas.toDataURL("image/png");
		}
		$("#videoShow").attr('src',posterSrc).siblings('.closeImg').show();
	})
}

function getObjectURL(file){
    var url = null ; 
    if (window.createObjectURL!=undefined){ // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined){ // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined){ // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}
//删除视频
function clearVideo(dom){
	$(dom).hide().siblings('.imgShow').attr('src',"./image/noSrc.png");
	$('input[name="videoUrl"]').val('');
	detaInteract()
}
//删除图片
function closeImg(dom){ 
	$(dom).parents('.imgContent').remove();
	if ($('.pictureBox .noSrc').not(':hidden').length < 1&& $('.imgContent').length < 10)createImg();
	detaInteract();
}
function detaInteract(){
	var evt = new Event('detaInteract');
	evt.prefix = 'addActivity';
	var urllist = [];
	$('.imgShow').each(function(){
		if(this.src)urllist.push(this.src);
	})
	evt.params = {
		cover: $('#url').val(),
		name:$('#circleName').val(),
		startTime:$('#activityDate').val(),
		address:$('#address').val(),
		avePrice:$('#avePrice').val(),
		circleName:$('#selectCircle option:selected').text(),
		circleLogo:$('#selectCircle option:selected').attr('data-img'),
		applyQualification:$('input[name="radio"]:checked').val(),
		content:$('#circleDuc').val(),
		contentVideo:$('#videoUrl').val(),
		contentCoverUrl:$('.videoShow').attr('src'),
		contentUrl:urllist
	};
	parent.window.dispatchEvent(evt);
}
$('#toBack').click(function(){
	if(parent.$('#aDetaBack')[0]){
		parent.$('#aDetaBack').trigger('click');
	}else{
		parent.$('.pubBg').html('').hide().siblings('.bgPhone').show();
		parent.$('#activityErrorMsg').remove();
		parent.$('#setTeam').addClass('active').siblings('.btn').removeClass('active');
		parent.$('#myIframe').css('height','0').attr('src',"");
	}
	
})
//输入框只能输入数字，并且只能含有2为小数
function clearNoNum(obj){
	obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
	obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}
$('#submitBtn').click(function(){
	if($('#url').val()==""||!$('#url').val()){
		return parent.layer.msg('请选择背景图片')
	}
	if(!/\S{4,25}$/.test($('#circleName').val())){
		return parent.layer.msg('请正确输入活动名称')
	}
	if($('#activityDate').val()==""){
		return parent.layer.msg('请选择活动开始时间')
	}
	if($('#address').val()==""){
		return parent.layer.msg('请选择活动地址')
	}
	if($('#avePrice').val()==""||!/^([1-9][0-9]{0,5}|[1-9])$/.test($('#avePrice').val())){
		return parent.layer.msg('请正确输入金额')
	}
	if($('#circleDuc').val()==""){
		return parent.layer.msg('请填写活动介绍')
	}
	var isNaming ,isSponsor ;
	$('#naming')[0].checked?isNaming=1:isNaming=0;
	$('#begger')[0].checked?isSponsor=1:isSponsor=0;
	var urllist = [];
	$('.imgShow').each(function() {
		if(this.src) urllist.push(this.src);
	})
	/* 
	var cmd = "activityNew/createBackActivity";
	var data = {
		creator:addActivity.params.userId,
		cover : $('#url').val(),
		name : $('#circleName').val(),
		startTime : $('#activityDate').val(),
		type: 1,
		address : $('#address').val(),
		applyQualification:$('input[name="radio"]:checked').val(),
		activityDetails:$('#circleDuc').val(),
		avePrice : $('#avePrice').val(),
		isNaming:isNaming,
		isSponsor:isSponsor,
		contentUrl : urllist.join(',') || "",
		contentVideo:$('#videoUrl').val(),
		contentCoverUrl:$('.videoShow').attr('src'),
		lng : $('#lng').val(),
		lat : $('#lat').val(),
		cityId : $('#adcode').val(),
		circleId : $('#selectCircle').val()
	}
	 */
	var cmd = "circle/insertCircleRecord";
	var data = {
		userId:addActivity.params.userId,
		recordTitle:
	}
	addActivity.ajaxAsy(cmd,data,function(re){
		if(re.code==1){
			parent.index.pubActivityCallback();
		}else{
			parent.index.sweetAlert(re.msg,"warning")
		}
	})
})
