(function($){

    layui.use(['jquery', 'form'], function() {
        $ = layui.jquery;
        form = layui.form();
        $form = $('form');
        jurisdictionSize();
        loadprovince('0');
    });
    //获取权限类型
    function jurisdictionSize(){
        var res = reqAjax("operations/getSysConfigList","");
        var sHtml = "";//计费等级
        var pHtml = "";//频道类型
        if(res.code == 1){
            var row = res.data;
            for(var i=0;i<row.cmsChannelList.length;i++){
                var rowA = row.cmsChannelList[i];
                pHtml += '<option value="' + rowA.channelId + '">' + rowA.channelName + '</option>';
            };
            for(var j=0;j<row.chargeLevel.length;j++){
                var rowA = row.chargeLevel[j];
                sHtml += '<option value="' + rowA.id + '">' + rowA.levelName + '</option>';
            };
            $form.find('select[name=jurisLevel]').append(sHtml);
            var val = $form.find('select[name=jurisLevel]').children('option').eq(1).val();
            $form.find('select[name=jurisLevel]').val(val);
            $form.find('select[name=jurisLevel]').children('option').eq(1).select();
            $form.find('select[name=jurisChannel]').append(pHtml);
            form.render();
            
        }else{
            layer.msg(res.msg);
        }
    };

    function loadprovince(code){
        var param = '{"parentcode":' + code  +'}';
        var res = reqAjax("operations/getProvinceList",param);
        var lHtml = "";//省市
        if(res.code == 1){
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                lHtml += '<option value="' + row.code + '">' + row.areaname + '</option>';
            };
            if(code == '0'){
                $form.find('select[name=province]').append(lHtml);
                $form.find('select[name=city]').attr('disabled');
            }else if(code != ""){
                $form.find('select[name=city]').html(lHtml);
                $form.find('select[name=city]').prop("disabled", false);
            }
            form.render();
        }
    }

    form.on('select(province)', function(data){
        loadprovince(data.value);
    });

    //新增模态框 input限制输数字
    $("#upgradeLevel").keyup(function () {
        $(this).val($(this).val().replace(/^0/,''));
    })
})(jQuery);