(function($) {
    var userId = localStorage.getItem('userId'); //(查询评论表，添加)
    var pageNo = 1; //(查询评论表)
    var pageSize = 10; //(查询评论表)
    var userName = localStorage.getItem('subscriptionName'); //(添加)
    var userImgUrl = localStorage.getItem('subscriptionImgUrl'); //(添加)
    var REQUEST_URL = {
        SELECTDETAIL: 'cms_new/selectTimeNewCmsCommentByArticle', //查询评论表
        ADDCOMMENT: 'cms_new/addCmsComment  ', //回复
        DETELECOMMENT: 'cms_new/delNewCmsComment' //删除
    };

    //发送输入框
    var inputHtml = '<div class="comment-reply-body">' +
        '<textarea placeholder="回复该评论！"></textarea>' +
        '<div class="comment-reply-btn"><span class="comment-reply-send">发送</span></div>' +
        '</div>';

    $(".comment-body").on("click", ".comment-detail .comment-reply", function() {
        var val = $(this).find("span").text();
        if (val == "回复") {
            $(this).find("span").text("收起");
            $(this).after(inputHtml);
        } else {
            $(this).find("span").text("回复");
            $(".comment-reply-body").remove();
        }
    });

    //评论列表
    function commentDetail(res) {
        var sHtml = "";
        if (res.code == 1) {
            var rows = res.data;
            for (var i = 0; i < rows.scCmsCommentList.length; i++) {
                var row = rows.scCmsCommentList[i];
                sHtml += '<div class="comment-detail" data-serviceId="' + row.id + '">' +
                    '<div class="comment-head-body" data-id="' + row.id + '">' +
                    '<div class="comment-head-toux">' +
                    '<img src="' + row.userImgUrl + '">' +
                    '</div>' +
                    '<div class="comment-head-info">' +
                    '<div class="comment-head-name"><span>' + row.userName +
                    '</span><span class="comment-head-date">' + row.commentTime +
                    '</span></div>' +
                    '<div class="comment-head-text">' + row.commentComment + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="comment-center-text">评论我的文章：<a data-articId = "' + row.article.articleId + '">' + row.articleTitle + '</a></div>' +
                    '<div class="comment-message comment-message2">' +
                    '<i class="icon-praise"></i>' +
                    '<span class="comment-message-num">' + row.praiseNumber + '</span>' +
                    '</div>' +
                    '<div class="comment-message">' +
                    '<i class="icon-message"></i>' +
                    '<span class="comment-message-num">' + row.commentReplyNum + '</span>' +
                    '</div>' +
                    '<div class="comment-reply2"><span class="comment-head-action2" data-userId="' + row.userId + '">删除</span></div>' +
                    '<div class="comment-reply mr20"><span>回复</span></div>' +
                    '<div class="comment-detail-lists">' +
                    '<div class="comment-detail-infos"></div>' +
                    '</div>' +
                    '</div>';
            }
            $(".comment-body").html(sHtml);

        } else {
            console.log(res.msg);
        }
    }


    //加载接口
    function getDetail() {
        var paramSelect = "{'userId':" + userId + ",'commentId':" + '0' + ",'pagination':{'page':" + pageNo + ",'rows':" + pageSize + "}}"; //(查询评论表)
        reqAjaxAsync(REQUEST_URL.SELECTDETAIL, paramSelect).then(function(res) {
            commentDetail(res);
            if (res.total > 0) {
                $("#page-selection").bootpag({
                    total: Math.ceil(res.total / pageSize),
                    page: 1,
                    maxVisible: 5
                }).on('page', function(event, num) {
                    var paramSelect = "{'userId':" + userId + ",'pagination':{'page':" + num + ",'rows':" + pageSize + "}}"; //(查询评论表)
                    reqAjaxAsync(REQUEST_URL.SELECTDETAIL, paramSelect).then(function(res) {
                        commentDetail(res);
                    })
                }).show();
            } else {
                $('#page-selection').hide();
                $(".comment-body").text("暂无评论");
                $(".comment-body").css("text-align", "center");
            }
        });
    }
    getDetail();

    //第二层评论
    function smallDetail(res, eve) {
        var sHtml = "";
        if (res.code == 1) {
            var rows = res.data;
            for (var i = 0; i < rows.scCmsCommentList.length; i++) {
                var row = rows.scCmsCommentList[i];
                sHtml += '<div class="comment-head-body" " data-id="' + row.id + '">' +
                    '<div class="comment-head-toux"><img src="' + row.userImgUrl + '"></div>' +
                    '<div class="comment-head-info">' +
                    '<div class="comment-head-name"><span>' + row.userName + '</span><span class="comment-head-action">删除</span></div>' +
                    ' <div class="comment-head-text">' + row.commentComment + '</div>' +
                    '</div>' +
                    '</div>';
            }
            eve.siblings(".comment-detail-lists").find(".comment-detail-infos").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }

    //点击加载第二层评论
    $(".comment-body").on("click", ".comment-detail .comment-message", function() {
        var _this = this;
        var val = $(this).attr("class");
        var commentId = $(this).parent(".comment-detail").attr("data-serviceId");
        if (val == "comment-message") {
            var paramSmal = "{'userId':" + userId + ",'commentId':'" + commentId + "','pagination':{'page':" + pageNo + ",'rows':" + pageSize + "}}"; //(查询评论表)
            reqAjaxAsync(REQUEST_URL.SELECTDETAIL, paramSmal).then(function(res) {
                if (res.code == 1) {
                    $(_this).addClass("actve");
                    $(_this).siblings(".comment-detail-lists").show();
                    smallDetail(res, $(_this));
                    if (res.total == 0) {
                        $(_this).siblings(".comment-detail-lists").find(".comment-detail-infos").text("暂无评论")
                    }
                } else {
                    layer.msg(res.msg);
                }
            })
        };
        if (val == "comment-message actve") {
            $(_this).removeClass("actve");
            $(".comment-detail-lists").hide();
        };
    });

    //删除评论方法
    function delComment(eve) {
        var commentId = eve.parents(".comment-head-body").attr("data-id");
        var length = eve.parents(".comment-detail-infos").find(".comment-head-body").length;
        var paramDel = "{'commentId':'" + commentId + "','userId':'" + userId + "'}";
        reqAjaxAsync(REQUEST_URL.DETELECOMMENT, paramDel).then(function(res) {
            var part = eve.parents(".comment-detail-lists").siblings(".comment-message").find(".comment-message-num");
            var leng = part.text();
            if (res.code == 1) {
                eve.parents(".comment-head-body").hide();
                length--;
                if (length == 0) {
                    eve.parents(".comment-detail-lists").siblings(".comment-message").removeClass("actve");
                    $(".comment-detail-lists").hide();
                    $("#page6").css("display", "none")
                }
                eve.parents(".comment-head-body").remove();
            } else {
                layer.msg(res.msg);
            }
        });
    }

    // 删除第一级评论
    function delTopComment(eve) {
        var commentId = eve.parents(".comment-detail").attr("data-serviceid");
        var topUserId = eve.attr("data-userId");
        var paramDel = JSON.stringify({
            commentId: commentId,
            userId: topUserId
        });
        reqAjaxAsync(REQUEST_URL.DETELECOMMENT, paramDel).then(function(res) {
            if (res.code == 1) {
                eve.parents(".comment-detail").remove();
            } else {
                layer.msg(res.msg);
            }
        });
    }

    // 删除第一级评论
    $(".comment-body").on("click", ".comment-head-action2", function() {
        delTopComment($(this));
    });

    // 删除评论
    $(".comment-body").on("click", ".comment-head-action", function() {
        delComment($(this));
    });


    //回复评论方法
    function reply(eve, parentEve) {
        var articleId = eve.parents(".comment-reply-body").siblings(".comment-center-text").find("a").attr("data-articId");
        var parentReplyId = eve.parents(".comment-detail").attr("data-serviceId");
        var commentComment = eve.parent().prev().val();
        var commentId = eve.parents(".comment-detail").attr("data-serviceid");
        var paramReply = "{'userId':" + userId + ",'userName':'" + userName + "','userImgUrl':'" + userImgUrl + "','articleId':" + articleId + ",'parentReplyId':'" + parentReplyId + "','commentComment':'" + commentComment + "'}";
        reqAjaxAsync(REQUEST_URL.ADDCOMMENT, paramReply).then(function(res) {
            if (res.code == 1) {
                eve.parents(".comment-reply-body").siblings(".comment-reply").find("span").text("回复");
                var paramSmal = "{'userId':" + userId + ",'commentId':'" + parentReplyId + "','pagination':{'page':" + pageNo + ",'rows':" + pageSize + "}}"; //(查询评论表)
                reqAjaxAsync(REQUEST_URL.SELECTDETAIL, paramSmal).then(function(req) {
                    if (req.code == 1) {
                        eve.parents(".comment-reply-body").siblings(".comment-message").addClass("actve");
                        smallDetail(req, parentEve);
                        eve.parents(".comment-reply-body").siblings(".comment-detail-lists").show();
                        $(".comment-reply-body").remove();
                    } else {
                        layer.msg(req.msg);
                    }
                });
            } else {
                layer.msg(res.msg);
            }
        })
    }

    $(".comment-body").on("click", ".comment-reply-body .comment-reply-send", function() {
        var parentEve = $(this).parents(".comment-reply-body");
        reply($(this), parentEve);
    });

    //点击文章标题跳到详情页
    $(".comment-body").on("click", ".comment-center-text a", function() {
        var articleId = $(this).attr("data-articid");
        location.href = "articleDetail.html?articleId=" + articleId;
    });
})(jQuery);