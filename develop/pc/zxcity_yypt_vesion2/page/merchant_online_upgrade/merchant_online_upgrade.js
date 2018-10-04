$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laydate=layui.laydate,laypage=layui.laypage;

        var userNo = yyCache.get("userno");
        var userId = yyCache.get("userId") ;
        var userName = yyCache.get('username');

        form.render();
        var USER_URL = {
            RESOURLIST : 'operations/onLineMrchantUpgradeConfirmList', //(查询列表)
            LOOKDETAIL : 'operations/approveMerchantUpgrade' //(确认)
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
        //审核待审核
        $('.tab_box button').click(function () {
            $(this).addClass('active').removeClass('op5').siblings().addClass('op5').removeClass('active');
            getTable();
        })
        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        })
        //表格
        function tableInit(tableId, cols, pageCallback, pageLeft,stat) {
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
            var res = pageCallback(stat,1, 15);
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
                    var resTwo = pageCallback(stat,obj.curr, obj.limit);
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
            var dom = '#barDemo';
            if(type == 3){
                dom = ''
            }
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '商户名称',
                        align: 'left',
                        field: 'ORGNAME',
                        width: 100
                    }, {
                        title: '商户账号',
                        align: 'left',
                        field: 'ACCOUNT',
                        width: 200
                    }, {
                        title: '联系电话',
                        align: 'left',
                        field: 'PHONE',
                        width: 200
                    },  {
                        title: '状态',
                        align: 'left',
                        field: 'statuname',
                        width: 100
                    },  {
                        title: '提交时间',
                        align: 'left',
                        field: 'APPLYTIME',
                        width: 200
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: dom,
                        width: 150
                    }]
                ],

                pageCallback, 'laypageLeft', type
            );
        }
        init_obj(1)
        //回调
        //pageCallback回调
        function pageCallback(statu, index, limit) {
            let merchantName = $('#merchantName').val() || '';
            let createTimeBegin = $('#jurisdiction-begin').val() || '';
            let createTimeEnd = $('#jurisdiction-end').val() || '';
            var param = {
                page :index,
                rows :limit,
                phone :merchantName,//商户名
                startDate :createTimeBegin,  //注册时间起
                endDate :createTimeEnd, //提交时间止*/
                status : statu //审核状态1代表待确认，3代表已确认
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(param));
        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data;
            console.log(data);
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
        table.on('tool(tableNo)', function(obj) {
            var data = obj.data;
            var oldId = data.id;
            console.log(obj);
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

                                getTable();
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    })

            }
        })
        //获取表格 为 审核 或者 为审核 1 未审核 3已审核
        function getTable(){
            //tab_box
            let type = $('.tab_box').find('button.active').attr('data-type')
            init_obj(type)
        }

        //搜索条件进行搜索
        $('#toolSearch').on('click', function() {
            var inx = $(".tab-title li.active").index();

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
            $("#merchantName").val("");
            $("#jurisdiction-begin").val("").attr("data-time",'');
            $("#jurisdiction-end").val("").attr("data-time",'');
            getTable()
        });
    })
})