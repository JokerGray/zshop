$(function(){
	//状态样式切换
	$('.stage li').each(function(){
		$(this).click(function(){
			$('.stage li').removeClass('on')
			$(this).addClass('on')
		})
	})
	//获取content高度
	var h1=$('.header').height();
	var h2=$(document).height();
	var h3=h2-h1;
	$('.content').css('height',h3)
	
	//全选
	$('.chose-all').click(function(){
		if(this.checked){
			$('.checkli').each(function(){
				$(this).prop('checked',true)
			})
		}else{
			$('.checkli').each(function(){
				$(this).prop('checked',false)
			})
		}
	})

})