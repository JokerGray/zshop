function initTabs(callback){
    $('.header-tabs').on('click','span',function(){
        $(this).addClass('active').siblings().removeClass('active');
        callback && callback();
    });
}

function CDateTime(obj){
    this.data = obj;

}

 

function initSelect(id,obj){
    var mySelect = $(id);
    var i = mySelect.find('i');
    var input = mySelect.find('input');
    var dl = mySelect.find('dl');
    if (dl == undefined || dl.length == 0){
        var html = '<dd data-id="0" class="my-dd-this">无数据</dd>'; 
        
    }
    this.mySelect = mySelect;
    this.i = i;
    this.input = input;
    this.dl = dl;
    this.id = id;
    this.isShowDl = false;
    this.data = obj && obj.data || [];
    this.isInput = obj && obj.input || false;
    this.callback = obj && obj.callback;
}

//初始化 下拉框
initSelect.prototype.init = function(){
    //点击i 切换 dl 下拉框选择
    var t = this;
    //初始化 下拉框数据
    if(this.data.length > 0){
        // value  data  text
         
    }
    if(this.input) {
        this.input.attr('readonly', 'readonly');
    }
     
    this.input.on('click', function () {
        if (t.isShowDl) {  //false
            t.dl.hide();
            t.i.removeClass('rotate');
            t.isShowDl = false;
        } else {
            t.dl.show();
            t.i.addClass('rotate');
            t.isShowDl = true;
        }
        return false;
    });
    this.i.on('click', function () {
        if(t.isShowDl){  //false
            t.dl.hide();
            t.i.removeClass('rotate');
            t.isShowDl = false;
        }else{
            t.dl.show();
            t.i.addClass('rotate');
            t.isShowDl = true;
        }
        return false;
    });

    //选择下拉框
    this.dl.on('click','dd',function(){
        t.dl.hide();
        t.i.removeClass('rotate');
        t.input.val($(this).text());
        t.input.attr('data-id', $(this).attr('data-id'));
        t.isShowDl = false;
        t.callback && t.callback(); //回调
        return false;
    });
    $(document).on('click',function(){
        if(t.isShowDl){
            t.dl.hide();
            t.i.removeClass('rotate');
        }
    })
}

//清除小数
function clearNoNum(obj, maxPrice) {
    if (obj.value != '' && obj.value.substr(0, 1) == '.') {
        obj.value = "";
    }
    obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的     
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数     
    if (obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
            obj.value = obj.value.substr(1, obj.value.length);
        }
    }
    var maxPrice = maxPrice && Number(maxPrice) ? maxPrice : 100000;
    if (maxPrice && parseFloat(obj.value) >= maxPrice) {
        obj.value = obj.value.substr(0, obj.value.length-1);
    }
}

//保留 二小数
function formatInputNum(value, maxPrice){
    if (value != '' && value.substr(0, 1) == '.') {
        value= "";
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效
    value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的     
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数     
    if (value.indexOf(".") < 0 && value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) == '0' && value.length == 2) {
            value = value.substr(1, value.length);
        }
    }
    if (maxPrice && parseFloat(value) >= 100000) {
        value = value.substr(0, value.length - 1);
    }
    return value;
}

//格式化后时间戳 转行成时间文本
function formatStampToDate(string){
    var time  = new Date(string);
    var year = time.getFullYear();
    if(isNaN(year)) return string;
    var month = time.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;
    var date = time.getDate();
    date = date >= 10 ? date : '0' + date;
    var hours = time.getHours();
    hours = hours >= 10 ? hours : '0' + hours;
    var minutes = time.getMinutes();
    minutes = minutes >= 10 ? minutes : '0' + minutes;
    var seconds = time.getSeconds();
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

//格式化Date 转行成时间文本 2018-08-31 10:22:33
function formatDateToString(dateTime) {
    var time = new Date(dateTime);
    var year = time.getFullYear();
    if (isNaN(year)) return string;
    var month = time.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;
    var date = time.getDate();
    date = date >= 10 ? date : '0' + date;
    var hours = time.getHours();
    hours = hours >= 10 ? hours : '0' + hours;
    var minutes = time.getMinutes();
    minutes = minutes >= 10 ? minutes : '0' + minutes;
    var seconds = time.getSeconds();
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

//获取当前时间文本 2018-08-31
function getCurDate() {
    var time = new Date();
    var year = time.getFullYear();
    if (isNaN(year)) return string;
    var month = time.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;
    var date = time.getDate();
    date = date >= 10 ? date : '0' + date;
    return year + '-' + month + '-' + date;
}
//格式化金额 
/*
    params  price ==>代格式化的金额  is 是否带符号  
*/
function formatMoney(price, is) {
    var pri  = Number(price);
    if (isNaN(pri)) {
        return '';
    }
    price = Number(price).toFixed(2);

    price = String(price);
    if (price && price.indexOf) {
        var index = price.indexOf('￥');
        if (index == -1) {
            price = '￥' + price;
        }
    }
    return price;
}