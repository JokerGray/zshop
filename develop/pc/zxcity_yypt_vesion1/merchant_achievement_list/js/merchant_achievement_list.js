(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno");
	var userId = yyCache.get("userId");
	var pid = '';
	var locked = true;
	sessionStorage.removeItem('userId');
	sessionStorage.removeItem('total');
	
	var USER_URL = {
		SHOP: 'operations/getscMultipleShopConfigureListByLevel', //店铺名
		TOTALLIST:'operations/getUserSumDataListByMerchantId',//业绩列表
		LOOK:'operations/getUserSumDataPageListByUserId'//查看
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	//日期选择
	$('#datetimepicker1 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker2 .datepicker").hide();
	});

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker1 .datepicker").hide();
	});
 
	 //运算百分比
	 function Percentage(num, total) {
		return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
	}
	 
 //渲染直营店
 	function shop(){
 		var parm={
 			level:3
 		};
 		reqAjaxAsync(USER_URL.SHOP,JSON.stringify(parm)).then(function(res){
 			var data=res.data;
 			
 			var mHtml='<option value="">--请选择--</option>';
 			for(var i=0;i<data.length;i++){
 				mHtml+='<option value="'+data[i].merchantId+'">'+data[i].name+'</option>'
 			};
 			$('#shop').html(mHtml);
 		});
 	};
 	shop()
 	
	function _tableInit(){
			//渲染表单
		var objs = tableInit('tableNo', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '员工姓名',
						align: 'left',
						field: 'userName',
						width: 150
					}, {
						title: '业绩总额',
						align: 'left',
						field: 'achPay',
						width: 150
					},{
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 250					
					}
				]
			],
	
			pageCallback, 'laypageLeft', 0
		);	
	};
	_tableInit();



    //表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
            });
            return res;
        }else{
            layer.msg(res.msg);
        };

    };



    //pageCallback回调
    function pageCallback(index, limit) {
//		var merchantId = $('#shop').val()||"";
		var achType = $("#achType").val()||"";
//		var dateType = 5;
		var startDate = $("#jurisdiction-begin").val();
		var endDate = $("#jurisdiction-end").val();
		var param = {
			page: index,
			rows: limit,
			merchantId: 1070, //店
			achType:achType,//业绩类型
//			dateType:dateType,//时间类型
			startDate:startDate,//开始时间
			endDate:endDate//结束时间
		};
		var res = getData(USER_URL.TOTALLIST,JSON.stringify(param));
		$('#toolSearch').data('res',"");
	    $("#toolSearch").data("res",res)
		return res
    };


	

	//表格相关操作
	table.on('tool(tableNo)', function(obj) {
		var data = obj.data;
		var userId=data.userId;
		sessionStorage.setItem('userId',userId);
		sessionStorage.setItem('total',data.achPay);
		//查看
		if(obj.event === 'nodetail') {
		layer.open({
			title:['查看','font-size:12px;background-color:#0678CE;color:#fff'],
			type:1,
			content:$('#agentAdd'),
			area:['1200px','500px'],
			closeBtn:1,
			shade:[0.1,'#fff'],
			end:function(){
				$('#agentAdd').hide();
			},
			success:function(Layero,index){
				_tableInitLayer();
			}
		})
		}
	});
	
	
	function _tableInitLayer(){
		//渲染表单
		var objs = tableInit('tableLayer', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '员工姓名',
						align: 'left',
						field: 'userName',
						width: 150
					}, {
						title: '业绩额',
						align: 'left',
						field: 'achPay',
						width: 150
					}, {
						title: '业绩产生时间',
						align: 'left',
						field: 'achTime',
						width: 200
					}, {
						title: '业绩比(百分比)',
						align: 'left',
						field: 'percent',
						width: 150
					}
				]
			],
	
			pageCallbackLayer, 'laypageLeftLayer', 0
		);	
	};
	
	    //pageCallback回调
    function pageCallbackLayer(index, limit) {
		var userId =sessionStorage.getItem('userId') ;
		var achType = $("#achType").val()||"";
//		var dateType = 5;
		var startDate = $("#jurisdiction-begin").val();
		var endDate = $("#jurisdiction-end").val();

		var param = {
			page: index,
			rows: limit,
			userId: userId, //店
			achType:achType,//业绩类型
//			dateType:dateType,//时间类型
			startDate:startDate,//开始时间
			endDate:endDate//结束时间
		}
		return getDataLayer(USER_URL.LOOK, JSON.stringify(param));
    };
    
    
    
    //弹出表格数据处理
    function getDataLayer(url, parms) {
        var res = reqAjax(url, parms);
        var total=sessionStorage.getItem('total');
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                $(item).attr('percent',Percentage(item.achPay,total)) 
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };



	//点击表格变色
	$('body').on('click', '.layui-form .layui-table-body tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	});
	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200);
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click', function() {
		_tableInit();
		var res = $("#toolSearch").data("res");		
		var data=res.data;
		if(data!==undefined&&data.length!==0){
			var nameArr=[];
			var dateArr=[];
			var myArr=[];
			var dataDital=[];
			for(var j=0;j<data[0].list.length;j++){
				dateArr.push(data[0].list[j].achTime);
			};		
			for(var i=0;i<data.length;i++){
				nameArr.push(data[i].userName);
				var map={};
				for(var h=0;h<data[i].list.length;h++){				
					dataDital.push(data[i].list[h].achPay);
					
				}
				map.name=nameArr[i];
				map.type='line';
				map.stack='总量';
				map.data=dataDital.slice(i*dateArr.length,(i+1)*dateArr.length);
				myArr[i]=map;
			};
			eChart(nameArr,dateArr,myArr);			
		}else{
			eChart();
		}

	});	
	
	//统计图方法
	function eChart(name,date,arr){
		var myChart = echarts.init(document.getElementById('myChart'));

		myChart.setOption(option = {
							    title: {
							        text: '员工业绩报表'
							    },
							    tooltip: {
							        trigger: 'axis'
							    },
							    legend: {
							        data:name
							    },
							    grid: {
							        left: '3%',
							        right: '4%',
							        bottom: '3%',
							        containLabel: true
							    },
							    toolbox: {
							        feature: {
							            saveAsImage: {}
							        }
							    },
							    xAxis: {
							        type: 'category',
							        boundaryGap: false,
							        data: date
							    },
							    yAxis: {
							        type: 'value'
							    },
							    series: arr

		})
	};
			
	

	//重置
	$("#toolRelize").click(function() {
		$('#shop').val("");
		$('#achType').val("");
		$('#dataType div').removeClass('layui-form-radioed');
		$('#dataType i').removeClass('layui-anim-scaleSpring');
		$('#dataType>:checked').attr('value',"");
		$('#jurisdiction-begin').val("");
		$('#jurisdiction-end').val("");
		_tableInit();
		eChart();
	});
	
	//刷新
	$('#refrshbtn').on('click',function(){
		location.reload();
	});
    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback, test) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-649',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(page, rows);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
        };

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        };
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit);
                if(resTwo && resTwo.code == 1)
                    tableIns.reload({
                        data: resTwo.data
                    });
                else
                    layer.msg(resTwo.msg);
            }
        };


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    };

})(jQuery);