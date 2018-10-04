var params;
$(document).ready(function () {
    params = getParams();
    $('#remark').val(unescape(params.remarks));
});

//监听购买输入
$('#remark').bind('input propertychange change', function () {
    var remark = $('#remark').val().trim();
    if (remark.length > 15) {
        remark = remark.substring(0, 15);
        $('#remark').val(remark);
        layer.msg("请输入不超过15个字的备注!");
        return false;
    }
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
    var remark = $('#remark').val().trim();
    var returnDate = {
        remarks: remark
    };
    return returnDate;
}