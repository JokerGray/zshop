//获取分享券 发布接口 参数
var appUserId = getQueryString('appUserId');
// 获取店铺
var def = reqAjax('earnmoney/getUserManageShopListByBackuser', {
	appUserId : appUserId
});
def.then(function(data){
	var rows = data.data;
	$('#shopId >option:first-of-type').attr({'data-userpic':rows[0].logoUrl ,'value':rows[0].id,'merchantId':rows[0].merchantId}).text(rows[0].shopName);
	dataInteract();
	
	for(var i = 1;i < rows.length; i++){
		var content = $('#shopId >option').first().clone();
		content.data(rows[i]);
		content.attr({'data-userpic':rows[i].logoUrl ,'value':rows[i].id,'merchantId':rows[0].merchantId}).text(rows[i].shopName);
		content.show();
		$('#shopId').append(content);
	}
});

var flileImg = '';
var imgOss;
// 图片是否已经改变
var imgChanged = false;
var validateForm;
$(function() {
	// 初始化验证
	validateForm = initValidateForm();
	//图片预览，监听变动
	new uploadPreview({
		UpBtn : "imgUrl",
		DivShow : "imgdiv",
		ImgShow : "imgPreview",
		ImgType:["jpg","png","jpeg","bmp"],
		callback: function () {
			imgChanged = true;
			dataInteract();
		}
	});
	
	// 监听变动
	$('input[type="text"]').on('keyup', dataInteract);
	$('input[type="text"]').on('blur', function(){
		$(this).siblings('.tipinfo').html('');
	});
	parent.domVM($('#imgPreview'));
	$('#shareTitle').text($('#shopId option:selected').text());
});

// 上传图片
function upImg(){
	parent.layer.open({
		type : 2,
		title : '图片裁剪',
		closeBtn : 0,
		skin : '',
		area : [ '820px', '600px' ],
		content : '../../earnmoney/twins/other_html/pic_crop/index.html',
		btn : [ '取消', '确定' ],
		btn2 : function(index) {
			var res = parent["layui-layer-iframe" + index].callbackdata();
			// 剪切后的httpOss路径
			imgOss = res.imgOss;
			if(imgOss == ''){
				parent.layer.msg('请按 "裁剪图片" 按钮 裁剪图片',{icon:2});
				imgOss = '../../src/images/earnmoney/twins/bg_fileupload.png';
			}

			$('#imgPreview').attr('src',imgOss);
			flileImg = res.fileImg;
			
			imgChanged = true;
			dataInteract();
			// setTimeout(function() {
			// 	layer.close(index);
			// }, 8000);
		}
	});
}

// 分享赚类型改变，还需要改变文字
function changeCouponType(){
	$('#couponPresentPrice').parent().toggle();
	$('#couponNum').parent().toggle();
	$('#couponTypeNote').toggle();
	$('.couponTypeBtn').toggle();
	dataInteract();
}

// 获取最小过期时间，明天
function getTomorrow (){
	var date = new Date();
	date.setDate(date.getDate() + 1);
	return date;
}

// 数据交互方式
function dataInteract(){
	var event = new Event('dataInteract');
	event.prefix = 'fxzDetail';
	event.params = {
		shopName: $('#shopId option:selected').text(),
		couponDemand: $('#couponDemand').val(),
		couponOriginalPrice: $('#couponOriginalPrice').val() || 0,
		couponPresentPrice: $('#couponPresentPrice').val() || 0,
		couponCashback: $('#couponCashback').val(),
		imgSrc: imgChanged? $('#imgPreview').attr('src'): '',
		couponExplain: $('#couponExplain').val(),
		expireTime: $('#expireTime').val()
	}
	parent.window.dispatchEvent(event);
	// 图片上下居中		
	parent.domVM($('#imgPreview'));
	// 改变标题
	$('#shareTitle').text($('#shopId option:selected').text());
	// 需要将数据放到支付窗口中
	for(var key in event.params) $('._'+key).text(event.params[key]);
	$('._couponNum').text($('#couponNum').val());
	var val = parseFloat(parseFloat($('#couponCashback').val()) * parseFloat($('#couponNum').val())).toFixed(2);
	$('._sum').text(val);
}

/**
 * 提交form
 * 返回false不会关闭窗口
 * 回调函数，在编辑和保存动作时，供openDialog调用提交表单。
 */
function doSubmit() {
	// 根据类型，未显示的将值置空
	$('#couponPresentPrice:hidden, #couponNum:hidden').val('');
	/**
	 * 进行验证，验证成功就提交
	 */
	var isValid = validateForm.form();
	var couponName = $("#shopId").find("option:selected").text();
	var cityId = $("#shopId").find("option:selected").attr("cityId");
	
	$("#couponName").val(couponName);
	$("#cityId").val(cityId);
	if(!isValid) return;

	// 原价不能少于1.00元
	// 券面价值不能为0，支付价格不能大于券面金额，返现金额不能大于支付价格
	var couponOriginalPrice = parseFloat($("#couponOriginalPrice").val());
	var couponPresentPrice = parseFloat($("#couponPresentPrice").val());
	var couponCashback = parseFloat($("#couponCashback").val());
	if(couponOriginalPrice < 1) {
		$("#couponOriginalPrice").addClass('error');
		return parent.layer.msg("优惠券原金额不能小于1元！", {icon: 2});
	}
	if(couponOriginalPrice >= 100000) {
		$("#couponOriginalPrice").addClass('error');
		return parent.layer.msg("优惠券原金额最多为5位数！", {icon: 2});
	}
	// 优惠券检测实际支付金额
	if($('#couponType').val() == 1) {
		if(couponPresentPrice <= 0){
			$("#couponPresentPrice").addClass('error');
			return parent.layer.msg("实际支付金额必须大于0！", {icon: 2})
		}
		if(couponPresentPrice > couponOriginalPrice){
			$("#couponPresentPrice").addClass('error');
			return parent.layer.msg("实际支付金额不能大于优惠券原金额！", {icon: 2})
		}
		if(couponPresentPrice >= 100000){
			$("#couponPresentPrice").addClass('error');
			return parent.layer.msg("实际支付金额不能大于99999.99！", {icon: 2})
		}
		if(couponCashback > couponPresentPrice){
			$("#couponCashback").addClass('error');
			return parent.layer.msg("转发佣金金额不能大于实际支付金额！", {icon: 2})
		}
	}
	if(couponCashback <= 0){
		$("#couponCashback").addClass('error');
		return parent.layer.msg("转发佣金金额必须大于0！", {icon: 2})
	}
	
	// 免费券需要检测转发佣金金额
	if($('#couponType').val() == 2) {
		if(couponCashback > 100000){
			$("#couponCashback").addClass('error');
			return parent.layer.msg("转发佣金金额最多为5位数！", {icon: 2})
		}
	}

	if(flileImg == null || flileImg == "" || $('#imgPreview').attr('src') =='../../src/images/earnmoney/twins/bg_fileupload.png'){
		return parent.layer.msg("请上传一张优惠券图片", {icon: 2});
	}
	var pattern = /(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.gif$)|(\.*.bmp$)/;
	if (!pattern.test(flileImg)) {
		isValid = false;
		parent.layer.msg("系统仅支持jpg/jpeg/png/bmp格式的图片，请上传正确的图片！", {icon: 2});
		return;
	}

	// 若当前为免费券，则打开支付页面
	if($('#couponType').val() == 2) {
		toPayPage();
	} else {
		submitForm();
	}
}

function submitForm(){
	var couponName = $('#shareTitle').text();
	var couponDemand = $('#couponDemand').val();
	var couponPic = $('#imgPreview').attr('src');
	var couponOriginalPrice = $('#couponOriginalPrice').val();

	var couponPresentPrice = $('#couponPresentPrice').val() || 0;

	var couponCashback = $('#couponCashback').val();
	var couponType = $('#couponType option:selected').attr('value');
	var merchantId = $('#shopId option:selected').attr('merchantId');
	var shopId = $('#shopId option:selected').attr('value');

	var couponExplain = $('#couponExplain').val();
	var password = $('#password').val() || '';

	var couponNum = $('#couponNum').val() || 0; 

	var expireTime = $('#expireTime').val();

	var def = reqAjax('earnmoney/addShopCoupon', {
		'couponName' : couponName,
		'couponDemand' : couponDemand,
		'couponPic' : couponPic,
		'couponOriginalPrice' : couponOriginalPrice,
		'couponPresentPrice' : couponPresentPrice,
		'couponCashback' : couponCashback,
		'couponType' : couponType,
		'merchantId' : merchantId,
		'shopId' : shopId,
		'createId' : appUserId,
		'couponExplain':couponExplain,
		'password' : password,
		'couponNum' : couponNum,
		'expireTime' : expireTime
 	});
	def.then(function(data){
		if (data.code == 1) {// 成功
			parent.window.dispatchEvent(new Event('fxzRefresh'));
			parent.window.closeAddPage(true);
			parent.layer.msg('保存成功！', {icon: 1});
		} else if (data.code == 10) {// 字段错误
			$("#" + data.field).focus();
			parent.layer.msg(data.msg, {icon: 2});
		} else {
			parent.layer.msg(data.msg, {icon: 2});
		}
	}).fail(function(){
		parent.layer.msg("链接超时.....", {icon: 2});
	});
}

parent.payAndSubmit = payAndSubmit
// 点击……支付
function payAndSubmit(btn){
	var dom = $(btn).parents('.myContent');
	if(dom.find('#payPsw').val().length == 0){
		return layer.msg('请输入智享账户密码！', {icon: 2});
	}
	$('#password').val(dom.find('#payPsw').val());
	parent.layer.closeAll('dialog');
	submitForm();
}

// 免费券跳转到商户支付页面
function toPayPage(){
	parent.layer.open({
		title: '支付',
		content: $('#layerContent').html(),
		area: ['700px', '400px'],
		btn: false
	})
}