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
	var resData = getDate("", "", "", 1, 10);
	fillList(resData);
	$('#page-selection').bootpag({
		total : Math.ceil(resData.total / 10),
		page : 1,
		maxVisible : 10
	}).on("page", function(event, num) {
		resData = getDate("", "", "", num, 10);
		fillList(resData);
	});

	$("#searchBtn").click(function() {
		var start = $("#startTime").val();
		var end = $("#endTime").val();
		var sName = $("#serviceName").val();
		var resData = getDate(start, end, sName, 1, 10);
		fillList(resData);
		$('#page-selection').bootpag({
			total : Math.ceil(resData.total / 10),
			page : 1,
			maxVisible : 10
		}).on("page", function(event, num) {
			resData = getDate(start, end, sName, num, 10);
			fillList(resData);
		});
	});

});

function getDate(start, end, sName, pageNo, pageSize) {
	var cmd = "shop/queryConsumeSummeryDetials";
	var data = "{'merchantId': " + merchantId + ",'startData':'" + start
			+ "','endData':'" + end + "','serviceName':'" + sName
			+ "','pageNo': " + pageNo + ",'pageSize': " + pageSize + "}";
	var resData = reqAjax(cmd, data);
	return resData;
}

function fillList(resData) {
	var sHtml = "";
	if (resData.code == 1) {
		if (resData.total > 0) {
			var obj = resData.data;
			for (var i = 0; i < obj.length; i++) {
				sHtml += '<tr>';
				sHtml += '<td>' + getStringFomat(obj[i].waiter) + '</td>';
				sHtml += '<td>' + obj[i].serviceName + '</td>';
				sHtml += '<td>' + obj[i].price + '</td>';
				sHtml += '<td data-acid='+obj[i].accountId+'>' + getStringFomat(obj[i].accountName) + '</td>';
				sHtml += '<td>' + obj[i].consumeTime + '</td>';
				sHtml += '</tr>';
			}
		} else {
			sHtml = '<tr><td colspan="10"><div class="nodata"><p>暂无数据</p></div></td></tr>'
		}

	} else {
		layer.alert(resData.msg);
	}
	$("#consumptionDetails").html(sHtml);
	handleCustomerName();
}

//点击客户姓名跳转详情页 项目编号：94 项目人：WK
function handleCustomerName(){
	var dataLi=$('#consumptionDetails').find('tr');
	for(var i=0;i<dataLi.length;i++){
		dataLi.eq(i).children('td').eq(3).click(function(){
			window.location.href='../../customerManagement/html/customerOverview.html?accountId='+$(this).data('acid')+'';
		})
	}
}

//返回
$(".maintitle .return-icon").click(function(){
	sessionStorage.setItem("prevPage", 10);
	$(this).attr("href", '../../common/html/main/main.html');
});
