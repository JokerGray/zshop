$(function(){
    var longitude=getQueryString('longitude'),
        latitude=getQueryString('latitude'),
        shopName=getQueryString('shopName'),
        shopId=getQueryString('shopId'),
        address=getQueryString('address'),
        bgImg=getQueryString('bgImg'),
        scale=window.screen.width/375,
        url="https://wxapp.izxcs.com/qrcode/shop/index.html?apptype=cityshop&subtype=shophome&fromscan=yes&visitFrom=1&cloud_store&sn=17&yw=shop&cp=1&shopId="+shopId;
    $('#shopName').text(getQueryString('shopName'));
    $('#address').append(getQueryString('address'));
    $('#logo').attr('src',getQueryString('logo'));
    $('#share').css('background-image',"url('"+bgImg+"')");
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 155*scale,
        height : 155*scale
    });
    qrcode.makeCode(url);
    $('#location').click(function(){
        window.location.href='http://share.izxcs.com/map/nav.html?longitude='+longitude+'&latitude='+latitude+'&name='+shopName+'&address='+address;
    })

    // function location(){
    //     $.ajax({
    //         type: "POST",
    //         url: "/zxcity_restful/ws/rest",
    //         dateType: "json",
    //         data: {
    //           "cmd": 'game/getSign',
    //           "data":'{}',
    //           "version": version
    //         },
    //         beforeSend: function (request) {
    //           request.setRequestHeader("apikey", apikey);
    //         },
    //         success: function (res) {
    //           console.log(res)
    //           wx.config({
    //             debug: false,
    //             appId: 'wxe50dd59beab1e644',
    //             timestamp: res.data.timestamp,
    //             nonceStr: res.data.nonceStr,
    //             signature: res.data.signature,
    //             jsApiList: ['openLocation', 'getLocation']
    //           });
    //         },
    //         error: function (res) {
    //           console.log(res);
    //         }
    //       });
    // }
    // location();

    // $('#location').click(function(){
    //     wx.openLocation({
    //         latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
    //         longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
    //         name: shopName, // 位置名
    //         address: address, // 地址详情说明
    //         scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为最大
    //     });
    // })

})