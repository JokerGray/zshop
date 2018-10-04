(function($){
    var page = 1;
    var rows = 10;
    var USER_URL = {
        RESOURLIST : 'operations/queryPacksReceiveList' //(查询)
    };

    //列表方法
    function tableDetail(res){
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<tr class="system-tr" data-id= "' + row.id + '">' +
                '<td>' + (i + 1) + '</td>'
                if(row.packsName == undefined){
                    sHtml += '<td class="packagename">' + "暂无" + '</td>'
                }else{
                    sHtml += '<td class="packagename">' + row.packsName + '</td>'
                }
                sHtml += '<td class="goodsname">' + row.receiveUserId + '</td>'
                if(row.productId == undefined){
                    sHtml += '<td class="goodsnote">' + "暂无" + '</td>'
                }else{
                    sHtml += '<td class="goodsnote">' + row.productId + '</td>'
                }
                sHtml +='<td class="goodid">' + row.sectionBusinessId + '</td>'
                if(row.isReceiveText == "未领取"){
                    sHtml += '<td class="goodsstatu">' + row.isReceiveText + '</td>'
                }else if(row.isReceiveText == "已领取"){
                    sHtml +=  '<td class="goodsstatu greend">' + row.isReceiveText + '</td>'
                }
                if(row.receiveTime == ""){
                    sHtml +='<td class="packagename">' + "-" + '</td>' ;
                }else{
                    sHtml +='<td class="packagename">' + row.receiveTime + '</td>' ;
                }
                sHtml += '</tr>';
            }
            $("#jurisdiction-table tbody").html(sHtml);
        } else {
            layer.msg(res.msg);
        }
    };



    //初始化列表
    function getDetail(){
        var val = $.trim($("#searchName").val());//获取输入框值
        var isReceive = $("#payType").children('option:selected').val();//领取状态
        var productId =( $("#payLocK").children('option:selected').text() == "-请选择-" ?"":$("#payLocK").children('option:selected').text());//产品名称
        var param = {
            page : page,
            rows : rows,
            packsName : val,
            isReceive : isReceive,
            productId : productId
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
                    packsName : val,
                    isReceive : isReceive,
                    productId : productId
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

})(jQuery);