$(function () {
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        collageOverview:'cs_collageKill/getShopGroupBuyingFourInfo',//拼团4大总数
        collageRecord:'cs_collageKill/getShopGroupBuyingRecordList',//拼团记录
        collageDetail:'cs_collageKill/selectSmallGroupUserList',//拼团记录详情
        skillOverview:'cs_collageKill/getShopSecondskillThreeInfo',//秒杀3大总数
        skillRecord:'cs_collageKill/getShopSecondsKillRecordList',//秒杀记录
    };
    var backUserId = getUrlParams('backUserId');
    var pageSize = 10;

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

    //动态设置报表容器的高度
    $('.tableContent').height($(window).height()-$('.navBarAndShopSelect').height()-$('.path').height()-$('.title-filter').height()-$('.pageBox').height()-$('.StatisticalOverview').outerHeight()-1);

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
                res.data.shopList.forEach(function (item, index) {
                    html += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
                });
                $('#shopSelector').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取拼团统计概览（4大总数）
    function getCollageOverview(){
        var shopId = $('#shopSelector').val();
        var params = {
            "backUserId": backUserId,
            "shopId": shopId
        };
        reqAjaxAsync(REQUIRE_URL['collageOverview'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('.collage li:eq(0)').find('h4').text(res.data.shopGroupBuyingCount);
                $('.collage li:eq(1)').find('h4').text(res.data.shopSuccessGBSCount);
                $('.collage li:eq(2)').find('h4').text(res.data.shopfailGBSCount);
                $('.collage li:eq(3)').find('h4').text(getMoneyFormat(res.data.shopGBAmount));
            }
        })
    }

    //获取拼团记录列表
    function getCollageRecord(pageNo){
        var status = $('#statusSelector').val() || '';
        var shopId = $('#shopSelector').val();
        var searchType = $('#typeSelector').val();
        var activityName = '';
        var goodsName = '';
        if(searchType === '1'){
            activityName = $('#keyword').val().trim()
        }else if(searchType === '2'){
            goodsName = $('#keyword').val().trim()
        }
        var params = {
            "backUserId": backUserId,//登录用户主键
            "status": status,//状态：0进行中，1成功,2过期
            "shopId": shopId,//店铺主键
            "itemTitle": activityName,
            "goodsName": goodsName,
            "pagination": {//分页信息
                "page": pageNo || 1,//页号
                "rows": pageSize//每页数量
            }
        };
        reqAjaxAsync(REQUIRE_URL['collageRecord'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                var statusText = '';
                if(res.data.total === 0){
                    html = '<tr><td colspan="10" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.rows.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.gbsStatus === 0){
                            statusText = '进行中'
                        }else if(item.gbsStatus === 1){
                            statusText = '成功'
                        }else if(item.gbsStatus === 2){
                            statusText = '过期'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.itemTitle+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.discountPrice+'</td>'
                        +'<td>'+item.userName+'</td>'
                        +'<td>'+item.ctime+'</td>'
                        +'<td>'+item.endTime+'</td>'
                        +'<td>'+item.groupNum+'</td>'
                        +'<td>'+statusText+'</td>'
                        +'<td>'
                        +'<a href="JavaScript:;" data-smallId="'+item.smallId+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.collage tbody').html(html);
                //记录搜索关键字
                $('#searchedKey').val($('#keyword').val());
                //储存拼团搜索的记录状态
                $('#status').val($('#statusSelector').val());
                //记录搜索的是活动还是名称
                $('#searchType').val($('#typeSelector').val());
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.data.total,function (obj, first) {
                        getCollageRecord(obj.curr)
                    })
                }
            }
        })
    }

    //获取拼团记录详情
    function getCollageDetail(id){
        var shopId = $('#shopSelector').val();
        var params = {
            "backUserId": backUserId,//登录用户主键
            "smallId": id,//用户发起拼组表主键
            "shopId": shopId//店铺主键
        };
        reqAjaxAsync(REQUIRE_URL['collageDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                var payStatusText = '';
                if(res.data.length === 0){
                    html = '<tr><td colspan="6" style="text-align: center;">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = (index + 1) < 10 ? '0' + (index + 1) : (index + 1);
                        if(item.status === 0){
                            payStatusText = '已付款'
                        }else if(item.status === 1){
                            payStatusText = '退款成功'
                        }else if(item.status === 2){
                            payStatusText = '待支付'
                        }else if(item.status === 3){
                            payStatusText = '已取消订单'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.userName+'</td>'
                        +'<td>'+item.orderId+'</td>'
                        +'<td>'+item.num+'</td>'
                        +'<td>'+item.ctime+'</td>'
                        +'<td>'+payStatusText+'</td>'
                        +'</tr>'
                    })
                }
                $('.detailTable table tbody').html(html)
            }
        })
    }

    //获取秒杀统计概览（3大总数）
    function getSkillOverview(){
        var shopId = $('#shopSelector').val();
        var params = {
            "backUserId": backUserId,//登录用户主键
            "shopId": shopId//店铺主键
        };
        reqAjaxAsync(REQUIRE_URL['skillOverview'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('.StatisticalOverview .skill').find('li:eq(0) h4').text(res.data.secondsKillActivityCount)
                .end().find('li:eq(1) h4').text(res.data.secondsKillNumber)
                .end().find('li:eq(2) h4').text(getMoneyFormat(res.data.secondsKillAmount));
            }
        })
    }

    //获取秒杀记录
    function getSkillRecord(pageNo){
        var shopId = $('#shopSelector').val();
        var orderStatus = $('#skillStatus').val() || '';
        var params = {
            "backUserId": backUserId,// 登录人编号
            "orderStatus": orderStatus,//订单状态（待发货0，配送中1，已收货2， 配送失败3, 取消4，异常订单5,已退货6）
            "shopId": shopId,//店铺主键
            "pagination": {//分页
                "page": pageNo || 1,//页号
                "rows": pageSize//每页数量
            }
        };
        reqAjaxAsync(REQUIRE_URL['skillRecord'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                var statusText = '';
                if(res.data.total === 0){
                    html = '<tr><td colspan="9" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.rows.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.orderStatus === 0){
                            statusText = '待发货'
                        }else if(item.orderStatus === 1){
                            statusText = '配送中'
                        }else if(item.orderStatus === 2){
                            statusText = '已收货'
                        }else if(item.orderStatus === 3){
                            statusText = '配送失败'
                        }else if(item.orderStatus === 4){
                            statusText = '取消'
                        }else if(item.orderStatus === 5){
                            statusText = '异常订单'
                        }else if(item.orderStatus === 6){
                            statusText = '已退货'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.activityTitle+'</td>'
                        // +'<td>法国进口原装水氧精华</td>'
                        // +'<td>33.33</td>'
                        +'<td>'+item.orderNo+'</td>'
                        +'<td>'+item.contactName+'</td>'
                        +'<td>'+item.contactMobile+'</td>'
                        +'<td>'+item.createTime+'</td>'
                        +'<td>'+item.goodsNum+'</td>'
                        +'<td>'+item.realMoney+'</td>'
                        +'<td>'+statusText+'</td>'
                        +'</tr>'
                    })
                }
                $('.tableContent .skill tbody').html(html);
                //储存秒杀搜索的记录状态
                $('#skillOrderStatus').val($('#skillStatus').val());
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.data.total,function (obj, first) {
                        getSkillRecord(obj.curr)
                    })
                }
            }
        })
    }

    //根据navBar是拼团还是秒杀更新报表
    function updateReport(){
        var type = $('.navBar .active').attr('data-type');
        if(type === '1'){
            //更新拼团记录
            getCollageRecord()
        }else if(type === '2'){
            //更新秒杀记录
            getSkillRecord()
        }
    }

    //根据navBar是拼团还是秒杀更新概览统计
    function updateOverview(){
        var type = $('.navBar .active').attr('data-type');
        if(type === '1'){
            //更新拼团概览统计
            getCollageOverview()
        }else if(type === '2'){
            //更新秒杀概览统计
            getSkillOverview()
        }
    }

    layui.use('form',function () {
        var form = layui.form;
        //获取店铺列表
        getShopList().done(function () {
            form.render('select');
            $('.path-shopName').text($('#shopSelector :selected').text());
            //获取拼团4大概览统计
            getCollageOverview();
            //获取拼团记录列表
            getCollageRecord()
        });
        //切换店铺
        form.on('select(shopSelector)',function () {
            $('.path-shopName').text($('#shopSelector :selected').text());
            // 根据tab栏更新概览统计（拼团还是秒杀）
            updateOverview();
            // 根据tab栏更新报表（拼团还是秒杀）
            updateReport()
        });
        //切换搜索关键字类型
        form.on('select(typeSelector)',function (data) {
            if(data.value === '1'){
                $('#keyword').attr('placeholder','请输入活动标题')
            }else if(data.value === '2'){
                $('#keyword').attr('placeholder','请输入商品名称')
            }
        });
        //切换拼团和秒杀
        $('.navBar').on('click','a',function () {
            $(this).addClass('active').siblings('a').removeClass('active');
            //重置搜索表单
            $('.filterBox').find('input').val('').end().find('select').find('option:eq(0)').attr('selected',true).siblings().attr('selected',false);
            form.render('select');
            var type = $(this).attr('data-type');
            if(type === '1'){
                $('.collage').show();
                $('.skill').hide();
                getCollageOverview();
                getCollageRecord()
            }else if(type === '2'){
                $('.collage').hide();
                $('.skill').show();
                getSkillOverview();
                getSkillRecord();
            }
        });
        //查看拼团详情
        $('.tableContent table').on('click','tbody td a',function () {
            var id = $(this).attr('data-smallId');
            var itemTitle = $(this).parent().parent().find('td:eq(1)').text();
            var startTime = $(this).parent().parent().find('td:eq(5)').text();
            var endTime = $(this).parent().parent().find('td:eq(6)').text();
            var statusText = $(this).parent().parent().find('td:eq(8)').text();
            var obj = {
                itemTitle:itemTitle,
                startTime:startTime,
                endTime:endTime,
                statusText:statusText
            };
            var html = template('collageDetailTpl',obj);
            layer.open({
                type:1,
                shade:0.5,
                shadeClose:true,
                closeBtn:0,
                area:['90%','622px'],
                title:'',
                skin:'collageDetail',
                content:html,
                success:function (layeror,index) {
                    $(layeror).on('click','.closeBtn',function () {
                        layer.close(index)
                    });
                    getCollageDetail(id)
                }
            })
        });
        //查看历史拼团活动记录和历史秒杀活动记录
        $('.path-historyBtn').click(function () {
            var shopId = $('#shopSelector').val();
            var shopName = $('#shopSelector :selected').text();
            if($(this).hasClass('collage')){
                layer.open({
                    type:2,
                    area:['100%','100%'],
                    title:'',
                    closeBtn:0,
                    content:'/trader/report/reportCSCollageKill/html/collageHistory.html?backUserId='+backUserId+'&shopId='+shopId+'&shopName='+shopName+'&random='+Math.random()
                })
            }else if($(this).hasClass('skill')){
                layer.open({
                    type:2,
                    area:['100%','100%'],
                    title:'',
                    closeBtn:0,
                    content:'/trader/report/reportCSCollageKill/html/skillHistory.html?backUserId='+backUserId+'&shopId='+shopId+'&shopName='+shopName+'&random='+Math.random()
                })
            }

        });
        //确认搜索
        form.on('submit(searchForm)',function () {
            // 根据tab栏更新报表（拼团还是秒杀）
            updateReport();
        });
        //导出报表
        $('.exportBtn').click(function () {
            var type = $('.navBar .active').attr('data-type');
            var url = '';
            var shopId = $('#shopSelector').val();
            var status = $('#status').val() || '';
            var searchType = $('#searchType').val();
            var activityName = '';
            var goodsName = '';
            var orderStatus = $('#skillOrderStatus').val() || '';
            if(searchType === '1'){
                activityName = $('#searchedKey').val().trim();
            }else if(searchType === '2'){
                goodsName = $('#searchedKey').val().trim();
            }
            if(type === '1'){
                url = '/zxcity_restful/ws/cs_collageKill/exportShopGroupBuyingRecordList?backUserId='+backUserId+'&status='+status+'&shopId='+shopId+'&itemTitle='+activityName+'&goodsName='+goodsName
            }else if(type === '2'){
                url = '/zxcity_restful/ws/cs_collageKill/exportShopSecondsKillRecordList?backUserId='+backUserId+'&shopId='+shopId+'&orderStatus='+orderStatus
            }
            $(this).attr('href',url)
        })
    })
});