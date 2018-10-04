(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var updater = yyCache.get("pcNickname");//登录人名
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/countAppUserByCityId' //(查询列表)
    };

	    var myChart=echarts.init(document.getElementById('eChart'));
		var arr=[];
		var res=reqAjax(USER_URL.RESOURLIST,JSON.stringify());
				var data=res.data;
				$.each(data,function(i,item){
					var map={};
					map.name=item.provinceName;
					map.value=item.count;
					arr[i]=map
				});
		

			
		option={
			 title: {
		        text: 'App用户区域分布',
		        left: 'center'
		    },
		    tooltip: {
		        trigger: 'item'
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data:['App用户']
		    },
		    visualMap: {
		        min: 0,
		        max: 50,
		        left: 'left',
		        top: 'bottom',
		        text: ['高','低'],           // 文本，默认为数值文本
		        calculable: true
		    },
		    toolbox: {
		        show: true,
		        orient: 'vertical',
		        left: 'right',
		        top: 'center',
		        feature: {
		            dataView: {readOnly: false},
		            restore: {},
		            saveAsImage: {}
		        }
		    },
		    series: [
		        {
		            name: 'App用户',
		            zoom:1.0,
		            type: 'map',
		            mapType: 'china',
		            roam: false,
		            label: {
		                normal: {
		                    show: true
		                },
		                emphasis: {
		                    show: true
		                }
		            },
		            data:arr
	
		        }


		    ]
		};
		myChart.setOption(option)
})(jQuery);