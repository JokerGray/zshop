import './index.scss';

var supportStorage = window.localStorage && 

$(document).ready(function(){
    try {
        var localMacId = localStorage.macid;
        if(!localMacId) throw 'err';
        var userid = getQueryString('userid');
        var taskid = getQueryString('reprintid');
        var macId = setMacId(userid, taskid, localMacId);
        getArticle(userid, taskid, macId);
    } catch (error) {
        getMacIdAndGetArticle();
    }
});

// 初始化获取浏览器指纹
// function getMacId(userid, taskid){
//     var code = getCanvasCode();
//     var macId = setMacId(userid, taskid, code);
//     getArticle(userid, taskid, macId);
// }

// 获取macid且根据macid获取文章
function getMacIdAndGetArticle(){
    var userid = getQueryString('userid');
    var taskid = getQueryString('reprintid');
    var interval = setInterval(function(){
        if(window.Fingerprint2) {
            window.clearInterval(interval);
            new Fingerprint2().get(function(result, components){
                // 保存macid到localStorage
                try {
                    localStorage.macid = result;
                } catch (error) {}
                var macId = setMacId(userid, taskid, result);
                getArticle(userid, taskid, macId);
            });
        }
    }, 50)
}

// 获取帆布指纹
function getCanvasCode() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillText('lixiang',0,0)
    var b64 = canvas.toDataURL().replace("data:image/png;base64,","");
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-28,-12));
    return crc;
}

function bin2hex(s) {
    s += '';
    var i, l, o = '', n;
    for (i = 0, l = s.length; i < l; i++) {
      n = s.charCodeAt(i).toString(16);
      o += n.length < 2 ? '0' + n : n;
    }
    return o;
}

// 获取和设置文章
function getArticle(userid, taskid, macid) {
    $('#errorBlock a').attr('href', window.location.href);
    var loadingIndex = loading();
    $.ajax({
        type: 'POST',
        url: '/zxcity_restful/ws/rest',
        headers:{
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        dataType: 'json',
        data: {
            cmd: 'earnmoney/updateReadnum',
            data: JSON.stringify({
                userId: userid,
                reprintId: taskid,
                macId: macid
            }),
            version: 2
        },
        success: function (data) {
            layer.close(loadingIndex);
            if (data.code == 1 && data.data != null) {
                // 还需要给iframe下的礼包设置参数……
                var yw = getQueryString('yw');
                var cp = getQueryString('cp');
                $('#mainframe').attr('src', data.data.taskUrl + '&isComment=1&yw='+yw+'&cp='+cp+'&time='+new Date().getTime());
                $('title').text(data.data.taskTitle);
                share(data.data.taskTitle, data.data.taskTitle, data.data.taskPic)
            } else if(data.code == 8) {
                $('#wrap').hide();
                $('#errorBlock').show();
                $('#errorBlock p').text(data.msg);
            } else {
                $('#wrap').hide();
                $('#errorBlock').show();
                toast('数据获取失败，请重试～');
                $('#errorBlock p').text('数据获取失败，请重试～');
            }
        },
        error: function (xhr, type) {
            layer.close(loadingIndex);
            if (isAndroid()) {
                window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
            } else if (isIOS()) {
                htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
            }
            $('#wrap').hide();
            $('#errorBlock').show();
            $('#errorBlock p').text('请求失败！请检查网络连接～');
        }
    });
}

// 重设获取的校验码
function setMacId(userId, reprintId, code){
	var num = parseInt(userId) * parseInt(reprintId) + '';
	var numArr = num.split('');
	for(var i=0; i<4; i++) if(!numArr[i]) numArr[i] = 0;
	var reg = new RegExp(/\w{8,8}/g);
	var codeArr = code.match(reg);
	var result = []
	for(var i=0; i<4; i++) {
		result.push(codeArr[i]);
		result.push(numArr[i]);
	}
	return result.join('').split('').reverse().join('');
}


// 获取参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

// 判断是否安卓、ios且在app内部
function isAndroid () {
    var u = window.navigator.userAgent;
    return (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && u.indexOf('SmartCity') > -1;
}
function isIOS () {
    var u = window.navigator.userAgent;
    return !!u.match(/\(i[^;]+;( u;)? CPU.+Mac OS X/) && u.indexOf('SmartCity') > -1;
}
// 提示语句
function toast(msg){
    return layer.open({type: 0,content: msg, style:"color:#fff;background-color:rgba(0,0,0,0.7);font-size:14px;letter-spacing: 1px;", shade:"background-color:rgba(0,0,0,0.1)"})
}
// 加载状态
function loading(){
    return layer.open({type: 2})
}

// 分享页面
function share(title, introduce, imgUrl){
    $('#meta_title').attr('content', title);
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