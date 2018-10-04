$(document).ready(function () {
    var API = {
        merchantId: $.getQueryString('merchantId'),
        operatorId: $.getQueryString('userId'),        //操作人id
        operator: $.getQueryString('userName'),          //操作人姓名
        userCode: $.getQueryString('userCode'),          //操作人姓名
        shopId: $.getQueryString('shopId'),
        findMedicalDrugStock: 'medical/findMedicalDrugStock', //库存列表查询
        toShopGoodsNotice: 'medical/toShopGoodsNotice',   //当前预警数量查询 
        shopGoodsNotice: 'medical/shopGoodsNotice',    //修改库存预警接口
        storage: 'medical/ajaxSaveInGoods',
        delivery: 'medical/ajaxSaveOutGoods',
        userList: 'backstage/org_user_list',
        shopInfo: 'customer/getShopInfoByMerId',
        categoryList: 'medical/getMedicalGoodsTypeList',
        shopNames: [],
        // url: 'http://127.0.0.1:3000/zxcity_restful/ws/rest',
        url: '/zxcity_restful/ws/rest'

    };
 
    var isT = '';
    var downCategoryId = 0;
    laydate.render({
        elem: '#storage-date',
        done: function (value, date, endDate) {
            $('#storage-input').val(value);
            return false;
        },
        isInitValue: false
    });
    laydate.render({  //delivery-date
        elem: '#delivery-date',
        done: function (value, date, endDate) {
            $('#delivery-input').val(value);
            return false;
        },
        isInitValue: false
    });

    //获取领用人信息

    $('#storage-input').val(sessionStorage.getItem('delivery-date') || '');
    $('#delivery-input').val(sessionStorage.getItem('storage-date') || '');
 


    var form = layui.form;
    var layer = layui.layer;
    form.render();
    layui.use('form', function () {
        var form = layui.form;
 
    });

    form.on('select', function (data) {
        //切换出库 方式  当选择药品领用 则 显示 领取人下拉框
        var ele = $(data.elem).attr('id');
        if (ele == "delivery-type") {
            if (data.value == '6') {
                $('#delivery-leader').show();
            } else {
                $('#delivery-leader').hide();
            }
        } else if (ele == "drug-type") {
            search();
        } else if (ele == 'inventory-type'){
            search();
        }
    });
 
    //获取药品信息
    getCategoryId();
    //获取店铺信息
 
    getshopStock();
    // getDrugStock();
 

    //搜索
    $('#inventory-search').on('click', function () {
        search();
        return;
    });
    function search(){
        var obj = {
            cmd: API.findMedicalDrugStock,
            data: {
                merchantId: API.merchantId,
                shopId: API.shopId,
                goodsName: $('#search-name').val() || '',
                downCategoryId: $('#drug-type').val() || '',
                isT: $('#inventory-type').val() || '',
                page: 1,
                rows: 10,
            }
        };
        $.tableRefresh($('#inventory-drug'), obj);
        sessionStorage.setItem('delivery-date', $('#delivery-input').val());
        sessionStorage.setItem('storage-date', $('#storage-input').val());
    }
    // 监听点击 预警 入库 出库
    $('#inventory-drug').on('click', 'tbody tr td span', function (event) {
        var tr = $(this).parents('tr');
        var stockId = tr.attr('stockId');
        var type = $(this).attr('type');
 
        if (type == "0") {  //预警
            var params = {
                url: API.url,
                cmd: API.toShopGoodsNotice,
                data: {
                    stockId: stockId
                }
            };
            ajaxAsync(params, earlyWarining);
        } else if (type == '1') {
            initStorage(tr);
        } else if (type == '2') {
            initDelivery(tr);
        }
    });

    $('.header .goback').on('click', function () {
        goMain();
 
    });
    // 入库数量 价格修改
    $('#table-storage tbody').on('change', function (event) {
        var event = event || window.event;
        var price = $(this).find('input[data-type="price"]').val();
        var number = $(this).find('input[data-type="number"]').val();
        var totalPrice = parseFloat(price) * parseInt(number);
        $(this).find('td[data-type="totalPrice"]').text($.number_format(totalPrice));
    });
    //入库保存
    $('#storage-save').on('click', function (event) {
        var tr = $('#table-storage tbody tr');
        var number = tr.find('input[data-type="number"]').val();
        var price = tr.find('input[data-type="price"]').val();
 
        number = parseInt(number);
        if (isNaN(number) || number <= 0) {
            layer.msg('请输入入库数量 正整数');
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            layer.msg('请输入大于0单价');
            return;
        }
        var params = {
            url: API.url,
            cmd: API.storage,
            data: {
                goodsId: tr.attr('goodsId'),
                price: price,
                operatorId: API.operatorId,
                numbers: number,
                shopId: $('#storage-work').val(),
                operationTime: $('#storage-input').val(),
                stockId: tr.attr('stockId'),
                instruction: $('#storage-remarks').text() || $('#storage-remarks').val(),
                merchantId: API.merchantId,
                operator: API.operator
            }
        };
        ajaxAsync(params, function (res) {
            if (res.code == 1) {
                setTimeout(function () {
                    layer.msg('入库成功', {
                        time: 1000
                    }, function () {
                        layer.closeAll();
                        goMain();
                    });
                }, 100);
            } else {
                setTimeout(function () {
                    layer.msg(res.msg);
                },100);
            }
        });
    });

    $('#content-delivery').on('input','tr input[data-type="delivery-number"]',function(){
        var tr = $(this).parent().parent();
        var stockbalance = tr.attr('stockbalance') || 0;
        var num = $(this).val();
        if (Number(stockbalance) < Number(num)){
            layer.msg('库存数量:' + stockbalance +' 低于出库数量',{time:1000});
            $('#content-delivery tr input[data-type="delivery-number"]').val(num.substring(0,num.length-1));
            return false;
        }
    });

    //出库保存
    $('#delivery-save').on('click', function (event) {
        var tr = $('#table-delivery tbody tr');
        var stockBalance = tr.attr('stockBalance');
        var number = tr.find('input[data-type="delivery-number"]').val();
        number = parseInt(number);
        if (isNaN(number) ||  number <= 0){
            layer.msg('请输入出库数量 正整数');
            return;
        }
        if (parseInt(stockBalance) < parseInt(number)){
            layer.msg('库存不足 当前库存数量:' + stockBalance);
            return;
        }
        var params = {
            url: API.url,
            cmd: API.delivery,
            data: {
                goodsId: tr.attr('goodsId') || '',
                goodsName: tr.attr('goodsName') || '',
                stockName: tr.attr('stockName') || '-',
                operatorId: API.operatorId,
                numbers: tr.find('input[data-type="delivery-number"]').val(),
                shopId: $('#inventory-work').val(),
                operationTime: $('#delivery-input').val(),
                stockId: tr.attr('stockId') || '',
                instruction: $('#delivery-remarks').text() || $('#delivery-remarks').val(),
                merchantId: API.merchantId,
                operator: API.operator,
                inoutType: $('#delivery-type').val()
            }
        };
        //获取领用人ID
        if (params.data.inoutType == 6) {
            params.data.ioutBackUserId = $('#leader').val();
            if (params.data.ioutBackUserId == null || params.data.ioutBackUserId == ''){
                layer.msg('请选择领用人');
                return;
            }
        }
        ajaxAsync(params, function (res) {
            setTimeout(function () {
                if (res.code == 1) {
                    layer.msg('出库成功',{time:1000},function(){
                        layer.closeAll();
                        goMain();
                    });
                } else {
                    setTimeout(function () {
                        layer.msg(res.msg);
                    });
                }
            }, 100);
        });
    });

    //获取 药品id
    function getCategoryId() {
        var params = {
            url: API.url,
            cmd: API.categoryList,
            data: {
                merchantId: API.merchantId,
            }
        };
 
        ajaxAsync(params, function (res) {
            if (res.code == 1) {
               var html =  template('category-id-tpl',{list:res.data || []});
                $('#drug-type').html(html);
                form.render();
            } else {
                layer.msg('获取药品信息失败');
            }
        });
    }
    // 获取出货类型（出库方式）
    function getInoutType(value) {
        if (typeof value == "string") return '';
        if (value.indexOf('药品领用') != -1) {
            return 0;
        } else if (value.indexOf('药品损耗') != -1) {
            return 1;
        } else if (value.indexOf('药品过期') != -1) {
            return 2;
        }
        return '';
    }
    //获取药品库存信息数据
    function getDrugStock() {
        initInventoryData();
    }
    //返回
    function goMain() {
        toggleSearch('', false);
        $('#inventory-main').show();
        $('#inventory-info').hide();
        // getDrugStock();
        //重置 数据
        var obj = {
            cmd: API.findMedicalDrugStock,
            data: {
                merchantId: API.merchantId,
                shopId: API.shopId,
                goodsName: $('#search-name').val() || '',
                downCategoryId: $('#drug-type').val() || '',
                isT: $('#inventory-type').val() || '',
                page: 1,
                rows: 10,
            }
        };
        $.tableRefresh($('#inventory-drug'), obj);
    }
    //点击预警回调处理函数
    function earlyWarining(res) {
        var data = res.data;
        if (res.code == 1) {
            //弹 预警 框
            layer.open({
                type: 1,
                title: false,
                area: '500px',
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                offset: 'auto',
                content: $('#dlg-warning-tpl').html(),
                success: function (layero, index) {
                    //设置 警告数量
                    if(data.notice_num && data.notice_num >= 0){
                        $('#input-warning').val(res.data.notice_num);
                    }
                    //修改
                    $('.dlg-warning-ok').on('click', function (event) {
                        var num = $('#input-warning').val();
                        if ($.isPositiveNum(num)) {
                            editWarningNum(data, index);
                        }else {
                            layer.msg('请输入正整数');
                        }
                    });
                    //取消
                    $('.dlg-warning-cancel').on('click', function (event) {
                        layer.close(index);
                    });
                }
            });

        }
    }
    // 显示入库
    function showStorage() {
        $('#inventory-main').hide();
        $('#inventory-info').show();
        $('#content-storage').show();
        $('#content-delivery').hide();
    }
    //初始化 入库数据
    function initStorage(tr) {
        getLeaderData();
        getShopInfo();
        //设置入库表格 数据
        var data = {};
        data.goodsName = tr.attr('goodsName') || '';
        data.stockName = tr.attr('stockName') || '';
        data.stockId = tr.attr('stockId') || '';
        data.stockName = tr.attr('stockName') || '';
        data.units = tr.attr('units') || '';
        if (data.units == 'null') {
            data.units = '';
        }
        data.price = tr.attr('price') || '';
        data.goodsId = tr.attr('goodsId') || '';
        data.shopNames = API.shopNames;
        var html = template('storage-tpl', { data: data });
        $('#table-storage tbody').html(html);
        $('#storage-remarks').val('');

        $('#storage-input').val($.getDate());
        showStorage();
        form.render();
    }
    //初始化 出库数据
    function initDelivery(tr) {
        getLeaderData();
        getShopInfo();
        var data = {};
        data.goodsName = tr.attr('goodsName') || '';
        data.stockName = tr.attr('stockName') || '';
        data.stockId = tr.attr('stockId') || '';
        data.units = tr.attr('units') || '';
        data.price = tr.attr('price') || '';
        data.goodsId = tr.attr('goodsId') || '';
        data.stockBalance = tr.attr('stockBalance') || '0';
        data.shopNames = API.shopNames;
        var html = template('delivery-tpl', { data: data });
        $('#table-delivery tbody').html(html);
        $('#delivery-remarks').val('');
        $('#delivery-input').val($.getDate());
        showDelivery();
        form.render();
    }
    //显示出库
    function showDelivery() {
        $('#inventory-main').hide();
        $('#inventory-info').show();
        $('#content-delivery').show();
        $('#content-storage').hide();
    }
    // 修改预警值
    function editWarningNum(data, index) {
        var num = $('#input-warning').val();
        var params = {
            url: API.url,
            cmd: API.shopGoodsNotice,
            data: {
                goodsId: data.goods_id,
                stockId: data.stock_id,
                noticeNum: num,
                noticeType: 1,
                merchantId: API.merchantId
            }
        };
        ajaxAsync(params, function (res) {
            if (res.code == 1) {
                layer.msg('操作成功', {
                    time: 1000
                }, function () {
                     
                });
                layer.close(index);
                getDrugStock();
            } else {
                layer.msg('操作失败');
            }
        })
    }
    //切换 搜索无数据 显示 或者 隐藏 
    //params  type 1 有搜索    默认0 无搜索   isShow true显示 默认false隐藏
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

    // 初始化库存信息
    function initInventoryData() {
        var goodsName = $('#search-name').val();
        var downCategoryId = $('#drug-type').val();

        var option = $.setTableOption({
            url: API.url,
            cmd: API.findMedicalDrugStock,
            data: {
                merchantId: API.merchantId,
                shopId: API.shopId,
                goodsName: goodsName || '',
                downCategoryId: downCategoryId || '',
                isT: $('#inventory-type').val() || ''
            }
        });
        option.rowAttributes = function (row, index) {
            return {
                'stockId': row.stockId || '',
                'stockName': row.stockName || '',
                'goodsId': row.goodsId || '',
                'goodsName': row.goodsName || '',
                'downCategoryNameListStr': row.downCategoryNameListStr || '',
                'price': row.price || '',
                'stockBalance': row.stockBalance || '',
                'units': row.units || '',
                'batchPrice': row.batchPrice || '',
                'goodsStatus': row.goodsStatus || '',
                'shopStockBalance': row.shopStockBalance || ''
            }
        };
        option.columns = 
        [{
            field: 'downCategoryNameListStr',
            title: '药品类型'
        }, {
            field: 'goodsName',
            title: '药品名称'
        }, {
            field: 'stockName',
            title: '规格'
        }, {
            field: 'price',
            title: '单价( 元 )',
            formatter: function (value, row, index) {
                return $.number_format(value);
            }
        }, //{
        //     field: 'batchPrice',
        //     title: '零售单价( 元 )'
        // }, 
        {
            field: 'stockBalance',
            title: '库存总量',
            cellStyle: function (value, row, index, field) {
                if (row.isT == 1) {
                    return { css: { 'color': '#D9524E' } };
                }
                return '';
            },
            formatter: function(value,row,index) {
                return row.units ? value + row.units : value;
            }
        }, {
            field: 'ctrl',
            title: '操作',
            formatter: function (value, row, index) {
                return '<div class="drug-ctrl"><span type="0">预警</span><span>|</span><span type="1">入库</span><span>|</span><span type="2">出库</span></div>';
            }
        }];
        option.onLoadSuccess = function(res) {
            if (res.data && res.data.length == 0) {
                toggleSearch(goodsName, true);
            } else {
                toggleSearch(goodsName, false);
            }
        };
        $('#inventory-drug').bootstrapTable('destroy');
        $('#inventory-drug').bootstrapTable(option);
        $('#inventory-drug').bootstrapTable('hideLoading');
    }

    function initDrugType(res, params) {
        var data = [];
        if (res && res.data) {
            data = res.data;
        }

        var option = {
            data: data,
            rowAttributes: function (row, index) {
                return {
                    'stockId': row.stockId,
                    'stockName': row.stockName,
                    'goodsId': row.goodsId,
                    'goodsName': row.goodsName,
                    'downCategoryNameListStr': row.downCategoryNameListStr,
                    'price': row.price,
                    'stockBalance': row.stockBalance,
                    'units': row.units,
                    'batchPrice': row.batchPrice,
                    'goodsStatus': row.goodsStatus,
                    'shopStockBalance': row.shopStockBalance
                }
            },
            columns: [{
                field: 'downCategoryNameListStr',
                title: '药品类型'
            }, {
                field: 'goodsName',
                title: '药品名称'
            }, {
                field: 'stockName',
                title: '规格'
            }, {
                field: 'price',
                title: '单价( 元 )'
            }, {
                field: 'batchPrice',
                title: '零售单价( 元 )'
            }, {
                field: 'stockBalance',
                title: '库存总量',
                cellStyle: function (value, row, index, field) {

                    if (row.isT == 1) {
                        return { css: { 'color': '#D9524E' } };
                    }
                    return '';
                }
            }, {
                field: 'ctrl',
                title: '操作',
                formatter: function (value, row, index) {
                    return '<div class="drug-ctrl"><span type="0">预警</span><span>|</span><span type="1">入库</span><span>|</span><span type="2">出库</span></div>';
                }
            }]
        };
        $('#inventory-drug').bootstrapTable('destroy');
        $('#inventory-drug').bootstrapTable(option);
        if (res.data && res.data.length == 0) {
            toggleSearch(params.data.goodsName, true);
        } else {
            toggleSearch(params.data.goodsName, false);
        }
    }
    // 获取领用人信息
    function getLeaderData(shopId) {
        var param = {
            url: API.url,
            cmd: API.userList,
            data: {
                shopId: shopId || API.shopId,
                merchantId: API.merchantId
            }
        };
        ajaxAsync(param, function (res) {
            var html = '';
            if (res.code == 1) {
                res.data && res.data.forEach(function (value, index) {
                    html += '<option value="' + value.id + '"' + '>' + value.username + '</option> ';
                });
                $('#delivery-leader #leader').html(html);
                form.render();
            }
        });
    }
    // 获取所有店铺
    function getShopInfo(callback, errorCallback) {
        var param = {
            url: API.url,
            cmd: API.shopInfo,
            data: {
                merchantId: API.merchantId
            }
        };
        ajaxAsync(param, function (res) {
            setTimeout(function(){
                if (res.code == 1) {
                    API.shopNames = res.data;
                    //默认使用第一个店铺
                    API.shopId = (res.data && res.data.length > 0 && res.data[0].shopId) || '';
                    callback && callback(res.data);
                }else{
                    layer.msg(res.msg,{time:2000});
                }
            }, 0);
        },{},errorCallback);
    }
    //获取店铺库存
    var num = 0;
    function getshopStock(data) {
        setTimeout(function () {
            getShopInfo(function (data) {
                if (API.shopId) {
                    //获取领用人信息
                    getLeaderData(API.shopId);
                    //获取库存信息
                    getDrugStock();
                    return;
                }
                num++;
                if (num > 5) {
                    return;
                }
                getshopStock();
            }, function () {
                num++;
                if (num > 5) {
                    return;
                }
                getshopStock();
            });
        }, 0);
         
    }
    // 异步请求
    function ajaxAsync(params, callback, callbackParams,errorCallback) {
        var data = JSON.stringify(params.data);
        var index = 0;
        var option = {
            type: 'POST',  //params.type ||
            dataType: "json",
            cache: false,
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
                if(errorCallback){
                    errorCallback()
                }else {
                    setTimeout(function () {
                        layer.msg('网络错误,稍后重试');
                    }, 0);
                }
            },
            complete: function (re) {
                // setTimeout(function() {
                //     layer.closeAll();
                // }, 0);
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