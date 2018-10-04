var userId = getQueryString('userId');
var appUserId = getQueryString('appUserId');

// 实时更新 手机时间
setInterval(function(){
	$('.newDate').text(new Date().Format('hh:mm'));
},1000);

// tab栏切换
$('#tab >li').on('click',function(){
	if($(this).children().attr('id')=='qbz'){
		$('#phoneTitle').text('抢标赚');
		$('.addText').text('发布抢标赚任务');
		$('.phone_content').css({'background':'#fff'});
		$('.qbzContent').css({'display':'block'}).siblings().css({'display':'none'});
	}
	if($(this).children().attr('id')=='zwz'){
		$('#phoneTitle').text('转文赚');
		$('.addText').text('发布转文赚任务');
		$('.phone_content').css({'background':'#fff'});
		$('.zwzContent').css({'display':'block'}).siblings().css({'display':'none'});
	}
	if($(this).children().attr('id')=='fxz'){
		$('#phoneTitle').text('分享赚');
		$('.addText').text('发布分享赚任务');
		$('.phone_content').css({'background':'#f8f8f8'});
		$('.fxzContent').css({'display':'block'}).siblings().css({'display':'none'});
	}
	if($(this).children().attr('id')=='wjz'){
		$('#phoneTitle').text('玩家转');
		$('.addText').text('发布玩家转任务');
		$('.phone_content').css({'background':'#fff'});
		$('.wjzContent').css({'display':'block'}).siblings().css({'display':'none'});
	}
});
// 分布任务详情
$('.addTask').on('click',function(){
	$('.phone_title.top_title').css({'display':'none'});
	$('.addTask').css({'display':'none'});
	$('#listTips').css({'display':'none'});
	$('#detailTips').css({'display':'block'});
	$('#tab').css({'display':'none'});
	$('.phone_publish').css({'display':'block'}).siblings().css({'display':'none'});
	if($('#tab >li.active>a').attr('id') === 'qbz'){
		$('.publishTitle').text('转文赚详情');
		$('.qbzDetail').css({'display':'block'}).siblings().css({'display':'none'});
	}
	if($('#tab >li.active>a').attr('id') === 'zwz'){
		$('.publishTitle').text('转文赚详情');
		$('.zwzDetail').css({'display':'block'}).siblings().css({'display':'none'});
	}
	if($('#tab >li.active>a').attr('id') === 'fxz'){
		$('.publishTitle').text('分享赚详情');
		$('.fxzDetail').css({'display':'block'}).siblings().css({'display':'none'});
		$('.myIframe').attr('src','fxz_publish.html');
	}
	if($('#tab >li.active>a').attr('id') === 'wjz'){
		$('.publishTitle').text('玩家转详情');
		$('.wjzDetail').css({'display':'block'}).siblings().css({'display':'none'});
		$('.myIframe').attr('src','wjz_publish.html');
	}				
});
// 返回 
$('#iconBack').on('click',function(){
	$('.phone_title.top_title').css({'display':'block'});
	$('.addTask').css({'display':'block'});
	$('#listTips').css({'display':'block'});
	$('#detailTips').css({'display':'none'});
	$('#tab').css({'display':'block'});
	$('.phone_publish').css({'display':'none'}).siblings().css({'display':'block'});
	$('.myIframe').attr('src','');
});

// 抢标赚 部分
// 每一个点击的事件
function qbzClick(){
	var data =$(this).data();
	openIframe('../../earnmoney/twins/other_html/qbz_detail/index.html?id='+data.id);
}

window.addEventListener('qbzInit', qbzInit());
window.addEventListener('qbzRefresh', function(){
	qbzInit('refresh');
});

function qbzInit(flag){
	var isRrfresh = flag == 'refresh';
	if(isRrfresh) $('.qbzContent .myTask:gt(0)').remove();
	
	var loadIndex;

	var def = reqAjax('earnmoney/getShopTaskEarnList', {
		userId : userId,
		pagination: {
			page: isRrfresh ? 1 : parseInt($('.qbzContent .myTask').length / 10) + 1,
			rows: 10 
		}
	});
	def.then(function(data){
		var rows = data.data;
		for(var i = 0;i < rows.length; i++){
			var content = $('.qbzContent .myTask').first().clone();
			content.data(rows[i]);
			
			if(rows[i].taskTitle.length >24){
				content.find('.taskTitle').text(rows[i].taskTitle.substr(0, 20) + '…');
			}else{
				content.find('.taskTitle').text(rows[i].taskTitle);
			}

			content.find('.explain >p').text(rows[i].taskDemand.length>46 ? (rows[i].taskDemand.substr(0, 46) + '…') : rows[i].taskDemand);
			content.find('.earnMoney').text(parseFloat(rows[i].taskPrice).toFixed(2) +'元');
			
			if(rows[i].resourceList.length >0 && rows[i].resourceList[0].resourceUrl.length > 0){
				content.find('.banner').css({'background':'url('+rows[i].resourceList[0].resourceUrl+') no-repeat center center','background-size':"cover"});
			}
		
			if(rows[i].taskStatus != 1){
				content.find('img').addClass('gray');
				content.find('.shopStatus').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_dphui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.right i').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_rdhui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.dot').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_xhdhui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.right em').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_sjhui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.money span:first-of-type').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_yjhui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.userName').css("color","#acacac");
				content.find('span').css("color","#acacac");
				content.find('.taskTitle').css("color","#fff");
				content.find('.banner').addClass('gray');
				content.find('.content').css('background-color','rgba(0,0,0,0.2)');
				content.find('.explain>p').css("color","#acacac");
			}
			content.find('.taskNeedPerson').text(rows[i].taskNeedPerson);
			content.find('.taskConfirmedPerson').text(rows[i].taskConfirmedPerson);
			content.find('.hot').text(rows[i].browseNum);
			var time = rows[i].createTime.substr(5,2)+'.'+rows[i].createTime.substr(8,2);
			content.find('.time').text(time);

			content.find('.userName').text(rows[i].userName);
			content.find('.userPic >img').attr('src', rows[i].userPic);
			content.click(qbzClick);
			content.show();
			$('.qbzContent').append(content);
		}
		$('.qbzContent').append($('.qbzContent .loadMore'));
		// 确定是否还能继续加载数据，是，则显示laodmroe
		var canBeLoaded = $('.qbzContent .myTask').length - 1 < parseInt(data.total);
		$('.qbzContent .loadMore').toggle(canBeLoaded);
	});
}


// 监听初始化事件
window.addEventListener('qbzDetailInit', qbzDetailInit)
// 初始化界面，打开iframe，去掉过期数据
function qbzDetailInit(){
	openIframe('../../earnmoney/twins/other_html/qbz_publish/index.html?appUserId='+appUserId);
	var paramsInit = {
		userPic: '',
		userName: '',
		taskPrice: 0,
		taskTitle: '',
		taskNeedPerson: 0,
		taskDemand:'',
		taskImgs: []
	}
	qbzDetailInteract(paramsInit);
}

// 与iframe的交互方案
function qbzDetailInteract(params){
	if(params['userPic']){
		$('.qbzDetail .userPic img').attr('src', params['userPic']);
	}
	$('.qbzDetail .userName').text(params['userName']);
	$('.qbzDetail .taskPrice').text(params['taskPrice']);
	$('.qbzDetail .taskTitle').text(params['taskTitle']);
	$('.qbzDetail .taskNeedPerson').text(params['taskNeedPerson']);
	$('.qbzDetail .taskDemand').html(params['taskDemand']);
	$('.qbzDetail .taskPicContent').html('');
	var taskImgs = params['taskImgs'];
	$(taskImgs).each(function(){
		$('.qbzDetail .taskPicContent').append('<img src="'+ this +'">')
	})
}


// 转文赚 部分
window.addEventListener('zwzInit', zwzInit);
window.addEventListener('zwzRefresh', function(){
	zwzInit('refresh')
});

// 初始化方法
function zwzInit(flag){
	var isRrfresh = flag == 'refresh';
	if(isRrfresh) $('.zwzContent .myTask:gt(0)').remove();
	var loadIndex;

	var def = reqAjax('earnmoney/getShopReprintEarnList', {
		userId : userId,
		pagination: {
			page: isRrfresh ? 1 : parseInt($('.zwzContent .myTask').length / 10) + 1,
			rows: 10 
		}
	});
	def.then(function(data){
		var rows = data.data.reprintList;
		for(var i = 0;i < rows.length; i++){
			var content = $('.zwzContent .myTask').first().clone();
			content.data(rows[i]);
			content.find('.taskPic >img').attr('src', rows[i].taskPic);
			content.find('.taskTitle').text(rows[i].taskTitle.length > 30 ? (rows[i].taskTitle.substr(0,30)+'...') : rows[i].taskTitle);
			if(rows[i].taskConfirmedForwardNum == null || rows[i].taskConfirmedForwardNum == ''){
				content.find('.taskConfirmedForwardNum').text(0);
			}else {
				content.find('.taskConfirmedForwardNum').text(rows[i].taskConfirmedForwardNum);
			}
			content.find('.residue_money').text(parseFloat(rows[i].taskSurplusMoney).toFixed(2) +'元');
			content.find('.taskPrice').text(parseFloat(rows[i].taskPrice).toFixed(2) +'元');
			content.find('.userName').text(rows[i].userName.length > 8 ? (rows[i].userName.substr(0,8)+'...') : rows[i].userName);
			content.find('.userPic >img').attr('src', rows[i].userPic);
			if(rows[i].taskStatus == 2){
				content.find('img').addClass('gray')
				content.find('span').css("color","#acacac");
				content.find('.userName').css("color","#acacac");
				content.find('.taskTitle').css("color","#acacac");
				content.find('.shopStatus').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_dphui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.share').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_fxhui@2x.png) no-repeat','background-size': 'contain'});
				content.find('.contentBottom .fl span:first-of-type').css({'background':'url(src/images/earnmoney/twins/wjzq_xlb_danjhui@2x.png) no-repeat','background-size': 'contain'});
			}

			content.click(zwzClick)
			content.show();
			$('.zwzContent').append(content);
		}
		$('.zwzContent').append($('.zwzContent .loadMore'));
		// 确定是否还能继续加载数据，是，则显示laodmroe
		var canBeLoaded = $('.zwzContent .myTask').length - 1 < parseInt(data.total);
		$('.zwzContent .loadMore').toggle(canBeLoaded);
	});
}

// 每一个点击的事件
function zwzClick(){
	var data =$(this).data();
	openIframe('../../earnmoney/twins/other_html/zwz_detail/index.html?id='+data.reprintId);
}

// 监听初始化事件
window.addEventListener('zwzDetailInit', zwzDetailInit)

// 初始化界面，打开iframe，去掉过期数据
function zwzDetailInit(){
	openIframe('../../earnmoney/twins/other_html/zwz_publish/index.html?appUserId='+appUserId);
	var paramsInit = {
		articleUrl: '',
		dictionaryList: [],
		taskPrice: ''
	}
	zwzDetailInteract(paramsInit);
}


// 与iframe的交互方案
function zwzDetailInteract(params){
	var articelUrl = $('.zwzDetail .articleUrl').attr('src');
	if(articelUrl != params['articleUrl']+'&isComment=1&isGift=1') {
		var url = params['articleUrl'].length > 0 ? (params['articleUrl'] + '&isComment=1&isGift=1') : '';
		$('.zwzDetail .articleUrl').attr('src', url);
	}
	
	$('.zwzDetail .taskPrice').text(params['taskPrice']);
	$('.zwzDetail .dictionaryList').html('');
	var dictionaryList = params['dictionaryList'];
	if(!dictionaryList)return;
	for(var i=0; i<dictionaryList.length; i++){
		$('.zwzDetail .dictionaryList').append('<li>'+ dictionaryList[i].value +'</li>')
	}
}


// 分享赚 部分
window.addEventListener('fxzInit', fxzInit);
window.addEventListener('fxzRefresh', function(){
	fxzInit('refresh');
});
var imgInit = $('.imgSrc').attr('src');
// 初始化方法
function fxzInit(flag){
	var isRrfresh = flag == 'refresh';
	if(isRrfresh) $('.fxzContent .myTask:gt(0)').remove();
	var loadIndex;
	var def = reqAjax('earnmoney/getShopShareEarnList', {
		userId : userId,
		pagination: {
			page: isRrfresh ? 1 : parseInt($('.fxzContent .myTask').length / 10) + 1,
			rows: 10 
		}
	});
	def.then(function(data){
		var rows = data.data.shareList;
		var total = data.total;
		for(var i = 0;i < rows.length; i++){
			var content = $('.fxzContent .myTask').first().clone();
			content.data(rows[i]);
			if(i%2==0){
				content.addClass('fl');
			}else if(i%2==1){
				content.addClass('fr');
			}

			if(rows[i].couponStatus == 1){
				content.find('.couponStatus').text('上架');
			}else if(rows[i].couponStatus == 2){
				content.find('.couponStatus').text('下架');
			}else if(rows[i].couponStatus == 4){
				content.find('.couponStatus').text('过期');
			}

			content.find('.title').text(rows[i].couponName.length > 10 ? (rows[i].couponName.substr(0,9)+'...') : rows[i].couponName);
			content.find('.couponDemand').text(rows[i].couponDemand.length > 20 ? (rows[i].couponDemand.substr(0,20)+'...') : rows[i].couponDemand);
			content.find('.couponPresenPrice').text(parseFloat(rows[i].couponPresentPrice).toFixed(2));
			content.find('.couponOriginaPrice').text(parseFloat(rows[i].couponOriginalPrice).toFixed(2));
			var arr = [];
			if(rows[i].couponCashback.length = 0){
				arr = ['','']
			}else{
				arr = (''+parseFloat(rows[i].couponCashback).toFixed(2)).split('.');
			}
			content.find('.couponCashback').text(arr[0]);
			content.find('.decimals').text('.'+arr[1]);
			content.find('.couponTop').css({'background': 'url('+rows[i].couponPic+') no-repeat center center','background-size':'cover'});
			content.find('.sharenum').text(rows[i].shareNum);


			if(rows[i].couponType == 2){
				if(rows[i].couponNum == rows[i].useNum){
				 	content.find('.finish').css({'display':'block'});
				}
			}

			if(rows[i].couponStatus == 2 ||rows[i].couponStatus == 4){
				content.find('span').css("color","#acacac");
				content.find('.couponStatus').css({'background':'#acacac'});
				content.find('.couponDemand').css("color","#acacac");
				content.find('.couponTop').addClass('gray');
				content.find('.title').addClass('gray');
				content.find('.fxzContent .tip').addClass('gray');
				content.find('.couponPresenPrice').css('color','#fff');
				content.find('.xianjia').css('color','#fff');
				content.find('.couponOriginaPrice').css('color','#fff');
			}
			content.click(fxzClick);
			content.show();
			$('.fxzTask').append(content);
			 // tip 背景图
			content.find('.tip').css({'background':'url(../twins/src/images/earnmoney/twins/wjzq_xlb_jbse@2x.png) no-repeat center center','padding':'0 2px 0 1px'});
			// title 背景图
			content.find('.title').css({'background':'url(../twins/src/images/earnmoney/twins/wjzq_xlb_dianpum@2x.png) no-repeat center center','padding':'0 5px','border-radius':'3px'});	
		}
		$('.fxzContent').append($('.fxzContent .loadMore'));
		// 确定是否还能继续加载数据，是，则显示laodmroe
		var canBeLoaded = $('.fxzContent .myTask').length - 1 < parseInt(data.total);
		$('.fxzContent .loadMore').toggle(canBeLoaded);
		domVM($('.fxzContent .couponPic'));
	});
}

function fxzClick(){
	var data = $(this).data();
	openIframe('../../earnmoney/twins/other_html/fxz_detail/index.html?id='+data.id);
	var paramsInit = {
		id : '',
		couponStatus : ''
	}
	fxzListInteract(paramsInit);
}

// 上、下架交互
function fxzListInteract(params){
	var id = params.id;
	var couponStatus = params.couponStatus;
	$('.fxzContent .myTask').each(function(){
		if($(this).data('id') == id){
			fxzInit('refresh');
		}
	})
}

var fxzDetailImgUrl = $('.imgSrc').attr('src');
// 监听初始化事件
window.addEventListener('fxzDetailInit', fxzDetailInit);

// 初始化界面，打开iframe，去掉过期数据
function fxzDetailInit(){
	openIframe('../../earnmoney/twins/other_html/fxz_publish/index.html?appUserId='+appUserId);
	$('.imgSrc').attr('src', fxzDetailImgUrl);
	$('.fxzDetail .imgContent').removeClass('hasImg');
	var paramsInit = {
		couponCashback: '0',
		couponDemand: '优惠券描述',
		couponOriginalPrice: '0',
		couponPresentPrice:'0',
		shopName: '店铺名称',
		imgSrc: ''
	}
	fxzDetailInteract(paramsInit);
}

// 与iframe的交互方案
function fxzDetailInteract(params){
	for(var key in params){
		var $dom = $('.fxzDetail .'+key);
		var val = params[key];
		
		if(key == 'imgSrc'){
			if(!!val) {
				$dom.attr('src', val);
				$('.fxzDetail .imgContent').addClass('hasImg');
			}
		}else{
			$dom.text(val);
		}
	}
	var expireTime = params['expireTime'] ? params['expireTime'].substr(0,10) : '';
	$('.fxzDetail .expireTime').text(expireTime);
	// 图片上下居中
	domVM($('.fxzDetail .imgSrc'));
}


// 玩家转 部分
window.addEventListener('wjzInit', wjzInit);
window.addEventListener('wjzListInteract', wjzListInteract);
window.addEventListener('wjzRefresh', function(){
	wjzInit('refresh')
});

// 初始化方法
function wjzInit(flag){
	var isRrfresh = flag == 'refresh';
	if(isRrfresh) $('.wjzContent .myTask:gt(0)').remove();
	var loadIndex;

	var def = reqAjax('earnmoney/getShopPlayerEarnList', {
		userId : userId,
		pagination: {
			page: isRrfresh ? 1 : parseInt($('.wjzContent .myTask').length / 10) + 1,
			rows: 10 
		}
	});
	def.then(function(data){
		var rows = data.data;
		 for(var i = 0;i < rows.length; i++){
			var content = $('.wjzContent .myTask').first().clone();
			content.data(rows[i]);
			content.find('.prizeStyle').attr('src', rows[i]['prizeStyle']);
			content.find('.prizeTitle').text(rows[i]['prizeTitle']);
			var time = rows[i]['expireTime'];
			content.find('.expireTime').text(time.substr(0, 10));
			content.find('.prizePrice').text(rows[i]['prizePrice'] + '元');
			if(rows[i]['prizeStatus'] == 1){
				content.find('.prizeStatus').text('已上架');
			}else if(rows[i]['prizeStatus'] == 2){
				content.find('.prizeStatus').addClass('changeColor').text('已下架');
				content.find('.prizeStyle').addClass('gray');
			}else if(rows[i]['prizeStatus'] == 3){
				content.find('.prizeStatus').addClass('changeColor').text('已过期');
				content.find('.prizeStyle').addClass('gray');
			}
			content.find('.shareContent').addClass(rows[i]['prizeStatus'] == 1 ? '' : 'down');
			content.click(wjzClick);
			content.show();
			$('.wjzContent').append(content);
	}
		$('.wjzContent').append($('.wjzContent .loadMore'));
		// 确定是否还能继续加载数据，是，则显示laodmroe
		var canBeLoaded = $('.wjzContent .myTask').length - 1 < parseInt(data.total);
		$('.wjzContent .loadMore').toggle(canBeLoaded);
	});
}

// 点击事件
function wjzClick(){
	var data = $(this).data();
	openIframe('../../earnmoney/twins/other_html/wjz_detail/index.html?id=' + data.id);
}

// 上、下架交互
function wjzListInteract(params){
	var id = params.id;
	var prizeStatus = params.prizeStatus;
	
	$('.wjzContent .myTask').each(function(){
		if($(this).data('id') == id){
			var content = $(this).find('.shareContent');
			prizeStatus == 1 ? content.removeClass('down').find('.prizeStatus').removeClass('changeColor').siblings().removeClass('gray') : content.addClass('down').find('.prizeStatus').addClass('changeColor').siblings().addClass('gray');
			$(this).find('.prizeStatus').text(prizeStatus ==1 ? '已上架' : '已下架');
		}
	})
}

// 监听初始化事件
window.addEventListener('wjzDetailInit', wjzDetailInit);

// 初始化界面，打开iframe，去掉过期数据
function wjzDetailInit(){
	openIframe('../../earnmoney/twins/other_html/wjz_publish/index.html?appUserId='+appUserId);
	var paramsInit = {
		prizeTitle: '',
		prizePrice: 0,
		expireTime: '',
		prizeStyle: ''
	}
	wjzDetailInteract(paramsInit);
}

// 与iframe的交互方案
function wjzDetailInteract(params){
	$('.wjzDetail .prizeStyle').attr('src', params['prizeStyle']);
	$('.wjzDetail .prizeTitle').text(params['prizeTitle']);
	$('.wjzDetail .expireTime').text(params['expireTime']);
	$('.wjzDetail .prizePrice').text(params['prizePrice'] + '元');
}


// 通用
$(function(){
	// 初始化需要有个userId好办事
	$('#userId').val(document.getElementById('userId').value);
	$('#shopId').val(document.getElementById('shopId').value);
	// 点击tab加载对应初始化js
	var arrInit = [];
	$('#tab').on('shown.bs.tab', function (e) {
		if(arrInit.indexOf(e.target.id) < 0){
			window.dispatchEvent(new Event(e.target.id + 'Init'));
			arrInit.push(e.target.id);
		}
		// 点击标题栏修改
		$('#phoneTitle').text(e.target.textContent);
		// 点击左侧提示修改
		$('#listTips').show();
		$('#detailTips').hide();
		$('#listTips .titleText').text($('#tab li.active a').text());
		// 点击关闭iframe
		$('#myIframe').attr('src', '');
	});
	// 默认点击第一个
	$('#tab a').first().tab('show');
	// 点击打开新增界面
	$('.addTask, #addPublish').click(openAddPage);
	// 点击退出新增界面
	$('#iconBack').click(closeAddPage);
	
	if(parent){
		refParTable = function(){
			fxzInit('refresh');
			zwzInit('refresh');
			qbzInit('refresh');
			wjzInit('refresh');
		}
	}
})

// 根据当前tab，手机模板显示对应新增发布预览界面
// 显示对应右侧新增界面
function openAddPage(){
	$('.publish_detail').hide();
	$('.phone_publish').show();
	var id = $('#tab li.active a').attr('id');
	$('#publishTitle').text($('#tab li.active a').text()+'详情');
	$('#'+id+'Detail').show();
	// 触发对应界面初始化事件，包括修改iframe链接
	window.dispatchEvent(new Event(id+'DetailInit'));
}

// 关闭添加的界面，status--true，则表示需要刷新
function closeAddPage(status){
	$('.phone_title.top_title').css({'display':'block'});
	$('.addTask').css({'display':'block'});
	$('#listTips').css({'display':'block'});
	$('#detailTips').css({'display':'none'});
	$('#tab').css({'display':'block'});
	$('.phone_publish').css({'display':'none'}).siblings().css({'display':'block'});
	$('.myIframe').attr('src','');
}

// 打开iframe
function openIframe(src){
	$('#myIframe').attr('src', src);
	// 打开iframe显示左侧提示
	$('#listTips').hide();
	$('#detailTips').show();
}

// 子页面返回过来的数据交互
window.addEventListener('dataInteract', function(e){
	var prefix = e.prefix;
	var params = e.params;
	window[prefix+'Interact'](params)
})


// shadeEffect更改的玩意
function shadeLayer(){
	return layer.msg('提交中...', {
		icon : 16,
		shade : [ 0.5, '#f5f5f5' ],
		scrollbar : false,
		time : 20000
	});
}
// 加载中样式
function loading(){
	return layer.msg('提交中...', {icon: 16, shade: [0.5, '#f5f5f5'], scrollbar: false, time: 20000});
}

// 图片或元素上下居中
function domVM(dom){
	var $dom = dom instanceof jQuery ? dom : $(dom);
	$dom.each(function(i, v){
		var img = this;
		var interval = setInterval(function(){
			if(img.complete) {
				$(img).css('margin-top', parseInt(($(img).parent().height() - $(img).height()) / 2));
				clearInterval(interval);
			}
			if($('.imgSrc').attr('src') != imgInit){
				$('.imgSrc').addClass('inintWidth');
			}else{
				$('.imgSrc').removeClass('inintWidth');
			}
		}, 20)
	})
}

// 刷新iframe
function refreshIframe(){
	$('#myIframe').attr('src', $('#myIframe').attr('src'));
}