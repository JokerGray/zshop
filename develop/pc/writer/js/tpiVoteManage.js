var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl,
    userId = localStorage.getItem("userId") || '',
    form = layui.form(),
    totalNum=0;
function voteManage() {
    this.pages = 1;
    this.rows = 5;
    this.url = {
        voteListUrl: 'cms_new/participateVoteList',
        voteInfo: 'cms_new/queryVoteDetail'
    }
    this.voteData = {
        userId: userId,
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
    this.voteInfoD = {
        scCmsReadingDevicetype: '',
        scCmsMacId: '',
        userId: userId,
        scCmsReadingDevice: '',
        articleId: ''
    }
}
voteManage.prototype = {
    voteList: function(d, flag) {     //问题列表
        var _this = this;
        reqAjaxAsync(this.url.voteListUrl, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                $("#voteList").html('');
                $('#qPage').hide();
                return layer.msg(res.msg);
            };
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var getTpl = $("#voteTpl").html();
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages > 1 ? $('#qPage').show() : $('#qPage').hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#voteList").html(html);
                    });
                    imgCarousel(".quesMImgListBox");    //三图轮播
                    return flag ? _this.getPage(_this.pages, d) : false;
                } else {
                    $("#voteList").html('');
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
                _this.voteList(d, false);
            }
        });
    },
    voteInfo: function(d) {      //投票详情
        var _this = this;
        reqAjaxAsync(this.url.voteInfo, JSON.stringify(d)).done(function(res) {
            if(res.code != 1) {
                return layer.msg(res.msg);
            }
            if(res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    console.log(data)
                    var obj = {
                        quesTitle: '<span><img src="images/toupiaoB.png"></span>' + data.articleTitle + '<span class="headHasNameI">【' + votehasName(data.scCmsVoteOption) + '】</span>',
                        quesCont: data.articleContent || '',
                        authorName: !isNull(data.scCmsSubscription) ? data.scCmsSubscription.subscriptionName : '',
                        quesTime: data.releaseTime || '',
                        quesLabelList: label(data.label || ''),
                        voteStartTime: (data.scCmsVoteStartTime || '').replace('.0', ''),
                        voteEndTime: (data.scCmsVoteEndTime || '').replace('.0', ''),
                    }
                    new Date(data.scCmsVoteEndTime).getTime()<new Date().getTime()?$(".infoIsEndIcon").attr("src","images/yijieshu.png"):$(".infoIsEndIcon").attr("src","");
                    for(var key in obj) {
                        $('.quesInfoTpl .' + key).html(obj[key]);
                    }
                    // 获取总票数;
                    totalNum=0;
                    for(var i=0;i<data.scCmsVoteList.length;i++){
                        totalNum +=Number(data.scCmsVoteList[i].scCmsVoteALLNumber);
                    }
                    console.log(totalNum);
                    var voteType = data.scCmsVoteType || '0', playerListD = data.scCmsVoteList || '';
                    var playerObj = playerList(voteType, playerListD);
                    if(!isNull(playerObj)) {
                        $('#onlineCelebrity').html(playerObj);
                    } else {
                        $('#onlineCelebrity').html('');
                    }
                    if(isNull(obj.voteStartTime) || isNull(obj.voteEndTime)) {
                        $('.quesInfoTime').hide();
                    } else {
                        $('.quesInfoTime').show();
                    }
                    if(isNull(obj.quesLabelList)) {
                        $('.quesLabels').hide();
                    } else {
                        $('.quesLabels').show();
                    }
                    if($(this).attr('isEndFlag') == 1) {

                    }
                } else {
                    return layer.msg(res.msg);
                }
            }
        })
    }
}
var voteM = new voteManage();
$(function() {
    //我发起的投票列表
    voteM.voteList(voteM.voteData, true);
    $('#voteList').on('click', '.quesTit', function() {        //点击标题查看详情
        voteM.voteInfoD.articleId = $(this).parent().parent().parent().attr('articleId');
        voteM.voteInfo(voteM.voteInfoD);
    })
    $('#voteList').on('click', '.quesBtnModify', function() {      //点击修改
        var articleId = $(this).parent().parent().attr('articleId');
        layer.confirm('确认修改吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
				window.location.href = './vote.html?articleId=' + articleId;
            }
        }); 
    })
    $('#voteList').on('click', '.quesBtnDel', function() {        //点击删除
        var articleId = $(this).parent().parent().attr('articleId');
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
                reqAjaxAsync(voteM.url.voteDelete, JSON.stringify({articleId: articleId})).done(function(res) {
                    if(res.code != 1) {
                        return layer.msg(res.msg);
                    }
                    if(res.code == 1) {
                        layer.close(index);
                        //我发起的投票列表
                        voteM.voteData.pagination.page = 1;
                        voteM.voteList(voteM.voteData, true);
                    }
                });
            }
        }); 
    })
})
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
//选手的html渲染
function playerList(type, d) {
    var listHtml = '';
    if(!isNull(d)) {
        var listNum = 1;
        $.each(d, function(i, e) {
            if(type == 0) {
                var voteNum = +e.scCmsVotePeepleNumber;
                if(voteNum > 0) {
                    listHtml += '<div class="opacityO onlineCeleBox clearfix"><div class="playerInfoIconBox"><p>第'+ voteNum +'次投票</p><img src="images/voted.png" alt=""></div>';
                } else {
                    listHtml += '<div class="onlineCeleBox clearfix">';
                }
                listHtml += '<i>'+ listNum +'</i>'
                + '<img class="fl" src="'+ e.scCmsVoteUrl +'" alt="">'
                + '<div class="onlineCeDescri fl">'
                + '<p>选项标题: <span>'+ e.scCmsVoteTitle +'</span></p>'
                + '<p>选项描述: <span>'+ e.scCmsVoteDescribe +'</span></p>'
                + '</div>';
                if(listNum == 1) {
                    listHtml += '<div class="voteNumberBox"><img src="images/diyi.png" alt=""><span class="voteNumOrange">'+ e.scCmsVoteALLNumber +'票</span></div></div>';
                } else {
                    listHtml += '<div class="voteNumberBox"><span class="voteNumBlue">'+ e.scCmsVoteALLNumber +'票</span></div></div>';
                }
                listNum++;
            } else if(type == 1) {
                var voteNum = +e.scCmsVotePeepleNumber;
                listHtml += '<div class="oCeleSingleBox clearfix">'
                            +'<p class="ranking">'
                            + '<span>'+ e.scCmsVoteNumber  +'</span>'
                            + '<span>'+ e.scCmsVoteTitle +'</span>'
                            +'</p>'
                            +'<div class="layui-progress layui-progress-big" lay-showPercent="true">'
                                +'<div class="layui-progress-bar layui-bg-blue" lay-percent="10%" style="width:'+Math.round(e.scCmsVoteALLNumber / totalNum * 10000) / 100.00 + "%"+'"></div>'
                            +'</div>'
                            +'<p class="fl">'
                                +'<span>'+Math.round(e.scCmsVoteALLNumber / totalNum * 10000) / 100.00 + "%"+'</span>'
                                +'<span><img class="fl" src="images/huo.png">'+e.scCmsVoteALLNumber+'</span>'
                            +'</p>'
                            if(voteNum>0){
                                listHtml+='<div class="playerInfoIconBox">'
                                    listHtml+='<p>第'+voteNum+'次投票</p>'
                                    listHtml+='<img src="images/voted.png" alt="">'
                                listHtml+='</div>'
                            }
                        listHtml+= '</div>';
            }
        })
    }
    return listHtml;
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

