// 获取抢标赚id参数
var taskId = getQueryString('id');

var TableInit = function (id, url, columns, extraParams,taskId) {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function () {
	  $('#'+id).bootstrapTable({
	    url:url,
	    classes: 'table table-hover ',
	    method: 'POST',
		ajaxOptions:{
     		headers:{
         		apikey: 'test'
 			}
 		},
		responseHandler: function(res){
			res.rows = res.data.applyPersonList;
			if($("#bidStatus1").hasClass('btn-info')){
				res.rows = res.data.applyPersonList;
			}else if($("#bidStatus2").hasClass('btn-info')){
				res.rows = res.data.confirmedPersonList;
			}else if($("#bidStatus3").hasClass('btn-info')){
				res.rows = res.data.finishPersonList;
			}
			res.total = res.rows.length;
     		return res;
 		},
	    striped: true,
	    cache: false,
	    pagination: true,
	    sortable: false,
	    contentType: "application/x-www-form-urlencoded",
	    queryParams: oTableInit.queryParams,
	    sidePagination: "server",
	    pageNumber:1,
	    pageSize: 10,
	    uniqueId: 'id',
	    strictSearch: true,
	    clickToSelect: true,
	    cardView: false,
	    detailView: false,
	    singleSelect : true,
	    columns: columns
	  });
	};
	oTableInit.queryParams = function (params) {
		var taskId = getQueryString('id');
		var res = {
			cmd: 'earnmoney/getTaskManage',
     		data: JSON.stringify({
				taskId : taskId,
     		}),
     		version: 2
		}
		return res;
	};
	return oTableInit;
};

//错误处理，当前页面通用
var errorFunc = function(){
	layer.alert('系统错误！数据加载失败！')
}

// 初始化表格
function initTable() {
	var taskId = getQueryString('id');
	var columns = [
		{ field: 'userName', title: '用户名称', width: 150, align: 'center' },
		{ field: 'userPhone', title: '联系电话', width: 120, align: 'center' },
		{ field: 'remark', title: '留言', align: 'center' },
		{ field: 'userId', title: '操作', width: 150, align: 'center', formatter: function(val, row, index){
			var type = $('.my-btn-group .btn-info').val();
			if(type == 1) return '<button class="btn btn-xs btn-info" onclick="updateStatus('+val+', '+ 2 +')">选他</button> <button class="btn btn-xs btn-warning" onclick="updateStatus('+val+', '+ 3 +')">拒绝</button>';
			if(type == 2) return '<button class="btn btn-xs btn-info" onclick="updateStatus('+val+', '+ 4 +')">完成</button>';
			return '';
          }}
    ];
	// 添加一个额外参数，列表类型
	var extraParams = {
		type: function(){
			return $('.my-btn-group .btn-info').val();
		}
	};
	TableInit('table', '/zxcity_restful/ws/rest', columns, extraParams,taskId).Init();
}


// 设置饼状图
function setPieChart(){
	$('#chartContent').html('');
	var totalNumber = parseInt($('#totalNo').text());
	var activeNumber = parseInt($('#ingNum').text());
	var completeNumber = parseInt($('#endNum').text());
	
	if (isNaN(totalNumber)) totalNumber = 0;
	if (isNaN(activeNumber)) activeNumber = 0;
	if (isNaN(completeNumber)) completeNumber = 0;
	
	Morris.Donut({
		element: 'chartContent',
		data:[
		    {label: '进行中', value: activeNumber},
		    {label: '已完成', value: completeNumber},
		    {label: '还需要', value: totalNumber - activeNumber - completeNumber}
	    ],
	    reisze: true,
	    colors: ['#87d6c6', '#54cdb4', '#1ab394']
	});
}

// 接受方法
function updateStatus(id, type){
	var taskId = getQueryString('id');
	var text = '';
	if(type == 2) text = '确定选择该用户？';
	if(type == 3) text = '确定拒绝该用户？';
	if(type == 4) text = '确认该用户已完成任务？';
	var index = layer.confirm(text, function(){
		var loadIndex=layer.load();
		var def = reqAjax('earnmoney/uptTaskStatus', {
			userId : id,
			taskId : taskId,
			bidStatus : type
		});
		def.then(function(data){
			layer.close(loadIndex);
			if(data.code == 1){
				$('#table').bootstrapTable('refresh');
				updateNumAll(type);
			}
				layer.msg(data.msg,{icon: 1});
		}).fail(function(){
			layer.close(loadIndex);
			errorFunc
		});
	})
}


// 选择或拒绝后，整个页面的数据变动
function updateNumAll(type){
	if(type == 2){
		$('#waitNum').text(parseInt($('#waitNum').text()) - 1);
		$('#ingNum').text(parseInt($('#ingNum').text()) + 1);
	}
	if(type == 3){
		$('#waitNum').text(parseInt($('#waitNum').text()) - 1);
	}
	if(type == 4){
		$('#ingNum').text(parseInt($('#ingNum').text()) - 1);
		$('#endNum').text(parseInt($('#endNum').text()) + 1);
	}
	setPieChart();
}


// 抢标赚 任务管理 ajax请求
var def = reqAjax('earnmoney/getTaskManage', {
 	taskId : taskId
});
def.then(function(data){
	$('.taskTitle').text(data.data.taskTitle);
	$('.status').text(data.data.taskStatus ==1?'进行中...':'已完成');
	$('.price').text(parseFloat(data.data.taskPrice).toFixed(2)+'/人');
	$('.createTime').text(data.data.createTime);
	$('#totalNo').text(data.data.taskNeedPerson);
	$('#waitNum').text(data.data.applyPersonNum);
	$('#ingNum').text(data.data.confirmedPersonNum);
	$('#endNum').text(data.data.completePersonNum);

	$(function(){
		$('#chartContent').height($('#formContent').height());
		initTable();
		// 按钮点击时，刷新列表
		$('.my-btn-group .btn').click(function(){
			if($(this).hasClass('btn-info')) return;
			$(this).addClass('btn-info').siblings().removeClass('btn-info');
			$('#table').bootstrapTable('refresh');
		});
		setPieChart();
	});

});