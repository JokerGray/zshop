(function($) {
	$('#jueseBox').hide();
	var state = sessionStorage.setItem('state',1);
	var padpid = sessionStorage.getItem('padpid');
	var type;
	var str='';
	const CMD = 'operations/roleList';
	
	function setType(){
		var typeid = sessionStorage.getItem('typeid')
		if(typeid == 3){
			type = sessionStorage.setItem('type',3)
		}else{
			type = sessionStorage.setItem('type',1)
		}
	}
	setType();
	$('.addsystem form').hide();
	$('#phone').hide().attr('data-no','no');
	var typeid = sessionStorage.getItem('typeid');
	var roleid = sessionStorage.getItem('roleIds');
	layui.use('form', function(){
	  var form = layui.form();
	  
	  	 var parm = '{"page":1,"rows":1000}';
		 var res = reqAjax(CMD, parm);
		 for(var i=0;i<res.data.length;i++){
		 	
					str += '<option title='+res.data[i].id+' value='+(i+1)+'>'+res.data[i].name+'</option>'
			}
		
		$('#juese').html(str)
		
		if(padpid==null){
	  		$('#aihao').attr('disabled',true)
	  		
	  	}else{
	  		$('#aihao').attr('disabled',false)
	  	}
	  	
		form.render('select');
		$('#jueseBox').show();
		
	    console.log(!typeid)
	    if(typeid == 1||!typeid){
	  			$('.layui-form[data-type=one]').show();
	  			sessionStorage.setItem('type',1)
	  	}else{
	  			$('.layui-form[data-type=two]').show();	
	  			sessionStorage.setItem('type',3)
	  	}
	  	
	  	
	  	
	  form.on('select(aihao)', function(data){
		  if(data.value == 1){
		  	$('#phone').hide(300).attr('data-no','no');
		  	var type = sessionStorage.setItem('type',1)
		  }else if(data.value == 2){
		  	$('#phone').show(300).attr('data-no','yes');
		  	var type = sessionStorage.setItem('type',2)
		  }
		  var state = sessionStorage.setItem('state',data.value)
	  }); 
	  
	  form.on('select(shanghu)', function(data){
		  if(data.value == 1){
		  	var type = sessionStorage.setItem('type',3)
		  	$('#jueseBox').show(300);
		  }else if(data.value == 2 ){
		  	var type = sessionStorage.setItem('type',4)
		  	$('#jueseBox').hide(300);
		  }
		  var state = sessionStorage.setItem('state',data.value)
	  }); 
	  
	  form.on('select(juese)', function(data){
		  var giveRoleId = ($('#juese').find('option').eq(data.value-1)).attr('title');
		  sessionStorage.setItem('giveRoleId',giveRoleId);
	  });
	});
  	
})(jQuery);