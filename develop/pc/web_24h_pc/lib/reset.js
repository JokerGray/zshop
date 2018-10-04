$(function(){
	$('.btn-submit').click(function(){
		var newpass1=$('#newpass1').val();
		var newpass2=$('#newpass2').val();
		var username=sessionStorage.getItem("usercode");//手机号
//		alert(username);
		var Id=sessionStorage.getItem("id");
//		alert(Id);
		if(newpass1==newpass2){
			$.ajax({
				type:"POST",
				url:"/zxcity_restful/ws/rest",
				dateType:"json",
				async: true,
				data : {
					"cmd" : "user/updateScSysUser",//根据用户id修改用户信息（密码）
					"version" : "1",
					"data" : "{'username': '"+username+"','password': '"+newpass1+"','id': "+Id+"}"
				},
				beforeSend:function(request){
					request.setRequestHeader("apikey",apikey)
				},
				success:function(re){
					console.log(re);
					console.log('成功');
					location.href='login.html';
				},
				error:function(){
//					console.log(re);
					console.log('失败');
				}
			});
		}else{
			layer.msg("两次密码不一致")
		}
	})
})
