// 获取url地址中userId参数
var userId = getQueryString('userId');

// 列表初始化
var TableInit = function (id, pg,columns,param,cmd,taskTitle,prizeTitle,couponName,shopId,startDate,endDate,taskStatus,prizeStatus,couponStatus) {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function () {
	  $('#'+id).bootstrapTable({
	    url: '/zxcity_restful/ws/rest',
	    method: 'POST',
		ajaxOptions:{
            headers:{
                apikey: 'test'
        	}
        },
		responseHandler: function(res){

			if($(".nav-tabs>li:first-of-type").hasClass('active')){
				res.rows = res.data;
			}else if($(".nav-tabs>li:nth-of-type(2)").hasClass('active')){
				res.rows = res.data.reprintList;
			}else if($(".nav-tabs>li:nth-of-type(3)").hasClass('active')){
				res.rows = res.data;
			}else if($(".nav-tabs>li:nth-of-type(4)").hasClass('active')){
				res.rows = res.data.shareList;
			}
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
//	    height: 500,			//行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	    uniqueId: pg,	//每一行的唯一标识，一般为主键列
	    cardView: false,		//是否显示详细视图
	    detailView: false,		//是否显示父子表
	    singleSelect : true,
	    columns: columns
	  });
	};
	//得到查询的参数
	oTableInit.queryParams = function (params) {
		var userId = getQueryString('userId');
		var res = {
            cmd: cmd,
            data: JSON.stringify({
				userId : userId,
                pagination: {
                    page: params.offset/params.limit + 1,
                    rows: params.limit
                },
                taskTitle : taskTitle,
                prizeTitle : prizeTitle,
                couponName : couponName,
				shopId : shopId,
				startDate : startDate,
				endDate : endDate,
				taskStatus : taskStatus,
				prizeStatus : prizeStatus,
				couponStatus : couponStatus
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
//数字转为三位数逗号分隔
function formatNo(num){
	if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
        return num;
    }
    var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
    var re = new RegExp("(\\d)(\\d{3})(,|$)");
    while (re.test(b))   b = b.replace(re, "$1,$2$3");
    return a + "" + b + "" + c;
}

// 初始化
$(function(){
	// 点击触发对应初始化事件
	var arrInit = [];
	$('#tab').on('shown.bs.tab', function (e) {
		if(arrInit.indexOf(e.target.id) < 0){
			arrInit.push(e.target.id);
			tableInit(e.target.id)
			window[e.target.id + 'Init']();
		}
	});
	// 首个点击
	$('#tab a').first().tab('show');
	// 年月日等图表条件点击，获取对应数据
	$('.date-group .btn').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		getChartData();
	});



//  点击 弹出弹窗
	$('.table').on('click','tbody>tr',function(){
		if($(this).hasClass('no-records-found') == false){
			var id = $(this).attr('data-uniqueid');
			openDialog(id);
		}
	});
})

// 表格的基本初始化
function tableInit(id) {
	var tableId = id + 'Table';
	var  pg,columns, param  = {};
	switch (id){
		case 'qbz':
			cmd = 'earnmoney/getShopTaskEarnList';
			pg = 'id';
			columns = [
	           { field: 'taskTitle', title: '任务名称', width: 200, align: 'center'},
	           { field: 'shopInfo.shopName', title: '店铺名称', width: 150, align: 'center'},
	           { field: 'createTime', title: '发布时间', width: 150, align: 'center' },
	           { field: 'waitNum', title: '审核中', width: 100, align:'center', formatter: function(val, row, index){
	        	   return val;
	           }},
	           { field: 'ingNum', title: '进行中', width: 100, align: 'center' },
	           { field: 'endNum', title: '已完成', width: 100, align: 'center' },
	           { field: 'taskStatus', title: '状态', width: 100, align: 'center', formatter: function(val, row, index){
	        	   return val == 1 ? ('进行中'+'<span class="table-ellipsis">...</span>'): '<span class="text-info">已完成</span>';
	           }}
            ];

            $('#qbz_search').on('click',function(){
		    	var taskTitle = $('#qbzContent .filter_title input').val();
		    	var prizeTitle = '';
		    	var couponName = '';
				var shopId = $('#qbzContent .selec >option:selected').val();
				var startDate = $('#qbzContent #startTime').val();
				var endDate = $('#qbzContent #endTime').val();
				var taskStatus = $('#qbzContent .status option:selected').val();
				var prizeStatus = '';
				var couponStatus = '';

				var startDateArr = startDate.split('-');
				var endDateArr = endDate.split('-');
				if(endDateArr.length > 1 ){
					if(startDateArr[0] > endDateArr[0] || startDateArr[0]==endDateArr[0] && startDateArr[1] > endDateArr[1] || startDateArr[0]==endDateArr[0] && startDateArr[1] == endDateArr[1] && startDateArr[2] > endDateArr[2]){
						layer.alert('请输入大于起始时间!');
						return;
					}
				}
				$('#qbzTable').bootstrapTable('destroy'); 
				var t = TableInit('qbzTable', pg, columns, param,'earnmoney/getShopTaskEarnList',taskTitle,prizeTitle,couponName,shopId,startDate,endDate,taskStatus,prizeStatus,couponStatus);
				t.Init();
		    });

			break;
		case 'zwz':
			cmd = 'earnmoney/getShopReprintEarnList';
			pg = 'reprintId';
			columns = [
	           { field: 'taskTitle', title: '转文赚标题',width:400, align: 'center' },
	           { field: 'userName', title: '店铺名称',width:200, align: 'center' },
	           { field: 'createTime', title: '发布时间', width: 200, align: 'center' },
	           { field: 'taskConfirmedReadnum', title: '阅读量', width: 100, align: 'center' },
	           { field: 'taskConfirmedMoney', title: '支出', width: 100, align: 'center' },
	           { field: 'taskStatus', title: '状态', width: 100, align: 'center', formatter: function(val, row, index){
	        	   return val == 1 ? ('进行中'+'<span class="table-ellipsis">...</span>'): '<span class="text-info">已完成</span>';
	           }}	           
            ];
         
            $('#zwz_search').on('click',function(){
		    	var taskTitle = $('#zwzContent .filter_title input').val();
		    	var prizeTitle = '';
		    	var couponName = '';
				var shopId = $('#zwzContent .selec >option:selected').val();
				var startDate = $('#zwzContent #zwz_startTime').val();
				var endDate = $('#zwzContent #zwz_endTime').val();
				var taskStatus = $('#zwzContent .status option:selected').val();
				var prizeStatus = '';
				var couponStatus = '';

				var startDateArr = startDate.split('-');
				var endDateArr = endDate.split('-');
				
				if(endDateArr.length > 1 ){
					if(startDateArr[0] > endDateArr[0] || startDateArr[0]==endDateArr[0] && startDateArr[1] > endDateArr[1] || startDateArr[0]==endDateArr[0] && startDateArr[1] == endDateArr[1] && startDateArr[2] > endDateArr[2]){
						layer.alert('请输入大于起始时间!');
						return;
					}
				}
				
				$('#zwzTable').bootstrapTable('destroy'); 
				var t = TableInit('zwzTable', pg, columns, param,'earnmoney/getShopReprintEarnList',taskTitle,prizeTitle,couponName,shopId,startDate,endDate,taskStatus,prizeStatus,couponStatus);
				t.Init();
		    });

			break;
		case 'wjz':
			cmd = 'earnmoney/getShopPlayerEarnList';
			pg = 'id';
			columns = [
	           { field: 'prizeTitle', title: '奖券名称',width:300, align: 'center' },
	           { field: 'shopName', title: '店铺名称',width:150, align: 'center' },
	           { field: 'createTime', title: '发布时间',width:150, align: 'center' },
	           { field: 'prizeCount', title: '抽中次数', width: 150, align: 'center' },
	           { field: 'useCount', title: '使用次数', width: 150, align: 'center' },
	           { field: 'prizeStatus', title: '状态', width: 100, align: 'center', formatter: function(val, row, index){
	           		if(val == 1){
	           			return '<span class="text-info">上架</span>'
	           		}else if(val == 2){
	           			return '<span class="text-info">下架</span>'
	           		}else if(val == 3){
	           			return '<span class="text-info">过期</span>'
	           		}
	           }}	           
            ];

            $('#wjz_search').on('click',function(){
            	var taskTitle = '';
		    	var prizeTitle = $('#wjzContent .filter_title input').val();
		    	var couponName = '';
				var shopId = $('#wjzContent .selec >option:selected').val();
				var startDate = $('#wjzContent #wjz_startTime').val();
				var endDate = $('#wjzContent #wjz_endTime').val();
				var taskStatus = '';
				var prizeStatus = $('#wjzContent .status option:selected').val();
				var couponStatus = '';

				var startDateArr = startDate.split('-');
				var endDateArr = endDate.split('-');
				
				if(endDateArr.length > 1 ){
					if(startDateArr[0] > endDateArr[0] || startDateArr[0]==endDateArr[0] && startDateArr[1] > endDateArr[1] || startDateArr[0]==endDateArr[0] && startDateArr[1] == endDateArr[1] && startDateArr[2] > endDateArr[2]){
						layer.alert('请输入大于起始时间!');
						return;
					}
				}
				$('#wjzTable').bootstrapTable('destroy'); 
				var t = TableInit('wjzTable', pg, columns, param,'earnmoney/getShopPlayerEarnList',taskTitle,prizeTitle,couponName,shopId,startDate,endDate,taskStatus,prizeStatus,couponStatus);
				t.Init();
		    });

			break;
		case 'fxz':
			cmd = 'earnmoney/getShopShareEarnList';
			pg = 'id';
			columns = [
	           { field: 'couponName', title: '分享赚名称', width: 300,align: 'center' },
	           { field: 'couponDemand', title: '分享赚描述', width: 400,align: 'center',formatter: function(val, row, index){
	           		if(val.length > 32){
	           			return val.substr(0,32)+'...';
	           		}else{
	           			return val;
	           		}
	           		
	           }},
	           { field: 'createTime', title: '发布时间', width: 300, align: 'center' },
	           { field: 'shareNum', title: '转发量', width: 150, align: 'center' },
	           { field: 'useNum', title: '拉客量', width: 150, align: 'center' },
	           { field: 'couponStatus', title: '状态', width: 150, align: 'center', formatter: function(val, row, index){
	        	   if (val == 1) {
						return "<span style='color:#28AC94;'>上架</span>";
					} else if (val == 2) {
						return '下架';
					} else if (val == 3) {
						return '删除';
					}else if (val == 4) {
						return '过期';
					}
	           }}	           
            ];

            $('#fxz_search').on('click',function(){
		    	var taskTitle = '';
		    	var prizeTitle = '';
		    	var couponName = $('#fxzContent .filter_title input').val();
				var shopId = $('#fxzContent .selec >option:selected').val();
				var startDate = $('#fxzContent #fxz_startTime').val();
				var endDate = $('#fxzContent #fxz_endTime').val();
				var taskStatus = '';
				var prizeStatus = '';
				var couponStatus = $('#fxzContent .status option:selected').val();

				var startDateArr = startDate.split('-');
				var endDateArr = endDate.split('-');
				
				if(endDateArr.length > 1 ){
					if(startDateArr[0] > endDateArr[0] || startDateArr[0]==endDateArr[0] && startDateArr[1] > endDateArr[1] || startDateArr[0]==endDateArr[0] && startDateArr[1] == endDateArr[1] && startDateArr[2] > endDateArr[2]){
						layer.alert('请输入大于起始时间!');
						return;
					}
				}
				$('#fxzTable').bootstrapTable('destroy'); 
				var t = TableInit('fxzTable', pg, columns, param,'earnmoney/getShopShareEarnList',taskTitle,prizeTitle,couponName,shopId,startDate,endDate,taskStatus,prizeStatus,couponStatus);
				t.Init();
		    });
			break;
		default:
			break;
	}
	var t = TableInit(tableId, pg, columns, param,cmd);
	t.Init();
}

// 其他初始化事件
function qbzInit(){
	
}
// 转文赚初始化
function zwzInit(){
	getChartData();
	geZwzCount();
}

function wjzInit(){
	
}

function fxzInit(){
	getChartData();
	getFxzCount();
}

// 点击显示弹窗，根据当前active样式确定id
function openDialog(id){
	var tabId = $('#tab>li.active a').attr('id');
	var rows = $('#'+ tabId +'Table').bootstrapTable("getSelections");
	var url = '';
	var title = '';
	if(tabId == 'qbz') {
		url = "other_html/qbz_son/qbz.html?id="+id;
		title = '抢标赚详情';
	};
	if(tabId == 'zwz') {
		url = "other_html/zwz_son/zwz.html?id="+id;
		title = '转文赚详情';
	}
	if(tabId == 'wjz'){
		url = "other_html/wjz_son/wjz.html?id="+id;
		title = '玩家转详情';
	} 
	if(tabId == 'fxz'){
		url = 'other_html/fxz_son/fxz.html?id='+id;
		title = '分享赚详情';
	}
 	layer.open({
	    type: 2,  
    	content: url,
	    title: title,
	    area: ['800px', '750px'],
	    btn: [],
        maxmin: true,
		scrollbar: false,
        cancel: function(){
        	$('#'+tabId+'Table').bootstrapTable('refresh');
        }
    });
}

// 获取图表数据
function getChartData(){
	var id = $('#tab>li.active a').attr('id');
	var type = $('.tab-pane.active .date-group .btn.active').val();
	var cmd = id == 'zwz' ? 'earnmoney/getShopReprintEarnReport' : 'earnmoney/getShopShareEarnReport';
	var loadIndex;
	var def = reqAjax(cmd, {
		userId : userId,
		selectType : type
	});	
	def.then(function(data){
		var data = data.data;
		setChartData(id, data);
	});
}

// 设置图表数据
function setChartData(id, data){
	var chartId = id+'Chart';
	// 初始化图表
	if(!window.hasOwnProperty(chartId)) {
		window[chartId] = echarts.init(document.getElementById(chartId));
		window.onresize = window[chartId].resize;
	}
	
	// 根据类型处理x、y轴数组的值 和字段代表的名称
	var titleArr = ['总阅读次数', '总支出'];
	if(id != 'zwz') titleArr = ['总支付量', '拉客量'];
	// 根据查询类型处理x轴时间类型
	var arrx = [];
	var date = new Date();
	var type = $('.tab-pane.active .date-group .btn.active').val();
	if(type == 1) {
		for(var i=0;i<24;i+=2) arrx.push((i<10 ? ('0'+ i) : i) + ':00');
	} else if(type == 2){
		for(var i=0;i<30;i++) {
			arrx.push(date.Format('MM-dd'));
			date.setDate(date.getDate() - 1);
		}
	} else{
		for(var i=1;i<13;i++) arrx.push(date.getFullYear() + '-' +(i<10 ? ('0'+ i) : i));
	}
	// Y轴根据id类型处理
	var arry1 = [];
	var arry2 = [];
	if(id == 'zwz') {
		arry1 = data['numArray'];
		arry2 = data['moneyArray'];
		$('.stat-list .charge').text(parseFloat(data.charge).toFixed(2));
		$('.stat-list .reprintNum').text(data.reprintNum);
		$('.stat-list .clickNum').text(data.clickNum);
		$('.progress-bar').css({'width':'100%'});
	} else {
		arry1 = data['moneyArray'];
		arry2 = data['numArray'];
		$('.stat-list .lakeNum').text(data.lakeNum);
		$('.stat-list .zhifuNum').text(parseFloat(data.zhifuNum).toFixed(2));
		$('.stat-list .shareNum').text(data.shareNum);
		$('.progress-bar').css({'width':'100%'});
	}
    // 指定图表的配置项和数据
    var option = {
        legend: {
            data: titleArr,
            left: 27,
            top: -5
        },
        tooltip: {
        	trigger: 'axis'
        },
        xAxis: {data: arrx},
        grid:{
            left: 30,
            top: 50,
            right: 30,
            bottom: 20
        },
        yAxis: [{
        	type: 'value',
        	scale: true,
        	name: titleArr[0]
        },{
        	type: 'value',
        	scale: true,
        	name: titleArr[1]
        }],
        series: [{
            name: titleArr[0],
            type: 'bar',
            itemStyle: {
            	normal: {
            		color: '#a3e1d4'
            	}
            },
            data: arry1
        },{
            name: titleArr[1],
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            lineStyle: {
            	normal: {
            		color: '#6e90a2',
            		opacity: 0.8
            	}
            },
            areaStyle: {
            	normal: {
            		color: '#6e90a2',
            		opacity: 0.2
            	}
            },
            data: arry2
        }]
    };
    window[chartId].setOption(option);
}

// 获取正在进行的转文赚任务数量
function geZwzCount(){
	var loadIndex = layer.load();
	var def = reqAjax('earnmoney/getShopReprintEarnList', {
		userId: userId,
		pagination: {
			page: 1,
			rows: 10 
		}
	});
	def.then(function(data){
		layer.close(loadIndex);
		$('#zwzContent .count').text(data.data.count);
	}).fail(function(){
		layer.close(loadIndex);
	});
}


//获取正在进行的分享赚任务数量
function getFxzCount(){
	var loadIndex = layer.load();
	var def = reqAjax('earnmoney/getShopShareEarnList', {
		userId: userId,
		pagination: {
			page: 1,
			rows: 10 
		}
	});
	def.then(function(data){
		layer.close(loadIndex);
		$('#fxzContent .count').text(data.data.count);
	}).fail(function(){
		layer.close(loadIndex);
	});
}

