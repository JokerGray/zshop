var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl,
    userId = localStorage.getItem("userId") || '',
    form = layui.form();

function todoAnswer() {
    this.rows = 5;
    this.pages = 1;
    this.myAnsRows = 2;
    this.url = {
        quesList: 'cms_new/answeredList',
        questionDetail: 'cms_new/queryQuestionDetail',
        allAnsList: 'cms_new/answerList',
        ansDetail: 'cms_new/queryAnswerDetail',
        deleteAns: 'cms_new/deleteQuestion'
    }
    this.quesListD = {
        userId: userId,
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
    this.quesInfo = {
        scCmsMacId: "",
        userId: userId,
        articleId: ""
    }
    this.myAnsData = {
        userId: userId,
        articleId: ''
    }
    this.allAnsData = {
        userId: userId,
        pagination: {
            page: 1,
            rows: this.myAnsRows
        },
        articleId: ''
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
                    return flag ? _this.getPage(_this.pages, d) : false;
                } else {
                    return layer.msg("暂无数据")
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
    myAnsList: function(url, d) { //回答列表
        var _this = this;
        reqAjaxAsync(url, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                $("#answerUl").html('');
                return layer.msg(res.msg);
            };
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var getTpl = $("#myAnsTpl").html();
                    laytpl(getTpl).render(data, function(html) {
                        $("#answerUl").html(html);
                    });
                } else {
                    $("#answerUl").html('');
                }
            }
        })
    }
}
$(function() {
    var todoAnswerObj = new todoAnswer();
    todoAnswerObj.questionList(todoAnswerObj.quesListD, true);
    // 点击标题
    $('#quesMineList').on('click', '.answerTit', function() {
        var articleId = $(this).attr('articleId'),
            answerId = $(this).attr('answerId');
        todoAnswerObj.quesInfo.articleId = articleId;
        todoAnswerObj.quesDetail(todoAnswerObj.quesInfo);
        todoAnswerObj.myAnsData.articleId = answerId;
        //查看我的回答列表
        todoAnswerObj.myAnsList(todoAnswerObj.url.ansDetail, todoAnswerObj.myAnsData);
    })
    //查看所有回答
    $('#infoAllAns').click(function() {
        // todoAnswerObj.myAnsList(todoAnswerObj.url.allAnsList, todoAnswerObj.allAnsData, true);
    })
    $('#infoMyAns').click(function() {
        // todoAnswerObj.myAnsList(todoAnswerObj.url.allAnsList, todoAnswerObj.myAnsData, true);
    })
    //查看我的更多回答按钮
    // $('#moreAnsBtn').click(function() {
    //     todoAnswerObj.myAnsData.pagination.page++;
    //     //查看我的回答列表
    //     todoAnswerObj.myAnsList(todoAnswerObj.url.ansDetail, todoAnswerObj.myAnsData, true);
    // })

    //删除回答
    $('#quesMineList').on('click', '.ansDelete', function() {
        var _this = this;
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function(index, layero) {
                var answerId = $(_this).parent().attr('answerId');
                reqAjaxAsync(todoAnswerObj.url.deleteAns, JSON.stringify({articleId: answerId})).done(function(res) {
                    layer.msg(res.msg);
                    if(res.code == 1) {
                        todoAnswerObj.quesListD.pagination.page = 1;
                        todoAnswerObj.questionList(todoAnswerObj.quesListD, true);
                    }
                })
            }
        });
    })
    //修改回答
    $('#quesMineList').on('click', '.ansUpdate', function() {
        var questionId = $(this).parent().attr('questionId');
        var answerId = $(this).parent().attr('answerId');
        var ansHrefPath = window.document.location.pathname;
        var ansHArr = ansHrefPath.split('/');
        if(ansHArr.length == 2) {
            window.location.href = '/todo_answer.html';
        } else if(ansHArr.length > 2) {
            window.location.href = ansHrefPath.substring(0, ansHrefPath.indexOf(ansHArr[ansHArr.length - 1])) + 'todo_answer.html?questionId=' + questionId + '&answerId=' + answerId;
        }
    })
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