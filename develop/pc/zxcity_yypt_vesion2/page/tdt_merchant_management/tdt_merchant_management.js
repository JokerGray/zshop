layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element;
        var WIDTH = 120;
        userno = sessionStorage.getItem('userno') || ""
    var AREA = ['90%', '90%'];
    var TITLE = ['完善商户信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
    var USER_URL = {
        RESOURLIST: 'operations/getMultipleShopMerchantManageList', //(查询列表)
        LOCK: 'operations/lockedMerchant', //(锁定商户/启用商户)
        PROVINCE: 'operations/getProvinceList', //省市接口
        PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
        DEL: 'operations/deleteScMultipleShopConfigureMerchant',//删除
        ORGLIST: 'operations/getUnBindMultipleShopMerchantOrgList',//组织机构列表
        SETUP: 'operations/addScMultipleShopConfigureMerchant',//设置头道汤商户
        CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）

    };
    $(function(){

    })
    // CHARGELEVE 加载商户等级
    reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
        if(res.code ==1){
            var bHtml = "<option value=''>--请选择--</option>";
            var datas = res.data;
            $.map(datas, function(n, index) {
                bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
            })
            $("#orgLevel").html(bHtml);
            form.render();
        }else{
            layer.msg('加载计费类型失败')
        }

        // form.render();
    });
    //自定义几种验证
    form.verify({
        IDcard: [
            /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, '请输入正确的身份证'
        ],
        realName: [
            /^[\u4E00-\u9FA5]{2,10}$/, "请输入正确的姓名"
        ],
        nickName: [
            /^[\u4e00-\u9fa5a-zA-Z]+$/, "只能输入英文或中文"
        ],
        password: function (value) {
            if (value.length < 6) {
                return "密码长度不能低于6位"
            }
        }
    });

    //搜索
    $('#searchBtn').on('click', function () {
        tableInit();
    })
    //重置
    $('#resetBtn').on('click', function () {
        $('.tool-box-ul').find('input,select').val('')
        $('#citySelector1').html('<option value="">--全部--</option>');
        form.render();
        tableInit();
    })

    //layer展开
    $('body').on('click', '.layui-layer .layui-layer-content .package-some', function () {
        if ($(this).children('i.description').html() == '展开') {
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
    $('body').on('click', '.layui-layer .layui-layer-content .layer-place', function () {
        $(this).hide();
        $(this).siblings('ul').show();
        $(this).parent().siblings().children('.package-some').children('.description').html('展开');
        $(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
    })

    //表格操作
    table.on('tool(merchantTable)', function (obj) {
        var data = obj.data;
        var oldId = data.id;
        console.log(data);
        //查看
        if (obj.event === 'view') {
            layer.open({
                title: ['查看', 'font-size:12px;background-color:#424651;color:#fff'],
                btn: ['确定'],
                type: 1,
                anim: 5,
                content: $('#addLayer'),
                area: AREA,
                end: function () {
                    clearInput(['one', 'two', 'three', 'four'])
                },
                success: function (index, layero) {
                    var parms = {
                        "code": data.provinceId
                    };
                    var cityParms = {
                        "code": data.cityId
                    };

                    $('#one').val(data.orgName);
                    $('#two').val(data.phone);
                    $('#three').val(data.tradeName);
                    $('#four').val(data._orgLevel);
                },
                yes: function (index, layero) {
                    layer.close(index)
                }
            })
        } else if (obj.event === 'delete') {
            // DEL

            layer.confirm('确认删除【'+data.orgName+'】?',{icon:0,title:"提示"},function (index) {
                var parms = {
                    id:oldId
                };
                reqAjaxAsync(USER_URL.DEL,JSON.stringify(parms)).done(function (res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("已删除");
                        tableInit();
                    }else {
                        layer.msg(res.msg);
                    };
                })
            })
        }
    })







    function refereeTable() {
        //选中行
        table.on('tool(tableRe)', function (objs) {
            var datas = objs.data;
            var tr = objs.tr; //获得当前行 tr 的DOM对象
            if (objs.event === 'changetable') {
                var userId = datas.userId;
                var appUserNickName = datas.appUserNickName;
                var appUserPhone = datas.appUserPhone;
                var yyptNickName = datas.yyptNickName;
                var yyptPhone = datas.yyptPhone;
                sessionStorage.setItem("referrerId", userId);
                sessionStorage.setItem("appUserNickName", appUserNickName);
                sessionStorage.setItem("appUserPhone", appUserPhone);
                sessionStorage.setItem("yyptNickName", yyptNickName);
                sessionStorage.setItem("yyptPhone", yyptPhone);
            }
        })
    }




    //角色名称&监听角色名切换权限
    function roleNameSelect(dom) {
        var p = '{"page":1,"rows":100}';
        reqAjaxAsync(USER_URL.ROLENAME, p).done(function (res) {
            if (res.code == 1) {
                var row = res.data;
                $("body").data("roleName", roleName);
                var bHtml = "";
                $.each(row, function (i, item) {
                    bHtml += '<option value=' + item.roleName + '>' + item.roleName + '</option>'
                })
                $("#" + dom).html(bHtml);
                form.render();
                //监听角色名切换权限
                form.on('select(' + dom + ')', function (data) {
                    var roleName = data.value;
                    //角色tree
                    getTree(roleName);
                });
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //频道类型
    function headlinesType(dom) {
        reqAjaxAsync(USER_URL.CONFIG, "").done(function (res) {
            if (res.code == 1) {
                var row = res.data.cmsChannelList;
                var bHtml = "";
                $.map(row, function (n, index) {
                    bHtml += '<option value="' + n.channelId + '">' + n.channelName + '</option>'
                })
                $("#" + dom).html(bHtml);
                form.render();
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //监听账号
    function monitorAccunt() {
        $('#uName').on("keyup", function (e) {
            var v = $(this).val();
            if (!isNaN(v)) {
                $('#oneName').val(v);
            } else {
                v = v.substring(0, v.length - 1);
                $(this).val(v);
            }
        })
    }

    //初始化加载省市
    loadProvinceAndCity({
        'parentcode': 0
    }, 1);
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
                $("#addMervhant").attr("data-cid", res.data[0].code);
            } else {
                $("#citySelector" + _sort).html(sHtml);
                $("#citySelector" + _sort).prop("disabled", false);
            }
            form.render('select');
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
                    $("#provinceSelector1").html(mhtml);
                } else {
                    $("#citySelector1").html(mhtml);
                }
                form.render();
            } else {
                layer.msg(res.msg);
            }

        });

    }
    //根据省的选择切换对应的市内容
    form.on('select(province)',function (data) {

        var _value = data.value;
        if(_value == "") {
            console.log('111')

            // $("#citySelector1").prop("disabled", true).find("option:eq(0)").prop("selected", true);
            $("#citySelector1").html('<option value="">---请选择---</option>')
            form.render('select');
        } else {
            loadProvinceAndCity({
                'parentcode': _value
            }, 1);
        }
    })

    //行业模板
    function loadTemplate(dom) {
        reqAjaxAsync(USER_URL.TEMPLET, "").done(function (res) {
            if (res.code == 1) {
                var row = res.data;
                //模板
                var bHtml = "";
                $.map(row, function (n, index) {
                    bHtml += '<option value="' + n.id + '">' + n.templateName + '</option>'
                })
                $("#" + dom).html(bHtml);
                form.render();
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //加载行业
    function loadTrade(dom) {
        reqAjaxAsync(USER_URL.CONFIG, "").done(function (res) {
            if (res.code == 1) {
                var row = res.data.merchantTrade;
                //行业
                var bHtml = "";
                $.map(row, function (n, index) {
                    bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
                })
                $("#" + dom).html(bHtml);
                form.render();
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //清空表单
    function clearInput(inputArr) {
        if (inputArr.constructor == Array) {
            $.each(inputArr, function (i, item) {
                var u = "#" + item;
                $(u).val("")
            })
        } else {
            console.log("请传入数组")
        }
    }

    //清空图片路径
    function clearPicSrc(picSrc) {
        if (picSrc.constructor == Array) {
            $.each(picSrc, function (i, item) {
                var u = "#" + item;
                $(u).prop('src', "img/upload.png")
            })
        } else {
            console.log("请传入数组")
        }
    }

    //给保存按钮添加form属性
    function addForm(filter) {
        $("div.layui-layer-page").addClass("layui-form");
        $("a.layui-layer-btn0").attr("lay-submit", "");
        $("a.layui-layer-btn0").attr("lay-filter", filter);
    }

    //上传图片
    sentImage(["uploadImg1", "uploadImg2", "uploadImg3", "uploadImg4", "uploadImg5",]);

    function sentImage(imgArr) {
        if (imgArr.constructor == Array) {
            $.each(imgArr, function (i, item) {
                uploadOss({
                    btn: item,
                    flag: "img",
                    size: "5mb"
                });
            })
        } else {
            console.log("请传入数组")
        }
    }

    //角色权限方法
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

        reqAjaxAsync(USER_URL.ROLEID, JSON.stringify(paras)).then(function (trees) {
            var treeData = trees.data;
            for (var i = 0; i < treeData.length; i++) {
                treeData[i].id = Number(treeData[i].permissionId);
                treeData[i].pid = Number(treeData[i].parentid);
                treeData[i].name = treeData[i].permissionName;
                treeData[i].icon = "";
            }
            treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
            treeObj.expandAll(true);
        })
    }

    //pageCallback
    function pageCallback(index, limit, callback) {
        var parms = {
            rows: limit,
            page: index,
            t_userid: userno,
            phone: $.trim($('#phone').val()) || "",
            orgName: $.trim($('#orgName').val()) || "",
            orgLevel: $.trim($('#orgLevel').val()) || "",
            regular: $.trim($('#regular').val()) || "",//商户类型
            merchantStatus: $.trim($('#locked').val()) || "",
            isBind:$.trim($('#bind').val()) || "",
            cityId:$('#citySelector1 option:selected').val()|| "",
            provinceId:$('#provinceSelector1 option:selected').val()|| "",
        };
        reqAjaxAsync(USER_URL.RESOURLIST, JSON.stringify(parms)).then(function (res) {
            if (res.code != 1) {
                return layer.msg(res.msg);
            }
            var data = res.data;
            console.log(data);
            $.each(data, function (i, item) {
                if(item.isBind == 1 ){
                    item.isBingdName = '是'
                }else{
                    item.isBingdName = '否'
                }
                // merchantStatus
                if(item.merchantStatus == 1 ){
                    item.merchantStatusName = '是'
                }else{
                    item.merchantStatusName = '否'
                }
                $(item).attr('eq', (i + 1));
                // switch (item.orgLevel) {
                //     case(1):
                //         $(item).prop('_orgLevel', '普通商户');
                //         break;
                //     case(2):
                //         $(item).prop('_orgLevel', '合作商户');
                //         break;
                //     case(3):
                //         $(item).prop('_orgLevel', '代理商户');
                //         break;
                // }
                switch (item.regular) {
                    case(0):
                        $(item).prop('_regular', '正式');
                        break;
                    case(1):
                        $(item).prop('_regular', '测试');
                        break;
                }
                switch (item.isBind) {
                    case('0'):
                        $(item).prop('_bind', '未启用')
                        break;
                    case('1'):
                        $(item).prop('_bind', '启用')
                        break;
                }
                switch (item.merchantStatus) {
                    case('0'):
                        $(item).prop('_locked', '正常')
                        break;
                    case('1'):
                        $(item).prop('_locked', '锁定')
                        break;
                }
                switch (item.isBusinessPayment) {
                    case('0'):
                        $(item).prop('_isBusinessPayment', '否')
                        break;
                    case('1'):
                        $(item).prop('_isBusinessPayment', '是')
                        break;
                }
            });
            return callback(res);
        })
    }

    //当前表格渲染
    function tableInit() {
        var _obj = _tableInit('merchantTable', [
                [{
                    title: 'ddd',
                    align: 'left',
                    field: 'eq',
                    width: 80,
                    event: 'eventMes'
                }, {
                    title: '手机号',
                    align: 'left',
                    field: 'phone',
                    width: WIDTH,
                    event: 'eventMes'
                }, {
                    title: '商户名称',
                    align: 'left',
                    field: 'orgName',
                    width: WIDTH,
                    event: 'eventMes'
                }, {
                    title: '商户等级',
                    align: 'left',
                    field: 'levelName',
                    width: WIDTH,
                    event: 'eventMes'
                }, {
                    title: '商户行业',
                    align: 'left',
                    field: 'tradeName',
                  width: WIDTH,
                    event: 'eventMes'
                }, {
                    title: '是否绑定',
                    align: 'left',
                    field: 'isBingdName',
                  width: WIDTH,
                    event: 'eventMes'
                }, {
                    title: '是否锁定',
                    align: 'left',
                    field: 'merchantStatusName',
                  width: WIDTH,
                    event: 'eventMes'
                }, {
                    title: '操作',
                    fixed: 'right',
                    align: 'left',
                    toolbar: '#barDemo',
                    width: 300,
                    event: 'eventMes'
                }
                ]
            ],
            pageCallback, 'layTablePage'
        )
    }
    tableInit();
    //表格方法
    /* 表格初始化
     * tableId: 表格容器ID
     * cols:table配置
     * pageCallback回调(异步)
     * pageDomName:分页容器ID
     */
    function _tableInit(tableId, cols, pageCallback, pageDomName) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-200',
            cols: cols,
            page: false,
            even: true,
            limit: 15,
            // cellMinWidth: 80,
            done: function (res, curr, count) {
                $('body').on('click', '.layui-table-body table tr', function () {
                    $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
                })

            }
        });

        //2.第一次加载
        pageCallback(1, 15, function (res) {
            tableIns.reload({
                data: res.data
            })
            //第一页，一页显示15条数据
            layui.use('laypage');
            var page_options = {
                elem: pageDomName,
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                limits: [15,30],
                limit: 15
            }
            page_options.jump = function (obj, first) {
                tablePage = obj;
                //首次不执行
                if (!first) {
                    pageCallback(obj.curr, obj.limit, function (resTwo) {
                        tableIns.reload({
                            data: resTwo.data,
                          limit:obj.limit
                        });
                    });
                }
            }
            layui.laypage.render(page_options);
            return {
                tablePage,
                tableIns
            };
        });
    }



    //添加--列表 回调
    function pageCallbackLayer(index, limit ,callback) {
        var phone = $.trim($("#phoneLayer").val())||"";
        var orgName = $("#orgNameLayer").val()||"";
        var param = {
            page: index,
            rows: limit,
            phone: phone, //手机号
            orgName:orgName//商户名称
        }
        return getDataLayer(USER_URL.ORGLIST, JSON.stringify(param),callback);
    };
    //数据处理
    function getDataLayer(url, parms ,callback) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                if(item.orgLevel==1){
                    $(item).attr('level','普通商户');
                }else if(item.orgLevel==2){
                    $(item).attr('level','合作商户');
                }else if(item.orgLevel==3){
                    $(item).attr('level','代理商户')
                };
                if(item.merchantStatus==0){
                    $(item).attr('status','暂停');
                }else if(item.merchantStatus==1){
                    $(item).attr('status','启用');
                };
            });

            return callback(res);
        }else{
            layer.msg(res.msg);
        };

    };

    //渲染商户表格
    function _tableInitLayer(){
        //渲染表单
        var objs = _tableInit('tableLayer', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80,
                    event:'changetable'
                }, {
                    title: '手机号',
                    align: 'left',
                    field: 'phone',
                    width: 150,
                    event:'changetable'
                }, {
                    title: '商户名称',
                    align: 'left',
                    field: 'orgName',
                    width: 150,
                    event:'changetable'
                }, {
                    title: '商户等级',
                    align: 'left',
                    field: 'level',
                    width: 150,
                    event:'changetable'
                }, {
                    title: '商户行业',
                    align: 'left',
                    field: 'tradeName',
                    width: 150,
                    event:'changetable'
                }, {
                    title: '是否锁定',
                    align: 'left',
                    field: 'status',
                    width: 150,
                    event:'changetable'
                }
                ]
            ],
            pageCallbackLayer, 'laypageLeftLayer', 0
        );
    };

    //添加头道汤商户
    $('#addMervhant').click(function(){
        var layerId="";
        layer.open({
            title:['新增','font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
            type:1,
            content:$('#agentAdd'),
            area:AREA,
            btn:['确定','取消'],
            end:function(){
                $('#phoneLayer').val('');
                $('#orgNameLayer').val('');
//				_tableInitLayer();
                $('#agentAdd').hide();
            },
            success:function(Layero,index){
                _tableInitLayer();
                table.on('tool(tableLayer)',function(objs){
                    if(objs.event=='changetable'){
                        layerId=objs.data.merchantId
                    }
                });
            },
            yes:function(index,Layero){
                if(layerId==""){
                    layer.msg('请选择商户');
                    return;
                }else{
                    var parm={
                        merchantId:layerId
                    };
                    reqAjaxAsync(USER_URL.SETUP,JSON.stringify(parm)).then(function(res){
                        if(res.code==1){
                            layer.msg(res.msg);
                            layer.close(index);
                            _tableInit();
                        }else{
                            layer.msg(res.msg)
                        }
                    })
                };
            }
        })
    });
    //点击搜索Layer
    $('#toolSearchLayer').click(function(){
        _tableInitLayer();
    });
    //点击重置Layer
    $('#toolRelizeLayer').click(function(){
        $('#phoneLayer').val('');
        $('#orgNameLayer').val('');

        _tableInitLayer();
    })
    //点击表格变色
    $('body').on('click', '.layui-form .layui-table-body tr', function() {
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
})
