(function($){
    var page = 1;
    var rows = 9;
    var username = yyCache.get('username');
    var operater = yyCache.get("pcNickname"); //用户名称
    var operaterId = yyCache.get("userId"); //登陆者id
    var USER_URL = {
        RESOURLIST : 'operations/knowledgeCategoryList', //(获取知识库分类列表)
        ADDORDER : 'operations/knowledgeCategoryAdd',//(新增知识库类别)
        DELCLASS :'	operations/knowledgeCategoryRemove',//(删除知识库类别)
        UPDATECLASS : 'operations/knowledgeCategoryUpdate',//(修改知识库类别)
        ADDCLASS:'	operations/knowledgeAdd',//(新增知识点)
        SINGLERESOURCE : 'operations/knowledgeList', //(查询知识库列表)
        SERVICESTAFF : 'operations/knowledgeInfo', //(获取知识详情)
        UPDATELOG : 'operations/knowledgeUpdate', //更新知识（批量）
        REPLYLOG :'operations/knowledgeRemove',//（删除知识(批量)）
        TRASH : 'operations/recycleList', //查询回收站
        TRASHINFO : 'operations/recycleInfo', //回收站详情
        DELTRASH : 'operations/knowledgeRestore', //删除回收站
        QUERYREPLY : 'operations/quickNoteList', //查询快速回复列表
        REPLYINFO : 'operations/quickNoteInfo', //查询快捷回复详情
        UPDATAREPLY : 'operations/quickNoteUpdate', //修改快捷回复
        DELREPLY : 'operations/quickNoteRemove',//删除快捷回复
        ADDREPLY : 'operations/quickNoteAdd', //添加快捷回复
        TAGLIST : 'operations/similarTags', // 查询标签
        TAGDETAIL : 'operations/knowledgeListByTag', //查询标签列表
        CLEAR:'operations/cleanUpTrash' //一键清空
    };

    var layer = layui.layer;
    layui.use('form', function(){
        form = layui.form;

    });

    //日期格式化方法
    Date.prototype.pattern=function(fmt) {
        var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours()%24 == 0 ? 24 : this.getHours()%24, //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    //var editor1 = initEditor("editor_id0"); //新建
    //var editors = initEditor("editor_id1"); //修改

    //初始化
    $(function(){
        $(".jurisdiction-right").find(".contentlist").hide();
        $(".jurisdiction-right").find(".contentlist").eq(0).show();
        getClass(0); //加载知识库
       tagAjax(1);//初始加载标签
      //  classSelect(0);//移动分类
        setTimeout(function(){
            var id = $(".addli .hidemenu").find("li").eq(0).attr("data-id");
            getDetailList(0,0,id);//加载知识列表默认分类的第一个
        },500);

        //标签相关操作
        $("#addTag .adatitle").click(function(){
            var tags = $.trim($(".addinputtag").val());
            var id = $(this).parent().attr("id");
            if(tags!=''){
                addTag($(".addinputtag"),1);
                //  $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        });
        $("#changeTag .adatitle").click(function(){
            var tags = $.trim($(".addinputtag").val());
            var id = $(this).parent().attr("id");
            if(tags!=''){
                addTag($(".addinputtag"),2);
              //  $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        });
        $("#addTag .tags_enter").blur(function() { //焦点失去触发
            var txtvalue=$(this).val().trim();
            var id = $(".adatitle").parent().attr("id");
            if(txtvalue!=''){
                addTag($(this),1);
                $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        }).keydown(function(event) {
            var id = $(".adatitle").parent().attr("id");
            var key_code = event.keyCode;
            var txtvalue=$(this).val().trim();
            if (key_code == 13&& txtvalue != '') { //enter
                addTag($(this),1);
            }
            if (key_code == 32 && txtvalue!='') { //space
                addTag($(this),1);
            }
        });
        $("#changeTag .tags_enter").blur(function() { //焦点失去触发
            var txtvalue=$(this).val().trim();
            var id = $(".adatitle").parent().attr("id");
            if(txtvalue!=''){
                addTag($(this),2);
                $(this).parents(".tags").css({"border-color": "#d5d5d5"})
            }
        }).keydown(function(event) {
            var id = $(".adatitle").parent().attr("id");
            var key_code = event.keyCode;
            var txtvalue=$(this).val().trim();
            if (key_code == 13&& txtvalue != '') { //enter
                addTag($(this),2);
            }
            if (key_code == 32 && txtvalue!='') { //space
                addTag($(this),2);
            }
        });
        /*$(".close").on("click", function() {
            $(this).parent(".tag").remove();
        });*/
        $(".tags").click(function() {
            $(this).css({"border-color": "#f59942"})
        }).blur(function() {
            $(this).css({"border-color": "#d5d5d5"})
        })
    })

    //获取知识库分类方法
    function classify(res,inx){
        var sHtml="";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            sHtml += '<li class="managelist" data-parentId="' + row.parentId + '" data-id="'+ row.id +'">' +
                      '<div class="change-input">' +
                        '<input type="text" placeholder="请输入1-5个字">' +
                            '<i class="savebtn layui-icon">&#xe605;</i>' +
                            '<i class="closebtn layui-icon">&#x1006;</i>' +
                        '</div>' +
                        '<div class="listtext">' +
                            '<span class="manage-name">' + row.categoryName + '</span>(<span class="manage-num">'+ row.count + '</span>)'+
                        '</div>' +
                        '<div class="list-ctronl">' +
                            '<i class="addbtn layui-icon">&#xe654;</i>' +
                            '<i class="delbtn layui-icon">&#xe640;</i>' +
                            '<i class="editbtn layui-icon">&#xe642;</i>' +
                        '</div>' +
                    '</li>';
        }
        $("#knowClassify").html(sHtml);
        if(inx == 0){
            $("#knowClassify").find(".managelist").eq(0).addClass("actv");
        }else if(inx=="-1"){
            $("#knowClassify").find(".managelist").removeClass("actv");
        }else{
            $("#knowClassify").find(".managelist").eq(inx).addClass("actv");
        }
    }

    //知识库分类加载
    function getClass(inx){
        var param={
            count:0
        };
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                classify(res,inx);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //针对分类鼠标滑动效果
    $(".hidemenu").on("mouseover",".managelist",function(){
        $(this).find(".list-ctronl").show();
    })
    $(".hidemenu").on("mouseleave",".managelist",function(){
        $(this).find(".list-ctronl").hide();
    })


    //添加分类
    $(".addicon").click(function(){
        $(".changeknow").hide();
        var nums = $(this).next().attr("data-num");
        if(nums==1){
            $(this).next().next(".hidemenu").show();
            $(this).next().attr("data-num",0);
        }
        var list = $(".addli").find(".hidemenu li");
        for(var i=0;i<list.length;i++){
            if(list.eq(i).attr("id")=="inputAdd"){
                return false;
            }
        }
        var sHtml = '<li id="inputAdd" class="managelist">' +
            '<div class="change-input">' +
            '<input type="text" placeholder="请输入1-5个字">' +
            '<i data-num="2" class="savebtn layui-icon">&#xe605;</i>' +
            '<i class="closebtn layui-icon">&#x1006;</i>' +
            '</div>' +
            '</li>';
        $("#knowClassify").append(sHtml);
        $("#inputAdd").find(".change-input").show();
        //取消
        $("#knowClassify").on("click","#inputAdd .closebtn",function(){
            $("#inputAdd").remove();
        })
    });

    //保存
    $("#knowClassify").on("click",".savebtn",function(){
        console.log(22)
        var num = $(this).attr("data-num");
        if(num==2){
            var categoryName = $.trim($(this).prev("input").val());
            if(categoryName==""){
                layer.msg("请输入名称");
                return false;
            }
            if(categoryName.length>5){
                layer.msg("请输入1-5个字");
                return;
            }
            var param={
                "categoryName": categoryName, //类别名称
                "parentId": ""//父级的id, 没有就空
            };
            reqAjaxAsync(USER_URL.ADDORDER,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    console.log(33)
                    getClass(0);
                    classSelect(0);
                }else{
                    layer.msg(res.msg);
                }
            })
        }
    });

    //删除
    $("#knowClassify").on("click",".managelist .delbtn",function(){
        var id = $(this).parents(".managelist").attr("data-id");
        var num = $(this).parents(".managelist").find(".listtext .manage-num").text();
        var title = $.trim($("#searchName").val());
            layer.confirm("确认删除？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
            var param = {
                "id":id
            }
            reqAjaxAsync(USER_URL.DELCLASS,JSON.stringify(param)).done(function(res) {
                 if (res.code == 1) {
                     layer.msg(res.msg);
                         getClass(0);
                         classSelect(0);
                         var categoryId = $(".hidemenu .actv").attr("data-id");
                         getDetailList(0,0,categoryId);

                 }else{
                     layer.msg(res.msg);
                 }
             })
            })

    })

    //修改分类名称
    $("#knowClassify").on("click",".managelist .editbtn",function(){
        var parent = $(this).parents(".managelist");
        parent.find(".change-input").show();
        var olaval = parent.find(".manage-name").text();
        parent.find(".change-input input").val(olaval);
        parent.find(".change-input .savebtn").attr("data-num",1); //1-修改 2-添加
        //保存修改
        var num = parent.find(".change-input .savebtn").attr("data-num");
        if(num==1){
            parent.find(".change-input .savebtn").click(function(){
                var id = parent.attr("data-id");
                var parentId = parent.attr("data-parentId");
                var categoryName = $.trim(parent.find(".change-input input").val());
                if(categoryName==""){
                    layer.msg("请输入名称");
                }else if(categoryName.length>5){
                        layer.msg("请输入1-5个字");
                        return;
                }else{
                    var param = {
                        "id":id,
                        "categoryName":categoryName,
                        "parentId":parentId
                    }
                    reqAjaxAsync(USER_URL.UPDATECLASS,JSON.stringify(param)).done(function(res) {
                        if (res.code == 1) {
                            layer.msg(res.msg);
                            getClass(0);
                        }else{
                            layer.msg(res.msg);
                        }
                    })
                }
            });
            //取消
            parent.find(".change-input .closebtn").click(function(){
                parent.find(".change-input").hide();
            })
        }
    });

    //点击左侧菜单改变效果
    $(".hidemenu").on("click","li .listtext",function(){
        $(".jurisdiction-left").find("ul li").removeClass("actv");
        $(".hidemenu li").removeClass("actv");
        $(this).parent().addClass("actv");
        var categoryId = $(this).parent().attr("data-id") || "";
        var statu = $(this).parent().attr("data-statu") || "";
        var name = $(this).parent().attr("data-name") || "";
        var tagid = $(this).parent().attr("data-tagid") || "";
        var txt = $(".jurisdiction-left").find("li.actv").attr("data-text") || "";
        $("#searchName").val("");
        $(".changeknow").hide();
        $(".newknow").hide();
        $(".rubbish").removeClass("actv");
        if(name !=""){
            reply(0,name);//快捷回复
        }
        if(categoryId!=""){
            if(txt == "1"){
                getDetailList(1,0,categoryId);//知识库分类
            }else{
                getDetailList(0,0,categoryId);//知识库分类
            }

        }
        if(tagid!=""){
            getTagList(0,tagid);//知识库标签
        }
    });

    //点击左侧收缩展开效果
    $(".jurisdiction-left").on("click",".titlt-slide",function(){
        var num = $(this).attr("data-num");
        if(num==0){
            $(this).next(".hidemenu").hide();
            $(this).attr("data-num",1);
        }
        if(num==1){
            $(this).next(".hidemenu").show();
            $(this).attr("data-num",0);
        }
    });

    //添加子级（分类）
    $("#knowClassify").on("click",".managelist .addbtn",function(){
        $(".hidetags").html("");
        $(".changeknow").hide();
        $(".hidemenu li").removeClass("actv");
        var nam = $(this).parents(".managelist").attr("class");
        var inx = $(this).parents(".managelist").index();
        var classname = $(this).parents(".managelist").find(".manage-name").text();
        var categoryId = $(this).parents(".managelist").attr("data-id");
        var title = $.trim($("#searchName").val());

        if(nam.indexOf("actv") == -1){
            $(".hidemenu li").removeClass("actv");
            $(this).parents(".managelist").addClass("actv");
            getDetailList(0,0,categoryId,"",title);
        }
        $("#addTag").show();
        $("#addTitle").val("");
        $("#addIntro").val("");
        //初始化标签
     //   taglist("#addTag",1);
     //   editor1.txt.html("");
        $("#editor_id0").val("");
        $(".newknow").show();
        $("#newClassify").val(classname);

        var createTime = new Date().pattern("yyyy-MM-dd hh:mm:ss");

        //新增标签
        //addtag("#addTag");

        //保存
        form.on('submit(formadd)',function(data){
            if(data){
                var title = $.trim($("#addTitle").val()); //标题
               // var content = editor1.txt.text();
                var content = $.trim($("#editor_id0").val());
                var brief = $.trim($("#addIntro").val());
                var tagss = [];
                var taglist = $("#addTag").find(".tag");
                for(var a=0;a<taglist.length;a++){
                    tagss.push((taglist.eq(a).text()).replace("×",""));
                }
                var tags = tagss.join(",");
                /*if(content==="<p><br></p>" || content==="<p>&nbsp;</p>"){
                    layer.msg("请填写答案",{time: 5000, icon:6})
                    return false;
                }*/

                var param = {
                    "title": title,
                    "content": content,
                    "createTime": createTime,
                    "createrId": operaterId,
                    "createrName": operater,
                    "auditStatus": 0,
                    "categoryId": categoryId,
                    "brief":brief, //简介
                    "tags":tags //标签
                }
                reqAjaxAsync(USER_URL.ADDCLASS,JSON.stringify(param)).done(function(res) {
                    if (res.code == 1) {
                        layer.msg(res.msg);
                        getClass(inx);
                        getDetailList(0,0,categoryId);//加载知识列表
                        tagAjax(1);
                        $(".newknow").hide();
                        $(".detail-infos").show();
                    }else{
                        layer.msg(res.msg);
                    }
                })
            }
            return false;
        });

        //取消
        $("#formcancel").click(function(){
            $(".newknow").hide();
        });
    })


    //知识库列表方法
    function detailList(res,inx) {
        var sHtml = "";
        for (var i = 0; i < res.data.length; i++) {
            var row = res.data[i];
                sHtml += '<div class="detail-list" data-tagid="'+ row.tagId +'"  data-recycleId="' + row.recycleId + '" data-id="' + row.id + '" data-auditStatus="'+ row.auditStatus +'" data-categoryId="'+ row.categoryId +'">' +
                '<div class="detail-top">' +
                '<div class="detail-title">' + row.title + '</div>' +
                /*'<span class="detail-statu redbg">' + row.categoryName + '</span>' +*/
                '</div>' +
                '<div class="datail-content">' + row.brief + '</div>' +
                '<div class="detail-foot">' +
                '<div class="detail-user">' +
                '<img src="img/default-tx.png">' +
                '<span class="username">' + row.createrName + '</span>' +
                '</div>' +
                '<span class="create-time">' + row.createTime + '</span>' +
                '</div>' +
                '</div>';
        }
        $(".detail").html(sHtml);
        $(".detail .detail-list").removeClass("aov");
        $(".detail .detail-list").eq(inx).addClass("aov");
    }

    //知识库加载(分类)
    function getDetailList(type,inx,categoryId,status,title){
        $("#resetbtn").hide();
        classSelect(0);//加载移动分类
        var param = {
            "auditStatus": status,//审核状态
            "page": page,//第几页
            "rows": rows,//每页多少条
            "sort": "updateTime",//排序字段，一般是updateTime
            "order": "desc",//顺序，asc正序，desc倒序,
            "categoryId": categoryId,//类别id
            "title": title //标题
        }

        reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(res.total > 0){
                    $(".nodata1").hide();
                    $(".nodata2").hide();
                    $(".detail-infos").show();
                    $(".havedata").show();
                    detailList(res,inx);
                    var id = $(".detail .aov").attr("data-id");
                    detailInfo(id,type);
                    //分页
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.total //数据总数，从服务端得到
                            ,groups:4
                            ,limit:rows
                            ,prev:'<'
                            ,next:'>'
                            ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：

                                //首次不执行
                                if(!first){
                                    param.page=obj.curr;
                                    reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
                                        if(res.code==1){
                                            detailList(res,inx);
                                            var id = $(".detail .aov").attr("data-id");
                                            detailInfo(id,type);
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
                    $(".detail-infos").hide();
                    $(".havedata").hide();
                    return ;
                }

            }else{
                layer.msg(res.msg);
            }
        })

    }

    //全部加载初始化
    function all(inx,title){
        $("#resetbtn").hide();
        classSelect(0);//加载移动分类
        var param = {
            "page": page,//第几页
            "rows": rows,//每页多少条
            "sort": "updateTime",//排序字段，一般是updateTime
            "order": "desc",//顺序，asc正序，desc倒序,
            "title": title //标题
        }

        reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(res.total > 0){
                    $(".nodata1").hide();
                    $(".nodata2").hide();
                    $(".detail-infos").show();
                    $(".havedata").show();
                    detailList(res,inx);
                    var id = $(".detail .aov").attr("data-id");
                    detailInfo(id,1);
                    //分页
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.total //数据总数，从服务端得到
                            ,groups:4
                            ,limit:rows
                            ,prev:'<'
                            ,next:'>'
                            ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：

                                //首次不执行
                                if(!first){
                                    param.page=obj.curr;
                                    reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
                                        if(res.code==1){
                                            detailList(res,inx);
                                            var id = $(".detail .aov").attr("data-id");
                                            detailInfo(id,1);
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
                    $(".detail-infos").hide();
                    $(".havedata").hide();
                    return ;
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击全部
    $(".all").on("click",function(){
        $(".hidemenu li").removeClass("actv");
        $(".jurisdiction-left").find("ul li").removeClass("actv");
        $(this).addClass("actv");
        $("#searchName").val("");
        $(".changeknow").hide();
        $(".newknow").hide();
        all(0);
    });

    //回收站初始化
    function recycle(inx,title){
        $("#resetbtn").show();
        var param = {
            "auditStatus": 0,//审核状态
            "page": page,//第几页
            "rows": rows,//每页多少条
            "sort": "deleteTime",//排序字段，deleteTime
            "order": "desc",//顺序，asc正序，desc倒序,
            "title":title
        }
        reqAjaxAsync(USER_URL.TRASH,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(res.total > 0){
                    $(".nodata1").hide();
                    $(".nodata2").hide();
                    $(".detail-infos").show();
                    $(".havedata").show();
                    detailList(res,inx);
                    var id = $(".detail .aov").attr("data-recycleId");
                    trashInfo(id);
                    //分页
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.total //数据总数，从服务端得到
                            ,groups:4
                            ,limit:rows
                            ,prev:'<'
                            ,next:'>'
                            ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：

                                //首次不执行
                                if(!first){
                                    param.page=obj.curr;
                                    reqAjaxAsync(USER_URL.TRASH,JSON.stringify(param)).done(function(res){
                                        if(res.code==1){
                                            detailList(res,inx);
                                            var id = $(".detail .aov").attr("data-recycleId");
                                            trashInfo(id);
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
                    $(".detail-infos").hide();
                    $(".havedata").hide();
                    return ;
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击回收站
   $(".rubbish").on("click",function(){
       $(".hidemenu li").removeClass("actv");
       $(".jurisdiction-left").find("ul li").removeClass("actv");
       $(this).addClass("actv");
       $("#searchName").val("");
       $(".changeknow").hide();
       $(".newknow").hide();
       recycle(0);
   });

    //知识库列表（快捷回复）
    function reply(inx,name,title){
        $("#resetbtn").hide();
        classSelect(1);//加载移动分类
        var param = {
            "categoryName": name,
            "title": title,
            "sort": "updateTime",
            "order": "desc",
            "page": page,
            "rows": rows
        }
        reqAjaxAsync(USER_URL.QUERYREPLY,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(res.total > 0){
                    $(".nodata1").hide();
                    $(".nodata2").hide();
                    $(".detail-infos").show();
                    $(".havedata").show();
                    detailList(res,inx);
                    setTimeout(function(){
                        var id = $(".detail .aov").attr("data-id");
                        replyInfo(id);
                    },0)
                    //分页
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.total //数据总数，从服务端得到
                            ,groups:4
                            ,limit:rows
                            ,prev:'<'
                            ,next:'>'
                            ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：

                                //首次不执行
                                if(!first){
                                    param.page=obj.curr;
                                    reqAjaxAsync(USER_URL.TRASH,JSON.stringify(param)).done(function(res){
                                        if(res.code==1){
                                            detailList(res,inx);
                                            setTimeout(function(){
                                                var id = $(".detail .aov").attr("data-id");
                                                replyInfo(id);
                                            },0)
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
                    $(".detail-infos").hide();
                    $(".havedata").hide();
                    return ;
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //知识库加载(标签)
    function getTagList(inx,tagId,title){
        $("#resetbtn").hide();
        classSelect(0);//加载移动分类
        var param = {
            "page": page,//第几页
            "rows": rows,//每页多少条
            "sort": "updateTime",//排序字段，一般是updateTime
            "order": "desc",//顺序，asc正序，desc倒序,
            "tagId": tagId,
            "title": title //标题
        }

        reqAjaxAsync(USER_URL.TAGDETAIL,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                if(res.total > 0){
                    $(".nodata1").hide();
                    $(".nodata2").hide();
                    $(".detail-infos").show();
                    $(".havedata").show();
                    detailList(res,inx);
                    var id = $(".detail .aov").attr("data-id");
                    tagInfo(id);
                    //分页
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;

                        //执行一个laypage实例
                        laypage.render({
                            elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.total //数据总数，从服务端得到
                            ,groups:4
                            ,limit:rows
                            ,prev:'<'
                            ,next:'>'
                            ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：

                                //首次不执行
                                if(!first){
                                    param.page=obj.curr;
                                    reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
                                        if(res.code==1){
                                            detailList(res,inx);
                                            var id = $(".detail .aov").attr("data-id");
                                            tagInfo(id);
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
                    $(".detail-infos").hide();
                    $(".havedata").hide();
                    return ;
                }

            }else{
                layer.msg(res.msg);
            }
        })

    }

    //点击添加知识列表（快捷回复）
    $("#reply").on("click",".managelist .addbtn",function(){
        $("#addTitle").val("");
        $(".hidemenu li").removeClass("actv");
        $("#addIntro").val("");
        $(".changeknow").hide();
       // editor1.txt.html("");
        $("#editor_id0").val("");
        var nam = $(this).parents(".managelist").attr("class");
        var inx = $(this).parents(".managelist").index();
        var classname = $(this).parents(".managelist").find(".manage-name").text();
        var title = $.trim($("#searchName").val());
        if(nam.indexOf("actv") == -1){
            $(".hidemenu li").removeClass("actv");
            $(this).parents(".managelist").addClass("actv");
            reply(0,classname);//快捷回复
        }
        $(".newknow").show();
        $("#newClassify").val(classname);
        var createTime = new Date().pattern("yyyy-MM-dd hh:mm:ss");
        $("#addTag").hide();
        //保存
        form.on('submit(formadd)',function(data){
            if(data){
                var title = $.trim($("#addTitle").val()); //标题
              //  var content = editor1.txt.html();
                var content = $.trim($("#editor_id0").val());
                var brief = $.trim($("#addIntro").val());
                /*if(content==="<p><br></p>" || content==="<p>&nbsp;</p>"){
                    layer.msg("请填写答案",{time: 5000, icon:6})
                    return false;
                }*/

                var param = {
                    "title": title,
                    "content": content,
                    "createTime": createTime,
                    "createrId": operaterId,
                    "createrName": operater,
                    "auditStatus": 0,
                    "categoryName": classname,
                    "brief":brief//简介
                }
                reqAjaxAsync(USER_URL.ADDREPLY,JSON.stringify(param)).done(function(res) {
                    if (res.code == 1) {
                        layer.msg(res.msg);
                        reply(0,classname);//加载知识列表
                        $(".newknow").hide();
                        $(".detail-infos").show();
                    }else{
                        layer.msg(res.msg);
                    }
                })
            }
            return false;
        });

        //取消
        $("#formcancel").click(function(){
            $(".newknow").hide();
        });
    })


    //搜索列表

    $(".searchicon").click(function(){
        var name = $.trim($("#searchName").val());
        var categoryId = $(".hidemenu").find("li.actv").attr("data-id") || "";
        var status =  $(".hidemenu").find("li.actv").attr("data-statu") || "";
        var txt = $(".jurisdiction-left").find("li.actv").attr("data-text") || "";
        var tagid =  $(".hidemenu").find("li.actv").attr("data-tagid") || "";
        var soonname = $(".hidemenu").find("li.actv").attr("data-name") || "";
        if(txt==1){//全部
            getDetailList(1,0,categoryId,status,name);
        }else if(txt == 4){//回收站
            recycle(0,name);
        }else{
            if(categoryId!=""){ //知识分类
                getDetailList(0,0,categoryId,status,name)
            };
            if(tagid!=""){ //标签
                getTagList(0,tagid,name)
            }
            if(soonname!=""){//快捷回复
                reply(0,soonname,name)
            }
        }

        $(".changeknow").hide();
        $(".newknow").hide();
    });

    //移动到分类方法
    function classSelect(type){
        if(type==0){
            var tps = $(".jurisdiction-left").find("ul li.actv").attr("data-text") || "";
            if(tps==1){
                var param={
                    count:0
                };
                reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
                    if (res.code == 1) {
                        var sHtml = "";
                        sHtml += '<option value="' + "" + '">' + '移动到..' + '</option>'
                        for(var i=0;i<res.data.length;i++){
                            var row = res.data[i];
                            sHtml += '<option value="' + row.id + '">' + row.categoryName + '</option>'
                        }
                        $("#classSelect").html(sHtml);
                    }else{
                        layer.msg(res.msg);
                    }
                })
            }else{
                var param={
                    count:0
                };
                reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
                    if (res.code == 1) {
                        var sHtml = "";
                        for(var i=0;i<res.data.length;i++){
                            var row = res.data[i];
                            sHtml += '<option value="' + row.id + '">' + row.categoryName + '</option>'
                        }
                        $("#classSelect").html(sHtml);
                    }else{
                        layer.msg(res.msg);
                    }
                })
            }

        }else{
            var sHtml = '<option value="' + '欢迎语' + '">' + '欢迎语' + '</option>' +
                '<option value="' + '结束语' + '">' + '结束语' + '</option>' +
                '<option value="' + '道歉语' + '">' + '道歉语' + '</option>' +
                '<option value="' + '其他' + '">' + '其他' + '</option>' ;
            $("#classSelect").html(sHtml);
        }

    }

    //回收站详情TRASHINFO
    function trashInfo(recycleId){
        $(".statu-tags").text("");
        var param = {
            "recycleId": recycleId
        }
        reqAjaxAsync(USER_URL.TRASHINFO,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                $("#resBtn").show();
                $(".noaudit-ctronl").hide();
                $(".question-titl").text(res.data.title);
                $(".question-titl").attr("data-tit",res.data.title);
                $(".time-detail").text(res.data.createTime);
                $(".statu-detail").text(res.data.brief);
                $(".statu-detail").attr("data-brief",res.data.brief);
                $(".detail-info").text(res.data.content);
                $(".detail-info").attr("data-id",res.data.id);
                $(".detail-info").attr("data-recycleId",res.data.recycleId);
                $("#delBtn").attr("data-type",1);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //知识详情方法(分类)
    function detailInfo(id,type){
        $(".statu-tags").text("");
        var param = {
            "id": id
        }
        reqAjaxAsync(USER_URL.SERVICESTAFF,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                $(".title-tag").show();
                $("#resBtn").hide();
                $(".noaudit-ctronl").show();
                var categoryId = res.data.categoryId;
                if(type==1){
                    $("#classSelect").val("");
                }else{
                    $("#classSelect").val(categoryId);
                }
                $(".question-titl").text(res.data.title);
                $(".question-titl").attr("data-tit",res.data.title);
                $(".time-detail").text(res.data.createTime);
                $(".statu-detail").text(res.data.brief);
                $(".statu-detail").attr("data-brief",res.data.brief);
                $(".detail-info").text(res.data.content);
                $(".detail-info").attr("data-id",res.data.id);
                $("#delBtn").attr("data-type",0);
                var tagarry = [];
                if(res.data.tags!= null){
                    var raglen = res.data.tags;
                    for(var a=0;a<raglen.length;a++){
                        tagarry.push(raglen[a].tagName);
                    }
                    var tags = tagarry.join(",");
                    $(".statu-tags").text(tags);
                }else{
                    $(".statu-tags").text("");
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //知识详情方法(标签)
    function tagInfo(id){
        var param = {
            "id": id
        }
        reqAjaxAsync(USER_URL.SERVICESTAFF,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                $(".title-tag").show();
                $("#resBtn").hide();
                $(".noaudit-ctronl").show();
                var categoryId = res.data.categoryId;
                $("#classSelect").val(categoryId);
                $(".question-titl").text(res.data.title);
                $(".question-titl").attr("data-tit",res.data.title);
                $(".time-detail").text(res.data.createTime);
                $(".statu-detail").text(res.data.brief);
                $(".statu-detail").attr("data-brief",res.data.brief);
                $(".detail-info").text(res.data.content);
                $(".detail-info").attr("data-id",res.data.id);
                /*$(".detail-info").attr("data-tagid",res.data.tagId);*/
                $("#delBtn").attr("data-type",3);
                var tagarry = [];
                var raglen = res.data.tags;
                for(var a=0;a<raglen.length;a++){
                    tagarry.push(raglen[a].tagName);
                }
                var tags = tagarry.join(",");
                $(".statu-tags").text(tags);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //快捷回复详情
    function replyInfo(id){
        var param = {
            "id": id
        }
        reqAjaxAsync(USER_URL.REPLYINFO,JSON.stringify(param)).done(function(res){
            if(res.code==1){
                $(".title-tag").hide();
                $("#resBtn").hide();
                $(".noaudit-ctronl").show();
                var categoryId = res.data.categoryName || "";
                $("#classSelect").val(categoryId);
                $(".question-titl").text(res.data.title);
                $(".question-titl").attr("data-tit",res.data.title);
                $(".time-detail").text(res.data.createTime);
                $(".statu-detail").text(res.data.brief);
                $(".statu-detail").attr("data-brief",res.data.brief);
                $(".detail-info").text(res.data.content);
                $(".detail-info").attr("data-id",res.data.id);
                $("#delBtn").attr("data-type",2);
            }else{
                layer.msg(res.msg);
            }
        })
    }

    //知识列表切换
    $(".detail").on("click",".detail-list",function(){
        $(".changeknow").hide();
        $(".newknow").hide();
        var type = $("#delBtn").attr("data-type");
        var txt = $(".jurisdiction-left").find("li.actv").attr("data-text") || "";
        if(type==0){ //知识分类
            if(txt != 1){
                var id = $(this).attr("data-id");
                detailInfo(id,0);
            }else{
                var id = $(this).attr("data-id");
                detailInfo(id,1);
            }
        }else if(type==1){ //回收站分类
            var recycleId = $(this).attr("data-recycleid");
            trashInfo(recycleId);
        }else if(type==2){//快捷回复
            var id = $(this).attr("data-id");
            replyInfo(id);
        }else if(type==3){ //标签
            var id = $(this).attr("data-id");
            tagInfo(id);
        }
        $(".detail .detail-list").removeClass("aov");
        $(this).addClass("aov");
        var inx = $(this).index();

        $(".changeknow").hide();
        $(".newknow").hide();
    });


    //移动到某分类
    $("#classSelect").change(function() {
        var oldid = $(".detail .aov").attr("data-categoryid");
        var firstInx = $(".hidemenu .actv").find(".manage-name").text();
        var parentname = $(".hidemenu .actv").parent("ul").attr("id");
        var parentnames = $(".jurisdiction-left").find("ul li.actv").attr("id");
        var firId = $(".hidemenu .actv").attr("data-id") || "";
        var statu = $(".hidemenu .actv").attr("data-statu") || "";
        var id =$(".detail-info").attr("data-id");
        var title = $.trim($("#searchName").val());
        var txt = $(".jurisdiction-left").find("li.actv").attr("data-text") || "";
        var tages = $(".statu-tags").text();
        if(firstInx!="待审列表" && firstInx != "已审列表"){
         var inx = $(".hidemenu .actv").index();
        }else{
            var inx = "-1";
        }
        var secondInx = $(".detail .aov").index();
        if(parentname == "knowClassify" || parentname=="tags" ||parentnames=="all" ){
            var categoryid = $(this).val();
            /*if (oldid == categoryid ) {
                layer.msg("不能移动到相同目录");
            } else {*/
                var param = {
                    "id": id,//知识的主键
                    "updaterName": operater,//修改人的名称
                    "updaterId": operaterId,//修改人id
                    "categoryId" :categoryid,//类别id
                    "tags":tages //标签
                }

                reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                    if(res.code==1){
                        layer.msg(res.msg);
                        getClass(inx);
                        if(txt == 1){
                          //  getDetailList(1,secondInx,firId,statu);
                        }else{
                            getDetailList(0,secondInx,firId,statu);
                        }


                    }else{
                        layer.msg(res.msg);
                    }
                })
           /* }*/
        }else if(parentname == "reply"){
            var categoryName = $(this).val();
            var name = $(".hidemenu .actv").attr("data-name");
            var param = {
                "id": id,//知识的主键
                "updaterName": operater,//修改人的名称
                "updaterId": operaterId,//修改人id
                "categoryName" :categoryName//类别
            }

            reqAjaxAsync(USER_URL.UPDATAREPLY,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    layer.msg(res.msg);
                    reply(inx,name,title)
                }else{
                    layer.msg(res.msg);
                }
            })
        }
    });

    //编辑知识点
    $("#editBtn").click(function(){
        $("#changeTag").find(".hidetags").html("");
        $(".newknow").hide();
        $(".changeknow").show();
        $("#changeIntro").val("");
        var title = $(".question-titl").attr("data-tit");
        var content = $(".detail-info").html();
        $("#changeTitle").val(title);
        var titles = $.trim($("#searchName").val());
        $("#editor_id1").val(content);
       // editors.txt.html(content);

        var firstInx = $(".hidemenu .actv").find(".manage-name").text();
        var firId = $(".hidemenu .actv").attr("data-id") || "";
        var statu = $(".hidemenu .actv").attr("data-statu") || "";
        var brief = $(".statu-detail").attr("data-brief");
        var name= $(".hidemenu .actv").attr("data-name") || "";
        if(firstInx!="待审列表" && firstInx != "已审列表"){
            var inx = $(".hidemenu .actv").index();
        }else{
            var inx = "-1";
        }
        var secondInx = $(".detail .aov").index();
        $("#changeIntro").val(brief);
        var tagss = $(".statu-tags").text();//获取标签
        var tagarr = tagss.split(",");
        if(tagarr.length>0){
            if(tagarr[0]!=""){
                for(var i=0;i<tagarr.length;i++){
                    $("#changeTag .hidetags").append("<span class='tag'>" + tagarr[i] + "<button class='close' type='button'>×</button></span>"); //添加标签
                }
            }
        }

        //删除标签
        $(".hidetags").on("click",".tag .close",function(){
            $(this).parent().remove();
        });

        //读取相关标签
       // chanTaglist("#changeTag",tagarr);

        //取消
        $("#changeCel").click(function(){
            $(".changeknow").hide();
        });

        var type = $("#delBtn").attr("data-type");//0-分类 2-快捷回复 3-标签

        if(type == 0){
            $("#changeTag").show();
            //保存
            form.on('submit(formUpdate)',function(data) {
                if (data) {
                    var title = $.trim($("#changeTitle").val()); //标题
                  //  var content = editors.txt.html();
                    var content = $.trim($("#editor_id1").val());
                    var brief = $.trim($("#changeIntro").val());
                    var id =$(".detail-info").attr("data-id");
                    var txt = $(".jurisdiction-left").find("li.actv").attr("data-text") || "";
                    var tagssa = [];
                    var taglist = $("#changeTag").find(".tag");
                    for(var a=0;a<taglist.length;a++){
                      tagssa.push((taglist.eq(a).text()).replace("×",""));
                    }
                    var tags = tagssa.join(",");
                    console.log(tags);


                    /*if (content === "<p><br></p>" || content === "<p>&nbsp;</p>") {
                        layer.msg("请填写答案", {time: 5000, icon: 6})
                        return false;
                    }*/
                    var param = {
                        "id": id,//知识的主键
                        "updaterName": operater,//修改人的名称
                        "updaterId": operaterId,//修改人id
                        "title" :title,//标题
                        "content" : content, //内容
                        "brief" : brief,
                        "tags" : tags
                    }

                    reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                        if(res.code==1){
                            layer.msg(res.msg);
                            if(txt == 1){
                                getDetailList(1,0,firId,statu,titles);
                            }else{
                                getDetailList(0,0,firId,statu,titles);
                            }
                            tagAjax(1);
                            $(".changeknow").hide();
                        }else{
                            layer.msg(res.msg);
                        }
                    })

                }
                return false;
            })
        }else if(type == 2){
            $("#changeTag").hide();

            //保存
            form.on('submit(formUpdate)',function(data) {
                if (data) {
                    var title = $.trim($("#changeTitle").val()); //标题
                 //   var content = editors.txt.html();
                    var content = $.trim($("#editor_id1").val());
                    var brief = $.trim($("#changeIntro").val());
                    var id =$(".detail-info").attr("data-id");
                    /*if (content === "<p><br></p>" || content === "<p>&nbsp;</p>") {
                        layer.msg("请填写答案", {time: 5000, icon: 6})
                        return false;
                    }*/
                    var param = {
                        "id": id,//知识的主键
                        "updaterName": operater,//修改人的名称
                        "updaterId": operaterId,//修改人id
                        "title" :title,//标题
                        "content" : content, //内容
                        "brief" : brief
                    }

                    reqAjaxAsync(USER_URL.UPDATAREPLY,JSON.stringify(param)).done(function(res){
                        if(res.code==1){
                            layer.msg(res.msg);
                            reply(0,name,titles);
                            $(".changeknow").hide();
                        }else{
                            layer.msg(res.msg);
                        }
                    })

                }
                return false;
            })
        }else if(type==3){ //标签
            $("#changeTag").show();
            //添加标签
          //  addtag("#changeTag");
            //保存
            form.on('submit(formUpdate)',function(data) {
                if (data) {
                    var title = $.trim($("#changeTitle").val()); //标题
                  //  var content = editors.txt.html();
                    var content = $.trim($("#editor_id1").val());
                    var brief = $.trim($("#changeIntro").val());
                    var id =$(".detail-info").attr("data-id");
                    var tagId = $(".hidemenu .actv").attr("data-tagid");
                    var tagssa = [];
                    var taglist = $("#changeTag").find(".tag");
                    for(var a=0;a<taglist.length;a++){
                        tagssa.push((taglist.eq(a).text()).replace("×",""));
                    }
                    var tags = tagssa.join(",");
                    console.log(tags);


                   /* if (content === "<p><br></p>" || content === "<p>&nbsp;</p>") {
                        layer.msg("请填写答案", {time: 5000, icon: 6})
                        return false;
                    }*/
                    var param = {
                        "id": id,//知识的主键
                        "updaterName": operater,//修改人的名称
                        "updaterId": operaterId,//修改人id
                        "title" :title,//标题
                        "content" : content, //内容
                        "brief" : brief,
                        "tags" : tags
                    }

                    reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                        if(res.code==1){
                            layer.msg(res.msg);
                            getClass("-1");
                            /*getDetailList("-1",firId,statu,titles);*/
                            getTagList(0,tagId,title)
                            tagAjax(1);
                            $(".changeknow").hide();
                        }else{
                            layer.msg(res.msg);
                        }
                    })

                }
                return false;
            })
        }



    });

    //审核
    $("#noauditBtn").click(function(){
        var tyoe = $(this).attr("data-type");
        if(tyoe==0){
            $(".audit-info").show();
            $(this).attr("data-type",1);
        }

        //取消
        $("#auditCancel").click(function(){
            $(".audit-info").hide();
            $("#noauditBtn").attr("data-type",0);
        });

        //通过或者不通过
        form.on('radio(resions)', function(data){
            var val= data.value;
            form.render();
        });

        //保存
        $("#auditSave").click(function(){
            var id =$(".detail-info").attr("data-id");
            var param = {
                "id": id,//知识的主键
                "updaterName": operater,//修改人的名称
                "updaterId": operaterId,//修改人id
                "auditStatus":auditStatus //审核状态 0 - 未审核 1 - 已审核
            }
            reqAjaxAsync(USER_URL.UPDATELOG,JSON.stringify(param)).done(function(res){
                if(res.code==1){
                    layer.msg(res.msg);

                }else{
                    layer.msg(res.msg);
                }
            })
        });

    });

    //删除
    $("#delBtn").click(function() {
        var title = $.trim($("#searchName").val());
        var type = $(this).attr("data-type");
        var id = $(".detail-info").attr("data-id");
        var deleteTime = new Date().pattern("yyyy-MM-dd hh:mm:ss");
        var secondInx = $(".detail .aov").index() || "";
        var txt = $(".jurisdiction-left").find("li.actv").attr("data-text") || "";
        if(type==0) { //知识分类删除
            var firstInx = $(".hidemenu .actv").find(".manage-name").text();
            var firId = $(".hidemenu .actv").attr("data-id") || "";
            var statu = $(".hidemenu .actv").attr("data-statu") || "";
            if(firstInx!="待审列表" && firstInx != "已审列表"){
                var inx = $(".hidemenu .actv").index();
            }else{
                var inx = "-1";
            }
            var param = {
                "id": id,
                "deleteTime" :deleteTime, //删除日期
                "deleteById" :operaterId // 当前登录人id
            }
            layer.confirm("确认删除？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
                reqAjaxAsync(USER_URL.REPLYLOG, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("删除成功");
                        if(txt == 1){
                            getClass("-1");
                            getDetailList(1,0,firId,statu,title);
                        }else{
                            getClass(inx);
                            getDetailList(0,0,firId,statu,title);
                        }

                    } else {
                        layer.msg(res.msg);
                    }
                })
            })
        }else if(type==1){//回收站彻底删除
            var id = $(".detail-info").attr("data-recycleId");
            var param = {
                "recycleId": id,
                "restore" :"false" //删除
            }
            layer.confirm("确认删除？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
                reqAjaxAsync(USER_URL.DELTRASH, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("删除成功");
                        getClass("-1");
                        recycle(0,title);
                    } else {
                        layer.msg(res.msg);
                    }
                })
            })
        }else if(type == 2){ //快捷回复
            var name = $(".hidemenu .actv").attr("data-name") || "";
            var param = {
                "id": id,
                "deleteTime" :deleteTime, //删除日期
                "deleteById" :operaterId // 当前登录人id
            }
            layer.confirm("确认删除？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
                reqAjaxAsync(USER_URL.DELREPLY, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("删除成功");
                        reply(secondInx,name,title);
                    } else {
                        layer.msg(res.msg);
                    }
                })
            })
        }else if(type==3) { //知识分类标签
            var firstInx = $(".hidemenu .actv").find(".manage-name").text();
            var firId = $(".hidemenu .actv").attr("data-id") || "";
            var statu = $(".hidemenu .actv").attr("data-statu") || "";
            var tagId = $(".hidemenu .actv").attr("data-tagid")|| "";
            if(firstInx!="待审列表" && firstInx != "已审列表"){
                var inx = $(".hidemenu .actv").index();
            }else{
                var inx = "-1";
            }
            var param = {
                "id": id,
                "deleteTime" :deleteTime, //删除日期
                "deleteById" :operaterId // 当前登录人id
            }
            layer.confirm("确认删除？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
                reqAjaxAsync(USER_URL.REPLYLOG, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("删除成功");
                        tagAjax(1);
                        getTagList(secondInx,tagId,title)
                    } else {
                        layer.msg(res.msg);
                    }
                })
            })
        }
    })

    //一键清空
    $("#resetbtn").click(function(){
        var param ={};
        layer.confirm("确认清空回收站吗？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
            reqAjaxAsync(USER_URL.CLEAR, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                    layer.close(index);
                    layer.msg("已清空");
                    getClass("-1");
                    tagAjax(1);
                    recycle(0);
                } else {
                    layer.msg(res.msg);
                }
            })
        })
    });

    //回复
    $("#resBtn").click(function(){
        var title = $.trim($("#searchName").val());
        var id = $(".detail-info").attr("data-recycleId");
        var param = {
            "recycleId": id,
            "restore" :"true" //回复
        }
        layer.confirm("确认恢复吗？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
            reqAjaxAsync(USER_URL.DELTRASH, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                    layer.close(index);
                    layer.msg("恢复成功");
                    getClass("-1");
                    tagAjax(1);
                    recycle(0,title);
                } else {
                    layer.msg(res.msg);
                }
            })
        })
    });

    //添加标签
    function addTag(obj,eve) {

        //删除标签
        $(".hidetags").on("click",".tag .close",function(){
            $(this).parent().remove();
        });

        /*var list = $("#addTag").find(".hidetags span");*/
        if(eve==1){
            var list = $("#addTag .hidetags span");
        }else{
            var list = $("#changeTag .hidetags span");
        }

        if(list.length>6){
            layer.msg("最多只能添加7个哟");
           // $("#addTag .addinputtag").val("");
        }else{
            if(eve==1){
                var tag = obj.val();
                if (tag != '') {
                    var i = 0;

                    $("#addTag .hidetags .tag").each(function() {
                        if ($(this).text() == tag + "×") {
                            $(this).addClass("tag-warning");
                            setTimeout(function(){
                                $(".tag-warning").removeClass("tag-warning");
                            }, 400);
                            i++;
                        }
                    })
                    obj.val('');
                    if (i > 0) { //说明有重复
                        return false;
                    }
                    $("#addTag .hidetags").append("<span class='tag'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
                }
            }else{
                var tag = obj.val();
                if (tag != '') {
                    var i = 0;

                    $("#changeTag .hidetags .tag").each(function() {
                        if ($(this).text() == tag + "×") {
                            $(this).addClass("tag-warning");
                            setTimeout(function(){
                                $(".tag-warning").removeClass("tag-warning");
                            }, 400);
                            i++;
                        }
                    })
                    obj.val('');
                    if (i > 0) { //说明有重复
                        return false;
                    }
                    $("#changeTag .hidetags").append("<span class='tag'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
                }
            }


        }
    }

    //修改添加标签
    function chAddTag(obj) {
        var list = $("#changeTag").find(".hidetags span");
        if(list.length>6){
            layer.msg("最多只能添加7个哟");
          //  $("#changeTag .addinputtag").val("");
        }else{
            var tag = obj.val();
            if (tag != '') {
                var i = 0;
                $(".tag").each(function() {
                    if ($(this).text() == tag + "×") {
                        $(this).addClass("tag-warning");
                        setTimeout(function(){
                            $(".tag-warning").removeClass("tag-warning");
                        }, 400);
                        i++;
                    }
                })
                obj.val('');
                if (i > 0) { //说明有重复
                    return false;
                }
                $("#changeTag").find(".hidetags").append("<span class='tag'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
            }

            //删除标签
            $(".hidetags").on("click",".tag .close",function(){
                $(this).parent().remove();
            });
        }
    }





    //标签加载
    function tagAjax(type,tagName,e){
        var param = {
            "tagName":tagName
        }
        if(type == 0){ //联想搜索
            reqAjaxAsync(USER_URL.TAGLIST, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                    //搜索联想
                    /*searchTag(res,e);*/
                } else {
                    layer.msg(res.msg);
                }
            })
        }else if(type==1){ // 1-左侧导航
            reqAjaxAsync(USER_URL.TAGLIST, '{}').done(function (res) {
                if (res.code == 1) {
                    tagNav(res);
                } else {
                    layer.msg(res.msg);
                }
            })
        }

    }

    //联想搜索方法
    function searchTag(res,e){
        var sHtml = "" ;
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            sHtml += '<li data-id="' + row.tagId + '">' + row.tagName + '</li>';
        }

        if(res.data.length>0){
            $(".tagboxs").show();
            $(e).find(".tag-ul").show();
            $(e).find(".notag").hide();
            $(e).find(".tag-ul").html(sHtml);
        }else{
            $(".tagboxs").show();
            $(e).find(".tag-ul").hide();
            $(e).find(".notag").show();
        }
    }

    //导航标签
    function tagNav(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            var count = row.count || 0;

            sHtml += '<li class="managelist" data-tagId="' + row.tagId + '">' +
                            '<div class="listtext">' +
                                '<span class="manage-name title="' + row.tagName + '">' + row.tagName + '</span>' +
                            '</div>' +
                        '</li>';
        }
        $("#tags").html(sHtml);
    }
})(jQuery);