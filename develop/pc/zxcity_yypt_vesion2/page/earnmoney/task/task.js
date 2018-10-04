$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'earnmoney/getReaprintExplainList',//(列表)
            ADD:'earnmoney/addReaprintExplainDetail',//新增
            DEL:'earnmoney/deleteReaprintExplainDetail',//删除
            UPDATE:'earnmoney/updateReaprintExplainDetail',//修改
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
                        field: 'name',
                        width: 100
                    }, {
                        title: '说明内容',
                        align: 'left',
                        field: 'value',
                        width: 800
                    }, {
                        title: '排序',
                        align: 'left',
                        field: 'sort',
                        width: 224
                    }, {
                        title: '创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 200,
                    }, {
                        title: '操作',
                        align: 'left',
                        field: 'prizePrice',
                        toolbar:'#barDemo',
                        width: 180,
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
                value:$.trim($('#values').val()) || '',
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
                    })
                }else{
                    layer.msg(res.msg)
                }
            })


        }
        $('#addBtn').click(function () {
            AREA = ['40%', '700px']
            var el = $('#addDemo');
            layerOpen('添加任务说明',el,'addForm','');
            form.on('submit(addForm)', function (data) {
                if (data) {
                    var flag = true;
                    var parm = {
                        name: $.trim($('#name').val()),
                        sort: $.trim($('#sort').val()),
                        value: $.trim($('#value').val()),
                    };
                    console.log(parm)
                    if (flag) {
                        reqAjaxAsync(USER_URL.ADD, JSON.stringify(parm)).then(function (res) {
                            if (res.code == 1) {
                                init_obj()
                            }
                            layer.msg(res.msg);
                            layer.close(_index);
                        })
                    }
                }
                return false;
            })
        })
        table.on('tool(tableNo)',function (obj) {
            var reData = obj.data;
            if(obj.event == 'edit'){
                AREA = ['40%', '700px']
                var el = $('#addDemo');
                layerOpen('添加任务说明',el,'editForm',setDatas(el,reData));
                form.on('submit(editForm)', function (data) {
                    if (data) {
                        var flag = true;
                        var parm = {
                            name: $.trim($('#name').val()),
                            sort: $.trim($('#sort').val()),
                            value: $.trim($('#value').val()),
                            dictionaryId:reData.id
                        };
                        console.log(parm)
                        if (flag) {
                            reqAjaxAsync(USER_URL.UPDATE, JSON.stringify(parm)).done(function (res) {
                                if (res.code == 1) {
                                    init_obj()
                                }
                                layer.msg(res.msg);
                                layer.close(_index);
                            })
                        }
                    }
                    return false;
                })
            }else if(obj.event == 'del'){
                layer.confirm('确定删除该任务说明?',{},function (index) {
                    var params ={
                        dictionaryId:reData.id
                    }
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            init_obj()
                        }
                        layer.close(index);
                        layer.msg(res.msg)
                    })
                })
            }
        })
    })
})

