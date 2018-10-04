// 获取url地址中id参数
var couponId = getQueryString('id');

// bootstrapTable 初始化
var TableInit = function (id, url, columns, extraParams) {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function () {
	  $('#'+id).bootstrapTable({
	    url: url,
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
		var couponId = getQueryString('id');
		var res = {
			cmd: 'earnmoney/getShopShareEarnDetail',
    		data: JSON.stringify({
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

$(function(){
	initTable();
});

// 初始化表格
function initTable(){
    var columns = [
        {field : 'comsumerPhone',title : '用户电话号码',width : 100,align : "center"},
        {field : 'createTime',title : '购买时间',width : 100,sortable:true,align : "center"}, 
        {field : 'consumeTime',title : '消费时间',width : 100,sortable:true,align : "center"},
        {field : 'orderStatus',title : '状态',width : 100,align : "center",formatter : function(value, row, index) {
                if (value == 0 || value == 1) {
                    return '未消费';
                } else if (value == 2) {
                    return "<span style='color:#28AC94;'>已消费</red>";
                } else if (value == 3) {
                    return '删除';
                }
            }
        }
    ]
    TableInit('couponTable', '/zxcity_restful/ws/rest', columns, {}).Init();
}

// 分享赚 详情页面 ajax接口
var def = reqAjax('earnmoney/getShopShareEarnDetail', {
	couponId : couponId,
	pagination: {
        page: 1,
        rows: 10
    }
});
def.then(function(data){
	$('.details_title').text(data.data.couponName);
	if(data.data.couponStatus ==1){
		$('.couponStatus').text('已上架');
	}else if(data.data.couponStatus ==2){
		$('.couponStatus').text('已下架');
	}else if(data.data.couponStatus ==3){
		$('.couponStatus').text('已删除');
	}else if(data.data.couponStatus ==4){
		$('.couponStatus').text('已过期');
	}
	$('.createTime').text(data.data.createTime);
	$('.couponOriginalPrice').text(parseFloat(data.data.couponOriginalPrice).toFixed(2)+'元/人');
	$('.couponPresentPrice').text(parseFloat(data.data.couponPresentPrice).toFixed(2)+'元/人');
	$('.couponCashback').text(parseFloat(data.data.couponCashback).toFixed(2)+'元/人');
});