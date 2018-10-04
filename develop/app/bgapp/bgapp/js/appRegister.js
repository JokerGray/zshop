$(function(){
	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
    var mobileExp = /^1\d{10}$/; //手机正则
	var passwordExp = /^[0-9a-zA-Z]{6,16}$/; //密码正则
	
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var recommendUserId = theRequest['recommendUserId']==undefined?null:theRequest['recommendUserId'];
	var productId = theRequest['productId']==undefined?null:theRequest['productId'];
	var shareTime = theRequest['shareTime']==undefined?null:theRequest['shareTime'];
	
	//普通用户和商户切换
	$('.type-change div').each(function(){
		$(this).click(function(){
			if($(this).hasClass('normal-store')){
				if($('.store-info').css('display')=='none'){
					$('.store-info').fadeIn();
					$(this).css('background','url(images/putongshanghu.png) no-repeat 0 -1px');
					$('.normal-user').css('background','url(images/putongyonghu＿2.png) no-repeat 0 0');
					$('.storeInfo-container').show();
				}
			}else if($(this).hasClass('normal-user')){
				if($('.store-info').css('display')=='block'){
					$('.store-info').fadeOut();
					$(this).css('background','url(images/putongyonghu.png) no-repeat 0 0');
					$('.normal-store').css('background','url(images/putongshanghu＿2.png) no-repeat 0 -1px');
				}
			}
		})
	})
	
	//商户详细信息显示隐藏
	$('.show-hide').click(function(){
		if($('.storeInfo-container').css('display')=='block'){
			$('.storeInfo-container').fadeOut();
			$(this).attr('src','images/yundian_home_touxiang1.png');
		}else{
			$('.storeInfo-container').fadeIn();
			$(this).attr('src','images/yundian_home_touxiang2.png');
		}
	})
	
	//回到顶部
	$(window).on('scroll', function () {
	//判断显示还是隐藏按钮
	  	if($(this).scrollTop()>=$(this).height()){
	  	  	$('.goTop').fadeIn('slow');
	 	 }else{
	   	 	$('.goTop').fadeOut('slow');
	  	}
	});
	$('.goTop').on('click',function () {
	  $('html,body').animate({scrollTop: $('.register').position().top},500);
	});

	//所属行业列表和省市联动
	var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
	var regCh = new RegExp("[\\u4E00-\\u9FFF]+","g")
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"share/initUserReg",
			"version": version,
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
			if(res.code==9){
				var arr1=new Array();
				var arr2=new Array();
				//行业选择列表
				for(var i=0;i<res.data.merchantTrades.length;i++){
					var type=res.data.merchantTrades[i].name;
					arr1[i]=type;
					sessionStorage.setItem('arr',JSON.stringify(res.data.merchantTrades))
					$(".store-types").picker({
					  title: "请选择所属行业",
					  inputReadOnly: true,
					  cols: [
					    {
					      textAlign: 'center',
					      values: arr1
					    }
					  ]
					});
				}
				//省市选择列表
				for(var i=0;i<res.data.provinceAndCity.length;i++){
					if(regEn.test(res.data.provinceAndCity[i].code)==false&&regCh.test(res.data.provinceAndCity[i].code)==false){
						var arr3=new Array();
						var areaList=res.data.provinceAndCity[i];
						for(var j=0;j<areaList.childList.length;j++){
							arr3.push({
								name: areaList.childList[j].areaname,
								code: areaList.childList[j].code,
								sub:[]
							})
						}
						arr2.push({
							name: areaList.areaname,
							code: areaList.code,
							sub: arr3
						})
					}
				}
				proviceData(JSON.stringify(arr2));
		    	$(".store-address").cityPicker({
			        title: "请选择省市",
			        inputReadOnly: true,
	    			showDistrict: false,
			        onChange: function (picker, values, displayValues) {
			            console.log(values, displayValues);
			            $(".store-address").val(displayValues);
			        }
		    	});
		    }
		}
	});
	
	//防止手机软键盘和pickerview冲突
	$('.register input.form-control').each(function(){
		$(this).click(function(){
			$('.store-address').picker("close");
			$('.store-types').picker("close");
		})
	})
	
	$('.store-picker').each(function(){
		$(this).click(function(){
			document.activeElement.blur();
        	$("input").blur();
		})
	})
	
	$('.weui-picker-modal').bind( "touchmove", function (e) {
	   e.preventDefault();
	});
	
	function getData(data,userType){
		$.ajax({
			type:"POST",
			url:"/zxcity_restful/ws/rest",
			dataType:"json",
			data:data,
			beforeSend:function(request){
				request.setRequestHeader("apikey", apikey);
			},
			success:function(res){
				if(res.code==1){
					if(userType==1){
						layer.msg("注册成功");
					}else if(userType==2){
						layer.msg("升级普通商户申请已提交，请等待运营平台审核");
					}
					setTimeout(function(){window.location.href='http://erweima.izxcs.com/erweima_zds.php';},2000)
				}else{
					layer.msg(res.msg);
				}
			},
			error:function(res){
				layer.msg(res.msg);
			}
		});
	}
	
	//获取验证码
	$('#get-code').click(function(){
		var userphone=$('.number').val();
		if(userphone==''){
			layer.msg('手机号码不能为空')
		}else{
			if(!mobileExp.test(userphone)){
				layer.msg('请填写正确的手机号码');
				return false;
			}else{
				$.ajax({
					type:"POST",
					url:"/zxcity_restful/ws/rest",
					dataType: "json",
					data: {
						"cmd": "backUser/getCode",
						"version": version,
						"data": "{'userphone': '"+userphone+"'}"
					},
					beforeSend:function(request){
						request.setRequestHeader("apikey", apikey);
					},
					success:function(res){
						if(res.code==1){
							layer.msg(res.msg);
							code("#get-code");
						}else{
							layer.msg(res.msg);
						}
					},
					error:function(res){
						layer.msg(res.msg);
					}
				});
			}
		}
	})
	
	//获取验证码倒计时
	function code(obj){
	    var countdown=60;
	    settime(obj);
	    function settime(obj) {
	        if (countdown == 0) {
	            $(obj).attr("disabled",false);
	            $(obj).html("获取验证码");
	            countdown = 60;
	            return;
	        } else {
	            $(obj).attr("disabled",true);
	            $(obj).html(countdown + "s后重新发送");
	            countdown--;
	        }
	        setTimeout(function() {
                settime(obj) }
            ,1000)
	    }
	}

	//注册
	$('#regist-now').click(function(){
		if(recommendUserId==null||productId==null||shareTime==null){
			layer.msg('分享者信息不完整');
			return false;
		}
		var phone=$('.number').val();
		var captcha=$('.code').val();
		var pass=$('.pass').val();
		var orgName=$('.store-name').val();
		var adminCode=$('.admin-name').val();
		var address=$('.store-address').val().split(' ');
		var provinceName=address[0];
		var cityName=address[1];
		var indexList=JSON.parse(sessionStorage.getItem('arr'));
		var indexVal=$('.store-types').val();
		var license01=sessionStorage.getItem('src1');
		var license02=sessionStorage.getItem('src2');
		var license03=sessionStorage.getItem('src3');
		var license04=sessionStorage.getItem('src4');
		for(var i=0;i<indexList.length;i++){
			if(indexList[i].name==indexVal){
				var trade=i+1;
			}
		}
		if(phone==''){
			layer.msg('电话号码不能为空');
			return false;
		}else if(captcha==''){
			layer.msg('验证码不能为空');
			return false;
		}else if(pass==''){
			layer.msg('密码不能为空');
			return false;
		}else{
			if(!passwordExp.test(pass)){
				layer.msg('请填写6-16位的由数字或字母组成的密码');
				return false;
			}else{
				if($('.store-info').css('display')=='none'){
					//普通用户注册
					getData({"cmd":"share/shareReg",
					         "version":version,
					         "data":"{'shareRegType':'1','phone':'"+phone+"','captcha':'"+captcha+"','password':'"+pass+"','recommendUserId':'"+recommendUserId+"','productId':'"+productId+"','shareTime':'"+shareTime+"'}"},1)
				}else{
					if(orgName==''){
						layer.msg('商家名称不能为空');
						return false;
					}else if(adminCode==''){
						layer.msg('商户管理员昵称不能为空');
						return false;
					}else if(license01==null||license01==undefined||license02==null||license02==undefined||license03==null||license03==undefined||license04==null||license04==undefined){
						layer.msg('请上传营业执照和身份证照片');
						return false;
					}else{
						//普通商户注册
						getData({"cmd":"share/shareReg",
								"version":version,
								"data":"{'shareRegType':'2','phone':'"+phone+"','captcha':'"+captcha+"','password':'"+pass+"','orgName':'"+orgName+"','adminName':'"+adminCode+"','provinceName':'"+provinceName+"','cityName':'"+cityName+"','trade':'"+trade+"','license01':'"+license01+"','license02':'"+license02+"','idCardFront':'"+license03+"','idCardBack':'"+license04+"','recommendUserId':'"+recommendUserId+"','productId':'"+productId+"','shareTime':'"+shareTime+"'}"},2)
					}
					
				}
			}
		}
	})
	
	//微信分享
	weixin('智大师:让天下没有难做的经营、让人人成为经营大师',"http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/member/servicePackage/be9b8523c8504211ad7cc05ce6a89990.png",'分享注册',apikey,version);
})

   

