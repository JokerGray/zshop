layui.use(['form','layer'],function () {
    var form = layui.form;
    var layer = layui.layer;
    var pageSize = 10;
    var backUserId = getUrlParams('backUserId');
    var shopId = getUrlParams('shopId');
    var status = getUrlParams('status');
    var startTime = getUrlParams('startTime');
    var endTime = getUrlParams('endTime');
    var shopName = getUrlParams('shopName');
    var REQUIRE_URL = {
        giftPackNum:'cs_coupon/giftPackNum',//礼包总数
        giftPackList:'cs_coupon/selectGitGetDetail',//礼包列表
        giftPackDetail:'cs_coupon/couponGitGoodsDetail',//礼包详情
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

    //初始化页面
    function init(){
        if(status === '1'){
           $('.time').text(startTime)
        }else if(status === '2'){
            $('.time').text('全部')
        }else if(status === '3'){
            $('.time').text(startTime+'~'+endTime)
        }
        $('.shopName').text(shopName);
        getGiftPackNum();
        getGiftPackList()
    }

    //获取礼包总数
    function getGiftPackNum(){
        var params = {
            "startTime": startTime,
            "backUserId": backUserId,
            "status": status,
            "shopId": shopId,
            "endTime": endTime
        };
        reqAjaxAsync(REQUIRE_URL['giftPackNum'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                $('#allTotal').text(res.data.sumTotal);
                $('#getTotal').text(res.data.totalGetAccount);
                $('#useTotal').text(res.data.totalUseAccount);
                if(res.data.ratTotalGetAccount > 0 && status === '1'){
                    $('#getTotalCompare').text('高于前日'+res.data.ratTotalGetAccount)
                }else if(res.data.ratTotalGetAccount < 0 && status === '1'){
                    $('#getTotalCompare').text('低于前日'+Math.abs(res.data.ratTotalGetAccount))
                }else if(res.data.ratTotalGetAccount === 0 && status === '1'){
                    $('#getTotalCompare').text('与前日持平')
                }else{
                    $('#getTotalCompare').text('')
                }
                if(res.data.ratTotalUseAccount > 0 && status === '1'){
                    $('#useTotalCompare').text('高于前日'+res.data.ratTotalUseAccount)
                }else if(res.data.ratTotalUseAccount < 0 && status === '1'){
                    $('#useTotalCompare').text('低于前日'+Math.abs(res.data.ratTotalUseAccount))
                }else if(res.data.ratTotalUseAccount === 0 && status === '1'){
                    $('#useTotalCompare').text('与前日持平')
                }else{
                    $('#useTotalCompare').text('')
                }
            }
        })
    }

    //获取礼包列表
    function getGiftPackList(pageNo){
        var type = $('.giftPackageList .title-export .title .active').attr('data-type');
        var keyName = $('#keyWord').val().trim();
        var params = {
            "status": status, //1 日  2 全部 3.自定义
            "startTime": startTime,//开始时间
            "endTime": endTime,
            "backUserId": backUserId,//用户ID
            "shopId": shopId, //店铺ID
            "type": type,//1 领用明细 2 使用明细
            "keyName":keyName,
            "pagination": {
                "sort": "",
                "order": "",
                "page2": 0,
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        var showList = {
            '1':function (res) {
                var html = '';
                var No = '';
                if(res.total === 0){
                   html = '<tr><td colspan="12" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No :No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.name+'</td>'
                        +'<td>'+(item.instruction||"----")+'</td>'
                        +'<td>'+(item.couponValue||"0.00")+'</td>'
                        +'<td>'+item.beginDate.substring(0,11)+'</td>'
                        +'<td>'+item.endDate.substring(0,11)+'</td>'
                        +'<td>'+item.status+'</td>'
                        +'<td>'+item.code+'</td>'
                        +'<td>'+item.username+'</td>'
                        +'<td>'+item.phone+'</td>'
                        +'<td>'+item.time+'</td>'
                        +'<td>'+item.promStatus+'</td>'
                        +'</tr>'
                    })
                }
                $('.tableBox .get tbody').html(html)
            },
            '2':function (res) {
                var html = '';
                var No = '';
                if(res.total === 0){
                    html = '<tr><td colspan="12" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No :No;
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.name+'</td>'
                        +'<td>'+(item.instruction||"----")+'</td>'
                        +'<td>'+(item.couponValue||"0.00")+'</td>'
                        +'<td>'+item.beginDate.substring(0,11)+'</td>'
                        +'<td>'+item.endDate.substring(0,11)+'</td>'
                        +'<td>'+item.Status+'</td>'
                        +'<td>'+item.code+'</td>'
                        +'<td>'+item.username+'</td>'
                        +'<td>'+item.phone+'</td>'
                        +'<td>'+item.time+'</td>'
                        // +'<td>'+item.promStatus+'</td>'
                        +'<td>'
                        +'<a href="javascript:;" data-sbcId="'+item.sbcId+'" data-cloId="'+item.cloId+'" data-GoodsType="'+item.GoodsType+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.tableBox .use tbody').html(html)
            }
        };
        var url = '/zxcity_restful/ws/cs_coupon/selectGitGetDetailExcle?backUserId='+backUserId+'&shopId='+shopId+'&status='+status+'&startTime='+startTime+'&endTime='+endTime+'&type='+type+'&keyName='+keyName;
        reqAjaxAsync(REQUIRE_URL['giftPackList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                showList[type](res);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getGiftPackList(obj.curr)
                    });
                }
            }
            $('#exportBtn').attr('href',url)
        })
    }

    //获取礼包详情
    function getGitGoodsDetail(cloId,sbcId,GoodsType){
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId,//商户ID
            "sbcId": sbcId,//购物券主表ID
            "GoodsType": GoodsType,//0自动礼包  1手动礼包
            "cloId": cloId //购物券子表ID
        };
        reqAjaxAsync(REQUIRE_URL['giftPackDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
               defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //切换领用列表和使用列表
    $('.title-export .title').on('click','span',function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings().removeClass('active');
        $('.tableBox').find('table:eq('+(type-1)+')').show().siblings().hide();
        getGiftPackList()
    });

    //搜索礼包
    form.on('submit(searchBtn)',function () {
        getGiftPackList()
    });

    //查看领用详情
    $('.tableBox table tbody').on('click','td a',function () {
        var cloId = $(this).attr('data-cloId');
        var sbcId = $(this).attr('data-sbcId');
        var GoodsType = $(this).attr('data-GoodsType');
        getGitGoodsDetail(cloId,sbcId,GoodsType).done(function (res) {
            res.GoodsType = GoodsType;
            var html = template('detailTpl',res);
            layer.open({
                type:1,
                title:'',
                closeBtn:0,
                shade:0.5,
                shadeClose:true,
                scrollbar:false,
                skin:'detailPage',
                area:['80%','622px'],
                content:html,
                success:function (layeror, index) {
                    form.render('select');
                    initPageSelector('detailPageSelector',34);
                    //关闭弹窗
                    $(layeror).on('click','.closeBtn',function () {
                        layer.close(index)
                    })
                }
            })
        });

    });

    //关闭当前页面
    $('.closeBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
});
