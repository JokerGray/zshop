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
function myQuestion() {
    this.rows = 5;
    this.pages = 1;
    this.answerRows = 2;
    this.answerPages = 1;
    this.url = {
        questionList: 'cms_new/questionList',
        questionDetail: 'cms_new/queryQuestionDetail',
        answerList: 'cms_new/answerList',
        sendAnswer: 'cms_new/publishAnswer',
        delQues: 'cms_new/deleteQuestion'     
    }
    this.quesListD = {
        userId: userId,
        pagination: {
            page: 1,
            rows: this.rows
        },
        isExamine: "",
        IsDraft: ""
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
myQuestion.prototype = {
    questionList: function(d, flag) {     //问题列表
        var _this = this;
        reqAjaxAsync(this.url.questionList, JSON.stringify(d)).done(function(res) {
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
                    $("#quesMineList").html('');
                    $('#qPage').hide();
                }
            }
        })
    },
    delQues: function() {          //删除问题
        var _this = this;
        reqAjaxAsync(this.url.questionDetail, JSON.stringify(d)).done(function(res) {
            console.logo(res);
            layer.msg(res.msg);
        });
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
    quesDetail: function(d) {     //问题详情
        var _this = this;
        reqAjaxAsync(this.url.questionDetail, JSON.stringify(d)).done(function(res) {
            console.log(res);
            if(res.code != 1) {
                return layer.msg(res.msg);
            }
            if(res.code == 1) {
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
                    for(var key in obj) {
                        $('.quesInfoTpl .' + key).html(obj[key]);
                    }
                } else {
                    return layer.msg(res.msg);
                }
            }
        })
    },
    answerList: function(d, flag) {     //回答列表
        var _this = this;
        reqAjaxAsync(this.url.answerList, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                $("#answerUl").html('');
                return layer.msg(res.msg);
            };
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                $('.infoAnswerTab span').html(total + '个回答');
                total == 0 ? $('.answerList').hide() : $('.answerList').show();
                if (!isNull(data)) {
                    var getTpl = $("#answerTpl").html();
                    _this.answerPages = Math.ceil(total / _this.answerRows);
                    _this.answerPages == _this.answerData.pagination.page ? $('#moreAnsBtn').hide() : $('#moreAnsBtn').show();
                    laytpl(getTpl).render(data, function(html) {
                        if(flag) {
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
    sendAns: function(d) {       //发布回答
        var _this = this;
        reqAjaxAsync(this.url.sendAnswer, JSON.stringify(d)).done(function(res) {
            layer.msg(res.msg);
            if(res.code == 1) {
                editor.html('');
                // //查看回答列表
                // _this.answerData.pagination.page = 1;
                // _this.answerList(_this.answerData, false);
            }
        })
    }
}
$(function() {
    var myQues = new myQuestion();
	//获取所有信息
    var articleData = localStorage.getItem("articleData") || "";
    var articleDataObj = JSON.parse(articleData);
    //头条号id
    var subscriptionId = articleDataObj.subscriptionId || "";
	//发布人类型
	var subscriptionType = localStorage.getItem("subscriptionType");
    //编辑器图片集合
    var imgArr = [];
    //问题id
    var questionId = "";
    // 富文本编辑器上传图片
	uploadOss({
		btn: "btn",
		imgArr: imgArr,
		editor: editor,
		flag: "send"
	});
    //初始化全部列表数据
    myQues.questionList(myQues.quesListD, true);
    // 切换tab列表数据
    $('.quesMineTab li').click(function() {
        $('.quesMineTab li').removeClass('active');
        $(this).addClass('active');
        myQues.quesListD.isExamine = $(this).attr('isExamine');
        myQues.quesListD.IsDraft = $(this).attr('isDraft');
        myQues.quesListD.pagination.page = 1;
        myQues.questionList(myQues.quesListD, true);
    });
    //点击查看问题详情
    $('#quesMineList').on('click', '.quesTit', function() {
        var articleId = $(this).parent().parent().parent().attr('articleId');
        var isDraft = $(this).attr('isDraft'), isExamine = $(this).attr('isExamine');
        questionId = articleId;
        myQues.quesDetailData.articleId = articleId;
        myQues.answerData.articleId = articleId;
        myQues.answerData.pagination.page = 1;
        //查看问题详情
        myQues.quesDetail(myQues.quesDetailData);
        if(isDraft == 0 && isExamine == 1) {
            $('.editorBox').show();
            $('.infoAnswerBox').show();
            //查看回答列表
            myQues.answerList(myQues.answerData, false);
        } else {
            $('.editorBox').hide();
            $('.infoAnswerBox').hide();
        }
    })
    //发布回答
    $('#editorBtn').click(function() {
        var editorHtml = editor.html();
        if(isNull(editorHtml)) {
            layer.msg('请输入答案!');
            return false;
        }
        var editorData = {
            previewImgType: 12,              //普通无图,
            articleContent: editorHtml,     //"问答内容"
            is_draft: 0,                    //"是否草稿：0，否；1，是",
            releaseId: userId,              //"发布人主键
            typeCode: 1006,                 //答案"
            releaseType: subscriptionType,  //"发布人的类型(0:作者;1:商家)
            scCmsAnswer: {
                "scCmsQuestionArticleId": questionId,   //问题ID,
                "scCmsAnswerUserId": userId             //回答作家Id
            },
            subscriptionId: subscriptionId              //"头条号ID"
        }
        myQues.sendAns(editorData);           //发布回答接口
    })
    //修改我的问题
    $('#quesMineList').on('click', '.quesBtnModify', function() {
        var articleId = $(this).parent().parent().attr('articleId');
        layer.confirm('确认修改吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
				window.location.href = './send_question.html?articleId=' + articleId;
            }
        });
    })
    //删除我的问题
    $('#quesMineList').on('click', '.quesBtnDel', function() {
        var articleId = $(this).parent().parent().attr('articleId');
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
                reqAjaxAsync(myQues.url.delQues, JSON.stringify({'articleId': articleId})).done(function(res){
                    layer.msg(res.msg); 
                    if(res.code == 1) {
                        //初始化全部列表数据
                        myQues.quesListD.isExamine = $('.quesMineTab li.active').attr('isExamine');
                        myQues.quesListD.IsDraft = $('.quesMineTab li.active').attr('isDraft');
                        myQues.quesListD.pagination.page = 1;
                        myQues.questionList(myQues.quesListD, true);
                    };
                });
            }
        });
    })
    //查看更多回答按钮
    $('#moreAnsBtn').click(function() {
        myQues.answerData.pagination.page++;
        //查看回答列表
        myQues.answerList(myQues.answerData, true);
    })
    //不通过的理由显示隐藏
    $('#quesMineList').on('mouseover', '.notPassIcon', function() {
        $(this).siblings('.notPassReason').addClass('show').removeClass('hide');
    })
    $('#quesMineList').on('mouseout', '.notPassIcon', function() {
        $(this).siblings('.notPassReason').addClass('hide').removeClass('show');
    })
})
//问题详情中的标签
function label(d) {
    var quesLabel = (d).trim(), labelArr = [], quesLabelList = '';
    quesLabel = quesLabel.charAt(quesLabel.length - 1) == ',' ? quesLabel.slice(0, -1) : quesLabel;
    labelArr = quesLabel.split(',');
    $.each(labelArr, function(i, e) {
        quesLabelList += '<li>'+ e +'</li>';
    })
    return quesLabelList;
}
//判断问题状态
function getExamine(isDraft, type, reason) {
    var str = '';
    if(isDraft == 1) {
        str = '<span class="qGray">草稿</span>';
    } else if(isDraft == 0) {
        switch(type) {
            case 0:
                str = '<span class="notPassIcon qRed cur-p">未通过</span><p class="notPassReason hide">'+ reason +'</p>';
                break;
            case 1:
                str = '<span class="qGreen">已发表</span>';
                break;
            case 2:
                str = '<span class="qYellow">待审核</span>';
                break;
            case 3:
                str = '<span class="qShield">屏蔽</span>';
                break;
            case 4:
                str = '<span class="qBlack">黑名单</span>';
                break;    
        }
    }
    return str;
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