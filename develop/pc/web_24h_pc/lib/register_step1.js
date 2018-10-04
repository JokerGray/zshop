(function() {
	var register = {
		isSubmit: false,
		isGetCode: false,
		mobile: $("#mobile"),
		pass: $("#password"),
		code: $("#code"),
		getCode: function() {
			if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.mobile.val().trim()))) {
				layer.msg('请填写正确的手机号码！', { icon: 2, shade: [0.1, '#fff'], offset: '20%' }, function() {
					register.mobile.focus();
				});
			} else {
				var usercode = this.mobile.val().trim();
				var cmd = "user/findUserByUsercode";
				var data = '{"usercode":"' + usercode + '"}';
				//检测手机号码是否注册
				reqAjaxAsync(cmd, data).done(function(res) {
					if(res.code == 1) {
						$(".codestr").text("");
						$("#codestr").hide();
						layer.msg('该手机号码已注册！', { icon: 2, shade: [0.1, '#fff'], offset: '20%' }, function() {
							register.mobile.focus();
						});
					} else {
						var cmd = "user/reqCode";
						var data = '{"usercode":"' + usercode + '"}';
						//请求验证码
						reqAjaxAsync(cmd, data).done(function(res) {
							if(res.code == 1) {
								register.isGetCode = true;
								var randomcode = res.data.randomcode;
								$(".codestr").text(randomcode);
								$("#codestr").show();
							}
						})
					}
				})
			}
		},
		doloop: function() {

		},
		submitRegister: function() {
			this.isSubmit = this.isGetCode;
			var usercode = this.mobile.val().trim();
			
			var pass = this.pass.val().trim();
			var captcha = this.code.val().trim();
			var cmd = "user/reg";
			var data = '{"usercode":"' + usercode + '","captcha":"' + captcha + '","password":"' + pass + '"}';
			if (this.isSubmit){
				layer.load();
				$.when(reqAjaxAsync(cmd,data)).done(function(re){
					setTimeout(function(){
						layer.closeAll('loading');
						if(re.code == 1)
						{
							layer.msg("注册成功！",{icon:6},function(){
								sessionStorage.setItem('operationPhone',usercode);
								location.href = 'index.html';
							});
						}else{
							console.log(re);
							layer.msg(re.msg);
						}
					},2000)
				});
			}else{
				layer.msg('请按要求填写资料！', { icon: 2, shade: [0.1, '#fff'], offset: '20%' });
			}
		}
	}
	$(".code-btn").on("click", function() {
		register.getCode();
	})
	$("#sendSubmit").on("click", function() {
		register.submitRegister();
	})
})(jQuery)