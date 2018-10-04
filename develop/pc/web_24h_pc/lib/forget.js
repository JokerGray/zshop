$(function(){
	var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
	var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
	//验证用户手机号是否存在
	$('.getcode').click(function(){
		var ucode=$('#username').val();//手机号
		if(ucode==''){
			layer.msg("请输入手机号")
		}else{
			sessionStorage.setItem("usercode",ucode);
//			var Ucode=sessionStorage.getItem("usercode")
			$.ajax({
				type:"POST",
				url:"/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd" : "user/findUserByUsercode",
					"version" : "1",
					"data" : "{'usercode':'"+ucode+"'}"
				},
				beforeSend:function(request){
					request.setRequestHeader("apikey",apikey)
				},
				success:function(re){
					if(re.code==9){
						layer.msg(re.msg);
						console.log("用户名不存在");
					}	
					else if(re.code==1){
//							console.log(re);
						//获取验证码
							$.ajax({
								type:"POST",
								url:"/zxcity_restful/ws/rest",
								dataType: "json",
								data: {
									"cmd" : "user/reqCode",
									"version" : "1",
									"data" : "{'usercode':'"+ucode+"'}"
								},
								beforeSend:function(request){
									request.setRequestHeader("apikey",apikey)
								},
								success:function(re){
									if(re.code==9){
										layer.msg(re.msg);
									}	
									if(re.code==1){
											console.log(re);
											sessionStorage.setItem("randomcode",re.data.randomcode);
											console.log(re.data.randomcode);
									}		
								},
								error:function(re){
									
									layer.msg(re.msg)
								}
							});
						
					}		
				},
				error:function(re){
					console.log("用户名不存在");
					layer.msg(re.msg)
				}
			});
		}
	});
	//重置密码 
	$('#sendSubmit').click(function(){
		var num=$('#num').val();
		var Ucode=sessionStorage.getItem("usercode");
//		var rcode=sessionStorage.getItem("randomcode");
		var Rcode=sessionStorage.getItem("randomcode");
//		alert(Ucode);//手机号
//		alert(Rcode);//验证码
		if(num==Rcode){
			//验证验证码
			$.ajax({
				type:"POST",
				url:"/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd" : "user/checkCode",
					"version" : "version",
					"data" : "{'usercode':'"+Ucode+"','captcha':'"+Rcode+"'}"
				},
				beforeSend:function(request){
					request.setRequestHeader("apikey",apikey)
				},
				success:function(re){
					console.log(re.data);
					console.log(re.data.id);
//					alert(re.data.id);
					sessionStorage.setItem('id',re.data.id);
					$('.btn-submit').attr('href','reset.html');
					location.href="reset.html";
				},
				error:function(re){
//					console.log(re);
					alert('失败');
				}
			});
			
		}else{
			layer.msg("验证码错误");
		}
		
	})
	
})
