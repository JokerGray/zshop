$(function(){
	var artInput = '0';
	//刷新页面隐藏单篇文章的表格
	$('.singleArtTable').removeClass('show').addClass('hide');

	//点击日期获取时间
    analysisDate();

	//文章分析tab栏-------获取全部文章
	//获取全部文章函数调用:
	var yesterday = formatterDate(new Date().setDate(new Date().getDate() - 1));
	$('#artInput').val('0');
	$('#TimeValue').val('0');
	$('#start').val(yesterday);
	$('#end').val(yesterday);

	//点击日期下拉框改变时间戳input：
	inpChangeDate(yesterday);

	// 获取全部文章函数调用:
	getAllArtData();

	//搜索按钮点击以后搜索文章：
	$('#search_icon').click(function(){
		if($('#artInput').val() === '0' && $('#start').val() && $('#end').val()){
			artInput = '0';
			$('.numMessBox').removeClass('hide').addClass('show');
			$('.allArtTable').removeClass('hide').addClass('show');
			$('.singleArtTable').removeClass('show').addClass('hide');
			// 获取全部文章函数调用:
			getAllArtData();

			//获取折线图数据：
			var today = new Date(Date.parse($('#end').val()));
			today = today.getTime();
			var before = new Date(Date.parse($('#start').val()));
			before = before.getTime(); 
			var diff = (today - before) / 86400000;

			if( diff > 1 && diff < 31){
				$('.chartConBox').removeClass('hide').addClass('show');
				start.getEchartsData({
					url: 'articleDetailsCollection',
					data: {
						'userId': start.userId,
						'startTime': isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
						'endTime': isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
						'pagination': {
							'page': 1,
							'rows': diff
						}
					}
				})
			} else {
				$('.chartConBox').removeClass('show').addClass('hide');
			}
		} else if($('#artInput').val() === '1' && $('#start').val() && $('#end').val()) {
			artInput = '1';
			$('.numMessBox').removeClass('show').addClass('hide');
			$('.chartConBox').removeClass('show').addClass('hide');
			$('.allArtTable').removeClass('show').addClass('hide');
			$('.singleArtTable').removeClass('hide').addClass('show');
			var data = param = {
				'userId': start.userId,
				'begainDate': isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
				'endDate': isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
				'pagination': {
					'page': start.page,
					'rows': start.rows
				}
			};
			start.getsingleArtTable({
				url: 'queryDetailsByArticle',
				data: data
			});
			start.getSingleArtPage(start.pages,'queryDetailsByArticle',data);
		}
	})

	//文章导出到excel
	$('#exportExc').click(function(){
		if(artInput === '0') {
			exportExcelData('articleDetailsCollectionExl', param);
		} else if(artInput === '1') {
			exportExcelData('queryDetailsByArticleExl', param);
		}
	})
})

var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
var start = {
	page: 1,
	rows: 5,
	userId: localStorage.getItem('userId') || "",
	getAllArticle: function(d){
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	var data = res.data;
            if(!isNull(data) && !isNull(data.list)) {
               	$('#dayForwardNumber').html(0);
               	$('#dayVisitNumber').html(data.list.dayVisitNumber || 0);
               	$('#dayCommentNumber').html(data.list.dayCommentNumber || 0);
               	$('#shareNumber').html(data.list.shareNumber || 0);
               	$('#dayCollectNumber').html(data.list.dayCollectNumber || 0);
               	$('#priaseNumber').html(data.list.priase || 0);
            } else {
                console.log('文章暂无数据');
            }
	    }   
	},
	getEchartsData:function(d){
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	console.log(res)
	    	var data = res.data;
            if(!isNull(data) && !isNull(data.list)) {
               //折线图：
                dataList = echartsData(data.list);
				var echartPic = echarts.init(document.getElementById('chartPic'));
				SwitchChartData('#forwardNum', echartPic, dataList.chartDate, dataList.forwardNum, Math.max.apply(null, dataList.forwardNum), '推荐');
				$('#forwardNum').click(function(){
					SwitchChartData(this, echartPic, dataList.chartDate, dataList.forwardNum, Math.max.apply(null, dataList.forwardNum), '推荐');
				});
				$('#visitNum').click(function(){
					SwitchChartData(this, echartPic, dataList.chartDate, dataList.visitNum, Math.max.apply(null, dataList.visitNum), '阅读');
				});
				$('#commentNum').click(function(){
					SwitchChartData(this, echartPic, dataList.chartDate, dataList.commentNum, Math.max.apply(null, dataList.commentNum), '评论');
				});
				$('#shareNum').click(function(){
					SwitchChartData(this, echartPic, dataList.chartDate, dataList.shareNum, Math.max.apply(null, dataList.shareNum), '分享');
				});
				$('#collectNum').click(function(){
					SwitchChartData(this, echartPic, dataList.chartDate, dataList.collectNum, Math.max.apply(null, dataList.collectNum), '收藏');
				});
				$('#likeNum').click(function(){
					SwitchChartData(this, echartPic, dataList.chartDate, dataList.likeNum, Math.max.apply(null, dataList.likeNum), '点赞');
				});
            } else {
                
            }
	    }   
	},
	getAllArtTable: function(d){
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	start.pages = Math.ceil(res.total / start.rows);
	    	var data = res.data;
	    	var getTpl = $("#allArtTable").html();
            if(!isNull(data) && !isNull(data.list)) {
               	laytpl(getTpl).render(data.list, function(html) {
                    $("#allArtTabCon").html(html);
                });
            } else {
                $("#allArtTabCon").html('');
            }
	    }   
	},
	getAllArtPage: function(pages, url, data) {
		laypage({
            cont: 'AllArtpage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
            	data.pagination.page = start.page = obj.curr;
                start.getAllArtTable({
					url: url,
					data: data
				})
            }
        });
	},
	getsingleArtTable: function(d){
		var url = d.url || "";
		var data = d.data || "";
	    var res = reqNewAjax(url, data);
	    if(res.code == 1) {
	    	start.pages = Math.ceil(res.total / start.rows);
	    	var data = res.data;
	    	var getTpl = $("#singleArtTable").html();
            if(!isNull(data)) {
               	laytpl(getTpl).render(data, function(html) {
                    $("#sinArtTabCon").html(html);
                });
            } else {
                $("#sinArtTabCon").html('');
            }
	    }   
	},
	getSingleArtPage: function(pages, url, data) {
        laypage({
            cont: 'singleArtpage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
            	data.pagination.page = start.page = obj.curr;
                start.getsingleArtTable({
					url: url,
					data: data
				})
            }
        });
    },
	setChart: function (echart, timesDate, data, max, type){	
		option = {
			title: {
				show:true,
				text: '数据趋势',
				textStyle: {
					color: '#999999',
					fontWeight: 'normal',
					textAlign: 'left',
					textBaseline: 'top'
				}
			},
			tooltip: { trigger: 'axis' },
			grid: {       //直角坐标系内绘图网格
				left: '0',
				right: '0',
				bottom: '4%',
				top:'14%',
				containLabel: true
			},
			xAxis: {       //直角坐标系 grid 中的 x 轴
				type: 'category',
				boundaryGap: false,
				data: timesDate,
				axisTick:{
				    show:false
				},
				axisLable:{
					show:false,
				},
				axisLine: {
           	 		lineStyle: { color: '#BDBDBD' }
          		}
			},
			yAxis: [{       //直角坐标系 grid 中的 y 轴
				position: 'left',
				type: 'value',
				min: 0,
				max: max,
				// splitNumber: 10,
				splitLine:{
					show:true,
					interval:1,
					lineStyle:{
						color:['#E7E7E7'],
						width:1,
						type:'solid'
					}
				},
				axisLine:{
				    show:true,
				    lineStyle: { color: '#BDBDBD' }
				},
				axisLabel:{
				    margin:10
				}
			},{ 
				position: 'right',
				axisLine:{
				    show:true,
				    lineStyle: { color: '#E7E7E7' }
				}
			}],
			series: [      //系列列表
				{
					name: type + '次数',
					type: 'line',
					stack: '总量',
					symbolSize:8,
					itemStyle : {
						normal : {
							color:'#FACA47',      //设置折点颜色
							lineStyle: {
								normal: {
									color:'#FACA47',   //设置折线颜色
								}
							}
						}
					},
					lineStyle: {
						normal: {
							// color:'#FFD600',   //设置折线颜色
							shadowBlur:0,
							shadowColor:'#fff',
							shadowOffsetY:10
						}
					},
					data: data
				}
			]
		};
		echart.setOption(option);   //参数设置方法
	}
}
//点击tab栏切换样式：
function navClick(html) {
	$('.chartAboutNav li').removeClass('active');
	$(html).addClass('active');
}

// 获取全部文章函数调用:
function getAllArtData(){
	start.getAllArticle({
		url: 'SurveyCollection',
		data: {
			'userId': start.userId,
			'startTime': isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
			'endTime': isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59'
		}
	})
	var data = param = {
		'userId': start.userId,
		'startTime': isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
		'endTime': isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
		'pagination': {
			'page': start.page,
			'rows': start.rows
		}
	}
	start.getAllArtTable({
		url: 'articleDetailsCollection',
		data: data
	})
	start.getAllArtPage(start.pages,'articleDetailsCollection',data);
}

//点击类型切换折线图数据：
function SwitchChartData(html, echart, timesDate, data, max, type) {
	navClick(html);
	start.setChart(echart, timesDate, data, max, type);
}

//把后台列表每一类型数据写入不同数组中：
function echartsData(data){
	var chartDate = [], forwardNum = [], visitNum = [], commentNum = [], shareNum = [], collectNum = [], likeNum = [];
	$.each(data, function(i,e){
		chartDate.push(e.visitTime.slice(5));
		forwardNum.push(0);
		visitNum.push(e.dayVisitNumber);
		commentNum.push(e.dayCommentNumber);
		shareNum.push(e.shareNumber);
		collectNum.push(e.dayCollectNumber);
		likeNum.push(e.priase);
	})
	chartDate = chartDate.reverse();
	forwardNum = forwardNum.reverse();
	visitNum = visitNum.reverse();
	commentNum = commentNum.reverse();
	shareNum = shareNum.reverse();
	collectNum = collectNum.reverse();
	likeNum = likeNum.reverse();
	return {
		chartDate: chartDate,
		forwardNum: forwardNum,
		visitNum: visitNum,
		commentNum: commentNum,
		shareNum: shareNum,
		collectNum: collectNum,
		likeNum: likeNum
	}
}
