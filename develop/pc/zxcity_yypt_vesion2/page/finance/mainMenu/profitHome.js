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
	//初始化日期控件
	$('#startDate').val(startTime);
	$('#endDate').val(endTime);
	
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
			request.setRequestHeader("apikey", apikey ? apikey : 'test');
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
				
				$("#turnTable").text(fmoney(turnTable, 2));
				$("#zSell").text(fmoney(zSell, 2));
				$("#livePrestorage").text(fmoney(livePrestorage, 2));
				$("#professionalProduction").text(fmoney(professionalProduction, 2));
				$("#headlines").text(fmoney(headlines, 2));
				$("#merchantUpgrade").text(fmoney(merchantUpgrade, 2));
				$("#anchorCommission").text(fmoney(anchorCommission, 2));
				$("#profitExtract").text(fmoney(profitExtract, 2));
				$("#laborCostStorage").text(fmoney(laborCostStorage, 2));
				
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
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "转盘收入明细";
	var type = 1;
	var url = "page/finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	parent.addTabs(url, name);	
});

$(".zbgoumai").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "智币充值收入明细";
	var type = 2;
	var url = "page/finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	parent.addTabs(url, name);	
});

$(".zbyucun").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "直播预存收入明细";
	var type = 3;
	var url = "page/finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	parent.addTabs(url, name);	
});

$(".zyzz").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "专业制作收入明细";
	var type = 4;
	var url = "page/finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	parent.addTabs(url, name);	
});

$(".shsj").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "商户升级收入明细";
	var url = "page/finance/merchant/merchantUpgradeProfitDetail.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".tt").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "头条收入明细";
	var type = 12;
	var url = "page/finance/income/profitDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	parent.addTabs(url, name);	
});

$(".lwfcunru").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "劳务费存入明细";
	var url = "page/finance/profitExtract/laborCostStoreLog.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".shourutiqu").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "收入提取明细";
	var url = "page/finance/profitExtract/profitExtractLog.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".zbyjfafang").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var type = -13;
	var name = "主播佣金发放明细";
	var url = "page/finance/income/commissionPayoffDetail.html?startTime="+startTime+"&endTime="+endTime+"&type="+type;
	parent.addTabs(url, name);	
});