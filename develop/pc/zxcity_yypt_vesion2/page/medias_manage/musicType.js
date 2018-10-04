$(function () {
    var CMD_QUERYTYPE = "dazzle/findAudioType",//查询所有类型接口
        CMD_ADDTYPE = "dazzle/addAudioType",  //dazzle/findAudioType
        CMD_DELTYPE = "dazzle/delAudioType";
    var UPDATEAUDIOTYPE = 'dazzle/updateAudioType';//修改分类排序接口
    var typeData = {};
    var layer = layui.layer;
    var table = layui.table;
    var rows = 100;
    var limits = [100,200,300];
    var pageno = 1;
    function init() {
        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_QUERYTYPE, typeData).done(function (res) {
            var trHtml = "";
            if (res.code == 1 && res.total > 0) {
                trHtml += '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>类型名</th><th>创建时间</th><th>修改时间</th><th>操作</th></tr>';
                for (var i = 0; i < res.data.findMusicType.length; i++) {
                    trHtml += '<tr><td>' + (i + 1) + '</td><td>' + res.data.findMusicType[i].name + '</td><td>' + res.data.findMusicType[i].createTime + '</td><td>' + res.data.findMusicType[i].modifyTime + '</td><td><button class="btn btn-danger delBtn"  style="margin-left:10px;" data-id="' + res.data.findMusicType[i].id +
                        '">删除</button></td></tr>';
                }
                trHtml += '</tbody></table>';
            } else {
                trHtml = '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>类型名</th><th>创建时间</th><th>修改时间</th><th>操作</th></tr>' +
                    '</tbody></table><div class="no-data">暂无数据~</div>';
            }
            $('#tablelist').html(trHtml);
            $('.delBtn').on('click', function () {
                var delID = $(this).attr('data-id');
                $('#delTag').attr('data-id', delID)
                $('#delgd').modal("show");
            });
        })
    }
    layui.use(['form', 'table', 'laypage', 'layer', 'element'], function () {
        form = layui.form;
        table = layui.table;
        laypage = layui.laypage;
        layer = layui.layer;
        element = layui.element;
        form.render();
        table.on('tool(tablelist)', function (obj) {
            console.log(obj);
            var event = obj.event;
            if (event == 'delete') {
                layer.confirm('真的删除该角色吗？', function (index) {
                    var id = obj.data.id;
                    var delData = {
                        id: Number(id)
                    }
                    reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_DELTYPE, delData).done(function (res) {
                        reloadPage();
                    })
                });
            }
        });
        getTable(1);
    });
 
    $('#addType').on('click',function() {
        layer.open({
            content: $('#add'),
            type: 1,
            anim: 5,
            area: ['600px'],
            shadeClose: true, //点击遮罩关闭
            content: $('#addgd'),
            btn: ['确定', '取消'],
            title: ['新增类型', 'font-size:12px;background-color:#424651;color:#fff'],
            cancel: function (index, layero) {
                layer.close(index);
                return false;
            },
            yes: function (index, layero) {
                var name = $('#musicType').val();
                if (name == "") {
                    layer.msg('请输入音乐类型！');
                    return
                }
                var addData = {
                    name: name
                }
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_ADDTYPE, addData).done(function (res) {
                    reloadPage();
                });
            },
            success: function () {
               
            },
            btn2: function (index, layero) {
                layer.close(index);
            },
            end: function (index) {
                layer.close(index);
            }
        });
    });
    function reloadPage() {
        setTimeout(function () {
            window.location.reload();
        }, 1000)
    }

    //异步请求Ajax
    function reqNewAjaxAsync(url, cmd, data, async) {
        var apikey = yyCache.get("apikey") || "test"; //获取缓存 通行证码
        var version = yyCache.get('version') || "1"; //获取缓存 版本号
        var defer = $.Deferred();
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            async: async || true, //默认为异步
            data: {
                "cmd": cmd,
                "data": JSON.stringify(data) || "",
                "version": version
            },
            beforeSend: function (request) {
                layer.load(0, { shade: [0.1, '#fff'] });
                request.setRequestHeader("apikey", apikey);
            },
            success: function (data) {
                layer.closeAll('loading');
                defer.resolve(data);
            },
            error: function (err) {
                layer.closeAll('loading');
                layer.msg("系统繁忙，请稍后再试!");
                console.log(err.status + ":" + err.statusText);
            }
        });
        return defer.promise();
    }

    //查询所有分类
    function initType() {
        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_QUERYTYPE, typeData).done(function (res) {
            if (res.code == 1 && res.total > 0) {
                var data = res.data.findMusicType,
                    sHtml = '';
                for (var i = 0; i < data.length; i++) {
                    sHtml +=
                        '<div class="type-item" data-id="' + data[i].id + '">' + data[i].name + '</div>';
                }
                $('#edit-area').html(sHtml);
            } else {
                layer.msg(res.msg);
            }
        })
    }

    $('#delTag').on('click', function () {
        var id = $(this).attr('data-id');
        var delData = {
            id: Number(id)
        }
        console.log(delData)
        console.log(CMD_DELTYPE)
        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_DELTYPE, delData).done(function (res) {
            $('#delTag').unbind('click');
            reloadPage();
        })
    })

    //分类排序接口弹框
    $('#sort').on('click', function () {
        layer.open({
            title: false,
            type: 1,
            content: $('#updateType'),
            area: ['600px', '500px'],
            btn: ['保存', '取消'],
            btnAlign: 'r',
            closeBtn: 0,
            scrollbar: false,
            resize: false,
            move: false,
            end: function () {
                $('#updateType').hide();
            },
            success: function (layero, index) {
                initType();
            },
            yes: function (index, layero) {
                var param = sort();
                reqNewAjaxAsync('/zxcity_restful/ws/rest', UPDATEAUDIOTYPE, param).done(function (res) {
                    if (res.code == 1) {
                        layer.msg(res.msg);
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 500)
                    } else {
                        layer.msg(res.msg);
                    }
                })
                return false;
            },
            btn2: function (index, layero) {
                layer.close(index);
 
            }
        })
    })

    var el = document.getElementById('edit-area');
    var sortable = new Sortable(el, {
        group: "name",
        sort: true,
        delay: 0,
        disabled: false,
        store: null,
        animation: 150,
        handle: ".type-item",
        filter: ".ignore-elements",
        draggable: ".type-item",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        dataIdAttr: 'data-id',
        forceFallback: false,
        fallbackClass: "sortable-fallback",
        fallbackOnBody: false,
        fallbackTolerance: 0,
        scroll: true,

        scrollFn: function (offsetX, offsetY, originalEvent) {
        },
        scrollSensitivity: 30,
        scrollSpeed: 10,
        setData: function (dataTransfer, dragEl) {
            dataTransfer.setData('Text', dragEl.textContent);
        },
        onChoose: function (evt) {
            evt.oldIndex;
        },
        onStart: function (evt) {
            evt.oldIndex;
        },
        onEnd: function (evt) {
            evt.oldIndex;
            evt.newIndex;
        },
        onAdd: function (evt) {
            var itemEl = evt.item;
            evt.from;
        },
        onUpdate: function (evt) {
            var itemEl = evt.item;
        },
        onSort: function (evt) {
        },
        onRemove: function (evt) {
        },
        onFilter: function (evt) {
            var itemEl = evt.item;
        },
        onMove: function (evt, originalEvent) {
            evt.dragged;
            evt.draggedRect;
            evt.related;
            evt.relatedRect;
            originalEvent.clientY;
        },
        onClone: function (evt) {
            var origEl = evt.item;
            var cloneEl = evt.clone;
        }
    });

    //排序组装方法
    function sort() {
        var param = {};
        param.musicTypeList = [];
        $('.type-item').each(function (i, v) {
            var obj = {};
            obj.id = $(this).attr('data-id');
            obj.rank = i;
            param.musicTypeList.push(obj);
        })
        return param;
    }
    function getTable(pageno) {
        //第一个实例
        var tableINs = table.render({
            id: 'tablelist',
            elem: '#tablelist',
            even: true,
            cellMinWidth: 80,
            skin: 'row',
            page: false,
            limit: rows,
            cols: [
                [ //表头
                    {
                        type: 'numbers', title: '序号', align: 'center', width: 80, templet: "#indexTpl"
                    }, {
                        field: 'name',
                        title: '类型名',
                        width: 200,
                    }, {
                        field: 'createTime',
                        title: '创建时间',
                        width: 200,
                
                    },{
                        field: 'modifyTime',
                        title: '修改时间',
                        width: 200,
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        toolbar: '#barCtrl',
                        width: 300
                    }
                ]
            ]
        });

        var res = pageCallback(pageno);
        if (res) {
            // console.log(res)
            if (res.code == 1) {
                tableINs.reload({
                    data: res.data.findMusicType
                })
            } else {
                layer.msg(res.msg)
            }
        }
        if(res.total > rows) {
            //分页
            layui.use('laypage');
            var page_options = {
                elem: 'laypageLeft',
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                groups: '4',
                limit: rows,//每页条数
                limits: limits
            }
            //分页渲染
            page_options.jump = function (obj, first) {
                if (!first) {
                    var resTwo = pageCallback(obj.curr);
                    if (resTwo && resTwo.code == 1)
                        tableINs.reload({
                            data: resTwo.data.findMusicType
                        });
                    else
                        layer.msg(resTwo.msg);
                }
            }
            layui.laypage.render(page_options);
        }
    }
    //获取内容方法
    function pageCallback(pagerows) {
        // var labelName = $('#search_box').val();
 
        var data = {};
        var res = reqAjax(CMD_QUERYTYPE, JSON.stringify(data));
        if (res.code == 1) {
            return res;
        }
    }
});