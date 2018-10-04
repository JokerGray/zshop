$(function(){
    layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage', 'element'], function () {
        var form = layui.form,table = layui.table,layer = layui.layer,laydate=layui.laydate,laypage=layui.laypage;
        form.render();
        var userno = yyCache.get('userId') || ''
        var AREA = ['90%', '90%'];
        var TITLE = ['工单信息', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var imgPath = '../../common/images/placeholder.png';
        var USER_URL = {
            RESOURLIST: 'payZyzz/newZyzzPageByReviewStatus', //(查询列表)
            GETRECOMMEND: 'operations/getTypeFourRecommendPage', //获取所有推荐关系为公司员工的列表并分页
            GETMERCHART:'payZyzz/selAllMerchantByNotDel',//获取商户列表
            SAVEPAYZZ:'payZyzz/saveZyzzOrder',//新增接口
            GETNAME:'payZyzz/updateZyzzView  ',//获取商户名
            UPDATEORDER:'payZyzz/updateZyzzOrder',//修改接口
            UPDATESTATUS:'payZyzz/updateZyzzReviewStatus',//提交财务审核
            DEL:'payZyzz/delScZyzzWorkOrder',//删除工单
            WORKSOURCE:'payZyzz/newZyzzSourcePage',//工单来源
        };


        var review={
            num:0,
            price:1000,
            total:0,
        }

        // 时间控件
        laydate.render({
            elem: '#jurisdiction-begin',
            done:function(value,date){
                $(this.elem).attr('data-time',Date.parse(value) || '')
            }
        });
        laydate.render({
            elem: '#jurisdiction-end',
            done:function(value,date){
                $(this.elem).attr('data-time',Date.parse(value) || '')
            }
        });
        //审核待审核
        $('.tab_box button').click(function () {
            $(this).addClass('active').removeClass('op5').siblings().addClass('op5').removeClass('active');
            var type = $(this).attr('data-type');

            init_obj();
        })
        //点击变色
        $('#tableBox').on('click', 'tbody tr', function() {
            $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
        })
        $('.zImg').click(function(){
            var src = $(this).prop('src');
            window.open(src);
        })
        //搜索条件进行搜索
        $('#toolSearch').on('click', function() {
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
        })
        //重置
        $("#toolRelize").click(function() {
           $('.input-box').find('input').val('').attr('data-time','');
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

        //选择商户
        $('#checkUser').click(function () {
            var el =$('#oneDemo');
            layer.open({
                title: ['选择商户', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                btn:['取消'],
                end: function (index) {
                    el.hide().find('input').val('')
                    layer.close(index)
                },
                success: function (layero, index) {
                    init_obj_layer ();
                    table.on('tool(tableNo)',function (obj) {
                        console.log(obj)
                        if(obj.event === 'ok'){
                            layer.close(index);
                            $('#orgName').val(obj.data.org_name).attr('');
                            $('#merchantId').val(obj.data.merchant_id)
                        }
                    })
                },
                yes: function (index) {
                    layer.close(index)
                }
            })
        })
        //选择推荐人
        $('#checkUserRel').click(function () {
            var el =$('#threeDemo');
            layer.open({
                title: ['推荐人列表', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: AREA,
                btn:['取消'],
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
                            $('#yyptNickName').val(obj.data.yyptNickName)
                        }
                    })
                },
                yes: function (index) {
                    layer.close(index)
                }
            })
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
                $('#usercode').val('')
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
                    var resTwo = pageCallback(stat,obj.curr, obj.limit);
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
            var objs = tableInit('demo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '工单号',
                        align: 'left',
                        field: 'workNo',
                        width: 150
                    }, {
                        title: '工单制作项目',
                        align: 'left',
                        field: '_workItems',
                        width: 250
                    }, {
                        title: '工单制作状态',
                        align: 'left',
                        field: '_workStatus',
                        width: 150
                    }, {
                        title: '应收账款',
                        align: 'left',
                        field: 'reviewReceivable',
                        width: 150
                    }, {
                        title: '工单创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 250
                    }, {
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar: '#barDemo',
                        width: 250
                    }]
                ],

                pageCallback, 'laypageLeft'
            );
        }

        //商户列表
        function init_obj_layer () {
            var _obj = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '商户名',
                        align: 'left',
                        field: 'org_name',
                        width: 300
                    }, {
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar: '#barDemor',
                        width: 200
                    }]
                ],
                pageCallbackLayer,'laypageLeftLayer'
            )
        }

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
        init_obj()
        //回调
        //pageCallback回调
        function pageCallback(index, limit) {
            var workNo = $('#workNo').val() || '';
            var startTime = $('#jurisdiction-begin').val() || '';
            var endTime = $('#jurisdiction-end').val() || '';
            var reviewStatus = $('.tab_box button.active').attr('data-type');
            var params = {
                page: index,
                rows: limit,
                workNo:workNo,
                startTime:startTime,
                endTime:endTime,
                reviewStatus:reviewStatus

            };

            return getData(USER_URL.RESOURLIST, JSON.stringify(params));
        }

        //商户回调
        function pageCallbackLayer (index, limit) {
            var param = {
                page: index,
                rows: limit,
                orgName: $.trim($('#userName').val()) || ''
            }
            return getDataCommon(USER_URL.GETMERCHART,JSON.stringify(param))
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

        //获取数据
        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data;
            $.each(data, function (i, item) {
                $(item).attr('eq', (i + 1))
                if (item.workStatus == 0) {
                    $(item).attr('_workStatus', '制作中')
                } else {
                    $(item).attr('_workStatus', '制作完成')
                }
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
            return res;
        }
        table.on('tool(demo)', function (obj) {
            var form = layui.form
            var reData = obj.data
            let el = $('#demo222')
            var ids = reData.id;
            console.log(reData)
            var btn = [];
            //查看
            if (obj.event === 'change' || obj.event === 'nodetail') {
                var resName = reqAjax(USER_URL.GETNAME,JSON.stringify({id:ids}));
                if(obj.event === 'nodetail'){
                    el.find('input,button,select,textarea').attr('disabled',true)
                }else{
                    el.find('input,button,select,textarea').attr('disabled',false).removeClass('layui-disabled')
                    btn = ['确认','取消']

                }
                if(resName.code == 1){
                    var dataname = resName.data;
                    layer.open({
                        title: TITLE,
                        type: 1,
                        content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                        area: AREA,
                        btn:btn,
                        end: function (index) {
                            layer.close(index);
                            emptyInput(el);
                        },
                        success: function (layero, index) {
                            review.num = 0;
                            setForms('changeForm');
                            console.log(userno);
                            setDatas(el,reData);
                            $('#orgName').val(dataname.merchantName)
                            $('#yyptNickName').val(dataname.refUserName)
                            // review.num = reData.reviewReceivable;
                            review.total = reData.reviewActualReceivable;
                            getCheckBox(el)
                            function getCheckBox(el){
                                var checkBoxArr = el.find('input[name="workItems"]');
                                var els = $('#reviewReceivable');
                                for(let i = 0 ,len = checkBoxArr.length;i<len;i++){
                                    var ele = $(checkBoxArr[i]).attr('data-id')//判断data-id
                                    if(checkBoxArr[i].checked === true){
                                        review.num++;
                                    }else{
                                        $('.'+ele).find('input').attr('lay-verify','').addClass('layui-disabled').attr('disabled',true).val('');
                                    }
                                }
                                els.val(review.num*review.price)
                            }
                        },
                        yes: function (index) {
                            form.on('submit(changeForm)',function (data) {
                                if(data){
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
                                        setSaveBtn(el,index,str,USER_URL.UPDATEORDER,ids)
                                        // layer.close(index)

                                    }
                                }
                                return false;
                            })
                        },btn2:function (index) {
                            layer.close(index);
                        }
                    })
                }else{
                    layer.msg(resName.msg)
                }

            } else if (obj.event === 'submit') {
                var title = '';
                if(reData.workStatus == 0){
                    title= '是否完成【'+reData.workNo+'】工单制作状态，并提交财务审核？'
                }else{
                    title= '确认提交【'+reData.workNo+'】 财务审核?'
                }
                layer.confirm(title,{icon:0,title:"提示"},function (index) {
                    var parms = {
                        id:ids
                    };
                    reqAjaxAsync(USER_URL.UPDATESTATUS,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg("提交成功");
                            init_obj();
                        }else {
                            layer.msg(res.msg);
                        };
                    })
                })
            }else if(obj.event ==='del'){
                layer.confirm('是否删除【'+reData.workNo+'】?',{icon:0,title:"提示"},function (index) {
                    var parms = {
                        id:ids
                    };
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg("删除成功");
                            init_obj();
                        }else {
                            layer.msg(res.msg);
                        };
                    })
                })
            }else if(obj.event ==='ordered'){
                layer.confirm('是否完成【'+reData.workNo+'】的制作?',{icon:0,title:"提示"},function (index) {
                    var parms = {
                        id:ids
                    };
                    reqAjaxAsync(USER_URL.CHANGEORDER,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.close(index);
                            layer.msg("操作成功");
                            init_obj();
                        }else {
                            layer.msg(res.msg);
                        };
                    })
                })
            }
        })

        function setForms(form){
            //给保存按钮添加form属性
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }
        function setSaveBtn(demo,index,str,cmd,ids){
            //workItems workAddr workPhone workSource workRemark workUserId refUserId reviewReceivable reviewActualReceivable reviewRefAmount reviewWorkAmount
            $('#merchantId').val();
            $('#workSource').val();

            var paramInfo={
                merchantId:$('#merchantId').val(),//商户id
                workItems:str,//工单制作项目
                workAddr:$('#workAddr').val()||'',//地址
                workPhone:$('#workPhone').val()||'',//电话
                workSource:$('#workSource').val(),//来源
                workRemark:$('#workRemark').val()||'',//备注
                workUserId:userno,//session获取的userid
                refUserId:$('#refUserId').val() ||'',//推荐人id
                reviewReceivable:$('#reviewReceivable').val(),//应收账款
                reviewActualReceivable:$('#reviewActualReceivable').val(),//实收账款
                reviewRefAmount:$('#reviewRefAmount').val()||0,//推荐人提成
                reviewWorkAmount:$('#reviewWorkAmount').val()||0,//制作人提成

                reviewVideoReceivable:$('#reviewVideoReceivable').val()||0,//视频制作实收
                reviewPanoramicReceivable:$('#reviewPanoramicReceivable').val() || 0,//全景实收
            }
            if(cmd === USER_URL.UPDATEORDER){
                paramInfo.id =ids;
            }
            var res =reqAjax(cmd,JSON.stringify(paramInfo));
            if(res.code == 1){
                layer.msg('操作成功');
                layer.close(index);
                init_obj();
                demo.hide();
            }
        }
        function getParams(){
            var params = {

            };
            return params
        }
        //渲染数据
        function setDatas(demo,data){
            var inputArr = demo.find('input');
            var imgArr = demo.find('img');
            setArr(inputArr,data);
            setArr(imgArr,data,'');
            demo.find('input[type="checkbox"]').val(data.worItemsArr)
            $('#workRemark').val(data['workRemark']);
            $('#workSource').val(data['workSource'])
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
            demo.find('input,button,select,textarea').attr('disabled',false)
            $.each(checkBox,function (index,el) {
                el.checked = false;
            })
            demo.find("img").attr("src", '');
            demo.find('textarea').val('');
            demo.find('select').val('');
            $('.videoAmount,.panoramicAmount').find('input').attr('lay-verify','').addClass('layui-disabled').attr('disabled',true)
            form.render()
        }

        //获取表格 为 审核 或者 为审核 1 未审核 3已审核
        function getTable(){

            init_obj()
        }


        function getSource(){
            var params = {
                page: 1,
                rows: 999,
            };
            var res = reqAjax(USER_URL.WORKSOURCE,JSON.stringify(params));
            var str = '<option value="">--选择--</option>';
            for (var i = 0; i < res.data.length; i++) {
                var obj = res.data[i]
                str+='<option value="'+obj.id+'">'+obj.name+'</option>'

            }
            $('#workSource').html(str)
            form.render('select')
        }
        getSource()




        //检测勾选项目
        function setCheckBox(){
            var els = $('#reviewReceivable');
            form.on('checkbox(workItems)',function (data) {
                var el = $('.videoAmount');
                var el2 = $('.panoramicAmount');
                if(data.value == 0){
                    checkDisn(data.elem.checked,el,els)
                }else if(data.value == 1){
                    checkDisn(data.elem.checked,el2,els)
                }
            })

        }
        //检测工单制作项目是否勾选
        function checkDisn (bool,el,els) {
            if(bool === true){//是
                el.find('input').attr('lay-verify',"float|required").removeClass('layui-disabled').attr('disabled',false);
                els.val((review.num+=1)*review.price)
            }else{//否
                el.find('input').attr('lay-verify','').addClass('layui-disabled').attr('disabled',true).val('');
                els.val((review.num-=1)*review.price)
                setTotal();
            }
        }
        $('input[name="money"]').blur(function() {
            //失去焦点时，如果值为空，则设置为默认值
            if($(this).val()){
                setTotal();
            }
        });
        //计算实收总金额
        function setTotal(){
            review.total = 0;
            var checkBoxArr = $('#demo222').find('input[name="money"]');
            var els = $('#reviewActualReceivable');
            $('input[name="money"]').each(function () {
                review.total+= parseFloat($(this).val()||0);
            });
            els.val(review.total);
        }

        setCheckBox();



    })
})