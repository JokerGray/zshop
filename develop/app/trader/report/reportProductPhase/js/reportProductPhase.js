$(function () {
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        teamList: 'reportProductPhase/selectTeamList',//团队列表
        overview: 'reportProductPhase/serchProjectCount',//概览统计
        trend: 'reportProductPhase/daysPot',//走势图
        pcppb: 'reportProductPhase/selectProjectByMerchantId',//获取商户下项目，卡项，商品，套餐，套盒
        reportList: 'reportProductPhase/selectProject',//获取按项目，按卡项，按商品，按套餐，按套盒数据
        reportDetail: 'reportProductPhase/selectProjectDetail'//获取报表详情

    };
    var pageSize = 10;
    var today = formatAllDate(new Date(), 'yyyy-MM-dd');
    var month = formatAllDate(new Date(), 'yyyy-MM');
    var year = formatAllDate(new Date(), 'yyyy');
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    var teamList = [];
    //切换按项目，按卡项，按商品
    $('.tabNav').on('click', 'ul li', function () {
        var navType = $(this).attr('data-navType') * 1;
        $(this).addClass('active').siblings('li').removeClass('active');
        if (navType === 1) {
            $('.project').css('display', 'inline-block').siblings('.div').css('display', 'none');
            $('.formProject').show().find('table tbody').html('').end().siblings('div').hide();
            // initPageSelector('reportPageSelector', 21);
        } else if (navType === 2) {
            $('.card').css('display', 'inline-block').siblings('.div').css('display', 'none');
            $('.formCard').show().find('table tbody').html('').end().siblings('div').hide();
            // initPageSelector('reportPageSelector', 31);
        } else if (navType === 3) {
            $('.product').css('display', 'inline-block').siblings('.div').css('display', 'none');
            $('.formProduct').show().find('table tbody').html('').end().siblings('div').hide();
            // initPageSelector('reportPageSelector', 41);
        } else if (navType === 4) {
            $('.formPackage').show().find('table tbody').html('').end().siblings('div').hide();
            $('.package').css('display', 'inline-block').siblings('.div').css('display', 'none');
            initPageSelector('reportPageSelector', 41);
        } else if (navType === 5) {
            $('.formSetBox').show().find('table tbody').html('').end().siblings('div').hide();
            $('.setBox').css('display', 'inline-block').siblings('.div').css('display', 'none');
            initPageSelector('reportPageSelector', 41);
        }
        //获取商户下所有项目，卡项，商品，套餐，套盒
        getPcppb().done(function () {
            //更新select
            layui.use('form', function () {
                var form = layui.form;
                form.render('select')
            })
        });
        requireDataFn();
        // reportExportUrl()
    });

    // 切换年月日
    $('.timeFilter').on('click', 'ul li', function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.path').find('input:eq(' + (type - 1) + ')').show().siblings('input').hide();
        getOverview();
        getTrend();
        requireDataFn();
        // reportExportUrl()
    });

    //查看项目详情
    $('.tableBox').on('click', '.seeProjectDetail', function () {
        var id = $(this).attr('data-id');
        var shopName = $('#shopSelector :selected').text();
        var name = $(this).parent().parent().find('td:eq(1)').text();
        projectDetailPage(id, shopName, name)
    })
    //查看卡项详情
        .on('click', '.seeCardDetail', function () {
            var id = $(this).attr('data-id');
            var shopName = $('#shopSelector :selected').text();
            var name = $(this).parent().parent().find('td:eq(1)').text();
            cardDetailPage(id, shopName, name)
        })
        // 查看商品详情
        .on('click', '.seeProductDetail', function () {
            var id = $(this).attr('data-id');
            var shopName = $('#shopSelector :selected').text();
            var name = $(this).parent().parent().find('td:eq(1)').text();
            productDetailPage(id, shopName, name)
        })
        // 查看套餐详情
        .on('click', '.seePackageDetail', function () {
            var id = $(this).attr('data-id');
            var shopName = $('#shopSelector :selected').text();
            var name = $(this).parent().parent().find('td:eq(1)').text();
            packageDetailPage(id, shopName, name)
        })
        // 查看套盒详情
        .on('click', '.seeSetBoxDetail', function () {
            var id = $(this).attr('data-id');
            var shopName = $('#shopSelector :selected').text();
            var name = $(this).parent().parent().find('td:eq(1)').text();
            setBoxDetailPage(id, shopName, name)
        });

    // 初始化日期选择器
    initDate();

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
                        getOverview();
                        getTrend();
                        requireDataFn();
                        // reportExportUrl()
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
                        getOverview();
                        getTrend();
                        requireDataFn();
                        // reportExportUrl()
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
                        getOverview();
                        getTrend();
                        requireDataFn();
                        // reportExportUrl()
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
                            getOverview();
                            getTrend();
                            requireDataFn();
                            // reportExportUrl()
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
                data: ['服务总数', '卡项总数', '商品总数', '套餐总数', '套盒总数'],
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
                name: '总数',
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#666',
                    padding: [0, 0, 70, 0]
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
                    name: '服务总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData[0],
                },
                {
                    name: '卡项总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData[1],
                },
                {
                    name: '商品总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData[2],
                },
                {
                    name: '套餐总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData[3],
                },
                {
                    name: '套盒总数',
                    type: 'line',
                    smooth: true,
                    data: obj.yData[4],
                }
            ],
            grid: {
                borderWidth: 1,
                left: '110px',
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

    //项目详情弹窗
    function projectDetailPage(id, shopName, name) {
        var html = template('projectDetailTpl', {shopName: shopName, name: name});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'projectDetail',
            success: function (layeror, index) {
                getReportDetail(id).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                // 导出
                $(layeror).on('click','.detailExportBtn',function () {
                    detailExportUrl(id,this);
                })
            }
        })
    }

    // 卡项详情弹窗
    function cardDetailPage(id, shopName, name) {
        var html = template('cardDetailTpl', {shopName: shopName, name: name});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'cardDetail',
            success: function (layeror, index) {
                getReportDetail(id, 1).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                })
                //切换直销，套餐，套盒
                    .on('click', '.detailRadio ul li', function () {
                        // var type = $(this).attr('data-type') * 1;
                        $(this).addClass('active').siblings('li').removeClass('active');
                        getReportDetail(id, 1).done(function () {
                            // //动态设置报表容器高度
                            // $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                        })
                    });
                // 导出
                $(layeror).on('click','.detailExportBtn',function () {
                    detailExportUrl(id,this);
                })
            }
        })
    }

    // 商品详情弹窗
    function productDetailPage(id, shopName, name) {
        var html = template('productDetailTpl', {shopName: shopName, name: name});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'productDetail',
            success: function (layeror, index) {
                getReportDetail(id, 1).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                })
                //切换直销，套盒
                .on('click', '.detailRadio ul li', function () {
                    // var type = $(this).attr('data-type') * 1;
                    $(this).addClass('active').siblings('li').removeClass('active');
                    getReportDetail(id, 1).done(function () {
                        // //动态设置报表容器高度
                        // $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                    })
                });
                // 导出
                $(layeror).on('click','.detailExportBtn',function () {
                    detailExportUrl(id,this);
                })
            }
        })
    }

    // 套餐详情弹窗
    function packageDetailPage(id, shopName, name) {
        var html = template('packageDetailTpl', {shopName:shopName,name:name});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'packageDetail',
            success: function (layeror, index) {
                getReportDetail(id,1).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                // 导出
                $(layeror).on('click','.detailExportBtn',function () {
                    detailExportUrl(id,this);
                })
            }
        })
    }

    //套盒详情弹窗
    function setBoxDetailPage(id, shopName, name) {
        var html = template('setBoxDetailTpl', {shopName:shopName,name:name});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'setBoxDetail',
            success: function (layeror, index) {
                getReportDetail(id,1).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').height());
                });
                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                // 导出
                $(layeror).on('click','.detailExportBtn',function () {
                    detailExportUrl(id,this);
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

    //获取概览统计
    function getOverview() {
        var type = $('.timeFilter .active').attr('data-type') * 1;
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val();
        var typeText = '昨日';
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
            typeText = '昨日'
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
            typeText = '上月'
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
            typeText = '去年'
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var params = {
            "startTime": startTime,//开始时间
            "shopId": shopId,  //店铺ID
            "type": type,      //1 昨天 2.上个月 3.去年 4 自定义
            "backUserId": backUserId,  //用户ID
            "endTime": endTime //结束时间
        };
        reqAjaxAsync(REQUIRE_URL['overview'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                res.data['typeText'] = typeText;
                var html = template('overviewTpl', res.data);
                $('.reportOverview ul').html(html);
                if (type === 4) {
                    $('.reportOverview ul li p').find('span:eq(1)').hide()
                }
            }
        })
    }

    //获取走势数据
    function getTrend() {
        var type = $('.timeFilter .active').attr('data-type') * 1;
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val();
        var typeText = '最近7天品项销售走势';
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val() || today;
            typeText = '最近7天品项销售走势'
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val();
            typeText = $('#selectedMonth').val() + '品项销售走势'
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val();
            typeText = $('#selectedYear').val() + '品项销售走势'
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim();
            typeText = $('#selfDate').val() + '品项销售走势'
        }
        var params = {
            "startTime": startTime,//开始时间
            "shopId": shopId,  //店铺ID
            "type": type,      //1 昨天 2.上个月 3.去年 4 自定义
            "backUserId": backUserId,  //用户ID
            "endTime": endTime //结束时间
        };
        reqAjaxAsync(REQUIRE_URL['trend'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var xDate = [];
                var yData0 = [];
                var yData1 = [];
                var yData2 = [];
                var yData3 = [];
                var yData4 = [];
                res.data[0].forEach(function (item, index) {
                    if (type !== 3) {
                        xDate.push(item.time.substring(5));
                    } else {
                        xDate.push(item.time);
                    }
                    yData0.push(item.totalAccount)
                });
                res.data[1].forEach(function (item, index) {
                    yData1.push(item.totalAccount)
                });
                res.data[2].forEach(function (item, index) {
                    yData2.push(item.totalAccount)
                });
                res.data[3].forEach(function (item, index) {
                    yData3.push(item.totalAccount)
                });
                res.data[4].forEach(function (item, index) {
                    yData4.push(item.totalAccount)
                });
                if (startTime === year && endTime === year) {
                    xDate.splice(parseInt(month.substring(5)))
                }
                if (startTime === month && startTime === month) {
                    xDate.splice(parseInt(today.substring(8)))
                }
                echartsTrend({
                    title: typeText,
                    dom: document.querySelector('.canvasBox'),
                    xData: xDate,
                    yData: [yData0, yData1, yData2, yData3, yData4]
                })
            }
        })
    }

    //获取团队列表
    function getTeamList() {
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
                var html = '<option value="">全部团队</option>';
                res.data.forEach(function (item, index) {
                    html += '<option value="' + item.teamId + '">' + item.teamName + '</option>'
                });
                $('#teamSelector').html(html);
                teamList = res.data;
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取员工列表
    function getEmployeeList() {
        var teamId = $('#teamSelector').val();
        var html = '<option value="">全部员工</option>';
        if (!teamId) {
            teamList.forEach(function (item, index) {
                item.backUserList.forEach(function (v, i) {
                    html += '<option value="' + v.id + '">' + v.username + '</option>'
                })
            })
        } else {
            teamList.forEach(function (item, index) {
                if (teamId == item.teamId) {
                    item.backUserList.forEach(function (v, i) {
                        html += '<option value="' + v.id + '">' + v.username + '</option>'
                    })
                }
            })
        }
        $('#employeeSelector').html(html)
    }

    //获取商户下所有项目，卡项，商品，套餐，套盒
    function getPcppb() {
        var defer = $.Deferred();
        var type = $('.tabNav .active').attr('data-navType');
        var selectorIdArr = ['projectSelector', 'cardSelector', 'productSelector', 'packageSelector', 'setBoxSelector'];
        var selectorTextArr = ['全部服务', '全部卡项', '全部商品', '全部套餐', '全部套盒'];
        var nameArr = ['serviceName', 'cardName', 'goodsName', 'packageName', 'setboxName'];
        var params = {
            "backUserId": backUserId,
            "type": type
        };
        reqAjaxAsync(REQUIRE_URL['pcppb'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '<option value="">' + selectorTextArr[type - 1] + '</option>';
                res.data.forEach(function (item, index) {
                    html += '<option value="' + item.id + '">' + item[nameArr[type - 1]] + '</option>'
                });
                $('#' + selectorIdArr[type - 1]).html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //按项目，按卡项，按商品，按套餐，按套盒的数据请求
    function requireDataFn(pageNo) {
        var defer = $.Deferred();
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val() || null;
        var change = parseInt($('.tabNav .active').attr('data-navType'));
        var serviceId = $('.middleFilterContent .div:eq(' + (change - 1) + ')').find('select').val() || null;
        var TeamId = $('#teamSelector').val() || null;
        var saleListId = $('#employeeSelector').val() || null;
        var type = parseInt($('.timeFilter .active').attr('data-type'));
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val()
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "change": change,
            "saleListId": saleListId,
            "serviceId": serviceId,
            "TeamId": TeamId,
            "type": type,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var fnObj = {
            '1': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="4">暂无相关数据</td></tr>';
                    $('.formProject table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.serviceName + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td><a href="javascript:;" class="seeProjectDetail" data-id="' + item.serviceId + '">查看详情</a></td>'
                            + '</tr>'
                    });
                    $('.formProject table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        requireDataFn(obj.curr)
                    })
                }
            },
            '2': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>';
                    $('.formCard table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.cardName + '</td>'
                            + '<td>' + item.cardTotalAccount + '</td>'
                            + '<td>' + item.cardAccount + '</td>'
                            + '<td>' + item.cardPackAccount + '</td>'
                            + '<td>' + item.cardBoxAccount + '</td>'
                            + '<td><a href="javascript:;" class="seeCardDetail" data-id="' + item.serviceCardId + '">查看详情</a></td>'
                            + '</tr>'
                    });
                    $('.formCard table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        requireDataFn(obj.curr)
                    })
                }
            },
            '3': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="6">暂无相关数据</td></tr>';
                    $('.formProduct table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.goodsName + '</td>'
                            + '<td>' + item.totalPurchaseNum + '</td>'
                            + '<td>' + item.ordinaryPurchaseNum + '</td>'
                            + '<td>' + item.boxPurchaseNum + '</td>'
                            + '<td><a href="javascript:;" class="seeProductDetail" data-id="' + item.goodsId + '">查看详情</a></td>'
                            + '</tr>'
                    });
                    $('.formProduct table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        requireDataFn(obj.curr)
                    })
                }
            },
            '4': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="4">暂无相关数据</td></tr>';
                    $('.formPackage table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.packageName + '</td>'
                            + '<td>' + item.packCount + '</td>'
                            + '<td><a href="javascript:;" class="seePackageDetail" data-id="' + item.id + '">查看详情</a></td>'
                            + '</tr>'
                    });
                    $('.formPackage table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        requireDataFn(obj.curr)
                    })
                }
            },
            '5': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="4">暂无相关数据</td></tr>';
                    $('.formSetBox table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.boxName + '</td>'
                            + '<td>' + item.PackAccount + '</td>'
                            + '<td><a href="javascript:;" class="seeSetBoxDetail" data-id="'+item.setboxId+'">查看详情</a></td>'
                            + '</tr>'
                    });
                    $('.formSetBox table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        requireDataFn(obj.curr)
                    })
                }
            }
        };
        reqAjaxAsync(REQUIRE_URL['reportList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                fnObj[change.toString()](res);
                reportExportUrl();
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    // //点击查询按钮查询
    // $('.searchBtn').on('click', function () {
    //     requireDataFn();
    //     reportExportUrl()
    // });

    //获取详情
    function getReportDetail(serviceId, pageNo) {
        var defer = $.Deferred();
        var shopId = $('#shopSelector').val() || null;
        var change = $('.tabNav ul .active').attr('data-navType');
        var saleListId = $('#employeeSelector').val() || null;
        var TeamId = $('#teamSelector').val() || null;
        var startTime = '';
        var endTime = '';
        var type = parseInt($('.timeFilter .active').attr('data-type'));
        var status = parseInt($('.detailRadio ul .active').attr('data-type'));
        if (change === '2') {
            status = status || 1
        } else if (change === '3') {
            status = status || 0
        }
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val()
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var showListObj = {
            '1': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>';
                    $('.detailContent table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.shopName + '</td>'
                            + '<td>' + item.salesman + '</td>'
                            + '<td>' + item.username + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td>' + item.time + '</td>'
                            + '<td>' + item.money + '</td>'
                            + '</tr>'
                    });
                    $('.detailContent table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('projectDetailPageSelector', res.total, function (obj, first) {
                        getReportDetail(serviceId, obj.curr)
                    })
                }
            },
            '2': function (res) {
                var html = '';
                var No = 0;
                var packageName = '';
                var setBoxName = '';
                if (res.data.length === 0) {
                    if (status === 1) {
                        html = '<tr><td colspan="7">暂无相关数据</td></tr>';
                    } else if (status === 2 || status === 4) {
                        html = '<tr><td colspan="8">暂无相关数据</td></tr>';
                    }
                    $('.detailContent table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        if (item.packageName === undefined || !item.packageName) {
                            packageName = '--'
                        }else{
                            packageName = item.packageName
                        }
                        if (item.boxName === undefined || !item.boxName) {
                            setBoxName = '--'
                        }else{
                            setBoxName = item.boxName
                        }

                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.shopName + '</td>'
                            + '<td>' + item.salesman + '</td>'
                            + '<td>' + item.username + '</td>'
                            + '<td class="packageName">' + packageName + '</td>'
                            + '<td class="setBoxName">' + setBoxName + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td>' + item.time + '</td>'
                            + '<td>' + item.money + '</td>'
                            + '</tr>'
                    });
                    $('.detailContent table tbody').html(html);
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('cardDetailPageSelector', res.total, function (obj, first) {
                        getReportDetail(serviceId, obj.curr)
                    })
                }
                if (status === 2) {
                    $('.packageName').show().siblings('.setBoxName').hide()
                } else if (status === 4) {
                    $('.setBoxName').show().siblings('.packageName').hide()
                } else if (status === 1) {
                    $('.setBoxName').hide().siblings('.packageName').hide()
                }
            },
            '3': function (res) {
                var html = '';
                var No = 0;
                var setBoxName = '';
                if (res.data.length === 0) {
                    if (status === 0) {
                        html = '<tr><td colspan="7">暂无相关数据</td></tr>';
                    } else if (status === 2) {
                        html = '<tr><td colspan="7">暂无相关数据</td></tr>';
                    }
                    $('.detailContent table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        if (item.setBoxName === undefined || !item.setBoxName) {
                            setBoxName = '--'
                        }else{
                            setBoxName = item.setBoxName
                        }
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.shopName + '</td>'
                            + '<td>' + (item.salesman || "----") + '</td>'
                            + '<td>' + item.username + '</td>'
                            + '<td class="setBoxName">' + setBoxName + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td>' + item.time + '</td>'
                            + '<td  class="money">' + item.money + '</td>'
                            + '</tr>'
                    });
                    $('.detailContent table tbody').html(html);
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('productDetailPageSelector', res.total, function (obj, first) {
                        getReportDetail(serviceId, obj.curr)
                    })
                }
                if (status === 2) {
                    $('.setBoxName').show().siblings('.packageName').hide();
                    $('.money').hide();
                } else if (status === 0) {
                    $('.setBoxName').hide().siblings('.packageName').hide();
                    $('.money').show();
                }
            },
            '4': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>';
                    $('.detailContent table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.salesman+'</td>'
                        +'<td>'+item.username+'</td>'
                        +'<td>'+item.purchaseNum+'</td>'
                        +'<td>'+item.time+'</td>'
                        +'<td>'+item.money+'</td>'
                        +'</tr>'
                    });
                    $('.detailContent table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('packageDetailPageSelector', res.total, function (obj, first) {
                        getReportDetail(serviceId, obj.curr)
                    })
                }
            },
            '5': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="9">暂无相关数据</td></tr>';
                    $('.detailContent table tbody').html(html)
                } else {
                    res.data.forEach(function (item, index) {
                        No = (index + 1) + pageSize * (pageNo ? pageNo - 1 : 0);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            +'<td>'+No+'</td>'
                            +'<td>'+item.shopName+'</td>'
                            +'<td>'+item.salesman+'</td>'
                            +'<td>'+item.username+'</td>'
                            +'<td>'+item.goodsName+'</td>'
                            +'<td>'+item.cardNsame+'</td>'
                            +'<td>'+item.purchaseNum+'</td>'
                            +'<td>'+item.time+'</td>'
                            +'<td>'+item.money+'</td>'
                            +'</tr>'
                    });
                    $('.detailContent table tbody').html(html)
                }
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('setBoxDetailPageSelector', res.total, function (obj, first) {
                        getReportDetail(serviceId, obj.curr)
                    })
                }
            }
        };
        var params = {
            "startTime": startTime,//开始时间
            "endTime": endTime, //结束时间
            "backUserId": backUserId,//商户ID
            "shopId": shopId,//电铺ID
            "change": change, ////1 项目 2 卡项 3商品 4 套餐 5 套盒
            "TeamId":TeamId,
            "saleListId": saleListId, //员工ID
            "serviceId": serviceId, //项目ID
            "status": status,// 当change=2时 （1直销 2随套餐销售 4随套盒销售）   当change=3时 （0.直销     2套盒销售）
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            },
            "type": type ////1.日 ，2月 3 年4自定义
        };
        reqAjaxAsync(REQUIRE_URL['reportDetail'], JSON.stringify(params)).done(function (res) {
            showListObj[change](res);
            defer.resolve(res);
        });
        return defer.promise()
    }

    //导出报表
    $('.exportBtn').click();

    function reportExportUrl(){
        var startTime = '';
        var endTime = '';
        var shopId = $('#shopSelector').val();
        var change = parseInt($('.tabNav .active').attr('data-navType'));
        var serviceId = $('.middleFilterContent .div:eq(' + (change - 1) + ')').find('select').val() || '';
        var TeamId = $('#teamSelector').val();
        var saleListId = $('#employeeSelector').val();
        var type = parseInt($('.timeFilter .active').attr('data-type'));
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val()
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var url = '/zxcity_restful/ws/reportProductPhase/selectProjectExcle?type='+type+'&endTime='+endTime+'&startTime='+startTime+'&backUserId='+backUserId+'&shopId='+shopId+'&serviceId='+serviceId+'&TeamId='+TeamId+'&saleListId='+saleListId+'&change='+change;
        $('.exportBtn').attr('href',url)
    }

    //导出详情报表
    function detailExportUrl(serviceId,_this){
        var shopId = $('#shopSelector').val();
        var change = $('.tabNav ul .active').attr('data-navType');
        var TeamId = $('#teamSelector').val();
        var saleListId = $('#employeeSelector').val();
        var startTime = '';
        var endTime = '';
        var type = parseInt($('.timeFilter .active').attr('data-type'));
        var status = parseInt($('.detailRadio ul .active').attr('data-type'));
        if (change === '2') {
            status = status || 1
        } else if (change === '3') {
            status = status || 0
        }else{
            status = ''
        }
        if (type === 1) {
            startTime = endTime = $('#selectedDate').val()
        } else if (type === 2) {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === 3) {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === 4) {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var url = '/zxcity_restful/ws/reportProductPhase/selectProjectDetailExcle?startTime='+startTime+'&backUserId='+backUserId+'&change='+change+'&endTime='+endTime+'&serviceId='+serviceId+'&status='+status+'&type='+type+'&shopId='+shopId+'&saleListId='+saleListId+'&TeamId='+TeamId;
        $(_this).attr('href',url)
    }

    layui.use('form', function () {
        var form = layui.form;
        //获取店铺列表
        getShopList().done(function () {
            //更新select
            form.render('select');
            $('.selectedShopName').text($('#shopSelector :selected').text());
            // 获取团队列表
            getTeamList().done(function () {
                //更新select
                form.render('select');
                // 获取员工列表
                getEmployeeList();
                //获取商户下所有项目列表
                getPcppb().done(function () {
                    //更新select
                    form.render('select')
                });
                requireDataFn();
                // reportExportUrl()
            });
            // 获取五大项
            getOverview();
            // 获取走势图
            getTrend();

        });
        //监听店铺切换
        form.on('select(shopSelector)', function (value) {
            getOverview();
            getTrend();
            getTeamList().done(function () {
                getEmployeeList();
                requireDataFn();
                form.render('select');
            });
            $('.selectedShopName').text(value.othis.find('input').val() || '全部店铺');
            // reportExportUrl()
        });
        // 监听团队切换
        form.on('select(teamSelector)', function (value) {
            getEmployeeList();
            form.render('select');
            requireDataFn()
        });
        //监听员工切换
        form.on('select(employeeSelector)',function () {
            requireDataFn()
        });
        //监听切换项目
        form.on('select(projectSelector)',function () {
            requireDataFn()
        });
        //监听切换卡项
        form.on('select(cardSelector)',function () {
            requireDataFn()
        });
        //监听切换商品
        form.on('select(productSelector)',function () {
            requireDataFn()
        });
        //监听切换套餐
        form.on('select(packageSelector)',function () {
            requireDataFn()
        });
        //监听切换套盒
        form.on('select(setBoxSelector)',function () {
            requireDataFn()
        });
    })
});