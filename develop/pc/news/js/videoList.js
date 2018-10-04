var layer = layui.layer, laytpl = layui.laytpl;
$(function () {
    var start = new $.platform();
    // 启动导航
    getChannel({
        url: start.Request.channel,
        num: 0,
        dom: $("#navUl")
    });
    //页面进来的文章列表
    start.getVideoList(start.newsData);
    //点击更新获取最新数据
    $('#updateBox').click(function () {
        ++start.newsData.pagination.page;
        start.flag = false;
        reqAjaxAsync(start.Request.videoList, start.newsData).done(function (res) {
            var data = res.data || '';
            // var nextTime = data.next;
            if (res.code == 1) {
                if (!isNull(data)) {
                    var getTpl = $('#videoListTpl').html();
                    laytpl(getTpl).render(data, function (html) {
                        $('#container').html(html);
                    });
                    start.flag = true;
                } else {
                    return layer.msg('没有更多内容了');
                }
            }
        })
    })
    //瀑布流数据
    $(document).scroll(function () {
        //吸顶热点
        var wTop = $(window).scrollTop();
        var hTop = $(".company").offset().top + 340;
        wTop > hTop ? $(".hot").addClass("hot_top") : $(".hot").removeClass("hot_top");
        if (wTop > 500) {
            $("#scrollTop").fadeIn(500);
        } else {
            $("#scrollTop").fadeOut(500);
        }
        if (start.flag) {
            waterfall({
                last: $(".list_item:last"),
                end: 0
            }, function () {
                ++start.newsData.pagination.page;
                start.flag = false;
                start.getVideoList(start.newsData);
            })
        }
    })
    
})
$.extend({
    platform: function () {
        this.userId = localStorage.getItem("userId") || "1",
        this.newsData = {
            "userId":this.userId,
            typeCode:1003,
            pagination:{
                page:1,
                row:5
            }
        };
        this.Request = {
            channel: "cms_back/selectAllChannel",
            videoList: 'cms_new/queryReArticleList'
        };
        this.flag = true;
    }
})
$.platform.prototype = {
    constructor: $.platform,
    getVideoList: function (d) {
        var _this = this;
        reqAjaxAsync(_this.Request.videoList, d).done(function (res) {
            var data = res.data || '';
            if (res.code == 1) {
                console.log(data);
                if (!isNull(data)) {
                    var getTpl = $('#videoListTpl').html();
                    console.log(getTpl);
                    laytpl(getTpl).render(data, function (html) {
                        $('#container').append(html);
                    });
                    _this.flag = true;
                } else {
                    return layer.msg('没有更多内容了');
                }
            }
        })
    }
}
