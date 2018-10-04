(function($){
    var page = 1;
    var rows = 10;
    var CMD = "operations/chargeLevelTypeList";
    var param = '{"page":'+ page + ',"rows":' + rows +'}';

    //计费类型表
    function datail(res){
        var sHtml = "";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            sHtml += '<tr data-levelid="' + row.id + '">' +
                        '<td>' + (i+1) + '</td>' +
                        '<td class="levelnem">' + row.levelName + '</td>' +
                        '<td>' + row.amount + '</td>' +
                        '<td>' + row.numValidDays  + '</td>' +
                        '<td>' + row.numShop  + '</td>' +
                        '<td>' + row.numGoods + '</td>' +
                    '</tr>';
        }
        $("#jurisdiction-table tbody").html(sHtml);
    }

    $(".form-group").click(function(){
        var isName = $("#jurisdiction-detail").attr("class");
        if(isName == "row jurisdiction-detail"){
            $("#jurisdiction-detail").addClass("atve");
            $(this).find("span").attr("class","glyphicon glyphicon-menu-up");
            $("#jurisdiction-detail").show();
        };

        if(isName == "row jurisdiction-detail atve"){
            $("#jurisdiction-detail").removeClass("atve");
            $(this).find("span").attr("class","glyphicon glyphicon-menu-down");
            $("#jurisdiction-detail").hide();
        }
    });

    //获取计费类型
    function getDetail(){
        var res = reqAjax(CMD,param);
        if(res.code==1){
            datail(res);
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
                cont: 'paging-box1'
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
                            var param = '{"page":'+ obj.curr + ',"rows":' + rows +'}';
                            var res = reqAjax(CMD,param);
                            datail(res);

                      //  document.getElementById('paging-box-count').innerHTML = render(res, obj.curr);
                        $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+obj.total+'条');
                }
            });
        }else{
            layer.msg(res.msg);
        }
    }
    getDetail();

    /*$("#jurisdiction-table tbody").on('click','tr',function(){
        $("#jurisdiction-table tbody tr").removeClass("actve");
        $(this).addClass("actve");
        var id = $(this).attr("data-id");
        var levelid = $(this).attr("data-levelid");
        var name = $(this).find(".levelnem").text();
        $("#jurisdiction-name").val(name);
        $("#jurisdiction-name").attr("data-levelid",levelid);
    });*/

})(jQuery);