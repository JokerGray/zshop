$(function () {
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        billingTotal: 'reportBilling/getBillingCount',//统计各类账单总金额总单数
        allBillingTotalNum: 'reportBilling/getBillingDetail',//各类账单总单数
        shopRechargeBill: 'reportBilling/getRechargeBill',//获取店铺充值账单
        shopSaleBill: 'reportBilling/getGoodsSales',//获取店铺销售账单
        shopServiceConsuption: 'reportBilling/getServiceConsuption',//获取店铺服务消耗账单
        shopDepositSales: 'reportBilling/getDepositSales',//获取店铺定金预售账单
        saleBillDetail: 'reportBilling/getGoodsSalesDetail',//销售账单明细
        preSaleDetail: 'reportBilling/getDepositSalesDetail'//定金预售明细

    };
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var today = formatAllDate(new Date(), 'yyyy-MM-dd');
    var month = formatAllDate(new Date(), 'yyyy-MM');
    var year = formatAllDate(new Date(), 'yyyy');
    // 切换年月日
    $('.timeFilter').on('click', 'ul li', function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.path').find('input:eq(' + (type - 1) + ')').show().siblings('input').hide();
        getBillTotal();
        allBillingsTotalNum()
    });

    //查看详情
    $('.tableBox').on('click', '.seeDetail', function () {
        var shopId = $(this).attr('data-shopId');
        var shopName = $(this).parent().parent().find('td:eq(1)').text();
        detailPage(shopId, shopName)
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
                        getBillTotal();
                        allBillingsTotalNum()
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
                        getBillTotal();
                        allBillingsTotalNum()
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
                        getBillTotal();
                        allBillingsTotalNum()
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
                    // var s = value.split('~')[0];
                    // var e = value.split('~')[1];
                    // if (between(s, e).days > 30) {
                    //     ins1.hint('时间范围不能超过30天,请重新选择');
                    // }
                },
                done: function (value, date, endDate) {
                    // var s = value.split('~')[0];
                    // var e = value.split('~')[1];
                    // if (between(s, e).days > 30) {
                    //     layer.alert('时间范围不能超过30天,请重新选择', {icon: 2}, function (index) {
                    //         $('#selfDate').val(today + ' ~ ' + today);
                    //         layer.close(index);
                    //     });
                    // }
                    setTimeout(function () {
                        getBillTotal();
                        allBillingsTotalNum()
                    }, 0)
                }
            });
        })
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

    //详情弹窗
    function detailPage(shopId, shopName) {
        var html = template('detailTpl', {shopName: shopName});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '75%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'detail',
            success: function (layeror, index) {
                getShopRechargeBill(shopId, 1, 1).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').outerHeight(true));
                });

                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                })
                //切换充值账单，销售账单，服务消耗，定金预售
                    .on('click', '.detailRadio ul li', function () {
                        var radioType = $(this).attr('data-type') * 1;
                        $(this).addClass('active').siblings('li').removeClass('active');
                        $('.detailContent').find('>div:eq(' + (radioType - 1) + ')').show().siblings('div').hide();
                        getShopRechargeBill(shopId, radioType, 1);
                    })
                    //查看销售账单明细
                    .on('click', '.detailContent .sale .seeSaleDetail', function () {
                        var accountId = $(this).attr('data-accountId');
                        var accountName = $(this).parent().parent().find('td:eq(2)').text();
                        detailDetailPage(1, accountId, accountName)
                    })
                    //查看定金预售明细
                    .on('click', '.detailContent .preSale .seePreSaleDetail', function () {
                        var accountId = $(this).attr('data-accountId');
                        var accountName = $(this).parent().parent().find('td:eq(2)').text();
                        detailDetailPage(2, accountId, accountName)
                    });
                //导出报表
                $(layeror).on('click', '.detailExportBtn', function () {
                    $(this).attr('href', 'javascript:;');
                    var startTime = '';
                    var endTime = '';
                    var type = $('.timeFilter .active').attr('data-type');
                    var radioType = $(layeror).find('.detailRadio .active').attr('data-type');
                    var urlArr = ['getRechargeBillExportXls', 'getGoodsSalesExportXls', 'getServiceConsuptionExportXls', 'getDepositSalesExportXls'];
                    if (type === '1') {
                        startTime = endTime = $('#selectedDate').val() || today
                    } else if (type === '2') {
                        startTime = endTime = $('#selectedMonth').val()
                    } else if (type === '3') {
                        startTime = endTime = $('#selectedYear').val()
                    } else if (type === '4') {
                        startTime = $('#selfDate').val().split('~')[0].trim();
                        endTime = $('#selfDate').val().split('~')[1].trim()
                    }
                    var url = '/zxcity_restful/ws/reportBilling/' + urlArr[radioType - 1] + '?\n' +
                        'backUserId=' + backUserId + '&shopId=' + shopId + '&type=' + type + '&endTime=' + endTime + '&startTime=' + startTime;
                    $(this).attr('href', url)
                })
            }
        })
    }

    //销售账单详情和定金预售详情弹窗
    function detailDetailPage(type, accountId, accountName) {
        getDetailDetail(type, accountId).done(function (res) {
            res.accountName = accountName;
            var html = template('detailDetailTpl', res);
            layer.open({
                type: 1,
                title: '',
                area: ['85%', '75%'],
                closeBtn: 0,
                shade: 0.1,
                shadeClose: true,
                content: html,
                skin: 'detailDetail',
                success: function (layeror, index) {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height());
                    //点击右上角关闭按钮关闭弹窗
                    $(layeror).on('click', '.top i', function () {
                        layer.close(index)
                    });
                    //导出报表
                    $(layeror).on('click', '.detailExportBtn', function () {
                        var urlArr = ['getGoodsSalesDetailExportXls', 'getDepositSalesDetailExportXls'];
                        var url = '/zxcity_restful/ws/reportBilling/' + urlArr[type - 1] + '?\n' +
                            'backUserId=' + backUserId + '&accountId=' + accountId;
                        $(this).attr('href', url)
                    })
                }
            })
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

    //获取各类账单统计总数
    function getBillTotal() {
        var shopId = $('#shopSelector').val() || null;
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type');
        if (type === '1') {
            startTime = endTime = $('#selectedDate').val() || today
        } else if (type === '2') {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === '3') {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === '4') {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var params = {
            "startTime": startTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "endTime": endTime,
            "type": type
        };
        reqAjaxAsync(REQUIRE_URL['billingTotal'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                template.defaults.imports.moneyFormat = getMoneyFormat;
                var html = template('billingTotalTpl', res.data[0]);
                $('.reportOverview ul').html(html)
            }
        })
    }

    //获取各类账单总单数
    function allBillingsTotalNum(pageNo) {
        var shopId = $('#shopSelector').val() || null;
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type');
        if (type === '1') {
            startTime = endTime = $('#selectedDate').val() || today
        } else if (type === '2') {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === '3') {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === '4') {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['allBillingTotalNum'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = pageSize * (pageNo || 1 - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.shopName + '</td>'
                            + '<td>' + item.rechargeBillNumCount + '</td>'
                            + '<td>' + item.goodsSalesNumCount + '</td>'
                            + '<td>' + item.serviceConsuptionNumCount + '</td>'
                            + '<td>' + item.depositSalesNumCount + '</td>'
                            + '<td><a href="JavaScript:;" class="seeDetail" data-shopId="' + item.shopId + '">查看详情</a></td>'
                            + '</tr>'
                    });
                }
                $('.tableBox table tbody').html(html);
                if (pageNo == 1 || !pageNo)
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        allBillingsTotalNum(obj.curr)
                    })
            }
        })
    }

    //获取店铺充值账单数据
    function getShopRechargeBill(shopId, navType, pageNo) {
        var defer = $.Deferred();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type');
        var requireArr = ['shopRechargeBill', 'shopSaleBill', 'shopServiceConsuption', 'shopDepositSales'];
        if (type === '1') {
            startTime = endTime = $('#selectedDate').val() || today
        } else if (type === '2') {
            startTime = endTime = $('#selectedMonth').val()
        } else if (type === '3') {
            startTime = endTime = $('#selectedYear').val()
        } else if (type === '4') {
            startTime = $('#selfDate').val().split('~')[0].trim();
            endTime = $('#selfDate').val().split('~')[1].trim()
        }
        var params = {
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var showListObj = {
            '1': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7" style="text-align: center;color: #666;">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + (item.salesMan || "----") + '</td>'
                            + '<td>' + item.userName + '</td>'
                            + '<td>' + item.cardName + '</td>'
                            + '<td>' + item.payType + '</td>'
                            + '<td>' + item.consumeTime + '</td>'
                            + '<td>' + item.actualPay + '</td>'
                            + '</tr>'
                    })
                }
                $('.recharge table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('detailPageSelector', res.total, function (obj, first) {
                        getShopRechargeBill(shopId, navType, obj.curr)
                    })
                }
            },
            '2': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7" style="text-align: center;color: #666;">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + (item.salesMan || "----") + '</td>'
                            + '<td>' + item.userName + '</td>'
                            + '<td>' + item.payType + '</td>'
                            + '<td>' + item.consumeTime + '</td>'
                            + '<td>' + item.actualPay + '</td>'
                            + '<td><a href="JavaScript:;" class="seeSaleDetail" data-accountId="' + item.accountId + '">查看详情</a></td>'
                            + '</tr>'
                    })
                }
                $('.sale table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('detailPageSelector', res.total, function (obj, first) {
                        getShopRechargeBill(shopId, navType, obj.curr)
                    })
                }
            },
            '3': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7" style="text-align: center;color: #666;">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.waiterName + '</td>'
                            + '<td>' + item.userName + '</td>'
                            + '<td>' + (item.serviceName || "其他") + '</td>'
                            + '<td>' + item.serviceUseType + '</td>'
                            + '<td>' + item.consumeTime + '</td>'
                            + '<td>' + item.useCount + '</td>'
                            + '</tr>'
                    })
                }
                $('.consumption table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('detailPageSelector', res.total, function (obj, first) {
                        getShopRechargeBill(shopId, navType, obj.curr)
                    })
                }
            },
            '4': function (res) {
                var html = '';
                var No = 0;
                if (res.data.length === 0) {
                    html = '<tr><td colspan="7" style="text-align: center;color: #666;">暂无相关数据</td></tr>'
                } else {
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.salesMan + '</td>'
                            + '<td>' + item.userName + '</td>'
                            + '<td>' + item.payType + '</td>'
                            + '<td>' + item.consumeTime + '</td>'
                            + '<td>' + item.actualPay + '</td>'
                            + '<td><a href="JavaScript:;" class="seePreSaleDetail" data-accountId="' + item.accountId + '">查看详情</a></td>'
                            + '</tr>'
                    })
                }
                $('.preSale table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('detailPageSelector', res.total, function (obj, first) {
                        getShopRechargeBill(shopId, navType, obj.curr)
                    })
                }
            }
        };
        reqAjaxAsync(REQUIRE_URL[requireArr[navType - 1]], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                showListObj[navType.toString()](res);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取销售账单详情和定金预售详情
    function getDetailDetail(type, accountId) {
        //type (1:销售账单明细，2：定金预售详情)
        var defer = $.Deferred();
        var requireArr = ['saleBillDetail', 'preSaleDetail'];
        var params = {
            "backUserId": backUserId,
            "accountId": accountId
        };
        reqAjaxAsync(REQUIRE_URL[requireArr[type - 1]], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    layui.use('form', function () {
        var form = layui.form;
        //获取店铺列表
        getShopList().done(function () {
            form.render('select');
            $('.selectedShopName').text($('#shopSelector :selected').text());
            getBillTotal();
            allBillingsTotalNum()
        });
        //切换店铺
        form.on('select(shopSelector)', function (value) {
            $('.path .selectedShopName').text($(value.othis[0]).find('input').val() || '全部店铺');
            getBillTotal();
            allBillingsTotalNum()
        });
        //导出报表
        $('.exportBtn').on('click', function () {
            var shopId = $('#shopSelector').val() || '';
            var startTime = '';
            var endTime = '';
            var type = $('.timeFilter .active').attr('data-type');
            if (type === '1') {
                startTime = endTime = $('#selectedDate').val() || today
            } else if (type === '2') {
                startTime = endTime = $('#selectedMonth').val()
            } else if (type === '3') {
                startTime = endTime = $('#selectedYear').val()
            } else if (type === '4') {
                startTime = $('#selfDate').val().split('~')[0].trim();
                endTime = $('#selfDate').val().split('~')[1].trim()
            }
            var url = '/zxcity_restful/ws/reportBilling/getBillingDetailExportXls?\n' +
                'backUserId=' + backUserId + '&shopId=' + shopId + '&type=' + type + '&endTime=' + endTime + '&startTime=' + startTime;
            $(this).attr('href', url)
        })
    })
});
