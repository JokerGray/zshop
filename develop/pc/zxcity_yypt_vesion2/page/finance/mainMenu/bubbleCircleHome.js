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
	
	statisticsBubbleCircle(startTime, endTime);
})

// 泡圈统计
function statisticsBubbleCircle(startTimeVal,endTimeVal){
		var queryInfo ={
				businessType: "3",
				startTime: startTimeVal,
				endTime: endTimeVal,
				groupbyType: 1
		}
		var cmd = 'mainMenu/statisticsBubbleCircle';
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
				if(res.code==1&&res.data){	
					$("#countId").text(res.data.countId);
					$("#sunMoney").text(fmoney(res.data.sunMoney==null?0:res.data.sunMoney, 2));
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
	statisticsBubbleCircle(startTimes,endTimes);
});

// 泡圈详情列表
$("#totalClick").click(function(){
	var name = "泡圈详情";          
	var url = "page/finance/trade/bubbleCircleList.html?startTime="+$('#startDate').val()+"&endTime="+$('#endDate').val();
	parent.addTabs(url, name);
});
