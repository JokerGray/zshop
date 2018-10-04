
(function($){
	var page = 0;
	var pages = 0;
	var row = 10;
	var rows = 10;
	var stop = true;//下拉加载标识
	var total=0;
	var userId = getQueryString("userId") || 1823;
    var communityId =getQueryString("communityId") || 39;
    var USER_URL ={
    	GETCICLE:'circle/selectScCircleCommunityById',
    	GETDEME:'circle/selectScCircleElegantDemeanor'
    }

	$("#shade").on("click",function(){
		$('#model').hide();
		$(this).hide();
	});
	$("#model").on("click",function(){
		$('#shade').hide();
		$(this).hide();
	});
//  debugger;
   $(function() {// 初始化内容
        getCirlce();
        getDeme()
        
//      active();
    });
    //上拉加载更多
     $(window).on("scroll",function(){

       		
       var scrollTop = $(this).scrollTop();
//      	alert(scrollTop)
       
       var scrollHeight = $(document).height();
       var windowHeight =  $(this).height();
//     debugger;
        if(scrollTop + windowHeight == scrollHeight&&stop){
        	stop=false;
        	pages++;

        	if((pages)*rows>=total){
        		stop=true
        	}else{
       			getDeme(true);	
        	}


        }else if(scrollTop<0){
//      	alert(scrollTop)
        }

    });
	function openApps(){

		
    //跳转app商品详情页地址
//  var jumpParams = getUrlParams("communityId") || "";
//					smartcity://iOS/gateway?open_type=circle_group&communityId=
    var $ios_app = "smartcity://iOS/gateway?open_type=circle_group&communityId=" + communityId,
        $android_app = "selfapp://izxcs/openwith_circle_group_detail?communityId=" + communityId,
        $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782",
        $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
//       var $ios_app = "smartcity://iOS/gateway?open_type=circle_detail&circleId=" + circleId,
//          $android_app = "selfapp://izxcs/openwith_circle_detail?circleId=" + circleId,
//          $ios_url = "https://itunes.apple.com/us/app/zhi-xiang-cheng-shi/id1146700782",
//          $android_url = "http://android.myapp.com/myapp/detail.htm?apkName=com.smartcity";
    //页面跳转app or 商店
        //判断为android
        if (navigator.userAgent.match(/android/i)) {
            //android非微信
            if (navigator.userAgent.match(/MicroMessenger/i) != 'MicroMessenger') {
                var last = Date.now();
                var doc = window.document;
                var ifr = doc.createElement('iframe');
                ifr.src = $android_app;
                ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
                doc.body.appendChild(ifr);
                setTimeout(function () {
                    doc.body.removeChild(ifr);
                    //setTimeout回小于2000一般为唤起失败
                    if (Date.now() - last < 2000) {
                        window.location.href = $android_url;
                    }
                }, 1000);
            } else {
                //android微信
                $(".model_cont .text1 span").css("background-image","url(img/moreshu@2x.png)");
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
            }
            //判断为IOS
        } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
            //微信
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
                //QQ内置浏览器
            } else if (navigator.userAgent.indexOf(' QQ') > -1) {
                $("#model").show();
                $('#shade').show();
                $("#shade").on("click",function(){
                    $('.model').hide();
                });
            } else {
                window.location.href = $ios_app;
                setTimeout(function () {
                    window.location.href = $ios_url;
                }, 250);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        } else {
            //判断为pc
            window.location.href = $android_url;
        }

}

    //跳转app
    $('.content').on('click','.openApp',function(){

    	openApps()
    })
    $('.openApp').on('click',function(){

    	openApps()
    })
    //查询圈子详细信息
  	function getDeme(flag){
  		var param = {
  			page:pages,
        	row:rows,
            userId:userId,
            communityId:communityId
  		}
  		reqAjaxAsync(USER_URL.GETDEME,JSON.stringify(param)).done(function(res) {
            total=res.total
  			var data =res.data;
  			if(data&&data.length){
               $('.no-fc').css("display",'none')
               creatImglist(data)

  			}else{
  				if(flag){
                	layer.msg('没有更多了！');	
  				}else{
               		$('.no-fc').css("display",'block')			
  				}
  			}
            stop=true;
  			
  			
  		})
  	}
  	//获取风采数据
  	function creatImglist(arr){
  		var str=''
  		for(var i=0;i<arr.length;i++){

  			
  			if(arr[i].contentType==1||arr[i].contentType==0){

  			var imgstr='',imgnum,astr='';
  			if(arr[i].pictureList!=null){ 
//				debugger

  				imgnum=arr[i].pictureList.length
  				astr="<a class='img-more openApp' href='javascript:void(0);'>共"+imgnum+"张</a>"

  				if(arr[i].pictureList!=null){

  					
  					for(var j=0;j<arr[i].pictureList.length&&j<3;j++){
  					
  						if(arr[i].pictureList[j]){
						imgstr+="<img  src="+arr[i].pictureList[j].picUrl+" />"
	  					}	
					}

  					
  				}

  				
	  			
  			}else{
  				imgnum=0;
  				astr=''
  			}

  			 str+="<li>"+	
				"<div class='user-info'>"
					+"<div class='left'><img src="+arr[i].userPic+"  /></div>"
					+"<div class='left'>"
						+"<p class='user-name'>"+arr[i].userName+"</p>"
						+"<p class='time'>"+arr[i].modifyTime+"</p>"
						+"<a class='user-more openApp' href='javascript:void(0);'></a>"
					+"</div>"
				+"</div>"
				+"<p class='msg-info'>"+arr[i].recordTitle+"</p>"
				+"<div class='msg-img'>"
//				debugger;
					+imgstr
					+astr
				+"</div>"
				+"<p class='img-icon'>"
					+"<a class='openApp'  href='javascript:void(0);'><i></i>分享</a>"
					+"<a class='openApp'  href='javascript:void(0);'><i></i>"+arr[i].commentNum+"</a>"
					+"<a class='openApp'  href='javascript:void(0);'><i></i>"+arr[i].praiseNum+"</a>"
				+"</p>"
			+"</li>"
  		}else if(arr[i].contentType==2){
  			if(arr[i].videoList!=null){
  				videoStr='<video poster='+arr[i].videoList[0].videoCover+' controls="controls"  width="100%"><source type="video/mp4" src='+arr[i].videoList[0].videoUrl+'></source>你的浏览器不支持H5播放器</video>'
  			}
			 str+='<li>'
				+'<div class="user-info">'
					+'<div class="left"><img src='+arr[i].userPic+' alt="" /></div>'
					+'<div class="left">'
						+'<p class="user-name ">'+arr[i].userName+'</p>'
						+'<p class="time">'+arr[i].modifyTime+'</p>'
						+'<a class="user-more openApp" href="javascript:void(0);"></a>'
					+'</div>'
				+'</div>'
				+'<p class="msg-info">'+arr[i].recordContent+'</p>'
				+videoStr
				+'<p class="img-icon">'
					+'<a class="openApp"  href="javascript:void(0);"><i></i>分享</a>'
					+'<a class="openApp"  href="javascript:void(0);"><i></i>'+arr[i].commentNum+'</a>'
					+'<a class="openApp"  href="javascript:void(0);"><i></i>'+arr[i].praiseNum+'</a>'
				+'</p>'
			+'</li>'
  		}
  	}	
	$('.fc-list').append(str)			
  }
  	$(".fc-list").on("click" ,".msg-img img" ,function(){

        var index = $(this).index();
        toBigPic(index,$(this))
    });
    //获取社群数据
    function creatQunzi(arr){
    	var str=''
    	for (var i=0;i<arr.length;i++) {
    		
    		str += '<li class="openApp"><img src='+arr[i].circlePortrait+' alt="" /><span>'+arr[i].circleName+'</span></li>'
    	}

    	$('.qz_num').append(str)
    }
    function getCirlce(){

        var param = {
        	page:page,
        	row:row,
            userId:userId,
            communityId:communityId
        }
        reqAjaxAsync(USER_URL.GETCICLE,JSON.stringify(param)).done(function(res) {

            if (res.code == 1) {
                var data= res.data;

                $("header").css({
                    "background":"url('"+ data.communityCoverurl +"') center no-repeat",
                    "background-size":"100%"
                });
                $("header h1").text(data.communityName);
                $(".h_span i").text(data.circleNumber);
                if(data.communityNotice){
                	$(".gongg").text('【重要公告】'+data.communityNotice);
                	
                }else{
                	$(".gongg").text('暂无公告！');
                	
                }

                $(".tip").text(data.communityIntroduce);
               	if(data.circleList){
               		creatQunzi(data.circleList)
               		$('.no-qz').css("display",'none')
               	}
                if(!data.isAdministrators){//判断是否为管理员
                	$('.qz_num li').eq(0).css("display",'none')
                	$('.admin').css("display",'none')
                	$('.noAdmin').eq(0).css("display",'inline-block')
                	if(data.circleNumber){
                		$('.no-qz').css("display",'none')
                	}else{
                		$('.no-qz').css("display",'block')
                	}
                }else{
                	$('.qz_num li').eq(0).css("display",'inline-block')
                	$('.admin').css("display",'inline-block')
                	$('.noAdmin').eq(0).css("display",'none')
                	if(data.circleNumber){
	
                		$('.qz_num em').css("display",'none')
                	}else{
                		$('.qz_num em').css("display",'inline-block')
                	}
                }
            } else {
//              $('.no-qz').css("display",'block')
                layer.msg(res.msg);
            }
        })
    }
})(jQuery)

