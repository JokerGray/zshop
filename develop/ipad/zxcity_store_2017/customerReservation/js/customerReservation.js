(function(){
    var REQUEST_URL = {
        'equip_list':'shopDisplayTerminal/getCanBespokeFacility',//获取能被预约设备接口
        'waiter_list':'shopDisplayTerminal/getCanBespokeWaiter',//获取能被预约服务员接口
        'book_equip':'shopDisplayTerminal/getFacilitysForBooking',//获取某天某设备占用情况接口
        'book_waiter':'shopDisplayTerminal/getWaitersForBooking'//获取某天某服务员占用情况接口
    };
    var customerObj = null,  //用于存放顾客列表
        roomObj = null, //用于存放房间列表
        technicianObj = null;//用于存放服务人员列表
    var employeeId = sessionStorage.getItem('backUserId');
    var shopId = sessionStorage.getItem('shopId');

    //日期选择
    $("#selDate1").jeDate({
        isinitVal:true,
        skinCell:"mystyle",
        format:"YYYY-MM-DD",
        isClear:false,
        isok:false,
        zIndex:3000
    });

    //渲染设备下拉框
    function showRoomSelector(data){
        var sHtml = '';
        sHtml += '<li data-id="-1"><a href="javascript:;">选择设备</a></li>';
        for(var i=0; i<data.length; i++){
            sHtml += '<li data-id="'+data[i].id+'"><a href="javascript:;">'+data[i].name+'</a></li>';
        }
        $("#roomSelector1").html(sHtml);
    }

    //加载设备列表
    function loadRoomList(){
        var bookDate = $("#selDate1").val();
        var bookTime = $("#selectTechnicianList .time").text();
        var jsonData = "{'shopId':"+shopId+"}";

        reqAjaxAsync(REQUEST_URL['equip_list'], jsonData).done(function(res){
            if(res.code == 1){
                roomObj = res.data;
                showRoomSelector(res.data);
            }else{
                layer.alert(res.msg);
            }
        });
    }

    //渲染服务人员下拉框
    function showTechSelector(data, _index){
        var sHtml = '';
        sHtml += '<li data-id="-1"><a href="javascript:;">选择服务人员</a></li>';
        for(var i=0; i<data.length; i++){
            sHtml += '<li data-id="'+data[i].id+'"><a href="javascript:;">'+data[i].name+'</a></li>';
        }
        $("#techSelector"+_index).html(sHtml);
    }

    //服务人员列表初始化
    function loadTechnicianList(_index){
        var jsonData = "{'shopId': "+shopId+"}";
        reqAjaxAsync(REQUEST_URL['waiter_list'], jsonData).done(function(res){
            if(res.code == 1){
                technicianObj = res.data;
                showTechSelector(res.data, _index);
            }else{
                layer.alert(res.msg);
            }
        });

    }

    $("#selRoom1").click(function(){
        if(roomObj == null){
            loadRoomList();
        }else{
            showRoomSelector(roomObj);
        }
    });

    $("#selTechnician1").click(function(){
        if(technicianObj == null){
            loadTechnicianList(1);
        }else{
            showTechSelector(technicianObj, 1);
        }
    });


    $("#roomSelector1").delegate("li", "click", function(){
        $("#selRoom1 span").attr("data-id", $(this).attr("data-id")).text($(this).find("a").text());
    });

    $("#techSelector1").delegate("li", "click", function(){
        $("#selTechnician1 span").attr("data-id", $(this).attr("data-id")).text($(this).find("a").text());
    });



    //设备预约列表初始化
    function loadRoomReservation(){
        var bookDate = $("#selDate1").val();
        var roomId = $("#selRoom1 span").attr("data-id");
        var jsonData = "{'shopId':"+shopId+", 'bookingDate':'"+bookDate+"'";
        if(roomId && roomId != -1){
            jsonData += ", 'facilityId':"+roomId;
        }
        jsonData += "}";

        reqAjaxAsync(REQUEST_URL['book_equip'], jsonData).done(function(res){
            var sHtml = "";
            if(res.code == 1){
                var obj = res.data;
                for(var i=0; i<obj.length; i++){
                    i % 2 == 0 ? sHtml += '<li class="odd">' : sHtml += '<li class="even">';
                    sHtml += '<span class="worker-name">'+obj[i].name+'</span>';
                    sHtml += '<div class="work-list">';
                    var timeArr = obj[i].timeTable;
                    for(var j=0; j<timeArr.length; j++){
                        if(timeArr[j].count == 0){
                            sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-1"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>';
                        }else{
                            sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-2"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>';
                        }
                    }
                    sHtml += '</div></li>';
                }
            }else{
                layer.alert(res.msg);
            }
            $("#roomReservationList").html(sHtml);
        });
    }

    //服务人员预约列表初始化
    function loadTechnicianReservation(){
        var bookDate = $("#selDate1").val();
        var waiterId = $("#selTechnician1 span").attr("data-id");
        var jsonData = "{'shopId':"+shopId+", 'bookingDate':'"+bookDate+"'";
        if(waiterId && waiterId != -1){
            jsonData += ",'waiterId':"+waiterId;
        }
        jsonData += "}";

        reqAjaxAsync(REQUEST_URL['book_waiter'], jsonData).done(function(res){
            var sHtml = "";
            if(res.code == 1){
                var obj = res.data;
                for(var i=0; i<obj.length; i++){
                    i % 2 == 0 ? sHtml += '<li class="odd">' : sHtml += '<li class="even">';
                    sHtml += '<span class="worker-name">'+obj[i].name+'</span>';
                    sHtml += '<div class="work-list">';
                    var timeArr = obj[i].timeTable;
                    for(var j=0; j<timeArr.length; j++){
                        if(timeArr[j].count == 0){
                            sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-1"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>';
                        }else{
                            sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-2"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>';
                        }
                    }
                    sHtml += '</div></li>';
                }
            }else{
                layer.alert(res.msg);
            }
            $("#technicianReservationList").html(sHtml);
        });

    }

    //查询
    $("#searchBtn1").click(function(){
        if($(".sel-tech1").hasClass("hide")){
            loadRoomReservation();
        }else{
            loadTechnicianReservation();
        }
    });

    //tab切换
    $("#reservationTab a").click(function(){
        var dataList = $(this).attr("data-list");
        $(this).addClass("active").siblings().removeClass("active");
        if(dataList == "roomReservationList"){
            $("#listTitle").text("设备名称");
            $(".sel-room1").removeClass("hide");
            $(".sel-tech1").addClass("hide");
            $("#selRoom1 span").text("选择设备").attr("data-id", "-1");
            loadRoomReservation();
        }else{
            $("#listTitle").text("服务人员名称");
            $(".sel-room1").addClass("hide");
            $(".sel-tech1").removeClass("hide");
            $("#selTechnician1 span").text("选择服务人员").attr("data-id", "-1");
            loadTechnicianReservation();
        }
        $("#"+dataList).removeClass("hide").siblings().addClass("hide");

    });

    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 5);
        $(this).attr("href", '../../index.html');
    });

    $(function(){
        $(document).foundation();
        loadTechnicianReservation();
    });
})(jQuery);
