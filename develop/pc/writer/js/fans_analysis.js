var layer = layui.layer,
    laypage = layui.laypage,
    laytpl = layui.laytpl;
var userId = localStorage.getItem('userId') || "";

$(function() {
    var getFansListHtml = $("#getFansList").html();
    var listUl = $("#listUl");

    //筑城
    $(".fans-wrap").on('click', '.concern', function() {
        var type = $(this).attr("type");
        var cmd = start.Request.addUserAttention;
        var data = JSON.stringify({
            "appName": "24",
            "busiId": type,
            "busiType": 0,
            "userId": userId,
            "releaseTime": getDatesNew(new Date().getTime())
        });
        reqAjaxAsync(cmd, data).then(function(res) {
            if (!isNull(res.msg)) {
                layer.msg(res.msg)
            };
        });
        start.getData({
            userId: userId,
            currentUserId: userId,
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
    });

    //取消筑城
    $(".fans-wrap").on('click', '.cancel', function() {
        var type = $(this).attr("type");
        var cmd = start.Request.cancelAttentionL;
        var data = JSON.stringify({
            userId: userId,
            "appName": "24",
            "busiId": type,
            "busiType": 0,
        });
        reqAjaxAsync(cmd, data).then(function(res) {
            if (!isNull(res.msg)) {
                layer.msg(res.msg)
            };
        });
        start.getData({
            userId: userId,
            currentUserId: userId,
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
    });

    //set prototype
    function fans() {};
    fans.prototype = {
        rows: 15,
        page: 1,
        pages: 1,
        Request: {
            getDataUrl: "cms_new/queryNewFansList",
            cancelAttentionL: "concern/delCocernRela",
            addUserAttention: "concern/addCocernRela"
        },
        //获取数据
        getData: function(d) {
            var Response = JSON.stringify(d);
            reqAjaxAsync(start.Request.getDataUrl, Response).then(function(res) {
                start.pages = Math.ceil(res.total / start.rows);
                getPage(start.pages);
                laytpl(getFansListHtml).render(res.data, function(html) {
                    listUl.html(html);
                });
            })
        },
        //获取分页数据
        getDataPage: function(d) {
            var Response = JSON.stringify(d);
            reqAjaxAsync(start.Request.getDataUrl, Response).then(function(res) {
                laytpl(getFansListHtml).render(res.data, function(html) {
                    listUl.html(html);
                });
            })
        }
    };

    //获取数据
    var start = new fans();
    start.getData({
        userId: userId,
        currentUserId: userId,
        pagination: {
            page: start.page,
            rows: start.rows
        }
    });

    //调用分页
    function getPage(pages) {
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.getDataPage({
                    userId: userId,
                    currentUserId: userId,
                    pagination: {
                        page: obj.curr,
                        rows: start.rows
                    }
                });
            }
        });
    }
    //js over
});