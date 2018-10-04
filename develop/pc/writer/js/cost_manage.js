var userId = localStorage.getItem('userId') || '';
var layer = layui.layer,
    laypage = layui.laypage,
    laydate = layui.laydate,
    laytpl = layui.laytpl;
var isM = localStorage.getItem('isM'),
    platForm = 1003;
if(isM == 2){
    platForm = 1002;
}
function costManage() {
    this.url = {
        getAdInfo: 'cms_new/putHistoryScCmsAdvIndex',
        advCost: 'cms_new/selectScCmsAdvDetailedIndex',
        incomeList: 'cms_new/selectScCmsAdvDetailedProfit',
        paymentMList: 'cms_new/selectScCmsAdvDetailedPay',
        advInfoTable: 'cms_new/selectScCmsAdvDetailsExpenses',
        advInfoEchart: 'cms_new/selectScCmsAdvDetailsTable',
        getCostList: 'cms_new/presentationDetails',
        withDrawMoney: 'cms_new/IncomeTransfer'
    }
    this.pages = 1;
    this.rows = 5;
    this.adInfoData = {
        scCmsAdvRelease: userId,
        scCmsAdvPlatForm: platForm,
        scCmsAdvType: 0
    }
    this.costList = {
        userId: userId,
        pageNo: 1,
        pageSize: this.rows
    }
}
costManage.prototype = {
    getAdInfo: function() {      //获取费用数据
        reqAjaxAsync(this.url.getAdInfo, JSON.stringify(this.adInfoData)).done(function(res) {
            if(res.code != 1) {return layer.msg(res.msg)};
            if(res.code == 1) {
                var data = res.data || '';
                if(!isNull(data)) {
                    $('#alreadyPresent').html(data.alreadyPresent || '0');
                    $('#nonPresent').html(data.nonPresent || '0');
                }
            }
        })
    },
    advCost: function(d) {      //获取费用总金额
        reqAjaxAsync(this.url.advCost, d).done(function(res) {
            if(res.code == 1) {
                $('#balance').html(res.data.scCmsAdvAccountMoney || '0');    //账户余额
                $('#payNum').html(res.data.totalPaymentMoney || '0');      //付费总计
                $('#incomeNum').html(res.data.totalIncomeMoney || '0')   //收益总计
            } else {
                layer.msg(res.msg);
            }
        })
    },
    getList: function(url, d, flag) {     //收益列表
        var _this = this;
        reqAjaxAsync(url, JSON.stringify(d)).done(function(res) {
            if(res.code != 1) {
                layer.msg(res.msg);
                $('#advList').html('');
                $('#page').hide();
            }
            if(res.code == 1) {
                var data = res.data || '',
                    total = res.total || '';
                if(!isNull(data)) {
                    var getTpl = $("#incomeList").html();
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages > 1 ? $('#page').show() : $('#page').hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#advList").html(html);
                    });
                    return flag ? _this.getPage(url, _this.pages, d) : false;
                } else {
                    $('#advList').html('');
                    $('#page').hide();
                }
            }
        })
    },
    getPage: function(url, pages, d) { //获取分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.page = obj.curr;
                _this.getList(url, d, false);
            }
        });
    },
    advInfoTable: function(url, d) {
        var _this = this;
        reqAjaxAsync(url, d).done(function(res) {
            if(res.code != 1) {
                layer.msg(res.msg);
            }
            if(res.code == 1) {
                var data = res.data || '',
                    total = res.total || '';
                if(!isNull(data)) {
                    var advStyle = $("#advStyle").html();
                    laytpl(advStyle).render(data.adv, function(html) {
                        $("#advStyleBox").html(html);
                    });
                    var advInfoList = $("#advInfoList").html();
                    laytpl(advInfoList).render(data, function(html) {
                        $("#advInfoTbody").html(html);
                    });
                }
            }
        })
    },
    echart: function (url, d, echart, type) {
        var _this = this;
        reqAjaxAsync(url, d).done(function(res) {
            if(res.code != 1 || isNull(res.data)) {
                layer.msg(res.msg);
            }
            if(res.code == 1) {
                var data = res.data || '',
                    total = res.total || '';
                if(!isNull(data)) {
                    var timeArr = [], numArr = [], unitPrice = '0';
                    unitPrice = data.advOrder.unitPrice || '0'
                    $.each(data.table, function(i, e) {
                        timeArr.push(e.createTime);
                        numArr.push(e.count);
                    })
                    option = {
                        title: {
                            text: '单价构成：'+ unitPrice +'元/次'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        legend: {
                            data: ['收益点击量', '收益展示量']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: timeArr
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                                // boundaryGap : [0, '100%']
                            }
                        ],
                        series: [
                            {
                                name: type,
                                type: 'line',
                                stack: '总量',
                                areaStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0, color: '#95E9E0' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#95E9E0' // 100% 处的颜色
                                        }], false)
                                    }
                                },
                                itemStyle : {
                                    normal : {
                                        color: '#95E9E0',      //设置折点颜色
                                        lineStyle: {
                                            normal: {
                                                color: '#95E9E0'   //设置折线颜色
                                            }
                                        }
                                    }
                                },
                                data: numArr
                            }
                        ]
                    };
                    echart.setOption(option);   //参数设置方法
                }
            }
        })
    },
    getCostList: function(d, flag) {
        var _this = this;
        reqAjaxAsync(this.url.getCostList, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                var data = res.data.list || '';
                var total = res.data.total || '0';
                if (!isNull(data)) {
                    var getTpl = $("#costList").html();
                    _this.costPage = Math.ceil(total / _this.rows);
                    _this.costPage > 1 ? $('#withDPage').show() : $('#withDPage').hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#withDrawtBody").html(html);
                    });
                    return flag ? _this.getCostPage(_this.costPage, d) : false;
                } else {
                    $("#withDrawtBody").html('');
                    $('#withDPage').hide();
                }
            }
        });
    },
    getCostPage: function(pages, d) { //获取分页
        var _this = this;
        laypage({
            cont: 'withDPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pageNo = obj.curr;
                _this.getCostList(d, false);
            }
        });
    },
    withDrawMoney: function() {      //提现金额
        reqAjaxAsync(this.url.withDrawMoney, JSON.stringify({userId: userId})).done(function(res) {
            layer.msg(res.msg);
        });
    }
}

$(function () {
    //禁止输入空格
    inhibitTrim('#start');
    inhibitTrim('#end');
    inhibitTrim('#authorName');
    //点击日期获取时间
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var startDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                endDate.start = datas //将结束日的初始值设定为开始日
                start.startTime = datas;
                start.endTime = $("#end").val();
                if (!isNull($("#end").val())) {
                    start.startTime = datas;
                    start.endTime = $("#end").val();
                }
            }
        };

        var endDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                start.startTime = $("#start").val();
                start.endTime = datas;
                if (!isNull($("#start").val())) {
                    start.startTime = $("#start").val();
                    start.endTime = datas;
                }
            }
        };

        $('#start').click(function() {
            startDate.elem = this;
            laydate(startDate);
        });

        $('#end').click(function() {
            endDate.elem = this;
            laydate(endDate);
        });
    });
    var costObj = new costManage();
    costObj.getAdInfo();
    //data值
    var advData = {
        userId: userId,
        page: 1,
        rows: costObj.rows
    }
    //广告费用金额
    costObj.advCost(JSON.stringify({"userId": userId}));
    //广告收益列表
    costObj.getList(costObj.url.incomeList, advData, true);
    //查看提现详情
    $('#withDrawM').click(function() {
        $('#withDrawNum').html($(this).siblings('#alreadyPresent').html());
        costObj.getCostList(costObj.costList, true);
    })
    //点击提现按钮
    $('#withDrawBtn').click(function() {
        costObj.withDrawMoney();
    })
    //切换tab栏
    $('.switchOver li').click(function() {
        // if($(this).attr('type') == 1) {
        //     $('#tableTypeText').html('商品收益');
        // } else if($(this).attr('type') == 2) {
        //     $('#tableTypeText').html('商品付费');
        // }
        $('.switchOver li').removeClass('active');
        $(this).addClass('active');
        advData.scCmsAdvTitle = $('#authorName').val();
        advData.scCmsAdvStart = isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00';
        advData.scCmsAdvEnd = isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59';
        costObj.getList(getUrl(this), advData, true);
    })
    //点击搜索按钮  
    $('#search_icon').click(function() {
        advData.scCmsAdvTitle = $('#authorName').val();
        advData.scCmsAdvStart = isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00';
        advData.scCmsAdvEnd = isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59';
        costObj.getList(getUrl('.switchOver li.active'), advData, true);
    })
    //查看广告详情
    var advId = '';
    $('#advList').on('click', '.advInfoBtn', function() {
        $('#advTableBtn').attr('type', 1);
        $('#advInfoTable').show();
        $('#advChart').hide();
        advId = $(this).parent().parent().attr('advId');
        costObj.advInfoTable(costObj.url.advInfoTable, JSON.stringify({scCmsAdvId: advId}))
    })
    //广告详情统计图
    $('#advTableBtn').click(function() {
        if($(this).attr('type') == 1) {
            var advChart = echarts.init(document.getElementById('advChart'));
            costObj.echart(costObj.url.advInfoEchart, JSON.stringify({scCmsAdvId: advId}), advChart, ('收益' + $('#costInfoType').html()));
            $('#advInfoTable').hide();
            $('#advChart').show();
            $(this).attr('type', 2);
        } else {
            $('#advInfoTable').show();
            $('#advChart').hide();
            $(this).attr('type', 1);
        }
    })
    //金额禁止输入非正整数
    ExamInpNum('#rechargeBtn');
    //点击充值按钮进行充值
    var flag = true;
    $('#rechConfirm').click(function() {
        $(this).find('a').attr('href', 'javascript:;');
        var inputVal = $('#rechargeBtn').val();
        if(isNull(inputVal)) {
            layer.msg('请先填写金额');
        } else if(inputVal == 0) {
            layer.msg('充值金额不能为0');
        } else {
            $('#rechargeBtn').val('');
            var chargehref = './openPay.html?userId='+ userId +'&payM=' + inputVal;
            $(this).find('a').attr('href', chargehref);
            $('#rechModelClose').click();
        }
    })
    function getUrl(html) {
        var type = $(html).attr('type'), listUrl = '';
        if(type == 1) {
            listUrl = costObj.url.incomeList;
        } else if(type == 2) {
            listUrl = costObj.url.paymentMList;
        }
        return listUrl;
    }
})

//提现状态
function withDrawType(type) {
    // 1申请中2通过3失败
    var str = "";
    switch(type) {
        case "1":
            str = "申请中";
            break;
        case "2":
            str = "通过";
            break;
        case "3":
            str = "失败";
            break;
    }
    return str;
}