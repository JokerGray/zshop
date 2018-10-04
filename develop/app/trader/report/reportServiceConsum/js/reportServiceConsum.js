$(function () {
    var pageSize = 10;
    var today = formatAllDate(new Date(), 'yyyy-MM-dd');
    var month = formatAllDate(new Date(), 'yyyy-MM');
    var year = formatAllDate(new Date(), 'yyyy');
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        teamList: 'reportProductPhase/selectTeamList',//团队列表
        pcppb: 'reportProductPhase/selectProjectByMerchantId',//获取商户下项目，卡项，商品，套餐，套盒
        serviceTotalNum: 'reportServiceConsum/getAllServiceUseCount',//总消耗次数
        topServiceName: 'reportServiceConsum/getTopOneService',//消耗次数最高的服务
        trend: 'reportServiceConsum/getCurrentConsuption',//走势图
        fromProject: 'reportServiceConsum/getUseCountAndAchByService',//按项目
        fromConsumption: 'reportServiceConsum/getServiceConsumeByType',//按消耗
        performanceDetail: 'reportServiceConsum/getUseCountServiceDetail',//服务业绩详情
        serviceCardUseDetail: 'reportServiceConsum/getServiceCardUseDetail',//服务卡消耗详情
        ServicePayUseDetail: 'reportServiceConsum/getServicePayUseDetail',//支付方式消耗详情

    };

    // 切换年月日
    $('.timeFilter').on('click', 'ul li', function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.path').find('input:eq(' + (type - 1) + ')').show().siblings('input').hide();
        getServiceTotalNum();
        getTrendData();
        refreshReport()
    });

    //切换按项目，按消耗
    $('.tabNav').on('click', 'ul li', function () {
        var navType = $(this).attr('data-navType') * 1;
        $(this).addClass('active').siblings('li').removeClass('active');
        if (navType === 1) {
            $('.project').css('display', 'inline-block').siblings('.div').css('display', 'none');
            $('.formProject').show().siblings('div').hide().end().find('tbody').html('');
            getFromProject()
        } else if (navType === 2) {
            $('.project').css('display', 'none');
            $('.fromConsumption').show().siblings('div').hide().end().find('tbody').html('');
            getFromConsumption()
        }
    });

    //查看服务业绩详情
    $('.formProject').on('click', '.seeProjectDetail', function () {
        ServicePerformanceDetail(this)
    });

    //查看消耗详情弹窗
    $('.fromConsumption').on('click', '.seeConsumptionDetail', function () {
        var type = $(this).attr('data-paytype') * 1;
        if (type === 99) {
            consumptionDetail_1()
        } else {
            consumptionDetail_2(this)
        }
    });

    function initDate() {
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            laydate.render({
                elem: '#selectedDate',
                type: 'date',
                btns: ['now', 'confirm'],
                value: new Date(),
                isInitValue: true,
                max: today,
                done: function () {
                    setTimeout(function () {
                        getServiceTotalNum();
                        getTrendData();
                        refreshReport()
                    }, 0)
                }
            });
            laydate.render({
                elem: '#selectedMonth',
                type: 'month',
                btns: ['now', 'confirm'],
                value: new Date(),
                isInitValue: true,
                max: month,
                done: function () {
                    setTimeout(function () {
                        getServiceTotalNum();
                        getTrendData();
                        refreshReport()
                    }, 0)
                }
            });
            laydate.render({
                elem: '#selectedYear',
                type: 'year',
                btns: ['now', 'confirm'],
                value: new Date(),
                isInitValue: true,
                max: year,
                done: function () {
                    setTimeout(function () {
                        getServiceTotalNum();
                        getTrendData();
                        refreshReport()
                    }, 0)
                }
            });
            var ins1 = laydate.render({
                elem: '#selfDate',
                type: 'date',
                range: '~',
                btns: ['now', 'confirm'],
                value: today + " ~ " + today,
                isInitValue: true,
                max: today,
                change: function (value, date, endDate) {
                    var s = value.split('~')[0];
                    var e = value.split('~')[1];
                    if (between(s, e).days > 30) {
                        ins1.hint('时间范围不能超过30天,请重新选择');
                    }
                },
                done: function (value, date, endDate) {
                    var s = value.split('~')[0];
                    var e = value.split('~')[1];
                    if (between(s, e).days > 30) {
                        layer.alert('时间范围不能超过30天,请重新选择', {icon: 2}, function (index) {
                            $('#selfDate').val(today + ' ~ ' + today);
                            layer.close(index);
                        });
                    } else {
                        setTimeout(function () {
                            getServiceTotalNum();
                            getTrendData();
                            refreshReport()
                        }, 0)
                    }
                }
            });
        })
    }

    //echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(obj.dom);

        // 指定图表的配置项和数据
        var option = {
            color: ['#fca259', '#ff6636', '#64c90b', '#1e9fff', '#ff0000'],
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
                data: ['服务消耗次数'],
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
                name: '次数',
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#666',
                    padding: [0, 0, 50, 0]
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
            // series: [
            //     {
            //         name:'项目',
            //         type:'line',
            //         data:[1100, 1109, 1507, 1308, 1205, 1304, 1001],
            //     },
            //     {
            //         name:'卡项',
            //         type:'line',
            //         data:[1000, 2101, 2001, 5005, 3006, 2009, 1000],
            //     },
            //     {
            //         name:'商品',
            //         type:'line',
            //         data:[1000, 1200, 1200, 1500, 1300, 1200, 1000],
            //     }
            // ],
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

    //服务业绩详情弹窗
    function ServicePerformanceDetail(_this) {
        var serviceId = $(_this).attr('data-id');
        var serviceName = $(_this).parent().parent().find('td:eq(1)').text();
        var shopName = $('#shopSelector :selected').text();
        var html = template('spDetailTpl', {serviceName: serviceName, shopName: shopName});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'spDetail',
            success: function (layeror, index) {
                getPerformanceDetail(serviceId).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                //导出报表
                $(layeror).on('click','.detailExportBtn',function () {
                    var shopId = $('#shopSelector').val() || '';
                    var type = $('.timeFilter .active').attr('data-type');
                    var startTime = '';
                    var endTime = '';
                    var userId = $('#employeeSelector').val();
                    if (type === '1') {
                        startTime = endTime = $('#selectedDate').val() || today;
                    } else if (type === '2') {
                        startTime = endTime = $('#selectedMonth').val();
                    } else if (type === '3') {
                        startTime = endTime = $('#selectedYear').val();
                    } else if (type === '4') {
                        startTime = $('#selfDate').val().split('~')[0].trim();
                        endTime = $('#selfDate').val().split('~')[1].trim();
                    }
                    var url = '/zxcity_restful/ws/reportServiceConsum/getServiceUseDetailExportXls?\n' +
                        'backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&endTime='+endTime+'&startTime='+startTime+'&serviceId='+serviceId+'&userId='+userId;
                    $(this).attr('href',url)
                })
            }
        })
    }

    //消耗详情弹窗
    function consumptionDetail_1() {
        var shopName = $('#shopSelector :selected').text();
        var html = template('consumptionDetailTpl-1', {shopName:shopName});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'consumptionDetail',
            success: function (layeror, index) {
                getServiceCardUseDetail().done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                //导出报表
                $(layeror).on('click','.detailExportBtn',function () {
                    var shopId = $('#shopSelector').val() || '';
                    var type = $('.timeFilter .active').attr('data-type');
                    var startTime = '';
                    var endTime = '';
                    var userId = $('#employeeSelector').val();
                    if (type === '1') {
                        startTime = endTime = $('#selectedDate').val() || today;
                    } else if (type === '2') {
                        startTime = endTime = $('#selectedMonth').val();
                    } else if (type === '3') {
                        startTime = endTime = $('#selectedYear').val();
                    } else if (type === '4') {
                        startTime = $('#selfDate').val().split('~')[0].trim();
                        endTime = $('#selfDate').val().split('~')[1].trim();
                    }
                    var url = '/zxcity_restful/ws/reportServiceConsum/getServiceCardUseDetailExportXls?\n' +
                        'backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&endTime='+endTime+'&startTime='+startTime+'&userId='+userId;
                    $(this).attr('href',url)
                })
            }
        })
    }

    function consumptionDetail_2(_this) {
        var payType = $(_this).attr('data-paytype');
        var payTypeName = $(_this).parent().parent().find('td:eq(1)').text();
        var shopName = $('#shopSelector :selected').text();
        var html = template('consumptionDetailTpl-2', {payTypeName: payTypeName,shopName:shopName});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'consumptionDetail',
            success: function (layeror, index) {
                getPayTypeUseDetail(payType).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                //导出报表
                $(layeror).on('click','.detailExportBtn',function () {
                    var shopId = $('#shopSelector').val() || '';
                    var type = $('.timeFilter .active').attr('data-type');
                    var startTime = '';
                    var endTime = '';
                    var userId = $('#employeeSelector').val();
                    if (type === '1') {
                        startTime = endTime = $('#selectedDate').val() || today;
                    } else if (type === '2') {
                        startTime = endTime = $('#selectedMonth').val();
                    } else if (type === '3') {
                        startTime = endTime = $('#selectedYear').val();
                    } else if (type === '4') {
                        startTime = $('#selfDate').val().split('~')[0].trim();
                        endTime = $('#selfDate').val().split('~')[1].trim();
                    }
                    var url = '/zxcity_restful/ws/reportServiceConsum/getServicePayUseDetailExportXls?\n' +
                        'backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&endTime='+endTime+'&startTime='+startTime+'&userId='+userId+'&payType='+payType;
                    $(this).attr('href',url)
                })
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

    //获取员工列表
    function getEmployeeList() {
        var defer = $.Deferred();
        var shopId = $('#shopSelector').val();
        var params = {
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['teamList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '<option value="">全部员工</option>';
                res.data.forEach(function (item, index) {
                    item.backUserList.forEach(function (v, i) {
                        html += '<option value="' + v.id + '">' + v.username + '</option>'
                    })
                });
                $('#employeeSelector').html(html);
                // teamList = res.data;
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取商户下所有服务项目
    function getAllService() {
        var defer = $.Deferred();
        var html = '<option value="">全部服务</option>';
        var params = {
            "backUserId": backUserId,
            "type": 1
        };
        reqAjaxAsync(REQUIRE_URL['pcppb'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                res.data.forEach(function (item, index) {
                    html += '<option value="' + item.id + '">' + item.serviceName + '</option>'
                });
                $('#projectSelector').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取消耗总次数
    function getServiceTotalNum() {
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        var typeText = '';
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
            typeText = '前一天'
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
            typeText = '上个月'
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
            typeText = '上一年'
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
            typeText = ''
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type
        };
        reqAjaxAsync(REQUIRE_URL['serviceTotalNum'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                reqAjaxAsync(REQUIRE_URL['topServiceName'], JSON.stringify(params)).done(function (data) {
                    if (data.code !== 1) {
                        layer.msg(data.msg, {icon: 5, time: 1500})
                    } else {
                        objNum = res.data;
                        objName = data.data;
                        var numHtml = '';
                        var nameHtml = '';
                        var text = '';
                        if (type !== 4) {
                            if (objNum.countCompare > 0) {
                                text = '高于' + typeText + '&nbsp;' + Math.abs(objNum.countCompare)
                            } else if (objNum.countCompare < 0) {
                                text = '低于' + typeText + '&nbsp;' + Math.abs(objNum.countCompare)
                            } else {
                                text = '与' + typeText + '持平'
                            }
                            numHtml = '<li>'
                                + '<p class="clearfix">'
                                + '<span>服务消耗次数</span>'
                                + '<span>' + text + '</span>'
                                + '</p>'
                                + '<h4>' + objNum.serviceUsedCount + '</h4>'
                                + '</li>'
                        } else {
                            numHtml = '<li>'
                                + '<p class="clearfix">'
                                + '<span>服务消耗次数</span>'
                                + '</p>'
                                + '<h4>' + objNum.serviceUsedCount + '</h4>'
                                + '</li>'
                        }
                        if (objName.length === 0) {
                            nameHtml = '<li>'
                                + '<p class="clearfix">消耗次数最高的服务</p>'
                                + '<h4 title="暂无">暂无</h4>'
                                + '</li>'
                        } else {
                            nameHtml = '<li>'
                                + '<p class="clearfix">消耗次数最高的服务</p>'
                                + '<h4 title="' + objName[0].serviceName + '">' + objName[0].serviceName + '</h4>'
                                + '</li>'
                        }
                        $('.reportOverview ul').html(numHtml + nameHtml)
                    }
                })
            }
        })
    }

    //获取消耗走势图
    function getTrendData() {
        var title = '';
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
            title = '最近7日服务消耗走势'
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
            title = $('#selectedMonth').val() + '服务消耗走势'
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
            title = $('#selectedYear').val() + '服务消耗走势'
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
            title = $('#selfDate').val() + '服务消耗走势'
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type
        };
        reqAjaxAsync(REQUIRE_URL['trend'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var xData = [];
                var yData = [];
                if (type === 2 && startTime === month) {
                    res.data[0] = res.data[0].slice(0, today.substring(8))
                }
                if (type === 3 && startTime === year) {
                    res.data[0] = res.data[0].slice(0, month.substring(5))
                }
                res.data[0].forEach(function (item, index) {
                    if (type !== 3) {
                        xData.push(item.time.substring(5));
                    } else {
                        xData.push(item.time);
                    }
                    yData.push(item.totalAccount)
                });
                echartsTrend({
                    title: title,
                    dom: document.querySelector('.canvasBox'),
                    xData: xData,
                    yData: [
                        {
                            name: '服务消耗次数',
                            type: 'line',
                            smooth: true,
                            data: yData,
                        },
                    ]
                });
            }
        })

    }

    //按项目
    function getFromProject(pageNo) {
        var serviceId = $('#projectSelector').val();
        var userId = $('#employeeSelector').val();
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "serviceId": serviceId,
            "userId": userId,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo || 1,
                "rows": pageSize
            },
        };
        reqAjaxAsync(REQUIRE_URL['fromProject'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                var No = '';
                if (res.total === 0) {
                    html = '<tr><td colspan="5">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.serviceName + '</td>'
                            + '<td>' + item.serviceUsedCount + '</td>'
                            + '<td>' + getMoneyFormat(item.serviceAchievement) + '</td>'
                            + '<td><a href="javascript:;" class="seeProjectDetail" data-id="' + item.serviceId + '">查看详情</a></td>'
                            + '</tr>'
                    });
                }
                $('.formProject table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        getFromProject(obj.curr)
                    })
                }
            }
        })
    }

    //按消耗
    function getFromConsumption(pageNo) {
        var userId = $('#employeeSelector').val();
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "userId": userId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['fromConsumption'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                var No = '';
                if (res.total === 0) {
                    html = '<tr><td colspan="4">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.payTypeName + '</td>'
                            + '<td>' + item.useCountTotal + '</td>'
                            + '<td><a href="javascript:;" class="seeConsumptionDetail" data-payType="' + item.payType + '">查看详情</a></td>'
                            + '</tr>'
                    });
                }
                $('.fromConsumption table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        getFromConsumption(obj.curr)
                    })
                }
            }
        })
    }

    //根据按项目，按消耗获取报表数据
    function refreshReport() {
        var navType = $('.tabNav .active').attr('data-navType') * 1;
        if (navType === 1) {
            getFromProject()
        } else if (navType === 2) {
            getFromConsumption()
        }
    }

    //获取服务项目业绩详情
    function getPerformanceDetail(serviceId, pageNo) {
        var defer = $.Deferred();
        var userId = $('#employeeSelector').val();
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "serviceId": serviceId,
            "userId": userId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['performanceDetail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                var No = '';
                if (res.total === 0) {
                    html = '<tr><td colspan="8">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.shopName + '</td>'
                            + '<td>' + item.waiterName + '</td>'
                            + '<td>' + item.userName + '</td>'
                            + '<td>' + item.serviceName + '</td>'
                            + '<td>' + item.consumeTime + '</td>'
                            + '<td>' + item.useCount + '</td>'
                            + '</tr>'
                    });
                }
                $('.detailContent table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('projectDetailPageSelector', res.total, function (obj, first) {
                        getPerformanceDetail(serviceId, obj.curr)
                    })
                }
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //服务卡消耗详情
    function getServiceCardUseDetail(pageNo) {
        var defer = $.Deferred();
        var userId = $('#employeeSelector').val();
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "userId": userId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['serviceCardUseDetail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                var No = '';
                if (res.total === 0) {
                    html = '<tr><td colspan="7" style="text-align: center">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>'+item.shopName+'</td>'
                            + '<td>' + item.waiterName + '</td>'
                            + '<td>' + item.constomerName + '</td>'
                            + '<td>' + item.serviceName + '</td>'
                            + '<td>' + item.serviceCardName + '</td>'
                            + '<td>' + item.useCount + '</td>'
                            // +'<td>200.00</td>'
                            + '</tr>'
                    });
                }
                $('.detailContent table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('consumptionDetailPageSelector-1', res.total, function (obj, first) {
                        getServiceCardUseDetail(obj.curr)
                    })
                }
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //支付方式消耗详情
    function getPayTypeUseDetail(payType, pageNo) {
        var defer = $.Deferred();
        var userId = $('#employeeSelector').val();
        var shopId = $('#shopSelector').val();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type') * 1;
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "payType": payType,
            "userId": userId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['ServicePayUseDetail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                var No = '';
                if (res.total === 0) {
                    html = '<tr><td colspan="6" style="text-align: center">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>'+item.shopName+'</td>'
                            + '<td>' + item.waiterName + '</td>'
                            + '<td>' + item.constomerName + '</td>'
                            + '<td>' + item.serviceName + '</td>'
                            + '<td>' + item.useCount + '</td>'
                            + '</tr>'
                    });
                }
                $('.detailContent table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('consumptionDetailPageSelector-2', res.total, function (obj, first) {
                        getPayTypeUseDetail(payType, obj.curr)
                    })
                }
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    layui.use('form', function () {
        var form = layui.form;
        // 初始化日期选择器
        initDate();
        //获取店铺
        getShopList().done(function () {
            // 获取团队下面的员工
            form.render('select');
            $('.selectedShopName').text($('#shopSelector :selected').text());
            getEmployeeList().done(function () {
                //更新select
                form.render('select');
            });
            getServiceTotalNum();
            getTrendData();
            getFromProject()
        });
        //获取项目
        getAllService().done(function () {
            //更新select
            form.render('select');
        });
        //切换店铺
        form.on('select(shopSelector)', function () {
            $('.selectedShopName').text($('#shopSelector :selected').text());
            // 获取团队下面的员工
            getEmployeeList().done(function () {
                //更新select
                form.render('select');
            });
            getServiceTotalNum();
            getTrendData();
            refreshReport()
        });
        //切换员工
        form.on('select(employeeSelector)', function () {
            refreshReport()
        });
        //切换项目
        form.on('select(projectSelector)', function () {
            getFromProject()
        });
        // console.log(getMoneyFormat(654654164654));
        //导出报表
        $('.exportBtn').click(function () {
            var shopId = $('#shopSelector').val() || '';
            var type = $('.timeFilter .active').attr('data-type');
            var serviceId = $('#projectSelector').val();
            var userId = $('#employeeSelector').val();
            var startTime = '';
            var endTime = '';
            if (type === '1') {
                startTime = endTime = $('#selectedDate').val() || today;
            } else if (type === '2') {
                startTime = endTime = $('#selectedMonth').val();
            } else if (type === '3') {
                startTime = endTime = $('#selectedYear').val();
            } else if (type === '4') {
                startTime = $('#selfDate').val().split('~')[0].trim();
                endTime = $('#selfDate').val().split('~')[1].trim();
            }
            var navType = $('.tabNav .active').attr('data-navType');
            var url = '';
            if (navType === '1') {
                url = '/zxcity_restful/ws/reportServiceConsum/getServiceUseAndAchExportXls?\n' +
                    'backUserId=' + backUserId + '&shopId=' + shopId + '&type=' + type + '&endTime=' + endTime + '&startTime=' + startTime + '&serviceId=' + serviceId + '&userId=' + userId;
            } else if (navType === '2') {
                url = '/zxcity_restful/ws/reportServiceConsum/getServiceConsumeByTypeExportXls?\n' +
                    'backUserId=' + backUserId + '&shopId=' + shopId + '&type=' + type + '&endTime=' + endTime + '&startTime=' + startTime + '&userId=' + userId;
            }
            $(this).attr('href', url)
        })
    })
});