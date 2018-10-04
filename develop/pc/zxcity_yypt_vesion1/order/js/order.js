(function($){
    var page = 1;
    var rows = 12;
    var username = yyCache.get('username');
    var operaterId = yyCache.get("userId",""); //登陆者id
    var arrlist; //整页的数据
    var countsize;//总页数
    var USER_URL = {
        RESOURLIST : 'operations/findTicket', //查询工单列表
        ADDORDER:'operations/newTicket', //(新增一个工单)
        LEFTMENU:'operations/findTTicketCondition'//查询左侧菜单栏
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;

    });



    //初始化
    $(function(){
        leftMenu()
    });

    //左侧菜单
    function leftMenu(){
        var param = {
            "usercode":operaterId
        }
        reqAjaxAsync(USER_URL.LEFTMENU,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                var sHtml='';
                for(var i=0;i<5;i++){
                    var row = res.data[i];
                    sHtml += '<li data-type="'+ row.type +'" data-sql="'+ row.sql +'">' + row.title + '<span class="order-num">' + row.ticketNum + '</span></li>';
                }
                $(".order-menu").html(sHtml);
                var aHtml="";
                for(var i=5;i<res.data.length;i++){
                    var row = res.data[i];
                    aHtml += '<li data-type="'+ row.type +'" data-sql="'+ row.sql +'">' + row.title + '<span class="order-num">' + row.ticketNum + '</span></li>';
                }
                $(".diy-menu").html(aHtml);
                $(".order-menu li").eq(0).addClass("acv");
                templeTable(res.data[0].sql,res.data[0].type);
            }else{
                layer.msg(res.msg);
            }
        })
    }


    //列表渲染
    function templeTable(sql,type){
        $(".repon-table").show();
        var obj = tableInit('table', [
                [
                    {
                        title: '工单号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'ticketNo',
                        width: 200,
                        event: 'changetable'
                    }, {
                    title: '优先级',
                    /*sort: true,*/
                    align: 'left',
                    width: 100,
                    field: 'priorityText',
                    event: 'changetable'
                }, {
                    title: '标题',
                    /*sort: true,*/
                    align: 'left',
                    field: 'title',
                    width: 200,
                    event: 'changetable'
                }, {
                    title: '状态',
                    /*sort: true,*/
                    align: 'left',
                    field: 'statusText',
                    width: 150,
                    event: 'changetable'
                }, {
                    title: '工单分类',
                    /*sort: true,*/
                    align: 'left',
                    field: 'categoryName',
                    width: 100,
                    event: 'changetable'
                }, {
                    title: '所属板块',
                    /*sort: true,*/
                    align: 'left',
                    field: 'plateName',
                    width: 100,
                    event: 'changetable'
                }, {
                    title: '处理人',
                    /*sort: true,*/
                    align: 'left',
                    field: 'handlerName',
                    width: 100,
                    event: 'changetable'
                }, {
                    title: '创建时间',
                    /*sort: true,*/
                    align: 'left',
                    field: 'createTime',
                    event: 'changetable',
                    width: 160
                }, {
                    title: '更新时间',
                    /*sort: true,*/
                    align: 'left',
                    field: 'updateTime',
                    event: 'changetable',
                    width: 160
                }]
            ],
            pageCallback,'laypageLeft',sql,type
        );
    }

//加了入参的公用方法
    function tableInit(tableId, cols, pageCallback, test,sql,type) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: "auto",
            limit:rows,
            cols: cols,
            page: false,
            even: true,
            skin: 'line',
            unresize:true,
            size:'lg'
        });

        //2.第一次加载
        var res = pageCallback(page, rows,sql,type);
        //第一页，一页显示15条数据
        if(res) {
            if(res.code == 1) {
                tableIns.reload({
                    data: res.data || []
                })
                arrlist = res.data;
                countsize = Math.ceil(res.total/rows);
                sessionStorage.setItem('countsize',countsize);
                sessionStorage.setItem('reviewData',JSON.stringify(arrlist));
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
                var resTwo = pageCallback(obj.curr, obj.limit,sql,type);
                if(resTwo && resTwo.code == 1){
                    tableIns.reload({
                        data: resTwo.data || []
                    });
                    arrlist = resTwo.data;
                    sessionStorage.setItem('reviewData',JSON.stringify(arrlist));
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
        var res = reqAjax(url, parms);
        var data = res.data || [];
        $.each(data, function(i, item) {
            $(item).attr('eq', (i));
        });
        return res;
    }

    //pageCallback回调
    function pageCallback(index, limit,sql,type) {
        if(sql == undefined){sql = ''}
        if(type == undefined){type = ''}
        var param = {
            "page": index,
            "rows": limit,
            "sql": sql,
            "type": type,
            "usercode":operaterId
        }
        return getData(USER_URL.RESOURLIST, JSON.stringify(param));
    }

    //点击左侧菜单
    $(".jurisdiction-left").on("click","li",function(){
        $(".jurisdiction-left li").removeClass("acv");
        $(this).addClass("acv");
        var sql = $(this).attr("data-sql");
        var type = $(this).attr("data-type");
        templeTable(sql,type);
    });


    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        var tickno = data.ticketNo;
        if(obj.event == 'changetable'){
            var inxs =data.eq;
            var pags = $("#laypageLeft").find(".layui-laypage-curr").text();
            var phone = data.phone;
            var sql = $(".jurisdiction-left li.acv").attr("data-sql");
            var type = $(".jurisdiction-left li.acv").attr("data-type");
            sessionStorage.setItem("tickno",tickno); //工单号
            sessionStorage.setItem("inxs",inxs); //索引
            sessionStorage.setItem("pag",pags); //第几页
            sessionStorage.setItem("phon",phone); //电话
            sessionStorage.setItem("sql",sql);
            sessionStorage.setItem("oldtyp",type);
            window.top.admin.current("order_detail/order_detail.html?v=" + new Date().getMilliseconds());
        }
    });

    //新建工单
    $("#addOrder").click(function(){
        window.top.admin.current("order_add/order_add.html?v=" + new Date().getMilliseconds());
    });

    //搜索工单
    $("#search").click(function(){
        window.top.admin.current("order_search/order_search.html?v=" + new Date().getMilliseconds());
    });

})(jQuery);