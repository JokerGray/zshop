var layer = layui.layer,
    laytpl = layui.laytpl;
$(function() {
    var recommendList = $("#recommendList").html();
    var userId = localStorage.getItem("userId") || "1";
    var imgBox = $("#imgBox");
    var Detail = function() {
        this.cursor = 0;
        this.index = 0;
        this.num = 0;
        this.attentionUserId = 0;
        this.url = {
            recommend: "cms_new/recommendedArticleRandom",
            channel: "cms_back/selectAllChannel",
            aticleList: "cms_new/queryReArticleList",
            hotList: 'cms_new/queryReArticleHotList', //热点列表
            hot: 'cms_new/querSearchRecordHotName', //热词
            articleDetail: "cms_new/querArticleDetails", //文章详情
            iscollection: 'cms_new/isArticleCollection',
            collection: 'cms_new/ArticleCollection',
        }
        this.videoData = { //收藏
            userId: userId,
            articleId: GetQueryString("articleId") || ""
        }
    };
    Detail.prototype = {
        getImgData: function(d) {
            var _this = this;
            _this.num = 0;
            reqAjaxAsync(this.url.articleDetail, d).done(function(res) {
                var li = "",
                    p = "";
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                if (isNull(res.data)) {
                    return layer.msg("数据异常，请联系管理员!~");
                }
                $(".writerimg span").html(res.data.scCmsArticleCommentCount);
                // 判断是自己得文章 筑城就不显示
                res.data.userId==userId ? $("#FollowAuthor").hide():$("#FollowAuthor").show();
                $("#scCmsArticleTitle").html(res.data.scCmsArticleTitle || "");
                $('.userInfoImgIcon').attr('href', 'myArticle.html?userId=' + res.data.userId);
                $("#articleAvatar").attr("src", res.data.userAuthorImg);
                $("#userAuthorName").html(res.data.userAuthorName);
                $("#scCmsArticleCreateTime").html(res.data.scCmsArticleCreateTime);
                $("#navChildA").html(res.data.scCmsArticleChannel);
                if (res.data.isFollow == 0) {
                    $('#FollowAuthor').removeClass('active');
                } else if (res.data.isFollow == 1) {
                    $('#FollowAuthor').addClass('active');
                }
                $('#FollowAuthor').attr('isFollow', res.data.isFollow || '0');
                _this.attentionUserId = res.data.userId;
                $('#FollowAuthor').attr('personId', res.data.userId || '0');
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
                if (isNull(res.data.scCmsResourcesList)) return false;
                $.each(res.data.scCmsResourcesList, function(i, v) {
                    if (v.resourcesType == "image") {
                        li += '<li class="img-item"><img src="' + v.resourcesUrl + '" alt="" width="100%"></li>';
                        p += '<span class="span-item">' + v.resourcesRemarks + '</span>';
                        _this.num++;
                    }
                });
                $("#imgListUl").html(li);
                $("#sum").html(_this.num);
                $("#imgDescription").html(p);
                $(".img-item").eq(0).addClass("active");
                $("#imgDescription").find(".span-item").eq(0).addClass("active");
            });
        },
        leftClick: function(num) {
            this.index--;
            if (this.index == -1) {
                this.index = num - 1;
            }
            $(".img-item").eq(this.index).addClass("active").siblings().removeClass("active");
            $(".span-item").eq(this.index).addClass("active").siblings().removeClass("active");
            $("#imgKey").html(this.index + 1 + "/");
        },
        rightClick: function(num) {
            this.index++;
            if (this.index == num) {
                this.index = 0;
            }
            $(".img-item").eq(this.index).addClass("active").siblings().removeClass("active");
            $(".span-item").eq(this.index).addClass("active").siblings().removeClass("active");
            $("#imgKey").html(this.index + 1 + "/");
        },
        // // 获取推荐列表
        // getRecommendList: function(d) {
        //     var _this = this;
        //     reqAjaxAsync(this.url.recommend, d).done(function(res) {
        //         if (res.code == 1) {
        //             if (!isNull(res.data)) {
        //                 var data = res.data;
        //                 laytpl(recommendList).render(data, function(html) {
        //                     $("#moreList").html(html);
        //                 });
        //             }
        //         } else {
        //             layer.msg(res.msg);
        //         }
        //     });
        // }
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
    // 开始
    var start = new Detail();
    // 启动导航
    getChannel({
        url: start.url.channel,
        num: 0,
        dom: $("#navUl")
    });
    //获取推荐列表
    // start.getRecommendList({});
    // 获取图集详情数据
    start.getImgData({
        userId: userId,
        articleId: GetQueryString("articleId") || ""
    });
    // 左右切换
    $("#curL").click(function() {
        start.leftClick(start.num);
    });
    $("#curR").click(function() {
        start.rightClick(start.num);
    });
    //点击关注按钮
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
                    start.getImgData({
                        userId: userId,
                        articleId: GetQueryString("articleId") || ""
                    });
                });
            } else if (isFollow == 1) {
                isFollowState({
                    url: "delCocernRela",
                    data: data
                }, function() {
                    start.getImgData({
                        userId: userId,
                        articleId: GetQueryString("articleId") || ""
                    });
                });
            }
        }
    });

    // 判断是否收藏
    start.iscollection(start.videoData);
    //点击收藏按钮
    $('.collect').on('click', '.sc', function(){
        if (isNull(userId) ||userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            reqAjaxAsync(start.url.collection, start.videoData).done(function(res) {
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
    // js over
});