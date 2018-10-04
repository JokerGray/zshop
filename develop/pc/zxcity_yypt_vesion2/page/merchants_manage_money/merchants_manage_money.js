$(function(){
    layui.use(['form', 'layer', 'table', 'laypage', ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'operations/queryPaymentMethodPage',//(列表)
            ADD:'operations/addPaymentMethod', //(新增类型)
            UPDATE:'operations/modifyPaymentMethod',//修改类型
            DEL:'operations/delPaymentMethod',//删除商户类型
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
                        title: '排序序号',
                        align: 'left',
                        field: 'orderBy',
                        width: 224
                    }, {
                        title: '商户类型名称',
                        align: 'left',
                        field: 'paymentName',
                        width: 224
                    }, {
                        title: '创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 300,
                    },{
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar: '#barDemo',
                        width: 250
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var params = {
                page: index,
                rows: limit,
                paymentName:$.trim($('#paymentNames').val()) || '',
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                    })
                    deff.resolve(res);
                }else{
                    layer.msg(res.msg)
                }
            })
            return deff.promise();

        }
        //新增
        $('#addBtn').click(function () {
            TITLE[0] = '新增打款方式';
            var el = $('#addDemo');
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                // area: AREA,
                btn:['确认','取消'],
                end: function (layero,index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success:function (layero,index) {
                    setForms('addForm')
                },
                yes:function (index) {
                    form.on('submit(addForm)',function (data) {
                        if(data){
                             var params={
                                 paymentName:$.trim($('#paymentName').val()),
                                 orderBy:$('#orderBy').val()
                             }
                             reqAjaxAsync(USER_URL.ADD,JSON.stringify(params)).done(function (res) {
                                 if(res.code == 1){
                                     init_obj()
                                 }
                                 layer.msg(res.msg)
                                 layer.close(index)
                             })
                        }
                        return false;
                    })
                },
                btn1:function(){

                }
            })
        })
        //修改
        table.on('tool(tableNo)',function (obj) {
            var el = $('#addDemo');
            var ids = obj.data.id;
            var reDatas = obj.data;
            if(obj.event === 'edit'){
                TITLE[0] = '修改打款方式'
                layer.open({
                    title: TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    // area: AREA,
                    btn:['确认','取消'],
                    end: function (layero,index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success:function (layero,index) {
                        setDatas(el,reDatas)
                        setForms('addForm')
                    },
                    yes:function (index) {
                        form.on('submit(addForm)',function (data) {
                            if(data){
                                var params={
                                    id:ids,
                                    paymentName:$.trim($('#paymentName').val()),
                                    orderBy:$('#orderBy').val()
                                }
                                reqAjaxAsync(USER_URL.UPDATE,JSON.stringify(params)).done(function (res) {
                                    if(res.code == 1){
                                        init_obj()
                                    }
                                    layer.msg(res.msg)
                                    layer.close(index)

                                })
                            }
                            return false;
                        })
                    }
                })
            }else if(obj.event =='del'){
                layer.confirm("确定删除【"+obj.data.paymentName+"】商户类型？",{
                    icon: 0,
                    title: "提示",

                },function (index) {
                    var parms = {
                        id: ids
                    }
                    reqAjaxAsync(USER_URL.DEL, JSON.stringify(parms)).done(function(res) {
                        if(res.code == 1) {
                            init_obj()
                        }
                        layer.msg(res.msg);
                        layer.close(index);

                    })
                })
            }
        })
    })

})

