$(function(){
    layui.use(['form', 'layer', 'table', 'laypage','element' ], function () {
        var form = layui.form,table = layui.table,laypage=layui.laypage,layer=layui.layer,laydate=layui.laydate,element=layui.element
        form.render();
        var page = 1;
        var rows = 15;
        var AREA = ['90%', '90%'];
        var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
        var SHADE = [0.2, '#000'];
        var platform = 0;
        var dataTr = {};
        var USER_URL = {
            LISTS:'operations/getAppBootSettingPage',//(列表)
            ADD:'operations/addAppBootSetting',//新增
            DEL:'operations/deleteAppBootSetting',
            UPDATE:'operations/updateAppBootSetting',//修改
            DETAIL:'operations/getAppBootSettingById',//查看
        };
        uploadOss({
            btn: "bootImgPath",
            flag: "img",
            size: "5mb"
        });
        //获取行业类型
        //渲染表格
        init_obj()
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
        $('.btn_tab button').click(function () {
            $(this).addClass('active').removeClass('layui-btn-primary').siblings().removeClass('active').addClass('layui-btn-primary')
        })
        element.on('tab(tabDemo)',function (obj) {
            platform = obj.index;
            init_obj()
        })
        $('#addBtn').click(function () {
            var el = $('#addDemo');
            TITLE[0] = '新增'
            layer.open({
                title:TITLE,
                type: 1,
                content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['50%','auto'],
                btn: ['确认', '取消'],
                end: function (index) {
                    layer.close(index);
                    emptyInput(el)

                },
                success:function (index) {
                    setForms('addForm');
                    // $('.lj_ul').append(getTemp())
                },yes:function (index) {
                    form.on('submit(addForm)',function (obj) {
                        if($('#bootImgPath').attr('src') == '../common/image/upload.png'){
                            layer.msg('请上传开机图片',{icon:2,anim:6})
                            return false
                        }
                        saveFun(USER_URL.ADD).done(function (res) {
                            if(res.code == 1){
                                layer.close(index)
                            }
                        })
                    })
                }
            })
        })
        $('#addImg').click(function () {
            var ul = $('.lj_ul');
            var lis = ul.find('li').length;
            if(lis>5){
                layer.msg('最多添加6张图片路径',{icon:2})
                return false
            }
            ul.append(getTemp());
        })
        function getTemp(data) {
            var str = ``;
            str+=` <li class="">
                    <label for="" class=" layui-form-label">图片路径:</label>
                    <div class="layui-input-block layui-col-md4 layui-col-sm2">
                        <input type="text" class="layui-input bootImgPath" lay-verify="required" value="${data?data.bootImgPath:''}">
                    </div>
                    <label for="" class=" layui-form-label">排序序号:</label>
                    <div class="layui-input-block layui-col-md2 layui-col-sm2">
                        <input type="text" class="layui-input sort" lay-verify="required|number" maxlength="5" value="${data?data.sort:''}" >
                    </div>
                    <button class="layui-btn del"><i class="layui-icon">&#xe640;</i>删除</button>
                </li>`
            return str;
        }
        $('body').on('click','.del',function () {
            if( $('.lj_ul').find('li').length <2){
                layer.msg('至少需要1张图片路径',{icon:2,anim:6})
                return false
            }
            $(this).parents('li').remove()
        })
        function saveFun(url,ids) {
            if(url == USER_URL.ADD){
                var params ={
                }
            }else{
                var params ={
                    id:ids
                }
            }
            params.title = $('#title').val();
            params.platform = $('.btn_tab').find('button.active').index()
            params.status =$('input[name=status]:checked')[0].value
            params.appBootPic = [];
            var par ={};
            par.sort =$('#sort').val();
            var bootImgPath = $('#bootImgPath').attr('src')
            par.bootImgPath = bootImgPath
            params.appBootPic.push(par)
            // var liList = $('.lj_ul').find('li');
            // $.each(liList,function (i, item) {
            //     var par ={};
            //     par.sort = $(item).find('input.sort').val();
            //     par.bootImgPath = $(item).find('input.bootImgPath').val();
            //     params.appBootPic.push(par);
            // })
            console.log(params);
            return reqAjaxAsync(url,JSON.stringify(params)).done(function (res) {
                if(res.code == 1){
                    init_obj();
                }
                layer.msg(res.msg)
            })
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
        var imgPath = '../common/image/upload.png'
        function emptyInput(demo){
            $('.lj_ul').html('')
            $('.btn_tab').find('button').eq(0).addClass('active').removeClass('layui-btn-primary').siblings().removeClass('active').addClass('layui-btn-primary')
            $('#title').val('');
            $('#bootImgPath').attr('src',imgPath)
            $('input[name=status][value="0"]').prop('checked',true)
            form.render()
        }
        //给保存按钮添加form属性
        function setForms(form){
            $("div.layui-layer-page").addClass("layui-form");
            $("a.layui-layer-btn0").attr("lay-submit","");
            $("a.layui-layer-btn0").attr("lay-filter",form);
        }
        //表格操作
        table.on('tool(tableNo)', function (obj) {
            var reData = dataTr = obj.data
            let el = $('#addDemo')
            var ids = reData.id;

            //查看
            if (obj.event === 'edit') {
                TITLE[0]='修改'
                layer.open({
                    title:TITLE,
                    type: 1,
                    content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: ['50%','auto'],
                    btn:['确认','取消'],
                    end: function (index) {
                        layer.close(index);
                        emptyInput(el)
                    },
                    success: function (index) {
                        setForms('changeForm')
                        $('#title').val(reData.title)
                        var platform = reData.platform;
                        var status = reData.status;
                        $('.btn_tab').find('button').eq(platform).addClass('active').removeClass('layui-btn-primary').siblings().removeClass('active').addClass('layui-btn-primary')
                        $('input[name=status][value="'+status+'"]').prop('checked',true)
                        reqAjaxAsync(USER_URL.DETAIL,JSON.stringify({id:ids})).done(function (res) {
                            console.log(res.data)
                            if(res.code == 1){
                                var appBootPic = res.data.appBootPic
                                // var str =``;
                                // $.each(appBootPic,function (i, item) {
                                //     var par ={
                                //         sort:item.sort,
                                //         bootImgPath:item.bootImgPath
                                //     };
                                //     str+=getTemp(par)
                                // })
                                // $('.lj_ul').html(str)
                                $('#bootImgPath').attr('src',appBootPic[0].bootImgPath)
                                form.render()
                            }
                        })


                    },yes:function (index) {
                        form.on('submit(changeForm)',function (obj) {
                            if($('#bootImgPath').attr('src') == '../common/image/upload.png'){
                                layer.msg('请上传开机图片',{icon:2,anim:6})
                                return false
                            }
                            saveFun(USER_URL.UPDATE,reData.id).done(function (res) {
                                if(res.code == 1){
                                    layer.close(index)
                                }

                            })
                        })
                        return false;
                    }
                })
            } else if(obj.event ==='del'){
                layer.confirm('是否删除【'+reData.title+'】?',{icon:0,title:"提示"},function (index) {
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
            }else if(obj.event == 'switch'){
                if(flag){
                    flag = 0;
                    var checked =  $(this).find('input')[0].checked;
                    var self = $(this);
                    var params = {
                        id:dataTr.id,
                        status:checked?0:1,
                        platform:platform
                    }
                    reqAjaxAsync(USER_URL.UPDATE,JSON.stringify(params)).done(function (res) {
                        if(res.code == 1){
                            layer.msg('操作成功!',{icon:1})
                            init_obj()
                        }else{
                            self.find('input')[0].checked = false;
                            layer.msg(res.msg)
                        }
                        form.render()

                    })
                }
            }
        })
        var flag
        form.on('switch(switchTest)',function (obj) {
            flag = 1;
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
                        title: '标题',
                        align: 'left',
                        field: 'title',
                        width: 120
                    }, {
                        title: '状态',
                        align: 'left',
                        field: 'statusName',
                        width: 100,
                    }, {
                        title: '启用/禁用',
                        align: 'left',
                        field: 'statusName',
                        toolbar: '#switchDemo',
                        event:'switch',
                        width: 100,
                    }, {
                        title: '创建时间',
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
            var params = {
                page: index,
                rows: limit,
                title:$('#titles').val()||'',
                status:$('#statuss').val()||'',
                platform:platform
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
                        item.eq = i+1;
                        item.statusName = item.status == 0?'启用':'禁用'
                    })
                }else{
                    layer.msg(res.msg)
                }
            })

        }
        
    })

})

