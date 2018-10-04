layui.use(['form','laydate','layer'],function () {
    var form = layui.form;
    var $ = layui.$;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        shopTotal:'cs_visitor/getShopTotalRecord',//店铺收藏总数，点击数，访客数
        shopTrend:'cs_visitor/getSaleCountChart',//店铺收藏总数，点击数，访客数走势
        shopCollectionList:'cs_visitor/getShopFavouriteRecord',//店铺收藏列表
        shopBrowseList:'cs_visitor/getShopVisitRecord',//店铺浏览记录
        goodsTotal:'cs_visitor/getGoodsTotalRecord',//商品收藏总数，点击数，访客数
        goodsTrend:'cs_visitor/getGoodsCountChart',//商品收藏总数，点击数，访客数走势
        goodsCollectionList:'cs_visitor/getGoodsFavouriteRecord',//商品收藏记录
        goodsVisitList:'cs_visitor/getGoodsVisitRecord',//商品访问记录
    };
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var today = formatAllDate(new Date(),'yyyy-MM-dd');
    var yesterday = getDate(-1);
    init();
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

    //走势图
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector(obj.dom));
        // 指定图表的配置项和数据
        var option = {
            color: ['#ff606b','#64c90b','#99d3ff'],
            title: {
                text:obj.title,
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
                data: obj.legend,
                // data: ['新增收藏店铺数','新增访客数','新增点击数'],
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
                //data: ['07-29','07-30','07-31','08-01','08-02','08-03','08-04']

            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    color: '#666'
                },
                name: '人数',
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#666',
                    padding: [0, 0, 35, 0]
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
                left: '80px',
                right: '30px',
                bottom: '10%',
                top: '14%'
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
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
                    getData()
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
                    getData()
                },0)
            }
        })
    }

    //获取前几天后几天的日期
    function getDate(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+(m<10?"0"+m:m)+"-"+(d<10?"0"+d:d);
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

    //获取店铺收藏总数，访客数，点击数
    function getShopTotal(){
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime =$('#day').val() || today
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
        reqAjaxAsync(REQUIRE_URL['shopTotal'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#shopTotal').text(res.data.totalShopFavouriteNum);
                $('#shopVisitCount').text(res.data.totalShopVisitorNum);
                $('#shopClickCount').text(res.data.totalShopClickNum);
                if(type !== '2'){
                    $('#addShopTotal').text('+'+res.data.newShopFavouriteNum);
                    $('#addShopVisitCount').text('+'+res.data.newShopVisitorNum);
                    $('#addShopClickCount').text('+'+res.data.newShopClickNum);
                }else{
                    $('#addShopTotal').text('--');
                    $('#addShopVisitCount').text('--');
                    $('#addShopClickCount').text('--');
                }
            }
        })
    }

    //获取店铺收藏总数，访客数，点击数走势
    function getShopTrend(){
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var title = '';
        if(type === '1'){
            startTime = endTime =$('#day').val() || today;
            title = '最近7日新增走势'
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
            title = $('#dateRange').val()+'新增走势'
        }else{
            title = '最近30日新增走势'
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['shopTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                var yData3 = [];
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData1.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    yData2.push(item.totalAccount)
                });
                res.data[2].forEach(function (item, index) {
                    yData3.push(item.totalAccount)
                });
                echartsTrend({
                    dom:'#shopTrend',
                    title:title,
                    legend:['新增收藏店铺数','新增访客数','新增点击数'],
                    xData:xData,
                    yData:[
                        {
                            name: '新增收藏店铺数',
                            type: 'line',
                            smooth: true,
                            data: yData1,
                        },
                        {
                            name: '新增访客数',
                            type: 'line',
                            smooth: true,
                            data: yData2,
                        },
                        {
                            name: '新增点击数',
                            type: 'line',
                            smooth: true,
                            data: yData3,
                        },
                    ]
                });
            }
        })
    }

    //获取店铺收藏列表和浏览列表
    function getCBList(pageNo){
        var url = '';// 列表请求地址
        var exportUrl ='';// 导出地址
        var indexType = $('.shop .tab .active').attr('data-index');
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime =$('#day').val() || today
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        if(indexType === '1'){
            url = REQUIRE_URL['shopCollectionList'];
            exportUrl = '/zxcity_restful/ws/cs_visitor/getShopFavouriteExportXls?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime;
        }else if(indexType === '2'){
            url = REQUIRE_URL['shopBrowseList'];
            exportUrl = '/zxcity_restful/ws/cs_visitor/getShopVisitExportXls?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime;
        }
        var showList = {
            "1":function (res) {
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.userName+'</td>'
                        // +'<td>游客</td>'
                        +'<td>'+item.userPhone+'</td>'
                        +'<td>'+item.source+'</td>'
                        +'<td>'+item.createTime+'</td>'
                        +'</tr>'
                    })
                }
                $('.shopCollection tbody').html(html);
            },
            '2':function (res) {
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            +'<td>'+No+'</td>'
                            +'<td>'+item.shopName+'</td>'
                            +'<td>'+item.userName+'</td>'
                            // +'<td>游客</td>'
                            +'<td>'+item.userPhone+'</td>'
                            +'<td>'+item.source+'</td>'
                            +'<td>'+item.createTime+'</td>'
                            +'</tr>'
                    })
                }
                $('.shopBrowse tbody').html(html);
            }
        };
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
            },
        };
        reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time :1500})
            }else{
                showList[indexType](res);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj,first) {
                        getCBList(obj.curr)
                    });
                }
            }
            $('#shopExportBtn').attr('href',exportUrl)
        })
    }

    //获取商品收藏总数，点击数，访客数
    function getGoodsTotal(){
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime =$('#day').val() || today
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
        reqAjaxAsync(REQUIRE_URL['goodsTotal'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#goodsCollection').text(res.data.totalGoodsFavouriteNum);
                $('#goodsVisit').text(res.data.totalGoodsVisitorNum);
                $('#goodsClick').text(res.data.totalGoodsClickNum);
                if(type !== '2'){
                    $('#addGoodsCollection').text('+'+res.data.newGoodsFavouriteNum);
                    $('#addGoodsVisit').text('+'+res.data.newGoodsVisitorNum);
                    $('#addGoodsClick').text('+'+res.data.newGoodsClickNum);
                }else{
                    $('#addGoodsCollection').text('--');
                    $('#addGoodsVisit').text('--');
                    $('#addGoodsClick').text('--');
                }
            }
        })
    }

    //获取商品收藏总数，点击数，访客数走势
    function getGoodsTrend(){
        var title = '';
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime =$('#day').val() || today;
            title = '最近7日新增走势'
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
            title = $('#dateRange').val()+'新增走势'
        }else{
            title = '最近30日新增走势'
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['goodsTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !==1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                var yData3 = [];
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData1.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    yData2.push(item.totalAccount)
                });
                res.data[2].forEach(function (item, index) {
                    yData3.push(item.totalAccount)
                });
                echartsTrend({
                    dom:'#goodsTrend',
                    title:title,
                    legend:['新增收藏商品数','新增访客数','新增点击数'],
                    xData:xData,
                    yData:[
                        {
                            name: '新增收藏商品数',
                            type: 'line',
                            smooth: true,
                            data: yData1,
                        },
                        {
                            name: '新增访客数',
                            type: 'line',
                            smooth: true,
                            data: yData2,
                        },
                        {
                            name: '新增点击数',
                            type: 'line',
                            smooth: true,
                            data: yData3,
                        },
                    ]
                })
            }
        })
    }

    //获取商品收藏和访问记录
    function getCVList(pageNo){
        var url = '';
        var exportUrl ='';// 导出地址
        var goodsName = $('#keyWord').val().trim();
        var indexType = $('.goods .tab .active').attr('data-index');
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime =$('#day').val() || today
        }else if(type === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        if(indexType === '1'){
            url = REQUIRE_URL['goodsCollectionList'];
            exportUrl = '/zxcity_restful/ws/cs_visitor/getGoodsFavouriteExportXls?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime+'&goodsName='+goodsName;
        }else if(indexType === '2'){
            url = REQUIRE_URL['goodsVisitList'];
            exportUrl = '/zxcity_restful/ws/cs_visitor/getGoodsVisitExportXls?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime+'&goodsName='+goodsName;
        }
        var showList = {
            "1":function (res) {
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.userName+'</td>'
                        // +'<td>游客</td>'
                        +'<td>'+item.userPhone+'</td>'
                        +'<td>'+item.source+'</td>'
                        +'<td>'+item.createTime+'</td>'
                        +'</tr>'
                    })
                }
                $('.goodsCollection tbody').html(html);
            },
            '2':function (res) {
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.userName+'</td>'
                        // +'<td>游客</td>'
                        +'<td>'+item.userPhone+'</td>'
                        +'<td>'+item.source+'</td>'
                        +'<td>'+item.createTime+'</td>'
                        +'</tr>'
                    })
                }
                $('.goodsBrowse tbody').html(html);
            }
        };
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "goodsName":goodsName,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo || 1,
                "rows": pageSize
            },
        };
        reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
            if(res.code !==1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                showList[indexType](res);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getCVList(obj.curr)
                    })
                }
            }
            $('#goodsExportBtn').attr('href',exportUrl)
        })
    }

    //切换时间（日报，全部，自定义）
    $('.timeTab').on('click','ul li',function () {
        var navType = $(this).attr('data-navType');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.timeSelector').find('div:eq('+(navType-1)+')').show().siblings('div').hide();
        getData()

    });

    //切换店铺和商品访问
    $('.typeChange ul').on('click','li',function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings().removeClass('active');
        if(type === '1'){
            $('.mainContent .shop').show();
            $('.mainContent .goods').hide();
            $('.shop .tab a:eq(0)').addClass('active').siblings().removeClass('active');
            $('.shop .tableBox table:eq(0)').show().siblings().hide();
        }else if(type === '2'){
            $('.mainContent .shop').hide();
            $('.mainContent .goods').show();
            $('.goods .tab a:eq(0)').addClass('active').siblings().removeClass('active');
            $('.goods .tableBox table:eq(0)').show().siblings().hide();
        }
        getData()
    });

    //切换店铺收藏和店铺浏览
    $('.shop .tab').on('click','a',function () {
        var index = $(this).attr('data-index');
        $(this).addClass('active').siblings().removeClass('active');
        $('.shop .tableBox table:eq('+(index-1)+')').show().siblings().hide();
        //获取店铺收藏列表和浏览列表
        getCBList()
    });

    //切换商品收藏和店铺浏览
    $('.goods .tab').on('click','a',function () {
        var index = $(this).attr('data-index');
        $(this).addClass('active').siblings().removeClass('active');
        $('.goods .tableBox table:eq('+(index-1)+')').show().siblings().hide();
        //获取商品收藏和访问记录
        getCVList()
    });

    //切换店铺
    form.on('select(shopSelector)',function () {
        $('.shopName').text($('#shopSelector :selected').text());
        getData()
    });

    //搜索商品记录
    $('#searchBtn').click(function () {
        getCVList()
    });

    //获取店铺相关数据还是获取商品相关数据
    function getData(){
        var changeType = $('.typeChange .active').attr('data-type');
        if(changeType === '1'){
            //店铺相关数据
            //获取店铺收藏总数，访客数，点击数
            getShopTotal();
            //获取店铺收藏总数，访客数，点击数走势
            getShopTrend();
            //获取店铺收藏列表和浏览列表
            getCBList()
        }else if(changeType === '2'){
            //商品相关数据
            //获取商品收藏总数，点击数，访客数
            getGoodsTotal();
            //获取商品收藏总数，点击数，访客数走势
            getGoodsTrend();
            //获取商品收藏和访问记录
            getCVList()
        }
    }

    //初始化页面
    function init(){
        initDate();
        getShopList().done(function () {
            form.render('select');
            $('.shopName').text($('#shopSelector :selected').text());
            getData()
        })
    }
});