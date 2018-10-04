$(function () {
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;
    var REQUIRE_URL = {
        shopList:'reportEmployeeSales/selectShopListByBackUserId',//获取店铺列表
        waiters:'reportEmployeeSales/getUserIdListByBackUserId',//员工列表
        championReport:'reportMember/selectFiveMemberTop',//冠军统计
        reportList:'reportMember/queryShopThreeInfoPageList',//统计列表
        membershipTrend:'reportMember/selectThreeInfoNumberList',//会员走势
        memberDetail:'reportMember/selectShopThreeInfoNumberList'//会员详情
    };
    var MM = '';
    //切换本月和自定义时间
    $('.timeNav').on('click','>a',function(){
        $(this).addClass('active').siblings('a').removeClass('active');
        if($(this).hasClass('thisMonth')){
            $('.timeRange').fadeOut(200);
            $('.path .pathTime').text('本月');
            initDateRange();
            //更新4大冠军数据
            getChampionReport();
            //获取报表数据
            getReportList().done(function (res) {
                // 初始化表格
                initTable('memberReport',detailPage).done(function () {
                    $('.table').css('visibility','visible');
                    // 初始化列表数提示
                    initPageTips(res.total);
                    //初始化分页
                    if(res.total > pageSize) {
                        initPageSelector('memberPageSelect', res.total, function (obj, first) {
                            // 更新列表数据
                            getReportList(obj.curr).done(function () {
                                // 重新初始化表格
                                initTable('memberReport',detailPage);
                                // 更新列表数提示
                                updatePageTips(res.total, obj.curr)
                            })
                        })
                    }else{
                        $('#memberPageSelect').html('')
                    }
                });
            });
            //更新会员走势图
            getMembershipTrend()
        }else if($(this).hasClass('selfTime')){
            $('.timeRange').fadeToggle(200);
            $('.mask').fadeToggle(200);
        }
    });
    //确定时间范围选择按钮
    $('#sure').on('click',function(){
        var month = $('#Month').val().trim();
        // var eDate = $('#endDate').val().trim();
        // if(new Date(sDate).getTime()> new Date(eDate).getTime()){
        //     layer.msg('开始时间不能大于结束时间',{icon:2});
        //     return
        // }
        //更新4大冠军数据
        getChampionReport();
        //获取报表数据
        getReportList().done(function (res) {
            // 初始化表格
            initTable('memberReport',detailPage).done(function () {
                $('.table').css('visibility','visible');
                // 初始化列表数提示
                initPageTips(res.total);
                //初始化分页
                if(res.total > pageSize) {
                    initPageSelector('memberPageSelect', res.total, function (obj, first) {
                        // 更新列表数据
                        getReportList(obj.curr).done(function () {
                            // 重新初始化表格
                            initTable('memberReport',detailPage);
                            // 更新列表数提示
                            updatePageTips(res.total, obj.curr)
                        })
                    })
                }else{
                    $('#memberPageSelect').html('')
                }
            });
        });
        //更新会员走势图
        getMembershipTrend();
        $('.pathTime').text(month);
        $('.timeRange').fadeOut(200);
        $('.mask').fadeOut(200);
        MM = month
    });
    //初始化时间选择插件
    function initDateRange(){
        var defer = $.Deferred();
        // 获取当前月份
        var month = formatAllDate(new Date(),'yyyy-MM');
        MM = month;
        // // 获取本月第一天日期
        // var first = formatAllDate(new Date(),'yyyy-MM');
        // first = first+'-01';
        layui.use('laydate',function () {
            var laydate = layui.laydate;
            laydate.render({
                type:'month',
                elem:'#Month',
                max:0,
                value:month,
                isInitValue:true,
                btns:[ 'now', 'confirm'],
            });
            // laydate.render({
            //     elem:'#endDate',
            //     max:0,
            //     value:today,
            //     isInitValue:true
            // })
        });
        setTimeout(function () {
            defer.resolve(month)
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
                height: 410 ,//设置高度
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
    //初始化echart折线图方法
    function initEchartLine(obj){
        var myChart  = echarts.init(document.querySelector(obj.domName));
        var option = {
            title: {
                text: obj.monthText+'会员走势图',
                left:40,
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: obj.xData,
                name:'日期',
                nameLocation:'end',
                nameTextStyle:{
                    //坐标轴名称样式
                    fontSize:'14',
                    color:'#828890',
                    padding:[30,0,0,-15]
                },
                axisLine:{
                    //坐标轴样式
                    lineStyle:{
                        color:'#e9e9e9'
                    }
                },
                //坐标轴刻度样式
                axisTick:{
                    //刻度居中与文字
                    alignWithLabel:true,
                    //刻度颜色
                    lineStyle:{
                        color:'#828890'
                    }
                },
                //坐标轴文字样式
                axisLabel:{
                    color:'#828890',
                    fontSize:14
                },
                //刻度从0开始
                boundaryGap: true,
                //x轴分割线
                splitLine:{
                    show:true,
                    interval:obj.xData.length-1,
                    lineStyle:{
                        color:'#e9e9e9'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name:'人数',
                minInterval: 1,
                splitNumber:5,
                nameTextStyle:{
                    //坐标轴名称样式
                    fontSize:'14',
                    color:'#828890',
                    padding:[30,40,0,0]
                },
                axisLine:{
                    //坐标轴样式
                    lineStyle:{
                        color:'#e9e9e9'
                    }
                },
                //坐标轴文字样式
                axisLabel:{
                    show:true,
                    color:'#828890'
                },
                //坐标轴刻度样式
                axisTick:{
                    show:false,
                    lineStyle:{
                        color:'#828890'
                    }
                },
                //坐标轴在 grid 区域中的分隔线
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:'#e9e9e9'
                    }
                },
                splitArea:{
                    show:true,
                    areaStyle:{
                        color:['#f9f9f9','#f9f9f9']
                    }
                }
            },
            legend: {
                data:['到店人数','新客人数','服务人头数'],
                itemWidth: 30,
                itemHeight: 10,
                itemGap: 30,
                icon:'rect',
                top:5
            },
            series: obj.yData,
            //设置坐标轴位置
            grid:{
                borderWidth:1,
                left: '5%',
                right: '5%',
                bottom: '7%',
            },
            color:['#fda359','#81daff','#3ac471']
        };
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
    //获取4大冠军统计
    function getChampionReport(){
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var checkMonth = $('#Month').val().trim() === ''?null:$('#Month').val().trim();
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "checkMonth": checkMonth
        };
        reqAjaxAsync(REQUIRE_URL['championReport'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5});
            }else{
                var greatHtml = template('greatTpl',res);
                $('.greatBox').html(greatHtml)
            }
        })
    }
    //获取新客人数(会员),到店人数(会员),服务人头数(会员)统计
    function getReportList(pageNo){
        var defer = $.Deferred();
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var checkMonth = $('#Month').val().trim() === ''?null:$('#Month').val().trim();
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "checkMonth": checkMonth,
            "pagination": {
                "page": pageNo||1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['reportList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var reportHtml = '';
                var No = '';
                res.data.forEach(function (item, index) {
                    No = (params['pagination']['page']-1)*pageSize+(index+1);
                    No = No<10?'0'+No:No;
                    reportHtml+='<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.reachStoreNumber+'</td>'
                        +'<td>'+item.servicePeopleNumber+'</td>'
                        +'<td>'+item.newMemberCardCount+'</td>'
                        +'<td>'+item.shopId+'</td>'
                        +'</tr>'
                });
                $('#memberReport tbody').html(reportHtml);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //获取会员走势图
    function getMembershipTrend(){
        var shopId = $('#shopSelector').val() === 'null'?null:$('#shopSelector').val();
        var checkMonth = $('#Month').val().trim() === ''?null:$('#Month').val().trim();
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "checkMonth": checkMonth
        };
        reqAjaxAsync(REQUIRE_URL['membershipTrend'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5})
            }else{
                var today = formatAllDate(new Date(),'yyyy-MM') === checkMonth?formatAllDate(new Date(),'d'):31;
                var monthText = formatAllDate(new Date(),'yyyy-MM') === checkMonth?'本月':checkMonth;
                var allTime = [];
                var newMemberCardListData = [];//新客人数
                var reachStoreListData = [];//到店人数
                var servicePeopleListData = [];//服务人头数
                res.data.newMemberCardList.forEach(function (item,index) {
                    // newMemberCardListTime.push(parseInt(item.dayStage.substring(8,10)));
                    newMemberCardListData[parseInt(item.dayStage.substring(8,10))-1] = item.num
                });
                res.data.reachStoreList.forEach(function (item, index) {
                    reachStoreListData[parseInt(item.dayStage.substring(8,10))-1] = item.num
                });
                res.data.servicePeopleList.forEach(function (item, index) {
                    servicePeopleListData[parseInt(item.dayStage.substring(8,10))-1] = item.num
                });
                for(var i = 1;i <= today;i++){
                    allTime[i - 1] = i;
                    if(!newMemberCardListData[i - 1]){
                        newMemberCardListData[i - 1] = 0
                    }
                    if(!reachStoreListData[i-1]){
                        reachStoreListData[i-1] = 0
                    }
                    if(!servicePeopleListData[i-1]){
                        servicePeopleListData[i-1] = 0
                    }
                }
                initEchartLine({
                    domName:'.chartContent',
                    xData:allTime,
                    monthText:monthText,
                    yData:[
                        {
                            name:'到店人数',
                            data: reachStoreListData,
                            type: 'line'
                        },
                        {
                            name:'新客人数',
                            data: newMemberCardListData,
                            type: 'line'
                        },
                        {
                            name:'服务人头数',
                            data: servicePeopleListData,
                            type: 'line'
                        }
                    ]
                })
            }
        })
    }
    //详情弹窗
    function detailPage(value){
        var shopId = value.data.shopId;
        var shopName = value.data.shopName;
        var totalNum = 0;
        getMemberDetail(shopId,1,1).done(function (res) {
            totalNum = res.data.total;
            res.shopName = shopName;
            var html = template('detailPageTpl',res);
            layer.open({
                type:1,
                title:'',
                closeBtn:0,
                area:['66%','76%'],
                shade:0.5,
                shadeClose:true,
                skin:'detailPage',
                content:html,
                success:function (layeror, index) {
                    initPageSelector('detailPageSelector',res.data.total,function (obj, first) {
                        getMemberDetail(shopId,1,obj.curr).done(function (res) {
                            showList(res.data.rows,obj.curr)
                        });
                    });
                    layui.use('form', function() {
                        var form = layui.form;
                        //更新单选框
                        form.render();
                        //点击关闭按钮关闭弹窗
                        $(layeror).on('click','.closeIcon',function () {
                            layer.close(index)
                        });
                        //动态设置表格容器高度
                        $('.detailTableBox').outerHeight($(layeror).height()-$('.detailTop').height()-$('.detailPath').outerHeight(true)-$('.detailPageSelector').outerHeight(true));
                        //监听单选框时间
                        form.on('radio(radio)',function (value) {
                            var type = value.value;
                            getMemberDetail(shopId,type,1).done(function (res) {
                                totalNum = res.data.total;
                                showList(res.data.rows,1);
                                initPageSelector('detailPageSelector',res.data.total,function (obj, first) {
                                    getMemberDetail(shopId,type,obj.curr).done(function (res) {
                                        showList(res.data.rows,obj.curr)
                                    });
                                })
                            });
                        });
                        //导出报表
                        $(layeror).on('click','#exportBtn',function () {
                            if(totalNum === 0){
                                layer.msg('暂无相关数据，无法执行导出操作',{icon:5,time:1500});
                                return false;
                            }
                            var type = $(layeror).find('.detailPath input:checked').val();
                            var  checkMonth = $('#Month').val();
                            var url = '/zxcity_restful/ws/reportMember/exportShopThreeInfoNumberList?backUserId='+backUserId+'&shopId='+shopId+'&type='+type+'&checkMonth='+checkMonth;
                            $(this).attr('href',url)
                        })
                    })
                }
            })
        });
        function showList(data,curr){
            var No = 0;
            var html = '';
            if(data.length === 0){
                html = '<tr><td colspan="4">暂无相关数据</td></tr>'
            }else{
                data.forEach(function (item, index) {
                    No = (curr-1)*pageSize+(index+1);
                    No = No < 10 ? '0'+No : No;
                    html+='<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.shopName+'</td>'
                        +'<td>'+item.memberName+'</td>'
                        +'<td>'+item.consumeTime+'</td>'
                        +'</tr>'
                });
            }
            $('.detailTableBox table tbody').html(html)
        }
    }
    //获取会员统计详情
    function getMemberDetail(shopId,type,pageNo){
        var defer = $.Deferred();
        var checkMonth = $('#Month').val();
        var params = {
            "backUserId": backUserId,
            "shopId": shopId,
            "type": type,
            "pagination": {
                "page": pageNo||1,
                "rows": pageSize
            },
            "checkMonth": checkMonth
        };
        reqAjaxAsync(REQUIRE_URL['memberDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                defer.resolve(res)
            }
        });
        return defer.promise()
    }
    //初始化页面
    init();
    function init(){
        // 获取本月
        var month = formatAllDate(new Date(),'yyyy-MM');
        $('#Month').val(month);
        // 初始化时间选择器
        initDateRange().done(function () {
            //获取店铺列表
            getShopList().done(function () {
                //获取4大之最统计
                getChampionReport();
                //获取报表数据
                getReportList().done(function (res) {
                    // 初始化表格
                    initTable('memberReport',detailPage).done(function () {
                        $('.table').css('visibility','visible');
                        // 初始化列表数提示
                        initPageTips(res.total);
                        //初始化分页
                        if(res.total > pageSize) {
                            initPageSelector('memberPageSelect', res.total, function (obj, first) {
                                // 更新列表数据
                                getReportList(obj.curr).done(function () {
                                    // 重新初始化表格
                                    initTable('memberReport',detailPage);
                                    // 更新列表数提示
                                    updatePageTips(res.total, obj.curr)
                                })
                            })
                        }else{
                            $('#memberPageSelect').html('')
                        }
                    });
                });
                //初始化会员走势图
                getMembershipTrend();
            })
        });
        //切换店铺
        $('#shopSelector').change(function () {
            $('.pathShopName').text($(this).find(':selected').text());
            //更新4大冠军数据
            getChampionReport();
            //获取报表数据
            getReportList().done(function (res) {
                // 初始化表格
                initTable('memberReport',detailPage).done(function () {
                    $('.table').css('visibility','visible');
                    // 初始化列表数提示
                    initPageTips(res.total);
                    //初始化分页
                    if(res.total > pageSize) {
                        initPageSelector('memberPageSelect', res.total, function (obj, first) {
                            // 更新列表数据
                            getReportList(obj.curr).done(function () {
                                // 重新初始化表格
                                initTable('memberReport',detailPage);
                                // 更新列表数提示
                                updatePageTips(res.total, obj.curr)
                            })
                        })
                    }else{
                        $('#memberPageSelect').html('')
                    }
                });
            });
            //更新会员走势图
            getMembershipTrend()
        });
        //动态设置遮罩高度
        $('.mask').height($(window).height()).on('click',function () {
            //点击遮罩关闭遮罩和时间选择器
            $(this).fadeOut(200);
            $('.timeRange').fadeOut(200);
            $('#Month').val(MM);
        })
    }
});
