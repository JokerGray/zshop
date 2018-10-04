
$(window).ready(function(){
    var table = layui.table;
    var API = {
        findRank: 'reportDishesSale/selectShopDishesSaleList',
        findBill: 'reportDishesSale/selectShopConsumeAccountList',
        findAmount: 'reportDishesSale/selectShopBusinessAmount',
        shopId: getUrlParams("shopId") || '',
        merchantId: getUrlParams('merchantId') || '',
        userId: getUrlParams('userId') || '',
        backUserId: getUrlParams('backUserId') || '',
        name: getUrlParams('userName') || '',
    }
    layui.use(['laydate','layer','form','element','table'],function(){
        window.laydate = layui.laydate;
        table = layui.table;

        $('.header-tabs').on('click', 'span', function () {
            $(this).addClass('active').siblings().removeClass('active');
            //切换显示 
            var type = $(this).attr('data-type');
            if(type == 2){
                $(".header").find('.type2').hide()
            }else{
                $(".header").find('.type2').show()
            }
            $(`.tab-contents .tab-content[data-type="${type}"]`).show().siblings().hide();
        });
    
        initDateTime();
        window.objRank = new initTable({
            type: API.findRank,
            id: 'table-rank',
            page: 'page-rank',
            cols: [[{
                title: '销售排行',
                field: 'rank',
                width: 120,
                templet: function(d){
                    if(objRank.curr == 1) {  //判断排行是否是第一页
                        switch (d.LAY_INDEX) {
                            case 1:
                                return '<div class="rank-img-box"><img src="img/top1.png" alt=""></img></div>';
                            case 2:
                                return '<div class="rank-img-box"><img src="img/top2.png" alt=""></img></div>';
                            case 3:
                                return '<div class="rank-img-box"><img src="img/top3.png" alt=""></img></div>';
                        }
                    }
                    return d.LAY_INDEX + (objRank.curr - 1) * 10;
                },
            }, {
                title: '商品名称',
                field: 'goodsName',
                align: 'center',
            }, {
                title: '商品分类',
                field: 'categoryName',
                align: 'center'
            }, {
                title: '销售数量',
                field: 'purchaseNum',
                align: 'center'
            }]]
        })
        objRank.init();
        window.objBill = new initTable({
            type: API.findBill,
            id: 'table-bill',
            page: 'page-bill',
            cols: [[{
                title: '序号',
                field: 'eq',
                width: 120,
                templet: function (d) {
                    return d.LAY_INDEX;
                }
                // style:'height:70px;'
            },{
                title: '订单编号',
                field: 'presaleId',
                width: 120,
            }, {
                title: '消费时间',
                field: 'consumeTime',
                align: 'center',
                width:250
            }, {
                title: '收银员',
                field: 'operator',
                align: 'center',
                // templet: function(d){
                //     return decodeURI(d.operator);
                // }
            }, {
                title: '支付方式',
                field: 'payType',
                align: 'center',
                templet: function(d){
                    switch (d.payType) {
                        case 0:
                            return '会员';
                        case 1:
                            return '会员';
                        case 2:
                            return '现金';
                        case 4:
                            return '微信';
                        case 5:
                            return '支付宝';
                        case 6:
                            return '信用卡';
                        case 7:
                            return '银行卡';      
                    }
                    return '';
                }
            }, {
                title: '实收金额',
                field: 'actualPay',
                align: 'center',
                templet: function(d){
                    return formatMoney(d.actualPay);
                }
            }, {
                title: '状态',
                field: 'STATUS',
                align: 'center',
                templet: function(d){
                    return '已结账';
                }
            }]]
        });
        objBill.init();
        getAmount();
    });

    //获取营业额
    function getAmount(){
        var start = $('.date-box.date-start input').val();
        var end = $('.date-box.date-end input').val();
        if (start == '') {
            start = '1970-01-01';
        }
        if (end == '') {
            end = '2999-01-01';
        }
        var params = {
            startTime: start,
            endTime: end,
            shopId: API.shopId,
            backUserId: API.backUserId
        };
        reqAjaxAsync(API.findAmount, JSON.stringify(params))
        .done(function(res){
            if(res.code == 1){
                $('.business-total p span').text(res.data.twoTypeSumAmount?res.data.twoTypeSumAmount.toFixed(2):'' || '0.00');
                $('.business-food .business-price span').text(res.data.saleAmount || '0.00');
                $('.business-food .business-order span').text(res.data.businessCount || '0');
                $('.business-recharge .business-price span').text(res.data.rechargeAmount || '0.00');
                $('.business-recharge .business-order span').text(res.data.rechargeCount || '0');
            }
        });
    }
    //初始化表格
    function initTable(option){
        this.id = option.id;
        this.page = option.page;
        this.type = option.type;
        this.curr = 1; //默认第一页
        //第一个实例
        this.tableINs = table.render({
            id: option.id,
            elem: '#' + option.id,
            even: true,
            skin: 'line',
            // cellMinWidth: 80,
            limit: 10,
            cols: option.cols
        });

        var t = this;
        // this.init();
        function init(){
            this.tableINs = table.render({
                id: option.id,
                elem: '#' + option.id,
                even: true,
                // cellMinWidth: 80,
                limit: 10,
                cols: option.cols
            });
            var t = this;
            reqData({ type: option.type }, function (res) {
                if (res) {
                    if (res.code == 1) {
                        t.tableINs.reload({
                            data: res.data
                        })
                    } else {
                        layer.msg(res.msg)
                    }
                }
                if (option.page) {
                    //分页
                    layui.use('laypage');
                    t.page_options = {
                        elem: option.page,
                        count: res ? res.total : 0,
                        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                        groups: '4',
                        limit: 10,//每页条数
                        limits: [10]
                    }
                    //分页渲染
                    t.page_options.jump = function (obj, first) {
                        debugger
                        if (!first) {
                            
                            rows = obj.limit;
                            t.curr = obj.curr;
                            reqData({
                                page: obj.curr,
                                rows: obj.limit,
                                type: option.type   //分类
                            }, function (res) {
                                if (res && res.code == 1) {
                                    t.tableINs.reload({
                                        data: res.data,
                                        limit: obj.limit
                                    });
                                } else {
                                    layer.msg(res.msg);
                                }
                            });
                        }
                    }
                    layui.laypage.render(t.page_options);
                }
            })
        }
    }

    //初始化数据
    initTable.prototype.init = function(option) {
        var t = this;
        reqData({ type: t.type }, function (res) {
            if (res) {
                if (res.code == 1) {
                    t.tableINs.reload({
                        data: res.data.rows
                    })
                } else {
                    layer.msg(res.msg)
                }
            }
            if (t.page) {
                //分页
                layui.use('laypage');
                t.page_options = {
                    elem: t.page,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                    groups: '4',
                    limit: 10,//每页条数
                    limits: [10]
                }
                //分页渲染
                t.page_options.jump = function (obj, first) {
                    t.curr = obj.curr;
                    if (!first) {
                        rows = obj.limit;

                        reqData({
                            page: obj.curr,
                            rows: obj.limit,
                            type: t.type   //分类
                        }, function (res) {
                            if (res && res.code == 1) {
                                t.tableINs.reload({
                                    data: res.data.rows,
                                    limit: obj.limit
                                });
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    }
                }
                layui.laypage.render(t.page_options);
            }
        })
    }
 
    //请求接口数据
    function reqData(obj,callback) {
        var dateStart = $('.date-start input').val();
        var dateEnd = $('.date-end input').val();
        var type = $('.header-tabs span.active').attr('data-type');
        if (dateStart == '') {
            dateStart = '1970-01-01';
        }
        if (dateEnd == '') {
            dateEnd = '2999-01-01';
        }
        var cmd = '';
        if (obj.type) {
            cmd = obj.type;
        }else {
            cmd = type == '1' ? API.findRank : API.findBill;
        }
        var param = {
            startTime: dateStart,
            endTime: dateEnd,
            backUserId: API.backUserId,
            pagination: {
                rows: obj.rows || 10,
                page: obj.page || 1,
            },
            goodsName:$("#goodsName").val() || '',
            categoryName:$("#categoryName").val() || '',
        }
        reqAjaxAsync(cmd, JSON.stringify(param))
            .done(callback);
    }
    //搜索
    function search(start,end){

        if (end < start) {
            layer.msg('请选择正确的时间段!', { time: 2000 });
            $('.date-box.date-start input').val($('.date-box.date-end input').val());
            return;
        }
        objRank.init();
        objBill && objBill.init();
        getAmount();
    }
    //初始化时间日期
    function initDateTime() {
        var curDate = getCurDate();
        // console.log(curDate);
        $('.date-box.date-start input').val(curDate);
        $('.date-box.date-end input').val(curDate);
        laydate.render({
            elem: '.date-box.date-start input',
            value: curDate,
            done: function (value, date, endDate) {
                var dateEnd = $('.date-box.date-end input').val();
                var end = new Date(dateEnd).getTime();
                var start = new Date(value).getTime();
                if (end < start) {
                    layer.msg('请选择正确的时间段!', { time: 2000 });
                    $('.date-box.date-start input').val($('.date-box.date-end input').val());
                    return;
                }
                search();
                return;
            }
        });
        laydate.render({
            elem: '.date-box.date-end input',
            value: curDate,
            done: function (value, date, endDate) {
                var dateStart = $('.date-box.date-start input').val();
                var end = new Date(value).getTime();
                var start = new Date(dateStart).getTime();
                if (end < start) {
                    layer.msg('请选择正确的时间段!', { time: 2000 });
                    $('.date-box.date-end input').val($('.date-box.date-start input').val());
                    return;
                }
                search();
            }
        });
    }

    $(".searchBtn").click(function(){
        search();
    })
    $(".restBtn").click(function(){
        $(".header").find('#goodsName,#categoryName').val('')
        search();
    })
});

