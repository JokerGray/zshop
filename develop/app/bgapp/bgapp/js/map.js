$(function(){
	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	var longitude = theRequest['longitude']==undefined?null:theRequest['longitude'];
	var latitude = theRequest['latitude']==undefined?null:theRequest['latitude'];
	var shopName= theRequest['shopName']==undefined?null:theRequest['shopName'];
	
	 $.ajax({
    	type:"POST",
    	url:"http://restapi.amap.com/v3/geocode/regeo?parameters",
    	async:false,
    	dataType:'json',
    	data :
    		{
    		 "key":"2740c2365c491befc4534a5c04cff982",
    		 "location":longitude+","+latitude,
    		},
		success:function(res){
			if(res.status==1){
				console.log(res.regeocode.formatted_address);
				
				//绘制地图，以及分享店铺的位置
				var map = new AMap.Map('container',{
		        resizeEnable: true,
//		        zoom: 13,
		        center: [longitude,latitude]
	    	});
		    var marker = new AMap.Marker({
		        position: map.getCenter(),
		        icon: new AMap.Icon({            
		            size: new AMap.Size(68, 68),  //图标大小
		            image: "images/shopLocalShare_dianpuweizhi@2x.png",
		            imageOffset: new AMap.Pixel(0,0)
		        })  
		    });
		    marker.setMap(map);
		    // 设置鼠标划过点标记显示的文字提示
		    marker.setTitle(res.regeocode.formatted_address);
		    // 设置label标签
		    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
		        offset: new AMap.Pixel(50, 40),//修改label相对于maker的位置
		        content: "<div><h3>"+shopName+"</h3><p>"+res.regeocode.formatted_address+"</p></div>"
		    });
		    
		    map.plugin(["AMap.ToolBar"], function() {
				map.addControl(new AMap.ToolBar());
			});
			if(location.href.indexOf('&guide=1')!==-1){
				map.setStatus({scrollWheel:false})
			}
				
			//我的定位
			var geolocation;	
			map.plugin('AMap.Geolocation', function() {
		        geolocation = new AMap.Geolocation({
		            enableHighAccuracy: true,//是否使用高精度定位，默认:true
		            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
		            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//		            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		            buttonPosition:'RB',
		        });
		        map.addControl(geolocation);
		        geolocation.getCurrentPosition();
		        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
		        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
		    });
		    //解析定位结果
		    function onComplete(data) {
		        var str=['定位成功'];
		        str.push('经度：' + data.position.getLng());
		        str.push('纬度：' + data.position.getLat());
		        if(data.accuracy){
		             str.push('精度：' + data.accuracy + ' 米');
		        }//如为IP精确定位结果则没有精度信息
		        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
	//	        document.getElementById('tip').innerHTML = str.join('<br>');
				//构造路线导航类
			    var driving = new AMap.Driving({
			        map: map,
			        panel: "panel"
			    }); 
			    // 根据起终点经纬度规划驾车导航路线
			    driving.search(new AMap.LngLat(data.position.lng,data.position.lat), new AMap.LngLat(longitude,latitude));
			    console.log(data.position.lng);
			    console.log(data.position.lat);
		    }
		    //解析定位错误信息
		    function onError(data) {
		        document.getElementById('tip').innerHTML = '定位失败';
		    	}
			
			}else{
					console.log('未获取位置信息');
				}
		},
		err:function(){
			console.log('获取位置信息失败');
		}
   });
   weixin("店铺位置分享","http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/member/servicePackage/be9b8523c8504211ad7cc05ce6a89990.png",shopName,apikey,version);
})
