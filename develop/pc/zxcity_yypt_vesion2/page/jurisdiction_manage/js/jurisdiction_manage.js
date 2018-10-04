(function($){
    var page = 1;
    var rows = 10;
    var names = yyCache.get("name") || "";
    var pid = '';
    var USER_URL = {
        ADDRESOURCE : 'operations/addResource',//(新增权限)
        UPDATERESOURCE :'operations/updateResource',//(修改权限)
        DELRESOURCE :'operations/removeResource',//(删除权限)
        RESOURCETREE : 'operations/resourceTree', //(权限树)
        MOVERESOURCE : 'operations/moveResource', //(拖拽保存)
        SINGLERESOURCE : 'operations/singleResource' //(查询某一条)
    };

    var layer = layui.layer;
    layui.use('form', function(){
        form = layui.form;
    })


    //网址
    $("#url").blur(function(){
        var num = $(this).attr("data-num");
        var $website = /^[a-zA-Z-][0-9a-zA-Z-_.]{1,90}(.html)$|^[a-zA-Z-][0-9a-zA-Z-_/.]{1,90}(.html)$/; //网址
        if($(this).val() != "") {
          /*  if(!$website.test($.trim($(this).val()))){*/
            if($(this).val().indexOf(".html")==-1){
                if (num == 0) {
                    $(this).val("");
                    $(this).attr("data-num", "1");
                    layer.msg("请输入正确的网址",
                        function (index) {
                            $("#url").attr("data-num", "0");
                            layer.closeAll();
                        });
                    return false;
                }
            }
        }
    });

    //权限名称
    $("#moduleName").blur(function(){
        var num = $(this).attr("data-num");
        var nameExp = /^[\u4e00-\u9fa5a-zA-Z]+$/; //中文或者英文
        if($(this).val() != ""){
            if(!nameExp.test($.trim($(this).val()))){
                if(num == 0){
                    $(this).val("");
                    $(this).attr("data-num","1");
                    layer.msg("权限名称必须为中文或者英文",
                        function(index){
                            $("#moduleName").attr("data-num","0");
                            layer.closeAll();
                        },3000);
                    return false;
                }
            }
        }
    });

    //加载左侧导航树
    function getTree(nos){
        var setting = {
            check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            view: {
                showIcon: true
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    isCopy: false,
                    isMove: true,
                    autoExpandTrigger: true,
                    minMoveSize: 10,
                    borderMax: 20,
                    borderMin: -10,
                    prev: dropPrev, //拖拽到目标节点时，设置是否允许移动到目标节点前面的操作
                    inner: dropInner, //拖拽到目标节点时，设置是否允许成为目标节点的子节点。
                    next: dropNext //拖拽到目标节点时，设置是否允许移动到目标节点后面的操作。
                }
            },
            callback: {
                onClick: zTreeOnClick,
               beforeDrag: beforeDrag, //拖拽前：捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
                /*  beforeDrop: beforeDrop, //拖拽中：捕获节点操作结束之前的事件回调函数，并且根据返回值确定是否允许此拖拽操作
                beforeDragOpen: zTreeBeforeDragOpen, //拖拽到的目标节点是否展开：用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
                onDrag: onDrag, //捕获节点被拖拽的事件回调函数*/
                onDrop: zTreeOnDrop //捕获节点拖拽操作结束的事件回调函数
                /*onExpand: onExpand //捕获节点被展开的事件回调函数*/
            }
        };

        var parentId = sessionStorage.getItem("parentId");
        var roleId = sessionStorage.getItem("roleId");
        var paramLft = "{'parentId':'" + parentId + "','roleId':'" + roleId + "'}";
        reqAjaxAsync(USER_URL.RESOURCETREE,paramLft).done(function(res){
            if(res.code == 1){
                var treeData = res.data;
                treeObj = $.fn.zTree.init($("#tree"), setting, treeData);
                if (nos != null &&nos.length>0) {
                    treeObj.selectNode(nos[0]);
                }
            }else{
                layer.msg(res.msg);
            }
        });
    }

    getTree();

    //刷新
    $("#refreshbtn").on("click",function(){
        location.reload();
    });

    var log, className = "dark", curDragNodes, autoExpandNode;
    function beforeDrag(treeId, treeNodes) {
        className = (className === "dark" ? "":"dark");
        for (var i=0,l=treeNodes.length; i<l; i++) {
            if (treeNodes[i].drag === false) {
                curDragNodes = null;
                return false;
            } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
                curDragNodes = null;
                return false;
            }
        }
        curDragNodes = treeNodes;
        return true;
    }

    function dropPrev(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode();
        if (pNode && pNode.dropInner === false) {
            return false;
        } else {
            for (var i=0,l=curDragNodes.length; i<l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }
    function dropInner(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode();
        if (targetNode && targetNode.dropInner === false) {
            return false;
        } else {
            for (var i=0,l=curDragNodes.length; i<l; i++) {
                if (!targetNode && curDragNodes[i].dropRoot === false) {
                    return false;
                } else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }
    function dropNext(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode();
        if (pNode && pNode.dropInner === false) {
            return false;
        } else {
            for (var i=0,l=curDragNodes.length; i<l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }

    //拖拽时自动展开
    function zTreeBeforeDragOpen(treeId, treeNode) {
        return true;
    };



    //拖拽事件
    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
        var id = treeNodes[0].id || "";
        var parid = treeNodes[0].pid;
        var treeO = $.fn.zTree.getZTreeObj("tree");
        var sNodes = treeO.getSelectedNodes();
        if (sNodes.length > 0) {
            var node = sNodes[0].getIndex();
        }
        console.log("拖拽后")
        console.log(targetNode)
        console.log('moveType'+moveType)
        if(targetNode != null ) { //成为 treeNodes 拖拽结束的目标节点 JSON 数据对象。
            var name = targetNode.name || "";
            var ids = targetNode.id;
            var pid = targetNode.pid;
            if (moveType == "next" || moveType == "prev") {
                var nodes = treeO.getNodesByParam("pid", pid, null);
                var list = [];
                for (var i = 0; i < nodes.length; i++) {
                    var parr = {};
                    parr.id = nodes[i].id;
                    if (nodes[i].pid == 0) {
                        parr.pid = "";
                    } else {
                        parr.pid = nodes[i].pid;
                    }
                    parr.sort = i;
                    parr.operatorName = names;
                    list.push(parr);
                }
                $(".savebtn").attr("data-id", id);
                $(".savebtn").attr("lay-filter", "updateSave");
                $(".savebtn").attr("id", "updateSave");
                $("#deletebtn").attr("data-id", id);
                getDetail(id);
                dropSave(list);
            } else {
                var nodes = treeO.getNodesByParam("pid", ids, null);
                var list = [];
                for (var i = 0; i < nodes.length; i++) {
                    var parr = {};
                    parr.id = nodes[i].id;
                    if (nodes[i].pid == 0) {
                        parr.pid = "";
                    } else {
                        parr.pid = nodes[i].pid;
                    }
                    parr.sort = i;
                    parr.operatorName = names;
                    list.push(parr);
                }
                $(".savebtn").attr("data-id", id);
                $(".savebtn").attr("lay-filter", "updateSave");
                $(".savebtn").attr("id", "updateSave");
                $("#deletebtn").attr("data-id", id);
                getDetail(id);
                 dropSave(list);
            }

        }else{
            var nodes = treeO.getNodesByParam("pid", 0, null);
            var list = [];
            for (var i = 0; i < nodes.length; i++) {
                var parr = {};
                parr.id = nodes[i].id;
                if (nodes[i].pid == 0) {
                    parr.pid = "";
                } else {
                    parr.pid = nodes[i].pid;
                }
                parr.sort = i;
                parr.operatorName = names;
                list.push(parr);
            }
            $(".savebtn").attr("data-id", id);
            $(".savebtn").attr("lay-filter", "updateSave");
            $(".savebtn").attr("id", "updateSave");
            $("#deletebtn").attr("data-id", id);
            getDetail(id);
             dropSave(list);
        }
    };


    //拖拽保存
    function dropSave(pid){
        var param = {
            pid:pid,
            operatorName:names
        };



        reqAjaxAsync(USER_URL.MOVERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                layer.msg("拖拽成功");
              //  getTree();
            }else{
                layer.msg(res.msg);
            }
        });
    }

    //折叠展开
    $("#openbtn").click(function(){
        $(this).hide();
        $("#sqibtn").show();
        treeObj.expandAll(true);
    });
    $("#sqibtn").click(function(){
        $("#openbtn").show();
        $(this).hide();
        treeObj.expandAll(false);
    });

    //点击修改
    function zTreeOnClick(event, treeId, treeNode){
        var name = treeNode.name || "";
        var id = treeNode.id || "";
        $(".savebtn").attr("data-id",id);
        $(".savebtn").attr("lay-filter","updateSave");
        $(".savebtn").attr("id","updateSave");
        $("#deletebtn").attr("data-id",id);
        var nds = treeObj.getSelectedNodes();
        //判断选中的是否为子节点
        //若为父节点flag = 0
        if(nds.length > 0){
            var flag = nds[0].pid;
            treeObj.expandNode(nds[0], !nds[0].open, false, true)
        }
        console.log(flag);
        $("#deletebtn").attr("data-flag",flag);
        getDetail(id);
        nos = treeObj.getSelectedNodes();

    }

    //获取所有子节点


    //查询某一条
    function getDetail(resourceId){
        var param = {
            resourceId :resourceId
        }
        reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var row = res.data;
                var note = row.note || "";
                var name = row.name || "";
                var id = row.id || "";
                var pid = row.pid || "";
                var url = row.url || "";
                var code = row.code || "";
                var icon = row.icon || "";
                var sort = row.sort;
                $("#moduleName").val(name);
                $("#moduleName").attr("data-id",id);
                $("#moduleName").attr("data-pid",pid);
                $("#moduleName").attr("data-sort",sort);
                $("#url").val(url);
                $("#code").val(code);
                $("#note").val(note);
                $("#icon").val(icon);
                $(".tip").hide();
            }else{
                layer.msg(res.msg);
            }
        });
    }




    //修改保存
    form.on('submit(updateSave)',function(data){
        if(data){
            var pid = $("#moduleName").attr("data-pid");
            var name = $.trim($("#moduleName").val());
            var moduleId = $("#moduleName").attr("data-id");
            var url = $("#url").val();
            var code = $.trim($("#code").val());
            var note = $.trim($("#note").val());
            var icon = $("#icon").val();
            var sort = $("#moduleName").attr("data-sort");
            if(icon == 'null'){
                var icons = "";
            }else{
                var icons =icon;
            }
            if(pid == ""){
                var param = {
                    moduleId : moduleId,//id
                    moduleName: name, //权限名称
                    url: url, //url地址
                    code: code, //编码
                    note: note, //备注
                    icon: icons, //图标
                    moduleType: 0,
                    operatorName:names,
                    sort:sort
                };

            }else{
                var param = {
                    parentId: pid,//pid
                    moduleId : moduleId,//id
                    moduleName: name, //权限名称
                    url: url, //url地址
                    code: code, //编码
                    note: note, //备注
                    icon: icons,
                    moduleType: 0,
                    operatorName:names,
                    sort:sort
                };
            }
            reqAjaxAsync(USER_URL.UPDATERESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    layer.msg("修改成功");
                   // treeDetail();
                    getDetail(moduleId);
                    getTree();
                }else{
                    layer.msg(res.msg);
                }
            });
        }
        return false;
    });


    //点击添加
    $("#addbtn").click(function(){
       $(".addcontent-table input").val("");
        $(".savebtn").attr("id","saveBtn");
        $(".savebtn").attr("lay-filter","saveBtn");
        $("#moduleName").val("");
        $("#code").val("");
        $("#url").val("");
        $("#icon").val("");
        $("#note").val("");
    });

    //添加保存
    form.on('submit(saveBtn)',function(data){
        if(data){
            var pid = $(".savebtn").attr("data-id") || "";
            var name = $.trim($("#moduleName").val());
            var url = $("#url").val();
            var code = $.trim($("#code").val());
            var note = $.trim($("#note").val());
            var icon = $("#icon").val();
            if(icon == 'null'){
                var icons = "";
            }else{
                var icons =icon;
            }
            //网址正则
            if(pid == ""){
                var param = {
                    moduleName: name, //权限名称
                    url: url, //url地址
                    code: code, //编码
                    note: note, //备注
                    icon: icons,
                    moduleType: 0,
                    operatorName:names,
                    sort:0
                };

            }else{
                var param = {
                    parentId: pid, //父id
                    moduleName: name, //权限名称
                    url: url, //url地址
                    code: code, //编码
                    note: note, //备注
                    icon: icons,
                    moduleType: 0,
                    operatorName:names,
                    sort:0
                };
            }
            reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("添加成功");
                    $("#moduleName").val("");
                    $("#code").val("");
                    $("#url").val("");
                    $("#icon").val("");
                    $("#note").val("");
                  //  treeDetail();
                  //  getDetail();
                    getTree();
                }else{
                    layer.msg(res.msg);
                }
            });
        }
        return false; //阻止页面刷新
    });


    //删除
    $("#deletebtn").on("click", function () {
        var delId = $(this).attr("data-id") || "";
        if(delId == ""){
            layer.alert("请选中左侧节点");
        }else{
            var fla = $(this).attr("data-flag");
            if(fla == "0"){
                layer.alert("请先删除子节点");
            }else{
                layer.confirm(
                    "确认删除?",
                    {icon: 3, title:'提示'},
                    function(index){
                        var paramDel = "{'moduleId':'" + delId + "','operatorName':'" + names + "'}";
                        reqAjaxAsync(USER_URL.DELRESOURCE, paramDel).done(function(res){
                            if (res.code == 1) {
                                location.reload();
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    })
            }
        }
    });

    //点击顶部标题取消选中树
    $(".trees-box h4").click(function(){
        getTree();
        $(".savebtn").attr("data-id","");
        $(".savebtn").attr("id","saveBtn");
        $(".savebtn").attr("lay-filter","saveBtn");
        $("#deletebtn").attr("data-id","");
        $(".addcontent-table input").val("");
    });


//子页面滚动条隐藏
    $("#tree").niceScroll({
        cursorcolor:"#dfdfdf",
        cursorborder:"0",
        autohidemode:false
    });
})(jQuery);