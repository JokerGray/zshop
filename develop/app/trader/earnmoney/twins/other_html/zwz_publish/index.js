var accountBalance,dictionaryList;
var articleUrl = [];

window.onload=function(){
	checkUser();

	var appUserId = getQueryString('appUserId');
	// 获取店铺
	var def = reqAjax('earnmoney/getUserManageShopListByBackuser', {
		appUserId : appUserId
	});
	def.then(function(data){
		var rows = data.data;
		$('#shopId >option:first-of-type').attr({'data-userpic':rows[0].logoUrl ,'value':rows[0].id,'merchantId':rows[0].merchantId}).text(rows[0].shopName);
		// dataInteract();
		for(var i = 1;i < rows.length; i++){
			var content = $('#shopId >option').first().clone();
			content.data(rows[i]);
			content.attr({'data-userpic':rows[i].logoUrl ,'value':rows[i].id ,'merchantId':rows[i].merchantId}).text(rows[i].shopName);
			content.show();
			$('#shopId').append(content);
		}
		
		var merchantId = $('#shopId >option:selected').attr('merchantId');
		getListData();
	});
}

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
		}else if(data.hasClass('taskTotalReadnum')){
			if(/^[0-9]+$/.test(data.val())){
				data.removeClass('errow').parent().find('.writeErrow').text('');
			}else{
				data.addClass('errow').parent().find('.writeErrow').text('请输入正确的点击格式');
			}
		}else{
			data.removeClass('errow');
		}
		data.parent().find('.tipinfo .empty').css('display','none');
	}
}

// 滚动加载列表数据
function getListData(){

	var merchantId = $('#shopId >option:selected').attr('merchantId');
	var appUserId = getQueryString('appUserId');

	if($('#msg').val().length != 0) return;
	var loadIndex;
	
	var def = reqAjax('earnmoney/getShopReprintList', {
		merchantId :merchantId,
		appUserId : appUserId,
		pagination: {
			page: parseInt($('#articleForm .task').length / 10) + 1,
			rows: 10
		}
	});
	def.then(function(data){

		var total = data.data.total;
		var rows = data.data.rows;
		for(var i = 0;i < rows.length; i++){
			var article = $('#articleForm .task').first().clone();
			article.data(rows[i]);
			article.find('.imgUrl').attr('src', rows[i].imgUrl);
			article.find('.articleTitle').text(rows[i].articleTitle);
			article.click(articleClick);
			article.show();
			$('#articleForm').append(article);
		}
		// 无数据时给出提示
		if(rows.length == 0) $('#tips').show();
			
		accountBalance = data.data.accountBalance;
		dictionaryList = data.data.dictionaryList;
			
		$('#articleForm').append($('#articleForm .loadMore'));

		// 确定是否还能继续加载数据，是，则显示laodmroe
		var canBeLoaded = $('#articleForm .task').length - 1 < parseInt(total);
		$('#articleForm .loadMore').toggle(canBeLoaded);	
		dataInteract();

	});
}

// 文章列表点击
function articleClick(){
	
	$('#articleForm .task i.fa-check-circle').removeClass('fa-check-circle').addClass('fa-circle-o');
	$(this).find('.articleSelect i').removeClass('fa-circle-o').addClass('fa-check-circle');
	articleUrl = $('#articleForm .task i.fa-check-circle').parents('.task').data('articleUrl');
	dataInteract();
}

// 数据交互方式
function dataInteract(){
	var taskPrice = $('#taskPrice').val();
	if(!taskPrice || isNaN(parseFloat(taskPrice))) {
		taskPrice = 0;
	}else{
		taskPrice = parseFloat(taskPrice);
	}
	var event = new Event('dataInteract');
	event.prefix = 'zwzDetail';
	event.params = {
		dictionaryList: dictionaryList,
		taskPrice: taskPrice.toFixed(2),
		articleUrl: articleUrl
	}
	parent.window.dispatchEvent(event);
}

// 计算待支付
function checkPay(){
	var taskPrice = parseFloat($('#taskPrice').val());
	var taskTotalReadnum = parseInt($('#taskTotalReadnum').val());
	if(isNaN(taskPrice) || isNaN(taskTotalReadnum) || taskPrice > 1){
		$('#payPrice').text('¥ ' + 0);
	} else{
		$('#payPrice').text('¥ ' + (taskPrice * taskTotalReadnum).toFixed(2));
	}
	dataInteract();
}

// 检查
function checkForm(){
	$('input[type="text"]').each(function(){
		if($(this).val() == ''){
			$(this).addClass('errow').parent().find('.tipinfo .empty').css('display','block');
		}
		$(this).val($(this).val().trim()); 
	});

	if($('#taskPrice').val().length == 0) return layer.msg('点击价格不能为空！',{icon: 2})
	var taskPrice = parseFloat($('#taskPrice').val());

	if(isNaN(taskPrice)) return layer.msg('请输入小数！',{icon: 2})
	if(taskPrice == 0) return layer.msg('点击价格不能为0！',{icon: 2})
	if(taskPrice > 1) return layer.msg('点击价格不能超过1元！',{icon: 2})
	if(taskPrice < 0) return layer.msg('点击价格不能小于0元！',{icon: 2});

	
	if($('#taskTotalReadnum').val().length == 0) return layer.msg('点击次数不能为空！',{icon: 2})

	if( !/^[0-9]+$/.test($('#taskTotalReadnum').val())){
		return layer.msg('点击次数应为正整数',{icon:2});
	}
	var taskTotalReadnum = parseInt($('#taskTotalReadnum').val());

	if(taskTotalReadnum <= 0) return layer.msg('点击次数应大于0！',{icon: 2});
	
	if(taskTotalReadnum > 100000) return layer.msg('点击次数不能超过10万次！',{icon: 2});
	
	if($('#articleForm .task i.fa-check-circle').length == 0) return layer.msg('请选择需要转发的文章！',{icon: 2});
	
	if($('#shopId option').length == 0) return layer.msg('请绑定店铺！',{icon: 2});

	for(var i = 0;i < $($('.tipinfo')).length;i++){
		if( $($($('.tipinfo'))[i]).height() > 0 ){
			return layer.msg( ''+$($($('.tipinfo'))[i]).find('.writeErrow').text(),{ icon :2});
		}
	}
	
	var price = (taskPrice * taskTotalReadnum).toFixed(2);
	if(accountBalance < price) return layer.msg('账户余额不足，请到移动端APP充值！',{icon: 2});
	
	layer.confirm('确认支付'+ price +'元，发布转文赚？', submitAfterCheck);
}

// 提交
function submitAfterCheck(){
	layer.closeAll('dialog');
	var merchantId = $('#shopId >option:selected').attr('merchantId');
	var appUserId = getQueryString('appUserId');
	var shopId = $('#shopId >option:selected').attr('value');

	var articleData = $('#articleForm .task i.fa-check-circle').parents('.task').data();
	var taskPrice = parseFloat($('#taskPrice').val());
	var taskTotalReadnum = parseInt($('#taskTotalReadnum').val());
	var taskTotalMoney = (taskPrice * taskTotalReadnum).toFixed(2);

	var def = reqAjax('earnmoney/publishReprintInfo', {
		merchantId :merchantId,
		userId : appUserId,
		shopId : shopId,
		taskPrice : taskPrice,
		taskTotalReadnum : taskTotalReadnum,
		taskTotalMoney : taskTotalMoney,
		taskTitle : articleData.articleTitle,
		taskPic : articleData.imgUrl,
		taskUrl :　articleData.articleUrl,
	});
	def.then(function(data){
		layer.msg('保存成功！', {icon: 1});
		if (data.code == 1) {// 成功
			parent.window.dispatchEvent(new Event('zwzRefresh'));
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