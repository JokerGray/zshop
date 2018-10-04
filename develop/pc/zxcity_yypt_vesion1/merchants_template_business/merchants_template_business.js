$(function(){
    layui.use(['form', 'layer', 'table', 'laypage' ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate
        form.render();
        var page = 1;
        var rows = 15;
        var AREA = ['90%', '90%'];
        var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var tradeObj = {};
        var USER_URL = {
            SELECTRADE:'operations/getMerchantTradePageByData',//类型
            LISTS:'operations/getScTradeProcessPage',//(列表)
            ADD:'operations/addScTradeProcessConfig',//新增
            DEL:'operations/deleteScTradeProcess',
            UPDATE:'operations/modifyScTradeProcess',//修改

        };
        //获取行业类型
        getTrade().done(function () {
            //渲染表格
            init_obj()
        })
        function getTrade() {
            var params = {
                page:page,
                rows: 100
            }
            return reqAjaxAsync(USER_URL.SELECTRADE,JSON.stringify(params)).done(function (res) {
              if(res.code == 1){
                  var datas = res.data;
                  console.log(datas)
                  var str = '<option value="">请选择</option>';
                  $.each(datas,function (i, item) {
                      str+='<option value="'+item.id+'">'+item.name+'</option>'
                    //   tradeObj[i+1] = item.name;
                    var obj = {
                        name: item.name,
                        id: item.id
                    };
                    tradeObj[i + 1] = obj;
                  })
                  $('#merchantTradeIds,#merchantTradeId').html(str)
                  form.render();
              }
            })
        }
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
        var xuan = 1;
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            TITLE[0] = '新增流程'
            layer.open({
                title:TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['auto'],
                btn: ['确认', '取消'],
                end: function (index) {
                    layer.close(index);
                    emptyThis(el)
                },
                success:function (index) {
                    setForms('addForm');
                },yes:function (index) {
                    form.on('submit(addForm)',function (obj) {
                        if(xuan < 1){
                            layer.msg('请至少选择一项下单类型', {
                                icon: 2,
                                anim: 6,
                            });
                        }else{
                            saveFun(USER_URL.ADD,index)
                        }
                    })
                }
            })
        })
        function saveFun(url,index,ids) {
            if(url == USER_URL.ADD){
                var params ={
                    merchantTradeId:$('#merchantTradeId').val()
                }
            }else{
                var params ={
                    id:ids
                }
            }

            var set1 = $('#set1')[0].checked?params.set1=1:params.set1=0;
            var set2 =  $('#set2')[0].checked?params.set2=1:params.set2=0;
            var set3 = 0;
            var set4 = 0;
            var set5 = 0;
            if(set2 == 1){
                set3 = $('input[name="set3"]:checked').val();
                set4 = $('input[name="set4"]:checked').val();
                set5 = $('input[name="set5"]:checked').val();
            }
            params.set3 = set3
            params.set4 = set4
            params.set5 = set5
            reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }
                layer.msg(res.msg)
                layer.close(index);
            })
            layer.close(index)
        }
        //行业清空
        function emptyThis(el) {
            xuan = 1;
            $('#merchantTradeId').val('')
            el.find('input[type="checkbox"]').prop('checked',false)
            $('#set1').prop('checked',true)
            $('.xiadan').hide().find('input[type="radio"][value="0"]').prop('checked',true)
            form.render();
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
            demo.find('textarea,input,select').val('').prop('checked',false);
            demo.find('img').attr('src','');
            demo.find('input,select,textarea').attr('disabled',false)
            form.render()
        }
        //给保存按钮添加form属性
        function setForms(form){
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }
        form.on('checkbox(set2)',function (obj) {
            var checked = obj.elem.checked
            if(!checked){
                $('.xiadan').hide()
                xuan-=1;
            }else{
                $('.xiadan').show()
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
        //表格操作
        table.on('tool(tableNo)', function (obj) {
            var reData = obj.data
            let el = $('#addDemo')
            var ids = reData.id;
            //修改
            if (obj.event === 'edit') {
                TITLE[0]='修改模板'
                layer.open({
                    title:TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['auto'],
                    btn:['确认','取消'],
                    end: function (index) {
                        layer.close(index);
                        $('#merchantTradeId').attr('disabled',false)
                        emptyThis(el)
                    },
                    success: function (index) {
                        xuan = 0;
                        setDatas(el,reData)
                        setForms('changeForm')
                        $('#merchantTradeId').attr('disabled',true)
                        if(reData.set1 == 1){
                            xuan++
                            $('#set1').prop('checked',true)
                        }else{
                            $('#set1').prop('checked',false)
                        }
                        if(reData.set2 == 1){
                            xuan++
                            $('#set2').prop('checked',true)
                            $('.xiadan').show();
                        }
                        $('input[name="set3"][value="'+reData.set3+'"]').prop('checked',true)
                        $('input[name="set4"][value="'+reData.set4+'"]').prop('checked',true)
                        $('input[name="set5"][value="'+reData.set5+'"]').prop('checked',true)

                        form.render()
                    },yes:function (index) {
                        if(xuan < 1){
                            layer.msg('请至少选择一项下单类型', {
                                icon: 2,
                                anim: 6,
                            });
                        }else{
                            saveFun(USER_URL.UPDATE,index,reData.id)
                        }
                        
                    }
                })
            } else if(obj.event ==='del'){
                layer.confirm('是否删除【'+reData.eq+'】?',{icon:0,title:"提示"},function (index) {
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
            }
        })
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

        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100
                    }, {
                        title: '行业',
                        align: 'left',
                        field: 'merchantTradeName',
                        width: 120
                    }, {
                        title: '服务下单开启状态',
                        align: 'left',
                        field: 'set1Name',
                        width: 100,
                    }, {
                        title: '销售下单开启状态',
                        align: 'left',
                        field: 'set2Name',
                        width: 100,
                    },{
                        title: '销售下单支付方式',
                        align: 'left',
                        field: 'set3Name',
                        width: 100,
                    },{
                        title: '销售下单设备选择',
                        align: 'left',
                        field: 'set4Name',
                        width: 100,
                    },{
                        title: '订单支付完成状态是否修改订单状态',
                        align: 'left',
                        field: 'set5Name',
                        width: 120,
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
            // var time = $('#date').val().split(' 至 ');

            var params = {
                page: index,
                rows: limit,
                merchantTradeId:$('#merchantTradeIds').val()||''

            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(res)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        // merchantTradeId
                        // set1 服务下单开启状态
                        // set3 支付方式
                        // set4 销售单设备选择
                        // set5 订单支付完成状态是否修改订单状态
                        // item.merchantTradeName = tradeObj[item.merchantTradeId]
                        for (var key in tradeObj) {
                            var value = tradeObj[key];
                            if (item.merchantTradeId == value.id) {
                                item.merchantTradeName = value.name;
                                break;
                            }
                        }
                        if(item.set1 == 1){
                            item.set1Name = '开启'
                        }else{
                            item.set1Name = '未开启'
                        }
                        if(item.set2 == 1){
                            item.set2Name = '开启'
                        }else{
                            item.set2Name = '未开启'
                        }
                        if(item.set3 == 1){
                            item.set3Name = '先支付'
                        }else{
                            item.set3Name = '后支付'
                        }
                        if(item.set4 == 1){
                            item.set4Name = '必选'
                        }else{
                            item.set4Name = '可选'
                        }
                        if(item.set5 == 1){
                            item.set5Name = '是'
                        }else{
                            item.set5Name = '否'
                        }

                    })
                }else{
                    layer.msg(res.msg)
                }
            })

        }
        
    })

})

