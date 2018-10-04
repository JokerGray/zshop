$(function(){
    layui.use(['form', 'layer', 'table', 'laypage' ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate
        form.render();
        var page = 1;
        var rows = 15;
        var AREA = ['90%', '90%'];
        var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var tradeObj = {};
        var USER_URL = {
            LISTS:'user/selConditionListPage',//(列表)
            ADD:'user/addLeapCondition',//新增
            DEL:'user/delLeapCondition',
            UPDATE:'user/editLeapCondition',//修改

        };
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input,select').val('')
            init_obj()
        })
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            TITLE[0] = '新增流程'
            layer.open({
                title:TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['auto'],
                btn: ['确认', '取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el)
                },
                success:function (index) {
                    setForms('addForm');
                },yes:function (index) {
                    form.on('submit(addForm)',function (obj) {
                        if(obj){
                            saveFun(USER_URL.ADD,index)
                        }
                    })
                }
            })
        })
        function saveFun(url,index,ids) {
            var levelTypeId = $('#levelTypeId').val();
            var upgradingType = $('#upgradingType').val();
            var upgradingConditions = $('#upgradingConditions').val();
            var downLevelTypeId = $('#dowmLevelName').val() ||'';
            var params ={
                levelTypeId:levelTypeId,
                upgradingType:upgradingType,
                upgradingConditions:upgradingConditions,
            }
            if(upgradingType == 2){
                params.downLevelTypeId = downLevelTypeId;
            }
            if(ids){
                params.id = ids;
            }
            reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }
                layer.msg(res.msg)
                layer.close(index);
            })
            layer.close(index)
        }
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
                        $(this).attr('src',data[ids] || '../../common/images/placeholder.png')
                    }else{
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        //清空数据
        function emptyInput(demo){
            demo.find('textarea,input,select').val('').prop('checked',false);
            demo.find('img').attr('src','');
            demo.find('input,select,textarea').attr('disabled',false)
            $('.dowmLevelName').hide()
            form.render()
        }
        //给保存按钮添加form属性
        function setForms(form){
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }
        form.on('select(upgradingTypeName)',function (obj) {
            var va = obj.value;
            var p = $(this).parents('.layui-form-item')
            if(va == 2){
                p.next().show();
            }else{
                p.next().hide();
            }
           console.log(obj)
        })
        //表格操作
        table.on('tool(tableNo)', function (obj) {
            var reData = obj.data
            let el = $('#addDemo')
            var ids = reData.id;
            //查看
            if (obj.event === 'edit') {
                TITLE[0]='修改模板'
                layer.open({
                    title:TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['auto'],
                    btn:['确认','取消'],
                    end: function (index) {
                        layer.close(index);
                        emptyInput(el)
                    },
                    success: function (index) {
                        setDatas(el,reData)
                        setForms('changeForm')
                        if(reData.upgradingType == 2){
                            $('.dowmLevelName').show();
                            $('#dowmLevelName').val(reData.downLevelTypeId)
                        }
                        form.render()
                    },yes:function (index) {
                        form.on('submit(changeForm)',function(obj){
                            if(obj){
                                saveFun(USER_URL.UPDATE,index,reData.id)
                            }
                        })
                        
                    }
                })
            } else if(obj.event ==='del'){
                layer.confirm('是否删除【'+reData.levelName+'】?',{icon:0,title:"提示"},function (index) {
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
        //表格模板
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
                    layout: ['count', 'prev', 'page', 'next','limit'],
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
                        });

                    }
                }

                laypage.render(page_options);

                return {
                    tablePage,
                    tableIns
                };
            });

        }
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100
                    }, {
                        title: '商户等级',
                        align: 'left',
                        field: 'levelTypeId',
                        width: 120
                    }, {
                        title: '商户等级名称',
                        align: 'left',
                        field: 'levelName',
                        width: 100,
                    },{
                        title: '升级所需数量',
                        align: 'left',
                        field: 'upgradingConditions',
                        width: 100,
                    }, {
                        title: '升级类型',
                        align: 'left',
                        field: 'upgradingTypeName',
                        width: 100,
                    },{
                        title: '操作',
                        fixed:'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 120,
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            // var time = $('#date').val().split(' 至 ');

            var params = {
                page: index,
                rows: limit,

            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    var dataex = res.dataExpansion;
                    console.log(res)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        if(item.upgradingType == 1){
                            item.upgradingTypeName = '人民币'
                        }else if(item.upgradingType == 2){
                            item.upgradingTypeName = '发展'+item.dowmLevelName
                        }else{
                            item.upgradingTypeName = '顶级'
                        }

                    })
                    var str = '<option value="">请选择</option>';
                    $.each(dataex,function (i,item) {
                        str+='<option value="'+item.id+'">'+item.levelName+'</option>'
                    })
                    $('#levelTypeId,#dowmLevelName').html(str)
                    form.render();
                }else{
                    layer.msg(res.msg)
                }
            })

        }
        
    })

})

