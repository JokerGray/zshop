$(function(){
    var username = localStorage.getItem("username") || "";
    var userId = localStorage.getItem("userId");
    var userImg = localStorage.getItem("阿里云资源URL") || "";
    var apikey = localStorage.getItem("apikey") || "";
    var str = '';
    
    $('#contorl-left').click(function(){
        if($('#accordion').hasClass('goleft')){
            $(this).find("a span").attr("class","icon-zc");
            $('.left-nav').removeClass('goleft');
             $('.right-box').removeClass('calc')

        }else{
           $(this).find("a span").attr("class","icon-yc");
           $('.left-nav').addClass('goleft')
          
           $('.right-box').addClass('calc')
        }
    })

    $('#user-pic').attr('src',userImg);
    $('#user-name').html(username);
    
    
    
    
    
    //bootstrap modal可拖动
    $(document).on("show.bs.modal", ".modal", function(){
		    $('.modal-content').draggable({ containment: ".modal.fade.in", scroll: false ,cursor:"move"});
	});
	
	//zebra_tooltips提示
	/*$(document).ready(function() {
        		new $.Zebra_Tooltips($('.show-notice'), {
	            position:   'center',
	            max_width:  300,
	            default_position:'inside',
	            background_color:'#5FB878',
	            color:'#fbfbfb'
    		});
    		
    			new $.Zebra_Tooltips($('.td2'), {
	            position:   'center',
	            max_width:  300,
	            default_position:'inside',
	            background_color:'#5FB878',
	            color:'#fbfbfb'
    		});
    		
			new $.Zebra_Tooltips($('input,textarea'), {
            position:   'center',
            max_width:  300,
            default_position:'inside',
            background_color:'#5FB878',
            color:'#fbfbfb'
		});
    });*/
    //
   /* $('input').attr('maxlength',8)*/
    $('textarea').attr('maxlength',8)
    
    var showFlag;
    if($('.group').eq(1)){
    	$('.group').eq(1).hide()
    	showFlag = false;
    }
    $('#showMore').on('click',function(){
    	if(!showFlag){
    		$('.group').eq(1).show(300)
    		showFlag = true;
    	}else{
    		$('.group').eq(1).hide(300)
    		showFlag = false;    	}

    })
})