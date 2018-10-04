$(document).ready(function(){
	$('.headerNav>li a').click(function(){
		$('.headerNav>li.active').removeClass('active');
		$(this).parent().addClass('active');
	})
	pageCacl();
	$('.indexAnchor').click(function(){
		window.location.href = '../'
	});
	setInterval(addAnimation, 3000);
});

$(document).scroll(changeTitle);

// 收银台小图标
function pageCacl(){
	$('.tagIcon').eq(0).css({ left: -15, top: 522 })
	$('.tagIcon').eq(1).css({ left: 65, top: 315 })
	$('.tagIcon').eq(2).css({ left: 230, top: 320 })
	$('.tagIcon').eq(3).css({ left: 350, top: 230 })
	$('.tagIcon').eq(4).css({ left: 490, top: 180 })
	$('.tagIcon').eq(5).css({ left: 505, top: 600 })
	$('.tagIcon').eq(6).css({ left: 735, top: 35 })
	$('.tagIcon').eq(7).css({ left: 960, top: 50 })
	$('.tagIcon').eq(8).css({ left: 1037, top: 190 })
	$('.tagIcon').eq(9).css({ left: 1070, top: 330 })
}

function addAnimation(){
	$('.tagIcon.animated').each(function(){
		var dom = this
		setTimeout(function(){
			$(dom).toggleClass('bounceIn');
		}, parseInt(Math.random()* 3000 + 200))
	})
}
// 页面滚动，菜单变动
function changeTitle(){
	var titleArr = $('.headerNav a');
	var heightArr = [];
	titleArr.each(function(i, v){
		var id = v.href.split('#')[1];
		heightArr.push($('#'+id).offset().top)
	})
	var height = document.body.scrollTop + window.innerHeight;
	heightArr.push(height);
	// 直接sort有问题
	heightArr.sort(function(a, b){
		return a-b;
	});
	var p = titleArr.eq(heightArr.indexOf(height) - 1).parent();
	p.addClass('active').siblings().removeClass('active');
}
