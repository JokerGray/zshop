(function($){
    var page = 1;
    var rows = 10;
    var names = yyCache.get("name") || "";
    var pid = '';
    var USER_URL = {
        RESOURCETREE : 'operations/queryAllAgentManagerMenuList', //(权限树)
        SINGLERESOURCE : 'operations/queryMenuData', //(查询某一条),
        UPDATERESOURCE:'operations/updateAgentManagerMenu',//修改
        ADDRESOURCE:'operations/addAgentManagerMenu',//添加
        DELRESOURCE:'operations/deleteAgentManagerMenu',//删除
        MOVERESOURCE : 'operations/moveAgentManagerMenu' //(拖拽保存)
    };

    var layer = layui.layer;
    layui.use('form', function(){
        form = layui.form;
    });

    //网址
    $("#url").blur(function(){
        var num = $(this).attr("data-num");
        var $website = /^[a-zA-Z-][0-9a-zA-Z-_.]{1,90}(.html)$|^[a-zA-Z-][0-9a-zA-Z-_/.]{1,90}(.html)$/; //网址
        if($(this).val() != "") {
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
            };
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
                        });
                    return false;
                };
            }
        };
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
                    pIdKey: "parentid",
                    rootPId: null
                }
            },
            view: {
                showIcon: true
            },
            
            callback: {
                onClick: zTreeOnClick
            }
        };
        

        reqAjaxAsync(USER_URL.RESOURCETREE,'{}').done(function(res){
            if(res.code == 1){
                var treeData = res.data;
                $.each(treeData,function(i,v){
                	v.icon = null;
                })
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
    

    //点击事件
     function zTreeOnClick(event, treeId, treeNode){
     	
        $("#tree").find("a").attr("href","javaScript:")
        var name = treeNode.name || "";
        var id = treeNode.id || "";
        var nodes = treeObj.getSelectedNodes();
        if(nodes.length>0){
        	treeObj.expandNode(nodes[0], !nodes[0].open, false, true);
        	 var flag = nodes[0].isParent;
        };
        
        $(".savebtn").attr("data-id",id);
        $(".savebtn").attr("lay-filter","updateSave");
        $(".savebtn").attr("id","updateSave");
        $("#deletebtn").attr("data-id",id);
        var nds = treeObj.getSelectedNodes();
        $("#deletebtn").attr("data-flag",flag);
        getDetail(id);
        nos = treeObj.getSelectedNodes();
    };


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
    //查询某一条
    function getDetail(resourceId){
        var param = {
            id :resourceId
        };
        reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var row = res.data;
                var note = row.description || "";
                var name = row.name || "";
                var id = row.id || "";
                var pid = row.parentid || "";
                var url = row.url || "";
                 var code = row.sortNum || "";
                var icon = row.icon || "";
                $("#moduleName").val(name);
                $("#moduleName").attr("data-id",id);
                $("#moduleName").attr("data-pid",pid);
                $("#url").val(url);
                $('#code').val(code);
                $("#icon").val(icon);
                $('#note').val(note);
                $(".tip").hide();
            }else{
                layer.msg(res.msg);
            }
        });
    };




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
            if(icon == 'null'){
                var icons = "";
            }else{
                var icons =icon;
            }

            var param = {
             		id:moduleId,
                    parentid: pid,//pid
                    name: name, //权限名称
                    description: note, //描述
                    url: url, //url地址
                    sortNum: code, //排序序号 
                    icon: icons//图标
                };
            reqAjaxAsync(USER_URL.UPDATERESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    layer.msg("修改成功");
                   // treeDetail();
                    getDetail(moduleId);
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
         
            var param = {
                    parentid: pid,//pid
               
                    name: name, //权限名称
                    url: url, //url地址
                    sortNum: code, //排序序号
                    description: note, //描述
                    icon: icons//图标
                  
                
                };
            reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg("添加成功");
                    $("#moduleName").val("");
                    $("#code").val("");
                    $("#url").val("");
                    $("#icon").val("");
                    $("#note").val("");
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
            if(fla == "true"){
                layer.alert("请先删除子节点");
            }else{
                layer.confirm(
                    "确认删除?",
                    {icon: 3, title:'提示'},
                    function(index){
                        var paramDel = "{'id':'" + delId + "'}";
                        reqAjaxAsync(USER_URL.DELRESOURCE, paramDel).done(function(res){
                            if (res.code == 1) {
                               // treeDetail();
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


})(jQuery);