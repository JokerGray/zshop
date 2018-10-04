var layer = layui.layer,
    laytpl = layui.laytpl,
    laypage = layui.laypage,
    form = layui.form();
$(function() {

    function S() {
        this.getTpl = $('#tableScript').html();
        this.rows = 5;
        this.page = 1;
        this.pages = 1;
        this.url = {
            parameterInitit: 'parameterInitit', //获取初始化参数（下拉）
            querScCmsAdvStrategy: 'querScCmsAdvStrategy', //查询表格数据
            addScCmsAdvStrategy: 'addScCmsAdvStrategy', //添加
            updateScCmsAdvStrategy: 'updateScCmsAdvStrategy', //修改
        }
    };
    S.prototype = {
        getInitAjax: function(d) {
            var _this = this;
            reqNewAjaxAsync(_this.url.parameterInitit, d).then(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg)
                }
                var ops = '',
                    ops2 = '',
                    dataName = '';
                $.each(res.data, function(i, v) {
                    ops += '<option value="' + v.typeNmae + '">' + v.typeNmae + '</option>';
                    ops2 += '<option value="' + v.type + '">' + v.typeNmae + '</option>';
                    $.each(v.dataName, function(q, r) {
                        dataName += '<option value="' + r + '">' + r + '</option>';
                    });
                });
                $("#type").append(ops);
                $("#addTypeSel").append(ops2);
                $("#editTypeSel").append(ops);
                form.render();
            });
        },
        // 获取表格数据
        getTableDataAjax: function(d) {
            var _this = this;
            reqNewAjaxAsync(_this.url.querScCmsAdvStrategy, d).then(function(res) {
                if (res.code != 1) {
                    return layer.msg(res.msg);
                }
                _this.pages = Math.ceil(res.total / _this.rows);
                laytpl(_this.getTpl).render(res.data, function(html) {
                    $("#labelTabCon").html(html);
                });
                _this.getTablePageAjax(d, _this.pages);
            });
        },
        //表格分页
        getTablePageAjax: function(d, pages) {
            var _this = this;
            laypage({
                cont: 'labelPage', //容器。值支持id名、原生dom对象，jquery对象,
                pages: pages, //总页数
                skip: true, //是否开启跳页
                skin: '#2BC6FF',
                groups: 3, //连续显示分页数
                jump: function(obj) {
                    d.page = obj.curr;
                    reqNewAjaxAsync(_this.url.querScCmsAdvStrategy, d).then(function(res) {
                        if (res.code != 1) {
                            return layer.msg(res.msg);
                        }
                        laytpl(_this.getTpl).render(res.data, function(html) {
                            $("#labelTabCon").html(html);
                        });
                    });
                }
            });
        },
        // 切换可用或者不可用
        tabBtnAjax: function(d) {
            var _this = this;
            reqNewAjaxAsync(_this.url.addScCmsAdvStrategy, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code != 1) {
                    return false;
                }
                start.getTableDataAjax({
                    scCmsAdvStrategyTypeName: $("#type").val(),
                    page: 1,
                    rows: _this.rows,
                });
            });
        },
        // 添加
        addDataAjax: function(d) {
            var _this = this;
            reqNewAjaxAsync(_this.url.addScCmsAdvStrategy, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code != 1) {
                    return false;
                }
                $("#addTypeSel").val("");
                $("#addDescriptTxt").val("");
                $("#addValTxt").val("");
                $("#addAvailableSel").val("");
                $("#addLabelM").modal('hide');
                form.render();
                $("#addLabelM").modal("hide");
                start.getTableDataAjax({
                    scCmsAdvStrategyTypeName: $("#type").val(),
                    page: 1,
                    rows: _this.rows,
                });
            });
        },
        // 修改
        editDataAjax: function(d) {
            var _this = this;
            reqNewAjaxAsync(_this.url.updateScCmsAdvStrategy, d).then(function(res) {
                layer.msg(res.msg);
                if (res.code != 1) {
                    return false;
                }
                $("#editLabelM").modal("hide");
                start.getTableDataAjax({
                    scCmsAdvStrategyTypeName: $("#type").val(),
                    page: 1,
                    rows: _this.rows,
                });
            });
        }
    };

    var start = new S();
    start.getInitAjax();
    start.getTableDataAjax({
        scCmsAdvStrategyTypeName: $("#type").val(),
        page: 1,
        rows: start.rows,
    });

    // // 更改layui select
    // $('.addLabelName').on('blur', 'input[placeholder="请选择"]', function() {

    // });

    // // 更改layui select
    // $('.editLabelName').on('blur', 'input[placeholder="请选择"]', function() {
    //     var v = $(this).val();
    //     var dl = $('.editLabelName').find('dl.layui-anim.layui-anim-upbit');
    //     addDd(v, dl);
    // });

    // function addDd(v, dl) {
    //     var flag = false;
    //     $.each(dl.find('dd'), function(q, r) {
    //         // 比对输入的值是否存在
    //         if ($(r).html() === v) {
    //             $(r).addClass('layui-this').removeClass('layui-hide');
    //             $(r).siblings('dd').removeClass('layui-this');
    //             flag = true;
    //             return false;
    //         }
    //     });
    //     if (flag) {
    //         return false;
    //     }
    //     // 强行插入到select
    //     dl.find('dd.layui-this').removeClass('layui-this');
    //     dl.prepend('<dd class="layui-this" lay-value="' + v + '">' + v + '</dd>');
    //     dl.parent().siblings('select.sel').append('<option value="' + v + '">' + v + '</option>')
    //     form.render('select');
    // }

    // 筛选类型
    $("#type").change(function() {
        var v = $(this).val();
        start.getTableDataAjax({
            scCmsAdvStrategyTypeName: v,
            page: 1,
            rows: start.rows,
        });
    });

    // 可用不可用点击
    $("#labelTabCon").on('click', '.btnTd .with_btn', function() {
        var type = $(this).attr('type');
        var json = $(this).parent().parent('tr').attr("data");
        json = JSON.parse(json);
        if ($(this).hasClass("active")) {
            $(this).removeClass("active").siblings().addClass("active");
        } else {
            $(this).addClass("active").siblings().removeClass("active");
            start.editDataAjax({
                "scCmsAdvStrategyId": json.scCmsAdvStrategyId,
                "scCmsAdvStrategyIsoptional": type,
            });
        }
    });

    // 添加
    $("#addSave").click(function() {
        // if (isNull($("#addTypeSel").val())) {
        //     return layer.msg("请输入添加类型");
        // }
        if (isNull($("#addDescriptTxt").val())) {
            return layer.msg("请输入类型名称");
        }
        if (isNull($("#addValTxt").val())) {
            return layer.msg("请输入值");
        }
        if (!((/^[0-9]*[1-9][0-9]*$/.test($("#addValTxt").val())) || (/^\d+(\.\d+)?$/.test($("#addValTxt").val())))) {
            console.log($("#addValTxt").val())
            return layer.msg("请输入正数值")
        }
        if (isNull($("#addAvailableSel").val())) {
            return layer.msg("请选择是否可用");
        }
        start.addDataAjax({
            "scCmsAdvStrategyType": $("#addTypeSel").val(),
            "scCmsAdvStrategyTypeName": $("#addDescriptTxt").val(),
            "scCmsAdvStrategyPrice": $("#addValTxt").val(),
            "scCmsAdvStrategyIsoptional": $("#addAvailableSel").val(),
            // 下期改
            "scCmsAdvRelationId": 0
        })
    });


    // 打开修改模态框
    $("#labelTabCon").on('click', '.gainsTabBtn', function() {
        var json = $(this).parent().parent('tr').attr("data");
        json = JSON.parse(json);
        $("#editDescriptTxt").val(json.scCmsAdvStrategyType);
        // $("#editDescriptTxt").val(json.detailedName);
        $("#editValTxt").val(json.scCmsAdvStrategValue);
        $("#editAvailableSel").val(json.scCmsAdvStrategyIsoptional);
        $("#typeId").val(json.scCmsAdvStrategyId);
        form.render('select');
    });

    // 修改
    $("#editSave").click(function() {
        // if (isNull($("#editTypeTxt").val())) {
        //     return layer.msg("请输入添加类型");
        // }
        if (isNull($("#editDescriptTxt").val())) {
            return layer.msg("请输入添加明细");
        }
        if (isNull($("#editValTxt").val())) {
            return layer.msg("请输入值");
        }
        if (!((/^[0-9]*[1-9][0-9]*$/.test($("#editValTxt").val())) || (/^\d+(\.\d+)?$/.test($("#editValTxt").val())))) {
            console.log($("#editValTxt").val())
            return layer.msg("请输入正数值")
        }
        if (isNull($("#editAvailableSel").val())) {
            return layer.msg("请选择是否可用");
        }
        start.editDataAjax({
            // "scCmsAdvStrategyType": $("#editTypeTxt").val(),
            "scCmsAdvStrategyTypeName": $("#editDescriptTxt").val(),
            "scCmsAdvStrategyPrice": $("#editValTxt").val(),
            "scCmsAdvStrategyIsoptional": $("#editAvailableSel").val(),
            "scCmsAdvStrategyId": $("#typeId").val()
        })
    });
    // js over
});