var params = '';
var showType = 0;
$(document).ready(function () {
    params = getParams();
    getTotalInfo();
    serviceInit();
    advUserInit();
    // 检验项目
    searchInit();
    historyInit();
    // 检查项目
    searchInit1();
    historyInit1();
    // 治疗项目
    searchInit2();
    historyInit2();
    // 整形项目
    searchInit3();
    historyInit3();
     // 美容项目
     searchInit6();
     historyInit6();
    //西药处方
    medicalTableInit();
    historyMedicalInit();
    //中成药方
    // medicalTableInit1();
    // historyMedicalInit1();
     //地址初始化
     citySelectInit();
     //介绍人初始化
    //  introducerInit();
    //  //咨询项目
    //  serviceInit();
    //  //咨询院长
    //  advUserInit();

});

var nowDate = getSec(new Date(), 5);
//加载咨询项目和咨询院长
var serviceList = '';
function serviceInit() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type : 2
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            $('.service').html('');
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}" data-price="${data[i].price}">${data[i].serviceName}</option>`;
            }
            serviceList = opt;
            $('.service').append(opt);
            $('#service').select2({
                width: '60%'
            });
        } else {
            layer.msg(re.msg);
        }
    })
}
function advUserInit() {
    var cmd = "customer/salesmanList";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            $('.advUser').html('');
            var data = re.data;
            var opt = '<option value="">请选择咨询院长</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}">${data[i].username}</option>`;
            }
            $('.advUser').append(opt);
            // $('#advUser').select2({
            //     width: '60%'
            // });
        } else {
            layer.msg(re.msg);
        }
    })
}

//所有分类列表--------------------------------
laydate.render({
    elem: '#startDate',
    type: 'date',
    value: nowDate,
    done: function (value, date, endDate) {
        var startDate = new Date(value).getTime();
        var endTime = new Date($('#endDate').val()).getTime();
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#startDate').val($('#endDate').val());
        }
    }
});
laydate.render({
    elem: '#endDate',
    type: 'date',
    value: nowDate,
    done: function (value, date, endDate) {
        var startDate = new Date($('#startDate').val()).getTime();
        var endTime = new Date(value).getTime();
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#endDate').val($('#startDate').val());
        }
    }
});

laydate.render({
    elem: '#startTime',
    type: 'datetime',
    min: nowDate
    // value: new Date()
});

$('.title-name').click(function () {
    $('.top-title').find('.title-name').removeClass('active');
    $(this).addClass('active');
    var id = $(this).attr('id');
    $('.table-info').css('display', 'none');
    $('.' + id).css('display', 'block');
    switch (id) {
        case 'waiting':
            $('.waiting>.regist-list').html(getBox(receivedList, 'waiting'));
            break;
        case 'receive':
            $('.receive>.regist-list').html(getBox(isReceivedList, 'receive'));
            break;
        case 'complete':
            $('.complete>.regist-list').html(getBox(receiveCompleteList, 'complete'));
            break;
        default:
            break;
    }
})
$('#backHome').click(function () {
    $('#patientBox').show();
    $('#patientDetail').hide();
    $('.more-info.moreInfo').find('span').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
    $('.show-list').css({'display':'none'});
})
var receivedList = [];
var isReceivedList = [];
var receiveCompleteList = [];
//加载最外层表格
function getTotalInfo() {
    // console.log();
    // var type = $('.title-name.active').text().substring(0,3);
    var memberName = $('#searchName').val().trim();
    var bgTime = $('#startDate').val().trim();
    var edTime = $('#endDate').val().trim();
    var cmd = "medical/getReceptionList";
    var datas = {
        merchantId: params.merchantId,
        userId: params.userId,
        bgTime: bgTime,
        edTime: edTime,
        memberName: memberName,
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;

            var type = $('.title-name.active').text().substring(0,3);

            //等待中
            receivedList = data.receivedList;
            $('#waitingNum').text(receivedList.length);
            $('.waiting>.regist-list').html('');
            $('#waitingList').html('');
            if (receivedList.length > 0){
                var received = '';
                if (receivedList.length <= 3){
                    for (var i = 0; i < receivedList.length; i++) {
                        received += `<div class="patient-box">
                            <span class="patient-name">${receivedList[i].memberName}</span>
                            <button class="btn btn-white patient-btn" onclick="changeToReception(${'\'' + receivedList[i].memberId + '\',\'' + receivedList[i].processId + '\''})">接诊</button>
                        </div>`;
                    }
                }else{
                    for (var i = 0; i < 3; i++) {
                        received += `<div class="patient-box">
                            <span class="patient-name">${receivedList[i].memberName}</span>
                            <button class="btn btn-white patient-btn" onclick="changeToReception(${'\'' + receivedList[i].memberId + '\',\'' + receivedList[i].processId + '\''})">接诊</button>
                        </div>`;
                    }
                }
                $('#waitingList').append(received);
            }
            //接待中
            isReceivedList = data.isReceivedList;
            $('#receiveNum').text(isReceivedList.length);
            $('.receive>.regist-list').html('');
            $('#curingList').html('');
            if (isReceivedList.length > 0) {
                var isReceived = '';
                for (var j = 0; j < isReceivedList.length; j++) {
                    isReceived += `<div class="patient-box">
                        <span class="patient-name">${isReceivedList[j].memberName}</span>
                        <button class="btn btn-white patient-btn" onclick="continueToReceive(${'\'' + isReceivedList[j].memberId + '\',\'' + isReceivedList[j].processId + '\''})">查看</button>
                    </div>`;
                }
                $('#curingList').append(isReceived);
            }
            //接待完成
            receiveCompleteList = data.receiveCompleteList;
            $('#completeNum').text(receiveCompleteList.length);
            $('.complete>.regist-list').html('');
            var type  = $('.top-title>.title-name.active').attr('id');
            switch (type) {
                case 'waiting':
                    $('.waiting>.regist-list').html(getBox(receivedList, 'waiting'));
                    // isReceivedList = [];
                    // receiveCompleteList = [];
                    // $('#receiveNum').text(0);
                    // $('#completeNum').text(0);
                    break;
                case 'receive':
                    $('.receive>.regist-list').html(getBox(isReceivedList, 'receive'));
                    // receivedList = [];
                    // receiveCompleteList = [];
                    // $('#waitingNum').text(0);
                    // $('#completeNum').text(0);
                    break;
                case 'complete':
                    $('.complete>.regist-list').html(getBox(receiveCompleteList, 'complete'));
                    // receivedList = [];
                    // isReceivedList = [];
                    // $('#receiveNum').text(0);
                    // $('#waitingNum').text(0);
                    break;
                default:
                    break;
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
function getBox(data,type) {
    var box = '';
    if(data.length > 0){
        for (var i = 0; i < data.length; i++) {
            switch (data[i].gender) {
                case 0:
                    var gender = '女';
                    break;
                case 1:
                    var gender = '男';
                    break;
                default:
                    var gender = '保密';
                    break;
            }
            box += `<div class="regist-box">
                        <div class="regist-content">
                            <div class="content-line">
                                <b class="patient-name">${data[i].memberName || '-'}</b>
                                <span class="patient-age">${data[i].age || '-'}</span>岁
                                <span class="patient-sex">${gender || '-'}</span>
                            </div>
                            <div class="content-line">咨询项目：
                                <b class="patient-content">${data[i].serviceName || '-'}</b>
                            </div>
                            <div class="content-line">咨询院长：
                                <b class="patient-content">${data[i].advUserName || '-'}</b>
                            </div>
                        </div>`;
            if (type == 'waiting') {
                box += `<div class="btn-list">
                            <a href="javascript:;" onclick="changeToReception(${'\'' + data[i].memberId + '\',\'' + data[i].processId + '\''+ ',\'0\''})" class="receive-btn">接待</a>
                        </div>
                    </div>`;
            } else if (type == 'receive') {
                box += `<div class="btn-list">
                            <a href="javascript:;" onclick="continueToReceive(${'\'' + data[i].memberId + '\',\'' + data[i].processId + '\''+ ',\'0\''})" class="change-btn">继续接待</a>
                            <a href="javascript:;" onclick="completeReceive(${'\''+ data[i].processId + '\''})" class="change-btn">完成接待</a>
                        </div>
                    </div>`;
            } else if (type == 'complete') {
                box += `<div class="btn-list">
                           <a href="javascript:;"  onclick="showReceiveInfo(${'\'' + data[i].memberId + '\',\'' + data[i].processId + '\''+ ',\'1\''})" class="receive-btn">查看</a>
                        </div>
                    </div>`;
            }
        }
    }else{
        box = `<img src="../img/no_data.png" style="width: 100px;margin-left: 43%;margin-top: 16%;">`;
    }   
    return box;
}
//预约下次
$('#reserveNext').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var breTime = $('#reserveTime').val();
    if(!breTime){
        return layer.msg('请选择预约时间')
    }
    var reserveTime = $('#reserveTime').val().trim().substring(0, 16);
    
    if ($("#service option:selected").attr("value")=='') {
        return layer.msg('请选择咨询项目')
    } else {
        var serviceId = $("#service option:selected").attr("value");
        var serviceName = $("#service option:selected").text();
    }
    var cmd = "medical/addBespoke";
    var datas = {
        merchantId: params.merchantId,
        userId: params.userId,
        memberId: memberId,
        bespokeTime: reserveTime,
        serviceId: serviceId,
        serviceName: serviceName
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('#reserveTime').attr('disabled', 'disabled');
            $('#service').attr('disabled', 'disabled');
            $('#reserveNext').attr('disabled', 'disabled');
        } else {
            layer.msg(re.msg);
        }
    })
})
function transAdv() {
    if ($('#advUser').select2("data").length == 0 || $('#advUser').select2("data")[0].id == "") {
        return layer.msg('请选择咨询院长')
    } else {
        var advUserId = $('#advUser').select2("data")[0].id;
        var advUserName = $('#advUser').select2("data")[0].text;
    }
    var memberId = $('#memberName1').attr('memberId');
    var consultingId = $('#memberName1').attr('consultingId');
    var cmd = "medical/modifyAdvUser";
    var datas = {
        memberId: memberId,
        consultingId: consultingId,
        advUserId: advUserId,
        advUserName: advUserName
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('#patientBox').show();
            $('#patientDetail').hide();
            getTotalInfo();
        } else {
            layer.msg(re.msg);
        }
    })
}
//接待顾客
function changeToReception(memberId, processId) {
    $('#completeAll').show();
    showType = 0;
    var cmd = "medical/changeToReception";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            $('#patientBox').hide();
            $('#patientDetail').show();
            clearShow();
            refreshInfo(data[0]);
            $('#layuiTab>.layui-this').click();
            getTotalInfo();
            $('#memberName1').attr('processId', processId);
            $('#memberName1').attr('memberId', memberId);
        } else {
            layer.msg(re.msg);
        }
    })
}
//继续接待顾客
function continueToReceive(memberId, processId) {
    getCategory(memberId)
    $('#completeAll').show();
    showType = 0;
    var cmd = "medical/continueToReceive";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            $('#patientBox').hide();
            $('#patientDetail').show();
            clearShow();
            refreshInfo(data[0]);
            $('#layuiTab>.patient-detail').attr('css','layui-this').click();
            //$('#layuiTab>.layui-this').click();
            getTotalInfo();
            $('#memberName1').attr('processId', processId);
            $('#memberName1').attr('memberId', memberId);
            $('#reception').text('接待中');
        } else {
            layer.msg(re.msg);
        }
    })
}


//继续接待顾客
function showReceiveInfo(memberId, processId) {
    $('#completeAll').hide();
    showType = 1;
    var cmd = "medical/continueToReceive";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            $('#patientBox').hide();
            $('#patientDetail').show();
            clearShow();
            refreshInfo(data[0]);
            $('#layuiTab>.patient-detail').attr('css','layui-this').click();
            //$('#layuiTab>.layui-this').click();
            getTotalInfo();
            $('#memberName1').attr('processId', processId);
            $('#memberName1').attr('memberId', memberId);
            $('#reception').text('已完成');
        } else {
            layer.msg(re.msg);
        }
    })
}

//刷新顾客信息页面
function refreshInfo(data) {
    $('#memberName1').text(data.memberName || '-');
    $('#memberName1').text(data.memberName || '-');
    $('#memberName1').attr('memberId', data.memberId);
    $('#memberName1').attr('consultingId', data.newConsultingInfos.id);
    if (data.allergy.length > 0){
        $('#allergy').show();
    }else{
        $('#allergy').hide();
    }
    switch (data.gender) {
        case 0:
            $('#gender').text('女');
            $('#sex').text('女');
            break;
        case 1:
            $('#gender').text('男');
            $('#sex').text('男');
            break;
        default:
            $('#gender').text('保密');
            $('#sex').text('保密');
            break;
    }
    $('#age').text(data.age || '-');
    $('#age1').text(data.age || '-');
    $('#mobile').text(data.mobile || '-');
    // $('#birthday').text(data.birthday || '-');
    // $('#idNumber').text(data.idNumber || '-');
    // if(data.area || data.city){
    //     $('#address').text(data.area + data.city);
    // }else{
    //     $('#address').text('-');
    // }
    // $('#contacts').text(data.contacts || '-');
    // $('#contactsPhone').text(data.contactsPhone || '-');
    // $('#introducer').text(data.introducer || '-');
    // $('#remark').text(data.remark || '-');
    // $('#allergyInfo').text(data.allergy || '-');
    // $('#allergy2').text(data.allergy || '-');
    // $('#historical').text(data.historical || '-');
    // $('#historical2').text(data.historical || '-');

    //开始
    $("#ageMaster").val(data.age);
    $("#temperature").val(data.temperature);
    if(data.processId){
        $('#processId').val(data.processId)
    }else{
        $('#processId').val('');
    }
    if (data.memberName) {
        $('#memberName').val(data.memberName);
    } else {
        $('#memberName').val('');
    }
    $(".personSex input[value='"+data.gender+"']").attr("checked","checked");
    var radioChecked={
        maritalStatus:data.maritalStatus,
        livingEnvironment:data.livingEnvironment,
        sleepQuality:data.sleepQuality,
        physicalActivity:data.physicalActivity,
        contactLenses:data.contactLenses,
        personalCharacter:data.personalCharacter,
        makeup:data.makeup,
        skinCondition:data.skinCondition,
        healthyState:data.healthyState,
        pregnancy:data.pregnancy,
        menstrualPhysiology:data.menstrualPhysiology,
    }
    //所有单选赋值
    for(var i in radioChecked){
        $("."+i).find("input[value='"+radioChecked[i]+"']").prop("checked","checked");
    }
    //病态复选框赋值
    var morbidityBox=$(".morbidity").find("input[type='checkbox']");
    var pathologicalArr=data.pathological.split(",");
    for(var i=0;i<pathologicalArr.length;i++){
        for(var j=0;j<morbidityBox.length;j++){
           if(pathologicalArr[i]==1){
            $(morbidityBox[i]).prop("checked","checked");
           }
        }
    }
    $("#otherPathological").val(data.otherPathological);
    //美容环境复选框赋值
    var hairdressingBox=$(".hairdressing").find("input[type='checkbox']");
    var hairdressingArr=data.cosmeticEnvironment.split(",");
    for(var i=0;i<hairdressingArr.length;i++){
        for(var j=0;j<hairdressingBox.length;j++){
           if(hairdressingArr[i]==1){
            $(hairdressingBox[i]).prop("checked","checked");
           }
        }
    }
    $("#otherEnvironment").val(data.otherEnvironment);

    //病态和美容环境赋值;
    if(data.dataSource==""){
        $('#dataSource').val([""]).trigger('change');
    }else{
        $('#dataSource').val([data.dataSource]).trigger('change');
    }
    if(data.introducer==""){
        $('#introducer').val([""]);
    }else{
        $('#introducer').val([data.introducer]);
    }
    if(data.dataSource==10 || data.dataSource==9){
        $("#showIntroducer").show();
    }
    $('#memberNameInfo').val(data.memberName);
    $('#removeInfo').css('display','inline-block');
    $("#height").val(data.height);
    $("#weight").val(data.weight);
    $("#bustWaistHips").val(data.bustWaistHips);
    $("#sports").val(data.sports);
    $("#sportPurpose").val(data.sportPurpose);
    if (data.mobile) {
        $('#mobile').val(data.mobile)
    } else {
        $('#mobile').val('');
    }
    $('#mobile').attr('disabled','disabled');
    if (data.gender) {
        $('input:radio[name="sex"][value="' + data.gender +'"]').click();
    }
    $('input:radio[name="sex"]').attr('disabled', 'disabled');
    if (data.birthday) {
        $('#birthday').val(data.birthday)
    } else {
        $('#birthday').val('');
    }
    $('#birthday').attr('disabled', 'disabled');
    var age = String(data.age);
    if (age) {
        $('#age').val(age)
    } else {
        $('#age').val('');
    }
    if (data.idNumber) {
        $('#idNumber').val(data.idNumber)
    } else {
        $('#idNumber').val('');
    }
    $('#idNumber').attr('disabled', 'disabled');
    if (data.cityId) {
        var code = data.cityId.substring(0,2);
        $('#province').val(code);
        citySelectInit(code);
    }
    if (data.city) {
        $('#street').val(data.city);
    }else{
        $('#street').val('');
    }
    if (data.contacts) {
        $('#contact').val(data.contacts);
    }else{
        $('#contact').val('');
    }
    if (data.contactsPhone) {
        $('#contactPhone').val(data.contactsPhone);
    }else{
        $('#contactPhone').val('');
    }
    if (data.remark) {
        $('#remark').val(data.remark);
    }else{
        $('#remark').val('');
    }      
    if(data.allergy.length > 0) {
        $('#allergyPro').val(data.allergy);
        $('input:radio[name="allergy"][value="yes"]').click();
    }else{
        $('#allergyPro').val('');
        $('input:radio[name="allergy"][value="no"]').click();
    }      
    if (data.generalDrugs.length > 0) {
        $('#generalDrugs').val(data.generalDrugs);
        $('input:radio[name="generalDrugs"][value="yes"]').click();
    }else{
        $('#generalDrugs').val('');
        $('input:radio[name="generalDrugs"][value="no"]').click();
    }
    if (data.historical.length > 0) {
        $('#historical').val(data.historical);
        $('input:radio[name="historical"][value="yes"]').click();
    }else{
        $('#historical').val('');
        $('input:radio[name="historical"][value="no"]').click();
    }
    if (data.loseWeight.length > 0) {
        $('#loseWeight').val(data.loseWeight);
        $('input:radio[name="weightHis"][value="yes"]').click();
    }else{
        $('#loseWeight').val('');
        $('input:radio[name="weightHis"][value="no"]').click();
    }
    if (data.reason.length > 0) {
        $('#reason').val(data.reason);
        $('input:radio[name="effect"][value="no"]').click();
    }else{
        $('#reason').val('');
        $('input:radio[name="effect"][value="yes"]').click();
    }
    $("#customInfo input").prop("disabled","disabled");
    $("#customInfo select").prop("disabled","disabled");
    if (data.newConsultingInfos){
        if (data.newConsultingInfos.advUserId) {
            $('#advUserProject').val([data.newConsultingInfos.advUserId]).trigger('change');
        }
        if (data.newConsultingInfos.serviceId) {
            $('#serviceProject').val([data.newConsultingInfos.serviceId]).trigger('change');
        }
    }    
    //结束
    var consultingInfos = data.consultingInfos;
    if (consultingInfos.length > 0) {
        var box = '<div style="overflow:hidden;padding:10px 0;border-bottom:1px solid #ccc;"><span style="float:left;font-size: 16px;line-height: 35px;margin-left: 4px;color:#FF7930;font-weight: bold;">历史信息</span><button class="btn btn-info" style="float: right;margin-right:20px;" onclick="changeHis(this)">收起</button></div><div class="consultHistory his-list">';
        for (var i = 0; i < consultingInfos.length; i++) {
            box += `<div class="card-info consult-history">
                        <div class="table-title">
                            <span class="title-word">历史咨询</span>
                        </div>
                        <div class="input-row">
                            <div class="col-xs-6">
                                <span class="input-name">咨询项目:</span>
                                <span id="">${consultingInfos[i].serviceName || '-'}</span>
                            </div>
                           
                        </div>
                        <div class="input-row" style="margin-top: 30px;">
                            <div class="col-xs-6">
                                <span class="input-name">咨询院长:</span>
                                <span id="">${consultingInfos[i].advUserName || '-'}</span>
                            </div>
                        </div>
                    </div>`;
        }
        $('#consultHistory').html(box);
    }
    if (data.newConsultingInfos !== '') {
        $('#advUserSpan').text(data.newConsultingInfos.advUserName || '-');
        $('#serviceName').text(data.newConsultingInfos.serviceName || '-');
        if (data.newConsultingInfos.serviceId) {
            $('#service1').val([data.newConsultingInfos.serviceId]).trigger('change');
        }
    } 
}

//展开收起
function changeHis(self) {
    var status = $(self).text();
    if (status == '收起') {
        $(self).parent().siblings('.his-list').hide('slow', function () {
            $(self).text('展开');
        });
    } else {
        $(self).parent().siblings('.his-list').show('slow', function () {
            $(self).text('收起');
        });
    }
}

//展开收起
function changeHistor(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#historyList').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#historyList').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//展开收起
function changeHistorTable(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#historyTable').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#historyTable').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//展开收起
function changeHistorTable1(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#historyTable1').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#historyTable1').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//展开收起
function changeHistorTable2(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#historyTable2').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#historyTable2').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//展开收起
function changeHistorTable3(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#historyMedicalTable').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#historyMedicalTable').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//展开收起
function changeHistorTable4(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#historyTable3').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#historyTable3').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//展开收起
// function changeHistorTable4(self) {
//     var status = $(self).find('.open-word').text();
//     if (status == '收起') {
//         $('#historyMedicalTable1').hide('slow', function () {
//             $(self).find('.open-word').text('展开');
//         });
//     } else {
//         $('#historyMedicalTable1').show('slow', function () {
//             $(self).find('.open-word').text('收起');
//         });
//     }
// }

//展开收起
function changeHistorTable5(self) {
    var status = $(self).find('.open-word').text();
    if (status == '收起') {
        $('#adviceList').hide('slow', function () {
            $(self).find('.open-word').text('展开');
        });
    } else {
        $('#adviceList').show('slow', function () {
            $(self).find('.open-word').text('收起');
        });
    }
}

//清空左侧信息
function clearShow() {
    $('#reserveTime').removeAttr('disabled');
    $('#reserveTime').val('');
    $('#service').removeAttr('disabled');
    $('#service').val(['']).trigger('change');
    $('#advUser').val(['']).trigger('change');
    $('#reserveNext').removeAttr('disabled');
}
$('#editBtn').click(function () {
    $(this).attr('disabled','disabled');
    $('#serviceName').hide();
    $('#serviceShow').show();
    $('#editBtnRow').show();
    $('#service1').select2({
        width: '60%'
    });
})
function cancelEdit() {
    $('#editBtn').removeAttr('disabled');
    $('#serviceName').show();
    $('#serviceShow').hide();
    $('#editBtnRow').hide();
}
function changeService() {
    if ($('#service1').select2("data").length == 0 || $('#service1').select2("data")[0].id == "") {
        return layer.msg('请选择咨询项目')
    } else {
        var serviceId = $('#service1').select2("data")[0].id;
        var serviceName = $('#service1').select2("data")[0].text;
    }
    var memberId = $('#memberName1').attr('memberId');
    var consultingId = $('#memberName1').attr('consultingId');
    var cmd = "medical/modifyService";
    var datas = {
        serviceId: serviceId,
        serviceName: serviceName,
        memberId: memberId,
        consultingId: consultingId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('#serviceName').text(serviceName);
            cancelEdit();
        } else {
            layer.msg(re.msg);
        }
    })
}
//个人消息弹出------------------------------
$('.info-box').click(function () {
    console.log(2222222222222222222);
    $("#share").removeAttr("disabled");
    $('.show-list').toggle();
    var upOrDown = $('.info-list .arrow').attr('class');
    if (upOrDown.indexOf('up') == -1) {
        $('.info-list .arrow').removeClass('glyphicon-menu-down');
        $('.info-list .arrow').addClass('glyphicon-menu-up');
    } else {
        $('.info-list .arrow').removeClass('glyphicon-menu-up');
        $('.info-list .arrow').addClass('glyphicon-menu-down');
    }
})
//顾客信息--------------------------------
laydate.render({
    elem: '#reserveTime',
    type: 'datetime',
    min: nowDate
});
//详情弹出
$('#patientInfo .moreInfo').click(function () {
    console.log(111)
    var upOrDown = $('.moreInfo .arrow').attr('class');
    if (upOrDown.indexOf('up') == -1) {
        $('.moreInfo .arrow').removeClass('glyphicon-menu-down');
        $('.moreInfo .arrow').addClass('glyphicon-menu-up');
        $('#patientInfo').css('height', '512px');
    } else {
        $('.moreInfo .arrow').removeClass('glyphicon-menu-up');
        $('.moreInfo .arrow').addClass('glyphicon-menu-down');
        $('#patientInfo').css('height', '190px');
    }
});
//身体信息的详情展开
$(".moreDetail").click(function(){
    var upOrDown = $(this).find('.arrow').attr('class');
    if (upOrDown.indexOf('up') == -1) {
        $('.bodyDetail').removeClass('glyphicon-menu-down');
        $('.bodyDetail').addClass('glyphicon-menu-up');
        $(".body-info").css('height', '650px');
    }else{
        $('.bodyDetail').removeClass('glyphicon-menu-up');
        $('.bodyDetail').addClass('glyphicon-menu-down');
        $(".body-info").css('height', '220px');
    }
})
//门诊病历--------------------------------
// $('.medical-record').click(function () {
//     var memberId = $('#memberName1').attr('memberId');
//     var processId = $('#memberName1').attr('processId');
//     newCheckList0 = [];
//     getMedicalRecord(memberId, processId);
// })
// function getMedicalRecord(memberId, processId) {
//     var cmd = "medical/getMedicalRecordHistory";
//     var datas = {
//         merchantId: params.merchantId,
//         memberId: memberId,
//         processId: processId
//     };
//     ajaxAsync(cmd, datas, function (re) {
//         if (re.code == 1) {
//             var data = re.data;
//             var scMedicalCasesList = data.scMedicalCasesList;
//             $('#allergy2').attr('memberId', memberId)
//             $('#allergy2').attr('processId', processId)
//             if (scMedicalCasesList.length > 0){
//                 $('#allergy2').attr('medicalRecordId', scMedicalCasesList[0].id)
//                 $('#question').val(scMedicalCasesList[0].question || '');
//                 if (scMedicalCasesList[0].bloodPressure !== '') {
//                     $('#lowPressure').val(scMedicalCasesList[0].bloodPressure.split('/')[0]);
//                     $('#highPressure').val(scMedicalCasesList[0].bloodPressure.split('/')[1]);
//                 } else {
//                     $('#lowPressure').val('');
//                     $('#highPressure').val('');
//                 }
//                 $('#temperature').val(scMedicalCasesList[0].temperature || '');
//                 $('#pulse').val(scMedicalCasesList[0].pulse || '');
//                 $('#height').val(scMedicalCasesList[0].height || '');
//                 $('#weight').val(scMedicalCasesList[0].weight || '');
//                 $('#bmi').val(scMedicalCasesList[0].bmi || '');
//                 $('#remark1').val(scMedicalCasesList[0].remark || '');
//                 $('#advOpinion').val(scMedicalCasesList[0].advOpinion);
//             }else{
//                 $('#question').val('');
//                 $('#lowPressure').val('');
//                 $('#highPressure').val('');
//                 $('#temperature').val('');
//                 $('#pulse').val('');
//                 $('#height').val('');
//                 $('#weight').val('');
//                 $('#bmi').val('');
//                 $('#remark1').val('');
//                 $('#advOpinion').val('');
//             }
//             var scMedicalCasesHisList = data.scMedicalCasesHisList;
//             $('#historyList').html('');
//             if (scMedicalCasesHisList.length > 0){
//                 var opt = '';
//                 for (var i = 0; i < scMedicalCasesHisList.length; i++) {
//                     opt +=`<div class="time-title">${scMedicalCasesHisList[i].createTime.substring(0,10) || '无'}</div>
//                             <div class="history-row">
//                                 <span class="input-name">过敏史:</span>
//                                 <span class="info-span">${scMedicalCasesHisList[i].allergy || '无'}</span>
//                             </div>
//                             <div class="history-row">
//                                 <span class="input-name">既往史:</span>
//                                 <span class="info-span">${scMedicalCasesHisList[i].historical || '无'}</span>
//                             </div>
//                             <div class="history-row">
//                                 <span class="input-name">主诉:</span>
//                                 <span class="info-span">${scMedicalCasesHisList[i].question || '无'}</span>
//                             </div>
//                             <div class="history-row">
//                                 <span class="input-name">体格检查:</span>
//                                 <span class="info-span">体温：${scMedicalCasesHisList[i].temperature || '-'} <b class="danwei"> ℃</b>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     血压：${scMedicalCasesHisList[i].bloodPressure || '-'} <b class="danwei"> mmHg</b>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     脉搏：${scMedicalCasesHisList[i].pulse || '-'} <b class="danwei"> bpm</b>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     身高：${scMedicalCasesHisList[i].height || '-'} <b class="danwei"> cm</b>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     体重：${scMedicalCasesHisList[i].weight || '-'}<b class="danwei"> kg</b>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     BMI指数：${scMedicalCasesHisList[i].bmi || '-'}
//                             </div>
//                             <div class="history-row">
//                                 <span class="input-name">其他检查:</span>
//                                 <span class="info-span">${scMedicalCasesHisList[i].remark || '无'}</span>
//                             </div>
//                             <div class="history-row">
//                                 <span class="input-name">咨询意见:</span>
//                                 <span class="info-span">${scMedicalCasesHisList[i].advOpinion || '无'}</span>
//                             </div>`;
//                     if (i !== scMedicalCasesHisList.length-1){
//                         opt +=`<div class="line"></div>`;
//                     }
//                 }
//                 $('#historyList').html(opt);
//             }
//         } else {
//             layer.msg(re.msg);
//         }
//     })
// }

// //监听体温输入框
// $('#temperature').on('input propertychange change', function () {
//     var temperature = $(this).val();
//     temperature = temperature.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(temperature);
// });

// //监听舒张压输入框
// $('#lowPressure').on('input propertychange change', function () {
//     var lowPressure = $(this).val();
//     lowPressure = lowPressure.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(lowPressure);
// });

// //监听舒张压输入框
// $('#highPressure').on('input propertychange change', function () {
//     var temperature = $(this).val();
//     temperature = temperature.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(temperature);
// });

// //监听脉搏输入框
// $('#pulse').on('input propertychange change', function () {
//     var temperature = $(this).val();
//     temperature = temperature.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(temperature);
// });

// //监听身高输入框
// $('#height').on('input propertychange change', function () {
//     var temperature = $(this).val();
//     temperature = temperature.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(temperature);
// });

// //监听体重输入框
// $('#weight').on('input propertychange change', function () {
//     var temperature = $(this).val();
//     temperature = temperature.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(temperature);
// });

// //监听体重输入框
// $('#bmi').on('input propertychange change', function () {
//     var temperature = $(this).val();
//     temperature = temperature.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(temperature);
// });

// function subMedicalRecord() {
//     var medicalRecordId = $('#allergy2').attr('medicalRecordId');
//     var memberId = $('#allergy2').attr('memberId');
//     var processId = $('#allergy2').attr('processId');
//     var question = $('#question').val().trim();
//     var advOpinion = $('#advOpinion').val().trim();
//     var weight = $('#weight').val().trim();
//     var height = $('#height').val().trim();
//     var pulse = $('#pulse').val().trim();
//     var temperature = $('#temperature').val().trim();
//     var BMI = $('#bmi').val().trim();
//     var remark = $('#remark1').val().trim();
//     var bloodPressure = $('#lowPressure').val().trim() + '/' + $('#highPressure').val().trim();
//     var datas = {
//             merchantId: params.merchantId,
//             memberId: memberId,
//             processId: processId,
//             question: question,
//             advOpinion: advOpinion,
//             weight: weight,
//             height: height,
//             pulse: pulse,
//             temperature: temperature,
//             BMI: BMI,
//             remark: remark,
//             bloodPressure: bloodPressure
//         };
//     if (medicalRecordId !== undefined){
//         var cmd = "medical/modifyMedicalRecord";
//         datas.medicalRecordId = medicalRecordId;
//     }else{
//         var cmd = "medical/addMedicalRecord";
//     }       
//     ajaxAsync(cmd, datas, function (re) {
//         if (re.code == 1) {
//             layer.msg(re.msg);
//         } else {
//             layer.msg(re.msg);
//         }
//     })
// }
//检验项目--------------------------------
var serviceList0 = '';
function serviceInit0() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 0
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}" data-price="${data[i].price}">${data[i].serviceName}</option>`;
            }
            serviceList0 = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.check-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    serviceInit0();
    $('#oldPrice1').text('-');
    $('#sellPrice1').text('-');
    $('#realPrice1').text('-');
    newCheckList = [];
    getCheckData(memberId, processId,showType);
})
function getCheckData(memberId, processId,showType) {
    var cmd = "medical/findCheckHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 1
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
           var data =re.data;
            if (data.scPresaleInfos.length !== 0){
                $('#addCheck').hide();
                $('#checkBtn').hide();
                $('#checkList').bootstrapTable('hideColumn', 'id');
                $('#checkList').bootstrapTable('load', data.scPresaleInfos);
                var scPresaleInfos = data.scPresaleInfos;
                var unitPrice = 0.00;
                var realPrice = 0.00;
                for (var i = 0; i < scPresaleInfos.length; i++) {
                    unitPrice += scPresaleInfos[i].unitPrice;
                    realPrice += scPresaleInfos[i].actualPayment;
                }
                $('#oldPrice').text(unitPrice.toFixed(2));
                var sellPrice = unitPrice.toFixed(2) - realPrice.toFixed(2);
                $('#sellPrice').text(sellPrice.toFixed(2));
                $('#realPrice').text(realPrice.toFixed(2));
            }else{
                $('#addCheck').show();
                $('#checkBtn').show();
                $('#oldPrice').text('-');
                $('#sellPrice').text('-');
                $('#realPrice').text('-');
                $('#checkList').bootstrapTable('showColumn', 'id');
                $('#checkList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length >0){
                $('#historyTable').bootstrapTable('load', data.historyPresaleInfos);
            }else{
                $('#historyTable').bootstrapTable('load', []);
            }
            if(showType == 1){
                $('#addCheck').hide();
                $('#checkBtn').hide();
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList = [];
$('#addCheck').click(function () { 
    var isCan = true;
    $("#checkList select[class^='input-body service']").each(function (index, element) {
        if ($(element).val() == '') {
            layer.msg('请选择检验项目！');
            isCan = false;
            return false;
        }      
    });
    if (isCan){
        var data = {
            purchaseName: '',
            serviceId: '',
            remake: '',
            unitPrice: '',
            actualPayment: ''
        };
        newCheckList.push(data);
        $('#checkList').bootstrapTable('load', newCheckList);
    }
    for (var i = 0; i < newCheckList.length-1; i++) {
        $('#serviceCheck' + i).val(newCheckList[i].serviceId);
    }
})
//监听table里项目名称选择
$('#checkList').on('change', '.service', function () {
    var serviceId = $(this).val();
    var purchaseName = $(this).find("option:selected").text();
    var unitPrice = $(this).find("option:selected").attr('data-price');
    if (serviceId == ''){
        layer.msg('请选择项目！');
        return false;
    }

    //获取当前行的index--对应list的index
    var pid = $(this).parents("tr").attr("data-index");

    if (newCheckList.length > 1){
        for (var i = 0; i < newCheckList.length; i++) {
            if (serviceId == newCheckList[i].serviceId) {
                layer.msg('请勿重复添加相同的项目！');
                $(this).val(newCheckList[pid].serviceId);
                return false;
            }
            if (newCheckList[i].serviceId == ''){
                $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                newCheckList[i].purchaseName = purchaseName;
                newCheckList[i].serviceId = serviceId;
                newCheckList[i].unitPrice = unitPrice;
                newCheckList[i].actualPayment = unitPrice;
            }else{
                var id = $(this).parent().siblings().find('.remake').attr('serviceId');
                if (newCheckList[i].serviceId == id) {
                    $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                    newCheckList[i].purchaseName = purchaseName;
                    newCheckList[i].serviceId = serviceId;
                    newCheckList[i].unitPrice = unitPrice;
                    newCheckList[i].actualPayment = unitPrice;
                }
            }
        }
    }else{
        $(this).parent().siblings().find('.remake').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').text(unitPrice);
        $(this).parent().siblings().find('.actualPayment').val(unitPrice);
        $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
        $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
        newCheckList[0].purchaseName = purchaseName;
        newCheckList[0].serviceId = serviceId;
        newCheckList[0].unitPrice = unitPrice;
        newCheckList[0].actualPayment = unitPrice;
    }  
    changeCheckTotal();
});
//监听table里标本输入框
$('#checkList').on('input', '.remake', function () {
    var remake = $(this).val().trim();
    var serviceId = $(this).attr('serviceId');
    if (serviceId == undefined){
        $(this).val('');
        layer.msg('请先选择项目！');
        return false;
    }
    for (var i = 0; i < newCheckList.length; i++) {
        if (newCheckList[i].serviceId == serviceId) {
            newCheckList[i].remake = remake;
        }
    }
});
//监听table里实际价格输入框
$('#checkList').on('change', '.actualPayment', function () {
    var actualPayment = $(this).val().trim();
    var unitPrice = Number($(this).parent().siblings().find('.unitPrice').text());
    var serviceId = $(this).attr('serviceId');
    if (actualPayment.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (actualPayment.length == 0 || isNaN(Number(actualPayment))) {
        layer.msg('请输入有效实际价格！');
        return false;
    } else if (Number(actualPayment) > unitPrice){
        layer.msg('实际价格不能大于原价！');
        $(this).val(unitPrice.toFixed(2));
        changeCheckTotal();
        return false;
    }
    for (var i = 0; i < newCheckList.length; i++) {
        if (newCheckList[i].serviceId == serviceId) {
            newCheckList[i].actualPayment = actualPayment;
        }
    }    
    changeCheckTotal()
});
function changeCheckTotal() {
    var oldPrice = 0.00;
    $("#checkList span[class^='unitPrice']").each(function (index, element) {
        oldPrice += Number($(element).text());
    });
    $('#oldPrice').text(oldPrice.toFixed(2));
    var realPrice = 0.00;
    $("#checkList input[class^='input-body actualPayment']").each(function (index, element) {
        realPrice += Number($(element).val());
    });
    var prePrice = 0.00;
    prePrice = oldPrice - realPrice;
    $('#realPrice').text(realPrice.toFixed(2));
    $('#sellPrice').text(prePrice.toFixed(2));
}
//删除当前行
function deleteCheckRow(index) {
    newCheckList.splice(index, 1);
    $('#checkList').bootstrapTable('load', newCheckList);
    for (var i = 0; i < newCheckList.length; i++) {
        $('#serviceCheck' + i).val(newCheckList[i].serviceId);
    }
    changeCheckTotal();
}
//保存check
function changeCheck() {
    var isCan = true;
    if (newCheckList.length == 0){
        layer.msg('请添加需要检验的项目！');
        isCan = false;
        return false;
    }
    for (var i = 0; i < newCheckList.length; i++) {
        if (newCheckList[i].serviceId == ''){
            layer.msg('请删除未选择项目的条目！');
            isCan = false;
            return false;
        }
        if (newCheckList[i].actualPayment == ''){
            layer.msg('请输入实际金额！');
            isCan = false;
            return false;
        }     
    }
    if (isCan){
        var memberId = $('#memberName1').attr('memberId');
        var processId = $('#memberName1').attr('processId');
        var shouldPay = $('#oldPrice').text();
        var actualPay = $('#realPrice').text();

        var cmd = "medical/addInspectionItems";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            treatments: newCheckList,
            shouldPay: shouldPay,
            actualPay: actualPay
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                $('.check-opt').click();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}
//表格初始化
function searchInit() {
    $('#checkList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '项目名称', width: '20%', align: 'center', formatter:  function(val, row, index) {
                if(row.id){
                    return val;
                }else{
                    return `<select class="input-body service" id="serviceCheck${index}" style="width: auto">${serviceList0}</select>`;

                }
            } 
        },
        {
            field: 'remake', title: '标本', width: '30%', align: 'center', formatter:  function(val, row, index) {
                if (row.id) {
                    return val || '-';
                } else {
                    return `<input class="input-body remake" serviceId="${row.serviceId}" id="remakeCheck${index}" value="${val}" style="width: auto" maxlength="10">`;
                }
            } 
        },
        {
            field: 'unitPrice', title: '原价(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if(val == ''){
                    return `<span class="unitPrice">-</span>`;
                }else{
                    return `<span class="unitPrice" serviceId="${row.serviceId}">${val}</span>`;
                }
                
            }
        },
        {
            field: 'actualPayment', title: '实际价格(元)', width: '20%', align: 'center', formatter:  function(val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" serviceId="${row.serviceId}" id="actualPaymentCheck${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            } 
        },
        {
            field: 'id', title: '操作', width: '30%', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow(${index})">删除</a>`;
            }
        }]
    });
    $('#checkList').bootstrapTable('hideLoading');
}
function historyInit() {
    $('#historyTable').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'purchaseName', title: '项目名称', width: '20%', align: 'center' },
        {
            field: 'remake', title: '标本', width: '50%', align: 'center'
        },
        {
            field: 'actualPayment', title: '实收', width: '20%', align: 'center', formatter: function (val, row, index) {
                return val + '元';
            }
        }]
    });
    $('#historyTable').bootstrapTable('hideLoading');
}
//-----------------------检查项目--------------------------------
var serviceList1 = '';
function serviceInit1() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 1
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}" data-price="${data[i].price}" data-position="${data[i].position || '-'}" data-objective="${data[i].objective || '-'}">${data[i].serviceName}</option>`;
            }
            serviceList1 = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.test-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    serviceInit1();
    $('#oldPrice1').text('-');
    $('#sellPrice1').text('-');
    $('#realPrice1').text('-');
    newCheckList1 = [];
    getTestData(memberId, processId,showType);
})
function getTestData(memberId, processId,showType) {
    var cmd = "medical/findCheckHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 2
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#addTest').hide();
                $('#testBtn').hide();
                $('#testList').bootstrapTable('hideColumn', 'id');
                $('#testList').bootstrapTable('load', data.scPresaleInfos);
                var scPresaleInfos = data.scPresaleInfos;
                var unitPrice = 0.00;
                var realPrice = 0.00;
                for (var i = 0; i < scPresaleInfos.length; i++) {
                    unitPrice += scPresaleInfos[i].unitPrice;
                    realPrice += scPresaleInfos[i].actualPayment;
                }
                $('#oldPrice1').text(unitPrice.toFixed(2));
                var sellPrice = unitPrice.toFixed(2) - realPrice.toFixed(2);
                $('#sellPrice1').text(sellPrice.toFixed(2));
                $('#realPrice1').text(realPrice.toFixed(2));
            } else {
                $('#addTest').show();
                $('#testBtn').show();
                $('#oldPrice1').text('-');
                $('#sellPrice1').text('-');
                $('#realPrice1').text('-');
                $('#testList').bootstrapTable('showColumn', 'id');
                $('#testList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable1').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable1').bootstrapTable('load', []);
            }

            if(showType == 1){
                $('#addTest').hide();
                $('#testBtn').hide();
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList1 = [];
$('#addTest').click(function () {
    var isCan = true;
    $("#testList select[class^='input-body service1']").each(function (index, element) {
        if ($(element).val() == '') {
            layer.msg('请选择检查项目！');
            isCan = false;
            return false;
        }
    });
    if (isCan) {
        var data = {
            purchaseName: '',
            serviceId: '',
            objective: '',
            position: '',
            unitPrice: '',
            actualPayment: ''
        };
        newCheckList1.push(data);
        $('#testList').bootstrapTable('load', newCheckList1);
    }
    for (var i = 0; i < newCheckList1.length - 1; i++) {
        $('#serviceTest' + i).val(newCheckList1[i].serviceId);
    }
})
//监听table里项目名称选择
$('#testList').on('change', '.service1', function () {
    var serviceId = $(this).val();
    var purchaseName = $(this).find("option:selected").text();
    var unitPrice = $(this).find("option:selected").attr('data-price');
    var position = $(this).find("option:selected").attr('data-position');
    var objective = $(this).find("option:selected").attr('data-objective');
    if (serviceId == '') {
        layer.msg('请选择项目！');
        return false;
    }
    //获取当前行的index--对应list的index
    var pid = $(this).parents("tr").attr("data-index");

    if (newCheckList1.length > 1) {
        for (var i = 0; i < newCheckList1.length; i++) {
            if (serviceId == newCheckList1[i].serviceId) {
                layer.msg('请勿重复添加相同的项目！');
                $(this).val(newCheckList1[pid].serviceId);
                return false;
            }
            
            
            if (newCheckList1[i].serviceId == '') {
                $(this).parent().siblings().find('.position').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.objective').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
                $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                $(this).parent().siblings().find('.position').text(position);
                $(this).parent().siblings().find('.objective').text(objective);
                $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId);
                $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                newCheckList1[i].purchaseName = purchaseName;
                newCheckList1[i].serviceId = serviceId;
                newCheckList1[i].unitPrice = unitPrice;
                newCheckList1[i].actualPayment = unitPrice;
                newCheckList1[i].position = position;
                newCheckList1[i].objective = objective;
            } else {
                var id = $(this).parent().siblings().find('.position').attr('serviceId');
                if (newCheckList1[i].serviceId == id) {
                    $(this).parent().siblings().find('.position').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.objective').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
                    $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                    $(this).parent().siblings().find('.position').text(position);
                    $(this).parent().siblings().find('.objective').text(objective);
                    $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId);
                    $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                    newCheckList1[i].purchaseName = purchaseName;
                    newCheckList1[i].serviceId = serviceId;
                    newCheckList1[i].unitPrice = unitPrice;
                    newCheckList1[i].actualPayment = unitPrice;
                    newCheckList1[i].position = position;
                    newCheckList1[i].objective = objective;
                }
            }
        }
        
    } else {
        $(this).parent().siblings().find('.position').attr('serviceId', serviceId)
        $(this).parent().siblings().find('.objective').attr('serviceId', serviceId)
        $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').text(unitPrice);
        $(this).parent().siblings().find('.position').text(position);
        $(this).parent().siblings().find('.objective').text(objective);
        $(this).parent().siblings().find('.actualPayment').val(unitPrice);
        $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
        newCheckList1[0].purchaseName = purchaseName;
        newCheckList1[0].serviceId = serviceId;
        newCheckList1[0].unitPrice = unitPrice;
        newCheckList1[0].actualPayment = unitPrice;
        newCheckList1[0].position = position;
        newCheckList1[0].objective = objective;
    }
    changeCheckTotal1();
});
//监听table里实际价格输入框
$('#testList').on('input', '.actualPayment', function () {
    var actualPayment = $(this).val().trim();
    var unitPrice = Number($(this).parent().siblings().find('.unitPrice').text());
    var serviceId = $(this).attr('serviceId');
    if (actualPayment.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (actualPayment.length == 0 || isNaN(Number(actualPayment))) {
        layer.msg('请输入有效实际价格！');
        return false;
    } else if (Number(actualPayment) > unitPrice) {
        layer.msg('实际价格不能大于原价！');
        $(this).val(unitPrice.toFixed(2));
        changeCheckTotal1();
        return false;
    }
    for (var i = 0; i < newCheckList1.length; i++) {
        if (newCheckList1[i].serviceId == serviceId) {
            newCheckList1[i].actualPayment = actualPayment;
        }
    }
    changeCheckTotal1()
});
function changeCheckTotal1() {
    var oldPrice = 0.00;
    $("#testList span[class^='unitPrice']").each(function (index, element) {
        oldPrice += Number($(element).text());
    });
    $('#oldPrice1').text(oldPrice.toFixed(2));
    var realPrice = 0.00;
    $("#testList input[class^='input-body actualPayment']").each(function (index, element) {
        realPrice += Number($(element).val());
    });
    var prePrice = 0.00;
    prePrice = oldPrice - realPrice;
    $('#realPrice1').text(realPrice.toFixed(2));
    $('#sellPrice1').text(prePrice.toFixed(2));
}
//删除当前行
function deleteCheckRow1(index) {
    newCheckList1.splice(index, 1);
    $('#testList').bootstrapTable('load', newCheckList1);
    for (var i = 0; i < newCheckList1.length; i++) {
        $('#serviceTest' + i).val(newCheckList1[i].serviceId);
    }
    changeCheckTotal1();
}
//保存test
function changeTest() {
    var isCan = true;
    if (newCheckList1.length == 0) {
        layer.msg('请添加需要检验的项目！');
        isCan = false;
        return false;
    }
    for (var i = 0; i < newCheckList1.length; i++) {
        if (newCheckList1[i].serviceId == '') {
            layer.msg('请删除未选择项目的条目！');
            isCan = false;
            return false;
        }
        if (newCheckList1[i].actualPayment == '') {
            layer.msg('请输入实际金额！');
            isCan = false;
            return false;
        }
    }
    if (isCan) {
        var memberId = $('#memberName1').attr('memberId');
        var processId = $('#memberName1').attr('processId');
        var shouldPay = $('#oldPrice1').text();
        var actualPay = $('#realPrice1').text();

        var cmd = "medical/addCheckItems";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            treatments: newCheckList1,
            shouldPay: shouldPay,
            actualPay: actualPay
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                $('.test-opt').click();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}
//表格初始化
function searchInit1() {
    $('#testList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '项目名称', align: 'center',width: '16%', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service1" id="serviceTest${index}" style="width: auto">${serviceList1}</select>`;
                }
            }
        },
        {
            field: 'position', title: '部位', align: 'center',width: '16%', formatter: function (val, row, index) {
                if (val == '' || val == undefined) {
                    return `<span class="position">-</span>`;
                } else {
                    return `<span class="position" serviceId="${row.serviceId}">${val}</span>`;
                }
            }
        },
        {
            field: 'objective', title: '检查目的', align: 'center',width: '16%', formatter: function (val, row, index) {
                if (val == '' || val == undefined) {
                    return `<span class="objective">-</span>`;
                } else {
                    return `<span class="objective" serviceId="${row.serviceId}">${val}</span>`;
                }
            }
        },
        {
            field: 'unitPrice', title: '原价(元)', align: 'center',width: '16%', formatter: function (val, row, index) {
                if (val == '') {
                    return `<span class="unitPrice">-</span>`;
                } else {
                    return `<span class="unitPrice" serviceId="${row.serviceId}">${val}</span>`;
                }

            }
        },
        {
            field: 'actualPayment', title: '实际价格(元)', align: 'center',width: '16%', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" serviceId="${row.serviceId}" id="actualPaymentCheck${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            }
        },
        {
            field: 'id', title: '操作', align: 'center',width: '16%', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow1(${index})">删除</a>`;
            }
        }]
    });
    $('#testList').bootstrapTable('hideLoading');
}
function historyInit1() {
    $('#historyTable1').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'purchaseName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'position', title: '部位', width: '20%', align: 'center'
            },
            {
                field: 'objective', title: '检查目的', width: '40%', align: 'center'
            },
            {
                field: 'actualPayment', title: '实收', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            }]
    });
    $('#historyTable1').bootstrapTable('hideLoading');
}
//-------------------------治疗项目--------------------------------
var serviceList2 = '';
function serviceInit2() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 2
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}" data-price="${data[i].price}">${data[i].serviceName}</option>`;
            }
            serviceList2 = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.treat-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    serviceInit2();
    $('#oldPrice2').text('-');
    $('#sellPrice2').text('-');
    $('#realPrice2').text('-');
    newCheckList2 = [];
    getTreatData(memberId, processId,showType);
})
function getTreatData(memberId, processId,showType) {
    var cmd = "medical/findCheckHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 3
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#addTreat').hide();
                $('#treatBtn').hide();
                $('#treatList').bootstrapTable('hideColumn', 'id');
                $('#treatList').bootstrapTable('load', data.scPresaleInfos);
                var scPresaleInfos = data.scPresaleInfos;
                var unitPrice = 0.00;
                var realPrice = 0.00;
                for (var i = 0; i < scPresaleInfos.length; i++) {
                    unitPrice += scPresaleInfos[i].unitPrice;
                    realPrice += scPresaleInfos[i].actualPayment;
                }
                $('#oldPrice2').text(unitPrice.toFixed(2));
                var sellPrice = unitPrice.toFixed(2) - realPrice.toFixed(2);
                $('#sellPrice2').text(sellPrice.toFixed(2));
                $('#realPrice2').text(realPrice.toFixed(2));
            } else {
                $('#addTreat').show();
                $('#treatBtn').show();
                $('#oldPrice2').text('-');
                $('#sellPrice2').text('-');
                $('#realPrice2').text('-');
                $('#treatList').bootstrapTable('showColumn', 'id');
                $('#treatList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable2').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable2').bootstrapTable('load', []);
            }
            if(showType == 1) {
                $('#addTreat').hide();
                $('#treatBtn').hide();
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList2 = [];
$('#addTreat').click(function () {
    var isCan = true;
    $("#treatList select[class^='input-body service2']").each(function (index, element) {
        if ($(element).val() == '') {
            layer.msg('请选择治疗项目');
            isCan = false;
            return false;
        }
    });
    if (isCan) {
        var data = {
            purchaseName: '',
            serviceId: '',
            remake: '',
            unitPrice: '',
            actualPayment: ''
        };
        newCheckList2.push(data);
        $('#treatList').bootstrapTable('load', newCheckList2);
    }
    for (var i = 0; i < newCheckList2.length - 1; i++) {
        $('#serviceTreat' + i).val(newCheckList2[i].serviceId);
    }
})
//监听table里项目名称选择
$('#treatList').on('change', '.service2', function () {
    var serviceId = $(this).val();
    var purchaseName = $(this).find("option:selected").text();
    var unitPrice = $(this).find("option:selected").attr('data-price');
    if (serviceId == '') {
        layer.msg('请选择项目！');
        return false;
    }

    //获取当前行的index--对应list的index
    var pid = $(this).parents("tr").attr("data-index");

    if (newCheckList2.length > 1) {
        for (var i = 0; i < newCheckList2.length; i++) {
            if (serviceId == newCheckList2[i].serviceId) {
                layer.msg('请勿重复添加相同的项目！');
                $(this).val(newCheckList2[pid].serviceId);
                return false;
            }
            if (newCheckList2[i].serviceId == '') {
                $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                newCheckList2[i].purchaseName = purchaseName;
                newCheckList2[i].serviceId = serviceId;
                newCheckList2[i].unitPrice = unitPrice;
                newCheckList2[i].actualPayment = unitPrice;
            } else {
                var id = $(this).parent().siblings().find('.remake').attr('serviceId');
                if (newCheckList2[i].serviceId == id) {
                    $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                    newCheckList2[i].purchaseName = purchaseName;
                    newCheckList2[i].serviceId = serviceId;
                    newCheckList2[i].unitPrice = unitPrice;
                    newCheckList2[i].actualPayment = unitPrice;
                }
            }
        }
    } else {
        $(this).parent().siblings().find('.remake').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').text(unitPrice);
        $(this).parent().siblings().find('.actualPayment').val(unitPrice);
        $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
        $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
        newCheckList2[0].purchaseName = purchaseName;
        newCheckList2[0].serviceId = serviceId;
        newCheckList2[0].unitPrice = unitPrice;
        newCheckList2[0].actualPayment = unitPrice;
    }
    changeCheckTotal2();
});
//监听table里标本输入框
$('#treatList').on('input', '.remake', function () {
    var remake = $(this).val().trim();
    var serviceId = $(this).attr('serviceId');
    if (serviceId == undefined) {
        $(this).val('');
        layer.msg('请先选择项目！');
        return false;
    }
    for (var i = 0; i < newCheckList2.length; i++) {
        if (newCheckList2[i].serviceId == serviceId) {
            newCheckList2[i].remake = remake;
        }
    }
});
//监听table里实际价格输入框
$('#treatList').on('input', '.actualPayment', function () {
    var actualPayment = $(this).val().trim();
    var unitPrice = Number($(this).parent().siblings().find('.unitPrice').text());
    var serviceId = $(this).attr('serviceId');
    if (actualPayment.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (actualPayment.length == 0 || isNaN(Number(actualPayment))) {
        layer.msg('请输入有效实际价格！');
        return false;
    } else if (Number(actualPayment) > unitPrice) {
        layer.msg('实际价格不能大于原价！');
        $(this).val(unitPrice.toFixed(2));
        changeCheckTotal2();
        return false;
    }
    for (var i = 0; i < newCheckList2.length; i++) {
        if (newCheckList2[i].serviceId == serviceId) {
            newCheckList2[i].actualPayment = actualPayment;
        }
    }
    changeCheckTotal2()
});
function changeCheckTotal2() {
    var oldPrice = 0.00;
    $("#treatList span[class^='unitPrice']").each(function (index, element) {
        oldPrice += Number($(element).text());
    });
    $('#oldPrice2').text(oldPrice.toFixed(2));
    var realPrice = 0.00;
    $("#treatList input[class^='input-body actualPayment']").each(function (index, element) {
        realPrice += Number($(element).val());
    });
    var prePrice = 0.00;
    prePrice = oldPrice - realPrice;
    $('#realPrice2').text(realPrice.toFixed(2));
    $('#sellPrice2').text(prePrice.toFixed(2));
}
//删除当前行
function deleteCheckRow2(index) {
    newCheckList2.splice(index, 1);
    $('#treatList').bootstrapTable('load', newCheckList2);
    for (var i = 0; i < newCheckList2.length; i++) {
        $('#serviceTreat' + i).val(newCheckList2[i].serviceId);
    }
    changeCheckTotal2();
}
//保存treat
function changeTreat() {
    var isCan = true;
    if (newCheckList2.length == 0) {
        layer.msg('请添加需要检验的项目！');
        isCan = false;
        return false;
    }
    for (var i = 0; i < newCheckList2.length; i++) {
        if (newCheckList2[i].serviceId == '') {
            layer.msg('请删除未选择项目的条目！');
            isCan = false;
            return false;
        }
        if (newCheckList2[i].actualPayment == '') {
            layer.msg('请输入实际金额！');
            isCan = false;
            return false;
        }
    }
    if (isCan) {
        var memberId = $('#memberName1').attr('memberId');
        var processId = $('#memberName1').attr('processId');
        var shouldPay = $('#oldPrice2').text();
        var actualPay = $('#realPrice2').text();

        var cmd = "medical/addTreatmentItems";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            treatments: newCheckList2,
            shouldPay: shouldPay,
            actualPay: actualPay
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                $('.treat-opt').click();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}
//表格初始化
function searchInit2() {
    $('#treatList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '项目名称', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service2" id="serviceTreat${index}" style="width: auto">${serviceList2}</select>`;

                }
            }
        },
        {
            field: 'remake', title: '备注', width: '30%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body remake" serviceId="${row.serviceId}" id="remakeCheck${index}" value="${val}" style="width: auto" maxlength="16">`;
                }
            }
        },
        {
            field: 'unitPrice', title: '原价(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (val == '') {
                    return `<span class="unitPrice">-</span>`;
                } else {
                    return `<span class="unitPrice" serviceId="${row.serviceId}">${val}</span>`;
                }

            }
        },
        {
            field: 'actualPayment', title: '实际价格(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" serviceId="${row.serviceId}" id="actualPaymentCheck${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            }
        },
        {
            field: 'id', title: '操作', width: '30%', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow2(${index})">删除</a>`;
            }
        }]
    });
    $('#treatList').bootstrapTable('hideLoading');
}
function historyInit2() {
    $('#historyTable2').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'purchaseName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'remake', title: '备注', width: '60%', align: 'center'
            },
            {
                field: 'actualPayment', title: '实收', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            }]
    });
    $('#historyTable2').bootstrapTable('hideLoading');
}
//-------------------------整形项目--------------------------------
var serviceList3 = '';
function serviceInit3() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 3
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}" data-price="${data[i].price}">${data[i].serviceName}</option>`;
            }
            serviceList3 = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.cosmetology-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    serviceInit3();
    $('#oldPrice3').text('-');
    $('#sellPrice3').text('-');
    $('#realPrice3').text('-');
    $('#startTime').val('');
    newCheckList5 = [];
    getCosmetologyData(memberId, processId,showType);
})
function getCosmetologyData(memberId, processId,showType) {
    var cmd = "medical/findCheckHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 4
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#addCosmetology').hide();
                $('#cosmetologyBtn').hide();
                $('#cosmetologyList').bootstrapTable('hideColumn', 'id');
                $('#cosmetologyList').bootstrapTable('load', data.scPresaleInfos);
                var scPresaleInfos = data.scPresaleInfos;
                var unitPrice = 0.00;
                var realPrice = 0.00;
                for (var i = 0; i < scPresaleInfos.length; i++) {
                    unitPrice += scPresaleInfos[i].unitPrice;
                    realPrice += scPresaleInfos[i].actualPayment;
                }
                $('#startTime').val(scPresaleInfos[0].startTime);
                $('#startTime').attr('disabled','disabled');
                $('#oldPrice3').text(unitPrice.toFixed(2));
                var sellPrice = unitPrice.toFixed(2) - realPrice.toFixed(2);
                $('#sellPrice3').text(sellPrice.toFixed(2));
                $('#realPrice3').text(realPrice.toFixed(2));
            } else {
                $('#addCosmetology').show();
                $('#cosmetologyBtn').show();
                $('#startTime').removeAttr('disabled');
                $('#oldPrice3').text('-');
                $('#sellPrice3').text('-');
                $('#realPrice3').text('-');
                $('#cosmetologyList').bootstrapTable('showColumn', 'id');
                $('#cosmetologyList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable3').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable3').bootstrapTable('load', []);
            }
            if(showType == 1) {
                $('#addCosmetology').hide();
                $('#cosmetologyBtn').hide();
                $('#startTime').attr('disabled','disabled');
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList5 = [];
$('#addCosmetology').click(function () {
    var isCan = true;
    $("#cosmetologyList select[class^='input-body service2']").each(function (index, element) {
        if ($(element).val() == '') {
            layer.msg('请选择整形项目');
            isCan = false;
            return false;
        }
    });
    if (isCan) {
        var data = {
            purchaseName: '',
            serviceId: '',
            remake: '',
            unitPrice: '',
            actualPayment: ''
        };
        newCheckList5.push(data);
        $('#cosmetologyList').bootstrapTable('load', newCheckList5);
    }
    for (var i = 0; i < newCheckList5.length - 1; i++) {
        $('#serviCecosmetology' + i).val(newCheckList5[i].serviceId);
    }
})
//监听table里项目名称选择
$('#cosmetologyList').on('change', '.service2', function () {
    var serviceId = $(this).val();
    var purchaseName = $(this).find("option:selected").text();
    var unitPrice = $(this).find("option:selected").attr('data-price');
    if (serviceId == '') {
        layer.msg('请选择项目！');
        return false;
    }

    //获取当前行的index--对应list的index
    var pid = $(this).parents("tr").attr("data-index");

    if (newCheckList5.length > 1) {
        for (var i = 0; i < newCheckList5.length; i++) {
            if (serviceId == newCheckList5[i].serviceId) {
                layer.msg('请勿重复添加相同的项目！');
                $(this).val(newCheckList5[pid].serviceId);
                return false;
            }
            if (newCheckList5[i].serviceId == '') {
                $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                newCheckList5[i].purchaseName = purchaseName;
                newCheckList5[i].serviceId = serviceId;
                newCheckList5[i].unitPrice = unitPrice;
                newCheckList5[i].actualPayment = unitPrice;
            } else {
                var id = $(this).parent().siblings().find('.remake').attr('serviceId');
                if (newCheckList5[i].serviceId == id) {
                    $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                    newCheckList5[i].purchaseName = purchaseName;
                    newCheckList5[i].serviceId = serviceId;
                    newCheckList5[i].unitPrice = unitPrice;
                    newCheckList5[i].actualPayment = unitPrice;
                }
            }
        }
    } else {
        $(this).parent().siblings().find('.remake').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').text(unitPrice);
        $(this).parent().siblings().find('.actualPayment').val(unitPrice);
        $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
        $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
        newCheckList5[0].purchaseName = purchaseName;
        newCheckList5[0].serviceId = serviceId;
        newCheckList5[0].unitPrice = unitPrice;
        newCheckList5[0].actualPayment = unitPrice;
    }
    changeCheckTotal5();
});
//监听table里标本输入框
$('#cosmetologyList').on('input', '.remake', function () {
    var remake = $(this).val().trim();
    var serviceId = $(this).attr('serviceId');
    if (serviceId == undefined) {
        $(this).val('');
        layer.msg('请先选择项目！');
        return false;
    }
    for (var i = 0; i < newCheckList5.length; i++) {
        if (newCheckList5[i].serviceId == serviceId) {
            newCheckList5[i].remake = remake;
        }
    }
});
//监听table里实际价格输入框
$('#cosmetologyList').on('input', '.actualPayment', function () {
    var actualPayment = $(this).val().trim();
    var unitPrice = Number($(this).parent().siblings().find('.unitPrice').text());
    var serviceId = $(this).attr('serviceId');
    if (actualPayment.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (actualPayment.length == 0 || isNaN(Number(actualPayment))) {
        layer.msg('请输入有效实际价格！');
        return false;
    } else if (Number(actualPayment) > unitPrice) {
        layer.msg('实际价格不能大于原价！');
        $(this).val(unitPrice.toFixed(2));
        changeCheckTotal5();
        return false;
    }
    for (var i = 0; i < newCheckList5.length; i++) {
        if (newCheckList5[i].serviceId == serviceId) {
            newCheckList5[i].actualPayment = actualPayment;
        }
    }
    changeCheckTotal5()
});
function changeCheckTotal5() {
    var oldPrice = 0.00;
    $("#cosmetologyList span[class^='unitPrice']").each(function (index, element) {
        oldPrice += Number($(element).text());
    });
    $('#oldPrice3').text(oldPrice.toFixed(2));
    var realPrice = 0.00;
    $("#cosmetologyList input[class^='input-body actualPayment']").each(function (index, element) {
        realPrice += Number($(element).val());
    });
    var prePrice = 0.00;
    prePrice = oldPrice - realPrice;
    $('#realPrice3').text(realPrice.toFixed(2));
    $('#sellPrice3').text(prePrice.toFixed(2));
}
//删除当前行
function deleteCheckRow5(index) {
    newCheckList5.splice(index, 1);
    $('#cosmetologyList').bootstrapTable('load', newCheckList5);
    for (var i = 0; i < newCheckList5.length; i++) {
        $('#serviCecosmetology' + i).val(newCheckList5[i].serviceId);
    }
    changeCheckTotal5();
}
//保存treat
function changeCosmetology() {
    var isCan = true;
    if (newCheckList5.length == 0) {
        layer.msg('请添加需要检验的项目！');
        isCan = false;
        return false;
    }
    for (var i = 0; i < newCheckList5.length; i++) {
        if (newCheckList5[i].serviceId == '') {
            layer.msg('请删除未选择项目的条目！');
            isCan = false;
            return false;
        }
        if (newCheckList5[i].actualPayment == '') {
            layer.msg('请输入实际金额！');
            isCan = false;
            return false;
        }
    }
    if(!$('#startTime').val()){
        layer.msg('请输入手术时间！');
        return false;
    }
    if (isCan) {
        var memberId = $('#memberName1').attr('memberId');
        var processId = $('#memberName1').attr('processId');
        var shouldPay = $('#oldPrice3').text();
        var actualPay = $('#realPrice3').text();
        var startTime = $('#startTime').val();

        var cmd = "medical/addTreatmentItems";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            treatments: newCheckList5,
            shouldPay: shouldPay,
            actualPay: actualPay,
            type:1,
            startTime:startTime
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                $('.cosmetology-opt').click();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}
//表格初始化
function searchInit3() {
    $('#cosmetologyList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '项目名称', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service2" id="serviCecosmetology${index}" style="width: auto">${serviceList3}</select>`;

                }
            }
        },
        {
            field: 'remake', title: '备注', width: '30%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body remake" serviceId="${row.serviceId}" id="remakeCheck${index}" value="${val}" style="width: auto" maxlength="16">`;
                }
            }
        },
        {
            field: 'unitPrice', title: '原价(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (val == '') {
                    return `<span class="unitPrice">-</span>`;
                } else {
                    return `<span class="unitPrice" serviceId="${row.serviceId}">${val}</span>`;
                }

            }
        },
        {
            field: 'actualPayment', title: '实际价格(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" serviceId="${row.serviceId}" id="actualPaymentCheck${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            }
        },
        {
            field: 'id', title: '操作', width: '30%', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow5(${index})">删除</a>`;
            }
        }]
    });
    $('#cosmetologyList').bootstrapTable('hideLoading');
}
function historyInit3() {
    $('#historyTable3').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'purchaseName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'remake', title: '备注', width: '30%', align: 'center'
            },
            {
                field: 'actualPayment', title: '实收', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            }]
    });
    $('#historyTable3').bootstrapTable('hideLoading');
}
//-------------------------生活美容--------------------------------
var serviceList6 = '';
function serviceInit6() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 5
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            var opt = '<option value="">请选择美容项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}" data-price="${data[i].price}">${data[i].serviceName}</option>`;
            }
            serviceList6 = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.livBeauty-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    serviceInit6();
    $('#oldPrice6').text('-');
    $('#sellPrice6').text('-');
    $('#realPrice6').text('-');
    newCheckList6 = [];
    getLivBeautyData(memberId, processId,showType);
})
function getLivBeautyData(memberId, processId,showType) {
    var cmd = "medical/findCheckHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 7
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#addLivBeauty').hide();
                $('#livBeautyBtn').hide();
                $('#livBeautyList').bootstrapTable('hideColumn', 'id');
                $('#livBeautyList').bootstrapTable('load', data.scPresaleInfos);
                var scPresaleInfos = data.scPresaleInfos;
                var unitPrice = 0.00;
                var realPrice = 0.00;
                for (var i = 0; i < scPresaleInfos.length; i++) {
                    unitPrice += scPresaleInfos[i].unitPrice;
                    realPrice += scPresaleInfos[i].actualPayment;
                }
                $('#oldPrice6').text(unitPrice.toFixed(2));
                var sellPrice = unitPrice.toFixed(2) - realPrice.toFixed(2);
                $('#sellPrice6').text(sellPrice.toFixed(2));
                $('#realPrice6').text(realPrice.toFixed(2));
            } else {
                $('#addLivBeauty').show();
                $('#livBeautyBtn').show();
                $('#oldPrice6').text('-');
                $('#sellPrice6').text('-');
                $('#realPrice6').text('-');
                $('#livBeautyList').bootstrapTable('showColumn', 'id');
                $('#livBeautyList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable6').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable6').bootstrapTable('load', []);
            }
            if(showType == 1) {
                $('#addLivBeauty').hide();
                $('#livBeautyBtn').hide();
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList6 = [];
$('#addLivBeauty').click(function () {
    var isCan = true;
    $("#livBeautyList select[class^='input-body service2']").each(function (index, element) {
        if ($(element).val() == '') {
            layer.msg('请选择治疗项目');
            isCan = false;
            return false;
        }
    });
    if (isCan) {
        var data = {
            purchaseName: '',
            serviceId: '',
            remake: '',
            unitPrice: '',
            actualPayment: ''
        };
        newCheckList6.push(data);
        $('#livBeautyList').bootstrapTable('load', newCheckList6);
    }
    for (var i = 0; i < newCheckList6.length - 1; i++) {
        $('#serviceLivBeauty' + i).val(newCheckList6[i].serviceId);
    }
})
//监听table里项目名称选择
$('#livBeautyList').on('change', '.service2', function () {
    var serviceId = $(this).val();
    var purchaseName = $(this).find("option:selected").text();
    var unitPrice = $(this).find("option:selected").attr('data-price');
    if (serviceId == '') {
        layer.msg('请选择项目！');
        return false;
    }

    //获取当前行的index--对应list的index
    var pid = $(this).parents("tr").attr("data-index");

    if (newCheckList6.length > 1) {
        for (var i = 0; i < newCheckList6.length; i++) {
            if (serviceId == newCheckList6[i].serviceId) {
                layer.msg('请勿重复添加相同的项目！');
                $(this).val(newCheckList6[pid].serviceId);
                return false;
            }
            if (newCheckList6[i].serviceId == '') {
                $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                newCheckList6[i].purchaseName = purchaseName;
                newCheckList6[i].serviceId = serviceId;
                newCheckList6[i].unitPrice = unitPrice;
                newCheckList6[i].actualPayment = unitPrice;
            } else {
                var id = $(this).parent().siblings().find('.remake').attr('serviceId');
                if (newCheckList6[i].serviceId == id) {
                    $(this).parent().siblings().find('.remake').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
                    $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
                    newCheckList6[i].purchaseName = purchaseName;
                    newCheckList6[i].serviceId = serviceId;
                    newCheckList6[i].unitPrice = unitPrice;
                    newCheckList6[i].actualPayment = unitPrice;
                }
            }
        }
    } else {
        $(this).parent().siblings().find('.remake').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').attr('serviceId', serviceId);
        $(this).parent().siblings().find('.unitPrice').text(unitPrice);
        $(this).parent().siblings().find('.actualPayment').val(unitPrice);
        $(this).parent().siblings().find('.actualPayment').attr('serviceId', serviceId)
        $(this).parent().siblings().find('.deleteCheckRow').attr('serviceId', serviceId);
        newCheckList6[0].purchaseName = purchaseName;
        newCheckList6[0].serviceId = serviceId;
        newCheckList6[0].unitPrice = unitPrice;
        newCheckList6[0].actualPayment = unitPrice;
    }
    changeCheckTotal6();
});
//监听table里标本输入框
$('#livBeautyList').on('input', '.remake', function () {
    var remake = $(this).val().trim();
    var serviceId = $(this).attr('serviceId');
    if (serviceId == undefined) {
        $(this).val('');
        layer.msg('请先选择项目！');
        return false;
    }
    for (var i = 0; i < newCheckList6.length; i++) {
        if (newCheckList6[i].serviceId == serviceId) {
            newCheckList6[i].remake = remake;
        }
    }
});
//监听table里实际价格输入框
$('#livBeautyList').on('input', '.actualPayment', function () {
    var actualPayment = $(this).val().trim();
    var unitPrice = Number($(this).parent().siblings().find('.unitPrice').text());
    var serviceId = $(this).attr('serviceId');
    if (actualPayment.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (actualPayment.length == 0 || isNaN(Number(actualPayment))) {
        layer.msg('请输入有效实际价格！');
        return false;
    } else if (Number(actualPayment) > unitPrice) {
        layer.msg('实际价格不能大于原价！');
        $(this).val(unitPrice.toFixed(2));
        changeCheckTotal6();
        return false;
    }
    for (var i = 0; i < newCheckList6.length; i++) {
        if (newCheckList6[i].serviceId == serviceId) {
            newCheckList6[i].actualPayment = actualPayment;
        }
    }
    changeCheckTotal6()
});
function changeCheckTotal6() {
    var oldPrice = 0.00;
    $("#livBeautyList span[class^='unitPrice']").each(function (index, element) {
        oldPrice += Number($(element).text());
    });
    $('#oldPrice6').text(oldPrice.toFixed(2));
    var realPrice = 0.00;
    $("#livBeautyList input[class^='input-body actualPayment']").each(function (index, element) {
        realPrice += Number($(element).val());
    });
    var prePrice = 0.00;
    prePrice = oldPrice - realPrice;
    $('#realPrice6').text(realPrice.toFixed(2));
    $('#sellPrice6').text(prePrice.toFixed(2));
}
//删除当前行
function deleteCheckRow6(index) {
    newCheckList6.splice(index, 1);
    $('#livBeautyList').bootstrapTable('load', newCheckList6);
    for (var i = 0; i < newCheckList6.length; i++) {
        $('#serviceLivBeauty' + i).val(newCheckList6[i].serviceId);
    }
    changeCheckTotal6();
}
//保存treat
function changeLivBeauty() {
    var isCan = true;
    if (newCheckList6.length == 0) {
        layer.msg('请添加需要检验的项目！');
        isCan = false;
        return false;
    }
    for (var i = 0; i < newCheckList6.length; i++) {
        if (newCheckList6[i].serviceId == '') {
            layer.msg('请删除未选择项目的条目！');
            isCan = false;
            return false;
        }
        if (newCheckList6[i].actualPayment == '') {
            layer.msg('请输入实际金额！');
            isCan = false;
            return false;
        }
    }
    if (isCan) {
        var memberId = $('#memberName1').attr('memberId');
        var processId = $('#memberName1').attr('processId');
        var shouldPay = $('#oldPrice6').text();
        var actualPay = $('#realPrice6').text();

        var cmd = "medical/addTreatmentItems";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            treatments: newCheckList6,
            shouldPay: shouldPay,
            actualPay: actualPay,
            type:2
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                $('.livBeauty-opt').click();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}
//表格初始化
function searchInit6() {
    $('#livBeautyList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '项目名称', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service2" id="serviceLivBeauty${index}" style="width: auto">${serviceList6}</select>`;

                }
            }
        },
        {
            field: 'remake', title: '备注', width: '30%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body remake" serviceId="${row.serviceId}" id="remakeLivBeauty${index}" value="${val}" style="width: auto" maxlength="16">`;
                }
            }
        },
        {
            field: 'unitPrice', title: '原价(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (val == '') {
                    return `<span class="unitPrice">-</span>`;
                } else {
                    return `<span class="unitPrice" serviceId="${row.serviceId}">${val}</span>`;
                }

            }
        },
        {
            field: 'actualPayment', title: '实际价格(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" serviceId="${row.serviceId}" id="actualPaymentLivBeauty${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            }
        },
        {
            field: 'id', title: '操作', width: '30%', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow6(${index})">删除</a>`;
            }
        }]
    });
    $('#livBeautyList').bootstrapTable('hideLoading');
}
function historyInit6() {
    $('#historyTable6').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'purchaseName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'remake', title: '备注', width: '60%', align: 'center'
            },
            {
                field: 'actualPayment', title: '实收', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            }]
    });
    $('#historyTable6').bootstrapTable('hideLoading');
}
//-------------------------------西药处方--------------------------------
var medicalList = '';
function medicalInit() {
    var cmd = "medical/getMedicalGoodsList";
    var datas = {
        merchantId: params.merchantId,
        type: 4
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data.goodsInfos;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].goodsId}" data-price="${data[i].price}" data-stockName="${data[i].stockName}" data-stockId="${data[i].stockId}">${data[i].goodsName}</option>`;
            }
            medicalList = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.west-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    medicalInit();
    $('#oldPrice4').text('-');
    $('#sellPrice4').text('-');
    $('#realPrice4').text('-');
    newCheckList3 = [];
    getMedicalData(memberId, processId,showType);
})
function getMedicalData(memberId, processId,showType) {
    var cmd = "medical/getMedicineHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 9
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#addWest').hide();
                $('#westBtn').hide();
                console.log(data.scPresaleInfos)
                $('#medicalTable').bootstrapTable('hideColumn', 'presaleId');
                $('#medicalTable').bootstrapTable('load', data.scPresaleInfos);
                var scPresaleInfos = data.scPresaleInfos;
                var unitPrice = 0.00;
                var realPrice = 0.00;
                var oldPrice = 0.00;
                for (var i = 0; i < scPresaleInfos.length; i++) {
                    oldPrice += scPresaleInfos[i].purchaseNum * scPresaleInfos[i].unitPrice;
                    realPrice += Number(scPresaleInfos[i].actualPayment);
                }
                $('#oldPrice4').text(oldPrice.toFixed(2));
                var sellPrice = oldPrice.toFixed(2) - realPrice.toFixed(2);
                $('#sellPrice4').text(sellPrice.toFixed(2));
                $('#realPrice4').text(realPrice.toFixed(2));
            } else {
                $('#addWest').show();
                $('#westBtn').show();
                $('#oldPrice3').text('-');
                $('#sellPrice3').text('-');
                $('#realPrice3').text('-');
                $('#medicalTable').bootstrapTable('showColumn', 'presaleId');
                $('#medicalTable').bootstrapTable('load', []);
            }
            
            if (data.historyPresaleInfos.length > 0) {
                $('#historyMedicalTable').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyMedicalTable').bootstrapTable('load', []);
            }
            if(showType == 1){
                $('#addWest').hide();
                $('#westBtn').hide();
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList3 = [];
$('#addWest').click(function () {
    var isCan = true;
    $("#medicalTable select[class^='input-body purchase']").each(function (index, element) {
        if ($(element).val() == '') {
            layer.msg('请选择西药！');
            isCan = false;
            return false;
        }
    });
    if (isCan) {
        var data = {
            purchaseName: '',
            purchaseNum: 1,
            goodsId: '',
            stockId: '',
            stockName: '',
            unitPrice: 0,
            originalAmount: 0,
            actualPayment: 0
        };
        newCheckList3.push(data);
        $('#medicalTable').bootstrapTable('load', newCheckList3);
    }
    for (var i = 0; i < newCheckList3.length - 1; i++) {
        $('#purchaseCheck3' + i).val(newCheckList3[i].goodsId);
    }
})
//监听table里项目名称选择
$('#medicalTable').on('change', '.purchase', function () {
    var goodsId = $(this).val();
    var purchaseName = $(this).find("option:selected").text();
    var unitPrice = $(this).find("option:selected").attr('data-price');
    var stockId = $(this).find("option:selected").attr('data-stockId');
    var stockName = $(this).find("option:selected").attr('data-stockName');
    if (goodsId == '') {
        layer.msg('请选择项目！');
        return false;
    }

    //获取当前行的index--对应list的index
    var pid = $(this).parents("tr").attr("data-index");

    if (newCheckList3.length > 1) {
        for (var i = 0; i < newCheckList3.length; i++) {
            if (goodsId == newCheckList3[i].goodsId) {
                layer.msg('请勿重复添加相同的项目！');
                $(this).val(newCheckList3[pid].goodsId);
                $(this).parent().siblings().find('.purchaseNum').val(1);
                $(this).parent().siblings().find('.unitPrice').text(0);
                $(this).parent().siblings().find('.actualPayment').val(0);
                $(this).parent().siblings().find('.originalAmount').text(0);
                changeCheckTotal3();
                return false;
            }
            if (newCheckList3[i].goodsId == '') {
                $(this).parent().siblings().find('.purchaseNum').attr('goodsId', goodsId);
                $(this).parent().siblings().find('.purchaseNum').val(1);
                $(this).parent().siblings().find('.unitPrice').attr('goodsId', goodsId);
                $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                $(this).parent().siblings().find('.stockName').attr('goodsId', goodsId);
                $(this).parent().siblings().find('.stockName').text(stockName);
                $(this).parent().siblings().find('.originalAmount').text(unitPrice);
                $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                $(this).parent().siblings().find('.actualPayment').attr('goodsId', goodsId)
                newCheckList3[i].purchaseName = purchaseName;
                newCheckList3[i].purchaseNum = 1;
                newCheckList3[i].goodsId = goodsId;
                newCheckList3[i].unitPrice = unitPrice;
                newCheckList3[i].originalAmount = unitPrice;
                newCheckList3[i].actualPayment = unitPrice;
                newCheckList3[i].stockId = stockId;
                newCheckList3[i].stockName = stockName;
            } else {
                var id = $(this).parent().siblings().find('.unitPrice').attr('goodsId');
                if (newCheckList3[i].goodsId == id) {
                    $(this).parent().siblings().find('.purchaseNum').attr('goodsId', goodsId);
                    $(this).parent().siblings().find('.purchaseNum').val(1);
                    $(this).parent().siblings().find('.unitPrice').attr('goodsId', goodsId);
                    $(this).parent().siblings().find('.unitPrice').text(unitPrice);
                    $(this).parent().siblings().find('.stockName').attr('goodsId', goodsId);
                    $(this).parent().siblings().find('.stockName').text(stockName);
                    $(this).parent().siblings().find('.originalAmount').text(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').val(unitPrice);
                    $(this).parent().siblings().find('.actualPayment').attr('goodsId', goodsId)
                    newCheckList3[i].purchaseName = purchaseName;
                    newCheckList3[i].purchaseNum = 1;
                    newCheckList3[i].goodsId = goodsId;
                    newCheckList3[i].unitPrice = unitPrice;
                    newCheckList3[i].originalAmount = unitPrice;
                    newCheckList3[i].actualPayment = unitPrice;
                    newCheckList3[i].stockId = stockId;
                    newCheckList3[i].stockName = stockName;
                }
            }
        }
    } else {
        $(this).parent().siblings().find('.purchaseNum').attr('goodsId', goodsId);
        $(this).parent().siblings().find('.purchaseNum').val(1);
        $(this).parent().siblings().find('.unitPrice').attr('goodsId', goodsId);
        $(this).parent().siblings().find('.unitPrice').text(unitPrice);
        $(this).parent().siblings().find('.stockName').attr('goodsId', goodsId);
        $(this).parent().siblings().find('.stockName').text(stockName);
        $(this).parent().siblings().find('.originalAmount').text(unitPrice);
        $(this).parent().siblings().find('.actualPayment').val(unitPrice);
        $(this).parent().siblings().find('.actualPayment').attr('goodsId', goodsId)
        newCheckList3[0].purchaseName = purchaseName;
        newCheckList3[0].purchaseNum = 1;
        newCheckList3[0].goodsId = goodsId;
        newCheckList3[0].unitPrice = unitPrice;
        newCheckList3[0].originalAmount = unitPrice;
        newCheckList3[0].actualPayment = unitPrice;
        newCheckList3[0].stockId = stockId;       
        newCheckList3[0].stockName = stockName;       
    }
    changeCheckTotal3();
});
//监听table里数量输入框
$('#medicalTable').on('input', '.actualPayment', function () {
    var actualPayment = $(this).val().trim();
    var unitPrice = Number($(this).parent().siblings().find('.originalAmount').text());
    var goodsId = $(this).attr('goodsId');
    if (actualPayment.indexOf('-') !== -1) {
        layer.msg('请输入大于0的实际价格！');
        return false;
    } else if (actualPayment.length == 0 || isNaN(Number(actualPayment))) {
        layer.msg('请输入有效实际价格！');
        return false;
    } else if (Number(actualPayment) > unitPrice) {
        layer.msg('实际价格不能大于原价！');
        $(this).val(unitPrice.toFixed(2));
        changeCheckTotal3();
        return false;
    }
    for (var i = 0; i < newCheckList3.length; i++) {
        if (newCheckList3[i].goodsId == goodsId) {
            newCheckList3[i].actualPayment = actualPayment;
        }
    }

    // var purchaseNum = $(this).val().trim();
    // purchaseNum = purchaseNum.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符   
    // $(this).val(purchaseNum);
    // var goodsId = $(this).attr('goodsId');
    // if (goodsId == undefined) {
    //     $(this).val('');
    //     layer.msg('请先选择项目！');
    //     return false;
    // }
    // for (var i = 0; i < newCheckList3.length; i++) {
    //     if (newCheckList3[i].goodsId == goodsId) {
    //         newCheckList3[i].actualPayment = purchaseNum;
    //     }
    // }
    changeCheckTotal3();
});

//监听table里数量输入框
$('#medicalTable').on('input', '.purchaseNum', function () {
    var purchaseNum = $(this).val().trim();
    purchaseNum = purchaseNum.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符   
    if(purchaseNum <= 0){
        $(this).val('');
        layer.msg('请先选择项目！');
        return false;
    }
    $(this).val(purchaseNum);
    var goodsId = $(this).attr('goodsId');
    if (goodsId == undefined) {
        $(this).val('');
        layer.msg('请先选择项目！');
        return false;
    }
    for (var i = 0; i < newCheckList3.length; i++) {
        if (newCheckList3[i].goodsId == goodsId) {
            newCheckList3[i].purchaseNum = purchaseNum;
            $(this).parent().siblings().find('.actualPayment').val((newCheckList3[i].unitPrice * purchaseNum).toFixed(2));
            $(this).parent().siblings().find('.originalAmount').text((newCheckList3[i].unitPrice * purchaseNum).toFixed(2));
            newCheckList3[i].actualPayment = (newCheckList3[i].unitPrice * purchaseNum).toFixed(2);
            newCheckList3[i].originalAmount = (newCheckList3[i].unitPrice * purchaseNum).toFixed(2);
        }
    }
    changeCheckTotal3();
});

function changeCheckTotal3() {
    var oldPrice = 0.00;
    $("#medicalTable span[class^='originalAmount']").each(function (index, element) {
        oldPrice += Number($(element).text());
    });
    $('#oldPrice4').text(oldPrice.toFixed(2));
    var realPrice = 0.00;
    $("#medicalTable input[class^='input-body actualPayment']").each(function (index, element) {
        realPrice += Number($(element).val());
    });
    var prePrice = 0.00;
    prePrice = oldPrice - realPrice;
    $('#realPrice4').text(realPrice.toFixed(2));
    $('#sellPrice4').text(prePrice.toFixed(2));
}
//删除当前行
function deleteCheckRow3(index) {
    newCheckList3.splice(index, 1);
    $('#medicalTable').bootstrapTable('load', newCheckList3);
    for (var i = 0; i < newCheckList3.length; i++) {
        $('#purchaseCheck3' + i).val(newCheckList3[i].goodsId);
    }
    changeCheckTotal3();
}
//保存West
function changeWest() {
    var isCan = true;
    if (newCheckList3.length == 0) {
        layer.msg('请添加西药项目！');
        isCan = false;
        return false;
    }
    for (var i = 0; i < newCheckList3.length; i++) {
        if (newCheckList3[i].goodsId == '') {
            layer.msg('请删除未选择药品的条目！');
            isCan = false;
            return false;
        }
        if (newCheckList3[i].purchaseNum == '') {
            layer.msg('请输入药品数量！');
            isCan = false;
            return false;
        }
    }
    if (isCan) {
        var memberId = $('#memberName1').attr('memberId');
        var processId = $('#memberName1').attr('processId');
        var shouldPay = $('#oldPrice4').text();
        var actualPay = $('#realPrice4').text();

        var cmd = "medical/addWesternMedicine";
        var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            treatments: newCheckList3,
            shouldPay: shouldPay,
            actualPay: actualPay
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg(re.msg);
                $('.west-opt').click();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}
//表格初始化
function medicalTableInit() {
    $('#medicalTable').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        undefinedText: '-',
        columns: [{
            field: 'purchaseName', title: '药品名称', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return val;
                } else {
                    return `<select class="input-body purchase" id="purchaseCheck3${index}" style="width: auto">${medicalList}</select>`;
                }
            }
        },
        {
            field: 'stockName', title: '药品规格', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return val;
                } else {
                    if (val == '') {
                        return `<span class="stockName">-</span>`;
                    } else {
                        return `<span class="stockName" goodsId="${row.goodsId}">${val}</span>`;
                    }
                }
            }
        },
        {
            field: 'unitPrice', title: '单价(元)', align: 'center', formatter: function (val, row, index) {
                if (val == '') {
                    return `<span class="unitPrice">0</span>`;
                } else {
                    return `<span class="unitPrice" goodsId="${row.goodsId}">${val}</span>`;
                }

            }
        },
        {
            field: 'purchaseNum', title: '数量', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return val;
                } else {
                    if(val == ''){
                        val = 1;
                    }
                    return `<input class="input-body purchaseNum" goodsId="${row.goodsId}" id="purchaseNum${index}" value="${val}" style="width: auto" maxlength="3">`;
                }
            }
        },
        {
            field: 'originalAmount', title: '原始金额(元)', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    var originalAmount = row.unitPrice * row.purchaseNum;
                    return originalAmount;
                } else {
                    if (val == '') {
                        return `<span class="originalAmount">0</span>`;
                    } else {
                        return `<span class="originalAmount" goodsId="${row.goodsId}">${val}</span>`;
                    }
                }
            }
        },{
            field: 'actualPayment', title: '实际价格(元)', width: '20%', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" goodsId="${row.goodsId}" id="actualPaymentWest${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            }
        },
        {
            field: 'presaleId', title: '操作', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow3(${index})">删除</a>`;
            }
        }]
    });
    $('#medicalTable').bootstrapTable('hideLoading');
}

function historyMedicalInit() {
    $('#historyMedicalTable').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'purchaseName', title: '药品名称', align: 'center' },
            {
                field: 'stockName', title: '药品规格', align: 'center'
            },
            {
                field: 'unitPrice', title: '单价', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            },
            {
                field: 'purchaseNum', title: '数量', align: 'center'
            },
            {
                field: 'actualPayment', title: '实收', align: 'center'
            }
        ]
    });
    $('#historyMedicalTable').bootstrapTable('hideLoading');
}
//-----------------------中成药方--------------------------------
// var medicalList1 = '';
// function medicalInit1() {
//     var cmd = "medical/getMedicalGoodsList";
//     var datas = {
//         merchantId: params.merchantId,
//         type: 2
//     };
//     ajaxAsync(cmd, datas, function (re) {
//         if (re.code == 1) {
//             var data = re.data.goodsInfos;
//             var opt = '<option value="">请选择咨询项目</option>';
//             for (var i = 0; i < data.length; i++) {
//                 opt += `<option value="${data[i].goodsId}" data-price="${data[i].price}" data-stockName="${data[i].stockName}" data-stockId="${data[i].stockId}">${data[i].goodsName}</option>`;
//             }
//             medicalList1 = opt;
//         } else {
//             layer.msg(re.msg);
//         }
//     })
// }
// $('.china-opt').click(function () {
//     var memberId = $('#memberName1').attr('memberId');
//     var processId = $('#memberName1').attr('processId');
//     medicalInit1();
//     $('#realPrice4').text('-');
//     newCheckList4 = [];
//     getMedicalData1(memberId, processId,showType);
// })
// function getMedicalData1(memberId, processId,showType) {
//     var cmd = "medical/getMedicineHistory";
//     var datas = {
//         merchantId: params.merchantId,
//         memberId: memberId,
//         processId: processId,
//         medicalType: 5
//     };
//     ajaxAsync(cmd, datas, function (re) {
//         if (re.code == 1) {
//             var data = re.data;
//             if (data.scPresaleInfos.length !== 0) {
//                 $('#addChina').hide();
//                 $('#chinaBtn').hide();
//                 $('#medicalTable1').bootstrapTable('hideColumn', 'presaleId');
//                 $('#medicalTable1').bootstrapTable('load', data.scPresaleInfos);
//                 var scPresaleInfos = data.scPresaleInfos;
//                 var realPrice = 0.00;
//                 for (var i = 0; i < scPresaleInfos.length; i++) {
//                     realPrice += Number(scPresaleInfos[i].actualPayment);
//                 }
//                 $('#realPrice4').text(realPrice.toFixed(2));
//             } else {
//                 $('#addChina').show();
//                 $('#chinaBtn').show();
//                 $('#realPrice4').text('-');
//                 $('#medicalTable1').bootstrapTable('showColumn', 'presaleId');
//                 $('#medicalTable1').bootstrapTable('load', []);
//             }

//             if (data.historyPresaleInfos.length > 0) {
//                 $('#historyMedicalTable1').bootstrapTable('load', data.historyPresaleInfos);
//             } else {
//                 $('#historyMedicalTable1').bootstrapTable('load', []);
//             }
//             if(showType == 1){
//                 $('#addChina').hide();
//                 $('#chinaBtn').hide();
//             }
//         } else {
//             layer.msg(re.msg);
//         }
//     })
// }
// var newCheckList4 = [];
// $('#addChina').click(function () {
//     var isCan = true;
//     $("#medicalTable1 select[class^='input-body purchase']").each(function (index, element) {
//         if ($(element).val() == '') {
//             layer.msg('请选择中成药！');
//             isCan = false;
//             return false;
//         }
//     });
//     if (isCan) {
//         var data = {
//             purchaseName: '',
//             purchaseNum: 1,
//             goodsId: '',
//             stockId: '',
//             stockName: '',
//             unitPrice: 0,
//             actualPayment: 0
//         };
//         newCheckList4.push(data);
//         $('#medicalTable1').bootstrapTable('load', newCheckList4);
//     }
//     for (var i = 0; i < newCheckList4.length - 1; i++) {
//         $('#purchaseCheck4' + i).val(newCheckList4[i].goodsId);
//     }
// })
// //监听table里项目名称选择
// $('#medicalTable1').on('change', '.purchase', function () {
//     var goodsId = $(this).val();
//     var purchaseName = $(this).find("option:selected").text();
//     var unitPrice = $(this).find("option:selected").attr('data-price');
//     var stockId = $(this).find("option:selected").attr('data-stockId');
//     var stockName = $(this).find("option:selected").attr('data-stockName');
//     if (goodsId == '') {
//         layer.msg('请选择项目！');
//         return false;
//     }

//     //获取当前行的index--对应list的index
//     var pid = $(this).parents("tr").attr("data-index");

//     if (newCheckList4.length > 1) {
//         for (var i = 0; i < newCheckList4.length; i++) {
//             if (goodsId == newCheckList4[i].goodsId) {
//                 layer.msg('请勿重复添加相同的项目！');
//                 $(this).val(newCheckList4[pid].goodsId);
//                 $(this).parent().siblings().find('.purchaseNum').val(1);
//                 $(this).parent().siblings().find('.unitPrice').text(0);
//                 $(this).parent().siblings().find('.actualPayment').text(0);
//                 changeCheckTotal4();
//                 return false;
//             }
//             if (newCheckList4[i].goodsId == '') {
//                 $(this).parent().siblings().find('.purchaseNum').attr('goodsId', goodsId);
//                 $(this).parent().siblings().find('.purchaseNum').val(1);
//                 $(this).parent().siblings().find('.unitPrice').attr('goodsId', goodsId);
//                 $(this).parent().siblings().find('.unitPrice').text(unitPrice);
//                 $(this).parent().siblings().find('.stockName').attr('goodsId', goodsId);
//                 $(this).parent().siblings().find('.stockName').text(stockName);
//                 $(this).parent().siblings().find('.actualPayment').text(unitPrice);
//                 $(this).parent().siblings().find('.actualPayment').attr('goodsId', goodsId)
//                 newCheckList4[i].purchaseName = purchaseName;
//                 newCheckList4[i].purchaseNum = 1;
//                 newCheckList4[i].goodsId = goodsId;
//                 newCheckList4[i].unitPrice = unitPrice;
//                 newCheckList4[i].actualPayment = unitPrice;
//                 newCheckList4[i].stockId = stockId;
//                 newCheckList4[i].stockName = stockName;
//             } else {
//                 var id = $(this).parent().siblings().find('.unitPrice').attr('goodsId');
//                 if (newCheckList4[i].goodsId == id) {
//                     $(this).parent().siblings().find('.purchaseNum').attr('goodsId', goodsId);
//                     $(this).parent().siblings().find('.purchaseNum').val(1);
//                     $(this).parent().siblings().find('.unitPrice').attr('goodsId', goodsId);
//                     $(this).parent().siblings().find('.unitPrice').text(unitPrice);
//                     $(this).parent().siblings().find('.stockName').attr('goodsId', goodsId);
//                     $(this).parent().siblings().find('.stockName').text(stockName);
//                     $(this).parent().siblings().find('.actualPayment').text(unitPrice);
//                     $(this).parent().siblings().find('.actualPayment').attr('goodsId', goodsId)
//                     newCheckList4[i].purchaseName = purchaseName;
//                     newCheckList4[i].purchaseNum = 1;
//                     newCheckList4[i].goodsId = goodsId;
//                     newCheckList4[i].unitPrice = unitPrice;
//                     newCheckList4[i].actualPayment = unitPrice;
//                     newCheckList4[i].stockId = stockId;
//                     newCheckList4[i].stockName = stockName;
//                 }
//             }
//         }
//     } else {
//         $(this).parent().siblings().find('.purchaseNum').attr('goodsId', goodsId);
//         $(this).parent().siblings().find('.purchaseNum').val(1);
//         $(this).parent().siblings().find('.unitPrice').attr('goodsId', goodsId);
//         $(this).parent().siblings().find('.unitPrice').text(unitPrice);
//         $(this).parent().siblings().find('.stockName').attr('goodsId', goodsId);
//         $(this).parent().siblings().find('.stockName').text(stockName);
//         $(this).parent().siblings().find('.actualPayment').text(unitPrice);
//         $(this).parent().siblings().find('.actualPayment').attr('goodsId', goodsId)
//         newCheckList4[0].purchaseName = purchaseName;
//         newCheckList4[0].purchaseNum = 1;
//         newCheckList4[0].goodsId = goodsId;
//         newCheckList4[0].unitPrice = unitPrice;
//         newCheckList4[0].actualPayment = unitPrice;
//         newCheckList4[0].stockId = stockId;
//         newCheckList4[0].stockName = stockName;
//     }
//     changeCheckTotal4();
// });
// //监听table里数量输入框
// $('#medicalTable1').on('input', '.purchaseNum', function () {
//     var purchaseNum = $(this).val().trim();
//     purchaseNum = purchaseNum.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符   
//     $(this).val(purchaseNum);
//     var goodsId = $(this).attr('goodsId');
//     if (goodsId == undefined) {
//         $(this).val('');
//         layer.msg('请先选择项目！');
//         return false;
//     }
//     for (var i = 0; i < newCheckList4.length; i++) {
//         if (newCheckList4[i].goodsId == goodsId) {
//             newCheckList4[i].purchaseNum = purchaseNum;
//             newCheckList4[i].actualPayment = newCheckList4[i].unitPrice * Number(purchaseNum).toFixed(2);
//             $(this).parent().siblings().find('.actualPayment').text(newCheckList4[i].actualPayment.toFixed(2));
//         }
//     }
//     changeCheckTotal4();
// });

// function changeCheckTotal4() {
//     var realPrice = 0.00;
//     $("#medicalTable1 span[class^='actualPayment']").each(function (index, element) {
//         realPrice += Number($(element).text());
//     });
//     $('#realPrice4').text(realPrice.toFixed(2));
// }
// //删除当前行
// function deleteCheckRow4(index) {
//     newCheckList4.splice(index, 1);
//     $('#medicalTable1').bootstrapTable('load', newCheckList4);
//     for (var i = 0; i < newCheckList4.length; i++) {
//         $('#purchaseCheck4' + i).val(newCheckList4[i].goodsId);
//     }
//     changeCheckTotal4();
// }
// //保存West
// function changeChina() {
//     var isCan = true;
//     if (newCheckList4.length == 0) {
//         layer.msg('请添加西药项目！');
//         isCan = false;
//         return false;
//     }
//     for (var i = 0; i < newCheckList4.length; i++) {
//         if (newCheckList4[i].goodsId == '') {
//             layer.msg('请删除未选择药品的条目！');
//             isCan = false;
//             return false;
//         }
//         if (newCheckList4[i].purchaseNum == '') {
//             layer.msg('请输入药品数量！');
//             isCan = false;
//             return false;
//         }
//     }
//     if (isCan) {
//         var memberId = $('#memberName1').attr('memberId');
//         var processId = $('#memberName1').attr('processId');
//         var shouldPay = $('#realPrice4').text();
//         var actualPay = $('#realPrice4').text();

//         var cmd = "medical/addChineseMedicine";
//         var datas = {
//             merchantId: params.merchantId,
//             userId: params.userId,
//             memberId: memberId,
//             processId: processId,
//             treatments: newCheckList4,
//             shouldPay: shouldPay,
//             actualPay: actualPay
//         };
//         ajaxAsync(cmd, datas, function (re) {
//             if (re.code == 1) {
//                 layer.msg(re.msg);
//                 $('.china-opt').click();
//             } else {
//                 layer.msg(re.msg);
//             }
//         })
//     }
// }
// //表格初始化
// function medicalTableInit1() {
//     $('#medicalTable1').bootstrapTable({
//         clickToSelect: true,
//         striped: true,
//         sortable: false,
//         selectItemName: 'btSelectItem',
//         undefinedText: '-',
//         columns: [{
//             field: 'purchaseName', title: '药品名称', align: 'center', formatter: function (val, row, index) {
//                 if (row.presaleId) {
//                     return val;
//                 } else {
//                     return `<select class="input-body purchase" id="purchaseCheck4${index}" style="width: auto">${medicalList1}</select>`;
//                 }
//             }
//         },
//         {
//             field: 'stockName', title: '药品规格', align: 'center', formatter: function (val, row, index) {
//                 if (row.presaleId) {
//                     return val;
//                 } else {
//                     if (val == '') {
//                         return `<span class="stockName">-</span>`;
//                     } else {
//                         return `<span class="stockName" goodsId="${row.goodsId}">${val}</span>`;
//                     }
//                 }
//             }
//         },
//         {
//             field: 'unitPrice', title: '单价(元)', align: 'center', formatter: function (val, row, index) {
//                 if (val == '') {
//                     return `<span class="unitPrice">0</span>`;
//                 } else {
//                     return `<span class="unitPrice" goodsId="${row.goodsId}">${val}</span>`;
//                 }

//             }
//         },
//         {
//             field: 'purchaseNum', title: '数量', align: 'center', formatter: function (val, row, index) {
//                 if (row.presaleId) {
//                     return val;
//                 } else {
//                     if (val == '') {
//                         val = 1;
//                     }
//                     return `<input class="input-body purchaseNum" goodsId="${row.goodsId}" id="purchaseNum${index}" value="${val}" style="width: auto" maxlength="3">`;
//                 }
//             }
//         },
//         {
//             field: 'actualPayment', title: '金额(元)', align: 'center', formatter: function (val, row, index) {
//                 if (row.presaleId) {
//                     return val;
//                 } else {
//                     if (val == '') {
//                         return `<span class="actualPayment">0</span>`;
//                     } else {
//                         return `<span class="actualPayment" goodsId="${row.goodsId}">${val}</span>`;
//                     }
//                 }
//             }
//         },
//         {
//             field: 'presaleId', title: '操作', align: 'center', formatter: function (val, row, index) {
//                 return `<a href="javascript:;" class="red" onclick="deleteCheckRow4(${index})">删除</a>`;
//             }
//         }]
//     });
//     $('#medicalTable1').bootstrapTable('hideLoading');
// }
// function historyMedicalInit1() {
//     $('#historyMedicalTable1').bootstrapTable({
//         clickToSelect: true,
//         striped: true,
//         sortable: false,
//         selectItemName: 'btSelectItem',
//         undefinedText: '-',
//         columns: [
//             { field: 'purchaseName', title: '药品名称', align: 'center' },
//             {
//                 field: 'stockName', title: '药品规格', align: 'center'
//             },
//             {
//                 field: 'unitPrice', title: '单价', align: 'center', formatter: function (val, row, index) {
//                     return val + '元';
//                 }
//             },
//             {
//                 field: 'purchaseNum', title: '数量', align: 'center'
//             },
//             {
//                 field: 'actualPayment', title: '金额', align: 'center'
//             }
//         ]
//     });
//     $('#historyMedicalTable1').bootstrapTable('hideLoading');
// }
//--------------------医嘱-----------------------

$('.advice-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    $('#advice').removeAttr('adviceId');
    $('#advice').val('');
    $('#adviceList').html('')
    getAdviceData(memberId, processId);
})
function getAdviceData(memberId, processId) {
    var cmd = "medical/getMedicalAdvice";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.newAdvice.length !== 0) {
                $('#advice').attr('adviceId', data.newAdvice[0].id);
                $('#advice').val(data.newAdvice[0].advice);
            }
            if (data.hisAdvice.length > 0) {
                var hisAdvice = data.hisAdvice;
                var box = '';
                for (var i = 0; i < hisAdvice.length; i++) {
                    var createTime = hisAdvice[i].createTime.split(' ')[0];
                    box += `<div class="time-title">${createTime}</div>
                            <div class="special-row">
                                <span class="input-name">医嘱:</span>
                                <span class="info-span">${hisAdvice[i].advice}</span>
                            </div>`;
               }
                $('#adviceList').html(box);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}

//保存advice
function subAdvice() {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    var adviceId = $('#advice').attr('adviceId');
    var advice = $('#advice').val();
    var datas = {
            merchantId: params.merchantId,
            userId: params.userId,
            memberId: memberId,
            processId: processId,
            advice: advice
        };
    if(adviceId == undefined){
        var cmd = "medical/addMedicalAdvice";
    }else{
        var cmd = "medical/updateMedicalAdvice";
        datas.adviceId = adviceId;
    }     
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('.advice-opt').click();
        } else {
            layer.msg(re.msg);
        }
    })
}
//完成咨询
$('#completeAll').click(function (params) {
    var processId = $('#memberName1').attr('processId');
    var datas = {
            processId: processId
        };  
    var cmd = "medical/consultingToComplete";     
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('#patientBox').show();
            $('#patientDetail').hide();
            clearShow();
            getTotalInfo();
        } else {
            layer.msg(re.msg);
        }
    })
})

//完成接待
function completeReceive(processId){
    var datas = {
        processId: processId
    };  
var cmd = "medical/consultingToComplete";     
ajaxAsync(cmd, datas, function (re) {
    if (re.code == 1) {
        layer.msg(re.msg);
        $('#patientBox').show();
        $('#patientDetail').hide();
        clearShow();
        getTotalInfo();
    } else {
        layer.msg(re.msg);
    }
})
}

function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
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
// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    var loading = '';
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
            loading = layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.close(loading);
        }
    });
}
function getParams() {
    var url = location.search;
    var params = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
}
//返回值
var callbackdata = function () {
    var sumNum = $('#totalSum').text();
    var dataList = [];
    var circleList = [];
    for (let i = 0; i < selectList.length; i++) {
        dataList.push(selectList[i].userId);       
        circleList.push(selectList[i].personCircleId);  
    }
    var returnDate ={
        sumNum: sumNum,
        selectList: dataList,
        circleList: circleList
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

// function parent() {
//     this.name = 'wz';
//     return {
//         getName: function() {
//             return  name;
//         },
//         setName: function (newName) {
//             name = newName;
//         }
//     }
// }

// function child() {
//     parent.call(this);
//     this.type = 'child';
// }
// child.prototype = new parent();

/********************   获取 图片、影像类别  */
var categoryId_global = null
var categoryName_global = ''
var categoryIndex_global = -1
function getCategory (memberId){
    console.log('index-----------',categoryIndex_global)
    var cmd = "medical/getMedicalVideoCategory";
    var datas = {
        memberId: memberId
    };
    ajaxAsync(cmd, datas, function (re) {
        if(categoryIndex_global == -1){
            var opt = `<div class="btn btn-info complete-btn" onclick="getPicByCategory(null, null, -1 )">全部</div>`;
        }else{
            var opt = `<div class="btn btn-default complete-btn" onclick="getPicByCategory(null, null, -1 )">全部</div>`;
        }
        
        if (re.code == 1) {
            $('.category-box').html('');
            var data = re.data;
            for (var i = 0; i < data.length; i++) {
                if(i == categoryIndex_global){
                    opt += `<div class="btn btn-info complete-btn" style="position:relative;" >
                        ${data[i].videoTypeName}
                        <img src="../img/edit.png" style="position:absolute;right:6px" onclick="editCategory( ${data[i].id}, '${data[i].videoTypeName}' )">
                    </div>`;
                }else{
                    opt += `<div class="btn btn-default complete-btn" style="position:relative;" onclick="getPicByCategory(${data[i].id}, '${data[i].videoTypeName}', ${i} )">
                        ${data[i].videoTypeName}
                    </div>`;
                }
               
            }
        } else {
            layer.msg(re.msg);
        }
        
        $('.category-box').append(opt);
    })
}
/********************   编辑 图片、影像类别  */
function editCategory(categotyId, categotyName){
    console.log(categotyId, categotyName)
    var memberId = $('#memberName1').attr('memberId')
    var edit_lay = layer.open({
        type: 2,
        content: 'modal/addCategory.html?type=edit' + '&categotyId=' + categotyId + '&videoTypeName=' + categotyName,
        title: false,
        btn: false,
        area: ['560px', '280px'],   
        end: function(){
            getCategory(memberId)
        }
    });
}
/********************   新增 图片、影像类别  */
function addCategory(){
    var memberId = $('#memberName1').attr('memberId')
    var mylay = layer.open({
        type: 2,
        content: 'modal/addCategory.html?type=add&memberId=' + memberId,
        title: false,
        btn: false,
        area: ['560px', '280px'],   
        end: function(){
            getCategory(memberId)
            getPicByCategory(null, null, -1 )
        }
    });
}
/********************  根据类别 获取图片  */
function getPicByCategory (categoryId, categoryName, index){
    // console.log(index)
    if(index == -1){
        $('#up-box').css('display','none')
        $('#up-box-fade').css('display','inline-block')
    }else{
        $('#up-box').css('display','inline-block')
        $('#up-box-fade').css('display','none')
    }
    // $('.category-box div').removeClass('btn-info').addClass('btn-default')
    // $('.category-box div:eq('+ (index+1) +')').removeClass('btn-default').addClass('btn-info')

    categoryId_global = categoryId
    categoryName_global = categoryName
    categoryIndex_global = index
    var cmd = "medical/getMedicalVideo";
    var datas = {
        memberId: $('#memberName1').attr('memberId'),
        categoryId: categoryId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            getCategory($('#memberName1').attr('memberId') )
            console.log('获取分类下图片成功,分类：',re.data)
            $('.pic-box').html('');
            var data = re.data;
            var opt = ""
            for (var i = 0; i < data.length; i++) {
                opt += `<div class='img-detail' onclick="showImg(`+data[i].id+`,'`+ data[i].videoAlbumUrl +`')">
                        <img class="example-image" src=${data[i].videoAlbumUrl} alt="thumb-3">
                </div>`;
                // opt += `<div class='img-detail'>
                //     <a class="example-image-link" href=${data[i].videoAlbumUrl} data-lightbox="example-set" data-title="点击图片的右半边进入下一张">
                //         <img class="example-image" src=${data[i].videoAlbumUrl} alt="thumb-3">
                //     </a>
                // </div>`;
            }
            $('.pic-box').append(opt);
        } else {
            layer.msg(re.msg);
        }
    })
}
function showImg (id, url){
    layer.open({
        type: 2,
        content: './modal/showImg.html?id=' + id + '&url=' + url,
        title: false,
        btn: false,
        area: ['800px', '600px'],   
        end: function(){
            getPicByCategory(categoryId_global, categoryName_global, categoryIndex_global)
        }
    });
}
/********************  上传图片  */
function addPicUrl (url, urlType){
    var cmd = "medical/addMedicalVideo";
    var datas = {
        memberId: $('#memberName1').attr('memberId'),
        categoryId: categoryId_global,
        categoryName: categoryName_global,
        videoAlbumUrl: url,
        videoAlbumType: urlType
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            getPicByCategory(categoryId_global, categoryName_global, categoryIndex_global)
        } else {
            layer.msg(re.msg);
        }
    })
}


// 封装ajax 给上传图片用
function reqAjax(cmd, data){
    var deferred = $.Deferred();
    $.ajax({
        type:"post",
        dataType: 'json',
        url:"/zxcity_restful/ws/rest",
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(data),
            version: 1 // 版本号根据情况默认
        },
        success: function(data){
            deferred.resolve(data)
        },
        error: function(){
            deferred.reject()
        }
    });
    return deferred;
}
var OSSParams;
window.pluploadList = [];
// oss上传
function initUpload(arg) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,html4',
        browse_button: arg.dom,
        multi_selection: false,
        unique_names: true,
        url: 'https://oss.aliyuncs.com',
        filters: {
            mime_types: arg.flag,
            max_file_size: arg.fileSize,
            prevent_duplicates: false
        }
    });
    uploader.init();
    uploader.bind('FilesAdded', function (up, files) {
        // if(!categoryName_global){
        //     layer.msg("请选择影像分类!", {icon: 2});
        //     return false
        // }else{
        //     startUpload(up, files[0]);
        // }
        startUpload(up, files[0]);
    });
    uploader.bind('UploadProgress', function(up, file) {
        // console.log(file.percent)
        // $(arg.dom).siblings('.cover').find('p').eq(0).text(file.percent + '%');
    });
    uploader.bind('Error', function (up, err, file) {
        if (err.code == -600) {
            layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内", {icon: 2});
        } else if (err.code == -500) {
            layer.msg('初始化错误', {icon: 2})
        } else if (err.code == -601) {
            layer.msg("不支持该文件格式", {icon: 2});
        } else if (err.code == -602) {
            layer.msg("这个文件已经上传过一遍了", {icon: 2});
        } else {
            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
        }

    });
    uploader.bind('FileUploaded', function (up, file, info) {
        if (info && info.status == 200) {
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
            addPicUrl(src, 1)

        } else {
            layer.msg("系统繁忙，请稍后再试!", {icon: 2});
        }

    });
    window.pluploadList.push(uploader);
};

//初始化上传图片
initUpload({
    dom: $('#upload_pic').siblings()[0], 
    flag: [{
        title: '请上传图片',
        extensions: 'jpg,png,jpeg,bmp'
    }], 
    fileSize: "10mb"
});

function startUpload(up, file) {
    getOssParams().then(function (data) {
        file.name = randomName();
        var fileName = data['dir'] + '/' + file.name;
        up.setOption({
            url: data['host'],
            multipart_params: {
                key: fileName,
                policy: data['policy'],
                OSSAccessKeyId: data['accessid'],
                success_action_status: 200,
                signature: data['signature']
            }
        });
        up.start()
    });
}
function randomName(len) {
    len = len || 23;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return new Date().getTime() + str;
}
function getOssParams() {
    var defer = $.Deferred();
    if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
        defer.resolve(OSSParams);
    } else {
        var def = reqAjax('oss/ossUpload');
        def.then(function(res){
            OSSParams = res;
            defer.resolve(res);
        });
        def.fail(function(err){
            defer.reject();
            layer.msg("系统繁忙，请稍后再试!");
        });
    }
    return defer.promise();
}

function citySelectInit(code) {
    var cmd = "medical/queryAllBaseArea";
    if(code !== undefined){
        var datas = {
            type: 2,
            code: code
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                $('#city').html('');
                var data = re.data;
                var opt = '';
                for (var i = 0; i < data.length; i++) {
                    opt += `<option value="${data[i].code}">${data[i].areaname}</option>`;
                }
                $('#city').append(opt);
            } else {
                layer.msg(re.msg);
            }
        })
    }else{
        var datas = {
            type: 1,
            code: ''
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                var data = re.data;
                var opt = '<option value="">请选择省/直辖市</option>';
                for (var i = 0; i < data.length; i++) {
                    opt += `<option value="${data[i].code}">${data[i].areaname}</option>`;
                }
                $('#province').append(opt);
                $('#city').html('<option value="">请选择市</option>');
            } else {
                layer.msg(re.msg);
            }
        })
    }   
}
// function introducerInit() {
//     var cmd = "medical/searchMedicalInfo";
//     var datas = {
//         merchantId: params.merchantId
//     };
//     ajaxAsync(cmd, datas, function (re) {
//         if (re.code == 1) {
//             $('#introducer').html('');
//             var data = re.data;
//             var opt = '<option value="">请选择介绍人</option>';
//             for (var i = 0; i < data.length; i++) {
//                 opt += `<option value="${data[i].userId}">${data[i].memberName}</option>`;
//             }
//             $('#introducer').append(opt);
//             $('#introducer').select2({
//                 width: '60%'
//             });
//             $('#introducer1').html('');
//             var data = re.data;
//             var opt1 = '<option value="">请选择介绍人</option>';
//             for (var i = 0; i < data.length; i++) {
//                 opt1 += `<option value="${data[i].userId}">${data[i].memberName}</option>`;
//             }
//             $('#introducer1').append(opt1);
//             $('#introducer1').select2({
//                 width: '60%'
//             });
//         } else {
//             layer.msg(re.msg);
//         }
//     })
// }
function serviceInit() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 2
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            $('.service').html('');
            $(".serviceProject").html('');
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}">${data[i].serviceName}</option>`;
            }
            $('.serviceProject').append(opt);
            $('#service').append(opt);
            $('#serviceProject').select2({
                width: '60%'
            });
            $('#service1').select2({
                width: '70%'
            });
            $('#service2').select2({
                width: '70%'
            });
            $('#service3').select2({
                width: '70%'
            });
        } else {
            layer.msg(re.msg);
        }
    })
}
function advUserInit() {
    var cmd = "customer/salesmanList";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            $('.advUser').html('');
            var data = re.data;
            var opt = '<option value="">请选择咨询院长</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}">${data[i].username}</option>`;
            }
            $('.advUser').append(opt);
            $('#advUser').select2({
                width: '60%'
            });
            $('#advUser1').select2({
                width: '70%'
            });
            $('#advUser2').select2({
                width: '70%'
            });
        } else {
            layer.msg(re.msg);
        }
    })
}
