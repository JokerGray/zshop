var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
var start = {
    apikey: localStorage.getItem('apikey') || "",
    version: localStorage.getItem('version') || "1",
    userId: localStorage.getItem('userId') || "",
    rows: 5,
    page: 1,
    pages: 1,
    getDataAjax: function() {
        $.ajax({
            type: 'POST',
            url: '/zxcity_restful/ws/rest',
            data: {
                cmd: "cms_new/queryLastIncome",
                version: start.version,
                "data": '{"userId": ' + start.userId + '}'
            },
            beforeSend: function(request) {
                // layer.load(0, { shade: [0.1, '#fff'] });
                request.setRequestHeader("apikey", start.apikey);
            },
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    var data = data.data;
                    console.log(data);
                    $('#articlemoney').html(data[0].articlemoney);
                    $('#articleMonth').html(data[0].articleMonth);
                    $('#videomoney').html(data[0].videomoney);
                    $('#videoMonth').html(data[0].videoMonth);
                    $('#yesterAdmire').html(0);
                    $('#thisMouth > span').html(0);

                } else {
                    console.log('数据异常');
                }
            },
            error: function() {
                console.log('ajax-error');
            }
        });
    },
    getTabelAjax: function(page, day, endTime) {
        var _this = this;
        var tabelData = {
            userId: start.userId,
            startTime: day || "",
            endTime: endTime || "",
            pagination: {
                page: page,
                rows: start.rows
            }
        }
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            data: {
                cmd: "cms_new/queryLastDayIncome",
                version: version,
                "data": JSON.stringify(tabelData)
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(data) {
                isApikey(data);
                console.log(data);
                if (data.code == 1 && !isNull(data.data)) {
                    var data = data.data;
                    var getTpl = $("#noticeList").html();
                    if (!isNull(data.list)) {
                        laytpl(getTpl).render(data.list, function(html) {
                            $("#tbody").html(html);
                        });
                    } else {
                        console.log('数据为空');
                    }

                    //获取总页数
                    start.pages = Math.ceil(data.Total / start.rows);
                    start.getPage(start.pages, day, endTime);
                } else {
                    console.log("数据为空");
                }
            },
            error: function() {
                console.log("ajax-error");
            }
        });
    },
    getListAjax: function(page, day, endTime) {
        var _this = this;
        var tabelData = {
            userId: start.userId,
            // userId: start.userId,
            startTime: day || "",
            endTime: endTime || "",
            pagination: {
                page: page,
                rows: start.rows
            }
        }
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            data: {
                cmd: "cms_new/queryLastDayIncome",
                version: version,
                "data": JSON.stringify(tabelData)
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(data) {
                isApikey(data);
                console.log(data);
                if (data.code == 1 && !isNull(data.data)) {
                    var data = data.data;
                    var getTpl = $("#noticeList").html();
                    if (!isNull(data.list)) {
                        laytpl(getTpl).render(data.list, function(html) {
                            $("#tbody").html(html);
                        });
                    } else {
                        console.log("数据为空");
                    }

                } else {
                    console.log("数据为空");
                }
            },
            error: function() {
                console.log("ajax-error");
            }
        });
    },
    getPage: function(pages, day, endTime) {
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.getListAjax(obj.curr, day, endTime);
            }
        });
    },
    format: function(d, fmt) {
        if (!fmt) fmt = 'yyyy-MM-dd'
        var date = new Date(d)
        if (date === 'Invalid Date') return ''
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt;
    }
};

$(function() {
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var startDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                endDate.start = datas //将结束日的初始值设定为开始日
                if (!isNull($("#end").text())) {
                    start.getTabelAjax(start.page, datas, $("#end").text());
                }
            }
        };

        var endDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function(datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                if (!isNull($("#start").text())) {
                    start.getTabelAjax(start.page, $("#start").text(), datas);
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

    //调用上半部分数据：
    start.getDataAjax();

    //下半部分表格默认显示昨天数据：
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var yesterday = start.format(today);
    start.getTabelAjax(start.page, yesterday, yesterday);

    var nowDate = start.format(new Date());
    var beforeDate;
    $('#searchDay30').click(function() {
        beforeDate = start.format((new Date()).setDate((new Date()).getDate() - 30));
        console.log(beforeDate);
        start.getTabelAjax(start.page, beforeDate, nowDate);
        // start.getPage(start.pages, beforeDate, nowDate);
    })

    $('#searchDay14').click(function() {
        start.getPage(start.pages);
        beforeDate = start.format((new Date()).setDate((new Date()).getDate() - 14));
        console.log(beforeDate);
        start.getTabelAjax(start.page, beforeDate, nowDate);
        // start.getPage(start.pages, beforeDate, nowDate);
    })

    $('#searchDay7').click(function() {
        start.getPage(start.pages);
        beforeDate = start.format((new Date()).setDate((new Date()).getDate() - 7));
        console.log(beforeDate);
        start.getTabelAjax(start.page, beforeDate, nowDate);
        // start.getPage(start.pages, beforeDate, nowDate);
    })

});