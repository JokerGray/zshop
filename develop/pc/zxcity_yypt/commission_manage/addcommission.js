(function($){

    //新增模态框 input限制输数字
    $("#systemName").keyup(function () {
        $(this).val($(this).val().replace(/[^\d.]/g,''));
    })

    $("#commissionMoney").keyup(function () {
        $(this).val($(this).val().replace(/[^\d.]/g,''));
    })

})(jQuery);