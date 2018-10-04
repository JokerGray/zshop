var geninfo=function(){
	//夺宝点击
	$(".indiana").click(function(){
		$(this).css({"background":"url(img/wjzq_yiyuan_liang.png) no-repeat","backgroundSize":"100% 100%"});
		$(".game").css({"background":"url(img/wjzq_youxi_a.png) no-repeat","backgroundSize":"100% 100%"});
	});
	
	//游戏点击
	$(".game").click(function(){
		$(this).css({"background":"url(img/wjzq_youxi_l.png) no-repeat","backgroundSize":"100% 100%"});
		$(".indiana").css({"background":"url(img/wjzq_yiyuan_an.png)","backgroundSize":"100% 100%"});
	});
	
	//灯旋转 300ms旋转7度
	var deg =0;
	setInterval(function(){
		deg++;
		if(7*deg>360){
			deg=0;
		}
		$(".light").css("transform","rotate("+(7*deg)+"deg)")
	},300);
	
	var browers= function () {
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			isSmartCity = u.indexOf('SmartCity') > -1; //是否在APP内部
			if (isAndroid)
				return "android" + (isSmartCity ? ".sc" : "");
			if (isiOS)
				return "ios" + (isSmartCity ? ".sc" : "");
				
			return "else";
		}
	
	//数据加载函数
	var getAjax = function(url,datas,callback){
			$.ajax({
			type: 'get',
			url: url,
			dataType: 'json',
			data: datas,
			dataType:"json",
			success: function(res) {
				callback(res);
			},
			error: function (xhr, type) {
					if (browers == "android.sc") {
						window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
					} else if (browers == "ios.sc") {
						htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
					}
					console.log('请求失败！请检查网络连接');
				}
		});
	}
	
	var datalenght,infolength;
	getAjax("json/turntable.json","",function(res){
		if(res.code == 1){
			var oli,oli1;
				infolength=res.info.length;
				datalenght=res.data.length
			for(var i=0;i<datalenght;i++){
				if(res.data[i].type == 1){
					oli = '<li class="type1"><p class="words">'+res.data[i].word+'</p></li>';
				}
				if(res.data[i].type == 2){
					oli = '<li class="type2"><img src="'+res.data[i].img+'"/><p class="words">'+res.data[i].word+'</p></li>';
				}
				if(res.data[i].type == 3){
					oli = '<li class="type3"><img src="'+res.data[i].img+'"/><p class="words">'+res.data[i].word+'</p></li>';
				}
				if(res.data[i].type == 4){
					oli = '<li class="type4"><img src="'+res.data[i].img+'"/><p class="words">'+res.data[i].word+'</p></li>';
				}
				$(".turntable_info").append(oli);
			}
			if(infolength>5){
				for(var i=infolength-1;i>infolength-6;i--){
					if(res.info[i].type==1){
						oli1='<li class="iphone">恭喜<span>'+res.info[i].people+'</span>获得<span>'+res.info[i].gift+'</span></li>'
					}
					if(res.info[i].type==2){
						oli1='<li>恭喜<span>'+res.info[i].people+'</span>获得<span>'+res.info[i].gift+'</span></li>'
					}
					$(".dataList").append(oli1);
				}
			}else{
				for(var i=infolength-1;i>-1;i--){
					if(res.info[i].type==1){
						oli1='<li class="iphone">恭喜<span>'+res.info[i].people+'</span>获得<span>'+res.info[i].gift+'</span></li>';
					}
					if(res.info[i].type==2){
						oli1='<li>恭喜<span>'+res.info[i].people+'</span>获得<span>'+res.info[i].gift+'</span></li>';
					}
					$(".dataList").append(oli1);
				}
			}
			interval();
		}
	})
	
	//进入页面加载5条数据
	var timer,
	  index=0;
     function interval(){
     	timer=setInterval(function(){
			if(index>infolength){
				clearInterval(timer);
			}else{
				$(".dataList li").eq(index).css({"transform":"translate(0)","transition":"1s"});
				index++;
			}
		},500)
     };
     
     //1s之后刷新数据,加载最新的一条数据
     setInterval(function(){
     	var oli2;
     	getAjax("json/turntable.json","",function(res){
     		if(infolength<res.info.length){
     			infolength=res.info.length;
     			if((res.info[infolength]-1) == 1){
     				oli2='<li class="iphone">恭喜<span>'+res.info[i].people+'</span>获得<span>'+res.info[i].gift+'</span></li>';
     			}
     			if((res.info[infolength]-1) == 2){
     				oli2='<li>恭喜<span>'+res.info[i].people+'</span>获得<span>'+res.info[i].gift+'</span></li>';
     			}
     			$(".dataList li").eq(4).remove();
     			$(".dataList").prepend(oli1);
     			$(".dataList li").eq(0).css({"transform":"translate(0)","transition":"1s"});
     		}
     	})
     },1000)

	//游戏开始点击
	var isrotate = false;
	var _btn = $(".go");
	$(".go").click(function(){
		if(isrotate) return;
		isrotate = true;
		clickfunc();
	});
	
	//每一块区域对应的奖项
	var clickfunc = function(){
		var data = [1,2,3,4,5,6,7,8,9,10];
	    data = data[Math.floor(Math.random()*data.length)];
	    switch(data){
	    	case 1:
	    	rotateFunc(data, 0, data);
	    	break;
	    	case 2:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 3:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 4:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 5:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 6:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 7:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 8:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 9:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    	case 10:
	    	rotateFunc(data, 36*data, data);
	    	break;
	    }
	    	
	}
	
	//开始旋转
	var rotateFunc=function(awards, angle, text){
		isrotate = true;
		_btn.stopRotate();
		_btn.rotate({
			angle: 0,
			duration:4000, //旋转时间
			animateTo: angle+720, //让它根据得出来的结果加上720度旋转
			callback: function() {
				isrotate = false; // 执行完毕
				alert(text);
			}
		});
	};
	
}
geninfo();

