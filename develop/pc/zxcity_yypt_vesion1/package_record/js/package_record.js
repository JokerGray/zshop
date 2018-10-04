(function($){
    var page = 1;
    var rows = 10;
    var USER_URL = {
        RESOURLIST : 'operations/queryPacksReceiveList' //(查询)
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //渲染表单
    var obj = tableInit('table', [
            [{
                title: '序号',
               /* sort: true,*/
                align: 'left',
                field: 'eq',
                width: 80
            }, {
                title: '礼包',
               /* sort: true,*/
                align: 'left',
                field: 'packsName',
                width: 300
            }, {
                title: '领取人',
               /* sort: true,*/
                align: 'left',
                field: 'receiveUserId',
                width: 100
            }, {
                title: '业务板块',
                /*sort: true,*/
                align: 'left',
                field: 'sectionBusinessId',
                width: 200
            }, {
                title: '是否领取',
               /* sort: true,*/
                align: 'left',
                field: 'isReceiveText',
                width: 100
            }, {
                title: '领取时间',
               /* sort: true,*/
                align: 'left',
                field: 'receiveTimes',
                width: 200
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
            if(item.productId == undefined){
                $(item).attr('productIds','暂无');
            }else{
                $(item).attr('productIds',item.productId);
            };
            if(item.receiveTime == ""){
                $(item).attr('receiveTimes','-');
            }else{
                $(item).attr('receiveTimes',item.receiveTime);
            };
        })
        return res;
    }

    //pageCallback回调

    function pageCallback(index, limit , packsName,isReceive,productId) {
        if(packsName == undefined){packsName = ''}
        if(isReceive == undefined){isReceive = ''}
        if(productId == undefined){productId = ''}
        var param = {
            page:index,
            rows:limit,
            packsName:packsName, //礼包名称
            isReceive:isReceive, //领取状态
            productId:productId //产品名称
        }
        return getData(USER_URL.RESOURLIST,JSON.stringify(param));
    }


    //加了入参的公用方法
    function getTable(packsName,isReceive,productId){
        var initPage = obj.tablePage;
        var initTable = obj.tableIns;
        var res = pageCallback(1, 15,packsName,isReceive,productId);
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
                var resTwo = pageCallback(obj.curr, obj.limit,packsName,isReceive,productId);
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

    //点击查询按钮
    $("#toolSearch").click(function () {
        var packsName = $.trim($("#merchantName").val());//礼包名称
        var isReceive = $("#merchantType").children('option:selected').val();//领取状态
        var productId =$("#payLocK").children('option:selected').val();//产品名称
        getTable(packsName,isReceive,productId);
    });

    //点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //重置
    $("#toolRelize").on('click',function(){
        $("#merchantName").val("");
        $("#merchantType").val("");
        $("#payLocK").val("");
    });
})(jQuery);