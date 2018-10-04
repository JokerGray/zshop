    var page = 1;
    var rows = 10;
    var locked = true;
    var merchantId = getUrlParams("merchantId"); //商户id
    //接口参数
    var USER_URL = {
        BARCODE :'backstage/findsPrintTemplateAndSetting', //(查询模板)
        OPENSTATU:'backstage/operationsPrintSwitch' //开关
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //初始化
    $(function(){
        getDetail();
    });

    //查询
    function getDetail(){
        var param = {
            "merchantId":merchantId
        }
        reqAjaxAsync(USER_URL.BARCODE,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var sHtml = '';
                for (var i = 0; i < res.data.length; i++) {
                    var row = res.data[i];
                    var type = row.typeRecord || "";
                    if(type==0){
                        sHtml += '<div class="template-list" data-type="'+ "RM80" +'" data-id="'+ row.id +'">'
                    }else{
                        sHtml += '<div class="template-list" data-type="'+ type +'" data-id="'+ row.id +'">'
                    }
                    if(row.switch==1){
                        sHtml +=  '<div class="template-title">' + row.templateName + '</div>'
                        +  '<div class="size-list layui-form">'
                        +   '<div class="layui-input-block">'
                    }else{
                        sHtml +=  '<div class="template-title gray">' + row.templateName + '</div>'
                        + '<div class="size-list layui-form">'
                        +   '<div class="layui-input-block">'
                    }


                        if(type== "A4"){
                            sHtml += '<input type="radio" name="sex'+i +'" value="A4" title="A4"  lay-filter="test" checked >'
                                    + '<input type="radio" name="sex'+i +'" value="RM80" lay-filter="test" title="80mm">'
                            + '<input type="radio" name="sex'+i +'" value="RM58" lay-filter="test" title="58mm">'
                        }else if(type==0 ||type=="RM80"){
                            sHtml += '<input type="radio" name="sex'+i +'" value="A4" lay-filter="test" title="A4" >'
                            + '<input type="radio" name="sex'+i +'" value="RM80" lay-filter="test" title="80mm" checked>'
                            + '<input type="radio" name="sex'+i +'" value="RM58" lay-filter="test" title="58mm" >'
                        }else if(type=="RM58"){
                            sHtml += '<input type="radio" name="sex'+i +'" value="A4" lay-filter="test" title="A4" >'
                            + '<input type="radio" name="sex'+i +'" value="RM80" lay-filter="test" title="80mm">'
                            + '<input type="radio" name="sex'+i +'" value="RM58" lay-filter="test" title="58mm" checked>'
                        }
                    sHtml += '</div>'
                            + '</div>'
                            +'<span class="edit glyphicon glyphicon-edit"></span>'
                            +'  <div class="layui-form-item open-statu">'
                        if(row.switch==1){//启用
                            sHtml +=' <div class="layui-input-block">'
                            +' <input type="checkbox" name="switch" lay-skin="switch" lay-filter="switch" checked>'
                            +' </div>'
                            +' </div> '
                        }else{
                            sHtml +=' <div class="layui-input-block">'
                            +' <input type="checkbox" name="switch" lay-skin="switch" lay-filter="switch" >'
                            +' </div>'
                            +' </div> '
                        }

                    sHtml += '</div>';

                }
                $(".template-box").html(sHtml);
                form.render();
            } else {
                layer.msg(res.msg);
            }
        })
    }

    form.on('radio(test)', function(data){
        $(this).parents(".template-list").attr("data-type",data.value);
    });

    //跳转
    $(".template-box").on("click",".template-list .edit",function(){
        var type = $(this).parents(".template-list").attr("data-type");
        var id = $(this).parents(".template-list").attr("data-id");
        var templateSetName = $(this).parents(".template-list").find(".template-title").text();
        window.location.href="templateView.html?merchantId=" + merchantId + "&templateType=" + type + "&templateSetId=" + id+"&templateSetName="+templateSetName;
    });


    //开关
    form.on('switch(switch)', function(data){
        if(data.elem.checked){
            var status=1;
        }else{
            var status=0;
        }
        var templateSetName = $(this).parents(".template-list").find(".template-title").text();
        var param = {
            "merchantId":merchantId,
            "templateSetName":templateSetName,
            "status":status
        }

        reqAjaxAsync(USER_URL.OPENSTATU,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                layer.msg(res.msg);
                getDetail();
            }else{
                layer.msg(res.msg);
            }
        })
    });