layui.use(['form','table','laypage','layer'],function(){
    var USER_API = {

        findList: 'masterCourse/backstageCourses',
        del: 'masterCourse/delCourse',
    }
    var USERID = yyCache.get("userId") || "";
    var curlimit = 10;
    var curPage = 1;
    //搜索
    $('#search-btn').on('click',function(){
        var param = $('#search_box').val();
        curPage = 1;
        getTableData();
    });

    resetInfo();
    //保存部分信息
    function saveInfo() {
        sessionStorage.setItem('list-page', curPage);
        sessionStorage.setItem('list-limit', curlimit);
        sessionStorage.setItem('list-search', $('#search_box').val());
    }

    function resetInfo(){
        curPage = sessionStorage.getItem('list-page') || 1;
        curlimit = sessionStorage.getItem('list-limit') || 10;
        var search = sessionStorage.getItem('list-search') || '';
        if(search ) {
            $('#search_box').val(search);
        }
    }

        //pageCallback回调
    function pageCallback(index, limit, keyword) {
        if (keyword == undefined) { keyword = '' }
        var keyword = keyword || $('#search_box').val();
        return getData(USER_API.findList, "{'pageNo':" + index + ",'pageSize':" + limit + ",'keyword':'" + keyword + "'}");
    }
    //添加
    $('#add-course').on('click',function(){
        location.href = '../zxcity_class_put/zxcity_class_put.html';
    });
    function getTableData(){
        tableInit('table', [
                [ //标题栏
                    {
                    field: 'eq',
                    title: '序号',
                    width: 80,
                    align: 'center',
                    templet: function(d){
                        return d.LAY_TABLE_INDEX + 1;
                    }
                    }, {
                    field: 'class',
                    title: '课程',
                    width: 600,
                    style: 'height:auto',
                    align: 'center',
                    templet: '#class-tpl'
                }, {
                    field: 'duration',
                    title: '课时',
                    width: 160,
                    align: 'center',
                    templet: '#duration-tpl',
                }, {
                    field: 'speakerName',
                    title: '主讲老师',
                    width: 160,
                    align: 'center',
                }, {
                    field: 'online',
                    title: '课程类型',
                    width: 160,
                    align: 'center',
                    templet: '#price-tpl',
                }, {
                    field: 'createTime',
                    title: '发布时间',
                    width: 200,
                    align: 'center',
                }, {
                    field: 'ctl',
                    title: '操作',
                    fixed: 'right',
                    align: 'center',
                    toolbar: '#barDemo',
                    width: 240,
                }
                ]
            ],
            pageCallback, 'laypageLeft'
        )
    }
    var _obj = tableInit('table', [
        [ //标题栏
            {
                field: 'eq',
                title: '序号',
                width: 80,
                align: 'center',
                templet: function(d){
                    return d.LAY_TABLE_INDEX + 1;
                }
            }, {
                field: 'class',
                title: '课程',
                width: 600,
                style: 'height:auto',
            align: 'center',
                templet: '#class-tpl'
            }, {
                field: 'duration',
                title: '课时',
                width: 160,
            align: 'center',
                templet: '#duration-tpl',
            }, {
                field: 'speakerName',
                title: '主讲老师',
                width: 160,
            align: 'center',
            }, {
                field: 'online',
                title: '课程类型',
                width: 160,
            align: 'center',
            templet: '#price-tpl',
            }, {
                field: 'createTime',
                title: '发布时间',
                width: 200,
            align: 'center',
            }, {
                field: 'ctl',
                title: '操作',
                fixed: 'right',
                align: 'center',
                toolbar: '#barDemo',
                width: 240,
            }
        ]
    ],
        pageCallback, 'laypageLeft'
    )
    table.on('tool(table)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var roleName = data.name;
        var avaiable = data.isAvailable;
        var roleId = data.id;
        saveInfo();
        if (layEvent === 'change') {
            sessionStorage.setItem("courseId",data.id);
            location.href = '../zxcity_class_put/zxcity_class_put.html?courseId=' + data.id;
        } else if (layEvent === 'del') { //删除
            var operatorName = data.name;
            var roleId = data.id;
            console.log(data)
            layer.confirm('确定删除吗？', function (index) {
                var params = {
                    createId: USERID,
                    courseId: data.id,
                }
                reqAjaxAsync(USER_API.del, JSON.stringify(params))
                    .done(function(res){
                        if(res.code == 1) {
                            layer.close(index);
                            layer.msg('删除成功');
                            location.reload();
                        }else {
                            layer.msg(res.msg);
                        }
                    })

            });
        } else if (layEvent =='look'){
            sessionStorage.setItem("courseId", data.id);
            location.href = '../zxcity_class_put/zxcity_class_put.html?courseId=' + data.id + "&look=true";
        }
    });

	/* 表格初始化
	 * tableId: 
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
    function tableInit(tableId, cols, pageCallback, pageDomName) {
        var tableIns, tablePage;

        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-150',
            cols: cols,
            page: false,
            even: true,
            skin: 'row',
            limit: 10
        });
         
        //2.第一次加载
        var res = pageCallback(curPage, curlimit);
        //第一页，一页显示10条数据
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
        layui.use('laypage');
        var page_options = {
            elem: pageDomName,
            count: res ? res.total : 0,
            curr: curPage,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [10, 20],
            limit: 10
        }
        page_options.jump = function (obj, first) {
            tablePage = obj;
            //首次不执行
            if (!first) {
                var resTwo = pageCallback(obj.curr, obj.limit);
                if (resTwo && resTwo.code == 1) {
                    curPage = obj.curr;
                    curlimit = obj.limit;
                    saveInfo();
                    tableIns.reload({
                        data: resTwo.data,
                        limit:  obj.limit
                    });
                }
                else {
                    layer.msg(resTwo.msg);
                }
                //处理 工具栏 固定右边后 高度不一致问题
                var tr = $('.layui-table-box .layui-table-main tbody tr');
                tr.each(function (index, item) {
                    var height = $(item).css('height');
                    $('.layui-table-box .layui-table-fixed .layui-table-body tr').eq(index).css('height', height);
                });
                $("img").one('error', function(e) {
                    $(this).attr("src", "img/default.png");
                });
            }
        }


        layui.laypage.render(page_options);
        //处理 工具栏 固定右边后 高度不一致问题
        var tr = $('.layui-table-box .layui-table-main tbody tr');
        tr.each(function (index, item) {
            var height = $(item).css('height');
            $('.layui-table-box .layui-table-fixed .layui-table-body tr').eq(index).css('height', height);
        });

        $("img").one('error', function(e) {
            $(this).attr("src", "img/default.png");
        });
        return {
            tablePage,
            tableIns
        };
    }


    //左侧表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        return res;
    }

});