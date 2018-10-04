var startTime = "";
var endTime = "";
//专业制作工单审核统计

function selectZyzzWorkOrderAllStatistics(startTimeVal,endTimeVal){
	// 专业制作工单审核完成总个数
	var workOrderDownNumber = 0;
	// 专业制作工单审核完成总收入金额
	var grossIncomeAmount = 0;
	// 专业制作工单审核完成 公司盈利总金额
	var companyProfitAmount = 0;
	
	// 线下工单审核完成个数
	var offlineWorkOrderDownNumber = 0;
	// 线下工单审核完成收入金额
	var offlineGrossIncomeAmount = 0;
	// 线下视频制作收入金额
	var offlineVideoReceivable = 0;
	// 线下720全景制作收入金额
	var offlinePanoramicReceivable = 0;
	// 线下工单审核完成公司盈利金额
	var offlineCompanyProfitAmount = 0;
	// 线下工单审核完成推荐人提成
	var referrerPushMoneyByOffline = 0;
	// 线下工单审核完成制作人提成
	var producerPushMoneyByOffline = 0;
	
	// 线上工单审核完成个数
	var onlineWorkOrderDownNumber = 0;
	// 线上工单审核完成收入金额
	var onlineGrossIncomeAmount = 0;
	// 线上视频制作收入金额
	var onlineVideoReceivable = 0;
	// 线上720全景制作收入金额
	var onlinePanoramicReceivable = 0;
	// 线上工单审核完成公司盈利金额
	var onlineCompanyProfitAmount = 0;
	// 线上工单审核完成推荐人提成
	var referrerPushMoneyByOnline = 0;
	// 线上工单审核完成制作人提成
	var producerPushMoneyByOnline = 0;
	
	var queryInfo ={
			reviewTimeStart:startTimeVal,
			reviewTimeEnd:endTimeVal
	}
	var cmd = 'payZyzzWorkOrderStatistics/selectZyzzWorkOrderAllStatisticsByTime';
    var data = JSON.stringify(queryInfo);
    $.ajax({
        type : "POST",
        url : "/zxcity_restful/ws/rest",
        dataType : "json",
        //async : false,
        data : {"cmd" : cmd,"data" : data,"version" : "1"},
        beforeSend : function(request) {
          request.setRequestHeader("apikey", "test");
        },
        success : function(res) {
        	 if(res.code==1){
        		 
        		 grossIncomeAmount = res.data.grossRevenueMap.grossRevenueCount;
        		 if(grossIncomeAmount == null){
        			 grossIncomeAmount = 0
        		 }
        		 // 总放发佣金
        		 var totalCommissionCount = res.data.grossRevenueMap.totalCommissionCount;
        		 if(totalCommissionCount == null){
        			 totalCommissionCount = 0
        		 }
        		 // 公司盈利总金额  = 总收入金额 - 总放发佣金
        		 companyProfitAmount = grossIncomeAmount - totalCommissionCount;
        		 workOrderDownNumber = res.data.grossRevenueMap.numberCount;
        		 
        		 // 线下工单
        		 offlineWorkOrderDownNumber = res.data.offlineMoneyMap.numberCount;
        		 
        		 offlineGrossIncomeAmount = res.data.offlineMoneyMap.offlineRevenueCount;
        		 if(offlineGrossIncomeAmount == null){
        			 offlineGrossIncomeAmount = 0
        		 }
        		 offlineVideoReceivable = res.data.offlineMoneyMap.offlineVideoReceivable;
        		 if(offlineVideoReceivable == null){
        			 offlineVideoReceivable = 0
        		 }
        		 offlinePanoramicReceivable = res.data.offlineMoneyMap.offlinePanoramicReceivable;
        		 if(offlinePanoramicReceivable == null){
        			 offlinePanoramicReceivable = 0
        		 }
        		 referrerPushMoneyByOffline = res.data.offlineMoneyMap.referrerPushMoneyByOffline;
        		 if(referrerPushMoneyByOffline == null){
        			 referrerPushMoneyByOffline = 0
        		 }
        		 producerPushMoneyByOffline = res.data.offlineMoneyMap.producerPushMoneyByOffline;
        		 if(producerPushMoneyByOffline == null){
        			 producerPushMoneyByOffline = 0
        		 }
        		 // 线下工单公司盈利金额 = 线下收入 - 线下推荐人提成 - 线下制作人提成
        		 offlineCompanyProfitAmount = offlineGrossIncomeAmount - referrerPushMoneyByOffline - producerPushMoneyByOffline;
        		 
        		 //线上工单
        		 onlineWorkOrderDownNumber = res.data.onlineMoneyMap.numberCount;
        		 
        		 onlineGrossIncomeAmount = res.data.onlineMoneyMap.onlineRevenueCount;
        		 if(onlineGrossIncomeAmount == null){
        			 onlineGrossIncomeAmount = 0
        		 }
        		 onlineVideoReceivable = res.data.onlineMoneyMap.onlineVideoReceivable;
        		 if(onlineVideoReceivable == null){
        			 onlineVideoReceivable = 0
        		 }
        		 onlinePanoramicReceivable = res.data.onlineMoneyMap.onlinePanoramicReceivable;
        		 if(onlinePanoramicReceivable == null){
        			 onlinePanoramicReceivable = 0
        		 }
        		 referrerPushMoneyByOnline = res.data.onlineMoneyMap.referrerPushMoneyByOnline;
        		 if(referrerPushMoneyByOnline == null){
        			 referrerPushMoneyByOnline = 0
        		 }
        		 producerPushMoneyByOnline = res.data.onlineMoneyMap.producerPushMoneyByOnline;
        		 if(producerPushMoneyByOnline == null){
        			 producerPushMoneyByOnline = 0
        		 }
        		// 线上工单公司盈利金额 = 线上收入 - 线上推荐人提成 - 线上制作人提成
        		 onlineCompanyProfitAmount = onlineGrossIncomeAmount - referrerPushMoneyByOnline - producerPushMoneyByOnline;
        		 
        		 $("#grossIncomeAmount").text(fmoney(grossIncomeAmount, 2));
        		 $("#companyProfitAmount").text(fmoney(companyProfitAmount, 2));
        		 $("#workOrderDownNumber").text(workOrderDownNumber);
        		 
        		 $("#offlineWorkOrderDownNumber").text(offlineWorkOrderDownNumber);
        		 $("#offlinePanoramicReceivable").text(fmoney(offlinePanoramicReceivable, 2));
        		 $("#offlineGrossIncomeAmount").text(fmoney(offlineGrossIncomeAmount, 2));
        		 $("#offlineVideoReceivable").text(fmoney(offlineVideoReceivable, 2));
        		 $("#referrerPushMoneyByOffline").text(fmoney(referrerPushMoneyByOffline, 2));
        		 $("#producerPushMoneyByOffline").text(fmoney(producerPushMoneyByOffline, 2));
        		 $("#offlineCompanyProfitAmount").text(fmoney(offlineCompanyProfitAmount, 2));
        		 
        		 $("#onlineWorkOrderDownNumber").text(onlineWorkOrderDownNumber);
        		 $("#onlineGrossIncomeAmount").text(fmoney(onlineGrossIncomeAmount, 2));
        		 $("#referrerPushMoneyByOnline").text(fmoney(referrerPushMoneyByOnline, 2));
        		 $("#onlineVideoReceivable").text(fmoney(onlineVideoReceivable, 2));
        		 $("#onlinePanoramicReceivable").text(fmoney(onlinePanoramicReceivable, 2));
        		 $("#producerPushMoneyByOnline").text(fmoney(producerPushMoneyByOnline, 2));
        		 $("#onlineCompanyProfitAmount").text(fmoney(onlineCompanyProfitAmount, 2));
        	 }
        },
        error : function(res){
        	
        }
    });
}

$(function() {
	var date=new Date();
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var date = date.getDate();
	//当前的  年 月 日
	$('#startTime').val(myyear+" - 0"+mymonth+" - 0"+ 1);
	//当前年 月  月份的第一天
	if(date<10){
		date='0'+date;
	}
	if(mymonth<10){
		mymonth = '0'+mymonth;
	}
	$('#endTime').val(myyear+" - "+mymonth+" - "+ date);
	startTime=$('#startTime').val();
	endTime=$('#endTime').val();
	getStartTime();
	getEndTime();
	selectZyzzWorkOrderAllStatistics(startTime,endTime);
});


//点击查询
$("#query-a").click(function(){
		selectZyzzWorkOrderAllStatistics(startTime,endTime);
});

//查看详情
// type 工单类型 1 全部 、2 线下 、 3线上
// workItem 工单制作项目 1 720全景 、 2 视频
// detail 操作记录页面参数 指查找审核通过的记录 
function lookOrderReviewHomeDetails(type,workItem) {
	var name = "";
	var url = "";
	var start = startTime.replace(/\s/g, "");
	var end = endTime.replace(/\s/g, "");
	var onOffLine = "";
	if(type==1){
		name = "专业制作工单审核详情";
	}else if (type==2 && workItem==undefined) {
		name = "线下工单审核详情";
		onOffLine = "2";
	}else if (type==3 && workItem==undefined) {
		name = "线上工单审核详情";
		onOffLine = "1";
	}else if (type==2 && workItem == 0){
		name = "线下视频制作收入详情";
		onOffLine = "2";
	}else if (type==2 && workItem == 1){
		name = "线下720全景制作收入详情";
		onOffLine = "2";
	}else if (type==3 && workItem == 0){
		name = "线上视频制作收入详情";
		onOffLine = "1";
	}else if (type==3 && workItem == 1){
		name = "线上720全景制作收入详情";
		onOffLine = "1";
	}
	if(name){
		url = "finance/professionallyProduced/orderReviewlog.html?startTime=" + start + "&endTime=" + end + "&online=" + onOffLine + "&workItem=" + workItem + "&detail=" + 1;
		addTabs(url, name);
 }
}


//查看工单制作项目详情
//type 工单类型 1 全部 、2 线下 、 3线上
//workItem 工单制作项目 1 720全景 、 2 视频
function lookOrderReviewHomeDetails2(type,workItem) {
	var name = "";
	var url = "";
	var start = startTime.replace(/\s/g, "");
	var end = endTime.replace(/\s/g, "");
	var onOffLine = "";
	if(workItem==null){
		workItem = "";
	}
	if (type==2 && workItem == 0){
		name = "线下视频制作收入详情";
		onOffLine = "2";
	}else if (type==2 && workItem == 1){
		name = "线下720全景制作收入详情";
		onOffLine = "2";
	}else if (type==3 && workItem == 0){
		name = "线上视频制作收入详情";
		onOffLine = "1";
	}else if (type==3 && workItem == 1){
		name = "线上720全景制作收入详情";
		onOffLine = "1";
	}
	if(name){
		url = "finance/mainMenu/professionallyProduced/OrderReviewHomeDetails.html?startTime=" + start + "&endTime=" + end + "&online=" + onOffLine + "&workItem=" + workItem ;
		addTabs(url, name);
 }
}


