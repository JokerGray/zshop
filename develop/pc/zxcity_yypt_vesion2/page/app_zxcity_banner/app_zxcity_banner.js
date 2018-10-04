
$(function(){
    layui.use(['form', 'layer', 'table', 'laypage' ], function () {
        form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer
        form.render();
        var page = 1;
        var rows = 15;
        var USER_URL = {
            ADD:'concern/insertScBaseCarousel'//新增接口
            ,SELECT:'concern/selectScBaseCarousel'//查询列表
            ,UPDATE:'concern/updateScBaseCarousel'//修改接口
            ,DEL:'concern/deleteScBaseCarousel'//删除列表

        }
        //列表
        function init_obj () {
            var _obj = tableInit('demo', [
                    [{
                        title: '序号',
                        align: 'center',
                        field: 'eq',
                        width: 80
                    }, {
                        title: '创建时间',
                        align: 'left',
                        field: 'scBaseReleaseTime',
                        width: 200
                    }, {
                        title: '轮播背景图',
                        align: 'left',
                        field: 'scBaseCarouselPictureAddresss',
                        width: 280
                    },{
                        title: '轮播前景图',
                        align: 'left',
                        field: 'scBaseCarouselEffectCharts',
                        width: 280
                    }, {
                        title: '跳转地址',
                        align: 'left',
                        field: 'scBaseCarouselAddress',
                        width: 250
                    }, {
                        title: '优先级',
                        align: 'left',
                        field: 'scBaseCarouselPriority',
                        width: 120
                    }, {
                        title: '操作',
                        align: 'left',
                        fixed: 'right',
                        toolbar:'#barDemo',
                        width: 200
                    }]
                ],
                pageCallback,'laypageLeft'
            )
        }
        init_obj()
        //数据处理
        function getData(url, parms) {
            var deff = $.Deferred();
            reqAjaxAsync(url,parms).done(function (res) {
                if(res.code === 1){
                    var data = res.data
                    console.log(data)
                    $.each(data, function (i, item) {
                        $(item).attr('eq', (i + 1))
                        $(item).attr('scBaseCarouselEffectCharts','<img src="'+item.scBaseCarouselEffectChart+'"/>')
                        $(item).attr('scBaseCarouselPictureAddresss','<img src="'+item.scBaseCarouselPictureAddress+'"/>')
                    })
                    deff.resolve(res);
                }else{
                    layer.msg(res.msg)
                }
            })
            return deff.promise();
        }

        //pageCallback回调
        function pageCallback (index, limit) {
            var params = {
                pagination:{
                    page: index,
                    rows: limit,
                }
            };

            return getData(USER_URL.SELECT,JSON.stringify(params))
        }
        //添加
        $('#addBtn').click(function () {
            let el = $('#addDemo')
            TITLE[0] = '新增轮播图'
            layer.open({
                title: TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['50%', '600px'],
                btn:['确认','取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
                    el.find('img').attr('src','../../common/images/upload.png')
                },
                success: function (index,layero) {
                    setForms('addForm');
                },
                yes: function (index,layero) {
                    saveImg(USER_URL.ADD,index);
                },btn2:function (index) {
                    layer.close(index);
                }
            })
        })
        //保存
        function saveImg(url,index,ids) {
            var flag = true;
            var regNum =/^[1-9]*[1-9][0-9]*$/;
            var $website = /^((http:\/\/)|(https:\/\/))/; //网址
            var rank = $('#scBaseCarouselPriority').val();
            var site = $('#scBaseCarouselAddress').val();
            var src = $('#scBaseCarouselPictureAddress').attr('src');
            var src2 = $('#scBaseCarouselEffectChart').attr('src');
            if(!$website.test(site)){
                layer.msg('跳转地址错误', {
                    icon: 2,
                    anim: 6,
                });
                $('#scBaseCarouselAddress').focus()
                flag = false
                return false
            }
            if(!regNum.test(rank)){
                layer.msg('优先级错误', {
                    icon: 2,
                    anim: 6,
                });
                flag = false
                return false
            }
            if(src == 'img/upload.png'){
                layer.msg('请上传轮播背景图', {
                    icon: 2,
                    anim: 6,
                });
                flag = false
                return false
            }
            if(src2 == 'img/upload.png'){
                layer.msg('请上传轮播前景图', {
                    icon: 2,
                    anim: 6,
                });
                flag = false
                return false
            }
            if(flag){
                form.on('submit(addForm)',function (data) {
                    var params = {
                        scBaseCarouselPictureAddress:src,//背景图
                        scBaseCarouselAddress:site,//跳转地址
                        scBaseCarouselPriority:rank,//优先级
                        scBaseCarouselEffectChart:src2,//前景图
                    }
                    if(url === USER_URL.UPDATE){
                        params.scBaseCarouselId = ids
                    }

                    reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                        if(res.code ==1){
                            init_obj();
                        }
                        layer.msg(res.msg);
                        layer.close(index);
                    })
                    return false;
                })
            }
        }
        //表格操作
        table.on('tool(demo)', function (obj) {
            var el = $('#addDemo');
            var reData = obj.data
            //查看
            if (obj.event === 'del') {
                layer.confirm('是否删除【'+reData.eq+'】?',{icon:0,title:"提示"},function (index) {
                    var parms = {
                        scBaseCarouselId:reData.scBaseCarouselId
                    };
                    reqAjaxAsync(USER_URL.DEL,JSON.stringify(parms)).done(function (res) {
                        if (res.code == 1) {
                            layer.msg("删除成功");
                        }else {
                            layer.msg(res.msg);
                        };
                        init_obj();
                    })
                })
            }else if(obj.event === 'change'){
                TITLE[0] = '修改'
                layer.open({
                    title:TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['50%', '600px'],
                    btn:['确认','取消'],
                    end: function (index) {
                        layer.close(index);
                        emptyInput(el);
                        el.find('img').attr('src','../../common/images/upload.png')

                    },
                    success: function (index,layero) {
                        setDatas(el,reData)
                        setForms('addForm');
                    },
                    yes:function (index,layero) {
                        saveImg(USER_URL.UPDATE,index,reData.scBaseCarouselId)
                    }
                })
            }
        })

        uploadOss({
            btn: "scBaseCarouselPictureAddress",
            flag: "img",
            size: "5mb"
        });
        uploadOss({
            btn: "scBaseCarouselEffectChart",
            flag: "img",
            size: "5mb"
        });

    })
})