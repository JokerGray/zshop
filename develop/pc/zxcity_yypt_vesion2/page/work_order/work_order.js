$(function () {
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form, table = layui.table, layer = layui.layer, laydate = layui.laydate, laypage = layui.laypage;
        form.render();
        var userno = yyCache.get('userId') || ''
        var AREA = ['90%', '90%'];
        var TITLE = ['工单信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        // var imgPath = '../../common/images/placeholder.png';
        var USER_URL = {
            RESOURLIST: 'newZyzz/allListPage', //(查询列表)
            GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取所有推荐关系为公司员工的列表并分页
            GETMERCHART:'payZyzz/selAllMerchantByNotDel',//获取商户列表
            SAVEPAYZZ:'newZyzz/insNewZyzz',//新增接口
            GETNAME:'payZyzz/updateZyzzView  ',//获取商户名
            UPDATEORDER:'newZyzz/editNewZyzz',//修改接口
            UPDATESTATUS:'payZyzz/updateZyzzReviewStatus',//提交财务审核
            DEL:'payZyzz/delScZyzzWorkOrder',//删除工单
            CHANGEORDER:'payZyzz/updateZyzzWorkStatus',//修改工单完成状态
            WORKSOURCE:'payZyzz/newZyzzSourcePage',//工单来源
            CHAKAN: 'newZyzz/newZyzzInfo',

        };
        form.verify({
            float: function (value) {
                if (value) {
                    if (!new RegExp(amountExp).test(value)) {
                        return '请输入正确的金额';
                    }
                }
            },
            phoneNum: function (value) {
                if (value) {
                    if (!new RegExp(mobileExp).test(value)) {
                        return '手机号码不正确';
                    }
                }
            },
            pass: function (value, item) {
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '密码不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '密码首尾不能出现下划线\'_\'';
                }
            }
        })
        // 时间控件
        laydate.render({
            elem: '#jurisdiction-begin',
            done: function (value, date) {
                $(this.elem).attr('data-time', Date.parse(value) || '')
            }
        });
        laydate.render({
            elem: '#jurisdiction-end',
            done: function (value, date) {
                $(this.elem).attr('data-time', Date.parse(value) || '')
            }
        });
        //审核待审核
        $('.tab_box button').click(function () {
            $(this).addClass('active').removeClass('op5').siblings().addClass('op5').removeClass('active');
            var type = $(this).attr('data-type');
            if (type == 1) {
                $('.start_time').html('提交时间')
            } else {
                $('.start_time').html('审核时间')
            };
            getTable();
        })
        //点击变色
        $('#tableBox').on('click', 'tbody tr', function () {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        })
        $('.zImg').click(function () {
            var src = $(this).prop('src');
            window.open(src);
        })
        //搜索条件进行搜索
        $('#toolSearch').on('click', function () {
            var begintime = $("#jurisdiction-begin").attr("data-time");
            var endTime = $("#jurisdiction-end").attr("data-time");
            if (begintime != "" && endTime != "") {
                if (begintime > endTime) {
                    layer.alert("截至时间不能早于开始时间哟");
                } else {
                    getTable()
                }
            } else {
                getTable();
            }
        })
        //重置
        $("#toolRelize").click(function () {
            $('.input-box').find('input').val('').attr('data-time', '');
            getTable()
        });

        //获取来源
        function getSource() {
            var params = {
                page: 1,
                rows: 999,
            };
            var res = reqAjax(USER_URL.WORKSOURCE, JSON.stringify(params));
            var str = '<option value="">--选择--</option>';
            for (var i = 0; i < res.data.length; i++) {
                var obj = res.data[i]
                str += '<option value="' + obj.id + '">' + obj.name + '</option>'

            }
            $('#orderSourceId').html(str)
            form.render('select')
        }
        //设置表格相关操作
        setTableOperate()
        function setTableOperate() {
            var libox = $('.liTableBox')
            var xcp = $('.xcp');
            var qber = $('.qber');
            libox.find('input').attr('disabled', true).addClass('layui-disabled')
            form.on('checkbox(set2)', function (obj) {
                var el = $('.liTableBox');
                if (obj.elem.checked) {
                    qber.find('input,select').removeAttr('disabled').removeClass('layui-disabled')
                    zong += 1
                } else {
                    qber.find('input,select').attr('disabled', true).addClass('layui-disabled')
                    zong -= 1
                }
            })
            form.on('checkbox(set1)', function (obj) {
                if (obj.elem.checked) {
                    xcp.find('input,select').removeAttr('disabled').removeClass('layui-disabled')
                    zong += 1
                } else {
                    xcp.find('input,select').attr('disabled', true).addClass('layui-disabled')
                    zong -= 1
                }
            })
            form.render()
        }
        //添加
        var zong = 0;
        getSource()
        $('#addBtn').click(function () {
            bindFun();
            $('.noData').before(getTemp('s'));
            let el = $('#addOrder')
            el.find('input,select').attr('disabled', false).removeClass('layui-disabled')
            layer.open({
                title: ['新增工单', 'font-size: 12px; background-color: rgb(66, 70, 81); color: rgb(255, 255, 255); '],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['75%', '700px'],
                btn: ['确认', '取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success: function (layero, index) {
                    setForms('addForm');
                    $('.liTableBox').find('input').attr('disabled', true).addClass('layui-disabled')
                },
                yes: function (index) {
                    form.on('submit(addForm)', function (data) {
                        if (data) {
                            var par = setSaveBtn(el, USER_URL.SAVEPAYZZ)
                            if (par) {
                                reqAjaxAsync(USER_URL.SAVEPAYZZ, JSON.stringify(par)).done(function (res) {
                                    if (res.code == 1) {
                                        layer.msg('已提交财务审核')
                                        init_obj()
                                    } else {
                                        layer.msg(res.msg)
                                    }
                                    layer.close(index)
                                })
                            }
                        }
                        return false;
                    })
                }, btn2: function (index) {
                    layer.close(index);
                }
            })
        })

        //删除和新增人员
        $('.liTableBox').on('focus', '.checkEmployee', function () {
            var el = $('#threeDemo');
            var _self = $(this);
            layer.open({
                title: ['推荐人列表', 'font-size: 12px; background-color: rgb(66, 70, 81); color: rgb(255, 255, 255);'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['600px', '600px'],
                btn: ['确认'],
                end: function (index) {
                    el.hide().find('input').val('');
                    layer.close(index)
                },
                success: function (layero, index) {
                    init_obj_common();
                    table.on('tool(tableRe)', function (obj) {
                        console.log(obj)
                        if (obj.event === 'ok') {
                            layer.close(index);
                            _self.val(obj.data.yyptNickName)
                            $('#yyptNickName').val(obj.data.yyptNickName)
                        }
                    })
                },
                yes: function (index) {
                    var name = $.trim($('#yyptNickName').val());
                    if (name) {
                        _self.val(name)
                    }
                    layer.close(index)
                }
            })
        })
        function delUser() {
            var parent = $(this).parents('tr')
            if (parent.find('.bottom_box').size() == 1) {
                layer.msg('至少需要一名人员')
            } else {
                $(this).parents('.bottom_box').remove();
            }
        }
        function addUser() {
            var parent = $(this).parents('tr')
            var noData = parent.find('.noData');
            var set1 = $('#orderTypeStr')[0].checked;
            var set2 = $('#commissionTypeStr')[0].checked;
            var str = getTemp()
            if (parent.hasClass('xcp')) {
                if (set1) {
                    if (parent.find('.bottom_box').size() >= 3) {
                        layer.msg('最多添加三名人员')
                        return false
                    }
                } else {
                    layer.msg('未勾选视频拍摄')
                    return false
                }

            }
            if (parent.hasClass('qber')) {
                if (set2) {
                    if (parent.find('.bottom_box').size() >= 3) {
                        layer.msg('最多添加三名人员')
                        return false
                    }
                } else {
                    layer.msg('未勾选720°全景')
                    return false
                }
            }
            noData.before(str);
        }
        function checkUser() {
            var el = $('#oneDemo');
            layer.open({
                title: ['选择商户', 'font-size: 12px; background-color: rgb(66, 70, 81); color: rgb(255, 255, 255);'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['1000px', '600px'],
                end: function (index) {
                    el.hide().find('input').val('')
                    layer.close(index)
                },
                success: function (layero, index) {
                    init_obj_layer();
                    table.on('tool(tableNo)', function (obj) {
                        console.log(obj)
                        if (obj.event === 'ok') {
                            layer.close(index);
                            $('#merchantName').val(obj.data.org_name).prev().val(obj.data.merchant_id)
                        }
                    })
                },
                yes: function (index) {

                }
            })
        }





        function searchAndRestBtn() {
            //搜索条件进行搜索
            $('#toolSearch').on('click', function () {
                var begintime = $('#datetimepicker1').attr('data-time')
                var endTime = $('#datetimepicker2').attr('data-time')
                if (begintime != '' && endTime != '') {
                    if (begintime > endTime) {
                        layer.alert('截至时间不能早于创建时间哟')
                    } else {
                        init_obj()
                    }
                } else {
                    init_obj()
                }
            })
            //重置功能
            $('#toolRelize').on('click', function () {
                $('#usercode').val('')
                $('#jurisdiction-begin').val('')
                $('#jurisdiction-end').val('')
                $('#datetimepicker1').attr('data-time', '')
                $('#datetimepicker2').attr('data-time', '')
                init_obj()
            })

            //商户搜索
            $('#searchBtn').on('click', function () {
                init_obj_layer()
            })
            //商户重置功能
            $('#resetBtn').on('click', function () {
                $('#userName').val('')
                init_obj_layer()
            })

            //推荐人搜索
            $('#toolSearch1').on('click', function () {
                init_obj_common()
            })
            //推荐人重置功能
            $('#resetBtn1').on('click', function () {
                $('#yyptNickName').val('')
                init_obj_common()
            })
        }
        searchAndRestBtn()
        //表格

        function bindFun() {
            //选择商户
            $('#checkUser').on('click', checkUser)
            //新增业务人员表格
            $('.addUser').on('click', addUser)
            $('.liTableBox').on('click', '.delUser', delUser)
        }
        function unbindFun() {
            //选择商户
            $('#checkUser').unbind('click')
            //新增业务人员表格
            $('.addUser').unbind('click')
            $('.liTableBox').off('click', '.delUser')
        }
        //添加业务人员
        function getTemp(s, name, money) {
            var classes = s ? 'layui-disabled' : '';
            var disb = s ? 'disabled' : '';
            var name = name ? name : '';
            var money = money ? money : '';
            return `
        <div class="bottom_box clearfix">
            <div class="layui-input-block autoBox " style="" >
               <input type="text" class="layui-input ${classes} checkEmployee" value="${name}" ${disb}>
            </div>
            <div class="layui-input-block autoBox" style="margin-left: 0;">
                <input type="text" class="layui-input money  ${classes}" value="${money}" ${disb}>
            </div>
            <div class="layui-input-block autoBox autoBox2" style="margin-left: 0;" >
                <button class="layui-btn delUser"><i class="layui-icon">&#xe640;</i>删除</button>
            </div>
        </div>
        `
        }

        function getUserList() {
            pageCallbackCommon(1, 999).done(function (res) {
                if (res.code == 1) {
                    console.log(res)
                    var str = '<option value="">请选择</option>';
                    var data = res.data
                    $.each(data, function (i, item) {
                        str += '<option value="' + item.userId + '">' + item.appUserNickName + '</option>'

                    })
                    $('.userList').html(str);
                    form.render()
                }

            })
        }


        //商户列表
        function init_obj_layer() {
            var _obj = tableInit('tableNo', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80
                }, {
                    title: '商户名',
                    align: 'left',
                    field: 'org_name',
                    width: 300
                }, {
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: '#barDemor',
                    width: 200
                }]
            ],
                pageCallbackLayer, 'laypageLeftLayer'
            )
        }
        //工单列表
        function init_obj() {
            var _obj = tableInit('demo', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80
                }, {
                    title: '工单编号',
                    align: 'left',
                    field: 'orderNo',
                    width: 150
                }, {
                    title: '商户名',
                    align: 'left',
                    field: 'merchantName',
                    width: 150
                }, {
                    title: '工单来源',
                    align: 'left',
                    field: 'soureName',
                    width: 150
                }, {
                    title: '联系方式',
                    align: 'left',
                    field: 'merchantAddress',
                    width: 200
                }, {
                    title: '工单制作状态',
                    align: 'left',
                    field: '_workStatus',
                    width: 120
                }, {
                    title: '所属团队',
                    align: 'left',
                    field: 'ownTeam',
                    width: 150
                }, {
                    title: '工单创建时间',
                    align: 'left',
                    field: 'createTime',
                    width: 250
                }, {
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: '#barDemo',
                    width: 150
                }]
            ],
                pageCallback, 'laypageLeft'
            )
        }
        //推荐人列表
        function init_obj_common() {
            var obja = tableInit('tableRe', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80,
                    event: 'changetable'
                }, {
                    title: '姓名',
                    align: 'left',
                    field: 'yyptNickName',
                    width: 150,
                    event: 'changetable'
                }, {
                    title: '手机号',
                    align: 'left',
                    field: 'yyptPhone',
                    width: 200,
                    event: 'changetable'
                }, {
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: '#barDemor',
                    width: 100
                }]
            ],

                pageCallbackCommon, 'laypageTip'
            );
        }
        
        function getSource() {
            var params = {
                page: 1,
                rows: 999,
            };
            var res = reqAjax(USER_URL.WORKSOURCE, JSON.stringify(params));
            var str = '<option value="">--选择--</option>';
            for (var i = 0; i < res.data.length; i++) {
                var obj = res.data[i]
                str += '<option value="' + obj.id + '">' + obj.name + '</option>'

            }
            $('#orderSourceId').html(str)
            form.render('select')
        }
        // getSource()
        //工单数据处理
        function getData(url, parms) {
            return reqAjaxAsync(url, parms).done(function (res) {
                var datas = res.data
                console.log(res)
                $.each(datas, function (i, item) {
                    $(item).attr('eq', (i + 1))
                    if (item.reviewStatus == 0) {
                        $(item).attr('_workStatus', '审核中')
                    } else if (item.reviewStatus == 1) {
                        $(item).attr('_workStatus', '已审核')
                    } else if (item.reviewStatus == 2) {
                        $(item).attr('_workStatus', '审核不通过')
                    }
                })
            })
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var merchantName = $.trim($('#merchantNames').val()) || ''
            var reviewStatus = $('.tab_box button.active').attr('data-type');
            var startTime = $('#jurisdiction-begin').val() || ''
            var endTime = $('#jurisdiction-end').val() || ''
            var params = {
                page: index,
                rows: limit,
                reviewStatus: reviewStatus,
                merchantName: merchantName,
                startTime: startTime,
                endTime: endTime

            };

            return getData(USER_URL.RESOURLIST, JSON.stringify(params))
        }

        //商户回调
        function pageCallbackLayer(index, limit) {
            var param = {
                page: index,
                rows: limit,
                orgName: $.trim($('#userName').val())|| ''
            }
            return getDataCommon(USER_URL.GETMERCHART, JSON.stringify(param))
        }
        //推荐人回调
        function pageCallbackCommon(index, limit) {
            var param = {
                page: index,
                rows: limit,
                yyptNickName:$.trim($('#yyptNickName').val()) || ''
            }
            return getDataCommon(USER_URL.GETRECOMMEND, JSON.stringify(param))
        }
        function getDataCommon(url, parms) {
            return reqAjaxAsync(url, parms).done(function (res) {
                var data = res.data
                console.log(data)
                $.each(data, function (i, item) {
                    $(item).attr('eq', (i + 1))

                })
            })
        }


        table.on('tool(demo)', function (obj) {
            var form = layui.form
            var reData = obj.data
            let el = $('#addOrder')
            var ids = reData.id;
            console.log(reData)

            //查看
            if (obj.event === 'change' || obj.event == 'detail') {
                var title = obj.event=='change'?'修改':'查看'
                layer.open({
                    title: [title+'工单', 'font-size: 12px; background-color: rgb(66, 70, 81); color: rgb(255, 255, 255); '],
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['75%', '700px'],
                    btn: ['确认', '取消'],
                    end: function (index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success: function (layero, index) {
                        if (obj.event === 'change') {
                            setForms('changeForm');
                            el.find('input,select').attr('disabled', false).removeClass('layui-disabled')
                            $('.liTableBox').find('input').attr('disabled', true).addClass('layui-disabled')
                            bindFun()
                        }

                        $('#orderSourceId').val(reData.orderSourceId);
                        var rw = reData.workItems
                        $('.noData').before(getTemp('s'));
                        if (rw) {
                            rw = rw.split(',');
                            $.each(rw, function (j, items) {
                                $('input[name ="workItems"][value="' + items + '"]')[0].checked = true;
                                zong += 1;
                            })
                        }
                        var workItems = $('input[name ="workItems"]');
                        form.render();
                        $.each(workItems, function (i, item) {
                            if (item.checked) {
                                if (item.value == 1) {
                                    $('.xcp').find('input').removeClass('layui-disabled').removeAttr('disabled')
                                } if (item.value == 2) {
                                    $('.qber').find('input').removeClass('layui-disabled').removeAttr('disabled')
                                }
                            }
                        })
                        reqAjaxAsync(USER_URL.CHAKAN, JSON.stringify({ zyzzOrderId: reData.orderNo })).done(function (res) {
                            if (res.code == 1) {
                                var jsons = res.data;
                                $.map(jsons, function (obj) {
                                    var trList = {};
                                    var userList = obj.userList;
                                    if (obj.orderType == 1) {
                                        trList = $('.xcp')
                                    } else if (obj.orderType == 2) {
                                        trList = $('.qber')
                                    }
                                    if (obj.commissionType == 1) {
                                        setLists(trList[0], userList, obj.commissionAmount)
                                    } else if (obj.commissionType == 2) {
                                        setLists(trList[1], userList, obj.commissionAmount)
                                    }
                                })
                                function setLists(trList, userList, commissionAmount) {
                                    $(trList).find('.commissionAmount').val(commissionAmount);
                                    $(trList).find('.bottom_box').remove();
                                    for (var j = 0; j < userList.length; j++) {
                                        $(trList).find('.noData').before(getTemp('', userList[j].name, userList[j].money))
                                    }
                                }
                                if (obj.event == 'detail') {
                                    el.find('input,select').attr('disabled', true).addClass('layui-disabled')
                                    unbindFun()
                                    form.render();
                                    setForms('chaForm');
                                }

                            }

                        })
                        setDatas(el, reData);


                        // var
                    },
                    yes: function (index) {
                        form.on('submit(changeForm)', function (data) {
                            var par = setSaveBtn(el, USER_URL.UPDATEORDER, ids, reData.orderNo)
                            if (par) {
                                reqAjaxAsync(USER_URL.UPDATEORDER, JSON.stringify(par)).done(function (res) {
                                    if (res.code == 1) {
                                        init_obj()
                                        layer.close(index)
                                    }
                                    layer.msg(res.msg);
                                })
                            }

                        })
                        form.on('submit(chaForm)', function (data) {
                            layer.close(index)
                        })
                        // layer.close(index);
                    }, btn2: function (index) {
                        layer.close(index);
                    }
                })
            }
        })


        function tableInit(tableId, cols, pageCallback, pages) {
            var tableIns, tablePage
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: 'full-340',
                cols: cols,
                page: false,
                even: true,
                skin: 'row'
            })

            //2.第一次加载
            pageCallback(1, 15).done(function (res) {
                //第一页，一页显示15条数据
                if (res) {
                    if (res.code == 1) {
                        tableIns.reload({
                            data: res.data
                        })
                    } else {
                        layer.msg(res.msg)
                    }
                }

                //3.left table page
                layui.use('laypage')

                var page_options = {
                    elem: pages,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                    limits: [15, 30],
                    limit: 15
                }
                page_options.jump = function (obj, first) {
                    tablePage = obj

                    //首次不执行
                    if (!first) {
                        pageCallback(obj.curr, obj.limit).done(function (resTwo) {
                            if (resTwo && resTwo.code == 1)
                                tableIns.reload({
                                    limit: obj.limit,
                                    data: resTwo.data
                                })
                            else
                                layer.msg(resTwo.msg)
                        })
                    }
                }

                layui.laypage.render(page_options)

                return {
                    tablePage,
                    tableIns
                }
            })

        }
        //调用保存接口

        function setForms(form) {
            //给保存按钮添加form属性
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit", "");
            $("a.layui-layer-btn0").attr("lay-filter", form);
        }
        var imgPath = 'images/upload.png';
        function setSaveBtn(demo, cmd, ids, orderNo) {
            var workItems = $('input[name ="workItems"]');
            if (zong <= 0) {
                layer.msg('请至少选择一项制作项目！')
                return false;
            }
            var flag = true;


            var orderTypeStr = '';
            var voList = [];
            var xcp = $('.xcp');
            var qber = $('.qber');
            $.each(workItems, function (i, item) {
                var par = {};
                if (i > 1) {
                    var pars = {};
                }
                if (item.checked) {
                    orderTypeStr += item.value;
                    orderTypeStr += ',';
                    var waiArr = [];
                    if (i == 0) {
                        $.each(xcp, function (j, items) {
                            par = {};
                            waiArr = [];
                            par.orderType = item.value
                            par.commissionType = $(this).attr('data-type');
                            par.commissionAmount = $(this).find('.commissionAmount').val();
                            var userList = $(this).find('.bottom_box');
                            var arr = [];
                            var userObj = {};
                            if (!par.commissionAmount) {
                                layer.msg('请填写金额!')
                                flag = false;
                                return false;
                            }
                            $.each(userList, function (m, itemss) {
                                // if()
                                userObj = {};
                                userObj.name = $(this).find('.checkEmployee').val();
                                userObj.money = $(this).find('.money').val();
                                if (userObj.name == '') {
                                    layer.msg('请完善人员信息')
                                    flag = false;
                                    return false;
                                }
                                if (userObj.money == '') {
                                    layer.msg('请完善提成金额')
                                    flag = false;
                                    return false;
                                }
                                waiArr.push(userObj)

                            })
                            par.userList = waiArr;
                            voList.push(par);

                            if (!flag) {
                                return false;
                            }
                        })

                    } else if (i == 1) {
                        $.each(qber, function (k, itemss) {
                            par = {};
                            waiArr = [];
                            par.orderType = item.value
                            par.commissionType = $(this).attr('data-type');
                            par.commissionAmount = $(this).find('.commissionAmount').val();
                            var userList = $(this).find('.bottom_box');
                            var arr = [];
                            var userObj = {};
                            if (!par.commissionAmount) {
                                layer.msg('请填写金额!')
                                flag = false;
                                return false;
                            }
                            $.each(userList, function (m, itemss) {
                                userObj = {};
                                userObj.name = $(this).find('.checkEmployee').val();
                                userObj.money = $(this).find('.money').val();
                                if (userObj.name == '') {
                                    layer.msg('请完善人员信息')
                                    flag = false;
                                    return false;
                                }
                                if (userObj.money == '') {
                                    layer.msg('请完善提成金额')
                                    flag = false;
                                    return false;
                                }
                                waiArr.push(userObj)

                            })
                            par.userList = waiArr;
                            voList.push(par);
                            if (!flag) {
                                return false;
                            }
                        })
                    }
                }

            })

            if (!flag) {
                return false
            }
            var commissionPic = $('#commissionPic').attr('src');
            var shootingPicUrl = $('#shootingPicUrl').attr('src');
            if (commissionPic == imgPath) {
                layer.msg('请上传智扮团队提成表')
                return false;
            }
            if (shootingPicUrl == imgPath) {
                layer.msg('请上传智扮外出拍摄表')
                return false;
            }
            orderTypeStr = orderTypeStr.substr(0, orderTypeStr.length - 1)
            var paramInfo = {
                merchantId: $('#merchantId').val(),//商户id
                merchantName: $('#merchantName').val(),
                merchantAddress: $.trim($('#merchantAddress').val()),//地址
                contactInformation: $.trim($('#contactInformation').val()),//联系方式
                shopCount: $.trim($('#shopCount').val()),//店铺数量
                ownTeam: $.trim($('#ownTeam').val()),//所属团队
                orderSourceId: $('#orderSourceId').val(),//工单来源
                commissionPicUrl: $('#commissionPic').attr('src'),//智扮团队提成表
                shootingPicUrl: $('#shootingPicUrl').attr('src'),//智扮外出拍摄表
                remark: $.trim($('#remark').val()),//备注
                workItems: orderTypeStr,//项目
                voList: voList
            }
            console.log(paramInfo)
            if (cmd === USER_URL.UPDATEORDER) {
                paramInfo.id = ids;
                paramInfo.orderNo = orderNo;
            }
            return paramInfo;


        }
        //渲染数据
        function setDatas(demo, data) {
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            var textArea = demo.find('textarea');
            setArr(textArea, data);
            setArr(inputArr, data);
            setArr(imgArr, data, '');
            form.render()

        }
        //遍历数组，填充数据
        function setArr(arr, data, img) {
            var ids = '';
            $.each(arr, function (index, item) {
                ids = $(this).attr('id');
                if (data.hasOwnProperty(ids)) {
                    if (img !== undefined) {
                        $(this).attr('src', data[ids] || imgPath)
                    } else {
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        function emptyInput(demo) {
            zong = 0;
            unbindFun()
            demo.hide().find('input[type="text"],textarea,select').val('').attr('disabled', false);
            demo.find("input[type='checkbox']").attr('disabled', false);
            $('.bottom_box').remove();
            $('.liTableBox').find('input').attr('disabled', true).addClass('layui-disabled')
            var checkBox = demo.find("input[type='checkbox']");
            $.each(checkBox, function (index, el) {

                el.checked = false;
            })
            demo.find("img").attr("src", imgPath);
            form.render()
        }

        uploadOss({
            btn: "commissionPic",
            flag: "img",
            size: "5mb"
        });
        uploadOss({
            btn: "shootingPicUrl",
            flag: "img",
            size: "5mb"
        });
        function getTable(){
            init_obj()
        }
        init_obj()
    })
})