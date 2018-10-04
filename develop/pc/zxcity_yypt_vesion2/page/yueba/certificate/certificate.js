$(function(){
    layui.use(['form', 'layer', 'table', 'laypage', ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            LISTS:'newservice/findExaminingCertList',//(列表)
            UPDATE:'newservice/checkCertStatus',//审核
            DETAIL:'newservice/findExaminingCertDetail',//查看
        };

        $('#searchBtn').click(function () {
            init_obj();
        })
        $('#restBtn').click(function () {
            $('.header').find('input').val('')
            init_obj()
        })
        //渲染表格
        init_obj()
        function init_obj() {
            var objs = tableInit('tableNo', [
                    [{
                        title: '序号',
                        align: 'left',
                        field: 'eq',
                        width: 200
                    }, {
                        title: '证书名称',
                        align: 'left',
                        field: 'certName',
                        width: 224
                    }, {
                        title: '服务名称',
                        align: 'left',
                        field: 'serviceName',
                        width: 224
                    }, {
                        title: '服务价格（元）',
                        align: 'left',
                        field: 'servicePrice',
                        width: 150,
                    }, {
                        title: '发布人',
                        align: 'left',
                        field: 'userName',
                        width: 180,
                    }, {
                        title: '创建时间',
                        align: 'left',
                        field: 'createTime',
                        width: 300,
                    },{
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar: '#barDemo',
                        width: 200
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
                serviceName:$.trim($('#serviceNames').val()) || '',
                userName:$.trim($('#userNames').val())||''
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
                        var skill = item.skill
                        $(item).attr('eq', (i + 1))
                        item.serviceName = skill.serviceName;
                        item.userName = skill.userName;
                        item.servicePrice = skill.servicePrice;
                        item.createTime = skill.createTime
                    })

                }else{
                    layer.msg(res.msg)
                }
            })


        }
        //修改
        var imgPath = '../../common/images/upload.png';
        function emptyInput(demo){
            demo.find('textarea,input,select').val('');
            demo.find('img').attr('src','');
            $('#imageUrl').attr('src',imgPath)
            form.render()
        }
        table.on('tool(tableNo)',function (obj) {
            var el = $('#addDemo');
            var ids = obj.data.id;
            var reDatas = obj.data;
            if(obj.event === 'edit'){
                TITLE[0] = '技能证书审核'
                layer.open({
                    title: TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['65%','80%'],
                    btn:['确认','取消'],
                    end: function (layero,index) {
                        layer.close(index);
                        emptyInput(el);
                    },
                    success:function (layero,index) {
                        var params ={
                            id:ids,
                            serviceId:reDatas.serviceId
                        }
                        reqAjaxAsync(USER_URL.DETAIL,JSON.stringify(params)).done(function (res) {
                            if(res.code == 1){
                                var datas = res.data.skill;
                                if(datas.certList.length>0){
                                    datas.certList= datas.certList['0'].certUrl
                                }else{
                                    datas.certList = '../../common/images/placeholder.png'
                                }

                                $('#certUrl').attr('src',res.data.cert.certUrl)
                                console.log(res)
                                setDatas(el,datas)

                            }else{
                                layer.msg(res.msg)
                            }

                        })
                        el.find('input').attr('readonly','readonly')
                        setForms('addForm')

                    },
                    yes:function (index) {
                        form.on('submit(addForm)',function (data) {
                            if(data){
                                var imageUrl = $('#imageUrl').attr('src')
                                if(imageUrl == imgPath){
                                    layer.msg('审核通过请上传对应图片！')
                                    return false
                                }
                                var params={
                                    id:ids,
                                    serviceId:$.trim($('#paymentName').val()),
                                    status:2,
                                    remark:$.trim($('#remark').val()),
                                    imageUrl:imageUrl
                                }
                                reqAjaxAsync(USER_URL.UPDATE,JSON.stringify(params)).done(function (res) {
                                    if(res.code == 1){
                                        init_obj()
                                    }
                                    layer.msg(res.msg)
                                    layer.close(index)

                                })
                            }
                            return false;
                        })
                    }
                })
            }
        })

        // imageUrl
        uploadOss({
            btn: "imageUrl",
            flag: "img",
            size: "5mb"
        });
    })

})

