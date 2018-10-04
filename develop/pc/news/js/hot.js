var layer = layui.layer,
    laytpl = layui.laytpl;

$(function() {
    var recommendList = $("#recommendList").html();
    var userId = localStorage.getItem("userId") || "1";
    var toutiao = function() {
        this.flag = false;
        this.url = {
            channel: "cms_back/selectAllChannel",
            hot: 'cms_new/queryHostArticleList' //热词
        }
        this.indexList={
            "userId": userId,
            pagination:{
                page:1,
                rows:5
            }
        }
    };
    toutiao.prototype = {
        // 获取推荐列表
        getRecommendList: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.hot, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var data = res.data;
                        laytpl(recommendList).render(data, function(html) {
                            $("#container").append(html);
                            _this.flag = true;
                        });
                    }
                } else {
                    layer.msg(res.msg);
                }
            });
        }
    };

    var homepage = new toutiao();
    // 启动导航
    getChannel({
        url: homepage.url.channel,
        num: 0,
        dom: $("#navUl")
    });
    //获取推荐列表
    homepage.getRecommendList(homepage.indexList);
    // 点击更新查看更多
    $("#updateList").click(function() {
        ++homepage.indexList.pagination.page;
        var recommendList = $("#recommendList").html();
        homepage.flag = false; //重置标记
        reqAjaxAsync(homepage.url.hot, homepage.indexList).done(function(res) {
            var data = res.data;
            if (isNull(data)) {
                return layer.msg("没有更多内容了!");
            }
            laytpl(recommendList).render(data, function(html) {
                $("#container").html(html);
                homepage.flag = true;
            });
        });
        return false;
    });
    //主体内容滑动的时候
    $(document).scroll(function() {
        //吸顶热点
        var wTop = $(window).scrollTop();
        var hTop = $(".company").offset().top;
        wTop > hTop ? $(".hot").addClass("hot_top") : $(".hot").removeClass("hot_top");
        // 瀑布流
        if (homepage.flag) {
            waterfall({
                last: $(".list_item:last"),
                end: 0
            }, function() {
                ++homepage.indexList.pagination.page;
                var recommendList = $("#recommendList").html();
                homepage.flag = false; //重置标记
                reqAjaxAsync(homepage.url.hot, homepage.indexList).done(function(res) {
                    var data = res.data;
                    if (isNull(data)) {
                        return layer.msg("没有更多内容了!");
                    }
                    laytpl(recommendList).render(data, function(html) {
                        $("#container").append(html);
                        homepage.flag = true;
                    });
                });

            });
        }
    });
    //js over
});