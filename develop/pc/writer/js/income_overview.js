var apikey = localStorage.getItem('apikey') || "";
var version = localStorage.getItem('version') || "1";
var userId = localStorage.getItem('userId') || '';
var selected1, selected2, selectedMoney;
var layer = layui.layer;
var money;
var start = {
    getData: function() {
        $.ajax({
            type: 'POST',
            url: '/zxcity_restful/ws/rest',
            data: {
                cmd: "cms_new/pushSelect",
                version: version,
                "data": '{"userId": ' + userId + '}'
            },
            beforeSend: function(request) {
                // layer.load(0, { shade: [0.1, '#fff'] });
                request.setRequestHeader("apikey", apikey);
            },
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    layer.msg(data.msg);
                    var data = data.data;
                    selected1 = data.pushRevenue;
                    selected2 = data.pushAdvertising;
                    selectedMoney = data.pushRevenuemoney;
                    $($('#incomeCheck1 .inputRadio')[selected1]).addClass('active');
                    $($('#incomeCheck2 .inputRadio')[selected2]).addClass('active');
                    $('#amountTxt').val(selectedMoney);
                } else {
                    layer.msg(data.msg);
                }
            },
            error: function() {
                // console.log('ajax-error');
            }
        });
    },
    pushData: function(pushAdvertising, pushRevenuemoney, pushRevenue) {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: '/zxcity_restful/ws/rest',
            data: {
                cmd: "cms_new/pushAdvertisingCollection",
                version: version,
                "data": '{"userId": ' + userId + ', pushAdvertising:' + pushAdvertising + ', pushRevenuemoney:' + pushRevenuemoney + ', pushRevenue:' + pushRevenue + '}'
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(data) {
                layer.msg(data.msg);
            },
            error: function() {
                layer.msg(data.msg);
            }
        });
    }
}

$(function() {
    start.getData();
    $('#amountSec').click(function() {
        var optVal = $('#amountSec').val();
        $('#amountTxt').val(optVal);
        money = $('#amountTxt').val();
    })

    $('#amountTxt').on("change", function() {
        console.log($('#amountTxt').val());
        money = $('#amountTxt').val();
    });


    $('#moneyEnter').click(function() {
        if ($('.inputRadio2').hasClass('active')) {
            start.pushData(selected2, $('#amountTxt').val(), selected1);
        } else {
            layer.msg('推送按钮打开才能修改');
        }
    });

    $('.incomeCheck .inputRadio').click(function() {
        if (!$(this).hasClass('active')) {
            $(this).parent().find('.inputRadio').removeClass('active');
            $(this).addClass('active');
            //不推送：
            if ($(this).index() == 0 && $(this).hasClass('inputRadio1')) {
                selected1 = 0
            }
            //推送：
            if ($(this).index() == 2 && $(this).hasClass('inputRadio2')) {
                selected1 = 1
                if (money != undefined && money != null && money != 'null') {
                    selectedMoney = money;
                }
            }
            //不投放：
            if ($(this).index() == 0 && $(this).hasClass('inputRadio3')) {
                selected2 = 0
            }
            //投放：
            if ($(this).index() == 2 && $(this).hasClass('inputRadio4')) {
                selected2 = 1
            }
            start.pushData(selected2, selectedMoney, selected1);
        }
    })

})