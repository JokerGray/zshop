(function($){
    var pageNo = 1, pageSize = 5;//通用入参
    /*
    *脸圈排行所需入参
    * */
    var cityId = 4201;//用户城市
    var condition = 1;//1距离排序，2关注数排序,默认用户gamauser创建时间排序
    var theodolite = "113.123,114.123";//经纬度
    /*
    * 用户更多照片
    * */
    var userId = 52145; //登录用户ID
    /*
    * 获取详情
    * */
    var otherUserId = 52145;//别人用户ID

    var paramAllUser = "{'cityId':"+ "'" + cityId + "'" + ",'condition':" + condition + ",'theodolite':" + "'" + theodolite + "'" + ",'page':" + pageNo + ",'row':" + pageSize + "}";//脸圈排行
    var paramShowData = "{'userId':" + userId + "}";//用户更多照片
    var paramDetails = "{'otherUserId':" + otherUserId + ",'theodolite':'" + theodolite +"'}";
    var REQUEST_URL = {
        ALLUESER:'game/findAllUser',  //脸圈排行
        SHOWDATA:'game/showPersonalData', //用户更多照片
        OTHERSDETAIL:'game/selectOthersDetails' //获取详情
    };

    //脸圈排行
    function getAllUser(){
        var res = CommonUtil.ajaxData(REQUEST_URL.ALLUESER,paramAllUser);
        var sHtml = "";
        if(res.code == 1) {
            for(var i=0;i<res.data.UserMainList.length;i++){
                var row = res.data.UserMainList[i];
                sHtml += '<li id="'+ row.scGameUser.gameUserId +'">' +
                '<div class="topHead">' +
                '<i class="topNum'+(i+1)+'"></i>' +
                '<div class="topImage"><img src="' + row.scGameUser.userpic + '"/></div>' +
                '</div>' +
                '<div class="topInfo">'
                if(row.scGameUser.signature == null || row.scGameUser.signature == ""){
                    sHtml += '<p class="topInfo-message" title="'+ "该用户太懒，什么都没有说~"  +'">' + "该用户太懒，什么都没有说~" + '</p>'
                }else{
                    sHtml += '<p class="topInfo-message"  title="'+ row.scGameUser.signature   +'">' + row.scGameUser.signature + '</p>'
                };
                if(row.scGameUser.username == null){
                    sHtml += '<p class="topInfo-userName">' + '空' + '</p>';
                }else{
                    sHtml += '<p class="topInfo-userName">' + row.scGameUser.username + '</p>';
                };
                sHtml += '<div class="perNum"><i class="personNum"></i><span>' + row.scGameUser.likeCount + '</span></div>' +
                '</div>' +
                '</li>';
            }
            $(".hotSaleList").append(sHtml);
        }else{
            console.error(res.msg);
        }
    }
    getAllUser();

    //更多照片
    function getShowData(){
        var res = CommonUtil.ajaxData(REQUEST_URL.SHOWDATA,paramShowData);
        var sHtml = "";
        if(res.code == 1) {
            if(res.data.length != 0){
                for(var a=0;a<res.data.pictureList.length;a++){
                    for(var i=0;i<res.data.pictureList[a].pictures.length;i++ ){
                        var row = res.data.pictureList[a].pictures[i];
                        sHtml += '<div class="image-info">' +
                        '<img src="' + row.fileUrl + '" />'
                        if( row.fileDescribe == null ||  row.fileDescribe == ""){
                            sHtml +=    '<span>' + '' + '</span>' ;
                        }else{
                            sHtml +=    '<span>' + row.fileDescribe + '</span>' ;
                        }
                        sHtml += '</div>';
                    }
                }
                $(".imageList").append(sHtml);
            }else{
                $(".imageList").append("<div style='text-align: center;padding:10px 0 '>暂无照片</div>");
            }
        }else{
            console.error(res.msg);
        }
    };
    getShowData();

    //全民炫
    function getIiCool1(res){
        var sHtml = "";
        var icolLen = res.data.ICool1.length;
        var row = res.data.ICool1;
        for(var i=0;i<icolLen;i++){
            sHtml += '<div class="swiper-slide">' +
                        '<div class="HyunImg-body">' +
                            '<div class="HyunImg">' +
                                '<img src="' + row[i].coolFileAddress + '" />' +
                            '</div>' +
                            '<p class="Hyuntitle">' + row[i].coolDecrip + '</p>' +
                            '<div class="hyunTit">' +
                                '<span class="huynName">'+ row[i].coolRename +'</span>' +
                                '<div class="hyunNum"><i class="grayHeart"></i><span>' + row[i].mPlmap.totalCount + '</span></div>' +
                            '</div>' +
                        '</div>' +
                      '</div>';
        }
        $("#Hyun-wrapper").append(sHtml);
    }

    //发布的服务
    function getService(res){
        var sHtml = "";
        var serviceLen = res.data.serviceList.length;
        var row = res.data.serviceList;
        for(var i=0;i<serviceLen;i++){
            sHtml += '<div  class="swiper-slide">'+
                '<div class="service-info">' +
                        '<div class="serviceTx">' +
                            '<div class="serviceTx-img">' +
                                '<img src="' + row[i].resourceList.resourceUrl + '" />' +
                            '</div>'+
                            '<span>' + row[i].serviceName + '</span>' +
                        '</div>' +
                        '<div class="serviceTxt">' +
                            '<div class="serviceTxt-content">' + row[i].serviceComment + '</div>' +
                            '<div class="serviceJudge">' +
                                '<span>评分：</span>' +
                                '<div class="star">'
                            switch (row[i].startLevel){
                                case 0:
                                    sHtml += '<i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                break;
                                case 1:
                                    sHtml += '<i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                break;
                                case 2:
                                sHtml += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                break;
                                case 3:
                                    sHtml += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                break;
                                case 4:
                                    sHtml += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                break;
                                default :
                                    sHtml += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i>';
                                break;
                            };
                        sHtml += '</div>' +
                            '</div>' +
                        '</div>' +
                     '</div>'+
                   '</div>';
        }
        $("#service-wrapper").append(sHtml);
    }

    //发布的文章
    function getArticle(res){
        var sHtml = "";
        var serviceLen = res.data.articleList.rows.length;
        var row = res.data.articleList.rows;
        for(var i=0;i<serviceLen;i++){
            sHtml += '<div class="swiper-slide">' +
                        '<div class="articleBdy">' +
                            '<div class="articleLft">' +
                                '<img src="' + row[i].extensionUrl + '/>' +
                                '<div class="articleFc">'+
                            '</div>'+
                            '<div class="articleText">' +
                                '<div class="articleTitle"><span></span>' + row[i].articleTitle +'</div>' +
                                '<div class="articleContent">' + row[i].articleContent + '</div>' +
                                '<ul class="articleTip">'
                            for(var a =0;a<row[i].scCmsChannelList.length;a++){
                                sHtml += '<li>' + row[i].scCmsChannelList.channelName + '</li>';
                            };
            sHtml += '</ul>' +
                    '<div class="clear"></div>' +
                    '<div class="articleInfo">' +
                        '<div class="articleRead"><i class="readIcon"></i><span>'
            if(sHtml += row[i].totalVisitNumber>=10000){
                sHtml += (row[i].totalVisitNumber/10000) + '万';
            }else{
                sHtml += row[i].totalVisitNumber;
            }
            sHtml += '</span></div>'+
                     '<div class="articlePl"><i class="plIcon"></i><span>'
            if(sHtml += row[i].praiseNumber>=10000){
                sHtml += (row[i].praiseNumber/10000) + '万';
            }else{
                sHtml += row[i].praiseNumber;
            }
            sHtml += '</span></div>'+
                '</div>' +
                '</div>' +
                '</div>' +
             '</div>' ;
        }
        $("#article-wrapper").append(sHtml);
    }

    //加入的圈子
    function getCircle(res){
        var sHtml = "";
        var serviceLen = res.data.joinedCircle.length;
        var row = res.data.joinedCircle;
        for(var i = 0;i< serviceLen ;i++){
            sHtml += '<div class="swiper-slide">' +
                        '<div class="circleBdy">' +
                            '<div class="addCrImg">' +
                                '<img src="' + row[i].detailTitlePic + '" />' +
                            '</div>' +
                            '<div class="addCrTit">'
                                if(row[i].detailTypeId != 1){
                                    sHtml += '<i class="redZuan"></i>';
                                }else{
                                    sHtml += '<i class="king"></i>';
                                }
            sHtml +=  '<span class="addCrInfo">' + row[i].detailName + '</span>' +
                     '</div>' +
                     '<div class="starWrappe">' +
                          '<div class="addCrStar">'
            switch (row[i].detailLevel){
                case null:
                    sHtml += '';
                    break;
                case 0:
                    sHtml += '';
                    break;
                case 1:
                    sHtml += '<i class="redStar"></i>';
                    break;
                case 2:
                    sHtml += '<i class="redStar"></i><i class="redStar"></i>';
                    break;
                case 3:
                    sHtml += '<i class="redStar"></i><i class="redStar"></i><i class="redStar"></i>';
                    break;
                case 4:
                    sHtml += '<i class="redStar"></i><i class="redStar"></i><i class="redStar"></i><i class="redStar"></i>';
                    break;
                default :
                    sHtml += '<i class="redStar"></i><i class="redStar"></i><i class="redStar"></i><i class="redStar"></i><i class="redStar"></i>';
                    break;
            };
            sHtml += '</div>' +
                    '</div>' +
                '</div>'+
               '</div>' ;
        }
        $("#circle-wrapper").append(sHtml);
    }

    //喜欢的云店
    function getShop(res){
        var sHtml = "";
        var serviceLen = res.data.shopList.length;
        var row = res.data.shopList;
        for(var i = 0;i< serviceLen ;i++){
            sHtml += '<div class="swiper-slide">' +
            '<div class="storeBody">' +
            '<img src="' + row[i].favUrl + '" />' +
            '<div class="storeTti">' + row[i].favName + '</div>' +
                        '</div>' +
                      '</div>'  ;
        }
        $("#loveStore-wrapper").append(sHtml);
    }

    //关注的个人
    function getPerson(res){
        var sHtml = "";
        var serviceLen = res.data.concernUsers.length;
        var row = res.data.concernUsers;
        for(var i = 0;i< serviceLen ;i++){
            sHtml += '<div class="swiper-slide">' +
                        '<div class="lovePerason-bdy">' +
                            '<div class="lovePs">' +
                                '<img src="' + row[i].showPicture + '" />' +
                            '</div>' +
                            '<div class="loveNmae">' + row[i].showName + '</div>' +
                        '</div>' +
                    '</div>'  ;
        }
        $("#loveStore-wrapper").append(sHtml);
    }

    //用户信息
    function getUserInfo(res){
       var row = res.userMain.scGameUser;
       $("#userpic").attr("src",row.userpic);//用户头像
       $("#visitCount").html(row.visitCount);//访问量
       $("#likeCount").html(row.likeCount);//点赞量
        $("#username").html(row.username);//用户名
        $("#age").html(row.age);//用户年龄
        //用户性别
        if(row.usersex=='女'){
            $(".faceOld").prepend('<i class="woman"></i>');
        }else{
            $(".faceOld").prepend('<i class="man"></i>');
        };
        $("#signature").html(row.signature);//用户签名
        $("#distance").html(row.distance + "km");//用户距离
    }

    //获取用户数据
    function getAjax() {
        var res = CommonUtil.ajaxData(REQUEST_URL.OTHERSDETAIL, paramDetails);
        if (res.code == 1) {
            getUserInfo(res);
            getIiCool1(res);
            getService(res);
            getArticle(res);
            getCircle(res);
            getShop(res);
            getPerson(res);
        } else {
            console.error(res.msg);
        }
    };
    getAjax();
 })(jQuery);