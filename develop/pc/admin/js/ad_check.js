/**
 * author   robin
 * name     文章审核
 * date     2017/5/6
 */
var layer = layui.layer,
    laypage = layui.laypage,
    laydate = layui.laydate,
    laytpl = layui.laytpl;
$(function() {
    var AdCheck = function() {
        this.page = 1;
        this.rows = 5;
        this.REQUEST_URL = {
            getData: "selectAdvList", //获取表格数据
            querySelectAdv: "querySelectAdv", //查询广告详情
            queryAdvstate: "queryAdvstate" // 驳回
        };
    };

    AdCheck.prototype = {
        // 获取页面数据
        getDataAjax: function(d) {
            var _this = this;
            var url = start.REQUEST_URL.getData;
            reqNewAjaxAsync(url, d).done(function(res) {
                if (res.code == "1") {
                    start.pages = Math.ceil(res.total / start.rows);
                    res.pages = _this.pages;
                    var getTpl = $("#adList").html();
                    laytpl(getTpl).render(res, function(html) {
                        $("#statement_con").html(html);
                    });
                    getPage(_this.pages, d);
                } else {
                    layer.msg(res.msg);
                }
            });
        },
        getDataPageAjax: function(d) {
            var _this = this;
            var url = _this.REQUEST_URL.getData;
            reqNewAjaxAsync(url, d).done(function(res) {
                // 塞进模板内操作
                res.pages = _this.pages;
                res.curr = d.pagination.page; //当前页
                res.rows = _this.rows;
                if (res.code == "1") {
                    var getTpl = $("#adList").html();
                    laytpl(getTpl).render(res, function(html) {
                        $("#statement_con").html(html);
                    });
                } else {
                    layer.msg(res.msg);
                }
            });
        },
        // 驳回
        noPassAjax: function(d) {
            var _this = this;
            var url = _this.REQUEST_URL.queryAdvstate;
            reqNewAjaxAsync(url, d).done(function(res) {
                $("#notPassModal").modal("hide");
                if (res.code == 1) {
                    $("#notPassTxt").val("");
                }
                layer.msg(res.msg);
            });
        },
        // 查看
        getViewAjax: function(d) {
            var _this = this;
            var url = _this.REQUEST_URL.querySelectAdv;
            reqNewAjaxAsync(url, d).done(function(res) {
                var item = res.data;
                var scCmsAdvLable = item.scCmsAdvLable.split(",");
                var span = '';
                $.each(scCmsAdvLable, function(i, v) {
                    span += '<span class="adDConTag">' + v + '</span>';
                });
                $("#adDConTagList").html(span);
                $("#scCmsAdvPlatForm").html(getPlatform(item.scCmsAdvPlatForm));
                $("#scCmsAdvStart").html((item.scCmsAdvStart).replace(".0", "") + "-" + (item.scCmsAdvEnd).replace(".0", ""));
                $("#scCmsAdvSourceName").html(item.scCmsAdvSourceName);
                $("#scCmsAdvCreateTime").html((item.scCmsAdvCreateTime).replace(".0", ""));
                // 广告类型
                if (item.scCmsAdvSourceType == 2001) {
                    $(".adDConRIcon").html(item.scCmsAdvSourceName || "广告");
                } else {
                    $(".adDConRIcon").html("外部广告");
                }
                if(item.scCmsAdvSourceType == 2002) {
                    $('#adDTypeHref').html(JSON.parse(item.scCmsAdvjump).url);
                    $('#adDTypeHrefBox').show();
                } else {
                    $('#adDTypeHrefBox').hide();
                }
                // 广告样式
                var abStyleObj = JSON.parse(item.scCmsAdvStyleRes[0].scCmsAdvStyleResJson);
                if (abStyleObj.length == 1) {
                    $('#adDConRSetImg').addClass('show').removeClass('hide');
                    $('#adDConRSetImgList').addClass('hide').removeClass('show');
                    $('#adDConRSetVideo').addClass('hide').removeClass('show');
                    $('#adDConRType').html('(单图)');

                    $('#advStyleResTitle').html(item.scCmsAdvStyleRes[0].scCmsAdvStyleResTitle);
                    $('#adDConRSetRight').attr('src', abStyleObj[0].resourcesUrl);
                } else if (abStyleObj.length == 2) {
                    $('#adDConRSetImg').addClass('hide').removeClass('show');
                    $('#adDConRSetImgList').addClass('hide').removeClass('show');
                    $('#adDConRSetVideo').addClass('show').removeClass('hide');
                    $('#adDConRType').html('(视频)');

                    $('#advStyleVideoTitle').html(item.scCmsAdvStyleRes[0].scCmsAdvStyleResTitle);
                    for (var i = 0; i < abStyleObj.length; i++) {
                        if (abStyleObj[i].resourcesType == 'video') {
                            var videoUrl = abStyleObj[i].videoUrl;
                        } else if (abStyleObj[i].resourcesType == 'cover') {
                            var resourcesUrl = abStyleObj[i].resourcesUrl;
                        }
                    }
                    $('#adDConRSetVideoUrl').html('<video src="' + videoUrl + '" poster="' + resourcesUrl + '" controls="controls"></video>');
                } else if (abStyleObj.length == 3) {
                    $('#adDConRSetImg').addClass('hide').removeClass('show');
                    $('#adDConRSetImgList').addClass('show').removeClass('hide');
                    $('#adDConRSetVideo').addClass('hide').removeClass('show');
                    $('#adDConRType').html('(三图)');
                    var str = '';
                    for (var i = 0; i < abStyleObj.length; i++) {
                        str += '<img src="' + abStyleObj[i].resourcesUrl + '" alt="">';
                    }
                    $('#advStyleImgLTitle').html(item.scCmsAdvStyleRes[0].scCmsAdvStyleResTitle);
                    $('#adDConRSetImgsBox').html(str);
                }
            });
        }
    };
    // 开始调用
    var start = new AdCheck();
    var data = {
        pagination: {
            page: 1,
            rows: start.rows
        }
    };
    start.getDataAjax(data);
    // 获取下拉
    getvAdvStyleName($("#advStyleNameSec"), "");

    // 查询搜索
    $("#search_icon").click(function() {
        var data = $("#selectForm").serializeObject();
        data.pagination = {
            page: 1,
            rows: start.rows
        };
        start.getDataAjax(data);
    });

    // 监听模态框关闭事件
    $('#advertiseDetail').on('hide.bs.modal', function() {
        //清空模态框内容
        $('#adDConRSetVideoUrl').html("");
    })

    // 点击查看
    $("#statement_con").on("click", ".viewBtn", function() {
        var flag = $(this).attr("flag");
        var scCmsAdvId = $(this).attr("scCmsAdvId");
        var scCmsAdvStyleName = $(this).attr("scCmsAdvStyleName");
        var scCmsAdvPlaceName = $(this).attr("scCmsAdvPlaceName");
        $("#scCmsAdvPlaceName").html(scCmsAdvPlaceName);
        $("#scCmsAdvStyleName").html(scCmsAdvStyleName);
        $("#scCmsAdvIdHid").val(scCmsAdvId);
        if (flag == 1) {
            $("#advertiseDBtnBox").hide();
        } else {
            $("#advertiseDBtnBox").show();
        }
        start.getViewAjax({
            scCmsAdvPlaceId: scCmsAdvId
        });
    });

    // 模态框通过
    $("#passBtn").click(function() {
        var scCmsAdvId = $("#scCmsAdvIdHid").val();
        layer.confirm("是否通过", {
            title: "提示"
        }, function(index) {
            start.noPassAjax({
                scCmsAdvId: scCmsAdvId,
                scCmsAdvExamine: 1,
                scCmsAdvState: 1
            });
            var data = {
                pagination: {
                    page: 1,
                    rows: start.rows
                }
            };
            start.getDataAjax(data);
            layer.close(index);
            $("#advertiseDetail").modal("hide");
        });
    });

    // 通过
    $("#statement_con").on("click", ".passBtn", function() {
        var scCmsAdvId = $(this).attr("scCmsAdvId");
        layer.confirm("是否通过", {
            title: "提示"
        }, function(index) {
            start.noPassAjax({
                scCmsAdvId: scCmsAdvId,
                scCmsAdvExamine: 1,
                scCmsAdvState: 1
            });
            var data = {
                pagination: {
                    page: 1,
                    rows: start.rows
                }
            };
            start.getDataAjax(data);
            layer.close(index);
        });
    });


    // 驳回
    $("#statement_con").on("click", ".noPassBtn", function() {
        var scCmsAdvId = $(this).attr("scCmsAdvId");
        var scCmsAdvExamine = $(this).attr("scCmsAdvExamine");
        $("#scCmsAdvIdHid").val(scCmsAdvId);
        $("#scCmsAdvExamineHid").val(scCmsAdvExamine);
    });
    // 不通过
    $("#notpassBtn").click(function() {
        var scCmsAdvId = $("#scCmsAdvIdHid").val();
        var scCmsAdvExamine = $("#scCmsAdvExamineHid").val();
        if (scCmsAdvExamine == 1) {
            start.noPassAjax({
                scCmsAdvId: scCmsAdvId,
                scCmsAdvExamine: 2,
                scCmsAdvState: 2,
                scCmsAdvReason: $("#notPassTxt").val()
            });
        } else {
            start.noPassAjax({
                scCmsAdvId: scCmsAdvId,
                scCmsAdvExamine: 2,
                scCmsAdvReason: $("#notPassTxt").val()
            });
        }
        var data = {
            pagination: {
                page: 1,
                rows: start.rows
            }
        };
        start.getDataAjax(data);
    });


    //调用分页
    function getPage(pages, data) {
        laypage({
            cont: 'pageAd', //容器
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.page = obj.curr;
                data.pagination.page = obj.curr;
                start.getDataPageAjax(data);
            }
        });
    }

    //点击日期获取时间
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var startDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                endDate.start = datas //将结束日的初始值设定为开始日
                if (!isNull($("#end").val())) {
                    start.startTime = datas;
                    start.endTime = $("#end").val();
                    console.log(datas, $("#end").val())
                }
            }
        };

        var endDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                if (!isNull($("#start").val())) {
                    start.startTime = $("#start").val();
                    start.endTime = datas;
                    console.log($("#start").val(), datas)
                }
            }
        };

        $('#start').click(function() {
            startDate.elem = this;
            laydate(startDate);
        });

        $('#end').click(function() {
            endDate.elem = this;
            laydate(endDate);
        });
    });
    // js over
});