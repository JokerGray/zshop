var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
//初始化配置信息
$.extend({
    channel: function () {
        this.rows = 5;//当前数量
        this.page = 1;//当前页数
        this.pages = 1;//当前总页数
        this.flag = false;//转移的标记
        this.Requset = {
            get: "selectAllScCmsChannel",
            add: "addScCmsChannel",
            edit: "updateScCmsChannel",
            delete: "delectlScCmsChannelArticle",
            channel: "selectAllfield",
            updateAllScCmsChannelArticle: "updateAllScCmsChannelArticle"
        }
    }
});
$.channel.prototype = {
    getData: function (d) {
        var _this = this;
        var res = reqNewAjax(_this.Requset.get, d);
        if (res.code == 1) {
            var total = res.total;
            var getTpl = $("#tableList").html();
            _this.pages = Math.ceil(total / _this.rows);
            if (!isNull(res.data)) {
                laytpl(getTpl).render(res.data, function (html) {
                    $("#tableCon").html(html);
                });
            } else {
                $("#tableCon").html('');
            }
        }
    },
    getPage: function (d) {//获取分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: _this.pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function (obj) {
                d.pagination.page = _this.page = obj.curr;
                _this.checkedNum = 0;
                $('#checkedNum').html(_this.checkedNum);
                $('.multiSelectBox').attr('src', 'images/uncheck.png');
                _this.getData(d);
            }
        });
    }
};
$(function () {
    var start = new $.channel(), oldChannelName = '', oldChannelAddress = '';
    //查询
    var data = {
        "pagination": {
            "page": start.page,
            "rows": start.rows
        }
    };
    start.getData(data);
    start.getPage(data);

    //搜索按钮点击事件
    $("#search_icon").click(function () {
        var channelName = $("#searchInp").val().trim();
        var Response = {
            channelName: channelName,
            pagination: {
                page: start.page,
                rows: start.rows
            }
        }
        start.getData(Response);
        start.getPage(Response);
    });

    //搜索框回车事件
    $("#searchInp").keyup(function (e) {
        if (e && e.keyCode == 13) {
            $("#search_icon").click();
        }
    });

    //添加新频道
    $("#confirmAddSub").click(function () {
        var channelName = $("#channelNameTxt").val().trim();
        var channelUrl = $("#channelUrlTxt").val().trim();
        if (isNull(channelName)) {
            return layer.msg("请输入频道名称");
        }
        if (isNull(channelUrl)) {
            return layer.msg("请输入频道地址");
        }
        var Response = {
            channelName: channelName,
            iconUrl: channelUrl
        };
        var res = reqNewAjax(start.Requset.add, Response);
        layer.msg(res.msg);
        if (res.code == "1") {
            $("#channelNameTxt").val("");
            $("#channelUrlTxt").val("");
            $("#addSubject").modal("hide");
        }
        start.getData({
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
        start.getPage({
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
    });

    //修改名称代入
    $("#tableCon").on("click", ".editBtn", function () {
        var channelName = $(this).attr("channelName");
        var channelId = $(this).attr("channelId");
        var channelUrl = $(this).attr("channelUrl");
        oldChannelName = channelName;
        oldChannelAddress = channelUrl;
        $("#channelIdHid").val(channelId);
        $("#channelNameTxt2").val(channelName);
        $("#channelUrlTxt2").val(channelUrl);
    });
    //确认修改
    $("#confirmAddSub2").click(function () {
        if(oldChannelName == $("#channelNameTxt2").val().trim() && oldChannelAddress == $("#channelUrlTxt2").val().trim()) {
            layer.msg('请至少修改一项！');
        } else {
            var channelName = $("#channelNameTxt2").val().trim();
            var channelUrl = $("#channelUrlTxt2").val().trim();
            var channelId = $("#channelIdHid").val();
            if (isNull(channelName)) {
                return layer.msg("请输入频道名称");
            }
            if (isNull(channelUrl)) {
                return layer.msg("请输入频道地址");
            }
            var Response = {
                channelName: channelName,
                channelId: channelId,
                iconUrl: channelUrl
            };
            var res = reqNewAjax(start.Requset.edit, Response);
            layer.msg(res.msg);
            if (res.code == "1") {
                $("#editSubject").modal("hide");
            }
            start.getData({
                pagination: {
                    page: start.page,
                    rows: start.rows
                }
            });
            start.getPage({
                pagination: {
                    page: start.page,
                    rows: start.rows
                }
            });
        }
    });

    //checkbox点击
    $(".channelUl").on("click", "li", function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        $(".channelUl").find(".multiSelectBox").attr("src", "images/uncheck.png");
        $(this).find(".multiSelectBox").attr("src", "images/checked.png");
    });

    //确认转移文章
    $("#confirmArticleBtn").click(function () {
        var channelId = $(".channelUl").find("li.active").attr("channelId");
        transfer(0, channelId);
    });

    //确认转移作者
    $("#confirmAuthorBtn").click(function () {
        var channelId = $(".channelUl").eq(1).find("li.active").attr("channelId");
        transfer(1, channelId);
    });

    //转移文章
    $("#tableCon").on("click", ".articleBtn", function () {
        var channelName = $(this).attr("channelName");
        var channelId = $(this).attr("channelId");
        var channelArticleNumber = $(this).attr("channelArticleNumber");
        $("#channelIdHid").val(channelId);
        $("#channelSpan").html(channelName);//频道名称
        $("#articleNum").html(channelArticleNumber);//文章数
        //获取频道列表
        getChannelList(channelName);
    });

    //转移作者
    $("#tableCon").on("click", ".authorBtn", function () {
        var channelName = $(this).attr("channelName");
        var channelId = $(this).attr("channelId");
        var channelpeopleNumber = $(this).attr("channelpeopleNumber");
        $("#channelIdHid").val(channelId);
        $("#channelSpan2").html(channelName);//频道名称
        $("#authorNum").html(channelpeopleNumber);//作者数
        //获取频道列表
        getChannelList(channelName);
    });

    //删除名称
    $("#tableCon").on("click", ".delBtn", function () {
        var channelName = $(this).attr("channelName");
        var channelId = $(this).attr("channelId");
        var channelArticleNumber = $(this).attr("channelArticleNumber");
        var channelpeopleNumber = $(this).attr("channelpeopleNumber");
        $("#confirmAddSub3").attr("channelId", channelId);
        $("#confirmAddSub3").attr("channelName", channelName);
        $("#confirmAddSub3").attr("channelArticleNumber", channelArticleNumber)
        $("#confirmAddSub3").attr("channelpeopleNumber", channelpeopleNumber)
        layer.confirm('确认删除<span class="red">' + channelName + "</span>频道？", {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
                var res = reqNewAjax(start.Requset.delete, { channelName: channelName });
                if (res.msg == "领域还有文章,不能删除") {
                    start.flag = true;
                    $("#delSubject").modal("show");
                }
                if (res.msg == "领域还有作者,不能删除") {
                    start.flag = false;
                    $("#delSubject").modal("show");
                }
                layer.msg(res.msg);
                start.getData({
                    pagination: {
                        page: start.page,
                        rows: start.rows
                    }
                });
                start.getPage({
                    pagination: {
                        page: start.page,
                        rows: start.rows
                    }
                });
            }
        });
    });

    //去转移选择
    $("#confirmAddSub3").click(function () {
        var channelId = $(this).attr("channelId");
        var channelName = $(this).attr("channelName");
        var channelArticleNumber = $(this).attr("channelArticleNumber");
        var channelpeopleNumber = $(this).attr("channelpeopleNumber");
        $("#channelIdHid").val(channelId);
        $("#channelSpan,#channelSpan2").html(channelName);//频道名称
        $("#delSubject").modal("hide");
        if (start.flag) {
            $("#articleNum").html(channelArticleNumber);//文章数
            $("#articleModal").modal("show");
        } else {
            $("#authorNum").html(channelpeopleNumber);//作者数
            $("#authorModal").modal("show");
        }
        getChannelList(channelName);
    });

    //获取频道列表
    function getChannelList(channelName) {
        var res = reqNewAjax(start.Requset.channel, "{}");
        // var res = reqAjax(start.Requset.channel, "{}");
        if (!isNull(res.data)) {
            var str = "";
            $.each(res.data, function (i, v) {
                if (channelName == v.channelName) {
                    str += '<li class="mt10 active" channelId="' + v.channelId + '">';
                    str += '<img class="multiSelectBox mr10" src="images/checked.png">';
                } else {
                    str += '<li class="mt10" channelId="' + v.channelId + '">';
                    str += '<img class="multiSelectBox mr10" src="images/uncheck.png">';
                }
                str += '<span>' + v.channelName + '</span></li>';
            });
            $(".channelUl").html(str);
        }
    }

    //转移
    function transfer(num, channelId) {
        var chalId = $("#channelIdHid").val();
        var Response = {
            chalId: chalId,
            channelId: channelId,
            transfer: num
        };
        var res = reqNewAjax(start.Requset.updateAllScCmsChannelArticle, Response);
        layer.msg(res.msg);
        $("#articleModal").modal("hide");
        $("#authorModal").modal("hide");
        start.getData({
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
        start.getPage({
            pagination: {
                page: start.page,
                rows: start.rows
            }
        });
    }
    //js over
});