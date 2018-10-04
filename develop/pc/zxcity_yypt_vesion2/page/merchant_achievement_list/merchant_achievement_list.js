$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laydate=layui.laydate,laypage=layui.laypage;
        form.render();
        var ression = {};
        var AREA = ['90%', '90%'];
        var TITLE = ['实名认证信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var imgPath = '../../common/images/placeholder.png';
        var USER_URL = {
            SHOP: 'operations/getscMultipleShopConfigureListByLevel', //店铺名
            TOTALLIST:'operations/getUserSumDataListByMerchantId',//业绩列表
            LOOK:'operations/getUserSumDataPageListByUserId'//查看
        };
        // 时间控件
        laydate.render({
            elem: '#jurisdiction-begin',
            done:function(value,date){
                $(this.elem).attr('data-time',Date.parse(value) || '')
            }
        });
        laydate.render({
            elem: '#jurisdiction-end',
            done:function(value,date){
                $(this.elem).attr('data-time',Date.parse(value) || '')
            }
        });
        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        })
        $('.zImg').click(function(){
            var src = $(this).prop('src');
            window.open(src);
        })
        //搜索条件进行搜索
        $('#toolSearch').on('click', function() {
            var begintime = $("#jurisdiction-begin").attr("data-time");
            var endTime = $("#jurisdiction-end").attr("data-time");
            if(begintime != "" && endTime != "") {
                if(begintime > endTime) {
                    layer.alert("截至时间不能早于开始时间哟");
                } else {
                    getTable()
                }
            } else {
                getTable();
            }
        })
        //重置
        $("#toolRelize").click(function() {
           $('.input-box').find('input,select').val('').attr("data-time",'')
            form.render();
            getTable()
        });
        function shop(){
            var parm={
                level:3
            };
            reqAjaxAsync(USER_URL.SHOP,JSON.stringify(parm)).then(function(res){
                var data=res.data;

                var mHtml='<option value="">--请选择--</option>';
                for(var i=0;i<data.length;i++){
                    mHtml+='<option value="'+data[i].merchantId+'">'+data[i].name+'</option>'
                };
                $('#shop').html(mHtml);
                form.render();
            });
        };
        shop()
        //表格
        function tableInit(tableId, cols, pageCallback, pageLeft,type) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                // height: 'full-185',
                cols: cols,
                page: false,
                even: true,
                skin: 'row',
                limit: 15
            });

            //2.第一次加载
            if(type){
                var res = pageCallback(1, 15,type);
            }else{
                var res = pageCallback(1, 15);
            }

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
            var page_options = {
                elem: pageLeft,
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
                limits: [15, 30],
                limit: 15
            }
            page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit);
                    if(resTwo && resTwo.code == 1)
                        tableIns.reload({
                            data: resTwo.data,
                            limit:obj.limit
                        });
                    else
                        layer.msg(resTwo.msg);
                }
            }

            laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
        }
        //渲染表格
        function init_obj(type) {
            let objs;
            if(!type){
                objs = tableInit('tableNo', [
                        [{
                            title: '序号',
                            align: 'left',
                            field: 'eq',
                            width: 80
                        }, {
                            title: '员工姓名',
                            align: 'left',
                            field: 'userName',
                            width: 150
                        }, {
                            title: '业绩总额',
                            align: 'left',
                            field: 'achPay',
                            width: 150
                        },{
                            title: '操作',
                            fixed: 'right',
                            align: 'left',
                            toolbar: '#barDemo',
                            width: 250
                        }
                        ]
                    ],

                    pageCallback, 'laypageLeft'
                );
            }else{
                objs = tableInit('tableLayer', [
                        [{
                            title: '序号',
                            align: 'left',
                            field: 'eq',
                            width: 80
                        }, {
                            title: '员工姓名',
                            align: 'left',
                            field: 'userName',
                            width: 150
                        }, {
                            title: '业绩总额',
                            align: 'left',
                            field: 'achPay',
                            width: 150
                        }, {
                            title: '业绩生产时间',
                            align: 'left',
                            field: 'achTime',
                            width: 240
                        }, {
                            title: '业绩比(百分比)',
                            align: 'left',
                            field: 'percent',
                            width: 150
                        }
                        ]
                    ],

                    pageCallback, 'laypageLeftLayer',type
                );
            }

        }
        getTable()
        //回调
        //pageCallback回调
        function pageCallback(index, limit,type) {
            /***开始***/
            //默认 赋值 时间为当前月份
            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            var endDate = new Date(firstDate);
            endDate.setMonth(firstDate.getMonth()+1);
            endDate.setDate(0);
            var achType = $("#achType").val()||"";
            var startDate = $("#jurisdiction-begin").val() || new Date(firstDate).toJSON().slice(0,10)
            endDate = $("#jurisdiction-end").val() || new Date(endDate).toJSON().slice(0,10)
            /***结束***/

            if(!type){
                var param = {
                    page: index,
                    rows: limit,
                    merchantId: 1070, //店
                    achType:achType,//业绩类型
                    startDate:startDate,//开始时间
                    endDate:endDate//结束时间
                };
                return getData(USER_URL.TOTALLIST, JSON.stringify(param));
            }else{
                var userId =sessionStorage.getItem('userId') ;
                var param = {
                    page: index,
                    rows: limit,
                    userId: userId, //店
                    achType:achType,//业绩类型
                    startDate:startDate,//开始时间
                    endDate:endDate//结束时间
                }
                return getData(USER_URL.LOOK, JSON.stringify(param),type);
            }

        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms,type) {
            var res = reqAjax(url, parms);
            var data = res.data;
            var total=sessionStorage.getItem('total');
            console.log(data);
            if(res.code==1){
                var data = res.data;

                $.each(data, function(i, item) {
                    $(item).attr('eq', (i + 1));
                    if(type){
                        $(item).attr('percent',Percentage(item.achPay,total))
                    }
                });
                if(!type){
                    ression = res;
                }
                return res;
            }else{
                layer.msg(res.msg);
            };
        }
        //运算百分比
        function Percentage(num, total) {
            return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
        }
        table.on('tool(tableNo)', function(obj) {
            var data = obj.data;
            var user_id = data.userId;
            var demo = $('#demo111')
            sessionStorage.setItem('userId',user_id);
            sessionStorage.setItem('total',data.achPay);
            console.log(obj);
            //查看
            if(obj.event === 'detail'){
                var paramInfo = "{'appUserId':'" + user_id + "'}";
                var res =reqAjax(USER_URL.GETAUDITDETAILS,paramInfo);
                var data = res.data;
                console.log(data)
                layer.open({
                    title:TITLE,
                    area:AREA,
                    type: 1,
                    btn:['确定'],
                    content:demo,
                    shade:SHADE,
                    end:function (index) {
                        layer.close(index)
                    },
                    success:function () {
                        init_obj(1)
                    },yes:function (index) {
                        layer.close(index)
                    }
                })
            }
        })
        //搜索时候的操作
        function getTable(){
            init_obj();
            if(!ression){
                return
            }
            var data=ression.data;
            if(data.length!=0){
                var nameArr=[];
                var dateArr=[];
                var arr=[];
                var dataDital=[];
                for(var j=0;j<data[0].list.length;j++){
                    dateArr.push(data[0].list[j].achTime);
                };
                for(var i=0;i<data.length;i++){
                    nameArr.push(data[i].userName);
                    var map={};
                    for(var h=0;h<data[i].list.length;h++){
                        dataDital.push(data[i].list[h].achPay);

                    }
                    map.name=nameArr[i];
                    map.type='line';
                    map.stack='额度';
                    map.data=dataDital.slice(i*dateArr.length,(i+1)*dateArr.length)
                    arr[i]=map;
                };
                eChart(nameArr,dateArr,arr);
            }else{
                eChart();
            }
        }

        //统计图方法
        function eChart(name,date,arr){

            var myChart = echarts.init(document.getElementById('myChart'));
            myChart.clear();
            if(!name)return
            myChart.setOption(option = {
                title: {
                    text: '员工业绩报表'
                },
                tooltip: {
                    //鼠标放在 图标上面显示 坐标轴
                    trigger: 'axis'
                },
                legend: {
                    //显示 可以显示数据 控件
                     data:name
                },
                //设置 图标的位置
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                //保存图片
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: date
                },
                yAxis: {
                    type: 'value'
                },
                series: arr

            })
        };
    })
})