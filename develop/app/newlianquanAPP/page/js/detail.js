$(function(){
    let USERID=getParams('userId');
    function getShopList(params){
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            data: {
                "cmd":'shop/getMercartIdShopList',
                "data": JSON.stringify(params),
                "version": version
            },
            beforeSend: function (request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function (res) {
                if(res.code==1){
                    let html=$('#shopList').html(),
                        data=res.data;
                    if(data.length < 1){
                    	// $("#showShop").hide()
                    }else{
                    	// $("#showShop").show()
                    	sessionStorage.setItem('total',res.data.total);
	                    for(let i=0;i<data.length;i++){
	                        html+="<a class='slide' href='http://share.zxtest.izxcs.com/shopShare/shopShare.html?shopName="+data[i].shopName
	                            +"&address="+data[i].address+"&bgImg="+res.data[i].bgImage+"&longitude="+res.data[i].longitude
	                            +"&latitude="+res.data[i].latitude+"&logo="+res.data[i].logoUrl+"&shopId="+res.data[i].id+"'><div class='info'><img src='"+data[i].logoUrl+"' class='logo'>"
	                            +"<div class='infoBox'><div class='shopName'>"+data[i].shopName+"</div>"
	                            +"<div class='address'><img class='addressIcon' src='img/detail/lq_dongtai_location.png'>"+(data[i].address || '-')+"</div></div></div>"
	                            +"<div class='enterShop'>进店</div></a>"
	                    }
	                    $('#shopList').html(html);
                    }
                    
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }

    var count=0;
    shopParams={
        page: count,
        userId: USERID,
        rows: 10
    }
    getShopList(shopParams);

    $('#shopListBox').scroll(function(){
        let left=$(this).scrollLeft(),
            w=$(this).find('.slide').width(),
            size=$(this).find('.slide').size();
        if(left>=(w*size-$(this).width())){
            count+=1;
            if(count> Math.ceil(sessionStorage.getItem('total') / 10-1)){
                let params={
                    page: count,
                    userId: USERID,
                    rows: 10
                }
                getShopList(params);
            }else{
                layer.msg('已经到底了');
                return
            }
        }
    })
})