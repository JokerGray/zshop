//清空数据
function emptyInput(demo){
    demo.find('textarea').val('');
    $('#name,#amountMin,#amount,#couponLevel,#date').val('')
    form.render()
}

$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var dataTr = {};
        var userno = yyCache.get("userno") || "6";
        var USER_URL = {
            LISTS:'operations/selectAllScCouponPage',//(列表)
            ADD:'operations/addScCoupon',//新增
            DEL:'operations/deleteScCoupon',//删除

        };
        //时间控件
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#009688'
        });
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input,select').val('')
            init_obj()
        })

        $('#addBtn').click(function () {
            var el = $('#addDemo');
            var el = $('#addDemo');
            AREA=['50%','auto']
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
        //获取参数
        function getParams(el) {
            var input = el.find('input,textarea,select');
            var img = el.find('img');
            var params = {};
            $.each(input,function (i, item) {
                if(item.id){
                    params[item.id] = item.value
                }
            })
            $.each(img,function (j, items) {
                if(items.id && items.src != ''){
                    params[item.id] = item.src
                }
            })

            return params;
        }

        function saveFunc(index,ids) {
            var el = $('#addDemo');
            var params = getParams(el);
            var time = $('#date').val().split(' 至 ');
            $(params).removeAttr('date');
            params.beginTime = time[0];
            params.endTime = time[1] || time[0]
            params.status = "1";
            params.modelType = "06";
            params.merchantId = '0';
            console.log(params)
            if(params.amount > params.amountMin){
                layer.msg('优惠金额不能大于最低消费',{icon:2})
                return
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
                AREA=['50%','500px']
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
                layer.confirm('确定删除【'+reData.name+'】优惠券？',{title:TITLE},function (index) {
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
                        title: '名称',
                        align: 'left',
                        field: 'name',
                        width: 180
                    }, {
                        title: '优惠类型',
                        align: 'left',
                        field: 'couponType',
                        width: 120
                    }, {
                        title: '单人可领总数',
                        align: 'left',
                        field: 'numberOne',
                        width: 120,
                    }, {
                        title: '可用数量',
                        align: 'left',
                        field: 'numberTotal',
                        width: 100,
                    },  {
                        title: '最低可用金额',
                        align: 'left',
                        field: 'amountMin',
                        width: 120,
                    },{
                        title: '优惠金额',
                        align: 'left',
                        field: 'amount',
                        width: 100,
                    },{
                        title: '优惠券等级',
                        align: 'left',
                        field: 'couponLevel',
                        width: 100,
                    },{
                        title: '可用状态',
                        align: 'left',
                        field: 'status',
                        width: 120,
                    },{
                        title: '创建者',
                        align: 'left',
                        field: 'creatorName',
                        width: 100,
                    },{
                        title: '创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 150,
                    },{
                        title: '开始时间',
                        align: 'left',
                        field: 'beginTime',
                        width: 150,
                    },{
                        title: '结束时间',
                        align: 'left',
                        field: 'endTime',
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
                page: index,
                rows: limit,
                name:$.trim($('#names').val()) || '',
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
                        item.numberOne = item.numberOne?item.numberOne:'无';
                        item.numberTotal = item.numberTotal?item.numberTotal:'无';
                        item.amount = item.amount?item.amount:'无';
                        item.couponLevel = item.couponLevel?item.couponLevel:'无';
                        item.status = item.status==1?'可用':(item.status == 0 ? '删除':'不可用')
                        if(item.couponType == '00'){
                            item.couponType = "通用券";
                        }else if(item.couponType == '01'){
                            item.couponType = "优惠券";
                        }else if(item.couponType == '02'){
                            item.couponType = "减免券";
                        }else if(item.couponType == '03'){
                            item.couponType = "包邮券";
                        }
                        if(item.endTime){
                            item.endTime = (item.endTime).slice(0,10)
                        }
                        if(item.beginTime){
                            item.beginTime = (item.beginTime).slice(0,10)
                        }
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }
    })

})

