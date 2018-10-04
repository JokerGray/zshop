layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage,
		userno = sessionStorage.getItem('userno') || ""
		var USER_URL={
			INTORMATION:'operations/groupBusinessMan'//查询
		};
		
	function date(){
		var sel=document.getElementById('year');
		var date = new Date();
		var year=date.getFullYear();
		for(var i=year;i>2015;i--){
			var option=document.createElement('option');
			option.value=i;
			var txt=document.createTextNode(i);
			option.appendChild(txt);
			sel.appendChild(option);
			if(i==2015){
				return;
			}
		};
		form.render();
	};
    date();
    //点击按钮查询
    $('#search').click(function(){
    	getEchart();
    });
    //统计图渲染回调函数
    function getEchart(){
		var myChart=echarts.init(document.getElementById('eChart'));
		var arrMonth=[];
		var arrData=[];
		var year=$('#year').val()||'';
		var parm={
			year:year
		}
		reqAjaxAsync(USER_URL.INTORMATION,JSON.stringify(parm)).done(function(res){
      		 var data=res.data;
			for(key in data){
				arrMonth.push(key+'月');
				arrData.push(data[key]);
			}
		  option = {
		  	title:{
		  		text:'商户月增长量',
		  		left:'left'
		  	},
		  	legend: {
		  		orient: 'vertical',
		  		left: 'center',
		  		data:['商户月增长量']
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
		            data : arrMonth,
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
		            name:'商户月增长量',
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