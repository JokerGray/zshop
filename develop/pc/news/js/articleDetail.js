var layer = layui.layer,
    laytpl = layui.laytpl;

$(function() {
    var userId = localStorage.getItem("userId") || "1";
    var recommendList = $("#recommendList").html();
     var toutiao = function() {
        this.flag = false;
        this.attentionUserId = 0;
        this.url = {
            channel: "cms_back/selectAllChannel",
            aticleList: "cms_new/queryReArticleList",
            hotList: 'cms_new/queryReArticleHotList', //热点列表
            hot: 'cms_new/querSearchRecordHotName', //热词
            articleDetail: "cms_new/querArticleDetails",//文章详情
            iscollection: 'cms_new/isArticleCollection',
            collection: 'cms_new/ArticleCollection',
        }
        this.videoData = { //收藏
            userId: userId,
            articleId: GetQueryString("articleId") || ""
        }
    };
    toutiao.prototype = {
        getArticleData: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.articleDetail, d).done(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                if (isNull(res.data)) {
                    return layer.msg("数据异常");
                }
                $(".writerimg span").html(res.data.scCmsArticleCommentCount||"0");
                $("#articleTitle").html(res.data.scCmsArticleTitle || "");
                $('.userInfoImgIcon').attr('href', 'myArticle.html?userId=' + res.data.userId);
                $("#articleAvatar").attr("src", res.data.userAuthorImg);
                $("#userAuthorName").html(res.data.userAuthorName);
                $("#scCmsArticleCreateTime").html(res.data.scCmsArticleCreateTime);
                $("#scCmsArticleContent").html(formatImg(res.data.scCmsArticleContent));
                $("#navChildA").html(res.data.scCmsArticleChannel);
                // 标签
                var tagList = res.data.scCmsArticleLable || '';
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
                if (res.data.isFollow == 0) {
                    $('#FollowAuthor').removeClass('active');
                } else if (res.data.isFollow == 1) {
                    $('#FollowAuthor').addClass('active');
                }
                $('#FollowAuthor').attr('isFollow', res.data.isFollow || '0');
                $('#FollowAuthor').attr('personId', res.data.userId || '0');
                // // 判断是自己得文章 筑城就不显示
                res.data.userId==userId ? $("#FollowAuthor").hide():$("#FollowAuthor").show();
                _this.attentionUserId = res.data.userId;
            });
        },
        iscollection:function(d){
            var _this = this;
            if(!isNull(userId)&&userId!=1){
                reqAjaxAsync(_this.url.iscollection, d).done(function(res) {
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
    };

    var homepage = new toutiao();
    // 启动导航
    getChannel({
        url: homepage.url.channel,
        num: 0,
        dom: $("#navUl")
    });
    homepage.getArticleData({
        userId: userId,
        articleId: GetQueryString("articleId") || ""
    });
    
    // 判断是否收藏
    homepage.iscollection(homepage.videoData);
    //点击收藏按钮
    $('.collect').on('click', '.sc', function(){
        if (isNull(userId) ||userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            reqAjaxAsync(homepage.url.collection, homepage.videoData).done(function(res) {
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
    //点击筑城按钮
    $('#FollowAuthor').click(function() {
        if (isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            var isFollow = $(this).attr('isFollow');
            var personId = $(this).attr('personId');
            var data = {
                "appName": "24",
                "busiId": personId,
                "busiType": 0,
                "userId": userId
            }
            if (isFollow == 0) {
                isFollowState({
                    url: "addCocernRela",
                    data: data
                }, function() {
                    homepage.getArticleData({
                        userId: userId,
                        articleId: GetQueryString("articleId") || ""
                    });
                });
            } else if (isFollow == 1) {
                isFollowState({
                    url: "delCocernRela",
                    data: data
                }, function() {
                    homepage.getArticleData({
                        userId: userId,
                        articleId: GetQueryString("articleId") || ""
                    });
                });
            }
        }
    });
    //js over
});