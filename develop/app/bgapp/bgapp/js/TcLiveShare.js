$(function(){
	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
	var userId = getUrlParams("userId")||"";
	var shopId = getUrlParams("shopId")||"";
	var url= getUrlParams("url")||"";
//	var rtmpUrl= getUrlParams("rtmpUrl")||"";
//	var flvUrl= getUrlParams("flvUrl")||"";
//	var mp4= getUrlParams("mp4")||"";
	var params1={shopId:shopId};
	var params2={userId:userId};
	var ossUrl="http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/member/servicePackage/be9b8523c8504211ad7cc05ce6a89990.png";
	//获取店铺信息
	reqAjaxAsync('shop/getShopInfo',JSON.stringify(params1)).done(function(res){
		if(res.code==1){
			$('.headPic img').attr('src',res.data.logoUrl);
			$('.shopInfo .shopName').text(res.data.shopName);
			$('.shopInfo .shopDesc').text(res.data.shopDesc);
		}
	})
	
	//获取直播状态
	reqAjaxAsync('shopLive/canLiveUser',JSON.stringify(params2)).done(function(res){
		if(res.code==1){
			if(res.data.status==1){
    			livePlay();
    		}else{
    			$('.videoContainer').html("<span class='tip'>直播已结束</span>");
    		}
		}
	})
	
	//腾讯云直播
	function livePlay(){
		var player = new TcPlayer('liveVideo', {
//			"rtmp": rtmpUrl,
//			"flv": flvUrl,
		 	"m3u8": url, //请替换成实际可用的播放地址
//		 	"mp4":  mp4,
			"autoplay" : true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
		//	"coverpic" : "",
			"width" :  '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
			"height" : '100%',//视频的显示高度，请尽量使用视频分辨率高度
			"wording": {
			    1: "网络错误，请检查网络配置或者播放链接是否正确",
			    2: "网络错误，请检查网络配置或者播放链接是否正确",
			    3: "视频解码错误",
			    4: "当前系统环境不支持播放该视频格式",
			    1001: "网络错误，请检查网络配置或者播放链接是否正确",
			    1002: "获取视频失败，请检查播放链接是否有效",
			    2032: "请求视频失败，请检查网络",
		    	2048: "请求失败，可能是网络错误或者跨域问题"
			}
		});
	
	}
	weixin('智大师:让天下没有难做的经营、让人人成为经营大师',ossUrl,'直播分享',apikey,version);
})
