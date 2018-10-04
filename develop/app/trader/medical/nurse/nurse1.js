var params = '';
var REQUEST_URL = {
    U_1: 'medical/getOutpatientaList',//护士站门诊顾客列表接口  
    U_2: 'medical/getExecutionRecords',//护士站执行记录列表
    U_3: 'medical/countExecutionRecords',//护士站执行一览
    U_4: 'medical/findCheckHistoryForNurse',//护士站检验检查治疗
    U_5: 'medical/getMedicalRecordHistory',//护士站门诊病历
    U_6: 'medical/toDoExcute',//检验检查治疗项目 确认执行
    U_7: 'medical/getMedicineHistory',//护士站获中成药西药记录
    U_8: 'medical/getMedicalAdvice',//护士站获取医嘱
    U_9: 'medical/getOutpatientaList',//详情页列表使用
};
var nowDate = getSec(new Date(), 5);
var receivedList = [];
var isReceivedList = [];
var receiveCompleteList = [];


$(function(){
    dateInit();
    params = getParams();

    //门诊顾客
    getOutpatientaList();
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
    // 美容项目
    searchInit6();
    historyInit6();
    //中成药方
    // medicalTableInit1();
    // historyMedicalInit1();
    //地址初始化
    citySelectInit();
    //介绍人初始化
    // introducerInit();
    //咨询项目
    serviceInit();
    //咨询院长
    advUserInit();
    // changeToReception('2259','1412');
    // $("#customerInfo").show();
});
//详情弹出
$('.moreInfo').click(function () {
    var upOrDown = $(this).find('.arrow').attr('class');
    if (upOrDown.indexOf('up') == -1) {
        $('.customer').removeClass('glyphicon-menu-down');
        $('.customer').addClass('glyphicon-menu-up');
        $('#patientInfo').css('height', '610px');
    } else {
        $('.customer').removeClass('glyphicon-menu-up');
        $('.customer').addClass('glyphicon-menu-down');
        $('#patientInfo').css('height', '190px');
    }
});
//身体信息的详情展开
$(".moreDetail").click(function(){
    var upOrDown = $(this).find('.arrow').attr('class');
    if (upOrDown.indexOf('up') == -1) {
        $('.bodyDetail').removeClass('glyphicon-menu-down');
        $('.bodyDetail').addClass('glyphicon-menu-up');
        $(".body-info").css('height', '760px');
    }else{
        $('.bodyDetail').removeClass('glyphicon-menu-up');
        $('.bodyDetail').addClass('glyphicon-menu-down');
        $(".body-info").css('height', '210px');
    }
})
//tab切换
$('.title-name').click(function () {
    $('.top-title').find('.title-name').removeClass('active');
    $(this).addClass('active');
    var id = $(this).attr('id');
    $('.table-info').css('display', 'none');
    $('.' + id).css('display', 'block');
    switch (id) {
        case 'waiting':
            getOutpatientaList();
            break;
        case 'receive':
            executionRecords();
            break;
        case 'complete':
            countExecutionRecords();
            break;
        default:
            break;
    }
});

//查询
$(".top-tool .btn-info").click(function(){
   var id = $('.top-title').find('.title-name.active').attr('id');
   switch (id) {
       case 'waiting':
           getOutpatientaList();
           break;
       case 'receive':
           $('#receiveTable').bootstrapTable('destroy');
           executionRecords();
           break;
       case 'complete':
           $('#completeTable').bootstrapTable('destroy');
           countExecutionRecords();
           break;
       default:
           break;
   }
});

/**
 * 表格渲染通用方法
 * @param {*表格容器} ele 
 * @param {*列元素} columns 
 * @param {*请求地址} reqUrl 
 * @param {*请求参数} args 
 */
function TableInit(ele, columns, reqUrl, args) {
    var oTableInit = new Object();
    oTableInit.Init = function () {
        $(ele).bootstrapTable({
            url: '/zxcity_restful/ws/rest',
            method: 'POST',
            toolbar: '#toolbar',
            contentType: "application/x-www-form-urlencoded",
            ajaxOptions: {
                headers: {
                    apikey: 'test'
                }
            },
            responseHandler: function (res) {
                if (res.code == 1) {
                    res.rows = res.data;
                    return res;
                } else {
                    layer.msg(res.msg)
                }
            },
            queryParams: oTableInit.queryParams,
            undefinedText: '-',
            striped: true,
            cache: false,
            pagination: true,
            sortable: false,
            sidePagination: "server",
            pageNumber: 1,
            pageSize: 10,
            //pageList: [10, 25, 50, 100],
            strictSearch: false,
            clickToSelect: false,
            uniqueId: 'id',
            columns: columns

        });
    };

    oTableInit.queryParams = function (params) {
        args['page'] = params.offset / params.limit + 1;
        args['rows'] = params.limit;
        params['data'] = JSON.stringify(args);
        params['cmd'] = reqUrl;

        if (!args) return params;

        return params;
    };
    return oTableInit;
}

//门诊顾客列表
function getOutpatientaList(){
    var memberName = $('#searchName').val().trim();
    var bgTime = $('#startDate').val().trim();
    var edTime = $('#endDate').val().trim();

    var datas = {
        merchantId: params.merchantId,
        userId: params.userId,
        bgTime: bgTime,
        edTime: edTime,
        memberName: memberName,
    };

    ajaxAsync(REQUEST_URL.U_1, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            //等待中
            receivedList = data.receivedList;
            $('.waiting>.regist-list').html('');
            //接待中
            //isReceivedList = data.isReceivedList;
            //$('.receive>.regist-list').html('');
            //接待完成
            // receiveCompleteList = data.receiveCompleteList;
            //$('#completeNum').text(receiveCompleteList.length);
            //$('.complete>.regist-list').html('');
            var type = $('.top-title>.title-name.active').attr('id');
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

//执行记录
function executionRecords() {
   
    var colummsArr = [{
        field: 'id', title: '序号', align: 'center', formatter: function (val, row, index) {
            return index+1;
        }
    },{
            field: 'memberName', title: '顾客姓名', align: 'center', formatter: function (val, row, index) {
            return val;
        }
    },
    {
        field: 'gender', title: '性别', align: 'center', formatter: function (val, row, index) {
            var sex = val == 0 ? "女" : (val == 1 ? "男" : "保密");
            return sex;
        }
    },
    {
        field: 'age', title: '年龄', align: 'center', formatter: function (val, row, index) {
            return val || '-';
        }
    },
    {
        field: 'mobile', title: '手机号码', align: 'center', formatter: function (val, row, index) {
            return val || '-';
        }
    },
    {
        field: 'serviceName', title: '项目名称', align: 'center', formatter: function (val, row, index) {
            return val || '-';
        }
    },{
        field: 'advUserName', title: '咨询院长', align: 'center', formatter: function (val, row, index) {
            return val || '-';
        }
    },
    {
        field: 'status', title: '执行状态', align: 'center', formatter: function (val, row, index) {
            
            return val == 2 ? '已执行' : (val == 1 ? '未执行' : '-');
        }
    },
    {
        field: 'executeTime', title: '执行时间', align: 'center', formatter: function (val, row, index) {
            return val;
        }
    },
    {
        field: 'operationName', title: '执行人', align: 'center', formatter: function (val, row, index) {
            return val || '-';
        }
    }];

    var memberName = $('#searchName').val().trim();
    var bgTime = $('#startDate').val().trim();
    var edTime = $('#endDate').val().trim();

    var param = {
        merchantId: params.merchantId,
        userId: params.userId,
        bgTime: bgTime,
        edTime: edTime,
        memberName: memberName
    };

    //初始化Table
    var oTable = new TableInit('#receiveTable', colummsArr, REQUEST_URL.U_2, param);
    oTable.Init();
}


//顾客一览
function countExecutionRecords() {
    var colummsArr = [{field: 'id', title: '序号', align: 'center', formatter: function (val, row, index) {
            return index + 1;
        }
    },
    {
        field: 'memberName', title: '顾客姓名', align: 'center'
    },
    {
        field: 'gender', title: '性别', align: 'center', formatter: function (val, row, index) {
            var sex = val == 0 ? "女" : (val == 1 ? "男" : "保密");
            return sex;
        }
    },
    {
        field: 'age', title: '年龄', align: 'center' ,formatter: function (val, row, index) {
            return val == '' ? '-' : val
        }
    },
    {
        field: 'mobile', title: '手机号码', align: 'center'
    },
    {
        field: 'toExecution', title: '总次数', align: 'center'
    },
    {
        field: 'memberId', title: '已执行', align: 'center', formatter: function (val, row, index) {
            return parseInt(row.toExecution) - parseInt(row.nonExecution);
        }
    },
    {
        field: 'nonExecution', title: '执行状态', align: 'center', formatter: function (val, row, index) {
            if (val == 0){
                return "已执行";
            }else{
                return "待执行";
            }
        }
    }];
    
    var memberName = $('#searchName').val().trim();
    var bgTime = $('#startDate').val().trim();
    var edTime = $('#endDate').val().trim();

    var param = {
        merchantId: params.merchantId,
        userId: params.userId,
        bgTime: bgTime,
        edTime: edTime,
        memberName: memberName
    };
    
    //初始化Table
    var oTable = new TableInit('#completeTable', colummsArr, REQUEST_URL.U_3, param);
    oTable.Init();
    
}

//门诊顾客数据渲染
function getBox(data, type) {
    var box = '';
    if (data.length > 0) {
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
            } 
            // else if (type == 'receive') {
            //     box += `<div class="btn-list">
            //                 <a href="javascript:;" onclick="continueToReceive(${'\'' + data[i].memberId + '\',\'' + data[i].processId + '\''})" class="change-btn">继续接待</a>
            //                 <a href="javascript:;" class="change-btn">完成接待</a>
            //             </div>
            //         </div>`;
            // } else if (type == 'complete') {
            //     box += `<div class="btn-list">
            //                 <a href="javascript:;" class="receive-btn">重新接待</a>
            //             </div>
            //         </div>`;
            // }
        }
    } else {
        box = `<img src="../img/no_data.png" style="width: 100px;margin-left: 43%;margin-top: 16%;">`;
    }
    return box;
}

//切换顾客
function changePatientaInfo(ele, memberId, processId){
    var name = $(ele).find(".patient-name").text();
    var age = $(ele).find(".patient-age").text();
    var sex = $(ele).find(".patient-sex").text();
    $(ele).addClass("active").siblings().removeClass("active");
    $("#memberName").text(name);
    $("#age").text(age || '-');
    $("#gender").text(sex);
    $('#memberName').attr('data-processId', processId);
    $('#memberName').attr('data-memberId', memberId);
   
    $('#layuiTab>.layui-this').click();
}

//获取顾客详情页列表
function getPatientaList(){
    var searchTxt = $('#searchTxt').val().trim();
    var bgTime = $('#startDate1').val().trim();
    var edTime = $('#endDate1').val().trim();

    var datas = {
        merchantId: params.merchantId,
        userId: params.userId,
        bgTime: bgTime,
        edTime: edTime,
        memberName: searchTxt
    };

    ajaxAsync(REQUEST_URL.U_1, datas, function (res) {
        var sHtml = '';
        var processId = $('#memberName').attr('data-processId');
        if (res.code == 1) {

            var obj = res.data.receivedList;
            for(var i=0; i<obj.length; i++){
                var sex = obj[i].gender == 0 ? "女" : (obj[i].gender == 1 ? "男" : "保密");
                var age = obj[i].age == '' ? '-' : obj[i].age;
                if (obj[i].processId == processId){
                    sHtml += '<div class="patient-box active" onclick="changePatientaInfo(this,' + obj[i].memberId + ',' + obj[i].processId +')">';
                }else{
                    sHtml += '<div class="patient-box" onclick="changePatientaInfo(this,' + obj[i].memberId + ',' + obj[i].processId+')">';
                }
                
                sHtml += '<div class="content-line"><b class="patient-name">' + obj[i].memberName + '</b>';
                sHtml += '<span class="patient-sex">' + sex +'</span>';
                sHtml += '<span class="patient-age">' + age +'</span>岁</div>';
                sHtml += '<div class="content-line">';
                sHtml += '<span class="patient-time">' + obj[i].createTime+'</span>';
                sHtml += '<span class="patient-phone">' + obj[i].mobile+'</span>';
                sHtml += '</div></div>';
            }
        }
        $("#patientList").html(sHtml);
    });
}

function showHis(self){
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
};

//搜索
$("#patientDetail .btn-info").click(function(){
    getPatientaList();
});

//返回主页页面
$('#backHome').click(function () {
    $('#patientBox').show();
    $('#patientDetail').hide();
});

//跳转页面
function changeToReception(memberId, processId) {
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
           // clearShow();
            refreshInfo(data[0]);
            $('#memberName').attr('data-processId', processId);
            $('#memberName').attr('data-memberId', memberId);
            $('#layuiTab > li:eq(0)').addClass("layui-this").siblings().removeClass("layui-this");
            $('#layuiTab > .layui-this').click();
            getPatientaList();
            $("#customerInfo").show();
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
    if (data.allergy.length > 0) {
        $('#allergy').hide();
    } else {
        $('#allergy').show();
    }
    var sex = data.gender == 0 ? "女" : (data.gender == 1 ? "男" : "保密");
    $('#gender, #sex').text(sex);
    $('#age').text(data.age || '-');
    // $('#age1').text(data.age || '-');
    // $('#mobile').text(data.mobile || '-');
    // $('#birthday').text(data.birthday || '-');
    // $('#idNumber').text(data.idNumber || '-');
    // if (data.area || data.city) {
    //     $('#address').text(data.area + data.city);
    // } else {
    //     $('#address').text('-');
    // }
    // $('#contacts').text(data.contacts || '-');
    // $('#contactsPhone').text(data.contactsPhone || '-');
    // $('#remark').text(data.remark || '-');
    // $('#allergyInfo').text(data.allergy || '-');
    // $('#allergy2').text(data.allergy || '-');
    // $('#historical').text(data.historical || '-');
    // $('#historical2').text(data.historical || '-');
    //开始
    $("#ageMaster").val(data.age);
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
    $("#temperature").val(data.temperature);
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
    if(data.dataSource == 9 || data.dataSource == 10){
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
        $('#allergyPro').removeAttr('disabled');
        $('input:radio[name="allergy"][value="yes"]').click();
    }else{
        $('#allergyPro').val('');
        $('#allergyPro').attr('disabled','disabled');
        $('input:radio[name="allergy"][value="no"]').click();
    }      
    if (data.generalDrugs.length > 0) {
        $('#generalDrugs').val(data.generalDrugs);
        $('#generalDrugs').removeAttr('disabled');
        $('input:radio[name="generalDrugs"][value="yes"]').click();
    }else{
        $('#generalDrugs').val('');
        $('#generalDrugs').attr('disabled','disabled');
        $('input:radio[name="generalDrugs"][value="no"]').click();
    }
    if (data.historical.length > 0) {
        $('#historical').val(data.historical);
        $('#historical').removeAttr('disabled');
        $('input:radio[name="historical"][value="yes"]').click();
    }else{
        $('#historical').val('');
        $('#historical').attr('disabled','disabled');
        $('input:radio[name="historical"][value="no"]').click();
    }
    if (data.loseWeight.length > 0) {
        $('#loseWeight').val(data.loseWeight);
        $('#loseWeight').removeAttr('disabled');
        $('input:radio[name="weightHis"][value="yes"]').click();
    }else{
        $('#loseWeight').val('');
        $('#loseWeight').attr('disabled','disabled');
        $('input:radio[name="weightHis"][value="no"]').click();
    }
    if (data.reason.length > 0) {
        $('#reason').val(data.reason);
        $('#reason').removeAttr('disabled');
        $('input:radio[name="effect"][value="no"]').click();
    }else{
        $('#reason').val('');
        $('#reason').attr('disabled','disabled');
        $('input:radio[name="effect"][value="yes"]').click();
    }
    $("#customerInfo input").prop("disabled","disabled");
    $("#customerInfo select").prop("disabled","disabled");
    if (data.newConsultingInfos){
        if (data.newConsultingInfos.advUserId) {
            $('#advUser').val([data.newConsultingInfos.advUserId]).trigger('change');
        }
        if (data.newConsultingInfos.serviceId) {
            $('#serviceProject').val([data.newConsultingInfos.serviceId]).trigger('change');
        }
    }    
    //结束
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


/*********************** */
//门诊病历--------------------------------
$('.medical-record').click(function () {
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');
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
            if (scMedicalCasesList.length > 0) {
                $('#allergy2').attr('medicalRecordId', scMedicalCasesList[0].id)
                $('#question').text(scMedicalCasesList[0].question || '');
                if (scMedicalCasesList[0].bloodPressure !== '') {
                    $('#lowPressure').text(scMedicalCasesList[0].bloodPressure.split('/')[0]);
                    $('#highPressure').text(scMedicalCasesList[0].bloodPressure.split('/')[1]);
                } else {
                    $('#lowPressure').text('');
                    $('#highPressure').text('');
                }
                $('#temperature').text(scMedicalCasesList[0].temperature || '');
                $('#pulse').text(scMedicalCasesList[0].pulse || '');
                $('#height').text(scMedicalCasesList[0].height || '');
                $('#weight').text(scMedicalCasesList[0].weight || '');
                $('#bmi').text(scMedicalCasesList[0].bmi || '');
                $('#remark1').text(scMedicalCasesList[0].remark);
                $('#advOpinion').text(scMedicalCasesList[0].advOpinion);
            } else {
                $('#question').text('');
                $('#lowPressure').text('');
                $('#highPressure').text('');
                $('#temperature').text('');
                $('#pulse').text('');
                $('#height').text('');
                $('#weight').text('');
                $('#bmi').text('');
                $('#remark1').text();
                $('#advOpinion').text('');
            }
            var scMedicalCasesHisList = data.scMedicalCasesHisList;
            $('#historyList').html('');
            if (scMedicalCasesHisList.length > 0) {
                var opt = '';
                for (var i = 0; i < scMedicalCasesHisList.length; i++) {
                    
                    opt += `<div class="time-title">` + scMedicalCasesHisList[i].createTime.substring(0,10) + `</div>
                            <div class="record-row">
                                <div class="col-xs-12">
                                    <span class="input-name">过敏史:</span>
                                    <span class="info-span">`+scMedicalCasesHisList[i].allergy+`</span>
                                </div>
                            </div>
                            <div class="record-row">
                                <div class="col-xs-12">
                                    <span class="input-name">既往史:</span>
                                    <span class="info-span">`+ scMedicalCasesHisList[i].historical +`</span>
                                </div>
                            </div>
                            <div class="record-row">
                                <div class="col-xs-12">
                                    <span class="input-name">主诉:</span>
                                    <span class="info-span">`+ scMedicalCasesHisList[i].question +`</span>
                                </div>
                            </div>
                            <div class="record-row">
                                <div class="col-xs-12">
                                    <span class="input-name">体格检查:</span>
                                    <div class="info-span">
                                    <span class="body-input">体温：`+ scMedicalCasesHisList[i].temperature+`<span class="info-sub"></span><b class="danwei">℃</b> </span>
                                    <span class="body-input">血压：`+ scMedicalCasesHisList[i].bloodPressure +`<span class="info-sub"></span> / <span class="info-sub"></span> <b class="danwei">mmHg</b></span>
                                    <span class="body-input">脉搏：`+ scMedicalCasesHisList[i].pulse +`<span class="info-sub"></span> <b class="danwei">bpm</b></span>
                                    <span class="body-input">身高：`+ scMedicalCasesHisList[i].height +`<span class="info-sub"></span> <b class="danwei">cm</b></span>
                                    <span class="body-input">体重：`+ scMedicalCasesHisList[i].weight +`<span class="info-sub"></span> <b class="danwei">kg</b></span>
                                    <span class="body-input">BMI指数：`+ scMedicalCasesHisList[i].bmi +`<span class="info-sub"></span></span>
                                    </div>
                                </div>
                            </div>
                            <div class="record-row">
                                <div class="col-xs-12">
                                    <span class="input-name">其他检查:</span>
                                    <span class="info-span">`+ scMedicalCasesHisList[i].remark+`</span>
                                </div>
                            </div>
                            <div class="record-row">
                                <div class="col-xs-12">
                                    <span class="input-name">咨询意见:</span>
                                    <span class="info-span">`+ scMedicalCasesHisList[i].advOpinion+`</span>
                                </div>
                            </div>`;
                    if (i !== scMedicalCasesHisList.length - 1) {
                        opt += `<div class="line"></div>`;
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
    if (medicalRecordId !== undefined) {
        var cmd = "medical/modifyMedicalRecord";
        datas.medicalRecordId = medicalRecordId;
    } else {
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

//执行
function toDoExcute(excuteDetailId, type , index) {
    var feedback = '';
    if(type == 1){
        feedback = $(`#checkList${index}`).val();
    }else if(type == 2){
        feedback = $(`#testList${index}`).val();
    }else if(type == 3){
        feedback = $(`#treatList${index}`).val();
    }else if(type == 6){
        feedback = $(`#livBeautyList${index}`).val();
    }else{
        feedback = $(`#medicalTable${index}`).val();
    }
    var param = {
        type: type,//1. 检查 2. 检验 3. 项目
        excuteDetailId: excuteDetailId,
        operationId: params['userId'],
        feedback : feedback
    };

    ajaxAsync(REQUEST_URL.U_6, param, function (res) {
        if (res.code == 1) {
            layer.msg("操作成功!");
            $('#layuiTab>.layui-this').click();
           
        }else{
            layer.msg(res.msg);
        }
    });
}

//检验项目
$('.check-opt').click(function () {
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');
    getCheckData(memberId, processId);
})
function getCheckData(memberId, processId) {
    var cmd = "medical/findCheckHistoryForNurse";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId,
        medicalType: 1
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            var data = re.data;
            if (data.scPresaleInfos.length !== 0) {
                $('#checkList').bootstrapTable('hideColumn', 'id');
                $('#checkList').bootstrapTable('load', data.scPresaleInfos);
            } else {
                $('#addCheck').show();
                $('#checkBtn').show();
                $('#checkList').bootstrapTable('showColumn', 'id');
                $('#checkList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable').bootstrapTable('load', data.historyPresaleInfos);
            } else {
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
            field: 'serviceName', title: '项目名称', align: 'center'
        },
        {
            field: 'remake', title: '标本', align: 'center'
        },
        {
            field: 'unitPrice', title: '原价(元)', align: 'center'
        },
        {
            field: 'actualPayment', title: '实际价格(元)', align: 'center'
        },{
            field: 'feedbackInfo', title: '反馈', align: 'center', formatter: function (val, row, index) {
                if(row.status == 1){
                        return `<input class="input-body remake" id="checkList${index}" style="width: auto" maxlength="50">`;
                }else{
                    return `<span>${val}</span>`;
                }
            }
        },
        {
            field: 'status', title: '操作', align: 'center', formatter: function (val, row, index) {
                if(val == 2){
                    return "已执行";
                }else{
                    return '<button type="button" class="excute-btn" onclick="toDoExcute(' + row.executedetailId +', 1 , '+ index +')">执行确认</button>';
                }
                
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
            { field: 'serviceName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'remake', title: '标本', width: '30%', align: 'center', formatter: function (val, row, index) {
                    return val == '' ? '-' : val
                }
            },
            {
                field: 'unitPrice', title: '单价', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            },{
                field: 'feedbackInfo', title: '反馈', width: '20%', align: 'center', formatter: function (val, row, index) {
                    if(val){
                        return val
                    }else{
                        return val
                    }
                }
            }]
    });
    $('#historyTable').bootstrapTable('hideLoading');
}

//检查项目
$('.test-opt').click(function () {
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');
    
    newCheckList1 = [];
    getTestData(memberId, processId);
})
function getTestData(memberId, processId) {
    var cmd = "medical/findCheckHistoryForNurse";
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
            field: 'serviceName', title: '项目名称',width:'15%', align: 'center'
        },
        {
            field: 'position', title: '部位',width:'15%', align: 'center'
        },
        {
            field: 'objective', title: '检查目的',width:'15%', align: 'center'
        },
        {
            field: 'unitPrice', title: '原价(元)',width:'10%', align: 'center'
        },
        {
            field: 'actualPayment', title: '实际价格(元)',width:'10%', align: 'center'
        },{
            field: 'feedbackInfo', title: '反馈',width:'20%', align: 'center', formatter: function (val, row, index) {
                if(row.status == 1){
                        return `<input class="input-body remake" id="testList${index}" style="width: auto" maxlength="50">`;
                }else{
                    return `<span>${val}</span>`;
                }
            }
        },
        {
            field: 'status', title: '操作', align: 'center',width:'15%', formatter: function (val, row, index) {
                if (val == 2) {
                    return "已执行";
                } else {
                    return '<button type="button" class="excute-btn" onclick="toDoExcute(' + row.executedetailId + ',2 , '+index+')">执行确认</button>';
                }
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
            { field: 'serviceName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'position', title: '部位', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val == '' ? '-' : val
                }
            },
            {
                field: 'objective', title: '检查目的', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val == '' ? '-' : val
                }
            },
            {
                field: 'unitPrice', title: '单价', width: '10%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            },{
                field: 'feedbackInfo', title: '反馈', width: '30%', align: 'center', formatter: function (val, row, index) {
                    if(val){
                        return val
                    }else{
                        return val
                    }
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
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');

    newCheckList2 = [];
    getTreatData(memberId, processId);
})
function getTreatData(memberId, processId) {
    var cmd = "medical/findCheckHistoryForNurse";
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
            field: 'serviceName', title: '项目名称', align: 'center'
        },
        {
            field: 'remake', title: '备注', align: 'center'
        },
        {
            field: 'unitPrice', title: '原价(元)', align: 'center'
        },
        {
            field: 'actualPayment', title: '实际价格(元)', align: 'center'
        },{
            field: 'feedbackInfo', title: '反馈', align: 'center', formatter: function (val, row, index) {
                if(row.status == 1){
                    return `<input class="input-body remake" id="treatList${index}" style="width: auto" maxlength="50">`;
                }else{
                    return `<span>${val}</span>`;
                }
            }
        },
        {
            field: 'status', title: '操作', align: 'center', formatter: function (val, row, index) {
                if (val == 2) {
                    return "已执行";
                } else {
                    return '<button type="button" class="excute-btn" onclick="toDoExcute(' + row.executedetailId + ',3 , '+index+')">执行确认</button>';
                }
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
            { field: 'serviceName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'remake', title: '备注', width: '30%', align: 'center', formatter: function (val, row, index) {
                    return val == '' ? '-' : val
                }
            },
            {
                field: 'unitPrice', title: '单价', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            },{
                field: 'feedbackInfo', title: '反馈', width: '20%', align: 'center', formatter: function (val, row, index) {
                    if(val){
                        return val
                    }else{
                        return val
                    }
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
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');
    medicalInit();
    newCheckList3 = [];
    getMedicalData(memberId, processId);
})
function getMedicalData(memberId, processId) {
    var cmd = "medical/findCheckHistoryForNurse";
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
            field: 'serviceName', title: '药品名称', align: 'center', formatter: function (val, row, index) {
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
                        return `<span class="stockName" goodsId="${row.serviceCardId}">${val}</span>`;
                    }
                }
            }
        },
        {
            field: 'unitPrice', title: '单价(元)', align: 'center', formatter: function (val, row, index) {
                if (row.presaleId) {
                    return `<span class="unitPrice">${val}</span>`;
                } else {
                    return `<span class="unitPrice" goodsId="${row.serviceCardId}">${val}</span>`;
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
                    return `<input class="input-body purchaseNum" goodsId="${row.serviceCardId}" id="purchaseNum${index}" value="${val}" style="width: auto">`;
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
                        return `<span class="actualPayment" goodsId="${row.serviceCardId}">${val}</span>`;
                    }
                }
            }
        },{
            field: 'feedbackInfo', title: '反馈', align: 'center', formatter: function (val, row, index) {
                if(row.status == 1){
                    return `<input class="input-body remake" id="medicalTable${index}" style="width: auto" maxlength="50">`;
                }else{
                    return `<span>${val}</span>`;
                }
            }
        },
        {
            field: 'status', title: '操作', align: 'center', formatter: function (val, row, index) {
                if (val == 2) {
                    return "已执行";
                } else {
                    return '<button type="button" class="excute-btn" onclick="toDoExcute(' + row.executedetailId + ',4 , '+index+')">执行确认</button>';
                }
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
                field: 'stockName', title: '药品规格', align: 'center', formatter: function (val, row, index) {
                    return val == '' ? '-' : val;
                }
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
            },{
                field: 'feedbackInfo', title: '反馈', width: '20%', align: 'center', formatter: function (val, row, index) {
                    if(val){
                        return val
                    }else{
                        return val
                    }
                }
            }
        ]
    });
    $('#historyMedicalTable').bootstrapTable('hideLoading');
}

//-------------------------美容项目--------------------------------
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
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');

    newCheckList6 = [];
    getLiveData(memberId, processId);
})
function getLiveData(memberId, processId) {
    var cmd = "medical/findCheckHistoryForNurse";
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
                $('#livBeautyList').bootstrapTable('hideColumn', 'id');
                $('#livBeautyList').bootstrapTable('load', data.scPresaleInfos);
            } else {
                $('#livBeautyList').bootstrapTable('showColumn', 'id');
                $('#livBeautyList').bootstrapTable('load', []);
            }
            if (data.historyPresaleInfos.length > 0) {
                $('#historyTable6').bootstrapTable('load', data.historyPresaleInfos);
            } else {
                $('#historyTable6').bootstrapTable('load', []);
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
var newCheckList6 = [];

//表格初始化
function searchInit6() {
    $('#livBeautyList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'serviceName', title: '项目名称', align: 'center'
        },
        {
            field: 'remake', title: '备注', align: 'center'
        },
        {
            field: 'unitPrice', title: '原价(元)', align: 'center'
        },
        {
            field: 'actualPayment', title: '实际价格(元)', align: 'center'
        },{
            field: 'feedbackInfo', title: '反馈', align: 'center', formatter: function (val, row, index) {
                if(row.status == 1){
                    return `<input class="input-body remake" id="livBeautyList${index}" style="width: auto" maxlength="50">`;
                }else{
                    return `<span>${val}</span>`;
                }
            }
        },
        {
            field: 'status', title: '操作', align: 'center', formatter: function (val, row, index) {
                if (val == 2) {
                    return "已执行";
                } else {
                    return '<button type="button" class="excute-btn" onclick="toDoExcute(' + row.executedetailId + ',6 , '+index+')">执行确认</button>';
                }
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
            { field: 'serviceName', title: '项目名称', width: '20%', align: 'center' },
            {
                field: 'remake', title: '备注', width: '30%', align: 'center', formatter: function (val, row, index) {
                    return val == '' ? '-' : val
                }
            },
            {
                field: 'unitPrice', title: '单价', width: '20%', align: 'center', formatter: function (val, row, index) {
                    return val + '元';
                }
            },{
                field: 'feedbackInfo', title: '反馈', width: '20%', align: 'center', formatter: function (val, row, index) {
                    if(val){
                        return val
                    }else{
                        return val
                    }
                }
            }]
    });
    $('#historyTable6').bootstrapTable('hideLoading');
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
//     var memberId = $('#memberName').attr('data-memberId');
//     var processId = $('#memberName').attr('data-processId');
//     medicalInit1();
//     newCheckList4 = [];
//     getMedicalData1(memberId, processId);
// })
// function getMedicalData1(memberId, processId) {
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
//                 $('#medicalTable1').bootstrapTable('hideColumn', 'presaleId');
//                 $('#medicalTable1').bootstrapTable('load', data.scPresaleInfos);
//             } else {
//                 $('#medicalTable1').bootstrapTable('showColumn', 'presaleId');
//                 $('#medicalTable1').bootstrapTable('load', []);
//             }

//             if (data.historyPresaleInfos.length > 0) {
//                 $('#historyMedicalTable1').bootstrapTable('load', data.historyPresaleInfos);
//             } else {
//                 $('#historyMedicalTable1').bootstrapTable('load', []);
//             }
//         } else {
//             layer.msg(re.msg);
//         }
//     })
// }
// var newCheckList4 = [];
// //删除当前行
// function deleteCheckRow(index) {
//     newCheckList4.splice(index, 1);
//     $('#medicalTable1').bootstrapTable('load', newCheckList4);
//     for (var i = 0; i < newCheckList4.length; i++) {
//         $('#purchaseCheck4' + i).val(newCheckList4[i].goodsId);
//     }
//     changeCheckTotal4();
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
//                     return `<input class="input-body purchaseNum" goodsId="${row.goodsId}" id="purchaseNum${index}" value="${val}" style="width: auto">`;
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
//                 return `<a href="javascript:;" class="red" onclick="deleteCheckRow(${index})">删除</a>`;
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
//                 field: 'stockName', title: '药品规格', align: 'center', formatter: function (val, row, index) {
//                     return val == '' ? '-' : val;
//                 }
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
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#memberName').attr('data-processId');
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
                $('#advice').text(data.newAdvice[0].advice);
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

/******************************** */



//日期控件初始化
function dateInit(){
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

}

//通用方法
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
    var returnDate = {
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