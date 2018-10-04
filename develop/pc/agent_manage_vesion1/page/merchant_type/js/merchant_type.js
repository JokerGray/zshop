layui.use(['form', 'layer', 'jquery'], function() {
	var form = layui.form,
	layer = layui.layer,
	$ = layui.jquery,
	userno = sessionStorage.getItem('userno') || "";
	var id=sessionStorage.getItem('id')||"";
	
	//饼状图
	var myChart=echarts.init(document.getElementById('myChart'));
	var piePatternSrc='img/pic.jpg';
	var piePatternImg = new Image();
	piePatternImg.src = piePatternSrc;
	var itemStyle = {
	    normal: {
	        opacity: 0.7,
	        color: {
	            image: piePatternImg,
	            repeat: 'repeat'
	        },
	        borderWidth: 3,
	        borderColor: '#235894'
	    }
	};	
    var pram={
    	t_userid:id   
    };
    //请求接口
    reqAjaxAsync('operations/queryAgentCustomerBackUserCountByUserId',JSON.stringify(pram)).then(function(res){
    	var data=res.data
    	var arr=[];
		$.each(data, function(i,item) {	
			var map={};
			if(item.org_level==1){
				$(item).attr('name','普通商户')
			}else if(item.org_level==2){
				$(item).attr('name','代理商户')
			}else if(item.org_level==3){
				$(item).attr('name','合作商户')
			}			
			map.name=item.name;
			map.value=item.count;			
			arr[i]=map;

		});	
		

	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(
			{
			    title: {
			        text: '商户类型统计',
			        textStyle: {
			            color: '#235894'
			        }
			    },
			    tooltip: {},
			    series: [{
			        name: '商户类型统计',
			        type: 'pie',
			        selectedMode: 'single',
			        selectedOffset: 30,
			        clockwise: true,
			        label: {
			            normal: {
			                textStyle: {
			                    fontSize: 18,
			                    color: '#235894'
			                }
			            }
			        },
			        labelLine: {
			            normal: {
			                lineStyle: {
			                    color: '#235894'
			                }
			            }
			        },
			        data:arr,         //引用数据
			        itemStyle: itemStyle
			    }]
			}        	
	   );
   });

})
