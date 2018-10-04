$(function () {
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    var REQUIRE_URL = {
        shopList:'reportEmployeeSales/selectShopListByBackUserId',//获取店铺列表
        waiters:'reportEmployeeSales/getUserIdListByBackUserId',//员工列表
        cashChampion:'reportIncomePerformance/getCashAchievementChampion',//现金收入冠军
        serviceChampion:'reportIncomePerformance/getServiceAchievementChampion',//服务业绩冠军
        cashList:'reportIncomePerformance/getAllCashAchievement',//现金收入列表
        serviceAchievement:'reportIncomePerformance/getServiceAchievement',//消耗业绩列表
        serviceAchievementRankings:'reportIncomePerformance/getTopTenServiceAchievement',//消耗业绩前十排行
        serviceOrder:'reportIncomePerformance/getServiceAchievementDetail',//服务单记录列表
    };
    var pageSize = 10;
    var total = 0;
    var ST = '';
    var ET = '';
    //切换现金收入和服务业绩按钮
    $('.tabNav').on('click','a',function () {
        var cls = $(this).attr('data-class');
        $(this).addClass('active').siblings().removeClass('active');
        if(cls === 'moneyReport'){
            $('.'+cls).show();
            $('.consumptionReport').hide();
            getCashList().done(function (res) {
                initTable('moneyReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('moneyPageSelect',res.total,function (obj, first) {
                            getCashList(obj.curr).done(function (res) {
                                initTable('moneyReport');
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#moneyPageSelect').html('')
                    }
                });
            })
        }else if(cls === 'consumptionReport'){
            $('.'+cls).show();
            $('.moneyReport').hide();
            getServiceAchievementList().done(function (res) {
                initTable('consumptionReport',seeDetail).done(function () {
                    $('.consumptionReport').css('visibility','visible');
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('consumptionPageSelect',res.total,function (obj, first) {
                            getServiceAchievementList(obj.curr).done(function (res) {
                                initTable('consumptionReport',seeDetail);
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#consumptionPageSelect').html('')
                    }
                });
            });
            getServiceAchievementRanks();
        }
    });
    //切换本月和自定义时间
    $('.timeNav').on('click','>a',function(){
        $(this).addClass('active').siblings('a').removeClass('active');
        if($(this).hasClass('thisMonth')){
            $('.timeRange').fadeOut(200);
            $('.path .pathTime').text('本月');
            initDateRange().done(function () {
                refreshPage(false)
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
        refreshPage(false);
        $('.pathTime').text(sDate+' 至 '+eDate);
        $('.timeRange').fadeOut(200);
        $('.mask').fadeOut(200);
        ST = sDate;
        ET = eDate;
    });
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
                btns:[ 'now', 'confirm'],
            });
            laydate.render({
                elem:'#endDate',
                max:0,
                value:today,
                isInitValue:true,
                btns:[ 'now', 'confirm'],
            })
        });
        setTimeout(function () {
            defer.resolve(first,today)
        },100);
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
                theme:"#ccc",
                groups:3,
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
                height: 345 ,//设置高度
                limit: 10, //注意：请务必确保 limit 参数（默认：10）是与你服务端限定的数据条数一致
                size:"sm",
                even: true,
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
                    interval:0,
                    //刻度居中与文字
                    alignWithLabel:false,
                    //刻度颜色
                    lineStyle:{
                        color:'#333'
                    }
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
                },
                //坐标轴文字样式
                axisLabel:{
                    show:false
                },
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
                y:25,
                x2:0,
                y2:35,
                borderWidth:1
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    //查看员工业绩详情
    function seeDetail(obj){
        if(obj.event === 'detail'){
            getServiceOrder(obj,1).done(function (res) {
                res.userName = obj.data.userName;
                var html = template('waiterOrderDetailTpl',res);
                layer.open({
                    type:1,
                    area:['61%','80%'],
                    title:'',
                    closeBtn:0,
                    btn:['关闭'],
                    shade:0.5,
                    shadeClose:true,
                    skin:'waiterOrderDetail',
                    content:html,
                    success:function (layeror, index) {
                        // 设置详情分页插件
                        if(res.total > pageSize){
                            initPageSelector('detailPageSelect',res.total,function (currObj, first) {
                                getServiceOrder(obj,currObj.curr).done(function (res) {
                                    var html = '';
                                    var No = '';
                                    res.data.forEach(function (item, index) {
                                        No = (currObj.curr-1)*pageSize+(index+1);
                                        No = No < 10 ? '0'+No : No;
                                        html+='<tr>'
                                            +'<td>'+No+'</td>'
                                            +'<td>'+item.consumeTime+'</td>'
                                            +'<td>'+item.serviceName+'</td>'
                                            +'<td>'+item.consumerName+'</td>'
                                            +'<td>'+item.achPay+'</td>'
                                            +'</tr>'
                                    });
                                    $('.orderDetail tbody').html(html);
                                })
                            });
                        }else{
                            $('#detailPageSelect').html('')
                        }
                        // 设置表格容器的高度
                        $('.orderContent').height($(layeror).height()-$('.detailTop').outerHeight(true)-$('.pageBox').outerHeight(true)-$('.tableTitle').outerHeight(true)-$('.layui-layer-btn').outerHeight(true)-1);
                        //点击右上角关闭按钮关闭弹窗
                        $(layeror).on('click','.closeIcon',function () {
                            layer.close(index)
                        });
                        //导出报表
                        $('.detailExportBtn').click(function () {
                            if(res.total === 0){
                                layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                                return false
                            }
                            var sTime = $('#startDate').val();
                            var eTime = $('#endDate').val();
                            var url = '/zxcity_restful/ws/reportIncomePerformance/getServiceAchievementDetailExportXls?\n' +
                                'startTime='+sTime+'&endTime='+eTime+'&shopId='+obj.data.shopId+'&backUserId='+backUserId+'&userId='+obj.data.userId;
                            $(this).attr('href',url)
                        })
                    }
                })
            })
        }
    }
    //根据员工，时间段，店铺查询服务单记录列表
    function getServiceOrder(obj,pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": obj.data.shopId,
            "userId": obj.data.userId,
            "pagination": {
                "sort": "",
                "page2": 0,
                "order": "",
                "page": pageNo||1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['serviceOrder'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
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
    //获取冠军列表
    function getChampionList(){
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var championObj = {};
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId,
        };
        reqAjaxAsync(REQUIRE_URL['cashChampion'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                championObj['cash'] = res.data;
                reqAjaxAsync(REQUIRE_URL['serviceChampion'],JSON.stringify(params)).done(function (res) {
                    if(res.code !== 1){
                        layer.msg(res.msg,{icon:5})
                    }else{
                        championObj['service'] = res.data;
                        template.defaults.imports.moneyFormat = getMoneyFormat;
                        var html = template('championTpl',championObj);
                        $('.greatBox').html(html)
                    }
                })
            }
        })
    }
    //获取现金业绩列表
    function getCashList(pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var userId = $('#waiterSelector').val() === 'null'?null:$('#waiterSelector').val();
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
        reqAjaxAsync(REQUIRE_URL['cashList'],JSON.stringify(params)).done(function (res) {
            total = res.total;
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var html = '';
                var No = '';
                var incomeFrom = '';
                res.data.forEach(function (item, index) {
                    No = (params['pagination']['page']-1)*pageSize+(index+1);
                    No = No < 10 ? '0'+No : No;
                    if(item.incomeFrom == 1){
                        incomeFrom = '充值'
                    }else if(item.incomeFrom == 2){
                        incomeFrom = '现金消费'
                    }else if(item.incomeFrom == 3){
                        incomeFrom = '定金预售'
                    }
                    html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.userName+'</td>'
                        +'<td>'+item.memberName+'</td>'
                        +'<td>'+incomeFrom+'</td>'
                        +'<td>'+item.achPay+'</td>'
                        +'<td>'+item.consumeTime+'</td>'
                        +'</tr>'
                });
                $('.moneyReport table tbody').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取消耗业绩列表
    function getServiceAchievementList(pageNo){
        var defer = $.Deferred();
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var userId = $('#waiterSelector').val() === 'null'?null:$('#waiterSelector').val();
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
        reqAjaxAsync(REQUIRE_URL['serviceAchievement'],JSON.stringify(params)).done(function (res) {
            total = res.total;
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var html = '';
                var No = '';
                res.data.forEach(function (item, index) {
                    No = (params['pagination']['page']-1)*pageSize+(index+1);
                    No = No < 10 ? '0'+No : No;
                    html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.userName+'</td>'
                        +'<td>'+item.achPay+'</td>'
                        +'<td style="display: none">'+item.shopId+'</td>'
                        +'<td style="display: none">'+item.userId+'</td>'
                        +'</tr>'
                });
                $('.consumptionReport .table tbody').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取消耗业绩前十排行
    function getServiceAchievementRanks(){
        var sTime = $('#startDate').val().trim();
        var eTime = $('#endDate').val().trim();
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var params = {
            "startTime": sTime,
            "endTime": eTime,
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['serviceAchievementRankings'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var xData = [];
                var yData = [];
                res.data.forEach(function (item, index) {
                    xData.push(item.userName);
                    yData.push(item.achPay)
                });
                initEchart({
                    domName:'.chartContent',
                    xData:xData,
                    yData:yData
                });
            }
        })
    }
    //切换时间，店铺，员工刷新页面
    function refreshPage(isWaiter){
        var tabType = $('.tabNav .active').attr('data-type');
        if(tabType == 1 && isWaiter){
            //切换员工 刷现金收入列表
            getCashList().done(function (res) {
                initTable('moneyReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('moneyPageSelect',res.total,function (obj, first) {
                            getCashList(obj.curr).done(function (res) {
                                initTable('moneyReport');
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#moneyPageSelect').html('')
                    }
                });
            })
        }else if(tabType ==2 && isWaiter){
            //切换员工 刷服务业绩列表
            getServiceAchievementList().done(function (res) {
                initTable('consumptionReport',seeDetail).done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('consumptionPageSelect',res.total,function (obj, first) {
                            getServiceAchievementList(obj.curr).done(function (res) {
                                initTable('consumptionReport',seeDetail);
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#consumptionPageSelect').html('')
                    }
                });
            });
        }else if(tabType == 1 && !isWaiter){
            // 切换时间和店铺 刷现金收入列表和冠军列表
            getCashList().done(function (res) {
                initTable('moneyReport').done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('moneyPageSelect',res.total,function (obj, first) {
                            getCashList(obj.curr).done(function (res) {
                                initTable('moneyReport');
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#moneyPageSelect').html('')
                    }
                });
            });
            getChampionList()
        }else if(tabType ==2 && !isWaiter){
            // 切换时间和店铺 刷服务业绩列表和服务业绩前十排行，冠军列表
            getServiceAchievementList().done(function (res) {
                initTable('consumptionReport',seeDetail).done(function () {
                    initPageTips(res.total);
                    if(res.total > pageSize){
                        initPageSelector('consumptionPageSelect',res.total,function (obj, first) {
                            getServiceAchievementList(obj.curr).done(function (res) {
                                initTable('consumptionReport',seeDetail);
                                updatePageTips(res.total,obj.curr)
                            })
                        })
                    }else{
                        $('#consumptionPageSelect').html('')
                    }
                });
            });
            getServiceAchievementRanks();
            getChampionList()
        }
    }
    //初始化页面
    init();
    function init(){
        // 获取今天日期
        var today = formatAllDate(new Date(),'yyyy-MM-dd');
        // 获取本月第一天日期
        var first = formatAllDate(new Date(),'yyyy-MM');
        first = first+'-01';
        $('#startDate').val(first);
        $('#endDate').val(today);
        //初始化时间选择插件
        initDateRange().done(function () {
            //获取店铺列表
            getShopList().done(function () {
                //获取冠军列表
                getChampionList();
                //获取员工列表
                getWaiters();
                //获取现金收入列表
                getCashList().done(function (res) {
                    initTable('moneyReport').done(function () {
                        $('.moneyReport').css('visibility','visible');
                        initPageTips(res.total);
                        if(res.total > pageSize){
                            initPageSelector('moneyPageSelect',res.total,function (obj, first) {
                                getCashList(obj.curr).done(function (res) {
                                    initTable('moneyReport');
                                    updatePageTips(res.total,obj.curr)
                                })
                            })
                        }else{
                            $('#moneyPageSelect').html('')
                        }
                    });
                })
            });
        });
        //切换店铺
        $('#shopSelector').change(function () {
            $('.pathShopName').text($(this).find(':selected').text());
            getWaiters();
            refreshPage(false)
        });
        //切换员工
        $('#waiterSelector').change(function () {
            refreshPage(true)
        });
        //导出报表
        $('.exportBtn').on('click','a',function () {
            if(total == 0){
                layer.msg('暂无相关数据，无法执行导出',{icon:5,time:1500});
                return false
            }
            var sTime = $('#startDate').val();
            var eTime = $('#endDate').val();
            var shopId = $('#shopSelector').val() === 'null'?'':$('#shopSelector').val();
            var userId = $('#waiterSelector').val() === 'null'?'':$('#waiterSelector').val();
            var url = '/zxcity_restful/ws/reportIncomePerformance/getAllCashAchievementExportXls?';
            var params = 'startTime='+sTime+'&endTime='+eTime+'&shopId='+shopId+'&backUserId='+backUserId+'&userId='+userId;
            var type = $('.tabNav .active').attr('data-type');
            if(type === '1'){
                url = '/zxcity_restful/ws/reportIncomePerformance/getAllCashAchievementExportXls?'
            }else if(type === '2'){
                url = '/zxcity_restful/ws/reportIncomePerformance/getServiceAchievementExportXls?'
            }
            $(this).attr('href',url+params)
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
