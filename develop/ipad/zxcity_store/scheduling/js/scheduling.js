(function($){
	var shopId = sessionStorage.getItem("shopId");
/*日期插件开始*/
	$("#selectDateBtn").click(
			function() {
				WdatePicker({
					el : 'dateSelector',
					dateFmt : 'yyyy-MM',
					minDate : '2016-12',
					isShowClear : false,
					// isShowToday:false,
					isShowOK : false,
					onpicked : function() {
						var timeArr = $("#dateSelector").val().split("-");
						$("#currentDateShow").html(
								timeArr[1] + "<br>" + timeArr[0]).attr(
								'data-curdate', $("#dateSelector").val());
						dateListInit(1, $dp.cal.date.y, $dp.cal.date.M);
					}
				});
			});
	// 日期初始化执行方法
	function dateListInit(day, year, month) {
		// 获取当前选择月份的最大天数
		var today = -1;
		if (year == new Date().getFullYear()
				&& month == new Date().getMonth() + 1) {
			today = day = new Date().getDate();
		}
		var maxDays = new Date(year, month, 0).getDate();
		var sHtml = "";
		var oInnerBox = $(".date-list-box .date-list-inner"), oDateList = $(".date-list-box .date-list"), oPrevBtn = $(".date-list-box .prev"),
		oNextBtn = $(".date-list-box .next"), innerWidth = 1000, // oInnerBox.width(),
		nextBtnLeft = 1110, // parseInt(oNextBtn.css("left")),
		d = parseInt(day / 11) > 2 ? 2 : parseInt(day / 11);

		for (var i = 1; i <= maxDays; i++) {
			if (today == i) {
				sHtml += '<a data-day="'
						+ i
						+ '" class="today selected" href="javascript:void(0);">今日</a>';
			} else if (i < today) {
				sHtml += '<a data-day="' + i + '" class="disabled">' + i
						+ '</a>';
			} else {
				sHtml += '<a data-day="' + i + '" href="javascript:void(0);">'
						+ i + '</a>';
			}
		}
		oDateList.html(sHtml);
		oDateList.undelegate().delegate("a", "click",
				function() {
					$(this).addClass("selected").siblings().removeClass("selected");
					ajaxQuery();//点击日期执行AJAX查询并渲染页面
				});

		var perWidth = $(oDateList.find("a")[0]).width(), perMarginW = parseInt($(
				".date-list-inner .date-list a+a").css("margin-left"));

		if (maxDays == 31 && d >= 2) {
			oInnerBox.width(innerWidth + perWidth);
			oNextBtn.css("left", nextBtnLeft + perWidth + perMarginW);
		} else {
			oInnerBox.width(innerWidth);
			oNextBtn.css("left", nextBtnLeft);
		}
		oDateList.css("left", -(d * 11 * (perWidth + perMarginW)));

		oPrevBtn.attr("data-cur", d).attr("data-actual", d);
		oNextBtn.attr("data-cur", d).attr("data-actual", d);

		dateClickFun(perWidth, perMarginW, nextBtnLeft, innerWidth, maxDays);
	}

	// 日期切换事件
	function dateClickFun(perWidth, perMarginW, nextBtnLeft, innerWidth,maxDays) {
		var oInnerBox = $(".date-list-box .date-list-inner"),
			oDateList = $(".date-list-box .date-list"),
			oPrevBtn = $(".date-list-box .prev"),
			oNextBtn = $(".date-list-box .next");
		/*前进点击事件*/
		oNextBtn.unbind("click").bind("click", function(event) {
			if(parseInt(oNextBtn.attr("data-cur")) >= 2){
				return ;
			}
			var nextStep = parseInt(oNextBtn.attr("data-cur")) + 1;
			oPrevBtn.attr("data-cur", nextStep);
			oNextBtn.attr("data-cur", nextStep);
			oDateList.animate({
				"left" : -(nextStep * 11 * (perWidth + perMarginW))
			}, "swing", function() {
				if (maxDays == 31 && nextStep == 2) {
					oInnerBox.width(innerWidth + perWidth);
					oNextBtn.css("left", nextBtnLeft + perWidth + perMarginW);
				} else {
					oInnerBox.width(innerWidth);
					oNextBtn.css("left", nextBtnLeft);
				}
			});

		});
		/*后退点击事件*/
		oPrevBtn.unbind("click").bind("click",function() {
			if(parseInt(oNextBtn.attr("data-cur")) <= 0){
				return ;
			}
							var prevStep = parseInt(oNextBtn.attr("data-cur")) - 1, actual = parseInt(oPrevBtn.attr("data-actual"));
							oPrevBtn.attr("data-cur", prevStep);
							oNextBtn.attr("data-cur", prevStep);
							oDateList.animate({
												"left" : -(prevStep * 11 * (perWidth + perMarginW))
											},
											"swing",
											function() {
												oInnerBox.width(innerWidth);
												oNextBtn.css("left",
														nextBtnLeft);

											});

									});
	}

	// 日期初始化
	$(function() {
		var now = new Date();
		var curDate = [ now.getFullYear(), now.getMonth() + 1 ].join('-')
				.replace(/(?=\b\d\b)/g, '0');
		$("#currentDateShow").html(
				now.getMonth() + 1 + "<br>" + now.getFullYear()).attr(
				'data-curdate', curDate);
		dateListInit(now.getDate(), now.getFullYear(), now.getMonth() + 1);
		ajaxQuery();
	});
/* 日期结束 */
	/*获取日期方法*/
	var getDate=function(){
		var datetime=$("#currentDateShow").html().split("<br>");
		var dateY=datetime[1],
			dateM=datetime[0],
			dateD=$(".date-list>a.selected").html();
		if(dateD == "今日"){
			dateD = new Date().getDate();
			if(parseInt(dateD) < 10){
				dateD="0"+dateD;
			}
		}else{
			dateD=parseInt(dateD);
			if(dateD < 10){
				dateD = "0" + dateD ;
			}
		}

		if(parseInt(dateM)<10){
			dateM="0"+dateM;
		}
		var dateStr=dateY+"-"+dateM+"-"+dateD;
		return dateStr;
	};
	var schedulingflagArr=[],//获取排班值数组
	 	backUserIdArr=[],//获取销售人员ID数组
	 	overtimeFlagArr=[],//获取加班值数组
		//userIdArr=[],//用户登录ID数组
		askForLeaveArr=[];//是否请假数组
	var ajaxQuery=function(){
		backUserIdArr=[];
		//userIdArr=[];

		var schedulingDate =getDate(),
		pagination= "{page:1,rows:100}";
		var jsonData = '{"shopId":' + shopId + ',"schedulingDate":"'
		+ schedulingDate + '","pagination":' + pagination + '}';
		var res = reqAjax('shop/querySchedulingList', jsonData);
		/*延迟用户点击*/
		$("#ajaxMaskLayer").ajaxStart(function(){
			$(this).css("display","block");
		});
		$("#ajaxMaskLayer").ajaxComplete(function(){
			$(this).css("display","none");
		});
		if(res.code == 1){
			var jsondata=res.data,dataList=res.data.list;
			if((jsondata.flag == 1 && jsondata.list.length == 0) || (jsondata.flag == -1 && jsondata.list.length == 0)|| (jsondata.flag == 0 && jsondata.list.length == 0)){
				$("#work-group").html('');
				setTimeout(function(){
					layer.msg("这天数据为空，请确认日期重新操作！！");
					return ;
				},200);
				return ;
			}
			paintingPage(jsondata);/*渲染页面*/
			for(var i=0 ; i< dataList.length;i++){
				backUserIdArr.push(dataList[i].backUserId);
			}
		}else{
			layer.alert(res.msg);
		}
	}
	//保存成功传递数据给后台
	var ajaxSendData=function(JSONDATA){
		var res = reqAjax('shop/doScheduling',JSONDATA);
		/*延迟用户点击*/
		$("#ajaxMaskLayer").ajaxStart(function(){
			$(this).css("display","block");
		});
		$("#ajaxMaskLayer").ajaxComplete(function(){
			$(this).css("display","none");
		});
		if(res.code == 1){
			console.log("Send JSONDATA is successful!"+"\n\n传递的数据为："+JSONDATA);
		}else{
			layer.alert(res.msg);
		}
	}
	// 渲染页面方法
	var paintingPage=function(jsondata){
		$("#work-group").html('');
		var sellerArr = [];
		var sellerList =jsondata.list;
		for (var i = 0; i < sellerList.length; i++) {
			var backuserImg =sellerList[i].backUserAvatar, // 头像
				backuserName =sellerList[i].backUsername, // 姓名
				askForLeaveValue=sellerList[i].askForLeave;//是否请假
			var arr1;
			if(sellerList[i].overtimeFlag == null && askForLeaveValue == 0){
				arr1='</div><div class="more_relex"><span>加班</span><span>请假</span></div>';
			}else if(sellerList[i].overtimeFlag == null && askForLeaveValue == null){
				arr1='</div><div class="more_relex"><span>加班</span><span>请假</span></div>';
			}else if(sellerList[i].overtimeFlag == null && askForLeaveValue == 1){
				arr1='</div><div class="more_relex"><span>加班</span><span class="relex">请假</span></div>';
			}else if(sellerList[i].overtimeFlag != null && askForLeaveValue == 0){
				arr1='</div><div class="more_relex"><span class="morework">加班</span><span>请假</span></div>';
			}else if(sellerList[i].overtimeFlag != null && askForLeaveValue == null){
				arr1='</div><div class="more_relex"><span class="morework">加班</span><span>请假</span></div>';
			}else if(sellerList[i].overtimeFlag != null && askForLeaveValue == 1){
				arr1='</div><div class="more_relex"><span class="morework">加班</span><span class="relex">请假</span></div>';
			}
			var arr2;
			if(sellerList[i].schedulingFlag == 0 && sellerList[i].overtimeFlag == null){
				arr2='<ul class="daytime"><li class="morning clicked">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 0 && sellerList[i].overtimeFlag == 1){
				arr2='<ul class="daytime"><li class="morning clicked">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 0 && sellerList[i].overtimeFlag == 2){
				arr2='<ul class="daytime"><li class="morning clicked">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 0 && sellerList[i].overtimeFlag == '1,2'){
				arr2='<ul class="daytime"><li class="morning clicked">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}

			if(sellerList[i].schedulingFlag == 1 && sellerList[i].overtimeFlag == null){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon clicked">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 1 && sellerList[i].overtimeFlag == 0){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon clicked">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 1 && sellerList[i].overtimeFlag == 2){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon clicked">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 1 && sellerList[i].overtimeFlag == '0,2'){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon clicked">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}

			if(sellerList[i].schedulingFlag == 2 && sellerList[i].overtimeFlag == null){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night clicked">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 2 && sellerList[i].overtimeFlag == 0){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night clicked">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 2 && sellerList[i].overtimeFlag == 1){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night clicked">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 2 && sellerList[i].overtimeFlag == '0,1'){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night clicked">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}

			if(sellerList[i].schedulingFlag == 3){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="all_day clicked">全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}

			if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == null){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == 0){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == 1){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == 2){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == '0,1'){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == '0,2'){
				arr2='<ul class="daytime"><li class="morning first">早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == '1,2'){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="afternoon second">中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li class="night third">晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}else if(sellerList[i].schedulingFlag == 4 && sellerList[i].overtimeFlag == '0,1,2'){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="all_day forth">全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li class="rest clicked">休</li></ul>';
			}

			if(sellerList[i].schedulingFlag == null){
				arr2='<ul class="daytime"><li>早<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>中<img src="../img/plusicon.png"/>'+
						'<span class="glyphicon glyphicon-ban-circle"></span></li><li>晚<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>全<img src="../img/plusicon.png"/><span class="glyphicon glyphicon-ban-circle"></span></li><li>休</li></ul>';
			}

			var liEle = '<li class="worker"><img src="'
						+ backuserImg
						+ '"/><div class="username">'
						+ backuserName
						+arr1
						+arr2
						+'</li>'
						;
			sellerArr.push(liEle);
		}
		$("#work-group").html(sellerArr);
		if(jsondata.flag == 0 || jsondata.flag == -1){
			$(".daytime li").unbind("click").bind("click",workClickFun);
			$(".more_relex span").unbind("click").bind("click",more_relexFun);
		}
	}
/*早中晚上班点击事件*/
	var workClickFun=function(){
		var html_ele = $(this);
		var html_value = $(this)[0].innerHTML.slice(0,1);
		if(html_ele.parent().parent().find(".more_relex span:first-child").hasClass("morework")){
			var hasclicked_ele=html_ele.parent().find("li.clicked");
			var hasclicked_value=hasclicked_ele.html().slice(0,1);
			switch (hasclicked_value) {
			case '早':
				if(html_value == "中"){
					if(html_ele.hasClass("afternoon second")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("afternoon second");
					}
				}else if(html_value == "晚"){
					if(html_ele.hasClass("night third")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("night third");
					}
				}else if(html_value == "全"){
					html_ele.removeClass();
				}else if(html_value == "休"){
					html_ele.removeClass();
				}
				break;
			case '中':
				if(html_value == "早"){
					if(html_ele.hasClass("morning first")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("morning first");
					}
				}else if(html_value == "晚"){
					if(html_ele.hasClass("night third")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("night third");
					}
				}else if(html_value == "全"){
					html_ele.removeClass();
				}else if(html_value == "休"){
					html_ele.removeClass();
				}
				break;
			case '晚':
				if(html_value == "早"){
					if(html_ele.hasClass("morning first")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("morning first");
					}
				}else if(html_value == "中"){
					if(html_ele.hasClass("afternoon second")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("afternoon second");
					}
				}else if(html_value == "全"){
					html_ele.removeClass();
				}else if(html_value == "休"){
					html_ele.removeClass();
				}
				break;
			case '休' :
				if(html_value == "早"){
					if(html_ele.hasClass("morning first")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("morning first");
					}
					if(html_ele.parent().find("li:nth-of-type(4)").hasClass("all_day")){
						html_ele.parent().find("li:nth-of-type(4)").removeClass();
					}
				}else if(html_value == "中"){
					if(html_ele.hasClass("afternoon second")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("afternoon second");
					}
					if(html_ele.parent().find("li:nth-of-type(4)").hasClass("all_day")){
						html_ele.parent().find("li:nth-of-type(4)").removeClass();
					}
				}else if(html_value == "晚"){
					if(html_ele.hasClass("night third")){
						html_ele.removeClass();
					}else{
						html_ele.addClass("night third");
					}
					if(html_ele.parent().find("li:nth-of-type(4)").hasClass("all_day")){
						html_ele.parent().find("li:nth-of-type(4)").removeClass();
					}
				}else if(html_value == "全"){
					html_ele.addClass("all_day forth");
					html_ele.parent().find("li:first-child").removeClass();
					html_ele.parent().find("li:nth-of-type(2)").removeClass();
					html_ele.parent().find("li:nth-of-type(3)").removeClass();
				}
				if(html_ele.parent().children().hasClass("first") &&
						html_ele.parent().children().hasClass("second") &&
							html_ele.parent().children().hasClass("third")){
					html_ele.parent().children().removeClass("first second third morning afternoon night");
					html_ele.parent().find("li:nth-of-type(4)").addClass("all_day forth");
				}
				break;
			}
	    /*判断分割*/
		}else{
			$(this).siblings().removeClass();
			$(this).addClass("clicked");
			switch (html_value) {
			case '早':
				html_ele.hasClass("morning") ? html_ele
						.removeClass() : html_ele
						.addClass("morning");
				break;
			case '中':
				html_ele.hasClass("afternoon") ? html_ele
						.removeClass() : html_ele
						.addClass("afternoon");
				break;
			case '晚':
				html_ele.hasClass("night") ? html_ele.removeClass()
						: html_ele.addClass("night");
				break;
			case '全':
				html_ele.hasClass("all_day") ? html_ele
						.removeClass() : html_ele
						.addClass("all_day");
				break;
			case '休':
				html_ele.hasClass("rest") ? html_ele.removeClass()
						: html_ele.addClass("rest");
				break;
			}
		}

	}
/* 加班or休息点击事件 */
	var more_relexFun = function(){
		var span_ele = $(this);
		var span_value = $(this)[0].innerHTML;
		if(span_value == "请假"){
			if(span_ele.hasClass("relex")){
				span_ele.removeClass("relex");
				span_ele.parent().parent().find(".clicked span").css("display","none");
				span_ele.parent().parent().find(".daytime").children().css("pointer-events","auto");//pointer-events
			}else{
				span_ele.addClass("relex");
				span_ele.parent().parent().find(".clicked span").css("display","block");

				if(span_ele.parent().parent().find(".daytime li:last-child").hasClass("rest")){//pointer-events
					span_ele.parent().parent().find(".daytime").children().css("pointer-events","auto");
				}else{
					span_ele.parent().parent().find(".daytime").children().css("pointer-events","none");
				}

				if(!span_ele.parent().parent().find(".daytime li").hasClass("clicked")){
					span_ele.removeClass();
					span_ele.parent().parent().find(".daytime").children().css("pointer-events","auto");//pointer-events
					layer.msg("您未排班，所以不能请假，请先排班！！");
					return;
				}
			}
			if(span_ele.parent().parent().find(".daytime li:last-child").hasClass("rest")){
				span_ele.removeClass();
				span_ele.parent().parent().find(".masklayer").css("display","none");
				layer.msg("亲，排的班已经是休了，不能点击请假了！");
				return;
			}
		}
		if(span_value == "加班"){
			if(span_ele.hasClass("morework")){
				span_ele.removeClass("morework");
				span_ele.parent().parent().find("li.first").removeClass();
				span_ele.parent().parent().find("li.second").removeClass();
				span_ele.parent().parent().find("li.third").removeClass();
				span_ele.parent().parent().find("li.forth").removeClass();
				if(span_ele.siblings().hasClass("relex")){//pointer-events
					span_ele.parent().parent().find(".daytime li").css("pointer-events","none");
				}
			}else{
				span_ele.addClass("morework");
				if(span_ele.siblings().hasClass("relex")){//pointer-events
					span_ele.parent().parent().find(".daytime li.clicked").css("pointer-events","none");
					span_ele.parent().parent().find(".daytime li.clicked").siblings().css("pointer-events","auto");
				}
			}

			if(span_ele.parent().parent().find(".daytime li:nth-of-type(4)").hasClass("all_day")){
				span_ele.removeClass("morework");
				layer.msg("亲，已经排了全班就不能再加班了，\n他又不是一头牛！！");
				if(span_ele.siblings().hasClass("relex")){//pointer-events
					span_ele.parent().parent().find(".daytime li").css("pointer-events","none");
				}
			}else if(! span_ele.parent().parent().find(".daytime li").hasClass("clicked")){
				span_ele.removeClass("morework");
				layer.msg("亲，请先排好了班再为其加班！！");
				return ;
			}
		}
	}
/*点击保存按钮保存方法*/
	var saveBtnClick=function(){
		var relexArr=$(".more_relex span:last-child");
		for(var i=0;i<relexArr.length;i++){
			var relexValue;
			if($(relexArr[i]).hasClass("relex")){
				relexValue = 1 ;
			}else{
				relexValue = 0 ;
			}
			askForLeaveArr.push(relexValue);
		}
		var daytimeArr=$(".daytime");
		for(var i=0;i<daytimeArr.length;i++){
			if(! $(daytimeArr[i]).children().hasClass("clicked")
					&& ! $(daytimeArr[i]).parent().find(".more_work span:last-child").hasClass("relex")){
				layer.msg("第"+(i+1)+"个员工数据为空，请注意补全！");
				return ;
			}
			if($(daytimeArr[i]).parent().find(".more_relex span:first-child").hasClass("morework")
					&& ! $(daytimeArr[i]).children().hasClass("first")
					&& ! $(daytimeArr[i]).children().hasClass("second")
					&& ! $(daytimeArr[i]).children().hasClass("third")
					&& ! $(daytimeArr[i]).children().hasClass("forth")){
				layer.msg("第"+(i+1)+"个员工若不加班请取消加班，若加班请补全！！");
				return ;
			}
			var liValue=$(daytimeArr[i]).find("li.clicked").html();
			liValue=liValue.slice(0,1);
			var value;
			if(liValue=="早"){
				value=0;
			}else if(liValue=="中"){
				value=1;
			}else if(liValue=="晚"){
				value=2;
			}else if(liValue=="全"){
				value=3;
			}else if(liValue=="休"){
				value=4;
			}else {
				value=null;
			}
			schedulingflagArr.push(value);

			var overtimeValue;
			if($(daytimeArr[i]).find("li").hasClass("first")
					&& ! $(daytimeArr[i]).find("li").hasClass("second")
						&& ! $(daytimeArr[i]).find("li").hasClass("third")){
				overtimeValue='0';
			}else if($(daytimeArr[i]).find("li").hasClass("second")
					&& ! $(daytimeArr[i]).find("li").hasClass("first")
						&& ! $(daytimeArr[i]).find("li").hasClass("third")){
				overtimeValue='1';
			}else if($(daytimeArr[i]).find("li").hasClass("third")
					&& ! $(daytimeArr[i]).find("li").hasClass("second")
						&& ! $(daytimeArr[i]).find("li").hasClass("first")){
				overtimeValue='2';
			}else if($(daytimeArr[i]).find("li").hasClass("first") &&
						$(daytimeArr[i]).find("li").hasClass("second") &&
							! $(daytimeArr[i]).find("li").hasClass("third")){
				overtimeValue=[0,1];
			}else if($(daytimeArr[i]).find("li").hasClass("first") &&
						$(daytimeArr[i]).find("li").hasClass("third")
							&& ! $(daytimeArr[i]).find("li").hasClass("second")){
				overtimeValue=[0,2];
			}else if($(daytimeArr[i]).find("li").hasClass("second") &&
						$(daytimeArr[i]).find("li").hasClass("third") &&
							! $(daytimeArr[i]).find("li").hasClass("first")){
				overtimeValue=[1,2];
			}else if($(daytimeArr[i]).find("li").hasClass("forth")){
				overtimeValue=[0,1,2];
			}else{
				overtimeValue= "no";
			}
			overtimeFlagArr.push(overtimeValue);
		}

		var sendList=[];
		var schedulingDate=getDate();

		for(var i=0;i<daytimeArr.length;i++){
			var singleObj;
			if(overtimeFlagArr[i] == "no"){
				singleObj='{"shopId":'+shopId+',"schedulingDate":"'+schedulingDate+
				'","backUserId":"'+backUserIdArr[i]+'","operator":"0'+
					'","schedulingflag":"'+schedulingflagArr[i]+'","merchantId":"0"'
						+',"askForLeave":"'+askForLeaveArr[i]+'"}';
			}else{
				singleObj='{"shopId":'+shopId+',"schedulingDate":"'+schedulingDate+
				'","backUserId":"'+backUserIdArr[i]+'","operator":"0'+
					'","schedulingflag":"'+schedulingflagArr[i]+'","merchantId":"0"'+
						',"overtimeFlag":"'+overtimeFlagArr[i].toString()
							+'","askForLeave":"'+askForLeaveArr[i]+'"}';
			}
			sendList.push(singleObj);
		}
		var JSONDATA='{"list":['+sendList.join(",")+']}';
		ajaxSendData(JSONDATA);
		$('#myModal').modal('show');
		$('#myModal').on('shown.bs.modal',function(e){
			setTimeout(function(){
				$('#myModal').modal('hide');
			},800);
		});
		schedulingflagArr=[];
		overtimeFlagArr=[];
		askForLeaveArr=[];
	}
	$("#saveBtn").click(saveBtnClick);


})(jQuery);
