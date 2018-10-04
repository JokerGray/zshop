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
    // 审核不需要时间
    //$('#qBeginTime').val(MonthFirstDay);
    //$('#qEndTime').val(endDate);
    
    //页面加载完成后请求统计信息
	init();
})

//请求统计信息
function init(){
	var cmd = "mainMenu/audioIndex";
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
				// 提现申请审核
				var cashApplyCount = res.data.cashApplyCount;
				var cashApplySum = res.data.cashApplySum;
				// 提现支付
				var cashPassCount = res.data.cashPassCount;
				var cashPassSum = res.data.cashPassSum;
				// 主播劳务审核
				var liveCommissionTaxCount = res.data.liveCommissionTaxCount;
				var liveCommissionTaxSum = res.data.liveCommissionTaxSum;
				// 主播企业审核
				var liveCommissionEnterpriseCount = res.data.liveCommissionEnterpriseCount;
				var liveCommissionEnterpriseSum = res.data.liveCommissionEnterpriseSum;
				// 线下商户升级审核
				var upgradeOffLineCount = res.data.upgradeOffLineCount;
				var upgradeOffLineSum = res.data.upgradeOffLineSum;
				// 线上商户升级审核
				var upgradeOnLineCount = res.data.upgradeOnLineCount;
				var upgradeOnLineSum = res.data.upgradeOnLineSum;
				// 线上推荐人佣金审核
				var upgradeOnLineCommissionCount = res.data.upgradeOnLineCommissionCount;
				var upgradeOnLineCommissionSum = res.data.upgradeOnLineCommissionSum;
				// 头条结算审核
				var incomeCount = res.data.incomeCount;
				var incomeSum = res.data.incomeSum;
				// 专业制作审核
				var workOrderCount = res.data.workOrderCount;
				var workOrderSum = res.data.workOrderSum;
				
				$("#cashApplyCount").text(cashApplyCount);
				$("#cashApplySum").text(fmoney(cashApplySum, 2));
				
				$("#cashPassCount").text(cashPassCount);
				$("#cashPassSum").text(fmoney(cashPassSum, 2));
				
				$("#liveCommissionTaxCount").text(liveCommissionTaxCount);
				$("#liveCommissionTaxSum").text(fmoney(liveCommissionTaxSum, 2));
				
				$("#liveCommissionEnterpriseCount").text(liveCommissionEnterpriseCount);
				$("#liveCommissionEnterpriseSum").text(fmoney(liveCommissionEnterpriseSum, 2));
				
				$("#upgradeOffLineCount").text(upgradeOffLineCount);
				$("#upgradeOffLineSum").text(fmoney(upgradeOffLineSum, 2));
				
				$("#upgradeOnLineCount").text(upgradeOnLineCount);
				$("#upgradeOnLineSum").text(fmoney(upgradeOnLineSum, 2));
				
				$("#upgradeOnLineCommissionCount").text(upgradeOnLineCommissionCount);
				$("#upgradeOnLineCommissionSum").text(fmoney(upgradeOnLineCommissionSum, 2));
				
				$("#incomeCount").text(incomeCount);
				$("#incomeSum").text(fmoney(incomeSum, 2));
				
				$("#workOrderCount").text(workOrderCount);
				$("#workOrderSum").text(fmoney(workOrderSum, 2));
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

$(".zblaowu").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "主播劳务审核列表";
	var url = "finance/anchorManage/laborCostsReviewList.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".zbqiye").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "主播企业审核列表";
	var url = "finance/anchorManage/enterpriseReviewList.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".shsjxianxia").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "线下商户升级审核列表";
	var url = "finance/merchant/merchantUpgradeOffLineAudit.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".shsjxianshang").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "线上商户升级审核列表";
	var url = "finance/merchant/merchantUpgradeOnLineAudit.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".tjryongjin").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "线上推荐人佣金审核列表";
	var url = "finance/merchant/referenceCommissionAudit.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});

$(".ttjiesuan").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "头条结算审核列表";
	var queryStatus = 1;
	var url = "finance/headlinesPopularize/headines_income_audit.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus="+queryStatus;
	addTabs(url, name);	
});

$(".workorder").click(function(){
	var startTime = $('#qBeginTime').val();
	var endTime = $('#qEndTime').val();
	var name = "专业制作审核列表";
	var url = "finance/professionallyProduced/orderReview.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);	
});



