
//配置默认参数
export default function YiHzoCanvas(){
	this.settings = {
		//定义画布宽高
		canvasW:"100%",
		canvasH:"478"
	}
}

//初始化
YiHzoCanvas.prototype.init = function(opt){
	//实参替换默认
	extend( this.settings, opt );
	var container = document.getElementById(opt.id) || document.querySelector(opt.id);
	//生成canvas节点
	var CrCanvas = document.createElement('canvas');
	container.appendChild(CrCanvas);
	//设置宽高
	var myCanvas = container.querySelector("canvas");
	setAttr({
		id:myCanvas,
		attr:{
			width:container.offsetWidth,
			height:opt.canvasH
		}
	})
	//绘制画布
	this.draw({
		id:myCanvas,//canvas元素
		height:opt.canvasH,
		type:7,//绘制类型
		data: data,
	});
}

var data = {

	//变量
	/*
	 * canvas边距,
	 * height,
	 * text:颜色，大小边距
	 * 原点颜色，边距
	 * 文字部分与图各自高度
	 */
	title:{
		text:'分享"小程序今夜凌晨降临"',
		tpi:'点击单价'
	},
	canvas:{
		width:695,
		height:250,
		marginBottom:55,
		marginTop:60,
		a:{
			color:'#ccc',
			width:3,
			nuber:0
		},
		b:{
			color:'#ccc',
			width:3,
			nuber:15
		},
		c:{
			color:'#ccc',
			width:3,
			nuber:30
		}
	},
	text:{
		width:678,
		height:113,
		colol:"#ccc",
		fontSize:"35px",
	},
	data:{
		click:1256,
		clickText:"总点击数",
		clickColor:"#07B6FE",
		inconeText:"总收入",
		incone:"￥56.26",
		inconeColor:"#FF7525",
		num:[
			{
				x:81,
				y:740
			},
			{
				x:130,
				y:7340
			},
			{
				x:340,
				y:546
			},
			{
				x:450,
				y:785
			},
			{
				x:957,
				y:4570
			},
			{
				x:1547,
				y:740
			},
			{
				x:235,
				y:567
			}
		]
	}
}

YiHzoCanvas.prototype.draw = function(drawData){
	var ctx = drawData.id.getContext("2d");
	var y = drawData.height - 55;
	ctx.beginPath();
	//底部线条a
	ctx.moveTo(62,y);
	ctx.lineTo(902,y);
	ctx.strokeStyle = drawData.data.canvas.a.color;
	ctx.lineWidth = drawData.data.canvas.a.width;
	ctx.font = "40px Arial";
	ctx.fillStyle = drawData.data.text.colol;
	ctx.fillText(drawData.data.canvas.a.nuber,27,y,35);
	ctx.fillText(drawData.data.canvas.a.nuber,920,y,35);
	ctx.stroke();
	ctx.closePath();
	//中间线条b
	ctx.beginPath();
	for(var i=0;i<42;i++){
		var x = 62+i*20;
		var bY = x + 10;
		ctx.moveTo(x,y-125);
		ctx.lineTo(bY,y-125);
	}
	ctx.font = "40px Arial";
	ctx.fillStyle = drawData.data.text.colol;
	ctx.fillText(drawData.data.canvas.b.nuber,15,y-115,35);
	ctx.fillText(drawData.data.canvas.b.nuber,910,y-115,35);
	ctx.stroke();
	ctx.closePath();
	//上面线条c
	ctx.beginPath();
	for(var i=0;i<42;i++){
		var x = 62+i*20;
		var cY = x + 10;
		ctx.moveTo(x,y-250);
		ctx.lineTo(cY,y-250);
	}
	ctx.font = "40px Arial";
	ctx.fillStyle = drawData.data.text.colol;
	ctx.fillText(drawData.data.canvas.c.nuber,15,y-240,35);
	ctx.fillText(drawData.data.canvas.c.nuber,910,y-240,35);
	ctx.stroke();
	ctx.closePath();
	//绘制折线
	var lineX = drawData.data.data.num;
	function getLineX(obj,axis){
		var number = 0;
		for(var key in obj){
			if(axis=="x"){
				number += obj[key].x;
			}else{
				number += obj[key].y;
			}
		}
		return number;
	}
	var totalY = getLineX(lineX,y);


	var width = drawData.id.offsetWidth

	ctx.beginPath();
	//初始坐标
	var initialX = width/drawData.type;
	var initialY = y - 50;
	ctx.moveTo(62 ,initialY);

	ctx.lineTo(initialX ,initialY);
	for(var i=1;i<lineX.length;i++){
		//结束坐标
		var xz = initialX*i;
		var yz = y - lineX[i].y/totalY*y;
		ctx.lineTo(xz,yz);
	}
	ctx.strokeStyle = drawData.data.data.clickColor;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineTo(width-65,yz);
	ctx.fillStyle = "aqua";
	ctx.stroke()
	ctx.closePath();

	//填充连接园
	for(var i=1;i<lineX.length;i++){
		//结束坐标
		var xz = initialX*i;
		var yz = y - lineX[i].y/totalY*y;
		ctx.beginPath()
		ctx.arc(xz,yz,8,0,360);
		ctx.strokeStyle = drawData.data.data.clickColor;
		ctx.fillStyle = "#fff"
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}

}


function extend(obj1,obj2){
	for(var attr in obj2){
		obj1[attr] = obj2[attr];
	}
}

function setCSS(obj){
	var elements = document.getElementById(obj.id) || document.querySelector(obj.id);
	for(var i in obj.attr){
		elements.style[i] = obj.attr[i];
	}
}

function setAttr(obj){
	for(var i in obj.attr){
		obj.id.setAttribute(i,obj.attr[i]);
	}
}
