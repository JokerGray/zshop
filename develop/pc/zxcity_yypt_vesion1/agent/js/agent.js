
    var SERVICE = {
        AGENT_LIST: "operations/queryAppUserRecommendRelationPage",
        UNBIND_USER_LIST: "operations/queryAppUserUnboundedRecommendPage",
        AGENT_REMOVE: "operations/delAppUserRecommendRelation",
        AGENT_ADD: "operations/addAppUserRecommendRelation"
    }
    
    var _defPageIndex = 1;
    var _defPageSize = 15;
    var _tables = {};
    var _tableHeight = 0;
    var _defColumns = [[
                    //{ checkbox: true, LAY_CHECKED: false },
                     { field: 'eq', title: '序号', width: 60 }
                    , { field: 'username', title: '用户账号', width: 200 }
                    , { field: 'phone', title: '手机号码', width: 200 }
                    , { field: 'addUserName', title: '操作人', width: 150 }
                    , { field: 'addTime', title: '操作时间', width: 200 }
                    , {
                        field: '', title: '操作', width: 250, fixed: 'right',
                        templet: '#tpl_row_buttons'
                    }]];
    var _currentTabIndex = 0;

    /* 初始化表格及分页 */
    function _initialTable(tableId, tablePageId, bindAction) {
        var tableObject = null;

        if (_tables[tableId] != undefined && _tables[tableId] != null) {
            // 查找layui表格对象
            tableObject = _tables[tableId];

            // 清空checkbox

        }
        else {
            // 创建layui表格对象
            tableObject = layui.table.render({
                height:'full-340',
                id: tableId,
                elem: "#" + tableId,
                cols: _defColumns
                , page: false
                , even: true
                , skin: 'row'
            });

            // 缓存layui表格对象
            _tables[tableId] = tableObject;

            // 设置点击checkbox事件
            
            // layui.table.on('checkbox(agent-list)', function(obj){
            //     console.log(obj.checked); //当前是否选中状态
            //     console.log(obj.data); //选中行的相关数据
            //     console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one

            //     console.log(obj);
                
            //     // console.log(tableId);
            //     // var checkStatus = layui.table.checkStatus(tableId);
            //     // console.log(checkStatus)
            //     if (obj.checked) {

            //         // 
            //     }
            //     var checked = $("div[lay-filter='LAY-table-1'] td .layui-form-checked");
            //     console.log(checked.length)
            //   });
        }

        // 调用bindAction
        let resp = bindAction(tableObject, _defPageIndex, _defPageSize);
        let count = (resp && resp.total) ? resp.total : 0;

        // 创建laypage分页
        layui.laypage.render({
            elem: tablePageId,
            count: count,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15,
            jump: function (obj, first) {
                tableObject.pagerObject = obj;

                //首次不执行
                if (!first) {
                    bindAction(tableObject, obj.curr, obj.limit);
                }
            }
        });


        return tableObject;
    }



    /* 绑定数据到表格 */
    function _setTableData(tableObject, resp) {

        if (resp) {
            if (resp.code == 1) {
                tableObject.reload({
                    data: resp.data
                });
            }
            else if (resp.code == 9) {
                layer.msg(resp.msg);
            }
            else {
                layer.msg("服务访问失败");
            }
        }
    }


    /* 加载代理人表格 */
    function bindAgentTable(tableObject, pageIndex, pageSize) {
        // 1.当前标签索引
        var tabIndex = getCurrentTabIndex();

        // 2.组织参数
        var params = {
            page: pageIndex,
            rows: pageSize,
            code: "T" + (tabIndex + 4),
            phone: $.trim($("#txtQueryString").val())||'',
        };

        // if(!(/^1[3|5][0-9]\d{4,8}$/.test(params.phone))){
        //     layer.alert("手机号码格式有误");
        //     return false;
        // }
        // 3.调用接口
        var resp = reqAjax(SERVICE.AGENT_LIST, JSON.stringify(params));
        if (resp && resp.data) {
            $.each(resp.data, function(i, item) {
                $(item).attr('eq', (i + 1));
                $(item).attr('code', params.code);
            });
        }
        

        // 4.绑定数据到表格
        _setTableData(tableObject, resp);


        return resp;
    }


    /* 加载未绑定用户表格 */
    function bindUnbindAppUserTable(tableObject, pageIndex, pageSize) {
        var params = {
            page: pageIndex,
            rows: pageSize,
            phone: $("#txtAppUserPhone").val(),
            username: ''
        };

        var resp = reqAjax(SERVICE.UNBIND_USER_LIST, JSON.stringify(params));
        $.each(resp.data, function(i, item) {
                $(item).attr('eq', (i + 1));
                
                if (item.isrealname == -1){
                    item.isrealname = '审核不通过';
                }
                else if (item.isrealname == 0){
                    item.isrealname = '未认证';
                }else  if (item.isrealname == 1){
                    item.isrealname = '待审核';
                }else if (item.isrealname == 2){
                    item.isrealname = '已认证';
                }
                
            });
        _setTableData(tableObject, resp);

        return resp;
    }


    function getCurrentTabIndex() {
        var tabIndex = $("ul#tabs li.active").index();
        if (tabIndex < 0)
            tabIndex = 0;

        return tabIndex;
    }

    function reloadAgentTable() {
        var tabIndex = getCurrentTabIndex()+4;
        var tableId = "table-" + (tabIndex);
        var pagerId = "footpager" + (tabIndex);

        _initialTable(tableId, pagerId, bindAgentTable);
    }


    // 选中的id
    _dialog_click_id = "";

    function reloadUnbindAppUserTable() {
        var appUserTable = layui.table.render({
            height: 420,
            id: "tblAppUser",
            elem: "#tblAppUser",
            cols: [[
                { field: 'eq', title: '序号', width: 60 }
                , { field: 'username', title: '名称', width: 150, event: 'changetable' }
                , { field: 'phone', title: '手机号码', width: 150, event: 'changetable' }
                , { field: 'usersex', title: '性别', width: 60, event: 'changetable' }
                , { field: 'createtime', title: '注册时间', width: 120, event: 'changetable' }
                , { field: 'isrealname', title: '是否实名', width: 100, event: 'changetable'}
            ]]
            , page: false
            , even: true
            , skin: 'row'
        });

        layui.table.on('tool(unbindappusers)', function(objs) {
            var tr = objs.tr; //获得当前行 tr 的DOM对象
            
            if(objs.event === 'changetable'){

                $(tr).addClass("layui-table-click").siblings().removeClass("layui-table-click");
                _dialog_click_id = objs.data.id;
                
            }
        });

        let resp = bindUnbindAppUserTable(appUserTable, 1, 10);
        let count = (resp && resp.total) ? resp.total : 0;
        console.log(count);
        layui.laypage.render({
            elem: "pgrAppUser",
            count: count,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            //limits: [10, 20],
            limit: 10,
            jump: function (obj, first) {
                if (!first) {
                    bindUnbindAppUserTable(appUserTable, obj.curr, obj.limit);
                }
            }
        });

    }

    
    $(function () {

        layui.use('laypage');

        var toolbarHeight = $('#toolbar').outerHeight();
        var pagerHeight = $(".footpager").outerHeight();
        var tabHeight = $("#tabs").outerHeight() + 20;
        var top = $("#head", window.parent.document).outerHeight();
        // console.log($(this).height());
        // console.log(toolbarHeight);//23
        // console.log(pagerHeight);//40
        // console.log(tabHeight);//61
        _tableHeight = $(this).outerHeight() - top - tabHeight - pagerHeight - toolbarHeight;

        console.log(_tableHeight);//717
        // console.log(); //888

        //$(this).height(888);
        console.log($(this).height());

        //document.body.style.height = ($(this).height() - top - 10) + "px";



        _initialTable('table-4', 'footpager4', bindAgentTable);


        // 初始化Tabs事件
        $('.nav-tabs a:first').tab('show');
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target == e.relatedTarget)
                return;
            
            reloadAgentTable();

            _currentTabIndex = getCurrentTabIndex();
            
            if (_currentTabIndex == 3 || _currentTabIndex == 1) {
                $("#btnAdd").hide();
                //$("#btnDelete").hide();
            }
            else {
                $("#btnAdd").show();
                //$("#btnDelete").show();
            }
        });




        // 初始化工具按钮 
        $("#btnSearch").click(function () {
            reloadAgentTable();
            return false;
        });

        // 添加重置按钮事件
        $("#btnRestSearch").click(function () {
            $("#txtQueryString").val("");
            reloadAgentTable();
            return false;
        });

        // 添加刷新按钮事件
        $("#btnRefresh").click(function () {
            reloadAgentTable();
            return false;
        });


        // 添加显示搜索按钮事件
        $('#btnShowSearch').on('click', function () {
            $('.search-box').slideToggle();
            $("#txtQueryString").val("");
        });

        // 弹出框: 添加搜索按钮事件
        $("#btnAppUserSearch").click(function () {
            reloadUnbindAppUserTable();
            return false;
        });

        // 弹出框: 添加重置按钮事件
        $("#btnAppUserRestSearch").click(function () {
            $("#txtAppUserPhone").val("");
            return false;
        });

        $("#btnDelete").on("click", function() { 

  
            // var child = $("input[type='checkbox']");
            // child.each(function(index, item){  
            //     item.checked = data.elem.checked;  
            //   });  

              
            // var t2 =  layui.table.checkStatus('table-3');

            // console.log(t2.data);


            var t = _tables["table-1"];

            tableObject.syncCheckAll();


        });

        // 添加弹出框事件
        $('#btnAdd').on('click', function () {
            layer.open({
                title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
                btn: ['添加', '取消'],
                type: 1,
                content: $('#pnlbind'), 
                area: ['850px', '650px'],
                end: function () {
                    $('#pnlbind').hide();
                    $("#txtAppUserPhone").val("");
                },
                success: function (layero, index) {

                    $("#pnlbind").show();
                    reloadUnbindAppUserTable();
                    _dialog_click_id = "";
                },
                yes: function (index, layero) {
                    let operatorId = yyCache.get("userId");
                    let operatorName = yyCache.get("username");
                    let code = "T" + (getCurrentTabIndex() + 1);
                    let appUserIds = "";



                    // 获取勾选的用户id
                    /*
                    let checkStatus = layui.table.checkStatus('tblAppUser');
                    if (!(checkStatus.data && checkStatus.data.length > 0)) {
                        layer.msg("请勾选要关联的用户");
                        return false;
                    }


                    console.log(checkStatus);
                    
                    let arrayOfId = [];
                    $.each(checkStatus.data, function (i, item) {
                        arrayOfId.push(item.id);
                    });

                    if (arrayOfId.length > 1)
                    {
                        layer.msg("只能单选.")
                        return false;
                    }

                    appUserIds = arrayOfId.join(",")
                    console.log(appUserIds);
                    */

                    // 新的
                    if (_dialog_click_id == "") {
                        layer.msg("请选择一项数据.")
                        return false;
                    }
                    appUserIds = _dialog_click_id;
                    _dialog_click_id = ""; // clear

                    let params = {
                        code: code,
                        userId: appUserIds,
                        addUserId: operatorId,
                        addUserName: operatorName
                    };

                    let resp = reqAjax(SERVICE.AGENT_ADD, JSON.stringify(params));
                    if (resp) {
                        if (resp.code == 1) {
                            layer.closeAll();
                            layer.msg(resp.msg);
                            reloadAgentTable();
                        }
                        else if (resp.code == 9) {
                            layer.msg(resp.msg);
                        }
                        else {
                            layer.msg("服务访问失败.");
                        }
                    }
                }
            });



        });

        // 监听工具条
        layui.table.on('tool(agent-list)', function(obj){
            var data = obj.data;
            if(obj.event === 'unbind'){
                layer.confirm('确定要删除吗?', function(index){
                    
                    let params = {
                        id : data.id
                    };
                    let resp = reqAjax(SERVICE.AGENT_REMOVE, JSON.stringify(params)); 
                    if (resp) {
                        if (resp.code == 1) {
                            obj.del();
                            reloadAgentTable();
                        }
                        else if (resp.code == 9) {
                            layer.msg(resp.msg);
                        }
                        else {
                            layer.msg("服务访问失败.");
                        }
                    }
                    layer.close(index);
                });
                
            } else if(obj.event === 'del'){
                
            } else if(obj.event === 'edit'){
                //layer.alert('编辑行：<br>'+ JSON.stringify(data))
            }
        });
    });
