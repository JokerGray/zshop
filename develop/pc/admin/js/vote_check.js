var layer = layui.layer, laytpl = layui.laytpl, laypage = layui.laypage;
var vote = function() {
    this.rows = 5;
    this.pages = 1;
    this.url = {
        voteList: 'voteAuditRuery',    //投票列表
        voteDetail: 'queryAdminVoteDetail',     //投票详情   
        examineOp: 'voteStatusCode'      //审核是否通过
    };
    this.voteLData = {
        articleTitle: '',
        name: '',
        channelId: '',
        startTime: '',
        endTime: '',
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
    this.voteDetailD = {
        articleId: ''
    }
    this.examineOpD = {
        articleId: '',     //投票ID 
        isExamine: '',     //审核状态（ 0：未通过审核 1：通过审核 2 待审核 3 屏蔽 4 黑名单)
        auditDescriptionText: ''      //不通过理由
    }
}
vote.prototype = {
    voteListFunc: function(d, flag) {      //投票列表
        var _this = this;
        reqNewAjaxAsync(this.url.voteList, d).done(function(res){
            if(res.code != 1) {
                layer.msg(res.msg);
                return false;
            };
            if(res.code == 1) {
                var data = res.data.list || '';
                var total = res.data.total;
                if (!isNull(data)) {
                    var getTpl = $("#voteTpl").html();
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages > 1 ? $('#page').show() : $('#page').hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#voteTbody").html(html);
                    });
                    return flag ? _this.getPage(_this.pages, d) : false;
                } else {
                    $("#voteTbody").html('');
                    $('#page').hide();
                }
            }
        })
    },
    getPage: function(pages, d) { //获取分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#ff8b6f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.voteListFunc(d, false);
            }
        });
    },
    voteDetail: function(d) {     //投票详情 
        var _this = this;
        reqNewAjaxAsync(this.url.voteDetail, d).done(function(res) {
            if(res.code != 1) {
                return layer.msg(res.msg);
            }
            if(res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var obj = {
                        quesTitle: '<span><img src="images/toupiaoB.png"></span>' + data.articleTitle + '<span class="headHasNameI">【' + votehasName(data.scCmsVoteOption) + '】</span>',
                        quesCont: data.articleContent || '',
                        authorName: !isNull(data.scCmsSubscription) ? data.scCmsSubscription.subscriptionName : '',
                        quesTime: data.releaseTime || '',
                        voteStartTime: isNull(data.scCmsVoteStartTime) ? '' : (data.scCmsVoteStartTime).slice(0, data.scCmsVoteStartTime.indexOf(' ')),
                        voteEndTime: isNull(data.scCmsVoteEndTime) ? '' : (data.scCmsVoteEndTime || '').slice(0, data.scCmsVoteEndTime.indexOf(' ')),
                        quesLabelList: label(data.label || '')
                    }
                    for(var key in obj) {
                        $('.quesInfoTpl .' + key).html(obj[key]);
                    }
                    var voteType = data.scCmsVoteType || '0', playerListD = data.scCmsVoteList || '';
                    var playerObj = playerList(voteType, playerListD);
                    if(!isNull(playerObj.listHtml)) {
                        $('#onlineCelebrity').html(playerObj.listHtml);
                    } else {
                        $('#onlineCelebrity').html('');
                    }
                } else {
                    return layer.msg(res.msg);
                }
            }
        })
    },
    examineOper: function(d) {
        var _this = this;
        reqNewAjaxAsync(this.url.examineOp, d).done(function(res){
            layer.msg(res.msg);
            if(res.code != 1) {
                return false;
            };
            if(res.code == 1) {
                $('.close').click();
                //投票列表
                _this.voteListFunc(_this.voteLData, true);
            }
        });
    }
}
$(function(){
    //点击日期获取时间
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        var startDate = {
            max: '2099-06-16 23:59:59',
            choose: function (datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                endDate.start = datas //将结束日的初始值设定为开始日
                start.startTime = datas;
                start.endTime = $("#endTime").val();
                if (!isNull($("#endTime").val())) {
                    start.startTime = datas;
                    start.endTime = $("#endTime").val();
                }
            }
        };
        var endDate = {
            max: '2099-06-16 23:59:59',
            choose: function (datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                start.startTime = $("#startTime").val();
                start.endTime = datas;
                if (!isNull($("#startTime").val())) {
                    start.startTime = $("#startTime").val();
                    start.endTime = datas;
                }
            }
        };
        $('#startTime').click(function () {
            startDate.elem = this;
            laydate(startDate);
        });
        $('#endTime').click(function () {
            endDate.elem = this;
            laydate(endDate);
        });
    });
    var voteFunc = new vote(); 
    //获取下拉框所有选项
    optionType($("#channelId"), "all");
    //禁止在输入框输入空格
    $.each($('.searchInp'), function(i, e) {
        inhibitTrim(e);
    })
    //投票列表
    voteFunc.voteListFunc(voteFunc.voteLData, true);
    //点击查看详情按钮 
    $('#voteTbody').on('click', '.voteLBtn', function() {
        var isExamine = $(this).attr('isExamine');
        if(isExamine == 2) {
            $('#notPass').show();
            $('#pushPass').html('通过').removeClass('gray');
            $('#pushPass').attr('disabled', false);
        } else {
            $('#notPass').hide();
            $('#pushPass').html($(this).parent().siblings('.isExamine').html()).addClass('gray');
            $('#pushPass').attr('disabled', true);
        }
        voteFunc.voteDetailD.articleId = $(this).attr('articleId');
        $('.voteMFoot').attr('articleId', voteFunc.voteDetailD.articleId);
        voteFunc.voteDetail(voteFunc.voteDetailD);
    })
    //搜索权限
    $('#search_icon').click(function() {
        voteFunc.voteLData = {
            articleTitle: $('#articleTitle').val(),
            name: $('#name').val(),
            channelId: $('#channelId').val(),
            startTime: $('#startTime').val(),
            endTime: $('#endTime').val(),
            pagination: {
                page: 1,
                rows: voteFunc.rows
            }
        }
        voteFunc.voteListFunc(voteFunc.voteLData, true);
    })
    $('#pushPass').click(function() {
        voteFunc.examineOpD = {
            articleId: $(this).parent().attr('articleId'),     //投票ID 
            isExamine: 1,     //审核状态（ 0：未通过审核 1：通过审核 2 待审核 3 屏蔽 4 黑名单)
            auditDescriptionText: ''      //不通过理由
        }
        voteFunc.examineOper(voteFunc.examineOpD);
    });
    $('#notPass').click(function() {
        $('#NotPass_beca').val('');
        $('#notPassReason').attr('articleId', $(this).parent().attr('articleId'));
    });
    $('#notPassReason').click(function() {
        if(isNull($('#NotPass_beca').val())) {
            layer.msg('请填写理由!');
            return false;
        }
        voteFunc.examineOpD = {
            articleId: $(this).attr('articleId'),     //投票ID 
            isExamine: 0,     //审核状态（ 0：未通过审核 1：通过审核 2 待审核 3 屏蔽 4 黑名单)
            auditDescriptionText: $('#NotPass_beca').val()      //不通过理由
        }
        voteFunc.examineOper(voteFunc.examineOpD);
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

//实名匿名
function votehasName(opt) {
    var str = '';
    if(opt == 0) {
        str = '实名';
    } else if(opt == 1) {
        str = '匿名';
    }
    return str;
}

//选手的html渲染
function playerList(type, d) {
    var listObj = {};
    listObj.listHtml = '', listObj.valArr = [], listObj.titArr = [];
    if(!isNull(d)) {
        var listNum = 1;
        $.each(d, function(i, e) {
            if(type == 0) {
                listObj.listHtml += '<div class="onlineCeleBox clearfix">'
                + '<i>'+ listNum +'</i>'
                + '<img class="fl" src="'+ e.scCmsVoteUrl +'" alt="">'
                + '<div class="onlineCeDescri fl">'
                + '<p>选项标题: <span>'+ e.scCmsVoteTitle +'</span></p>'
                + '<p>选项描述: <span>'+ e.scCmsVoteDescribe +'</span></p>'
                + '</div>'
                + '</div>';
                listNum++;
            } else if(type == 1) {
                listObj.listHtml += '<div class="oCeleSingleBox clearfix">'
                + '<span>'+ e.scCmsVoteNumber  +'</span>'
                + '<span>'+ e.scCmsVoteTitle +'</span>'
                + '</div>';
            }
            if(e.scCmsVotePeepleNumber != 0) {
                listObj.valArr.push({value: e.scCmsVotePeepleNumber, name: e.scCmsVoteTitle});
                listObj.titArr.push({name: e.scCmsVoteTitle, icon: 'circle'});
            }
        })
    }
    return listObj;
}
