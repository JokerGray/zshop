$(function () {
    layui.use(['form', 'layer', 'laydate', 'table', 'laypage'], function () {
        var form = layui.form, table = layui.table, layer = layui.layer, laydate = layui.laydate, laypage = layui.laypage;

        var page = 1;
        var rows = 10;

        var merchantId = getUrlParams("merchantId"); //商户id
        // var shopId=getUrlParams("shopId");//商铺id
        var userId = getUrlParams("userId"); //当前登录帐号id
        var userCode = getUrlParams('userCode') || sessionStorage.getItem("userCode"); //当前登录帐号
        var userName = getUrlParams('userName') || sessionStorage.getItem("userName"); //当前登录帐号名称
        var sd = '';
        var authority = false;   //收入查看权限
        var USER_URL = {
            RESOURLIST: 'backstage/statisticsIncomeAndExpenditure', //(查询明细)
            SELECTSHOP: 'backstage/findShopInfoByUser',//选择店铺
            AUTHORITY: 'backstage/findSeeAuthority'
        };
        var queryObj = GetRequest() || {};
        var paramsAuthority = {
            block: 'accountsprofits_income',
            merchantId: merchantId,
            userCode: queryObj.userCode || '',
            userName: userName

        }
        //获取权限
        reqAjaxAsync(USER_URL.AUTHORITY, JSON.stringify(paramsAuthority)).done(function (res) {
            console.log(res, "USER_URL.AUTHORITY");
            if(res.code == 1) {
                authority = res.data || false;
            }
        })
        //加载店铺

        function getShopList() {

            var params = {
                userId: userId
            }
            return reqAjaxAsync(USER_URL.SELECTSHOP, JSON.stringify(params)).done(function (res) {
                if (res.code === 1) {
                    var datas = res.data;
                    console.log(datas)
                    var str = '<option value="">门店选择</option>'
                    $.each(datas, function (i, item) {
                        str += '<option value="' + item.id + '">' + item.shopName + '</option>'
                        sd += item.id + ',';
                    })
                    $('.shopName').html(str);
                    sd = sd.slice(0, sd.length - 1)
                    form.render()
                }
            })

        }

        //时间控件
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            , range: '至'//设置时间段
            , format: 'yyyy-MM-dd'
            , theme: '#26c3b2'
            , done: function (value, date, endDate) {
                if (JSON.stringify(date) == "{}") {//判断是否为空对象
                    $('.time-box-div').hide();
                } else {
                    $('.time-box-div').show();
                }


            }
        });
        function stopPropagation(e) {
            if (e.stopPropagation)
                e.stopPropagation();
            else
                e.cancelBubble = true;
        }
        //取消冒泡
        $('#timeBox').bind('click', function (e) {
            stopPropagation(e);
        });
        //聚焦弹窗
        $('#dataTime').focus(function (event) {
            $(this).next().show()
        });
        //点击空白隐藏
        $(document).click(function () {
            $(".time-box").hide();
        });

        $('#saveBtn').click(function () {
            var dates = $('#date').val();
            if (dates) {
                $(this).parents('div.time-box').hide().prev().val($('#date').val())
            }

        })
        //取消按钮
        $('#cancelBtn').click(function () {
            $(this).parents('div.time-box').hide()
        })
        function getTime() {
            var now = new Date(); //当前日期
            var nowDayOfWeek = now.getDay(); //今天本周的第几天
            var nowDay = now.getDate(); //当前日
            var nowMonth = now.getMonth(); //当前月
            var nowYear = now.getYear(); //当前年
            nowYear += (nowYear < 2000) ? 1900 : 0; //

            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();

            //格局化日期：yyyy-MM-dd
            function formatDate(date) {
                var myyear = date.getFullYear();
                var mymonth = date.getMonth() + 1;
                var myweekday = date.getDate();

                if (mymonth < 10) {
                    mymonth = "0" + mymonth;
                }
                if (myweekday < 10) {
                    myweekday = "0" + myweekday;
                }
                return (myyear + "-" + mymonth + "-" + myweekday);
            }
            //获取本年
            function getYears() {
                var yearStart = nowYear + "-01-01";
                var endStart = nowYear + "-12-31";
                return yearStart + ' 至 ' + endStart;
            }
            //获取昨日
            function getYesterDay() {
                var dd = new Date(); //当前日期
                dd.setDate(dd.getDate() - 1);
                return formatDate(dd)
            }
            //获得某月的天数
            function getMonthDays(myMonth) {
                var monthStartDate = new Date(nowYear, myMonth, 1);
                var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                return days;
            }

            //获得本季度的开端月份
            function getQuarterStartMonth() {
                var quarterStartMonth = 0;
                if (nowMonth < 3) {
                    quarterStartMonth = 0;
                }
                if (2 < nowMonth && nowMonth < 6) {
                    quarterStartMonth = 3;
                }
                if (5 < nowMonth && nowMonth < 9) {
                    quarterStartMonth = 6;
                }
                if (nowMonth > 8) {
                    quarterStartMonth = 9;
                }
                return quarterStartMonth;
            }

            //获得本周的开端日期
            function getWeekStartDate() {
                var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                return formatDate(weekStartDate);
            }

            //获得本周的停止日期
            function getWeekEndDate() {
                var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
                return formatDate(weekEndDate);
            }

            //获得本月的开端日期
            function getMonthStartDate() {
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                return formatDate(monthStartDate);
            }

            //获得本月的停止日期
            function getMonthEndDate() {
                var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
                return formatDate(monthEndDate);
            }

            //获得上月开端时候
            function getLastMonthStartDate() {
                var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
                return formatDate(lastMonthStartDate);
            }

            //获得上月停止时候
            function getLastMonthEndDate() {
                var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
                return formatDate(lastMonthEndDate);
            }

            //获得本季度的开端日期
            function getQuarterStartDate() {

                var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
                return formatDate(quarterStartDate);
            }

            //或的本季度的停止日期
            function getQuarterEndDate() {
                var quarterEndMonth = getQuarterStartMonth() + 2;
                var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
                return formatDate(quarterStartDate);
            }
            $('.time-box-ul').on('click', 'li', function () {

                var text = $(this).text();
                var str = '';
                // console.log($(this).text())
                // console.log(getYears())//本年
                // console.log(getMonthStartDate()+'至'+getMonthEndDate())//本月
                // console.log(getLastMonthStartDate()+'至'+getLastMonthEndDate());//上月
                // console.log(formatDate(now));//今日
                // console.log(getYesterDay());//昨日
                switch (text) {
                    case '本年':
                        str = getYears();
                        break;
                    case '本月':
                        str = getMonthStartDate() + ' 至 ' + getMonthEndDate();
                        break;
                    case '上月':
                        str = getLastMonthStartDate() + ' 至 ' + getLastMonthEndDate();
                        break;
                    case '今日':
                        str = formatDate(now);
                        break;
                    case '昨日':
                        str = getYesterDay();
                        break;
                    default:
                        str = '';
                }
                $(this).parents('div.time-box').hide().prev().val(str)

                // console.log(getWeekStartDate()+'至'+getWeekEndDate())//本周
            })
        }
        getTime();
        //点击本年、本月、上月。。。

        //点击变色
        $('body').on('click', '.layui-form .layui-table-body tr', function () {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        });
        $('.layui-table-main').niceScroll({
            cursorcolor: "#dfdfdf",
            cursorborder: "0",
            autohidemode: false,
            cursorwidth: '10px'
        });
        //回调
        //pageCallback回调
        function pageCallback(index, limit) {
            var time = $('#dataTime').val().split(' 至 ');
            var shopId = $('#shopName').val() || sd;//店铺id
            var params = {
                page: index,
                rows: limit,
                merchantId: merchantId,
                startTime: time[0] || '',
                endTime: time[1] || time[0] || '',
                shopId: shopId,
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(params));
        }

        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url, parms).done(function (res) {
                if (res.code == 1) {
                    var datas = res.data;
                    VUEDATA.profit = 0
                    VUEDATA.expTotal = 0
                    VUEDATA.incomTotal = 0
                    var expenditureDetailed = datas.expenditureDetailed;//支出
                    var incomeDetailed = datas.incomeDetailed;//收入
                    var tr1 = `<tr id="sr"><td width="15%">支出</td></tr>`

                    $.each(expenditureDetailed, function (i, item) {
                        tr1 += `<tr><td width="30%">${item.accountCategoryName}</td><td width="55%">${getMoneyFormat(item.moneyTotal)}</td></tr>`;
                        VUEDATA.expTotal += item.moneyTotal;
                    })
                    var trNum = `<tr style="background: #f1f1f1;"><td>小计</td><td>${getMoneyFormat(VUEDATA.expTotal)}</td></tr>`
                    tr1 += trNum
                    VUEDATA.trtop = tr1
                    if (authority) {
                        var tr2 = ` <tr id="zc"><td>收入</td></tr>`
                        $.each(incomeDetailed, function (i, item) {
                            tr2 += `<tr><td width="30%">${item.accountCategoryName}</td><td width="55%">${item.moneyTotal}</td></tr>`;
                            VUEDATA.incomTotal += item.moneyTotal;
                        })
                        var trNum2 = `<tr style="background: #f1f1f1;"><td>小计</td><td>${getMoneyFormat(VUEDATA.incomTotal)}</td></tr>`
                        tr2 += trNum2;
                        VUEDATA.trbottom = tr2
                        VUEDATA.tbody = VUEDATA.trtop +VUEDATA.trbottom;
                        VUEDATA.profit = VUEDATA.incomTotal - VUEDATA.expTotal;
                        $('.main .data-box').show();
                    }else {
                        VUEDATA.tbody = VUEDATA.trtop;
                        VUEDATA.profit = 0;
                        // //隐藏收入 利润
                        // $('.main .data-box li').eq(1).hide();
                        // $('.main .data-box li').eq(2).hide();
                    }
                    VUEDATA.profit = getMoneyFormat(VUEDATA.profit)
                    VUEDATA.expTotal = getMoneyFormat(VUEDATA.expTotal)
                    VUEDATA.incomTotal = getMoneyFormat(VUEDATA.incomTotal)
                    $('#tbody').html(VUEDATA.tbody)
                    $('#sr').find('td').attr('rowspan', expenditureDetailed.length + 2);
                    if (authority) {
                        $('#zc').find('td').attr('rowspan', incomeDetailed.length + 2);
                    }
                }
                deff.resolve(res)
            })
            return deff.promise();
        }

        var VUEDATA = {
            tbody: '',
            trtop: '',
            trbottom: '',
            expTotal: 0,
            incomTotal: 0,
            profit: 0,
        }
        var app = new Vue({
            el: '.main',
            data: VUEDATA,
            created: function () {
                getShopList().done(function (res) {
                    //获取权限
                    reqAjaxAsync(USER_URL.AUTHORITY, JSON.stringify(paramsAuthority)).done(function (res) {
                        //console.log(res, "USER_URL.AUTHORITY");
                        if (res.code == 1) {
                            authority = res.data;
                        }
                        pageCallback(page, rows);
                    })
                })

            }

        })
        // getShopList()
        // pageCallback(page,rows);
        //保存按钮
        $('#searchBtn').click(function () {
            pageCallback(page, rows);
        })
        $('#restBtn').click(function () {
            $('.hearder').find('input,select').val('');
            pageCallback(page, rows);
        })
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    })

})
