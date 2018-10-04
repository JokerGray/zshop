$(document).ready(function(){

	var params, myChart, shareUserId, i;

	shareUserId = action.GetParameter('shareUserId') || '';

	//修改日期
	action.getDate(0);

	param = {
		'shareUserId':0,
		'selectDate':'',
		'selectType':1,
		'selectBusiness':2,
		'dayNumber':0,
		'pagination':{'page':1,'rows':10}
	};

	//修改param参数：shareUserId、selectDate
	param.shareUserId = shareUserId;
	param.selectDate = action.format(new Date());

	myChart = echarts.init(document.getElementById('chart_one'));
	
	$('#nav_box li').click(function(){
		if($(this).index() == 0){
			//修改日期
			action.getDate(0);

			param.selectType = 1
			param.dayNumber = 0
			action.getData(myChart,param);
			action.getData3(param);
			$(this).children().addClass('hover').parent().siblings().children().removeClass('hover');

		}
		if($(this).index() == 1){
			//昨天的日期
			action.getDate(1);

			param.selectType = 1
			param.dayNumber = 1
			action.getData(myChart,param);
			action.getData3(param);
			$(this).children().addClass('hover').parent().siblings().children().removeClass('hover');

		}
		if($(this).index() == 2){
			//近7天的日期
			action.getDate(7);

			param.selectType = 2
			param.dayNumber = 7
			action.getData(myChart,param);
			action.getData3(param);
			$(this).children().addClass('hover').parent().siblings().children().removeClass('hover');

		}
		if($(this).index() == 3){
			//近30天的日期
			action.getDate(30);

			param.selectType = 2
			param.dayNumber =30
			action.getData(myChart,param);
			action.getData3(param);
			$(this).children().addClass('hover').parent().siblings().children().removeClass('hover');

		}

		//移动nav中的#underline
		$('#underline').animate({
			left: $(this).offset().left - 10 + 'px',
			width: $(this).width() + 20 + 'px'
		});
		
	})

	action.getData(myChart,param);
	action.getData3(param);
	
});

var action = {
	getData: function (echart,param){
		$.ajax({
			type:'POST',
			url:'/zxcity_restful/ws/rest',
			headers:{
				apikey: sessionStorage.getItem('apikey') || 'test'
			},
			data:{
				'cmd':'earnmoney/getShareReportForUser',
				'data':JSON.stringify(param),
				version:2
			},
			dataType:'json',
			success:function(data){
				var data = data.data;
				// 取出类型
				var type = $('.nav_box a.hover').parent().attr('id');
				var arrayX = [], arrayY = [];
				for(var i = 0; i < data.infoList.length; i++){
					var x = data.infoList[i]['id'];
					// 根据类型处理时间
					if(type == 'today' || type == 'testerday') x = (parseInt(x) < 10 ? '0' : '') + x + ':00';
					arrayX.push(x);
					arrayY.push(data.infoList[i]['value']);
				}
				
				$('#sumMoney').html(data.sumMoney);
				$('#sumNum').html(data.sumMun);
		
				action.setChart(echart,arrayX,arrayY);
			}
		})
	},
	getData2: function (param){
		$.ajax({
			type:'POST',
			url:'/zxcity_restful/ws/rest',
			data:{
				'cmd':'earnmoney/getshareProfitList',
				'data':JSON.stringify(param),
				version:2
			},
			dataType:'json',
			success:function(data){
				var html = template('ticketData',data);
				$('#ticket_box').html(html);
			}
		})
	},
	getData3: function (param){
		$.ajax({
			type:'POST',
			url:'/zxcity_restful/ws/rest',
			data:{
				'cmd':'earnmoney/getReprintReportPageList',
				'data':JSON.stringify(param),
				version:2
			},
			dataType:'json',
			success:function(data){
				var html = template('ticketData',data);
				$('#con_box').html(html);
				var data = data.data;
				// 取出类型
				var type = $('.nav_box a.hover').parent().attr('id');
				var arrayX = [], arrayY = [];
				for(var i = 0; i < data.length; i++){
					for(var j = 0; j < data[i].infoList.length; j++){
						var x = data[i].infoList[j]['id'];
						// 根据类型处理时间（什么鬼英文……）
						if(type == 'today' || type == 'testerday') x = (parseInt(x) < 10 ? '0' : '') + x + ':00';
						arrayX.push(x);
						arrayY.push(data[i].infoList[j]['value']);
					}
					action.setChart(echarts.init(document.getElementById('chart_two' + i)), arrayX, arrayY);
					arrayX = [], arrayY = [];
				}
				//截取标题多余字段
				action.substr();
			}
		})
	},
	setChart: function (echart,dataX,dataY){	
		option = {
			tooltip: { trigger: 'axis' },
			grid: {       //直角坐标系内绘图网格
				left: '3%',
				right: '4%',
				bottom: '4%',
				top:'6%',
				containLabel: true
			},
			xAxis: {       //直角坐标系 grid 中的 x 轴
				type: 'category',
				boundaryGap: false,
				data: dataX,
				axisTick:{
				    show:false
				},
				axisLable:{
					show:false,
				},
				axisLine: {
           	 		lineStyle: { color: '#fff' }
          		}
			},
			yAxis: {       //直角坐标系 grid 中的 y 轴
				type: 'value',
				boundaryGap:[0,'100%'],
				min:0,
				max:30,
				interval:15,
				splitNumber:2,
				nameTextStyle:{
					color:'red'
				},
				splitLine:{
					show:true,
					interval:'auto',
					lineStyle:{
						color:['#ccc'],
						width:1,
						type:'dashed'
					}
				},
				axisLine:{
				    show:false
				},
				axisLabel:{
				    margin:10
				}
			},
			series: [      //系列列表
				{
					name: '点击数',
					type: 'line',
					stack: '总量',
					symbolSize:8,
					areaStyle:{
						normal:{
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							  offset: 0, color: '#b8e9ff' // 0% 处的颜色
							}, {
							  offset: 1, color: '#ebf9ff' // 100% 处的颜色
							}], false)
						}
					},
					itemStyle : {
						normal : {
							color:'#10b5ff',      //设置折点颜色
							lineStyle: {
								normal: {
									color:'#10b5ff',   //设置折线颜色
									// shadowBlur:0,
									// shadowColor:'#fff',
									// shadowOffsetY:4
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
					data: dataY
				}
			]
		};
		echart.setOption(option);   //参数设置方法
	},
	format: function (d, fmt) {
      if (!fmt) fmt = 'yyyy-MM-dd'
      var date = new Date(d)
      if (date === 'Invalid Date') return ''
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      return fmt;
    },
    GetParameter: function (name){  
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
         var r = window.location.search.substr(1).match(reg);  
         if(r!=null)return  unescape(r[2]); return null;  
    },
    getDate: function (day) {
    	var selectDate, then, today;
		then = action.format((new Date()).setDate((new Date()).getDate() - day));
		if(day == 0 || day == 1) {
			selectDate = then;
		} else {
			selectDate = then + '至' + action.format(new Date());
		}
		$('#date').html(selectDate);
	},
	substr: function(){
		for(var i = 0; i < $('.share_taskTitle').length; i++) {
			var txt = $('.share_taskTitle')[i].innerHTML;
			if(txt.length > 10) {
				$('.share_taskTitle')[i].innerHTML = txt.substr(0,10) + '...';
			}	
		}
	}  
}


