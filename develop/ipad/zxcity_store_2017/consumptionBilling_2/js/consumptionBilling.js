(function($){
    var REQUEST_URL = {
        'card_list': 'shop/serviceCards'
    };
    var shopId = sessionStorage.getItem('shopId'),
        merchantId = sessionStorage.getItem("merchantId");
    var employeeId = sessionStorage.getItem('backUserId');
    var employeeName =  sessionStorage.getItem('username');
    var customerAccountId = sessionStorage.getItem("accountId") == null ? "" : sessionStorage.getItem("accountId"),
    	serviceIds = "", customerName = "", customerTel = "",saleman = "";

    $(".staff-box .staff-name").text(employeeName);
    $(".staff-box .staff-num").text(employeeId);


    //查询顾客卡项信息
    function getCardListByAccountId(customerAccountId){
        var param = {
            'accountId': customerAccountId
        };
        reqAjaxAsync(REQUEST_URL['card_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var obj = res.data, sHtml = '';
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr data-cardid="'+obj[i].cardId+'" data-packType="'+obj[i].packType+'" data-cardName="'+obj[i].cardName+'" data-remainnum="'+obj[i].remainNum+'" data-achievements="'+obj[i].achievements+'" data-purchaseid="'+obj[i].purchaseId+'" data-serviceType="'+obj[i].serviceType+'" data-serviceid="'+obj[i].serviceId+'" data-name="'+obj[i].serviceName+'">';
                    sHtml += '<td><a href="javascript:;" class="check-btn"></a></td>'
                        + '<td>'+obj[i].cardName+'</td>'
                    if(obj[i].packType == 1){
                        sHtml += '<td>'+obj[i].remainNum+' / '+obj[i].totalNum+'</td>'
                            + '<td>—</td>'
                    }else if(obj[i].packType == 2){
                        sHtml += '<td>—</td>'
                            + '<td>'+obj[i].remainTime+'</td>'
                    }else{
                        sHtml += '<td>—</td>'
                            + '<td>—</td>'
                    }
                        sHtml += '<td><i class="minus-icon"></i><input type="text" class="consump-num" maxlength="3" value="1"><i class="plus-icon"></i></td>'
                        + '<td>'+obj[i].achievements+'</td>'
                        + '</tr>'
                }
                $("#cardsTable tbody").html(sHtml);
            }
        });
    }

    //校验手动输入的是否数字

    //数量单次增加或者减少
    $("#cardsTable tbody").delegate("tr>td .consump-num", "click", function(event){
        event.stopPropagation();
    }).delegate("tr>td .plus-icon", "click", function(event){
        event.stopPropagation();
        var packType = $(this).parents("tr").attr("data-packType");
        var remainNum = $(this).parents("tr").attr("data-remainnum");
        var _num = $(this).siblings(".consump-num").val();
        if(parseInt(_num)+1 <= remainNum || packType == 2){
            $(this).siblings(".consump-num").val(parseInt(_num)+1);
        }else{
            layer.msg("亲，已经达卡项的剩余次数上限咯~");
        }
    }).delegate("tr>td .minus-icon", "click", function(event){
        event.stopPropagation();
        var packType = $(this).parents("tr").attr("data-packType");
        var remainNum = $(this).parents("tr").attr("data-remainnum");
        var _num = $(this).siblings(".consump-num").val();
        if(parseInt(_num)-1 >= 1){
            $(this).siblings(".consump-num").val(parseInt(_num)-1);
        }else{
            layer.msg("亲，卡项最少的消耗次数为1，不能再少了~");
        }
    }).delegate("tr td .consump-num", "keyup", function(){
        event.stopPropagation();
        var packType = $(this).parents("tr").attr("data-packType");
        var remainNum = parseInt($(this).parents("tr").attr("data-remainnum"));
        var reg = /^[1-9]\d*$/;
        if($(this).val() != "" && (!reg.test($(this).val()) || $(this).val() > remainNum)){
            $(this).val(1);
            return;
        }
    }).delegate("tr td .consump-num", "blur", function(){
        event.stopPropagation();
        var packType = $(this).parents("tr").attr("data-packType");
        var remainNum = parseInt($(this).parents("tr").attr("data-remainnum"));
        if($(this).val() > remainNum){
            $(this).val(remainNum);
            layer.msg("数量不能超过剩余次数！");
        }else if($(this).val() <0){
            $(this).val(1);
            layer.msg("数量不能为负数！");
        }else if($(this).val() ==''){
            $(this).val(1);
        }
    });

    $("#submitBtn").click(function(){

        var oChkArr = $("#cardsTable tbody").find("tr.checked");
        if(oChkArr.length == 0){
            layer.msg("请选择一个服务卡项！");
            return;
        }else{
            var paramArr = [];
            for(var i=0; i<oChkArr.length; i++){
                var oChk = oChkArr[i];
                var purchaseId = $(oChk).attr("data-purchaseid"),
                serviceId = $(oChk).attr("data-serviceid"),
                serviceName = $(oChk).attr("data-name"),
                serviceType = $(oChk).attr("data-serviceType"),
                cardId = $(oChk).attr('data-cardid'),
                achievements = $(oChk).attr('data-achievements'),
                remainNum = $(oChk).attr('data-remainnum'),
                cardName = $(oChk).attr('data-cardName'),
                consumpNum = $(oChk).find(".consump-num").val();
                if(consumpNum == '' || parseInt(consumpNum) < 0 || isNaN(consumpNum)){
                    layer.msg("请输入正确的消耗次数！");
                    return;
                }
                var serviceInfo = {
                    "purchaseId":purchaseId,
                    "serviceName":serviceName,
                    "serviceId":serviceId,
                    "serviceType": serviceType,
                    "cardName":cardName,
                    "cardId":cardId,
                    "achievements":achievements,
                    "remainNum":remainNum,
                    "consumpNum":consumpNum
                };
                paramArr.push(serviceInfo);
            }

            var params = JSON.stringify({
                "customerId":customerAccountId,
                "customerName":customerName,
                "customerTel":customerTel,
                "serviceInfo":paramArr
            });
            window.parent.location.href = "./addBilling.html?params="+params;
        }

    });

    //选择客户并保存客户信息
    window.selCustomer = function(row){
        customerAccountId = row.id;
        saleman = row.operatorName ? row.operatorName : employeeName;
        customerName = row.accountName||row.name;
        customerTel = row.mobile;

        var tHtml = '<tr><td class="customer-name">会员名称：'+customerName+'</td>'
            + '<td class="phone-num">联系电话：<span>'+row.mobile+'</span></td></tr>'
            + '<tr><td class="card-money">卡项资金：<span>'+row.interest+'</span>元</td>'
            + '<td class="card-type">会员类型：<span>'+row.businessName+'</span></td></tr>'
            + '<tr><td class="card-num">会员卡号：<span>'+row.cardNumber+'</span></td>'
            + '<td class="create-time">开卡时间：<span>'+row.createTime+'</span></td></tr>';
        $("#customerInfo table>tbody").html(tHtml);

        getCardListByAccountId(row.id);

    }

    $("#selectCustomerBtn").click(function(){
        var addLayer = layer.open({
			type: 2,
			title: '选择客户',
			area: ['90%', '80%'], //宽高
			closeBtn: 1,
			shadeClose: true, //开启遮罩关闭
			content: ['../customerManagement/html/selCustomerWin.html?backUserId='+employeeId, 'no']
		});
    });

    $("#serviceList table>tbody").delegate("tr", "click", function(){
        $(this).toggleClass("checked");
    });

    //获取默认熟客信息
    function defaultCustomerInfoLoad(){
        var jsonData = "{'merchantId':"+merchantId+", 'shopId':"+shopId+",'keyword':'','pageNo':1,'pageSize':1}";
        reqAjaxAsync("shopDisplayTerminal/queryShopAccountList", jsonData).done(function(res){
            if(res.code == 1){
                if(res.data.length > 0){
                    selCustomer(res.data[0]);
                }
            }
        });

    }

    //根据accountId获取客户详情
    function getCustomerInfoByAccountId(){
    	var jsonData = "{'accountId':"+customerAccountId+",'shopId':"+shopId+"}";
    	reqAjaxAsync("shop/customerDetails", jsonData).done(function(res){
            if(res.code == 1){
        		selCustomer(res.data);
        	}
        });

    }

    $(function(){
    	if("" == customerAccountId){
    		defaultCustomerInfoLoad();
    	}else{
    		getCustomerInfoByAccountId();
    	}
    });



})(jQuery);
