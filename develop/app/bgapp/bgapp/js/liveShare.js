$(function(){
	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
	var shopId = getUrlParams("shopId")||"";
	var url= getUrlParams("url")||"";
	var params={shopId:shopId};
	
	//获取店铺信息
	reqAjaxAsync('shop/getShopInfo',JSON.stringify(params)).done(function(res){
		if(res.code==1){
			$('.headPic img').attr('src',res.data.logoUrl);
			$('.shopInfo .shopName').text(res.data.shopName);
			$('.shopInfo .shopDesc').text(res.data.shopDesc);
		}
	})
	
	//获取店铺直播状态
	reqAjaxAsync('shopLive/checkLiveStatus',JSON.stringify(params)).done(function(res){
		if(res.code==1){
			if(res.data.isOnLive==0){
				$('.videoContainer').html("<span class='tip'>直播已结束</span>");
			}else if(res.data.isOnLive==1){
				livePlay();
			}else{
				console.log(res.msg);
			}
		}
	})

	//网易云信直播
	var options={
		"controls": true,
    	"autoplay": true,
    	"techOrder": ["flash", "html5"],
	}
	function livePlay(){
		$('.videoContainer').html("<video id='liveVideo' class='video-js vjs-big-play-centered vjs-fluid'></video>");
		neplayer('liveVideo',options,function(){
			myPlayer=neplayer('liveVideo');
			myPlayer.setDataSource({
			  type: "application/x-mpegURL",
			  src: url
			})
			myPlayer.onPlayState(1,function(){
			    console.log('play');
			});
			myPlayer.onPlayState(2,function(){
			    console.log('pause');
			});
			myPlayer.onPlayState(3,function(){
			    console.log('ended');
			});
			myPlayer.onError(function(err){
			    console.log(err.errCode);
			    console.log(err.errMsg);
			});
		})
	}
	
	weixin('智大师:让天下没有难做的经营、让人人成为经营大师',"http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/member/servicePackage/be9b8523c8504211ad7cc05ce6a89990.png",'直播分享',apikey,version);
})
