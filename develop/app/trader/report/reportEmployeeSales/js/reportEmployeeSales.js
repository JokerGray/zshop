$(function () {
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    var REQUIRE_URL = {
        shopList:'reportEmployeeSales/selectShopListByBackUserId',//获取店铺列表
        championReport:'reportEmployeeSales/searchPeopleChampion',//冠军统计
        fromService:'reportEmployeeSales/getServiceTicketDetailInfoByService',//按服务
        fromGoods:'reportEmployeeSales/getSaleRecordListByProduct',//按商品
        fromAccount:'reportEmployeeSales/getAllServiceHeadCount',//按客户
        waiters:'reportEmployeeSales/getUserIdListByBackUserId',//员工列表
        waiterOrderDetail:'reportEmployeeSales/getSingleWaiterServiceTicketDetailInfoByService',//单个员工服务单详情
        serviceList:'reportEmployeeSales/getServiceListByUserId',//服务列表
        orderRankings:'reportEmployeeSales/getTopTenServiceTicketDetailInfo',//服务单前十排行
        ServiceHeadCountRankings:'reportEmployeeSales/getTopTenServiceHeadCount'//服务人头数前十排行
    };
    var pageSize = 10;
    var total = 0;
    var ST = '';
    var ET = '';
    init();
    //切换本月和自定义时间
    $('.timeNav').on('click','>a',function(){
        $(this).addClass('active').siblings('a').removeClass('active');
        if($(this).hasClass('thisMonth')){
            initDateRange().done(function(){
                //更新冠军报表
                getChampionReport().done(function (res) {
                    $('.timeRange').fadeOut(200);
                    $('.mask').fadeOut(200);
                    $('.path .pathTime').text('本月');
                });
                //更新报表
                refreshPage(2)
            })
        }else if($(this).hasClass('selfTime')){
            $('.timeRange').fadeToggle(200);
            $('.mask').fadeToggle(200);
        }
    });
    //确定时间范围选择按钮
    $('#sure').on('click',function(){
        var sDate = $('#startDate').val().trim();
        var eDate = $('#endDate').val().trim();
        if(new Date(sDate).getTime()> new Date(eDate).getTime()){
            layer.msg('开始时间不能大于结束时间',{icon:2});
            return
        }
        //更新冠军报表
        getChampionReport().done(function (res) {
            $('.pathTime').text(sDate+' 至 '+eDate);
            $('.timeRange').fadeOut(200);
            $('.mask').fadeOut(200);
            ST = sDate;
            ET = eDate;
        });
        //更新报表
        refreshPage(2)
    });
    //切换按服务，按商品，按顾客页面
    $('.filterTab').on('click','.tabNav a',function () {
        var cls = $(this).attr('data-class');
        $(this).addClass('active').siblings().removeClass('active');
        $('.pageBox .pageTips').css({visibility: 'hidden'});
        $('.productSearch form input').val('');
        if(cls === 'serviceReport'){
            $('.'+cls).css('display','inline-block');
            $('.productReport').hide();
            $('.clientReport').hide();
            $('.productSearch').hide();
            $('.goodsType').hide();
            //获取按服务数据列表
            getFromServiceList().done(function (data) {
                // 初始化按服务表格
                initTable('serviceReport',showOrderDetail).done(function (res, curr, count) {
                    // 列表数提示
                    initPageTips(data.total);
                    //列表数大于10显示分页，否则不显示
                    if(data.total > pageSize){
                        //初始化按服务分页
                        initPageSelector('servicePageSelect',data.total,function (obj, first) {
                            //翻页后更新按服务列表
                            getFromServiceList(obj.curr).done(function () {
                                //重新初始化表格
                                initTable('serviceReport',showOrderDetail);
                                // 更新列表数提示
                                updatePageTips(data.total,obj.curr)
                            });
                        });
                    }else{
                        $('#servicePageSelect').html(' ')
                    }
                });
            });
            getOrderRankings()
        }else if(cls === 'productReport'){
            $('.'+cls).css('display','inline-block');
            $('.serviceReport').hide();
            $('.clientReport').hide();
            $('.serviceSelector').hide();
            $('.productSearch').css('display','inline-block');
            $('.goodsType').css('display','inline-block');
            getFromGoodsList().done(function (res) {
                initTable('productReport').done(function () {
                    $('.productReport').css('visibility','visible');
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('productPageSelect',res.total,function (obj, first) {
                            getFromGoodsList(obj.curr).done(function (res) {
                                updatePageTips(res.total,obj.curr);
                                initTable('productReport')
                            })
                        })
                    }else{
                        $('#productPageSelect').html('')
                    }
                })
            });
        }else if(cls === 'clientReport'){
            $('.'+cls).css('display','inline-block');
            $('.serviceReport').hide();
            $('.productReport').hide();
            $('.serviceSelector').hide();
            $('.productSearch').hide();
            $('.goodsType').hide();
            getFromAccountList().done(function (res) {
                initTable('clientReport').done(function () {
                    $('.clientReport').css('visibility','visible');
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('clientPageSelect',res.total,function (obj, first) {
                            getFromAccountList(obj.curr).done(function (res) {
                                initTable('clientReport');
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#clientPageSelect').html('')
                    }
                });
            });
            getServiceHeadCount()
        }
    });
    //服务工单数量统计弹窗
    function showOrderDetail(obj){
        if(obj.event !== 'detail'){
            return
        }
        getAllServiceName(obj).done(function (data) {
            getWaiterOrder(obj).done(function (res) {
                res.waiterName = obj.data.waiterName;
                var html = template('orderDetailTpl',{list:res,service:data});
                layer.open({
                    type:1,
                    title:'',
                    closeBtn:0,
                    shade:0.5,
                    shadeClose:true,
                    area:['828px','85%'],
                    skin:'orderDetail',
                    btn:['关闭'],
                    content:html,
                    success:function (layeror, index) {
                        $('.detailContent').outerHeight($(layeror).height()-$('.detailTop').height()-$('.complex').outerHeight(true)-$('.layui-layer-btn').outerHeight(true)-$('.pageBox').height()-5);
                        $(layeror).on('click','.closeIcon',function () {
                            layer.close(index)
                        });
                        if(res.total > pageSize){
                            initPageSelector('detailPageSelect',res.total,function (currObj, first) {
                                getWaiterOrder(obj,currObj.curr).done(function (res) {
                                    showList(res,currObj.curr)
                                })
                            })
                        }else{
                            $('#detailPageSelect').html('')
                        }
                        //切换服务
                        $('#serviceSelect').select2({language: "zh-CN",}).change(function () {
                            $('.serviceName').text($(this).find(':selected').text()).attr('title',$(this).find(':selected').text());
                            getWaiterOrder(obj,1).done(function (res) {
                                showList(res,1);
                                if(res.total > pageSize){
                                    initPageSelector('detailPageSelect',res.total,function (currObj, first) {
                                        getWaiterOrder(obj,currObj.curr).done(function (res) {
                                            showList(res,currObj.curr)
                                        })
                                    })
                                }else{
                                    $('#detailPageSelect').html('')
                                }
                            })
                        });
                        //导出功能
                        $('.detailExportBtn').click(function () {
                            if(res.total === 0){
                                layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                                return false
                            }
                            var sTime = $('#startDate').val();
                            var eTime = $('#endDate').val();
                            var shopId = obj.data.shopId;
                            var userId = obj.data.waiterId;
                            var goodsServiceId = $('#serviceSelect').val() === 'null'?'':$('#serviceSelect').val();
                            var url = '/zxcity_restful/ws/reportEmployeeSales/getSingleWaiterServiceTicketDetailInfoByServiceExportXls?\n' +
                                'startTime='+sTime+'&endTime='+eTime+'&shopId='+shopId+'&backUserId='+backUserId+'&userId='+userId+'&goodsServiceId='+goodsServiceId;
                            $(this).attr('href',url)
                        })
                    }
                })
            });
        });
        function showList(data,curr){
            var detailHtml = '';
            var No = '';
            if(data.data.length === 0){
                detailHtml = '<tr><td colspan="3" style="text-align: center;">暂无相关数据</td></tr>'
            }else{
                data.data.forEach(function (item, index) {
                    No = pageSize*(curr-1)+parseInt(index)+1;
                    No = No<10?'0'+No:No;
                    detailHtml+='<tr>'
                        +'<td style="text-align: center">'+No+'</td>'//item.serviceName
                        +'<td>'+item.serviceName+'</td>'
                        +'<td>'+item.serviceCount+'</td>'
                        +'</tr>'

                });
            }
            $('.detailContent').find('.layui-table tbody').html(detailHtml)
        }
    }
    //初始化时间选择插件
    function initDateRange(){
        var defer = $.Deferred();
        // 获取今天日期
        var today = formatAllDate(new Date(),'yyyy-MM-dd');
        // 获取本月第一天日期
        var first = formatAllDate(new Date(),'yyyy-MM');
        first = first+'-01';
        ST = first;
        ET = today;
        layui.use('laydate',function () {
            var laydate = layui.laydate;
            laydate.render({
                elem:'#startDate',
                max:0,
                value:first,
                isInitValue:true,
                btns:[ 'now', 'confirm']
            });
            laydate.render({
                elem:'#endDate',
                max:0,
                value:today,
                isInitValue:true,
                btns:[ 'now', 'confirm']
            });
            setTimeout(function () {
                defer.resolve(first,today);
            },100)
        });
        return defer.promise()
    }
    //初始化分页方法
    function initPageSelector(domId,total,jump){
        //分页
        layui.use('laypage', function(){
            var laypage = layui.laypage;
            laypage.render({
                elem: domId,
                count: total, //数据总数，从服务端得到
                groups:3,
                theme:"#ccc",
                jump: function(obj, first){
                    //console.log(obj.curr);
                    //console.log(obj.limit); //得到每页显示的条数
                    //首次不执行
                    if(!first){
                        jump?jump(obj, first):null
                        //do something
                    }
                }
            });
        });
    }
    //初始化列表数提示
    function initPageTips(total){
        $('.pageBox .from').text(1);
        if(total >= 1 && total <= pageSize){
            $('.pageBox .pageTips').css({visibility: 'visible'});
            $('.pageBox .total').text(total);
            $('.pageBox .to').text(total);
        }else if(total > pageSize){
            $('.pageBox .pageTips').css({visibility: 'visible'});
            $('.pageBox .total').text(total);
            $('.pageBox .to').text(pageSize);
        }else{
            $('.pageBox .pageTips').css({visibility: 'hidden'});
        }
    }
    //更新列表数提示
    function updatePageTips(total,curr){
        var from;
        var to;
        from = (curr-1)*pageSize+1;
        to = curr*pageSize;
        if(to>=total){
            to = total
        }
        $('.pageBox .from').text(from);
        $('.pageBox .to').text(to);
        $('.pageBox .total').text(total);
    }
    //初始化表格方法
    function initTable(layFilter,event){
        var defer = $.Deferred();
        layui.use('table', function(){
            var table = layui.table;
            table.init(layFilter, {
                height: 342 ,//设置高度
                limit: pageSize, //注意：请务必确保 limit 参数（默认：10）是与你服务端限定的数据条数一致
                size:"sm",
                even: true,
                text:{
                    none:'暂无相关数据'
                },
                done:function (res, curr, count) {
                    defer.resolve(res, curr, count)
                }
                //支持所有基础参数
            });
            //监听单元格事件
            table.on('tool('+layFilter+')', function(obj){
                event?event(obj):null
            });
        });
        return defer.promise()
    }
    //初始化echart图表
    function initEchart(dataObj) {
        var myChart = echarts.init(document.querySelector(dataObj.domName));
        // 指定图表的配置项和数据
        option = {
            //图表颜色
            color:"#1dbfaf",
            //x轴
            xAxis: {
                type: 'category',
                // x轴数据
                data:dataObj.xData,
                //x轴字体样式，显示
                axisLabel: {
                    show: true,
                    interval:0,
                    formatter:function(params) {
                        var newParamsName = "";
                        var paramsNameNumber = params.length;
                        var provideNumber = 5;  //一行显示几个字
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        if (paramsNameNumber > provideNumber) {
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = "";
                                var start = p * provideNumber;
                                var end = start + provideNumber;
                                if (p == rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }

                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    },
                    textStyle: {
                        fontSize:14,
                        color: '#333' //文字颜色
                    }
                },
                //x轴颜色
                axisLine:{
                    lineStyle:{
                        color:"#ddd"
                    },
                },
                //坐标轴刻度样式
                axisTick:{
                    //刻度居中与文字
                    alignWithLabel:false,
                    //刻度颜色
                    lineStyle:{
                        color:'#333'
                    },
                },
            },
            // y轴
            yAxis: {
                type: 'value',
                show:true,
                //y轴颜色
                axisLine:{
                    lineStyle:{
                        color:"#ddd"
                    }
                },
                //y轴刻度线
                axisTick:{
                    "show":false
                },
                //网格线
                splitLine: {
                    "show": false
                }
            },
            //数据
            series: [{
                data: dataObj.yData,
                type: 'bar',
                //柱宽
                barWidth:40,
                //柱顶显示数据
                label:{
                    normal:{
                        show:true,
                        position:"top",
                        textStyle:{
                            color:"#000"
                        }
                    }
                }
            }],
            //设置坐标轴位置
            grid:{
                x:0,
                y:40,
                x2:0,
                y2:36,
                borderWidth:1,
                // left: '0%',
                // right: '0%',
                // bottom: '11%',
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    //获取店铺列表
    function getShopList() {
        var defer = $.Deferred();
        var shopHtml = '';
        var params = {
            'backUserId':parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_URL['shopList'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg,{icon:5});
            }else{
                if(res.data.flag){
                    shopHtml = '<option value="null">全部店铺</option>'
                }
                res.data.shopList.forEach(function(item,index){
                    shopHtml+='<option value="'+item.shopId+'">'+item.shopName+'</option>'
                });
                $('#shopSelector').html(shopHtml).select2({language: "zh-CN"});
                $('.pathShopName').text($('#shopSelector :selected').text());
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取员工列表
    function getWaiters(){
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var params = {
            "backUserId": backUserId,
            shopId:shopId
        };
        reqAjaxAsync(REQUIRE_URL['waiters'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg,{icon:5});
            }else{
                var waiterHtml = '<option value="null">全部</option>';
                res.data.forEach(function (item, index) {
                    waiterHtml+='<option value="'+item.userId+'">'+item.userName+'</option>'
                });
                $('#waiterSelector').html(waiterHtml).select2({language: "zh-CN",})
            }
        })
    }
    //获取冠军统计
    function getChampionReport(){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() !== 'null'?$('#shopSelector').val():null;
        var params = {
            "startTime": sTime+" 00:00:00",
            "endTime": eTime+" 23:59:59",
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['championReport'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                template.defaults.imports.moneyFormat = getMoneyFormat;
                var html = template('greatTpl',res);
                $('.greatBox').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取按服务列表
    function getFromServiceList(pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() !== 'null'?$('#shopSelector').val():null;
        var userId = $('#waiterSelector').val() !== 'null'?$('#waiterSelector').val():null;
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "userId": userId,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo||1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['fromService'],JSON.stringify(params)).done(function (res) {
            total = res.total;
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var html = '';
                var No = '';
                var disCount = 0;
                res.data.forEach(function (item, index) {
                    No = (params['pagination']['page']-1)*params['pagination']['rows']+index+1;
                    No = No < 10 ? '0' + No : No;
                    if(item.specialServiceCount == 0 || item.serviceCount == 0){
                        disCount = '0.00%'
                    }else{
                        disCount = (parseInt(item.specialServiceCount )/parseInt(item.serviceCount)*100).toFixed(2)+'%'
                    }
                    html +='<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+(item.waiterName).trim()+'</td>'
                        +'<td>'+item.serviceCount+'</td>'
                        +'<td>'+item.specialServiceCount+'</td>'
                        +'<td>'+disCount+'</td>'
                        +'<td style="display: none;">'+item.waiterId+'</td>'
                        +'<td style="display: none;">'+item.shopId+'</td>'
                        +'</tr>'
                });
                $('#serviceReport tbody').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取某个员工单项服务单数量详情
    function getWaiterOrder(item,pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var goodsServiceId = $('#serviceSelect').val() === undefined?null:$('#serviceSelect').val();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": item.data.shopId,
            "userId": item.data.waiterId,
            "goodsServiceId": goodsServiceId,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo||1,
                "rows": 10
            },
        };
        reqAjaxAsync(REQUIRE_URL['waiterOrderDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5});
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    // 根据时间段，店铺，员工查询所有服务列表
    function getAllServiceName(obj){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": obj.data.shopId,
            "userId": obj.data.waiterId,
        };
        reqAjaxAsync(REQUIRE_URL['serviceList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取服务单前十排行
    function getOrderRankings(){
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() !== 'null'?$('#shopSelector').val():null;
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['orderRankings'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5});
            }else{
                var xData = [];
                var yData = [];
                res.data.forEach(function (item, index) {
                    xData.push(item.waiterName);
                    yData.push(item.serviceCount)
                });
                initEchart({
                    domName:'.serviceChartContent',
                    xData:xData,
                    yData:yData
                });
            }
        })
    }
    //获取按商品列表
    function getFromGoodsList(pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() !== 'null'?$('#shopSelector').val():null;
        var userId = $('#waiterSelector').val() !== 'null'?$('#waiterSelector').val():null;
        var goodsName = $('.productKeyword').val().trim() === ''?null:$('.productKeyword').val().trim();
        var goodsType = $('#goodsTypeSelector').val() !== 'null'?$('#goodsTypeSelector').val():null;
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "userId": userId,
            "pagination": {
                "sort": "",
                "page2": 1,
                "order": "",
                "page": pageNo||1,
                "rows": pageSize
            },
            "goodsName": goodsName,
            "goodsType":goodsType
        };
        reqAjaxAsync(REQUIRE_URL['fromGoods'],JSON.stringify(params)).done(function (res) {
            total = res.total;
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var goodsHtml = '';
                var No = '';
                res.data.forEach(function (item, index) {
                    No = (params['pagination']['page']-1)*params['pagination']['rows']+index+1;
                    No = No<10?'0'+No:No;
                    goodsHtml += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.salesman+'</td>'
                        +'<td>'+item.purchaseNumTotal+'</td>'
                        +'<td>'+item.consumeTime+'</td>'
                        +'<td>'+item.actualPaymentTotal+'</td>'
                        +'</tr>'
                });
                $('.productReport table tbody').html(goodsHtml);
                defer.resolve(res);
            }
        });
        return defer.promise()
    }
    //获取按客户列表
    function getFromAccountList(pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() !== 'null'?$('#shopSelector').val():null;
        var userId = $('#waiterSelector').val() !== 'null'?$('#waiterSelector').val():null;
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "userId": userId,
            "pagination": {
                "sort": "",
                "page2": 1,
                "order": "",
                "page": pageNo||1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['fromAccount'],JSON.stringify(params)).done(function (res) {
            total = res.total;
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var accountHtml = '';
                var No = '';
                res.data.forEach(function (item, index) {
                    No = (params['pagination']['page']-1)*params['pagination']['rows']+index+1;
                    No = No < 10?'0'+No:No;
                    accountHtml += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.waiterName+'</td>'
                        +'<td>'+item.serviceCount+'</td>'
                        +'</tr>';
                });
                $('.clientReport .table tbody').html(accountHtml);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取服务人头数前十排行
    function getServiceHeadCount(){
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() !== 'null'?$('#shopSelector').val():null;
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['ServiceHeadCountRankings'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var xData = [];
                var yData = [];
                res.data.forEach(function (item, index) {
                    xData.push(item.waiterName);
                    yData.push(item.serviceCount);
                });
                initEchart({
                    domName:'.chartContent',
                    xData:xData,
                    yData:yData
                })
            }
        })
    }
    //选择店铺和员工刷新页面
    function refreshPage(type){
        //type: 1,切换店铺 2,切换时间 3,切换员工
        var cls = $('.filterTab .tabNav .active').attr('data-class');
        if(cls === 'serviceReport' && (type === 1 || type === 2)){
            //按服务，切换店铺或者时间，刷列表和柱状图
            getFromServiceList().done(function (data) {
                // 初始化按服务表格
                initTable('serviceReport',showOrderDetail).done(function (res, curr, count) {
                    // 列表数提示
                    initPageTips(data.total);
                    //列表数大于10显示分页，否则不显示
                    if(data.total > pageSize){
                        //初始化按服务分页
                        initPageSelector('servicePageSelect',data.total,function (obj, first) {
                            //翻页后更新按服务列表
                            getFromServiceList(obj.curr).done(function () {
                                //重新初始化表格
                                initTable('serviceReport',showOrderDetail);
                                // 更新列表数提示
                                updatePageTips(data.total,obj.curr)
                            });
                        });
                    }else{
                        $('#servicePageSelect').html(' ')
                    }
                });
            });
            getOrderRankings()
        }else if(cls === 'productReport' && (type === 1 || type === 2)){
            //按商品，切换店铺或者时间，刷列表
            getFromGoodsList().done(function (res) {
                initTable('productReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('productPageSelect',res.total,function (obj, first) {
                            getFromGoodsList(obj.curr).done(function (res) {
                                updatePageTips(res.total,obj.curr);
                                initTable('productReport')
                            })
                        })
                    }else{
                        $('#productPageSelect').html('')
                    }
                })
            });
        }else if(cls === 'clientReport' && (type === 1 || type === 2)){
            //按客户，切换店铺和时间，刷列表和柱状图
            getFromAccountList().done(function (res) {
                initTable('clientReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('clientPageSelect',res.total,function (obj, first) {
                            getFromAccountList(obj.curr).done(function (res) {
                                initTable('clientReport');
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#clientPageSelect').html('')
                    }
                });
            });
            getServiceHeadCount()
        }else if(cls === 'serviceReport' && type === 3){
            //按服务，切换员工，刷列表
            getFromServiceList().done(function (data) {
                // 初始化按服务表格
                initTable('serviceReport',showOrderDetail).done(function (res, curr, count) {
                    // 列表数提示
                    initPageTips(data.total);
                    //列表数大于10显示分页，否则不显示
                    if(data.total > pageSize){
                        //初始化按服务分页
                        initPageSelector('servicePageSelect',data.total,function (obj, first) {
                            //翻页后更新按服务列表
                            getFromServiceList(obj.curr).done(function () {
                                //重新初始化表格
                                initTable('serviceReport',showOrderDetail);
                                // 更新列表数提示
                                updatePageTips(data.total,obj.curr)
                            });
                        });
                    }else{
                        $('#servicePageSelect').html(' ')
                    }
                });
            })
        }else if(cls === 'productReport' && type === 3){
            //按商品，切换员工，刷列表
            getFromGoodsList().done(function (res) {
                initTable('productReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('productPageSelect',res.total,function (obj, first) {
                            getFromGoodsList(obj.curr).done(function (res) {
                                updatePageTips(res.total,obj.curr);
                                initTable('productReport')
                            })
                        })
                    }else{
                        $('#productPageSelect').html('')
                    }
                })
            });
        }else if(cls === 'clientReport' && type === 3){
            //按客户，切换员工，刷列表
            getFromAccountList().done(function (res) {
                initTable('clientReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('clientPageSelect',res.total,function (obj, first) {
                            getFromAccountList(obj.curr).done(function (res) {
                                initTable('clientReport');
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#clientPageSelect').html('')
                    }
                });
            });
        }
    }
    //初始化页面
    function init(){
        // 获取今天日期
        var today = formatAllDate(new Date(),'yyyy-MM-dd');
        // 获取本月第一天日期
        var first = formatAllDate(new Date(),'yyyy-MM');
        first = first+'-01';
        $('#startDate').val(first);
        $('#endDate').val(today);
        //初始化时间选择插件
        initDateRange().done(function (a,b) {
            //获取店铺列表
            getShopList().done(function () {
                //获取员工列表
                getWaiters();
                //获取冠军报告
                getChampionReport();
                //获取服务单前十排行
                getOrderRankings();
                //获取按服务数据列表
                getFromServiceList().done(function (data) {
                    // 初始化按服务表格
                    initTable('serviceReport',showOrderDetail).done(function (res, curr, count) {
                        $('.serviceReport').css('visibility','visible');
                        // 列表数提示
                        initPageTips(data.total);
                        //列表数大于10显示分页，否则不显示
                        if(data.total > pageSize){
                            //初始化按服务分页
                            initPageSelector('servicePageSelect',data.total,function (obj, first) {
                                //翻页后更新按服务列表
                                getFromServiceList(obj.curr).done(function () {
                                    //重新初始化表格
                                    initTable('serviceReport',showOrderDetail);
                                    // 更新列表数提示
                                    updatePageTips(data.total,obj.curr)
                                });
                            });
                        }else{
                            $('#servicePageSelect').html(' ')
                        }
                    });
                })
            })
        });
        //初始化select2
        $('#serviceSelector').select2({language: "zh-CN",});
        //切换店铺
        $("#shopSelector").change(function () {
            var _this = this;
            //更新冠军报表
            getChampionReport().done(function () {
                $('.path .pathShopName').text($(_this).find(':selected').text());
            });
            // 更新报表
            refreshPage(1);
            //更新员工列表
            getWaiters();
        });
        //切换员工
        $('#waiterSelector').change(function () {
            refreshPage(3)
        });
        //切换商品类型
        $('#goodsTypeSelector').select2({language: "zh-CN",}).change(function () {
            getFromGoodsList().done(function (res) {
                initTable('productReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('productPageSelect',res.total,function (obj, first) {
                            getFromGoodsList(obj.curr).done(function (res) {
                                updatePageTips(res.total,obj.curr);
                                initTable('productReport')
                            })
                        })
                    }else{
                        $('#productPageSelect').html('')
                    }
                })
            });
        });
        //搜索服务商品
        $('.productSearch form').on('submit',function () {
            getFromGoodsList().done(function (res) {
                initTable('productReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('productPageSelect',res.total,function (obj, first) {
                            getFromGoodsList(obj.curr).done(function (res) {
                                updatePageTips(res.total,obj.curr);
                                initTable('productReport')
                            })
                        })
                    }else{
                        $('#productPageSelect').html('')
                    }
                })
            });
        });
        //导出按服务，按商品，按客户报表
        $('.eaportBtn a').click(function () {
            if(total == 0 || !total){
                layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                return false
            }
            var sTime = $('#startDate').val();
            var eTime = $('#endDate').val();
            var shopId = $('#shopSelector').val() === 'null'?'':$('#shopSelector').val();
            var userId = $('#waiterSelector').val() === 'null'?'':$('#waiterSelector').val();
            var goodsType = $('#goodsTypeSelector').val() === 'null'?'':$('#goodsTypeSelector').val();
            var params = 'startTime='+sTime+'&endTime='+eTime+'&shopId='+shopId+'&backUserId='+backUserId+'&userId='+userId;
            var url = '/zxcity_restful/ws/reportEmployeeSales/getServiceTicketDetailInfoByServiceExportXls?';
            var cls = $('.tabNav .active').attr('data-class');
            if(cls === 'serviceReport'){
                // 按服务
                url = '/zxcity_restful/ws/reportEmployeeSales/getServiceTicketDetailInfoByServiceExportXls?';
                params = 'startTime='+sTime+'&endTime='+eTime+'&shopId='+shopId+'&backUserId='+backUserId+'&userId='+userId;
            }else if(cls === 'productReport'){
                // 按商品
                url = '/zxcity_restful/ws/reportEmployeeSales/getSaleRecordListByProductExportXls?';
                params = 'startTime='+sTime+'&endTime='+eTime+'&shopId='+shopId+'&backUserId='+backUserId+'&userId='+userId+'&goodsName='+$('.productKeyword').val().trim()+'&goodsType='+goodsType;
            }else if(cls === 'clientReport'){
                // 按客户
                url = '/zxcity_restful/ws/reportEmployeeSales/getAllServiceHeadCountExportXls?';
                params = 'startTime='+sTime+'&endTime='+eTime+'&shopId='+shopId+'&backUserId='+backUserId+'&userId='+userId;
            }
            $(this).attr('href',url+params);
        });
        //动态设置遮罩高度
        $('.mask').height($(window).height()).on('click',function () {
            //点击遮罩关闭遮罩和时间选择器
            $(this).fadeOut(200);
            $('.timeRange').fadeOut(200);
            $('#startDate').val(ST);
            $('#endDate').val(ET)
        })
    }
});