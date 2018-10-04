var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl,
    userId = localStorage.getItem("userId") || '',
    form = layui.form();
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
KindEditor.plugin("images", function(K) {
    var self = this,
        name = "images";
    self.clickToolbar(name, function() {
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
var answerUrl = {
    quesList: 'cms_new/waitForAnswerList'
}

function todoAnswer() {
    this.rows = 5;
    this.pages = 1;
    this.answerRows = 5;
    this.url = {
        quesList: 'cms_new/waitForAnswerList',
        questionDetail: 'cms_new/queryQuestionDetail',
        answerList: 'cms_new/answerList',
        sendAnswer: 'cms_new/publishAnswer',
        getAnsDetail: 'cms_new/queryAnswerDetail',
        updateAns: 'cms_new/updateAnswer'
    }
    this.quesListD = {
        userId: userId,
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
    this.quesDetailData = {
        scCmsMacId: "",
        userId: userId,
        articleId: ""
    }
    this.answerData = {
        articleId: "",
        userId: userId,
        pagination: {
            page: 1,
            rows: this.answerRows
        }
    }
}
todoAnswer.prototype = {
    questionList: function(d, flag) { //问题列表
        var _this = this;
        reqAjaxAsync(this.url.quesList, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                $("#quesMineList").html('');
                $('#qPage').hide();
                return layer.msg(res.msg);
            };
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var getTpl = $("#questionL").html();
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages > 1 ? $('#qPage').show() : $('#qPage').hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#quesMineList").html(html);
                    });
                    imgCarousel(".quesMImgListBox");
                    return flag ? _this.getPage(_this.pages, d) : false;
                } else {
                    return layer.msg("暂无数据");
                    $("#quesMineList").html('');
                    $('#qPage').hide();
                }
            }
        })
    },
    getPage: function(pages, d) { //获取分页
        var _this = this;
        laypage({
            cont: 'qPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#ff8b6f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.questionList(d, false);
            }
        });
    },
    quesDetail: function(d) { //问题详情
        var _this = this;
        reqAjaxAsync(this.url.questionDetail, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg);
            }
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var obj = {
                        quesTitle: '<span class="quesIcon">问答</span>' + data.articleTitle || '',
                        quesCont: data.articleContent || '',
                        authorName: !isNull(data.scCmsSubscription) ? data.scCmsSubscription.subscriptionName : '',
                        quesTime: data.releaseTime || '',
                        quesLabelList: label(data.label || '')
                    }
                    for (var key in obj) {
                        $('.quesInfoTpl .' + key).html(obj[key]);
                    }
                } else {
                    return layer.msg("暂无数据");
                }
            }
        })
    },
    answerList: function(d, flag) { //回答列表
        var _this = this;
        reqAjaxAsync(this.url.answerList, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                $("#answerUl").html('');
                return layer.msg(res.msg);
            };
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                $('.infoAnswerTab .infoMyAns').html(total + '个回答');
                total == 0 ? $('.answerList').hide() : $('.answerList').show();
                if (!isNull(data)) {
                    var getTpl = $("#answerTpl").html();
                    _this.answerPages = Math.ceil(total / _this.answerRows);
                    _this.answerPages == _this.answerData.pagination.page ? $('#moreAnsBtn').hide() : $('#moreAnsBtn').show();
                    laytpl(getTpl).render(data, function(html) {
                        if (flag) {
                            $("#answerUl").append(html);
                        } else {
                            $("#answerUl").html(html);
                        }
                    });
                } else {
                    $("#answerUl").html('');
                }
            }
        })
    },
    sendAns: function(d) { //发布回答
        var _this = this;
        reqAjaxAsync(this.url.sendAnswer, JSON.stringify(d)).done(function(res) {
            layer.msg(res.msg);
            if (res.code == 1) {
                editor.html('');
                $('#quesInfo .close').click();
                _this.quesListD.pagination.page = 1;
                _this.questionList(_this.quesListD, true);
            }
        })
    }, 
    updateAns: function(d) {   //修改回答
        var _this = this;
        reqAjaxAsync(this.url.updateAns, JSON.stringify(d)).done(function(res) {
            layer.msg(res.msg);
            if (res.code == 1) {
                var ansHrefPath = window.document.location.pathname;
                var ansHArr = ansHrefPath.split('/');
                if(ansHArr.length == 2) {
                    window.location.href = '/done_answer.html';
                } else if(ansHArr.length > 2) {
                    window.location.href = ansHrefPath.substring(0, ansHrefPath.indexOf(ansHArr[ansHArr.length - 1])) + 'done_answer.html';
                }
            }
        })
    }
}
$(function() {
    //编辑器图片集合
    var imgArr = [];
    var modalOperArr = ['.quesInfoBox', '.infoAnswerBox', '#editorBtn'];
    //获取所有信息
    var articleData = localStorage.getItem("articleData") || "";
    var articleDataObj = JSON.parse(articleData);
    //头条号id
    var subscriptionId = articleDataObj.subscriptionId || "";
    //发布人类型
    var subscriptionType = localStorage.getItem("subscriptionType");
    var articleId = '';
    //链接参数
    var questionId = GetQueryString('questionId');
    var answerId = GetQueryString('answerId');
    // 富文本编辑器上传图片
    uploadOss({
        btn: "btn",
        imgArr: imgArr,
        editor: editor,
        flag: "send"
    });
    var todoAnswerObj = new todoAnswer();
    todoAnswerObj.questionList(todoAnswerObj.quesListD, true);
    if(!isNull(questionId) && !isNull(answerId)) {
        $('#quesInfo').modal();
        $.each(modalOperArr, function(i, e) {
            $(e).show();
        })
        $('.modalOperBox').hide();
        todoAnswerObj.quesDetailData.articleId = questionId;
        todoAnswerObj.answerData.articleId = questionId;
        todoAnswerObj.quesDetail(todoAnswerObj.quesDetailData);
        //查看回答列表
        todoAnswerObj.answerList(todoAnswerObj.answerData, false);
        //答案内容
        reqAjaxAsync(todoAnswerObj.url.getAnsDetail, JSON.stringify({userId: userId,articleId: answerId})).done(function(res) {
            layer.msg(res.msg);
            if (res.code == 1) {
                editor.html(res.data.articleContent || '');
            }
        })
        $('#editorBtn').attr('update', 1);
    }
    // 点击标题
    $('#quesMineList').on('click', '.quesTit', function() {
        editor.html('');
        articleId = $(this).attr('articleId');
        $.each(modalOperArr, function(i, e) {
            $(e).show();
        })
        $('.modalOperBox').hide();
        todoAnswerObj.quesDetailData.articleId = articleId;
        todoAnswerObj.answerData.articleId = articleId;
        todoAnswerObj.quesDetail(todoAnswerObj.quesDetailData);
        //查看回答列表
        todoAnswerObj.answerList(todoAnswerObj.answerData, false);
        $('#editorBtn').attr('update', 0);
    })
    // 点击回答按钮
    $('#quesMineList').on('click', '.inviAnsBtn', function() {
        editor.html('');
        articleId = $(this).attr('articleId');
        quesTit = $(this).parent().siblings('.quesMineInfo').find('.quesTit').html();
        $('.quesTitle').html('<img class="quesTitleIcon" src="images/quesIconB.png">' + quesTit);
        $.each(modalOperArr, function(i, e) {
            $(e).hide();
        })
        $('.modalOperBox').show();
    });
    //点击发送回答
    $('#editorBtn').click(function() {
        var update = $(this).attr('update');
        if(update == 1) {
            sendAnswerFunc(update, answerId);
        } else if(update == 0) {
            sendAnswerFunc(update, articleId);
        }
    })
    $('#modalPublishBtn').click(function() {
        sendAnswerFunc(0, articleId);
    })
    //查看更多回答按钮
    $('#moreAnsBtn').click(function() {
        todoAnswerObj.answerData.pagination.page++;
        //查看回答列表
        todoAnswerObj.answerList(todoAnswerObj.answerData, true);
    })
    // 发送答案func
    function sendAnswerFunc(isUpdate, releaseId) {
        var editorHtml = editor.html();
        if (isNull(editorHtml)) {
            layer.msg('请输入答案!');
            return false;
        }
        if(isUpdate == 0) {
            var editorData = {
                previewImgType: 12, //普通无图,
                articleContent: editorHtml, //"问答内容"
                is_draft: 0, //"是否草稿：0，否；1，是",
                releaseId: userId, //"发布人主键
                typeCode: 1006, //答案"
                releaseType: subscriptionType, //"发布人的类型(0:作者;1:商家)
                scCmsAnswer: {
                    "scCmsQuestionArticleId": releaseId, //问题ID,
                    "scCmsAnswerUserId": userId //回答作家Id
                },
                subscriptionId: subscriptionId //"头条号ID"
            }
            todoAnswerObj.sendAns(editorData); //发布回答接口
        } else if(isUpdate == 1) {
            var editorData = {
                articleId: releaseId,
                articleContent: editorHtml,
                releaseId: userId,
            }
            todoAnswerObj.updateAns(editorData); //发布回答接口
        }
    }
});

//问题详情中的标签
function label(d) {
    var quesLabel = (d).trim(),
        labelArr = [],
        quesLabelList = '';
    quesLabel = quesLabel.charAt(quesLabel.length - 1) == ',' ? quesLabel.slice(0, -1) : quesLabel;
    labelArr = quesLabel.split(',');
    $.each(labelArr, function(i, e) {
        quesLabelList += '<li>' + e + '</li>';
    })
    return quesLabelList;
}

//轮播图函数
function imgCarousel(html) {
    $(html).each(function(i, e) {
        var imgsLength = $(e).find('.quesMImgList img').length;
        if(imgsLength == 3) {
            function rollOne(){
                $(e).find('.quesMImgList').animate({left:"-100px"}, 2000, "linear", function(){  
                    $(this).css({left: "0px"});  
                    $(this).children("img").first().remove().clone(true).appendTo($(e).find('.quesMImgList'));  
                });  
            }  
            var startRollOne = setInterval(rollOne, 1000);  
        }
    });
}