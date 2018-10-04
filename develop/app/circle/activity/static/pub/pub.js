//分享礼包跳转APP
//跳转app商品详情页地址
var jumpParams = getUrlParams("jumpParams") || "";
var sn = getUrlParams("sn") || "";
console.log(jumpParams);
var $ios_app = "smartcity://iOS/gateway?jumpParams=" + jumpParams;
var $android_app = "smartcity://android/gateway?jumpParams=" + jumpParams;

var $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782";
var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
var $gotoCirlcle_url = "/circle/detail/index.html?detailId=";
function gotoCircle(argument){
    window.location.href= $gotoCirlcle_url+argument+'&sn='+sn+'&yw=circle&cp=1'+"&jumpParams="+jumpParams;
}
// var getPackLink = "";
//页面跳转app or商店
$(".btn").on('click', function() {
    //判断为android
    
    if (navigator.userAgent.match(/android/i)) {
        //android非微信
        if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {
            var last = Date.now();
            var doc = window.document;
            var ifr = doc.createElement('iframe');
            ifr.src = $android_app;
            ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
            doc.body.appendChild(ifr);
            setTimeout(function () {
                doc.body.removeChild(ifr);
                //setTimeout回小于2000一般为唤起失败
                if (Date.now() - last < 4000) {
                    window.location.href = $android_url;
                }
            }, 3000);
        } else {
            //android微信
            $(".model_cont .text1 span").css("background-image","url(img/moreshu@2x.png)");
            $(".model").show();
            $(".model").on("click",function(){
                $(this).hide();
            });
            $(".model_cont").on("click",function(event){
                event.stopPropagation();
            });
        }
    //判断为IOS
    } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
        //微信
        if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
            $(".model").show();
            $(".model").on("click",function(){
                $(this).hide();
            });
            $(".model_cont").on("click",function(event){
                event.stopPropagation();
            }); 
        //QQ内置浏览器
        } else if (navigator.userAgent.indexOf(' QQ') > -1) {
            $(".model").show();
            $(".model").on("click",function(){
                $(this).hide();
            });
            $(".model_cont").on("click",function(event){
                event.stopPropagation();
            });
        } else {
            window.location.href = $ios_app;
            setTimeout(function () {
                window.location.href = $ios_url;
            }, 250);
            // setTimeout(function () {
            //     window.location.reload();
            // }, 1000);
        }
    } else {
        //判断为pc
        window.location.href = $android_url;
    }
});

// 获取url地址
function getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
    }
    return "";
}