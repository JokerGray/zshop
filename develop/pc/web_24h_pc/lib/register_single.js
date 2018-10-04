(function() {
	var userId = sessionStorage.getItem("userId");
	var subscriptionType = "0";
	var register = {
		subscriptionName: $("input[name='subscriptionName']"),
		subscriptionSynopsis: $("textarea[name='subscriptionSynopsis']"),
		assistData: $("textarea[name='assistData']"),
		provinceCode: $("select[name='province']"),
		cityCode: $("select[name='city']"),
		subscriptionType: $("select[name='subscriptionType']"),
		operationPhone: $("input[name='operationPhone']"),
		contactEmail: $("input[name='contactEmail']"),
		checkInput: function() {
			if(this.subscriptionName.val().trim() == "") {
				layer.tips('请填写24小时名称！', this.subscriptionName.valueOf().selector, {
					tips: [3,'#ff8b6f']
				});
				this.subscriptionName.focus();
				return false;
			}
			if(this.subscriptionSynopsis.val().trim() == "") {
				layer.tips('请填写24小时介绍！', this.subscriptionSynopsis.valueOf().selector, {
					tips: [3,'#ff8b6f']
				});
				this.subscriptionSynopsis.focus();
				return false;
			}
			if(this.provinceCode.val() == -1) {
				layer.tips('请选择所在地！', this.provinceCode.valueOf().selector, {
					tips: [2,'#ff8b6f']
				});
				this.provinceCode.focus();
				return false;
			}
			if(this.subscriptionType.val() == -1) {
				layer.tips('请选择领域！', this.subscriptionType.valueOf().selector, {
					tips: [2,'#ff8b6f']
				});
				this.subscriptionType.focus();
				return false;
			}
			if(this.operationPhone.val().trim() == "") {
				layer.tips('请填写运营者电话！', this.operationPhone.valueOf().selector, {
					tips: [3,'#ff8b6f']
				});
				this.operationPhone.focus();
				return false;
			}
			if(this.contactEmail.val().trim() == "") {
				layer.tips('请填写联系邮箱！', this.contactEmail.valueOf().selector, {
					tips: [1,'#ff8b6f']
				});
				this.contactEmail.focus();
				return false;
			}
			this.sendSubmit();
		},
		sendSubmit: function() {
			layer.load(0,{shade: [0.1,'#fff']});
			var cmd = "cms_back/registerOrModify";
			var data = {};
			data.userId = userId;
			data.subscriptionName = this.subscriptionName.val().trim();
			data.subscriptionSynopsis = this.subscriptionSynopsis.val().trim();
			data.subscriptionImgUrl = "http://img4.duitang.com/uploads/item/201407/24/20140724104849_NJPAG.thumb.200_200_c.jpeg";
			data.assistData = this.assistData.val().trim();
			data.provinceCode = this.provinceCode.val();
			data.cityCode = this.cityCode.val();
			data.subscriptionTypeId = this.subscriptionType.val();
			data.otherPapersImg = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488463400655&di=0ff3f18063f4c4932b8d281f249ebfe7&imgtype=0&src=http%3A%2F%2Fimg.vlongbiz.com%2Fmember2009%2Fqazxsw708%2F1273729818.jpg";
			data.operationPhone = this.operationPhone.val().trim();
			data.contactEmail = this.contactEmail.val().trim();
			data.subscriptionType = subscriptionType;
			data = JSON.stringify(data); 
			$.when(reqAjaxAsync(cmd,data)).done(function(re){
				setTimeout(function(){
					layer.closeAll('loading');
					if(re.code == 1)
					{
						layer.msg("注册成功！",{icon:6},function(){
							location.href = 'index.html';
						});
					}else{
						console.log(re.msg);
						layer.msg("系统繁忙，请稍后重试！");
					}
				},2000)
			});
		}
	}
	$(".signform-checkbox").on("click",function(){
		if ($(this).hasClass("checked")){
			$(this).removeClass("checked");
			$("#signform_btn").removeClass("signform-submit").addClass("disabled");
		}else{
			$(this).addClass("checked");
			$("#signform_btn").removeClass("disabled").addClass("signform-submit");
    	}
    });
	$(".signform-submit").on("click", function() {
		register.checkInput();
	});
	$(".signform-face-btn").on("click",function(){
		console.log(21);
//		layer.open({
//			type:2,
//			title:'上传头像',
//			content:'upload/upload_single_img.html',
//			area: ['800px', '600px']
//		});
	});
})(jQuery)