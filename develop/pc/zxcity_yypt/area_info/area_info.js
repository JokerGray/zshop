(function($){
    var page = 1;
    var rows = 10;
    var userno = sessionStorage.getItem("userno") || "";
    var USER_URL = {
        RESOURLIST : 'operations/queryBaseAreaPage', //(查询状态)
        ADDRESOURCE : 'operations/addBaseArea',//(新增)
        UPDATEUSER : 'operations/modifyBaseArea' //(修改用户信息)
    };
    var levl = ['一级','二级','三级','四级'];

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //列表方法
    function payDetail(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++) {
            var row = res.data[i];
            sHtml += '<tr data-level = "' + row.level + '" data-pid = "' + row.parentcode + '" data-ing="'+ row.lng +'" data-lat="' + row.lat + '"  data-id="' + row.code + '">' +
            '<td class="number">' + (i + 1) + '</td>' +
            '<td class="areaname" data-areaname="' + row.areaname + '"><a class="nameBtn"><i class="glyphicon glyphicon-play"></i> ' + row.areaname + '</a></td>'+
            '<td>' + row.code + '</td>'+
            '<td>' + levl[row.level-1] + '</td>'+
            '<td class="control-tr">' +
            '<a class="changeinfo"><i class="changeBtn edicticon"></i>修改</a>' +
            '</td>'+
            '</tr>'
        }
            $("#jurisdiction-table tbody").html(sHtml);
    };

    //列表初始化
    function getDetail(){
        var areaname =  $.trim($("#jurisdiction-name").val());//获取区域名称
        var pid = $("#jurisdiction-table tbody tr.acve").attr("data-id"); //父id
        if(areaname != ""){
            var param = {
                page:page,
                rows:rows,
                parentCode:0,//父id
                areaname:areaname
            }
        }else{
            var param = {
                page:page,
                rows:rows,
                parentCode:0//父id
            }
        }
        var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
        /*if(res.code == 1) {
            payDetail(res, $("#jurisdiction-table tbody"));
        }else{
            layer.msg(res.msg);
        }*/
            var layer = layui.laypage;
            //模拟渲染
            var render = function (data, curr) {
                var arr = []
                    , thisData = res.data;
                layui.each(thisData, function (index, item) {
                    arr.push('<li>' + item + '</li>');
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
                    if(areaname != ""){
                        var param = {
                            page:obj.curr,
                            rows:rows,
                            parentCode:0,//父id
                            areaname:areaname
                        }
                    }else{
                        var param = {
                            page:obj.curr,
                            rows:rows,
                            parentCode:0//父id
                        }
                    }
                    var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
                    if(res.code == 1){
                        payDetail(res);
                    }else{
                        layer.msg(res.msg);
                    }
                    document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                    $('#paging-box-count').html('共'+ obj.pages +'页');
                }
            });
    };
    getDetail();
    //搜索
    $("#searchCount").click(function(){
        getDetail();
    });

    //选中每行
    $("#jurisdiction-table tbody").on('click','tr',function(){
        $("#jurisdiction-table tbody tr").removeClass("acve");
        $(this).addClass("acve");
    });

    //新增保存
    function sub(index,pid,level){
        var body = layer.getChildFrame('body');
        var lists = body.contents().find('.common-name');
        for(var i=1;i<3;i++ ){
            var row = lists.eq(i);
            if(row.find("input").val() == ""){
                var rew = row.prev("label").text();
                var rew = rew.replace("：", "");
                layer.alert(rew+"不能为空！");
                return;
            }
        }
        var areaname = $.trim(body.contents().find('#systemName').val());
        var code = $.trim(body.contents().find('#areaCode').val());//主键编号
        var lng = $.trim(body.contents().find('#longitude').val());//经度(选填)
        var lat = $.trim(body.contents().find('#latitude').val());//纬度(选填)
        var levels = level==undefined?0:level;
        var lev = parseInt(levels) +1;
        //经纬度正则验证
        var reg=/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;//经纬度
        if(lng != ""){
            if(!reg.test(lng)){
                body.contents().find('#longitude').val("");
                layer.alert("请输入正确的经度");
                return;
            }
        }

        if(lat != ""){
            if(!reg.test(lat)) {
                body.contents().find('#latitude').val("");
                layer.alert("请输入正确的纬度");
                return;
            }
        }

        var param = {
            code:code,
            areaname:areaname,
            parentcode:pid,
            level:lev,
            lng:lng,
            lat:lat
        }
       var res = reqAjax(USER_URL.ADDRESOURCE,JSON.stringify(param));
        if(res.code == 1){
            layer.close(index);
            getDetail();
        }else{
           layer.msg(res.msg);
        }

    }

    //修改保存
    function sub2(index,code){
        var body = layer.getChildFrame('body');
        var areaname = $.trim(body.contents().find('#systemName').val());//区域名称
        var lng = $.trim(body.contents().find('#longitude').val());//经度(选填)
        var lat = $.trim(body.contents().find('#latitude').val());//纬度(选填)
        if(areaname == ""){
            layer.alert("区域名称不能为空");
            return;
        };

        //经纬度正则验证
        var reg=/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;//经纬度
        if(lng != ""){
            if(!reg.test(lng)){
                body.contents().find('#longitude').val("");
                layer.alert("请输入正确的经度");
                return;
            }
        }

        if(lat != ""){
            if(!reg.test(lat)) {
                body.contents().find('#latitude').val("");
                layer.alert("请输入正确的纬度");
                return;
            }
        }

        var param = {
            code:code,
            areaname:areaname,
            lng:lng,
            lat:lat
        }
        var res = reqAjax(USER_URL.UPDATEUSER,JSON.stringify(param));
        if(res.code == 1){
            layer.close(index);
            getDetail();
        }else{
            layer.msg(res.msg);
        }
    }

    //点击新增
    $("#newRole").click(function(){
        var pid = $("#jurisdiction-table tbody tr.acve").attr("data-id") == undefined?0:$("#jurisdiction-table tbody tr.acve").attr("data-id"); //id
        var level = $("#jurisdiction-table tbody tr.acve").attr("data-level") == undefined?0:$("#jurisdiction-table tbody tr.acve").attr("data-level"); //id
        if(level == 4){
            layer.alert("不能添加了哦~")
        }else{
            layer.open({
                type: 2,
                title: ['新增', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['700px', '468px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'addarea.html',
                btn: ['保存'],
                btnAlign: 'c',
                success: function (layero) {
                    var body = layer.getChildFrame('body');
                    body.contents().find("#pidCode").val(pid);
                },
                yes: function (index) {
                    sub(index,pid,level);
                }
            })
        }
    });

    //修改
    $("#jurisdiction-table tbody").on("click",".changeinfo",function(){
        var code = $(this).parents("tr").attr("data-id"); //id
        var pid = $(this).parents("tr").attr("data-pid"); //父id
        var areaname = $(this).parents("tr").find("td").eq(1).attr("data-areaname");//区域名称
        var lng = $(this).parents("tr").attr("data-ing"); //经度
        var lat = $(this).parents("tr").attr("data-lat"); //纬度
        layer.open({
            type: 2,
            title: ['修改', 'background:#303030;color:#fff;'],
            skin: 'layer-ext-myskin',
            area: ['700px', '468px'],
            shade: 0.5,
            closeBtn: 1,
            shadeClose: false,
            content: 'addarea.html',
            btn: ['保存'],
            btnAlign: 'c',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.contents().find("#pidCode").val(pid);
                body.contents().find("#systemName").val(areaname);
                body.contents().find("#areaCode").val(code);
                body.contents().find("#areaCode").attr("disabled",true);
                body.contents().find("#longitude").val(lng);
                body.contents().find("#latitude").val(lat);
            },
            yes: function (index) {
                sub2(index,code);
            }
        })
    });

    //查询下一级的初始方法
    function nextDetail(res,le,e){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++) {
            var row = res.data[i];
            sHtml += '<tr class="tr' + row.parentcode + '" data-level = "' + row.level + '" data-pid = "' + row.parentcode + '" data-ing="'+ row.lng +'" data-lat="' + row.lat + '"  data-id="' + row.code + '">' +
            '<td class="number">' + (i + 1) + '</td>' +
            '<td class="areaname'+ le +'" data-areaname="' + row.areaname + '"><a class="nameBtn"><i class="glyphicon glyphicon-play"></i> ' + row.areaname + '</a></td>'+
            '<td>' + row.code + '</td>'+
            '<td>' + levl[row.level-1] + '</td>'+
            '<td class="control-tr">' +
            '<a class="changeinfo"><i class="changeBtn edicticon"></i>修改</a>' +
            '</td>'+
            '</tr>'
        }
        e.after(sHtml);
    };

    //查询下一级
    function getLevel(id,le,e){
        var param = {
            parentCode : id
        }
        var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
        if(res.code == 1){
            nextDetail(res,le,e);
        }
    }

    //点击箭头加载下一级
    $("#jurisdiction-table tbody").on("click",".nameBtn",function(){
        var classname = $(this).attr("class");
        var id = $(this).parents("tr").attr("data-id");//当前id
        var level = $(this).parents("tr").attr("data-level");//当前层级
        if(classname == "nameBtn"){
         //   $(".nameBtn").removeClass("avl");
            $(this).addClass("avl");
            $(this).find("i").attr("class","glyphicon glyphicon-triangle-bottom");
            getLevel(id,level,$(this).parents("tr"));
            number();
        }
        if(classname == "nameBtn avl"){
            $(this).removeClass("avl");
            $(this).find("i").attr("class","glyphicon glyphicon-play");
            var name = "tr" + id;
            var childname = $("."+ name).attr("data-id");
            var childsname = $(".tr" + childname).attr("data-id");
            $("."+ name).remove();
            $(".tr"+ childname).remove();
            $(".tr"+ childsname).remove();
            number();
        }

    });

    //序号重写
    function number(){
        var lists = $("#jurisdiction-table tbody tr");
        var len = lists.length;
        for(var i=0;i<len;i++){
            lists.eq(i).find(".number").text(i+1);
        }
    }

})(jQuery);