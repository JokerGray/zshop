(function($){
    var userNo = yyCache.get("userno","");
    var workNo = sessionStorage.getItem("workphone") || "";
    var nimToken = yyCache.get("nimToken");
    //昨天的时间
    var day1 = new Date();
    day1.setDate(day1.getDate() - 1);
    var yesteaday = day1.format("yyyy-MM-dd");
    //七天
    var day2 = new Date();
    day2.setDate(day2.getDate() - 7);
    var sevenTime = day2.format("yyyy-MM-dd");
    var USER_URL =  {
        RESOURLIST : 'operations/ticketSumAnalysis', //(工单分析顶部)
        EACHEATS : 'operations/ticketAnalysisByTime' //(工单分析图表)
    };


    $(function(){
        intLine('myEchars',yesteaday,yesteaday);
        getData(yesteaday,yesteaday);
    })


    var worldMapContainer = document.getElementById('myEchars');
    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
    var resizeWorldMapContainer = function () {
        worldMapContainer.style.width = (window.innerWidth)/2+'px';
    };
    //设置容器高宽
   // resizeWorldMapContainer();

    //客户统计折线图
   function intLine(e,beginTime,endTime){
        var xAxisData = [];
        var ordering = [];
       var noOrder = [];
       var overOrder = [];
       var newOrder = [];
           var parms = {
               "beginTime":beginTime + ' 0:0:0',
               "endTime":endTime + ' 23:59:59'
           };
        reqAjaxAsync(USER_URL.EACHEATS,JSON.stringify(parms)).then(function(res){
        var data = res.data;
        if(data.length>0){
            $(".nodata").hide();
            $(".down-list-box").show();
            for(var k=data.length-1;0<=k&&k<=data.length;k--){
                newOrder.push(data[k].新建工单量);
                noOrder.push(data[k].不予处理工单量);
                overOrder.push(data[k].已解决工单量);
                ordering.push(data[k].处理中工单量);
                xAxisData.push(data[k].DT)
            }

            var myEchars = echarts.init(document.getElementById(e));
            var option = {
                title : {
                    text: '工单分析图表',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#fff'
                        }
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        magicType : {show: true, type:['line', 'bar']
                        },
                        restore : {show: true}
                    },
                    right:150
                },
                calculable : true,
                legend: {
                    data:['新建工单量','处理中工单量','已解决工单量','不予处理工单量']
                },
                grid: {
                    left: '3%',
                    right:'3%'
                   /* bottom: '3%'*/
                },
                xAxis: {
                    type: 'category',
                  /*  boundaryGap: false,*/
                    data: xAxisData,
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    axisTick: {
                        show: true
                    },axisLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    }
                },

                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        },
                        interval:0
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#eee',
                            width:1
                        }
                    }
                },
                series: [{
                    type: 'line',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color:  function(params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true
                            },
                            lineStyle: {
                                color: '#B5C334'
                            }
                        }
                    }

                },{
                    name:'新建工单量',
                    type:'line',
                    data:newOrder,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }

                },{
                    name:'处理中工单量',
                    type:'line',
                    data:ordering,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }

                },{
                    name:'已解决工单量',
                    type:'line',
                    data:overOrder,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }

                },{
                    name:'不予处理工单量',
                    type:'line',
                    data:noOrder,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }

                }]

            }
            myEchars.setOption(option);
            $(window).resize(function () {          //当浏览器大小变化时
                resizeWorldMapContainer();
                myEchars.resize();
            });
        }else{
            $(".nodata").show();
            $(".down-list-box").hide();
        }
    })
  }

    //统计数据接口
    function getData(begintime,endtime){
        var param = {
            "beginTime":begintime + ' 0:0:0',
            "endTime":endtime + ' 23:59:59'
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).then(function(res){
            if(res.code==1){
                var row = res.data;
                $(".down-content .down-list").eq(0).find(".list-num").text(row.新建工单量 || 0);
                $(".down-content .down-list").eq(1).find(".list-num").text(row.处理中工单量 || 0);
                $(".down-content .down-list").eq(2).find(".list-num").text(row.已解决工单量 || 0);
                $(".down-content .down-list").eq(3).find(".list-num").text(row.不予处理工单量 || 0);
                $(".down-content .down-list").eq(4).find(".list-num").text(row.平均响应时长 || 0);
                $(".down-content .down-list").eq(5).find(".list-num").text(row.平均处理时长 || 0);
            }else{
                layer.msg(res.msg);
            }
        })
    }



    //下拉菜单
    $("#downNav").on("click","li",function(){
        var index = $(this).index();
        var val = $(this).text();
        $("#downNav li").removeClass("acv");
        $(this).addClass("acv");
        if(index==0){
            $("#selectVal").text(val);
            $(".dropdow-menu").hide();
            getData(yesteaday,yesteaday);
            intLine('myEchars',"2",yesteaday,yesteaday);
        }else if(index==1){
            $("#selectVal").text(val);
            $(".dropdow-menu").hide();
            getData(sevenTime,yesteaday);
            intLine('myEchars',"2",sevenTime,yesteaday);
        }
    });

    $(".sure").click(function(){
        dataSure();
    });

    //下拉的时间范围确认
    function dataSure(){
        var begin = $("#jurisdiction-begin2").val();
        var end = $("#jurisdiction-begin3").val();
        var beginval = $("#datetimepicker2").attr("data-time");
        var endval = $("#datetimepicker3").attr("data-time");
        if(begin!=""&&end!=""){
            if(beginval>endval){
                layer.msg("开始时间不能晚于结束时间哟");
            }else{
                if(endval-beginval>31536000000){
                    layer.msg("时间范围不能超过一年哟");
                }else{
                    $(".dropdow-menu").hide();
                    $("#selectVal").text(begin+'--'+end);
                    getData(begin,end);
                    $("#downNav li").removeClass("acv");
                    intLine('myEchars',"2",begin,end);//需要执行的事件
                }
            }
        }else{
            layer.msg("请选择开始时间和结束时间");
        }
    }
})(jQuery);