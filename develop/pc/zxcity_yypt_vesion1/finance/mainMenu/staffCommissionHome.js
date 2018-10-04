$(function(){
	// 获取本月起止日期
	var endDate = formatDate(new Date(new Date().getTime())/1000);
    var Nowdate=new Date();
    var MonthFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1);
	 
    // 设置datepicker比较的时间
    startTime = new Date(MonthFirstDay);
    endTime = new Date(endDate);
    
    MonthFirstDay=formatDate(MonthFirstDay.getTime()/1000);
    // 设置本月起止日期
    $('#qBeginTime').val(MonthFirstDay);
    $('#qEndTime').val(endDate);
    
    //页面加载完成后请求统计信息
	init();
})

//请求统计信息
function init(){
	var cmd = "mainMenu/staffCommissionStatistics";
	var data = getSearchParam();
	$.ajax({
		type : "POST",
		url : "/zxcity_restful/ws/rest",
		dataType : "json",
		data : {"cmd" : cmd,"data" : data,"version" : "1"},
		beforeSend : function(request){
			request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
		},
		success : function(res) {
			if(res.code == 1){
				//商户升级
				var merchantUpgradeCommissionAmount = res.data.merchantUpgradeCommissionAmount;
				var merchantUpgradeCommissionNumber = res.data.merchantUpgradeCommissionNumber;
	
				//提成总额
				var totalCommissionAmount = res.data.totalCommissionAmount;
				
				$("#totalAmount").text(fmoney(totalCommissionAmount, 2));
				$("#liveAmount").text(fmoney(0, 2));
				$("#liveNumber").text(0);
				$("#headlineAmount").text(fmoney(0, 2));
				$("#headlineNumber").text(0);
				$("#merchantAmount").text(fmoney(merchantUpgradeCommissionAmount, 2));
				$("#merchantNumber").text(merchantUpgradeCommissionNumber);
		
			}else{
				layer.msg(res.msg);
			}
		},
		error : function(res){
			
		}
	});
}


//拼接查询参数
function getSearchParam(){
	var startTimes=$('#qBeginTime').val();
	var endTimes=$('#qEndTime').val();
	
	var jsonData = {
		startTime: startTimes,
		endTime: endTimes, 	
	}
	
	return JSON.stringify(jsonData);
}

//查询搜索事件
$("#searchBtn").bind("click",function(){
	
	init();
})


//链接详情页
$("#total").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "员工提成明细";
	var commissionType = -1;
	var url = "finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	addTabs(url, name);	
});

$("#live").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "直播员工提成明细";
	var commissionType = 1;
	var url = "finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	addTabs(url, name);	
});

$("#headline").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "头条员工提成明细";
	var commissionType = 2;
	var url = "finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	addTabs(url, name);	
});

$("#merchantUpgrade").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "商户升级员工提成明细";
	var commissionType = 3;
	var url = "finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	addTabs(url, name);	
});

