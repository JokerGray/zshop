var table,form,laypage,layer,laydate;
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;

        form.render();
        var USER_URL = {
            MERCHANTLIST:'operations/getMerchantPageList', //(商户查询列表)
            SHOPLIST: 'operations/getShopTurnoverStatisticsList', //(店铺数据归档列表查询)
            ADD: 'operations/addOperationsMerchantTurnoverStatistics',//运营后台商户归档信息新增
            SHOPNAME:'backUser/listMerShops'//店铺名称
        };
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#009688'
        });
        laydate.render({
            elem: '#date1'
            // ,type: 'datetime'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#009688'
        });
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header1').find('input,select').val('')
            init_obj()
        })
        $('#searchBtn1').click(function () {
            init_obj1();
        })
        $('#restBtn1').click(function () {
            $('.header').find('input,select').val('')
            init_obj1()
        })
        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80,
                        event:'clickAble'
                    }, {
                        title: '商户名称',
                        align: 'left',
                        field: 'orgName',
                        width: 150,
                        event:'clickAble'
                    }, {
                        title: '手机号',
                        align: 'left',
                        field: 'phone',
                        width: 150,
                        event:'clickAble'
                    }, {
                        title: '创建时间',
                        align: 'left',
                        field: 'createDatetime',
                        width: 250,
                        event:'clickAble'
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 150
                    }
                    ]
                ],

                pageCallback, 'page'
            );
        }

        function init_obj1() {
            var objs = tableInit('tableNo1', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '店铺名称',
                        align: 'left',
                        field: 'shopName',
                        width: 150
                    }, {
                        title: '归档日期',
                        align: 'left',
                        field: 'statisticsDate',
                        width: 150
                    }, {
                        title: '销售',
                        align: 'left',
                        field: 'sales',
                        width: 150
                    }, {
                        title: '消耗',
                        align: 'left',
                        field: 'consumption',
                        width: 150
                    }, {
                        title: '费用',
                        align: 'left',
                        field: 'cost',
                        width: 150
                    }
                    ]
                ],

                pageCallback1, 'page1'
            );
        }

        //pageCallback回调
        function pageCallback(index, limit) {
            var phone = $.trim($("#phone").val())||"";
            var orgName = $("#orgNames").val()||"";
            var param = {
                page: index,
                rows: limit,
                phone: phone, //手机号
                orgName:orgName//商户名称
            }
            return getData(USER_URL.MERCHANTLIST, JSON.stringify(param));
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



        //pageCallback回调
        function pageCallback1(index, limit) {
            var merchantId = sessionStorage.getItem('mId') || '';
            var shopId = $("#chargeType").val()||"";
            var time = $('#date').val().split(' 至 ')
            var params = {
                page: index,
                rows: limit,
                merchantId: merchantId,
                shopId:shopId,
                startDate:time[0] || '',
                endDate:time[1] || time[0] || '',
            }
            return getData1(USER_URL.SHOPLIST, JSON.stringify(params));
        }
        //获取数据
        function getData1(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        item.statisticsDate = item.statisticsDate.slice(0,10)
                    })
                    deff.resolve(res);
                }else{
                    layer.msg(res.msg)
                }
            })
            return deff.promise();

        }
        //修改
        table.on('tool(tableNo)',function (obj) {
            AREA = '50%'
            var el = $('#addDemo');
            var data=obj.data;
            var merchantId=data.merchantId;
            if(obj.event==='clickAble'){
                //渲染店铺名
                var parm={
                    merchantId:merchantId
                };
                reqAjaxAsync(USER_URL.SHOPNAME,JSON.stringify(parm)).then(function(res){
                    var data=res.data;
                    var mHtml='<option value="">-请选择-</option>';
                    for(var i=0;i<data.length;i++){
                        mHtml+='<option value="'+data[i].id+'">'+data[i].shopName+'</option>'
                    }
                    $('#chargeType').html(mHtml);
                    form.render();
                });
                if(merchantId==null){
                    return false
                }else{
                    sessionStorage.setItem('mId',merchantId);

                    init_obj1();
                }

            }else if(obj.event === 'edit'){
                setDatas(el,data);
                layerOpen('归档',el,'addForm','');
                form.on('submit(addForm)',function (data) {
                    if(data){
                        var time = $('#date1').val().split(' 至 ')
                        var parm={
                            startDate:time[0] ||'',
                            endDate:time[1] ||time[0] ||'',
                            merchatId:merchantId
                        };
                        reqAjaxAsync(USER_URL.ADD,JSON.stringify(parm)).then(function(res){
                            if(res.code == 1) {
                                layer.msg('归档成功');
                                init_obj()
                            }else{
                                layer.msg(res.msg);
                            }
                            layer.close(_index);
                        })
                    }
                    return false;
                })
            }
        })
    })

})

