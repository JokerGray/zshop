window.onload = function(){
	
	var h1 = document.querySelector(".hd .h1");
	var h2 = document.querySelector(".hd .h2");
	var conent = document.querySelector(".conent");		
	var lamp = document.querySelector(".conent .c_lamp");
	var grid = document.querySelector(".conent .c_grid");
	var pointer = document.querySelector(".conent .c_pointer");
	var floor = document.querySelector(".floor")
	var info = document.querySelector(".floor .f_info");
	var isToun = true;//灯笼开关
	var isGrid = false;//转盘开关
	var current = 0;  //转盘角度	
	var lampDeg = 0;  //灯光角度
	//相关参数
	var data = [
		{
			img:'image/wjzq_z_yangshi5.png',
			text:'iphone 7plus'
		},
		{
			img:'null',
			text:'谢谢参与'
		},
		{
			img:'image/wjzq_z_yangshi2.png',
			text:'试吃劵'
		},
		{
			img:'image/wjzq_z_yangshi1.png',
			text:'100'
		},
		{
			img:'image/wjzq_z_yangshi4.png',
			text:'50'
		},
		{
			img:'image/wjzq_z_yangshi6.png',
			text:'ipad pro'
		},
		{
			img:'null',
			text:'谢谢参与'
		},
		{
			img:'image/wjzq_z_yangshi2.png',
			text:'试吃劵'
		},
		{
			img:'image/wjzq_z_yangshi3.png',
			text:'50'
		},
		{
			img:'image/wjzq_z_yangshi4.png',
			text:'50'
		},			
	]
	var turnplate={
			org:{
				x:300,
				y:300,
			},
			restaraunts:data,			//大转盘奖品名称
			outsideRadius:300,			//大转盘外圆的半径
			textRadius:155,				//大转盘奖品位置距离圆心的距离
			insideRadius:91.5,			//大转盘内圆的半径
			startAngle:0,				//开始角度
	};
	
	document.addEventListener('touchstart',function(e){
		//e.preventDefault();
	})
	
	//灯笼
	h1.addEventListener('touchstart',function(e){
		if(isToun){
			h1.style.background = "url(image/wjzq_yiyuan_an.png) no-repeat";
			h2.style.background = "url(image/wjzq_youxi_l.png) no-repeat";
			h1.style.backgroundSize = 'cover';
			h2.style.backgroundSize = 'cover';
			isToun = false;
		}else{
			h1.style.background = "url(image/wjzq_yiyuan_liang.png) no-repeat";
			h2.style.background = "url(image/wjzq_youxi_a.png) no-repeat";
			h1.style.backgroundSize = 'cover';
			h2.style.backgroundSize = 'cover';
			isToun = true;				
		}

	})
	h2.addEventListener('touchstart',function(e){
		if(isToun){
			h1.style.background = "url(image/wjzq_yiyuan_an.png) no-repeat";
			h2.style.background = "url(image/wjzq_youxi_l.png) no-repeat";
			h1.style.backgroundSize = 'cover';
			h2.style.backgroundSize = 'cover';
			isToun = false;
		}else{
			h1.style.background = "url(image/wjzq_yiyuan_liang.png) no-repeat";
			h2.style.background = "url(image/wjzq_youxi_a.png) no-repeat";
			h1.style.backgroundSize = 'cover';
			h2.style.backgroundSize = 'cover';
			isToun = true;				
		}

	})		
	
	
	
	pointer.addEventListener('touchstart',function(){
		if(!isGrid){
			isGrid = true;	
			lampDeg += 1*360;
			lamp.style.transform = 'rotate('+lampDeg+'deg)';			
			rate()			
		}
	})
	
	//旋转
	function rate(){
		//随机圈数
		var i = Math.ceil(20+Math.random()*20);
		//目标角度
		var iCurrent = i*36;
		startMove(grid,iCurrent);
		isGrid = false
	}
	
/*运动*/
		function getStyle(obj,attr){
			if(obj.currentStyle){
				return obj.currentStyle[attr];
			}else{
				return getComputedStyle(obj,false)[attr];
			}
		};		
		//运动方法
		function startMove(obj,iTarget){
			//初始化角度
			current = 0;
			if(obj.style.transform){
				var rotate = parseInt(obj.style.transform.split('(')[1].split('deg')[0]);
				current += rotate
				iTarget += rotate
			}			
			//清楚定时器	
			clearInterval(obj.timer);
			//开启定时器
			obj.timer = setInterval(zhixin,50);	
			
			function zhixin(){					
				if(current == iTarget){
					clearInterval(obj.timer);
				}else{					
					obj.style.transform = "rotate("+current+"deg)"							
				}	
				current += 36;
			};
			
		};
/*运动*/

	grid.addEventListener("webkitTransitionEnd", huidiao);
	grid.addEventListener("transitionend", huidiao);
	
	function huidiao(){
		isGrid = false;		
	}


	function setCSS(obj){
		var el = obj.el || document.querySelector(obj.el);
		for(var i = 0;i<el.length;i++){
			for(var j in obj.attr){
				el[i].style[j] = obj.attr[j];
			}
		}
	}
	
	 //画饼图
	 function drawChart(){	
		var yuan = document.getElementById("yuan");
		yuan.width = grid.getBoundingClientRect().width;
		yuan.height = grid.getBoundingClientRect().height;	 
	 	ctx = yuan.getContext("2d");
		turnplate.outsideRadius = grid.getBoundingClientRect().width/2;
		turnplate.insideRadius = pointer.getBoundingClientRect().width/2;
		turnplate.org.x = yuan.getBoundingClientRect().width/2;
		turnplate.org.y = yuan.getBoundingClientRect().width/2;
		turnplate.restaraunts = data;
		
	   //平均弧度	
	   var img = document.querySelectorAll("#warp img");
	   var arc = Math.PI / (10/2);			 	
	   for(var i = 0; i<10; i++){
	   		//每个的弧度
	   		var angle = turnplate.startAngle + i * arc;
		   ctx.beginPath();
		   
		   ctx.strokeStyle = 'transparent';
		   ctx.moveTo(turnplate.org.x,turnplate.org.y);
		   ctx.arc(turnplate.org.x,turnplate.org.y,turnplate.outsideRadius,angle,angle+arc,false);
		   ctx.arc(turnplate.org.x,turnplate.org.y,turnplate.outsideRadius,angle+arc,angle,true);
			
		   	y = turnplate.org.y + Math.sin(angle + arc / 2) * (turnplate.outsideRadius - 30);
	 		x = turnplate.org.x + Math.cos(angle + arc / 2) * (turnplate.outsideRadius - 30);
	 		y2 = turnplate.org.y + Math.sin(angle + arc / 2) * (turnplate.outsideRadius - 60);
	 		x2 = turnplate.org.x + Math.cos(angle + arc / 2) * (turnplate.outsideRadius - 60); 		
			ctx.stroke();  
		  //锁画布(为了保存之前的画布状态)
		  	ctx.save();
			ctx.translate(x,y);
	 		ctx.rotate(angle + arc*2 + Math.PI / 2);
	 		ctx.fillStyle = '#fff';
	 		if(turnplate.restaraunts[i].img == 'null'){
 				ctx.rotate(40*Math.PI/180);
 				ctx.fillText(turnplate.restaraunts[i].text,-20,4);
	 		}else{
		 		if(i==0){
		 			var z = turnplate.restaraunts[i].text;
		 			var z1 = z.substring(0,z.indexOf('7')+1);
		 			var z2 = z.substring(z.indexOf('7')+1,z.length);
		 			ctx.rotate(-50*Math.PI/180);
		 			ctx.drawImage(img[0],-20,-25,31,40);
		 			ctx.font = "5px Arial"		 			
		 			ctx.fillText(z1,-28,20);
		 			ctx.font = "2px Arial"		 			
		 			ctx.fillText(z2,-15,30);		 			
		 		}else if(i==1){
		 			ctx.rotate(-60*Math.PI/180);
		 		}else if(i==2){
		 			ctx.rotate(130*Math.PI/180);
		 			ctx.drawImage(img[2],-25,-5,44,26);
		 			ctx.rotate(180*Math.PI/180);
		 			ctx.fillText(turnplate.restaraunts[i].text,-15,20);		 			
		 		}else if(i==3){
		 			ctx.rotate(-60*Math.PI/180);
		 			ctx.drawImage(img[3],-20,-20,44,26);
		 			ctx.fillText(turnplate.restaraunts[i].text,-10,20);		 			
		 		}else if(i==4){
		 			ctx.rotate(-30*Math.PI/180);
		 			ctx.drawImage(img[4],-20,-28,44,26);
		 			ctx.rotate(-30*Math.PI/180);
		 			ctx.fillText(turnplate.restaraunts[i].text,-5,20);		 			
		 		}else if(i==5){
		 			ctx.rotate(30*Math.PI/180);
		 			ctx.drawImage(img[5],-25,-20,44,26);
		 			ctx.rotate(-90*Math.PI/180);
		 			ctx.font = "5px"
		 			ctx.fillText(turnplate.restaraunts[i].text,-20,30);		 			
		 		}else if(i==6){
		 			ctx.rotate(30*Math.PI/180);
		 			ctx.drawImage(img[6],-25,-5,44,26);
		 		}else if(i==7){
		 			ctx.rotate(300*Math.PI/180);
		 			ctx.drawImage(img[7],-25,-25,44,26);
		 			ctx.fillText(turnplate.restaraunts[i].text,-20,20);		 			
		 		}else if(i==8){
		 			ctx.rotate(300*Math.PI/180);
		 			ctx.drawImage(img[8],-25,-25,44,26);
		 			ctx.fillText(turnplate.restaraunts[i].text,-15,20);		 			
		 		}else if(i==9){
		 			ctx.rotate(-30*Math.PI/180);
		 			ctx.drawImage(img[4],-30,-20,44,26);
		 			ctx.rotate(-30*Math.PI/180);
		 			ctx.fillText(turnplate.restaraunts[i].text,-15,20);			 			
		 		}
		 		
	 		}
	 		//返回保存前状态
  			 ctx.restore();
		  }
	 }
	
	//滚动消息
	var speed=30; 
	function Marquee(){ 
		if(floor.offsetHeight-info.scrollTop<=0)
			info.scrollTop-=floor.offsetHeight
		else{ 
			info.scrollTop++  
		} 
	} 
	var MyMar=setInterval(Marquee,speed);
	 	drawChart();
}	