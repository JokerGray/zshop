(function($){
    var params = $.parseJSON(getUrlParams("params"));
    var oWaiterList = null, oService = {}, oBilling = {};
    var shopID = sessionStorage.getItem('shopId');
    var merchantId = sessionStorage.getItem('merchantId');

    function waiterListHtml(obj){
        var sHtml = "";
        for(var i=0; i<obj.length; i++){
            sHtml += '<li data-id="'+obj[i].id+'">'+obj[i].username+'</li>';
        }
        $("#waiterSelector .i-select-list ul").html(sHtml);
        $("#waiterSelector .i-select-text").attr("data-id", obj[0].id);
        $("#waiterSelector .i-select-text span").text(obj[0].username);
    }

    function waiterListLoad(){
        var res = reqAjax("shop/waitersPersonInShop", "{'shopId':"+shopID+"}");
        if(res.code == 1){
            oWaiterList = res.data;
            waiterListHtml(res.data)
        } else {
            layer.alert(res.msg);
        }
    }

    function init(){
        var date = new Date();
        var nowTime = [[date.getFullYear(), date.getMonth()+1, date.getDate()].join('-'), [date.getHours(), date.getMinutes(), date.getSeconds()].join(":")].join(" ").replace(/(?=\b\d\b)/g, "0");
        $("#serviceInfo .time .con").html(nowTime);
    }

    function serviceInfoLoad(customerAccountId, serviceIds){
        var jsonData = "{'accountId':"+customerAccountId+"}";
        var res = reqAjax("shop/serviceCards", jsonData);
        if(res.code == 1){
            var obj = res.data, sHtml = "", oTemp = null;
            for(var i=0; i<obj.length; i++){
                for(var k in serviceIds){
                    if(k == obj[i].purchaseId){
                        sHtml += '<li data-id="'+obj[i].purchaseId+'" data-remainNum="'+obj[i].remainNum+'">'+obj[i].cardName+'</li>';
                        oTemp = obj[i];
                        oService = {};
                        oService['id'] = k;
                        oService['count'] = serviceIds[k];
                        oService['waiterId'] = $("#waiterSelector .i-select-text").attr("data-id");
                        oService['waiterName'] = $("#waiterSelector .i-select-text span").text();
                        oBilling[k] = oService;
                    }
                }
            }
            $("#serviceType .select-box ul").html(sHtml);
            $("#serviceType .service-name").attr("data-id", oTemp.purchaseId).attr("data-remainNum", oTemp.remainNum);;
            $("#serviceType .service-name span").text(oTemp.cardName);
            $("#serviceInfo .num input[type=text]").val(serviceIds[oTemp.purchaseId]);
        } else {
            layer.alert(res.msg);
        }
    }

    $(function(){
        waiterListLoad();
        init();
        $("#customerInfoBox .name").text(params.customerName);
        $("#customerInfoBox .tel-num span").text(params.customerTel);
        $("#customerInfoBox .saleman span").text(params.saleman);
        $("#serviceInfo .saleman .con").html(params.saleman);
        serviceInfoLoad(params.customerId, params.serviceIds);
    });

    $("#serviceType .service-name").click(function(){
        $("#serviceType .select-box").slideToggle();
    });

    $("#serviceType .select-box").delegate("ul>li", "click", function(){
        var sid = $(this).attr("data-id"),
            remainNum = $(this).attr("data-remainNum");
        $("#serviceType .service-name").attr("data-id", sid).attr("data-remainNum", remainNum);
        $("#serviceType .service-name span").text($(this).text());
        $("#serviceInfo .num input[type=text]").val(params.serviceIds[sid]);
        waiterListHtml(oWaiterList);
        $("#serviceType .select-box").slideToggle();
    });

    $("#waiterSelector .i-select-text").click(function(){
        $("#waiterSelector .i-select-list").slideToggle();
    });

    $("#waiterSelector .i-select-list").delegate("ul>li", "click", function(){
        $("#waiterSelector .i-select-text").attr("data-id", $(this).attr("data-id"));
        $("#waiterSelector .i-select-text span").text($(this).text());
        $("#waiterSelector .i-select-list").slideToggle();
        var serviceId = $("#serviceType .service-name").attr("data-id");
        oBilling[serviceId]['waiterId'] = $(this).attr("data-id");
        oBilling[serviceId]['waiterName'] = $(this).text();
    });

    $("#serviceInfo .num input[type=text]").keyup(function(){
        var count = $(this).val(),
            remainNum = $("#serviceType .service-name").attr("data-remainNum");
        var reg = /^[1-9]\d*$/;
        if(count != "" && (!reg.test(count) || (parseInt(count) > parseInt(remainNum)) )){
            layer.msg('请输入小于剩余次数('+remainNum+')的数字');
            $(this).val(1);
            return ;
        }
    }).blur(function(){
        var serviceId = $("#serviceType .service-name").attr("data-id");
        oBilling[serviceId]['count'] = $(this).val();
    });


    //增加工单
    $("#addBillingBtn").click(function(){
        //客户备注
        var customerSummary = $("#customerSummaryText").val();
        //工单备注
        var billingSummary = $("#billingSummaryText").val();

        var serviceCards = [];
        for(var k in oBilling){
            var temp = JSON.stringify(oBilling[k]);
            serviceCards.push(temp);
        }
        var consumeTime = $("#serviceInfo .time .con").text();
        var jsonData = "{'merchantId':"+merchantId+",'shopId':"+shopID+",'accountId':"+params.customerId+",'employeeId':"+params.employeeId+",'employeeName':'"+params.employeeName+"', 'consumeTime':'"+consumeTime+"','orderRemark':'"+billingSummary+"', 'subaccountRemark':'"+customerSummary+"', 'serviceCards':["+serviceCards+"]}"

        var res = reqAjax("shop/quickChecks", jsonData);
        if(res.code == 1){
        	sessionStorage.setItem("prevPage", 6);
        	window.location.href="../../common/html/main/main.html";
        }else{
            layer.msg(res.msg);
            return;
        }

    });

})(jQuery);
