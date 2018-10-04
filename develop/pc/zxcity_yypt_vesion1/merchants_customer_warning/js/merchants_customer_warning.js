(function ($) {
    var userno = yyCache.get('userno') || ''
    var USER_URL = {
        RESOURLIST: 'operations/getAdventTimeMerchant', //(查询列表)
        RECHARGEAPPLY: 'operations/merchantRechargeApply', //续费申请提交//续费
        LOCKTOGGLE: 'operations/lockedMerchant', //(锁定商户/启用商户)//锁定
        LOG:'operations/insertMerchantStatusLog'//(启停的日志)
    }

    var layer = layui.layer
    var table = layui.table
    var form = layui.form;
    layui.use('form', function () {
        form = layui.form
        form.verify({
            username: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$').test(value)) {
                    return '用户名不能有特殊字符'
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\''
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字'
                }
            },
            pass: function (value, item) {
                if (!new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$').test(value)) {
                    return '密码不能有特殊字符'
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '密码首尾不能出现下划线\'_\''
                }
            }
        })
    })

    //搜索
    // $('#toolSearch').on('click', function () {
    //
    //
    // })
    //搜索
    form.on('submit(search)',function (data) {
        if(data){
            init_obj()
        }
    })
    //重置功能
    $('#toolRelize').on('click', function () {
        $('#surplus_date').val('15')
        $('#merchatName').val('')
        $('#phone').val('')
        init_obj()
    })

    function init_obj () {
        var _obj = tableInit('demo', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80
                }, {
                    title: '账号',
                    align: 'left',
                    field: 'usercode',
                    width: 150
                }, {
                    title: '商户名称',
                    align: 'left',
                    field: 'orgName',
                    width: 150
                }, {
                    title: '手机号',
                    align: 'left',
                    field: 'phone',
                    width: 150
                }, {
                    title: '商户等级',

                    align: 'left',
                    field: 'levelName',
                    width: 100,
                    event: 'changeSwitch'
                }, {
                    title: '到期时间',
                    align: 'left',
                    field: 'end_time',
                    width: 150
                }, {
                    title: '剩余到期时间',
                    align: 'left',
                    field: 'surplus_date',
                    width: 150
                }, {
                    title: '锁定状态',
                    align: 'left',
                    field: '_locked',
                    width: 100
                }, {
                    title: '操作',
                    align: 'left',
                    toolbar: '#barDemo',
                    width: 250
                }]
            ],
            pageCallback
        )
    }

    initForAct()

    function initForAct (replystatus) {
        init_obj()
    }

    //数据处理
    function getData (url, parms) {
        var res = reqAjax(url, parms)
        var data = res.data
        console.log(data)
        $.each(data, function (i, item) {
            $(item).attr('eq', (i + 1))
            if (item.merchant_status == 0) {
                $(item).attr('_ismerchant', '平台用户')
            } else {
                $(item).attr('_ismerchant', '商户')
            }
            if (item.merchantStatus == 0) {
                $(item).attr('_locked', '是')
                $(item).attr('c_locked', '解锁')
            } else {
                $(item).attr('_locked', '否')
                $(item).attr('c_locked', '锁定')
            }
        })
        return res
    }

    //pageCallback回调
    function pageCallback (index, limit) {
        var surplus_date = $('#surplus_date').val() || 15;
        var merchatName = $('#merchatName').val()
        var phone = $('#phone').val()
        if (surplus_date == undefined) {
            surplus_date = ''
        }
        if (merchatName == undefined) {
            merchatName = ''
        }
        if (phone == undefined) {
            phone = ''
        }
        var params = {
            page: index,
            rows: limit,
            days: surplus_date,
            orgName: merchatName,
            phone: phone
        }
        return getData(USER_URL.RESOURLIST, JSON.stringify(params))
    }

    table.on('tool(demo)', function (obj) {
        var form = layui.form
        var data = obj.data
        //查看
        if (obj.event === 'detail') {
            layer.open({
                title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['800px', '560px'],
                end: function () {
                    $('#demo111').hide()
                },
                success: function (layero, index) {

                },
                yes: function (index, layero) {

                }
            })

        } else if (obj.event === 'nodetail') {
            console.log(data)
            var merchantStatus;
            if(data.merchantStatus === 1){
                merchantStatus = 0;
            }else{
                merchantStatus = 1;
            }

            var merchantId = data.merchantId
            var userId = yyCache.get('userId')
            var params = {
                 merchantId,userId,merchantStatus

            }
            layer.confirm('是否' + data.c_locked + '【' + data.orgName + '】' + '？', {
                icon: 0,
                title: '提示'
            }, function (index) {
                reqAjaxAsync(USER_URL.LOG,JSON.stringify(params)).done(function (res) {
                    if(res.code === 1){
                        init_obj();
                        layer.msg(res.msg);
                    }else{
                        layer.msg(res.msg);
                    }

                })
            })

        }
    })

    //检测密码强度
    function checkLevel (ele, elee, con) {
        var regxs = []
        regxs.push(/[^a-zA-Z0-9_]/g)
        regxs.push(/[a-zA-Z]/g)
        regxs.push(/[0-9]/g)
        $('body').on('keyup', elee, function () {
            var val = $(this).val()
            var len = val.length
            var sec = 0
            if (len >= 6) { // 至少六个字符

                for (var i = 0; i < regxs.length; i++) {
                    if (val.match(regxs[i])) {
                        sec++
                    }
                }
            }
            var result = (sec / regxs.length) * 100
            if (result > 0 && result <= 50) {
                con.find('li').eq(0).addClass('act').siblings('').removeClass('act')
            } else if (result > 50 && result < 100) {
                con.find('li').eq(1).addClass('act').siblings('').removeClass('act')
            } else if (result == 100) {
                con.find('li').eq(2).addClass('act').siblings('').removeClass('act')
            }

        })
    }

    $('#search').on('click', function () {
        $('#search-tool').slideToggle(200)
    })

    //点击变色
    $('#tableBox').on('click', 'tbody tr', function () {
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')

    })

    //刷新
    function refresh () {
        location.reload()
    }

    $('#refresh').click(function () {
        refresh()
    })

    function tableInit (tableId, cols, pageCallback, test) {
        var tableIns, tablePage
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-318',
            cols: cols,
            page: false,
            even: true,
            skin: 'row'
        })

        //2.第一次加载
        var res = pageCallback(1, 15)
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
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function (obj, first) {
            tablePage = obj

            //首次不执行
            if (!first) {
                var resTwo = pageCallback(obj.curr, obj.limit)
                if (resTwo && resTwo.code == 1)
                    tableIns.reload({
                        data: resTwo.data,
                        limit:obj.limit
                    })
                else
                    layer.msg(resTwo.msg)
            }
        }

        layui.laypage.render(page_options)

        return {
            tablePage,
            tableIns
        }
    }

    //新增模态框 input限制输数字
    $('#upgradeLevel').keyup(function () {
        $(this).val($(this).val().replace(/^0/, ''))
    })

})(jQuery)