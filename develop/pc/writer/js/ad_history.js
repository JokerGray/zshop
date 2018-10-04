var layer = layui.layer,
    laypage = layui.laypage,
    laydate = layui.laydate,
    laytpl = layui.laytpl,
    userId = localStorage.getItem('userId'),
    isM = localStorage.getItem('isM'),
    scCmsAdvType = 0,
    platForm = 1003;
if (isM == 2) {
    platForm = 1002;
}
// 获取为自营页面还是投放页面
var adArr = window.location.href.split('/');
var hrefSplit = adArr[adArr.length - 1];
if (hrefSplit == 'self_adHistory.html') { //自营
    scCmsAdvType = 1;
} else if (hrefSplit == 'ad_history.html') { //非自营
    scCmsAdvType = 0;
}

function adHistoryFunc() {
    this.rows = 10;
    this.pages = 1;
    this.costPage = 1;
    this.url = {
        getAdInfo: 'cms_new/putHistoryScCmsAdvIndex',
        getAdList: 'cms_new/putHistoryScCmsAdv',
        advDetails: 'cms_new/detailsScCmsAdv',
        delAdv: 'cms_new/operationScCmsAdv'
    }
    this.adInfoData = {
        scCmsAdvRelease: userId,
        scCmsAdvPlatForm: platForm,
        scCmsAdvType: scCmsAdvType
    }
    this.adList = {
        scCmsAdvRelease: userId,
        scCmsAdvPlatForm: platForm,
        scCmsAdvType: scCmsAdvType,
        page: 1,
        rows: this.rows
    }
    this.costList = {
        userId: userId,
        pageNo: 1,
        pageSize: this.rows
    }
}
adHistoryFunc.prototype = {
    getAdInfo: function() {
        reqAjaxAsync(this.url.getAdInfo, JSON.stringify(this.adInfoData)).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                var data = res.data || '';
                if (!isNull(data)) {
                    var adPosition = '<option value="">请选择</option>';
                    for (var i = 0; i < data.advPlaces.length; i++) {
                        adPosition += '<option value="' + data.advPlaces[i].scCmsAdvPlaceId + '">' + data.advPlaces[i].scCmsAdvPlaceName + '</option>';
                    }
                    var obj = {
                        advertisingSpSel: adPosition,
                        // advertisingSoSel: adSource,
                        advertNum: data.advNumber || '0',
                        adShowNum: data.advShowNumber || '0',
                        adClickNum: data.advClickNumber || '0'
                    };
                    for (var key in obj) {
                        $("#" + key).html(obj[key]);
                    }
                }
            }

        })
    },
    getAdList: function(d, flag) {
        var _this = this;
        reqAjaxAsync(this.url.getAdList, JSON.stringify(d)).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                var data = res.data.advTables || '';
                var total = res.data.total;
                if (!isNull(data)) {
                    var getTpl = $("#adList").html();
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages > 1 ? $('#page').show() : $('#page').hide();
                    laytpl(getTpl).render(data, function(html) {
                        $("#advertiseTabBody").html(html);
                    });
                    return flag ? _this.getPage(_this.pages, d) : false;
                } else {
                    $("#advertiseTabBody").html('');
                    $('#page').hide();
                }
            }
        });
    },
    getPage: function(pages, d) { //获取分页
        var _this = this;
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.page = obj.curr;
                _this.getAdList(d, false);
            }
        });
    }
}
$(function() {
    //禁止在input中输入空格
    inhibitTrim('#start');
    inhibitTrim('#end');
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
    var adHistory = new adHistoryFunc();
    adHistory.getAdInfo();
    adHistory.getAdList(adHistory.adList, true);
    //搜索按钮调用列表
    $('#search_icon').click(function() {
        var type = $('#tabinner li.active').attr('type');
        var data = {
            scCmsAdvRelease: userId,
            scCmsAdvPlatForm: platForm,
            scCmsAdvType: scCmsAdvType,
            scCmsAdvState: $('#tabinner li.active').attr('type'),
            scCmsAdvPlaceId: $('#advertisingSpSel').val(),
            scCmsAdvStart: isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
            scCmsAdvEnd: isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
            scCmsAdvExamine: '',
            page: 1,
            rows: adHistory.rows
        }
        adHistory.getAdList(switchTab(type, data), true);
    })
    //切换列表tab栏
    $('#tabinner li').click(function() {
            $('#tabinner li').removeClass('active');
            $(this).addClass('active');
            var type = $(this).attr('type'),
                data = {
                    scCmsAdvRelease: userId,
                    scCmsAdvPlatForm: platForm,
                    scCmsAdvType: scCmsAdvType,
                    scCmsAdvPlaceId: $('#advertisingSpSel').val(),
                    scCmsAdvStart: isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
                    scCmsAdvEnd: isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
                    scCmsAdvExamine: '',
                    scCmsAdvState: type,
                    page: 1,
                    rows: adHistory.rows
                }
            adHistory.getAdList(switchTab(type, data), true);
        })
        //点击查看详情弹窗
    $('#advertiseTabBody').on('click', '.checkBtn', function() {
            var _this = this,
                advId = $(this).parent().parent().attr('advId'),
                scCmsAdvState = $(this).siblings('.isPutawayBtn').html();
            $('#advertiseDBtnBox').attr('advId', advId);
            var operateBtnHtml = $(this).siblings('.operateBtn').html();
            if (operateBtnHtml != '上架' && operateBtnHtml != '下架') {
                $('#putawayBtn').hide();
            } else {
                $('#putawayBtn').show();
                var scCmsAdvState = $(this).siblings('.isPutawayBtn').html();
                if (scCmsAdvState == '上架') {
                    $('#putawayBtn').html('上架').addClass('active').attr('scCmsAdvState', 1)
                }
                if (scCmsAdvState == '下架') {
                    $('#putawayBtn').html('下架').removeClass('active').attr('scCmsAdvState', 2)
                }
            }
            reqAjaxAsync(adHistory.url.advDetails, JSON.stringify({
                scCmsAdvId: advId
            })).done(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg)
                };
                if (res.code == 1) {
                    // var data = res.data.cmsAdv || '';
                    var data = res.data;
                    if (!isNull(data)) {
                        var obj = {
                            adDConPosition: data.cmsAdv.advPlace.scCmsAdvPlaceName,
                            adDConIsPutaway: $(_this).parent().siblings('.checkStatus').find('span').html(),
                            adDConShowNum: $(_this).attr('adShowNum'),
                            adDConClickNum: $(_this).attr('adClickNum'),
                            adDConSource: data.cmsAdv.advSource.scCmsAdvSourceName,
                            adDConType: $(_this).parent().siblings('.adSource').html(),
                            adDConTime: (data.cmsAdv.scCmsAdvStart).replace('.0', '') + '~' + (data.cmsAdv.scCmsAdvEnd).replace('.0', ''),
                            adDConTagList: data.cmsAdv.scCmsAdvLable,
                            adDConCreateTime: data.cmsAdv.scCmsAdvCreateTime
                        }
                        if(obj.adDConSource == '外部广告') {
                            obj.adDTypeHref = JSON.parse(data.cmsAdv.scCmsAdvjump)['url'];
                            $('#adDTypeHrefBox').show();
                        } else {
                            $('#adDTypeHrefBox').hide();
                        }
                        for (var key in obj) {
                            $('#' + key).html(obj[key]);
                        }
                        var getTpl = $("#advStyleList").html();
                        laytpl(getTpl).render(data.cmsAdv, function(html) {
                            $("#adDConRight").html(html);
                        });
                    }
                }
            });
        })
        //删除广告
    $('#advertiseTabBody').on('click', '.delBtn', function() {
            var advId = $(this).parent().parent().attr('advId');
            isDelAdv(advId, adHistory);
        })
        //上架下架操作
    $('#advertiseTabBody').on('click', '.isPutawayBtn', function() {
            var scCmsAdvState = $(this).attr('scCmsAdvState'),
                advId = $(this).parent().parent().attr('advId');
            isPutaway(advId, scCmsAdvState, adHistory);
        })
        //弹窗内的上下架按钮
    $('#putawayBtn').click(function() {
            var scCmsAdvState = $(this).attr('scCmsAdvState'),
                advId = $(this).parent().attr('advId');
            isPutaway(advId, scCmsAdvState, adHistory);
        })
        //弹窗内删除按钮
    $('#delBtn').click(function() {
        var advId = $(this).parent().attr('advId');
        isDelAdv(advId, adHistory);
    })

    //重新发布按钮
    $('#advertiseTabBody').on('click', '.rePublish', function() {
        layer.msg('该功能暂未开放');
    })

    function isPutaway(advId, scCmsAdvState, adHistory) {
        layer.confirm(scCmsAdvState == 1 ? '确认上架吗?' : '确认下架吗?', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function(index, layero) {
                reqAjaxAsync(adHistory.url.delAdv, JSON.stringify({
                    scCmsAdvRelease: userId,
                    scCmsAdvId: advId,
                    scCmsAdvState: scCmsAdvState
                })).done(function(res) {
                    layer.msg(res.msg);
                    if (res.code == 1) {
                        var type = $('#tabinner li.active').attr('type');
                        var data = {
                            scCmsAdvRelease: userId,
                            scCmsAdvPlatForm: platForm,
                            scCmsAdvType: scCmsAdvType,
                            scCmsAdvPlaceId: $('#advertisingSpSel').val(),
                            scCmsAdvStart: isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
                            scCmsAdvEnd: isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
                            scCmsAdvState: $('#tabinner li.active').attr('type'),
                            scCmsAdvExamine: '',
                            page: 1,
                            rows: adHistory.rows
                        }
                        adHistory.getAdList(switchTab(type, data), true);
                    }
                });
            }
        });
    }
    
    function isDelAdv(advId, adHistory) {
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function(index, layero) {
                reqAjaxAsync(adHistory.url.delAdv, JSON.stringify({
                    scCmsAdvRelease: userId,
                    scCmsAdvId: advId,
                    scCmsAdvIsdel: 1
                })).done(function(res) {
                    if (res.code == 1) {
                        layer.msg('删除成功');
                        var type = $('#tabinner li.active').attr('type');
                        var data = {
                            scCmsAdvRelease: userId,
                            scCmsAdvPlatForm: platForm,
                            scCmsAdvPlaceId: $('#advertisingSpSel').val(),
                            scCmsAdvStart: isNull($('#start').val()) ? '' : $('#start').val() + ' 00:00:00',
                            scCmsAdvEnd: isNull($('#end').val()) ? '' : $('#end').val() + ' 23:59:59',
                            scCmsAdvState: $('#tabinner li.active').attr('type'),
                            scCmsAdvExamine: '',
                            page: 1,
                            rows: adHistory.rows
                        }
                        adHistory.getAdList(switchTab(type, data), true);
                    } else {
                        layer.msg(res.msg);
                    }
                });
            }
        });
    }
})

function switchTab(type, data) {
    switch (type - 0) {
        case '':
            data.scCmsAdvExamine = '', data.scCmsAdvState = '', data.scCmsAdvEnd = '';
            break;
        case 3:
            data.scCmsAdvExamine = '', data.scCmsAdvState = '', data.scCmsAdvEnd = new Date().format('yyyy-MM-dd') + ' 23:59:59';
            break;
        case 4:
            data.scCmsAdvState = '', data.scCmsAdvExamine = 2, data.scCmsAdvEnd = '';
            break;
            // case 5:
            //     data.scCmsAdvState = '', data.scCmsAdvExamine = 2, data.scCmsAdvEnd = '';
            //     break;
    }
    return data;
}

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,
       "d+" : this.getDate(),
       "h+" : this.getHours(),
       "m+" : this.getMinutes(),
       "s+" : this.getSeconds(),
       "q+" : Math.floor((this.getMonth()+3)/3),
       "S"  : this.getMilliseconds()
    };
    if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt))fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
   return fmt; 
}