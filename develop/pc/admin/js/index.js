var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl;
$(function() {
    var listUl = $("#listUl");
    var articleData = localStorage.getItem('articleData') || "";
    var userId = localStorage.getItem('userId') || "";
    var noticeListHtml = $("#noticeList").html();
    //创建公告方法
    function noticeFn() {
        this.userId = userId;
        this.rows = 5;
        this.page = 1;
        this.pages = 1;
        this.flag = false;
        this.selectIndex = "selectIndex";
        this.getListUrl = "selectNoticeList";
        this.delUrl = "updateNotice";
    };
    // 设置属性
    noticeFn.prototype = {
        getList: function(d) {
            var cmd = start.getListUrl;
            reqNewAjaxAsync(cmd, d).then(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                start.pages = Math.ceil(res.total / start.rows);
                laytpl(noticeListHtml).render(res.data, function(html) {
                    listUl.html(html);
                });
                getPage(start.pages);
            });
        },
        getListPage: function(d) {
            var cmd = start.getListUrl;
            reqNewAjaxAsync(cmd, d).then(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                laytpl(noticeListHtml).render(res.data, function(html) {
                    listUl.html(html);
                });
            });
        },
        getNum: function(d) {
            var cmd = start.selectIndex;
            reqNewAjaxAsync(cmd, d).then(function(res) {
                var resObj = res.data;
                if (!isNull(resObj)) {
                    $.each(resObj, function(i, v) {
                        $("span[type=" + v.type + "]").html(v.number);
                        countUp("num" + v.type, v.number || 0);
                    });
                }
            });
        }
    };

    var start = new noticeFn();
    // //获取页面数据
    // start.getNum("cms_back/AllSubScriptionByUserId", start.getNumData);
    //获取头部数据
    start.getNum();
    //获取页面公告list
    start.getList({
        "userId": 0,
        "pagination": {
            'rows': start.rows,
            'page': start.page
        }
    });

    //置顶
    $("#listUl").on('click', ".topBtn", function() {
        var scCmsNoticeId = $(this).attr("scCmsNoticeId");
        layer.confirm('是否置顶', function(index) {
            reqNewAjaxAsync(start.delUrl, {
                scCmsNoticeId: scCmsNoticeId,
                scCmsNoticeTop: 1
            }).then(function(res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    start.getList({
                        "userId": 0,
                        "pagination": {
                            'rows': start.rows,
                            'page': start.page
                        }
                    });
                }
                layer.close(index);
            });
        });
    });

    //删除
    $("#listUl").on('click', ".delBtn", function() {
        var scCmsNoticeId = $(this).attr("scCmsNoticeId");
        layer.confirm('是否删除', function(index) {
            var res = reqNewAjax(start.delUrl, {
                scCmsNoticeId: scCmsNoticeId,
                scCmsNoticeDel: 1
            });
            layer.msg(res.msg);
            if (res.code == 1) {
                start.getList({
                    "userId": 0,
                    "pagination": {
                        'rows': start.rows,
                        'page': start.page
                    }
                });
            }
            layer.close(index);
        });
    });

    //调用分页
    function getPage(pages) {
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.getListPage({
                    "userId": 0,
                    "pagination": {
                        'rows': start.rows,
                        'page': obj.curr
                    }
                });
            }
        });
    }
    //jsover
});