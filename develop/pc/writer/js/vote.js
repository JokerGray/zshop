var layer = layui.layer,
    laydate = layui.laydate,
    form = layui.form();
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
    var isShop = GetQueryString("isShop");
    //获取用户id
    var userId = localStorage.getItem("userId") || "";
    //获取是否有参数articleId
    var articleId = GetQueryString("articleId");
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
    //标签集合
    var arr = [];
    //储存富文本编辑器中的图片
    var imgArr = [];
    //频道ID的标记
    var oldChannel = '';
    //获取所有信息
    var articleData = localStorage.getItem("articleData") || "";
    //获取当前身份
    var subscriptionType = localStorage.getItem("subscriptionType");
    var isExamine = localStorage.getItem("isExamine") || "";
    var articleFlag = false;
    //获取之前未编辑完的内容
    var voteCont = localStorage.getItem("v_editorTxt_" + userId);
    //投票选手资源表
    var votePlayerList = [];
    //审核状态标识
    var editDraft = 0;
    var editExamine = 0;
    var editVoteNum = 0;
    //url集合
    var voteUrl = {
        label: "cms_new/queryArticleLabel", //根据频道获取标签
        send: "cms_new/publishVote", //发表
        edit: "cms_new/updateVote", //修改
        draft: "cms_new/publishVoteDraft", //草稿
        voteDetail: 'cms_new/queryVoteDetail' //修改查询问题详情
    };
    $('.playerSettings2').hide();

    //点击日期获取时间
    layui.use('laydate', function() {
        var sTime;
        var laydate = layui.laydate;
        var startDate = {
            min: laydate.now(),
            format: 'YYYY-MM-DD',
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                sTime=datas;
                // endDate.min = datas; //开始日选好后，重置结束日的最小日期
                // 设置结束的开始时间
                endDate.min = formatDate(new Date(sTime).getTime()/1000+86400); //开始日选好后，重置结束日的最小日期
                endDate.max = formatDate(new Date(datas).getTime() / 1000 + 2592000); //开始日选好后，重置结束日的最大日期
                endDate.start = formatDate(new Date(sTime).getTime()/1000+86400); //将结束日的初始值设定为开始日
                start.startTime = datas;
                start.endTime = $("#end").val();
                if (!isNull($("#end").val())) {
                    start.startTime = datas;
                    start.endTime = $("#end").val();
                }
            }
        };
        var endDate = {
            min:laydate.now(1),
            format: 'YYYY-MM-DD',
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                var startMin = new Date(datas).getTime() / 1000 - 2592000;
                //结束日选好后，重置开始日的最小日期
                if (startMin > new Date().getTime() / 1000) {
                    startDate.min = formatDate(startMin);
                } else {
                    startDate.min = laydate.now();
                }
                //选择结束时间后，设置开始时间的最大值
                startDate.max = formatDate(new Date(datas).getTime()/1000-86400); //结束日选好后，重置开始日的最大日期
                start.startTime = $("#start").val();
                start.endTime = datas;
                if (!isNull($("#start").val())) {
                    start.startTime = $("#start").val();
                    start.endTime = datas;
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
    //从本地选择封面
    uploadOss({
        btn: "localBtn",
        imgDom: "previews",
        flag: "sendLocals"
    });
    //选择参与者的头像
    uploadOss({
        btn: "iconBtn",
        imgDom: "playerIconBtn",
        flag: "playerIcon"
    });
    // 获取频道
    getCoffeeChannel({
        userId: getCoffeeUserId()
    });
    //判断当前url后缀是否有文章id
    if (!isNull(articleId)) {
        get(voteUrl.voteDetail, {
            userId: userId,
            articleId: articleId
        });
    } else {
        $('#voteInfoInp').val(voteCont);
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
    //所有radio点击事件
    $('.drop').on('click', '.form-radio', function() {
            if ((editDraft == 0 && editExamine != 0) || editVoteNum > 0) {
                return false;
            }
            $(this).find('span').addClass('checked');
            $(this).siblings().find('span').removeClass('checked');
        })
        //选项图文还是文字
    $('.playerDrop').on('click', '.form-radio', function() {
            if ((editDraft == 0 && editExamine != 0) || editVoteNum > 0) {
                return false;
            }
            var radioName = $(this).find('.radio').attr('name');
            if (radioName == 'playerSettings1' && $('#playerList .multiInfo').length > 0) {
                $('#playerList').html('');
                votePlayerList = [];
            }
            if (radioName == 'playerSettings2' && $('#playerList .singleInfo').length > 0) {
                $('#playerList').html('');
                votePlayerList = [];
            }
            $('.playerSettingBox .' + $(this).find('.radio').attr('name')).show().siblings().hide();
        })
        //选项序号只能填写数字
    ExamInpNum('#multiNumInp');
    //参与者图文上传头像图片点击事件
    $("#playerIconBtn").click(function() {
        if ((editDraft == 0 && editExamine != 0) || editVoteNum > 0) {
            return false;
        }
        $("#iconBtn").click();
    });
    //点击提交参与者选项
    $('.playerSettingBox').on('click', 'button', function() {
            var type = $(this).attr('type');
            if (type == 'single') {
                var singleVal = $('#singleInp').val().trim();
                if (isNull(singleVal)) {
                    layer.msg('请把内容填写完整');
                    return false;
                }
                playerHtmlFunc(type, {
                    tit: singleVal
                });
            } else if (type == 'multi') {
                var imgUrl = $('#playerIconBtn').attr('src'),
                    preUrl = 'images/adsever/add_one.png',
                    numVal = $('#multiNumInp').val().trim();
                    descriVal = $('#multiDescriInp').val().trim(),
                    titVal = $('#multiTitInp').val().trim();
                    // // 判断首位为0，就去掉0
                    // if(/^0/.test(numVal)){
                    //     numVal=numVal.substr(1,numVal.length-1);
                    // }
                if (imgUrl == preUrl || isNull(imgUrl) || isNull(numVal) || isNull(titVal) || isNull(descriVal)) {
                    layer.msg('请把内容填写完整');                    
                }else if($("#playerList .multiInfo").length>0){   
                    var sentH=$("#playerList li .multiNum");
                    for (var i=0;i<sentH.length;i++) {
                        if ($(sentH[i]).html()==$("#multiNumInp").val()) {
                            layer.msg('编号重复请重新输入');
                            return false;
                        }
                    }
                    
                    playerHtmlFunc(type, {
                        img: imgUrl,
                        num: numVal,
                        tit: titVal,
                        describe: descriVal
                    })  
                }else{
                    playerHtmlFunc(type, {
                        img: imgUrl,
                        num: numVal,
                        tit: titVal,
                        describe: descriVal
                    })  
                }
            }
        })
        // 拖拽排序
    $("#playerList").sortable({
        axis: 'y',
        update: function(event, ui) {
            console.log(ui.item.index());
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
        localStorage.setItem("v_editorTxt_" + userId, $('#voteInfoInp').val());
    }, 800);
    //频道获取标签
    form.on('select(channelSec)', function(data) {
        //清空标签
        arr = [];
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(voteUrl.label, modalBtnAll, "zxSelected", data.value);
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
            send("0", voteUrl.edit, articleId); //修改接口
        } else {
            send("0", voteUrl.send); //发表接口
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
            send("1", voteUrl.edit, articleId); //修改接口
        } else {
            send("1", voteUrl.draft); //草稿接口
        }
    });
    //取消跳转到首页
    $("#cancleA").click(function() {
        location.href = "voteManage.html";
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
                    if (res.data.typeCode == "1007") {
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
        $("#voteInfoInp").val(articleContent);
        // 编辑器插入除了视频以外的东西
        //封面
        $.each(data.scCmsResourcesList, function(i, v) {
            if (v.resourcesType == "cover") {
                if (!isNull(v.resourcesUrl)) {
                    imgs += "<div class='item_box fl'><img src='" + v.resourcesUrl + "' class='editor_img' width='170' height='170'/><i class='deleteI'></i></div>";
                }
            }
        });
        $("#previews").html(imgs);
        //选项
        $('.playerDrop .radio').removeClass('checked');
        $('.playerDrop .radio[type="' + data.scCmsVoteType + '"]').addClass('checked');
        if (!isNull(data.scCmsVoteList)) {
            var voteObj = {},
                voteType = '';
            $.each(data.scCmsVoteList, function(i, e) {
                voteObj = {
                    img: e.scCmsVoteUrl || '',
                    num: e.scCmsVoteNumber || '0',
                    tit: e.scCmsVoteTitle || '',
                    describe: e.scCmsVoteDescribe || ''
                }
                if (data.scCmsVoteType == 0) {
                    playerHtmlFunc('multi', voteObj);
                    $('.playerSettings2').show().siblings().hide();
                    $('#playerList').attr('type', 0);
                } else if (data.scCmsVoteType == 1) {
                    playerHtmlFunc('single', voteObj);
                    $('.playerSettings1').show().siblings().hide();
                    $('#playerList').attr('type', 1);
                }
            })
        }
        //投票方式
        $('#voteWay .radio').removeClass('checked');
        $('#voteWay .radio[type="' + data.scCmsVoteOption + '"]').addClass('checked');
        //投票设置
        $('#voteSetting .radio').removeClass('checked');
        $('#voteSetting .radio[type="' + data.scCmsVoteMethod + '"]').addClass('checked');
        //时间
        var startTime = data.scCmsVoteStartTime,
            endTime = data.scCmsVoteEndTime;
        $('#start').val(isNull(startTime) ? '' : startTime.substr(0, endTime.indexOf(' ')));
        $('#end').val(isNull(endTime) ? '' : endTime.substr(0, endTime.indexOf(' ')));
        //分类
        $("#articleSec").val(data.channelId);
        //清空标签
        $(".labelAll").html("");
        //获取标签
        getQueryArticleLabelAjax(voteUrl.label, modalBtnAll, "zxSelected", data.channelId);
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
        // 重新渲染频道
        form.render('select', 'channelSec');
        if ((data.isDraft == 0 && data.isExamine != 0) || data.scCmsVoteAllNumber > 0) {
            $('#titleTxt').attr("readonly", "readonly").addClass('gray');
            $('.form-content button').attr("disabled", "disabled").addClass('gray');
            $('.form-content input').attr("disabled", "disabled").addClass('gray');
            $('#articleDraft').attr("disabled", "disabled").addClass('gray');
            $('.form-content dl').hide();
            $('.form-content i').hide();
            $('.submitLabelA').hide();
            editDraft = data.isDraft;
            editExamine = data.isExamine;
            editVoteNum = data.scCmsVoteAllNumber;
            $("#playerList").sortable({
                axis: 'y',
                disabled: true
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
    //发表提问回调
    function send(isDraft, cmd, articleId) {
        var previewImgType = "";
        var articleDataObj = JSON.parse(articleData);
        //"发布内容省
        var province = articleDataObj.provinceCode;
        //发布内容
        var editorHtml = $('#voteInfoInp').val();
        //领域分类
        var channelId = $("#articleSec").val();
        //标题
        var titleTxt = $("#titleTxt").val();
        //城市
        var city = articleDataObj.cityCode || "";
        //头条号id
        var subscriptionId = articleDataObj.subscriptionId || "";
        //投票选手资源类型
        var votePlayerType = $('#playerList').attr('type');
        //投票开始时间
        var voteStartTime = $('#start').val();
        //投票结束时间
        var voteEndTime = $('#end').val();
        //投票选项（0 实名 1 匿名）
        var voteWay = $('#voteWay .radio.checked').attr('type');
        //投票票数选项（0  1）
        var voteSetting = $('#voteSetting .radio.checked').attr('type');
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
            previewImgType = "14";
        } else if (imgLen == 3) {
            previewImgType = "15";
        } else if (imgLen == 0) {
            previewImgType = "13";
        }
        if (votePlayerType == 1) {
            if (!isNull(votePlayerList)) {
                votePlayerList = [];
            }
            var voteNum = 1;
            $('#playerList .singleInfo').each(function(i, e) {
                votePlayerList.push({
                    scCmsVoteTitle: $(e).html(),
                    scCmsVoteNumber: voteNum
                });
                voteNum++;
            })
        } else if (votePlayerType == 0) {
            if (!isNull(votePlayerList)) {
                votePlayerList = [];
            }
            $('#playerList .multiInfo').each(function(i, e) {
                votePlayerList.push({
                    scCmsVoteUrl: $(e).find('.multiUrl').attr('src'),
                    scCmsVoteNumber: $(e).find('.multiNum').html(),
                    scCmsVoteTitle: $(e).find('.multiTit').html(),
                    scCmsVoteDescribe: $(e).find('.multiDescri').html()
                });
            })
        }
        //请输入标题
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
            if (isNull(voteStartTime)) {
                layer.msg("请选择开始时间");
                return false;
            }
            if (isNull(voteEndTime)) {
                layer.msg("请选择结束时间");
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
            if (isNull(votePlayerList)) {
                layer.msg("请填写选项");
                return false;
            }
        }
        var data = {
            previewImgType: previewImgType, //"显示资源的方式， 0普通无图   1普通单图  2普通三图    3图集单图  4图集三图  5视频"",
            releaseProvince: province, //"发布内容省code",
            articleContent: editorHtml, //"内容",
            isDraft: isDraft, //"是否草稿：0，否；1，是",
            releaseId: userId, //"发布人主键(用户表.用户_id)",
            channelId: channelId, //"领域Id",
            articleTitle: titleTxt, //"标题",
            releaseCity: city, //"发布人所在城市",
            typeCode: 1007, //"1005:问题",
            label: label, //"标签",
            releaseType: subscriptionType, //"发布人的类型(0:作者;1:商家)"
            scCmsResourcesList: scCmsResourcesList, //资源列表
            subscriptionId: subscriptionId, //"头条号ID"
            scCmsVoteType: votePlayerType, //投票选项（0 图文 1 文字）
            scCmsVoteList: votePlayerList, //投票选手资源表
            scCmsVoteStartTime: isNull(voteStartTime) ? '' : voteStartTime + ' 00:00:00', //投票开始时间
            scCmsVoteEndTime: isNull(voteEndTime) ? '' : voteEndTime + ' 00:00:00', //投票结束时间
            scCmsVoteOption: voteWay, //投票选项（0 实名 1 匿名）
            scCmsVoteMethod: voteSetting //投票票数选项（0  1）
        };
        if (!isNull(articleId)) {
            data.articleId = articleId;
        }
        reqAjaxAsync(cmd, JSON.stringify(data)).done(function(res) {
            layer.closeAll('loading');
            isApikey(res);
            layer.msg(res.msg);
            if (res.code == 1) {
                $('#voteInfoInp').val("");
                localStorage.removeItem("v_editorTxt_" + userId);
                // qr修改云店头条对应跳转
                if (isShop == 1) {
                    window.parent.$("#reportIframe").attr("src", "/writer/voteManage.html");
                    window.parent.$("#managementTrends").click();
                    return false;
                }
                window.location.href = './voteManage.html';
            }
        });
    }
    //提交网红资料回调
    function playerHtmlFunc(type, valObj) {
        var playerHtml = '';
        if (type == 'single') {
            playerHtml = '<li class="singleInfo">' + valObj.tit + '</li>';
            $('#singleInp').val('');
            $('#playerList').attr('type', 1);
        } else if (type == 'multi') {
            playerHtml = '<li class="multiInfo clearfix">' +
                '<img class="fl multiUrl" src="' + valObj.img + '" alt="">' +
                '<div class="fl">' +
                '<p><span class="multiLabel">编号：</span> <span class="multiNum">' + valObj.num + '</span></p>' +
                '<p><span class="multiLabel">选项标题：</span> <span class="multiTit">' + valObj.tit + '</span></p>' +
                '<p><span class="multiLabel">选项描述：</span> <span class="multiDescri">' + valObj.describe + '</span></p>' +
                '</div>' +
                '</li>';
            $('#playerIconBtn').attr('src', 'images/adsever/add_one.png');
            $('#multiNumInp').val('');
            $('#multiTitInp').val('');
            $('#multiDescriInp').val('');
            $('#playerList').attr('type', 0);
        }
        $('#playerList').append(playerHtml);
    }

    
});