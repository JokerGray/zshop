var page = 1;
var rows = 10;
var locked = true;
var merchantId = getUrlParams("merchantId"); //商户id
var templateSetId = getUrlParams("templateSetId"); //注册表数据id
var templateType = getUrlParams("templateType"); //模板类型A4, RM58, RM80
var templateSetName = getUrlParams("templateSetName"); //模板名称
var harr = []; //所有头字段
var barr = []; //所有体字段
var farr = []; //所有尾字段
var allData;//所有明细
//接口参数
var USER_URL = {
    BARCODE: 'backstage/findsPrintTemplate', //(查询模板)isExistence  0不存在 1存在
    ALLWORD: 'operations/findTemplateSettingDetail' //(查询所有字段)
};


//查询模板
function comgetContent(type) {
    harr = []; //所有头字段
    barr = []; //所有体字段
    farr = [];
    var param = {
        "merchantId": merchantId,
        "templateSetId": templateSetId,
        "templateType": type,
        "templateSetName": templateSetName
    }
    reqAjaxAsync(USER_URL.BARCODE, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
            $(".content-list").attr("data-isExistence", res.data.isExistence);
            if (res.data.isExistence == 1) {//设置过
                $(".content-list").attr("data-fieldRecord", res.data.fieldRecordArray);
                if (res.data.templateType == "A4") {
                    $(".content-list").find(".hr").css("width", "595px");
                    $(".template-nav .nav-list").eq(0).addClass("acv").siblings().removeClass("acv");
                    $(".content-list .artic-list").eq(0).show().siblings().hide();
                    $(".content-list").find(".hr").show();
                    $(".content-list .artic-list").eq(0).html(res.data.content);
                } else if (res.data.templateType == "RM58") {
                    $(".content-list").find(".hr").css("width", "219px");
                    $(".template-nav .nav-list").eq(2).addClass("acv").siblings().removeClass("acv");
                    $(".content-list .artic-list").eq(2).show().siblings().hide();
                    $(".content-list").find(".hr").show();
                    $(".content-list .artic-list").eq(2).html(res.data.content);
                } else if (res.data.templateType == "RM80") {
                    $(".content-list").find(".hr").css("width", "320px");
                    $(".template-nav .nav-list").eq(1).addClass("acv").siblings().removeClass("acv");
                    $(".content-list .artic-list").eq(1).show().siblings().hide();
                    $(".content-list").find(".hr").show();
                    $(".content-list .artic-list").eq(1).html(res.data.content);
                }
                getHeight(1, res.data.templateType)
                getHeight(2, res.data.templateType)
            } else { //未设置过
                $(".content-list").attr("data-fieldRecord", "");
                if (res.data.templateType == "A4") {
                    $(".content-list").find(".hr").css("width", "595px");
                    $(".template-nav .nav-list").eq(0).addClass("acv").siblings().removeClass("acv");
                    $(".content-list .artic-list").eq(0).show().siblings().hide();
                    $(".content-list").find(".hr").show();
                } else if (res.data.templateType == "RM58") {
                    $(".content-list").find(".hr").css("width", "219px");
                    $(".template-nav .nav-list").eq(2).addClass("acv").siblings().removeClass("acv");
                    $(".content-list .artic-list").eq(2).show().siblings().hide();
                    $(".content-list").find(".hr").show();
                } else if (res.data.templateType == "RM80") {
                    $(".content-list").find(".hr").css("width", "320px");
                    $(".template-nav .nav-list").eq(1).addClass("acv").siblings().removeClass("acv");
                    $(".content-list .artic-list").eq(1).show().siblings().hide();
                    $(".content-list").find(".hr").show();
                }
                comgetList(type);
            }
        } else {
            layer.msg(res.msg);
        }
    })
}

//获取明细
function comgetList(type) {
    var param = {
        "templateId": templateSetId
    }
    reqAjaxAsync(USER_URL.ALLWORD, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
            allData = res.data;
            console.log(allData.length);
            if (allData.length > 0) {
                comnoSet(allData, type);
            } else {
                if (type == "A4") {
                    $(".content-list .artic-list").eq(0).html('<img src="img/noplate.png">');
                } else if (type == "RM80") {
                    $(".content-list .artic-list").eq(1).html('<img src="img/noplate.png">');
                } else {
                    $(".content-list .artic-list").eq(2).html('<img src="img/noplate.png">');
                }
            }
        } else {
            layer.msg(res.msg);
        }
    })
}


//未设置过时
function comnoSet(res, type) { //type表示a4或者58或者80
    for (var i = 0; i < allData.length; i++) {
        var row = allData[i];
        if (row.itemType == "H") {
            harr.push(row);
        } else if (row.itemType == "B") {
            barr.push(row);
        } else if (row.itemType == "F") {
            farr.push(row);
        }
    }

    if (type == "A4") {
        var a = $(".content-list .artic-list").eq(0);
        a.find(".content-title").text(templateSetName);
        if (harr.length > 0) {
            var sHtml = "";
            for (var b = 0; b < harr.length; b++) {
                sHtml += '<div class="body-list" data-id="' + harr[b].id + '">'
                    + '<div class="list-title cura" data-is="D"><span>' + harr[b].itemName + '</span>：</div>'
                    + '<div class="title-val">#' + harr[b].itemValue + '#</div>'
                    + '</div>'
            }
            a.find(".content-body").html(sHtml);
        }
        if (barr.length > 0) {
            var sHtml = "";
            sHtml += '<div class="tab-title">'
            for (var c = 0; c < barr.length; c++) {
                sHtml += '<div class="table-title cura" data-is="B" data-id="' + barr[c].id + '">' + barr[c].itemName + '</div>'
            }
            sHtml += '</div>' +
                '<div class="table-body">'
                + '<div id="tableText">'
            for (var c = 0; c < barr.length; c++) {
                sHtml += '<div class="table-val">#' + barr[c].itemValue + '#</div>'
            }
            sHtml += '</div></div>'
            a.find(".content-article").html(sHtml);
            if (barr.length > 4) {
                $(".a4 .content-article").find(".table-title").css("width", "20%");
                $(".a4 .content-article").find(".table-val").css("width", "20%");
            } else if (barr.length == 4) {
                $(".a4 .content-article").find(".table-title").css("width", "25%");
                $(".a4 .content-article").find(".table-val").css("width", "25%");
            } else if (barr.length == 3) {
                $(".a4 .content-article").find(".table-title").css("width", "33.3%");
                $(".a4 .content-article").find(".table-val").css("width", "33.3%");
            } else if (barr.length == 2) {
                $(".a4 .content-article").find(".table-title").css("width", "50%");
                $(".a4 .content-article").find(".table-val").css("width", "50%");
            } else if (barr.length == 1) {
                $(".a4 .content-article").find(".table-title").css("width", "100%");
                $(".a4 .content-article").find(".table-val").css("width", "100%");
            }
        }
        if (farr.length > 0) {
            var sHtml = "";
            for (var d = 0; d < farr.length; d++) {
                sHtml += '<div class="body-list" data-id="' + farr[d].id + '">'
                    + '<div class="list-title cura"><span>' + farr[d].itemName + ' </span>：</div>'
                    + '<div class="title-val">#' + farr[d].itemValue + '#</div>'
                    + '</div>'
            }
            a.find(".content-foot").html(sHtml);
        }
    } else if (type == "RM58") {
        var a = $(".content-list .artic-list").eq(2);
        a.find(".content-title").text(templateSetName);
        if (harr.length > 0) {
            var sHtml = "";
            for (var b = 0; b < harr.length; b++) {
                sHtml += '<div class="top-list" data-id="' + harr[b].id + '">'
                    + '<div class="list-title cura" data-tp="1" data-is="D"><span>' + harr[b].itemName + '</span>：</div>'
                    + '<div class="title-val">#' + harr[b].itemValue + '#</div>'
                    + '</div>'
            }
            a.find(".content-top").html(sHtml);
        }
        if (barr.length > 0) {
            var sHtml = "";
            sHtml += '<div class="tab-title">'
            for (var c = 0; c < barr.length; c++) {
                sHtml += '<div class="table-title cura" data-is="B" data-id="' + barr[c].id + '">' + barr[c].itemName + '</div>'
            }
            sHtml += '</div>' +
                '<div class="table-body">'
                + '<div id="tableText">'
            for (var c = 0; c < barr.length; c++) {
                sHtml += '<div class="table-val">#' + barr[c].itemValue + '#</div>'
            }
            sHtml += '</div></div>'
            a.find(".content-body").html(sHtml);
            if (barr.length > 3) {
                $(".five-size .content-body").find(".table-title").css("width", "20%");
                $(".five-size .content-body").find(".table-val").css("width", "20%");
                $(".five-size .content-body").find(".table-title").eq(0).css("width", "40%");
                $(".five-size .content-body").find(".table-val").eq(0).css("width", "40%");
            } else if (barr.length == 3) {
                $(".five-size .content-body").find(".table-title").css("width", "20%");
                $(".five-size .content-body").find(".table-val").css("width", "20%");
                $(".five-size .content-body").find(".table-title").eq(0).css("width", "40%");
                $(".five-size .content-body").find(".table-val").eq(0).css("width", "40%");
            } else if (barr.length == 2) {
                $(".five-size .content-body").find(".table-title").css("width", "50%");
                $(".five-size .content-body").find(".table-val").css("width", "50%");
            } else if (barr.length == 1) {
                $(".five-size .content-body").find(".table-title").css("width", "100%");
                $(".five-size .content-body").find(".table-val").css("width", "100%");
            }
        }
        if (farr.length > 0) {
            var sHtml = "";
            for (var d = 0; d < farr.length; d++) {
                sHtml += '<div class="footer-list" data-id="' + farr[d].id + '">'
                    + '<div class="list-title cura"><span>' + farr[d].itemName + '</span>：</div>'
                    + '<div class="title-val">#' + farr[d].itemValue + '#</div>'
                    + '</div>'
            }
            a.find(".content-footer").html(sHtml);
        }
    } else if (type == "RM80") {
        var a = $(".content-list .artic-list").eq(1);
        a.find(".content-title").text(templateSetName);
        if (harr.length > 0) {
            var sHtml = "";
            for (var b = 0; b < harr.length; b++) {
                sHtml += '<div class="top-list" data-id="' + harr[b].id + '">'
                    + '<div class="list-title cura" data-tp="1" data-is="D"><span>' + harr[b].itemName + '</span>：</div>'
                    + '<div class="title-val">#' + harr[b].itemValue + '#</div>'
                    + '</div>'
            }
            a.find(".content-top").html(sHtml);
        }
        if (barr.length > 0) {
            var sHtml = "";
            sHtml += '<div class="tab-title">'
            for (var c = 0; c < barr.length; c++) {
                sHtml += '<div class="table-title cura" data-is="B" data-id="' + barr[c].id + '">' + barr[c].itemName + '</div>'
            }
            sHtml += '</div>' +
                '<div class="table-body">'
                + '<div id="tableText">'
            for (var c = 0; c < barr.length; c++) {
                sHtml += '<div class="table-val">#' + barr[c].itemValue + '#</div>'
            }
            sHtml += '</div></div>'
            a.find(".content-body").html(sHtml);
            if (barr.length > 3) {
                $(".eight-size .content-body").find(".table-title").css("width", "20%");
                $(".eight-size .content-body").find(".table-val").css("width", "20%");
                $(".eight-size .content-body").find(".table-title").eq(0).css("width", "40%");
                $(".eight-size .content-body").find(".table-val").eq(0).css("width", "40%");
            } else if (barr.length == 3) {
                $(".eight-size .content-body").find(".table-title").css("width", "20%");
                $(".eight-size .content-body").find(".table-val").css("width", "20%");
                $(".eight-size .content-body").find(".table-title").eq(0).css("width", "40%");
                $(".eight-size .content-body").find(".table-val").eq(0).css("width", "40%");
            } else if (barr.length == 2) {
                $(".eight-size .content-body").find(".table-title").css("width", "50%");
                $(".eight-size .content-body").find(".table-val").css("width", "50%");
            } else if (barr.length == 1) {
                $(".eight-size .content-body").find(".table-title").css("width", "100%");
                $(".eight-size .content-body").find(".table-val").css("width", "100%");
            }
        }
        if (farr.length > 0) {
            var sHtml = "";
            for (var d = 0; d < farr.length; d++) {
                sHtml += '<div class="footer-list" data-id="' + farr[d].id + '">'
                    + '<div class="footer-title cura"><span>' + farr[d].itemName + '</span>：</div>'
                    + '<div class="footer-val">#' + farr[d].itemValue + '#</div>'
                    + '</div>'
            }
            a.find(".content-footer").html(sHtml);
        }
    }
    getHeight(1, type);
    getHeight(2, type)
}

//切换
$(".template-nav").on("click", ".nav-list", function () {
    var type = $(this).attr("data-type");
    comgetContent(type);
    $(".change-btn").hide();
    $("#changeName").val("");
    $("#fontSize").val("");
    $("#fontFamily").val("");
});

//获取所有高度，取最高的
function getHeight(type, ty) {
    if (type == 1) { //标题

        if (ty == "A4") {
            var list = $(".content-list .artic-list").eq(0).find(".tab-title").find(".table-title");
            var heightArr = [];
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    heightArr.push(list.eq(i).height());
                }
                $(".content-list .artic-list").eq(0).find(".tab-title").find(".table-title").height(heightArr[0]);
            }
        } else if (ty == "RM80") {
            var list = $(".content-list .artic-list").eq(1).find(".tab-title").find(".table-title");
            var heightArr = [];
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    heightArr.push(list.eq(i).height());
                }
                $(".content-list .artic-list").eq(1).find(".tab-title").find(".table-title").height(heightArr[0]);
            }
        } else {
            var list = $(".content-list .artic-list").eq(2).find(".tab-title").find(".table-title");
            var heightArr = [];
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    heightArr.push(list.eq(i).height());
                }
                $(".content-list .artic-list").eq(2).find(".tab-title").find(".table-title").height(heightArr[0]);
            }
        }

    } else { //内容
        if (ty == "A4") {
            var list = $(".content-list .artic-list").eq(0).find("#tableText").find(".table-val");
            var heightArr = [];
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    heightArr.push(list.eq(i).height());
                }
                heightArr.sort(soreHeight);
                $(".content-list .artic-list").eq(0).find("#tableText").find(".table-val").height('auto');


            }
        } else if (ty == "RM80") {
            var list = $(".content-list .artic-list").eq(1).find("#tableText").find(".table-val");
            var heightArr = [];
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    heightArr.push(list.eq(i).height());
                }
                heightArr.sort(soreHeight);
                $(".content-list .artic-list").eq(1).find("#tableText").find(".table-val").height('auto');
            }
        } else {
            var list = $(".content-list .artic-list").eq(2).find("#tableText").find(".table-val");
            var heightArr = [];
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    heightArr.push(list.eq(i).height());
                }
                heightArr.sort(soreHeight);
                $(".content-list .artic-list").eq(2).find("#tableText").find(".table-val").height('auto');
            }
        }


    }
}

//排序
function soreHeight(a, b) {
    return b - a;
}

