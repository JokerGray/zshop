layui.use(['form','table','laydate','laypage','layer'],function(){
    var form = layui.form;
    var table = layui.table;
    var laydate = layui.laydate;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var $ = layui.jquery;
    var USER_URL = {
        ADD: 'operations/addNewsPush',
        EDIT: 'operations/updateNewsPush',
        DEL: 'operations/deleteNewsPush',
        QUERY: 'operations/findNewPushByOperations'
    };
    var defaultTitle = '标题';
    laydate.render({
        elem: '#search-start',
        done: function (value, date) {
            var dateEnd = $('#search-end').val();
            var end = new Date(dateEnd).getTime();
            var start = new Date(value).getTime();
            endDate.config.min = {
                year: date.year,
                month: date.month - 1, //关键
                date: date.date,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            if (end < start) {
                layer.msg('开始时间不能大于结束时间!', { time: 1000 });
                $('#search-start').val($('#search-end').val());
                return false;
            }
            dateStart = $('#search-start').val();
        }
    });
    laydate.render({
        elem: '#search-end',
        done: function (value, date) {
            var dateStart = $('#search-start').val();
            var start = new Date(dateStart).getTime();
            var end = new Date(value).getTime();
            startDate.config.max = {
                year: date.year,
                month: date.month - 1,//关键
                date: date.date,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            if (end < start) {
                layer.msg('结束时间不能小于开始时间!', { time: 1000 });
                $('#search-end').val($('#search-start').val());
                return;
            }
            $('#search-end').val();
        }
    });


    function getNextDay(d) {
        d = new Date(d);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);
        //return d;
        //格式化
        var month = d.getMonth() + 1;
        month = month >= 10 ? month : '0' + month;
        var date = d.getDate();
        date = date >= 10 ? date : '0' + date;
        return d.getFullYear() + "-" + month + "-" + date;

    }
    var dateStart = $('#add-date-start').val();
    var dateEnd = $('#add-date-end').val();
    var startDate = laydate.render({
        elem: '#add-date-start',
        type: 'datetime',
        done: function (value, date) {
            var dateEnd = $('#add-date-end').val();
            var end = new Date(dateEnd).getTime();
            var start = new Date(value).getTime();
 
            if (end < start) {
                layer.msg('开始时间不能大于结束时间!', { time: 1000 });
                $('#add-date-end').val(value);
                return false;
            }
            dateStart = $('#add-date-start').val();
        }
    });
    var endDate = laydate.render({
        elem: '#add-date-end',
        type: 'datetime',
        done: function (value, date) {
            var dateStart = $('#add-date-start').val();
            var start = new Date(dateStart).getTime();
            var end = new Date(value).getTime();
            if (end < start) {
                layer.msg('结束时间不能小于开始时间!', { time: 1000 });
                $('#add-date-start').val(value);
                return ;
            }
            dateEnd = $('#add-date-end').val();
        }
    });
    var pushStart = laydate.render({
        elem: '#add-push-start',
        type: 'time',
        done: function (value, date) {
            var iRet = cmpTime(value, $('#add-push-end').val());
            if (iRet == -1) {
                layer.msg('时间选择有误,已重新调整!');
                $('#add-push-end').val(value);
                return false;
            }
        }
    });
    var pushEnd = laydate.render({
        elem: '#add-push-end',
        type: 'time',
        done: function (value, date) {
            var iRet = cmpTime($('#add-push-start').val(), value);
            if(iRet == -1) {
                layer.msg('时间选择有误,已重新调整!');
                $('#add-push-start').val(value);
                return false;
            }
        }
    });
    // 小于等于返回1  大于返回-1   格式错误返回0
    function cmpTime(time1,time2){  
        var ary1 = time1.split(':');
        var ary2 = time2.split(':');
        if(ary1.length == 3 && ary2.length == 3) {
            var tmp1 = parseInt(ary1[0]) * 3600 + parseInt(ary1[1]) * 60 + parseInt(ary1[2]); 
            var tmp2 = parseInt(ary2[0]) * 3600 + parseInt(ary2[1]) * 60 + parseInt(ary2[2]); 
            if(tmp1 <= tmp2) {
                return 1;
            }
            return -1;
        }
        return 0;
    }
    function getTitle() {
        return defaultTitle;
    }
    $('#commonAdd').on('click',function(){
        showAdd();
    });
 
 
    form.render();
 
    //搜索条件进行搜索
    $('#toolSearch').on('click', function () {
        showTable();
    });

    //重置
    $("#toolRelize").on('click', function () {
        $("#msg-type").val("0");
        $("#search-content").val("");
        $("#search-start").val("");
        $("#search-end").val("");
        form.render();
        showTable();
    });

    table.on('tool(table)',function(obj){
        var event = obj.event;
        var data = obj.data;
        if (event == 'detail'){
            layer.open({
                title: ['查看推送信息', 'font-size:12px;background-color:#424651;color:#fff'],
                type: 1,
                content: $('#details'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['750px', '500px'],
                shade: [0.1, '#fff'],
                btn: ['关闭'],
                resize: false,
                end: function () {
                    $('#details').hide();
                },
                success: function (layero, index) {
                    $('#detail-type').val(data.categoryId);
                    var msg = formatMsg(data.content);
                    $('#detail-msg').val(msg);
                    $('#detail-date-start').val(data.startTime);
                    $('#detail-date-end').val(data.endTime);

                    var start = data.stertPlayTime && data.stertPlayTime.substring(data.stertPlayTime.indexOf(' '));
                    var end = data.endPlayTime && data.endPlayTime.substring(data.endPlayTime.indexOf(' '));

                    $('#detail-push-start').val(start);
                    $('#detail-push-end').val(end);

                    $('input[name="detail-msg-enable"]').each(function (index, item) {
                        if ($(item).val() == data.status) {
                            $(item).prop('checked', 'checked');
                        }
                    });
                    form.render();
                },
                yes: function (index, layero) {
                    layer.close(index);
                },
            });
        }else if(event == 'change'){
            showEdit(data);
        }else if(event == 'del'){
            layer.confirm(
                "是否确定删除此推送信息?",
                { icon: 3, title: ['提示']},
                function(index){
                    var paramDel = {
                        id : data.id,
                    };
                    reqAjaxAsync(USER_URL.DEL, JSON.stringify(paramDel)).done(function(res){
                        if (res.code == 1) {
                            layer.msg(res.msg);
                            layer.close(index);
                            showTable();
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                }
            );
        }
    });
 
    var obj = tableInit('table', [
        [{
            title: '序号',
            align: 'left',
            field: 'eq',
            width: 80,
            templet: function (d) {
                return d.LAY_TABLE_INDEX + 1;
            }
        }, {
            title: '类型',
            align: 'left',
            field: 'categoryId',
            templet: function (d) {
                switch (Number(d.categoryId)) {
                    case 0:
                        return '全部';
                    case 1:
                        return '智享后台';
                    case 2:
                        return '智享城市';
                    case 3:
                        return '智大师';
                    default:
                        break;
                }
                return '';
            },
            width: 150
        }, {
            title: '推送信息',
            align: 'left',
            field: 'content',
            style: 'height:auto;',
            templet: function (d) {
                var str = d.content.replace(/\n/g, '<br>');
                return '<div>' + str + '</div>';
            }
        }, {
            title: '开始时间',
            align: 'left',
            field: 'startTime',
            width: 220
        }, {
            title: '结束时间',
            align: 'left',
            field: 'endTime',
            width: 220
        }, {
            title: '创建时间',
            align: 'left',
            field: 'createTime',
            width: 220
        }, {
            title: '是否发布',
            align: 'left',
            field: 'status',
            width: 100,
            templet: function (d) {
                if (d.status == 1) {
                    return '是';
                }
                return '否';
            }
        }, {
            title: '操作',
            // fixed: 'right',
            align: 'left',
            toolbar: '#barDemor',
            width: 300
        }]
    ],
        pageCallback
    );
 
    function tableInit(tableId, cols, pageCallback, test) {
        var tableIns, tablePage;
        //1.表格配置
        tableIns = table.render({
            id: tableId,
            elem: '#' + tableId,
            height: 'full-210',
            cols: cols,
            page: false,
            limit: 15,
            even: true
            // cellMinWidth: 80,
            // skin: 'row'
        });

        //2.第一次加载
        var res = pageCallback(1, 15);
        //第一页，一页显示15条数据
        if (res) {
            if (res.code == 1) {
                tableIns.reload({
                    data: res.data,
                })
            } else {
                layer.msg(res.msg)
            }
        }

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function (obj, first) {
            tablePage = obj;

            //首次不执行
            if (!first) {
                var resTwo = pageCallback(obj.curr, obj.limit);
                if (resTwo && resTwo.code == 1)
                    tableIns.reload({
                        data: resTwo.data
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    }
    //pageCallback回调

    function pageCallback(index, limit, msgType, msgTitle) {
        if (msgType == undefined) { msgType = '' }
        if (msgTitle == undefined) { msgTitle = '' }
        var startDate = $('#search-start').val();
        var endDate = $('#search-end').val();
        var start = new Date(startDate).getTime();
        var end = new Date(endDate).getTime();
        if (end < start) {
            layer.msg('请选择正确的时间段!', { time: 2000 });
            return;
        }
        var param = {
            page: index,
            rows: limit,
            categoryId: Number($("#msg-type").find("option:selected").val()),
            startTime: startDate,
            endTime: endDate,
            param: $('#search-content').val()
        }
        return reqAjax(USER_URL.QUERY, JSON.stringify(param));
    }


    //加了入参的公用方法
    function getTable(msgType, msgTitle) {
        var initPage = obj.tablePage;
        var initTable = obj.tableIns;
        var res = pageCallback(1, 15, msgType, msgTitle);
        initTable.reload({ data: res.data });
        layui.use('laypage');
        var page_options = {
            elem: 'laypageLeft',
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function (obj, first) {
            tablePage = obj;

            //首次不执行
            if (!first) {
                var resTwo = pageCallback(obj.curr, obj.limit, msgType, msgTitle);
                if (resTwo && resTwo.code == 1)
                    initTable.reload({
                        data: resTwo.data,
                    });
                else
                    layer.msg(resTwo.msg);
            }
        }
        layui.laypage.render(page_options);
    }

    function showAdd(data) {
        layer.open({
            title: ['添加推送信息', 'font-size:12px;background-color:#424651;color:#fff'],
            type: 1,
            content: $('#addDetail'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['750px', '500px'],
            shade: [0.1, '#fff'],
            btn: ['确定', '取消'],
            resize: false,
            end: function () {
                $('#addDetail').hide();
            },
            success: function (layero, index) {
                //清空
                resetDate();
            },
            yes: function (index, layero) {
                var param = setParams();
                if (param != null) {
                    addMsg(param);
                }
                 
            },
            btn1: function (index, layero) {
                layer.close(index);
            }
        });
    }
    function setParams() {
        var parent = $('#addDetail');
        var type = $('#addBasic').val();
        var msg = $('#addMsg').val();
        if (msg == "") {
            layer.msg('请输入推送信息', { time: 1000 });
            return null;
        }
        var dateStart = $('#add-date-start').val();
        var dateEnd = $('#add-date-end').val();
        // 
        var dateStart = $('#add-date-start').val();
        var dateEnd = $('#add-date-end').val();
        if (dateStart == '' || dateEnd == '') {
            layer.msg('有效时间必须选择', { time: 2000 });
            return null;
        }

        var start = new Date(dateStart).getTime();
        var end = new Date(dateEnd).getTime();
        if (end < start) {
            layer.msg('有效时间选择错误 起始日期大于终止时间!', { time: 2000 });
            return null;
        }

        var startTime = $('#add-push-start').val();
        var endTime = $('#add-push-end').val();
        if(cmpTime(startTime,endTime) != 1) {
            layer.msg('推送时间选择错误', { time: 2000 });
            return null; 
        }

        var content = '';
        if(msg.indexOf('\n') != -1){
            var ary = msg.split('\n');
            ary.forEach(function(item,index){
                content +=   item ;
            });
        }else {
            content =  msg ;
        }

        var status = $('input[name="add-msg-enable"]:checked').val();
        var param = {
            categoryId: type,
            categoryName: $('#addBasic option[value="' + type + '"]').text(),
            title: getTitle(),
            content: content,
            stertPlayTime:  startTime,
            endPlayTime:  endTime,
            status: status,
            startTime: dateStart,
            endTime: dateEnd,
        };
        return param;
    }
    function showEdit(data) {
        layer.open({
            title: ['修改推送信息', 'font-size:12px;background-color:#424651;color:#fff'],
            type: 1,
            content: $('#addDetail'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['750px', '500px'],
            shade: [0.1, '#fff'],
            btn: ['确定', '取消'],
            resize: false,
            end: function () {
                $('#addDetail').hide();
            },
            success: function (layero, index) {
                //
                $('#addBasic').val(data.categoryId);
                var msg = formatMsg(data.content);
                $('#addMsg').val(msg);
                $('#add-date-start').val(data.startTime);
                $('#add-date-end').val(data.endTime);
                var start = data.stertPlayTime && data.stertPlayTime.substring(data.stertPlayTime.indexOf(' '));
                var end = data.endPlayTime && data.endPlayTime.substring(data.endPlayTime.indexOf(' '));

                $('#add-push-start').val(start || '');
                $('#add-push-end').val(end || '');

                $('input[name="add-msg-enable"]').each(function(index,item){
                    if($(item).val() == data.status){
                        $(item).prop('checked','checked');
                    }
                });
                form.render();
            },
            yes: function (index, layero) {
                var param = setParams();
                if (param != null) {
                    param.id = data.id;
                    editMsg(param);
                }
 
            },
            btn1: function (index, layero) {
                layer.close(index);
            }
        }); 
    }
    function addMsg(param) {
        reqAjaxAsync(USER_URL.ADD, JSON.stringify(param)).done(function (res){
            if(res.code == 1) {
                layer.msg('添加成功',{
                    time:1000,
                },function(){
                    layer.closeAll();
                    showTable();
                });
            }else {
                layer.msg(res.msg);
            }
        })
    }

    function editMsg(param) {
        reqAjaxAsync(USER_URL.EDIT, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                layer.msg('修改成功', {
                    time: 1000,
                }, function () {
                    layer.closeAll();
                    showTable();
                });
            }else {
                layer.msg(res.msg);
            }
        })
    }

    function showTable() {
        var msgType = Number($("#msg-type").find("option:selected").val());
        var msgTitle = getTitle(); // 
        getTable(msgType, msgTitle);
    }
    //重置添加修改控件数据
    function resetDate() {
        $('#addBasic').val('0');
        $('#addMsg').val('');
        $('#add-date-start').val('');
        $('#add-date-end').val('');
        $('#add-push-start').val('');
        $('#add-push-end').val('');
         
        $('input[name="add-msg-enable"][value="1"]').prop('checked', 'checked'); 
        form.render();
    }
    function formatMsg(content){
        if(content.indexOf('<p>') != -1 && content.indexOf('</p>') != -1) {
            var ary = content.split('</p>');
            var aryMsg = [];
            ary.forEach(function(item,index){
                if(item.indexOf('<p>') == 0){
                    var str = item.substring(3);
                    aryMsg.push(str);
                }
            });
            return aryMsg.join('\n');
        }
        return content;
    }
    function formatDate(date){
        var ary = date.split(' ');
        if (ary && ary.length >=1){
            return ary[0];
        }
        return '2018-1-1';
    }
});