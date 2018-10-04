layui.use(['form', 'layer', 'laydate'],function () {
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');
    var $ = layui.$,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        topTen:'cs_goodsSale/serchGoodSale',//销售额前十，销量前十，退货额前十
        goodsReport:'cs_goodsSale/serchGoodDetail',//商品统计明细
        searchGoodsName:'cs_goodsSale/serchGoodName',//搜索商品名称
        inShopTotalCount:'cs_goodsSale/SerchInshopNum',//店内商品概况
        inShopSalesTrend:'cs_goodsSale/SerchInshopSpot',//店内各类型商品销售走势
        inShopDetailList:'cs_goodsSale/SerchInshopDetail',//店内商品，服务卡，套餐，套盒明细
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

    //更新店外购物和店内下单数据
    function refreshData(){
        var index = $('.radioBox .active').attr('data-index');
        if(index === '1'){
            //获取销售额前十，销量前十，退货额前十
            getTopTen();
            //获取商品统计明细
            getGoodsReportList();
        }else if(index === '2'){
            getInShopTotalNum();
            getInShopSalesTrend();
            getDetailList()

        }
    }

    //切换店外购物和店内下单
    $('.radioBox').on('click','li',function () {
        var index = $(this).attr('data-index');
        $(this).addClass('active').siblings().removeClass('active');
        if(index === '1'){
            $('.online').show();
            $('.inShop').hide();
            $('.online .topTen .tabNav').find('a:eq(0)').addClass('active').siblings().removeClass('active');
            $('.online .topTableBox').find('table:eq(0)').show().siblings().hide()
        }else if(index === '2'){
            $('.online').hide();
            $('.inShop').show();
            $('.inShop .mainReport .tabNavBox').find('a:eq(0)').addClass('active').siblings().removeClass('active');
            $('.inShop .tableContent ').find('table:eq(0)').show().siblings().hide()
        }
        refreshData()
    });

    //切换时间（日报，全部，自定义）
    $('.timeTab').on('click','ul li',function () {
        var navType = $(this).attr('data-navType');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.timeSelector').find('div:eq('+(navType-1)+')').show().siblings('div').hide();
        refreshData()
    });

    //切换店铺
    form.on('select(shopSelector)',function () {
        $('.shopName').text($('#shopSelector :selected').text());
        refreshData()
    });

    //初始化页面
    function init(){
        initDate();
        getShopList().done(function () {
            //更新店铺选择框
            form.render('select');
            $('.shopName').text($('#shopSelector :selected').text());
            refreshData()
        })
    }

    ////////////店///////////////////外//////////////购/////////////////物////////////

    //获取销售额前十，销量前十，退货额前十
    function getTopTen(){
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        var type = $('.tabNav .active').attr('data-toptype');
        if(status === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "status": status,//1 日  2 全部 3.自定义
            "startTime": startTime,//开会时间
            "endTime": endTime,//结束时间
            "type": type//1  销售额前十   2 销量前十 3 退货前十
        };
        var objList = {
            tpl:'<tr><td colspan="5" style="text-align: center">暂无相关数据</td></tr>',
            '1':function (data) {
               var html = '';
               if(data.length === 0){
                   html = this.tpl
               }else{
                   data.forEach(function (item, index) {
                       if(type ==='1'){
                           html +='<tr>'
                               +'<td>'+(index+1)+'</td>'
                               +'<td>'+item.goodsName+'</td>'
                               +'<td>'+getMoneyFormat(item.money)+'</td>'
                               +'<td>'+(item.Raio*100).toFixed(2)+'%</td>'
                               +'<td>'
                               +'<a href="javascript:;" data-id="'+item.goodsId+'">查看详情</a>'
                               +'</td>'
                               +'</tr>'
                       }
                   })
               }
               $('.online .sales tbody').html(html)
           },
            '2':function (data) {
                var html = '';
                if(data.length === 0){
                    html = this.tpl
                }else{
                    data.forEach(function (item, index) {
                        html +='<tr>'
                        +'<td>'+(index+1)+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.goodsNum+'</td>'
                        +'<td>'+(item.Raio*100).toFixed(2)+'%</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-id="'+item.goodsId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.online .salesVolume tbody').html(html)
            },
            '3':function (data) {
                var html = '';
                if(data.length === 0){
                    html = this.tpl
                }else{
                    data.forEach(function (item, index) {
                        html +='<tr>'
                        +'<td>'+(index+1)+'</td>'
                        +'<td>'+item.goodName+'</td>'
                        +'<td>'+item.goodsNum+'</td>'
                        +'<td>'+(item.Raio*100).toFixed(2)+'%</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-id="'+item.goodsId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.online .returnGoods tbody').html(html)
            }
        };
        reqAjaxAsync(REQUIRE_URL['topTen'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                objList[type](res.data)
            }
        })
    }

    //获取商品统计明细
    function getGoodsReportList(pageNo){
        var goodsId = $('#goodsId').val() || '';
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "status": status,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "goodId": goodsId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        // 报表导出地址
        var url = '/zxcity_restful/ws/cs_goodsSale/serchGoodDetailExcle?backUserId='+backUserId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&shopId='+shopId+'&goodId='+goodsId;
        reqAjaxAsync(REQUIRE_URL['goodsReport'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="9" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.name+'</td>'
                        +'<td>'+item.goodStatus+'</td>'
                        +'<td>'+item.balance+'</td>'
                        +'<td>'+item.visitCount+'</td>'
                        +'<td>'+item.favAccount+'</td>'
                        +'<td>'+item.salesGoodsNum+'</td>'
                        +'<td>'+getMoneyFormat(item.money)+'</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-id="'+item.goodId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.online .tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getGoodsReportList(obj.curr)
                    })
                }
            }
            $('#onlineExportBtn').attr('href',url)
        })
    }

    //切换销售额top10，销量top10，退货top10
    $('.online .topTen .tabNav a').click(function () {
        var topType = $(this).attr('data-toptype');
        $(this).addClass('active').siblings().removeClass('active');
        $('.online .topTen .topTableBox').find('table:eq('+(topType-1)+')').show().siblings('table').hide();
        //获取销售额前十，销量前十，退货额前十
        getTopTen()
    });

    //根据关键字搜索商品
    $('#keyWord').on('keyup',function () {
        var goodsName = $('#keyWord').val().trim();
        if(goodsName === '' || !goodsName){
            $('#goodsId').val('');
            $('.mask').hide();
            $('.goodsResult').html('').hide();
            getGoodsReportList();
            return
        }
        var params = {
            "backUserId": backUserId,
            "shopId": "",
            "goodId": "",
            "goodsName": goodsName
        };
        $.ajax({
            type:'post',
            dataType:'json',
            url:'/zxcity_restful/ws/rest',
            headers:{apikey:apikey},
            data:{
                cmd:REQUIRE_URL['searchGoodsName'],
                data:JSON.stringify(params),
            },
            success:function (res) {
                if (res.code !== 1) {
                    layer.msg(res.msg, {icon: 5, time: 1500})
                } else {
                    var html = '';
                    if (res.data.length === 0) {
                        html = '<li>无匹配结果</li>';
                    } else {
                        res.data[0].forEach(function (item, index) {
                            html += '<li data-goodsId="' + item.goodId + '" class="item">' + item.name + '</li>'
                        })
                    }
                    $('.goodsResult').html('').html(html).show();
                    $('.mask').show()
                }
            },
            error:function (err) {
                layer.msg("系统繁忙，请稍后再试!");
            }
        });
    });

    //点击搜索结果，更新商品统计明细
    $('.online .goodsResult').on('click','li.item',function () {
        $('#keyWord').val($(this).text());
        $('#goodsId').val($(this).attr('data-goodsId'));
        $('.mask').hide();
        $('.online .goodsResult').html('').hide();
        getGoodsReportList()
    });

    //点击遮罩关闭搜索
    $('.mask').click(function () {
        $('#keyWord').val('');
        $('#goodsId').val('');
        $('.mask').hide();
        $('.online .goodsResult').html('').hide();
        getGoodsReportList()
    });

    //查看商品销售详情-店外购物
    $('.online tbody').on('click','td a',function () {
        var goodsId = $(this).attr('data-id');
        var shopName = $('#shopSelector :selected').text();
        var shopId = $('#shopSelector').val();
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        layer.open({
            type:2,
            area:['100%','100%'],
            title:'',
            closeBtn:0,
            scrollbar:false,
            content:['/trader/report/reportCSGoodsSale/html/goodsStatisticsDetail.html?backUserId='+backUserId+'&shopId='+shopId+'&shopName='+shopName+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&goodsId='+goodsId+'&'+Math.random()],
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

    ////////////店///////////////////内//////////////下/////////////////单////////////

    //echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector('#inShopTrend'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#fca259','#60cb00','#ff5e68','#ff652a'],
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
                data: ['商品销售总数','服务卡销售总数','套餐销售总数','套盒销售总数'],
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
                name: '数量',
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
            series: [
                {
                    name: '商品销售总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData1,
                },
                {
                    name: '服务卡销售总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData2,
                },
                {
                    name: '套餐销售总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData3,
                },
                {
                    name: '套盒销售总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData4,
                }
            ],
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

    //获取店内商品概况
    function getInShopTotalNum(){
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "status": status,
            "startTime": startTime,
            "endTime": endTime
        };
        reqAjaxAsync(REQUIRE_URL['inShopTotalCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#productNum').text(res.data.totalGoodsAccount);
                $('#cardNum').text(res.data.totalServiceAccount);
                $('#packageNum').text(res.data.totalPackAccount);
                $('#setBoxNum').text(res.data.totalSetBoxAccount);
                if(res.data.ratgood > 0 && status === '1'){
                    $('#productRat').text('高于前一日'+res.data.ratgood)
                }else if(res.data.ratgood < 0 && status === '1'){
                    $('#productRat').text('低于前一日'+Math.abs(res.data.ratgood))
                }else if(res.data.ratgood === 0 && status === '1'){
                    $('#productRat').text('与前一日持平')
                }else{
                    $('#productRat').text('')
                }
                if(res.data.ratService > 0 && status === '1'){
                    $('#cardRat').text('高于前一日'+res.data.ratService)
                }else if(res.data.ratService < 0 && status === '1'){
                    $('#cardRat').text('低于前一日'+Math.abs(res.data.ratService))
                }else if(res.data.ratService === 0 && status === '1'){
                    $('#cardRat').text('与前一日持平')
                }else{
                    $('#cardRat').text('')
                }
                if(res.data.ratPack > 0 && status === '1'){
                    $('#packageRat').text('高于前一日'+res.data.ratPack)
                }else if(res.data.ratPack < 0 && status === '1'){
                    $('#packageRat').text('低于前一日'+Math.abs(res.data.ratPack))
                }else if(res.data.ratPack === 0 && status === '1'){
                    $('#packageRat').text('与前一日持平')
                }else{
                    $('#packageRat').text('')
                }
                if(res.data.ratSetBoxAccount > 0 && status === '1'){
                    $('#setBoxRat').text('高于前一日'+res.data.ratSetBoxAccount)
                }else if(res.data.ratSetBoxAccount < 0 && status === '1'){
                    $('#setBoxRat').text('低于前一日'+Math.abs(res.data.ratSetBoxAccount))
                }else if(res.data.ratSetBoxAccount === 0 && status === '1'){
                    $('#setBoxRat').text('与前一日持平')
                }else{
                    $('#setBoxRat').text('')
                }
            }
        })
    }

    //获取店内各类型商品销售走势
    function getInShopSalesTrend(){
        var title = '（30日内）';
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime = $('#day').val() || today;
            title = '（7日内）'
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
            title = '（'+$('#dateRange').val()+'）'
        }
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "status": status,
            "startTime": startTime,
            "endTime": endTime
        };
        reqAjaxAsync(REQUIRE_URL['inShopSalesTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !==1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                var yData3 = [];
                var yData4 = [];
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
                res.data[3].forEach(function (item, index) {
                    yData4.push(item.totalAccount)
                });
                echartsTrend({
                    title:'销售走势' + title,
                    xData:xData,
                    yData1:yData1,
                    yData2:yData2,
                    yData3:yData3,
                    yData4:yData4,
                })
            }
        })
    }

    //获取商品，服务卡，套餐，套盒明细列表
    function getDetailList(pageNo){
        var goodsName = $('#inShopKeyword').val().trim();
        var type = $('.inShop .tabNavBox .active').attr('data-type');
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime = $('#day').val() || today;
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "status": status,
            "shopId": shopId,
            "type": type,
            "goodsName":goodsName,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var domArr = ['.product','.card','.package','.setBox'];
        //导出地址
        var url = '/zxcity_restful/ws/cs_goodsSale/SerchInshopDetailExcle?backUserId='+backUserId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&shopId='+shopId+'&type='+type+'&goodsName='+goodsName;
        reqAjaxAsync(REQUIRE_URL['inShopDetailList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="5" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+(item.goodName || "----")+'</td>'
                        +'<td>'+item.num+'</td>'
                        +'<td>'+getMoneyFormat(item.price)+'</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-id="'+item.goodId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.inShop .tableContent').find(domArr[type-1]).find('tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('inShopPageSelector',res.total,function (obj, first) {
                        getDetailList(obj.curr)
                    })
                }
            }
            $('#inShopExportBtn').attr('href',url)
        })
    }

    // 切换商品，服务卡，套餐，套盒
    $('.inShop .tabNavBox a').click(function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings().removeClass('active');
        $('.inShop .tableContent').find('table:eq('+(type-1)+')').show().siblings().hide();
        getDetailList()
    });

    //店内搜索
    $('.inShop .searchBox').on('click','button',function () {
        getDetailList()
    });

    //查看商品销售详情-店内购物
    $('.inShop .tableContent tbody').on('click','td a',function () {
        var type = $('.inShop .tabNavBox .active').attr('data-type');
        var goodsId = $(this).attr('data-id');
        var shopName = $('#shopSelector :selected').text();
        var shopId = $('#shopSelector').val();
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        layer.open({
            type:2,
            area:['100%','100%'],
            title:'',
            closeBtn:0,
            scrollbar:false,
            content:['/trader/report/reportCSGoodsSale/html/inShopSaleDetail.html?backUserId='+backUserId+'&shopId='+shopId+'&shopName='+shopName+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&goodsId='+goodsId+'&type='+type+'&'+Math.random()],
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

});