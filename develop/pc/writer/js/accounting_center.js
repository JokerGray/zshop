var laypage = layui.laypage;
var laytpl = layui.laytpl;
var userId = localStorage.getItem('userId') || '';

$(document).ready(function() {
    var data1 = '{"userId": ' + userId + '}';
    var data2 = JSON.stringify(start.pushData);
    start.getData(data1, "lastHoleBalanceSelect", function(data) {
        isApikey(data);
        if (data.code == 1 && !isNull(data.data)) {
            var data = data.data;
            countUp("articlemoney", data[0].settlementAmount || 0);
            $('#articleMonth').html(data[0].lastSettlementTime);
        } else {
            console.log('数据异常');
        }
    });
    start.getData(data1, "balanceSelect", function(data) {
        isApikey(data);
        if (data.code == 1 && !isNull(data.data)) {
            var data = data.data;
            if (data.uppermoney) {
                $('#videomoney').html(data.uppermoney);
            } else if (data.uppermoney == null || data.uppermoney == 'null' || data.uppermoney == undefined || data.uppermoney == '{}') {
                $('#videomoney').html(0);
            }
            if (data.ImmediateMoney) {
                $('#videoMonth').html(data.ImmediateMoney);
            } else if (data.ImmediateMoney == null || data.ImmediateMoney == 'null' || data.ImmediateMoney == undefined || data.ImmediateMoney == '{}') {
                $('#videoMonth').html(0);
            }
        } else {
            console.log('数据异常');
        }
    });

    //提现按钮传数据到后台：
    // $('#withDraw_btn button').click(function() {
    //     console.log('传输数据');
    //     start.getData(data1, "settlementInsert", function(data) {
    //         isApikey(data);
    //         $('#videomoney').html(0);
    //         if(data.code == 1 && !isNull(data.data)) {
    //             console.log(data);
    //             if(data.data == null || data.data == 'null' || data.data == undefined) {
    //                 $('#videomoney').html(0);
    //             }
    //         } else {
    //             console.log('数据异常');
    //             // $('#videomoney').html(0);
    //         }
    //     });
    // })

    start.getData(data1, "totalAmount", function(data) {
        isApikey(data);
        if (data.code == 1 && !isNull(data.data)) {
            var data = data.data;
            // $('#totalAmount').html(data);
            countUp("totalAmount", data || 0);
        } else {
            console.log('数据异常');
        }
    });
    start.getList('cms_new/settlementSelect');

    //查看详情：
    $('#statement_con').on('click', '.listDetail', function() {
        $('.listFirst').html($(this).parent().find('td:nth-child(2)').text());
        $('.listSecond').html($(this).parent().find('td:nth-child(6)').html());
        // $('.listThird').html(0);
        $('.listFouth').html($(this).parent().find('td:nth-child(3)').html());
        $('.listFifth').html($(this).parent().find('td:nth-child(4)').html());
        $('.listSix').html($(this).parent().find('td:nth-child(5)').html());

    });

})
var start = {
    apikey: localStorage.getItem('apikey') || "",
    version: localStorage.getItem('version') || "1",
    rows: 8,
    page: 1,
    pages: 1,
    getData: function(data, cmd, callback) {
        $.ajax({
            type: 'POST',
            url: '/zxcity_restful/ws/rest',
            data: {
                cmd: "cms_new/" + cmd,
                version: start.version,
                "data": data
            },
            beforeSend: function(request) {
                // layer.load(0, { shade: [0.1, '#fff'] });
                request.setRequestHeader("apikey", start.apikey);
            },
            success: callback,
            error: function() {
                console.log('ajax-error');
            }
        });
    },
    getList: function(cmd) {
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            data: {
                cmd: cmd,
                version: start.version,
                "data": JSON.stringify({
                    userId: userId,
                    pagination: {
                        page: start.page,
                        rows: start.rows
                    }
                })
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", apikey);
            },
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    console.log(data)
                    var data = data.data;
                    var getTpl = $("#noticeList").html();
                    if (!isNull(data.list)) {
                        laytpl(getTpl).render(data.list, function(html) {
                            $("#statement_con").html(html);
                            var createTime = $('.createTime').html();
                            $('.createTime').html(createTime.split(' ')[0]);

                            var lastTime = $('.lastTime').html();
                            $('.lastTime').html(lastTime.split(' ')[0]);

                            var state = $('.settlementState');
                            if (state.attr('state') == 0) {
                                state.html('待打款');
                            } else if (state.attr('state') == 1) {
                                state.html('提现成功');
                            } else if (state.attr('state') == 2) {
                                state.html('打款失败');
                            } else if (state.attr('state') == 3) {
                                state.html('冻结');
                            }
                        });
                    } else {
                        console.log('暂无数据');
                    }

                    //获取总页数
                    start.pages = Math.ceil(data.Total / start.rows);
                    start.getPage(start.pages);

                } else {
                    console.log('数据异常');
                }
            },
            error: function() {
                console.log("ajax-error");
            }
        });
    },
    getListPage: function(cmd, page) {
        $.ajax({
            type: "POST",
            url: "/zxcity_restful/ws/rest",
            data: {
                cmd: cmd,
                version: start.version,
                "data": JSON.stringify({
                    userId: userId,
                    pagination: {
                        page: page,
                        rows: start.rows
                    }
                })
            },
            beforeSend: function(request) {
                // layer.load(0, { shade: [0.1, '#fff'] });
                request.setRequestHeader("apikey", apikey);
            },
            dataType: "json",
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    var data = data.data;
                    var getTpl = $("#noticeList").html();
                    if (!isNull(data.list)) {
                        laytpl(getTpl).render(data.list, function(html) {
                            $("#statement_con").html(html);
                            var createTime = $('.createTime').html();
                            $('.createTime').html(createTime.split(' ')[0]);
                            var lastTime = $('.lastTime').html();
                            $('.lastTime').html(lastTime.split(' ')[0]);
                            var state = $('.settlementState');
                            if (state.attr('state') == 0) {
                                state.html('待打款');
                            } else if (state.attr('state') == 1) {
                                state.html('提现成功');
                            } else if (state.attr('state') == 2) {
                                state.html('打款失败');
                            } else if (state.attr('state') == 3) {
                                state.html('冻结');
                            }
                        });
                    } else {
                        console.log('暂无数据');
                    }
                } else {
                    console.log('数据异常');
                }
            },
            error: function() {
                console.log("ajax-error");
            }
        });
    },
    getPage: function(pages) { //调用分页 
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#f6623f',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                start.getListPage("cms_new/settlementSelect", obj.curr);
            }
        });
    }
}