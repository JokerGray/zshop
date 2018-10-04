// 通用ajax调用  
function reqAjax(cmd, data){
	var loadIndex=layer.load();
    var deferred = $.Deferred();
    $.ajax({
        type:"post",
        dataType: 'json',
        url:"/zxcity_restful/ws/rest",
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(data),
            version: 1 // 版本号根据情况默认
        },
        success: function(data){
			layer.close(loadIndex);
            deferred.resolve(data)
        },
        error: function(){
            // 这里的 error 一般都是网络问题，500了也检查不出来
            layer.close(loadIndex);
            layer.msg('连接出错，请检查网络或稍后再试！',{icon:2});
            deferred.reject()
        }
    });
    return deferred;
}

// 获取url地址信息
function getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    return r !== null ? encodeURI(r[2]) : ''
}