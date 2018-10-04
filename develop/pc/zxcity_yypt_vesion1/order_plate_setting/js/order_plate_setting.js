(function($){
    var page = 1;
    var rows = 10;
    var roleId = yyCache.get("roleIds") || "";
    var names = yyCache.get("name") || "";
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/getJobOrderSections', //(查询工单版块)
        ADDRESOURCE : 'operations/addJobOrderSection',//(新增工单版块)
        UPDATERESOURCE :'operations/updateJobOrderSection',//(修改工单版块)
        DELRESOURCE :'operations/deleteJobOrderCategory'//(删除工单类别或版块)
    };

    var layer = layui.layer;
    layui.use('form', function(){
        form = layui.form;
    })


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
            callback: {
                onClick: zTreeOnClick
            }
        };

        var parentId = sessionStorage.getItem("parentId");
        var roleId = sessionStorage.getItem("roleId");
        var paramLft = "{}";
        reqAjaxAsync(USER_URL.RESOURLIST,paramLft).done(function(res){
            if(res.code == 1){
                if(res.data.length==0){
                    $(".addorder").show();
                    $(".jurisdiction-content").hide();
                }else{
                    $(".addorder").hide();
                    $(".jurisdiction-content").show();
                    for(var i=0;i<res.data.length;i++){
                        res.data[i].id=Number(res.data[i].id);
                        res.data[i].pid=Number(res.data[i].parentId);
                        res.data[i].name=res.data[i].categoryName;
                        res.data[i].icon = "";
                        res.data[i].code = res.data[i].categoryCode;
                    }
                    treeObj = $.fn.zTree.init($("#tree"), setting, res.data);
                    if (nos != null &&nos.length>0) {
                        treeObj.selectNode(nos[0]);
                    }
                }
            }else{
                layer.msg(res.msg);
            }
        });
    }

    getTree();

    //点击新增
    $(".addorder").click(function(){
        $(".addorder").hide();
        $(".jurisdiction-content").show();
    });

    //刷新
    $("#refreshbtn").on("click",function(){
        location.reload();
    });

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
        $("#moduleName").val(name);
        $("#moduleName").attr("data-pid",treeNode.pid);
        $("#moduleName").attr("data-id",treeNode.id);
        $("#code").val(treeNode.code);
        if(treeNode.level==3){
            $("#addbtn").attr("disabled",true);
            $("#addbtn").css("background","#dfdfdf");
            $("#addbtn").css("cursor","not-allowed");
        }else{
            $("#addbtn").attr("disabled",false);
            $("#addbtn").css("background","#fff");
            $("#addbtn").css("cursor","pointer");
        }
        //判断选中的是否为子节点
        //若为父节点flag = true
        if(nds.length > 0){
            var flag = nds[0].isParent;
            treeObj.expandNode(nds[0],!nds[0].open, false, true)
        }
        $("#deletebtn").attr("data-flag",flag);
        nos = treeObj.getSelectedNodes();
    }


    //修改保存
    form.on('submit(updateSave)',function(data){
        if(data){
            var pid = $("#moduleName").attr("data-pid");
            var name = $.trim($("#moduleName").val());
            var moduleId = $("#moduleName").attr("data-id");
            var code = $.trim($("#code").val());
            if(name.indexOf("script")!=-1){
                $("#moduleName").val("");
                layer.msg("请输入正确的名称");
                return;
            }
            if(code.indexOf("script")!=-1){
                $("#moduleName").val("");
                layer.msg("请输入正确的编码");
                return;
            }
            var param = {
                "id": moduleId,
                "categoryName": name,
                "categoryCode": code,
                "parentId": pid
            };
            reqAjaxAsync(USER_URL.UPDATERESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    layer.msg("修改成功");
                    getTree(nos);
                }else{
                    layer.msg(res.msg);
                }
            });
        }
        return false;
    });


    //点击添加
    $("#addbtn").click(function(){
        $(".savebtn").attr("id","saveBtn");
        $(".savebtn").attr("lay-filter","saveBtn");
        $("#moduleName").val("");
        $("#code").val("");
    });

    //添加保存
    form.on('submit(saveBtn)',function(data){
        if(data){
            var pid = $(".savebtn").attr("data-id") || 0;
            var name = $.trim($("#moduleName").val());
            var code = $.trim($("#code").val());
            if(name.indexOf("script")!=-1){
                $("#moduleName").val("");
                layer.msg("请输入正确的名称");
                return;
            }
            if(code.indexOf("script")!=-1){
                $("#code").val("");
                layer.msg("请输入正确的编码");
                return;
            }

            var param = {
                "parentId": pid, //父id
                "categoryName": name, //权限名称
                "categoryCode": code //编码
            };
            reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("添加成功");
                    $("#moduleName").val("");
                    $("#code").val("");
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
            layer.msg("请选中左侧节点");
        }else{
            var fla = $(this).attr("data-flag");
            if(fla == "true"){
                layer.msg("请先删除子节点");
            }else{
                layer.confirm(
                    "确认删除?",
                    {icon: 3, title:'提示'},
                    function(index){
                        var paramDel = "{'id':'" + delId +"'}";
                        reqAjaxAsync(USER_URL.DELRESOURCE, paramDel).done(function(res){
                            if (res.code == 1) {
                                layer.msg(res.msg);
                                setTimeout(function(){
                                    location.reload();
                                },500);
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

})(jQuery);