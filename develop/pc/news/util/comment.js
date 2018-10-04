var layer = layui.layer,
    laytpl = layui.laytpl;
$(function() {
    var commentFunc = new comment();
    if(!isNull(commentFunc.userImgUrl)) {
        $('#userImgIcon').attr('src', commentFunc.userImgUrl);
    }
    //获取视频评论
    commentFunc.getVideoComment(commentFunc.commentData);
    //点击查看更多查看更多评论
    $('#moreCommentBtn').click(function() {
        commentFunc.commentData.commentId = 0;
        commentFunc.commentData.pagination.page++;
        commentFunc.addComment(commentFunc.commentData);
    });
    //点击发布按钮发表评论
    $('#commentPublishBtn').click(function() {
        if(isNull(commentFunc.userId) || commentFunc.userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            var publishCom = $('#publishCommentInp').val().trim();
            if (!isNull(publishCom)) {
                commentFunc.replyData.commentComment = publishCom;
                commentFunc.replyData.parentReplyId = 0,
                commentFunc.replyComment(commentFunc.replyData);
            } else {
                layer.msg('请先填写评论');
            }
        }
    });
    //点击回复按钮显示回复框
    $('#commentBox').on('click', '.commentReplyText', function() {
        if(isNull(commentFunc.userId) || commentFunc.userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            $('#commentBox').find('.commentReplyBox').remove();
            var getTpl = $('#replyCommentCase').html();
            $(this).parent().parent().parent().append(getTpl);
        }
    });
    //点击回复评论按钮回复评论
    $('#commentBox').on('click', '.sendReplycomment', function() {
        if(isNull(commentFunc.userId) || commentFunc.userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            var sendCom = $(this).parent().siblings('.replyCommentArea').val().trim();
            var replyId = $(this).parent().parent().parent().attr('id');
            if (!isNull(sendCom)) {
                commentFunc.replyData.commentComment = sendCom;
                commentFunc.replyData.parentReplyId = replyId;
                commentFunc.replyComment(commentFunc.replyData);
            } else {
                layer.msg('请先填写评论');
            }
        }
    });
    //点击查看回复查看回复评论列表
    $('#commentBox').on('click', '.viewReply', function() {
        if ($(this).find('span').html() == 0) {
            return layer.msg('并没有什么回复')
        };
        if ($(this).find('span').html() > 0) {
            if ($(this).siblings('.viewReplyList').html()) {
                $(this).siblings('.viewReplyList').toggleClass('show').toggleClass('hide');
            } else {
                var replyId = $(this).parent().attr('id');
                commentFunc.replyCommentList.commentId = replyId;
                var _this = this;
                reqAjaxAsync(commentFunc.Request.videoComment, commentFunc.replyCommentList).done(function(res) {
                    if (res.code != 1) {
                        return layer.msg(res.msg)
                    };
                    var data = res.data.scCmsCommentList;
                    if (!isNull(data)) {
                        var getTpl = $('#viewReplyList').html();
                        laytpl(getTpl).render(data, function(html) {
                            $(_this).siblings('.viewReplyList').html(html);
                        });
                    }
                })
            }

        }
    });
    //点赞评论
    $('#commentBox').on('click', '.commentNum', function() {
        if(isNull(commentFunc.userId) || commentFunc.userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            if ($(this).attr('praise') == 1) {
                layer.msg('已经点过赞啦!');
            } else if ($(this).attr('praise') == 0) {
                var data = {
                    userId: commentFunc.userId,
                    userName: commentFunc.userName,
                    userImgUrl: commentFunc.userImgUrl,
                    commentId: $(this).parent().parent().parent().attr('id')
                }
                reqAjaxAsync(commentFunc.Request.addPraise, data).done(function(res) {
                    if (res.code != 1) return false;
                    if (res.code == 1) {
                        commentFunc.commentData.commentId = 0;
                        commentFunc.commentData.pagination.page = 1;
                        commentFunc.getVideoComment(commentFunc.commentData);
                    }
                })
            }
        }
    });
});
var comment = function() {
    this.articleId = GetQueryString('articleId') || ''; //获取url的参数articleId
    this.userId = localStorage.getItem('userId') || ''; //获取缓存的用户信息
    this.userName = localStorage.getItem('subscriptionName') || ''; //获取缓存的用户信息
    this.userImgUrl = localStorage.getItem('subscriptionImgUrl') || ''; //获取缓存的用户信息
    this.Request = {
        videoComment: 'cms_new/selectTimeNewCmsComment',
        videoreply: 'cms_new/addCmsComment',
        addPraise: 'cms_new/addPraiseToCommentNew'
    }
    this.commentData = { //视频评论列表data
        userId: this.userId,
        articleId: this.articleId,
        commentId: 0,
        pagination: {
            page: 1,
            rows: 5
        }
    }
    this.replyCommentList = { //评论回复列表
        userId: this.userId,
        articleId: this.articleId,
        commentId: 0,
        pagination: {
            page: 1,
            rows: 10
        }
    }
    this.replyData = { //回复评论交互data
        userId: this.userId,
        userName: this.userName,
        userImgUrl: this.userImgUrl,
        articleId: this.articleId,
        parentReplyId: 0,
        commentComment: ''
    }
};
comment.prototype = {
    constructor: $.platform,
    replyComment: function(d) {
        var _this = this;
        reqAjaxAsync(_this.Request.videoreply, d).done(function(res) {
            layer.msg(res.msg);
            if (res.code != 1) return false;
            if (res.code == 1) {
                _this.commentData.commentId = 0;
                _this.commentData.pagination.page = 1;
                _this.getVideoComment(_this.commentData);
                $('#publishCommentInp').val('');
            }
        })
    },
    getVideoComment: function(d) {
        var _this = this;
        reqAjaxAsync(_this.Request.videoComment, d).done(function(res) {
            if (res.code != 1) return layer.msg(res.msg);;
            if (res.code == 1) {
                var data = res.data.scCmsCommentList;
                if (!isNull(data)) {
                    var getTpl = $('#videoCommentTpl').html();
                    laytpl(getTpl).render(data, function(html) {
                        $('#commentBox').html(html);
                    });
                }
            }
        })
    },
    addComment: function(d) {
        var _this = this;
        reqAjaxAsync(_this.Request.videoComment, d).done(function(res) {
            layer.msg(res.msg);
            if (res.code != 1) return false;
            if (res.code == 1) {
                var data = res.data.scCmsCommentList;
                if (!isNull(data)) {
                    var getTpl = $('#videoCommentTpl').html();
                    laytpl(getTpl).render(data, function(html) {
                        $('#commentBox').append(html);
                    });
                } else {
                    layer.msg('没有更多评论了!');
                }
            }
        })
    }
}