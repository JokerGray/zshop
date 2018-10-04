!function viewport(){
	var w = window.screen.width;
	var tagetW = 750;
	var scale = w/tagetW;
	var meta = document.createElement("meta");
	meta.name = "viewport",
	meta.content = "initial-scale="+scale+",minimum-scale="+scale+",maximum-scale="+scale+",user-scalable=no";
	meta.setAttribute("id","viewport");
	document.head.appendChild(meta);
}()	

window.addEventListener("resize",function(){
	var w = window.screen.width;
	var tagetW = 750;
	var scale = w/tagetW;
	document.getElementById('viewport').setAttribute("content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no");
},false)

