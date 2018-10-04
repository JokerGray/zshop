$(function(){
    var longitude=getQueryString('longitude'),
        latitude=getQueryString('latitude'),
        shopName=getQueryString('shopName'),
        shopId=getQueryString('shopId'),
        address=getQueryString('address'),
        bgImg=getQueryString('bgImg');
        scale=window.screen.width/375;
    $('#shopName').text(getQueryString('shopName'));
    $('#address').text(getQueryString('address'));
    $('#logo').attr('src',getQueryString('logo'));
    $('#share').css('background-image',"url('"+bgImg+"')");
    var qrcode = new QRCode("qrcode", {//生成二维码
        text: "https://wxapp.izxcs.com/qrcode/shop/index.html?apptype=cityshop&subtype=shophome&fromscan=yes&visitFrom=1&cloud_store&sn=17&yw=shop&cp=1&shopId=" + shopId,
        width: 155*scale,
        height: 155*scale,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    //canvas转换img
    // function convertCanvasToImage(canvas) { 
	// 	//新Image对象，可以理解为DOM 
	// 	var image = new Image(); 
	// 	// canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持 
	// 	// 指定格式 PNG 
	// 	image.src = canvas.toDataURL("image/png"); 
	// 	return image; 
    // }
    
    // //获取网页中的canvas对象 
    // var img=convertCanvasToImage($('canvas')); 
    
    // $('#qrcode').append(img);
    
    $('#location').click(function(){//调起微信地图
        wx.getLocation({
			type : 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success : function(res) {
				//使用微信内置地图查看位置接口
				wx.openLocation({
					latitude : latitude, // 纬度，浮点数，范围为90 ~ -90
					longitude : longitude, // 经度，浮点数，范围为180 ~ -180。
					name : shopName, // 位置名
					address : address, // 地址详情说明
					scale : 28 // 地图缩放级别,整形值,范围从1~28。默认为最大
				});
			},
			cancel : function(res) {
				
			}
		});
    })
})