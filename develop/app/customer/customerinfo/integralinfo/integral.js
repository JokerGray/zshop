$(document).ready(function () {
    // loading = layer.load(1, {
    //     shade: [0.1, '#fff'] //0.1透明度的白色背景
    // });
    params = getParams();
    $("#txtUserName").text(unescape(params.memberName));
    getInfo();
});

var _element = '';
//获取信息
function getInfo() {
    var cmd = "credits/getUserCreditsInfo";
    var datas = {
        merchantId: params.merchantId,
        userId: params.userId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.user == null && data.levels.length == 0 && data.growLog.length == 0 && data.consumeLog.length == 0){
                parent.layer.msg('暂无数据!');
                return false;
            }
            if (data.user){
                getUser(data.user);
            }
            if (data.levels){
                getGrade(data.levels);
            }
            if (data.growLog){
                getCredits(data.growLog);
            }
            if (data.consumeLog){
                getConsume(data.consumeLog);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
layui.use('element', function () {
    _element = layui.element;
});
function getUser(data) {
    $('#levelImg').attr('src', 'img/' + getLevelImg(data.levelNumber));
    if (data.usablePoint){
        $("#txtCredits").text(data.usablePoint);
    }else{
        $("#txtCredits").text('0');
    }
    if (data.currentLevel){
        $("#textcurrentLevel").text(data.currentLevel);
    }else{
        $("#textcurrentLevel").text('-');
    }
    if (data.upgradePoint){
        $("#txtNextLevelPoint").text(data.upgradePoint);
    }else{
        //$("#txtNextLevelPoint").text('-');
        $("#notTop .no-points").removeClass("layui-hide").siblings().addClass("layui-hide");
    }
    if (data.upgradePoint !== -1){
        $('#arriveTop').hide();
        $('#notTop').show();
        if (data.pointValue || data.upgradePoint){
            var percent = data.pointValue / (data.pointValue + data.upgradePoint) * 100;
            _element.progress('demo', percent + '%')
        }
        if (data.nextLevel) {
            $("#txtNextLevel").text(data.nextLevel);
        } else {
            $("#txtNextLevel").text('-');
        }
    }else{
        $('#arriveTop').show();
        $('#notTop').hide();
        _element.progress('demo', '100%')
    }
    
}
function getGrade(data) {
    $(".grade-list").empty();
    if(data.length>0){
        data.forEach(function (item, index) {
            let node = '<li class="clearfix">'
                + '<div class="grade-img">'
                + '<img src="img/' + getLevelImg(item.levelNumber) + '"/>'
                + ' </div>'
                + ' <div class="grade-text">'
                + ' <span>' + item.levelName + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + item.pointValue + ' 积分</span>'
                + '</div>'
                + ' <div class="grade-text">'
                + ' <span>' + item.percent + '%的人在此等级</span>'
                + '</div>'
                + '</li>'

            $(".grade-list").append(node);
        });
    }else{
        $(".grade-list").append(`<img src="../img/no_data.png" style="width: 100px;margin-left: 43%;margin-top: 16%;">`);
    }
    
}
function getCredits(data) {
    $("#creditsTable").empty();
    if (data.length > 0) {
        data.forEach(function (item, index) {
            let node = '<tr>'
                + '<td>'
                + '<span class="table-title">' + item.remarks + '</span>'
                + '<span class="table-time">' + item.logTime + '</span>'
                + '</td>'
                + '<td>'
                + '<span class="table-price"></span>'
                + '</td>'
                + '<td align="right">'
                + '<span class="table-integral1">'
                + '+' + item.pointValue + '积分'
                + '</span>'
                + '<span class="table-integral2">'
                + ''
                + '</span>'
                + '</td>'
                + '</tr>';
            $("#creditsTable").append(node);
        });
    } else {
        $("#creditsTable").append(`<img src="../img/no_data.png" style="width: 100px;margin-left: 43%;">`);
    }
    
}
function getConsume(data) {
    $("#consumeTable").empty();
    if(data.length > 0){
        data.forEach(function (item, index) {
            let node = '<tr>'
                + '<td>'
                + '<span class="table-title">' + item.remarks + '</span>'
                + '<span class="table-time">' + item.logTime + '</span>'
                + '</td>'
                + '<td>'
                + '<span class="table-price"></span>'
                + '</td>'
                + '<td align="right">'
                + '<span class="table-integral1">'
                + ''
                + '</span>'
                + '<span class="table-integral2">'
                + '' + item.pointValue + '积分'
                + '</span>'
                + '</td>'
                + '</tr>';

            $("#consumeTable").append(node);

        });
    }else{
        $("#consumeTable").append(`<img src="../img/no_data.png" style="width: 100px;margin-left: 43%;">`);
    }
    
}
function getLevelImg(data) {
    var imgName = '';
    switch (data) {
        case 1:
            imgName = 'LV1.png';
            break;
        case 2:
            imgName = 'LV2.png';
            break;
        case 3:
            imgName = 'LV3.png';
            break;
        case 4:
            imgName = 'LV4.png';
            break;
        case 5:
            imgName = 'LV5.png';
            break;
        case 6:
            imgName = 'LV6.png';
            break;
        case 7:
            imgName = 'LV7.png';
            break;
        case 8:
            imgName = 'LV8.png';
            break;
        case 9:
            imgName = 'LV9.png';
            break;
        case 10:
            imgName = 'LV10.png';
            break;
        default:
            imgName = 'dj.png';
            break;
    }
    return imgName;
}
// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        headers: {
            apikey: 'test'
        },
        data: {
            cmd: cmd,
            data: data
        },
        beforeSend: function (request) {
            layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.closeAll();
        }
    });
}
function getParams() {
    var url = location.search;
    var param = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return param;
}