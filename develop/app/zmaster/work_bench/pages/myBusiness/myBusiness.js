var Xindex = 0;
var myChart = null;
var paramEchart = null;
$(function(){
    $('.first_echar_ul').on('touchstart','li',function (event) {
        event.stopPropagation();
        $(this).addClass('active').siblings().removeClass('active');
        init();
    })
    var dataList={
        year:{x:[],y:[]},
        month:{x:[],y:[]},
    }

    function getAjax(){
        if(!flag){
            return
        }
        var params = {
            userId: userId,
            merchantId:merchantId,
        }
        let defer = $.Deferred();
        reqAjaxAsync(USER_URL.GETDATA,JSON.stringify(params)).done(function (res){
            if(res.code === 1){


                let lists = res.data;
                $('.money1').html('<i>&yen;</i>' + getMoneyFormat(lists.merchantDetials.salePrice))
                $('.money2').html('<i>&yen;</i>' + getMoneyFormat(lists.merchantDetials.consumePrice))
                $('.tit').html(decodeURI(GetQueryString('orgName')))
                // console.log(lists)
                $.each(lists.yearMap,function (name, value) {
                    // console.log(name+':'+value)
                    dataList.year['x'].push(name+'月');
                    dataList.year['y'].push(value);
                })
                let month = res.data.mouth;
                $.each(lists.mouthMap,function (name, value) {
                    // console.log(value)
                    dataList.month['x'].push(month+'.'+name+'日');
                    dataList.month['y'].push(value);
                })
                defer.resolve(res)
            }

        })
        return defer.promise();
    }
    if(flag){
        getAjax().done(function (res) {
         
            init();
        })
    }
   
    function getData(type){
        var data ={};
        if(type == 1){
            data = dataList.year
        }else{
            data = dataList.month
        }
        return data;
    }

    function getChart (h,linew,type) {
        var dom = document.getElementById("first");
        myChart = echarts.init(dom);
        var datas =getData(type);
        var app = {};
        var num = 0;
        if(type == 2){
            num = 3;
        }
        option = null;
        option = {
            grid:{
                // x:60,//距左边
                // x2:10,//距右边
                // y:30,//距上
                left:15,
                top:40,
                bottom:0,
                right:35,
                height:h-100,
                containLabel:false
            },
            // visualMap: {
            //     padding: [5, 0, 5, 0]       // 上右下左
            // },
            legend:{
                // padding: 5,                // 图例内边距，单位px，默认各方向内边距为5，
                //多个线条启用data属性，每个线条的名称
                // data:['邮件营销','邮件营销1','视频广告','视频广告1']
            },
            xAxis: {
                type: 'category',
                data: datas.x,
                boundaryGap: false,
                // x轴的颜色和宽度
                nameLocation:'middle',
                splitLine:{show: false},//去除网格线
                axisLine:{
                    show:false,
                    onZero: false,
                    lineStyle:{
                        color:'#666666',
                        // width:3,   //这里是坐标轴的宽度,可以去掉
                    }
                },
                axisLabel:{
                    // interval:function (index,value) {
                    //     if(value)
                    // },
                    interval:num,//隔几个显示坐标
                    margin:5,//横坐标标签 距离坐标轴的距离
                    fontSize:14,
                    align:'center',
                },
                axisTick:{
                    //刻度
                    onGap:false,
                    show:false
                },

                //网格线
                // splitLine:{
                //     show:true
                // }
            },
            yAxis: {
                type: 'value',
                name:'(人)',
                nameGap: 20,//设置人 字 距离坐标轴的距离
                position:'right',
                splitLine:{show: false},//去除网格线
                nameTextStyle:{
                    padding:[0,0,0,32]//设置  人 字的偏移量
                },
                axisLine:{
                    show:false,

                },
                min:0,
                max: function(value) {
                    return value.max;
                },
                // interval:5,
                minInterval:1,
                axisLabel:{
                    fontSize:14,
                    // formatter: function (value) {
                    //     if(value <5){
                    //         return (value*5).toFixed(0)
                    //     }else{
                    //         return (value).toFixed(0)
                    //     }
                    //     // else if(value <=2){
                    //     //     return (value*5).toFixed(0)
                    //     // }
                    //     // else if(value <=3){
                    //     //     return (value*3.5).toFixed(0)
                    //     // }else if(value <=4){
                    //     //     return (value*2.5).toFixed(0)
                    //     // }else if(value <=5){
                    //     //     return (value*1).toFixed(0)
                    //     // }

                    // }
                },
                axisTick:{
                    show:false,
                },

            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 30,
                minSpan:30,
                // 第一个 dataZoom 组件
                // xAxisIndex: [0] ,// 表示这个 dataZoom 组件控制 第一个 和 第三个 xAxis
                filterMode:'none',
                zoomLock:true,
                throttle:150,//刷新频率
                zoomOnMouseWheel:false,
            }
                ,{  start: 0,
                    end: 0,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }}   //是否 启用手柄样式
            ],
            // toolbox: {
            //     feature: {
            //         saveAsImage: {}
            //     }
            // },
            series: [
                //如果有多个线条的话，就在series数组里面多加几条数据
                {
                    data: datas.y,
                    type: 'line',
                    // smooth: true,
                    symbolSize: 8,//拐点大小
                    symbol:'circle',//拐点样式
                    sampling: 'average',
                    smoothMonotone:'y',
                    clipOverflow:true,
                    animation:true,
                    itemStyle : {
                        normal : {
                            color:'#7b7bcc',//拐点颜色
                            lineStyle:{//折线样式
                                color:'#7b7bcc',
                                width:3,
                                shadowColor: 'rgba(122,120,203,0.4)',
                                shadowBlur: 30,
                                shadowOffsetY: 30,
                                zlevel:9999,
                            },

                        },
                        emphasis:{
                            symbolSize: 20,
                            color:'#7b7bcc',//拐点颜色
                            borderColor:'white',
                            borderWidth:7,
                            zlevel:9999,
                        }
                    },
                }
            ],
            selfButtons:{

            },
            axisPointer:{
                handle:true,
            },
            tooltip:{
                show:true,
                trigger:'axis',
                showContent:true,                           //是否显示提示框浮层
                alwaysShowContent:false,                     //是否永远显示提示框内容
                triggerOn:'click',
                axisPointer:{
                    type:'shadow',
                    color:'#',
                    shadowColor:'rgba(184,211,254,1)',
                    lineStyle:{
                        color:'rgba(184,211,254,1)',//鼠标滑过的竖线
                        width:linew/2,
                        zlevel:-999,

                    },
                    shadowStyle:{
                        color:'rgba(122,120,203,0.1)',//鼠标滑过的竖线
                        width:linew,
                        zlevel:-999,
                    }
                },
                position:function(p, params, dom, rect, size){   //其中p为当前鼠标的位置
                    // console.log(p);
                    // console.log(params)
                    // console.log(size);
                    $(dom).html(`<div class="my-tip"><i class="my-tip-i "></i>${params[0].axisValue +`<br>`+ params[0].value}人</div>`)
                    // console.log($(dom).height())
                    let obj = []
                    if(p[0]+$(dom).width() < size.viewSize[0]){
                        $('.my-tip-i').addClass('my-tip-i-left').removeClass('my-tip-i-right')
                        obj.push(p[0] + 10-$(dom).width())//横坐标
                        obj.push(p[1] - 25-$(dom).height());//纵坐标
                    }else{
                        $('.my-tip-i').addClass('my-tip-i-right').removeClass('my-tip-i-left')
                        obj.push(p[0] -25-$(dom).width())//横坐标
                        obj.push(p[1] + 15-$(dom).height());//纵坐标

                    }


                    return obj;
                },
                formatter: function (params,ticket,callback) {//悬浮框提示
                    // console.log(params)
                    // console.log(ticket)
                    // console.log(callback)
                    // var result = params;
                    paramEchart = params;
                    Xindex = params[0].dataIndex;
                    return params;
                },
                backgroundColor:'#fff',
                padding:5,
                extraCssText:'box-shadow: 0 0 12px rgba(122, 117, 209, 0.5);',//悬浮框添加阴影
                textStyle:{
                    color:'#333'
                }
            },

        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = myChart.resize;

        myChart.on('click', function (param) {
            setTip(param,'showTip')
        });
        myChart.on('mouseover', function (param) {
            setTip(param,'hideTip')
        });
        myChart.on('dataZoom', function (params) {
            myChart.dispatchAction({ //点击 点之后 才显示 提示信息
                type: 'hideTip',
            });

        })
        function setTip(param,type) {
            myChart.dispatchAction({ //点击 点之后 才显示 提示信息
                type: type,
                // 屏幕上的 x 坐标
                x: param.event.offsetX,
                // 屏幕上的 y 坐标
                y: param.event.offsetY,
                // 本次显示 tooltip 的位置。只在本次 action 中生效。
                // 缺省则使用 option 中定义的 tooltip 位置。
            });
        }

    }

    window.addEventListener("resize", function () {
        init();
    });
    function init(){
        var h = $('.echat').height();
        var w =  h*0.2;
        getChart(h,w,$('.first_echar_ul li.active').attr('data-id'));
    }



})