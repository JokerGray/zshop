    var merchantId = getUrlParams("merchantId"); //商户id
    var templateSetId = getUrlParams("templateSetId"); //注册表数据id
    var templateType = getUrlParams("templateType"); //模板类型A4, RM58, RM80
    var templateSetName = getUrlParams("templateSetName"); //模板名称
    var barr=[];
    var harr=[];
    var farr=[];
    var USER_URL = {
        ALLWORD :'operations/findTemplateSettingDetail', //(查询所有字段)
        SETTEMPLATE:'backstage/addsPrintTemplate',//设置模板
        BARCODE :'backstage/findsPrintTemplate', //(查询模板)isExistence  0不存在 1存在
        SAVETEMPLATE:'backstage/addsPrintTemplateLog' //保存模板
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //初始化
    $(function(){
        comgetContent(templateType);
        setTimeout(function(){
            getRgt();
        },1000);

    });

    $(".template-nav").on("click",".nav-list",function(){
        getRgt();
    });

    //加载右侧所有
    function getRgt(){
        var allHrr="";
        var allBrr="";
        var allFrr="";
        var param = {
            "templateId":templateSetId
        }
        reqAjaxAsync(USER_URL.ALLWORD,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
               for(var i=0;i<res.data.length;i++){
                   var row = res.data[i];
                   if(row.itemType=="H"){
                       allHrr += '<div class="checkbox" data-id="' + row.id + '">'
                           +'<input value="'+ row.id +'" type="checkbox" name="test" title="'+ row.itemName +'" lay-skin="primary" lay-filter="test">'
                       + '(<span class="item-val">' + row.itemValue + '</span>)'
                       +'</div>'
                   }else if(row.itemType=="B"){
                       allBrr  += '<div class="checkbox" data-id="' + row.id + '">'
                       +'<input  value="'+ row.id + '" type="checkbox" name="test" title="'+ row.itemName +'" lay-skin="primary" lay-filter="test">'
                       + '(<span class="item-val">' + row.itemValue + '</span>)'
                       +'</div>'
                   }else if(row.itemType=="F"){
                       allFrr  += '<div class="checkbox" data-id="' + row.id + '">'
                       +'<input  value="'+ row.id+ '" type="checkbox" name="test" title="'+ row.itemName +'" lay-skin="primary" lay-filter="test">'
                           + '(<span class="item-val">' + row.itemValue + '</span>)'
                       +'</div>'
                   }
               }
                $(".basic-value .rgt-list").eq(0).find(".rgt-box").html(allHrr);
                $(".basic-value .rgt-list").eq(1).find(".rgt-box").html(allBrr);
                $(".basic-value .rgt-list").eq(2).find(".rgt-box").html(allFrr);
                form.render();
                var isedit = $(".content-list").attr("data-isexistence");
                var barr=[];
                var harr=[];
                var farr=[];
                for(var q=0;q<res.data.length;q++){
                    var rew = res.data[q];
                    if(rew.itemType=="H"){
                        harr.push(rew);
                    }else if(rew.itemType=="B"){
                        barr.push(rew);
                    }else if(rew.itemType=="F"){
                        farr.push(rew);
                    }
                }
                if(isedit==1){ //存在
                    var field = $(".content-list").attr("data-fieldRecord");//激活的字段
                    var fiearr = field.split(',');
                    if(fiearr.length==res.data.length){
                        $(".basic-value .rgt-list").find("input:checkbox[name='all']").prop("checked",true);
                        form.render();
                    }


                    for(var a=0;a<fiearr.length;a++){
                        //表头
                        for(var b=0;b<harr.length;b++){
                            if(fiearr[a]==harr[b].id){
                                $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='test']").eq(b).prop("checked",true);
                                form.render();
                            }
                        }
                        //表体
                        for(var e=0;e<barr.length;e++){
                            if(fiearr[a]==barr[e].id){
                                $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='test']").eq(e).prop("checked",true);
                                form.render();
                            }
                        }
                        //表尾
                        for(var k=0;k<farr.length;k++){
                            if(fiearr[a]==farr[k].id){
                                $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='test']").eq(k).prop("checked",true);
                                form.render();
                            }
                        }
                    }



                    var list1 = $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='test']:checked");
                    var list2 = $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='test']:checked");
                    var list3 = $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='test']:checked");
                    if(list1.length==0){
                        $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='all']").attr("checked",false);
                        form.render();

                    }else{
                        if(list1.length==harr.length){
                            $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='all']").attr("checked",true);
                            form.render();
                        }
                    }
                    if(list2.length==0){
                        $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='all']").attr("checked",false);
                        form.render();
                    }else{
                        if(list2.length==barr.length){
                            $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='all']").attr("checked",true);
                            form.render();
                        }
                    }
                    if(list2.length==0){
                        $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='all']").attr("checked",false);
                        form.render();
                    }else{
                        if(list3.length==farr.length){
                            $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='all']").attr("checked",true);
                            form.render();
                        }
                    }


                }else{
                    $(".basic-value .rgt-list").find("input:checkbox[name='test']").attr("checked",true);
                    if(harr.length>0){
                        $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='all']").attr("checked",true);
                    }
                    if(barr.length>0){
                        $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='all']").attr("checked",true);
                    }
                    if(farr.length>0){
                        $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='all']").attr("checked",true);
                    }
                    form.render();
                }
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击预览
    $("#viewBtn").on("click",function(){
        layer.open({
            title: ['预览', 'font-size:12px;background-color:#353b53;color:#1be0d6'],
            resize:false,
            type: 1,
            content:$('.view'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['800px', '560px'],
            shade: [0.1, '#fff'],
            end:function(){
                $('.view').hide();
            },
            success:function(layero){
                var index = $(".template-nav .acv").index();
                var val = $(".content-list .artic-list").eq(index).html();
                $(".view").html(val);
                $(".view").css("border","1px solid #000");
                if(index==0){
                    $(".view").width(595);
                }else if(index==1){
                    $(".view").width(302);
                }else{
                    $(".view").width(219);
                }
            }
        });
    });

    //设置为模板
    $("#setTemp").on("click",function(){
        var isTrue = $(".basic-value .rgt-list");
        for(var u=0;u<isTrue.length;u++){
            if(isTrue.eq(u).find("button").attr("data-type")==1){
                layer.msg("请先确定你的修改",{icon:6});
                return false;
            }
        }
        var type = $(".template-nav .acv").attr("data-type");
        var index = $(".template-nav .acv").index();
        var content = $(".content-list .artic-list").eq(index).html();
        var arr = [];
        var list = $("input:checkbox[name='test']:checked");
        if(list.length==0){
            layer.msg("请选中字段",{icon:6});
            return false;
        }
        $("input:checkbox[name='test']:checked").each(function(){
            arr.push($(this).val())
        });
        var fieldRecord = arr.join(",");
        var param = {
            "merchantId":merchantId,
            "templateSetId":templateSetId, //标准模板ID
            "templateSetName":templateSetName, //标准模板名称
            "templateType":type, //模板类型A4, RM58, RM80
            "content":content, //HTML内容
            "fieldRecord":fieldRecord //字段记录id
        }
       reqAjaxAsync(USER_URL.SETTEMPLATE,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                layer.msg(res.msg,{icon:1});
                setTimeout(function(){
                    window.location.href="basicTemplate.html?merchantId=" + merchantId;
                },1000);
            }else{
                layer.msg(res.msg);
            }
        })
    });

    //保存(在保存和设置模板判断是否修改确定了)
    $("#saveBtn").on("click",function(){
        var isTrue = $(".basic-value .rgt-list");
        for(var u=0;u<isTrue.length;u++){
            if(isTrue.eq(u).find("button").attr("data-type")==1){
                layer.msg("请先确定你的修改",{icon:6});
                return false;
            }
        }
        var type = $(".template-nav .acv").attr("data-type");
        var index = $(".template-nav .acv").index();
        var content = $(".content-list .artic-list").eq(index).html();
        var arr = [];
        var list = $("input:checkbox[name='test']:checked");
        if(list.length==0){
            layer.msg("请选中字段",{icon:6});
            return false;
        }
        $("input:checkbox[name='test']:checked").each(function(){
            arr.push($(this).val())
        });
        var fieldRecord = arr.join(",");
        var param = {
            "merchantId":merchantId,
            "templateSetId":templateSetId, //标准模板ID
            "templateSetName":templateSetName, //标准模板名称
            "templateType":type, //模板类型A4, RM58, RM80
            "content":content, //HTML内容
            "fieldRecord":fieldRecord //字段记录id
        }
        reqAjaxAsync(USER_URL.SAVETEMPLATE,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                layer.msg(res.msg,{icon:1});
            }else{
                layer.msg(res.msg);
            }
        })
    });

    //点击修改名称
    $(".template-content").on("click",".cura",function(){
        $(".template-content .cura").removeClass("acve");
        $(".template-content .footer-text").removeClass("acve");
        $(this).addClass("acve");
        var isH = $(this).attr("data-is") ||"";
        var fontsize = $(this).css("fontSize");
        var famil = $(this).css("font-family");
        var tp = $(this).attr("data-tp") || 0;
        $(".change-btn").show();
        $("#fontSize").val(fontsize);
        if(tp==1){//独行显示
            $("#alone").attr("data-type",1);
            $("#alone").prop("checked",true);
        }
        if(famil.indexOf("Helvetica Neue")==-1){
            $("#fontFamily").val(famil);
        }else{
            $("#fontFamily").val('"Helvetica Neue", Helvetica, Arial, sans-serif');
        }
        form.render();
        if(isH!="H"){
            $("#changeName").attr("maxlength",6);
        }
        
        if(isH==="B" || isH==="H" || isH==="D"){
            if(isH == 'D'){
                var val = $(this).find("span").text();
            }else {
                var val = $(this).text();
            }
             
            $("#walkAlone").hide();
        }else{
            var val = $(this).find("span").text();
            $("#walkAlone").show();
        }
        $("#changeName").val(val);
        //修改名称长度 修改成6
        $('#changeName').attr('maxlength', '6');
    });

    // 点击表尾 修改
    $('.template-content').on('click','.footer-text',function(){
         
        $(".template-content .cura").removeClass("acve");
        $(this).addClass("acve");
        $('#walkAlone').hide();  //独行隐藏
        var isH = $(this).attr("data-is") || "";
        var fontsize = $(this).css("fontSize");
         
        var famil = $(this).css("font-family");
        var tp = $(this).attr("data-tp") || 0;
        $("#fontSize").val(fontsize);  //设置字体大小
        var val = $(this).text();
        val = $.trim(val);
        if (famil.indexOf("Helvetica Neue") == -1) {
            $("#fontFamily").val(famil);  //设置字体
        } else {
            $("#fontFamily").val('"Helvetica Neue", Helvetica, Arial, sans-serif');
        }
        $("#changeName").val(val);  //设置修改名称
        $(".change-btn").show();
        //修改名称长度 修改成15
        $('#changeName').attr('maxlength','15');
        form.render();
    });
    //点击修改名称
    $(".template-content").on("click", ".title-val", function () {
 
    });

    //是否独行
    form.on('checkbox(isradio)', function(data){
        if(data.elem.checked){
            $(this).attr("data-type",1);
        }
        if(!data.elem.checked){
            $(this).attr("data-type",0);
        }
    });

    //修改名称字体等点击确定
    $("#changeSure").click(function(){
        var val = $.trim($("#changeName").val());
        var size = $("#fontSize").val();
        var family = $("#fontFamily").val();
        var type = $("#alone").attr("data-type");//0-未选 1-勾选
        var index  = $(".template-nav .nav-list.acv").index();
        var isH =  $(".artic-list").eq(index).find('.cura.acve').attr("data-is") ||"";
        //判断是不是 表尾
        var isFooter = $(".artic-list").eq(index).find('.footer-text.acve');
        if (isFooter.length > 0) {
            $(isFooter).css({'font-size': size, 'font-family':family});
            $(isFooter).text(val);
            return ;
        }else {
            $(".artic-list").eq(index).find('.cura.acve').css({
                "font-size": size,
                "font-family": family
            });
        }

        if(isH==="B" || isH==="H"){
            $(".artic-list").eq(index).find('.cura.acve').text(val);
        }else{
            $(".artic-list").eq(index).find('.cura.acve').find("span").text(val);
            if(type==1){
                $(".artic-list").eq(index).find('.cura.acve').parent().css({
                    "display":"block",
                    "width":"100%"
                });
                $(".artic-list").eq(index).find('.cura.acve').attr("data-tp",1);//独行设置
            }else{
                $(".artic-list").eq(index).find('.cura.acve').parent().css({
                    "display":"inline-block",
                    "width":"auto"
                });
                $(".artic-list").eq(index).find('.cura.acve').attr("data-tp",0);//未独行
            }
        }


        $(".artic-list").eq(index).find('.cura.acve').removeClass("acve");
        $("#changeName").val("");
        $("#fontSize").val("");
        $("#fontFamily").val("");
        $("#alone").val("");
        $("#alone").attr("data-type",0);
        $("#alone").prop("checked",false);
        form.render();
    });

    //表头勾选确定
    $(".hsave").on("click",function(){
        $(this).attr("data-type",2);
        var brr=[];

        var list = $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='test']:checked");
        if(list.length==0){
            layer.msg("请选中字段",{icon:6});
            return false;
        }
        $(".basic-value .rgt-list").eq(0).find("input:checkbox[name='test']:checked").each(function(){
            brr.push({
                id:$(this).val(),
                itemName:$(this).next().find("span").text(),
                itemValue:$(this).next().next().html()
            })
        });
        var index = $(".template-nav .acv").index();
        if(index==0){
            var sHtml="";
            for(var i=0;i<brr.length;i++){
                sHtml += '<div class="body-list" data-id="'+ brr[i].id +'">'
                + '<div class="list-title cura" data-is="D"><span>' + brr[i].itemName + '</span>：</div>'
                + '<div class="title-val">#' + brr[i].itemValue + '#</div>'
                + '</div>'
            }
            $(".a4 .content-body").html(sHtml);
        }else if(index==1){
            var sHtml="";
            for(var i=0;i<brr.length;i++){
                sHtml += '<div class="top-list" data-id="'+ brr[i].id +'">'
                + '<div class="list-title cura" data-tp="1" data-is="D"><span>' + brr[i].itemName + '</span>：</div>'
                + '<div class="title-val">#' + brr[i].itemValue + '#</div>'
                + '</div>'
            }
            $(".eight-size .content-top").html(sHtml);
        }else{
            var sHtml="";
            for(var i=0;i<brr.length;i++){
                sHtml += '<div class="top-list" data-id="'+ brr[i].id +'">'
                + '<div class="list-title cura" data-tp="1" data-is="D"><span>' + brr[i].itemName + '</span>：</div>'
                + '<div class="title-val">#' + brr[i].itemValue + '#</div>'
                + '</div>'
            }
            $(".five-size .content-top").html(sHtml);
        }
    });



    //表体勾选确定
    $(".bsave").on("click",function(){
        $(this).attr("data-type",2);
        var barr=[];

        var list = $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='test']:checked");
        if(list.length==0){
            layer.msg("请选中字段",{icon:6});
            return false;
        }
        $(".basic-value .rgt-list").eq(1).find("input:checkbox[name='test']:checked").each(function(){
            barr.push({
                id:$(this).val(),
                itemName:$(this).next().find("span").text(),
                itemValue:$(this).next().next().html()
            })
        });
        if(barr.length==0){
            return false;
        }
        var index = $(".template-nav .acv").index();
        if(index==0){
            var sHtml="";
            sHtml+='<div class="tab-title">'
            for(var c=0;c<barr.length;c++){
                sHtml+= '<div class="table-title cura" data-is="B" data-id="'+ barr[c].id +'">' + barr[c].itemName + '</div>'
            }
            sHtml+='</div>' +
            '<div class="table-body">'
            + '<div id="tableText">'
            for(var c=0;c<barr.length;c++){
                sHtml+= '<div class="table-val">#' + barr[c].itemValue + '#</div>'
            }
            sHtml+='</div></div>'
            $(".a4 .content-article").html(sHtml);
            if(barr.length>4){
                $(".a4 .content-article").find(".table-title").css("width","20%");
                $(".a4 .content-article").find(".table-val").css("width","20%");
            }else if(barr.length==4){
                $(".a4 .content-article").find(".table-title").css("width","25%");
                $(".a4 .content-article").find(".table-val").css("width","25%");
            }else if(barr.length==3){
                $(".a4 .content-article").find(".table-title").css("width","33.3%");
                $(".a4 .content-article").find(".table-val").css("width","33.3%");
            }else if(barr.length==2){
                $(".a4 .content-article").find(".table-title").css("width","50%");
                $(".a4 .content-article").find(".table-val").css("width","50%");
            }else if(barr.length==1){
                $(".a4 .content-article").find(".table-title").css("width","100%");
                $(".a4 .content-article").find(".table-val").css("width","100%");
            }
            getHeight(1,"A4");
            getHeight(2,"A4");
        }else if(index==1){
            var sHtml="";
            sHtml+='<div class="tab-title">'
            for(var c=0;c<barr.length;c++){
                sHtml+= '<div class="table-title cura" data-is="B" data-id="'+ barr[c].id +'">' + barr[c].itemName + '</div>'
            }
            sHtml+='</div>' +
            '<div class="table-body">'
            + '<div id="tableText">'
            for(var c=0;c<barr.length;c++){
                sHtml+= '<div class="table-val">#' + barr[c].itemValue + '#</div>'
            }
            sHtml+='</div></div>'
            $(".eight-size .content-body").html(sHtml);
            $(".eight-size .content-body").html(sHtml);
            if(barr.length>3){
                $(".eight-size .content-body").find(".table-title").css("width","20%");
                $(".eight-size .content-body").find(".table-val").css("width","20%");
                $(".eight-size .content-body").find(".table-title").eq(0).css("width","40%");
                $(".eight-size .content-body").find(".table-val").eq(0).css("width","40%");
            }else if(barr.length==3){
                $(".eight-size .content-body").find(".table-title").css("width","20%");
                $(".eight-size .content-body").find(".table-val").css("width","20%");
                $(".eight-size .content-body").find(".table-title").eq(0).css("width","40%");
                $(".eight-size .content-body").find(".table-val").eq(0).css("width","40%");
            }else if(barr.length==2){
                $(".eight-size .content-body").find(".table-title").css("width","50%");
                $(".eight-size .content-body").find(".table-val").css("width","50%");
            }else if(barr.length==1){
                $(".eight-size .content-body").find(".table-title").css("width","100%");
                $(".eight-size .content-body").find(".table-val").css("width","100%");
            }
            getHeight(1,"RM80");
            getHeight(2,"RM80");
        }else{
            var sHtml="";
            sHtml+='<div class="tab-title">'
            for(var c=0;c<barr.length;c++){
                sHtml+= '<div class="table-title cura" data-is="B" data-id="'+ barr[c].id +'">' + barr[c].itemName + '</div>'
            }
            sHtml+='</div>' +
            '<div class="table-body">'
            + '<div id="tableText">'
            for(var c=0;c<barr.length;c++){
                sHtml+= '<div class="table-val">#' + barr[c].itemValue + '#</div>'
            }
            sHtml+='</div></div>'
            $(".five-size .content-body").html(sHtml);
            if(barr.length>3){
                $(".five-size .content-body").find(".table-title").css("width","20%");
                $(".five-size .content-body").find(".table-val").css("width","20%");
                $(".five-size .content-body").find(".table-title").eq(0).css("width","40%");
                $(".five-size .content-body").find(".table-val").eq(0).css("width","40%");
            }else if(barr.length==3){
                $(".five-size .content-body").find(".table-title").css("width","20%");
                $(".five-size .content-body").find(".table-val").css("width","20%");
                $(".five-size .content-body").find(".table-title").eq(0).css("width","40%");
                $(".five-size .content-body").find(".table-val").eq(0).css("width","40%");
            }else if(barr.length==2){
                $(".five-size .content-body").find(".table-title").css("width","50%");
                $(".five-size .content-body").find(".table-val").css("width","50%");
            }else if(barr.length==1){
                $(".five-size .content-body").find(".table-title").css("width","100%");
                $(".five-size .content-body").find(".table-val").css("width","100%");
            }
            getHeight(1,"RM58");
            getHeight(2,"RM58");
        }


    });

    //表尾勾选
    $(".fsave").on("click",function(){
        $(this).attr("data-type",2);
        var brr=[];

        var list = $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='test']:checked");
        if(list.length==0){
            layer.msg("请选中字段",{icon:6});
            return false;
        }
        $(".basic-value .rgt-list").eq(2).find("input:checkbox[name='test']:checked").each(function(){
            brr.push({
                id:$(this).val(),
                itemName:$(this).next().find("span").text(),
                itemValue:$(this).next().next().html()
            })
        });
        var index = $(".template-nav .acv").index();
        if(index==0){
            var sHtml="";
            for(var i=0;i<brr.length;i++){
                sHtml += '<div class="body-list" data-id="'+ brr[i].id +'">'
                + '<div class="list-title cura"><span>' + brr[i].itemName + ' </span>：</div>'
                + '<div class="title-val">#' + brr[i].itemValue + '#</div>'
                + '</div>'
            }
            $(".a4 .content-foot").html(sHtml);
        }else if(index==1){
            var sHtml="";
            for(var i=0;i<brr.length;i++){
                sHtml += '<div class="footer-list" data-id="'+ brr[i].id +'">'
                + '<div class="footer-title cura"><span>' + brr[i].itemName + '</span>：</div>'
                + '<div class="footer-val">#' + brr[i].itemValue + '#</div>'
                + '</div>'
            }
            $(".eight-size .content-footer").html(sHtml);
        }else{
            var sHtml="";
            for(var i=0;i<brr.length;i++){
                sHtml += '<div class="footer-list" data-id="'+ brr[i].id +'">'
                + '<div class="list-title cura"><span>' + brr[i].itemName + '</span>：</div>'
                + '<div class="title-val">#' + brr[i].itemValue + '#</div>'
                + '</div>'
            }
            $(".five-size .content-footer").html(sHtml);

        }
    });

    //获取所有高度，取最高的
    function getHeight(type,ty){
        if(type==1){ //标题

            if(ty=="A4") {
                var list = $(".content-list .artic-list").eq(0).find(".tab-title").find(".table-title");
                var heightArr = [];
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        heightArr.push(list.eq(i).height());
                    }
                    heightArr.sort(soreHeight);
                    $(".content-list .artic-list").eq(0).find(".tab-title").find(".table-title").height(heightArr[0]);
                }
            }else if(ty=="RM80"){
                var list = $(".content-list .artic-list").eq(1).find(".tab-title").find(".table-title");
                var heightArr = [];
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        heightArr.push(list.eq(i).height());
                    }
                    heightArr.sort(soreHeight);
                    $(".content-list .artic-list").eq(1).find(".tab-title").find(".table-title").height(heightArr[0]);
                }
            }else{
                var list = $(".content-list .artic-list").eq(2).find(".tab-title").find(".table-title");
                var heightArr = [];
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        heightArr.push(list.eq(i).height());
                    }
                    heightArr.sort(soreHeight);
                    $(".content-list .artic-list").eq(2).find(".tab-title").find(".table-title").height(heightArr[0]);
                }
            }

        }else { //内容
            if(ty=="A4"){
                var list = $(".content-list .artic-list").eq(0).find("#tableText").find(".table-val");
                var heightArr = [];
                if(list.length>0){
                    for(var i= 0 ;i<list.length;i++){
                        heightArr.push(list.eq(i).height());
                    }
                    heightArr.sort(soreHeight);
                    $(".content-list .artic-list").eq(0).find("#tableText").find(".table-val").height('auto');
                }
            }else if(ty=="RM80"){
                var list = $(".content-list .artic-list").eq(1).find("#tableText").find(".table-val");
                var heightArr = [];
                if(list.length>0){
                    for(var i= 0 ;i<list.length;i++){
                        heightArr.push(list.eq(i).height());
                    }
                    heightArr.sort(soreHeight);
                    $(".content-list .artic-list").eq(1).find("#tableText").find(".table-val").height('auto');
                }
            }else{
                var list = $(".content-list .artic-list").eq(2).find("#tableText").find(".table-val");
                var heightArr = [];
                if(list.length>0){
                    for(var i= 0 ;i<list.length;i++){
                        heightArr.push(list.eq(i).height());
                    }
                    heightArr.sort(soreHeight);
                    $(".content-list .artic-list").eq(2).find("#tableText").find(".table-val").height('auto');
                }
            }


        }
    }

    //排序
    function soreHeight(a,b){
        return b-a;
    }


    //全选和取消
    form.on('checkbox(all)', function(data){
        var type = data.elem.checked;
        $(this).parents(".rgt-list").find("button").attr("data-type",1);
        if(type==true){
            $(this).parents(".rgt-list").find("input:checkbox[name='all']").prop("checked",true);
            $(this).parents(".rgt-list").find("input:checkbox[name='test']").prop("checked", true);
            form.render();
        }
        if(type==false){
            $(this).parents(".rgt-list").find("input:checkbox[name='all']").prop("checked",false);
            $(this).parents(".rgt-list").find("input:checkbox[name='test']").prop("checked",false);
            form.render();
        }
    });

    //单个勾选
    form.on('checkbox(test)', function(data){
        $(this).parents(".rgt-list").find("button").attr("data-type",1);
        var type = data.elem.checked;
        if(type){
            var listleng = $(this).parents(".rgt-list").find("input:checkbox[name='test']").length;
            var length= $(this).parents(".rgt-list").find("input:checkbox[name='test']:checked").length;
            if(listleng==length){
                $(this).parents(".rgt-list").find("input:checkbox[name='all']").prop("checked",true);
                form.render();
            }
        }
        if(!type){
            $(this).parents(".rgt-list").find("input:checkbox[name='all']").prop("checked",false);
            form.render();
        }
    });
