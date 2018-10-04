function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

var GetInfo = function () {
    var swiperType; //技能滑动条
    var swiperImg; //证书滚动
    var swiperTit; //证书名
    var jsondata;
    var dropload;
    var userid;
    var skillid;
    var comment_num; //临时使用
    var now_page ;
    var pageNo = 1, pageSize = 5;
    var cityId = 4201;
    var userId = 52142;
    var serviceId = 308;
    var paramRank = "{'cityId':" + cityId + ", 'pagination':{'page':" + pageNo + ",'rows':"+ pageSize +"}}";//热销榜入参
    var paramPerson = "{'cityId':" + cityId + ", 'pagination':{'page':" + pageNo + ",'rows':"+ pageSize +"}}";//约吧牛人榜入参
    var paramUserSkill = "{'userId':" + userId +"}";//技能相关信息入参
    var paramComment = "{'userId':" + userId +",'serviceId':"+ serviceId +", 'pagination':{'page':" + pageNo + ",'rows':"+ pageSize +"}}";//评论信息入参
    var SERVICETIME = {
        "1":"全周",
        "2":"非周末",
        "3":"只周末",
        "4":"全天",
        "5":"只白天",
        "6":"只晚上"
    };
    var SERVICEMODE = {
        "1":"服务者找需求者",
        "2":"需求者找服务者",
        "3":"线上服务"
    };
    var REQUEST_URL = {
        TOPRANK: 'newservice/getTopRanking', //约吧热销榜列表
        HOTPERSON: 'newservice/getHotPersonList',//约吧牛人榜列表
        USERSKILL: 'newservice/getUserSkillDetailInfo',//查询指定用户发布的技能信息
        CONMEN:'newservice/getCommentList' //技能评论
    };

    //热销榜列表
    function topRank(){
        var res = CommonUtil.ajaxData(REQUEST_URL.TOPRANK,paramRank);
        var sHtml = "";
        if(res.code == 1){
            for(var i = 0; i < res.data.length; i++){
                var row = res.data[i];
                sHtml += '<li date-userId="'+ row.serviceUserId +'">' +
                '<div class="topHead">' +
                '<i class=" topNum'+(i+1)+'"></i>' +
                '<div class="topImage"><img src="' + row.serviceUrl + '"/></div>' +
                '</div>' +
                '<div class="topInfo">' +
                '<p class="topInfo-message">' + row.serviceName + '</p>'
                if(row.serviceUserName == null){
                    sHtml += '<p class="topInfo-userName">' + '空' + '</p>';
                }else{
                    sHtml += '<p class="topInfo-userName">' + row.serviceUserName + '</p>';
                }
                sHtml +=
                  /*  '<div class="fans"><i class="heart"></i><span>' + 1200 + '</span></div>' +*/
                '<div class="service"><i class="talk"></i><span>' + row.orderNumber + '</span></div>' +
                '</div>' +
                '</li>';
            };
            $("#topRank").append(sHtml);
        }else{
            console.log(res.msg);
        }
    };

    topRank();

    //约吧牛人榜
    function hotPerson(){
        var res = CommonUtil.ajaxData(REQUEST_URL.HOTPERSON,paramPerson);
        var sHtml = "";
        if(res.code == 1){
            for(var i = 0; i < res.data.length; i++){
                var row = res.data[i];
                sHtml += '<li id="'+ row.userId +'">' +
                '<div class="topHead">' +
                '<i class="topNum'+(i+1)+'"></i>' +
                '<div class="topImage"><img src="' + row.userPic + '"/></div>' +
                '</div>' +
                '<div class="topInfo">'
                /*'<p class="topInfo-message">' + '哈哈哈哈哈' + '</p>'*/
                if(row.serviceUserName == null){
                    sHtml += '<p class="topInfo-userName">' + '空' + '</p>';
                }else{
                    sHtml += '<p class="topInfo-userName">' + row.userName + '</p>';
                }
                sHtml += '<div class="fans"><i class="heart"></i><span>' + row.collection + '</span></div>' +
                    /*'<div class="service"><i class="talk"></i><span>' + 1200 + '</span></div>' +*/
                '</div>' +
                '</li>';
            };
            $("#hotPerson").append(sHtml);
        }else{
            console.error(res.msg);
        }
    };

    hotPerson();

    //滑动
    var initSwipers = function () {
        swiperType = new Swiper('.swiper-container', {
            slidesPerView: 3,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            loop: false,
            onClick: function (swiper) {
                if(typeof(swiperType.clickedSlide) == "undefined")
                    return;
                if (!$(swiperType.clickedSlide).find('span').hasClass('slide-active')) {
                    $('.swiper-container>.swiper-wrapper>.swiper-slide>.slide-active').removeClass('slide-active');
                    $(swiperType.clickedSlide).find('span').addClass('slide-active');
                    updateSkillInfo(swiperType.clickedIndex);
                }
            }
        });
        swiperImg = new Swiper('.swiper-container1', {
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            pagination: '.swiper-pagination',
            paginationClickable: true,
            paginationType: 'fraction',
            spaceBetween: 30,
            centeredSlides: true,
            slidesPerView: 1,
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            loop: true
            /*onTouchMove: function (swiper) {
                var img_name = $(".swiper-container1 .swiper-wrapper").find(".swiper-slide-active").child("img").attr("name");
                alert(img_name)
                console.log(img_name);
                $(".cookTitle").html(img_name);
            }*/
        });
    }

    var updateSkillInfo = function (index) {
        //根据传入索引及jsondata，加载技能相关
        //暂无，模拟数据
        var skill = jsondata.skillList[index];
        skillid = skill.serviceId;
        //技能背景图
        var back_image_src = skill.resourceList[0].resourceUrl
            + '?x-oss-process=image/resize,m_fill,w_800,h_450,limit_0';
        $(".userInfo-background").find("i").css("background-image","url("+back_image_src+")");//头像以及背景图
        //技能证书加载
        swiperImg.removeAllSlides();
        var certificate_array = skill.certList;
        var len = certificate_array.length;
        if (len != 0) {
            $('.cook-slider ').show();
            for (var i = 0; i < len; i++) {
                str = '<li class="swiper-slide">'+
                '<img src="'+ certificate_array[i].certUrl + '" name="' + certificate_array[i].certName +'"/>'+
                '<div class="urlName">'+ certificate_array[i].certName + '</div>'+
                '</li>';
                swiperImg.appendSlide(str);
            }
            //swiperImg.slideTo(0);
            if(len == 1)
            {
                swiperImg.lockSwipes();
            }else{
                swiperImg.unlockSwipes();
            }

        } else {
            $('.cook-slider ').hide();
        }
        //技能信息加载
        $('#service1').html(skill.servicePrice + "元/" + skill.serviceUnit);

        $('.star').remove();
        var dHtml = "";
        var star = skill.startLevel;
        switch(star){
            case 0:
                dHtml = '<i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                break;
            case 1:
                dHtml = '<i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                break;
            case 2:
                dHtml = '<i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                break;
            case 3:
                dHtml = '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                break;
            case 4:
                dHtml = '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i>';
                break;
            default :
                dHtml = '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i>';

        };
        $(".star").html(dHtml);

        $('#orderNumber').html(skill.orderNumber + "次");
        $('#collection').html(skill.collection + "次");
        var timestr = '';
        var times = skill.serviceTime.split(',');
        $.each(times, function (index, value) {
            switch (value) {
                case '1':
                    timestr += '周一至周日 ';
                    break;
                case '2':
                    timestr += '非周末 ';
                    break;
                case '3':
                    timestr += '只周末 ';
                    break;
                case '4':
                    timestr += '全天 ';
                    break;
                case '5':
                    timestr += '只白天 ';
                    break;
                case '6':
                    timestr += '只晚上 ';
            }
        });
        $('#serviceTime').html(timestr);

        var servicemodal = '';
        var servicesmodals = skill.serviceMode.split(',');
     $('#serviceRange').html('');
        $('#serviceAddress').html('')
        $("#serviceRangeDt").hide();
        $("#serviceAddressDt").hide();
        $.each(servicesmodals, function (index, value) {
            switch (value) {
                case '1':
                    servicemodal += '可上门服务 ';
                    $("#serviceRangeDt").show();
                    $('#serviceRange').html(skill.serviceRange);
                    break;
                case '2':
                    servicemodal += '可到店服务 ';
                    $("#serviceAddressDt").show();
                    $('#serviceAddress').html(skill.serviceAddress);
                    break;
                case '3':
                    servicemodal += '可线上服务 ';
                    break;
            }
        });
        $('#servicemodal').html(servicemodal);

        $('#serviceComment').html(skill.serviceComment);
        $('#characteristic').html(skill.characteristic);
        $('#comment_num').html('评论(0)');
        $('#commentlist').empty();
        //调用查看更多
        now_page = 0;
        handleDropload();
    }

    var updateHeadInfo = function () {
        //从jsondata中获取头部数
        //暂无，模拟数据


        //头像
        var touxiang_src = jsondata.userPic + '?x-oss-process=image/resize,m_fill,w_300,h_300,limit_0';
        $(".userInfo-infomation").find(".headTx").css("background-image","url("+touxiang_src+")");

        //用户名字
        $(".nameInfo-username span").html(jsondata.userName);//用户名
        var ceruserName = $(".nameInfo-username span").text();
        $(document).attr("title",ceruserName+ "的技能详情");
        //判断性别
        if(jsondata.userSex == "女"){
            $(".nameInfo-username i").attr("class","woman");
        }else{
            $(".nameInfo-username i").attr("class","man");
        };
        //判断手机认证
        if(jsondata.isPhoneCert == 1){
            $("#isPhoneCert").find("span").html("手机已认证");
        }else{
            $("#isPhoneCert").find("span").html("手机未认证");
        };
        if(jsondata.isRealName == 1){
            $("#isRealName").find("span").html("身份已认证");
        }else{
            $("#isRealName").find("span").html("身份未认证");
        };

        //用户技能类别
        var skills = jsondata.skillList;
        swiperType.removeAllSlides();
        var skillid = GetQueryString('skillid');
        var skillindex = 0;
        for (var i = 0, len = skills.length; i < len; i++) {
            if (skills[i].serviceId == skillid) {
                str = '<li class="swiper-slide"><span class="title slide-active">'
                +skills[i].serviceName +
                '</span></li>';
                skillindex = i;
            } else{
                str = '<li class="swiper-slide"><span class="title">'
                +skills[i].serviceName +
                '</span></li>';
                swiperType.appendSlide(str);
            }

        }
        $(".swiper-slide-active").find("span").addClass("slide-active");
        if (skills.length != 0) {
            $('#skills').show();
            $('.content-conment').show();
            $('#none_skill').hide();
            swiperType.slideTo(skillindex);
            updateSkillInfo(skillindex); //初始加载第1个技能
        }
        else {
            //此用户无技能
            $('#skills').hide();
            $('.content-conment').hide();
            $('#none_skill').show();

        }

    }

    function userSkill(){
        var res = CommonUtil.ajaxData(REQUEST_URL.USERSKILL,paramUserSkill);

        if(res.code == 1) {
            jsondata = res.data;
            updateHeadInfo(); //加载头部数据
        }else{
            console.error(res.msg);
        }
    };

    var handleDropload = function () {


           dropload = $("#commentlist").dropload({
                                scrollArea: window, //滑屏范围
                                distance: 50, //拉动距离
                                domDown: {
                                    domClass: 'dropload-down',
                                    /*domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',*/
                                   domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                                    domNoData: '<div class="dropload-noData">暂无数据</div>'
                         },
                                loadDownFn: function (me) { //上拉函数
                                    $.ajax({
                                        type: 'POST',
                                        url: '/zxcity_restful/ws/rest',
                                        data: {
                                            'cmd': 'newservice/getCommentList',
                                            'data': "{'userId':" + userid + ",'serviceId':" + skillid + ",'pagination':{'page':" + now_page + ",'rows':5}}",
                                            'version': 3
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            if (data.code != 1) {
                                                $('#comment_num').html('评论(0)');
                                                me.noData(true);
                                                me.resetload();
                                                return;
                                       }
                        $('#comment_num').html('评论(' + data.total + ')');
                        var tmpstr = '';
                        for (var i = 0; i < data.data.length; i++) {
                            tmpstr += ' <div class="conmentDetail-info">' +
                                            '<div class="conmentDetail-head">' +
                            '				    <img class="round_image" src="' +
                            data.data[i].userImgUrl +
                            '?x-oss-process=image/resize,m_fill,w_300,h_300,limit_0" />' +
                            '			    </div>' +
                            '			   <div class="conmentDetail-article">' +
                            '				    <div class="article-nameInof">' +
                            '				    <div class="nameInfo-username">' +
                            '				        <span>' + data.data[i].userName + '</span>' +
                            '				        <i class="woman"></i>' +
                            '                   </div>' +
                            '			        <div class="nameInfo-star">';
                            var star = data.data[i].startLevel;
                            switch(star){
                                case 0:
                                    tmpstr += '<i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                    break;
                                case 1:
                                    tmpstr += '<i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                    break;
                                case 2:
                                    tmpstr += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                    break;
                                case 3:
                                    tmpstr += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i><i class="grayStar"></i>';
                                    break;
                                case 4:
                                    tmpstr += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="grayStar"></i>';
                                    break;
                                default :
                                    tmpstr += '<i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i><i class="yellowStar"></i>';

                            };
                            tmpstr +=
                                '			  </div>' +
                                '		</div>' +
                                '		<div class="conment-date">' + data.data[i].commentTime + '</div>' +
                                '		<div class="conment-text">' + data.data[i].content  + '</div>' +
                                '	</div>' +
                                '</div>';

                        };
                        $('#commentlist').append(tmpstr);
                        now_page++;
                        if (now_page * 5 > data.total)
                            me.noData(true);
                        me.resetload();
                    },
                    error: function (xhr, type) {
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            }
        });

    }

    return {
        //main function to initiate the module
        init: function () {
            userid = GetQueryString("userid");
            initSwipers();
            userSkill();

        }

    };

}
();