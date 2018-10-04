 // foodBoot/dishes-categories
 var form, layer;
 var orderFood,orderIndex;
 var shopId = GetQueryString('shopId') || '';
 var merchantId = GetQueryString('merchantId') || '';
 var salesmanId = GetQueryString('salesmanId') || '';
 var operatorId =GetQueryString('userId') || '';
 var operator = decodeURI(GetQueryString('userName'))|| "";
 var id =GetQueryString('id')||''
 var facilityName = decodeURI(GetQueryString('facilityName'))
 var facilityId = GetQueryString('facilityId') || '';
 var manNum = GetQueryString('manNum') || '';
//正式环境
//  var goodsType =  GetQueryString('goodsType') || 0;
var wp=Strato.WebPrinter.getInstance();
 var goodsType =  GetQueryString('goodsType') || 0;
 $(function () {
     var VUEDATA = {
         categoryNames: [],//菜品类别列表
         ScShopDeviceOccupy:[],//实体设备
         dishDetails:{},
         dishList:{},
         remarks:'',
         elMenu:null,
         specType:null,
         handleSpecPrice:0,
         specTypeArr:{
             recipes:'recipes',
             supplement:'supplement',
             stock:'stock',
         },
         printTemplateMap:{},
         templateSetName:'点单[后厨-堂口单]',
         totalNum:0,
         totalPrice:0,
         additionalMoney:0,
         scPrelases:[],
         width:210,
         orderParams:{
             manNum:manNum,
             facilityId:facilityId,
             facilityName:facilityName,
             salesmanId:salesmanId,
             operatorId:operatorId,
             userId:0,
             shouldPay:0,//应付
             actualPay:0,//实付
             merchantId:merchantId,//商户Id
             remake: $.trim($("remarks").val()) || "",//备注
             salesman:'',//服务员名称
             operator:operator,//操作人名称
             shopId:shopId,
             scPrelases:[],
             orderFrom:0,
         },
         addOrderParams:{
             id:id,
             facilityId:facilityId,
             shouldPay:0,
             actualPay:0,
             merchantId:merchantId,
             shopId:shopId,
             operatorId:operatorId,
             scPrelases:[],
         }
     }
     var USER_URL = {
         SELECTDISHESLIET:'foodBoot/dishes-categories',//查询菜品类别
         SELECTDISHESPAGE:'foodBoot/page-dish-list',//查询菜品
         SELECTPLAYER: 'foodBoot/selectBackUserByShopId',//查找员工
         SELECTDETAIL:'foodBoot/dish-details',//查找详细
         GETFOODPRESA:'foodBoot/findFoodPresale',//获取订单详情，
         ADDFOODPRESALE:'foodBoot/addFoodPresale',//新增订单
         ADDFOODMORE:'foodBoot/addFoodPresaleInfo',//加菜

         PRINTPRELASEINFO:'foodBoot/foodPresaleInfoIsPreint',//打印成功之后回调
         FINDPRINTSWITCH:'foodBoot/findPrintTemplateSwitch',//打印模板开关
         STARTPRINT:'foodBoot/findPrintTemplate',//开始使用模板打印菜单

         DISHOFFSALE:'foodBoot/dish-offsale',//菜品估清
         DISONSALE:'foodBoot/dish-onsale',//菜品重新售卖
         CHANGEMANNUM:'foodBoot/updateFoodPresaleNumMan',//修改人数
     }
     var floorw;
         orderFood = {
         data:VUEDATA,
         init:function(){
             var that = this;
             this.getDishesList().done(function(res){
                 setFloorScroll();
             })
             this.getDishesPage().setHandleTemplate(this.data.orderParams).getPlayer().done(function(res){
                 that.data.orderParams.salesman = $("#players option:checked").text()
                 $("#peopleNumNew").html(manNum);
                 $("#waiterNew").html('服务员:'+that.data.orderParams.salesman || '')
                 
             });
             if(id){
                 this.showMenuList().getFoodPresale()
                 $(".add_food").show().next().hide()
             }else{
                 showRight()
                 this.hideMenuList();
                 $("#menu_total").show();
                 $("#menu_list").parent().show();
             }
             
         },
         chanManNum:function(manNum){
             var that = this;
             var params = {
                 presaleId:id,//订单id
                 manNum:manNum,//人数
                 shopId:shopId,//店铺id
             }
             reqAjaxAsync(USER_URL.CHANGEMANNUM,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){

                     if(id){
                         that.getFoodPresale();
                     }else{
                         $("#peopleNumNew").html($("#cancularnew").val())
                     }
                     layer.msg('修改人数成功')
                 }
             })
             return this;
         },
         //菜品估清
         dishOffSale:function(){
             var that = this;
             var lilist = that.getUlLi();

             var params = {
                 goodsId:that.data.el.attr('data-id') ,//菜品id
                 shopId: shopId,// 店铺id
                 goodsType:goodsType
             }
             var flag = true
             $.each(lilist,function(i,item){
                 if(!$(this).hasClass('menu_item_ding') && params.goodsId == $(this).attr('data-id')){
                    layer.msg(that.data.el.find('.food_title').text()+'商品已添加，不能估清，请删除后估清!')
                    flag =false;
                    return false
                 }
             })
             if(!flag){
                 return
             }
             that.data.el.removeAttr('class').addClass('food_box_wai food_box_guqing').find('.gq_box').html('重新售卖')

             reqAjaxAsync(USER_URL.DISHOFFSALE,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){
                     console.log(res.data)
                 }     
             })
         },
         //菜品重新售卖
         dishOnSale:function(){
            var that = this;
            var params = {
                goodsId:that.data.el.attr('data-id') ,//菜品id
                shopId: shopId,// 店铺id
                goodsType:goodsType
            }
            console.log(params)
            that.data.el.removeAttr('class').addClass('food_box_wai food_box_yu').find('.gq_box').html('估清').css({bottom:'-32px'})
            reqAjaxAsync(USER_URL.DISONSALE,JSON.stringify(params)).done(function(res){
                if(res.code == 1){
                    console.log(res.data)
                }     
            })
         },
         getFoodParams:function(){
             var that = this;
             var params = {};
             that.data.scPrelases = []; 
             that.data.orderParams.salesman = $("#players option:checked").text();
             var salesman = that.data.orderParams.salesman;
             var liList = that.getUlLi();
             var flag = 0;
             var totalGoods = 0;
             var totalPrice = 0;
             var startTime = formatDateTime(new Date().getTime() / 1000);
             $.each(liList,function(i,item){
                 params = {
                     batchingName:''
                 };
                var liel = $(this);
                params.purchaseNum = parseInt(liel.find('.dish_num').text());
                params.unitPrice = Number(liel.find('.dish_price_y').attr('data-stockprice'));
                params.actualPayment = params.unitPrice*params.purchaseNum,
                //单价
                // totalPrice+=params.purchaseNum*params.unitPrice;
                // totalGoods+=params.purchaseNum;
                 //单价

                totalPrice+=params.actualPayment;
                totalGoods+=params.purchaseNum;

                if(liel.hasClass('menu_item_ding')){
                    return true
                }
                flag++
                var dishList = liel.find(".dish_box span");
                params.goodsServiceId = liel.attr('data-id');
                params.purchaseName = liel.find('.menu_name span').text();
                params.purchaseType =liel.attr('data-type'),
                params.createId = operatorId;
                params.createName=operator;
                params.waiterId=salesmanId;
                params.waiterName=salesman;
                params.startTime = startTime;
                params.stockName = liel.find('span[data-type="stock"]').text()
                that.data.orderParams.date = startTime;
                that.data.orderParams.totalNum = totalGoods;

                params.remake=liel.find('.remarks').val();
                // params.
                $.each(dishList,function(j,itemss){
                    var spanel = $(this);
                    var type = spanel.attr('data-type')
                    var names = spanel.text();
                    if(type == 'stock'){
                        params.stockId = spanel.attr('data-id')
                    }else if(type == 'recipes'){
                         //做法
                         params.practiceName = spanel.text();
                    }else if(type == 'supplement'){
                        //配料
                        params.batchingName += spanel.text()+',';
                    }
                })
                if(params.batchingName){
                 params.batchingName =  params.batchingName.slice(0, params.batchingName.length-1)
                }
                that.data.scPrelases.push(params);
            })
            that.data.totalNum = totalGoods;
            that.data.totalPrice = totalPrice +that.data.additionalMoney;
            return flag
            
         },
         addFoodMore:function(){
            var that = this;
            if(!that.getFoodParams()){
                layer.msg('请至少选择一样菜品')
                return
            }
            that.data.addOrderParams.scPrelases =that.data.scPrelases
            that.data.addOrderParams.actualPay =  that.data.addOrderParams.shouldPay= that.data.totalPrice
            that.submitAddFoodMore(that.data.addOrderParams)
            
            
            console.log(that.data.orderParams)
         },
         submitAddFoodMore:function(params){
             var that = this;
             $("#menu_list").html('')
             that.setTotal()
             return reqAjaxAsync(USER_URL.ADDFOODMORE,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){
                     console.log(res)
                     that.data.printPrelaseInfo = res.data;
                    //  that.printPrelaseInfo(res.data)
                    // that.findPrintSwitch()
                    that.data.orderParams.scPrelases = that.data.addOrderParams.scPrelases
                    printObj.init(that.data)
                    printObj.findPrintSwitch();
                 }else{
                     layer.msg(res.msg)
                 }
             })
         },
         getFoodPresale:function(){
             var that = this;
             var params = {
                 id:id,//获取订单号id
             }
             return reqAjaxAsync(USER_URL.GETFOODPRESA,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){
                     console.log(res);
                     that.setFoodMenuTemplate(res.data).setTotal()
                 }
             })
             return that;
         },
         setFoodMenuTemplate:function(datas){
             var that =this;
             $(".menu_control").show();
             $(".handle_bottom_box_zhan").show().siblings().hide();
             var str = ``;
             if(datas){
                 that.data.orderParams = datas;
                 that.data.additionalMoney = datas.additionalMoney;
                 $("#place_num").html('桌号：'+datas.title)
                 $("#order_num").html('订单编号：'+datas.id)
                 $("#order_time").html('下单时间：'+datas.consumeTime);
                 $("#waiterNew").html('服务员:'+datas.salesman || '')
                 $("#menu_total_waiter").html(`<span>服务费：</span><em>合计：&yen;${datas.additionalMoney.toFixed(2)}</em>`)
                 $.each(datas.scPresaleInfos,function(i,item){
                     str+=`<li class="menu_item menu_item_ding" data-id="${item.goodsServiceId}" data-ids="${item.id}">
                         <h3 class="menu_name">
                             <span>${item.purchaseName}<g class="zeng" style="display:${item.actualPayment == 0 ?'inline-block':'none'}">赠</g></span>
                             <em>
                                 <i>${subStrs(item.startTime)}</i>
                                 <s>X<k class="dish_num">${item.purchaseNum}</k></s>
                             </em>
                         </h3>
                         <P class="menu_tips">
                             <b class="dish_box"><span data-price="${item.stockPrice || 0}" data-id="${item.stockId}" data-type="stock">${item.stockName}</span><span data-price="${item.money || 0}"   data-type="recipes">${item.practiceName || ''}</span>${that.strReplace(item.batchingName) || ''}</b>

                             <em>
                                 <i>${item.isPrint == 1 ?'已出菜':''}</i>
                                 <s class="dish_price">&yen;<y data-stockPrice="${item.unitPrice}" class="dish_price_y">${item.actualPayment.toFixed(2)}</y></s>
                             </em>
                         </P>
                         <p class="remarksP" style="display:${item.remake ?'':'none'}">备注：<j>${item.remake}</j></p>
                     </li>`
                 })
                 
             }
             $("#menu_list").html(str)
             // setHeight()
             
             showRight();
             return this
         },
         setHandleTemplate: function (data) {
             $("#place_num").html('桌号：' + facilityName);
            
             return this;
         },
         submitPrelases:function(params){
             var that = this;
             $("#menu_list").html('')
             that.setTotal()
             return reqAjaxAsync(USER_URL.ADDFOODPRESALE,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){
                     console.log(res)
                    //  that.printPrelaseInfo(res.data)
                    that.data.printPrelaseInfo = res.data;
                    printObj.init(that.data)
                    printObj.findPrintSwitch();
                    // that.findPrintSwitch()
                 }else{
                     layer.msg(res.msg)
                 }
             })
         },
         getScPrelases:function(){
            var that = this;
            if(!that.getFoodParams()){
                layer.msg('请至少选择一样菜品')
                return
            }
            that.data.orderParams.scPrelases =that.data.scPrelases
            that.data.orderParams.actualPay =  that.data.orderParams.shouldPay= that.data.totalPrice
            that.submitPrelases(that.data.orderParams)
         },
         setTotal:function(){
             var that =this;
             var liList = that.getUlLi();
             var totalPrice = 0;
             var totalNum = 0;
             $.each(liList,function(i,item){
                 var liel = $(this);
                 var num = parseInt(liel.find('.dish_num').text());
                 var total = Number(liel.find('.dish_price_y').text());
                 totalNum+=num;
                 totalPrice+=total //总价
                //  totalPrice+=total*num;// 单价

             })
             that.data.totalPrice = totalPrice+that.data.additionalMoney;
             that.data.totalNum = totalNum;
             $("#menu_total").html(`<span>商品总数：<i>${totalNum}</i></span><em>合计：¥<i>${that.data.totalPrice.toFixed(2)}</i></em>`)
             return this;
         },
         getUlLi:function(){
             //获取菜单的各种列表
             var liList = $("#menu_list").find('li').not();
             return liList;
         },
         getDishesList:function(){//获取菜品类别
             var that = this;
             var params = {
                 shopId:shopId,
                 merchantId:merchantId,
                 goodsType:goodsType,
             }
             return reqAjaxAsync(USER_URL.SELECTDISHESLIET,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){
                     that.categoryNames = res.data;
                     that.setDishesTemplate(res.data)
                 }   
             })
         },
         getDishesPage:function(){//获取菜品列表
             var that = this;
             var categoryId = $(".header_floor li.active").attr('data-id');
             var goodsName = $.trim($("#goodsName").val()) || '';
             var params ={
                 page:1,
                 rows:1000,
                 categoryId: categoryId,// 类别id(全部时空字符串，按类别查询时必填）
                 goodsName:goodsName,// 菜品名（搜索用，非必填）
                 merchantId:merchantId,// 商户id(必填)
                 shopId:shopId,
                 goodsType:goodsType,
             }
             reqAjaxAsync(USER_URL.SELECTDISHESPAGE,JSON.stringify(params)).done(function(res){
                 if(res.code == 1){
                     that.setDishesPageTemplate(res.data)
                 }
             })
             return this
             
         },
         getPlayer: function () {
             // merchantId
             var that = this;
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
                     $("#players").val(that.data.orderParams.salesmanId)
                     form.render();
                 }
             })
         },
         setDishesTemplate:function(data){
             var  str = `<li class="active">全部</li>`;
             if(data){
                 $.each(data,function(i,item){
                     str+=`<li data-id="${item.categoryId}">${item.categoryName}</li>`
                 })
             }
             $(".header_floor").html(str)
             floorw = $('.header_floor').find('li').length * 126;
             $('.header_floor').width(floorw)
             $(".header_floor_nei").width(floorw)

             $(".header").show()
             return str
         },
         setDishesPageTemplate:function(data){
             var str = ``;
             var classArr = ["food_box_kong", "food_box_zhan", "food_box_yu"]
             if(data){
                     $.each(data,function(i,item){
                         str+= ` <li data-params='${JSON.stringify(item)}' data-id="${item.goodsId}" class="food_box_wai ${item.balance <= 0 ? 'food_box_guqing':''} ${item.balance<=10?classArr[1]:(item.balance>=100?classArr[2]:classArr[0])}">
                               
                                <div class="food_box_nei">
                                     <div class="gq_box">${item.balance == 0?'重新售卖':'估清'}</div> 
                                     <div class="food_title">${item.goodsName}</div>
                                     <div class="food_money">&yen; ${item.stockPrice.toFixed(2) || 0.00}</div>
                                     <div class="food_tips" >估清</div>
                                     <div class="food_time">${item.balance == 0 ? '':''}</div>
                                 </div>
                             </li>`
                     })
                     
             }
             $(".food_ul").html(str)
             return str
         },
         addMenuList:function(){
             var that = this;
             var params = that.data.el.attr('data-params');
             var  datas = JSON.parse(params);
             var ids = datas.goodsId
             var lis = $("#menu_list").find('li')
             if(lis.length){
                 var flag = 0;
                 $.each(lis,function(i,item){
                     var idss = parseInt($(this).attr('data-id'));
                     if(ids == idss){
                         flag++
                     }
                 })
                 // if(flag == 0){
                 //     $("#menu_list").append(that.addMenuListTemplate(datas))
                 // }else{
                 //     layer.msg('该菜品已在菜单列表中')
                 // }
             }else{
                 // $("#menu_list").append(that.addMenuListTemplate(datas))
             }
             $("#menu_list").append(that.addMenuListTemplate(datas))
             setCenterHeight();
             return this;
             
         },
         addMenuListTemplate:function(data){
             var str = ``;
             if(data){
                 str+= ` <li data-id="${data.goodsId}" data-type="${data.goodsType}" class="menu_item">
                             <h3 class="menu_name">
                                 <span>${data.goodsName}</span>
                                 <em><s>X<k class="dish_num">1</k></s></em>
                             </h3>
                             <p class="menu_tips">
                                 <b class="dish_box"><span data-id="${data.stockId}" data-type="stock">${data.stockName}</span></b>
                                 <em>
                                     <s class="dish_price">&yen;
                                         <y data-stockPrice="${data.stockPrice}" class="dish_price_y">${data.stockPrice.toFixed(2)}</y>
                                     </s>
                                 </em>
                             </P>
                             <p class="remarksP" style="display:none">备注：<j></j></p>
                             <input type="hidden" class="remarks"/>
                         </li>`
             }
             return str;
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
                                     <button data-price="${item.stockPrice || 0}" data-id="${item.id}" class="layui-btn handle_spec_btn handle_norms_btn handle_spec_btn_special">${item.name}</button>
                             </li>`
                     }else{
                         //没有则为普通状态
                         str+=`<li class="">
                                     <button data-price="${item.stockPrice || 0}" data-id="${item.id}" class="layui-btn handle_spec_btn handle_norms_btn">${item.name}</button>
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
                     params[idss] = true
             })
             return params;
         },
         setDishList:function(txt,ids,type,price){
             //点击标签就添加该标签到列表或者删除该标签
             var oldBtn = $(".handle_spec_btn_price").find('em');
             var copyPrice = price;
             var that = this;
             var spanParams = that.setHoverStatus();//获取标签id
             var dishList = spanParams.dishList;
             var dishBox = spanParams.dishBox;
             console.log(dishList)
             var str = ``;
             var flag = 0;
             if(type == that.data.specTypeArr.recipes || type == that.data.specTypeArr.stock){//做法,规格,唯一 ，其余的删除
                if(dishList.length){
                    $.each(dishList,function(i,item){
                        var dish = $(this)
                        var dishtype = dish.attr('data-type')
                        var dishid = dish.attr('data-id')
                        var dishPrice = Number(dish.attr('data-price'))||0
                        
                        if(dishtype == type){
                            dish.remove();
                            flag++
                            if(price<0){
                                copyPrice = price + dishPrice;
                            }else{
                                copyPrice = price - dishPrice; 
                            }
                            return false
                        }

                        if(dishid == ids){
                            if(price<0){
                                copyPrice = price;
                            }else{
                                copyPrice = price - dishPrice; 
                            }
                            
                        flag+=2
                        dish.remove();
                        return false
                    }
                    })
                }

             }
            //  if(type == that.data.specTypeArr.recipes || type == that.data.specTypeArr.stock){//做法,规格,唯一 ，其余的删除
            //      var recipes = that.data.dishDetails[type];
            //      if(dishList.length){
            //          $.each(dishList,function(i,item){
            //              var dish = $(this)
            //              var dishtype = dish.attr('data-type')
            //              var dishid = dish.attr('data-id')
            //              var dishPrice = Number(dish.attr('data-price'))||0
                         
            //              if(dishtype == type){
            //                  dish.remove();
            //                  flag++
            //                  if(price<0){
            //                      copyPrice = price + dishPrice;
            //                  }else{
            //                      copyPrice = price - dishPrice; 
            //                  }
            //                  return false
            //              }

            //              if(dishid == ids){
            //                 if(price<0){
            //                     copyPrice = price;
            //                 }else{
            //                     copyPrice = price - dishPrice; 
            //                 }
                            
            //                 flag+=2
            //                 dish.remove();
            //                 return false
            //             }
            //          })
            //      }
                 
            //  }
             if(flag==1 || flag==0){
                 str = `<span data-price="${price}" data-id="${ids}" data-type="${type}">${txt}</span>`;
             }
             var newMoney = price
             oldBtn.html(newMoney.toFixed(2))
             var dishy = that.data.elMenu.find('.dish_price_y');
             var stockprice =  Number(dishy.attr('data-stockprice'))
             dishy.html((newMoney).toFixed(2)).attr('data-stockprice',newMoney)

             that.setTotal();
            //  flag = 0;
            //  if(flag){
            //      str=`<span  data-price="${price}" data-id="${ids}" data-type="${type}">${txt}</span>`
            //      if(dishList.length){ //配料多选
            //          $.each(dishList,function(i,item){
            //              var idss = $(this).attr('data-id');
            //              if(ids == idss){
            //                  flag++;
            //                  $(this).remove();
            //              }
            //          })
            //          if(flag){
            //              return
            //          }
            //      }
            //  }

           

             dishBox.append(str)

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
             $(".menu_control_no").show();
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
         }
     }

     
     layui.use(['form', 'layer'], function () {
         form = layui.form, layer = layui.layer;
         form.render();
         orderFood.init();
            
         var classArr = ["food_box_kong", "food_box_zhan", "food_box_yu"]
         var hoverClassArr = ["food_box_kong_hover", "food_box_zhan_hover", "food_box_yu_hover"]
         //点击菜品变色
         $('.food_ul').on('click', '.food_box_wai', function (e) {
           
             if($(this).hasClass('food_box_guqing')){
                 layer.msg('该商品已估清，不能出售')
                 return
             }
             var classStr = hoverClassArr.join(" ")
             var classes = $(this).attr('class');
             var arr = classes.split(' ')
             var hoverClass = arr[2] + '_hover'
             $(this).addClass(hoverClass).siblings().removeClass(classStr)
             orderFood.data.el= $(this)
             //新增菜品到菜单
             showRight()
             orderFood.addMenuList().setTotal();
         }).on('mouseenter','.food_box_wai',function(e){
            $(this).find('.gq_box').css({
                bottom:0
             })
             $(this).siblings('li').not(".food_box_guqing").find('.gq_box').css({
                bottom:'-32px'
             })
         }).on('mouseleave','.food_box_wai',function(e){
            $(this).find('.gq_box').css({
                bottom:'-32px'
             })
             $(this).siblings('li').not(".food_box_guqing").find('.gq_box').css({
                bottom:'-32px'
             })
         }).on('click','.gq_box',function(e){
             stopPropagation(e)
             txt= $(this).text()
             orderFood.data.el= $(this).parents('li')
             var that = $(this);
             var demo = $("#tuiDemo")
             demo.find('p').html('是否'+txt+'?')
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
                     
                 }
             })
         })
         var txt = ''
            $(".del").click(function () {
                layer.closeAll()
            })
            $(".cancel").click(function () {
                layer.closeAll()
            })
            $(".submit").click(function () {     
                layer.closeAll()
                $("#handle_spec").hide();
                // orderIndex.data.elMenu.remove();
                if(txt == '估清'){
                    //估清
                orderFood.dishOffSale()
                }else{
                    //重新售卖
                orderFood.dishOnSale()
                }
                
            })
         //搜索
         $("#searchBtn").click(function(){
             orderFood.getDishesPage();
         })
         // $(".menu_list").on('click','li.menu_item',function(e){
         //     stopPropagation(e);
         //     $(this).addClass('menu_item_hover').siblings().removeClass('menu_item_hover');
         // })
         //生成订单
         $(".goto_kitchen").click(function(e){
             orderFood.getScPrelases()
         })
         //返回桌台
         $(".add_cancel").click(function(res){
            location.replace(`order_index.html?userName=${operator}&userId=${operatorId}&merchantId=${merchantId}&shopId=${shopId}`)
         })
         //加菜
         $(".add_food").click(function(e){
             orderFood.addFoodMore();
         })
         //点击空白隐藏
         $(document).click(function () {
             $("li.menu_item").removeClass('menu_item_hover');
         });
         $('.icon_del').click(function () {
             hideRight()
         })
         //删除菜品
         $(".handle_spec_btn_del").click(function(res){
             $("#handle_spec,#handle_norms").hide().find('button').removeClass('handle_spec_btn_special');
             orderFood.data.elMenu.remove();
             orderFood.setTotal();
             setCenterHeight();
         })
         //估清菜品
        //  $(".handle_spec_btn_clear").click(function(res){
        //          $("#handle_norms").hide();
        //          $(this).addClass("handle_spec_btn_special").parents('li').siblings().find('button').removeClass('handle_spec_btn_special')
        //          var that = $(this);
        //          var demo = $("#tuiDemo")
        //          layer.open({
        //              title: false,
        //              type: 1,
        //              closeBtn: 0,
        //              content: demo, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        //              area: ['auto'],
        //              skin: 'layer_me',
        //              btn: '',
        //              end: function (layero, index) {
        //                  layer.close(index);
        //              },
        //              success: function (layero, index) {
        //                  $(".del").click(function () {
        //                      layer.close(index)
        //                  })
        //                  $(".cancel").click(function () {
        //                      layer.close(index)
        //                  })
        //                  $(".submit").click(function () {
        //                      layer.close(index)
        //                      $("#handle_spec").hide();
        //                      // orderIndex.data.elMenu.remove();
        //                      orderFood.dishOffSale()
        //                      that.removeClass('handle_spec_btn_special')
        //                  })
        //              }
        //          })
        //  })
         // $('.no_eat').click(function () {
         //     hideRight()
         //     el.parents('li').removeClass(classArr[0]).addClass(classArr[1] + " " + classArr[1] + "_hover")
         //     el.parent().siblings('.place_start').find('.place_start_choose').show();
         // })
         // $('.yes_eat').click(function () {
         //     window.location.href = 'order_food.html'
         // })
         
         cancular()
         setHeight()

     })
   

     $('.header_floor').on('click', 'li', function (e) {
         $(this).addClass('active').siblings('li').removeClass('active')
         orderFood.getDishesPage();
     })
    
     function setFloorScroll() {
         var obj = {
             num: 7,
             el: $('.header_floor'),
             dan: 0,
             left: $('.floor_left'),
             right: $('.floor_right'),
             ping: 0,
             yu: 0,
             start: 0,
             marginLeft: floorw,
             init: function () {
                 if(this.el.find('li').length>=7){
                     var el = this.el;
                     this.ping = Math.floor(el.find('li').length / this.num)
                     this.yu = el.find('li').length % this.num;
                     this.dan = el.find('li').width()+2;
                     this.linsen();
                 }
                 $(".header_floor_nei").width($(".header_floor").width())
                 
             },
             linsen: function () {
                 var that = this;
                 var el = this.el;
                 this.right.click(function () {
                     if (that.ping < 2) {
                         if (that.yu) {
                             el.css({
                                 marginLeft: -that.yu * that.dan + 'px',
                             })
                         }
                     } else {
                         if (that.start < that.ping) {
                             that.start++;
                             el.css({
                                 marginLeft: -that.start * that.dan * that.num + 'px',
                             })
                         } else {

                         }

                     }
                 })
                 this.left.click(function () {
                     if (that.ping < 2) {
                         if (that.yu) {
                             el.css({
                                 marginLeft: 0,
                             })
                         }
                     } else {
                         if (that.start <= that.ping && that.start > 0) {
                             that.start--;
                             el.css({
                                 marginLeft: -that.start  * that.dan * that.num + 'px',
                             })
                         } else {

                         }

                     }
                 })
             }
         }
         obj.init();
     }

 })