$(function () {
    var REQUIRE_URL = {
        collageHistoryList:'cs_collageKill/getShopGroupBuyingList'//拼团活动里列表
    };
    var backUserId = getUrlParams('backUserId');
    var shopId = getUrlParams('shopId');
    var shopName = getUrlParams('shopName');
    var pageSize = 10;

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

    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        initPage();
        //关闭当前页面
        $('.closeBtn').click(function () {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        });
        //初始化页面
        function initPage(){
            $('.shopNameText').text(shopName);
            //获取拼团历史拼团活动列表
            getCollageHistory()
        }
        //获取拼团历史拼团活动列表
        function getCollageHistory(pageNo){
            var status = $('#statusSelector').val() || '';
            var params = {
                "backUserId": backUserId,
                "shopId": shopId,
                "status":status,
                "pagination": {
                    "page": pageNo || 1,
                    "rows": pageSize
                }
            };
            reqAjaxAsync(REQUIRE_URL['collageHistoryList'],JSON.stringify(params)).done(function (res) {
                if(res.code !== 1){
                    layer.msg(res.msg,{icon:5,time:1500})
                }else{
                    var No = '';
                    var html = '';
                    var statusText = '';
                    if(res.data.total === 0){
                        html = '<tr><td colspan="8">暂无相关数据</td></tr>'
                    }else{
                        res.data.rows.forEach(function (item,index) {
                            No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                            No = No < 10 ? '0' + No : No;
                            if(item.status == 0){
                                statusText = '未开始'
                            }else if(item.status == 1){
                                statusText = '进行中'
                            }else if(item.status == 2){
                                statusText = '已结束'
                            }else if(item.status == 3){
                                statusText = '已失效'
                            }else if(item.status == 4){
                                statusText = '已删除'
                            }
                            html += '<tr>'
                            +'<td>'+No+'</td>'
                            +'<td>'+item.itemTitle+'</td>'
                            +'<td>'+item.goodsName+'</td>'
                            // +'<td>'+item.inventory+'</td>'
                            +'<td>'+item.population+'</td>'
                            +'<td>'+item.cTime+'</td>'
                            +'<td>'+item.startTime+'</td>'
                            +'<td>'+item.endTime+'</td>'
                            +'<td>'+statusText+'</td>'
                            +'</tr>'
                        });
                    }
                    $('.reportTable table tbody').html(html);
                    if(pageNo === 1 || !pageNo){
                        initPageSelector('pageSelector',res.data.total,function (obj,first) {
                            getCollageHistory(obj.curr)
                        })
                    }
                }
            })
        }
        //切换状态
        form.on('select(statusSelector)',function () {
            getCollageHistory()
        });
        //导出报表
        $('.exportBtn').click(function () {
            var status = $('#statusSelector').val() || '';
            var url = '/zxcity_restful/ws/cs_collageKill/exportShopGroupBuyingList?backUserId='+backUserId+'&status='+status+'&shopId='+shopId;
            $(this).attr('href',url)
        })
    })
});