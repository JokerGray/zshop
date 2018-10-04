$(function () {
    const SYSTEMLIST = 'operations/queryBaseAreaPage';//查询
    const TWO = 'operations/queryHigherLevel';
    const delurl = 'operations/deleteScBaseArea';
    const updateurl = 'operations/modifyBaseArea';
    const addurl = 'operations/addBaseArea';
    const find = 'operations/findName';
    var data;
    var layer = layui.layer;
    var table = layui.table;
    layui.use(function () {
        form = layui.form;
        form.render();
    })

    var _obj = tableInit('provincialList', [
            [ //标题栏
                {
                    field: 'areaname',
                    title: '省',
                    width: 150,
                    event: 'changetable'
                }, {
                field: 'option',
                title: '操作',
                toolbar: '#barDemo1',
                width: 258
            }
            ]
        ],
        pageCallback, SYSTEMLIST, 'rolename'
    );
    function deletetable(tableid,name,barDemo) {
        table.render({
            id: tableid,
            elem: '#' + tableid,
            height: 'full-250',
            /*width: 420,*/
            cols: [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: name,
                        width: 150,
                        event: 'changetables'
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: barDemo,
                    width: 258
                }
                ]
            ],//设置表头,//表框样式
            page: false,
            even: true,
            skin: 'row'
        });
    }

    function pageCallback(url, rolename) {

        return getData(url, "{'rolename':'" + rolename + "'}");
    }

    function addAdnUpdate(url, data) {

        return getData(url, data);
    }


    function newcity0() {
        if (data==null||data==""){
            deletetable('cityList','市','#barDemo1');
            deletetable('countiesList','县（区）','#barDemo1');
            deletetable('streetList','街道','#barDemo2');
        }else{
        var _obj = tableInit('cityList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '市',
                        width: 150,
                        event: 'changetables'
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo1',
                    width: 258
                }
                ]
            ],
            pageCallback, TWO, data[0].code
        );}
        $(".roleTable1 tbody tr").eq(0).addClass("layui-table-click");
    }

    function newcounties() {

        if (data==null||data==""){
            deletetable('countiesList','县（区）','#barDemo1');
            deletetable('streetList','街道','#barDemo2');
        }else{
        var _obj = tableInit('countiesList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '县（区）',
                        width: 150,
                        event: 'changetables'
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo1',
                    width: 258
                }
                ]
            ],
            pageCallback, TWO, data[0].code
        );}
        $(".roleTable2 tbody tr").eq(0).addClass("layui-table-click");
    }

    function newstree() {

        if (data==null||data==""){
            deletetable('streetList','街道','#barDemo2');
        }else {
        var _obj = tableInit('streetList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '街道',
                        width: 150,
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo2',
                    width: 258
                }
                ]
            ],
            pageCallback, TWO, data[0].code
        );}

    }

    $(".roleTable tbody tr").eq(0).addClass("layui-table-click");
    newcity0();
    newcounties();
    newstree();
    function tableInit(tableId, cols, pageCallback, url, parm) {
        var tableIns;

        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-250',
            /*width: 420,*/
            cols: cols,//表框样式
            page: false,
            even: true,
            skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(url, parm);

        tableIns.reload({
            data: res.data,
            limit: res.data.length
        })

        //3.left table page

        return tableIns;
    }

    table.on('tool(provincialList)', function (obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var areaname = data.areaname;
        var code = data.code;
        if (layEvent === 'del') {
            layer.confirm('确定删除吗？', function (index) {
                layer.close(index);
                //向服务端发送删除指令
                var res = pageCallback(delurl, code);
                layer.msg(res.msg);
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            });
        } else if (layEvent === 'edit') { //编辑
            //do something
            layer.open({
                type: 2,
                title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['350px', '200px'],
                content: ['edit.html', 'no'],
                btn: ['保存', '取消'],
                success:function(layero){
                    var body = layer.getChildFrame('body');
                    $.trim(body.contents().find('#region').val(areaname));
                },
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var region = $.trim(body.contents().find('#region').val());//区域名称
                    // var applystart = $.trim(body.contents().find('#applystarl').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val(); //id
                    //var applystarts2=body.contents().find('#applystarl').find("option:selected").text();//名称
                    if (region == '' || region == null) {
                        layer.msg("请填写地区名称");
                        return false;
                    } else {
                        var res = addAdnUpdate(updateurl, "{'code':'" + code + "','areaname':'" + region + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })
        } else if (layEvent === 'add') {
            layer.open({
                type: 2,
                title: ['添加区域到' + areaname, 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['500px', '420px'],
                content: ['add.html', 'no'],
                btn: ['保存', '取消'],
                success:function(layero){
                    var body = layer.getChildFrame('body');
                    body.contents().find('#tuiguang').show();
                    
                    form.render();
                },
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var newcode = $.trim(body.contents().find('#addcode').val());//区域代码
                    var areaname = $.trim(body.contents().find('#addareaname').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val(); //id
                    var r =/^[0-9]+.?[0-9]*$/;
                    if (!r.test(newcode)){
                        layer.msg("地区代码必须为数字！");
                        return false;
                    }
                    if (areaname == '' || areaname == null || newcode == '' || newcode == null) {
                        layer.msg("请填写完整地区信息");
                        return false;
                    } else {
                        var res = addAdnUpdate(addurl, "{'code':'" +code+newcode + "','areaname':'" + areaname + "','parentcode':'" + code + "','level':'" + 2 + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })

        }

        var _obj = tableInit('cityList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '市',
                        width: 150,
                        event: 'changetables'
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo1',
                    width: 258
                }
                ]
            ],
            pageCallback, TWO, code
        )
        $(".roleTable1 tbody tr").eq(0).addClass("layui-table-click");
        newcounties();
        newstree();
    })

    table.on('tool(cityList)', function (obj) {
        var data = obj.data; //获得当前行数据
        var code = data.code;
        var areaname = data.areaname;
        var layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'del') {
            layer.confirm('确定删除吗？', function (index) {
                layer.close(index);
                //向服务端发送删除指令
                var res = pageCallback(delurl, code);
                layer.msg(res.msg);
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            layer.open({

                type: 2,
                title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['350px', '200px'],
                content: ['edit.html', 'no'],
                btn: ['保存', '取消'],
                success:function(layero){
                    var body = layer.getChildFrame('body');
                    $.trim(body.contents().find('#region').val(areaname));
                    body.contents().find('#tuiguang').show();
                    var applyStart = data.applyStart;
                var al= body.contents().find('#applystarl');
                       al.val(applyStart)
                },
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var region = $.trim(body.contents().find('#region').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val(); //id
                    if (region == '' || region == null) {
                        layer.msg("请填写地区名称");
                        return false;
                    } else {
                        var res = addAdnUpdate(updateurl, "{'code':'" + code + "','areaname':'" + region + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })
        } else if (layEvent === 'add') {
            layer.open({
                type: 2,
                title: ['添加区域到' + areaname, 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['500px', '420px'],
                content: ['add.html', 'no'],
                btn: ['保存', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var newcode = $.trim(body.contents().find('#addcode').val());//区域代码
                    var areaname = $.trim(body.contents().find('#addareaname').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val(); //id
                    var r =/^[0-9]+.?[0-9]*$/;
                    if (!r.test(newcode)){
                        layer.msg("地区代码必须为数字！");
                        return false;
                    }
                    if (areaname == '' || areaname == null || newcode == '' || newcode == null) {
                        layer.msg("请填写完整地区信息");
                        return false;
                    } else {
                        var res = addAdnUpdate(addurl, "{'code':'" + code+newcode + "','areaname':'" + areaname + "','parentcode':'" + code + "','level':'" + 3 + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })

        }
        var _obj = tableInit('countiesList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '县（区）',
                        width: 150,
                        event: 'changetables'
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo1',
                    width: 258
                }
                ]
            ],
            pageCallback, TWO, code
        )
        $(".roleTable2 tbody tr").eq(0).addClass("layui-table-click");
        newstree();
    })


    table.on('tool(countiesList)', function (obj) {
        var data = obj.data; //获得当前行数据
        var code = data.code;
        var areaname = data.areaname;
        var layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'del') {
            layer.confirm('确定删除吗？', function (index) {
                layer.close(index);
                //向服务端发送删除指令
                var res = pageCallback(delurl, code);
                layer.msg(res.msg);
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            layer.open({
                type: 2,
                title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['350px', '200px'],
                content: ['edit.html', 'no'],
                btn: ['保存', '取消'],
                success:function(layero){
                    var body = layer.getChildFrame('body');
                    $.trim(body.contents().find('#region').val(areaname));
                },
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var region = $.trim(body.contents().find('#region').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val(); //id
                    if (region == '' || region == null) {
                        layer.msg("请填写地区名称");
                        return false;
                    } else {
                        var res = addAdnUpdate(updateurl, "{'code':'" + code + "','areaname':'" + region + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })
        } else if (layEvent === 'add') {
            layer.open({
                type: 2,
                title: ['添加区域到' + areaname, 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['500px', '420px'],
                content: ['add.html', 'no'],
                btn: ['保存', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var newcode = $.trim(body.contents().find('#addcode').val());//区域代码
                    var areaname = $.trim(body.contents().find('#addareaname').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val(); //id
                    var r =/^[0-9]+.?[0-9]*$/;
                    if (!r.test(newcode)){
                        layer.msg("地区代码必须为数字！");
                        return false;
                    }
                    if (areaname == '' || areaname == null || newcode == '' || newcode == null) {
                        layer.msg("请填写完整地区信息");
                        return false;
                    } else {
                        var res = addAdnUpdate(addurl, "{'code':'" +code+ newcode + "','areaname':'" + areaname + "','parentcode':'" + code + "','level':'" + 4 + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })

        }
        var _obj = tableInit('streetList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '街道',
                        width: 150,
                        /*sort: true,*/
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo2',
                    width: 258
                }
                ]
            ],
            pageCallback, TWO, code
        )

    })
    table.on('tool(streetList)', function (obj) {
        var data = obj.data; //获得当前行数据
        var code = data.code;
        var areaname = data.areaname;
        var layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'del') {
            layer.confirm('确定删除吗？', function (index) {
                layer.close(index);
                //向服务端发送删除指令
                var res = pageCallback(delurl, code);
                layer.msg(res.msg);
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            });
        } else if (layEvent === 'edit') { //编辑
            //do something
          var  regoin=obj.data.areaname;
          $("#regoin").val(regoin);
            layer.open({
                type: 2,
                title: ['修改', 'font-size:12px;background-color:#424651;color:#fff'],
                shadeClose: true,
                area: ['350px', '200px'],
                content: ['edit.html', 'no'],
                btn: ['保存', '取消'],
                success:function(layero){
                    var body = layer.getChildFrame('body');
                    $.trim(body.contents().find('#region').val(areaname));
                },
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body');
                    var region = $.trim(body.contents().find('#region').val());//区域名称
                    var applystart = body.contents().find('#applystarl').val();
                    if (region == '' || region == null) {
                        layer.msg("请填写地区名称");
                        return false;
                    } else {
                        var res = addAdnUpdate(updateurl, "{'code':'" + code + "','areaname':'" + region + "','applystart':'" + applystart + "'}")
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }


                },
                no: function (index, layero) {
                    layer.closeAll();
                }

            })
        }


    })

    function getData(url, parms) {
        var res = reqAjax(url, parms);

        data = res.data;

        return res;

    }

    $("#setting").click(function () {


        layer.open({
            type: 2,
            title: ['添加省', 'font-size:12px;background-color:#424651;color:#fff'],
            shadeClose: true,
            area: ['500px', '420px'],
            content: ['add.html', 'no'],
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body');
                var newcode = $.trim(body.contents().find('#addcode').val());//区域代码
                var areaname = $.trim(body.contents().find('#addareaname').val());//区域名称
                var applystart = body.contents().find('#applystarl').val(); //id
                var r =/^[0-9]+.?[0-9]*$/;
                if (!r.test(newcode)){
                    layer.msg("地区代码必须为数字！");
                    return false;
                }
                if(newcode==0){
                    layer.msg("区域代码不能为0");
                    return false;
                }
                if (newcode == '' || newcode == null || areaname == '' || areaname == null) {
                    layer.msg("请填写完整地区信息");
                    return false;
                } else {
                    var res = addAdnUpdate(addurl, "{'code':'" + newcode + "','areaname':'" + areaname + "','parentcode':'" + 0 + "','level':'" + 1 + "','applystart':'" + applystart + "'}")
                    layer.msg(res.msg);
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                }


            },
            no: function (index, layero) {
                layer.closeAll();
            },

        })

    });
    //刷新
    $('#refresh').click(function() {
        location.reload();
    });
    $('#toolRelize').click(function() {
        $("#inquireInputType").val("");
    });
    $('#find').click(function() {
        tableInit('provincialList', [
                [ //标题栏
                    {
                        field: 'areaname',
                        title: '省',
                        width: 150,
                        event: 'changetable'
                    }, {
                    field: 'option',
                    title: '操作',
                    toolbar: '#barDemo1',
                    width: 258
                }
                ]
            ],
            pageCallback, find, $("#inquireInputType").val()
        );
        $(".roleTable tbody tr").eq(0).addClass("layui-table-click");

        if (data==null||data==""){
            deletetable('cityList','市','#barDemo1');
            deletetable('countiesList','县（区）','#barDemo1');
            deletetable('streetList','街道','#barDemo2');
        }else {
            newcity0();
            newcounties();
            newstree();
        }
    });
    $('#search').on('click', function() {
        $('#search-tool').slideToggle(200)
    })
})
