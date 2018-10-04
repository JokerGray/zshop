var params = '';
$(document).ready(function () {
    params = getParams();
    getTotalInfo();
    //执行记录
    receiveInit();
    //执行时间
    completeInit();
    // 检验项目
    searchInit();
    historyInit();
    // 检查项目
    searchInit1();
    historyInit1();
    // 治疗项目
    searchInit2();
    historyInit2();
    //西药处方
    medicalTableInit();
    historyMedicalInit();
    //中成药方
    medicalTableInit1();
    historyMedicalInit1();
});
var nowDate = getSec(new Date(), 5);

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
    elem: '#startDate1',
    type: 'date',
    value: nowDate,
    done: function (value, date, endDate) {
        var startDate = new Date(value).getTime();
        var endTime = new Date($('#endDate1').val()).getTime();
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#startDate1').val($('#endDate1').val());
        }
    }
});
laydate.render({
    elem: '#endDate1',
    type: 'date',
    value: nowDate,
    done: function (value, date, endDate) {
        var startDate = new Date($('#startDate1').val()).getTime();
        var endTime = new Date(value).getTime();
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#endDate1').val($('#startDate1').val());
        }
    }
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
            // $('.receive>.regist-list').html(getBox(isReceivedList, 'receive'));
            break;
        case 'complete':
            // $('.complete>.regist-list').html(getBox(receiveCompleteList, 'complete'));
            break;
        default:
            break;
    }
})
$('#backHome').click(function () {
    $('#patientBox').show();
    $('#patientDetail').hide();
})
var receivedList = [];
var isReceivedList = [];
var receiveCompleteList = [];
//加载最外层表格
function getTotalInfo() {
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
            //等待中
            receivedList = data.receivedList;
            $('.waiting>.regist-list').html('');
            //接待中
            isReceivedList = data.isReceivedList;
            $('.receive>.regist-list').html('');
            //接待完成
            receiveCompleteList = data.receiveCompleteList;
            $('#completeNum').text(receiveCompleteList.length);
            $('.complete>.regist-list').html('');
            var type  = $('.top-title>.title-name.active').attr('id');
            switch (type) {
                case 'waiting':
                    $('.waiting>.regist-list').html(getBox(receivedList, 'waiting'));
                    break;
                case 'receive':
                    // $('.receive>.regist-list').html(getBox(isReceivedList, 'receive'));
                    break;
                case 'complete':
                    // $('.complete>.regist-list').html(getBox(receiveCompleteList, 'complete'));
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
                            <a href="javascript:;" onclick="changeToReception(${'\'' + data[i].memberId + '\',\'' + data[i].processId + '\''})" class="receive-btn">执行</a>
                        </div>
                    </div>`;
            } else if (type == 'receive') {
                box += `<div class="btn-list">
                            <a href="javascript:;" onclick="continueToReceive(${'\'' + data[i].memberId + '\',\'' + data[i].processId + '\''})" class="change-btn">继续接待</a>
                            <a href="javascript:;" class="change-btn">完成接待</a>
                        </div>
                    </div>`;
            } else if (type == 'complete') {
                box += `<div class="btn-list">
                            <a href="javascript:;" class="receive-btn">重新接待</a>
                        </div>
                    </div>`;
            }
        }
    }else{
        box = `<img src="../img/no_data.png" style="width: 100px;margin-left: 43%;margin-top: 16%;">`;
    }   
    return box;
}
function receiveInit() {
    $('#receiveTable').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '顾客姓名', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service" id="serviceCheck${index}" style="width: auto">${serviceList0}</select>`;

                }
            }
        },
        {
            field: 'remake', title: '性别', align: 'center', formatter: function (val, row, index) {
                    return val || '-';
            }
        },
        {
            field: 'unitPrice', title: '年龄', align: 'center', formatter: function (val, row, index) {
                    return `<span class="unitPrice">-</span>`;
            }
        },
        {
            field: 'actualPayment', title: '手机号码', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },
        {
            field: 'actualPayment', title: '项目名称', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },{
            field: 'advUserName', title: '咨询院长', align: 'center', formatter: function (val, row, index) {
                return val || '-';
            }
        },
        {
            field: 'actualPayment', title: '执行状态', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },
        {
            field: 'actualPayment', title: '执行时间', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },
        {
            field: 'id', title: '执行人', align: 'center'
        }]
    });
    $('#receiveTable').bootstrapTable('hideLoading');
}
function completeInit() {
    $('#completeTable').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '顾客姓名', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service" id="serviceCheck${index}" style="width: auto">${serviceList0}</select>`;

                }
            }
        },
        {
            field: 'remake', title: '性别', align: 'center', formatter: function (val, row, index) {
                    return val || '-';
            }
        },
        {
            field: 'unitPrice', title: '年龄', align: 'center', formatter: function (val, row, index) {
                    return `<span class="unitPrice">-</span>`;
            }
        },
        {
            field: 'actualPayment', title: '手机号码', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },
        {
            field: 'actualPayment', title: '项目名称', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },{
            field: 'advUserName', title: '咨询院长', align: 'center', formatter: function (val, row, index) {
                return val || '-';
            }
        },
        {
            field: 'actualPayment', title: '执行状态', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },
        {
            field: 'actualPayment', title: '执行时间', align: 'center', formatter: function (val, row, index) {
                    return val;
            }
        },
        {
            field: 'id', title: '执行人', align: 'center'
        }]
    });
    $('#completeTable').bootstrapTable('hideLoading');
}

//接待顾客
function changeToReception(memberId, processId) {
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
            // clearShow();
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
            $('#layuiTab>.layui-this').click();
            getTotalInfo();
            $('#memberName1').attr('processId', processId);
            $('#memberName1').attr('memberId', memberId);
        } else {
            layer.msg(re.msg);
        }
    })
}
//刷新顾客信息页面
function refreshInfo(data) {
    $('#memberName').text(data.memberName || '-');
    $('#memberName1').text(data.memberName || '-');
    $('#memberName1').attr('memberId', data.memberId);
    $('#memberName1').attr('consultingId', data.newConsultingInfos.id);
    if (data.allergy.length > 0){
        $('#allergy').hide();
    }else{
        $('#allergy').show();
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
    $('#birthday').text(data.birthday || '-');
    $('#idNumber').text(data.idNumber || '-');
    if(data.area || data.city){
        $('#address').text(data.area + data.city);
    }else{
        $('#address').text('-');
    }
    $('#contacts').text(data.contacts || '-');
    $('#contactsPhone').text(data.contactsPhone || '-');
    $('#introducer').text(data.introducer || '-');
    $('#remark').text(data.remark || '-');
    $('#allergyInfo').text(data.allergy || '-');
    $('#allergy2').text(data.allergy || '-');
    $('#historical').text(data.historical || '-');
    $('#historical2').text(data.historical || '-');
    var consultingInfos = data.consultingInfos;
    if (consultingInfos.length > 0) {
        var box = '';
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
                            <div class="col-xs-6">
                                <span class="input-name">咨询院长:</span>
                                <span id="">${consultingInfos[i].advUserName || '-'}</span>
                            </div>
                        </div>
                        <div class="input-row" style="margin-top: 30px;">
                            <div class="col-xs-6">
                                <span class="input-name">备注:</span>
                                <span id="">${consultingInfos[i].remark || '-'}</span>
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

//门诊病历--------------------------------
$('.medical-record').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    newCheckList0 = [];
    getMedicalRecord(memberId, processId);
})
function getMedicalRecord(memberId, processId) {
    var cmd = "medical/getMedicalRecordHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            var scMedicalCasesList = data.scMedicalCasesList;
            $('#allergy2').attr('memberId', memberId)
            $('#allergy2').attr('processId', processId)
            if (scMedicalCasesList.length > 0){
                $('#allergy2').attr('medicalRecordId', scMedicalCasesList[0].id)
                $('#question').val(scMedicalCasesList[0].question || '');
                if (scMedicalCasesList[0].bloodPressure !== '') {
                    $('#lowPressure').val(scMedicalCasesList[0].bloodPressure.split('/')[0]);
                    $('#highPressure').val(scMedicalCasesList[0].bloodPressure.split('/')[1]);
                } else {
                    $('#lowPressure').val('');
                    $('#highPressure').val('');
                }
                $('#temperature').val(scMedicalCasesList[0].temperature || '');
                $('#pulse').val(scMedicalCasesList[0].pulse || '');
                $('#height').val(scMedicalCasesList[0].height || '');
                $('#weight').val(scMedicalCasesList[0].weight || '');
                $('#bmi').val(scMedicalCasesList[0].bmi || '');
                $('#remark1').val(scMedicalCasesList[0].remark);
                $('#advOpinion').val(scMedicalCasesList[0].advOpinion);
            }else{
                $('#question').val('');
                $('#lowPressure').val('');
                $('#highPressure').val('');
                $('#temperature').val('');
                $('#pulse').val('');
                $('#height').val('');
                $('#weight').val('');
                $('#bmi').val('');
                $('#remark1').val();
                $('#advOpinion').val('');
            }
            var scMedicalCasesHisList = data.scMedicalCasesHisList;
            $('#historyList').html('');
            if (scMedicalCasesHisList.length > 0){
                var opt = '';
                for (var i = 0; i < scMedicalCasesHisList.length; i++) {
                    opt +=`<div class="time-title">2018-07-23</div>
                            <div class="history-row">
                                <span class="input-name">过敏史:</span>
                                <span class="info-span">无</span>
                            </div>
                            <div class="history-row">
                                <span class="input-name">既往史:</span>
                                <span class="info-span">无</span>
                            </div>
                            <div class="history-row">
                                <span class="input-name">主诉:</span>
                                <span class="info-span">无</span>
                            </div>
                            <div class="history-row">
                                <span class="input-name">体格检查:</span>
                                <span class="info-span">体温：37 <b class="danwei"> ℃</b>&nbsp;&nbsp;&nbsp;&nbsp;
                                    血压：120 / 67 <b class="danwei"> mmHg</b>&nbsp;&nbsp;&nbsp;&nbsp;
                                    脉搏：40 <b class="danwei"> bpm</b>&nbsp;&nbsp;&nbsp;&nbsp;
                                    身高：173 <b class="danwei"> cm</b>&nbsp;&nbsp;&nbsp;&nbsp;
                                    体重：45 <b class="danwei"> kg</b>&nbsp;&nbsp;&nbsp;&nbsp;
                                    BMI指数：16
                            </div>
                            <div class="history-row">
                                <span class="input-name">其他检查:</span>
                                <span class="info-span">无</span>
                            </div>
                            <div class="history-row">
                                <span class="input-name">咨询意见:</span>
                                <span class="info-span">无</span>
                            </div>`;
                    if (i !== scMedicalCasesHisList.length-1){
                        opt +=`<div class="line"></div>`;
                    }
                }
                $('#historyList').html(opt);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
function subMedicalRecord() {
    var medicalRecordId = $('#allergy2').attr('medicalRecordId');
    var memberId = $('#allergy2').attr('memberId');
    var processId = $('#allergy2').attr('processId');
    var question = $('#question').val().trim();
    var advOpinion = $('#advOpinion').val().trim();
    var weight = $('#weight').val().trim();
    var height = $('#height').val().trim();
    var pulse = $('#pulse').val().trim();
    var temperature = $('#temperature').val().trim();
    var BMI = $('#bmi').val().trim();
    var remark = $('#remark1').val().trim();
    var bloodPressure = $('#lowPressure').val().trim() + '/' + $('#highPressure').val().trim();
    var datas = {
            merchantId: params.merchantId,
            memberId: memberId,
            processId: processId,
            question: question,
            advOpinion: advOpinion,
            weight: weight,
            height: height,
            pulse: pulse,
            temperature: temperature,
            BMI: BMI,
            remark: remark,
            bloodPressure: bloodPressure
        };
    if (medicalRecordId !== undefined){
        var cmd = "medical/modifyMedicalRecord";
        datas.medicalRecordId = medicalRecordId;
    }else{
        var cmd = "medical/addMedicalRecord";
    }       
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
        } else {
            layer.msg(re.msg);
        }
    })
}
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
    getCheckData(memberId, processId);
})
function getCheckData(memberId, processId) {
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
                $('#checkList').bootstrapTable('hideColumn', 'id');
                $('#checkList').bootstrapTable('load', data.scPresaleInfos);
            }else{
                $('#addCheck').show();
                $('#checkBtn').show();
                $('#checkList').bootstrapTable('showColumn', 'id');
                $('#checkList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length >0){
                $('#historyTable').bootstrapTable('load', data.historyPresaleInfos);
            }else{
                $('#historyTable').bootstrapTable('load', []);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList = [];

//删除当前行
function deleteCheckRow(index) {
    newCheckList.splice(index, 1);
    $('#checkList').bootstrapTable('load', newCheckList);
    for (var i = 0; i < newCheckList.length; i++) {
        $('#serviceCheck' + i).val(newCheckList[i].serviceId);
    }
    changeCheckTotal();
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
                    return `<input class="input-body remake" serviceId="${row.serviceId}" id="remakeCheck${index}" value="${val}" style="width: auto">`;
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
            field: 'remake', title: '标本', width: '30%', align: 'center'
        },
        {
            field: 'unitPrice', title: '单价', width: '20%', align: 'center', formatter: function (val, row, index) {
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
                opt += `<option value="${data[i].id}" data-price="${data[i].price}" data-position="${data[i].position}" data-objective="${data[i].objective}">${data[i].serviceName}</option>`;
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
    newCheckList1 = [];
    getTestData(memberId, processId);
})
function getTestData(memberId, processId) {
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
            } else {
                $('#addTest').show();
                $('#testBtn').show();
                $('#testList').bootstrapTable('showColumn', 'id');
                $('#testList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable1').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable1').bootstrapTable('load', []);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList1 = [];

//删除当前行
function deleteCheckRow1(index) {
    newCheckList1.splice(index, 1);
    $('#testList').bootstrapTable('load', newCheckList1);
    for (var i = 0; i < newCheckList1.length; i++) {
        $('#serviceTest' + i).val(newCheckList1[i].serviceId);
    }
    changeCheckTotal1();
}
//表格初始化
function searchInit1() {
    $('#testList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'purchaseName', title: '项目名称', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<select class="input-body service1" id="serviceTest${index}" style="width: auto">${serviceList1}</select>`;
                }
            }
        },
        {
            field: 'position', title: '部位', align: 'center', formatter: function (val, row, index) {
                if (val == '' || val == undefined) {
                    return `<span class="position">-</span>`;
                } else {
                    return `<span class="position" serviceId="${row.serviceId}">${val}</span>`;
                }
            }
        },
        {
            field: 'objective', title: '检查目的', align: 'center', formatter: function (val, row, index) {
                if (val == '' || val == undefined) {
                    return `<span class="objective">-</span>`;
                } else {
                    return `<span class="objective" serviceId="${row.serviceId}">${val}</span>`;
                }
            }
        },
        {
            field: 'unitPrice', title: '原价(元)', align: 'center', formatter: function (val, row, index) {
                if (val == '') {
                    return `<span class="unitPrice">-</span>`;
                } else {
                    return `<span class="unitPrice" serviceId="${row.serviceId}">${val}</span>`;
                }

            }
        },
        {
            field: 'actualPayment', title: '实际价格(元)', align: 'center', formatter: function (val, row, index) {
                if (row.id) {
                    return val;
                } else {
                    return `<input class="input-body actualPayment" serviceId="${row.serviceId}" id="actualPaymentCheck${index}" value="${val}" style="width: auto" oninput="isnum(this)" onkeyup="isnum(this)" onafterpaste="delunum(this)">`;
                }
            }
        },
        {
            field: 'id', title: '操作', align: 'center', formatter: function (val, row, index) {
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
                field: 'position', title: '部位', width: '30%', align: 'center'
            },
            {
                field: 'objective', title: '检查目的', width: '30%', align: 'center'
            },
            {
                field: 'unitPrice', title: '单价', width: '20%', align: 'center', formatter: function (val, row, index) {
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
    newCheckList2 = [];
    getTreatData(memberId, processId);
})
function getTreatData(memberId, processId) {
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
            } else {
                $('#addTreat').show();
                $('#treatBtn').show();
                $('#treatList').bootstrapTable('showColumn', 'id');
                $('#treatList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable2').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable2').bootstrapTable('load', []);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList2 = [];

//删除当前行
function deleteCheckRow2(index) {
    newCheckList2.splice(index, 1);
    $('#treatList').bootstrapTable('load', newCheckList2);
    for (var i = 0; i < newCheckList2.length; i++) {
        $('#serviceTreat' + i).val(newCheckList2[i].serviceId);
    }
    changeCheckTotal2();
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
                    return `<input class="input-body remake" serviceId="${row.serviceId}" id="remakeCheck${index}" value="${val}" style="width: auto">`;
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
                field: 'remake', title: '备注', width: '30%', align: 'center'
            },
            {
                field: 'unitPrice', title: '单价', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            }]
    });
    $('#historyTable2').bootstrapTable('hideLoading');
}
//-------------------------------西药处方--------------------------------
var medicalList = '';
function medicalInit() {
    var cmd = "medical/getMedicalGoodsList";
    var datas = {
        merchantId: params.merchantId,
        type: 1
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
    newCheckList3 = [];
    getMedicalData(memberId, processId);
})
function getMedicalData(memberId, processId) {
    var cmd = "medical/getMedicineHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 6
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#medicalTable').bootstrapTable('hideColumn', 'presaleId');
                $('#medicalTable').bootstrapTable('load', data.scPresaleInfos);
            } else {
                $('#medicalTable').bootstrapTable('showColumn', 'presaleId');
                $('#medicalTable').bootstrapTable('load', []);
            }
            
            if (data.historyPresaleInfos.length > 0) {
                $('#historyMedicalTable').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyMedicalTable').bootstrapTable('load', []);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList3 = [];
//删除当前行
function deleteCheckRow(index) {
    newCheckList3.splice(index, 1);
    $('#medicalTable').bootstrapTable('load', newCheckList3);
    for (var i = 0; i < newCheckList3.length; i++) {
        $('#purchaseCheck3' + i).val(newCheckList3[i].goodsId);
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
                    return `<input class="input-body purchaseNum" goodsId="${row.goodsId}" id="purchaseNum${index}" value="${val}" style="width: auto">`;
                }
            }
        },
        {
            field: 'actualPayment', title: '金额(元)', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return val;
                } else {
                    if (val == '') {
                        return `<span class="actualPayment">0</span>`;
                    } else {
                        return `<span class="actualPayment" goodsId="${row.goodsId}">${val}</span>`;
                    }
                }
            }
        },
        {
            field: 'presaleId', title: '操作', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow(${index})">删除</a>`;
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
                field: 'actualPayment', title: '金额', align: 'center'
            }
        ]
    });
    $('#historyMedicalTable').bootstrapTable('hideLoading');
}
//-----------------------中成药方--------------------------------
var medicalList1 = '';
function medicalInit1() {
    var cmd = "medical/getMedicalGoodsList";
    var datas = {
        merchantId: params.merchantId,
        type: 2
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data.goodsInfos;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].goodsId}" data-price="${data[i].price}" data-stockName="${data[i].stockName}" data-stockId="${data[i].stockId}">${data[i].goodsName}</option>`;
            }
            medicalList1 = opt;
        } else {
            layer.msg(re.msg);
        }
    })
}
$('.china-opt').click(function () {
    var memberId = $('#memberName1').attr('memberId');
    var processId = $('#memberName1').attr('processId');
    medicalInit1();
    newCheckList4 = [];
    getMedicalData1(memberId, processId);
})
function getMedicalData1(memberId, processId) {
    var cmd = "medical/getMedicineHistory";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 5
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#medicalTable1').bootstrapTable('hideColumn', 'presaleId');
                $('#medicalTable1').bootstrapTable('load', data.scPresaleInfos);
            } else {
                $('#medicalTable1').bootstrapTable('showColumn', 'presaleId');
                $('#medicalTable1').bootstrapTable('load', []);
            }

            if (data.historyPresaleInfos.length > 0) {
                $('#historyMedicalTable1').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyMedicalTable1').bootstrapTable('load', []);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList4 = [];
//删除当前行
function deleteCheckRow(index) {
    newCheckList4.splice(index, 1);
    $('#medicalTable1').bootstrapTable('load', newCheckList4);
    for (var i = 0; i < newCheckList4.length; i++) {
        $('#purchaseCheck4' + i).val(newCheckList4[i].goodsId);
    }
    changeCheckTotal4();
}
//表格初始化
function medicalTableInit1() {
    $('#medicalTable1').bootstrapTable({
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
                    return `<select class="input-body purchase" id="purchaseCheck4${index}" style="width: auto">${medicalList1}</select>`;
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
                    if (val == '') {
                        val = 1;
                    }
                    return `<input class="input-body purchaseNum" goodsId="${row.goodsId}" id="purchaseNum${index}" value="${val}" style="width: auto">`;
                }
            }
        },
        {
            field: 'actualPayment', title: '金额(元)', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return val;
                } else {
                    if (val == '') {
                        return `<span class="actualPayment">0</span>`;
                    } else {
                        return `<span class="actualPayment" goodsId="${row.goodsId}">${val}</span>`;
                    }
                }
            }
        },
        {
            field: 'presaleId', title: '操作', align: 'center', formatter: function (val, row, index) {
                return `<a href="javascript:;" class="red" onclick="deleteCheckRow(${index})">删除</a>`;
            }
        }]
    });
    $('#medicalTable1').bootstrapTable('hideLoading');
}
function historyMedicalInit1() {
    $('#historyMedicalTable1').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        undefinedText: '-',
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
                field: 'actualPayment', title: '金额', align: 'center'
            }
        ]
    });
    $('#historyMedicalTable1').bootstrapTable('hideLoading');
}
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
                $('#advice').attr('adviceId', data.newAdvice[0].adviceId);
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