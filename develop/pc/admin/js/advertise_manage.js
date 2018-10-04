var layer = layui.layer,
    laypage = layui.laypage,
    laydate = layui.laydate,
    laytpl = layui.laytpl;

function advertiseFunc() {
    this.rows = 5;
    this.pages = 0;
    this.url = {
        getadverData: 'selectAdvBegins',
        getAdvertSpace: 'selectscCmsAdvStyleName',
        getAdvertiseList: 'selectAdvArrayList',
        isPutaway: 'queryAdvstate',
        getAdStyle: 'selectqueryscCmsAdvStyle'
    }
    this.advertList = {
        scCmsAdvSourceType: '', //广告类型（内部外部）
        scCmsAdvStyleName: '', //广告位名称
        scCmsAdvStart: '', //开始时间
        scCmsAdvEnd: '', //结束时间
        scCmsAdvState: '', //广告状态 1 上架  2下架  3过期
        pagination: {
            page: 1,
            rows: this.rows
        }
    }
}
advertiseFunc.prototype = {
    getadverData: function() { //得到广告数量数据
        reqNewAjaxAsync(this.url.getadverData, {}).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                var data = res.data || '';
                if (!isNull(data)) {
                    $('#advertNum').html(data.advNumber || '0');
                    $('#adShowNum').html(data.scCmsAdvShowId || '0');
                    $('#adClickNum').html(data.scCmsAdv_click_id || '0');
                }
            }
        });
    },
    getAdvertSpace: function() { //搜索下拉框
        reqNewAjaxAsync(this.url.getAdvertSpace, {}).done(function(res) {
            if (res.code == 1) {
                var data = res.data || '';
                if (!isNull(data)) {
                    var str = '';
                    // 我把所有的改成了1001的
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].scCmsAdvPlacePlatForm == "1001") {
                            str += '<option value="' + data[i].scCmsAdvPlaceId + '">' + data[i].scCmsAdvPlaceName + '</option>';
                        }
                    }
                    $('#advertisingSpSel').append(str);
                }
            }
        });
    },
    getAdvertiseList: function(d, flag) { //列表
        var _this = this;
        reqNewAjaxAsync(this.url.getAdvertiseList, d).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                var data = res.data || '';
                var total = res.total;
                if (!isNull(data)) {
                    var getTpl = $("#tableList").html();
                    _this.pages = Math.ceil(total / _this.rows);
                    _this.pages > 1 ? $('#page').addClass('show').removeClass('hide') : $('#page').addClass('hide').removeClass('show');
                    laytpl(getTpl).render(data, function(html) {
                        $("#advertiseTabBody").html(html);
                    });
                    return flag ? _this.getPage(_this.pages, d) : false;
                } else {
                    $("#advertiseTabBody").html('');
                    $('#page').addClass('hide').removeClass('show');
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
                d.pagination.page = obj.curr;
                _this.getAdvertiseList(d, false);
            }
        });
    }
}
$(function() {
    //禁止输入空格
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

    var advertise = new advertiseFunc();
    //获取广告投放数据
    advertise.getadverData();
    //获取广告位下拉框
    advertise.getAdvertSpace();
    //获取广告列表
    advertise.getAdvertiseList(advertise.advertList, true);
    //点击搜索按钮
    $('#searchIcon').click(function() {
            // advertise.advertList.scCmsAdvStyleName = $('#advertisingSpSel').val();
            // advertise.advertList.scCmsAdvSourceType = $('#advertisingSoSel').val();
            if ($('#advertisingSpSel').val() == '') {
                advertise.advertList.scCmsAdvStyleName = '';
            } else {
                advertise.advertList.scCmsAdvStyleName = $('#advertisingSpSel option[value=' + $('#advertisingSpSel').val() + ']')[0].text;
            }
            advertise.advertList.scCmsAdvSourceType = $('#advertisingSoSel').val();
            advertise.advertList.scCmsAdvStart = $('#start').val();
            advertise.advertList.scCmsAdvEnd = $('#end').val();
            advertise.getAdvertiseList(advertise.advertList, true);
        })
        //切换tab栏
    $('#tabinner').on('click', 'li', function() {
            advertise.advertList.scCmsAdvState = $(this).attr('writerRank');
            advertise.advertList.pagination.page = 1;
            advertise.getAdvertiseList(advertise.advertList, true);
        })
        //切换上架下架重新上架
    $("#advertiseTabBody").on('click', '.isPutawayOp', function() {
        var _this = this,
            num = 0;
        var state = $(this).attr('value');
        var scCmsAdvId = $(this).parent().parent().attr('scCmsAdvId');
        if (state == 1) {
            num = 2;
        } else if (state == 2) {
            num = 1;
        }
        reqNewAjaxAsync(advertise.url.isPutaway, {
            scCmsAdvId: scCmsAdvId,
            scCmsAdvState: num
        }).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                advertise.getAdvertiseList(advertise.advertList, true);
            }
        });
    });
    //屏蔽重新发布
    $('#advertiseTabBody').on('click', '.rePublish', function() {
            layer.msg('该功能还未开放！');
        })
        //点击查看详情
    $('#advertiseTabBody').on('click', '.checkBtn', function() {
            var scCmsAdvStyleResId = $(this).parent().parent().attr('scCmsAdvStyleResId');
            var sccmsadvid = $(this).parent().parent().attr('sccmsadvid');
            var label = $(this).attr('label'),
                labelArr = [],
                labelStr = '';
            var creatTime = ($(this).attr('creatTime')).slice(0, length - 2);
            var btnParent = $(this).parent();
            var isPutawayText = btnParent.siblings('.checkStatus').find('span').html();
            var labelArr = label.split(',');
            if ($(this).attr('examine') == 1) {
                $('#advertiseDBtnBox').show();
            } else {
                $('#advertiseDBtnBox').hide();
            }
            if (!isNull(labelArr)) {
                for (var i = 0; i < labelArr.length; i++) {
                    labelStr += '<span class="adDConTag">' + labelArr[i] + '</span>';
                }
            }
            $('#putawayBtn').attr('sccmsadvid', sccmsadvid);
            if ($(this).siblings().html() == '上架') {
                $('#putawayBtn').html('上架').addClass('active').attr('value', 2);
            } else if ($(this).siblings().html() == '下架') {
                $('#putawayBtn').html('下架').removeClass('active').attr('value', 1);
            } else if ($(this).siblings().html() == '重新发布') {
                $('#putawayBtn').html('重新发布').addClass('active').attr('value', '');
            }
            $('#adDConPosition').html(btnParent.siblings('.adPosition').html());
            if (isPutawayText == '已上架') {
                $('#adDConIsPutaway').html(isPutawayText).removeClass('active').removeClass('invalid');
            } else if (isPutawayText == '已下架') {
                $('#adDConIsPutaway').html(isPutawayText).addClass('active').removeClass('invalid');
            } else if (isPutawayText == '已过期' || isPutawayText == '待审核' || isPutawayText == '已驳回' || isPutawayText == '已完成') {
                $('#adDConIsPutaway').html(isPutawayText).addClass('invalid').removeClass('active');
            }
            $('#adDConShowNum').html(btnParent.siblings('.adShowNum').html());
            $('#adDConClickNum').html(btnParent.siblings('.adClickNum').html());
            $('#adDConSource').html(btnParent.siblings('.adSource').html());
            $('#adDConType').html(btnParent.siblings('.adType').html());
            $('#adDConTime').html(btnParent.siblings('.adTime').html());
            $('#adDConTagList').html(labelStr);
            $('#adDConCreateTime').html(creatTime);
            if(btnParent.siblings('.adType').attr('sourceType') == '2002') {
                $('#adDTypeHref').html($(this).parent().attr('ad1') + $(this).parent().attr('ad2'));
                $('#adDTypeHrefBox').show();
            } else {
                $('#adDTypeHrefBox').hide();
            }
            reqNewAjaxAsync(advertise.url.getAdStyle, {
                scCmsAdvStyleResId: scCmsAdvStyleResId
            }).done(function(res) {
                console.log(res);
                if (res.code != 1) {
                    return layer.msg(res.msg)
                };
                if (res.code == 1) {
                    var data = res.data;
                    if (!isNull(data)) {
                        var abStyleObj = JSON.parse(data.cmsAdvStyleRes[0].scCmsAdvStyleResJson);
                        console.log(abStyleObj);
                        if (data.scCmsAdvStyle.scCmsAdvStyleType == 6) {
                            $('#adDConRSetImg').addClass('show').removeClass('hide');
                            $('#adDConRSetImgList').addClass('hide').removeClass('show');
                            $('#adDConRSetVideo').addClass('hide').removeClass('show');
                            $('#adDConRType').html('(单图)');

                            $('#advStyleResTitle').html(data.cmsAdvStyleRes[0].scCmsAdvStyleResTitle);
                            $('#adDConRSetRight').attr('src', abStyleObj[0].resourcesUrl);
                        } else if (data.scCmsAdvStyle.scCmsAdvStyleType == 8) {
                            $('#adDConRSetImg').addClass('hide').removeClass('show');
                            $('#adDConRSetImgList').addClass('hide').removeClass('show');
                            $('#adDConRSetVideo').addClass('show').removeClass('hide');
                            $('#adDConRType').html('(视频)');

                            $('#advStyleVideoTitle').html(data.cmsAdvStyleRes[0].scCmsAdvStyleResTitle);
                            var videoUrl = abStyleObj[0].videoUrl;
						    var resourcesUrl = abStyleObj[0].resourcesUrl;
                            $('#adDConRSetVideoUrl').html('<video src="' + videoUrl + '" poster="' + resourcesUrl + '" controls="controls"></video>');
                        } else if (data.scCmsAdvStyle.scCmsAdvStyleType == 7) {
                            $('#adDConRSetImg').addClass('hide').removeClass('show');
                            $('#adDConRSetImgList').addClass('show').removeClass('hide');
                            $('#adDConRSetVideo').addClass('hide').removeClass('show');
                            $('#adDConRType').html('(三图)');
                            var str = '';
                            for (var i = 0; i < abStyleObj.length; i++) {
                                str += '<img src="' + abStyleObj[i].resourcesUrl + '" alt="">';
                            }
                            $('#advStyleImgLTitle').html(data.cmsAdvStyleRes[0].scCmsAdvStyleResTitle);
                            $('#adDConRSetImgsBox').html(str);
                        }
                        for (var i = 0; i < abStyleObj.length; i++) {
                            abStyleObj
                        }
                    }
                }
            });
        })
        //弹窗中的上架下架按钮点击
    $('#putawayBtn').click(function() {
        var _this = this,
            num = 0;
        var state = $(this).attr('value');
        var scCmsAdvId = $(this).attr('scCmsAdvId');
        if (state == 1) {
            num = 2;
        } else if (state == 2) {
            num = 1;
        } else {
            return;
        }
        reqNewAjaxAsync(advertise.url.isPutaway, {
            scCmsAdvId: scCmsAdvId,
            scCmsAdvState: num
        }).done(function(res) {
            if (res.code != 1) {
                return layer.msg(res.msg)
            };
            if (res.code == 1) {
                advertise.getAdvertiseList(advertise.advertList, true);
            }
        });
    })
})

//判断广告类型
function advertiseType(d) {
    var str = '';
    if (d == '2001') {
        str = '内部广告';
    } else if (d == '2002') {
        str = '外部广告';
    }
    return str;
}