$(function(){
    layui.use(['form', 'layer', 'laydate', 'table', 'laypage'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laypage=layui.laypage,laydate=layui.laydate;

        var page = 1;
        var rows = 10;

        var userId=GetQueryString("userId"); //商户id
        var USER_URL ={
            LISTS:'user/selRecommendInfoListPage',//(列表)
            EXCELCMD:'user/selRecommendInfoExport',//导出
        }
        //点击变色
        $('body').on('click', '.layui-form .layui-table-body tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        });
        $('#searchBtn').click(function () {
            init_obj()
        })
        $('#restBtn').click(function () {
            $('.hearder').find('input,select').val('');
            init_obj();
        })

        //时间控件
        laydate.render({
            elem: '#date'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#26c3b2'
        });

        //表格
        function tableInit(tableId, cols, pageCallback, pageLeft) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                // height: 'full-185',
                cols: cols,
                page: false,
                // even: true,
                skin: 'line',
                limit: 10
            });

            //2.第一次加载
             pageCallback(page,rows).done(function (res) {
                //第一页，一页显示15条数据
                if(res.code == 1) {
                    tableIns.reload({
                        data: res.data
                    })
                } else {
                    layer.msg(res.msg)
                }
                //3.left table page
                var page_options = {
                    elem: pageLeft,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    limit: 10
                }
                page_options.jump = function(obj, first) {
                    tablePage = obj;

                    //首次不执行
                    if(!first) {
                         pageCallback(obj.curr, obj.limit).done(function (resTwo) {
                             if(resTwo && resTwo.code == 1)
                                 tableIns.reload({
                                     data: resTwo.data,
                                     limit:obj.limit
                                 });
                             else
                                 layer.msg(resTwo.msg);
                         })

                    }
                }

                laypage.render(page_options);

                return {
                    tablePage,
                    tableIns
                };
            });

        }
        //渲染表格
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '分享人昵称',
                        align: 'left',
                        field: 'recommendUserName',
                        width: 120
                    }, {
                        title: '分享人手机号',
                        align: 'left',
                        field: 'recommendPhone',
                        width: 150
                    },{
                        title: '是否为员工分享',
                        align: 'center',
                        field: 'isEmployeeShare',
                        width: 150
                    }, {
                        title: '分享员工昵称',
                        align: 'left',
                        field: 'employeeUserName',
                        width: 180
                    }, {
                        title: '分享员工手机号',
                        align: 'left',
                        field: 'employeePhone',
                        width: 200,
                    },{
                        title: '被分享人昵称',
                        align: 'left',
                        field: 'toUserName',
                        width: 200,
                    },{
                        title: '被分享人手机号',
                        align: 'left',
                        field: 'toPhone',
                        width: 200,
                    },{
                        title: '被分享人是否为商户',
                        align: 'center',
                        field: 'toIsMerchant',
                        width: 200,
                    },{
                        title: '被分享人注册时间',
                        align: 'left',
                        field: 'shareRegTime',
                        width: 250
                    }]
                ],

                pageCallback, 'laypageLeft'
            );
        }
        init_obj()
        $('.layui-table-main').niceScroll({
            cursorcolor:"#dfdfdf",
            cursorborder:"0",
            autohidemode:false,
            cursorwidth:'10px'
        });

        //回调
        //pageCallback回调
        function pageCallback(index, limit) {
            return getData(USER_URL.LISTS, JSON.stringify(getParams(index,limit)));
        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            return reqAjaxAsync(url, parms).done(function (res) {
                var data = res.data
                console.log(data)
                $.each(data, function (i, item) {
                    $(item).attr('eq', (i + 1))
                    if(item.incOrExp == 1){
                        $(item).attr('incOrExpName','收入')
                    }else if(item.incOrExp == 2){
                        $(item).attr('incOrExpName','支出')
                    }
                })
            }).fail(function(){
                alert('网络不行，请求错误')
            })
        }
        $('#excelBtn').click(function () {

            downloadFile(USER_URL.EXCELCMD,JSON.stringify(getParams()))
        })
        function getParams(index,limit) {
            var time = $('#date').val().split(' 至 ');
            var params = {
                userId:userId,
                recommendUserName:$.trim($('#recommendUserNames').val()) ||'',
                toPhone:$.trim($('#toPhones').val())||'',
                recommendPhone:$.trim($('#recommendPhones').val())||'',
                employeePhone:$.trim($('#employeePhones').val())||'',
                toUserName:$.trim($('#toUserNames').val())||'',
                employeeUserName:$.trim($('#employeeUserNames').val())||'',
                toIsMerchant:$.trim($('#toIsMerchants').val())||'',
                recommendIsMerchant:$.trim($('#recommendIsMerchants').val())||'',
                isEmployeeShare:$('#isEmployeeShares').val() ||'',
                shareRegStartTime:time[0]||'',
                shareRegEndTime:time[1]||time[0]||'',
            }
            if(index){
                params.page = index;
                params.rows = limit;
            }
            return params;
        }
        /*导出excel*/
        function downloadFile(url,parms) {
            //定义要下载的excel文件路径名
            var excelFilePathName = "";
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            reqAjaxAsync(url,parms).then(function(excelUrl) {
                if(excelUrl.code != 1) {
                    layer.msg(excelUrl.msg);
                } else {
                    //2.获取下载URL
                    excelFilePathName = excelUrl.data;
                    //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
                    if("" != excelFilePathName) {
                        var aIframe = document.createElement("iframe");
                        aIframe.src = excelFilePathName;
                        aIframe.style.display = "none";
                        document.body.appendChild(aIframe);
                    }
                }

            }).fail(function(){
                alert('网络不行，请求错误')
            })
        }
    })
})