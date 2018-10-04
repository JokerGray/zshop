    var USER_URL = {
        ORDERCLASSIFY: 'operations/findTicketCategoryByPid', //(查询工单类别,板块)
        SERVICESTAFF : 'operations/customerServiceStaffs' //(客服人员)
    }

    var classlist;
    var platelist;
    var type = GetQueryString("typ");
    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    });

    var type = $(".common-container").attr("data-type") ||"";

    allocationUser();//分配给
    if(type!=1){ //1用于详情页
        classifyById("0","1");//分类查询第一级
        classifyById("0","2");//板块查询第一级
    }


    //分配方法
    function allocationUser(){
        var param = {
            "username":""
        };
        reqAjaxAsync(USER_URL.SERVICESTAFF,JSON.stringify(param)).done(function(res){
        var sHtml = "";
            if(res.code == 1){
                sHtml+='<option value="">-可输入搜索或者直接选择-</option>';
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<option value="' + row.id + '">' + row.uname + '</option>';
                }
                $(".copycommon").html(sHtml);
                form.render();
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击分类下拉
    $("#add-classify").on("click",function(e){
        $("#add-plate").attr("data-num",0);
        $(".plate-menu").hide();
        $("#add-plate").find("i").attr("class","down-arrows");

        var num = $(this).attr("data-num");
        if(num==0){
            classOne(1);//分类查询第一级
            $(".classify-nav li").removeClass("actv");
            $(".classify-nav li").eq(0).addClass("actv");
            $(this).attr("data-num",1);
            $(".classify-menu").show();
            $(this).find("i").attr("class","up-arrows");
        }

        if(num==1){
            $(this).attr("data-num",0);
            $(".classify-menu").hide();
            $(this).find("i").attr("class","down-arrows");
        }

        $(document).one("click", function(){
            $("#add-classify").attr("data-num",0);
            $(".classify-menu").hide();
            $("#add-classify").find("i").attr("class","down-arrows");
        });

        e.stopPropagation();
    });

    //点击板块下拉
    $("#add-plate").on("click",function(e){
        $("#add-classify").attr("data-num",0);
        $(".classify-menu").hide();
        $("#add-classify").find("i").attr("class","down-arrows");


        var num = $(this).attr("data-num");
        if(num==0){
            classOne(2);//板块查询第一级
            $(".plate-nav li").removeClass("actv");
            $(".plate-nav li").eq(0).addClass("actv");
            $(this).attr("data-num",1);
            $(".plate-menu").show();
            $(this).find("i").attr("class","up-arrows");
        }

        if(num==1){
            $(this).attr("data-num",0);
            $(".plate-menu").hide();
            $(this).find("i").attr("class","down-arrows");
        }

        $(document).one("click", function(){
            $("#add-plate").attr("data-num",0);
            $(".plate-menu").hide();
            $("#add-plate").find("i").attr("class","down-arrows");
        });

        e.stopPropagation();
    });

    //板块下拉关闭
    $(".plate-menu").on("click","i",function(){
        $("#add-plate").attr("data-num",0);
        $(".plate-menu").hide();
        $("#add-plate").find("i").attr("class","down-arrows");
    });

    //分类下拉关闭
    $(".classify-menu").on("click","i",function(){
        $("#add-classify").attr("data-num",0);
        $(".classify-menu").hide();
        $("#add-classify").find("i").attr("class","down-arrows");
    });


    //工单分类/板块
    function classifyById(e,type){
        var param = {
            "pid":e, // 查第一级传0 查下级的则传所属的上级id
            "type":type  //1-类别2-板块
        }
        reqAjaxAsync(USER_URL.ORDERCLASSIFY,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                var sHtml="";
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<li data-id="'+ row.id +'">' + row.categoryName + '</li>';
                }
                if(type==1){
                    if(e==0){
                        classlist=res.data || "";
                    }
                    $(".classify-list").html(sHtml);
                }else{
                    if(e==0){
                        platelist=res.data || "";
                    }
                    $(".plate-list").html(sHtml);
                }
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //存储的分类下拉
    function classOne(type){
        var sHtml="";
        if(type==1){
            if(classlist==""){
                sHtml += '<li data-id="'+ "" +'">' + '暂无' + '</li>';
            }else{
                for(var i=0;i<classlist.length;i++){
                    var row = classlist[i];
                    sHtml += '<li data-id="'+ row.id +'">' + row.categoryName + '</li>';
                }
            }
            $(".classify-list").html(sHtml);
        }else{
            if(platelist==""){
                sHtml += '<li data-id="'+ "" +'">' + '暂无' + '</li>';
            }else{
                for(var i=0;i<platelist.length;i++){
                    var row = platelist[i];
                    sHtml += '<li data-id="'+ row.id +'">' + row.categoryName + '</li>';
                }
            }
            $(".plate-list").html(sHtml);
        }

    }

    //点击分类进行选择
    $(".classify-list").on("click","li",function(e){
        var id = $(this).attr("data-id");
        var index = $(".classify-nav li.actv").index();
        var text = $(this).text();
        classifyById(id,"1");
         if(index==3){
            $(".classify-menu").hide();
            $("#add-classify").attr("data-num",0);
            $("#add-classify").find("i").attr("class","down-arrows");
        }else{
            $(".classify-menu").show();
            $(".classify-list").show();
            $("#add-classify").attr("data-num",1);
            $("#add-classify").find("i").attr("class","up-arrows");
            $(".classify-nav li").removeClass("actv");
            $(".classify-nav li").eq(parseInt(index)+1).addClass("actv");
        }
        $("#order-classifyname").text(text);
        $("#order-classifyname").attr("data-id",id);

        e.stopPropagation();   //注意阻止事件冒泡
    });

    $(".classify-menu").click(function(e){
        e.stopPropagation();   //注意阻止事件冒泡
    });

    //点击板块进行选择
    $(".plate-list").on("click","li",function(e){
        var id = $(this).attr("data-id");
        var index = $(".plate-nav li.actv").index();
        var text = $(this).text();
        classifyById(id,"2");
        if(index==3){
            $(".plate-list").hide();
            $("#add-plate").attr("data-num",0);
            $("#add-plate").find("i").attr("class","down-arrows");
        }else{
            $(".plate-list").show();
            $("#add-plate").attr("data-num",1);
            $("#add-plate").find("i").attr("class","up-arrows");
            $(".plate-nav li").removeClass("actv");
            $(".plate-nav li").eq(parseInt(index)+1).addClass("actv");
        }
        $("#order-platename").text(text);
        $(".plateinput").val(text);
        $("#order-platename").attr("data-id",id);
        e.stopPropagation();   //注意阻止事件冒泡
    });
    $(".plate-menu").click(function(e){
        e.stopPropagation();   //注意阻止事件冒泡
    });