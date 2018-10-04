layui.use(['layer'],function () {
    var $ = layui.$,
        layer = layui.layer;
    var REQUIRE_URL = {
        saleOrderCount:'cs_shopBusiness/getDailySaleOrderDetail',//店外日销售订单数
        orderTrend:'cs_shopBusiness/getSevenDaysCountChart',//店外订单走势图
        onlineOrderList:'cs_shopBusiness/getDayOrderDetail',//店外订单列表
        onlineOrderDetail:'cs_shopBusiness/getDayOrderGoodsDetail',//店外订单详情
        inShopOrderCount:'cs_shopBusiness/getInstoreDailySaleOrderDetail',//店内订单概况
        inShopOrderTrend:'cs_shopBusiness/getInstoreSevenDaysCountChart',//店内订单走势
        inShopOrderList:'cs_shopBusiness/getInstoreDayOrderDetail',//店内订单列表
        inShopOrderDetail:'cs_shopBusiness/getInstoreDayOrderGoodsDetail'//店内订单详情
    };
    var backUserId = getUrlParams('backUserId');
    var shopId = getUrlParams('shopId');
    var shopName = getUrlParams('shopName');
    var date = getUrlParams('date');
    var type = getUrlParams('type');
    var pageSize = 10;
    init();

    //店外购物echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector(obj.dom));
        // 指定图表的配置项和数据
        var option = {
            color: ['#ff6636','#1e9fff','#cccccc'],
            title: {
                text:'订单走势(7日内)',
                textStyle: {
                    color: '#333',
                    fontWeight: 'normal',
                    fontSize: '15'
                },
                left: 30,
                top: 6
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['支付订单','完成订单','退款订单'],
                right: 30,
                top: 6
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#cccccc'
                    }
                },
                axisLabel: {
                    color: '#666'
                },
                // name:'日期',
                // nameTextStyle:{
                //     fontSize:14,
                //     color:'#666',
                //     padding:[22,0,0,0]
                // },
                // nameGap:30,
                splitLine: {
                    show: true,
                    interval: obj.xData.length - 2,
                },
                data: obj.xData
                // data: ['07-29','07-30','07-31','08-01','08-02','08-03','08-04']

            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    color: '#666'
                },
                name: '订单数',
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#666',
                    padding: [0, 0, 45, 0]
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
            },
            series: [
                {
                    name: '支付订单',
                    type: 'line',
                    smooth: true,
                    data: obj.yData.pay,
                },
                {
                    name: '完成订单',
                    type: 'line',
                    smooth: true,
                    data: obj.yData.finish,
                },
                {
                    name: '退款订单',
                    type: 'line',
                    smooth: true,
                    data: obj.yData.quit,
                }
            ],
            grid: {
                borderWidth: 1,
                left: '90px',
                right: '30px',
                bottom: '10%',
                top: '14%'
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //店内下单echart折线图方法
    function inShopEchartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector(obj.dom));
        // 指定图表的配置项和数据
        var option = {
            color: ['#ff6636','#1e9fff','#cccccc'],
            title: {
                text:'订单走势(7日内)',
                textStyle: {
                    color: '#333',
                    fontWeight: 'normal',
                    fontSize: '15'
                },
                left: 30,
                top: 6
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['新增订单','已结算订单'],
                right: 30,
                top: 6
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#cccccc'
                    }
                },
                axisLabel: {
                    color: '#666'
                },
                // name:'日期',
                // nameTextStyle:{
                //     fontSize:14,
                //     color:'#666',
                //     padding:[22,0,0,0]
                // },
                // nameGap:30,
                splitLine: {
                    show: true,
                    interval: obj.xData.length - 2,
                },
                data: obj.xData
                // data: ['07-29','07-30','07-31','08-01','08-02','08-03','08-04']

            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    color: '#666'
                },
                name: '订单数',
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#666',
                    padding: [0, 0, 45, 0]
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
            },
            series: [
                {
                    name: '新增订单',
                    type: 'line',
                    smooth: true,
                    data: obj.yData1,
                },
                {
                    name: '已结算订单',
                    type: 'line',
                    smooth: true,
                    data: obj.yData2,
                },
            ],
            grid: {
                borderWidth: 1,
                left: '90px',
                right: '30px',
                bottom: '10%',
                top: '14%'
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //初始化分页方法
    function initPageSelector(domId, total, jump) {
        if (total <= pageSize) {
            $('#' + domId).html('');
            return
        }
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: domId,
                count: total, //数据总数，从服务端得到
                theme: "#ccc",
                limit: pageSize,
                groups: 3,
                jump: function (obj, first) {
                    //首次不执行
                    if (!first) {
                        jump ? jump(obj, first) : null
                        //do something
                    }
                }
            })
        })
    }

    //////////////////////////////////////////////////////////////

    //获取每日店外支付订单，完成订单，退款订单数
    function getOrderCount(){
        var params = {
            "backUserId": backUserId,
            "time": date,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['saleOrderCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#payCount').text(res.data.dayPayOrdertotalCount);
                $('#completeCount').text(res.data.dayFinishOrderTotalCount);
                $('#returnCount').text(res.data.dayRefundOrderTotalCount);
                if(res.data.dayPayOrdertotalCountCompare > 0){
                    $('#payCompare').text('高于前日'+res.data.dayPayOrdertotalCountCompare)
                }else if(res.data.dayPayOrdertotalCountCompare < 0){
                    $('#payCompare').text('低于前日'+Math.abs(res.data.dayPayOrdertotalCountCompare))
                }else{
                    $('#payCompare').text('与前日持平')
                }
                if(res.data.dayFinishOrderTotalCountCompare > 0){
                    $('#completeCompare').text('高于前日'+res.data.dayFinishOrderTotalCountCompare)
                }else if(res.data.dayFinishOrderTotalCountCompare < 0){
                    $('#completeCompare').text('低于前日'+Math.abs(res.data.dayFinishOrderTotalCountCompare))
                }else{
                    $('#completeCompare').text('与前日持平')
                }
                if(res.data.dayRefundOrderTotalCountCompare > 0){
                    $('#returnCompare').text('高于前日'+res.data.dayRefundOrderTotalCountCompare)
                }else if(res.data.dayRefundOrderTotalCountCompare < 0){
                    $('#returnCompare').text('低于前日'+Math.abs(res.data.dayRefundOrderTotalCountCompare))
                }else{
                    $('#returnCompare').text('与前日持平')
                }
            }
        })
    }

    //获取店外订单走势图数据
    function getOrderTrendData(){
        var params = {
            "time": date,
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['orderTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var pay = [];
                var finish = [];
                var quit = [];
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    pay.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    finish.push(item.totalAccount)
                });
                res.data[2].forEach(function (item, index) {
                    quit.push(item.totalAccount)
                });
                echartsTrend({
                    dom:'.trend',
                    xData:xData,
                    yData:{
                        pay:pay,
                        finish:finish,
                        quit:quit
                    }
                });
            }
        })
    }

    //获取店外购物订单列表
    function getOnlineOrderList(pageNo){
        var params = {
            "backUserId": backUserId,
            "time": date,
            "shopId": shopId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var url = '/zxcity_restful/ws/cs_shopBusiness/getDayOrderDetailExportXls?backUserId='+backUserId+'&shopId='+shopId+'&time='+date;
        reqAjaxAsync(REQUIRE_URL['onlineOrderList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="11" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No <10 ? '0' + No : No;
                        if(!item.orderNo){
                            item.orderNo = '--'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.orderNo+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.constomerName+'</td>'
                        +'<td>'+item.goodsNumCount+'</td>'
                        +'<td>'+item.orderPay+'</td>'
                        +'<td>'+item.realPay+'</td>'
                        +'<td>'+item.payType+'</td>'
                        +'<td>'+item.createTime+'</td>'
                        +'<td>'+item.orderStatus+'</td>'
                        +'<td>'
                        +'<a href="JavaScript:;" data-id="'+item.orderId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.online .tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getOnlineOrderList(obj.curr)
                    });
                }
            }
            $('.exportBtn').attr('href',url)
        })
    }

    //获取店外订单详情
    function getOnlineOrderDetail(orderId){
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": 1,
                "rows": 20
            },
            "orderId": orderId
        };
        reqAjaxAsync(REQUIRE_URL['onlineOrderDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //查看店外购物订单详情
    $('.online .tableBox table').on('click','tbody td a',function () {
        var orderId = $(this).attr('data-id');
        getOnlineOrderDetail(orderId).done(function (res) {
            template.defaults.imports.moneyFormat = getMoneyFormat;
            var html = template('onlineDetailTpl',res);
            layer.open({
                type:1,
                title:'',
                shade:0.5,
                shadeClose:true,
                closeBtn:0,
                scrollbar:false,
                area:['80%','80%'],
                skin:'onlineDetail',
                content:html,
                success:function (layeror, index) {
                    $(layeror).on('click','.closeBtn',function () {
                        layer.close(index)
                    })
                }
            })
        })
    });

    ////////////////////////////////////////////////////////////

    //获取店内订单概况（支付订单，完成订单，退款订单）
    function getInShopOrderCount(){
        var params = {
            "backUserId": backUserId,
            "time": date,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['inShopOrderCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#inShopAddOrder').text(res.data.dayPayOrdertotalCount);
                $('#inShopCompleteOrder').text(res.data.dayFinishOrderTotalCount);
                if(res.data.dayPayOrdertotalCountCompare > 0){
                    $('#inShopAddOrderCompare').text('高于前日'+res.data.dayPayOrdertotalCountCompare)
                }else if(res.data.dayPayOrdertotalCountCompare < 0){
                    $('#inShopAddOrderCompare').text('低于前日'+Math.abs(res.data.dayPayOrdertotalCountCompare))
                }else{
                   $('#inShopAddOrderCompare').text('与前日持平')
                }
                if(res.data.dayFinishOrderTotalCountCompare > 0){
                    $('#inShopCompleteCompare').text('高于前日'+res.data.dayFinishOrderTotalCountCompare)
                }else if(res.data.dayFinishOrderTotalCountCompare < 0){
                    $('#inShopCompleteCompare').text('低于前日'+Math.abs(res.data.dayFinishOrderTotalCountCompare))
                }else{
                    $('#inShopCompleteCompare').text('与前日持平')
                }
            }
        })
    }

    //获取店内订单走势
    function getInShopOrderTrend(){
        var params = {
            "backUserId": backUserId,
            "time": date,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['inShopOrderTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData1.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    yData2.push(item.totalAccount)
                });
                inShopEchartsTrend({
                    dom:'.inShopTrend',
                    xData:xData,
                    yData1:yData1,
                    yData2:yData2,
                })
            }
        })
    }

    //获取店内下单订单明细
    function getInShopOrderList(pageNo){
        var params = {
            "backUserId": backUserId,
            "time": date,
            "shopId": shopId,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        //导出地址
        var url = '/zxcity_restful/ws/cs_shopBusiness/getInstoreDayOrderDetailExportXls?backUserId='+backUserId+'&shopId='+shopId+'&time='+date;
        reqAjaxAsync(REQUIRE_URL['inShopOrderList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="10" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.costomerName+'</td>'
                        +'<td>'+item.productNumCount+'</td>'
                        +'<td>'+item.orderPay+'</td>'
                        +'<td>'+item.realPay+'</td>'
                        +'<td>'+item.payType+'</td>'
                        +'<td>'+item.consumeTime+'</td>'
                        +'<td>'+item.orderStatus+'</td>'
                        +'<td>'
                        +'<a href="JavaScript:;" data-orderid="'+item.orderId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.inShop .tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getInShopOrderList(obj.curr)
                    })
                }
            }
            $('.inShopExportBtn').attr('href',url)
        })
    }

    //获取店内订单详情
    function getInShopOrderDetail(orderId){
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId,
            "orderId": orderId
        };
        reqAjaxAsync(REQUIRE_URL['inShopOrderDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取店内订单详情
    $('.inShop .tableBox table tbody').on('click','a',function () {
        var orderId = $(this).attr('data-orderid');
        getInShopOrderDetail(orderId).done(function (res) {
            template.defaults.imports.moneyFormat = getMoneyFormat;
            var html = template('inShopDetailTpl',res);
            layer.open({
                type:1,
                title:'',
                shade:0.5,
                shadeClose:true,
                closeBtn:0,
                scrollbar:false,
                area:['80%','80%'],
                skin:'inShopDetail',
                content:html,
                success:function (layeror, index) {
                    $('.detailTableBox').outerHeight($(layeror).height()-$('.top').height()-$('.orderBaseInfo').height()-20);
                    $(layeror).on('click','.closeBtn',function () {
                        layer.close(index)
                    })
                }
            })
        })
    });

    ////////////////////////////////////////////////////////////

    function init(){
        $('.date').text(date);
        $('.shopName').text(shopName);
        $('.radioBtn ul li:eq('+(type-1)+')').addClass('active').siblings().removeClass('active');
        if(type === '1'){
            $('.online').show();
            $('.inShop').hide();
            getOrderCount();
            getOrderTrendData();
            getOnlineOrderList();
        }else if(type === '2'){
            $('.online').hide();
            $('.inShop').show();
            getInShopOrderCount();
            getInShopOrderTrend();
            getInShopOrderList();
        }

    }

    //切换店外购物和店内下单
    $('.radioBtn li').click(function () {
        var index = $(this).attr('data-index');
        $(this).addClass('active').siblings().removeClass('active');
        $('.main>div:eq('+(index-1)+')').show().siblings().hide();
        if(index === '1'){
            getOrderCount();
            getOrderTrendData();
            getOnlineOrderList();
        }else if(index === '2'){
            getInShopOrderCount();
            getInShopOrderTrend();
            getInShopOrderList()


        }
    });

    //关闭当前页面
    $('.closeBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
});