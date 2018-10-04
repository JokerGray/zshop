var layer = layui.layer,
    laytpl = layui.laytpl;
$.extend({
    platform: function() {
        this.articleId = GetQueryString('articleId') || ''; //获取url的参数articleId
        this.userId = localStorage.getItem('userId') || ''; //获取缓存的用户信息
        this.attentionUserId = ''; //发表视频人的ID
        this.Request = {
            videoDetail: 'cms_new/querArticleDetails',
            iscollection: 'cms_new/isArticleCollection',
            collection: 'cms_new/ArticleCollection',
            channel: "cms_back/selectAllChannel",
        }
        this.videoData = { //视频详情data
            userId: this.userId,
            articleId: this.articleId
        }
    }
})
$.platform.prototype = {
    constructor: $.platform,
    // 获取搜索列表
    getSearchList: function() {
        //搜索框
        reqAjaxAsync('cms_new/querSearchRecordHotName').done(function(res) {
            var li = '';
            for (var i = 0; i < res.data.length; i++) {
                li += '<li><a href="search.html?search=' + res.data[i] + '">' + res.data[i] + '</a></li>';
            }
            $('#searchListBox ul').html(li);
            $('.tt-autocomplete input').attr('placeholder', '大家都在搜：' + res.data[0]);
        })
        $('.searchInp').click(function(e) {
            stopPropagation(e);
            $('#searchListBox').addClass('show').removeClass('hide');
        })
        $(document).click(function() {
            $('#searchListBox').addClass('hide').removeClass('show');
        });
    },
    getVideoDetail: function(d) {
        var _this = this;
        reqAjaxAsync(_this.Request.videoDetail, d).done(function(res) {
            if (res.code != 1) return layer.msg(res.msg);
            if (res.code == 1) {
                var data = res.data;
                if (!isNull(data)) {
                    $(".writerimg span").html(data.scCmsArticleCommentCount||"0");
                    // 判断是自己得文章 筑城就不显示
                    res.data.userId==_this.userId ? $("#FollowAuthor").hide():$("#FollowAuthor").show();
                    var resourcesList = data.scCmsResourcesList;
                    if (!isNull(resourcesList)) {
                        $('#videoPlayer').attr('poster', resourcesList[0].resourcesUrl || '');
                        $('#videoPlayer source').attr('poster', resourcesList[0].resourcesUrl || '');
                        $('#videoPlayer').attr('src', resourcesList[0].videoUrl || '');
                        $('#videoPlayer source').attr('src', resourcesList[0].videoUrl || '');
                    }
                    if (data.isFollow == 0) {
                        $('#FollowAuthor').removeClass('active');
                    } else if (data.isFollow == 1) {
                        $('#FollowAuthor').addClass('active');
                    }
                    $('.userInfoImgIcon').attr('href', 'myArticle.html?userId=' + data.userId);
                    $('#FollowAuthor').attr('isFollow', data.isFollow || '0');
                    $('#FollowAuthor').attr('personId', data.userId || '0');
                    $('#videoAuthorIcon').attr('src', data.userAuthorImg || '');
                    $('#videoExpTitle').html(data.scCmsArticleTitle || '');
                    $('#videoAuthorName').html(data.userAuthorName || '');
                    $('#videoPublishTime').html(data.scCmsArticleCreateTime || '');
                    $('#videoExpPlayNum').html(data.reArticleCount || '0');
                    $('#videoExpContent').html(data.scCmsArticleContent || '');
                    $("#navChildA").html(res.data.scCmsArticleChannel);
                    _this.attentionUserId = data.userId || '';
                    var tagList = data.scCmsArticleLable || '';
                    if (tagList) {
                        var tagArr = tagList.split(','),
                            tagLis = '';
                        for (var i = 0; i < tagArr.length; i++) {
                            if (tagArr[i]) {
                                tagLis += '<li>' + tagArr[i] + '</li>';
                            }
                        }
                        $('#videoTagList').html(tagLis);
                    }
                }
            }
        })
    },
    iscollection:function(d){
        var _this = this;
        if(!isNull(_this.userId)&&_this.userId!=1){
            reqAjaxAsync(_this.Request.iscollection, d).done(function(res) {
                if (res.code != 1) return layer.msg(res.msg);
                if (res.code == 1) {
                    if(res.data==0){
                        $(".collect .sc").attr("isEnshrined","0");
                        $(".collect .sc img").attr("src","../img/sc.png");
                    }else{
                        $(".collect .sc img").attr("src","../img/sca.png");
                        $(".collect .sc").attr("isEnshrined","1");
                    }
                }
            })
        }
    }
}
$(function() {
    var videoInfo = new $.platform();
    // 获取搜索列表
    videoInfo.getSearchList();
    // 启动导航
    getChannel({
        url: videoInfo.Request.channel,
        num: 0,
        dom: $("#navUl")
    });
    //获取视频信息
    videoInfo.getVideoDetail(videoInfo.videoData);
    // 判断是否收藏
    videoInfo.iscollection(videoInfo.videoData);
    //点击关注按钮
    $('#FollowAuthor').click(function() {
            if (isNull(videoInfo.userId) || videoInfo.userId == 1) {
                $('.userOperate span:first-child').click();
                layer.msg('请先登录');
            } else {
                var isFollow = $(this).attr('isFollow');
                var personId = $(this).attr('personId');
                var data = {
                    "appName": "24",
                    "busiId": personId,
                    "busiType": 0,
                    "userId": videoInfo.userId
                }
                if (isFollow == 0) {
                    isFollowState({
                        url: "addCocernRela",
                        data: data
                    }, function() {
                        videoInfo.getVideoDetail(videoInfo.videoData);
                    });
                } else if (isFollow == 1) {
                    isFollowState({
                        url: "delCocernRela",
                        data: data
                    }, function() {
                        videoInfo.getVideoDetail(videoInfo.videoData);
                    });
                }
            }

        })
        //监控视频是否播放完成
    var videoPlayer = document.getElementById('videoPlayer') || '';
    videoPlayer.addEventListener('ended', function(e) {
        var data = {
            userId: videoInfo.userId,
            articleId: videoInfo.articleId
        }
        reqAjaxAsync('cms_new/videoPlayBackTimes', data).done(function(res) {
            console.log(res);
        })
    });

    //点击收藏按钮
    $('.collect').on('click', '.sc', function(){
        if (isNull(videoInfo.userId) ||videoInfo.userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            reqAjaxAsync(videoInfo.Request.collection, videoInfo.videoData).done(function(res) {
                if (res.code != 1) return layer.msg(res.msg);
                if (res.code == 1) {
                    if(res.data.isEnshrined==0){
                        $(".collect .sc").attr("isEnshrined","0");
                        $(".collect .sc img").attr("src","../img/sc.png");
                    }else{
                        $(".collect .sc img").attr("src","../img/sca.png");
                        $(".collect .sc").attr("isEnshrined","1");
                    }
                }
            })
        }
    })
    //右侧相关视频列表
    rPublish('cms_new/queryReArticleHotList', {
        "channelId": "",
        "typeCode": "1003",
        "rows": 6
    }, '#rVideoTpl', '#rVideoList');
})
