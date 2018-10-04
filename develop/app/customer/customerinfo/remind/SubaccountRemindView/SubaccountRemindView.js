var zNodes = [];
var params;
var loading;
var indexFrame = '';
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    params = getParams();
    selectInit();
    //获取当前弹窗的index
    indexFrame = parent.layer.getFrameIndex(window.name);  
    console.log(indexFrame)
});
//星期选择
$('.weekList ul li').on('click', function () {
    $(this).find('.selectIcon').toggleClass('active')
});
//服务人员选择
//$('.waiterList ul li').on('click',function () {
$(".waiterList").delegate("ul li", "click", function () {
    $(this).find('.selectIcon').toggleClass('active')
})

$("#shopId").change(function () {
    initBackuserList();
});
function selectInit() {
    var cmd = "customer/getShopInfoByMerId";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data) {
                var shopList = re.data;
                for (let i = 0; i < shopList.length; i++) {
                    var optBox = `
                        <option class="" value="${shopList[i].shopId}">${shopList[i].shopName}</option>
                    `;
                    $('#shopId').append(optBox);
                }
                if (params.remindId !== undefined) {
                    geteditInfo(params.remindId);
                } else {
                    //初始化员工列表
                    initBackuserList();
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
//获取编辑信息
function geteditInfo(remindId) {
    var cmd = "customer/getRemindList";
    var datas = {
        merchantId: params.merchantId,
        memberId: params.memberId,
        remindId: remindId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data[0];
            //初始化服务人员
            $("#shopId").val(data.shopId);         
            initBackuserList(data.remindBackuserList);
            //初始化星期
            var remindDayList = data.remindDayList;
            var domList = $('.weekList').find('ul li');
            domList.each(function (i, v) {
                for (var i = 0; i < remindDayList.length; i++) {
                    if (remindDayList[i].day == $(v).attr('data-week')) {
                        $(v).find('.selectIcon').addClass('active')
                    }
                }
            });
            //初始化时间备注
            if (data.remindTime){
                $('#remindTime').val(data.remindTime);
            }
            if(data.remake){
                $('#remake').val(data.remake);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
//获取星期和服务人员
function getWeekList() {
    var domList = $('.weekList').find('ul li');
    var arr = [];
    domList.each(function (i, v) {
        if ($(v).find('.selectIcon').hasClass('active')) {
            arr.push($(v).attr('data-week') + "-" + $(v).attr('data-name'))
        }
    });
    return arr
}
function getWaiterList() {
    var domList = $('.waiterList').find('ul li');
    var arr = [];
    domList.each(function (i, v) {
        if ($(v).find('.selectIcon').hasClass('active')) {
            arr.push($(v).attr('data-waiterId') + "-" + $(v).attr('data-name'))
        }
    });
    return arr
}

function sub() {
    
    var weekList = getWeekList();
    var waiterList = getWaiterList();
    if (weekList.length <= 0) {
        layer.msg('请选择星期', { icon: 2 });
        return;
    }
    if (waiterList.length <= 0) {
        layer.msg('请选择服务人员', { icon: 2 });
        return;
    }
    var remindTime = $("#remindTime").val();
    if (remindTime == "") {
        layer.msg('请设置时间', { icon: 2 });
        return;
    }
    var dayListStr = "";
    var backuserListStr = "";
    for (var i = 0; i < weekList.length; i++) {
        if (i == 0) {
            dayListStr += weekList[i];
        } else {
            dayListStr += ";" + weekList[i];
        }
    }
    for (var j = 0; j < waiterList.length; j++) {
        if (j == 0) {
            backuserListStr += waiterList[j];
        } else {
            backuserListStr += ";" + waiterList[j];
        }
    }
    $("#dayListStr").val(dayListStr);
    $("#backuserListStr").val(backuserListStr);
    var shopId = $("#shopId").val();
    if (params.remindId !== undefined) {
        var cmd = "customer/editSubaccountRemind";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: params.memberId,
            shopId: shopId,
            dayListStr: dayListStr,
            backuserListStr: backuserListStr,
            remake: $('#remake').val().trim(),
            remindTime: remindTime,
            remindId: params.remindId
        };
    } else {
        var cmd = "customer/addRemindList";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: params.memberId,
            shopId: shopId,
            dayListStr: dayListStr,
            backuserListStr: backuserListStr,
            remake: $('#remake').val().trim(),
            remindTime: remindTime
        };
    }
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            //弹出成功提示框
            layer.alert(re.msg, { icon: 1 });
            //关闭增加框
            parent.refreshTable();
            parent.layer.close(indexFrame);
        } else {
            layer.msg(re.msg);
        }
    })
}

function initBackuserList(remindBackuserList) {
    $("#backUserList").html("");
    var shopId = $("#shopId").val(); 
    var cmd = "customer/salesmanList";
    var datas = {
        merchantId: params.merchantId,
        shopId: shopId
    };
    ajaxAsync(cmd, datas, function (re) {
        layer.close(loading);
        if (re.code == 1) {
            var htmlStr = '';          
            if (re.data) {
                var data = re.data;
                if (data.length > 0) {
                    if (remindBackuserList !== undefined) {
                        for (var i = 0; i < data.length; i++) {
                            var active = 0;
                            for (var j = 0; j < remindBackuserList.length; j++) {
                                if (remindBackuserList[j].backuserId == data[i].id) {
                                    active = 1;
                                }
                            }
                            if (active == 1) {
                                htmlStr += '<li data-waiterId="' + data[i].id + '" data-name="' + data[i].backUserName + '"><span class="selectIcon active"></span><span>' + data[i].backUserName + '</span></li>';
                            } else {
                                htmlStr += '<li data-waiterId="' + data[i].id + '" data-name="' + data[i].backUserName + '"><span class="selectIcon"></span><span>' + data[i].backUserName + '</span></li>';
                            }
                        }
                    }else{
                        for (var i = 0; i < data.length; i++) {
                            htmlStr += '<li data-waiterId="' + data[i].id + '" data-name="' + data[i].backUserName + '"><span class="selectIcon"></span><span>' + data[i].backUserName + '</span></li>';
                        }   
                    }
                    $("#backUserList").html(htmlStr);
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
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