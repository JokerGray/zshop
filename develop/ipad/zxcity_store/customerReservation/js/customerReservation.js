(function(){

	var customerObj = null,  //用于存放顾客列表
		roomObj = null, //用于存放房间列表
		technicianObj = null;//用于存放技师列表
	var employeeId = sessionStorage.getItem('backUserId');
	var shopID = sessionStorage.getItem('shopId');

	$(function(){
		var now = new Date();
		var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
		$("#selDateShow1").html(today);
		$("#selDateShow2").html(today);
		//初始化技师预约列表
		loadTechnicianReservation();
	});

	//tab切换
	$("#reservationTab a").click(function(){
		var dataRel = $(this).attr("data-rel"),
			dataList = $(this).attr("data-list");
		//$(this).addClass("active").siblings().removeClass("active");

		$("#"+dataRel).removeClass("hide").siblings().addClass("hide");

		if(dataRel == "roomReservation"){
			if(dataList == "roomReservationList"){
				$(this).text("技师预定").attr("data-list", "technicianReservationList");
				$("#selRoom1").removeClass("hide");
				$("#selTechnician1").addClass("hide");
				loadRoomReservation();
			}else{
				$(this).text("房间预定").attr("data-list", "roomReservationList");
				$("#selRoom1").addClass("hide");
				$("#selTechnician1").removeClass("hide");
				loadTechnicianReservation();
			}
			$("#"+dataList).removeClass("hide").siblings().addClass("hide");
		} else if(dataRel == "signIn"){
			$("#selCustomer2 span").removeAttr("data-id").text("选择顾客");
			$("#selTechnician2 span").removeAttr("data-id").text("选择技师");
			loadReservationList();
		}
	});

	$("#searchByCondition1").click(function(){
		if($("#selTechnician1").hasClass("hide")){
			loadRoomReservation();
		}else{
			loadTechnicianReservation();
		}
	});

	$("#addReservationBtn").click(function(){
		window.location.href="./addReservation.html";
	});

	//日期选择
	$("#selDate1").click(function(){
		WdatePicker({
			el: 'selDateShow1',
			dateFmt: 'yyyy-MM-dd',
			//minDate: '%y-%M-%d',
			isShowClear: false,
			isShowOK: false,
			onpicked:function(){

			}
		});
	});
	$("#selDate2").click(function(){
		WdatePicker({
			el: 'selDateShow2',
			dateFmt: 'yyyy-MM-dd',
			//minDate: '%y-%M-%d',
			isShowClear: false,
			isShowOK: false,
			onpicked:function(){

			}
		});
	});

	//房间列表初始化
	function loadRoomList(_top, _left){
		var bookDate = $("#selDateShow1").text();
        var bookTime = $("#selectTechnicianList .time").text();
		var jsonData = "{'shopId':"+shopID+", 'date':'"+bookDate+"', 'time':'"+bookTime+"'}";

		var res = reqAjax("shop/roomsInShop", jsonData);
		if(res.code == 1){
			roomObj = res.data;
			openRoomDialog(_top, _left, res.data);
		}else{
			layer.alert(res.msg);
		}

	}

	//客户列表初始化
	function loadCustomerList(_top, _left, _btnId){
		////预约ID, [{0,"取消预约"},{1,"客户签到"}]
		var jsonData = "{'employeeId': "+employeeId+", 'pageNo': "+1+", 'pageSize':100}";

		var res = reqAjax("shop/queryRegularCustomers", jsonData);
		if(res.code == 1){
			customerObj = res.data;
			openCustomerDialog(_top, _left, _btnId, res.data);
		}else{
			layer.alert(res.msg);
		}
	}

	//技师列表初始化
	function loadTechnicianList(_top, _left, _btnId){
		var jsonData = "{'shopId': "+shopID+"}";

		var res = reqAjax("shop/waitersPersonInShop", jsonData);
		if(res.code == 1){
			technicianObj = res.data;
			openTechnicianDialog(_top, _left, _btnId, res.data);
		}else{
			layer.alert(res.msg);
		}
	}

	//选择房间
	function openRoomDialog(_top, _left, obj){
		var sHtml = '<ul class="room-select-list">'
			+ '<li data-id="-1">选择房间</li>'
		for(var i=0; i<obj.length; i++){
			sHtml += '<li data-id="'+obj[i].id+'">'+obj[i].name+'</li>';
		}
		sHtml += '</ul>';
        layer.open({
            type: 1,
            title: '',
            area: ['264px', '390px'],
			shade:　0.1,
			shadeClose:true,
			resize: false,
			offset: [_top+'px', _left+'px'],
			closeBtn: 0,
			anim: 5,
            content: sHtml,
            success: function(layero, index){
                $(document).delegate(".room-select-list li", "click", function(){
                    $("#selRoom1 span").html($(this).text()).attr("data-id", $(this).attr("data-id"));
                    layer.close(index);
                });
            }
        });
	}

	//选择客户
	function openCustomerDialog(_top, _left, _btnId, obj){
		var sHtml = '<ul class="customer-select-list">'
			+ '<li data-userId="-1">选择客户</li>'
		for(var i=0; i<obj.length; i++){
			sHtml += '<li data-userId="'+obj[i].accountId+'">'+obj[i].accountName+'</li>';
		}
		sHtml += '</ul>';
        layer.open({
            type: 1,
            title: '',
            area: ['264px', '390px'],
			shade:　0.1,
			shadeClose:true,
			resize: false,
			offset: [_top+'px', _left+'px'],
			closeBtn: 0,
			anim: 5,
            content: sHtml,
            success: function(layero, index){
                $(document).delegate(".customer-select-list li", "click", function(){
                    $("#"+_btnId+" span").html($(this).text()).attr("data-id", $(this).attr("data-userId"));
                    layer.close(index);
                });
            }
        });
	}

	//选择技师
	function openTechnicianDialog(_top, _left, _btnId, obj){
		var sHtml = '<ul class="technician-select-list">'
			+ '<li data-id="-1">选择技师</li>'
		for(var i=0; i<obj.length; i++){
			sHtml += '<li data-id="'+obj[i].id+'">'+obj[i].username+'</li>';
		}
		sHtml += '</ul>';
        layer.open({
            type: 1,
            title: '',
            area: ['264px', '390px'],
			shade:　0.1,
			shadeClose:true,
			resize: false,
			offset: [_top+'px', _left+'px'],
			closeBtn: 0,
			anim: 5,
            content: sHtml,
            success: function(layero, index){
                $(document).delegate(".technician-select-list li", "click", function(){
                    $("#"+_btnId+" span").html($(this).text()).attr("data-id", $(this).attr("data-id"));
                    layer.close(index);
                });

            }
        });
	}


	$("#selRoom1").click(function(){
		var _left = $(this).offset().left, _top = $(this).offset().top + $(this).height() + 5;
		if(null == customerObj){
			loadRoomList(_top, _left);
		}else{
			openRoomDialog(_top, _left, roomObj);;
		}
	});

	$("#selCustomer2").click(function(){
		var _left = $(this).offset().left, _top = $(this).offset().top + $(this).height() + 5;
		if(null == customerObj){
			loadCustomerList(_top, _left, "selCustomer2");
		}else{
			openCustomerDialog(_top, _left, "selCustomer2", customerObj);
		}
	});

	$("#selTechnician1").click(function(){
		var _left = $(this).offset().left, _top = $(this).offset().top + $(this).height() + 5;
		if(null == technicianObj){
			loadTechnicianList(_top, _left, "selTechnician1");
		}else{
			openTechnicianDialog(_top, _left, "selTechnician1", technicianObj);
		}
	});

	$("#selTechnician2").click(function(){
		var _left = $(this).offset().left, _top = $(this).offset().top + $(this).height() + 5;
		if(null == technicianObj){
			loadTechnicianList(_top, _left, "selTechnician2");
		}else{
			openTechnicianDialog(_top, _left, "selTechnician2", technicianObj);
		}
	});

	//房间预约列表
	function loadRoomReservation(){
		var bookDate = $("#selDateShow1").text();
		var roomId = $("#selRoom1 span").attr("data-id");
		var jsonData = "{'shopId':"+shopID+", 'bookingDate':'"+bookDate+"'";
		if(roomId != -1){
			jsonData += ", 'roomId':"+roomId;
		}
		jsonData += "}";

		var res = reqAjax("shop/roomsForBooking", jsonData);
		var sHtml = "";
		if(res.code == 1){
			var obj = res.data;
			for(var i=0; i<obj.length; i++){
				i % 2 == 0 ? sHtml += '<li class="odd">' : sHtml += '<li class="even">';
				sHtml += '<span class="worker-name">'+obj[i].name+'</span>'
				sHtml += '<div class="work-list">';
				var timeArr = obj[i].timeTable;
				for(var j=0; j<timeArr.length; j++){
					if(timeArr[j].count == 0){
						sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-2"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>'
					}else{
						sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-5"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>'
					}
				}
				sHtml += '</div></li>'
			}
		}else{
			layer.alert(res.msg);
		}
		$("#roomReservationList").html(sHtml);

	}

	//技师预约列表
	function loadTechnicianReservation(){
		var bookDate = $("#selDateShow1").text();
		var waiterId = $("#selTechnician1 span").attr("data-id");
		var jsonData = "{'shopId':"+shopID+", 'bookingDate':'"+bookDate+"'";
		if(waiterId != -1){
			jsonData += ",'waiterId':"+waiterId
		}
		jsonData += "}";

		var res = reqAjax("shop/waitersWithTimetable", jsonData);
		var sHtml = "";
		if(res.code == 1){
			var obj = res.data;
			for(var i=0; i<obj.length; i++){
				i % 2 == 0 ? sHtml += '<li class="odd">' : sHtml += '<li class="even">';
				sHtml += '<span class="worker-name">'+obj[i].username+'</span>'
				sHtml += '<div class="work-list">';
				var timeArr = obj[i].timeTable;
				for(var j=0; j<timeArr.length; j++){
					if(timeArr[j].count == 0){
						sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-2"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>';
					}else{
						sHtml += '<a href="javascript:void(0);"><span class="status-icon status-icon-5"></span><label class="time">'+timeArr[j].time.substring(0, 5)+'</label></a>';
					}
				}
				sHtml += '</div></li>'
			}
		}else{
			layer.alert(res.msg);
		}
		$("#technicianReservationList").html(sHtml);
	}


	//客户预约列表
	function loadReservationList(){

		var bookDate = $("#selDateShow2").text();
		var searchCustomerId = $("#selCustomer2 span").attr("data-id"),
			searchTechnicianId = $("#selTechnician2 span").attr("data-id");
		var pageNo = 1, pageSize = 100;

		var jsonData = "{'shopId': " + shopID + ", 'bookDate': '" + bookDate +"'";
		if(searchCustomerId != -1){
			jsonData += ", 'customerId':" + searchCustomerId
		}
		if(searchTechnicianId != -1){
			jsonData += ", 'waiterId':" + searchTechnicianId;
		}

		jsonData += ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";

		var res = reqAjax("shop/shopBookingList", jsonData);
		if(res.code == 1){
			var obj = res.data, sHtml = "";
			for(var i=0; i<obj.length; i++){
				var status = "";
				if(obj[i].status == -1) {
					status = "已取消";
				} else if (obj[i].status == 0) {
					status = "预约中";
				} else if (obj[i].status == 1) {
					status = "已签到";
				}
				sHtml += '<div class="sign-detail"><div class="sign-title">'+obj[i].bookDate+'</div>'
				+ '<div class="sign-con"><dl>'
				+ '<dd class="sign-item customer-name"><label>预约客户：</label><span>'+obj[i].customerName+'</span></dd>'
				+ '<dd class="sign-item customer-tel"><label>客户电话：</label><span>'+obj[i].mobile+'</span></dd>'
				+ '<dd class="sign-item order-item"><label>预约项目：</label><span>'+obj[i].serviceName+'</span></dd>'
				+ '<dd class="sign-item order-technician"><label>预约技师：</label><span>'+obj[i].waiterName+'('+obj[i].bookTime+')</span></dd>'
				+ '<dd class="sign-item order-room"><label>预约房间：</label><span>'+obj[i].roomName+'('+obj[i].bookTime+')</span></dd>'
				+ '<dd class="sign-item order-detail"><label>预约情况：</label><span>'+status+'</span></dd>'
				+ '<dd class="sign-item order-remark"><label>预约备注：</label><span>'+obj[i].summary+'</span></dd></dl>';
				if(obj[i].status != 1){
					sHtml += '<div class="sign-btns"><button data-id="'+obj[i].id+'" class="btn submit-btn">确认签到</button><button data-id="'+obj[i].id+'" class="btn cancel-btn">取消预约</button></div>';
				}
				sHtml  += "</div></div>";

			}
			$("#signInList").html(sHtml);
		}else{
			$("#signInList").html("");
			layer.alert(res.msg);
		}
	}
	//查询
	$("#searchByCondition2").click(function(){
		loadReservationList();
	});


	$("#signInList").delegate(".submit-btn", "click", function(){
		bookingStatusChange($(this).attr('data-id'), 1);
	}).delegate(".cancel-btn", "click", function(){
		bookingStatusChange($(this).attr('data-id'),0);
	});

	//客户预约签到、取消
	function bookingStatusChange(id, status){
		////预约ID, [{0,"取消预约"},{1,"客户签到"}]
		var jsonData = "{'id': "+id+", 'change': "+status+"}"
		var res = reqAjax("shop/bookingStatusChange", jsonData);
		if(res.code == 1){
			status == 1 ? layer.msg("签到成功！") : layer.msg("预约取消成功！");
		}else{
			layer.alert(res.msg);
		}
		//操作结束后，刷新数据列表
		loadReservationList();
	}

})(jQuery);
