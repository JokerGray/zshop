var shopId = sessionStorage.getItem("shopId"),
	shopName = sessionStorage.getItem("shopName");
var employeeId = sessionStorage.getItem("backUserId");
$(function() {
	geteChatsHistogramData();
	//getShopHomePagePresale();
	getShopHomePageSheGo();
	getShopHomePageLargess();
	getShopHomeHotGoods();
	getShopHomeMaxAccountContribute();
	getShopHomeMaxEmployeeContribute();
});
$("#shopSaleLink, #shopCostLink").click(function(){
	window.parent.location.href = "../../statisticalReport/html/storePerformanceDetails.html?shopID="+shopId+"&shopName="+shopName;
});
/*
 * 销售消耗柱状图
 */
function geteChatsHistogramData() {
	var cmd = "shopStatistics/queryShopAchInfoSummeryDetials";
	var data = "{'shopId': " + shopId + ",'timeType': 2}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		echatsHistogram(resData.data)
	} else {
		layer.alert(resData.msg);
	}
}

function echatsHistogram(dataList) {
	var xData, yDataSales, yDataConsume;
	var xData = new Array();
	var yDataSales = new Array();
	var yDataConsume = new Array();
	for (var i = 0; i < dataList.length; i++) {
		xData.push(dataList[i].time);
		yDataSales.push(dataList[i].salePrice);
		yDataConsume.push(dataList[i].consumePrice)
	}
	// 销售业绩柱状图初始化
	var myChartSales = echarts
			.init(document.getElementById('salesPerformance'));
	// 参数设置
	option = {
		title : {
			show : false
		},
		textStyle : {
			fontSize : 24
		},
		tooltip : {
			trigger : 'axis',
			textStyle : {
				fontSize : 24
			}
		},
		grid: {
			left: '20%'
		},
		xAxis : [ {
			type : 'category',
			data : xData,
			axisLabel : {
				textStyle : {
					fontSize : 24
				}
			}
		} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				textStyle : {
					fontSize : 24
				}
			}
		} ],
		series : [ {
			name : '销售业绩',
			type : 'bar',
			barWidth : '30px',
			data : yDataSales
		} ]
	};
	myChartSales.setOption(option); // 参数设置方法

	// 消耗业绩柱状图初始化
	var myChartConsume = echarts.init(document
			.getElementById('consumePerformance'));
	// 参数设置
	option = {
		title : {
			text : ''
		},
		tooltip : {
			trigger : 'axis',
			textStyle : {
				fontSize : 24
			}
		},
		legend : {
			data : ''
		},
		toolbox : {
			show : true
		},
		calculable : true,
		grid: {
			left: '20%'
		},
		xAxis : [ {
			type : 'category',
			data : xData,
			axisLabel : {
				textStyle : {
					fontSize : 24
				}
			}
		} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				textStyle : {
					fontSize : 24
				}
			}
		} ],
		series : [ {
			name : '消耗业绩',
			type : 'bar',
			barWidth : '30px',
			data : yDataConsume
		} ]
	};
	myChartConsume.setOption(option); // 参数设置方法
}

/*
 * 定金预售
 */
function getShopHomePagePresale() {
	var cmd = "shop/shopHomePagePresale";
	var data = "{'shopId': " + shopId + "}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		fillShopHomePagePresale(resData.data)
	} else {
		layer.alert(resData.msg);
	}
}

function fillShopHomePagePresale(dataList) {
	var accData = dataList.accountList;
	var sHtml = '';
	$("#actualPay").text(dataList.actualPay);
	$("#balance").text(dataList.balance);
	if (accData.length > 0) {
		for (var i = 0; i < accData.length; i++) {
			sHtml += '<div class="col-sm-6" onclick="showDetailPie(\'客户预售分析\',1,'
					+ accData[i].accountId + ')">';
			sHtml += '<div class="content-4-title"><b>'
					+ accData[i].accountName + '</b></div>';
			sHtml += '<div class="content-4-text">' + accData[i].num + '</div>';
			sHtml += '</div>';
		}
	} else {
		sHtml += '<div class="nodata"><p>今日暂无预售</p></div>';
	}
	$("#accountList").html(sHtml);
}

/*
 * 今日她来、功劳
 */
function getShopHomePageSheGo() {
	var cmd = "shopStatistics/shopHomePageSheGo";
	var data = "{'shopId': " + shopId + ", 'employeeId': " + employeeId + "}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		var obj = resData.data;
		$("#sheGoNum").html(obj.num);
		$("#sheGoCredit").html(obj.credit);
	} else {
		layer.alert(resData.msg);
	}
}

/*
 * 门店赠送
 */
function getShopHomePageLargess() {
	var cmd = "shopStatistics/shopHomePageLargess";
	var data = "{'shopId': " + shopId + "}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		var obj = resData.data;
		$("#largessNum").html(obj.num);
	} else {
		layer.alert(resData.msg);
	}
}

/*
 * 产品销售排行
 */
function getShopHomeHotGoods() {
	var cmd = "shopStatistics/shopHomePageHotGoods";
	var data = "{'shopId': " + shopId + "}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		fillShopHomeHotGoods(resData.data)
	} else {
		layer.alert(resData.msg);
	}
}

function fillShopHomeHotGoods(dataList) {
	var goodsListData = dataList.goodsList;
	var sHtml = '';
	$("#consumePrice").html(dataList.consumePrice);
	if (goodsListData.length > 0) {
		for (var i = 0; i < goodsListData.length; i++) {
			sHtml += '<div class="item" onclick="showDetailListHotGoods(\'产品销售明细\','
					+ goodsListData[i].type
					+ ','
					+ goodsListData[i].goodsId
					+ ')">';
			sHtml += '<div class="content-4-title"><b title="'+goodsListData[i].name+'">' + goodsListData[i].name
					+ '</b></div>';
			sHtml += '<div class="content-4-text">¥' + goodsListData[i].price
					+ '</div>';
			sHtml += '</div>';
		}
	} else {
		sHtml += '<div class="nodata"><p>今日暂无产品出售</p></div>';
	}
	$("#goodsList").html(sHtml);
}

/*
 * 客户贡献
 */
function getShopHomeMaxAccountContribute() {
	var cmd = "shopStatistics/shopHomePageMaxAccountContribute";
	var data = "{'shopId': " + shopId + "}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		var obj = resData.data;
		var accountData = obj.accountList;
		var sHtml = '';
		if (accountData.length > 0) {
			for (var i = 0; i < accountData.length; i++) {
				sHtml += '<div class="col-sm-6" onclick="showDetailPie(\'客户贡献分析\',3,'
						+ accountData[i].accountId + ')">';
				sHtml += '<div class="content-4-title" data-acid='+accountData[i].accountId+' onclick="singleGotoDetail('+accountData[i].accountId+')"><b>'
						+ accountData[i].accountName + '</b></div>';
				sHtml += '<div class="content-4-text">¥' + accountData[i].price
						+ '</div>';
				sHtml += '</div>';
			}
		} else {
			sHtml += '<div class="nodata"><p>今日暂无客户贡献</p></div>';
		}
		$("#accountContributeList").html(sHtml);
	} else {
		layer.alert(resData.msg);
	}
}

/*
 * 员工贡献
 */
function getShopHomeMaxEmployeeContribute() {
	var cmd = "shopStatistics/shopHomePageMaxEmployeeContribute";
	var data = "{'shopId': " + shopId + "}";
	var resData = reqAjax(cmd, data);
	if (resData.code == 1) {
		var obj = resData.data;
		var employeeData = obj.employeeList;
		var sHtml = '';
		if (employeeData.length > 0) {
			for (var i = 0; i < employeeData.length; i++) {
				sHtml += '<div class="col-sm-6">';
				sHtml += '<div class="content-4-title" onclick="singleGotoDetail('+employeeData[i].salesmanId+')"><b>'
						+ employeeData[i].salesman + '</b></div>';
				sHtml += '<div class="content-4-text" onclick="showDetailPie(\'员工贡献分析\',4,'
					+ employeeData[i].salesmanId + ')">¥'
						+ employeeData[i].price + '</div>';
				sHtml += '</div>';
			}
		} else {
			sHtml += '<div class="nodata"><p>今日暂无员工贡献</p></div>';
		}
		$("#employeeContributeList").html(sHtml);

	} else {
		layer.alert(resData.msg);
	}
}

function showDetailPie(title, pagetype, accID, type) {
	var toUrl = '../../storeHomePage/html/storeHomeDetail.html?shopId='+shopId+'&module='+pagetype;
	if(accID != ""){
		toUrl += '&accountId='+accID;
	}
	if(type){
		toUrl += '&type='+type;
	}
	window.parent.location.href = toUrl

}

/*
* layer弹窗柱状图模板
* */
function showDetailHistogram(title, pagetype, accID){



}


function showDetailListSheGo(title,type) {

	if(title=='今日她来'){
		title='todayshecome'

	}else if(title=='您的功劳'){
		title='yourcontribution'

	}

	window.parent.location.href = 'storePageListSheGo.html?type=' + type+'&title='+title;
	//layer
	//		.open({
	//			type : 2,
	//			title : [ title,
	//					'background-color: #fe6869; color:#fff; text-align:center; padding:0;' ],
	//			shadeClose : false,
	//			content : [ 'storePageListSheGo.html?type=' + type, 'no' ],
	//			area : [ '80%', '62%' ],
	//		});
}

function showDetailListHotGoods(title, type, goodsId) {
	//layer
	//		.open({
	//			type : 2,
	//			title : [ title,
	//					'background-color: #fe6869; color:#fff; text-align:center; padding:0;' ],
	//			shadeClose : false,
	//			content : [
	//					'storePageListHotGoods.html?type=' + type + '&goodsId='
	//							+ goodsId, 'no' ],
	//			area : [ '80%', '62%' ],
	//		});
}
//点击客户名称跳转客户详情页
function singleGotoDetail(accoutId){
	//$(this).click(function(){
	//TODO	//window.parent.location.href='../../customerManagement/html/customerOverview.html?accountId='+accoutId+'';
	//})
}
