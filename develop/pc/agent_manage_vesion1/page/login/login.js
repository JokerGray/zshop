layui.use(['form', 'layer', 'jquery'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;

	var AGENTLOGIN = 'operations/agentManageLogin'; //登录

	//是否记住密码
	function isRemberPassword() {
		var usercode = localStorage.getItem('usercode');
		var password = localStorage.getItem('password');
		if(usercode && password) {
			$("#username").val(usercode);
			$(".password").val(password);
			$("#radio").attr("checked", "checked");
			form.render('checkbox');
		} else {
			$("#username").val('');
			$(".password").val('');
			$("#radio").attr("checked", false);
			form.render('checkbox');
		}
	}
	isRemberPassword();


	//用户名和密码验证	
	form.verify({
		username: function(value, item) { //value：表单的值、item：表单的DOM对象
				if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
					return '用户名不能有特殊字符';
				}
				if(/(^\_)|(\__)|(\_+$)/.test(value)) {
					return '用户名首尾不能出现下划线\'_\'';
				}
				if(/^\d+\d+\d$/.test(value)) {
					return '用户名不能全为数字';
				}
			}
			//我们既支持上述函数式的方式，也支持下述数组的形式
			,
		pass: [
			/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
		]
	});

	//记住密码
	form.on('checkbox(test)', function(data) {
		if(data.elem.checked) {
			localStorage.setItem('isRember', true)
		} else {
			localStorage.setItem('isRember', false)
		}
	});
	
	
	//回车登陆
	$(document).keyup(function(event){
		if(event.keyCode ==13){
			$("#sendSubmit").click();
		}
	});
	
	//登录
	form.on('submit(logonSubmit)', function(data) {
		if(data) {
			var isRember = localStorage.getItem('isRember');
			var usercode = $('#username').val();
			var password = $('.password').val();
			var param = "{'usercode':'" + usercode + "','password':'" + password + "'}";
			reqAjaxAsync(AGENTLOGIN, param).then(function(res) {
				try {
					var ScSysBackUser = res.data.ScSysBackUser;
				} catch(e) {
					console.log(e)
				}
				if(res.code == 1) {
					localStorage.removeItem('usercode');
					localStorage.removeItem('password');
					sessionStorage.clear();
					if(isRember == true || isRember == 'true') {
						localStorage.setItem('usercode', usercode);
						localStorage.setItem('password', password);
					}
					sessionStorage.setItem('usercode', usercode);
					sessionStorage.setItem('password', password);
					sessionStorage.setItem('userImg', ScSysBackUser.userImg);
					sessionStorage.setItem('id', ScSysBackUser.id);
					sessionStorage.setItem('userno', ScSysBackUser.userno);
					sessionStorage.setItem('phone', ScSysBackUser.phone);
					sessionStorage.setItem('apikey', res.data.apikey);
					sessionStorage.setItem('t_userid', ScSysBackUser.id);
					location.href = 'index.html'
				}else{
					layer.msg(res.msg, { icon: 2, shade: [0.1, '#fff'], offset: '50%',anim: 6} )
				}

			})
		}
	});

})