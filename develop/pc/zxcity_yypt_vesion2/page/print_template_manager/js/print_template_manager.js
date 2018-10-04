//(function($) {
$(document).ready(function(){
    var page = 1;
    var rows = 15;
    var userId = (yyCache && yyCache.get("userId")) || "";
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/findTemplateSetting', //(查询左侧)
        ADDRESOURCE : 'operations/addTemplateSetting',//(新增左侧)
        DELUSER : 'operations/deleteTemplateSetting', //(删除左侧)
        UPDATELIST:'operations/updateTemplateSetting', //修改左侧 //  1：启用；  2：禁用
        ADDRGT:'operations/addTemplateSettingDetail',//新增右侧
        DELETERGT:'operations/deleteTemplateSettingDetail',//删除右侧
        UPDATERGT:'operations/updateTemplateSettingDetail', //修改右侧
        RESOURCERGT:'operations/findTemplateSettingDetail'//查询右侧
    };


    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
        temple(1);
    })
	
	

    //滚动
    $(".table-height").niceScroll({
        cursorcolor:"#dfdfdf",
        cursorborder:"0",
        autohidemode:false
    });

    //正则
    form.verify({
        english: [
            /[a-zA-Z]/
            ,'请输入英文'
        ]
        ,chinese: [
            /[\u4e00-\u9fa5]/
            ,'请输入中文'
        ]
    });

    //初始化渲染表单
    $(window).resize(function(){
         
        temple(1);
    });

    //选中表单事件
    $('#app').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    })
    $(".print-rgt").on("click","tbody tr",function(){
        $(this).addClass('acv').siblings().removeClass('acv');
    });


    //切换是否发布
    form.on('radio(statu)', function(data){
        $(".isopen").attr("data-type",data.value);
    });
 

    //新增左侧
    $('#commonAdd').on('click',function(){
        save(1);
    })

    //渲染表单
    function temple(pag,templateName){
        var inx = $("#commonAdd").attr("data-inx");
    var obj = tableInit('table', [
            [/*{
                align: 'left',
                field: 'eq',
                width: 80,
                event: 'changetables'
            },*/ {
                align: 'left',
                field: 'templateName',
                width:200,
                event: 'changetables'
            },{
                align: 'left',
                toolbar: '#barDemo',
                width: 280
            }]
        ],
        pageCallback,templateName,pag,inx
    );
        //默认第一个选中
        $("#app tbody tr").eq(inx).addClass("layui-table-click");
}


    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback,templateName,pag,inx) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'600',
            cols: cols,
            page: false,
            even: true,
            limit: rows || 15,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(pag,rows,templateName);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                $("#commonAdd").attr("data-pid",res.data[inx].id);
                $("#commonAdd").attr("data-name",res.data[inx].templateName);
                getRgt(res.data[inx].id,res.data[inx].templateName);
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
            limits: [rows, rows*2],
            limit: rows,
            curr:pag
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit,templateName);
                if(resTwo && resTwo.code == 1){
                    $("#search").attr("data-page",obj.curr);
                    getRgt(resTwo.data[0].id,resTwo.data[0].templateName);
                    tableIns.reload({
                        data: resTwo.data,
                        limit: obj.limit
                    });
                    $("#app tbody tr").eq(0).addClass("layui-table-click");
                }
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




    //左侧表格数据处理
    function getData(url, parms) {

        var res = reqAjax(url, parms);

        var data = res.data;

        $.each(data, function(i, item) {
            $(item).attr('eq', (i + 1))
        });

        return res;
    }

    //pageCallback回调
    function pageCallback(index, limit , templateName) {
        var param = {
            "page": index,
            "rows": limit,
            "templateName": templateName//模板名称
        }
        return getData(USER_URL.RESOURLIST, JSON.stringify(param));
    }

    //新增或者修改 左侧
    function save(type,e){ //type 1-新增 2-修改(修改时传e)
        layer.open({
            title: ['模板列表', 'font-size:12px;background-color:#424651;color:#fff'],
            btn: ['确定', '取消'],
            resize:false,
            type: 1,
            offset: 'auto',
            content:$('#lookInfo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['400px', '320px'],
            shade: [0.1, '#fff'],
            end:function(){
                $('#lookInfo').hide();
                $('#lookInfo').find(".clear-input").val("");
            },
            success:function(layero){
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit","");
                $("a.layui-layer-btn0").attr("lay-filter","formdemo");
                if(type==1){
                   $(".open").hide();
                }else{
                    $(".open").show();
                    $("#templateName").val(e.templateName);
                    $("#remark").val(e.remark);
                    $(".isopen").attr("data-type",e.status);
                    if(e.status==1){
                        $('#opn').attr("checked", true);
                    }else{
                        $('#nopn').attr("checked", true);
                    }
                    form.render();
                }
            },
            yes:function(index, layero){
                //form监听事件
                form.on('submit(formdemo)',function(data){
                    if(data){
                        var templateName = $.trim($("#templateName").val());
                        var remark = $.trim($("#remark").val());
                        var status = $(".isopen").attr("data-type");
                        var param = {
                            "templateName": templateName,//注册表名称
                            "remark":remark,//备注
                            "usercode":userId //操作人帐号id
                        }
                        if(type==2){
                            param.id=e.id;
                            param.status= status;//是否启用
                        }
                        if(type==1){ //新增
                            if(locked){
                                locked = false;
                                reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
                                    if(res.code == 1){
                                        layer.close(index);
                                        layer.msg(res.msg);
                                        setTimeout(function(){
                                            location.reload();
                                            locked = true;
                                        },500);
                                    }else{
                                        layer.msg(res.msg);
                                        locked = true;
                                    }
                                });
                            }
                        }else if(type==2){ //修改
                            if(locked){
                                locked = false;
                                reqAjaxAsync(USER_URL.UPDATELIST,JSON.stringify(param)).done(function(res){
                                    if(res.code == 1){
                                        layer.close(index);
                                        layer.msg(res.msg);
                                        var tpname = $.trim($("#name").val());
                                        var pag = $("#search").attr("data-page");
                                        setTimeout(function(){
                                            temple(pag,tpname);
                                            locked = true;
                                        },500);
                                    }else{
                                        layer.msg(res.msg);
                                        locked = true;
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    }


    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var inx = obj.tr.index();
        $("#commonAdd").attr("data-inx",inx);
        $("#commonAdd").attr("data-pid",id);
        $("#commonAdd").attr("data-name",data.templateName);
        //删除
        if(obj.event === 'del'){
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示',shade: [0.1, '#fff']},
                function(index){
                    var paramDel = {
                        ids : id
                    };
                    reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg("删除成功");
                            obj.del();
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }else if(obj.event === 'change'){//修改
            save(2,data)
        }else if(obj.event === 'open'){//点开启
            isOpen(id,2);
        }else if(obj.event === 'close'){//点关闭
            isOpen(id,1);
        }else if(obj.event === 'changetables'){
            getRgt(id,data.templateName);
            if(data.status==1){
                $(".table-box .delt").show();
            }else{
                $(".table-box .delt").hide();
            }
        }
    });

    //是否开启
    function isOpen(id,type){
        var param = {
            "id":id,
            "usercode":userId,
            "status":type
        }
        reqAjaxAsync(USER_URL.UPDATELIST,JSON.stringify(param)).done(function(res){
            if (res.code == 1) {
                layer.msg(res.msg);
                var tpname = $.trim($("#name").val());
                var pag = $("#search").attr("data-page");
                temple(pag,tpname);
            } else {
                layer.msg(res.msg);
            }
        });
    }


    //刷新
    $("#refresh").click(function(){
        location.reload();
    });

    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var name = $.trim($("#name").val()) || "";
        temple(1,name);
    })

    //重置
    $("#toolRelize").on('click',function(){
        $("#name").val("");
    });

    //加载右侧
    function getRgt(id,name){
        var param={
            "templateId":id+""
        }
        reqAjaxAsync(USER_URL.RESOURCERGT,JSON.stringify(param)).done(function(res){
            var headArr="";
            var bodyArr="";
            var footArr="";
            if (res.code == 1) {
                comnoSet(res.data,"RM80",name);
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    if(row.itemType=="H"){
                        headArr += '<tr data-type="'+ row.itemType +'" data-id="'+row.id+'" data-pid="'+ row.templateId +'">'+
                                        '<td>'+row.itemName+'</td>'+
                                        '<td>'+row.itemValue+'</td>'+
                                        '<td>'+row.createTime+'</td>'+
                                    '</tr>'
                    }else if(row.itemType=="B"){
                        bodyArr += '<tr data-type="'+ row.itemType +'" data-id="'+row.id+'" data-pid="'+ row.templateId +'">'+
                                        '<td>'+row.itemName+'</td>'+
                                        '<td>'+row.itemValue+'</td>'+
                                        '<td>'+row.createTime+'</td>'+
                                    '</tr>'
                    }else if(row.itemType=="F"){
                        footArr += '<tr data-type="'+ row.itemType +'" data-id="'+row.id+'" data-pid="'+ row.templateId +'">'+
                        '<td>'+row.itemName+'</td>'+
                        '<td>'+row.itemValue+'</td>'+
                        '<td>'+row.createTime+'</td>'+
                        '</tr>'
                    }
                }
                $(".headtab").html(headArr);
                $(".bodytab").html(bodyArr);
                $(".foottab").html(footArr);
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //添加/修改右侧通用
    function updataRgt(type,e){ //type 1-新增 2-修改 e-d当前元素
        var isAcv = e.parents(".head-list").find("table tbody .acv").index();
        var tid = $("#commonAdd").attr("data-pid");//左侧表id
        var tname = $("#commonAdd").attr("data-name"); //左侧表名称
        var typ = e.parent().attr("data-type"); //表头、表体、表尾
            if(type==2){
                if(isAcv==-1){
                    layer.msg("请先选中要修改的行",{icon:6});
                    return false;
                }
                var itemName = e.parents(".head-list").find("table tbody .acv").find("td").eq(0).text();
                var itemValue = e.parents(".head-list").find("table tbody .acv").find("td").eq(1).text();
                var id = e.parents(".head-list").find("table tbody .acv").attr("data-id");
                layer.open({
                    title: ['设置字段', 'font-size:12px;background-color:#424651;color:#fff'],
                    btn: ['确定', '取消'],
                    resize:false,
                    type: 1,
                    offset: 'auto',
                    content:$('#lookInfo1'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['320px', '320px'],
                    shade: [0.1, '#fff'],
                    end:function(){
                        $('#lookInfo1').hide();
                        $('#lookInfo1').find(".clear-input").val("");
                    },
                    success:function(layero){
                        //给保存按钮添加form属性
                        $("div.layui-layer-page").addClass("layui-form");
                        $("a.layui-layer-btn0").attr("lay-submit","");
                        $("a.layui-layer-btn0").attr("lay-filter","formdUpd");
                        $("#templateName1").val(itemName);
                        $("#remark1").val(itemValue);
                    },
                    yes:function(index, layero){
                        //form监听事件
                        form.on('submit(formdUpd)',function(data){
                            if(data){
                                var templateName = $.trim($("#templateName1").val());
                                var remark = $.trim($("#remark1").val());
                                var param = {
                                    "itemName": templateName,//键
                                    "itemValue":remark,//值
                                    "usercode":userId, //操作人帐号id
                                    "itemType":typ,
                                    "id":id
                                }
                                    if(locked){
                                        locked = false;
                                        reqAjaxAsync(USER_URL.UPDATERGT,JSON.stringify(param)).done(function(res){
                                            if(res.code == 1){
                                                layer.close(index);
                                                layer.msg(res.msg);
                                                setTimeout(function(){
                                                    getRgt(tid,tname);
                                                    locked = true;
                                                },500);
                                            }else{
                                                layer.msg(res.msg);
                                                locked = true;
                                            }
                                        });
                                    }
                            }
                        });
                    }
                });
            }else if(type==1){
                layer.open({
                    title: ['设置字段', 'font-size:12px;background-color:#424651;color:#fff'],
                    btn: ['确定', '取消'],
                    resize:false,
                    type: 1,
                    offset: 'auto',
                    content:$('#lookInfo1'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['320px', '320px'],
                    shade: [0.1, '#fff'],
                    end:function(){
                        $('#lookInfo1').hide();
                        $('#lookInfo1').find(".clear-input").val("");
                    },
                    success:function(layero){
                        //给保存按钮添加form属性
                        $("div.layui-layer-page").addClass("layui-form");
                        $("a.layui-layer-btn0").attr("lay-submit","");
                        $("a.layui-layer-btn0").attr("lay-filter","formdUpd");
                    },
                    yes:function(index, layero){
                        //form监听事件
                        form.on('submit(formdUpd)',function(data){
                            if(data){
                                var templateName = $.trim($("#templateName1").val());
                                var remark = $.trim($("#remark1").val());
                                var param = {
                                    "itemName": templateName,//键
                                    "itemValue":remark,//值
                                    "usercode":userId, //操作人帐号id
                                    "itemType":typ,
                                    "templateId":tid
                                }
                                    if(locked){
                                        locked = false;
                                        reqAjaxAsync(USER_URL.ADDRGT,JSON.stringify(param)).done(function(res){
                                            if(res.code == 1){
                                                layer.close(index);
                                                layer.msg(res.msg);
                                                setTimeout(function(){
                                                    getRgt(tid,tname);
                                                    locked = true;
                                                },500);
                                            }else{
                                                layer.msg(res.msg);
                                                locked = true;
                                            }
                                        });
                                    }
                            }
                        });
                    }
                });
            }


    }

    //表头添加
    $("#headAdd").on("click",function(){
        updataRgt(1,$(this));
    });

    //表体添加
    $("#bodyAdd").on("click",function(){
        updataRgt(1,$(this));
    });

    //表wei添加
    $("#footAdd").on("click",function(){
        updataRgt(1,$(this));
    });

    //表头修改
    $("#headEdit").on("click",function(){
        updataRgt(2,$(this));
    });

    //表体修改
    $("#bodyEdit").on("click",function(){
        updataRgt(2,$(this));
    });

    //表wei修改
    $("#footEdit").on("click",function(){
        updataRgt(2,$(this));
    });

    //删除通用
    function deleDetail(e){
        var index =  e.parents(".head-list").find("table tbody .acv").index();
        if(index==-1){
            layer.msg("请先选中要删除的行",{icon:6});
            return false;
        }
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示',shade: [0.1, '#fff']},
            function(index){
                var id = e.parents(".head-list").find("table tbody .acv").attr("data-id");
                var param = {
                    "ids":id
                }
                reqAjaxAsync(USER_URL.DELETERGT,JSON.stringify(param)).done(function(res){
                    if (res.code == 1) {
                        layer.msg(res.msg);
                        var tid = $("#commonAdd").attr("data-pid");//左侧表id
                        var tname = $("#commonAdd").attr("data-name"); //左侧表名称
                        getRgt(tid,tname);
                    } else {
                        layer.msg(res.msg);
                    }
                });
            })
    }

    //表头删除
    $("#headDel").on("click",function(){
        deleDetail($(this));
    });

    //表体删除
    $("#bodyDel").on("click",function(){
        deleDetail($(this));
    });

    //表尾删除
    $("#footDel").on("click",function(){
        deleDetail($(this));
    });

    //设置为模板
    $("#setTemp").click(function(){
        var id = $("#commonAdd").attr("data-pid");
        var content = $(".artic-list").html();
        var num = $("#setTemp").attr("data-num");
        if(num==0){
            layer.msg("请先添加字段",{icon:6});
            return false;
        }
        var param = {
            "usercode":userId,
            "id":id,
            "content":content
        }
        reqAjaxAsync(USER_URL.UPDATELIST,JSON.stringify(param)).done(function(res){
            if (res.code == 1) {
                layer.msg("设置成功",{icon:1});
            } else {
                layer.msg(res.msg);
            }
        });
    });

    //设置模板方法
    function comnoSet(res,type,name){ //type表示a4或者58或者80
        var sharr=[];
        var sbarr=[];
        var sfarr=[];
        if(res.length==0){
            $("#setTemp").attr("data-num",0);
        }else{
            $("#setTemp").attr("data-num",1);
            for(var i=0;i<res.length;i++){
                var row = res[i];
                if(row.itemType=="H"){
                    sharr.push(row);
                }else if(row.itemType=="B"){
                    sbarr.push(row);
                }else if(row.itemType=="F"){
                    sfarr.push(row);
                }
            }

            var a = $(".artic-list");
            a.find(".content-title").text(name);
            if(sharr.length>0){
                var sHtml="";
                for(var b=0;b<sharr.length;b++){
                    sHtml += '<div class="top-list" data-id="'+ sharr[b].id +'">'
                    + '<div class="list-title cura" data-is="D"><span>' + sharr[b].itemName + '</span>：</div>'
                    + '<div class="title-val">#' + sharr[b].itemValue + '#</div>'
                    + '</div>'
                }
                a.find(".content-top").html(sHtml);
            }

            if(sbarr.length>0){
                var sHtml ="";
                sHtml+='<div class="tab-title">'
                for(var c=0;c<sbarr.length;c++){
                    sHtml+= '<div class="table-title cura" data-is="B" data-id="'+ sbarr[c].id +'">' + sbarr[c].itemName + '</div>'
                }
                sHtml+='</div>' +
                '<div class="table-body">'
                + '<div id="tableText">'
                for(var c=0;c<sbarr.length;c++){
                    sHtml+= '<div class="table-val">#' + sbarr[c].itemValue + '#</div>'
                }
                sHtml+='</div></div>'
                a.find(".content-body").html(sHtml);
                if(sbarr.length>3){
                    $(".eight-size .content-body").find(".table-title").css("width","20%");
                    $(".eight-size .content-body").find(".table-val").css("width","20%");
                    $(".eight-size .content-body").find(".table-title").eq(0).css("width","40%");
                    $(".eight-size .content-body").find(".table-val").eq(0).css("width","40%");
                }else if(sbarr.length==3){
                    $(".eight-size .content-body").find(".table-title").css("width","20%");
                    $(".eight-size .content-body").find(".table-val").css("width","20%");
                    $(".eight-size .content-body").find(".table-title").eq(0).css("width","40%");
                    $(".eight-size .content-body").find(".table-val").eq(0).css("width","40%");
                }else if(sbarr.length==2){
                    $(".eight-size .content-body").find(".table-title").css("width","50%");
                    $(".eight-size .content-body").find(".table-val").css("width","50%");
                }else if(sbarr.length==1){
                    $(".eight-size .content-body").find(".table-title").css("width","100%");
                    $(".eight-size .content-body").find(".table-val").css("width","100%");
                }

            }

            if(sfarr.length>0){
                var sHtml="";
                for(var d=0;d<sfarr.length;d++){
                    sHtml += '<div class="footer-list" data-id="'+ sfarr[d].id +'">'
                    + '<div class="footer-title"><span>' + sfarr[d].itemName + '</span>：</div>'
                    + '<div class="footer-val">#' + sfarr[d].itemValue + '#</div>'
                    + '</div>'
                }
                a.find(".content-footer").html(sHtml);
            }
        }

    }
});
//})(jQuery)