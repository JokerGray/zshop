//清空数据
function emptyInput(demo){
    demo.find('textarea,input').val('');
    demo.find('img').attr('src','../../../common/images/upload.png');
    demo.find('input,select,textarea').attr('disabled',false)
    form.render()
}
function tableInit(tableId, cols, pageCallback, pageLeft,limit) {
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
        limit: limit,
    });

    //2.第一次加载
    pageCallback(page,limit).done(function (res) {
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
            limit: limit
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
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var dataTr = {};
        var userno = yyCache.get("userno") || "6";
        var USER_URL = {
            LISTS:'operationCloudShop/getOnlineCategoryList',//(列表)
            DEL:'operationCloudShop/removeOnlineCategory',//删除
            GETTRADELIST:'operationCloudShop/getTradeList',//获取行业列表
            GETSHOP:'operationCloudShop/getShopList',//获取店铺列表
            SETCATEGORYINHOME: 'operationCloudShop/setCategoryInHome',//设置线上分类是否首页显示
            ADD: 'operationCloudShop/subOnlineCategory',//添加或者更新线上分类数据
            ZTREE: 'operationCloudShop/getOnlineCategoryLevel',//添加编辑页码-获取线上分类树形下拉框数据
            GETCI:'operationCloudShop/getLexiconByCategoryId',//搜索词关联设置
            SETCI:'operationCloudShop/addOrRemoveLexicon',//设置关键词
        };
        //加载左侧导航树 加载导航树
        $('#addCiBtn').click(function () {
            var el = $('#addCiLayer');
            AREA = ['auto']
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                shade:SHADE,
                btn:['确认','取消'],
                end: function (layero,index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success:function (layero,index) {
                    setForms('addCi');
                },yes:function (index) {
                    form.on('submit(addCi)',function (obj) {
                        if(obj){
                            var params = {
                                addLexicon:[{
                                    name:$('#ci').val(),
                                    categoryId:dataTr.id,
                                }],
                                userno:userno
                            }
                            reqAjaxAsync(USER_URL.SETCI,JSON.stringify(params)).done(function (res) {
                                if(res.code == 1){
                                    layer.close(index)
                                    init_obj1();
                                }
                                layer.msg(res.msg)
                            })
                        }

                    })
                    return false
                }
            })
        })
        $('#addCi').click(function () {
            if(JSON.stringify(dataTr) == '{}'){
                layer.msg('请选择要操作的栏目!')
                return
            }
            var el = $('#oneDemo');
            AREA=['50%','700px']
            TITLE[0] = '搜索词关联设置'
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                shade:SHADE,
                end: function (layero,index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success:function (layero,index) {
                    init_obj1()
                },

            })
        })
        $('#searchBtn1').click(function () {
            init_obj1()
        })
        table.on('tool(tableNo1)',function (obj) {
            var reData = obj.data;
            if(obj.event == 'del'){
                TITLE[0] = '提示'
                layer.confirm('确定删除【'+reData.name+'】？',{title:TITLE},function (index) {
                    reqAjaxAsync(USER_URL.SETCI,JSON.stringify({removeIds:reData.id,userno:userno})).done(function (res) {
                        if(res.code == 1){
                            init_obj1();
                        }
                        layer.msg(res.msg)
                    })
                })

            }
        })
        function init_obj1() {
            var objs = tableInit('tableNo1',[
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80,
                    }, {
                        title: '关键词',
                        align: 'left',
                        field: 'name',
                        width: 180,
                    },{
                        title: '创建时间',
                        align: 'left',
                        field: 'create_time',
                        width: 200,
                    },{
                        title: '操作',
                        align: 'left',
                        toolbar:'#barDemoer',
                        fixed:'right',
                        width: 150,
                    }]
                ],
                pageCallback1, 'laypageLeftLayer',10
            );
        }
        function pageCallback1() {
            var params={
                id:dataTr.id,
                pageNo:1,
                pageSize:10,
            }
            return getData1(USER_URL.GETCI,JSON.stringify(params))
        }
        function getData1(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }
        function getTree() {
            var setting = {
                check: {
                    enable: false,
                    chkStyle: "checkbox",
                    radioType: "all",
                    nocheckInherit: true,
                    chkDisabledInherit: true
                },
                data: {
                    key:{
                        name: 'text'
                    },
                    simpleData: {// 数据对应的赋值
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                view: {
                    showIcon: true
                },

                callback: {
                    //绑定点击事件
                    onClick: zTreeOnClick
                }
            };
            var par = {
                "categoryType":$('#categoryType').val()
            }
            reqAjaxAsync(USER_URL.ZTREE,JSON.stringify(par)).done(function (res) {
                //发起请求
                if (res.code == 1) {
                    var treeData = res.data;

                    $.each(treeData, function (i, item) {
                        // $(item).attr('name', item.text)
                    })
                    console.log(treeData)
                    var treeObj = $.fn.zTree.init($("#tree"), setting, treeData);//设置权限树
                    // var nodes = $.fn.zTree.getZTreeObj("tree").getNodes();//获取权限树所有节点
                    getLevel(treeObj)
                    // getDetails(nodes[0])//获取第一个详情
                } else {
                    layer.msg(res.msg);
                }
            });
        }
        function zTreeOnClick(event, treeId, treeNode) {
            // getDetails(treeNode);
            $('#pid').val( treeNode.id);
            $('#pidName').val(treeNode.text);
        };

        $('body').click(function (e) {
            $('#menuContent').hide()
        })
        $('.pidBox').bind('click',function (e) {
            stopPropagation(e);
        })
        $('#pidName').on('focus', function () {
            showMenu();
        })
        function getLevel(treeObj) {
            var pid = $('#pid').val();
            var node = treeObj.getNodeByParam("id", pid);
            treeObj.expandNode(node, true, false, true);
            treeObj.selectNode(node);
            $('#pidName').val(node.text);
        }
        function showMenu() {
            $("#menuContent").show()
        }

        form.on('select(categoryTypes)',function (obj) {
            getTradeList($('#pids')).done(function () {
                init_obj()
            })
        })
        form.on('select(categoryType)',function (obj) {
            getTree()
        })
        getTradeList($('#pids')).done(function () {
            init_obj()
        })
        function getTradeList(ids) {
            var params = {
                categoryType:$('#categoryTypes').val(),
                pid:'',
                pageNo:1,
                pageSize:100
            }
            return reqAjaxAsync(USER_URL.LISTS,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    var datas = res.data;
                    console.log(datas)
                    var str = '<option value="">全部</option>';
                    $.each(datas,function (i, item) {
                        str+='<option value="'+item.id+'" data-d=\''+JSON.stringify(item)+'\'>'+item.categoryName+'</option>'
                    })
                    ids.html(str)
                    form.render()

                }
            })
        }
        form.on('select(pids)',function (obj) {
            init_obj()
        })
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input,select').val('')
            init_obj()
        })
        var imgPath ='../../../common/images/upload.png';
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            AREA=['50%','700px']
            TITLE[0] = '新增线上分类'
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
                            saveFunc(USER_URL.ADD).done(function (res) {
                                if(res.code == 1){
                                    init_obj();
                                    layer.close(index)
                                }
                                layer.msg(res.msg)
                            })
                        }
                    })
                    return false
                }
            })




        })
        function saveFunc(url,ids) {
            var imageUrl = $('#imageUrl').attr('src')
            if(imgPath == imageUrl){
                layer.msg('请上传展示图片',{icon:2,anim:6})
                return
            }
            var createUser = userno;
            var modifyUser = userno;

            var param = {
                categoryName: $.trim($('#categoryName').val()),
                categoryLogo: $('#categoryLogo').val(),
                categoryStatus: $('#categoryStatus').val(),
                categoryType: $('#categoryType').val(),
                sequence: $('#sequence').val(),
                pid: $('#pid').val(),
            }
            if(ids){
                param.id = ids
                param.modifyUser= modifyUser
            }else{
                param.createUser=createUser
            }
            return reqAjaxAsync(url,JSON.stringify(param)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }
                layer.msg(res.msg)
            })
        }
        // imageUrl
        uploadOss({
            btn: "categoryLogo",
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
                TITLE[0] = '修改线上分类'
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
                        $('#pidName').val()
                        $('#categoryLogo').attr('src',reData.categoryLogo || imgPath)
                        setDatas(el,reData)
                        getTree()
                    },
                    yes:function (index) {
                        form.on('submit(editForm)',function (data) {
                            if(data){
                                saveFunc(USER_URL.ADD).done(function (res) {
                                    if(res.code == 1){
                                        init_obj();
                                        layer.close(index)
                                    }
                                    layer.msg(res.msg)
                                })
                            }
                        })
                        return false
                    }
                })
            }else if(obj.event == 'del'){
                TITLE[0] = '提示'
                layer.confirm('确定删除【'+reData.categoryName+'】？',{title:TITLE},function (index) {
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify({id:reData.id})).done(function (res) {
                        if(res.code == 1){
                            init_obj();
                        }
                        layer.msg(res.msg)
                    })
                })

            }else if(obj.event == 'switch'){
                if(flag){
                    flag = 0;
                    var checked = $(this).find('input')[0].checked;
                    var params = {
                        id:reData.id,
                        isHomeShow:checked?1:2
                    }
                    reqAjaxAsync(USER_URL.SETCATEGORYINHOME,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            layer.msg('操作成功!',{icon:1})

                        }else{
                            layer.msg(res.msg)
                        }

                    })
                }

            }
        })
        var flag
        form.on('switch(switchTest)',function (obj) {
            flag = 1;
        })
        //渲染表格

        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80,
                        event:'click'
                    }, {
                        title: '栏目名称',
                        align: 'left',
                        field: 'categoryName',
                        width: 180,
                        event:'click'
                    }, {
                        title: '栏目图片',
                        align: 'left',
                        field: 'imageUrlImg',
                        width: 100,
                        event:'click'
                    }, {
                        title: '栏目状态',
                        align: 'left',
                        field: 'categoryStatusName',
                        width: 100,
                        event:'click'
                    }, {
                        title: '首页显示',
                        align: 'left',
                        field: 'isHomeShowName',
                        width: 100,
                        event:'click'
                    },  {
                        title: '栏目类型',
                        align: 'left',
                        field: 'categoryTypeName',
                        width: 120,
                        event:'click'
                    },{
                        title: '设置首页显示',
                        align: 'left',
                        field: 'labelTypeName',
                        toolbar:'#switchDemo',
                        event:'switch',
                        width: 150,
                    },{
                        title: '最后修改者',
                        align: 'left',
                        field: 'userno',
                        width: 150,
                        event:'click'
                    },{
                        title: '最后修改时间',
                        align: 'left',
                        field: 'modifyTime',
                        width: 200,
                        event:'click'
                    },{
                        title: '操作',
                        align: 'left',
                        toolbar:'#barDemo',
                        fixed:'right',
                        width: 150,
                        event:'click'
                    }]
                ],

                pageCallback, 'page',50
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var params = {
                categoryType:$.trim($('#categoryTypes').val()) || '',
                pid:$.trim($('#pids').val()) || '',
                pageNo:index,
                pageSize:limit
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    console.log(res)
                    var data = res.data
                    res.total = data.length
                    if($('#pids').find('option:checked').attr('data-d')){
                        var first = JSON.parse($('#pids').find('option:checked').attr('data-d'))
                        data.unshift(first)
                    }
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        item.imageUrlImg = '<img src="'+item.categoryLogo+'"/>'
                        item.categoryStatusName = item.categoryStatus == 0?'显示':'不显示'
                        item.isHomeShowName = item.isHomeShow?'显示':'不显示';
                        item.categoryTypeName = item.categoryType == 0?'线上手机版':'线上PC版';
                        item.userno = item.scSysBackUser.username;

                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }


    })

})

