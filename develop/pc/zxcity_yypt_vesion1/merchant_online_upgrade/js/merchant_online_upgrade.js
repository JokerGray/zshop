(function($){
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno");
    var userId = yyCache.get("userId") ;
    var userName = yyCache.get('username');
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/onLineMrchantUpgradeConfirmList', //(查询列表)
        LOOKDETAIL : 'operations/approveMerchantUpgrade' //(确认)
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })
	
	$('#noAudit').on('click','.layui-table-body tr',function(){
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})
    //日期选择
    $('#datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = ev.date.valueOf();
        var endTime =  $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time',startTime);
        $("#datetimepicker2 .datepicker").hide();
    });

    $('#datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = ev.date.valueOf();
        var endTime =  $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time',startTime);
        $("#datetimepicker1 .datepicker").hide();
    });


    //tab切换

    $(".tab-title").on("click",'ul li',function(){
        var index = $(this).index();
        var num = $(this).attr("data-num");
        $(".tab-title ul li").removeClass("active");
        $(this).addClass("active");
        var list = $(".table-lt .table-list");
        list.css("display","none");
        list.eq(index).css("display","block");
        var merchantName = $.trim($("#merchantName").val());
        var createTimeBegin = $("#jurisdiction-begin").val();
        var createTimeEnd = $("#jurisdiction-end").val();
        if(num == 0){
            getTbl(index);
            $(this).attr("data-num",1);
        }else{
            getTable(index,merchantName,createTimeBegin,createTimeEnd);
        }

    });

    //渲染表单
    function getTbl(type){//1-待审核 3-审核
        if(type == 0){
            objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '商户名称',
                        /*sort: true,*/
                        align: 'left',
                        field: 'ORGNAME',
                        width: 100
                    }, {
                        title: '商户账号',
                       /* sort: true,*/
                        align: 'left',
                        field: 'ACCOUNT',
                        width: 200
                    }, {
                        title: '联系电话',
                        /*sort: true,*/
                        align: 'left',
                        field: 'PHONE',
                        width: 200
                    },  {
                        title: '状态',
                       /* sort: true,*/
                        align: 'left',
                        field: 'statuname',
                        width: 100
                    },  {
                        title: '提交时间',
                       /* sort: true,*/
                        align: 'left',
                        field: 'APPLYTIME',
                        width: 200
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 70
                    }]
                ],

                pageCallback,'laypageLeft',1
            );
        }else if(type == 1){
            objaa = tableInit('table', [
                    [{
                        title: '序号',
                       /* sort: true,*/
                        align: 'left',
                        field: 'eq',
                        width: 80,
                        templet: '#titleTpl'
                    }, {
                        title: '商户名称',
                       /* sort: true,*/
                        align: 'left',
                        field: 'ORGNAME',
                        width: 100
                    }, {
                        title: '商户账号',
                       /* sort: true,*/
                        align: 'left',
                        field: 'ACCOUNT',
                        width: 200
                    }, {
                        title: '联系电话',
                       /* sort: true,*/
                        align: 'left',
                        field: 'PHONE',
                        width: 200
                    },  {
                        title: '状态',
                       /* sort: true,*/
                        align: 'left',
                        field: 'statuname',
                        width: 100
                    },  {
                        title: '提交时间',
                       /* sort: true,*/
                        align: 'left',
                        field: 'APPLYTIME',
                        width: 200
                    }]
                ],

                pageCallback,'laypageright',3
            );
        }
    }


    //初始化加载未审核
    getTbl(0);



    /* 表格初始化
     * tableId:
     * cols: []
     * pageCallback: 同步调用接口方法
     */
    function tableInit(tableId, cols, pageCallback, test,stat) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height:'full-290',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(stat,page, rows);
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
                var resTwo = pageCallback(stat,obj.curr, obj.limit);
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
        console.log(data)
        $.each(data, function(i, item) {
            $(item).attr('eq', (i + 1));
            if(item.STATUS==1){
                $(item).attr('statuname', '待确认');
            }else if(item.STATUS==3){
                $(item).attr('statuname', '已确认');
            };
        });

        return res;
    }

    //pageCallback回调
    function pageCallback(statu,index, limit,merchantName,createTimeBegin,createTimeEnd) {
        if(merchantName == undefined){merchantName = ''}
        if(createTimeBegin == undefined){createTimeBegin = ''}
        if(createTimeEnd == undefined){createTimeEnd = ''}
        var param = {
            page :index,
            rows :limit,
            phone :merchantName,//商户名
            startDate :createTimeBegin,  //注册时间起
            endDate :createTimeEnd, //提交时间止*/
            status : statu //审核状态1代表待确认，3代表已确认
        }
        return getData(USER_URL.RESOURLIST , JSON.stringify(param));
    }



    //未审核相关处理
    table.on('tool(tableNo)', function(obj) {
        var data = obj.data;
        var oldId = data.id;
        console.log(data)
        //查看
        if(obj.event === 'change'){
            //确认
            layer.confirm(
                "是否确认?",
                {icon: 3, title:'提示'},
                function(index){
                    var paramDel = {
                        id:oldId,// 主键
                        userId:userId,// 操作人ID
                        userName:userName// 操作人名称
                    };
                    reqAjaxAsync(USER_URL.LOOKDETAIL,JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg("确认升级");
                            layer.close(index);
                            var inx = $(".tab-title li.active").index();
                            var merchantName = $.trim($("#merchantName").val());
                            var createTimeBegin = $("#jurisdiction-begin").val();
                            var createTimeEnd = $("#jurisdiction-end").val();
                            getTable(inx,merchantName,createTimeBegin,createTimeEnd);
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                })
        }
    });

    //已审核相关
    table.on('tool(table)', function(obj) {
        var data = obj.data;
        //查看
        if (obj.event === 'detail') {
            layer.open({
                title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['850px', '590px'],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                end: function () {
                    $('#lookDemo').hide();
                },
                success: function (layero, index) {
                    var param = {
                        id : data.id
                    }
                    reqAjaxAsync(USER_URL.LOOKDETAIL,JSON.stringify(param)).done(function(res){
                        if(res.code == 1){
                            var row = res.data;
                            $("#lookName").val(row.sysUserId);
                            $("#lookpwd").val(row.password);
                            $("#lookdesig").val(row.merchantName);
                            $("#looktype").val('普通');
                            $("#lookguild").val(row.trade);
                            $("#lookbuss").attr("src",row.licenseFront);
                            $("#lookbussback").attr("src",row.licenseBack);
                            $("#lookid").attr("src",row.idCardFront);
                            $("#lookidback").attr("src",row.idCardBack);
                            //省
                            var param = {
                                code : row.provinceId
                            }
                            var req = reqAjax(USER_URL.PROVINCE,JSON.stringify(param)) ;
                            if(req.code == 1){
                                $("#lookprovi").val(req.data.areaname);
                            }else{
                                layer.msg(req.msg);
                            }
                            //市
                            var params = {
                                code : row.cityId
                            }
                            var reqs = reqAjax(USER_URL.PROVINCE,JSON.stringify(params)) ;
                            if(req.code == 1){
                                $("#lookcity").val(reqs.data.areaname);
                            }else{
                                layer.msg(req.msg);
                            }
                        }else{
                            layer.msg(res.msg);
                        }
                    });
                }
            })
        }
    });

    //加了入参的公用方法
    function getTable(type,merchantName,createTimeBegin,createTimeEnd){
        if(type == 0){
            var initPage = objs.tablePage;
            var initTable = objs.tableIns;
            var res = pageCallback(1,1,15,merchantName,createTimeBegin,createTimeEnd);
        }else if(type == 1){
            var initPage = objaa.tablePage;
            var initTable = objaa.tableIns;
            var res = pageCallback(3,1,15,merchantName,createTimeBegin,createTimeEnd);
        }
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
                if(type == 0){
                    var resTwo = pageCallback(1,obj.curr, obj.limit,merchantName,createTimeBegin,createTimeEnd);
                }else if(type == 1){
                    var resTwo = pageCallback(3,obj.curr, obj.limit,merchantName,createTimeBegin,createTimeEnd);
                }
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
        var createTimeBegin = $("#jurisdiction-begin").val();
        var createTimeEnd = $("#jurisdiction-end").val();
        var begintime = $("#datetimepicker1").attr("data-time");
        var endTime = $("#datetimepicker2").attr("data-time");
        if(begintime!=""&&endTime!=""){
            if(begintime>endTime){
                layer.alert("提交时间不能早于注册时间哟");
            }else{
                getTable(inx,merchantName,createTimeBegin,createTimeEnd);
            }
        }else{
            getTable(inx,merchantName,createTimeBegin,createTimeEnd);
        }

    })

    //重置
    $("#toolRelize").click(function(){
        $("#merchantName").val("");
        $("#jurisdiction-begin").val("");
        $("#jurisdiction-end").val("");
        $("#datetimepicker1").attr("data-time","");
        $("#datetimepicker2").attr("data-time","");
        getTbl(0);
        getTbl(1);
    });

    //刷新
    $("#refrshbtn").click(function(){
        location.reload();
    });

})(jQuery);