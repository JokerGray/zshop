$(document).ready(function(){
    init();
});

// 页面交互初始化
function init() {
    // 切换固定和浮动
    $('.checkbox-inline').click(function(){
        $(this).addClass('checked').siblings().removeClass('checked');
        $('.set-con-content').eq($(this).index()).removeClass('hidden').siblings().addClass('hidden');
    });
    // 设置浮动的修改按钮
    $('.float-set-con table').on('click', '.edit-btn', function(){
        var $tr = $(this).parent().parent().addClass('edit');
        $tr.find('input').each(function(){
            $(this).val($(this).prev().text());
        })
    });
    // 设置浮动的提交按钮
    $('.float-set-con table').on('click', '.submit-btn', function(){
        var $tr = $(this).parent().parent().removeClass('edit');
        $tr.find('.num').each(function(){
            $(this).text($(this).next().val());
        })
    });
    // 设置浮动的删除按钮
    $('.float-set-con table').on('click', '.remove-btn', function(){
        $(this).parent().parent().remove();
    });
    // 设置浮动在新增按钮
    $('.btn-add').click(function(){
        var $dom = $($('#addTpl').html());
        $dom.find('.num').text(0);
        $dom.find('input').val(0);
        $('.float-set-con .table tbody').append($dom);
    })
}
// 修改固定底薪
function showModify (){
    $('.fixed-set-con input').val($('.fixed-set-con .num').text());
    $('.input-edit').removeClass('hidden').siblings().addClass('hidden');
}
function setFixedSalary() {
    $('.input-edit').addClass('hidden').siblings().removeClass('hidden');
    $('.fixed-set-con .num').text($('.fixed-set-con input').val());
}
