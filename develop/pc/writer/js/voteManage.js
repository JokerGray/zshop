var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl,
    userId = localStorage.getItem("userId") || '',
    valArr = [],
    titArr = [],
    carIndex = 0, 
    timer,
    form = layui.form();
function voteManage() {
    this.pages = 1;
    this.rows = 5;
    this.voteCarPages = 1;
    this.voteCarRows = 5;
    this.url = {
        voteListUrl: 'cms_new/voteList',
        voteInfo: 'cms_new/queryAppVoteDetail',
        voteCarouselD: 'cms_new/newVotePeople',
        voteDelete: 'cms_new/deleteVote'
    }
    this.voteData = {
        userId: userId,
        isExamine: '',
        IsDraft: '',
        scCmsIsOverdue: '',
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
    this.voteCarD = {
        pagination: {
            page: 1,
            rows: this.voteCarRows
        },
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
                $("body .noticeBox").hide();
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var obj = {
                        quesTitle: '<span><img src="images/toupiaoB.png"></span>' + data.articleTitle + '<span class="headHasNameI">【' + votehasName(data.scCmsVoteOption) + '】</span>',
                        quesCont: data.articleContent || '',
                        authorName: !isNull(data.scCmsSubscription) ? data.scCmsSubscription.subscriptionName : '',
                        quesTime: data.releaseTime || '',
                        quesLabelList: label(data.label || ''),
                        voteStartTime: isNull(data.scCmsVoteStartTime) ? '' : (data.scCmsVoteStartTime).replace('.0', ''),
                        voteEndTime: isNull(data.scCmsVoteEndTime) ? '' : (data.scCmsVoteEndTime || '').replace('.0', ''),
                        voteTotalNum: data.scCmsVoteAllNumber || '0',
                        // voteTotalTime: ''         
                    }
                    if(isNull(obj.voteStartTime) || isNull(obj.voteEndTime)) {
                        $('.quesInfoTime').hide();
                    } else {
                        $('.quesInfoTime').show();
                        // 获取当前时间,投票开始时间,投票结束时间
                        var nowTime=(new Date(getNowFormatDate())).getTime();;
                        var startTime=(new Date(obj.voteStartTime)).getTime();
                        var endTime=(new Date(obj.voteEndTime)).getTime();
                        //开始时间小于当前时间 .timeType距离结束时间
                        if(endTime<nowTime&&startTime<nowTime){
                            $(".voteTotalTime").html("<span>投票已结束<span>");
                        }
                        if(startTime<nowTime&&endTime>nowTime){
                            timer=setInterval(function(){
                                $(".voteTotalTime").html(show_time(endTime,"结束"));
                            },1000)
                        }
                        if(startTime>nowTime){
                            timer=setInterval(function(){
                                $(".voteTotalTime").html(show_time(endTime,"开始"));
                            },1000)
                        }
                    }
                    for(var key in obj) {
                        $('.quesInfoTpl .' + key).html(obj[key]);
                    }
                    if(obj.voteTotalNum == 0) {
                        $('#voteInfoBox').hide();
                    } else {
                        $('#voteInfoBox').show();
                    }
                    if(isNull(obj.quesLabelList)) {
                        $('.quesLabels').hide();
                    } else {
                        $('.quesLabels').show();
                    }
                    var voteType = data.scCmsVoteType || '0', playerListD = data.scCmsVoteList || '';
                    var playerObj = playerList(voteType, playerListD);
                    if(!isNull(playerObj.listHtml)) {
                        $('#onlineCelebrity').html(playerObj.listHtml);
                    } else {
                        $('#onlineCelebrity').html('');
                    }
                    _this.echarts(playerObj.titArr ,playerObj.valArr);
                    var isRealName = data.scCmsVoteOption;
                    console.log(isRealName);
                    if(isRealName == 0) {
                        $("body .noticeBox").show();
                        _this.voteCarD.articleId = data.articleId
                        _this.voteCarousel(_this.voteCarD);
                    }
                } else {
                    return layer.msg(res.msg);
                }
            }
        })
    },
    echarts: function(titArr, valArr) {     //饼状图
        var voteChart = echarts.init(document.getElementById('voteChart'));
        option = {
            title : {
                text: '投票选项占比',
                x:'left',
                top: '40px',
                textStyle: {
                    fontWeight: 'normal'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:['#EF9C98', '#93B6CA', '#EBB382', '#BAD0A9'],    
            legend: {
                orient: 'vertical',
                right: '150px',
                top: '100px',
                data: titArr,
                itemGap: 20,
                itemWidth: 20,
                itemHeight: 20
            },
            series : [
                {
                    name: '投票选项',
                    type: 'pie',
                    radius : '55%',
                    center: ['30%', '50%'],
                    data: valArr,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            position: 'inside'
                        }
                    }
                }
            ]
        };
        voteChart.setOption(option);   //参数设置方法
    },
    voteCarousel: function(d) {          //实时轮播
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            async: true, //默认为异步
            timeout: 5000, //超时时间设置，单位毫秒
            data: {
                "cmd": _this.url.voteCarouselD,
                "data": JSON.stringify(d) || "",
                "version": version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(res) {
                isApikey(res);
                if(res.code != 1) {
                    return layer.msg(res.msg);
                }
                if(res.code == 1) {
                    getCarousel(res);
                }
            }
        });
    }
}
var voteM = new voteManage();
$(function() {
    //我发起的投票列表
    voteM.voteList(voteM.voteData, true);
    $('.quesMineTab li').click(function() {                //切换所有投票tab栏
        $('.quesMineTab li').removeClass('active');
        $(this).addClass('active');
        voteM.voteData.isExamine = $(this).attr('isExamine') || '';
        voteM.voteData.IsDraft = $(this).attr('isDraft') || '';
        voteM.voteData.scCmsIsOverdue = $(this).attr('scCmsIsOverdue') || '';
        voteM.voteList(voteM.voteData, true);
    })
    $('#voteList').on('click', '.quesTit', function() {             //点击标题查看详情
        voteM.voteInfoD.articleId = $(this).parent().parent().parent().attr('articleId');
        voteM.voteInfo(voteM.voteInfoD);
    })
    $('#voteList').on('click', '.quesBtnModify', function() {           //点击修改
        var articleId = $(this).parent().parent().attr('articleId');
        layer.confirm('确认修改吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
				window.location.href = './vote.html?articleId=' + articleId;
            }
        }); 
    })
    $('#voteList').on('click', '.quesBtnDel', function() {                   //点击删除
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
    $("body #voteInfo").on("hidden.bs.modal",function(e){
        clearInterval(timer);
        $(".voteTotalTime").html("");
    })
   
})
//判断问题状态
function getExamine(isDraft, type, isDue, reason) {
    var str = '';
    if(isDraft == 1) {
        str = '<span class="qGray">草稿</span>';
    } else if(isDue == 1) {
        str = '<span class="qGray">已过期</span>';
    } else if(isDue==2){
        str = '<span class="qGray">未开始</span>';
    }else if(isDue == 0 && isDraft == 0) {
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
//实时轮播图调用
function getCarousel(res) {
    $('#noticeList').html("");
    var data = res.data || '';
    var total = res.total;
    voteM.voteCarPages = Math.ceil(total / voteM.voteCarRows);
    if (!isNull(data)) {
        var voteHtml = '';
        $.each(data, function(i, e) {
            voteHtml += '<p>'
                        + '用户<span class="noticePublisher">'+ e.subscriptionName +'</span>'
                        + '把票投给了<span class="noticePlayer">"'+ e.scCmsVoteTitle +'"</span>'
                        + '<span class="noticeTime">'+ e.scCmsVoteCreateTime.replace('.0', '') +'</span>'
                        + '</p>';
        })
        $('#noticeList').append(voteHtml);
        if(voteM.voteCarPages > 1) {
            var flag = false, maxNum = +$('#noticeList').height() - $('.noticeBox').height();
            var timer = setInterval(function() {
                if($('#voteInfo').css('display') == 'none') {
                    carIndex = 0;
                    $('#noticeList').html('');
                    clearInterval(timer);
                }
                carIndex++;
                if(carIndex > maxNum) {
                    flag = true;
                    clearInterval(timer);
                    if(flag) {
                        voteM.voteCarD.pagination.page++;
                        if(voteM.voteCarD.pagination.page > voteM.voteCarPages) {
                            voteM.voteCarD.pagination.page = 1;
                        } 
                        voteM.voteCarousel(voteM.voteCarD);
                    }
                }
                $('#noticeList').css({top: -1 * carIndex + 'px'});
            }, 100);
        }
    }
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

//计算间隔时间
function getIntervalTime(start, end) {
    var startT = 0, endT = 0, intervalTime = 0, intervalDay = '', intervalHours = '';
    startT = new Date(start).getTime();
    endT = new Date(end).getTime();
    intervalTime = endT - startT;
    intervalDay = Math.floor( intervalTime / (1000 * 60 * 60 * 24) );
    intervalHours = Math.floor( intervalTime % (1000 * 60 * 60 * 24) / (1000 * 60 * 60) );
    return intervalDay + '天' + intervalHours + '小时';
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

// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var getMinutes=date.getMinutes();
	var getSeconds=date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
	}
	if ( getMinutes >= 0 &&  getMinutes <= 9) {
		getMinutes = "0" +  getMinutes;
	}
	if ( getSeconds >= 0 &&  getSeconds <= 9) {
		getSeconds = "0" +  getSeconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + getMinutes
            + seperator2 + getSeconds;
    return currentdate;
}

function diffTime(startDate,endDate) {  
    var diff=endDate- startDate;//时间差的毫秒数  
  
    //计算出相差天数  
    var days=Math.floor(diff/(24*3600*1000));  
       
    //计算出小时数  
    var leave1=diff%(24*3600*1000);    //计算天数后剩余的毫秒数  
    var hours=Math.floor(leave1/(3600*1000));  
    //计算相差分钟数  
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数  
    var minutes=Math.floor(leave2/(60*1000));  
       
    //计算相差秒数  
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数  
    var seconds=Math.round(leave3/1000);  
      
    var returnStr = seconds + "秒";  
    if(minutes>0) {  
        returnStr = minutes + "分" + returnStr;  
    }  
    if(hours>0) {  
        returnStr = hours + "小时" + returnStr;  
    }  
    if(days>0) {  
        returnStr = days + "天" + returnStr;  
    }  
    return returnStr;  
}  

function getLocalTime(nS) {     
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");      
}     
//计算倒计时
function show_time(timeS,status){ 
    var time_distance=timeS-new Date().getTime();
    var int_day = Math.floor(time_distance/86400000) 
    time_distance -= int_day * 86400000; 
    var int_hour = Math.floor(time_distance/3600000) 
    time_distance -= int_hour * 3600000; 
    var int_minute = Math.floor(time_distance/60000) 
    time_distance -= int_minute * 60000; 
    var int_second = Math.floor(time_distance/1000) 
    if(int_day < 10){ 
        int_day = "0" + int_day; 
    } 
    if(int_hour < 10){ 
        int_hour = "0" + int_hour; 
    } 
    if(int_minute < 10){ 
        int_minute = "0" + int_minute; 
    } 
    if(int_second < 10){
        int_second = "0" + int_second; 
    } 
    return int_day+"天"+int_hour+"小时"+int_minute+"分"+int_second+"秒"+status;
    
}