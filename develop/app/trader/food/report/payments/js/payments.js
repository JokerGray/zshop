var API = {
    // findRank: 'findRank',
    findBill: 'foodBoot/findFoodConsumeAccount',
    findDetail: 'foodBoot/findFoodPresale',
    findOperator: 'foodBoot/selectBackUserByShopId',
    shopId: getUrlParams("shopId") || '',
    merchantId: getUrlParams('merchantId') || '',
    userId: getUrlParams('userId') || '',
    backUserId: getUrlParams('backUserId') || '',
    name: getUrlParams('userName') || '',
}

 


$(document).ready(function () {
    var table = layui.table;
    var form = layui.form;
    var objFood = {};
    var objTakeout = null;
    layui.use(['laydate', 'layer', 'form', 'element', 'table'], function () {
        window.laydate = layui.laydate;
        table = layui.table;
        form = layui.form;
        initDateTime();
        getOperator();
        

        $('.header-tabs').on('click', 'span', function () {
            $(this).addClass('active').siblings().removeClass('active');
            //切换显示 
            var type = $(this).attr('data-type');
            $(`.tab-contents .tab-content[data-type="${type}"]`).show().siblings().hide();

            //堂食 订单
            // if (objTakeout == null){
            //     objTakeout = new initTable({
            //         type: API.findBill,
            //         id: 'table-takeout',
            //         page: 'page-takeout',
            //         cols: [[{
            //             title: '序号',
            //             field: 'eq',
            //             width: 120,
            //             style: 'height:70px',
            //             align: 'center',
            //             templet: function (d) {
            //                 return d.LAY_INDEX;
            //             }
            //         }, {
            //             title: '订单编号',
            //             field: fieldBill['ORDERNUMBER'],
            //             width: 120,
            //             align: 'center'
            //         }, {
            //             title: '消费时间',
            //             field: fieldBill['CREATETIEM'],
            //             align: 'center',
            //         }, {
            //             title: '收银员',
            //             field: fieldBill['CASHIER'],
            //             align: 'center'
            //         }, {
            //             title: '支付方式',
            //             field: fieldBill['PAYMENT'],
            //             align: 'center'
            //         }, {
            //             title: '订单金额',
            //             field: fieldBill['AMOUNT'],
            //             align: 'center',
            //             templet: function (d) {
            //                 return '￥' + d[fieldBill['AMOUNT']];
            //             }
            //         }, {
            //             title: '状态',
            //             field: fieldBill['STATUS'],
            //             align: 'center'
            //         }]]
            //     });
            // }
            // objTakeout.init();
        })
        //堂食 订单
   
        objFood = new initTable({
            type: API.findBill,
            id: 'table-food',
            page: 'page-food',
            cols: [[{
                title: '序号',
                field: 'eq',
                // width: '100px',
                // style: 'height:70px;min-width:80px;',
                align: 'center',
                templet: function (d) {
                    return d.LAY_INDEX;
                }
            }, {
                title: '订单编号',
                field: 'presaleId',
                // style: 'min-width:80px;',
                align: 'center',
                templet: function (d) {
                    return d.presaleId ||'无';
                }
            }, {
                title: '消费时间',
                field: 'consumeTime',
                // style: 'min-width:160px;',
                align: 'center',
            }, {
                title: '收银员',
                field: 'operator',
                // style: 'min-width:80px;',
                align: 'center'
            }, {
                title: '支付方式',
                field: 'payType',
                // style: 'min-width:80px;',
                align: 'center',
                templet: function (d) {
                    switch (d.payType) {
                        case 0:
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
                        default:
                            return '';
                    }
                }
            }, {
                title: '实收金额',
                field: 'actualPay',
                // style: 'min-width:80px;',
                align: 'center',
                templet: function (d) {
                    return '￥' + d.actualPay;
                }
            }, {
                title: '状态',
                field: fieldBill['STATUS'],
                // style: 'min-width:80px;',
                align: 'center',
                templet: function (d) {
                    return d.presaleId ?'已结账':'-';
                }
            }]]
        });
        objFood.init();
 
        //点击行 打开详情
        $('#food  .food-left').on('click','.layui-table-main tbody tr',function(){
            var tr = $(this);
            var index = $(this).index();
            var presaleId = objFood.data[index].presaleId;  //获取当前点击行 点击的订单编号
            if(presaleId == 0){
                tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
                $('#food .food-left').css('padding-right',0);
                resetTableWidth();
                app.isShowFoodOrder = false;
                return layer.msg('此单无详情')
            }
            var contentWidth = Number($('#food').width());
            var width = Number($('#food .food-right').width());
            var params = {
                id: presaleId
            };
           
            reqAjaxAsync(API.findDetail,JSON.stringify(params))
            .done(function(res){
                if(res.code == 1) {
                    console.log(width, contentWidth);

                     
                    app.foodDetail = res.data;
                    // app.getFoodOrder(presaleId);
  
                    tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
                    // debugger
                    if (!app.isShowFoodOrder) {
                        $('#food .food-left').css('padding-right', width + 25);
                        resetTableWidth();
                        app.isShowFoodOrder = true;
                    }
                }else {
                    layer.msg(res.msg);
                }
            });
        });

        //堂食 订单点击关闭
        $('#food .layui-icon-close').on('click',function(){
            showFullTable();
        });

    });

    var select = new initSelect('#select-payment', { callback: search});
    var selectCashier = new initSelect('#select-cashier', { callback: search });
    select.init();
    selectCashier.init();
    
    var fieldBill = {                   //账单明细
        'ORDERNUMBER': 'orderNumber',   //订单编号
        'CREATETIEM': 'createTime',     //创建时间
        'CASHIER': 'cashier',           //商品名称
        'PAYMENT': 'payment',           //支付方式
        'AMOUNT': 'amount',             //实收金额
        'STATUS': 'status',             //状态
    };

    //初始化表格
    function initTable(option) {
        this.id = option.id;
        this.page = option.page;
        this.type = option.type;
        //第一个实例
        this.tableINs = table.render({
            id: option.id,
            elem: '#' + option.id,
            even: true,
            // cellMinWidth: 80,
            skin: 'line',
            limit: 10,
            cols: option.cols
        });
        var t = this;
    }
    window.onresize = function(){
        var contentWidth = Number($('#food').width());
        var width = Number($('#food .food-right').width());
        if ($('#food .food-right').is(':visible')){
            // $('#food .food-left').width(contentWidth - width - 20);
        }else {
            // $('#food .food-left').width('100%');
        }
    }
    //全窗口显示 tabl 
    function showFullTable(){
        $('#food .food-right').hide();
        $('#food .food-left').css('padding-right','0');
        $('#food .layui-table-view').css({ 'width': '100%' });
        app.isShowFoodOrder = false;
    }
    //设置合计金额
    function setAmount(res){
        $('.food-box').show();
        $('.food-num').text(res.total > 10 ? 10 : res.total);
        var amount = 0;
        res.data.forEach(function(item,index){
            amount += item.actualPay;
        });
        $('.food-money').text(Number(amount).toFixed(2));
        showFullTable();
    }
    //初始化数据
    initTable.prototype.init = function (option) {
        var t = this;
        reqData({ type: t.type }, function (res) {
            if (res) {
                if (res.code == 1) {
                    t.data = res.data;
                    setAmount(res);
                     
                    t.tableINs.reload({
                        data: res.data
                    })
                    resetTableWidth();
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
                    if (!first) {
                        rows = obj.limit;
                        reqData({
                            page: obj.curr,
                            rows: obj.limit,
                            type: t.type   //分类
                        }, function (res) {
                            if (res && res.code == 1) {
                                t.data = res.data;
                                setAmount(res);
                                t.tableINs.reload({
                                    data: res.data,
                                    limit: obj.limit
                                });
                                resetTableWidth();
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
    initTable.prototype.reload = function (option){
        this.tableINs.reload({
            data: this.data,
            limit: 10,
        })
    }

     
    //获取 服务员列表
    function getOperator(){
        var params = {
            // merchantId: API.merchantId,
            shopId: API.shopId
        };
        reqAjaxAsync(API.findOperator, JSON.stringify(params))
        .done(function(res){
            if(res.code == 1){
                console.log(res)
                var dl = $('#select-cashier dl');
                var html = '';
                res.data.forEach(function(item,index){
                    html += `<dd data-id="${item.id}">${item.username}</dd>`;
                });
                dl.append(html);
            }
        });
    }
    //请求接口数据
    function reqData(obj, callback) {
        var dateStart = startTime;
        var dateEnd = endTime;
        var type = $('.header-tabs span.active').attr('data-type') || '';
        // var operatorId = $('#select-cashier input').attr('data-id') || '';  //收银员
        var operator = $('#select-cashier input').val()=='全部' ? '':$('#select-cashier input').val();
        
        // operatorId = '';
        if (operatorId == ""){
            operator = '';
        }
        var payType = $('#select-payment input').attr('data-id');  //支付方式
        var cmd = '';
 
        cmd = API.findBill;
      
        var param = {
            startTime: dateStart,
            endTime: dateEnd,
            // operatorId: operatorId,
            operator: operator,
            payType: payType,
            merchantId: API.merchantId,
            shopId: API.shopId,
            row: obj.rows || 10,
            page: obj.page || 1,
            presaleId:$.trim($("#operatorId").val())||''
        }
        reqAjaxAsync(cmd, JSON.stringify(param))
            .done(callback);
    }

    function search(){
        objFood.init();
    }
    //重置layui table 宽度
    function resetTableWidth(){

        var width = Number($('.food-left .layui-border-box').width());
        var header = $('.food-left .layui-table-header thead tr').find('th');
        var tbody = $('.food-left .layui-table-body tbody tr').eq(0);
        var td = tbody.find('td');
        td.each(function(index,item){
            var width = $(this).width();
            header.eq(index).width(width);
        });
    }

    //初始化时间日期
    var startTime = '';
    var endTime = ''
    function initDateTime() {
        laydate.render({
            elem: '.date-box.date-start input',
            done: function (value, date, endDate) {
                console.log(value)
                startTime = value;
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
            },
        });
        laydate.render({
            elem: '.date-box.date-end input',
            done: function (value, date, endDate) {
                endTime = value;
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
        $(".header").find('input').val('').attr('data-id','')
        startTime='';
        endTime='';
        search();
    })
});