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
        getData: "articleAuditRuery",
        status: "articleStatusCode",
        articleDetail: "queryArticleDetailBy",
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
                _this.pages = Math.ceil(res.data.total / _this.rows);
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
    // 获取弹窗文章详情数据
    getArticleDetailAjax: function(d) {
        var url = start.REQUEST_URL.articleDetail;
        reqNewAjaxAsync(url, d).then(function(res) {
            if (res.code == "1") {
                var data = res.data;
                $('#article_title').html(data.articleTitle);
                $('#releaseTime').html(data.releaseTime);
                if (!isNull(data.scCmsSubscription)) {
                    $('#article_author').html(data.scCmsSubscription.subscriptionName);
                }
                var labelList = data.label;
                labelList = labelList.substr(0, labelList.length - 1)
                $('#labelList').html(labelList);
                $("#channelIdHid").val(data.scCmsChannel.channelId || "");
                data.scCmsChannel ? $("#channelName").html("领域：" + data.scCmsChannel.channelName) : "";
                //判断类型为文章还是图集还是视频
                var boxStr = '';
                var datas = data.scCmsResourcesList;
                var dataArr = [];
                //普通文章
                if (data.typeCode == '1001') {
                    console.log('普通文章');
                    $('#articleType').html('文章类型：' + '普通文章');
                } else if (data.typeCode == '1002') { //图集
                    console.log('图集');
                    $('#articleType').html('文章类型：' + '图集');
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].resourcesType == 'image') {
                            var str = '<img class="article_image" src="' + datas[i].resourcesUrl + '"><p>' + datas[i].resourcesRemarks + '</p>';
                            dataArr.push(str);
                        }
                    }
                    boxStr = dataArr.join('');
                } else if (data.typeCode == '1003') { //视频
                    console.log('视频');
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
        var url = start.REQUEST_URL.status;
        reqNewAjaxAsync(url, d).then(function(res) {
            layer.msg(res.msg);
        })
    }
};

//获取今天的日期：
var today = start.format(new Date());

// 局部刷新数据并且关闭模态框
function refresh() {
    // $('#examineOpt').val('');
    $("#articleModal").modal('hide');
    var data = {
        "userCode": userCode,
        "isExamine": $("#examineOpt").val(),
        "articleTitle": $('#penName_inp').val(),
        "name": $('#autherName_inp').val(),
        "channelId": $('#inputValue').val(),
        "startTime": $("#start").val(),
        "endTime": $("#end").val(),
        "releaseType": $('.tabinner > li.active').attr('releaseType'),
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

    //点击时搜索全部内容
    $('#tabAll').click(function() {
        $('#examineOpt').val('');
        refresh();
    });

    //点击tab-Person 时搜索个人内容
    $('#tabPerson').click(function() {
        $('#examineOpt').val('');
        var data = {
            userCode: userCode,
            releaseType: 0,
            pagination: {
                rows: start.rows,
                page: start.page
            }
        };
        start.getDataAjax(data);
        // start.getPage(start.pages, data);
    })

    //点击时搜索企业内容
    $('#tabCom').click(function() {
        $('#examineOpt').val('');
        var data = {
            userCode: userCode,
            releaseType: 1,
            pagination: {
                rows: start.rows,
                page: start.page
            }
        };
        start.getDataAjax(data);
        // start.getPage(start.pages, data);
    });

    //tab栏设置访问类型：
    $('#tabPerson').attr('releaseType', 0);
    $('#tabCom').attr('releaseType', 1);

    /**
     * @param  搜索7,14,30天
     */

    function searchDay(date) {
        $('#examineOpt').val('');
        var startDay = start.format(new Date().setDate(new Date().getDate() - date));
        var data = {
            "userCode": userCode,
            "startTime": startDay,
            "endTime": today,
            "releaseType": "",
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        data.releaseType = $('.tabinner > li.active').attr('releaseType');
        start.getDataAjax(data);
        // start.getPage(start.pages, data);
    };

    //点击7天 时搜索近7天内容
    $('#lastSevenDay').click(function() {
            searchDay(7);
        })
        //点击14天
    $('#lastHalfofMouth').click(function() {
        searchDay(14);
    });
    //点击30天
    $('#lastMouth').click(function() {
        searchDay(30);
    });

    //点击搜索按钮时搜索对应项
    $('#search_icon').click(function() {
        $('#examineOpt').val('');
        $('.tabinner li').removeClass('active');
        $('#tabAll').addClass('active');
        var data = {
            "articleTitle": $('#penName_inp').val(),
            "name": $('#autherName_inp').val(),
            "channelId": $('#inputValue').val(),
            "startTime": $("#start").val(),
            "endTime": $("#end").val(),
            "pagination": {
                "page": 1,
                "rows": start.rows
            }
        };
        start.getDataAjax(data);
        // start.getPage(start.pages, data);
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
            "isExamine": examin,
            "releaseType": $('.tabinner > li.active').attr('releaseType'),
            "articleTitle": $('#penName_inp').val(),
            "name": $('#autherName_inp').val(),
            "channelId": $('#inputValue').val(),
            "startTime": $("#start").val(),
            "endTime": $("#end").val(),
            "pagination": {
                "page": 1,
                "rows": start.rows
            }
        };
        start.getDataAjax(data);
        // start.getPage(start.pages, data);
    });

    //查看文章
    $("#statement_con").on('click', '.previewModal', function() {
        var isExamine = $(this).attr("isExamine");
        if (isExamine == "1") {
            isExamineMax = "";
            $('#passBtn').text("已通过").removeClass("btn-primary").addClass("gray");
            $('.btnNotPass').addClass('hideBtn').removeClass('showBtn');
        } else {
            isExamineMax = "1";
            $('#passBtn').text("通过").addClass("btn-primary").removeClass("gray");
            $('.btnNotPass').removeClass('hideBtn').addClass('showBtn');
        }
        var userId = $(this).attr("userId");
        var articleId = $(this).attr("articleId");
        var channelId = $(this).attr("channelId");
        var stickAll = $(this).attr("stickAll").split(",");
        if (stickAll[0] == "1") {
            $("#areaBtn").addClass("gray").html("取消领域置顶").attr("gray", "1");
        }
        else {
            $("#areaBtn").removeClass("gray").html("领域置顶").attr("gray", "0");
        }
        // if (stickAll[1] == "1") {
        //     $("#recommendBtn").addClass("gray").html("取消首页推荐").attr("gray", "1");
        // }
        // else {
        //     $("#recommendBtn").removeClass("gray").html("首页推荐").attr("gray", "0");
        // }
        if (stickAll[2] == "1") {
            $("#homePageBtn").addClass("gray").html("取消首页置顶").attr("gray", "1");
        }
        else {
            $("#homePageBtn").removeClass("gray").html("首页置顶").attr("gray", "0");
        }
        //存储文章ID
        $("#articleHid").val(articleId);
        $("#channelIdHid").val(channelId);
        start.getArticleDetailAjax({
            userId: userId,
            articleId: articleId,
            praiseUser: ""
        });
    });

    // 监听模态框关闭事件
    $('#articleModal').on('hide.bs.modal', function() {
        //清空模态框内容
        $('#articleContent').html("");
    })

    // //首页推荐
    // $("#recommendBtn").click(function () {
    //     var gray = $(this).attr("gray")
    //     var msg = (gray == 1) ? "是否取消首页推荐文章" : "是否首页推荐文章";
    //     var articleId = $("#articleHid").val();
    //     layer.confirm(msg, {
    //         title: "首页推荐",
    //     }, function (index) {
    //         if (gray == 1) {
    //             start.topAjax({
    //                 userCode: userCode,
    //                 articleId: articleId,
    //                 isRecommend: "0",
    //                 isExamine: "1"
    //             });
    //         } else {
    //             start.topAjax({
    //                 userCode: userCode,
    //                 articleId: articleId,
    //                 isRecommend: "1",
    //                 isExamine: "1"
    //             });
    //         }
    //         layer.close(index);
    //         refresh();
    //     });
    // });

    //首页置顶
    $("#homePageBtn").click(function() {
        var gray = $(this).attr("gray")
        var msg = (gray == 1) ? "是否取消首页置顶文章" : "是否首页置顶文章";
        var articleId = $("#articleHid").val();
        layer.confirm(msg, {
            title: "首页置顶",
        }, function(index) {
            if (gray == 1) {
                start.topAjax({
                    userCode: userCode,
                    articleId: articleId,
                    recommendStick: "0",
                    isRecommend: "0",
                    isExamine: isExamineMax
                });
            } else {
                start.topAjax({
                    userCode: userCode,
                    articleId: articleId,
                    recommendStick: "1",
                    isRecommend: "1",
                    isExamine: isExamineMax
                });
            }
            layer.close(index);
            refresh();
        });
    });

    //领域置顶
    $("#areaBtn").click(function() {
        var gray = $(this).attr("gray")
        var msg = (gray == 1) ? "是否取消领域置顶文章" : "是否领域置顶文章";
        var channelId = $("#channelIdHid").val();
        var articleId = $("#articleHid").val();
        layer.confirm(msg, {
            title: "领域置顶",
        }, function(index) {
            if (gray == 1) {
                start.topAjax({
                    userCode: userCode,
                    articleId: articleId,
                    channelId: channelId,
                    appStick: "0",
                    isExamine: isExamineMax
                });
            } else {
                start.topAjax({
                    userCode: userCode,
                    articleId: articleId,
                    channelId: channelId,
                    appStick: "1",
                    isExamine: isExamineMax
                });
            }
            layer.close(index);
            refresh();
        });
    });

    //通过
    $("#passBtn").click(function() {
        var articleId = $("#articleHid").val();
        if (isExamineMax == "") {
            layer.msg("该文章已通过");
            return false;
        }
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

    //屏蔽
    $("#shieldBtn,#shieldBtn2").click(function() {
        var articleId = $("#articleHid").val();
        layer.confirm('屏蔽', {
            title: "屏蔽",
        }, function(index) {
            start.topAjax({
                userCode: userCode,
                articleId: articleId,
                isRecommend: "0",
                appStick: "0",
                recommendStick: "0",
                isExamine: "3"
            });
            layer.close(index);
            refresh();
        });
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