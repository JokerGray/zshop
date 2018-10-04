// 获取抢标赚 发布接口参数
var appUserId = getQueryString('appUserId');

var randomNameCode = '';
var status = true;

// 获取店铺
var def = reqAjax('earnmoney/getUserManageShopListByBackuser', {
	appUserId : appUserId
});
def.then(function(data){
	var rows = data.data;
	$('#shopId >option:first-of-type').attr({'data-userpic':rows[0].logoUrl ,'value':rows[0].id}).text(rows[0].shopName);
	dataInteract();
	
	for(var i = 1;i < rows.length; i++){
		var content = $('#shopId >option').first().clone();
		content.data(rows[i]);
		content.attr({'data-userpic':rows[i].logoUrl ,'value':rows[i].id}).text(rows[i].shopName);
		content.show();
		$('#shopId').append(content);
	}
});
// 数据校验
function checkStata(data){
	if(data.val() == ''){
		data.parent().find('.writeErrow').text('');
		data.addClass('errow').parent().find('.tipinfo .empty').css('display','block');
	}else{
		if(data.hasClass('taskPrice')){
			if(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(data.val())){
				data.removeClass('errow').parent().find('.writeErrow').text('');
			}else{
				 data.addClass('errow').parent().find('.writeErrow').text('请输入正确的金额格式');
			}
		}else if(data.hasClass('taskNeedPerson')){
			if(/^[0-9]+$/.test(data.val())){
				data.removeClass('errow').parent().find('.writeErrow').text('');
			}else{
				data.addClass('errow').parent().find('.writeErrow').text('请输入正确的人数格式');
			}
		}else{
			data.removeClass('errow');
		}
		data.parent().find('.tipinfo .empty').css('display','none');
	}
}

var size = 0;
var validateForm;
$(function(){
	// 初始化验证
	validateForm = initValidateForm();
	
	$('input[type="text"], textarea').on('keyup', dataInteract);
	createItem();
	checkUser();
	dataInteract();
})
		
// 初始化创建一个可点击的
function createItem() {
	if($('.imgContent').length > 8) return;
	var $dom = $($('#tpl').html());

	$dom.find('.imgShow').attr('id','imgShow'+size).click(function(){
		$(this).siblings('input').click();
	}).load(function(){
		$(this).siblings('.imgClose').show();
		$(this).parents('.imgContent').addClass('active');
		$(this).siblings('.imgNoSrc').hide();
	});
	
	$('#imgContentAll').on('click','.col-xs-3',function(){
		if($(this).find('.imgShow').attr('src') != undefined){
			status = false;
		}else{
			status = true;
		}
	});

	if(status === 'true'){
		$('#imgContentAll').append($dom);
	}

	initUpload($dom);
	size++;
}

// 文件上传初始化
function initUpload(dom) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,html4',
        browse_button: dom.find('.imgContent')[0],
        multi_selection: false,
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: [{
                title: "图片文件",
                extensions: 'jpg,jpeg,gif,png,bmp'
            }],
            max_file_size: "100kb",
            prevent_duplicates: false
        }
    });

    // 直接设置当前随机名称，避免多个上传的命名问题
    randomNameCode = randomName();
    
    // 添加文件则直接上传
    uploader.bind('FilesAdded', function(up, files) {
        if(files[0].name.indexOf('lx') > -1) {
            up.removeFile(files[0]);
            return;
        }
        plupload.each(files, function(file) {
            imgPreview(file, function(imgSrc){
				dom.find('.imgShow').attr('src', imgSrc)
            })
        });
        statrUpload(up);
    });

    // 错误处理
    uploader.bind('Error', function(up, err) {
        if (err.code == -600) {
           layer.alert("选择的文件不能大于100kb");
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
    uploader.bind('FileUploaded', function(up, file, info) {
        if (info && info.status == 200) {
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + randomNameCode;
			// src 是该图片的实际路径
            dom.find('.imgShow').attr('src', src);

			dataInteract();
			createItem();
        } else {
            layer.alert("上传失败，请重试");
        }
    });

    // 最后初始化
    uploader.init();
}

// 文件上传正式方法
function statrUpload(up) {
    getOssParams().then(function(data) {
        var fileName = data['dir'] + '/' + randomNameCode;
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
				layer.close(loadIndex);
		        OSSParams = data;
		        defer.resolve(data);
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

// 图片预览
function imgPreview(file, callback){
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
}


// 删除当前图片区域
function closeImg(icon){
	status = true;
	$(icon).parents('.imgContent').parent().remove();
	if($('.imgContent .imgNoSrc').not(':hidden').length < 1 && $('.imgContent').length < 10) createItem();
	dataInteract();
}

// 数据交互方式
function dataInteract(){
	var userPic = $('#shopId option:selected').attr('data-userpic');
	if(!userPic) userPic = $('#userPic').val();
	var arr = [];
	$('.imgContent img').each(function(){
		if(this.src)arr.push(this.src)
	})
	var event = new Event('dataInteract');
	event.prefix = 'qbzDetail';
	event.params = {
		userPic: userPic,
		userName: $('#shopId option:selected').text(),
		taskTitle: $('#taskTitle').val().trim(),
		taskPrice: $('#taskPrice').val().trim(),
		taskNeedPerson: $('#taskNeedPerson').val().trim(),
		taskDemand: $('#taskDemand').val(),
		taskImgs: arr
	}
	parent.window.dispatchEvent(event);
	// 计算总计
	var taskPrice = $('#taskPrice').val();
	var taskNeedPerson = $('#taskNeedPerson').val();
	var count = parseFloat(taskPrice) * parseInt(taskNeedPerson);
	$('#totalCount').text(isNaN(count) ? 0 : count.toFixed(2));
	// 传入userName
	$('#userName').val($('#shopId option:selected').text());
}

// 各种检查格式
function checkForm(needCheck){
	var result = false;
	var taskTitle = $('#taskTitle').val();
	$('#taskTitle').val(taskTitle.trim());
	if(taskTitle.trim().length == 0 && needCheck){
		layer.msg('任务标题不能为空！')
		return result;
	}
}

// 检查
function checkForm(){
	$('.writeContent').each(function(index,element){ 
		if($(this).val() == ''){
			$(this).addClass('errow').parent().find('.tipinfo .empty').css('display','block');
		}
		$(this).val($(this).val().trim()); 
	})

	var taskTitle = $('#taskTitle').val();
	if(taskTitle.length == 0) return layer.msg('任务标题不能为空！', {icon: 2});
	
	var taskPrice = parseFloat($('#taskPrice').val());
	if(taskPrice.length == 0) return layer.msg('请输入抢标价格！', {icon: 2});
	if(isNaN(taskPrice)) {
		$('#taskPrice').addClass('error');
		return layer.msg('抢标价格只能为数字！', {icon: 2});
	}
	if(taskPrice == 0){
		$('#taskPrice').addClass('error');
		 return layer.msg('抢标价格不能为0！', {icon: 2});
	}
	if(taskPrice < 0){
		$('#taskPrice').addClass('error');
		 return layer.msg('抢标价格应大于0！', {icon: 2});
	}
	if(taskPrice >=10000) {
		$('#taskPrice').addClass('error');
		return layer.msg('抢标价格不能大于9999.99！', {icon: 2});
	}
	
	var taskNeedPerson = parseInt($('#taskNeedPerson').val());
	if(taskNeedPerson.length == 0){
		$('#taskNeedPerson').addClass('error');
		return layer.msg('请输入总需人数！', {icon: 2});
	}
	if(isNaN(taskNeedPerson)) {
		return layer.msg('总需人数只能为数字！', {icon: 2})
	}
	if(taskNeedPerson == 0) {
		return layer.msg('总需人数不能为0！', {icon: 2});
	}
	if(taskNeedPerson < 0){
		return layer.msg('总需人数不能小于0！',{icon : 2});
	}
	if(taskPrice < 0){
		$('#taskPrice').addClass('error');
		 return layer.msg('总需人数应大于0！', {icon: 2});
	}

	if( $('#taskDemand').val().trim() =='' || $('#taskDemand').val().trim() == undefined ){
		return layer.msg('任务需求不能为空!', {icon: 2});
	}

	
	var arr = [];
	$('.imgContent img').each(function(){ if(this.src)arr.push(this.src) })
	// if(arr.length == 0) return layer.msg('为了丰富任务内容，请至少需要一张任务照片！', {icon: 2})
	
	for(var i = 0;i < $($('.tipinfo')).length;i++){
		if( $($($('.tipinfo'))[i]).height() > 0 ){
			return layer.msg( ''+$($($('.tipinfo'))[i]).find('.writeErrow').text(),{ icon :2});
		}
	}

	
	layer.confirm('确认发布抢标赚？', submitAfterCheck);
}

// 提交
function submitAfterCheck(){
	var isValid = validateForm.form();
	if(!isValid) return;
	layer.closeAll('dialog');
	var resourceUrl = [];
	var imgLength = $('#imgContentAll .imgShow').length;
	for(var i = 0;i<imgLength-1;i++){
		var imgContentUrl = {'resourceUrl' : $($('#imgContentAll .imgShow')[i]).attr('src')};
		resourceUrl.push(imgContentUrl);
	}
	var shopId = $('#shopId option:selected').val();
	var taskNeedPerson = $('#taskNeedPerson').val();
	var taskPrice = $('#taskPrice').val();
	var taskDemand = $('#taskDemand').val();
	var taskTitle = $('#taskTitle').val();
	var def = reqAjax('earnmoney/addTaskEarn', {
		"resourceList": resourceUrl,
		"shopId" : shopId,
		"userId": appUserId,
		"taskNeedPerson": taskNeedPerson,
		"taskPrice": taskPrice,
		"taskDemand": taskDemand,
		"taskTitle": taskTitle
	});
	def.then(function(data){
		if (data.code == 1) {// 成功
			parent.window.dispatchEvent(new Event('qbzRefresh'));
			parent.window.closeAddPage(true);
			layer.msg('保存成功！', {icon: 1});
		} else if (data.code == 10) {// 字段错误
			layer.msg(data.msg, {icon: 2});
		} else {
			layer.msg(data.msg, {icon: 2});
		}
	}).fail(function(){
		layer.msg("链接超时.....", {icon: 2});
	});
}

function checkUser(){
	var hasMsg = $('#msg').val().length != 0;
	if(hasMsg){
		layer.msg($('#msg').val(), {icon: 2});
		$('#submitBtn').attr('disabled', true);
	}
}

