$(function(){
    layui.use(['form', 'layer', 'table', 'laypage', ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        form.render();
        var page = 1;
        var rows = 10;
        var AREA = ['90%', '90%'];
        var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
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
        //表格模板
        function tableInit(tableId, cols, pageCallback, pageLeft) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: 'full-340',
                cols: cols,
                page: false,
                even: true,
                skin: 'line',
                limit: 15
            });

            //2.第一次加载
            var res = pageCallback(page,rows).done(function (res) {
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
                    layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
                    limits: [15, 30],
                    limit: 15
                }
                page_options.jump = function(obj, first) {
                    tablePage = obj;

                    //首次不执行
                    if(!first) {
                        var resTwo = pageCallback(obj.curr, obj.limit);
                        if(resTwo && resTwo.code == 1)
                            tableIns.reload({
                                data: resTwo.data,
                                limit:obj.limit
                            });
                        else
                            layer.msg(resTwo.msg);
                    }
                }

                laypage.render(page_options);

                return {
                    tablePage,
                    tableIns
                };
            });

        }
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

        //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            var selectArr = demo.find('select');
            var textarea = demo.find('textarea');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            setArr(selectArr,data);
            setArr(textarea,data);
            form.render()

        }
        //遍历数组，填充数据
        function setArr(arr,data,img){
            var ids = '';
            $.each(arr,function (index, item) {
                ids = $(this).attr('id');
                if(data.hasOwnProperty(ids)){
                    if(img !== undefined){
                        $(this).attr('src',data[ids] || '')
                    }else{
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        //清空数据
        function emptyInput(demo){
            demo.find('textarea,input,select').val('');
            demo.find('input,select,textarea').attr('disabled',false)
            form.render()
        }
        //给保存按钮添加form属性
        function setForms(form){
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }
    })

})

