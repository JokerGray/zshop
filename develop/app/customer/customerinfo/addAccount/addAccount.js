var zNodes = [];
var params;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    params = getParams();
    getSelect();
    getInfo()
});
var startdate = getSec(new Date(),5);
laydate.render({//渲染开始时间选择
    elem: `#startDate`,//通过id绑定html中插入的start  
    btns: ['clear', 'confirm'],
    value: startdate
});
var accountList = [];
function getInfo() {
    var cmd = "customer/getSubaccountDetail";
    var datas = {
        merchantId: params.merchantId,
        memberId: params.memberId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data) {
                if (re.data.accountsList) {
                    accountList = re.data.accountsList;
                    refreshAccount()
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
//第二个页面提交
$('#submit2').click(function () {
    var isFans = $('#accountType').attr('data-isFans');
    if (isFans == 'true'){
        var finance = $('#finance').val();
        if ($('#renewPerYear').is(':checked')){
            var renewPerYear = 1;
        }else{
            var renewPerYear = 0;
        }
    }else{
        var finance = '';
        var renewPerYear = '';
    }
    var createTime = $('#startDate').val();
    if (createTime.length <= 0){
        layer.msg('请选择办卡日期！');
        return false;
    }
    var interest = $('#interest').val();
    var principal = $('#principal').val();
    var cmd = "customer/addSubaccounts";
    var datas = {
        merchantId: params.merchantId,
        operatorId: params.userId,
        memberId: accountList[0].memberId,
        shopId: accountList[0].shopId,
        principal: principal,
        interest: interest,
        finance: finance,
        renewPerYear: renewPerYear,
        businessId: $('#accountType').val(),
        businessName: $('#accountType').find("option:selected").text(),
        createTime: createTime
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data) {
                layer.msg(re.msg);
                accountList = re.data;
                refreshAccount()
                clear();
            }
        } else {
            layer.msg(re.msg);
        }
    })
})

function refreshAccount() {
    var row = '';
    for (var i = 0; i < accountList.length; i++) {
        row +=`<div class="row row-user1">
                <div class="col-xs-2">
                    <span class="title-name">账户类型：</span>
                    <span class="step2-title accountName">${accountList[i].accountName}</span>
                </div>
                <div class="col-xs-2">
                    <span class="title-name">实际金额：</span>
                    <span class="step2-title realMoney">${accountList[i].principal}</span>
                </div>
                <div class="col-xs-2">
                    <span class="title-name">赠送金额：</span>
                    <span class="step2-title sendMoney">${accountList[i].interest}</span>
                </div>
                <div class="col-xs-2">
                    <span class="title-name">店铺：</span>
                    <span class="step2-title shopName">${accountList[i].shopName}</span>
                </div>
            </div>`;
    }
    $('#accountList').html(row);
}
function clear() {
    $('#accountType').val('0');
    $('#startDate').val(startdate);
    $('#principal').val(0);
    $('#interest').val(0);
    $('#finance').val(0);
}

//监听账户类型
$('#accountType').on('change', function () {
    var businessType = $(this).find("option:selected").attr('data-businessType');
    var businessId = $(this).val();
    if (businessType == 1) {
        $(".fansRow").css('display', 'block');
        $(this).attr('data-isFans', 'true');
        $('#finance').val(0);
    } else {
        $(".fansRow").css('display', 'none');
        $(this).attr('data-isFans', 'false');
    }
    if (businessId == 0) {
        $(`#serviceDetail`).val('普通会员  无权益');
    }else{
        for (var i = 0; i < businesses.length; i++) {
            if (businesses[i].id == businessId) {
                if (businesses[i].accountType == 1) {
                    var giveInfo = "赠送本金"
                } else {
                    var giveInfo = "赠送卡项金"
                }
                $(`#serviceDetail`).val(businesses[i].businessName + '  消费折扣:' + businesses[i].discount + '%  ' + giveInfo);
            }
        }
    }
});
//监听活动经费输入框
$('#finance').on('input propertychange change', function () {
    var finance = $(this).val();
    if (finance.length <= 0) {
        $(this).val(0.00);
    }
});

//禁止输入框输入非数字和小于0的数，用法在input输入框加属性onkeyup="isnum(this)" onafterpaste="delunum(this)"即可
function isnum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
    // if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
    //     obj.value = parseFloat(obj.value);
    // }
    if (obj.value.indexOf(".") !== -1) {
        var arr = obj.value.split(".");
        var intNum = arr[0];
        if (intNum.length > 7) {
            layer.msg('整数位数不能超过7位！');
            $(obj).val(intNum.substring(0, 7) + '.' + arr[1]);
        } else if (intNum.length == 0) {
            layer.msg('请先输入整数部分！');
            $(obj).val('');
        }
    } else if (obj.value.length > 7) {
        layer.msg('整数位数不能超过7位！');
        $(obj).val(obj.value.substring(0, 7));
    }
}
function delunum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
    if (obj.value.indexOf(".") !== -1) {
        var arr = obj.value.split(".");
        var intNum = arr[0];
        if (intNum.length > 7) {
            layer.msg('整数位数不能超过7位！');
            $(obj).val(intNum.substring(0, 7) + '.' + arr[1]);
        } else if (intNum.length == 0) {
            layer.msg('请先输入整数部分！');
            $(obj).val('');
        }
    } else if (obj.value.length > 7) {
        layer.msg('整数位数不能超过7位！');
        $(obj).val(obj.value.substring(0, 7));
    }
}
/************* 初始化 ******************/
//加载下拉框
var businessesList = '';
var businesses = [];
function getSelect(data, index) {
    var cmd = "customer/getBusinessInfo";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data.businesses) {
                businesses = re.data.businesses;
                businessesList = '<option value="0">普通会员</option>';
                for (var i = 0; i < businesses.length; i++) {
                    businessesList += `<option data-businessType="${businesses[i].businessType}" value="${businesses[i].id}">${businesses[i].businessName}</option>`;
                }
                $('#accountType').append(businessesList);
                $('#accountType').attr('data-isFans','false');
                $(`#serviceDetail`).val('普通会员  无权益');
                $('.fansRow').css('display','none');
            }
        } else {
            layer.msg(re.msg);
        }
    })
};

// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    var loading1 = '';
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
            loading1 = layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.close(loading1);
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
//获取对应时间的年月日时分秒,index对应说明: 1=>年月日时分秒 2=>月份 3=>日期 4=>星期 5=>年月日 6=>时分 7=>时分秒 8=>年 9=>年月日拼接完整格式
function getSec(val, index) {
    var _date = new Date(val);
    var nowYear = _date.getFullYear();
    var nowMonth = _date.getMonth() + 1;
    var nowDate = _date.getDate();
    var nowHours = _date.getHours();
    var nowMinutes = _date.getMinutes();
    var nowSeconds = _date.getSeconds();
    var nowDay = _date.getDay();
    if (nowMonth < 10) {
        nowMonth = '0' + nowMonth;
    }
    if (nowDate < 10) {
        nowDate = '0' + nowDate;
    }
    if (nowHours < 10) {
        nowHours = '0' + nowHours;
    }
    if (nowMinutes < 10) {
        nowMinutes = '0' + nowMinutes;
    }
    if (nowSeconds < 10) {
        nowSeconds = '0' + nowSeconds;
    }
    if (index == 1) {
        return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
    } else if (index == 2) {
        return nowMonth;
    } else if (index == 3) {
        return nowDate;
    } else if (index == 4) {
        return nowDay;
    } else if (index == 5) {
        return nowYear + '-' + nowMonth + '-' + nowDate;
    } else if (index == 6) {
        return nowHours + ':' + nowMinutes;
    } else if (index == 7) {
        return nowHours + ':' + nowMinutes + ':' + nowSeconds;
    } else if (index == 8) {
        return nowYear;
    } else if (index == 9) {
        return nowYear + '-' + nowMonth + '-' + nowDate + ' 00:00:00';
    }
    return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
}