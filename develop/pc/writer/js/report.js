var laypage = layui.laypage;
var laytpl = layui.laytpl;
var kid = localStorage.getItem('provinceCode');
var REQUEST_URL = {
    getScCmsSpecialsName: "cms_new/getScCmsSpecialsName", //投稿到专题
    cancelScCmsArsp: "cms_new/delScCmsArsp",
    addScCmsArsp: "cms_new/addScCmsArsp"
};
$(function() {
    // 获取当前页面参数拼接到发表页
    $("a[type='publish']").attr("href", "send_article.html" + location.search);

    $('.tabinner li').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    })

    var allData;
    if (GetQueryString('IsDraft') == "1") {
        $('#navDraft').click();
        allData = {
            pagination: {
                page: start.page,
                rows: start.rows
            },
            releaseId: start.userId,
            IsDraft: 1
        };
        start.getAjax('selectArticleByStatus', JSON.stringify(allData), allData);
    } else {
        allData = {
            pagination: {
                page: start.page,
                rows: start.rows
            },
            releaseId: start.userId
        };
        start.getAjax("selectArticleByStatus", JSON.stringify(allData), allData);
    }

    $('#navAll').click(function() {
        allData = {
            pagination: {
                page: start.page,
                rows: start.rows
            },
            releaseId: start.userId
        };
        start.getAjax('selectArticleByStatus', JSON.stringify(allData), allData);
    });

    $('#navPublished').click(function() {
        allData = {
            pagination: {
                page: start.page,
                rows: start.rows
            },
            releaseId: start.userId,
            isExamine: 1,
            IsDraft: 0
        };
        start.getAjax('selectArticleByStatus', JSON.stringify(allData), allData);
    });

    $('#navFail').click(function() {
        allData = {
            pagination: {
                page: start.page,
                rows: start.rows
            },
            releaseId: start.userId,
            isExamine: 0,
            IsDraft: 0
        };
        start.getAjax('selectArticleByStatus', JSON.stringify(allData), allData);
    });

    $('#navDraft').click(function() {
        allData = {
            pagination: {
                page: start.page,
                rows: start.rows
            },
            releaseId: start.userId,
            IsDraft: 1
        };
        start.getAjax('selectArticleByStatus', JSON.stringify(allData), allData);
    });

    //已通过的文章不能投稿至专题：
    $('#r_articalList').on('click', '.artOperate_btn', function() {
            if ($(this).attr('isExamine') == 1 && $(this).attr('isDraft') == 0) {
                $(this).parent().find('.contriOperate').addClass('hide').removeClass('show');
            } else {
                $(this).parent().find('.contriOperate').addClass('show').removeClass('hide');
            }
        })
        //点击更多操作：
    $('#r_articalList').on('click', '.artOperate_btn', function(e) {
            e = window.event || e;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            $('.operateDraw').addClass('hide').removeClass('show');
            $(this).parent().find('.operateDraw').toggleClass('hide').toggleClass('show');
            //点击删除按钮：
            $(this).parent().find('.delOperate').click(function() {
                    var articleId = $(this).attr('articleId');
                    start.deleteList(articleId);
                    start.getAjax("selectArticleByStatus", JSON.stringify(allData), allData);
                })
                //点击投稿至专题：
            $(this).parent().find('.contriOperate').click(function() {
                clickHtml = $(this);
                $('#specialConBtn').attr('articleId', $(this).attr('articleId'));
                $('#specialConBtn').attr('specialId', $(this).attr('specialId'));
                if ($(this).attr('specialId')) {
                    $(this).attr('data-toggle', '');
                    var data = JSON.stringify({
                        'arsps': [{
                            'scCmsSpecialId': $('#specialConBtn').attr('specialId'),
                            'scCmsArticleId': $('#specialConBtn').attr('articleId')
                        }]
                    });
                    cancelSpecialAjax(data);
                } else {
                    $(this).attr('data-toggle', 'modal');
                    //获取专题
                    getScCmsSpecialsName(REQUEST_URL.getScCmsSpecialsName);
                }
            })
        })
        //模态框专题选中
    $("#specialUl").on('click', 'li', function() {
        $("#specialUl li").find(".radio").removeClass("checked");
        $(this).find(".radio").addClass("checked");
    });
    //专题搜索点击
    $("#searchA").click(function() {
        var scCmsSpecialName = $("#searchInp").val().trim();
        var data = JSON.stringify({
            scCmsSpecialName: scCmsSpecialName
        });
        searchSpecial(REQUEST_URL.getScCmsSpecialsName, data);
    });

    //点击确认按钮添加文章至专题：
    $('#specialConBtn').click(function() {
        var specialId = $(this).attr('specialId');
        var articleId = $(this).attr('articleId');
        if (!clickHtml.attr('specialId')) {
            sendSpecial(articleId);
        }
    })

    //点击其他地方删除按钮消失:
    $(document).click(function() {
        $('.operateDraw').addClass('hide').removeClass('show');
    })

    //点击置顶：
    $('#r_articalList').on('click', '.stickArtBtn', function() {
        var articleId = $(this).parent().find('.operateDraw').attr('articleId');
        var releaseTime = $(this).parent().siblings('.art_info').find('.releaseTime').html();
        start.stickList(articleId, releaseTime);
        start.getAjax("selectArticleByStatus", JSON.stringify(allData), allData);
    })

    //点击修改：
    $('#r_articalList').on('click', '.art_revise', function() {
        console.log($(this));
        //判断类型为文章还是图集还是视频：
        if ($(this).attr('typeCode') == '1001') { //普通文章
            console.log('普通文章');
            window.location.href = 'send_article.html?articleId=' + $(this).attr('articleId');
        } else if ($(this).attr('typeCode') == '1002') { //图集
            console.log('图集');
            window.location.href = 'send_atlas.html?articleId=' + $(this).attr('articleId');
        } else if ($(this).attr('typeCode') == '1003') { //视频
            console.log('视频');
            window.location.href = 'send_video.html?articleId=' + $(this).attr('articleId');
        }
    })

});

var start = {
    apikey: localStorage.getItem('apikey') || "",
    version: localStorage.getItem('version') || "1",
    userId: localStorage.getItem('userId') || '',
    rows: 5,
    page: 1,
    getAjax: function(cmd, data, param) {
        $.ajax({
            type: "POST",
            url: '/zxcity_restful/ws/rest',
            data: {
                "cmd": "cms_back/" + cmd,
                "data": data,
                "version": start.version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", start.apikey);
            },
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    $('#page').removeClass('hide');
                    $('#page').addClass('show');
                    var getTpl = $("#articalList").html();
                    laytpl(getTpl).render(data.data, function(html) {
                        $("#r_articalList").html(html);
                    });

                    start.judge('.art_type', '暂无分类');
                    start.judge('.art_data span:nth-child(1)', '0');
                    start.judge('.art_data span:nth-child(4)', '0');

                    var totalList = data.total;
                    //总页数：
                    var totalPage = Math.ceil(totalList / start.rows);
                    if (totalList >= 2) {
                        $('#page').removeClass('hide');
                        $('#page').addClass('show');
                        // console.log(param);
                        start.getPage(totalPage, param);
                    } else {
                        $('#page').removeClass('show');
                        $('#page').addClass('hide');
                    }

                    //设置标题审核状态的函数：
                    setTitIcon('.art_title');

                    //轮播图函数：
                    imgCarousel('.carousel_box');

                    //不通过的理由显示隐藏
                    $('#r_articalList').on('mouseover', '.artTit_icon', function() {
                        $(this).siblings('.notPassReason').addClass('show').removeClass('hide');
                    })
                    $('#r_articalList').on('mouseout', '.artTit_icon', function() {
                        $(this).siblings('.notPassReason').addClass('hide').removeClass('show');
                    })

                } else {
                    console.log('暂无数据');
                    $("#r_articalList").html('');
                    $('#page').removeClass('show');
                    $('#page').addClass('hide');
                }
            },
            error: function() {
                console.log('ajax-error');
            }
        });
    },
    getListAjax: function(cmd, data) {
        $.ajax({
            type: "POST",
            url: '/zxcity_restful/ws/rest',
            data: {
                "cmd": "cms_back/" + cmd,
                "data": data,
                "version": start.version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", start.apikey);
            },
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    $('#page').removeClass('hide');
                    $('#page').addClass('show');
                    var getTpl = $("#articalList").html();
                    laytpl(getTpl).render(data.data, function(html) {
                        $("#r_articalList").html(html);
                    });

                    start.judge('.art_type', '暂无分类');
                    start.judge('.art_data span:nth-child(1)', '0');
                    start.judge('.art_data span:nth-child(4)', '0');

                    //设置标题审核状态的函数：
                    setTitIcon('.art_title');

                    //轮播图函数：
                    imgCarousel('.carousel_box');

                } else {
                    console.log('暂无数据');
                    $("#r_articalList").html('');
                    $('#page').removeClass('show');
                    $('#page').addClass('hide');
                }
            },
            error: function() {
                console.log('ajax-error');
            }
        });
    },
    deleteList: function(articleId) {
        $.ajax({
            type: "POST",
            url: '/zxcity_restful/ws/rest',
            data: {
                "cmd": "cms_back/deleteArticle",
                "data": '{"articleId": ' + articleId + '}',
                "version": start.version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", start.apikey);
            },
            success: function(data) {

                isApikey(data);
            },
            error: function() {
                console.log('ajax-error');
            }
        });
    },
    stickList: function(articleId, releaseTime) {
        $.ajax({
            type: "POST",
            url: '/zxcity_restful/ws/rest',
            data: {
                "cmd": "cms_back/stickArticle",
                "data": JSON.stringify({
                    "releaseId": start.userId,
                    "articleId": articleId,
                    "stick": 1,
                    "releaseTime": releaseTime
                }),
                "version": start.version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", start.apikey);
            },
            success: function(data) {

                isApikey(data);
            },
            error: function() {
                console.log('ajax-error');
            }
        });
    },
    getPage: function(pages, param) { //调用分页 
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                if (param != undefined) {
                    param.pagination.page = obj.curr;
                    start.getListAjax("selectArticleByStatus", JSON.stringify(param));
                }
            }
        });
    },
    judge: function(dom, html) {
        $(dom).each(function(i, ele) {
            if (isNull($(ele).html())) {
                $(ele).html(html);
            }
        })
    }
}

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
        imgList.css({
            'width': 100 * imgsLength
        });
        if (imgsLength > 1) {
            $(e).parent().find('.artTit_imgs').html(imgsLength + '图').css({
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
        }
    })
}

//获取投稿专题
function getScCmsSpecialsName(cmd) {
    //初始化专题
    reqAjaxAsync(cmd, '{scCmsSpecialName:""}').done(function(res) {
        specialCallback(res);
    });
}

//封装专题回调
function specialCallback(res) {
    $("#specialUl").html("");
    if (res.code != 1) {
        return layer.msg(res.msg);
    }
    if (!isNull(res.data)) {
        var li = "";
        $.each(res.data, function(i, v) {
            li += '<li class="s_li">';
            li += '<div class="form-radio">';
            li += '<span class="radio" scCmsSpecialId="' + v.scCmsSpecialId + '"></span>';
            li += '<span class="cur-d">' + v.scCmsSpecialName + '</span>';
            li += '</div>';
            li += '</li>';
        });
        $("#specialUl").append(li);
    }
}

//搜索专题
function searchSpecial(cmd, data) {
    reqAjaxAsync(cmd, data).done(function(res) {
        specialCallback(res);
    });
}

// 投稿到专题
function sendSpecial(articleId) {
    var arsps = [];
    if ($("#specialUl li .radio.checked")) {
        $("#specialUl li .radio.checked").each(function(i, v) {
            arsps.push({
                scCmsSpecialId: $(v).attr("scCmsSpecialId"),
                scCmsArticleId: articleId,
                scCmsSubmission: 1
            });
        });
        arsps = !isNull(arsps) ? arsps : "";
        var RESPONSE = JSON.stringify({
            arsps
        });
        sendSpecialAjax(RESPONSE);
    }
}

// 投稿到专题请求ajax
function sendSpecialAjax(data) {
    var cmd = REQUEST_URL.addScCmsArsp;
    reqAjaxAsync(cmd, data).done(function(res) {
        if (res.code != 1) {
            layer.msg(res.msg);
        } else {
            layer.msg(res.msg);
            getArtList();
        }
    });
}

//从专题中撤回
function cancelSpecialAjax(data) {
    var cmd = REQUEST_URL.cancelScCmsArsp;
    reqAjaxAsync(cmd, data).done(function(res) {
        if (res.code != 1) {
            layer.msg(res.msg);
        } else {
            layer.msg(res.msg);
            getArtList();
        }
    });
}

//去除末尾多余逗号
function delsymbol(str) {
    var reg = /[,，.、]$/;
    return str.replace(reg, '');
}

//刷新页面
function getArtList() {
    var allData = {
        pagination: {
            page: start.page,
            rows: start.rows
        },
        releaseId: start.userId
    };
    if ($('.tabinner li.active')[0] == $('#navFail')[0]) { //未通过
        allData.isExamine = 0;
        allData.IsDraft = 0;
    } else if ($('.tabinner li.active')[0] == $('#navDraft')[0]) { //草稿
        allData.isExamine = '';
        allData.IsDraft = 1;
    }
    start.getAjax('selectArticleByStatus', JSON.stringify(allData), allData);
}