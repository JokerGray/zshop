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
	var cmd = "mainMenu/withdrawCashIndex";
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
				// 申请
				var applyCount = res.data.applyCount;
				var applySum = res.data.applySum;
				// 审核通过
				var passCount = res.data.passCount;
				var passSum = res.data.passSum;
				// 审核不通过
				var notPassCount = res.data.notPassCount;
				var notPassSum = res.data.notPassSum;
				// 支付成功
				var payCount = res.data.payCount;
				var paySum = res.data.paySum;
				// 提现退回
				var returnCount = res.data.returnCount;
				var returnSum = res.data.returnSum;
				
				$("#applyCount").text(applyCount);
				$("#applySum").text(fmoney(applySum, 2));
				
				$("#passCount").text(passCount);
				$("#passSum").text(fmoney(passSum, 2));
				
				$("#notPassCount").text(notPassCount);
				$("#notPassSum").text(fmoney(notPassSum, 2));
				
				$("#payCount").text(payCount);
				$("#paySum").text(fmoney(paySum, 2));
				
				$("#returnCount").text(returnCount);
				$("#returnSum").text(fmoney(returnSum, 2));
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
$(".txshenqing").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "提现申请列表";
	var url = "finance/trade/audit.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".txtongguo").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "提现支付列表";
	var url = "finance/trade/cash.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});


$(".txbutongguo").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "提现审核不通过列表";
	var state = 2;
	var url = "finance/pool/cash.html?startTime="+startTime+"&endTime="+endTime+"&state="+state;
	addTabs(url, name);	
});


$(".txfafang").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "提现支付完成列表";
	var state = 3;
	var url = "finance/pool/cash.html?startTime="+startTime+"&endTime="+endTime+"&state="+state;
	addTabs(url, name);	
});

$(".txtuihui").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "提现退回列表";
	var state = 4;
	var url = "finance/pool/cash.html?startTime="+startTime+"&endTime="+endTime+"&state="+state;
	addTabs(url, name);	
});



