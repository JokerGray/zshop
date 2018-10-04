(function($){
    var pageNo = 1, pageSize = 8;

    //展示信息方法
    function showMemberList(res,id,author,priceNum,readNum,title,date){//res是数据接口，id可传参，author指作者，priceNum点赞量，title指标题，date发布时间,readNum浏览量
        var sHtml = "";
        if(res.code == 1){
            var obj = res.data;
            sHtml += '<tr>' +
                        '<th width="25%">标题</th>' +
                        '<th width="25%">作者</th>' +
                        '<th width="25%">点赞/浏览</th>' +
                        '<th width="25%">发布时间</th>' +
                      '</tr>';
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml +=  '<tr data-index="'+obj[i].id+'">'
                                + '<td>'+obj[i].title +'</td>'
                                + '<td>'+obj[i].author+'</td>'
                                + '<td>'
                                + '<div class="upload-detail-Interaction">'
                                + '<span class="upload-detail-zans"><i class="upload-detail-zan"></i>'
                                + obj[i].priceNum
                                + '</span>'
                                + '<span class="upload-detail-eyes"><i class="upload-detail-eye"></i>'
                                + 'obj[i].readNum'
                                + '</span>'
                                + '</div>'
                                +'</td>'
                                + '<td>'+obj[i].date+'</td>'
                            +'</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>'
            }
            $(".upload-table").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }

})(jQuery);
