var apikey = sessionStorage.getItem('apikey');
layui.use('laydate', function(){             
	var laydate = layui.laydate;
	
	//日期控件
	laydate.render({
		elem: '#startDate',
		done: function(value) {
			$('.startDate').eq(0).attr('data-date', value)
		}
	});
	laydate.render({
		elem: '#endDate',
		done: function(value) {
			$('.endDate').eq(0).attr('data-date', value)
		}
	});
	
	//获取当前月起止日期
	var date=new Date();
	var monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	//格式化日期
	var startTime = formatDate(monthFirstDay.getTime()/1000);
	var endTime = formatDate(date.getTime()/1000);
	//初始化日期控件              审核不需要时间
	//$('#startDate').val(startTime);
	//$('#endDate').val(endTime);
	
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
			request.setRequestHeader("apikey", apikey ? apikey : 'test');
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
	var startTimes=$('#startDate').val();
	var endTimes=$('#endDate').val();
	
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
$(".txshenqing").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "提现申请列表";
	var url = "page/finance/trade/audit.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".txtongguo").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "提现支付列表";
	var url = "page/finance/trade/cash.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".zblaowu").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "主播劳务审核列表";
	var url = "page/finance/anchorManage/laborCostsReviewList.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".zbqiye").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "主播企业审核列表";
	var url = "page/finance/anchorManage/enterpriseReviewList.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".shsjxianxia").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "线下商户升级审核列表";
	var url = "page/finance/merchant/merchantUpgradeOffLineAudit.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".shsjxianshang").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "线上商户升级审核列表";
	var url = "page/finance/merchant/merchantUpgradeOnLineAudit.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".tjryongjin").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "线上推荐人佣金审核列表";
	var url = "page/finance/merchant/referenceCommissionAudit.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".ttjiesuan").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "头条结算审核列表";
	var queryStatus = 1;
	var url = "page/finance/headlinesPopularize/headines_income_audit.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus="+queryStatus;
	parent.addTabs(url, name);	
});
