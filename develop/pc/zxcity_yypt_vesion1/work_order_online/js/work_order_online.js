(function ($) {
    var userno = yyCache.get('userId') || ''
    var USER_URL = {
        RESOURLIST: 'payZyzz/newZyzzInfoPage', //(查询列表)
        GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取用户
        SUBMITORDER:'payZyzz/updateZyzzInfo',//转工单

        // GETMERCHART:'payZyzz/selAllMerchantByNotDel',//获取商户列表
        // SAVEPAYZZ:'payZyzz/saveZyzzOrder',//新增接口
        GETNAME:'payZyzz/updateZyzzView  ',//获取商户名
        // UPDATEORDER:'payZyzz/updateZyzzOrder',//修改接口
        // UPDATESTATUS:'payZyzz/updateZyzzReviewStatus',//提交财务审核
        // DEL:'payZyzz/delScZyzzWorkOrder',//删除工单
    }

    var layer = layui.layer
    var table = layui.table
    var form = layui.form;
    //日期选择
    $('#datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        clearBtn:true,
        language: 'zh-CN'
    }).on('changeDate', function (ev) {
        var startTime = ev.date.valueOf();

        var endTime = $('#datetimepicker2').attr('data-time')
        $(this).parent().attr('data-time', startTime)
        $('#datetimepicker2 .datepicker').hide()
    })

    $('#datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        clearBtn:true,
        language: 'zh-CN'
    }).on('changeDate', function (ev) {
        var startTime = ev.date.valueOf()
        var endTime = $('#datetimepicker2').attr('data-time')
        console.log(endTime)
        $(this).parent().attr('data-time', startTime)
        $('#datetimepicker1 .datepicker').hide()
    })
    //搜索框 隐藏和打开
    $('#search').on('click', function () {
        $('#search-tool').slideToggle(200)
    })
    //点击变色
    $('#tableBox,#oneDemo').on('click', 'tbody tr', function () {
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')

    })
    $('.tab-title li').click(function () {
        var type = $(this).attr('data-num');
        $(this).addClass('active').siblings().removeClass('active');
        init_obj()
    })
    function searchAndRestBtn(){
        //搜索条件进行搜索
        $('#toolSearch').on('click', function () {
            var begintime = $('#datetimepicker1').attr('data-time')
            var endTime = $('#datetimepicker2').attr('data-time')
            if (begintime != '' && endTime != '') {
                if (begintime > endTime) {
                    layer.alert('截至时间不能早于创建时间哟')
                } else {
                    init_obj()
                }
            } else {
                init_obj()
            }
        })
        //重置功能
        $('#toolRelize').on('click', function () {
            $('#orgName2').val('')
            $('#jurisdiction-begin').val('')
            $('#jurisdiction-end').val('')
            $('#datetimepicker1').attr('data-time', '')
            $('#datetimepicker2').attr('data-time', '')
            init_obj()
        })

        //商户搜索
        $('#searchBtn').on('click', function () {
            init_obj_layer()
        })
        //商户重置功能
        $('#resetBtn').on('click', function () {
            $('#userName').val('')
            init_obj_layer()
        })

        //推荐人搜索
        $('#toolSearch1').on('click', function () {
            init_obj_common()
        })
        //推荐人重置功能
        $('#resetBtn1').on('click', function () {
            $('#appUserPhone').val('')
            init_obj_common()
        })
    }
    searchAndRestBtn()
    //选择推荐人
    $('#checkUserRel').click(function () {
        var el =$('#threeDemo');
        layer.open({
            title: ['推荐人列表', 'font-size:12px;background-color:#0678CE;color:#fff'],
            type: 1,
            content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['1000px', '600px'],
            end: function (index) {
                el.hide().find('input').val('');
                layer.close(index)
            },
            success: function (layero,index) {
                init_obj_common();
                table.on('tool(tableRe)',function (obj) {
                    console.log(obj)
                    if(obj.event === 'ok'){
                        layer.close(index);
                        $('#refUserId').val(obj.data.userId)
                        $('#refUserName').val(obj.data.yyptNickName)
                    }
                })
            },
            yes: function (index) {

            }
        })
    })
    //工单列表
    function init_obj () {
        var _obj = tableInit('demo', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80
                }, {
                    title: '商户名',
                    align: 'left',
                    field: 'orgName',
                    width: 150
                }, {
                    title: '工单制作项目',
                    align: 'left',
                    field: '_workItems',
                    width: 250
                },{
                    title: '工单创建时间',
                    align: 'left',
                    field: 'createTime',
                    width: 250
                }, {
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: '#barDemo',
                    width: 400
                }]
            ],
            pageCallback,'laypageLeft'
        )
    }
    init_obj()

    //推荐人列表
    function init_obj_common(){
        var obja = tableInit('tableRe', [
                [{
                    title: '序号',
                    align: 'left',
                    field: 'eq',
                    width: 80,
                    event: 'changetable'
                }, {
                    title: 'APP用户昵称',
                    align: 'left',
                    field: 'appUserNickName',
                    width: 120,
                    event: 'changetable'
                }, {
                    title: 'APP用户手机',
                    align: 'left',
                    field: 'appUserPhone',
                    width: 150,
                    event: 'changetable'
                }, {
                    title: '平台用户昵称',
                    align: 'left',
                    field: 'yyptNickName',
                    width: 150,
                    event: 'changetable'
                }, {
                    title: '平台用户手机',
                    align: 'left',
                    field: 'yyptPhone',
                    width: 200,
                    event: 'changetable'
                },{
                    title: '操作',
                    align: 'left',
                    fixed: 'right',
                    toolbar: '#barDemor',
                    width: 100
                }]
            ],

            pageCallbackCommon, 'laypageTip'
        );
    }

    //工单数据处理
    function getData (url, parms) {
        var res = reqAjax(url, parms)
        var data = res.data
        console.log(data)
        $.each(data, function (i, item) {
            $(item).attr('eq', (i + 1))
            if(item['workItems']){
                console.log()
                var arr = item['workItems'].split(',');
                $(item).attr('worItemsArr',arr)
                if(arr.length>1){
                    $(item).attr('_workItems', '视频拍摄,720°全景拍摄')
                }else{
                    if(arr[0] == 0){
                        $(item).attr('_workItems', '视频拍摄')
                    }else if(arr[0] == 1){
                        $(item).attr('_workItems', '720°全景拍摄')
                    }
                }
            }

        })
        return res
    }
    //pageCallback回调
    function pageCallback (index, limit) {
        var orgName = $('#orgName2').val() || '';
        var startTime = $('#jurisdiction-begin').val() || '';
        var endTime = $('#jurisdiction-end').val() || '';
        var status = $('.tab-title li.active').attr('data-num');
        var params = {
            page: index,
            rows: limit,
            orgName:orgName,
            startTime:startTime,
            endTime:endTime,
            status:status

        };

        return getData(USER_URL.RESOURLIST,JSON.stringify(params))
    }


    //推荐人回调
    function pageCallbackCommon(index,limit){
        var param = {
            page: index,
            rows: limit,
            appUserPhone: $('#appUserPhone').val() || ''
        }
        return getDataCommon(USER_URL.GETRECOMMEND,JSON.stringify(param))
    }
    function getDataCommon(url, parms){
        var res = reqAjax(url, parms)
        var data = res.data
        console.log(data)
        $.each(data, function (i, item) {
            $(item).attr('eq', (i + 1))

        })
        return res;
    }

    table.on('tool(demo)', function (obj) {
        var reData = obj.data
        let el = $('#demo222')
        var ids = reData.id;
        var orderId = reData.orderId;
        console.log(reData)
        //查看
        if (obj.event === 'nodetail') {
            $('.person').show();
            $('.person2').hide();
            var resName = reqAjax(USER_URL.GETNAME,JSON.stringify({id:orderId}));
            console.log(resName)
            el.find('input,button,select,textarea').attr('disabled',true)
            layer.open({
                title: ['查看工单', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['1000px', '600px'],
                btn:['确定'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success: function (layero, index) {
                    setForms('changeForm');
                    console.log(userno);
                    if(resName.code == 1){
                        $('.refUserName').val(resName.data.refUserName || '' )

                    }
                    setDatas(el,reData);

                },
                yes: function (index) {
                    layer.close(index);
                },btn2:function (index) {
                    layer.close(index);
                }
            })

        } else if (obj.event === 'submit') {
             $('.person').hide();
            $('.person2').show();
            el.find('input,button,select,textarea').attr('disabled',true)
            $('#remark,#checkUserRel').attr('disabled',false)
            layer.open({
                title: ['转工单', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['1000px', '600px'],
                btn:['确定'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
                },
                success: function (layero, index) {
                    setForms('changeForm');
                    setDatas(el,reData);

                    // review.num = 0;
                    // review.total = reData.reviewActualReceivable;
                    // getCheckBox(el)
                    // function getCheckBox(el){
                    //     var checkBoxArr = el.find('input[name="workItems"]');
                    //     var els = $('#reviewReceivable');
                    //     for(let i = 0 ,len = checkBoxArr.length;i<len;i++){
                    //         var ele = $(checkBoxArr[i]).attr('data-id')//判断data-id
                    //         if(checkBoxArr[i].checked === true){
                    //             review.num++;
                    //             $('.'+ele).find('input').attr('lay-verify','float|required').removeClass('layui-disabled').attr('disabled',false)
                    //         }else{
                    //             $('.'+ele).find('input').attr('lay-verify','').addClass('layui-disabled').attr('disabled',true).val('');
                    //         }
                    //     }
                    //     els.val(review.num*review.price)
                    // }

                },
                yes: function (index) {

                    var checkBoxArr = el.find('input[name="workItems"]');
                    var str = '';
                    for(let i = 0 ,len = checkBoxArr.length;i<len;i++){
                        if(checkBoxArr[i].checked === true){
                            str+=checkBoxArr[i].value;
                            str+=',';
                        }
                    }
                    if(!str){
                        layer.msg('请至少选择一项制作项目！')
                    }else{
                        str = str.substr(0,str.length-1);
                        setSaveBtn(el,index,str,USER_URL.SUBMITORDER,ids)
                        // layer.close(index)

                    }
                },btn2:function (index) {
                    layer.close(index);
                }
            })
        }
    })


    function tableInit (tableId, cols, pageCallback, pages) {
        var tableIns, tablePage
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-340',
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
            elem: pages,
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
                        limit: obj.limit,
                        data: resTwo.data
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
    //调用保存接口

    function setForms(form){
        //给保存按钮添加form属性
        $("div.layui-layer-page").addClass("layui-form");
        $("a.layui-layer-btn0").attr("lay-submit","");
        $("a.layui-layer-btn0").attr("lay-filter",form);
    }
    function setSaveBtn(demo,index,str,cmd,ids){
        var paramInfo={
            merchantId:$('#merchantId').val(),//商户id
            workItems:str,//工单制作项目

            workSource:1,//来源
            workRemark:$('#remark').val()||'',//备注
            workUserId:userno,//session获取的userid
            refUserId:$('#refUserId').val() ||'',//推荐人id
            reviewReceivable:$('#realAmount').val(),//应收账款
            reviewActualReceivable:$('#realAmount').val(),//实收账款
            reviewRefAmount:$('#reviewRefAmount').val()||0,//推荐人提成
            reviewWorkAmount:$('#reviewWorkAmount').val()||0,//制作人提成
            reviewVideoReceivable:$('#reviewVideoReceivable').val()||0,//视频制作实收
            reviewPanoramicReceivable:$('#reviewPanoramicReceivable').val() || 0,//全景实收
        }
        paramInfo.zyzzInfoId =ids;
        var res =reqAjax(cmd,JSON.stringify(paramInfo));
        if(res.code == 1){
            layer.msg('操作成功');
            layer.close(index);
            init_obj();
            demo.hide();
        }
    }
    //渲染数据
    function setDatas(demo,data){
        var inputArr = demo.find('input');
        var imgArr = demo.find('img');
        setArr(inputArr,data);
        setArr(imgArr,data,'');
        demo.find('input[type="checkbox"]').val(data.worItemsArr)
        $('#remark').val(data['remark']);
        $('#workSource').val(data['workSource'])

        $('#reviewActualReceivable').val(data['panoramicAmount']+data['videoAmount'])
        form.render()

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
        demo.hide().find("input[type='text']").val("");
        var checkBox = demo.find("input[type='checkbox']");
        $.each(checkBox,function (index,el) {
            el.checked = false;
        })
        demo.find("img").attr("src", '');
        demo.find('textarea').val('');
        demo.find('select').val('');
        // $('.videoAmount,.panoramicAmount').find('input').attr('lay-verify','').addClass('layui-disabled').attr('disabled',true)
        form.render()
    }

    //
    //
    // var review={
    //     num:0,
    //     price:1000,
    //     total:0,
    // }
    // //检测勾选项目
    // function setCheckBox(){
    //     var els = $('#reviewReceivable');
    //     form.on('checkbox(workItems)',function (data) {
    //         var el = $('.videoAmount');
    //         var el2 = $('.panoramicAmount');
    //         if(data.value == 0){
    //             checkDisn(data.elem.checked,el,els)
    //         }else if(data.value == 1){
    //             checkDisn(data.elem.checked,el2,els)
    //         }
    //     })
    //
    // }
    // //检测工单制作项目是否勾选
    // function checkDisn (bool,el,els) {
    //     if(bool === true){//是
    //         el.find('input').attr('lay-verify',"float|required").removeClass('layui-disabled').attr('disabled',false);
    //         els.val((review.num+=1)*review.price)
    //     }else{//否
    //         el.find('input').attr('lay-verify','').addClass('layui-disabled').attr('disabled',true).val('');
    //         els.val((review.num-=1)*review.price)
    //         setTotal();
    //     }
    // }
    // $('input[name="money"]').blur(function() {
    //     //失去焦点时，如果值为空，则设置为默认值
    //     if($(this).val()){
    //         setTotal();
    //     }
    // });
    // //计算实收总金额
    // function setTotal(){
    //     review.total = 0;
    //     var checkBoxArr = $('#demo222').find('input[name="money"]');
    //     var els = $('#reviewActualReceivable');
    //     $('input[name="money"]').each(function () {
    //         review.total+= parseFloat($(this).val()||0);
    //     });
    //     els.val(review.total);
    // }
    //
    // setCheckBox();

})(jQuery)