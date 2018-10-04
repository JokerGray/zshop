(function($){
    layui.use(['jquery', 'form'], function() {
        $ = layui.jquery;
        form = layui.form();
        $form = $('form');
        jurisdictionSize();
    });
    //获取权限类型
    function jurisdictionSize(){
        //var code = "menu";
        var param = "{'code':'menu'}";
        var res = reqAjax("operations/dictItemsGroupByType",param);
        var sHtml = "";
        if(res.code == 1){
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                sHtml += '<option value="' + row.id + '">' + row.name + '</option>';
            }
            $form.find('select[name=interest]').append(sHtml);
            form.render();
        }else{
            layer.msg(res.msg);
        }
    };
    //新增模态框 input限制输数字
    $("#systemLevel").keyup(function () {
        $(this).val($(this).val().replace(/^0/,''));
    })
})(jQuery);