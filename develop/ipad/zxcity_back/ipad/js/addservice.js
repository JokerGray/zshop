//初始化下拉列表
function loadDropdownList(data){
    var sHtml = '';
    for(var i=0; i<data.length; i++){
        sHtml += '<tr id="'+data[i].id+'" data-name="'+data[i].name+'"><td>'+(i+1)+'</td><td>'+data[i].name+'</td><td>'+data[i].price+'</td></tr>';
    }
    $("#dropdownList table>tbody").html(sHtml);
}

$("#dropdownList").delegate("table>tbody>tr", "click", function(){
    var serviceName = $(this).attr("data-name");
    $(".service-wrapper form input[name=serviceName]").val(serviceName);
    $(".service-wrapper form input[name=cardName]").val(serviceName+"卡");
});

//保存
$(".service-wrapper form .submit-btn").click(function(){
    var serviceName = $("form input[name=serviceName]").val(),
        cardName = $("form input[name=cardName]").val(),
        count = $("form input[name=count]").val(),
        price = $("form input[name=count]").val();
    if($.trim(serviceName) == ""){
        layer.msg("请选择服务！");
        return;
    }
    if($.trim(cardName) == ""){
        layer.msg("请输入服务卡名称！");
        return;
    }
    if($.trim(count) == ""){
        layer.msg("请输入次数！");
        return;
    }
    if($.trim(price) == ""){
        layer.msg("请输入服务卡单价！");
        return;
    }
});
