window.onload = function(){
		document.getElementById("qbz").style.height = screen.height - 80 + 'px';
		//滑动参数
		var point = {
			staX:0,
			staY:0,
			moveX:0,
			moveY:0,
			endX:0,
			endY:0,
			type:0//滑动类型:0,无滑动，1234上下左右
		}

		//上下滑动
		document.addEventListener('touchstart',start);
		document.addEventListener('touchmove',move);
		document.addEventListener('touchend',end);
		
		function start(ev){
			var e = ev.changedTouches[0];
			point.staY = e.pageY;
			
		}
		
		function move(ev){
			var e = ev.changedTouches[0];
			point.moveY = e.pageY;
			
			if(Math.abs(point.moveY - point.staY) >= 10){
				if(point.moveY - point.staY > 0){
					point.type = 2
				}else{
					point.type = 1
				}	
			}
			
		}
		
		function end(ev){
			var e = ev.changedTouches[0];
			point.endY = e.pageY;
			
			if(point.type == 1){
				var height = document.documentElement.scrollHeight || document.body.scrollHeight
				var scrollHeigth = document.body.scrollTop || document.documentElement.scrollTop;
				var clientHeigth = document.documentElement.clientHeight || document.body.clientHeight;
				if(height - scrollHeigth - clientHeigth > 0){
					//alert("不加载只滚动")
				}else{
					ajax({
						method:'get',
						url:'new_file.json',
						success:function(data){
							var data = JSON.parse(data).data;
							var warp = document.getElementById("qbz");
							for(var i = 0;i<data.length;i++){
								var div = document.createElement("div");
								var content = document.querySelectorAll(".content")[0];
								div.setAttribute('class','content');
								div.innerHTML = '<p class="title">'+data[i].title+'</p><div class="c_warp">'+
										'<div class="c_left">'+
											'<span>'+data[i].moth[0].time+'</span>'+
											'<span>14:30</span></div>'+
										'<div class="c_right">'+
										'<span><i class="iconfont icon-jia"></i>150.00</span>'+
										'<span><i class="iconfont icon-yuandian"></i>'+data[i].moth[0].text+'</span></div></div>';
								warp.insertBefore(div,content);							
							}
						}
					})					
				}

			}
		}
}
