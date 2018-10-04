(function($){
    var page = 1;
    var rows = 10;
    var operationUserNo = sessionStorage.getItem("userno") || "";
    var USER_URL = {
        CMD : 'operations/chargeLogList', //(查询状态)
        RESOURCESIZE : 'operations/chargeLevelTypeList' //(缴费类型列表)
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
        /* if(endTime<startTime){
         layer.msg("开始时间应早于结束时间哟，请重新选择！");
         //    $('#datetimepicker1').datepicker('setDate',endDate);
         }*/
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
        /*if(endTime<startTime){
         //   $('#datetimepicker2').datepicker('setDate',startTime);
         layer.msg("开始时间应早于结束时间哟，请重新选择！");
         }*/
        $("#datetimepicker2 .datepicker").hide();
    });

    //计费类型
    function getType(){
        var sHtml = "";
        var paramType = "{'page':" + page + ",'rows':" + rows + "}";
        var res = reqAjax(USER_URL.RESOURCESIZE,paramType);
        if(res.code == 1){
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                sHtml += '<option value="' + row.id + '">'+ row.levelName +'</option>';
            };
            $("#payType").append(sHtml);
        }else{
            layer.msg(res.msg);
        }
    };
    getType();

   //列表方法
    function paydetail(res){
        var sHtml = "";
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                sHtml += '<tr>' +
                             '<td>' + (i+1) + '</td>' +
                             '<td>' + row.merchantName + '</td>' +
                             '<td>' + row.levelTypeName + '</td>' +
                             '<td>' + row.amount + '</td>' +
                             '<td>' + row.startTime + '</td>' +
                             '<td>' + row.endTime + '</td>' +
                             '<td>' + row.createUserName + '</td>' +
                             '<td>' + row.createTime + '</td>' +
                             '<td>' + row.remark + '</td>' +
                           '</tr>' ;
            }
            $("#system-table tbody").html(sHtml);
    }

    //初始化列表
    function getDetail(){
        var merchantName =$.trim($("#jurisdiction-name").val());//获取商户名称
        var levelTypeId = $("#payType option:selected").val(); //计费类型
        var startTime = ($("#datetimepicker1").attr('data-time')==undefined?"":$("#datetimepicker1").attr('data-time'));//开始时间
        var staTime = $("#jurisdiction-begin").val();
        var endTime = ($("#datetimepicker2").attr('data-time')==undefined?"":$("#datetimepicker2").attr('data-time'));//结束时间
        var enTime = $("#jurisdiction-end").val();
            var param = "{'page':" + page + ",'rows':" + rows + ",'merchantName':'" + merchantName + "','levelTypeId':'" + levelTypeId + "','startTime':'" + staTime + "','endTime':'" + enTime + "','operationUserNo':" + operationUserNo +"}";
            var res = reqAjax(USER_URL.CMD,param);
            if(res.code == 1){
                paydetail(res);
                var layer = layui.laypage;
                //模拟渲染
                var render = function(data, curr){
                    var arr = []
                        ,thisData = res.data;
                    layui.each(thisData, function(index, item){
                        arr.push('<li>'+ item +'</li>');
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
                            var merchantName = $.trim($("#jurisdiction-name").val());//获取商户名称
                            var levelTypeId = $("#payType option:selected").val(); //计费类型
                            var startTime = ($("#datetimepicker1").attr('data-time')==undefined?"":$("#datetimepicker1").attr('data-time'));//开始时间
                            var staTime = $("#jurisdiction-begin").val();
                            var endTime = ($("#datetimepicker2").attr('data-time')==undefined?"":$("#datetimepicker2").attr('data-time'));//结束时间
                            var enTime = $("#jurisdiction-end").val();
                            var param = "{'page':" + obj.curr + ",'rows':" + rows + ",'merchantName':'" + merchantName + "','levelTypeId':'" + levelTypeId + "','startTime':'" + staTime + "','endTime':'" + enTime + "','operationUserNo':" + operationUserNo +"}";
                            var res=reqAjax(USER_URL.CMD,param);
                            paydetail(res);
                        document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                        $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                    }
                });

            }else{
                layer.msg(res.msg);
            }
    }
    getDetail();

    $("#searchBtn").click(function(){
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