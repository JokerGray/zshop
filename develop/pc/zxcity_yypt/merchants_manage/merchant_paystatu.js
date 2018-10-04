(function($){
    var page = 1;
    var rows = 10;
    var operationUserNo = sessionStorage.getItem("userno") || "";
    var USER_URL = {
        RESOURLIST : 'operations/chargeMerchantStatusList', //(查询状态)
        ADDRESOURCE : 'operations/chargeRenewing',//(续费)
        UPDATERESOURCE :'operations/chargeStatusToggle',//(缴费状态启用/停用0-暂停 1-启用)
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
    function payDetail(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            sHtml += '<tr data-levelid="' + row.levelTypeId + '" data-id="' + row.id + '">' +
                        '<td>' + (i+1) + '</td>' +
                        '<td>' + row.merchantName + '</td>' +
                        '<td class="levelName">' + row.levelName + '</td>' +
                        '<td>' + row.endTime + '</td>' +
                        '<td>' + row.createUserName + '</td>' +
                        '<td>' + row.createTime + '</td>' +
                        '<td class="statu-tr" data-status="' + row.merchantStatus + '" data-merchantId="' + row.merchantId + '">'
                            if(row.merchantStatus == 0){
                            sHtml +=  '<a class="statu-control">已锁定</a>' ;
                            }else if(row.merchantStatus == 1){
                                sHtml +=  '<a class="statu-control">已启用</a>' ;
                            }
            sHtml +=   '</td>' +
                      '</tr>'
        }
        $("#system-table tbody").html(sHtml);
    };

    //列表初始化
    function getDetail(){
        var merchantName = $.trim($("#jurisdiction-name").val());//获取商户名称
        var levelTypeId = $("#payType option:selected").val(); //计费类型
        var status = $("#payLocK option:selected").val(); //是否锁定
        var startTime = ($("#datetimepicker1").attr('data-time')==undefined?"":$("#datetimepicker1").attr('data-time'));//开始时间
        var staTime = $("#jurisdiction-begin").val();
        var endTime = ($("#datetimepicker2").attr('data-time')==undefined?"":$("#datetimepicker2").attr('data-time'));//结束时间
        var edTime = $("#jurisdiction-end").val();

            var param = "{'page':" + page + ",'rows':" + rows + ",'merchantName':'" + merchantName + "','levelTypeId':'" + levelTypeId + "','startTime':'" + staTime + "','endTime':'" + edTime + "','status':'" + status + "','operationUserNo':" + operationUserNo +"}";
            var res = reqAjax(USER_URL.RESOURLIST,param);
            if(res.code == 1){
                payDetail(res);
            }else{
                layer.msg(res.msg);
            }
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
                            var param = "{'page':" + obj.curr + ",'rows':" + rows + ",'merchantName':'" + merchantName + "','levelTypeId':'" + levelTypeId + "','startTime':'" + staTime + "','endTime':'" + edTime + "','status':'" + status + "','operationUserNo':" + operationUserNo +"}";
                            var res = reqAjax(USER_URL.RESOURLIST,param);
                            payDetail(res);
                        document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                        $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                    }
                });
    };
    getDetail();

//搜索
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

    //点击表格
    $("#system-table tbody").on('click','tr',function(){
        $("#system-table tbody tr").removeClass("actve");
        $(this).addClass("actve");
    });

    //续费保存方法
    function sub(_index){
        var body = layer.getChildFrame('body');
        var levelTypeId = body.contents().find('#jurisdiction-name').attr("data-levelid");
        var levelTypename =  body.contents().find('#jurisdiction-name').val();
        var id = body.contents().find('#jurisdiction-name').attr("data-id");
        var index = body.contents().find('#jurisdiction-table tbody tr.actve');
        if(levelTypename == ""){
            layer.msg("续费类型不能为空哟");
        }else{
            var paramSave = "{'id':" + id + ",'levelTypeId':" + levelTypeId + ",'userNo':" + operationUserNo +"}";
            var res = reqAjax(USER_URL.ADDRESOURCE,paramSave);
            if(res.code == 1){
                layer.msg("续费成功");
                layer.close(_index);
                getDetail();
            }else{
                layer.msg(res.msg);
            }
        }

    }

    //点击续费
    $("#add-users").click(function(){
        var id = $("#system-table tr.actve").attr("data-id");//获取选中id
        var index = $("#system-table tr.actve").index();
        var levelName = $("#system-table tr.actve").find(".levelName").text();
        var levelid = $("#system-table tr.actve").attr("data-levelid");
        var lens = $("#system-table tbody tr").length;
       if(index == '-1'){
            layer.msg("请选择要编辑的行");
        }else if(lens == 0){
           layer.msg("暂无数据无法续费");
       } else{
            layer.open({
                type: 2,
                title: ['商户续费', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['1024px', '568px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'renew.html',
                btn: ['保存'],
                btnAlign: 'c',
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.contents().find("#jurisdiction-name").val(levelName);
                    body.contents().find("#jurisdiction-name").attr("data-levelid",levelid);
                    body.contents().find("#jurisdiction-name").attr("data-id",id);
                },
                yes: function (index) {
                    sub(index);
                }
            });
       }
    });

    //锁定/启用
    /*$("#system-table").on("click",".statu-tr .statu-control",function(){
        var merchantId = $(this).parent().attr("data-merchantId");
        var acve = $(this).attr("class");
        var val = $(this).text();
        if(acve != "statu-control acve"){
            var paramLock = "{'merchantId':" + merchantId + "}";
            var res = reqAjax(USER_URL.UPDATERESOURCE,paramLock);
            if(res.code == 1){
                $(this).prev().removeClass("acve");
                $(this).next().removeClass("acve");
                $(this).addClass("acve");
            }else{
                layer.msg(res.msg);
            }
        }else{
            layer.msg('当前状态为:【' + val + '】哟~');
        }
    });*/

})(jQuery);
