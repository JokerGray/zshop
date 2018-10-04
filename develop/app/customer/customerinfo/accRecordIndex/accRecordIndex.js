var getParam;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    getParam = getParams();
    tableInit();
    $('#recordTable').bootstrapTable('hideLoading');
});

function deleteRecord(params) {
    
}

//监听table里数量输入框
$('#recordTable').on('input', '.mnum', function () {
    var purchaseNum = $(this).val().trim();
    var consumeNum = Number($(this).attr('data-consumeNum'));
    if (Number(purchaseNum) - consumeNum < 0){
        // layer.msg('请留店数量不能小于已消耗数量！');
        // $(this).val(consumeNum);
        // $(this).parent().siblings().find('.remainNum').text(0);
        return false;
    } else if (purchaseNum.length == 0 || isNaN(Number(purchaseNum))){
        layer.msg('请输入有效服务业绩！');
        return false;
    }
    $(this).parent().siblings().find('.remainNum').text(Number(purchaseNum) - consumeNum);
});

//初始化表格
var TableInit = function (id, url, columns, param) {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#' + id).bootstrapTable({
            url: url,
            method: 'POST',
            toolbar: '#toolbar',
            contentType: "application/x-www-form-urlencoded",
            ajaxOptions: {
                headers: {
                    apikey: 'test'
                }
            },
            responseHandler: function (res) {
                if (res.code == 1) {
                    res.rows = res.data;
                    return res;
                } else {
                    layer.msg(res.msg)
                }
            },
            queryParams: oTableInit.queryParams,
            undefinedText: '-',
            striped: false,
            cache: false,
            pagination: false,
            sortable: false,
            sidePagination: "server",
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            strictSearch: false,
            clickToSelect: false,
            uniqueId: 'id',
            columns: columns,
            onLoadSuccess: function (data) {
                layer.close(loading);
            }
        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        params['data'] = JSON.stringify({
            id: getParam.memberId
        })
        params['cmd'] = 'customer/accRecordList';

        if (!param) return params;

        return params;
    };
    return oTableInit;
}

function tableInit() {
    var columns = [
        {
            field: 'Number',
            align: 'center',
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'purchaseName',
            title: '名称',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                var re = val;
                if (row.packageName != null && row.packageName != "" && row.packageName != '') {
                    re += "(" + row.packageName + ")";
                }

                return re;
            }
        }, {
            field: 'purchaseNum',
            title: '留店数量',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                var re = "";
                if (val == "0" || val == '0' || val == 0) {
                    re = val;
                } else {
                    re = '<input type="text" id="mnum" name="mnum" data-consumeNum="' + row.consumeNum +'" style="width:100%;text-align:center;" class="form-control mnum" maxlength="10" onkeyup="validateNumber(this);" value="' + val + '" />';
                    re += '<input type="hidden" id="consumeNum" name="consumeNum" value="' + row.consumeNum + '"/>';
                    re += '<input type="hidden" id="mid" name="mid" value="' + row.recordId + '"/>';
                    re += '<input type="hidden" id="rnum" name="rnum" value="' + (index + 1) + '"/>';
                }

                return re;
            }
        },  {
            field: 'consumeNum',
            title: '已消耗',
            // width: 100,
            align: "center"
        },{
            field: 'purchaseNum',
            title: '剩余数量',
            // width: 100,
            align: "center",
            formatter: function (val, row, index) {
                var re = Number(val) - Number(row.consumeNum);
                return '<span class="remainNum">' + re + '</span>';
            }
        }, {
            field: '',
            title: '操作',
            // width: 10,
            align: "center",
            formatter: function (val, row, index) {
                var re = "";
                re = '<button class="btn btn-warning btn-circle" type="button" onclick="delConsumeRecord(' + row.recordId + ')"><i class="fa fa-times"></i></button>';
                return re;
            }
        }
    ];

    Table = new TableInit('recordTable', '/zxcity_restful/ws/rest', columns, {})
    Table.Init()
}

function countConsumeNumber() {
    var purchaseNum = '';
    var recordId = '';
    var pass = true;
    var mid = document.getElementsByName("mid");
    var mnum = document.getElementsByName("mnum");
    var rnum = document.getElementsByName("rnum");
    var consumeNum = document.getElementsByName("consumeNum");
    for (i = 0; i < mid.length; i++) {
        var bf = Number(mid[i].value);
        var rn = Number(rnum[i].value);
        var consume = Number(consumeNum[i].value);
        var kaf = $.trim(mnum[i].value);
        if (kaf == null || kaf == "" || kaf == '') {
            layer.alert("第" + rn + "行的数量不能为空");
            pass = false;
            return false;
        } else if (kaf.length > 6){
            layer.alert("第" + rn + "行的数量不能超过999999！");
            pass = false;
            return false;
        } else if (kaf < consume){
            layer.alert("第" + rn + "行的留店数量不能小于已消耗数量！");
            pass = false;
            return false;
        }
        var af = Number(mnum[i].value);
        if (af < 0) {
            layer.alert("第" + rn + "行的数量不能小于0");
            pass = false;
            return false;
        }
        purchaseNum += kaf + ',';
        recordId += bf + ',';
    }
    if (pass == true) {
        layer.msg('正在提交。。。', { icon: 16, time: 20000, shade: 0.3 });// 显示进度条

        var cmd = "customer/modifyAccRecordNum";
        var datas = {
            purchaseNum: purchaseNum,
            recordId: recordId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg('提交成功!');
                location.reload();
            } else {
                layer.msg(re.msg);
            }
        })
    }
}

function delConsumeRecord(recordId) {
    layer.confirm('确定删除吗?', function (index) {
        //do something
        var cmd = "customer/deleAccRecord";
        var datas = {
            recordId: recordId
        };
        ajaxAsync(cmd, datas, function (re) {
            if (re.code == 1) {
                layer.msg('删除成功!');
                location.reload();
            } else {
                layer.msg(re.msg);
            }
        })

        layer.close(index);
    });
}

function validateNumber(self) {
    if (self.value.length == 1) {
        self.value = self.value.replace(/[^1-9]/g, '');
    }
    else {
        self.value = self.value.replace(/\D/g, '');
    }
}
// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        headers: {
            apikey: 'test'
        },
        data: {
            cmd: cmd,
            data: data
        },
        beforeSend: function (request) {
            layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.closeAll();
        }
    });
}

function getParams() {
    var url = location.search;
    var param = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return param;
}
//返回值
var callbackdata = function () {
    var buyNum = $('#buyNum').val();
    var returnDate = {
        consumeNum: buyNum
    };
    return returnDate;
}