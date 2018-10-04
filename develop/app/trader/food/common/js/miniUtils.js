/**
 * @desc 将时间戳转换为YYYY-MM-DD格式
 * @access public
 * @param 时间戳
 * @return string
 */
function formatDate(now) {
    var d = new Date(now * 1000);
    var month = parseInt(d.getMonth()) + 1;
    var day = parseInt(d.getDate());
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return d.getFullYear() + "-" + month + "-" + day;
}
/**
 * @desc 将时间戳转换为YYYY-MM-DD HH:ii
 * @access public
 * @param
 * @return string
 */
function formatDateTime(now) {
    var d = new Date(now * 1000);
    var hour =  parseInt(d.getHours());
    var minute = parseInt(d.getMinutes());
    var second = parseInt(d.getSeconds())
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if(second < 10){
        second = "0" + second
    }
    return formatDate(now) + " " + hour + ":" + minute + ":" + second;
}
//返回 HH:mm:ss
function formatDateHHmmss(now){
    var d =  new Date(now);
    var dd = d/1000;
    var day = Math.floor(dd/(3600*24));
    var hour = parseInt(dd%86400/3600);
    var minute = parseInt(d.getMinutes());
    var second = parseInt(d.getSeconds())
    if(hour<0){
        hour = ''
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if(second < 10){
        second = "0" + second
    }
    if(hour){
        if(day){
            return day+'天'+ hour + ":" + minute + ":" + second;
        }else{
            return  hour + ":" + minute + ":" + second;
        }
    }else{
        return  minute + ":" + second;
    }
    
    return  hour + ":" + minute + ":" + second;
}
/**
 * @desc 金额转换，保留2位小数并四舍五入
 * @author：qiurui
 * @param  num / string : 1000.59
 * @return string : 1,000.60
 */
function getMoneyFormat(number) {
    number = number + ''; //数字转换成字符串
    number = number.replace(/\,/g, ""); //将 , 转换为空
    //判断是否是数字
    if (isNaN(number) || number == "") {
        return "";
    }
    //四舍五入,保留2位
    number = Math.round(number * 100) / 100;
    //是否是负数
    if (number < 0) {
        return '-' + getFormatYuan(Math.floor(Math.abs(number) - 0) + '') + getFormatCents(Math.abs(number) - 0);
    } else {
        return getFormatYuan(Math.floor(number - 0) + '') + getFormatCents(number - 0);
    }
    //格式化整数
    function getFormatYuan(number) {
        //判断是否是0.几几
        if (number.length <= 3) {
            return (number == '' ? '0' : number);
        } else {
            var mod = number.length % 3; //求余
            //截取字符开头的数字
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                //mod==0 && i==0 说明数字的长度被3整除；第一次循环的时候截取（0,3）位
                if ((mod == 0) && (i == 0)) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            return (output);
        }
    }
    //格式化小数
    function getFormatCents(amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);
    }
}

// 阻止冒泡
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}
//获取缓存 通行证码
var apikey = sessionStorage.getItem('apikey') || GetQueryString('apikey') || "test";
//获取缓存 版本号
var version = sessionStorage.getItem('version') || GetQueryString('apikey') ||"1";
/**
 * 通用接口同步调用方法
 * @param cmd 接口访问地址 
 * @param data 接入参数
 */
function reqAjax(cmd, data) {
    var reData;
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: false,
        data: {
            "cmd": cmd,
            "data": data,
            "version": version
        },
        beforeSend: function(request) {
            layer.load(2, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            layer.closeAll('loading');
            reData = re;
        },
        error: function(re) {
            layer.closeAll('loading');
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return reData;
}

//异步ajax
function reqAjaxAsync(cmd, data,url) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url:url|| "/zxcity_restful/ws/rest",
        dataType: "json",
        async: true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(2, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
            layer.closeAll('loading');
            defer.resolve(data);
        },
        error: function(err) {
            layer.closeAll('loading');
            layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}
/**
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//加减计数
function cancular() {
    var cancular = $("#cancular");
    var num ;
    $('.sub').click(function (e) {
        stopPropagation(e)
        cancular = $(this).next();
        num = parseInt(cancular.val()) || 0;
        if(cancular.attr('id') == 'cancularer'){
            // 点击减小到0
            if (num < 2) {
                return
            }
        }else{
            if (num < 2) {
                return
            }
        }
        
        num -= 1;
        cancular.val(num)
    })
    $('.add').click(function (e) {
        stopPropagation(e)
        cancular = $(this).prev();
        num = parseInt(cancular.val()) || 0;
        if (num > 998) {
            return
        }
        num += 1;
        cancular.val(num)
    })
    
    cancular.change(function () {
        num = parseInt($(this).val()) || 0;
    })

}

//动态设置高度
function setHeight() {
    // var ulh = $('.food_ul').height() || $('.place_ul').height();
    // var headerh = $('.header').height();
    // var apph = $('.app').height();
    // var menuh = $(".handle_center").height() + $(".handle_title").height() + $(".handle_bottom").height()+55 + 30;
    // if (apph < menuh) {
    //     $(".order_handle").height(menuh)
    // }
    // if (apph > ulh + headerh) {

    // }
    // else {
    //     if (menuh > ulh) {
    //         $('.main').height(menuh)
    //         $('.app').height(menuh + headerh);
    //         $('body,html').height(menuh + headerh + 50);
    //     } else {
    //         $('.main').height(ulh)
    //         $('.app').height(ulh + headerh);
    //         $('body,html').height(ulh + headerh + 50);
    //     }

    // }
    console.log($(".handle_title").height()+$(".handle_center").height()+$('.handle_bottom').height())
    $(".order_handle").height($(".handle_title").height()+$(".handle_center").height()+$('.handle_bottom').height())
}
//清除高度
function clearHeight(){
    $('.main,.order_handle,.app,body,html').height('auto')
}
//显示右侧
function showRight() {
    $('.order_handle').show();
    // $('.food_list,.main_list').css({
    //     marginRight: '500px'
    // })
    setHeight()
}
//隐藏
function hideRight() {
    $('.order_handle,#handle_spec,#handle_norms').hide();
    // $('.food_list,.main_list').css({
    //     marginRight: '0px'
    // })
}

//点击切换做法,配料
$(".handle_spec_box").on('click','button.handle_norms_btn',function(e){
    var price = Math.floor($(this).attr('data-price'));
    var dish_price_y =  orderFood.data.elMenu.find('.dish_price_y')
    var stockprice =  Number(dish_price_y.attr('data-stockprice'))
    
    // orderFood.data.specType = type;
    var txt = $(this).text()
    var ids = $(this).attr('data-id');
    if(orderFood){
        if((orderFood.data.specType == 'stock' || orderFood.data.specType == 'recipes')  &&  $(this).hasClass('handle_spec_btn_special')){
            return 
        }else{
            $(this).addClass('handle_spec_btn_special')
        }
        dish_price_y.attr('data-stockprice',price)
        
        // if($(this).hasClass('handle_spec_btn_special')){
        //     $(this).removeClass('handle_spec_btn_special')
        //     price = -price
        // }else{
        //     $(this).addClass('handle_spec_btn_special')
        // }

        var num = orderFood.data.elMenu.find('.dish_num').text();//配菜需要乘以分数
        var type = orderFood.data.specType;
        if(type == orderFood.data.specTypeArr.recipes || type == orderFood.data.specTypeArr.stock){
            $(this).parents('li').siblings().find('button').removeClass('handle_spec_btn_special')
        }
        orderFood.setDishList(txt,ids,type,price)
    }
    if(orderIndex){
        var type = orderIndex.data.specType;
        if(type == orderIndex.data.specTypeArr.recipes || type == orderIndex.data.specTypeArr.stock){
            $(this).parents('li').siblings().find('button').removeClass('handle_spec_btn_special')
        }
        orderIndex.setDishList(txt,ids,type,price)
    }
    
    
})
 //点击菜单列表
 $(".menu_list").on('click','li.menu_item',function(e){
     stopPropagation(e)
   
})
//计算高度
function setCenterHeight(){
    console.log($(".handle_title").height()+$(".handle_center").height()+$('.handle_bottom').height())
    $(".order_handle").height($(".handle_title").height()+$(".handle_center").height()+$('.handle_bottom').height())
}
//点击确定
 $(".handle_spec_submit").click(function(e){
    $("#handle_spec,#handle_norms").hide().find('button').removeClass('handle_spec_btn_special');

    var cancularer = $("#cancularer").val()
    var dan = orderFood.data.elMenu.find('.dish_price_y')
    var danStockprice = dan.attr('data-stockprice')

    if(cancularer == 0){
        orderFood.data.elMenu.remove();
    }else{
        orderFood.data.elMenu.find('.dish_num').html(cancularer);
        dan.html((cancularer*danStockprice).toFixed(2))
        orderFood.setTotal();
    }
    if(orderFood){
        var remark = $.trim($("#remarks").val());
        orderFood.data.elMenu.find('input.remarks').val(remark)
        if(remark){
            orderFood.data.elMenu.find('p.remarksP').show().find('j').html(remark)
        }else{
            orderFood.data.elMenu.find('p.remarksP').hide().find('j').html(remark)

        }
       
        setCenterHeight()
       
    }
    $("#remarks").val('')
 })
// handle_spec_btn_normal
$(".order_handle").on('click',function(e){
    stopPropagation(e);
})
$(".handle_spec_box").on('click','button.handle_spec_btn_normal',function(e){
    $(this).addClass('handle_spec_btn_special')
    $(this).parents('li').siblings().find('button').removeClass('handle_spec_btn_special')
    var txt = $(this).text();
    var type = $(this).attr('data-type');
    console.log(txt)
    
    if(orderFood){
        orderFood.data.specType = type;
        orderFood.setDetailsTemplate(orderFood.data.dishDetails[type],txt)
    }
    if(orderIndex){
        orderIndex.data.specType = type;
        orderIndex.setDetailsTemplate(orderIndex.data.dishDetails[type],txt)
    }
    
})

    //点击菜单列表
$(".menu_list").on('click','li.menu_item',function(e){
    if($(this).hasClass('menu_item_ding')){
        layer.msg('不能操作已出单的菜品')
        return
    }
    $(this).addClass('menu_item_hover').siblings().removeClass('menu_item_hover');
    $("#handle_spec").show();
    var ids = $(this).attr('data-id');
    var txt = $(this).find('.dish_price_y').attr('data-stockprice');
    var num = $(this).find('.dish_num').text();
    if(orderFood){
        orderFood.data.elMenu = $(this);
        orderFood.getDetails(ids)
        orderFood.data.handleSpecPrice = Math.floor(txt);
    }
    if(orderIndex){
        orderIndex.data.elMenu = $(this);
        orderIndex.getDetails(ids)
    }
    $(".handle_spec_btn_price").find('em').html(Number(txt).toFixed(2))
    $("#cancularer").val(num)
    $("#handle_norms").hide();
   
   
    
})
//点击空白隐藏
$("body").on('click','.layui-layer-shade,.layui-layer-content',function(e){
    
    stopPropagation(e)
})
$(".order_handle").click(function(res){
    chanManNum()
    // $(".cancular_li_new").removeClass('cancular_li_new_hover')
    // $("li.menu_item").removeClass('menu_item_hover');
})
//重新选择人数
function chanManNum(){
    var cancular_li_new = $(".cancular_li_new");
    var oldNum = $("#peopleNumNew").text();
    var cancularnew = $("#cancularnew");
    if(cancular_li_new.hasClass('cancular_li_new_hover')){
        $(".cancular_li_new").removeClass('cancular_li_new_hover')
        if(oldNum != cancularnew.val()){
            if(orderFood){
                orderFood.chanManNum(cancularnew.val())
            }
            if(orderIndex){
                orderIndex.chanManNum(cancularnew.val()).done(function(res){
                    orderIndex.getDeviceList()
                })
            }
        }
    }
}
$(".cancular_li_new").click(function(e){
    stopPropagation(e)
    $(this).addClass('cancular_li_new_hover')
    $("#cancularnew").val($("#peopleNumNew").text())
})
$(document).click(function () {
    $("li.menu_item").removeClass('menu_item_hover');
    $("li.order-item").removeClass('order-item-hover');
    
    chanManNum()

    $("#handle_norms,#handle_spec").hide();
    $(".handle_spec_btn_normal,.handle_spec_btn").removeClass('handle_spec_btn_special')
});
//点击结账
$(".square_accounts,.got_quarter").click(function(e){
    window.location.href = `../settlement/settlement.html`
})

//计时器
function subStrs(time) {
    if (time) {
        var now = new Date().getTime();
        var date = new Date(time).getTime();
        var t = now - date;
        return formatDateHHmmss(t)
    } else {
        return ""
    }
}
var printObj={
    USER_URL:{
        PRINTPRELASEINFO:'foodBoot/foodPresaleInfoIsPreint',//打印成功之后回调
        FINDPRINTSWITCH:'foodBoot/findPrintTemplateSwitch',//打印模板开关
        STARTPRINT:'foodBoot/findPrintTemplate',//开始使用模板打印菜单
    },
    data:{},
    init:function(data){
        this.data = data;
    },
    startPrint:function(){//打印开始
       var that =this;
       var params={
           merchantId:merchantId,
           templateSetName:that.data.templateSetName
       }
       return reqAjaxAsync(that.USER_URL.STARTPRINT,JSON.stringify(params)).done(function(res){
           if(res.code == 1){
               // printTemplateMap
               console.log(res)
               that.data.printTemplateMap = res.data.printTemplateMap
           }else if(res.msg =='商户没有设置模板，已选择默认模板'){
               that.data.printTemplateMap = res.data.printTemplateMap
           }
           that.data.width = 210;
           if(that.data.printTemplateMap.hasOwnProperty('content')){
               if (that.data.printTemplateMap.templateType =="RM58"){
                   that.data.width = 50;
               }else if(that.data.printTemplateMap.templateType =="RM80"){
                   that.data.width = 70;
               }
               var templateStr = that.setPrintTemplate(that.data.printTemplateMap.content,that.data.width);
               that.endPrint(templateStr);
               
           }
       })
    },
    endPrint:function(str){
       var that = this;
       var height  = $("#printTemplate").height();

       if(wp.isConnected()){
           // alert("已连接");
           wp.newTask({
               name:that.data.orderParams.title,
               content:str,
               interactive:false,
               type:"HTML",
//	 			printer:document.getElementById("printer").value,
               config:{
                   width:that.data.width,
                   height:height/2.5,//根据打印代理的纸张尺寸稍作修改
                   quality:"HIGH",
                   color:"COLOR",
                   marginLeft:0,
                   marginTop:0,
                   marginRight:0,
                   marginBottom:0
               }
           },function(id,status){
               $("#printTemplate").remove()
               if(status==200){
                   //
                   if( that.data.templateSetName == '点单[后厨-堂口单]'){
                       that.printPrelaseInfo(that.data.printPrelaseInfo);
                   }else{
                       layer.msg('打印成功')
                   }
               }else {
                   layer.msg('打印失败')
               }
           });
       }else{
           layer.msg('打印代理客户端未启动')
       }
    },
    setPrintTemplate:function(str,width){
        var that = this;
        var templateSetName = that.data.templateSetName;
        if(templateSetName == '点单[后厨-堂口单]'){
            that.data.orderParams.totalNum = 0; 
        }
        $('body').append(`<div id="printTemplate" style="display: none;width:${width}px"></div>`);
        var printTemplate = $("#printTemplate")
        printTemplate.html(str)
        that.data.orderParams.now = formatDateTime(new Date()/1000)
        if( templateSetName == '结账单' ){
            that.data.orderParams.shouldPay = Number(that.data.orderParams.shouldPay).toFixed(2)
            that.data.orderParams.actualPay =Number(that.data.orderParams.actualPay).toFixed(2)
            that.data.orderParams.additionalMoney = Number(that.data.orderParams.additionalMoney).toFixed(2)
            var footStr1=`<div class="footer-list" style="width:100%;display:${that.data.additionalMoney==0?'none':'block'}"><div class="footer-title cura"><span>餐位费</span>：</div><div class="footer-val" style="float:right;width:20%;text-align:left">#additionalMoney#</div></div>`
            var footStr0=`<div class="footer-list" style="width:100%;display:${that.data.discountedPrice?'block':'none'}"><div class="footer-title cura"><span>优惠金额</span>：</div><div class="footer-val" style="float:right;width:20%;text-align:left">#discountedPrice#</div></div>`
            var footStr2=`<div class="footer-list" style="width:100%;overflow:hidden"><div class="footer-title cura"><span style="font-size:18px">实付金额</span>：</div><div class="footer-val" style="float:right;width:20%;text-align:left">#actualPay#</div></div>`
            var footStr3=`<div class="footer-list" style="width:100%;overflow:hidden"><div class="footer-title cura"><span style="font-size:18px">应付金额</span>：</div><div class="footer-val" style="float:right;width:20%;text-align:left">#shouldPay#</div></div>`
            var footBody = printTemplate.find('.content-footer');
            
            footBody.prepend(footStr1)
            footBody.prepend(footStr2)
            footBody.prepend(footStr3)
            footBody.prepend(footStr0)
        }
       
        var contentBody = printTemplate.find('.table-body');
        var copyStr = contentBody.html();
        var bodyStr =  '';
        var scPrelases = that.data.orderParams.scPrelases;
        $.each(scPrelases,function(i,item){
          item.purchaseNums=''
          if(templateSetName =='客看单' ||  templateSetName == '结账单'){
            item.totalMoney = item.actualPayment || item.totalMoney
            if(!item.totalMoney){
                item.totalMoney = '0.00'
            }else{
                item.totalMoney =  Number(item.totalMoney).toFixed(2)
            } 
            if(!item.unitPrice){
                item.unitPrice = '0.00'
            }else{
                item.unitPrice = Math.floor(item.unitPrice).toFixed(2) || 0.00; 
            }
            item.purchaseNums = item.purchaseNum +'/'+item.stockName
          }else{
            that.data.orderParams.totalNum += Number(item.purchaseNum)
          }
           var reg2 = /#([^\s]*?)#/g, ret2 = [];
           var cbody = copyStr
           while(arr = reg2.exec(cbody))
           {
               ret2.push(arr[1]);
               cbody=cbody.replace(arr[0],item[arr[1]] || "-")
              
           }
           if(item.remake){
            cbody+='<div style="font-size:16px;width: 100%;display: flex;justify-content: flex-start">备注：'+item.remake+'</div>'
           } 
           bodyStr +=cbody
        })
        
        contentBody.html(bodyStr)
        if(templateSetName =='客看单' ||  templateSetName == '结账单'){
            contentBody.append(`<div id="tableText"><div class="table-val" style="width: 40%; height: auto;">合计</div><div class="table-val" style="width: 20%; height: auto;"></div><div class="table-val" style="width: 20%; height: auto;">${that.data.totalNum }</div><div class="table-val" style="width: 20%; height: auto;">${Number(that.data.totalPrice).toFixed(2)}</div></div>`)
        }
        str = printTemplate.html();
        if(str){
           var reg = /#([^\s]*?)#/g, ret = [];
           while(arr = reg.exec(str))
           {
               ret.push(arr[1]);
               str=str.replace(arr[0],that.data.orderParams[arr[1]] || "-")
           } 
        }
       
       printTemplate.html(str)
     

        return printTemplate.html()
        

    },
    findPrintSwitch:function(){//查询商户是否开启打印模板
        if(wp.isConnected()){ // 开始就判断是否有打印插件
            //有插件
            var that = this;
            var params={
                merchantId:merchantId,
                templateSetName:that.data.templateSetName
            }
            return reqAjaxAsync(that.USER_URL.FINDPRINTSWITCH,JSON.stringify(params)).done(function(res){
                if(res.code == 1){
                    console.log(res)
                    if(res.data == 0){
                        layer.msg('您暂未开启打印模板')
                        that.windowLocation()

                    }else{
                        that.startPrint()
                    }
                }
            })
        }else{
            //无插件
            // layer.msg('打印机链接失败');
            var that = this;
            var html = '<div class="tip" style="width: 80%;margin: 10px auto; font-size: 12px;">打印代理客户端未启动，请确定已经启动打印代理客户端！<br><br> <br>（<a style="text-decoration:none;color:red;" target="_blank" href="http://zxcity-backstage.oss-cn-hangzhou.aliyuncs.com/print/webprinter_setup_1.9.exe">打印插件下载</a>）<br><br><br>目前系统只支持80毫米热敏小票打印机 </div>';
            layer.open({
                type:1,
                title:['打印失败','font-size:16px;background-color:#353b53;color:#1ce6d8'],
                area:['400px', '250px'],
                closeBtn:0,
                shadeClose: true,
                btn: ['确认'],
                content:html,
                end:function () {
                    that.windowLocation()
                },
                yes:function (index) {
                    layer.close(index)
                }

            })
        }

       
        
    },
    printPrelaseInfo:function(data){
        var that = this;
        var params ={
            presaleInfoIds:data.join(",")
        }
        reqAjaxAsync(that.USER_URL.PRINTPRELASEINFO,JSON.stringify(params)).done(function(res){
            if(res.code == 1){
               layer.msg('成功打印菜单到后厨')
               if(orderFood){
                   that.windowLocation()
               }else{
                   orderIndex.getFoodPresale();
               }
              
            }else{
                layer.msg(res.msg)
            }
        })
        return that;
    },
    windowLocation:function(){
        setTimeout(function(){
            // userName=${userName}&userId=${userId}&
            location.replace(`order_index.html?userName=${operator}&userId=${operatorId}&merchantId=${merchantId}&shopId=${shopId}`)//让浏览器不能返回
            // window.history.back(-1);
        },1000)
    }
}