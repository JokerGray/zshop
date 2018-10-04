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
	var cmd = "mainMenu/profitAccountStatistics";
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
				
				var turnTable = res.data.turnTableProfit;
				var zSell = res.data.zSellProfit;
				var livePrestorage = res.data.livePrestorageProfit;
				var professionalProduction = res.data.professionalProductionProfit;
				var headlines = res.data.headlinesProfit;
				var merchantUpgrade = res.data.merchantUpgradeProfit;
				var anchorCommission = res.data.anchorCommission;
				var profitExtract = res.data.profitExtract;
				var laborCostStorage = res.data.laborCostStorage;
				var classRoom = res.data.classRoomProfit;
				
				$("#turnTable").text(fmoney(turnTable, 2));
				$("#zSell").text(fmoney(zSell, 2));
				$("#livePrestorage").text(fmoney(livePrestorage, 2));
				$("#professionalProduction").text(fmoney(professionalProduction, 2));
				$("#headlines").text(fmoney(headlines, 2));
				$("#merchantUpgrade").text(fmoney(merchantUpgrade, 2));
				$("#anchorCommission").text(fmoney(anchorCommission, 2));
				$("#profitExtract").text(fmoney(profitExtract, 2));
				$("#laborCostStorage").text(fmoney(laborCostStorage, 2));
				$("#classRoom").text(fmoney(classRoom, 2));
				
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
		billTimeStart: startTimes,
		billTimeEnd: endTimes, 	
	}
	
	return JSON.stringify(jsonData);
}

//查询搜索事件
$("#searchBtn").bind("click",function(){
	
	init();
})


//链接详情页
$(".zhuanpan").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "转盘收入明细";
	var type = 1;
	var url = "finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});

$(".zbgoumai").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "智币充值收入明细";
	var type = 2;
	var url = "finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});

$(".zbyucun").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "直播预存收入明细";
	var type = 3;
	var url = "finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});

$(".zyzz").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "专业制作收入明细";
	var type = 4;
	var url = "finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});

$(".shsj").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "商户升级收入明细";
	var url = "finance/merchant/merchantUpgradeProfitDetail.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".tt").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "头条收入明细";
	var type = 12;
	var url = "finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});

$(".lwfcunru").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "劳务费存入明细";
	var url = "finance/profitExtract/laborCostStoreLog.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".shourutiqu").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "收入提取明细";
	var url = "finance/profitExtract/profitExtractLog.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".zbyjfafang").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var type = -13;
	var name = "主播佣金发放明细";
	var url = "finance/income/commissionPayoffDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});

$(".classRoom").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var type = 9;
	var name = "智享课堂购买明细";
	var url = "finance/income/commissionPayoffDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	addTabs(url, name);	
});