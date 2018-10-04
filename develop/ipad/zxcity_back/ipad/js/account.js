/*
(function($){
   */
/* var shopId = sessionStorage.getItem("shopId"),
        employeeId = sessionStorage.getItem("backUserId");*//*

    var shopId = 49;
    var employeeId =49;
    var pageNo = 1, pageSize = 8;
    var param;
    var cmd = "shop/shopMembers";

    //展示信息方法
    function showMemberList(res){
        var sHtml = "";
        if(res.code == 1){
            var obj = res.data;
            sHtml += '<tr>' +
                        '<th>姓名</th>' +
                        '<th>电话</th>' +
                        '<th>会员编号</th>' +
                        '<th>服务顾问</th>' +
                        '<th>会员类型</th>' +
                      '</tr>';
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml +=  '<tr data-accountId="'+obj[i].accountId+'">'
                                + '<td>'+obj[i].accountName+'</td>'
                                + '<td>'+obj[i].mobile+'</td>'
                                + '<td>'+obj[i].cardNumber+'</td>'
                                + '<td>'+obj[i].operatorName+'</td>'
                                + '<td>'+obj[i].businessName+'</td>'
                            +'</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>'
            }
            $(".account-table").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }

    //客户信息
    function getCustomer (){
        var keyword = $("#keyword").val() == " " ? " " : $("#keyword").val();	//获取文本框的值
        var param = "{'shopId':" + shopId + ",'employeeId':"+ employeeId +",'keyword':'" + keyword + "','pageNo': " + pageNo + ",'pageSize': " + pageSize + "}";
        var res = reqAjax(cmd, param);
        if(keyword != "" && res.code == 1 && res.length == 0){
            layer.msg("对不起，列表中没有您搜索的客户！");
            return;
        }
        showMemberList(res);
        if(res.total > 0){
            $("#customerPage").bootpag({
                total: Math.ceil(res.total / pageSize),
                page: 1,
                maxVisible: 8
            }).on('page', function(event, num){
                param = "{'shopId': " + shopId + ", 'employeeId':"+employeeId+", 'keyword': '" + keyword + "', 'pageNo': " + num + ", 'pageSize': " + pageSize + "}";
                res = reqAjax(cmd, param);

                showMemberList(res)
            }).removeClass("invisible");
        }else{
            $("#customerPage").addClass("invisible");
        }
    }
    getCustomer();

    $("#btnSel").click(function(){
        var trLen = $(".account-table tr").length;
        if(trLen > 2){
            getCustomer();
        }else{
            layer.msg("对不起，列表中没有您搜索的客户！");
        }
    });

})(jQuery);
*/
/**(function($){
    /*var shopId = sessionStorage.getItem("shopId"),
     employeeId = sessionStorage.getItem("backUserId");*/
/*    var  pageNo = 1, pageSize = 10;

    //客户信息
    function getCustomer(){
        var keyword = $("#keyword").val();	//获取文本框的值
        var shopId = $("#storeSelector").val();
        var resData;

        $.ajax({
            type: "POST",
            url: "getShopMembers.do",
            dateType: "json",
            async: false,
            data: {
                shopId: shopId,
                keyword: keyword,
                pageNo: pageNo,
                pageSize: pageSize
            },
            success: function(data){
                data = $.parseJSON(data);
                if(data.code != 1 && data.total == 0){
                    layer.msg("对不起，列表中没有您搜索的客户！");
                    return;
                }else{
                    resData = data;
                }
            },
            error: function(re){

            }
        });
        return resData;
    }

    //展示信息方法
    function showMemberList(res){
        var sHtml = "";
        if(res.code == 1){
            var obj = res.data;
            sHtml += '<tr>' +
            '<th>姓名</th>' +
            '<th>电话</th>' +
            '<th>会员编号</th>' +
            '<th>会员类型</th>' +
            '</tr>';
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml +=  '<tr data-accountId="'+obj[i].accountId+'">'
                    + '<td>'+obj[i].accountName+'</td>'
                    + '<td>'+obj[i].mobile+'</td>'
                    + '<td>'+obj[i].cardNumber+'</td>'
                    + '<td>'+obj[i].businessName+'</td>'
                    +'</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
                $("#customerPage").addClass("invisible");
            }
            $(".account-table").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }

    function init(){
        var resData = getCustomer();
        showMemberList(resData);
        if(null != resData && resData.total > 0){
            $("#customerPage").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                pageNo = num;
                showMemberList(getCustomer());
            }).removeClass("invisible");
        }else{

        }
    }
    init();

    $("#btnSel").click(function(){
        pageNo = 1;
        init();
    });

    function changeShop(){
        pageNo = 1;
        init();
    }
})(jQuery);*/
