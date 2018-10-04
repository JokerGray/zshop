//0-9数字键keycode[48~57][96~105] .[110, 190]
var REQUEST_URL = {
    'order_detail': 'foodBoot/findFoodPresale',//查询订单详情
    'member_info':'foodBoot/findStoreRetentionListsAndMembercard',//查询会员信息及留店商品
    'leaveGoods':'foodBoot/updateFoodPresaleInfo',//留店
    'giveGoods':'',//赠送
    'returnGoods':'foodBoot/addFoodPresaleRetire',//退菜
    'order_pay':'foodBoot/member/please',//会员结账
    GIVEFOOD:'foodBoot/giveFood',//赠送菜
    order_no_menber:'foodBoot/no/member/please',//非会员结账
};
var facilityId = GetQueryString('facilityId') || '';
var presaleId = GetQueryString('presaleId') || '';
var shopId = GetQueryString('shopId')||'' , merchantId = GetQueryString('merchantId') || '' ;

var operatorId = GetQueryString('userId') || '', operatorName = decodeURI(GetQueryString('userName')) || "";//操作员id;

var memberAccount = 0;//会员账户金额
var memberDiscount = 1;
var basePayNum = 0;//原支付金额
 //订单id
var memberId = ''; //会员id
var discountedPrice = 0; // 优惠金额
var orderPay = 0; //实际支付金额
var oTemp = {};//用于订单操作存储数据
var yh = 0;
var waiterId =null;
var waiterName = null;
var additionalMoney=0;//服务费
var totalNum = 0;
var objData = {};
var copyLiuList = ''
var orderPay;
var hyj = {};
var memberOrderPay = 0;
var wp=Strato.WebPrinter.getInstance();
var orderIndex,orderFood;
//查询订单详情
function getOrderDetail(){
    var param = {
        'id': presaleId
    }
    reqAjaxAsync(REQUEST_URL['order_detail'], JSON.stringify(param)).done(function(res){
        var sHtml = '';
        if(res.code == 1){
            var resData = res.data;
            objData =res.data;
            var oList = resData.scPresaleInfos;
            $("#facilityId").text(resData.title);
            $("#peopleNum").text(resData.peopleNumber);
            $("#orderNo").text(resData.id);
            $("#orderTime").text(resData.consumeTime);
            $("#totalNum").text(resData.presaleInfoNum);
            $("#totalCount").html('￥<em>'+resData.shouldPay.toFixed(2)+'</em>');
            totalNum = resData.presaleInfoNum
            $("#surchargeName").text(resData.additionalName);
            if(resData.additionalMoney){
                $("#surchargeCount").text('￥' + resData.additionalMoney);
            }else{
                $(".surcharge").hide();
            }
           
            // $("#shouldPayNum1, #shouldPayNum2").text(resData.shouldPay.toFixed(2));
            basePayNum = Number(resData.shouldPay) + Number(resData.additionalMoney);
            orderPay = Number(resData.shouldPay)+ Number(resData.additionalMoney);
            waiterId =resData.salesmanId;
            waiterName = resData.salesman;
            additionalMoney = resData.additionalMoney
            setTotal()
            if (oList.length > 0){
                
                $.each(oList,function(i,item){
                    sHtml+=`<li class="order-item" data-gid="${item.goodsServiceId}" data-id="${item.id}" data-unitPrice="${item.unitPrice}" data-price="${item.actualPayment}" data-num="${item.purchaseNum}">
                                <div>
                                    <p class="name"><em>${item.purchaseName}</em><i class="zeng" style="display:${item.actualPayment == 0 ?'inline-block':'none'}">赠</i><i class="liu" style="display:none">留</i></p>
                                    <p class="desc">${item.stockName || ''} </p>
                                </div>
                                <div>
                                    <p class="num">X <em class="num_em">${item.purchaseNum}</em></p>
                                    <p class="price"><span>&yen;<em>${item.actualPayment.toFixed(2)}</em></span><span class="hyj_span" style="display:none;">&yen;<k class="hyj"></k></span></p>
                                </div>
                            </li>`
                })
            }
            $("#orderList").html(sHtml);
            if($(".order-info").height()+$(".order-title").height()>$(".order-detail").height()){
                $(".order-detail").height($(".order-info").height()+$(".order-title").height())
            }
            if(memberId){
                offsetGoods();
            }
            $(".order-info").show();
            $(".money").find('input').focus()
        }
    });

}
$(".print-btn").click(function(e){
    startPrintes();
})
function startPrintes(){
    console.log('打印开始')
    objData.templateSetName='结账单';
    objData.orderParams=objData
    objData.totalPrice = orderPay;
    if(memberOrderPay){
        objData.totalPrice = memberOrderPay;
        var ullist = $("#orderList").find('li');
        var scPrelases =[];
        var shouldPay = 0;

        $.each(ullist,function(i,item){
            var obj = {};
            var tips = ''
            if($(this).find('.name .zeng').css('display') == 'inline-block'){
                tips = '[赠]'
            }else if($(this).find('.name .liu').css('display') == 'inline-block'){
                tips = '[留]'
            }
            obj.purchaseName = $(this).find('.name em').text() + tips;
            obj.stockName = $(this).find('.desc').text()
            obj.unitPrice = Number($(this).attr('data-unitprice'))
            obj.purchaseNum = $(this).find('.num_em').text()
            obj.totalMoney = Number($(this).find('.hyj').text()).toFixed(2);
            scPrelases.push(obj)
        })
        objData.orderParams.scPrelases = scPrelases;
    }else{
        objData.orderParams.scPrelases = objData.scPresaleInfos;
    }
    objData.totalNum = objData.presaleInfoNum
    objData.discountedPrice = discountedPrice;
    objData.orderParams.actualPay = Number($("#shouldPayNum1").text());//实付
    objData.orderParams.shouldPay = objData.orderParams.actualPay ;//总价
    objData.orderParams.date =objData.consumeTime;
    objData.orderParams.operatorName = operatorName;
    objData.orderParams.manNum  =objData.peopleNumber;
    objData.orderParams.facilityName  = objData.title;
    objData.orderParams.additionalMoney = additionalMoney;
    objData.totalNum = objData.presaleInfoNum
    console.log(objData)
    printObj.init(objData)
    printObj.findPrintSwitch()
}
function zc(price){
    var str = 'display:none'
    if(price == 0){
        str = 'display:inline-block'
    }
    return str;
}
//展开菜单操作区
$("#orderList").delegate("li.order-item", "click", function(e){
    //阻止冒泡
    stopPropagation(e)
    var id = $(this).attr("data-id");
    var num = $(this).attr("data-num");
    var price = $(this).attr("data-price");
    oTemp.id = id;
    oTemp.num = num;
    oTemp.price = price;
    oTemp.name = $(this).find('.name')
    oTemp.liu = $(this).find('.liu')
    // oTemp = {
    //     id: id,
    //     num: num,
    //     price: price
    // }
    // $(".order-handle").toggleClass("layui-hide");
    $(".handle_spec_btn_price").html('&yen;'+price)
    
    if(oTemp.price ==0){
        $("#handle_spec").hide();
        layer.msg("该菜品已是赠菜")
        return false
    }
    if( oTemp.liu.css('display') == 'inline-block'){
        layer.msg("留店商品不能赠送")
        $("#handle_spec").hide();
        return false
    }
    $(this).addClass('order-item-hover').siblings().removeClass('order-item-hover')
    $("#handle_spec").show();
});
$(".order-detail").click(function(e){
    //阻止冒泡
    stopPropagation(e)
})
//计算器
$(".handle_spec_box").on('click','.handle_spec_btn',function(e){
    $(this).addClass('handle_spec_btn_special').parents('li').siblings().find('button').removeClass('handle_spec_btn_special')

})
$(".handle_spec_cancel").click(function(e){
    $("#handle_spec,#handle_norms").hide();
    $("li.order-item").removeClass('order-item-hover')
})
var _index = null;
$("#preferentialNum").click(function(res){
            var demo = $("#moneyBox")
            var that = $(this)
            demo.find('input.money-input').val('');
            layer.open({
                title: false,
                type: 1,
                closeBtn: 0,
                content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                area: ['auto'],
                skin: 'layer_me',
                btn: '',
                end: function (layero, index) {
                    layer.close(index);
                },
                success: function (layero, index) {
                    _index = index;
                    demo.find('input').focus()
                    
                }
            })
})
$(".del").click(function () {
    layer.close(_index)
})
$(".moneySubmit").click(function () {
    moneySubimt()
})
function moneySubimt(){
    var totalMoney = 0
    if(memberId){
        totalMoney = memberOrderPay;
    }else{
        totalMoney = orderPay;
    }
    var demo = $("#moneyBox")
    var yhInput = demo.find('input.money-input');
    var youhui = yhInput.val()
    youhui = Number(yhInput.val())
    if(youhui>Number(totalMoney)){
        layer.msg('优惠金额不能大于应收金额哦')
        demo.find('input.money-input').val('')
        return false
    }else{
        layer.close(_index)
        $("#preferentialNum").val(youhui)
        discountedPrice=youhui
        setTotal()
        if(($("#money-input").val()-orderPay).toFixed(2)>=0){
            $("#changeNum").find('em').html(($("#money-input").val()-orderPay).toFixed(2))
        }
    } 
}
//设置总数
function setTotal(){
    console.log('basePayNum',basePayNum)
    console.log('orderPay',orderPay)

    if(memberId){
        orderPay = memberOrderPay-discountedPrice;
    }else{
        orderPay = basePayNum -discountedPrice;
    }
    
    orderPay= orderPay.toFixed(2)
    // if(merchantId){
    //     $("#discountNum").html((basePayNum-(basePayNum*memberDiscount)).toFixed(2))
    // }
    $("#shouldPayNum1").html(orderPay)
    $("#shouldPayNum2").html(orderPay)
}
$("#giveFood").click(function(e){
    layer.confirm('是否赠送【'+oTemp.name.find('em').text()+'】？',{title:'提示'},function(index){
        giveFood()
        layer.close(index)
    })
    
})
//赠送菜
function giveFood(){
    var param = {
        "id":oTemp.id ,//要送的菜的详细项id
        "presaleId": presaleId,// 订单id
    }
    reqAjaxAsync(REQUEST_URL.GIVEFOOD,JSON.stringify(param)).done(function(res){
        if(res.code == 1){
            console.log(res)
            layer.msg('赠菜成功');
            clearYh()
            getOrderDetail()
        }else{
            layer.msg(res.msg)
        }

    })
    
}
//
// cancular()

getOrderDetail();

//查询会员信息
function getMemberInfoByPhone(){
    var phoneNum = $.trim($("#phoneNum").val()) //$("#phoneNum").val();;
    if(!phoneNum){
        layer.msg("请填写手机号码!")
        return 
    }
    var param = {
        "shopId": shopId,
        "merchantId": merchantId,
        "mobile": phoneNum,
        presaleId:presaleId || '',
    };
    reqAjaxAsync(REQUEST_URL['member_info'], JSON.stringify(param)).done(function(res){
        if(res.code == 1){
            clearYh()
            hyj = res.data.accrecord;//会员价list
            var accountList = res.data.accountList;
            var goodsList = res.data.goodsList;
            //处理留店商品
            var sHtml = '<dt>留店商品</dt>';
            for(var i=0; i<goodsList.length; i++){
                sHtml += '<dd data-gid="' + goodsList[i].goodsId + '" data-num="' + goodsList[i].remainNum+'">'
                sHtml += '<p>' + goodsList[i].purchaseName+'</p>';
                sHtml += '<p>剩余：<em class="num_em">' + goodsList[i].remainNum + '</em></p></dd>';
            }
            $("#goodsList").html(sHtml);
            copyLiuList = sHtml;
           

            memberId = accountList[0].memberId;
            memberAccount = Number(accountList[0].principal);

            $(".member-info .name>span").text(res.data.cardName);
            $(".member-info .phone>span").text(phoneNum);
            $(".member-info .level>span").text(accountList[0].accountName);
            $(".member-info .account>span em").text(accountList[0].principal);
            
            //计算会员折扣
            if (accountList[0] && accountList[0].businessInfo){
                //会员折扣是否仅限余额消费，1-是，0-否
                var _limit = accountList[0].businessInfo.supportLimitBalance;
                var _shouldPay = Number($("#totalCount").find('em').text());
                var _discount  = Number(accountList[0].businessInfo.discount);
                memberDiscount = _discount/100;
                //应付金额
                var _payNum = _shouldPay * _discount / 100 ;

                //会员折扣金额
                var _discountNum = _shouldPay * (100 - _discount) / 100;
                //当会员折扣不受余额限制或者会员余额足够时，按折扣价算
                if (_limit != 1 || (_limit == 1 && memberAccount >= _payNum)){
                    orderPay = _payNum;
                    $("#shouldPayNum1, #shouldPayNum2").text(_payNum);
                    $("#discountNum").text(_discountNum);
                    // $(".order-info .order-total .discount").removeClass("layui-hide");
                }
            }
            offsetGoods()
            $(".member-info").removeClass("layui-hide").siblings().addClass("layui-hide");
            if($(".order-info").height()+$(".order-title").height()+$(".discount").height()>$(".order-detail").height()){
                $(".order-detail").height($(".order-info").height()+$(".order-title").height()+$(".discount").height())
            }
        }else{
            layer.msg('您暂时不是本店会员')
        }
    });
}


//会员信息查询
$("#searchMemberBtn").click(function(){
    getMemberInfoByPhone();
});
//登陆会员 enter
$("phoneNum").keydown(function(event){
    if (event.keyCode == 13){
        getMemberInfoByPhone();
    }
});
function orderMember(memberPay){
    discountedPrice = $("#preferentialNum").val() || '15313121215';
    var param = {
        "shopId": shopId, //店铺id
        "presaleId": presaleId, //订单id
        "memberId": memberId, //会员id
        "orderPay": orderPay, //支付金额
        "discountedPrice": discountedPrice, //优惠金额
        "operatorId": operatorId, //操作员id
        "operatorName": operatorName,//操作员名称
        "memberPay": memberPay, //是否会员余额结账  0 会员余额 2 现金会员
        additionalMoney:additionalMoney,
        deviceId:facilityId,
        waiterId:waiterId,
        waiterName:waiterName,
    };

    reqAjaxAsync(REQUEST_URL.order_pay, JSON.stringify(param)).done(function (res) {
        if(res.code == 1){
            openLayer()
        }else{
            layer.msg(res.msg);
        }
    });
}
function openLayer(){
    var demo = $("#checkOut")
    layer.open({
        title: false,
        type: 1,
        closeBtn: 0,
        content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: ['auto'],
        skin: 'layer_me',
        btn: '',
        end: function (layero, index) {
            layer.close(index);
            window.location.href = "../order/order_index.html?merchantId="+merchantId+"&shopId="+shopId+"&userId="+operatorId+'&userName='+encodeURI(operatorName)
        },
        success: function (layero, index) {
            $("#zhaoling").html(changeNum.toFixed(2))
            $(".del").click(function () {
                layer.close(index)
            })
            startPrintes()
        }
    })
}


//非会员结账
function orderNoMember(){
    var param = {
        shopId: shopId, //店铺id
        presaleId: presaleId, //订单id
        orderPay: orderPay, //支付金额
        discountedPrice: discountedPrice, //优惠金额
        operatorId: operatorId, //操作员id
        operatorName: operatorName,//操作员名称
        waiterId:waiterId,
        waiterName:waiterName,
        additionalMoney:additionalMoney,
        merchantId:merchantId,
        deviceId:facilityId
    };
    reqAjaxAsync(REQUEST_URL.order_no_menber, JSON.stringify(param)).done(function (res) {
        if(res.code == 1){
            openLayer()
            //todo 跳转至桌台页面
            
        }else{
            layer.msg(res.msg);
        }
    });
}
//会员结账
function orderPaySure(memberPay){
    discountedPrice = $("#preferentialNum").val() || '15313121215';
    var param = {
        "shopId": shopId, //店铺id
        "presaleId": presaleId, //订单id
        "memberId": memberId, //会员id
        "orderPay": orderPay, //支付金额
        "discountedPrice": discountedPrice, //优惠金额
        "operatorId": operatorId, //操作员id
        "operatorName": operatorName,//操作员名称
        "memberPay": memberPay, //是否会员余额结账  0 会员余额 2 现金会员
        
    };
    reqAjaxAsync(REQUEST_URL['member_info'], JSON.stringify(param)).done(function (res) {
        if(res.code == 1){
            lay.msg("操作成功~~~");
            //todo 跳转至桌台页面
            // window.location.href = '../../order/order_index.html'
        }else{
            layer.msg(res.msg);
        }
    });
}

//退出会员
$(".member-info .exit-btn").click(function(){
    orderPay = basePayNum;
    memberDiscount = 1;
    $(".member-info").addClass("layui-hide").siblings().removeClass("layui-hide");
    $("#shouldPayNum1, #shouldPayNum2").text(basePayNum);
    $("#discountNum").text(0);
    $(".order-info .order-total .discount").addClass("layui-hide");
    memberId = '';
    memberOrderPay = 0;
    $("#phoneNum").val('')
    clearYh()
    hyj=[];
    getOrderDetail()
});
function clearYh(){
    $("#preferentialNum").val(0);
    discountedPrice= 0 ;
}


//会员结账
$(".member-info .member-pay-btn").click(function(){
    if (memberAccount >= orderPay){
        orderMember(0)
    }else{
        layer.msg("会员余额不足，请及时充值~~~");
    }
    
});

//留店
$("#leveaBtn").click(function(){
    var param = {
        'id': oTemp.id,//详情项id
        'purchaseType': 6 //修改成的类型 留店商品为6
    };
    reqAjaxAsync(REQUEST_URL['leaveGoods'], JSON.stringify(param)).done(function(res){
        if(res.code == 1){
            //TODO
            $(".order-handle").addClass("layui-hide");
        }else{
            layer.msg(res.msg);
        }
    });
});

//赠送
$("#giveBtn").click(function () {

    var param = {
        "id": oTemp.id, //要送的菜的详细项id
        "presaleId": presaleId, //订单id
        "actualPayment": Number(oTemp.price) //此菜原有的价格
    };
    reqAjaxAsync(REQUEST_URL['returnGoods'], JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
            $(".order-handle").addClass("layui-hide");
            $("#orderList").find("li[data-id=" + oTemp.id +"] .price em").text(0);
            orderPay = orderPay - Number(oTemp.price);
            $("#shouldPayNum1, #shouldPayNum2").text(orderPay);
            
        } else {
            layer.msg(res.msg);
        }
    });
});

//退菜
$("#returnBtn").click(function(){
    orderPay = orderPay - Number(oTemp.price);
    var param = {
        "id": presaleId, //订单id  
        "shouldPay": orderPay,//退菜后的应付金额
        "actualPay": orderPay,//退菜后的实付金额
        "presaleInfoIdes":oTemp.id //要退的菜的id 多个用逗号隔开
    };
    reqAjaxAsync(REQUEST_URL['returnGoods'], JSON.stringify(param)).done(function(res){
        if(res.code == 1){
            $("#orderList").find("li[data-id=" + oTemp.id + "]").remove();
            $("#shouldPayNum1, #shouldPayNum2").text(orderPay);
            $(".order-handle").addClass("layui-hide");
        }else{
            layer.msg(res.msg);
        }
    });
});

//抵消留店商品

function offsetGoods(){
    memberOrderPay= 0 ;
    
    $("#goodsList").html(copyLiuList);//恢复留店商品
    var orderList = $("#orderList").find('li');
    var offsetGoodsList = $("#goodsList").find('dd');
    var diNum = 0;
    
    $.each(orderList,function(i,item){
        var mbnum = 0;
        var liel = $(this)
        var num_em = liel.find('.num_em');
        var orderNum = parseInt(num_em.text())
        var price = liel.find('.price em')
           
        $.each(offsetGoodsList,function(i,item){
            var newNum = 0;
            var ddel = $(this);
            var goodsEm = ddel.find('.num_em')
            var goodsNum = parseInt(goodsEm.text())
            
            if(liel.attr('data-gid') == ddel.attr('data-gid') && price.text() != '0.00'){
                if(goodsNum == 0)return false
                newNum = orderNum - goodsNum
                if(newNum < 0){
                    goodsEm.text(-newNum)
                    // totalNum = totalNum - orderNum;
                }else if(newNum == 0){
                    goodsEm.text(0)
                    // totalNum = totalNum - orderNum;
                }else{
                    liel.after(liel.clone())
                    liel.next().find('.num_em').html(newNum)
                    // totalNum+=parseInt(liel.next().find('.num_em').text())
                    num_em.html(goodsNum)
                    goodsEm.text(0)
                    var nextel =  liel.next();

                    if(hyj.length){
                        $.each(hyj,function(i,item){
                            var hyjel = $(this);
                            console.log(price.text())
                            if(nextel.attr('data-id') == hyjel.attr('presaleInfoId') ){
                                // liel
                                var ldmore = hyjel.attr('gradePriceUnit')*nextel.find('.num_em').text();
                                ldmore = ldmore.toFixed(2)
                                nextel.find('.price em').html(Number((nextel.attr('data-unitprice'))).toFixed(2))
                                nextel.find('.price em').parent().addClass('line_m').next().show().find('k').html(ldmore);
                                mbnum +=Number(ldmore)
                            } 
                        })
                    }
                }
                price.html('0.00')
                liel.find('.liu').css('display','inline-block');
            }
        })
        if(hyj.length){
            $.each(hyj,function(i,item){
                var hyjel = $(this);
                if(liel.attr('data-id') == hyjel.attr('presaleInfoId') && price.text() != 0){
                    // liel
                    price.parent().addClass('line_m').next().show().find('k').html(hyjel.attr('gradePrice').toFixed(2));
                    diNum += mbnum + Number(hyjel.attr('gradePrice'))
                } 
            })
            diNum+=mbnum;
        }else{
            diNum += mbnum  + Number(price.text())
        }
        var zeng = liel.find('.zeng');
            if(zeng.css('display') == 'inline-block'){
                return true
        } 
        memberOrderPay+= mbnum ;
        memberOrderPay+=Number(price.parent().next().find('.hyj').text()) || 0
    })
    orderPay = memberOrderPay.toFixed(2)
    $("#totalCount").find('em').html(diNum.toFixed(2))
    $("#totalNum").html(totalNum)

    setTotal();
}
//
function afterOffsetGoods(){

}
//选择支付方式
$(".type-list .type-item").click(function(){
    // $(this).addClass("active").siblings().removeClass("active");
});


//清空金额
$(".actual-pay .money .clear-btn").click(function(){
    $(".actual-pay .money-input").val('');
    $("#changeNum em").text(0.00);
});
var changeNum = 0;
//非会员结账
function checkOut(){
    var money = $(".actual-pay .money-input").val();
    var shouldPay = $("#shouldPayNum2").text();
    if (checkMoney(money)) {
        changeNum = Number(money) - Number(shouldPay);
        
        if (changeNum < 0){
            layer.msg("输入的金额少于应收金额，请重新输入~");
            return;
        }
        $("#changeNum em").text(changeNum.toFixed(2));
        layer.confirm('确定结账？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {
            // orderPaySure(2);
            if(memberId){
                orderMember(2)
            }else{
                orderNoMember()
            }
            layer.close(index)
            
        });
    }
    
}

//
$(".money").find('input').keydown(function(event){
    if (event.keyCode == 13){
        checkOut();
    }
});
$("#money-youhui").keydown(function(event){
    if (event.keyCode == 13){
        moneySubimt()
    }
});
//点击数字键盘
$(".num-table>tbody td").click(function(){
    var tdTxt = $(this).text();
    // var money = $(".actual-pay .money-input").val();
    var moneyInput = $(this).parents('.actual-pay').find('.money-input');
    var money = moneyInput.val();
    if($(this).hasClass("pay-col")){
        checkOut();
    }else{
        //长度超过11位或已输入过小数点，内容不再增加至输入框
        if (money.length >= 11 || (money.indexOf(".") > -1 && tdTxt == ".") ){
            return ;
        }
        if (money == "" && tdTxt == ".") {
            tdTxt = '0' + tdTxt;
        }
        if (tdTxt == "C") {
            tdTxt = "";
            money = '';
        }
        money += tdTxt;
        // $(".actual-pay .money-input").val(money);
        moneyInput.val(money)
    }
    
});

//非零开头的最多带两位小数的数字
function checkMoney(m){
    var reg = /^([0-9][0-9]*)+(\.[0-9]{1,2})?$/;
    if(reg.test(m)){
        return true;
    }else{
        layer.msg("请输入正确的金额~");
    }
}


$("#money-input").bind('input propertychange',function(){
     // if(e.value.slice
     var e = $(this)[0];
     check(e)
    var cn =  $("#changeNum").find('em');
    var shouldPay = $("#shouldPayNum2").text();
    if(e.value > Number(shouldPay)){
        cn.text((e.value - shouldPay).toFixed(2));
    }else{
        cn.text('0');
    }
})
function check(e){
    var reg = /^0[0-9]/
    if((Number(e.value)==0 || Number(e.value)) && !reg.test(e.value)){
        var re = /^\d+(?=\.{0,1}\d+$|$)/ 
        if (!re.test(e.value)) { 
            e.focus(); 
        }
     }else{
         e.value = e.value.slice(0,e.value.length-1) 
     } 
}
$("#money-youhui").bind('input propertychange',function(){
    var e = $(this)[0];
    check(e)
})