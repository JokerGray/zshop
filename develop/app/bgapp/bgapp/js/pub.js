//跳转app商品详情页地址
var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
var jumpParams = getUrlParams("jumpParams") || "";
var $ios_app = "zds://lookShopLive?jumpParams=" + jumpParams;
var $android_app = "smartmaster://smart/path?jumpParams=" + jumpParams;

var $ios_url = "https://itunes.apple.com/cn/app/id1239289004";
var $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity.smartmaster";

//页面跳转app or商店
$('.model_cont').click(function(){
	$('.model').hide();
})

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
            console.log("安卓非微信");
        } else {
            //android微信
            $(".model").show();
            $(".model_cont").on("click",function(event){
                event.stopPropagation();
            });
            console.log("安卓微信");
        }
    //判断为IOS
    } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
        //微信
        if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
            $(".model").show();
            $(".model_cont").on("click",function(event){
                event.stopPropagation();
            });	
        //QQ内置浏览器
        } else if (navigator.userAgent.indexOf(' QQ') > -1) {
            $(".model").show();
            $(".model_cont").on("click",function(event){
                event.stopPropagation();
            });
            console.log("qq浏览器");
        } else {
            window.location.href = $ios_app;
            setTimeout(function () {
                window.location.href = $ios_url;
            }, 250);
//          setTimeout(function () {
//              window.location.reload();
//          }, 1000);
        }
    } else {
        //判断为pc
        window.location.href = $android_url;
        console.log("pc")
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