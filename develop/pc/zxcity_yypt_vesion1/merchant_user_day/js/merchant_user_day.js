(function($){
    var page = 1;
    var rows = 10;
    var USER_URL = {
        INTORMATION :'operations/groupBusinessManMouth' //(查询)
    };


    
    layui.use('form', function(){
        form = layui.form;
    })

	$('#search').click(function(){
		getEchart()
	});
	
	function getEchart(){
		var myChart=echarts.init(document.getElementById('eChart'));
		var arrDate=[]
		var arrData=[];
		var yearMouth=$('#qBeginTime2').val()||'';
		var parm={
			yearMouth:yearMouth
		}
		reqAjaxAsync(USER_URL.INTORMATION,JSON.stringify(parm)).done(function(res){
      		 var data=res.data; 
			for(key in data){
				arrDate.push(key+'日');
				arrData.push(data[key]);
			};
		option = {
		  	title:{
		  		text:'商户日增长量'
		  	},
		  	legend:{
		  		data:['用户日增长量'],
		  		left:'center'
		  	},
		    color: ['#1E90FF'],
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
		            name:'用户日增长量',
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

	$('#qBeginTime2').datepicker({
	    todayBtn : "linked",
	    autoclose : true,
	    clearBtn:true,
	    todayHighlight : true,
	    startView: 1,
	    maxViewMode: 2,
	    minViewMode:1,
	    language : "zh-CN",
	    endDate : new Date()
	}).on('changeDate',function(e){
	    startTime2 = e.date;
	});
	
})(jQuery);