(function ($) {
    var REQUEST_URL = {
        'sign_list': 'shop/shopBookingList',//预约列表
        'change_status': 'shop/bookingStatusChange',//变更预约状态
        'check': 'shopDisplayTerminal/judgeShopCanBespoke',//判断这个店铺能否预约接口
        'add': 'shopDisplayTerminal/addBespoke', //新增
        'sendMsg':'shop/getRoomIdSendMessage'//往聊天室推送消息接口
    };
    //获取当前日期
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-').replace(/(?=\b\d\b)/g, '0');

    var employeeId = sessionStorage.getItem('backUserId');
    var shopId = sessionStorage.getItem('shopId'),
        merchantId = sessionStorage.getItem("merchantId");
    var oRole = sessionStorage.getItem("roleInfo");
    var pageNo = 1, pageSize = 100;
    var searchDate = today;
    $("#dateShow").text(today);
    //日期选择
    $("#selDate").jeDate({
        isinitVal:false,
        skinCell: "mystyle",
        format: "YYYY-MM-DD",
        isClear: false,
        isok: false,
        zIndex: 3000,
        choosefun: function (elem, val, date) {
            searchDate = val;
            $("#dateShow").text(val);
            $(elem).val("");
            getReservationList();
        }
    });
    $("#searchBtn").click(function () {
        getReservationList();
    });

    //判断是否有新增权限
    function checkPermission() {
        var permissionsList = JSON.parse(oRole).scSysPermissions;
        for (var i = 0; i < permissionsList.length; i++) {
            //发布方案
            if (permissionsList[i].percode == "pad_new_reservation") {
                $(".main-title .add-link").removeClass("hide");
                break;
            }
        }
    }

    checkPermission();

    //加载预约列表
    function getReservationList() {
        var customerName = $.trim($("#searchTxt").val());
        var param = {
            'shopId': shopId,
            'merchantId':merchantId,
            'bookDate': searchDate,
            'customerName': customerName,
            'pageNo': pageNo,
            'pageSize': 100
        };
        reqAjaxAsync(REQUEST_URL['sign_list'], JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                var obj = res.data, sHtml = '';
                if (obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        var status = "";
                        if (obj[i].status == -1) {
                            status = "已取消";
                        } else if (obj[i].status == 0) {
                            status = "预约中";
                        } else if (obj[i].status == 1) {
                            status = "已签到";
                        } else if (obj[i].status == 2) {
                            status = "待确认";
                        }
                        sHtml += '<li class="list-item" data-Type="' + obj[i].bespokeType + '">'
                            + '<div class="item-inner">';
                        if (obj[i].status == 0) {
                            sHtml += '<div class="title todo">' + obj[i].customerName + '</div>';
                        } else {
                            sHtml += '<div class="title"><b class="status">' + status + '</b>' + obj[i].customerName + '</div>';
                        }

                        sHtml += '<div class="detail"><dl>'
                            + '<dd><lable class="item-label">预约客户：</lable><span class="item-desc">' + obj[i].customerName + '</span></dd>'
                            + '<dd><lable class="item-label">客户电话：</lable><span class="item-desc">' + obj[i].mobile + '</span></dd>'
                            + '<dd><lable class="item-label">预约项目：</lable><span class="item-desc">' + obj[i].serviceName + '</span></dd>'
                            + '<dd><lable class="item-label">预约开始时间：</lable><span class="item-desc">' + obj[i].bookBeginDate + '</span></dd>'
                            + '<dd><lable class="item-label">预约结束时间：</lable><span class="item-desc">' + obj[i].bookEndTime + '</span></dd>'
                            + '<dd><lable class="item-label">预约服务人员：</lable><span class="item-desc">' + obj[i].waiterName + '</span></dd>'
                            + '<dd><lable class="item-label">预约设备：</lable><span class="item-desc">' + (obj[i].facilityName ? obj[i].facilityName : "") + '</span></dd>'
                            + '<dd><lable class="item-label">预约情况：</lable><span class="item-desc">' + status + '</span></dd>'
                            + '<dd><lable class="item-label">预约备注：</lable><span class="item-desc" title="' + obj[i].summary + '">' + obj[i].summary + '</span></dd>'
                            + '</dl></div>';

                        if (obj[i].status == 2) {
                            sHtml += '<div class="handle-btn"><button data-waiterId="' + obj[i].waiterId + '" data-id="' + obj[i].id + '" class="btn ok-btn">预约确认</button><button data-waiterId="' + obj[i].waiterId + '" data-id="' + obj[i].id + '" class="btn cancel-btn">取消预约</button></div>';
                        } else if (obj[i].status == 0) {
                            sHtml += '<div class="handle-btn"><button data-waiterId="' + obj[i].waiterId + '" data-id="' + obj[i].id + '" class="btn complete-btn">签到完成</button><button data-waiterId="' + obj[i].waiterId + '" data-id="' + obj[i].id + '" class="btn cancel-btn">取消预约</button></div>';
                        }
                        sHtml += '</div></li>';
                    }
                } else {
                    sHtml += '<div class="nodata">暂无数据</div>';
                }

            } else {
                layer.msg(res.msg);
            }
            $("#signInList").html(sHtml);
        });

    }


    $("#signInList").delegate(".ok-btn", "click", function () {
        //确认预约
        if($(this).attr('data-waiterId') !== employeeId||$(this).attr('data-waiterId') === "undefined"){
            layer.msg('抱歉，您无权操作此预约单！');
            return
        }
        var type = $(this).parents(".list-item").attr("data-type");
        bookingStatusChange($(this).attr('data-id'), 2, type);
    }).delegate(".complete-btn", "click", function () {
        //签到完成
        if($(this).attr('data-waiterId') !== employeeId||$(this).attr('data-waiterId') === "undefined"){
            layer.msg('抱歉，您无权操作此预约单！');
            return
        }
        var type = $(this).parents(".list-item").attr("data-type");
        bookingStatusChange($(this).attr('data-id'), 1, type);
    }).delegate(".cancel-btn", "click", function () {
        //取消预约
        if($(this).attr('data-waiterId') !== employeeId||$(this).attr('data-waiterId') === "undefined"){
            layer.msg('抱歉，您无权操作此预约单！');
            return
        }
        var type = $(this).parents(".list-item").attr("data-type");
        bookingStatusChange($(this).attr('data-id'), 0, type);
    });

    //客户预约签到、取消
    function bookingStatusChange(id, status, type) {
        ////预约ID, [{0,"取消预约"},{1,"客户签到"}]
        var param = {
            'id': id,
            'bespokeType': type,
            'change': status
        };
        reqAjaxAsync("shop/bookingStatusChange", JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                if (status == 0) {
                    layer.msg("预约取消成功！");
                } else if (status == 1) {
                    layer.msg("预约签到成功！");
                } else if (status == 2) {
                    layer.msg("预约确认成功！");
                }
            } else {
                layer.msg(res.msg);
            }
            //操作结束后，刷新数据列表
            getReservationList();
        });

    }

    $(function () {
        getReservationList();

    });

    $(".main-title .view-link").click(function () {
        parent.location.href = "html/customerReservation.html";
    });

    //打开新增弹框
    function newReservationDialog(res) {
        if (res.code == 1) {
            var can = res.data.can;
            if (can == 1) {
                var obj = res.data.setting;
                var params = 'businessStartTime=' + obj.businessStartTime + '&businessEndTime=' + obj.businessEndTime + '&intervalTime=' + obj.intervalTime + '&beforeArrivalsStopTime=' + obj.beforeArrivalsStopTime;
                var pageUrl = 'html/newReservation.html?' + params;

                layer.open({
                    type: 2,
                    title: ['新增预约'],
                    area: ['80%', '73%'],
                    shadeClose: true,
                    scrollbar: false,
                    content: pageUrl,
                    btn: ['确定', '取消'],
                    success: function (layero, index) {

                    },
                    yes: function (index, layero) {

                        var oForm = layer.getChildFrame('form', index);
                        var oWaiterSelector = layer.getChildFrame('select#waiterSelector', index),
                            oServiceSelector = layer.getChildFrame('select#serviceSelector', index),
                            oFacilitySelector = layer.getChildFrame('select#facilitySelector', index);

                        var stSelector = layer.getChildFrame('select#startTime', index),
                            etSelector = layer.getChildFrame('select#endTime', index);

                        var formData = $(oForm).serializeArray();
                        var jsonData = {};
                        $.each(formData, function (i, field) {
                            jsonData[field.name] = field.value;
                        });
                        var waiter = $(oWaiterSelector).find("option:selected").text();
                        var serviceName = $(oServiceSelector).find("option:selected").text(),
                            servicePrice = $(oServiceSelector).find("option:selected").attr("data-pirce");

                        var facilityName = $(oFacilitySelector).find("option:selected").text();


                        if ($.trim(jsonData['mobile']) == "") {
                            layer.msg("请输入预约客户的手机号！");
                            return;
                        }
                        var reg = /^1[0-9]{10}$/;
                        if (!reg.test(jsonData['mobile'])) {
                            layer.msg("请输入正确的11位手机号码！");
                            return;
                        }

                        if (jsonData['startTime'] == "" || jsonData['startTime'] == "--请选择--") {
                            layer.msg("预约开始时间不能为空！");
                            return;
                        }

                        if (jsonData['endTime'] == "" || jsonData['endTime'] == "--请选择--") {
                            layer.msg("预约结束时间不能为空！");
                            return;
                        }

                        var _st = $(stSelector).find("option:selected").attr("data-time"),
                            _et = $(etSelector).find("option:selected").attr("data-time");
                        if (_et <= _st) {
                            layer.msg("预约结束时间必须大于开始时间！");
                            return;
                        }

                        var difObj = between(jsonData['startDate'] + " " + jsonData['startTime'], jsonData['endDate'] + " " + jsonData['endTime']);
                        if (difObj.days > 0) {
                            layer.msg("预约开始时间与结束时间不能超过24小时！");
                            return;
                        }

                        var param = {
                            "backUserId": sessionStorage.getItem("backUserId"), //操作人编号
                            "backUserName": sessionStorage.getItem("username"), //操作人名称
                            "mobile": jsonData['mobile'], //电话，**必传**
                            "serviceId": jsonData['serviceSelector'], //项目编号
                            "serviceName": jsonData['serviceSelector'] == "" ? "" : serviceName, //项目名称
                            "servicePrice": jsonData['serviceSelector'] == "" ? "" : servicePrice, //项目金额
                            "waiter": jsonData['waiterSelector'] == "" ? "" : waiter, //服务人员名
                            "waiterId": jsonData['waiterSelector'], //服务人员编号
                            "merchantId": sessionStorage.getItem("merchantId"),//商铺编号，**必传**
                            "shopId": sessionStorage.getItem("shopId"),//门店编号，**必传**
                            "shopName": sessionStorage.getItem("shopName"), // 门店名
                            "adviserId": sessionStorage.getItem("backUserId"), // 顾问编号，**必传，同backUserId**
                            "adviserName": sessionStorage.getItem("username"), //顾问名，**必传，同backUserName**
                            "facilityId": jsonData['facilitySelector'], //设备编号
                            "facilityName": jsonData['facilitySelector'] == "" ? "" : facilityName,  //设备名
                            "bespokeStartDate": jsonData['startDate'],// 开始日期，**必传**
                            "bespokeStartTime": jsonData['startTime'] + ":00", // 开始时间，**必传**
                            "bespokeEndDate": jsonData['endDate'], // 结束日期，**必传**
                            "bespokeEndTime": jsonData['endTime'] + ":00",  // 结束时间，**必传**
                            "summary": jsonData['summary']    // 备注，**必传**
                        };

                        // console.log(param);
                        reqAjaxAsync(REQUEST_URL['add'], JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg("新增预约成功！");
                                getReservationList();
                                sendMsg(res.data.bespokeId);
                                layer.close(index);
                            } else {
                                layer.msg(res.msg);
                            }

                        });
                    },
                    cancel: function (index) {
                        layer.close(index);
                    }
                });
            } else {
                layer.msg("您还没有对预约条件进行设置，请先设置后再新增！");
                return;
            }
        } else {
            layer.msg(res.msg);
        }
    }

    //新增
    $(".main-title .add-link").click(function () {
        var param = {'shopId': shopId};
        reqAjaxAsync(REQUEST_URL['check'], JSON.stringify(param)).done(function (res) {
            newReservationDialog(res);
        });
    });

    //开单成功往聊天室推送消息接口
    function sendMsg(orderNo){
        var userCode = sessionStorage.getItem('musercode');
        var params = {
            "orderNo": orderNo,
            "userCode": userCode,
            "shopId": shopId,
            "type":2
        };
        reqAjaxAsync(REQUEST_URL['sendMsg'],JSON.stringify(params)).done(function (res) {
            console.log(res.msg);
        })
    }

})(jQuery);
