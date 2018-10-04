(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno") || "";
    var pid = '';
    var locked = true;
    var USER_URL = {
        RESOURLIST : 'operations/plateSettingList', //(查询列表) 1 是第一个, 2是第二个, 3是第三个
        UPDATEDETAIL : 'operations/plateSettingUpdate'  //(修改)'审核状态 0-发布即审核 1-审核后发布',
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    //tab切换
    $(".tab-title").on("click",'ul li',function(){
        var index = $(this).index();
        var num = $(this).attr("data-num");
        $(".tab-title ul li").removeClass("active");
        $(this).addClass("active");
        var plateDesc = $.trim($("#merchantName").val());
        var tableName = $.trim($("#tableName").val());
        if(num == 0){
            getTbl(index,plateDesc,tableName);
            $(this).attr("data-num",1);
            changeType();
        }else{
            getTable(index,plateDesc,tableName);
            changeType();
        }

    });

    //渲染表单
    function getTbl(type,plateDesc,tableName){
        var tno = $("#noAudit").find("table").attr("id")+type;
        $("#noAudit").find("table").attr("id",tno);
        $("#noAudit").find("table").attr("lay-filter",tno);
             objs = tableInit(tno, [
                    [{
                        title: '序号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'eq',
                        width: '5%',
                        templet: '#titleTpl'
                    }, {
                        title: '板块名称',
                       /* sort: true,*/
                        align: 'left',
                        field: 'plateDesc',
                        width: '33%'
                    }, {
                        title: '板块表名',
                       /* sort: true,*/
                        align: 'left',
                        field: 'tableName',
                        width: '30%'
                    }, {
                        title: '预设状态',
                       /* sort: true,*/
                        align: 'left',
                        templet: '#titleStatu',
                        width: '15%'
                    }, {
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: '15%'
                    }]
                ],

                pageCallback,'laypageLeft',type+1,plateDesc,tableName
            );
    }


    //初始化加载未审核
    getTbl(0);
    changeType();

    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback, test,stat,plateDesc,tableName) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-248',
            cols: cols,
            page: false,
            even: true,
            limit: 15,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(stat,page, rows,plateDesc,tableName);
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
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(stat,obj.curr, obj.limit,plateDesc,tableName);
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




    //左侧表格数据处理
    function getData(url, parms) {

        var res = reqAjax(url, parms);

        var data = res.data;

        $.each(data, function(i, item) {
            $(item).attr('eq', (i + 1));
        });

        return res;
    }

    //pageCallback回调
    function pageCallback(statu,index, limit,plateDesc,tableName) {
        if(plateDesc == undefined){plateDesc = ''}
        if(tableName == undefined){tableName = ''}
        var param = {
            page :index,
            rows :limit,
            plateType :statu,
            tableName : tableName,//板块表名
            plateDesc :plateDesc//板块名称
        }
        return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    }



    //修改
    function changeType(){
        var tnos = $("#noAudit").find("table").attr("id");
        table.on('tool('+ tnos +')', function(obj) {
            var data =obj.data;
            // var oldId = data.id;
            //查看
            if (obj.event === 'change') {
                layer.open({
                    title: ['修改', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['400px', '320px'],
                    btn:['保存','取消'],
                    shade: [0.1, '#fff'],
                    closeBtn: 1,
                    end: function () {
                        $('#fourDemo').hide();
                    },
                    success: function (layero, index) {
                        $("#contentDesign").val(data.plateDesc);
                        var lsits = $("#subscription").find("dl dd");
                        for(var i=0;i<lsits.length;i++){
                            if(data.reviewStatus == lsits.eq(i).attr("lay-value")){
                                lsits.removeClass("layui-this");
                                lsits.eq(i).addClass("layui-this");
                                var vl =  lsits.eq(i).text();
                                $("#subscription").find("input").val(vl);
                            }
                        }
                    },
                    yes:function (index,layero){
                        var inx = $(".tab-title ul li.active").index();
                        var reviewStatus = $("#subscription").find("dl dd.layui-this").attr("lay-value");
                        var parm = {
                            "id": data.id,
                            "plateType": inx+1,
                            "tableName": data.tableName,
                            "reviewStatus": reviewStatus,
                            "plateDesc": data.plateDesc
                        }
                        if(locked) {
                            locked = false;
                            reqAjaxAsync(USER_URL.UPDATEDETAIL,JSON.stringify(parm)).done(function(res){
                                if(res.code == 1){
                                    layer.msg(res.msg);
                                    layer.close(index);
                                    var inx = $(".tab-title li.active").index();
                                    var merchantName = $.trim($("#merchantName").val());
                                    var tableName = $.trim($("#tableName").val());
                                    setTimeout(function(){
                                        getTable(inx,merchantName,tableName);
                                        locked = true;
                                    },500);
                                }else{
                                    layer.msg(res.msg);
                                    locked = true;
                                }
                            });
                        }
                    }
                })

            }
        });
    }


    //加了入参的公用方法
    function getTable(type,plateDesc,tableName){
        var initPage = objs.tablePage;
        var initTable = objs.tableIns;
        var res = pageCallback(type+1,1,15,plateDesc,tableName);
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
                var resTwo = pageCallback(type+1,obj.curr, obj.limit,plateDesc,tableName);
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


//点击顶部搜索出现各搜索条件
    $('#search').on('click',function(){
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click',function(){
        var inx = $(".tab-title li.active").index();
        var merchantName = $.trim($("#merchantName").val());
        var tableName = $.trim($("#tableName").val());
        getTable(inx,merchantName,tableName);

        return false;
    })

    //刷新
    $("#refrshbtn").click(function(){
        location.reload();
    });

    //重置
    $("#toolRelize").click(function(){
        $("#merchantName").val("");
        $("#tableName").val("");

        var inx = $(".tab-title li.active").index();
        var merchantName = $.trim($("#merchantName").val());
        var tableName = $.trim($("#tableName").val());
        getTable(inx,merchantName,tableName);
        return false;
    });
})(jQuery);