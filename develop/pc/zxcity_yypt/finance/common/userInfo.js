$(function () {
	//layer配置
	layer.config({
		extend: 'myskin/style.css', //加载您的扩展样式
		skin: 'layer-ext-myskin'
	});
	
	
	
	
	
	var type = $.parseJSON(getUrlParams("type"));
	var merchantId = $.parseJSON(getUrlParams("merchantId"));
	
	//var merchantId = params.merchantId;
	
	
	var jsonData = "{'type': '"+type+"','id': '" + merchantId + "'}";
	
	var res = reqAjax('payStatistics/selectUserInfo', jsonData);
	if(res.code == 1){
		
		if(type == 0){
//		    layer.tips(res.data.userName, '#userName');
			$("#userCode").val(res.data.userCode);
			$("#userbirth").val(res.data.userbirth);
			$("#residenceName").val(res.data.residenceName);
			$("#phone").val(res.data.phone);
			$("#regMode").val(res.data.regMode);
			$("#userSex").val(res.data.userSex);
			$("#userName").val(res.data.userName).on('mouseover', function(){
                var that = this;
                layer.tips(that.value, that, {
                    tips: 1
                }); //在元素的事件回调体中，follow直接赋予this即可
            });
			$("#locked").val(res.data.locked);
			$("#registType").val(res.data.registType);
			$("#isrealname").val(res.data.isrealname);
		}
		
	} else {
		layer.alert(res.msg);
	}
	
	
	
});

