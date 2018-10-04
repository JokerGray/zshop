(function($){
    var page = 1;
    var rows = 5;
    var day1 = new Date();
    day1.setDate(day1.getDate() - 1);
    var yesteaday = day1.format("yyyy-MM-dd");
    //七天
    var day2 = new Date();
    day2.setDate(day2.getDate() - 7);
    var sevenTime = day2.format("yyyy-MM-dd");
    var USER_URL =  {
        RESOURLIST : 'operations/serviceGroupTicketStatics', //客服组
        SINGLIST:'operations/serviceTicketStatics' //客服
    };
    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;

    });


    $(function(){
        templeTable(yesteaday,yesteaday,"laypageLeft",'table',1);
        templeTable(yesteaday,yesteaday,"laypageLeft1",'table1',2);
    })

    //报表
    function templeTable(beginTime,endTime,test,e,type){
        if(type==1){
            var obj = tableInit(e, [
                    [
                        {
                            title: '客服组',
                            /*sort: true,*/
                            align: 'left',
                            field: '客服组',
                            width: 200
                        }, {
                        title: '客服名',
                        /*sort: true,*/
                        align: 'left',
                        width: 100,
                        field: '客服名'
                    }, {
                        title: '建工单量',
                        /*sort: true,*/
                        align: 'left',
                        field: '建工单量',
                        width: 200
                    }, {
                        title: '处理中工作量',
                        /*sort: true,*/
                        align: 'left',
                        field: '处理中工作量',
                        width: 150
                    }, {
                        title: '已解决工作量',
                        /*sort: true,*/
                        align: 'left',
                        field: '已解决工作量',
                        width: 150
                    }, {
                        title: '不予处理工作量',
                        /*sort: true,*/
                        align: 'left',
                        field: '不予处理工作量',
                        width: 150
                    }, {
                        title: '平均处理时长',
                        /*sort: true,*/
                        align: 'left',
                        field: '平均处理时长',
                        fixed: 'right',
                        width: 150
                    }]
                ],
                pageCallback,test,beginTime,endTime,type
            );
        }else{
            var obj = tableInit(e, [
                    [
                        {
                            title: '客服组',
                            /*sort: true,*/
                            align: 'left',
                            field: '客服组',
                            width: 200
                        }, {
                        title: '客服名',
                        /*sort: true,*/
                        align: 'left',
                        width: 100,
                        field: '客服名'
                    }, {
                        title: '建工单量',
                        /*sort: true,*/
                        align: 'left',
                        field: '建工单量',
                        width: 200
                    }, {
                        title: '处理中工作量',
                        /*sort: true,*/
                        align: 'left',
                        field: '处理中工作量',
                        width: 150
                    }, {
                        title: '已解决工作量',
                        /*sort: true,*/
                        align: 'left',
                        field: '已解决工作量',
                        width: 150
                    }, {
                        title: '不予处理工作量',
                        /*sort: true,*/
                        align: 'left',
                        field: '不予处理工作量',
                        width: 150
                    }, {
                        title: '平均处理时长',
                        /*sort: true,*/
                        align: 'left',
                        field: '平均处理时长',
                        fixed: 'right',
                        width: 150
                    }]
                ],
                pageCallback,test,beginTime,endTime,type
            );
        }



    }

//加了入参的公用方法
    function tableInit(tableId, cols, pageCallback, test,beginTime,endTime,type) {
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
        var res = pageCallback(page, rows,beginTime,endTime,type);
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
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            limit: rows
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                var resTwo = pageCallback(obj.curr, obj.limit,beginTime,endTime,type);
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
    function pageCallback(index, limit,beginTime,endTime,type) {
        var param = {
            "page": index,
            "rows": limit,
            "beginTime": beginTime + ' 0:0:0',
            "endTime": endTime + ' 23:59:59'
        }
        if(type==1){
            return getData(USER_URL.RESOURLIST, JSON.stringify(param));
        }else{
            return getData(USER_URL.SINGLIST, JSON.stringify(param));
        }

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
            templeTable(yesteaday,yesteaday,"laypageLeft",'table',1);
            templeTable(yesteaday,yesteaday,"laypageLeft1",'table1',2);
        }else if(index==1){
            $(".dropdow-menu").hide();
            templeTable(sevenTime,yesteaday,"laypageLeft",'table',1);
            templeTable(sevenTime,yesteaday,"laypageLeft1",'table1',2);
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
                    templeTable(begin,end,"laypageLeft",'table',1);
                    templeTable(begin,end,"laypageLeft1",'table1',2);
                }
            }
        }else{
            layer.msg("请选择开始时间和结束时间");
        }
    }

    //子页面滚动条隐藏
    $("body").niceScroll({
        cursorcolor:"#dfdfdf",
        cursorborder:"0",
        autohidemode:true,
        iframeautoresize: true // 在加载事件时自动重置iframe大小
    });
})(jQuery);