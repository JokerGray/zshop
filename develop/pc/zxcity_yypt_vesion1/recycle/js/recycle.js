(function($){
    var page = 1;
    var rows = 10;
    var username = yyCache.get('username');
    var USER_URL = {
        RESOURLIST : 'operations/findKnowledgeDustbin', //(获取回收站)
        DELETELISTE:'operations/deleteKnowledgeDustbin' //(删除知识点)
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;

    });



    //初始化
    $(function(){
        templeTable();
    });


    //列表渲染
    function templeTable(){
        var obj = tableInit(
            pageCallback,'laypageLeft'
        );
    }

//加了入参的公用方法
        function tableInit( pageCallback, test) {
            layui.use('table', function(){
                var layer = layui.layer;
                var table = layui.table;


            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: "table",
                elem: '#table',
                height: '600',
                page: false,
                even: true,
                skin: 'line',
                unresize:true,
                size:'lg',
                cols: [[
                    {checkbox: true}
                ,{templet: '#effcettime', align: 'left', title: '问题'}
                ,{templet: '#effcettime1', align: 'left', title: '类型'}
                ,{templet: '#effcettime2', align: 'left', title: '原有状态'}
                ,{field:'deleteTime', align: 'left', title: '删除时间'}
                ,{field:'deletetorName', align: 'left', title: '删除人账号'}
                ,{align: 'left', width:120, title: '操作',fixed: 'right',toolbar: '#barDemo'}
            ]]
            });

            //2.第一次加载
            var res = pageCallback(page, rows);
            //第一页，一页显示15条数据
            if(res) {
                if(res.code == 1) {
                    tableIns.reload({
                        data: res.data || []
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
                layout: ['count', 'prev', 'page', 'next', 'skip'],
                limit: rows
            }
            page_options.jump = function(obj, first) {
                tablePage = obj;
                //首次不执行
                if(!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit);
                    if(resTwo && resTwo.code == 1)
                        tableIns.reload({
                            data: resTwo.data || []
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
            })
        }

        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data || [];
            return res;
        }

        //pageCallback回调
        function pageCallback(index, limit) {
            var param = {
                "page": index,
                "rows": limit,
                "param": "",
                "categoryId": "",
                "auditStatus":"0"
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(param));
        }


    //删除或者恢复方法通用
    function restore(id,auditstatus,bizid,biztablename,operation){

            var paramDel = {
                "id":id,
                "bizid":bizid,
                "biztablename" : biztablename,
                "auditStatus":auditstatus,
                "operation":operation
            };
            reqAjaxAsync(USER_URL.DELETELISTE,JSON.stringify(paramDel)).done(function(res){
                if (res.code == 1) {
                    layer.msg(res.msg);
                    templeTable()
                } else {
                    layer.msg(res.msg);
                }
            });

    }

    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        var bizid=data.bizid;
        var biztablename=data.biztablename;
        var auditStatus=data.auditStatus;
        //单个删除
        if(obj.event === 'del'){
            layer.confirm(
                "删除成功后将无法恢复",
                {icon: 3, title:'提示'},
                function(index){
                    restore(''+id,auditStatus,bizid,biztablename,2);
                })
        }else if(obj.event == 'restore'){
            layer.confirm(
                "确认还原?",
                {icon: 3, title:'提示'},
                function(index){
                    restore(''+id,auditStatus,bizid,biztablename,1);
                })
        }
    });

    //一键删除
    $("#delBtn").click(function(){
        var list = $(".repon-table .layui-table-main").find(".layui-form-checked").parents("tr");
        var arr=[];
        var arrbiz = [];
        var arrtabl = [];
        var arrstatu=[];
        for(var i=0;i<list.length;i++){
            arr.push(list.eq(i).find(".ids").text());
            arrbiz.push(list.eq(i).find(".bizid").text());
            arrtabl.push(list.eq(i).find(".biztablename").text());
            arrstatu.push(list.eq(i).find(".auditStatus").text());
        }
        if(arr.length==0){
            layer.msg("请选择相应行");
        }else {
            var ids = arr.toString();
            var bizid = arrbiz.toString();
            var biztablename = arrtabl.join("#-%");
            var auditStatus = arrstatu.toString();
            layer.confirm(
                "删除成功后将无法恢复",
                {icon: 3, title:'提示'},
                function(index){
                    restore(ids,auditStatus,bizid,biztablename,2);
                })
        }

    });

    //一键还原
    $("#addQs").click(function(){
        var list = $(".repon-table .layui-table-main").find(".layui-form-checked").parents("tr");
        var arr=[];
        var arrbiz = [];
        var arrtabl = [];
        var arrstatu=[];
        for(var i=0;i<list.length;i++){
            arr.push(list.eq(i).find(".ids").text());
            arrbiz.push(list.eq(i).find(".bizid").text());
            arrtabl.push(list.eq(i).find(".biztablename").text());
            arrstatu.push(list.eq(i).find(".auditStatus").text());
        }
        if(arr.length==0){
            layer.msg("请选择相应行");
        }else {
            var ids = arr.toString();
            var bizid = arrbiz.toString();
            var biztablename = arrtabl.join("#-%");
            var auditStatus = arrstatu.toString();
            layer.confirm(
                "确认还原？",
                {icon: 3, title:'提示'},
                function(index){
                    restore(ids,auditStatus,bizid,biztablename,1);
                })
        }
    });




})(jQuery);