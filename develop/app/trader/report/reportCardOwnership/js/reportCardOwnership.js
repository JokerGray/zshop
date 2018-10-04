$(function () {
    var pageSize = 10;
    var backUserId = getUrlParams('backUserId');
    var REQUIRE_URL = {
        allCardReport:'reportCardOwnership/selectCardOwnershipCountList',//全部卡项统计
        cardDetail:'reportCardOwnership/selectCardOwnershipDetailList',//卡项详情
    };

    //初始化分页方法
    function initPageSelector(domId, total, jump) {
        if (total <= pageSize) {
            $('#' + domId).html('');
            return
        }
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: domId,
                count: total, //数据总数，从服务端得到
                theme: "#ccc",
                limit: pageSize,
                groups: 3,
                jump: function (obj, first) {
                    //首次不执行
                    if (!first) {
                        jump ? jump(obj, first) : null
                        //do something
                    }
                }
            })
        })
    }

    //获取全部卡项统计
    function getAllCardReport(pageNo){
        var cardName = $('#cardName').val().trim();
        var params = {
            "backUserId": backUserId,
            "cardName": cardName,
            "pagination": {
                "page": pageNo || 1,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['allCardReport'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500});
            }else{
                var No = 0;
                var html = '';
                var cardType = '';
                var numberDuration = '';
                if(res.total === 0){
                    html = '<tr><td colspan="6" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) -1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.packType === 1){
                            cardType = '次数卡';
                            numberDuration = item.numberDuration+'次'
                        }else if(item.packType === 2){
                            cardType = '时长卡';
                            numberDuration = item.numberDuration+'月'
                        }else if(item.packType === 5){
                            cardType = '终身卡';
                            numberDuration = '不限'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.cardName+'</td>'
                        +'<td>'+cardType+'</td>'
                        +'<td>'+numberDuration+'</td>'
                        +'<td>'+item.num+'</td>'
                        +'<td><a href="JavaScript:;" data-id="'+item.serviceCardId+'">查看详情</a></td>'
                        +'</tr>'
                    })
                }
                $('.card .tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.total,function (obj, first) {
                        getAllCardReport(obj.curr)
                    })
                }
            }
        })
    }

    //卡项统计详情弹窗
    function cardDetailPage(_this){
        var serviceCardId = $(_this).attr('data-id');
        var serviceCardName = $(_this).parent().parent().find('td:eq(1)').text();
        var html = template('cardDetailTpl',{serviceCardName:serviceCardName});
        layer.open({
            type:1,
            title: '',
            area: ['85%', '76%'],
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            scrollbar:false,
            content: html,
            skin: 'cardDetail',
            success:function (layeror, index) {
                getCardDetail(serviceCardId).done(function () {
                    //动态设置报表容器高度
                    $(layeror).find('.detailTable').outerHeight($(layeror).height() - $('.top').height() - $('.descAndExport').height() - $('.detailPageBox').outerHeight(true));
                });

                //点击右上角关闭按钮关闭弹窗
                $(layeror).on('click', '.top i', function () {
                    layer.close(index)
                });
                $(layeror).on('click','.detailExportBtn',function () {
                    var exportUrl = '/zxcity_restful/ws/reportCardOwnership/exportCardOwnershipDetailList?backUserId='+backUserId+'&serviceCardId='+serviceCardId;
                    $(this).attr('href',exportUrl)
                })
            }
        })
    }

    //获取卡项详情
    function getCardDetail(serviceCardId,pageNo){
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId,
            "serviceCardId": serviceCardId,
            "pagination": {
                "page": pageNo,
                "rows": pageSize
            }
        };
        reqAjaxAsync(REQUIRE_URL['cardDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var No = 0;
                var html = '';
                var totalNum = 0;
                if(res.total === 0){
                    html = '<tr><td colspan="5" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = pageSize * ((pageNo || 1) -1) + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.packType === 1){
                            totalNum = item.totalNum
                        }else if(item.packType === 2){
                            totalNum = item.remainNum
                        }else if(item.packType === 5){
                            totalNum = '永久'
                        }
                        if(!item.memberName){
                            item.memberName = '散客'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.memberName+'</td>'
                        +'<td>'+item.purchaseTime+'</td>'
                        +'<td>'+totalNum+'</td>'
                        +'<td>'+item.consumeNum+'</td>'
                        +'</tr>'
                    })
                }
                $('.detailTable table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('detailPageSelect',res.total,function (obj, first) {
                        getCardDetail(serviceCardId,obj.curr)
                    })
                }
                defer.resolve(res);
            }
        });
        return defer.promise()
    }

    layui.use('form', function () {
        var form = layui.form;

        getAllCardReport();

        //查看卡项详情
        $('.card').on('click','table tbody td a',function () {
            cardDetailPage(this)
        });
        //监听提交
        form.on('submit(formDemo)', function(data){
            getAllCardReport();
            return false;
        });

        $('.exportBtn').on('click',function () {
            var exportUrl = '/zxcity_restful/ws/reportCardOwnership/exportCardOwnershipCountList?backUserId='+backUserId+'&cardName='+$('#cardName').val().trim();
            $(this).attr('href',exportUrl)
        })
    });
});