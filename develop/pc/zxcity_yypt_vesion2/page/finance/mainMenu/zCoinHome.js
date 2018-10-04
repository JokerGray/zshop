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
	var cmd = "z/selZbStatisticsInfo";
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
	/*if(valiDate()){
		init();
	}*/
	init();
})


function valiDate(){
	var begin,end,result=true,msg;
	begin = $('#startDate').val();
	end = $('#endDate').val();
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
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "安卓平台智币购买明细";
	var source = 1;
	var url = "page/finance/z/zPurchaseDetail.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
	parent.addTabs(url, name);	
});

$(".ios").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "IOS平台智币购买明细";
	var source = 0;
	var url = "page/finance/z/zPurchaseDetail.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
	parent.addTabs(url, name);	
});


$(".total").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "智币购买明细";
	var source = -1;
	var url = "page/finance/z/zPurchaseDetail.html?startTime="+startTime+"&endTime="+endTime+"&source="+source;
	parent.addTabs(url, name);	
});


$(".consume").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "智币消耗排行榜";
	var url = "page/finance/z/zConsumeRanking.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".rest").click(function(){
	var name = "智币账户明细";
	var endTime = $("#endDate").val();
	var url = "page/finance/z/zAccountDetail.html?endTime="+endTime;
	parent.addTabs(url, name);	
});

$(".exchangeable").click(function(){
	var name = "可折现智币明细";
	var url = "page/finance/z/exchangeableZDetail.html";
	parent.addTabs(url, name);	
});


$(".inexchangeable").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var state = "1";
	var showhide = "none";
	var name = "不可折现智币消耗明细";
	var url = "page/finance/z/consume.html?startTime="+startTime+"&endTime="+endTime+"&state="+state+"&showhide="+showhide;
	parent.addTabs(url, name);	
});
