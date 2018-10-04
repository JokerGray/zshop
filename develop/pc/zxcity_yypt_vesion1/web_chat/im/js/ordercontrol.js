    var page = 1;
    var rows = 6;
    var username = yyCache.get('username', "");
    var operater = yyCache.get("pcNickname", ""); //用户昵称
    var operaterId = yyCache.get("userId", ""); //登陆者id
    var pid = '';
    var replyArr;
    var layer = layui.layer;
    layui.use('form', function(){
        form = layui.form;

    })
    var USER_URL = {
        TICKETLIST: 'operations/serviceUserDetails', //(获取(app和商户)客户的详情)
        QUICKREPLY:'operations/quickNoteFullList',//查询快速回复列表
        SINGLERESOURCE : 'operations/knowledgeList', //(查询知识库列表)
        ORDERCLASSIFY : 'operations/getJobOrderCategories', //(查询工单类别)
        ORDERPLATE : 'operations/getJobOrderSections', //(查询工单版块)
        ADDORDER : 'operations/newTicket',//(新增工单)
        SERVICESTAFF : 'operations/customerServiceStaffs',//(客服人员)
        ALLREPLY:'operations/findTKnowledgeQuickReplyAll' //所有快捷回复
    };

    $(function(){ //初始化
        quickReply();
        getReply();
    })
    var editor = initEditor("editor_id0"); //新建工单描述
    //切换tab
    $(".right-order").on("click",".orderlist li",function(){
        var inx = $(this).index();
        $(".orderlist li").removeClass("avl");
        $(this).addClass("avl");
        $(".ordercontent .common-list").hide();
        $(".ordercontent .common-list").eq(inx).show();
    });

    //点击左侧好友显示用户资料
    $(".list").on("click",".j-friend li",function(){
        var tel = $(this).attr("data-account");
        userInfo(tel);
    });


    //获取所有快捷回复
    function getReply(){
        reqAjaxAsync(USER_URL.ALLREPLY,"").done(function(res){
            if(res.code == 1){
                replyArr=res.data;
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //enter事件
    $("#j-messageText").blur(function(){
        $(this).focus();
    });

    $("#j-messageText").on('keypress',function(event){
       $(this).focus();
        if(event.keyCode == 13)
        {
            var val = $("#j-messageText").val();
            if(replyArr.length>0){
                for(var i=0;i<replyArr.length;i++){
                    if(val==replyArr[i].shortcutWords){
                        $("#j-messageText").val(replyArr[i].replyContent);
                        return false;
                    }
                }
            }
        }else{
            $(this).focus();
        }

    });


    //用户资料
    function userInfo(phone){
        if(phone!=""){
            var param = {
                "phone": phone
            };
            reqAjaxAsync(USER_URL.TICKETLIST,JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    var row = res.data || "";
                    if(row != ""){
                        $(".ordercontent .common-list").eq(0).find(".nodata2").hide();
                        $(".ordercontent .common-list").eq(0).find(".havedata2").show();
                        var appAccount=row.appAccount||"暂无";
                        var appNickname=row.appNickname||"暂无";
                        var appPhone=row.appPhone||"暂无";
                        var appUserState=row.appUserState||"暂无";
                        var appIsCert=row.appIsCert||"暂无";
                        var appUserType=row.appUserType||"暂无";
                        $(".appaccount").text(appAccount);
                        $(".appnickname").text(appNickname);
                        $(".appphone").text(appPhone);
                        $(".appu-serstate").text(appUserState);
                        $(".app-iscert").text(appIsCert);
                        $(".app-usertype").text(appUserType);
                    }else{
                        $(".ordercontent .common-list").eq(0).find(".nodata2").show();
                        $(".ordercontent .common-list").eq(0).find(".havedata2").hide();
                    }
                }else{
                    layer.msg(res.msg);
                }
            });
        }
    }

    //快捷回复初始方法
    function quick(res){
        var sHtml="";
        var rw = res.data || "";
        if(rw!=""){
            for(var i=0;i<res.data.length;i++){
                var row = res.data[i];
                var children = row.children || "";
                sHtml += '<li>'+
                            '<a data-num="0"><i class="downicon layui-icon">&#xe625;</i>' + row.groupName +'</a>'
                            if(children!=""){
                                sHtml += '<ul class="com-ul welword">'
                                for(var k=0;k<children.length;k++){
                                    var raw = children[k];
                                    sHtml += '<li>'+ raw.content + '</li>'
                                }
                                sHtml += '</ul>'
                            }
                sHtml += '</li>'
            }
            $(".replys ul").html(sHtml);
        }
    }


    //快捷回复
    function quickReply(){
        var param = {}
        reqAjaxAsync(USER_URL.QUICKREPLY,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                quick(res);
            }else{
                layer.msg(res.msg);
            }
        })
    }



    //快捷回复折叠
    $(".replys").on("click","li a",function(){
        var num=$(this).attr("data-num");
        if(num==0){
            $(".replys .com-ul").hide();
            $(".replys .reply-li li a").attr("data-num",0);
            $(this).next().show();
            $(this).attr("data-num",1);
        }
        if(num==1){
            $(this).next().hide();
            $(this).attr("data-num",0);
        }
    });

    //点击选中快捷回复j-messageText
    $(".replys").on("click",".com-ul li",function(){
        var claname = $("#j-messageText").parents("#j-rightPanel").attr("class");
        var txt = $(this).text();
        if(claname.indexOf("hide")==-1){
            $("#j-messageText").val(txt);
        }
    });

    //知识库
    //知识库列表方法
    function detailList(res) {
        var sHtml = "";
        for (var i = 0; i < res.data.length; i++) {
            var row = res.data[i];
            var content = row.content;
            if(content.length>30){
                var newcont = content.substring(0,30)+"...";
                sHtml += '<div class="detail-list" >' +
                '<div class="detail-top">' +
                '<div class="detail-title">问题：' + row.title + '</div>' +
                '</div>' +
                '<div class="datail-content">回答：' + newcont + '<a class="open">[展开]</a></div>' +
                '<div class="datail-contenthid">回答：' + content + '<a class="picckup">[收起]</a></div>' +
                '</div>';
            }else{
                var newcont = content;
                sHtml += '<div class="detail-list" >' +
                '<div class="detail-top">' +
                '<div class="detail-title">问题：' + row.title + '</div>' +
                '</div>' +
                '<div class="datail-content">回答：' + newcont + '</div>' +
                '</div>';
            }
        }
        $(".detail").html(sHtml);
    }

    //展开收起
    $(".detail").on("click",".detail-list .open",function(){
        $(this).parents(".datail-content").hide();
        $(this).parents(".datail-content").next().show();
    });

    $(".detail").on("click",".detail-list .picckup",function(){
        $(this).parent().hide();
        $(this).parent().prev().show();
    });

    //全部加载初始化
    function all(title) {
        var param = {
            "page": page,//第几页
            "rows": rows,//每页多少条
            "sort": "updateTime",//排序字段，一般是updateTime
            "order": "desc",//顺序，asc正序，desc倒序,
            "title": title //标题
        }
        reqAjaxAsync(USER_URL.SINGLERESOURCE, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                if (res.total > 0) {
                    $(".nodata2").hide();
                    $(".repsionlist").show();
                    detailList(res);
                    //分页
                    layui.use('laypage', function () {
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            , count: res.total //数据总数，从服务端得到
                            , groups: 4
                            , limit: rows
                            , prev: '<'
                            , next: '>'
                            , jump: function (obj, first) {
                                //obj包含了当前分页的所有参数，比如：

                                //首次不执行
                                if (!first) {
                                    param.page = obj.curr;
                                    reqAjaxAsync(USER_URL.SINGLERESOURCE, JSON.stringify(param)).done(function (res) {
                                        if (res.code == 1) {
                                            detailList(res);
                                        } else {
                                            layer.msg(res.msg);
                                        }
                                    })
                                }
                            }
                        });

                    });
                } else {
                    $(".nodata2").show();
                    $(".repsionlist").hide();
                    return;
                }

            } else {
                layer.msg(res.msg);
            }
        })
    }

    //点击搜索
    $(".searchicon").click(function(){
        var title = $.trim($("#searchName").val());
        all(title);
    });

    //工单分类方法
    function orderClassify(){
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
                onClick: zTreeOnClickClass
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
                newtreeClass = $.fn.zTree.init($("#classTree"), setting, res.data);
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
    function orderPlate(){
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
                onClick: zTreeOnClickPlate
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
                newtreePlate = $.fn.zTree.init($("#plateTree"), setting, res.data);
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
        $(".titlename").find("input").val("");
        $(".order-message").show();
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


    //新建工单
    $("#j-order").on("click",function(){
        layer.open({
            title: ['新建工单', 'font-size:12px;background-color:#0678CE;color:#fff'],
            btn: ['保存', '取消'],
            type: 1,
            offset:'30px',
            content: $('#orderli'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['1000px', '810px'],
            shade: [0.1, '#fff'],
            end: function () {
                $('#orderli').hide();
                cencal();
            },
            success: function (layero) {
                $(layero).find('#address').val("");
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit", "");
                $("a.layui-layer-btn0").attr("lay-filter", "formdemo");


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
                datetimeNew('#datetimepicker2 input');
                datetimeNew('#datetimepicker3 input');

                 orderClassify(); //新建工单分类
                 orderPlate(); //新建工单板块
                 copy("#copyadd");//新建抄送
                $("#createName").val(operater);
                allocation();//分配人


                //新增优先级切换
                form.on('radio(levelradio)', function(data){
                    $("#statuName").attr("data-statu",data.value)
                });




            },
            yes: function (index, layero) {
                form.on('submit(formdemo)', function (data) {
                    if (data) {
                        var content = editor.txt.html();//富文本内容
                        if (content === "<p><br></p>" || content === "<p>&nbsp;</p>") {
                            layer.msg("工单描述不能为空哟",
                                function (index) {
                                    layer.close(index);
                                });
                            return false;
                        }
                        var priority = $("#statuName").attr("data-statu") || 0;//优先级 0 低 1 中 2 高 3 急
                        var status;//状态 0： 未分配； 1：待回复；2：处理中；3已解决；4：不解决
                        var categoryId = $("#order-classifyname").attr("data-id") || "";//类别id
                        var plateId = $("#order-platename").attr("data-id");//板块id
                        var title = $.trim($("#title").val());// 标题
                        var createrId = yyCache.get("userId", "");//创建人id
                        var dueTime = $("#jurisdiction-begin2").val();// 到期时间
                        var endTime = $("#jurisdiction-begin3").val();//解决时间
                        var begtim = $("#jurisdiction-begin2").parent().attr('data-time');
                        var endtim = $("#jurisdiction-begin3").parent().attr('data-time');
                        var phone = $.trim($("#phone").val()); // 联系方式
                        var handlerId = $("#ctronlUser").find("dl dd.layui-this").attr("lay-value") || "";//处理人id
                        if ($('#copyadd').selectpicker('val') != null) {
                            var copyId = $('#copyadd').selectpicker('val').toString();
                        } else {
                            var copyId = "";
                        }
                        if ($(".copy-common").find(".filter-option").text() == "-请选择-") {
                            var copyName = "";
                        } else {
                            var copyName = $(".copy-common").find(".filter-option").text();
                        }
                        if(begtim<endtim){
                            layer.msg("截止时间不能早于解决时间哟");
                            return false;
                        }
                        var param = {
                            "priority": priority, //优先级 0 低 1 中 2 高 3 急
                            "plateId": plateId, //版块id
                            "title": title, // 标题
                            "content": content,//内容
                            "createrId": createrId, //创建人id
                            "phone": phone, // 联系方式
                            "operater": operater,//登录名称
                            "operaterId": operaterId
                        }

                        if (dueTime != "") {
                            param.dueTime = dueTime; // 到期时间
                        }

                        if (endTime != "") {
                            param.endTime = endTime; // 解决时间
                        }

                        if (categoryId != "") {
                            param.categoryId = categoryId; //类别id
                        }
                        if (phone != "") {
                            param.phone = phone; // 联系方式
                        }
                        if (handlerId != "") {
                            param.handlerId = handlerId;//处理人id
                            param.status = "1";//状态 0： 未分配； 1：待回复；2：处理中；3已解决；4：不解决
                        } else {
                            param.status = "0";
                        }
                        if (copyId != "") {
                            param.copyId = copyId;//抄送
                        }
                        if (copyName != "") {
                            param.copyName = copyName;//抄送
                        }
                        reqAjaxAsync(USER_URL.ADDORDER, JSON.stringify(param)).done(function (res) {
                            if (res.code == 1) {
                                layer.close(index);
                                layer.msg(res.msg);
                                cencal();
                            } else {
                                layer.msg(res.msg);
                            }
                        })
                    }
                    return false;
                })
            }
        })
    });