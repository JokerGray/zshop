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
	var cmd = "z/selZbStatisticsInfo";
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
				//安卓
				var andrPurchaseCount = res.data.andrPurchaseCount;
				var andrPurchaseAmount = res.data.andrPurchaseAmount;
				//ios
				var iosPurchaseCount = res.data.iosPurchaseCount;
				var iosPurchaseAmount = res.data.iosPurchaseAmount;
				//总计
				var purchaseTotalCount = res.data.purchaseTotalCount;
				var purchaseTotalAmount = res.data.purchaseTotalAmount;
				//总消耗
				var consumeTotalCount = res.data.consumeTotalCount;
				//可折现
				var exchangeableZCount = res.data.exchangeableZCount;
				//不可折现
				var inexchangeableZCount = res.data.inexchangeableZCount;
				//未消耗
				var restTotalCount = res.data.restTotalCount;
				
				$("#andrPurchaseCount").text(andrPurchaseCount);
				$("#andrPurchaseAmount").text(fmoney(andrPurchaseAmount, 2));
				$("#iosPurchaseCount").text(iosPurchaseCount);
				$("#iosPurchaseAmount").text(fmoney(iosPurchaseAmount, 2));
				$("#purchaseTotalCount").text(purchaseTotalCount);
				$("#purchaseTotalAmount").text(fmoney(purchaseTotalAmount, 2));
				
				$("#consumeTotalCount").text(consumeTotalCount);
				$("#exchangeableZCount").text(exchangeableZCount);
				$("#inexchangeableZCount").text(inexchangeableZCount);
				$("#restTotalCount").text(restTotalCount);
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
	/*if(valiDate()){
		init();
	}*/
	init();
})


function valiDate(){
	var begin,end,result=true,msg;
	begin = $('#qBeginTime').val();
	end = $('#qEndTime').val();
	if(begin == ""){
		msg = '请输入查询起止时间';
		result=false;
	}
	if(end == ""){
		msg = '请输入查询起止时间';
		result=false;
	}
	try {
		new Date(begin);
		new Date(end);
	} catch (e) {
		msg = '时间日期格式不正确';
		result=false;
	}
	if(!result){
		layer.msg(msg);
	}
	return result;
}


//链接详情页
$(".andr").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "安卓平台智币购买明细";
	var source = 1;
	var url = "finance/z/zPurchaseDetail.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
	addTabs(url, name);	
});

$(".ios").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "IOS平台智币购买明细";
	var source = 0;
	var url = "finance/z/zPurchaseDetail.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
	addTabs(url, name);	
});


$(".total").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "智币购买明细";
	var source = -1;
	var url = "finance/z/zPurchaseDetail.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
	addTabs(url, name);	
});


$(".consume").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "智币消耗排行榜";
	var url = "finance/z/zConsumeRanking.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".rest").click(function(){
	var name = "智币账户明细";
	var endTime = $("#qEndTime").val();
	var url = "finance/z/zAccountDetail.html?endTime="+endTime;
	addTabs(url, name);	
});

$(".exchangeable").click(function(){
	var name = "可折现智币明细";
	var url = "finance/z/exchangeableZDetail.html";
	addTabs(url, name);	
});


$(".inexchangeable").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var state = "1";
	var showhide = "none";
	var name = "不可折现智币消耗明细";
	var url = "finance/z/consume.html?startTime="+startTime+"&endTime="+endTime+"&state="+state+"&showhide="+showhide;
	addTabs(url, name);	
});


/*$(".exchangeable").click(function(){
var startTime = $('#qBeginTime').val();
var endTime = $('#qEndTime').val();
var source = 3;
var name = "可折现智币消耗明细";
var url = "finance/z/consume.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
addTabs(url, name);	
});

$(".inexchangeable").click(function(){
var startTime = $('#qBeginTime').val();
var endTime = $('#qEndTime').val();
var source = 2;
var name = "不可折现智币消耗明细";
var url = "finance/z/consume.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
addTabs(url, name);	
});*/

/*$(".total").click(function(){
var startTime = $('#qBeginTime').val();
var endTime = $('#qEndTime').val();
var name = "智币收入统计";
var url = "finance/z/summary.html?startTime="+startTime+"&endTime="+endTime;
addTabs(url, name);	
});*/
