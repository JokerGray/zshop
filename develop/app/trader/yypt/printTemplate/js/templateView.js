    var merchantId = getUrlParams("merchantId"); //商户id
    var templateSetId = getUrlParams("templateSetId"); //注册表数据id
    var templateType = getUrlParams("templateType"); //模板类型A4, RM58, RM80
    var templateSetName = getUrlParams("templateSetName"); //模板名称

    //初始化
    $(function(){
        comgetContent(templateType);
    });

    //关闭
    $(".close-btn").on("click",function(){
        window.location.href="basicTemplate.html?merchantId=" + merchantId;
    });

    //编辑
    $(".edit-btn").on("click",function(){
        var types = $(".template-nav .acv").attr("data-type");
        window.location.href="templateSetting.html?merchantId=" + merchantId + "&templateType=" + types + "&templateSetId=" + templateSetId+"&templateSetName="+templateSetName;
    });

