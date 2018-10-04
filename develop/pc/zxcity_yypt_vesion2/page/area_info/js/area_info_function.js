 

$(document).ready(function(){
    $("#addcode").keyup(function () {
        $(this).val($(this).val().replace(/[^0-9.]/g, ''));
    }).bind("paste", function () {  //CTR+V事件处理
        $(this).val($(this).val().replace(/[^0-9.]/g, ''));
    }).css("ime-mode", "disabled"); //CSS设置输入法不可用
    var form = layui.form;
    form.render();
    layui.use('form', function () {
        var form = layui.form;
        form.render();
    })
});