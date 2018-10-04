// 原始数据
var dataRaw;
if (localStorage.hasOwnProperty('taskData')) {
    dataRaw = JSON.parse(localStorage.getItem('taskData'));
    localStorage.removeItem('taskData');
}

$(function() {
    init()
})

function init() {
    if (!dataRaw) return parent.layer.closeAll()
    for (var key in dataRaw) {
        $('#' + key).val(dataRaw[key])
    }
}

// 新增方法
function save() {
    if (!check()) return;
    var title = '确定添加任务说明？';
    var url = 'earnmoney/addReaprintExplainDetail';
    var params = {
        name: $('#name').val(),
        sort: parseInt($.trim($('#sort').val())),
        value: $('#value').val()
    }
    var id = dataRaw.id;
    if (id) {
        title = '确定修改任务说明？';
        url = 'earnmoney/updateReaprintExplainDetail';
        params.dictionaryId = id
    }
    var successFunc = function(data) {
        parent.layer.msg(data.msg, {
            icon: data.code == 1 ? 1 : 2
        })
        if (data.code == 1) {
            parent.refreshTable();
            cancle();
        }
    }
    var index = parent.layer.confirm(title, function() {
        parent.layer.close(index);
        myAjax(url, JSON.stringify(params), successFunc)
    });
}

function cancle() {
    parent.layer.closeAll('iframe');
}

function check() {
    var name = parseInt($.trim($('#name').val()));
    $('#name').val(isNaN(name) ? '': name);
    if (isNaN(name) || name < 1) {
        layer.msg('序列号请输入大于0的整数！', { icon: 2 })
        return false;
    }
    var sort = parseInt($.trim($('#sort').val()));
    $('#sort').val(isNaN(sort) ? '': sort);
    if (isNaN(sort) || 1 > sort || 99 < sort) {
        layer.msg('排序请输入1~99的整数！', { icon: 2 })
        return false;
    }
    var value = $('#value').val();
    if (value.length == 0) {
        layer.msg('请填写说明内容！', { icon: 2 })
        return false;
    }
    return true;
}