// 获取分享券详情 参数
var couponId = getQueryString('id');
var comsumerPhone = '';
// 上下架
var def = reqAjax('earnmoney/getShopShareEarnDetail', {
	comsumerPhone : comsumerPhone,
	couponId : couponId,
	pagination: {
		page: 1,
		rows: 10 
	}
});
def.then(function(data){
	$('.couponName').text(data.data.couponName);
	if(data.data.couponStatus ==1){
		$('.shelve').text('已上架');
		$('#changShelve').text('点击下架');
	}else if(data.data.couponStatus ==2){
		$('.shelve').text('已下架');
		$('#changShelve').text('点击上架');
		$('#changShelve').addClass('off');
	}else if(data.data.couponStatus ==4){
		$('.shelve').text('已过期');
		$('#changShelve').css({'display':'none'});
	}
	$('.createTime').text(data.data.createTime);
	$('.couponOriginalPrice').text(parseFloat(data.data.couponOriginalPrice).toFixed(2)+'元/人');
	$('.couponPresentPrice').text(data.data.couponType == 2 ? '免费' : parseFloat(data.data.couponPresentPrice).toFixed(2)+'元/人');
	$('.couponCashback').text(parseFloat(data.data.couponCashback).toFixed(2)+'元/人');
	$('.couponNum').text(data.data.couponNum+'张');
	$('.expireTime').text(data.data.expireTime);
	if(data.data.couponType == 1){
		$('.couponNumber').css({'display':'none'});
	}
	
});

// 点击弹出弹出
$('#couponTable').on('click','tbody>tr',function(){
	var arrClick = [];
	if($(this).hasClass('no-records-found') == false){
		for(var i =0 ;i<$(this).children().length;i++){
			arrClick.push($($(this).children()[i]).text());
		}
		localStorage.coupon = JSON.stringify({
			comsumerPhone: arrClick[0],
			createTime: arrClick[2],
			consumeTime: arrClick[3],
			serialNumber: arrClick[1],
			orderStatus : arrClick[4],
			expireTime : $('.expireTime').text(),
		});

		var id = $(this).data().uniqueid;
		orderInfo(id);
	}
})

function orderInfo (id){
	layer.open({
	    type: 2,  
	    area: ['500px', '300px'],
	    title: '订单详情',
        maxmin: true,
	    content: '../../other_html/fxz_detail/message.html?id='+id,
	    btn: false
	});	
}

$(function(){
	var oTable = TableInit(comsumerPhone);
    oTable.Init();
}); 

var TableInit = function (comsumerPhone) {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
      $('#couponTable').bootstrapTable({
        url: '/zxcity_restful/ws/rest',
	    classes: 'table table-hover ',
	    method: 'POST',
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
        toolbar: '#toolbar',      //工具按钮用哪个容器
        striped: true,           //是否显示行间隔色
        cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,          //是否显示分页（*）
        sortable: false,           //是否启用排序
        sortName : "id",     //排序的字段
        sortOrder: "desc",          //排序方式
        contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
        queryParams: oTableInit.queryParams,//传递参数（*）
        sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,            //初始化加载第一页，默认第一页
        pageSize: 10,            //每页的记录行数（*）
        pageList: [10, 25, 50, 100],    //可供选择的每页的行数（*）
        strictSearch: true,
        singleSelect : true,
        clickToSelect: true,        //是否启用点击选中行
       // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",           //每一行的唯一标识，一般为主键列
        cardView: false,          //是否显示详细视图
        detailView: false,          //是否显示父子表
        columns: [
		// {
		// 	checkbox: true,
		// 	width: 50
		// },
		{
			field : 'comsumerPhone',
			title : '用户电话号码',
			width : 100,
			align : "center"
		},
		{
			field : 'serialNumber',
			title : '序列号',
			width : 100,
			sortable:true,
			align : "center"
		},
		{
			field : 'createTime',
			title : '购买时间',
			width : 100,
			sortable:true,
			align : "center"
		},
		{
			field : 'consumeTime',
			title : '消费时间',
			width : 100,
			sortable:true,
			align : "center"
		},
		{
			field : 'orderStatus',
			title : '状态',
			width : 100,
			align : "center",
			formatter : function(value, row, index) {
				if(row.couponInfo && row.couponInfo.couponStatus == 4) return '已过期';
				if (value == 0) {
					return '待支付';
				}else if(value == 1) {
					return '未消费';
				} else if (value == 2) {
					return "<span style='color:#28AC94;'>已消费</red>";
				}
			}
		}]
    });
 };
 //得到查询的参数
 oTableInit.queryParams = function (params) {
	var couponId = getQueryString('id');
	var res = {
		cmd: 'earnmoney/getShopShareEarnDetail',
    	data: JSON.stringify({
			comsumerPhone : comsumerPhone,
			couponId : couponId,
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
 


	//上下架
	function shelve(){
		// true，当前上架，false，当前下架
		var shelve = !$('#changShelve').hasClass('off');
		var index = layer.confirm('确定'+ (shelve? '下' : '上' ) +'架该商品？', function(){
			layer.close(index);	
			var def = reqAjax('earnmoney/shopCouponShelfManage', {
				couponStatus : shelve? 2 : 1,
				couponId : couponId
			});

			def.then(function(data){
				shelve != shelve;
				if(data.code == 1){
					var up = '上';
					var down = '下';
					layer.msg((shelve? down: up)+'架成功！', {icon: 1});
					$('#changShelve').toggleClass('off');
					$('.shelve').text('已'+(shelve? down: up)+ '架');
					$('#changShelve').text('点击' + (shelve? up: down)+ '架');
				}else{
					layer.msg(data.msg, {icon: 2});
				}
				dataInteract();
			}).fail(function(data){
				layer.alert('系统错误！数据加载失败！')
			});

		});
	}
	
	function dataInteract(){
		var event = new Event('dataInteract');
		event.prefix = 'fxzList';
		event.params = {
			id: couponId,
			couponStatus: !$('#shelve').hasClass('off') ? 2 : 1
		}
		parent.window.dispatchEvent(event);
	}
	  
	function refresh(){
		comsumerPhone = $('#userPhone').val();
		$('#couponTable').bootstrapTable('destroy'); 
		var oTable = TableInit(comsumerPhone);
    	oTable.Init();
	}

// 点击回车键 触发搜索功能
$(document).keyup(function(event){
  if(event.keyCode ==13){
  	refresh();
  }
});