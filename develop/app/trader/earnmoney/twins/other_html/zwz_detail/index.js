// 获取url中id的参数
var reprintId = getQueryString('id');

// 转文赚 ajax接口
function getAjax(){
	var loadIndex = layer.load();
	var def = reqAjax('earnmoney/getShopReprintEarnDetail', {
		reprintId: reprintId,
	});
	def.then(function(data){
		$('.title').text(data.data.taskTitle);
		$('.total_money').text(data.data.taskTotalMoney+'元');
		$('.paid').text(data.data.taskConfirmedMoney+'元');
		$('.click').text(data.data.taskPrice+'元/次');
		$('.limit-read').text(data.data.taskTotalReadnum+'次');
		$('.read-count').text(data.data.taskConfirmedReadnum+'次');
		$('.text-info').attr('href',data.data.taskUrl);
		
		var ChartData = data.data.readInfo;
		if(ChartData.length===0){
			setChartData(['00-00'],[0]);
		}else{
			var arrX = [];
			var arrY = [];
			var barWidth ="50%";
			for(var i=0;i<ChartData.length;i++){
				arrX.push(ChartData[i].finishTime);
				arrY.push(ChartData[i].readNum);
			}
			if(ChartData.length===1){
				barWidth ="10%";
			}else if(ChartData.length===2){
				barWidth = "20%";
			} else if(ChartData.length===3){
				barWidth = "30%";
			}else if(ChartData.length===4){
				barWidth = "40%";
			}
			setChartData(arrX, arrY,barWidth);
		}
		layer.close(loadIndex);	
	});

}

$(function(){
	 getAjax();
})

function setChartData(arrX, arrY,barWidth){
	var chartContent = echarts.init(document.getElementById('chartContent'));
	var option = {
		title: {
	        text: '玩家阅读量柱状图',
	        textStyle: {
	        	fontSize: 18
	        }
	    },
		color: ['#23c6c8'],
		tooltip : {
			trigger: 'axis',
			axisPointer : {      // 坐标轴指示器，坐标轴触发有效
				type : 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: 30,
			top:40,
			right: 30,
			bottom: 20,
			containLabel: true
		},
		xAxis : [
			{
				type : 'category',
				data : arrX,
				axisTick: {
					alignWithLabel: true
				}
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'阅读量',
				type:'bar',
				barWidth: barWidth,
				data:arrY
			}
		]
	};
	chartContent.setOption(option);
}