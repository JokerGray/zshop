var layer = layui.layer;
var laypage = layui.laypage;
var laydate = layui.laydate;
var laytpl = layui.laytpl;
$.extend({
    platform: function () {
        this.page = 1;
        this.rows = 5;
        this.labelPages = 1;
        this.customPages = 1;
        this.Request = {
            getLabel: 'selectAllScCmsChl',
            addLabel: 'addArticleChannel',
            updateLabel: 'updateFraChannel',
            delLabel: 'delectAllArticleChannel',
            addCustomLab: 'updateALLChannel'
        }
    }
});

$.platform.prototype = {
    getLabelData: function (d, scriptHtml, tbody) {
        var _this = this;
        var res = reqNewAjax(_this.Request.getLabel, d);
        if(res.code == 1) {
            var data = res.data || '';
            var total = res.total || '';
            _this.labelPages = Math.ceil(total / _this.rows);
            var getTpl = $(scriptHtml).html();             
            if(!isNull(data)) {
                laytpl(getTpl).render(data, function(html){
                    $(tbody).html(html);
                });
            } else {
                $(tbody).html('');
            }
        } else if(res.code == 9) {
            layer.msg(res.msg);
        }
    },
    getLabelPage: function (pages, d, scriptHtml, tbody) {              //获取分页
        var _this = this, cont = '';
        $('#labelNavSwitch li.active').attr('labeluserid') == 1 ? cont = 'labelPage' : cont = 'customPage';
        laypage({
            cont: cont, //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: true, //是否开启跳页
            skin: '#2BC6FF',
            groups: 3, //连续显示分页数
            jump: function(obj) {
                d.pagination.page = _this.page = obj.curr;
                resetCheck('#labelMultiSelBox', '.labelSinSelBox', '#labelCheckedNum');
                _this.getLabelData(d, scriptHtml, tbody);
            }
        });  
    },
    addNewLabel: function(d) {
        var _this = this;
        var res = reqNewAjax(_this.Request.addLabel, d);
        if(res.code == 1) {
            $('#confilmBtn').attr('data-dismiss', 'modal');    
            var data = {
                labelUserId: 1,
                startNumber: "",
                endNumber: "",
                pagination: {
                    page: _this.page,
                    rows: _this.rows
                }
            }
            getLabelTable(_this, data, "#labelTabList", "#labelTabCon");     
            layer.msg(res.msg);     
        } else if(res.code == 9) {
            layer.msg(res.msg);
        }
    },
    updataLabel: function(d){
        var _this = this;
        var res = reqNewAjax(_this.Request.updateLabel, d);
        if(res.code == 1) {
            var data = {
                labelUserId: 1,
                startNumber: "",
                endNumber: "",
                pagination: {
                    page: _this.page,
                    rows: _this.rows
                }
            }
            getLabelTable(_this, data, "#labelTabList", "#labelTabCon");    
            $('#synConfilmBtn').attr('data-dismiss', 'modal');  
        } else if(res.code == 9) {
            layer.msg(res.msg);
        }
    },
    addCustom: function(d) {
        var _this = this;
        var res = reqNewAjax(_this.Request.addCustomLab, d);
        if(res.code == 1) {
            var data = {
                labelUserId: $('#labelNavSwitch li.active').attr('labeluserid'),
                startNumber: "",
                endNumber: "",
                pagination: {
                    page: _this.page,
                    rows: _this.rows
                }
            }
            getLabelTable(_this, data, "#customTabList", "#customTabCon");
            resetCheck('#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
        } else if(res.code == 9) {
            layer.msg(res.msg);
        }
    }
}

$(function () {
    var start = new $.platform();

    //获取领域下拉列表：
    optionType($('#domainSel'), 'all');   

    //禁止input输入空格
    inhibitTrim('#sealabName');
    inhibitTrim('#startInp');
    inhibitTrim('#endInp');
    inhibitTrim('#labelNameInp');
    //限制数字输入框只能输入非负整数：
    ExamInpNum('#startInp');
    ExamInpNum('#endInp');

    //页面进来时渲染标签列表：
    var data = {
        labelUserId: 1,
        startNumber: "",
        endNumber: "",
        pagination: {
            page: start.page,
            rows: start.rows
        }
    }
    getLabelTable(start, data, "#labelTabList", "#labelTabCon");

    //nav栏中的两个li标签切换：
    $('#platTagLib').click(function(){
        navSwitch({curr: this, addbtn: '#addNewLabel', addCss: 'show', removeCss: 'hide', addTable: '#labelBox', removeTable: '#customBox'});
        resetCheck('#labelMultiSelBox', '.labelSinSelBox', '#labelCheckedNum');
        data.labelUserId = 1;
        getLabelTable(start, data, "#labelTabList", "#labelTabCon");
        delInpVal('#sealabName', '#domainSel', '#startInp', '#endInp');
    })
    $('#platCustom').click(function(){
        navSwitch({curr: this, addbtn: '#addNewLabel', addCss: 'hide', removeCss: 'show', addTable: '#labelBox', removeTable: '#customBox'});
        resetCheck('#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
        data.labelUserId = 2;
        getLabelTable(start, data, "#customTabList", "#customTabCon");
        delInpVal('#sealabName', '#domainSel', '#startInp', '#endInp');
    })

    //标签页搜索框搜索：
    $('#search_icon').click(function(){
        var sealabName = delTrim($('#sealabName').val()), domainSel = delTrim($('#domainSel').val()), startInp = delTrim($('#startInp').val()), endInp = delTrim($('#endInp').val());
        // if(sealabName != '' || domainSel != '' || startInp != '' || endInp != '') {
            labelUserId = $('#labelNavSwitch li.active').attr('labelUserId');
            var data = {
                "labelUserId": labelUserId,
                "labelName": sealabName,
                "scChlaChannelId": domainSel,
                "startNumber": startInp,
                "endNumber": endInp,
                "pagination": {
                    "page": start.page,
                    "rows": start.rows
                }
            }
            if($('#labelNavSwitch li.active').attr('labeluserid') == 1) {
                getLabelTable(start, data, "#labelTabList", "#labelTabCon");
            } else if($('#labelNavSwitch li.active').attr('labeluserid') == 2) {
                getLabelTable(start, data, "#customTabList", "#customTabCon");
            }
        // }
    })

    //添加新标签按钮：
    $('#addNewLabel').click(function(){
        checkBoxType(function (res) {
            $('#addlabelCheckBox').html('');
            layer.closeAll('loading');
            if (res.code == 1) {
                var data = res.data || "";
                $.each(res.data, function (i, v) {
                    $('#addlabelCheckBox').append("<div class='labelCheckBox cur-p' value='" + $.trim(v.channelId) + "'><i class='checkBoxIcon' class='cur-p'></i><span>" + v.channelName + "</span></div>");
                });
            } else {
                layer.msg(res.msg);
            }
        })
    })

    //添加新标签弹出框的checkBox:
    $('#addlabelCheckBox').on('click', '.labelCheckBox', function(){
        operateCheckBox(this, '.checkBoxIcon', 'span', 'orange');
    })

    //点击添加新标签确认添加按钮：
    $('#confilmBtn').click(function(){
        var inpValue = $('#labelNameInp').val();
        var checkedBox = $('.labelCheckBox i.active');
        if(checkedBox.length == 0 || !inpValue) {
            layer.msg('标签名称和频道为必填项');
            $('#confilmBtn').attr('data-dismiss', '');
        } else if(checkedBox.length > 0 && inpValue && inpValue.length < 7) {
            var channelArr = [];
            checkedBox.each(function(i,e){
                channelArr.push({scChlaChannelId: $(e).parent().attr('value')});
            })
            var data = {
                labelName: inpValue,
                scChlaChannelIds: channelArr
            }
            start.addNewLabel(data);
            $('#labelNameInp').val('');
            cancelCheckBox('.checkBoxIcon', '.labelCheckBox span');
        } else {
            layer.msg('标签名称不得超过5个字');
            $('#confilmBtn').attr('data-dismiss', '');
        }
    })

    //点击添加新标签模态框取消按钮注销之前选中：
    $('#CancelBtn').click(function(){
        $('#labelNameInp').val('');
        cancelCheckBox('.checkBoxIcon', '.labelCheckBox span');
    })

    //标签列表的checkBox：
    $('#labelTable').on('click', '.labelSinSelBox', function(){
        operateSinCheck(this, '.labelSinSelBox.active', '#labelMultiSelBox', '#labelCheckedNum', $('.labelSinSelBox').length);
    })
    $('#labelTable').on('click', '#labelCheckAll', function(){
        operateAllCheck(this, '#labelMultiSelBox', '.labelSinSelBox', '#labelCheckedNum');
    })

    //点击表格每一项的同步按钮：
    $('#labelTabCon').on('click', '.synLabelIcon', function(){
        $('#synLabelName').html($(this).parent().siblings('.labelNameText').html())
        var sccmsarticlelableid = $(this).parent().parent().attr('sccmsarticlelableid');
        $('#synConfilmBtn').attr('sccmsarticlelableid', sccmsarticlelableid)
        checkBoxType(function (res) {
            $('#synLabelcheckBox').html('')
            layer.closeAll('loading');
            if (res.code == 1) {
                var data = res.data || "";
                $.each(res.data, function (i, v) {
                    $('#synLabelcheckBox').append("<div class='synLabCheckBox cur-p' value='" + $.trim(v.channelId) + "'><i class='synCheckBoxIcon' class='cur-p'></i><span>" + v.channelName + "</span></div>");
                });
            } else {
                layer.msg(res.msg);
            }
        })
    })

    //点击tfoot总同步按钮：
    $('#updateTotalOpera').click(function(){
        if($('.labelSinSelBox.active').length == 0) {
            layer.msg('请至少选择一项');
            $(this).attr('data-toggle', '');
        } else {
            $(this).attr('data-toggle', 'modal');
            var string = '';
            $('.labelSinSelBox.active').each(function(i,e){
                string += $(e).parent().siblings('.labelNameText').html() + '、';
            })
            $('#synLabelName').html(string.slice(0, -1));
            checkBoxType(function (res) {
                $('#synLabelcheckBox').html('');
                layer.closeAll('loading');
                if (res.code == 1) {
                    var data = res.data || "";
                    $.each(res.data, function (i, v) {
                        $('#synLabelcheckBox').append("<div class='synLabCheckBox cur-p' value='" + $.trim(v.channelId) + "'><i class='synCheckBoxIcon' class='cur-p'></i><span>" + v.channelName + "</span></div>");
                    });
                } else {
                    layer.msg(res.msg);
                }
            })
        }
    })

    //同步标签弹出框的checkBox:
    $('#synLabelcheckBox').on('click', '.synLabCheckBox', function(){
        operateCheckBox(this, '.synCheckBoxIcon', 'span', 'orange');
    });

    //单项同步模态框的确认修改频道的按钮：
    $('#synConfilmBtn').click(function(){
        var checkBoxs = $('.labelSinSelBox.active');
        if(checkBoxs.length > 0) {
            var arr1 = [];
            checkBoxs.each(function(i,e){
                var trCheck = $(e);
                $('.synCheckBoxIcon.active').each(function(i,e){
                    arr1.push({scChlaLabelId: trCheck.parent().parent().attr('sccmsarticlelableid'), scChlaChannelId: $(e).parent().attr('value')})
                })
            })
            start.updataLabel(arr1)
        } else {
            var arr = [];
            var scChlaLabelId = $(this).attr('sccmsarticlelableid');
            $('.synCheckBoxIcon.active').each(function(i,e){
                arr.push({scChlaLabelId: scChlaLabelId, scChlaChannelId: $(e).parent().attr('value')})
            })
            start.updataLabel(arr)
        }  
        var arr = [];
        $('.synCheckBoxIcon.active').parent().each(function(i,e){
            arr.push({scChlaLabelId: scChlaLabelId, scChlaChannelId: $(e).attr('value')})
        })
    })

    //点击同步模态框取消按钮 注销之前选中的checkbox：
    $('#synCancelBtn').click(function(){
        cancelCheckBox('.synCheckBoxIcon', '.synLabCheckBox span');
    })

    //标签列表单项删除和批量删除：
    $('#labelTabCon').on('click', '.labCancelIcon', function(){
        var _this = this;
        // start.delLabel([{channelId: $(this).parent().parent().attr('scCmsArticleLableId')}], "#labelTabList", "#labelTabCon")
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
				var res = reqNewAjax(start.Request.delLabel, [{channelId: $(_this).parent().parent().attr('scCmsArticleLableId')}]);
                layer.msg(res.msg);
                if(res.code != 1) {return false};
                if(res.code == 1) {
                    var data = {
                        labelUserId: $('#labelNavSwitch li.active').attr('labeluserid'),
                        startNumber: "",
                        endNumber: "",
                        pagination: {
                            page: start.page,
                            rows: start.rows
                        }
                    }
                    getLabelTable(start, data, "#labelTabList", "#labelTabCon");
                    resetCheck('#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
                } 
            }
        });
    })
    $('#delTotalOpera').on('click', function(){
        var arr = [];
        $('.labelSinSelBox.active').each(function(i,e){
            arr.push({channelId: $(e).parent().parent().attr('sccmsarticlelableid')})
        })
        if(arr[0]) {
            // start.delLabel(arr, "#labelTabList", "#labelTabCon");
            layer.confirm('确认删除吗？', {
                title: "提示",
                btn: ['确认', '取消'],
                btn1: function (index, layero) {
                    var res = reqNewAjax(start.Request.delLabel, arr);
                    layer.msg(res.msg);
                    if(res.code != 1) {return false};
                    if(res.code == 1) {
                        var data = {
                            labelUserId: $('#labelNavSwitch li.active').attr('labeluserid'),
                            startNumber: "",
                            endNumber: "",
                            pagination: {
                                page: start.page,
                                rows: start.rows
                            }
                        }
                        getLabelTable(start, data, "#labelTabList", "#labelTabCon");
                        resetCheck('#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
                    } 
                }
            });
        } else {
            layer.msg('请至少选择一项');       
        }
    })

    //自定义列表单项删除和批量删除：
    $('#customTabCon').on('click', '.customDelIcon', function(){
        var _this = this;
        // start.delLabel([{channelId: $(this).parent().parent().attr('scCmsArticleLableId')}], "#customTabList", "#customTabCon")
        layer.confirm('确认删除吗？', {
            title: "提示",
            btn: ['确认', '取消'],
            btn1: function (index, layero) {
                var res = reqNewAjax(start.Request.delLabel, [{channelId: $(_this).parent().parent().attr('scCmsArticleLableId')}]);
                layer.msg(res.msg);
                if(res.code != 1) {return false};
                if(res.code == 1) {
                    var data = {
                        labelUserId: $('#labelNavSwitch li.active').attr('labeluserid'),
                        startNumber: "",
                        endNumber: "",
                        pagination: {
                            page: start.page,
                            rows: start.rows
                        }
                    }
                    getLabelTable(start, data, "#customTabList", "#customTabCon");
                    resetCheck('#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
                } 
            }
        });         
    })
    $('#customTotalDel').on('click', function(){
        var arr = [];
        $('.customSinSelBox.active').each(function(i,e){
            arr.push({channelId: $(e).parent().parent().attr('sccmsarticlelableid')})
        })
        if(arr[0]) {
            // start.delLabel(arr, "#customTabList", "#customTabCon");
            layer.confirm('确认删除吗？', {
                title: "提示",
                btn: ['确认', '取消'],
                btn1: function (index, layero) {
                    var res = reqNewAjax(start.Request.delLabel, arr);
                    layer.msg(res.msg);
                    if(res.code != 1) {return false};
                    if(res.code == 1) {
                        var data = {
                            labelUserId: $('#labelNavSwitch li.active').attr('labeluserid'),
                            startNumber: "",
                            endNumber: "",
                            pagination: {
                                page: start.page,
                                rows: start.rows
                            }
                        }
                        getLabelTable(start, data, "#customTabList", "#customTabCon");
                        resetCheck('#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
                    } 
                }
            });    
        } else {
            layer.msg('请至少选择一项')            
        }
    })
    
    //自定义列表单项添加和批量添加：
    $('#customTabCon').on('click', '.customAddIcon', function(){
        start.addCustom([{LabelId: $(this).parent().parent().attr('scCmsArticleLableId')}]);
    })
    $('#customTotalAdd').click(function(){
        var arr = [];
        $('.customSinSelBox.active').each(function(i,e){
            arr.push({LabelId: $(e).parent().parent().attr('sccmsarticlelableid')})
        })
        if(arr[0]) {
            start.addCustom(arr, "#customTabList", "#customTabCon")
        } else {
            layer.msg('请至少选择一项')            
        }
    })

    //自定义列表的checkBox：
    $('#customTable').on('click', '.customSinSelBox', function(){
        operateSinCheck(this, '.customSinSelBox.active', '#customMultiSelBox', '#customCheckedNum', $('.customSinSelBox').length);
    })
    $('#customTable').on('click', '#customCheckAll', function(){
        operateAllCheck(this, '#customMultiSelBox', '.customSinSelBox', '#customCheckedNum');
    })

});
//操作标签和自定义nav切换
function navSwitch(obj){
    $(obj.curr).addClass('active').siblings().removeClass('active');
    $(obj.addbtn).addClass(obj.addCss).removeClass(obj.removeCss);
    $(obj.addTable).addClass(obj.addCss).removeClass(obj.removeCss);
    $(obj.addTable).siblings(obj.removeTable).addClass(obj.removeCss).removeClass(obj.addCss);
}

//默认获取标签列表数据
function getLabelTable(start, data, scriptHtml, tbody){
    start.getLabelData(data, scriptHtml, tbody);
    start.getLabelPage(start.labelPages, data, scriptHtml, tbody);
}
//重置checkBox：
function resetCheck(MutilCheck, singleCheck, checkNam){
    $(MutilCheck).removeClass('active');
    if($(singleCheck + '.active')) {
        $(singleCheck).removeClass('active');
    }
    $(checkNam).html('0');
}

//取消checkBox的点击样式：
function cancelCheckBox(checkIcon, span){
    $(checkIcon).removeClass('active');
    $(span).removeClass('orange');
}

function delInpVal(labelName, select, startNum, endNum){
    $(labelName).val('');
    $(select).val('');
    $(startNum).val('');
    $(endNum).val('');
}
//去除末尾多余逗号
function delsymbol(str){
    return str.replace(/[,，.、]$/, '').replace(/^[,，.、]/, '');
}