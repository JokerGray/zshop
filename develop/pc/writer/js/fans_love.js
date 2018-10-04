var layer = layui.layer,
    laytpl = layui.laytpl,
    laypage = layui.laypage;

$(function() {
    var getFansScriptHtml = $("#getFansScript").html();
    var id = GetQueryString("id") || "";
    var userId = localStorage.getItem("userId") || "";
    $("#fansA").attr("href", "fans.html?id=" + id);
    $("#fansFan").attr("href", "fans_fan.html?id=" + id);
    $("#fansFanLove").attr("href", "fans_love.html?id=" + id);

    //筑城
    $("#r_articalList").on('click', '.concern', function() {
        var type = $(this).attr("type");
        var cmd = start.Request.addUserAttention;
        var data = JSON.stringify({
            "appName": "24",
            "busiId": type,
            "busiType": 0,
            "userId": userId,
            "releaseTime": getDates(new Date().getTime())
        });
        var res = reqAjax(cmd, data);
        layer.msg(res.msg);
        start.getData({
            userId: id,
            currentUserId: userId,
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
    });
    //取消筑城
    $("#r_articalList").on('click', '.cancel', function() {
        var type = $(this).attr("type");
        var cmd = start.Request.cancelAttentionL;
        var data = JSON.stringify({
            "appName": "24",
            "busiId": type,
            "busiType": 0,
            "userId": userId
        });
        var res = reqAjax(cmd, data);
        layer.msg(res.msg);
        start.getData({
            userId: id,
            currentUserId: userId,
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
    });

    function fans() {};
    fans.prototype = {
        rows: 10,
        page: 1,
        Request: {
            getDataUrl: "cms_new/queryNewAttentionList",
            cancelAttentionL: "concern/delCocernRela",
            addUserAttention: "concern/addCocernRela"
        },
        getData: function(d) {
            var Response = JSON.stringify(d);
            var res = reqAjax(start.Request.getDataUrl, Response);
            laytpl(getFansScriptHtml).render(res.data, function(html) {
                $("#r_articalList").html(html);
            });
            //分页
            var totalPage = Math.ceil(res.total / start.rows);
            getPage(totalPage);
        },
        getDataPage: function(page) {
            var Response = JSON.stringify({
                pagination: {
                    page: page,
                    rows: start.rows
                },
                userId: id,
                currentUserId: userId
            });
            var res = reqAjax(start.Request.getDataUrl, Response);
            laytpl(getFansScriptHtml).render(res.data, function(html) {
                $("#r_articalList").html(html);
            });
        },
        getUserInfo: function() {
            var cmd = "cms_new/querySubscriptionDetail";
            var data = JSON.stringify({
                "userId": id,
                "byVisitUser": id
            });
            var res = reqAjax(cmd, data);
            if (!isNull(res.data)) {
                if (isNull(res.data.scSysUser)) {
                    return layer.msg("改用户不存在，请联系管理员");
                }
                if (isNull(res.data.subscriptionId)) {
                    $("#aticleLi").hide();
                }
                $("#userpics").attr("src", res.data.scSysUser.userpic);
                $("#sername").text(res.data.scSysUser.username);
                $("#signature").text(res.data.subscriptionSynopsis || "这个人很懒，什么都没有写...");
            }
        }
    };
    var start = new fans();
    //获取用户信息
    start.getUserInfo();
    start.getData({
        pagination: {
            page: start.page,
            rows: start.rows
        },
        userId: id,
        currentUserId: userId
    });

    //分页
    function getPage(pages) { //调用分页 
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.getDataPage(obj.curr);
            }
        });
    }
});