    var page = 1;
    var rows = 10;
    var locked = true;
    var bindClick = false;
    var merchantId = getUrlParams("merchantId"); //商户id
    var shopId = getUrlParams("shopId");//商铺id
    var userId = getUrlParams("userId"); //当前登录帐号id
    var userCode = getUrlParams('userCode') || sessionStorage.getItem("userCode"); //当前登录帐号
    var userName = getUrlParams('userName') || sessionStorage.getItem("userName"); //当前登录帐号名称
    var allGame; //所有活动数据
    var k=0;
    var reg = /^[0-9]+.?[0-9]*$/; //数字正则
    var integer= /^[0-9]*[1-9][0-9]*$/;//正整数
    var fls = true;
    console.log(userName)
    //接口参数
    var USER_URL = {
        BARCODE :'scavengingCode/getShopGoodsInfo', //(扫码搜索接口)
        EXCHANGE : 'scavengingCode/addExchange', //(卡券兑换)
        PROMOTION:'scavengingCode/findMemberPromotion', //(查询促销活动)
        ADDPUR:'scavengingCode/AllPurchase', //(下单并支付)
        SALELIST:'scavengingCode/findSalemanList', //查询员工接口
        FINDVIP:'scavengingCode/findVip'//查询vip接口取折扣
    };

    var layer = layui.layer;
    var table = layui.table;
    var form = layui.form;
    // layui.use('form', function(){
    //     form = layui.form;
    // })
    $('.card-item').on('click','.member-card',function(){
        var card = $(this);
        var cur = card.parent();
        card.addClass('check')
        cur.siblings().each(function (index, item) {
            $(item).find('.member-card').removeClass('check');
        });

        var subaccountId = card.attr('subaccountId');
        var principal = card.attr('principal');
        //设置选中的会员卡ID  本金
        $("#phone").attr("data-subaccountId", subaccountId);
        $("#principal").val(principal);
        //设置折扣
        var discount = card.attr('discount');
        $('#discount').val(discount / 10);
        setDiscountPrice();
    });

    var mySwiper = new Swiper('.swiper-container', {
        // direction: 'vertical',
        // 如果需要前进后退按钮
        direction: 'horizontal',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 3,
        slidesPerGroup: 3,
        
    });
 
    $(window).resize(function() {
        var width = parseInt($('.card-item').width());
        mySwiper.params.slidesPerView = Math.floor(width / 195);
        mySwiper.params.slidesPerGroup = mySwiper.params.slidesPerView;
        var slides = $('.swiper-slide');
        if(slides.length > 0) {
            var ary = [];
            for (var i = 0; i < slides.length; i++) {
                var text = slides.eq(i).text();
                if (text == '') {
                    ary.push(i);
                }
            } 
            mySwiper.removeSlide(ary);
        }
        var j = mySwiper.slides.length % mySwiper.params.slidesPerView;
        if (j != 0) {
            for (var i = 0; i < mySwiper.params.slidesPerView - j; i++) {
                mySwiper.appendSlide('<div class="swiper-slide"></div>');
            }
        }
        mySwiper.onResize();
        mySwiper.update();
    });
    form.verify({
        phone: [/^1[3|4|5|7|8|9]\d{9}$/, '会员账号有误，请重新核对！']
    })
    //初始化
    $(function(){
        
        sale();//加载销售员工
        getPromotion();//促销活动
        setTimeout(function(){
            $("#codeName").focus();
        },1);

    });

    //滚动条透明(优惠券)
    $(".table-box").niceScroll({
        cursorcolor:"#dfdfdf",
        cursorborder:"0",
        autohidemode:false
    });

    $(".duigame").niceScroll({
        cursorcolor:"#dfdfdf",
        cursorborder:"0",
        autohidemode:false
    });

    //切换支付方式
    form.on('select(paytype)', function(data){
        $("#selectPay").attr("data-type",data.value);
    });

    //销售员工
    form.on('select(salesman)', function(data){
        $("#sales").attr("data-type",data.value);
        $("#sales").attr("data-text",$(this).text());
    });

    //促销活动选择
    form.on('select(game)', function(data){
        var inx = $(this).index();
        if(inx!=0){
            var index = parseInt($(this).index())-1;
            var acThresholdMoney = allGame[index].acThresholdMoney;//活动门槛金额
            var acType = allGame[index].acType;//优惠类型(0-减免金额,1-提供折扣,2-实物赠送)
            var actualPay = $.trim($("#actualPay").val());//实付
            var acContentt = allGame[index].acContent;//活动内容
            $("#game").attr("data-type",acType);
            $("#game").attr("data-acContentt",acContentt);
            $("#game").attr("data-acThresholdMoney",acThresholdMoney);
            if(actualPay>=0){
                if(actualPay>=acThresholdMoney){ //达到门槛
                    truePayt();
                }else{
                    layer.msg("未达到门槛金额，不适用此活动",{icon:6});
                    $("#game").attr("data-type","");
                    $("#game").attr("data-acContentt","");
                    $("#game").attr("data-acThresholdMoney","");
                     $('#game').val(-1)
                     form.render('select')
                }
            }
        }else{
            $("#game").attr("data-type","");
            $("#game").attr("data-acContentt","");
            $("#game").attr("data-acThresholdMoney","");
            truePayt();
        }
        form.render('select')
    });
    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
    //监听 表格点击事件
    // table.on('event(moreTable)', function(obj) {
    //     var checkStatus = table.checkStatus('moreTable');
    //     console.log(checkStatus);
    //     console.log(obj);
    // });
 
    $(document).click(function (event) {

        if(bindClick){
            $('.phone_list').hide();
            var el = $('#phone');
            bindClick = false;
            if(el.val().length !== 11){
                setPrice({});
            }else{
                tradeInit(el);
                if($('.phone_list_bottom li:eq(0)').attr('data-data')){
                    var dd = JSON.parse($('.phone_list_bottom li:eq(0)').attr('data-data'))
                    setPrice(dd);
                }

            }

        }

    })
    //取消冒泡
    $("#phone").parents('div.layui-input-block').bind('click',function(e){
        stopPropagation(e);
    });
    $('.layui-form-select').bind('click',function () {
        stopPropagation(e);
    })


    //监听手机号变化
    $("#phone").focus(function () {
        var el = $(this);
        $('.phone_list').show();
        $("#phone").attr("data-isvip", '');  
        $("#phone").attr("data-memberId", '');
        tradeInit(el);
        bindClick = true;
    }).on("keyup",function(){
        $("#searchPhone").css({
            "background":"#1dc0af"
        });
        var el = $(this);
        $("#phone").attr("data-isvip", '');
        $("#phone").attr("data-memberId", '');
        tradeInit(el);
        bindClick = true;
    })
    function tradeInit(el){
        //ajax请求
        var params = {
            param:$.trim(el.val()),//
            merchantId:merchantId
        }
        getAccount(params)
        if(el.val() === ''){
            setPrice({});
        }
         
    }
    function getAccount(params){
        return reqAjaxAsync(USER_URL.FINDVIP,JSON.stringify(params)).done(function (res) {
            var el = $('.phone_list_bottom');
            if(res.code == 1 && res.data.cardParam.length>0){
                var datas = res.data.cardParam;
                var str = '';
                $.each(datas,function (n,item) {
                    str += "<li data-data='" + JSON.stringify(item) + "'><div>" + (item.mobile || '') + "</div><div>" + (item.memberName || '')+"</div></li>"
                    // console.log(JSON.stringify(item))
                })
                el.html(str);
            }else{
                el.html('<li>暂无该会员</li>')
                setPrice({});
            }
            sumPrice();
        })
    }
    $('.phone_list_bottom').on('click','li',function (event) {
        var phone = $(this).find('div:eq(0)').text();
            var dd = JSON.parse($(this).attr('data-data'))
        console.log(dd)
        $(this).parents('.phone_list_bottom').html('').parents('div.phone_list').hide().parents('div.layui-input-block').find('input').val(phone);
        bindClick = false;
        setPrice(dd);

    })
    //设置各种价格
    function setPrice(dd){
        $("#game").attr("data-type","");
        $("#game").attr("data-accontentt","");
        $("#game").attr("data-acthresholdmoney","");
        getPromotion();//适用活动
        var isVip = dd.subaccountList || "";
        var discount = "";
        var list = dd.subaccountList;
        clearCardList();
         
        if(isVip!=""){
            $("#phone").attr("data-isvip",1); //是会员
            $("#phone").attr("data-memberId", dd.memberId);
            /*$(".pay-type").show();*/
            discount = Number(isVip.discount)/10;
            $("#selectPayNo").hide();
            $("#selectPay").show();
            $("#phone").attr("data-subaccountId",isVip.id);
            $('#tradeName').html(dd.memberName).parent().show();
            setCardList(list);
        }else{
            $("#selectPay").hide();
            $("#selectPayNo").show();
            $("#discount").val("");
            $("#principal").val("");
            $("#phone").attr("data-isvip",0);
            $("#phone").attr("data-subaccountId",0);
            $('#tradeName').html('').parent().hide();
            discount = 100/10;
        }
 
        
        var card = $('.card-item .swiper-slide .member-card.check');
        var principal = card.attr('principal');  //本金
        $('#principal').val(principal);
        var listSum = $("#table tbody tr");
        if($("#table tbody").html().indexOf("tr")>-1){
            for(var d=0;d<listSum.length;d++){
                var num = $(listSum).eq(d).find(".number").val();
                var price = $(listSum).eq(d).find(".one-price").text();
                truePrcie(num,price,d);
            }
            truePayt();
        }
    }
    function clearCardList(){
        $('.card-list').html('');
        $('.card-item').hide();
        $('.card-list-left').off('click');
        $('.card-list-right').off('click');
        $('.card-list').off('click');
        cardList = [];
        curCard = 0;
        mySwiper.removeAllSlides();
    }
    function setCardList(list){
        mySwiper.removeAllSlides();
        list && list.forEach(function(item,index){
            item.formatPrincipal = returnFloat(item.principal);
        });
         
        var html = template('card-list-tpl', { list: list});
        $('.swiper-container .swiper-wrapper').html(html);
        var card = $('.card-item .swiper-slide').eq(0).find('.member-card');
        card.addClass('check');
        var discount = card.attr('discount') / 10;
        $('#discount').val(discount);
        setDiscountPrice();
        $('.card-item').show();
        var width = parseInt($('.card-item').width());
        mySwiper.params.slidesPerView = Math.floor(width / 195);
        mySwiper.params.slidesPerGroup = mySwiper.params.slidesPerView;
        setTimeout(function() {
            mySwiper.onResize();
            mySwiper.slideTo(0, 0, false);
            var j = mySwiper.slides.length % mySwiper.params.slidesPerView;
            if (j != 0) {
                for (var i = 0; i < mySwiper.params.slidesPerView - j; i++) {
                    mySwiper.appendSlide('<div class="swiper-slide"></div>');
                }
            }
            mySwiper.update();
            mySwiper.slideTo(0, 0, false);
        }, 0);
 
    }
    var lists = {};      //会员卡列表
    var isResize = true;   //是否改变窗口 
    var cardList = [];  //当前显示的会员卡数组最多3个一组 如总共5个会员卡  当前显示前3个
    var curCard = 0;    //当前显示会员卡数组列表序号     curCard = 0 表第一组3个  1 表示第二组 如果是5个会员卡上面数组就是 第四第五
    var cardCheck = -1; //当前点击会员卡的序号
    var cardNum = 3;    //默认一行显示3个
    //选中 会员卡后通过折扣 计算设置价格
    function setDiscountPrice() {
        var tr = $('#table tbody tr');
        tr.each(function (index, item) {
            var num = $(item).find('.number').val();
            var price = $(item).find('.one-price').text();
            oldPrice(parseInt(num), price, index);
            truePrcie(parseInt(num), price, index);
            sumPrice();
            truePayt();
        });
    }
     
    //哪种支付方式
    form.on('radio(payClassify)', function(data){
        $(".pay-type").attr("data-type",data.value);
    });

    //是否计算业绩
    form.on('checkbox(achType)', function(data){ //0为计算 1不计算
        if(data.elem.checked){
            $(".performance").attr("data-type",0);
        }else{
            $(".performance").attr("data-type",1);
        }
    });

    //查询员工
    function sale(){
        var param = {
            'merchantId':merchantId,
            'shopId':shopId
        }
        reqAjaxAsync(USER_URL.SALELIST,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                var sHtml = '';
                for (var i = 0; i < res.data.length; i++) {
                    var row = res.data[i];
                    sHtml += '<option value="' + row.id + '">' + row.backUserName + '</option>';
                }
                $("#sales").append(sHtml);
                form.render();
            } else {
                layer.msg(res.msg);
            }
        })
    }

    //左侧表格初始化
    function getTable(name,num){ // num-数量 name-商品名称
        // var discount = $("#discount").val() || ""; //折扣
        var discount = getDiscount() || ""; //折扣
        
        
        var sHtml='';
        var params = {
            'merchantId':merchantId,
            'shopId':shopId,
            'param':name
        }
        reqAjaxAsync(USER_URL.BARCODE,JSON.stringify(params)).done(function(res) {
            if (res.code == 1) {
                $("#codeName").val("");
                if(res.data.length>0){
                    if(res.data.length==1){
                        var row = res.data[0];
                        var stockId = row.stockId;//唯一规格
                        var list = $("#table tbody tr");
                        if($("#table tbody").html().indexOf("tr")>-1){ //表中已有商品
                            for(var i=0;i<list.length;i++){ //数量改变实际价格改变，原价改变
                                if(list.eq(i).attr("data-stockid")==stockId){
                                    var val = list.eq(i).find(".number").val();
                                    list.eq(i).find(".number").val(parseInt(val)+1);
                                    var price = list.eq(i).find(".one-price").text();
                                    var sumpce = Number(val)*Number(price);
                                    if(discount!=""){
                                        var truePrices = Number(price)/10*Number(discount)*Number(parseInt(val)+1); //实际价格
                                    }else{
                                        var truePrices = Number(price) * Number(1)*Number(parseInt(val)+1); //实际价格
                                    }
                                    list.eq(i).find(".true-price").val(returnFloat(truePrices));
                                    list.eq(i).find(".sum-price").text(returnFloat(sumpce));
                                    oldPrice(parseInt(val)+1,price,i);
                                    truePrcie(parseInt(val)+1,price,i);
                                    sumPrice();
                                    truePayt();
                                    fls=false;
                                    return false;
                                }
                            }
                            var tabsumPrice = Number(row.stockPrice) * Number(num); //总价
                            if(discount!=""){
                                var truePrice = Number(row.stockPrice)/10*Number(discount); //实际价格
                            }else{
                                var truePrice = Number(row.stockPrice) * Number(num); //实际价格
                            }
                            tabsumPrice = returnFloat(tabsumPrice);
                            truePrice = returnFloat(truePrice);
                            sHtml +='<tr  data-stockId="' + row.stockId + '" data-store="'+ row.shopStockBalance +'" data-goodsId="'+ row.goodsId +'">' //
                            + '<td>' + row.goodsName + '</td>'
                            + '<td>' + '<span class="plusicon glyphicon glyphicon-minus"></span><input type="text" class="number layui-input" value="'+num+'"><span class="addicon glyphicon glyphicon-plus"></span>' + '</td>'
                            + '<td>' + row.stockName + '</td>'
                            + '<td class="one-price">' + row.stockPrice + '</td>'
                            + '<td class="sum-price">' + tabsumPrice + '</td>'
                            + '<td><input type="text" class="true-price layui-input" value="'+ truePrice +'"></td>'
                            + '<td><span class="delete glyphicon glyphicon-remove-circle"></span></td>'
                            + '</tr>';
                            $("#table tbody").append(sHtml);
                            sumPrice();
                            truePayt();
                        }else{
                            var tabsumPrice = Number(row.stockPrice) * Number(num); //总价
                            if(discount!=""){
                                var truePrice = Number(row.stockPrice)/10*Number(discount); //实际价格
                            }else{
                                var truePrice = Number(row.stockPrice) * Number(num); //实际价格
                            }
                            tabsumPrice = returnFloat(tabsumPrice);
                            truePrice = returnFloat(truePrice);
                            sHtml +='<tr  data-stockId="' + row.stockId + '" data-store="'+ row.shopStockBalance +'" data-goodsId="'+ row.goodsId +'">' //
                            + '<td>' + row.goodsName + '</td>'
                            + '<td>' + '<span class="plusicon glyphicon glyphicon-minus"></span><input type="text" class="number layui-input" value="'+num+'"><span class="addicon glyphicon glyphicon-plus"></span>' + '</td>'
                            + '<td>' + row.stockName + '</td>'
                            + '<td class="one-price">' + row.stockPrice + '</td>'
                            + '<td class="sum-price">' + tabsumPrice + '</td>'
                            + '<td><input type="text" class="true-price layui-input" value="'+ truePrice +'"></td>'
                            + '<td><span class="delete glyphicon glyphicon-remove-circle"></span></td>'
                            + '</tr>';
                            $("#table tbody").append(sHtml);
                            sumPrice();
                            truePayt();
                        }
                    }else{
                        layer.open({
                            title: ['商品分类', 'font-size:12px;background-color:#353b53;color:#1be0d6'],
                            type: 1,
                            content: $('.more-table'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                            area: ['500px', '600px'],
                            btn: ['确认', '取消'],
                            shade: [0.1, '#fff'],
                            end: function () {
                                $('.more-table').hide();
                            },
                            success: function (layero) {
                                for(var k=0;k<res.data.length;k++){
                                    var row = res.data[k];
                                    var tabsumPrice = Number(row.stockPrice) * Number(num); //总价
                                    sHtml +='<tr data-stockId="' + row.stockId + '" data-goodsId="'+ row.goodsId +'">'
                                    + '<td><input type="radio" name="checkbox" lay-skin="primary"></td>'
                                    + '<td class="select-name">' +  row.goodsName + '</td>'
                                    + '<td class="select-name">' +  row.stockName + '</td>'
                                    + '<td class="select-price">' +  row.stockPrice + '</td>'
                                    + '<td class="select-shopStockBalance">' + row.shopStockBalance || 0 + '</td>'
                                    + '</tr>';
                                }
                                $("#moreTable tbody").html(sHtml);
                                $('#moreTable tbody tr').on('click',function (event) {
                                    var $radio = $(this).find("input[type=radio]"),
                                        $flag = $radio.is(":checked");
                                    if (!$flag) {
                                        $radio.prop("checked", true);
                                    }
                                });
                            },
                            yes: function (index, layero) {
                                var listcheck = $("#moreTable input[name='checkbox']");
                                var c=0;
                                var inx = 0;
                                for(var b=0;b<listcheck.length;b++){
                                    if(listcheck[b].checked){
                                        c++;
                                        inx=b;
                                    }
                                }
                                if(c!=1){
                                    layer.msg("请选择唯一商品");
                                }else{
                                    var stockIds = res.data[inx].stockId;
                                    var list = $("#table tbody tr");
                                    if($("#table tbody").html().indexOf("tr")>-1){
                                        for(var a=0;a<list.length;a++){ //此处数量改变实际价格改变，原价改变
                                            if(list.eq(a).attr("data-stockid")==stockIds){
                                                var val = list.eq(a).find(".number").val();
                                                var price = list.eq(a).find(".one-price").text();
                                                list.eq(a).find(".number").val(parseInt(val)+1);

                                                oldPrice(parseInt(val)+1,price,a);
                                                truePrcie(parseInt(val)+1,price,a);
                                                sumPrice();
                                                truePayt();
                                                layer.close(index);
                                                return false;
                                            }
                                        }

                                            //以上判断是否有相同的商品。若有数量直接加1
                                            var goodsName = res.data[inx].goodsName;
                                            var stockPrice = res.data[inx].stockPrice;
                                            var sumprices = res.data[inx].stockPrice;
                                            var stockName = res.data[inx].stockName;
                                            if(discount!=""){
                                                // var truePrice = Number(stockPrice)/10*Number(discount); //实际价格
                                                var truePrice = Number(stockPrice) * (Number(discount) * 10) /100; //实际价格
                                            }else{
                                                var truePrice = Number(stockPrice) * Number(1); //实际价格
                                            }
                                            var html="";
                                            sumprices = returnFloat(sumprices);
                                            truePrice = returnFloat(truePrice);

                                            html += '<tr data-stockId="'+ res.data[inx].stockId + '" data-store="'+ res.data[inx].shopStockBalance + '" data-goodsId="'+ res.data[inx].goodsId +'">'
                                            + '<td>' + goodsName + '</td>'
                                            + '<td><span class="plusicon glyphicon glyphicon-minus"></span><input type="text" lay-verify="number" class="number layui-input" value="1"><span class="addicon glyphicon glyphicon-plus"></span></td>'
                                            + '<td>' + stockName + '</td>'
                                            + '<td class="one-price">' + stockPrice + '</td>'
                                            + '<td class="sum-price">' + sumprices + '</td>'
                                            + '<td><input type="text" class="true-price layui-input" lay-verify="number" value="'+ truePrice +'"></td>'
                                            + '<td><span class="delete glyphicon glyphicon-remove-circle"></span></td>'
                                            + '</tr>';
                                            $("#table tbody").append(html);
                                        sumPrice();
                                        truePayt();
                                    }else{
                                        var goodsName = res.data[inx].goodsName;
                                        var stockPrice = res.data[inx].stockPrice;
                                        var sumprices = res.data[inx].stockPrice;
                                        var stockName = res.data[inx].stockName;
                                        if(discount!=""){
                                            // var truePrice = Number(stockPrice)/10*Number(discount); //实际价格
                                            var truePrice = Number(stockPrice) * Number(discount) * 10 /100 ; //实际价格
                                        }else{
                                            var truePrice = Number(stockPrice) * Number(1); //实际价格
                                        }
                                        sumprices = returnFloat(sumprices);
                                        truePrice = returnFloat(truePrice);
                                        var html="";
                                        html += '<tr  data-stockId="'+ res.data[inx].stockId + '" data-store="'+ res.data[inx].shopStockBalance  +'" data-goodsId="'+ res.data[inx].goodsId +'">'
                                        + '<td>' + goodsName + '</td>'
                                        + '<td><span class="plusicon glyphicon glyphicon-minus"></span><input type="text" class="number layui-input" value="1"><span class="addicon glyphicon glyphicon-plus"></span></td>'
                                        + '<td>' + stockName + '</td>'
                                        + '<td class="one-price">' + stockPrice + '</td>'
                                        + '<td class="sum-price">' + sumprices + '</td>'
                                        + '<td><input type="text" class="true-price layui-input" value="'+ truePrice +'"></td>'
                                        + '<td><span class="delete glyphicon glyphicon-remove-circle"></span></td>'
                                        + '</tr>';
                                        $("#table tbody").append(html)
                                        sumPrice();
                                        truePayt();
                                    }

                                }
                                layer.close(index);
                            }
                        })
                    }
                }else{
                    layer.msg("无此商品",{icon:6});
                }
            }else{
                layer.msg(res.msg);
            }
        })

    }

    //扫码下单
    function scanCode(name){
        getTable(name,1);
    }

    //扫码枪
    /*$(".main-wrapper").on("keypress","input",function(event){
        k++;
        if (event.keyCode == 13) {
            if(k==14){ //13位并且为数字就是条码
                $("#codeName").focus();
                var val = $(this).val();
                $(this).val("");
                $("#codeName").val(val);
                scanCode(val);//扫码下单
                k=0;
            }
            else{ //兑换券
                var val = $(this).val();
                $(this).val("");
                $("#CDKEY").val(val);
                getExchange(val);
                k=0;
            }
        }
    });*/

    //兑换码(扫码枪)
    $(".main-wrapper").on("keypress","#CDKEY",function(event){
        if (event.keyCode == 13) {
            var val = $(this).val();
            $(this).val("");
            $("#CDKEY").val(val);
            getExchange(val);
        }
    })


    //商品搜索(扫码枪)
    $(".main-wrapper").on("keypress","#codeName",function(event){
        if (event.keyCode == 13) {
            $("#codeName").focus();
            var val = $(this).val();
            $(this).val("");
            $("#codeName").val(val);
            scanCode(val);//扫码下单
        }
    })

    //输入商品名称搜
    $("#searchName").on("click",function(){
        var val = $.trim($("#codeName").val());
        if(val!=""){
            scanCode(val);
        }else if(val==""){
            layer.msg("请输入商品名称或者条码",{icon:6});
        }

    });

    //兑换接口
    function getExchange(couponCode){
        var param = {
            'merchantId':merchantId,
            'couponCode':couponCode
        }
        reqAjaxAsync(USER_URL.EXCHANGE,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                $("#CDKEY").val("");
                $("#duihuan").attr("data-type",res.data.type);
                var id = res.data.couponLogId || "";//券id
                if(res.data.type=='02'){ //代金券不需要门槛
                    $("#CDKEY").attr("data-cdId",id);
                    $("#duihuan").val(res.data.amount);
                    truePayt();//实收
                }else if(res.data.type=="01"){
                    $("#CDKEY").attr("data-cdId",id);
                    $("#duihuan").attr("data-menk",res.data.amountMin);
                    $("#duihuan").val(res.data.amount);
                    truePayt();//实收
                }else{
                    var ty = $(".duigame").attr("data-ty");
                    if(ty==0){
                        $(".duigame").attr("data-ty",1);
                       $(".duigame").show();
                    }else{
                        $(".duigame").show();
                    }
                    var sHtml = '<li>'+res.data.instruction+'</li>';
                    $(".duigame ul").append(sHtml);
                }

            }else{
                layer.msg(res.msg);
            }
        })
    }

    //点击兑换
    $("#searchClass").on("click",function(){
        var val = $.trim($("#CDKEY").val());
        if(val==""){
            layer.msg("请输入兑换码");
        }else{
            getExchange(val);
        }
    });

    //保留俩位小数
    function returnFloat(value){
        var value=Math.round(parseFloat(value)*100)/100;
        var xsd=value.toString().split(".");
        if(xsd.length==1){
            value=value.toString()+".00";
            return value;
        }
        if(xsd.length>1){
            if(xsd[1].length<2){
                value=value.toString()+"0";
            }
            return value;
        }
    }
    //从选中的会员卡 读取  折扣启用会员卡折扣返回 会员折扣  无返回10折
    function getDiscount() {
        var discount = $(".member-card.check").attr('discount');
        var supportpurchasegoods = $(".member-card.check").attr('supportpurchasegoods');
        if (supportpurchasegoods == '1') {
            return discount;
        }
        return 10;
    }
    //单个原价变换 
    function oldPrice(num,price,index){
        var sum = Number(num)*Number(price);
        $("#table tbody tr").eq(index).find(".sum-price").text(returnFloat(sum));
    }

    //单个实际价格变化 num 数量  price 单价 index 表格索引
    function truePrcie(num,price,index){
        // var discount = $("#discount").val();
        var discount = getDiscount();
        var sumPrices = returnFloat(Number(num)*Number(price));
        if(discount==""){
            $("#table tbody tr").eq(index).find(".true-price").val(returnFloat(sumPrices));
        }else{
            // var trueprice = Number(sumPrices)/10*Number(discount);
            var trueprice = Number(sumPrices) * (Number(discount) * 10) / 100;
            $("#table tbody tr").eq(index).find(".true-price").val(returnFloat(trueprice));
        }
    }

    //合计
    function sumPrice(){
        // var discount = $("#discount").val();
        var discount = getDiscount();
        var listSum = $("#table tbody tr");
        var sumpce=0;
        if(listSum.length>0){
            for(var b=0;b<listSum.length;b++){
                sumpce += Number(listSum.eq(b).find(".sum-price").text());
            }
            if(discount==""){
                var sum = sumpce;
            }else{
                var sum = returnFloat(Number(sumpce)* Number(discount) /10);
            }
            // $(".table-footer span").text(sum);
            $(".table-footer span").text(returnFloat(sumpce));
            $("#table").attr("data-sum",returnFloat(sumpce));//所有原价和
        }else{
            $(".table-footer span").text(0);
            $("#table").attr("data-sum",0);
        }
    }

    //实收计算
    function truePayt() {
        var dui = $("#duihuan").val() || 0; //兑换码
        var duiType = $("#duihuan").attr("data-type");//兑换类型
        var discountMoney = $("#discountMoney").val() || 0; //整单优惠
        var listSum = $("#table tbody tr");
        var truePic = 0;
        var acType = $("#game").attr("data-type");//优惠类型
        var acContentt = $("#game").attr("data-acContentt");//活动内容
        var acThresholdMoney = $("#game").attr("data-acThresholdMoney");//门槛金额
        if(listSum.length>0){
            for (var c=0;c<listSum.length;c++) {
                truePic += Number(listSum.eq(c).find(".true-price").val());
            }
            $("#table").attr("data-true",returnFloat(truePic)); //实际价格和
            var sum = truePic;
            if(acThresholdMoney!=""){
                if(sum>=acThresholdMoney){
                    if(acType!=""){
                        if(acType==0){
                            if(sum>0){
                                var sum = Number(sum)-Number(acContentt);
                            }else{
                                var sum=0;
                            }
                        }else if(acType==1){
                            if(sum>0){
                                var sum = Number(sum)*Number(acContentt);
                            }else{
                                var sum=0;
                            }
                        }
                    }
                }else{
                    if(sum<=0){
                        var sum=0;
                    }else{
                        var sum = returnFloat(sum);
                    }
                    layer.msg("未达到门槛，不适用此活动",{icon:6});
                    resetGame();
                }
            }else{
                if(sum<=0){
                    var sum=0;
                }else{
                    var sum = returnFloat(sum);
                }
            } //适用活动结束
            //兑换码
            if(duiType!=0){
                if(duiType=="01"){//达到门槛满减
                    var amountMin = $("#duihuan").attr("data-menk");
                    if(sum>=amountMin){
                        var sum = Number(sum) -Number(dui); //实收(没适用活动时)
                    }else{
                        $("#duihuan").val("");
                        layer.msg("未达到门槛，不适用此兑换码活动",{icon:6});
                        var sum = Number(sum); //实收(没适用活动时)
                        $("#CDKEY").attr("data-cdId","");
                    }
                }else if(duiType=="02"){//代金券
                    var sum = Number(sum)-Number(dui); //实收(没适用活动时)
                }
            }else{
                var sum = returnFloat(sum);
            }

            if(sum==0){
                var sum = 0;
            }else{
                var sum = Number(sum) - Number(discountMoney)>0?Number(sum) - Number(discountMoney):0;
            }
            $("#actualPay").val(returnFloat(sum));

        }else{
            $("#table").attr("data-true",0);
            $("#actualPay").val(0);
        }

    }
    //重置优惠活动
    function resetGame(){
        $("#game").attr("data-type","");
        $("#game").attr("data-acContentt","");
        $("#game").attr("data-acThresholdMoney","");
        $('#game').val(-1)
        form.render('select')
    }
    //表中加减
    $("#table").on("click","tbody .plusicon",function(){ //减去
        var index = $(this).parents("tr").index();
        var val = $("#table tbody tr").eq(index).find(".number").val();
        var price = $("#table tbody tr").eq(index).find(".one-price").text();
        if(val==1){
            $("#table tbody tr").eq(index).find(".number").val(1);
        }else{
            $("#table tbody tr").eq(index).find(".number").val(parseInt(val)-1);
            oldPrice(parseInt(val)-1,price,index);
            truePrcie(parseInt(val)-1,price,index);
            sumPrice();
            truePayt();
        }

    });

    $("#table").on("click","tbody .addicon",function(){ //加
        var index = $(this).parents("tr").index();
        var val = $("#table tbody tr").eq(index).find(".number").val();
        var price = $("#table tbody tr").eq(index).find(".one-price").text();
        $("#table tbody tr").eq(index).find(".number").val(parseInt(val)+1);
        oldPrice(parseInt(val)+1,price,index);
        truePrcie(parseInt(val)+1,price,index);
        sumPrice();
        truePayt();
    });

    //监听数量变化
    $("#table").on("blur",".number",function(){
        var index = $(this).parents("tr").index();
        var num = $(this).val();
        var store = $("#table tbody tr").eq(index).attr("data-store");//库存
        var price = $("#table tbody tr").eq(index).find(".one-price").text();
        if (!integer.test(num)) {
            layer.msg("请输入正确的数量",{icon: 6})
            $(this).val(1);
            oldPrice(1,price,index);
            truePrcie(1,price,index);
            sumPrice();
            truePayt();
            return false;
        }
        if(num==0||""){
            $(this).val(1);
            oldPrice(1,price,index);
            truePrcie(1,price,index);
            sumPrice();
            truePayt();
        }else if(num<store ||num==store ){
            oldPrice(num,price,index);
            truePrcie(num,price,index);
            sumPrice();
            truePayt();
        }else if(num>store){
            $(this).val(1);
            oldPrice(1,price,index);
            truePrcie(1,price,index);
            sumPrice();
            truePayt();
            layer.msg("数量超过库存",{icon: 6});
        }
    });

    //监听实际价格
    $("#table").on("blur",".true-price",function(){
        var val = $(this).val();
        var index = $(this).parents("tr").index();
        var num = $("#table tbody tr").eq(index).find(".number").val();
        var price = $("#table tbody tr").eq(index).find(".one-price").text();
        if (!amountExp.test(val)) {
            layer.msg("请输入正确的金额",{icon: 6})
            truePrcie(num,price,index);
            truePayt();
            return false;
        }
        if(val==0||""){
            layer.msg("实际价格不能为0或者空",{icon: 6});
            truePrcie(num,price,index);
            truePayt();
            return false;
        }else{
            truePayt();
        }
    });

    //监听整单优惠
    $("#discountMoney").on("blur",function(){
        var val = $(this).val();
        if(val!=""){
            if (!amountExp.test(val)) {
                layer.msg("请输入正确的金额",{icon: 6})
               $(this).val("");
                return false;
            }else if(val > Number($('#actualPay').val())){
                layer.msg('整单优惠不能大于实收')
                $(this).val(0)
            }
        }
        truePayt();
    });

    //删除某条商品
    $("#table").on("click","tbody .delete",function(){
        var index = $(this).parents("tr").index();
        $("#table tbody tr").eq(index).remove();
        sumPrice();
        truePayt();
    });



    //查询手机号获得折扣
    // $("#searchPhone").on("click",function(){
    //     $("#searchPhone").css({
    //         "background":"#f8ac59"
    //     });
    //     $(this).attr("data-type",1);
    //     var val = $.trim($("#phone").val());
    //     var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    //     if (!myreg.test(val)) {
    //         layer.msg("请输入正确的手机号",{icon: 6});
    //         return false;
    //     }
    //     var param = {
    //         'vipPhone':val,
    //         'merchantId':merchantId
    //     }
    //     reqAjaxAsync(USER_URL.FINDVIP,JSON.stringify(param)).done(function(res) {
    //         if (res.code == 1) {
    //             $("#game").attr("data-type","");
    //             $("#game").attr("data-accontentt","");
    //             $("#game").attr("data-acthresholdmoney","");
    //             getPromotion();//适用活动
    //             var isVip = res.data.subaccount || "";
    //             if(isVip!=""){
    //                 $("#phone").attr("data-isvip",1); //是会员
    //                 /*$(".pay-type").show();*/
    //                 var discount = Number(isVip.discount)/10;
    //                 $("#selectPayNo").hide();
    //                 $("#selectPay").show();
    //                 $("#phone").attr("data-subaccountId",isVip.id);
    //             }else{
    //                 $("#selectPay").hide();
    //                 $("#selectPayNo").show();
    //                 $("#discount").val("");
    //                 $("#principal").val("");
    //                 $("#phone").attr("data-isvip",0);
    //                 $("#phone").attr("data-subaccountId",0);
    //                 var discount = Number(res.data.businessInfo.discount)/10;
    //             }
    //             $("#discount").val(discount);
    //             $("#principal").val(isVip.principal);
    //             var listSum = $("#table tbody tr");
    //             if($("#table tbody").html().indexOf("tr")>-1){
    //                 for(var d=0;d<listSum.length;d++){
    //                     var num = $(listSum).eq(d).find(".number").val();
    //                     var price = $(listSum).eq(d).find(".one-price").text();
    //                     truePrcie(num,price,d);
    //                 }
    //                 truePayt();
    //             }
    //
    //         }else if(res.code==9 && res.msg=="此账号不是会员"){
    //             $("#game").attr("data-type","");
    //             $("#game").attr("data-accontentt","");
    //             $("#game").attr("data-acthresholdmoney","");
    //             getPromotion();//适用活动
    //             $("#phone").attr("data-isvip",0); //不是会员
    //             $("#selectPay").hide();
    //             $("#selectPayNo").show();
    //             $("#discount").val("");
    //             $("#principal").val("");
    //             $("#phone").attr("data-subaccountId",0);
    //             layer.msg(res.msg);
    //         }else{
    //             layer.msg(res.msg);
    //         }
    //     })
    // });

    //促销活动
    function getPromotion(){
        var param={
            'merchantId':merchantId
        }
        reqAjaxAsync(USER_URL.PROMOTION,JSON.stringify(param)).done(function(res) {
            if (res.code == 1) {
                allGame = res.data;
                var sHtml = '<option value="-1">请选择</option>';
                for (var i = 0; i < res.data.length; i++) {
                    var row = res.data[i];
                    sHtml += '<option value="' + row.id + '">' + row.acName + '</option>';
                }
                $("#game").html(sHtml);
                form.render();
            }else{
                layer.msg(res.msg);
            }
        })
    }


    //下单并支付接口
    function getPay(goods,payAuthCOde,type){
        var isPhone = $("#searchPhone").attr("data-type");//是否验证会员 0-未验证 1-验证
        var isvip = $("#phone").attr("data-isvip");//是否会员
        var subaccountId = $('.swiper-slide .member-card.check').attr('subaccountId');
        var shouldPay = $(".table-footer span").text();
        var actualPay = Number($("#actualPay").val());
        var cashId =  $("#CDKEY").attr("data-cdId") || '';
        var principal= Number($("#principal").val()|| 0); //本金
        if(isvip==1){ //是会员
            var discount = $('.swiper-slide .member-card.check').attr('discount');
            var principal = $('.swiper-slide .member-card.check').attr('principal');
            principal = Number(principal);
            if (discount) {
                discount = Number(discount) * 10;
            }else {
                discount = 100;
            }
            // if($("#discount").val()==""){
            //     var discount = 100;
            // }else{
            //     var discount = Number($("#discount").val())*10;
            // }
            var payType = $("#selectPay").attr("data-type");
            var payClass = $("#payClass").attr("data-type");
            if(payType==0){
                if(principal<=0){
                    layer.msg("请先充值本金在支付",{icon:6});
                    return false;
                }
                if(actualPay>principal){
                    layer.msg("实付金额超过本金，请选择其他支付方式",{icon:6});
                    return false;
                }
            }
        }else{
            var payType = 2;
            var discount = 100;
            var payClass = 1;//现金支付
        }
        var isRebate = 1;
 
        var salesmanId = $("#sales").attr("data-type");
        var salesman = $("#sales").attr("data-text");
        var achType = $(".performance").attr("data-type");
        if (isvip == 1) {
            isRebate = $('.swiper-slide .member-card.check').attr('supportPurchaseGoods');
            if (isRebate == 1) {
                isRebate = 0;
            }
        }
        if (discount == 100) {
            isRebate = 1;
        }
        var param={
            'memberId': $("#phone").attr("data-memberId") || 0,
            'isvip':isvip,//1为是 0为否
            'subaccountId':subaccountId,//查询会员时返回 散客则空
            'shopId':shopId,//商铺id
            'merchantId':merchantId,
            'shouldPay':shouldPay,//应该支付的金额
            'actualPay':actualPay,//实付
            'cashId':cashId,//卡券 id
            'isRebate':isRebate,//是否打折了 折扣为100时，传0，否则传1
            'userId':userId, //当前登录帐号id
            'userCode':userCode,//当前登录帐号
            'userName':userName,//当前登录帐号名称
            'payType':payType,//（0-本金支付 1-卡项支付 2-现金支付 3-混合支付）
            'discount':discount, //会员折扣 散客是100
            'payClass':"1",//1 现金  2 支付宝， 3 微信支付
            'salesmanId':salesmanId,//销售员id
            'salesman':salesman,//销售员名字
            'achType':achType, //是否计算业绩 0为计算 1不计算
            'principal':Number(principal),//本金
            'userPayCode':payAuthCOde, //授权码
            'goods':goods, //表内相关数据
            discountMoney:$('#discountMoney').val()|| 0,
            promotionId:$('#game').val()|| ''
        };
            reqAjaxAsync(USER_URL.ADDPUR,JSON.stringify(param),type).done(function(res) {
                if (res.code == 1) {
                    if(type==""){
                        layer.msg(res.msg,{icon: 4});
                        if (printSwitch !=0) {
                            layer.confirm('是否需要打印小票？', {
                                btn: ['是', '否'] //按钮
                            }, function () {
                                doPrintHtml(param);
                            }, function () {
                                setTimeout(function(){
                                    location.reload();
                                },1000);
                            })
                        }else {
                            setTimeout(function(){
                                location.reload();
                            },1000);
                        }
                    }

                }else{
                    layer.msg(res.msg);
                }
            })
    }

    //取消
    $("#cancel").click(function(){
        location.reload();
    });

    //点击下单支付
    form.on('submit(btnSum)', function(data){
        if(data){
            if($("#table tbody").html().indexOf("tr")>-1){
                 var acty= $(".performance").attr("data-type");
                if(acty==0){
                    if($("#sales").attr("data-type")==""){
                        layer.msg("请选择销售员工",{icon:6});
                        return false;
                    }
                }
                    var payWay = $(".pay-type").attr("data-type");
                    var isVip = $("#phone").attr("data-isvip");//1-会员
                    var goods=[];
                    var list = $("#table tbody tr");
                    for(var i=0;i<list.length;i++){
                        goods.push({
                            'goodsId':list.eq(i).attr("data-goodsid"),
                            'actualPayment':list.eq(i).find(".true-price").val(), //实际价格
                            'purchaseNum':list.eq(i).find(".number").val(),//数量
                            'stockId':list.eq(i).attr("data-stockid"), //规格的id
                            'unitPrice':list.eq(i).find(".one-price").text(), //单价
                            'goodsName':list.eq(i).find("td").eq(0).text()//商品名称
                        });
                    }
                    /*if(payWay!=0 && isVip==1){ //出现弹窗
                        layer.open({
                            title: ['商品分类', 'font-size:12px;background-color:#353b53;color:#1be0d6'],
                            type: 1,
                            content: $('.scan-box'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                            area: ['600px', '600px'],
                            btn: ['确认', '取消'],
                            shade: [0.1, '#fff'],
                            end: function () {
                                $('.scan-box').hide();
                            },
                            success: function (layero) {
                                $("#accredit").focus();
                                $("div.layui-layer-page").addClass("layui-form");
                                $("a.layui-layer-btn0").attr("lay-submit","");
                                $("a.layui-layer-btn0").attr("lay-filter","formdemo");
                            },
                            yes: function (index, layero) {
                                form.on('submit(formdemo)',function(data){
                                    if(data){
                                        var payAuthCOde = $.trim($("#accredit").val());
                                        getPay(goods,payAuthCOde,1);
                                    }
                                })
                                form.on('submit(closedemo)',function(data){
                                    layer.close(index);
                                    location.reload();
                                })
                            }
                        })

                    }else{
                         getPay(goods,"","");
                    }*/
                getPay(goods,"","");
            }else{
                layer.msg("请添加商品",{icon: 6})
            }

        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
