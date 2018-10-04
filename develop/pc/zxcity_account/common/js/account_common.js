// 购买日期开始
    var startTime="";
    var endTime="";
    var qBeginTime="";
    var qEndTime="";
    // 开始时间
    $('#qBeginTime').datepicker({  
        todayBtn : "linked",  
        autoclose : true,
        todayHighlight : true,
        language:"zh-CN",
        endDate : new Date()  
    }).on('changeDate',function(e){  
        startTime = e.date;  
        $('#qEndTime').datepicker('setStartDate',startTime);  
    });   
     // 结束时间  
    $('#qEndTime').datepicker({  
        todayBtn : "linked",  
        autoclose : true,  
        todayHighlight : true,
        language:"zh-CN",
        endDate : new Date()  
    }).on('changeDate',function(e){  
        endTime = e.date;  
        $('#qBeginTime').datepicker('setEndDate',endTime);
    });


    $('#stratTime').datepicker({
        todayBtn : "linked",  
        todayHighlight : true,
        weekStart: 1,  
        autoclose: true,  
        startView: 1,  
        minViewMode:1,
        maxViewMode: 2,
        forceParse: false,  
        language: 'zh-CN'  
    }).on('changeDate',function(e){  
        qBeginTime = e.date;  
        $('#endTime').datepicker('setStartDate',qBeginTime);   
    });
    $('#endTime').datepicker({
        todayBtn : "linked",  
        todayHighlight: true,
        weekStart: 1,  
        autoclose: true,  
        startView: 1,  
        minViewMode:1,
        maxViewMode: 2,
        forceParse: false,  
        language: 'zh-CN'
    }).on('changeDate',function(e){  
        qEndTime = e.date;  
        $('#stratTime').datepicker('setEndDate',qEndTime);
    });

    // 面包屑导航
    $('.hovers:last').click(function() {
       if($(".toggle").is(":hidden")){
            if($(".toggle dd").length==1){
                $(".toggle").hide();     //如果元素为显现,则将其隐藏
                $('.cr-top .nav li .hovers i').attr('class', 'glyphicon glyphicon-triangle-bottom');
            }else{
                $(".toggle").show();    //如果元素为隐藏,则将它显现
                $('.cr-top .nav li .hovers i').attr('class', 'glyphicon glyphicon-triangle-top');
            }
        }else{
            $(".toggle").hide();     //如果元素为显现,则将其隐藏
            $('.cr-top .nav li .hovers i').attr('class', 'glyphicon glyphicon-triangle-bottom');
        } 
    });

    //ajax请求
    function reqAjax(cmd, data) {
        var reData;
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            dataType: "json",
            async: false,
            data: {
                "cmd": cmd,
                "data": data,
                "version": version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(re) {
                // layer.closeAll('loading');
                reData = re;
            },
            error: function(re) {
                // layer.closeAll('loading');
                var str1 = JSON.stringify(re);
                re.code = 9;
                re.msg = str1;
                reData = re;
            }
        });
        return reData;
    }

    //ajax请求调用
    var param = '';
    var res =reqAjax('commonConfig/selBasePublicModule',param);
    var x=res.data;

    // 所属板块select开始
    var tempAjax="";
    $('#selectview').selectpicker({});
    $('#selectplate').selectpicker({});
    $('#selectview1').selectpicker({});
    $('#selectview2').selectpicker({});
    tempAjax += "<option value=''>--全部--</option>";
    $.each(x, function(n) {
        tempAjax += "<option value='"+this.moduleNo+"'>"+this.moduleName+"</option>";
     });
    $("#selectview").empty();
    $("#selectview").append(tempAjax);
    $('#selectview').selectpicker('render');
    $('#selectview').selectpicker('refresh');
    $('.selein ul.selectpicker:first').css({
       'max-height' : '200px',
       'height' : '150px',
       'min-height': '80px'
    });
    $('.selein .bs-searchbox input').attr('maxlength', '10');




