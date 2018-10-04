layui.use(['laydate', 'layer'], function () {
    var laydate = layui.laydate;
    var layer = layui.layer;
    var REQUIRE_URL = {
        goodsInfo:'cs_goodsSale/serchGoodStaticDetail',//商品信息和销冠
        goodsTrend:'cs_goodsSale/serchGoodSpot',//商品走势
        goodsSaleList:'cs_goodsSale/serchOrderDetail'//商品销售明细
    };
    var backUserId = getUrlParams('backUserId');
    var shopId = getUrlParams('shopId');
    var shopName = getUrlParams('shopName');
    var status = getUrlParams('status');
    var startTime = getUrlParams('startTime');
    var endTime = getUrlParams('endTime');
    var goodsId = getUrlParams('goodsId');
    var pageSize = 10;
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

    //echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector('#trend'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#fac259', '#64c90b', '#cccccc'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['商品销售额', '商品销量', '商品退款额'],
                top:6,
                right: 20,
            },
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
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    color: '#999',
                    fontSize: 14
                },
                data: obj.xData
                // data: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07']
            },
            yAxis: [
                {
                    type: 'value',
                    // name: '金额',
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#fac259'
                    },
                    splitNumber :3,

                },
                {
                    type: 'value',
                    // name: '数量',
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#64c90b'
                    },
                    splitNumber : 3,
                }
            ],
            series: [
                {
                    name: '商品销售额',
                    data: obj.sale,
                    type: 'line',
                    smooth: true,
                },
                {
                    name: '商品销量',
                    data: obj.count,
                    type: 'line',
                    yAxisIndex: 1,
                    smooth:true,
                },
                {
                    name: '商品退款额',
                    data: obj.returnMoney,
                    type: 'line',
                    smooth:true,
                },
            ],
            grid: {
                borderWidth: 1,
                left: '65px',
                right: '60px',
                bottom: '10%',
                top: '14%'
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //获取商品信息和销冠
    function getGoodsInfo(){
        var params = {
            "startTime": startTime,
            "backUserId": backUserId,
            "status": status,
            "shopId": shopId,
            "goodId": goodsId,
            "endTime": endTime
        };
        reqAjaxAsync(REQUIRE_URL['goodsInfo'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#goodsPic').attr('src',res.data.picUrl);
                $('#goodsName').text(res.data.goodsName);
                $('#favAccount').text(res.data.favAccount);
                $('#goodsPrice').text(getMoneyFormat(res.data.price));
                $('#saleMoney').text(getMoneyFormat(res.data.money));
                $('#saleNum').text(res.data.salesGoodsNum);
                $('#returnMoney').text('-'+getMoneyFormat(res.data.returnMoney));
                $('#returnNum').text(res.data.returnGoodsNum);
                $('#topShopName').text(res.data.CamShop);
                $('#topMoney').text('￥'+getMoneyFormat(res.data.Campmoney));
                if(res.data.ratioGoodSale > 0 && status === '1'){
                  $('#saleComparison').text('高于前日'+res.data.ratioGoodSale)
                }else if(res.data.ratioGoodSale < 0 && status === '1'){
                    $('#saleComparison').text('低于前日'+Math.abs(res.data.ratioGoodSale))
                }else if(res.data.ratioGoodSale === 0 && status === '1'){
                    $('#saleComparison').text('与前日持平')
                }else{
                    $('#saleComparison').text('')
                }
                if(res.data.ratioRerunGoodSale > 0 && status === '1'){
                    $('#returnComparison').text('高于前日'+res.data.ratioRerunGoodSale)
                }else if(res.data.ratioRerunGoodSale < 0 && status === '1'){
                    $('#returnComparison').text('低于前日'+Math.abs(res.data.ratioRerunGoodSale))
                }else if(res.data.ratioRerunGoodSale === 0&& status === '1'){
                    $('#returnComparison').text('与前日持平')
                }else{
                    $('#returnComparison').text('')
                }
            }
        })
    }

    //获取商品走势
    function getGoodsTrend(){
        var params = {
            "startTime": startTime,
            "backUserId": backUserId,
            "status": status,
            "shopId": shopId,
            "goodId": goodsId,
            "endTime": endTime
        };
        reqAjaxAsync(REQUIRE_URL['goodsTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var title ='';
                var xData = [];
                var sale = [];
                var count = [];
                var returnMoney = [];
                if(status === '1'){
                    title = startTime+'(7日内)商品销售走势'
                }else if(status === '2'){
                    title = '近30日商品销售走势'
                }else if(status === '3'){
                    title = startTime+'~'+endTime+'商品销售走势'
                }
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    sale.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    count.push(item.totalAccount)
                });
                res.data[2].forEach(function (item, index) {
                    returnMoney.push(item.totalAccount)
                });
                echartsTrend({
                    title:title,
                    xData:xData,
                    sale:sale,
                    count:count,
                    returnMoney:returnMoney
                });
            }
        })
    }

    //获取商品销售明细
    function getGoodsSaleList(pageNo){
        var params = {
            "startTime": startTime,
            "backUserId": backUserId,
            "status": status,
            "shopId": shopId,
            "goodId": goodsId,
            "endTime": endTime,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        // 报表导出地址
        var url = '/zxcity_restful/ws/cs_goodsSale/serchOrderDetailExcle?backUserId='+backUserId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&shopId='+shopId+'&goodId='+goodsId;
        reqAjaxAsync(REQUIRE_URL['goodsSaleList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="9">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.orderNo+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.contactName+'</td>'
                        +'<td>'+item.contactMobile+'</td>'
                        +'<td>'+item.num+'</td>'
                        +'<td>'+getMoneyFormat(item.money)+'</td>'
                        +'<td>'+item.time+'</td>'
                        +'<td>'+item.orderStatus+'</td>'
                        +'</tr>'
                    })
                }
                $('.reportTable .online tbody').html(html);
                if(pageNo === 1 ||!pageNo){
                    initPageSelector('pageSelector', res.total,function (obj, first) {
                        getGoodsSaleList(obj.curr)
                    });
                }
            }
            $('#exportBtn').attr('href',url)
        })
    }

    function init(){
        if(status === '1'){
            $('.date').text(startTime)
        }else if(status === '2'){
            $('.date').text('全部')
        }else if(status === '3'){
            $('.date').text(startTime+'~'+endTime)
        }
        $('.shopName').text(shopName);
        getGoodsInfo();
        getGoodsTrend();
        getGoodsSaleList()
    }

    //关闭当前页面
    $('.closeBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
});