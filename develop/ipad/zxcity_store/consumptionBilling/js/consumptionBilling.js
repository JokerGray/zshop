(function($){
    var shopId = sessionStorage.getItem('shopId');
    var employeeId = sessionStorage.getItem('backUserId');
    var employeeName =  sessionStorage.getItem('username');
    var customerAccountId = sessionStorage.getItem("accountId") == null ? "" : sessionStorage.getItem("accountId"), 
    	serviceIds = "", customerName = "", customerTel = "",saleman = "";

    $(".staff-box .staff-name").text(employeeName);
    $(".staff-box .staff-num").text(employeeId);
    //订单的销售单明细列表
    function orderListInit(customerAccountId) {
        var jsonData = "{'accountId':"+customerAccountId+"}";
        var res = reqAjax("shop/serviceCards", jsonData);
        if(res.code == 1){
            var obj = res.data, sHtml = "";
            for(var i=0; i<obj.length; i++){
                if(i%2 == 0){
                    sHtml += '<tr class="even" data-id="'+obj[i].purchaseId+'">'
                }else{
                    sHtml += '<tr class="odd" data-id="'+obj[i].purchaseId+'">'
                }
                sHtml += '<td class="service-name">'+obj[i].cardName+'</td>'
                    + '<td class="num1 yellow">'+obj[i].totalNum+'</td>'
                    + '<td class="num2 yellow">'+obj[i].remainNum+'</td>'
                    + '<td><a class="minus-btn num-control glyphicon glyphicon-minus"'
                    + ' href="javascript:void(0);"></a><input type="text" class="num-text" value="0" maxlength="3"/>'
                    + '<a class="plus-btn num-control glyphicon glyphicon-plus" href="javascript:void(0);"></a></td>'
                    + '</tr>'
            }
            $("#serviceList table>tbody").html(sHtml);
        } else {
            layer.alert(res.msg);
        }
    }

    function historyListLoad(customerAccountId) {
        var jsonData = "{'shopId':"+shopId+",'accountId': "+customerAccountId+"}";
        var res = reqAjax("shop/queryIpadConsumptions", jsonData);
        if(res.code == 1){
            var sHtml = "";
            for(var i=0; i<res.data.length; i++){
                sHtml += '<li><p class="name">'+res.data[i].purchaseName+'</p><p class="time">日期：<span>'+res.data[i].consumeTime.substring(0,11)+'</span></p></li>'
            }
            $("#historyList ul").html(sHtml);
        }
    }

    //选择客户并保存客户信息
    window.selCustomer = function(row){
        customerAccountId = row.accountId;
        saleman = row.operatorName ? row.operatorName : employeeName;
        customerName = row.accountName||row.name;
        customerTel = row.mobile;

        var tHtml = '<tr><td class="customer-name">'+customerName+'</td>'
            + '<td class="card-money">卡项资金：<span>'+row.interest+'</span>元</td>'
            + '<td class="create-time">开卡时间：<span>'+row.creatTime+'</span></td></tr>'
            + '<tr><td class="card-num">会员号：<span>'+row.cardNumber+'</span></td>'
            + '<td class="card-type">会员类型：<span>'+row.cardName+'</span></td>'
            + '<td class="phone-num">联系电话：<span>'+row.mobile+'</span></td>'
            + '</tr>';
        $("#customerInfo table>tbody").html(tHtml);

        //客户名点击跳转
        $('#customerInfo .customer-name').on('click', function () {
            window.parent.location.href = "../../customerManagement/html/customerOverview.html?accountId=" + customerAccountId;
        });

        orderListInit(row.accountId);
        historyListLoad(row.accountId);
    }

    $("#selectCustomerBtn").click(function(){
        var addLayer = layer.open({
			type: 2,
			title: false,
			area: ['1600px', '1200px'], //宽高
			closeBtn: 0, //不显示关闭按钮
			shadeClose: true, //开启遮罩关闭
			content: ['../../customerManagement/html/selCustomerWin.html?backUserId='+employeeId, 'no']
		});
    });

    $("#submitBtn").click(function(){
        var zeroCount = 0;
        $("#serviceList table>tbody td .num-text").each(function(index, item){
            if(0 != $(item).val()){
                zeroCount++;
                var id = $(this).parents("tr").attr("data-id");
                serviceIds += '\"'+id+'\":'+$(item).val()+',';
            }
        });
        if(zeroCount == 0){
            layer.msg("消耗数量不能全部为0")
            return;
        }else{
            serviceIds = '{'+serviceIds.substring(0, serviceIds.length-1)+'}';
            var params = '{"customerId":'+customerAccountId+',"customerName":"'+customerName+'","customerTel":'+customerTel+',"saleman":"'+saleman+'","serviceIds":'+serviceIds+',"employeeName":"'+employeeName+'","employeeId":'+employeeId+'}';

            window.parent.location.href = "./addBilling.html?params="+params;
        }
    });

    $("#serviceList table>tbody").delegate("tr td .minus-btn", "click", function(){
        var num = parseInt($(this).siblings('.num-text').val());
        if(num <= 1){
            $(this).siblings('.num-text').val(0);
            return;
        }else{
            $(this).siblings('.num-text').val(--num);
        }
    }).delegate("tr td .plus-btn", "click", function(){
        var num = parseInt($(this).siblings('.num-text').val());
        var totalNum = parseInt($(this).parent().siblings('.num2').text());
        if((num+1) > totalNum){
            $(this).siblings('.num-text').val(totalNum);
            layer.msg("数量不能超过剩余次数！");
            return ;
        }else{
            $(this).siblings('.num-text').val(++num);
        }
    }).delegate("tr td .num-text", "keyup", function(){
        var totalNum = parseInt($(this).parent().siblings('.num2').text());
        var reg = /^[0-9]\d*$/;
        if($(this).val() != "" && (!reg.test($(this).val()) || $(this).val() > totalNum)){
            $(this).val("");
            return;
        }
    }).delegate("tr td .num-text", "blur", function(){
        var totalNum = parseInt($(this).parent().siblings('.num2').text());
        if($(this).val() > totalNum){
            $(this).val(totalNum);
            layer.msg("数量不能超过剩余次数！");
        }else if($(this).val() <0){
            $(this).val(0);
            layer.msg("数量不能为负数！");
        }else if($(this).val() ==''){
            $(this).val(0);
        }
    });

    //获取默认熟客信息
    function defaultCustomerInfoLoad(){
        var jsonData = "{'employeeId':"+employeeId+"}";
        var res = reqAjax("shop/queryRegularCustomers", jsonData);
        if(res.code == 1){
            if(res.data.length > 0){
                selCustomer(res.data[0]);
            }
        }
    }
    
    //根据accountId获取客户详情
    function getCustomerInfoByAccountId(){
    	var jsonData = "{'accountId':"+customerAccountId+",'shopId':"+shopId+"}";
    	var res = reqAjax("shop/customerDetails", jsonData);
    	if(res.code == 1){
    		selCustomer(res.data);
    	}
    }

    $(function(){
    	if("" == customerAccountId){
    		defaultCustomerInfoLoad();
    	}else{
    		getCustomerInfoByAccountId();
    	}
    });
    
   

    //选择员工
    function selectOperator(){
        var jsonData = "{'shopId':"+shopId+"}";
        var res = reqAjax('shop/salemansPersonInShop', jsonData);
        if(res.code == 1){
            var obj = res.data, sHtml = '<div class="operator-list">';
            for(var i=0,len=obj.length; i<len; i++){
                sHtml += '<a href="javascript:void(0);" data-id="'+obj[i].id+'">'+obj[i].username+'</a>'
            }
            sHtml += '</div>';
            return sHtml;
        }else{
            return "";
        }
    }



    $(".staff-box").click(function(){
        var sHtml = selectOperator();
        if(sHtml != ""){
            layer.open({
                type: 1,
    			title: '选择员工',
                skin: 'diy-layer',
    			area: ['500px', '800px'], //宽高
    			content: sHtml,
                success: function(layero, index){
                    $(document).delegate(".operator-list a", 'click', function(){
                        var optId = $(this).attr("data-id"),
                        optName = $(this).text();
                        $(".staff-box .staff-name").text(optName);
                        $(".staff-box .staff-num").text(optId);
                        employeeName = optName ;
                        employeeId = optId;
                        layer.close(index);
                    });
                }
            });
        }

    });


})(jQuery);
