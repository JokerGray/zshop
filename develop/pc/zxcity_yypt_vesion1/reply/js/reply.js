(function($){
    var page = 1;
    var rows = 10;
    var username = yyCache.get('username');
    var operater = yyCache.get("pcNickname"); //用户名称
    var operaterId = yyCache.get("userId"); //登陆者id
    var USER_URL = {
        QUERYCLASSIFY:'	operations/findTKnowledgeQuickReplyCategory',   //查询快捷回复分类
        UPDATECLASSIFY:'operations/updateTKnowledgeQuickReplyCategory',  //修改快捷回复分类
        ADDCLASSIFY:'operations/addTKnowledgeQuickReplyCategory', //(新增快捷回复分类)
        DELETECLASSIFY:'operations/deleteTKnowledgeQuickReplyCategory', //(删除快捷回复分类)
        QUERYREPLY :'operations/findTKnowledgeQuickReply',//查询快捷回复接口
        ADDREPLY : 'operations/addTKnowledgeQuickReply', //	新增快捷回复
        DELETEREPLY :'operations/deleteTKnowledgeQuickReply', //删除快捷回复接口
        UPDATEREPLY :'operations/updateTKnowledgeQuickReply', //修改快捷回复
        IMPORTOUT :'operations/exportTKnowledgeQuickReply', //导出
        IMPORTIN : 'operations/importTKnowledgeQuickReply' //导入
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;

    });

    //初始化
    $(function(){
        getClass(1);
    })

    //左侧列表
    function getClass(type){ //type 1-左侧分类栏 2-弹窗类别
        var sHtml = "";
        var param = {};
        reqAjaxAsync(USER_URL.QUERYCLASSIFY,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                if(type==1){
                    for(var i=0;i<res.data.length;i++){
                        var row = res.data[i];
                        sHtml+='<li data-id="'+ row.id +'">'+
                        '<div class="change-input">' +
                        '<input type="text" placeholder="请输入1-5个字" maxlength="5">' +
                        '<i class="savebtn layui-icon">&#xe605;</i>' +
                        '<i class="closebtn layui-icon">&#x1006;</i>' +
                        '</div>' +
                        '<div class="classname">' + row.categoryName + '</div>'+
                        '<div class="list-ctronl">' +
                        '<i class="delbtn layui-icon">&#xe640;</i>' +
                        '<i class="editbtn layui-icon">&#xe642;</i>' +
                        '</div>'
                        '</li>'
                    }
                    $("#classify").html(sHtml);
                    $("#classify li").eq(0).addClass("acv");
                    setTimeout(function(){
                        templeTable(res.data[0].id);
                    },1000);
                }else{
                    for(var i=0;i<res.data.length;i++){
                        var row = res.data[i];
                        sHtml += '<option value="'+ row.id +'">' + row.categoryName + '</option>';
                    }
                    $("#classifySelect").html(sHtml);
                    form.render();
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //列表渲染
    function templeTable(categoryId,replyContent){
        var obj = tableInit('table', [
                [
                    {checkbox: true},
                {
                    title: '快捷词',
                    /*sort: true,*/
                    align: 'left',
                    templet: '#effcettime',
                    width: 100,
                    event: 'changetable'
                }, {
                    title: '回复内容',
                    /*sort: true,*/
                    align: 'left',
                    field: 'replyContent',
                    event: 'changetable'
                }, {
                    title: '操作',
                    fixed: 'right',
                    align: 'left',
                    width:100,
                    toolbar: '#barDemo'
                }]
            ],
            pageCallback,'laypageLeft',categoryId,replyContent
        );
    }

//加了入参的公用方法
        function tableInit(tableId, cols, pageCallback, test,categoryId,replyContent) {
            var tableIns, tablePage;
            //1.表格配置
            tableIns = table.render({
                id: tableId,
                elem: '#' + tableId,
                height: '600',
                cols: cols,
                page: false,
                even: true,
                skin: 'line',
                unresize:true,
                size:'lg'
            });

            //2.第一次加载
            var res = pageCallback(page, rows,replyContent,categoryId);
            //第一页，一页显示15条数据
            if(res) {
                if(res.code == 1) {
                    tableIns.reload({
                        data: res.data || []
                    })
                } else {
                    layer.msg(res.msg)
                }
            }

            //3.left table page
            layui.use('laypage');

            var page_options = {
                elem: 'laypageLeft',
                count: res ? res.total : 0,
                layout: ['count', 'prev', 'page', 'next', 'skip'],
                limit: rows
            }
            page_options.jump = function(obj, first) {
                tablePage = obj;

                //首次不执行
                if(!first) {
                    var resTwo = pageCallback(obj.curr, obj.limit,replyContent,categoryId);
                    if(resTwo && resTwo.code == 1)
                        tableIns.reload({
                            data: resTwo.data || []
                        });
                    else
                        layer.msg(resTwo.msg);
                }
            }

            layui.laypage.render(page_options);

            return {
                tablePage,
                tableIns
            };
        }

        //左侧表格数据处理
        function getData(url, parms) {
            var res = reqAjax(url, parms);
            var data = res.data || [];
            return res;
        }

        //pageCallback回调
        function pageCallback(index, limit,replyContent,categoryId) {
            if(categoryId == undefined){categoryId = ''}
            if(replyContent == undefined){replyContent = ''}
            var param = {
                "page": index,
                "rows": limit,
                "replyContent": replyContent,
                "categoryId": categoryId
            }
            return getData(USER_URL.QUERYREPLY, JSON.stringify(param));
        }

    //搜索查询
    $(".search-box").on("click",".searchicon",function(){
        var id = $("#classify li.acv").attr("data-id");
        var replyContent = $.trim($("#searchName").val());
        templeTable(id,replyContent);
    });

    //点击分类查询快捷回复
    $("#classify").on("click","li .classname",function(){
        $(this).parent().addClass("acv");
        $(this).parent().siblings().removeClass("acv");
        var id = $(this).parent().attr("data-id");
        $("#searchName").val("");
        templeTable(id);
    });

    //添加分类
    $("#classifyAdd").on("click",function(){
        var num = $(this).attr("data-num");
        if(num==0){
            var sHtml= '<div id="addClass" class="addinput">'+
                '<input type="text" placeholder="请输入1-5个字" maxlength="5">' +
                '<i class="savebtn layui-icon">&#xe605;</i>' +
                '<i class="closebtn layui-icon">&#x1006;</i>' +
                    '</div>';
            $("#classify").before(sHtml);
            $(this).attr("data-num",1);
        }
    });

    //保存分类
    $(".jurisdiction-left").on("click",".addinput .savebtn",function(){
        var val = $.trim($("#addClass").find("input").val());
        if(val==""){
            layer.msg("请填写分类名称");
        }else{
            var param={
                "categoryName":val
            }
            reqAjaxAsync(USER_URL.ADDCLASSIFY,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    layer.msg(res.msg);
                    getClass(1);
                    $("#classifyAdd").attr("data-num",0);
                    $("#addClass").remove();
                }else{
                    layer.msg(res.msg);
                }
            })
        }
    });

    //取消保存分类
    $(".jurisdiction-left").on("click",".addinput .closebtn",function(){
        $("#classifyAdd").attr("data-num",0);
        $("#addClass").remove();
    });

    //鼠标划过效果
    $("#classify").on("mouseover","li",function(){
            $(this).find(".list-ctronl").show();
    });

    $("#classify").on("mouseleave","li",function(){
        $(this).find(".list-ctronl").hide();
    });

    //知识分类删除
    $("#classify").on("click","li .delbtn",function(){
        var id = $(this).parents("li").attr("data-id");
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var param = {
                    "id":id
                }
                reqAjaxAsync(USER_URL.DELETECLASSIFY,JSON.stringify(param)).done(function(res) {
                    if (res.code == 1) {
                        layer.msg(res.msg);
                        getClass(1);
                    }else{
                        layer.msg(res.msg);
                    }
                })
            })
    });

    //快捷回复分类修改
    $("#classify").on("click","li .editbtn",function(){
        var val = $(this).parents("li").find(".classname").text();
        $("#classify li .list-ctronl").hide();
        $(this).parents("li").find(".change-input").show();
        $(this).parents("li").find(".change-input input").val(val);
    });

    //取消修改分类
    $("#classify").on("click","li .closebtn",function(){
        $(this).parents("li").find(".change-input").hide();
    });

    //修改分类保存
    $("#classify").on("click","li .savebtn",function(){
        var id = $(this).parents("li").attr("data-id");
        var val = $.trim($(this).parents("li").find(".change-input input").val());
        if(val==""){
            layer.msg("请填写分类名称");
        }else{
            var param = {
                "id":id,
                "categoryName":val
            }
            reqAjaxAsync(USER_URL.UPDATECLASSIFY,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    layer.msg(res.msg);
                    $(this).parents("li").find(".change-input").hide();
                    getClass(1);
                }else{
                    layer.msg(res.msg);
                }
            })
        }
    });

    //表格操作
    table.on('tool(table)', function(obj){
        var data = obj.data;
        var id = data.id;
        //删除
        if(obj.event === 'del'){
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示'},
                function(index){
                    restore(id);
                })
        }else if(obj.event == 'changetable'){ //查看
            $(".infomation").attr("data-id",id);
            $(".infomation").attr("data-cid",data.creatorId);
            $(".titletxt span").text(data.shortcutWords);
            $(".info-content span").text(data.replyContent);
            $(".infomation").show();
            $(".infomation").animate({right:'0'});
        }else if(obj.event == 'change'){
            $(".infomation").animate({right:'-40%'});
            changeInfo(2,id,data.categoryId,data.replyContent,data.shortcutWords);
        }
    });

    //关闭详情
    $(".info-close").click(function(){
        $(".infomation").animate({right:'-40%'});
    });

    //查看详情时的删除
    $("#delKnow").click(function(){
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var id = $(".infomation").attr("data-id");
                restore(id);
                $(".infomation").animate({right:'-40%'});
            })
    });

    //删除快捷回复
    function restore(id){
        var param = {
            "ids":id
        }
        reqAjaxAsync(USER_URL.DELETEREPLY,JSON.stringify(param)).done(function(res){
            if (res.code == 1) {
                layer.msg(res.msg);
                var e = $("#classify li.acv").attr('data-id');
                var val = $.trim($("#searchName").val());
                templeTable(e,val);
            } else {
                layer.msg(res.msg);
            }
        });
    }

    //一键删除
    $("#delBtn").click(function(){
        var list = $(".repon-table .layui-table-main").find(".layui-form-checked").parents("tr");
        var arr=[];
        for(var i=0;i<list.length;i++){
            arr.push(list.eq(i).find(".ids").text());
        }
        if(arr.length==0){
            layer.msg("请选择相应行");
        }else {
            $(".infomation").animate({right:'-40%'});
            var ids = arr.toString();
            var val = $.trim($("#searchName").val());
            restore(ids,val);
        }

    });

    //修改or新增
    function changeInfo(type,id,classid,content,hotword){//type 1-新增 2-修改
        layer.open({
            title: ['快捷回复', 'font-size:12px;background-color:#fff;color:#000'],
            type: 1,
            content: $('#addTip'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['500px', '600px'],
            shade: [0.1, '#fff'],
            btn:['保存','取消'],
            end: function () {
                $('#addTip').hide();
                $("#keyword").val("");
                $("#replyContent").val("");
            },
            success: function (layero, index) {
                getClass(2);
                //给保存按钮添加form属性
                $("div.layui-layer-page").addClass("layui-form");
                $("a.layui-layer-btn0").attr("lay-submit","");
                $("a.layui-layer-btn0").attr("lay-filter","formdemo");
                if(type==2){
                    $("#classifySelect").val(classid);
                    $("#keyword").val(hotword);
                    $("#replyContent").val(content);
                }
            },
            yes:function(index, layero) {
                //form监听事件
                form.on('submit(formdemo)', function (data) {
                    if (data) {
                        var categoryId = $("#classifySelect").val();
                        var shortcutWords = $.trim($("#keyword").val());
                        var replyContent = $.trim($("#replyContent").val());
                        if(type==1){
                            var param = {
                                "shortcutWords": shortcutWords,//快捷词
                                "replyContent": replyContent,//回复内容
                                "common": "1",//公共库还是个人库 暂时不用传1
                                "creatorId": operaterId,//创建人id
                                "categoryId":categoryId//所属分类
                            }
                            reqAjaxAsync(USER_URL.ADDREPLY,JSON.stringify(param)).done(function(res){
                                if (res.code == 1) {
                                    layer.close(index);
                                    layer.msg(res.msg);
                                    var e = $("#classify li.acv").attr('data-id');
                                    var val = $.trim($("#searchName").val());
                                    templeTable(e,val);
                                } else {
                                    layer.msg(res.msg);
                                }
                            });
                        }else{
                            var param = {
                                "id": id,
                                "shortcutWords": shortcutWords,//快捷词
                                "replyContent": replyContent,//回复内容
                                "common": "1",//公共库还是个人库 暂时不用传1
                                "creatorId": operaterId,//创建人id
                                "categoryId":categoryId//所属分类
                            }
                            reqAjaxAsync(USER_URL.UPDATEREPLY,JSON.stringify(param)).done(function(res){
                                if (res.code == 1) {
                                    layer.close(index);
                                    layer.msg(res.msg);
                                    var e = $("#classify li.acv").attr('data-id');
                                    var val = $.trim($("#searchName").val());
                                    templeTable(e,val);
                                } else {
                                    layer.msg(res.msg);
                                }
                            });
                        }

                    }
                })
            }
        })
    }

    //添加
    $("#addQs").on("click",function(){
        changeInfo(1);
    });

    //查看详情修改
    $("#editKnow").click(function(){
        var id = $(".infomation").attr("data-id");
        var hotword = $(".titletxt span").text();
        var content= $(".info-content span").text();
        var categoryId = $(".infomation").attr("data-cid");
        $(".infomation").animate({right:'-40%'});
        changeInfo(2,id,categoryId,content,hotword);
    });

    //导入（导入接口还未出先搁置）
    $("#importIn").on("click",function() {
        layer.open({
            title: ['导入快捷回复', 'font-size:15px;background-color:#fff;color:#000'],
            type: 1,
            content: $('#importInfile'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['530px', '450px'],
            shade: [0.1, '#fff'],
            btn: ['开始导入', '取消'],
            end: function () {
                $('#importInfile').hide();
            },
            success: function (layero, index) {
                $(".import-one a").click(function(){
                    download("http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zx1521625463280.xlsx");
                });
                var sHtml='<div class="layui-input-block flex ossfile">' +
                    '<a class="localUpload" id="selectfiles">上传附件</a>'+
                    ' <div class="form-sign">支持xls、xlsx文件格式，单个文件大小不得超过2M</div>' +
                    '<div id="ossfile" style="display: none"></div>' +
                    '</div>'+
                    '<div class="showimg">' +
                    '<div id="previews"></div>' +
                    '<div id="btn"></div>' +
                    '<div id="localBtn"></div>';
                $(".source-upload").html(sHtml);
                //上传本地附件点击事件
                $("#selectfiles").click(function() {
                     $("#localBtn").click();
                });
                uploadOss({
                    btn: "localBtn",
                    flag: "excel",
                    size: "2mb",
                    imgDom: "previews"
                });
            },
            yes: function (index, layero) {
                var url = $("#previews .item_box a").attr("href") || "";
                var categoryId = $("#classify li.acv").attr("data-id");
                if(url==""){
                    layer.msg("请先上传附件");
                }else{
                    layer.close(index);
                    var param = {
                        "creatorId":operaterId,
                        "url":url,
                        "categoryId":categoryId
                    }
                    reqAjaxAsyncReply(USER_URL.IMPORTIN,JSON.stringify(param),"",importIn).done(function(res) {
                        if (res.code == 1) {
                            layer.closeAll();
                            layer.msg(res.msg);
                            layer.open({
                                title: ['导入快捷回复', 'font-size:15px;background-color:#fff;color:#000'],
                                type: 1,
                                content: $('#importInfile2'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                                area: ['530px', '400px'],
                                btn:['确定'],
                                shade: [0.1, '#fff'],
                                end: function () {
                                    $('#importInfile2').hide();
                                },success: function (layero, index) {
                                    var data=res.data;
                                    $('#importInfile2 .import-one').text(data.result);
                                },yes: function (index, layero) {
                                    layer.close(index);
                                }
                            })
                        }else{
                            layer.msg(res.msg);
                        }
                    })
                }
            }
        })
    });

    //导入第二步
    function importIn(){
        layer.open({
            title: ['导入快捷回复', 'font-size:15px;background-color:#fff;color:#000'],
            type: 1,
            content: $('#importInfile1'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            area: ['530px', '400px'],
            shade: [0.1, '#fff'],
            end: function () {
                $('#importInfile1').hide();
            },success: function (layero, index) {

            }
        })
    }

    //导出
    $("#importOut").on("click",function(){
        var list = $(".repon-table .layui-table-main").find(".layui-form-checked").parents("tr");
        var arr=[];
        for(var i=0;i<list.length;i++){
            arr.push(list.eq(i).find(".ids").text());
        }
        if(arr.length==0){
            layer.msg("请选择相应行");
        }else {
            $(".infomation").animate({right:'-40%'});
            var ids = arr.toString();
            var val = $.trim($("#searchName").val());
            var param = {
                "ids":ids
            }
            reqAjaxAsync(USER_URL.IMPORTOUT,JSON.stringify(param)).done(function(res) {
                if (res.code == 1) {
                    download(res.data)
                }else{
                    layer.msg(res.msg);
                }
            })
        }
    });

    function download(url){
        var iframe = document.createElement("iframe")
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
    }


})(jQuery);