var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl;
$(function() {
    var listUl = $("#listUl");
    var articleData = localStorage.getItem('articleData') || "";
    var userId = localStorage.getItem('userId') || "";
    var apikey = localStorage.getItem('apikey') || "";
    var version = localStorage.getItem('version') || "1";
    var noticeListHtml = $("#noticeList").html();
    var start = {
        rows: 5,
        page: 1,
        pages: 1,
        flag: false,
        getNumData: {
            "userId": userId
        },
        getList: function(cmd) {
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                data: {
                    cmd: cmd,
                    data: JSON.stringify({
                        "userId": 0,
                        "pagination": {
                            'rows': start.rows,
                            'page': start.page
                        }
                    }),
                    version: version
                },
                beforeSend: function(request) {
                    layer.load(0, {
                        shade: [0.1, '#fff']
                    });
                    request.setRequestHeader("apikey", apikey);
                },
                dataType: "json",
                success: function(res) {
                    layer.closeAll('loading');
                    isApikey(res);
                    start.pages = Math.ceil(res.total / start.rows);
                    getPage(start.pages);
                    laytpl(noticeListHtml).render(res.data, function(html) {
                        listUl.html(html);
                    });
                },
                error: function() {
                    layer.closeAll('loading');
                    console.log("ajax-error");
                }
            });
        },
        getListPage: function(cmd, page) {
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                data: {
                    cmd: cmd,
                    data: JSON.stringify({
                        "userId": 0,
                        "pagination": {
                            'rows': start.rows,
                            'page': page
                        }
                    }),
                    version: version
                },
                beforeSend: function(request) {
                    layer.load(0, {
                        shade: [0.1, '#fff']
                    });
                    request.setRequestHeader("apikey", apikey);
                },
                dataType: "json",
                success: function(res) {
                    layer.closeAll('loading');
                    isApikey(res);
                    laytpl(noticeListHtml).render(res.data, function(html) {
                        listUl.html(html);
                    });
                },
                error: function() {
                    layer.closeAll('loading');
                    console.log("ajax-error");
                }
            });
        },
        getNum: function(cmd, dataNum) {
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                data: {
                    "cmd": cmd,
                    "data": JSON.stringify(dataNum),
                    "version": version
                },
                beforeSend: function(request) {
                    layer.load(0, {
                        shade: [0.1, '#fff']
                    });
                    request.setRequestHeader("apikey", apikey);
                },
                dataType: "json",
                success: function(res) {
                    layer.closeAll('loading');
                    isApikey(res);
                    var resObj = res.data;
                    if (!isNull(resObj)) {
                        var str = "";
                        var isExamine = resObj.isExamine || '';
                        if (isExamine == 0) {
                            str = "[审核未通过]";
                        }
                        if (isExamine == 1) {
                            str = "";
                            // str = "[审核已通过]";
                        }
                        if (isExamine == 2) {
                            str = "[账户审核中]";
                        }
                        if (isExamine == 3) {
                            str = "[账户已锁定]";
                        }
                        $("#isExamine").text(str);
                        countUp("fansNumber", resObj.fansNumber || 0);
                        countUp("articleNumber", resObj.articleNumber || 0);
                        countUp("visitNumber", resObj.visitNumber || 0);
                        countUp("yesterReadNumber", resObj.yesterReadNumber || 0);
                    }
                },
                error: function(res) {
                    layer.closeAll('loading');
                    console.log("失败");
                }
            });
        }
    };

    //获取页面数据
    start.getNum("cms_back/AllSubScriptionByUserId", start.getNumData);
    //获取页面公告list
    start.getList("cms_new/selectNoticeList");

    //调用分页
    function getPage(pages) {
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.getListPage("cms_new/selectNoticeList", obj.curr);
            }
        });
    }
    //点击粉丝 文章数量 
    $("#fans").click(function() {
        location.href = "fans_analysis.html";
    });

    //点击文章跳转文章详情
    $("#article").click(function() {
        location.href = "report.html";
    });

    //获取公告详情弹窗
    $("#listUl").on('click', 'li', function() {
        var scCmsNoticeId = $(this).attr("scCmsNoticeId");
        reqAjaxAsync("cms_new/selectNoticeA", "{'scCmsNoticeId':" + scCmsNoticeId + "}").done(function(res) {
            var d = res.data;
            $("#notice_title").html(d.scCmsNoticeTitle);
            $("#noticeContent").html(d.scCmsNoticeContent);
            $("#releaseTime").html(d.scCmsNoticeCreateTime);
        });

    });
    //jsover
});