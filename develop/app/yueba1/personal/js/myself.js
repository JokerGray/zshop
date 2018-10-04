//请求数据
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
     
    var def = reqAjax('newservice/getPersonalList',
        {
            "identity": 1,
            "userId": 11,
            "type": 2,
            "pagination": {
                "page": 1,
                "rows": 10
            }
        } 
    );
    def.then(function(data){
        setData(data.data);
    });
    // 设置数据
	function setData(data){
        $('#userpic').attr('src',data['userpic']);
        $('#userpic1').attr('src',data['userpic']);
        $('#username').text(data['username']);
        $('.collection').text(data['collection']);
        $('.certNumber').text(data['certNumber']);
        var skillList=data['skillList'];
        var z;
        if(skillList.length === 1){
            z=0;
        }else{
            z=1;
        }
        for(var i=0;i<=z;i++){
            $('.content').append($('.JN1').first().clone().removeClass('hidden'));
             $('.serviceName').eq(i+1).text(skillList[i].serviceName);
             $('.resourceUrl').eq(i+1).attr('src',skillList[i].resourceList[0].resourceUrl);
             $('.servicePrice').eq(i+1).text(skillList[i].servicePrice);
             if(skillList[i].serviceMode ==='1'){
                $('.home').eq(i+1).text("到家服务");
             }else{
                $('.home').eq(i+1).text("到店服务");
             }
             var startLevel = skillList[i].startLevel;
             $('.startLevel').eq(i+1).text(skillList[i].startLevel);
             var number=parseInt(startLevel/1);
             if(startLevel % 1 != 0){
                $('.star').eq(i+1).children().find('img').eq(number).attr('src','./image/yb_banxing@2x.png');
             }
             if(number !==0){
                for(var j=1;j<=number;j++){
                    $('.star').eq(i+1).children().find('img').eq(j-1).attr('src','./image/star@2x.png');
                }
             }
        }
        
	}