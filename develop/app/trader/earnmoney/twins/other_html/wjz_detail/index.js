// 获取url地址中的id参数
var taskId = getQueryString('id');

var TableInit = function (id, columns, extraParams,cmd) {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function () {
	  $('#'+id).bootstrapTable({
	    url: '/zxcity_restful/ws/rest',
        ajaxOptions:{
            headers:{
                apikey: 'test'
        	}
        },
        responseHandler: function(res){
			res.rows = res.data.orderList;
			res.total=res.data.total;
            return res;
        },
	    classes: 'table table-hover ',
	    method: 'POST',
	    striped: true,
	    cache: false,
	    pagination: true,
	    sortable: false,
	    contentType: "application/x-www-form-urlencoded",
	    queryParams: oTableInit.queryParams,
	    sidePagination: "server",
	    pageNumber:1,
	    pageSize: 10,
	    strictSearch: true,
	    clickToSelect: true,
	    cardView: false,
	    detailView: false,
	    singleSelect : true,
	    columns: columns
	  });
	};
	oTableInit.queryParams = function (params) {
        var res = {
            cmd: cmd,
            data: JSON.stringify({
                id : taskId,
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

// 玩家赚 ajax 接口
var def = reqAjax('earnmoney/getShopPlayerEarnDetail ', {
	id: taskId,
	pagination: {
		page: 1,
		rows: 10 
	}
});
def.then(function(data){
	$('.title').text(data.data.prizeTitle);
	if(data.data.prizeStatus==1){
		$('.shelve').text('上架');
	}else if(data.data.prizeStatus==2){
		$('.shelve').text('下架');
		$('.shelveBtn').text('点击上架').addClass('off');
	}else if(data.data.prizeStatus==3){
		$('.shelve').text('过期');
		$('.shelveBtn').css({'display':'none'});
	}
	
	$('.zj_count').text(data.data.prizeCount+'人');
    $('.price').text(parseFloat(data.data.prizePrice).toFixed(2)+'元');
    $('.expireTime').text(data.data.expireTime);
    $('.createTime').text(data.data.createTime);
    $('#remarkContent').text(data.data.prizeExplain);
})

$(function(){
	// 说明字段的样式处理
	$('#remarkContent').css('padding-left', $('#remarkContent').siblings('label').width() + 2);
	initTable();
	
	// 已过期样式处理
	var prizeStatus = $('#prizeStatus').val();
	if(prizeStatus == 3) {
		$('#shelve').text('已过期').removeClass().addClass('shelve out');
		$('#shelve').siblings('button').remove();
	}
});

// 初始化表格
function initTable(){
    var cmd = 'earnmoney/getShopPlayerEarnDetail ';
	var columns = [
		{ field: 'phone', title: '用户电话号码', width: 120, align: 'center' },
		{ field: 'createTime', title: '中奖时间', width: 160, align: 'center' },
		{ field: 'finishTime', title: '使用时间', width: 160, align: 'center', formatter: function(val, row, index){
			return val ? val : '-';
		}},
		{ field: 'cardNumber', title: '票券号', align: 'center'},
		{ field: 'orderStatus', title: '状态', width: 80, align: 'center', formatter: function(val, row, index){
			return val == 1 ? '未消费' : val == 2 ? '已消费' : '已过期';
		}}
       ];
	TableInit('table', columns, {},cmd).Init();
}

// 上下架
function shelve(){
	// true，当前上架，false，当前下架
	var shelve = !$('.shelveBtn').hasClass('off');
	var index = layer.confirm('确定'+ (shelve? '下' : '上' ) +'架该商品？', function(){
		layer.close(index);	
		var def = reqAjax('earnmoney/shopPrizeShelfManage', {
			prizeStatus : shelve? 2 : 1,
			id : taskId
		});
		def.then(function(data){
			if(data.code == 1){
				var up = '上';
				var down = '下';
				layer.msg((shelve? down: up)+'架成功！',{icon:1});
				$('.shelve').text((shelve? down: up)+ '架');
				$('.shelveBtn').text('点击'+((shelve? up: down))+'架').toggleClass('off');
				dataInteract();
			}else{
				layer.msg(data.msg);
			}
		}).fail(function(){
			layer.alert('系统错误！数据加载失败！');
		});
	});
}

function dataInteract(){
	var event = new Event('dataInteract');
	event.prefix = 'wjzList';
	event.params = {
		id:taskId,
		prizeStatus: !$('.shelveBtn').hasClass('off') ? 1 : 2
	}
	parent.window.dispatchEvent(event);
}


