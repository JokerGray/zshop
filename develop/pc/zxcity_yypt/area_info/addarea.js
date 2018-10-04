(function($){
    //新增模态框 input限制输数字
    $("#areaCode").keyup(function () {
        $(this).val($(this).val().replace(/[^\d]/g,''));
        $(this).val($(this).val().replace(/^0/g,''));
    })

    $("#longitude").keyup(function () {
        $(this).val($(this).val().replace(/[^\d.-]/g,''));
    })
    $("#latitude").keyup(function () {
        $(this).val($(this).val().replace(/[^\d.-]/g,''));
    })

    })(jQuery);