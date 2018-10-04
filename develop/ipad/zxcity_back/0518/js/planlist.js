(function($){
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
    var pageNo = 1, pageSize = 5;

    function getUrlParams(name){
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null){
    		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
    }

    var projectType = getUrlParams("projectType") || 0;

    //加载方案内容
    function getPlanList(){
        var params = "{'projectType': " + projectType + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		async: false,
    		data: {
    			"cmd": 'shop/getShopProjectList',
    			"data": params,
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
    			if(res.code == 1){

                }
    		},
    		error: function(re){
    			console.error(re);
    		}
    	});
    }

    getPlanList();


})(jQuery);
