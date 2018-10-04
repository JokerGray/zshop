var zNodes = [];
var params;
$(document).ready(function () {
    peopleListInit();
    params = getParams();
    getData();     
});
// 获取小组数据和组成员数据
function getData() {
    var cmd = "fans/getPersonList";
    var datas = {
        merchantId: params.merchantId
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            zNodes = re.data;
            loadData();
        } else {
            layer.msg(re.msg);
        }
    })
}

function loadData() {   
    if (params.sumPeople) {
        var sumPeople = JSON.parse(params.sumPeople);
        getSum(zNodes, sumPeople);
        $('#showPeopleList').bootstrapTable('load', selectList);
        $('#totalSum').text(selectList.length);
    }
}
//制作所有数据的大数组,用于搜索框
var sumList = [];
var selectList = [];
function getSum(arrary,data) {//arrary树状图总数据，data已确认人员
    if(data){
        for (var i = 0; i < arrary.length; i++) {
            if (arrary[i].personList){
                var personList = arrary[i].personList;
                for (var j = 0; j < personList.length; j++){
                    for (var k = 0; k < data.length; k++) {
                        if (data[k] == personList[j].userId){
                            selectList.push(personList[j]);
                        }
                    }
                    sumList.push(personList[j]);
                }           
            }
            if (arrary[i].children){ 
                this.getSum(arrary[i].children,data);
            }
        }
    }
}
//搜索小组成员
$("#searchPeople").on("click", function (e) {
    var peopleKeyWord = $('#memberName').val();
    var keyWordList = [];
    var len = selectList.length;
    for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        if (selectList[i].userName.indexOf(peopleKeyWord) >= 0) {
            keyWordList.push(selectList[i]);
        }
    }
    $('#showPeopleList').bootstrapTable('load', keyWordList);
});
// 已选人员操作
function peopleListInit() {
    $('#showPeopleList').bootstrapTable({
        striped: true,
        sortable: false,
        columns: [{
                field: 'Number',
                title: '序号',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            { field: 'userName', title: '姓名', align: 'center' },
            {
                field: 'phone', title: '电话号码', align: 'center'
            },
            {
                field: 'detailName', title: '小组', align: 'center'
            },
            {
                field: 'finance', title: '剩余活动经费', align: 'center', formatter: function (val, row, index) {
                    if (val < 0) {
                        return '<span class="red">' + val + '</span>'
                    } else {
                        return val;
                    }
                }
            }
        ]
    });
    $('#showPeopleList').bootstrapTable('hideLoading');
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