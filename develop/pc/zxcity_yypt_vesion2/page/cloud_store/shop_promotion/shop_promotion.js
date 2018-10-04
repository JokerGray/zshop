//清空数据
function emptyInput(demo){
    demo.find('textarea,input').val('');
    demo.find('img').attr('src','../../../common/images/upload.png');
    demo.find('input,select,textarea').attr('disabled',false)
    form.render()
}

$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var dataTr = {};
        var userno = yyCache.get("userno") || "6";
        var USER_URL = {
            LISTS:'operationCloudShop/getSpreadShopList',//(列表)
            ADD:'operationCloudShop/subShopLabel',//新增
            PRVINCE:'operations/getProvinceList',//省市接口
            GETTRADELIST:'operationCloudShop/getTradeList',//获取行业列表
            GETSHOP:'operationCloudShop/getShopList',//获取店铺列表
        };
        proviceSelect(USER_URL.PRVINCE,$('#provinceSelector'),$('#citySelector'))
        getTradeList($('#tradeList'))
        function getTradeList(ids) {
            return reqAjaxAsync(USER_URL.GETTRADELIST).done(function (res) {
                if(res.code == 1){
                    var datas = res.data;
                    var str = '<option value="">请选择</option>';
                    $.each(datas,function (i, item) {
                        str+='<option value="'+item.id+'">'+item.name+'</option>'
                    })
                    ids.html(str)

                }
            })
        }
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input,select').val('')
            init_obj()
        })
        $('#searchBtn1').click(function () {
            init_obj1();
        })
        $('#restBtn1').click(function () {
            $('.header2').find('input,select').val('')
            init_obj1()
        })
        var imgPath ='../../../common/images/upload.png';
        $('#shopName').click(function () {
            var el = $('#oneDemo')
            console.log(el)
            AREA=['850px','650px'];
            TITLE[0] = '选择推广店铺'
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                shade:SHADE,
                btn:[],
                end: function (layero,index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success:function (layero,index) {
                    init_obj1()
                    table.on('tool(tableNo1)',function (obj) {
                        var reDatas = obj.data;
                        if(obj.event == 'ok'){
                            layer.close(index);
                            $('#shopName').val(reDatas.shopName)
                            $('#shopId').val(reDatas.id)
                        }
                    })
                },
            })


        })
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            var el = $('#addDemo');
            AREA=['50%','700px']
            TITLE[0] = '新增推广店铺'
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                shade:SHADE,
                btn:['新增','取消'],
                end: function (layero,index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success:function (layero,index) {
                    setForms('addDemo')
                },
                yes:function (index) {
                    form.on('submit(addDemo)',function (obj) {
                        if(obj){
                            saveFunc(index)
                        }
                    })
                    return false
                }
            })




        })
        function saveFunc(index,ids) {
            var imageUrl = $('#imageUrl').attr('src')
            if(imgPath == imageUrl){
                layer.msg('请上传展示图片',{icon:2,anim:6})
                return
            }
            var params = {
                shopId:$('#shopId').val(),
                labelId:$('#labelId').val(),
                labelType:$('#labelType').val(),
                imageUrl:$('#imageUrl').attr('src'),
                description:$('#description').val(),
                createUser:userno,
                labelName:$('#labelId').find('option:checked').text()
            }
            if(ids){
                params.id = ids
            }
            reqAjaxAsync(USER_URL.ADD,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }
                layer.close(index)
                layer.msg(res.msg)
            })
        }
        // imageUrl
        uploadOss({
            btn: "imageUrl",
            flag: "img",
            size: "5mb"
        });
        table.on('tool(tableNo)',function (obj) {
            var reData = obj.data;
            console.log(reData)
            dataTr = reData;
            if(obj.event == 'edit'){
                var el = $('#addDemo');
                AREA=['50%','700px']
                TITLE[0] = '修改推广店铺'
                layer.open({
                    title: TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    shade:SHADE,
                    btn:['修改','取消'],
                    end: function (layero,index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success:function (layero,index) {
                        setForms('editForm')
                        $('#imageUrl').attr('src',reData.imageUrl);
                        $('#shopName').val(reData.shopName)
                        $('#shopId').val(reData.shopId);
                        $('#description').val(reData.description)
                    },
                    yes:function (index) {
                        form.on('submit(editForm)',function (data) {
                            if(data){
                                saveFunc(index,reData.id)
                            }
                        })
                        return false
                    }
                })
            }else if(obj.event == 'del'){
                TITLE[0] = '提示'
                layer.confirm('确定删除【'+reData.shopName+'】？',{title:TITLE},function (index) {
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify({id:reData.id})).done(function (res) {
                        if(res.code == 1){
                            init_obj();
                        }
                        layer.msg(res.msg)
                    })
                })

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
                        width: 80
                    }, {
                        title: '店铺名称',
                        align: 'left',
                        field: 'shopName',
                        width: 180
                    }, {
                        title: '展示图片',
                        align: 'left',
                        field: 'imageUrlImg',
                        width: 180
                    }, {
                        title: '所属城市',
                        align: 'left',
                        field: 'cityName',
                        width: 100,
                    }, {
                        title: '所属行业',
                        align: 'left',
                        field: 'tradeName',
                        width: 100,
                    },  {
                        title: '标签类型名称',
                        align: 'left',
                        field: 'labelName',
                        width: 120,
                    },{
                        title: '标签分类',
                        align: 'left',
                        field: 'labelTypeName',
                        width: 100,
                    },{
                        title: '店铺状态',
                        align: 'left',
                        field: 'shopStatusName',
                        width: 100,
                    },{
                        title: '创建者',
                        align: 'left',
                        field: 'createUserName',
                        width: 150,
                    },{
                        title: '创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 200,
                    },{
                        title: '店铺描述',
                        align: 'left',
                        field: 'descriptions',
                        width: 200,
                    },{
                        title: '操作',
                        align: 'left',
                        toolbar:'#barDemo',
                        fixed:'right',
                        width: 150,
                    }]
                ],

                pageCallback, 'page'
            );
        }

        function init_obj1() {
            var objs = tableInit('tableDemo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '店铺名称',
                        align: 'left',
                        field: 'shopName',
                        width: 180
                    }, {
                        title: '所属行业',
                        align: 'left',
                        field: 'tradeName',
                        width: 180
                    }, {
                        title: '店铺状态',
                        align: 'left',
                        field: 'cityName',
                        width: 100,
                    }, {
                        title: '所属城市',
                        align: 'left',
                        field: 'cityName',
                        width: 100,
                    },{
                        title: '操作',
                        align: 'left',
                        toolbar:'#barDemoer',
                        fixed:'right',
                        width: 150,
                    }]
                ],

                pageCallback1, 'laypageLeftLayer'
            );
        }
        //pageCallback1回调
        function pageCallback1(index, limit) {
            var params = {
                pageNo: index,
                pageSize: limit,
                shopName:$.trim($('#userName').val()) || '',
            }
            return getData(USER_URL.GETSHOP, JSON.stringify(params));
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var params = {
                pageNo: index,
                pageSize: limit,
                shopName:$.trim($('#orgNames').val()) || '',
                trade:$.trim($('#tradeList').val()) || '',
                cityId:$.trim($('#citySelector').val()) || '',
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
                        item.imageUrlImg = '<img src="'+item.imageUrl+'"/>'
                        item.shopStatusName = item.shopStatus==0?'上线':'下线'
                        item.descriptions = item.description?item.description:'-';
                        item.labelTypeName = item.labelType == 3?'店铺标签':'';

                    })

                }else{
                    layer.msg(res.msg)
                }
            })


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

