(function($){
	var params = getParams();
	if (typeof (params["accountId"]) != "undefined" && sessionStorage.getItem("accountId") != params["accountId"]) {
		sessionStorage.setItem("accountId", params["accountId"]);
	}
	var shopId = sessionStorage.getItem("shopId");
	var accountId = sessionStorage.getItem("accountId");
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
				boundaryGap: false,
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
		var res = reqAjax("shop/customerDetails", jsonData);
		if(res.code == 1){
			var obj = res.data;
			$(".maintitle h1").html('客户详情（'+obj.name+'）');
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
			//账户余额
			$("#mMoney").html(obj.principal);
        	//积分
        	$("#mCardMoney").html(obj.interest);
        	//预约次数
        	$("#mYYCS").html(obj.bookingTimes);
        	//欠款金额
        	$("#mQKJE").html(obj.owingMoney);
       		//服务业绩（消耗业绩）
       		$("#mXHYJ").html(obj.services);
        	//销售业绩
        	$("#mXSYJ").html(obj.sales);
        	//购买产品数量
        	$("#mGMCP").html(obj.buyGoodsNumber);
        	//金额差数量
        	$("#mJEK").html(obj.feeCardNumber);
        	//服务卡数量（项目卡）
        	$("#mXMK").html(obj.serverCardNumber);
        	//体验券数量
        	$("#mTYK").html(obj.voucherNumber);

			var xData = [], yData = [];
			for(var i=0, len=obj.accessHistory.length; i<len; i++){
				xData.push(obj.accessHistory[i].accessDate);// 将一个或多个新元素添加到数组结尾，并返回数组新长度
				yData.push(obj.accessHistory[i].accessCount);
			}
			//初始化
			var customerChart1 = echarts.init(document.getElementById('customerChart1'));

			customerChart1.setOption(lineOptionSet({'xData':xData, 'yData':yData}));   //参数设置方法
		}
	}

	//卡项信息
	function tabConDataLoad_2(){
		var jsonData = "{'accountId': " + accountId + "}";
		var res = reqAjax('shop/serviceCards', jsonData);
		if(res.code == 1){
			var sHtml = '', obj = res.data;
			for(var i=0; i<obj.length; i++){
				sHtml += '<div class="card-item">'
					+ '<dl><dt>'+obj[i].cardName+'</dt>'
					+ '<dd>购买数量：'+obj[i].totalNum+'</dd>'
					+ '<dd>剩余数量：'+obj[i].remainNum+'</dd>'
					+'<dd>产品备注：'+obj[i].summary+'</dd></dl>'
					+ '<label>次数卡</label></div>'
			}
			$("#tabCon2 .card-list").html(sHtml);
		}
	}


	//获取工单记录数据
	function getWorkOrderData(pageNo){
		var jsonData = "{'accountId': " + accountId + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
		var res = reqAjax('shop/customerConsumptions', jsonData);
		return res;
	}
	function showWorkOrderList(res){
		if(res.code == 1){
			var obj = res.data, sHtml = '';
			for(var i=0, len=obj.length; i<len; i++){
				sHtml += '<tr>'
					+ '<td>'+obj[i].orderId+'</td>'
					+ '<td>'+obj[i].accountName+'</td>'
					+ '<td>'+obj[i].operator+'</td>'
					+ '<td>'+obj[i].consumeTime+'</td>'
					+ '<td>'+obj[i].status+'</td>'
					+ '<td><button type="button" class="btn default-btn" data-orderId="'+obj[i].orderId+'">查看详情</button></td>'
					+ '</tr>'
			}
			$("#tabCon3 table tbody").html(sHtml);
		}
	}

	$("#tabCon3 table tbody").delegate('tr td .btn', 'click', function(){
		var orderId = $(this).attr('data-orderId');
        var tabVal = 1;
        layer.open({
			type: 2,
			title: '查看工单详情',
			skin: 'customer-layer',
			area: ['75%', '70%'], //宽高
			content: ['./workOrderDetail.html?orderId='+orderId, 'no']

		});
	});


	//工单记录
	function tabConDataLoad_3(){
		var resData = getWorkOrderData(pageNo);
		showWorkOrderList(resData)
		if(resData.total > 0){
			$("#orderPage").bootpag({
				total: Math.ceil(resData.total / pageSize),
				page: 1,
				maxVisible: 10
			}).on('page', function(event, num){
				var resData = getWorkOrderData(num);
				showWorkOrderList(resData)
			});
		}

	}

	//获取订单记录数据
	function getOrderListData(pageNo,pageSize){
		var jsonData = "{'accountId': " + accountId + ", 'pageNo': " + pageNo + ", 'pageSize': " + pageSize + "}";
		var resData = reqAjax('shop/orders', jsonData);
		return resData;
	}
	//订单记录数据展示
    function showOrderList(res){
        if(res.code == 1){
            var sHtml = '<ol class="table-content">';
            for(var i=0, len=res.data.length; i<len; i++){
                var row = res.data[i];
                sHtml += '<li class="list-item" id="'+row.orderNo+'">'
                    + '<ul><li class="sub-item">支付单号：'+row.orderNo+'</li>'
                    + '<li class="sub-item">客<i></i>户：'+row.accountName+'</li>'
                    + '<li class="sub-item">支付金额：'+row.fee+'</li></ul>'
                    + '<ul><li class="sub-item">时<i></i>间：'+row.consumeTime+'</li>'
                    + '<li class="sub-item">支付状态：已完成</li></ul>'
                    + '<ul><li class="sub-item">开单者：'+row.operator+'</li></ul>'
                    + '<div class="item-btn">'
                    + '<button class="new-drawer-btn">重新出票</button>'
                    + '<button class="check-order-btn">查看销售单</button>'
                    + '</div></li>'
            }
            sHtml += '</ol>'
            $("#tabCon4 .order-list").html(sHtml);
        }
    }

	$("#tabCon4 .order-list").delegate('.list-item .check-order-btn', 'click', function(){
		var orderId = $(this).parents('.list-item').attr('id');
		layer.open({
			type: 2,
			title: '查看订单详情',
			skin: 'customer-layer',
			area: ['75%', '70%'], //宽高
			content: ['./checkDetails.html?orderId='+orderId, 'no']

		});
	});

	//加载订单记录
	function tabConDataLoad_4(){
		pageSize = 4;
		var resData = getOrderListData(pageNo, pageSize)
		showOrderList(resData)
		if(resData.total > 0){
			$("#orderPage").bootpag({
				total: Math.ceil(resData.total / pageSize),
				page: 1,
				maxVisible: 10
			}).on('page', function(event, num){
				var resData = getOrderListData(num, pageSize);
				showOrderList(resData)
			});
		}
	}

	$(function(){
		tabConDataLoad_1();
	});

	$("#customerTabBox button").click(function(){
		var _index = $(this).index() + 1;
		$(this).addClass('active').siblings().removeClass('active');
		$("#tabCon"+_index).removeClass('hide').siblings().addClass('hide');
		if(_index == 1){
			tabConDataLoad_1();

		}else if(_index == 2){
			tabConDataLoad_2();

		}else if(_index == 3){
			tabConDataLoad_3();

		}else if(_index == 4){
			tabConDataLoad_4();
		}
	});

	//返回
	$(".maintitle .return-icon").click(function(){
		sessionStorage.setItem("prevPage", 9);
		$(this).attr("href", '../../common/html/main/main.html');
	});
	$(".maintitle .billing-link").click(function(){
		sessionStorage.setItem("accountId", accountId);
		sessionStorage.setItem("prevPage", 5);
		$(this).attr("href", '../../common/html/main/main.html');
	});


})(jQuery);
