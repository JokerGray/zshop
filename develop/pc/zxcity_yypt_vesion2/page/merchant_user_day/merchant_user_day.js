layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
	var USER_URL={
		INTORMATION:'operations/groupBusinessManMouth'//查询
		};
	//时间设置	
	laydate.render({
	    elem: '#month'
	    ,type: 'month'
	    ,max:new Date().getMonth()
	});
    //点击按钮查询
    $('#search').click(function(){
    	getEchart();
    });
    //统计图渲染
	function getEchart(){
		var myChart=echarts.init(document.getElementById('eChart'));
		var arrDate=[]
		var arrData=[];
		var yearMouth=$('#month').val()||'';
		var parm={
			yearMouth:yearMouth
		}
		reqAjaxAsync(USER_URL.INTORMATION,JSON.stringify(parm)).done(function(res){
      		 var data=res.data; 
			for(key in data){
				arrDate.push(key+'日');
				arrData.push(data[key]);
			}
		  option = {
		  	title:{
		  		text:'商户日增长量'
		  	},
		  	legend:{
		  		data:['商户日增长量'],
		  		left:'center'
		  	},
		    color: ['#1aa195'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
		            data : arrDate,
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
		            name:'商户日增长量',
		            type:'bar',
		            barWidth: '60%',
		            data:arrData
		        }
		    ]
		};
			myChart.setOption(option)
		});

	};
	getEchart();
})