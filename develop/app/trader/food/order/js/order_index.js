var form, layer ,orderFood,orderIndex,orderPay;
var wp=Strato.WebPrinter.getInstance();

var shopId = GetQueryString('shopId') || '';
var merchantId = GetQueryString('merchantId') || '';
var userId = GetQueryString('userId') || '';
var userName = GetQueryString('userName') || '';
$(function () {
    var VUEDATA = {
        facilityCategory: [],//楼层列表
        ScShopDeviceOccupy: [],//实体设备
        totalPrice:0,
        additionalMoney:0,//服务费
        totalNum:0,  
        elMenu:null,
        orderParams:null,
        presaleId:null,
        facilityId:null,
        printPrelaseInfo:[],
       
    }
    var USER_URL = {
        SELECTDEVICE: 'foodBoot/selectDeviceList',//查找设备信息
        SELECTPLAYER: 'foodBoot/selectBackUserByShopId',//查找员工
        UPDATEDEVICE: 'foodBoot/updateDeviceOccupy',//更新设备状态
        GETFOODPRESA:'foodBoot/findFoodPresale',//获取订单详情，
        SELECTDETAIL:'foodBoot/dish-details',//查找详细
        DELFOOD:'foodBoot/addFoodPresaleRetire',//退菜
        CHANGEMANNUM:'foodBoot/updateFoodPresaleNumMan',//修改人数
    }
    orderIndex = {
        el:{},
        data: VUEDATA,
        init: function () {
            var that = this;
            this.getDeviceList().done(function (res) {
                $(".header_floor").html(that.setHeadTemlate(that.data))
                console.log($(".header_floor").find('li').length)
                $(".header_floor,.header_floor_nei").width($(".header_floor").find('li').length*126)
                $(".header").show()
            })
            this.getPlayer();

        },
        addFood:function(){
            var dataes =JSON.parse(this.el.attr('data-params'));
            // console.log(`order_food.html?userName=${encodeURI(encodeURI(userName))}&userId=${userId}&shopId=${shopId}&merchantId=${merchantId}&userId=${userId}&manNum=${ $('#peopleNumNew').text()}&facilityId=${dataes.deviceId}&facilityName=${encodeURI(encodeURI(dataes.title))}&salesmanId=${dataes.waiterId}&id=${this.data.orderParams.id}`)
            window.location.href = `order_food.html?userName=${encodeURI(encodeURI(userName))}&userId=${userId}&shopId=${shopId}&merchantId=${merchantId}&userId=${userId}&manNum=${ $('#peopleNumNew').text()}&facilityId=${dataes.deviceId}&facilityName=${encodeURI(encodeURI(dataes.title))}&salesmanId=${dataes.waiterId}&id=${this.data.orderParams.id}`
        },
        chanManNum:function(manNum){
            var that = this;
            var params = {
                presaleId:that.data.presaleId,//订单id
                manNum:manNum,//人数
                shopId:shopId,//店铺id
            }
            return reqAjaxAsync(USER_URL.CHANGEMANNUM,JSON.stringify(params)).done(function(res){
                if(res.code == 1){
                       that.getFoodPresale();
                }
            })
           
        },
        delFood: function () {
            var that = this;
            var datas = that.data;
            var elMenu = that.data.elMenu;
            that.setTotal();
            var params={
                id:elMenu.attr('data-id'),//订单id
                shouldPay:datas.totalPrice,//退菜后的应付金额
                actualPay:datas.totalPrice,//退菜后的实付金额
                presaleInfoIdes:elMenu.attr('data-ids'),//退菜id
            }
            return reqAjaxAsync(USER_URL.DELFOOD,JSON.stringify(params)).done(function(res){
                if(res.code == 1){
                    that.getDeviceList()
                    setHeight()
                    layer.msg('退菜成功')
                }else{
                    layer.msg(res.msg)
                }
            })
        },
        getFoodPresale:function(){
            var that = this;
            var params = {
                id:JSON.parse(that.el.attr('data-params')).jobId
            }
            if(!params.id){
                that.upDateDeviceList(0)
            }
            reqAjaxAsync(USER_URL.GETFOODPRESA,JSON.stringify(params)).done(function(res){
                if(res.code == 1){
                    console.log(res);
                    that.data.presaleId = res.data.id;
                    that.data.facilityId = res.data.facilityId;
                    that.setFoodMenuTemplate(res.data)
                    
                }
            })
            return this;
        },
        setFoodMenuTemplate:function(datas){
            var that =this;
            that.data.printPrelaseInfo =[];
            $(".menu_control").show();
            $(".handle_bottom_box_zhan").show().siblings().hide();
            var str = ``;
            if(datas){
                var isPrint = 0;
                that.data.orderParams = datas;
                that.data.additionalMoney = datas.additionalMoney;
                $("#order_num").html('订单编号：'+datas.id)
                $("#order_time").html('下单时间：'+datas.consumeTime);
                $("#peopleNumNew").html(datas.peopleNumber)
                // if(dataes.waiterId){
                //     $("#waiterNew").html('服务员:'+datas.salesman||'')
                // }

                if(datas.salesmanId){
                    $("#waiterNew").show().html('服务员:'+$("#players option[value="+datas.salesmanId+"]").html() || '')    
                }else{
                    $("#waiterNew").hide()   
                }

                if(datas.additionalMoney){
                    $("#menu_total_waiter").show().html(`<span>服务费：</span><em>合计：&yen;${datas.additionalMoney.toFixed(2)}</em>`)
                }else{
                    $("#menu_total_waiter").hide()
                }
                   
                $.each(datas.scPresaleInfos,function(i,item){
                    if(item.isPrint == 0){
                        isPrint++
                    }
                    that.data.printPrelaseInfo.push(item.id)
                    str+=`<li class="menu_item ${item.isPrint !=0?'':'menu_item_no'}" data-id="${datas.id}" data-ids="${item.id}">
                        <h3 class="menu_name">
                            <span>${item.purchaseName}<g class="zeng" style="display:${item.actualPayment == 0 ?'inline-block':'none'}">赠</g></span>
                            <em>
                                <i>${subStrs(item.startTime)}</i>
                                <s>X<k class="dish_num">${item.purchaseNum}</k></s>
                            </em>
                        </h3>
                        <P class="menu_tips">
                            <b class="dish_box"><span data-id="${item.stockId}" data-type="stock">${item.stockName}</span><span data-type="recipes">${item.practiceName || ''}</span>${that.strReplace(item.batchingName) || ''}</b>

                            <em>
                                <i>${item.isPrint == 1 ?'已出菜':'未传送到后厨'}</i>
                                <s class="dish_price">&yen;<y data-stockprice="${item.unitPrice}" class="dish_price_y">${item.actualPayment.toFixed(2)}</y></s>
                            </em>
                        </P>
                        <p class="remarksP" style="display:${item.remake ?'':'none'}">备注：<j>${item.remake}</j></p>
                    </li>`
                })
                if(isPrint){
                    $(".print_btn_cookie").show();
                }else{
                    $(".print_btn_cookie").hide();
                }
            }
            $("#menu_list").html(str)
            $("#menu_total").html(`<span>商品总数：<i>${that.data.orderParams.presaleInfoNum}</i></span><em>合计：¥<i>${that.data.orderParams.actualPay.toFixed(2)}</i></em>`)
            setHeight()
            return this
        },
        setTotal:function(){
            var that =this;
            var liList = that.getUlLi();
            var totalPrice = 0;
            var totalNum = 0;
            $.each(liList,function(i,item){
                var liel = $(this);
                var num = parseInt(liel.find('.dish_num').text());
                var total = Number(liel.find('.dish_price_y').text())
                totalNum+=num;
                // totalPrice+=num*total;
                totalPrice+=total; // 单价 
           })
           that.data.totalPrice = totalPrice+that.data.additionalMoney;
           that.data.totalNum = totalNum;
           $("#menu_total").html(`<span>商品总数：<i>${that.data.totalNum}</i></span><em>合计：¥<i>${that.data.totalPrice.toFixed(2)}</i></em>`)
           return this;
        },
        getDetails:function(goodsId){
            var that = this;
            var params = {
                shopId:shopId,
                goodsId:goodsId
            }
            return reqAjaxAsync(USER_URL.SELECTDETAIL,JSON.stringify(params)).done(function(res){
                if(res.code == 1){
                    // console.log(res)
                    that.data.dishDetails = res.data;
                    console.log(res.data)
                }
            })
        },
        setDetailsTemplate:function(data,txt){
            var str = `<li><h3>选择${txt}</h3></li>`;
            if(txt == '备注'){
                var remarks = this.data.elMenu.find('input.remarks').val()
                str = `<li><h3>${txt}</h3></li>`;
                str+=`<li data-id="" style="height:auto" class="">
                            <textarea maxlength="50" class="layui-textarea" id="remarks">${remarks}</textarea>
                      </li>`
                $("#handle_norms").show();
                $("#handle_spec_box_norms").html(str) 
                      return      
            }
            if(data && data.length>0){
                var idparams = this.setHoverStatus();
                $.each(data,function(i,item){
                    if(idparams[item.id]){
                        //有该标签的id则添加点击状态
                        str+=`<li class="">
                                    <button data-id="${item.id}" class="layui-btn handle_spec_btn handle_norms_btn handle_spec_btn_special">${item.name}</button>
                            </li>`
                    }else{
                        //没有则为普通状态
                        str+=`<li class="">
                                    <button data-id="${item.id}" class="layui-btn handle_spec_btn handle_norms_btn">${item.name}</button>
                            </li>`
                    }
                   
                })
                $("#handle_norms").show();
                $("#handle_spec_box_norms").html(str)
            }else{
                $("#handle_norms").hide();
                $("#handle_spec_box_norms").html('')
                layer.msg('暂无'+txt)
            }
        },
        setHoverStatus:function(){
            //获取已添加标签的id
            var elMenu = this.data.elMenu
            var dishBox = elMenu.find('.dish_box')
            var dishList = dishBox.find('span')
            var params = {
                dishList:dishList,
                dishBox:dishBox,
            };
            $.each(dishList,function(i,item){
                    var idss = $(this).attr('data-id');
                    if(idss){
                        params[idss] = true
                    }
            })
            return params;
        },
        setDishList:function(txt,ids,type){
            //点击标签就添加该标签到列表或者删除该标签
            var that = this;
            console.log(type)
            var spanParams = that.setHoverStatus();//获取标签id
            var dishList = spanParams.dishList;
            var dishBox = spanParams.dishBox;
            console.log(dishList)
            var str = `<span data-id="${ids}" data-type="${type}">${txt}</span>`;
            var flag = 0;
            if(type == that.data.specTypeArr.recipes || type == that.data.specTypeArr.stock){//做法,规格,唯一 ，其余的删除
                var recipes = that.data.dishDetails[type];
                if(dishList.length){
                    $.each(dishList,function(i,item){
                        var dish = $(this)
                        var dishid = dish.attr('data-id')
                        $.each(recipes,function(j,items){
                            if(dishid == items.id){
                                dish.remove();
                            }
                        })
                    })
                }

                
            }else{
                if(dishList.length){ //配料多选
                    $.each(dishList,function(i,item){
                        var idss = $(this).attr('data-id');
                        if(ids == idss){
                            flag++;
                            $(this).remove();
                        }
                    })
                    if(flag){
                        return
                    }
                }
            }
            dishBox.append(str)

        },
        getUlLi:function(){
            //获取菜单的各种列表
            var liList = $("#menu_list").find('li');
            return liList;
        },
        getDeviceList: function () {
            var that = this;
            var datat = this.data;
            var params = {
                shopId: shopId,
                facilityCategoryId: $('.header_floor li.active').attr('data-id') || '',
                deviceType: $("#deviceType").val() || ''
            }
            return reqAjaxAsync(USER_URL.SELECTDEVICE, JSON.stringify(params)).done(function (res) {
                console.log(res);
                if (res.code == 1) {
                    var datas = res.data;
                    datat.facilityCategory = datas.facilityCategory;
                    datat.ScShopDeviceOccupy = datas.ScShopDeviceOccupy;
                    $(".place_ul").html(that.setPlaceTemlate(that.data))
                }
            })
        },
        upDateDeviceList: function (type, player,yes_eat) {
            if (player) {
                var players = $("#players").val();
            }
            return orderTofood(type, players,yes_eat)

        },
        getPlayer: function () {
            // merchantId
            var params = {
                shopId: shopId
            }
            return reqAjaxAsync(USER_URL.SELECTPLAYER, JSON.stringify(params)).done(function (res) {
                if (res.code == 1) {
                    var datas = res.data;
                    var str = ``;
                    $.each(datas, function (i, item) {
                        str += `<option value="${item.id}">${item.username}</option>`
                    })
                    $("#players").html(str);
                    form.render();
                }
                console.log(res)
            })
        },
        setHeadTemlate: function (data) {
            console.log(data)
            var str1 = `<li class="active">全部</li>`
            if (data.facilityCategory) {
                var facilityCategory = data.facilityCategory;
                $.each(facilityCategory, function (i, item) {
                    str1 += `<li data-id="${item.id}">${item.categoryName}</li>`
                })
            }
            return str1;
        },
        setPlaceTemlate: function (data) {
            var str = ``;
            var iconArr = ['空', '占', '占', '脏']
            var classArr = ["place_box_kong", "place_box_start", "place_box_start", "place_box_zang"]
            if (data) {
                var ScShopDeviceOccupy = data.ScShopDeviceOccupy;
                $.each(ScShopDeviceOccupy, function (i, item) {
                    str += `<li data-params='${JSON.stringify(item)}' class="place_box ${classArr[item.deviceType] || classArr[0] }">
                            <div class="place_title">
                                <span>${item.title}|${item.deviceType == 0 || !item.peopleNumber?item.maxNum:item.peopleNumber}人</span><i class="icon">${iconArr[item.deviceType] || iconArr[0]}</i>
                            </div>
                            <div class="place_center">
                                <div class="place_kong">
                                    <button class="place_btn place_btn_start">开台</button>
                                </div>
                                <div class="place_start">
                                    <div class="place_start_choose" style="${item.deviceType == 1 ? "" : "display: none"}">
                                        <div class="div_tips">${subStrs(item.deviceTime)}</div>
                                        <button class="place_btn place_btn_eat">点餐</button>
                                        <button class="place_btn place_btn_leave">离开</button>
                                    </div>
                                    <div class="place_start_msg" style="${item.deviceType == 2 ? "" : "display: none"}">
                                        <div class="div_tips div_tips_money">&yen;${item.shouldPay.toFixed(2)}</div>
                                        <div class="div_tips div_tips_num">0/${item.foodNumber||0}</div>
                                        <div class="div_tips div_timps_time">${subStrs(item.deviceTime)}</div>
                                    </div>
                                </div>

                                <div class="place_yu">
                                    <div class="div_tips div_tips_peple">王小姐</div>
                                    <div class="div_tips div_tips_phone">1852285221</div>
                                    <div class="div_tips div_timps_date">08-28 11:30</div>
                                </div>

                                <div class="place_zang"></div>
                            </div>
                        </li>`
                })
            }
            return str;
        },
        setHandleTemplate: function (data) {
            console.log(data)
            $("#place_num").html('桌号：' + data.title);
            $("#cancular").val(data.peopleNumber || data.maxNum);
           
            return this;;
        },
        windowLocation:function(players,peopleNumber){
            var dataes =JSON.parse(this.el.attr('data-params'));
            window.location.href = `order_food.html?userName=${encodeURI(encodeURI(userName))}&userId=${userId}&shopId=${shopId}&merchantId=${merchantId}&userId=${userId}&manNum=${ peopleNumber ||dataes.peopleNumber || 1 }&facilityId=${dataes.deviceId}&facilityName=${encodeURI(encodeURI(dataes.title))}&salesmanId=${dataes.waiterId || players}`
        
        },
        showMenuList:function(){
            var that = this;
            $(".menu_control").show();
            $(".menu_control_no").hide();
            return this;
        },
        hideMenuList:function(){
            var that = this;
            $(".menu_control").hide();
            $(".no_eat").hide();
            console.log( $("#players option").eq(0))
            $("#players option:first").prop("selected", 'selected');
            form.render()
            $(".menu_control_no").show();
            setHeight()
            return this;
        },
        strReplace:function(data){
            var str = ``;
            if(data){
               var arr = data.split(",")
               $.each(arr,function(i,item){
                   str+= `<span data-type="supplement">${item}</span>`
               })
            }
            return str
        },
        clearZang:function(el){
            
        }
    }
    function orderTofood(type, players,yes_eat) {
        //0空闲 1 开台 2点菜 3脏台
        var dataes = JSON.parse(orderIndex.el.attr('data-params'));
        console.log(orderIndex.el.attr('data-params'))
        var now = new Date().getTime() / 1000;
        var params = {
            deviceId: dataes.deviceId,
            deviceType: type,
            waiterId: players|| dataes.waiterId || ''
        }
        if(type == 0){
            params.deviceTime = ''
        }
        else if (type == 1) {
            params.deviceTime = formatDateTime(now)
            params.peopleNumber =  $("#cancular").val()
        } else if (type == 2) {
            if (!dataes.deviceTime) {
                params.deviceTime = formatDateTime(now)
            }
            // dataes.peopleNumber ||
            params.peopleNumber =  $("#cancular").val()
        } else if (type == 3) {
            params.recordId = params.recordId
            params.endTime = formatDateTime(now)
        }
        if(params.peopleNumber == 0){
            layer.msg('请至少选择一位客人！',{icon:2,anim:6})
            return false;
        }
        if(dataes.deviceType == 1 && type!=0){
            orderIndex.windowLocation(params.waiterId,params.peopleNumber);
            return
        }
        return reqAjaxAsync(USER_URL.UPDATEDEVICE, JSON.stringify(params)).done(function (res) {
            if (res.code == 1) {
                if(yes_eat){
                    orderIndex.windowLocation(params.waiterId,params.peopleNumber);
                }else{
                    orderIndex.getDeviceList()
                }
            } else {
                orderIndex.getDeviceList()
                layer.msg(res.msg)
            }
        })
    }
    layui.use(['form', 'layer'], function () {
        form = layui.form, layer = layui.layer;
        form.render();
        orderIndex.init();
        form.on('select(deviceType)', function (res) {
            console.log(res)
            orderIndex.getDeviceList();
        })
        $('.header_floor').on('click', 'li', function (e) {
            $(this).addClass('active').siblings('li').removeClass('active');
            orderIndex.getDeviceList()
        })
        //点击设备相关信息
        var classArr = ["place_box_kong", "place_box_start", "place_box_yu", "place_box_zang"]
        var hoverClassArr = ["place_box_kong_hover", "place_box_start_hover", "place_box_yu_hover", "place_box_zang_hover"]
        $('.place_ul').on('click', '.place_box', function (e) {
            var classStr = hoverClassArr.join(" ")
            var classes = $(this).attr('class');
            var arr = classes.split(' ')
            var hoverClass = arr[1] + '_hover'
            $(this).addClass(hoverClass).siblings().removeClass(classStr)
            orderIndex.el = $(this);
            var dataes = JSON.parse(orderIndex.el.attr('data-params'));
            orderIndex.setHandleTemplate(dataes)
            showRight()
            if($(this).hasClass(classArr[0])){
                orderIndex.hideMenuList();
                $(".no_eat").show();
            }else if($(this).hasClass(classArr[1])){
                if($(this).find(".place_start_msg").css('display') == 'block'){
                    $(".menu_control").hide();
                    $(".menu_control_no").hide();
                    orderIndex.getFoodPresale()
                }else{
                    orderIndex.hideMenuList();
                    // $("#waiterOld").hide();
                }
                
            }else if($(this).hasClass(classArr[3])){
                hideRight()
                var demo = $("#qingzhuo")
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
                        orderIndex.hideMenuList();
                        $(".del").click(function () {
                            layer.close(index)
                        })
                        $(".cancel").click(function () {
                            layer.close(index)
                        })
                        $(".submit").click(function () {
                            layer.close(index)
                            $(this).parents('li').removeClass(classArr[1] + " " + hoverClassArr[1]).addClass(classArr[0] + " " + classArr[0] + "_hover")
                            $(this).parents('.place_start_choose').hide()
                            $("#cancular").val(0)
                            orderIndex.upDateDeviceList(0)
                        })
                    }
                })
            }
            
            // hideRight();
           
        })
        $('.place_ul').on('click', '.place_btn_eat', function (e) {
            stopPropagation(e)
            orderIndex.el = $(this).parents('li');
            orderIndex.windowLocation()
            // orderTofood(1).done(function(res){
            //     if(res.code == 1){
            //         if(res.code == 1){
            //             orderIndex.windowLocation();
            //         }
            //     }
            // })
        }).on('click', '.place_btn_leave', function (e) {
            var demo = $("#leaving")
            var that = $(this)
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
                    $(".del").click(function () {
                        layer.close(index)
                    })
                    $(".cancel").click(function () {
                        layer.close(index)
                    })
                    $(".submit").click(function () {
                        layer.close(index)
                        hideRight()
                        that.parents('li').removeClass(classArr[1] + " " + hoverClassArr[1]).addClass(classArr[0] + " " + classArr[0] + "_hover")
                        that.parents('.place_start_choose').hide()
                        $("#cancular").val(0)
                        orderIndex.upDateDeviceList(0)
                    })
                }
            })
        })
        
        //退菜操作
        $("#delFood").click(function(){
            $("#handle_norms").hide();
            $(this).addClass("handle_spec_btn_special").parents('li').siblings().find('button').removeClass('handle_spec_btn_special')

            var that = $(this);
            var demo = $("#tuiDemo")
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
                    $(".del").click(function () {
                        layer.close(index)
                    })
                    $(".cancel").click(function () {
                        layer.close(index)
                    })
                    $(".submit").click(function () {
                        layer.close(index)
                        $("#handle_spec").hide();
                        orderIndex.data.elMenu.remove();
                        orderIndex.delFood().done(function(){ //退菜之后 然后重新获取订单
                            orderIndex.getFoodPresale();
                        })
                        that.removeClass('handle_spec_btn_special')
                    })
                }
            })
        })
        //加菜操作
        $(".add_food").click(function(res){
            orderIndex.addFood();
        })
        $('.icon_del').click(function () {
            hideRight()
        })
        $('.no_eat').click(function () {
            if(orderIndex.upDateDeviceList(1,2)){
                hideRight()
                orderIndex.el.parents('li').removeClass(classArr[0]).addClass(classArr[1] + " " + classArr[1] + "_hover")
                orderIndex.el.parent().siblings('.place_start').find('.place_start_choose').show();
            }
        })
        $('.yes_eat').click(function () {
            orderIndex.upDateDeviceList(1,2,'yes_eat')
        })
        cancular()
        //结账操作
        $(".square_accounts").click(function(e){
            var dataes = orderIndex.data;
            window.location.href = `../settlement/settlement.html?userName=${encodeURI(encodeURI(userName))}&userId=${userId}&facilityId=${dataes.facilityId}&shopId=${shopId}&merchantId=${merchantId}&presaleId=${dataes.presaleId}`
        })
        // 打印操作
        $(".print_btn").click(function(e){
            console.log('打印开始')
            orderIndex.data.templateSetName='客看单';
            var orderParams = orderIndex.data.orderParams
            orderIndex.data.totalPrice = orderParams.actualPay;
            orderIndex.data.totalNum = orderParams.presaleInfoNum;
            orderIndex.data.orderParams.scPrelases = orderParams.scPresaleInfos;
            orderIndex.data.orderParams.date =orderParams.consumeTime;
            orderIndex.data.orderParams.totalNum = orderParams.presaleInfoNum;
            orderIndex.data.orderParams.manNum  =orderParams.peopleNumber;
            orderIndex.data.orderParams.facilityName  = orderParams.title;
            orderIndex.data.orderParams.operatorName = userName;
            
            var data = orderIndex.data;
            printObj.init(data)
            printObj.findPrintSwitch();
        })
         // 打印到后厨操作
         $(".print_btn_cookie").click(function(e){
            console.log('打印到后厨')
            orderIndex.data.templateSetName='点单[后厨-堂口单]';
            var orderParams = orderIndex.data.orderParams
            orderIndex.data.orderParams.scPrelases = orderParams.scPresaleInfos;
            orderIndex.data.orderParams.date =orderParams.consumeTime;
            orderIndex.data.orderParams.totalNum = orderParams.presaleInfoNum;
            orderIndex.data.orderParams.manNum  =orderParams.peopleNumber;
            orderIndex.data.orderParams.facilityName  = orderParams.title;
            var data = orderIndex.data;
            printObj.init(data)
            printObj.findPrintSwitch();
        })
        
        
    })


})
