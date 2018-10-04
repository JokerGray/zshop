var setting = {
    view: {
        showLine: false,
        showIcon: false,
        dblClickExpand: false,
        addDiyDom: function (treeId, treeNode) {
            var $div = $('<div class="line"></div>');
            var $li = $('#'+treeNode.tId).prepend($div);
            $div.append($('#'+treeNode.tId+'_switch')).append($('#'+treeNode.tId+'_check')).append($('#'+treeNode.tId+'_a'))
            var num = parseInt(Math.random()*20)+10;
            $('#'+treeNode.tId+'_a').after('<span class="num">'+num+'人</span>')
        }
    },
    edit: {
        enable: true,
        showRemoveBtn: true,
        showRenameBtn: true,
        renameTitle: '编辑',
        removeTitle: '删除',
        drag: {
            autoExpandTrigger: true
        }
    },
    callback: {
        onClick: function () {
            $.fn.zTree.destroy('ptree');
            var arr = [];
            for (var i = 0; i < parseInt(Math.random()*10 + 20); i++) {
                arr.push({name: '姓名'+Math.random()})
            }
            $.fn.zTree.init($("#ptree"), pSetting, arr);
        },
        beforeDrop: function(treeId, treeNodes, targetNode, moveType){
            return treeId == 'tree';
        }
    }
};
var pSetting = {
    view: {
        showLine: false,
        showIcon: false,
        addDiyDom: function (treeId, treeNode) {
            $('#'+treeNode.tId+'_switch').remove();
            var $a = $('#'+treeNode.tId+'_a');
            var $span = $a.find('span');
            var $col1 = $('<div class="col-md-3 text-left"></div>').append($span);
            var $col2 = $('<div class="col-md-3 text-center"></div>').append('<span>成员</span>');
            var $col3 = $('<div class="col-md-3 text-center"></div>').append('<span>123123<i class="glyphicon glyphicon-search"></i></span>');
            var $col4 = $('<div class="col-md-3 text-center"></div>').append('<span><button class="btn btn-link text-info">移组</button> | <button class="btn btn-link text-danger">删除</button></span>');
            $a.addClass('row').append($col1).append($col2).append($col3).append($col4);
        }
    },
    edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
    },
    callback: {
        beforeDrop: function(treeId, treeNodes, targetNode, moveType){
            var targetTree = $.fn.zTree.getZTreeObj(treeId);
            var $pTree = $.fn.zTree.getZTreeObj('ptree');
            // 只有移入对应节点才算数
            if(treeId == 'tree' && targetNode && moveType == 'inner') {
                for(var i=0; i<treeNodes.length; i++){
                    $pTree.removeNode(treeNodes[i]);
                }
                targetNode.name = Math.random();
                targetTree.selectNode(targetNode);
                targetTree.updateNode(targetNode);
                var $num = $('#'+targetNode.tId).find('>.line .num');
                var num = parseInt($num.text().split('人')[0]) || 0;
                $num.text((num + treeNodes.length)+ '人');
            }
            return false;
        }
    }
}

var zNodes = [{ "name": "小组1", "open": true, "children": [{ "name": "小组11", "children": [{ "name": "小组111" }, { "name": "小组112" }, { "name": "小组114" }, { "name": "小组节点114" }] }, { "name": "小组12 - 折叠", "children": [{ "name": "小组节点121" }, { "name": "小组节点122" }, { "name": "小组节点123" }, { "name": "小组节点124" }] }, { "name": "小组13 - 没有子节点", "isParent": true }] }, { "name": "小组2 - 折叠", "children": [{ "name": "小组21 - 展开", "open": true, "children": [{ "name": "小组节点211" }, { "name": "小组节点212" }, { "name": "小组节点213" }, { "name": "小组节点214" }] }, { "name": "小组22 - 折叠", "children": [{ "name": "小组节点221" }, { "name": "小组节点222" }, { "name": "小组节点223" }, { "name": "小组节点224" }] }, { "name": "小组23 - 折叠", "children": [{ "name": "小组节点231" }, { "name": "小组节点232" }, { "name": "小组节点233" }, { "name": "小组节点234" }] }] }, { "name": "小组3 - 没有子节点", "isParent": true }];
var personNodes = [];
for (var i = 0; i < 10; i++) {
    personNodes.push({name: '姓名'+i})
}
$(document).ready(function () {
    getData();
    $('#ptree').on('click', 'i.remove', function(){
        console.log($(this).attr('class'))
    })
});

// 获取小组数据和组成员数据
function getData(){
    var loadingIndex = layer.msg('加载中……', {icon: 16, time: 0, shade: [0.5, '#fff']})
    var def = ajaxAsync({
        cmd: '',
        data: JSON.stringify({}),
        version: 3,
    }, sessionStorage.apikey || 'test');
    def.then(createTree);
    def.fail(createTree);
    def.done(function(){
        layer.close(loadingIndex)
    })
}

function createTree(data){
    var $ztree = $.fn.zTree.init($("#tree"), setting, zNodes);
    var $ptree = $.fn.zTree.init($("#ptree"), pSetting, personNodes);
    $('#tree a').first().click();
    $ztree.expandAll(true);
}

// 弹出新增小组界面
function newTeam() {
    layer.open({
        type: 2,
        title: '新增小组',
        area: ['750px', '500px'],
        content: 'add.html',
        btn: ['确定', '取消']
    })
}

// 通用异步请求
function ajaxAsync(params, apikey) {
    var def = $.Deferred();
    $.ajax({
        // url: '/zxcity_restful/ws/rest',
        url: '',
        type: 'post',
        dataType: "json",
        headers: {
            apikey: apikey
        },
        data: params,
        success: function(data) {
            def.resolve(data)
        },
        error: function(err) {
            layer.msg('连接失败！请检查网络或稍后再试！', {icon: 2});
            def.reject(err);
        }
    });
    return def;
}