layui.use(['form','laydate','layer'],function () {
    var form = layui.form;
    var $ = layui.$;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        ticketCount:'cs_coupon/selectCouponTotal',//优惠券总数
        ticketCountTrend:'cs_coupon/couponTotalSPot',//优惠券数量走势
        ticketList:'cs_coupon/couponDetail',//获取优惠券列表
        ticketDetail:'cs_coupon/couponGoodsDetail',//优惠券详情
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

    //echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector('#trend'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#ff6636','#1e9fff'],
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
                data: ['领取数量','使用数量'],
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
                    name: '领取数量',
                    type: 'line',
                    smooth: true,
                    data: obj.yData1,
                },
                {
                    name: '使用数量',
                    type: 'line',
                    smooth: true,
                    data: obj.yData2,
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
                    //获取优惠券数量
                    getTicketCount();
                    //获取优惠券数量走势
                    getTicketCountTrend();
                    //获取优惠券列表
                    getTicketList()
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
                    //获取优惠券数量
                    getTicketCount();
                    //获取优惠券数量走势
                    getTicketCountTrend();
                    //获取优惠券列表
                    getTicketList()
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

    //获取优惠券数量
    function getTicketCount(){
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime =$('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "status": status,//1 日  2 全部 3.自定义
            "startTime": startTime,//开始时间
            "endTime": endTime , //结束时间
            "backUserId": backUserId,  //用户ID
            "shopId": shopId,  //店铺ID
        };
        reqAjaxAsync(REQUIRE_URL['ticketCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                //领用数量
                $('#pickCount').text(res.data.totalGetAccount);
                if(res.data.ratTotalGetAccount > 0 && status === '1'){
                    $('#pickComparison').text('高于前日'+res.data.ratTotalGetAccount)
                }else if(res.data.ratTotalGetAccount < 0 && status === '1' ){
                    $('#pickComparison').text('高于前日'+Math.abs(res.data.ratTotalGetAccount))
                }else if(res.data.ratTotalGetAccount === 0 && status === '1' ){
                    $('#pickComparison').text('与前日持平')
                }else{
                    $('#pickComparison').text('')
                }
                //使用数量
                $('#useCount').text(res.data.totalUseAccount);
                if(res.data.ratTotalUseAccount > 0 && status === '1'){
                    $('#useComparison').text('高于前日'+res.data.ratTotalUseAccount)
                }else if(res.data.ratTotalUseAccount < 0 && status === '1' ){
                    $('#useComparison').text('高于前日'+Math.abs(res.data.ratTotalUseAccount))
                }else if(res.data.ratTotalUseAccount === 0 && status === '1' ){
                    $('#useComparison').text('与前日持平')
                }else{
                    $('#useComparison').text('')
                }
            }
        })
    }

    //获取优惠券数量走势
    function getTicketCountTrend(){
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime =$('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "status": status,//1 日  2 全部 3.自定义
            "startTime": startTime,//开始时间
            "endTime": endTime , //结束时间
            "backUserId": backUserId,  //用户ID
            "shopId": shopId,  //店铺ID
        };
        reqAjaxAsync(REQUIRE_URL['ticketCountTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                var title = '';
                res.data[0].forEach(function (item, index) {
                    xData.push(item.time.substring(5));
                    yData1.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    yData2.push(item.totalAccount)
                });
                if(status === '1'){
                    title = '优惠券情况走势(近7日)'
                }else if(status === '2'){
                    title = '优惠券情况走势(近30日)'
                }else if(status === '3'){
                    title = '优惠券情况走势('+$('#dateRange').val()+')'
                }
                echartsTrend({
                    title:title,
                    xData:xData,
                    yData1:yData1,
                    yData2:yData2,
                });
            }
        })
    }

    //获取优惠券列表
    function getTicketList(pageNo){
        var type = $('.tab .active').attr('data-type');
        var couponType = $('#typeSelect').val() || '';
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime =$('#day').val() || today
        }else if(status === '3'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "status": status,//1 日  2 全部 3.自定义
            "startTime": startTime,//开始时间
            "endTime": endTime , //结束时间
            "backUserId": backUserId,  //用户ID
            "shopId": shopId,  //店铺ID
            "type": type,//1 领用明细 2 使用明细
            "couponType": couponType,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            },
        };
        // 报表导出地址
        var url = '/zxcity_restful/ws/cs_coupon/couponDetailExcle?backUserId='+backUserId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&shopId='+shopId+'&type='+type+'&couponType='+couponType;
        var listObj = {
            '1':function (res) {
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
                            +'<td>'+(item.instruction || "----")+'</td>'
                            +'<td>'+item.couponType+'</td>'
                            +'<td>'+item.code+'</td>'
                            +'<td>'+item.username+'</td>'
                            // +'<td>会员</td>'
                            +'<td>'+item.phone+'</td>'
                            +'<td>'+item.time+'</td>'
                            +'<td>'+item.status+'</td>'
                            +'</tr>'
                    });
                }
                $('.receive tbody').html(html)
            },
            '2':function (res) {
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
                            +'<td>'+(item.instruction || "----")+'</td>'
                            +'<td>'+item.couponType+'</td>'
                            +'<td>'+item.code+'</td>'
                            +'<td>'+item.username+'</td>'
                            +'<td>'+item.phone+'</td>'
                            +'<td>'+(item.time || "--")+'</td>'
                            +'<td>'
                            +'<a href="JavaScript:;" data-cloId="'+item.cloId+'" data-sbcId="'+item.sbcId+'">查看详情</a>'
                            +'</td>'
                            +'</tr>'
                    });
                }
                $('.use tbody').html(html)
            }
        };
        reqAjaxAsync(REQUIRE_URL['ticketList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                listObj[type](res);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getTicketList(obj.curr)
                    });
                }
            }
            $('.exportBtn').attr('href',url)
        })
    }

    //获取优惠券详情
    function getTicketDetail(cloId,sbcId){
        var defer = $.Deferred();
        var shopId = $('#shopSelector').val() || '';
        var params = {
            "backUserId": backUserId,//商户ID
            "shopId": shopId,//店铺ID
            "cloId": cloId,//订单子表ID
            "sbcId": sbcId//订单ID
        };
        reqAjaxAsync(REQUIRE_URL['ticketDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //切换时间（日报，全部，自定义）
    $('.timeTab').on('click','ul li',function () {
        var navType = $(this).attr('data-navType');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.timeSelector').find('div:eq('+(navType-1)+')').show().siblings('div').hide();
        //获取优惠券数量
        getTicketCount();
        //获取优惠券数量走势
        getTicketCountTrend();
        //获取优惠券列表
        getTicketList()
    });

    //切换领取明细和使用明细
    $('.tab').on('click','a',function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings().removeClass('active');
        $('.tableBox').find('table:eq('+(type-1)+')').show().siblings().hide();
        getTicketList()
    });

    //切换店铺
    form.on('select(shopSelector)',function () {
        $('.shopName').text($('#shopSelector :selected').text());
        //获取优惠券数量
        getTicketCount();
        //获取优惠券数量走势
        getTicketCountTrend();
        //获取优惠券列表
        getTicketList()
    });

    //切换优惠券类型
    form.on('select(typeSelect)',function () {
        //获取优惠券列表
        getTicketList()
    });

    //查看优惠券使用详情
    $('.use tbody').on('click','a',function () {
        var shopId = $('#shopSelector').val() || '';
        var cloId = $(this).attr('data-cloId');
        var sbcId = $(this).attr('data-sbcId');
        getTicketDetail(cloId,sbcId).done(function (res) {
            template.defaults.imports.moneyFormat = getMoneyFormat;
            var html = template('ticketUseDetailTpl',res);
            layer.open({
                type:1,
                title:'',
                closeBtn:0,
                shade:0.5,
                shadeClose:true,
                skin:'useDetail',
                area:['80%','622px'],
                scrollbar:false,
                content:html,
                success:function (layeror, index) {
                    $(layeror).on('click','.closeBtn',function () {
                        layer.close(index)
                    });
                    // 报表导出地址
                    var url = '/zxcity_restful/ws/cs_coupon/couponGoodsDetailExcle?backUserId='+backUserId+'&shopId='+shopId+'&cloId='+cloId+'&sbcId='+sbcId;
                    $('.detailExportBtn').attr('href',url)
                }
            })
        });
    });

    //前往礼包统计页面弹窗
    $('#linkBtn').click(function () {
        var shopName = $('.shopName').text();
        var shopId = $('#shopSelector').val() || '';
        var status = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(status === '1'){
            startTime = endTime =$('#day').val() || today
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
            content:'/trader/report/reportCSCoupon/html/reportCSCGiftPackage.html?backUserId='+backUserId+'&shopId='+shopId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&shopName='+shopName,
            success:function () {
                $('body').height($(window).height()).css('overflow','hidden')
            },
            end:function () {
                $('body').height('100%').css('overflow','visible')
            }
        })
    });

    //初始化页面
    function init(){
        initDate();
        getShopList().done(function () {
            form.render('select');
            $('.shopName').text($('#shopSelector :selected').text());
            //获取优惠券数量
            getTicketCount();
            //获取优惠券数量走势
            getTicketCountTrend();
            //获取优惠券列表
            getTicketList()
        })
    }
});