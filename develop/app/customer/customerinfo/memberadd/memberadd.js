var zNodes = [];
var params;
var loading;
var memberIdValue;
var upSubAccountId = ''
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    params = getParams();
    getShop();
    getSelect();
});
var startdate = getSec(new Date(), 1);
laydate.render({//渲染开始时间选择
    elem: `#birthday`,//通过id绑定html中插入的start  
    btns: ['clear', 'confirm']
    // type: 'datetime'
    // value: startdate
});
laydate.render({//渲染开始时间选择
    elem: `#startDate`,//通过id绑定html中插入的start  
    btns: ['clear', 'confirm'],
    type: 'datetime',
    value: startdate
});
//第一个页面提交
var accountList = [];
$('#submit1').click(function () {
    var name = $('#userName').val().trim();
    if (name.length <= 0) {
        layer.msg('请填写姓名！');
        return false;
    }
    if (name.length < 2) {
        layer.msg('姓名不少于2个字！');
        return false;
    }
    var mobile = $('#mobile').val().trim();
    if (mobile.length <= 0 ) {
        layer.msg('请填写电话号码！');
        return false;
    } else if (mobile.length < 11){
        layer.msg('请填写正确的电话号码！');
        return false;
    }
    var birthday = $('#birthday').val();
    if ($('#isLunar').is(':checked')){
        var isLun = 0;
    }else{
        var isLun = 1;
    }
    var identityCard = $('#identityCard').val().trim();
    if (identityCard.length > 0 && identityCard.length !== 18){
        layer.msg('身份证格式错误格式错误！');
        return false;
    }
    var reg = /^\d{17}(\d|x|X)$/;
    if (identityCard.length > 0 && !reg.test(identityCard)) {
        layer.msg("请输入正确的身份证号!")
        return false;
    }

    var regMobile = /^[1][3-9][0-9]{9}$/;
    if (!regMobile.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }

    var cmd = "customer/checkMemberCard";
    var datas = {
        merchantId: params.merchantId,
        mobile: mobile
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var dataa = re.data;
            if (dataa.type == 1){
                layer.confirm('当前用户有删除记录,补录后将无法恢复之前记录,是否选择继续补录?', function (index) {
                    //do something
                    var cmd = "customer/addMemberCard";
                    var datas = {
                        merchantId: params.merchantId,
                        userId: params.userId,
                        name: name,
                        shopId: $('#account').val(),
                        shopName: $('#account').find("option:selected").text(),
                        mobile: mobile,
                        birthday: birthday,
                        isLun: isLun,
                        identityCard: identityCard
                    };
                    ajaxAsync(cmd, datas, function (re) {
                        if (re.code == 1) {
                            $('#step1').css('display', 'none');
                            $('#checkStep1').css('display', 'block');
                            if (re.data) {
                                accountList = re.data;
                                console.log(accountList);
                                console.log(accountList[0].memberId);
                                memberIdValue = accountList[0].memberId;
                            }
                        } else {
                            layer.msg(re.msg);
                        }
                    })
                    layer.close(index);
                });
            } else if (dataa.type == 2){
                var cmd = "customer/addMemberCard";
                var datas = {
                    merchantId: params.merchantId,
                    userId: params.userId,
                    name: name,
                    shopId: $('#account').val(),
                    shopName: $('#account').find("option:selected").text(),
                    mobile: mobile,
                    birthday: birthday,
                    isLun: isLun,
                    identityCard: identityCard
                };
                ajaxAsync(cmd, datas, function (re) {
                    if (re.code == 1) {
                        $('#step1').css('display', 'none');
                        $('#checkStep1').css('display', 'block');
                        if (re.data) {
                            accountList = re.data;
                            console.log(accountList);
                            console.log(accountList[0].memberId);
                            memberIdValue = accountList[0].memberId;
                        }
                    } else {
                        layer.msg(re.msg);
                    }
                })
            
            } else{
                layer.msg(re.msg);
            }
        }else {
            layer.msg(re.msg);
        }
    })
})


$('#mobile').on('change', function () {
    var mobile = $('#mobile').val();
    var reg = /^[1][3-9][0-9]{9}$/;
    if (!reg.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }
});

//跳转到第二个页面
$('#addAccount').click(function () {
    $('#checkStep1').css('display','none');
    $('#step2').css('display','block');
    // var cmd = "customer/getShopInfoByMerId";
    // var datas = {
    //     merchantId: params.merchantId,
    //     userId: params.userId
    // };
    // ajaxAsync(cmd, datas, function (re) {
    //     if (re.code == 1) {
    //         $('#accountStep2').text('');
    //         if(re.data){
    //             var data = re.data;
    //             for (var i = 0; i < data.length; i++) {
    //                 var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
    //                 $('#accountStep2').append(opt);
    //             }
    //         }
    //     } else {
    //         layer.msg(re.msg);
    //     }
    // })
    // refreshAccount();
    // getInfo();
    // //获取信息
    // var accountsList = [];
    ajaxFuc();



})

var isNew = 0;
//第二个页面提交
$('#submit2').click(function () {
    var businessId = $("#tabContent>.tab-pane.active").find("option:selected").val();
    // var businessName = $("#tabContent>.tab-pane.active").find("option:selected").text();
    var businessType = $("#tabContent>.tab-pane.active").find("option:selected").attr('data-businesstype');
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
    // var subaccountId = $("#tabContent>.tab-pane.active .principal").attr('data-subaccountId');
    var subaccountId= $('.cardBox.active').attr('subaccountId');
    upSubAccountId = subaccountId;
    var createTime = $("#tabContent>.tab-pane.active .createTime").val();
    if ($('.cardBox.active').hasClass('addNew')){
        var type = 1;
        isNew = 0;
        businessName = $('#tabContent>.tab-pane.active .select-body.addAccount option:selected').text();
    }else{
        var type = 0;
        isNew = 1;
        businessName = $('#tabContent>.tab-pane.active .select-body.account option:selected').text();
    }
    var info = {
        merchantId: params.merchantId,
        memberId: memberIdValue,
        userId: params.userId,
        operatorId: params.userId,
        // personId: $('#memberName').attr('data-personId'),
        shopId: $('#tabContent>.tab-pane.active .select-body.accountStep2 option:selected').val(),
        // accountName: accountName,
        businessId: businessId,
        businessName: businessName,
        businessType: businessType,
        // memberName: $('#memberName').val(),
        // birthday: $('#birthday').val(),
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
        type: type
    };
    // var info = callbackdataContent();
    // var cmd = "customer/modifySubAccount";
    if(info.type == 1){
        var cmd = "customer/addSubaccounts";
    }else{
        var cmd = "customer/modifySubAccount";
    }
    ajaxAsync(cmd, info, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('#step2').css('display','none');
            $('#checkStep2').css('display','block');
            // window["layui-layer-iframe" + index].location.reload();
        //    location.reload();
            // layer.close(index);
        } else {
            layer.msg(re.msg);
        }
    })
    // console.log(info);

    
    // var isFans = $('#accountType').attr('data-isFans');
    // if (isFans == 'true'){
    //     var finance = $('#finance').val().trim();
    //     if (finance.length > 0 && Number(finance) < 0) {
    //         layer.msg('请填写有效活动经费！');
    //         return false;
    //     }
    //     if ($('#renewPerYear').is(':checked')){
    //         var renewPerYear = 1;
    //     }else{
    //         var renewPerYear = 0;
    //     }
    // }else{
    //     var finance = '';
    //     var renewPerYear = '';
    // }
    // var createTime = $('#startDate').val();
    // if (createTime.length <= 0) {
    //     layer.msg('请选择办卡日期！');
    //     return false;
    // }
    // var interest = $('#interest').val().trim() || 0;
    // // if (interest.length > 0 && Number(interest) < 0) {
    // //     layer.msg('请填写有效赠送金额！');
    // //     return false;
    // // }
    // var principal = $('#principal').val().trim();
    // if (principal.length > 0 && Number(principal) < 0) {
    //     layer.msg('请填写有效实际金额！');
    //     return false;
    // }
    // var cmd = "customer/addSubaccounts";
    // var datas = {
    //     merchantId: params.merchantId,
    //     operatorId: params.userId,
    //     memberId: accountList[0].memberId,
    //     shopId: accountList[0].shopId,
    //     principal: principal,
    //     interest: interest,
    //     finance: finance,
    //     renewPerYear: renewPerYear,
    //     businessId: $('#accountType').val(),
    //     businessName: $('#accountType').find("option:selected").text(),
    //     createTime: createTime
    // };
    // ajaxAsync(cmd, datas, function (re) {
    //     if (re.code == 1) {
            // $('#step2').css('display','none');
            // $('#checkStep2').css('display','block');
            // if (re.data) {
            //     accountList = re.data;
            // }
    //     } else {
    //         layer.msg(re.msg);
    //     }
    // })
})
//第二页继续录入
$('#restart').click(function () {
    $('#step2').css('display', 'block');
    $('#checkStep2').css('display', 'none');
    sedGetInfo();
    // getInfo();
    // var cmd = "customer/getSubaccountDetail";
    // var datas = {
    //     merchantId: params.merchantId,
    //     memberId: memberIdValue
    // };
    // ajaxAsync(cmd, datas, function (re) {
    //     if (re.code == 1) {
    //         if(re.data){
    //             if (re.data.memberCard){
    //                 getPersonInfo(re.data.memberCard)
    //             }
                 
    //             if (re.data.accountsList){
    //                 accountsList = re.data.accountsList;
    //                 console.log(accountsList);
    //                 getTables(accountsList)
    //             }
    //         }
    //         // layer.close(layer.loading);
    //     } else {
    //         layer.msg(re.msg);
    //     }
    // })
    // //获取个人信息
    // function getPersonInfo(data) {
    //     $('#memberName').val(data.memberName);
    //     $('#memberName').attr('data-personId', data.userId);
    //     $('#memberName').attr('data-shopId', data.shopId);
    //     $('#mobile').val(data.mobile);
    //     $('#mobile').attr('data-oldMobile',data.mobile);
    //     $('#islunarBirthday').attr('data-lunarBirthday', data.lunarBirthday);
    //     $('#islunarBirthday').attr('data-Birthday', data.birthday);
    //     if (data.birthday !== ''){
    //         $('#birthday').val(data.birthday);
    //     } else if (data.lunarBirthday !== ''){
    //         $('#birthday').val(data.lunarBirthday);
    //         $('#islunarBirthday').attr('checked','checked')
    //     }else{
    //         $('#birthday').val(data.birthday);
    //     }
    // }
    // $('#islunarBirthday').click(function () {
    //     var lunarBirthday = $(this).attr('data-lunarBirthday') || '';
    //     var birthday = $(this).attr('data-birthday') || '';
    //     if($(this).is(':checked')){
    //         $('#birthday').val(lunarBirthday);
    //     }else{
    //         $('#birthday').val(birthday);
    //     }
    // })

    // //获取切换的tabs
    // var numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    // function getTables(data) {
    //     if (data.length > 0){
    //         // for (var i = 0; i < data.length; i++) {
    //         //     if (i == 0) {
    //         //         var liItem = `<li role="presentation" data-isload="loaded" data-num="${i}" class="tabtog active">
    //         //             <a href="#${i}" role="tab" data-toggle="tab">账户${numList[i]}</a>
    //         //         </li>`
    //         //     } else {
    //         //         var liItem = `<li role="presentation" data-num="${i}" class="tabtog">
    //         //             <a href="#${i}" role="tab" data-toggle="tab">账户${numList[i]}</a>
    //         //         </li>`
    //         //     }
    //         //     $('#tablist').append(liItem);
    //         // }
    //         var optBox = `<div class="swiper-slide">
    //                             <div class="cardBox addNew" data-num="${data.length}">
    //                             </div>
    //                         </div>`;
    //         for (var i = 0; i < data.length; i++) {
    //             if (data[i].discount == 0 || data[i].discount == 100) {
    //                 var discount = '无折扣';
    //             } else {
    //                 var discount = (data[i].discount / 10).toFixed(1) + '折';
    //             }
    //             if (i == 0) {
    //                 optBox += `<div class="swiper-slide">
    //                             <div class="cardBox active" data-isload="loaded" data-num="${i}" subaccountId="${data[i].subaccountId}" principal="${Number(data[i].principal).toFixed(2)}" usableInterest="${Number(data[i].usableInterest).toFixed(2)}" periodTime="${data[i].accountName}">
    //                                 <div class="cardBoxTitle">${data[i].accountName}</div>
    //                                 <div class="cardBoxMoney">
    //                                     <div>本金余额
    //                                         <span class="">${Number(data[i].principal).toFixed(2)}</span>
    //                                     </div>
    //                                     <div>卡项余额
    //                                         <span class="">${Number(data[i].usableInterest).toFixed(2)}</span>
    //                                     </div>
    //                                     <div>会员折扣
    //                                         <span>${discount}</span>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>`;
    //             } else {
    //                 optBox += `<div class="swiper-slide">
    //                             <div class="cardBox" data-num="${i}" subaccountId="${data[i].subaccountId}" principal="${Number(data[i].principal).toFixed(2)}" usableInterest="${Number(data[i].usableInterest).toFixed(2)}" periodTime="${data[i].accountName}">
    //                                 <div class="cardBoxTitle">${data[i].accountName}</div>
    //                                 <div class="cardBoxMoney">
    //                                     <div>本金余额
    //                                         <span>${Number(data[i].principal).toFixed(2)}</span>
    //                                     </div>
    //                                     <div>卡项余额
    //                                         <span>${Number(data[i].usableInterest).toFixed(2)}</span>
    //                                     </div>
    //                                     <div>会员折扣
    //                                         <span>${discount}</span>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>`;
    //             }
    //         }
    //         $('#accountInfo').text('');
    //         $('#accountInfo').append(optBox);

    //         var swiper = new Swiper('.swiper-container', {
    //             navigation: {
    //                 nextEl: '.swiper-button-next',
    //                 prevEl: '.swiper-button-prev',
    //             },
    //             slidesPerView: 4,
    //             spaceBetween: 30,
    //             freeMode: true,
    //         });
    //         getSelect(data[0], 0)
    //     }
    // }
    

    // refreshAccount();
})



//跳转补录卡
function jumpout() {
    parent.layer.open({
        type: 2,
        area: ['80%', '80%'],
        fix: false, //不固定
        maxmin: true,
        title: "账户信息-补卡",
        content: 'supcard/supcard.html?id=' + accountList[0].memberId + '&merchantId=' + params.merchantId + '&shopId=' + accountList[0].shopId + '&userId=' + params.userId,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            var info = parent.window["layui-layer-iframe" + index].callbackdata();
            if (info.serviceCards.length < 1) {
                layer.msg('请选择补录的服务卡项后提交！', { icon: 2 });
                return false;
            }
            var cmd = "customer/addServiceCard";
            // var datas = {
            //     merchantId: params.merchantId,
            //     id: memberId,
            //     userId: params.userId,
            //     memberId: params.id,
            //     cardName: cardName,
            //     subaccountId: subaccountId,
            //     purchaseTime: info.purchaseTime
            // };
            ajaxAsync(cmd, info, function (re) {
                if (re.code == 1) {
                    parent.layer.msg(re.msg);
                    $('#checkStep3').css('display', 'block');
                    $('#step2').css('display', 'none');
                    $('#checkStep2').css('display', 'none');
                    parent.layer.close(index);
                } else {
                    parent.layer.msg(re.msg);
                }
            })
        },
        cancel: function (index) {
        }
    });
}
//关闭弹窗
$('#closeAll').click(function () {
    $('#search', window.parent.document).click();
    parent.layer.closeAll();
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
                    <span class="title-name">店铺：</span>
                    <span class="step2-title shopName">${accountList[i].shopName}</span>
                </div>
            </div>`;
    }
    $('#accountList').html(row);
}
//重新录入
$('.renew').click(function () {
    $('#step1').css('display','block');
    $('#checkStep1').css('display','none');
    $('#step2').css('display','none');
    $('#checkStep2').css('display','none');
    $('#checkStep3').css('display','none');
    //清空第一页
    $('#userName').val('');
    $('#mobile').val('');
    $('#birthday').val('');
    $('#identityCard').val('');
    $('#isLunar').removeAttr('checked');
    //第二页
    $('#accountType').val('0');
    $('#giveType').text('赠送卡项金');
    $('#startDate').val(startdate);
    $('#principal').val(0);
    $('#interest').val(0);
    $('#finance').val(0);
    $(`#productRow`).css('display', 'none');
    $(`#giveMoney`).css('display', 'block');
})

//监听身份证输入
$('#identityCard').on('input propertychange change', function () {
    var identityCard = $(this).val().trim();
    if (identityCard.length > 18) {
        $(this).val(identityCard.substring(0, 18));
    }
});
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
        $(`#serviceDetail`).val('普通会员  无权益 赠送卡项金');
        $(`#giveType`).text("赠送卡项金");
    }else{
        for (var i = 0; i < businesses.length; i++) {
            if (businesses[i].id == businessId) {
                var giveInfo = '';
                if (businesses[i].accountType == 0) {
                    $(`#productRow`).css('display', 'none');
                    $(`#giveMoney`).css('display', 'block');
                    giveInfo = "赠送卡项金"
                } else if (businesses[i].accountType == 1){
                    $(`#productRow`).css('display', 'none');
                    $(`#giveMoney`).css('display', 'block');
                    giveInfo = "赠送本金"
                } else if (businesses[i].accountType == 2){
                    giveInfo = "赠送商品"
                    $(`#productRow`).css('display', 'block');
                    $(`#giveMoney`).css('display', 'none');
                    productInit();
                    if (businesses[i].goodsList) {
                        $('#productList').bootstrapTable('load', businesses[i].goodsList);
                    }
                }
                $(`#giveType`).text(giveInfo);
                $(`#serviceDetail`).val(businesses[i].businessName + '  消费折扣:' + businesses[i].discount + '%  ' + giveInfo);
            }
        }
    }
});
//监听手机号码输入框
$('#mobile').on('input propertychange change', function () {
    var mobile = $(this).val();
    if (mobile.length > 11) {
        $(this).val(mobile.substring(0,11));
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
function validateNumber(self) {
    if (self.value.length == 1) {
        self.value = self.value.replace(/[^1-9]/g, '');
    }
    else {
        self.value = self.value.replace(/\D/g, '');
    }
}
//监听农历生日输入
$('#isLunar').on('click', function () {
    var birthday = $('#birthday').val();
    if (birthday.length == 0) {
        layer.msg('请先选择生日！');
        return false;
    }
});


/************* 初始化 ******************/
//加载门店下拉框
function getShop() {
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
                    var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                    $('#account').append(opt);
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
};
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
                $('#giveType').text('赠送卡项金');
                $('#accountType').attr('data-isFans','false');
                $(`#serviceDetail`).val('普通会员  无权益 赠送卡项金');
                $('.fansRow').css('display','none');
            }
        } else {
            layer.msg(re.msg);
        }
    })
};
function productInit() {
    $('#productList').bootstrapTable({
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
    $('#productList').bootstrapTable('hideLoading');
}
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


//获取切换的tabs
var numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function sedGetInfo(){
    var accountsList1 = [];
    var cmd = "customer/getSubaccountDetail";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberIdValue
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                if(re.data){
                    accountsList1 = re.data.accountsList;
                    getTables(accountsList1)
                    
                }
                // layer.close(layer.loading);
            } else {
                layer.msg(re.msg);
            }
        })
    
}

function getTables(data) {
    if (data.length > 0){
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
            if(isNew == 0){
                if (i == data.length - 1) {
                    optBox += `<div class="swiper-slide">
                                <div class="cardBox active" data-isload="loaded" shopId="${data[i].shopId}" data-num="${i}" subaccountId="${data[i].subaccountId}" principal="${Number(data[i].principal).toFixed(2)}" periodTime="${data[i].accountName}">
                                    <div class="cardBoxTitle">${data[i].accountName}</div>
                                    <div class="cardBoxMoney">
                                        <div>本金余额
                                            <span class="">${Number(data[i].principal).toFixed(2)}</span>
                                        </div>
                                        <div>会员折扣
                                            <span>${discount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                } else {
                    optBox += `<div class="swiper-slide">
                                <div class="cardBox" data-num="${i}" subaccountId="${data[i].subaccountId}" shopId="${data[i].shopId}" principal="${Number(data[i].principal).toFixed(2)}" periodTime="${data[i].accountName}">
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
            }else{
                // console.log(upSubAccountId);
                // Console.log(data[i].subaccountId);
                if (upSubAccountId == data[i].subaccountId) {
                    optBox += `<div class="swiper-slide">
                                <div class="cardBox active" data-isload="loaded" data-num="${i}" shopId="${data[i].shopId}" subaccountId="${data[i].subaccountId}" principal="${Number(data[i].principal).toFixed(2)}" periodTime="${data[i].accountName}">
                                    <div class="cardBoxTitle">${data[i].accountName}</div>
                                    <div class="cardBoxMoney">
                                        <div>本金余额
                                            <span class="">${Number(data[i].principal).toFixed(2)}</span>
                                        </div>
                                        <div>会员折扣
                                            <span>${discount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                } else {
                    optBox += `<div class="swiper-slide">
                                <div class="cardBox" data-num="${i}" subaccountId="${data[i].subaccountId}" shopId="${data[i].shopId}" principal="${Number(data[i].principal).toFixed(2)}" periodTime="${data[i].accountName}">
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
            
        }
        $('#accountInfo').text('');
        $('#accountInfo').append(optBox);

        var swiper = new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            slidesPerView: 4,
            spaceBetween: 30,
            freeMode: true,
        });
        // getSelect(data[0], 0)
    }
}


// 新样式 子账户
function ajaxFuc(){
    var startdate = getSec(new Date(), 1);
    var periodDate = getSec(new Date(new Date().getTime() + 365*24*60*60*1000), 5);
    getInfo();
    //获取信息
    var accountsList1 = [];
    function getInfo() {
        var cmd = "customer/getSubaccountDetail";
        var datas = {
            merchantId: params.merchantId,
            memberId: memberIdValue
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                if(re.data){
                    if (re.data.memberCard){
                        getPersonInfo(re.data.memberCard)
                    }
                     
                    if (re.data.accountsList){
                        accountsList1 = re.data.accountsList;
                        getTables(accountsList1)
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
    // var numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    function getTables(data) {
        if (data.length > 0){
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
                                <div class="cardBox active" data-isload="loaded" data-num="${i}" shopId="${data[i].shopId}" subaccountId="${data[i].subaccountId}" principal="${Number(data[i].principal).toFixed(2)}" periodTime="${data[i].accountName}">
                                    <div class="cardBoxTitle">${data[i].accountName}</div>
                                    <div class="cardBoxMoney">
                                        <div>本金余额
                                            <span class="">${Number(data[i].principal).toFixed(2)}</span>
                                        </div>
                                        <div>会员折扣
                                            <span>${discount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                } else {
                    optBox += `<div class="swiper-slide">
                                <div class="cardBox" data-num="${i}" subaccountId="${data[i].subaccountId}" shopId="${data[i].shopId}" principal="${Number(data[i].principal).toFixed(2)}" periodTime="${data[i].accountName}">
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
            $('#accountInfo').text('');
            $('#accountInfo').append(optBox);
    
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
        upSubAccountId = $(this).attr('subaccountid');
        if ($(this).attr('data-isload') !== 'loaded') {
            $(this).attr('data-isload','loaded')

            if($(this).hasClass('addNew')){
                getSelect(accountsList1, num, 'new');
            }else{
                var cmd = "customer/getSubaccountDetail";
                var datas = {
                    merchantId: params.merchantId,
                    memberId: memberIdValue
                };
                ajaxAsync(cmd, datas, function (re) {
                    if (re.code == 1) {
                        if(re.data){
                            if (re.data.accountsList){
                                accountsList1 = re.data.accountsList;
                                getSelect(accountsList1[num], num);
                                
                            }
                            // console.log(accountsList1);

                        }
                    } else {
                        layer.msg(re.msg);
                    }
                });
            }
            
        }else{
            // 店铺数据填充
            var cmd = "customer/getShopInfoByMerId";
            var datas = {
                merchantId: params.merchantId,
                userId: params.userId
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    $('#tabContent>.tab-pane.active .select-body.accountStep2').text('');
                    if(re.data){
                        var data = re.data;
                        for (var i = 0; i < data.length; i++) {
                            if($('.cardBox.active').attr('shopId') == data[i].shopId){
                                var opt = `<option value="${data[i].shopId}" selected="selected">${data[i].shopName}</option>`;
                            }else{
                                var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                            }
                            $('#tabContent>.tab-pane.active .select-body.accountStep2').append(opt);
                        }
                    }
                } else {
                    layer.msg(re.msg);
                }
            }) 
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
                    businessesList = '<option value="0" data-businesstype = "0">普通会员</option>';
                    if (type == 'new'){
                        for (var i = 0; i < businesses.length; i++) {
                            businessesList += `<option data-businessType="${businesses[i].businessType}" value="${businesses[i].id}">${businesses[i].businessName}</option>`;
                        }
                        refreshInfo(data, index,'new');
                    }else{
                        for (var i = 0; i < businesses.length; i++) {
                            if (data && (data.businessId == businesses[i].id)) {
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
            var content = `<div role="tabpanel" class="tab-pane active" id="${index}">
                        <div class="row row-user">
                            <span class="title-name col-xs-1">会员类型：</span>
                            <select data-isFans="false" class="select-body account col-xs-3 addAccount">${businessesList}</select>
                            <span class="title-name col-xs-1">赠送方式：</span>
                            <span class="col-xs-3 giveType">${giveInfo}</span>
                            <span class="title-name col-xs-1">所属店铺：</span>
                            <select class="select-body accountStep2" name="account1" id="accountStep2${index}">
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
            // console.log(data);
           
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
    
            // 店铺数据填充
            var cmd = "customer/getShopInfoByMerId";
            var datas = {
                merchantId: params.merchantId,
                userId: params.userId
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    $(`#accountStep2${index}`).text('');
                    if(re.data){
                        var data = re.data;
                        for (var i = 0; i < data.length; i++) {
                            if($('.cardBox.active').attr('shopId') == data[i].shopId){
                                var opt = `<option value="${data[i].shopId}" selected="selected">${data[i].shopName}</option>`;
                            }else{
                                var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                            }
                            $(`#accountStep2${index}`).append(opt);
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
            var oTabPane = $('#tabContent').find(".tab-pane[id="+index+"]");
            var content = ``;
            if(oTabPane.length < 1){
                content = `<div role="tabpanel" class="tab-pane active" id="${index}">`;
            }
            content += `<div class="row row-user">
                                    <span class="title-name col-xs-1">会员类型：</span>`;
            if (data.businessType == 1) {
                content += `<select data-isFans="true" class="select-body  col-xs-3 account">${businessesList}</select>`;
            }else{
                content += `<select data-isFans="false" class="select-body col-xs-3 account">${businessesList}</select>`;
            }
            // content += `<span class="title-name col-xs-1">账户名称：</span>
            //             <input type="text" class="form-input col-xs-3 accountName" value="${data.accountName}" maxlength="10">
            content += `<span class="title-name col-xs-1">赠送方式：</span>
                        <span class="col-xs-3 giveType">${giveInfo}</span>
                        <span class="title-name col-xs-1">所属店铺：</span>
                        <select class="select-body accountStep2" name="account1" id="accountStep2${index}">
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
                                <input type="text" data-subaccountId="${data.subaccountId}"  class="form-input col-xs-3 principal" value="${data.principal}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
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
                            </div>`
            
            
            if(oTabPane.length < 1){
                content += `</div>`
                $('#tabContent').append(content);
            }else{
                $(oTabPane).addClass("active").siblings().removeClass("active");
                $(oTabPane).html(content);
            }
            

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
    
            // 店铺数据填充
            var cmd = "customer/getShopInfoByMerId";
            var datas = {
                merchantId: params.merchantId,
                userId: params.userId
            };
            ajaxAsync(cmd, datas, function (re) {
                if (re.code == 1) {
                    $(`#accountStep2${index}`).text('');
                    if(re.data){
                        var data = re.data;
                        for (var i = 0; i < data.length; i++) {
                            // var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                            if($('.cardBox.active').attr('shopId') == data[i].shopId){
                                var opt = `<option value="${data[i].shopId}" selected="selected">${data[i].shopName}</option>`;
                            }else{
                                // var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                                var opt = `<option value="${data[i].shopId}">${data[i].shopName}</option>`;
                            }
                            $(`#accountStep2${index}`).append(opt);
                        }
                    }
                } else {
                    layer.msg(re.msg);
                }
            })       
        
        }   
    }
    
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
}