(function($){
    var detailId = 2175 ;
    var userId =52146; //用户id
    var cityId = 4201; //按地市查询排行榜
    var searchType = 1;//圈子类型(1-粉团队/2-玩圈子/3-全部)
    var pageNo = 1, pageSize = 5;
    var rows = 2;
    /*
     * 排序方式 1 - 热门，2- 最新，3- 即将开始，4- 价格升序，5- 价格降序
     * */
    var sortBy = 2;
    var activityType = 0 ;//活动类型  0-全部，1. 玩家活动 2. 乞丐要钱 3. 白送白玩',
    //参与 0-全部，1-可参与
    var partake = 0;
    //活动所在城市
    //var cityId = 4201;
    //活动状态
    var activityStatus = 1;
    //圈子id
    var videoAlbumCircleId = "";
    var videoAlbumType = 2;//类型1 图片，2视频，3文字动态，4活动通知动态，5晒单图片，6晒单视频
    var videoAlbumTypeName = 0; //相册ID
    var orderType = 1;//1 日期排序 2 浏览量排序
    //相册相关
    var albumId = 1610; //用户id
    var circleId = 2189;//圈子id
    //团队小组
    var personCircleId = 2189;
    //人气粉天地
    var currUserId = 3;
    var paramCircle = "{'detailId':" + detailId +",'userId':" + userId + " }";//泡圈发起人
    var paramAll = "{'userId':"+ userId + ",'activityType':" + activityType + ",'sortBy':"+ sortBy + ",'partake':" + partake + ",'cityId':" + cityId +  ",'activityStatus':" + activityStatus +",'pagination':{'page':"+ pageNo +",'rows':"+ rows +"}}";//活动
    var paramVideo = "{'videoAlbumType':" + videoAlbumType + ",'videoAlbumTypeName':" + videoAlbumTypeName + ",'orderType':" + orderType + ",'sStartpage':" + pageNo + ",'sPagerows':" + rows +"}";//动态
    var paramPicture = "{'videoAlbumCircleId':"+ circleId + ",'sCurrUserId':"+ albumId +",'sStartpage':"+ pageNo +",'sPagerows':"+ rows +"}"; //相册
    var paramMember = "{'personCircleId':"+ personCircleId +",'sStartpage':"+ (pageNo-1) +",'sPagerows':"+ pageSize +"}"; //团队小组
    var paramMost = "{'detailCityId':"+ cityId + ",'currUserId':" + currUserId + ",'sStartpage':" + pageNo + ",'sPagerows':" + pageSize +"}";//人气粉天地
    var REQUEST_URL = {
        CIRCLE: 'circle/getCircleByID20', //泡圈发起人
        ALLACTIVITY:'circle/getActivityByCondition20', //活动
        VIDEOLIST:'circle/searchVideoAlbumListByParamNew20',//动态
        PICTURE:'circle/getAlbList', //相册
        ALLMEMBERS:'circle/getAllmembers', //团队小组
        USERMOST:'circle/getUserMost'//人气粉天地
    };


    //过多字用省略号代替
    function moreWord(event,num){
        $(event).each(function(){
            var val = $(this).text();
            var valLength = val.length;
            var subVal = val.substring(0,num)+"...";
            if(valLength>num){
                $(this).text(subVal);
            }else{
                $(this).text();
            }
        });
    }

    moreWord(".dynamicTit",107);

    //用户信息
    function circleBy(){
        var res = CommonUtil.ajaxData(REQUEST_URL.CIRCLE,paramCircle);
        var sHtml = "";
        if(res.code == 1){
            var row = res.data;
            $(".userUp").find(".userUp-img").css("background-image","url("+row.detailTitlePic+")");//发起人头像
            $("#detailCreatePeople").html(row.detailName);
            if(row.detailLevel != null){
                switch(row.detailLevel){
                    case 0:
                        sHtml = '';
                        break;
                    case 1:
                        sHtml = '<i class="redStar"></i>';
                        break;
                    case 2:
                        sHtml = '<i class="redStar"></i><i class="redStar"></i>';
                        break;
                    case 3:
                        sHtml = '<i class="redStar"></i><i class="redStar"></i><i class="redStar"></i>';
                        break;
                    case 4:
                        sHtml = '<i class="redStar"></i><i class="redStar"></i><i class="redStar"></i><i class="redStar"></i>';
                        break;
                    default:
                        sHtml = '<i class="redStar"></i><i class="redStar"></i><i class="redStar"></i><i class="redStar"></i><i class="redStar"></i>';
                };
                $(".userInfo-star").html(sHtml);
            }else{
                $(".userInfo-star").html(" ");
            };
            //活动次数
            $("#detailActivityTimes").html(row.detailActivityTimes);
            //圈子人数
            $("#detailNumber").html(row.detailNumber);
            //圈子标题
            $(".userTxt").html(row.detailTitle);

        }else{
            console.error(res.msg);
        }
    }

    circleBy();


    //活动
    function allActivity(){
        var res = CommonUtil.ajaxData(REQUEST_URL.ALLACTIVITY,paramAll);
        var sHtml = "";
        if(res.code == 1 ){
            var row = res.data;
            if(row.length != 0){
                if(row.length<2){
                    $(".moreActive").find("span").hide();
                }else{
                    $(".moreActive").find("span").show();
                }
                for(var i = 0;i < row.length;i++){
                    sHtml += '<div class="activityDetail-info">' +
                    '<div class="activityImg">' +
                    '<img src="' + row[i].detailPicUrl + '"/>' +
                        <!--价格/报名人数等-->
                    '<div class="activityLayer">' +
                    '<div class="activityPrice">'
                    if(row[i].detailJoinMoney != 0){
                        sHtml +=    '<span>¥' + row[i].detailJoinMoney + '</span>' +
                        '<s>原价¥'+ row[i].detailBudget +'</s>';
                    }else{
                        sHtml += '<span class="actPice">' + row[i].detailBudget +'</span>';
                    }
                    sHtml += '</div>'
                    if(i==0){
                        sHtml += '<div class="activityTime">' +
                        '<span>距离报名截至</span>' +
                        '<div class="activity-countDown">' +
                        '<span class="activity-hours">' + 52 + '</span><span>:</span>' +
                        '<span class="activity-minute">' + 17 + '</span><span>:</span>' +
                        '<span class="activity-seconds">' + 29 + '</span>' +
                        '</div>' +
                        '</div>'  ;
                    }
                    sHtml += '<div class="activitySign">'+
                    '报名人数<span>'+ row[i].detailAppliedPersonNumber + '</span>/<span>' + row[i].detailMaxTotal + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="activityTitle">' + "hahahah" +'</div>'+
                    '<div class="activityDate">' + row[i].detailBeginTime + ' ~ ' + row[i].detailCutOffTime + '</div>' +
                    '<ul class="activityTip">'
                    if(row[i].detailIsBossPay == 0){
                        sHtml += '<li>'+row[i].payName+'已为此买单</li>';
                    };
                    if(row[i].detailIsMerchantSupport == 0){
                        sHtml += '<li>'+'已有商家为此赞助'+'</li>';
                    }
                    sHtml += '</ul>'+
                    '</div>';
                }
                $(".activityDetail").prepend(sHtml);
                $(".moreActive").show();
            }
            else{
                $(".activityDetail").html("暂无活动").css({"text-align":"center",'padding-bottom':'10px'});
                $(".moreActive").hide();
            }
        }else{
            console.error(res.msg);
        }
    }

    allActivity();
    //动态
    function videoList(){
        var res = CommonUtil.ajaxData(REQUEST_URL.VIDEOLIST,paramVideo);
        var sHtml = "";
        if(res.code == 1 ){
            var row = res.data;
            if(row.length != 0){
                if(row.length<2){
                    $(".moreDynamic").find("span").hide();
                }else{
                    $(".moreDynamic").find("span").show();
                }
                for(var i=0;i<row.length;i++){
                    var raw = row[i].videoAlbum;
                    sHtml += '<div class="dynamicDetail-info">' +
                    '<div class="dynamic-headImg">' +
                    '<div class="dynamic-headtx"><img src="' + raw.userpic + '" /></div>' +
                    '<span class="dynamic-userName">'+ raw.userName + '</span>' +
                    '<span class="dynamic-date">'+ raw.videoAlbumTime + '</span>' +
                    '</div>' +
                    '<div class="dynamicTit">' + raw.videoAlbumDescription + '</div>' +
                    '<ul class="dynamicVideo">' ;
                    if(raw.videoAlbumType == 2 || raw.videoAlbumType == 6){
                        sHtml +=   '<li><video width="703" height="420"  preload="auto" controls="controls" controls="controls"><source src="'+ raw.urls +'" /></video></li>';
                    }else if(raw.videoAlbumType == 1 || raw.videoAlbumType == 5 ){
                        if(raw.sAlbPicNum.length!=0 ){
                            sHtml += '<li><img src="' + raw.urls + '/></li>';
                        }
                    }else if(raw.videoAlbumType == 3){
                        sHtml += '';
                    }else if(raw.videoAlbumType == 4){
                        sHtml += '<li><img src="' + raw.urls + '/></li>';
                    }
                    sHtml += '</ul>' +
                    '<div class="clear"></div>' +
                    '</div>';
                }
                $(".dynamicDetail").prepend(sHtml);
                $(".moreDynamic").show();
            }
            else{
                $(".dynamicDetail").html("暂无动态").csscss({"text-align":"center",'padding-bottom':'10px'});
                $(".moreDynamic").hide();
            }
        }else{
            console.error(res.msg)
        }
    }
    videoList();
    //相册
    function getPictures(){
        var res = CommonUtil.ajaxData(REQUEST_URL.PICTURE,paramPicture);
        var sHtml = "";
        if(res.code == 1 ){
            var row = res.data;
            if(row.length != 0 ){
                if(row.length<2){
                    $(".moreAlbum").find("span").hide();
                }else{
                    $(".moreAlbum").find("span").show();
                }
                for(var i = 0; i < row.length; i++) {
                    sHtml += '<div class="albumDetail-info">'+
                    '<span class="fengeLine1"></span>'+
                    '<span class="fengeLine2"></span>'+
                    '<div class="albumDetail-img">'+
                    '<img src="'+ row[i].videoAlbumCoverUrl +'" />'+
                    '</div>'+
                    '<div class="albumTit">'+
                    '<a title="'+ row[i].videoAlbumTypeName + '">'+
                    '<span class="albumTit-text">'+ row[i].videoAlbumTypeName +'</span>'+
                    '<span class="albumNum">'+row[i].sAlbPicNum + '</span>' +
                    '</a>'+
                    '</div>'+
                    '</div>';
                }
                $(".albumDetail").prepend(sHtml);
                $(".moreAlbum").show();
            }
            else {
                $(".albumDetail").html("暂无相册").css({"text-align":"center",'padding-bottom':'10px'});
                $(".moreAlbum").hide();
            }
        }else{
            console.error(res.msg)
        }
    }
    getPictures();

    //团队小组
    function getTeam(){
        var res = CommonUtil.ajaxData(REQUEST_URL.ALLMEMBERS,paramMember);
        var sHtml = "";
        if(res.code == 1 ){
            var row = res.data;
            if(row.length != 0 ) {
                for (var i = 0; i < row.length; i++) {
                    sHtml += '<div class="teamList-info">' +
                                '<div class="teamImg">' +
                                    '<img src="'  + '"/>' +
                                '</div>' +
                                '<span>' +  + '</span>' +
                             '</div>'  ;
                }
                $(".teamList").append(sHtml);
            }else{
                $(".pinkTeam").append("<div style='text-align: center;padding: 5px 0;'>暂无团队</div>");
            }
        }else{
            console.error(res.msg)
        }
    }
    //getTeam();

    //人气粉天地
    function getUserMost(){
        var res = CommonUtil.ajaxData(REQUEST_URL.USERMOST,paramMost);
        var sHtml = "";
        if(res.code == 1 ){
            var row = res.data;
            if(row.length != 0 ) {
                for(var i = 0; i < res.data.length; i++){
                    sHtml += '<li id="'+ row[i].detailId +'">' +
                    '<div class="topHead">' +
                    '<i class="topNum'+(i+1)+'"></i>' +
                    '<div class="topImage"><img src="' + row[i].detailTitlePic + '"/></div>' +
                    '</div>' +
                    '<div class="topInfo">'
                    if(row[i].detailName == null){
                        sHtml += '<p class="topInfo-userName">' + '空' + '</p>';
                    }else{
                        sHtml += '<p class="topInfo-userName">' + row[i].detailName + '</p>';
                    }
                    sHtml += '<div class="perNum"><i class="heart"></i><span>' + row[i].userNumber + '</span></div>' +
                    '</div>' +
                    '</li>';
                };
                $(".hotSaleList").append(sHtml);
            }
        }else{
            console.error(res.msg)
        }
    }
    getUserMost();
})(jQuery);
