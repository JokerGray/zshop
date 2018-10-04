var tempNode = '';
var tempList = [];
var zNodes = [];
var params;
$(document).ready(function () {
    tableInit();
    peopleListInit();
    searchInit();
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
            eachAllCheck(zNodes);
            createTree();
            loadData();
        } else {
            layer.msg(re.msg);
        }
    })
}
var setting = {
    view: {
        showLine: false,
        showIcon: false,
        dblClickExpand: false,
        addDiyDom: function (treeId, treeNode) {
            var $div = $('<div class="line"></div>');
            var $li = $('#'+treeNode.tId).prepend($div);
            $div.append($('#'+treeNode.tId+'_switch')).append($('#'+treeNode.tId+'_check')).append($('#'+treeNode.tId+'_a'))
            var num = treeNode.personList.length;
            $('#'+treeNode.tId+'_a').after('<span class="num"><span class="selectNum">0</span>/'+num+'</span>')
        }
    },
    check: {
        autoCheckTrigger:false,
        chkboxType : {'Y':'','N': ''},
        enable: true,
        nocheckInherit: false,
        chkDisabledInherit: false,
        radioType: 'level'
    },
    callback: {
        beforeCheck: function (event, treeId, treeNode) {
            return false;
        },
        onClick: function (event,treeId,treeNode) {
            tempNode = treeNode;
            $('#tree').find('.line').removeClass('active');
            $('#' + treeNode.tId + '_a').parent('.line').addClass('active');
            tempList = treeNode.personList;
            // for (var i = 0; i < tempList.length; i++) {
            //     tempList[i].checked = 'checked';
            // }
            console.log(tempList)
            $('#showList').bootstrapTable('load', tempList);         
        },
        cancelSelectedNode: function (treeNode) {
            console.log(treeNode)
        }
    }
};
//制作tree
function eachAllCheck(data) {
    var dataItem = data;
    var arrary = [];
    if (!isArray(dataItem)) {
        arrary.push(dataItem);
    } else {
        arrary = dataItem;
    }
    for (var i = 0; i < arrary.length; i++) {
        if (arrary[i].children){
            if (arrary[i].detailName) {
                arrary[i].isParent = true;
                arrary[i].name = arrary[i].detailName;
                arrary[i].id = arrary[i].detailId;
            }  
            for (var k = 0; k < arrary[i].children.length; k++){
                this.eachAllCheck(arrary[i].children[k]);
            }                   
        }else{
            if (arrary[i].detailName){
                arrary[i].name = arrary[i].detailName;
                arrary[i].id = arrary[i].detailId;
            }
        }
    }
}
//制作所有数据的大数组,用于搜索框
var sumList = [];
function getSum(arrary,data) {//arrary树状图总数据，data已确认人员
    if(data){
        for (var i = 0; i < arrary.length; i++) {
            if (arrary[i].personList){
                var personList = arrary[i].personList;
                for (var j = 0; j < arrary[i].personList.length; j++){
                    for (var k = 0; k < data.length; k++) {
                        if (data[k] == arrary[i].personList[j].userId){
                            arrary[i].personList[j].checked = true;
                            selectList.push(arrary[i].personList[j]);
                            //初始化树形图选中
                            var tId = String(arrary[i].personList[j].personCircleId)
                            var thisNode = treeObj.getNodeByParam("id", tId, null);
                            treeObj.checkNode(thisNode, true, false);
                            var num = Number($('#' + thisNode.tId + '_a').siblings('.num').children('.selectNum').text());
                            if (num < arrary[i].personList.length){
                                num++;
                            }
                            $('#' + thisNode.tId + '_a').siblings('.num').children('.selectNum').text(num);
                            for (var g = 0; g < thisNode.personList.length; g++) {
                                if(data[k] == thisNode.personList[g].userId){
                                    thisNode.personList[g].checked = true;
                                }
                            }
                            treeObj.updateNode(thisNode);
                        }
                        // }else{
                        //     arrary[i].personList[j].checked = false;
                        // }
                    }
                    sumList.push(arrary[i].personList[j]);
                }           
            }
            if (arrary[i].children){ 
                this.getSum(arrary[i].children,data);
            }
        }
    }else{
        for (var i = 0; i < arrary.length; i++) {
            if (arrary[i].personList) {
                var personList = arrary[i].personList;
                for (var j = 0; j < personList.length; j++) {
                    personList[j].checked = false;
                    sumList.push(personList[j]);
                }
            }
            if (arrary[i].children) {
                this.getSum(arrary[i].children);
            }
        }
    }
    
}
//根据传入已选人员编辑
function initList(data) {
    var dataItem = data;
    selectList = dataItem; //已选人员修改
    //大数组修改
    for (var i = 0; i < dataItem.length;i++){
        for (var j = 0; j < sumList.length; j++) {
            if (dataItem[i].userId == sumList[j].userId){
                sumList[j].checked = true;
            }
            
        }
    }
    //树状图修改
    
}
//已参加人列表修改
var selectList = [];
function updateSelectTable(data,status) {
    var dataItem = data;
    if (status == 'add'){
        for (var i = 0; i < dataItem.length; i++) {
            selectList.push(dataItem[i]);
        }           
    } else if(status == 'reduce'){
        if (dataItem.personList) {
            for (var i = 0; i < dataItem.personList.length; i++) {
                for (var k = 0; k < selectList.length; k++) {
                    if (dataItem.personList[i].userId == selectList[k].userId) {
                        selectList.splice(k, 1);
                        k = k - 1;
                    }
                }
            }
        }
        if (dataItem.children) {
            for (var j = 0; j < dataItem.children.length; j++) {
                this.updateSelectTable(dataItem.children[j],'reduce');
            }
        }
    }   
}
//根据临时表格刷新视图
function updateTree() {
    var showList = $("#showList").bootstrapTable('getSelections');
    if (showList.length > 0){
        $('#' + tempNode.tId + '_a').siblings('.num').children('.selectNum').text(showList.length);
        treeObj.checkNode(tempNode, true, false);
    }else{
        $('#' + tempNode.tId + '_a').siblings('.num').children('.selectNum').text(0);
        treeObj.checkNode(tempNode, false, false);
    }
    $('#showPeopleList').bootstrapTable('load', selectList);
    $('#totalSum').text(selectList.length);
    for (var i = 0; i < sumList.length; i++) {
        sumList[i].checked = false;
        for (var j = 0; j < selectList.length; j++) {
            if (sumList[i].userId == selectList[j].userId) {
                sumList[i].checked = true;
            }
        }
    }
}
//刷新树状图和已参加视图
function updateView2(node,userId,status) {
    $('#showPeopleList').bootstrapTable('load', selectList);
    $('#totalSum').text(selectList.length);
    var num = Number($('#' + node.tId + '_a').siblings('.num').children('.selectNum').text());
    if (status == 'add'){
        treeObj.checkNode(node, true, false);
        for(var i = 0;i < node.personList.length; i++){
            if (node.personList[i].userId == userId){
                node.personList[i].checked = true;
            }
        }
        if (num < node.personList.length){
            num++;
        }
        $('#' + node.tId + '_a').siblings('.num').children('.selectNum').text(num);
        // for (let i = 0; i < sumList.length; i++) {
        //     if(sumList[i].userId == userId){
        //         sumList[i].checked = true;
        //     }        
        // }
    }else{
        for (var i = 0; i < node.personList.length; i++) {
            if (node.personList[i].userId == userId) {
                node.personList[i].checked = false;
            }
        }
        if(num > 1){
            num--;
        }else{
            num == 0;
            treeObj.checkNode(node, false, false);
        }
        $('#' + node.tId + '_a').siblings('.num').children('.selectNum').text(num);
        // for (let i = 0; i < sumList.length; i++) {
        //     if (sumList[i].userId == userId) {
        //         sumList[i].checked = false;
        //     }
        // }
    }
    // $('#searchList').bootstrapTable('load', sumList);
    $('#showList').bootstrapTable('load', []);
}

var treeObj = '';
function createTree(data) {
    var $ztree = $.fn.zTree.init($("#tree"), setting, zNodes);
    treeObj = $.fn.zTree.getZTreeObj("tree");
    // $('#tree a').first().click();
    $ztree.expandAll(true);
}
function loadData() {
    // setTimeout(() => {
    if (params.sumPeople) {
        var sumPeople = JSON.parse(params.sumPeople);
        getSum(zNodes, sumPeople);
        $('#showPeopleList').bootstrapTable('load', selectList);
        $('#totalSum').text(selectList.length);
        // initList(params.sumPeople);
    } else {
        getSum(zNodes);
    }
    // }, 0);
}
//搜索小组成员
$("#searchPeople").on("click", function (e) {
    var peopleKeyWord = $('#memberName').val();
    var keyWordList = [];
    var len = sumList.length;
    for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        if (sumList[i].userName.indexOf(peopleKeyWord) >= 0) {
            keyWordList.push(sumList[i]);
        }
    }
    $('#searchList').bootstrapTable('load', keyWordList);
    $(".search-box").show();
    $(document).on("click", function () {
        $(".search-box").hide();
    });
    e = e || event;
    stopFunc(e);
});
$('#searchList').on("click", function (e) {
    e = e || event;
    stopFunc(e);
});
function stopFunc(e) {
     e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}
// 搜索人员表格初始化
function searchInit() {
    $('#searchList').bootstrapTable({
        clickToSelect: true,
        striped: true,
        sortable: false,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'checked',
            checkbox: true
            // formatter: function (value, row, index) {
            //     if (row.state == true)
            //         return {
            //             checked: true//设置选中
            //         };
            //     return value;
            // }
        },
        { field: 'userName', title: '姓名', width: '20%', align: 'center' },
        {
            field: 'phone', title: '电话号码', width: '30%', align: 'center'
        },
        {
            field: 'detailName', title: '小组', width: '20%', align: 'center'
        },
        {
            field: 'finance', title: '剩余活动经费', width: '30%', align: 'center', formatter: function (val, row, index) {
                if(val < 0){
                    return '<span class="red">' + val + '</span>'
                }else{
                    return val;
                }
            }
        }],
        onCheckAll: function (rows) {
            for (var i = 0; i < rows.length; i++) {
                var tId = String(rows[i].personCircleId)
                var thisNode = treeObj.getNodeByParam("id", tId, null);
                for (var j = 0; j < selectList.length; j++) {
                    if(rows[i].userId == selectList[j].userId){
                        selectList.splice(j, 1);
                        j = j - 1;
                        continue;
                    }
                }
                selectList.push(rows[i]);
                updateView2(thisNode,rows[i].userId,'add');
            }
        },
        onUncheckAll: function (rows) {
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < selectList.length; j++) {
                    if (rows[i].userId == selectList[j].userId) {
                        var tId = String(rows[i].personCircleId)
                        var thisNode = treeObj.getNodeByParam("id", tId, null);
                        selectList.splice(j, 1);
                        j = j - 1;
                        updateView2(thisNode, rows[i].userId,'reduce');
                    }
                }
            }
        },
        onCheck: function (row) {
            selectList.push(row);
            var tId = String(row.personCircleId)
            var thisNode = treeObj.getNodeByParam("id", tId, null);
            updateView2(thisNode,row.userId,'add');
        },
        onUncheck: function (row) {
            for (var j = 0; j < selectList.length; j++) {
                if (row.userId == selectList[j].userId) {
                    selectList.splice(j, 1);
                    j = j - 1;
                }
            }
            var tId = String(row.personCircleId)
            var thisNode = treeObj.getNodeByParam("id", tId, null);
            updateView2(thisNode,row.userId,'reduce');
        }
    });
    $('#searchList').bootstrapTable('hideLoading');
}
// 暂存查询表格初始化
function tableInit() {
    $('#showList').bootstrapTable({
        clickToSelect: true,
        selectItemName: 'btSelectItem',
        columns: [{
            field: 'checked',
            checkbox: true
        }, {
            field: 'userName',
            title: '姓名'
        }, {
            field: 'phone',
            title: '电话'
        }],
        onCheckAll: function (rows) {
            console.log(rows)
            for (var i = 0; i < rows.length; i++) {
                rows[i].checked = true;
                if (selectList.length >= 1){
                    for (var j = 0; j < selectList.length; j++) {
                        if(rows[i].userId !== selectList[j].userId){
                            selectList.push(rows[i]);
                            j = selectList.length;
                        }
                    }
                }else{
                    selectList.push(rows[i])
                }
            }
            updateTree()
        },
        onUncheckAll: function (rows) {
            for (var i = 0; i < rows.length; i++) {
                rows[i].checked = false;
                for (var j = 0; j < selectList.length; j++) {
                    if (rows[i].userId == selectList[j].userId) {
                        selectList.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
            updateTree()
        },
        onCheck: function (row) {
            row.checked = true;
            selectList.push(row);
            updateTree();
        },
        onUncheck: function (row) {
            row.checked = false;
            for (var j = 0; j < selectList.length; j++) {
                if (row.userId == selectList[j].userId) {
                    selectList.splice(j, 1);
                    j = j - 1;
                }
            }
            updateTree();
        }
    });
    $('#showList').bootstrapTable('hideLoading');
}
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
            },
            {
                field: 'orderId', title: '操作', align: 'center', formatter: function (val, row, index) {
                    var people = JSON.stringify(row);
                    var showDetail = "<span class='btn-unselect' onclick='cancelSelect(" + people + ")'>取消参与资格</span>";
                    return showDetail;
                }
            }
        ]
    });
    $('#showPeopleList').bootstrapTable('hideLoading');
}
function cancelSelect(row) {
    layer.confirm('确认取消' + row.userName + '的参与资格？', {
        btn: ['确认', '取消'] //按钮
    }, function () {
        for (var j = 0; j < selectList.length; j++) {
            if (row.userId == selectList[j].userId) {
                selectList.splice(j, 1);
                // j = j - 1;
            }
        }
        var tId = String(row.personCircleId)
        var thisNode = treeObj.getNodeByParam("id", tId, null);
        updateView2(thisNode, row.userId, 'reduce');
        layer.msg('取消成功！', { icon: 1 });
    });
}
function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
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
    var params = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
}
$('#titleName').click(function () {
    $(this).addClass('active');
    $('#titleSum').removeClass('active');
    $('#selectAdd').css('display', 'block');
    $('#selectEdit').css('display', 'none');
})
$('#titleSum').click(function () {
    $(this).addClass('active');
    $('#titleName').removeClass('active');
    $('#selectAdd').css('display', 'none');
    $('#selectEdit').css('display', 'block');
})
//返回值
var callbackdata = function () {
    var sumNum = $('#totalSum').text();
    var dataList = [];
    var circleList = [];
    for (let i = 0; i < selectList.length; i++) {
        dataList.push(selectList[i].userId);       
        circleList.push(selectList[i].personCircleId);  
    }
    var returnDate ={
        sumNum: sumNum,
        selectList: dataList,
        circleList: circleList
    };
    return returnDate;
}