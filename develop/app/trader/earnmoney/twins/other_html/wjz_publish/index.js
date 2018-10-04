// 获取玩家转 发布参数
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
		content.attr({'data-userpic':rows[i].logoUrl ,'value':rows[i].id,'merchantId':rows[i].merchantId}).text(rows[i].shopName);
		content.show();
		$('#shopId').append(content);
	}
});

// 获取卡券样式
var def = reqAjax('earnmoney/addPlayerPrizeInit',{

});
def.then(function(data){
	var rows = data.data;
	for(var i = 0;i < rows.length; i++){
		var content = $('.card-items').first().clone();
		content.find('.mobile-img').attr('src',rows[i].cardUrl);
		content.find('.prizeStyle').attr('value',rows[i].id);
		content.show();
		$('.prizeImg').append(content);
	}
	
	$('input[name="prizeStyle"]').eq(1).attr('checked', 'checked');
	$('.prizeImg').on('click','.mobile-img',function(){
		$('input[name="prizeStyle"]').eq($('.mobile-img').index(this)).click();
	});
	// 数据交互
	$('input, select, textarea').on('change keyup', dataInteract);
	dataInteract();

});

// 数据校验
function checkStata(data){
	$('.wjzWriteContent').each(function(){
		 $(this).val($(this).val().trim());
	});
	if(data.val() == ''){
		data.parent().find('.writeErrow').text('');
		data.addClass('errow').parent().find('.tipinfo .empty').css('display','block');
	}else{
		if(data.hasClass('prizePrice')){
			if(/^[0-9]+$/.test(data.val())){
				data.removeClass('errow').parent().find('.writeErrow').text('');
			}else{
				data.addClass('errow').parent().find('.writeErrow').text('请输入正整数');
			}
		}else {
			data.removeClass('errow');
		}
		data.parent().find('.tipinfo .empty').css('display','none');
	}
}


var validateForm;
// 数据交互
function dataInteract(){
	var event = new Event('dataInteract');
	event.prefix = 'wjzDetail';
	var time = $('#expireTime').val()
	event.params = {
		prizeTitle: $('#prizeTitle').val(),
		prizePrice: $('#prizePrice').val(),
		expireTime: time.substr(0, 10),
		prizeStyle: $('[name="prizeStyle"]:checked').siblings('img').attr('src')
	}
	parent.window.dispatchEvent(event);
}

function doSubmit() {
	$('.wjzWriteContent').each(function(){
		 $(this).val($(this).val().trim());
		 if($(this).val() == ''){
			$(this).addClass('errow').parent().find('.tipinfo .empty').css('display','block');
		}
	});

	// 样式不能为空
	var prizeStyle = $('[name="prizeStyle"]:checked').val();
	if(prizeStyle == "" && prizeStyle == 0){
		layer.msg("卡券样式不能为空！", {icon: 2});
		 return false;
	}
	// 标题不能为空
	var prizeTitle = $("#prizeTitle").val();
	if(prizeTitle == ""){
		 layer.msg("卡券标题不能为空！", {icon: 2});
		 return false;
	}
	// 时间不能为空
	var expireTime = $("#expireTime").val();
	
	if(expireTime == null || expireTime == ''){
		 layer.msg("到期时间不能为空！", {icon: 2});
		 return false;
	}
	// 面值不能为空
	var prizePrice = $("#prizePrice").val();
	if(isNaN(prizePrice)){
		layer.msg("请输入正确的金额格式", {icon: 2});
		return false;
	}else if(prizePrice == ''){
		layer.msg("卡券面值不能为空！", {icon: 2});
		return false;
	}else if(!/^[0-9]+$/.test(prizePrice)){   
		layer.msg("卡券面值为正整数！",{icon:2});
		return false;
	}else if(parseInt(prizePrice)==0){
		layer.msg("卡券面值不能为0！", {icon: 2});
		return false;
	}else if(parseInt(prizePrice)>=1000){
		layer.msg("卡券面值不能超过999！", {icon: 2});
		return false;
	}
	// 注释说明
	var nm=document.getElementById("prizeExplain");
	 
	if(nm.value.length<=1){
		layer.msg("注释说明不能为空", {icon: 2});
		 return false;
	}else{
		$("#prizeExplain").text();
	}

	var shopId = $('#shopId option:selected').attr('value');
	var merchantId = $('#shopId option:selected').attr('merchantId');
	var prizeStyle = $('[name="prizeStyle"]:checked').siblings('img').attr('src');
	var prizeTitle = $('#prizeTitle').val();
	var prizePrice = $('#prizePrice').val();
	var prizeExplain = $('#prizeExplain').val();
	var expireTime = $('#expireTime').val();

	var def = reqAjax('earnmoney/addShopPlayerPrize', {
		shopId : shopId,
		merchantId : merchantId,
		createId : appUserId,
		prizeStyle : $('[name="prizeStyle"]:checked').siblings('img').attr('src'),
		prizeTitle : prizeTitle,
		prizePrice : prizePrice,
		prizeExplain : prizeExplain,
		expireTime : expireTime
	});
	def.then(function(data){
		if(data.code == 1){
			parent.window.dispatchEvent(new Event('wjzRefresh'));
			parent.window.closeAddPage(true);
			parent.layer.msg(data.msg, {icon: 1});
		}else if(data.code == 10){// 字段错误
			parent.layer.msg(data.msg, {icon: 2});
		}else {// 系统错误
			parent.layer.msg(data.msg, {icon: 2});
		}
	}).fail(function(){
		parent.layer.msg("链接超时.....", {icon: 2});
	});
}
