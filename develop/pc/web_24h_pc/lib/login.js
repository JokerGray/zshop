(function() {
	var login = {
		user: $("#username"),
		code: $("#password"),
		checkinput: function() {
			if(this.user.val() == '' || this.code.val() == '') {
				layer.msg('请输入用户名或者密码！',{icon:2,shade:[0.1, '#fff'],offset: '20%'},function(){
					login.user.val().trim() == "" ? login.user.focus() : login.code.focus();
				});
				return false;
			}
			this.sendSubmit();
		},
		sendSubmit: function() {
			var cmd = "user/login";
			var data = "{'usercode':'" + this.user.val() + "','password':'" + this.code.val() + "'}";
			var reData = reqAjax(cmd,data);
			if (reData.code == 1){
				layer.msg('登录成功！');
//				alert(JSON.stringify(reData));
				var userData = reData.data;
				var num1=$("#username").val();
				sessionStorage.setItem('userId',userData.scSysUser.id);
				sessionStorage.setItem('username',userData.scSysUser.username);
				sessionStorage.setItem('userpic',userData.scSysUser.userpic);
				sessionStorage.setItem("scSysUserInfo",JSON.stringify(userData.scSysUser));
				sessionStorage.setItem('signature',userData.scSysUser.signature);
				sessionStorage.setItem('operationPhone',num1);
				var userId = sessionStorage.getItem('userId');
				cmd = "cms_back/querySubScriptionByUserId";
				data = "{'userId':'" + userId + "'}";
				reData =  reqAjax(cmd,data);
				if (reData.code == 1){
					var subscriptionInfo = reData.data;
					if (subscriptionInfo == null)
					{
						location.href = 'index.html';
					}else{
						sessionStorage.setItem("subscriptionInfo",JSON.stringify(subscriptionInfo));
						location.href = 'index.html';
					}
				}else{
					console.log( reData);
					layer.msg('系统忙请稍后重试！',{icon:2,shade:[0.1, '#fff'],offset: '20%'});
				}
			}else{
				console.log( reData);
				layer.msg(reData.msg,{icon:2,shade:[0.1, '#fff'],offset: '20%'});
			}
		}
	}
	$("#sendSubmit").on('click', function() {
		login.checkinput();
	})
})(jQuery);