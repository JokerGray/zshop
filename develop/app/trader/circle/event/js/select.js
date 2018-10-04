
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

var options = {
    url: "/zxcity_restful/ws/rest",      // 数据接口url
    cmd: 'circle/listAllMyCircleInfo',
    pageSize: 10, // 每次加载的数据条数
    value: "id",  // 下拉框value字段名称
    name: "circleName", // 下拉框显示字段名称
    selected: []  // 默认选中项，格式：[{id:1,text:"选项1"},{id:2,text:"选项2"}]
};
var value = options["value"];
var name = options["name"];
var cmd = options["cmd"];
var userId = getUrlParam('userId')
// $("select").not('#department').select2({    //当给所有select2 初始化的时候 不能包括当前的
//     language:"zn-CN",
//     placeholder:'请选择',
//     allowClear: true,//可以清除选项
// });

$('#circleId').select2({
    placeholder: '请选择圈子',
    language: "zh-CN",
    // data:[{ id: employeeId, text: partmentName}],  //  默认值填写  value 是id  text:是名字 不能使用其他字段
    // inputMessage:'信息科',
    ajax: {
        url: options["url"],
        type: "post",
        dataType: "json",
        delay: 250,
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: function(params){
            // 传递到后端的参数
            return {
                // 搜索框内输入的内容
                // selectInput: params.term,
                // 当前页
                // page: params.page || 0,
                // 每页显示多少条记录，默认10条
                // row: 10,
                cmd: cmd,
                data: JSON.stringify({
                            isJoin: 2,
                            page: params.page || 0,
                            row: 10,
                            userId: userId,
                            keyWord: params.term
                        }), 
            };
        },
        
        processResults: function (data, params) {
            params.page = params.page || 0;
            var d_l = data.data;
            return {
                results: d_l,
                pagination: {
                    more: (params.page) < data.total
                }
            };
        },
        cache: true
    },
    escapeMarkup: function (markup) {
        return markup;
    },
    templateResult: function (repo) {
        if (repo.loading) {
            return repo.text;
        } else {
            return repo.circleName;      //circleName select2的value值   根据自己情况定义
        }
    //     if (repo.loading)
    //     return repo.text;
    //    var markup = repo.circleName;
    //    var markup = "<p class='select2-result-repository clearfix'>" + "<p class='select2-result-repository__avatar'></p>" + "<p class='select2-result-repository__meta'>"
    //      + "<p class='select2-result-repository__title'>" + repo.circleName + "</p>";
    //    return markup;
    },
    templateSelection: function (data) {
        return data.circleName||data.text;
    }
});
