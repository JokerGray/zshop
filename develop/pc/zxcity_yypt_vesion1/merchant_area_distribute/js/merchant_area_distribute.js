(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId");
    var updater = yyCache.get("pcNickname");//登录人名
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/countMerchantProvinceId' //(查询列表)
    };

	    var myChart=echarts.init(document.getElementById('eChart'));
		var arr1=[];//普通商户
		var arr2=[];//合作商户
		var arr3=[];//代理商户
		//普通商户
		var parm1={
			orgLevel:1
		};
		var res1=reqAjax(USER_URL.RESOURLIST,JSON.stringify(parm1));
				var data=res1.data;
				$.each(data,function(i,item){
					var map={};
					map.name=item.provinceName;
					map.value=item.count;
					arr1[i]=map
				});
		
		//合作商户
		var parm2={
			orgLevel:2
		};
		var res2=reqAjax(USER_URL.RESOURLIST,JSON.stringify(parm2));
			var data=res2.data;
			$.each(data,function(i,item){
				var map={};
				map.name=item.provinceName;
				map.value=item.count;
				arr2[i]=map			
			})
			
		//代理商户
		var parm3={
			orgLevel:3
		};
		var res3=reqAjax(USER_URL.RESOURLIST,JSON.stringify(parm3));
			var data=res3.data;
			$.each(data,function(i,item){
				var map={};
				map.name=item.provinceName;
				map.value=item.count;
				arr3[i]=map			
			})
			
		option={
			 title: {
		        text: '商户区域分布',
		        left: 'center'
		    },
		    tooltip: {
		        trigger: 'item'
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data:['普通商户','合作商户','代理商户']
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
		            name: '普通商户',
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
		            data:arr1
	
		        },
		        {
		            name: '合作商户',
		            type: 'map',
		            mapType: 'china',
		            label: {
		                normal: {
		                    show: true
		                },
		                emphasis: {
		                    show: true
		                }
		            },
		            data:arr2
	
		        },
		        {
		            name: '代理商户',
		            type: 'map',
		            mapType: 'china',
		            label: {
		                normal: {
		                    show: true
		                },
		                emphasis: {
		                    show: true
		                }
		            },
		            data:arr3
	
		        }
		    ]
		};
		myChart.setOption(option)
})(jQuery);