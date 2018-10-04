layui.use(['form','laydate','layer'],function () {
    var form = layui.form;
    var $ = layui.$;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        bespokeCount:'cs_bespeak/getBespokeThreeInfo',//预约总数，转工单数，取消数
        bespokeTrend:'cs_bespeak/getBespokeThreeInfoDayList',//预约走势
        bespokeList:'cs_bespeak/getBespokeListByParam',//预约列表
        bespokeDetail:'cs_bespeak/getBespokeDetailInfo',//预约详情
    };
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var today = formatAllDate(new Date(),'yyyy-MM-dd');
    var yesterday = getDate(-1);
    init();
    //初始化分页方法
    function initPageSelector(domId, total, jump) {
        if (total <= pageSize) {
            $('#' + domId).html('');
            return
        }
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: domId,
                count: total, //数据总数，从服务端得到
                theme: "#ccc",
                limit: pageSize,
                groups: 3,
                jump: function (obj, first) {
                    //首次不执行
                    if (!first) {
                        jump ? jump(obj, first) : null
                        //do something
                    }
                }
            })
        })
    }

    //初始化时间选择
    function initDate(){
        laydate.render({
            elem: '#day',
            type:'date',
            value:new Date(),
            isInitValue:true,
            max:0,
            btns:['now', 'confirm'],
            done:function () {
                setTimeout(function () {
                    //获取预约总数，转工单数，取消数
                    getBespokeCount();
                    // 预约走势
                    getBespokeTrend();
                    //获取预约列表
                    getBespokeList()
                },0)
            }
        });
        var ins = laydate.render({
            elem: '#dateRange',
            type:'date',
            value:yesterday+' ~ '+today,
            isInitValue:true,
            max:0,
            range:'~',
            btns:['now', 'confirm'],
            change: function(value, date, endDate){
                var st = value.split('~')[0].trim();
                var et = value.split('~')[1].trim();
                var between = daysBetween(st,et);
                if(between === 0){
                    ins.hint('起始时间不能为同一天');
                    setTimeout(function () {
                        $('.laydate-btns-confirm').addClass('laydate-disabled')
                    },0)

                }else if(between > 30){
                    ins.hint('起始时间间隔不能大于30天');
                    setTimeout(function () {
                        $('.laydate-btns-confirm').addClass('laydate-disabled')
                    },0)
                }
            },
            done:function () {
                setTimeout(function () {
                    //获取预约总数，转工单数，取消数
                    getBespokeCount();
                    // 预约走势
                    getBespokeTrend();
                    //获取预约列表
                    getBespokeList()
                },0)
            }
        })
    }

    //echart折线图方法
    function echartsTrend(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.querySelector('#trend'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#9ddd64','#1e9fff','#cccccc'],
            title: {
                text:obj.title,
                textStyle: {
                    color: '#333',
                    fontWeight: 'normal',
                    fontSize: '15'
                },
                left: 20,
                top: 6
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['新增预约','完成预约','预约取消'],
                right: 30,
                top: 6
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#cccccc'
                    }
                },
                axisLabel: {
                    color: '#666'
                },
                // name:'日期',
                // nameTextStyle:{
                //     fontSize:14,
                //     color:'#666',
                //     padding:[22,0,0,0]
                // },
                // nameGap:30,
                splitLine: {
                    show: true,
                    interval: obj.xData.length - 2,
                },
                data: obj.xData
                // data: ['07-29','07-30','07-31','08-01','08-02','08-03','08-04']

            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    color: '#666'
                },
                name: '人数',
                nameRotate: 90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#666',
                    padding: [0, 0, 35, 0]
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
            },
            series: [
                {
                    name: '新增预约',
                    type: 'line',
                    smooth: true,
                    data: obj.yData1,
                },
                {
                    name: '完成预约',
                    type: 'line',
                    smooth: true,
                    data: obj.yData2,
                },
                {
                    name: '预约取消',
                    type: 'line',
                    smooth: true,
                    data: obj.yData3,
                }
            ],
            grid: {
                borderWidth: 1,
                left: '80px',
                right: '30px',
                bottom: '10%',
                top: '14%'
            },
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //获取前几天后几天的日期
    function getDate(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+(m<10?"0"+m:m)+"-"+(d<10?"0"+d:d);
    }

    //获取店铺列表
    function getShopList() {
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId
        };
        reqAjaxAsync(REQUIRE_URL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                if(res.data.flag){
                    html = '<option value="">全部店铺</option>'
                }
                res.data.shopList.forEach(function (item, index) {
                    html += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
                });
                $('#shopSelector').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取预约总数，转工单数，取消数
    function getBespokeCount(){
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "backUserId": backUserId,//登录人用户主键
            "type": type,// 查询时间类型: 0.全部,1.天,4.自定义时间段
            "shopId": shopId,//店铺主键
            "startTime": startTime,//开始时间(1,4必传)
            "endTime": endTime//结束时间(4必传)
        };
        reqAjaxAsync(REQUIRE_URL['bespokeCount'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{

                $('#add').text(res.data.newBespokeCount);
                $('#finish').text(res.data.finishBespokeCount);
                $('#cancel').text(res.data.cacelBespokeCount);
                if(type === '1'){
                    var addComparison = res.data.newBespokeCount - res.data.lastNewBespokeCount;//新增比较
                    var finishComparison = res.data.finishBespokeCount - res.data.lastFinishBespokeCount;//完成比较
                    var cancelComparison = res.data.cacelBespokeCount - res.data.lastCacelBespokeCount;//取消比较
                    if(addComparison > 0){
                        $('#addComparison').text('高于前日' + addComparison)
                    }else if(addComparison < 0){
                        $('#addComparison').text('低于前日' + Math.abs(addComparison))
                    }else if(addComparison === 0){
                        $('#addComparison').text('与前日持平')
                    }
                    if(finishComparison > 0){
                        $('#finishComparison').text('高于前日' + finishComparison)
                    }else if(finishComparison < 0){
                        $('#finishComparison').text('低于前日' + Math.abs(finishComparison))
                    }else if(finishComparison === 0){
                        $('#finishComparison').text('与前日持平')
                    }
                    if(cancelComparison > 0){
                        $('#cancelComparison').text('高于前日' + cancelComparison)
                    }else if(cancelComparison < 0){
                        $('#cancelComparison').text('低于前日' + Math.abs(cancelComparison))
                    }else if(cancelComparison === 0){
                        $('#cancelComparison').text('与前日持平')
                    }
                }else{
                    $('#addComparison').text('');
                    $('#finishComparison').text('');
                    $('#cancelComparison').text('')
                }
            }
        })
    }

    //预约走势
    function getBespokeTrend(){
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "backUserId": backUserId,//登录人用户主键
            "type": type,// 查询时间类型: 0.全部,1.天,4.自定义时间段
            "shopId": shopId,//店铺主键
            "startTime": startTime,//开始时间(1,4必传)
            "endTime": endTime//结束时间(4必传)
        };
        reqAjaxAsync(REQUIRE_URL['bespokeTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:150})
            }else{
                var title = '';
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                var yData3 = [];
                res.data.newBespokeList.forEach(function (item, index) {
                    xData.push(item.dateDay.substring(5));
                    yData1.push(item.num)
                });
                res.data.finishBespokeList.forEach(function (item, index) {
                    yData2.push(item.num)
                });
                res.data.cancelBespokeList.forEach(function (item, index) {
                    yData3.push(item.num)
                });
                if(type === '0'){
                    title = '预约情况走势(近30日)'
                }else if(type === '1'){
                    title = '预约情况走势(近7日)'
                }else if(type === '4'){
                    title = '预约情况走势('+$('#dateRange').val()+')'
                }
                echartsTrend({
                    title:title,
                    xData:xData,
                    yData1:yData1,
                    yData2:yData2,
                    yData3:yData3
                })
            }
        })
    }

    //获取预约列表
    function getBespokeList(pageNo){
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "shopId": shopId,
            "pagination": {
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['bespokeList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                var statusText = '';
                if(res.data.total === 0){
                    html = '<tr><td colspan="11" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.rows.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.bespokeStatus === 0){
                            statusText = '预约中'
                        }else if(item.bespokeStatus === 1){
                            statusText = '已完成'
                        }else if(item.bespokeStatus === 2){
                            statusText = '待确认'
                        }else if(item.bespokeStatus === -1){
                            statusText = '已取消'
                        }else if(item.bespokeStatus === -2){
                            statusText = '已过期'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+(item.serviceName === null?"无":item.serviceName)+'</td>'
                        +'<td>'+(item.waiter === null?"无":item.waiter)+'</td>'
                        +'<td>'+(item.customer === null?"散客":item.customer)+'</td>'
                        +'<td>'+item.mobile+'</td>'
                        +'<td>'+(item.bespokeTime || "----")+'</td>'
                        +'<td>'+(item.bespokeEndTime || "----")+'</td>'
                        +'<td>'+(item.createTime || "----")+'</td>'
                        +'<td>'+statusText+'</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-id="'+item.id+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.data.total,function (obj, first) {
                        getBespokeList(obj.curr)
                    });
                }
            }
        })
    }

    //获取预约详情
    function getBespokeDetail(id){
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId,// 后台登录人主键
            "id": id,//预约主键
        };
        reqAjaxAsync(REQUIRE_URL['bespokeDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //切换时间（日报，全部，自定义）
    $('.timeTab').on('click','ul li',function () {
        var navType = $(this).attr('data-navType');
        $(this).addClass('active').siblings('li').removeClass('active');
        if(navType === '0'){
            $('.timeSelector').find('div:eq(1)').show().siblings().hide()
        }else if(navType === '1'){
            $('.timeSelector').find('div:eq(0)').show().siblings().hide()
        }else if(navType === '4'){
            $('.timeSelector').find('div:eq(2)').show().siblings().hide()
        }
        //获取预约总数，转工单数，取消数
        getBespokeCount();
        // 预约走势
        getBespokeTrend();
        //获取预约列表
        getBespokeList()
    });

    //切换店铺
    form.on('select(shopSelector)',function () {
        $('.shopName').text($('#shopSelector :selected').text());
        //获取预约总数，转工单数，取消数
        getBespokeCount();
        // 预约走势
        getBespokeTrend();
        //获取预约列表
        getBespokeList()
    });

    //查看预约单详情
    $('.tableBox table tbody').on('click','td a',function () {
        var id = $(this).attr('data-id');
        getBespokeDetail(id).done(function (res) {
            var html = template('detailTpl',res);
            layer.open({
                type:1,
                // title:['预约明细','background-color:#353b53;color:#fff;height:34px;line-height:34px'],
                title:'',
                move:false,
                closeBtn:0,
                shade:0.5,
                shadeClose:true,
                scrollbar:false,
                skin:'detailPage',
                area:['85%','557px'],
                content:html,
                success:function (layeror, index) {
                    $(layeror).on('click','.closeBtn',function () {
                        layer.close(index)
                    })
                }
            })
        })
    });

    //导出预约列表
    $('.exportBtn').click(function () {
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var url = '/zxcity_restful/ws/cs_bespeak/exportBespokeListByParam?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime;
        $(this).attr('href',url)
    });

    //初始化页面
    function init(){
        initDate();
        getShopList().done(function () {
            form.render('select');
            $('.shopName').text($('#shopSelector :selected').text());
            //获取预约总数，转工单数，取消数
            getBespokeCount();
            // 预约走势
            getBespokeTrend();
            //获取预约列表
            getBespokeList()
        });
        // getShopList().done(function () {
        //     form.render('select')
        // })
    }
});