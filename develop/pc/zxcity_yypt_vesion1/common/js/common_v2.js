$(function(){
    var username = yyCache.get("username") || "";
    var userId = yyCache.get("userId");
    var userImg = localStorage.getItem("阿里云资源URL") || "";
    var apikey = yyCache.get("apikey") || "";
  

    $('#user-pic').attr('src',userImg);
    $('#user-name').html(username);
    
    
    
    
    
    //bootstrap modal可拖动
//  $(document).on("show.bs.modal", ".modal", function(){
//	    $('.modal-dialog').draggable();
//	});
	
	//zebra_tooltips提示
//	$(document).ready(function() {
//      	$.Zebra_Tooltips($('.show-notice'), {
//	            position:   'center',
//	            max_width:  300,
//	            default_position:'inside',
//	            background_color:'#5FB878',
//	            color:'#fbfbfb'
//  		});
//  		
//  		 $.Zebra_Tooltips($('.td2'), {
//	            position:   'center',
//	            max_width:  300,
//	            default_position:'inside',
//	            background_color:'#5FB878',
//	            color:'#fbfbfb'
//  		});
//			 $.Zebra_Tooltips($('.td5'), {
//	            position:   'center',
//	            max_width:  300,
//	            default_position:'inside',
//	            background_color:'#5FB878',
//	            color:'#fbfbfb'
//  		});
//  		
//			$.Zebra_Tooltips($('input,textarea'), {
//          position:   'center',
//          max_width:  300,
//          default_position:'inside',
//          background_color:'#5FB878',
//          color:'#fbfbfb'
//		});
//  });
    
    //限制input,textarea的输入长度
    function inputLen(){
//  	$('input:not(.layui-input)').attr('maxlength',8)
	    $('textarea').attr('maxlength',100)
	    $('textarea').css('resize','none')
	    
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
	    		showFlag = false;
	    	}
	
	    })
    }
    inputLen();
   
    
    //自动分配TR的宽度
	function trWidth(){
		var trLen = $('tr.active th').length - 2;
		var tbLen = $('table.table').width();
		var tbLentrue = tbLen - 330;
		var trMidLen = Math.floor(tbLentrue/trLen)
		$('td.td').width(trMidLen);
	}
	trWidth();
	$(window).resize(trWidth)
    
    
    
})