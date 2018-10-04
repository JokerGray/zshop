var layer = layui.layer,
    form = layui.form();
//初始化富文本编辑器
var editor = KindEditor.create('#applicationform', {
    useContextmenu: false,
    cssData: 'img { max-width: 100%; }',
    items: [
        "undo", "redo", "|", "preview", "cut", "copy", "paste", "plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright", "justifyfull", "outdent", "subscript", "superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/", "formatblock",
        "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold", "italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "images", "|", "about"
    ],
    filterMode: true,
    htmlTags: {
        font: ['color', 'size', 'face', '.background-color'],
        span: [
            '.color', '.background-color', '.font-size', '.font-family', '.background',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
        ],
        'p,div': [
            'align', '.text-align', '.color', 'css', '.background-color', '.font-size', '.text-decoration', '.vertical-align'
        ],
        table: [
            'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor', 'css',
            '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
            '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
            '.width', '.height', '.border-collapse'
        ],
        'td,th': [
            'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'css',
            '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
            '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
        ],
        a: ['href', 'target', 'name'],
        embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
        img: ['src', 'border', 'alt', 'title', 'align', '.border'],
        'ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': [
            'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
        ],
        pre: ['class'],
        hr: ['class', '.page-break-after'],
        'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del': [],
    },
    resizeType: 1
});
//初始化富文本编辑器
KindEditor.lang({
    images: "插入图片"
});
KindEditor.plugin("images", function(K) {
    var self = this,
        name = "images";
    self.clickToolbar(name, function() {
        if (
            $("#videoProgress")
            .find("b span")
            .html() != "100%" &&
            !isNull(
                $("#videoProgress")
                .find("b")
                .html()
            )
        ) {
            return layer.msg("请等待上传完成后再点击上传！");
        }
        layer.msg("正在进行中请耐心等待！~");
        $("#btn").click();
    });
});
// 初始化加载
var shopList = GetQueryString("josnShop");
var isShop = GetQueryString("isShop");
isShopInit(isShop); //商铺初始化
getShopList(JSON.parse(decodeURIComponent(shopList))); //商铺列表获取
function getShopList(d) {
    var str = "";
    $("#shopBox").html("");
    if (isNull(d)) {
        return false;
    }
    $.each(d, function(i, v) {
        str += '<div class="form-radio mr20">';
        str += '<span class="radio checked" shopId="' + v.shopId + '" cityId="' + v.cityId + '"></span>';
        str += '<span class="cur-d">' + (v.shopName) + '</span>';
        str += '</div>';
    });
    $("#shopBox").html(str);
}
$(function() {
    // 获取是否云店头条商户登录
    var isShop = GetQueryString("isShop");
    //获取用户id
    var userId = localStorage.getItem("userId") || "";
    //获取是否有参数articleId
    var articleId = GetQueryString("articleId") || "";
    //选择标签提示
    var selectTip = $(".selectTip");
    //输入框字符提示
    var inputTip = $(".inputTip");
    //模态框标签容器
    var modalBtnAll = $(".modalBtnAll");
    //模态框提示
    var modalBtnTip = $(".modalBtnTip");
    //模态框确认按钮
    var confirm = $(".confirm");
    //显示所有的标签，最多五个
    var labelAll = $(".labelAll");
    // 自动保存功能,获取之前编辑过的内容,代入编辑器中
    var editorTxt = localStorage.getItem("q_editorTxt_" + userId) || "";
    editor.html(editorTxt);
    //标签集合
    var arr = [];
    //储存富文本编辑器中的图片
    var imgArr = [];
    //频道ID的标记
    var oldChannel = '';
    //设置邀请对象页数和条数
    var inviteRows = 5;
    var inviPages = 1;
    var inviteNum = 0;
    //发表的邀请对象
    var invitationArr = [];
    //同频道的邀请对象
    var sameChannelArr = [];
    //初始化页面时清空inviteArr
    localStorage.setItem('inviteArr', '');
    //获取所有信息
    var articleData = localStorage.getItem("articleData") || "";
    //获取当前身份
    var subscriptionType = localStorage.getItem("subscriptionType");
    var isExamine = localStorage.getItem("isExamine") || "";
    var articleFlag = false;
    //邀请作者列表的data
    var attentionData = {
        userId: userId,
        articleId: articleId, //文章Id（可以传空主要是修改的时候用来查看是否邀请过）,
        pagination: {
            page: 1,
            rows: inviteRows
        }
    };
    //邀请同频道作家Data
    var channelData = {
        userId: userId,
        articleId: articleId,
        channelId: '', //"频道Id"
        pagination: {
            page: 1,
            rows: inviteRows
        }
    };
    //发表问题URL
    var questionUrl = {
        attention: "cms_new/invitationAttentionList", //邀请我关注的
        Fans: "cms_new/invitationFansList", //邀请粉丝
        channel: "cms_new/invitationChannelList", //查询同频道的作家列表
        label: "cms_new/queryArticleLabel", //根据频道获取标签
        send: "cms_new/publishQuestion", //发表
        edit: "cms_new/updateQuestion", //修改
        draft: "cms_new/publishQuestionDraft", //草稿
        quesDetail: 'cms_new/queryQuestionDetail' //修改查询问题详情
    };
    // 富文本编辑器上传图片
    uploadOss({
        btn: "btn",
        imgArr: imgArr,
        editor: editor,
        flag: "sendQues"
    });
    //从本地选择封面
    uploadOss({
        btn: "localBtn",
        imgDom: "previews",
        flag: "sendLocals"
    });
    // 获取频道
    getCoffeeChannel({
        userId: getCoffeeUserId()
    });
    //判断当前url后缀是否有文章id
    if (!isNull(articleId)) {
        get(questionUrl.quesDetail, {
            userId: userId,
            articleId: articleId
        });
    }
    //文章标题字数统计
    getKeyup($("#titleTxt"), $("#fontLen"));
    //上传本地图片点击事件
    $("#selectfiles").click(function() {
        var len = $("#previews .editor_img").length;
        if (len >= 3) {
            layer.msg("当前封面只能选择三张!");
        } else {
            $("#localBtn").click();
        }
    });
    //从正文选择事件
    $("#selectArticle").click(function() {
        var htm = $("#imgArrs")
            .html()
            .trim();
        $("#textHide").html(editor.html());
        var imgArr = $("#textHide")
            .find("img")
            .addClass("editor_img")
            .css({
                width: 170,
                height: 170,
                margin: "20px"
            });
        $("#imgArrs").html(imgArr);

        //匹配是否有相同的src
        $("#previews .editor_img").each(function(i, v) {
            var ps = $(v).attr("src");
            $("#imgArrs .editor_img").each(function(q, r) {
                var is = $(r).attr("src");
                if (ps == is) {
                    $(r).addClass("active");
                }
            });
        });
    });
    //正文选择模态框确定按钮
    $("#contentConfirm").click(function() {
        var $obj = $("#imgArrs").find(".editor_img.active").css({
            "width": 170,
            "height": 170,
            "margin": 0
        });
        var str = '';
        $.each($obj, function(i, v) {
            str += "<div class='item_box fl'>" + v.outerHTML + "<i class='deleteI'></i></div>";
        });
        $("#previews").html(str);
        $('#selectContentModal').modal('hide');
    });
    //选中img标签事件
    $("#imgArrs").on('click', '.editor_img', function() {
        var len = "";
        var _this = $(this).clone();
        var s = $(this).attr("src");
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $("#preview .editor_img").each(function(i, v) {
                if ($(v).attr("src") == s) {
                    $(this).remove();
                }
            });
        } else {
            len = $("#preview .editor_img").length;
            if (len >= 3) {
                layer.msg("封面只能选择一张或者三张!");
                return false;
            } else {
                $("#preview").append(_this);
                $(this).addClass("active");
            }
        }
    });
    //文本框键盘输入事件
    $(".labelName").keyup(function(e) {
        var _thisVal = $.trim($(this).val());
        var reg = /[(^\s*)|(\s*$)\,\，\·\~\`\!\^\￥\……\！\$\@\(\)\（\）\_\——\#\+\*\/\-\=\$%\^&\*\、\：\:\;\'\"\\\|\{\}\[\]\?\？\.\<\>\《\》\。]+$/g;
        $(this).val(
            $(this)
            .val()
            .replace(reg, "")
        );
        if (_thisVal.length > 6) {
            inputTip.show();
        } else {
            inputTip.hide();
            if (e.keyCode == 13) {
                submitA();
            }
        }
    });
    //静态提交标签点击事件
    $(".submitLabelA").click(function() {
        submitA();
    });
    //删除标签
    $(".labelAll").on("click", ".labelDel", function() {
        var labelAllTxt = $(this)
            .parent("button")
            .text();
        removeByValue(arr, labelAllTxt);
        $(this)
            .parent("button")
            .remove();
        $(".modalBtnAll button").each(function(i, v) {
            var txt = $(v).text();
            if (txt == labelAllTxt) {
                $(v)
                    .attr("class", "btn btn-default mr10 mt10 zxSelected")
                    .attr("name", "");
            }
        });
    });

    //启动定时器实时保存内容
    setInterval(function() {
        localStorage.setItem("q_html", editor.html());
        localStorage.setItem("q_editorTxt_" + userId, editor.html());
    }, 800);
    //频道获取标签
    form.on('select(channelSec)', function(data) {
        //清空标签
        arr = [];
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(questionUrl.label, modalBtnAll, "zxSelected", data.value);
        if (data.value != channelData.channelId) {
            //取消同频道的邀请对象
            for (var i = 0; i < sameChannelArr.length; i++) {
                for (var j = 0; j < invitationArr.length; j++) {
                    if (invitationArr[j]["scCmsInvitationReleaseId"] == sameChannelArr[i]["scCmsInvitationReleaseId"]) {
                        invitationArr.splice(j, 1);
                        j--;
                    }
                }
            }
            localStorage.setItem('inviteArr', JSON.stringify(invitationArr));
            $('#inviteUserBox').html('你已邀请 <span>' + invitationArr.length + '</span> 人');
            $('#invitationNum').html('*已邀请' + invitationArr.length + '人来回答问题');
        }
    });
    // 模态框内标签点击事件
    modalBtnAll.on('click', '.zxSelected', function() {
        if ($(this).hasClass("btn-default")) {
            if (arr.length == 5) {
                modalBtnTip.show();
                return;
            } else {
                modalBtnTip.hide();
                arr.push($(this).text());
                $(this).attr("class", "btn btn-submit mr10 mt10 zxSelected").attr("name", "selected");
            }
        } else {
            modalBtnTip.hide();
            removeByValue(arr, $(this).text());
            $(this).attr("class", "btn btn-default mr10 mt10 zxSelected").attr("name", "");
        }
    });
    // 模态框确认按钮
    confirm.click(function() {
        var label = '';
        var labelLen = labelAll.children("button").length; //每次查询到上次的
        var btnLen = modalBtnAll.children("[name='selected']").length;
        $('.labelAll').html("");
        for (var i = 0; i < arr.length; i++) {
            $('.labelAll').append('<button class="btn btn-submit mr10">' + arr[i] + '<i class="labelDel"></i></button>');
        }
        $('#selectLabelModal').modal('hide');
        //判断当前选中数量的总和
        if (arr.length > 5) {
            selectTip.show().text('*最多只能选择5个标签');
        } else {
            selectTip.hide();
        }
    });
    //查询邀请回答的作者列表
    //邀请我关注的作者
    invitationList(questionUrl.attention, attentionData, true);
    $('#dropBtn').click(function() {
        var type = $('.operateObjNav li.active').attr("type"),
            channelId = $("#articleSec").val();
        if ((type == "channel") && (oldChannel != channelId)) {
            if (isNull(channelId)) {
                layer.msg("请先选择频道!");
                return false;
            }
            //取消邀请去除被邀请人Id
            for (var i = 0; i < sameChannelArr.length; i++) {
                for (var j = 0; j < invitationArr.length; j++) {
                    if (invitationArr[j]["scCmsInvitationReleaseId"] == sameChannelArr[i]["scCmsInvitationReleaseId"]) {
                        invitationArr.splice(j, 1);
                        j--;
                    }
                }
            }
            localStorage.setItem('inviteArr', JSON.stringify(invitationArr));
            $('#inviteUserBox').html('你已邀请 <span>' + invitationArr.length + '</span> 人');
            $('#invitationNum').html('*已邀请' + invitationArr.length + '人来回答问题');
            channelData.channelId = channelId;
            invitationList(questionUrl[type], channelData, true);
        }
    })

    //切换邀请作者tab栏
    $(".operateObjNav li").click(function() {
        var type = $(this).attr("type"),
            channelId = $("#articleSec").val();
        if (type == "channel") {
            if (isNull(channelId)) {
                layer.msg("请先选择频道!");
                return false;
            }
            oldChannel = channelId;
            channelData.channelId = channelId;
            invitationList(questionUrl[type], channelData, true);
        } else {
            attentionData.pagination.page = 1;
            invitationList(questionUrl[type], attentionData, true);
        }
        $(".operateObjNav li").removeClass("active");
        $(this).addClass("active");
    });

    //邀请回答的好友
    $("#invitePList").on("click", "button", function() {
        var inviteId = $(this).parent().attr('inviteId'),
            operateLisType = $('.operateObjNav li.active').attr('type'),
            flag = true;
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this).html('<i class="glyphicon glyphicon-user"></i>邀请');
            //取消邀请去除被邀请人Id
            for (var i = 0; i < invitationArr.length; i++) {
                if (invitationArr[i]["scCmsInvitationReleaseId"] == inviteId) {
                    invitationArr.splice(i, 1);
                    i--;
                }
            }
        } else {
            $(this).addClass("active");
            $(this).html('<i class="glyphicon glyphicon-ok"></i>已邀请');
            $.each(invitationArr, function(i, e) {
                if (e.scCmsInvitationReleaseId == inviteId) {
                    flag = false;
                }
            })
            if (flag) {
                if (operateLisType == 'channel') {
                    sameChannelArr.push({
                        scCmsInvitationUserId: userId,
                        scCmsInvitationReleaseId: +inviteId
                    })
                    invitationArr.push({
                        scCmsInvitationUserId: userId,
                        scCmsInvitationReleaseId: +inviteId,
                        invitationType: 1
                    });
                } else {
                    invitationArr.push({
                        scCmsInvitationUserId: userId,
                        scCmsInvitationReleaseId: +inviteId
                    });
                }
            }
        }
        inviteNum = invitationArr.length;
        localStorage.setItem('inviteArr', JSON.stringify(invitationArr));
        $('#inviteUserBox').html('你已邀请 <span>' + inviteNum + '</span> 人');
        $('#invitationNum').html('*已邀请' + inviteNum + '人来回答问题');
    });

    // 切换商铺
    $("#shopBox").find(".radio").click(function() {
        $(this).toggleClass("checked");
    });

    //提问发表
    $("#postfiles").click(function() {
        if (isExamine != "1" && isExamine != "4") {
            layer.msg("请入驻资料后审核成功再来发表!");
            return false;
        }
        if (isNull(articleData)) {
            layer.msg("系统异常,请重新登录!");
            return false;
        }
        if (articleFlag) {
            send("0", questionUrl.edit, articleId); //修改接口
        } else {
            send("0", questionUrl.send); //发表接口
        }
    });
    //提问存草稿
    $("#articleDraft").click(function() {
        if (isExamine != "1" && isExamine != "4") {
            layer.msg("请入驻资料后审核成功再来发表!");
            return false;
        }
        if (isNull(articleData)) {
            layer.msg("系统异常,请重新登录!");
            return false;
        }
        if (articleFlag) {
            send("1", questionUrl.edit, articleId); //修改接口
        } else {
            send("1", questionUrl.draft); //草稿接口
        }
    });
    //取消跳转到首页
    $("#cancleA").click(function() {
        location.href = "question_mine.html";
    });

    // 获取修改参数
    function get(cmd, data) {
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dateType: "json",
            data: {
                "cmd": cmd,
                "data": JSON.stringify(data),
                "version": 1
            },
            beforeSend: function(request) {
                layer.load(0, {
                    shade: [0.1, '#fff']
                });
                request.setRequestHeader("apikey", apikey);
            },
            success: function(res) {
                layer.closeAll('loading');
                isApikey(res);
                if (res.code == 1 && !isNull(res.data)) {
                    if (res.data.typeCode == "1005") {
                        articleFlag = true;
                        getContent(res.data);
                    } else {
                        layer.msg("非法进入,请重新登录!");
                        location.href = "login.html";
                    }
                } else {
                    articleFlag = false;
                }
            },
            error: function(res) {
                articleFlag = false;
                layer.closeAll('loading');
                layer.msg("系统繁忙,请稍后再试!");
            }
        });
    }
    // //获取当前页面要修改的内容
    function getContent(data) {
        var btn = "",
            imgs = "";
        arr = [];
        //标题
        $("#titleTxt").val(data.articleTitle);
        //文章标题字数统计
        getKeyup($("#titleTxt"), $("#fontLen"));
        //富文本编辑器
        var articleContent = data.articleContent;
        $("#editorBox").html(articleContent);
        var editorBoxHtml = $("#editorBox").html();
        // 编辑器插入除了视频以外的东西
        editor.html(editorBoxHtml);
        //封面
        $.each(data.scCmsResourcesList, function(i, v) {
            if (v.resourcesType == "cover") {
                if (!isNull(v.resourcesUrl)) {
                    imgs += "<div class='item_box fl'><img src='" + v.resourcesUrl + "' class='editor_img' width='170' height='170'/><i class='deleteI'></i></div>";
                }
            }
        });
        $("#previews").html(imgs);
        //分类
        $("#articleSec").val(data.channelId);
        //清空标签
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(questionUrl.label, modalBtnAll, "zxSelected", data.channelId);
        var label = data.label.split(",");
        $.each(label, function(i, v) {
            if (!isNull(v)) {
                btn += '<button class="btn btn-submit mr10">' + v + '<i class="labelDel"></i></button>';
            }
        });
        $(".labelAll").append(btn);
        $(".labelAll").find("button").each(function(i, v) {
            var labelBtnAllTxt = $(v).text();
            arr.push(labelBtnAllTxt);
            $(".modalBtnAll").find("button").each(function(q, r) {
                if (labelBtnAllTxt == $(r).text()) {
                    $(r).attr("class", "btn btn-submit mr10 mt10 zxSelected").attr("name", "selected");
                }
            });
        });
        //获取邀请对象
        $.each(data.scCmsInvitation, function(i, v) {
            invitationArr.push({
                scCmsInvitationUserId: userId,
                scCmsInvitationReleaseId: v.scCmsInvitationReleaseId
            });
        })
        inviteNum = invitationArr.length;
        $('#inviteUserBox').html('你已邀请 <span>' + inviteNum + '</span> 人');
        $('#invitationNum').html('*已邀请' + inviteNum + '人来回答问题');
        localStorage.setItem('inviteArr', JSON.stringify(invitationArr));
        // 重新渲染频道
        form.render('select', 'channelSec');
        if (data.isDraft == 0 && data.isExamine != 0) {
            $('#titleTxt').attr("readonly", "readonly").addClass('gray');
            $('.form-content button').attr("disabled", "disabled").addClass('gray');
            $('.form-content input').attr("disabled", "disabled").addClass('gray');
            $('.form-content dl').hide();
            $('.form-content i').hide();
            $('.submitLabelA').hide();
            $('.labelAllQues button').css({
                'color': 'black'
            });
        }
    }
    // 查询频道
    function getCoffeeChannel(d) {
        var d = JSON.stringify(d);
        optionType($("#articleSec"), 0);
        form.render();
    }
    //提交标签方法
    function submitA() {
        var name = $(".labelName").val();
        if (isNull(name)) {
            return selectTip.show().text("*不能提交空的标签");
        }
        var hasLabel = false;
        $(".labelAll button").each(function(i, v) {
            var text = $(this).text();
            if (text == name) hasLabel = true;
        });
        if (hasLabel) {
            return selectTip.show().text("*不能提交重复的标签");
        }
        if ($(".labelAll button").length > 4) {
            return selectTip.show().text("*最多只能选择5个标签");
        }
        var btn =
            '<button class="btn btn-submit mr10">' +
            name +
            '<i class="labelDel"></i></button>';
        $(".labelName").val("");
        $(".labelAll").append(btn);
        selectTip.hide().text("");
        arr.push(name);
    }
    //查询邀请回答的作者列表
    function invitationList(cmd, d, flag) {
        reqAjaxAsync(cmd, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                $("#invitePList").html("");
                $("#inviListPage").hide();
                layer.msg(res.msg);
                return false;
            } else {
                var data = res.data || "";
                var total = res.total || "";
                if (!isNull(data)) {
                    var getTpl = $("#inviteList").html();
                    inviPages = Math.ceil(total / inviteRows);
                    inviPages > 1 ? $("#inviListPage").show() : $("#inviListPage").hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#invitePList").html(html);
                    });
                    return flag ? getInviPage(inviPages, cmd, d) : false;
                } else {
                    $("#invitePList").html("");
                    $("#inviListPage").hide();
                }
            }
        });
    }
    //获取邀请回答的作者列表分页
    function getInviPage(pages, cmd, d) {
        //获取分页
        laypage({
            cont: "inviListPage", //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: "#ff8b6f",
            groups: 2, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                invitationList(cmd, d, false);
            }
        });
    }
    //发表提问回调
    function send(isDraft, cmd, articleId) {
        var previewImgType = "";
        var articleDataObj = JSON.parse(articleData);
        //"发布内容省
        var province = articleDataObj.provinceCode;
        //发布内容
        var editorHtml = editor.html();
        //领域分类
        var channelId = $("#articleSec").val();
        //标题
        var titleTxt = $("#titleTxt").val();
        //头条号id
        var subscriptionId = articleDataObj.subscriptionId || "";
        //标签
        var label = "";
        //城市
        var city = "",
            cityArr = [];
        if (isShop == 1) {
            // 商铺列表
            $("#shopBox .radio.checked").each(function(i, v) {
                var cityId = $(v).attr("cityId");
                cityArr.push(cityId);
            });
            city = hovercUnique(cityArr).join(",");
        } else {
            city = articleDataObj.cityCode || "";
        }
        $(".labelAll button").each(function(i, v) {
            label += $(v).text() + ",";
        });
        var scCmsResourcesList = [];
        $("#previews img").each(function(i, v) {
            scCmsResourcesList.push({
                resourcesName: $(v).attr("class").replace("active", "").replace("editor_img", "").trim(),
                resourcesUrl: $(v).attr("src"),
                resourcesType: "cover",
                resourcesImgWidth: "170",
                resourcesImgHeight: "170"
            });
        });
        var imgLen = $("#previews img").length;
        if (imgLen == 1) {
            previewImgType = "10";
        } else if (imgLen == 3) {
            previewImgType = "11";
        } else if (imgLen == 0) {
            previewImgType = "9";
        }
        ///请输入标题
        if (isNull($("#titleTxt").val())) {
            layer.msg("请输入标题");
            return false;
        }
        if ($("#titleTxt").val().trim().length < 5) {
            layer.msg("标题长度不能少于5个字");
            return false;
        }
        if (isDraft == 0) {
            if (isNull(editorHtml)) {
                layer.msg("请输入文章内容");
                return false;
            }
            if (isNull($("#previews").html().trim())) {
                layer.msg("请选择封面图");
                return false;
            }
            if (imgLen != 1 && imgLen != 3) {
                layer.msg("请选择一张封面图或者三张封面图");
                return false;
            }
            if (isNull(channelId)) {
                layer.msg("请选择频道");
                return false;
            }
            if (isNull(label)) {
                layer.msg("请选择标签");
                return false;
            }
            // if (isNull(invitationArr)) {
            // 	layer.tips("请邀请对象", $("#dropBtn").valueOf().selector, {
            // 		tips: [3, "#ff8b6f"]
            // 	});
            // 	return false;
            // }
        }
        console.log(city)
        var data = {
            previewImgType: previewImgType, //"显示资源的方式， 0普通无图   1普通单图  2普通三图    3图集单图  4图集三图  5视频"",
            releaseProvince: province, //"发布内容省code",
            articleContent: editorHtml, //"问答内容",
            isDraft: isDraft, //"是否草稿：0，否；1，是",
            releaseId: userId, //"发布人主键(用户表.用户_id)",
            channelId: channelId, //"领域Id",
            articleTitle: titleTxt, //"问答标题",
            releaseCity: city, //"发布人所在城市",
            typeCode: 1005, //"1005:问题",
            label: label, //"标签",
            releaseType: subscriptionType, //"发布人的类型(0:作者;1:商家)"
            scCmsResourcesList: scCmsResourcesList, //资源列表
            scCmsInvitation: invitationArr,
            subscriptionId: subscriptionId //"头条号ID"
        };
        if (!isNull(articleId)) {
            data.articleId = articleId;
        }
        reqAjaxAsync(cmd, JSON.stringify(data)).done(function(res) {
            layer.closeAll('loading');
            isApikey(res);
            layer.msg(res.msg);
            if (res.code == 1) {
                localStorage.setItem('inviteArr', '');
                editor.html("");
                localStorage.removeItem("q_editorTxt_" + userId);
                // qr修改云店头条对应跳转
                if (isShop == 1) {
                    window.parent.$("#reportIframe").attr("src", "/writer/question_mine.html")
                    window.parent.$("#managementTrends").click();
                    return false;
                }
                window.location.href = './question_mine.html';
            }
        });
    }
});