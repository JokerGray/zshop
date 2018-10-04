$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laydate=layui.laydate,laypage=layui.laypage;
        form.render();

        var AREA = ['90%', '90%'];
        var TITLE = ['实名认证信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var imgPath = '../../common/images/placeholder.png';
        var USER_URL = {
            RESOURLIST : 'user/getAuditAppUserPageList', //查询
            GETAUDITDETAILS : 'user/getAuditDetails ',//查看详情
            DELETEREPLY : 'operations/deleteReply',//删除
            ROLEPERMISSIONPAGE : 'operations/queryAllMerchantBasicRolePermissionPage', //分页查询所有商户角色权限模板
            CHECKSTATUS : ' operations/modifyRolePermissionCheckStatus', //修改角色权限是否可选状态
            SAVEAUDITINFO : 'user/saveAuditInfo'
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
            var type = $(this).attr('data-type');
            if(type==1){
                $('.start_time').html('提交时间')
            }else{
                $('.start_time').html('审核时间')
            };
            getTable();
        })
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
            $("#merchantName").val("");
            $("#nickName").val('');
            $("#jurisdiction-begin").val("").attr("data-time",'');
            $("#jurisdiction-end").val("").attr("data-time",'');
            getTable()
        });

        //layer展开
        $('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
            if($(this).children('i.description').html() == '展开') {
                $(this).children('i.description').html('收起')
                $(this).children('i.icon').addClass('deg');
                $(this).parent().siblings('.app-layer-content').children('ul').hide();
                $(this).parent().siblings('.app-layer-content').children('.layer-place').show();
            } else {
                $(this).children('i.description').html('展开')
                $(this).children('i.icon').removeClass('deg');
                $(this).parent().siblings('.app-layer-content').children('ul').show();
                $(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
            }
        })
        $('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
            $(this).hide();
            $(this).siblings('ul').show();
            $(this).parent().siblings().children('.package-some').children('.description').html('展开');
            $(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
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
            var title = '审核时间';
            if(type ==1){
                title = '提交时间';
            }
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '账号',
                        align: 'left',
                        field: 'usercode',
                        width: 200
                    }, {
                        title: '昵称',
                        align: 'left',
                        field: 'username',
                        width: 200
                    }, {
                        title: '性别',
                        align: 'left',
                        field: 'usersex',
                        width: 100
                    }, {
                        title: '锁定状态',
                        align: 'left',
                        field: '_locked',
                        width: 200
                    }, {
                        title: '用户性质',
                        align: 'left',
                        field: '_ismerchant',
                        width: 100
                    }, {
                        title:title,
                        align:'left',
                        field:'submissiontime',
                        width:200
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
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
            let createTimeBegin = $('#jurisdiction-begin').val() || '';
            let nickName = $.trim($('#nickName').val()) || '';
            let userCode =  $.trim($('#merchantName').val())|| '';
            let createTimeEnd = $('#jurisdiction-end').val() || '';
            let param = {
                page :index,
                rows :limit,
                startDate :createTimeBegin,  //注册时间起
                endDate :createTimeEnd, //提交时间止*/
                type : statu, //审核状态1代表待确认，3代表已确认
                nickName:nickName,
                userCode:userCode
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(param));
        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data;
            console.log(data);
            var _locked, _ismerchant;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                if(item.ismerchant == 0) {
                    _ismerchant = '平台用户'
                } else {
                    _ismerchant = '商户'
                }
                if(item.locked == 1) {
                    _locked = '锁定'
                } else {
                    _locked = '启用'
                }
                $(item).attr('_ismerchant', _ismerchant)
                $(item).attr('_locked', _locked)
            });
            return res;
        }
        table.on('tool(tableNo)', function(obj) {
            var data = obj.data;
            var user_id = data.user_id;
            var demo = $('#demo111')
            console.log(obj);
            //查看
            if(obj.event === 'change'){
                var paramInfo = "{'appUserId':'" + user_id + "'}";
                var res =reqAjax(USER_URL.GETAUDITDETAILS,paramInfo);
                var data = res.data;
                console.log(data)
                layer.open({
                    title:TITLE,
                    area:AREA,
                    type: 1,
                    btn:['认证通过','不通过'],
                    content:demo,
                    shade:SHADE,
                    end:function (index) {
                        emptyInput(demo);
                        layer.close(index)
                    },
                    success:function () {
                        if(res){
                            setDatas(demo,data)
                        }
                    },
                    btn1: function(index, layero) {
                        if(res){
                            setSaveBtn(demo,index,90,data)
                        }

                    },
                    btn2: function(index, layero) {
                        if(res){
                            setSaveBtn(demo,index,91,data)
                        }
                    }
                })
            }else if(obj.event === 'detail'){
                layer.open({
                    title:TITLE,
                    area:AREA,
                    type: 1,
                    btn:['关闭'],
                    content:demo,
                    shade:SHADE,
                    end:function (index) {
                        emptyInput(demo);
                        layer.close(index)
                    },
                    success:function () {
                        var paramInfo = "{'appUserId':'" + user_id + "'}";
                        var res =reqAjax(USER_URL.GETAUDITDETAILS,paramInfo);
                        $('#audit_opinion').attr('readonly',true)
                        if(res){
                            var data = res.data;
                            setDatas(demo,data)
                        }

                    },
                    yes:function (index) {
                        emptyInput(demo);
                        layer.close(index)
                    }
                })
            }
        })
        //调用保存接口
        function setSaveBtn(demo,index,satatus,reData){
            var sysUserId = reData.user_id;
            var status = satatus;
            var auditId = reData.audit_id;
            var opinion = $('#audit_opinion').val();
            var updateTime = new Date().toLocaleString( )
            var auditor = yyCache.get('username');
            var paramInfo = "{'sysUserId':'" + sysUserId + "','status':'" + status + "','auditId':'" + auditId + "','opinion':'" + opinion + "','updateTime':'" + updateTime + "','auditor':'" + auditor + "'}";
            var res =reqAjax(USER_URL.SAVEAUDITINFO,paramInfo);
            layer.msg('操作成功');
            layer.close(index);
            getTable();
            demo.hide();
        }
        //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            $('#audit_opinion').val(data['audit_opinion'])

        }
        //遍历数组，填充数据
        function setArr(arr,data,img){
            var ids = '';
            $.each(arr,function (index, item) {
                ids = $(this).attr('id');
                if(data.hasOwnProperty(ids)){
                    if(img !== undefined){
                        $(this).attr('src',data[ids] || imgPath)
                    }else{
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        function emptyInput(demo){
            demo.hide().find("input").val("");
            demo.find("img").attr("src", imgPath);
        }

        //获取表格 为 审核 或者 为审核 1 未审核 3已审核
        function getTable(){
            //tab_box
            let type = $('.tab_box').find('button.active').attr('data-type')
            init_obj(type)
        }


    })
})