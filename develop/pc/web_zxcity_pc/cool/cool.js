(function($){
    var coolId = 6251, //炫id
        sCurrUserId = 52184, //当前登录人id
        coolVideoTypeId = 2, //类型：1-我要炫，2-电子名片
        coolUserId = 52144,
        coolAreaNo = '4201',
        pageNo = 1;
    var totalLikeCount = 0;
    //获取我要炫详情
    function getCoolDetailById(){
        var jsonData = "{'coolId':'"+coolId+"', 'sCurrUserId':'"+sCurrUserId+"', 'coolVideoTypeId': "+coolVideoTypeId+"}";
        var res = CommonUtil.ajaxData('circle/getCBID', jsonData);
        if(res.code == 1){
            var mPlmap = res.data.mPlmap;
            $(".video-intro .title").text(res.data.coolDecrip);
            $(".video-intro .time").text(res.data.coolTime);
            var videoHtml = '<video controls poster="'+res.data.coolCoverPic+'" src="'+res.data.coolFileAddress+'"></video>'
            $(".video").html(videoHtml);
            $(".view-show span").text(mPlmap.totalCount);
            totalLikeCount = mPlmap.totalLikeCount;
            $(".like-show span").text(totalLikeCount);
            $(".like-show a").attr('data-isLike', mPlmap.isClicked);
            if(1 == mPlmap.isClicked){
                $(".like-show a").addClass("active");
            }
        }else{
            console.error(res.msg);
        }
    }
    getCoolDetailById();

    //XX的更多全民炫
    function getMoreListByUser(){
        var jsonData = "{'coolUserId':'"+coolUserId+"','coolVideoTypeId':'"+coolVideoTypeId+"','sStartpage':'1','sPagerows':'6'}";
        var res = CommonUtil.ajaxData('circle/getCBUID', jsonData);
        if(res.code == 1){
            var obj = res.data.myCool, sHtml = '';
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<li id="'+obj[i].coolId+'"><div class="pic">'
                        + '<img src="'+obj[i].coolCoverPic+'" alt="'+obj[i].coolDecrip+'" /></div>'
                        + '<div class="title">'+obj[i].coolDecrip+'</div></li>'
                }
                $(".user-cool-list ul").html(sHtml);
            }
        }else{
            console.error(res.msg);
        }
    }
    getMoreListByUser();

    //全民炫精选排行数据展示
    function rankListShow(){
        var jsonData = "{'coolAreaNo':'"+coolAreaNo+"','coolMorefield3':'hot','sCurrUserId':'"+sCurrUserId+"','coolVideoTypeId':"+coolVideoTypeId+",'sStartpage':1,'sPagerows':5}";
        var res = CommonUtil.ajaxData('circle/getAllCool', jsonData);
        if(res.code == 1){
            var obj = res.data, sHtml = '';
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    var userObj = obj[i].sysUser, mPlmap = obj[i].mPlmap;
                    var cNum = mPlmap.commentList.length;
                    sHtml += '<li><span class="num"></span>'
                        + '<div class="media"><div class="media-left">'
                        + '<a><img src="'+userObj.userpic+'"></a></div>'
                        + '<div class="media-body"><h4 class="media-heading">'+obj[i].coolDecrip+'</h4>'
                        + '<p class="name">'+userObj.username+'</p>'
                        + '<div class="other"><div class="pull-left">'
                        + '<span class="like-icon glyphicon glyphicon-heart"></span>'
                        + '<span class="like-num">'+mPlmap.totalLikeCount+'</span></div>'
                        + '<div class="pull-left"><i class="comments-num-icon"></i>'
                        + '<span class="comments-num">'+cNum+'</span></div>'
                        + '</div></div></div></li>'
                }
            }
            $(".cool-rank-list ul").html(sHtml);
        }else{
            console.error(res.msg);
        }
    }
    rankListShow();

    //获取评论列表
    function getCommentsList(){
        var jsonData = "{'sCoolId':"+coolId+",'sType':"+coolVideoTypeId+", 'pageNo':"+pageNo+",'pageSize':10}";
        var res = CommonUtil.ajaxData('circle/commentList', jsonData);
        if(res.code == 1){
            var commentList = res.data.commentList, sHtml = '';
            var cLen = commentList.length
            if(cLen > 0){
                for(var i=0; i<cLen; i++){
                    var isLike = commentList[i].sIsLike == null ? 1 : commentList[i].sIsLike;
                    likeCount = commentList[i].sLikeCount == null ? "" : commentList[i].sLikeCount;
                    sHtml += '<li id="'+commentList[i].sId+'" data-sLike="'+isLike+'"><div class="pic"><img src="'+commentList[i].sMemberImgName+'"></div>'
                        + '<div class="info"><div class="user-info">'
                        + '<span class="name">'+commentList[i].sUserCode+'</span>'
                        + '<span class="time">'+commentList[i].sCommentDate+'</span>'
                        + '<div class="pull-right">'
                        + '<a class="like-btn" href="javascript:void(0);"></a>'
                        + '<span class="like-num">'+likeCount+'</span></div></div>'
                        + '<div class="comments-detail">'+commentList[i].sCommentContent+'</div>'
                        + '</div></li>'
                }
            }
            $(".comments-show .title em").html("("+cLen+")")
            $(".comments-list ul").html(sHtml);
        }else{
            console.error(res.msg);
        }
    }
    getCommentsList();

    //发表评论
    function addComments(){
        //sType:2-我要炫， sCoolId-炫id
        var sUserCode = '大雄',
            sCommentDate = '2017-03-15',
            sCommentContent = '啦啦啦啦啦啦啦测试一下评论功能',
            sMemberImgName = 'https://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/user/photos/36fc9b64dc187925ce4951a290b6a39d.png';
        var jsonData = "{'sType':2,'sCoolId':"+coolId+", 'sUserId':"+sCurrUserId+", 'sUserCode':'"+sUserCode+"', 'sCommentDate':'"+sCommentDate+"', 'sCommentContent':'"+sCommentContent+"', 'sMemberImgName':'"+sMemberImgName+"'}";
        var res = CommonUtil.ajaxData('circle/addComment', jsonData);
        if(res.code == 1){

        }else{

        }
    }

    $("#publishBtn").click(function(){
        addComments();
    });

    //为评论点赞
    $(".comments-list ul").delegate("li .like-btn", "click", function(){
        var sid = $(this).parents("li").attr("id"),
            sLike = $(this).parents("li").attr("data-sLike");
        var sIsLike = sLike == 1 ? 0 : 1;
        var jsonData = "{'sId':'"+sid+"', 'sType':2, 'sCoolId':"+coolId+", 'sUserId':"+sCurrUserId+", 'sIsLike':"+sIsLike+"}";
        var res = CommonUtil.ajaxData('circle/uptComment', jsonData);
        if(res.code == 1){
            alert("操作成功！");
        }else{
            console.error(res.msg);
        }
    });

    //为视频点赞
    $(".cool-main-content .like-show a").click(function(){
        var sLike = $(".like-show a").attr('data-isLike');
        var jsonData = "{'sType':2, 'sCoolId':"+coolId+", 'sUserId':"+sCurrUserId+", 'sIsLike':"+sLike+"}";
        var res = CommonUtil.ajaxData('circle/uptComment', jsonData);
        if(res.code == 1){
            if(sLike == 0){
                $(".like-show span").text(++totalLikeCount);
                $(".cool-main-content .like-show a").addClass("active");
            }else{
                $(".like-show span").text(--totalLikeCount);
                $(".cool-main-content .like-show a").removeClass("active");
            }
            getCoolDetailById();
            alert("操作成功！");
        }else{
            console.error(res.msg);
        }
    });

})(jQuery);
