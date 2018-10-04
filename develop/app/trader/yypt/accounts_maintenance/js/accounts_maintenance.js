$(function(){
    layui.use(['form', 'layer', 'laydate', 'table', 'laypage'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laypage=layui.laypage;

        var page = 1;
        var rows = 15;

        var merchantId=getUrlParams("merchantId"); //商户id
        var shopId=getUrlParams("shopId");//商铺id
        var userId =getUrlParams("userId"); //当前登录帐号id
        var userCode = getUrlParams('userCode') || sessionStorage.getItem("userCode"); //当前登录帐号
        var userName = getUrlParams('userName') || sessionStorage.getItem("userName"); //当前登录帐号名称

        var AREA = ['745px'];
        var TITLE = '';
        var SHADE = [0.2, '#000'];
        var USER_URL = {
            RESOURLIST: 'backstage/findAccountCategory', //(查询列表)
            ADDACOUNT:'backstage/addAccountCategory',//新增账目
            DELETE:'backstage/deleteAccountCategory',//删除账目
            UPDATE:'backstage/updateAccountCategory',//修改账目
        };
        //点击变色
        $('body').on('click', '.layui-form .layui-table-body tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        });
        $('#searchBtn').click(function () {
            init_obj()
        })
        $('#restBtn').click(function () {
            $('.hearder').find('input,select').val('');
            init_obj();
        })

        //表格
        function tableInit(tableId, cols, pageCallback, pageLeft) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                // height: 'full-185',
                cols: cols,
                page: false,
                // even: true,
                skin: 'line',
                limit: 15
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
                    layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
                    limits: [15, 30], 
                    limit: 15
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
        //渲染表格
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 200
                    }, {
                        title: '收支类型',
                        align: 'left',
                        field: 'incOrExpName',
                        width: 224
                    }, {
                        title: '账目类型',
                        align: 'left',
                        field: 'accountCategoryName',
                        width: 224
                    }, {
                        title: '备注',
                        align: 'left',
                        field: 'remarks',
                        width: 330
                    }, {
                        title: '创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 300,
                        event: 'changeSwitch'
                    },{
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar: '#barDemo',
                        width: 250
                    }]
                ],

                pageCallback, 'laypageLeft'
            );
        }
        init_obj()
        $('.layui-table-main').niceScroll({
            cursorcolor:"#dfdfdf",
            cursorborder:"0",
            autohidemode:false,
            cursorwidth:'10px'
        });

        //回调
        //pageCallback回调
        function pageCallback(index, limit) {
            var params = {
                page: index,
                rows: limit,
                incOrExp: $.trim($('#incOrExp_search').val())||'',
                accountCategoryName:$.trim($('#accountCategoryName_search').val())||'',
                merchantId: merchantId
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(params));
        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url, parms).done(function (res) {
                var data = res.data
                console.log(data)
                $.each(data, function (i, item) {
                    $(item).attr('eq', (i + 1))
                    if(item.incOrExp == 1){
                        $(item).attr('incOrExpName','收入')
                    }else if(item.incOrExp == 2){
                        $(item).attr('incOrExpName','支出')
                    }
                })
                deff.resolve(res)
            })
            return deff.promise();
        }
        //点击
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            TITLE = ['新增账目', 'font-size:16px;background-color:#353b53;color:#1ce6d8'];
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                btn:'',
                end: function (layero,index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success:function (layero,index) {
                    $('#incOrExp').attr('disabled',false)
                    form.render();
                    form.on('submit(sub)',function (data) {
                        if(data){
                            let params = {
                                accountCategoryName:$.trim($('#accountCategoryName').val()),
                                incOrExp:$.trim($('#incOrExp').val()),
                                remarks:$.trim($('#remarks').val()),
                                usercode:userCode || 'test',
                                merchantId:merchantId,
                            };
                            reqAjaxAsync(USER_URL.ADDACOUNT,JSON.stringify(params)).done(function (res) {
                                if(res.code == 1){
                                    init_obj();
                                }
                                layer.msg(res.msg)
                                layer.close(index)
                            })

                        }

                    })
                    $('#cancel').click(function () {
                        layer.close(index)
                    })
                }
            })
        })
        //表格操作
        table.on('tool(tableNo)',function (obj) {
            var reDatas = obj.data;
            var ids = reDatas.id;
            // if(reDatas.merchantId === 0){
            //     layer.msg('通用类型，禁止操作')
            //     return false
            // }
            if(obj.event =='edit'){
                var el = $('#addDemo');
                TITLE = ['修改账目', 'font-size:16px;background-color:#353b53;color:#1ce6d8'];
                layer.open({
                    title: TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    btn:'',
                    end: function (layero,index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success:function (layero,index) {
                        $('#incOrExp').attr('disabled',true)
                        setDatas(el,reDatas)
                        form.on('submit(sub)',function (data) {
                            if(data){
                                let parms = {
                                    id:ids,
                                    accountCategoryName:$.trim($('#accountCategoryName').val()),
                                    remarks:$.trim($('#remarks').val()),
                                    usercode:userCode || 'test',
                                    merchantId:merchantId,
                                };
                                reqAjaxAsync(USER_URL.UPDATE,JSON.stringify(parms)).done(function (res) {
                                    if (res.code == 1) {
                                        layer.close(index);
                                        layer.msg("修改成功");
                                        init_obj();
                                    }else {
                                        layer.msg(res.msg);
                                    };
                                })
                                layer.close(index)
                            }
                            layer.close(index)

                        })
                        $('#cancel').click(function () {
                            layer.close(index)
                        })
                    }
                })
            }else if(obj.event == 'del'){
                console.log(obj.data)
                layer.confirm('是否删除序号【'+reDatas.eq+'】的数据?',{icon:0,title:['提示','font-size:16px;background-color:#353b53;color:#1ce6d8']},function (index) {
                    var parms = {
                        ids:ids,
                        merchantId:merchantId,
                    };
                    reqAjaxAsync(USER_URL.DELETE,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg("删除成功");
                            init_obj();
                        }else {
                            layer.msg(res.msg);
                        };
                    })
                    layer.close(index)
                })
            }
        })
        //清空数据
        function emptyInput(demo){
            demo.find('textarea,input,select').val('');
            form.render()
        }
        //填充数据
        //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            var selectArr = demo.find('select');
            var textareaArr = demo.find('textarea');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            setArr(selectArr,data);
            setArr(textareaArr,data)
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
        function getParams(){

        }
    })
})