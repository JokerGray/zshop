var layer = layui.layer,
    laytpl = layui.laytpl;
//初始化富文本编辑器
var editor = KindEditor.create('#applicationform', {
    cssData: 'img { max-width: 100%; }',
    items: [
        "source", "|", "undo", "redo", "|", "preview", "cut", "copy", "paste", "plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright", "justifyfull", "outdent", "subscript", "superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/", "formatblock",
        "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold", "italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "images", "|", "about"
    ],
    filterMode: true,
    htmlTags: {
        font: ['color', 'size', 'face', '.background-color'],
        span: [
            '.color', '.background-color', '.font-size', '.font-family', '.background',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
        ],
        'p,div': [
            'align', '.text-align', '.color', 'css', '.background-color', '.font-size', '.text-decoration', '.vertical-align'
        ],
        table: [
            'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor', 'css',
            '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
            '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
            '.width', '.height', '.border-collapse'
        ],
        'td,th': [
            'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'css',
            '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
            '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
        ],
        a: ['href', 'target', 'name'],
        embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
        img: ['src', 'border', 'alt', 'title', 'align', '.border'],
        'ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': [
            'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
        ],
        pre: ['class'],
        hr: ['class', '.page-break-after'],
        'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del': [],
    },
    resizeType: 1
});
//初始化富文本编辑器
KindEditor.lang({
	images: "插入图片"
});
KindEditor.plugin("images", function (K) {
	var self = this,
		name = "images";
	self.clickToolbar(name, function () {
		if (
			$("#videoProgress")
			.find("b span")
			.html() != "100%" &&
			!isNull(
				$("#videoProgress")
				.find("b")
				.html()
			)
		) {
			return layer.msg("请等待上传完成后再点击上传！");
		}
		layer.msg("正在进行中请耐心等待！~");
		$("#btn").click();
	});
});

$(function() {
    var userId = localStorage.getItem("userId") || "";
    var quesType = GetQueryString("quesType");
    // var articleData = localStorage.getItem("articleData") || "";
    var articleId = GetQueryString('articleId') || ''; //获取url的参数articleId
    var userName = localStorage.getItem('subscriptionName') || ''; //获取缓存的用户信息
    var userImgUrl = localStorage.getItem('subscriptionImgUrl') || ''; //获取缓存的用户信息
    var subscriptionId = localStorage.getItem('subscriptionId') || '';

    //编辑器图片集合
    var imgArr = [];
    var toutiao = function() {
        this.attentionUserId = 0;
        this.rows = 5;
        this.pages = 1;
        this.url = {
            channel: "cms_back/selectAllChannel",
            voteDetail: "cms_new/queryQuestionDetail", //问题详情
            ansUrl: 'cms_new/queryAnswerList',   //回答列表
            sendAns: 'cms_new/publishAnswer',    //回答接口
            videoComment: 'cms_new/selectTimeNewCmsComment',
            videoreply: 'cms_new/addCmsComment',
            addPraise: 'cms_new/addPraiseToCommentNew',
            iscollection: 'cms_new/isArticleCollection',
            collection: 'cms_new/ArticleCollection',
        };
        this.videoData = { //收藏
            userId: userId,
            articleId: GetQueryString("articleId") || ""
        }
        this.ansData = {
            articleId: articleId,
            userId: userId,
            commentId: 0,
            pagination: {
                page: 1,
                rows: this.rows
            }
        };
        this.sendAnsD = {
            previewImgType: 12,
            articleContent: '',
            is_draft: 0,
            releaseId: userId,
            typeCode: 1006,
            releaseType: 0,
            scCmsAnswer: {
                scCmsQuestionArticleId: articleId,
                scCmsAnswerUserId: userId
            },
            subscriptionId: subscriptionId
        }
        this.replyData = { //回复评论交互data
            userId: userId,
            userName: userName,
            userImgUrl: userImgUrl,
            articleId: articleId,
            parentReplyId: 0,
            commentComment: ''
        }
        this.commentData = { //视频评论列表data
            userId: userId,
            articleId: articleId,
            commentId: 0,
            pagination: {
                page: 1,
                rows: 5
            }
        }
        this.replyCommentList = { //评论回复列表
            userId: userId,
            articleId: articleId,
            commentId: 0,
            pagination: {
                page: 1,
                rows: 10
            }
        }
    };
    toutiao.prototype = {
        getVoteDetail: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.voteDetail, d).done(function(res) {
                if (res.code != 1) {
                    layer.msg(res.msg);
                    return false;
                } else {
                    var data = res.data;
                    if (isNull(data)) {
                        // layer.msg('暂无数据');
                        return false;
                    }
                    // 判断是自己得文章 筑城就不显示
                    res.data.releaseId==userId ? $("#FollowAuthor").hide():$("#FollowAuthor").show();
                    var obj = {
                        userAuthorName: data.scSysUser.username || '',
                        scCmsArticleCreateTime: data.releaseTime || '',
                        articleTitle: data.articleTitle || '',
                        videoTagList: label(data.label),
                        articleContent: data.articleContent
                    }
                    for(var key in obj) {
                        $('.' + key).html(obj[key]);
                    }
                    $('.userInfoImgIcon').attr('href', 'myArticle.html?userId=' + res.data.releaseId);
                    $('.articleAvatar').attr('src', data.scSysUser.userpic || 'img/headIcon.png');
                    if (res.data.scSysUser.hasConcern == 0) {
                        $('#FollowAuthor').removeClass('active');
                    } else if (res.data.scSysUser.hasConcern == 1) {
                        $('#FollowAuthor').addClass('active');
                    }
                    $('#FollowAuthor').attr('isFollow', res.data.scSysUser.hasConcern || '0');
                    $('#FollowAuthor').attr('personId', res.data.releaseId || '0');
                    _this.attentionUserId = data.releaseId;
                }
            });
        },
        getAnswer: function(d, flag) {
            var _this = this;
            reqAjaxAsync(this.url.ansUrl, d).done(function(res) {
                if(res.code != 1) {return layer.msg(res.msg)};
                if(res.code == 1) {
                    var data = res.data;
                    var total = res.total || '';
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages < 2 ? $('body .bigComment').hide() : $('body .bigComment').show(); 
                    $(".writerimg span").html(data.length);
                    if(!isNull(data)) {
                        $('.answerTab span').html(data.length + '个回答');
                        var getTpl = $('#answerTpl').html();
                        laytpl(getTpl).render(data, function(html) {
                            $('#answerUl').append(html);
                        });
                        // 回复评论文字过多进行处理
                        var htmlH=$("#answerUl li .answerContent");
                        for(var i=0;i<htmlH.length;i++){
                            if($(htmlH[i]).css("height")>"280px"){
                                $(htmlH[i]).addClass("overHidden");
                                $(htmlH[i]).parents("li").find(".opacityDiv").show();
                                $(htmlH[i]).parents("li").find(".lookmore").show();
                            }
                        }
                        $("#answerUl li .lookmore").each(function(index,item){
                            $(this).click(function(){
                                if($(this).html()=="点击收起"){
                                    $(this).prev(".opacityDiv").show();
                                    $(this).parents("li").find(".lookmore").html("查看更多");
                                    $(this).parents("li").find(".answerContent").addClass("overHidden");
                                }else{
                                    $(this).prev(".opacityDiv").hide();
                                    $(this).parents("li").find(".lookmore").html("点击收起");
                                    $(this).parents("li").find(".answerContent").removeClass("overHidden");
                                }
                            })
                        })
                        
                    } else {
                        // layer.msg('暂无数据');
                    }
                } 
            });
        },
        sendAns: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.sendAns, d).done(function(res) {
                if (res.code != 1) {
                    layer.msg(res.msg);
                    return false;
                } else {
                    layer.msg(res.msg);
                    editor.html('');
                }
            });
        },
        replyComment: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.videoreply, d).done(function(res) {
                layer.msg(res.msg);
                if (res.code != 1) return false;
                if (res.code == 1) {
                    _this.commentData.commentId = 0;
                    _this.commentData.pagination.page = 1;
                    _this.getVideoComment(_this.commentData);
                    $('body .publishCommentInp').val('');
                }
            })
        },
        getVideoComment: function(d) {
            var _this = this;  
            reqAjaxAsync(_this.url.videoComment, d).done(function(res) {    
                if (res.code != 1) return layer.msg(res.msg);
                var total = res.total || '';
                _this.pages = Math.ceil(total / _this.rows);
                console.log(_this.pages);
                _this.pages < 2 ? $('body .smallComment').hide() : $('body #answerUl li[data-id='+_this.commentData.articleId+'] .smallComment').show(); 
                var childTemp="";
                if (res.code == 1) {
                    var data = res.data.scCmsCommentList;
                    if (!isNull(data)) {
                        for(var i=0;i<data.length;i++){
                            var classTab=["","active"];
                            childTemp +='<div class="commentList clearfix" data-flag='+data[i].articleId+'>'
                                           +'<img class="commentatorIcon fl" src="'+data[i].userImgUrl+'" alt="">'
                                            +'<div class="commentLCom fr" id="'+data[i].id+'">'
                                                +'<div class="commentatorMess clearfix">'
                                                    +'<p class="fl">'
                                                        +'<span class="commentatorName">'+data[i].userName+'</span>'
                                                        +'<span>'+data[i].commentTime +'</span>'
                                                    +'</p>'
                                                    +'<p class="fr">'
                                                        +'<span class="commentNum cur-p '+classTab[data[i].isPraise]+'" praise='+data[i].isPraise+'>'+data[i].praiseNumber+'</span>'
                                                        +'<span class="commentReplyText cur-p">回复</span>'
                                                    +'</p>'
                                                +'</div>'
                                                +'<p class="commentContent">'+data[i].commentComment+'</p>'
                                                +'<div class="viewReply cur-p">'
                                                    +'<span>'+data[i].commentReplyNum+'</span>条回复'
                                                    +'<i></i>'
                                                +'</div>'
                                                // +'<div class="smallRep">'
                                                // +'</div>'
                                                +'<div class="viewReplyList show"></div>'
                                                +'<p id="moreCommentBtn" class="moreCommentBtn cur-p supersmallComment" style="display:none;">点击换一波评论看看</p>'
                                            +'</div>'
                                        +'</div>' 

                        }
                        $("body #answerUl li[data-id="+_this.commentData.articleId+"] #childAn .childBox").html(childTemp); 
                    }else{
                        layer.msg("没有更多评论了");
                    }
                }
            })
        },
        addComment: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.videoComment, d).done(function(res) {
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
    $("#navChildA").html("提问");
    // 启动导航
    getChannel({
        url: homepage.url.channel,
        num: 0,
        dom: $("#navUl")
    });
    homepage.getVoteDetail({
        userId: userId,
        articleId: articleId
    });   
    homepage.getAnswer(homepage.ansData, false); 
 
    if(quesType == 3) {
        $('.editorBox').hide();
    }
    // 富文本编辑器上传图片
	uploadOss({
		btn: "btn",
		imgArr: imgArr,
		editor: editor,
		flag: "sendQues"
	});

    $('#voteListBox').on('click', '.radio', function() {
        $(this).addClass('checked').parent().siblings().find('.radio').removeClass('checked');
    })
    //点击发送答案
    $('#editorBtn').click(function() {
        if(isNull(editor.html())) {
            layer.msg('请填写回答！');
            return false;
        }
        homepage.sendAnsD.articleContent = editor.html();
        if(isNull(homepage.sendAnsD.subscriptionId)){
            layer.msg("当前版本只有作家才有权限回答问题，请前往 http://writer.izxcs.com 申请智享头条号 ");
        }else{
            homepage.sendAns(homepage.sendAnsD);
            homepage.ansData.pagination.page = 1;
            homepage.getAnswer(homepage.ansData, false); 
        }
    })
    //点击发布回答列表的回复
    $("body").on("click",".reply ",function(){
        var addReply =$("#addReply").html();
        $("body .answerBox .wrapReply").remove();
        $("body .answerBox #childAn .childBox").html("");
        $(this).closest("li").find(".smallComment").hide();
        $(this).closest(".answerBox>div").after(addReply);
    })

    //点击更多按钮获取更多答案
    //查看更多回答按钮smallComment
    $('body').on("click",".smallComment",function() {
        // 把点击的data-id存缓存，在getVideoComment方法里面判断当前smallComment是否出现
        homepage.ansData.pagination.page++;
        homepage.ansData.articleId=$(this).parents("li").attr("data-id");
        //查看回答列表
        homepage.getVideoComment(homepage.ansData, true);
    })

    //查看更多回答按钮bigComment
    $('body').on("click",".bigComment",function() {
        homepage.ansData.pagination.page++;
        //查看回答列表
        homepage.getVideoComment(homepage.ansData, true);
    })

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
                    homepage.getVoteDetail({
                        userId: userId,
                        articleId: articleId
                    });
                });
            } else if (isFollow == 1) {
                isFollowState({
                    url: "delCocernRela",
                    data: data
                }, function() {
                    homepage.getVoteDetail({
                        userId: userId,
                        articleId: articleId
                    });
                });
            }
        }
    });

    //点击回答列表中关注按钮
    $('body').on('click', '.answerList .follow', function() {
        //isSubscribe   1是  0否
        if (isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            var isFollow = $(this).attr('isFollow');
            var personId = $(this).closest("li").attr('data-id');
            var _this = this;
            console.log(personId);
            if (isFollow == 0) {
                isFollowFunc({
                    url: "addCocernRela",
                    d: {
                        "appName": "24",
                        "busiId": personId,
                        "busiType": 0,
                        "userId": userId
                    },
                    html: _this
                })
            } else if (isFollow == 1) {
                isFollowFunc({
                    url: "delCocernRela",
                    d: {
                        "appName": "24",
                        "busiId": personId,
                        "busiType": 0,
                        "userId": userId
                    },
                    html: _this
                })
            }
        }
    })
    // 点赞的接口
    // var homepage=new toutiao();   
    $('body').on('click', '.commentNum', function() {
        if(isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            if ($(this).attr('praise') == 1) {
                layer.msg('已经点过赞啦!');
            } else if ($(this).attr('praise') == 0) {
                var data = {
                    userId: userId,
                    userName: userName,
                    userImgUrl: userImgUrl,
                    commentId: $(this).parent().parent().parent().attr('id')
                }
                reqAjaxAsync(homepage.url.addPraise, data).done(function(res) {
                    if (res.code != 1) return false;
                    if (res.code == 1) {
                        homepage.commentData.commentId = 0;
                        homepage.commentData.pagination.page = 1;
                        homepage.getVideoComment(homepage.commentData);
                    }
                })
            }
        }
    })

    // 子评论点击回复出出现发布评论框
    $("body").on("click","#answerUl li .commentReplyText",function(){
        if(isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            console.log(1);
            $('body #commentBox').find('.commentReplyBox').remove();
            var getTpl = $('#replyCommentCase').html();
            $(this).closest(".commentList").find(".viewReplyList").append(getTpl);
        }
    })
    //点击发布评论的按钮;
    $("body").on("click","#commentBox .sendMsg",function(){
        //获取自评论的articleId
        if(isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        } else {
            var childId=$(this).parents(".commentList").attr("data-flag");
            var sendCom = $(this).parents(".commentList").find('.replyCommentArea').val().trim();
            var replyId = $(this).closest(".commentList").find(".commentLCom").attr('id');
            if (!isNull(sendCom)) {
                homepage.replyData.commentComment = sendCom;
                homepage.replyData.parentReplyId = replyId;
                homepage.replyData.articleId = childId;
                homepage.replyComment(homepage.replyData);
            } else {
                layer.msg('请先填写评论');
            }
        }
    })
    // 点击子评论多少条回复，获取子子评论列表
    $("body").on("click",".commentList .viewReply",function(){
        if ($(this).find('span').html() == 0) {
            return layer.msg('并没有什么回复')
        };
        if ($(this).find('span').html() > 0) {
            var replyId = $(this).parent().attr('id');
            var pid = $(this).closest(".commentList").attr("data-flag");
            homepage.replyCommentList.commentId = replyId;
            homepage.replyCommentList.articleId = pid;
            var viewReplyListHtml=$(this).next(".viewReplyList ").html();
            if(!isNull(viewReplyListHtml)){
                $(this).next(".viewReplyList ").toggleClass("show").toggleClass("hide");
            }else{
                reqAjaxAsync(homepage.url.videoComment, homepage.replyCommentList).done(function(res) {
                    if (res.code != 1) {
                        return layer.msg(res.msg);
                    };
                    var data = res.data.scCmsCommentList;
                    if (!isNull(data)) {
                        var total = res.total || '';
                        homepage.pages = Math.ceil(total / homepage.rows);
                        homepage.pages < 2 ? $('body .supersmallComment').hide() : $('body #answerUl li[data-id='+_this.commentData.articleId+'] .supersmallComment').show(); 
                        var childArr=""
                        var classTab=["","active"];
                        for(var i=0;i<data.length;i++){
                            childArr +=   '<div class="commentList clearfix" style="margin: 10px 0;">'
                                            +'<img class="commentatorIcon fl" src="'+data[i].userImgUrl+'" alt="">'
                                            +'<div class="commentLCom fr" id="'+data[i].id+'">'
                                                +'<div class="commentatorMess clearfix">'
                                                    +'<p class="fl">'
                                                        +'<span class="commentatorName">'+data[i].userName+'</span>'
                                                        +'<span>'+data[i].commentTime+'</span>'
                                                    +'</p>'
                                                    +'<p class="fr">'
                                                        +'<span class="commentNum cur-p '+classTab[data[i].isPraise]+'" praise='+data[i].isPraise+'>'+data[i].praiseNumber+'</span>'
                                                    +'</p>'
                                                +'</div>'
                                                +'<p class="commentContent">'+data[i].commentComment+'</p>'
                                            +'</div>'
                                        +'</div>'
                        }
                        $("body #commentBox").find(".commentLCom[id="+replyId+"]").find(".viewReplyList").html(childArr);
                    }
                })
            }
           
        }
    })

    //点击发布按钮发布评论
    $("body").on("click","#answerUl li .sendInfo",function(){
        var arId=$(this).parents("li").attr("data-id");
        if(isNull(userId) || userId == 1) {
            $('.userOperate span:first-child').click();
            layer.msg('请先登录');
        }else{
            var publishCom = $(this).parents("li").find('.publishCommentInp').val().trim();
                if (!isNull(publishCom)) {
                    homepage.replyData.commentComment = publishCom;
                    homepage.replyData.parentReplyId = 0,
                    homepage.replyData.articleId=arId,
                    homepage.commentData.articleId=arId;
                    homepage.replyComment(homepage.replyData);
                } else {
                    layer.msg('请先填写评论');
                }
        }
    })
    // 点击评论显示列表
    $("body").on("click","#answerUl li .commentNnm",function(){
        if ($(this).find('span').html() == 0) {
            return layer.msg('并没有什么评论')
        }else{
            var htmlchildAn= $(this).closest("li").find("#childAn .childBox").html()
            $("body #answerUl li").find(".wrapReply").html("");
            if(!isNull(htmlchildAn)){
                $(this).closest("li").find("#childAn").toggleClass("show").toggleClass("hide");
            }else{
                var arId =$(this).parents("li").attr("data-id");
                homepage.ansData.articleId=arId;
                homepage.ansData.pagination.page=1;
                homepage.commentData.articleId=arId;
                homepage.getVideoComment(homepage.ansData, true);
            }
        }
    })
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
    //js over
});

//问题详情中的标签
function label(d) {
    var quesLabel = (d).trim(), labelArr = [], quesLabelList = '';
    quesLabel = quesLabel.charAt(quesLabel.length - 1) == ',' ? quesLabel.slice(0, -1) : quesLabel;
    labelArr = quesLabel.split(',');
    if(!isNull(labelArr)) {
        $.each(labelArr, function(i, e) {
            quesLabelList += '<li>'+ e +'</li>';
        })
    }
    return quesLabelList;
}

//关注回答列表的关注按钮
function isFollowFunc(obj) {
    reqAjaxAsync("concern/" + obj.url, obj.d).done(function(res) {
        layer.msg(res.msg);
        if (res.code == 1) {
            $(obj.html).toggleClass('active');
            if(obj.url == "addUserAttention") {
                $(obj.html).attr('isFollow', 1);
            } else {
                $(obj.html).attr('isFollow', 0);
            }
        }
    })
}

