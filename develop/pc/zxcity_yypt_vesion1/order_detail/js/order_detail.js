(function($){
    var page = 1;
    var rows = 12;
    var username = yyCache.get('username');
    var tickno = sessionStorage.getItem("tickno");
    var inxs = sessionStorage.getItem("inxs"); //索引
    var pags = sessionStorage.getItem("pag");//第几页
    var reviewData = JSON.parse(sessionStorage.getItem("reviewData")); //整页数据
    var countsize = sessionStorage.getItem("countsize"); //总页码
    var phone = sessionStorage.getItem("phone") ||"";
    var sql= sessionStorage.getItem("sql");
    var oldtyp=  sessionStorage.getItem("oldtyp");
    var operater = yyCache.get("pcNickname",""); //用户昵称
    var operaterId = yyCache.get("userId",""); //登陆者id
    var inss;//之后的索引
    var isfirst=0;//是否初次进入
    var USER_URL = {
        TICKETLIST : 'operations/serviceUserDetails', //(获取(app和商户)客户的详情)
        UPDATELOG : 'operations/ticketUpdate', //（修改日志）优先级 0-3依次为低-急
        REPLYLOG :'operations/newTicketLog', //（回复日志）
        SINGLERESOURCE : 'operations/ticketLogList', //(获取工单日志)
        DETAILS:'operations/ticketDetails', //查看详情所有
        RESOURLIST : 'operations/findTicket' //查询工单列表
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    });

    //初始化
    $(function(){
        orderLog(tickno);
        getAppuser(phone,tickno);
    });

    //富文本编辑器
    var editor = initEditor("editor");

    //返回工单首页通用方法
    function returnIndex(){
        window.top.admin.current("order/order.html?v=" + new Date().getMilliseconds());
        window.top.admin.save();
    }

    //查询工单方法
    function getList(limts,i){
        var param = {
            "page": limts,
            "rows": rows,
            "sql": sql,
            "type": oldtyp,
            "usercode":operaterId
        }
        reqAjaxAsync(USER_URL.RESOURLIST, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                if(res.data.length==0){
                    layer.msg("没有下一条了哟");
                    $("#nextBtn").hide();
                    $("#nextBtn1").hide();
                }else{
                    sessionStorage.setItem('pag',parseInt(limts)+1);
                    sessionStorage.setItem('inxs',0); //当前索引
                    sessionStorage.setItem('reviewData',JSON.stringify(res.data));
                    isfirst = 1;
                    orderLog(res.data[i].ticketNo);
                    getAppuser(res.data[i].phone,res.data[i].ticketNo);
                }
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //操作日志
    function orderLog(ticknos){
        var param = {
            "ticketNo":ticknos
        }
        reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                var raw = res.data;
                var sHtml="";
                for(var i=0;i<raw.length;i++){  //action 1 设置分类 2 设置版块 3 创建工单 4 回复 5 工单调度 6 解决工单 7 关闭工单',
                    sHtml += '<div class="info-list">' +
                    '<div class="info-list-top">' +
                    '<i class="action' + raw[i].action + '"></i>' +
                    '<span class="ctrolname">' + raw[i].operater + '</span>' +
                    '<span class="ctrolstatu">' + raw[i].actionText + '</span>' +
                    '<span class="ctrolname">' + raw[i].target + '</span>' +
                    '<span class="trroltime">' + raw[i].createTime + '</span>' +
                    '</div>' ;
                    if(raw[i].action==4){
                        sHtml +='<div class="info-list-content">' + raw[i].desc + '</div>'
                    }
                    sHtml += '</div>';
                }
                $("#messageInfo").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        });

    }


    //右侧用户信息以及工单相关信息
    function getAppuser(phone,ticketNo){
            var param = {
                "phone": phone,
                "ticketNo":ticketNo,
                "operaterId":operaterId
            };
            reqAjaxAsync(USER_URL.DETAILS,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    var row = res.data;
                    var rowtk = row.Ticket.rows[0];
                    var rowapp = row.App || "";
                    if(rowtk.isEditable==1){ //1为可操作 0为不可
                        $("#passBtn").show();
                        $("#nooverBtn").show();
                        $("#overBtn").show();
                    }else if(rowtk.isEditable==0){
                        $("#passBtn").hide();
                        $("#nooverBtn").hide();
                        $("#overBtn").hide();
                    }
                    if(rowapp==""){
                        var appAccount="暂无";
                        var appNickname="暂无";
                        var appPhone="暂无";
                        var appUserState="暂无";
                        var appIsCert="暂无";
                        var appUserType="暂无";
                        var merchantAccount="暂无";
                        var merchantLevel="暂无";
                        var merchantState="暂无";
                        var merchantType="暂无";
                        var merchantPhone="暂无";
                    }else{
                        var appAccount=rowapp.appAccount||"暂无";
                        var appNickname=rowapp.appNickname||"暂无";
                        var appPhone=rowapp.appPhone||"暂无";
                        var appUserState=rowapp.appUserState||"暂无";
                        var appIsCert=rowapp.appIsCert||"暂无";
                        var appUserType=rowapp.appUserType||"暂无";
                        var merchantAccount=rowapp.merchantAccount||"暂无";
                        var merchantLevel=rowapp.merchantLevel||"暂无";
                        var merchantState=rowapp.merchantState||"暂无";
                        var merchantType=rowapp.merchantType||"暂无";
                        var merchantPhone=rowapp.merchantPhone||"暂无";
                    }

                        $(".appaccount").text(appAccount);
                        $(".appnickname").text(appNickname);
                        $(".appphone").text(appPhone);
                        $(".appu-serstate").text(appUserState);
                        $(".app-iscert").text(appIsCert);
                        $(".app-usertype").text(appUserType);
                        $(".merchant-account").text(merchantAccount);
                        $(".merchant-level").text(merchantLevel);
                        $(".merchant-type").text(merchantType);
                        $(".merchant-state").text(merchantState);
                        $(".merchant-phone").text(merchantPhone);
                    $(".title").text(rowtk.title);
                    $(".title").attr("data-id",rowtk.id);
                    $(".content").html(rowtk.content);
                    $(".tickno").text(rowtk.ticketNo);
                    $(".createtime").text(rowtk.createTime);
                    $(".protiy").text(rowtk.priorityText);
                    $(".protiy").attr("data-id",rowtk.priority);
                    $(".classify").text(rowtk.categoryName);
                    $(".classify").attr("data-id",rowtk.categoryId);
                    $(".plate").text(rowtk.plateName);
                    $(".plate").attr("data-id",rowtk.plateId);
                    $(".createuser").text(rowtk.createrName);
                    $(".handle").text(rowtk.handlerName);
                    $(".handle").attr("data-id",rowtk.handlerId);
                    $(".copyuser").text(rowtk.copyName);
                    $(".orderstatu").text(rowtk.statusText);
                    $(".orderstatu").attr("data-id",rowtk.status);
                    $(".orderstatu").attr("data-phone",rowtk.phone);
                    $(".orderstatu").attr("data-endTime",rowtk.endTime);
                    $(".orderstatu").attr("data-dueTime",rowtk.dueTime);
                     if(rowtk.status==2||rowtk.status==3){
                     $(".open-hid").show();
                     $(".message-input").hide();
                     }else{
                     $(".open-hid").hide();
                     $(".message-input").show();
                     }
                }else{
                    layer.msg(res.msg);
                }
            });
    }

//点击我的工单
    $("#myOrder").on("click",function(){
        returnIndex();
    });

    //页面滚动条隐藏
    $(".message-info-lists").niceScroll({
        cursorcolor:"#1E9FFF",
        cursorborder:"0",
        autohidemode:true
    });

    $(".content").niceScroll({
        cursorcolor:"#1E9FFF",
        cursorborder:"0",
        autohidemode:true
    });

    //相关操作
    function updateTatu(isopen,status,tickno,handlerId,handlerName,type,inx){ //isopen-0 处理和不需处理 1-重开，转交
        var id=$(".title").attr("data-id");
        var priority = $(".protiy").attr("data-id");
        var categoryId =$(".classify").attr("data-id");
        var plateId = $(".plate").attr("data-id");
        var dueTime = $(".orderstatu").attr("data-dueTime");
        var endTime = $(".orderstatu").attr("data-endTime");
        var phone = $(".orderstatu").attr("data-phone");
        var param = {
            "id": id,
            "priority": priority,
            "status": status,
            "categoryId": categoryId,
            "plateId": plateId,
            "dueTime": dueTime,
            "endTime": endTime,
            "phone": phone,
            "operaterId":operaterId,
            "operater":operater
        }
        if(handlerName!=""){
            param.handlerName=handlerName;
        }

        if(isopen==0){
            param.resolverId=handlerId;
        }else{
            if(handlerId!=""){
                param.handlerId=handlerId;
            }
        }
        reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(status==1 || status==0){
                    $(".open-hid").hide();
                    $(".message-input").show();
                }else if(status==2||status==3){
                    $(".open-hid").show();
                    $(".message-input").hide();
                }
                orderLog(tickno);
                if(type==1){
                   layer.close(inx);
                }
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //重新开启
    $("#openBtn").click(function(){
        var ticknos = $(".tickno").text(); //工单编号
        var handlerId = $(".handle").attr("data-id");
        updateTatu(1,"1",ticknos,"","");
    });

    //不需处理
    $("#nooverBtn").click(function(){
        var ticknos = $(".tickno").text(); //工单编号
        var handlerId = $(".handle").attr("data-id");
        updateTatu(0,"3",ticknos,"","");
    });

    //完结工单
    $("#overBtn").click(function(){
        var ticknos = $(".tickno").text(); //工单编号
        var handlerId = $(".handle").attr("data-id");
        updateTatu(0,"2",ticknos,"","");
    });

    //转交工单
    $("#passBtn").on("click",function(){
        var ticknos = $(".tickno").text(); //工单编号
        layer.open({
            title: ['转交工单', 'font-size:15px;background-color:#0678CE;color:#fff'],
            type: 1,
            content: $('#turnOrder'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['500px', '500px'],
            shade: [0.1, '#fff'],
            resize: false,
            btn:['保存','取消'],
            end: function () {
                $('#turnOrder').hide();
            },
            success: function (layero) {

            },
            yes: function(index, layero){
                var val = $("#turnUser dl dd.layui-this").attr("lay-value");
                var text = $("#turnUser dl dd.layui-this").text();
                if(val==""){
                    layer.msg("请选择工单受理人");
                }else{
                    updateTatu(1,"1",ticknos,val,text,1,index);

                }

            }
        })
    });

    //回复日志
    $("#sendBtn").click(function(){
        var ticknos = $(".tickno").text(); //工单编号
        var action = "4";
        var desc = editor.txt.html();//日志回复内容
        var edi = editor.txt.text();
        var reg = /(&nbsp;)*/g
        var newedi = edi.replace(reg,"");
        var regEx = /\s+/g;
        var newedi1 = newedi.replace(regEx,"");
        if(newedi1.length!=0 || desc.indexOf("img")>-1){
            var param = {
                "operater": operater,// 操作人名称（例如管理员）
                "ticketNo": tickno,//工单编号
                "action": action, // 操作： 1 设置分类 2 设置版块 3 创建工单 4 回复 5 工单调度 6 解决工单 7 关闭工单
                "desc": desc, // 回复内容
                "operaterId":operaterId
            }
            reqAjaxAsync(USER_URL.REPLYLOG,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    orderLog(ticknos);
                    editor.txt.html("");//清空回复
                }else{
                    layer.msg(res.msg);
                }
            })
        }else{
            layer.msg("请添加回复内容");
            editor.txt.html("");//清空回复
        }
    });

    //下一个
    $(".jurisdiction-left").on("click","#nextBtn1,#nextBtn",function(){
        var inxs = sessionStorage.getItem("inxs"); //索引
        var pags = sessionStorage.getItem("pag");//第几页
        var reviewData = JSON.parse(sessionStorage.getItem("reviewData"));
        inss =inxs;
        var count = reviewData.length;
        if(isfirst==0){ //初次进入
            inss = parseInt(inxs)+1;
            var count = reviewData.length;
        }else{//下一页
            var count = reviewData.length-1;
        }
        console.log("inss:"+inss);
        console.log("count:"+count);
        if(inss<count){
            console.log(reviewData)
            orderLog(reviewData[inss].ticketNo);
            getAppuser(reviewData[inss].phone,reviewData[inss].ticketNo);
            sessionStorage.setItem('inxs',inss);
        }else if(inss==count){
            isfirst = 1;
            sessionStorage.setItem('inxs',0);
            if(pags==countsize){
                layer.msg("没有了哟");
                $("#nextBtn").hide();
                $("#nextBtn1").hide();

            }else{
                getList(parseInt(pags)+1,0);//调用下一页
            }
        }
    });

    //点击查看大图
    $(".content").on("click","img",function(){
        var src = $(this).attr("src");
        $("#imgHide img").attr("src",src);
        layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            resize: false,
            area: ['auto', '600px'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: $('#imgHide')
        });
    });

})(jQuery);