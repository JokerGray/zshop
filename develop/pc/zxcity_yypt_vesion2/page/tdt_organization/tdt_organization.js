$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var page = 1;
        var rows = 10;
        var pid = '';
        var USER_URL = {
            RESOURCETREE : 'operations/getAllScMultipleShopConfigureList', //(权限树)
            SINGLERESOURCE : 'operations/getScMultipleShopConfigureInfoByMainId', //(组织结构详情),
            ADDRESOURCE:'operations/addScMultipleShopConfigure',//添加
            DELRESOURCE:'operations/deleteScMultipleShopConfigure',//删除
            TABLELIST:'operations/getUnBindRegionalAgencyBackUserPageList',//绑定用户列表
            MERCHANTLIST : 'operations/getUnBindScMultipleShopMerchantPageList',//绑定商户列表
            DETIAL:'operations/getBindRegionalAgencyBackUserByUserId',//绑定用户详情
            INFOBYID : 'operations/getBindScMultipleShopMerchantInfoById',//绑定商户详情
            CONFIGURE : "operations/updateScMultipleShopConfigure"//修改
        };
        var layer = layui.layer;
        var table = layui.table;
        var form = layui.form;


        $('#saveBtn').hide();
        $('#img').hide();
        $('#chose').hide();
        $('#empty').hide();
        $('#chosemer').hide();
        $('#emptyr').hide();





        //加载左侧导航树 加载导航树
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
                        pIdKey: "parentId",
                        rootPId: null
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


            reqAjaxAsync(USER_URL.RESOURCETREE).done(function(res){
                //发起请求
                if(res.code == 1){
                    var treeData = res.data;
                    console.log(treeData)
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
            console.log(treeNode)

            var level = treeNode.level;
            var imagePath = treeNode.imagePath;
            var backUserId = treeNode.backUserId || '';
            var merchantId = treeNode.merchantId || '';
            $("#addbtn").attr("isAdd",false);
            $('#addbtn').attr("level",level);
            $('#chose').hide();
            $('#empty').hide();
            $('#chosemer').hide();
            $('#emptyr').hide();
            $('#levelBox').show();
            $('#updateSave').hide();
            $('.savebtn').hide();
            $("#tree").find("a").attr("href","javaScript:")
            $('#uesrBind').val("")
            $('#moduleName').attr('readonly',true);

            $('#imgonlysee').show();
            $("#uploadImgsee").attr('src',imagePath).attr('disabled',true);


            $('#img').hide();
            $('#level').val(level+1).attr('disabled',true);
            if(level+1 === 1){
                $('#level').attr('data-id',treeNode.id)
                $('#levelLayer').attr('data-id',treeNode.id);
            }


            $('#uploadImg').attr('disabled',true);

            $('#uesrBind').attr('readonly',true);

            // $('#uesrBind').attr("userid",backUserId);

            $('#merchantBind').attr('merchantid',merchantId);

            $('#merchantBind').attr('readonly',true);
            form.render();
            var name = treeNode.name || "";
            var id = treeNode.id || "";
            var pid = treeNode.pid || "";
            var nodes = treeObj.getSelectedNodes();

            if(nodes.length>0){
                treeObj.expandNode(nodes[0], !nodes[0].open, false, true);
            };
            //
            $(".savebtn").attr("data-id",id);
            $(".savebtn").attr("data-pid",pid);
            $(".savebtn").attr("lay-filter","updateSave");
            $(".savebtn").attr("id","updateSave");
            $("#deletebtn").attr("data-id",id);
            $('#addbtn').attr("data-id",id).attr("data-pid",pid);
            getDetail(id);
        };
        //查询某一条
        function getDetail(resourceId){
            var param = {
                id :resourceId
            };
            reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    var row = res.data;
                    var id = row.id || "";
                    var pid = row.parentid || "";
                    var name = row.name || "";//组织机构名称
                    var level=row.level||"";//级别
                    if(level == 1 || level == 2){
                        $('#user').show();
                        $('#merchant').hide()
                        $('#addbtn').show();
                        var backUserId = row.backUserId;
                        if(backUserId){
                            $('#uesrBind').val("");
                            var param = {
                                userId :backUserId
                            }
                            reqAjaxAsync(USER_URL.DETIAL,JSON.stringify(param)).done(function(res){
                                console.log(res)
                                if(res.code == 1){
                                    if(res.data != null){
                                        if(res.data.username){

                                             var userid = res.data.id;
                                            console.log(res.data)
                                            var username = res.data.username;
                                            $('#uesrBind').val(username);
                                            $('#uesrBind').attr("userid",userid);
                                        }
                                    }
                                }
                            })
                        }

                    }else if(level == 3){
                        $('#merchantBind').val("")
                        $('#merchant').show();
                        $('#user').hide();
                        $('#addbtn').hide();
                        var merchantId = row.merchantId;
                        if(merchantId){
                            var param = {
                                merchantId :merchantId
                            }
                            reqAjaxAsync(USER_URL.INFOBYID,JSON.stringify(param)).done(function(res){
                                if(res.code == 1){
                                    if(res.data != null){
                                        if(res.data.org_name){
                                            var org_name = res.data.org_name;
                                            var merchant_id = res.data.merchant_id;
                                            $('#merchantBind').val(org_name)
                                            $('#merchantBind').attr("merchantid",merchant_id)
                                        }
                                    }
                                }
                            })
                        }
                    }

                    var parth=row.imagePath||"img/upload.png"//图片地址
                    $("#moduleName").val(name);
                    $('#level').val(level);
                    $("#uploadImgsee").attr('src',parth);
                }else{
                    layer.msg(res.msg);
                }
            });
        };

        //修改方法
        function changeInit(){
            $('#updateSave').show();
            $('#imgonlysee').show();
            $('#img').hide();
            $('#moduleName').attr('readonly',false)
            $('#chose').show();
            $('#chosemer').show();
            $('.savebtn').data("type","change")
            $('#addbtn').data("isAdd",true);
            $(".savebtn").attr("id","saveBtn");
            $(".savebtn").attr("lay-filter","saveBtn");
            form.render();
        }

        $('#chaBtn').click(function(){
            changeInit()
        });


        $('#chose,#choseLayer').click(function(){
            var isAdd = $('#addbtn').attr("isAdd");
            var ids = $(this)[0].id;
            if(isAdd){
                var layerMerid = "";
                var trData;
                layer.open({
                    title: ['新增', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    btn: ['确定', '取消'],
                    type: 1,
                    anim: 5,
                    content: $('#agentAdd'),
                    area: ['90%','90%'],
                    end: function() {
                        $('#agentAdd').hide();
                        $('#merchantPhoneLayer').val("");
                    },
                    success: function(index, layero) {
                        layerTableInit();
                        layui.table.on('tool(merchantTableLayer)', function(objs) {
                            var tr = objs.tr; //获得当前行 tr 的DOM对象
                            trData=objs.data;
                            if(objs.event === 'changetable'){
                                $(tr).addClass("layui-table-click").siblings().removeClass("layui-table-click");
                                layerMerid  = trData.id;
                            }
                        });
                        $("#searchBtn").on('click',function(){
                            layerTableInit();
                        })
                        $("#resetBtn").on('click',function(){
                            $('#userName').val("");
                            $('#phone').val("");
                            layerMerid = '';
                            layerTableInit();
                        })

                    },
                    yes: function(index, layero) {
                        if(layerMerid == ""){
                            layer.msg("请选择要绑定的用户", {
                                icon: 2,
                                shade: [0.1, '#fff'],
                                offset: '50%',
                                anim: 5
                            });
                            return
                        }else{
                            if(ids == 'choseLayer'){
                                $('#uesrBindLayer').val(trData.username).attr('userId',layerMerid);
                            }else{
                                $('#uesrBind').val(trData.username).attr('userId',layerMerid);;
                            }

                        };
                        layer.close(index)
                    }
                });
            }
        })


        $('#chosemer,#chosemerLayer').click(function(){
            var isAdd = $('#addbtn').attr("isAdd");
            var ids = $(this)[0].id;
            console.log(isAdd)
            if(isAdd){
                var layerMerid = "";
                var trData;
                layer.open({
                    title: ['新增', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    btn: ['确定', '取消'],
                    type: 1,
                    anim: 5,
                    content: $('#agentAdd1'),
                    area:['90%','90%'],
                    end: function() {
                        $('#agentAdd1').hide();
                        $('#merchantPhoneLayer').val("");
                    },
                    success: function(index, layero) {
                        layerTableIniter();
                        layui.table.on('tool(merchantTableLayer1)', function(objs) {
                            var tr = objs.tr; //获得当前行 tr 的DOM对象
                            trData=objs.data;
                            if(objs.event === 'changetabler'){
                                $(tr).addClass("layui-table-click").siblings().removeClass("layui-table-click");
                                layerMerid  = trData.merchant_id;
                            }
                        });
                        $("#searchBtn1").on('click',function(){
                            layerTableIniter();
                        })
                        $("#resetBtn1").on('click',function(){
                            $('#merName').val("");
                            layerMerid = '';
                            layerTableIniter();
                        })

                    },
                    yes: function(index, layero) {
                        if(layerMerid == ""){
                            layer.msg("请选择要绑定的商户", {
                                icon: 2,
                                shade: [0.1, '#fff'],
                                offset: '50%',
                                anim: 5
                            });
                            return
                        }else{
                            if(ids == 'chosemerLayer'){
                                $('#merchantBindLayer').val(trData.org_name).attr('userId',trData.merchant_id);
                            }else{
                                $('#merchantBind').val(trData.org_name).attr('merchantId',trData.merchant_id);;
                            }

                        };
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
        uploadOss({
            btn: "uploadImg1",
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

        //layer展开
        $('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
            if($(this).children('i.description').html() == '展开') {
                $(this).children('i.description').html('收起')
                $(this).children('i.icon').addClass('deg');
                $(this).parent().siblings('.app-layer-content').children('ul').hide();
                $(this).parent().siblings('.app-layer-content').children('.layer-place').show();
            } else {
                $(this).children('i.description').html('展开')
                $(this).children('i.icon').removeClass('deg');
                $(this).parent().siblings('.app-layer-content').children('ul').show();
                $(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
            }
        })
        $('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
            $(this).hide();
            $(this).siblings('ul').show();
            $(this).parent().siblings().children('.package-some').children('.description').html('展开');
            $(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
        })
        $("#addbtn").click(function(){

            let self = $(this);
            let box = $('#agentAdd3');
            let imgPath = 'img/upload.png';
            let moduleName = '';
            let userName = '';
            let merchantName = '';
            let userid = $('#uesrBindLayer').val() || "";

            let params = {};
            var pid = self.attr("data-id") || "";
            var ppid = self.attr("data-pid") || "";
            var w = window.parent;
            let level = self.attr('level');
            $('#levelLayer').val(Number(level)+2).prop('disabled',true)
            let levels = $('#levelLayer').val();
            var topId=$('#levelLayer').attr('data-id');
            var parentIds = '';
            if(topId && levels>2){
                parentIds =  ','+topId+','+pid+',';
            }else if(topId && levels<=2){
                parentIds = ','+topId+',';
            }

            self.attr('isAdd','add')
            layer.open({
                title:['添加组织结构','font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                type:1,
                content:box,
                area:['90%','90%'],
                btn:['确定','取消'],
                end:function(){
                    $(this).hide();
                    box.find('input').val('');
                    box.find('img').attr('src',imgPath);
                },
                success:function(Layero,index){

                    box.find('input[name=userName]').attr('readonly',true);
                    box.find('input[name=merchantName]').attr('readonly',true);

                    if(level == -1 || level == 0){
                        $('#merchatBox').hide();
                        $('#userBox').show();

                    }else if(level == 1){
                        $('#merchatBox').show();
                        $('#userBox').hide();
                    }


                    $('#uploadImg1').attr('src','img/upload.png');
                    form.render();
                },
                yes:function(index,Layero){
                    moduleName=box.find('input[name=moduleName]').val();
                    imgPath = $('#uploadImg1').attr('src') || '';
                    let msg = '';
                    if(level<1){
                        userName = box.find('input[name=userName]').val();
                        userid = box.find('input[name=userName]').attr('userid')
                    }else if(level == 1){
                        merchantName = box.find('input[name=merchantName]').val();
                        userid = box.find('input[name=merchantName]').attr('userid')
                    }
                    if(moduleName == ''){
                        msg = '请填写组织机构名称'
                    }else{
                        if(userName == '' && merchantName == ''){
                            if(level == 1){
                                msg = '请选择要绑定的商户'
                            }
                        }
                    }
                    if(msg){
                        layer.msg(msg, {
                            icon: 2,
                            shade: [0.1, '#fff'],
                            offset: '50%',
                            anim: 5
                        });
                        return
                    }
                    if(level<1){
                        params={
                            parentIds:parentIds,
                            parentId: pid,//pid
                            name: moduleName, //名称
                            level: $('#levelLayer').val(), //级别
                            imagePath:imgPath,//图片
                            backUserId:userid
                        }

                    }else if(level ==1){
                        params={
                            parentIds:parentIds,
                            parentId: pid,//pid
                            name: moduleName, //名称
                            level: $('#levelLayer').val(), //级别
                            imagePath:imgPath,//图片
                            merchantId:userid
                        }
                    }
                    reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(params)).done(function(res){
                        if(res.code == 1){
                            layer.msg("新增组织机构成功");

                            getTree();
                            treeObj.expandAll(true);
                            $('#addbtn').attr("data-id",'').attr("data-pid",'');
                            layer.close(index)
                        }else{
                            layer.msg(res.msg);
                        }
                    });

                }
            })
        });



        //添加保存
        form.on('submit(saveBtn)',function(data){
            console.log($('.savebtn').data("type"))
            if(data){
                var type = $('.savebtn').data("type");
                var pid = $(".savebtn").attr("data-id") || "";
                var ppid = $(".savebtn").attr("data-pid") || "";
                var name = $.trim($("#moduleName").val());//名称
                var level=$('#level').val();//级别
                var parth;
                if(type == 'add'){
                    parth = $('#uploadImg').attr('src');
                }else{
                    parth = $('#uploadImgsee').attr('src');
                }

                var backUserId = $('#uesrBind').attr("userid") || '';
                if(level == 1 || level == 2){
                    var backUserId = $('#uesrBind').attr("userid");
                    if(!backUserId){
                        layer.msg("请绑定用户")
                        return;
                    }
                    if(type == "add"){

                        var param = {

                            parentId: pid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath:parth,//图片
                            backUserId:backUserId
                        }
                        reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                            if(res.code == 1){
                                layer.msg("新增组织机构成功");

                                getTree();
                                treeObj.expandAll(true);
                            }else{
                                layer.msg(res.msg);
                            }
                        });
                    }else{

                        var param = {
                            id:pid,
                            parentId: ppid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath:parth,//图片
                            backUserId:backUserId
                        }
                        reqAjaxAsync(USER_URL.CONFIGURE,JSON.stringify(param)).done(function(res){
                            if(res.code == 1){
                                layer.msg("修改组织机构成功");
                                getTree();
                                treeObj.expandAll(true);
                            }else{
                                layer.msg(res.msg);
                            }
                        });
                    }
                }else{
                    var merchantId = $('#merchantBind').attr("merchantid");
                    if(!merchantId){
                        layer.msg("请绑定商户")
                        return;
                    }
                    if(type == "add"){
                        var param = {

                            parentId: pid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath:parth,//图片
                            merchantId:merchantId
                        }
                        reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                            if(res.code == 1){
                                layer.msg("新增组织机构成功");

                                getTree();
                                treeObj.expandAll(true);
                            }else{
                                layer.msg(res.msg);
                            }
                        });
                    }else{
                        var param = {
                            id:pid,
                            parentId: ppid,//pid
                            name: name, //名称
                            level: level, //级别
                            imagePath:parth,//图片
                            merchantId:merchantId
                        }
                        reqAjaxAsync(USER_URL.CONFIGURE,JSON.stringify(param)).done(function(res){
                            if(res.code == 1){
                                layer.msg("修改组织机构成功");
                                getTree();
                                treeObj.expandAll(true);
                            }else{
                                layer.msg(res.msg);
                            }
                        });
                    }
                }
            }
            form.render();
            return false; //阻止页面刷新
        });


        //删除
        $("#deletebtn").on("click", function () {
            var delId = $(this).attr("data-id") || "";
            if(delId == ""){
                layer.alert("请选中左侧节点");
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
        });
        //清空用户绑定
        $('.empty').click(function () {
            $(this).siblings('input').val("").attr('userid',"").attr("merchantid","")
        })
        $('#empty').click(function(){
            $('#uesrBind').val("").attr('userid',"")
        })
        $('#emptyr').click(function(){
            $('#merchantBind').val("").attr("merchantid","")
        })
        //点击顶部标题取消选中树
        $(".trees-box h4").click(function(){
            $("#addbtn").data("level","-1")
            $(".savebtn").attr("data-id","");
            $(".savebtn").attr("id","saveBtn");
            $(".savebtn").attr("lay-filter","saveBtn");
            $("#deletebtn").attr("data-id","");
            $(".addcontent-table input").val("");
        });

        //LAYER表格渲染
        function layerTableInit() {
            var _obj = _tableInit('merchantTableLayer', [
                    [{
                        field: 'eq',
                        title: '序号',
                        width:'10%'
                    }, {
                        field: 'username',
                        title: '昵称',
                        event:'changetable',
                        width:'20%'
                    }, {
                        field: 'phone',
                        title: '手机号码',
                        event:'changetable',
                        width:'20%'
                    }, {
                        field: 'usercode',
                        title: '登录名',
                        event:'changetable',
                        width:'50%'
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
                        width:'30%'
                    }, {
                        field: 'org_name',
                        title: '商户名',
                        event:'changetabler',
                        width:'70%'
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
            reqAjaxAsync(USER_URL.TABLELIST, JSON.stringify(parms)).then(function(res) {
                //console.log(res)
                if(res.code != 1) {
                    return layer.msg(res.msg);
                }
                var data = res.data;
                $.each(data, function(i, item) {
                    $(item).attr('eq', (i + 1));

                });
                return callback(res);
            })
        };

        //pageCallback
        function pageCallbackLayerer(index, limit, callback) {
            var orgName = $.trim($("#merName").val())
            var topId = $('#levelLayer').attr('data-id') || '';
            var parms = {
                topId:topId,
                rows: limit,
                page: index,
                orgName: orgName,
            };
            reqAjaxAsync(USER_URL.MERCHANTLIST, JSON.stringify(parms)).then(function(res) {
                if(res.code != 1) {
                    return layer.msg(res.msg);
                }
                var data = res.data;
                $.each(data, function(i, item) {
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
                height: '540',
                cols: cols,
                page: false,
                even: true,
                limit: 15,
                done: function(res, curr, count) {
                    $('body').on('click', '.layui-table-body table tr', function() {
                        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
                    })
                }
            });

            //2.第一次加载
            pageCallback(1, 15, function(res) {
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
                page_options.jump = function(obj, first) {
                    tablePage = obj;
                    //首次不执行
                    if(!first) {
                        pageCallback(obj.curr, obj.limit, function(resTwo) {
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