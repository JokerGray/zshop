$(function () {
    var REQUIRE_URL = {
        'shopList':'backUser/getCanManageTheShop',//店铺列表
        'arrivalRecord':'shopDisplayTerminal/expendBehavior',//店铺客户到店记录
        'arrivalDetail':'shopDisplayTerminal/behaviorInfo'//到店详情
    };
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    //初始化选择时间
    initDate('#startDate','#endDate');
    function initDate(startDomId,endDomId){
        var sm = '';
        var em = '';
        var sd = '';
        var ed = '';
        var now = formatAllDate(new Date(),'yyyy-MM-dd').toString();
        var start = laydate.render({
            elem: startDomId,
            max:now,
            done:function (value, date, endDate) {
                sm = date.month;
                sd = date.date;
                if(em !== undefined && em !== ''){
                    if(sm>em){
                        layer.alert('开始日期不能大于结束日期，请重新选择');
                        $(startDomId).val('');
                        sm = '';
                        sd = '';
                    }else if(sm === em&&sd > ed){
                        layer.alert('开始日期不能大于结束日期，请重新选择');
                        $(startDomId).val('');
                        sm = '';
                        sd = '';
                    }
                }
            }
        });
        var end = laydate.render({
            elem: endDomId,
            max:now,
            done:function (value, date, endDate) {
                em = date.month;
                ed = date.date;
                // if(sm === ''||sm === undefined){
                //     layer.alert('请选择开始日期');
                //     $(endDomId).val('');
                // }else
                if(sm>em){
                    layer.alert('开始日期不能大于结束日期，请重新选择');
                    $(endDomId).val('');
                    em = '';
                    ed = '';
                }else if(sm === em&&sd > ed){
                    layer.alert('开始日期不能大于结束日期，请重新选择');
                    $(endDomId).val('');
                    em = '';
                    ed = '';
                }
            }
        });
    }
    
    //获取店铺列表
    function getShopList(fn) {
        var params = {
            "backUserId":parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_URL['shopList'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg,{icon:5});
                return
            }
            var html = '<option value="">所有店铺</option>';
            res.data.forEach(function (v,i) {
                html+='<option value="'+v.shopId+'">'+v.shopName+'</option>'
            });
            $('#selectShop').html(html).select2().on('change',fn)
        })
    }

    //查看详情
    $('.recordList').on('click','.table .viewBtn',function () {
        var _this = this;
        getArrivalDetail($(this).attr('data-id')).done(function (res) {
            res.accountName = $(_this).attr('data-accountname');
            var html = template('recordDetailTpl',res);
            layer.open({
                type:1,
                content:html,
                area:['65%','90%'],
                shade:0.5,
                title:'',
                closeBtn:0,
                success:function (layero, index) {
                    $(layero).on('click','.closeBtn',function () {
                        layer.close(index)
                    });
                    $('.detailList').outerHeight($(layero).height()-$('.title-top').height()-$('.page-selector').outerHeight());
                }
            })
        });

    });
    //获取到店客户到店详情
    function getArrivalDetail(recordId){
        var defer = $.Deferred();
        var params = {
            "id":recordId,//到店记录id
            "merchantId": merchantId
        };
        reqAjaxAsync(REQUIRE_URL['arrivalDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg, {icon: 5});
                return
            }
            defer.resolve(res)
        });
        return defer.promise()
    }
    //获取到店情况列表
    function getArrivalRecordList(pageSize){
        var params = {
            "startTime": $('#startDate').val().trim(),
            "shopId": $('#selectShop').val()||'',
            "merchantId": merchantId,
            "isConsume": $('#selectActivity').val(),
            "endTime": $('#endDate').val().trim(),
            "pageNo":1,
            "pageSize":pageSize||10
        };
        quireCommons(REQUIRE_URL['arrivalRecord'],params,'shopArrivalRecordTpl').done(function (res) {
            if(res.data.length === 0){
                $('.noDataTip').show()
            }else{
                $('.noDataTip').hide()
            }
        })
    }
    //数据请求方法
    function quireCommons(url, params, tplId) {
        var deferred = $.Deferred();
        reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
            deferred.resolve(res);
            if (res.code !== 1) {
                layer.msg(res.msg,{icon:5});
                return
            }
            layer.msg('数据加载成功',{icon:6});
            if (res.total < params['pageSize']) {
                $('.pageTips').hide()
            } else {
                $('.pageTips').show()
            }
            var html = template(tplId, res);
            var pageEnd = params['pageNo'] * params['pageSize'] >= res.total ? res.total : params['pageNo'] * params['pageSize'];
            var pageStart = pageEnd >= res.total && params['pageNo'] === 1 ? 1 : (params['pageNo'] - 1) * params['pageSize'] + 1;
            var pageTotal = res.total;
            $('.recordList .table tbody').html(html);
            $('.pageBox').show();
            $('#pageStart').html(pageStart);
            $('#pageEnd').html(pageEnd);
            $('#pageTotal').html(pageTotal);
            pageSizeInit(res.total, params['pageSize']);
            pagingInit({
                target:'.pageSelector',
                total:res.total,
                pageSize:params['pageSize'],
                fn:function (pageNo) {
                    params['pageNo'] = pageNo;
                    pageEnd = params['pageNo'] * params['pageSize'] >= res.total ? res.total : params['pageNo'] * params['pageSize'];
                    pageStart = pageEnd >= res.total && params['pageNo'] === 1 ? 1 : (params['pageNo'] - 1) * params['pageSize'] + 1;
                    $('#pageStart').html(pageStart);
                    $('#pageEnd').html(pageEnd);
                    $('#pageTotal').html(pageTotal);
                    reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
                        if(res.code!==1){
                            layer.msg(res.msg,{icon:5});
                            return
                        }
                        layer.msg('数据加载成功',{icon:6});
                        var html = template(tplId, res);
                        $('.recordList .table tbody').html(html);
                    })
                }
            })
        });
        return deferred.promise();
    }
    //初始化pageSize选择器
    function pageSizeInit(total, pageSize) {
        $('.pageBox .pageTips .btn-group .btn').html(pageSize + ' <span class="caret"></span>');
        var pageSizeArr = [10, 25, 50, 100];
        var html = '';
        pageSizeArr.forEach(function (v, i) {
            if (v <= total) {
                html += '<li><a href="javascript:;">' + v + '</a></li>'
            }
        });
        if (html !== '') {
            $('.pageBox .pageTips .btn-group .dropdown-menu').html(html)
        } else {
            $('.pageBox .pageTips .btn-group .dropdown-menu').html('<li><a href="javascript:;">' + pageSize + '</a></li>')
        }

    }

    //切换pageSize,获取相应数据
    $('.pageBox .btn-group').on('click','.dropdown-menu li',function(){
        // $('.pageBox .btn-group .btn').text($(this).text().trim());
        getArrivalRecordList($(this).text().trim())
    });

    //搜索符合条件的到店记录
    $('.searchBtn').on('click',function(){
        if($('#startDate').val().trim() == '' && $('#endDate').val().trim() != '' ){
            layer.msg('请选择开始日期',{icon:5});
            return
        }else if($('#endDate').val().trim() == '' && $('#startDate').val().trim() != ''){
            layer.msg('请选择结束日期',{icon:5});
            return
        }
        getArrivalRecordList()
    });

    //初始化页面
    initPage();
    function initPage() {
        $('#startDate').attr('placeholder', formatAllDate(new Date(), 'yyyy-MM-dd'));
        $('#endDate').attr('placeholder', formatAllDate(new Date(), 'yyyy-MM-dd'));
        $('#selectActivity').select2({minimumResultsForSearch: -1});
        getShopList();
        getArrivalRecordList();
    }
});
