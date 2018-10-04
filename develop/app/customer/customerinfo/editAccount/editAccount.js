var zNodes = [];
var params;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    params = getParams();
    getInfo();
});
var startdate = getSec(new Date(), 1);
var periodDate = getSec(new Date(new Date().getTime() + 365*24*60*60*1000), 5);
laydate.render({//渲染开始时间选择  
    elem: `#birthday`,//通过id绑定html中插入的start  
    btns: ['clear', 'confirm'],
    done: function (value, date, endDate) {//控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
        if ($('#islunarBirthday').is(':checked')) {
            $('#islunarBirthday').attr('data-lunarBirthday', value);
        } else {
            $('#islunarBirthday').attr('data-Birthday', value);
        }
    }
});
//获取信息
var accountsList = [];
function getInfo() {
    var cmd = "customer/getSubaccountDetail";
    var datas = {
        merchantId: params.merchantId,
        memberId: params.memberId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if(re.data){
                if (re.data.memberCard){
                    getPersonInfo(re.data.memberCard)
                }
                 
                if (re.data.accountsList){
                    accountsList = re.data.accountsList;
                    getTables(accountsList)
                }
            }
            // layer.close(layer.loading);
        } else {
            layer.msg(re.msg);
        }
    })
}
//获取个人信息
function getPersonInfo(data) {
    $('#memberName').val(data.memberName);
    // $('#pointValue').val(data.credits || 0);
    $('#memberName').attr('data-personId', data.userId);
    $('#memberName').attr('data-shopId', data.shopId);
    $('#mobile').val(data.mobile);
    $('#mobile').attr('data-oldMobile',data.mobile);
    $('#islunarBirthday').attr('data-lunarBirthday', data.lunarBirthday);
    $('#islunarBirthday').attr('data-Birthday', data.birthday);
    if (data.birthday !== ''){
        $('#birthday').val(data.birthday);
    } else if (data.lunarBirthday !== ''){
        $('#birthday').val(data.lunarBirthday);
        $('#islunarBirthday').attr('checked','checked')
    }else{
        $('#birthday').val(data.birthday);
    }
}
$('#islunarBirthday').click(function () {
    var lunarBirthday = $(this).attr('data-lunarBirthday') || '';
    var birthday = $(this).attr('data-birthday') || '';
    if($(this).is(':checked')){
        $('#birthday').val(lunarBirthday);
    }else{
        $('#birthday').val(birthday);
    }
})
//获取切换的tabs
var numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
function getTables(data) {
    if (data.length > 0){
        // for (var i = 0; i < data.length; i++) {
        //     if (i == 0) {
        //         var liItem = `<li role="presentation" data-isload="loaded" data-num="${i}" class="tabtog active">
        //             <a href="#${i}" role="tab" data-toggle="tab">账户${numList[i]}</a>
        //         </li>`
        //     } else {
        //         var liItem = `<li role="presentation" data-num="${i}" class="tabtog">
        //             <a href="#${i}" role="tab" data-toggle="tab">账户${numList[i]}</a>
        //         </li>`
        //     }
        //     $('#tablist').append(liItem);
        // }
        var optBox = `<div class="swiper-slide">
                            <div class="cardBox addNew" data-num="${data.length}">
                            </div>
                        </div>`;
        for (var i = 0; i < data.length; i++) {
            if (data[i].discount == 0 || data[i].discount == 100) {
                var discount = '无折扣';
            } else {
                var discount = (data[i].discount / 10).toFixed(1) + '折';
            }
            if (i == 0) {
                optBox += `<div class="swiper-slide">
                            <div class="cardBox active" data-isload="loaded" data-num="${i}" shopId="${data[i].shopId}" subaccountId="${data[i].subaccountId}" periodTime="${data[i].accountName}">
                                <div class="cardBoxTitle">${data[i].accountName}</div>
                                <div class="cardBoxMoney">
                                    <div>本金余额
                                        <span>${Number(data[i].principal).toFixed(2)}</span>
                                    </div>
                                    <div>会员折扣
                                        <span>${discount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            } else {
                optBox += `<div class="swiper-slide">
                            <div class="cardBox" data-num="${i}" shopId="${data[i].shopId}" subaccountId="${data[i].subaccountId}" periodTime="${data[i].accountName}">
                                <div class="cardBoxTitle">${data[i].accountName}</div>
                                <div class="cardBoxMoney">
                                    <div>本金余额
                                        <span>${Number(data[i].principal).toFixed(2)}</span>
                                    </div>
                                    <div>会员折扣
                                        <span>${discount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            }
        }
        $('#account').append(optBox);
        var swiper = new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            slidesPerView: 4,
            spaceBetween: 30,
            freeMode: true,
        });
        getSelect(data[0], 0)
    }
}
// 多账号点击
$('.cardSty1e').on('click', '.cardBox', function () {
    $('.cardBox').removeClass('active');
    $(this).addClass('active');
    var num = Number($(this).attr('data-num'));
    if ($(this).attr('data-isload') !== 'loaded') {
        $(this).attr('data-isload','loaded')
        if($(this).hasClass('addNew')){
            getSelect(accountsList, num, 'new');
        }else{
            getSelect(accountsList[num], num);
        }
    }  
    $('.tab-pane').removeClass('active');
    $('.tab-pane#' + num).addClass('active');
})
// $('#tablist').on('click',' .tabtog',function () {
//     if ($(this).attr('data-isload') !== 'loaded'){
//         var num = Number($(this).attr('data-num'));
//         getSelect(accountsList[num], num)
//         $(this).attr('data-isload','loaded')
//     }
// })
//加载下拉框
var businessesList = '';
var businesses = [];
function getSelect(data,index,type) {
    var cmd = "customer/getBusinessInfo";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data.businesses) {
                businesses = re.data.businesses;
                businessesList = '<option value="0">普通会员</option>';
                if (type == 'new'){
                    for (var i = 0; i < businesses.length; i++) {
                        businessesList += `<option data-businessType="${businesses[i].businessType}" value="${businesses[i].id}">${businesses[i].businessName}</option>`;
                    }
                    refreshInfo(data, index,'new');
                }else{
                    for (var i = 0; i < businesses.length; i++) {
                        if (data.businessId == businesses[i].id) {
                            businessesList += `<option selected="selected" data-businessType="${ businesses[i].businessType}" value="${businesses[i].id}">${businesses[i].businessName}</option>`;
                        } else {
                            businessesList += `<option data-businessType="${businesses[i].businessType}" value="${businesses[i].id}">${businesses[i].businessName}</option>`;
                        }
                    }
                    refreshInfo(data,index);
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
};
function refreshInfo(data,index,type) { 
    if(type == 'new'){
        var giveInfo = '赠送卡项金';
        var content = `<div role="tabpanel" class="tab-pane active" id="${data.length}">
                    <div class="row row-user">
                        <span class="title-name col-xs-1">会员类型：</span>
                        <select data-isFans="false" class="select-body col-xs-3 account">${businessesList}</select>
                        <span class="title-name col-xs-1">赠送方式：</span>
                        <span class="col-xs-3 giveType">${giveInfo}</span>
                        <span class="title-name col-xs-1">所属店铺：</span>
                        <select class="select-body account1" name="account1" id="accountStep${index}">
                        </select>
                    </div>
                    <div class="row row-user productRow" style="display:none;">
                        <span class="col-xs-12">
                            <table id="productList${index}" class="table-hovered"></table>
                        </span>
                    </div>
                    <div class="row row-user">
                        <span class="title-name col-xs-1">剩余金额：</span>
                        <input type="text" data-subaccountId="" class="form-input col-xs-3 principal" value="0" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                        <span class="giveMoney">
                            <span class="title-name col-xs-1">赠送金额：</span>
                            <input type="text" class="form-input col-xs-3 usableInterest" value="0" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                        </span>
                        <span class="title-name col-xs-1">办理时间：</span>
                        <input type="text" class="form-input col-xs-3 createTime" id="createTime${index}">
                    </div>
                    <div class="row row-user fansRow" style="display:none">
                        <span class="title-name col-xs-1">活动经费：</span>
                        <input type="text" data-oldFinance="" class="form-input col-xs-3 newFinance" value="0" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                        <span class="title-name col-xs-1">有效时间：</span>
                        <input type="text" data-oldPeriodTime="" class="form-input col-xs-3 periodTime" id="periodTime${index}">
                    </div>
                    <div class="row row-user">
                        <span class="title-name col-xs-1">业务说明：</span>
                        <span id="textarea${index}" class="in-textarea"></span>
                    </div>
                </div>`
        $('#tabContent').find('.tab-pane.active').removeClass('active');
        $('#tabContent').append(content);
        $(`#textarea${index}`).html('普通会员 无权益 赠送卡项金');
        laydate.render({//渲染开始时间选择  
            elem: `#createTime${index}`,//通过id绑定html中插入的start  
            btns: ['clear', 'confirm'],
            value: startdate,
            type: 'datetime'
        });
        laydate.render({//渲染开始时间选择
            elem: `#periodTime${index}`,//通过id绑定html中插入的start  
            btns: ['clear', 'confirm'],
            value: periodDate
            // type: 'datetime'
        });

        var cmd = "customer/getShopInfoByMerId";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                if(re.data){
                    var data = re.data;
                    for (var i = 0; i < data.length; i++) {
                        if($('.cardBox.active').attr('shopId') == data[i].shopId){
                            var opt = `<option value="${data[i].shopId}" selected="selected">${data[i].shopName}</option>`;
                        }else{
                            // var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                            var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                        }
                       
                        $(`#accountStep${index}`).append(opt);
                    }
                }
            } else {
                layer.msg(re.msg);
            }
        })             
    }else{
        var giveInfo = '';
        if (data.accountType == 0) {
            giveInfo = "赠送卡项金"
        } else if (data.accountType == 1) {
            giveInfo = "赠送本金"
        } else if (data.accountType == 2) {
            giveInfo = "赠送商品"
        }
        if (data.businessId == 0) {
            giveInfo = "赠送卡项金"
        }
        var content = `<div role="tabpanel" class="tab-pane active" id="${index}">`;
        content += `<div class="row row-user">
                                <span class="title-name col-xs-1">会员类型：</span>`;
        if (data.businessType == 1) {
            content += `<select data-isFans="true" class="select-body col-xs-3 account">${businessesList}</select>`;
        }else{
            content += `<select data-isFans="false" class="select-body col-xs-3 account">${businessesList}</select>`;
        }
        // content += `<span class="title-name col-xs-1">账户名称：</span>
        //             <input type="text" class="form-input col-xs-3 accountName" value="${data.accountName}" maxlength="10">
        content += `<span class="title-name col-xs-1">赠送方式：</span>
                    <span class="col-xs-3 giveType">${giveInfo}</span>
                    <span class="title-name col-xs-1">所属店铺：</span>
                    <select class="select-body account1" name="account1" id="accountStep${index}">
                    </select>
                </div>`;
        if (data.accountType == 2) {
            content += `<div class="row row-user productRow">
                            <span class="col-xs-12">
                                <table id="productList${index}" class="table-hovered"></table>
                            </span>
                        </div>
                        <div class="row row-user">
                            <span class="title-name col-xs-1">剩余金额：</span>
                            <input type="text" data-subaccountId="${data.subaccountId}" class="form-input col-xs-3 principal" value="${data.principal}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                            <span class="giveMoney">
                                <span class="title-name col-xs-1">赠送金额：</span>
                                <input type="text" class="form-input col-xs-3 usableInterest" value="${data.usableInterest}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                            </span>
                            <span class="title-name col-xs-1">办理时间：</span>
                            <input type="text" class="form-input col-xs-3 createTime" id="createTime${index}" value="${data.createTime}">
                        </div>`;
        }else{
            content += `<div class="row row-user productRow" style="display:none;">
                            <span class="col-xs-12">
                                <table id="productList${index}" class="table-hovered"></table>
                            </span>
                        </div>
                        <div class="row row-user">
                            <span class="title-name col-xs-1">剩余金额：</span>
                            <input type="text" data-subaccountId="${data.subaccountId}" class="form-input col-xs-3 principal" value="${data.principal}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                            <span class="giveMoney">
                                <span class="title-name col-xs-1">赠送金额：</span>
                                <input type="text" class="form-input col-xs-3 usableInterest" value="${data.usableInterest}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                            </span>
                            <span class="title-name col-xs-1">办理时间：</span>
                            <input type="text" class="form-input col-xs-3 createTime" id="createTime${index}" value="${data.createTime}">
                        </div>`;
        }
        if (data.businessType == 1) {
            content += `<div class="row row-user fansRow">
                            <span class="title-name col-xs-1">活动经费：</span>
                            <input type="text" data-oldFinance="${data.finance}" class="form-input col-xs-3 newFinance" value="${data.finance}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                            <span class="title-name col-xs-1">有效时间：</span>
                            <input type="text" data-oldPeriodTime="${data.periodTime}" class="form-input col-xs-3 periodTime" id="periodTime${index}" value="${data.periodTime}">
                        </div>`;
        }else{
            content += `<div class="row row-user fansRow" style="display:none">
                            <span class="title-name col-xs-1">活动经费：</span>
                            <input type="text" data-oldFinance="${data.finance}" class="form-input col-xs-3 newFinance" value="${data.finance}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
                            <span class="title-name col-xs-1">有效时间：</span>
                            <input type="text" data-oldPeriodTime="" class="form-input col-xs-3 periodTime" id="periodTime${index}">
                        </div>`;
        }
        content += `<div class="row row-user">
                            <span class="title-name col-xs-1">业务说明：</span>
                            <span id="textarea${index}" class="in-textarea"></span>
                        </div>
                    </div>`
        $('#tabContent').find('.tab-pane.active').removeClass('active');
        $('#tabContent').append(content);
        if (data.businessId == 0) {
            $(`#textarea${index}`).html('普通会员 无权益 赠送卡项金');
        }else{
            $(`#textarea${index}`).html(data.accountName + '  消费折扣:' + data.discount + '%  ' + giveInfo);
        }
        if (data.accountType == 2) {
            productInit(index);
            if (data.goodsList){
                $('#productList' + index).bootstrapTable('load', data.goodsList);
            }
        }
        laydate.render({//渲染开始时间选择  
            elem: `#createTime${index}`,//通过id绑定html中插入的start  
            btns: ['clear', 'confirm'],
            type: 'datetime'
        });
        laydate.render({//渲染开始时间选择
            elem: `#periodTime${index}`,//通过id绑定html中插入的start  
            btns: ['clear', 'confirm']
            // type: 'datetime'
        });
        var cmd = "customer/getShopInfoByMerId";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                if(re.data){
                    var data = re.data;
                    for (var i = 0; i < data.length; i++) {
                        if($('.cardBox.active').attr('shopId') == data[i].shopId){
                            var opt = `<option value="${data[i].shopId}" selected="selected">${data[i].shopName}</option>`;
                        }else{
                            // var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                            var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                        }
                       
                        $(`#accountStep${index}`).append(opt);
                    }
                }
            } else {
                layer.msg(re.msg);
            }
        })                  
    }
    // console.log($('.cardBox.active').attr('shopId')+'店铺id');
             
}

// 获取店铺
// function getShops(){
//     var cmd = "customer/getShopInfoByMerId";
//     var datas = {
//         merchantId: params.merchantId,
//         userId: params.userId
//     };
//     ajaxAsync(cmd, datas, function (re) {
//         if (re.code == 1) {
//             if(re.data){
//                 var data = re.data;
//                 for (var i = 0; i < data.length; i++) {
//                     // if($('.cardBox.active').attr('shopId') == data[i].shopId){
//                     //     var opt = `<option value="${data[i].shopId}" checked="checked">${data[i].shopName}</option>`;
//                     // }else{
//                     //     var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
//                     // }
//                     var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
//                     $('#accountStep2').append(opt);
//                 }
//             }
//         } else {
//             layer.msg(re.msg);
//         }
//     })              
// }

//监听会员类型
$('#tabContent').on('change','>.tab-pane.active .account', function () {
    var businessType = $(this).find("option:selected").attr('data-businessType');
    var businessId = $(this).val();
    var index = $("#tabContent>.tab-pane.active").attr('id');
    if (businessType == 1) {
        $("#tabContent>.tab-pane.active .fansRow").css('display','block');
        $(this).attr('data-isFans','true');
        //监听活动经费输入框
        // $('.newFinance').on('input propertychange change', function () {
        //     var finance = $(this).val();
        //     if (finance.length <= 0) {
        //         $(this).val(0.00);
        //     }
        // });
        laydate.render({//渲染开始时间选择
            elem: `#tabContent>.tab-pane.active .periodTime`,//通过id绑定html中插入的start  
            btns: ['clear', 'confirm'],
            // type: 'datetime'
        });
    }else{
        $("#tabContent>.tab-pane.active .fansRow").css('display', 'none');
        $(this).attr('data-isFans', 'false');
    }
    if (businessId == 0) {
        $(`#tabContent>.tab-pane.active .in-textarea`).html('普通会员  无权益 赠送卡项金');
        $(`#tabContent>.tab-pane.active .giveType`).text("赠送卡项金");
        $(`#tabContent>.tab-pane.active .productRow`).css('display','none');
        $(`#tabContent>.tab-pane.active .giveMoney`).css('display','block');
    } else {
        for (var i = 0; i < businesses.length; i++) {
            if (businesses[i].id == businessId) {
                var giveInfo = '';
                if (businesses[i].accountType == 0) {
                    giveInfo = "赠送卡项金"
                    $(`#tabContent>.tab-pane.active .productRow`).css('display','none');
                    $(`#tabContent>.tab-pane.active .giveMoney`).css('display','block');
                } else if (businesses[i].accountType == 1){
                    giveInfo = "赠送本金"
                    $(`#tabContent>.tab-pane.active .productRow`).css('display', 'none');
                    $(`#tabContent>.tab-pane.active .giveMoney`).css('display', 'block');
                } else if (businesses[i].accountType == 2){
                    giveInfo = "赠送商品";
                    $(`#tabContent>.tab-pane.active .productRow`).css('display', 'block');
                    $(`#tabContent>.tab-pane.active .giveMoney`).css('display', 'none');
                    productInit(index);
                    if (businesses[i].goodsList) {
                        $('#productList' + index).bootstrapTable('load', businesses[i].goodsList);
                    }
                }
                $(`#tabContent>.tab-pane.active .giveType`).text(giveInfo);
                $(`#tabContent>.tab-pane.active .in-textarea`).html(businesses[i].businessName + '  消费折扣:' + businesses[i].discount + '%  ' + giveInfo);
            }
        }
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
        if (intNum.length > 7){
            layer.msg('整数位数不能超过7位！');
            $(obj).val(intNum.substring(0, 7) + '.' + arr[1]);
        } else if (intNum.length == 0){
            layer.msg('请先输入整数部分！');
            $(obj).val('');
        }
    } else if (obj.value.length > 7){
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
function validateNumber(self) {
    if (self.value.length == 1) {
        self.value = self.value.replace(/[^1-9]/g, '');
    }
    else {
        self.value = self.value.replace(/\D/g, '');
    }
}
/************* 初始化 ******************/
function productInit(index) {
    $('#productList' + index).bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'goodsName', title: '商品名称', align: 'center'
        },
        {
            field: 'goodsPrice', title: '商品单价', align: 'center'
        },
        {
            field: 'goodsNum', title: '数量', align: 'center'
        }]
    });
    $('#productList' + index).bootstrapTable('hideLoading');
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
//返回值
var callbackdata = function () {
    // var accountName = $("#tabContent>.tab-pane.active .accountName").val().trim();
    // if (accountName.length == 0) {
    //     layer.msg('请输入账户名称！');
    //     return false;
    // }
    var businessId = $("#tabContent>.tab-pane.active .account").val();
    var businessName = $("#tabContent>.tab-pane.active .account").find("option:selected").text();
    var businessType = $("#tabContent>.tab-pane.active .account").find("option:selected").attr('data-businessType');
    if ($('#islunarBirthday').is(':checked')){
        var isLun = 1;
    }else{
        var isLun = 0;
    }
    var oldMobile = $('#mobile').attr('data-oldMobile');;
    var phone = $("#mobile").val().trim();
    if ($("#tabContent>.tab-pane.active .account").attr('data-isFans') == 'true'){
        var newPeriodTime = $("#tabContent>.tab-pane.active .periodTime").val();
        var oldPeriodTime = $("#tabContent>.tab-pane.active .periodTime").attr('data-oldPeriodTime');
        var newFinance = $("#tabContent>.tab-pane.active .newFinance").val().trim();
        var oldFinance = $("#tabContent>.tab-pane.active .newFinance").attr('data-oldFinance');
        // if (newPeriodTime.length == 0){
        //     layer.msg('请填写有效时间！');
        //     return false;
        // }
        // if (newFinance.length > 0 && Number(newFinance) < 0){
        //     layer.msg('请填写有效活动经费！');
        //     return false;
        // }
    }else{
        var newPeriodTime = '';
        var oldPeriodTime = '';
        var newFinance = '';
        var oldFinance = '';
    }
    var usableInterest = $("#tabContent>.tab-pane.active .usableInterest").val().trim() || 0;
    var principal = $("#tabContent>.tab-pane.active .principal").val().trim() || 0;
    var subaccountId = $("#tabContent>.tab-pane.active .principal").attr('data-subaccountId');
    var createTime = $("#tabContent>.tab-pane.active .createTime").val();

    if ($('.cardBox.active').hasClass('addNew')){
        var type = 1;
    }else{
        var type = 0;
    }
    var returnDate = {
        merchantId: params.merchantId,
        memberId: params.memberId,
        userId: params.userId,
        operatorId: params.userId,
        personId: $('#memberName').attr('data-personId'),
        shopId: $("#tabContent>.tab-pane.active .account1 option:selected").val(),
        // accountName: accountName,
        businessId: businessId,
        businessName: businessName,
        businessType: businessType,
        memberName: $('#memberName').val(),
        birthday: $('#birthday').val(),
        isLun: isLun,
        oldMobile: oldMobile,
        phone: phone,
        newPeriodTime: newPeriodTime,
        oldPeriodTime: oldPeriodTime,
        finance: newFinance,
        newFinance: newFinance,
        oldFinance: oldFinance,
        usableInterest: usableInterest,
        interest: usableInterest,
        principal: principal,
        createTime: createTime,
        subaccountId: subaccountId,
        type: type,
        // pointValue : $('#pointValue').val(),
        accountlist : accountsList
    };
    return returnDate;
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

$('#mobile').on('change', function () {
    var mobile = $('#mobile').val();
    var reg = /^[1][3-9][0-9]{9}$/;
    if (!reg.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }
});