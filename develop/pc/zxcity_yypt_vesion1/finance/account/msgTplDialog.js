$(function(){
    var id = getUrlParams("id");
    var data = reqAjax('trialMsgTemplate/ajaxMsgTemplate', JSON.stringify({
        id: id
    }));
    
    if((data.data && data.data) && data.code == 1){
//        debugger;
        $('#code').val(data.data.code);
        $('#content').val(data.data.content);
        $('#remark').val(data.data.remark);
    }else{
        if(id && id){
            layer.alert('数据读取失败,请联系客服');
            $('#code').prop('readonly',true);
            $('#content').prop('readonly',true);
            $('#remark').prop('readonly',true);
        }
    }
})