$(function () {
    var merchantId = getUrlParams('merchantId');
    // var shopId = getUrlParams('shopId');
    var backUserId = getUrlParams('backUserId');
    var shopList = "";
    //var facilityType = 1;//设备分类
    var page = 1;//记录当前列表处于那一页
    var REQUIRE_RUL = {
        inquireNgxip: 'facility/getShortUrl', //生成二维码所需的字符串
        shopList: 'backUser/getCanManageTheShop',//根据backUserId查询shopList
        defaultDuration: 'facility/updateMerchantServiceTime',//设置商铺服务默认时长
        facilityList: 'facility/list',//设备列表
        editAdd: 'facility/ajaxSave',//新增或者修改设备
        del: 'facility/ajaxDelete',//删除设备
        reservationTime: 'facility/index',//预约时间
        facilityStatus: 'facility/getServiceFacilityListByType',//设备状态列表
        batchExportCode:'facility/batchExportCode'//批量导出二维码
    };
    // 初始化页面
    init();

    //切换设施设备和设备占用
    $('.switchBtn').on('click', 'a', function () {
        // 重置店铺下拉框
        renderingShopList(shopList,'#selectShop');
        $(this).addClass('current').siblings().removeClass('current');
        // 判断点击的是设备设施按钮还是查看占用按钮
        if ($(this).attr('data-navType') == 11) {
            // 重置设备分类下拉框
            var facilityCateHtml = $('#facilityCate').html();
            $('#facilityCate').html('').html(facilityCateHtml);
            // 加载设备列表
            getFacilityList();
            // 显示设备分类下拉框
            $('.facilityCate').css('display', 'inline-block');
            // 隐藏设备状态下拉框
            $('.facilityStatus').css('display', 'none');
        } else if ($(this).attr('data-navType') == 22) {
            // 重置设备状态下拉框
            var facilityStatusHtml = $('#facilityStatus').html();
            $('#facilityStatus').html('').html(facilityStatusHtml);
            // 加载预约时间和设备状态列表
            getReservationTime().done(function (timeData) {
                getFacilityStatus().done(function (statusData) {
                    var html = template('userStatueTpl', {times: timeData.data, status: statusData.data});
                    $('.contentBox').html(html);
                    $('#timeSelector').select2({minimumResultsForSearch: -1});
                    $('.mask').height($(window).height());
                    $('.main').css('height',$(window).height()-$('.header').height()-$('.tabBar').height())
                    showErCode();
                })
            });
            //隐藏分页信息栏
            $('.pageBox').hide();
            // 显示设备状态下拉框
            $('.facilityStatus').css('display', 'inline-block');
            // 隐藏设备分类下拉框
            $('.facilityCate').css('display', 'none')
        }
        // $('.contentBox .main').outerHeight($(window).height() - $('.header').height()-$('.tabBar').height())
    });

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
            getFacilityList()
        })
    }

    //渲染店铺列表数据
    function renderingShopList(shopList, targetDom) {
        var html = '<option value="" >全部店铺</option>';
        shopList.forEach(function (v, i) {
            html += '<option value="' + v.shopId + '">' + v.shopName + '</option>'
        });
        $(targetDom).html(html).select2()
    }

    //设备列表页面开始
    $('.contentBox').on('click', '.addBtn', function () {
        addEditFacility()
    }).on('click', '.listBox .editBtn', function () {
        var item = JSON.parse($(this).attr('data-item') || '{}');
        addEditFacility(item)
    }).on('click', '.controlBtnBox .setTimeBtn', function () {
        setDefaultDuration()
    }).on('click', '.listBox .delBtn', function () {
        askDelFacility($(this).attr('data-id'))
    });

    // 增加设备弹窗和编辑设备弹窗
    function addEditFacility(item) {
        var html = template('addEditTpl', item || {});
        layer.open({
            type: 1,
            title: '',
            closeBtn: 0,
            zIndex: 1,
            shade: 0.5,
            area: ['750px', '550px'],
            btn: ['提交', '取消'],
            skin: 'addEditPage',
            content: html,
            success: function (layero, index) {
                $(layero).on('click', '.closePage', function () {
                    layer.close(index)
                });
                //渲染弹窗里的shopList
                renderingShopList(shopList, '#shopSelector');
                // 初始化设施分类的select2
                $('#selectFacilityCate').select2({minimumResultsForSearch: -1});
                //如果itme存在，说明点击的是编辑按钮，进入编辑设备弹窗页面，
                // 初始化店铺下拉框和设备分类下拉框
                if (item) {
                    $('#shopSelector').select2().val(item.shopId).change();
                    if (item.facilityType != -1) {
                        $('#selectFacilityCate').select2({
                            minimumResultsForSearch: -1
                        }).val(item.facilityType).change()
                    }
                }
            },
            yes: function (index, layero) {
                if ($(layero).find('#shopSelector').val() === '') {
                    layer.msg('请选择店铺！', {icon: 2});
                    return
                } else if ($(layero).find('#facilityName').val().trim() === '') {
                    layer.msg('请输入设备名称！', {icon: 2});
                    return
                } else if ($(layero).find('#selectFacilityCate').val() === '') {
                    layer.msg('请选择设备分类！', {icon: 2});
                    return
                }
                var params = {
                    "id": item ? item.id : '',//--修改时**必传**，新增时不传
                    "shopId": $(layero).find('#shopSelector').val(),//--店铺编号**必传**
                    "merchantId": merchantId,//--商户编号**必传**
                    "title": $(layero).find('#facilityName').val().trim(),//--设名称**必传**
                    "facilityType": $(layero).find('#selectFacilityCate').val(),//--设备分类**必传**(1-房间;2-床位;3-座位;4-其他;5-设备;)
                    "sequence": $(layero).find('#sorting').val().trim(),//--排序 (可选)
                    "maxNum": $(layero).find('#maxNum').val().trim(),//--最大使用人数(可选)
                };
                reqAjaxAsync(REQUIRE_RUL['editAdd'], JSON.stringify(params)).done(function (res) {
                    if (res.code !== 1) {
                        layer.msg(res.msg, {icon: 5});
                        return
                    } else if (res.code === 1 && item) {
                        layer.msg('修改成功！', {icon: 6, time: 500}, function () {
                            getFacilityList($('.pageBox .pageTips .btn-group .btn').text().trim(), page);
                            layer.close(index)
                        });
                    } else if (res.code === 1 && !item) {
                        layer.msg('新增成功！', {icon: 6, time: 500}, function () {
                            getFacilityList($('.pageBox .pageTips .btn-group .btn').text().trim(), page);
                            layer.close(index)
                        });
                    }

                })
            }
        })
    }

    //设置默认时长弹窗
    function setDefaultDuration() {
        var html = template('setDefaultDuration', {});
        layer.open({
            type: 1,
            area: ['400px', '300px'],
            btn: ['提交', '取消'],
            title: '',
            closeBtn: 0,
            zIndex: 1,
            shade: 0.5,
            skin: 'defaultDurationPage',
            content: html,
            success: function (layero, index) {
                $(layero).on('click', '.closePage', function () {
                    layer.close(index)
                })
            },
            yes: function (index, layero) {
                var serviceTime = $(layero).find('#inputDuration').val().trim();
                if (serviceTime === '') {
                    layer.msg('未输入默认时长！', {icon: 2});
                    return
                }
                var params = {
                    "serviceTime": serviceTime,
                    "merchantId": merchantId
                };
                reqAjaxAsync(REQUIRE_RUL['defaultDuration'], JSON.stringify(params)).done(function (res) {
                    if (res.code !== 1) {
                        layer.msg(res.msg, {icon: 5});
                        return
                    }
                    layer.close(index);
                    layer.msg('设置成功！', {icon: 6});
                })
            }
        })
    }

    //删除设备前的询问
    function askDelFacility(facilityId) {
        layer.confirm('确定要删除吗?', {icon: 3, title: '警告'}, function (index) {
            delFacility(facilityId).done(function () {
                getFacilityList($('.pageBox .pageTips .btn-group .btn').text().trim(), page);
                layer.close(index)
            })
        }, null);

        //发送删除设备的请求
        function delFacility(facilityId) {
            var defer = $.Deferred();
            var params = {
                "id": facilityId
            };
            reqAjaxAsync(REQUIRE_RUL['del'], JSON.stringify(params)).done(function (res) {
                if (res.code !== 1) {
                    layer.msg(res.msg, {icon: 5});
                    return
                }
                layer.msg('删除成功！', {icon: 6, time: 500}, function () {
                    defer.resolve()
                });
            });
            return defer.promise()
        }
    }

    //获取设备列表
    function getFacilityList(pageSize, page) {
        var pamars = {
            "facilityType": $('#facilityCate').val(),//--设施分类(1-房间;2-床位;3-座位;4-其他;5-设备;) (可选)
            "shopId": $('#selectShop').val() || '',//--店铺id (可选)
            "merchantId": merchantId,//--商户id **必传**
            "shopIdList": shopList,
            "page": page||1,// --页数(可选)
            "rows": pageSize || 10
        };
        quireCommons(REQUIRE_RUL['facilityList'], pamars, 'facilityListTpl')
    }

    //请求设备列表数据部分
    function quireCommons(url, params, tplId) {
        var deferred = $.Deferred();
        reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            layer.msg('数据加载成功', {icon: 6});
            if (res.total < params['rows']) {
                $('.pageTips').hide()
            } else {
                $('.pageTips').show()
            }
            var html = template(tplId, res);
            var pageEnd = params['page'] * params['rows'] >= res.total ? res.total : params['page'] * params['rows'];
            var pageStart = pageEnd >= res.total && params['page'] === 1 ? 1 : (params['page'] - 1) * params['rows'] + 1;
            var pageTotal = res.total;
            $('.contentBox').html(html);
            $('.pageBox').show();
            $('#pageStart').html(pageStart);
            $('#pageEnd').html(pageEnd);
            $('#pageTotal').html(pageTotal);
            $('.listBox').height($(window).height() - $('.header').height() - $('.controlBtnBox').outerHeight() - $('.pageBox').outerHeight());
            deferred.resolve(res);
            pageSizeInit(res.total, params['rows']);
            pagingInit({
                target: '.pageSelector',
                total: res.total,
                pageSize: params['rows'],
                current: params['page'],
                fn: function (pageNo) {
                    params['page'] = pageNo;
                    page = pageNo;
                    pageEnd = params['page'] * params['rows'] >= res.total ? res.total : params['page'] * params['rows'];
                    pageStart = pageEnd >= res.total && params['page'] === 1 ? 1 : (params['page'] - 1) * params['rows'] + 1;
                    $('#pageStart').html(pageStart);
                    $('#pageEnd').html(pageEnd);
                    $('#pageTotal').html(pageTotal);
                    reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
                        if (res.code !== 1) {
                            layer.msg(res.msg, {icon: 5});
                            return
                        }
                        layer.msg('数据加载成功', {icon: 6});
                        var html = template(tplId, res);
                        $('.contentBox').html(html);
                        $('.listBox').height($(window).height() - $('.header').height() - $('.controlBtnBox').outerHeight() - $('.pageBox').outerHeight());
                    })
                }
            })
            // pagingInit('.pageSelector', res.total, params['rows'],function (pageNo) {
            //
            // },params['page']);
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

    //选择pageSize，获取相应数量的列表数据
    $('.pageBox .pageTips .btn-group .dropdown-menu').on('click', 'li', function () {
        var pageSize = $(this).text() * 1;
        $('.pageBox .pageTips .btn-group .btn').html(pageSize + ' <span class="caret"></span>');
        getFacilityList(pageSize)
    });
    //设备列表页面结束

    // 设备占用情况页面开始
    //切换设备占用页面设备分类
    $('.contentBox').on('click', '.menu a', function () {
        facilityType = $(this).attr('data-cate');
        $(this).addClass('active').siblings().removeClass('active');
        getFacilityStatus().done(function (res) {
            statusRendering(res.data)
        })
        // getFacilityList();
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
            defer.resolve(res)
        });
        return defer.promise()
    }

    //获取设备占用情况列表
    function getFacilityStatus() {
        // 获取当前需显示设备的分类
        var facilityType = $('.contentBox').find('.menu .active')[0]?$('.contentBox').find('.menu .active').attr('data-cate'):1;
        var defer = $.Deferred();
        var params = {
            "facilityType":facilityType, // --设施分类(1-房间;2-床位;3-座位;4-其他;5-设备;)**必传**
            "shopId": $('#selectShop').val() || '',//--店铺编号(可选)
            "facilityOccupied": $('#facilityStatus').val(),// --设备占用 1-占用 0-未占用 (可选)
            "merchantId": merchantId, // --商户编号**必传**
            "besTime": $('#timeSelector')[0] ? $('#timeSelector').val() : '',// --查询时间(可选)
            "shopIdList": shopList,
        };
        reqAjaxAsync(REQUIRE_RUL['facilityStatus'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            layer.msg('数据加载成功', {icon: 6});
            defer.resolve(res)
        });
        return defer.promise()
    }

    //设备占用情况数据渲染
    function statusRendering(statusData) {
        var html = '';
        statusData.forEach(function (item, index) {
            if (item.presaleId == 0 && item.isBespoke == 0) {
                html += '<li class="free">'
                    + '<h4 title="' + item.title + '">' + item.title + '</h4>'
                    + '<p>可容纳' + item.maxNum + '人</p>'
                    + '<div class="erCodeIcon" data-facilityId="'+item.id+'" data-flag="true" title="点击查看二维码" data-shopId="'+item.shopId+'"></div>'
                    + '<div class="erCodeBox">'
                    + '<div class="erCode">'
                    + '</div>'
                    + '<a href="./image/aaa.jpg" class="downloadBtn" download="aaaa">下载</a>'
                    + '</div>'
                    + '</li>'
            } else if (item.presaleId > 0 && item.isBespoke == 0) {
                html += '<li class="used">'
                    + '<h4 title="' + item.title + '">' + item.title + '</h4>'
                    + '<p title="面部按摩">面部按摩</p>'
                    + '<p>订单号：' + item.presaleId + '</p>'
                    + '<p>顾客：' + item.accountName + '</p>'
                    + '<p><img src="./image/clock.png"><span>' + item.startTime + '</span></p>'
                    + '<p><img src="./image/people.png"><span>' + item.waiterName + '</span></p>'
                    + '<div class="erCodeIcon" data-facilityId="'+item.id+'" data-flag="true" title="点击查看二维码" data-shopId="'+item.shopId+'"></div>'
                    + '<div class="erCodeBox">'
                    + '<div class="erCode"></div>'
                    + '<a href="./image/aaa.jpg" class="downloadBtn" download="aaaa">下载</a>'
                    + '</div>'
                    + '</li>'
            } else if (item.isBespoke == 1 && item.presaleId == 0) {
                html += '<li class="InAppointment">'
                    + '<h4 title="' + item.title + '">' + item.title + '</h4>'
                    + '<p>可容纳' + item.maxNum + '人</p>'
                    + '<div class="erCodeIcon" data-facilityId="'+item.id+'" data-flag="true" title="点击查看二维码" data-shopId="'+item.shopId+'"></div>'
                    + '<div class="erCodeBox">'
                    + '<div class="erCode">'
                    + '</div>'
                    + '<a href="./image/aaa.jpg" class="downloadBtn" download="aaaa">下载</a>'
                    + '</div>'
                    + '</li>'
            }
        });
        $('.contentBox').find('.main ul').html(html)
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
    function showErCode() {
        $('.main').on('click', '.erCodeIcon', function () {
            var _this = this;
            var shopId = $(this).attr('data-shopId');
            var facilityId = $(this).attr('data-facilityId');
            //使用data-flag记录是否显示店铺二维码，true为可显示二维码，false为关闭二维码显示
            if ($(this).attr('data-flag') === 'true') {
                getFacilityStr(shopId,facilityId).done(function (res) {
                    $(_this).siblings('.erCodeBox').show();
                    $(_this).parent().css('z-index', '2').siblings('li').find('.erCodeBox').hide();
                    $('.mask').show();
                    $(_this).attr('data-flag', 'false');
                    var content = res.data.shortUrl;
                    createErCode($(_this).siblings('.erCodeBox').find('.erCode'), content);
                });
            } else if ($(this).attr('data-flag') === 'false') {
                $(this).siblings('.erCodeBox').hide();
                $(this).parent().css('z-index', '0').siblings('li').find('.erCodeBox').hide();
                $('.mask').hide();
                $(this).attr('data-flag', 'true');
            }
        });
    }

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
    $('.contentBox').on('click','.downloadBtn',function () {
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
    // 设备占用情况页面结束

    //初始化页面
    function init() {
        //加载店铺列表
        getShopList();
        // 初始化设备分类和设备状态下拉框的select2插件
        $('#facilityCate').select2({minimumResultsForSearch: -1});
        $('#facilityStatus').select2({minimumResultsForSearch: -1});
        //选择店铺下拉框改变事件
        $('#selectShop').on('change', function () {
            if ($('.header .switchBtn .current').attr('data-navType') == 11) {
                // 加载设备列表
                getFacilityList()
            } else if ($('.header .switchBtn .current').attr('data-navType') == 22) {
                // 加载设备状态列表
                getFacilityStatus().done(function (res) {
                    statusRendering(res.data)
                })
            }
        });
        //选择设备分类下拉框改变事件
        $('#facilityCate').on('change', function () {
            getFacilityList()
        });
        //选择设备状态下拉框改变事件
        $('#facilityStatus').on('change', function () {
            getFacilityStatus().done(function (res) {
                statusRendering(res.data)
            })
        });
        // 预约时间下拉框改变事件
        $('.contentBox').on('change', '.timeSelector #timeSelector', function () {
            getFacilityStatus().done(function (res) {
                statusRendering(res.data)
            })
        })
    }
});