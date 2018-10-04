

$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var dataTr = {};
        var USER_URL = {
            LISTS:'earnmoney/getPlayerCouponList',//(列表)
            UPDATESTATUS:'earnmoney/updatePlayerCouponStatus',//更新状态
            DETAIL:'earnmoney/getPlayerCouponDetail',//查看
            GETPLAYER:'earnmoney/getPlayerCouponUserList',//获取中奖列表
        };
        laydate.render({
            elem:'#createTimes'
            ,theme: '#009688',

        })
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input').val('')
            init_obj()
        })
        table.on('tool(tableNo)',function (obj) {
            var reData = obj.data;
            dataTr = reData;
            if(obj.event == 'switch'){
                var checked = $(this).find('input')[0].checked;
                var params = {
                    prizeId:reData.id,
                    prizeStatus:checked ?1:2
                }
                reqAjaxAsync(USER_URL.UPDATESTATUS,JSON.stringify(params)).done(function (res) {
                    if(res.code == 1){
                        layer.msg('操作成功!',{icon:1})
                    }else{
                        layer.msg(res.msg)
                    }

                })
            }else if(obj.event == 'detail'){
                var el = $('#addDemo');

                AREA=['50%','auto']
                layerOpen('虚拟奖品详细信息',el,'seeForm','');
                reqAjaxAsync(USER_URL.DETAIL,JSON.stringify({prizeId:reData.id})).done(function (res) {
                    if(res.code == 1){
                        var reData = res.data;
                        $('#prizeTitle').html(reData.prizeTitle);
                        $('#prizePrice').html(reData.prizePrice+' 元');
                        $('#prizeStatus').html(reData.prizeStatus==1?'上架':'下架').attr('class',reData.prizeStatus==1?'up':'down')
                        $('#prizeCount').html(reData.prizeCount+' 人');
                        $('#createTime').html(reData.createTime);
                        $('#prizeExplain').html(reData.prizeExplain);
                    }

                })
                init_obj1()
            }
        })
        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100
                    }, {
                        title: '店铺名称',
                        align: 'left',
                        field: 'shopName',
                        width: 224
                    }, {
                        title: '奖券样式',
                        align: 'left',
                        field: 'prizeStyle',
                        width: 224
                    }, {
                        title: '奖券标题',
                        align: 'left',
                        field: 'prizeTitle',
                        width: 150,
                    }, {
                        title: '面额',
                        align: 'left',
                        field: 'prizePrice',
                        width: 100,
                    },  {
                        title: '发布时间',
                        align: 'left',
                        field: 'createTime',
                        width: 180,
                    },{
                        title: '中奖次数',
                        align: 'left',
                        field: 'prizeCount',
                        width: 100,
                    },{
                        title: '上架/下架',
                        align: 'left',
                        toolbar:'#switchDemo',
                        field: 'prizeStatus',
                        event:'switch',
                        width: 150,
                    },{
                        title: '操作',
                        align: 'left',
                        toolbar:'#barDemo',
                        fixed:'right',
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
                shopName:$.trim($('#shopNames').val()) || '',
                prizeTitle:$.trim($('#prizeTitles').val()) || '',
                createTime:$.trim($('#createTimes').val()) || '',
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        item.prizeStyle = '<img src="'+item.prizeStyle+'"/>'
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }

        function getDatas(url, params) {
            return reqAjaxAsync(url,params).done(function (res) {
                if(res.code == 1){
                    var datas = res.data;
                    var arr = ['已确认', '已使用', '已失效', '已发货', '已收货'];
                    $.each(datas,function (i, item) {
                        item.eq = i+1;
                        item.orderStatusName = arr[item.orderStatus-1];
                    })
                }
            })
        }

        function pageCallback1() {
            var par ={
                pagination:{
                    page:1,
                    rows:15
                },
                prizeId:dataTr.id
            }
            return getDatas(USER_URL.GETPLAYER,JSON.stringify(par))
        }

        function init_obj1() {
            var objs = tableInit('addTable', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100
                    }, {
                        title: '用户电话号码',
                        align: 'left',
                        field: 'phone',
                        width: 224
                    }, {
                        title: '中奖时间',
                        align: 'left',
                        field: 'createTime',
                        width: 224
                    }, {
                        title: '票券号',
                        align: 'left',
                        field: 'cardNumber',
                        width: 150,
                    }, {
                        title: '状态',
                        align: 'left',
                        field: 'orderStatusName',
                        width: 100,
                    }]
                ],

                pageCallback1, 'addPage'
            );
        }
        function tableInit(tableId, cols, pageCallback, pageLeft) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: 'full',
                cols: cols,
                page: false,
                even: true,
                skin: 'row',
                limit: 10,
            });

            //2.第一次加载
            pageCallback(page,rows).done(function (res) {
                //第一页，一页显示15条数据
                if(res.code == 1) {
                    tableIns.reload({
                        data: res.data
                    })
                } else {
                    layer.msg(res.msg)
                }
                //3.left table page
                var page_options = {
                    elem: pageLeft,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    limit: 10
                }
                page_options.jump = function(obj, first) {
                    tablePage = obj;

                    //首次不执行
                    if(!first) {
                        pageCallback(obj.curr, obj.limit).done(function (resTwo) {
                            if(resTwo && resTwo.code == 1)
                                tableIns.reload({
                                    data: resTwo.data,
                                    limit:obj.limit
                                });
                            else
                                layer.msg(resTwo.msg);
                        })

                    }
                }
                laypage.render(page_options);

                return {
                    tablePage,
                    tableIns
                };
            });

        }
    })

})

