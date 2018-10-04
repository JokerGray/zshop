$(function(){
    var userName = localStorage.getItem('userName') || '';
    //禁止在input中输入空格：
    inhibitTrim('#start');
    inhibitTrim('#unitPriceInp');

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
                if(datas != old) {
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

    //进入页面默认显示昨天总数据：
    action.getTotalData({time: $('#start').val()});

    //进入页面默认显示昨天列表数据：
    action.getAccTable(action.authData, true);

    //修改总数据弹窗操作：
    var oldValue = '';
    $('.modifyTotalPrice').click(function(){
        $('#unitPriceInp').val($(this).parent().find('.gainUnitPrice').html());
        $('#affirmBtn').attr('writerRank', $(this).parent().attr('writerRank'))
        oldValue = $('#unitPriceInp').val();
    })
    $('#affirmBtn').click(function(){
        var _this = this;
        var newValue = $('#unitPriceInp').val();
        if(newValue == oldValue) {
            layer.msg('修改后的单价不能与原来相同');
        } else {
            var data = {
                rankRate: newValue,
                writerRank: $(_this).attr('writerRank')
            }
            reqNewAjaxAsync(action.Request.modifyPrice, data).done(function(res){
                if(res.code == 1) {
                    action.getTotalData({time: $('#start').val()});
                    action.getAccTable(action.authData, true);
                    oldValue = $('#unitPriceInp').val();
                } else {
                    layer.msg(res.msg);
                }
            })
        }
    })
    $('#unitPriceInp').keydown(function(e){
        e = e || window.event;
        if(e.keyCode == 13) {
            $('#affirmBtn').click()
        }
    })

    $('.tabinner li').click(function(){
        $('#start').val() ? action.authData.time = $('#start').val() : (action.authData.time = yesterday) && ($('#start').val(yesterday));
        action.authData.pagination.page = 1;
        action.authData.writerRank = $(this).attr('writerRank');
        action.getAccTable(action.authData, true);
    })

    //点击导出Excel按钮导出表格：
    $('#exportExcel').click(function(){
        console.log(action.authData)
        window.location.href = '/zxcity-cms-new-ms/newms/' + action.Request.exportExcel + '?data=' + JSON.stringify(action.authData);
    })

    //点击作家列表查看按钮的操作：
    $('#gainsTabBody').on('click', '.gainsTabBtn', function(){
        $('#freezeAcc').attr('userId', $(this).parent().parent().attr('userId'));
        $('.authorNameCon').html($(this).parent().siblings('.subcriptName').html());
        $('.authorNameType').html($(this).parent().siblings('.subcriptNameType').html());
        $('.authorDateCon').html($('#start').val())
        action.artData.userId = $(this).parent().parent().attr('userId');
        action.artData.pagination.page = 1;
        action.getArtTable(action.artData, true);
    })

    //作家列表中的冻结
    $('#gainsTabBody').on('click', '.gainsTabFreeze', function(){
        var userId = $(this).parent().parent().attr('userId');
        freeze(userId, action);
    })
    //文章弹窗中的冻结：
    $('#freezeAcc').click(function(){
        var userId = $(this).attr('userId');
        freeze(userId, action);
    })

    //点击发布按钮：
    $('#publishAccount').click(function(){
        $('.pubNameCon').html(userName)
        $('.pubDateCon').html($('#start').val())
        $('#pubGeneMoney').html($('#generalMoney').html());
        $('#pubGeneUnitPri').html($('#geneUnitPri').html());
        $('#pubOriginMoney').html($('#originalMoney').html());
        $('#pubOriUnitPri').html($('#originUnitPri').html());
        $('#pubVIPMoney').html($('#VIPMoney').html());
        $('#pubVIPUnitPri').html($('#VIPUnitPri').html());
        $('#pubSignedMoney').html($('#signedMoney').html());
        $('#pubSignedUnitPri').html($('#signedUnitPri').html());
        $('#pubAuthorTotM').html($('#authorTotalMoney').html());
    })
    //点击确认发布按钮：
    $('#publishBtn').click(function(){
        var data = {
            time: yesterday
        }
        reqNewAjaxAsync(action.Request.publish, data).done(function(res){
            if(res.code == 1) {
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        })
    })
    //点击文章标题。跳转至文章详情页面：
    $('#artTabBody').on('click', '.articleTitle', function(){
        var userId = $(this).attr('userId');
        var articleId = $(this).attr('articleId');
        var artHref = '/articleDetail.html?userId=' + userId + '&articleId=' + articleId;
        $(this).attr('href', artHref);
    })
})

var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
$.extend({
    platform: function(){
        this.rows = 5;
        this.accPages = 1;
        this.artPages = 1;
        this.authData = {
            time: $('#start').val(),
            isExamine: 1,
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
            getTotalData: 'IncomAuditRank',            
            exportExcel: 'IncomeAuditControllerExl',
            getAccTable: 'IncomeAuditController',
            getArtList: 'IncomeOneyAuditController',
            modifyPrice: 'updateRank',
            freezeAuthor: 'writeReview',
            publish: 'settlementIncomeController'
        }

    }
});
$.platform.prototype = {
    getTotalData: function(d){
        var _this = this;
        $.when(reqNewAjaxAsync(_this.Request.getTotalData, d).done(function(res){
            if(res.code == 1) {
                var data = res.data || '';
                if(!isNull(data)) {
                    $('#authorTotalMoney').html(data[0].allMoney);
                    $('#generalMoney').html(data[1].money).parent().attr('writerRank', data[1].writerRank);
                    $('#geneUnitPri').html(data[1].rankRate);
                    $('#originalMoney').html(data[2].money).parent().attr('writerRank', data[2].writerRank);
                    $('#originUnitPri').html(data[2].rankRate);
                    $('#VIPMoney').html(data[3].money).parent().attr('writerRank', data[3].writerRank);
                    $('#VIPUnitPri').html(data[3].rankRate);
                    $('#signedMoney').html(data[4].money).parent().attr('writerRank', data[4].writerRank);
                    $('#signedUnitPri').html(data[4].rankRate);
                }
            } else if(res.code == 9) {
                layer.msg(res.msg);
            }
        }));
    },
    getAccTable: function(d, flag){
        var _this = this;
        reqNewAjaxAsync(_this.Request.getAccTable, d).done(function(res){
            if(res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.accPages = Math.ceil(total / _this.rows);
                _this.accPages > 1 ? $('#page').addClass('show').removeClass('hide') : $('#page').addClass('hide').removeClass('show');
                var getTpl = $('#accTableList').html();             
                if(!isNull(data)) {
                    laytpl(getTpl).render(data, function(html){
                        $('#gainsTabBody').html(html);
                    });
                    return flag ? _this.getAccPage(_this.accPages,d) : false;
                } else {
                    $('#gainsTabBody').html('');
                }
            } else if(res.code == 9) {
                layer.msg(res.msg);
            }
        });
    },
    getAccPage: function (pages, d) {              //获取分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getAccTable(d, false);
            }
        });  
    },
    getArtTable: function(d, flag){
        var _this = this;
        $.when(reqNewAjaxAsync(_this.Request.getArtList, d).done(function(res){
            if(res.code == 1) {
                var data = res.data || '';
                var total = res.total || '';
                _this.artPages = Math.ceil(total / _this.rows);
                _this.artPages > 1 ? $('#artPage').addClass('show').removeClass('hide') : $('#artPage').addClass('hide').removeClass('show');
                var getTpl = $('#artTableList').html();             
                if(!isNull(data)) {
                    laytpl(getTpl).render(data, function(html){
                        $('#artTabBody').html(html);
                    });
                    return flag ? _this.getArtPage(_this.artPages, d) : false;
                } else {
                    $('#artTabBody').html('');
                }
            } else if(res.code == 9) {
                layer.msg(res.msg);
            }
        }));
    },
    getArtPage: function (pages, d) {              //获取分页
        var _this = this;
        laypage({
            cont: 'artPage', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getArtTable(d, false);
            }
        });  
    }
}

function freeze(userId, action) {
    var data = {
        userId: userId,
        isExamine: 4
    }
    reqNewAjaxAsync(action.Request.freezeAuthor, data).done(function(res){
        if(res.code == 1) {
            action.authData.writerRank = $('.tabinner li.active').attr('writerRank');
            action.getTotalData({time: $('#start').val()});
            action.getAccTable(action.authData, true);
        } else {
            layer.msg(res.msg);
        }
    })
}