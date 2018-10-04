(function($){
    var page = 1;
    var rows = 10;
    var pid = ""; //父级id
    var USER_URL = {
        SYSTEMLIST: 'operations/organizationList', //(查询组织列表)
        ADDORGANIZATION: 'operations/addOrganization', //(添加组织)
        DELORGANIZATION: 'operations/deleteOrganization', //(删除组织)
        UPDATEORGANIZATION: 'operations/updateOrganization', //(修改组织)
        GETORGANIZATION: 'operations/getOrganizationById', //获取某个组织
        ORGANIZATIONNODE: ' operations/organizationNodes' //组织结构树
    };

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //左侧导航方法
    function leftNav(res) {
        var sHtml = "";
        if (res.code == 1) {
            var row = res.data;
            for(var a=0;a<row.nodes.length;a++){
                var rowA = row.nodes[a];
                sHtml += '<li>' +
                '<div class="jurisdiction-nav-li addorz" data-id = "' + rowA.id + '"><span class="glyphicon glyphicon-triangle-top"></span><a class="system-orztitle">' + rowA.name + '</a></div>' +
                '<ul class="jurisdiction-info-nav">'
                for (var i = 0; i < rowA.children.length; i++) {
                    var rowB = rowA.children[i];
                    sHtml += '<li>' +
                    '<div class="jurisdiction-info-nav-li addorz" data-id="' + rowB.id + '"><span class="glyphicon glyphicon-triangle-top"></span><a class="system-orztitle">' + rowB.name + '</a></div>' +
                    '<ul class="jurisdiction-info-secondnav">'
                    for (var j = 0; j < rowB.children.length; j++) {
                        var rowC= rowB.children[j];
                        sHtml += '<li>' +
                        '<div class="jurisdiction-info-thirdnav-li addorz" data-id="' + rowC.id + '"><span class="glyphicon glyphicon-circle"></span><a class="system-orztitle">' + rowC.name + '</a></div>' +
                        '<ul class="jurisdiction-info-thirdnav">'
                        for (var k = 0; k < rowC.children.length; k++) {
                            var rowD = rowC.children[k];
                            sHtml += '<li data-id="' + rowD.id + '"><span class="glyphicon glyphicon-circle"></span>' +rowD.name + '</li>';
                        };
                        sHtml += '</ul>' +
                        '</li>';
                    };
                    sHtml += '</ul>' +
                    '</li>';
                };
                sHtml += '</ul>' +
                '</li>';
            };
            $(".navList").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    }


    //加载左侧导航树
    function getNav(){
        var res = reqAjax(USER_URL.ORGANIZATIONNODE);
        if(res.code == 1){
            leftNav(res);
        }else{
            layer.msg(res.msg);
        }
    };
    getNav();

    //左边展开收起功能
    $(".navList").on('click','.glyphicon',function(){
        var classNa = $(this).attr('class');
        if(classNa == 'glyphicon glyphicon-triangle-top' ){
            $(this).attr('class','glyphicon glyphicon-triangle-bottom');
            $(this).parent().next('ul').css('display','block');
        };
        if(classNa == 'glyphicon glyphicon-triangle-bottom'){
            $(this).attr('class','glyphicon glyphicon-triangle-top');
            $(this).parent().next('ul').css('display','none');
        };
        if(classNa == 'glyphicon glyphicon-circle'){
            $(this).attr('class','glyphicon glyphicon-nocircle');
            $(this).parent().next('ul').css('display','block');
        };
        if(classNa == 'glyphicon glyphicon-nocircle'){
            $(this).attr('class','glyphicon glyphicon-circle');
            $(this).parent().next('ul').css('display','none');
        };
    });

    //点击左侧导航树添加
    $(".navList").on('click','.system-orztitle',function(){
        var pid = $(this).parent().attr('data-id');
        $(".navList .addorz").removeClass("acve");
        $(this).parent().addClass("acve");
        getSystem();
        sessionStorage.setItem('padpid', pid);
    });

    var pod=sessionStorage.getItem("padpid");
    var $dd=$(".navList li .addorz");
    $dd.each(function(i,item){
        item=$(item);
        item.removeClass("acve");
        var href=item.attr("data-id");
        if(pod != null){
            if(pod.indexOf(href)!=-1){
                item.addClass("acve");
                item.parent().parent().css('display','block')
            }
        }
    })

    //组织列表方法
    function systemDetail(res) {
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<tr class="system-tr" data-pid="' + row.pid +  '" data-id= "' + row.id + '">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + row.name + '</td>'
                if (row.type == 1) {
                    sHtml += '<td>' + '集团' + '</td>';
                } else if (row.type == 2) {
                    sHtml += '<td>' + '部门' + '</td>';
                }
                ;
                if (row.sort == null) {
                    sHtml += '<td>' + "" + '</td>';
                } else {
                    sHtml += '<td>' + row.sort + '</td>';
                }
                sHtml += '<td>' + row.createTime + '</td>' +
                '<td class="row remove-modifier" width="10%">' +
                '<div class="col-md-6">' +
                '<i class="changeBtn glyphicon glyphicon-pencil m5 green"></i>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<i class="delBtn glyphicon glyphicon-minus-sign m5 red"></i>' +
                '</div>' +
                '</td>' +
                '</tr>';
            }
            $("#system-table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    };

    //获取组织列表
    function getSystem() {
        var val = $("#jurisdiction-name").val();//获取输入框值
        var pid =$(".navList .addorz.acve").attr("data-id");
        if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
            var paramDetail = "{'page':" + page + ",'rows':" + rows + ",'name':'" + val + "'}"; //查询权限列表
        }else{
            var paramDetail = "{'page':" + page + ",'rows':" + rows + ",'name':'" + val + "','pid':'" + pid + "'}"; //查询权限列表
        }
        var res = reqAjax(USER_URL.SYSTEMLIST, paramDetail);
        systemDetail(res);
        var layer = layui.laypage;
    //模拟渲染
        var render = function(data, curr){
            var arr = []
                ,thisData = res;
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
            ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }()
            ,jump: function(obj,first){
                if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
                    var paramDetail = "{'page':" + obj.curr  + ",'rows':" + rows + ",'name':'" + val + "'}"; //查询权限列表
                }else{
                    var paramDetail = "{'page':" + obj.curr  + ",'rows':" + rows + ",'name':'" + val + "','pid':'" + pid + "'}"; //查询权限列表
                }
                var res=reqAjax(USER_URL.SYSTEMLIST,paramDetail);
                systemDetail(res);
                document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    location.href = '?page='+obj.curr;
                }
            }
        });
    }

    getSystem();

    //点击查询按钮
    $("#searchBtn").click(function () {
        $("#system-table tbody").html("");
        getSystem();
    });

    //保存方法
    function sub(type,pid) {//type 为3则添加保存，2为修改保存
        var formData = layer.getChildFrame('body');
        var systemName = formData.find('form').find('#systemName').val();
        var systemType = formData.find('form').find('.systemSize').find('.layui-anim-upbit dd.layui-this').attr("lay-value");
        var systemSort = formData.find('form').find('#systemLevel').val() != "" ? formData.find('form').find('#systemLevel').val():""; //优先级
        if (type == 2) {
            var id = formData.find('form').find('.systemId').val();
            if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
                var paramUpdate = "{'name':'" + systemName + "','id':'" + id + "','type':'" + systemType + "','sort':'" + systemSort + "'}";
            }else{
                var paramUpdate = "{'name':'" + systemName + "','id':'" + id + "','pid':'" + pid + "','type':'" + systemType + "','sort':'" + systemSort + "'}";
            }
            if (systemName != '') {
                var res = reqAjax(USER_URL.UPDATEORGANIZATION, paramUpdate);
                if (res.code == 1) {
                    layer.msg("修改成功");
                    parent.window.location.reload();
                    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.layer.close(index);
                } else {
                    layer.msg(res.msg);
                }
            } else {
                layer.msg("请输入组织名称");
            }
        };
        if (type == 3) {
            if(pid == undefined || pid == '' || pid=== 'null' || pid=== null){
                var paramInfod = "{'name':'" + systemName + "','type':'" + systemType + "','sort':'" + systemSort + "'}";
            }else{
                var paramInfod = "{'name':'" + systemName + "','type':'" + systemType + "','pid':'" + pid + "','sort':'" + systemSort + "'}";
            }
            if (systemName != '') {
                var res = reqAjax(USER_URL.ADDORGANIZATION, paramInfod);
                if (res.code == 1) {
                    layer.msg("保存成功");
                    parent.window.location.reload();
                    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.layer.close(index);
                } else {
                    layer.msg(res.msg);
                }
            } else {
                layer.msg("请输入组织名称")
            }
        };
    }

    //删除
    $("#system-table").on("click", ".delBtn", function () {
        var delId = $(this).parents(".system-tr").attr("data-id");
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(){
                var paramDel = "{'id':'" + delId + "'}";
                var res = reqAjax(USER_URL.DELORGANIZATION, paramDel);
                if (res.code == 1) {
                    $(this).parents(".system-tr").remove();
                    getSystem();
                    location.reload(true);
                    layer.close();
                } else {
                    layer.msg(res.msg);
                }
            })

    });

    //修改
   $("#system-table").on("click", ".changeBtn", function () {
        var changeId = $(this).parents(".system-tr").attr("data-id");
       var pid = $(this).parents(".system-tr").attr("data-pid");
        layer.open({
            type: 2,
            title: ['新增组织', 'background:#303030;color:#fff;'],
            skin: 'layer-ext-myskin',
            area: ['1024px', '768px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'addsystem_organization.html',
            btn: ['保存'],
            btnAlign: 'c',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var paramSystem = "{'id':'" + changeId + "'}";
                var res = reqAjax(USER_URL.GETORGANIZATION, paramSystem);
                if (res.code == 1) {
                    body.contents().find("#systemName").val(res.data.organization.name);
                    body.contents().find(".systemId").val(changeId);
                    body.contents().find(".systempId").val(res.data.organization.pid);
                    if (res.data.organization.sort == null) {
                        body.contents().find("#systemLevel").val("");
                    } else {
                        body.contents().find("#systemLevel").val(res.data.organization.sort);
                    };
                    if (res.data.organization.type == 1) {
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").removeClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").eq(0).addClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-unselect").val("集团");
                    } else if (res.data.organization.type == 2) {
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").removeClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-anim-upbit dd").eq(1).addClass("layui-this");
                        body.contents().find(".systemSize").find(".layui-unselect").val("部门");
                    }
                }

            },
            yes: function () {
                sub(2,pid);
            }
        });
    });


    //点击新增系统组织弹窗
    $(".add-users").click(function () {
        var index = $(".navList .addorz.acve").index();
        var pid = $(".navList .addorz.acve").attr("data-id")  ;
            layer.open({
                type: 2,
                title: ['新增组织', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['1024px', '768px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'addsystem_organization.html',
                btn: ['保存'],
                btnAlign: 'c',
                yes: function () {
                    sub(3,pid);
                }
            });

    });

    $(".system-nav h4").click(function(){
        $(".navList .addorz").removeClass("acve");
        sessionStorage.removeItem('padpid');
        getSystem();
    });
})(jQuery);