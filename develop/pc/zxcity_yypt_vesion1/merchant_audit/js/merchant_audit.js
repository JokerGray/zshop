(function ($) {
    var page = 1;
    var rows = 15;
    var userNo = yyCache.get("userno") || "";
    var pid = '';
    var imgPath = "../common/image/placeholder.png"
    var USER_URL = {
        RESOURLIST: 'operations/queryMerchantRegApplyPage', //(查询列表)
        LOOKDETAIL: 'operations/getMerchantRegApplyDetail', //(查看详情)
        PROVINCE: 'operations/getBaseAreaInfoByCode', //省'
        DELUSER: 'operations/approvalMerchantRegApply', //审核是否通过
        ADDONE: 'operations/addMerchantInfoApprove', //添加商户信息
        CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
        TEMPLET: 'operations/getAllMerchantTradeTemplateList',//行业模板接口
        ADDSECOND: 'operations/addCMSInfoApprove', //第二步
        INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
        ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
        ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
        ADDTHIRD: 'operations/addRolePermissionApprove', //(第三部)
        ADDFORTH: 'operations/addMerchantRegApprove', //(第四步)
        ISALLOWEND: 'operations/isAllowedMerchantReg', //是否运行通过审核参数：{id:""}
        MERCHANREGBACK: 'operations//merchantRegBackUserResign',//商户普通员工办理离职接口：{id:""}
        GETSCTRADEBYID:'operations/getScTradeProcessByMerchantTradeId',//根据行业ID查询行业流程配置

    };

    var layer = layui.layer;
    var table = layui.table,laypage = layui.laypage;
    var form;
    layui.use('form', function () {
        form = layui.form;
    })
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


    $('.zImg').click(function () {
        var src = $(this).prop('src');
        window.open(src);
    })

    //加载行业
    function getConfig() {
        reqAjaxAsync(USER_URL.CONFIG, "").done(function (res) {
            console.log(res)
            if (res.code === 1) {
                var row = res.data.regularTypeList;
                //行业
                var bHtml = "";
                $.map(row, function (n, index) {
                    bHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
                })
                $(".regular").html(bHtml);
                form.render();
            }
        });
    }

    // getConfig()

    //日期选择
    $('#datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function (ev) {
        var startTime = ev.date.valueOf();
        var endTime = $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time', startTime);
        $("#datetimepicker2 .datepicker").hide();
    });

    $('#datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function (ev) {
        var startTime = ev.date.valueOf();
        var endTime = $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time', startTime);
        $("#datetimepicker1 .datepicker").hide();
    });

    //tab切换
    $(".tab-title").on("click", 'ul li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        var list = $(".table-lt .table-list");
        getTbl()

    });

    //渲染表单
    function getTbl() {
        var objs = tableInit('tableNo', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80,
                }, {
                    title: '账号',
                    align: 'left',
                    field: 'usercode',
                    width: 200
                }, {
                    title: '商户名称',
                    align: 'left',
                    field: 'merchantName',
                    width: 200
                }, {
                    title: '手机号',
                    align: 'left',
                    field: 'phoneNumber',
                    width: 200
                },{
                    title: '管理员名称',
                    align: 'left',
                    field: 'username',
                    width: 200
                }, {
                    title: '所属行业',
                    align: 'left',
                    field: 'tradename',
                    width: 150
                }, {
                    title: '审核状态',
                    align: 'left',
                    field: 'statuname',
                    width: 150
                }, {
                    title: '注册时间',
                    align: 'left',
                    field: 'createTime',
                    width: 200
                }, {
                    title: '操作',
                    fixed: 'right',
                    align: 'left',
                    toolbar: '#barDemo',
                    width: 220
                }]
            ],

            pageCallback, 'laypageLeft'
        );
    }

    //初始化加载未审核
    getTbl();
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
            limit: 15,
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
    //左侧表格数据处理
    function getData(url, parms) {
        return reqAjaxAsync(url, parms).done(function (res) {
            var data = res.data;

            var merchantTrade = [];
            var res1 = reqAjax(USER_URL.CONFIG);
            var merchantTrade = res1.data.merchantTrade

            if (res1.code === 1) {
                var row = res1.data.regularTypeList;
                //行业
                var bHtml = "";
                $.map(row, function (n, index) {
                    bHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
                })
                $(".regular").html(bHtml);
                form.render();
            }

            $.each(data, function (i, item) {
                $(item).attr('eq', (i + 1));
                // $(item).attr('merchantname', '普通商户');
                $(item).attr('createTime', item.createTime.slice(0, item.createTime.length - 2))
                if (item.status == 0) {
                    $(item).attr('statuname', '待审核');
                } else if (item.status == 1) {
                    $(item).attr('statuname', '审核通过');
                } else if (item.status == 2) {
                    $(item).attr('statuname', '审核拒绝');
                }
                ;
                $.each(merchantTrade, function (u, utem) {
                    if (item.trade == utem.value) {
                        $(item).attr('tradename', utem.name);
                    }
                })
            });
        })
    }

    //pageCallback回调
    function pageCallback(index, limit) {
        var merchantName = $.trim($('#merchantName').val()) || '';
        var phoneNumber = $.trim($('#phoneNumber').val())|| '';
        var createTimeBegin = $('#jurisdiction-begin').val() || '';
        var createTimeEnd = $('#jurisdiction-end').val() || '';
        var status = $('.tab-title li.active').attr('data-num')
        var param = {
            page: index,
            rows: limit,
            phoneNumber: phoneNumber, //手机号
            merchantName:merchantName,
            createTimeBegin: createTimeBegin, //申请时间起
            createTimeEnd: createTimeEnd, //申请时间止
            status: status //审核状态-1代表已审，0代表未审
        }

        return getData(USER_URL.RESOURLIST, JSON.stringify(param));
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
        for (var i = 0; i < treeData.length; i++) {
            treeData[i].id = Number(treeData[i].permissionId);
            treeData[i].pid = Number(treeData[i].parentid);
            treeData[i].name = treeData[i].permissionName;
            treeData[i].icon = "";
        }
        treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
        treeObj.expandAll(true);
    }

    //未审核相关处理
    table.on('tool(tableNo)', function (obj) {
        var data = obj.data;
        var oldId = data.id;
        var step = data.step || 0;
        //查看
        if (obj.event === 'nodetail') {
            layer.open({
                title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['850px', '590px'],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                end: function () {
                    $('#lookDemo').hide();
                    $("#lookDemo").find("input").val("");
                    $("#lookDemo").find(".busimg").attr("src", "");
                    $('#templet').val("").prop('disabled', false);
                    $('#rigTem').show();
                    $('.userinfoo').show();
                },
                success: function (layero, index) {
                    $(".looktit").hide();
                    $('div.userinfoo').hide();
                    $('.look').show();
                    $('.pass').hide();
                    $('#lookguild').val(data.tradename);
                    $('#rigTem').hide();
                    $('.userinfoo').hide();
                    form.render();
                    var param = {
                        id: oldId
                    }

                    reqAjaxAsync(USER_URL.LOOKDETAIL, JSON.stringify(param)).done(function (res) {

                        if (res.code == 1) {
                            var row = res.data;
                            console.log(row)
//							$("#templet").html(bHtml);
//							$('#templet').val(row.templet).attr('disabled',true);
                            $("#lookName").val(row.usercode);
                            $("#lookpwd").val('******');
                            $("#lookdesig").val(row.merchantName);
                            $("#looktype").val('普通');
                            $("#lookbuss").attr("src", row.licenseFront||imgPath);
                            $("#lookbussback").attr("src", row.licenseBack||imgPath);
                            $("#lookid").attr("src", row.idCardFront||imgPath);
                            $("#lookidback").attr("src", row.idCardBack||imgPath);
                            $('#lookUsername').val(row.username)
                            //省
                            var param = {
                                code: row.provinceId
                            }
                            var req = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
                            if (req.code == 1) {
                                $("#lookprovi").val(req.data.areaname);
                            } else {
                                layer.msg(req.msg);
                            }
                            //市
                            var params = {
                                code: row.cityId
                            }
                            var reqs = reqAjax(USER_URL.PROVINCE, JSON.stringify(params));
                            if (req.code == 1) {
                                $("#lookcity").val(reqs.data.areaname);
                            } else {
                                layer.msg(req.msg);
                            }
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                }
            })
        }
//		else if(obj.event === 'appnodetail') {
//			var sysUserId = data.sysUserId;
//			//申请人详情
//			layer.open({
//				title: ['申请人详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
//				type: 1,
//				content: $('#appDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
//				area: ['800px', '590px'],
//				closeBtn: 1,
//				shade: [0.1, '#fff'],
//				end: function() {
//					$('#appDemo').hide();
//					$("#appDemo").find("input").val("");
//					$("#appDemo").find(".busimg").attr("src", "");
//				},
//				success: function(layero, index) {
//
//					var param = {
//						userId: sysUserId
//					}
//					reqAjaxAsync(USER_URL.INFORMATION, JSON.stringify(param)).done(function(res) {
//						if(res.code == 1) {
//							var row = res.data;
//							var row = res.data;
//							var body = layer.getChildFrame('body', index);
//							var phone = (row.user.phone == null ? "" : row.user.phone);
//							var username = (row.user.username == null ? "" : row.user.username);
//							var residence = (row.user.residence == null ? "" : row.user.residence);
//							var userbirth = (row.user.userbirth == null ? "" : row.user.userbirth);
//							var usersex = (row.user.usersex == null ? "" : row.user.usersex);
//							var remark = (row.user.remark == null ? "" : row.user.remark);
//							var adress = (row.address == null ? "" : row.address);
//							var name = (adress.name == null ? "" : adress.name);
//							var mail = (adress.mail == null ? "" : adress.mail);
//							var identificationno = (adress.identificationno == null ? "" : adress.identificationno);
//							var cardFrontPhoto = (adress.cardFrontPhoto == null ? "" : adress.cardFrontPhoto);
//							var cardHoldPhoto = (adress.cardHoldPhoto == null ? "" : adress.cardHoldPhoto);
//							var cardBackPhoto = (adress.cardBackPhoto == null ? "" : adress.cardBackPhoto);
//							$("#infoAccount").val(phone);
//							$("#infoName").val(username);
//							$("#infoCity").val(residence);
//							$("#infoBirthday").val(userbirth);
//							$("#infoSex").val(usersex);
//							$("#infoTag").val(remark);
//							$("#infotrueName").val(name);
//							$("#infoEmail").val(mail);
//							$("#infoNumber").val(identificationno);
//							$("#infoIDz").attr("src", cardFrontPhoto);
//							$("#infoIDhand").attr("src", cardHoldPhoto);
//							$("#infoIDf").attr("src", cardBackPhoto);
//						} else {
//							layer.msg(res.msg);
//						}
//					});
//				}
//			})
//		} 
        else if (obj.event === 'del') {
            //不通过
            layer.open({
                title: ['审核意见', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['850px', '300px'],
                closeBtn: 1,
                shade: [0.1, '#fff'],
                btn: ['完成'],
                end: function () {
                    $('#fourDemo').hide();
                },
                success: function (layero, index) {
                    //给保存按钮添加form属性
                    $("div.layui-layer-page").addClass("layui-form");
                    $("a.layui-layer-btn0").attr("lay-submit", "");
                    $("a.layui-layer-btn0").attr("lay-filter", "formdemo4");
                },
                yes: function (index, layero) {
                    form.on('submit(formdemo4)', function (data) {
                        if (data) {
                            var approveMsg = $.trim($("#addAudit").val());
                            var paramDel = {
                                id: oldId,
                                userNo: userNo,
                                status: 2,
                                approveMsg: approveMsg
                            };
                            reqAjaxAsync(USER_URL.DELUSER, JSON.stringify(paramDel)).done(function (res) {
                                if (res.code == 1) {
                                    layer.msg("审核不通过");
                                    layer.close(index);
                                    getTbl();
                                } else {
                                    layer.msg(res.msg);
                                }
                            });
                        }
                        return false; //阻止页面刷新
                    })
                }

            })
        }
        else if (obj.event === 'change') {
            var uname = data.username;
            var id = data.id;
            var param = {
                'id': id
            };
            param = JSON.stringify(param);
            var res = reqAjax(USER_URL.ISALLOWEND, param);
            if (res.code == 9) {
                layer.alert(res.msg);
                return;
            } else if (res.code == 8) {
                layer.confirm('是否办理离职？', {
                    icon: 3,
                    btn: ['办理', '取消']
                }, function (index) {
                    var lzRes = reqAjax(USER_URL.MERCHANREGBACK, param);
                    layer.alert(lzRes.msg)
                    layer.close(index);
                });
                return;
            }
            if (step == 0) {
                //通过
                layer.open({
                    title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                    type: 1,
                    content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['850px', '650px'],
                    closeBtn: 1,
                    shade: [0.1, '#fff'],
                    btn: ['下一步'],
                    end: function () {
                        $('#lookDemo').hide().find('input').val('');
                        $('.xiadan_box').hide();
                        xuan = 1;
                    },
                    success: function (layero, index) {
                        $('#regular').val(6);
                        $(".looktit").show();
                        $('div.userinfoo').show();
                        $('.look').hide();
                        $('.pass').show();
                        $('#shopName').val(data.shopName);
                        reqAjaxAsync(USER_URL.CONFIG, "").done(function (res) {
                            console.log(res)
                            var row = res.data.merchantTrade;
                            //行业
                            var bHtml = "";
                            $.map(row, function (n, index) {
                                bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
                            })
                            $("#trade").html(bHtml);
                            $('#trade').val(data.trade)

                            setSctradeById($("#trade").val())
                            form.render();
                        });
                        reqAjaxAsync(USER_URL.TEMPLET, "").done(function (res) {
                            var row = res.data;
                            //模板
                            var bHtml = "";
                            $.map(row, function (n, index) {
                                bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
                            })
                            $("#templet").html(bHtml);
                            $('#templet').val('1').attr('disabled', false);
                            form.render();
                        });
                        var param = {
                            id: oldId
                        }
                        reqAjaxAsync(USER_URL.LOOKDETAIL, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                var row = res.data;
                                $("#lookName").val(row.usercode);
                                $("#lookpwd").val('******');
                                $("#lookdesig").val(row.merchantName);
                                $("#looktype").val('普通');
                                $("#lookbuss").attr("src", row.licenseFront ||imgPath);
                                $("#lookbussback").attr("src", row.licenseBack || imgPath);
                                $("#lookid").attr("src", row.idCardFront  ||imgPath);
                                $("#lookidback").attr("src", row.idCardBack  ||imgPath);
                                $('#lookUsername').val(row.username);

                                //省
                                var param = {
                                    code: row.provinceId
                                }
                                var req = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
                                if (req.code == 1) {
                                    $("#lookprovi").val(req.data.areaname);
                                } else {
                                    layer.msg(req.msg);
                                }
                                //市
                                var params = {
                                    code: row.cityId
                                }
                                var reqs = reqAjax(USER_URL.PROVINCE, JSON.stringify(params));
                                if (reqs.code == 1) {
                                    $("#lookcity").val(reqs.data.areaname);
                                } else {
                                    layer.msg(reqs.msg);
                                }
                            } else {
                                layer.msg(res.msg);
                            }
                            $('div.layui-layer-page').addClass('layui-form')
                            $('a.layui-layer-btn0').attr('lay-submit', '');
                            $('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
                            form.render()
                        });
                        var flag = true;

                        $('div.busimg>div>img').click(function () {
                            if (flag) {
                                $(this).addClass('act')

                            } else {
                                $(this).removeClass('act')
                            }
                            flag = !flag
                        })
                    },
                    yes: function (index, layero) {


                        form.on('submit(formDemo)', function (done) {
                            var name = $('#userNameword').val();
                            var trade = $('#trade').val();
                            var identificationno = $('#userPassword').val();
                            var templet = $('#templet').val();

                            var param = {
                                id: oldId,
                                name: name,
                                trade: trade,//行业
                                templateId: templet,
                                identificationno: identificationno,
                                regular: $('#regular').val(),//类型
                                userSex:$('input[name="userSex"]:checked').attr('title')
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

                            reqAjaxAsync(USER_URL.ADDONE, JSON.stringify(param)).done(function (res) {
                                if (res.code == 1) {
                                    layer.close(index);
                                    getTbl();
                                    //第二步
                                    layer.open({
                                        title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                        type: 1,
                                        content: $('#secondDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                        area: ['850px', '600px'],
                                        closeBtn: 1,
                                        shade: [0.1, '#fff'],
                                        btn: ['下一步'],
                                        end: function () {
                                            $('#secondDemo').hide();
                                            $("#addName").val("");
                                        },
                                        success: function (layero, index) {
                                            $(".looktit").show();
                                            $("#addName").val(uname);
                                            //给保存按钮添加form属性
                                            $("div.layui-layer-page").addClass("layui-form");
                                            $("a.layui-layer-btn0").attr("lay-submit", "");
                                            $("a.layui-layer-btn0").attr("lay-filter", "formdemo1");
                                            //频道类型
                                            var raw = reqAjax(USER_URL.CONFIG, "");
                                            if (raw.code == 1) {
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
                                        },
                                        yes: function (index, layero) {
                                            //form监听事件
                                            form.on('submit(formdemo1)', function (data) {
                                                if (data) {
                                                    var id = oldId;
                                                    var subscriptionName = $.trim($("#addName").val()); //头条名
                                                    var subscriptionTypeId = $("#subscription").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //头条类型ID
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
                                                            getTbl();
                                                            //第三步
                                                            layer.open({
                                                                title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                                                type: 1,
                                                                content: $('#thirdDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                                                area: ['850px', '600px'],
                                                                closeBtn: 1,
                                                                shade: [0.1, '#fff'],
                                                                btn: ['下一步'],
                                                                end: function () {
                                                                    $('#thirdDemo').hide();
                                                                },
                                                                success: function (layero, index) {
                                                                    $(".looktit").show();
                                                                    //角色名称
                                                                    var pm1 = {
                                                                        page: page,
                                                                        rows: 15
                                                                    }
                                                                    var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
                                                                    if (res01.code == 1) {
                                                                        var datarole = res01.data;
                                                                        var sHtmldept = '';
                                                                        $.each(datarole, function (i, item) {
                                                                            sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
                                                                        });
                                                                        $('#mervchantRole').html(sHtmldept);
                                                                        $('#mervchantRole').find("li").eq(0).addClass("aee");
                                                                        var roleName = $('#mervchantRole').find("li.aee").text();
                                                                        getTree(roleName);
                                                                        $('#mervchantRole').on("click", "li", function () {
                                                                            var name = $(this).text();
                                                                            $('#mervchantRole li').removeClass("aee");
                                                                            $(this).addClass("aee");
                                                                            getTree(name);
                                                                        });
                                                                    } else {
                                                                        layer.msg(res01.msg);
                                                                    }
                                                                },
                                                                yes: function (index, layero) {
                                                                    var pram = {
                                                                        id: oldId
                                                                    }
                                                                    reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pram)).done(function (res3) {
                                                                        if (res3.code == 1) {
                                                                            layer.close(index);
                                                                            getTbl();
                                                                            //第四步
                                                                            layer.open({
                                                                                title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                                                                type: 1,
                                                                                content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                                                                area: ['850px', '300px'],
                                                                                closeBtn: 1,
                                                                                btn: ['完成'],
                                                                                shade: [0.1, '#fff'],
                                                                                end: function () {
                                                                                    $('#fourDemo').hide();
                                                                                },
                                                                                success: function (layero, index) {
                                                                                    //给保存按钮添加form属性
                                                                                    $("div.layui-layer-page").addClass("layui-form");
                                                                                    $("a.layui-layer-btn0").attr("lay-submit", "");
                                                                                    $("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
                                                                                },
                                                                                yes: function (index, layero) {
                                                                                    form.on('submit(formdemo2)', function (data) {
                                                                                        if (data) {
                                                                                            var approveMsg = $.trim($("#addAudit").val());
                                                                                            var pram = {
                                                                                                id: oldId,
                                                                                                status: 1, //审批状态:0-审批中; 1-审批通过；2-审批拒绝
                                                                                                approveMsg: approveMsg //审批信息
                                                                                            }
                                                                                            reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function (res3) {
                                                                                                if (res3.code == 1) {
                                                                                                    layer.msg("审核通过");
                                                                                                    layer.close(index);
                                                                                                    getTbl();
                                                                                                } else {
                                                                                                    layer.msg(res3.msg);
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                        return false; //阻止页面刷新
                                                                                    })
                                                                                }

                                                                            })
                                                                        } else {
                                                                            layer.msg(res3.msg);
                                                                        }
                                                                    })
                                                                }

                                                            })

                                                        } else {
                                                            layer.msg(res1.msg);
                                                        }
                                                    })
                                                }
                                                return false; //阻止刷新页面
                                            });
                                        }
                                    })

                                } else {
                                    layer.msg(res.msg);
                                }
                            });
                        })

                    }
                })
            } else if (step == 1) {
                //第二步
                layer.open({
                    title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                    type: 1,
                    content: $('#secondDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['850px', '600px'],
                    closeBtn: 1,
                    btn: ['下一步'],
                    shade: [0.1, '#fff'],
                    end: function () {
                        $('#secondDemo').hide();
                        $("#addName").val("");
                    },
                    success: function (layero, index) {
                        $(".looktit").show();
                        $("#addName").val(uname);
                        //给保存按钮添加form属性
                        $("div.layui-layer-page").addClass("layui-form");
                        $("a.layui-layer-btn0").attr("lay-submit", "");
                        $("a.layui-layer-btn0").attr("lay-filter", "formdemo1");
                        //频道类型
                        var raw = reqAjax(USER_URL.CONFIG, "");
                        if (raw.code == 1) {
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
                    },
                    yes: function (index, layero) {
                        //form监听事件
                        form.on('submit(formdemo1)', function (data) {
                            if (data) {
                                var id = oldId;
                                var subscriptionName = $.trim($("#addName").val()); //头条名
                                var subscriptionTypeId = $("#subscription").find(".layui-anim-upbit dd.layui-this").attr("lay-value"); //头条类型ID
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
                                        getTbl();
                                        //第三步
                                        layer.open({
                                            title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                            type: 1,
                                            content: $('#thirdDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                            area: ['850px', '600px'],
                                            closeBtn: 1,
                                            shade: [0.1, '#fff'],
                                            btn: ['下一步'],
                                            end: function () {
                                                $('#thirdDemo').hide();
                                            },
                                            success: function (layero, index) {
                                                $(".looktit").show();
                                                //角色名称
                                                var pm1 = {
                                                    page: page,
                                                    rows: 15
                                                }
                                                var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
                                                if (res01.code == 1) {
                                                    var datarole = res01.data;
                                                    var sHtmldept = '';
                                                    $.each(datarole, function (i, item) {
                                                        sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
                                                    });
                                                    $('#mervchantRole').html(sHtmldept);
                                                    $('#mervchantRole').find("li").eq(0).addClass("aee");
                                                    var roleName = $('#mervchantRole').find("li.aee").text();
                                                    getTree(roleName);
                                                    $('#mervchantRole').on("click", "li", function () {
                                                        var name = $(this).text();
                                                        $('#mervchantRole li').removeClass("aee");
                                                        $(this).addClass("aee");
                                                        getTree(name);
                                                    });
                                                } else {
                                                    layer.msg(res01.msg);
                                                }
                                            },
                                            yes: function (index, layero) {
                                                var pram = {
                                                    id: oldId
                                                }
                                                reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pram)).done(function (res3) {
                                                    if (res3.code == 1) {
                                                        layer.close(index);
                                                        var inx = $(".tab-title li.active").index();
                                                        var merchantName = $.trim($("#merchantName").val());
                                                        var createTimeBegin = $("#jurisdiction-begin").val();
                                                        var createTimeEnd = $("#jurisdiction-end").val();
                                                        getTbl();
                                                        //第四步
                                                        layer.open({
                                                            title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                                            type: 1,
                                                            content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                                            area: ['850px', '300px'],
                                                            closeBtn: 1,
                                                            btn: ['完成'],
                                                            shade: [0.1, '#fff'],
                                                            end: function () {
                                                                $('#fourDemo').hide();
                                                            },
                                                            success: function (layero, index) {
                                                                //给保存按钮添加form属性
                                                                $("div.layui-layer-page").addClass("layui-form");
                                                                $("a.layui-layer-btn0").attr("lay-submit", "");
                                                                $("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
                                                            },
                                                            yes: function (index, layero) {
                                                                form.on('submit(formdemo2)', function (data) {
                                                                    if (data) {
                                                                        var approveMsg = $.trim($("#addAudit").val());
                                                                        var pram = {
                                                                            id: oldId,
                                                                            status: 1, //审批状态:0-审批中; 1-审批通过；2-审批拒绝
                                                                            approveMsg: approveMsg //审批信息
                                                                        }
                                                                        reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function (res3) {
                                                                            if (res3.code == 1) {
                                                                                layer.msg("审核通过");
                                                                                layer.close(index);
                                                                                getTbl();
                                                                            } else {
                                                                                layer.msg(res3.msg);
                                                                            }
                                                                        })
                                                                    }
                                                                    return false; //阻止页面刷新
                                                                })
                                                            }

                                                        })
                                                    } else {
                                                        layer.msg(res3.msg);
                                                    }
                                                })
                                            }

                                        })

                                    } else {
                                        layer.msg(res1.msg);
                                    }
                                })
                            }
                            return false; //阻止刷新页面
                        });
                    }
                })
            } else if (step == 2) {
                //第三步
                layer.open({
                    title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                    type: 1,
                    content: $('#thirdDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['850px', '600px'],
                    closeBtn: 1,
                    shade: [0.1, '#fff'],
                    btn: ['下一步'],
                    end: function () {
                        $('#thirdDemo').hide();
                    },
                    success: function (layero, index) {
                        $(".looktit").show();
                        //角色名称
                        var pm1 = {
                            page: page,
                            rows: 15
                        }
                        var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
                        if (res01.code == 1) {
                            var datarole = res01.data;
                            var sHtmldept = '';
                            $.each(datarole, function (i, item) {
                                sHtmldept += "<li data-id='" + item.id + "'>" + item.roleName + "</option>";
                            });
                            $('#mervchantRole').html(sHtmldept);
                            $('#mervchantRole').find("li").eq(0).addClass("aee");
                            var roleName = $('#mervchantRole').find("li.aee").text();
                            getTree(roleName);
                            $('#mervchantRole').on("click", "li", function () {
                                var name = $(this).text();
                                $('#mervchantRole li').removeClass("aee");
                                $(this).addClass("aee");
                                getTree(name);
                            });
                        } else {
                            layer.msg(res01.msg);
                        }
                    },
                    yes: function (index, layero) {
                        var pram = {
                            id: oldId
                        }
                        reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pram)).done(function (res3) {
                            if (res3.code == 1) {
                                layer.close(index);
                                getTbl();
                                //第四步
                                layer.open({
                                    title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                                    type: 1,
                                    content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                    area: ['850px', '300px'],
                                    closeBtn: 1,
                                    btn: ['完成'],
                                    shade: [0.1, '#fff'],
                                    end: function () {
                                        $('#fourDemo').hide();
                                    },
                                    success: function (layero, index) {
                                        //给保存按钮添加form属性
                                        $("div.layui-layer-page").addClass("layui-form");
                                        $("a.layui-layer-btn0").attr("lay-submit", "");
                                        $("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
                                    },
                                    yes: function (index, layero) {
                                        form.on('submit(formdemo2)', function (data) {
                                            if (data) {
                                                var approveMsg = $.trim($("#addAudit").val());
                                                var pram = {
                                                    id: oldId,
                                                    status: 1, //审批状态:0-审批中; 1-审批通过；2-审批拒绝
                                                    approveMsg: approveMsg //审批信息
                                                }
                                                reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function (res3) {
                                                    if (res3.code == 1) {
                                                        layer.msg("审核通过");
                                                        layer.close(index);
                                                       
                                                        getTbl();
                                                    } else {
                                                        layer.msg(res3.msg);
                                                    }
                                                })
                                            }
                                            return false; //阻止页面刷新
                                        })
                                    }

                                })
                            } else {
                                layer.msg(res3.msg);
                            }
                        })
                    }

                })
            } else if (step == 3) {
                //第四步
                layer.open({
                    title: ['完善商户信息', 'font-size:12px;background-color:#0678CE;color:#fff'],
                    type: 1,
                    content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['850px', '300px'],
                    closeBtn: 1,
                    btn: ['完成'],
                    shade: [0.1, '#fff'],
                    end: function () {
                        $('#fourDemo').hide();
                    },
                    success: function (layero, index) {
                        //给保存按钮添加form属性
                        $("div.layui-layer-page").addClass("layui-form");
                        $("a.layui-layer-btn0").attr("lay-submit", "");
                        $("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
                    },
                    yes: function (index, layero) {
                        form.on('submit(formdemo2)', function (data) {
                            if (data) {
                                var approveMsg = $.trim($("#addAudit").val());
                                var pram = {
                                    id: oldId,
                                    status: 1, //审批状态:0-审批中; 1-审批通过；2-审批拒绝
                                    approveMsg: approveMsg //审批信息
                                }
                                reqAjaxAsync(USER_URL.ADDFORTH, JSON.stringify(pram)).done(function (res3) {
                                    if (res3.code == 1) {
                                        layer.msg("审核通过");
                                        layer.close(index);
                                        getTbl();
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
        }
    });
    //点击顶部搜索出现各搜索条件
    $('#search').on('click', function () {
        $('#search-tool').slideToggle(200)
    });

    //搜索条件进行搜索
    $('#toolSearch').on('click', function () {
        var begintime = $("#datetimepicker1").attr("data-time");
        var endTime = $("#datetimepicker2").attr("data-time");
        if (begintime != "" && endTime != "") {
            if (begintime > endTime) {
                layer.msg("截至时间不能早于开始时间哟");
            } else {
                getTbl();
            }
        } else {
            getTbl();
        }
    })

    //重置
    $("#toolRelize").click(function () {
        $("#merchantName").val("");
        $("#jurisdiction-begin").val("");
        $("#jurisdiction-end").val("");
        $("#datetimepicker1").attr("data-time", "");
        $("#datetimepicker2").attr("data-time", "");
        $('#phoneNumber').val('');
        getTbl()
    });
})(jQuery);