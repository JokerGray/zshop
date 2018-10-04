$(function () {
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var total = 0;
    var REQUIRE_URL = {
        shopList:'reportEmployeeSales/selectShopListByBackUserId',//获取店铺列表
        championReport:'reportShopBusiness/serchTurnoverByShopId',//冠军统计
        reportList:'reportShopBusiness/serchTotalMoney',//总流水，营业收入，消耗额数据
        top10:'reportShopBusiness/serchTotalMoneyTop10',//前十排行
        detail:'reportShopBusiness/serchTotalMoneyDetail',//店铺营业额明细
    };
    var ST = '';
    var ET = '';
    //切换本月和自定义时间
    $('.timeNav').on('click','>a',function(){
        $(this).addClass('active').siblings('a').removeClass('active');
        if($(this).hasClass('thisMonth')){
            $('.timeRange').fadeOut(200);
            $('.path .pathTime').text('本月').attr('data-type','thisMonth');
            initDateRange().done(function () {
                //更新四大冠军数据
                getChampionReport();
                // 重新刷新报表数据
                refreshPage(true)
            })
        }else if($(this).hasClass('selfTime')){
            $('.timeRange').fadeToggle(200);
            $('.mask').fadeToggle(200);
        }
    });
    //确定时间范围选择按钮
    $('#sure').on('click',function(){
        var sDate = $('#startDate').val().trim();
        var eDate = $('#endDate').val().trim();
        if(new Date(sDate).getTime()> new Date(eDate).getTime()){
            layer.msg('开始时间不能大于结束时间',{icon:2});
            return
        }
        //更新四大冠军数据
        getChampionReport(true);
        // 重新刷新报表数据
        refreshPage(true);
        $('.pathTime').text(sDate+' 至 '+eDate).attr('data-type','self');
        $('.timeRange').fadeOut(200);
        $('.mask').fadeOut(200);
        ST = sDate;
        ET = eDate;
        // $('.greatBox ul li .greatDetail span:eq(1)').hide()
    });
    //切换总流水，营业收入，消耗额
    $('.filterTab').on('click', '.tabNav a', function () {
        var cls = $(this).attr('data-class');
        $(this).addClass('active').siblings().removeClass('active');
        $('.pageBox').hide();
        if (cls === 'totalMoneyReport') {
            $('.' + cls).css('display', 'inline-block');
            $('.incomeReport').hide();
            $('.expendReport').hide();
            totalMoneyReport()
        } else if (cls === 'incomeReport') {
            $('.' + cls).css('display', 'inline-block');
            $('.totalMoneyReport').hide();
            $('.expendReport').hide();
            $('.chartTitle span i:eq(0)').addClass('active').siblings('i').removeClass('active');
            incomeReport();
            getTop10(0)
        } else if (cls === 'expendReport') {
            $('.' + cls).css('display', 'inline-block');
            $('.totalMoneyReport').hide();
            $('.incomeReport').hide();
            expendReport();
            getTop10(4)
        }
    });
    //初始化时间选择插件
    function initDateRange(){
        var defer = $.Deferred();
        // 获取今天日期
        var today = formatAllDate(new Date(),'yyyy-MM-dd');
        // 获取本月第一天日期
        var first = formatAllDate(new Date(),'yyyy-MM');
        first = first+'-01';
        ST = first;
        ET = today;
        layui.use('laydate',function () {
            var laydate = layui.laydate;
            laydate.render({
                elem:'#startDate',
                max:0,
                value:first,
                isInitValue:true,
                btns:['now', 'confirm']
            });
            laydate.render({
                elem:'#endDate',
                max:0,
                value:today,
                isInitValue:true,
                btns:['now', 'confirm']
            })
        });
        setTimeout(function () {
            defer.resolve(first,today)
        },100);
        return defer.promise()
    }
    //初始化分页方法
    function initPageSelector(domId, total, jump) {
        //分页
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: domId,
                count: total, //数据总数，从服务端得到
                groups:3,
                theme: "#ccc",
                jump: function (obj, first) {
                    //首次不执行
                    if (!first) {
                        jump ? jump(obj, first) : null
                        //do something
                    }
                }
            });
        });
    }
    //初始化列表数提示
    function initPageTips(total){
        $('.pageBox .from').text(1);
        if(total >= 1 && total <= pageSize){
            $('.pageBox .pageTips').css({visibility: 'visible'});
            $('.pageBox .total').text(total);
            $('.pageBox .to').text(total);
        }else if(total > pageSize){
            $('.pageBox .pageTips').css({visibility: 'visible'});
            $('.pageBox .total').text(total);
            $('.pageBox .to').text(pageSize);
        }else{
            $('.pageBox .pageTips').css({visibility: 'hidden'});
        }
    }
    //更新列表数提示
    function updatePageTips(total,curr){
        var from;
        var to;
        from = (curr-1)*pageSize+1;
        to = curr*pageSize;
        if(to>=total){
            to = total
        }
        $('.pageBox .from').text(from);
        $('.pageBox .to').text(to);
        $('.pageBox .total').text(total);
    }
    //初始化表格方法
    function initTable(layFilter, event) {
        var defer = $.Deferred();
        layui.use('table', function () {
            var table = layui.table;
            table.init(layFilter, {
                height: 345,//设置高度
                limit: 10, //注意：请务必确保 limit 参数（默认：10）是与你服务端限定的数据条数一致
                size: "sm",
                even: true,
                done: function (res, curr, count) {
                    defer.resolve(res, curr, count)
                }
                //支持所有基础参数
            });
            //监听单元格事件
            table.on('tool(' + layFilter + ')', function (obj) {
                event ? event(obj) : null
            });
        });
        return defer.promise()
    }
    //初始化echart柱状图方法
    function initEchart(dataObj) {
        var myChart = echarts.init(document.querySelector(dataObj.domName));
        // 指定图表的配置项和数据
        var option = {
            //图表颜色
            color: "#1dbfaf",
            //x轴
            xAxis: {
                type: 'category',
                // x轴数据
                data: dataObj.xData,
                //x轴字体样式，显示
                axisLabel: {
                    show: true,
                    interval: 0,
                    formatter: function (params) {
                        var newParamsName = "";
                        var paramsNameNumber = params.length;
                        var provideNumber = 5;  //一行显示几个字
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        if (paramsNameNumber > provideNumber) {
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = "";
                                var start = p * provideNumber;
                                var end = start + provideNumber;
                                if (p == rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }

                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    },
                    textStyle: {
                        fontSize: 14,
                        color: '#333' //文字颜色
                    }
                },
                //x轴颜色
                axisLine: {
                    lineStyle: {
                        color: "#ddd"
                    },
                },
                //坐标轴刻度样式
                axisTick: {
                    //刻度居中与文字
                    alignWithLabel: false,
                    //刻度颜色
                    lineStyle: {
                        color: '#333'
                    }
                },
            },
            // y轴
            yAxis: {
                type: 'value',
                show: true,
                //y轴颜色
                axisLine: {
                    lineStyle: {
                        color: "#ddd"
                    }
                },
                //y轴刻度线
                axisTick: {
                    "show": false
                },
                //网格线
                splitLine: {
                    "show": false
                }
            },
            //数据
            series: [{
                data: dataObj.yData,
                type: 'bar',
                //柱宽
                barWidth: 40,
                //柱顶显示数据
                label: {
                    normal: {
                        show: true,
                        position: "top",
                        textStyle: {
                            color: "#000",
                        }
                    }
                }
            }],
            //设置坐标轴位置
            grid: {
                x: 0,
                y: 25,
                x2: 0,
                y2: 35,
                borderWidth: 1,
                // left: '0%',
                // right: '0%',
                // bottom: '12%',
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    // 初始化饼状图方法
    function initPieChart(dataObj,event) {
        var myChart = echarts.init(document.querySelector(dataObj.domName));
        // 指定图表的配置项和数据
        var option = {
            legend: {
                orient: 'horizontal',
                left: '60',
                top:'30',
                itemWidth:40,
                itemHeight:20,
                textStyle:{
                    fontSize:16,
                    padding:[0,5,0,5]
                },
                data: ['充值', '现金消费', '定金预售']
            },
            color: ['#fda359', '#3ac471', '#81daff'],
            series: [
                {
                    name: '营业额占比',
                    type: 'pie',
                    selectedMode: 'single',
                    selectedOffset: 10,
                    radius: '63%',
                    center: ['48%', '60%'],
                    data: dataObj.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            label: {
                                show: true,
                                formatter: '{d}%',
                                fontSize: 16,
                                color: '#333'
                            },
                            labelLine: {show: true}
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        //图表点击事件
        myChart.on('click',function (params) {
            event?event(params):null
        })
    }
    //店铺营业额占比详情弹窗
    function showBusinessDetail(params) {
        var echartData = [
            {value: params.data.cashPayRecharge, name: '充值',type:1, selected: true},
            {value: params.data.cashPayMoney, name: '现金消费',type:2},
            {value: params.data.cashPayAppointment, name: '定金预售',type:3}
        ];
        if (params.event === 'detail') {
            getTotalDetail(params.data.shopId,1,1).done(function (res) {
                var html = template('businessDetailTpl', res);
                var sTime = $('#startDate').val();
                var eTime = $('#endDate').val();
                var url = '/zxcity_restful/ws/reportShopBusiness/exportXlsDetail?type=1&shopId='+params.data.shopId+'&endTime='+eTime+'&startTime='+sTime+'&backUserId='+backUserId;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['69.7%', '80%'],
                    closeBtn: 0,
                    shadeClose: true,
                    shade: 0.5,
                    content: html,
                    skin: 'businessDetail',
                    success: function (layeror, index) {
                        $('.pageBox').show();
                        $('.detailPath p b').text(params.data.shopName);
                        $('.closeIcon').click(function () {
                            layer.close(index)
                        });
                        $('#exportBtn').attr('href',url).off('click').click(function () {
                            if(res.total == 0){
                                layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                                return false
                            }
                        });
                        initPieChart({
                            domName: '.pieChart',
                            data: echartData
                        },function (objData) {
                            $('#detailPageSelect').html('');
                            $('.detailPath p span').text(objData.name);
                            getTotalDetail(params.data.shopId,objData.data.type,1).done(function (res) {
                                url = '/zxcity_restful/ws/reportShopBusiness/exportXlsDetail?type='+objData.data.type+'&shopId='+params.data.shopId+'&endTime='+eTime+'&startTime='+sTime+'&backUserId='+backUserId;
                                $('#exportBtn').attr('href',url).off('click').click(function () {
                                    if(res.total == 0){
                                        layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                                        return false
                                    }
                                });
                                // initPageTips(res.total);
                                showList(res,1);
                                if(res.total > pageSize){
                                    initPageSelector('detailPageSelect',res.total,function (obj, first) {
                                        getTotalDetail(params.data.shopId , objData.data.type , obj.curr).done(function (res) {
                                            showList(res,obj.curr);
                                            // updatePageTips(res.total,obj.curr)
                                        })
                                    })
                                }else{
                                    $('#detailPageSelect').html('')
                                }
                            })
                        });
                        // initPageTips(res.total);
                        if(res.total > pageSize){
                            initPageSelector('detailPageSelect',res.total,function (obj,first) {
                                getTotalDetail(params.data.shopId,1,obj.curr).done(function (res) {
                                    showList(res,obj.curr);
                                    // updatePageTips(res.total,obj.curr)
                                })
                            })
                        }else{
                            $('#detailPageSelect').html('')
                        }
                    }
                })
            })
        }
        function showList(resData,pageNo){
            var html = '';
            var No = '';
            var money = '';
            if(resData.data.length > 0){
                resData.data.forEach(function (item, index) {
                    No = ((pageNo-1)*pageSize)+(index+1);
                    No = No < 10 ? '0'+No : No;
                    if(resData.type == 1){
                        money = item.cashPayRecharge
                    }else if(resData.type == 2){
                        money = item.cashPayMoney
                    }else if(resData.type == 3){
                        money = item.cashPayAppointment
                    }
                    html+='<tr>'
                        +'<td style="text-align: center">'+No+'</td>'
                        +'<td>'+item.consumeTime+'</td>'
                        +'<td>'+money+'</td>'
                        +'<td>'+item.memberName+'</td>'
                        +'<td>'+item.salesMan+'</td>'
                        +'</tr>'
                });
            }else{
                html = '<tr><td class="layui-none" colspan="5">暂无相关数据</td></tr>'
            }
            $('#detailTable tbody').html(html);
        }
    }
    //获取店铺列表
    function getShopList() {
        var defer = $.Deferred();
        var shopHtml = '';
        var params = {
            'backUserId':parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_URL['shopList'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg,{icon:5});
            }else{
                if(res.data.flag){
                    shopHtml = '<option value="null">全部店铺</option>'
                }
                res.data.shopList.forEach(function(item,index){
                    shopHtml+='<option value="'+item.shopId+'">'+item.shopName+'</option>'
                });
                $('#shopSelector').html(shopHtml).select2({language: "zh-CN"});
                $('.pathShopName').text($('#shopSelector :selected').text());
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取4大冠军统计
    function getChampionReport(isTime){
        var sTime = $('#startDate').val();
        var eTime = $('#endDate').val();
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['championReport'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                template.defaults.imports.moneyFormat = getMoneyFormat;
                var greatHtml = template('greatTpl',res);
                $('.greatBox').html(greatHtml);
                var type = $('.pathTime').attr('data-type');
                if(isTime){
                    $('.greatBox ul li .greatDetail .compare').hide()
                }else{
                    $('.greatBox ul li .greatDetail .compare').show()
                }
                if(type === 'thisMonth'){
                    $('.greatBox ul li .greatDetail .compare').show()
                }else if(type === 'self'){
                    $('.greatBox ul li .greatDetail .compare').hide()
                }
            }
        })
    }
    //获取总流水，营业收入，消耗额数据
    function getReportList(pageNo){
        //店铺流水 type=1，营业收入type=2，消耗额type=3
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var type = $('.tabNav .active').attr('data-type');
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo||1,
                "rows": pageSize
            },
        };
        reqAjaxAsync(REQUIRE_URL['reportList'],JSON.stringify(params)).done(function (res) {
            total = res.total;
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                // layer.msg('数据加载成功',{icon:6,time:1000});
                $('.pageBox').show();
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取总流水列表
    function totalMoneyReport(){
        getReportList(null).done(function (res) {
            // 渲染显示数据
            showList(res.data,1);
            //初始化总流水报表
            initTable('totalMoneyReport').done(function () {
                //初始化列表数提示
                $('.totalMoneyReport').css('visibility','visible');
                initPageTips(res.total);
                if(res.total > pageSize){
                    initPageSelector('totalMoneyPageSelect', res.total,function(obj,first){
                        // 刷新列表数据
                        getReportList(obj.curr).done(function (res){
                            // 渲染显示数据
                            showList(res.data,obj.curr);
                            //重新初始化表格
                            initTable('totalMoneyReport');
                            // 更新列表数据提示
                            updatePageTips(res.total,obj.curr)
                        })
                    })
                }else{
                    $('#totalMoneyPageSelect').html('')
                }
            });
        });
        function showList(data,pageNo){
            var html = '';
            var No = '';
            data.forEach(function (item, index) {
                item.discountMoney = item.discountMoney === ''?'0':item.discountMoney;
                No = ((pageNo-1)*pageSize)+(index+1);
                No = No < 10 ? '0'+No : No;
                html+='<tr>'
                    +'<td>'+No+'</td>'
                    +'<td>'+item.shopName+'</td>'
                    +'<td>'+item.orderType+'</td>'
                    +'<td>'+item.actualPay+'</td>'
                    +'<td>'+item.discountMoney+'</td>'
                    +'<td>'+item.payType+'</td>'
                    +'<td>'+item.memberName+'</td>'
                    +'<td>'+item.salesman+'</td>'
                    +'<td>'+item.consumeTime+'</td>'
                    +'</tr>'
            });
            $('#totalMoneyReport tbody').html(html);
        }
    }
    //获取营业收入列表
    function incomeReport(){
        getReportList(null).done(function (res) {
            showList(res.data,1);
            initPageTips(res.total);
            initTable('incomeReport', showBusinessDetail).done(function () {
                $('.incomeReport').css('visibility','visible');
                if(res.total > pageSize){
                    initPageSelector('incomePageSelect', res.total,function (obj, first) {
                        getReportList(obj.curr).done(function (res) {
                            showList(res.data,obj.curr);
                            initTable('incomeReport',showBusinessDetail);
                            updatePageTips(res.total,obj.curr)
                        })
                    })
                }else{
                    $('#incomePageSelect').html('')
                }
            });
        });
        function showList(data,pageNo){
            var html = '';
            var No = '';
            data.forEach(function (item, index) {
                No = ((pageNo-1)*pageSize)+(index+1);
                No = No < 10 ? '0'+No : No;
                html+='<tr>'
                    +'<td>'+No+'</td>'
                    +'<td>'+item.shopName+'</td>'
                    +'<td>'+item.totalPrice+'</td>'
                    +'<td>'+item.cashPayRecharge+'</td>'
                    +'<td>'+item.cashPayMoney+'</td>'
                    +'<td>'+item.cashPayAppointment+'</td>'
                    +'<td>'+item.shopId+'</td>'
                    +'</tr>'
            });
            $('#incomeReport tbody').html(html);
        }
    }
    //获取消耗额列表
    function expendReport(){
        getReportList(null).done(function (res) {
            showList(res.data,1);
            initPageTips(res.total);
            initTable('expendReport',ServicePerformancePage).done(function () {
                $('.expendReport').css('visibility','visible');
                if(res.total > pageSize){
                    initPageSelector('expendPageSelect',res.total,function (obj,first) {
                        getReportList(obj.curr).done(function (res) {
                            showList(res.data,obj.curr);
                            initTable('expendReport',ServicePerformancePage);
                            updatePageTips(res.total,obj.curr);
                        })
                    })
                }else{
                    $('#expendPageSelect').html('')
                }
            })
        });
        function showList(data,pageNo){
            var html = '';
            var No = '';
            data.forEach(function (item, index) {
                No = ((pageNo-1)*pageSize)+(index+1);
                No = No < 10 ? '0'+No : No;
                html+='<tr>'
                    +'<td>'+No+'</td>'
                    +'<td>'+item.achievementShopName+'</td>'
                    +'<td>'+item.achievementPrice+'</td>'
                    +'<td>'+item.shopId+'</td>'
                    +'</tr>'
            });
            $('#expendReport tbody').html(html);
        }
    }
    //获取前十排行
    function getTop10(type){
        //1充值  2.现金 3定金 4 消耗额 0 营业额
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "type": type,
        };
        reqAjaxAsync(REQUIRE_URL['top10'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var xData = [];
                var yData = [];
                if(type == 0){
                    res.data.forEach(function (item, index) {
                        xData.push(item.shopName);
                        yData.push(item.totalPrice)
                    });
                    initEchart({
                        domName: '.incomeChartContent',
                        xData: xData,
                        yData: yData
                    })
                }else if(type == 1){
                    res.data.forEach(function (item, index) {
                        xData.push(item.shopName);
                        yData.push(item.cashPayRecharge)
                    });
                    initEchart({
                        domName: '.incomeChartContent',
                        xData: xData,
                        yData: yData
                    })
                }else if(type == 2){
                    res.data.forEach(function (item, index) {
                        xData.push(item.shopName);
                        yData.push(item.cashPayMoney)
                    });
                    initEchart({
                        domName: '.incomeChartContent',
                        xData: xData,
                        yData: yData
                    })
                }else if(type == 3){
                    res.data.forEach(function (item, index) {
                        xData.push(item.shopName);
                        yData.push(item.cashPayAppointment)
                    });
                    initEchart({
                        domName: '.incomeChartContent',
                        xData: xData,
                        yData: yData
                    })
                }else if(type == 4){
                    res.data.forEach(function (item, index) {
                        xData.push(item.achievementShopName);
                        yData.push(item.achievementPrice)
                    });
                    initEchart({
                        domName: '.expendChartContent',
                        xData:xData,
                        yData: yData
                    })
                }
            }
        })
    }
    //切换店铺和时间刷新页面方法
    function refreshPage(isTime){
        var type = $('.tabNav .active').attr('data-type');
        if(!isTime){
            if(type == 1){
                totalMoneyReport()
            }else if(type == 2){
                incomeReport();
            }else if(type == 3){
                expendReport()
            }
        }else{
            if(type == 1){
                totalMoneyReport()
            }else if(type == 2){
                incomeReport();
                getTop10($('.chartTitle span .active').attr('data-type'));
            }else if(type == 3){
                expendReport();
                getTop10(4)
            }
        }

    }
    //获取店铺营业额占比明细
    function getTotalDetail(shopId,type,pageNo){
        //1 充值  2 现金 3 定金 4 服务业绩
        var defer = $.Deferred();
        var sTime = $('#startDate').val();
        var eTime = $('#endDate').val();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo||1,
                "rows": pageSize
            },
        };
        reqAjaxAsync(REQUIRE_URL['detail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                // layer.msg('数据加载成功',{icon:6,time:1000});
                res.type = type;
                defer.resolve(res);
            }
        });
        return defer.promise()
    }
    //服务业绩明细弹窗
    function ServicePerformancePage(obj){
        getTotalDetail(obj.data.shopId,4,1).done(function (res) {
            res.shopName = obj.data.achievementShopName;
            var html = template('ServicePerformanceTpl',res);
            layer.open({
                type:1,
                title:'',
                shade:0.5,
                shadeClose:true,
                closeBtn:0,
                area:['900px','81%'],
                content:html,
                skin:'ServicePerformancePage',
                btn:['关闭'],
                success:function (layeror, index) {
                    $('.tableBox').outerHeight($(layeror).height()-$('.detailTop').height()-$('.performanceDetailContent').outerHeight(true)-$('.layui-layer-btn').outerHeight(true)-$('.pageBox').height()-1);
                    var sTime = $('#startDate').val();
                    var eTime = $('#endDate').val();
                    var url = '/zxcity_restful/ws/reportShopBusiness/exportXlsDetail?type=4&shopId='+obj.data.shopId+'&endTime='+eTime+'&startTime='+sTime+'&backUserId='+backUserId;
                    $(layeror).find('.exportBtn').attr('href',url).click(function () {
                        if(res.total == 0){
                            layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                            return false
                        }
                    });
                    $(layeror).on('click','.closeIcon',function () {
                        layer.close(index)
                    });
                    if(res.total > pageSize){
                        $('.pageBox').show();
                        initPageSelector('performanceDetailPageSelect',res.total,function (currObj, first) {
                            getTotalDetail(obj.data.shopId,4,currObj.curr).done(function (res) {
                                showList(res,currObj.curr)
                            })
                        })
                    }else{
                        $('#performanceDetailPageSelect').html('');
                        $('.pageBox').hide();
                    }
                }
            })
        });
        function showList(resData,pageNo){
            var html = '';
            var No = '';
            // var money = '';
            if(resData.data.length > 0){
                resData.data.forEach(function (item, index) {
                    No = ((pageNo-1)*pageSize)+(index+1);
                    No = No < 10 ? '0'+No : No;
                    // if(resData.type == 1){
                    //     money = item.cashPayRecharge
                    // }else if(resData.type == 2){
                    //     money = item.cashPayMoney
                    // }else if(resData.type == 3){
                    //     money = item.cashPayAppointment
                    // }
                    html += '<tr>'
                        +'<td style="text-align: center;">'+No+'</td>'
                        +'<td>'+item.consumeTime+'</td>'
                        +'<td>'+item.serviceName+'</td>'
                        +'<td>'+item.consumerName+'</td>'
                        +'<td>'+item.userName+'</td>'
                        +'<td>'+item.achPay+'</td>'
                        +'</tr>'
                });
            }else{
                html = '<tr><td class="layui-none" colspan="6">暂无相关数据</td></tr>'
            }
            $('#performanceDetailTable tbody').html(html);
        }

    }
    //初始化页面
    init();
    function init() {
        // 获取今天日期
        var today = formatAllDate(new Date(),'yyyy-MM-dd');
        // 获取本月第一天日期
        var first = formatAllDate(new Date(),'yyyy-MM');
        first = first+'-01';
        $('#startDate').val(first);
        $('#endDate').val(today);
        // 初始化时间选择器
        initDateRange().done(function () {
            //获取店铺
            getShopList().done(function () {
                //4大冠军报表
                getChampionReport();
                // 总流水报表
                totalMoneyReport();
            })
        });
        //切换店铺
        $('#shopSelector').change(function () {
            $('.pathShopName').text($(this).find(':selected').text());
            //更新四大冠军数据
            getChampionReport();
            // 重新刷新报表数据
            refreshPage()
        });
        //切换营业收入页前十排行
        $('.chartTitle span i').click(function () {
            var type = $(this).attr('data-type');
            $(this).addClass('active').siblings('i').removeClass('active');
            var text = $(this).text();
            var index = text.indexOf('/');
            if(index > -1){
                text = text.substring(0,index);
            }
            $('.chartTitle span:nth-of-type(1)').text(text+'前十排行');
            getTop10(type)
        });
        //导出总流水，现金收入，服务业绩报表
        $('.exportBtn').on('click','a',function () {
            if(total == 0){
                layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                return false
            }
            var navType = $('.tabNav .active').attr('data-type');
            var url = '/zxcity_restful/ws/reportShopBusiness/exportXls?';
            var shopId = $('#shopSelector').val();
            var startTime = $('#startDate').val();
            var endTime = $('#endDate').val();
            var params = '';
            if(shopId === 'null'){
                params = 'type='+navType+'&endTime='+endTime+'&startTime='+startTime+'&backUserId='+backUserId;
            }else{
                params = 'type='+navType+'&endTime='+endTime+'&startTime='+startTime+'&backUserId='+backUserId+'&shopId='+shopId;
            }
            $(this).attr('href',url+params)
        });
        //动态设置遮罩高度
        $('.mask').height($(window).height()).on('click',function () {
            //点击遮罩关闭遮罩和时间选择器
            $(this).fadeOut(200);
            $('.timeRange').fadeOut(200);
            $('#startDate').val(ST);
            $('#endDate').val(ET)
        })
    }
});