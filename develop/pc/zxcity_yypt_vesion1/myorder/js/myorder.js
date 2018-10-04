(function($){
    var page = 1;
    var rows = 6;
    var username = yyCache.get('username',"");
    var operater = yyCache.get("pcNickname",""); //用户昵称
    var operaterId = yyCache.get("userId",""); //登陆者id
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/ticketList', //(工单列表)
        ORDERCLASSIFY : 'operations/getJobOrderCategories', //(查询工单类别)
        ORDERPLATE : 'operations/getJobOrderSections', //(查询工单版块)
        ADDORDER : 'operations/newTicket',//(新增工单)
        ADDORDERLOG :'operations/newTicketLog',//(新增工单日志)
        SINGLERESOURCE : 'operations/ticketLogList', //(获取工单日志)
        SERVICESTAFF : 'operations/customerServiceStaffs', //(客服人员)
        UPDATELOG : 'operations/ticketUpdate', //（修改日志）优先级 0-3依次为低-急
        REPLYLOG :'operations/newTicketLog', //（回复日志）
        TICKETLIST : 'operations/serviceUserDetails', //(获取(app和商户)客户的详情)
        ADDQUERY :'operations/newTicketQuery', //(创建搜索条件)
        GETQUERY : 'operations/ticketQueryList',//(获取用户的自定义搜索条件)
        QUERYTICKET : 'operations/ticketListViaQueryComb' //(自定义搜索查询，可传参数或者条件创建人id)
    };

    var layer = layui.layer;
    layui.use('form', function(){
        form = layui.form;

    })

    var editor = initEditor("editor_id0"); //新建工单描述
    var editors = initEditor("editor"); //工单日志

    //初始化
    $(function(){
        $(".orderlist").find(".hidemenu").eq(0).find("li").eq(0).addClass("actv");
        getOrderList("","",'desc',page,rows,"8","",operaterId,"");//全部
        orderClassify("#classTree1",zTreeOnClickClassLog); //工单分类日志
       orderPlate("#plateTree1",zTreeOnClickPlateLog); //工单板块日志
        getCustom();//自定义初始化搜索
        allocation();//分配人
        copy("#copyadd");//新建抄送
    })

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

    //(新建日期)
    function datetimeNew(e){
        $(e).datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: "zh-CN",
            clearBtn:true,
            startDate: new Date()
        }).on('changeDate', function(ev) {
             var startTime = ev.date.valueOf();
             $(this).parent().attr('data-time',startTime);
        });
    }


    //工单渲染
    function orderList(res,inx){
        var sHtml="";
        if(res.data.length != 'null'){
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                var dutime = row.dueTime || "-";
                sHtml += "<div class='sort-item' data-content='" + row.content + "' data-copyId='" + row.copyId + "' data-copyName='" + row.copyName + "' data-isEditable='" + row.isEditable + "' data-isCopy='" + row.isCopy + "' data-phone='" + row.phone + "' data-categoryId='" + row.categoryId + "' data-categoryName='" + row.categoryName + "' data-plateid='" + row.plateId + "' data-plateName='" + row.plateName + "' data-handlename='" + row.handlerName + "' data-handleid='" + row.handlerId + "' data-id='"+ row.id +"' >"+
                "<div class='sort-item-status'><span class='sort-item-num'>" + row.ticketNo +
                "</span><span class='order-statu'>" + row.statusText + "</span>"+
                "<i data-priority='"+ row.priority +"' class='ent"+ parseInt(row.priority+1) +"'></i>"+
                "</div>" +
                "<div class='sort-item-title'>"+ row.title + "</div>"+
                "<div class='sort-item-info'>" +
                "<img src='img/default-tx.png'>" +
                "<span class='create-user'>" + row.createrName + "</span>" +
                "<span class='cretae-time'>截至 " + dutime + "</span>" +
                "</div>"+
                "</div>";
            }
            $(".sortcontent").html(sHtml);
            if(inx==""){
                $(".sortcontent").find(".sort-item").eq(0).addClass("bgBlue");
                getlog($(".sortcontent").find(".sort-item").eq(0));//加载日志
                var phone = $(".sortcontent").find(".sort-item").eq(0).attr("data-phone") || "";
                if(phone !=""){
                    /*$(".havedata2").show();
                    $(".nodata2").hide();*/
                    getAppuser(phone);//加载右侧用户信息
                }else{
                    $(".nodata2").show();
                    $(".havedata2").hide();
                }

            }else{
                $(".sortcontent").find(".sort-item").eq(inx).addClass("bgBlue");
                getlog($(".sortcontent").find(".sort-item").eq(inx));//加载日志
                var phone = $(".sortcontent").find(".sort-item").eq(inx).attr("data-phone") || "";
                if(phone !=""){
                    /*$(".havedata2").show();
                    $(".nodata2").hide();*/
                    getAppuser(phone);//加载右侧用户信息
                }else{
                    $(".nodata2").show();
                    $(".havedata2").hide();
                }
            }
        }


    }

    //分页


    //加载工单列表
    function getOrderList(tk,inx,order,pagelimit,rows,status,handlerId,createrId,replyId,resolverId,copyid){
        var param = {
            "sort": 'createTime', //如果是创建时间，就是createTime
            "order": order, // asc或者desc，升或降
            "page": pagelimit,
            "rows": rows,
            "handlerId2":operaterId,
            "copyId2":operaterId
        };

        if(status != "") {
            param.status =status;
        }
        if(createrId != "") {
            param.createrId =createrId;

        }
        if(replyId != "") {
            param.replyId =replyId;

        }
        if(handlerId != "") {
            param.handlerId =handlerId;
        }

        if(resolverId != "") {
            param.resolverId =resolverId;
        }

        if(copyid != "") {
            param.copyId =copyid;
        }

        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(res.total > 0){
                    $(".nodata1").hide();
                    $(".nodata3").hide();
                    $(".havedata").show();
                    console.log("tk0"+tk)
                    for(var i=0;i<res.data.length;i++){
                        var row = res.data[i];
                        console.log("jinlai")
                        console.log(tk + "vs" +row.ticketNo)
                        if(tk==row.ticketNo){
                            console.log("tk"+tk)
                            orderList(res,inx);
                            break;
                        }
                        if(i==res.data.length-1){
                            console.log(200)
                            orderList(res,0);
                        }
                    }
                    //分页
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.total //数据总数，从服务端得到
                            ,groups:2
                            ,limit:rows
                            ,prev:'<'
                            ,next:'>'
                            ,jump: function(obj, first){


                                //首次不执行
                                if(!first){
                                    //obj包含了当前分页的所有参数，比如：
                                    console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                                    console.log(obj.limit); //得到每页显示的条数
                                    param.page=obj.curr;
                                    reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res){
                                        if(res.code==1){
                                            console.log("tk0"+tk)
                                            for(var i=0;i<res.data.length;i++){
                                                var row = res.data[i];
                                                console.log(tk + "vs" +row.ticketNo)
                                                if(tk==row.ticketNo){
                                                    console.log("tk"+tk)
                                                    orderList(res,inx);
                                                    break;
                                                }
                                                if(i==res.data.length-1){
                                                    console.log(200)
                                                    orderList(res,0);
                                                }
                                            }
                                        }else{
                                            layer.msg(res.msg);
                                        }
                                    })
                                }
                            }
                        });

                    });
                }else{
                    $(".nodata1").show();
                    $(".nodata2").show();
                    $(".nodata3").show();
                    $(".havedata").hide();
                    $(".havedata2").hide();
                    return ;
                }
                $(".addmore").attr("data-statu","0");
            }else{
                layer.msg(res.msg);
            }
        });
    }

    //公用查询方法
    function getcommon(){
        var txt = $(".orderlist").find("li.actv").text();
        var val = $("#screensort").find("dl dd.layui-this").attr("lay-value"); //时间升降序
        $(".sortcontent").html("");
        $(".addmore").attr("data-num","1");
        if(txt=="全部"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"8","",operaterId,"");
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"8","",operaterId,"");
            }
        }
        if(txt=="待我处理"){

            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"7",operaterId,"","");
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"7",operaterId,"","");
            }
        };
        if(txt=="抄送给我"){//暂无先放着
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"","","","","",operaterId);
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"","","","","",operaterId);
            }
        };
        if(txt=="我创建的"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"","",operaterId,"");
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"","",operaterId,"");
            }
        };
        if(txt=="我回复的"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"","","",operaterId);
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"","","",operaterId);
            }
        };
        if(txt=="我处理的"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"",'resolved',"","",operaterId);
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"",'resolved',"","",operaterId);
            }
        };
        if(txt=="待分配"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"","unassign",operaterId,"");
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"","unassign",operaterId,"");
            }
        };
        if(txt=="待回复"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"1","",operaterId,"");
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"1","",operaterId,"");
            }
        };
        if(txt=="处理中"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList("","",'asc',page,rows,"","processing",operaterId,"");
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"","processing",operaterId,"");
            }
        };
        if(txt=="已解决"){
            $(".ctronlbtn").hide();
            if(val==0){
                getOrderList("","",'asc',page,rows,"3","","","",operaterId);
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"3","","","",operaterId);
            }
        };
        if(txt=="不需处理"){
            $(".ctronlbtn").hide();
            if(val==0){
                getOrderList("","",'asc',page,rows,"4","","","",operaterId);
            };
            if(val==1){
                getOrderList("","",'desc',page,rows,"4","","","",operaterId);
            }
        };
    }

    //加载更多专用方法
    function getcommonMore(tkno,inx,pag){
        var txt = $(".orderlist").find("li.actv").text();
        var val = $("#screensort").find("dl dd.layui-this").attr("lay-value");
      //  $(".addmore").attr("data-num","1");
        $("#page6").html("");
        if(txt=="全部"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"8","",operaterId,"");
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"8","",operaterId,"");
            }
        }
        if(txt=="待我处理"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"7",operaterId,"","");
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"7",operaterId,"","");
            }
        };
        if(txt=="抄送给我"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',page,rows,"","","","","",operaterId);
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',page,rows,"","","","","",operaterId);
            }
        };
        if(txt=="我创建的"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"","",operaterId,"");
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"","",operaterId,"");
            }
        };
        if(txt=="我回复的"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"","","",operaterId);
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"","","",operaterId);
            }
        };
        if(txt=="我处理的"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"",'resolved',"","",operaterId);
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"",'resolved',"","",operaterId);
            }
        };
        if(txt=="待分配"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"","unassign",operaterId,"");
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"","unassign",operaterId,"");
            }
        };
        if(txt=="待回复"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"1","",operaterId,"");
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"1","",operaterId,"");
            }
        };
        if(txt=="处理中"){
            $(".ctronlbtn").show();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"","processing",operaterId,"");
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"","processing",operaterId,"");
            }
        };
        if(txt=="已解决"){
            $(".ctronlbtn").hide();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"3","","","",operaterId);
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"3","","","",operaterId);
            }
        };
        if(txt=="不需处理"){
            $(".ctronlbtn").hide();
            if(val==0){
                getOrderList(tkno,inx,'asc',pag,rows,"4","","","",operaterId);
            };
            if(val==1){
                getOrderList(tkno,inx,'desc',pag,rows,"4","","","",operaterId);
            }
        };
    }

    //工单列表切换时间升降序
    form.on('select(timesort)', function(data){
        $(".sortcontent").html("");
        $("#screensort").attr("data-val",data.value);
        var status = $(".addmore").attr("data-statu"); //0-表示正常加载 1-表示自定义条件搜索 2-表示自定义名称进行搜索
        var nm = $("addmore").attr("data-self");
        if(status==0){
            getcommon();
        }
        if(status==1){
            customSearch("",1,"",page);
        }
        if(status==2){
            customSearch("",2,"",page);
        }
    });


    /*查询工单以及相关*/
    //左侧菜单
    $(".orderlist").on("click",".hidemenu li",function(){
        $(".orderlist").find(".hidemenu li").removeClass("actv");
        $(this).addClass("actv");
        $(".addcontent-info").hide();
        $(".searchtip").hide();
        $(".searchorder").attr("data-num",0);
        $(".top-button").find(".top-btn").removeClass("bgwhite");
        getcommon();
    })


    /*工单日志及其相关*/
    //工单日志渲染
    function orderLog(tickno){
        var param = {
            "ticketNo":tickno
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
                    '</div>' +
                    '<div class="info-list-content">' + raw[i].desc + '</div>' +
                    '</div>';
                }
                $("#messageInfo").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        });

    }

    //不可修改
    function nomessage(level,id,tickno,categoryName,plateName,handlename,copyNam){
        $(".nomessage").removeClass("hid");
        $(".messlog").addClass("hid");
        var levls = 'statuicon statulevel'+level;
        $("#screenStatu01").html('<i class="'+ levls +'"></i>');
        $(".ordername").attr("data-id",id);
        $(".ordername").attr("data-tkno",tickno);
        $(".ordername").text(tickno);
        $(".nocommonclass").find("input").val(categoryName);
        $(".nocommonclass").find("input").attr("title",categoryName);
        $(".nocommonplate").find("input").val(plateName);
        $(".nocommonplate").find("input").attr("title",plateName);
        if(handlename=="-请选择-"){
            $("#nocoll").val("");
        }else{
            $("#nocoll").val(handlename);
        }
        if(plateName=="-请选择-"){
            $(".nocommonplate").find("input").val("");
            $(".nocommonplate").find("input").attr("title","");
        }else{
            $(".nocommonplate").find("input").val(plateName);
            $(".nocommonplate").find("input").attr("title",plateName);
        }
        if(categoryName=="-请选择-"){
            $(".nocommonclass").find("input").val("");
            $(".nocommonclass").find("input").attr("title","");
        }else{
            $(".nocommonclass").find("input").val(plateName);
            $(".nocommonclass").find("input").attr("title",plateName);
        }

        $("#nocopy").val(copyNam);
        $("#nocopy").attr("title",copyNam);
    }

    //查询其中某条的方法
    function getlog(e){

        var id = e.attr("data-id");//id
        var tickno = e.find(".sort-item-num").text();//工单号
        var statuss = e.find(".order-statu").text();//状态
        var level=e.find("i").attr("data-priority"); //优先级 0-3依次为低-急
        var handleId = e.attr("data-handleid");//处理人id
        var phone = e.attr("data-phone") || "";//phone
        var statutext = e.find(".order-statu").text();//状态文本
        var categoryName = e.attr("data-categoryName")|| "-请选择-";//分类名称
        var plateName = e.attr("data-plateName") || "-请选择-"; //板块名称
        var handlename = e.attr("data-handlename") || "-请选择-"; //分配人名称
        var iscopy = e.attr("data-isCopy");//1  表示是抄送给我的， 0 表示不是
        var coptId = e.attr("data-copyId");//抄送id
        var copyName = e.attr("data-copyName");//抄送人
        var content = e.attr("data-content");//工单内容
        var isEditable = e.attr("data-iseditable");//1-可编辑
        $(".sortcontent").find(".sort-item").removeClass("bgBlue");
        e.addClass("bgBlue");
        $(".addcontent-info").hide();
        $(".orderrgt").show();
        $(".logctcnt").html(content);
        if(isEditable==0){
                nomessage(level, id, tickno, categoryName, plateName, handlename, copyName); //不能操作
        }
        if(isEditable==1){
            if(statutext=="已解决" || statutext=="不解决" ) {
                nomessage(level, id, tickno, categoryName, plateName, handlename, copyName); //不能操作
            }else{
                $(".messlog").removeClass("hid");
                $(".nomessage").addClass("hid");
                $(".ctronlbtn").show();
                $("#logCont").html(content);
                $("#copylog1").val(copyName);
                $("#copylog1").attr("title",copyName);
                $("#order-classifyname1").text(categoryName);
                $("#order-classifyname1").attr("title",categoryName);
                $("#order-platename1").text(plateName);
                $("#order-platename1").attr("title",plateName);
                $(".ordername").attr("data-id",id);
                $(".ordername").attr("data-tkno",tickno);
                $(".ordername").text(tickno);
                $(".message-statuname").text(statuss);
                var staus= 'statuicon statulevel'+level;
                $("#screenStatu").find("i").attr("class",staus);
                var lists = $("#screenStatu").find("dl dd");
                var handlist = $("#allocation").find("dl dd");
                $("#screenStatu").find("dl dd").removeClass("layui-this"); //优先级状态选择
                for(var i=0;i<lists.length;i++){
                    if(level==lists.eq(i).attr("lay-value")){
                        lists.eq(i).addClass("layui-this");
                    }
                }
                $("#allocation").find("dl dd").removeClass("layui-this");//处理人选择
                for(var a=0;a<handlist.length;a++){
                    if(handleId==handlist.eq(a).attr("lay-value")){
                        handlist.eq(a).addClass("layui-this");
                        $("#allocation").find("input").val(handlist.eq(a).text());
                    }
                }
            }
        }
        orderLog(tickno); //加载日志列表
        if(phone !=""){
           /* $(".havedata2").show();
            $(".nodata2").hide();*/
            getAppuser(phone);//加载右侧用户信息
        }else{
            $(".nodata2").show();
            $(".havedata2").hide();
        }
    }

    //查询其中某条
    $(".sortcontent").on("click",".sort-item",function(){
        getlog($(this));
    });

    //分配方法
    function allocation(){
        var param = "{}";
        var res = reqAjax(USER_URL.SERVICESTAFF,param);
        var sHtml = "";
        if(res.code == 1){
            sHtml+='<option value="">-请选择-</option>';
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                sHtml += '<option value="' + row.id + '">' + row.uname + '</option>';
            }
            $(".copycommon").html(sHtml);
           // $form.find('select[name=allot]').append(sHtml);
            form.render();
        }else{
            layer.msg(res.msg);
        }
    }

    //抄送方法
    function copy(e){
        var param = "{}";
        var res = reqAjax(USER_URL.SERVICESTAFF,param);
        var sHtml = "";
        if(res.code == 1){
         //   sHtml += '<option value="" style="display: none">' + "-请选择-" + '</option>';
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                sHtml += '<option value="' + row.id + '">' + row.uname + '</option>';
            }
            $(e).html(sHtml);
            $(e).selectpicker({
                liveSearch: false,
                noneSelectedText: "-请选择-",
                maxOptions: 4
            });
            $(e).selectpicker('refresh');
        }else{
            layer.msg(res.msg);
        }
    }


    //工单分类选择(日志)
    $(".order-message").on("click",".order-classify",function(){
        var num = $(this).attr("data-num");
        if(num==0){
            $(".order-message").find(".classify-menu").show();
            $(this).attr("data-num",1);
            $(this).find("i").attr("class","up-arrows");
            $(".logclass").mouseleave(function(){
                $(".order-message").find(".classify-menu").hide();
                $(this).find("i").attr("class","down-arrows");
                $(this).attr("data-num",0);
            });
        };
        if(num==1){
            $(".order-message").find(".classify-menu").hide();
            $(this).attr("data-num",0);
            $(this).find("i").attr("class","down-arrows");
        }
    });

    //工单板块选择（日志）
    $(".order-message").on("click",".order-plat",function(){
        var num = $(this).attr("data-num");
        if(num==0){
            $(".order-message").find(".plate-menu").show();
            $(this).attr("data-num",1);
            $(this).find("i").attr("class","up-arrows");
            $(".logplate").mouseleave(function(){
                $(".order-message").find(".plate-menu").hide();
                $(this).find("i").attr("class","down-arrows");
                $(this).attr("data-num",0);
            });
        };
        if(num==1){
            $(".order-message").find(".plate-menu").hide();
            $(this).attr("data-num",0);
            $(this).find("i").attr("class","down-arrows");
        }
    });

    /*修改日志*/
    //修改优先级
    form.on('select(loglevel)', function(data){
        var id = $(".ordername").attr("data-id");
        var tickno = $(".ordername").attr("data-tkno");
        var priority = data.value;
        var status='statuicon statulevel'+priority;
        $(".screenStatu span").attr("class",status);
        var param = {
            "id": id,
            "operater":operater,
            "operaterId":operaterId,
            "priority": priority
        }
        reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
            if(res.code==1){
               // orderLog(tickno);
                leftCommon(tickno);
            }else{
                layer.msg(res.msg);
            }
        })
    });

    //修改分类
    function zTreeOnClickClassLog(event, treeId, treeNode){
        var name = treeNode.name || "";
        var categoryId = treeNode.id || "";
        var id = $(".ordername").attr("data-id");
        var tickno = $(".ordername").attr("data-tkno");
            $(".order-message").find(".order-classifyname").text(name);
            $(".order-message").find(".order-classifyname").attr("data-id",categoryId);
            $(".order-message").find(".order-classify").find("i").attr("class","down-arrows");
            $(".order-message").find(".order-classify").attr("data-num",0);
            $(".order-message").find(".classify-menu").hide();
            var param={
                "id": id,
                "operater":operater,
                "operaterId":operaterId,
                "categoryId": categoryId,
                "target":name
            };
            reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    orderLog(tickno);
                }else{
                    layer.msg(res.msg);
                }
            })
        }




    //修改板块
    //日志工单板块
    function zTreeOnClickPlateLog(event, treeId, treeNode){
        var id = $(".ordername").attr("data-id");
        var tickno =$(".ordername").attr("data-tkno");
        var name = treeNode.name || "";
        var plateId = treeNode.id || "";
            $(".order-message").find(".order-platename").text(name);
            $(".order-message").find(".order-platename").attr("data-id",plateId);
            $(".order-message").find(".order-plat").find("i").attr("class","down-arrows");
            $(".order-message").find(".order-plat").attr("data-num",0);
            $(".order-message").find(".plate-menu").hide();
            $(".order-message").find(".plateinput").val(name);
            var param={
                "id": id,
                "operater":operater,
                "operaterId":operaterId,
                "plateId": plateId,
                "target":name
            };
            reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    orderLog(tickno);
                }else{
                    layer.msg(res.msg);
                }
            })
        }

    //右侧日志操作调用左侧通用方法
    function leftCommon(tickno){
        var inx = $(".sortcontent").find(".sort-item.bgBlue").index();
        $(".ordername").attr("data-inx",inx);
        var status = $(".addmore").attr("data-statu"); //0-表示正常加载 1-表示自定义条件搜索 2-表示自定义名称进行搜索
        var numlimit=$("#page6").find("ul li.active").attr("data-lp");
        var nm = $(".addmore").attr("data-self");
        if(status==0){
                getcommonMore(tickno,inx,numlimit);
        }
        if(status==1){
                customSearch(tickno,1,inx,numlimit);
        }
        if(status==2){
           customSearch(tickno,2,inx,numlimit);

        }
    }

    //分配操作
    var oldhandid = $("#allocation").find("dl dd.layui-this").attr("lay-value");
    form.on('select(copycommon)', function(data){
        var id = $(".ordername").attr("data-id");
        var tickno =$(".ordername").attr("data-tkno");
        var handlerId = data.value || "";
        var handlerName = $("#allocation").find("dl dd.layui-this").text();
        var status = "2";//状态 0： 未分配； 1：待回复；2：处理中(分配后)；3已解决（已处理）；4：不解决(不需处理),
        if(handlerId !="" && oldhandid != handlerId){
            var param = {
                "id": id,
                "handlerId": handlerId,
                "operaterId":operaterId,
                "handlerName":handlerName,
                "operater":operater,
                "status": status
            }
            reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                   // orderLog(tickno);
                    leftCommon(tickno);
                }else{
                    layer.msg(res.msg);
                }
            })
        }else{
            layer.msg("请选择分配人");
        }
    });




    //不需处理
    $(".ctronlbtn").on("click",".noicon",function(){
        //获取当前时间
        var date = new Date();
        var m = date.getMonth()+1;
        var day = date.getDate();
        if(m>9){
            newm = m;
        }else{
            newm = "0" + m;
        }
        if(day>9){
            newd = day;
        }else{
            newd = "0" + day;
        }
        var str = date.getFullYear()+"-"+ newm +"-"+ newd;
        var id = $(".ordername").attr("data-id");
        var tickno = $(".ordername").attr("data-tkno");
        var level = $(".sortcontent .sort-item.bgBlue").find("i").attr("data-priority"); //优先级 0-3依次为低-急
        var statuss = $(".sortcontent .sort-item.bgBlue").find(".order-statu").text();//状态
        var handleId = $(".sortcontent .sort-item.bgBlue").attr("data-handleid");//处理人id
        var phone = $(".sortcontent .sort-item.bgBlue").attr("data-phone") || "";//phone
        var statutext = $(".sortcontent .sort-item.bgBlue").find(".order-statu").text();//状态文本
        var categoryName = $(".sortcontent .sort-item.bgBlue").attr("data-categoryName")|| "-请选择-";//分类名称
        var plateName = $(".sortcontent .sort-item.bgBlue").attr("data-plateName") || "-请选择-"; //板块名称
        var handlename = $(".sortcontent .sort-item.bgBlue").attr("data-handlename") || "-请选择-"; //分配人名称
        var iscopy = $(".sortcontent .sort-item.bgBlue").attr("data-isCopy");//1  表示是抄送给我的， 0 表示不是
        var copyname = $(".sortcontent .sort-item.bgBlue").attr("data-copyName"); //抄送人
        var content = $(".sortcontent .sort-item.bgBlue").attr("data-content");
        var status = "4";//状态 0： 未分配； 1：待回复；2：处理中(分配后)；3已解决（已处理）；4：不解决(不需处理),
        var param = {
            "id": id,
            "operater":operater,
            "operaterId":operaterId,
            "status": status,
            "resolverId":operaterId,
            "endtime":str
        }
        reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                layer.msg("操作成功");
                leftCommon();
                orderLog(tickno);
                nomessage(level,id,tickno,categoryName,plateName,handlename,copyname);
            }else{
                layer.msg(res.msg);
            }
        })
    });

    //已处理
    $(".ctronlbtn").on("click",".trnlicon",function(){
        //获取当前时间
        var date = new Date();
        var m = date.getMonth()+1;
        var day = date.getDate();
        if(m>9){
            newm = m;
        }else{
            newm = "0" + m;
        }
        if(day>9){
            newd = day;
        }else{
            newd = "0" + day;
        }
        var str = date.getFullYear()+"-"+ newm +"-"+ newd;
        var id = $(".ordername").attr("data-id");
        var tickno = $(".ordername").attr("data-tkno");
        var status = "3";//状态 0： 未分配； 1：待回复；2：处理中(分配后)；3已解决（已处理）；4：不解决(不需处理),
        var level = $(".sortcontent .sort-item.bgBlue").find("i").attr("data-priority"); //优先级 0-3依次为低-急
        var statuss = $(".sortcontent .sort-item.bgBlue").find(".order-statu").text();//状态
        var handleId = $(".sortcontent .sort-item.bgBlue").attr("data-handleid");//处理人id
        var phone = $(".sortcontent .sort-item.bgBlue").attr("data-phone") || "";//phone
        var statutext = $(".sortcontent .sort-item.bgBlue").find(".order-statu").text();//状态文本
        var categoryName = $(".sortcontent .sort-item.bgBlue").attr("data-categoryName")|| "-请选择-";//分类名称
        var plateName = $(".sortcontent .sort-item.bgBlue").attr("data-plateName") || "-请选择-"; //板块名称
        var handlename = $(".sortcontent .sort-item.bgBlue").attr("data-handlename") || "-请选择-"; //分配人名称
        var iscopy = $(".sortcontent .sort-item.bgBlue").attr("data-isCopy");//1  表示是抄送给我的， 0 表示不是
        var copyname = $(".sortcontent .sort-item.bgBlue").attr("data-copyName"); //抄送人
        var content = $(".sortcontent .sort-item.bgBlue").attr("data-content");
        var param = {
            "id": id,
            "operater":operater,
            "operaterId":operaterId,
            "status": status,
            "resolverId":operaterId,
            "endtime":str
        }
        reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                layer.msg("操作成功");
                orderLog(tickno);
                leftCommon();
                nomessage(level,id,tickno,categoryName,plateName,handlename,copyname);
            }else{
                layer.msg(res.msg);
            }
        })
    });

    //回复日志
    $("#sendBtn").click(function(){
        var tickno = $(".ordername").attr("data-tkno"); //工单编号
        var action = "4";
        var desc = editors.txt.html();//日志回复内容
        var edi = editors.txt.text();
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
                    orderLog(tickno);
                    editors.txt.html("");//清空回复
                }else{
                    layer.msg(res.msg);
                }
            })
        }else{
            layer.msg("请添加回复内容");
            editors.txt.html("");//清空回复
        }
    });

    /*左侧菜单相关*/
    //收缩
    function slideLi(types,e){
        if(types==0){
            e.next(".hidemenu").hide();
            e.attr("data-type",1);
            e.find("i").attr("class","up-arrows");
        };
        if(types==1){
            e.next(".hidemenu").show();
            e.attr("data-type",0);
            e.find("i").attr("class","down-arrows");
        }
    }

    $(".myorders").click(function(){ //我的工单
        var types = $(this).attr("data-type");
        slideLi(types,$(this));
    });
    $(".unsolved").click(function(){ //未解决工单
        var types = $(this).attr("data-type");
        slideLi(types,$(this));
    });
    $(".solved").click(function(){ //已解决工单
        var types = $(this).attr("data-type");
        slideLi(types,$(this));
    });
    $(".custom").click(function(){ //自定义搜索
        var types = $(this).attr("data-type");
        slideLi(types,$(this));
    });

    /*新建工单相关*/
    $(".top-button").on("click",".addorder",function(){
            orderClassify("#classTree",zTreeOnClickClass); //新建工单分类
            orderPlate("#plateTree",zTreeOnClickPlate); //新建工单板块
        copy("#copyadd");//新建抄送
        $(".top-button").find(".top-btn").removeClass("bgwhite");
        $(this).addClass('bgwhite');
        $("#addcontent").show();
        $(".addcontent-info").find(".order-message").hide();
        $(".searchtip").hide();
        $(".searchorder").attr("data-num","0");
        $(".orderrgt").hide();
        datetimeNew('#datetimepicker2 input');
        datetimeNew('#datetimepicker3 input');
        $("#createName").val(operater);
    });

    //工单分类方法
    function orderClassify(e,method){
        var setting = {
            check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            view: {
                showIcon: true
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    isCopy: false,
                    isMove: true
                }
            },
            callback: {
                onClick: method
            }
        };

        var paramLft = "{}";
        reqAjaxAsync(USER_URL.ORDERCLASSIFY,paramLft).done(function(res){
            if(res.code == 1){
                for(var i=0;i<res.data.length;i++){
                    res.data[i].id=Number(res.data[i].id);
                    res.data[i].pid=Number(res.data[i].parentId);
                    res.data[i].name=res.data[i].categoryName;
                    res.data[i].icon = "";
                    res.data[i].code = res.data[i].categoryCode;
                }
                newtreeClass = $.fn.zTree.init($(e), setting, res.data);
                newtreeClass.expandAll(true);
            }else{
                layer.msg(res.msg);
            }
        });
    }



    //新建工单分类树点击
    function zTreeOnClickClass(event, treeId, treeNode){
        var name = treeNode.name || "";
        var id = treeNode.id || "";
            $(".addcontent-info").find(".order-classifyname").text(name);
            $(".addcontent-info").find(".order-classifyname").attr("data-id",id);
            $(".addcontent-info").find(".order-classify").find("i").attr("class","down-arrows");
            $(".addcontent-info").find(".order-classify").attr("data-num",0);
            $(".addcontent-info").find(".classify-menu").hide();
    }

    //工单分类选择(新建)
        $("#add-classify").on("click",function(){
            var num = $(this).attr("data-num");
            if(num==0){
                $(".addcontent-info").find(".classify-menu").show();
                $(this).attr("data-num",1);
                $(this).find("i").attr("class","up-arrows");
                $(".addclass").mouseleave(function(){
                    $(".addcontent-info").find(".classify-menu").hide();
                    $(this).find("i").attr("class","down-arrows");
                    $(this).attr("data-num",0);
                });
            };
            if(num==1){
                $(".addcontent-info").find(".classify-menu").hide();
                $(this).attr("data-num",0);
                $(this).find("i").attr("class","down-arrows");
            }
        });


    //工单板块方法
    function orderPlate(e,method){
        var setting = {
            check: {
                enable: false,
                chkStyle: "checkbox",
                radioType: "all",
                nocheckInherit: true,
                chkDisabledInherit: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            view: {
                showIcon: true
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    isCopy: false,
                    isMove: true
                }
            },
            callback: {
                onClick: method
            }
        };

        var paramLft = "{}";
        reqAjaxAsync(USER_URL.ORDERPLATE,paramLft).done(function(res){
            if(res.code == 1){
                for(var i=0;i<res.data.length;i++){
                    res.data[i].id=Number(res.data[i].id);
                    res.data[i].pid=Number(res.data[i].parentId);
                    res.data[i].name=res.data[i].categoryName;
                    res.data[i].icon = "";
                    res.data[i].code = res.data[i].categoryCode;
                }
               newtreePlate = $.fn.zTree.init($(e), setting, res.data);
                newtreePlate.expandAll(true);
            }else{
                layer.msg(res.msg);
            }
        });
    }

    //新建工单板块树点击
    function zTreeOnClickPlate(event, treeId, treeNode){
        var name = treeNode.name || "";
        var id = treeNode.id || "";
             $(".addcontent-info").find("#order-platename").text(name);
             $(".addcontent-info").find("#order-platename").attr("data-id",id);
             $(".addcontent-info").find(".order-plat").find("i").attr("class","down-arrows");
             $(".addcontent-info").find(".order-plat").attr("data-num",0);
             $(".addcontent-info").find(".plate-menu").hide();
             $(".addcontent-info").find(".plateinput").val(name);
    }

    //工单板块选择（新建）
        $("#add-plate").on("click",function(){
            var num = $(this).attr("data-num");
            if(num==0){
                $(".addcontent-info").find(".plate-menu").show();
                $(this).attr("data-num",1);
                $(this).find("i").attr("class","up-arrows");
                $(".addplat").mouseleave(function(){
                    $(".addcontent-info").find(".plate-menu").hide();
                    $(this).find("i").attr("class","down-arrows");
                    $(this).attr("data-num",0);
                });
            };
            if(num==1){
                $(".addcontent-info").find(".plate-menu").hide();
                $(this).attr("data-num",0);
                $(this).find("i").attr("class","down-arrows");
            }
        });

    //取消新建工单
    function cencal(){
       // $("#copyadd").selectpicker('val',"");
        $(".titlename").find("input").val("");
        $(".addcontent-info").hide();
        $(".order-message").show();
        $(".orderrgt").show();
        $(".addorder").removeClass("bgwhite");
        $("#url").val("");
        $("#orderNum").val("");
        $(".order-classifyname").text("-请选择-");
        $(".order-classifyname").attr("data-id","");
        $(".order-platename").text("-请选择-");
        $(".order-platename").attr("data-id","");
        $("#ctronlUser").find("input").val("");
        $("#copyUser").find("input").val("");
        $("#moduleName").val("");
        $("#jurisdiction-begin2").val("");
        $("#jurisdiction-begin3").val("");
        editor.txt.html("");
        $(".plateinput").val("");
        $("#phone").val("");
        $("#ctronlUser").find("dl dd").removeClass("layui-this");
        $("#ctronlUser").find("dl dd").eq(0).addClass("layui-this");
        $("#datetimepicker2").attr("data-time",0);
        $("#datetimepicker3").attr("data-time",0);
        $('#datetimepicker2 input').datepicker('clearDates');
        $('#datetimepicker3 input').datepicker('clearDates');


      //  copy("#copyadd");//抄送日志
    }

    $("#cancelBtn").click(function(){
        cencal();
    });

    //正则验证
    $("#moduleName").blur(function(){
        var num = $(this).attr("data-num");
        var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
        if(!mobileExp.test($(this).val())){
            if(num == 0){
                $(this).val("");
                $(this).attr("data-num","1");
                layer.msg("账号请输入正确的手机号",
                    function(index){
                        $("#moduleName").attr("data-num","0");
                        layer.close(index);
                    });
                return false;
            }
        }
        $("#moduleName").val($(this).val());

    });

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
            var status;//状态 0： 未分配； 1：待回复；2：处理中；3已解决；4：不解决
            var categoryId = $("#order-classifyname").attr("data-id")||"";//类别id
            var plateId = $("#order-platename").attr("data-id");//板块id
            var title = $.trim($("#title").val());// 标题
            var createrId = yyCache.get("userId","");//创建人id
            var dueTime = $("#jurisdiction-begin2").val();// 到期时间
            var endTime = $("#jurisdiction-begin3").val();//解决时间
            var phone =$.trim($("#phone").val()); // 联系方式
            var handlerId = $("#ctronlUser").find("dl dd.layui-this").attr("lay-value") || "";//处理人id
            if($('#copyadd').selectpicker('val') != null){
                var copyId=$('#copyadd').selectpicker('val').toString();
            }else{
                var copyId="";
            }
            if($(".copy-common").find(".filter-option").text()=="-请选择-"){
                var copyName="";
            }else{
                var copyName=$(".copy-common").find(".filter-option").text();
            }
            var param={
                "priority": priority, //优先级 0 低 1 中 2 高 3 急
                "plateId": plateId, //版块id
                "title": title, // 标题
                "content": content,//内容
                "createrId": createrId, //创建人id
                "phone": phone, // 联系方式
                "operater":operater,//登录名称
                "operaterId":operaterId
            }

            if(dueTime != ""){
                param.dueTime=dueTime; // 到期时间
            }

            if(endTime != ""){
                param.endTime=endTime; // 解决时间
            }

            if(categoryId !=""){
                param.categoryId=categoryId; //类别id
            }
            if(phone!=""){
                param.phone=phone; // 联系方式
            }
            if(handlerId!=""){
                param.handlerId= handlerId;//处理人id
                param.status="1";//状态 0： 未分配； 1：待回复；2：处理中；3已解决；4：不解决
            }else{
                param.status="0";
            }
            if(copyId!=""){
                param.copyId= copyId;//抄送
            }
            if(copyName!=""){
                param.copyName = copyName;//抄送
            }
           reqAjaxAsync(USER_URL.ADDORDER,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    layer.msg(res.msg);
                    var sorts = $("#screensort").attr("data-val");
                    $(".orderlist").find(".hidemenu li").removeClass("actv");
                    $(".alllsit").addClass("actv");
                    if(sorts==0){

                        getOrderList("","",'asc',page,rows,"8","",operaterId,"");
                        cencal();
                    }else{
                        getOrderList("","",'desc',page,rows,"8","",operaterId,"");
                        cencal();
                    }
                }else{
                    layer.msg(res.msg);
                }
            })
        }
        return false;
    });


    //右侧用户信息
    function getAppuser(phone){
        $(".tabletxe").text("");
        if(phone!=""){
            var param = {
                "phone": phone
            };
            reqAjaxAsync(USER_URL.TICKETLIST,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    var row = res.data;
                    if(row != null){
                        $(".nodata2").hide();
                        $(".havedata2").show();
                        var appAccount=row.appAccount||"暂无";
                        var appNickname=row.appNickname||"暂无";
                        var appPhone=row.appPhone||"暂无";
                        var appUserState=row.appUserState||"暂无";
                        var appIsCert=row.appIsCert||"暂无";
                        var appUserType=row.appUserType||"暂无";
                        var merchantAccount=row.merchantAccount||"暂无";
                        var merchantLevel=row.merchantLevel||"暂无";
                        var merchantState=row.merchantState||"暂无";
                        var merchantType=row.merchantType||"暂无";
                        var merchantPhone=row.merchantPhone||"暂无";
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
                    }else{
                        $(".nodata2").show();
                        $(".havedata2").hide();
                    }
                }else{
                    layer.msg(res.msg);
                }
            });
        }
    }

    /*搜索相关*/
    $(".top-button").on("click",".searchorder",function(){
        var num = $(this).attr("data-num");
        var type = $(this).attr("data-type");
        $(".addcontent-info").hide();
        $(".searchtself").hide();
        $(".orderrgt").show();
        datetime('#datetimepicker1 input');
        datetime('#datetimepicker5 input');
        datetime('#datetimepicker6 input');
       /* if(type==0){*/
            orderCSear();
            setPlate();
           /* $(this).attr("data-type","1")
        };*/

        if(num==0){
            $(this).attr("data-num",1);
            $(".top-button").find(".top-btn").removeClass("bgwhite");
            $(this).addClass('bgwhite');
            $(".searchtip").show();
        };
        if(num==1){
            $(this).attr("data-num",0);
            $(".top-button").find(".top-btn").removeClass("bgwhite");
            $(".searchtip").hide();
        }

        //搜索分类树
        function orderCSear(){
            var setting = {
                check: {
                    enable: false,
                    chkStyle: "checkbox",
                    radioType: "all",
                    nocheckInherit: true,
                    chkDisabledInherit: true
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                view: {
                    showIcon: true
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                    drag: {
                        isCopy: false,
                        isMove: true
                    }
                },
                callback: {
                    onClick: zTreeOnClassSch
                }
            };

            var paramLft = "{}";
            reqAjaxAsync(USER_URL.ORDERCLASSIFY,paramLft).done(function(res){
                if(res.code == 1){
                    for(var i=0;i<res.data.length;i++){
                        res.data[i].id=Number(res.data[i].id);
                        res.data[i].pid=Number(res.data[i].parentId);
                        res.data[i].name=res.data[i].categoryName;
                        res.data[i].icon = "";
                        res.data[i].code = res.data[i].categoryCode;
                    }
                    seartreeClass = $.fn.zTree.init($("#classTree2"), setting, res.data);
                    seartreeClass.expandAll(true);
                }else{
                    layer.msg(res.msg);
                }
            });
        }

        //工单分类选择(搜索)
        $(".searchtip").on("click",".order-classify",function(){
                $(".searchtip").find(".classify-menu").show();
                $(this).find("i").attr("class","up-arrows");
            $(".classsc").mouseleave(function(){
                $(".searchtip").find(".classify-menu").hide();
                $(this).find("i").attr("class","down-arrows");
            });
        });

        //工单板块树搜索
        function setPlate(){
            var setting = {
                check: {
                    enable: false,
                    chkStyle: "checkbox",
                    radioType: "all",
                    nocheckInherit: true,
                    chkDisabledInherit: true
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                view: {
                    showIcon: true
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                    drag: {
                        isCopy: false,
                        isMove: true
                    }
                },
                callback: {
                    onClick: zTreeOnClickPlateSch
                }
            };

            var paramLft = "{}";
            reqAjaxAsync(USER_URL.ORDERPLATE,paramLft).done(function(res){
                if(res.code == 1){
                    for(var i=0;i<res.data.length;i++){
                        res.data[i].id=Number(res.data[i].id);
                        res.data[i].pid=Number(res.data[i].parentId);
                        res.data[i].name=res.data[i].categoryName;
                        res.data[i].icon = "";
                        res.data[i].code = res.data[i].categoryCode;
                    }
                    searchtreePlate = $.fn.zTree.init($("#plateTree2"), setting, res.data);
                    searchtreePlate.expandAll(true);
                }else{
                    layer.msg(res.msg);
                }
            });
        }


        //工单板块选择（搜索）
        $(".orderlft").on("click","#search-plate",function(){
                $(this).next(".plate-menu").show();
                $(this).find("i").attr("class","up-arrows");
            $(".platesc").mouseleave(function(){
                $(".searchtip").find(".plate-menu").hide();
                $(this).find("i").attr("class","down-arrows");
            });
        });

        //搜索工单分类树点击
        function zTreeOnClassSch(event, treeId, treeNode){
            var name = treeNode.name || "";
            var id = treeNode.id || "";
                $(".searchtip").find(".order-classifyname").text(name);
                $(".searchtip").find(".order-classifyname").attr("data-id",id);
                $(".searchtip").find(".order-classify").find("i").attr("class","down-arrows");
                $(".searchtip").find(".order-classify").attr("data-num",0);
                $(".searchtip").find(".classify-menu").hide();
        }



        //搜索工单板块树点击
        function zTreeOnClickPlateSch(event, treeId, treeNode){
            var name = treeNode.name || "";
            var id = treeNode.id || "";
                $(".searchtip").find(".order-platename").text(name);
                $(".searchtip").find(".order-platename").attr("data-id",id);
                $(".searchtip").find("#search-plate").find("i").attr("class","down-arrows");
                $(".searchtip").find("#search-plate").attr("data-num",0);
                $(".searchtip").find(".plate-menu").hide();
                $(".searchtip").find(".plateinput").val(name);
        }

    });

    //搜索条件鼠标移动显示移除
    $(".addseach").on("mouseover",".layui-form-item",function(){
        var remove = $(".removediv");
        $(this).find(remove).css("display","block");
    });
    $(".addseach").on("mouseover",".input-group",function(){
        var remove = $(".removediv");
        $(this).find(remove).css("display","block");
    });

    $(".addseach").on("mouseout",".layui-form-item",function(){
        var remove = $(".removediv");
        $(this).find(remove).css("display","none");
    });
    $(".addseach").on("mouseout",".input-group",function(){
        var remove = $(".removediv");
        $(this).find(remove).css("display","none");
    });

    $(".addseach").on("click",".layui-form-item .removediv",function(){
        $(this).parents(".layui-form-item").addClass("hid");
        var txt = ($(this).parent().text()).split("：")[0];
        var sHtml='<li>' + txt + '</li>';
        $(".screenlist ul").append(sHtml);
        $(this).parents(".layui-form-item").find("input").val("");
    });

    $(".addseach").on("click",".input-group .removediv",function(){
        var idname = $(this).parents(".input-group").find("input").attr("id");
        if(idname=="jurisdiction-begin1"){
            $("#jurisdiction-begin1").datepicker('clearDates');
            $("#jurisdiction-begin1").parent().attr("data-time","");
        }else if(idname=="jurisdiction-begin2"){
            $("#jurisdiction-begin2").datepicker('clearDates');
            $("#jurisdiction-begin2").parent().attr("data-time","");
        }else if(idname=="jurisdiction-begin3"){
            $("#jurisdiction-begin3").datepicker('clearDates');
            $("#jurisdiction-begin3").parent().attr("data-time","");
        }
    });

    //筛选条件收缩
    $(".addlist").on("click",function(){
        var num=$(this).attr("data-num");
        if(num==0){
            $(this).attr("data-num","1");
            $(".screenlist").show();
            $(".screenbox").mouseleave(function(){
                $(".screenlist").hide();
                $(".addlist").attr("data-num","0");
            });
        };
        if(num==1){
            $(this).attr("data-num","0");
            $(".screenlist").hide();
        };
    });

    //选择添加条件
    $(".screenbox").on("click",".screenlist li",function(){
        var txt = $(this).text();
        var list = $(".addseach").find("label");
        var arr=[];
        for(var i=0;i<list.length;i++){
            arr.push((list.eq(i).text()).split("：")[0]);
        }
        for(var a=0;a<arr.length;a++){
            if(txt==arr[a]){
                $(".addseach").find(".layui-form-item").eq(a).removeClass("hid");
            }
        }
        $(this).remove();
        $(".screenlist").hide();
        $(".addlist").attr("data-num","0");
    });

    //开始筛选   要修改翻页
    function customSearch(tkn,typ,inx,pagelimit,nameid) {  //加载更多里边也要调用这个方法
        var qTime = $("#jurisdiction-begin1").val() || ""; //工单的创建时间
        var cretime = $("#jurisdiction-begin1").parent().attr("data-time");//创建时间
        var qEndTime = $("#jurisdiction-begin5").val() || ""; //工单的结束时间
        var endtime = $("#jurisdiction-begin5").parent().attr("data-time");//工单的结束时间
        var qSolveTime = $("#jurisdiction-begin6").val() || "";//工单的解决时间
        var solvetime = $("#jurisdiction-begin6").parent().attr("data-time");//工单的解决时间
        var qCreater = $("#createSearch").find("dl dd.layui-this").attr("lay-value") || "";// 工单的创建人id
        var qHandler = $("#closeSearch").find("dl dd.layui-this").attr("lay-value") || "";//工单的处理人id
        var qCategory = $("#order-classifyname2").attr("data-id") || "";//工单的类别id
        var qPlate = $("#order-platename2").attr("data-id") || "";// 工单版块
        var qStatus = $("#searchStatu").find("dl dd.layui-this").attr("lay-value") || "";//工单的状态
        var qCC = $("#copySearch").find("dl dd.layui-this").attr("lay-value") || "";//抄送
        var qContact = $.trim($(".phonesc").find("input").val());//工单的联系方式（电话
        var qTicketNo = $.trim($(".numbersc").find("input").val());//工单的编号
        var qTicketContent = $.trim($(".contentsc").find("input").val());//工单的内容
        var qTicketTitle = $.trim($(".titlesc").find("input").val()); // 标题
        var orderid = $("#screensort").find("dl dd.layui-this").attr("lay-value") ||""; //时间升降序
        if(orderid==0){
            var order = "asc"
        };
        if(orderid==1){
            var order = "desc"
        }
        var param = {
            "page":pagelimit,
            "rows":rows,
            "sort": 'createTime', //如果是创建时间，就是createTime
            "order": order, // asc或者desc，升或降
            "createrId":operaterId, //条件的创建人id(必填)
            "handlerId2":operaterId,
            "copyId2":operaterId
        };
        if (qTime != "") {
            param.qTime = qTime;
        }
        if (qEndTime != "") {
            param.qEndTime = qEndTime;
        }
        if (qSolveTime != "") {
            param.qSolveTime = qSolveTime;
        }
        if (qCreater != "") {
            param.qCreater = qCreater;
        }
        if (qHandler != "") {
            param.qHandler = qHandler;
        }
        if (qCategory != "") {
            param.qCategory = qCategory;
        }
        if (qPlate != "") {
            param.qPlate = qPlate;
        }
        if (qStatus != "") {
            param.qStatus = qStatus;
        }
        if (qCC != "") {
            param.qCC = qCC;
        }
        if (qContact != "") {
            param.qContact = qContact;
        }
        if (qTicketNo != "") {
            param.qTicketNo = qTicketNo;
        }
        if (qTicketContent != "") {
            param.qTicketContent = qTicketContent;
        }
        if (qTicketTitle != "") {
            param.qTicketTitle = qTicketTitle;
        }



        if (typ == 1) {  //1只搜索
            reqAjaxAsync(USER_URL.QUERYTICKET, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                    if(res.total > 0){
                        $(".nodata1").hide();
                        $(".nodata3").hide();

                        $(".havedata").show();
                        console.log("tk0"+tkn)
                        for(var i=0;i<res.data.length;i++){
                            var row = res.data[i];
                            console.log(tkn + "vs" +row.ticketNo)
                            if(tkn==row.ticketNo){
                                console.log("tk"+tkn)
                                orderList(res,inx);
                                break;
                            }
                            if(i==res.data.length-1){
                                console.log(200)
                                orderList(res,0);
                            }
                        }
                       /*orderList(res,inx);*/
                        //分页
                        layui.use('laypage', function(){
                            var laypage = layui.laypage;

                            //执行一个laypage实例
                            laypage.render({
                                elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                                ,count: res.total //数据总数，从服务端得到
                                ,groups:2
                                ,limit:rows
                                ,prev:'<'
                                ,next:'>'
                                ,jump: function(obj, first){


                                    //首次不执行
                                    if(!first){
                                        //obj包含了当前分页的所有参数，比如：
                                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                                        console.log(obj.limit); //得到每页显示的条数
                                        param.page=obj.curr;
                                        reqAjaxAsync(USER_URL.QUERYTICKET,JSON.stringify(param)).done(function(res){
                                            if(res.code==1){
                                                console.log("tk0"+tkn)
                                                for(var i=0;i<res.data.length;i++){
                                                    var row = res.data[i];
                                                    console.log(tkn + "vs" +row.ticketNo)
                                                    if(tkn==row.ticketNo){
                                                        console.log("tk"+tkn)
                                                        orderList(res,inx);
                                                        break;
                                                    }
                                                    if(i==res.data.length-1){
                                                        console.log(200)
                                                        orderList(res,0);
                                                    }
                                                }
                                            }else{
                                                layer.msg(res.msg);
                                            }
                                        })
                                    }
                                }
                            });

                        });

                    }else{
                        $(".nodata1").show();
                        $(".nodata2").show();
                        $(".nodata3").show();
                        $(".havedata").hide();
                        $(".havedata2").hide();
                        return ;
                    }
                    $(".addmore").attr("data-statu","1");
                } else {
                    layer.msg(res.msg);
                }
            })
        };
        if (typ == 2) {  //2通过名称搜索
            var pm = {
                "id": nameid,  //名称id
                "page":pagelimit,
                "rows":rows,
                "sort": 'createTime', //如果是创建时间，就是createTime
                "order": order, // asc或者desc，升或降
                "handlerId2":operaterId,
                "copyId2":operaterId
            }
            reqAjaxAsync(USER_URL.QUERYTICKET, JSON.stringify(pm)).done(function (res) {
                if (res.code == 1) {
                    if(res.total > 0){
                        $(".nodata1").hide();
                        $(".nodata3").hide();
                        $(".havedata").show();
                        console.log("tk0"+tkn)
                        for(var i=0;i<res.data.length;i++){
                            var row = res.data[i];
                            console.log(tkn + "vs" +row.ticketNo)
                            if(tkn==row.ticketNo){
                                console.log("tk"+tkn)
                                orderList(res,inx);
                                break;
                            }
                            if(i==res.data.length-1){
                                console.log(200)
                                orderList(res,0);
                            }
                        }
                        //分页
                        layui.use('laypage', function(){
                            var laypage = layui.laypage;

                            //执行一个laypage实例
                            laypage.render({
                                elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                                ,count: res.total //数据总数，从服务端得到
                                ,groups:2
                                ,limit:rows
                                ,prev:'<'
                                ,next:'>'
                                ,jump: function(obj, first){

                                    //首次不执行
                                    if(!first){
                                        //obj包含了当前分页的所有参数，比如：
                                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                                        console.log(obj.limit); //得到每页显示的条数
                                        pm.page=obj.curr;
                                        reqAjaxAsync(USER_URL.QUERYTICKET,JSON.stringify(pm)).done(function(res){
                                            if(res.code==1){
                                                console.log("tk0"+tkn)
                                                for(var i=0;i<res.data.length;i++){
                                                    var row = res.data[i];
                                                    console.log(tkn + "vs" +row.ticketNo)
                                                    if(tkn==row.ticketNo){
                                                        console.log("tk"+tkn)
                                                        orderList(res,inx);
                                                        break;
                                                    }
                                                    if(i==res.data.length-1){
                                                        console.log(200)
                                                        orderList(res,0);
                                                    }
                                                }
                                            }else{
                                                layer.msg(res.msg);
                                            }
                                        })
                                    }
                                }
                            });

                        });
                    }else{
                        $(".nodata1").show();
                        $(".nodata2").show();
                        $(".nodata3").show();
                        $(".havedata").hide();
                        $(".havedata2").hide();
                        return ;
                    }


                    $(".addmore").attr("data-statu","2");
                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }

    //点击筛选
    $("#diysearch").on("click",function(){

        var qTime = $("#jurisdiction-begin1").val() || ""; //工单的创建时间
        var cretime = $("#jurisdiction-begin1").parent().attr("data-time");//创建时间
        var qEndTime = $("#jurisdiction-begin5").val() || ""; //工单的结束时间
        var endtime = $("#jurisdiction-begin5").parent().attr("data-time");//工单的结束时间
        var qSolveTime = $("#jurisdiction-begin6").val() || "";//工单的解决时间
        var solvetime = $("#jurisdiction-begin6").parent().attr("data-time");//工单的解决时间

        if(qTime!=""&&qEndTime!=""){
            if(cretime>endtime){
                layer.msg("创建时间不能晚于截止时间哟");
                return false;
            }
        }

        if(qTime!=""&&qSolveTime!=""){
            if(cretime>solvetime){
                layer.msg("创建时间不能晚于解决时间哟");
                return false;
            }
        }

        if(qEndTime!=""&&qSolveTime!=""){
            if(endtime<solvetime){
                layer.msg("截止时间不能早于解决时间哟");
                return false;
            }
        }


        $(".addmore").attr("data-num","1");
        $(".sortcontent").html("");
        customSearch("",1,"",1);
        $(".searchtip").hide();
        $(".searchorder").attr("data-num",0);
        $(".searchtip").find("input").val("");
        $("#order-classifyname2").text('-请选择-');
        $("#order-platename2").text('-请选择-');
        $("#search-class").attr('data-num',0);
        $("#search-plate").attr('data-num',0);
        $("#order-classifyname2").attr('data-id',"");
        $("#order-platename2").attr('data-id',"");
    });

    //保存自定义搜索
    $("#savesearch").on("click",function(){
        var a=$(".addmore").attr("data-self");
        var ss = ++a;
        var qTime = $("#jurisdiction-begin1").val() || ""; //工单的创建时间
        var cretime = $("#jurisdiction-begin1").parent().attr("data-time");//创建时间
        var qEndTime = $("#jurisdiction-begin5").val() || ""; //工单的结束时间
        var endtime = $("#jurisdiction-begin5").parent().attr("data-time");//工单的结束时间
        var qSolveTime = $("#jurisdiction-begin6").val() || "";//工单的解决时间
        var solvetime = $("#jurisdiction-begin6").parent().attr("data-time");//工单的解决时间

        if(qTime!=""&&qEndTime!=""){
            if(cretime>endtime){
                layer.msg("创建时间不能晚于截止时间哟");
                return false;
            }
        }

        if(qTime!=""&&qSolveTime!=""){
            if(cretime>solvetime){
                layer.msg("创建时间不能晚于解决时间哟");
                return false;
            }
        }

        if(qEndTime!=""&&qSolveTime!=""){
            if(endtime<solvetime){
                layer.msg("截止时间不能早于解决时间哟");
                return false;
            }
        }


        layer.open({
            title: ['添加', 'font-size:12px;background-color:#0678CE;color:#fff'],
            btn: ['保存', '取消'],
            type: 1,
            content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['400px', '180px'],
            shade: [0.1, '#fff'],
            resize:false,
            end: function () {
                $('#demo111').hide();
            },
            success: function (layero) {
                $(layero).find('#address').val("");
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit", "");
                $("a.layui-layer-btn0").attr("lay-filter", "formdemo");
            },
            yes: function (index, layero) {
                form.on('submit(formdemo)',function(data) {
                    if (data) {
                        var customName = $.trim($("#address").val());//搜索条件的名称(必填)
                        var qTime = $("#jurisdiction-begin1").val() || ""; //工单的创建时间
                        var qEndTime = $("#jurisdiction-begin5").val() || ""; //工单的结束时间
                        var qSolveTime = $("#jurisdiction-begin6").val() || "";//工单的解决时间
                        var qCreater = $("#createSearch").find("dl dd.layui-this").attr("lay-value") || "";// 工单的创建人id
                        var qHandler = $("#closeSearch").find("dl dd.layui-this").attr("lay-value") || "";//工单的处理人id
                        var qCategory = $("#order-classifyname2").attr("data-id") || "";//工单的类别id
                        var qPlate = $("#order-platename2").attr("data-id") || "";// 工单版块
                        var qStatus = $("#searchStatu").find("dl dd.layui-this").attr("lay-value") || "";//工单的状态
                        var qCC = $("#copySearch").find("dl dd.layui-this").attr("lay-value") || "";//抄送
                        var qContact = $.trim($(".phonesc").find("input").val());//工单的联系方式（电话
                        var qTicketNo = $.trim($(".numbersc").find("input").val());//工单的编号
                        var qTicketContent = $.trim($(".contentsc").find("input").val());//工单的内容
                        var qTicketTitle = $.trim($(".titlesc").find("input").val()); // 标题
                        var param = {
                            "page":page,
                            "rows":rows,
                            "createrId":operaterId, //条件的创建人id(必填)
                            "customName":customName
                        };
                        if (qTime != "") {
                            param.qTime = qTime;
                        }
                        if (qEndTime != "") {
                            param.qEndTime = qEndTime;
                        }
                        if (qSolveTime != "") {
                            param.qSolveTime = qSolveTime;
                        }
                        if (qCreater != "") {
                            param.qCreater = qCreater;
                        }
                        if (qHandler != "") {
                            param.qHandler = qHandler;
                        }
                        if (qCategory != "") {
                            param.qCategory = qCategory;
                        }
                        if (qPlate != "") {
                            param.qPlate = qPlate;
                        }
                        if (qStatus != "") {
                            param.qStatus = qStatus;
                        }
                        if (qCC != "") {
                            param.qCC = qCC;
                        }
                        if (qContact != "") {
                            param.qContact = qContact;
                        }
                        if (qTicketNo != "") {
                            param.qTicketNo = qTicketNo;
                        }
                        if (qTicketContent != "") {
                            param.qTicketContent = qTicketContent;
                        }
                        if (qTicketTitle != "") {
                            param.qTicketTitle = qTicketTitle;
                        }

                        reqAjaxAsync(USER_URL.ADDQUERY, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg(res.msg);
                                getCustom();//自定义初始化搜索
                                $(".addmore").attr("data-num","1");
                                customSearch("",1,"",1);
                                layer.close(index);
                                $(".searchtip").hide();
                                $(".searchorder").attr("data-num",0);
                                $(".searchtip").find("input").val("");
                                $("#order-classifyname2").text('-请选择-');
                                $("#order-platename2").text('-请选择-');
                                $("#search-class").attr('data-num',0);
                                $("#search-plate").attr('data-num',0);
                                $("#order-classifyname2").attr('data-id',"");
                                $("#order-platename2").attr('data-id',"");
                            }else{
                                layer.msg(res.msg);
                            }
                        })

                    }
                })
            }
        })
    });

    //自定义搜索名称初始化方法
    function customList(res){
        var sHtml="";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            sHtml+='<li data-id="'+ row.id +'"><div class="selfli">' + row.customName + '</div></li>';
        }
        $("#customList").html(sHtml);
    }

    //自定义搜索名称初始化
    function getCustom(){
        var param = {
            "createrId":operaterId
        }
        reqAjaxAsync(USER_URL.GETQUERY, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                customList(res);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击自定义搜索进行搜索
    $("#custombox").on("click","ul li .selfli",function(){
        $(".sortcontent").html("");
        var nam=$(this).text();
        var id = $(this).parent().attr("data-id");
        $(".addmore").attr("data-statu",2);
        customSearch("",2,"",1,id);
        $(".searchtip").hide();
        $(".searchorder").attr("data-num",0);
        $(".searchtip").find("input").val("");
        $("#order-classifyname2").text('-请选择-');
        $("#order-platename2").text('-请选择-');
        $("#search-class").attr('data-num',0);
        $("#search-plate").attr('data-num',0);
        $("#order-classifyname2").attr('data-id',"");
        $("#order-platename2").attr('data-id',"");
    });

    //自定义条件查看
   /* $("#custombox").on("click","ul li i",function(){
        $(".searchtself").show();
        $(".addcontent-info").hide();
        $(".orderrgt").show();
    });*/

})(jQuery);