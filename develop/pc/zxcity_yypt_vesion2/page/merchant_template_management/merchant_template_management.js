$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer;
        form.render();
        var AREA = ['90%', '90%'];
        var TITLE = ['完善商户信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var USER_URL = {
            RESOURLIST : 'operations/getMerchantTradeTemplatePageListByData', //(查询列表)
            UPDATELIST : 'operations/updateMerchantTradeTemplate',//(修改)
            DELETELIST : 'operations/deleteMerchantTradeTemplate', //(删除)
            ADDLIST : 'operations/addMerchantTradeTemplate'//(添加)
        };
        //搜索
        $('#toolSearch').on('click', function() {
            init_obj();
        })
        //重置功能
        $('#toolRelize').on('click', function() {
            $("#name").val('');
            form.render();
            init_obj();
            // pageCallback(1,15)
        })

        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');

        })
        //表格
        function tableInit(tableId, cols, pageCallback, test) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                // height: 'full-185',
                cols: cols,
                page: false,
                even: true,
                skin: 'row',
                limit: 15
            });

            //2.第一次加载
            var res = pageCallback(1, 15);
            //第一页，一页显示15条数据
            if(res) {
                if(res.code == 1) {
                    tableIns.reload({
                        data: res.data
                    })
                } else {
                    layer.msg(res.msg)
                }
            }

            //3.left table page
            layui.use('laypage');

            var page_options = {
                elem: 'pageLeft',
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

            layui.laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
        }
        //渲染表格
        function init_obj() {
            var _obj = tableInit('tabNo', [
                    [{
                        title: '序号',
                        sort:false,
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '行业模板名',
                        sort:false,
                        align: 'left',
                        field: 'templateName',
                        width: 200
                    }, {
                        title: '销售开单是否必须选择可占用设备',
                        sort:false,
                        align: 'left',
                        field: '_isallowSaler',
                        width: 250
                    },{
                        title:'是否启用可占用设备',
                        sort:false,
                        align:'left',
                        field:'_occupiedDeviceEnabled',
                        width:200

                    },{
                        title:'可占用设备类别',
                        sort:false,
                        align:'left',
                        field:'occupyDeviceCategory',
                        width:200

                    },{
                        title:'默认是否',
                        sort:false,
                        align:'left',
                        field:'_defaultWhether',
                        width:200

                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 350
                    }]
                ],
                pageCallback,'pageLeft'
            )
        }
        init_obj()
        //回调
        function pageCallback(index, limit) {
            var templateName = $.trim($("#name").val());
            var param = {
                page :index,
                rows :limit,
                templateName:templateName
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(param));

        }
        //获取数据
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data;

            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                if(item.isallowSaler === 0) {
                    $(item).attr('_isallowSaler', '否');
                } else {
                    $(item).attr('_isallowSaler', '是');
                }
                if(item.occupiedDeviceEnabled === 0) {
                    $(item).attr('_occupiedDeviceEnabled', '停用');
                } else {
                    $(item).attr('_occupiedDeviceEnabled', '启用');
                }
                if(item.defaultWhether === 0){
                    $(item).attr('_defaultWhether', '否');
                }else{
                    $(item).attr('_defaultWhether', '是');
                }
            });
            return res;
        }
        table.on('tool(tabNo)', function(obj) {
            var data = obj.data;
            var oldId = data.id;
            var demo = $("#demo111")
            console.log(obj);
            //查看
            if(obj.event === 'nodetail') {
                layer.open({
                    title: ['详情', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    btn: ['确定'],
                    content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    end: function(index) {
                        layer.close(index)
                        demo.hide();
                    },
                    success: function(layero, index) {
                        //清除input框 并disabled
                        //弹窗不可操作
                        disabled(demo);
                        //填充数据
                        getDatas(data)
                        //清除表单功能
                        delForms();
                        form.render()
                    },
                    yes: function(index, layero) {
                        layer.close(index)
                        demo.hide();
                    }
                });
                //
            }
            else if(obj.event === 'change'){
                layer.open({
                    title: ['修改', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    btn: ['保存', '取消'],
                    content:demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    end: function() {
                        demo.hide();
                    },
                    success: function(layero, index) {
                        //弹窗可操作
                        enabled(demo);
                        //获取数据
                        getDatas(data);
                        //给保存按钮 赋值表单功能
                        setForms();
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(formDemo)',function(done){
                            if(done){
                                getParams('修改',USER_URL.UPDATELIST,data.id,index)
                            }
                        });
                    }
                });

            }else if(obj.event === 'del'){
                //删除
                layer.confirm("确认删除【"+data.templateName+"】？",{icon:0,title:"提示"}, function (index) {
                    var parms = {
                        id:oldId
                    };
                    reqAjaxAsync(USER_URL.DELETELIST,JSON.stringify(parms)).done(function(res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg("已删除");
                            init_obj();
                        }else {
                            layer.msg(res.msg);
                        };
                    });
                })
            }
        })
        $('#commonAdd').click(function () {
            var demo = $("#demo111")
            layer.open({
                title: ['新增', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                type: 1,
                btn: ['保存', '取消'],
                content:demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                end: function() {
                    demo.hide();
                },
                success: function(layero, index) {
                    //弹窗可操作
                    enabled(demo);
                    //清空数据
                    emptyDatas();
                    //给保存按钮 赋值表单功能
                    setForms();
                    form.render()
                },
                yes: function(index, layero) {
                    form.on('submit(formDemo)',function(done){
                        if(done){
                            getParams('新增',USER_URL.ADDLIST,'',index)
                        }
                    });
                }
            });
        })
        $('#refresh').click(function () {
            init_obj();
        })
        //获取params
        function getParams(msg,cmd,id,index){
            var templateName = $('#tradeName').val();
            var occupyDeviceCategory = $('#type').val();
            var isallowSaler = $('#choice').val();
            var occupiedDeviceEnabled = $('#enabled').val();
            var defaultWhether = $('#default').val();
            var param = {}
            if(id === ''){
                param = {
                    templateName : templateName,
                    occupyDeviceCategory : occupyDeviceCategory,
                    isallowSaler:isallowSaler,
                    occupiedDeviceEnabled:occupiedDeviceEnabled,
                    defaultWhether:defaultWhether

                }
            }else{
                param = {
                    id:id,
                    templateName : templateName,
                    occupyDeviceCategory : occupyDeviceCategory,
                    isallowSaler:isallowSaler,
                    occupiedDeviceEnabled:occupiedDeviceEnabled,
                    defaultWhether:defaultWhether

                }
            }

            reqAjaxAsync(cmd,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.close(index);
                    layer.msg(msg+"成功");
                    init_obj();
                }else{
                    layer.msg(res.msg);
                }
            });
        }
        //赋值表单功能
        function setForms(){
            //给保存按钮添加form属性
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter","formDemo");
        }
        //清除表单功能
        function delForms () {
            $("div.layui-layer-page").removeClass("layui-form");
            $("a.layui-layer-btn0").removeAttr("lay-submit");
            $("a.layui-layer-btn0").removeAttr("lay-filter");
        }
        //弹框清空数据数据
        function emptyDatas(){
            $('#tradeName').val('');
            $('#type').val('');
            $('#enabled').val('');
            $('#choice').val('');
            $('#default').val('');
        }

        //弹框填充数据
        function getDatas(data){
            $('#tradeName').val(data.templateName);
            $('#type').val(data.occupyDeviceCategory);
            $('#enabled').val(data.occupiedDeviceEnabled)
            $('#choice').val(data.isallowSaler)
            $('#default').val(data.defaultWhether)
        }
        //弹窗可操作
        function enabled(demo){
            demo.find('input').val('').removeAttr('disabled').removeAttr('readonly');
            demo.find('select').removeAttr('disabled').removeAttr('readonly');
        }
        //弹窗不可操作
        function disabled(demo){
            demo.find('input').val('').attr('disabled','disabled').attr('readonly','readonly');
            demo.find('select').attr('disabled','disabled').attr('readonly','readonly');
        }



        //layer展开
        $('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
            if($(this).children('i.description').html() == '展开') {
                $(this).children('i.description').html('收起')
                $(this).children('i.icon').addClass('deg');
                $(this).parent().siblings('.app-layer-content').children('ul').hide();
                $(this).parent().siblings('.app-layer-content').children('.layer-place').show();
            } else {
                $(this).children('i.description').html('展开')
                $(this).children('i.icon').removeClass('deg');
                $(this).parent().siblings('.app-layer-content').children('ul').show();
                $(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
            }
        })
        $('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
            $(this).hide();
            $(this).siblings('ul').show();
            $(this).parent().siblings().children('.package-some').children('.description').html('展开');
            $(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
        })
    })
})