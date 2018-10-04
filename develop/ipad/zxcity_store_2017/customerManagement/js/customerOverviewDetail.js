(function($){
    var REQUEST_URL = {
		'consume_url':'shopStatistics/queryAccountConsumeSummeryList',//客户总览--消耗业绩明细
		'sale_url':'shopStatistics/queryAccountSalesSummeryList',//客户总览--销售业绩明细
        'card_detail':'shopStatistics/queryAccountCardUsedList'//卡项信息明细
	};

    var now = new Date();
	var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');

    var startTime = today, endTime = today;
	var pageNo = 1, pageSize = 10;

    var shopId = sessionStorage.getItem("shopId"),
		accountId = getUrlParams("accountId"),
        cardId = getUrlParams("cardId"),
		mType = getUrlParams("mType"); //1-销售，2-消耗, 3-卡项明细

    var param = {"shopId":shopId, "accountId":accountId};

    //设置时间默认时间为今天
	$(".datetime").val(today);

	//日期初始化
	function initDateTime(){
		//日期选择器初始化
		var start = {
			isinitVal:true,
	        skinCell:"mystyle",
	        format:"YYYY-MM-DD",
	        isClear:false,
	        isok:false,
		    maxDate: $.nowDate({DD:0}), //最大日期
		    choosefun: function(elem, val, date){
		        end.minDate = date; //开始日选好后，重置结束日的最小日期
		        endDates($(elem).attr("id").replace("startTime",""));
		    }
		}
		var end = {
			isinitVal:true,
	        skinCell:"mystyle",
	        format:"YYYY-MM-DD",
	        isClear:false,
	        isok:false,
		    choosefun: function(elem, val, date){
		        start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
		    }
		};
		//这里是日期联动的关键
		function endDates(n) {
		    //将结束日期的事件改成 false 即可
		    //end.trigger = false;
		    $("#endTime"+n).jeDate(end);
		}
		$.jeDate('.start-time',start);
		$.jeDate('.end-time',end);
	}

    //列表渲染
    function consumeListShow(res){
        var sHtml = '';
        sHtml += '<thead><tr><th>服务名称</th><th>金额</th><th width="40%">服务技师</th><th>时间</th></tr></thead><tbody>'

        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr>'
                    + '<td>'+obj[i].purchaseName+'</td>'
                    + '<td>'+obj[i].price+'</td>'
                    + '<td>'+obj[i].waiter+'</td>'
                    + '<td>'+obj[i].consumeTime+'</td>'
                    + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }

        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#listTable").html(sHtml);
    }

    //加载消耗明细数据
    function consumeListLoad(timeType){
        param['timeType'] = timeType;
        if(timeType == 3){
            startTime = $("#startTime").val();
            endTime = $("#endTime").val();
            param['startData'] = startTime;
            param['endData'] = endTime;
        }
        param['pageNo'] = pageNo;
        param['pageSize'] = pageSize;
        reqAjaxAsync(REQUEST_URL['consume_url'], JSON.stringify(param)).done(function(resData){
            consumeListShow(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['consume_url'], JSON.stringify(param)).done(function(resData){
                    consumeListShow(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#listPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['consume_url'], JSON.stringify(param)).done(function(resData){
            //             consumeListShow(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#listPage').addClass("invisible");
            // }
        });

    }

    //列表渲染
    function saleListShow(res){
        var sHtml = '';
        sHtml += '<thead><tr><th>订单编号</th><th>订单金额</th><th>销售顾问</th><th>时间</th></tr></thead><tbody>'

        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr>'
                    + '<td>'+obj[i].orderId+'</td>'
                    + '<td>'+obj[i].price+'</td>'
                    + '<td>'+obj[i].salesMan+'</td>'
                    + '<td>'+obj[i].consumeTime+'</td>'
                    + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }

        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#listTable").html(sHtml);
    }

    //加载销售明细数据
    function saleListLoad(timeType){
        param['timeType'] = timeType;
        if(timeType == 3){
            startTime = $("#startTime").val();
            endTime = $("#endTime").val();
            param['startData'] = startTime;
            param['endData'] = endTime;
        }
        param['pageNo'] = pageNo;
        param['pageSize'] = pageSize;
        reqAjaxAsync(REQUEST_URL['sale_url'], JSON.stringify(param)).done(function(resData){
            saleListShow(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['sale_url'], JSON.stringify(param)).done(function(resData){
                    saleListShow(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#listPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['sale_url'], JSON.stringify(param)).done(function(resData){
            //             saleListShow(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $('#listPage').addClass("invisible");
            // }
        });

    }

    //列表渲染
    function cardListShow(res){
        var sHtml = '';
        sHtml += '<thead><tr><th>订单编号</th><th>使用时间</th><th>使用服务次数</th><th>服务单价</th><th>技师名称</th><th>顾问名称</th></tr></thead><tbody>';

        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr>'
                    + '<td>'+obj[i].orderId+'</td>'
                    + '<td>'+obj[i].consumeTime+'</td>'
                    + '<td>'+obj[i].consumeNum+'</td>'
                    + '<td>'+obj[i].unitPrice+'</td>'
                    + '<td>'+obj[i].waiterName+'</td>'
                    + '<td>'+obj[i].salesMan+'</td>'
                    + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>';
            }

        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#listTable").html(sHtml);
    }
    //卡项明细列表
    function cardListLoad(){
        var cardParam = {
            'cardId':cardId,
            'pageNo':pageNo,
            'pageSize':pageSize
        };

        reqAjaxAsync(REQUEST_URL['card_detail'], JSON.stringify(cardParam)).done(function(resData){
            cardListShow(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                cardParam['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['card_detail'], JSON.stringify(cardParam)).done(function(resData){
                    cardListShow(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#listPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         cardParam['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['card_detail'], JSON.stringify(cardParam)).done(function(resData){
            //             cardListShow(resData);
            //         });
            //     }).removeClass("invisible");
            // }else{
            //     $('#listPage').addClass("invisible");
            // }
        });

    }


    //明细时间类型tab切换
	$("#listTimeTypeBox .tab-item").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		var timeType = $(this).index() + 1;
		if(timeType == 3){
			$("#listDateSelector").removeClass("hide");
		}else{
			$("#listDateSelector").addClass("hide");
		}
        if(mType == 1){//销售
            saleListLoad(timeType);
        }else if(mType == 2){
            consumeListLoad(timeType);
        }
	});

	//明细按时间段查询
	$("#listSearchBtn").click(function(){
        if(mType == 1){//销售
            saleListLoad(3);
        }else if(mType == 2){
            consumeListLoad(3);
        }
	});

    $(function(){
        initDateTime();
        if(mType == 1){//销售
            saleListLoad(1);
        }else if(mType == 2){
            consumeListLoad(1);
        }else if(mType == 3){
            $(".date-wrap").addClass("hide");
            cardListLoad();
        }
    });

})(jQuery);
