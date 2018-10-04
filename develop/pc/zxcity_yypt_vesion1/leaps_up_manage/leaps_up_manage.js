$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate'], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate
        form.render();
        var page = 1;
        var rows = 15;
        var AREA = ['90%', '90%'];
        var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var dataTr = {};
        var USER_URL = {
            LISTS:'user/queryLeapsUpgradePage',//(列表)
            ADD:'user/addLeapCondition',//新增
            DETAIL:'user/leapsUpgradeView',//查看功能
            SUBMIT:'user/leapsUpgradePassed',//提交财务审核
            REFUSE:'user/leapsUpgradeNotPassed',//拒绝
            SHAREUSERlIST:'user/selUserUpgradeInfo',//分享人列表

        };
        laydate.render({
            elem:'#date',
            range:'至'
        })
        $('#searchToggle').click(function () {
            $('.header_ul').slideToggle();
        })
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input,select').val('')
            init_obj()
        })

        // form.on('select(upgradingTypeName)',function (obj) {
        //     var va = obj.value;
        // })
        //表格操作
        table.on('tool(tableNo)', function (obj) {
            var reData = obj.data
            let el = $('#addDemo')
            var ids = reData.id;
            var ev = obj.event ;
            //查看
            var btn=[];
            if (ev == 'edit') {
                dataTr = obj.data
                $('.editBox').show();
                var ohtml = '<option value="">--请选择--</option>'
                var dataExpansion = reData.dataExpansion;
                TITLE[0]='审核'
                btn=['提交到财务审核','审核不通过']
                $.each(dataExpansion,function (i,item) {
                    if(i >= reData.oldMerchantLevel) {
                        ohtml += '<option value="' + item.org_level + '">' + item.levelName + '</option>'
                    }
                })
                el.find('input').removeAttr('disabled')
                $('#jumpMerchantLevel').html(ohtml)

                reqAjaxAsync(USER_URL.DETAIL,JSON.stringify({serialNo:reData.serialNo})).done(function (res) {
                    if(res.code  == 1){
                        var bhtml = '<option value="">--请选择--</option>'
                        var datas = res.data;
                        $.each(datas.sourceList,function (i,item) {
                            bhtml+='<option value="'+item.id+'">'+item.name+'</option>'
                        })
                        $('#source').html(bhtml)
                        form.render()
                    }
                })
                if(reData.oldShareUser){
                    $('#recommendUserBtn').hide();
                }else{
                    $('#recommendUserBtn').show();
                }
            }else if( ev == 'detail'){
                dataTr = obj.data
                $('.editBox').hide();
                el.find('input').attr('disabled',true)
                TITLE[0]='查看'
                btn=[]
            }
            layer.open({
                title:TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['auto'],
                btn:btn,
                end: function (index) {
                    layer.close(index);
                    emptyInput(el)
                },
                success: function (index) {
                    getParams(el)
                    setDatas(el,reData)
                    if(ev == 'edit'){
                        setForms('changeForm')
                    }
                    form.render()
                },yes:function (index) {
                    form.on('submit',function (obj) {
                        if(obj){
                            saveFun(USER_URL.SUBMIT,reData.id,el).done(function (res) {
                                layer.msg(res.msg)
                                layer.close(index)
                            })
                        }
                    })
                    return false;
                },btn2:function (index) {
                    refuseFun(USER_URL.REFUSE,{id:ids}).done(function (res) {
                        layer.msg('操作成功！');
                        layer.close(index)
                    })
                    return false
                }
            })
        })
        function saveFun(url,ids,el) {
            var params = getParams(el);
            params.id = ids;
            params.payeeType = $('input[name="payeeType"]:checked')[0].value;  
            console.log($('input[name="payeeType"]:checked'))
            console.log(params)

            return reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }
            })
        }
        function refuseFun(url,params) {
            return reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }

            })
        }
        //表格模板
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
                limit: 15
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
                    layout: ['count', 'prev', 'page', 'next','limit'],
                    limits: [15, 30],
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
                        });

                    }
                }

                laypage.render(page_options);

                return {
                    tablePage,
                    tableIns
                };
            });

        }
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100,
                    }, {
                        title: '商户名',
                        align: 'left',
                        field: 'merchantName',
                        width: 120
                    }, {
                        title: '手机号',
                        align: 'left',
                        field: 'phone',
                        width: 100,
                    },{
                        title: '目前商户等级',
                        align: 'left',
                        field: 'oldMerchantLevelName',
                        width: 100,
                    }, {
                        title: '目标商户等级',
                        align: 'left',
                        field: 'newMerchantLevelName',
                        width: 100,
                    },{
                        title: '升级条件',
                        align: 'left',
                        field: 'levelOldNumStr',
                        width: 100,
                    }, {
                        title: '实际达成情况',
                        align: 'left',
                        field: 'levelNewNumStr',
                        width: 100,
                    }, {
                        title: '审核状态',
                        align: 'left',
                        field: 'reviewStatusName',
                        width: 100,
                    }, {
                        title: '申请时间',
                        align: 'left',
                        field: 'createTime',
                        width: 100,
                    },{
                        title: '操作',
                        fixed:'right',
                        align: 'left',
                        toolbar: '#barDemo',
                        width: 120,
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var merchantName = $.trim($('#merchantNames').val())||'';
            var phone = $.trim($('#phones').val())||'';
            var date = $.trim($('#date').val()).split(' 至 ')||'';
            var params = {
                page: index,
                rows: limit,
                merchantName:merchantName,
                phone:phone,
                startTime:date[0] ||'',
                endTime:date[1] || date[0] || '',

            }
            if($('#merchantTradeIds').val()){
                params.reviewStatus =$('#merchantTradeIds').val()
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    var dataExpansion = res.dataExpansion;
                    console.log(res)
                    var str = '';
                    var newMerchantLevel,oldMerchantLevel;

                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        item.dataExpansion = dataExpansion;
                        if(item.reviewStatus == 1){
                            item.reviewStatusName = '待审核'
                        }else if(item.reviewStatus == 2){
                            item.reviewStatusName = '财务审核中'
                        }else if(item.reviewStatus == 3){
                            item.reviewStatusName = '审核通过'
                        }else if(item.reviewStatus == 4){
                            item.reviewStatusName = '审核拒绝'
                        }
                        if(item.levelConding == 1){
                            str = '元'
                        }else{
                            str = '家'
                        }
                        item.levelOldNumStr = item.levelOldNum+str;
                        item.levelNewNumStr = item.levelNewNum+str;
                        newMerchantLevel = item.newMerchantLevel;
                        oldMerchantLevel = item.oldMerchantLevel;
                        item.oldShareUser = item.oldShareUser != 0 ? item.oldShareUser : ''
                        $.each(dataExpansion,function (j,items) {
                            if(items.org_level == newMerchantLevel ){
                                item.newMerchantLevelName = items.levelName;
                            }else if(items.org_level == oldMerchantLevel ){
                                item.oldMerchantLevelName = items.levelName;
                            }
                        })
                    })


                }else{
                    layer.msg(res.msg)
                }
            })

        }
        //获取参数
        function getParams(el) {
            var input = el.find('input,textarea,select');
            var img = el.find('img');
            var params = {};
            $.each(input,function (i, item) {
                if(item.id && item.value){
                    params[item.id] = item.value
                }
            })
            $.each(img,function (j, items) {
                if(items.id && items.src != ''){
                    params[item.id] = item.src
                }
            })
            console.log(params)
            return params;
        }
        //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            var selectArr = demo.find('select');
            var textarea = demo.find('textarea');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            setArr(selectArr,data);
            setArr(textarea,data);
            form.render()

        }
        //遍历数组，填充数据
        function setArr(arr,data,img){
            var ids = '';
            $.each(arr,function (index, item) {
                ids = $(this).attr('id');
                if(data.hasOwnProperty(ids)){
                    if(img !== undefined){
                        $(this).attr('src',data[ids] || '../../common/images/placeholder.png')
                    }else{
                        $(this).val(data[ids]);
                    }
                }
            })
        }
        //清空数据
        function emptyInput(demo){
            demo.find('textarea,input:not([type=radio]),select').val('')
            demo.find('input[type=radio][value=0]')[0].checked = true
            demo.find('img').attr('src','');
            demo.find('input,select,textarea').attr('disabled',false)
            $('.dowmLevelName').hide()
            form.render()
        }
        //给保存按钮添加form属性
        function setForms(form){
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }

        //重新选择分享人
        $('#recommendUserBtn').bind('click',function () {
            var demo = $('#recommendUserTip')
            TITLE[0] = '查看明细'
            layer.open({
                title: TITLE,
                type: 1,
                content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['70%','auto'],
                closeBtn: 1,
                btn: ['确认'],
                shade: [0.1, '#000'],
                end: function () {
                    demo.hide().find('input').val('');
                },
                success:function (layero,index) {
                    getTable(dataTr.levelConding);

                }
            })

        })
        function getTable(type) {
            if(type == 1){
                tableInit('recommendUserTab', [
                        [{
                            title: '序号',
                            align: 'left',
                            field: 'eq',


                        }, {
                            title: '商户名',
                            align: 'left',
                            field: 'merchant_name',

                        }, {
                            title: '手机号',
                            align: 'left',
                            field: 'merchant_phone',

                        }, {
                            title: '目标商户等级',
                            align: 'left',
                            field: 'levelName',

                        }, {
                            title: '回款金额',
                            align: 'left',
                            field: 'upgrade_real_amount',

                        }, {
                            title: '收款方',
                            align: 'left',
                            field: 'payeeTypeName',

                        }, {
                            title: '升级时间',
                            align: 'left',
                            field: 'upgrade_confirm_time',

                        }]
                    ],
                    pageCallbackRecommend, 'laypageUser'
                );
            }else{
                tableInit('recommendUserTab', [
                        [{
                            title: '序号',
                            align: 'left',
                            field: 'eq',
                            width: 80,

                        }, {
                            title: '商户名',
                            align: 'left',
                            field: 'org_name',
                            width: 200,

                        }, {
                            title: '手机号',
                            align: 'left',
                            field: 'usercode',
                            width: 150,

                        }, {
                            title: '目标商户等级',
                            align: 'left',
                            field: 'levelName',
                            width: 150,

                        }, {
                            title: '升级时间',
                            align: 'left',
                            field: 'create_time',
                            width: 150,

                        }]
                    ],
                    pageCallbackRecommend, 'laypageUser'
                );
            }

        }
        function pageCallbackRecommend(page,rows){
            var params={
                page:page,
                rows:rows,
                levelConding:dataTr.levelConding,
                oldMerchantLevel:dataTr.oldMerchantLevel,
                merchantId:dataTr.merchantId,
                phone:$.trim($('#recommendUserPhone').val())|| '',
                merchantName:$.trim($('#recommendOrgName').val())|| '',
            }
            return getData1(USER_URL.SHAREUSERlIST,JSON.stringify(params))

        }
        $('#toolSearch2').click(function () {
            getTable(dataTr.levelConding);
        })
        $('#toolRelize2').click(function () {
            $(this).parents('.inputBox').find('input').val('');
            getTable(dataTr.levelConding);
        })
        table.on('tool(recommendUserTab)',function (obj) {
            if(obj.event == 'ok'){
                console.log(obj.data)
                $('#oldUserName').val(obj.data.appUserName).prev().val(obj.data.appUserId)
                layer.close(index);

            }
        })

        function getData1(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    var dataExpansion = res.dataExpansion
                    if(!res.total){
                        res.total = data.length
                    }
                    var str = '';
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        if(item.payee_type){
                            item.payeeTypeName =item.payee_type==0?'未收款':(item.payee_type==1?'公司收款':'荆州收款')
                        }else{
                            item.payeeTypeName='-'
                        }
                        $.each(dataExpansion,function (j, items) {
                            if(item.upgrade_type == items.org_level || item.level_type_id == items.org_level){
                                item.levelName = items.levelName
                                return false
                            }
                        })

                    })
                }else{
                    layer.msg(res.msg)
                }
            })

        }
        
    })


})

