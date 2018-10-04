$(document).ready(function () {
    var API = {
        merchantId: $.getQueryString('merchantId'),
        operatorId: $.getQueryString('userId'),        //操作人id
        operator: $.getQueryString('userName'),          //操作人姓名
        userCode: $.getQueryString('userCode') ,          //操作人姓名
        shopId: $.getQueryString('shopId'),

        member_id: $.getQueryString('member_id') || $.getQueryString('memberId') || '',
        findDrugDeliversList: 'medical/findMedicalDrugDeliverList',
        findDrugsList: 'medical/findDrugsList',
        findBillList: 'medical/findConsumeAccountList',
        grantReagents: 'medical/grantReagents',
        shopInfo: 'customer/getShopInfoByMerId',
        url: '/zxcity_restful/ws/rest'
        // url: 'http://127.0.0.1:3000/zxcity_restful/ws/rest'
    };
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


    var element = null;
    layui.use('element', function () {
        element = layui.element;
        //一些事件监听
        element.on('tab(drug-tab)', function (data) {
            var elem = data.elem;
            var money = 0;
            var id = $(elem).attr('lay-id');
            var tr = $(elem).find('.layui-show tbody tr');
            if(tr && tr.length <= 0) {
                if (id == 'western') {
                    tr = $(elem).find('#western-medicine tbody tr');
                    $('#western-medicine').addClass('layui-show').siblings().removeClass('layui-show');
                } else if(id == 'chinese') {
                    tr = $(elem).find('#chinese-medicine  tbody tr');
                    $('#chinese-medicine').addClass('layui-show').siblings().removeClass('layui-show');
                }
            }

            tr.each(function(index,item){
                money += Number($(item).attr('money'));
            });
            var num = $(elem).find('.layui-show tbody tr').length;
 
            $('.settlement .price').text($.number_format(money));
            $('.settlement span[data-type="purchaseNum"]').text(num);
        });
    });
    //切换标题栏 tab
    $('.title-name').on('click', function () {
        $(this).addClass('active')
        $(this).siblings().removeClass('active');
        var id = $(this).attr('id');
        toggleSearch();
        if (id == 'drug-sub') {
            $('.dispensing').hide();
            $('.treatment').show();
            getDrugOrder();
            getPispensingOrder();
        } else {
            $('.dispensing').show();
            $('.treatment').hide();
            getPispensingOrder();
        }
    })
    var params = {};
    //获取店铺信息
    getShopInfo(function (data) {
        // getshopCallback(data);
        //获取代发药
        getDrugOrder();
        getPispensingOrder(true);
    });
 
    // 监控搜索事件
    $('#charge-search').on('click', function () {
        //日期时间判断
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

        //代发药 已发药切换
        var id = $('.title-name.active').attr('id');
        if (id == 'drug-sub') { //如果是代发药
            getDrugOrder();
        } else {
            
            var dateStart = $('#date-start').val();
            var dateEnd = $('#date-end').val();
            var search = $('#search').val();
            $.tableRefresh($('#dispensing-list'), {
                cmd: API.findDrugDeliversList,
                url: API.url,
                data: {
                    merchantId: API.merchantId,
                    type: 2,
                    startTime: dateStart,
                    endTime: dateEnd,
                    param: search,
                }
            });
        }
    });
    // //点击返回
    $('.header .goback').on('click', function () {
        goback();
    });

    //代发药详情点击
    $('.treatment').on('click', '.treatment-list', function (event) {
        var event = event || window.event;
        var li = $(event.currentTarget);
        var callbackParams = {};
        callbackParams.presaleId = li.attr('presaleId');            //订单id
        callbackParams.processId = li.attr('processId');            //订单流程id
        callbackParams.memberId = li.attr('memberId');              //收费Id
        callbackParams.stockId = li.attr('stockId');
        callbackParams.userInfo = {
            memberName: li.find('.desc-name').text(),               //姓名
            age: li.find('.desc-age').text(),                 //年龄
            sex: li.find('.desc-sex').text(),                 //性别
            mobile: li.attr('mobile'),                           //联系号码
        };
        showDetails(1);
        //请求参数
        var params = {
            cmd: API.findDrugsList,
            url: API.url,
            data: {
                merchantId: API.merchantId,  //商户id 
                processId: li.attr('processId'),
            }
        }
        //初始人物信息
        initUserInfo(callbackParams.userInfo);
        // //初始化收费订单详情
        ajaxAsync(params, initDrugDetails, callbackParams);
    });
    // 点击 发药
    $('#dispens').on('click', function (event) {
        if(!$(this).hasClass('clickable'))  return;
        var obj = {
            cmd: API.grantReagents,
            url: API.url,
            data: {
                merchantId: API.merchantId,
                shopId: API.shopId,
                operatorId: API.operatorId,
                operator: API.operator,
                goods: []
            }
        };
        //遍历 药品选中
        $('#table-medicine .bs-checkbox .checked').each(function (index, value) {
            var tr = $(value).parents('tr');
            var temp = {};
            if (tr && tr.length >= 1) {
                temp.stockId = tr.attr('stockId');
                temp.drugsStatusId = tr.attr('drugsStatusId');
                temp.number = tr.attr('number');
                temp.goodsName = tr.attr('goodsName');
                temp.goodsId = tr.attr('goodsId');
                temp.unitPrice = changeTwoDecimal_f(tr.attr('unitPrice'));
                obj.data.goods.push(temp);
            }
             
        });
 
        ajaxAsync(obj, function (res) {
            setTimeout(function() {
                if (res && res.code == 1) {
                    layer.closeAll();
                    layer.msg('操作成功', {time:1000},function () {
                        layer.closeAll();
                        goback();
                    });
                } else {
                    layer.msg(res.msg,{time:2000});
                }
            }, 0);
        });
        event.stopPropagation();
        return false;
    })
 
    //切换 搜索无数据 显示 或者 隐藏 
    //params  type 1 有搜索    默认0 无搜索   isShow true显示 默认false隐藏
    function toggleSearch(search, isShow) {
        if(!isShow) {
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
    //初始化 用户信息
    function initUserInfo(params) {
        if(params == ''){
            var html = template('user-info-tpl', { data: {
                name: '',
                age: '',
                sex: '',
                mobile: ''
            } });
        }else {
             
            var html = template('user-info-tpl', { data: params });
        }
         
        $('.drug-content .user-data').html(html);
    }
    //返回
    function goback(type) {
        $('#drug-list').show();
        $('#drug-details').hide();
        toggleSearch('',false);
 
        getDrugOrder();
        setTimeout(function(){
            getPispensingOrder();
        }, 0);
    }
    //显示详情
    function showDetails(type) {
        $('#drug-list').hide();
        $('#drug-details').show();
        //清空数据
        initUserInfo('');
        $('#table-medicine').html('');
 
        settlementInfo(0,0);
        //隐藏 发药点击
        if(type == 1) {
            $('.settlement-dispensing').show();
        }else{
            $('.settlement-dispensing').hide();
        }
        element.tabChange('drug-tab', 'western');
    }
    /* 获取代发药列表*/
    function getDrugOrder(params) {
        //获取搜索信息 日期
        var dateStart = $('#date-start').val();
        var dateEnd = $('#date-end').val();
        var search = $('#search').val();
        var params = params ? params : {};
        params.search = search;
        ajaxAsync({
            url: API.url,
            cmd: API.findDrugDeliversList,
            dataType: 'json',
            data: {
                merchantId: API.merchantId,
                startTime: dateStart,
                endTime: dateEnd,
                param: search,
                type: 1,
                page: params.page || 1,
                rows: params.rows || 1000
            }
        }, initDrugOrder, params);
    }
    /* 初始化代发药列表 */
    function initDrugOrder(res, params) {
        layer.closeAll();
        if (res.code && res.code == 1) {
            if(Array.isArray(res.data) && res.data.length > 0) {
                var html = template('drug-list-tpl', { list: res.data });
                $('.treatment .treatment-data').html(html);
                //数量
                $('#drug-sub span').text(res.total);
                toggleSearch(params.search || '', false);

            }else {
                toggleSearch(params.search || '', true);
                $('.treatment .treatment-data').html('');
                $('#drug-sub span').text('0');
            }
 
        }

    }

    /* 初始化详情列表
    params:  res  ajax请求回复数据  type 1 代发药 2 已发药
    */
    function initDrugDetails(res, type) {
        if (res.code == 1) {
            var westernMedicine = [];
            var chineseMedicine = [];
 
            var medicine = [];
            res.data && res.data.forEach(function (value, index) {
                value.formatMoney = $.number_format(value.money) + '元';
                value.formatUnitPrice = $.number_format(value.unitPrice) + '元';
                 
                medicine.push(value);
            });
 
            $('#dispens').removeClass('clickable');
            $('#table-medicine').html('');
   
            //隐藏
 
            var type = type ? type : 1; //默认1 代发药
            var medicineId = '';
            if (type == 2){  //已发药
                initSentTable('table-medicine', medicine);
            } else {
                initTable('table-medicine', medicine);
            }
            calcMoney(medicine);
        }
    }
    //初始化 代发药表格
    function initTable(id, data) {
        var html = template('medicines-tpl', { list: data });
        $('#' + id).html(html);
        $('#' + id + ' tbody tr').each(function (i, item) {
            $(item).find('.bs-checkbox input').css('display', 'none');
            /* 设置已发药的样式 */
            if (data[i].drugsStatus && data[i].drugsStatus == 2) {
                $(item).addClass('sent');
            } else {
                $(item).find('.bs-checkbox span').on('click', function () {
                    $(this).toggleClass('checked');
                    //判断是否有选中 设置发药 点击激活状态
                    var checkeds = $('table tbody tr .bs-checkbox span.checked');
                    if (checkeds.length > 0) {
                        $('.settlement .settlement-dispensing span').addClass('clickable');
                    } else {
                        $('.settlement .settlement-dispensing span').removeClass('clickable');
                    }
                    //计算价格
                    // updataMoney();
                })
            }
        });
    }

    //初始化 已发药表格
    function initSentTable(id, data) {
        if(data.length == 0){
            return;
        }
        var html = template('medicines-sent-tpl', { list: data });
        $('#' + id).html(html);
 
    }
    //监控 查看详情 点击事件
    $('#dispensing-list').on('click', '.look-detail a', function (event) {
        var event = event || window.event;
        var id = $(event.currentTarget).parent().attr('data-id');
        var ele = $(event.currentTarget).parents('tr');
        //获取 订单id 订单状态 订单流程id
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.cancelBubble = true;
        var params = {
            cmd: API.findDrugsList,
            url: API.url,
            data: {
                merchantId: API.merchantId,  //商户id 
                processId: ele.attr('processId'),
            }
        };
        var trEle = $(this).parents('tr');
        var userInfo = {
            memberName: trEle.attr('memberName'),                       //姓名
            age: trEle.attr('age'),                                     //年龄
            sex: trEle.attr('sex'),                                     //性别
            mobile: trEle.attr('mobile') || trEle.attr('phone')         //联系号码
        };
 
        if (userInfo.sex == 0) {
            userInfo.sex = '女';
        } else if (userInfo.sex == 1) {
            userInfo.sex = '男';
        } else {
            userInfo.sex = '保密';
        }
        if (userInfo.age == undefined || userInfo.age == '' || userInfo.age == null){
            userInfo.age = '-';
        }

        showDetails(2);
        // 显示人物信息
        initUserInfo(userInfo);
        // 请求获取 个人账单详情
        ajaxAsync(params, initDrugDetails, 2);
        return false;
    })
    /*获取已发药列表 */
    function getPispensingOrder(isInit) {
        //获取搜索信息 日期
        var dateStart = $('#date-start').val();
        var dateEnd = $('#date-end').val();
        var search = $('#search').val();
        var params = params ? params : {};
        params.search = search;
        params.isInit = isInit || false;
        initPispensingOrder(params);
    }
    // 初始化已发药列表
    function initPispensingOrder(params) {
        // if (!res) return;
        var dateStart = $('#date-start').val();
        var dateEnd = $('#date-end').val();
        var search = $('#search').val();
        $("#dispensing-list").bootstrapTable('destroy');
        var option = $.setTableOption({
            cmd: API.findDrugDeliversList,
            url: API.url,
            data: {
                merchantId: API.merchantId,
                type: 2,
                startTime: dateStart,
                endTime: dateEnd,
                param: search,
            }
        });
        option.queryParams = function (params) {
            var p = {
                cmd: API.findDrugDeliversList,
                data: JSON.stringify({
                    merchantId: API.merchantId,
                    type: 2,
                    startTime: dateStart,
                    endTime: dateEnd,
                    param: search,
                    page: params.offset / params.limit + 1,
                    rows: params.limit
                })
            }
            return p;
        };
        option.rowAttributes = function(row, index) {
            return {
                processId: row.processId,                               //订单id
                orderStatus: row.orderStatus,                           //订单状态
                processId: row.processId,                               //订单流程id
                memberName: row.memberName,                             //患者姓名
                sex: row.sex,                                           //患者性别
                age: row.age,                                           //患者年龄
                mobile: row.mobile,                                     //患者电话
            }
        };
        option.columns = [
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
                    }
                    return '保密';
                }
            }, {
                field: 'age',
                title: '年龄',
                align: 'center',
                formatter: function (value, row, index) {
                    if (value && value.toString && value.toString().indexOf('岁') == -1) {
                        return value + '岁';
                    }
                    if(value == 0) {
                        return '0岁';
                    }
                    return value || '-';
                }
            }, {
                field: 'mobile',
                title: '手机号码',
                align: 'center'
            }, {
                field: 'serviceName',
                title: '咨询项目',
                align: 'center'
            }, {
                field: 'advUserName',
                title: '咨询医生',
                align: 'center'
            },  {
                field: 'sendTime',
                title: '发药时间',
                align: 'center'
            }, {
                field: 'operator',
                title: '发药人姓名',
                align: 'center'
            }, {
                field: 'ctrl',
                title: '操作',
                align: 'center',
                formatter: function (value, row, index) {
                    return '<div class="look-detail" data-id=' + index + '><a>查看详情</a ></div>';
                }
            }
        ];
        option.onLoadSuccess = function(res) {
            var data = res.data;
            var type = $('.title-name.active').attr('data-type');
            //tab 选中 才显示 是否有信息
            if (type == '2'){
                if (data && data.length >= 1) {
                    $('.pagination-info').show();
                    toggleSearch(search, false);

                } else {
                    toggleSearch(search, true);
                }
            }
            //显示 已发药 数量
            if (res.total && res.total > 0) {
                $('#drug-already span').text(res.total);
            } else {
                $('#drug-already span').text('0');
            }
        };
        $('#dispensing-list').bootstrapTable(option);
        $('#dispensing-list').bootstrapTable('hideLoading');
         
    }
    //设置金额 和 数量
    function settlementInfo(money, purchaseNum) {
        $('.settlement-info .price').text($.number_format(money));
        $('.settlement-info [data-type="purchaseNum"]').text(purchaseNum);
    }

    //计算金额 和 收费项
    function calcMoney(medicine) {
        var money = 0;
        var purchaseNum = 0;
        // westernMedicine && westernMedicine.forEach(function (value, index) {
        //     money += value.money;
        //     purchaseNum += 1;
        // });

        // chineseMedicine && chineseMedicine.forEach(function (value, index) {
        //     money += value.money;
        //     purchaseNum += 1;
        // });
        medicine && medicine.forEach(function (value, index) {
            money += value.money;
            purchaseNum += 1;
        });
        $('.settlement-info .price').text($.number_format(money));
        $('.settlement-info [data-type="purchaseNum"]').text(purchaseNum);
    }
    //更新选中的 金额 数量
    function updataMoney() {
        var ary = $('table tbody td span.checked');
        var money = 0;
        var purchaseNum = 0;
        ary.each(function (index, value) {
            // console.log(value, index);
            money += parseInt($(value).parents('tr').attr('money'));
            purchaseNum += 1;
        });
        $('.settlement-info .price').text($.number_format(money));
        $('.settlement-info [data-type="purchaseNum"]').text(purchaseNum);
    }
    function initTableSent(id, url, data) {
        $('#' + id).bootstrapTable({
            striped: true,
            sortable: false,
            url: 'mock.json',
            rowAttributes: function (row, index) {
                return {
                    unitPrice: row.unitPrice,
                    number: row.number,
                    money: row.money,
                }
            },
            columns: [{
                field: 'Numbear',
                title: '序号',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'goodsName',
                title: '药品名称',
                align: 'center'
            }, {
                field: 'stockName',
                title: '药品规格',
                align: 'center'
            }, {
                field: 'unitPrice',
                title: '单价',
                align: 'center'
            }, {
                field: 'number',
                title: '总量',
                align: 'center'
            }, {
                field: 'money',
                title: '金额',
                align: 'center'
            }
            ],
            responseHandler: function (res) {
                var data = {
                    actualPayment: 0.00,
                    purchaseNum: 0,
                    units: '件'
                };
                res.data.forEach(function (value, index) {
                    data.actualPayment += parseFloat(value.money);
                    data.purchaseNum += parseFloat(value.number);
                });
                data.actualPayment = $.number_format(data.actualPayment);

                html = template('settlement-info-tpl', {
                    data: data
                });
                //显示记录数据
                $('#' + id).parents('.charge-data').find('.settlement-info').html(html);
                return res;
            },
            pagination: true,
            onPostBody: function () {
            }
        })
    } 
    function initchinesePatent(data) {
        var html = template('chinese-patent-tpl', { list: data });
        $('.chinese-patent-items').html(html);
    }
    // 获取所有店铺
    function getShopInfo(callback) {
        var param = {
            url: API.url,
            cmd: API.shopInfo,
            data: {
                merchantId: API.merchantId
            }
        };
        ajaxAsync(param, function (res) {
            if(res.code == 1) {
                API.shopNames = res.data;
                API.shopId = (res.data && res.data.length >0 && res.data[0].shopId) || '';
                callback && callback(res.data);
            }else{
                setTimeout(function(){
                    layer.msg(res.msg,{time:2000});
                }, 0);
            }
        });
    }
    // 异步请求
    function ajaxAsync(params, callback, callbackParams) {
        var data = JSON.stringify(params.data);
        var index = 0;
        var option = {
            type: 'POST',  //params.type ||
            dataType: "json",
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
                setTimeout(function () {
                    layer.msg('网络错误,稍后重试');
                }, 0);
            },
            complete: function (re) {
 
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
    //转换浮点数 保留两位小数
    function changeTwoDecimal_f(x) {
        var f_x = parseFloat(x);
        if (isNaN(f_x)) {
            return '0.00';
        }
        var f_x = Math.round(x * 100) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }
});