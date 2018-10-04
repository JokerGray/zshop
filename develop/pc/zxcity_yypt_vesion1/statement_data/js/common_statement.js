//下拉菜单
$(".content-body").on("click",".dropdown",function(){
    $(this).next("ul").toggle();
});
$(".button-box").on("mouseleave",function(){
    $(this).find("ul").hide();
});

datetime('#datetimepicker2 input');
datetime('#datetimepicker3 input');

//获取时间格式化
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//日期控件
function datetime(e){
    $(e).datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = ev.date.valueOf();
        $(this).parent().attr('data-time',startTime);
    });
}

//点击跳转到相应的页面
$(".menu-top").on("click","ul li",function(){
    var index = $(this).index();
    switch(index)
    {
        case 0:
            window.top.admin.current("statement_data/statement_data.html?v=" + new Date().getMilliseconds());
            break;
        case 1:
            window.top.admin.current("statement_service/statement_service.html?v=" + new Date().getMilliseconds());
            break;
        case 2:
            window.top.admin.current("statement_phone/statement_phone.html?v=" + new Date().getMilliseconds());
            break;
        case 3:
            window.top.admin.current("statement_repository/statement_repository.html?v=" + new Date().getMilliseconds());
            break;
        default:
            window.top.admin.current("statement_analyze/statement_analyze.html?v=" + new Date().getMilliseconds());
    }
});


