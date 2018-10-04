
$(document).ready(function () {
    var API = {
        merchantId: $.getQueryString('merchantId'),
        operatorId: $.getQueryString('userId'),        //操作人id
        operator: $.getQueryString('userName'),        //操作人姓名
        userCode: $.getQueryString('userCode'),          
        shopId: $.getQueryString('shopId'),

        member_id: $.getQueryString('member_id') || $.getQueryString('memberId'),
        findHospitalOrder: 'medical/findHospitalOrder',
        findHospitalOrderDetails: 'medical/findHospitalOrderDetails',
        findBillList: 'medical/findConsumeAccountList',
        shopInfo: 'customer/getShopInfoByMerId',
        tollCollection: 'medical/tollCollection',     //收费功能
        // url: 'http://127.0.0.1:3000/zxcity_restful/ws/rest'
        url: '/zxcity_restful/ws/rest'
    }
    var isTest = true;
    var layer = null;
    var params = {};

    //初始化日期
    $('#date-start').val($.getDate());
    $('#date-end').val($.getDate());

    var startDate = laydate.render({
        elem: '#date-start',
        done: function (value, date) {
            var dateEnd = $('#date-end').val();
            var end = new Date(dateEnd).getTime();
            var start = new Date(value).getTime();
            if (end < start) {
                layer.msg('请选择正确的时间段!', { time: 2000 });
                $('#date-start').val($('#date-end').val());
                return;
            }
            $('#date-start').val(value);
        }
    });
    var endDate = laydate.render({
        elem: '#date-end',
        done: function (value, date) {
            var dateStart = $('#date-start').val();
            var start = new Date(dateStart).getTime();
            var end = new Date(value).getTime();
            if (end < start) {
                layer.msg('请选择正确的时间段!', { time: 2000 });
                $('#date-end').val($('#date-start').val());
                return;
            }
            $('#date-end').val(value);
        }
    });

    //隐藏 bootstrap table加载
     
    layui.use('layer', function () {
        layer = layui.layer;
        getHospitalOrder(); 
        // getBillList();
    });
    //切换标题栏 tab
    $('.title-name').on('click', function () {
        $(this).addClass('active')
        $(this).siblings().removeClass('active');
        var id = $(this).attr('id');
        if (id == 'settlement') {
            $('.record-data').css('display', 'none');
            $('.treatment').css('display', 'block');
            //获取订单
            getHospitalOrder({});
        } else {
            $('.record-data').css('display', 'block');
            $('.treatment').css('display', 'none');
            // 获取 账单
            getBillList();
        }
    })
    // 监控搜索事件
    $('#charge-search').on('click', function () {
        //判断收费结算 还是 收费记录 激活
        var dateStart = $('#date-start').val();
        var dateEnd = $('#date-end').val();
 
        if (dateStart == '' || dateEnd == '') {
            layer.msg('请选择正确的时间段!', { time: 2000 });
            return;
        }
        var start = new Date(dateStart).getTime();
        var end = new Date(dateEnd).getTime();
        if (end < start) {
            layer.msg('请选择正确的时间段!', { time: 2000 });
            return;
        }

 
        var id = $('.title-name.active').attr('id');
        if (id == 'settlement') { //如果是收费结算
            getHospitalOrder({});
        } else {
            getBillList();
        }
    });
    //收费结算 收费点击
    $('.treatment').on('click', '.treatment-list', function (event) {
        var event = event || window.event;
        var li = $(event.currentTarget);
        var callbackParams = {};
        //获取收费结算 用户信息
        callbackParams.presaleId = li.attr('presaleId');            //订单id
        callbackParams.processId = li.attr('processId');            //订单流程id
        callbackParams.orderStatus = li.attr('orderStatus');        //订单状态
        callbackParams.memberId = li.attr('memberId');              //收费Id
        callbackParams.shopId = li.attr('shopId');                  //商铺Id
        callbackParams.userInfo = {
            patientName: li.find('.desc-name').text(),              //姓名
            age: li.find('.desc-age').text(),                       //年龄
            sex: li.attr('gender'),                                 //性别
            historica: li.attr('historical'),                       //概往史
            allergy: li.attr('allergy'),                            //过敏
            mobile: li.attr('mobile')                               //联系号码
        };
        //显示 收费详情
        $('#charge-mian').hide();

        $('.settlement-pay').hide();
        initUserInfo(callbackParams.userInfo);
        $('#charge-details').show();
         
        //请求参数
        var params = {
            cmd: API.findHospitalOrderDetails,
            url: API.url,
            data: {
                merchantId: API.merchantId,  //商户id 
                presaleId: li.attr('presaleId'),
            }
        }
         
        //初始化收费订单详情
        ajaxAsync(params, initChargeDetails, callbackParams);
        //点击返回
        $('.header .goback').on('click', function () {
            goChargeMain();
        });
        //点击 收费
        $('#btn-charge').on('click', function (event) {
            var obj = {
                cmd: API.tollCollection,
                url: API.url,
                data: {
                    merchantId: API.merchantId,
                    presaleId: callbackParams.presaleId,
                    processId: callbackParams.processId,
                    shouldPay: $('.settlement-pay .settlement-info #shouldPay').text().replace(/,/g, ''),
                    actualPay:$('.settlement-pay .settlement-info #actualPay').text().replace(/,/g, ''),
                    discountMoney: $('.settlement-pay .settlement-info #discountMoney').text().replace(/,/g, ''),
                    operatorId: API.operatorId,
                    operator: API.operator,
                    subaccountId: '',
                    shopId: callbackParams.shopId,
                    memberId: callbackParams.memberId,
                    goodsService: []
                }
            };
             
            ajaxAsync(obj, function (res) {
                setTimeout(function () {
                    if (res && res.code == 1) {
                        layer.closeAll();
                        layer.msg('收费完成', {
                            time: 1200
                        }, function () {
                            goChargeMain();
                        });
                    } else {
                        layer.msg('收费失败 ' + res.msg());
                    }
                }, 0);
 
            });
            event.stopPropagation();
        })

    });

    // 获取   收费结算 治疗项目信息 选项 page row
    function getHospitalOrder(callbackParams) {
        //获取搜索信息 日期
        var dateStart = $('#date-start').val();
        var dateEnd = $('#date-end').val();
        var search = $('#search').val();
        var callbackParams = {
            dateStart: dateStart,
            dateEnd: dateEnd,
            search: search
        };
        ajaxAsync({
            url: API.url,
            cmd: API.findHospitalOrder,
            dataType: 'json',
            data: {
                merchantId: API.merchantId,
                startTime: dateStart,
                endTime: dateEnd,
                param: search,
                page: params.page || 1,
                rows: params.rows || 1000
            }
        }, initChargeOrder, callbackParams);
    }
    /* 初始化  收费结算 列表 */
    function initChargeOrder(res, callbackParams) {
        if (res.code && res.code == 1) {
            if (Array.isArray(res.data) && res.data.length == 0) {
                if (callbackParams.search) {  //如果有搜索条件
                    toggleSearch(1, true);
                } else {
                    toggleSearch(0, true);
                }
                $('.treatment .treatment-data').html('');
            } else {
                toggleSearch(0, false);
                var html = template('charge-list-tpl', { list: res.data });
                $('.treatment .treatment-data').html(html);
            }
        }else{
            lay.msg(res.msg,{time:1000});
        }
    }
 
    //切换 搜索无数据 显示 或者 隐藏 
    //params  type true 有搜索    默认 无搜索   isShow true显示 默认false隐藏
    function toggleSearch(search, isShow) {
        if (!isShow) {
            $('.no-data').hide();
            return;
        }
        var id = search ? '#no-search' : '#no-data';
        if (isShow) {
            $(id).show().siblings().hide();
            $(id).parent().show();
        } else {
            $(id).parent().hide();
        }
    }

    /* 初始化收费详情 */
    function initChargeDetails(params) {
        initChargesTable('charge-items', {
            data: params.data
        })
        //新增
        $('.table-add').on('click', function () {
            var html = '';
            html = template('charge-table-itme', {});
            if (html.indexOf('Error') < 0) {
                $('.charge-data table tbody').after(html);
            }
        });
 
    }

    /* 初始化收费详情表格数据 */
    function initChargesTable(eleId, params) {
        var option = {
            totalRows: 10,
            sortable: false,
            data: params.data,
            pageSize: 30,
            rowAttributes: function (row, index) {
                return {
                    presaleId: row.presaleId,               //订单id
                    purchaseId: row.id,                     //收费项id
                    stockId: row.stockId                    //订单流程id
                }
            },
            columns: [
                {
                    field: 'Number',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'purchaseName',
                    title: '收费名称',
                    align: 'center'
                }, {
                    field: 'medicalType',
                    title: '类型',
                    align: 'center',
                    formatter: function (value, row, index) {
                        switch (value) {
                            case 1:
                                return '检验';
                            case 2:
                                return '检查';
                            case 3:
                                return '治疗';
                            case 4:
                                return '整形';
                            case 5:
                                return '中成药';
                            case 6:
                                return '西药';
                            case 7:
                                return '皮肤';
                            case 8:
                                return '健康';
                            case 9:
                                return '护士';
                        }
                        return value;
                    }
                }, {
                    field: 'stockName',
                    title: '药品规格',
                    align: 'center'
                }, {
                    field: 'unitPrice',
                    title: '单价',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value);
                    }
                }, {
                    field: 'purchaseNum',
                    title: '总量/次数',
                    width: 100,
                    align: 'center',
                    formatter: function (value, row, index) {
                        var html = '<div class="total-num">';
                        //
                        var units = row.units ? row.units : '次';
                        html = html + '<span>' + value + '</span> <span>' + units + '</span></div>';
                        return html;
                    }
                }, {
                    field: 'originalAmount',
                    title: '总价',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value);
                    }
                }, {
                    field: 'preferentialAmount',
                    title: '优惠金额',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value);
                    }
                }, {
                    field: 'actualPayment',
                    title: '实收金额',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value);
                    }
                }, {
                    field: 'ctrl',
                    title: '操作',
                    align: 'center'
                }
            ],
            onPostBody: function () {
                //添加点击详情
                var elem = $('#' + eleId + ' tbody tr td');
                if (elem && elem.length > 1) {
                    var data = params.data;
                    //计算 合计 总量 优惠 实收 并 显示
                    var obj = {};
                    obj.originalAmount = $.calcTotal(data, 'originalAmount');                 //合计 应付
                    // obj.purchaseNum = parseInt($.calcTotal(data, 'purchaseNum'));             //数量
                    obj.purchaseNum = data.length;
                    obj.preferentialAmount = $.calcTotal(data, 'preferentialAmount');         //优惠
                    obj.actualPayment = $.calcTotal(data, 'actualPayment');                       //实收
                    html = template('settlement-tpl', {
                        data: {
                            originalAmount: obj.originalAmount,                              //总价
                            purchaseNum: obj.purchaseNum,                                   //数量
                            preferentialAmount: obj.preferentialAmount,                     //优惠金额
                            actualPayment: obj.actualPayment                                    //实收
                        }
                    });

                    $('.settlement-pay .settlement-info').html(html);
                }
                $('.settlement-pay').show();
            }
        }
        $('#' + eleId).bootstrapTable(option);
    }
    /*获取 收费记录 */
    function getBillList() {
        //获取搜索信息 日期
        var dateStart = $('#date-start').val();
        var dateEnd = $('#date-end').val();
        var search = $('#search').val();
        var callbackParams = {
            search: search
        };
        initRecordTable(params);
    }


    /* 初始化账单记录表格 */
    function initRecordTable(params) {
        $('.record-data .settlement').hide();
        $("#table-record-list").bootstrapTable('destroy');
        var params = params ? params : {};
        var search = $('#search').val();
        var option = $.setTableOption({
            url: API.url,
            cmd: API.findBillList,
            data: {
                merchantId: API.merchantId,
                startTime: $('#date-start').val(),
                endTime: $('#date-end').val(),
                param: search,
                page: params.offset / params.limit + 1,
                rows: params.limit
            },
           rowAttributes: function (row, index) {
                return {
                    presaleId: row.presaleId,                               //订单id
                    orderStatus: row.orderStatus,                           //订单状态
                    processId: row.processId,                               //订单流程id
                    memberName: row.patientName || row.memberName,           //患者姓名
                    sex: row.sex,                                           //患者性别
                    age: row.age,                                           //患者年龄
                    phone: row.phone,                                       //患者电话
                    caseNum: row.caseNum,                                   //病例号
                    shouldPay: row.shouldPay
                }
            },
            columns: [
                {
                    field: 'Number',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'memberName',
                    title: '患者姓名',
                    align: 'center'
                }, {
                    field: 'sex',
                    title: '性别',
                    align: 'center',
                    formatter: function (value, row, index) {
                        if (value == 0) {
                            return '女';
                        } else if (value == 1) {
                            return '男'
                        } else {
                            return '保密';
                        }
                        return value;
                    }
                }, {
                    field: 'age',
                    title: '年龄',
                    align: 'center',
                    formatter: function (value, row, index) {
                        if (value && value.toString().indexOf('岁') == -1) {
                            return value + '岁';
                        }else if (value == 0){
                            return  '0岁';
                        }
                        return value || '-';
                    }
                }, {
                    field: 'phone',
                    title: '手机号码',
                    align: 'center'
                }, {
                    field: 'actualPay',
                    title: '消费总金额',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return (value && $.number_format(value)) || '';
                    }
                }, {
                    field: 'treatmentProject',
                    title: '咨询项目',
                    align: 'center'
                }, {
                    field: 'consumeTime',
                    title: '收费时间',
                    align: 'center'
                }, {
                    field: 'operator',
                    title: '收费人姓名',
                    align: 'center'
                }, {
                    field: 'ctrl',
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return '<div class="look-detail" data-id=' + index + '><a>查看详情</a ></div>';
                    }
                }
            ],

        });
        option.onLoadSuccess = function(res) {
            //数据加载成功计算数据总金额
            layer.closeAll();
            // $('.fixed-table-pagination').hide();
            $('.pagination-info').show();
            $('.fixed-table-loading').hide();
            var data = res.data;

            if (data && data.length > 0) {
                toggleSearch(search, false);
                if ($('#table-record-list tbody .no-records-found').length >= 1) {
                    $('.record-data .settlement').hide();
                    $('#table-record-list tbody .no-records-found').hide();

                } else {
                    //监控 查看详情 点击事件
                    $('#table-record-list').on('click', '.look-detail a', function (event) {
                        var event = event || window.event;
                        var id = $(event.currentTarget).parent().attr('data-id');
                        var ele = $(event.currentTarget).parents('tr');
                        //获取 订单id 订单状态 订单流程id
                        var obj = {};
                        obj.presaleId = ele.attr('presaleId');
                        obj.orderStatus = ele.attr('orderStatus');
                        obj.processId = ele.attr('processId');
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.cancelBubble = true;
                        var params = {
                            cmd: API.findHospitalOrderDetails,
                            url: API.url,
                            data: {
                                merchantId: API.merchantId,  //商户id 
                                presaleId: $(this).parents('tr').attr('presaleId'),
                            }
                        };
                        var trEle = $(this).parents('tr');
                        params.userInfo = {
                            memberName: trEle.attr('memberName'),                       //姓名
                            age: trEle.attr('age') || '',                               //年龄
                            sex: trEle.attr('sex'),                                     //性别
                            historica: trEle.attr('historical'),                        //概往史
                            allergy: trEle.attr('allergy'),                             //过敏
                            mobile: trEle.attr('phone')                                 //联系号码
                        };

                        if (params.userInfo.age !== ''){
                            if (params.userInfo.age.indexOf('岁') == -1) {
                                params.userInfo.age += '岁';
                            }
                        }else {
                            params.userInfo.age = '-岁';
                        }
                        // 显示人物信息
                        var html = template('user-info-tpl', { data: params.userInfo });
                        $('#record-details .user-info').html(html);
                        //请求获取 个人账单详情
                        ajaxAsync(params, initRecordDetails);
                        //点击返回
                        $('.header .goback').on('click', function () {
                            goBill();
                        })
                        return false;
                    });
                    var numFormat = $.calcTotal(res.data, 'actualPay');
                    //设置总金额
                    $('.record-data .settlement').show();
                    $('.record-data .settlement .price').text(numFormat);
                }
            } else {
                toggleSearch(search, true);
                //设置总金额
                $('.record-data .settlement').hide();
                $('.record-data .settlement .price').text('0.00');
            }
        }
        $('#table-record-list').bootstrapTable(option);
    }

    // 初始化记录详情
    function initRecordDetails(res) {
        //判断是否有数据 有数据则显示 详情页
        if (res.data && res.data.length > 0) {
            initReordDetailsTable('record-itmes', res);
            //显示详情页
            $('#record-details').show();
            $('#charge-mian').hide();
        } else {
            setTimeout(function () {
                layer.msg(res.msg);
            }, 0);
        }
    }
    /* 初始化收费详情表格数据 */
    function initReordDetailsTable(eleId, params) {
        var option = {
            totalRows: 10,
            sortable: false,
            data: params.data,
            pageNumber: params.pageNumber || 1,     //当前页面
            pageSize: params.pageSize || 1000,        //页面大小
            rowAttributes: function (row, index) {
                return {
                    presaleId: row.presaleId,               //订单id
                    purchaseId: row.id,                     //收费项id
                    stockId: row.stockId                    //订单流程id
                }
            },
            columns: [
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'purchaseName',
                    title: '收费名称',
                    align: 'center'
                }, {
                    field: 'medicalType',
                    title: '类型',
                    align: 'center',
                    formatter: function (value, row, index) {
                        switch (value) {
                            case 1:
                                return '检验';
                            case 2:
                                return '检查';
                            case 3:
                                return '治疗';
                            case 4:
                                return '整形';
                            case 5:
                                return '中成药';
                            case 6:
                                return '西药';
                            case 7:
                                return '皮肤';
                            case 8:
                                return '健康';
                            case 9:
                                return '护士';
                        }
                        return value;
                    }
                }, {
                    field: 'stockName',
                    title: '药品规格',
                    align: 'center'
                }, {
                    field: 'unitPrice',
                    title: '单价',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value);
                    }
                }, {
                    field: 'purchaseNum',
                    title: '总量/次数',
                    width: 100,
                    align: 'center',
                    formatter: function (value, row, index) {
                        var html = '<div class="total-num">';
                        var units = row.units ? row.units : '次';
                        html = html + '<span>' + value + '</span>' + '<span>' + units + '</span></div>';
                        return html;
                    }
                }, {
                    field: 'originalAmount',
                    title: '总价',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value);
                    }
                }, {
                    field: 'preferentialAmount',
                    title: '优惠金额',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value, 2);
                    }
                }, {
                    field: 'actualPayment',
                    title: '实收金额',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return $.number_format(value, 2);
                    }
                }
            ],
            onPostBody: function () {
                //添加点击详情
                var elem = $('#' + eleId + ' tbody tr td');
                if (elem && elem.length > 1) {
                    var data = params.data;
                    //计算 合计 总量 优惠 实收 并 显示
                    var obj = {};
                    obj.originalAmount = $.calcTotal(data, 'originalAmount');          //合计
                    obj.purchaseNum = data.length;
                    obj.preferentialAmount = $.calcTotal(data, 'preferentialAmount'); //优惠
                    obj.actualPayment = $.calcTotal(data, 'actualPayment');           //实收
                    html = template('settlement-bill-tpl', {
                        data: {
                            originalAmount: obj.originalAmount,                     //总价
                            purchaseNum: obj.purchaseNum,                           //数量
                            preferentialAmount: obj.preferentialAmount,             //优惠金额
                            actualPayment: obj.actualPayment                        //实收
                        }
                    });//preferentialAmount
                    $('.settlement-record').html(html);
                }
                $('.settlement-pay').show();
            }
        }
        $('#' + eleId).bootstrapTable(option);
        $('#' + eleId).bootstrapTable('load', params.data);
    }
    //初始化人物信息
    function initUserInfo(userInfo) {
        //人物信息
        if (userInfo.age !== ''  && userInfo.age.indexOf('岁') < 0) {
            userInfo.age = userInfo.age + '岁';
        }
 
        var html = template('user-info-tpl', { data: userInfo });
        $('.user-data .user-info').html(html);
    }
    //返回订单页面
    function goChargeMain() {
        //返回显示 收费结算
        
        $('#charge-details').hide();
        $('#charge-mian').show();
        //销毁收费结算详情数据
        $('#charge-items').bootstrapTable('destroy');
        //取消监控
        $('.table-add').off('click');
        $('#btn-charge').off('click');
        $('.header .goback').off('click');
        $('.treatment ul').html('');
        layer.closeAll();
        toggleSearch();
        getHospitalOrder();
    }


    //返回账单页面
    function goBill() {
        // $('#table-record-list').off('click');
        //返回显示 收费结算
        $('#charge-mian').show();
        $('#record-details').hide();
        $('#record-itmes').bootstrapTable('destroy');
        layer.closeAll();
        toggleSearch('', false);
        getBillList();
    }
    // 异步请求
    function ajaxAsync(params, callback, callbackParams) {
        var data = JSON.stringify(params.data);
        var index = 0;
        var option = {
            type: 'POST',  //params.type ||
            dataType: "json",
            timeout: 10000, 
            headers: {
                apikey: 'test'
            },
            data: {
                cmd: params.cmd,
                data: data
            },
            beforeSend: function (request) {
                layer.close(index);
                index = layer.load(1, { shade: [0.3, "#fff"] })
            },
            success: function (res) {
                layer.close(index);
                callback && callback(res, callbackParams);
            },
            error: function (re) {
                setTimeout(function() {
                    layer.msg('网络错误,稍后重试');
                }, 0);
            },
            complete: function (re) {
                // layer.closeAll();
                layer.close(index);
            }
        };
        if (params.type) {
            option.type = params.type;
        }
        if (params.url) {
            option.url = params.url;
        }
        //console.log(option);
        $.ajax(option);
    }
});

