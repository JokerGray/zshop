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
	
	//初始化日期控件
	//获取当前月起止日期
	var date=new Date();
	var monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	//格式化日期
	var startTime = formatDate(monthFirstDay.getTime()/1000);
	var endTime = formatDate(date.getTime()/1000);
	//初始化日期控件
	$('#startDate').val(startTime);
	$('#endDate').val(endTime);
	
	laborTaxListStatistics(startTime, endTime);
})

//劳务税统计
function laborTaxListStatistics(startTimeVal, endTimeVal){
		var queryInfo ={
				businessType:"3",
				startTime: startTimeVal,
				endTime: endTimeVal
		}
		var cmd = 'scLaborTaxList/laborTaxListStatistics';
		var data = JSON.stringify(queryInfo);
		$.ajax({
			type : "POST",
			url : "/zxcity_restful/ws/rest",
			dataType : "json",
			//async : false,
			data : {"cmd" : cmd,"data" : data,"version" : "1"},
			beforeSend : function(request) {
				request.setRequestHeader("apikey", apikey ? apikey : "test");
			},
			success : function(res) {
					if(res.code==1&&res.data.length>0){
							var laborCostsTotal = 0.00;
							$.each(res.data,function(i,item){
								if(item.businessType==1){
								  laborCostsTotal +=  item.laborCostsCount;
									$("#liveNumber").text(item.idCardCount);
									$("#liveLaborCosts").text(fmoney(item.laborCostsCount, 2));
									$("#liveLaborTax").text(fmoney(item.laborTaxCount, 2));
								}else if(item.businessType==2){
									laborCostsTotal +=  item.laborCostsCount;
									$("#merchantNumber").text(item.idCardCount);
									$("#merchantLaborCosts").text(fmoney(item.laborCostsCount, 2));
									$("#merchantLaborTax").text(fmoney(item.laborTaxCount, 2));
								}else if (item.businessType==3) {
									laborCostsTotal +=  item.laborCostsCount;
									$("#headlineNumber").text(item.idCardCount);
									$("#headlineLaborCosts").text(fmoney(item.laborCostsCount, 2));
									$("#headlineLaborTax").text(fmoney(item.laborTaxCount, 2));
								}
								$("#laborCostsTotal").text(fmoney(laborCostsTotal, 2));
							})
					}
			},
			error : function(res) {

			}
	});
}

//点击查询
$("#searchBtn").click(function(){
		var startTimes = $('#startDate').val();
		var endTimes = $('#endDate').val();
		laborTaxListStatistics(startTimes, endTimes);
});

//全部
$("#totalClick").click(function(){
	var name = "劳务明细";
	var url = "page/finance/laborTax/labor_tax_detail.html?startTime="+$('#startDate').val()+"&endTime="+$('#endDate').val()+"&queryStatus=0&orderByType=2";
	parent.addTabs(url, name);
});

//全部详情
$("#totalClickDetails").click(function(){
	var name = "劳务明细详情";
	var url = "page/finance/laborTax/labor_tax_detail.html?startTime="+$('#startDate').val()+"&endTime="+$('#endDate').val()+"&queryStatus=0&orderByType=1";
	parent.addTabs(url, name);
});

//直播
$("#liveClick").click(function(){
	var name = "直播劳务明细";
	var url = "page/finance/laborTax/labor_tax_detail.html?startTime="+$('#startDate').val()+"&endTime="+$('#endDate').val()+"&queryStatus=1&orderByType=2";
	parent.addTabs(url, name);
});

//商户升级
$("#merchantClick").click(function(){
	var name = "商户升级劳务明细";
	var url = "page/finance/laborTax/labor_tax_detail.html?startTime="+$('#startDate').val()+"&endTime="+$('#endDate').val()+"&queryStatus=2&orderByType=2";
	parent.addTabs(url, name);
});

//头条
$("#headlineClick").click(function(){
	var name = "头条推广劳务明细";
	var url = "page/finance/laborTax/labor_tax_detail.html?startTime="+$('#startDate').val()+"&endTime="+$('#endDate').val()+"&queryStatus=3&orderByType=2";
	parent.addTabs(url, name);
});
