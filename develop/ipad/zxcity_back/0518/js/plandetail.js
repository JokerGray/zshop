(function($){
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

    function getUrlParams(name){
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null){
    		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
    }

    var planId = getUrlParams("id") || 57;

    //加载方案内容
    function getPlanDetailById(){

        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		async: false,
    		data: {
    			"cmd": 'shop/getOne',
    			"data": '{"id": '+planId+'}',
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
    			if(res.code == 1){
                    $(".main-content .title").html(res.data.title);
                    $(".main-content .time .time-txt").html(res.data.createTime);
                    $(".main-content .content").html(res.data.content);
                    $(".other .publisher .name").html(res.data.author);
                }
    		},
    		error: function(re){
    			console.error(re);
    		}
    	});
    }

    //点赞
    $(".other .like-btn").click(function(){
        $.ajax({
    		type: "POST",
    		url: "/zxcity_restful/ws/rest",
    		dateType: "json",
    		async: false,
    		data: {
    			"cmd": 'shop/updateFav',
    			"data": '{"id": '+planId+'}',
    			"version": version
    		},
    		beforeSend: function(request){
    			request.setRequestHeader("apikey", apikey);
    		},
    		success: function(res){
                $(".other .like-btn").addClass("active");
    		},
    		error: function(re){
    			console.error(re);
    		}
    	});
    });
    //

    $(function(){
        getPlanDetailById();
    });


})(jQuery);
