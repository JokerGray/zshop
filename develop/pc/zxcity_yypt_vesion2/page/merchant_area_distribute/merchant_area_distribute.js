layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
    var USER_URL = {
        RESOURLIST : 'operations/countMerchantProvinceId' //(查询列表)
    };
	    
	var arr1=[];//普通商户
	var arr2=[];//合作商户
	var arr3=[];//代理商户
	//普通商户
	var parm1={
		orgLevel:1
	};
	reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(parm1)).then(function(res1){
			var data=res1.data;
			$.each(data,function(i,item){
				var map={};
				map.name=item.provinceName;
				map.value=item.count;
				arr1[i]=map
			});
			mEchart(arr1,arr2,arr3)
	});
	//合作商户
	var parm2={
		orgLevel:2
	};
	reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(parm2)).then(function(res2){
		var data=res2.data;
		$.each(data,function(i,item){
			var map={};
			map.name=item.provinceName;
			map.value=item.count;
			arr2[i]=map			
		});
		mEchart(arr1,arr2,arr3)
	});	
	//代理商户
	var parm3={
		orgLevel:3
	};
	reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(parm3)).then(function(res3){
		var data=res3.data;
		$.each(data,function(i,item){
			var map={};
			map.name=item.provinceName;
			map.value=item.count;
			arr3[i]=map			
		})
		mEchart(arr1,arr2,arr3)
	});	
//		eCharts回调函数
	function mEchart(arr1,arr2,arr3){
		var myChart=echarts.init(document.getElementById('eChart'));
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
	}

})
