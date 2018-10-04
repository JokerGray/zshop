(function($){
	var REQUEST_URL = {
		'overview':'shopStatistics/customerDetails',//客户总览
		'cards':'shopStatistics/myHomePageAccountAllCardDetails',//卡项信息
		'consumptions':'shopStatistics/getAccountConsumptions',//工单记录
		'consumptionDetail':'shopStatistics/getOneConsumptionsDetail',//工单记录详情
		'orders':'shopStatistics/getAccountOrders',//订单记录
		'ordersDetail':'shopStatistics/getOneOrderDetail'//订单记录详情
	};
	var params = getParams();
	if (typeof (params["accountId"]) != "undefined" && sessionStorage.getItem("accountId") != params["accountId"]) {
		sessionStorage.setItem("accountId", params["accountId"]);
	}
	var shopId = sessionStorage.getItem("shopId");
	var accountId = sessionStorage.getItem("accountId");
	var tabIndex = params["tabIndex"];
	var pageNo = 1, pageSize = 10;

	function lineOptionSet(param){
		var option = {
			title: {
				text: '最近12次到店记录',
				left:'center'
			},
			tooltip: {    //提示框组件
				trigger: 'axis'
			},
			grid: {       //直角坐标系内绘图网格
				top: '12%',
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {       //直角坐标系 grid 中的 x 轴
				type: 'category',
				data: param.xData,
				axisLabel:{
					textStyle:{
						fontSize: 14  //刻度大小
					}
				}
			},
			yAxis: {       //直角坐标系 grid 中的 y 轴
				type: 'value',
				axisLabel:{
					textStyle:{
						fontSize: 14  //刻度大小
					}
				}
			},
			series: [      //系列列表
				{
					name: '次数',
					type: 'line',
					data: param.yData
				}
			]
		};
		return option;
	}

	//客户总览
	function tabConDataLoad_1(){
		var jsonData = "{'accountId': " + accountId + ", 'shopId': " + shopId + "}";
		reqAjaxAsync(REQUEST_URL['overview'], jsonData).done(function(res){
			if(res.code == 1){
				var obj = res.data;
				sessionStorage.setItem("accountName", obj.name);
				sessionStorage.setItem("accountMobile", obj.mobile);
			//	$("#accountName").html('（'+obj.name+'）');
				//客户姓名
				$("#mName").html(obj.name);
				//联系电话
				$("#mPhone").html(obj.mobile);
				//会员卡编号
				$("#mNo").html(obj.cardNumber);
				//会员等级
				$("#mLevel").html(obj.cardName);
	        	//会员类型
	        	$("#mType").html(obj.businessName);
				//开卡时间
				$("#mTime").html(obj.creatTime);
				//本金
				$("#mMoney").html(obj.principal);
	        	//卡项资金
	        	$("#mCardMoney").html(obj.interest);
	        	//预约次数
	        	$("#mYYCS").html(obj.bookingTimes);
	       		//消耗业绩
	       		$("#mXHYJ").html(obj.services);
	        	//销售业绩
	        	$("#mXSYJ").html(obj.sales);
	        	//购买产品数量
	        	$("#mGMCP").html(obj.buyGoodsNumber);
	        	//服务卡数量（项目卡）
	        	$("#mXMK").html(obj.serverCardNumber);

				var xData = [], yData = [];
				for(var i=0, len=obj.accessHistory.length; i<len; i++){
					xData.push(obj.accessHistory[i].accessDate);// 将一个或多个新元素添加到数组结尾，并返回数组新长度
					yData.push(obj.accessHistory[i].accessCount);
				}
				//初始化
				var customerChart1 = echarts.init(document.getElementById('customerChart1'));

				customerChart1.setOption(lineOptionSet({'xData':xData, 'yData':yData}));   //参数设置方法
			}
		});

	}

	//卡项信息
	function tabConDataLoad_2(){
		var jsonData = "{'accountId': " + accountId + ",'shopId':"+shopId+"}";
		reqAjaxAsync(REQUEST_URL['cards'], jsonData).done(function(res){
			if(res.code == 1){
				var sHtml = '', obj = res.data;
				if(obj.length > 0){
					for(var i=0; i<obj.length; i++){
						var tit = obj[i].pack_type == 2 ? "使用期限：" : "剩余数量：";
						sHtml += '<div class="card-item" id="'+obj[i].id+'">'
							+ '<dl><dt>'+obj[i].card_name+'</dt>'
							+ '<dd>使用数量：'+obj[i].consume_num+'</dd>'
							+ '<dd>'+tit+obj[i].remain_num+'</dd>'
							+'</dl>'
							+ '<a class="detail-show-link" href="javascript:;">查看详情</a></div>'
					}
				}else{
					sHtml += '<div class="nodata">暂无卡项信息</div>'
				}

				$("#tabCon2 .card-list").html(sHtml);
			}
		});

	}

	function showWorkOrderList(res){
		if(res.code == 1){
			var obj = res.data, sHtml = '';
			if(obj.length > 0){
				for(var i=0, len=obj.length; i<len; i++){
					sHtml += '<tr>'
						+ '<td>'+obj[i].consumeNo+'</td>'
						+ '<td>'+obj[i].accountName+'</td>'
						+ '<td>'+obj[i].salesMan+'</td>'
						+ '<td>'+obj[i].consumeTime+'</td>'
						+ '<td>'+obj[i].status+'</td>'
						+ '<td><button type="button" class="btn default-btn" data-consumeNo="'+obj[i].consumeNo+'" data-orderId="'+obj[i].orderId+'">查看详情</button></td>'
						+ '</tr>'
				}
			}else{
				sHtml += '<tr><td colspan="6">暂无工单记录</td></tr>'
			}


			$("#tabCon3 table tbody").html(sHtml);
		}
	}

	$("#tabCon3 table tbody").delegate('tr td .btn', 'click', function(){
		var consumeNo = $(this).attr('data-consumeNo');
        var tabVal = 1;
        layer.open({
			type: 2,
			title: '查看工单详情',
			scrollbar: false,
			skin: 'customer-layer',
			area: ['40%', '60%'], //宽高
			shadeClose: true, //开启遮罩关闭
			content: ['./workOrderDetail.html?consumeNo='+consumeNo, 'no']

		});
	});


	//工单记录
	function tabConDataLoad_3(){
		var param = {
			'accountId':accountId,
			'shopId':shopId,
			'pageNo':pageNo,
			'pageSize':pageSize
		};
		reqAjaxAsync(REQUEST_URL['consumptions'], JSON.stringify(param)).done(function(resData){
			showWorkOrderList(resData);
			pagingInit('#workPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['consumptions'], JSON.stringify(param)).done(function(resData){
                    showWorkOrderList(resData);
                });
            })
			// if(resData.total > 0){
			// 	$("#workPage").bootpag({
			// 		total: Math.ceil(resData.total / pageSize),
			// 		page: 1,
			// 		leaps: false,
			// 		maxVisible: 10
			// 	}).on('page', function(event, num){
			// 		param['pageNo'] = num;
			// 		reqAjaxAsync(REQUEST_URL['consumptions'], JSON.stringify(param)).done(function(resData){
			// 			showWorkOrderList(resData);
			// 		});
			// 	});
			// }
		});
	}


	//订单记录数据展示
    function showOrderList(res){
        if(res.code == 1){
			var sHtml = "";
        	if(res.data.length > 0){
        		 sHtml += '<ol class="table-content">';
                 for(var i=0, len=res.data.length; i<len; i++){
                     var row = res.data[i];
                     sHtml += '<li class="list-item" id="'+row.orderId+'">'
                         + '<ul><li class="sub-item">支付单号：'+row.orderId+'</li>'
                         + '<li class="sub-item">客<i></i>户：'+row.accountName+'</li>'
                         + '<li class="sub-item">支付金额：'+row.actualPay+'</li></ul>'
                         + '<ul><li class="sub-item">时<i></i>间：'+row.consumeTime+'</li>'
                         + '<li class="sub-item">支付状态：已完成</li></ul>'
                         + '<ul><li class="sub-item">开单者：'+row.saleMan+'</li></ul>'
                         + '<div class="item-btn">'
                        // + '<button class="new-drawer-btn">重新出票</button>'
                         + '<button class="check-order-btn">查看销售单</button>'
                         + '</div></li>'
                 }
                 sHtml += '</ol>'
        	}else{
        		sHtml = '<div class="nodata">暂无订单记录</div>'
        	}

            $("#tabCon4 .order-list").html(sHtml);
        }
    }

	$("#tabCon4 .order-list").delegate('.list-item .check-order-btn', 'click', function(){
		var orderId = $(this).parents('.list-item').attr('id');
		layer.open({
			type: 2,
			title: '查看订单详情',
			skin: 'customer-layer',
			scrollbar: false,
			area: ['75%', '480px'], //宽高
			shadeClose: true, //开启遮罩关闭
			content: ['./checkDetails.html?orderId='+orderId, 'no']

		});
	});

	//加载订单记录
	function tabConDataLoad_4(){
		pageSize = 4;
		var param = {
			'accountId':accountId,
			'shopId':shopId,
			'pageNo':pageNo,
			'pageSize':pageSize
		};
		reqAjaxAsync(REQUEST_URL['orders'], JSON.stringify(param)).done(function(resData){
			showOrderList(resData);
			pagingInit('#orderPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['orders'], JSON.stringify(param)).done(function(resData){
                    showOrderList(resData)
                });
            })
			// if(resData.total > 0){
			// 	$("#orderPage").bootpag({
			// 		total: Math.ceil(resData.total / pageSize),
			// 		page: 1,
			// 		leaps: false,
			// 		maxVisible: 10
			// 	}).on('page', function(event, num){
			// 		param['pageNo'] = num;
			// 		reqAjaxAsync(REQUEST_URL['orders'], JSON.stringify(param)).done(function(resData){
			// 			showOrderList(resData)
			// 		});
			// 	});
			// }
		});

	}

	$(function(){

		$("#tabCon"+tabIndex).removeClass('hide').siblings().addClass('hide');
		var title = "";
		switch (tabIndex) {
			case "1":
				title = "客情分析";
				tabConDataLoad_1();
				break;
			case "2":
				title = "卡项信息";
				tabConDataLoad_2();
				break;
			case "3":
				title = "工单记录";
				tabConDataLoad_3();
				break;
			case "4":
				title = "订单记录";
				tabConDataLoad_4();
				break;
			default:
				title = "客情分析";
				tabConDataLoad_1();
		}
		$(".main-title .title").text(title);
	});


	//销售，消耗明细
	$("#consumenDetailLink, #saleDetailLink").unbind("click").click(function(event){
		var mType = $(this).attr("data-type");
		var title = mType == 1 ? "客情分析--销售明细" : "客情分析--消耗明细";
		var linkUrl = "customerOverviewDetail.html?accountId="+accountId+"&mType="+mType;
		event.stopPropagation();

		layer.open({
			type: 2,
			title: title,
			scrollbar: false,
			area: ['80%', '80%'], //宽高
			shadeClose: true, //开启遮罩关闭
			content: linkUrl//iframe的url，no代表不显示滚动条
		});
	});
	//卡项明细
	$("#tabCon2 .card-list").undelegate("click").delegate(".card-item .detail-show-link", "click", function(event){
		var cardId = $(this).parent().attr("id");
		var cardName = $(this).parent().find("dt").text();
		var linkUrl = "customerOverviewDetail.html?accountId="+accountId+"&mType=3&cardId="+cardId;
		event.stopPropagation();
		layer.open({
			type: 2,
			title: "卡项信息明细（"+cardName+"）",
			area: ['80%', '80%'], //宽高
			shadeClose: true, //开启遮罩关闭
			scrollbar: false,
			content: linkUrl //iframe的url，no代表不显示滚动条
		});
	});


	//返回
	$(".main-title .return-icon").click(function(){
		if(sessionStorage.getItem("prevPage") == null || sessionStorage.getItem("prevPage") == "null"){
			sessionStorage.setItem("prevPage", 10);
		}else{
			sessionStorage.setItem("prevPage", sessionStorage.getItem("prevPage"));
		}

		$(this).attr("href", '../../index.html');
	});

})(jQuery);
