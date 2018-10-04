$(function () {
	//设置默认值
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
	//请求URL
	var USER_URL = {
		TOTAL_INCOME:"game/shopMessage",  //总收益
        PERSONAL_INCOME: "game/shopIncomeTodayRank",  //个人收益排行
        STORE_REVENUE:"game/shopEarningsCurve", //店铺收益排行
        ACCOUNT_TIXIAN:"game/selectZPigletAccountByShopId",//查询是否有账户
        TIXIAN:"game/sendAccounts" //提现
    };
    //根据参数名获取地址栏URL里的参数
	function getUrlParams(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
		return decodeURI(decodeURIComponent(r[2]));
		}
		return "";
	}
	var SHOPID=getUrlParams('shopId');
	//var SHOPID=49;
	var pageno=1;
  	var rows=10;
  	var layer=layui.layer;
	var table = layui.table;	
	var paramType = 0;
	var shouyiparam = {
		shopId: SHOPID
	};
	//个人收益排行
  	getTable(paramType,pageno);
  	//总收益、今日收益、人数
  	var res=reqAjax(USER_URL.TOTAL_INCOME,JSON.stringify(shouyiparam));
	if(res.code==1){
 		//赋值
   		$("#sumProfit").html(res.data.balance);
   		$("#dayProfit").html(res.data.todayIncome);
   		$("#sumContract").html(res.data.userSize);
	}
	//是否有账户
	var tixianRes=reqAjax(USER_URL.ACCOUNT_TIXIAN,JSON.stringify(shouyiparam));
	if(tixianRes.code==1 && tixianRes.data != null && tixianRes.data != undefined ){
 		//赋值
   		$("#tixian").css('display','block');
	}
  		
  	
  	function getTable(paramType,pageno) {    	
    	//第一个实例
    	var tableINs=table.render({
      		id:'demo',
      		elem: '#demo',
      		cols: [[ //表头
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
		        {field: 'username', title: '用户名称', width: '80'},
		        {field: 'usersex', title: '性别', width: '40'},  
		        {field: 'level', title: '等级', width:'60', templet:'#levelTpl'},
		        {field: 'fansNumber', title: '粉丝数', width: '40'},                     
		        {field: 'todayIncome', title: '猪仔重量(Kg)', width: '40'},  
		        {field: 'percentum', title: '占总数百分比(%)', width: '100'}
      		]]
    	});

    	var res=pageCallback(paramType,pageno);
		if(res){
  			if(res.code==1){
		        tableINs.reload({
		          data: res.data
		        })
		    }else {
		        layer.msg(res.msg)
		    }
		}

		//分页
		layui.use('laypage');
		var page_options = {
  			elem: 'laypageLeft',
  			count: res ? res.total : 0,
  			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
  			groups: '4',
  			limit: rows,//每页条数
  			limits: [5, 8, 10]
		}
		//分页渲染
		page_options.jump = function(obj, first) {
  			if(!first) {
    			var resTwo = pageCallback(paramType,obj.curr);
    			if(resTwo && resTwo.code == 1)
      				tableINs.reload({
        				data: resTwo.data
      				});
    			else
      				layer.msg(resTwo.msg);
  			}
		}
		layui.laypage.render(page_options);
  	}

  	//获取内容方法
  	function pageCallback(paramType,pagerows) {
    	var param={
      		shopId:SHOPID,
      		type:paramType,
      		page:pagerows -1,
      		row:rows
      		/*
      		pagination:{
        		page: pagerows,
        		rows: rows
      		}*/
    	}
    	var res=reqAjax(USER_URL.PERSONAL_INCOME,JSON.stringify(param));
    	if(res.code==1){
     		return res;
    	}
  	} 
  	
  	//店铺收益排行
  	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('speedChartMain')); 
	
  	var option = {
  		title: {    //图表标题
            text: '店铺收益趋势'
        },
		tooltip: {
			trigger: 'axis'
		},
		dataZoom: [
             {
                 type: 'slider',    //支持鼠标滚轮缩放
                 start: 0,            //默认数据初始缩放范围为10%到90%
                 end: 100
             },
             {
                 type: 'inside',    //支持单独的滑动条缩放
                 start: 0,            //默认数据初始缩放范围为10%到90%
                 end: 100
             }
        ],
		legend: { //图表上方的类别显示
			show:true,
			data:['猪仔(Kg)']
		},
		color:[
       		'#FF3333'    //曲线颜色
       	],
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {  //工具栏显示
			show: true,
			feature: {
				saveAsImage: {}  //显示“另存为图片”工具
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: [  //可以设置左右两个y轴
			{
                //第一个（左边）Y轴，yAxisIndex为0
                 type : 'value',
                 name : '重量',
                 /* max: 120,
                 min: -40, */
                 axisLabel : {
                     formatter: '{value} Kg'    //控制输出格式
                 }
            }
		],
		series: [ //系列（内容）列表
			{
                name:'猪仔（Kg）',
                type:'line',    //折线图表示（生成温度曲线）
                symbol:'emptycircle',    //设置折线图中表示每个坐标点的符号；emptycircle：空心圆；emptyrect：空心矩形；circle：实心圆；emptydiamond：菱形                        
                data:[]        //数据值通过Ajax动态获取
            }
		]
	};

	
	myChart.showLoading();    //数据加载完之前先显示一段简单的loading动画	
	             
	var times=[];    //時間数组（实际用来盛放X轴坐标值）
	var speeds=[];    //速度数组（实际用来盛放Y坐标值）
	var storeParam = {
		shopId:SHOPID
	};
	reqAjaxAsync(USER_URL.STORE_REVENUE,JSON.stringify(storeParam)).done(function(res) {
		if (res.code == 1) {  
			/*for (var i = 0; i < res.data.length; i++) {
				times.push(res.data[i].dateTime);
				speeds.push(res.data[i].earnings);
			}*/
			times = res.data.dateTime;
			speeds = res.data.earnings;
			
			myChart.hideLoading();    //隐藏加载动画
			
			//之前option中legend和 XAxis的data,series 为空，所以现在将数据填充进去
			myChart.setOption({        //加载数据图表
				legend: {
					data:[]
				},
				xAxis: {
					data: times
				},
				series: [{
					// 根据名字对应到相应的系列
					name: "重量",
					type:'line',
					data: speeds
				}]
			});
		}else{
			layer.msg("请求数据失败,请稍后再试");
			myChart.hideLoading();
		}
		
	});	
	
	// 使用刚指定的配置项和数据显示图表。 
	myChart.setOption(option);
	
	//结算
	$("#tixian").on('click',function(){
		$("#editTop").modal('show');	
		var piglet;
		var price;
	
		//展示
		$("#piglet").keyup(function(){
			piglet = $("#piglet").val();
			price = piglet * 0.1;
			if(piglet != null){
		  		$("#resultyuan").html(price);
		 	}
		});
    	//结算按钮
    	$("#editTopic").on("click", function(index){    		
    		if(piglet == "" || piglet == undefined || piglet <= 0){
				layer.confirm("请输入结算值");
			}else{
				//取值
		    	var tixianparam={
		    		taxType:"劳务报税",//劳务报税
		    		type:"2", //1用户，2店铺提现
		    		balance: piglet,
		    		shopId: SHOPID
		    	}
				//异步请求
		    	reqAjaxAsync(USER_URL.TIXIAN,JSON.stringify(tixianparam)).done(function(res) {
		    		if (res.code == 1) {                   
			        	$("#editTop").modal("hide");
			        	layer.msg("结算成功");
			        	window.location.reload();
	                }else{
	                    layer.msg(res.msg);
	                }
		    	});
			}	    	
		});	
	});
})