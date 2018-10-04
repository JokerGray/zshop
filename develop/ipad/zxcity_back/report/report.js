//大菜单切换
$(".main-tab .tab-inner .tab-item").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    var dataRel = $(this).attr("data-rel");
    $(".main-content .sub-content."+dataRel).removeClass("hidden").siblings().addClass("hidden");
    init(dataRel);
});

//营业额子菜单切换
$(".turnover .sub-tab .btn").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    var _type = $(this).attr("data-type");
    alert(_type);
});

//畅销商品子菜单切换
$(".best-selling .sub-tab .btn").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    var _type = $(this).attr("data-type");
    alert(_type);
});

//营业额报表数据时间类型切换
$(".turnover .statistical-box .selector .dropdown-menu>li>a").click(function(){
    var parentId = $(this).parents("li.statistical-item").attr("id");
    var timeTxt = $(this).text();
    $(this).parents(".selector").find(".txt").text(timeTxt);
    var _timetype = $(this).attr("data-timetype");
    alert(parentId+","+timeTxt+","+_timetype);
});

//营业额柱状图时间类型切换
$(".turnover .chart-box .chart-selector .btn").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    var _timetype = $(this).attr("data-timetype");
    alert(_timetype);
});

//
function init(dataRel){
    if(dataRel == "turnover"){

    }else if(dataRel == "best-selling"){

    }else if(dataRel == "settlement"){
        loadPie();
    }
}

function loadPie(){
    var option = {
        title : '',
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            itemWidth:36,
            itemHeight:36,
            textStyle:{
                fontSize:24
            },
            data: ['已结算','未结算','已退款']
        },
        series : [
            {
                type: 'pie',
                name: '金额',
                selectedMode:'single',
                radius : '55%',
                center: ['50%', '60%'],
                label:{
                    normal:{
                        textStyle:{
                            fontSize:24
                        }
                    }
                },
                data:[
                    {value:30, name:'已结算',selected:true,itemStyle: {normal: {color: '#3fbe39'}}},
                    {value:20, name:'未结算',itemStyle: {normal: {color: '#fda359'}}},
                    {value:10, name:'已退款',itemStyle: {normal: {color: '#53cbf8'}}}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var settlementChart = echarts.init(document.getElementById('settlementChart'));
    settlementChart.setOption(option);

    //点击饼状图
    settlementChart.on("click", function(params){
        //console.log(params);
        if(params.name == "已结算"){
            $("#settlementList").addClass("list1").removeClass("list2, list3");
            alert("已结算");
        }else if(params.name == "未结算"){
            $("#settlementList").addClass("list2").removeClass("list1, list3");
            alert("未结算");
        }else if(params.name == "已退款"){
            $("#settlementList").addClass("list3").removeClass("list1, list2");
            alert("已退款");
        }
    });


}
