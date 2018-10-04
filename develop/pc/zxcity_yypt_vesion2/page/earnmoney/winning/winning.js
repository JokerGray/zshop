$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'earnmoney/getPlayerWinningList',//(列表)
        };
        laydate.render({
            elem:'#createTime'
            ,theme: '#009688',

        })
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input').val('')
            init_obj()
        })
        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 200
                    }, {
                        title: '电话号码',
                        align: 'left',
                        field: 'phone',
                        width: 224
                    }, {
                        title: '奖品名称',
                        align: 'left',
                        field: 'prizeTitle',
                        width: 224
                    }, {
                        title: '奖品类型',
                        align: 'left',
                        field: 'prizeType',
                        width: 150,
                    }, {
                        title: '面额',
                        align: 'left',
                        field: 'prizePrice',
                        width: 180,
                    },  {
                        title: '中奖时间',
                        align: 'left',
                        field: 'createTime',
                        width: 180,
                    },{
                        title: '状态',
                        align: 'left',
                        field: 'orderStatus',
                        width: 100,
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var params = {
                pagination:{
                    page: index,
                    rows: limit,
                },
                phone:$.trim($('#phone').val()) || '',
                prizeTitle:$.trim($('#prizeTitle').val()) || '',
                createTime:$.trim($('#createTime').val()) || '',
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    var arr = ['已确认', '已使用', '已失效', '已发货', '已收货'];
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        item.prizeType = item.prizeType == 2 ? '实物' : '票券';
                        item.orderStatus = arr[item.orderStatus - 1]
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }
    })

})

