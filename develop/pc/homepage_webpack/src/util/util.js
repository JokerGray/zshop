// 通用Ajax请求
function reqAjax(cmd, data){
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
            deferred.resolve(data)
        },
        error: function(){
            deferred.reject()
        }
    });
    return deferred;
}

// block元素垂直居中
function blockVetically(dom){
    var $dom = dom instanceof jQuery ? dom : $(dom);
    $dom.each(function(i, v){
        var ele = this;
        // 图片在加载完成之后才能有具体宽高
        if(ele.nodeName == 'IMG'){
            var $ele = $(ele)
            var interval = setInterval(function(){
                if(ele.complete) {
                    $ele.css('margin-top', parseInt(($ele.parent().height() - $ele.height()) / 2));
                    clearInterval(interval);
                }
            }, 20);
        } else {
            var $ele = $(ele)
            $ele.css('margin-top', parseInt(($ele.parent().height() - $ele.height()) / 2));
        }
    })
}


module.exports = {
    reqAjax: reqAjax,
    blockVetically: blockVetically
}