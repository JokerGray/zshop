(function($){
    var page = 1;
    var rows = 10;
    var rosw =6;
    var username = yyCache.get('username');
    var operater = yyCache.get("pcNickname"); //用户名称
    var operaterId = yyCache.get("userId"); //登陆者id
    var locked = true;
    var tagetlist = [];
    var addlist=[]; //新增
    var dellist = [];//删除
    var changelist = [];//修改名称
    var changeid=[];//修改id
    var associatedId=[];
    var associatedTit=[];//关联问题的id好标题
    var table_data=new Array(); //当前表格中的全部数据:在表格的checkbox全选的时候没有得到数据, 因此用全局存放变量
    var USER_URL = {
        QUERYLIST:'operations/findTKnowledge',   //(查询问题)1 有效， 2 无效， 0-删除
        UPDATELIST:'operations/updateTKnowledge',  //(修改问题)
        ADDLIST:'operations/addTKnowledge', //(新增问题)
        DELETELISTE:'operations/deleteTKnowledge', //(删除问题)
        RESOURLIST : 'operations/findTKnowledgeCategoryByPid', //(获取知识库分类列表)
        ADDCLASS : 'operations/addTKnowledgeCategory', //新增分类新
        DELETECLASS :'operations/deleteTKnowledgeCategory', //删除分类新
        LOOKINFO:'operations/findTKnowledgedetailed', //查询知识详情
        UPDATECLASS :'operations/updateTKnowledgeCategory', //修改知识分类
        ADDKNOW:'operations/addKnowledgeRepository',//新增知识点接口
        QUERYKONW:'operations/findKnowledgeRepository', //查询知识点接口
        UPDATEKNOW:'operations/updateKnowledgeRepository',//修改知识点接口
        DELETEKONW:'operations/deleteKnowledgeRepository' //删除知识点接口
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;

    });

    //初始化
    $(function(){
        getTree();
        //标签相关操作
        $("#addTag .adatitle").click(function(){
            var tags = $.trim($(".addinputtag").val());
            var id = $(this).parent().attr("id");
            if(tags!=''){
                addTag($(".addinputtag"),1);
                //  $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        });


        $("#addTag .tags_enter").blur(function() { //焦点失去触发
            var txtvalue=$(this).val().trim();
            var id = $(".adatitle").parent().attr("id");
            if(txtvalue!=''){
                addTag($(this),1);
                $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        }).keydown(function(event) {
            var id = $(".adatitle").parent().attr("id");
            var key_code = event.keyCode;
            var txtvalue=$(this).val().trim();
            if (key_code == 13&& txtvalue != '') { //enter
                addTag($(this),1);
                $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
            if (key_code == 32 && txtvalue!='') { //space
                addTag($(this),1);
                $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        });
        $(".tags").click(function() {
            $(this).css({"border-color": "#f59942"})
        }).blur(function() {
            $(this).css({"border-color": "#d5d5d5"})
        })
    })


    //左侧分类树
    function getTree(type){
        var setting = {
            check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true,
                selectedMulti: false //不允许同时选中多个节点
            },
            data: {
                simpleData: {
                    enable: true,//使用简单数据格式
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        var param={
            "id": ""
        };
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            if(res.code == 1){
                var treeNodes=res.data,i;
                for(var k=0;k<treeNodes.length;k++){
                    treeNodes[k].pid=res.data[k].parentId;
                    treeNodes[k].name=res.data[k].categoryName;
                }
                //初始化加载
                if(type!=1){
                     treeObj = $.fn.zTree.init($("#tree"), setting, treeNodes);
                }else{
                     treeObj = $.fn.zTree.init($("#tree2"), setting, treeNodes);
                }
                //获取当前被选中的节点数据集合
                var selectedNode = treeObj.getSelectedNodes();
                //获取全部节点数据
                var nodes = treeObj.getNodes();
                treeObj.selectNode (nodes[0], true);
                    if(type!=1){
                        templeTable(nodes[0].id,"",0,'laypageLeft');
                        $("#searchName").attr('data-id',nodes[0].id);
                    }else{
                        templeTable(nodes[0].id,"",3,'laypageLeft01');
                        $("#searchName01").attr('data-id',nodes[0].id);
                    }

            }else{
                layer.msg(res.msg);
            }

        })

    }

    //树点击事件
    function zTreeOnClick(event, treeId, treeNode) {
        var id = treeNode.id ||"";
        var pid = treeNode.pid;
        var nds = treeObj.getSelectedNodes();
        var eve = event.data.treeId;
        if(nds.length>0){treeObj.expandNode(nds[0],!nds[0].open,false,true)}
        var index = $(".tab-menu span.acv").index();
        if(eve=='tree2'){
            templeTable(id,"",3,'laypageLeft01');
            $("#searchName01").attr('data-id',id);
            $("#searchName01").val("");
        }else{
            if(index==0){
                templeTable(id,"",index,'laypageLeft');
                $(".repon-rightr #searchName").attr('data-id',id);
                $(".repon-rightr #searchName").val("");
            }else if(index==1){
                templeTable(id,"",index,'laypageRgt');
                $(".repon-rightr #searchName").attr('data-id',id);
                $(".repon-rightr #searchName").val("");
            }
        }
    };


    //列表渲染
    function templeTable(categoryId,param,type,test){
        if(type==0){ //问题
            var obj = tableInit('table', [
                    [
                        {checkbox: true},
                        {
                            title: '问题标题',
                            /*sort: true,*/
                            align: 'left',
                            field: 'title',
                            width: 300,
                            event: 'changetable'
                        }, {
                        title: '创建时间',
                        /*sort: true,*/
                        align: 'left',
                        field: 'createTime',
                        width: 200,
                        event: 'changetable'
                    }, {
                        title: '状态',
                        /*sort: true,*/
                        align: 'left',
                        templet: '#titleTpl',
                        width: 100,
                        event: 'changetable'
                    }, {
                        title: '有效期',
                        /*sort: true,*/
                        align: 'left',
                        templet: '#effcettime',
                        width: 350,
                        event: 'changetable'
                    }, {
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo'
                    }]
                ],
                pageCallback,'laypageLeft',param,categoryId,type
            );
        }else if(type==3){ //弹窗中关联问题
            var obj = tableInit('table01', [
                    [
                        {checkbox: true},
                        {
                            title: '问题标题',
                            /*sort: true,*/
                            align: 'left',
                            field: 'title'
                        }, {
                        title: '状态',
                        /*sort: true,*/
                        align: 'left',
                        templet: '#titleTpl'
                    }, {
                        title: '有效期',
                        /*sort: true,*/
                        align: 'left',
                        templet: '#effcettime'
                    }]
                ],
                pageCallback,'laypageLeft01',param,categoryId,type
            );
        }else{ //知识点
            var obj = tableInit('table2', [
                    [
                        {checkbox: true},
                        {
                            title: '知识点标题',
                            /*sort: true,*/
                            align: 'left',
                            field: 'title',
                            width: 400,
                            event: 'changetable'
                        },
                        {
                        title: '创建时间',
                        /*sort: true,*/
                        align: 'left',
                        field: 'createTime',
                        width: 200,
                        event: 'changetable'
                    }, {
                        title: '状态',
                        /*sort: true,*/
                        align: 'left',
                        templet: '#titleTpl1',
                        width: 100,
                        event: 'changetable'
                    }, {
                        title: '有效期',
                        /*sort: true,*/
                        align: 'left',
                        templet: '#effcettime1',
                        width: 350,
                        event: 'changetable'
                    }, {
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo1'
                    }]
                ],
                pageCallback,'laypageRgt',param,categoryId,type
            );
        }

    }

//加了入参的公用方法
        function tableInit(tableId, cols, pageCallback, test,param,categoryId,type) {
            var tableIns, tablePage;
            //1.表格配置
            if (type == 3) {
                tableIns = table.render({
                    id: tableId,
                    elem: '#' + tableId,
                    height: '358',
                    cols: cols,
                    page: false,
                    even: true,
                    skin: 'line',
                    unresize: true,
                    size: 'lg'
                })

            } else {
                tableIns = table.render({
                    id: tableId,
                    elem: '#' + tableId,
                    height: '580',
                    cols: cols,
                    page: false,
                    even: true,
                    skin: 'line',
                    unresize: true,
                    size: 'lg'
                });
            }

            //2.第一次加载
            if (type == 3) {
                var res = pageCallback(page, rosw, param, categoryId, type);
                table_data = res.data;
            } else {
                var res = pageCallback(page, rows, param, categoryId, type);
            }
            //第一页，一页显示15条数据
            if (res) {
                if (res.code == 1) {
                    tableIns.reload({
                        data: res.data || []
                    })
                } else {
                    layer.msg(res.msg)
                }
            }

            //3.left table page
            layui.use('laypage');
            if (type == 3) {
                var page_options = {
                    elem: test,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    limit: rosw
                }


            } else {
                var page_options = {
                    elem: test,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    limit: rows
                }
            }
            page_options.jump = function (obj, first) {
                tablePage = obj;

                //首次不执行
                if (!first) {
                    if(type==3){
                        var resTwo = pageCallback(obj.curr, obj.limit, param, categoryId, type);
                        table_data = resTwo.data;
                    }else{
                        var resTwo = pageCallback(obj.curr, obj.limit, param, categoryId, type);
                    }

                    if(resTwo && resTwo.code == 1){
                        if(type==3){
                            tableIns.reload({
                                data: resTwo.data || []
                            });
                            for(var i=0;i< resTwo.data.length;i++){
                                for (var j = 0; j < associatedId.length; j++) {
                                    //数据id和要勾选的id相同时checkbox选中
                                    if(resTwo.data[i].id == associatedId[j])
                                    {
                                        //这里才是真正的有效勾选
                                        resTwo.data[i]["LAY_CHECKED"]='true';
                                        //找到对应数据改变勾选样式，呈现出选中效果
                                        var index= resTwo.data[i]['LAY_TABLE_INDEX'];
                                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                                    }
                                }
                            }
                            var checkStatus = table.checkStatus('table01');
                            if(checkStatus.isAll){
                                $(' .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                                $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                            }
                        }else{
                            tableIns.reload({
                                data: resTwo.data || []
                            });
                        }
                    }
                    else{
                        layer.msg(resTwo.msg);
                    }

                }
                }
                if (type == 3) {
                    layui.laypage.render(
                        page_options);
                    for(var i=0;i< res.data.length;i++){
                     for (var j = 0; j < associatedId.length; j++) {
                     //数据id和要勾选的id相同时checkbox选中
                     if(res.data[i].id == associatedId[j])
                     {
                     //这里才是真正的有效勾选
                     res.data[i]["LAY_CHECKED"]='true';
                     //找到对应数据改变勾选样式，呈现出选中效果
                     var index= res.data[i]['LAY_TABLE_INDEX'];
                     $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                     $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                     }
                     }
                     }
                     var checkStatus = table.checkStatus('table01');
                     if(checkStatus.isAll){
                     $(' .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                     $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                     }
                } else {
                    layui.laypage.render(page_options);
                }


                return {
                    tablePage,
                    tableIns
                };
            }

        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data || [];
            return res;
        }

        //pageCallback回调
        function pageCallback(index, limit,param,categoryId,type) {
            if(categoryId == undefined){categoryId = ''}
            if(param == undefined){param = ''}
            var param = {
                "page": index,
                "rows": limit,
                "param": param,
                "categoryId": categoryId
            }
            if(type==0 || type==3){
                param.auditStatus='1';
                return getData(USER_URL.QUERYLIST, JSON.stringify(param));
            }else{
                return getData(USER_URL.QUERYKONW, JSON.stringify(param));
            }

        }




    //关联问题勾选其中几个
    //复选框选中监听,将选中的id 设置到缓存数组,或者删除缓存数组
    table.on('checkbox(table01)', function (obj) {
        if(obj.checked==true){
            if(obj.type=='one'){
                associatedId.push(obj.data.id);
                associatedTit.push(obj.data.title);
            }else{
                for(var i=0;i<table_data.length;i++){
                    associatedId.push(table_data[i].id);
                    associatedTit.push(table_data[i].title);
                }
            }
        }else{
            if(obj.type=='one'){
                for(var i=0;i<associatedId.length;i++){
                    if(associatedId[i]==obj.data.id){
                        associatedId.removeinx(obj.data.id);
                        associatedTit.removeinx(obj.data.title);
                    }
                }
            }else{

                for(var i=0;i<associatedId.length;i++){
                    for(var j=0;j<table_data.length;j++){
                        if(associatedId[i]==table_data[j].id){
                            associatedId.removeinx(table_data[j].id);
                            associatedTit.removeinx(table_data[j].title);
                        }
                    }
                }
            }
        }
    });


    //tab切换
    $(".tab-menu").on("click","span",function(){
        var index = $(this).index();
        $(".tab-menu span").removeClass("acv");
        $(this).addClass("acv");
        $(".table-box .repon-table").hide();
        $(".table-box .repon-table").eq(index).show();
        var val = $("#searchName").val();
        var id = $("#searchName").attr('data-id');
        $("#searchName").attr('data-type',index);
        $(".infomation").animate({right:'-40%'});
        if(index==1){
            var num = $(this).attr("data-num");
            if(num==0){
                if(index==0){
                    templeTable(id,val,index,'laypageLeft');
                }else if(index==1){
                    templeTable(id,val,index,'laypageRgt');
                }

                $(this).attr("data-num",1)
            }
        }
    });

    //搜索查询
    $(".repon-rightr").on("click",".searchicon",function(){
        var id = $(this).prev().attr("data-id");
        var param = $.trim($(this).prev().val());
        var type = $(this).prev().attr("data-type");
        if(type==0){
            templeTable(id,param,type,'laypageLeft');
        }else if(type==1){
            templeTable(id,param,type,'laypageRgt');
        }
    });

    //搜索查询（关联问题）
    $(".search-small").on("click",".searchicon",function(){
        var id = $(this).prev().attr("data-id");
        var param = $.trim($(this).prev().val());
        templeTable(id,param,3,'laypageLeft01');
    });

        //添加
    form.on('select(addslect)', function(data){
        if(data.value==0){ //添加问题
            $(".jurisdiction-content").hide();
            $(".newknow").show();
            $(".infomation").animate({right:'-40%'});
            $("#save").attr("lay-filter","formadd");
            getTrees("#trees");
        }else{//知识点
            $(".jurisdiction-content").hide();
            $(".newkonwa").show();
            $(".infomation").animate({right:'-40%'});
            $("#save").attr("lay-filter","formaddk");
            getTrees("#treesKnow");
        }

    });

        //添加相似标题
        $(".add-qs").click(function(){
            var list = $("#sameQs .layui-input-block");
            for(var i=0;i<list.length;i++){
                if(list.eq(i).find("input").val()==""){
                    $(this).attr("data-num",1);
                    break;
                }else{
                    $(this).attr("data-num",0);
                }
            }
            if($(this).attr("data-num")!=1){
                if(list.length<5){
                    var shtml = '<div class="layui-input-block">' +
                        '<input class="addIntro layui-input" name="desc"  placeholder="请输入相似问题(100字以内)" class="layui-input" maxlength="100"><i class="layui-icon del">-</i>'+
                        '</div>';
                    $("#sameQs").append(shtml);
                }else{
                    layer.msg("最多只能添加5个哟");
                }
            }

        });

    //是否有相似问题，有的话直接清空
    $("#sameQs").on("blur",".layui-input-block .addIntro",function(){
        var index = $(this).parent().index();
        var length = tagetlist.length;
        var val = $.trim($(this).val());
        var title = $.trim($("#addTitle").val());
        console.log(tagetlist);
        if(val!=""){
            if(val!=title){

                    if(tagetlist.toString().indexOf(val)==-1){
                        if(index>=length){
                            tagetlist.push(val);
                        }else{
                            tagetlist[index]=val;
                        }
                    }else{
                       for(var i=0;i<tagetlist.length;i++){
                            if(val==tagetlist[i]){
                                if(index!=i){
                                    layer.msg("已添加相同的相似问题");
                                    $(this).val("");
                                    return false;
                                }
                            }
                       }
                    }

            }else{
                layer.msg("不能与标准问题相同哟");
                $(this).val("");
            }

        }
    });

    //删除相似问题
    $("#sameQs").on("click",".layui-input-block .del",function(){
        $(this).parent().remove();
    })

    //添加标签
    function addTag(obj,eve) {

        //删除标签
        $(".hidetags").on("click",".tag .close",function(){
            $(this).parent().remove();
        });

        /*var list = $("#addTag").find(".hidetags span");*/
        if(eve==1){
            var list = $("#addTag .hidetags span");
        }else{
            var list = $("#changeTag .hidetags span");
        }

        if(list.length>4){
            layer.msg("最多只能添加5个哟");
            // $("#addTag .addinputtag").val("");
        }else{
            if(eve==1){
                var tag = obj.val();
                if (tag != '') {
                    var i = 0;

                    $("#addTag .hidetags .tag").each(function() {
                        if ($(this).text() == tag + "×") {
                            $(this).addClass("tag-warning");
                            setTimeout(function(){
                                $(".tag-warning").removeClass("tag-warning");
                            }, 400);
                            i++;
                        }
                    })
                    obj.val('');
                    if (i > 0) { //说明有重复
                        return false;
                    }
                    $("#addTag .hidetags").append("<span class='tag'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
                }
            }else{
                var tag = obj.val();
                if (tag != '') {
                    var i = 0;

                    $("#changeTag .hidetags .tag").each(function() {
                        if ($(this).text() == tag + "×") {
                            $(this).addClass("tag-warning");
                            setTimeout(function(){
                                $(".tag-warning").removeClass("tag-warning");
                            }, 400);
                            i++;
                        }
                    })
                    obj.val('');
                    if (i > 0) { //说明有重复
                        return false;
                    }
                    $("#changeTag .hidetags").append("<span class='tag'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
                }
            }


        }
    }

    //添加对内答案
    $(".add-internal").click(function(){
        $("#editor_id1").show();
        $(this).hide();
    });

    //问题分类
    $(".qsclassify").on("click",".layui-input-block",function(){
        var num = $(this).attr("data-num");
        if(num==0){
            $(this).next(".class-detail").show();
            $(this).attr("data-num",1);
            $(".qsclassify").mouseleave(function(){
                $(".qsclassify .class-detail").hide();
                $(".qsclassify .layui-input-block").attr("data-num",0);
            });
        }
        if(num==1){
            $(this).next(".class-detail").hide();
            $(this).attr("data-num",0);
        }
    })

    //新增修改页面分类通用方法
    function getTrees(e){
        var setting = {
            check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true,
                isHidden:true,
                selectedMulti: false //不允许同时选中多个节点
            },
            data: {
                simpleData: {
                    enable: true,//使用简单数据格式
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: zTreeOnClicks
            }
        };
        var param={
            "id": ""
        };
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            if(res.code == 1){
                var treeNodes=res.data,i;
                for(var k=0;k<res.data.length;k++){
                    treeNodes[k].pid=res.data[k].parentId;
                    treeNodes[k].name=res.data[k].categoryName;
                        if(res.data[k].categoryName=="未分类"){
                            $(".selectname").attr("data-id",res.data[k].id);
                        }
                }
                //初始化加载
                var treeObjs = $.fn.zTree.init($(e), setting, treeNodes);
                //获取当前被选中的节点数据集合
                var selectedNode = treeObjs.getSelectedNodes();
                //获取全部节点数据
                var nodes = treeObjs.getNodes();

                for(var j=0;j<nodes.length;j++){
                    if(nodes[j].categoryName=="未分类"){
                        treeObjs.hideNode(nodes[j]);
                    }
                }
            }else{
                layer.msg(res.msg);
            }

        })

    }



    //树点击事件
    function zTreeOnClicks(event, treeId, treeNode) {

        var id = treeNode.id ||"";
        var pid = treeNode.pid;
        var name = treeNode.name;
        var eve = event.data.treeId;
        $("#"+ eve).parent().prev().find(".selectname").text(name);
        $("#"+ eve).parent().prev().find(".selectname").attr("data-id",id);
        $(".class-detail").hide();
    };

    //启用和停用
    $("#isStop").on("click","a",function(){
        $("#isStop a").removeClass("acve");
        $(this).addClass("acve");
        var index= $(this).index();
        if(index==0){
            $(".minitab").show();
        }else{
            $(".minitab").hide();
        }
    });

    //启用和停用(知识点)
    $("#isStopkonw").on("click","a",function(){
        $("#isStopkonw a").removeClass("acve");
        $(this).addClass("acve");
        var index= $(this).index();
        if(index==0){
            $(".minitabk").show();
        }else{
            $(".minitabk").hide();
        }
    });


    //选中永久还是自定义有效期
    form.on('radio(isRadio)', function(data){
        if(data.value==0){
            $(this).parents("#isStop").find(".date-picker").show();
            $(".minitab").attr("data-isever",0);
        }else{ //永久有效
            $(this).parents("#isStop").find(".date-picker").hide();
            $(".minitab").attr("data-isever",1);
        }
    });

    //选中永久还是自定义有效期(知识点)
    form.on('radio(isRadiok)', function(data){
        if(data.value==0){
            $(this).parents("#isStopkonw").find(".date-picker").show();
            $(".minitabk").attr("data-isever",0);
        }else{ //永久有效
            $(this).parents("#isStopkonw").find(".date-picker").hide();
            $(".minitabk").attr("data-isever",1);
        }
    });

    //日期格式化方法
    Date.prototype.pattern=function(fmt) {
        var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours()%24 == 0 ? 24 : this.getHours()%24, //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

//日期选择(问题)
    $('#knowTip #datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        startDate: new Date()
    }).on('changeDate', function(ev) {
        var startTime = (ev.date || "").valueOf();
        var endtime = $("#knowTip #datetimepicker2").attr("data-time");
        if(endtime!=0){
            if(startTime>endtime){
                layer.msg("开始时间不能晚于结束时间哟");
                $('#knowTip #datetimepicker1 input').val("");
            }else{
                $(this).parent().attr('data-time',startTime);
            }
        }else{
            $(this).parent().attr('data-time',startTime);
        }
    });

    $('#knowTip #datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        startDate: new Date()
    }).on('changeDate', function(ev) {
        var endTime = (ev.date || "").valueOf();
        var begintime = $("#knowTip #datetimepicker1").attr("data-time");
        if(begintime!=0){
            if(begintime>endTime){
                layer.msg("开始时间不能晚于结束时间哟");
                $('#knowTip #datetimepicker2 input').val("");
            }else{
                $(this).parent().attr('data-time',endTime);
            }
        }else{
            $(this).parent().attr('data-time',endTime);
        }
    });

    //日期选择(知识点)
    $('.newkonwa #datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        startDate: new Date()
    }).on('changeDate', function(ev) {
        var startTime = (ev.date || "").valueOf();
        var endtime = $(".newkonwa #datetimepicker2").attr("data-time");
        if(endtime!=0){
            if(startTime>endtime){
                layer.msg("开始时间不能晚于结束时间哟");
                $('.newkonwa #datetimepicker1 input').val("");
            }else{
                $(this).parent().attr('data-time',startTime);
            }
        }else{
            $(this).parent().attr('data-time',startTime);
        }
    });

    $('.newkonwa #datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN",
        startDate: new Date()
    }).on('changeDate', function(ev) {
        var endTime = (ev.date || "").valueOf();
        var begintime = $(".newkonwa #datetimepicker1").attr("data-time");
        if(begintime!=0){
            if(begintime>endTime){
                layer.msg("开始时间不能晚于结束时间哟");
                $('.newkonwa #datetimepicker2 input').val("");
            }else{
                $(this).parent().attr('data-time',endTime);
            }
        }else{
            $(this).parent().attr('data-time',endTime);
        }
    });

    //添加问题保存
    form.on('submit(formadd)', function(data){
        if(data){
            saveKnow(USER_URL.ADDLIST,0);
        }
    });

    //修改问题
    form.on('submit(formupdate)', function(data){
        if(data){
            var id = $("#save").attr("data-id");
            saveKnow(USER_URL.UPDATELIST,1,id);
        }
    });

    //取消新增问题
    $("#formcancel").click(function(){
        location.reload();
    });

    //取消新增知识点
    $("#formcancelKnow").click(function(){
        location.reload();
    });

    //新增或者修改问题调接口
    function saveKnow(cmd,type,id){ //type 1-修改 0-添加 2-知识点里添加问题
        var title = $.trim($("#addTitle").val());
        var subtitlesArr = [];
        var titlelist = $("#sameQs .layui-input-block");
        for(var i=0;i<titlelist.length;i++){
            if(titlelist.eq(i).find("input").val()!=""){
                subtitlesArr.push(titlelist.eq(i).find("input").val());
            }
        }

        var subtitles = subtitlesArr.join("#-%");
        console.log("subtitles:"+subtitles);
        var tags = [];
        var taglist = $("#addTag").find(".tag");
        for(var a=0;a<taglist.length;a++){
            tags.push((taglist.eq(a).text()).replace("×",""));
        }
        var label = tags.join("#-%");
        var content = $.trim($("#editor_id0").val());
        var content1 = $.trim($("#editor_id1").val());
        var categoryId = $(".newknow .selectname").attr("data-id");
        var categoryName = $(".newknow .selectname").text();
        var diystart =$("#knowTip #jurisdiction-begin").val();
        var diyend = $("#knowTip #jurisdiction-end").val();
        var cretetime = new Date().pattern("yyyy-MM-dd");
        var year = parseInt(cretetime.split("-")[0])+100;
        var endtm = year+'-'+cretetime.split("-")[1]+'-'+cretetime.split("-")[2];
        var param = {
            "label":label,//标签
            "title": title,//标题
            "content": content,//对外答案
            "content1": content1,//对内答案
            "categoryId": categoryId,//分类id
            "createrId": operaterId,//创建人
            "brief": "",// 简介
            "subtitles":subtitles,//副标题
            "categoryName ":categoryName//分类名
        }
        if($("#isStop a.acve").index()==1){//停用
            param.startTime=cretetime;//答案有效期开始时间
            param.endTime=endtm;//答案有效期结束时间
            param.auditStatus='2';
        }else{
            var isradios = $(".minitab").attr("data-val");
            var isever = $(".minitab").attr("data-isever");
            if(isever==0){ //自定义
                if(diystart=="" ||diyend==""){
                    layer.msg("请选择有效期日期");
                    return false;
                }
                param.startTime=diystart;//答案有效期开始时间
                param.endTime=diyend;//答案有效期结束时间
            }else{//永久有效
                param.startTime='2000-1-1';//答案有效期开始时间
                param.endTime='2099-1-1';//答案有效期结束时间
            }
            param.auditStatus="1";
        }
        if(type==1){
            param.id=id;
        }
        if(locked){
            locked = false;
            reqAjaxAsync(cmd,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    var raw = res.data;
                    layer.msg(res.msg);
                    if(type!=2){
                        location.reload();
                    }else{
                        layer.closeAll();
                        //添加完问题
                        var sHtml ='<div  data-id="'+ raw.id +'"><p class="qstit">' + raw.title +'</p><span class="delqs">删除</span></div>';
                        $(".newqs").append(sHtml);
                    }
                    locked = true;
                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
            })
        }
    }

    //删除数组中的元素，通用方法
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.removeinx = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    //删除已添加的问题（知识点中）
    $(".about-qs").on("click",".delqs",function(){
        var id = $(this).parent().attr("data-id");
        var title = $(this).prev().text();
        associatedId.removeinx(id);
        associatedTit.removeinx(title);
        $(this).parent().remove();
    });


    //表格工具条操作
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        //删除
        if(obj.event === 'del'){
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示'},
                function(index){
                    restore(id,0,data.title,data.auditStatus);
                })
        }else if(obj.event == 'changetable'){ //查看
            getInfo(id,1)
        }else if(obj.event == 'change'){
            $(".jurisdiction-content").hide();
            $(".newknow").show();
            $(".infomation").animate({right:'-40%'});
            getInfo(id,2);
            getTrees("#trees");
            $("#save").attr("lay-filter","formupdate");
            $("#save").attr("data-id",id);
        }
    });


    //查询详情(问题)
    function getInfo(id,type){ //type 1-查看详情 2-修改
        var param = {
            "id": id
        }
        reqAjaxAsync(USER_URL.LOOKINFO,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var row= res.data;
                if(type==1){
                    $("#infoQs .tip-isvaild").attr("data-isvaild",row.auditStatus);
                    $("#infoQs").attr("data-id",id);
                    $("#infoQs .tip-titl div").eq(0).text(row.title);
                    $("#infoQs .info-text span").text(row.content);
                    $("#infoQs .isclassify span").text(row.categoryName);
                    if(row.auditStatus==1){
                        $(".tip-isvaild span").eq(0).text("有效");
                    }else{
                        $(".tip-isvaild span").eq(0).text("无效");
                    }
                    if(row.startTime=="2000-01-01" && row.endTime == '2099-01-01'){
                        $(".tip-isvaild span").eq(1).text("永久有效");
                    }else{
                        $(".tip-isvaild span").eq(1).text(row.startTime + " - " + row.endTime);
                    }
                    var subtitle=row.subtitle ||"";
                    var subtitlelist=[];
                    if(subtitle.length!=""){
                        for(var i=0;i<subtitle.length;i++){
                            subtitlelist.push(subtitle[i].subtitle);
                        }
                        $(".sameclass span").text(subtitlelist);
                    }else{
                        $(".sameclass span").text("");
                    }

                    $(".info-text span").text(row.content);
                    if(row.content1!=""){
                        $(".info-content").show();
                        $(".info-content span").text(row.content1);
                    }else{
                        $(".info-content").hide();
                        $(".info-content span").text(row.content1);
                    }
                    $("#infoQs").show();
                    $("#infoQs").animate({right:'0'});
                }else if(type==2){
                    //读取标签
                    var tagarr=row.label || "";
                    if(tagarr!=""){
                        if(tagarr.length>0){
                            for(var i=0;i<tagarr.length;i++){
                                if(tagarr[i].tag_name!=""){
                                    $("#addTag .hidetags").append("<span class='tag'>" + tagarr[i].tag_name + "<button class='close' type='button'>×</button></span>"); //添加标签
                                }
                            }
                        }
                    }



                    $("#addTitle").val(row.title);
                    $("#editor_id0").val(row.content);
                    $("#editor_id1").val(row.content1);
                    var subtitle=row.subtitle||"";
                    if(subtitle!=""){
                        var shtml = "";
                        for(var i=0;i<subtitle.length;i++){
                            shtml += '<div class="layui-input-block">' +
                            '<input value="'+ subtitle[i].subtitle +'" class="addIntro layui-input" name="desc"  placeholder="请输入相似问题(100字以内)" class="layui-input" maxlength="100"><i class="layui-icon del">-</i>'+
                            '</div>';
                        }
                        $("#sameQs").html(shtml);
                        $("#sameQs .layui-input-block").eq(0).find(".del").hide();
                    }else{

                    }
                    if(row.content1!=""){
                        $(".add-internal").hide();
                        $("#editor_id1").show();
                        $(".info-content span").text(row.content1);
                    }else{
                        $(".add-internal").show();
                        $("#editor_id1").hide();
                        $(".info-content span").text(row.content1);
                    }
                }
                $(".newknow .selectname").text(row.categoryName);
                $(".newknow .selectname").attr("data-id",row.categoryId);
                if(row.auditStatus==1){ //启用
                    $("#isStop a").removeClass("acve");
                    $("#isStop a").eq(0).addClass("acve");
                    $(".minitab").show();
                    $(".minitab").attr("data-val",0);
                    if(row.startTime=="2000-01-01" && row.endTime == '2099-01-01'){
                        document.getElementById('diyVaild').checked=false;
                        document.getElementById('alwayVaild').checked=true;
                        $("#alwayVaild").next().addClass("layui-form-radioed");
                        $("#diyVaild").next().removeClass("layui-form-radioed");
                        $(".date-picker").hide();
                        form.render();
                    }else{
                        $(".date-picker").show();
                        document.getElementById('diyVaild').checked=true;
                        document.getElementById('alwayVaild').checked=false;
                        $("#diyVaild").next().addClass("layui-form-radioed");
                        $("#alwayVaild").next().removeClass("layui-form-radioed");
                        form.render();
                        $("#knowTip #datetimepicker1").attr("data-time",1);
                        $("#knowTip #datetimepicker2").attr("data-time",2);
                        $("#knowTip #jurisdiction-begin").val(row.startTime);
                        $("#knowTip #jurisdiction-end").val(row.endTime);
                    }
                }else{//停用
                    $("#isStop a").removeClass("acve");
                    $("#isStop a").eq(1).addClass("acve");
                    $(".minitab").hide();
                    $(".minitab").attr("data-val",1);
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //关闭详情
    $(".info-close").click(function(){
        $(".infomation").animate({right:'-40%'});
    });

    //查看详情时的删除（问题）
    $("#delKnow").click(function(){
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var id = $("#infoQs").attr("data-id");
                var titl = $("#infoQs").find(".titletxt").text();
                var auditStatus =$("#infoQs .tip-isvaild").attr("data-isvaild");
                restore(id,0,titl,auditStatus);
                $(".infomation").animate({right:'-40%'});
            })
    });

    //删除通用方法()
    function restore(id,type,title,auditStatus){
    if(type==1){//知识点
        var paramDel = {
            'id' : id+"",
            'auditStatus':auditStatus,
            'title':title,
            'userid':operaterId,
            'username':username
        };
        reqAjaxAsync(USER_URL.DELETEKONW,JSON.stringify(paramDel)).done(function(res){
            if (res.code == 1) {
                layer.msg(res.msg);
                var e = $("#searchName").attr('data-id');
                var param = $.trim($("#searchName").val());
                var index = $(".tab-menu .acv").index();
                templeTable(e,param,index,'laypageRgt');
            } else {
                layer.msg(res.msg);
            }
        });
    }else{ //问题
        var paramDel = {
            'ids' : id+"",
            'auditStatus':auditStatus,
            'title':title,
            'userid':operaterId,
            'username':username
        };
        reqAjaxAsync(USER_URL.DELETELISTE,JSON.stringify(paramDel)).done(function(res){
            if (res.code == 1) {
                layer.msg(res.msg);
                var e = $("#searchName").attr('data-id');
                var param = $.trim($("#searchName").val());
                templeTable(e,param,0,'laypageLeft');
            } else {
                layer.msg(res.msg);
            }
        });
    }

    }

    //删除标签
    $(".hidetags").on("click",".tag .close",function(){
        $(this).parent().remove();
    });

    //一键删除
    $("#delBtn").click(function(){
        var type = $("#searchName").attr("data-type");
        if(type==0){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data;
        }else{
            var checkStatus = table.checkStatus('table2')
                ,data = checkStatus.data;
        }
        var arr=[];
        var arrname=[];
        var arrstatu=[];
        for (var i in data){
            arr.push(data[i].id);
            arrname.push(data[i].title);
            arrstatu.push(data[i].auditStatus);
        }
        if(data.length==0){
            layer.msg("请选择相应行");
        }else {
            $(".infomation").animate({right:'-40%'});
            var ids = arr.toString();
            var title = arrname.join("#-%");
            var auditStatus = arrstatu.join(",");
           restore(ids,type,title,auditStatus);
        }

    });

    //修改问题
    $("#editKnow").on("click",function(){
        var id = $("#infoQs").attr("data-id");
        $(".jurisdiction-content").hide();
        $(".newknow").show();
        $(".infomation").animate({right:'-40%'});
        getInfo(id,2);
        $("#save").attr("lay-filter","formupdate");
        $("#save").attr("data-id",id);
        getTrees("#trees");
    });

    //分类操作
    $("#classifyAdd").on("click",function(){
        layer.open({
            title: ['编辑知识库分类', 'font-size:15px;background-color:#fff;color:#000'],
            type: 1,
            content: $('#classify-demo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['900px', '700px'],
            shade: [0.1, '#fff'],
            resize: false,
            end: function () {
                $('#classify-demo').hide();
            },
            success: function (layero) {
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit", "");
                $("a.layui-layer-btn0").attr("lay-filter", "formdemo");
                getClass("0",0); //初始化加载第一级

            }
        })
    });

    //点击分类进行查询下一级
    $("#classify-demo").on("click",".classify-list .listtext",function(){
        var oldid = $(this).parent().attr("data-id");
        var oldparent = $(this).parent().attr("data-parentid");
        if(oldid==1&&oldparent==0){
        }else{
            var isclick = $(this).parents(".classify-list").attr("data-isclick");
            if(isclick==0){
                var id = $(this).parent().attr("data-id");
                var index = parseInt($(this).parents(".classify-list").index()) + 1;
                //  $("#classify-demo .classify-list").eq(index).find("li")
                $(this).parent().addClass("actv");
                $(this).parent().siblings().removeClass("actv");
                $(this).parents(".classify-list").next().find(".addmenu").attr("data-num",0);
                getClass(id,index);
            }else{
                layer.msg("请完成之前的操作");
            }
        }
    });



    //分类查询调接口
    function getClass(id,type){
        var sHtml="";
        var param={
            "id": id
        };
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<li class="managelist" data-parentId="' + row.parentId + '" data-id="'+ row.id +'" data-child="0">' +
                    '<div class="change-input">' +
                    '<input type="text" placeholder="请输入1-5个字" maxlength="5">' +
                    '<i class="savebtn layui-icon">&#xe605;</i>' +
                    '<i class="closebtn layui-icon">&#x1006;</i>' +
                    '</div>' +
                    '<div class="listtext">' +
                    '<span class="manage-name">' + row.categoryName + '</span>'+
                    '</div>'
                    if(row.categoryName!="未分类"){
                        sHtml +=     '<div class="list-ctronl">' +
                        '<i class="delbtn layui-icon">&#xe640;</i>' +
                        '<i class="editbtn layui-icon">&#xe642;</i>' +
                        '</div>'
                    }else{
                        sHtml +=     '<div class="list-ctronl">' +
                        '</div>'
                    }

                    sHtml +=   '</li>';
                }
                if(type==0){
                    $("#oneClass").html(sHtml);
                    $("#classify-demo .classify-list").eq(0).show();
                    $("#classify-demo .classify-list").eq(2).hide();
                    $("#classify-demo .classify-list").eq(3).hide();
                    $("#classify-demo .classify-list").eq(1).hide();
                }else if(type==1){
                        $("#classify-demo .classify-list").eq(type).show();
                        $("#secondClass").html(sHtml);
                    $("#classify-demo .classify-list").eq(2).hide();
                    $("#classify-demo .classify-list").eq(3).hide();
                }else if(type==2){
                        $("#classify-demo .classify-list").eq(type).show();
                        $("#thirdClass").html(sHtml);
                    $("#classify-demo .classify-list").eq(3).hide();
                }else if(type==3){
                        $("#classify-demo .classify-list").eq(type).show();
                        $("#fourClass").html(sHtml);
                }
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //针对分类鼠标滑动效果
    $(".classify-list").on("mouseover",".managelist",function(){
        var index = $(this).find(".manage-name").text();
        if(index!="未分类"){
            $(this).find(".list-ctronl").show();
        }else{
            $(this).css({"background":"#fff","cursor":"not-allowed"});
        }
    });

    $(".classify-list").on("mouseleave",".managelist",function(){
        $(this).find(".list-ctronl").hide();
    });


    //点击新增
    $("#classify-demo").on("click",".addmenu",function(){
        var index = $(this).parents(".classify-list").index();
        var num = $(this).attr("data-num");
        $(".classify-list").attr("data-isclick",1);//1不准进行其他操作
        if(index!=0){
            var oldindex = parseInt(index)-1;
            var oldnum = $(".classify-list").eq(oldindex).find(".addmenu").attr("data-num");
            if(oldnum==0){
                $("#classify-demo .classify-list").eq(index).find(".addmenu").attr("data-num",0);
            }
        }
        $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",1);//是否可以点击保存
        //所有操作按钮都隐藏
        $(".classify-list").on("mouseover",".managelist",function(){
            $(this).find(".list-ctronl").hide();
        })
            var sHtml = '<li id="inputAdd" class="managel">' +
                '<div class="change-input" style="display: block">' +
                '<input type="text" placeholder="请输入1-5个字" maxlength="5">' +
                '<i data-num="2" class="savebtn layui-icon">&#xe605;</i>' +
                '<i class="closebtn layui-icon">&#x1006;</i>' +
                '</div>' +
                '</li>';

            $("#classify-demo .classify-list").find(".addmenu").attr("data-num",1);
            $("#classify-demo .classify-list").eq(index).find("ul").append(sHtml);
            $(".addmenu").hide();
    });

        //新增（物理保存）
        $("#classify-demo").on("click","#inputAdd .savebtn",function(){
            var val = $.trim($(this).parent().find("input").val());
            var index = $(this).parents(".classify-list").index();
            if(val==""){
                layer.msg("请填写分类名称");
            }else{
                $("#classify-demo .classify-list").eq(index).find("ul").append("<li>"+val+"</li>");
                addlist.push(val);
                $("#classify-demo .classify-list").eq(index).find(".save").css({"color":"#399bff","cursor":"pointer"});
                console.log(addlist)
                $("#classify-demo .classify-list").eq(index).find(".save").attr("data-num",1);//为1表示新增保存
                $("#inputAdd").remove();
                $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",0);//是否可以点击保存 0可以
                $("#classify-demo .classify-list").eq(index).find(".addmenu").show();
            }
        })

        //新增取消
        $("#classify-demo").on("click","#inputAdd .closebtn",function(){
            var index = $(this).parents(".classify-list").index();
            $("#classify-demo .classify-list").eq(index).find(".addmenu").attr("data-num",0);
            if(addlist.length==0){
                $(".classify-list").on("mouseover",".managelist",function(){
                    $(this).find(".list-ctronl").show();
                });
                $(".addmenu").show();
                $(".classify-list").attr("data-isclick",0);//1不准进行其他操作
                $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",1);//是否可以点击保存
            }else{
                $("#classify-demo .classify-list").eq(index).find(".addmenu").show();
                $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",0);//是否可以点击保存
            }
            $("#inputAdd").remove();
        })


    //保存
    $("#classify-demo").on("click",".save-box .save",function(){
        var num = $(this).attr("data-num");//1-新增保存 2-修改保存 3-删除保存
        var categoryNames = addlist.join("#-%");
        var isSave =  $(this).attr("data-isclose");//是否可以点击保存;
        var index = $(this).parents(".classify-list").index(); //第几级
        var delids = dellist.join(",");
        var ids = changeid.join(",");
        var changename = changelist.join("#-%");
        if(num==1){
            if(isSave==0){
                if(index==0){
                    addClass(categoryNames,"0",0);
                }else {
                    var pid = $("#classify-demo .classify-list").eq(parseInt(index)-1).find("ul li.actv").attr("data-id");
                    addClass(categoryNames,pid,index);
                }

            }
        }else if(num==3){ //删除分类
            if(isSave==0){
                if(index==0){
                    delClassify(delids,"0",0);
                }else{
                    var pid = $("#classify-demo .classify-list").eq(parseInt(index)-1).find("ul li.actv").attr("data-id");
                    delClassify(delids,pid,index);
                }
            }
        }else if(num==2){ //修改保存
            if(isSave==0){
                if(index==0){
                    updateClassify(ids,changename,"0",0);
                }else{
                    var pid = $("#classify-demo .classify-list").eq(parseInt(index)-1).find("ul li.actv").attr("data-id");
                    updateClassify(ids,changename,pid,index);
                }
            }
        }
    })


    //新增分类调接口
    function addClass(categoryNames,pid,type){
        var param = {
            "categoryNames": categoryNames,
            "pids": pid
        }
        reqAjaxAsync(USER_URL.ADDCLASS,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                layer.msg(res.msg);
                getClass(pid,type);
                $(".classify-list").on("mouseover",".managelist",function(){
                    $(this).find(".list-ctronl").show();
                })
                $(".addmenu").show();
                $("#classify-demo .classify-list").eq(type).find(".save").attr("data-isclose",1);
                $("#classify-demo .classify-list").attr("data-isclick",0);//1不准进行其他操作
                $("#classify-demo .classify-list").eq(type).find(".save").css({"color":"#dfdfdf","cursor":"not-allowed"});
                addlist=[];
            }else{
                layer.msg(res.msg);
            }
        })

    }

    //点击修改
    $("#classify-demo").on("click",".classify-list .editbtn",function(){
        var index = $(this).parents(".classify-list").index();
        var num = $(this).attr("data-num");
        var val = $(this).parents("li").find(".manage-name").text();
        $(".classify-list").attr("data-isclick",1);//1不准进行其他操作
        $(".addmenu").hide();
        $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",1);//是否可以点击保存

        //所有操作按钮都隐藏
        $(".classify-list").on("mouseover",".managelist",function(){
            var ins = $(this).parents(".classify-list").index();
            if(index==ins){
                $(this).find(".list-ctronl").show();
                $(this).find(".list-ctronl").find(".delbtn").hide();
            }else{
                $(this).find(".list-ctronl").hide();
            }
        });
        $(this).parents("li").find(".change-input").show();
        $(this).parents("li").find(".change-input input").val(val);

    });

    //修改（物理保存）
    $("#classify-demo").on("click",".managelist .savebtn",function(){
        var val = $.trim($(this).parent().find("input").val());
        var index = $(this).parents(".classify-list").index();
        var id = $(this).parents("li").attr("data-id");
        if(val==""){
            layer.msg("请填写分类名称");
        }else{
            $(this).parents("li").find(".change-input").hide();
            $(this).parents("li").find(".manage-name").text(val);
            changelist.push(val);
            changeid.push(id);
            $("#classify-demo .classify-list").eq(index).find(".save").css({"color":"#399bff","cursor":"pointer"});
            $(this).parent().hide();
            console.log(changelist)
            $("#classify-demo .classify-list").eq(index).find(".save").attr("data-num",2);//为1表示新增保存
            $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",0);//是否可以点击保存 0可以
        }
    })

    //修改取消
    $("#classify-demo").on("click",".managelist .closebtn",function(){
        var index = $(this).parents(".classify-list").index();
        if(changelist.length==0){
            $(".classify-list").on("mouseover",".managelist",function(){
                $(this).find(".list-ctronl").show();
                $(this).find(".list-ctronl").find(".delbtn").show();
            });
            $(".classify-list").attr("data-isclick",0);//1不准进行其他操作
            $(".addmenu").show();
            $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",1);//是否可以点击保存
        }
        $(this).parents("li").find(".change-input").hide();
    })
    //修改保存调接口
    function updateClassify(id,categoryName,pid,type){
        var param={
            "id":id,
            "categoryName":categoryName
        }
        reqAjaxAsync(USER_URL.UPDATECLASS,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                layer.msg(res.msg);
                getClass(pid,type);
                $(".classify-list").on("mouseover",".managelist",function(){
                    $(this).find(".list-ctronl").show();
                    $(this).find(".list-ctronl").find(".delbtn").show();
                });
                $(".addmenu").show();
                $("#classify-demo .classify-list").eq(type).find(".save").attr("data-isclose",1);
                $("#classify-demo .classify-list").attr("data-isclick",0);//1不准进行其他操作
                $("#classify-demo .classify-list").eq(type).find(".save").css({"color":"#dfdfdf","cursor":"not-allowed"});
                changelist=[];
                changeid=[];
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击删除
    $("#classify-demo").on("click",".classify-list .delbtn",function(){
            var id =  $(this).parents("li").attr("data-id");
            $(this).parents("li").hide();
            dellist.push(id);
            var index = $(this).parents(".classify-list").index();
            $(".classify-list").attr("data-isclick",1);//1不准进行其他操作
           $(".addmenu").hide();
            $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",1);//是否可以点击保存
            //所有操作按钮都隐藏
            $(".classify-list").on("mouseover",".managelist",function(){
                var ins = $(this).parents(".classify-list").index();
                if(index==ins){
                    $(this).find(".list-ctronl").show();
                    $(this).find(".list-ctronl").find(".editbtn").hide();
                }else{
                    $(this).find(".list-ctronl").hide();
                }


            })
            $("#classify-demo .classify-list").eq(index).find(".save").css({"color":"#399bff","cursor":"pointer"});
            console.log(dellist)
            $("#classify-demo .classify-list").eq(index).find(".save").attr("data-num",3);//为1表示删除保存
            $("#inputAdd").remove();
            $("#classify-demo .classify-list").eq(index).find(".save").attr("data-isclose",0);//是否可以点击保存 0可以

    });

    //删除分类调接口
    function delClassify(ids,pid,type){
        var param = {
            "ids":ids
        }
        reqAjaxAsync(USER_URL.DELETECLASS,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                layer.msg(res.msg);
            }else{
                layer.msg(res.msg);
            }
            getClass(pid,type);
            $(".classify-list").on("mouseover",".managelist",function(){
                $(this).find(".list-ctronl").show();
                $(this).find(".list-ctronl").find(".editbtn").show();
            })
            $("#classify-demo .classify-list").eq(type).find(".save").attr("data-isclose",1);
            $("#classify-demo .classify-list").attr("data-isclick",0);//1不准进行其他操作
            $("#classify-demo .classify-list").eq(type).find(".save").css({"color":"#dfdfdf","cursor":"not-allowed"});
            $(".addmenu").show();
            dellist=[];
        })
    }

    /*知识点相关----------------------------------------------------------------------------*/
    //表格工具条操作
    table.on('tool(table2)', function(obj){
        var data = obj.data;
        var id = data.id;
        //删除
        if(obj.event === 'del'){
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示'},
                function(index){
                    restore(id,1,data.title,data.auditStatus);
                })
        }else if(obj.event == 'changetable'){ //查看
            $("#infoKnow").attr("data-id",id);
            $("#infoKnow .tip-titl div").eq(0).text(data.title);
            $("#infoKnow .isclassify span").text(data.categoryName);
            $("#infoKnow .isclassify").attr("data-categoryId",data.categoryId);
            $("#infoKnow .tip-isvaild").attr("data-isvaild",data.auditStatus);
            if(data.auditStatus==1){
                $("#infoKnow .tip-isvaild span").eq(0).text("有效");
            }else{
                $("#infoKnow .tip-isvaild span").eq(0).text("无效");
            }
            var titarr=[];
            var idarr=[];
            for(var i=0;i<data.knowledgeList.length;i++){
                var rew = data.knowledgeList[i];
                titarr.push(rew.title);
                idarr.push(rew.id);
            }
            $("#infoKnow").attr("data-tit",titarr.join("#-%"));
            $("#infoKnow").attr("data-knowid",idarr);
            $("#infoKnow .tip-isvaild span").attr('data-endTime',data.endTime);
            $("#infoKnow .tip-isvaild span").attr('data-startTime',data.startTime);
            if(data.startTime=="2000-01-01" && data.endTime == '2099-01-01'){
                $("#infoKnow .tip-isvaild span").eq(1).text("永久有效");
            }else{
                $("#infoKnow .tip-isvaild span").eq(1).text(data.startTime + " - " + data.endTime);
            }

            $("#infoKnow .info-text").text(data.content);
            $("#infoKnow").show();
            $("#infoKnow").animate({right:'0'});
        }else if(obj.event == 'change'){
            $(".jurisdiction-content").hide();
            $(".newkonwa").show();
            $(".infomation").animate({right:'-40%'});
            $("#saveKonw").attr("lay-filter","formupdatek");
            $("#saveKonw").attr("data-id",id);
            $(".jurisdiction-content").hide();
            $(".newkonwa").show();
            $(".infomation").animate({right:'-40%'});
            getTrees("#treesKnow");
            $("#addkTitle").val(data.title);
            $("#editorKnow").val(data.content);
            $(".newkonwa .selectname").text(data.categoryName);
            $(".newkonwa .selectname").attr("data-id",data.categoryId);
            var sHtml="";
            associatedId=[];
            associatedTit=[];
            if(data.knowledgeList.length>0){
                for(var i=0;i<data.knowledgeList.length;i++){
                    var row = data.knowledgeList[i];
                    associatedId.push(row.id);
                    associatedTit.push(row.title);
                    sHtml+='<div  data-id="'+ row.id +'"><p class="qstit">' + row.title +'</p><span class="delqs">删除</span></div>';
                }
                $(".oldqs").html(sHtml);
            }
            if(data.auditStatus==1){ //启用
                $("#isStopkonw a").removeClass("acve");
                $("#isStopkonw a").eq(0).addClass("acve");
                $(".minitabk").show();
                $(".minitabk").attr("data-val",0);
                if(data.startTime=="2000-01-01" && data.endTime == '2099-01-01'){
                    document.getElementById('diyVaildkonw').checked=false;
                    document.getElementById('alwayVaildkonw').checked=true;
                    $("#alwayVaildkonw").next().addClass("layui-form-radioed");
                    $("#diyVaildkonw").next().removeClass("layui-form-radioed");
                    $(".newkonwa .date-picker").hide();
                    form.render();
                }else{
                    $(".newkonwa .date-picker").show();
                    document.getElementById('diyVaildkonw').checked=true;
                    document.getElementById('alwayVaildkonw').checked=false;
                    $("#diyVaildkonw").next().addClass("layui-form-radioed");
                    $("#alwayVaildkonw").next().removeClass("layui-form-radioed");
                    form.render();
                    $(".newkonwa #datetimepicker1").attr("data-time",1);
                    $(".newkonwa #datetimepicker2").attr("data-time",2);
                    $(".newkonwa #jurisdiction-begin").val(data.startTime);
                    $(".newkonwa #jurisdiction-end").val(data.endTime);
                }
            }else{//停用
                $("#isStopkonw a").removeClass("acve");
                $("#isStopkonw a").eq(1).addClass("acve");
                $(".minitabk").hide();
                $(".minitabk").attr("data-val",1);
            }
        }
    });

    //查看详情删除
    $("#delKnow1").click(function(){
        var id = $("#infoKnow").attr("data-id");
        var titl = $("#infoKnow").find(".titletxt").text();
        var auditStatus =$("#infoKnow .tip-isvaild").attr("data-isvaild");
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                restore(id,1,titl,auditStatus);
                $(".infomation").animate({right:'-40%'});
            })
    });

    //查看详情知识点修改
    $("#editKnow1").click(function(){
        var id = $("#infoKnow").attr("data-id");
        var titl = $("#infoKnow").find(".titletxt").text();
        var content =  $("#infoKnow").find(".info-text").text();
        var categoryId = $("#infoKnow").find(".isclassify").attr('data-categoryId');
        var categoryName = $("#infoKnow").find(".isclassify span").text();
        var auditStatus =$("#infoKnow .tip-isvaild").attr("data-isvaild");
        var knowid=$("#infoKnow").attr("data-knowid").split(",") || "";
        var knowtit=$("#infoKnow").attr("data-tit").split("#-%") ||"";
        var endTime=$("#infoKnow .tip-isvaild span").attr('data-endTime');
        var startTime=$("#infoKnow .tip-isvaild span").attr('data-startTime');
        $(".jurisdiction-content").hide();
        $(".newkonwa").show();
        $(".infomation").animate({right:'-40%'});
        $("#saveKonw").attr("lay-filter","formupdatek");
        $("#saveKonw").attr("data-id",id);
        $(".jurisdiction-content").hide();
        $(".newkonwa").show();
        $(".infomation").animate({right:'-40%'});
        getTrees("#treesKnow");
        $("#addkTitle").val(titl);
        $("#editorKnow").val(content);
        $(".newkonwa .selectname").text(categoryName);
        $(".newkonwa .selectname").attr("data-id",categoryId);
        var sHtml="";
        associatedId=[];
        associatedTit=[];
        if(knowid!=""){
            for(var i=0;i<knowid.length;i++){
                var row = knowid[i];
                var rows=knowtit[i];
                associatedId.push(row);
                associatedTit.push(rows);
                sHtml+='<div  data-id="'+ row +'"><p class="qstit">' + rows +'</p><span class="delqs">删除</span></div>';
            }
            $(".oldqs").html(sHtml);
        }

        if(auditStatus==1){ //启用
            $("#isStopkonw a").removeClass("acve");
            $("#isStopkonw a").eq(0).addClass("acve");
            $(".minitabk").show();
            $(".minitabk").attr("data-val",0);
            if(startTime=="2000-01-01" && endTime == '2099-01-01'){
                document.getElementById('diyVaildkonw').checked=false;
                document.getElementById('alwayVaildkonw').checked=true;
                $("#alwayVaildkonw").next().addClass("layui-form-radioed");
                $("#diyVaildkonw").next().removeClass("layui-form-radioed");
                $(".newkonwa .date-picker").hide();
                form.render();
            }else{
                $(".newkonwa .date-picker").show();
                document.getElementById('diyVaildkonw').checked=true;
                document.getElementById('alwayVaildkonw').checked=false;
                $("#diyVaildkonw").next().addClass("layui-form-radioed");
                $("#alwayVaildkonw").next().removeClass("layui-form-radioed");
                form.render();
                $(".newkonwa #datetimepicker1").attr("data-time",1);
                $(".newkonwa #datetimepicker2").attr("data-time",2);
                $(".newkonwa #jurisdiction-begin").val(startTime);
                $(".newkonwa #jurisdiction-end").val(endTime);
            }
        }else{//停用
            $("#isStopkonw a").removeClass("acve");
            $("#isStopkonw a").eq(1).addClass("acve");
            $(".minitabk").hide();
            $(".minitabk").attr("data-val",1);
        }
    });

    //知识点中点击添加新问题
    $("#addQse").on("click",function(){
        layer.open({
            title: ['添加新问题', 'font-size:15px;background-color:#fff;color:#000'],
            type: 1,
            content: $('#knowTip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['900px', '700px'],
            shade: [0.1, '#fff'],
            btn:['提交','取消'],
            offset: '100px',
            resize: false,
            end: function () {
                $('#knowTip').hide();
            },
            success: function (layero) {
                getTrees("#trees");
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit", "");
                $("a.layui-layer-btn0").attr("lay-filter", "formdemo");
                layero.find(".title").hide();
                layero.find(".newknow").css("padding","15px 0 0");
                layero.find(".newkonw-box").css("padding","0");
                layero.find(".ctroladd").hide();
            },yes:function(index, layero){
                saveKnow(USER_URL.ADDLIST,2);
            }
        })
    });

    //点击关联已有问题
    $("#relevancy").on("click",function(){
        layer.open({
            title: ['添加关联问题', 'font-size:15px;background-color:#fff;color:#000'],
            type: 1,
            content: $('#associated'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['900px', '630px'],
            shade: [0.1, '#fff'],
            btn:['添加','取消'],
            offset: '100px',
            resize: false,
            end: function () {
                $('#associated').hide();
            },
            success: function (layero) {
                getTree(1);
            },yes:function(index, layero){
                        var sHtml ="";
                        if(associatedId.length>0){
                            for(var i=0;i<associatedId.length;i++){
                                sHtml+='<div  data-id="'+ associatedId[i] +'"><p class="qstit">' + associatedTit[i] +'</p><span class="delqs">删除</span></div>';
                            }
                            console.log(associatedTit)
                            layer.close(index);
                            //添加完问题
                            $(".oldqs").html(sHtml);
                        }else{
                            layer.msg("请选中关联问题");
                        }


            }
        })
    });

    //添加知识点
    function saveKw(cmd,type,id){ //type 1-修改 0-添加
        var title = $.trim($("#addkTitle").val());
        var content = $.trim($("#editorKnow").val());
        var categoryId = $(".newkonwa .selectname").attr("data-id");
        var categoryName = $(".newkonwa .selectname").text();
        var diystart =$(".newkonwa #jurisdiction-begin").val();
        var diyend = $(".newkonwa #jurisdiction-end").val();
        var cretetime = new Date().pattern("yyyy-MM-dd");
        var year = parseInt(cretetime.split("-")[0])+100;
        var endtm = year+'-'+cretetime.split("-")[1]+'-'+cretetime.split("-")[2];
        var list = $(".about-qs .newqs div");
        var listold = $(".about-qs .oldqs div");
        var listArr = [];
        if(list.length>0) {
            for (var i = 0; i < list.length; i++) {
                listArr.push(list.eq(i).attr("data-id"));
            }
        }
        if(listold.length>0) {
            for(var i=0;i<listold.length;i++){
                listArr.push(listold.eq(i).attr("data-id"));
            }
        }
         if(listold.length>0||list.length>0){
             var knowledgeids = listArr.join(",");
        }else{
            var knowledgeids = "";
        }

        var param = {
            "title": title,//标题
            "content": content,//对外答案
            "categoryId": categoryId,//分类id
            "userid": operaterId,//创建人
            "username":username,//操作人帐号
            "knowledgeids":knowledgeids //关联的问题的id
        }
        if($("#isStopkonw a.acve").index()==1){//停用
            param.startTime=cretetime;//答案有效期开始时间
            param.endTime=endtm;//答案有效期结束时间
            param.auditStatus='2';
        }else{
            var isradios = $(".minitabk").attr("data-val");
            var isever = $(".minitabk").attr("data-isever");
            if(isever==0){ //自定义
                if(diystart=="" ||diyend==""){
                    layer.msg("请选择有效期日期");
                    return false;
                }
                param.startTime=diystart;//答案有效期开始时间
                param.endTime=diyend;//答案有效期结束时间
            }else{//永久有效
                param.startTime='2000-1-1';//答案有效期开始时间
                param.endTime='2099-1-1';//答案有效期结束时间
            }
            param.auditStatus="1";
        }
        if(type==1){
            param.id=id;
        }
        if(locked){
            locked = false;
            reqAjaxAsync(cmd,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    var raw = res.data;
                    layer.msg(res.msg);
                    setTimeout(function(){
                        location.reload();
                        locked = true;
                    },1000)

                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
            })
        }
    }

    //添加知识保存
    form.on('submit(formaddk)', function(data){
        if(data){
            saveKw(USER_URL.ADDKNOW,0);
        }
    });

    //修改知识点
    form.on('submit(formupdatek)', function(data){
        if(data){
            var id = $("#saveKonw").attr("data-id");
            saveKw(USER_URL.UPDATEKNOW,1,id);
        }
    });
})(jQuery)