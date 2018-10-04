(function($){
    var defaultImg = 'image/24.png';
        releaseCity = 4201, articleId = 199, userId = 52143;

    //获取文章详情
    function getArticleDetailById(){
        var jsonData = "{'articleId':"+articleId+"}";
        var res = CommonUtil.ajaxData('cms/selectArticleByUserIdAndKey', jsonData);
        if(res.code == 1){
            var obj = res.data.scCmsArticle;
            $(".cms-main-content .title").text(obj.articleTitle);
            $(".cms-main-content .time").text(obj.releaseTime);
            $(".cms-main-content .article").text(obj.articleContent==null ? "" :obj.articleContent);
        }else{
            console.error(res.msg);
        }
    }
    getArticleDetailById();

    //获取评论列表
    function getCommentsList(){
        var jsonData = "{'pagination':'{\"page\":1,\"rows\":5}','articleId':"+articleId+"}";
        var res = CommonUtil.ajaxData('cms/selectTimeComment', jsonData);
        if(res.code == 1){
            var obj = res.data.scCmsCommentList, sHtml = "";
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<li id="'+obj[i].id+'"><div class="pic"><img src="'+obj[i].userImgUrl+'"></div>'
                        + '<div class="info"><div class="user-info">'
                        + '<span class="name">'+obj[i].userName+'</span>'
                        + '<span class="time">'+obj[i].commentTime+'</span>'
                        + '<div class="pull-right">'
                        + '<a class="like-btn" href="javascript:void(0);"></a>'
                        + '<span class="like-num">'+obj[i].praiseNumber+'</span>'
                        + '</div></div>'
                        + '<div class="comments-detail">'+obj[i].commentComment+'</div>'
                        + '</div></li>'
                }
            }
            $(".comments-list ul").html(sHtml);
        }else{
            console.error(res.msg);
        }
    }
    getCommentsList();
    $(".comments-list ul").delegate("li .like-btn", "click", function(){
        var userName = "大雄"
        var id = $(this).parents("li").attr("id");
        var sIsLike = sLike == 1 ? 0 : 1;
        var jsonData = "{'id':'"+id+"','userId':"+userId+",'userImgUrl':'"+defaultImg+"', 'userName':'"+userName+"'}";
        var res = CommonUtil.ajaxData('cms/addScCmsPraiseRecord', jsonData);
        if(res.code == 1){
            alert("点赞成功！");
        }else{
            console.error(res.msg);
        }
    });

    //XX的更多24小时
    function getMoreListByUser(){
        var jsonData = "{'userId':"+userId+",'pagination':'{\"page\":1,\"rows\":6}'}"
        var res = CommonUtil.ajaxData('cms/selRecArticleByUserId', jsonData);
        if(res.code == 1){
            var sHtml = '', obj = res.data.scCmsArticleList;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    var resourceArr = obj[i].scCmsResourcesList;
                    var imgSrc = resourceArr.length > 0 ? resourceArr[0].resourcesUrl :defaultImg;
                    sHtml += '<li><div class="pic"><img src="'+imgSrc+'" alt="'+obj[i].articleTitle+'" />'
                        + '</div><div class="title">'+obj[i].articleTitle+'</div></li>'
                }
            }
            $(".user-cms-list ul").html(sHtml);
        }else{
            console.error(res.msg);
        }
    }
    getMoreListByUser();

    //24小时排行数据展示
    function rankListShow(){
        var jsonData = "{'pagination':'{\"page\":1,\"rows\":5}','releaseCity':"+releaseCity+"}"
        var res = CommonUtil.ajaxData('cms/selectScCmsArticleByNum', jsonData);
        if(res.code == 1){
            var sHtml = "", obj = res.data.scCmsArticleList;
            var len = obj.length;
            if(len > 0){
                for(var i=0; i<len; i++){
                    var resourceArr = obj[i].scCmsResourcesList;
                    var imgSrc = resourceArr.length > 0 ? resourceArr[0].resourcesUrl :defaultImg;
                    sHtml += '<li> <span class="num"></span>'
                        + '<div class="media"><div class="media-left">'
                        + '<a><img src="'+imgSrc+'"></a></div>'
                        + '<div class="media-body"><h4 class="media-heading">'+obj[i].articleTitle+'</h4>'
                        + '<p class="name">'+obj[i].scSysUser.username+'</p></div></div></li>'
                }
            }
            $(".cms-rank-list ul").html(sHtml);
        }else{
            console.error(res.msg);
        }
    }
    rankListShow();
    //发表评论
    function addComments(){
        var res = CommonUtil.ajaxData('', jsonData);
        if(res.code == 1){

        }else{

        }
    }

})(jQuery);
