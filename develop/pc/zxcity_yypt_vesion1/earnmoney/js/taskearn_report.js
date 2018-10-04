// 时间格式化
Date.prototype.Format = function(fmt){
  var o = {
    "y+" : this.getFullYear(),
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};


var userName,taskTitle,taskStatus;
var startTime = new Date(new Date().getTime()-7*24*3600*1000).Format("yyyy-MM-dd");
var endTime = new Date().Format("yyyy-MM-dd");
var firstCreateTime,firstFinishTime;
var createTimeArr = [];
var finishMoneyArr = [];
var ongoingConMoneyArr = [];
var ongoingTotalMoneyArr = [];
		
// 页面一开始执行
$(function() {
	// 时间配置
    $('#createTime').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        endDate: new Date()
    });
    $('#finishTime').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        endDate: new Date()
    });

    $('#createTime').attr({'placeholder' : '如：'+startTime});
    $('#finishTime').attr({'placeholder' : '如：'+endTime});

    var t = TableInit();
	t.Init();

	ajaxChart();
})

// 开始时间 值 变化 
function changeCreateTime(){
	createTime = $('#createTime').val();
	var year = createTime.split('-')[0];
	var month = createTime.split('-')[1];
	var day = createTime.split('-')[2];

	if(createTime != '' && firstCreateTime != createTime){
		// 结束时间初始化
		$('#finishTime').datepicker('remove');
		$('#finishTime').datepicker({
	        format: 'yyyy-mm-dd',
	        autoclose: true,
	        language: "zh-CN",
	        startDate:createTime,
	        endDate : month == new Date().getMonth()+1 ? new Date() : (month == 12 ? parseFloat(year)+1 + '-01-'+ day : (new Date(year +'-0'+(parseFloat(month)+1)+ '-' +day).getTime()>new Date().getTime() ? new Date() : (day> new Date(year, parseFloat(month)+1, 0).getDate()? year+'-'+(parseFloat(month)+1)+'-'+ new Date(year,parseFloat(month)+1,0).getDate():year +'-0'+(parseFloat(month)+1)+ '-' +day ) ))
	    });
	}
	firstCreateTime = createTime;
}

// 结束时间 值 变化
function changeFinishTime(){
	finishTime = $('#finishTime').val();
	var year = finishTime.split('-')[0];
	var month = finishTime.split('-')[1];
	var day = finishTime.split('-')[2];
	if(finishTime != '' && finishTime != firstFinishTime){
		// 开始时间初始化
		$('#createTime').datepicker('remove');
		$('#createTime').datepicker({
	        format: 'yyyy-mm-dd',
	        autoclose: true,
	        language: "zh-CN",
	        startDate : month == 1 ? parseFloat(year)-1 + '-12-' + day : ( day > new Date(year,parseFloat(month)-1,0).getDate()?year + '-' +parseFloat(month) + '-'+01:year + '-' +(parseFloat(month)-1) + '-'+day),
	        endDate: finishTime
	    });
	}
	firstFinishTime = finishTime;
}

function chartsFun(createTimeArr,finishMoneyArr,ongoingConMoneyArr,ongoingTotalMoneyArr){
	var myChart = echarts.init(document.getElementById('chart'));
	// 柱状图 宽度 设置
	var barWidth = "35%";
	if(createTimeArr.length == 1){
		barWidth = "5%";
	}else if(createTimeArr.length == 2){
		barWidth = "10%";
	} else if(createTimeArr.length ==3){
		barWidth = "15%";
	}else if(createTimeArr.length == 4){
		barWidth = "20%";
	}else if(createTimeArr.length == 5){
		barWidth = "25%";
	}else if(createTimeArr.length == 6){
		barWidth = "30%";
	}
	option = {
		tooltip : {
			trigger: 'axis',
			axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			data:['已发放金额','未发放金额','已完成总金额'],
			left: 0,
			top:-5
		},
		grid: {
			left:0,
	        top: 50,
	        right: 30,
	        bottom: 20,
			containLabel: true
		},
		xAxis : [{
			type : 'category',
			data : createTimeArr
		}],
		yAxis : [{
			type : 'value',
			scale: true,
			name: '金额'
		}],
		series : [{
			name:'已发放金额',
			type:'bar',
			stack: '发放情况',
			itemStyle: {
            	normal: {
            		color: '#366886'
            	}
            },
			data: ongoingConMoneyArr,
			barGap : '0.1%',
			barWidth: barWidth,
		},{
			name:'未发放金额',
			type:'bar',
			stack: '发放情况',
			itemStyle: {
            	normal: {
            		color: '#59aff9'
            	}
            },
			data:ongoingTotalMoneyArr,
			barGap : '0.1%',
			barWidth: barWidth,
		},{ 
			name:'已完成总金额',
			type:'bar',
			barWidth: barWidth,
			stack: '完成',
			itemStyle: {
            	normal: {
            		color: '#49d2cc'
            	}
            },
			data:finishMoneyArr,
			barWidth: barWidth,
		}]
	};
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
		
	
// bootstrap-table
var TableInit = function () {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function () {
	  $('#qbzTable').bootstrapTable({
	    url: '/zxcity_restful/ws/rest',
	    method: 'POST',
		ajaxOptions:{
            headers:{
                apikey: 'test'
        	}
        },
		responseHandler: function(res){
			res.rows = res.data.taskList;
			res.total = res.data.total;
            return res;
        },
	    striped: true,			//是否显示行间隔色
	    cache: false,			//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	    pagination: true,		//是否显示分页（*）
	    sortable: false,		//是否启用排序
		sortName : "orderId",	//排序的字段
	    sortOrder: "desc",		//排序方式
	    contentType: "application/x-www-form-urlencoded",	//解决POST，后台取不到参数
	    queryParams: oTableInit.queryParams,				//传递参数（*）
	    sidePagination: "server",//分页方式：client客户端分页，server服务端分页（*）
	    pageNumber:1,			//初始化加载第一页，默认第一页
	    pageSize: 10,			//每页的记录行数（*）
	    pageList: [10, 25, 50, 100],	//可供选择的每页的行数（*）
	    strictSearch: true,
	    clickToSelect: false,	//是否启用点击选中行
	  // height: 500,			//行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	    uniqueId: 'taskId',	//每一行的唯一标识，一般为主键列
	    cardView: false,		//是否显示详细视图
	    detailView: false,		//是否显示父子表
	    singleSelect : true,
	    columns: [
	    	{ field: 'tasktitle', title: '任务名称', width: 200, align: 'center'},
	        { field: 'userName', title: '发布人', width: 150, align: 'center'},
	        { field: 'createTime', title: '发布时间', width: 150, align: 'center' },
	        { field: 'taskPrice', title: '任务佣金', width: 100, align:'center', formatter: function(val, row, index){
	        	return val;
	        }},
	        { field: 'taskNeedPerson', title: '任务需求人数', width: 100, align: 'center' },
	        { field: 'unpay', title: '未发放', width: 100, align: 'center' },
	        { field: 'payed', title: '已发放', width: 100, align: 'center' },
	        { field: 'taskStatus', title: '状态', width: 100, align: 'center', formatter: function(val, row, index){
	        	return val == 1 ? ('进行中'+'<span class="table-ellipsis">...</span>'): '<span class="text-info">已完成</span>';
	        }}
	    ]
	  });
	};
	//得到查询的参数
	oTableInit.queryParams = function (params) {
		var res = {
            cmd: 'earnmoney/getTaskearnReportForOperate',
            data: JSON.stringify({
				taskTitle: taskTitle,
			    userName: userName,
			    startTime: startTime || $('#createTime').val(),
			    endTime: endTime || $('#finishTime').val(),
			    taskStatus: taskStatus,
                pagination: {
                    page: params.offset/params.limit + 1,
                    rows: params.limit
                }
            }),
            version: 2
        }
         return res;
	};
	return oTableInit;
};

// 点击事件实现 筛选 功能
function clickFuc(){
	userName = $('#userName').val();
	taskTitle = $('#taskName').val();
	startTime = $('#createTime').val();
	endTime = $('#finishTime').val();
	if($('#status').val() == '全部'){
		taskStatus = '';
	}else{
		taskStatus = $('#status').val();
	}
	// 开始/结束时间 为必填项
	if(startTime == ''){
		layer.msg('请输入开始时间',{'icon':2});
		return;
	}else if(endTime == ''){
		layer.msg('请输入结束时间',{'icon':2});
		return;
	}

	// bootstrap-table表格摧毁与新建
	$('#qbzTable').bootstrapTable('destroy'); 
	var t = TableInit();
	t.Init();
	// 图表 方法 请求
	ajaxChart();
}

		
// 点击事件
$('#btn').on('click',function(){
	clickFuc();
});

// 按回车键 实现搜素功能
$(document).keyup(function(event){
  if(event.keyCode == 13){
  	clickFuc();
  }
});

// 通用ajax调用
function reqAjax(cmd, data){
	var loadIndex=layer.load();
	setTimeout(function(){
		layer.close(loadIndex);
	},5000);
    var deferred = $.Deferred();
    $.ajax({
        type:"post",
        dataType: 'json',
        url:"/zxcity_restful/ws/rest",
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(data),
            version: 2 // 版本号根据情况默认
        },
        success: function(data){
			layer.close(loadIndex);
            deferred.resolve(data);
        },
        error: function(){
            // 这里的 error 一般都是网络问题，500了也检查不出来
            layer.close(loadIndex);
            layer.msg('连接出错，请检查网络或稍后再试！',{"icon":2});
            deferred.reject()
        }
    });
    return deferred;
}

// 图表部分接口封装
function ajaxChart(){
	var def = reqAjax('earnmoney/getTaskearnReportForOperate',{
		"taskTitle": taskTitle,
	    "userName": userName,
	    "startTime": startTime,
	    "endTime": endTime,
	    "taskStatus": taskStatus,
	    "pagination": {
	        "page": 1,
	        "rows": 10
	    }
	});
	def.then(function(data){
		if(data.code == 1){
			var data = data.data;
			for(var i = 0;i<data.reportMap.length;i++){
				createTimeArr.push(data.reportMap[i].createTime);
				finishMoneyArr.push(data.reportMap[i].finishMoney);
				ongoingConMoneyArr.push(data.reportMap[i].ongoingConMoney);
				ongoingTotalMoneyArr.push(data.reportMap[i].ongoingTotalMoney);
			}
			// 如果没有数据则默认显示时间
			if(createTimeArr.length == 0){
				createTimeArr = ["00-00"];
				finishMoneyArr = ["0"];
				ongoingConMoneyArr = ["0"];
				ongoingTotalMoneyArr = ["0"];
			}
	
			chartsFun(createTimeArr,finishMoneyArr,ongoingConMoneyArr,ongoingTotalMoneyArr);
			// 初始化图表数据
			createTimeArr = [];
			finishMoneyArr = [];
			ongoingConMoneyArr = [];
			ongoingTotalMoneyArr = [];
			startTime = '';
			endTime = '';

			if(data.totalMap != null){
				$('.finishMoneyTotal').text(data.totalMap.finishMoneyTotal);
				$('.ongoingConMoneyTotal').text(data.totalMap.ongoingConMoneyTotal);
				$('.ongoingTotalMoneyTotal').text(data.totalMap.ongoingTotalMoneyTotal);
			}else{
				$('.finishMoneyTotal').text(0);
				$('.ongoingConMoneyTotal').text(0);
				$('.ongoingTotalMoneyTotal').text(0);
			}
		}else{
			layer.msg(data.msg,{"icon":2});
		}
		
	});
}


// 点击弹出弹框
$('#qbzTable').on('click','tbody >tr',function(){
	if(!$(this).hasClass('no-records-found')){
		var taskId = $(this).data().uniqueid;
		layer.open({
		    type: 2,  
	    	content: 'qbz_detail.html?taskId='+taskId,
		    title: '抢标赚详情',
		    area: ['800px', '600px'],
		    btn: [],
	        maxmin: true,
			scrollbar: false,
	        cancel: function(){
	        	// $('#qbzTable').bootstrapTable('refresh');
	        }
	    });
	}
})