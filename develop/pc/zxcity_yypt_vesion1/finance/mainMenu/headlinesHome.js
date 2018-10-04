var startTime = "";
var endTime = "";
$(function() {
  var date = new Date();
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var date = date.getDate();
  //当前的  年 月 日
  $('#startTime').val(myyear + " - 0" + mymonth + " - 0" + 1);
  //当前年 月  月份的第一天
  if (date < 10) {
    date = '0' + date;
  }
  if(mymonth<10){
		mymonth = '0'+mymonth;
	}
  $('#endTime').val(myyear + " - " + mymonth + " - " + date);
  startTime = $('#startTime').val();
  endTime = $('#endTime').val();
  getStartTime();
  getEndTime();
  selectStatisticsInfo(startTime, endTime);
  selectIncomeAuditStatistics(startTime, endTime);
  laborTaxListStatistics(startTime, endTime);
});

//查询统计信息
function selectStatisticsInfo(startTimeVal, endTimeVal) {
  var amount = 0;
  var orderQuantityCount = 0;
  var underwayOrderQuantityCount = 0;
  var underwayTotalAmountSum = 0;
  var completedOrderQuantityCount = 0;
  var supplierIncomeSum = 0;
  var companyIncomeSum = 0;
  var refundAmountSum = 0;
  var completedTotalAmountSum = 0;
  var statisticsQuery = {
    startTime: startTimeVal,
    endTime: endTimeVal
  }
  var cmd = 'headlinesPopularize/statisticsInfo';
  var data = JSON.stringify(statisticsQuery);
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
      if (res.code == 1) {
        $.each(res.data, function(i, item) {
          if (item.advStatus == 1) {
            underwayOrderQuantityCount = item.orderQuantityCount;
            underwayTotalAmountSum += item.totalAmountSum;
            amount += item.totalAmountSum;
            orderQuantityCount += item.orderQuantityCount;
          } else if (item.advStatus == 2) {
            completedOrderQuantityCount = item.orderQuantityCount;
            supplierIncomeSum = item.supplierIncomeSum;
            companyIncomeSum = item.companyIncomeSum;
            refundAmountSum = item.refundAmountSum;
            completedTotalAmountSum = (item.supplierIncomeSum + item.companyIncomeSum + item.refundAmountSum);
            amount += item.totalAmountSum;
            orderQuantityCount += item.orderQuantityCount;
          }
        })
      } else {}
      //$("#orderQuantityCount").text(orderQuantityCount);
      $("#amount").text(fmoney(amount, 2));
      //$("#underwayOrderQuantityCount").text(underwayOrderQuantityCount);
      $("#underwayTotalAmountSum").text(fmoney(underwayTotalAmountSum, 2));
      //$("#completedOrderQuantityCount").text(completedOrderQuantityCount);
      $("#supplierIncomeSum").text(fmoney(supplierIncomeSum, 2));
      $("#companyIncomeSum").text(fmoney(companyIncomeSum, 2));
      $("#refundAmountSum").text(fmoney(refundAmountSum, 2));
      $("#completedTotalAmountSum").text(fmoney(completedTotalAmountSum, 2));

    },
    error: function(res) {}
  });
}

//查询头条收入审核
function selectIncomeAuditStatistics(startTimeVal, endTimeVal) {
  var queryInfo = {
    auditStatus: "1",
    businessType: "1",
    startTime: startTimeVal,
    endTime: endTimeVal
  }
  var cmd = 'scIncomeAudit/selectIncomeAuditStatistics';
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
    success: function(re) {
      if (re.code == 1) {
        $("#auditNumber").html(re.data.id);
      } else {
        $("#auditNumber").html(0);
      }
    },
    error: function(re) {
      $("#auditNumber").html(0);
    }
  });
}

//劳务税统计
function laborTaxListStatistics(startTimeVal, endTimeVal) {
  var queryInfo = {
    businessType: "3",
    startTime: startTimeVal,
    endTime: endTimeVal
  }
  var cmd = 'scLaborTaxList/laborTaxListStatistics';
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
    success: function(re) {
      if (re.code == 1 && re.data.length == 3) {
        if (re.data[2].laborTaxCount) {
        	$("#laborCostsCount").html(fmoney(re.data[2].laborTaxCount, 2));
        }else{
        	$("#laborCostsCount").html("0.00");
        }
      } else {
    	$("#laborCostsCount").html("0.00");
      }
    },
    error: function(re) {
    	$("#laborCostsCount").html("0.00");
    }
  });
}

//点击查询
$("#query-a").click(function() {
  var startTimes = $('#startTime').val();
  var endTimes = $('#endTime').val();
  // if (!startTimes || startTimes == "") {
  //   layer.msg('开始时间不能为空');
  //   return false;
  // }
  // if (!endTimes || endTimes == "") {
  //   layer.msg('结束时间不能为空');
  //   return false;
  // }
  selectStatisticsInfo(startTimes, endTimes);
  selectIncomeAuditStatistics(startTimes, endTimes);
  laborTaxListStatistics(startTimes, endTimes);
});

//根据月份查询 所有
$("#totalMoney").click(function() {
  var name = "头条订单";
  var url = "finance/headlinesPopularize/headines_details.html?startTime=" + startTime + "&endTime=" + endTime;
  addTabs(url, name);
});

//状态  1  进行中
$(".queryStatus1").click(function() {
  var name = "头条订单";
  var url = "finance/headlinesPopularize/headines_details.html?startTime=" + startTime + "&endTime=" + endTime + "&queryStatus=" + 1;
  addTabs(url, name);
});

//状态  2  作者收入
$(".queryStatus2").click(function() {
  var name = "头条订单";
  var url = "finance/headlinesPopularize/headines_details.html?startTime=" + startTime + "&endTime=" + endTime + "&queryStatus=" + 2;
  addTabs(url, name);
});

//退款	advStatus3
$(".queryStatus3").click(function() {
  var name = "头条订单";
  var url = "finance/headlinesPopularize/headines_details.html?startTime=" + startTime + "&endTime=" + endTime + "&queryStatus=" + 3;
  addTabs(url, name);
});

//已完成  advStatus4
$(".queryStatus4").click(function() {
  var name = "头条订单";
  var url = "finance/headlinesPopularize/headines_details.html?startTime=" + startTime + "&endTime=" + endTime + "&queryStatus=" + 4;
  addTabs(url, name);
});

//头条结算
$("#scIncomeAudit").click(function() {
  var name = "头条结算";
  var url = "finance/headlinesPopularize/headines_income_audit.html?startTime=" + startTime + "&endTime=" + endTime;
  addTabs(url, name);
});

//劳务税
$("#workTax").click(function() {
  var name = "劳务明细";
  var url = "finance/laborTax/labor_tax_detail.html?startTime=" + startTime + "&endTime=" + endTime + "&queryStatus=3";
  addTabs(url, name);
});
