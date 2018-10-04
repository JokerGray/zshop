function setData(arr){
    for(var i=0; i<arr.length; i++){
    var dom = $('.myTask').eq(0).clone().show();
    $('.phone_content').append(dom);
    console.log(dom);
    // dom.data(arr[i]);
    dom.find('.shopName span').text(arr[i]['shopName']);
    dom.find('.categoryUrl').attr('src', arr[i]['categoryUrl']);

    dom.find('.categoryName').text(arr[i]['categoryName']);
    dom.find('.serviceName').text(arr[i]['serviceName']).attr('title', arr[i]['serviceName']);
    
    if(arr[i]['resourceList'].length > 0 && arr[i]['resourceList'][0]['resourceUrl'].length> 0) {
        dom.find('.resourceUrl').attr('src', arr[i]['resourceList'][0]['resourceUrl']);
    }
    dom.find('.orderNumber').text(arr[i]['orderNumber']);
    dom.find('.servicePrice').text(arr[i]['servicePrice']);
    dom.find('.serviceUnit').text(arr[i]['serviceUnit']);
    var xxx=arr[i]['isOn'];
    console.log(xxx);
     if(xxx===1){
        dom.find('.serviceUnit').text(arr[i]['serviceUnit']);
     }
}
}
$(document).ready(tableInit);
function tableInit(){
$('#tablelist').bootstrapTable({
url: '/zxcity_restful/ws/rest',
method: 'post',
ajaxOptions:{
    headers:{
        apikey: 'test'
    }
},
contentType: "application/x-www-form-urlencoded",
queryParams: function(params){
    var p = {
        cmd: 'newservice/getUserSkillList',
        data: JSON.stringify({
            "userId": 17,
            "skillType": 0,
            "shelfStatus": 1,
            "pagination": {
            "page": 1,
            "rows": 10
            }
        }),
        version: 3
    }
    return p;
},
responseHandler: function(res){
    res.rows = res.data
    console.log(res.rows);
    return res;
},
sidePagination: "server",
pageNumber:1,
pageSize: 10,
pageList: [10, 25, 50, 100],
striped: true,
pagination: true,
sortable: false,
cardView: false,
detailView: false,
columns: [
    { field: 'serviceId', title: '编号', width: 200, align: 'center',formatter:function(val,row,index){
            return index+1;
    }},
    { field: 'serviceName', title: '名称分类', width: 150, align: 'center' },
    // formatter: function (val, row, index) { return val.substr(0, 18)+'...'}
    { field: 'userName', title: '技能发布人', width: 100, align: 'center' },
    { field: 'servicePrice', title: '服务价格', width: 100, align: 'center', formatter: function(val, row, index){
        console.log(row)
        return row.servicePrice +" / "+row.serviceUnit;
    }},
    { field: 'isOn', title: '技能状态', width: 100, align: 'center',formatter:function(val,row,index){
            if(row.isOn ===1){
                return "开启中";
            }else{
                return "已关闭";
            }
    }},
    { field: 'serviceId', title: '操作', width: 100, align: 'center',formatter: function(val, row, index){ return '<button type="button" class="btn btn-danger btn-xs" onclick="clickBtn(this)">查看</button>'}}
],
onClickRow: clickRow
});
// 按钮点击
$('#table').on('click', 'button.btn', function (e) {
var dataAll = $('#table').bootstrapTable('getData');
var index = $(this).parent().parent().index();
console.log('监听table的按钮点击');
// console.log(dataAll[index]);
});
}
// 列表点击事件
function clickRow(row, $element){
console.log('列点击');
// console.log(row)
}
// 另一种按钮点击事件
function clickBtn(btn) {
var dataAll = $('#table').bootstrapTable('getData');
var index = $(btn).parent().parent().index();
console.log('直接写入点击');
}
function reqAjax(cmd, data){
// var loadIndex=layer.load();
setTimeout(function(){
    // layer.close(loadIndex);
},5000);
var deferred = $.Deferred();
$.ajax({
    type:"post",
    dataType: 'json',
    url:"/zxcity_restful/ws/rest",
    headers: {
        apikey: sessionStorage.getItem('apikey') || 'test'
    },
    data: {
        cmd: cmd,
        data: JSON.stringify(data),
        version: 3 // 版本号根据情况默认
    },
    success: function(data){
        // layer.close(loadIndex);
        deferred.resolve(data)
    },
    error: function(){
        // 这里的 error 一般都是网络问题，500了也检查不出来
        // layer.close(loadIndex);
        toast('连接出错，请检查网络或稍后再试！');
        deferred.reject()
    }
});
return deferred;
}
var def = reqAjax('newservice/getUserSkillList',{
"userId": 17,
"skillType": 0,
"shelfStatus": 1,
"pagination": {
    "page": 1,
    "rows": 10
}
});
def.then(function(data){
console.log(data);
console.log(data.length);

setData(data.data);
});
$('.statusContent span').click(function(){
    if($(this).hasClass('active')) return;
    $(this).addClass('active').siblings().removeClass('active');
});
$('.Ican-list>.btn1').click(function(){
    if($(this).hasClass('active1')) return;
    if(!$(this).hasClass('active1')){
        $(this).addClass('active1');
        $(this).siblings().removeClass('active1');
    };
    if($(this).children().hasClass('active2')) return;
    if(!$(this).children().hasClass('active2')){
        $(this).children().addClass('active2');
        $(this).siblings().children().removeClass('active2');
    };
});