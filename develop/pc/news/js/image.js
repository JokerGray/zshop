var layer = layui.layer,
    laytpl = layui.laytpl;
$(function() {
    var imageListTplHtm = $("#imageListTpl").html();
    var userId = localStorage.getItem("userId") || "1";
    var toutiao = function() {
        this.flag = false;
        this.url = {
            channel: "cms_back/selectAllChannel",
            aticleList: "cms_new/queryReArticleListImgs",
            hot: 'cms_new/querSearchRecordHotName'
        };
    };
    toutiao.prototype = {
        getImageList: function(d) {
            var _this = this;
            reqAjaxAsync(_this.url.aticleList, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var data = res.data;
                        $("#lastHid").val(data.next);
                        laytpl(imageListTplHtm).render(data, function(html) {
                            $("#imgList").append(html);
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
    homepage.getImageList({
        "userId": userId,
        "minbehottime": 0,
        "pagination": {
            "rows": 16
        }
    });

    //右侧数据
    //搜索框
    reqAjaxAsync(homepage.url.hot).done(function(res) {
        if (res.code == 1) {
            var li = '';
            for (var i = 0; i < res.data.length; i++) {
                li += '<li><a href="search.html?search=' + res.data[i] + '">' + res.data[i] + '</a></li>';
            }
            $('#searchListBox ul').html(li);
            $('.tt-autocomplete input').attr('placeholder', '大家都在搜：' + res.data[0]);
        }
    });
    $('.searchInp').click(function(e) {
        stopPropagation(e);
        $('#searchListBox').addClass('show').removeClass('hide');
    })

    //主体内容滑动的时候
    $(document).scroll(function() {
        // 瀑布流
        if (homepage.flag) {
            waterfall({
                last: $("#imgList li:last"),
                end: 0
            }, function() {
                var d = {
                    "userId": userId,
                    "minbehottime": $("#lastHid").val(),
                    "pagination": {
                        "rows": 4
                    }
                };
                homepage.flag = false; //重置标记
                reqAjaxAsync(homepage.url.aticleList, d).done(function(res) {
                    var data = res.data;
                    if (isNull(data)) {
                        return layer.msg("没有更多内容了!");
                    }
                    $("#lastHid").val(data.next);
                    laytpl(imageListTplHtm).render(data, function(html) {
                        $("#imgList").append(html);
                        homepage.flag = true;
                    });
                });

            });
        }
    }).click(function() {
        $('#searchListBox').addClass('hide').removeClass('show');
    });
    //js over
});