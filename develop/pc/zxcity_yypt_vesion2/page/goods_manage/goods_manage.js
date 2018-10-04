var page = 0;
var rows = 6;
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        var username=yyCache.get("username");  //平台用户的用户名
        var tit = '';
        form.render();
        var USER_URL = {
            SELECTMODEL:'game/findGoodsCategory'//查询所有模块
            ,LIST:'game/findGoodsList'//查询列表
            ,MANANGE:'game/goodsManager'//type 1 新增、修改  3删除

        }
        // 查询所有的模块
        getStart();
        function getStart(){
            reqAjaxAsync(USER_URL.SELECTMODEL,'{}').done(function (res) {
                console.log(res)
                if(res.code ==1){
                    var str = '';
                    $.each(res.data.list,function (i, item) {
                        str+='<option value="'+item.moduleNo+'">'+item.moduleName+'</option>'
                    })
                    $('#moduleName').html(str);
                    tit=$('#moduleName option:selected').text();
                    form.render()
                }
            }).done(function () {
                init_obj()
            })
        }
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
                limit: 15,
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
                    limit: 6
                }
                page_options.jump = function(obj, first) {
                    tablePage = obj;

                    //首次不执行
                    if(!first) {
                        pageCallback(obj.curr-1, obj.limit).done(function (resTwo) {
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
        //选择不同的模块
        form.on('select(moduleName)',function (obj) {
            tit = $(this).text()
            init_obj()
        })
        //列表
        function init_obj () {
            var _obj = tableInit('demo', [
                    [{
                        title: '序号',
                        align: 'center',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '名称',
                        align: 'left',
                        field: 'goodsName',
                        width: 200
                    }, {
                        title: '图片',
                        align: 'left',
                        field: 'goodsPics',
                        width: 280
                    },{
                        title: '单价(智币)',
                        align: 'left',
                        field: 'goodsPrice',
                        width: 280
                    }, {
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar:'#barDemo',
                        width: 200
                    }]
                ],
                pageCallback,'laypageLeft'
            )
        }

        //数据处理
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    res.total = res.data.total;
                    var data = res.data=res.data.list;

                    console.log(res)

                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1));
                        item.goodsPics = '<img src="'+item.goodsPic+'"/>'
                    })
                    deff.resolve(res);
                }else{
                    layer.msg(res.msg)
                }
            })
            return deff.promise();
        }

        //pageCallback回调
        function pageCallback (index, limit) {
            var params = {
                page: index,
                row: limit,
                goodsCategory:$('#moduleName').val()
            };

            return getData(USER_URL.LIST,JSON.stringify(params))
        }
        //添加
        $('#addBtn').click(function () {
            let el = $('#addDemo')
            TITLE[0] = '新增-'+tit
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['50%', '600px'],
                btn:['确认','取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
                    el.find('img').attr('src','../../common/images/upload.png')
                },
                success: function (index,layero) {
                    setForms('addForm');
                    $('#newGoodsCategory').val(tit)
                },
                yes: function (index,layero) {
                    saveImg(USER_URL.MANANGE,index,'',1);
                },btn2:function (index) {
                    layer.close(index);
                }
            })
        })
        //保存
        function saveImg(url,index,ids,type) {
            var flag = true;
            var goodsName = $('#goodsName').val();
            var goodsPrice = $('#goodsPrice').val();
            var goodsPic = $('#goodsPic').attr('src');
            var goodsCategory = $('#moduleName').val();
            var userCode = username;
            if(goodsPic == 'img/upload.png'){
                layer.msg('请上传轮播背景图', {
                    icon: 2,
                    anim: 6,
                });
                flag = false
                return false
            }
            if(flag){
                form.on('submit(addForm)',function (data) {
                    var params = {
                        type:type,//新增或者修改
                        goodsName:goodsName,//
                        userCode:userCode,//
                        goodsPrice:Number(goodsPrice),//
                        goodsPic:goodsPic,//
                    }
                    if(type == 1){
                        params.goodsCategory=goodsCategory
                    }
                    if(ids){
                        params.id = ids
                    }
                    reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                        if(res.code ==1){
                            init_obj();
                        }
                        layer.msg(res.msg);
                        layer.close(index);
                    })
                    return false;
                })
            }
        }
        //表格操作
        table.on('tool(demo)', function (obj) {
            var el = $('#addDemo');
            var reData = obj.data
            //查看
            if (obj.event === 'del') {
                layer.confirm('是否删除【'+reData.goodsName+'】?',{icon:0,title:"提示"},function (index) {
                    var parms = {
                        type:2,
                        userCode:username,
                        id:reData.id
                    };
                    reqAjaxAsync(USER_URL.MANANGE,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.msg("删除成功");
                        }else {
                            layer.msg(res.msg);
                        };
                        init_obj();
                    })
                })
            }else if(obj.event === 'change'){
                TITLE[0] = '修改-'+tit
                layer.open({
                    title:TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['50%', '600px'],
                    btn:['确认','取消'],
                    end: function (index) {
                        layer.close(index);
                        emptyInput(el);
                        el.find('img').attr('src','../../common/images/upload.png')
                    },
                    success: function (index,layero) {
                        setDatas(el,reData)
                        setForms('addForm');
                        $('#newGoodsCategory').val(tit)
                    },
                    yes:function (index,layero) {
                        saveImg(USER_URL.MANANGE,index,reData.id,1)
                    }
                })
            }
        })

        uploadOss({
            btn: "goodsPic",
            flag: "img",
            size: "5mb"
        });

    })
})