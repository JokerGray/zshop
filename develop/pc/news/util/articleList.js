var layer = layui.layer,
    laytpl = layui.laytpl;
$(function() {
    var recommendListtpl = $("#recommendList").html();
    var userId = localStorage.getItem("userId") || "1";
    var toutiao = function() {
        this.flag = false;
        this.url = {
            channel: "cms_back/selectAllChannel",
            ArticelNewList: "cms_new/queryReArticleList",
            hot: 'cms_new/querSearchRecordHotName'
        };
        this.listData={
            "channelId": GetQueryString("id"),
            "userId":userId,
            "pagination": {
                "page": 1,
                "rows": 16
            }
        }
    };
    toutiao.prototype = {
        getImageList: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.ArticelNewList, d).done(function(res) {   
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var data = res.data;
                        laytpl(recommendListtpl).render(data, function(html) {
                            $("#container").append(html);
                            _this.flag = true;
                        });
                    }
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

    // 显示列表数据
    homepage.getImageList(homepage.listData);

    //右侧数据
    //搜索框
    // reqAjaxAsync(homepage.url.hot).done(function(res) {
    //     console.log(res);
    //     if (res.code == 1) {
    //         var li = '';
    //         for (var i = 0; i < res.data.length; i++) {
    //             li += '<li><a href="search.html?search=' + res.data[i] + '">' + res.data[i] + '</a></li>';
    //         }
    //         $('#searchListBox ul').html(li);
    //         $('.tt-autocomplete input').attr('placeholder', '大家都在搜：' + res.data[0]);
    //     }
    // });
    // $('.searchInp').click(function(e) {
    //     stopPropagation(e);
    //     $('#searchListBox').addClass('show').removeClass('hide');
    // })

    //主体内容滑动的时候
    $(document).scroll(function() {
        // 瀑布流
        if (homepage.flag) {
            waterfall({
                last: $(".list_item:last"),
                end: 0
            }, function() {
                ++homepage.listData.pagination.page;
                homepage.flag = false; //重置标记
                reqAjaxAsync(homepage.url.ArticelNewList, homepage.listData).done(function(res) {
                    var data = res.data;
                    if (isNull(data)) {
                        return layer.msg("没有更多内容了!");
                    }
                    laytpl(recommendListtpl).render(data, function(html) {
                        $("#container").append(html);
                        homepage.flag = true;
                    });
                });

            });
        }
    }).click(function() {
        $('#searchListBox').addClass('hide').removeClass('show');
    });
    
    //没有引入index.js，public.html公共的点击更新，下拉查看更多；
    $("#updateList").click(function() {
        ++homepage.listData.pagination.page;
        var recommendList = $("#recommendList").html();
        homepage.flag = false; //重置标记
        reqAjaxAsync(homepage.url.ArticelNewList, homepage.listData).done(function(res) {
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
    //js over
});