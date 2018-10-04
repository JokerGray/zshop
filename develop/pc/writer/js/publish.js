/**
 * 公用的发表js
 * robin
 */

var laypage = layui.laypage,
    laytpl = layui.laytpl;
var userId = localStorage.getItem("userId") || "";
var subscriptionType = localStorage.getItem("subscriptionType") || "";
var flag = true;
var REQUEST_URL = {
    getScCmsSpecialsName: "cms_new/getScCmsSpecialsName", //投稿到专题
    addScCmsArsp: "cms_new/addScCmsArsp",
    selectArticleDispatch: "cms_back/selectArticleDispatch", //查询作家发文数
};
//默认进来选中的需要同步的店铺id数组
var shopSynchronous=[];
// 初始化加载
var shopList = GetQueryString("josnShop");
var isShop = GetQueryString("isShop");
isShopInit(isShop); //商铺初始化
if(shopList){
    //后台地址进去获取商铺列表
    getShopList(JSON.parse(decodeURIComponent(shopList))); //商铺列表获取
}else{
    //writer内部跳转获取商铺列表获取
    shopListWriter();
}
function shopListWriter(){
    // var d = JSON.stringify({"userId": 571});
    var d = JSON.stringify({"userId": userId});
    reqAjaxAsync("shop/getMercartIdShopList", d).done(function(res) {
        if (res.code == 1) {
            if(res.data.length==0){
                $(".shopFor").hide();
            }else{
                $(".shopFor").show();
                //为了公用getShopList重新赋值
                for(var i=0;i<res.data.length;i++){
                    res.data[i].shopId=res.data[i].id;
                    shopSynchronous.push(res.data[i].shopId);
                }
                getShopList(res.data);
                localStorage.setItem("shopSynchronous",shopSynchronous);
            }
        }
    });
}
function getShopList(d) {
    var str = "";
    $("#shopBox").html("");
    if (isNull(d)) {
        return false;
    }
    $.each(d, function(i, v) {
        str += '<div class="form-radio mr20 articleShare">';
        str += '<span class="radio checked" shopId="' + v.shopId + '" cityId="' + v.cityId + '"></span>';
        str += '<span class="cur-d">' + (v.shopName) + '</span>';
        str += '</div>';
    });
    $("#shopBox").html(str);
}
$(function() {
    if (isShop == 1 || isShop == 2) {
        var param = location.search;
        $("#send_article").attr("href", "send_article.html" + param)
        $("#send_video").attr("href", "send_video.html" + param)
        $("#send_atlas").attr("href", "send_atlas.html" + param)
        $("#send_question").attr("href", "send_question.html" + param)
        $("#vote").attr("href", "vote.html" + param)
        $(".shopFor").show();
    }
    //将店铺同步到详情页radio点击切换
    $("body").on("click",".articleShare",function(){
        var shopId=$(this).find(".radio").attr("shopId");
        if($(this).find(".radio").hasClass("checked")){
            $(this).find(".radio").removeClass("checked");
        }else{
            $(this).find(".radio").addClass("checked");
        }
        var shopBox= $("#shopBox .articleShare");
        localStorage.setItem("shopSynchronous","");
        shopSynchronous.length=0
        for(var i=0;i<shopBox.length;i++){
            if($(shopBox[i]).find(".radio").hasClass("checked")){
                shopSynchronous.push(Number($(shopBox[i]).find(".radio").attr("shopid")));
                localStorage.setItem("shopSynchronous",shopSynchronous);
            }
        }
        
    })
    // 删除图片点击事件
    $("#previews").on('click', '.deleteI', function() {
        $(this).parent(".fl").remove();
        $("#ossfile").html("");
    });
    //点击标签时提示选择频道
    $('#selectLabelBtn').click(function() {
        if (isNull($('#articleSec').val())) {
            layer.msg("请先选择频道!");
            return false;
        }
    });
    // 获取发文数
    selectArticleDispatchFn({
        userId: userId,
        subscriptionType: subscriptionType
    });
    //获取专题
    getScCmsSpecialsName(REQUEST_URL.getScCmsSpecialsName);
    //专题搜索点击
    $("#searchA").click(function() {
        var scCmsSpecialName = $("#searchInp").val().trim();
        var data = JSON.stringify({
            scCmsSpecialName: scCmsSpecialName
        });
        searchSpecial(REQUEST_URL.getScCmsSpecialsName, data);
    });
    //模态框专题选中
    $("#specialUl").on('click', 'li', function() {
        $("#specialUl").find(".radio").removeClass("checked");
        $(this).find(".radio").addClass("checked");
    });
    //切换专题
    $("#formRadio").click(function() {
        console.log("切换")
        if (flag) {
            $(this).find(".radioS").addClass("checked");
            flag = false;
        } else {
            $(this).find(".radioS").removeClass("checked");
            flag = true;
        }
    });
    // // 切换商铺
    // $("#shopBox").find(".radio").click(function() {
    //     $(this).toggleClass("checked");
    // });
    // 切换描述
    $("#description").find(".radio").click(function() {
        $("#description").find(".radio").removeClass("checked");
        $(this).addClass("checked");
    });
    // 显示已选中的专题
    $("#specialConBtn").click(function() {
        var spe = $("#specialUl li .radio.checked").next("span.cur-d").text();
        $("#showSpe").text('"' + spe + '"');
    });
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
    //js over
});

// 投稿到专题请求ajax
function sendSpecialAjax(data, isDraft) {
    var cmd = REQUEST_URL.addScCmsArsp;
    reqAjaxAsync(cmd, data).done(function(res) {
        layer.msg(res.msg);
        if (isShop == 1) {
            window.parent.$("#reportIframe").attr("src", "/writer/report.html");
            window.parent.$("#managementTrends").click();
        }
        else if (isDraft == "1") {
            location.href = "report.html?isDraft=1";
        }
        else {
            location.href = "report.html";
        }
    });
}

// 投稿到专题
function sendSpecial(articleId, isDraft) {
    var dom = $("#formRadio").find(".radio");
    var arsps = [];
    $("#submitBtnAll").hide();
    if (dom.hasClass("checked")) {
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
        sendSpecialAjax(RESPONSE, isDraft);
    } else {
        if (isShop == 1) {
            window.parent.$("#reportIframe").attr("src", "/writer/report.html");
            window.parent.$("#managementTrends").click();
        }
        else if (isDraft == "1") {
            location.href = "report.html?isDraft=1";
        }
        else {
            location.href = "report.html";
        }
    }
}

// 查询作家发文数
function selectArticleDispatchFn(d) {
    var d = JSON.stringify(d);
    reqAjaxAsync(REQUEST_URL.selectArticleDispatch, d).done(function(res) {
        if (res.code != 1) {
            layer.msg(res.msg);
        }
    });
}