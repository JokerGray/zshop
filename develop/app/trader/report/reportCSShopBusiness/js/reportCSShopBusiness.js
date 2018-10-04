layui.use(['form', 'layer', 'laydate'], function () {
    var $ = layui.$,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        threeCount:'cs_shopBusiness/getSaleCountAndPayCount',//查询销售额，销量，订单数
        salesTrend:'cs_shopBusiness/getSaleCountChart',//销售额走势
        salesCountTrend:'cs_shopBusiness/getProductNumCountChart',//销量走势
        payCountTrend:'cs_shopBusiness/getPayOrderCountChart',//支付订单走势
        dailySurvey:'cs_shopBusiness/getDailySurvey',//每日概况
        inShopTotalCount:'cs_shopBusiness/getInstoreSaleCountAndPayCount',//店内销量，完成订单数
        inShopSalesTrend:'cs_shopBusiness/getInstoreProductNumCountChart',//店内销量走势
        inShopFinishTrend:'cs_shopBusiness/getInstoreFinishOrderCountChart',//店内完成订单走势
        inShopDailySurvey:'cs_shopBusiness/getInstoreDailySurvey',//店内每日概况
    };
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var today = formatAllDate(new Date(),'yyyy-MM-dd');
    var yesterday = getDate(-1);
    init();

    //echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector(obj.dom));
        // 指定图表的配置项和数据
        var option = {
            color: obj.color,
            title: {
                text: obj.title,
                textStyle: {
                    color: '#333',
                    fontWeight: 'normal',
                    fontSize: '15'
                },
                left: 20,
                top: 6
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: obj.legendData,
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
                name: obj.yName,
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
            series: obj.yData,
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

    //初始化时间选择
    function initDate(){
        laydate.render({
            elem: '#day',
            type:'date',
            value:new Date(),
            isInitValue:true,
            max:0,
            btns:['now', 'confirm'],
            done:function () {
                setTimeout(function () {
                    refreshData()
                },0)
            }
        });
        var ins = laydate.render({
            elem: '#dateRange',
            type:'date',
            value:yesterday+' ~ '+today,
            isInitValue:true,
            max:0,
            range:'~',
            btns:['now', 'confirm'],
            change: function(value, date, endDate){
                var st = value.split('~')[0].trim();
                var et = value.split('~')[1].trim();
                var between = daysBetween(st,et);
                if(between === 0){
                    ins.hint('起始时间不能为同一天');
                    setTimeout(function () {
                        $('.laydate-btns-confirm').addClass('laydate-disabled')
                    },0)

                }else if(between > 30){
                    ins.hint('起始时间间隔不能大于30天');
                    setTimeout(function () {
                        $('.laydate-btns-confirm').addClass('laydate-disabled')
                    },0)
                }
            },
            done:function () {
                setTimeout(function () {
                    refreshData()
                },0)
            }
        })
    }

    //获取店铺列表
    function getShopList() {
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId
        };
        reqAjaxAsync(REQUIRE_URL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                if(res.data.flag){
                    html = '<option value="">全部店铺</option>'
                }
                res.data.shopList.forEach(function (item, index) {
                    html += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
                });
                $('#shopSelector').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    ////////店///////////外//////////购//////////物/////////////////////////////

    //获取销售额，销量，支付订单数
    function getThreeCount(){
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['threeCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                //销售总额（元）
                $('#totalSales').text(getMoneyFormat(res.data.saleCount));
                //销量
                $('#salesCount').text(res.data.productNumCount);
                //支付订单数
                $('#payCount').text(res.data.payOrderCount);
                if(type !== '2'){
                    //平均日销售额（元）
                    $('#averageSales').text(getMoneyFormat(res.data.avgSaleCount));
                    // 平均日销量
                    $('#averageSalesCount').text(res.data.avgProductNumCount);
                    //平均日订单数
                    $('#averagePayCount').text(res.data.avgPayOrderCount);
                }else{
                    //平均日销售额（元）
                    $('#averageSales').text('----');
                    // 平均日销量
                    $('#averageSalesCount').text('----');
                    //平均日订单数
                    $('#averagePayCount').text('----');
                }
            }
        })
    }

    //获取销售额，销量，支付订单数走势
    function getTrendData(){
        var trendType = $('.Overview .active').attr('data-type');
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || '';
        var titleText = '（近30日）';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today;
            titleText = '（近7日）'
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
            titleText = '（'+$('#dateRange').val()+'）'
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        var urlArr = ['salesTrend','salesCountTrend','payCountTrend'];
        reqAjaxAsync(REQUIRE_URL[urlArr[trendType]],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData = [];
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData.push(item.totalAccount)
                });
                if(trendType === '0'){
                    echartsTrend({
                        dom: '.saleMoney',
                        color: ['#1e9fff'],
                        title: '店铺销售额走势'+titleText,
                        legendData: ['销售额'],
                        xData: xData,
                        yName: '销售额（元）',
                        yData: [
                            {
                                name: '销售额',
                                type: 'line',
                                smooth:true,
                                data: yData,
                            },
                        ],
                    });
                }else if(trendType === '1'){
                    echartsTrend({
                        dom: '.saleNum',
                        color: ['#fca259'],
                        title: '店铺销量走势'+titleText,
                        legendData: ['销量'],
                        xData: xData,
                        yName: '销量（件）',
                        yData: [
                            {
                                name: '销量',
                                type: 'line',
                                smooth:true,
                                data: yData,
                            },
                        ],
                    });
                }else if(trendType === '2'){
                    echartsTrend({
                        dom: '.payNum',
                        color: ['#ff6636'],
                        title: '店铺订单数走势'+titleText,
                        legendData: ['订单数'],
                        xData: xData,
                        yName: '订单数',
                        yData: [
                            {
                                name: '订单数',
                                type: 'line',
                                smooth:true,
                                data: yData,
                            },
                        ],
                    });
                }
            }
        });
    }

    //获取每日概况
    function getDailySurvey(pageNo){
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var url = '/zxcity_restful/ws/cs_shopBusiness/getDailySurveyExportXls?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime;
        reqAjaxAsync(REQUIRE_URL['dailySurvey'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="6" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.time+'</td>'
                        +'<td>'+item.payOrderNumTotalAccount+'</td>'
                        +'<td>'+item.productNumTotalAccount+'</td>'
                        +'<td>'+getMoneyFormat(item.saleNumTotalAccount)+'</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-time="'+item.time+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getDailySurvey(obj.curr)
                    });
                }
            }
            $('.exportBtn').attr('href',url)
        })
    }

    //切换店外购物走势图
    $('.online').on('click','li',function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.treads .online').find('>div:eq('+type+')').show().siblings().hide();
        getTrendData()
    });

    ////////店///////////内//////////购//////////物/////////////////////////////

    //获取店内销量和店内完成订单数
    function getInShopTotalCount(){
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['inShopTotalCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#inShopSales').text(res.data.productNumCount);
                $('#inShopFinishOrder').text(res.data.finishOrderCount);
                if(type !== '2'){
                   $('#inShopAverageSales') .text(res.data.avgProductNumCount);
                   $('#inShopAverageOrder') .text(res.data.avgFinishOrderCount);
                }else{
                    $('#inShopAverageSales') .text('----');
                    $('#inShopAverageOrder') .text('----');
                }
            }
        })
    }

    //获取店内销量走势和完成订单走势
    function getInShopTrend(){
        var titleTime = '(30日内)';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today;
            titleTime = '(7日内)'
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
            titleTime = '('+$('#dateRange').val()+')'
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId
        };
        var navType= $('.Overview .inShop .active').attr('data-type');
        var requireUrl = '';
        if(navType === '0'){
            requireUrl = REQUIRE_URL['inShopSalesTrend']
        }else{
            requireUrl = REQUIRE_URL['inShopFinishTrend']
        }
        reqAjaxAsync(requireUrl,JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData = [];
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData.push(item.totalAccount)
                });
                if(navType === '0'){
                    echartsTrend({
                        dom: '.inShopSaleNum',
                        color: ['#fca259'],
                        title: '店铺销量走势'+titleTime,
                        legendData: ['销量'],
                        xData: xData,
                        yName: '销量（件）',
                        yData: [
                            {
                                name: '销量',
                                type: 'line',
                                smooth:true,
                                data: yData,
                            },
                        ],
                    });
                }else if(navType === '1'){
                    echartsTrend({
                        dom: '.inShopSettlementNum',
                        color: ['#ff6636'],
                        title: '店铺已结算订单走势'+titleTime,
                        legendData: ['订单数'],
                        xData: xData,
                        yName: '订单数',
                        yData: [
                            {
                                name: '订单数',
                                type: 'line',
                                smooth:true,
                                data: yData,
                            },
                        ],
                    });
                }

            }
        })
    }

    //获取店内每日概况
    function getInShopDailySurvey(pageNo){
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
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
        var url = '/zxcity_restful/ws/cs_shopBusiness/getInstoreDailySurveyExportXls?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime;
        reqAjaxAsync(REQUIRE_URL['inShopDailySurvey'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="6" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html +='<tr>'
                            +'<td>'+No+'</td>'
                            +'<td>'+item.time+'</td>'
                            +'<td>'+item.payOrderNumTotalAccount+'</td>'
                            +'<td>'+item.productNumTotalAccount+'</td>'
                            +'<td>'+getMoneyFormat(item.saleNumTotalAccount)+'</td>'
                            +'<td>'
                            +'<a href="javascript:;" data-time="'+item.time+'">查看详情</a>'
                            +'</td>'
                            +'</tr>'
                    })
                }
                $('.tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getInShopDailySurvey(obj.curr)
                    })
                }
            }
            $('.exportBtn').attr('href',url)
        })
    }

    //切换店内下单走势图
    $('.inShop').on('click','li',function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.treads .inShop').find('>div:eq('+type+')').show().siblings().hide();
        getInShopTrend()
    });

    //获取前几天后几天的日期
    function getDate(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+(m<10?"0"+m:m)+"-"+(d<10?"0"+d:d);
    }

    //切换时间（日报，全部，自定义）
    $('.timeTab').on('click','ul li',function () {
        var navType = $(this).attr('data-navType');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.timeSelector').find('div:eq('+(navType-1)+')').show().siblings('div').hide();
        refreshData()
    });

    //切换店外购物和店内下单
    $('.radioBtn li').on('click',function () {
        var index = $(this).attr('data-index');
        $(this).addClass('active').siblings().removeClass('active');
        if(index === '1'){
            $('.online').show();
            $('.inShop').hide()
        }else if(index === '2'){
            $('.online').hide();
            $('.inShop').show();
        }
        refreshData()
    });

    //切换店铺
    form.on('select(shopSelector)',function () {
        $('.shopName').text($('#shopSelector :selected').text());
        refreshData()
    });

    //查看每日订单详情
    $('.tableBox').on('click','table tbody a',function () {
        var shopId = $('#shopSelector').val() || '';
        var shopName = $('#shopSelector :selected').text();
        var date = $(this).attr('data-time');
        var type = $('.radioBtn .active').attr('data-index');
        layer.open({
            type:2,
            area:['100%','100%'],
            title:'',
            closeBtn:0,
            scrollbar:false,
            content:['/trader/report/reportCSShopBusiness/html/dayOrderDetail.html?backUserId='+backUserId+'&shopId='+shopId+'&shopName='+shopName+'&date='+date+'&type='+type+'&'+Math.random()],
            success:function(){
                //让父页面滚动条消失
                // $('body').height($(window).height()).css('overflow','hidden');
            },
            end:function () {
                //回复父页面滚动条
                // $('body').height('100%').css('overflow','visible')
            }
        })
    });

    //更新店外购物和店内下单数据
    function refreshData(){
        var index = $('.radioBtn .active').attr('data-index');
        if(index === '1'){
            //获取三大销售额，销量，支付订单函数
            getThreeCount();
            //获取三大走势
            getTrendData();
            //获取每日概况
            getDailySurvey();
        }else if(index === '2'){
            //店内销量和店内完成订单数
            getInShopTotalCount();
            //获取店内销量走势和完成订单走势
            getInShopTrend();
            //获取店内每日概况
            getInShopDailySurvey()
        }
    }

    //初始化页面
    function init(){
        $('.mask').height($(window).height());
        initDate();
        getShopList().done(function () {
            form.render('select');
            $('.shopName').text($('#shopSelector :selected').text());
            refreshData()
        });

    }
});