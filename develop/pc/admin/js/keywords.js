var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
$.extend({
    keywords: function () {
        this.page = 1;
        this.pages = 1;
        this.rows = 5;
        this.labelPages = 1;
        this.customPages = 1;
        this.Request = {
            getData: 'querScCmsKeyWord',
            addData: 'insertScCmsKeyWord',
            delData: 'deletScCmsKeyWord',
        }
    }
});

$.keywords.prototype = {
    // 获取数据
    getDataFn: function (d) {
        var _this = this;
        reqNewAjaxAsync(this.Request.getData, d).done(function (res) {
            var keywordListHtm = $("#keywordList").html();
            if (res.code == 1) {
                _this.pages = Math.ceil(res.total / _this.rows);
                laytpl(keywordListHtm).render(res.data, function (html) {
                    $("#labelTabCon").html(html);
                });
            } else {
                layer.msg(res.msg);
            }
        });
    },
    // 获取数据分页
    getDataFnPage: function (d) {
        var _this = this;
        reqNewAjaxAsync(this.Request.getData, d).done(function (res) {
            var keywordListHtm = $("#keywordList").html();
            if (res.code == 1) {
                _this.pages = Math.ceil(res.total / _this.rows);
                laytpl(keywordListHtm).render(res.data, function (html) {
                    $("#labelTabCon").html(html);
                });
                _this.getDataPage(d, _this.pages);
            } else {
                layer.msg(res.msg);
            }
        });
    },
    // 获取分页
    getDataPage: function (d, pages) {
        var _this = this;
        laypage({
            cont: 'page',
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3,
            jump: function (obj) {
                d.pagination.page = _this.page = obj.curr;
                resetCheck('#labelMultiSelBox', '.labelSinSelBox', '#labelCheckedNum');
                _this.getDataFn(d);
            }
        });
    },
    // 添加数据
    addData: function (d) {
        var _this = this;
        reqNewAjaxAsync(this.Request.addData, d).done(function (res) {
            layer.msg(res.msg);
            if (res.code == 1) {
                // 清空模态框
                $("#addProvinceSec").val("");
                $("#addCitySec").val("");
                $("#addKeywordInp").val("");
                $("#addDescriptionTxt").val("");
            }
            _this.getDataFnPage({
                scCmsKeywordAreaCode: "",
                scCmsKeywordName: "",
                scCmsKeywordDescribe: "",
                pagination: {
                    rows: _this.rows,
                    page: 1
                }
            })
        });
    },
    delData: function (d) {
        var _this = this;
        layer.confirm('是否删除', {
            title: "提示",
        }, function (index) {
            reqNewAjaxAsync(_this.Request.delData, d).done(function (res) {
                layer.msg(res.msg);
                _this.getDataFnPage({
                    scCmsKeywordAreaCode: "",
                    scCmsKeywordName: "",
                    scCmsKeywordDescribe: "",
                    pagination: {
                        rows: _this.rows,
                        page: 1
                    }
                })
            });
            layer.close(index);
        });
    }
};

(function ($) {
    // 初始化加载
    var start = new $.keywords();
    var param = {
        scCmsKeywordAreaCode: "",
        scCmsKeywordName: "",
        scCmsKeywordDescribe: "",
        pagination: {
            rows: start.rows,
            page: start.page
        }
    };

    // 获取省市
    getCity($("#searchProvinceSec"), $("#searchCitySec"));
    getCity($("#addProvinceSec"), $("#addCitySec"));

    // 初始化数据
    start.getDataFnPage(param);

    // 查询数据
    $("#search_icon").click(function () {
        var searchCitySec = isNull($("#searchCitySec").val().trim()) ? $("#searchProvinceSec").val().trim() : $("#searchCitySec").val().trim();
        start.getDataFnPage({
            scCmsKeywordAreaCode: searchCitySec,
            scCmsKeywordName: $("#searchInp").val(),
            scCmsKeywordDescribe: "",
            pagination: {
                rows: start.rows,
                page: start.page
            }
        })
    })

    // 添加数据
    $("#confilmAddBtn").click(function () {
        if (isNull($("#addCitySec").val().trim())) {
            return layer.msg("请选择省市");
        } else if (isNull($("#addKeywordInp").val().trim())) {
            return layer.msg("请输入关键词");
        } else if (isNull($("#addDescriptionTxt").val().trim())) {
            return layer.msg("请输入关键词描述");
        } else {
            $("#addLabelM").modal("hide");
            start.addData({
                scCmsKeywordAreaCode: $("#addCitySec").val(),
                scCmsKeywordName: $("#addKeywordInp").val(),
                scCmsKeywordDescribe: $("#addDescriptionTxt").val()
            });
        }
    });

    // 删除数据
    $("#labelTabCon").on("click", ".delBtn", function () {
        start.delData([{
            scCmsKeywordId: $(this).attr("scCmsKeywordId")
        }]);
    });

    // 批量删除
    $("#delTotalOpera").click(function () {
        var arr = [];
        $('.labelSinSelBox.active').each(function (i, e) {
            arr.push({
                scCmsKeywordId: $(e).attr('scCmsKeywordId')
            })
        })
        if (!isNull(arr)) {
            start.delData(arr);
        } else {
            return layer.msg('请至少选择一项')
        }
    });

    //标签列表的checkBox：
    $('#labelTable').on('click', '.labelSinSelBox', function () {
        operateSinCheck(this, '.labelSinSelBox.active', '#labelMultiSelBox', '#labelCheckedNum', $('.labelSinSelBox').length);
    })
    $('#labelTable').on('click', '#labelCheckAll', function () {
        operateAllCheck(this, '#labelMultiSelBox', '.labelSinSelBox', '#labelCheckedNum');
    })
    // js over
})(jQuery);