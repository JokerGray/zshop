$(function(){
    layui.use(['form', 'layer', 'table', 'laypage', ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'game/findAudit',//(列表)
        };

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
                        title: '姓名',
                        align: 'left',
                        field: 'userName',
                        width: 224
                    }, {
                        title: '所属店铺',
                        align: 'left',
                        field: 'shopName',
                        width: 224
                    }, {
                        title: '店铺ID',
                        align: 'left',
                        field: 'shopId',
                        width: 150,
                    }, {
                        title: '店铺地址',
                        align: 'left',
                        field: 'shopAddress',
                        width: 180,
                    },  {
                        title: '身份证正面',
                        align: 'left',
                        field: 'remark',
                        width: 180,
                    },{
                        title: '身份证反面',
                        align: 'left',
                        field: 'createTime',
                        width: 300,
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
                feedbackInfo:$.trim($('#feedbackInfo').val()) || '',
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {

            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var datas = res.data.list
                    res.data = datas;
                    console.log(datas)
                    $.each(datas, function (i, item) {
                        $(item).attr('eq', (i + 1))
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }
    })

})

