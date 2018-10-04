$(function(){
	var recommendUserId = getQueryString("recommendUserId") || 0;
	var productId = getQueryString("productId");
	var shareTime = getQueryString("shareTime");
	var iconUrl="http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/member/servicePackage/be9b8523c8504211ad7cc05ce6a89990.png";
	var mobileExp = /^1\d{10}$/; //手机正则
	var passwordExp = /^[0-9a-zA-Z]{6,16}$/; //密码正则
	var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im; //特殊符正则
	var regCh = new RegExp("[\\u4E00-\\u9FFF]+","g"); //中文正则


    //填写手机号
    var oldTelNumber = 0;
    var flag = true;


	//普通用户和商户切换
//	$('.typeChange span').each(function(){
//		$(this).click(function(){
//			if($(this).attr("id")=="normalStore"){
//				if($('.storeInfo').css('display')=='none'){
//					$('.storeInfo').fadeIn();
//					$(this).css('background','url(images/putongshanghu.png) no-repeat 0 -1px');
//					$('#normalUser').css('background','url(images/putongyonghu＿2.png) no-repeat 0 0');
//					$('.storeInfoContainer').show();
//				}
//			}else if($(this).attr("id")=="normalUser"){
//				if($('.storeInfo').css('display')=='block'){
//					$('.storeInfo').fadeOut();
//					$(this).css('background','url(images/putongyonghu.png) no-repeat 0 0');
//					$('#normalStore').css('background','url(images/putongshanghu＿2.png) no-repeat 0 -0.01rem');
//				}
//			}
//		})
//	})

	//商户详细信息显示隐藏
//	$('#showMore').click(function(){
//		if($('.storeInfoContainer').css('display')=='block'){
//			$('.storeInfoContainer').fadeOut();
//			$(this).attr('src','images/yundian_home_touxiang1.png');
//		}else{
//			$('.storeInfoContainer').fadeIn();
//			$(this).attr('src','images/yundian_home_touxiang2.png');
//		}
//	})
	
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
//	reqAjaxAsync('share/initUserReg').done(function(res){
//		if(res.code==9){
//			var arr1=new Array();
//			var arr2=new Array();
//			//行业选择列表
//			for(var i=0;i<res.data.merchantTrades.length;i++){
//				var type=res.data.merchantTrades[i].name;
//				arr1[i]=type;
//				sessionStorage.setItem('arr',JSON.stringify(res.data.merchantTrades))
//				$(".storeTypes").picker({
//				  title: "请选择所属行业",
//				  inputReadOnly: true,
//				  cols: [
//				    {
//				      textAlign: 'center',
//				      values: arr1
//				    }
//				  ]
//				});
//			}
//			//省市选择列表
//			for(var i=0;i<res.data.provinceAndCity.length;i++){
//				if(regEn.test(res.data.provinceAndCity[i].code)==false&&regCh.test(res.data.provinceAndCity[i].code)==false){
//					var arr3=new Array();
//					var areaList=res.data.provinceAndCity[i];
//					for(var j=0;j<areaList.childList.length;j++){
//						arr3.push({
//							name: areaList.childList[j].areaname,
//							code: areaList.childList[j].code,
//							sub:[]
//						})
//					}
//					arr2.push({
//						name: areaList.areaname,
//						code: areaList.code,
//						sub: arr3
//					})
//				}
//			}
//			proviceData(JSON.stringify(arr2));
//	    	$(".storeAddress").cityPicker({
//		        title: "请选择省市",
//		        inputReadOnly: true,
//  			showDistrict: false,
//		        onChange: function (picker, values, displayValues) {
//		            console.log(values, displayValues);
//		            $(".storeAddress").val(displayValues);
//		        }
//	    	});
//		}else{
//			console.log(res.msg);
//		}
//	})

	//防止手机软键盘和pickerview冲突
//	$('.register input.form-control').each(function(){
//		$(this).click(function(){
//			$('.storeAddress').picker("close");
//			$('.storeTypes').picker("close");
//		})
//	})
//	
//	$('.store-picker').each(function(){
//		$(this).click(function(){
//			document.activeElement.blur();
//      	$("input").blur();
//		})
//	})
//	
//	$('.weui-picker-modal').bind( "touchmove", function (e) {
//	   e.preventDefault();
//	});
	

	//获取验证码
    var seconds = 60, timer = null;
    $('#getCode').on('click', function (){
        clearInterval(timer);
        var telNumber = $('#registerTel').val();
        if(telNumber){
            if(is_mobile(telNumber)){
                reqAjaxAsync('user/findUserByUsercodeAtv', JSON.stringify({usercode: telNumber})).done(function (res){
                    if(res.code == 1) {
                        layer.open({
                            content: '该用户已注册',
                            time: 2
                            ,btn: ['下载APP', '重新输入']
                            ,yes: function(index){
                                layer.close(index);
                                window.location.href = 'http://erweima.izxcs.com/erweima.php';
                            }
                            ,no: function(index) {
                                layer.close(index);
                                $('#registerTel').val('');
                            }
                        });
                    }else if(res.code == 9){
                        timer = setInterval(function () {
                            seconds--;
                            if (seconds > 0) {
                                $('#getCode').html('正在获取中(' + seconds + ')').attr('disabled',true).addClass('zhezhao');
                            } else {
                                $('#getCode').html('获取验证码').attr('disabled',false).removeClass('zhezhao');
                                seconds=60;
                                clearInterval(timer);
                            }
                        }, 1000);
                        reqAjaxAsync('user/reqCodeNew', JSON.stringify({ 'usercode': telNumber, 'operaType': 'userReg' })).done(function (res) {
                            console.log(res);
                            if (res.code == 1) {
                                oldTelNumber = $('#registerTel').val();
                                loginFlag = true;
                                layer.open({
                                    content: '新用户密码为验证码',
                                    skin: 'msg',
                                    time: 5
                                });
                            } else {
                                layer.open({
                                    content: res.msg,
                                    skin: 'msg',
                                    time: 2
                                });
                            }
                        })
                    }else{
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2
                        });
                    }
                })
            }else {
                layer.open({
                    content: '手机号不正确',
                    skin: 'msg',
                    time: 2
                });
            }

        }else{
            layer.open({
                content: '请填写手机号',
                skin: 'msg',
                time: 2
            });
        }
    });
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
	// function getData(params,userType){
	// 	reqAjaxAsync('share/shareReg',JSON.stringify(params)).done(function(res){
	// 		if(res.code==1){
	// 			if(userType==1){
	// 				layer.msg("注册成功");
	// 			}else if(userType==2){
	// 				layer.msg("升级普通商户申请已提交，请等待运营平台审核");
	// 			}
	// 			setTimeout(function(){window.location.href='http://erweima.izxcs.com/erweima_zds.php';},2000)
	// 		}else{
	// 			layer.msg(res.msg);
	// 		}
	// 	})
	// }

	//注册
	$('#registNow').click(function(){
		var userName=$('.number').val();
		var codeValue=$('.code').val();

        if (!is_mobile(userName) || isNull(codeValue)) {
            return layer.open({ content: '手机号或验证码错误', skin: 'msg', time: 2 });
        }
        //提交的用户名与获取验证码的用户名是否一致
        if(oldTelNumber != userName) {return layer.open({ content: '两次输入手机号不一致', skin: 'msg', time: 2 })};
        var cData = {
        	'usercode': userName,
			'usersex': '男',
			'recommendUserId': recommendUserId,
			'captcha': codeValue,
			'password': codeValue
        };
        //注册用户
        reqAjaxAsync('user/reg', JSON.stringify(cData)).done(function (res) {
            console.log(res);
            if (res.code == 1) {
                if(loginFlag) {
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2
                    });
                }
                setTimeout(
                	function(){
                		window.location.href='http://erweima.izxcs.com/erweima_zds.php';
                		},
					2000)

                // 领取礼包
            } else {
                if(loginFlag) {
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2
                    });
                }
            }
        })
	})
	
	//微信分享
	weixin('智大师:让天下没有难做的经营、让人人成为经营大师',iconUrl,'分享注册',apikey,version);
})
function is_mobile(val) {
    var reg = /^1[3,5,7-8][0-9]{9}$/i;
    return reg.test(val);
}
// //判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "") {
        return true;
    }
    return false;
}


