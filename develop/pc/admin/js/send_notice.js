var layer = layui.layer;
//初始化富文本编辑器
KindEditor.lang({
    images: '插入图片'
});
KindEditor.plugin('images', function (K) {
    var self = this,
        name = 'images';
    self.clickToolbar(name, function () {
        $("#btn").click();
    });
});
//初始化富文本编辑器
var editor = kindInit();
//获取用户id
var userId = localStorage.getItem("userId") || "";
//获取之前编辑过的内容,代入编辑器中
var editorTxt = localStorage.getItem("editorTxt_" + userId) || "";
editor.html(editorTxt);

//富文本编辑器上传图片
uploadOss({
    btn: document.getElementById("btn"),
    imgArr: [],
    editor: editor,
    flag: "send"
});

$(function () {
    var start;
    //文章标题字数统计
    getKeyup($("#titleTxt"), $("#fontLen"));
    //启动定时器实时保存内容
    setInterval(function () {
        localStorage.setItem("html", editor.html());
        localStorage.setItem("editorTxt_" + userId, editor.html());
    }, 800);
    //封装保存公告方法
    function noticeInit() {
        this.sendUrl = "saveNotice";
        this.selectNotice = "selectNotice";
        this.updateNotice = "updateNotice";
    }
    noticeInit.prototype = {
        sendNotice: function (flag, scCmsNoticeId) {
            if (isNull($("#titleTxt").val().trim())) {
                layer.tips('请输入标题', $("#titleTxt").valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                return false;
            }
            if ($("#titleTxt").val().trim().length < 5) {
                layer.tips('标题长度不能小于5个字', $("#titleTxt").valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                return false;
            }
            if ($("#titleTxt").val().trim().length > 30) {
                layer.tips('标题长度不能超过30个字', $("#titleTxt").valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                return false;
            }
            if (isNull(editor.html().trim())) {
                layer.msg("请输入内容");
                return false;
            }
            //传递参数
            var Response = {
                scCmsNoticeTitle: $("#titleTxt").val(),
                scCmsNoticeContent: editor.html(),
                scCmsNoticeUserId: userId,
                scCmsNoticeId: scCmsNoticeId
            };
            var url = flag ? start.sendUrl : start.updateNotice;
            var res = reqNewAjax(url, Response);
            if (res.code == 1) {
                localStorage.setItem("editorTxt_" + userId, "");
                location.href = "index.html";
            } else {
                layer.msg(res.msg);
            }
        },
        // 获取修改的内容
        getNotice: function (d) {
            var res = reqNewAjax(start.selectNotice, d);
            if (!isNull(res.data)) {
                $("#titleTxt").val(res.data.scCmsNoticeTitle);
                editor.html(res.data.scCmsNoticeContent);
            }
            if (res.code != 1) {
                layer.msg(res.msg);
            }
        }
    };
    start = new noticeInit();

    //提交
    $("#submitBtn").click(function () {
        if (!isNull(GetQueryString("scCmsNoticeId"))) {
            start.sendNotice(false, GetQueryString("scCmsNoticeId"));
            return false;
        }
        start.sendNotice(true);
    });

    //如果是修改的情况
    if (!isNull(GetQueryString("scCmsNoticeId"))) {
        //获取要修改的内容
        start.getNotice({
            scCmsNoticeId: GetQueryString("scCmsNoticeId")
        });
    }
    //js over
});