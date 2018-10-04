(function($) {
		var userImg = yyCache.get('userImg',"");
	    var username = yyCache.get('username',"");
	    var apikey = yyCache.get('apikey',"test");
	    var version = yyCache.get('version',"1");
	    var userId = yyCache.get("userId","");
	    var password = yyCache.get("password","");
	    var param = "{'apikey':'"+ apikey +"'}"; //退出入参
	    var cmd = "operations/loginout"; //退出接口
	    var cmdChange="operations/modifyUserPwd"//修改密码接口
	    function saveParameter(){
	        var passStr = $('#oldpass').val();
	        var newStr = $('#pass').val();
	        var conStr = $('#newpass').val();
	        if(passStr==''){
	        	layer.msg('请输入旧密码')
	        }else if(passStr==''){
	        	layer.msg('请输入新密码')
	        }else if(newStr.length<6||newStr.length>18){
	        	layer.msg('新密码范围6-18位')
	        }else if(conStr==''){
	        	layer.msg('请再次输入新密码')
	        }else if(newStr!=conStr){
	                layer.msg('两次密码不相同')
	        }else if(passStr!=password){
	                layer.msg('原密码输入错误')
	        }else{
	           layer.msg("修改密码成功!", function() {
	            var d1 = {
	                        id:userId,
	                        oldPwd:password,
	                        newPwd:newStr,
	                        confirmPwd:conStr
	                    }
	
	            d1 = JSON.stringify(d1)
	            var t= reqAjax(cmdChange,d1);
			   
				
				yyCommon.logout();
	          }); 
	        }
	    }
	    
	   function clear(){
	   		$('#oldpass').val('');
	        $('#pass').val('');
	        $('#newpass').val('');
	   }
	   $('body').on('click','#save',saveParameter)
	    $('body').on('click','#clear',clear)

})(jQuery)