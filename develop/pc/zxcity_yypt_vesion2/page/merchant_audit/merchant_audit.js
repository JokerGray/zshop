$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laydate=layui.laydate,laypage=layui.laypage;
        var userNo = yyCache.get("userno") || "";
        form.render();
        var page = 1;
        var AREA = ['90%', '90%'];
        var TITLE = ['完善商户信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var imgPath = '../../common/images/placeholder.png';
        var USER_URL = {
            RESOURLIST: 'operations/queryMerchantRegApplyPage', //(查询列表)
            LOOKDETAIL: 'operations/getMerchantRegApplyDetail', //(查看详情)
            PROVINCE: 'operations/getBaseAreaInfoByCode', //省'
            DELUSER: 'operations/approvalMerchantRegApply', //审核是否通过
            ADDONE: 'operations/addMerchantInfoApprove', //添加商户信息
            CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
            TEMPLET:'operations/getAllMerchantTradeTemplateList',//行业模板接口
            ADDSECOND: 'operations/addCMSInfoApprove', //第二步
            INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
            ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
            ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
            ADDTHIRD: 'operations/addRolePermissionApprove', //(第三部)
            ADDFORTH: 'operations/addMerchantRegApprove', //(第四步)
            ISALLOWEND: 'operations/isAllowedMerchantReg', //是否运行通过审核参数：{id:""}
            MERCHANREGBACK: 'operations//merchantRegBackUserResign', //商户普通员工办理离职接口：{id:""}
            GETSCTRADEBYID:'operations/getScTradeProcessByMerchantTradeId',//根据行业ID查询行业流程配置

        };
        //下单类型相关操作
        var xuan = 1;
        form.on('checkbox(set2)',function (obj) {
            var checked = obj.elem.checked
            if(!checked){
                $('.xiadan_box').hide()
                xuan-=1;
            }else{
                $('.xiadan_box').show()
                xuan+=1;
            }
        })
        form.on('checkbox(set1)',function (obj) {
            var checked = obj.elem.checked
            if(!checked){
                xuan-=1;
            }else{
                xuan+=1;
            }
        })

        form.on('select(trade)',function (obj) {
            var el = $('.xiadan_box');
            setSctradeById(obj.value)
        })
        function setSctradeById(ids){
            var params = {
                merchantTradeId:ids
            }
            reqAjaxAsync(USER_URL.GETSCTRADEBYID,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    var reData = res.data;
                    console.log(reData)
                    // setDatas(el,datas);

                    if(reData.set1 == 1){
                        $('#set1').prop('checked',true)
                    }else{
                        $('#set1').prop('checked',false)
                    }
                    if(reData.set2 == 1){
                        $('#set2').prop('checked',true)
                        $('.xiadan_box').show();
                    }else{
                        $('#set2').prop('checked',false)
                        $('.xiadan_box').hide();
                    }
                    $('input[name="set3"][value="'+reData.set3+'"]').prop('checked',true)
                    $('input[name="set4"][value="'+reData.set4+'"]').prop('checked',true)
                    $('input[name="set5"][value="'+reData.set5+'"]').prop('checked',true)

                }else{
                    $('#set1').prop('checked',true)
                    $('#set2').prop('checked',false);
                    $('input[name="set3"][value="0"]').prop('checked',true)
                    $('input[name="set4"][value="0"]').prop('checked',true)
                    $('input[name="set5"][value="0"]').prop('checked',true)
                    $('.xiadan_box').hide();
                }
                form.render();
            })
        }

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
        $('.zImg').click(function(){
            var src = $(this).prop('src');
            window.open(src);
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
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80,
                        templet: '#titleTpl'
                    }, {
                        title: '账号',
                        align: 'left',
                        field: 'usercode',
                        width: 150
                    }, {
                        title: '商户名称',
                        align: 'left',
                        field: 'merchantName',
                        width: 200
                    }, {
                        title: '电话号码',
                        align: 'left',
                        field: 'phoneNumber',
                        width: 150
                    }, {
                        title: '管理员名称',
                        align: 'left',
                        field: 'username',
                        width: 150
                    }, {
                        title: '所属行业',
                        align: 'left',
                        field: 'tradename',
                        width: 150
                    }, {
                        title: '审核状态',
                        align: 'left',
                        field: 'statuname',
                        width: 100
                    }, {
                        title: '注册时间',
                        align: 'left',
                        field: 'createTime',
                        width: 180
                    }, {
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 350
                    }]
                ],

                pageCallback, 'laypageLeft', type
            );
        }
        init_obj(0)
        //回调
        //pageCallback回调
        function pageCallback(statu, index, limit) {
            let merchantName = $('#merchantName').val() || '';
            let createTimeBegin = $('#jurisdiction-begin').val() || '';
            let createTimeEnd = $('#jurisdiction-end').val() || '';
            var param = {
                page: index,
                rows: limit,
                phoneNumber: merchantName, //手机号
                createTimeBegin: createTimeBegin, //申请时间起
                createTimeEnd: createTimeEnd, //申请时间止
                status: statu //审核状态-1代表已审，0代表未审
            }
            return getData(USER_URL.RESOURLIST, JSON.stringify(param));
        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data;
            console.log(res)
            var merchantTrade = [];
            var res1 = reqAjax(USER_URL.CONFIG);
            var merchantTrade = res1.data.merchantTrade
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                $(item).attr('merchantname', '普通商户');
                if(item.status == 0) {
                    $(item).attr('statuname', '审批中');
                } else if(item.status == 1) {
                    $(item).attr('statuname', '审批通过');
                } else if(item.status == 2) {
                    $(item).attr('statuname', '审批拒绝');
                };
                $.each(merchantTrade,function(u,utem){
                    if(item.trade == utem.value){
                        $(item).attr('tradename', utem.name);
                    }
                })
            });
            return res;
        }
        table.on('tool(tableNo)', function(obj) {
            var data = obj.data;
            var oldId = data.id;
            var demo = $("#demo111")
            var step = data.step || 0;
            console.log(obj);
            //查看
            if(obj.event === 'nodetail') {
                AREA=['65%','700px']
                layer.open({
                    title: ['详情', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    btn: ['确定'],
                    content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    end: function(index) {
                        layer.close(index)
                        emptyInput(demo)

                    },
                    success: function(layero, index) {
                        //隐藏相关的 数据
                        hideLi(data)
                        var param = {
                            id: oldId
                        }
                        reqAjaxAsync(USER_URL.LOOKDETAIL, JSON.stringify(param)).done(function(res) {
                            if(res.code == 1) {
                                setDatas(res);
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                        form.render()
                    },
                    yes: function(index, layero) {
                        layer.close(index)
                        emptyInput(demo)
                    }
                });
                //
            }
            else if(obj.event === 'change'){
                AREA=['65%','700px']
                var uname = data.username;
                var id = data.id;
                var param = {
                    'id': id
                };
                var res = reqAjax(USER_URL.ISALLOWEND, JSON.stringify(param));
                if(res.code == 9) {
                    layer.alert(res.msg);
                    return;
                } else if(res.code == 8) {
                    layer.confirm('是否办理离职？', {
                        icon: 3,
                        btn: ['办理', '取消']
                    }, function(index) {
                        var lzRes = reqAjax(USER_URL.MERCHANREGBACK, param);
                        layer.alert(lzRes.msg)
                        layer.close(index);
                    });
                    return;
                }
                if(step == 0){
                    step1(demo,data,oldId)
                    getTable()
                }else if(step == 1){
                    step2($('#secondDemo'),oldId,uname)
                    getTable()
                }else if(step == 2){
                    step4($('#thirdDemo'),oldId)
                    getTable()
                }else if(step == 3){
                    lastStep($('#fiveDemo'),oldId)
                    getTable()
                }


            }else if(obj.event === 'del'){
                //删除
                var fourDemo = $('#fiveDemo')
                layer.open({
                    title: ['意见', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    btn: ['完成', '取消'],
                    content:fourDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['90%','50%'],
                    end: function() {
                        fourDemo.hide();
                        fourDemo.find('textarea').val('')
                    },
                    success: function(layero, index) {
                        setForm('fiveDemo')


                    },
                    yes: function(index, layero) {
                        form.on('submit(fiveDemo)', function(data) {
                            if(data) {
                                var approveMsg = $.trim($("#addAudit").val());
                                var paramDel = {
                                    id: oldId,
                                    userNo: userNo,
                                    status: 2,
                                    approveMsg: approveMsg
                                };
                                reqAjaxAsync(USER_URL.DELUSER, JSON.stringify(paramDel)).done(function(res) {
                                    if(res.code == 1) {
                                        layer.msg("审核不通过");
                                        layer.close(index);
                                        var inx = $(".tab-title li.active").index();
                                        var merchantName = $.trim($("#merchantName").val());
                                        var createTimeBegin = $("#jurisdiction-begin").val();
                                        var createTimeEnd = $("#jurisdiction-end").val();
                                        getTable(inx, merchantName, createTimeBegin, createTimeEnd);
                                    } else {
                                        layer.msg(res.msg);
                                    }
                                });
                            }
                            return false; //阻止页面刷新
                        })
                        fourDemo.hide();
                        layer.close(index)
                    }
                });
            }
        })
        //获取表格 为 审核 或者 为审核 0 未审核 1 已审核
        function getTable(){
            //tab_box
            let type = $('.tab_box').find('button.active').attr('data-type')
            init_obj(type)
        }
        //第一步
        function step1(demo,data,oldId){
            layer.open({
                title: ['完善商户信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                type: 1,
                btn: ['下一步 '],
                content:demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                end: function() {
                    demo.hide();
                    $('.xiadan_box').hide();
                    xuan = 1;
                },
                success: function(index,layero) {
                    console.log(data)
                    showLi()
                    setSelect(data);

                    setSctradeById($("#trade").val())
                    form.render();

                    var param = {
                        id: oldId
                    }
                    reqAjaxAsync(USER_URL.LOOKDETAIL, JSON.stringify(param)).done(function(res) {
                        if(res.code == 1) {
                            var row = res.data;
                            $("#lookName").val(row.usercode);
                            $("#lookdesig").val(row.merchantName);
                            $("#looktype").val('普通');
                            $("#lookbuss").attr("src", row.licenseFront);
                            $("#lookbussback").attr("src", row.licenseBack);
                            $("#lookid").attr("src", row.idCardFront);
                            $("#lookidback").attr("src", row.idCardBack);
                            $('#lookUsername').val(row.username)
                            //设置省市
                            setCites(row);


                        } else {
                            layer.msg(res.msg);
                        }
                        setForm('formDemo')
                        form.render()
                    });
                    var flag = true;

                    $('div.busimg>div>img').click(function() {
                        if(flag) {
                            $(this).addClass('act')

                        } else {
                            $(this).removeClass('act')
                        }
                        flag = !flag
                    })
                },
                yes: function(index, layero) {
                    var name = $('#userNameword').val();
                    var trade=$('#trade').val();
                    var identificationno = $('#userPassword').val();
                    var templet=$('#templet').val();
                    var param = {
                        id: oldId,
                        name: name,
                        trade:trade,//行业
                        templateId:templet,
                        identificationno: identificationno,
                        regular: $('#regular').val(),//类型
                    }
                    if(xuan < 1){
                        layer.msg('请至少选择一项下单类型', {
                            icon: 2,
                            anim: 6,
                        });
                        return false
                    }else{
                        var set1 = $('#set1')[0].checked?param.set1=1:param.set1=0;
                        var set2 =  $('#set2')[0].checked?param.set2=1:param.set2=0;
                        var set3 = 0;
                        var set4 = 0;
                        var set5 = 0;
                        if(set2 == 1){
                            set3 = $('input[name="set3"]:checked').val();
                            set4 = $('input[name="set4"]:checked').val();
                            set5 = $('input[name="set5"]:checked').val();
                        }
                        param.set3 = set3
                        param.set4 = set4
                        param.set5 = set5
                    }

                    form.on('submit(formDemo)', function(done) {
                        reqAjaxAsync(USER_URL.ADDONE, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.close(index);
                                var inx = $(".tab-title li.active").index();
                                var merchantName = $.trim($("#merchantName").val());
                                var createTimeBegin = $("#jurisdiction-begin").val();
                                var createTimeEnd = $("#jurisdiction-end").val();
                                getTable(inx, merchantName, createTimeBegin, createTimeEnd);

                            }
                        })
                    })
                }
            });
        }
        //第二步
        function step2(secondDemo,oldId,uname){
            layer.open({
                title: TITLE,
                type: 1,
                content: secondDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                closeBtn: 1,
                btn: ['下一步'],
                shade: SHADE,
                end: function () {
                    secondDemo.hide();
                    $("#addName").val("");
                },
                success: function (layero, index) {
                    $(".looktit").show();
                    $("#addName").val(uname);
                    //给保存按钮添加form属性
                    setForm('formdemo1');
                    //频道类型
                    var raw = reqAjax(USER_URL.CONFIG, "");
                    if (raw.code == 1) {
                        console.log(raw)
                        var data = raw.data.cmsChannelList;
                        var sHtmldept = '';
                        $.each(data, function (i, item) {
                            sHtmldept += "<option value='" + item.channelId + "'>" + item.channelName + "</option>";
                        });
                        $('#fixdepartment').html(sHtmldept);
                        form.render();
                    } else {
                        layer.msg(raw.msg);
                    }
                },yes: function(index, layero) {
                    //form监听事件
                    form.on('submit(formdemo1)', function (data) {
                        if (data) {
                            var id = oldId;
                            var subscriptionName = $.trim($("#addName").val()); //头条名
                            var subscriptionTypeId = $("#fixdepartment option:selected").val(); //头条类型ID
                            var pam = {
                                id: id,
                                userNo: userNo,
                                subscriptionName: subscriptionName,
                                subscriptionTypeId: subscriptionTypeId
                            }
                            reqAjaxAsync(USER_URL.ADDSECOND, JSON.stringify(pam)).done(function (res1) {
                                if (res1.code == 1) {
                                    layer.close(index);
                                    var inx = $(".tab-title li.active").index();
                                    var merchantName = $.trim($("#merchantName").val());
                                    var createTimeBegin = $("#jurisdiction-begin").val();
                                    var createTimeEnd = $("#jurisdiction-end").val();
                                    // getTable(inx, merchantName, createTimeBegin, createTimeEnd);
                                    step4($('#thirdDemo'),oldId)
                                }
                            })
                        }
                    })
                }

            })
        }
        //第三步
        function step4(thirdDemo,oldId){
            layer.open({
                title:TITLE,
                type: 1,
                content: thirdDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                closeBtn: 1,
                shade: SHADE,
                btn: ['下一步'],
                end: function() {
                    thirdDemo.hide();
                },
                success: function(layero, index) {
                    $(".looktit").show();
                    //角色名称
                    var pm1 = {
                        page: page,
                        rows: 15
                    }
                    var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
                    if(res01.code == 1) {
                        var datarole = res01.data;
                        var sHtmldept = '';
                        $.each(datarole, function(i, item) {
                            sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
                        });
                        $('#mervchantRole').html(sHtmldept);
                        $('#mervchantRole').find("li").eq(0).addClass("aee");
                        var roleName = $('#mervchantRole').find("li.aee").text();
                        getTree(roleName);
                        $('#mervchantRole').on("click", "li", function() {
                            var name = $(this).text();
                            $('#mervchantRole li').removeClass("aee");
                            $(this).addClass("aee");
                            getTree(name);
                        });
                    } else {
                        layer.msg(res01.msg);
                    }
                },
                yes: function(index, layero) {
                    var pram = {
                        id: oldId
                    }
                    reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pram)).done(function(res3) {
                        if(res3.code == 1) {
                            layer.close(index);
                            var inx = $(".tab-title li.active").index();
                            var merchantName = $.trim($("#merchantName").val());
                            var createTimeBegin = $("#jurisdiction-begin").val();
                            var createTimeEnd = $("#jurisdiction-end").val();
                            // getTable(inx, merchantName, createTimeBegin, createTimeEnd);
                            //第四步
                            lastStep($('fiveDemo'),oldId)

                        } else {
                            layer.msg(res3.msg);
                        }
                    })
                }

            })
        }
        //审核
        function lastStep(fourDemo,oldId){
            layer.open({
                title: TITLE,
                type: 1,
                content: fourDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['90%', '50%'],
                closeBtn: 1,
                btn: ['完成'],
                shade: [0.1, '#fff'],
                end: function() {
                    fourDemo.hide();
                },
                success: function(layero, index) {
                    //给保存按钮添加form属性
                    setForm('formdemo2')
                },
                yes: function(index, layero) {
                    form.on('submit(formdemo2)', function(data) {
                        if(data) {
                            var approveMsg = $.trim($("#addAudit").val());
                            var pram = {
                                id: oldId,
                                status: 1, //审批状态:0-审批中; 1-审批通过；2-审批拒绝
                                approveMsg: approveMsg //审批信息
                            }
                            reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
                                if(res3.code == 1) {
                                    layer.msg("审核通过");
                                    layer.close(index);
                                    var inx = $(".tab-title li.active").index();
                                    var merchantName = $.trim($("#merchantName").val());
                                    var createTimeBegin = $("#jurisdiction-begin").val();
                                    var createTimeEnd = $("#jurisdiction-end").val();
                                    getTable(inx, merchantName, createTimeBegin, createTimeEnd);
                                } else {
                                    layer.msg(res3.msg);
                                }
                            })
                        }
                        return false; //阻止页面刷新
                    })
                }

            })
        }
        // 设置省市
        function setCites(row){
            //省
            var param = {
                code: row.provinceId
            }
            var req = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
            if(req.code == 1) {
                $("#lookprovi").val(req.data.areaname);
            } else {
                layer.msg(req.msg);
            }
            //市
            var params = {
                code: row.cityId
            }
            var reqs = reqAjax(USER_URL.PROVINCE, JSON.stringify(params));
            if(reqs.code == 1) {
                $("#lookcity").val(reqs.data.areaname);
            } else {
                layer.msg(reqs.msg);
            }
        }
        //设置form
        function setForm(demoes){
            $('div.layui-layer-page').addClass('layui-form')
            $('a.layui-layer-btn0').attr('lay-submit', '');
            $('a.layui-layer-btn0').attr('lay-filter', demoes);
        }
        //设置 下拉框
        function setSelect(data){
            reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
                var row = res.data.merchantTrade;
                //行业
                var bHtml = "";
                $.map(row, function(n, index) {
                    bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
                })
                $("#trade").html(bHtml);
                $('#trade').val(data.trade)

                var rows = res.data.regularTypeList;
                var bHtml = "";
                $.map(rows, function (n, index) {
                    bHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
                })

                $("#regular").html(bHtml).val(6);
                form.render();
            });
            reqAjaxAsync(USER_URL.TEMPLET, "").done(function(res) {
                var row = res.data;
                //模板
                var bHtml = "";
                $.map(row, function(n, index) {
                    bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
                })
                $("#templet").html(bHtml);
                $('#templet').val('1').attr('disabled',false);
                form.render();
            });
        }
        //清除数据
        function emptyInput(demo){
            demo.hide().find("input").val("");
            demo.find("img").attr("src", imgPath);
        }
        //设置数据
        function setDatas(res){
            var row = res.data;
            console.log(row)
            $("#lookName").val(row.usercode);
            $("#lookdesig").val(row.merchantName);
            $("#looktype").val('普通');
            $("#lookbuss").attr("src", row.licenseFront);
            $("#lookbussback").attr("src", row.licenseBack);
            $("#lookid").attr("src", row.idCardFront);
            $("#lookidback").attr("src", row.idCardBack);
            $('#lookUsername').val(row.username)
            //省
            var param = {
                code: row.provinceId
            }
            var req = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
            if(req.code == 1) {
                $("#lookprovi").val(req.data.areaname);
            } else {
                layer.msg(req.msg);
            }
            //市
            var params = {
                code: row.cityId
            }
            var reqs = reqAjax(USER_URL.PROVINCE, JSON.stringify(params));
            if(req.code == 1) {
                $("#lookcity").val(reqs.data.areaname);
            } else {
                layer.msg(req.msg);
            }
        }
        //隐藏相关的数据
        function hideLi(data){
            $(".progress-my").hide();//进度条
            $('.userNameword').hide();//姓名
            $('.userPassword').hide();//身份证
            $('.lookguild').show().find('input').val(data.tradename);//所属行业
            $('.rigTem').hide();//行业模板
            $('.trade').hide();
        }
        //显示相关的数据
        function showLi(){
            $(".progress-my").show();//进度条
            $('.userNameword').show();//姓名
            $('.userPassword').show();//身份证
            $('.lookguild').hide().find('input').val('');//所属行业
            $('.rigTem').show();//行业模板
            $('.lookUsername').show();
            $('.trade').show();
        }

        //第三步角色权限
        function getTree(roleName) {
            var setting = {
                check: {
                    enable: false,
                    chkStyle: "checkbox",
                    radioType: "all",
                    nocheckInherit: true,
                    chkDisabledInherit: true
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    },
                    key: {
                        checked: "Checked"
                    }
                },
                view: {
                    showIcon: true,
                    showLine: true
                }
            };
            var data = {};
            var paras = {
                page: page,
                rows: 1000000,
                roleName: roleName,
                sort: "role_code",
                order: "ASC"
            }
            var trees = reqAjax(USER_URL.ROLEID, JSON.stringify(paras));
            var treeData = trees.data;
            for(var i = 0; i < treeData.length; i++) {
                treeData[i].id = Number(treeData[i].permissionId);
                treeData[i].pid = Number(treeData[i].parentid);
                treeData[i].name = treeData[i].permissionName;
                treeData[i].icon = "";
            }
            treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
            treeObj.expandAll(true);
        }
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