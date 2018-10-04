var startTime = "";
var endTime = "";
$(function() {
	var date=new Date();
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var date = date.getDate();
	//当前的  年 月 日
	$('#startTime').val(myyear+" - 0"+mymonth+" - 0"+ 1);
	//$("#startTime").datetimepicker("setStartDate",myyear+" - "+mymonth+" - 0"+ 1);
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
	laborTaxListStatistics(startTime,endTime);
});


//劳务税统计
function laborTaxListStatistics(startTimeVal,endTimeVal){
		var queryInfo ={
				businessType:"3",
				startTime:startTimeVal,
				endTime:endTimeVal
				//groupbyType:1
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
				request.setRequestHeader("apikey", "test");
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
$("#query-a").click(function(){
		var startTimes=$('#startTime').val();
		var endTimes=$('#endTime').val();
		laborTaxListStatistics(startTimes,endTimes);
});

//全部
$("#totalClick").click(function(){
	var name = "劳务明细";
	var url = "finance/laborTax/labor_tax_detail.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus=0&orderByType=2";
	addTabs(url, name);
});

//全部详情
$("#totalClickDetails").click(function(){
	var name = "劳务明细详情";
	var url = "finance/laborTax/labor_tax_detail.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus=0&orderByType=1";
	addTabs(url, name);
});

//直播
$("#liveClick").click(function(){
	var name = "直播劳务明细";
	var url = "finance/laborTax/labor_tax_detail.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus=1&orderByType=2";
	addTabs(url, name);
});

//商户升级
$("#merchantClick").click(function(){
	var name = "商户升级劳务明细";
	var url = "finance/laborTax/labor_tax_detail.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus=2&orderByType=2";
	addTabs(url, name);
});

//头条
$("#headlineClick").click(function(){
	var name = "头条推广劳务明细";
	var url = "finance/laborTax/labor_tax_detail.html?startTime="+startTime+"&endTime="+endTime+"&queryStatus=3&orderByType=2";
	addTabs(url, name);
});
