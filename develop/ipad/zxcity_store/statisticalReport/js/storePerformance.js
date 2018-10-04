var merchantId = sessionStorage.getItem("merchantId");
$(function() {
	 var now = new Date();
	    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
	  //设置时间默认时间为今天
	    $(".datetime").val(today);
	//日期选择器初始化
	$(".datetime").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose: true,//自动关闭
		minView: 2
	}).on('show', function(ev){
        var startTime = $(".date-wrap .start-time").val();
        var endTime = $(".date-wrap .end-time").val();
        $(".start-time").datetimepicker('setEndDate', endTime);
        $(".end-time").datetimepicker('setStartDate', startTime);

    }).on('changeDate', function(ev){
        var _time = formatAllDate(ev.date, 'yyyy-MM-dd');
        var evClassName = ev.target.className;
        //选择开始时间后，设置结束时间只能操作开始时间当天及以后的日期
        if(evClassName.search('start-time') > -1){
            $(".end-time").datetimepicker('setStartDate', _time);
        }//选择结束时间后，设置结束时间只能操作结束时间当天及以前的日期
        else if(evClassName.search('end-time') > -1){
            $(".start-time").datetimepicker('setEndDate', _time);
        }
    });
	var start = $("#startTime").val();
	var end = $("#endTime").val();
	var resData = getDate(start, end, 1, 10);
	fillList(resData);
	getShopSummery(start, end);
	$('#page-selection').bootpag({
		total : Math.ceil(resData.total / 10),
		page : 1,
		maxVisible : 10
	}).on("page", function(event, num) {
		resData = getDate(start, end, num, 10);
		fillList(resData);
	});

	$("#searchBtn").click(function() {
		var start = $("#startTime").val();
		var end = $("#endTime").val();
		var resData = getDate(start, end, 1, 10);
		fillList(resData);
		getShopSummery(start, end);
		$('#page-selection').bootpag({
			total : Math.ceil(resData.total / 10),
			page : 1,
			maxVisible : 10
		}).on("page", function(event, num) {
			resData = getDate(start, end, num, 10);
			fillList(resData);
		});
	});

	$("#storePerformance").on(
			"click",
			"tr",
			function() {
				if (typeof($(this).attr("data-shopid")) == "undefined") return false;
				window.location.href = "storePerformanceDetails.html?shopID="
						+ $(this).attr("data-shopid") + "&shopName="
						+ $(this).children(":first").text();
			});

	$(".consumetotal").click(function() {
		$(this).css({
			"background-color" : "rgb(250,190,100)",
			"box-shadow" : "1px 1px 2px rgba(0,0,0,0.3)",
			"-webkit-box-shadow" : "1px 1px 2px rgba(0,0,0,0.3)"
		});
		window.location.href = "storePerformanceTotalDetails.html";
	});

	$(".salestotal").click(function() {
		$(this).css({
			"background-color" : "rgb(200,130,220)",
			"box-shadow" : "1px 1px 2px rgba(0,0,0,0.3)",
			"-webkit-box-shadow" : "1px 1px 2px rgba(0,0,0,0.3)"
		});
		window.location.href = "storePerformanceTotalDetails.html";
	});
});

function getShopSummery(start, end) {
	var cmd = "shop/queryShopSummeryMerchantDetials";
	var data = "{'merchantId': " + merchantId + ",'startData':'" + start
			+ "','endData':'" + end + "'}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		var obj = resData.data;
		$(".consumetotal").find(".total").html(obj.consumePrice);
		$(".salestotal").find(".total").html(obj.salePrice);
	} else {
		layer.alert(resData.msg);
	}
}

function getDate(start, end, pageNo, pageSize) {
	var cmd = "shop/queryShopSummeryShopDetials";
	var data = "{'merchantId': " + merchantId + ",'startData':'" + start
			+ "','endData':'" + end + "','pageNo': " + pageNo + ",'pageSize': "
			+ pageSize + "}";
	var resData = reqAjax(cmd, data);
	return resData;
}

function fillList(resData) {
	var sHtml = "";
	if (resData.code == 1) {
		if (resData.total > 0) {
			var obj = resData.data;
			for (var i = 0; i < obj.length; i++) {
				sHtml += '<tr data-shopid=' + obj[i].shopId + '>';
				sHtml += '<td>' + obj[i].shopName + '</td>';
				sHtml += '<td>' + obj[i].consumePrice + '</td>';
				sHtml += '<td>' + obj[i].consumeNum + '</td>';
				sHtml += '<td>' + obj[i].salePrice + '</td>';
				sHtml += '<td>' + obj[i].saleNum + '</td>';
				sHtml += '</tr>';
			}
		} else {
			sHtml = '<tr><td colspan="10"><div class="nodata"><p>暂无数据</p></div></td></tr>'
		}

	} else {
		layer.alert(resData.msg);
	}
	$("#storePerformance").html(sHtml);
}

//返回
$(".maintitle .return-icon").click(function(){
	sessionStorage.setItem("prevPage", 10);
	$(this).attr("href", '../../common/html/main/main.html');
});
