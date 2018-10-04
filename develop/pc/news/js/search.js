var layer = layui.layer,
    laytpl = layui.laytpl;
$(function() {
    var iptVal;
    var start, S = function() {
        this.pages = 1;
        this.page = 1;
        this.rows = 10;
        this.recommendList = $("#recommendList").html();
        this.flag = false;
        this.url = {
            userId: localStorage.getItem("userId") || "1",
            channel: "cms_back/selectAllChannel",
            aticleList: "cms_new/searchArticelList",
            queryHotSearchWord: "cms_new/queryHotSearchWord", //热门词汇
            relatedSearch: "cms_new/relatedSearch" //相关搜索
        }
    };
    S.prototype = {
        init: function() {
            var _this = this;
            var search =iptVal= GetQueryString2("search");
            $("#searchTxt").val(search);
            // 启动导航
            getChannel({
                url: _this.url.channel,
                num: 0,
                dom: $("#navUl")
            });
            //获取文章列表
            start.getRecommendList({
                "searchKey": search,
                "pagination": {
                    "page": start.page,
                    "rows": start.rows
                }
            });
            // 相关搜索
            start.getSearchList({
                "searchKey": GetQueryString2("search")
            });
            // 热门词汇
            start.getNameList({
                "searchType": 1,
                "pagination": {
                    "page": 1,
                    "rows": 10
                }
            });
        },
        // 获取相关搜索
        getSearchList: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.relatedSearch, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var str = "";
                        $.each(res.data, function(i, v) {
                            str += '<li class="fl"><a href="search.html?search=' + v + '">' + v + '</a></li>';
                        });
                        $("#nameUl").html(str);
                    }
                } else {
                    layer.msg(res.msg);
                }
            });
        },
        // 获取热门词汇
        getNameList: function(d) {
            var _this = this;
            reqAjaxAsync(this.url.queryHotSearchWord, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        var str = "";
                        $.each(res.data, function(i, v) {
                            if (i < 4) {
                                str += '<li><span class="num num' + (i + 1) + '">' + (i + 1) + '</span><a href="search.html?search=' + (v.searchRecordName) + '">' + v.searchRecordName + '</a></li>';
                            } else {
                                str += '<li><span class="num">' + (i + 1) + '</span><a href="search.html?search=' + (v.searchRecordName) + '">' + v.searchRecordName + '</a></li>';
                            }
                            // str += '<li class="fl"><a href="search.html?search=' + (v.searchRecordName) + '">' + v.searchRecordName + '</a></li>';
                        });
                        $("#hotUl").html(str);
                    }
                } else {
                    layer.msg(res.msg);
                }
            });
        },
        // 获取文章列表
        getRecommendList: function(d) {
            console.log(111);
            var _this = this;
            $("#container").html("");
            reqAjaxAsync(this.url.aticleList, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        _this.pages = Math.ceil(res.total / _this.rows);
                        var data = res.data;
                        laytpl(_this.recommendList).render(data, function(html) {
                            $("#container").html(html);
                        });
                        var roxlength=$("body .list_item .title");
                        for(i=0;i<roxlength.length;i++){
                            var reg = new RegExp("(" + iptVal.replace(/,/, "|") + ")", "g");
                            $(roxlength[i]).html( $(roxlength[i]).html().replace(reg,"<font color='red'>$1</font>"))
                        }
                        $(".blankPage").hide();
                    }else{
                        $(".blankPage").show();
                    }
                } else {
                    layer.msg(res.msg);
                }
            });
        }
    };
    // 初始化
    start = new S();
    start.init();
    // 搜索点击
    $("#searchA").click(function() {
        $("#container").html("");
        iptVal=$("#searchTxt").val()
        start.getRecommendList({
            "searchKey": iptVal,
            "pagination": {
                "page": 1,
                "rows": start.rows
            }
        });
    });
    // 搜索框键盘事件
    // $("#searchTxt").keyup(function() {
    //     $("#container").html("");
    //     start.getRecommendList({
    //         "searchKey": $(this).val(),
    //         "pagination": {
    //             "page": 1,
    //             "rows": start.rows
    //         }
    //     });
    // });

    $("#searchTxt").bind("keydown",function(e){
    　　// 兼容FF和IE和Opera
    　　var theEvent = e || window.event;
    　　var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        iptVal=$(this).val();
    　　 if (code == 13) {
            $("#container").html("");
            start.getRecommendList({
                "searchKey": iptVal,
                "pagination": {
                    "page": 1,
                    "rows": start.rows
                }
            });
    　　}
    });

    //主体内容滑动的时候
    $(document).scroll(function() {
        var end = 0;
        // 瀑布流
        waterfall({
            last: $(".list_item:last"),
            end: end
        }, function() {
            start.page++;
            var d = {
                "searchKey": $("#searchTxt").val(),
                "pagination": {
                    "page": start.page,
                    "rows": start.rows
                }
            };
            var recommendList = $("#recommendList").html();
            start.flag = false; //重置标记
            if (start.page > start.pages) {
                end = 1;
                return false;
            }
            reqAjaxAsync(start.url.aticleList, d).done(function(res) {
                var data = res.data;
                if (isNull(data)) {
                    end = 1;
                    return layer.msg("没有更多内容了!");
                }
                end = 0;
                $("#lastHid").val(data.next);
                laytpl(recommendList).render(data, function(html) {
                    $("#container").append(html);
                    start.flag = true;
                    var roxlength=$("body .list_item .title");
                    for(i=0;i<roxlength.length;i++){
                        var reg = new RegExp("(" + iptVal.replace(/,/, "|") + ")", "g");
                        $(roxlength[i]).html( $(roxlength[i]).html().replace(reg,"<font color='red'>$1</font>"))
                    }
                });
            });
        });
    });
});