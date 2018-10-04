var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
$.extend({
    platform: function () {
        this.rows = 5;
        this.accPages = 1;
        this.artPages = 1;
        this.authData = {
            time: $('#start').val(),
            isExamine: 5,
            writerRank: '',
            pagination: {
                page: 1,
                rows: 5
            }
        };
        this.artData = {
            visitTime: $('#start').val(),
            userId: 0,
            pagination: {
                page: 1,
                rows: 5
            }
        };
        this.Request = {
            exportExcel: 'IncomeAuditControllerExl',
            getAccTable: 'IncomeAuditController',
            freezeAuthor: 'writeReview',
            getArtList: 'IncomeOneyAuditController'
        }
    }
});
$.platform.prototype = {
    getAccTable: function (d) {
        var _this = this;
        reqNewAjaxAsync(_this.Request.getAccTable, d).done(function (res) {
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.accPages = Math.ceil(total / _this.rows);
                var getTpl = $('#accTableList').html();
                if (!isNull(data)) {
                    laytpl(getTpl).render(data, function (html) {
                        $('#gainsTabBody').html(html);
                    });
                    _this.getAccPage(_this.accPages, d);
                } else {
                    $('#gainsTabBody').html('');
                }
            } else if (res.code == 9) {
                layer.msg(res.msg);
            }
        });
    },
    getAccTablePage: function (d) {
        var _this = this;
        reqNewAjaxAsync(_this.Request.getAccTable, d).done(function (res) {
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.accPages = Math.ceil(total / _this.rows);
                var getTpl = $('#accTableList').html();
                if (!isNull(data)) {
                    laytpl(getTpl).render(data, function (html) {
                        $('#gainsTabBody').html(html);
                    });
                } else {
                    $('#gainsTabBody').html('');
                }
            } else if (res.code == 9) {
                layer.msg(res.msg);
            }
        });
    },
    //获取分页
    getAccPage: function (pages, d) {
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function (obj) {
                d.pagination.page = obj.curr;
                _this.getAccTablePage(d);
            }
        });
    },
    getArtTable: function (d, flag) {
        var _this = this;
        reqNewAjaxAsync(_this.Request.getArtList, d).done(function (res) {
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.artPages = Math.ceil(total / _this.rows);
                var getTpl = $('#artTableList').html();
                if (!isNull(data)) {
                    laytpl(getTpl).render(data, function (html) {
                        $('#artTabBody').html(html);
                    });
                    _this.getArtPage(_this.artPages, d);
                } else {
                    $('#artTabBody').html('');
                }
            } else if (res.code == 9) {
                layer.msg(res.msg);
            }
        });
    },
    getArtTablePage: function (d) {
        var _this = this;
        reqNewAjaxAsync(_this.Request.getArtList, d).done(function (res) {
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.artPages = Math.ceil(total / _this.rows);
                var getTpl = $('#artTableList').html();
                if (!isNull(data)) {
                    laytpl(getTpl).render(data, function (html) {
                        $('#artTabBody').html(html);
                    });
                } else {
                    $('#artTabBody').html('');
                }
            } else if (res.code == 9) {
                layer.msg(res.msg);
            }
        });
    },
    //获取分页
    getArtPage: function (pages, d) {
        var _this = this;
        laypage({
            cont: 'artPage',
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function (obj) {
                d.pagination.page = obj.curr;
                _this.getArtTablePage(d);
            }
        });
    }
}

$(function () {
    var yesterday = format(new Date().setDate(new Date().getDate() - 1));
    $('#start').val(yesterday);
    //点击日期获取时间
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        var startDate = {
            max: yesterday,
            istoday: false,
            choose: function (datas) {
                var old = action.authData.time;
                start.startTime = datas;
                action.authData.time = datas;
                if (datas != old) {
                    action.getAccTable(action.authData);
                }
            }
        };
        $('#start').click(function () {
            startDate.elem = this;
            laydate(startDate);
        });
    });

    var action = new $.platform();
    //进入页面默认显示昨天列表数据：
    action.getAccTable(action.authData);

    //点击导出Excel按钮导出表格：
    $('#exportExcel').click(function () {
        window.location.href = '/zxcity-cms-new-ms/newms/' + action.Request.exportExcel + '?data=' + JSON.stringify(action.authData);
    });

    // 切换导航
    $('.tabinner li').click(function () {
        if (isNull($('#start').val())) {
            $('#start').val(yesterday);
        }
        action.authData.time = $("#start").val();
        action.authData.writerRank = $(this).attr('writerRank');
        action.authData.pagination.page = 1;
        action.getAccTable(action.authData);
        action.getAccPage(1, action.authData);
    });

    //解冻
    $("#gainsTabBody").on('click', '.gainsTabFreeze', function () {
        var userId = $(this).attr("userId");
        black(userId);
    });

    //文章弹窗中的冻结：
    $('#freezeAcc').click(function () {
        var userId = $(this).attr('userId');
        black(userId);
        $("#authAccounts").modal('hide');
    });

    //点击作家列表查看按钮的操作：
    $('#gainsTabBody').on('click', '.gainsTabBtn', function () {
        var userId = $(this).attr('userId');
        $('#freezeAcc,#shieldBtn').attr('userId', userId);
        var subscriptName = $(this).parent().siblings('.subcriptName').html();
        var subcriptNameType = $(this).parent().siblings('.subcriptNameType').html();
        $('.authorNameCon').html(subscriptName);
        $('.authorNameType').html(subcriptNameType);
        $(".authorDateCon").html($("#start").val());
        action.artData.userId = userId;
        action.artData.pagination.page = 1;
        action.getArtTable(action.artData);
    })

    // 封装解除拉黑
    function black(userId) {
        var data = {
            userId: userId,
            isExamine: 1
        }
        reqNewAjaxAsync(action.Request.freezeAuthor, data).done(function (res) {
            if (res.code == 1) {
                layer.msg("解除黑名单成功");
                action.authData.writerRank = $('.tabinner li.active').attr('writerRank');
                action.getAccTable(action.authData);
            } else {
                layer.msg(res.msg);
            }
        })
    }
    // js over
});
