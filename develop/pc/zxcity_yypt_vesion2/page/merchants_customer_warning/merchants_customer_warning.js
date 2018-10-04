$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laydate=layui.laydate,laypage=layui.laypage;
        form.render();
        var userno = yyCache.get('userno') || ''

        var AREA = ['90%', '90%'];
        var TITLE = ['实名认证信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var imgPath = '../../common/images/placeholder.png';
        var USER_URL = {
            RESOURLIST: 'operations/getAdventTimeMerchant', //(查询列表)
            RECHARGEAPPLY: 'operations/merchantRechargeApply', //续费申请提交//续费
            LOCKTOGGLE: 'operations/lockedMerchant', //(锁定商户/启用商户)//锁定
            LOG:'operations/insertMerchantStatusLog'//(启停的日志)
        };

        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        })
        $('.zImg').click(function(){
            var src = $(this).prop('src');
            window.open(src);
        })
        //搜索条件进行搜索
        // $('#toolSearch').on('click', function() {
        //
        // })
        form.on('submit(search)',function (data) {
            if(data){
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
            }
        })
        //重置
        $("#toolRelize").click(function() {
            $('#surplus_date').val('15')
            $('#merchatName').val('')
            $('#phone').val('')
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
        function tableInit(tableId, cols, pageCallback, pageLeft) {
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

            laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
        }
        //渲染表格
        function init_obj() {
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
                        field: '_ismerchant',
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

                pageCallback, 'laypageLeft'
            );
        }
        init_obj()
        //回调
        //pageCallback回调
        function pageCallback(index, limit) {
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
            return getData(USER_URL.RESOURLIST, JSON.stringify(params));
        }
        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
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
        table.on('tool(tableNo)', function(obj) {
            var data = obj.data;
            var user_id = data.user_id;
            var demo = $('#demo111')
            console.log(obj);
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
                if (data.merchantStatus === 1) {
                    merchantStatus = 0;
                } else {
                    merchantStatus = 1;
                }

                var merchantId = data.merchantId
                var userId = yyCache.get('userId')
                var params = {
                    merchantId, userId, merchantStatus

                }
                layer.confirm('是否' + data.c_locked + '【' + data.orgName + '】' + '？', {
                    icon: 0,
                    title: '提示'
                }, function (index) {
                    reqAjaxAsync(USER_URL.LOG, JSON.stringify(params)).done(function (res) {
                        if (res.code === 1) {
                            init_obj();
                            layer.msg(res.msg);
                        } else {
                            layer.msg(res.msg);
                        }

                    })
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

            init_obj()
        }


    })
})