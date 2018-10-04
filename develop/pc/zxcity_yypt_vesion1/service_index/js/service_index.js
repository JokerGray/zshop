(function($){
    var userNo = yyCache.get("userno","");
    var workNo = sessionStorage.getItem("workphone") || "";
    var nimToken = yyCache.get("nimToken");
    var userid = yyCache.get("userId");

    var USER_URL =  {
        RESOURLIST : 'operations/answeredWithInNDays', //(N天之内的接听量)
        QUERYLIST : 'operations/totalStatics', //(通话总量统计)
        LOGINSERVICE : 'operations/loginCustomerServiceAddOnline',   //客服登陆在线状态
        COUNT:'operations/TicketKnowledgeFeedback3In1' //数据统计
    };


    $(function(){
        intLine('myEchars',"0");
        getSum("0");
        getCount();
        if(!nimToken){
            $("#webicon").addClass("acv");
            $("#webicon").next("span").css("color","#dfdfdf");
        }
    })

    var worldMapContainer = document.getElementById('myEchars');
    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
    var resizeWorldMapContainer = function () {
        worldMapContainer.style.width = (window.innerWidth)/2+'px';
    };
    //设置容器高宽
   // resizeWorldMapContainer();

    //客户统计折线图
   function intLine(e,type,beginTime,endTime){
        var xAxisData = [];
        var seriesData = [];
       if(type==0){
           var parms = {
               "days": "7",
               "beginTime": "",
               "endTime": "",
               "workNo": workNo,
               "type": type// 0 周 1 月 2 指定日期范围(使用beginTime和endTime)
           };
       }else if(type==1){
           var parms = {
               "days": "30",
               "beginTime": "",
               "endTime": "",
               "workNo": workNo,
               "type": type// 0 周 1 月 2 指定日期范围(使用beginTime和endTime)
           };
       }else{
           var parms = {
               "days": "",
               "beginTime": beginTime,
               "endTime": endTime,
               "workNo": workNo,
               "type": type// 0 周 1 月 2 指定日期范围(使用beginTime和endTime)
           };
       }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(parms)).then(function(res){
        var data = res.data;
            console.log(seriesData)
            for(var k=data.length-1;0<=k&&k<=data.length;k--){
                    seriesData.push(data[k].total);
                     xAxisData.push(data[k].date)

            }
            console.log(xAxisData)

        var myEchars = echarts.init(document.getElementById(e));
        var option = {
            title : {
                text: '会话量',
                trigger: 'axis',
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
              data:['总量']
            },
            grid: {
                left: '3%',
                right:'3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
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
                data:seriesData,
                name:"会话时长",
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

            }]

        }
        myEchars.setOption(option);
       $(window).resize(function () {          //当浏览器大小变化时
           resizeWorldMapContainer();
           myEchars.resize();
       });
    })
  }

    //右侧统计总量
    function getSum(type,beginTime,endTime){
        if(type==0){
            var parms = {
                "days": "7",
                "beginTime": "",
                "endTime": "",
                "workNo": workNo,
                "type": type// 0 周 1 月 2 指定日期范围(使用beginTime和endTime)
            };
        }else if(type==1){
            var parms = {
                "days": "30",
                "beginTime": "",
                "endTime": "",
                "workNo": workNo,
                "type": type// 0 周 1 月 2 指定日期范围(使用beginTime和endTime)
            };
        }else{
            var parms = {
                "days": "",
                "beginTime": beginTime,
                "endTime": endTime,
                "workNo": workNo,
                "type": type// 0 周 1 月 2 指定日期范围(使用beginTime和endTime)
            };
        }
        reqAjaxAsync(USER_URL.QUERYLIST,JSON.stringify(parms)).done(function(res) {
            if (res.code == 1) {
                $(".content-right").find(".numlist").eq(0).find("span").text(res.data.totalAnswered);
                $(".content-right").find(".numlist").eq(1).find("span").text(res.data.totalMessage);
                $(".content-right").find(".numlist").eq(2).find("span").text(res.data.totalTime);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //下侧统计数据
    function getCount(){
        var param = {
            "userId":userid
        }
        reqAjaxAsync(USER_URL.COUNT,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var row = res.data;
                $(".adverse ul li").eq(0).find("span").text(row.f_overCount);
                $(".adverse ul li").eq(1).find("span").text(row.f_todoCount);
                $(".knowledge ul li").eq(0).find("span").text(row.k_unkownCount);
                $(".knowledge ul li").eq(1).find("span").text(row.k_totalCount);
                $(".order ul li").eq(0).find("span").text(row.t_newCount);
                $(".order ul li").eq(1).find("span").text(row.t_overCount);
                $(".order ul li").eq(2).find("span").text(row.t_todoCount);
                $(".online-box ul li").eq(0).find("span").text(row.c_totalCount);
                $(".online-box ul li").eq(1).find("span").text(row.c_onlineCount);
                $(".online-box ul li").eq(2).find("span").text(row.c_offlineCount);
                $(".online-box ul li").eq(3).find("span").text(row.c_teleTotalCount);
                $(".online-box ul li").eq(4).find("span").text(row.c_teleOnlineCount);
                $(".online-box ul li").eq(5).find("span").text(row.c_teleOfflineCount);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //查看更多
    $(".look-all").on("click",function(){
        window.top.admin.current("statement_data/statement_data.html?v=" + new Date().getMilliseconds());
    });

})(jQuery);