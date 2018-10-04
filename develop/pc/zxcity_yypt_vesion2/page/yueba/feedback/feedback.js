$(function(){
    layui.use(['form', 'layer', 'table', 'laypage', ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'newservice/findFeedBackList',//(列表)
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
                        title: '发布人',
                        align: 'left',
                        field: 'userName',
                        width: 224
                    }, {
                        title: '服务类型',
                        align: 'left',
                        field: 'categoryName',
                        width: 224
                    }, {
                        title: '数据来源',
                        align: 'left',
                        field: 'fromPage',
                        width: 150,
                    }, {
                        title: '服务名称',
                        align: 'left',
                        field: 'feedbackInfo',
                        width: 180,
                    },  {
                        title: '理由或建议',
                        align: 'left',
                        field: 'remark',
                        width: 180,
                    },{
                        title: '创建时间',
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
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        if(!item.categoryName){
                            item.categoryName = '-'
                        }
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }
    })

})

