

$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var dataTr = {};
        var USER_URL = {
            LISTS:'earnmoney/getPlayerGoodsList',//(列表)
            UPDATESTATUS:'earnmoney/updatePlayerCouponStatus',//更新状态
            DETAIL:'earnmoney/getPlayerCouponDetail',//查看
            GETPLAYER:'earnmoney/getPlayerCouponUserList',//获取中奖列表
            DEL:'earnmoney/deletePlayerGoods',//删除
            GETORGANDAREA:'earnmoney/getPlayerOrgAndArea',//获取相关信息,
            ADD:'earnmoney/addPlayerGoods',
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
        var areaData = {};
        var imgPath ='../../common/images/upload.png';

        $('#addBtn').click(function () {
            var el = $('#addDemo');
            AREA=['50%','700px']
            layerOpen('添加实物商品',el,'addDemo','')
            if(!$('#merchantId').html()){
                reqAjaxAsync(USER_URL.GETORGANDAREA,'').done(function (res) {
                    if(res.code == 1){
                        console.log(res.data)
                        var orgList = res.data.sso;
                        var orgStr = '<option value="">请选择</option>';
                        $.each(orgList,function (i, item) {
                            orgStr += '<option value="'+item.merchantId+'">'+item.orgName+'</option>'
                        })
                        $('#merchantId').html(orgStr);
                        var areaList = areaData = res.data.area;
                        var merStr = ''
                        $.each(areaList,function (j, items) {
                            if(items.parentcode == 0){
                                merStr += '<option value="'+items.code+'">'+items.areaname+'</option>'
                            }
                        })
                        $('#areaId').html(merStr).find('option')[0].checked;
                        getCity(11)

                    }
                })
            }else{
                $('#areaId').val(11)
                getCity(11)
                $('#prizeStyle').attr('src',imgPath)
            }
            form.render()
            form.on('submit(addDemo)',function (obj) {
                if(obj){
                    var prizeStyle = $('#prizeStyle').attr('src')
                    if(imgPath == prizeStyle){
                        layer.msg('请上传实物图片',{icon:2,anim:6})
                        return
                    }
                    var params = {
                        merchantId:$('#merchantId').val(),
                        prizePrice:$('#prizePricess').val(),
                        prizeTitle:$('#prizeTitless').val(),
                        prizeExplain:$('#prizeExplains').val(),
                        prizeStyle:prizeStyle,
                        cityId:$('#cityId').val()
                    }
                    reqAjaxAsync(USER_URL.ADD,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            init_obj();
                        }
                        layer.close(_index)
                        layer.msg(res.msg)
                    })
                }
            })


        })
        // imageUrl
        uploadOss({
            btn: "prizeStyle",
            flag: "img",
            size: "5mb"
        });
        form.on('select(provice)',function (obj) {
            console.log(obj)
            var pid= obj.value;
            getCity(pid)
        })
        function getCity(pid){
            var cityStr = '';
            $.each(areaData,function (i, item) {
                if(item.parentcode == pid){
                    cityStr+= '<option value="'+item.code+'">'+item.areaname+'</option>'
                }
            })
            $('#cityId').html(cityStr);
            form.render();
        }
        table.on('tool(tableNo)',function (obj) {
            var reData = obj.data;
            dataTr = reData;
            if(obj.event == 'switch'){
                if(flag){
                    flag = 0;
                    var checked = $(this).find('input')[0].checked;
                    var self = $(this);
                    var params = {
                        prizeId:reData.id,
                        prizeStatus:checked?1:2
                    }
                    reqAjaxAsync(USER_URL.UPDATESTATUS,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            layer.msg('操作成功!',{icon:1})
                        }else{
                            self.find('input')[0].checked = false;
                            layer.msg(res.msg)
                        }
                        form.render();
                    })
                }

            }else if(obj.event == 'detail'){
                var el = $('#detailDemo');
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
            }else if(obj.event == 'del'){
                TITLE[0] = '提示'
                layer.confirm('确定删除【'+reData.orgName+'】实物奖品？',{title:TITLE},function (index) {
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify({prizeId:reData.id})).done(function (res) {
                        if(res.code == 1){
                            init_obj();
                        }
                        layer.msg(res.msg)
                    })
                })

            }
        })
        var flag = 0 ;
        form.on('switch(switchTest)',function(obj){
            flag = 1;
        })
        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100,
                    }, {
                        title: '商户名称',
                        align: 'left',
                        field: 'orgName',
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
                        title: '面额(元)',
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
                        width: 150,
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
                orgName:$.trim($('#orgNames').val()) || '',
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
