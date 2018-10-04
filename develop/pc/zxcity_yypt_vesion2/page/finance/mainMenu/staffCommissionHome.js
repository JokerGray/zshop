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
	
	init();

})

//请求统计信息
function init(){
	var cmd = "mainMenu/staffCommissionStatistics";
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
				//商户升级
				var merchantUpgradeCommissionAmount = res.data.merchantUpgradeCommissionAmount;
				var merchantUpgradeCommissionNumber = res.data.merchantUpgradeCommissionNumber;
	
				//提成总额
				var totalCommissionAmount = res.data.totalCommissionAmount;
				
				$("#totalAmount").text(fmoney(totalCommissionAmount, 2));
				$("#liveAmount").text(fmoney(0, 2));
				$("#liveNumber").text(0);
				$("#headlineAmount").text(fmoney(0, 2));
				$("#headlineNumber").text(0);
				$("#merchantAmount").text(fmoney(merchantUpgradeCommissionAmount, 2));
				$("#merchantNumber").text(merchantUpgradeCommissionNumber);
		
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
$("#total").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "员工提成明细";
	var commissionType = -1;
	var url = "page/finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	parent.addTabs(url, name);	
});

$("#live").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "直播员工提成明细";
	var commissionType = 1;
	var url = "page/finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	parent.addTabs(url, name);	
});

$("#headline").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "头条员工提成明细";
	var commissionType = 2;
	var url = "page/finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	parent.addTabs(url, name);	
});

$("#merchantUpgrade").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "商户升级员工提成明细";
	var commissionType = 3;
	var url = "page/finance/income/staffCommissionDetail.html?startTime="+startTime+"&endTime="+endTime+"&commissionType="+commissionType;
	parent.addTabs(url, name);	
});

