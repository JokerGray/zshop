$(function() {
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var userno = yyCache.get("userno") || "";
        var page = 1;
        var rows = 15;
        var MERNAME = '';
        var TITLE =['完善商户信息', 'font-size:12px;background-color:#424651;color:#fff'];
        var AREA = ['90%','80%'];
        var SHADE = [0.2, '#000'];
        var USER_URL = {
            PROVINCE: 'operations/getProvinceList', //省市接口
            PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
            UPDATE: 'operations/updateMerchantUser', //修改商户信息
            ADDONE: 'operations/addAgentMerchantInfo', //添加商户信息(第一步)
            CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
            ADDSECOND: 'operations/addCMSInfo', //第二步
            INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
            ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
            ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
            ADDTHIRD: 'operations/addAppUserAccountInfo', //(第三部)
            ADDFORTH: 'operations/addMerchantRolePermissionInfo', //(第四步)


            RESETPWD: 'operations/resetMerchantPassword', //(重置)
            CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
            UPDATEINFO: 'operations/findMerchantReferrals', //(查找商户推荐人是否为公司员工)
            UPGRADE: 'operations/merchantUpgradeApply', //商户升级'
            GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取所有推荐关系为公司员工的列表并分页

            RESOURLIST: 'operations/platformUserList', //(查询状态)
            ADDRESOURCE: 'operations/realNameStatus', //(用户实名认证审核)
            CHANGESTATU: 'operations/userStatusToggle', //(状态启用/0 未锁/1 已锁)
            //  RESOURCESIZE : 'operations/upgradeToMerchant', //(升级为商户)
            UPDATEUSER: 'operations/updateSysUser', //(修改用户信息)
            ADDONEAPP: 'operations/appUserAddMerchantInfo', //升级为商户第一步
            LOOKDETAIL: 'operations/getMerchantRegApplyDetail', //(查看详情)
            ADDSECONDAPP: 'operations/appUserAddCMSInfoApprove', //第二步
            ADDTHIRDAPP:'operations/appUserAddRolePermissionApprove'//第三步
        };

        var layer = layui.layer;
        var table = layui.table;
        var form = layui.form;
        var element = layui.element;

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

        form.verify({
            username: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
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
        });
        $('.layui-ul-tab').on('click', 'li', function () {
            $(this).addClass('act').siblings().removeClass('act');
            getTbl()
        })
        //渲染表单
        function getTbl() {
            let objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80,
                        templet: '#titleTpl'
                    }, {
                        title: '手机号',
                        /*sort: true,*/
                        align: 'left',
                        field: 'phone',
                        width: 400
                    }, {
                        title: '商户名',
                        align: 'left',
                        field: 'orgName',
                        width: 400
                    },{
                        title: '操作',
                        fixed: 'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 300
                    }]
                ],

                pageCallback, 'laypageLeft'
            );
        }
        getTbl();

        //表格初始化
        function tableInit(tableId,cols,pageCallback,test) {
            //定义表格 和 翻页属性
            let tableIns, tablePage,page_options;
            tableIns = table.render({
                id:tableId,
                elem: '#' + tableId,
                height: 'full-249',
                cols: cols,
                page: false,
                even: true,
                limit: 15,
                skin: 'row'
            })
            pageCallback(page,rows).done(function (res) {
                if(res.code == 1){
                    //渲染表单
                    tableIns.reload({data:res.data})
                }else{
                    layer.msg(res.msg)
                }
                //3.left table page
                //引用  layui 的page分页
                layui.use('laypage');
                page_options = {
                    elem: test,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                    limits: [15, 30],
                    limit: 15
                }
                page_options.jump = function (obj,first) {
                    //赋值翻页属性
                    tablePage = obj;
                    //首次不执行
                    if(!first){
                        pageCallback(obj.curr,obj.limit).done(function (resTwo) {
                            tableIns.reload({
                                data:resTwo.data,
                                limit:obj.limit
                            })
                        }).fail(function (resTwo) {
                            layer.msg(resTwo.msg)
                        })

                    }
                }
                //渲染分页
                layui.laypage.render(page_options);
                return{
                    tableIns,tablePage
                }
            }).fail(function (res) {
                layer.msg(res.msg);
            })



        }
        // 回调函数
        function pageCallback(index, limit ) {
            let cmd = $('.layui-ul-tab li.act').attr('data-d');
            let merchantPhone =$('#merchantPhone').val() ||'';
            let merchantName = $('#merchantName').val() || '';
            let param = {
                page: index,
                rows: limit,
                phone: merchantPhone,
                orgName: merchantName
            }
            return getData(cmd,JSON.stringify(param))
        }
        // 获取数据
        function getData(cmd,param) {
            let defer =  $.Deferred();
             reqAjaxAsync(cmd,param).done(function (res) {
                let data = res.data;
                $.each(data,function (i,item) {
                    $(this).attr('eq',(i+1));
                });
                 defer.resolve(res);
            });

            return defer.promise();
        }
        function getMername(names) {
            if(names != ''){
                return TITLE =['完善商户信息 - '+names, 'font-size:12px;background-color:#424651;color:#fff'];
            }
        }
        //表格相关操作
        table.on('tool(tableNo)',function (obj) {
            getMername(obj.data.orgName);
            let data = obj.data,innerStep;
            if(obj.event == 'pass'){
                console.log(obj)
                let step = data.step ? data.step : '', //步数
                    sysUserId = data.sysUserId,
                    log = data.log;
                let parm = {sysUserId:sysUserId};

                if(log === "app用户升级为商户-添加商户信息成功!" || log === 'app用户升级为商户-添加头条信息成功!'){//app
                    reqAjaxAsync('operations/findMaxAddAppMerchantLogStep',JSON.stringify(parm)).then(
                        function(res){
                            innerStep = res.data;
                            if(step != innerStep){
                                layer.msg("步数不吻合", { icon: 2, shade: [0.1, '#fff'], offset: '50%' })
                                return
                            }else{
                                doStep(innerStep,2,data);
                        }
                    })
                }else{//商户
                    reqAjaxAsync('operations/findMaxAddMerchantLogStep',JSON.stringify(parm)).then(function(res){
                        innerStep = res.data;
                        if(step != innerStep){
                            layer.msg("步数不吻合", { icon: 2, shade: [0.1, '#fff'], offset: '50%' })
                            return
                        }else{
                            doStep(innerStep,1,data);
                        }
                    })
                }
            }
        })

        function doStep(step,type,data) {
            let secondDemo = $('#secondDemo'),fourDemo;
            let appOneDemo = $('#appOneDemo'),appTwoDemo = fourDemo = $('#fourDemo'),thirdDemo = $('#thirdDemo');

            if(type === 1){ // 1商户 2app
                let dataid = data.sysUserId;
                if(step === 1) {
                    step2(dataid,secondDemo,thirdDemo,fourDemo)
                }else if(step === 2){
                    step3(dataid,thirdDemo,fourDemo)
                }else if(step === 3){
                    step4(dataid,fourDemo)
                }
            }else if(type ===2){//app 用户
                let oldId = data.sysUserId;
                if(step === 1){
                    appstep2(oldId,appOneDemo,fourDemo)
                }else if(step === 2){
                    appstep3(oldId,fourDemo)
                }
            }

        }
        function step2(dataid,secondDemo,thirdDemo,fourDemo){
            layer.open({
                title: TITLE,
                type: 1,
                content:secondDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                closeBtn: 1,
                btn: ['下一步'],
                shade: SHADE,
                end:function () {
                    secondDemo.find('input').val('');
                    secondDemo.find('select').val('');

                },
                success:function () {
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit", "");
                    $("a.layui-layer-btn0").attr("lay-filter", "formdemo3");

                    //频道类型
                    let raw = reqAjax(USER_URL.CONFIG, {});

                    if(raw.code === 1) {
                        let data = raw.data.cmsChannelList;
                        let sHtmldept = '';
                        $.each(data, function(i, item) {
                            sHtmldept += "<option value='" + item.channelId + "'>" + item.channelName + "</option>";
                        });
                        $('#fixdepartment').html(sHtmldept);
                        form.render();
                    } else {
                        layer.msg(raw.msg);
                    }

                },
                yes:function (index) {
                    form.on('submit(formdemo3)',function (err) {
                        if(err) {
                            var subscriptionName = $.trim($("#addName").val());
                            var subscriptionTypeId = $("#fixdepartment").val();
                            var subscriptionSynopsis = $.trim($("#addnote").val());
                            var pam = {
                                sysUserId: dataid,
                                subscriptionName: subscriptionName,
                                subscriptionTypeId: subscriptionTypeId,
                                subscriptionSynopsis: subscriptionSynopsis
                            }
                            reqAjaxAsync(USER_URL.ADDSECOND, JSON.stringify(pam)).done(function(res1) {
                                layer.close(index);
                                var sysUserId1 = res1.data; //app用户ID
                                $("#addMervhant").attr("data-sysId1", sysUserId1);
                                step3(dataid,thirdDemo,fourDemo);
                            })
                        }
                    })
                }

            })
        }
        function step3(dataid,thirdDemo,fourDemo){
            layer.open({
                title: TITLE,
                type: 1,
                content: thirdDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                closeBtn: 1,
                btn: ['下一步'],
                shade: SHADE,
                end: function() {
                    $('#userDemo').hide();
                },
                success: function(layero, index) {
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit", "");
                    $("a.layui-layer-btn0").attr("lay-filter", "formdemo4");
                },
                yes: function(index, layero) {
                    form.on('submit(formdemo4)', function(data) {
                        if(data) {
                            var balance = $.trim($("#addmoney").val());

                            //金额正则
                            var mony = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                            if(!mony.test(balance)){
                                layer.alert("请输入正确的金额");
                                $("#addmoney").val("");
                                return;
                            }

                            var pm = {
                                'sysUserId': dataid,
                                balance: balance
                            }
                            console.log(pm)
                            reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pm)).done(function(res2) {
                                if(res2.code == 1) {
                                    layer.msg(res2.msg);
                                    layer.close(index);
                                    var oldId = res2.data;
                                    $("#addMervhant").attr("data-sysId2", oldId);
                                    //第四步
                                    step4(dataid,fourDemo)
                                    //4end
                                } else {
                                    layer.msg(res2.msg);
                                }
                            });
                        }
                        return false;
                    })
                },
            })

        }
        function step4(dataid,fourDemo){
            layer.open({
                title:TITLE,
                type: 1,
                content: fourDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                closeBtn: 1,
                btn: ['保存'],
                shade: SHADE,
                offset: '100px',
                end: function() {
                    $('#fourDemo').hide();
                },
                success: function(layero, index) {
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
                            sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</li>";
                        });
                        $('#mervchantRole').html(sHtmldept);
                        $('#mervchantRole').find("li").eq(0).addClass("aee");

                        var roleName = $('#mervchantRole').find("li.aee").text();
                        getTree(roleName,'merchant');
                        $('#mervchantRole').on("click", "li", function() {
                            var name = $(this).text();
                            $('#mervchantRole li').removeClass("aee");
                            $(this).addClass("aee");
                            getTree(name,'merchant');
                        });
                    } else {
                        layer.msg(res01.msg);
                    }
                },
                yes: function(index, layero) {
                    var odId = $("#addMervhant").attr("data-sysId2");
                    var pram = {
                        sysUserId: dataid
                    }
                    reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function(res3) {
                        if(res3.code == 1) {
                            layer.msg(res3.msg);
                            layer.close(index);
                            var username = $.trim($("#phone").val());
                            var locked = $("#statusSelector").val();
                            var provinceId = $("#provinceSelector1").val();
                            var cityId = $("#citySelector1").val();
                            getTbl()
                        } else {
                            layer.msg(res3.msg);
                        }
                    })
                }

            })
        }


        function appstep2(oldId,oneDemo,fourDemo){
            layer.open({
                title: TITLE,
                type: 1,
                content: oneDemo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                closeBtn: 1,
                btn: ['下一步'],
                shade: SHADE,
                end:function () {
                    oneDemo.find('input').val('');
                    oneDemo.find('select').val('');
                },
                success:function () {
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit", "");
                    $("a.layui-layer-btn0").attr("lay-filter", "formdemo5");

                    //频道类型
                    var raw = reqAjax(USER_URL.CONFIG, "");
                    if(raw.code == 1) {
                        var data = raw.data.cmsChannelList;
                        var sHtmldept = '';
                        $.each(data, function(i, item) {
                            sHtmldept += "<option value='" + item.channelId + "'>" + item.channelName + "</option>";
                        });
                        $('#fixdepartmentAPP').html(sHtmldept);
                        form.render();
                    } else {
                        layer.msg(raw.msg);
                    }
                },
                yes:function (index,layero) {
                    form.on('submit(formdemo5)', function(data) {
                        if(data){
                            var subscriptionName = $.trim($("#addNameAPP").val()); //个人频道名称
                            var subscriptionTypeId = $("#subscriptionAPP").find("dl dd.layui-this").attr("lay-value"); //个人频道类型ID
                            if(subscriptionName.indexOf("script") != -1) {
                                $("#addNameAPP").val("");
                                layer.msg("请输入正确的个人频道名称");
                                return;
                            }
                            var params = {
                                appUserId: oldId,
                                subscriptionName: subscriptionName,
                                subscriptionTypeId: subscriptionTypeId
                            }
                        }
                        reqAjaxAsync(USER_URL.ADDSECONDAPP, JSON.stringify(params)).done(function(res){
                            layer.msg(res.msg);
                            layer.close(index);
                            appstep3(oldId,fourDemo)
                        })
                    })

                }
            })
        }
        function appstep3(dataid,ids) {
            step4(dataid,ids)
        }
        //第三步角色权限
        function getTree(roleName,type) {
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
            if(type == 'app'){
                treeObj = $.fn.zTree.init($("#treedemAPP"), setting, treeData);
                treeObj.expandAll(true);
            }else if(type == 'merchant'){
                treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
                treeObj.expandAll(true);
            }

        }


        //搜索条件进行搜索
        $('#toolSearch').on('click', function() {
            getTbl();
        })

        //重置
        $("#toolRelize").click(function() {
            $("#merchantPhone").val("");
            $("#merchantName").val("");
            getTbl();
        });
    })


})