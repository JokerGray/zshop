(function($){
    var REQUEST_URL = {
        'waiter':'shopDisplayTerminal/getShopWaiterList',//服务人员
        'facility':'shopDisplayTerminal/getFacilitiesByShop',//所有设备
        'service_list':'shopDisplayTerminal/getAllServiceList',//查询商户下所有的服务
        'record':'shopDisplayTerminal/getConsumeRecordRemarkList', //工单备注历史记录
        'quickChecks': 'shopDisplayTerminal/quickChecks'//增加工单
    };

    var params = $.parseJSON(getUrlParams("params"));
    var oWaiterList = null, oFacilityList = null, oServiceList = null;
    var shopId = sessionStorage.getItem('shopId');
    var merchantId = sessionStorage.getItem('merchantId');

    $(function(){
        $("#customerInfoBox .customer-name").text(params.customerName);
        $("#customerInfoBox .customer-mobile").text(params.customerTel);
        $("#customerInfoBox .salesman").text(sessionStorage.getItem("username"));
        var cardArr = params.serviceInfo, sHtml = '';
        if(cardArr.length > 0){
            for(var i=0; i<cardArr.length; i++){
                if(cardArr[i].serviceType == 2){
                    for(var j=0; j<cardArr[i].consumpNum; j++){
                        sHtml += '<div class="list-item" data-sid="'+cardArr[i].serviceId+'" data-cid="'+cardArr[i].cardId+'" data-pid="'+cardArr[i].purchaseId+'" data-remainNum="'+cardArr[i].remainNum+'" data-type="'+cardArr[i].serviceType+'">'
                            //+ '<a href="javascript:;" class="remove-btn"></a>'
                            + '<h5 class="card-name">'+cardArr[i].cardName+'</h5>'
                            + '<div class="clearfix mb-half"><div class="left mr-2">'
                            + '<label>服务人员：</label>'
                            + '<select id="waiterSelector'+cardArr[i].serviceId+'" name="waiterSelector"></select>'
                            + '</div><div class="left"><label>服务次数：</label>'
                            + '<span class="consump-num">1</span> 次'
                            //+ '<input type="text" maxlength="3" placeholder="请输入数字" value="'+cardArr[i].consumpNum+'"> 次'
                            + '</div></div><div class="clearfix">'
                        sHtml += '<div class="left mr-2"><label>指定服务：</label>'
                                +'<select name="serviceSelector"></select></div>'

                        sHtml += '<div class="left">'
                            + '<label>服务业绩：</label><span class="achievements">'+cardArr[i].achievements+'</span> 元'
                            + '</div>';

                        sHtml += '</div></div>';
                    }
                }else{
                    sHtml += '<div class="list-item" data-serviceName="'+cardArr[i].serviceName+'" data-sid="'+cardArr[i].serviceId+'" data-cid="'+cardArr[i].cardId+'" data-pid="'+cardArr[i].purchaseId+'" data-remainNum="'+cardArr[i].remainNum+'" data-type="'+cardArr[i].serviceType+'">'
                        //+ '<a href="javascript:;" class="remove-btn"></a>'
                        + '<h5 class="card-name">'+cardArr[i].cardName+'</h5>'
                        + '<div class="clearfix mb-half"><div class="left mr-2">'
                        + '<label>服务人员：</label>'
                        + '<select id="waiterSelector'+cardArr[i].serviceId+'" name="waiterSelector"></select>'
                        + '</div><div class="left"><label>服务次数：</label>'
                        + '<span class="consump-num">'+cardArr[i].consumpNum+'</span> 次'
                        //+ '<input type="text" maxlength="3" placeholder="请输入数字" value="'+cardArr[i].consumpNum+'"> 次'
                        + '</div></div><div class="clearfix"><div>'
                        + '<label>服务业绩：</label><span class="achievements">'+cardArr[i].achievements+'</span> 元'
                        + '</div>';
                    sHtml += '</div></div>';
                }


            }
            $("#billingList").html(sHtml);
            getWaiterListByShopId();
            getServiceList();
        }

        //remarkRecordList();

    });

    //获取商户下的所有服务
    function getServiceList(){
        var param = {
            'merchantId': merchantId
        }
        reqAjaxAsync(REQUEST_URL['service_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                oServiceList = res.data;
                serviceListHtml(res.data);
            }else{
                layer.msg(res.msg);
            }
        });
    }

    function serviceListHtml(obj){
        var serviceArr = [{'id':'','text':'请选择'}];//{'id':'nodata','text':'请选择'}
        if(obj.length > 0){
            for(var i=0; i<obj.length; i++){
                var temp = {
                    'id': obj[i].id+"&"+obj[i].price,
                    'text':obj[i].serviceName
                };
                serviceArr.push(temp);
            }
            $('select[name=serviceSelector]').select2({
                data: serviceArr
            });
        }
    }

    //获取店铺下的服务人员
    function getWaiterListByShopId(){
        var param = {
            'merchantId': merchantId,
            'shopId': shopId
        }
        reqAjaxAsync(REQUEST_URL['waiter'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                oWaiterList = res.data;
                waiterListHtml(res.data);
            }else{
                layer.msg(res.msg);
            }
        });
    }
    function waiterListHtml(obj){
        var waiterArr = [{'id':'','text':'请选择'}];//{'id':'nodata','text':'请选择'}
        if(obj.length > 0){
            for(var i=0; i<obj.length; i++){
                var temp = {
                    'id': obj[i].id,
                    'text':obj[i].backUserName
                };
                waiterArr.push(temp);
            }
        }
        $('select[name=waiterSelector]').select2({
            data:waiterArr
        });
    }

    //获取历史记录
    function remarkRecordList(){
        var param = {
            'accountId':params.customerId,
            'serviceId':params.serviceInfo.serviceId
        };
        reqAjaxAsync(REQUEST_URL['record'], JSON.stringify(param)).done(function(res){
            var sHtml = '';
            if(res.code == 1){
                if(res.data.length > 0){
                    for(var i=0; i<res.data.length; i++){
                        sHtml += '<li>'+res.data[i].orderRemark+'</li>';
                    }
                }else{
                    sHtml += '<li class="nodata">暂无数据</li>';
                }
                $("#remarkRecordList").html(sHtml);
            }else{
                console.error(res.msg);
            }
        });
    }

    //获取开单的服务卡信息
    function getCardList(){
        var serviceArr = [];
        var itemArr = $("#billingList").find(".list-item");
        if(itemArr.length > 0){
            for(var i=0; i<itemArr.length; i++){
                var oItem = itemArr[i];
                var serviceId = $(oItem).attr("data-sid");
                var serviceType = $(oItem).attr("data-type");
                var wSelector = $(oItem).find("select[name=waiterSelector]");
                var waiterId = $(wSelector).val(),
                    waiterName = $(wSelector).find("option:selected").text();
                var cardName = $(oItem).find(".card-name").text();
                if(waiterId == '' || waiterName.search('请选择') > -1){
                    layer.msg("亲，【"+cardName+"】还没有选择服务人员！");
                    return false;
                }
                var temp = {
                    "serviceType":serviceType,
                    "serviceCardId": $(oItem).attr("data-cid"),   //服务卡编号**必传**
                    "serviceCardName": cardName,  //服务卡名称**必传**
                    "remake": "",                   //服务备注**必传**
                    "waiterId": waiterId,                  //技师编号**必传**
                    "waiterName": waiterName,             //技师名**必传**
                    "achievements": $(oItem).find(".achievements").text(), //服务业绩**必传**
                    "num": $(oItem).find(".consump-num").text(),    //服务次数**正整数必传**
                    "purchaseId": $(oItem).attr("data-pid")   //顾客服务卡编号**必传**
                };

                if(serviceType == 2){
                    var sSelector = $(oItem).find("select[name=serviceSelector]");
                    var sArr = $(sSelector).val(),
                        serviceName = $(sSelector).find("option:selected").text();
                    if(sArr == '' || serviceName.search('请选择') > -1){
                        layer.msg("亲，【成长卡】必须要指定服务项目！");
                        return false;
                    }
                    temp['serviceId'] = sArr.split("&")[0];
                    temp['price'] = sArr.split("&")[1];
                    temp['serviceName'] = serviceName;
                }else{
                    temp['serviceName'] = $(oItem).attr("data-serviceName");
                }

                serviceArr.push(temp);
            }
        }
        return serviceArr;
    }

    $("#addBillingBtn").click(function(){
        var serviceCards = getCardList();
        if(serviceCards.length > 0){
            var param = {
                'shopId': shopId,                               //门店编号**必传**
                'merchantId': merchantId,                         //商户编号**必传**
                'accountId': params.customerId,                         //客户编号**必传**
                'salesmanId': sessionStorage.getItem('backUserId'),     //操作人编号**必传**
                'salesman': sessionStorage.getItem('username'),        //操作人名称**必传**
                'serviceCards': serviceCards
            };
            //console.log(JSON.stringify(param));
            reqAjaxAsync(REQUEST_URL['quickChecks'], JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    sessionStorage.setItem("prevPage", 6);
                    window.location.href="../index.html";
                }else{
                    layer.msg(res.msg);
                    return ;
                }
            });
        }

    });

    //返回
    $(".main-title .return-icon").click(function(){
        sessionStorage.setItem("prevPage", 6);
        $(this).attr("href", '../index.html');
    });

})(jQuery);
