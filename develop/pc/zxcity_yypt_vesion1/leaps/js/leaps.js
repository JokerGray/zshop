$(function () {
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var page = 1;
        var rows = 10;
        var pid = '';
        var treeObj = {};
        var USER_URL = {
            RESOURCETREE: 'user/leapsLeftTree', //(权限树)
            SINGLERESOURCE: 'user/leapsRightInfo', //(结构详情),
        };
        var layer = layui.layer;
        var table = layui.table;
        var form = layui.form;

        //加载左侧导航树 加载导航树
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
                    simpleData: {// 数据对应的赋值
                        enable: true,
                        idKey: "shareToUserId",
                        pIdKey: "shareUserId",
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

            reqAjaxAsync(USER_URL.RESOURCETREE).done(function (res) {
                //发起请求
                if (res.code == 1) {
                    var treeData = res.data;
                    $.each(treeData, function (i, item) {
                        $(item).attr('name', item.ToOrgName + '(' + item.toLevelName + ')')
                    })
                    treeObj = $.fn.zTree.init($("#tree"), setting, treeData);//设置权限树
                    var nodes = $.fn.zTree.getZTreeObj("tree").getNodes();//获取权限树所有节点
                    getDetails(nodes[0])//获取第一个详情
                } else {
                    layer.msg(res.msg);
                }
            });
        }

        getTree();
        $('#searchBtn').click(function () {
            getNodes()
        })
        //监听键盘事件
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                getNodes()
            }
        });

        //点击事件
        function zTreeOnClick(event, treeId, treeNode) {
            getDetails(treeNode);
        };

        //搜索左侧列表
        function getNodes() {
            var str = $.trim($('#nodeName').val());
            // var node = treeObj.getNodesByFilter(filter, true); // 仅查找一个节点
            var nodes = treeObj.getNodesByParamFuzzy("name", str, null); // 查找节点集合

            if (nodes.length > 0) {
                treeObj.selectNode(nodes[0]);//选中节点
                getDetails(nodes[0])
            } else {
                layer.msg('暂无此商家')
            }
        }
        //获取右侧详情
        function getDetails(treeNode) {
            var ToOrgName = treeNode.ToOrgName;//名称
            var toLevelName = treeNode.toLevelName;//等级
            var indirectCount = 0;//间接数量
            var directCount = 0;//直接数量
            var allShareMoney = 0;//累计回款
            var params = {
                userId: treeNode.shareToUserId
            }
            reqAjaxAsync(USER_URL.SINGLERESOURCE, JSON.stringify(params)).done(function (res) {
                if (res.code === 1) {
                    var datas = res.data;
                    $('#ToOrgName').html(ToOrgName);
                    $('#toLevelName').html(toLevelName);
                    $('#indirectCount').html(datas.indirectCount);
                    $('#directCount').html(datas.directCount);
                    $('#allShareMoney').html(getMoneyFormat(datas.allShareMoney));
                    $('#shareUserSumTaxPrice').html(getMoneyFormat(datas.shareUserSumTaxPrice));
                } else {
                    layer.msg(res.msg);
                }

            })
        }

        //查询某一条
        function getDetail(resourceId) {
            var param = {
                id: resourceId
            };
            reqAjaxAsync(USER_URL.SINGLERESOURCE, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                    var row = res.data;
                    var id = row.id || "";
                    var pid = row.parentid || "";
                    var name = row.name || "";//组织机构名称
                    var level = row.level || "";//级别
                    if (level == 1 || level == 2) {
                        $('#user').show();
                        $('#merchant').hide()
                        $('#addbtn').show();
                        var backUserId = row.backUserId;
                        if (backUserId) {
                            $('#uesrBind').val("");
                            var param = {
                                userId: backUserId
                            }
                            reqAjaxAsync(USER_URL.DETIAL, JSON.stringify(param)).done(function (res) {
                                if (res.code == 1) {
                                    if (res.data != null) {
                                        if (res.data.username) {

                                            var userid = res.data.id;
                                            // console.log(res.data)
                                            var username = res.data.username;
                                            $('#uesrBind').val(username);
                                            $('#uesrBind').attr("userid", userid);
                                        }
                                    }
                                }
                            })
                        }

                    } else if (level == 3) {
                        $('#merchantBind').val("")
                        $('#merchant').show();
                        $('#user').hide();
                        $('#addbtn').hide();
                        var merchantId = row.merchantId;
                        if (merchantId) {
                            var param = {
                                merchantId: merchantId
                            }
                            reqAjaxAsync(USER_URL.INFOBYID, JSON.stringify(param)).done(function (res) {
                                if (res.code == 1) {
                                    if (res.data != null) {
                                        if (res.data.org_name) {
                                            var org_name = res.data.org_name;
                                            var merchant_id = res.data.merchant_id;
                                            $('#merchantBind').val(org_name)
                                            $('#merchantBind').attr("merchantid", merchant_id)
                                        }
                                    }
                                }
                            })
                        }
                    }

                    var parth = row.imagePath || "img/upload.png"//图片地址
                    $("#moduleName").val(name);
                    $('#level').val(level);
                    $("#uploadImgsee").attr('src', parth);
                } else {
                    layer.msg(res.msg);
                }
            });
        };

        //修改方法
        function changeInit() {
            $('#updateSave').show();
            $('#imgonlysee').show();
            $('#img').hide();
            $('#moduleName').attr('readonly', false)
            $('#chose').show();
            $('#chosemer').show();
            $('.savebtn').data("type", "change")
            $('#addbtn').data("isAdd", true);
            $(".savebtn").attr("id", "saveBtn");
            $(".savebtn").attr("lay-filter", "saveBtn");
            form.render();
        }

        $('#chaBtn').click(function () {
            changeInit()
        });


        $('#chose').click(function () {
            var isAdd = $('#addbtn').data("isAdd");
            if (isAdd) {
                var layerMerid = "";
                var trData;
                layer.open({
                    title: ['新增', 'font-size:12px;background-color:rgb(26, 160, 148);color:#fff'],
                    btn: ['确定', '取消'],
                    type: 1,
                    anim: 5,
                    content: $('#agentAdd'),
                    area: ['1200px', '700px'],
                    end: function () {
                        $('#agentAdd').hide();
                        $('#merchantPhoneLayer').val("");
                    },
                    success: function (index, layero) {
                        layerTableInit();
                        layui.table.on('tool(merchantTableLayer)', function (objs) {
                            var tr = objs.tr; //获得当前行 tr 的DOM对象
                            trData = objs.data;
                            if (objs.event === 'changetable') {
                                $(tr).addClass("layui-table-click").siblings().removeClass("layui-table-click");
                                layerMerid = trData.id;
                            }
                        });
                        $("#searchBtn").on('click', function () {
                            layerTableInit();
                        })
                        $("#resetBtn").on('click', function () {
                            $('#userName').val("");
                            $('#phone').val("");
                            layerTableInit();
                        })

                    },
                    yes: function (index, layero) {
                        if (layerMerid == "") {
                            layer.msg("请选择要绑定的用户", {
                                icon: 2,
                                shade: [0.1, '#fff'],
                                offset: '50%',
                                anim: 5
                            });
                            return
                        } else {
                            $('#uesrBind').val(trData.username);
                            $('#uesrBind').attr('userId', layerMerid);
                        }
                        ;
                        layer.close(index)
                    }
                });
            }
        })


        $('#chosemer').click(function () {
            var isAdd = $('#addbtn').data("isAdd");
            console.log(isAdd)
            if (isAdd) {
                var layerMerid = "";
                var trData;
                layer.open({
                    title: ['新增', 'font-size:12px;background-color:rgb(26, 160, 148);color:#fff'],
                    btn: ['确定', '取消'],
                    type: 1,
                    anim: 5,
                    content: $('#agentAdd1'),
                    area: ['1200px', '700px'],
                    end: function () {
                        $('#agentAdd1').hide();
                        $('#merchantPhoneLayer').val("");
                    },
                    success: function (index, layero) {
                        layerTableIniter();
                        layui.table.on('tool(merchantTableLayer1)', function (objs) {
                            var tr = objs.tr; //获得当前行 tr 的DOM对象
                            trData = objs.data;
                            if (objs.event === 'changetabler') {
                                $(tr).addClass("layui-table-click").siblings().removeClass("layui-table-click");
                                layerMerid = trData.merchant_id;
                            }
                        });
                        $("#searchBtn1").on('click', function () {
                            layerTableIniter();
                        })
                        $("#resetBtn1").on('click', function () {
                            $('#merName').val("");
                            layerTableIniter();
                        })

                    },
                    yes: function (index, layero) {
                        if (layerMerid == "") {
                            layer.msg("请选择要绑定的商户", {
                                icon: 2,
                                shade: [0.1, '#fff'],
                                offset: '50%',
                                anim: 5
                            });
                            return
                        } else {
                            $('#merchantBind').val(trData.org_name);
                            $('#merchantBind').attr('merchantId', trData.merchant_id);
                        }
                        ;
                        layer.close(index)
                    }
                });
            }
        })

        uploadOss({
            btn: "uploadImg",
            flag: "img",
            size: "5mb"
        });
        // uploadImgsee
        uploadOss({
            btn: "uploadImgsee",
            flag: "img",
            size: "5mb"
        });
        //点击添加
        $("#addbtn").click(function () {
            //取消只读属性
            $('#uploadImg').attr('src', 'img/upload.png');

            $('#updateSave').show();
            $('#imgonlysee').hide();
            $('#img').show();
            $('#moduleName').attr('readonly', false);
            $('#level').attr('disabled', false);
            $('#uploadImg').attr('disabled', false);

            $('#chose').show();
            $('#empty').show();
            $('#chosemer').show();
            $('#emptyr').show();
            $(".savebtn").attr("id", "saveBtn");
            $(".savebtn").attr("lay-filter", "saveBtn");
            $("#moduleName").val("");
            $('#level').val("");
            $('#uesrBind').val("");
            $('#merchantBind').val("");

            $('#uesrBind').attr("userid", '');
            $('#merchantBind').attr('merchantid', '');

            $('#uploadImg').attr('src', 'img/upload.png');
            var level = $(this).data("level");
            $(this).data("isAdd", true);
            $('#saveBtn').data("type", "add")


            if (level == -1 || level == 0) {
                $("#saveBtn").show();
                $('#user').show();
                $('#merchant').hide();
            } else if (level == 1) {
                $('#user').hide();
                $('#merchant').show();
            }
            $('#level').val(Number(level) + 2).prop('disabled', true)
            form.render();
        });


        //添加保存
        form.on('submit(saveBtn)', function (data) {
            console.log($('.savebtn').data("type"))
            if (data) {
                var type = $('.savebtn').data("type");
                var pid = $(".savebtn").attr("data-id") || "";
                var ppid = $(".savebtn").attr("data-pid") || "";
                var name = $.trim($("#moduleName").val());//名称
                var level = $('#level').val();//级别
                var topId = $('#level').attr('data-id');
                var parentIds = '';
                if (topId && level > 2) {
                    parentIds = ',' + topId + ',' + pid + ',';
                } else if (topId && level <= 2) {
                    parentIds = ',' + topId + ',';
                }

                var parth;
                if (type == 'add') {
                    parth = $('#uploadImg').attr('src');
                } else {
                    parth = $('#uploadImgsee').attr('src');
                }
                var backUserId = $('#uesrBind').attr("userid") || '';
                if (level == 1 || level == 2) {

                    var backUserId = $('#uesrBind').attr("userid");
                    // if(!backUserId){
                    //     layer.msg("请绑定用户")
                    //     return;
                    // }
                    if (type == "add") {

                        var param = {
                            parentIds: parentIds,//parentIds
                            parentId: pid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath: parth,//图片
                            backUserId: backUserId
                        }
                        reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg("新增组织机构成功");

                                getTree();
                                treeObj.expandAll(true);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    } else {

                        var param = {
                            id: pid,
                            parentId: ppid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath: parth,//图片
                            backUserId: backUserId
                        }
                        reqAjaxAsync(USER_URL.CONFIGURE, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg("修改组织机构成功");
                                getTree();
                                treeObj.expandAll(true);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    }
                } else {
                    var merchantId = $('#merchantBind').attr("merchantid");
                    if (!merchantId) {
                        layer.msg("请绑定商户")
                        return;
                    }
                    if (type == "add") {

                        var param = {
                            parentIds: parentIds,
                            parentId: pid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath: parth,//图片
                            merchantId: merchantId
                        }
                        reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg("新增组织机构成功");

                                getTree();
                                treeObj.expandAll(true);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    } else {
                        var param = {
                            id: pid,
                            parentId: ppid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath: parth,//图片
                            merchantId: merchantId
                        }
                        reqAjaxAsync(USER_URL.CONFIGURE, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg("修改组织机构成功");
                                getTree();
                                treeObj.expandAll(true);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    }
                }

            }
            $('.addcontent-table').find('input').val('');
            form.render();
            return false; //阻止页面刷新
        });


        //删除
        $("#deletebtn").on("click", function () {
            var delId = $(this).attr("data-id") || "";
            if (delId == "") {
                layer.alert("请选中左侧节点");
            } else {
                layer.confirm(
                    "确认删除?",
                    {icon: 3, title: '提示'},
                    function (index) {
                        var paramDel = "{'id':'" + delId + "'}";
                        reqAjaxAsync(USER_URL.DELRESOURCE, paramDel).done(function (res) {
                            if (res.code == 1) {
                                // treeDetail();
                                location.reload();
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    })

            }
        });
        //清空用户绑定
        $('#empty').click(function () {
            $('#uesrBind').val("").attr('userid', "")
        })
        $('#emptyr').click(function () {
            $('#merchantBind').val("").attr("merchantid", "")
        })
        //点击顶部标题取消选中树
        $(".trees-box h4").click(function () {
            $("#addbtn").data("level", "-1")
            $(".savebtn").attr("data-id", "");
            $(".savebtn").attr("id", "saveBtn");
            $(".savebtn").attr("lay-filter", "saveBtn");
            $("#deletebtn").attr("data-id", "");
            $(".addcontent-table input").val("");
        });

        //LAYER表格渲染
        function layerTableInit() {
            var _obj = _tableInit('merchantTableLayer', [
                    [{
                        field: 'eq',
                        title: '序号',
                        width: 100
                    }, {
                        field: 'username',
                        title: '昵称',
                        event: 'changetable',
                        width: 200
                    }, {
                        field: 'phone',
                        title: '手机号码',
                        event: 'changetable',
                        width: 200
                    }, {
                        field: 'usercode',
                        title: '登录名',
                        event: 'changetable',
                        width: 400
                    }]
                ],
                pageCallbackLayer, 'layTablePageLayer'
            )
        }

        function layerTableIniter() {
            var _obj = _tableInit('merchantTableLayer1', [
                    [{
                        field: 'eq',
                        title: '序号',
                        width: 300
                    }, {
                        field: 'org_name',
                        title: '商户名',
                        event: 'changetabler',
                        width: 700
                    }]
                ],
                pageCallbackLayerer, 'layTablePageLayer1'
            )
        }


        //pageCallback
        function pageCallbackLayer(index, limit, callback) {
            var phone = $.trim($("#phone").val());
            var username = $.trim($("#userName").val());
            var parms = {
                rows: limit,
                page: index,
                phone: phone,
                username: username
            };
            reqAjaxAsync(USER_URL.TABLELIST, JSON.stringify(parms)).then(function (res) {
                //console.log(res)
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                var data = res.data;
                $.each(data, function (i, item) {
                    $(item).attr('eq', (i + 1));

                });
                return callback(res);
            })
        };

        //pageCallback
        function pageCallbackLayerer(index, limit, callback) {
            var orgName = $.trim($("#merName").val())
            var topId = $('#level').attr('data-id') || '';
            var parms = {
                topId: topId,
                rows: limit,
                page: index,
                orgName: orgName,
            };
            reqAjaxAsync(USER_URL.MERCHANTLIST, JSON.stringify(parms)).then(function (res) {
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                var data = res.data;
                $.each(data, function (i, item) {
                    $(item).attr('eq', (i + 1));

                });
                return callback(res);
            })
        };


        //表格方法
        /* 表格初始化
         * tableId: 表格容器ID
         * cols:table配置
         * pageCallback回调(异步)
         * pageDomName:分页容器ID
         */
        function _tableInit(tableId, cols, pageCallback, pageDomName) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: '300',
                cols: cols,
                page: false,
                even: true,
                limit: 15,
                done: function (res, curr, count) {
                    $('body').on('click', '.layui-table-body table tr', function () {
                        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
                    })
                }
            });

            //2.第一次加载
            pageCallback(1, 15, function (res) {
                tableIns.reload({
                    data: res.data
                })
                //第一页，一页显示15条数据
                layui.use('laypage');
                var page_options = {
                    elem: pageDomName,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                    limits: [15],
                    limit: 15
                }
                page_options.jump = function (obj, first) {
                    tablePage = obj;
                    //首次不执行
                    if (!first) {
                        pageCallback(obj.curr, obj.limit, function (resTwo) {
                            tableIns.reload({
                                data: resTwo.data
                            });
                        });
                    }
                }
                layui.laypage.render(page_options);
                return {
                    tablePage,
                    tableIns
                };
            });
        }

    })
})