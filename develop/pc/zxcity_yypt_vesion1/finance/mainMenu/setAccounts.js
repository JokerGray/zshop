$(function(){
    
    //页面加载完成后请求统计信息
	init();
})

//请求统计信息
function init(){
	var cmd = "mainMenu/cashPoolingOperation";
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
				//收入提取
				var totalProfit = res.data.totalProfit;
				var totalExtractMoney = res.data.totalExtractMoney;
				var extractableMoney = res.data.extractableMoney;
				//劳务费存入
				var totalLaborCosts = res.data.totalLaborCosts;
				var storedMoney = res.data.storedMoney;
				var storableMoney = res.data.storableMoney;
				//预支
				var prepayedMoney = res.data.prepayedMoney;
				var prepayableMoney = res.data.prepayableMoney;
				//支付宝手续费
				var alipayFee = res.data.alipayFee;
				var storedAlipayFee = res.data.storedAlipayFee;
				var storableAlipayFee = res.data.storableAlipayFee;
				
				//收入提取
				$("#totalProfit").text(fmoney(totalProfit, 2));
				$("#totalExtractMoney").text(fmoney(totalExtractMoney, 2));
				$("#extractableMoney").text(fmoney(extractableMoney, 2));
				//劳务费存入
				$("#totalLaborCosts").text(fmoney(totalLaborCosts, 2));
				$("#storedMoney").text(fmoney(storedMoney, 2));
				$("#storableMoney").text(fmoney(storableMoney, 2));
				//预支
				$("#prepayedMoney").text(fmoney(prepayedMoney, 2));
				$("#prepayableMoney").text(fmoney(prepayableMoney, 2));
				//支付宝手续费
				$("#alipayFee").text(fmoney(alipayFee, 2));
				$("#storedAlipayFee").text(fmoney(storedAlipayFee, 2));
				$("#storableAlipayFee").text(fmoney(storableAlipayFee, 2));
				
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
	/*var startTimes=$('#qBeginTime').val();
	var endTimes=$('#qEndTime').val();*/
	
	var jsonData = {
			
	};
	
	return JSON.stringify(jsonData);
}

//查询搜索事件
/*$("#searchBtn").bind("click",function(){
	
	init();
})*/


//链接详情页
$(".srtq").click(function(){
	var name = "收入提取";
	var url = "finance/profitExtract/profitExtractSummary.html";
	addTabs(url, name);	
});

$(".lwfcr").click(function(){
	var name = "劳务费存入";
	var url = "finance/profitExtract/laborProfitExtractList.html";
	addTabs(url, name);	
});

$(".yz").click(function(){
	var name = "预支";
	var url = "finance/mainMenu/expenditure.html";
	addTabs(url, name);	
});

$(".zfbsxfcr").click(function(){
	var name = "支付宝手续费存入";
	var url = "finance/profitExtract/apipayPoundageStoreSummary.html";
	addTabs(url, name);	
});
