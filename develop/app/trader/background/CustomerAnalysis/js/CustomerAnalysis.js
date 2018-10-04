$(function () {
    var REQUIRE_URL = {
        accountList: 'shopDisplayTerminal/queryShopMemberList',//客户列表
        card_list: 'shopDisplayTerminal/pageAccountAllServiceCards', //客户服务卡项列表
        serviceRecord: 'shopStatistics/getAccountConsumptionsV2', //服务记录
        interviewRecord: 'shopDisplayTerminal/getCustomerInterviewDetailV3',//访谈记录
        orderRecord: 'shopStatistics/getAccountOrdersV2',//订单记录
        waiters: 'shopDisplayTerminal/getShopWaiterList',//获取店内服务员
        addInterview: 'shopDisplayTerminal/addCustomerInterviewV2',//新增访谈记录
        orderDetail: 'shopStatistics/getOneOrderDetail',//订单详情
        shopList: 'backUser/getCanManageTheShop', //商铺列表
        cardDetail: 'shopDisplayTerminal/getServiceCardUsedList',//卡项详情
        bookingRecord: 'shop/shopBookingList',//预约记录
        reChangeRecord: 'shopDisplayTerminal/chargeRecords',//充值记录
        arrivalRecord: 'shopDisplayTerminal/consumeBehavior',//到店记录
        subAccount:'shopDisplayTerminal/getAccounts'//获取客户子账户
    };
    var accountList = [];
    var merchantId = getUrlParams('merchantId');
    var backUserName = getUrlParams('backUserName');
    var backUserId = getUrlParams('backUserId');
    // 点击分类菜单，显示相应列表
    $('.navsBox').on('click', 'a', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        $('#selectDate').val('');
        $('.filterBox').css({'display': 'none', 'visibility': 'hidden'});
        var navType = $(this).attr('data-navType') * 1;
        if (navType === 11) {
            var index = $('.listContentBox ul').find('.active').attr('data-index');
            accountBaseInfo(index)
        } else if (navType === 22) {
            $('.navInfo').html('');
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            getCardList()
        } else if (navType === 33) {
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            getOrderRecord()
        } else if (navType === 44) {
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            getServiceRecord()
        } else if (navType === 55) {
            var selectActionHtml = $('#arrival_action').html();
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            $('#ArrivalAction').show();
            $('#selectShop').show();
            getShopList(function () {
                getArrivalRecord();
            });
            $('#arrival_action').html(selectActionHtml).off().select2({minimumResultsForSearch: -1}).on('change', function () {
                getArrivalRecord();
            });
            getArrivalRecord();
        } else if (navType === 66) {
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            getRechargeRecord();
        } else if (navType === 77) {
            var html = $('#reservation_statue').html();
            $('#reservation_statue').html('');
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            $('#reservationStatue').show();
            $('#selectShop').show();
            getReservationRecord();
            getShopList(function () {
                getReservationRecord();
            });
            $('#reservation_statue').html(html).off().select2({minimumResultsForSearch: -1}).on('change', function () {
                getReservationRecord()
            })
        } else if (navType === 88) {
            $('#selectDate').attr('placeholder', formatAllDate(new Date(), 'yyyy-MM'));
            $('.filterBox').css({'display': 'block', 'visibility': 'visible'});
            $('.filterBox >div').hide();
            $('#selectDateBox').show();
            $('#addBtnBox').show();
            getInterviewInformation();
        }
    });
    //切换客户
    $('.listContentBox').on('click', 'ul li', function () {
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.navsBox a:eq(0)').addClass('active').siblings('a').removeClass('active');
        $('.filterBox').hide();
        $('#selectDate').val('');
        accountBaseInfo($(this).index())
    });

    //获取客户列表
    getAccountList();

    function getAccountList(keyword) {
        $('.pageBox').hide();
        var params = {
            "merchantId": merchantId,
            "keyword": keyword || '',
            "pageNo": 1,
            "pageSize": 9
        };
        reqAjaxAsync(REQUIRE_URL['accountList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            layer.msg('数据加载成功', {icon: 6});
            var html = template('accountListTpl', res.data);
            accountList = res.data;
            $('.listContentBox').html(html).find('ul li:eq(0)').addClass('active');
            $('.navsBox').find('a:eq(0)').addClass('active').siblings('a').removeClass('active');
            accountBaseInfo(0);
            pagingInit({
                target:'.account-page-select',
                total:res.total,
                pageSize:params['pageSize'],
                fn:function (pageNo) {
                    params['pageNo'] = pageNo;
                    reqAjaxAsync(REQUIRE_URL['accountList'], JSON.stringify(params)).done(function (res) {
                        if (res.code !== 1) {
                            layer.msg(res.msg, {icon: 5});
                            return
                        }
                        layer.msg('数据加载成功', {icon: 6});
                        var html = template('accountListTpl', res.data);
                        accountList = res.data;
                        $('.listContentBox').html(html).find('ul li:eq(0)').addClass('active');
                        $('.navsBox').find('a:eq(0)').addClass('active').siblings('a').removeClass('active');
                        accountBaseInfo(0);
                    })
                }
            })
        })
    }

    //获取客户基本信息
    function accountBaseInfo(index) {
        var item = accountList[index];
        if(!item){
            $('.navInfo').html('');
            $('.filterBox').hide();
            return
        }
        var params = {
            "memberId": item.memberId
        };
        $('.mask').show();
        reqAjaxAsync(REQUIRE_URL['subAccount'],JSON.stringify(params)).done(function (res) {
            $('.mask').fadeOut(400);
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                $('.pageBox').hide();
                $('.filterBox').css({'display': 'none', 'visibility': 'hidden'});
                var html = template('baseInformation', res);
                $('.navInfo').html(html);
            }
        })
    }

    //搜索客户
    // $('#searchBtn').click(function () {
    //     getAccountList($('#keyword').val());
    // });
    $('#submit').submit(function () {
        getAccountList($('#keyword').val().trim());
    });

    //获取客户服务卡项
    function getCardList(pageSize) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            return
        }
        var params = {
            "memberId": memberId,
            "pageNo": 1,
            "pageSize": pageSize || 10
        };
        quireCommons(REQUIRE_URL['card_list'], params, 'serviceCardItem')
    }

    //获取服务单记录
    function getServiceRecord(pageSize) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            return
        }
        var params = {
            "memberId": memberId,
            "merchantId": merchantId,
            "pageNo": 1,
            "pageSize": pageSize || 10
        };
        quireCommons(REQUIRE_URL['serviceRecord'], params, 'serviceTicketecord');
    }

    //获取访谈记录
    function getInterviewInformation(pageSize, searchMonth) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            $('.filterBox').hide();
            return
        }
        var params = {
            "memberId": memberId,
            "searchMonth": searchMonth || '',
            "pageNo": 1,
            "pageSize": pageSize || 10
        };
        initDate();
        quireCommons(REQUIRE_URL['interviewRecord'], params, 'interviewInformation');
    }

    //获取订单记录
    function getOrderRecord(pageSize) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            return
        }
        var params = {
            "memberId": memberId,
            "merchantId": merchantId,
            "pageNo": 1,
            "pageSize": pageSize || 10
        };
        quireCommons(REQUIRE_URL['orderRecord'], params, 'orderRecord')
    }

    //获取预约记录
    function getReservationRecord(pageSize) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            $('.filterBox').hide();
            return
        }
        var params = {
            "shopId": $('.selectShop').val() || '',//-- 店铺ID
            "merchantId": merchantId,//-- 商户ID**必传**
            "bespokeStatus": $('#reservation_statue').val() || '',//-- 预约状态【0-预约中 1-已完成 2-待确认 -1已取消】
            //"customerId": accountId,//-- 客户ID
            "memberId":memberId,
            "pageNo": 1, //-- 请求数据页码
            "pageSize": pageSize || 10//-- 请求数据每页数量
        };
        quireCommons(REQUIRE_URL['bookingRecord'], params, 'reservationRecord')
    }

    //获取充值记录
    function getRechargeRecord(pageSize) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            return
        }
        var params = {
            "memberId": memberId,
            "pageNo": 1,
            "pageSize": pageSize || 10
        };
        quireCommons(REQUIRE_URL['reChangeRecord'], params, 'rechargeRecord')
    }

    //获取到店记录
    function getArrivalRecord(pageSize) {
        var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
        if(!memberId){
            $('.navInfo').html('');
            $('.filterBox').hide();
            return
        }
        var params = {
            // -- 账单类型【1-充值；2-划卡；4-预售转账单；5-消费；6-消耗】
            "memberId": memberId,    // -- 会员编号**必传**
            "orderType": $('.filterBox #arrival_action').val(),
            "shopId": $('.filterBox .selectShop').val() || '',
            "merchantId": merchantId,
            "pageNo": 1,
            "pageSize": pageSize||10
        };
        quireCommons(REQUIRE_URL['arrivalRecord'], params, 'ArrivalRecord')
    }

    //新增访谈记录
    $('#addBtn').on('click', function () {
        addInterviewInformation();
    });

    function addInterviewInformation() {
        layer.open({
            type: 1,
            content: $('#addInterviewInformation'),
            shade: 0.5,
            area: ['40%', '65%'],
            title: '',
            closeBtn: 0,
            btn: ['提交'],
            yes: function (index, layero) {
                submitAddMsg().done(function () {
                    layer.close(index);
                    getInterviewInformation();
                    $('#interviewContent').val('');
                    $('#inputWordNum').html(0)
                })
            },
            success: function (layero, index) {
                //点击右上角关闭按钮关闭弹窗
                $('.closeBtn').on('click', function () {
                    layer.close(index);
                    $('#interviewContent').val('');
                    $('#inputWordNum').html(0)
                });
                //动态显示输入字数
                $('#interviewContent').on('input', function (e) {
                    var length = $(this).val().length;
                    if(length>100){
                        length = 100
                    }
                    $('#inputWordNum').html(length)
                });
            }
        });

        //发送增加访谈记录请求
        function submitAddMsg() {
            var defer = $.Deferred();
            var interviewContent = $('#interviewContent').val();
            var memberId = $('.listContentBox').find('ul .active').attr('data-memberid');
            var memberName = $('.listContentBox').find('ul .active span:nth-of-type(1)').text();
            if (interviewContent.length === 0) {
                layer.msg('请输入访谈内容！',{icon:2});
                return
            }
            var params = {
                "employeeId": backUserId,
                "employeeName": backUserName,
                "memberId": memberId,
                "memberName": memberName,
                "description": interviewContent
            };
            reqAjaxAsync(REQUIRE_URL['addInterview'], JSON.stringify(params)).done(function (res) {
                if (res.code === 1) {
                    layer.msg(res.msg, {icon: 6,time:500},function () {
                        defer.resolve()
                    });
                }else{
                    layer.msg(res.msg, {icon: 5});
                }
            });
            return defer.promise()
        }
    }

    //查看订单详情
    $('.navInfo').on('click', '.orderRecord .viewBtn', function () {
        getOrderDetail(this).done(function (res) {
            seenOrderDetail(res)
        });
    });

    function seenOrderDetail(res) {
        var html = template('orderDetail', res);
        layer.open({
            skin: 'orderDetail',
            type: 1,
            content: html,
            shade: 0.5,
            area: ['65%', '80%'],
            title: '',
            closeBtn: 0,
            success: function (layero, index) {
                $('.detailList').height($(layero).height() - $('.title-top').height() - $('.orderPayMsg').outerHeight(true));
                //点击弹窗顶部右侧关闭按钮关闭弹窗
                $('.title-top .closeBtn').on('click', function () {
                    layer.close(index)
                })
            }
        });
    }

    //获取订单详情
    function getOrderDetail(_this) {
        var defer = $.Deferred();
        var orderId = $(_this).attr('data-orderid');
        var params = {
            "orderId": orderId
        };
        reqAjaxAsync(REQUIRE_URL['orderDetail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg,{icon:5});
                return
            }
            defer.resolve(res);
        });
        return defer.promise()
    }

    //查看卡项信息详情
    $('.navInfo').on('click', '.serviceCardItem .viewBtn', function () {
        var purchaseId = $(this).attr('data-purchaseid');
        var cardName = $(this).attr('data-cardname');
        seenServiceCardDetail(purchaseId, cardName)
    });

    function seenServiceCardDetail(purchaseId, cardName) {
        var pageSize = 10;
        getServiceCardDetail(purchaseId).done(function (res) {
            res.cardName = cardName;
            var html = template('serviceCardDetail', res);
            layer.open({
                skin: 'serviceCardDetail',
                type: 1,
                content: html,
                shade: 0.5,
                area: ['65%', '91%'],
                title: '',
                closeBtn: 0,
                success: function (layero, index) {
                    $('.detailList').outerHeight($(layero).height() - $('.title-top').height() - $('.detail-page-selector').outerHeight(true));
                    //点击弹窗顶部右侧关闭按钮关闭弹窗
                    $('.title-top .closeBtn').on('click', function () {
                        layer.close(index)
                    });
                    pagingInit({
                        target:'.detail-page-selector',
                        total:res.total,
                        pageSize:pageSize,
                        fn:function (pageNo) {
                            var params = {
                                "pageNo": pageNo,
                                "pageSize": pageSize,
                                "purchaseId": purchaseId
                            };
                            reqAjaxAsync(REQUIRE_URL['cardDetail'], JSON.stringify(params)).done(function (res) {
                                if(res.code!==1){
                                    layer.msg(res.msg,{icon:5});
                                    return
                                }
                                layer.msg('数据加载成功',{icon:6});
                                var html = '';
                                res.data.forEach(function (v, i) {
                                    if(v.serviceName === ''){
                                        v.serviceName = cardName
                                    }
                                    html += '<tr>'
                                        + '<td>' + v.serviceName+ '</td>'
                                        + '<td>' + v.presaleId + '</td>'
                                        + '<td>' + v.id + '</td>'
                                        + '<td>' + v.operator + '</td>'
                                        + '<td>' + v.waiterName + '</td>'
                                        + '<td>' + v.roomName + '</td>'
                                        + '<td>' + v.consumeTime + '</td>'
                                        + '</tr>'
                                });
                                $(layero).find('.detailList .table tbody').html(html)
                            })
                        }
                    })
                }
            });
        });

        //获取卡项详情信息
        function getServiceCardDetail(purchaseId) {
            var defer = $.Deferred();
            var params = {
                "pageNo": 1,
                "pageSize": pageSize,
                "purchaseId": purchaseId
            };
            reqAjaxAsync(REQUIRE_URL['cardDetail'], JSON.stringify(params)).done(function (res) {
                if (res.code !== 1) {
                    layer.msg(res.msg,{icon:5});
                    return
                }
                defer.resolve(res)
            });
            return defer.promise()
        }
    }

    //初始化访谈记录查询时间
    function initDate() {
        laydate.render({
            elem: '#selectDate',
            type: 'month',
            showBottom: true,
            // value: new Date(),
            // btns: ['now', 'confirm'],
            done: function (value, date, endDate) {
                getInterviewInformation(null, value)
            }
        });
    }

    //获取店铺列表
    function getShopList(fn) {
        $('.selectShop').off('change');
        var params = {
            'backUserId': parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_URL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg,{icon:5});
                return
            }
            var html = '<option value="">所有店铺</option>';
            res.data.forEach(function (v, i) {
                html += '<option value="' + v.shopId + '">' + v.shopName + '</option>'
            });
            $('.selectShop').html(html).select2().on('change', fn)
        })
    }

    //请求数据公共部分
    function quireCommons(url, params, tplId) {
        var deferred = $.Deferred();
        $('.mask').show();
        reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
            $('.mask').fadeOut(400);
            deferred.resolve(res);
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            layer.msg('数据加载成功', {icon: 6});
            if (res.total < params['pageSize']) {
                $('.pageTips').hide()
            } else {
                $('.pageTips').show()
            }
            var html = template(tplId, res);
            var pageEnd = params['pageNo'] * params['pageSize'] >= res.total ? res.total : params['pageNo'] * params['pageSize'];
            var pageStart = pageEnd >= res.total && params['pageNo'] === 1 ? 1 : (params['pageNo'] - 1) * params['pageSize'] + 1;
            var pageTotal = res.total;
            $('.navInfo').html(html);
            $('.pageBox').show();
            $('#pageStart').html(pageStart);
            $('#pageEnd').html(pageEnd);
            $('#pageTotal').html(pageTotal);
            pageSizeInit(res.total, params['pageSize']);
            pagingInit({
                target:'.pageSelector',
                total:res.total,
                pageSize:params['pageSize'],
                fn:function (pageNo) {
                    params['pageNo'] = pageNo;
                    pageEnd = params['pageNo'] * params['pageSize'] >= res.total ? res.total : params['pageNo'] * params['pageSize'];
                    pageStart = pageEnd >= res.total && params['pageNo'] === 1 ? 1 : (params['pageNo'] - 1) * params['pageSize'] + 1;
                    $('#pageStart').html(pageStart);
                    $('#pageEnd').html(pageEnd);
                    $('#pageTotal').html(pageTotal);
                    reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
                        if(res.code!==1){
                            layer.msg(res.msg,{icon:5});
                            return
                        }
                        layer.msg('数据加载成功', {icon: 6});
                        var html = template(tplId, res);
                        $('.navInfo').html(html);
                    })
                }
            })
        });
        return deferred.promise();
    }

    //初始化pageSize选择器
    function pageSizeInit(total, pageSize) {
        $('.pageBox .pageTips .btn-group .btn').html(pageSize + ' <span class="caret"></span>');
        var pageSizeArr = [10, 25, 50, 100];
        var html = '';
        pageSizeArr.forEach(function (v, i) {
            if (v <= total) {
                html += '<li><a href="javascript:;">' + v + '</a></li>'
            }
        });
        if (html !== '') {
            $('.pageBox .pageTips .btn-group .dropdown-menu').html(html)
        } else {
            $('.pageBox .pageTips .btn-group .dropdown-menu').html('<li><a href="javascript:;">' + pageSize + '</a></li>')
        }
    }

    //选择pageSize
    $('.pageBox .pageTips .btn-group .dropdown-menu').on('click', 'li', function () {
        var pageSize = $(this).text() * 1;
        var navType = $('.navsBox .active').attr('data-navType') * 1;
        $('.pageBox .pageTips .btn-group .btn').html(pageSize + ' <span class="caret"></span>');
        if (navType === 11) {
            var index = $('.listContentBox ul').find('.active').attr('data-index');
            accountBaseInfo(index)
        } else if (navType === 22) {
            getCardList(pageSize)
        } else if (navType === 33) {
            getOrderRecord(pageSize)
        } else if (navType === 44) {
            getServiceRecord(pageSize)
        } else if (navType === 55) {
            getArrivalRecord(pageSize)
        } else if (navType === 66) {
            getRechargeRecord(pageSize)
        } else if (navType === 77) {
            getReservationRecord(pageSize)
        } else if (navType === 88) {
            var searchDate = $('#selectDate').val().trim();
            getInterviewInformation(pageSize, searchDate)
        }
    });

});
