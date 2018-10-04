var layer = layui.layer;
var laytpl = layui.laytpl;
var laypage = layui.laypage;
$(function() {
    var adlList = $("#adlList").html();
    var start, S = function() {};
    S.prototype = {
        url: {
            get: "querScCmsAdvPlace",
            add: "addScCmsAdvPlace",
            edit: "updateScCmsAdvPlace",
            del: "delScCmsAdvPlace"
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
            if (isNull($("#addAdTxt").val())) {
                return layer.msg("请填写广告位名称");
            }
            else if (isNull($("#previewBox2").html())) {
                return layer.msg("请上传广告位预览图");
            }
            reqNewAjaxAsync(self.url.add, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    self.init();
                    // 添加成功重置表单
                    $("#addAdTxt").val("");
                    $("#appAdTxt").val("");
                    $("#previewBox2").html("");
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
            "scCmsAdvPlaceId": $(this).parent().attr("scCmsAdvPlaceId"),
            "scCmsAdvPlaceIsDel": "1"
        });
    });
    // 关闭
    $("#labelTabCon").on('click', '.operationTd .closeA', function() {
        start.openDataAjax({
            "scCmsAdvPlaceId": $(this).parent().attr("scCmsAdvPlaceId"),
            "scCmsAdvPlaceIsDel": "0"
        });
    });
    // 点击修改打开模态框
    $("#labelTabCon").on('click', '.operationTd .editA', function() {
        var sccmsadvplaceid = $(this).parent('.operationTd').attr("sccmsadvplaceid");
        var json = $(this).data("json");
        // sccmsadvplaceid
        $("#scCmsAdvPlaceIdHid").val(sccmsadvplaceid);
        // 广告位名称
        $("#editAdTxt").val(json.scCmsAdvPlaceName || "");
        // APPID
        $("#appEditAdTxt").val(json.scCmsAdvPlaceApp || "");
        // 图片
        $("#previewBox").html("<img src='" + json.scCmsAdvPlaceImg + "' style='max-width:400px;'>");
        // 平台选择类型
        $("#editSel").val(json.scCmsAdvPlacePlatForm);
        $("#editStatus").find(".radio[type='" + json.scCmsAdvPlaceIsDel + "']").addClass("active").siblings().removeClass("active");
    });
    // 修改
    $("#confirmEditSub").click(function() {
        start.editDataAjax({
            "scCmsAdvPlaceId": $("#scCmsAdvPlaceIdHid").val(),
            "scCmsAdvPlaceName": $("#editAdTxt").val(),
            "scCmsAdvPlaceImg": $("#previewBox").find("img").attr("src"),
            "scCmsAdvPlacePlatForm": $("#editSel").val(),
            "scCmsAdvPlaceIsDel": $("#editStatus").find(".radio.active").attr("type"),
            "scCmsAdvPlaceApp": $("#appEditAdTxt").val()
        });
    });
    // 添加
    $("#confirmAddSub").click(function() {
        start.addDataAjax({
            "scCmsAdvPlaceName": $("#addAdTxt").val(),
            "scCmsAdvPlaceImg": $("#previewBox2").find("img").attr("src"),
            "scCmsAdvPlacePlatForm": $("#addSel").val(),
            "scCmsAdvPlaceIsDel": $("#addStatus").find(".radio.active").attr("type"),
            "scCmsAdvPlaceApp": $("#appAdTxt").val()
        });
    });
    // 删除
    $("#labelTabCon").on('click', '.operationTd .removeA', function() {
        var sccmsadvplaceid = $(this).parent('.operationTd').attr("sccmsadvplaceid");
        start.delDataAjax({
            "scCmsAdvPlaceId": sccmsadvplaceid,
        });
    });
    // 点击图片放大
    $("#labelTabCon").on('click', '.adlImgTd .adImg', function() {
        $("#img").attr("src", $(this).attr("src"));
        $(".bgBox").show();
    });
    $(".bgBox").click(function(e) {
        $(this).hide();
    });
    $("#img").click(function(e) {
        e.stopPropagation();
    })
});