var table,form,laypage,layer;
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage', ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer;
        form.render();
        var USER_URL = {
            LISTS:'operations/queryBackuserRegularTypePage',//(列表)
            ADD:'operations/addBackuserRegularType', //(新增类型)
            UPDATE:'operations/modifyBackuserRegularType',//修改类型
            DEL:'operations/delBackuserRegularType',//删除商户类型
        };

        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('#regularNames').val('')
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
                        field: 'regularName',
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
            var accountCategoryId = $.trim($('#accountCategoryIdser').val()) || '';//账目类型id
            var params = {
                page: index,
                rows: limit,
                regularName:$.trim($('#regularNames').val()) || '',
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
            AREA = 'auto'
            var params={
                regularName:$.trim($('#regularName').val()),
                orderBy:$('#orderBy').val()
            }
            layerOpen('新增商户类型',$('#addDemo'),'addForm',USER_URL.ADD,params);
            form.on('submit(addForm)',function (data) {
                if(data){
                    var params={
                        regularName:$.trim($('#regularName').val()),
                        orderBy:$('#orderBy').val()
                    }
                    reqAjaxAsync(USER_URL.ADD,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            init_obj()
                        }
                        layer.msg(res.msg)
                        layer.close(_index)
                    })
                }
                return false;
            })
        })
        //修改
        table.on('tool(tableNo)',function (obj) {
            AREA = 'auto'
            var el = $('#addDemo');
            var ids = obj.data.id;
            var reDatas = obj.data;
            if(obj.event === 'edit'){
                setDatas(el,reDatas)
                layerOpen('修改商户类型',el,'addForm','');
                form.on('submit(addForm)',function (data) {
                    if(data){
                        var params={
                            id:ids,
                            regularName:$.trim($('#regularName').val()),
                            orderBy:$('#orderBy').val()
                        }
                        reqAjaxAsync(USER_URL.UPDATE,JSON.stringify(params)).done(function (res) {
                            if(res.code == 1){
                                init_obj()
                            }
                            layer.msg(res.msg)
                            layer.close(_index)
                        })
                    }
                    return false;
                })
            }else if(obj.event =='del'){
                layer.confirm("确定删除【"+obj.data.regularName+"】商户类型？",{
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

