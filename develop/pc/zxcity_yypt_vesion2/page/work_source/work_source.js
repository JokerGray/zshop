$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form, table = layui.table, layer = layui.layer, laydate = layui.laydate,
            laypage = layui.laypage;
        form.render();
        var userno = yyCache.get('userId') || ''
        var AREA = ['90%', '90%'];
        var TITLE = ['新增来源', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var imgPath = '../../common/images/placeholder.png';

        var USER_URL = {
            RESOURLIST: 'payZyzz/newZyzzSourcePage', //(查询列表)
            UPDATESOURCE:'payZyzz/updateZyzzSource',//修改
            SAVESOURCE:'payZyzz/saveZyzzSource',//保存
            DEL:'payZyzz/delScZyzzWorkSource',//删除来源
        }
        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        })
        //添加
        $('#addBtn').click(function () {
            let el = $('#demo222')
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                btn:['确认','取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success: function (layero, index) {
                    setForms('addForm');
                },
                yes: function (index) {
                    form.on('submit(addForm)',function (data) {
                        if(data){
                            setSaveBtn(el,index,USER_URL.SAVESOURCE)
                        }
                        return false;
                    })
                },btn2:function (index) {
                    layer.close(index);
                }
            })
        })

        //工单列表
        function init_obj () {
            var _obj = tableInit('demo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '来源名称',
                        align: 'left',
                        field: 'name',
                        width: 150
                    }, {
                        title: '备注',
                        align: 'left',
                        field: 'remark',
                        width: 250
                    }, {
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar: '#barDemo',
                        width: 200
                    }]
                ],
                pageCallback,'laypageLeft'
            )
        }
        init_obj()

        //工单数据处理
        function getData (url, parms) {
            var res = reqAjax(url, parms)
            var data = res.data
            console.log(data)
            $.each(data, function (i, item) {
                $(item).attr('eq', (i + 1))
            })
            return res
        }
        //pageCallback回调
        function pageCallback (index, limit) {
            var params = {
                page: index,
                rows: limit,
            };

            return getData(USER_URL.RESOURLIST,JSON.stringify(params))
        }

        table.on('tool(demo)', function (obj) {
            var reData = obj.data
            let el = $('#demo222')
            var ids = reData.id;
            console.log(reData)
            //查看
            if (obj.event === 'change') {
                layer.open({
                    title: ['修改工单', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    btn:['确认','取消'],
                    end: function (index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success: function (layero, index) {
                        setForms('changeForm');
                        setDatas(el,reData);
                    },
                    yes: function (index) {
                        form.on('submit(changeForm)',function (data) {
                            if(data){
                                setSaveBtn(el,index,USER_URL.UPDATESOURCE,ids)
                            }
                            return false;
                        })
                    },btn2:function (index) {
                        layer.close(index);
                    }
                })
            } else if(obj.event ==='del'){
                layer.confirm('是否删除【'+reData.name+'】?',{icon:0,title:"提示"},function (index) {
                    var parms = {
                        id:ids
                    };
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg("删除成功");
                            init_obj();
                        }else {
                            layer.msg(res.msg);
                        };
                    })
                })
            }
        })


        function tableInit (tableId, cols, pageCallback, pages) {
            var tableIns, tablePage
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: 'full-340',
                cols: cols,
                page: false,
                even: true,
                skin: 'row',
                limit: 15
            })

            //2.第一次加载
            var res = pageCallback(1, 15)
            //第一页，一页显示15条数据
            if (res) {
                if (res.code == 1) {
                    tableIns.reload({
                        data: res.data
                    })
                } else {
                    layer.msg(res.msg)
                }
            }

            //3.left table page
            layui.use('laypage')

            var page_options = {
                elem: pages,
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                limits: [15, 30],
                limit: 15
            }
            page_options.jump = function (obj, first) {
                tablePage = obj

                //首次不执行
                if (!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit)
                    if (resTwo && resTwo.code == 1)
                        tableIns.reload({
                            limit: obj.limit,
                            data: resTwo.data
                        })
                    else
                        layer.msg(resTwo.msg)
                }
            }

            layui.laypage.render(page_options)

            return {
                tablePage,
                tableIns
            }
        }
        //调用保存接口

        function setForms(form){
            //给保存按钮添加form属性
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }

        function setSaveBtn(demo,index,cmd,ids){


            var paramInfo={
                name:$('#name').val()||'',
                remark:$('#remark').val()||''
            }
            if(cmd === USER_URL.UPDATESOURCE){
                paramInfo.id =ids;
            }
            var res =reqAjax(cmd,JSON.stringify(paramInfo));
            if(res.code == 1){
                layer.msg('操作成功');
                layer.close(index);
                init_obj();
                demo.hide();
            }
        }
        //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            $('#remark').val(data['remark']);
            form.render()

        }
        //遍历数组，填充数据
        function setArr(arr,data,img){
            var ids = '';
            $.each(arr,function (index, item) {
                ids = $(this).attr('id');
                if(data.hasOwnProperty(ids)){
                    if(img !== undefined){
                        $(this).attr('src',data[ids] || imgPath)
                    }else{
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        function emptyInput(demo){
            demo.hide().find("input[type='text']").val("");
            var checkBox = demo.find("input[type='checkbox']");
            $.each(checkBox,function (index,el) {
                el.checked = false;
            })
            demo.find("img").attr("src", '');
            demo.find('textarea').val('');
            demo.find('select').val('');
            form.render()
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
