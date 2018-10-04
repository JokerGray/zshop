(function($){
    var page = 1;
    var rows = 10;
    var colltid=[];
    var colltname=[];
    var username = yyCache.get('username');
    var operater = yyCache.get("pcNickname",""); //用户昵称
    var operaterId = yyCache.get("userId",""); //登陆者id
    var organizationId = yyCache.get("organizationId",""); //所属组织机构id
    var USER_URL = {
        ADDORDER : 'operations/addTTicketCondition', //搜索保存
        QUERYTICKET : 'operations/findticketByCondition' //自定义搜索
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    });

    //初始化
    $(function(){
        datetime('#datetimepicker2 input');
        datetime('#datetimepicker3 input');
    });


    //返回工单首页通用方法
    function returnIndex(){
        window.top.admin.current("order/order.html?v=" + new Date().getMilliseconds());
        window.top.admin.save();
    }

    //点击我的工单
    $("#myOrder").on("click",function(){
        returnIndex();
    });

    //日期控件
    function datetime(e){
        $(e).datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: "zh-CN"
        }).on('changeDate', function(ev) {
            var startTime = ev.date.valueOf();
            $(this).parent().attr('data-time',startTime);
        });
    }

    //重置
    $("#cancelBtn").click(function(){
        location.reload();
    });

    //点击搜索
    $("#searchBtn").click(function(){
        searchList(1);
    });

    //保存并搜索
    $("#newBtn").click(function(){
        searchList(2);
    });

    //搜索
    function searchList(type){//1-搜索 2-保存搜索
        $(".nodata").hide();
        var qTicketTitle = $.trim($("#titlesc").val()); // 标题
        var qTicketNo = $.trim($("#numbersc").val());//工单的编号
        var qHandler = $("#ctronlUser").find("dl dd.layui-this").attr("lay-value") || "";//工单的处理人id
        var priority = $("#priority").find("dl dd.layui-this").attr("lay-value") || ""; //优先级
        var categoryId = $("#order-classifyname").attr("data-id")||"";//分类id
        var plateId = $("#order-platename").attr("data-id") ||"";//板块 id
        var status = $("#status").find("dl dd.layui-this").attr("lay-value") || ""; //状态
        var phone = $.trim($("#phone").val()); //手机号
        var createTime = $("#jurisdiction-begin2").val();//开始的时间
        var createrId = $("#createUser").find("dl dd.layui-this").attr("lay-value") || ""; //创建人
       if(type==1){
           if(qTicketTitle==""&&qTicketNo==""&&qHandler==""&&priority==""&&categoryId==""&&plateId==""&&status==""&&phone==""&&createTime==""&&createrId==""){
               layer.msg("请选择搜索条件");
           }else {
               templeTable(priority, qTicketTitle, qTicketNo, qHandler, categoryId, plateId, status, phone, createTime, createrId);
           }
       }else{
           if(qTicketTitle==""&&qTicketNo==""&&qHandler==""&&priority==""&&categoryId==""&&plateId==""&&status==""&&phone==""&&createTime==""&&createrId==""){
               layer.msg("请选择搜索条件");
           }else{
               layer.open({
                   title: ['自定义搜索名称', 'font-size:15px;background-color:#0678CE;color:#fff'],
                   type: 1,
                   content: $('#diyBox'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                   area: ['400px', '180px'],
                   shade: [0.1, '#fff'],
                   resize: false,
                   btn:['保存','取消'],
                   end: function () {
                       $('#diyBox').hide();
                   },
                   success: function (layero) {
                       $("#diyName").val("");
                   },yes: function(index, layero){
                       var val = $("#diyName").val();
                       if(val==""){
                           layer.msg("请输入名称");
                       }else{
                            var param = {
                                "priority":priority,// 优先级 0 1 2 3 低 中高 急
                                "tktitle":qTicketTitle,//作为搜索条件的标题
                                "ticketNo":qTicketNo,//工单编号
                                "handlerId":qHandler,//处理人id
                                "categoryId":categoryId,//分类id
                                "plateId":plateId,//板块 id
                                "status":status,// 状态
                                "phone":phone,// 电话
                                "createTime":createTime,//开始的时间
                                "createrId":createrId,// 创建人
                                "title": val,
                                "createId": operaterId
                            }
                           reqAjaxAsync(USER_URL.ADDORDER, JSON.stringify(param)).done(function (res) {
                               if (res.code == 1) {
                                   layer.msg(res.msg);
                                   layer.close(index);
                                   templeTable(priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId);
                               }else{
                                   layer.msg(res.msg);
                               }
                           })
                       }
                   }
               })
           }
       }

   }


    //加载列表
    //列表渲染
    function templeTable(priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId){
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
                    width: 100,
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
                    event: 'changetable'
                }, {
                    title: '更新时间',
                    /*sort: true,*/
                    align: 'left',
                    field: 'updateTime',
                    event: 'changetable'
                }]
            ],
            pageCallback,'laypageLeft',priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId
        );
    }

//加了入参的公用方法
    function tableInit(tableId, cols, pageCallback, test,priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: '400',
            cols: cols,
            page: false,
            even: true,
            skin: 'line',
            unresize:true,
            size:'lg'
        });

        //2.第一次加载
        var res = pageCallback(page, rows,priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId);
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
                var resTwo = pageCallback(obj.curr, obj.limit,priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId);
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
    }

    //左侧表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        var data = res.data || [];
        return res;
    }

    //pageCallback回调
    function pageCallback(index, limit,priority,qTicketTitle,qTicketNo,qHandler,categoryId,plateId,status,phone,createTime,createrId) {
        var param={
            "priority":priority,// 优先级 0 1 2 3 低 中高 急
            "tktitle":qTicketTitle,//作为搜索条件的标题
            "ticketNo":qTicketNo,//工单编号
            "handlerId":qHandler,//处理人id
            "categoryId":categoryId,//分类id
            "plateId":plateId,//板块 id
            "status":status,// 状态
            "phone":phone,// 电话
            "createTime":createTime,//开始的时间
            "createrId":createrId,// 创建人
            "page": index,
            "rows": limit

        }
        return getData(USER_URL.QUERYTICKET, JSON.stringify(param));
    }


})(jQuery);