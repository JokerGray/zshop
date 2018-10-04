var startTime = "";
var endTime = "";
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
	statisticsBubbleCircle(startTime,endTime);
});

// 泡圈统计
function statisticsBubbleCircle(startTimeVal,endTimeVal){
		var queryInfo ={
				businessType:"3",
				startTime:startTimeVal,
				endTime:endTimeVal,
				groupbyType:1
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
				request.setRequestHeader("apikey", "test");
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
$("#query-a").click(function(){
		var startTimes=$('#startTime').val();
		var endTimes=$('#endTime').val();
		statisticsBubbleCircle(startTimes,endTimes);
});

// 泡圈详情列表
$("#totalClick").click(function(){
	var name = "泡圈详情";
	var url = "finance/mainMenu/bubbleCircleList.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);
});
