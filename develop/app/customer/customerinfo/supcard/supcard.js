var params;
var loading;
var cardInfoList = [];
var packageInfoList = [];
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    serviceInit();
    params = getParams();
    getServiceCardOrPack();
    getSelect(params);
    getInfo();
    getsalesman();
});
//加载下拉框
var accountsList =[];
function getSelect(data) {
    var cmd = "customer/getSubaccountDetail";
    var datas = {
        merchantId: data.merchantId,
        memberId: data.id
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data.memberCard){
                var memberCard = re.data.memberCard;
                $('#userName').text(memberCard.memberName)
                $('#userName').attr('data-balance',memberCard.balance)
            }
            if (re.data.accountsList){
                accountsList = re.data.accountsList;
                if (accountsList[0].businessId == 0){
                    $('#userName').attr('data-purchaseType', 0)
                }else{
                    $('#userName').attr('data-purchaseType', 1)
                }
                $('#userName').attr('data-subaccountId', accountsList[0].subaccountId)
                $('#userShop').text(accountsList[0].shopName)
                $('#principal').text(Number(accountsList[0].principal).toFixed(2));
                $('#interest').text(Number(accountsList[0].interest).toFixed(2));
                if (accountsList[0].discount == 0 || accountsList[0].discount == 100){
                    $('#hasdiscount').css('display', 'none');
                    $('.nodiscount').css('display', 'inline-block');
                    $('.isdiscount').css('display', 'none');
                }else{
                    $('#hasdiscount').css('display', 'inline-block');
                    $('.nodiscount').css('display', 'none');
                    $('.isdiscount').css('display', 'inline-block');
                    $('#hasdiscount').attr('checked','checked');
                    $('#discount').text((accountsList[0].discount / 10).toFixed(1));
                }
                $('#account').html('');
                for (var i = 0; i < accountsList.length; i++) {
                    var optBox = `
                        <option class="" value="${accountsList[i].subaccountId}">${accountsList[i].accountName}</option>
                    `;
                    $('#account').append(optBox);
                }
                if (data.subaccountId !== undefined){
                    $('#account').val(data.subaccountId)
                    $("#account").trigger("change");
                }
            }
            
        } else {
            layer.msg(re.msg);
        }
    })
};
//监听账户变化
$('#account').change(function () {
    var subaccountId = $(this).val();
    for (var i = 0; i < accountsList.length; i++) {
        if (subaccountId == accountsList[i].subaccountId) {
            if (accountsList[i].businessId == 0) {
                $('#userName').attr('data-purchaseType', 0)
            } else {
                $('#userName').attr('data-purchaseType', 1)
            }
            $('#userName').attr('data-subaccountId', accountsList[i].subaccountId)
            $('#userShop').text(accountsList[i].shopName)
            $('#principal').text(Number(accountsList[i].principal).toFixed(2));
            $('#interest').text(Number(accountsList[i].interest).toFixed(2));
            if (accountsList[i].discount == 0 || accountsList[i].discount == 100) {
                $('#hasdiscount').css('display', 'none');
                $('.nodiscount').css('display', 'inline-block');
                $('.isdiscount').css('display', 'none');
                $('#discount').text((accountsList[i].discount / 10).toFixed(1));
            } else {
                $('#hasdiscount').css('display', 'inline-block');
                $('.nodiscount').css('display', 'none');
                $('.isdiscount').css('display', 'inline-block');
                // $('#hasdiscount').attr('checked', 'checked');
                $('#discount').text((accountsList[i].discount / 10).toFixed(1));
            }
        }
    }
    // getInfo(subaccountId);
});
//获取信息
function getInfo(subaccountId) {
    var cmd = "customer/serviceCardItemList";
    var datas = {
        merchantId: params.merchantId,
        id: params.id
        // subaccountId: subaccountId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var businessList = [];
            $('#serviceCard').html(`<option value=""> -选择服务卡- </option>`);
            if (re.data) {
                if (re.data.serviceCardTLC) {
                    var serviceCardTLC = re.data.serviceCardTLC;
                    for (var i = 0; i < serviceCardTLC.length; i++) {
                        businessList.push(serviceCardTLC[i]);
                    }
                }
                if (re.data.packageCardTLC) {
                    var packageCardTLC = re.data.packageCardTLC;
                    for (var i = 0; i < packageCardTLC.length; i++) {
                        businessList.push(packageCardTLC[i]);
                    }
                }
            }
            for (var i = 0; i < businessList.length; i++) {
                var optBox = `
                        <option class="" value="${businessList[i].id}">${businessList[i].cardName}</option>
                    `;
                $('#serviceCard').append(optBox);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
//修改服务卡和服务套餐
var tempService = '';
function getServiceCardOrPack() {
    var serviceType = $('#cardType').val();
    $('#serviceList').combogrid({
        showIndex: true,				//是否显示序号,不设置该属性 默认不显示序号 
        panelHeight: 180,
        panelWidth: 660,				//表格整体宽度
        idField: 'id',				//主键    获取方式: $("#lcccombogrid").attr("ckvalue");
        textField: 'serviceName',			//选中后填充到文本框的展示属性
        searchField: 'serviceName',			//检索属性值,不设置默认为 textField
        url: 'customer/serviceCardList?merchantId=' + params.merchantId + '&type=' + serviceType,
        columns: [[					//注意是二维数组
            { field: 'serviceName', title: '服务名', width: 60 },
            { field: 'discountPrice', title: '价格', width: 100 },
            { field: 'packNumber', title: '数量', width: 100,
                formatter: function (val, row, index) {
                    if (row.packType == 5){
                        return '永久';
                    }else{
                        return val;
                    }
                } 
            },
            { field: 'packType', hide: true },
            { field: 'performanceCalc', hide: true },
            { field: 'achRatio', hide: true },
            { field: 'servicePerformance', hide: true },
            { field: 'serviceType', hide: true },
            { field: 'packDuration', hide: true },
            { field: 'serviceId', hide: true },
            { field: 'type', hide: true },
            { field: 'id', hide: true }
        ]],
        onSelect: function (ret) {
            if(ret.packType == 2){
                $('#serviceList').val(ret.serviceName + `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + Number(ret.discountPrice).toFixed(2) + `(元)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + ret.packNumber + `(月)`)
            } else if (ret.packType == 5){
                $('#serviceList').val(ret.serviceName + `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + Number(ret.discountPrice).toFixed(2) + `(元)`)
            }else{
                $('#serviceList').val(ret.serviceName + `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + Number(ret.discountPrice).toFixed(2) + `(元)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + ret.packNumber + `(次)`)
            }
            tempService = ret;
        }
    });
}
$("#cardType").change(function () {
    var serviceType = $(this).val();
    $('#serviceList').val('');
    $('#serviceList').combogrid("reload", 'customer/serviceCardList?merchantId=' + params.merchantId + '&type=' + serviceType);
});
//添加补卡项目
var tempList = [];
$('#addCart').click(function () {
    if (tempService !== ''){
        //整理数据
        tempService.purchaseNum = 1;  //购买数量
        tempService.purchaseOrgPrice = Number(tempService.discountPrice).toFixed(2);  //总价
        
        tempService.oldServicePerformance = tempService.servicePerformance;
        //修改实际价格
        if ($("#hasdiscount").is(':checked')) {
            var discount = Number($('#discount').text()) / 10;
            tempService.purchasePrice = (Number(tempService.discountPrice) * discount).toFixed(2);
        } else {
            tempService.purchasePrice = Number(tempService.discountPrice).toFixed(2);
        }
        //修改服务业绩
        if (tempService.performanceCalc == 1) {
            if (tempService.purchaseOrgPrice == 0){
                tempService.achRatio = 0;
            }else{
                tempService.achRatio = (Number(tempService.purchasePrice) / Number(tempService.purchaseOrgPrice) * tempService.servicePerformance).toFixed(2)
            }
        }else{
            tempService.achRatio = tempService.servicePerformance;
        }
        tempService.serviceType = tempService.type;
        if (tempService.packType == '5'){
            tempService.servicePackNum = 0;
            tempService.packNumber = 0 ;  //剩余次数
            tempService.remainNum = 0;  //剩余次数
        }else{
            tempService.servicePackNum = tempService.packNumber;
            tempService.remainNum = tempService.packNumber;  //剩余次数
        }
        

        if (tempList.length == 0){
            tempList.push(tempService);
        }else{
            for (var i = 0; i < tempList.length; i++) {
                if (tempService.id == tempList[i].id){
                    layer.msg('请勿重复添加相同服务卡或服务套餐！');
                    return false;
                }
            }          
            tempList.push(tempService);
        }
        //修改展示数据
        // for (var j = 0; j < tempList.length; j++) {          
        //     tempList[j].purchaseNum = 1;  //购买数量
        //     tempList[j].purchaseOrgPrice = Number(tempList[j].discountPrice).toFixed(2);  //总价
        //     tempList[j].remainNum = tempList[j].packNumber;  //剩余次数
        //     //修改实际价格
        //     if ($("#hasdiscount").is(':checked')) {
        //         var discount = Number($('#discount').text()) / 10;
        //         tempList[j].purchasePrice = (Number(tempList[j].discountPrice) * discount).toFixed(2);
        //     } else {
        //         tempList[j].purchasePrice = Number(tempList[j].discountPrice).toFixed(2);
        //     }
        //     //修改服务业绩
        //     if (tempList[j].performanceCalc == 1) {
        //         tempList[j].servicePerformance = (Number(tempList[j].purchasePrice) / Number(tempList[j].purchaseOrgPrice) * tempList[j].servicePerformance).toFixed(2)
        //     }
        //     tempList[j].achRatio = tempList[j].servicePerformance;
        //     tempList[j].serviceType = tempList[j].type;
        //     tempList[j].servicePackNum = tempList[j].packNumber;
        // }
        $('#serviceTable').bootstrapTable('load', tempList);
        changeTotal();
    }else{
        layer.msg('请先选择服务卡或套餐！');
        return false;
    }
})
//删除当前行
function delserviceinfo(id) {
    for (var i = 0; i < tempList.length; i++) {
        if (tempList[i].id == id) {
            tempList[i].servicePerformance = tempList[i].oldServicePerformance;
            tempList.splice(i, 1);
        }
    }
    $('#serviceTable').bootstrapTable('load', tempList);
    changeTotal();
}
//监听table里数量输入框
$('#serviceTable').on('input', '.serviceNum', function () {
    var serviceNum = $(this).val();
    if (serviceNum.indexOf('-') !== -1){
        layer.msg('请输入大于0的数量！');
        return false;
    } else if (serviceNum.length == 0 || isNaN(Number(serviceNum))){
        layer.msg('请输入有效数量！');
        return false;
    } else if (serviceNum.indexOf('.') !== -1){
        layer.msg('请输入整数！');
        return false;
    }
    var id = $(this).attr('data-id');
    for (var i = 0; i < tempList.length; i++) {
        if (id == tempList[i].id){
            tempList[i].purchaseNum = serviceNum;  //购买数量
            tempList[i].purchaseOrgPrice = (Number(serviceNum) * Number(tempList[i].discountPrice)).toFixed(2);  //总价
            tempList[i].remainNum = Number(serviceNum) * Number(tempList[i].packNumber);  //剩余次数
            //修改实际价格
            if ($("#hasdiscount").is(':checked')) {
                var discount = Number($('#discount').text()) / 10;
                tempList[i].purchasePrice = (Number(tempList[i].discountPrice) * discount * Number(serviceNum)).toFixed(2);
            } else {
                tempList[i].purchasePrice = Number(tempList[i].discountPrice * Number(serviceNum)).toFixed(2);
            }
            //修改服务业绩
            if (tempList[i].performanceCalc == 1) {
                if (tempService.purchaseOrgPrice == 0) {
                    tempList[i].achRatio = 0;
                } else {
                    tempList[i].achRatio = (Number(tempList[i].purchasePrice) / Number(tempList[i].purchaseOrgPrice) * tempList[i].servicePerformance).toFixed(2)
                }
            }else{
                tempList[i].achRatio = tempList[i].servicePerformance;
            }
            $(this).parent().siblings().find('.totalPrice').text(tempList[i].purchaseOrgPrice);
            $(this).parent().siblings().find('.serviceRemain').val(tempList[i].remainNum);
            $(this).parent().siblings().find('.realPrice').val(tempList[i].purchasePrice);
            $(this).parent().siblings().find('.serviceMoney').val(tempList[i].achRatio);
        }  
    }
    // $('#serviceTable').bootstrapTable('load', tempList);
    changeTotal();
});
$('#serviceTable').on('blur', '.serviceNum', function () {
    var serviceNum = $(this).val();
    if (serviceNum.length == 0 || isNaN(Number(serviceNum))) {
        $(this).val(1);
    }
});
//监听table里剩余次数输入框
$('#serviceTable').on('input propertychange change', '.serviceRemain', function () {
    var id = $(this).attr('data-id');
    var packNumber = Number($(this).parent().siblings().find('.serviceNum').attr('data-packNumber'));
    var serviceNum = Number($(this).parent().siblings().find('.serviceNum').val());
    var serviceRemain = $(this).val();
    if (serviceRemain.indexOf('-') !== -1) {
        layer.msg('请输入大于0的数量！');
        return false;
    } else if (serviceRemain.length == 0 || isNaN(Number(serviceRemain))) {
        layer.msg('请输入有效数量！');
        return false;
    }else if (serviceRemain.indexOf('.') !== -1) {
        layer.msg('请输入整数！');
        return false;
    }
    serviceRemain = Number(serviceRemain);
    var maxNum = packNumber * serviceNum; 
    if (serviceRemain <= 0){
        serviceRemain = 1;
        layer.msg('请输入大于0的剩余次数！');
        return false;
    }
    if (serviceRemain > maxNum){
        $(this).val(maxNum);
        layer.msg('请输入不大于最大次数的剩余次数！');
        return false;
    }
    for (var i = 0; i < tempList.length; i++) {
        if (id == tempList[i].id) {
            tempList[i].remainNum = serviceRemain;  //剩余次数
        }
    }
    // $(this).parent().siblings().find('.serviceRemain').val(tempList[i].remainNum);
});
$('#serviceTable').on('blur', '.serviceRemain', function () {
    var serviceRemain = $(this).val();
    if (serviceRemain.length == 0 || isNaN(Number(serviceRemain))) {
        $(this).val(1);
        layer.msg('请输入有效剩余数量！');
    }
});
//监听table里实际价格输入框
$('#serviceTable').on('input', '.realPrice', function () {
    var id = $(this).attr('data-id');
    var realPrice = $(this).val();
    if (realPrice.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (realPrice.length == 0 || isNaN(Number(realPrice))) {
        layer.msg('请输入有效实际价格！');
        return false;
    }
    for (var i = 0; i < tempList.length; i++) {
        if (id == tempList[i].id) {
            //修改实际价格
            tempList[i].purchasePrice = realPrice;
            if (tempList[i].performanceCalc == '1'){
                if (tempService.purchaseOrgPrice == 0) {
                    tempList[i].achRatio = 0;
                } else {
                    tempList[i].achRatio = (Number(realPrice) / Number(tempList[i].purchaseOrgPrice) * Number(tempList[i].servicePerformance)).toFixed(2);
                }
                $(this).parent().siblings().find('.serviceMoney').val(tempList[i].achRatio);
            }
        }
    }
    // $('#serviceTable').bootstrapTable('load', tempList);
    changeTotal();
});
$('#serviceTable').on('blur', '.realPrice', function () {
    var realPrice = $(this).val();
    if (realPrice.length == 0 || isNaN(Number(realPrice))) {
        $(this).val(0);
        layer.msg('请输入有效实际价格！');
    }
});
//监听table里服务业绩输入框
$('#serviceTable').on('input', '.serviceMoney', function () {
    var id = $(this).attr('data-id');
    var serviceMoney = $(this).val();
    if (serviceMoney.indexOf('-') !== -1) {
        layer.msg('请输入大于0的服务业绩！');
        return false;
    } else if (serviceMoney.length == 0 || isNaN(Number(serviceMoney))) {
        layer.msg('请输入有效服务业绩！');
        return false;
    }
    for (var i = 0; i < tempList.length; i++) {
        if (id == tempList[i].id) {
            //修改实际价格
            // if (tempList[i].performanceCalc == '1') {
            //     tempList[i].achRatio = (Number(realPrice) / Number(tempList[i].purchaseOrgPrice) * Number(tempList[i].servicePerformance)).toFixed(2);
            // }else{
            //     tempList[i].servicePerformance = serviceMoney;
            //     tempList[i].achRatio = serviceMoney;
            // }
            tempList[i].achRatio = serviceMoney;
        }
    }
    $(this).parent().siblings().find('.serviceMoney').val(tempList[i].achRatio);
});
$('#serviceTable').on('blur', '.serviceMoney', function () {
    var serviceMoney = $(this).val();
    if (serviceMoney.length == 0 || isNaN(Number(serviceMoney))) {
        $(this).val(0);
        layer.msg('请输入有效服务业绩！');
    }
});
//监听会员折扣按钮
$('#hasdiscount').click(function () {
    var discount = Number($('#discount').text()) / 10;
    if ($(this).is(":checked")) {
        $("input[class^='realPrice']").each(function (index,obj) {
            if ($(this).val().length == 1) {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
                $(this).val($(this).val().replace(/\.{2,}/g, "."));
                $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
            }
            if ($(this).val() !== '') {
                var realPrice = Number($(obj).parent().parent().find('.totalPrice').text());
                //修改实际价格
                tempList[index].purchasePrice = Number(realPrice * discount).toFixed(2);
                if (tempList[index].performanceCalc == '1'){
                    if (tempService.purchaseOrgPrice == 0) {
                        tempList[index].achRatio = 0;
                    } else {
                        tempList[index].achRatio = (Number(tempList[index].purchasePrice) / Number(tempList[index].purchaseOrgPrice) * Number(tempList[index].servicePerformance)).toFixed(2);
                    }
                    $(this).parent().siblings().find('.serviceMoney').val(tempList[index].achRatio);
                }
            }
        });
    } else {
        $("input[class^='realPrice']").each(function (index,obj) {
            if ($(this).val().length == 1) {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
                $(this).val($(this).val().replace(/\.{2,}/g, "."));
                $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
            }
            if ($(this).val() !== '') {
                var realPrice = Number($(obj).parent().parent().find('.totalPrice').text());
                //修改实际价格
                tempList[index].purchasePrice = realPrice.toFixed(2);
                if (tempList[index].performanceCalc == '1'){
                    if (tempService.purchaseOrgPrice == 0) {
                        tempList[index].achRatio = 0;
                    } else {
                        tempList[index].achRatio = (Number(tempList[index].purchasePrice) / Number(tempList[index].purchaseOrgPrice) * Number(tempList[index].servicePerformance)).toFixed(2);
                    }
                    $(this).parent().siblings().find('.serviceMoney').val(tempList[index].achRatio);
                }
            }
        });
    }
    $('#serviceTable').bootstrapTable('load', tempList);
    changeTotal();
})
//修改合计金额
function changeTotal() {
    var totalMoney = 0;
    $("input[class^='realPrice']").each(function (index) {
        if ($(this).val().length == 1) {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        } else {
            $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            $(this).val($(this).val().replace(/\.{2,}/g, "."));
            $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
        }
        if ($(this).val() !== '') {
            if (index == $("input[class^='realPrice']").length) {
                totalMoney += Number($(this).val());
            } else {
                totalMoney += Number($(this).val());
            }
        }
    });
    $('#totalCount').text(Number(totalMoney).toFixed(2));
    if ($('#countmoney').is(":checked")){ 
        var newsalesNum = $("div[class^='row row-user countRow']").length;
        if (newsalesNum > 0){
            $('#earnMoney').val((totalMoney / (newsalesNum+1)).toFixed(2));
            $("input[class^='input-body earnMoney']").each(function (index) {
                if ($(this).val().length == 1) {
                    $(this).val($(this).val().replace(/[^0-9]/g, ''));
                } else {
                    $(this).val($(this).val().replace(/[^0-9.]/g, ''));
                    $(this).val($(this).val().replace(/\.{2,}/g, "."));
                    $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
                }
                $(this).val((totalMoney / (newsalesNum + 1)).toFixed(2));
            });
        }else{
            $('#earnMoney').val((totalMoney).toFixed(2));
        }
    }
    
}

//切换是否计算业绩
$('#countmoney').click(function () {
    if ($(this).is(":checked")){
        $('.count-money').css('display', 'block');
        var totalCount = Number($('#totalCount').text()) || 0;
        $('#earnMoney').val(totalCount);
    }else{
        rowIndex = 0;
        $('#earnMoney').val(0);
        $('.count-money').css('display','none');
        $('#newSalesMan').html('')
    }
})

//新增销售员工
var rowIndex = 0;
$('#addStaff').click(function () {
    var totalCount = Number($('#totalCount').text()) || 0;
    var number = $("div[class^='row row-user countRow']").length + 2;
    $('#earnMoney').val((totalCount / number).toFixed(2));
    $("input[class^='input-body earnMoney']").each(function (index) {
        if ($(this).val().length == 1) {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        } else {
            $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            $(this).val($(this).val().replace(/\.{2,}/g, "."));
            $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
        }
        $(this).val((totalCount / number).toFixed(2));
    });
    $('#row' + rowIndex + ' .earnMoney').val((totalCount / number).toFixed(2))
    var newStaff = `<div class="row row-user countRow" id="row${rowIndex}">
            <div class="col-xs-3">
                <span class="title-name">销售员工：</span>
                <select class="select-body salesMan">${salesMan}</select>
            </div>
            <div class="col-xs-3">
                <span class="title-name">业绩：</span>
                <input type="text" class="input-body earnMoney" value="${(totalCount / number).toFixed(2)}" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">
            </div>
            <div class="col-xs-3">
                <span class="title-name">辅助员工：</span>
                <select class="select-body supCustomer">${salesSupMan}</select>
            </div>
            <div class="col-xs-2">
                <a href="javascript:;" data-row="${rowIndex}" onclick="deleRow(this)">
                    <img src="../img/delete.png" alt="">
                </a>
            </div>
        </div>`;
    rowIndex++;
    $('#newSalesMan').append(newStaff);
})
//删除销售员工
function deleRow(self) {
    var index = $(self).attr('data-row');
    var totalCount = Number($('#totalCount').text()) || 0;   
    $("#row" + index).remove();
    //更改业绩
    var number = $("div[class^='row row-user countRow']").length;
    if (number > 0) {
        $('#earnMoney').val((totalCount / (number + 1)).toFixed(2));
        $("input[class^='input-body earnMoney']").each(function (index) {
            if ($(this).val().length == 1) {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
                $(this).val($(this).val().replace(/\.{2,}/g, "."));
                $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
            }
            $(this).val((totalCount / (number + 1)).toFixed(2));
        });
    } else {
        $('#earnMoney').val((totalCount).toFixed(2));
    }
}
//获取销售员工
var salesMan = '';
var salesSupMan = `<option class="" value=""> --请选择-- </option>`;
function getsalesman() {
    var cmd = "customer/salesmanList";
    var datas = {
        merchantId: params.merchantId,
        shopId: params.shopId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data) {
                var data = re.data;
                for (var i = 0; i < data.length; i++) {
                    salesMan += `<option class="" value="${data[i].id}">${data[i].username}</option>`;
                    salesSupMan += `<option class="" value="${data[i].id}">${data[i].username}</option>`;
                }
            }
            $('.salesMan').html(salesMan);
            $('.supCustomer').html(salesSupMan);
        } else {
            layer.msg(re.msg);
        }
    })
}

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
/************* 初始化 ******************/
// 业务办理
function serviceInit() {
    $('#serviceTable').bootstrapTable({
        striped: false,
        sortable: false,
        columns: [
            {
                field: 'serviceName', title: '服务卡/服务套餐', align: 'center'
            },
            {
                field: 'purchaseNum', title: '数量', align: 'center',
                formatter: function (val, row, index) {
                    return '<input type="text" data-id="' + row.id + '" class="serviceNum" data-packNumber="' + row.packNumber + '" style="width: 90px;padding: 0 5px;" value="' + val + '" onkeyup="validateNumber(this);"/>';
                }
            },
            {
                field: 'remainNum', title: '剩余次数', align: 'center',
                formatter: function (val, row, index) {
                    if (row.packType == 2 || row.serviceType == 2 || row.packType == 5) {
                        return '不支持';
                    } else {
                        return '<input type="text" data-id="' + row.id + '" class="serviceRemain" style="width: 90px;padding: 0 5px;" value="' + val + '" onkeyup="validateNumber(this);"/>';
                    }
                }
            },
            {
                field: 'discountPrice', title: '单价', align: 'center',
                formatter: function (val, row, index) {
                    return '<span class="unitPrice">' + val + '</span>';
                }
            },
            {
                field: 'achRatio', title: '单次消耗金额', align: 'center',
                formatter: function (val, row, index) {
                    if(row.type == 2){
                        return '<input style="width: 90px;padding: 0 5px;" value="0" disabled="disabled">';
                    }else{
                        return '<input type="text" data-id="' + row.id + '" class="serviceMoney" style="width: 90px;padding: 0 5px;" value="' + val + '" onkeyup="isnum(this);"/>';
                    }
                    
                    // if (row.performanceCalc == 0){
                    //     return '<input type="text" data-id="' + row.id +'" class="serviceMoney" style="width: 90px;padding: 0 5px;" value="'+ val +'" onkeyup="validateNumber(this);"/>';
                    // } else if (row.performanceCalc == 1) {
                    //     if ($("#hasdiscount").is(':checked')) {
                    //         var discount = Number($('#discount').text()) / 10;
                    //         return '<input type="text" data-id="' + row.id +'" class="serviceMoney" style="width: 90px;padding: 0 5px;" value="' + (Number(val) * discount).toFixed(2) + '" onkeyup="validateNumber(this);"/>';
                    //     } else {
                    //         return '<input type="text" data-id="' + row.id +'" class="serviceMoney" style="width: 90px;padding: 0 5px;" value="' + val + '" onkeyup="validateNumber(this);"/>';
                    //     }
                    // }
                }
            },
            {
                field: 'purchaseOrgPrice', title: '总价', align: 'center',
                formatter: function (val, row, index) {
                    return '<span class="totalPrice">' + val + '</span>';
                }
            },
            {
                field: 'purchasePrice', title: '实际价格', align: 'center',
                formatter: function (val, row, index) {
                    return '<input type="text" data-id="' + row.id + '" class="realPrice" style="width: 90px;padding: 0 5px;" value="' + val + '" onkeyup="isnum(this)"/>';
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                formatter: function (val, row, index) {
                    return '<button class="btn btn-warning btn-circle" type="button" onclick="delserviceinfo(\'' + val +'\')"><i class="fa fa-times"></i></button>';
                }
            }
        ]
    });
    $('#serviceTable').bootstrapTable('hideLoading');
}

//去除字母
function validateNumber(self) {
    if (self.value.length == 1) {
        self.value = self.value.replace(/[^1-9]/g, '');
    } else {
        self.value = self.value.replace(/\D/g, '');
    }
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
    var salesmanId = '';
    var salesman = '';
    var fuZhuManIds = '';
    var fuZhuManNames = '';
    var Yejis = '';
    if ($('#countmoney').is(":checked")){
        var achType = 1;
        $("select[class^='select-body salesMan']").each(function (index) {
            if (index == $("select[class^='select-body salesMan']").length){
                salesmanId += $(this).val();
                salesman += $(this).find("option:selected").text();
            }else{
                salesmanId += $(this).val() + ',';
                salesman += $(this).find("option:selected").text() + ',';
            }
        });
        $("select[class^='select-body supCustomer']").each(function (index) {
            if (index == $("select[class^='select-body supCustomer']").length){
                fuZhuManIds += $(this).val();
                if ($(this).val() !== ''){
                    fuZhuManNames += $(this).find("option:selected").text();
                }
            }else{
                fuZhuManIds += $(this).val() + ',';
                if ($(this).val() !== '') {
                    fuZhuManNames += $(this).find("option:selected").text() + ',';
                }
            }
        });
        $("input[class^='input-body earnMoney']").each(function (index) {
            if ($(this).val().length == 1) {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
                $(this).val($(this).val().replace(/\.{2,}/g, "."));
                $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
            }
            if (index == $("input[class^='input-body earnMoney']").length) {
                Yejis += $(this).val();
            } else {
                Yejis += $(this).val() + ',';
            }
        });
    }else{
        var achType = 0;
    }
    var shouldPay = 0;
    $("span[class^='totalPrice']").each(function (index) {
        if ($(this).text().length == 1) {
            $(this).text($(this).text().replace(/[^0-9]/g, ''));
        } else {
            $(this).text($(this).text().replace(/[^0-9.]/g, ''));
            $(this).text($(this).text().replace(/\.{2,}/g, "."));
            $(this).text($(this).text().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
        }
        shouldPay += Number($(this).text());
    });
    var actualPay = Number($('#totalCount').text()) || 0;
    if (shouldPay == actualPay){
        var priceChange = 0;
    }else{
        var priceChange = 1;
    }
    var payType = $('#payType').val();
    var returnDate = {
        serviceCards: tempList,
        merchantId: params.merchantId,
        memberId: params.id,
        userId: params.userId,
        shopId: params.shopId,
        balance: $('#userName').attr('data-balance'),
        purchaseType: $('#userName').attr('data-purchaseType'),
        subaccountId: $('#userName').attr('data-subaccountId'),
        achType: achType,
        salesmanId: salesmanId,
        salesman: salesman,
        fuZhuManIds: fuZhuManIds,
        fuZhuManNames: fuZhuManNames,
        Yejis: Yejis,
        payType: payType,
        principal: $('#principal').text(),
        actualPay: Number($('#totalCount').text()) || 0,
        shouldPay: shouldPay,
        priceChange: priceChange
    };
    return returnDate;
}