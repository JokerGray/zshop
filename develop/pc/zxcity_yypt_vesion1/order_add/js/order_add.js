(function($){
    var page = 1;
    var rows = 12;//状态  0： 未分配；1：处理中；2：已解决；3：不解决
    var colltid=[];
    var colltname=[];
    var username = yyCache.get('username');
    var operater = yyCache.get("pcNickname",""); //用户昵称
    var operaterId = yyCache.get("userId",""); //登陆者id
    var organizationId = yyCache.get("organizationId",""); //所属组织机构id
    var USER_URL = {
        SERVICESTAFF : 'operations/customerServiceStaffs', //(客服人员)
        ADDORDER : 'operations/newTicket' //创建工单
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    });

    //初始化
    $(function(){
        datetime('#datetimepicker2 input');
        datetime('#datetimepicker3 input');
        $("#createName").val(operater);
    });

    //富文本编辑器
    var editor = initEditor("editor");

    //返回工单首页通用方法
    function returnIndex(){
        window.top.admin.current("order/order.html?v=" + new Date().getMilliseconds());
        window.top.admin.save();
    }

    //新建工单点击取消
    $("#cancelBtn").on("click",function(){
        returnIndex();
    });

    //点击我的工单
    $("#myOrder").on("click",function(){
        returnIndex();
    });

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





    //新增优先级切换
    form.on('radio(levelradio)', function(data){
        $("#statuName").attr("data-statu",data.value)
    });

    //新建工单保存
    form.on('submit(saveBtn)',function(data) {
        if (data) {
            var content= editor.txt.html();//富文本内容
            if(content==="<p><br></p>" || content==="<p>&nbsp;</p>"){
                layer.msg("工单描述不能为空哟",
                    function(index){
                        layer.close(index);
                    });
                return false;
            }
            var priority = $("#statuName").attr("data-statu") ||0;//优先级 0 低 1 中 2 高 3 急
            var status;//状态  0： 未分配；1：处理中；2：已解决；3：不解决
            var categoryId = $("#order-classifyname").attr("data-id")||"";//类别id
            var plateId = $("#order-platename").attr("data-id");//板块id
            var title = $.trim($("#title").val());// 标题
            var createrId = yyCache.get("userId","");//创建人id
            var dueTime = $("#jurisdiction-begin2").val();// 到期时间
            var endTime = $("#jurisdiction-begin3").val();//解决时间
            var phone =$.trim($("#phone").val()); // 联系方式
            var handlerId = $("#ctronlUser").find("dl dd.layui-this").attr("lay-value") || "";//处理人id
           var copyId = colltid.join(",");//抄送id
            if(phone!=""){
                $("#phone").attr("lay-verify","phone");
            }
            var param={
                "priority": priority, //优先级 0 低 1 中 2 高 3 急
                "categoryId":categoryId,//类别id
                "plateId":plateId,//版块id
                "title": title, // 标题
                "content": content,//内容
                "createrId": createrId, //创建人id
                "dueTime": dueTime, // 到期时间
                "endTime": endTime, //解决时间
                "phone": phone, // 联系方式
                "handlerId": handlerId,//处理人id
                "copyId": copyId,//抄送
                "organizationId": organizationId//所属组织机构id
            }


            if(handlerId!=""){
                param.status="1";//状态 0： 未分配； 1：待回复；2：处理中；3已解决；4：不解决
            }else{
                param.status="0";
            }
            reqAjaxAsync(USER_URL.ADDORDER,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    layer.msg(res.msg);
                    returnIndex();
                }else{
                    layer.msg(res.msg);
                }
            })
        }
        return false;
    });


    //选择处理人
    form.on('select(allot)', function(data){
        var val = data.value;
        var text = $(this).text();
        if(colltid.length>0){
            if(colltid.toString().indexOf(val) > -1){

            }else{
                colltid.push(val);
                colltname.push(text);
            }
        }else{
            colltid.push(val);
            colltname.push(text);
        }
        $("#copyUser input").val(colltname.join(","));
    });

})(jQuery);