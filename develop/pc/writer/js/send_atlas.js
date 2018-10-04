var layer = layui.layer,
    form = layui.form();
$(function() {
    //选择标签提示
    var selectTip = $(".selectTip");
    //输入框字符提示
    var inputTip = $(".inputTip");
    //显示所有的标签，最多五个
    var labelAll = $(".labelAll");
    //模态框标签容器
    var modalBtnAll = $(".modalBtnAll");
    //模态框提示
    var modalBtnTip = $(".modalBtnTip");
    //模态框确认按钮
    var confirm = $(".confirm");
    //标签集合
    var arr = [];
    //储存富文本编辑器中的图片
    var imgArr = [];
    //封面图片的对象
    var imgobj = "";
    //获取用户id
    var userId = localStorage.getItem("userId") || "";
    //获取所有信息
    var articleData = localStorage.getItem("articleData") || "";
    //获取当前身份
    var subscriptionType = localStorage.getItem("subscriptionType") || "";
    //获取当前审核状态
    var isExamine = localStorage.getItem("isExamine") || "";
    var apikey = localStorage.getItem('apikey') || "";
    var version = localStorage.getItem('version') || "1";
    var url = window.location.search;
    var articleFlag = false;

    var REQUEST_URL = {
        //获取标签
        label: "cms_new/queryArticleLabel",
        //发表文章
        publish: "cms_back/publishArticle",
        //获取图集
        get: "cms_back/queryArticleById",
        //修改
        edit: "cms_back/updateArticle",
        // 创客咖啡发表
        coffee: "cms_back/insertOnlyScCmsArticle",
        // 存草稿
        addSharedraft: "cms_back/addSharedraft",
        //查询创客咖啡的频道
        selectOnlyChannel: "cms_new/selectOnlyChannel",
        // 创客咖啡修改
        updateOnlyArticle: "cms_back/updateOnlyArticle"
    }

    //文章标题字数统计
    getKeyup($("#titleTxt"), $("#fontLen"));
    // 获取创客咖啡频道
    getCoffeeChannel({
        userId: getCoffeeUserId()
    });
    // 查询创客咖啡的频道
    function getCoffeeChannel(d) {
        var d = JSON.stringify(d);
        //获取文章下拉分类
        if (userId != getCoffeeUserId()) {
            optionType($("#articleSec"), 0);
        } else {
            // 隐藏创客咖啡发表视频
            $("#sendVideoBox").hide();
            reqAjaxAsync(REQUEST_URL.selectOnlyChannel, d).done(function(res) {
                if (res.code == 1) {
                    if (!isNull(res.data)) {
                        //获取标签,清空标签
                        arr = [];
                        $(".labelAll").html("");
                        $("#articleSec").html("<option value='" + $.trim(res.data.channelId) + "'>" + res.data.channelName + "</option>");
                        getQueryArticleLabelAjax(REQUEST_URL.label, modalBtnAll, "zxSelected", res.data.channelId);
                    }
                } else {
                    layer.msg(res.msg);
                }
            });
        }
        form.render();
    }

    //判断当前url后缀是否有文章id
    if (!isNull(GetQueryString("articleId"))) {
        get("cms_back/queryArticleById", {
            "articleId": GetQueryString("articleId")
        });
    }

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
                    if (res.data.typeCode == "1002") {
                        articleFlag = true;
                        getContent(res.data);
                    }
                } else {
                    articleFlag = false;
                    console.log(res.msg);
                }
            },
            error: function(re) {
                layer.closeAll('loading');
                articleFlag = false;
                var str1 = JSON.stringify(re);
                re.code = 9;
                re.msg = str1;
                reData = re;
                layer.msg("系统繁忙,请稍后再试!");
            }
        });
    }
    // 拖拽排序
    $("#ossfile2").sortable({
        axis: 'y'
    });
    //频道获取标签
    form.on('select(channelSec)', function(data) {
        //清空标签
        arr = [];
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(REQUEST_URL.label, modalBtnAll, "zxSelected", data.value);
    });

    //上传图集
    uploadOss({
        btn: "selectfiles",
        flag: "add"
    });

    //上传本地图片
    uploadOss({
        btn: "uploadLocal",
        imgDom: "previews",
        flag: "sendLocal"
    });

    // 描述
    $("#description .form-radio").click(function() {
        var name = $(this).find(".radio").attr("name");
        if (name == 2) {
            var firstTxt = $("#ossfile2").find(".atlas-upload").eq(0).find("textarea");
            $("#ossfile2").find(".atlas-upload").each(function(i, v) {
                $(v).find("textarea").attr("disabled", "disabled");
            });
            firstTxt.attr("disabled", false);
        } else {
            $("#ossfile2 .atlas-upload").find("textarea").attr("disabled", false);
        }
    });

    //添加图集
    $("#selectAtlas").click(function() {
        var c = $("#ossfile2").find("img").clone();
        var str = c.css({
            "width": 170,
            "height": 170,
            margin: "20px"
        });
        $("#imgArrs").html(str);
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

    //文本框键盘输入事件
    $(".labelName").keyup(function(e) {
        var _thisVal = $.trim($(this).val());
        $(this).val($(this).val().replace(/[(^\s*)|(\s*$)\,\，\·\~\`\!\^\￥\……\！\$\@\(\)\（\）\_\——\#\+\*\/\-\=\$%\^&\*\、\：\:\;\'\"\\\|\{\}\[\]\?\？\.\<\>\《\》\。]+$/g, ""));
        if (_thisVal.length > 6) {
            inputTip.show();
        } else {
            inputTip.hide();
            if (e.keyCode == 13) {
                submitA();
            }
        }
    });

    //取消跳转到首页
    $("#cancleA").click(function() {
        location.href = "report.html";
    });

    //静态提交标签点击事件
    $("#submitLabelA").click(function() {
        submitA();
    });

    //删除标签
    $(".labelAll").on("click", ".labelDel", function() {
        var labelAllTxt = $(this).parent("button").text();
        removeByValue(arr, labelAllTxt);
        $(this).parent("button").remove();
        $(".modalBtnAll button").each(function(i, v) {
            var txt = $(v).text();
            if (txt == labelAllTxt) {
                $(v).attr("class", "btn btn-default mr10 mt10 zxSelected").attr("name", "");
            }
        });
    });

    //提交标签方法
    function submitA() {
        var name = $(".labelName").val();
        if (isNull(name)) {
            return selectTip.show().text("*不能提交空的标签");
        }
        var hasLabel = false;
        $(".labelAll button").each(function(i, v) {
            var text = $(this).text();
            if (text == name) hasLabel = true
        })
        if (hasLabel) {
            return selectTip.show().text("*不能提交重复的标签");
        }
        if ($(".labelAll button").length > 4) {
            return selectTip.show().text("*最多只能选择5个标签");
        }
        var btn = '<button class="btn btn-submit mr10">' + name + '<i class="labelDel"></i></button>';
        $(".labelName").val("");
        $(".labelAll").append(btn);
        selectTip.hide().text("");
        arr.push(name);
    }

    //发表
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
            if (userId == getCoffeeUserId()) {
                return send("0", REQUEST_URL.updateOnlyArticle);
            }
            send("0", REQUEST_URL.edit);
        } else {
            if (userId == getCoffeeUserId()) {
                return send("0", REQUEST_URL.coffee);
            }
            send("0", REQUEST_URL.publish);
        }
    });

    //存草稿
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
            send("1", REQUEST_URL.edit);
        } else {
            send("1", REQUEST_URL.addSharedraft);
        }
    });

    //将图集中的图片加入到预览中
    var imgobj = "";
    $("#imgArrs").on('click', '.editor_img', function() {
        $(this).addClass("active").siblings().removeClass("active");
    });

    // 从正文选择
    $("#contentConfirm").click(function() {
        imgobj = $(".editor_img.active").removeClass("active").css({
            margin: 0
        });
        $("#previews").html("<div class='item_box fl'>" + imgobj.get(0).outerHTML + "<i class='deleteI'></i></div>");
        $('#selectContentModal').modal('hide');
    });

    //点击垃圾桶删除
    $("#ossfile2").on("click", "i[name='delI']", function() {
        var name = $("#description").find('.radio.checked').attr("name");
        $(this).parent().parent().parent().parent().remove();
        if (name == 2) {
            $("#description").find('.radio.checked').click();
        }
    });

    //发表
    function send(isDraft, cmd) {
        //分类
        var channelId = $("#articleSec").val();
        //获取标题
        var articleTitle = $("#titleTxt").val();
        //预览图地址
        var coverUrl = $("#previews").find("img").attr("src");
        //预览图名称
        var imgName = $("#previews").find("img").attr("name");
        //预览图宽
        var coverWidth = $("#previews").find("img").attr("width");
        //预览图宽
        var coverHeight = $("#previews").find("img").attr("height");
        //获取用户所有信息
        var articleDataObj = JSON.parse(articleData);
        //城市
        var city = "",
            cityArr = [],
            subscriptionType = "";
        if (isShop == 1) {
            // 商铺列表
            $("#shopBox .radio.checked").each(function(i, v) {
                var cityId = $(v).attr("cityId");
                cityArr.push(cityId);
            });
            city = hovercUnique(cityArr).join(",");
            subscriptionType = 1;
        } else {
            city = articleDataObj.cityCode || "";
            subscriptionType = articleDataObj.subscriptionType;
        }
        var province = articleDataObj.provinceCode;
        //头条号id
        var subscriptionId = articleDataObj.subscriptionId;
        //用户id
        var userId = articleDataObj.userId;
        //创建图片列表集合
        var imageListData = [];
        var obj2 = {};
        //得到文章的内容
        var atlasFlag = false;
        var name = $("#description .radio.checked").attr("name");
        var txt = $(".atlas-upload").eq(0).find("textarea");
        $(".atlas-upload").each(function(i, v) {
            var urls2 = $(this).find("img").attr("src"); //图片地址
            var width2 = $(this).find("img").attr("width"); //图片宽
            var height2 = $(this).find("img").attr("height"); //图片高
            //描述内容
            var des2 = '';
            if (name == 2) {
                if (isNull($(this).find("textarea").val())) {
                    des2 = txt.val();
                } else {
                    des2 = $(this).find("textarea").val();
                }
            } else {
                des2 = $(this).find("textarea").val();
            }
            var imgName2 = $(this).find("img").attr("name"); //图片名字
            if (isNull(des2)) {
                atlasFlag = true;
                return false;
            }
            obj2 = {
                "resourcesName": '' + imgName2 + '',
                "resourcesUrl": '' + urls2 + '',
                "resourcesType": "image",
                "resourcesImgWidth": '' + width2 + '',
                "resourcesImgHeight": '' + height2 + '',
                "resourcesRemarks": '' + des2 + ''
            };
            imageListData.push(obj2);
        });
        console.log(imageListData)

        //添加封面
        imageListData.push({
            "resourcesName": imgName,
            "resourcesUrl": coverUrl,
            "resourcesType": 'cover',
            "resourcesImgWidth": coverWidth,
            "resourcesImgHeight": coverHeight
        });

        console.log(imageListData);

        //表单验证
        if (isNull($("#titleTxt").val())) {
            layer.msg("请输入标题");
            // layer.tips('请输入标题', $("#titleTxt").valueOf().selector, {
            //     tips: [3, '#ff8b6f']
            // });
            return false;
        }
        if ($("#titleTxt").val().trim().length > 40) {
            layer.msg("标题长度不能超过40个字");
            layer.tips('标题长度不能超过40个字', $("#titleTxt").valueOf().selector, {
                tips: [3, '#ff8b6f']
            });
            return false;
        }
        if ($("#titleTxt").val().trim().length < 5) {
            layer.msg("标题长度不能少于5个字");
            return false;
        }
        var label = "";
        $(".labelAll button").each(function(i, v) {
            label += $(v).text() + ",";
        });
        var articleId = "";
        if (!isNull(GetQueryString("articleId"))) {
            articleId = GetQueryString("articleId");
        }
        if (isDraft == 0) {
            if (atlasFlag) {
                layer.msg("描述内容不能为空");
                return false;
            }
            if ($(".atlas-upload").length == 0) {
                layer.msg("请添加图集!");
                return false;
            }
            if (isNull(coverUrl)) {
                layer.msg("请选择封面图");
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
        }
        var data = {
            "shopId": localStorage.getItem("shopId") || "",
            "articleId": articleId,
            "typeCode": "1002",
            "articleTitle": articleTitle,
            "articleContent": "",
            "releaseId": userId,
            "releaseProvince": province,
            "releaseCity": city,
            "previewImgType": "3",
            "subscriptionId": subscriptionId,
            "releaseType": subscriptionType,
            "channelId": channelId,
            "isDraft": isDraft,
            "label": label,
            "scCmsResourcesList": imageListData
        };
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
            success: function(re) {
                layer.closeAll('loading');
                isApikey(re);
                if (re.code == 1) {
                    articleId = isNull(re.data) ? articleId : re.data.articleId;
                    sendSpecial(articleId, isDraft);
                }
                layer.msg(re.msg);
            },
            error: function(re) {
                layer.closeAll('loading');
                var str1 = JSON.stringify(re);
                re.code = 9;
                re.msg = str1;
                reData = re;
                layer.msg("系统繁忙,请稍后再试!");
            }
        });
    }

    //获取当前页面要修改的内容
    function getContent(data, cmd) {
        //标题
        $("#titleTxt").val(data.articleTitle);
        getKeyup($("#titleTxt"), $("#fontLen"));
        //封面,图集
        var str = '',
            img = '';
        $.each(data.scCmsResourcesList, function(i, v) {
            if (v.resourcesType == "cover") {
                if (isNull(v.resourcesUrl)) {
                    v.resourcesUrl = '';
                }
                img = "<div class='item_box fl'><img src='" + v.resourcesUrl + "' class='editor_img' width='170' height='170'/><i class='deleteI'></i></div>";
                $("#previews").html(img);
            }
            if (v.resourcesType == "image") {
                if (isNull(v.resourcesUrl)) {
                    v.resourcesUrl = '';
                }
                str += '<div class="atlas-upload"><ul class="clearfix atlas-item"><li class="img">';
                str += '<img class="editor_img" src="' + v.resourcesUrl + '" width="110" height="110"  name="' + v.resourcesName + '" /></li><li class="imgdesc"><textarea class="form-input" name="imgdesc" placeholder="图片描述(不超过200个字)">' + v.resourcesRemarks + '</textarea></li>';
                str += '<li class="imgoperate"><a><i class="fa fa-trash-o fa-2x" name="delI"></i></a>';
                str += '</li></ul></div>';
            }
        });
        $('#ossfile2').html(str);
        //分类
        $("#articleSec").val(data.channelId);
        // 重新渲染频道
        form.render('select', 'channelSec');

        //获取标签
        arr = [];
        getQueryArticleLabelAjax(REQUEST_URL.label, modalBtnAll, "zxSelected", data.channelId);
        var label = data.label.split(",");
        var btn = "";
        $.each(label, function(i, v) {
            if (!isNull(v)) {
                btn += '<button class="btn btn-submit mr10">' + v + '</button>';
            }
        });
        $(".labelAll").append(btn);
        //让标签选中
        $(".labelAll button").each(function(i, v) {
            var labelBtnAllTxt = $(v).text();
            arr.push(labelBtnAllTxt);
            $(".modalBtnAll").find("button").each(function(q, r) {
                if (labelBtnAllTxt == $(r).text()) {
                    $(r).attr("class", "btn btn-submit mr10 mt10 zxSelected").attr("name", "selected");
                }
            });
        });
        // 专题是否选中
        if (!isNull(data.scCmsSpecial)) {
            $(".scCmsSpecial").hide();
        }
    }
    //js over
});