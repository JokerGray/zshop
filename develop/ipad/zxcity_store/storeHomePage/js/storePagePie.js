var cmd = getUrlParams("cmd");
var pardata = getUrlParams("data");
var isday = getUrlParams("isday");
$(function() {
	getPieDate();
});

function getPieDate() {
	var resData = reqAjax(cmd, pardata);
	if (resData.code == 1) {
		var obj = resData.data;
		if (obj.length > 0)
			echatsPie(obj);
		else
			$("#echartPic").html("<div class='nodata'><p>暂无数据！</p></div>");

	} else {
		layer.alert(resData.msg);
	}
}

function echatsPie(data) {
	var arr = new Array();
	for (var i = 0; i < data.length; i++) {
		var map;
		if (isday == "0")
			map = {
				"value" : data[i].price,
				"name" : data[i].typeName
			};
		else
			map = {
				"value" : data[i].num,
				"name" : data[i].name
			};
		arr[i] = map;
	}
	// 饼状图初始化
	var myChartSales = echarts.init(document.getElementById('echartPic'));
	option = {
		title : {
			title : '预售总金额分析',
			x : 'center'
		},
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b} : {c} ({d}%)",
			textStyle : {
				fontSize : 28
			}
		},
		series : [ {
			name : '所占比例',
			type : 'pie',
			radius : '65%',
			center : [ '50%', '50%' ],
			data : arr,
			itemStyle : {
				normal : {
					label : {
						textStyle : {
							fontSize : 32
						}
					}
				}
			},
			labelLine : {
				normal : {
					show : true,
					length : 40,
					length2 : 60,
					lineStyle : {
						width : 2,
						type : 'solid'
					}
				}
			}
		} ]
	};
	myChartSales.setOption(option); // 参数设置方法
}