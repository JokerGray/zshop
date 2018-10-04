(function($){
    var shopId = sessionStorage.getItem("shopId"),
        employeeId = sessionStorage.getItem("backUserId"),
        merchantId = sessionStorage.getItem("merchantId");

    var schedulingTitle = ['早', '中', '晚', '全', '休'];

    //获取当前日期
    var now = new Date();
    //默认值为当天
    var curDate = [now.getFullYear(), now.getMonth() + 1].join('-').replace(/(?=\b\d\b)/g,'0');
    var _today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-').replace(/(?=\b\d\b)/g,'0');
    var schedulingDate = _today;
    //日期选择
    $("#selectDateBtn").click(function(){
        WdatePicker({
            el:'dateSelector',
            dateFmt:'yyyy-MM',
            minDate:'%y-%M',
            isShowClear:false,
            //isShowToday:false,
            isShowOK:false,
            onpicked:function(){
                var timeArr = $("#dateSelector").val().split("-");
                $("#currentDateShow").html(timeArr[1]+"<br>"+timeArr[0]).attr('data-curdate', $("#dateSelector").val());
                dateListInit(1, $dp.cal.date.y, $dp.cal.date.M);
            }
        });
    });

    //获取选择的日期
    function getSelectedDate(){
        var selectDay = $(".date-list-box .date-list").find("a.selected")
        .attr("data-day").replace(/(?=\b\d\b)/g,'0');
        var selectedDate = $("#currentDateShow").attr('data-curdate') + "-" + selectDay;
        return selectedDate;
    }

    //获取排班列表
    function getScheduleList(){
        var jsonData = "{'shopId':"+shopId+",'schedulingDate':'"+schedulingDate+"'}";
        var res = reqAjax('shop/querySchedulingLists', jsonData);
        if(res.code == 1){
            var obj = res.data, sHtml = '';
            for(var i=0; i<obj.length; i++){
                var schedulingFlag = obj[i].schedulingFlag,//排班标识
                    overtimeFlag = obj[i].overtimeFlag,//加班标识
                    askForLeave = obj[i].askForLeave;//请假标识

                var bSchedule = schedulingFlag == null ? false : true,//是否排班
                    bMore = (overtimeFlag == null || overtimeFlag == "") ? false : true,//是否加班
                    bRest = (askForLeave == null || askForLeave == 0) ? false : true;//是否请假

                sHtml += '<dd data-uid="'+obj[i].uid+'" data-sIndex="'+schedulingFlag+'"  data-flag="'+bSchedule+'" data-more="'+bMore+'" data-rest="'+bRest+'">'
                    + '<div class="ava-img"><img src="'+obj[i].userImg+'"></div>'
                    + '<div class="detail">'
                    + '<p class="name">'+obj[i].username+'</p>'
                    + '<div class="more-schedule">';
                if(bMore){
                    sHtml += '<button type="button" class="btn more active">加班</button>';
                }else{
                    sHtml += '<button type="button" class="btn more">加班</button>';
                }
                if(bRest){
                    sHtml += '<button type="button" class="btn rest active">请假</button>'
                }else{
                    sHtml += '<button type="button" class="btn rest">请假</button>'
                }
                sHtml += '</div><div class="schedule-btn"><ol>'
                for(var n=0; n<5; n++){
                    var cls = '';
                    if(bSchedule && schedulingFlag == n){
                        cls = 'active';
                        if(bRest){
                            cls = 'active leave';
                        }
                    }
                    if(bMore && overtimeFlag.indexOf(n) > -1){
                        cls = 'active more';
                    }
                    sHtml += '<li data-index="'+n+'" class="'+cls+'"><a href="javascript:void(0);">'+schedulingTitle[n]+'</a></li>'
                }
                sHtml += '</ol></div></div></dd>';
            }
            $(".list-wrap dl").html(sHtml);
        }
    }

    getScheduleList();

    //操作事件
    $(".list-wrap dl").delegate('dd .schedule-btn ol>li', 'click', function(){
        var bSchedule = $(this).parents('dd').attr("data-flag");

        if(bSchedule == 'false'){ //未排班
            $(this).toggleClass('active').siblings().removeClass('active');
        }
        else{//已排班
            var sIndex = $(this).parents("dd").attr('data-sIndex'),//排班的index
                curIndex = $(this).attr('data-index');//当前操作的index
            var moreBtn = $(this).parents("dd").find('.more-schedule .more'),
                restBtn = $(this).parents("dd").find('.more-schedule .rest');
            //请假按钮的状态
            var bRest = $(this).hasClass('leave');
            var bMore = $(moreBtn).hasClass('active');//加班按钮的状态
            if(bMore && curIndex != sIndex){
                if(sIndex < 3){//如果排班为早、中、晚三种情况中的一种
                    if(curIndex < 3){
                        $(this).toggleClass('active more');
                    }
                }else if(sIndex == 4){//如果排班为休
                    if(curIndex == 3){//加班为全班
                        $(this).toggleClass('active more').siblings(':lt(3)').removeClass();
                    }else{//加班为早、中、晚
                        $(this).toggleClass('active more').siblings('[data-index=3]').removeClass();
                        //如果同时选中早、中、晚为加班状态，则显示为全班
                        var moreLi = $(this).parent().find('li.more');
                        if(moreLi.length == 3){
                            $(this).parent().find('li:lt(3)').removeClass();
                            $(this).parent().find('li:eq(3)').addClass('active more');
                        }
                    }
                }
            }
        }
    }).delegate("dd .more-schedule .more", "click", function(){ //加班
        var bSchedule = $(this).parents('dd').attr("data-flag");
        if(bSchedule == 'false'){
            layer.msg('请先进行排班操作！');
            return ;
        }else{
            var sIndex = $(this).parents("dd").attr('data-sIndex');
            if(3 == sIndex){
                layer.msg('亲，已经排了全班就不能再加班了，\nTA又不是一头牛！');
                return;
            }
            $(this).toggleClass("active");
            var b = $(this).hasClass('active');
            var oLi = $(this).parents('dd').find(".schedule-btn ol li.active");
            if(oLi.length > 0){
                for(var j=0; j<oLi.length; j++){
                    var className = $(oLi[j]).attr("class");
                    if($(oLi[j]).hasClass('more')){
                        $(oLi[j]).removeClass();
                    }
                }
            }
        }
    }).delegate("dd .more-schedule .rest", "click", function(){ //请假
        var bSchedule = $(this).parents('dd').attr("data-flag");
        if(bSchedule == 'false'){
            layer.msg('请先进行排班操作！');
            return ;
        }else{
            var sIndex = $(this).parents("dd").attr('data-sIndex');
            if(4 == sIndex ){
                layer.msg('亲，排的班已经是休了，不能点击请假了');
                return;
            }
            $(this).toggleClass("active");
            var b = $(this).hasClass('active');
            var oLi = $(this).parents('dd').find(".schedule-btn ol li.active");
            if(oLi.length > 0){
                for(var j=0; j<oLi.length; j++){
                    var className = $(oLi[j]).attr("class");
                    if($(oLi[j]).hasClass('leave')){
                        $(oLi[j]).removeClass('leave');
                    }else if(b && className.split(' ').length == 1){
                        $(oLi[j]).addClass('leave');
                    }
                }
            }
        }
    });

    //获取需要保存的数据
    function getItemData(){
        var tempArr = [], str1 = "", str2 = "";
        $(".list-wrap dl>dd").each(function(){
            var oTemp = "", backUid = $(this).attr("data-uid");
            var activeList = $(this).find(".schedule-btn ol li.active"),
                moreList = $(this).find(".schedule-btn ol li.more"),
                restList = $(this).find(".schedule-btn ol li.leave");
            var state1 = "", state2 = "", state3 = 0;
            for(var i=0; i<activeList.length; i++){
                if($(activeList[i]).attr('class').split(' ').length == 1){
                    state1 = $(activeList[i]).attr("data-index");
                }else if($(activeList[i]).hasClass('leave')){
                    state1 = $(activeList[i]).attr("data-index");
                    state3 = 1;
                }
            }
            for(var i=0; i<moreList.length; i++){
                state2 += $(moreList[i]).attr("data-index")+",";
            }
            state2 = state2.substring(0, state2.length-1);
            if(state1 == ""){
                str1 += ($(this).index()+1) + ',';
            }
            //加班按钮的状态
            var bMore = $(this).find('.more-schedule .more').hasClass('active');
            if(bMore && state2 == ""){
                str2 += ($(this).index()+1) + ',';
            }

            oTemp = "{'backuserId':"+backUid+", 'schedulingFlag':"+state1+", 'overtimeFlag':'"+state2+"','askForLeave':"+state3+"}";
            tempArr.push(oTemp);
        });
        if(str1 != ""){
            layer.msg("第"+(str1.substring(0, str1.length-1))+"个员工数据为空，请注意补全！")
            return;
        }
        //加班按钮的状态
        if(str2 != ""){
            layer.msg("第"+(str2.substring(0, str2.length-1))+"个员工若不加班请取消加班，若加班请补全！！");
            return;
        }
        return tempArr
    }

    //保存
    $("#savaBtn").click(function(){
        var nowDate = getSelectedDate();
        if(compareDate(nowDate, _today)){
            layer.msg("亲，已经结束的日期排班不可以更改！");
            return;
        }
        var list = getItemData();
        if(list){
            var jsonData = "{'schedulingDate':'"+schedulingDate+"','shopId':"+shopId+", 'operator':"+employeeId+", 'merchantId':"+merchantId+", 'list':["+list+"]}";
            var res = reqAjax('shop/addScheduling', jsonData);
            if(res.code == 1){
                layer.msg("保存成功！");
            }else{
                layer.msg(res.msg);
            }
        }

    });

    //日期初始化
    function dateListInit(day, year, month){
        //获取当前选择月份的最大天数
        var today = -1;
        if(year == new Date().getFullYear() && month == new Date().getMonth()+1){
            today = day = new Date().getDate();
        }
        var maxDays = new Date(year,month, 0).getDate();
        var sHtml = "";
        var oInnerBox = $(".date-list-box .date-list-inner"),
            oDateList = $(".date-list-box .date-list"),
            oPrevBtn =  $(".date-list-box .prev"),
            oNextBtn = $(".date-list-box .next"),
            innerWidth = 888,//oInnerBox.width(),
            nextBtnLeft = 992,//parseInt(oNextBtn.css("left")),
            d = parseInt(day / 10) > 2 ? 2 : parseInt(day / 10);

        for(var i=1; i<=maxDays; i++){
            if(today == i){
                sHtml += '<a data-day="'+i+'" class="today selected" href="javascript:void(0);">今日</a>';
            }else if(i < today){
                sHtml += '<a data-day="'+i+'" class="disabled">'+i+'</a>';
            }else{
                sHtml += '<a data-day="'+i+'" href="javascript:void(0);">'+i+'</a>';
            }
        }
        oDateList.html(sHtml);

        oDateList.delegate("a", "click", function(){
            $(this).addClass("selected").siblings().removeClass("selected");
            schedulingDate = getSelectedDate();
            getScheduleList();
        });

        var perWidth = $(oDateList.find("a")[0]).width(),
            perMarginW = parseInt($(".date-list-inner .date-list a+a").css("margin-left"));

        if(maxDays == 31 && d >= 2){
            oInnerBox.width(innerWidth + perWidth);
            oNextBtn.css("left", nextBtnLeft + perWidth + perMarginW);
        }else{
            oInnerBox.width(innerWidth);
            oNextBtn.css("left", nextBtnLeft);
        }
        oDateList.css("left", -(d*10*(perWidth + perMarginW)) );

        oPrevBtn.attr("data-cur", d).attr("data-actual", d);
        oNextBtn.attr("data-cur", d).attr("data-actual", d);

        if(d < 2){
            oNextBtn.removeClass("invisible");
        }else{
            oNextBtn.addClass("invisible");
        }
        dateClickFun(perWidth, perMarginW, nextBtnLeft, innerWidth, maxDays);
    }

    //日期切换事件
    function  dateClickFun(perWidth, perMarginW, nextBtnLeft, innerWidth, maxDays){
        var oInnerBox = $(".date-list-box .date-list-inner"),
            oDateList = $(".date-list-box .date-list"),
            oPrevBtn =  $(".date-list-box .prev"),
            oNextBtn = $(".date-list-box .next");
        oNextBtn.unbind("click").bind("click", function(event){
            event.stopPropagation();
            var nextStep = parseInt(oNextBtn.attr("data-cur")) + 1;
            oPrevBtn.attr("data-cur", nextStep);
            oNextBtn.attr("data-cur", nextStep);
            oPrevBtn.removeClass("invisible");
            if(nextStep == 2){
                oNextBtn.addClass("invisible");
            }else{
                oNextBtn.removeClass("invisible");
            }
            oDateList.animate({
                "left": -(nextStep*10*(perWidth + perMarginW))
            }, "swing", function(){
                if(maxDays == 31 && nextStep == 2){
                    oInnerBox.width(innerWidth + perWidth);
                    oNextBtn.css("left", nextBtnLeft + perWidth + perMarginW);
                }else{
                    oInnerBox.width(innerWidth);
                    oNextBtn.css("left", nextBtnLeft);
                }
            });

        });
        oPrevBtn.unbind("click").bind("click", function(){
            var prevStep = parseInt(oNextBtn.attr("data-cur")) - 1,
                actual = parseInt(oPrevBtn.attr("data-actual"));
            oPrevBtn.attr("data-cur", prevStep);
            oNextBtn.attr("data-cur", prevStep);

            oDateList.animate({
                "left": -(prevStep*10*(perWidth + perMarginW))
            }, "swing", function(){
                oInnerBox.width(innerWidth);
                oNextBtn.css("left", nextBtnLeft);
                if(prevStep == actual){
                    oNextBtn.removeClass("invisible");
                    oPrevBtn.addClass("invisible");
                }else{
                    oPrevBtn.removeClass("invisible");
                }
            });

        });
    }


    $(function(){
        $("#currentDateShow").html(now.getMonth()+1+"<br>"+now.getFullYear()).attr('data-curdate',curDate);
        dateListInit(now.getDate(), now.getFullYear(), now.getMonth()+1);
    });

})(jQuery);
