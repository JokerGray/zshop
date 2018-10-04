var layer = layui.layer,
    laytpl = layui.laytpl;

$(function() {
    var recommendList = $("#recommendList").html();
    var userId = localStorage.getItem("userId") || "1";
    var toutiao = function() {
        this.flag = false;
        this.url = {
            channel: "cms_back/selectAllChannel",
            carousel: "cms_new/queryScCmsCarouseList",
            aticleList: "cms_new/queryReArticleList",
            hot: 'cms_new/querSearchRecordHotName' //热词
        }
        this.indexList={
            "userId": userId,
            pagination:{
                page:1,
                row:5
            }
        }
    };
    toutiao.prototype = {
        // 获取轮播图
        getCarousel: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.carousel, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var li = "",
                            btn = "";
                        $.each(res.data, function(i, v) {
                            if (v.scCmsCarouselArticleId == 0) {
                                li += "<li><a href='" + v.scCmsCarouselUrl + "'  target='_blank'><img class='' src='" + v.scCmsCarouselImg + "'><p class='carousel_name'>" + v.scCmsCarouselName + "</p></a></li>";
                            } else {
                                if (v.scCmsCarouselArticleType == "1001") { //文章
                                    li += "<li><a href='articleDetail.html?articleId=" + v.scCmsCarouselArticleId + "'  target='_blank'><img class='' src='" + v.scCmsCarouselImg + "'><p class='carousel_name'>" + v.scCmsCarouselName + "</p></a></li>";
                                } else if (v.scCmsCarouselArticleType == "1002") { //图集
                                    li += "<li><a href='imgDetail.html?articleId=" + v.scCmsCarouselArticleId + "'  target='_blank'><img class='' src='" + v.scCmsCarouselImg + "'><p class='carousel_name'>" + v.scCmsCarouselName + "</p></a></li>";
                                } else if (v.scCmsCarouselArticleType == "1003") { //视频
                                    li += "<li><a href='videoDetail.html?articleId=" + v.scCmsCarouselArticleId + "'  target='_blank'><img class='' src='" + v.scCmsCarouselImg + "'><p class='carousel_name'>" + v.scCmsCarouselName + "</p></a></li>";
                                }
                            }
                            btn += "<li>" + v.scCmsChannelName + "</li>";
                        });
                        $("#bannerUl").html(li);
                        $("#btnUl").html(btn);
                        $("#bannerUl").find("li").eq(0).addClass("active");
                        $("#btnUl").find("li").eq(0).addClass("active");
                        // 启动走马灯
                        _this.carousel({
                            btn: $(".img_tab ul li"), //data.btn(获取启动按钮)
                            img: $(".img_box ul li"), //data.img(获取所有图片)
                            box: $(".banner") //轮播最大的盒子
                        });
                    }
                } else {
                    layer.msg(res.msg);
                }
            });
        },
        /**
         * 启动轮播 定时5s
         * @param   data.btn(获取启动按钮)
         * @param   data.img(获取所有图片)
         */
        carousel: function(data) {
            var num = 0,
                timer = null,
                len = data.img.length,
                _this = this;
            _this.start = function() {
                num = num > len - 1 ? 0 : ++num;
                if (data.img.is(":animated")) return;
                data.btn.eq(num).addClass("active").siblings().removeClass("active");
                data.img.eq(num).fadeIn(300).siblings().fadeOut(300);
            }

            timer = setInterval(function() {
                _this.start();
            }, 5000);

            data.box.hover(function() {
                clearInterval(timer);
            }, function() {
                timer = setInterval(function() {
                    _this.start();
                }, 5000);
            });

            data.btn.mouseover(function() {
                var index = $(this).index();
                clearInterval(timer);
                num = index;
                $(this).addClass("active").siblings().removeClass("active");
                data.img.eq(num).stop(true, true).fadeIn(300).siblings().fadeOut(300);
                return false;
            });
        },
        // 获取推荐列表
        getRecommendList: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.aticleList, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var data = res.data;
                        $("#lastHid").val(data.next);
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
    // 获取走马灯
    homepage.getCarousel();
    //获取推荐列表
    homepage.getRecommendList(homepage.indexList);
    // 点击更新查看更多
    $("#updateList").click(function() {
        ++homepage.indexList.pagination.page;
        var recommendList = $("#recommendList").html();
        homepage.flag = false; //重置标记
        reqAjaxAsync(homepage.url.aticleList, homepage.indexList).done(function(res) {
            var data = res.data;
            if (isNull(data)) {
                return layer.msg("没有更多内容了!");
            }
            $("#lastHid").val(data.next);
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
                reqAjaxAsync(homepage.url.aticleList, homepage.indexList).done(function(res) {
                    var data = res.data;
                    if (isNull(data)) {
                        return layer.msg("没有更多内容了!");
                    }
                    $("#lastHid").val(data.next);
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