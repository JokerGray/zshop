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
	
    init(startTime, endTime);
    getOrderInfo();
});

function init(startTime,endTime) {
    var param ={
        startTime:startTime,
        endTime:endTime
    }
    var cmd = 'mainMenu/shopSummary';
    var data = JSON.stringify(param);
    $.ajax({
      type : "POST",
      url : "/zxcity_restful/ws/rest",
      dataType : "json",
      //async : false,
      data : {"cmd" : cmd,"data" : data,"version" : "1"},
      beforeSend : function(request) {
    	  request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      },
      success : function(res) {
        if(res.code==1){
            // 店铺总览
            //商户
        	$("#merchantNumber").text(res.data.merchantNumber);
        	$("#rechargeAmount").text(fmoney(res.data.rechargeAmount, 2));
        	//玩家挣钱——转文赚
        	$("#reprintNum").text(res.data.reprintNum);
        	$("#reprintAmount").text(fmoney(res.data.reprintAmount, 2));
        	//玩家挣钱——转盘
        	$("#couponNum").text(res.data.couponNum);
        	$("#entityNum").text(res.data.entityNum);
        	$("#turntableProfit").text(fmoney(res.data.turntableProfit, 2));
        	
        	//玩家挣钱——分享赚
        	$("#cost").text(fmoney(res.data.purchaseAmount, 2));
        	//红包
        	$("#packetNumber").text(res.data.packetNum);
        	$("#packetAmount").text(fmoney(res.data.packetAmount, 2));
        	//提现
        	$("#withdrawNumber").text(res.data.withdrawNumber);
        	$("#withdrawAmount").text(fmoney(res.data.withdrawAmount, 2));
        	//预约
        	$("#reserveNumber").text(res.data.bespokeNumber);
        	$("#reserveAmount").text(fmoney(res.data.bespokeAmount, 2));
        	//赞助
        	$("#sponsorNumber").text(res.data.sponsorNumber);
        	$("#sponsorAmount").text(fmoney(res.data.sponsorAmount, 2));
        	//专业制作
        	$("#customNumber").text(res.data.customNumber);
        	$("#customAmount").text(fmoney(res.data.customAmount, 2));
        	//直播预存
        	$("#liveCZNumber").text(res.data.liveCZNumber);
        	$("#liveCZAmount").text(fmoney(res.data.liveCZAmount, 2));
        }else{
        	layer.msg("系统繁忙！");
        }
      },
      error : function(res) {
    	  
      }
  });
}


//订单统计
function getOrderInfo(startTime, endTime){
    var param = {
        startTime:startTime,
        endTime:endTime
    }
    var cmd = 'mainMenu/orderStatistics';
    var data = JSON.stringify(param);
    $.ajax({
      type : "POST",
      url : "/zxcity_restful/ws/rest",
      dataType : "json",
      //async : false,
      data : {"cmd" : cmd,"data" : data,"version" : "1"},
      beforeSend : function(request) {
    	  request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      },
      success : function(res) {
        if(res.code==1){
            console.log("查询成功！");
            //待付款
            $("#obligationsNumber").text(res.data.obligationsNumber);
            $("#obligationsAmount").text(fmoney(res.data.obligationsAmount, 2));
            //待发货
            $("#pendingDeliveryNumber").text(res.data.pendingDeliveryNumber);
            $("#pendingDeliveryAmount").text(fmoney(res.data.pendingDeliveryAmount, 2));
            //待收货
            $("#pendingReceiveNumber").text(res.data.pendingReceiveNumber);
            $("#pendingReceiveAmount").text(fmoney(res.data.pendingReceiveAmount, 2));
            //待评价
            $("#pendingCommentNumber").text(res.data.pendingCommentNumber);
            $("#pendingCommentAmount").text(fmoney(res.data.pendingCommentAmount, 2));
            //已完成
            $("#finishedNum").text(res.data.finishedNum);
            $("#finishedAmount").text(fmoney(res.data.finishedAmount, 2));
            //合计
            $("#totalNum").text(res.data.totalNum);
            $("#totalAmount").text(fmoney(res.data.totalAmount, 2));
            
        }else{
        	layer.msg("系统繁忙！");
        }
      },
      error : function(res) {
    	  
      }
  });	
}

// 商户升级 申请统计中
/*function selectUpgradeApplication(startTimeVal,endTimeVal) {
	var queryInfo ={
			startTime:startTimeVal,
			endTime:endTimeVal
	}
	var cmd = 'merchantUpgrade/selectUpgradeApplication';
	var data = JSON.stringify(queryInfo);
	$.ajax({
		type: "POST", url: "/zxcity_restful/ws/rest", dataType: "json",
		//async : false,
		data: {
			"cmd": cmd,
			"data": data,
			"version": "1"
		},
		beforeSend: function(request) {
			request.setRequestHeader("apikey", "test");
		},
		success: function(res) {
			if(res.data.length>0&&res.code==1){
				$.each(res.data, function(i, item) {
          if (item.onOffLine == 1) {
						// 线上申请中
						$("#onlineUpgradeApplicationNumber").text(item.countId);
						$("#onlineUpgradeApplicationMoney").text(fmoney(item.sumUpgradeRealAmount));
          } else if (item.onOffLine == 2) {
						// 线下申请中
						$("#offlineUpgradeApplicationNumber").text(item.countId);
						$("#offlineUpgradeApplicationMoney").text(fmoney(item.sumUpgradeRealAmount));
          }
        })
			}
		},
		error: function(res) {}
	});
}*/



//点击查询
$("#query-a").click(function(){
		var startTimes = $('#startTime').val();
		var endTimes = $('#endTime').val();
		init(startTimes, endTimes);
		getOrderInfo();
});


//+++++++++++++++++++++++++++ 链接详情页    +++++++++++++++++++++++++++++++++++++
//订单详情
function orderDetailView(status){
	//状态   /0 待付款/1 待发货/2 待收货/3 待评价/4 售后
	var url = "finance/shop/orderDetail.html?status=" + status + "&bussinessType=1";
	addTabs(url, "订单明细");
}

//玩家挣钱——转文赚详情
function reprintDetailView(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var url = "finance/shop/reprintDetail.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, "转文赚明细");
}

//玩家挣钱——转盘详情
function turnTableDetailView(prizeType){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var url = "finance/shop/hitDetail.html?prizeType=" + prizeType + "&startTime="+startTime+"&endTime="+endTime;
	addTabs(url, "转盘中奖明细");
}

//玩家挣钱——分享赚详情
function shareOrderDetailView(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var url = "finance/shop/shareOrderDetail.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, "分享赚明细");
}

//直播预存详情
function liveCZDetailView(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var url = "finance/shop/liveCZDetail.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, "直播预存订单明细");
}

//提现详情
function withdrawDetailView(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var url = "finance/shop/withdrawDetail.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, "提现申请明细");
}

//红包详情
function redPacketDetailView(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var url = "finance/shop/redPacketDetail.html?startTime="+startTime+"&endTime="+endTime;
	addTabs(url, "红包明细");
}

//z专业制作、活动赞助、预约订单详情
function spOrderDetailView(bizType){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	//格式化日期
	startTime = startTime.replace(/\s/g, "");
	endTime = endTime.replace(/\s/g, "");
	
	var name = "";
	if(!bizType){
		return;
	}
	if(bizType == 5){
		name = "活动赞助明细";
	}else if(bizType == 7){
		name = "专业制作订单明细";
	}else if(bizType == 8){
		name = "预约订单明细";
	}
	var url = "finance/shop/orderDetail.html?bussinessType="+bizType+"&startTime="+startTime+"&endTime="+endTime;
	addTabs(url, name);
}



