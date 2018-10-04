$(function () {
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        employeeList: 'reportProductPhase/selectTeamList',//查询店铺下所有员工
        threeChampion: 'reportWorkList/getWorkListThreeChampion',//工单总数、冠军店铺、冠军员工
        shopOrderTotal: 'reportWorkList/selectShopPresaleInfoCountList',//店铺工单总数
        shopOrderDetail: 'reportWorkList/selectWaiterPresaleInfoCountList',//店铺工单详情
        waiterOrderDetail: 'reportWorkList/selectWaiterPresaleInfoDetailList',//员工工单详情
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
        getThreeChampion();
        getShopOrderTotal()
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
                        getThreeChampion();
                        getShopOrderTotal()
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
                        getThreeChampion();
                        getShopOrderTotal()
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
                        getThreeChampion();
                        getShopOrderTotal()
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
                        getThreeChampion();
                        getShopOrderTotal()
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

    //店铺服务工单统计弹窗
    function detailPage(shopId, shopName) {
        getEmployeeList(shopId).done(function (employeeList) {
            var html = template('detailTpl', {employeeList: employeeList, shopName: shopName});
            layer.open({
                type: 1,
                title: '',
                area: ['85%', '76%'],
                closeBtn: 0,
                shade: 0.5,
                shadeClose: true,
                scrollbar:false,
                content: html,
                skin: 'detail',
                success: function (layeror, index) {
                    getShopOrderList(shopId, 1).done(function () {
                        //动态设置报表容器高度
                        $(layeror).find('.detailContent>div>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').outerHeight(true));
                    });

                    //点击右上角关闭按钮关闭弹窗
                    $(layeror).on('click', '.top i', function () {
                        layer.close(index)
                    });
                    //查看详情
                    $(layeror).on('click', '.reportServiceOrder .seeServiceOrder', function () {
                        var waiterId = $(this).attr('data-waiterid');
                        var waiterName = $(this).parent().parent().find('td:eq(1)').text();
                        detailDetailPage(shopId, shopName, waiterId, waiterName)
                    });
                    //导出报表
                    $(layeror).on('click','.detailExportBtn',function () {
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
                        var waiterId = $(layeror).find('#waiterSelector').val() || null;
                        var url = '/zxcity_restful/ws/reportWorkList/exportWaiterPresaleInfoCountList?startTime='+startTime+'&backUserId='+backUserId+'&shopId='+shopId+'&endTime='+endTime+'&type='+type+'&waiterId='+waiterId;
                        $(this).attr('href',url)
                    });
                    //切换员工
                    layui.use('form', function () {
                        var form = layui.form;
                        form.render('select');
                        form.on('select(waiterSelector)', function (value) {
                            getShopOrderList(shopId, 1)
                        })
                    })
                }
            })
        })
    }

    //员工服务工单明细详情
    function detailDetailPage(shopId, shopName, waiterId, waiterName) {
        var html = template('detailDetailTpl', {shopName: shopName, waiterName: waiterName});
        layer.open({
            type: 1,
            title: '',
            area: ['85%', '76%'],
            closeBtn: 0,
            shade: 0.1,
            shadeClose: true,
            content: html,
            skin: 'detailDetail',
            success: function (layeror, index) {
                getWaiterOrderDetail(shopId, waiterId).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailContent>div>div').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $(layeror).find('.detailPageBox').outerHeight(true));
                });

                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });

                //导出报表
                $(layeror).on('click','.detailExportBtn',function () {
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
                    var url = '/zxcity_restful/ws/reportWorkList/exportWaiterPresaleInfoDetailList?startTime='+startTime+'&backUserId='+backUserId+'&shopId='+shopId+'&endTime='+endTime+'&type='+type+'&waiterId='+waiterId;
                    $(this).attr('href',url)
                });

                //查看签名
                $(layeror).on('click', '.detailDetailContent td a', function () {
                    var signUrl = $(this).attr('data-url');
                    var json = {};
                    if (signUrl === '' || !signUrl) {
                        layer.msg('该服务单无客户签名', {icon: 5, time: 1500});
                        return
                    }
                    json = {
                        "title": "", //相册标题
                        "id": '', //相册id
                        "start": 0, //初始显示的图片序号，默认0
                        "data": [   //相册包含的图片，数组格式
                            {
                                "alt": "工单签名",
                                "pid": '', //图片id
                                "src": signUrl, //原图地址
                                "thumb": signUrl //缩略图地址
                            }
                        ]
                    };
                    layer.photos({
                        photos: json, //格式见API文档手册页
                        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
                    });
                })
            }
        })
    }

    //查看店铺服务工单统计弹窗
    $('.tableBox').on('click', '.seeDetail', function () {
        var shopId = $(this).attr('data-shopId');
        var shopName = $(this).parent().parent().find('td:eq(1)').text();
        detailPage(shopId, shopName)
    });

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

    //获取工单总数、冠军店铺、冠军员工
    function getThreeChampion() {
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
            "type": type
        };
        reqAjaxAsync(REQUIRE_URL['threeChampion'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = template('reportOverviewTpl', res);
                $('.reportOverview ul').html(html)
            }
        })
    }

    //获取店铺工单总数
    function getShopOrderTotal(pageNo) {
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
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['shopOrderTotal'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '<tr><td colspan="6">暂无相关数据</td></tr>';
                var No = '';
                if (res.total > 0) {
                    html = '';
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.shopName + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td>' + item.forceNum + '</td>'
                            + '<td>' + (item.forceNum / item.purchaseNum * 100).toFixed(2) + '%</td>'
                            + '<td><a href="JavaScript:;" class="seeDetail" data-shopId="' + item.shopId + '">查看详情</a></td>'
                            + '</tr>'
                    })
                }
                $('.tableBox table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('reportPageSelector', res.total, function (obj, first) {
                        getShopOrderTotal(obj.curr)
                    })
                }
            }
        })
    }

    //查询店铺下所有员工
    function getEmployeeList(shopId) {
        var defer = $.Deferred();
        var employeeList = [];
        var params = {
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['employeeList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                if (res.data.length !== 0) {
                    res.data.forEach(function (item, index) {
                        item.backUserList.forEach(function (v, i) {
                            employeeList.push(v)
                        })
                    });
                }
                defer.resolve(employeeList)
            }
        });
        return defer.promise()
    }

    //获取店铺服务工单统计
    function getShopOrderList(shopId, pageNo) {
        var defer = $.Deferred();
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type');
        var waiterId = $('#waiterSelector').val() || null;
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
            "waiterId": waiterId,
            "pagination": {
                "page": pageNo || 1,
                "rows": pageSize
            },
        };
        reqAjaxAsync(REQUIRE_URL['shopOrderDetail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '<tr><td colspan="6">暂无相关数据</td></tr>';
                var No = 0;
                if (res.total > 0) {
                    html = '';
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.waiterName + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td>' + item.forceNum + '</td>'
                            + '<td>' + (item.forceNum / item.purchaseNum * 100).toFixed(2) + '%</td>'
                            + '<td><a href="JavaScript:;" class="seeServiceOrder" data-waiterId="' + item.waiterId + '">查看详情</a></td>'
                            + '</tr>'
                    })
                }
                $('.reportServiceOrder table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('detailPageSelector', res.total, function (obj, first) {
                        getShopOrderList(shopId, obj.curr)
                    })
                }
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取员工工单详情
    function getWaiterOrderDetail(shopId, waiterId, pageNo) {
        var defer = $.Deferred();
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
            "waiterId": waiterId,
            "pagination": {
                "page": pageNo || 1,
                "rows": pageSize
            },
        };
        reqAjaxAsync(REQUIRE_URL['waiterOrderDetail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '<tr><td colspan="6">暂无相关数据</td></tr>';
                var No = 0;
                var orderType = '';
                var payType = '';
                if (res.total > 0) {
                    html = '';
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) - 1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if (parseInt(item.isAppoint) === 0) {
                            orderType = '普通服务单'
                        } else if (parseInt(item.isAppoint) === 1) {
                            orderType = '指定服务单'
                        }
                        if (parseInt(item.isForce) === 0) {
                            payType = '正常结算'
                        } else if (parseInt(item.isForce) === 1) {
                            payType = '强制结算'
                        }
                        html += '<tr>'
                            + '<td>' + No + '</td>'
                            + '<td>' + item.memberName + '</td>'
                            + '<td>' + orderType + '</td>'
                            + '<td>' + item.purchaseNum + '</td>'
                            + '<td>' + payType + '</td>'
                            + '<td>' + item.startTime + '</td>'
                            + '<td>' + item.endTime + '</td>'
                            + '<td>' + item.servicePerformance + '</td>'
                            + '<td>' + item.score + '</td>'
                            + '<td><a href="javascript:;" data-url="' + item.signatureUrl + '">查看签名</a></td>'
                            + '</tr>'

                    })
                }
                $('.detailDetailContent table tbody').html(html);
                if (pageNo === 1 || !pageNo) {
                    initPageSelector('detailDetailPageSelector', res.total, function (obj, first) {
                        getWaiterOrderDetail(shopId, waiterId, obj.curr)
                    })
                }
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //导出报表
    $('.exportBtn').on('click',function () {
        var startTime = '';
        var endTime = '';
        var type = $('.timeFilter .active').attr('data-type');
        var shopId = $('#shopSelector').val() || null;
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
        var url = '/zxcity_restful/ws/reportWorkList/exportShopPresaleInfoCountList?startTime='+startTime+'&backUserId='+backUserId+'&shopId='+shopId+'&endTime='+endTime+'&type='+type;
        $(this).attr('href',url)
    });

    layui.use('form', function () {
        var form = layui.form;
        //获取店铺列表
        getShopList().done(function () {
            form.render('select');
            $('.selectedShopName').text($('#shopSelector :selected').text());
            getThreeChampion();
            getShopOrderTotal()

        });
        //切换店铺
        form.on('select(shopSelector)', function (value) {
            $('.path .selectedShopName').text($(value.othis[0]).find('input').val() || '全部店铺');
            getShopOrderTotal()
        })
    })
});