(function($){
    var page=1;
    var rows=10;
    var userNo = yyCache.get("userno","");
    var workNo = sessionStorage.getItem("workphone") || "";
    var nimToken = yyCache.get("nimToken");

    var day1 = new Date();
    day1.setDate(day1.getDate() - 1);
    var yesteaday = day1.format("yyyy-MM-dd");
    //七天
    var day2 = new Date();
    day2.setDate(day2.getDate() - 7);
    var sevenTime = day2.format("yyyy-MM-dd");
    var USER_URL =  {
        RESOURLIST : 'operations/statisticsOverview' //(总量统计)
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;

    });


    $(function(){
        getSum(yesteaday,yesteaday);
        /*templeTable(yesteaday,yesteaday,"laypageLeft",'table',USER_URL.QUERYLIST,1);
        templeTable(yesteaday,yesteaday,"laypageRgt",'tableOrder',USER_URL.RANKING);*/
    })

    //报表
    function templeTable(beginTime,endTime,test,e,cmd,type){
        if(type==1){ //总量表
            var obj = tableInit(e, [
                    [
                        {
                            title: '日期',
                            /*sort: true,*/
                            align: 'left',
                            field: '日期',
                            width: 200
                        }, {
                        title: '呼入总量',
                        /*sort: true,*/
                        align: 'left',
                        width: 100,
                        field: '呼入总量'
                    }, {
                        title: '呼出总量',
                        /*sort: true,*/
                        align: 'left',
                        field: '呼出总量',
                        width: 200
                    }, {
                        title: '呼损总量',
                        /*sort: true,*/
                        align: 'left',
                        field: '呼损总量',
                        width: 150
                    }, {
                        title: '平均通话时长',
                        /*sort: true,*/
                        align: 'left',
                        field: '平均通话时长',
                        width: 100
                    }, {
                        title: '平均排队时长',
                        /*sort: true,*/
                        align: 'left',
                        field: '平均排队时长',
                        width: 100
                    }, {
                        title: '平均处理时长',
                        /*sort: true,*/
                        align: 'left',
                        field: '平均处理时长',
                        width: 100
                    }, {
                        title: '满意度',
                        /*sort: true,*/
                        align: 'left',
                        field: '满意度',
                        width: 100
                    }]
                ],
                pageCallback,test,beginTime,endTime
            );
        }else{ //地域
            var obj = tableInit(e, [
                    [
                        {
                            title: '排名',
                            /*sort: true,*/
                            align: 'left',
                            field: '排名',
                            width: 200
                        }, {
                        title: '区域编码',
                        /*sort: true,*/
                        align: 'left',
                        width: 100,
                        field: '区域编码'
                    }, {
                        title: '区域名称',
                        /*sort: true,*/
                        align: 'left',
                        field: '区域名称',
                        width: 200
                    }, {
                        title: '接待数',
                        /*sort: true,*/
                        align: 'left',
                        field: '接待数',
                        width: 150
                    }, {
                        title: '占比',
                        /*sort: true,*/
                        align: 'left',
                        field: '占比',
                        width: 100
                    }]
                ],
                pageCallback,test,beginTime,endTime
            );
        }

    }

//加了入参的公用方法
    function tableInit(tableId, cols, pageCallback, test,beginTime,endTime,cmd) {
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
        var res = pageCallback(page, rows,beginTime,endTime);
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
                var resTwo = pageCallback(obj.curr, obj.limit,beginTime,endTime);
                if(resTwo && resTwo.code == 1){
                    tableIns.reload({
                        data: resTwo.data || []
                    });
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
    function pageCallback(index, limit,beginTime,endTime,cmd,type) {
        if(type==1){
            var param = {
                "page": index,
                "rows": limit,
                "beginTime": beginTime + ' 0:0:0',
                "endTime": endTime + ' 23:59:59'
            }
        }else{//地域不传参
            var param = {
                "page": index,
                "rows": limit
            }
        }

        return getData(cmd, JSON.stringify(param));
    }

    //统计总量
    function getSum(beginTime,endTime){
        var param = {
            "startTime": beginTime + ' 0:0:0',
            "endTime": endTime + ' 23:59:59'
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).then(function(res){
            if(res.code==1){
                var row = res.data;
                $(".stat-box li").eq(0).find(".stat-num").text(row.incallNum);
                $(".stat-box li").eq(1).find(".stat-num").text(row.outcallNum);
                $(".stat-box li").eq(2).find(".stat-num").text(row.notAnswering);
                $(".stat-box li").eq(3).find(".stat-num").text(row.avgBillsec);
                $(".stat-box li").eq(4).find(".stat-num").text(row.avglineupNum);
                $(".stat-box li").eq(5).find(".stat-num").text(row.avgHandleTime);
                $(".stat-box li").eq(6).find(".stat-num").text(row.avgSatisfaction);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //下拉菜单
    $(".content-body").on("click",".downNav li",function(){
        var index = $(this).index();
        var val = $(this).text();
        $(this).siblings().removeClass("acv");
        $(this).addClass("acv");
        $(".selectVal").text(val);
        if(index==0){

            $(".dropdow-menu").hide();
            getSum(yesteaday,yesteaday);
           // templeTable(yesteaday,yesteaday,"laypageLeft",'table',USER_URL.QUERYLIST,1);
        }else if(index==1){
            $(".dropdow-menu").hide();
            getSum(yesteaday,yesteaday);
           // templeTable(sevenTime,yesteaday,"laypageLeft",'table',USER_URL.QUERYLIST,1);
        }
    });

    $(".sure").on("click",function(){
        dataSure();
    });

    //下拉的时间范围确认
    function dataSure(){
        var begin = $(".jurisdiction-begin2").val();
        var end = $(".jurisdiction-begin3").val();
        var beginval = $(".datetimepicker2").attr("data-time");
        var endval = $(".datetimepicker3").attr("data-time");
        if(begin!=""&&end!=""){
            if(beginval>endval){
                layer.msg("开始时间不能晚于结束时间哟");
            }else{
                if(endval-beginval>31536000000){
                    layer.msg("时间范围不能超过一年哟");
                }else{
                    $(".dropdow-menu").hide();
                    $(".selectVal").text(begin+'--'+end);
                    $(".downNav li").removeClass("acv");
                    getSum(yesteaday,yesteaday);
                  //  templeTable(begin,end,"laypageLeft",'table',USER_URL.QUERYLIST,1);
                }
            }
        }else{
            layer.msg("请选择开始时间和结束时间");
        }
    }


})(jQuery);