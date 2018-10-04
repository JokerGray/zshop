(function($){
    var page = 1;
    var rows = 10;
    var userno = sessionStorage.getItem("userno") || "";
    var USER_URL = {
        RESOURLIST : 'operations/operationLogList' //(查询状态)
    };

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //日期选择
    $('#datetimepicker1 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = ev.date.valueOf();
        var endTime =  $('#datetimepicker2').attr('data-time');
        $(this).parent().attr('data-time',startTime);
        $("#datetimepicker1 .datepicker").hide();
    });

    $('#datetimepicker2 input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function(ev) {
        var startTime = $('#datetimepicker1').attr('data-time');
        var endTime = ev.date.valueOf();
        $(this).parent().attr('data-time',endTime);
        $("#datetimepicker2 .datepicker").hide();
    });


    //列表方法
    function payDetail(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++) {
            var row = res.data[i];
            sHtml += '<tr>' +
            '<td class="number">' + (i + 1) + '</td>' +
            '<td>' + row.system + '</td>'+
            '<td>' + row.business + '</td>'+
            '<td>' + row.className + '</td>'+
            '<td>' + row.methodName + '</td>'+
            '<td>' + row.parameters + '</td>'+
            '<td>' + row.time + '</td>'+
            '</tr>'
        }
            $("#jurisdiction-table tbody").html(sHtml);
    };

    //列表初始化
    function getDetail(){
        var startTime = ($("#datetimepicker1").attr('data-time')==undefined?"":$("#datetimepicker1").attr('data-time'));//开始时间
        var beginTime = $("#jurisdiction-begin").val();
        var endTime = ($("#datetimepicker2").attr('data-time')==undefined?"":$("#datetimepicker2").attr('data-time'));//结束时间
        var edTime = $("#jurisdiction-end").val();
            var param = {
                page: page,
                rows: rows,
                beginTime: beginTime,
                endTime: edTime
            }
        var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
            var layer = layui.laypage;
            //模拟渲染
            var render = function (data, curr) {
                var arr = []
                    , thisData = res.data;
                layui.each(thisData, function (index, item) {
                    arr.push('<li>' + item + '</li>');
                });
                return arr.join('');
            };

            //调用分页
            layer({
                cont: 'paging-box'
                ,first: false
                ,last: false
                ,prev: '<' //若不显示，设置false即可
                ,next: '>'
                ,pages: Math.ceil(res.total/rows) //得到总页数
                ,total:res.total
                ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                    var page = location.search.match(/page=(\d+)/);
                    return page ? page[1] : 1;
                }()
                ,jump: function(obj,first){
                    var param = {
                        page: obj.curr,
                        rows: rows,
                        beginTime: beginTime,
                        endTime: edTime
                    }
                    var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
                    payDetail(res);
                    document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                    $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                }
            });
    };
    getDetail();
    //搜索
    $("#searchCount").click(function(){
        var startTime = ($("#datetimepicker1").attr('data-time')==undefined?"":$("#datetimepicker1").attr('data-time'));//开始时间
        var endTime = ($("#datetimepicker2").attr('data-time')==undefined?"":$("#datetimepicker2").attr('data-time'));//结束时间
        if(startTime!=""&&endTime==""){
            layer.msg("请选择结束时间");
        }else if(startTime==""&&endTime!=""){
            layer.msg("请选择开始时间");
        }else if(startTime>endTime){
            layer.msg("开始时间必须大于结束时间，请重新选择");
        }else{
            getDetail();
        }
    });


})(jQuery);