(function($){
    var page = 1;
    var rows = 10;
    var pid = '';
    var USER_URL = {
        RESOURLIST : 'operations/resourceList', //(查询权限)
        ADDRESOURCE : 'operations/addResource',//(新增权限)
        UPDATERESOURCE :'operations/updateResource',//(修改权限)
        DELRESOURCE :'operations/removeResource',//(删除权限)
        RESOURCETREE : 'operations/resourceTree', //(权限树)
        RESOURCESIZE : 'operations/dictItemsGroupByType' //(权限类型)
    };

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //左侧导航方法
    function leftNav(res) {
        var sHtml = "";
        if (res.code == 1) {
            var row = res.data;
            for(var a=0;a<row.length;a++){
                var rowA = row[a];
                sHtml += '<li>' +
                '<div class="jurisdiction-nav-li addorz" data-id = "' + rowA.id + '"><span class="glyphicon glyphicon-triangle-bottom"></span><a class="system-orztitle">' + rowA.name + '</a></div>' +
                '<ul class="jurisdiction-info-nav">'
                for (var i = 0; i < rowA.children.length; i++) {
                    var rowB = rowA.children[i];
                    sHtml += '<li>' +
                    '<div class="jurisdiction-info-nav-li addorz" data-id="' + rowB.id + '"><span class="glyphicon glyphicon-triangle-bottom"></span><a class="system-orztitle">' + rowB.name + '</a></div>' +
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
        var parentId = sessionStorage.getItem("parentId");
        var roleId = sessionStorage.getItem("roleId");
        var paramLft = "{'parentId':'" + parentId + "','roleId':'" + roleId + "'}"
        var res = reqAjax(USER_URL.RESOURCETREE,paramLft);
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
            $(this).parent().next('ul').css('display','none');
        };
        if(classNa == 'glyphicon glyphicon-triangle-bottom'){
            $(this).attr('class','glyphicon glyphicon-triangle-top');
            $(this).parent().next('ul').css('display','block');
        };
        if(classNa == 'glyphicon glyphicon-circle'){
            $(this).attr('class','glyphicon glyphicon-nocircle');
            $(this).parent().next('ul').css('display','none');
        };
        if(classNa == 'glyphicon glyphicon-nocircle'){
            $(this).attr('class','glyphicon glyphicon-circle');
            $(this).parent().next('ul').css('display','block');
        };
    });


    //列表方法
    function jurisdictionDetail(res){
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<tr class="system-tr" data-icon="' + row.icon + '" data-parId="' + row.pid + '"  data-id= "' + row.id + '">' +
                '<td>' + (i + 1) + '</td>' +
                '<td class="name">' + row.name + '</td>' +
                '<td class="type" data-type = "' +row.type  +  '">' + row.typeText + '</td>' +
                '<td class="url">' + row.url + '</td>';
                if (row.no == null) {
                    sHtml += '<td class="no">' + "" + '</td>';
                }else{
                    sHtml += '<td class="no">' + row.no + '</td>';
                }
            sHtml += '<td class="row remove-modifier" width="13%">' +
                '<div class="cagbtn">' +
                '<i class="changeBtn edicticon" data-note="' + row.note + '" data-sort= "'+ row.sort +'"></i>修改' +
                '</div>' +
                '<div class="deletebtn">' +
                '<i class="delBtn glyphicon glyphicon-minus-sign m5 red"></i>删除' +
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
        var val = $.trim($("#jurisdiction-name").val());//获取输入框值
        var pid = $(".navList .addorz.acve").attr("data-id");
        if(pid == undefined || pid == null || pid == '' || pid=== 'null'){
            var paramDetail = "{'page':" + page + ",'rows':" + rows + ",'name':'" + val + "'}"; //查询权限列表
        }else{
            var paramDetail = "{'page':" + page + ",'rows':" + rows + ",'name':'" + val + "','parentId':'" + pid + "'}"; //查询权限列表
        }
        var res = reqAjax(USER_URL.RESOURLIST, paramDetail);
        jurisdictionDetail(res);
        $(".total").html("总数：" + res.total + "条");
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
                    if(pid == undefined || pid == null || pid == '' || pid === 'null'){
                        var paramDetail = "{'page':" + obj.curr + ",'rows':" + rows + ",'name':'" + val + "'}"; //查询权限列表
                    }else{
                        var paramDetail = "{'page':" + obj.curr + ",'rows':" + rows + ",'name':'" + val + "','parentId':'" + pid + "'}"; //查询权限列表
                    }
                    var res = reqAjax(USER_URL.RESOURLIST, paramDetail);
                    jurisdictionDetail(res);
                    /*if(!first){ //一定要加此判断，否则初始时会无限刷新
                     location.href = '?page='+obj.curr;
                     }*/
                document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
            }
        });
    }

    getDetail();

    //点击查询按钮
    $("#searchBtn").click(function () {
        $("#jurisdiction-table tbody").html("");
        getDetail();
    });

    //保存方法
    function sub(pid,index) {//则添加保存
        var formData = layer.getChildFrame('body');
        var systemName = $.trim(formData.find('form').find('#systemName').val());
        var systemType = formData.find('form').find('.systemSize').find('dd.layui-this').attr("lay-value");
        var systemSort = $.trim(formData.find('form').find('#systemLevel').val()) ; //优先级
        var systemCode = $.trim(formData.find('form').find('#systemCode').val()) ; //编码
        var systemUrl = $.trim(formData.find('form').find('#systemUrl').val()); //url
        var systemNote = $.trim(formData.find('form').find('#systemNote').val()) ; //备注
        var icon = formData.find('form').find('#systemIcon').val() ; //图标
        if(pid == undefined || pid == null || pid == ''){
            var paramInfod = "{'moduleName':'" + systemName + "','moduleType':'" + systemType  + "','sort':'" + systemSort + "','url':'" + systemUrl + "','code':'" + systemCode + "','note':'" + systemNote + "','icon':'" + icon + "'}";
        }else{
            var paramInfod = "{'moduleName':'" + systemName + "','moduleType':'" + systemType + "','parentId':'" + pid + "','sort':'" + systemSort + "','url':'" + systemUrl + "','code':'" + systemCode + "','note':'" + systemNote + "','icon':'" + icon + "'}";
        }
            if (systemName != '' && systemSort != '' &&  systemCode != '' && systemType != 0) {
                var res = reqAjax(USER_URL.ADDRESOURCE, paramInfod);
                if (res.code == 1) {
                   // layer.msg("保存成功");
                 /* parent.window.location.reload();*/
                    /*location.reload();
                    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.layer.close(index);*/
                    layer.close(index);
                    getNav();
                    changeType();
                    getDetail();
                } else {
                    layer.msg(res.msg);
                }
            } else {
                layer.msg("必填项不能为空哟")
            }
    }

    //修改保存
    function sub2(index){
        var body = layer.getChildFrame('body');
        var id = body.contents().find('.systemId').val();
        var parentId = body.contents().find('.systemParentid').val();
        var systemName = body.contents().find("#systemName").val();
        var systemType = body.contents().find('.systemSize').find('dd.layui-this').attr("lay-value");
        var systemSort =body.contents().find("#systemLevel").val();
        var url = body.contents().find("#systemUrl").val();
        var node = body.contents().find("#systemNote").val();
        var systemCode = body.contents().find("#systemCode").val();
        var icon = body.contents().find("#systemIcon").val();
        if(parentId == undefined || parentId == null || parentId == '' || parentId === 'null' ){
            var paramUpdate = "{'moduleName':'" + systemName + "','moduleId':'" + id + "','moduleType':'" + systemType + "','sort':" + systemSort + ",'url':'" + url + "','code':'" + systemCode + "','note':'" + node + "','icon':'" + icon + "'}";
        }else{
            var paramUpdate = "{'moduleName':'" + systemName + "','moduleId':'" + id + "','parentId':'" + parentId + "','moduleType':'" + systemType + "','sort':" + systemSort + ",'url':'" + url + "','code':'" + systemCode + "','note':'" + node+ "','icon':'" + icon + "'}";
        }
        if (systemName != '' && systemSort != '' &&  systemCode != '' && systemType != 0) {
            var res = reqAjax(USER_URL.UPDATERESOURCE, paramUpdate);
            if (res.code == 1) {
               // layer.msg("修改成功");
              /* parent.window.location.reload();*/
               /* location.reload();
                 var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                 parent.layer.close(index);*/
                layer.close(index);
                getNav();
                changeType();
                getDetail();
            } else {
                layer.msg(res.msg);
            }
        } else {
            layer.msg("还有必填项为空哟");
        }
    }

    //删除
    $("#jurisdiction-table").on("click", ".deletebtn", function () {
        var delId = $(this).parents(".system-tr").attr("data-id");
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var paramDel = "{'moduleId':'" + delId + "'}";
                var res = reqAjax(USER_URL.DELRESOURCE, paramDel);
                if (res.code == 1) {
                    $(this).parents(".system-tr").remove();
                    getDetail();
                   // location.reload(true);
                    layer.close(index);
                    getNav();
                    changeType();
                    getDetail();
                } else {
                    layer.msg(res.msg);
                }
            })

    });

    //修改
    $("#jurisdiction-table").on("click", ".cagbtn", function () {
        var id = $(this).parents(".system-tr").attr("data-id");
        var systemName = $.trim($(this).parents(".system-tr").find(".name").text());
        var systemType = $(this).parents(".system-tr").find(".type").attr("data-type");
        var systemSort = $(this).find("i").attr("data-sort");
        var paretnId = $(this).parents(".system-tr").attr("data-parId");
        var url =  $.trim($(this).parents(".system-tr").find(".url").text());
        var node = $(this).find("i").attr("data-note");
        var systemCode = $.trim($(this).parents(".system-tr").find(".no").text());
        var icon = $(this).parents(".system-tr").attr("data-icon");
        layer.open({
            type: 2,
            title: ['修改权限', 'background:#303030;color:#fff;'],
            skin: 'layer-ext-myskin',
            area: ['800px', '668px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'addjurisdiction.html',
            btn: ['保存'],
            btnAlign: 'c',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                    body.contents().find("#systemName").val(systemName);
                    body.contents().find("#systemUrl").val(url);
                    body.contents().find(".systemParentid").val(paretnId);
                    body.contents().find("#systemCode").val(systemCode);
                    body.contents().find(".systemId").val(id);
                    body.contents().find("#systemNote").val(node);
                    body.contents().find("#systemLevel").val(systemSort);
                    body.contents().find("#systemIcon").val(icon);
                    body.contents().find(".systemSize").find(".layui-anim-upbit dd").removeClass("layui-this");
                    var lis = body.contents().find(".systemSize").find(".layui-anim-upbit dd");
                    for(var i=0;i<lis.length;i++){
                        var bal = lis.eq(i).attr("lay-value");
                        if(bal == systemType){
                            lis.eq(i).addClass('layui-this');
                            var addtye = lis.eq(i).text();
                            body.contents().find(".systemSize").find(".layui-unselect").val(addtye);
                        }
                    }
            },
            yes: function (index) {
                sub2(index);
            }
        });
    });


    //点击新增系统权限弹窗
    $(".add-users").click(function () {
        var index = $(".navList .addorz.acve").index();
        var pid = $(".navList .addorz.acve").attr("data-id");
            layer.open({
                type: 2,
                title: ['新增权限', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['800px', '668px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'addjurisdiction.html',
                btn: ['保存'],
                btnAlign: 'c',
               yes: function (index) {
                    sub(pid,index);
                }
            });

    });

    //点击左侧导航树添加
    $(".navList").on('click','.system-orztitle',function(){
        var pid = $(this).parent().attr('data-id');
        $(".navList .addorz").removeClass("acve");
        $(this).parent().addClass("acve");
        getDetail();
        sessionStorage.setItem('padpaid', pid);
    });

    //点击之后刷新依然会选中
    function changeType(){
        var pod=sessionStorage.getItem("padpaid");
        var $dd=$(".navList li .addorz");
        $dd.each(function(i,item){
            item=$(item);
            item.removeClass("acve");
            var href=item.attr("data-id");
            if(pod != null){
                if(pod.indexOf(href)!=-1){
                    var classname=item.attr("class");
                    if(classname != "jurisdiction-nav-li addorz"){
                        item.parents("ul").prev().find("span").attr("class","glyphicon glyphicon-triangle-top");
                    }
                    item.addClass("acve");
                    item.parents("li").css('display','block');
                    item.parents(".jurisdiction-info-nav").css('display','block');
                    //item.next("ul").css('display','block');
                    item.parents(".jurisdiction-info-secondnav").css('display','block');
                    getDetail();
                }
            }
        })
    }
    changeType();


    $(".system-nav h4").click(function(){
        $(".navList .addorz").removeClass("acve");
        sessionStorage.removeItem('padpaid');
        $(".navList>li ul").css('display','none');
        getDetail();
    });
})(jQuery);