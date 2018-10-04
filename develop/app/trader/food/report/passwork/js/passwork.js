
var API = {
    findPasswork: 'findRank',
    findHistory: 'foodBoot/getHandOverPage',
    findHandOverInfo: 'foodBoot/findStoreNearestHandOverInfo',
    addHandOver:'foodBoot/addHandOver',
    submit: 'findRank',
    shopId: getUrlParams("shopId") || '',
    merchantId: getUrlParams('merchantId') || '',
    userId: getUrlParams('userId') || '',
    backUserId: getUrlParams('backUserId') || '',
    name: getUrlParams('userName') || '',
};

$(window).ready(function () {
 

    var curPage = 1;
    var curRows = 10;
    var table = layui.table;
 
    layui.use(['laydate', 'layer', 'form', 'element', 'table'], function () {
        window.laydate = layui.laydate;
        table = layui.table;
        window.objHistory = new initTable({
            type: API.findBill,
            id: 'table-history',
            page: 'page-history',
            cols: [[{
                title: '交接人',
                field: 'name',
                align: 'center',
                width: 150,
                // style: 'min-width:120px;',
            }, {
                title: '交接时间',
                field: 'handOverTime',
                align: 'center',
                width: 250,
                // style: 'min-width: 130px;',
                templet: function(d){
                    return formatStampToDate(d.handOverTime);
                }
            },{
                title: '备用金',
                field: 'reserveFundTotal',
                align: 'center',
                // width: 200,
                // style: 'min-width:120px;',
                templet: function (d) {
                    return formatMoney(d.reserveFundTotal);
                }
            }, {
                title: '班次收入',
                field: 'shiftIncomeTotal',
                align: 'center',
                    // width: 160,
                    // style: 'min-width:120px;',
                templet: function (d) {
                    return formatMoney(d.shiftIncomeTotal);
                }
            }, {
                title: '销售',
                field: 'salesTotal',
                align: 'center',
                    // width: 160,
                // style: 'min-width:120px;',
                templet: function (d) {
                    return formatMoney(d.salesTotal);
                }
            }, {
                title: '充值',
                field: 'rechargeTotal',
                align: 'center',
                    // width: 160,
                    // style: 'min-width:120px;',
                templet: function (d) {
                    return formatMoney(d.rechargeTotal);
                }
            }, {
                title: '交接金额',
                field: 'handOverTotal',
                align: 'center',
                // width: 160,
                    // style: 'min-width:120px;',
                templet: function (d) {
                    return formatMoney(d.handOverTotal);
                }
            }, {
                title: '实际交接金额',
                field: 'realHandOverTotal',
                align: 'center',
                templet: function (d) {
                    return formatMoney(d.realHandOverTotal);
                }
            }]]
        });
        objHistory.init();
        initDateTime();
        getHandOverInfo();
        // search();
        $('.data-time span').text(formatDateToString(new Date()));
        $('.data-name span').text(API.name);

 
    });

    
    //点击修改
    $('.tab-contents').on('click','.remark-edit',function(){
        var tr = $(this).parents('tr');
        var index = tr.index();
        tr && showRemark(tr,index);
    })

    //修改备用金
    $('.tab-contents').on('click', '.petty-cash',function(){
        var price = $(this).text();
        var elem = $(this).hide().next();
        elem.show();
        elem.focus();
        elem.find('span').val(price);
    });

    $('.td-petty input').on('blur', function (event) {
        var val = $(this).val();
        // console.log(val);
        if (val != ''){
            val = Number(val).toFixed(2);
        }
        var elem = $(this).prev();
        elem.show();
        elem.find('span').text(val);
        $(this).hide();
    });

    $(window).on('resize',function(){
        // objHistory.tableINs.reload({ data: objHistory.data});
        // resetTableWidth();
    })
 
    //重置layui table 宽度
    function resetTableWidth() {
        var width = Number($('#history-content .layui-border-box').width());
        var header = $('#history-content .layui-table-header thead tr').find('th');
        var tbody = $('#history-content .layui-table-body tbody tr').eq(0);
        var td = tbody.find('td');
        td.each(function (index, item) {
            var width = $(this).width();
            header.eq(index).width(width);
        });
    }

    $('.td-petty input').on('keyup', function (event) {
        if (event.keyCode  == 13) {
            var val = $(this).val();
            // console.log(val);
            var elem = $(this).prev();
            elem.show();
            elem.find('span').text(val);
            $(this).hide();
        }
    });
    //提交交接金额
    $('.btn-submit').on('click',function(){
        var params = {
            backUserId: API.backUserId,
            name: API.name,
            reserveFundTotal:  replaceUnit($('#table tfoot tr td').eq(1).text()),
            shiftIncomeTotal: replaceUnit($('#table tfoot tr td').eq(2).text()),
            salesTotal: replaceUnit($('#table tfoot tr td').eq(3).text()),
            rechargeTotal: replaceUnit($('#table tfoot tr td').eq(4).text()),
            handOverTotal: replaceUnit($('#table tfoot tr td').eq(5).text()),
            realHandOverTotal: replaceUnit($('#table tfoot tr td').eq(6).text()),
            merchantId: API.merchantId,
            shopId: API.shopId,
        }
        params.handOverDetail = [];
        var tr = $('#table tbody tr');
        tr.each(function(index,item){
            var obj = {};
            obj.paymentMethod = $(item).attr('paymentMethod');
            obj.reserveFund = replaceUnit($(item).find('td').eq(1).text());   //备用金
            obj.shiftIncome = replaceUnit($(item).find('td').eq(2).text());   //班次收入
            obj.sales = replaceUnit($(item).find('td').eq(3).text());         //销售
            obj.recharge = replaceUnit($(item).find('td').eq(4).text());      //充值
            obj.handOver = replaceUnit($(item).find('td').eq(5).text());      //交接金额
            obj.realHandOver = replaceUnit($(item).find('td').eq(6).text());  //实际交接金额
            obj.remark = $(item).find('td').eq(7).text() || '';
            params.handOverDetail.push(obj);
        });
        var num = Number(params.realHandOverTotal);
        if (isNaN(num) || params.realHandOverTotal == 0) {
            params.realHandOverTotal = params.handOverTotal;
        }
        reqAjaxAsync(API.addHandOver, JSON.stringify(params))
        .done(function(res){
            if(res.code == 1) {
                showSubmit(params.realHandOverTotal);
            }else{
                layer.msg(res.msg);
            }
        })
    });
    //显示 修改备注弹框
    function showRemark(tr,index){
         
        layer.open({
            type: 1,
            // closeBtn: 0, //不显示关闭按钮
            title: ['修改交接金额', 'text-align:center;font-size:15px;color:#333;'],
            area: ['412px', '466px'],
            // anim: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#remark-dlg'),
            success: function () {
                var price = tr.find('td').eq(5).text();   //交接金额
                var remark = tr.find('td').eq(7).text();  //备注
                price = replaceUnit(price);
                $('#remark-dlg .remark-price').val(price);
                $('#remark-dlg .remark-data').val(remark);

                $('#remark-dlg .btn-ok').off('click');
                //修改 备注 确定
                $('#remark-dlg .btn-ok').on('click', function () {
                    var price = $('#remark-dlg .remark-price').val();
                    var remark = $('#remark-dlg .remark-data').val();
                    price = Number(price);
                    if (isNaN(price)) {
                        layer.msg('请输入合理金额!', { time: 1000 });
                        return;
                    }
                    if (remark == '') {
                        layer.msg('请输入备注!', { time: 1000 });
                        return;
                    }
                    var payMethod = tr.attr('paymentmethod');
                    if (payMethod == 2) { //如果是现金 修改实际金额
                        app.isEditRealHandOver = true;   //设置 已修改实际金额为真
                    }
                    tr.find('td').eq(6).text(formatMoney(price));   //实际交接金额
                    tr.find('td').eq(6).addClass('prominent');     //交接金额
                    tr.find('td').eq(7).text(remark);  //备注
                    tr.find('td').eq(7).attr('title',remark);  //备注
                    calchandOverAmount(tr);
                    layer.closeAll();
                    $('#remark-dlg').hide();
                });
            },
            end: function (index, layeno) {
                layer.close(index);
                $('#remark-dlg').hide();
            },
            cancel: function () {
                $('#remark-dlg').hide();
            }
        });
    }
    //显示提交成功弹框
    function showSubmit(price){
        var index = layer.open({
            type: 1,
            // closeBtn: 0, //不显示关闭按钮
            title: ['', 'text-align:center;font-size:18px;'],
            area: ['600px', '500px'],
            // anim: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#submit-success'),
            success: function () {
                $('.submit-price span').text(price);
                setTimeout(function() {
                    layer.close(index);
                    location.reload();
                }, 3000);
            },
            end: function (index, layeno) {
                layer.close(index);
                $('#add-surcharge').hide();
            },
            cancel: function(){
                $('#submit-success').hide();
            }
        });
    }
    //初始化表格
    function initTable(option) {
        this.id = option.id;
        this.page = option.page;
        this.type = option.type;
        //第一个实例
        this.tableINs = table.render({
            id: option.id,
            elem: '#' + option.id,
            skin: 'line',
            even: true,
            cellMinWidth: 80,
            limit: 10,
            cols: option.cols,
            done: function (res){
                if (res.data && res.data.length > 0){
                    res.data.forEach(function(item,index){
                        var remark = item.handOverDetail;
                        if (remark != '' && remark != null){
                            var tr = $('#history-content .layui-table-body  tbody tr').eq(index+1);
                            tr.find('td[data-field="realHandOverTotal"] div').addClass('prominent');
                        }
                    })
                }
            }
        });
        //初始化数据
        this.init = function (option) {
            var t = this;
            reqData({ type: t.type }, function (res) {
                if (res) {
                    if (res.code == 1) {
                        t.tableINs.reload({
                            data: res.data,
                            limit: 10,
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
                                page: obj.curr,
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
        var t = this;

    }

    //计算 交接金额
 
    //计算总计
    function calchandOverAmount(tr, index){
        var handOverAmount = 0;
        var ary = $('#table tbody tr');
        ary.each(function(index,item){
            var price = $(item).find('td').eq(6).text();  //交接金额
            price = replaceUnit(price);
            handOverAmount = handOverAmount + Number(price);
        });
        $('#table tfoot tr td').eq(6).text(formatMoney(handOverAmount));
    }
    //替换 ￥单位
    function replaceUnit(price){
        if(price && price.indexOf){
            var index = price.indexOf('￥');
            if(index != -1){
                price = price.substr(1);
            }
        }
        return price;
    }
    //请求接口数据
    function reqData(obj, callback) {
        var dateStart = $('.date-start input').val();
        var dateEnd = $('.date-end input').val();
        var cmd = '';
        var obj = obj ? obj : {};
        cmd = API.findHistory;
 
        var param = {
            shopId: API.shopId,
            handOverTimeStart: dateStart,
            handOverTimeEnd: dateEnd,
            row: obj.rows || 10,
            page: obj.page || 1,
        }
        reqAjaxAsync(cmd, JSON.stringify(param))
            .done(function(res){
                if(res.code == 1){

                    callback && callback(res);
                    // app.handOverList = res.data;
                }
                 
            });
    }
     
 
 
    //初始化时间日期
    function initDateTime() {
        laydate.render({
            elem: '.date-box.date-start input',
            max: 0,
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
            max: 0,
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

function search() {
    objHistory.init();
    // reqData();
}
//获取交班数据
function getHandOverInfo() {
    var params = {
        shopId: API.shopId,
        merchantId: API.merchantId,
    }
    reqAjaxAsync(API.findHandOverInfo, JSON.stringify(params))
        .done(function (res) {
            if (res.code == 1) {
                app.passworkData = res.data;
                app.amount();
            }
        })
}
