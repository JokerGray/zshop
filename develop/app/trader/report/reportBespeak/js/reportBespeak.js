layui.use(['layer','form','laydate'],function () {
    var form = layui.form;
    var $ = layui.$;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var today = formatAllDate(new Date(),'yyyy-MM-dd');
    var yesterday = getDate(-1);
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        bespeakOverview:'backbespeak/getBackBespokeThreeInfo',//预约概览
        bespeakTrend:'backbespeak/getBackBespokeThreeInfoDayChart',//预约走势
        bespeakList:'backbespeak/getBackBespokeListByParam',//预约列表
        bespeakDetail:'backbespeak/getBackBespokeDetailInfo'//预约明细
    };
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
                    requireData()
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
                    requireData()
                },0)
            }
        })
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
                    html = '<option value="">全部店铺</option>';
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

    //获取预约概览
    function getBespeakOverview(){
        var bespokeType = $('.radioNav .active').attr('data-type');
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today
        }else if(type === '0'){
            startTime = endTime = ''
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "bespokeType": bespokeType,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['bespeakOverview'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#add').text(res.data.newBespokeCount);
                $('#finish').text(res.data.finishBespokeCount);
                $('#cancel').text(res.data.cacelBespokeCount);
                var newCompare = res.data.newBespokeCount - res.data.lastNewBespokeCount;
                var finishCompare = res.data.finishBespokeCount - res.data.lastFinishBespokeCount;
                var cancelCompare = res.data.cacelBespokeCount - res.data.lastCacelBespokeCount;

                if(type === '1' && newCompare > 0){
                    $('#addComparison').text('高于前一日'+newCompare)
                }else if(type === '1' && newCompare < 0){
                    $('#addComparison').text('低于前一日'+(newCompare*-1))
                }else if(type === '1' && newCompare === 0){
                    $('#addComparison').text('与前一日持平')
                }else{
                    $('#addComparison').text('')
                }
                if(type === '1' && finishCompare > 0){
                    $('#finishComparison').text('高于前一日'+finishCompare)
                }else if(type === '1' && finishCompare < 0){
                    $('#finishComparison').text('低于前一日'+(finishCompare*-1))
                }else if(type === '1' && finishCompare === 0){
                    $('#finishComparison').text('与前一日持平')
                }else{
                    $('#finishComparison').text('')
                }
                if(type === '1' && cancelCompare > 0){
                    $('#cancelComparison').text('高于前一日'+cancelCompare)
                }else if(type === '1' && cancelCompare < 0){
                    $('#cancelComparison').text('低于前一日'+(cancelCompare*-1))
                }else if(type === '1' && cancelCompare === 0){
                    $('#cancelComparison').text('与前一日持平')
                }else{
                    $('#cancelComparison').text('')
                }
            }
        })
    }

    //获取预约走势
    function getBespeakTrend(){
        var titleTime = '';
        var bespokeType = $('.radioNav .active').attr('data-type');
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today;
            titleTime = '(7日内)'
        }else if(type === '0'){
            startTime = endTime = '';
            titleTime = '(30日内)'
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
            titleTime = '('+$('#dateRange').val()+')'
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "bespokeType": bespokeType,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['bespeakTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var xData = [];
                var yData1 = [];
                var yData2 = [];
                var yData3 = [];
                var title = $('.radioNav .active').find('span').text()+'走势';
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
                echartsTrend({
                    title:title+titleTime,
                    xData:xData,
                    yData1:yData1,
                    yData2:yData2,
                    yData3:yData3
                });
            }
        })
    }

    //获取预约明细
    function getBespeakList(pageNo){
        var bespokeType = $('.radioNav .active').attr('data-type');
        var shopId = $('#shopSelector').val() || '';
        var type = $('.timeTab .active').attr('data-navType');
        var startTime = '';
        var endTime = '';
        if(type === '1'){
            startTime = endTime = $('#day').val() || today;
        }else if(type === '0'){
            startTime = endTime = '';
        }else if(type === '4'){
            startTime = $('#dateRange').val().split('~')[0].trim();
            endTime = $('#dateRange').val().split('~')[1].trim();
        }
        var params = {
            "type": type,
            "startTime": startTime,
            "endTime": endTime,
            "backUserId": backUserId,
            "bespokeType": bespokeType,
            "shopId": shopId,
            "pagination": {
                "page": pageNo || 1,
                "rows": pageSize
            },
        };
        var url = '/zxcity_restful/ws/backbespeak/exportBespokeListByParam?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&startTime='+startTime+'&endTime='+endTime+'&bespokeType='+bespokeType;
        reqAjaxAsync(REQUIRE_URL['bespeakList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.data.total === 0){
                    html = '<tr><td style="text-align: center;" colspan="12">暂无相关数据</td></tr>'
                }else{
                    res.data.rows.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        html +='<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+(item.serviceName || "----")+'</td>'
                        +'<td>'+(item.waiter || "无")+'</td>'
                        +'<td>'+item.customer+'</td>'
                        +'<td>'+item.mobile+'</td>'
                        +'<td>'+item.bespokeStartTime+'</td>'
                        +'<td>'+item.bespokeEndTime+'</td>'
                        +'<td>'+item.createTime+'</td>'
                        +'<td>'+item.bespokeType+'</td>'
                        +'<td>'+item.bespokeStatus+'</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-id="'+item.id+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.data.total,function (obj, first) {
                        getBespeakList(obj.curr)
                    })
                }
            }
            $('.exportBtn').attr('href',url)
        })
    }

    //获取预约明细
    function getBespokeDetail(id){
        var defer =$.Deferred();
        var params = {
            "backUserId": backUserId,
            "id": id
        };
        reqAjaxAsync(REQUIRE_URL['bespeakDetail'],JSON.stringify(params)).done(function (res) {
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
        requireData()
    });

    //切换预约方式
    $('.radioNav ul li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.bespeakType').text($(this).find('span').text());
        requireData()
    });

    //切换店铺
    form.on('select(shopSelector)',function () {
        $('.shopName').text($('#shopSelector :selected').text());
        requireData()
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

    //请求三大数据
    function requireData(){
        getBespeakOverview();
        getBespeakTrend();
        getBespeakList()
    }

    //初始化页面
    function init(){
        initDate();
        //获取店铺列表
        getShopList().done(function () {
            form.render();
            requireData()
        });
    }
});