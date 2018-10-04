$(function () {
    var REQUIRE_URL = {
        'waiter': 'shopDisplayTerminal/getShopWaiterList',//获取服务人员
        'orderCompleteTime': 'shopDisplayTerminal/getShopIntervalServiceAverageTime',//获取技师工单间隔平均时间
        'serviceCompleteTime': 'shopDisplayTerminal/getShopServiceAverageTime'
    };
    //var waiterList;
    var shopId = sessionStorage.getItem('shopId'),
        merchantId = sessionStorage.getItem('merchantId'),
        navType = 11;

    //页面初始化
    (function () {
        $('#waiterId-selector').select2();
        initJeDate();
        // getWaiters();
        getOrderCompleteTimeList();
    })();

    //获取当前日期
    function getTotayDate() {
        var t = new Date();
        var YY, MM, DD;
        YY = t.getFullYear();
        MM = (t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1);
        DD = t.getDate()<10?'0'+t.getDate():t.getDate();
        return YY+'-'+MM+'-'+DD;
    }

    //初始化日期插件
    function initJeDate() {
        initDate('#searchDate','YYYY-MM-DD');
        dateLinkage('#startTime','#endTime','YYYY-MM-DD','2017-01-01')
        // $('#searchDate').jeDate({
        //     format: "YYYY-MM-DD",
        //     isToday: true,
        //     isinitVal: true,
        //     isClear:false,
        //     isok:false,
        //     maxDate:$.nowDate(0) //最大日期
        // });

        // var start = {
        //     format: 'YYYY-MM-DD',
        //     minDate: '2017-01-01', //设定最小日期为当前日期
        //     isinitVal:true,
        //     festival:false,
        //     ishmsVal:false,
        //     isClear:false,
        //     isToday:false,
        //     isok:false,
        //     maxDate:$.nowDate(0), //最大日期
        //     choosefun: function(elem,datas){
        //         end.minDate = datas; //开始日选好后，重置结束日的最小日期
        //     }
        // };
        // var end = {
        //     format: 'YYYY-MM-DD',
        //     minDate: '2017-01-01', //设定最小日期为当前日期
        //     festival:false,
        //     isinitVal:true,
        //     isClear:false,
        //     isToday:false,
        //     isok:false,
        //     maxDate: $.nowDate(0), //最大日期
        //     choosefun: function(elem,datas){
        //         start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
        //     }
        // };
        // $('#startTime').jeDate(start);
        // $('#endTime').jeDate(end);
    }

    //获取店内服务员列表
    // function getWaiters() {
    //     var data = {
    //         "shopId": shopId,
    //         "merchantId": merchantId,
    //         "backUserName": ""
    //     };
    //     reqAjaxAsync(REQUIRE_URL['waiter'], JSON.stringify(data)).done(function (res) {
    //         if (res.code !== 1) {
    //             layer.msg(res.msg);
    //             return
    //         }
    //         waiterList = res;
    //         var html = template('waiterTpl', res);
    //         $('#waiterId-selector').html(html)
    //     })
    // }

    //获取工单完成间隔时间列表
    function getOrderCompleteTimeList() {
        var data = {
            "merchantId": merchantId,
            "shopId": shopId,
            //"backUserId": $('#waiterId-selector').val(),
            "backUserName": $('.waiterName').val().trim(),
            "dateTime": $('#searchDate').val().trim()
            //"serviceName": $('.serviceName').val().trim()
        };
        reqAjaxAsync(REQUIRE_URL['orderCompleteTime'], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            var html = template('orderCompleteTimeTpl', res);
            $('.orderCompleteTime-list .listContent').html(html);
        })
    }

    //获取服务完成平均时间
    function getServiceCompleteTimeList() {
        if(!compareDate( $('#startTime').val().trim(),$('#endTime').val().trim())&&$('#startTime').val().trim()!==$('#endTime').val().trim()){
            layer.msg('起始日期不能大于结束日期,请重新选择！');
            return
        }
        var data = {
            "merchantId": merchantId,
            "shopId": shopId,
            "backUserId": "",
            "backUserName": $('#waiterName').val().trim(),
            "startTime": $('#startTime').val().trim(),
            "endTime": $('#endTime').val().trim(),
            "serviceName": $('#serviceName').val().trim(),
            "pageNo": 1,
            "pageSize": 10
        };
        reqAjaxAsync(REQUIRE_URL['serviceCompleteTime'], JSON.stringify(data)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            var html = template('serviceCompleteTimeTpl', res);
            $('.serviceCompleteTime-list .listContent').html(html);
            //初始化分页器
            pagingInit('.serviceCompleteTime-select-page',res.total,10,function (page) {
                data['pageNo'] = page;
                reqAjaxAsync(REQUIRE_URL['serviceCompleteTime'], JSON.stringify(data)).done(function (res) {
                    if (res.code !== 1) {
                        layer.msg(res.msg);
                        return
                    }
                    var html = template('serviceCompleteTimeTpl', res);
                    $('.serviceCompleteTime-list .listContent').html(html);
                })
            })
        })
    }

    //点击查询按钮，查询数据
    $('.searchBtn').on('click', function () {
        if(navType == 11){
            getOrderCompleteTimeList()
        }else if(navType == 22){
            getServiceCompleteTimeList()
        }
    });

    //切换列表类型
    $('.navTab').on('click', 'a', function () {
        navType = $(this).attr('data-type');
        $(this).addClass('active').siblings().removeClass('active');
        if (navType == 11) {
            // var html = template('waiterTpl', waiterList);
            // $('#waiterId-selector').html(html);
            $('.waiterName').val('');
            $('.serviceName').val('');
            $('#searchDate').val(getTotayDate());
            $('.orderCompleteTime-searchRequirement').show();
            $('.serviceCompleteTime-searchRequirement').hide();
            $('.orderCompleteTime-list').show();
            $('.serviceCompleteTime-list').hide();
            getOrderCompleteTimeList()
        } else if (navType == 22) {
            $('#waiterName').val('');
            $('#serviceName').val('');
            $('#startTime').val(getTotayDate());
            $('#endTime').val(getTotayDate());
            $('.orderCompleteTime-searchRequirement').hide();
            $('.serviceCompleteTime-searchRequirement').show();
            $('.orderCompleteTime-list').hide();
            $('.serviceCompleteTime-list').show();
            getServiceCompleteTimeList()
        }
    });

    //返回按钮
    $('.goBack').on('click', function () {
        sessionStorage.setItem("prevPage", 7);
        $(this).attr("href", '../../index.html');
    });

    //服务人员编号和服务员名称不能同时成为搜索关键字
    // $('#waiterId-selector').on('change',function () {
    //     if($(this).val()!==''){
    //         $('.waiterName').val('').attr('disabled',true)
    //     }else{
    //         $('.waiterName').val('').attr('disabled',false)
    //     }
    // });
});