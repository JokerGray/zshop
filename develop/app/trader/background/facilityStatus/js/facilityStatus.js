$(function () {
    var merchantId = getUrlParams('merchantId');
    var backUserId = getUrlParams('backUserId');
    var shopList = "";
    var REQUIRE_RUL = {
        categoryList: 'facility/getShopFacilityCategoryList',//查询设备分类列表
        inquireNgxip: 'facility/getShortUrl', //生成二维码所需的字符串
        shopList: 'backUser/getCanManageTheShop',//根据backUserId查询shopList
        reservationTime: 'facility/index',//预约时间
        facilityStatus: 'facility/getServiceFacilityListByType',//设备状态列表
        batchExportCode:'facility/batchExportCode'//批量导出二维码
    };
    // 初始化页面
    init();

    //获取店铺列表
    function getShopList() {
        var params = {
            'backUserId': parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_RUL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
            }
            shopList = res.data;
            renderingShopList(res.data, '#selectShop');
            getCategoryList();
            
        })
    }
    //渲染店铺列表数据
    function renderingShopList(shopList, targetDom) {
        var html = '';
        shopList.forEach(function (v, i) {
            html += '<option value="' + v.shopId + '">' + v.shopName + '</option>'
        });
        $(targetDom).html(html).select2()
    }

    //获取店铺设备分类
    function getCategoryList() {
        var params = {
            'merchantId': merchantId,
            'shopId': $("#selectShop").val()
        };
        reqAjaxAsync(REQUIRE_RUL['categoryList'], JSON.stringify(params)).done(function (res) {
            if (res.code == 1) {
                categoryListShow(res.data);

            } else {
                layer.msg(res.msg, { icon: 5 });
            }
        });
    }

    //渲染左侧设备分类列表
    function categoryListShow(cList) {
        var sHtml = '';
        for (var i = 0; i < cList.length; i++) {
            sHtml += '<a class="tab-item" href="javascript:;" data-cate="' + cList[i].id + '">' + cList[i].categoryName + '</a>'
        }
        $(".contentBox .menu").html(sHtml);
        $(".contentBox .menu").find(".tab-item:eq(0)").addClass("active");
        getFacilityStatus();
    }

    //切换设备占用页面设备分类
    $('.contentBox').on('click', '.menu a', function () {
        $(this).addClass('active').siblings().removeClass('active');
        getFacilityStatus();
    });

    //获取查看设备预约的时间
    function getReservationTime() {
        var defer = $.Deferred();
        var params = {};
        reqAjaxAsync(REQUIRE_RUL['reservationTime'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            var html = '<option value="">--选择时间--</option>';
            res.data.forEach(function (item, index) {
                html+='<option value="'+item+'">'+item+'</option>'
            });
            $('#timeSelector').html(html).select2({minimumResultsForSearch: -1});
            defer.resolve(res)
        });
        return defer.promise()
    }

    //获取设备占用情况列表
    function getFacilityStatus() {
        // 获取当前需显示设备的分类
        var facilityType = $('.contentBox').find('.menu .active').attr('data-cate')||1;
        var defer = $.Deferred();
        var params = {
            "facilityType":facilityType, // --设施分类
            "shopId": $('#selectShop').val() || '',//--店铺编号(可选)
            "facilityOccupied": $('#facilityStatus').val(),// --设备占用 1-占用 0-未占用 (可选)
            "merchantId": merchantId, // --商户编号**必传**
            "besTime": $('#timeSelector').val() || '',// --查询时间(可选)
            "shopIdList": shopList,
        };
        reqAjaxAsync(REQUIRE_RUL['facilityStatus'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            layer.msg('数据加载成功', {icon: 6});
            var html = template('userStatueTpl',res);
            $('.main').html(html);
            defer.resolve(res)
        });
        return defer.promise()
    }

    //获取生成设备二维码所需的字符串
    function getFacilityStr(shopId,facilityId) {
        var defer = $.Deferred();
        var params = {
            "merchantId": merchantId,
            "shopId": shopId,
            "facilityId": facilityId
        };
        reqAjaxAsync(REQUIRE_RUL['inquireNgxip'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg,{icon:5});
                return
            }
            defer.resolve(res)
        });
        return defer.promise()
    }

    //点击二维码图标上显示二维码，再次点击隐藏二维码
    $('.main').on('click', '.erCodeIcon', function () {
        var _this = this;
        var shopId = $(this).attr('data-shopId');
        var facilityId = $(this).attr('data-facilityId');
        //使用data-flag记录是否显示店铺二维码，true为可显示二维码，false为关闭二维码显示
        if ($(this).attr('data-flag') === 'true') {
            getFacilityStr(shopId,facilityId).done(function (res) {
                $(_this).siblings('.erCodeBox').show();
                $(_this).parent().css('z-index', '2').siblings('li').find('.erCodeBox').hide();
                $(_this).attr('data-flag', 'false');
                $('.mask').show();
                var content = res.data.shortUrl;
                createErCode($(_this).siblings('.erCodeBox').find('.erCode'), content);
            });
        } else if ($(this).attr('data-flag') === 'false') {
            $(this).siblings('.erCodeBox').find('.erCode').html('');
            $(this).siblings('.erCodeBox').hide();
            $(this).parent().css('z-index', '0').siblings('li').find('.erCodeBox').hide();
            $('.mask').hide();
            $(this).attr('data-flag', 'true');
        }
    });
    //点击遮罩层隐藏二维码
    $('.mask').on('click',function () {
        $('.mask').hide();
        $('.main li .erCodeBox').hide();
        $('.main li .erCodeIcon').attr('data-flag', 'true');
        $('.main li').css('z-index', '0')
    });

    //生成二维码
    function createErCode(el, content) {
        el.html('');
        el.qrcode({
            render: "canvas",
            width: $(el).width(),
            height: $(el).height(),
            background: "#ffffff",//transparent
            foreground: "#000000",
            text: content
        });
        var url = el.find('canvas')[0].toDataURL('image/png');
        el.siblings('.downloadBtn').attr({'href': url});
    }

    //批量下载店铺二维码
    $('.contentBox').on('click','.exportBtn',function () {
        //获取当前选择的店铺所有二维码下载地址
        getShopsErcodeUrl().done(function (res) {
            // 设置下载a标签的下载信息
            $('#downloadBtn').attr({'href':res.data.zipOssUrl,'download':res.data.shopName});
            // 自动执行下载a标签的点击事件，执行下载动作
            $('#downloadBtn')[0].click()
        })
    });
    // 获取店铺所有设备二维码下载地址
    function getShopsErcodeUrl(){
        if($('#selectShop').val() === ''){
            layer.msg('请选择店铺！',{icon:2});
            return
        }
        var defer = $.Deferred();
        var params = {
            "shopId": $('#selectShop').val(),
            "merchantId": merchantId
        };
        reqAjaxAsync(REQUIRE_RUL['batchExportCode'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg,{icon:5});
                return
            }
            defer.resolve(res)
        });
        return defer.promise()
    }

    //初始化页面
    function init() {
        // 动态设置列表显示区域的最小高度
        setTimeout(function () {
            // 获取根元素font-size getComputedStyle(window.document.documentElement)['font-size']
            var height = $(window).height()-$('.header').height()-parseInt(getComputedStyle(window.document.documentElement)['font-size'])*90/32;
            $('.main').css('min-height',height)
        },0);
        //动态设置遮罩层的高度
        $('.mask').height($(window).height());
        //加载店铺列表
        getShopList();
        getReservationTime();
        // 初始化设备分类和设备状态下拉框的select2插件
        $('#facilityStatus').select2({minimumResultsForSearch: -1});
        //选择店铺下拉框改变事件
        $('#selectShop').on('change', function () {
            // 加载设备状态列表
            getFacilityStatus();
            getCategoryList();
        });
        //选择设备状态下拉框改变事件
        $('#facilityStatus').on('change', function () {
            getFacilityStatus()
        });
        // 预约时间下拉框改变事件
        $('.header').on('change', '.timeSelector #timeSelector', function () {
            getFacilityStatus()
        })
    }
});