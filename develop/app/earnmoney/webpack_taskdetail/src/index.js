import './index.scss';

$(document).ready(function(){
    loading();
    var taskId = getQueryString('taskid') || 0;
    var def = reqAjax('earnmoney/getTEDForConsumer', {taskId: taskId});
    def.then(function(data){
        layer.closeAll('loading');
        if (data.code == 1){
            initData(data.data);
        } else {
            toast(data.msg);
        }
    });
    def.fail(function(){
        layer.closeAll('loading');
        toast('连接失败！请检查网络环境~');
    });
});
// 获取url中的参数
function getQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    return r !== null ? decodeURI(r[2]) : null;
}
// 提示语句
function toast(msg){
    return layer.open({type: 0,content: msg, style:"color:#fff;background-color:rgba(0,0,0,0.7);font-size:14px;letter-spacing: 1px;", shade:"background-color:rgba(0,0,0,0.1)"})
}
// 加载状态
function loading(msg){
    return layer.open({type: 2})
}
// 通用ajax调用
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
            // 这里的 error 一般都是网络问题，500了也检查不出来
            toast('连接出错，请检查网络或稍后再试！');
            deferred.reject()
        }
    });
    return deferred;
}

// 初始化初级
function initData(data){
    if(Object.keys(data).length == 0) {
        return toast('空数据！');
    }
    share('需要“'+data['taskTitle']+'”', data['taskDemand'], data['userPic']);
    setPackageLink();

    $('span[id]').each(function(){
        $(this).text(data[this.id])
    });
    $('#taskPrice').text(parseFloat(data['taskPrice']).toFixed(2));
    $('#userPic').attr('src', data['userPic']);
    $('#taskDemand').text(data['taskDemand']);
    $('#createTime').text(data['createTime']);
    var arr = data.resourceList;
    for(var i=0; i<arr.length; i++){
        var img = $('<img>').attr('src', arr[i]['resourceUrl'])
        $('#resources').append(img);
    }
    if(arr.length == 0) {
        $('#resources').parent().remove()
    }
}

// 分享页面
function share(title, introduce, imgUrl){
    $('#meta_title').attr('content', title);
    document.title = title;
    $('#meta_introduce').attr('content', introduce);
    $('#meta_imgUrl').attr('content', imgUrl);
    $.ajax({
        type: "post",
        url: "/zxcity_restful/ws/rest",
        dataType: 'json',
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: 'game/getSign',
            data: JSON.stringify({
                url: location.href
            }),
            version: 1
        },
        success: function(res) {
            wx.config({
                debug: false,
                appId: 'wxe50dd59beab1e644',
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo', 'onMenuShareQZone', 'onMenuShareQZone']
            });
            var options = {
                title: title,
                desc: introduce,
                link: location.href,
                imgUrl: imgUrl
            }
            wx.ready(function(){
                wx.onMenuShareTimeline({
                    title: introduce,
                    link: location.href,
                    imgUrl: imgUrl
                });
                wx.onMenuShareAppMessage($.extend({
                    type: '',
                    dataUrl: ''
                }, options));
                wx.onMenuShareQQ(options);
                wx.onMenuShareWeibo(options);
                wx.onMenuShareQZone(options);
                wx.onMenuShareQZone(options);
            })
        }
    });
}

// 设置礼包参数
function setPackageLink(){
    $('.download').removeClass('hidden');
    var sn = getQueryString('sn') || 1;
    var yw = getQueryString('yw') || 'earnmoney';
    var cp = getQueryString('cp') || 1;
    var search = location.href.split('?')[1];
    var href = '/24hours/share24/getPackage.html?'+search;
    $('.download').attr('href', href);
}