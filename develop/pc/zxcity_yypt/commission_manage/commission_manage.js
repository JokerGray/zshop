(function($){

    var page = 1;
    var rows = 10;
    var USER_URL = {
        RESOURLIST : 'operations/queryAgentCommissionStrategyPage', //(查询)
        ADDRESOURCE : 'operations/addAgentCommissionStrategy',//(新增)
        UPDATERESOURCE :'operations/modifyAgentCommissionStrategy',//(修改)
        DELRESOURCE :'operations/delAgentCommissionStrategy',//删除
        PACKINFO : 'operations/getAgentCommissionStrategy' //(详情)
    };

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //列表方法
    function tableDetail(res){
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<tr class="system-tr" data-id= "' + row.id + '">' +
                '<td>' + (i + 1) + '</td>'
                if(row.agentType == 1){
                    sHtml += '<td>' + '其他' + '</td>';
                }else if(row.agentType == 2){
                    sHtml += '<td>' + '代理商' + '</td>';
                }else if(row.agentType == 3){
                    sHtml += '<td>' + '合伙人' + '</td>';
                }else if(row.agentType == 4){
                    sHtml += '<td>' + '公司内部人员' + '</td>';
                }
                if(row.upgradeType == 1){
                    sHtml += '<td>' + '升级成合作商户' + '</td>';
                }else if(row.upgradeType == 2){
                    sHtml += '<td>' + '升级成代理商户' + '</td>';
                }
                if(row.billingYear == 1){
                    sHtml += '<td>' + '首年' + '</td>';
                }else if(row.billingYear == 2){
                    sHtml += '<td>' + '次年' + '</td>';
                }
                if(row.applicableLevel == 1){
                    sHtml += '<td>' + '顶级代理' + '</td>';
                }else if(row.applicableLevel == 2){
                    sHtml += '<td>' + '一级代理' + '</td>';
                }
                sHtml += '<td>' + row.billingRatio + '</td>' +
                    '<td>' + row.money + '</td>' +
                '<td class="remove-modifier" width="216px">' +
                    '<div class="controlbtn cagbtn" data-toggle="modal" data-target="#myModalchange">' +
                    '<i class="changeBtn edicticon"></i>修改' +
                    '</div>'+
                    '<div class="controlbtn delBut" data-toggle="modal" data-target="#myModalchange">' +
                    '<i class="glyphicon glyphicon-minus-sign red"></i>删除' +
                    '</div>' +
                '</td>' +
                '</tr>';
            }
            $("#jurisdiction-table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    };



    //初始化列表
    function getDetail(){
        var agentType = $("#agentType").find("option:selected").val();//代理人类型
        var upgradeType = $("#updateType").find("option:selected").val();//升级类型
        var param = {
            page : page,
            rows : rows,
            agentType : agentType,//代理人类型(1.其他 2.代理商 3.合伙人)
            upgradeType : upgradeType//升级类型(1.升级成合作商户  2.升级成代理商户)
        };
        var res = reqAjax(USER_URL.RESOURLIST, JSON.stringify(param));
        tableDetail(res);
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
                var param = {
                    page : obj.curr,
                    rows : rows,
                    agentType : agentType,//代理人类型(1.其他 2.代理商 3.合伙人)
                    upgradeType : upgradeType//升级类型(1.升级成合作商户  2.升级成代理商户)
                };
                var res = reqAjax(USER_URL.RESOURLIST, JSON.stringify(param));
                tableDetail(res);

                document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
            }
        });
    }

    getDetail();

    //点击查询按钮
    $("#searchCount").click(function () {

            getDetail();

    });

    //保存方法
    function sub(type,index,id) {//type为1则新增保存，为2修改保存
        var formData = layer.getChildFrame('body');
        var lists = formData.find('form').find('.layui-form-item');
        var agentType =  formData.find('form').find('#agentTypeSelect').next().find('dd.layui-this').attr("lay-value");//代理人类型(1.其他 2.代理商 3.合伙人)
        var upgradeType = formData.find('form').find('#upgradeTypeSelect').next().find('dd.layui-this').attr("lay-value"); //升级类型(1.升级成合作商户  2.升级成代理商户)
        var billingYear = formData.find('form').find('#billingYear').next().find('dd.layui-this').attr("lay-value"); //计费年(1. 首年  2.次年)
        var applicableLevel = formData.find('form').find('#applicableLevel').next().find('dd.layui-this').attr("lay-value"); //适用级别(1.顶级代理  2.一级代理)
        var billingRatio = $.trim(formData.find('form').find('#systemName').val()); //计费比例(百分比)
        var money = $.trim(formData.find('form').find('#commissionMoney').val()); //缴费金额
        for(var i =0;i<lists.length;i++){
            if(lists.eq(i).find(".layui-input").val() == "-请选择-" || lists.eq(i).find(".layui-input").val() == ""){
                layer.alert(lists.eq(i).find("label").text().replace("：", "")+"不能为空！");
                return;
            }
        }
        var reg = /^0.\d{0,3}[1-9]$/; //以0开头的小数，最多3位小数
            if(!reg.test(billingRatio)){
                layer.alert("请输入以0开头的小数，最多3位小数");
                return;
            }
        var amountExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/; //金额
        if(!amountExp.test(money)){
            formData.find('form').find('#commissionMoney').val("");
            layer.alert("请输入正确的金额");
            return;
        }
        if(type==1){
            var param = {
                agentType : agentType,
                upgradeType : upgradeType,
                billingYear : billingYear,
                applicableLevel : applicableLevel,
                billingRatio : billingRatio,
                money:money
            };
            var res = reqAjax(USER_URL.ADDRESOURCE, JSON.stringify(param));
            if(res.code == 1){
             //   layer.msg("添加成功");
                layer.close(index);
                getDetail();
            }else{
                layer.msg(res.msg);
            }
        }else if(type==2){
            var param = {
                id : id,
                agentType : agentType,
                upgradeType : upgradeType,
                billingYear : billingYear,
                applicableLevel : applicableLevel,
                billingRatio : billingRatio,
                money:money
            };
            var res = reqAjax(USER_URL.UPDATERESOURCE, JSON.stringify(param));
            if(res.code == 1){
             //   layer.msg("修改成功");
                layer.close(index);
                getDetail();
            }else{
                layer.msg(res.msg);
            }
        }
    }

    //新增
    $("#newRole").click(function(){
        layer.open({
            type: 2,
            title: ['新增佣金策略', 'background:#303030;color:#fff;'],
            skin: 'layer-ext-myskin',
            area: ['800px', '668px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'addcommission.html',
            btn: ['保存'],
            btnAlign: 'c',
            yes: function (index) {
                sub(1,index);
            }
        });
    });

    //修改通用方法
    function changeSele(name,type,e){
        for(var i=0;i<name.length;i++){
            var bal = name.eq(i).attr("lay-value");
            if(bal == type){
                name.eq(i).addClass('layui-this');
                var addtye = name.eq(i).text();
                e.find(".layui-unselect").val(addtye);
            }
        }
    }

    //修改
    $("#jurisdiction-table").on("click",".cagbtn",function(){
        var delId = $(this).parents(".system-tr").attr("data-id");
        layer.open({
            type: 2,
            title: ['修改佣金策略', 'background:#303030;color:#fff;'],
            skin: 'layer-ext-myskin',
            area: ['800px', '668px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'addcommission.html',
            btn: ['保存'],
            btnAlign: 'c',
            success:function(){
                var param = {
                    id:delId
                };
                var res = reqAjax(USER_URL.PACKINFO, JSON.stringify(param));
                if(res.code == 1){
                    var row = res.data;
                    var body = layer.getChildFrame('body');
                    var e = body.contents().find(".systemSize");
                    e.find(".layui-anim-upbit dd").removeClass("layui-this");
                    changeSele(e.eq(0).find(".layui-anim-upbit dd"),row.agentType,e.eq(0));
                    changeSele(e.eq(1).find(".layui-anim-upbit dd"),row.upgradeType,e.eq(1));
                    changeSele(e.eq(2).find(".layui-anim-upbit dd"),row.billingYear,e.eq(2));
                    changeSele(e.eq(3).find(".layui-anim-upbit dd"),row.applicableLevel,e.eq(3));
                    body.contents().find("#systemName").val(row.billingRatio);
                    body.contents().find("#commissionMoney").val(row.money);
                }
            },
            yes: function (index) {
                sub(2,index,delId);
            }
        });
    });

//删除
    $("#jurisdiction-table").on("click",".delBut", function () {
        var delId = $(this).parents(".system-tr").attr("data-id");
            layer.confirm(
                "是否删除？",
                {icon: 3, title:'提示'},
                function(index){
                    var paramDel = {
                        id : delId
                    };
                    var res = reqAjax(USER_URL.DELRESOURCE, JSON.stringify(paramDel));
                    if (res.code == 1) {
                     //   layer.msg("删除成功");
                        getDetail();
                        layer.close(index);
                    } else {
                        layer.msg(res.msg);
                    }
                });
    });


})(jQuery);