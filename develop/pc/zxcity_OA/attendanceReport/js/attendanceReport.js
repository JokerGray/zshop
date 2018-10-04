$(function () {
    var backUserId = getUrlParams('backUserId');
    var merchantId = getUrlParams('merchantId');
    var REQUIRE_URL = {
        shopList: 'backUser/getCanManageTheShop',//店铺列表
        waiterList: 'userWork/queryUserInfoByShopId',//店内所有参加考勤人员列表
        monthReport: 'userWork/queryWorkByMonthBack',//月统计
        dayReport: 'userWork/queryClockInfoBack',//日统计
        timeReport: 'userWork/queryWorkInfoByDateBack',//打卡时间统计
        detail: 'userWork/queryWorkInfoStatisticsByCalendarN'//某天打卡详情
    };
    var waiterList = [];
    var selectedWaiterList = [];
    //切换月统计，日统计，打卡时间页面、数据统计页面
    $('.tabNav').on('click', 'ul li', function () {
        var cls = $(this).attr("data-class");
        $(this).addClass('active').siblings('li').removeClass('active');
        // 根据tab按钮显示相应报表，cls为month显示月报表，day显示日报表，time显示打卡时间报表,data显示数据统计报表
        // $('.reportContent').find('.' + cls).show(500).siblings('div').hide();
        $('.month').html('');
        $('.day').html('');
        $('.time').html('');
        $('.data').html('');
        //初始化选择考勤人员按钮显示，默认显示全店铺
        // $('.peopleSelectBtn').text('全店铺');
        //根据tab按钮显示相应的筛选条件
        if (cls === 'month') {
            //显示展示列
            $('.showWhat').show();
            // 显示时间范围选择框
            $('.dateRangeSelect').css('display', 'inline-block');
            // 隐藏单独日期选择框
            $('.dateDaySelect').css('display', 'none');
            getMonthReport().done(function () {
                $('.reportContent').find('.' + cls).slideDown(300).siblings('div').hide();
            })
        } else if (cls === 'time') {
            //隐藏展示列
            $('.showWhat').hide();
            // 显示时间范围选择框
            $('.dateRangeSelect').css('display', 'inline-block');
            // 隐藏单独日期选择框
            $('.dateDaySelect').css('display', 'none');
            //获取打卡时间报表数据
            getTimeReport().done(function () {
                $('.reportContent').find('.' + cls).slideDown(300).siblings('div').hide();
            })
        } else if (cls === 'day') {
            //隐藏展示列
            $('.showWhat').hide();
            // 隐藏时间范围选择框
            $('.dateRangeSelect').css('display', 'none');
            // 显示单独日期选择框
            $('.dateDaySelect').css('display', 'inline-block');
            //获取打卡日报表数据
            getDayReport().done(function () {
                $('.reportContent').find('.' + cls).slideDown(300).siblings('div').hide();
            })
        } else {
            //隐藏展示列
            $('.showWhat').hide();
            // 显示时间范围选择框
            $('.dateRangeSelect').css('display', 'inline-block');
            // 隐藏单独日期选择框
            $('.dateDaySelect').css('display', 'none');
            //获取打卡时间报表数据
            getDataReport();
            $('.reportContent').find('.' + cls).slideDown(300).siblings('div').hide();
        }
    });

    //点击切换展示内容，显示或隐藏相应报表
    $('.showWhat').on('click', '.filterItem li', function () {
        $(this).toggleClass('active');
        //获取需要现实或者隐藏列的类名
        var cls = $(this).attr('data-class');
        if ($(this).hasClass('active')) {
            // 显示
            $('.reportContent .layui-table').find("." + cls).show(100).css({'min-width': '100px', 'transition': 'all 0.1s', 'font-size': '14px'})
        } else {
            // 隐藏
            $('.reportContent .layui-table').find("." + cls).css({'min-width': '0', 'transition': 'min-width 0.3s', 'font-size': '0'}).hide(300)
        }
    });

    //考勤报表导出开始
    {
        $('#exportBtn').on('click', function () {
            var cls = $('.tabNav .active').attr('data-class');
            var fileName = '';
            if (cls === 'month') {
                //恢复隐藏的内容的字体大小，以便导出显示完成报表
                $('.filterItem li').each(function (index, item) {
                    if (!$(item).hasClass('active')) {
                        var cls = $(this).attr("data-class");
                        $('.month').find('.' + cls).css('font-size', "14px")
                    }
                });
                //设置报表文件名
                fileName = $('#dateRange').val() + "月统计";
                $('#downBtn').attr('download', fileName);
                // 执行导出月报表操作
                exportExcel('month-table')
            } else if (cls === 'day') {
                //设置报表文件名
                fileName = $('#dateDay').val() + "日统计";
                $('#downBtn').attr('download', fileName);
                // 执行导出日报表操作
                exportExcel('day-table')
            } else if (cls === 'time') {
                //设置报表文件名
                fileName = $('#dateRange').val() + "打卡时间统计";
                $('#downBtn').attr('download', fileName);
                // 执行导出打卡时间报表操作
                exportExcel('time-table')
            } else if (cls === 'data') {
                //设置报表文件名
                fileName = $('#dateRange').val() + "数据统计";
                $('#downBtn').attr('download', fileName);
                // 执行导出打卡时间报表操作
                exportExcel('data-table')
            }
        });
        var idTmr;

        //获取当前浏览器类型
        function getExplorer() {
            var explorer = window.navigator.userAgent;
            //ie
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
            //firefox
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
            //Chrome
            else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            }
            //Opera
            else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            }
            //Safari
            else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        }

        function exportExcel(tableid) {
            if (getExplorer() == 'ie') {
                var curTbl = document.getElementById(tableid);
                var oXL = new ActiveXObject("Excel.Application");
                var oWB = oXL.Workbooks.Add();
                var xlsheet = oWB.Worksheets(1);
                var sel = document.body.createTextRange();
                sel.moveToElementText(curTbl);
                sel.select();
                sel.execCommand("Copy");
                xlsheet.Paste();
                oXL.Visible = true;
                try {
                    var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
                } catch (e) {
                    print("Nested catch caught " + e);
                } finally {
                    oWB.SaveAs(fname);
                    oWB.Close(savechanges = false);
                    oXL.Quit();
                    oXL = null;
                    idTmr = window.setInterval("Cleanup();", 1);
                }
            } else {
                tableToExcel(tableid)
            }
            //获取到类型需要判断当前浏览器需要调用的方法，目前项目中火狐，谷歌，360没有问题
            //win10自带的IE无法导出
        }

        function Cleanup() {
            window.clearInterval(idTmr);
            CollectGarbage();
        }

        //判断浏览器后调用的方法，把table的id传入即可
        var tableToExcel = (function () {
            // var uri = 'data:application/vnd.ms-excel;base64,',
            //     template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
            //     base64 = function (s) {
            //         return window.btoa(unescape(encodeURIComponent(s)))
            //     },
            //     format = function (s, c) {
            //         return s.replace(/{(\w+)}/g,
            //             function (m, p) {
            //                 return c[p];
            //             })
            //     };
            var uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
                base64 = function (s) {
                    return window.btoa(unescape(encodeURIComponent(s)))
                },
                format = function (s, c) {
                    return s.replace(/{(\w+)}/g,
                        function (m, p) {
                            return c[p];
                        })
                };
            return function (table, name) {
                if (!table.nodeType) table = document.getElementById(table);
                var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
                // window.location.href = uri + base64(format(template, ctx));
                $('#downBtn').attr('href', uri + base64(format(template, ctx)));
                $('#downBtn')[0].click()
            }
        })()
    }
    //考勤报表导出结束

    //获取本月所有日期
    function getNowDays() {
        var YYYY = formatAllDate(new Date(), "yyyy");
        var MM = formatAllDate(new Date(), "MM");
        var DD = formatAllDate(new Date(), "dd");
        // 获取今日日期
        var now = YYYY + "-" + MM + "-" + DD;
        //获取本月第一天日期
        var firstDay = YYYY + "-" + MM + "-" + "01";
        return [firstDay, now]
    }

    //将选择的日期转换为日历模式
    function calenderWeek(start, end) {
        var sArr = start.split('-');
        var eArr = end.split('-');
        var year;
        if (parseInt(sArr[0]) === parseInt(eArr[0])) {
            year = sArr[0];
        } else {
            console.log('不能跨年');
            return
        }
        var sMoth = sArr[1];
        var eMoth = eArr[1];
        var sd = sArr[2];
        var ed = eArr[2];
        //1-12月每个月的天数
        var dateArr = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var calenderWeek = [];
        if (sMoth === eMoth) {
            var i = sd;
            do {
                var week = new Date(year + "," + sMoth + "," + i).getDay();
                calenderWeek.push({
                    moth: sMoth,
                    day: parseInt(i),
                    week: CineseWeek(week),
                    year: year
                });
                i++;
            } while (i <= ed);
            // for (var i = sd; i <= ed; i++) {
            //     var week = new Date(year + "," + sMoth + "," + i).getDay();
            //     calenderWeek.push({
            //         moth: sMoth,
            //         day: i * 1,
            //         week: CineseWeek(week)
            //     })
            // }
        } else if (sMoth < eMoth && eMoth - sMoth === 1) {
            var j = sd;
            do {
                var week = new Date(year + "," + sMoth + "," + j).getDay();
                calenderWeek.push({
                    moth: sMoth,
                    day: parseInt(j),
                    week: CineseWeek(week),
                    year: year
                });
                j++;
            } while (j <= dateArr[sMoth - 1]);
            // for (var i = sd; i <= dateArr[sMoth * 1]; i++) {
            //     var week = new Date(year + "," + sMoth + "," + i).getDay();
            //     calenderWeek.push({
            //         moth: sMoth,
            //         day: i * 1,
            //         week: CineseWeek(week)
            //     })
            // }
            var k = 1;
            do {
                var week = new Date(year + "," + eMoth + "," + k).getDay();
                calenderWeek.push({
                    moth: eMoth,
                    day: parseInt(k),
                    week: CineseWeek(week),
                    year: year
                });
                k++
            } while (k <= ed);
            // for (var i = 1; i <= ed; i++) {
            //     var week = new Date(year + "," + eMoth + "," + i).getDay();
            //     calenderWeek.push({
            //         moth: eMoth,
            //         day: i * 1,
            //         week: CineseWeek(week)
            //     })
            // }
        } else {
            console.log("请选择两个月内的日期")
        }
        return calenderWeek;

        // 判断是否为闰年
        function is_leap(year) {
            return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 == 0 ? 1 : 0));
        }
    }

    //将星期转换为大写星期
    function CineseWeek(week) {
        switch (week) {
            case 1:
                week = "一";
                break;
            case 2:
                week = "二";
                break;
            case 3:
                week = "三";
                break;
            case 4:
                week = "四";
                break;
            case 5:
                week = "五";
                break;
            case 6:
                week = "六";
                break;
            default:
                week = "日";
        }
        return week;
    }

    //获取店内服务人员列表
    function getWaiterList() {
        var defer = $.Deferred();
        var params = {
            "shopId": $('#shopSelect').val(),
            "merchantId": merchantId
        };
        reqAjaxAsync(REQUIRE_URL['waiterList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            waiterList = res.data;
            defer.resolve(res)
        });
        return defer.promise()
    }

    //获取店铺列表
    function getShopList() {
        var defer = $.Deferred();
        var params = {
            "backUserId": parseInt(backUserId)
        };
        reqAjaxAsync(REQUIRE_URL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            var shopHtml = '';
            res.data.forEach(function (item, index) {
                shopHtml += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
            });
            $('#shopSelect').html(shopHtml);
            defer.resolve(res)
        });
        return defer.promise()
    }

    //切换店铺
    $('#shopSelect').on('change', function () {
        var cls = $('.tabNav .active').attr('data-class');
        $('.peopleSelectBtn').html('全店铺');
        selectedWaiterList = [];
        getWaiterList().done(function () {
            if (cls === 'month') {
                getMonthReport()
            } else if (cls === 'day') {
                getDayReport()
            } else if (cls === 'time') {
                getTimeReport()
            } else if (cls === 'data') {
                getDataReport()
            }
        })
    });

    //打开考勤人员选择框
    $('.peopleSelectBtn').on('click', function () {
        // 初始化弹框内的数据列表
        // selectedWaiterList = [];
        if (selectedWaiterList.length === 0) {
            $('.allSelectBtn').addClass('active');
            waiterList.forEach(function (item, index) {
                item['selected'] = 'true'
            });
            selectedWaiterList = JSON.parse(JSON.stringify(waiterList));
        }
        layer.open({
            type: 1,
            title: '',
            closeBtn: 0,
            content: $('#selectWaiterTpl'),
            skin: 'selectWaiter',
            shade: 0.5,
            shadeClose: true,
            // area: ['840px', '662px'],
            area: ['840px', '80%'],
            success: function (layeror, index) {
                // $(layeror).find('.waiting>div').height($(layeror).height()*0.50);
                // $(layeror).find('.selected>div').height($(layeror).height()*0.50);
                var waitingHtml = template('waitingTpl', waiterList);
                var selectedHtml = template('selectedTpl', selectedWaiterList);
                $(layeror).find('.waiterItem').html(waitingHtml);
                $(layeror).find('.selectedContent').html(selectedHtml);
                $(layeror).find('.cancelBtn').off('click').click(function () {
                    layer.close(index);
                });
                $(layeror).find('.yesBtn').off('click').on('click', function () {
                    var cls = $('.tabNav .active').attr('data-class');
                    if (selectedWaiterList.length > 0 && selectedWaiterList.length < waiterList.length) {
                        $('.peopleSelectBtn').html('已选择' + selectedWaiterList.length + '人');
                        layer.close(index)
                    } else if (selectedWaiterList.length === waiterList.length) {
                        $('.peopleSelectBtn').html('全店铺');
                        layer.close(index)
                    } else {
                        layer.msg('请选择考勤人员', {icon: 5});
                        return
                    }
                    // var selUserIds = [];
                    // selectedWaiterList.forEach(function (item, index) {
                    //     selUserIds.push(item.userId)
                    // });
                    if (cls === 'month') {
                        getMonthReport()
                    } else if (cls === 'day') {
                        getDayReport()
                    } else if (cls === 'time') {
                        getTimeReport()
                    } else if (cls === 'data') {
                        getDataReport()
                    }
                })
            }
        })
    });
    //选择考勤人员
    {
        //全选考勤人员
        $('.allSelectBtn').on('click', function () {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                // 全选
                // 考勤人员前面的选择按钮为选择状态
                $('.waiterItem').find('.selectBtn').addClass('active');
                // 已选择框内显示多有考勤人员列表
                selectedWaiterList = JSON.parse(JSON.stringify(waiterList));
                var selectedHtml = template('selectedTpl', selectedWaiterList);
                $('.selectedContent').html(selectedHtml);
                // 将所有考勤人员的数据标记为已选择状态
                waiterList.forEach(function (item, index) {
                    item['selected'] = 'true';
                })
            } else {
                // 全不选
                // 考勤人员前面的选择按钮为非选择状态
                $('.waiterItem').find('.selectBtn').removeClass('active');
                //移除已选择框内的考勤人员列表
                selectedWaiterList = [];
                var selectedHtml = template('selectedTpl', selectedWaiterList);
                $('.selectedContent').html(selectedHtml);
                // 将所有考勤人员的数据标记为非选择状态
                waiterList.forEach(function (item, index) {
                    item['selected'] = 'false';
                })
            }
        });
        //逐个选择考勤人员
        $('.waiterItem').on('click', '.selectBtn', function () {
            $(this).toggleClass('active');
            var waiterId = $(this).attr('data-waiterId');
            var selectedItem = JSON.parse($(this).attr('data-item'));
            var selectedHtml = '';
            if ($(this).hasClass('active')) {
                // 选中
                //将选中的考勤人员数据追加到已选考勤人员数据中，并显示在已选框内
                selectedWaiterList.push(selectedItem);
                selectedHtml = template('selectedTpl', selectedWaiterList);
                $('.selectedContent').html(selectedHtml);
                //在所有考勤人员数据中标记当前已选数据为已选中状态
                waiterList.forEach(function (item, index) {
                    if (item.userId == waiterId) {
                        item['selected'] = 'true'
                    }
                })
            } else {
                // 取消选中
                // 根据考勤人员id，移除已选框内的考勤人员
                selectedWaiterList.forEach(function (item, index) {
                    if (item.userId == waiterId) {
                        selectedWaiterList.splice(index, 1)
                    }
                });
                selectedHtml = template('selectedTpl', selectedWaiterList);
                $('.selectedContent').html(selectedHtml);
                //在所有考勤人员数据中标记当前已选数据为非选中状态
                waiterList.forEach(function (item, index) {
                    if (item.userId == waiterId) {
                        item['selected'] = 'false'
                    }
                })
            }
            //控制全选按钮
            isAllSelected()
        });

        //控制全选按钮
        function isAllSelected() {
            //假设已经全部选择
            var flag = true;
            $('.waiterItem').find('.selectBtn').each(function (index, item) {
                if (!$(item).hasClass('active')) {
                    flag = false;
                    return
                }
            });
            if (flag) {
                $('.allSelectBtn').addClass('active')
            } else {
                $('.allSelectBtn').removeClass('active')
            }
        }

        //搜索考勤人员
        $('#submit').on('submit', function () {
            var keyword = $.trim($('.keyword').val());
            var searchList = [];
            $('.allSelectBox').hide();
            if (keyword === '') {
                layer.msg('请输入考勤人员姓名或者手机号', {icon: 2});
                return
            }
            waiterList.forEach(function (item, index) {
                if (item['backUserName'].indexOf(keyword) >= 0 || item['phone'].toString().indexOf(keyword) >= 0) {
                    searchList.push(item)
                }
            });
            var waitingHtml = template('waitingTpl', searchList);
            $('.waiterItem').html(waitingHtml);
        });
        //取消搜索，还原考勤人员列表
        $('.keyword').on('keyup', function () {
            if ($.trim($(this).val()) === '') {
                var waitingHtml = template('waitingTpl', waiterList);
                $('.waiterItem').html(waitingHtml);
                $('.allSelectBox').show();
            }
            isAllSelected()
        })
    }

    //获取考勤月统计
    function getMonthReport() {
        var defer = $.Deferred();
        var startTime = $.trim($('#dateRange').val().split('~')[0]);
        var endTime = $.trim($('#dateRange').val().split('~')[1]);
        var shopId = $('#shopSelect').val();
        var shopName = $('#shopSelect :selected').text();
        var userIds = [];
        // if (selUserIds) {
        //     userIds = selUserIds
        // } else {
        //     waiterList.forEach(function (item, index) {
        //         userIds.push(item.userId)
        //     })
        // }
        if (selectedWaiterList.length === 0) {
            waiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        } else {
            selectedWaiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        }
        var params = {
            "startTime": startTime + ' 00:00:00',
            "endTime": endTime + ' 23:59:59',
            "shopId": shopId,
            // "shopId": 110,
            "userIds": userIds,
        };
        reqAjaxAsync(REQUIRE_URL['monthReport'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            res.shopName = shopName;
            res.calendar = calenderWeek(startTime, endTime);
            template.defaults.imports.workTimeFormat = function (time) {
                var h = Math.floor(time / 60);
                var m = time % 60;
                return h + "小时" + m + "分钟"
            };
            var html = template('monthReportTpl', res);
            //重新渲染列表时，根据显示列选择与否来现实或者隐藏月报表的内容
            $('.month').html(html);
            $('.showWhat .filterItem').find('li').each(function (index, item) {
                var cls = $(this).attr('data-class');
                if (!$(this).hasClass('active')) {
                    $('.month .layui-table').find('.' + cls).css({'min-width': '0', 'transition': 'min-width 0s', 'font-size': '0'}).hide()
                } else {
                    $('.month .layui-table').find('.' + cls).show().css({'min-width': '100px', 'transition': 'all 0s', 'font-size': '14px'})
                }
            });
            defer.resolve(res)
        });
        return defer.promise()
    }

    //获取考勤日统计
    function getDayReport() {
        var defer = $.Deferred();
        var time = $.trim($('#dateDay').val());
        var shopId = $.trim($('#shopSelect').val());
        var shopName = $('#shopSelect :selected').text();
        var userIds = [];
        var date = (time + " " + "星期" + CineseWeek(new Date(time).getDay())).substring(2);
        // if (selUserIds) {
        //     userIds = selUserIds
        // } else {
        //     waiterList.forEach(function (item, index) {
        //         userIds.push(item.userId)
        //     });
        // }
        if (selectedWaiterList.length === 0) {
            waiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        } else {
            selectedWaiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        }
        var params = {
            "time": time,
            "shopId": shopId,
            // "shopId": 110,
            "userId": backUserId,
            "userIds": userIds,
            "type": "1"
        };
        reqAjaxAsync(REQUIRE_URL['dayReport'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            res.shopName = shopName;
            res.date = date;
            var html = template('dayReportTpl', res);
            $('.day').html(html);
            defer.resolve(res);
        });
        return defer.promise()
    }

    //获取数据统计
    function getDataReport() {
        var defer = $.Deferred();
        var shopId = $.trim($('#shopSelect').val());
        var startTime = $.trim($('#dateRange').val().split('~')[0]);
        var endTime = $.trim($('#dateRange').val().split('~')[1]);
        var shopName = $.trim($('#shopSelect :selected').text());
        var userIds = [];
        // if (selUserIds) {
        //     userIds = selUserIds
        // } else {
        //     waiterList.forEach(function (item, index) {
        //         userIds.push(item.userId)
        //     })
        // }
        if (selectedWaiterList.length === 0) {
            waiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        } else {
            selectedWaiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        }
        var params = {
            "shopId": shopId,
            "startTime": startTime + " 00:00:00",
            "endTime": endTime + " 23:59:59",
            "userIds": userIds,
        };
        reqAjaxAsync("userWork/selectDataRecord", JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            res.shopName = shopName;
            res.calendar = calenderWeek(startTime, endTime);
            template.defaults.imports.workTimeFormat = function (time) {
                var h = Math.floor(time / 60);
                var m = time % 60;
                return h + "小时" + m + "分钟"
            };
            var html = template('dataReportTpl', res);
            //重新渲染列表时，根据显示列选择与否来现实或者隐藏月报表的内容

            $('.data').html(html);
        });
        return defer.promise()
    };

    //获取打卡时间统计
    function getTimeReport() {
        var defer = $.Deferred();
        var shopId = $.trim($('#shopSelect').val());
        var startTime = $.trim($('#dateRange').val().split('~')[0]);
        var endTime = $.trim($('#dateRange').val().split('~')[1]);
        var shopName = $.trim($('#shopSelect :selected').text());
        var userIds = [];
        // if (selUserIds) {
        //     userIds = selUserIds
        // } else {
        //     waiterList.forEach(function (item, index) {
        //         userIds.push(item.userId)
        //     })
        // }
        if (selectedWaiterList.length === 0) {
            waiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        } else {
            selectedWaiterList.forEach(function (item, index) {
                userIds.push(item.userId)
            })
        }
        var params = {
            "shopId": shopId,
            // "shopId": 110,
            "startTime": startTime + " 00:00:00",
            "endTime": endTime + " 23:59:59",
            "userIds": userIds
        };
        reqAjaxAsync(REQUIRE_URL['timeReport'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            res.calendar = calenderWeek(startTime, endTime);
            res.shopName = shopName;
            var html = template('timeReportTpl', res);
            $('.time').html(html);
            defer.resolve(res);
        });
        return defer.promise()
    }

    //获取某天打卡详情
    function getAttendanceDetail(_this) {
        var defer = $.Deferred();
        var shopId = $.trim($('#shopSelect').val());
        var userId = $(_this).siblings('.userName').attr('data-userId');
        var timeObj = JSON.parse($(_this).attr('data-time'));
        var time = timeObj.year + '-' + timeObj.moth + '-' + (timeObj.day < 10 ? ("0" + timeObj.day) : timeObj.day);
        var week = timeObj.week;
        var params = {
            "time": time + " 00:00:00",
            "shopId": shopId,
            "userId": userId,
            "type": "3"
            // "time": "2018-05-24 00:00:00",
            // "shopId": "665",
            // "userId": "11201",
            // "type": "3"
        };
        reqAjaxAsync(REQUIRE_URL['detail'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5});
                return
            }
            var obj = {};
            var start;
            var end;
            var startTime;//规定考勤上班时间
            var endTime;//规定考勤下班时间
            var sAddr;//上班考勤地址
            var eAddr;//下班考勤地址
            var userName;//用户名称
            var date = time + " " + "星期" + week;//当天日期和星期
            var sWork;//上班打卡时间
            var eWork;//下班打卡时间
            var sPic;//上班图片
            var ePic;//下班图片
            var sRemark;//上班备注
            var eRemark;//下班备注
            var sStatus;//上班结果
            var eStatus;//下班结果
            var workLength;//工作时长
            if ((res.data.startInfo.length !== 0 && res.data.startInfo[0].id) && (res.data.endInfo.length === 0 || !res.data.endInfo[0].id)) {
                //无下班打卡时间
                start = res.data.startInfo[0];
                startTime = start.scWorkGrade.startTime.substr(0, 5);
                sAddr = start.scWorkDeploys.remark1;
                sPic = start.workPicurl;
                sRemark = start.workRemark;
                sWork = start.workTime.substr(11, 5);
                sStatus = sBetween(startTime, sWork);
                userName = start.userName;
                obj = {
                    startInfo: {
                        startTime: startTime,
                        addr: sAddr,
                        sWork: sWork,
                        sPic: sPic,
                        sRemark: sRemark,
                        sStatus: sStatus
                    },
                    endInfo: '',
                    userName: userName,
                    date: date
                };
            } else if (res.data.startInfo.length !== 0 && res.data.endInfo.length !== 0 && res.data.startInfo[0].id && res.data.endInfo[0].id) {
                // 上班打卡时间和下班打卡时间都有
                start = res.data.startInfo[0];
                end = res.data.endInfo[0];
                startTime = start.scWorkGrade.startTime.substr(0, 5);//规定考勤上班时间
                endTime = end.scWorkGrade.endTime.substr(0, 5);//规定考勤下班时间
                sAddr = start.scWorkDeploys.remark1;//上班考勤地址
                eAddr = end.scWorkDeploys.remark1;//下班考勤地址
                userName = start.userName;//用户名称
                date = time + " " + "星期" + week;//当天日期和星期
                sWork = start.workTime.substr(11, 5);//上班打卡时间
                eWork = end.workTime.substr(11, 5);//下班打卡时间
                sPic = start.workPicurl;//上班图片
                ePic = end.workPicurl;//下班图片
                sRemark = start.workRemark;//上班备注
                eRemark = end.workRemark;//下班备注
                sStatus = sBetween(startTime, sWork);
                eStatus = eBetween(endTime, eWork);
                workLength = between(time + ' ' + sWork, time + ' ' + eWork);
                obj = {
                    startInfo: {
                        startTime: startTime,
                        addr: sAddr,
                        sWork: sWork,
                        sPic: sPic,
                        sRemark: sRemark,
                        sStatus: sStatus
                    },
                    endInfo: {
                        endTime: endTime,
                        addr: eAddr,
                        eWork: eWork,
                        ePic: ePic,
                        eRemark: eRemark,
                        eStatus: eStatus
                    },
                    userName: userName,
                    date: date,
                    workLength: workLength
                };
            } else if ((res.data.startInfo.length === 0 || !res.data.startInfo[0].id) && (res.data.endInfo.length === 0 || !res.data.endInfo[0].id)) {
                // 上班打卡时间和下班打卡时间都没有
                obj = ''
            } else if ((res.data.startInfo.length === 0 || !res.data.startInfo[0].id) && (res.data.endInfo.length !== 0 && res.data.endInfo[0].id)){
                // 无上班打卡时间
                // obj = ''
                end = res.data.endInfo[0];
                endTime = end.scWorkGrade.endTime.substr(0, 5);
                eAddr = end.scWorkDeploys.remark1;
                ePic = end.workPicurl;
                eRemark = end.workRemark;
                eWork = end.workTime.substr(11, 5);
                eStatus = eBetween(endTime, eWork);
                userName = end.userName;
                obj = {
                    endInfo: {
                        endTime: endTime,
                        addr: eAddr,
                        eWork: eWork,
                        ePic: ePic,
                        eRemark: eRemark,
                        eStatus: eStatus
                    },
                    startInfo: '',
                    userName: userName,
                    date: date
                };
            }
            defer.resolve(obj)
        });
        return defer.promise()
    }

    //查看考勤人员异常次数汇总
    $('#reportContent').on('click', '.month .abnormal', function () {
        var data = JSON.parse($(this).attr('data-list'));
        var userName = $(this).attr('data-name');
        var timeRange = $.trim($('#dateRange').val());
        var type;
        if ($(this).hasClass('lateDuration')) {
            type = '迟到'
        } else if ($(this).hasClass('LeaveEarlyDuration')) {
            type = '早退'
        } else if ($(this).hasClass('non-workDuration')) {
            type = '缺卡'
        }
        var obj = {
            userName: userName,
            data: data,
            timeRange: timeRange,
            type: type
        };
        var html = template('lateTotalTpl', obj);
        layer.open({
            type: 1,
            title: '',
            area: ['800px', '220px'],
            content: html,
            closeBtn: 0,
            offset: "180px",
            shadeClose: true,
            shade: 0.5,
            skin: 'lateTotal'
        })
    });

    //查看考勤详情
    $('#reportContent').on('click', '.month .attendanceDetailBtn', function () {
        var _this = this;
        getAttendanceDetail(_this).done(function (data) {
            if (data === '') {
                layer.alert('当天没有考勤信息');
                return
            }
            var html = template('attendanceDetailTpl', data);
            layer.open({
                type: 1,
                title: '',
                content: html,
                area: ["800px", "280px"],
                closeBtn: 0,
                offset: "180px",
                shadeClose: true,
                shade: 0.5,
                skin: 'attendanceDetail',
                success: function (layeror, index) {
                    $(layeror).on('click', '.closeBtn', function () {
                        layer.close(index)
                    })
                }
            })
        });
    });
    init();

    function init() {
        $('#shopSelect').select2({language: "zh-CN"});
        //初始化时间范围选择
        laydate.render({
            elem: '#dateRange',
            range: "~",
            max: new Date().getTime(),
            value: getNowDays()[0] + " ~ " + getNowDays()[1],
            change: function (value, date, endDate) {
                if (date.month !== endDate.month) {
                    layer.alert("时间范围不能跨月", {icon: 2, zIndex: 66666667})
                }
            },
            done: function (value, date, endDate) {
                var cls = $('.tabNav .active').attr('data-class');
                var selUserIds = [];
                if (selectedWaiterList.length === 0) {
                    waiterList.forEach(function (item, index) {
                        selUserIds.push(item.userId);
                    })
                } else {
                    selectedWaiterList.forEach(function (item, index) {
                        selUserIds.push(item.userId);
                    })
                }
                if (cls === 'month') {
                    setTimeout(function () {
                        getMonthReport(selUserIds)
                        // getMonthReport(["10524","10282"])
                    }, 0)
                } else if (cls === 'time') {
                    setTimeout(function () {
                        getTimeReport(selUserIds)
                        // getTimeReport(["10524","10282"])
                    }, 0);
                }
            }
        });
        //初始化日期选择
        laydate.render({
            elem: '#dateDay',
            range: false,
            value: new Date(),
            max: new Date().getTime(),
            btns: ['now'],
            done: function (val, date) {
                console.log(val);
                console.log(selectedWaiterList);
                var selUserIds = [];
                if (selectedWaiterList.length > 0) {
                    selectedWaiterList.forEach(function (item, index) {
                        selUserIds.push(item.userId)
                    })
                } else {
                    waiterList.forEach(function (item, index) {
                        selUserIds.push(item.userId)
                    })
                }
                // getDayReport(["10524","10282"])
                getDayReport(selUserIds)
            }
        });
        //获取店铺列表，考勤人员列表
        getShopList().done(function () {
            getWaiterList().done(function () {
                getMonthReport()
            })
        });
    }

    //计算考勤时间时间差
    function sBetween(ss, se) {
        var sH = ss.split(':')[0];
        var sM = ss.split(':')[1];
        var eH = se.split(':')[0];
        var eM = se.split(':')[1];
        var status;
        if (eH < sH) {
            status = 0
        } else if (eH === sH && eM <= sM) {
            status = 0
        } else if (eH > sH && eM >= sM) {
            status = ((eH - sH) * 60) + (eM - sM)
        } else if (eH > sH && eM < sM) {
            status = ((eH - sH) * 60) - (sM - eM)
        } else if (eH === sH && eM > sM) {
            status = eM - sM
        }
        return status
    }

    function eBetween(xs, xe) {
        var sH = xs.split(':')[0];
        var sM = xs.split(':')[1];
        var eH = xe.split(':')[0];
        var eM = xe.split(':')[1];
        var status;
        if (eH > sH) {
            status = 0
        } else if (eH === sH && eM >= sM) {
            status = 0
        } else if (eH < sH && eM >= sM) {
            status = (sH - eH) * 60 - (eM - sM)
        } else if (eH < sH && eM < sM) {
            status = (sH - eH) * 60 + (sM - eM)
        } else if (eH === sH && eM < sM) {
            status = sM - eM
        }
        return status
    }
});

