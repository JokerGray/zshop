var imgPath = '../../common/images/upload.png';
function emptyInput(demo){
    demo.find('textarea,input,select').val('');
    demo.find('img').attr('src',imgPath);
    demo.find('input,select,textarea').attr('disabled',false)
    form.render()
}
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var USER_URL = {
            MERCHANTLIST:'newservice/getCategoryList', //(分类列表)
            // SHOPLIST: 'operations/getShopTurnoverStatisticsList', //(子服务列表)
            ADD: 'newservice/addOrModifyCategory',//运营后台商户归档信息新增
            UPDATE:'newservice/addOrModifyCategory'//店铺名称
        };
        var categoryId = -1;
        var dataTr = {};
        $('#searchBtn').click(function () {
            init_obj();
            categoryId = -1;
        })
        $('#restBtn').click(function () {
            $('.header1').find('input,select').val('')
            init_obj()
            categoryId = -1;
        })
        $('#searchBtn1').click(function () {
            init_obj1();
        })
        $('#restBtn1').click(function () {
            $('.header').find('input,select').val('')
            init_obj1()
        })
        //渲染表格
        init_obj();
        init_obj1()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80,
                        event:'clickAble'
                    }, {
                        title: '分类名称',
                        align: 'left',
                        field: 'categoryName',
                        width: 150,
                        event:'clickAble'
                    }, {
                        title: '优先级',
                        align: 'left',
                        field: 'sort',
                        width: 150,
                        event:'clickAble'
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        event:'clickAble',
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
                        width: 80,
                        event:'sort'
                    }, {
                        title: '分类名称',
                        align: 'left',
                        field: 'categoryName',
                        width: 150,
                        event:'sort'
                    }, {
                        title: '优先级',
                        align: 'left',
                        field: 'sort',
                        width: 150,
                        event:'sort'
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        event:'sort',
                        width: 150
                    }
                    ]
                ],

                pageCallback1, 'page1'
            );
        }

        //pageCallback回调
        function pageCallback(index, limit) {
            var feedbackInfo = $.trim($("#feedbackInfo").val())||"";
            var param = {
                pagination:{
                    page: index,
                    rows: limit,
                },
                versionValue:'-1',
                feedbackInfo: feedbackInfo, //分类名称
            }
            return getData(USER_URL.MERCHANTLIST, JSON.stringify(param));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    res.versionValue =res.data.versionValue;
                    var data = res.data =  res.data.categoryList;
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                    })
                }else{
                    layer.msg(res.msg)
                }
            })
        }

        //pageCallback回调
        function pageCallback1(index, limit) {
            var feedbackInfo = $.trim($("#feedbackInfo").val())||"";
            var params = {
                pagination:{
                    page: index,
                    rows: limit,
                },
                versionValue:'-1',
                feedbackInfo: feedbackInfo, //分类名称
            }
            return getData1(USER_URL.MERCHANTLIST, JSON.stringify(params));
        }
        //获取数据
        function getData1(url, parms) {
           return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data  =  res.data.categoryList;
                    $.each(data, function (i, item) {
                        if(categoryId == item.categoryId){
                            $.each(item.categoryList,function (j,items) {
                                items.eq=j+1
                            })
                            res.data = item.categoryList;
                            return false;
                        }

                    })
                }else{
                    layer.msg(res.msg)
                }
            })

        }
        //修改
        table.on('tool(tableNo)',function (obj) {
            AREA = ['40%','700px']
            var el = $('#addDemo');
            var reData=obj.data;
            var merchantId=reData.merchantId;
            if(obj.event==='clickAble'){
                //渲染店铺名
                categoryId = reData.categoryId;
                $('.coverPic').show();
                init_obj1();
            }if(obj.event=='sort'){
                $('.coverPic').hide();
            }else if(obj.event === 'edit'){
                setDatas(el,reData);
                layerOpen('修改服务分类',el,'addForm','');

                form.on('submit(addForm)',function (data) {
                    if(data){
                        var parm={
                            parentCategoryId:reData.parentCategoryId,
                            categoryId:reData.categoryId,
                            coverPic:$('#coverPic').attr('src'),
                            categoryName:$.trim($('#categoryName').val()),
                            categoryIcon:$('#categoryIcon').attr('src'),
                            greyUrl:$('#greyUrl').attr('src'),
                            sort:$.trim($('#sort').val()),

                        };
                        reqAjaxAsync(USER_URL.UPDATE,JSON.stringify(parm)).then(function(res){
                            if(res.code == 1) {
                                layer.msg(res.msg);
                                if(obj.event == 'sort'){
                                    init_obj1()
                                }else{
                                    init_obj()
                                }
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

        $('.addBtn').click(function () {
            AREA = ['40%','700px']
            var el = $('#addDemo');

            var type = $(this).attr('data-type');
            if(type){
                if(categoryId == -1){
                    layer.msg('请选择主分类！',{ icon: 2, anim: 6,})
                    return;
                }else{
                    $('.coverPic').hide();
                    layerOpen('新增子服务分类',el,'addForm','');
                }
            }else{
                $('.coverPic').show();
                layerOpen('新增服务分类',el,'addForm','');
            }

            form.on('submit(addForm)',function (data) {
                if(data){
                    var flag = true;
                    var parm={
                        categoryName:$.trim($('#categoryName').val()),
                        categoryIcon:$('#categoryIcon').attr('src'),
                        greyUrl:$('#greyUrl').attr('src'),
                        sort:$.trim($('#sort').val()),
                    };
                    if(type){
                        parm.parentCategoryId = categoryId
                    }else{
                        parm.parentCategoryId = '0';
                        parm.coverPic=$('#coverPic').attr('src');
                        if(parm.coverPic == imgPath){
                            layer.msg('请添加分类封面！',{ icon: 2, anim: 6,})
                            flag = false
                            return
                        }
                    }
                    if(parm.categoryIcon == imgPath){
                        layer.msg('请添加分类图标！',{ icon: 2, anim: 6,})
                        flag = false
                        return
                    }
                    if(parm.greyUrl == imgPath){
                        layer.msg('请添加夜间模式图标:！',{ icon: 2, anim: 6,})
                        flag = false
                        return
                    }
                    console.log(parm)
                    if(flag){
                        reqAjaxAsync(USER_URL.ADD,JSON.stringify(parm)).then(function(res){
                            if(res.code == 1) {
                                layer.msg(res.msg);
                                if(type){
                                    init_obj1()
                                }else{
                                    init_obj()
                                }

                            }else{
                                layer.msg(res.msg);
                            }
                            layer.close(_index);
                        })
                    }
                }
                return false;
            })
        })
    })

    // imageUrl
    uploadOss({
        btn: "coverPic",
        flag: "img",
        size: "5mb"
    });
    // imageUrl
    uploadOss({
        btn: "categoryIcon",
        flag: "img",
        size: "5mb"
    });
    // imageUrl
    uploadOss({
        btn: "greyUrl",
        flag: "img",
        size: "5mb"
    });
})

