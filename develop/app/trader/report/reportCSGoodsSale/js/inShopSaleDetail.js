layui.use(['laydate', 'layer'], function () {
    var laydate = layui.laydate;
    var layer = layui.layer;
    var REQUIRE_URL = {
        goodsInfo:'cs_goodsSale/SerchInshopGoodsDetail',//商品信息和销冠
        goodsTrend:'cs_goodsSale/SerchInshopGoodsSpot',//商品走势
        goodsSaleList:'cs_goodsSale/SerchInshopGoodDetail'//商品销售明细

    };
    var backUserId = getUrlParams('backUserId');
    var shopId = getUrlParams('shopId');
    var shopName = getUrlParams('shopName');
    var status = getUrlParams('status');
    var startTime = getUrlParams('startTime');
    var endTime = getUrlParams('endTime');
    var goodsId = getUrlParams('goodsId');
    var type = getUrlParams('type');
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
        var myChart = echarts.init(document.querySelector('#salesTrend'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#fca259'],
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
                data: ['商品销售总数'],
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
                    name: '商品销售总数',
                    type: 'line',
                    smooth:true,
                    data: obj.yData,
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

    //获取商品信息，销售总数，和冠军店铺
    function getGoodsInfo() {
        var params = {
            "startTime": startTime,//开始时间
            "backUserId": backUserId,//登入人ID
            "status": status,//1 日  2 全部 3.自定义
            "goodsServiceId": goodsId,//商品ID
            "shopId": shopId,//电铺ID
            "type": type,//1 普通商品 2，服务卡 3 套餐 4 套盒
            "endTime":endTime//结束时间
        };
        reqAjaxAsync(REQUIRE_URL['goodsInfo'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#goodsPic').attr('src',res.data.pic || 'http://tsnrhapp.oss-cn-hangzhou.aliyuncs.com/itemreport/default/morenfuwu_pic.jpg');
                $('#goodsName').text(res.data.goodName);
                $('#goodsPrice').text(getMoneyFormat(res.data.price));
                $('#salesTotalNum').text(res.data.num);
                $('#topShopName').text(res.data.shopName);
                $('#topSalesNum').text(res.data.CamNum);
            }
        })
    }

    //获取商品销售走势
    function getGoodsTrend(){
        var params = {
            "startTime": startTime,//开始时间
            "backUserId": backUserId,//登入用户
            "status": status,  //1 日  2 全部 3.自定义
            "shopId": shopId,//店铺ID
            "goodsServiceId": goodsId,//商品ID
            "type": type,//1 普通商品 2，服务卡 3 套餐 4 套盒
            "endTime": endTime//结束时间
        };
        reqAjaxAsync(REQUIRE_URL['goodsTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData = [];
                var title = '';
                if(status === '1'){
                    title = '（近7日）'
                }else if(status === '2'){
                    title = '（近30日）'
                }else if(status === '3'){
                    title = '（'+startTime+'~'+endTime+'）'
                }
                res.data.forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData.push(item.totalAccount)
                });
                echartsTrend({
                    title:'商品销售走势'+title,
                    xData:xData,
                    yData:yData,
                })
            }
        })
    }

    //获取商品销售明细列表
    function getGoodsSalesList(pageNo){
        var params = {
            "startTime": startTime,//开始时间
            "endTime": endTime,//结束时间
            "backUserId": backUserId,//登入用户ID
            "status": status,//1 日  2 全部 3.自定义
            "shopId": shopId,//电铺ID
            "goodsServiceId": goodsId,
            "type": type,//1 普通商品 2，服务卡 3 套餐 4 套盒
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var url = '/zxcity_restful/ws/cs_goodsSale/SerchInshopGoodDetailExcle?backUserId='+backUserId+'&shopId='+shopId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&type='+type+'&goodsServiceId='+goodsId;
        reqAjaxAsync(REQUIRE_URL['goodsSaleList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:150})
            }else{
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="7" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.username+'</td>'
                        +'<td>'+item.mobile+'</td>'
                        +'<td>'+item.num+'</td>'
                        +'<td>'+item.time+'</td>'
                        +'<td>'+item.status+'</td>'
                        +'</tr>'
                    })
                }
                $('.tableBox tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getGoodsSalesList(obj.curr)
                    })
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

        getGoodsSalesList();
    }

    //关闭当前页面
    $('.closeBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
});