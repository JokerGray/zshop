layui.use(['form', 'layer', 'laydate'], function () {
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;
    var REQUIRE_URL = {
        shopList: 'report/selectShopListByBackUserId',//店铺列表
        excellentEmployeeList: 'excellentEmployee/getExcellentEmployeeList',//优秀员工奖列表
        refresh: 'excellentEmployee/regenerateExcellentEmployee',//重新生成
    };
    var backUserId = getUrlParams('backUserId');
    var today = formatAllDate(new Date(), 'yyyy-MM-dd');
    init();

    //初始化时间选择
    function initDate() {
        laydate.render({
            elem: '#day',
            type: 'date',
            value: new Date(),
            isInitValue: true,
            max: 0,
            btns: ['now', 'confirm'],
        });
        laydate.render({
            elem: '#month',
            type: 'month',
            value: new Date(),
            isInitValue: true,
            max: 0,
            btns: ['now', 'confirm'],
        });
        laydate.render({
            elem: '#season',
            type: 'year',
            value: new Date(),
            isInitValue: true,
            max: 0,
            btns: ['now', 'confirm'],
            done: function () {
                setTimeout(function () {
                    getSeason();
                }, 0)

            }
        });
        laydate.render({
            elem: '#year',
            type: 'year',
            value: new Date(),
            isInitValue: true,
            max: 0,
            btns: ['now', 'confirm'],
        })
    }

    //切换天，月，季，年
    $('.rewardType ul li').click(function () {
        var type = $(this).attr('data-type');
        $(this).addClass('active').siblings().removeClass('active');
        $('#timeSelectors').find('input:eq(' + (type - 1) + ')').show().siblings().hide();
        if (type === '3') {
            $('.seasonSelector').css('display', 'inline-block');
            getSeason()
        } else {
            $('.seasonSelector').css('display', 'none')
        }
        getExcellentEmployeeList()
    });

    //获取季度
    function getSeason() {
        var year = $('#season').val() || formatAllDate(new Date(), 'yyyy');
        var thisYear = formatAllDate(new Date(), 'yyyy');
        var thisMonth = formatAllDate(new Date(), 'MM') * 1;
        var html = '';
        if (year < thisYear) {
            html = '<option value="1">一季度</option>'
                + '<option value="2">二季度</option>'
                + '<option value="3">三季度</option>'
                + '<option value="4">四季度</option>'
        } else if (year === thisYear) {
            if (thisMonth >= 1) {
                html = '<option value="1" selected>一季度</option>'
            }
            if (thisMonth >= 4) {
                html = '<option value="1">一季度</option>'
                    + '<option value="2" selected>二季度</option>'
            }
            if (thisMonth >= 7) {
                html = '<option value="1">一季度</option>'
                    + '<option value="2">二季度</option>'
                    + '<option value="3" selected>三季度</option>'
            }
            if (thisMonth >= 10) {
                html = '<option value="1">一季度</option>'
                    + '<option value="2">二季度</option>'
                    + '<option value="3">三季度</option>'
                    + '<option value="4" selected>四季度</option>'
            }
        }
        $('#seasonSelector').html(html);
        form.render('select')
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
                res.data.forEach(function (item, index) {
                    html += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
                });
                $('#shop').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取优秀员工列表
    function getExcellentEmployeeList(btnType) {
        var shopId = $('#shop').val();
        var type = $('.rewardType .active').attr('data-type');
        var quarter = '';
        var rewardCode = $('#standard').val();
        var excellentTime = '';
        var url = REQUIRE_URL['excellentEmployeeList'];
        if (type === '1') {
            excellentTime = $('#day').val() || today
        } else if (type === '2') {
            excellentTime = $('#month').val()
        } else if (type === '3') {
            excellentTime = $('#season').val();
            quarter = $('#seasonSelector').val()
        } else if (type === '4') {
            excellentTime = $('#year').val()
        }
        if (btnType === '1') {
            url = REQUIRE_URL['refresh']
        } else if (btnType === '2') {
            url = REQUIRE_URL['excellentEmployeeList']
        }
        var params = {
            "backUserId": backUserId,// 登录人编号
            "shopId": shopId,//店铺主键
            "type": type,// 查询时间类型:1.日、2.月、3.季、4.年
            "excellentTime": excellentTime,// 查询时间
            //日:2018-08-28
            //月::2018-08
            //季、年:2018
            "quarter": quarter,//季度用:1,2,3,4
            "rewardCode": rewardCode//1:服务业绩,2:服务人头数,3:现金业绩
        };
        reqAjaxAsync(url, JSON.stringify(params)).done(function (res) {
            //评比标准为服务业绩和现金业绩时，表格表头显示业绩，为服务人头数时显示数量/人次
            if (rewardCode === '1' || rewardCode === '3') {
                $('.performance').show();
                $('.peopleCount').hide()
            } else if (rewardCode === '2') {
                $('.performance').hide();
                $('.peopleCount').show()
            }
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var topHtml = '';
                var listHtml = '';
                var topData = res.data.slice(0, 3);
                var listData = res.data.slice(3);
                if (topData.length === 0) {
                    $('.topThree').hide().find('ul').html('');
                } else {
                    topData.forEach(function (item, index) {
                        if (item.userPic === null) {
                            item.userPic = './images/default.png'
                        }
                        topHtml += '<li>'
                            + '<div class="photo">'
                            + '<img src="' + item.userPic + '" alt="">'
                            + '</div>'
                            + '<div>'
                            + '<h4 title="'+item.userName+'">' + item.userName + '</h4>'
                            + '<p class="clearfix">'
                            + '<span>' + (item.userPosition || "--") + '</span>'
                            + '<span>'
                            + '<sub>￥</sub>'
                            + '<b>' + getMoneyFormat(item.awardsValue) + '</b>'
                            + '</span>'
                            + '</p>'
                            + '<p class="clearfix">'
                            + '<span class="shieldingStandard">' + (rewardCode === '2' ? '服务人头数' : '业绩金额') + '</span>'
                            + '<span>' + (rewardCode === '2' ? ((item.extend2*1).toFixed(2) || "--") : (getMoneyFormat(item.extend2)) || "--") + '</span>'
                            + '</p>'
                            + '</div>'
                            + '</li>'
                    });
                    $('.topThree').find('ul').html(topHtml).end().show();
                }
                if (listData.length === 0) {
                    $('.otherRanking table tbody').html('<tr><td colspan="7" style="text-align: center">暂无相关数据</td></tr>')
                } else {
                    var evaluationType = '';
                    var awardsTypeText = '';
                    if (rewardCode === '1') {
                        evaluationType = '服务业绩'
                    } else if (rewardCode === '2') {
                        evaluationType = '服务人头数'
                    } else if (rewardCode === '3') {
                        evaluationType = '现金业绩'
                    }
                    listData.forEach(function (item, index) {
                        if (item.awardsType === 1) {
                            awardsTypeText = '天奖'
                        } else if (item.awardsType === 2) {
                            awardsTypeText = '月奖'
                        } else if (item.awardsType === 3) {
                            awardsTypeText = '季奖'
                        } else if (item.awardsType === 4) {
                            awardsTypeText = '年奖'
                        }
                        listHtml += '<tr>'
                            + '<td>' + item.ranking + '</td>'
                            + '<td>' + item.userName + '</td>'
                            + '<td>' + (item.userPosition || "--") + '</td>'
                            + '<td>' + evaluationType + '</td>'
                            + '<td>' + (rewardCode === '2' ? (item.extend2 || "--") : (getMoneyFormat(item.extend2)) || "--") + '</td>'
                            + '<td>' + awardsTypeText + '</td>'
                            + '<td>' + getMoneyFormat(item.awardsValue) + '</td>'
                            + '</tr>'
                    });
                    $('.otherRanking table tbody').html(listHtml);
                }
            }
        })
    }

    //点击搜索按钮
    $('.filterBox').on('click', 'button', function () {
        var btnType = $(this).attr('data-btntype');
        getExcellentEmployeeList(btnType)
    });

    //初始化页面
    function init() {
        initDate();
        getSeason();
        getShopList().done(function () {
            form.render('select');
            getExcellentEmployeeList()
        })
    }
});