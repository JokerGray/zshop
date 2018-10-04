

$(function () {
    layui.use(['form', 'layer', 'laydate', 'table', 'laypage'], function () {
        var form = layui.form, table = layui.table, layer = layui.layer, laydate = layui.laydate, laypage = layui.laypage;
        form.render();

        var page = 1;
        var rows = 1000;
        var sd = '';
        var incOld = 0;
        var merchantId = getUrlParams("merchantId"); //商户id
        // var shopId=getUrlParams("shopId");//商铺id
        var userId = getUrlParams("userId"); //当前登录帐号id
        var userCode = getUrlParams('userCode') || sessionStorage.getItem("userCode"); //当前登录帐号
        var userName = getUrlParams('userName') || sessionStorage.getItem("userName"); //当前登录帐号名称

        var AREA = ['745px'];
        var TITLE = '';
        var SHADE = [0.2, '#000'];
        var USER_URL = {
            RESOURLIST: 'backstage/findIncome', //(收入查询)
            FINEXPENDITURE: 'backstage/findExpenditure',//支出查询
            ADD: 'backstage/addIncomeAndExpenditure', //新增接口
            DEL: 'backstage/deleteIncomeAndExpenditure', //作废接口
            ZMLXLIST: 'backstage/findAccountCategory',//账目类型列表
            YGLXLIST: 'backstage/org_user_list',//员工类型接口
            SELECTSHOP: 'backstage/findShopInfoByUser',//选择店铺
            AUTHORITY: 'backstage/findSeeAuthority',
        };

        var LINAME = $('.tab-box li.active').text();
        // var LINAME = '';
        var queryObj = GetRequest() || {};
        var paramsAuthority = {
            block: 'accountsday_income',
            merchantId: merchantId,
            userCode: queryObj.userCode || '',
            userName: userName
        };
        var authority = false;
        // 获取url 参数对象
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
         
        //获取权限
        reqAjaxAsync(USER_URL.AUTHORITY, JSON.stringify(paramsAuthority)).done(function (res) {
            //console.log(res, "USER_URL.AUTHORITY");
            if (res.code == 1) {
                if(res.data == true) {
                    authority = true;
                }
            }
            if (authority) {
                $('.main .tab-box li:last-child').show();  //显示 支出
                LINAME = $('.tab-box li.active').text();
            }
        });

        //时间控件
        laydate.render({
            elem: '#date'
            // ,type: 'datetime'
            , range: '至'//设置时间段
            , format: 'yyyy-MM-dd'
            , theme: '#26c3b2'
        });
        // businessTime
        laydate.render({
            elem: '#businessTime'
            , format: 'yyyy-MM-dd'
            , theme: '#26c3b2'
        });
        //加载账目类型 默认先加载支出
        getZMLX(2).done(function (res) {
            if (res.code == 1) {
                $('.accountCategoryId').html(zmlxTemp(res));
                form.render();
            }
        })
        //账目类型模板
        function zmlxTemp(res) {
            var str = ' <option value="">请选择</option>';
            var datas = res.data;
            $.each(datas, function (i, item) {
                str += '<option value="' + item.id + '">' + item.accountCategoryName + '</option>'
            })
            return str;
        }
        //调用账目类型接口
        function getZMLX(incOrExp) {
            return reqAjaxAsync(USER_URL.ZMLXLIST, JSON.stringify({
                page: page,
                rows: rows,
                merchantId: merchantId,
                incOrExp: incOrExp || ''
            }))
        }
        getShopList()
        //加载店铺
        function getShopList() {
            var params = {
                userId: userId
            }
            reqAjaxAsync(USER_URL.SELECTSHOP, JSON.stringify(params)).done(function (res) {
                if (res.code === 1) {
                    var datas = res.data;
                    console.log(datas)
                    var str = '<option value="">门店选择</option>'
                    $.each(datas, function (i, item) {
                        str += '<option value="' + item.id + '">' + item.shopName + '</option>'
                        sd += item.id + ',';
                    })
                    $('.shopName').html(str);
                    sd = sd.slice(0, sd.length - 1)
                    getTabel()
                    form.render()
                }
            })

        }
        //加载员工
        function findSalemanList(incOrExp, shopId) {
            reqAjaxAsync(USER_URL.YGLXLIST, JSON.stringify({
                page: page,
                rows: rows,
                merchantId: merchantId,
                incOrExp: incOrExp || '',
                shopId: shopId || '',
            })).done(function (res) {
                if (res.code == 1) {
                    console.log(res.data)
                    var str = ' <option value="">员工选择</option>';
                    var datas = res.data;
                    $.each(datas, function (i, item) {
                        str += '<option value="' + item.id + '">' + item.username + '</option>'
                    })
                    $('#handMan').html(str);
                    form.render();

                }
            })
        }
        //点击变色
        $('body').on('click', '.layui-form .layui-table-body tr', function () {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        });

        $('#searchBtn').click(function () {
            getTabel()
        })
        $('#restBtn').click(function () {
            $('.hearder').find('input,select').val('');
            getTabel()
        })
        //选择店铺时选择员工

        //点击新增
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            TITLE = ['新增' + LINAME, 'font-size:16px;background-color:#353b53;color:#1ce6d8'];
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                btn: '',
                end: function (layero, index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success: function (layero, index) {
                    el.find('button').eq(0).show();
                    var inc = $('.tab-box li.active').attr('data-type');

                    form.on('select(shop)', function (obj) {
                        var shopId = obj.value;
                        findSalemanList(inc, shopId)
                    })
                    getZMLX(inc).done(function (res) {
                        if (res.code == 1) {
                            $('#accountCategoryId').html(zmlxTemp(res));
                            form.render();

                            form.on('submit(sub)', function (data) {
                                saveIncome(inc);
                                getTabel();
                                layer.close(index)
                            })
                            $('#cancel').click(function () {
                                layer.close(index)
                            })
                        }
                    })

                },
                yes: function () {

                },
                btn1: function () {

                }
            })
        })

        //新增接口
        function saveIncome(inc) {
            var deff = $.Deferred();
            let params = {
                documentNumber: $.trim($('#documentNumber').val()),
                businessTime: $.trim($('#businessTime').val()),
                usercode: userCode || 'test',
                accountCategoryId: $.trim($('#accountCategoryId').val()),
                handMan: $.trim($('#handMan').val()),
                remarks: $.trim($('#remarks').val()) || '',
                shopId: $.trim($('#shopId').val()),
                enclosure: $.trim($('#enclosure').val()) || '',
                merchantId: merchantId,
                money: $.trim($('#money').val()),
                incOrExp: inc,
            }
            reqAjaxAsync(USER_URL.ADD, JSON.stringify(params)).done(function (res) {
                if (res.code == 1) {
                    layer.msg('新增成功');
                } else {
                    layer.msg(res.msg);
                }
                init_obj(USER_URL.FINEXPENDITURE, inc);
                deff.resolve(res);
            })
            return deff.promise();
        }

        //表格
        function tableInit(tableId, cols, pageCallback, pageLeft, url, type) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                // height: 'full-185',
                cols: cols,
                page: false,
                // even: true,
                skin: 'line',
                limit: 15
            });

            //2.第一次加载
            pageCallback(1, 15, url, type).done(function (res) {
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
                var page_options = {
                    elem: pageLeft,
                    count: res ? res.total : 0,
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                    limits: [15, 30],
                    limit: 15
                }
                page_options.jump = function (obj, first) {
                    tablePage = obj;

                    //首次不执行
                    if (!first) {
                        pageCallback(obj.curr, obj.limit, url, type).done(function (res) {
                            if (res.code == 1)
                                tableIns.reload({
                                    data: res.data,
                                    limit: obj.limit
                                });
                            else
                                layer.msg(res.msg);
                        })
                    }
                }

                laypage.render(page_options);

                return {
                    // tablePage,
                    // tableIns
                };
            });

        }
        //渲染表格
        function init_obj(url, type) {
            var element = type == 2 ? 'tableNo' : 'table-income';
            var bar = type == 2 ? '#barDemo' : '#barIncome';
            var page = type == 2 ? 'laypageLeft' : 'laypage-income';
            var objs = tableInit(element, [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 50
                }, {
                    title: '单据编号',
                    align: 'left',
                    field: 'documentNumber',
                    width: 180
                }, {
                    title: '账目类型',
                    align: 'left',
                    field: 'accountCategoryName',
                    width: 120
                }, {
                    title: '金额',
                    align: 'left',
                    field: 'money',
                    width: 140
                }, {
                    title: '业务日期',
                    align: 'left',
                    field: 'businessTime',
                    width: 120,
                    event: 'changeSwitch'
                }, {
                    title: '经手人',
                    align: 'left',
                    field: 'handManName',
                    width: 120
                }, {
                    title: '所属门店',
                    align: 'left',
                    field: 'shopName',
                    width: 120
                }, {
                    title: '录入日期',
                    align: 'left',
                    field: 'createTime',
                    width: 200,
                }, {
                    title: '作废',
                    align: 'left',
                    field: 'statusName',
                    width: 60

                }, {
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: bar,
                    width: 100
                }]
            ],

                pageCallback, page, url, type
            );
        }

        $('.layui-table-main').niceScroll({
            cursorcolor: "#dfdfdf",
            cursorborder: "0",
            autohidemode: false,
            cursorwidth: '10px'
        });
        //回调
        //pageCallback回调
        function pageCallback(index, limit, url, incOrExp) {
            var accountCategoryId = $.trim($('#accountCategoryIdser').val()) || '';//账目类型id
            var username = $.trim($('#username').val()) || ''//经手人id
            var shopId = $('#shopName').val() || sd;//店铺id
            var incOrExp = incOrExp;//支出收入
            var time = $('#date').val().split(' 至 ');
            var params = {
                page: index,
                rows: limit,
                startTime: time[0] || '',
                endTime: time[1] || '',
                accountCategoryId: accountCategoryId,
                merchantId: merchantId,
                incOrExp: incOrExp,
                username: username,
                shopId: shopId,
            }
            return getData(url, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url, parms).done(function (res) {
                if (res.code === 1) {
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        if (item.status == 1) {
                            $(item).attr('statusName', '有效')
                        } else if (item.status == 2) {
                            $(item).attr('statusName', '<span style="color:red">作废</span>')
                        }
                        item.businessTime = item.businessTime.slice(0, 10)
                        item.money = getMoneyFormat(item.money)
                    })

                    deff.resolve(res);
                } else {
                    layer.msg(res.msg)
                }
            })
            return deff.promise();

        }
        //表格操作
        table.on('tool(tableNo)', function (obj) {
            addData(obj);
        })
        table.on('tool(table-income)', function (obj) {
            addData(obj);
        })
        function addData(obj) {
            var el = $('#addDemo');
            var reDatas = obj.data;
            var ids = reDatas.id;
            var shopId = reDatas.shopId;
            if (obj.event == 'detail') {
                TITLE = ['查看' + LINAME, 'font-size:16px;background-color:#353b53;color:#1ce6d8'];
                layer.open({
                    title: TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: AREA,
                    btn: '',
                    end: function (layero, index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success: function (layero, index) {
                        el.find('button').eq(0).hide();
                        el.find('input,select,textarea').attr('disabled', 'disabled')
                        var inc = $('.tab-box li.active').attr('data-type');
                        getZMLX(inc).done(function (res) {
                            if (res.code == 1) {
                                $('#accountCategoryId').html(zmlxTemp(res));

                                //渲染数据
                                setDatas(el, reDatas);
                                //加载员工
                                // findSalemanList(inc,reDatas)
                                $('#handMan').html('<option>' + reDatas.handManName + '</option>')
                                form.render();
                            }
                        })

                        form.on('submit(sub)', function (data) {
                            layer.close(index)
                        })
                        $('#cancel').click(function () {
                            layer.close(index)
                        })
                    }
                })
            } else if (obj.event == 'del') {
                TITLE = ['作废', 'font-size:16px;background-color:#353b53;color:#1ce6d8'];
                console.log(obj.data)
                layer.confirm('是否作废序号【' + reDatas.eq + '】的数据?', { icon: 0, title: TITLE }, function (index) {
                    if (reDatas.hasOwnProperty('sign') && reDatas.sign != 1) {
                        layer.msg('禁止作废')
                        return false
                    }
                    var parms = {
                        ids: ids,
                        usercode: userId
                    };
                    reqAjaxAsync(USER_URL.DEL, JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg(res.msg);
                            getTabel()
                        } else {
                            layer.msg(res.msg);
                        };
                    })
                    layer.close(index)
                })
            }
        }
        //渲染数据
        function setDatas(demo, data) {
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            var selectArr = demo.find('select');
            var textarea = demo.find('textarea');
            setArr(inputArr, data);
            setArr(imgArr, data, '');
            setArr(selectArr, data);
            setArr(textarea, data);
            form.render()

        }
        //遍历数组，填充数据
        function setArr(arr, data, img) {
            var ids = '';
            $.each(arr, function (index, item) {
                ids = $(this).attr('id');
                if (data.hasOwnProperty(ids)) {
                    if (img !== undefined) {
                        $(this).attr('src', data[ids] || '')
                    } else {
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        function emptyInput(demo) {
            demo.find('textarea,input,select').val('');
            demo.find('input,select,textarea').attr('disabled', false)
            form.render()
        }
        $('.tab-box li').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            LINAME = $(this).text();
            var incNow = $(this).attr('data-type');
            if (incNow == incOld) return false

            getZMLX(incNow).done(function (res) {
                if (res.code == 1) {
                    $('.accountCategoryId').html(zmlxTemp(res));
                    form.render();
                }
            })
            getTabel(incNow);
            var inc = $('.tab-box li.active').attr('data-type');
            if(inc == 2) {
                $('#tab-expenditure').show().siblings().hide();
            }else {
                $('#tab-income').show().siblings().hide();
            }
        })
        function getTabel(incNow) {
            if (incNow == incOld) return false;
            var inc = $('.tab-box li.active').attr('data-type')
            if (inc == 1) {
                init_obj(USER_URL.RESOURLIST, inc)
            } else if (inc == 2) {
                init_obj(USER_URL.FINEXPENDITURE, inc)
            }

            incOld = inc

        }
    })
})