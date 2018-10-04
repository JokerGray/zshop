
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echartsDiv2'));
		
		var echartsName = '优惠券领用记录 总金额';
		var dataNum01 = [75.00, 105.11, 101, 134, 90, 230, 210]; //y 纵轴上的数据
		var dataNum02 = [220, 182, 191, 234, 290, 330, 310]; //y 纵轴上的数据
		var dataNum03 = [150, 232, 201, 154, 190, 330, 410]; //y 纵轴上的数据
		var dataNum04 = [320, 332, 301, 334, 390, 330, 320]; //y 纵轴上的数据
		var dataNum05 = [820, 932, 901, 934, 1290, 1330, 1320]; //y 纵轴上的数据
		var dataTime = ['周一','周二','周三','周四','周五','周六','周日']; //x 横轴上的时间
		var dataType = ['账户1','账户2','账户3','账户...','账户5']; //图顶部显示的分类
		var seriesArr = [
        {
            name:dataType[0],
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:dataNum01
        },
        {
            name:dataType[1],
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:dataNum02
        },
        {
            name:dataType[2],
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:dataNum03
        },
        {
            name:dataType[3],
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:dataNum04
        },
        {
            name:'',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[]
        },
        {
            name:dataType[4],
            type:'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data:dataNum05
        }
		];
		
		
        // 指定图表的配置项和数据
		option = {
			title: {
				text: echartsName
			},
			tooltip : {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},
			legend: {
				data:dataType
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis : [
				{
					type : 'category',
					boundaryGap : false,
					data : dataTime
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : seriesArr
		};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);