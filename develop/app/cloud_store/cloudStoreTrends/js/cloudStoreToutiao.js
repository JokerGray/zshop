// qr右侧嵌入
$(function() {
    var iframe = $("#sendIframe");
    var reportIframe = $("#reportIframe");
    var src = location.search;
    var url = "/writer/login.html";
    var reportUrl = "/writer/report.html";
    if (isNull(src)) {
        iframe.attr("src", url);
        return false;
    }
    iframe.attr("src", url + src + "&isShop=1&send=1");
    setTimeout(function() {
        reportIframe.attr("src", reportUrl + src + "&isShop=2&send=1")
    }, 1000);
});

(function($) {
    var RESULT_URL = {
        verificationByUserId: "cms_back/verificationByUserId",
        shopHomeArticles: "cms_new/queryArticelNewList", //头条列表
        getShop: "shop/getShopByID", //选择店铺名称
    }

    var shopId = getUrlParams("shopId") || 59;
    var userId = getUrlParams("userId") || 0;
    var salt = getUrlParams("salt") || "";
    var backWebRoot = getUrlParams("backWebRoot");
    var page = 1;
    var rows = 5;
    var pageTips = 4;
    var clciknum = 1;
    var layer = layui.layer,
        laytpl = layui.laytpl;

    //修改时间
    setInterval(clock, 1000);
    getUserId({
        userId: userId,
        salt: salt
    })

    //发布头条
    $("#publishTrends ").click(function() {
        location.reload();
    });

    //头条管理
    $("#managementTrends").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(".dynamicDetails").css("visibility", "hidden");
        $(".dynamicDetails").hide();
        $(".establish_circle").css("visibility", "hidden");
        $(".establish_circle").hide();
        $(".title_management").css("visibility", "visible");
        $(".title_management").show();
    });

    //手机框 发布头条
    $(".publishTrends ").click(function() {
        $(".dynamicDetails").show();
        $(".dynamicDetails").css("visibility", "visible");
    });

    // //tab栏切换
    // $(".checktags").on("click", 'li', function () {
    //     $(this).addClass("active").siblings().removeClass("active");
    //     var index = $(this).index();
    //     if (index == 2) {
    //         return layer.msg("此功能正在开发中，敬请期待！")
    //     }
    //     changeMenuClik($(this).attr("data-id"), "http://192.168.13.142:8080/zxcity_ms2");
    // })

    //tab栏切换
    $(".checktags").on("click", 'li', function() {
        $(this).addClass("active").siblings().removeClass("active");
        var index = $(this).index();
        changeMenuClik(index, backWebRoot);
        if (index == 0) {
            changeMenuClik(1102, backWebRoot);
            //获取中间详情列表
            getVideoList(page);
        }else if (index == 1) {
            changeMenuClik(1107, backWebRoot);
          } else if (index == 2) {
            //return layer.msg("此功能正在开发中，敬请期待！")
            changeMenuClik(1108, backWebRoot);
          } else if (index == 3) {
            changeMenuClik(1109, backWebRoot);
          }
        // if (index == 0) {
        //     changeMenuClik(1, backWebRoot);
        //     //获取中间详情列表
        //     getVideoList(page);
        //   } else if (index == 1) {
        //     changeMenuClik(2, backWebRoot);
        //   } else if (index == 2) {
        //     //return layer.msg("此功能正在开发中，敬请期待！")
        //     changeMenuClik(3, backWebRoot);
        //   } else if (index == 3) {
        //     changeMenuClik(4, backWebRoot);
        //   }
    });

    //根据url查询商户地址传过来的参数
    function getUserId(data) {
        reqAjaxAsync(RESULT_URL.verificationByUserId, JSON.stringify(data)).then(function(res) {
            if (res.code == 1) {
                userId = res.data.userId;
                initial(res.data.userId);
            }
        })
    }
    // 初始化
    function initial(userId) {
        //获取头条列表
        getTextList(userId);
        //修改店名
        // var parm = {
        //     id: shopId,
        // }
        // reqAjaxAsync(RESULT_URL.getShop, JSON.stringify(parm)).done(function(res) {
        //     if (res.code == 1) {
        //         var data = res.data;
        //         var name = data.shopName;
        //         $(".onetitle").html(name);
        //     }
        // });
    }
    //头条列表
    function getTextList(userId) {
        var parem = {
            releaseId: userId,
            pagination: {
                "page": page,
                "rows": rows
            }
        }

        reqAjaxAsync(RESULT_URL.shopHomeArticles, JSON.stringify(parem))
            .done(function(res) {
                if (res.code == 1) {
                    var data = res.data;
                    if (data == null || data == "undefind" || data == "") {
                        return layer.msg("暂无数据");
                    }
                    var total = res.total;
                    var len = data.length;
                    if (len == 0) {
                        //无内容时
                        $(".noTrends").show();
                        $(".trendsDetails").hide();
                    } else {
                        $(".trendsDetails").show();
                        $(".noTrends").hide();

                        //出现加载更多的按钮
                        if (len > pageTips) {
                            $(".trendsDetails .readMore").show();
                        } else {
                            $(".trendsDetails .readMore").hide();
                        }
                        laytpl($("#layuiTpl").html()).render(data, function(html) {
                            $(".trendsDetails .appendDetails").append(html);
                        });

                        //详情列表加载更多点击事件//分页
                        $(".trendsContent .readMore").click(function() {
                            clciknum++;
                            var parem = {
                                releaseId: userId,
                                pagination: {
                                    "page": clciknum,
                                    "rows": rows
                                }
                            }
                            reqAjaxAsync(RESULT_URL.shopHomeArticles, JSON.stringify(parem))
                                .done(function(res) {
                                    if (res.code == 1) {
                                        var data = res.data;
                                        if (!data) {
                                            return layer.msg("暂无数据");
                                        }
                                        var total = res.total;
                                        var len = data.length;
                                        //出现加载更多的按钮
                                        if (len > pageTips) {
                                            $(".trendsDetails .readMore").show();
                                        } else {
                                            $(".trendsDetails .readMore").hide();
                                        }
                                        laytpl($("#layuiTpl").html()).render(data, function(html) {
                                            $(".trendsDetails .appendDetails").append(html);
                                        });

                                    }
                                })
                        });
                    }

                }
            })
    }

    //获取时间
    function clock() {
        var today = new Date();
        var hours = today.getHours();
        var min = today.getMinutes();
        var seconds = today.getSeconds();
        ++seconds;
        if (hours < 10) {
            hours = '0' + hours
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        } else if (seconds > 59)(
            seconds = '00', min++
        )
        if (min < 10) {
            min = '0' + min;
        }
        var str = hours + ':' + min + ':' + seconds;
        $('.time_tab').html(str);
    }

    //跳转方法
    function changeMenuClik(menuid, backCtx) {
        if (typeof(exec_obj) == 'undefined') {
            exec_obj = document.createElement('iframe');
            exec_obj.name = 'IFRAME_TMPA';
            exec_obj.src = backCtx + '/assets/common.html?method=changeMenuClik&menuid=' + menuid + '&r=' + Math.random();
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
        } else {
            exec_obj.src = backCtx + '/assets/common.html?method=changeMenuClik&menuid=' + menuid + '&r=' + Math.random();
        }
    }

    //js over
})(jQuery)