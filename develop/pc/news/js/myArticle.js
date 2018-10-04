var layer = layui.layer, laytpl = layui.laytpl;
$.extend({
    platform: function() {
        this.userId = GetQueryString('userId') || '';
        this.localUserId = localStorage.getItem("userId") || "";
        this.rows = 5;
        this.pages = 1;
        this.url = {
            articleList: 'cms_new/selectArticelListByUserId',
            collection: 'cms_new/queryCollectArtilcelList',
            visitedInfo: 'cms_new/nearThirtyDayArticleList',
            questionL: 'cms_new/questionList',
            todoAnswer: 'cms_new/waitForAnswerList',
            doneAnswer: 'cms_new/answeredList',
            voteList: 'cms_new/voteList',
            tpiVoteList: 'cms_new/participateVoteList'
        }
        this.articleData = {
            pagination: { 
                page : 1,
                rows : this.rows
            },
            releaseId: this.userId,
            typeCode: 1001
        }
        this.quesData = {
            userId: this.userId,
            isExamine: 1,
            IsDraft: 0,
            pagination:{
                page: 1,
                rows: this.rows
            }            
        }
        this.answerD = {
            userId: this.userId,
            pagination: {
                page: 1,
                rows: this.rows
            }  
        }
        this.voteData = {
            userId: this.userId,
            isExamine: 1,
            IsDraft: 0,
            pagination: {
                page: 1,
                rows: this.rows
            }
        }
        this.tpiVoteD = {
            userId: this.userId,
            pagination: {
                page: 1,
                rows: this.rows
            }
        }
        this.collectData = {
            userId: this.userId,
            pagination: { 
                page : 1,
                rows : this.rows
            }
        }
    }
})
$.platform.prototype = {
    getArticleList: function(myUrl, d, tplHtml, listType) {
        var _this = this;
        if(listType == 1005) {
            $('#quesTab').show();
            $('#voteTab').hide();
        } else if(listType == 1007) {
            $('#quesTab').hide();
            $('#voteTab').show();
        } else {
            $('#quesTab').hide();
            $('#voteTab').hide();
        }
        reqAjaxAsync(myUrl, d).done(function(res){
            if(res.code != 1) {return layer.msg(res.msg)};
            if(res.code == 1) {
                var data = res.data;
                var total = res.total || '';
                _this.pages = Math.ceil(total / _this.rows);
                _this.pages < 2 ? $('#moreCommentBtn').addClass('hide').removeClass('show') : $('#moreCommentBtn').addClass('show').removeClass('hide'); 
                if(!isNull(data)) {
                    var getTpl = $(tplHtml).html();
                    laytpl(getTpl).render(data, function (html) {
                        $('#articleListBox').append(html);
                    });
                } else {
                    $('#articleListBox').html('<img src="img/zhanwei.png" alt="" style="margin: 100px 0 0 260px;">');
                }
            } 
        })
    },
    getVisitedInfo: function(d, tplHtml) {
        var _this = this;
        reqAjaxAsync(this.url.visitedInfo, d).done(function(res){
            if(res.code != 1) {return layer.msg(res.msg)};
            if(res.code == 1) {
                var data = res.data;
                var total = res.total || '';
                if(!isNull(data)) {
                    var getTpl = $(tplHtml).html();
                    laytpl(getTpl).render(data, function (html) {
                        $('#rVideoList').html(html);
                    });
                    imgCarousel('.visitedArtImgBox');   //启动轮播图
                } else {
                    $('#rVideoList').html('');
                }
            }
        })
    } 
}
$(function(){
    //设置登录状态
    $("#exit").attr('isDraw', 1);

    var start = new $.platform(), tplHtml = '';

    //跳转到关注页面和粉丝页面
    $('#myFollowBox').on('click', '.myFollowTab', function() {
        var typeCode = $(this).attr('typeCode');
        window.location.href = 'myFollow.html?userId=' + start.userId + '&typeCode=' + typeCode;
    })

    if(start.localUserId != start.userId) {
        $('#collectionArt').addClass('hide').removeClass('show');
    } else if(start.localUserId == start.userId) {
        $('#collectionArt').addClass('show').removeClass('hide');
    }

    // 启动导航
    getChannel({
        url: "cms_back/selectAllChannel",
        num: 0,
        dom: $("#navUl")
    });
    $('#commonNavChild').addClass('hide');   //隐藏公用面包屑
    
    //查询我的信息
    getUserInfo();
    
    start.getArticleList(start.url.articleList, start.articleData, '#articleList');  //默认给我的文章

    //近期浏览更多的文章
    start.getVisitedInfo({typeCode: 1001, userId: start.userId}, '#visitedArtList');

    //切换文章、图集、视频nav
    $('#myNav').on('click', 'a', function() {
        $(this).addClass('active').parent().siblings().find('a').removeClass('active');
        start.articleData.typeCode = $(this).attr('typeCode');
        start.articleData.pagination.page = 1;
        $('#articleListBox').html('');
        if(start.articleData.typeCode == 1001) {
            start.getArticleList(start.url.articleList, start.articleData, '#articleList');
            //近期浏览更多的文章
            start.getVisitedInfo({typeCode: $(this).attr('typeCode'), userId: start.userId}, '#visitedArtList');
            $('#hot').addClass('show').removeClass('hide');
        };
        if(start.articleData.typeCode == 1003) {
            start.getArticleList(start.url.articleList, start.articleData, '#videoList');
            //近期浏览更多的视频
            start.getVisitedInfo({typeCode: $(this).attr('typeCode'), userId: start.userId}, '#visitedVideoList');
            $('#hot').addClass('show').removeClass('hide');
        };
        if(start.articleData.typeCode == 1002) {
            start.getArticleList(start.url.articleList, start.articleData, '#imgList');
            //近期浏览更多的图集
            start.getVisitedInfo({typeCode: $(this).attr('typeCode'), userId: start.userId}, '#visitedImgList');
            $('#hot').addClass('show').removeClass('hide');
        };
        if(start.articleData.typeCode == 1005) {
            start.quesData.pagination.page = 1;
            $('#quesTab li[type="2"]').addClass('active').siblings().removeClass('active');
            start.getArticleList(start.url.questionL, start.quesData, '#questionL', 1005);
            //近期浏览更多的提问
            start.getVisitedInfo({typeCode: $(this).attr('typeCode'), userId: start.userId}, '#visitedArtList');
            $('#hot').addClass('show').removeClass('hide');
        }
        if(start.articleData.typeCode == 1007) {
            start.voteData.pagination.page = 1;
            $('#voteTab li[type="1"]').addClass('active').siblings().removeClass('active');
            start.getArticleList(start.url.voteList, start.voteData, '#voteMineList', 1007);
            //近期浏览更多的投票
            start.getVisitedInfo({typeCode: $(this).attr('typeCode'), userId: start.userId}, '#visitedArtList');
            $('#hot').addClass('show').removeClass('hide');
        }
        if(start.articleData.typeCode == '') {
            start.collectData.pagination.page = 1;
            start.getArticleList(start.url.collection, start.collectData, '#collectionList');
            //近期浏览更多为空
            $('#hot').addClass('hide').removeClass('show');
        };
    })
    //点击问答tab栏
    $('#quesTab').on('click', 'li', function() {
        var type = $(this).attr('type');
        $(this).addClass('active').siblings().removeClass('active');
        $('#articleListBox').html('');
        if(type == 1) {
            start.answerD.pagination.page = 1;
            start.getArticleList(start.url.todoAnswer, start.answerD, '#todoAnsTpl', 1005);
        } else if(type == 2) {
            start.quesData.pagination.page = 1;
            start.getArticleList(start.url.questionL, start.quesData, '#questionL', 1005);
        } else if(type == 3) {
            start.answerD.pagination.page = 1;
            start.getArticleList(start.url.doneAnswer, start.answerD, '#doneAnsTpl', 1005);
        }
    })
    //点击投票tab栏
    $('#voteTab').on('click', 'li', function() {
        var type = $(this).attr('type');
        $(this).addClass('active').siblings().removeClass('active');
        $('#articleListBox').html('');
        if(type == 1) {
            start.voteData.pagination.page = 1;
            start.getArticleList(start.url.voteList, start.voteData, '#voteMineList', 1007);
        } else if(type == 2) {
            start.tpiVoteD.pagination.page = 1;
            start.getArticleList(start.url.tpiVoteList, start.tpiVoteD, '#tpiVoteList', 1007);
        }
    })

    //点击查看更多
    $('#moreCommentBtn').click(function() {
        if(!isNull(start.articleData.typeCode)) {
            start.articleData.pagination.page++;
            if(start.articleData.pagination.page > start.pages) {
                layer.msg('没有更多内容了');
                return;
            }
        }
        if(start.articleData.typeCode == 1001) {
            start.getArticleList(start.url.articleList, start.articleData, '#articleList');
        };
        if(start.articleData.typeCode == 1003) {
            start.getArticleList(start.url.articleList, start.articleData, '#videoList');
        };
        if(start.articleData.typeCode == 1002) {
            start.getArticleList(start.url.articleList, start.articleData, '#imgList');
        };
        if(start.articleData.typeCode == 1005) {
            start.answerD.pagination.page++;
            if(start.answerD.pagination.page > start.pages) {
                layer.msg('没有更多内容了');
                return;
            }
            var type = $('#quesTab li.active').attr('type');
            if(type == 1) {
                start.getArticleList(start.url.todoAnswer, start.answerD, '#todoAnsTpl', 1005);
            } else if(type == 2) {
                start.getArticleList(start.url.questionL, start.quesData, '#questionL', 1005);
            } else if(type == 3) {
                start.getArticleList(start.url.doneAnswer, start.answerD, '#doneAnsTpl', 1005);
            }
        }
        if(start.articleData.typeCode == 1007) {
            start.voteData.pagination.page++;
            if(start.voteData.pagination.page > start.pages) {
                layer.msg('没有更多内容了');
                return;
            }
            var type = $('#voteTab li.active').attr('type');
            if(type == 1) {
                start.getArticleList(start.url.voteList, start.voteData, '#voteMineList');
            } else if(type == 2) {
                start.getArticleList(start.url.tpiVoteList, start.voteData, '#tpiVoteList');
            }
        }
        if(start.articleData.typeCode == '') {
            start.collectData.pagination.page++;
            start.getArticleList(start.url.collection, start.collectData, '#collectionList');
        }
    })

    //点击标题如果是我答过的添加参数
    $('#articleListBox').on('click', '.answerTitBox', function() {
        var quesType = $('#quesTab li.active').attr('type');
        if(quesType == 3) {
            var quesHref = $(this).find('a').attr('href') + '&quesType=3';
            $(this).find('a').attr('href', quesHref);
        }
    })

});

//轮播图函数：
function imgCarousel(html) {
    $(html).each(function(i, e) {
        var imgList = $(e).find(".artImgUl");
        var imgs = $(e).find('.artImgUl img');
        var imgsLength = imgs.length;
        imgList.css({
            'width': 80 * imgsLength
        });
        if (imgsLength > 1) {
            var cloneNode = $(e).find('.artImgUl img:first-child').clone(true);
            imgList.css({
                'width': 80 * (imgsLength + 1)
            });
            imgList.append(cloneNode);
            var flag = true;
            var index = 0;

            function circle() {
                imgList.stop().animate({
                    left: 80 * index
                }, 500, function() {
                    flag = true;
                })
            }
            var timer = setInterval(function() {
                index--;
                if (index <= -4) {
                    index = 0;
                    imgList.css("left", 0)
                    index--;
                    circle();
                    return;
                }
                circle();
                return;
            }, 3000)
        }
    })
}

//判断问题状态
function getExamine(isDraft, type, reason) {
    var str = '';
    if(isDraft == 1) {
        // str = '<span class="qGray">草稿</span>';
    } else if(isDraft == 0) {
        switch(type) {
            case 0:
                str = '<span class="answerState ansRed fr"><i class="glyphicon glyphicon-warning-sign"></i>审核未通过</span>';
                break;
            case 2:
                str = '<span class="answerState ansYellow fr"><i class="glyphicon glyphicon-time"></i>审核中</span>';
                break;  
        }
    }
    return str;
}