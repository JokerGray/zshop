$(function () {

    //获取今天的日期：
    var today = start.format(new Date());

    //点击日期获取时间
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        var startDate = {
            // min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istoday: false,
            choose: function (datas) {
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
            choose: function (datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                start.startTime = $("#start").val();
                start.endTime = datas;
                if (!isNull($("#start").val())) {
                    start.startTime = $("#start").val();
                    start.endTime = datas;
                }
            }
        };

        $('#start').click(function () {
            startDate.elem = this;
            laydate(startDate);
        });

        $('#end').click(function () {
            endDate.elem = this;
            laydate(endDate);
        });
    });

    //获取下拉框所有选项
    optionType($("#inputValue"), "all");

    //刷新页面时显示所有列表数据
    refresh();

    //tab栏设置访问类型：
    $('#tabPerson').attr('subscriptionType', 0);
    $('#tabCom').attr('subscriptionType', 1);

    //点击搜索按钮时搜索对应项
    $('#search_icon').click(function () {
        $('.tabinner li').removeClass('active');
        $('#tabAll').addClass('active');
        $('#examineOpt').val('');
        var subscriptionName = $('#penName_inp').val();
        // var operationName = $('#autherName_inp').val();
        var subscriptionTypeId = $('#inputValue').val();
        start.searchData({
            url: "selectWriterReview",
            data: {
                "subscriptionName": subscriptionName,
                // "operationName": operationName,
                "subscriptionTypeId": subscriptionTypeId,
                "startTime": $("#start").val(),
                "endTime": $("#end").val(),
                "pagination": {
                    "page": start.page,
                    "rows": start.rows
                }
            }
        });
    })

    //点击tab-全部时搜索全部内容
    $('#tabAll').click(function () {
        //清空审核状态下拉选项
        $('#examineOpt').val('');
        var data = {
            "subscriptionType": "",
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        start.getAll({
            url: "selectWriterReview",
            data: data
        });
        start.getPage(start.pages, data);
    })

    //点击tab-Person 时搜索个人内容
    $('#tabPerson').click(function () {
        //清空审核状态下拉选项
        $('#examineOpt').val('');
        var data = {
            "subscriptionType": 0,
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        start.getAll({
            url: "selectWriterReview",
            data: data
        });
        start.getPage(start.pages, data);
    })

    //点击tab-Com 时搜索企业内容
    $('#tabCom').click(function () {
        //清空审核状态下拉选项
        $('#examineOpt').val('');
        var data = {
            "subscriptionType": 1,
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        start.getAll({
            url: "selectWriterReview",
            data: data
        });
        start.getPage(start.pages, data);
    })

    //点击7天 时搜索近7天内容
    $('#lastSevenDay').click(function () {
        //清空所有搜索框选项
        $('#penName_inp').val('');
        // $('#autherName_inp').val('');
        $('#inputValue').val('');
        $('#start').val('');
        $('#end').val('');
        //清空审核状态下拉选项
        $('#examineOpt').val('');
        var startDay = start.format(new Date().setDate(new Date().getDate() - 7));
        var data = {
            "startTime": startDay,
            "endTime": today,
            "subscriptionType": "",
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        var type = $('.tabinner > li.active').attr('subscriptionType');
        if (type == 0) {
            data.subscriptionType = 0;
        } else if (type == 1) {
            data.subscriptionType = 1;
        }
        start.getAll({
            url: "selectWriterReview",
            data: data
        });
        start.getPage(start.pages, data);
    })

    //点击14天 时搜索近14天内容
    $('#lastHalfofMouth').click(function () {
        //清空所有搜索框选项
        $('#penName_inp').val('');
        // $('#autherName_inp').val('');
        $('#inputValue').val('');
        $('#start').val('');
        $('#end').val('');
        //清空审核状态下拉选项
        $('#examineOpt').val('');
        var startDay = start.format(new Date().setDate(new Date().getDate() - 14));
        var data = {
            "startTime": startDay,
            "endTime": today,
            "subscriptionType": "",
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        var type = $('.tabinner > li.active').attr('subscriptionType');
        if (type == 0) {
            data.subscriptionType = 0;
        } else if (type == 1) {
            data.subscriptionType = 1;
        }
        start.getAll({
            url: "selectWriterReview",
            data: data
        });
        start.getPage(start.pages, data);
    })

    //点击30天 时搜索近30天内容
    $('#lastMouth').click(function () {
        //清空所有搜索框选项
        $('#penName_inp').val('');
        // $('#autherName_inp').val('');
        $('#inputValue').val('');
        $('#start').val('');
        $('#end').val('');
        //清空审核状态下拉选项
        $('#examineOpt').val('');
        var startDay = start.format(new Date().setDate(new Date().getDate() - 30));
        var data = {
            "startTime": startDay,
            "endTime": today,
            "subscriptionType": "",
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        }
        var type = $('.tabinner > li.active').attr('subscriptionType');
        if (type == 0) {
            data.subscriptionType = 0;
        } else if (type == 1) {
            data.subscriptionType = 1;
        }
        start.getAll({
            url: "selectWriterReview",
            data: data
        });
        start.getPage(start.pages, data);
    })

    //下拉按钮的值改变后请求数据:
    $('#examineOpt').change(function () {
        var subscriptionName = $('#penName_inp').val();
        // var operationName = $('#autherName_inp').val();
        var subscriptionTypeId = $('#inputValue').val();
        var optionVal = $('#examineOpt').val()
        var data = {
            "subscriptionName": subscriptionName,
            // "operationName": operationName,
            "subscriptionTypeId": subscriptionTypeId,
            "startTime": $("#start").val(),
            "endTime": $("#end").val(),
            "subscriptionType": "",
            "isExamine": optionVal,
            "pagination": {
                "page": start.page,
                "rows": start.rows
            }
        };
        var index = $('.tabinner > li.active').index();
        if (index == 0) {
            data.subscriptionType = "";
        } else if (index == 1) {
            data.subscriptionType = 0;
        } else if (index == 2) {
            data.subscriptionType = 1;
        }
        console.log(optionVal)
        console.log(index);
        start.searchData({
            url: "selectWriterReview",
            data: data
        });
    })

    //通过审核
    $('#pushPass').click(function () {
        var userId = $(this).parent().attr('userId');
        start.pushPassData({
            url: "writeReview",
            data: { "userId": userId, "isExamine": 1 }
        });

        //再次刷新所有列表数据
        refresh();
    })

    //不通过审核
    $('#notPass').click(function () {
        var userId = $(this).parent().attr('userId');
        start.pushNotPassData();
    })

    //点击屏蔽按钮：
    $('#shield').click(function () {
        var userId = $(this).parent().attr('userId');
        start.NotPassReason({
            url: "writeReview",
            data: { "userId": userId, "isExamine": 3 }
        });

        //再次刷新所有列表数据
        refresh();
    })

    //填写不通过理由并提交
    $('#notPassReason').click(function () {
        var userId = $(this).parent().attr('userId');
        console.log(userId);
        console.log($('#notPassForm').find('label'));
        var str = '';
        $('#notPassForm').find('label').each(function (i, e) {
            str += $(e).attr('field') + ',';
        });
        var exp = /\,$/;
        str = str.replace(exp, "");

        var textStr = $('#NotPass_beca').val();
        console.log(textStr)
        start.NotPassReason({
            url: "writeReview",
            data: { "userId": userId, "isExamine": 2, "conditionsForNonAudit": str, "supplementaryInstructions": textStr }
        });

        //再次刷新所有列表数据
        refresh();
    })

    //方框点击后显示删除样式
    $('.control-label > .myModal_icon').click(function () {
        $(this).toggleClass('active');
    })

})
var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
var start = {
    rows: 5,       //每页条数
    page: 1,       //第几页
    pages: 1,      //总页数
    getAll: function (d) {               //刷新页面时显示所有列表数据
        var url = d.url || "";
        var data = d.data || "";
        var res = reqNewAjax(url, data);
        if (res.code == 1) {
            var data = res.data;
            var getTpl = $("#noticeList").html();
            start.pages = Math.ceil(data.total / start.rows);
            if (!isNull(data.list)) {
                laytpl(getTpl).render(data.list, function (html) {
                    $("#statement_con").html(html);
                });
                setIcon('.tabNotice_icon');
                isExamineText('.checkPending');
                windowBox('.tabNotice_btn');
            } else {
                $("#statement_con").html('');
            }
        }
    },
    searchData: function (d) {           //点击搜索按钮时搜索对应项
        var url = d.url || "";
        var data = d.data;
        var searchPage = d.data;
        var res = reqNewAjax(url, data);
        if (res.code == 1) {
            console.log(res);
            var data = res.data;
            var getTpl = $("#noticeList").html();
            start.pages = Math.ceil(data.total / start.rows);
            start.getPage(start.pages, searchPage);
            if (!isNull(data.list)) {
                laytpl(getTpl).render(data.list, function (html) {
                    $("#statement_con").html(html);
                });
                setIcon('.tabNotice_icon');
                isExamineText('.checkPending');
                windowBox('.tabNotice_btn');
            } else {
                $("#statement_con").html('');
            }
        }
    },
    getDataAjax: function (d) {         //点击列表查看按钮查看作家详情
        var url = d.url || "";
        var data = d.data || "";
        var res = reqNewAjax(url, data);
        // console.log(res);
        if (res.code == "1") {
            // console.log(res);
            var data = res.data;
            $('#subscriptionName').html(data.subscriptionName || '');
            $('#subscriptionName').siblings().attr('field', 'subscriptionName');
            if (!isNull(data.subscriptionImgUrl)) {
                $('#form_headshot').attr('src', data.subscriptionImgUrl);
            }
            $('#form_headshot').siblings().attr('field', 'subscriptionImgUrl');

            $('#sub_province').html((data.province && data.province.areaname) ? data.province.areaname : '');
            $('#sub_province').siblings().attr('field', 'province.areaname');

            $('#sub_city').html((data.city && data.city.areaname) ? data.city.areaname : '');
            $('#sub_city').siblings().attr('field', 'city.areaname');

            $('#subscriptionSynopsis').html(data.subscriptionSynopsis || '');
            $('#subscriptionSynopsis').siblings().attr('field', 'subscriptionSynopsis');

            $('#assistData').html(data.assistData || '');
            $('#assistData').siblings().attr('field', 'assistData');

            $('#subscriptionTypeName').html((data.scCmsSubscriptionType && data.scCmsSubscriptionType.channelName) ? data.scCmsSubscriptionType.channelName : '');
            $('#subscriptionTypeName').siblings().attr('field', 'scCmsSubscriptionType.subscriptionTypeName');

            if (!isNull(data.otherPapersImg)) {
                $('#certificate_photo').attr('src', data.otherPapersImg);
                $('.photoEnlarge').attr('src', data.otherPapersImg);
            }
            $('#certificate_photo').siblings().attr('field', 'otherPapersImg');

            $('#operationName').html(data.operationName || '');
            $('#operationName').siblings().attr('field', 'operationName');

            $('#operationPhone').html(data.operationPhone || '');
            $('#operationPhone').siblings().attr('field', 'operationPhone');

            $('#operationIdCard').html(data.operationIdCard || '');
            $('#operationIdCard').siblings().attr('field', 'operationIdCard');
            if (data.subscriptionType == 0) {
                $('#modalTitType').html('个人');
                $('#operationNameBox').addClass('hide').removeClass('show');
                $('#operationIdCardBox').addClass('hide').removeClass('show');
                $('#IDcardPhotoBox').addClass('hide').removeClass('show');
            } else if (data.subscriptionType == 1) {
                $('#modalTitType').html('企业');
                $('#operationNameBox').addClass('show').removeClass('hide');
                $('#operationIdCardBox').addClass('show').removeClass('hide');
                $('#IDcardPhotoBox').addClass('show').removeClass('hide');
            }

            if (!isNull(data.operationIdCardImg)) {
                $('#IDcard_photo').attr('src', data.operationIdCardImg);
            }
            $('#IDcard_photo').siblings().attr('field', 'operationIdCardImg');

            // console.log($('#certificate_photo'));
            // if($('#certificate_photo').attr('src')){
            //     $('#certificate_photo').attr('title','鼠标移入放大');
            //     $('#certificate_photo').mouseover(function(){
            //         $('.photoEnlargeBox').addClass('show');
            //         $('.photoEnlargeBox').removeClass('hide');
            //     })
            //     $('#certificate_photo').mouseout(function(){
            //         $('.photoEnlargeBox').removeClass('show');
            //         $('.photoEnlargeBox').addClass('hide');
            //     })
            // }
        }
    },
    pushPassData: function (d) {        //通过审核
        var url = d.url || "";
        var data = d.data;
        var res = reqNewAjax(url, data);
        if (res.code == 1) {

        }
    },
    pushNotPassData: function (d) {     //不通过审核
        // var url = d.url || "";
        // var data = d.data;
        // console.log()
        // var res = reqNewAjax(url, data);
        // if (res.code == 1) {
        //     console.log(res);
        $('#notPassForm').html('');
        $('i.myModal_icon.active').each(function (i, e) {
            var node = this.parentNode.cloneNode(true);
            $('#notPassForm').append(node);
        })
        // }
    },
    NotPassReason: function (d) {       //填写不通过理由并提交
        var url = d.url || "";
        var data = d.data;
        var res = reqNewAjax(url, data);
        if (res.code == 1) {
            // console.log(res);
        }
    },
    shield: function (d) {
        var url = d.url || "";
        var data = d.data;
        var res = reqNewAjax(url, data);
        if (res.code == 1) {
            // console.log(res);
        }
    },
    getPage: function (pages, d) {         //获取分页
        laypage({
            cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function (obj) {
                start.page = obj.curr;
                d.pagination.page = obj.curr;
                start.getAll({
                    url: "selectWriterReview",
                    data: d
                })
            }
        });
    },
    format: function (d, fmt) {
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
        for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt;                    //处理日期
    }
}

//个人企业icon的样式设置：
function setIcon(html) {
    $(html).each(function (i, e) {
        var type = $(this).find('span').attr('subscriptionType');
        if (type == 0) {
            $(this).find('span').html('个');
            $(this).find('span').css({ 'backgroundColor': '#00B7EE' })
        } else if (type == 1) {
            $(this).find('span').html('企');
            $(this).find('span').css({ 'backgroundColor': '#8CD73C' })
        } else {
            $(this).find('span').html('无');
        }        //个人企业icon设置
    })
}

//表格状态的文字：
function isExamineText(html) {
    $(html).each(function (i, e) {            //是否审核设置
        var isExamine = $(this).attr('isExamine');
        if (isExamine == 0) {
            $(this).html('待审核');
        } else if (isExamine == 1) {
            $(this).html('已通过');
        } else if (isExamine == 2) {
            $(this).html('未通过');
        } else if (isExamine == 3) {
            $(this).html('屏蔽');
        } else if (isExamine == 4) {
            $(this).html('冻结');
        } else if(isExamine == 5) {
            $(this).html('黑名单');
        }
    })
}

//点击列表查看按钮查看作家详情
function windowBox(html) {
    $(html).each(function (i, e) {
        $(this).click(function () {
            var userId = $(this).attr('userId');
            $('#modalBtnBox').attr('userId', userId);
            $('#notPassBtnBox').attr('userId', userId);
            start.getDataAjax({
                url: "selectSubScriptionByUserId",
                data: { "userId": userId }
            });
        })
    });
}

//再次刷新所有列表数据
function refresh() {
    $('#examineOpt').val('');
    $('.tabinner li').removeClass('active');
    $('#tabAll').addClass('active');
    var data = {
        "subscriptionType": "",
        "pagination": {
            "page": start.page,
            "rows": start.rows
        }
    }
    start.getAll({
        url: "selectWriterReview",
        data: data
    });
    start.getPage(start.pages, data);
}