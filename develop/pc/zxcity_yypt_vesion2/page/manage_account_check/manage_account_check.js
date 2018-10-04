$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer;
        form.render();

        var AREA = ['90%', '90%'];
        var TITLE = ['完善商户信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var USER_URL = {
            RESOURLIST: 'operations/platformUserList', //(查询状态)
            ADDRESOURCE: 'operations/realNameStatus', //(用户实名认证审核)
            CHANGESTATU: 'operations/userStatusToggle', //(状态启用/0 未锁/1 已锁)
            //  RESOURCESIZE : 'operations/upgradeToMerchant', //(升级为商户)
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
            ADDTHIRD:'operations/appUserAddRolePermissionApprove'//第三步
        };
        //搜索
        $('#toolSearch').on('click', function() {
            init_obj();
        })
        //重置功能
        $('#toolRelize').on('click', function() {
            $("#usercode").val('');
            $("#username").val('');
            $('#locked').val('');
            form.render('select');
            init_obj();
            // pageCallback(1,15)
        })
        //表格
        function tableInit(tableId, cols, pageCallback, test) {
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
                elem: 'pageLeft',
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
                limits: [15, 30],
                limit: 15
            }
            page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit);
                    if(resTwo && resTwo.code == 1)
                        tableIns.reload({
                            data: resTwo.data,
                          limit:obj.limit
                        });
                    else
                        layer.msg(resTwo.msg);
                }
            }

            layui.laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
        }
        //渲染表格
        function init_obj() {
            var _obj = tableInit('tabNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: '120',
                    }, {
                        title: '账号',
                        align: 'left',
                        field: 'phone',
                        width: '120',
                    }, {
                        title: '昵称',
                        align: 'left',
                        field: 'username',
                        width: '120',
                    }, {
                        title: '性别',

                        align: 'left',
                        field: 'usersex',
                        width: '120',
                    }, {
                        title: '锁定状态',
                        align: 'left',
                        field: '_locked',
                        width: '120',
                    }, {
                        title: '用户性质',

                        align: 'left',
                        field: '_ismerchant',
                        width: '120',
                    }, {
                        title: '认证状态',
                        align: 'left',
                        templet: '#status',
                        width: '120',
                    }, {
                        title: '操作',
                        fixed:'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 385,
                    }]
                ],
                pageCallback,'pageLeft'
            )
        }
        init_obj()
        //回调
        function pageCallback(index, limit) {
            var usercode = $('#usercode').val();
            var username = $('#username').val();
            var locked = $('#locked').val();
            var isrealname ='';
            if(usercode == undefined) {
                usercode = ''
            }
            if(username == undefined) {
                username = ''
            }
            if(locked == undefined) {
                locked = ''
            }

            return getData(USER_URL.RESOURLIST, "{'page':" + index + ",'rows':" + limit + ",'usercode':'" + usercode + "','username':'" + username + "','locked':'" + locked + "','isrealname':'" + isrealname + "'}");

        }
        //获取数据
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
                if(item.locked == 0) {
                    $(item).attr('_locked', '启用');
                } else {
                    $(item).attr('_locked', '锁定');
                }
            });
            return res;
        }
        table.on('tool(tabNo)', function(obj) {
            var data = obj.data;
            console.log(data);
            //查看
            if(obj.event === 'detail') {
                layer.open({
                    title: ['详情', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                    type: 1,
                    content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    end: function(layero,index) {
                        layer.close(index)
                        $('#demo111').hide();
                    },
                    success: function(layero, index) {
                        //清除input框
                        $('.demo111').find('input').val('');
                        //图片加载错误处理
                        $('img').error(function() {
                            $(this).attr('src', '../../common/images/placeholder.png');
                        });
                        var paramInfo = "{'userId':" + data.id + "}";
                        var res = reqAjax(USER_URL.INFORMATION, paramInfo);
                        console.log(res)
                        var cityId = data.cityId;
                        var citres = ""
                        if(cityId == "" || cityId == null|| cityId=='null'){
                        }else{
                            var citParm = {
                                code : cityId
                            }
                            citres = reqAjax(USER_URL.PROVINCEBYID,JSON.stringify(citParm))
                            if(citres.code == 1){
                                citres = citres.data.areaname || '';
                            }
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
                            $("#infoIDz").attr("src", cardFrontPhoto);
                            $("#infoIDhand").attr("src", cardHoldPhoto);
                            $("#infoIDf").attr("src", cardBackPhoto);
                        }
                    },
                    yes: function(index, layero) {

                    }
                });
                //
            }
        })

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
    })
})