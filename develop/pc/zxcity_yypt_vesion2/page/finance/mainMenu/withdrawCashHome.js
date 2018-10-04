var apikey = sessionStorage.getItem('apikey');
layui.use('laydate', function(){             
	var laydate = layui.laydate;
	
	//日期控件
	var startDate = laydate.render({
		elem: '#startDate',
		min:"1970-1-1",//设置min默认最小值  
		done: function(value,dates) {
			$('.startDate').eq(0).attr('data-date', value)
			if(JSON.stringify(dates) == "{}"){
				endDate.config.min ={ 
	                 year:1970,   
	                 month:1, //关键  
	                 date: 1,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}else{
				endDate.config.min ={ 
	                 year:dates.year,   
	                 month:dates.month-1, //关键  
	                 date: dates.date,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}
		}
	});

	var endDate = laydate.render({
		elem: '#endDate',
		max:"2099-12-31",//设置一个默认最大值 
		done: function(value,dates) {
			$('.endDate').eq(0).attr('data-date', value)
			if(JSON.stringify(dates) == "{}"){
				startDate.config.max ={ 
	                 year:2099,   
	                 month:12, //关键  
	                 date: 31,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}else{
				startDate.config.max={  
		        year:dates.year,   
	                month:dates.month-1,//关键   
	                date: dates.date,   
	                hours: 0,   
	                minutes: 0,   
	                seconds : 0  
		       }   
			}
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
	var url = "page/finance/trade/audit.html?startTime="+startTime+"&endTime="+endTime;
	parent.addTabs(url, name);	
});


$(".txbutongguo").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "提现审核不通过列表";
	var state = 2;
	var url = "page/finance/pool/cash.html?startTime="+startTime+"&endTime="+endTime+"&state="+state;
	parent.addTabs(url, name);	
});


$(".txfafang").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "提现支付完成列表";
	var state = 3;
	var url = "page/finance/pool/cash.html?startTime="+startTime+"&endTime="+endTime+"&state="+state;
	parent.addTabs(url, name);	
});

$(".txtuihui").click(function(){
	var startTime = $('#startDate').val();
	var endTime = $('#endDate').val();
	var name = "提现退回列表";
	var state = 4;
	var url = "page/finance/pool/cash.html?startTime="+startTime+"&endTime="+endTime+"&state="+state;
	parent.addTabs(url, name);	
});
