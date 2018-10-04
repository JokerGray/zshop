layui.use(['layer', 'jquery'], function () {

    console.log("==============URL Param===============");
    var urlParam = getParams(decodeURI(location.search));
    console.log("==============URL Param===============");

    $("#userName").val(urlParam.userName);
    $("#userPhone").val(urlParam.userPhone);

    var responseData = reqAjax('accountQualityInspection/getInSpectionDetailById', JSON.stringify({id: urlParam.id}))
    console.log("===============详情===============");
    console.log(responseData);
    console.log("===============详情===============");

    // Todo：填充数据
});
