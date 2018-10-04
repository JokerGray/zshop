(function($){
    var REQUEST_URL = {
        'search_url': 'shopDisplayTerminal/queryShopAccountList'
    };

    var merchantId = sessionStorage.getItem("merchantId"),
        shopId = sessionStorage.getItem("shopId");
    var pageNo = 1, pageSize = 1000;



    function searchCustomerByKeyword(keyword){
        var param = {
            'merchantId':merchantId,
            'shopId':shopId,
            'keyword':keyword,
            'pageNo':pageNo,
            'pageSize':pageSize
        }
        var res = reqAjax(REQUEST_URL['search_url'], JSON.stringify(param));
        if(res.code == 1){
            var sHtml = '', obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<li class="list-item" id="'+obj[i].id+'">'
                        + '<span class="name">'+obj[i].accountName+'</span>'
                        + '<span class="mobile">'+obj[i].mobile+'</span>'
                        + '<span class="card-num">'+obj[i].cardNumber+'</span>'
                        + '<span class="arrow-icon"></span>'
                        + '</li>'
                }
            }else{
                sHtml += '<li class="nodata">暂无搜索结果</li>'
            }
            $("#searchList").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }

    $("#searchList").delegate(".list-item","click", function(){
        var accountId = $(this).attr("id"),
            accountName = $(this).find(".name").text(),
            mobile = $(this).find(".mobile").text();
        parent.location.href = "html/reservationSubPage.html?accountId="+accountId+"&accountName="+accountName+"&mobile="+mobile;
    });


    //清空内容
    function reset(){
        $("#searchBox .search-txt").val("");
        $("#searchBox .cancel-btn").addClass("invisible");
        $("#searchList").html("");
    }

    //输入内容
    $("#searchBox .search-txt").keyup(function(){
        var searchTxt = $.trim($(this).val());
        if(searchTxt == ""){
            reset();
        }else{
            $("#searchBox .cancel-btn").removeClass("invisible");
            searchCustomerByKeyword(searchTxt);
        }
    });

    //清除搜索内容
    $("#searchBox .cancel-btn").click(function(){
        reset();
    });

    $(".link-btn").click(function(){
        parent.location.href = "html/customerReservation.html";
    });


})(jQuery);
