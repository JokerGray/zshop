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
        //渲染表格
        init_obj()
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
                        width: 120
                    }, {
                        title: '分享人是否为商户',
                        align: 'left',
                        field: 'recommendIsMerchant',
                        width: 150,
                    },{
                        title: '是否为员工分享',
                        align: 'left',
                        field: 'isEmployeeShare',
                        width: 150,
                    },{
                        title: '分享员工昵称',
                        align: 'left',
                        field: 'employeeUserName',
                        width: 150,
                    },{
                        title: '分享员工手机号',
                        align: 'left',
                        field: 'employeePhone',
                        width: 150,
                    },{
                        title: '被分享人昵称',
                        align: 'left',
                        field: 'toUserName',
                        width: 150,
                    },{
                        title: '被分享人手机号',
                        align: 'left',
                        field: 'toPhone',
                        width: 150,
                    },{
                        title: '被分享人是否为商户',
                        align: 'left',
                        field: 'toIsMerchant',
                        width: 180,
                    },{
                        title: '被分享人注册时间',
                        align: 'left',
                        field: 'shareRegTime',
                        width: 150,
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
})

