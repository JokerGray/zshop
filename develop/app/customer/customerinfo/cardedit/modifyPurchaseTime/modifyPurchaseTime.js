var params;
$(document).ready(function () {
    params = getParams();
    $('#startDate').val(params.purchaseTime);
    $('#endDate').text(unescape(params.remainNum));
});

laydate.render({
    elem: '#startDate', //指定元素
    type: 'datetime'
});

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
//返回值
var callbackdata = function () {
    var purchaseTime = $('#startDate').val();
    var returnDate = {
        purchaseTime: purchaseTime
    };
    return returnDate;
}