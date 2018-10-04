$(function() {
    var page = 1;
    var rows = 15;
    var userno = yyCache.get("userno") || "";
    var admin = yyCache.get("username") || "";
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/findCustomserviceGroup', //(查询客服分组)
        QUERYSERVICE : 'operations/findCustomservice',//(查询客服)
        ADDRESOURCE : 'operations/addCustomserviceGroup',//(添加客服分组)
        DELUSER : 'operations/deleteCustomservice', //(删除客服)
        QUERYGROUP : 'operations/findCustomserviceGroupbyId', //(查询客服分组搜索专用)
        UPDATESERVICE :'operations/updateCustomservice', //(修改客服分配)
        DELETEGROUP : 'operations/deleteCustomserviceGroup' //删除分组
    };


    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //初始化
    $(function(){
        serviceGrop(1);//首次加载左侧列表
    })

    //搜索展开
    $('#search').on('click', function() {
        $('#search-tool').slideToggle(200)
    })

    //pageCallback回调
    function pageCallback(type,index, limit,groupid,username,usercode) {
        if(type==1){ //客服分组
            var param = {
                'page':index,
                'rows':limit
            }
            return getData(USER_URL.RESOURLIST,param);
        }else if(type==2){ //客服
            var param = {
                'page':index,
                'rows':limit,
                'groupid':groupid
            }
            return getData(USER_URL.QUERYSERVICE,param);
        }else{ //搜索专用
            var param = {
                'page':index,
                'rows':limit,
                'usercode':usercode,
                'username':username
            }
            return getData(USER_URL.QUERYGROUP,param);
        }

    }


    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback,type, pageDomName,groupid,usercode,username,pag) {
        var tableIns, tablePage;

        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-340',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'

        });

        //2.第一次加载
        if(type==1){
            var res = pageCallback(type,pag, rows);
            if(res &&res.code == 1) {
                service(res.data[0].groupid);
            }

        }else if(type==2){
            var res = pageCallback(type,1, rows,groupid);
        }else{
            var res = pageCallback(type,1, rows,"",username,usercode);
            if(res &&res.code == 1) {
                service(res.data[0].groupid);
            }
        }
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
            elem:pageDomName,
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
                if(type==1){
                    var resTwo = pageCallback(type,obj.curr, obj.limit);
                    if(resTwo &&resTwo.code == 1) {
                        $("#search").attr("data-page",obj.curr);
                        service(resTwo.data[0].groupid);
                    }

                }else if(type==2){
                    var resTwo = pageCallback(type,obj.curr, obj.limit,groupid);
                }else{
                    var resTwo = pageCallback(type,obj.curr, obj.limit,"",username,usercode);
                    if(resTwo &&resTwo.code == 1) {
                        service(resTwo.data[0].groupid);
                    }

                }
                if(resTwo && resTwo.code == 1){
                    tableIns.reload({
                        data: resTwo.data
                    });
                    $(".roleTable tbody tr").eq(0).addClass("layui-table-click");
                }
                else{
                    layer.msg(resTwo.msg);
                }
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
        var res = reqAjax(url, JSON.stringify(parms));

        var data = res.data;

        $.each(data, function(i, item) {
            $(item).attr('eq', (i + 1))
        });

        return res;
    }

    //修改时加载已有客服
    function getSerOld(id){
        var sHtml='';
        var param ={
            'page':page,
            'rows':100,
            'groupid':id
        }
        reqAjaxAsync(USER_URL.QUERYSERVICE, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<li data-userid="'+ row.userid +'" data-id="'+ row.usercode +'">' + row.username + '</li>';
                }
                $("#groupSelect").html(sHtml);
            }
        })
    }

    $("#groupAll").on("click","li",function(){
        var val = $(this).text();
        var id = $(this).attr("data-id");
        var groupid = $(this).attr("data-groupid");
        var userid = $(this).attr("data-userid");
        var list = $('#groupSelect li') || "";
        var listarr=[];
        if(list.length!=0){
            for(var k=0;k<list.length;k++){
                if(val==list.eq(k).text()){
                    listarr.push(val);
                }
            }
            if(listarr.length==0){
                var sHtml = '<li data-userid="'+userid  +'"  data-id="' + id + '" data-groupid="' + groupid + '">' + val + '</li>';
                $("#groupSelect").append(sHtml);
            }

        }else{
            var sHtml = '<li data-userid="'+userid  +'" data-id="' + id + '" data-groupid="' + groupid + '">' + val + '</li>';
            $("#groupSelect").append(sHtml);
        }


    });

    $("#groupSelect").on("click","li",function(){
        $(this).remove();
    });

    //左侧操作
    table.on('tool(roleName)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var inx = obj.tr.index();
        $("#commonAdd").attr("data-inx",inx);
        var groupid = data.groupid;
        if(layEvent === 'changetable') {
            service(groupid);
        }else if(layEvent === 'delete'){
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示'},
                function(index){
                    var paramDel = {
                        'groupid':groupid
                    };
                    reqAjaxAsync(USER_URL.DELETEGROUP,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg("删除成功");
                            layer.close(index);
                            serviceGrop(1);
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }
        else if(layEvent ==='edit'){ //客服分配
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
                btn: ['保存', '取消'],
                resize: false,
                type: 1,
                offset:'90px',
                content: $('#grouptip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['800px', '700px'],
                shade: [0.1, '#fff'],
                end: function () {
                    $('#grouptip').hide();
                },
                success: function (layero) {
                    $(layero).find('#groupName').val(data.name);
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit", "");
                    $("a.layui-layer-btn0").attr("lay-filter", "formdemo");

                    //加载已有客服
                    getServiceAll(); //加载全部客服
                    getSerOld(groupid);
                },
                yes: function (index, layero) {
                    //form监听事件
                    form.on('submit(formdemo)', function (data) {
                        if (data) {
                            var name = $.trim($("#groupName").val());
                            var listArr = [];
                            var listname = [];
                            var listUseid = [];
                            var list = $("#groupSelect li");
                            if(list.length==0){
                                layer.msg("请选择客服", {
                                    icon: 6
                                });
                                return false;
                            }else{
                                for(var i=0;i<list.length;i++){
                                    listArr.push(list.eq(i).attr("data-id"));
                                    listname.push(list.eq(i).text());
                                    listUseid.push(list.eq(i).attr("data-userid"));
                                }

                                var param = {
                                    'admin':admin,
                                    'name':name,
                                    'usercodes':listArr.join(","),
                                    'usernames':listname.join(","),
                                    'groupid':groupid,
                                    'userids':listUseid.join(",")
                                }
                                if(locked) {
                                    locked = false;
                                    reqAjaxAsync(USER_URL.UPDATESERVICE, JSON.stringify(param)).done(function (res) {
                                        if (res.code == 1) {
                                            layer.close(index);
                                            layer.msg(res.msg);
                                            var num = $.trim($("#serviceNum").val());
                                            var nam = $.trim($("#serviceName").val());
                                            var pag = $("#search").attr("data-page");
                                            if(num!=""||nam!=""){
                                                serviceGrop(3,nam,num);
                                            }else{
                                                serviceGrop(1,"","",pag);//首次加载左侧列表
                                            }
                                            service(groupid);
                                            locked = true;
                                        }else{
                                            layer.msg(res.msg);
                                            locked = true;
                                        }
                                    })
                                }
                            }
                        }
                        return false; //阻止表单跳转。
                    })
                }
            })
        }
    })


    function service(id){
        var obser = tableInit('roleList',[
                [ //标题栏
                    {
                        field: 'usercode',
                        title: '客服工号',
                        width: 100
                    },
                    {
                        field: 'username',
                        title: '客服名称',
                        width: 100
                    },  {
                    field: 'create_time',
                    title: '创建时间',
                    width: 200
                },
                    {
                        field: 'option',
                        title: '操作',
                        toolbar: '#barDemo2',
                        width: 200
                    }
                ]
            ],
            pageCallback,2,'laypagergt',id
        )

        //删除
        table.on('tool(roleList)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            var groupid = $(".roleTable .layui-table-click").find(".groupid").text();
            var id = data.usercode;
            if(layEvent === 'del') {
                layer.confirm(
                    "确认删除?",
                    {icon: 3, title:'提示'},
                    function(index){
                        var paramDel = {
                            'usercode' : id,
                            'groupid':groupid
                        };
                        reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(paramDel)).done(function(res){
                            if (res.code == 1) {
                                layer.msg("删除成功");
                                layer.close(index);
                                service(groupid);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    })
            }
        })
    }


    //搜索
    $("#toolSearch").on("click",function(){
        var username = $.trim($("#serviceNum").val());
        var usercode = $.trim($("#serviceName").val());
        serviceGrop(3,username,usercode)
    });

    //加载左侧列表通用方法

    function serviceGrop(type,username,usercode,pag){
        if(pag!=""){

        }else{
            pag=1;
        }
        var _objs = tableInit('roleName',[
                [ //标题栏
                    {
                        title: '序号',
                        templet:'#_eq',
                        width: 80,
                        event: 'changetable'
                    },
                    {
                        field: 'name',
                        title: '组名',
                        width: 100,
                        event: 'changetable'
                    },  {
                    field: 'create_time',
                    title: '创建时间',
                    width: 200,
                    event: 'changetable'
                },
                    {
                        field: 'option',
                        title: '操作',
                        toolbar: '#barDemo1',
                        width: 200
                    }
                ]
            ],
            pageCallback,type,'laypageLeft',"",username,usercode,pag
        )
        var inx = $("#commonAdd").attr("data-inx");
        //默认第一个选中
            $(".roleTable tbody tr").eq(inx).addClass("layui-table-click");
    }

    //重置
    $("#toolRelize").on("click",function(){
        $("#serviceNum").val("");
        $("#serviceName").val("");
    });

    //刷新
    $("#refresh").click(function(){
        location.reload();
    });

    //加载全部客服
    function getServiceAll(){
        var sHtml = '';
        var param = {
            'page':page,
            'rows':100
        }
        reqAjaxAsync(USER_URL.QUERYSERVICE,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                for(var i=0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<li data-userid="'+ row.userid +'" data-id="'+ row.usercode +'">' + row.username + '</li>'
                }
                $("#groupAll").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        })
    };

    //添加
    $("#commonAdd").on("click",function(){
        layer.open({
            title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
            btn: ['保存', '取消'],
            resize: false,
            type: 1,
            offset:'90px',
            content: $('#grouptip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['800px', '700px'],
            shade: [0.1, '#fff'],
            end: function () {
                $('#grouptip').hide();
            },
            success: function (layero) {
                $(layero).find('#groupName').val("");
                $(layero).find('#groupSelect').html("");
                getServiceAll(); //加载全部客服
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit", "");
                $("a.layui-layer-btn0").attr("lay-filter", "formdemo");

            },
            yes: function (index, layero) {
                //form监听事件
                form.on('submit(formdemo)', function (data) {
                    if (data) {
                        var name = $.trim($("#groupName").val());
                        var listArr = [];
                        var listnam = [];
                        var listUseid = [];
                        var list = $("#groupSelect li");
                        if(list.length==0){
                            layer.msg("请选择客服", {
                                icon: 6
                            });
                            return false;
                        }else{
                            for(var i=0;i<list.length;i++){
                                listArr.push(list.eq(i).attr("data-id"));
                                listnam.push(list.eq(i).text());
                                listUseid.push(list.eq(i).attr("data-userid"));
                            }

                            var param = {
                                'admin':admin,
                                'name':name,
                                'usercodes':listArr.join(","),
                                'uesrnames':listnam.join(","),
                                'userids':listUseid.join(",")
                            }
                            if(locked) {
                                locked = false;
                                reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(param)).done(function (res) {
                                    if (res.code == 1) {
                                        layer.close(index);
                                        layer.msg(res.msg);
                                        $("#serviceNum").val("");
                                        $("#serviceName").val("");
                                        serviceGrop(1);//首次加载左侧列表
                                        locked = true;
                                    }else{
                                        layer.msg(res.msg);
                                        locked = true;
                                    }
                                })
                            }
                        }
                    }
                })
            }
        })
    });
})