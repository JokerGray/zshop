$(function(){
			var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
			var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
			//编辑账号信息
			$('.modify').each(function(i){
				$(this).click(function(){
					$(this).siblings().replaceWith("<input type='text' class='editinfo' autofocus/>");
					$('.editinfo').each(function(){
						$(this).blur(function(){
							var val=$(this).val();
							if(val==''){
								layer.msg("请完善信息");
							}else{
								$(this).replaceWith("<div>"+val+"</div>")
							}
						})	
					})
				})
			})
		   	
		   	var num1=sessionStorage.getItem('usercode');
		   	var num2=sessionStorage.getItem('operationPhone');
		   	$('.number').text(num2);
		   	$('.number').text(num1);
//		    $.ajax({
//		    	type :"POST",
//		    	url :"/zxcity_restful/ws/rest",
//		    	dataType: "json",
//		    	data: {
//		    		"cmd" : "cms_back/querySubScriptionByUserId",
//		    		"version" : 1,
//		    //		"data" : "{'userId':'60'}"
//		    		"data" : "{'userId':'"+userId+"'}",
//		    	},
//		    	beforeSend:function(request){
//					request.setRequestHeader("apikey", apikey);
//				},
//		    	success:function(re){
//		    		alert(JSON.stringify(re));
//		    		var num2=sessionStorage.getItem('userId');
//		    		alert(num2);
//		    		console.log(re.code)
//		    		if(re.code==1){
//			    		console.log(re.data);
//			    	$('.account-name').text(re.data.scSysUser.username);
//						$('.account-intro').text(re.data.scSysUser.signature);
//						$('.face').attr('src',re.data.scSysUser.userpic).css('width','100px');
//						$('.contact').text(re.data.operationName);
//						$('.number').text(num2);
//						$('.field').text(re.data.scCmsSubscriptionType.subscriptionTypeName);
//						$('.position').text("中国/"+re.data.province.areaname+"/"+re.data.city.areaname);
//						$('.website').text(re.data.webbUrl);
//						$('.company').text(re.data.companyName);
//						$('.address').text(re.data.companyAdderss);
//						$('.mail').text(re.data.contactEmail);
//						sessionStorage.setItem("subscriptionId",re.data.subscriptionId);
//		    		}
//		   		},
//		   		error:function(){
//		   			layer.msg("数据获取失败")
//		   		}
//		    	
//		    })
		    
		    $('.account-submit').click(function(){
		    	var website=$('.website').text();
		    	var company=$('.company0').text();
		    	var address=$('.address').text();
		   		var mail=$('.mail').text();
		   		var subscriptionId=sessionStorage.getItem("subscriptionId");
		    	$.ajax({
		    		type:"post",
		    		url:"/zxcity_restful/ws/rest",
		    		dataType:"json",
		    		data: {
		    			"cmd" : "cms_back/updateByPrimaryKeySelective",
		    			"version" : 1,
		    			"data" : "{'webUrl':' "+website+" ','contactEmail':' "+mail+" ','subscriptionId' :'"+subscriptionId+"'}",
		    		},
		    		beforeSend:function(request){
						request.setRequestHeader("apikey",apikey);
				},
				success:function(req){
//						console.log(req);
						if(req.code==1){
							layer.msg(req.msg);
						}	
					}
		    	});
		    })
})