var shopID = sessionStorage.getItem("shopId");
var type = getUrlParams("type");
var goodsId = getUrlParams("goodsId");
$(function() {
	var resData = getData(1, 10);
	fillList(resData);
	$('#page-selection').bootpag({
		total : Math.ceil(resData.total / 10),
		page : 1,
		maxVisible : 10
	}).on("page", function(event, num) {
		resData = getData(num, 10);
		fillList(resData);
	});
});

function getData(pageNo, pageSize) {
	var cmd = "shop/shopHomePageHotGoodsDetails";
	var data = "{'shopId': " + shopID + ",'type':'" + type + "','goodsId':'"
			+ goodsId + "','pageNo': " + pageNo + ",'pageSize': " + pageSize
			+ "}";
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
				sHtml += '<td>' + obj[i].accountName + '</td>';
				sHtml += '<td>' + obj[i].purchaseName + '</td>';
				sHtml += '<td>' + obj[i].price + '</td>';
				sHtml += '<td>' + obj[i].purchasNum + '</td>';
				sHtml += '<td>' + obj[i].consumeTime + '</td>';
				sHtml += '</tr>';
			}
		} else {
			sHtml = '<tr><td colspan="10" style="background-color:#FFF"><div class="nodata"><p>暂无数据</p></div></td></tr>'
		}

	} else {
		layer.alert(resData.msg);
	}
	$("#HotGoodsList").html(sHtml);
}
