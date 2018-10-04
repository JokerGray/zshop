$(function() {
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {

        var AREA = ['70%', '90%'];
        var TITLE = ['完善商户信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var WIDTH = 120;
        var USER_URL = {
            RESOURLIST: 'operations/platformUserList', //(查询状态)
            ADDRESOURCE: 'operations/realNameStatus', //(用户实名认证审核)
            CHANGESTATU: 'operations/userStatusToggle', //(状态启用/0 未锁/1 已锁)
            //  RESOURCESIZE : 'operations/upgradeToMerchant', //(升级为商户)
            CHANGEMERCHANT:'operations/updateAppText',//新增或者修改商户
            INFORMATION: 'operations/sysUserDetails', //(获取App用户详细信息)
            UPDATEUSER: 'operations/updateSysUser', //(修改用户信息)
            ADDONE: 'operations/appUserAddMerchantInfo', //升级为商户第一步
            LOOKDETAIL: 'operations/getMerchantRegApplyDetail', //(查看详情)
            PROVINCE: 'operations/getProvinceList', //省市接口
            PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
            CONFIG: 'operations/getSysConfigList', //获取系统信息接口(计费类型,行业类型,公众号类型)
            TEMPLET:'operations/getAllMerchantTradeTemplateList',//行业模板
            ADDSECOND: 'operations/appUserAddCMSInfoApprove', //第二步
            ROLENAME: 'operations/queryMerchantBasicRolePermissionPage', //(角色名称)
            ROLEID: 'operations/getBasicRolePermissionByRoleName', //(角色权限)
            ADDTHIRD:'operations/appUserAddRolePermissionApprove',//第三步
            ACTIVEUSER:'operations/userActiveStatus',//激活用户
            GETSCTRADEBYID:'operations/getScTradeProcessByMerchantTradeId',//根据行业ID查询行业流程配置

        };

        var layer = layui.layer;
        var table = layui.table;
        var form = layui.form;
        var element = layui.element;

            form.verify({
            username: function(value, item) { //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if(/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if(/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
            },
            pass: function(value, item) {
                if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '密码不能有特殊字符';
                }
                if(/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '密码首尾不能出现下划线\'_\'';
                }
            }
        });
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

        form.on('select(uBussiness)',function (obj) {
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

        //		form.on('switch(switchTest)', function(data){
        ////	    	var userId = sessionStorage.getItem('myuserid');
        ////	        var paramLock = "{'userId':" + userId + "}";
        ////	        var res = reqAjax(USER_URL.CHANGESTATU,paramLock)
        ////	        layer.msg(res.msg)
        //		});

        //搜索
        $('#toolSearch').on('click', function() {
            init_obj();
        })
        //重置功能
        $('#toolRelize').on('click', function() {
            $("#usercode").val('');
            $("#username").val('');
            $('#locked').val('');
            $("#app-status").val('')
            form.render('select');
            init_obj();
            // pageCallback(1,15)
        })
        //云信重试
        $('#appRetry').on('click', function () {
            // reqAjaxAsync("user/batchRetryConnectingToNIM", JSON.stringify({}))
            // 	.done(function (res) {
            // 		if (res.code == 1) {
            // 			layer.msg('重试成功');
            // 		}
            // 	});


            reqAjaxAsync("user/getUnboundCount", JSON.stringify({}))
                .done(function (res) {
                    if (res.code != 1)
                        return;

                    let totalCount = res.data;
                    if (totalCount == 0) {
                        layer.open({
                            title: '批量操作'
                            ,content: '所有的帐号都已绑定云信'
                        });
                        return;
                    }

                    let dlgContent = '将尝试绑定<b style=\'color:red\'>' + totalCount + '</b>个云信帐号。<br/>您确定要继续吗?';
                    if (res.data >= 20) {
                        dlgContent = '将尝试绑定<b style=\'color:red\'>' + totalCount + '</b>个云信帐号，这可能需要较长时间。<br/>您确定要继续吗?';
                    }
                    layer.confirm(dlgContent, { title:'确认批量操作'}, function(index){ 
                        layer.close(index);


                        batchRetryBindNIM(totalCount); 
                    });
                });
        });
        function batchRetryBindNIM(totalCount) {
            let index = layer.load(1);
            let steps = totalCount;
    
            try {
                layui.use('element', function () {
                    element.progress('nim-progress', "0%");
                });
                $(".retry-progress-dialog h3").text("正在重试关联云信帐号...");
                $(".retry-progress-dialog").removeClass("hide"); 
    
                let apikey = yyCache.get("apikey") || "test";
                let index = 1;
                var worker = new Worker("js/worker.js");  
                worker.addEventListener("message", function(e) {
                    console.log('主线程打印：' + e.data);
    
                    steps -= 10;
                    
                    // 更新进度条
                    //注意进度条依赖 element 模块，否则无法进行正常渲染和功能性操作
                    layui.use('element', function () {
                        var element = layui.element;
                        let percent = parseInt((totalCount - steps) / totalCount * 100);
                        element.progress('nim-progress',percent + "%");
                    });
    
    
                    if (steps <= 0) {
                        $(".retry-progress-dialog h3").text("操作完成");
                        setTimeout(()=>{
                            $(".retry-progress-dialog").addClass('hide');
                        }, 5000);
                        return;
                    }
    
                    index++;
                    worker.postMessage({
                        index: index, 
                        apikey: apikey
                    });
    
                }, false);
    
                worker.onerror = function(err)
                {
                    alert("URL: "+ err.filename +
                        "\n\nLine: " + err.lineno +
                        "\n\nError: " + err.message);
                }
                // 第一批
                worker.postMessage({
                    index: index, 
                    apikey: apikey
                });
            }
            catch
            {
    
            }
            finally{
                layer.close(index);
            }
    
        }
        function init_obj() {
            var _obj = tableInit('demo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: WIDTH,
                    }, {
                        title: '账号',
                        align: 'left',
                        field: 'phone',
                        width: WIDTH,
                    }, {
                        title: '昵称',
                        align: 'left',
                        field: 'username',
                        width: WIDTH,
                    }, {
                        title: '性别',

                        align: 'left',
                        field: 'usersex',
                        width: WIDTH,
                    }, {
                        title: '锁定状态',
                        align: 'left',
                        field: 'locked',
                        toolbar: '#audio',
                        width: WIDTH,
                        event: 'changeSwitch'
                    }, {
                        title: '用户性质',

                        align: 'left',
                        field: '_ismerchant',
                        width: WIDTH,
                    }, {
                        title: '认证状态',
                        align: 'left',
                        templet: '#status',
                        width: WIDTH,
                    }, {
                        title: '智享城市云信状态',
                        align: 'left',
                        field: 'registType',
                        width: 150,
                        templet: '#app-status-tpl'
                    }, {
                        title: '智大师云信状态',
                        align: 'left',
                        field: 'zregistType',
                        width: 150,
                        templet: '#app-zregist-tpl'
                    }, {
                        title: '操作',
                        fixed:'right',
                        align: 'right',
                        toolbar: '#barDemo',
                        width: 500,
                    }]
                ],
                pageCallback
            )
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

        initForAct();

        function initForAct(replystatus) {
            init_obj();
        }

        //数据处理
        function getData(url, parms) {

            var res = reqAjax(url, parms);

            var data = res.data;

            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                if(item.ismerchant == 0) {
                    $(item).attr('_ismerchant', '平台用户');
                } else {
                    $(item).attr('_ismerchant', '商户');
                }
            });
            return res;
        }

        //pageCallback回调
        function pageCallback(index, limit, usercode, username, locked, isrealname) {
            var usercode = $('#usercode').val();
            var username = $('#username').val();
            var locked = $('#locked').val();
            var appStatus = $('#app-status').val();

            if(usercode == undefined) {
                usercode = ''
            }
            if(username == undefined) {
                username = ''
            }
            if(locked == undefined) {
                locked = ''
            }
            if(isrealname == undefined) {
                isrealname = ''
            }
            if (appStatus == undefined){
			appStatus = '';
		    }
            return getData(USER_URL.RESOURLIST, "{'page':" + index + ",'rows':" + limit + ",'usercode':'" + usercode + "','username':'" + username + "','status':'" + appStatus +  "','locked':'" + locked + "','isrealname':'"  + isrealname + "'}");
        }
        //表格
        function tableInit(tableId, cols, pageCallback, test) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                // height: 'full-300',
                cols: cols,
                page: false,
                even: true,
                skin: 'row',
                limit:15,
            });

            //2.第一次加载
            var res = pageCallback(1, 15);
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
            layui.use('laypage');

            var page_options = {
                elem: 'laypageLeft',
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page','limit', 'next', 'skip'],
                limits: [15,30],
                limit: 15
            }
            page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit);
                    if(resTwo && resTwo.code == 1){
                        tableIns.reload({
                            data: resTwo.data,
                            limit:obj.limit
                        });

                    } else{
                        layer.msg(resTwo.msg);
                    }
                }
            }

            layui.laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
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
                page: 1,
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
            var treeObj = $.fn.zTree.init($("#treedem"), setting, treeData);
            treeObj.expandAll(true);
        }

        table.on('tool(demo)', function(obj) {
            var percent = 0;
            var form = layui.form;
            var data = obj.data;
            var reData={}
            console.log(data);
            //查看
            var imgPath = '../../common/images/placeholder.png';
            if(obj.event === 'detail'  || obj.event == 'change') {
                var btn
                if(obj.event == 'change'){
                    $("#infotrueName,#infoNumber").removeAttr('disabled')
                    btn=['确认','取消']
                    $("#infoIDz1,#infoIDhand1,#infoIDf1").hide().siblings().show()
                }else{
                    $("#infotrueName,#infoNumber,#infoIDz").attr('disabled',true)
                    btn=[]
                    
                    $("#infoIDz2,#infoIDhand2,#infoIDf2").hide().siblings().show()
                }
                layer.open({
                    title: ['详情', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    btn:btn,
                    end: function() {
                        $('#demo111').hide();
                    },
                    success: function(layero, index) {
                        //清除input框
                        $('.demo111').find('input').val('');
                        //图片加载错误处理
                        $('img').error(function() {
                            $(this).attr('src', imgPath);
                        });
                        var paramInfo = "{'userId':" + data.id + "}";
                        var res = reData = reqAjax(USER_URL.INFORMATION, paramInfo);
                        console.log(res)
                        var cityId = data.cityId;

                        if(cityId == "" || cityId == null || cityId =='null'){
                            var citres = ""
                        }else{
                            var citParm = {
                                code : cityId
                            }
                            var citres = reqAjax(USER_URL.PROVINCEBYID,JSON.stringify(citParm))
                            citres = citres.data.areaname
                        }

                        if(res.code == 1) {
                            var row = res.data;
                            var phone = row.user.phone || '';
                            var username = row.user.username || '';
                            var residence = row.user.residence || '' ;
                            var userbirth = row.user.userbirth || '' ;
                            var usersex = row.user.usersex || '' ;
                            var remark = row.user.remark || '' ;
                            var adress = row.address || '' ;
                            var name = adress.name || '' ;
                            var mail = adress.mail || '';
                            var identificationno = adress.identificationno || '';
                            var cardFrontPhoto = adress.cardFrontPhoto || '';
                            var cardHoldPhoto = adress.cardHoldPhoto || '';
                            var cardBackPhoto = adress.cardBackPhoto || '';
                            $("#infoAccount").val(phone);
                            $("#infoName").val(username);
                            $("#infoCity").val(citres);
                            $("#infoBirthday").val(userbirth);
                            $("#infoSex").val(usersex);
                            $("#infoTag").val(remark);
                            $("#infotrueName").val(name);
                            $("#infoEmail").val(mail);
                            $("#infoNumber").val(identificationno);


                            // $("#infoIDz").attr("src", cardFrontPhoto);
                            // $("#infoIDhand").attr("src", cardHoldPhoto);
                            // $("#infoIDf").attr("src", cardBackPhoto);

                            $("#infoIDz1,#infoIDz2").attr("src", cardFrontPhoto);
                            $("#infoIDhand1,#infoIDhand2").attr("src", cardHoldPhoto);
                            $("#infoIDf1,#infoIDf2").attr("src", cardBackPhoto);
                        }
                    },
                    yes: function(index, layero) {
                        var address = reData.data.address;
                        var params = {
                            id:address.id,
                            sysId:address.sysId,
                            identificationno: $("#infoNumber").val() || address.identificationno  || '',
                            name:$("#infotrueName").val() || address.name || '',
                            cardFrontPhoto: $("#infoIDz").attr('src') == imgPath ?'': $("#infoIDz").attr('src') || address.cardFrontPhoto || '',//正面
                            cardBackPhoto: $("#infoIDf").attr('src') == imgPath ?'': $("#infoIDf").attr('src')  || address.cardBackPhoto || '',//反面
                            cardHoldPhoto: $("#infoIDhand").attr('src') == imgPath ?'': $("#infoIDhand").attr('src') || address.cardHoldPhoto || ''//手持
    
                        }
                        reqAjaxAsync(USER_URL.CHANGEMERCHANT,JSON.stringify(params)).done(function(res){
                            if(res.code == 1){
                                console.log(res)
                                layer.msg("保存成功")
                                // init_obj();
                            }else{
                                layer.msg(res.msg)
                            }
                            layer.close(index)
                        })
                        return false
                    }
                });
                //
            } else if(obj.event === 'changeSwitch') {
                //锁定状态
                var $target = $(event.target);
                var t1 = $target[0].tagName.toLowerCase() == "em";
                var t2 = $target[0].tagName.toLowerCase() == "i";
                var t3 = $target.hasClass("layui-unselect layui-form-switch");

                if(t1 || t2 || t3) {
                    var userId = obj.data.id;
                    var paramLock = "{'userId':" + userId + "}";
                    var res = reqAjax(USER_URL.CHANGESTATU, paramLock);
                    layer.msg(res.msg)
                }

            } else if(obj.event === 'level') {
                var oldId = data.id;
                var isrealname = data.isrealname;
                //升级为商户
                layer.open({
                    title: TITLE,
                    type: 1,
                    content: $('#oneDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    closeBtn: 1,
                    shade:SHADE,
                    btn: ['下一步'],
                    end: function() {
                        $('#oneDemo').hide();
                        $('#udesig').val("");
                        $('#name').val("");
                        $('#identificationno').val("");
                        $('#uploadImg1').attr('src', 'img/upload.png');
                        $('#uploadImg2').attr('src', 'img/upload.png');
                        $('#uploadImg3').attr('src', 'img/upload.png');
                        $('#uploadImg4').attr('src', 'img/upload.png');
                    },
                    success: function(layero, index) {
                        //给保存按钮添加form属性
                        $("div.layui-layer-page").addClass("layui-form");
                        $("a.layui-layer-btn0").attr("lay-submit", "");
                        $("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
                        //初始化加载省市
                        loadProvinceAndCity({
                            'parentcode': 0
                        }, 1);
                        percent+=25;
                        progresses(percent);
                        //加载省市数据
                        function loadProvinceAndCity(param, _sort) {
                            var res = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
                            if(res.code == 1) {
                                if(_sort != 2) {
                                    var sHtml = '<option value="">---请选择---</option>';
                                }
                                for(var i = 0, len = res.data.length; i < len; i++) {
                                    sHtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
                                }
                                _sort = _sort ? _sort : 1;
                                if(param['parentcode'] == 0) {
                                    proviceArr = res.data;
                                    $("#provinceSelector" + _sort).html(sHtml);
                                    $("#oneDemo").attr("data-cid", res.data[0].code);
                                } else {
                                    $("#citySelector" + _sort).html(sHtml);
                                    $("#citySelector" + _sort).prop("disabled", false);
                                }
                            }
                        }

                        //加载市
                        function getCity(cityid) {
                            var param = {
                                parentcode: cityid
                            }
                            reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).done(function(res) {
                                if(res.code == 1) {
                                    var mhtml = "";
                                    for(var i = 0, len = res.data.length; i < len; i++) {
                                        mhtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
                                    }
                                    if(cityid == 0) {
                                        $("#provinceSelector2").html(mhtml);
                                    } else {
                                        $("#citySelector2").html(mhtml);
                                    }
                                    form.render();
                                } else {
                                    layer.msg(res.msg);
                                }

                            });

                        }

                        //根据省的选择切换对应的市内容
                        $("#provinceSelector1").change(function() {
                            var _value = $(this).val();
                            if(_value == "") {
                                $("#citySelector1").prop("disabled", true).find("option:eq(0)").prop("selected", true);
                            } else {
                                loadProvinceAndCity({
                                    'parentcode': _value
                                }, 1);
                            }
                        });

                        $(".looktit").show();
                        reqAjaxAsync(USER_URL.CONFIG, "").done(function(res) {
                            if(res.code == 1) {
                                var row = res.data.merchantTrade;
                                //行业
                                var bHtml = "";
                                $.map(row, function(n, index) {
                                    bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
                                })
                                $("#uBussiness").html(bHtml);

                                var tHtml = "";
                                var rows = res.data.regularTypeList;
                                $.map(rows, function(n, index) {
                                    tHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
                                })
                                $("#uType").html(tHtml);

                                form.render();
                            } else {
                                layer.msg(res.msg);
                            }
                        });

                        reqAjaxAsync(USER_URL.TEMPLET, "").done(function(res) {
                            var row = res.data;
                            //模板
                            var bHtml = "";
                            $.map(row, function(n, index) {
                                bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
                            })
                            $("#templet").html(bHtml);
                            form.render();
                        });
                        //加载省市
                        getCity(0);
                        var cod = $("#oneDemo").attr("data-cid");
                        getCity(cod);
                        //根据省的选择切换对应的市内容
                        form.on('select(provinceSelector2)', function(data) {
                            var val = data.value;
                            getCity(val);
                        });
                        if(isrealname != 2) { //未实名
                            $('div.hidenobj').show();
                            $('#name').attr('lay-verify', 'required');
                            $('#identificationno').attr('lay-verify', 'required|identity');
                        } else {
                            $('div.hidenobj').hide();
                            $('#name').attr('lay-verify', '');
                            $('#identificationno').attr('lay-verify', '');
                        }
                        setSctradeById($("#uBussiness").val())
                        form.render();

                    },
                    yes: function(index, layero) {
                        form.on('submit(formdemo2)', function(data) {
                            if(data) {
                                var orgName = $.trim($("#udesig").val()); //商户名
                                var provinceId = $("#uprobox").find("dl dd.layui-this").attr("lay-value"); //省ID
                                var cityId = $("#uCitid").find("dl dd.layui-this").attr("lay-value"); //市ID
                                var trade = $("#uBussinessbox").find("dl dd.layui-this").attr("lay-value"); //行业ID
                                var templateId = $("#templetBox").find("dl dd.layui-this").attr("lay-value"); //模板id
                                var identificationno = $('#identificationno').val();
                                var name = $('#name').val();
                                var cardFrontPhoto = $('#uploadImg3').attr('src');
                                var cardBackPhoto = $('#uploadImg4').attr('src');
                                var licenseHold = $('#uploadImg2').attr('src');
                                var licenseFront = $('#uploadImg1').attr('src');
                                var payment = $('#payment').val(); //是否生活缴费
                                if(licenseHold == 'img/upload.png') {
                                    licenseHold = ''
                                }
                                if(licenseFront == 'img/upload.png') {
                                    licenseFront = ''
                                }
                                if(orgName.indexOf("script") != -1) {
                                    $("#udesig").val("");
                                    layer.msg("请输入正确的商户名称");
                                    return;
                                }
                                if(isrealname == 0) { //未实名
                                    if(cardFrontPhoto === 'img/upload.png' || cardBackPhoto === 'img/upload.png') {
                                        layer.msg('请提交相关照片')
                                        return
                                    }
                                }
                                var param = {
                                    appUserId: oldId, //app用户ID
                                    orgName: orgName,
                                    provinceId: provinceId,
                                    cityId: cityId,
                                    trade: trade,//行业
                                    templateId:templateId,//模板
                                    name: name,
                                    identificationno: identificationno,
                                    cardFrontPhoto: cardFrontPhoto ,
                                    cardBackPhoto: cardBackPhoto ,
                                    // cardFrontPhoto: cardFrontPhoto || 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxdCdCXaC5GkKxb7ETnKbXXR3y.png',
                                    // cardBackPhoto: cardBackPhoto || 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxdCdCXaC5GkKxb7ETnKbXXR3y.png',
                                    licenseHold: licenseHold,
                                    licenseFront: licenseFront,
                                    isBusinessPayment: payment//是否生活缴费
                                }
                                reqAjaxAsync(USER_URL.ADDONE, JSON.stringify(param)).done(function(res) {
                                    if(res.code == 1) {
                                        layer.msg(res.msg);
                                        layer.close(index);
                                        init_obj();
                                        //第二步
                                        layer.open({
                                            title: TITLE,
                                            type: 1,
                                            content: $('#secondDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                            area: AREA,
                                            closeBtn: 1,
                                            shade:SHADE,
                                            btn: ['下一步'],
                                            end: function() {
                                                $('#secondDemo').hide();
                                                $("#addName").val("");
                                            },
                                            success: function(layero, index) {
                                                //给保存按钮添加form属性
                                                $("div.layui-layer-page").addClass("layui-form");
                                                $("a.layui-layer-btn0").attr("lay-submit", "");
                                                $("a.layui-layer-btn0").attr("lay-filter", "formdemo1");
                                                //频道类型
                                                percent+=25;
                                                progresses(percent)

                                                var raw = reqAjax(USER_URL.CONFIG, "");
                                                if(raw.code == 1) {
                                                    var data = raw.data.cmsChannelList;
                                                    var sHtmldept = '';
                                                    $.each(data, function(i, item) {
                                                        sHtmldept += "<option value='" + item.channelId + "'>" + item.channelName + "</option>";
                                                    });
                                                    $('#fixdepartment').html(sHtmldept);
                                                    form.render();
                                                } else {
                                                    layer.msg(raw.msg);
                                                }
                                            },
                                            yes: function(index, layero) {
                                                //form监听事件
                                                form.on('submit(formdemo1)', function(data) {
                                                    if(data) {
                                                        var subscriptionName = $.trim($("#addName").val()); //个人频道名称
                                                        var subscriptionTypeId = $("#subscription").find("dl dd.layui-this").attr("lay-value"); //个人频道类型ID
                                                        if(subscriptionName.indexOf("script") != -1) {
                                                            $("#addName").val("");
                                                            layer.msg("请输入正确的个人频道名称");
                                                            return;
                                                        }

                                                        var params = {
                                                            appUserId: oldId,
                                                            subscriptionName: subscriptionName,
                                                            subscriptionTypeId: subscriptionTypeId
                                                        }
                                                        reqAjaxAsync(USER_URL.ADDSECOND, JSON.stringify(params)).done(function(res) {
                                                            if(res.code == 1) {
                                                                layer.msg(res.msg);
                                                                layer.close(index);
                                                                init_obj();
                                                                //第三步
                                                                layer.open({
                                                                    title: TITLE,
                                                                    type: 1,
                                                                    content: $('#thirdDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                                                    area: AREA,
                                                                    closeBtn: 1,
                                                                    shade: SHADE,
                                                                    btn: ['保存'],
                                                                    end: function() {
                                                                        $('#thirdDemo').hide();
                                                                    },
                                                                    success: function(layero, index) {
                                                                        //角色名称
                                                                        var pm1 = {
                                                                            page: 1,
                                                                            rows: 15
                                                                        }
                                                                        var res01 = reqAjax(USER_URL.ROLENAME, JSON.stringify(pm1));
                                                                        if(res01.code == 1) {
                                                                            percent+=50;
                                                                            progresses(percent);
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
                                                                            appUserId: oldId
                                                                        }
                                                                        reqAjaxAsync(USER_URL.ADDTHIRD, JSON.stringify(pram)).done(function(res3) {
                                                                            if(res3.code == 1) {
                                                                                layer.msg(res3.msg);
                                                                                layer.close(index);
                                                                                init_obj();
                                                                            } else {
                                                                                layer.msg(res3.msg);
                                                                            }
                                                                        })
                                                                    }

                                                                })

                                                            } else {
                                                                layer.msg(res.msg);
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        layer.msg(res.msg);
                                    }
                                })

                            }
                        });

                    }
                })

            }
            else if(obj.event === 'reset') {
                var userId = data.id;
                var data = "{'userId':'" + userId + "'}"
                layer.confirm("确认重置密码？", {
                    icon: 0,
                    title: "提示"
                }, function(index) {
                    var a = reqAjax("operations/appUserPasswordReset", data);
                    if(a.code == 1) {
                        layer.alert("已重置，默认密码为123456")
                    } else {
                        layer.msg(a.msg);
                    }
                    layer.close(index);
                })
            }else if(obj.event === 'active') {
                var params = {
                    userId:data.id
                }
                layer.confirm("是否激活用户【"+data.phone+"】？", {
                    icon: 0,
                    title: "提示"
                }, function(index) {
                   reqAjaxAsync(USER_URL.ACTIVEUSER,JSON.stringify(params)).done(function (res) {
                       if(res.code ==1){
                           layer.msg("用户已激活")
                           init_obj();
                       } else {
                           layer.msg(res.msg);
                       }
                       layer.close(index);
                   })

                })
            }else if(obj.event === 'retry1'){
                var params = {}
                reqAjaxAsync("user/batchRetryConnectingToNIM", JSON.stringify({
                    users: [ { 
                        usercode: data.usercode, 
                        zusercode: '',
                        username: data.username,
                        pic: data.userpic,
                        password: data.password
                    } ]
                }))
                .done(function(res){
                    if(res.code == 1) {
                        init_obj();
                    }
                });
            }
            else if(obj.event === 'retry2'){ 
                reqAjaxAsync("user/batchRetryConnectingToNIM", JSON.stringify({
                    users: [ {
                        usercode: '',
                        zusercode: data.zusercode, 
                        username: data.username,
                        pic: data.userpic,
                        password: data.password
                    } ]
                }))
                .done(function(res){
                    if(res.code == 1) {
                        init_obj();
                    }
                });
            }
        });
        function progresses(percent){
            setTimeout(function() {
                element.progress('progross', percent+'%');
            }, 300)
        }
        //检测密码强度
        function checkLevel(ele, elee, con) {
            var regxs = [];
            regxs.push(/[^a-zA-Z0-9_]/g);
            regxs.push(/[a-zA-Z]/g);
            regxs.push(/[0-9]/g);
            $('body').on('keyup', elee, function() {
                var val = $(this).val();
                var len = val.length;
                var sec = 0;
                if(len >= 6) { // 至少六个字符

                    for(var i = 0; i < regxs.length; i++) {
                        if(val.match(regxs[i])) {
                            sec++;
                        }
                    }
                }
                var result = (sec / regxs.length) * 100;
                if(result > 0 && result <= 50) {
                    con.find('li').eq(0).addClass('act').siblings('').removeClass('act')
                } else if(result > 50 && result < 100) {
                    con.find('li').eq(1).addClass('act').siblings('').removeClass('act')
                } else if(result == 100) {
                    con.find('li').eq(2).addClass('act').siblings('').removeClass('act')
                }

            })
        }

        $('#search').on('click', function() {
            $('#search-tool').slideToggle(200)
        })

        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');

        })

        //刷新
        function refresh() {
            location.reload();
        }
        $('#refresh').click(function() {
            refresh()
        });



        //获取权限类型
        function jurisdictionSize() {
            var res = reqAjax("operations/getSysConfigList", "");
            var sHtml = ""; //计费等级
            var pHtml = ""; //频道类型
            if(res.code == 1) {
                var row = res.data;
                for(var i = 0; i < row.cmsChannelList.length; i++) {
                    var rowA = row.cmsChannelList[i];
                    pHtml += '<option value="' + rowA.channelId + '">' + rowA.channelName + '</option>';
                };
                for(var j = 0; j < row.chargeLevel.length; j++) {
                    var rowA = row.chargeLevel[j];
                    sHtml += '<option value="' + rowA.id + '">' + rowA.levelName + '</option>';
                };
                $("#jurisLevel").append(sHtml);
                var val = $("#jurisLevel").children('option').eq(1).val();
                $("#jurisLevel").val(val);
                $("#jurisLevel").children('option').eq(1).select();
                $("#jurisChannel").append(pHtml);
                form.render();

            } else {
                layer.msg(res.msg);
            }
        };

        function loadprovince(code) {
            var param = '{"parentcode":' + code + '}';
            var res = reqAjax("operations/getProvinceList", param);
            var lHtml = ""; //省市
            if(res.code == 1) {
                for(var i = 0; i < res.data.length; i++) {
                    var row = res.data[i];
                    lHtml += '<option value="' + row.code + '">' + row.areaname + '</option>';
                };
                if(code == '0') {
                    $('#provinceId').append(lHtml);
                    $('#cityId').attr('disabled');
                } else if(code != "") {
                    $('#cityId').html(lHtml);
                    $('#cityId').prop("disabled", false);
                }
                form.render();
            }
        }

        form.on('select(province)', function(data) {
            loadprovince(data.value);
        });

        //新增模态框 input限制输数字
        $("#upgradeLevel").keyup(function() {
            $(this).val($(this).val().replace(/^0/, ''));
        })

        //升级保存
        function updateSub(account, index) {
            var userno = yyCache.get('userno');
            var levelTypeId = $('#jurisLevel').val(); //计费等级
            var orgName = $('#upgradeName').val(); //商户名
            var priority = $('#upgradeLevel').val(); //优先级
            var usercode = $('#upgradeManage').val(); //登录名(用户账号)商户管理员账号4-32位英文
            var username = $('#upgradeManagename').val(); //商户管理员呢称
            var password = $('#password').val(); //密码
            var subscriptionName = $('#channelName').val(); //频道名
            var subscriptionTypeId = $('#jurisChannel').val(); //公众号类型
            var subscriptionSynopsis = $('#upgradeNote').val(); //公众号简介
            var provinceId = $('#provinceId').val(); //省id
            var cityId = $('#cityId').val(); //市id
            var isenglish = /^[a-z]{4,32}$/;
            var param = {
                password: password,
                usercode: usercode,
                username: username,
                parentId: userno,
                platformuserId: account,
                orgName: orgName,
                isAdmin: '01',
                priority: priority,
                userNo: userno,
                subscriptionName: subscriptionName,
                subscriptionTypeId: subscriptionTypeId,
                subscriptionSynopsis: subscriptionSynopsis,
                levelTypeId: levelTypeId,
                cityId: cityId, //市id
                provinceId: provinceId //省id
            };
            var res = reqAjax(USER_URL.RESOURCESIZE, JSON.stringify(param));
            if(res.code == 1) {
                layer.msg('升级成功')
                layer.close(index);
                initForAct();
            } else {
                layer.msg(res.msg);
            }

        }

        uploadOss({
            btn: "uploadImg1",
            flag: "img",
            size: "5mb"
        }); uploadOss({
            btn: "uploadImg2",
            flag: "img",
            size: "5mb"
        }); uploadOss({
            btn: "uploadImg3",
            flag: "img",
            size: "5mb"
        }); uploadOss({
            btn: "uploadImg4",
            flag: "img",
            size: "5mb"
        });

        uploadOss({
            btn: "infoIDz2",
            flag: "img",
            size: "5mb"
        });
         uploadOss({
            btn: "infoIDf2",
            flag: "img",
            size: "5mb"
        }); 
        uploadOss({
            btn: "infoIDhand2",
            flag: "img",
            size: "5mb"
        });
        $("#infoIDz1,#infoIDf1,#infoIDhand1").click(function(e){
            var src = $(this).attr('src');
            if(src == '../common/image/placeholder.png'){
                return;
            }
            var demo = $('#tong');
            demo.find('img').attr('src',src)
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: '550px',
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: demo,
                end:function(index){
                    demo.hide()
                }
              });
    
        })
 
        

    });


})