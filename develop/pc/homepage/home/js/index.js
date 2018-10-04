$(function(){
    $('#fullpage').fullpage({
    	anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'footerPage'],
    	menu: '#myMenu',
    	afterLoad: pageEffets,
    	onLeave: function(index, nextIndex, direction){
    		$('.headerNav li.active').removeClass('active');
			$('.headerNav li').eq(nextIndex).addClass('active');
			if(nextIndex == 6) $('.headerNav li').removeClass('active');
    	}
    });
	pageCalc();
	toDetailPage();
	$('.headerNav a').click(function(){
		$('.headerNav li.active').removeClass('active');
		$(this).parent().addClass('active');
	});
	$('.indexNav').click(function(){
		window.location.href = '';
	});
});

// 页面计算初始化
function pageCalc(){
	var windowH = window.innerHeight;
	// 第三页初始化
	var p3tc = $('.page3').first().find('.titleContent');
	p3tc.css('margin-top', (windowH - p3tc.height()) / 2 - 50 );
	$('.page3').first().find('.phoneContent').css('height', windowH);
	// 第五页初始化
	$('.page5 .platform').css('height', windowH);
	var circleDOM = $('.circleBg')[0];
	// 圆的直径，一般以宽为标准
	var d = Math.min(circleDOM.offsetHeight, circleDOM.offsetWidth);
	$('.platformInfo').eq(0).css({
		top: (circleDOM.offsetHeight - d)/2 - 35,
		left: circleDOM.offsetLeft + circleDOM.offsetWidth/2 - 35
	});
	$('.platformInfo').eq(1).css({
		top: circleDOM.offsetHeight/2 + d/2 * 0.56 - 35,
		left: circleDOM.offsetWidth * 0.3 - 35
	});
	$('.platformInfo').eq(2).css({
		top: circleDOM.offsetHeight/2 + d/2 - 35,
		left: circleDOM.offsetLeft + circleDOM.offsetWidth/2 - 35
	});
	$('.platformInfo').show();
}

// 页面下滚
function pageTo(index){
	if(!index) index = 1;
	$('#fullpage').fullpage.moveTo(index)
}

// 页面特效
function pageEffets(anchorLink, index){
	if(index == 1){
		$('.section').eq(index-1).find('.title').addClass('fadeInDown');
		$('.section').eq(index-1).find('.subtitle').addClass('fadeInUp');
		$('.section').eq(index-1).find('.downloadIcon').addClass('fadeIn');
		$('.section').eq(index-1).find('.videoIcon').addClass('fadeIn');
		$('.section').eq(index-1).find('.downIcon').addClass('fadeIn');
	} else if(index == 2){
		$('.section').eq(index-1).find('.titleContent').show().addClass('fadeInLeft');
		$('.section').eq(index-1).find('.iphoneLayer').show().addClass('fadeInRight');
		$('.section').eq(index-1).find('.iphone').show().addClass('fadeIn');
	} else if(index == 3){
		$('.section').eq(index-1).find('.titleContent').show().addClass('fadeInRight');
		$('.section').eq(index-1).find('.iphoneLayer').show().addClass('fadeInLeft');
		$('.section').eq(index-1).find('.iphone').show().addClass('fadeIn');
	} else if(index == 4){
		$('.section').eq(index-1).find('.titleContent').show().addClass('fadeInRight');
		$('.section').eq(index-1).find('.padContent').show().addClass('fadeInLeft');
	} else if(index == 5){
		$('.section').eq(index-1).find('.titleContent').show().addClass('fadeInRight');
		$('.section').eq(index-1).find('.platform').show().addClass('fadeInDown');
	}
}

// 初始化跳转到详情界面
function toDetailPage(){
	$('.detailIcon').eq(0).click(function(){
		window.location.href = 'zcity/'
	})
	$('.detailIcon').eq(1).click(function(){
		window.location.href = 'zmaster/'
	})
	$('.detailIcon').eq(2).click(function(){
		window.location.href = 'zshop/'
	})
	$('.detailIcon').eq(3).click(function(){
		window.location.href = 'zplatform/'
	})
	$('.detailIcon').eq(4).click(function(){
		window.location.href = 'zshop/'
	})
}
