jQuery(function ($) {
    var page = 1;
    var rows = 10;
    var pid = '';
    var SERVICE = {
        GET_DETAILS: 'operations/getOrganizationByIdNew' //(查询某一条)
        , TREELIST: 'operations/organizationNodes' //(树)
        , ADD_ORG: "operations/addOrganization"
        , UPDATE_ORG: "operations/updateOrganization"
        , DELETE_ORG: "operations/deleteOrganization"
    };

    var layer = layui.layer;

    var _zTreeObj = null;

    var _currentVm = null;

    var _zTreeSetting = {
        check: {
            // autoCheckTrigger: true,
            // chkboxType: { "Y": "ps", "N": "ps" },
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
                pIdKey: "pid"
            }
        },
        view: {
            showIcon: true
        },
        edit: {
            enable: false,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                autoExpandTrigger: false,
                isCopy: false,
                isMove: true,
                prev: dropPrev,
                inner: dropInner,
                next: dropNext
            }
        },
        callback: {
            onClick: onNodeClick,
            onDrop: onNodeDrop
        }
    };




    /************ when dom ready **********/

    _currentVm = createVue();


    bindOrganizationTree();

    var top = $("#head", window.parent.document).outerHeight();
    let tableHeight = $(this).outerHeight() - top;
    $(".jurisdiction-left").height(tableHeight);
    $(".jurisdiction-right").height(tableHeight);


    /*************./when dom ready *********/




    /* 初始化vue对象 */
    function createVue() {
        return new Vue({
            el: "#detailsForm",
            data: {
                item: {
                    id: "",
                    name: "",
                    no: "",
                    note: "",
                    pid: "",
                    sort: 0,
                    type: 1,
                    version: "",
                    createTime: "",
                    around: 2
                }
            },
            methods: {
                title: function () {
                    return (this.$data.item.id == null || this.$data.item.id == "") ? '创建部门' : '修改部门';

                }
                , clear: function () {
                    this.$data.item = {
                        id: "",
                        name: "",
                        no: "",
                        note: "",
                        pid: "",
                        sort: 0,
                        type: 1,
                        version: "",
                        createTime: "",
                        around: 2
                    };
                }
                , check: function (e) {
                    if (e.target.checked) { 
                        this.$data.item.around = 1;
                    }
                    else {
                        this.$data.item.around = 2;
                    }
                }
            }
        });
    }


    /* 绑定部门树 */
    function bindOrganizationTree() {

        // clear first
        if (_zTreeObj != null)
            _zTreeObj.destroy();

        $("#tree").empty();

        reqAjaxAsync(SERVICE.TREELIST, "")
            .done(function (res) {
                if (res.code == 1) {

                    if (res.data && res.data.nodes) {
                        let treeNodes = res.data.nodes; // for debug 

                        // bind nodes to tree
                        _zTreeObj = $.fn.zTree.init($("#tree"), _zTreeSetting, treeNodes);

                        // select the first node
                        let nodes = _zTreeObj.getNodes();
                        if (nodes.length > 0) {
                            _zTreeObj.selectNode(nodes[0]);
                        }

                        // expand all
                        _zTreeObj.expandAll(true);
                        $("#openbtn").hide();
                        $("#sqibtn").show();
                    }

                } else {
                    layer.msg(res.msg);
                }
            });
    }


    /* 绑定部门详情表单 */
    function bindDetailsForm(organizationId) {
        var param = {
            id: organizationId
        }
        reqAjaxAsync(SERVICE.GET_DETAILS, JSON.stringify(param))
            .done(function (res) {
                if (res.code == 1) {
                    _currentVm.$data.item = res.data;

                    
                } else {
                    layer.msg(res.msg);
                }
            });
    }






    /************************************** 按钮事件 *************************/
    //折叠展开
    $("#openbtn").click(function () {
        $(this).hide();

        $("#sqibtn").show();

        if (_zTreeObj)
            _zTreeObj.expandAll(true);
    });
    $("#sqibtn").click(function () {
        $("#openbtn").show();
        $(this).hide();
        if (_zTreeObj)
            _zTreeObj.expandAll(false);
    });
    //刷新
    $("#refreshbtn").on("click", function () {
        location.reload();
    });


    //点击添加
    $("#addbtn").click(function () {
        _currentVm.clear();

        let selectNode = getSelectedNode();
        _currentVm.$data.item.pid = selectNode.id;
    });

    //点击删除
    $("#btnDelete").on("click", function () {

        let selectNode = getSelectedNode();

        if (selectNode.children != null && selectNode.children.length > 0) {
            layer.alert("请先删除子节点");
            return false;
        }

        layer.confirm(
            "确认删除?",
            { icon: 3, title: '提示' },
            function (index) {
                let params = {
                    id: selectNode.id
                }

                let res = reqAjax(SERVICE.DELETE_ORG, JSON.stringify(params));
                if (res.code == 1) {
                    bindOrganizationTree();

                    layer.close(index);
                    layer.msg("删除成功");
                } else {
                    layer.msg(res.msg);
                }
            }
        );
    });

    // 点击保存
    $("#btnSave").click(function () {
        let entity = _currentVm.$data.item;
        // if (entity.no == "") {
        //     layer.msg("请输入部门编码");
        //     return false;
        // }

        if (entity.name.length == 0) {
            layer.msg("请输入部门名称");
            return false;
        }

        if (entity.id == "") {
            // new
            let res = reqAjax(SERVICE.ADD_ORG, JSON.stringify(entity));
            if (res.code == 1) {
                layer.msg("创建成功");

                bindOrganizationTree();
                _currentVm.clear();
            }
            else {
                layer.msg(res.msg);
            }
        }
        else {
            // update
            let res = reqAjax(SERVICE.UPDATE_ORG, JSON.stringify(entity));
            if (res.code == 1) {
                layer.msg("修改成功");

                bindOrganizationTree();
                _currentVm.clear();
            }
            else {
                layer.msg(res.msg);
            }
        }

        return false;
    });


    /************************************** ./按钮事件 *************************/




    /************************************** zTree事件 *************************/

    /* 点击树节点 */
    function onNodeClick(event, treeId, treeNode) {

        let selectNode = getSelectedNode();
        var nodes = _zTreeObj.getSelectedNodes();
        if (nodes.length > 0) {
            _zTreeObj.expandNode(nodes[0], !nodes[0].open, false, true)
        };

        bindDetailsForm(selectNode.id);

        // let param = {
        //     id: selectNode.pid
        // }
        // let res = reqAjax(SERVICE.GET_DETAILS, JSON.stringify(param));
        // if (res && res.code == 1) {
        //     $("#lblParentNo").val(res.data.no);
        // }
    }


    /* 树节点拖拽 */
    function onNodeDrop(event, treeId, treeNodes, targetNode, moveType) {
        var id = treeNodes[0].id || "";

        if (targetNode != null) {

            var name = targetNode.name || "";
            var pid = targetNode.id;

            //getDetail(id);
            //dropSave(pid, id);
        } else {
            //dropSave("", id);
        }
    };

    /************************************** ./zTree事件 *************************/



    function getSelectedNode() {
        let node = { id: "", pid: "", name: "", children: [] };

        if (_zTreeObj) {
            var selectNodes = _zTreeObj.getSelectedNodes();
            if (selectNodes != null && selectNodes.length > 0) {
                node = selectNodes[0];
            }
        }

        return node;
    }

    function dropPrev(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode();
        if (pNode && pNode.dropInner === false) {
            return false;
        } else {
            for (var i = 0, l = curDragNodes.length; i < l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }

    function dropInner(treeId, nodes, targetNode) {
        if (targetNode && targetNode.dropInner === false) {
            return false;
        } else {
            for (var i = 0, l = curDragNodes.length; i < l; i++) {
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
            for (var i = 0, l = curDragNodes.length; i < l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                    return false;
                }
            }
        }
        return true;
    }

    //是否对外
    // $(".open").on("click",".checks",function(){
    //     var num = $(this).attr("data-num");
    //     if(num==0){
    //         $(this).parent().addClass("avl");
    //         $(this).attr("data-num",1);
    //     }else{
    //         $(this).parent().removeClass("avl");
    //         $(this).attr("data-num",0);
    //     }
    // });
});
