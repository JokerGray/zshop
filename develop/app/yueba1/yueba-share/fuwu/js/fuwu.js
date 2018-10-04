function reqAjax(cmd, data){
    setTimeout(function(){
    },5000);
    var deferred = $.Deferred();
    $.ajax({
        type:"post",
        dataType: 'json',
        url:"/zxcity_restful/ws/rest",
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(data),
            version: 1 
        },
        success: function(data){
            deferred.resolve(data);
        },
        error: function(){
            deferred.reject();
        }
    });
    return deferred;
    }
     
    var def = reqAjax('newservice/getSkillDetailInfoNew',
        {
            "skillUserId": 17,
            "serviceId": 662,
            "userId": 1246
        } 
    );
    def.then(function(data){
        console.log(data);
        console.log(data.data);
        setData(data.data);
    });
    // 设置数据
	function setData(data){
        var resourceList =data['resourceList'];
        if(data['resourceList'].length > 0 && data['resourceList'][0]['resourceUrl'].length> 0){
            // console.log(resourceList);
            for(var i in resourceList){
                var LBurl=resourceList[i].resourceUrl;
                // console.log(LBurl);
                // console.log(typeof(LBurl));
                // console.log(LBurl.length);
                var swiperslide =$('.swiper-wrapper').append('<div></div>').children().last().addClass('swiper-slide');
                // console.log(swiperslide);
                swiperslide.html('<img>').children().last().attr('src',LBurl);
            }
        }else{
                var swiperslide =$('.swiper-wrapper').append('<div></div>').children() 
                swiperslide.addClass('swiper-slide');
                $('.swiper-slide').html('<img>').children().attr('src','');
        }
        $('#userName').text(data['userName']);
        $('#serviceName').text(data['serviceName']);
        var serviceMode=data['serviceMode'];
        // console.log(serviceMode);
        if(serviceMode){
            $('#serviceMode').text('到店服务');
        }else{
            $('#serviceMode').text('到店服务');
        }
        $('#orderNumber').text(data['orderNumber']);
        
        $('#distance').text(data['distance']);
        $('#userPic').attr('src',data['userPic']);
        var isCertificat=data['isCertificat'];
        if(isCertificat !=0){
            $('#isCertificat').attr('src','./image/yb_zsrz.png');
        }
        var shopId=data['shopId'];
        if(shopId){
            $('#shopId').attr('src','./image/yb_dprz.png');
        }
        var realName=data['realName'];
        if(realName ===1){
            $('#realName').attr('src','./image/yb_smrz.png');
        }
        var newarr=data['serviceTime'].split(',');
        var arr=[];
        for(var i=0;i<newarr.length;i++){
            var string='周一,周二,周三,周四,周五,周六,周日';
            var array=string.split(',');
            for(var j=0;j<array.length;j++){
                if(newarr[i]-1 === j){
                    arr.push(array[j]);
                     
                }  
            }
        }
        var xx=arr.join(',');
        $('.time-D').text(arr.join(','));
        
		$('#categoryName').text(data['categoryName']);
		$('#servicePrice').text(data['servicePrice']);
		$('#serviceRangeAddress').text(data['serviceRangeAddress']);
		$('#serviceLocationAddress').text(data['serviceLocationAddress'].replace(new RegExp('\\|','g'), ' '));
        $('#serviceComment').text(data['serviceComment']);
		$('#characteristic').text(data['characteristic']);
	}