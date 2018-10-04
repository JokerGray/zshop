var params = '',caseId='';
$(document).ready(function () {
    params = getParams();
    citySelectInit();
    introducerInit();
    serviceInit();
    advUserInit();
    searchInit();
    searchInit1();
    setTimeout(() => {
        tableInit();
    }, 1000);
});

//顾客登记
var nowDate = getSec(new Date(), 5);
laydate.render({
    elem: '#birthday',
    type: 'date',
    max: nowDate,
    // value: new Date()
    done: function (value, date, endDate) {
        var nowYear = new Date().getFullYear();
        $('#age').val(nowYear - date.year)
    }
});
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
//监听省选择
$('#province').on('change', function () {
    var code = $(this).val();
    citySelectInit(code);
});
function introducerInit() {
    var cmd = "medical/searchMedicalInfo";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            $('#introducer').html('');
            var data = re.data;
            var opt = '<option value="">请选择介绍人</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].userId}">${data[i].memberName}</option>`;
            }
            $('#introducer').append(opt);
            $('#introducer').select2({
                width: '60%'
            });
            $('#introducer1').html('');
            var data = re.data;
            var opt1 = '<option value="">请选择介绍人</option>';
            for (var i = 0; i < data.length; i++) {
                opt1 += `<option value="${data[i].userId}">${data[i].memberName}</option>`;
            }
            $('#introducer1').append(opt1);
            $('#introducer1').select2({
                width: '60%'
            });
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

function serviceInit() {
    var cmd = "medical/getServiceInfo";
    var datas = {
        merchantId: params.merchantId,
        type: 2
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            $('.service').html('');
            var data = re.data;
            var opt = '<option value="">请选择咨询项目</option>';
            for (var i = 0; i < data.length; i++) {
                opt += `<option value="${data[i].id}">${data[i].serviceName}</option>`;
            }
            $('.service').append(opt);
            $('#service').select2({
                width: '60%'
            });
            $('#service1').select2({
                width: '70%'
            });
            // $('#service1').on("select2:select", function (e) {
            //     $('#registTable').bootstrapTable('refresh');
            // });
            $('#service2').select2({
                width: '70%'
            });
            $('#service3').select2({
                width: '70%'
            });
            // $('#service3').on("select2:select", function (e) {
            //     getReserve();
            // });
        } else {
            layer.msg(re.msg);
        }
    })
}

//展开收起
function changeFlow(self) {
    var status = $(self).text();
    if (status == '收起') {
        $(self).parent().siblings('.regist-list').hide('slow', function () {
            $(self).text('展开');
        });
    } else {
        $(self).parent().siblings('.regist-list').show('slow', function () {
            $(self).text('收起');
        });
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
            $('#introducer2').append(opt);
            $('#introducer3').append(opt);
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
//详情弹出
$('.moreInfo').click(function () {
    var upOrDown = $(this).find('.arrow').attr('class');
    if (upOrDown.indexOf('up') == -1) {
        $('.customer').removeClass('glyphicon-menu-down');
        $('.customer').addClass('glyphicon-menu-up');
        $('#patientInfo').css('height', '512px');
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
        $(".body-info").css('height', '650px');
    }else{
        $('.bodyDetail').removeClass('glyphicon-menu-up');
        $('.bodyDetail').addClass('glyphicon-menu-down');
        $(".body-info").css('height', '210px');
    }
})
// 身体信息里面单选控制input是否可以输入
$(".radioDisabled .patient-sex label").click(function(){
    //获取当前点击的标志
    var flag=$(this).parent(".patient-sex").attr("data-flag");
    var elemIpt=$(this).closest(".radioDisabled").find(".ipt input");
    if(flag==0){
        elemIpt.attr("disabled","disabled");
        elemIpt.val("");
    }else{
        elemIpt.removeAttr("disabled");
    }
})
//点击身体信息里面美容环境和病态input是否禁用
var haird=$(".hairdressing .patient-sex");
var hairdstr="0,0,0,0";
$(".hairdressing .patient-sex label").click(function(){
    var _this=$(this);
    text(_this,"hairdressing")
    //value值拼接
    hairdstr="";
    for(var i=0;i<haird.length;i++){
        hairdstr+= $(haird[i]).find("input").attr("value")+",";
    } 
    hairdstr=hairdstr.substring(0,hairdstr.length - 1);
})
var morbid=$(".morbidity .patient-sex");
var morbiditystr="0,0,0,0,0,0,0,0";
$(".morbidity .patient-sex label").click(function(){
    var _this=$(this);
    text(_this,"morbidity")
    morbiditystr="";
    for(var i=0;i<morbid.length;i++){
        morbiditystr+= $(morbid[i]).find("input").attr("value")+",";
    } 
    morbiditystr=morbiditystr.substring(0,morbiditystr.length - 1);
})
//监听数据来源和介绍人的select值
var dataSourceVal='';
$(".dataResource #dataSource").change(function(){
    var val=$(this).find("option:selected").attr("value");
    dataSourceVal=val;
})
var introducerVal='';
var person="";
$(".dataResource #introducer").change(function(){
    var val=$(this).find("option:selected").attr("value");
    person=$(this).find("option:selected").text();
    introducerVal=val;
})
$(".dataResource #introducer3").change(function(){
    var val=$(this).find("option:selected").attr("value");
    person=$(this).find("option:selected").text();
    introducerVal=val;
})
var dataSourceVal1='';
$(".dataResource1 #dataSource1").change(function(){
    var val=$(this).find("option:selected").attr("value");
    dataSourceVal1=val;
})
var introducerVal1='';
var person1="";
$(".dataResource1 #introducer1").change(function(){
    var val1=$(this).find("option:selected").attr("value");
    person1=$(this).find("option:selected").text();
    introducerVal1=val1;
})
$(".dataResource1 #introducer2").change(function(){
    var val1=$(this).find("option:selected").attr("value");
    person1=$(this).find("option:selected").text();
    introducerVal1=val1;
})
function text(elm,elem2){
    var elemIpt=$("."+elem2).find(".ipt input");
    //input是否禁用
    if(elm.html()=="其他"&&elm.prev("input").is(':checked')){
        elemIpt.attr("disabled","disabled");
        elemIpt.val("");
    }else if(elm.html()!="其他"){
        if($("."+elem2).find(".rest input").is(':checked')){
            elemIpt.removeAttr("disabled");
        }else{
            elemIpt.attr("disabled","disabled");
            elemIpt.val("");
        }
    }else if(elm.html()=="其他"&&!elm.prev("input").is(':checked')){
        elemIpt.removeAttr("disabled");
    }
    //input点击取消value 0,1的切换
    if(elm.prev("input").is(':checked')){
        elm.prev("input").attr("value","0");
    }else{
        elm.prev("input").attr("value","1");
    }
}

$('#dataSource').on('change',function(params){
    var value = $(this).val();
    if(value == 10){
        $('#showIntroducer').show();
        $('#showIntroducer3').hide();
        $('#introducer3').val('');
    }else if(value == 9){
        $('#showIntroducer3').show();
        $('#showIntroducer').hide();
        $('#introducer').val('');
    }else{
        $('#showIntroducer').hide();
        $('#showIntroducer3').hide();
        $('#introducer').val('');
        $('#introducer3').val('');
    }
});

$('#dataSource1').on('change',function(params){
    var value = $(this).val();
    if(value == 10){
        $('#showIntroducer1').show();
        $('#showIntroducer2').hide();
        $('#introducer2').val('');
    }else if(value == 9){
        $('#showIntroducer2').show();
        $('#showIntroducer1').hide();
        $('#introducer1').val('');
    }else{
        $('#showIntroducer1').hide();
        $('#showIntroducer2').hide();
        $('#introducer1').val('');
        $('#introducer2').val('');
    }
});

//弹出老顾客信息
$('#memberName').on('input', function () {
    var memberName = $(this).val();
    if (memberName.length > 0){
        $('#removeInfo').css('display','inline-block');
    }else{
        $('#removeInfo').css('display', 'none');
    }
})
$('#removeInfo').on('click', function () {
    $('#memberName').val('');
    $('#removeInfo').css('display', 'none');
    clearReserve();
})
//搜索小组成员
$("#searchOld").on("click", function (e) {
    var memberName = $('#memberName').val();
    var cmd = "medical/getRegCustomers";
    var datas = {
        merchantId: params.merchantId,
        memberName: memberName
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if(re.data.length > 0){
                $('#searchList').bootstrapTable('load', re.data);
            }
        } else {
            layer.msg(re.msg);
        }
    })
    $(".search-box").show();
    $(document).on("click", function () {
        $(".search-box").hide();
    });
    e = e || event;
    stopFunc(e);
});
$('#searchList').on("click", function (e) {
    e = e || event;
    stopFunc(e);
    $('#removeInfo').css('display','inline-block');
});
function stopFunc(e) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}
$('#idNumber').on('change', function () {
    var idNumber = $('#idNumber').val();
    var reg = /^\d{17}(\d|x|X)$/;
    if (!reg.test(idNumber)) {
        layer.msg("请输入正确的身份证号!")
        return false;
    }
});
$('#mobile').on('change', function () {
    var mobile = $('#mobile').val();
    var reg = /^[1][3-9][0-9]{9}$/;
    if (!reg.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }
});
$('#mobile1').on('change', function () {
    var mobile = $('#mobile1').val();
    var reg = /^[1][3-9][0-9]{9}$/;
    if (!reg.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }
});
$('#contactPhone').on('change', function () {
    var mobile = $('#contactPhone').val();
    var reg = /^[1][3-9][0-9]{9}$/;
    if (!reg.test(mobile)) {
        layer.msg("请输入正确的紧急联系人手机号!")
        return false;
    }
});

$('#mobile').on('input propertychange change', function () {
    var mobile = $('#mobile').val();
    mobile = mobile.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    $(this).val(mobile);
});
$('#mobile1').on('input propertychange change', function () {
    var mobile = $('#mobile1').val();
    mobile = mobile.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    $(this).val(mobile);
});
$('#contactPhone').on('input propertychange change', function () {
    var mobile = $('#contactPhone').val();
    mobile = mobile.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    $(this).val(mobile);
});

function submitInfo() {  
    var memberId = $('#memberName').attr('data-memberId');
    var processId = $('#processId').val();
    var memberName = $('#memberName').val();
    var birthday = $('#birthday').val();
    var age = $('#age').val();
    var idNumber = $('#idNumber').val();
    var mobile = $('#mobile').val();
    var otherEnvironment=$("#otherEnvironment").val();
    var height=$("#height").val();
    var weight=$("#weight").val();
    var bustWaistHips=$("#bustWaistHips").val();
    var sports=$("#sports").val();
    var sportPurpose=$("#sportPurpose").val();
    if ($('#province').val() !== ''){
        var cityId = $('#city').val();
    }else{
        var cityId = '';
    }
    var city = $('#street').val();
    var contact = $('#contact').val();
    var contactPhone = $('#contactPhone').val();
    var remark = $('#remark').val();
    var historical = $('#historical').val();
    var allergy=$("#allergy").val();
    var generalDrugs = $("#generalDrugs").val();
    var loseWeight=$("#loseWeight").val();
    var reason=$("#reason").val();
    var otherPathological=$("#otherPathological").val();
    var temperature=$("#temperature").val();
    //所有的单选传值
    var gender = $('input:radio[name="sex"]:checked').val();
    var maritalStatus=$('input:radio[name="maritalStatus"]:checked').val();
    var livingEnvironment=$('input:radio[name="livingEnvironment"]:checked').val();
    var sleepQuality=$('input:radio[name="sleepQuality"]:checked').val();
    var physicalActivity=$('input:radio[name="physicalActivity"]:checked').val(); 
    var contactLenses=$('input:radio[name="contactLenses"]:checked').val(); 
    var personalCharacter=$('input:radio[name="personalCharacter"]:checked').val(); 
    var makeup=$('input:radio[name="makeup"]:checked').val(); 
    var skinCondition=$('input:radio[name="skinCondition"]:checked').val(); 
    var healthyState=$('input:radio[name="healthyState"]:checked').val(); 
    var pregnancy=$('input:radio[name="pregnancy"]:checked').val(); 
    var menstrualPhysiology=$('input:radio[name="menstrualPhysiology"]:checked').val(); 
    
    if (memberId){
        var expandingId = $('#memberName').attr('data-expandingId');
        var consultingId = $('#memberName').attr('data-consultingId');
        var oldName = $('#memberName').attr('old-memberName');
        if (memberName !== oldName){
            layer.msg('老客户无法在此处修改姓名等基本信息！');
            return false;
        }
    }else{
        memberId = '';
        var expandingId = '';
        var consultingId = '';
        if (memberName.length <= 0) {
            layer.msg('请选择输入顾客姓名！');
            return false;
        }
        if (memberName.length < 2) {
            layer.msg('顾客姓名不少于2个字！');
            return false;
        }
        if (mobile.length <= 0) {
            layer.msg('请填写顾客手机号！');
            return false;
        }
        if (birthday.length <= 0) {
            layer.msg('请填写顾客出生年月！');
            return false;
        }
    }   
    var regMobile = /^[1][3-9][0-9]{9}$/;
    if (!regMobile.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }
    if(contactPhone){
        if (!regMobile.test(contactPhone)) {
            layer.msg("请输入正确的联系人手机号!")
            return false;
        }
    }
    if(idNumber){
        var reg = /^\d{17}(\d|x|X)$/;
        if (!reg.test(idNumber)) {
            layer.msg("请输入正确的身份证号!")
            return false;
        }
    }
    //身体信息单选是,校验input
    var radioDisabled=$(".radioDisabled");
    for(var i=0;i<radioDisabled.length;i++){
        var patientSex=$(radioDisabled[i]).find(".patient-sex");
        var ipt=patientSex.closest(".radioDisabled").find("input[type='text']");
        if(patientSex.find("input[value='yes']").is(":checked")&&ipt.val().trim()==""){
           ipt.focus();
           layer.msg(ipt.attr("tip"));
           return false;
        }
    }  

    if(dataSourceVal == 10){
        if(introducerVal == ''){
            return layer.msg('请选择介绍人')
        }
    }
    if(dataSourceVal == 9){
        if(introducerVal == ''){
            return layer.msg('请选择员工')
        }
    }

    if ($('#service').select2("data").length == 0 || $('#service').select2("data")[0].id == "") {
        return layer.msg('请选择咨询项目')
    } else {
        var serviceId = $('#service').select2("data")[0].id;
        var serviceName = $('#service').select2("data")[0].text;
    }
    if ($('#advUser').select2("data").length == 0 || $('#advUser').select2("data")[0].id == "") {
        return layer.msg('请选择咨询院长')
    } else {
        var advUserId = $('#advUser').select2("data")[0].id;
        var advUserName = $('#advUser').select2("data")[0].text;
    }
    
    var cmd = "medical/patientRegistry";
    var datas = {
        merchantId: params.merchantId,
        userId: params.userId,
        memberName: memberName,
        gender: gender,
        birthday: birthday,
        age: age,
        mobile: mobile,
        contact: contact,
        contactPhone: contactPhone,
        idNumber: idNumber,
        city: city,
        cityId: cityId,
        remark: remark,
        serviceId: serviceId,
        serviceName: serviceName,
        advUserId: advUserId,
        advUserName: advUserName,
        memberId: memberId,
        expandingId: expandingId,
        consultingId: consultingId,
        processId: processId,
        cosmeticEnvironment:hairdstr,
        otherEnvironment:otherEnvironment,
        otherPathological:otherPathological,
        pathological:morbiditystr,
        introducerId: introducerVal,
        dataSource: dataSourceVal,
        introducer:person,
        allergy:allergy,
        historical:historical,
        loseWeight:loseWeight,
        reason:reason,
        height:height,
        weight:weight,
        bustWaistHips:bustWaistHips,
        sports:sports,
        sportPurpose:sportPurpose,
        maritalStatus:maritalStatus,
        livingEnvironment:livingEnvironment,
        sleepQuality:sleepQuality,
        physicalActivity:physicalActivity,
        contactLenses:contactLenses,
        personalCharacter:personalCharacter,
        makeup:makeup,
        skinCondition:skinCondition,
        healthyState:healthyState,
        pregnancy:pregnancy,
        menstrualPhysiology:menstrualPhysiology,
        caseId:caseId,
        temperature:temperature,
        generalDrugs:generalDrugs
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            clearReserve();
        } else {
            layer.msg(re.msg);
        }
    })
}
//刷新页面
function refreshReserve(info) {
    caseId=info.caseId;
    console.log("info",info);
    if(info.processId){
        $('#processId').val(info.processId)
    }else{
        $('#processId').val('');
    }
    if (info.memberName) {
        $('#memberName').val(info.memberName);
    } else {
        $('#memberName').val('');
    }
    $(".personSex input[value='"+info.gender+"']").attr("checked","checked");
    var radioChecked={
        maritalStatus:info.maritalStatus,
        livingEnvironment:info.livingEnvironment,
        sleepQuality:info.sleepQuality,
        physicalActivity:info.physicalActivity,
        contactLenses:info.contactLenses,
        personalCharacter:info.personalCharacter,
        makeup:info.makeup,
        skinCondition:info.skinCondition,
        healthyState:info.healthyState,
        pregnancy:info.pregnancy,
        menstrualPhysiology:info.menstrualPhysiology,
    }
    //所有单选赋值
    for(var i in radioChecked){
        $("."+i).find("input[value='"+radioChecked[i]+"']").prop("checked","checked");
    }
    //病态复选框赋值
    var morbidityBox=$(".morbidity").find("input[type='checkbox']");
    var pathologicalArr=info.pathological.split(",");
    for(var i=0;i<pathologicalArr.length;i++){
        for(var j=0;j<morbidityBox.length;j++){
           if(pathologicalArr[i]==1){
            $(morbidityBox[i]).prop("checked","checked");
           }
        }
    }
    if($("#morbidity8").is(':checked')){
        $("#otherPathological").removeAttr("disabled");
        $("#otherPathological").val(info.otherPathological);
    }else{
        $("#otherPathological").attr("disabled","disabled");
    }
    //美容环境复选框赋值
    var hairdressingBox=$(".hairdressing").find("input[type='checkbox']");
    var hairdressingArr=info.cosmeticEnvironment.split(",");
    for(var i=0;i<hairdressingArr.length;i++){
        for(var j=0;j<hairdressingBox.length;j++){
           if(hairdressingArr[i]==1){
            $(hairdressingBox[i]).prop("checked","checked");
           }
        }
    }
    if($("#cosmeticEnvironment4").is(':checked')){
        $("#otherEnvironment").removeAttr("disabled");
        $("#otherEnvironment").val(info.otherEnvironment);
    }else{
        $("#otherEnvironment").attr("disabled","disabled");
    }
   

    //病态和美容环境赋值;
    if(info.dataSource==""){
        $('#dataSource').val([""]).trigger('change');
    }else{
        if(info.dataSource == 9){
            if(info.introducer==""){
                $('#introducer3').val([""]).trigger('change');
            }else{
                $('#introducer3').val([info.introducerId]).trigger('change');
            }
        }else{
            if(info.introducer==""){
                $('#introducer').val([""]).trigger('change');
            }else{
                $('#introducer').val([info.introducerId]).trigger('change');
            }
        }
        $('#dataSource').val([info.dataSource]).trigger('change');
    }
    $('#memberName').attr('old-memberName', info.memberName);
    $('#memberName').attr('disabled','disabled');
    $('#removeInfo').css('display','inline-block');
    $('#memberName').attr('data-memberId', info.memberId);
    $('#memberName').attr('data-expandingId', info.expandingId);
    $('#memberName').attr('data-consultingId', info.consultingId);
    $("#height").val(info.height);
    $("#weight").val(info.weight);
    $("#bustWaistHips").val(info.bustWaistHips);
    $("#sports").val(info.sports);
    $("#sportPurpose").val(info.sportPurpose);
    if (info.mobile) {
        $('#mobile').val(info.mobile)
    } else {
        $('#mobile').val('');
    }
    $('#mobile').attr('disabled','disabled');
    if (info.gender) {
        $('input:radio[name="sex"][value="' + info.gender +'"]').click();
    }
    $('input:radio[name="sex"]').attr('disabled', 'disabled');
    if (info.birthday) {
        $('#birthday').val(info.birthday)
    } else {
        $('#birthday').val('');
    }
    $('#birthday').attr('disabled', 'disabled');
    $("#temperature").val(info.temperature);
    var age = String(info.age);
    if (age) {
        $('#age').val(age)
    } else {
        $('#age').val('');
    }
    if (info.idNumber) {
        $('#idNumber').val(info.idNumber)
    } else {
        $('#idNumber').val('');
    }
    $('#idNumber').attr('disabled', 'disabled');
    if (info.cityId) {
        var code = info.cityId.substring(0,2);
        $('#province').val(code);
        citySelectInit(code);
    }
    if (info.city) {
        $('#street').val(info.city);
    }else{
        $('#street').val('');
    }
    if (info.contacts) {
        $('#contact').val(info.contacts);
    }else{
        $('#contact').val('');
    }
    if (info.contactsPhone) {
        $('#contactPhone').val(info.contactsPhone);
    }else{
        $('#contactPhone').val('');
    }
    if (info.remark) {
        $('#remark').val(info.remark);
    }else{
        $('#remark').val('');
    }      
    if(info.allergy.length > 0) {
        $('#allergy').val(info.allergy);
        $('#allergy').removeAttr('disabled');
        $('input:radio[name="allergy"][value="yes"]').click();
    }else{
        $('#allergy').val('');
        $('#allergy').attr('disabled','disabled');
        $('input:radio[name="allergy"][value="no"]').click();
    }      
    if (info.historical.length > 0) {
        $('#historical').val(info.historical);
        $('#historical').removeAttr('disabled');
        $('input:radio[name="historical"][value="yes"]').click();
    }else{
        $('#historical').val('');
        $('#historical').attr('disabled','disabled');
        $('input:radio[name="historical"][value="no"]').click();
    }
    if (info.generalDrugs.length > 0) {
        $('#generalDrugs').val(info.generalDrugs);
        $('#generalDrugs').removeAttr('disabled');
        $('input:radio[name="generalDrugs"][value="yes"]').click();
    }else{
        $('#generalDrugs').val('');
        $('#generalDrugs').attr('disabled','disabled');
        $('input:radio[name="generalDrugs"][value="no"]').click();
    }
    if (info.loseWeight.length > 0) {
        $('#loseWeight').val(info.loseWeight);
        $('#loseWeight').removeAttr('disabled');
        $('input:radio[name="weightHis"][value="yes"]').click();
    }else{
        $('#loseWeight').val('');
        $('#loseWeight').attr('disabled','disabled');
        $('input:radio[name="weightHis"][value="no"]').click();
    }
    if (info.reason.length > 0) {
        $('#reason').val(info.reason);
        $('#reason').removeAttr('disabled');
        $('input:radio[name="effect"][value="yes"]').click();
    }else{
        $('#reason').val('');
        $('#reason').attr('disabled','disabled');
        $('input:radio[name="effect"][value="no"]').click();
    }
    var consultingInfos = info.consultingInfos;
    if (consultingInfos.length > 0){  
        var box = '<div style="overflow:hidden;padding:10px 0;border-bottom:1px solid #ccc;"><span style="float:left;font-size: 16px;line-height: 35px;margin-left: 4px;color:#FF7930;font-weight: bold;">历史信息</span><button class="btn btn-info" style="float: right;margin-right:20px;" onclick="changeHis(this)">收起</button></div><div class="consultHistory his-list">';
        for (var i = 0; i < consultingInfos.length; i++) {
            box +=`<div class="card-info consult-history">
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
        box +='</div>'
        $('#consultHistory').html(box);
    }
    if (info.newConsultingInfos){
        if (info.newConsultingInfos.advUserId) {
            $('#advUser').val([info.newConsultingInfos.advUserId]).trigger('change');
        }
        if (info.newConsultingInfos.serviceId) {
            $('#service').val([info.newConsultingInfos.serviceId]).trigger('change');
        }
    }    
}

//清除页面
function clearReserve() {
    $('#removeInfo').css('display', 'none');
    $('#memberName').val(''); 
    $('#memberName').removeAttr('disabled'); 
    $('#memberName').removeAttr('old-memberName');
    $('#memberName').removeAttr('data-memberId');
    $('#memberName').removeAttr('data-expandingId');
    $('#memberName').removeAttr('data-consultingId'); 
    $('#mobile').val('');
    $('#mobile').removeAttr('disabled');
    $('input:radio[name="sex"][value="0"]').click();
    $('input:radio[name="sex"]').removeAttr('disabled');
    $('#birthday').val('');
    $('#birthday').removeAttr('disabled');
    $('#age').val('');
    $('#idNumber').val('');
    $('#idNumber').removeAttr('disabled');
    $('#province').val('');
    $('#city').html('<option value="">请选择市</option>');
    $('#street').val('');
    $('#contact').val('');
    $('#contactPhone').val('');
    $('#remark').val('');
    //身体信息的input清空重置，复选框重置
    $('#allergy,#historical,#loseWeight,#reason,#otherEnvironment,#otherPathological,#generalDrugs').val('');
    $('#allergy,#historical,#loseWeight,#reason,#otherEnvironment,#otherPathological,#generalDrugs').attr('disabled','disabled');
    $(".morbidity,.hairdressing").find("input[type='checkbox']").removeAttr("checked");
    //重置咨询信息
    $('#service').val(['']).trigger('change');
    $('#advUser').val(['']).trigger('change');
    $('#consultHistory').html('')
    //数据来源的select和介绍人的select默认第一个选中
    $("#dataSource option:first").prop("selected", 'selected');
    $('#introducer').val(['']).trigger('change');
    $("#showIntroducer").hide();
    $('#introducer3').val(['']).trigger('change');
    $("#showIntroducer3").hide();
    $("#temperature,#height,#weight,#bustWaistHips,#sports,#sportPurpose,#contact,#contactPhone,#remark").val("");
    //重置所有的单选点击提交成功后第一个选中
    $(".personSex").find(".patient-sex:last input[type='radio']").prop("checked","checked");
    var radioSingular=$(".radioSingular");
    for(var i=0;i<radioSingular.length;i++){
        $(radioSingular[i]).find(".patient-sex:first input[type='radio']").prop("checked","checked");
    }

    dataSourceVal = '';
    introducerVal = '';
    person = '';
}
// 搜索人员表格初始化
function searchInit() {
    $('#searchList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'memberName', title: '姓名', align: 'center' },
        {
            field: 'age', title: '年龄', align: 'center'
        },
        {
            field: 'mobile', title: '电话', align: 'center'
        },
        {
            field: 'birthday', title: '生日', align: 'center'
        }],
        onClickRow: function (row, element) {
            $(".search-box").hide();
            refreshReserve(row);
        }
    });
    $('#searchList').bootstrapTable('hideLoading');
}
//登记列表
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

function searchParam() {
    $('#registTable').bootstrapTable('destroy');
    tableInit();
    //$('#registTable').bootstrapTable('refresh');
}
var TableInit = function (id, url, columns, param) {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#' + id).bootstrapTable({
            url: url,
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
            pageList: [10, 25, 50, 100],
            smartDisplay: false,
            strictSearch: false,
            clickToSelect: false,
            uniqueId: 'id',
            columns: columns           
        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (param) {
        if ($('#advUser1').select2("data").length !== 0 && $('#advUser1').select2("data")[0].id !== "") {
            var advUserId = $('#advUser1').select2("data")[0].id;
        } else {
            var advUserId = '';
        }
        if ($('#service1').select2("data").length !== 0 && $('#service1').select2("data")[0].id !== "") {
            var serviceId = $('#service1').select2("data")[0].id;
        } else {
            var serviceId = '';
        }
        param['data'] = JSON.stringify({
            merchantId: params.merchantId,
            page: param.offset / param.limit + 1,
            rows: param.limit,
            searchParam: $('#searchParam').val().trim(),
            advUserId: advUserId,
            serviceId: serviceId,
            bgTime: $('#startDate').val(),
            edTime: $('#endDate').val()
        })
        param['cmd'] = 'medical/getMedicalInfo';

        if (!param) return param;

        return param;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
        {
            field: 'memberName',
            title: '顾客姓名',
            // width: 100,
            align: "center"
        }, {
            field: 'gender',
            title: '性别',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                var re = "";
                switch (val) {
                    case 0:
                        re = '女'
                        break;
                    case 1:
                        re = '男'
                        break;
                    default:
                        re = '保密'
                        break;
                }
                return re;
            }
        }, {
            field: 'age',
            title: '年龄',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                if(val == ''){
                    return '-';
                }else{
                    return val;
                }
            }
        }, {
            field: 'mobile',
            title: '手机号',
            // width: 100,
            align: "center"
        }, {
            field: 'serviceName',
            title: '咨询项目',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                if(val == ''){
                    return '-';
                }else{
                    return val;
                }
            }
        }, {
            field: 'advUserName',
            title: '咨询院长',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                if (val == '') {
                    return '-';
                } else {
                    return val;
                }
            }
        }, {
            field: 'createTime',
            title: '办理时间',
            // width: 100,
            align: "center"
        }
    ];

    Table = new TableInit('registTable', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

//预约登记
laydate.render({
    elem: '#birthday1',
    type: 'date',
    max: nowDate,
    // value: new Date()
    done: function (value, date, endDate) {
        var nowYear = new Date().getFullYear();
        if(value){
            $('#age1').val(nowYear - date.year)
        }else{
            $('#age1').val('')
        }
        
    }
});
var todayTime = new Date()
var today = ''
var thisyear = today.getFullYear
var thismonth = today.getMonth + 1
var thisday = today.getDay
today = thisyear + '-' + thismonth + '-' + thisday
laydate.render({
    elem: '#arriveTime',
    type: 'datetime',
    min: today,
    value: new Date()
});
//弹出老顾客信息
$('#memberName1').on('input', function () {
    var memberName = $(this).val();
    if (memberName.length > 0) {
        $('#removeInfo1').css('display', 'inline-block');
    } else {
        $('#removeInfo1').css('display', 'none');
    }
})
$('#removeInfo1').on('click', function () {
    $('#memberName1').val('');
    $('#removeInfo1').css('display', 'none');
    clearReserve1();
})
//搜索小组成员
$("#searchOld1").on("click", function (e) {
    var memberName = $('#memberName1').val();
    var cmd = "medical/getRegCustomers";
    var datas = {
        merchantId: params.merchantId,
        memberName: memberName
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data.length > 0) {
                $('#searchList1').bootstrapTable('load', re.data);
            }
        } else {
            layer.msg(re.msg);
        }
    })
    $(".search-box").show();
    $(document).on("click", function () {
        $(".search-box").hide();
    });
    e = e || event;
    stopFunc(e);
});
$('#searchList1').on("click", function (e) {
    e = e || event;
    stopFunc(e);
});
function stopFunc(e) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}
//刷新页面
function refreshReserve1(info) {
    if (info.memberName) {
        $('#memberName1').val(info.memberName)
    } else {
        $('#memberName1').val('');
    }
    $('#memberName1').attr('old-memberName', info.memberName);
    $('#memberName1').attr('data-memberId', info.memberId);
    $('#memberName1').attr('disabled','disabled');
    $('#removeInfo1').css('display','inline-block');
    if (info.mobile) {
        $('#mobile1').val(info.mobile)
    } else {
        $('#mobile1').val('');
    }
    $('#mobile1').attr('disabled', 'disabled');
    if (info.gender) {
        $('input:radio[name="sex1"][value="' + info.gender + '"]').click();
    }
    $('input:radio[name="sex1"]').attr('disabled', 'disabled');
    if (info.birthday) {
        $('#birthday1').val(info.birthday)
    } else {
        $('#birthday1').val('');
    }
    $('#birthday1').attr('disabled', 'disabled');
    var age = String(info.age);
    if (age) {
        $('#age1').val(age)
    } else {
        $('#age1').val('');
    }

    if(info.dataSource==""){
        $('#dataSource1').val([""]).trigger('change');
    }else{
        if(info.dataSource == 9){
            if(info.introducer==""){
                $('#introducer2').val([""]).trigger('change');
            }else{
                $('#introducer2').val([info.introducer]).trigger('change');
            }
        }else{
            if(info.introducer==""){
                $('#introducer1').val([""]).trigger('change');
            }else{
                $('#introducer1').val([info.introducer]).trigger('change');
            }
        }
        $('#dataSource1').val([info.dataSource]).trigger('change');
    }
}
//清除页面
function clearReserve1() {
    $('#removeInfo1').css('display', 'none');
    $('#memberName1').val('');
    $('#memberName1').removeAttr('disabled'); 
    $('#memberName1').removeAttr('old-memberName');
    $('#memberName1').removeAttr('data-memberId');
    $('#mobile1').val('');
    $('#mobile1').removeAttr('disabled');
    $('input:radio[name="sex1"][value="0"]').click();
    $('input:radio[name="sex1"]').removeAttr('disabled');
    $('#birthday1').val('');
    $('#birthday1').removeAttr('disabled');
    $('#age1').val('');
    $('#arriveTime').val(getSec(new Date(), 1));
    
    $('#service2').val(['']).trigger('change');
    $('#advUser2').val(['']).trigger('change');
    //数据来源的select和介绍人的select默认第一个选中
    $("#dataSource1 option:first").prop("selected", 'selected');
    dataSourceVal1 = '';
    introducerVal1 = '';
    person1 = '';
    $('#introducer1').val(['']).trigger('change');
    $("#showIntroducer1").hide();
    $('#introducer2').val(['']).trigger('change');
    $("#showIntroducer2").hide();
    //重置所有的单选点击提交成功后第一个选中
    $(".personSex1").find(".patient-sex:first input[type='radio']").prop("checked","checked");
}
function submitInfo1() {
    var memberId = $('#memberName1').attr('data-memberId');
    var memberName = $('#memberName1').val();
    var gender = $('input:radio[name="sex1"]:checked').val();
    var birthday = $('#birthday1').val();
    var age = $('#age1').val();
    var mobile = $('#mobile1').val();
    var bespokeTime = $('#arriveTime').val().substring(0, 16);    
    if (memberId) {
        var oldName = $('#memberName1').attr('old-memberName');
        if (memberName !== oldName) {
            layer.msg('老客户无法在此处修改姓名等基本信息！');
            return false;
        }
    } else {
        memberId = '';
        if (memberName.length <= 0) {
            layer.msg('请选择输入顾客姓名！');
            return false;
        }
        if (memberName.length < 2) {
            layer.msg('顾客姓名不少于2个字！');
            return false;
        }
        if (mobile.length <= 0) {
            layer.msg('请填写顾客手机号！');
            return false;
        }
    }

    var regMobile = /^[1][3-9][0-9]{9}$/;
    if (!regMobile.test(mobile)) {
        layer.msg("请输入正确的手机号!")
        return false;
    }

    if(dataSourceVal1 == 10){
        if(introducerVal1 == ''){
            return layer.msg('请选择介绍人')
        }
    }
    if(dataSourceVal1 == 9){
        if(!$('#introducer2').val()){
            return layer.msg('请选择销售员工')
        }else{
            introducerVal1 = $('#introducer2').val();
        }
    }

    if (bespokeTime.length <= 0) {
        layer.msg('请填写到院时间！');
        return false;
    }
    if ($('#service2').select2("data").length == 0 || $('#service2').select2("data")[0].id == "") {
        return layer.msg('请选择咨询项目')
    } else {
        var serviceId = $('#service2').select2("data")[0].id;
        var serviceName = $('#service2').select2("data")[0].text;
    }
    if ($('#advUser2').select2("data").length == 0 || $('#advUser2').select2("data")[0].id == "") {
        // return layer.msg('请选择咨询院长')
        // var advUserId = '';
        // var advUserName = '';
    } else {
        var advUserId = $('#advUser2').select2("data")[0].id;
        var advUserName = $('#advUser2').select2("data")[0].text;
    }
    
    var cmd = "medical/makeBespoke";
    var datas = {
        merchantId: params.merchantId,
        userId: params.userId,
        memberName: memberName,
        gender: gender,
        birthday: birthday,
        age: age,
        mobile: mobile,
        serviceId: serviceId,
        serviceName: serviceName,
        advUserId: advUserId,
        advUserName: advUserName,
        memberId: memberId,
        bespokeTime: bespokeTime,
        introducerId: introducerVal1,
        dataSource: dataSourceVal1,
        introducerName:person1
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            clearReserve1();
        } else {
            layer.msg(re.msg);
        }
    })
}
// 搜索人员表格初始化
function searchInit1() {
    $('#searchList1').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [
            { field: 'memberName', title: '姓名', align: 'center' },
            {
                field: 'age', title: '年龄', align: 'center'
            },
            {
                field: 'mobile', title: '电话', align: 'center'
            },
            {
                field: 'birthday', title: '生日', align: 'center'
            }],
        onClickRow: function (row, element) {
            $(".search-box").hide();
            refreshReserve1(row);
        }
    });
    $('#searchList1').bootstrapTable('hideLoading');
}
//预约查看
var registNow = getSec(new Date(), 5)
laydate.render({
    elem: '#startDate1',
    value: registNow,
    done: function (value, date, endDate) {
        var startDate = new Date(value);
        var endTime = new Date($('#endDate1').val());
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#startDate1').val($('#endDate1').val());
        }
    }
});
laydate.render({
    elem: '#endDate1',
    value: registNow,
    done: function (value, date, endDate) {
        var startDate = new Date($('#startDate1').val());
        var endTime = new Date(value);
        if (endTime < startDate) {
            layer.msg('结束时间不能小于开始时间');
            $('#endDate1').val($('#startDate1').val());
        }
    }
});

function searchParam1() {
    getReserve();
}
//转顾客
function changeReserve(memberId, processId) {
    var cmd = "medical/changeToPatients";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        processId: processId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            $('#patientRegist').click()
            clearReserve();
            refreshReserve(re.data[0]);
        } else {
            layer.msg(re.msg);
        }
    })
}
function deleteReserve(memberId, BespokeId) {
    var cmd = "medical/deleteBespoke";
    var datas = {
        merchantId: params.merchantId,
        memberId: memberId,
        BespokeId: BespokeId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            layer.msg(re.msg);
            getReserve();
        } else {
            layer.msg(re.msg);
        }
    })
}
//渲染预约人员
function getReserve() {
    var bgTime = $('#startDate1').val();
    var edTime = $('#endDate1').val();
    var searchParam = $('#searchParam1').val();
    if ($('#service3').select2("data").length == 0 || $('#service3').select2("data")[0].id == "") {
        var serviceId = '';
    } else {
        var serviceId = $('#service3').select2("data")[0].id;
    }
    var cmd = "medical/getBespokeList";
    var datas = {
        merchantId: params.merchantId,
        bgTime: bgTime,
        edTime: edTime,
        searchParam: searchParam,
        serviceId: serviceId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data){
                if (re.data.morningList) {
                    var morningList = re.data.morningList;
                    $('#morningList').html(refreshBox(morningList));
                }
                if (re.data.afternoonList) {
                    var afternoonList = re.data.afternoonList;
                    $('#afternoonList').html(refreshBox(afternoonList));
                }
            }
        } else {
            layer.msg(re.msg);
        }
    })
}
function refreshBox(data) {
    var box = '';
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
        box +=`<div class="regist-box">
                    <div class="regist-content">
                        <div class="content-line">
                            <b class="patient-name">${data[i].memberName}</b>
                            <span class="patient-age">${data[i].age || '-'}</span>岁
                            <span class="patient-sex">${gender}</span>
                            <span class="patient-phone">${data[i].mobile}</span>
                        </div>
                        <div class="content-line">到店时间：<b class="arrive-time">${data[i].bespokeTime}</b></div>
                        <div class="content-line">咨询项目：<b class="patient-content">${data[i].serviceName || '-'}</b></div>
                        <div class="content-line">咨询院长：<b class="patient-docter">${data[i].advUserName || '-'}</b></div>
                    </div>
                    <div class="btn-list">
                        <a href="javascript:;" class="change-btn" onclick="changeReserve(${data[i].memberId + ',' + data[i].processId})">转顾客</a>
                        <a href="javascript:;" class="change-btn" onclick="deleteReserve(${data[i].memberId + ',' + data[i].bespokeId})">删除</a>
                    </div>
                </div>`;       
    }
    return box;
}

function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
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
$('.title-name').click(function () {
    $('.top-title').find('.title-name').removeClass('active');
    $(this).addClass('active');
    var id = $(this).attr('id');
    $('.table-info').css('display', 'none');
    $('.' + id).css('display', 'block');
    if ($(this).attr('id') == 'registList'){
        //登记列表
        searchParam();
    }
    if ($(this).attr('id') == 'lookList'){
        //登记列表
        getReserve();
    }
})
// $('#titleSum').click(function () {
//     $(this).addClass('active');
//     $('#titleName').removeClass('active');
//     $('#selectAdd').css('display', 'none');
//     $('#selectEdit').css('display', 'block');
// })
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