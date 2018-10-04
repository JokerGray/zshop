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
    images: '插入图片'
});
KindEditor.plugin('images', function(K) {
    var self = this,
        name = 'images';
    self.clickToolbar(name, function() {
        if ($("#videoProgress").find("b span").html() != "100%" && !isNull($("#videoProgress").find("b").html())) {
            return layer.msg("请等待上传完成后再点击上传！");
        }
        layer.msg("正在进行中请耐心等待！~");
        $("#btn").click();
    });
});

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
    //封面图片的对象
    var imgobj = [];
    //储存富文本编辑器中的图片
    var imgArr = [];
    //获取用户id
    var userId = localStorage.getItem("userId") || "";
    //获取之前编辑过的内容,代入编辑器中
    var editorTxt = localStorage.getItem("editorTxt_" + userId) || "";
    editor.html(editorTxt);
    //获取所有信息
    var articleData = localStorage.getItem("articleData") || "";
    //获取当前身份
    // var subscriptionType = localStorage.getItem("subscriptionType");
    var isExamine = localStorage.getItem("isExamine") || "";
    var apikey = localStorage.getItem('apikey') || "";
    var version = localStorage.getItem('version') || "1";
    var url = window.location.search;
    var articleFlag = false;
    //获取商户后台和作家后台的标示
    var isM = localStorage.getItem("isM");
    var platForm = 1003;
    var advPlaceApp1 = '',
        advPlaceApp2 = '';
    var adPages = 1;
    var adListData = {
        scCmsAdvState: 1,
        scCmsAdvRelease: userId,
        scCmsSourceIdList: '',
        scCmsAdvStyleResTitle: '',
        pagination: {
            page: 1,
            rows: 5
        }
    };
    // 缓存将店铺同步到详情页的店铺
    var shopSynchronousEdit=[];
    // 发文地址
    var REQUEST_URL = {
        //获取标签
        label: "cms_new/queryArticleLabel",
        //发表文章
        publish: "cms_back/publishArticle",
        //获取文章信息
        get: "cms_back/queryArticleById",
        //修改
        edit: "cms_back/updateArticle",
        // 存草稿
        addSharedraft: "cms_back/addSharedraft",
        // 创客咖啡发表
        coffee: "cms_back/insertOnlyScCmsArticle",
        //查询创客咖啡的频道
        selectOnlyChannel: "cms_new/selectOnlyChannel",
        // 创客咖啡修改
        updateOnlyArticle: "cms_back/updateOnlyArticle"
    };

    //切换广告
    $(".adRadioBox").click(function() {
        $(this).find(".radio").addClass("checked").parent().siblings().find(".radio").removeClass("checked");
    });
    init();

    function init() {
        //查看广告示意图
        if (isM == 2) {
            platForm = 1002;
        }
        reqAjaxAsync('cms_back/selectPlaceStyle', JSON.stringify({
            scCmsAdvPlacePlatForm: platForm
        })).done(function(res) {
            if (isNull(res.data)) {
                return layer.msg(res.msg);
            }
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].scCmsAdvPlaceApp == 12) {
                    advPlaceApp1 = res.data[i].scCmsAdvPlaceApp;
                    $('.AdSense[type=1]').attr('advPlaceApp1', advPlaceApp1);
                    $('#adverName1').html(res.data[i].scCmsAdvPlaceName);
                    $('#previewPic1 img').attr('src', res.data[i].scCmsAdvPlaceImg);
                } else if (res.data[i].scCmsAdvPlaceApp == 13) {
                    advPlaceApp2 = res.data[i].scCmsAdvPlaceApp;
                    $('.AdSense[type=2]').attr('advPlaceApp2', advPlaceApp2);
                    $('#adverName2').html(res.data[i].scCmsAdvPlaceName);
                    $('#previewPic2 img').attr('src', res.data[i].scCmsAdvPlaceImg);
                }
            }
        })
    }
    //选中自营广告位模态框事件
    $('.AdSense').click(function() {
        var type = $(this).attr('type');
        if (type == 1) {
            $('#artSearchInp').val('');
            adListData.scCmsAdvStyleResTitle = '';
            adListData.scCmsSourceIdList = advPlaceApp1;
            $('#confirmBtn').attr('type', 1);
        } else if (type == 2) {
            $('#artSearchInp').val('');
            adListData.scCmsAdvStyleResTitle = '';
            adListData.scCmsSourceIdList = advPlaceApp2;
            $('#confirmBtn').attr('type', 2);
        }
        adList(adListData, true);
    })

    //广告模态框搜索按钮
    $('#artSearchIcon').click(function() {
        adListData.scCmsAdvStyleResTitle = $('#artSearchInp').val();
        adList(adListData, true);
    })

    //点击查看按钮查看广告详情
    $('#addAddTableCon').on('click', '.checkBtn', function() {
        var obj = {
            adDConTime: $(this).parent().siblings('td[name="advTime"]').html(),
            adDConPosition: $(this).attr('scCmsAdvPlaceName'),
            adDConShowNum: $(this).attr('scCmsAdvShowNumber'),
            adDConClickNum: $(this).attr('scCmsAdvClickNumber'),
            adDConType: $(this).attr('scCmsAdvSourceName'),
            adDConCreateTime: $(this).attr('scCmsAdvCreateTime'),
            adDConTagList: $(this).attr('scCmsAdvLable')
        };
        for (var key in obj) {
            $('#' + key).html(obj[key]);
        }
        if ($('#adDConType').html() == '外部广告') {
            $('#adDConSource').html('外部广告');
        } else {
            $('#adDConSource').html('内部广告');
        }
        var scCmsAdvStyleResId = $(this).parent().parent().attr('scCmsAdvStyleResId');
        reqAjaxAsync('cms_back/querySelectAdvDetails', JSON.stringify({
            scCmsAdvStyleResId: scCmsAdvStyleResId
        })).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                var data = res.data;
                if (!isNull(data)) {
                    var getTpl = $("#adStyle").html();
                    laytpl(getTpl).render(data, function(html) {
                        $("#adDConRight").html(html);
                    });
                }
            }
        });
    })

    //点击单选框选中广告位
    $('#addAddTableCon').on('click', '.selectBox', function() {
        $('.selectBox').removeClass('active');
        $(this).addClass('active').attr('check', 1);
    })

    //选中广告列表中广告
    $('#confirmBtn').click(function() {
        var flag = false,
            sccmsadvid = '';
        $('#addAddTableCon i').each(function(i, e) {
            if ($(e).attr('check') == 1) {
                flag = true;
                sccmsadvid = $(e).parent().parent().attr('sccmsadvid');
            }
        })
        if (!flag) {
            return layer.msg('请先选择一条广告');
        } else if (flag) {
            if ($(this).attr('type') == 1) {
                $('.AdSense[type=1]').attr('sccmsadvid', sccmsadvid);
            } else if ($(this).attr('type') == 2) {
                $('.AdSense[type=2]').attr('sccmsadvid', sccmsadvid);
            }
        }
    })

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
            // async: false,
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
                console.log("res",res)
                layer.closeAll('loading');
                isApikey(res);
                if (res.code == 1 && !isNull(res.data)) {
                    if (res.data.typeCode == "1001") {
                        // res.data.shopId="288,289";
                        articleFlag = true;
                        getContent(res.data);
                        shopSynchronousEdit.push(res.data.shopId);
                        var arrList=[];
                        if(res.data.shopId==null){
                            arrList=[]
                        }else{
                            arrList=res.data.shopId.split(',');
                        }
                        var shopBox= $("#shopBox .articleShare");
                        $("#shopBox").find(".radio").removeClass("checked");          
                        for(var i=0;i<shopBox.length;i++){
                            for(var j=0;j<arrList.length;j++){
                                if($(shopBox[i]).find(".radio").attr("shopid")==arrList[j]){
                                    $(shopBox[i]).find(".radio").addClass("checked");
                                    localStorage.setItem("shopSynchronous",shopSynchronousEdit);
                                }
                            }
                        }
                    } else {
                        console.log(res.data.typeCode);
                        layer.msg("非法进入,请重新登录!");
                        location.href = "login.html";
                    }
                } else {
                    articleFlag = false;
                    console.log(res.msg);
                }
            },
            error: function(re) {
                articleFlag = false;
                layer.closeAll('loading');
                var str1 = JSON.stringify(re);
                re.code = 9;
                re.msg = str1;
                reData = re;
                layer.msg("系统繁忙,请稍后再试!");
            }
        });
    }

    //启动定时器实时保存内容
    setInterval(function() {
        localStorage.setItem("html", editor.html());
        localStorage.setItem("editorTxt_" + userId, editor.html());
    }, 800);

    //频道获取标签
    form.on('select(channelSec)', function(data) {
        //清空标签
        arr = [];
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(REQUEST_URL.label, modalBtnAll, "zxSelected", data.value);
    });

    //富文本编辑器上传视频
    uploadOss({
        btn: "hidDivVideo",
        flag: "editorVideo",
        size: "1gb"
    });

    //富文本编辑器上传图片
    uploadOss({
        btn: "btn",
        imgArr: imgArr,
        editor: editor,
        flag: "send"
    });

    // 上传视频封面
    uploadOss({
        btn: "hidDiv",
        flag: "cover"
    });

    uploadOss({
        btn: "localBtn",
        imgDom: "previews",
        flag: "sendLocals"
    });

    // 点击上传视频
    $("#uploadVideo").click(function() {
        if ($("#videoProgress").find("b span").html() != "100%" && !isNull($("#videoProgress").find("b").html())) {
            return layer.msg("请上传视频完成后再上传！");
        }
        $("#hidDivVideo").click();
    });

    // 优先上传视频
    $("#uploadVideoCover").click(function() {
        if ($("#videoProgress").find("b span").html() != "100%" && !isNull($("#videoProgress").find("b").html())) {
            return layer.msg("请上传视频完成后再上传！");
        }
        if (!isNull($("#videoHide").html())) {
            //上传本地图片
            $("#hidDiv").click();
        } else {
            layer.msg("请上传视频完成后再上传封面！");
        }
    });

    //上传本地图片点击事件
    $("#selectfiles").click(function() {
        var len = $("#previews .editor_img").length;
        if (len >= 3) {
            layer.msg("当前封面只能选择三张!");
        } else {
            if ($("#videoProgress").find("b span").html() != "100%" && !isNull($("#videoProgress").find("b").html())) {
                return layer.msg("请上传视频完成后再上传！");
            }
            $("#localBtn").click();
        }
    });

    //从正文选择事件
    $("#selectArticle").click(function() {
        var htm = $("#imgArrs").html().trim();
        $("#textHide").html(editor.html());
        var imgArr = $("#textHide").find("img").addClass('editor_img').css({
            "width": 170,
            "height": 170,
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

    //选中img标签事件
    $("#imgArrs").on('click', '.editor_img', function() {
        var imgArrsLen = $("#imgArrs").find('.editor_img.active').length;
        var len = $("#previews .editor_img").length;
        var _this = $(this).clone();
        var s = $(this).attr("src");
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $("#previews .editor_img").each(function(i, v) {
                if ($(v).attr("src") == s) {
                    $(this).parent(".item_box").remove();
                }
            });
        } else {
            if (len >= 3) {
                layer.msg("当前封面最多不能超过三个!");
                return false;
            }
            $(this).addClass("active");
            $("#previews").append("<div class='item_box fl'>" + _this.css({
                margin: 0
            }).get(0).outerHTML + "<i class='deleteI'></i></div>");
        }
    });

    //正文选择模态框确定按钮
    $("#contentConfirm").click(function() {
        $('#selectContentModal').modal('hide');
    });

    // 自动封面图
    $("#selectAutoCover").click(function() {
        var index;
        $("#textHide").html(editor.html());
        var imgArr = $("#textHide").find("img").addClass('editor_img').css({
            "width": 170,
            "height": 170,
            "margin": 0
        });
        if (imgArr.length == 0) {
            return layer.msg("请在富文本编辑器上传图片后再选择自动封面！");
        }
        index = Math.floor((Math.random() * imgArr.length));
        $("#previews").html("<div class='item_box fl'>" + imgArr[index].outerHTML + "<i class='deleteI'></i></div>");
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
        var reg = /[(^\s*)|(\s*$)\,\，\·\~\`\!\^\￥\……\！\$\@\(\)\（\）\_\——\#\+\*\/\-\=\$%\^&\*\、\：\:\;\'\"\\\|\{\}\[\]\?\？\.\<\>\《\》\。]+$/g;
        $(this).val($(this).val().replace(reg, ""));
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
    $(".submitLabelA").click(function() {
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
            layer.msg("请入驻资料审核成功后再来发表!");
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
            layer.msg("请入驻资料审核成功后再来发表!");
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

    //发表
    function send(isDraft, cmd) {
        var previewImgType = "";
        //标记
        var submitFlag = true;
        //分类
        var channelId = $("#articleSec").val();
        //获取标题
        var articleTitle = $("#titleTxt").val();
        //获取用户所有信息
        var articleDataObj = JSON.parse(articleData);
        //城市
        var city = "",
            cityArr = [],
            //头条号类型
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
            subscriptionType = articleDataObj.subscriptionType;
            city = articleDataObj.cityCode || "";
        }
        var province = articleDataObj.provinceCode || "";
        //头条号id
        var subscriptionId = articleDataObj.subscriptionId || "";
        //用户id
        var userId = articleDataObj.userId || "";
        //得到文章的内容,拼接视频
        var articleContent = $("#videoHide").html() + editor.html();
        //投放广告1
        var hasAdvertisement1 = $("#drop1 .radio.checked").attr("name");
        //投放广告2
        var hasAdvertisement2 = $("#drop2 .radio.checked").attr("name");


        //请输入标题
        if (isNull($("#titleTxt").val())) {
            layer.msg("请输入标题");
            return false;
        }
        // 新增需求：发表的视频不能少于三秒
        if (!isNull($("#videoHide").html())) {
            //视频时长
            var releaseTime = document.getElementsByTagName("video")[0].duration;
            releaseTime = formatSeconds(releaseTime);
            if (videoTime(releaseTime)) {
                layer.msg("发表的视频不能少于三秒");
                return false;
            }
            if (isNull($("#videoHide").find("video").attr("poster"))) {
                layer.msg("发表的视频必须要有封面图");
                return false;
            }
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
        // if (articleContent.indexOf("<img") == -1) { //文章中没有图片
        //     layer.msg("请在文章中添加图片");
        //     return false;
        // }
        var scCmsResourcesList = [];
        $("#previews img").each(function(i, v) {
            scCmsResourcesList.push({
                "resourcesName": $(v).attr("class").replace("active", "").replace("editor_img", "").trim(),
                "resourcesUrl": $(v).attr("src"),
                "resourcesType": 'cover',
                "resourcesImgWidth": "170",
                "resourcesImgHeight": "170"
            });
        });
        var imgLen = $("#previews img").length;
        console.log("imgLen" + ":" + imgLen);
        if (imgLen == 1) {
            previewImgType = "1"
            submitFlag = true;
        } else if (imgLen == 3) {
            previewImgType = "2"
            submitFlag = true;
        }
        // else {
        //     layer.msg("请选择一张封面图或者三张封面图");
        //     submitFlag = false;
        // }

        var label = "";
        $(".labelAll button").each(function(i, v) {
            label += $(v).text() + ",";
        });
        var articleId = "";
        if (!isNull(GetQueryString("articleId"))) {
            articleId = GetQueryString("articleId");
        }
        if (isDraft == 0) {
            if (isNull(articleContent)) {
                layer.msg("请输入文章内容");
                return false;
            }
            if (isNull($("#previews").html().trim())) {
                layer.msg("请选择封面图");
                return false;
            }
            if (imgLen != 1 && imgLen != 3) {
                layer.msg("请选择一张封面图或者三张封面图");
                submitFlag = false;
            }
            if (isNull(channelId)) {
                layer.msg("请选择频道");
                return false;
            }
            if (isNull(label)) {
                layer.msg("请选择标签");
                return false;
            }
            if (hasAdvertisement1 == 2) {
                var sccmsadvid1 = $('.AdSense[type=1]').attr('sccmsadvid');
                if (isNull(sccmsadvid1)) {
                    return layer.msg('请选择广告位1')
                };
            }
            if (hasAdvertisement2 == 2) {
                var sccmsadvid2 = $('.AdSense[type=2]').attr('sccmsadvid');
                if (isNull(sccmsadvid2)) {
                    return layer.msg('请选择广告位2')
                };
            }
        }
        var scCmsAdvArticle = [];
        if (hasAdvertisement1 == 2) {
            var sccmsadvid1 = $('.AdSense[type=1]').attr('sccmsadvid');
            if (!isNull(sccmsadvid1)) {
                scCmsAdvArticle.push({
                    scCmsAdvId: sccmsadvid1,
                    scCmsAdvPlaceId: $('.AdSense[type=1]').attr('advPlaceApp1')
                });
            };
        }
        if (hasAdvertisement2 == 2) {
            var sccmsadvid2 = $('.AdSense[type=2]').attr('sccmsadvid');
            if (!isNull(sccmsadvid2)) {
                scCmsAdvArticle.push({
                    scCmsAdvId: sccmsadvid2,
                    scCmsAdvPlaceId: $('.AdSense[type=2]').attr('advPlaceApp2')
                });
            };
        }
        var data = {
            // "shopId": localStorage.getItem("shopId") || "",
            "articleId": articleId,
            "typeCode": "1001",
            "articleTitle": articleTitle,
            "articleContent": articleContent,
            "releaseId": userId,
            "releaseProvince": province,
            "releaseCity": city,
            "previewImgType": previewImgType,
            "subscriptionId": subscriptionId,
            "releaseType": subscriptionType,
            "channelId": channelId,
            "isDraft": isDraft,
            // "hasAdvertisement": hasAdvertisement,
            "label": label,
            "scCmsResourcesList": scCmsResourcesList,
            //投放广告位参数
            "scCmsAdvPlaceArticle": [{
                scCmsAdvPlaceId: $('.AdSense[type=1]').attr('advPlaceApp1'),
                scCmsDelivery: hasAdvertisement1
            },
            {
                scCmsAdvPlaceId: $('.AdSense[type=2]').attr('advPlaceApp2'),
                scCmsDelivery: hasAdvertisement2
            }],
            "scCmsAdvArticle": scCmsAdvArticle,
            "shopId":localStorage.getItem("shopSynchronous")
        };
        if (submitFlag) {
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dateType: "json",
                async: true,
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
                    layer.msg(re.msg);
                    var editorHtml = editor.html();
                    if (re.code == 1) {
                        articleId = isNull(re.data) ? articleId : re.data.articleId;
                        sendSpecial(articleId, isDraft);
                        editor.html("");
                        localStorage.removeItem("editorTxt_" + userId);
                    }
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
    }

    //获取当前页面要修改的内容
    function getContent(data) {
        var btn = "";
        arr = [];
        //标题
        $("#titleTxt").val(data.articleTitle);
        getKeyup($("#titleTxt"), $("#fontLen"));
        //富文本编辑器
        var articleContent = data.articleContent;
        $("#editorBox").html(articleContent);
        if (!isNull($("#editorBox").find("video"))) {
            // 插入视频
            $("#videoHide").html($("#editorBox").find("video"));
            var editorBoxHtml = $("#editorBox").html();
            // 编辑器插入除了视频以外的东西
            editor.html(articleContent.replace($("#videoHide").html(), ""));
        }
        //封面
        $.each(data.scCmsResourcesList, function(i, v) {
            if (v.resourcesType == "cover") {
                if (!isNull(v.resourcesUrl)) {
                    var img = "<div class='item_box fl'><img src='" + v.resourcesUrl + "' class='editor_img' width='170' height='170'/><i class='deleteI'></i></div>";
                    $("#previews").html($("#previews").html() + img);
                }
            }
        });
        //清空标签
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(REQUEST_URL.label, modalBtnAll, "zxSelected", data.channelId);
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
        //分类
        $("#articleSec").val(data.channelId);
        // 重新渲染频道
        form.render('select', 'channelSec');
        //广告
        $.each(data.scCmsAdvPlaceArticle, function(i, v) {
                if (v.scCmsAdvPlaceId == 12) {
                    $("#drop1 .radio.checked").removeClass("checked");
                    $('#drop1 .radio[name="' + v.scCmsDelivery + '"]').addClass("checked");
                    if (v.scCmsDelivery == 2) {
                        $.each(data.scCmsAdvArticle, function(i, v) {
                            if (v.scCmsAdvPlaceId == 12) {
                                $('#AdSense1AdvTit').html('*已投放的自营广告为“' + v.scCmsAdvTitle + '”');
                                $('.AdSense[type=1]').attr('sccmsadvid', v.scCmsAdvId);
                            }
                        });
                    }
                }
                if (v.scCmsAdvPlaceId == 13) {
                    $("#drop2 .radio.checked").removeClass("checked");
                    $('#drop2 .radio[name="' + v.scCmsDelivery + '"]').addClass("checked");
                    if (v.scCmsDelivery == 2) {
                        $.each(data.scCmsAdvArticle, function(i, v) {
                            if (v.scCmsAdvPlaceId == 13) {
                                $('#AdSense2AdvTit').html('*已投放的自营广告为“' + v.scCmsAdvTitle + '”');
                                $('.AdSense[type=2]').attr('sccmsadvid', v.scCmsAdvId);
                            }
                        });
                    }
                }
            })
            // 专题是否选中
        if (!isNull(data.scCmsSpecial)) {
            $(".scCmsSpecial").hide();
        }
    }

    //js over
});

//模态框调用广告列表和分页接口
function adList(d, flag) {
    reqAjaxAsync('cms_back/selectTradingList', JSON.stringify(d)).done(function(res) {
        if (res.code != 1) {
            return layer.msg(res.msg);
        };
        if (res.code == 1) {
            var data = res.data || '';
            var total = res.total || '';
            if (!isNull(data)) {
                console.log(data);
                var getTpl = $("#adList").html();
                adPages = Math.ceil(total / 5);
                console.log(adPages);
                adPages > 1 ? $('#adPage').show() : $('#adPage').hide();
                laytpl(getTpl).render(data, function(html) {
                    $("#addAddTableCon").html(html);
                });
                return flag ? getPage(adPages, d) : false;
            } else {
                $("#addAddTableCon").html('');
                $('#adPage').hide();
                layer.msg('当前列表没有广告');
            }
        }
    });
}

function getPage(pages, d) { //获取分页
    laypage({
        cont: 'adPage', //容器。值支持id名、原生dom对象，jquery对象,
        pages: pages, //总页数
        skip: true, //是否开启跳页
        skin: '#2BC6FF',
        groups: 3, //连续显示分页数
        jump: function(obj) {
            d.pagination.page = obj.curr;
            adList(d, false);
        }
    });
}