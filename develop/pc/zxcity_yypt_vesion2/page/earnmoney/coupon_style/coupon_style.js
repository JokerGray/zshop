

$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','laydate' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate;
        form.render();
        var dataTr = {};
        var USER_URL = {
            LISTS:'earnmoney/getPlayerCardstyleList',//(列表)
            UPDATESTATUS:'earnmoney/updatePlayerCardStyleStatus',//更新状态
            DEL:'earnmoney/deletePlayerCardStyle',//删除
            ADD:'earnmoney/addPlayerCardStyle',
        };
        laydate.render({
            elem:'#createTimes'
            ,theme: '#009688',

        })
        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input').val('')
            init_obj()
        })
        var areaData = {};
        var imgPath ='../../common/images/upload.png';

        $('#addBtn').click(function () {
            var el = $('#addDemo');
            AREA=['50%','auto']
            layerOpen('新增票券样式',el,'addDemo','')
            form.on('submit(addDemo)',function (obj) {
                if(obj){
                    var prizeStyle = $('#cardUrl').attr('src')
                    if(imgPath == prizeStyle){
                        layer.msg('请上传实物图片',{icon:2,anim:6})
                        return
                    }
                    var params = {
                        cardUrl:prizeStyle,
                    }
                    reqAjaxAsync(USER_URL.ADD,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            init_obj();
                        }
                        layer.close(_index)
                        layer.msg(res.msg)
                    })
                }
            })


        })
        // imageUrl
        uploadOss({
            btn: "cardUrl",
            flag: "img",
            size: "5mb"
        });
        form.on('select(provice)',function (obj) {
            console.log(obj)
            var pid= obj.value;
            getCity(pid)
        })
        function getCity(pid){
            var cityStr = '';
            $.each(areaData,function (i, item) {
                if(item.parentcode == pid){
                    cityStr+= '<option value="'+item.code+'">'+item.areaname+'</option>'
                }
            })
            $('#cityId').html(cityStr);
            form.render();
        }
        table.on('tool(tableNo)',function (obj) {
            var reData = obj.data;
            dataTr = reData;
            if(obj.event == 'switch'){
                var checked = $(this).find('input')[0].checked;
                var params = {
                    cardId:reData.id,
                    cardStatus:checked?1:2
                }
                reqAjaxAsync(USER_URL.UPDATESTATUS,JSON.stringify(params)).done(function (res) {
                    if(res.code == 1){
                        layer.msg('操作成功!',{icon:1})

                    }else{
                        layer.msg(res.msg)
                    }

                })
            }else if(obj.event == 'del'){
                TITLE[0] = '提示'
                layer.confirm('确定删除【'+reData.eq+'】实物奖品？',{title:TITLE},function (index) {
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify({cardId:reData.id})).done(function (res) {
                        if(res.code == 1){
                            init_obj();
                        }
                        layer.msg(res.msg)
                    })
                })

            }
        })

        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 100
                    }, {
                        title: '卡券样式',
                        align: 'left',
                        field: 'cardUrl',
                        width: 224
                    },  {
                        title: '发布时间',
                        align: 'left',
                        field: 'createTime',
                        width: 180,
                    },{
                        title: '上架/下架',
                        align: 'left',
                        toolbar:'#switchDemo',
                        field: 'prizeStatus',
                        event:'switch',
                        width: 150,
                    },{
                        title: '操作',
                        align: 'left',
                        toolbar:'#barDemo',
                        fixed:'right',
                        width: 150,
                    }]
                ],

                pageCallback, 'page'
            );
        }
        //pageCallback回调
        function pageCallback(index, limit) {
            var params = {
                pagination:{
                    page: index,
                    rows: limit,
                },
                orgName:$.trim($('#orgNames').val()) || '',
                prizeTitle:$.trim($('#prizeTitles').val()) || '',
                createTime:$.trim($('#createTimes').val()) || '',
            }
            return getData(USER_URL.LISTS, JSON.stringify(params));
        }
        //获取数据
        function getData(url, parms) {
            return reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        item.cardUrl = '<img src="'+item.cardUrl+'"/>'
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }

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
                limit: 10,
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
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    limit: 10
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
                        })

                    }
                }
                laypage.render(page_options);

                return {
                    tablePage,
                    tableIns
                };
            });

        }
    })

})

