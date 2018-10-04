$(function () {
    var REQUIRE_URL = {
        skillActivity:'cs_collageKill/getShopSecondsKillActivityList',//秒杀活动列表
        activityGoodsDetail:'cs_collageKill/getShopSecondsKillActivityItemList',//秒杀活动的商品规格详情列表
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

    //获取秒杀活动列表
    function getSkillActivityList(pageNo){
        var status = $('#statusSelector').val() || '';
        var params = {
            "backUserId": backUserId,//登录用户主键
            "status": status,//活动状态  0 未开启/1 进行中/2 已结束/3 已关闭
            "shopId": shopId,//店铺主键
            "pagination": {//分页信息
                "page": pageNo || 1,//页号
                "rows": pageSize//每页数量
            }
        };
        reqAjaxAsync(REQUIRE_URL['skillActivity'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                var statusText = '';
                if(res.data.total === 0){
                    html = '<tr><td colspan="10" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.rows.forEach(function (item, index) {
                        No = ((pageNo || 1) - 1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.status === 0){
                            statusText = '未开始'
                        }else if(item.status === 1){
                            statusText = '进行中'
                        }else if(item.status === 2){
                            statusText = '已结束'
                        }else if(item.status === 3){
                            statusText = '已关闭'
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.activityTitle+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.goodsSumCount+'</td>'
                        +'<td>'+item.settleCount+'</td>'
                        +'<td>'+item.activityCreatetime+'</td>'
                        +'<td>'+item.activityStartTime+'</td>'
                        +'<td>'+item.activityEndTime+'</td>'
                        +'<td>'+statusText+'</td>'
                        +'<td>'
                        +'<a href="JavaScript:;" data-id="'+item.id+'">查看详情</a>'
                        +'</td>'
                        +'</tr>'
                    })
                }
                $('.reportTable table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelector',res.data.total,function (obj, first) {
                        getSkillActivityList(obj.curr)
                    })
                }
            }
        })
    }

    //获取秒杀活动商品详情
    function getActivityGoodsDetail(activityId){
        var params = {
            "backUserId": backUserId,//登录用户主键
            "activityId": activityId//商品秒杀活动表主键
        };
        reqAjaxAsync(REQUIRE_URL['activityGoodsDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                if(res.data.length === 0){
                    html = '<tr><td colspan="6" style="text-align: center;">暂无相关数据</td></tr>'
                }else{
                    res.data.forEach(function (item, index) {
                        No = (index + 1) < 10 ? '0' + (index + 1) : (index + 1);
                        html += '<tr>'
                            +'<td>'+No+'</td>'
                            +'<td>'+item.goodsStockName+'</td>'
                            +'<td>'+item.goodsOriginalStockPrice+'</td>'
                            +'<td>'+item.goodsPreferentialStockPrice+'</td>'
                            +'<td>'+item.goodsCount+'</td>'
                            +'<td>'+item.salesCount+'</td>'
                            +'</tr>'
                    })
                }
                $('.detailTable table tbody').html(html)
            }
        })
    }

    layui.use(['layer','form'],function () {
        var layer = layui.layer;
        var form = layui.form;
        $('.shopNameText').text(shopName);
        //关闭当前页面
        $('.closeBtn').click(function () {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        });
        //获取秒杀活动列表
        getSkillActivityList();
        //切换状态
        form.on('select(statusSelector)',function () {
            getSkillActivityList();
        });
        //查看秒杀活动详情
        $('.reportTable table').on('click','td a',function () {
            var activityId = $(this).attr('data-id');
            var goodsName = $(this).parent().parent().find('td:eq(2)').text();
            var html = template('skillDetailTpl',{goodsName:goodsName});
            layer.open({
                type:1,
                shade:0.5,
                shadeClose:true,
                closeBtn:0,
                title:'',
                area:['85%','596px'],
                skin:'detailPage',
                content:html,
                success:function (layeror,index) {
                    $(layeror).on('click','.closePage',function () {
                        layer.close(index)
                    });
                    getActivityGoodsDetail(activityId)
                }
            })
        });
        //导出
        $('.exportBtn').click(function () {
            var status = $('#statusSelector').val() || '';
            var url = '/zxcity_restful/ws/cs_collageKill/exportShopSecondsKillActivityList?backUserId='+backUserId+'&shopId='+shopId+'&status='+status;
            $(this).attr('href',url)
        })
    })
});