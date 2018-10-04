

(function ($) {

    var USER_URL = {
       ADD:'concern/insertScBaseCarousel'//新增接口
        ,SELECT:'concern/selectScBaseCarousel'//查询列表
        ,UPDATE:'concern/updateScBaseCarousel'//修改接口
        ,DEL:'concern/deleteScBaseCarousel'//删除列表

    }

    var layer = layui.layer
    var table = layui.table
    var form = layui.form;

    //点击变色
    $('#tableBox,#oneDemo').on('click', 'tbody tr', function () {
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')

    })
    //添加
    $('#addBtn').click(function () {
        let el = $('#addDemo')
        layer.open({
            title: ['新增轮播图', 'font-size:12px;background-color:#0678CE;color:#fff'],
            type: 1,
            content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['1000px', '600px'],
            btn:['确认','取消'],
            end: function (index) {
                layer.close(index);
                emptyInput(el);
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
    function saveImg(url,index,ids) {
        var flag = true;
        var regNum =/^[1-9]*[1-9][0-9]*$/;
        var $website = /^((http:\/\/)|(https:\/\/))/; //网址
        var rank = $('#scBaseCarouselPriority').val();
        var site = $('#scBaseCarouselAddress').val();
        var src = $('#uploadImg1').attr('src');
        var src2 = $('#uploadImg2').attr('src');
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
    //工单列表
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
                    toolbar: '#barDemo',
                    width: 120
                }]
            ],
            pageCallback,'laypageLeft'
        )
    }

    init_obj()

    //工单数据处理
    function getData (url, parms) {
        var res = reqAjax(url, parms)
        var data = res.data
        console.log(data)
        $.each(data, function (i, item) {
            $(item).attr('eq', (i + 1))
            $(item).attr('scBaseCarouselEffectCharts','<img src="'+item.scBaseCarouselEffectChart+'"/>')
            $(item).attr('scBaseCarouselPictureAddresss','<img src="'+item.scBaseCarouselPictureAddress+'"/>')
        })

        return res
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
            layer.open({
                title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['1000px', '600px'],
                btn:['确认','取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el);
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
    //渲染数据
    function setDatas(demo,data){
        var inputArr = demo.find('input');
        $('#uploadImg1').attr('src',data.scBaseCarouselPictureAddress)
        $('#uploadImg2').attr('src',data.scBaseCarouselEffectChart)
        setArr(inputArr,data);
        form.render()

    }
    //遍历数组，填充数据
    function setArr(arr,data,img){
        var ids = '';
        $.each(arr,function (index, item) {
            ids = $(this).attr('id');
            if(data.hasOwnProperty(ids)){
                if(img !== undefined){
                    $(this).attr('src',data[ids] || '')
                }else{
                    $(this).val(data[ids]);
                }
            }
        })
    }
    function emptyInput(demo){
        demo.hide().find("img").attr("src", 'img/upload.png');
        demo.find('textarea,input,select').val('');
        form.render()
    }

    uploadOss({
        btn: "uploadImg1",
        flag: "img",
        size: "5mb"
    });
    uploadOss({
        btn: "uploadImg2",
        flag: "img",
        size: "5mb"
    });

})(jQuery)