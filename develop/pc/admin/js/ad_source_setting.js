var layer = layui.layer;
var laytpl = layui.laytpl;
var laypage = layui.laypage;
$(function() {
    var adlList = $("#adlList").html();
    var start, S = function() {};
    S.prototype = {
        url: {
            get: "querScCmsAdvSource",
            add: "addScCmsAdvSource",
            edit: "updateScCmsAdvSource",
            del: "delScCmsAdvSource"
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
    // 切换模态框里面的radio
    $(".radio").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // 开通
    $("#labelTabCon").on('click', '.operationTd .openA', function() {
        start.openDataAjax({
            "scCmsAdvSourceId": $(this).parent().attr("scCmsAdvSourceId"),
            "scCmsAdvSoureIsDel": "1"
        });
    });
    // 关闭
    $("#labelTabCon").on('click', '.operationTd .closeA', function() {
        start.openDataAjax({
            "scCmsAdvSourceId": $(this).parent().attr("scCmsAdvSourceId"),
            "scCmsAdvSoureIsDel": "0"
        });
    });
    // 点击修改打开模态框
    $("#labelTabCon").on('click', '.operationTd .editA', function() {
        var sccmsadvSourceid = $(this).parent('.operationTd').attr("sccmsadvSourceid");
        var json = $(this).data("json");
        // sccmsadvSourceid
        $("#scCmsAdvSourceIdHid").val(sccmsadvSourceid);
        $("#editSourceSel").val(json.scCmsAdvSourceType || "");
        $("#editAdTxt").val(json.scCmsAdvSourceName || "");
        $("#editUrlTxt").val(json.scCmsAdvSourceUrl);
        // 平台选择类型
        $("#editSel").val(json.scCmsAdvSourcePlatForm);
        $("#editStatus").find(".radio[type='" + json.scCmsAdvSoureIsDel + "']").addClass("active").siblings().removeClass("active");
    });
    // 修改
    $("#confirmEditSub").click(function() {
        start.editDataAjax({
            "scCmsAdvSourceId": $("#scCmsAdvSourceIdHid").val(),
            "scCmsAdvSourceName": $("#editAdTxt").val(),
            "scCmsAdvSourcePlatForm": $("#editSel").val(),
            "scCmsAdvSourceType": $("#editSourceSel").val(),
            "scCmsAdvSourceUrl": $("#editUrlTxt").val(),
            "scCmsAdvSoureIsDel": $("#editStatus").find(".radio.active").attr("type"),
        });
    });
    // 添加
    $("#confirmAddSub").click(function() {
        start.addDataAjax({
            "scCmsAdvSourceName": $("#addAdTxt").val(),
            "scCmsAdvSourcePlatForm": $("#addSel").val(),
            "scCmsAdvSourceType": $("#addSourceSel").val(),
            "scCmsAdvSourceUrl": $("#addUrlTxt").val(),
            "scCmsAdvSoureIsDel": $("#addStatus").find(".radio.active").attr("type"),
        });
    });
    // 删除
    $("#labelTabCon").on('click', '.operationTd .removeA', function() {
        var sccmsadvSourceid = $(this).parent('.operationTd').attr("sccmsadvSourceid");
        start.delDataAjax({
            "scCmsAdvSourceId": sccmsadvSourceid,
        });
    });
    //   js over
});