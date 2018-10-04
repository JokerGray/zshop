$(function(){
    var phone = getUrlParams("phone");
    
    $('#phone').val(phone);
    
    var data = reqAjax('trialMsgTemplate/ajaxMsgTemplateList', JSON.stringify({
        state: "1",
        pageNo: 1,
        pageSize: 1000
    }));
    
    if((data.data && data.data) && data.code == 1){
        selectMsgCode(data.data.list);
    }else{
        if(id && id){
            layer.alert('数据读取失败,请联系客服');
        }
    }
});

function selectMsgCode(o){
    var $sel = $('#selectMsgCode');
    $sel.append('<option value="">--请选择--</option>');
    
    if(o && o){
        $.each(o, function(k, v){
            $sel.append('<option value="' + v.content + '">' + v.code + '</option>');
        });
    }
    
    $sel.on('change', function(){
        $('#content').val($(this).val());
    });
}