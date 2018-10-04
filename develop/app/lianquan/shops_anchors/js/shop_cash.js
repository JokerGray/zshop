$(function () {
    var CMD_NOCASH = "game/earningsQuery",//查询未结算
        CMD_CASH = "game/sendAccounts",//申请结算
        CMD_COMPUTE = "scLaborTaxList/selectLaborTaxCalculation",//劳务税计算
        CMD_HASCASHIED = "game/findAccounts";	//查询已结算
    // 店铺切换
    var SHOPID = Number(getUrlParams('shopId'));
    $('.cash_btn').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var type=$(this).attr('data-type');
        console.log(type);
        if(type=='0'){
            $('#noCash').hide();            
            $('#cashied').show();
            var datas = {
                "shopId": SHOPID,
                "page": 0,
                "row": 5
            }
            reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_NOCASH, datas).done(function (res) {
                console.log(res);
                res.row=datas.row;
                console.log(res);
                showPage1(res);
            })     
        }else if(type=='1'){
            $('#cashied').hide();
            $('#noCash').show();
            var datas = {
                "shopId": SHOPID,
				"status":-1,
				"page":0,
				"row":5
            }
            reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_HASCASHIED, datas).done(function (res) {
                console.log(res);
                res.row=datas.row;
                showPage2(res);
            })  
        }
    });
    $('.cash_btn').eq(0).trigger('click');
    // 未结算渲染
    function showPage1(res) {
        $('#cashied').html('');
        if(res.code=='1'&&res.data.list.length>0){
            var cashiedHtml = template('pageCashed', res);
            $('#cashied').html(cashiedHtml);
            $('#pageChange1').change(function(){
            var pageNum=$(this).val();
            $('#pageEnd1').val(pageNum);
            var datas = {
                "shopId": SHOPID,
                "page": 0,
                "row":Number(pageNum)
                }
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_NOCASH, datas).done(function (res) {
                    console.log(res);
                    res.row=datas.row;
                    showPage1(res);
                })  
            });
            // 定义弹窗的开启和关闭事件
            var $btn = $(".sendApply");
            sendApply($btn);
            $('#colseModel').on('click', function () {
                $('.model').hide();
            })            
        }else{
            var errorHtml = template('errorPage', res);
            $('#cashied').html(errorHtml);  
        }

    }
    // 已结算渲染
    function showPage2(res) {
        if(res.code=='1'&&res.data.list.length>0){
            $('#noCash').html('');
            var cashiedHtml = template('nocashPage', res);
            $('#noCash').html(cashiedHtml);
            $('#pageChange2').change(function(){
            var pageNum=$(this).val();
            $('#pageEnd2').val(pageNum);
            var datas = {
                "shopId": SHOPID,
                "status":-1,
                "page": 0,
                "row":Number(pageNum)
                }
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_HASCASHIED, datas).done(function (res) {
                    console.log(res);
                    res.row=datas.row;
                    showPage2(res);
                })  
            });
        }else{
            var errorHtml = template('errorPage', res);
            $('#noCash').html(errorHtml);  
        }
    }

    // 结算按钮
    function sendApply($btn) {
        $btn.on("click", function () {
            $("#balanceTotal").val("");
            $("#rmb").val("");
            $("#yName").val("");
            $("#yIdCard").val("");
            $("#yPhone").val("");
            $("#shouldPay").val("");
            $("#thisTax").val("");
            $("#taxMoney2").val("");
            $("#tax").text("");
            $("#corporationName").val("");
            $("#creditCode").val("");
            $("#invoiceNumber").val("");

            var userId = Number($(this).attr('data-userid')),
                shopId = SHOPID,
                balance = $(this).attr('data-balance'),
                auditstatus = $(this).attr('data-auditStatus');
            console.log(userId)
            console.log(shopId)
            console.log(balance)
            console.log(auditstatus)
            $("#adstatus").val(auditstatus);
            $("#balanceTotal").attr("balance", balance);
            $("#balanceTotal").attr("placeholder", "≤" + balance + "只（10的倍数）");
            $(".model").show();
            // 结算量输入框
            $("#balanceTotal").on("input", function () {
                var values = $(this).val();
                if (!(/^[0-9]*[1-9][0-9]*$/i).test(values)) {
                    $(this).val("");
                }
                $("#rmb").val("");
                $("#taxMoney1").text("");
                $("#taxMoney2").val("");
                $("#tax").text("");
            });
            $("#balanceTotal").on("change", function () {
                var values = $(this).val();
                if (Number(values) > Number(balance)) {
                    layer.msg("请不要多于" + balance + "！");
                    $(this).val("");
                    return false;
                }
                if (!(/^[1-9][0-9]*0$/i).test(values)) {
                    layer.msg("请输入10的整数倍！");
                    $(this).val("");
                    return false;
                }
                var rmb = values / 10,
                    tax = Math.ceil(rmb * 0.8 * 0.2);
                $("#rmb").val(rmb);
                $("#taxMoney2").val(rmb);
                var datas = {
                    laborCosts: rmb,
                    userId: userId
                }
                reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_COMPUTE, datas).done(function (res) {
                    // console.log(res);
                    showTax(res);
                })
            });

            function showTax(re) {
                console.log(re);
                if (re.code == 1) {
                    $("#shouldPay").val(re.data.shouldPayATax);
                    $("#thisTax").val(re.data.paymentAmountCalculationFormula);
                } else {
                    layer.msg(re.msg);
                }
            }
            $(".taxli").eq(0).trigger("click");

            $("#submit").on("click", function () {
                if ($(this).hasClass("nosubmit")) {
                    layer.msg("不可提交");
                    return false;
                }
                var newBal = $("#balanceTotal").val();
                if (!newBal) {
                    layer.msg("请输入结算金额");
                    return false;
                }
                var type = $(".taxli_active").index();
                //					税务类型：0为个人，1为企业
                if (type) {
                    var corporationName = $("#corporationName").val(),
                        invoiceNumber = $("#invoiceNumber").val(),
                        creditCode = $("#creditCode").val();
                    if (!corporationName) { layer.msg("请输入企业名称"); return false; }
                    if (!invoiceNumber) { layer.msg("请输入发票编号"); return false; }
                    if (!creditCode) { layer.msg("请输入统一社会信用代码"); return false; }

                    var datas = {
                        "shopId": shopId,
                        "userId": userId,
                        "balance": newBal,
                        "taxType": "企业报税",
                        "corporationName": corporationName,
                        "invoiceNumber": invoiceNumber,
                        "creditCode": creditCode
                    }
                    var data = JSON.stringify(datas);
                    layer.confirm('申请结算吗？', {
                        btn: ['确认', '取消'] //按钮
                    }, function () {
                        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_CASH, datas).done(function (res) {
                            // console.log(res);
                            sendResult(res);
                        })
                    }, function () {
                    });
                    //						 个人税务类型
                } else {
                    var yName = $("#yName").val();
                    if (!yName) { layer.msg("请输入真实姓名"); return false; }
                    var yIdCard = $("#yIdCard").val();
                    if (!yIdCard) { layer.msg("请输入身份证号码"); return false; }
                    var isIDCard1 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
                    var isIDCard2 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                    var regs = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                    if (!regs.test(yIdCard)) { layer.msg("请输入正确身份证号码"); return false; }
                    var yPhone = $("#yPhone").val();
                    if (!yPhone) { layer.msg("请输入手机号码"); return false; }
                    if (!(/^[1][3,4,5,7,8][0-9]{9}$/i).test(yPhone)) { layer.msg("请输入正确手机号码"); return false; }
                    var datas = {
                        "shopId": shopId,
                        "userId": userId,
                        "balance": newBal,
                        "taxType": "劳务报税",
                        "name": yName,
                        "idNumber": yIdCard,
                        "phone": yPhone
                    }
                    layer.confirm('申请结算吗？', {
                        btn: ['确认', '取消'] //按钮
                    }, function () {
                        reqNewAjaxAsync('/zxcity_restful/ws/rest', CMD_CASH, datas).done(function (res) {
                            sendResult(res);
                        })
                    }, function () {
                    });
                }
            });
        });
    }
    // 税务按钮切换
    $(".taxli").on("click", function () {
        $(this).siblings().removeClass("taxli_active");
        $(this).addClass("taxli_active");
        var adstatus = Number($("#adstatus").val());
        console.log("点击状态：" + adstatus);
        if ($(this).index() == 0) {
            $("#submit").removeClass("nosubmit");
            if (adstatus) {
                $(".stTip").show();
                $("#submit").addClass("nosubmit");
            } else {
                $(".stTip").hide();
            }
            $(".mdct1").hide(); $(".mdct0").show();
        } else if ($(this).index() == 1) {
            $("#submit").removeClass("nosubmit");
            $(".mdct0").hide(); $(".mdct1").show();
        }
    });
    // 申请结算回调
    function sendResult(re) {
        layer.msg(re.msg);
        setTimeout(function () {
            window.location.reload();
        }, 2000);
    }

});