var layer = layui.layer,
    laytpl = layui.laytpl;

$(function() {
    var recommendList = $("#recommendList").html();
    var userId = localStorage.getItem("userId") || "1";
    var toutiao = function() {
        this.flag = false;
        this.url = {
            channel: "cms_back/selectAllChannel",
            carousel: "cms_new/queryScCmsCarouseList",
            aticleList: "cms_new/queryReArticleList",
            hot: 'cms_new/querSearchRecordHotName' //热词
        };
    };

    var homepage = new toutiao();
    // 启动导航
    getChannel({
        url: homepage.url.channel,
        num: 0,
        dom: $("#navUl")
    });
});