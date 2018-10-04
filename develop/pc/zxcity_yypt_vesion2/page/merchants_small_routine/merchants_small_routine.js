$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            RESOURLIST : 'operations/selAllRegApplyByProvince', //地图
            YEARLIST:'operations/selAllRegApplyByYear',//折线图
        };
        //时间控件
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#009688'
        });
        //时间控件
        laydate.render({
            elem: '#date2'
            // ,type: 'datetime'
            ,type: 'year'
        });

        $('#searchBtn').click(function () {
            if($('#date').val() == ''){
                return
            }
            getSeriesArr().done(function (res) {
                init(res.arr)
            });
        })
        $('#restBtn').click(function () {
            if($('#date').val() == ''){
                return
            }
            $('#date').val('');
            getSeriesArr().done(function (res) {
                init(res.arr)
            });
        })

        $('#searchBtn2').click(function () {
            if($('#date2').val() == ''){
                return
            }
            getYearArr().done(function (res) {
                init2(res.arr)
            });
        })
        $('#restBtn2').click(function () {
            if($('#date2').val() == ''){
                return
            }
            $('#date2').val('');
            getYearArr().done(function (res) {
                init2(res.arr)
            });
        })

        var myChart= null,myChart2=null;

        function init(data) {
            myChart = echarts.init(document.getElementById('eChart'));;
            myChart.setOption(getOption(data))
            // window.onresize = myChart.resize;
        }
        function init2(data) {
            myChart2 = echarts.init(document.getElementById('eChart2'));;
            myChart2.setOption(getOption2(data))
        }

        function getSeriesArr(){
            var deff = $.Deferred();
            var time = $('#date').val().split(' 至 ')
            var params ={
                createStartTime:time[0] || '',
                createEndTime:time[1] || time[0] || '',
            }
            reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    var arr = [];
                    var datas = res.data;

                    var previce= res.dataExpansion;
                    $.each(previce,function (i,item) {
                        if(item == '内蒙'){
                            previce[i] = '内蒙古'
                        }
                        if(item == '黑龙'){
                            previce[i]  = '黑龙江'
                        }
                    })
                    console.log(res)
                    var data={}
                    $.each(datas,function (i,item) {
                        data = {name:previce[item.provinceId],value:item.count },
                        arr[i]= data
                    })
                    // arr.push({ name:"南海诸岛",value:0,
                    //     itemStyle:{
                    //     normal:{opacity:0,label:{show:false}}
                    // }})
                    res.arr=arr;
                    deff.resolve(res);
                }else{
                    layer.msg(res.msg)
                }
            })
            return deff.promise();
        }
        function getYearArr(){
            var deff = $.Deferred();
            var params={
                year: $('#date2').val()|| 0
            }

            reqAjaxAsync(USER_URL.YEARLIST,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    var arr = [];
                    var datas = res.data;
                    $.each(datas,function (i, item) {
                        arr.push(item)
                    })
                    res.arr =arr;
                    deff.resolve(res)
                }
            })
            return deff.promise();
        }
        getYearArr().done(function (res) {
            init2(res.arr)
        })
        getSeriesArr().done(function (res) {
            init(res.arr)
        });
        function getOption(data) {
            return  {
                color: ['#009688'],
                grid:{
                    right:'4%'
                },
                title: {
                    text: '小程序商户区域注册统计分布图',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data:['商户注册量']
                },
                visualMap: {
                    min: 0,
                    max: 50,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: true,
                    inRange: {
                        color: ['#cdf1ed', '#009688'],
                    }
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: {
                    name:'商户注册量',
                    type:'map',
                    map:'china',
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:data
                }
            };
        }
        function getOption2(data){
            return{
                color: ['#009688'],
                grid:{
                    right:'4%'
                },
                title: {
                    text: '小程序商户注册月统计折线图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left: 'left',
                    data:['商户注册量']
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    symbolSize:10,
                    name:'商户注册量',
                    data: data,
                    type: 'line',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                width:4,//折线宽度
                            }
                        }
                    },
                }]
            };

        }
    })

})

