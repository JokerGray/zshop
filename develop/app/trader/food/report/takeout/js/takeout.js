
$(window).ready(function () {
    var curSearchPage = 0;  //默认从0开始
    var table = layui.table;
    var API = {
        findOrderList: 'foodBoot/takeout/eleme/order/listTakeoutOrder',  //查询外卖订单列表
        findOrderDetial: 'foodBoot/takeout/eleme/order/getOrder',        //查询订单详情
        searchOrder: 'foodBoot/takeout/eleme/order/search',              //搜索订单信息
        recieving: 'foodBoot/takeout/eleme/order/confirmOrderLite',      //确认接单
 
        shopId: getUrlParams("shopId"),
        merchantId: getUrlParams('merchantId') || '571',
        userId: getUrlParams('userId'),
        backUserId: getUrlParams('backUserId'),
        name: getUrlParams('userName'),
    };
    var tableAry = [,,,,,]; //
    var orderList = [,,,,,,];
    layui.use(['laydate', 'layer', 'form', 'element', 'table'], function () {
        window.laydate = layui.laydate;
        window.layer = layui.layer;
        table = layui.table;

        //初始化 待配送列表
        tableAry[0] = new initTable({
            cmd: API.findOrderList,
            type: '0',
            id: 'table-pending',
            page: 'page-pending',
            cols: [[{
                title: '来源',
                field: 'source',
                templet: function (d) {
                    return '饿了么';
                },
            }, {
                title: '联系人/电话',
                field: 'linkName',
                align: 'center',
                templet: '#phone-tpl',
            }, {
                title: '商品',
                field: 'totalPrice',
                align: 'center',
                templet: '#good-tpl',
            }, {
                title: '单号/时间',
                field: 'orderId',
                align: 'center',
                templet: '#order-time-tpl',
            }, {
                title: '配送地址',
                field: 'address',
                align: 'center',
                templet: '#address-tpl',
            }, {
                title: '操作',
                field: 'ccc',
                align: 'center',
                toolbar: '#toolbar',
            }]]
        })
        tableAry[0].init();
        //获取其它类型总数量  layui table表格 不渲染
        for(var i=2;i<=4;i++){
            var param = {
                takeoutShopId: '166362854',
                type: i,
                row: 10,
                page: 0,
            };
            (function aaa (type){
                reqAjaxAsync(API.findOrderList, JSON.stringify(param))
                    .done(function (res) {
                        //显示当前 数量
                        $('.header-tabs span[data-type="' + type + '"] span').text(res.total);
                    });
            })(i);
 
        }
 
         
 
        //绑定 拒绝点击事件
        $('.tab-contents').on('click', '.btn-reject', function () {
            showRejectDlg();
        });
 
        //切换
        $('.header-tabs').on('click', 'span', function () {
            $(this).addClass('active').siblings().removeClass('active');
            //切换显示 
            var type = $(this).attr('data-type');
            $(`.tab-contents .tab-content[data-type="${type}"]`).show().siblings().hide();
            showCurrTable(type);
        });
 
        
        //点击行 显示 订单详情信息
        $('.content-left').on('click','.layui-table-body tbody tr',function(event){
            var event = event ? event : window.event;
            var target = event.target || event.srcElement;
            //判断是否是拒绝接单事件
            if ($(target).hasClass('reject')){
                showRejectDlg();
                stopPropagation();
                return false;
            } else if ($(target).hasClass('recieving')){  //判断是否 接单事件
                //获取当前行信息 
                var index = $(this).index();
                var data = orderList[0]&& orderList[0][index];
                layer.confirm('确定接单吗？', {
                    btn: ['接单']
                },function (index) {
                    var params = {
                        orderId: data.orderId,
                        merchantId: API.merchantId,
                    }
                    reqAjaxAsync(API.recieving, JSON.stringify(params))
                        .done(function (res) {
                            if (res.code == 1) {
                                layer.close(index);
                       
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                });
                stopPropagation();
                return false;
            }
            $('.content-details').show();
            $('.content-left').addClass('nofull');
             
            var dataType = $('.header-tabs .active').attr('data-type');
            var index = $(this).index();
            var data = orderList[dataType] && orderList[dataType][index];
            
            //显示详情信息
            $('.order-taste div').text(data.description);            //口味备注
            $('.order-address div').text(data.address);              //地址
            $('.order-people  .order-name').text(data.linkName);     //联系人
            $('.order-people  .order-phone').text(data.linkPhone);   //联系号码
 
            $('.order-time div').text(data.createdTime);             //创建时间
            $('.order-number div').text(data.orderId);                //订单号
            $('.order-foods .foods-num').text(data.productTotal);    //商品总数
            $('.order-foods .foods-price').text(data.totalPrice);    //商品总价
            var goodJson = JSON.parse(data.goodsJson);
            var ary = [];
            var html = '';
            //商品列表
            goodJson && goodJson.forEach(function(item,index){
                item.items && item.items.forEach(function(good,i){
                    var money = formatMoney(good.price) + '元';
                   var tmp = `<div class="food-item">
                                <div class="food-name">${good.name}</div>
                                <div class="food-num">X<span>${good.quantity}</span></div>
                                <div class="food-price">${money}</div>
                            </div>`;
                    html += tmp;
                }); 
            });
            //添加 配送费
            var deliverFee = formatMoney(data.deliverFee) + '元';
            html += `<div class="food-item">
                                <div class="food-name">配送费</div>
                                <div class="food-num"><span></span></div>
                                <div class="food-price">${deliverFee}</div>
                            </div>`;
            $('.order-food-list').html(html);
            var orderActivities = JSON.parse(data.orderActivities);

            var html = '';
            orderActivities && orderActivities.forEach(function(item,index){
                var money = formatMoney(item.amount) + '元';
                var tmp = `<div class="food-discount"><span>${item.name}:</span><div> ${money}</div></div>`;
                html+=tmp;
            });
            $('.food-discount-list').html(html);
            $('.food-amount div').text(formatMoney(data.originalPrice) + '元');
            $('.food-payment div').text(formatMoney(data.totalPrice) + '元');
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
            resetTableWidth();
        });
        //点击 详情关闭
        $('.content-details .layui-icon-close').on('click',function(){
            $('.content-details').hide();
            $('.content-left').removeClass('nofull');
        });
        // 点击搜索
        $('.header-search span').on('click',function(){
            var keywords =  $(this).prev().val();
            //获取当前 搜索类型
            var type = $('.header-tabs span.active').attr('data-type');
            //搜索订单
            var params = {
                keywords: keywords,
                type: type,
                page: 0,
                row: 10,
            };
            curSearchPage = 0;
            reqAjaxAsync(API.searchOrder, JSON.stringify(params))
                .done(function (res){
                if (res.code == 1) {
                    tableAry[type - 1].tableINs.reload({ data: res.data });
                }
            })
        });

        //点击行 颜色变化
    });

 
    //显示 当前 列表
    function showCurrTable(dataType){
        if(tableAry[dataType] == undefined){
            var id = '';
            var page = '';
            switch (dataType) {
                case '2':
                    id = 'table-distribution';
                    page = 'page-distribution';
                    break;
                case '3':
                    id = 'table-dispatching';
                    page = 'page-dispatching';
                    break;
                case '4':
                    id = 'table-done';
                    page = 'page-done';
                    break;
            }
            tableAry[dataType] = new initTable({
                type: dataType,
                id: id,
                page: page,
                cols: [[{
                    title: '来源',
                    field: 'source',
                    templet: function (d) {
                        return '饿了么';
                    },
                }, {
                    title: '联系人/电话',
                    field: 'linkName',
                    align: 'center',
                    templet: '#phone-tpl',
                }, {
                    title: '商品',
                    field: 'totalPrice',
                    align: 'center',
                    templet: '#good-tpl',
                }, {
                    title: '单号/时间',
                    field: 'orderId',
                    align: 'center',
                    templet: '#order-time-tpl',
                }, {
                    title: '配送地址',
                    field: 'address',
                    align: 'center',
                    templet: '#address-tpl',
                }, {
                    title: '状态',
                    field: 'ccc',
                    minWidth: '120',
                    style: 'min-width:120px',
                    align: 'center',
                }]]
            })
             
        }
        tableAry[dataType].init();

    }
    //初始化表格
    function initTable(option) {
        this.id = option.id;
        this.page = option.page;
        this.type = option.type;
        //第一个实例
        var t = this;
        this.tableINs = table.render({
            id: option.id,
            elem: '#' + option.id,
            even: true,
            // cellMinWidth: 80,
            height: 'full-150',
            skin: 'line',
            limit: 10,
            cols: option.cols,
            done: function(obj){
                //显示当前 数量
                $('.header-tabs span[data-type="' + t.type + '"] span').text(obj.count);
                //重置单元格
                 
                orderList[t.type] = obj.data;
                resetTableWidth();
            }
        });
    }

    function stopPropagation(event){
        var event = event || window.event;
        event.cancelBubble ? event.cancelBubble = true : event.stopPropagation();
    }
 
    //显示拒绝订单弹框
    function showRejectDlg() {
        layer.open({
            type: 1,
            // closeBtn: 0, //不显示关闭按钮
            title: ['拒绝订单', 'text-align:center;font-size:18px;'],
            area: ['480px', 'auto'],
            // anim: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#reject-order'),
            success: function () {
                
            },
            end: function (index, layeno) {
                layer.close(index);
                $('#reject-order').hide();
            }
        });
    }
    //初始化数据
    initTable.prototype.init = function (option) {
        var t = this;
        reqData({ type: t.type}, function (res) {
            if (res) {
                if (res.code == 1) {
                    t.tableINs.reload({
                        data: res.data
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
                    if (!first) {
                        rows = obj.limit;
                        reqData({
                            page: obj.curr - 1,
                            rows: obj.limit,
                            type: t.type   //分类

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
    //重置layui table 宽度
    function resetTableWidth() {
        var dataType = $('.header-tabs .active').attr('data-type');
        var content = $('.tab-content[data-type="' + dataType +'"]');
        var width = Number(content.find ('.layui-border-box').width());
        var header = content.find('.layui-table-header thead tr').find('th');
        var tbody = content.find('.layui-table-body tbody tr').eq(0);
        var td = tbody.find('td');
        td.each(function (index, item) {
            var width = $(this).width();
            header.eq(index).width(width);
        });
    }

    //请求接口数据
    function reqData(obj, callback) {
 
        
        var cmd = obj.cmd || API.findOrderList;
        var serach = $('.header-search input').val();
        if(serach == ''){
            cmd = API.findOrderList;
            var param = {
                takeoutShopId: '166362854',
                type: obj.type,
                row: obj.rows || 10,
                page: obj.page || 0,
            }
        }else {
            cmd = API.serachOrder;
            var param = {
                keywords: keywords,
                type: type,
                page: obj.rows || 0,
                row: obj.page ||10,
            };
        }
        reqAjaxAsync(cmd, JSON.stringify(param))
            .done(callback);
    }
    //搜索
    function search(start, end) {
        if (end < start) {
            layer.msg('请选择正确的时间段!', { time: 2000 });
            $('.date-box.date-start input').val($('.date-box.date-end input').val());
            return;
        }
        objRank.init();
        objBill.init();
    }
    //初始化时间日期
    function initDateTime() {
        laydate.render({
            elem: '.date-box.date-start input',
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
});

