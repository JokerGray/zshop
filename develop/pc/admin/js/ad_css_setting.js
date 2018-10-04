var layer = layui.layer;
var laytpl = layui.laytpl;
var laypage = layui.laypage;
$(function() {
    var adlList = $("#adlList").html();
    var start, S = function() {};
    S.prototype = {
        url: {
            get: "querScCmsAdvStyle",
            add: "addScCmsAdvStyle",
            edit: "updateScCmsAdvStyle",
            del: "delScCmsAdvStyle"
        },
        init: function() {
            this.getDataAjax({});
            $("#addModal").modal("hide");
            $("#editModal").modal("hide");
        },
        getDataAjax: function(d) {
            var self = this;
            reqNewAjaxAsync(self.url.get, d).then(function(res) {
                laytpl(adlList).render(res.data, function(html) {
                    $("#labelTabCon").html(html);
                });
            });
        },
        openDataAjax: function(d) {
            var self = this;
            reqNewAjaxAsync(self.url.edit, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    self.init();
                }
            });
        },
        editDataAjax: function(d) {
            var self = this;
            reqNewAjaxAsync(self.url.edit, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    self.init();
                }
            });
        },
        addDataAjax: function(d) {
            var self = this;
            reqNewAjaxAsync(self.url.add, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    self.init();
                    // 添加成功重置表单
                    $("#addAdTxt").val("");
                    $("#addSel").val("1003");
                    $("#addStatus .radio").eq(0).click();
                }
            });
        },
        delDataAjax: function(d) {
            var self = this;
            reqNewAjaxAsync(self.url.del, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    self.init();
                }
            });
        }
    };
    // 初始化加载
    start = new S();
    start.init();
    uploadOss({
        flag: "sendLocal",
        btn: "selLocalfiles",
        imgDom: "previewBox",
        size: "1gb"
    });
    uploadOss({
        flag: "sendLocal",
        btn: "selLocalfiles2",
        imgDom: "previewBox2",
        size: "1gb"
    });
    // 切换模态框里面的radio
    $(".radio").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // 开通
    $("#labelTabCon").on('click', '.operationTd .openA', function() {
        start.openDataAjax({
            "scCmsAdvStyleId": $(this).parent().attr("scCmsAdvStyleId"),
            "scCmsAdvStyleIsDel": "1"
        });
    });
    // 关闭
    $("#labelTabCon").on('click', '.operationTd .closeA', function() {
        start.openDataAjax({
            "scCmsAdvStyleId": $(this).parent().attr("scCmsAdvStyleId"),
            "scCmsAdvStyleIsDel": "0"
        });
    });
    // 点击修改打开模态框
    $("#labelTabCon").on('click', '.operationTd .editA', function() {
        var sccmsadvStyleid = $(this).parent('.operationTd').attr("sccmsadvStyleid");
        var json = $(this).data("json");
        // sccmsadvStyleid
        $("#scCmsAdvStyleIdHid").val(sccmsadvStyleid);
        // 广告位名称
        $("#editAdTxt").val(json.scCmsAdvStyleName || "");
        // APPID
        $("#appEditAdTxt").val(json.scCmsAdvStyleApp || "");
        // 平台选择类型
        $("#editSel").val(json.scCmsAdvStylePlatForm);
        // 广告类型
        $("#editSelType").val(json.scCmsAdvStyleType);
        $("#editStatus").find(".radio[type='" + json.scCmsAdvStyleIsDel + "']").addClass("active").siblings().removeClass("active");
    });
    // 修改
    $("#confirmEditSub").click(function() {
        start.editDataAjax({
            "scCmsAdvStyleId": $("#scCmsAdvStyleIdHid").val(),
            "scCmsAdvStyleName": $("#editAdTxt").val(),
            "scCmsAdvStylePlatForm": $("#editSel").val(),
            "scCmsAdvStyleType": $("#editSelType").val(),
            "scCmsAdvStyleIsDel": $("#editStatus").find(".radio.active").attr("type"),
        });
    });
    // 添加
    $("#confirmAddSub").click(function() {
        start.addDataAjax({
            "scCmsAdvStyleName": $("#addAdTxt").val(),
            "scCmsAdvStylePlatForm": $("#addSel").val(),
            "scCmsAdvStyleType": $("#addSelType").val(),
            "scCmsAdvStyleImg": $("#previewBox2").find("img").attr("src"),
            "scCmsAdvStyleIsDel": $("#addStatus").find(".radio.active").attr("type"),
        });
    });
    // 删除
    $("#labelTabCon").on('click', '.operationTd .removeA', function() {
        var sccmsadvStyleid = $(this).parent('.operationTd').attr("sccmsadvStyleid");
        start.delDataAjax({
            "scCmsAdvStyleId": sccmsadvStyleid,
        });
    });
    //   js over
});