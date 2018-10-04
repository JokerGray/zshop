(function($) {
    var page = 1;
    var rows = 10;
    var userno = yyCache.get("userno") || "";
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/queryOperationTrategyPage', //(查询状态)
        ADDRESOURCE : 'operations/addOperationTrategy',//(新增)
        UPDATERESOURCE :' operations/modifyOperationTrategy',//(修改)
        DELUSER : 'operations/deleteOperationTrategy', //(删除)
        CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
    };


    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    // // CHARGELEVE 加载商户等级
    // reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
    //     console.log(res);
    //     if(res.code ==1){
    //         var bHtml = "<option value=''>--请选择--</option>";
    //         var datas = res.data;
    //         $.map(datas, function(n, index) {
    //             bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
    //         })
    //         $("#merchantLeve").html(bHtml);
    //     }else{
    //         layer.msg('加载计费类型失败')
    //     }
    //
    //     // form.render();
    // });
//渲染表单
    var obj = tableInit('table', [
            [{
                title: '序号',
                /*sort: true,*/
                align: 'left',
                field: 'eq',
                width: 80
            }, {
                title: '策略名称',
                /*sort: true,*/
                align: 'left',
                field: 'strategyName',
                width: 300
            }, {
                title: '用户类型',
                /*sort: true,*/
                align: 'left',
                field: 'userTypename',
                width: 100
            }, {
                title: '用户等级',
                /*sort: true,*/
                align: 'left',
                field: 'userLevelname',
                width: 100
            }, {
                title: '功能编码',
                /*sort: true,*/
                align: 'left',
                field: 'funcCode',
                width: 200
            }, {
                title: '取值类型',
                /*sort: true,*/
                align: 'left',
                field: 'valueType',
                width: 100
            }, {
                title: '取值',
                /*sort: true,*/
                align: 'left',
                field: 'text',
                width: 100
            }, {
                title: '业务说明',
                /*sort: true,*/
                align: 'left',
                field: 'businessDescription',
                width: 370
            }, {
                title: '操作',
                fixed: 'right',
                align:'left',
                toolbar: '#barDemor',
                width: 280
            }]
        ],
        pageCallback
    );

    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback, test) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-248',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(1, 15);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data
                })
            } else {
                layer.msg(res.msg)
            }
        }

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit);
                if(resTwo && resTwo.code == 1)
                    tableIns.reload({
                        data: resTwo.data
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    }

    //序号遍历用户类型和用户等级重新编译
    function getData(url,parms){
        var res =reqAjax(url,parms);
        var data = res.data;
        $.each(data,function(i,item){
            $(item).attr('eq',(i+1));
            if(item.userType == 0){
                $(item).attr('userTypename','个人用户');
            }else if(item.userType == 1){
                $(item).attr('userTypename','商户');
            };
            if(item.userLevel == 0){
                $(item).attr('userLevelname','普通用户');
            }else if(item.userLevel == 1){
                $(item).attr('userLevelname','普通商户');
            }else if(item.userLevel == 2){
                $(item).attr('userLevelname','合作商户');
            }else if(item.userLevel == 3){
                $(item).attr('userLevelname','代理商户');
            }
        })
        return res;
    }

    //pageCallback回调

    function pageCallback(index, limit , userType,userLevel,strategyName) {
        if(userType == undefined){userType = ''}
        if(userLevel == undefined){userLevel = ''}
        if(strategyName == undefined){strategyName = ''}
        var param = {
            page:index,
            rows:limit,
            userType:userType, //用户类型
            userLevel:userLevel, //用户等级
            strategyName:strategyName //策略名称
        }
        return getData(USER_URL.RESOURLIST,JSON.stringify(param));
    }


    //加了入参的公用方法
    function getTable(userType,userLevel,strategyName){
        var initPage = obj.tablePage;
        var initTable = obj.tableIns;
        var res = pageCallback(1, 15,userType,userLevel,strategyName);
        initTable.reload({ data : res.data });
        layui.use('laypage');
        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit,userType,userLevel,strategyName);
                if(resTwo && resTwo.code == 1)
                    initTable.reload({
                        data: resTwo.data
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }
        layui.laypage.render(page_options);
    }

    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var userType = $("#merchantType").find("option:selected").val(); //用户类型
        var userLevel = $("#merchantLeve").find("option:selected").val(); //用户等级
        var strategyName = $("#merchantName").val(); //策略名称
        //删除
        if(obj.event === 'del'){
            var id = data.id;
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示'},
                function(index){
                    var paramDel = {
                        id : id
                    };
                    reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg("删除成功");
                            getTable(userType,userLevel,strategyName);
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }else if(obj.event === 'change'){
            var id = data.id;
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content:$('#addDetail'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['800px', '560px'],
                resize:false,
                btn: ['保存','取消'],
                shade: [0.1, '#fff'],
                end:function(){
                    $('#addDetail').hide();
                    $('#addName').val('');
                    $('#addCode').val('');
                    $('#addValue').val('');
                    $('#addDescription').val('');
                },
                success: function(layero, index){
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $(layero).find(".layui-layer-btn .layui-layer-btn0").attr("lay-submit","");
                    $(layero).find(".layui-layer-btn .layui-layer-btn0").attr("lay-filter","updatebtn");
                    //当等级为普通用户时只能选择普通用户的等级
                    if(data.userLevel== 0){
                        $(layero).find(".levelusual").hide();
                        $(layero).find(".levelnormal").show();
                    }else{
                        $(layero).find(".levelusual").show();
                        $(layero).find(".levelusual dl").find("dd").eq(0).hide();
                        $(layero).find(".levelnormal").hide();
                    }
                    //判断商户类型
                    $("#addType").find(".layui-anim-upbit dd").removeClass("layui-this");
                    var typeList = $("#addType").find(".layui-anim-upbit dd");
                    var userTypes = data.userTypename;
                    for(var i in typeList){
                        var bal = typeList.eq(i).text();
                        if(bal == userTypes){
                            typeList.eq(i).addClass('layui-this');
                            $("#addType").find(".layui-unselect").val(typeList.eq(i).text());
                        }
                    }
                    //判断用户等级
                    $("#addLevel").find(".layui-anim-upbit dd").removeClass("layui-this");
                    var typeLists = $("#addLevel").find(".layui-anim-upbit dd");
                    var userLevels = data.userLevelname;
                    for(var a in typeLists){
                        var bals = typeLists.eq(a).text();
                        if(bals == userLevels){
                            typeLists.eq(a).addClass('layui-this');
                            $("#addLevel").find(".layui-unselect").val(typeLists.eq(a).text());
                        }
                    }

                    //判断应用范围
                    $("#addGround").find(".layui-anim-upbit dd").removeClass("layui-this");
                    var applicableToList = $("#addGround").find(".layui-anim-upbit dd");
                    var applicable = data.applicableTo || "";
                    for(var b in applicableToList){
                        var cableTo = applicableToList.eq(b).attr("lay-value");
                        if(cableTo == applicable){
                            applicableToList.eq(b).addClass('layui-this');
                            $("#addGround").find(".layui-unselect").val(applicableToList.eq(b).text());
                        }
                    }

                    //判断取值范围
                    $("#addValueType").find(".layui-anim-upbit dd").removeClass("layui-this");
                    var addValueTypeList = $("#addValueType").find(".layui-anim-upbit dd");
                    var addValueType = data.valueType || "";
                    for(var c in addValueTypeList){
                        var cableTos = addValueTypeList.eq(c).attr("lay-value");
                        if(cableTos == addValueType){
                            addValueTypeList.eq(c).addClass('layui-this');
                            $("#addValueType").find(".layui-unselect").val(addValueTypeList.eq(c).text());
                        }
                    }

                    $('#addName').val(data.strategyName);//策略名称
                    $('#addCode').val(data.funcCode);//功能编码
                    $('#addValue').val(data.text);//取值
                    $('#detailsApplicableTo').val(data.applicableTo);
                    $('#addDescription').val(data.businessDescription);//业务描述

                },
                yes:function(index, layero){
                    form.on('submit(updatebtn)',function(data){
                        var strategyName = $.trim($("#addName").val());//策略名称
                        var userType = $("#addType").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//用户类型(0-个人用户,1-商户)
                        var userLevel = $("#addLevel").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//用户等级(0-普通用户,1-普通商户,2-合作商户,3-代理商户)
                        var funcCode = $.trim($("#addCode").val());//功能code
                        var valueType = $("#addValueType").find(".layui-anim-upbit dd.layui-this").text();//取值类型
                        var text = $.trim($("#addValue").val());//取值
                        var businessDescription = $("#addDescription").val();//业务说明
                        var applicableTo = $("#addGround").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//应用范围
                        if(valueType == '整数'){
                            if(text % 1 != 0){
                                layer.msg('请输入整数');
                                return;
                            }else{
                                sub(id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }
                        }else if(valueType == '布尔'){
                            if(text!='true'&&text!='false'){
                                layer.msg('请输入布尔值') ;
                                return;
                            }else{
                                sub(id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }
                        }else if(valueType == '天数'){
                            if(text % 1 != 0){
                                layer.msg('请输入整数');
                                return;
                            }else{
                                sub(id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }
                        }else if(valueType == '文本'){
                                sub(id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                        }else if(valueType == '小数'){
                            var str1 = text.split('.')[0];
                            var str2 = text.split('.')[1];
                            if((text.split('.')).length==2 && str1%1== 0 && str2%1==0){
                               sub(id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }else{
                                layer.msg('请输入小数') ;
                            }
                        }
                    });
                }
            });
        }else if(obj.event === 'detail'){
            layer.open({
                title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content:$('#details'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['800px', '560px'],
                shade: [0.1, '#fff'],
                resize:false,
                end:function(){
                    $('#details').hide();
                },
                success: function(layero, index){
                    $('#detailsName').val(data.strategyName);
                    $('#detailsType').val(data.userTypename);
                    $('#detailsLevel').val(data.userLevelname);
                    $('#detailsCode').val(data.funcCode);
                    $('#detailsValueType').val(data.valueType);
                    $('#detailsValue').val(data.text);
                    if(data.applicableTo == 0){
                        $('#detailsApplicableTo').val('店铺');
                    }else if(data.applicableTo == 1){
                        $('#detailsApplicableTo').val('商户');
                    }
                    $('#detailsDescription').val(data.businessDescription);
                }
            });
        }
    });

    //选中表单事件
    $('#audit').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    })

    //新增
    $('#commonAdd').on('click',function(){
        layer.open({
            title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
            btn: ['保存', '取消'],
            type: 1,
            content:$('#addDetail'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['800px', '560px'],
            resize:false,
            shade: [0.1, '#fff'],
            end:function(){
                $('#addDetail').hide();
                $('#addName').val('');
                $('#addCode').val('');
                $('#addValue').val('');
                $('#addDescription').val('');
            },
            success:function(layero){
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit","");
                $("a.layui-layer-btn0").attr("lay-filter","formdemo1");
            },
            yes:function(index, layero){
                //form监听事件
                form.on('submit(formdemo1)',function(data){
                    if(data){
                        var strategyName = $.trim($("#addName").val());//策略名称
                        var userType = $("#addType").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//用户类型(0-个人用户,1-商户)
                        var userLevel = $("#addLevel").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//用户等级(0-普通用户,1-普通商户,2-合作商户,3-代理商户)
                        var funcCode = $.trim($("#addCode").val());//功能code
                        var valueType = $("#addValueType").find(".layui-anim-upbit dd.layui-this").text();//取值类型
                        var text = $.trim($("#addValue").val());//取值
                        var businessDescription = $("#addDescription").val();//业务说明
                        var applicableTo = $("#addGround").find(".layui-anim-upbit dd.layui-this").attr("lay-value");//应用范围
                        if(valueType == '整数'){
                            if(text % 1 != 0){
                                layer.msg('请输入整数');
                                return;
                            }else{
                                addSub(strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }
                        }else if(valueType == '布尔'){
                            if(text!='true'&&text!='false'){
                                layer.msg('请输入布尔值') ;
                                return;
                            }else{
                                addSub(strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }
                        }else if(valueType == '天数'){
                            if(text % 1 != 0){
                                layer.msg('请输入整数');
                                return;
                            }else{
                                addSub(strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }
                        }else if(valueType == '文本'){
                            addSub(strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                        }else if(valueType == '小数'){
                            var str1 = text.split('.')[0];
                            var str2 = text.split('.')[1];
                            if((text.split('.')).length==2 && str1%1== 0 && str2%1==0){
                                addSub(strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index);
                            }else{
                                layer.msg('请输入小数') ;
                            }
                        }
                    }
                });
            }
        });
    })

    //修改保存方法
    function sub(id,strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index){
            var param = {
                id:id,
                strategyName :strategyName,
                userType :userType,
                userLevel:userLevel,
                funcCode:funcCode,
                valueType:valueType,
                text:text,
                businessDescription:businessDescription,
                applicableTo:applicableTo
            }
        if(locked){
            locked = false;
            reqAjaxAsync(USER_URL.UPDATERESOURCE,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    layer.msg(res.msg);
                    layer.close(index);
                    var userType = $("#merchantType").find("option:selected").val(); //用户类型
                    var userLevel = $("#merchantLeve").find("option:selected").val(); //用户等级
                    var strategyName = $("#merchantName").val(); //策略名称
                    setTimeout(function(){
                        getTable(userType,userLevel,strategyName);
                        locked = true;
                    },500);
                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
            })
        }
    }

    //新增保存方法
    function addSub(strategyName,userType,userLevel,funcCode,valueType,text,businessDescription,applicableTo,index){
        var param = {
            strategyName :strategyName,
            userType :userType,
            userLevel:userLevel,
            funcCode:funcCode,
            valueType:valueType,
            text:text,
            businessDescription:businessDescription,
            applicableTo:applicableTo
        }

        if(locked) {
            locked = false;
            reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(param)).done(function (res) {
                if(res.code == 1){
                    layer.msg(res.msg);
                    layer.close(index);
                    var userType = $("#merchantType").find("option:selected").val(); //用户类型
                    var userLevel = $("#merchantLeve").find("option:selected").val(); //用户等级
                    var strategyName = $("#merchantName").val(); //策略名称
                    setTimeout(function(){
                        getTable(userType,userLevel,strategyName);
                        locked = true;
                    },500);
                }else{
                    layer.msg(res.msg);
                    locked = true;
                }
            })
        }

    }


    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var userType = $("#merchantType").find("option:selected").val(); //用户类型
        var userLevel = $("#merchantLeve").find("option:selected").val(); //用户等级
        var strategyName = $("#merchantName").val(); //策略名称
        getTable(userType,userLevel,strategyName);
    });

    //重置
    $("#toolRelize").on('click',function(){
        $("#merchantName").val("");
        $("#merchantType").val("");
        $("#merchantLeve").val("");
    });


})(jQuery)