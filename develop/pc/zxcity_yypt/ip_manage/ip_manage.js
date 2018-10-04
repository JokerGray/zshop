(function($){
    var page = 1;
    var rows = 10;
    var userno = sessionStorage.getItem("userno") || "";
    var USER_URL = {
        RESOURLIST : 'operations/queryIpLimitPage', //(查询状态)
        ADDRESOURCE : 'operations/addIpLimit',//(新增)
        DELUSER : 'operations/deleteIpLimit' //(删除)
    };

    layer.config({
        extend: 'myskin/style.css' //同样需要加载新皮肤
    });

    //列表方法
    function payDetail(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++) {
            var row = res.data[i];
            sHtml += '<tr data-id = "' + row.id + '">' +
            '<td class="number">' + (i + 1) + '</td>' +
            '<td>' + row.ipAddress + '</td>'+
            '<td>' + row.reason + '</td>'+
            '<td class="control-tr">' +
            '<a class="deletebtn"><i class="glyphicon glyphicon-minus-sign m5 red"></i>删除</a>' +
            '</td>'+
            '</tr>'
        }
            $("#jurisdiction-table tbody").html(sHtml);
    };

    //列表初始化
    function getDetail(){
        var ipAddress =  $.trim($("#jurisdiction-name").val());//获取区域名称
            var param = {
                'page':page,
                'rows':rows,
                'ipAddress':ipAddress //IP地址
            };
        var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
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
                    var param = {
                        'page':obj.curr,
                        'rows':rows,
                        'ipAddress':ipAddress //IP地址
                    };
                    var res = reqAjax(USER_URL.RESOURLIST,JSON.stringify(param));
                    payDetail(res);
                    document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                    $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                }
            });
    };
    getDetail();
    //搜索
    $("#searchCount").click(function(){
        getDetail();
    });


    //新增保存
    function sub(index){
        var body = layer.getChildFrame('body');
        var lists = body.contents().find('.common-name');
        for(var i=0;i<lists.length;i++ ){
            var row = lists.eq(i);
            if(row.find("input").val() == ""){
                var rew = row.prev("label").text();
                var rew = rew.replace("＊", "");
                var rew = rew.replace("：", "");
                layer.alert(rew+"不能为空！");
                return;
            }
        }

        var address = $.trim(body.contents().find("#address").val()); //ip地址
        var remark = $.trim(body.contents().find("#remark").val()); //限制原因
        //验证ip
        var pattern = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/i;
        var patterns = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if((!pattern.test(address)) || (!patterns.test(address))){
            body.contents().find('#address').val("");
            layer.alert("请输入正确的ip地址");
            return;
        };

        var param={
            ipAddress : address,
            reason : remark
        };
        var res = reqAjax(USER_URL.ADDRESOURCE,JSON.stringify(param));
        if(res.code == 1){
            layer.msg("保存成功");
            layer.close(index);
            getDetail();
        }else{
            layer.msg(res.msg);
        }
    }


    //点击新增
    $("#newRole").click(function(){
            layer.open({
                type: 2,
                title: ['新增', 'background:#303030;color:#fff;'],
                skin: 'layer-ext-myskin',
                area: ['700px', '308px'],
                shade: 0.5,
                closeBtn: 1,
                shadeClose: false,
                content: 'addip.html',
                btn: ['保存'],
                btnAlign: 'c',
                yes: function (index) {
                    sub(index);
                }
            })
    });


    //删除
    $("#jurisdiction-table tbody").on("click",".deletebtn", function () {
        var delId = $(this).parents("tr").attr("data-id");
        layer.confirm(
            "是否删除？",
            {icon: 3, title:'提示'},
            function(index){
                var paramDel = {
                ids : delId
                };
                var res = reqAjax(USER_URL.DELUSER, JSON.stringify(paramDel))
                if (res.code == 1) {
                    layer.msg("删除成功");
                    getDetail();
                    layer.close(index);
                } else {
                    layer.msg(res.msg);
                }
            });
    });



})(jQuery);