(function($){

    var shopID = sessionStorage.getItem('shopId');
    var employeeId = sessionStorage.getItem('backUserId');                       // 当前登录店员ID，**必填**
    var employeeName = sessionStorage.getItem('username');            //**必填**
    var merchantId = sessionStorage.getItem('merchantId');
    var accountId = sessionStorage.getItem("accountId"),
    accountName = sessionStorage.getItem("accountName"),
    accountMobile = sessionStorage.getItem("accountMobile");

    var oCustomerInfo = {}; //用于存放选择的客户信息
    //获取当前日期
    var now = new Date();
    var curDate = [now.getFullYear(), now.getMonth() + 1].join('-').replace(/(?=\b\d\b)/g,'0');   var today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-').replace(/(?=\b\d\b)/g,'0');

    $("#selectCustomerName").text(accountName);

    oCustomerInfo['accountId'] = accountId;
    oCustomerInfo['accountName'] = accountName;
    oCustomerInfo['mobile'] = accountMobile;

    //重置--清空原数据
    function reset() {
        oCustomerInfo = {};
        oCustomerInfo['accountId'] = accountId;
        oCustomerInfo['accountName'] = accountName;
        oCustomerInfo['mobile'] = accountMobile;
        //$("#selectCustomerName").text("请选择客户");
        $("#selectCustomerName").text(accountName);
        $("#selectTechnicianList .name").text("").removeAttr('data-id');
        $("#selectTechnicianList .time").text("");
		$("#selectRoomList .name").text("").removeAttr('data-id');
        $("#selectRoomList .time").text("");
		$("#selectProjectList .name").html("").removeAttr('data-id');
        $("#selectTechnicianList").addClass('hide').siblings().removeClass("hide");
        $("#selectRoomList").addClass('hide').siblings().removeClass("hide");
        $("#selectProjectList").addClass('hide').siblings().removeClass("hide");
        $("#summary").val("");
        $("#currentDateShow").html(curDate).attr('data-curdate',curDate);

    }

    //日期选择
    $("#selectDateBtn").jeDate({
        isinitVal:true,
        skinCell:"mystyle",
        minDate: $.nowDate({MM:-1}),
        format:"YYYY-MM",
        isClear:false,
        isok:false,
        zIndex:3000,
        choosefun:function (elem, _date) {

            var sHtml = '<span id="currentDateShow" class="selected-cur-date">'+_date+'</span>'
            + '<span class="select-bottom-arrow"></span>';
            $(elem).html(sHtml)
            $("#currentDateShow").attr('data-curdate', _date);
            var _dateArr = _date.split("-");
            dateListInit(1, parseInt(_dateArr[0]), parseInt(_dateArr[1]));
        }
    });


    //选择客户并保存客户信息
    window.selCustomer = function(row){
        oCustomerInfo = row;
        oCustomerInfo['accountId'] = row.id;
        $("#selectCustomerName").text(row.accountName);
    }
    //打开选择客户弹框
    $("#selectCustomerBtn").click(function(){
        var addLayer = layer.open({
			type: 2,
			title: "选择客户",
			area: ['80%', '450px'], //宽高
			shadeClose: true, //开启遮罩关闭
			scrollbar: false,
			content: ['../../customerManagement/html/selCustomerWin.html?backUserId='+employeeId, 'no']
		});
    });

    //保存新增预约
    $("#saveAddReservationBtn").click(function(){
        if(oCustomerInfo == {}){
            layer.msg("请选择预约客户！");
            return ;
        }
        var bespokeDate = getBookDate(),//"2017-01-12",       // 预约日期
            bespokeTime = $("#selectTechnicianList .time").text(),            // 预约时间(半点预约)
            bespokeType = 0,  // 预约方式 [{0,"电话"},{1,"上门"},{2,"网上预约"}, {3,"商家推荐预约"}]
            accountId = oCustomerInfo.accountId,   // 客户账户ID，**必填**,如果是散客,ID是0
            phone = oCustomerInfo.mobile,  // 客户联系电话，如果是散客，为空或需要提供输入接口
            accountName = oCustomerInfo.accountName,     // 客户姓名，**必填**
            waiterId = $("#selectTechnicianList .name").attr('data-id'),                         // 服务人员ID，**必填**
            waiterName = $("#selectTechnicianList .name").text(),              // 服务人员称谓，**必填**
            seriveId = $("#selectProjectList .name").attr('data-id'),                      // 服务ID
            roomId = $("#selectRoomList .name").attr('data-id'),                        // 房间ID
            summary = $("#summary").val(),
            facilityId = "111" ;                     // 设备编号

        if(!waiterId){
            layer.msg("请选择服务人员及时间！");
            return ;
        }

        if(!roomId){
            layer.msg("请选择房间！");
            return ;
        }

        if(!seriveId){
            layer.msg("请选择服务项目！");
            return ;
        }

        var jsonData = "{'bespokeDate':'"+bespokeDate+"', 'bespokeTime': '"+bespokeTime+"', 'shopId':"+shopID+", 'bespokeType':"+bespokeType+", 'accountId':"+accountId+", 'phone':'"+phone+"', 'accountName':'"+accountName+"', 'employeeId':"+employeeId+", 'employeeName':'"+employeeName+"', 'waiterId':"+waiterId+", 'waiterName':'"+waiterName+"', 'seriveId':"+seriveId+", 'roomId':"+roomId+", 'summary':'"+summary+"','facilityId':"+facilityId+"}";

        var res = reqAjax("shop/addCustomerBooking", jsonData);
        if(res.code == 1){
            layer.msg(res.msg, {
			  shade:0.5,
			  time: 1000 //1秒关闭（如果不配置，默认是3秒）
			}, function(){
                $(parent.document).find(".side-nav li:eq(1)").addClass("active").siblings().removeClass("active");
                parent.document.getElementById("reservationFrame").src = "reservationSign.html";

			});
        }else{
            layer.alert(res.msg);
        }
    });

    //获取选择的预约日期
    function getBookDate(){
        var selectDay = $(".date-list-box .date-list").find("a.selected").attr("data-day").replace(/(?=\b\d\b)/g,'0');
        var bookDate = $("#currentDateShow").attr('data-curdate') + "-" + selectDay;
        return bookDate;
    }

    $(".pop-layer .pop-inner .close-btn").click(function(){
        $(this).parents(".pop-layer").hide();
    });

    //加载服务人员列表
    function openSelectTechnicianDialog(){
		var bookDate = getBookDate();
		var jsonData = "{'shopId':"+shopID+", 'bookingDate':'"+bookDate+"'}";

        var res = reqAjax("shop/waitersWithTimetable", jsonData);
        var strHtml = "";
        if(res.code == 1){
            var obj = res.data;
            var nowHour = new Date().getHours();
            for(var i=0; i<obj.length; i++){
            	var timeArr = obj[i].timeTable, counter = 0;

                var sHtml = '<li data-id="'+obj[i].id+'"><span class="name">'+obj[i].username+'</span>';
                sHtml += '<select>'
                for(var j=0; j<timeArr.length; j++){
                    if(timeArr[j].count == 0){
                        if(bookDate == today){
                            if(parseInt(timeArr[j].time.substring(0,2)) > nowHour){
                                sHtml += '<option>'+timeArr[j].time+'</option>';
                                counter++;
                            }
                        }else{
                            sHtml += '<option>'+timeArr[j].time+'</option>';
                        }
                    }
                }
                sHtml += '</select>';
                sHtml += '<button class="btn">确定</button>'
                sHtml += '</li>';
                if(bookDate == today && counter == 0){
                    continue;
                }else{
                	strHtml += sHtml;
                }
            }
        }
        $("#technicianSelectBox .pop-inner .pop-con ul").html(strHtml);
        if(strHtml == ""){
        	layer.msg('抱歉，暂时没有可预约的服务人员！');
        	return;
        }
        $("#technicianSelectBox").show();

        $("#technicianSelectBox .pop-inner .pop-con ul").delegate("li .btn", "click", function(){
            var techId = $(this).parents("li").attr("data-id"),
                techName = $(this).parents("li").find('span').text(),
                techTime = $(this).siblings('select').val();
            var old_techId = $("#selectTechnicianList .name").attr('data-id'),
                old_techName = $("#selectTechnicianList .name").text(),
                old_techTime = $("#selectTechnicianList .time").text();

            $("#selectTechnicianList .name").text(techName).attr('data-id', techId);
            $("#selectTechnicianList .time").text(techTime);
            $("#selectTechnicianList").removeClass('hide').siblings().addClass("hide");
            $("#technicianSelectBox").hide();

            //如果服务人员预约时间变更，则清空预约房间信息，根据时间重新加载房间列表
            if(old_techId && old_techTime != techTime) {
                $("#selectRoomList .name").text("").removeAttr('data-id');
                $("#selectRoomList .time").text("");
                $("#selectRoomList").addClass('hide').siblings().removeClass("hide");
            }
        });
    }

    //加载房间列表
    function openSelectRoomDialog(){
		var bookDate = getBookDate();
        var bookTime = $("#selectTechnicianList .time").text();
		var jsonData = "{'shopId':"+shopID+", 'date':'"+bookDate+"', 'time':'"+bookTime+"'}";
		if(bookTime == ""){
			layer.msg("请先选择服务人员和时间！");
			return ;
		}

        var res = reqAjax("shop/freeRooms", jsonData);
        var sHtml = "";
        if(res.code == 1){
            var obj = res.data;
            for(var i=0; i<obj.length; i++){
                sHtml += '<li data-id="'+obj[i].id+'"><span>'+obj[i].name+'</span>';
                sHtml += '</li>';
            }
        }
        $("#roomSelectBox .pop-inner .pop-con ul").html(sHtml);
        $("#roomSelectBox").show();

        $("#roomSelectBox .pop-inner .pop-con ul").delegate("li", "click", function(){
            var roomId = $(this).attr("data-id"),
                roomName = $(this).find('span').text();
            $("#selectRoomList .name").text(roomName).attr('data-id', roomId);
            $("#selectRoomList .time").text(bookTime);
            $("#selectRoomList").removeClass('hide').siblings().addClass("hide");
            $("#roomSelectBox").hide();
        });
    }

    //加载项目列表
    function openSelectProjectDialog(){
		var jsonData = "{'merchantId':"+merchantId+"}";

        var res = reqAjax("shop/serivesInShop", jsonData);
        var sHtml = "";
        if(res.code == 1){
            var obj = res.data;
            for(var i=0; i<obj.length; i++){
                sHtml += '<li data-id="'+obj[i].id+'"><span>'+obj[i].name+'</span>';
                sHtml += '</li>';
            }
        }
        $("#serviceSelectBox .pop-inner .pop-con ul").html(sHtml);
        $("#serviceSelectBox").show();


        $("#serviceSelectBox .pop-inner .pop-con ul").delegate("li", "click", function(){
            var serviceId = $(this).attr("data-id"),
                serviceName = $(this).find('span').text();
            $("#selectProjectList .name").html(serviceName).attr('data-id', serviceId);
            $("#selectProjectList").removeClass('hide').siblings().addClass("hide");
            $("#serviceSelectBox").hide();
        });
    }


    $("#selectTechnicianBtn").click(function(){
        openSelectTechnicianDialog();
    });
    $("#selectTechnicianList").delegate('.info', 'click', function(){
        openSelectTechnicianDialog();
    });

    $("#selectRoomBtn").click(function(){
        openSelectRoomDialog();
    });
    $("#selectRoomList").delegate('.info', 'click', function(){
        openSelectRoomDialog();
    });

    $("#selectProjectBtn").click(function(){
        openSelectProjectDialog();
    });
    $("#selectProjectList").delegate('.info', 'click', function(){
        openSelectProjectDialog();
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
            innerWidth = 444,//oInnerBox.width(),
            nextBtnLeft = 496,//parseInt(oNextBtn.css("left")),
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
            if(!$(this).hasClass("disabled")){
                $(this).addClass("selected").siblings().removeClass("selected");
                curDate = $("#currentDateShow").attr('data-curdate');
                reset();
            }
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
                oNextBtn.removeClass("invisible");
                if(prevStep == actual){
                    oPrevBtn.addClass("invisible");
                }else{
                    oPrevBtn.removeClass("invisible");
                }
            });

        });
    }


    $(function(){
        $("#currentDateShow").html(curDate).attr('data-curdate',curDate);
        dateListInit(now.getDate(), now.getFullYear(), now.getMonth()+1);
    });


})(jQuery);
