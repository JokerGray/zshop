$(function () {
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var today = formatAllDate(new Date(), 'yyyy-MM-dd');
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        timeMoney: 'cs_dayBusiness/getDailyPaymentAmountInfo',//某天每小时营业额情况
        cateData:'cs_dayBusiness/getMerchantDailyDataInformation',//各分类数据统计
        visitInfo:'cs_dayBusiness/getMerchantAndGoodsVisitInfo',//访客，收藏数据
        payInfo:'cs_dayBusiness/getMerchantAndGoodsPayInfo',//访客，支付数据
    };
    var topTenCollection = [];//商品收藏前十
    var topTenVisit = [];//商品访问前十
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

    //折线图
    function lineTrend(obj) {
        var myChart = echarts.init(document.getElementById('lineTrend'));
        var option = {
            color: ['#1e9fff', '#cccccc'],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                splitNumber:1,
                boundaryGap: false,
                data: obj.timeArr,//['0','6','12','18','23']
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick:{
                    show:false
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false,
                }
            },
            series: obj.dataArr,
            //     [
            //     {
            //         name:'今日',
            //         type:'line',
            //         data:[0,5, 8],
            //     },
            //     {
            //         name:'前一日',
            //         type:'line',
            //         data:[0, 4, 6, 5,2],
            //     }
            // ],
            grid: {
                borderWidth: 1,
                left: '40px',
                right: '20px',
                bottom: '15%',
                top: '14%'
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //转换率图
    function conversionRate(obj) {
        var myChart = echarts.init(document.getElementById(obj.domId));
        var option = {
            series: [{
                name: '',
                type: 'gauge',
                center: ['50%', '50%'], // 默认全局居中
                radius: '100%',
                axisLine: {
                    show: false,
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [obj.point, '#0193cf'],
                            [1, '#ddd']
                        ],
                        width: 4
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: false,
                    length: '0',
                    width: '0'
                },
                detail: {
                    formatter: '{value}%',
                    color: '#333',
                    fontSize: 40,
                    offsetCenter: [0, 0]
                },
                data: obj.data,
                title: {
                    show: true,
                    offsetCenter: [0, 0],
                    textStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: 14,
                    }
                },
                animation: true
            }],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //时间初始化
    function initDate() {
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            laydate.render({
                elem: '#day',
                max: 0,
                isInitValue: true,
                value: new Date(),
                btns: ['now', 'confirm'],
                done: function (value, date, endDate) {
                    $('.timeText').text(value + '概况');
                    $('.nowTime').text(value);
                    setTimeout(function () {
                        //获取某天，每小时营业额概况
                        timeTurnover();
                        //获取某天各分类数据统计
                        getAllCateData();
                        //获取访客-收藏数据
                        getVisitInfo();
                        //获取访客-支付数据
                        getPayInfo();
                    },0)
                }
            })
        })
    }

    //获取某天，每小时营业额概况
    function timeTurnover() {
        var shopId = $('#shopSelector').val() || '';
        var dayTime = $('#day').val() || today;
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "dayTime": dayTime
        };
        reqAjaxAsync(REQUIRE_URL['timeMoney'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var nowHour = dayTime === today ? formatAllDate(new Date(), 'hh') : 23;
                var timeArr = [];//每天每小时时间点
                var lastMoneyArr = [];//昨天每小时营业额
                //var nowTimeArr = [];//今日每小时时间点
                var nowMoneyArr = [];//今日每小时营业额
                if (res.data.lastDailyPayAmountByHour && res.data.lastDailyPayAmountByHour.length > 0) {
                    //获取昨天相应时间点的营业额
                    res.data.lastDailyPayAmountByHour.forEach(function (item, index) {
                        lastMoneyArr[item.dayHour] = item.paymentAmount
                    });
                }
                if (res.data.nowDailyPayAmountByHour && res.data.nowDailyPayAmountByHour.length > 0) {
                    //获取今日相应时间点营业额
                    res.data.nowDailyPayAmountByHour.forEach(function (item, index) {
                        nowMoneyArr[item.dayHour] = item.paymentAmount
                    });
                }
                //昨天相应时间点没有营业额的补0显示
                for (var i = 0; i <= 23; i++) {
                    timeArr.push(i+'时');
                    if (!lastMoneyArr[i]) {
                        lastMoneyArr[i] = 0
                    }
                }
                //今日到目前时间点没有营业额的补0 显示
                for (var j = 0; j <= nowHour; j++) {
                    // nowTimeArr.push(j);
                    if (!nowMoneyArr[j]) {
                        nowMoneyArr[j] = 0
                    }
                }
                var dataArr = [
                    {
                        name: dayTime,
                        type: 'line',
                        smooth:true,
                        data: nowMoneyArr,
                    },
                    {
                        name: '前一日',
                        type: 'line',
                        smooth:true,
                        data: lastMoneyArr,
                    }
                ];
                $('#nowMoney').text(res.data.nowDayPaymentAmount);
                $('#lastMoney').text('前一日 '+res.data.lastDayPaymentAmount);
                lineTrend({
                    timeArr:timeArr,
                    dataArr:dataArr
                })
            }
        })
    }

    //获取某天各分类数据统计
    function getAllCateData(){
        var shopId = $('#shopSelector').val() || '';
        var dayTime = $('#day').val() || today;
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "dayTime": dayTime
        };
        reqAjaxAsync(REQUIRE_URL['cateData'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = template('allCateDataTpl',res.data);
                $('.payMoney-right').html(html)
            }
        })
    }

    //获取访客-收藏数据
    function getVisitInfo(){
        var shopId = $('#shopSelector').val() || '';
        var dayTime = $('#day').val() || today;
        var params = {
            "backUserId": backUserId,
            "dayTime": dayTime,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['visitInfo'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var type = $('.toCollection>.topTen>p:eq(0)>.active').attr('data-type');
                var data = res.data;
                var nowConversionRate = (data.nowDayNumberOfGoodsHead/data.nowDayNumberOfVisitors*100).toFixed(2);
                var lastConversionRate = (data.lastDayNumberOfGoodsHead/data.lastDayNumberOfVisitors*100).toFixed(2);
                var differenceText = '';
                if(isNaN(nowConversionRate)){
                    nowConversionRate = 0
                }
                if(isNaN(lastConversionRate)){
                    lastConversionRate = 0
                }
                var difference = nowConversionRate - lastConversionRate;
                if(difference > 0){
                    differenceText = '高于前一日' + difference +'%'
                }else if(difference < 0){
                    differenceText = '低于前一日' + Math.abs(difference) + '%'
                }else{
                    differenceText = '与前一日持平'
                }
                conversionRate({
                    domId: 'echart-toCollection',
                    data: [{
                        name: '访客-收藏转换率\n\n\n\n\n' + differenceText,
                        value: nowConversionRate,
                    }],
                    point: nowConversionRate/100
                });
                var html = '<li>'
                +'<p>收藏人数</p>'
                +'<p>'+data.nowDayNumberOfGoodsHead+'</p>'
                +'</li>'
                +'<li>'
                +'<p>收藏次数</p>'
                +'<p>'+data.nowDayNumberOfGoodsFav+'</p>'
                +'</li>';
                $('#collectionNum ul').html(html);
                if(type === '1'){
                    //当前为访客前十，显示访客前十的商品数据
                    $('.toCollection .goodsTopTen').html(topTenTpl(data.goodsVisitorsTopTenList));
                }else if(type === '2'){
                    // 当前为收藏前十，显示收藏前十的数据
                    $('.toCollection .goodsTopTen').html(topTenTpl(data.goodsFavTopTenList));
                }
                topTenCollection = data.goodsFavTopTenList;
                topTenVisit = data.goodsVisitorsTopTenList
            }
        })
    }

    //获取访客-支付数据
    function getPayInfo(){
        var shopId = $('#shopSelector').val() || '';
        var dayTime = $('#day').val() || today;
        var params = {
            "backUserId": backUserId,
            "dayTime": dayTime,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['payInfo'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var data = res.data;
                var nowPayConversionRate = (data.nowDayNumberOfTrans/data.nowDayNumberOfVisitors*100).toFixed(2);
                var lastPayConversionRate = (data.lastDayNumberOfTrans/data.lastDayNumberOfVisitors*100).toFixed(2);
                if(isNaN(nowPayConversionRate)){
                    nowPayConversionRate = 0.00
                }
                if(isNaN(lastPayConversionRate)){
                    lastPayConversionRate = 0.00
                }
                var different = (nowPayConversionRate - lastPayConversionRate).toFixed(2);
                var difText = '';
                if(different >  0 ){
                    difText = '高于前一日' + different + '%'
                }else if(different < 0){
                    difText = '低于前一日' + Math.abs(different) + '%'
                }else{
                    difText = '与前一日持平'
                }
                conversionRate({
                    domId: 'echart-toPay',
                    data: [{
                        name: '访客-购买转换率\n\n\n\n\n' + difText,
                        value: nowPayConversionRate,
                    }],
                    point: nowPayConversionRate/100
                });
                var html = '<li>'
                +'<p>购买买家数</p>'
                +'<p>'+data.nowDayNumberOfTrans+'</p>'
                +'</li>'
                +'<li>'
                +'<p>购买件数</p>'
                +'<p>'+data.nowDayNumberOfPackages+'</p>'
                +'</li>';
                $('#payNum').html(html);
                $('.payTopTen').html(topTenTpl(data.numberOfPackagesList || []))
            }
        })
    }

    //前十列表数据渲染模板
    function topTenTpl(data){
        var html = '';
        if(data.length ===0){
            html = '<li class="noDataTips"><i></i><i>暂无数据</i></li>'
        }else {
            var num = '';
            data.forEach(function (item, index) {
                if(item.visitNum){
                    num = item.visitNum
                }
                if(item.favNum){
                    num = item.favNum
                }
                if(item.dealNum){
                    num = item.dealNum
                }
                html+='<li class="clearfix"><span title="'+item.goodsName+'">'+item.goodsName+'</span><span>'+num+'</span></li>'
            })
        }
        return html
    }

    layui.use('form', function () {
        var form = layui.form;
        //初始化时间选择器
        initDate();
        //获取店铺
        getShopList().done(function () {
            form.render('select');
            $('.timeText').text(today + ' 概况');
            $('.nowTime').text(today);
            $('.shopName').text($('#shopSelector :selected').text());
            //获取折线图数据
            timeTurnover();
            //获取某天各分类数据统计
            getAllCateData();
            //获取访客-收藏数据
            getVisitInfo();
            //获取访客-支付数据
            getPayInfo();
        });
        //切换店铺
        form.on('select(shopSelector)',function () {
            $('.shopName').text($('#shopSelector :selected').text());
            //获取折线图数据
            timeTurnover();
            //获取某天各分类数据统计
            getAllCateData();
            //获取访客-收藏数据
            getVisitInfo();
            //获取访客-支付数据
            getPayInfo();
        });

        //切换访客前十和收藏前十
        $('.toCollection>.topTen>p:eq(0)>span').on('click',function () {
            var type = $(this).attr('data-type');
            $(this).addClass('active').siblings('span').removeClass('active');
            if(type === '1'){
                $('.toCollection .goodsTopTen').html(topTenTpl(topTenVisit));
                $('#topTenText').text('访客数')
            }else if(type === '2'){
                $('.toCollection .goodsTopTen').html(topTenTpl(topTenCollection));
                $('#topTenText').text('收藏数')
            }
        })
    })
});