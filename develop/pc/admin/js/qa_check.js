/**
 * author   robin
 * name     文章审核
 * date     2017/9/13
 */
var isExamineMax = "";
var layer = layui.layer,
    laypage = layui.laypage,
    laydate = layui.laydate,
    laytpl = layui.laytpl;
var userCode = localStorage.getItem("userCode") || "";
var examinSec = $('[name="examineSec"]');
var start = {
    rows: 5,
    page: 1,
    pages: 1,
    REQUEST_URL: {
        getData: "questionAuditList",
        questionStatusCode: "questionStatusCode",
        answerStatusCode: "answerStatusCode",
        queryQuestionDetailBy: 'queryQuestionDetailBy',
    },
    format: function(d, fmt) {
        if (!fmt) fmt = 'yyyy-MM-dd'
        var date = new Date(d)
        if (date === 'Invalid Date') return ''
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt; //处理日期
    },
    // 获取页面数据
    getDataAjax: function(d) {
        var _this = this;
        var url = _this.REQUEST_URL.getData;
        reqNewAjaxAsync(url, d).then(function(res) {
            if (res.code == "1") {
                _this.pages = Math.ceil(res.total / _this.rows);
                var getTpl = $("#articleList").html();
                laytpl(getTpl).render(res.data, function(html) {
                    $("#statement_con").html(html);
                });
                _this.getPage(_this.pages, d);
            } else {
                layer.msg(res.msg);
            }
        });
    },
    //调用分页
    getPage: function(pages, d) {
        var _this = this;
        laypage({
            cont: 'page', //容器
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                console.log(obj.curr)
                _this.page = obj.curr;
                d.pagination.page = obj.curr;
                // 分页获取数据
                reqNewAjaxAsync(_this.REQUEST_URL.getData, d).then(function(res) {
                    if (res.code == "1") {
                        var getTpl = $("#articleList").html();
                        laytpl(getTpl).render(res.data, function(html) {
                            $("#statement_con").html(html);
                        });
                    } else {
                        layer.msg(res.msg);
                    }
                });
            }
        });
    },
    // 查询问答详情
    getQuestionDetail: function(d) {
        reqNewAjaxAsync(start.REQUEST_URL.queryQuestionDetailBy, d).then(function(res) {
            if (res.code == 1) {
                var data = res.data;
                var boxStr = '';
                var datas = data.scCmsResourcesList;
                var dataArr = [];
                $('#article_title').html(data.articleTitle);
                $('#title').html(data.articleTitle);
                $('#releaseTime').html(data.releaseTime);
                $('#releaseTime2').html(data.releaseTime);
                if (!isNull(data.scCmsSubscription)) {
                    $("#avator").css({
                        'background': 'url(' + data.scCmsSubscription.subscriptionImgUrl + ') no-repeat',
                        'background-size': 'cover'
                    });
                    $('#article_author').html(data.scCmsSubscription.subscriptionName);
                    $('#author').html(data.scCmsSubscription.subscriptionName);
                }
                if (!isNull(data.scCmsChannel)) {
                    $("#channelName").html("领域：" + data.scCmsChannel.channelName);
                    $("#channelIdHid").val(data.scCmsChannel.channelId || "");
                }
                if (data.typeCode == '1001') {
                    $('#articleType').html('文章类型：' + '普通文章');
                }
                else if (data.typeCode == '1002') { //图集
                    $('#articleType').html('文章类型：' + '图集');
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].resourcesType == 'image') {
                            var str = '<img class="article_image" src="' + datas[i].resourcesUrl + '"><p>' + datas[i].resourcesRemarks + '</p>';
                            dataArr.push(str);
                        }
                    }
                    boxStr = dataArr.join('');
                }
                else if (data.typeCode == '1003') { //视频
                    $('#articleType').html('文章类型：' + '视频');
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].resourcesType == 'video') {
                            var str = '<video class="article_video" src="' + datas[i].videoUrl + '" poster="' + datas[i].resourcesUrl + '" controls="controls"></video>';
                            dataArr.push(str);
                        }
                    }
                    boxStr = dataArr.join('');
                }
                var htm = isNull(boxStr) ? formatImg(data.articleContent) : boxStr;
                $('#articleContent').html(htm);
                $('#articleContent2').html(htm);
            } else {
                layer.msg(res.msg);
                $('#articleContent').html("");
                $('#article_title').html("");
                $('#releaseTime').html("");
                $('#article_author').html("");
                $('#labelList').html("");
                $('#articleType').html("");
                $("#channelName").html("");
            }
        });
    },
    // 置顶
    topAjax: function(d) {
        var url = "";
        if ($(".tabinner li.active").data("type") == "1005") {
            url = start.REQUEST_URL.questionStatusCode;
        } else {
            url = start.REQUEST_URL.answerStatusCode;
        }
        reqNewAjaxAsync(url, d).then(function(res) {
            layer.msg(res.msg);
        })
    }
};

//获取今天的日期：
var today = start.format(new Date());

// 局部刷新数据并且关闭模态框
function refresh() {
    if ($(".tabinner li.active").data("type") == 1006) {
        $("#channelNameTh").hide();
    } else {
        $("#channelNameTh").show();
    }
    $("#articleModal").modal('hide');
    var data = {
        "userCode": userCode,
        "subscriptionName": $("#autherName_inp").val(),
        "isExamine": $("#examineOpt").val(),
        "articleTitle": $('#penName_inp').val(),
        "typeCode": $(".tabinner li.active").data("type") || "",
        "channelId": $('#inputValue').val(),
        "startTime": $("#start").val(),
        "endTime": $("#end").val(),
        "pagination": {
            rows: start.rows,
            page: 1
        }
    };
    //开始分页查询数据
    start.getDataAjax(data);
}

$(function() {
    //获取下拉框所有选项
    optionType($("#inputValue"), "all");
    //获取页面数据
    refresh();
    //tab切换
    $(".tabinner li").click(function() {
        refresh();
        var type = $(this).data("type");
        if (type == "1005") {
            $("#channelNameTh").show();
            $("#wrapQuestion").show();
            $("#wrapAnswer").hide();
            $("#article_title").show();
            $("#answer_title").hide();
            $("#field_box").show();
        } else {
            $("#channelNameTh").hide();
            $("#wrapQuestion").hide();
            $("#wrapAnswer").show();
            $("#answer_title").show();
            $("#article_title").hide();
            $("#field_box").hide();
        }
    });

    //点击搜索按钮时搜索对应项
    $('#search_icon').click(function() {
        $('#examineOpt').val('');
        var data = {
            "userCode": userCode,
            "isExamine": $("#examineOpt").val(),
            "subscriptionName": $("#autherName_inp").val(),
            "articleTitle": $('#penName_inp').val(),
            "typeCode": $(".tabinner li.active").data("type") || "",
            "channelId": $('#inputValue').val(),
            "startTime": $("#start").val(),
            "endTime": $("#end").val(),
            "pagination": {
                rows: start.rows,
                page: 1
            }
        };
        start.getDataAjax(data);
    });

    // 输入回车自动搜索
    $("#penName_inp").keyup(function(e) {
        if (e && e.keyCode == 13) {
            $("#search_icon").click();
        }
    });

    //状态搜索
    examinSec.change(function() {
        var examin = $(this).val();
        var data = {
            "userCode": userCode,
            "isExamine": $("#examineOpt").val(),
            "subscriptionName": $("#autherName_inp").val(),
            "articleTitle": $('#penName_inp').val(),
            "typeCode": $(".tabinner li.active").data("type") || "",
            "channelId": $('#inputValue').val(),
            "startTime": $("#start").val(),
            "endTime": $("#end").val(),
            "pagination": {
                rows: start.rows,
                page: 1
            }
        };
        start.getDataAjax(data);
    });

    //查看文章
    $("#statement_con").on('click', '.previewModal', function() {
        var userId = $(this).attr("userId");
        var articleId = $(this).attr("articleId");
        var channelId = $(this).attr("channelId");
        var isExamine = $(this).attr("isExamine");
        if (isExamine == "1") {
            isExamineMax = "";
            $("#btnBox").hide();            
            // $('#passBtn').text("已通过").removeClass("btn-primary").addClass("gray");
            // $('.btnNotPass').addClass('hideBtn').removeClass('showBtn');
        } 
        else if(isExamine == "0"){
            isExamineMax = "1";
            $("#btnBox").hide();            
        }
        else {
            isExamineMax = "1";
            $("#btnBox").show();            
            // $('#passBtn').text("通过").addClass("btn-primary").removeClass("gray");
            // $('.btnNotPass').removeClass('hideBtn').addClass('showBtn');
        }
        //存储文章ID
        $("#articleHid").val(articleId);
        $("#channelIdHid").val(channelId);
        start.getQuestionDetail({
            "scCmsReadingDevicetype": "",
            "scCmsMacId": "",
            "userId": userId,
            "scCmsReadingDevice": "",
            "articleId": articleId
        });
    });

    // 监听模态框关闭事件
    $('#articleModal').on('hide.bs.modal', function() {
        //清空模态框内容
        $('#articleContent').html("");
    })

    //通过
    $("#passBtn").click(function() {
        var articleId = $("#articleHid").val();
        // if (isExamineMax == "") {
        //     layer.msg("该文章已通过");
        //     return false;
        // }
        layer.confirm('通过', {
            title: "通过",
        }, function(index) {
            start.topAjax({
                userCode: userCode,
                articleId: articleId,
                isExamine: isExamineMax
            });
            layer.close(index);
            refresh();
        });
    });

    //不通过
    $("#notpassBtn").click(function() {
        var articleId = $("#articleHid").val();
        var auditDescriptionText = $("#notPassTxt").val().trim();
        start.topAjax({
            userCode: userCode,
            articleId: articleId, 
            isExamine: "0",
            auditDescriptionText: auditDescriptionText,
        });
        $("#notPass").modal("hide");
        refresh();
    });

    //点击日期获取时间
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var startDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                endDate.start = datas //将结束日的初始值设定为开始日
                if (!isNull($("#end").val())) {
                    start.startTime = datas;
                    start.endTime = $("#end").val();
                    console.log(datas, $("#end").val())
                }
            }
        };

        var endDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                if (!isNull($("#start").val())) {
                    start.startTime = $("#start").val();
                    start.endTime = datas;
                    console.log($("#start").val(), datas)
                }
            }
        };

        $('#start').click(function() {
            startDate.elem = this;
            laydate(startDate);
        });

        $('#end').click(function() {
            endDate.elem = this;
            laydate(endDate);
        });
    });
    //js over
});