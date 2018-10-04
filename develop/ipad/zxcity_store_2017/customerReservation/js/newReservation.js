(function($){
    var REQUEST_URL = {
        'service':'shopDisplayTerminal/getCanBespokeService',//获取能被预约项目接口
        'facility':'shopDisplayTerminal/getCanBespokeFacility',//获取能被预约设备接口
        'waiter':'shopDisplayTerminal/getCanBespokeWaiter'//获取能被预约服务员接口

    };
    //获取当前日期
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-').replace(/(?=\b\d\b)/g,'0');

    var shopId = sessionStorage.getItem("shopId");
    var urlParams = getParams();
    //console.log(urlParams);
    var beforeArrivalsStopTime = urlParams["beforeArrivalsStopTime"],
        businessEndTime = urlParams["businessEndTime"],
        businessStartTime = urlParams["businessStartTime"],
        intervalTime = parseInt(urlParams["intervalTime"]);

    var startT1 = businessStartTime.substring(0,2),
        startT2 = businessStartTime.substring(3,5),
        endT1 = businessEndTime.substring(0,2),
        endT2 = businessEndTime.substring(3,5);


    if(beforeArrivalsStopTime != "" && parseInt(beforeArrivalsStopTime) > 0){
        var hours = parseInt(beforeArrivalsStopTime) / 60;
        $("#tips .tips-time").text(hours+"小时");
        $("#tips").removeClass("invisible");
    }else{
        $("#tips").addClass("invisible");
    }

    var param_1 = {'shopId':shopId};

    //日期初始化
    function initDateTime(){
        //日期选择器初始化
        var start = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            isToday:false,
            minDate: $.nowDate({DD:0}),
            maxDate: $.nowDate({DD:+29}), //最大日期
            choosefun: function(elem, val, date){
                end.minDate = date; //开始日选好后，重置结束日的最小日期
                end.maxDate = $.nowDate({DD:"+1"},'YYYY-MM-DD',val);
                $("#endDate").val(val);

                loadTime();
            }
        };
        var end = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            isToday:false,
            minDate: $.nowDate({DD:0}),
            maxDate: $.nowDate({DD:+1}),
            choosefun: function(elem, val, date){
                changeEndTime();
            }
        };
        //这里是日期联动的关键
        function endDates() {
            //将结束日期的事件改成 false 即可
            //end.trigger = false;
            $("#endDate").jeDate(end);
        }
        $.jeDate('.start-date',start);
        $.jeDate('.end-date',end);

        loadTime();
    }



    function loadTime(){
        var sDate = $("#startDate").val(), eDate = $("#endDate").val();
        var sDateArr = sDate.split("-"), eDateArr = eDate.split("-");
        var st = new Date(sDateArr[0], parseInt(sDateArr[1])-1, sDateArr[2], businessStartTime.substring(0, 2),  businessStartTime.substring(3, 5), 0).getTime();
        var et = new Date(eDateArr[0], parseInt(eDateArr[1])-1, eDateArr[2], businessEndTime.substring(0, 2), businessEndTime.substring(3, 5), 0).getTime();
        var next = st;
        var sHtml = '', stArr = [], etArr = [];
        if(parseInt(startT1) > parseInt(endT1)){
            et = new Date(sDateArr[0], parseInt(sDateArr[1])-1, sDateArr[2], 24, 0, 0).getTime();
        }
        sHtml += '<option>--请选择--</option>';
        while(next < et){
            var temp = formatAllDate(new Date(next));
            if(next > new Date().getTime()){
                sHtml += '<option data-time="'+next+'">'+temp.substring(11, 16)+'</option>';
            }
            next = next + 1000*60*30;
        }

        $("#startTime").html(sHtml);
        $('#startTime').select2({
            minimumResultsForSearch: -1,
        });
    }

    $("#startTime").change(function(){
        changeEndTime();
    });

    function changeEndTime(){
        var startTime = $("#startTime").val();
        var sDate = $("#startDate").val(), eDate = $("#endDate").val();
        var difObj = between(sDate+" "+startTime+":00", eDate+" "+businessEndTime+":00");
        var sDateArr = sDate.split("-"), eDateArr = eDate.split("-");
        var sHtml = '<option>--请选择--</option>';
        var sTime = new Date(sDateArr[0], parseInt(sDateArr[1])-1,sDateArr[2], startTime.substring(0, 2),  startTime.substring(3, 5), 0).getTime();

        var zeroTime = new Date(sDateArr[0], parseInt(sDateArr[1])-1,sDateArr[2], 24,  0, 0).getTime();
        var dayEndTime = new Date(eDateArr[0], parseInt(eDateArr[1])-1,eDateArr[2], 24, 0, 0).getTime();

        var eTime = new Date(eDateArr[0], parseInt(eDateArr[1])-1,eDateArr[2], businessEndTime.substring(0, 2), businessEndTime.substring(3, 5), 0).getTime();
        //console.log("dayEndTime:"+dayEndTime);
        //console.log("eTime:"+eTime);

        if(sDate == eDate){
            var _et = (dayEndTime > eTime && parseInt(startT1) < parseInt(endT1) )? eTime : dayEndTime;
            //console.log(_et);
            var nTime = sTime + 1000*60*intervalTime;
            while(nTime <= _et){
                var temp = formatAllDate(new Date(nTime));
                if(nTime < zeroTime){
                    sHtml += '<option data-time="'+nTime+'">'+temp.substring(11, 16)+'</option>';
                }
                nTime = nTime + 1000*60*intervalTime;
            }
        }else if(difObj['days']== 0 && difObj['hours'] < 24){

            var nTime = sTime + 1000*60*intervalTime;
            while(nTime <= eTime){
                var temp = formatAllDate(new Date(nTime));
                if(nTime >= zeroTime){
                    sHtml += '<option data-time="'+nTime+'">'+temp.substring(11, 16)+'</option>';
                }
                nTime = nTime + 1000*60*intervalTime;
            }
        }
        $("#endTime").html(sHtml);
        $('#endTime').select2({
            minimumResultsForSearch: -1,
        });
    }

    //加载预约服务人员
    function getWaiterList(){
        reqAjaxAsync(REQUEST_URL['waiter'], JSON.stringify(param_1)).done(function(res){
            if(res.code == 1){
                var sHtml = '<option value="">请选择</option>';
                for(var i=0; i<res.data.length; i++){
                    sHtml += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
                }
                $("#waiterSelector").html(sHtml);
                $('#waiterSelector').select2({
                    minimumResultsForSearch: -1,
                });
            }else{
                console.error(res.msg);
            }
        });
    }
    //加载预约设备列表
    function getFacilityList(){
        reqAjaxAsync(REQUEST_URL['facility'], JSON.stringify(param_1)).done(function(res){
            if(res.code == 1){
                var sHtml = '<option value="">请选择</option>';
                for(var i=0; i<res.data.length; i++){
                    sHtml += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
                }
                $("#facilitySelector").html(sHtml);
                $('#facilitySelector').select2({
                    minimumResultsForSearch: -1,
                });
            }else{
                console.error(res.msg);
            }
        });
    }
    //加载预约项目列表
    function getServiceList(){
        reqAjaxAsync(REQUEST_URL['service'], JSON.stringify(param_1)).done(function(res){
            if(res.code == 1){
                var sHtml = '<option value="">请选择</option>';
                for(var i=0; i<res.data.length; i++){
                    sHtml += '<option value="'+res.data[i].id+'" data-price="'+res.data[i].price+'">'+res.data[i].serviceName+'</option>';
                }
                $("#serviceSelector").html(sHtml);
                $('#serviceSelector').select2({
                    minimumResultsForSearch: -1,
                });
            }else{
                console.error(res.msg);
            }
        });
    }

    $(function(){
        initDateTime();
        getWaiterList();
        getFacilityList();
        getServiceList();
    });

})(jQuery);
