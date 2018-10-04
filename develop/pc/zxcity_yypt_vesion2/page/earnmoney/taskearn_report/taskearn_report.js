Date.prototype.Format = function(fmt){
    var o = {
        "y+" : this.getFullYear(),
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'earnmoney/getTaskearnReportForOperate',//(列表)
            GETCHARTS:'earnmoney/getTaskearnReportForOperate',//获取曲线图
        };
        laydate.render({
            elem:'#date'
            ,range:'至'
            ,theme:'#009688',

        })
        $('#searchBtn').click(function () {
            var time = $('#date').val()
            if(time){
                init_obj();
            }else{
                layer.msg('请选择发布时间')
            }

        })
        $('#restBtn').click(function () {
            $('.header').find('input').val('')
            init_obj()
        })
        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 200
                    }, {
                        title: '任务名称',
                        align: 'left',
                        field: 'tasktitle',
                        width: 224
                    }, {
                        title: '发布人',
                        align: 'left',
                        field: 'userName',
                        width: 224
                    }, {
                        title: '发布时间',
                        align: 'left',
                        field: 'createTime',
                        width: 150,
                    }, {
                        title: '任务佣金',
                        align: 'left',
                        field: 'taskPrice',
                        width: 180,
                    },  {
                        title: '任务需求人数',
                        align: 'left',
                        field: 'taskNeedPerson',
                        width: 180,
                    }, {
                        title: '未发放',
                        align: 'left',
                        field: 'unpay',
                        width: 180,
                    }, {
                        title: '已发放',
                        align: 'left',
                        field: 'payed',
                        width: 180,
                    },{
                        title: '状态',
                        align: 'left',
                        field: 'taskStatusName',
                        width: 100,
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        // 时间格式化


        function getParams(index,limit){
            var time = $('#date').val();
            if(time){
                time = time.split('至')
            }else{
                time=[];
                time[0] = new Date(new Date().getTime()-7*24*3600*1000).Format("yyyy-MM-dd");
                time[1] = new Date().Format("yyyy-MM-dd");
            }
            var params = {
                pagination:{
                    page: index,
                    rows: limit,
                },
                taskTitle:$.trim($('#taskTitle').val()) || '',
                userName:$.trim($('#userName').val()) || '',
                taskStatus:$.trim($('#taskStatus').val()) || '',
                startTime:time[0] || '',
                endTime:time[1] || time[0] || '',
            }
            return params;
        }
        function pageCallback(index, limit) {
            return getData(USER_URL.LISTS, JSON.stringify(getParams(index, limit))).done(function (res) {
                getEcharts(res)
            })
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    res.total = data.total;
                    res.reportMap = data.reportMap
                    res.data = data.taskList;
                    res.totalMap = data.totalMap;
                    var dataList = res.data;
                    $.each(dataList,function (i, item) {
                        item.eq = i+1
                        item.taskStatusName = item.taskStatus == 1?'进行中':'已完成'
                    })
                }else{
                    layer.msg(res.msg)
                }
            })


        }
        var firstCreateTime,firstFinishTime;
        var createTimeArr = [];
        var finishMoneyArr = [];
        var ongoingConMoneyArr = [];
        var ongoingTotalMoneyArr = [];
        function getEcharts(res){
            console.log(res)
            if(res.code == 1){
                var data = res;
                for(var i = 0;i<data.reportMap.length;i++){
                    createTimeArr.push(data.reportMap[i].createTime);
                    finishMoneyArr.push(data.reportMap[i].finishMoney);
                    ongoingConMoneyArr.push(data.reportMap[i].ongoingConMoney);
                    ongoingTotalMoneyArr.push(data.reportMap[i].ongoingTotalMoney);
                }
                // 如果没有数据则默认显示时间
                if(createTimeArr.length == 0){
                    createTimeArr = ["00-00"];
                    finishMoneyArr = ["0"];
                    ongoingConMoneyArr = ["0"];
                    ongoingTotalMoneyArr = ["0"];
                }

                chartsFun(createTimeArr,finishMoneyArr,ongoingConMoneyArr,ongoingTotalMoneyArr);
                // 初始化图表数据
                createTimeArr = [];
                finishMoneyArr = [];
                ongoingConMoneyArr = [];
                ongoingTotalMoneyArr = [];
                startTime = '';
                endTime = '';

                if(data.totalMap != null){
                    $('.finishMoneyTotal').text(data.totalMap.finishMoneyTotal);
                    $('.ongoingConMoneyTotal').text(data.totalMap.ongoingConMoneyTotal);
                    $('.ongoingTotalMoneyTotal').text(data.totalMap.ongoingTotalMoneyTotal);
                }else{
                    $('.finishMoneyTotal').text(0);
                    $('.ongoingConMoneyTotal').text(0);
                    $('.ongoingTotalMoneyTotal').text(0);
                }
            }else{
                layer.msg(data.msg,{"icon":2});
            }
        }

        function chartsFun(createTimeArr,finishMoneyArr,ongoingConMoneyArr,ongoingTotalMoneyArr){
            var myChart = echarts.init(document.getElementById('chart'));
            // 柱状图 宽度 设置
            var barWidth = "35%";
            if(createTimeArr.length == 1){
                barWidth = "5%";
            }else if(createTimeArr.length == 2){
                barWidth = "10%";
            } else if(createTimeArr.length ==3){
                barWidth = "15%";
            }else if(createTimeArr.length == 4){
                barWidth = "20%";
            }else if(createTimeArr.length == 5){
                barWidth = "25%";
            }else if(createTimeArr.length == 6){
                barWidth = "30%";
            }
            option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['已发放金额','未发放金额','已完成总金额'],
                    left: 0,
                    top:-5
                },
                grid: {
                    left:0,
                    top: 50,
                    right: 30,
                    bottom: 20,
                    containLabel: true
                },
                xAxis : [{
                    type : 'category',
                    data : createTimeArr
                }],
                yAxis : [{
                    type : 'value',
                    scale: true,
                    name: '金额'
                }],
                series : [{
                    name:'已发放金额',
                    type:'bar',
                    stack: '发放情况',
                    itemStyle: {
                        normal: {
                            color: '#366886'
                        }
                    },
                    data: ongoingConMoneyArr,
                    barGap : '0.1%',
                    barWidth: barWidth,
                },{
                    name:'未发放金额',
                    type:'bar',
                    stack: '发放情况',
                    itemStyle: {
                        normal: {
                            color: '#59aff9'
                        }
                    },
                    data:ongoingTotalMoneyArr,
                    barGap : '0.1%',
                    barWidth: barWidth,
                },{
                    name:'已完成总金额',
                    type:'bar',
                    barWidth: barWidth,
                    stack: '完成',
                    itemStyle: {
                        normal: {
                            color: '#49d2cc'
                        }
                    },
                    data:finishMoneyArr,
                    barWidth: barWidth,
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    })


})

