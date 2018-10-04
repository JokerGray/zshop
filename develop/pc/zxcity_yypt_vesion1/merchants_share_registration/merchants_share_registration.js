$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate
        form.render();
        var page = 1;
        var rows = 15;
        var AREA = ['90%', '90%'];
        var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var USER_URL = {
            LISTS:'user/selRecommendInfoListPage',//(列表)
            EXCELCMD:'user/selRecommendInfoExport',//导出
        };
        $('#searchToggle').click(function () {
            $('.header_ul').slideToggle();
        })
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input,select').val('')
            init_obj()
        })

        //时间控件
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            ,range: '至'//设置时间段
            ,format: 'yyyy-MM-dd'
            ,theme: '#009688'
        });
        //表格模板
        function tableInit(tableId, cols, pageCallback, pageLeft) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: 'full',
                cols: cols,
                page: false,
                even: true,
                skin: 'row',
                limit: 15
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
                    layout: ['count', 'prev', 'page', 'next','limit'],
                    limits: [15, 30],
                    limit: 15
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
                        });

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
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100
                    }, {
                        title: '分享人昵称',
                        align: 'left',
                        field: 'recommendUserName',
                        width: 120
                    }, {
                        title: '分享人手机号',
                        align: 'left',
                        field: 'recommendPhone',
                        width: 120
                    }, {
                        title: '分享人是否为商户',
                        align: 'left',
                        field: 'recommendIsMerchant',
                        width: 100,
                    },{
                        title: '是否为员工分享',
                        align: 'left',
                        field: 'isEmployeeShare',
                        width: 100,
                    },{
                        title: '分享员工昵称',
                        align: 'left',
                        field: 'employeeUserName',
                        width: 100,
                    },{
                        title: '分享员工手机号',
                        align: 'left',
                        field: 'employeePhone',
                        width: 120,
                    },{
                        title: '被分享人昵称',
                        align: 'left',
                        field: 'toUserName',
                        width: 100,
                    },{
                        title: '被分享人手机号',
                        align: 'left',
                        field: 'toPhone',
                        width: 120,
                    },{
                        title: '被分享人是否为商户',
                        align: 'left',
                        field: 'toIsMerchant',
                        width: 100,
                    },{
                        title: '被分享人注册时间',
                        align: 'left',
                        field: 'shareRegTime',
                        width: 120,
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var time = $('#date').val().split(' 至 ');

            var params = {
                page: index,
                rows: limit,
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
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                    })
                    deff.resolve(res);
                }else{
                    layer.msg(res.msg)
                }
            })
            return deff.promise();

        }
        $('#excelBtn').click(function () {
            var time = $('#date').val().split(' 至 ');
            var param = {
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
            downloadFile(USER_URL.EXCELCMD,JSON.stringify(param))
        })
    })

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

        })
    }


})

