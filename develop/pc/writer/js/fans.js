var layer = layui.layer,
    laytpl = layui.laytpl,
    laypage = layui.laypage;

$(function() {
    var getFansScriptHtml = $("#getFansScript").html();
    var id = GetQueryString("id") || "";
    $("#fansA").attr("href", "fans.html?id=" + id);
    $("#fansFanA").attr("href", "fans_fan.html?id=" + id);
    $("#fansLove").attr("href", "fans_love.html?id=" + id);

    function fans() {};
    fans.prototype = {
        rows: 5,
        page: 1,
        Request: {
            getDataUrl: "cms_new/queryArticelListByUserId"
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
            //轮播图
            imgCarousel('.carousel_box');
            //设置标题审核状态的函数：
            setTitIcon('.art_title');
        },
        getDataPage: function(page) {
            var Response = JSON.stringify({
                pagination: {
                    page: page,
                    rows: start.rows
                },
                releaseId: id
            });
            var res = reqAjax(start.Request.getDataUrl, Response);
            laytpl(getFansScriptHtml).render(res.data, function(html) {
                $("#r_articalList").html(html);
            });
            //轮播图
            imgCarousel('.carousel_box');
            //设置标题审核状态的函数：
            setTitIcon('.art_title');
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
        releaseId: id
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



//设置标题审核状态的函数：
function setTitIcon(html) {
    $(html).each(function(i, e) {
        if ($(this).attr('isExamine') == "0" && $(this).attr('isDraft') == "0") {
            $(this).parent().find('.artTit_icon').html('未通过').css({
                'background': 'red'
            });
        } else if ($(this).attr('isExamine') == "1" && $(this).attr('isDraft') == "0") {
            $(this).parent().find('.artTit_icon').html('已发表').css({
                'background': '#60D295'
            });
        } else if ($(this).attr('isExamine') == "2" && $(this).attr('isDraft') == "0") {
            $(this).parent().find('.artTit_icon').html('待审核').css({
                'background': '#ffc06f'
            });
        } else if ($(this).attr('isExamine') == "3" && $(this).attr('isDraft') == "0") {
            $(this).parent().find('.artTit_icon').html('屏蔽').css({
                'background': '#87bfff'
            });
            $(this).parent().parent().find('.art_revise').html('').css({
                'cursor': 'auto',
                'margin-right': '0'
            });
        } else if ($(this).attr('isDraft') == "1") {
            $(this).parent().find('.artTit_icon').html('草稿').css({
                'background': 'gray'
            });
        }
        if ($(this).attr('stick') == '1') {
            $(this).parent().find('.art_stick').html('置顶').css({
                'background': '#ff8b6f',
                'padding': '1px 6px',
                'color': '#fff',
                'margin-right': '10px'
            });
        }
    })
}

//轮播图函数：
function imgCarousel(html) {
    $(html).each(function(i, e) {
        var imgList = $(e).find(".art_imgBox");
        var imgs = $(e).find('.art_imgBox img');
        var imgsLength = imgs.length;
        var leftArrow = $(e).find('.leftArrow');
        var rightArrow = $(e).find('.rightArrow');
        imgList.css({
            'width': 100 * imgsLength
        });
        if (imgsLength > 1) {
            leftArrow.addClass('show');
            rightArrow.addClass('show');
            $(e).parent().find('.artTit_imgs').html('3图').css({
                'background': 'pink',
                'margin-left': '14px'
            });
            var cloneNode = $(e).find('.art_imgBox img:first-child').clone(true);
            imgList.css({
                'width': 100 * (imgsLength + 1)
            });
            imgList.append(cloneNode);
            var flag = true;
            var index = 0;

            function circle() {
                imgList.stop().animate({
                    left: 100 * index
                }, 500, function() {
                    flag = true;
                })
            }

            leftArrow.click(function(event) {
                clearInterval(timer);
                if (flag) {
                    flag = false;
                    index++;
                    if (index == 1) {
                        index = -3;
                        imgList.css("left", -300)
                        index++;
                        circle();
                        return;
                    }
                    console.log(index);
                    circle();
                    return;
                }
            });

            rightArrow.click(function(event) {
                clearInterval(timer);
                if (flag) {
                    flag = false;
                    index--;
                    console.log(index);
                    if (index <= -4) {
                        index = 0;
                        imgList.css("left", 0)
                        index--;
                        circle();
                        return;
                    }
                    circle();
                    return;
                }
            });

            var timer = setInterval(function() {
                index--;
                if (index <= -4) {
                    index = 0;
                    imgList.css("left", 0)
                    index--;
                    circle();
                    return;
                }
                circle();
                return;
            }, 3000)
        } else {
            leftArrow.addClass('hide');
            rightArrow.addClass('hide');
        }

    })
}