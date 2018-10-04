  function reqAjax(cmd, data){
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
            version: 1 // 版本号根据情况默认
        },
        success: function(data){
            deferred.resolve(data)
        },
        error: function(){
            toast('连接出错，请检查网络或稍后再试！');
            deferred.reject()
        }
    });
    return deferred;
    }
     
    var def = reqAjax('newservice/getDemandDetail',
    {"demandId": 10,}
    );
    def.then(function(data){
        setData(data.data);
        getvoice(data.data);
    });
    // 设置数据
	function setData(data){
        $('#demandTitle').text(data['demandTitle']);
        
        $('#userPic').attr('src',data['userPic']);
        
        $('#userName').text(data['userName']);

        $('.demandTitle1').text(data['demandTitle']);

        $('.seconds').text(data['seconds']);
        
        $('#voiceUrl').val(data['voiceUrl']);

        $('#demandComment').text(data['demandComment']);
        $('#demandPrice').text(data['demandPrice']);
        var demandMode=data['demandMode'];
        if(demandMode ==="1"){
            $('.fuwuW').text("到店服务"); 
        }else{
            $('.fuwuW').text("上门服务");
        }
        $('.time1').text(data['reserveTime']);

        $('.createTime').text(data['createTime']);

        $('.hubei').text(data['demandAddress']);
    }
    var player;
    function getvoice(data){
      if(data['voiceUrl']){
        var xx= data['voiceUrl'];
        player = new AmrPlayer(xx);
        $('.seconds').text(data['seconds']);
         var clk=1;
         var timer=null;
             $('.yuyin').on('touchstart',function(){
                 clearInterval(timer);
                 clk++;
                 var num=data['seconds']
                 if(clk % 2==0){
                     player.play();;
                     $(this).find('#voice').attr('src','./image/stop@2x.png');
                     timer=setInterval(function(){
                         num=num-1;
                         $('.seconds').text(num);
                         if(num == 0){
                             clearInterval(timer);
                             $('#voice').attr('src','./image/play.png');
                             $('.seconds').text(data['seconds']);
                         }
                     },1000);
                 }else{
                     player.pause();
                     $(this).find('#voice').attr('src','./image/play.png');
                     $('.seconds').text(data['seconds']);
                 }
             })
      }else{
        $('.yuyin').css('display','none');
      }
    } 
    