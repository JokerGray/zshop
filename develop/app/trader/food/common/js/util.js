/**
 * author:  qiurui
 * name:    公用js
 * date:    2017/4/18
 * version: 1.0.0
 */
var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
var passwordExp = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9a-zA-Z]{6,16}$/; //密码正则
var messageExp = /^[0-9]{6}$/; //验证码正则
var nameExp = /^[\u4E00-\u9FA5]{2,10}$/; //真实姓名
var emailExp = /^[a-z0-9]+([._\-]*[a-z0-9])*@([-a-z0-9]*[a-z0-9]+.){2,63}[a-z0-9]+$/i; //邮箱绑定
var videoExp = /[·\~\`\!\^\￥\……\！\$\@\(\)\（\）\_\——\#\+\*\/\-\=\$%\^&\*]{1,20}$/g; //视频
var address = /^[A-Za-z0-9#\(\)（）\u4E00-\u9FA5]{1,50}$/; //地址
var amountExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/; //金额
var idcard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //身份证
var $company_name = /^[A-Za-z\u4E00-\u9FA5]{1,90}$/; //企业名称
var $website = /^((http:\/\/)|(https:\/\/))[0-9a-zA-Z-.]{1,90}$/; //网址


//校验正则表达式
function reg(val, exp) {
    if (!exp.test(val)) {
        return false;
    } else {
        return true;
    }
}
//判断视频名称
function is_video(val) {
    return reg(val, videoExp);
}
//判断地址
function is_address(val) {
    return reg(val, address);
}
//判断金额
function is_amount(val) {
    return reg(val, amountExp);
}
//判断真实姓名正则
function is_name(val) {
    return reg(val, nameExp);
}
//判断手机正则
function is_mobile(val) {
    return reg(val, mobileExp);
}
//判断密码正则
function is_password(val) {
    return reg(val, passwordExp);
}
//判断验证码正则
function is_message(val) {
    return reg(val, messageExp);
}
//判断推荐码正则
function is_okey(val) {
    return reg(val, okeyExp);
}
//判断邮箱正则
function is_email(val) {
    if (val.length > 50) {
        return false;
    }
    return reg(val, emailExp);
}
//判断企业名称
function is_company_name(val) {
    return reg(val, $company_name);
}
//判断省份
function is_province(val) {
    return reg(val, $province);
}
//判断城市
function is_city(val) {
    return reg(val, $city);
}
//判断身份证方法
function is_identity(id) {
    var strlen = id.length;
    if (strlen != 18) {
        return false;
    }
    var set = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var ver = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'];
    var arr = id.split("");
    var sum = 0;
    for (var i = 0; i < 17; i++) {
        if (isNaN(arr[i])) {
            return false;
        }
        sum += arr[i] * set[i];
    }
    var mod = sum % 11;
    if (ver[mod] != arr[17]) {
        if (mod == 2) {
            if (arr[17] == "X" || arr[17] == "x") {
                return true;
            }
        }
        return false;
    }
    return true;
}

//计算倒计时,dom&时间戳
function countdown(dom, closeTime) {
    var displayTime;

    function showTime() {
        var day = Math.floor(closeTime / (60 * 60 * 24));
        var hour = Math.floor(closeTime / (3600)) - (day * 24);
        var minute = Math.floor(closeTime / (60)) - (day * 24 * 60) - (hour * 60);
        var second = Math.floor(closeTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        closeTime -= 1;
        var html = day + '天' + hour + '小时' + minute + '分' + second + '秒';
        dom.html(html);
        if (closeTime == -1) {
            clearInterval(displayTime);
            document.location.href = document.location.href;
            return;
        }
    }
    showTime();
    displayTime = setInterval(function() {
        showTime();
    }, 1000)
}

//把数组字符串转换为数字
function strToNum(arr) {
    var json = [];
    for (var i = 0; i < arr.length; i++) {
        json.push(arr[i] - 0);
    }
    return json;
}

//判断正整数加".00"
function isPositiveNum(s) {
    var re = /^[0-9]*[1-9][0-9]*$/;
    if (re.test(s)) {
        s = s + ".00";
    }
    return s;
}

/**
 * 操作cookie
 * @param key 
 * @param val
 * @param exp 有效期单位为秒
 */
function setCookie(key, val, exp) {
    var d = new Date();
    d.setTime(d.getTime() + exp * 1000); //1000为毫秒
    var expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + val + ";" + expires + ";path=/";
}

function getCookie(key) {
    var cookieArr = document.cookie.split(';');
    for (var i = 0; i < cookieArr.length; i++) {
        var u = cookieArr[i];
        u = u.replace(/(^\s*)|(\s*$)/g, '');
        var d = u.split('=');
        if (key == d[0]) {
            return d[1];
        }
    }
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

// 数字动画
function countUp(dom, val) {
    var options = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
    };
    var val = val - 0;
    var demo = new CountUp(dom, 0, val, 0, 1, options);
    demo.start();
}

//判断input输入长度
function inputLen(inputStar) {
    var bytesCount = 0;
    for (var i = 0; i < inputStar.length; i++) {
        var c = inputStar.charAt(i);
        bytesCount += 1;
    }
    return bytesCount;
}

//判断是否为空
function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == "") {
        return true;
    }
    return false;
}

//删除数组指定元素
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
/**
 * 获取地址栏URL里的参数集
 */
function getParams(url) {
    // var url = location.search;
    var params = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
}

/**
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 获取url地址信息(多个iframe自取父级)
//根据参数名获取地址栏URL里的参数
function getUrlParams(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
    }
    return "";
}

//获取缓存 通行证码
var apikey = sessionStorage.getItem('apikey') || getUrlParams('apikey') || "test";
//获取缓存 版本号
var version = sessionStorage.getItem('version') || getUrlParams('apikey') ||"1";

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

function reqAjaxAsync(cmd, data,type, async, successfn) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(2, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
            if(type==1){
                $("#scanBox").find(".tit-list").eq(1).addClass("acv");
                $("#scanBox").find(".sacn-user").hide();
                $("#scanBox").find(".scan-wait").show();
                $("#scanBox").parents(".layui-layer-page").addClass("layui-form");
                $("#scanBox").parents(".layui-layer-page").find("a.layui-layer-btn").hide();
            }
        },
        success: function(data) {
            layer.closeAll('loading');
            defer.resolve(data);
            if(type==1){
                $("#scanBox").find(".tit-list").eq(2).addClass("acv");
                $("#scanBox").find(".scan-wait").hide();
                $("#scanBox").find(".sacn-success").show();
                $("#scanBox").parents(".layui-layer-page").addClass("layui-form");
                $("#scanBox").parents(".layui-layer-page").find("a.layui-layer-btn0").attr("lay-submit","");
                $("#scanBox").parents(".layui-layer-page").find("a.layui-layer-btn0").attr("lay-filter","closedemo");
            }
        },
        error: function(err) {
            layer.closeAll('loading');
            layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}

//调用接口成功之前操作
function reqAjaxAsyncReply(cmd, data, async,test ,successfn) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(2, { shade: [0.1, '#fff'] });
            request.setRequestHeader("apikey", apikey);
            test();
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
    var hour = parseInt(d.getHours());
    var minute = parseInt(d.getMinutes());
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    return formatDate(now) + " " + hour + ":" + minute;
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

//获取城市列表和领域列表
function getCity() {
    reqAjaxAsync("cms_back/selecteAllScCmsSubscriptionType").done(function(re) {
        if (re.code == 9) {
            layer.msg(re.msg);
            return false;
        }
        var scCmsSubscriptionTypeList = re.data.scCmsSubscriptionTypeList || [];
        if (scCmsSubscriptionTypeList.length > 0) {
            var scriptionTypeListHtml = ''
            for (i = 0; i < scCmsSubscriptionTypeList.length; i++) {
                scriptionTypeListHtml += '<option value="' + scCmsSubscriptionTypeList[i].subscriptionTypeId + '">';
                scriptionTypeListHtml += scCmsSubscriptionTypeList[i].subscriptionTypeName;
                scriptionTypeListHtml += '</option>';
            }
            $('select[name="subscriptionType"]').append(scriptionTypeListHtml);
        }
    });
    reqAjaxAsync("cms_back/selectByParentCode", "{'parentCode':'0'}").done(function(re) {
        if (re.code == 9) {
            layer.msg(re.msg);
            return false;
        }
        var province = re.data || [];
        var provinceHtml = '';
        for (p = 0; p < province.length; p++) {
            provinceHtml += '<option value="' + province[p].code + '">';
            provinceHtml += province[p].areaname;
            provinceHtml += '</option>';
        }
        $('select[name="province"]').append(provinceHtml).attr('onchange', 'showCity()');
    });
}


//上传头像方法

var uploadJson = {
    accessid: '',
    accesskey: '',
    host: '',
    policyBase64: '',
    signature: '',
    callbackbody: '',
    filename: '',
    key: '',
    expire: 0,
    g_object_name: '',
    g_object_name_type: '',
    now: timestamp = Date.parse(new Date()) / 1000
};


function send_request() {
    layer.load(0, { shade: [0.1, '#fff'] });
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        serverUrl = '/zxcity_restful/ws/oss/ossUpload';
        xmlhttp.onreadystatechange = callbacksuccess;
        xmlhttp.open("POST", serverUrl, false);
        layer.closeAll('loading');
        xmlhttp.send(null);

        function callbacksuccess() {
            layer.closeAll('loading');
            if (xmlhttp.status == 200) {
                $("#zxadver .inpt").show();//上传未成功时不能反复点击
                layer.msg("上传中，请耐心等待!");
            } else {
                layer.msg("系统繁忙，请稍后再试");
            }
        }
        return xmlhttp.responseText;
    } else {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length; i++) {
        if (tt[i].checked) {
            g_object_name_type = tt[i].value;
            break;
        }
    }
}

//可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
function get_signature() {
    now = timestamp = Date.parse(new Date()) / 1000;
    if (uploadJson.expire < now + 3) {
        body = send_request()
        var obj = eval("(" + body + ")");
        uploadJson.host = obj['host']
        uploadJson.policyBase64 = obj['policy']
        uploadJson.accessid = obj['accessid']
        uploadJson.signature = obj['signature']
        uploadJson.expire = parseInt(obj['expire'])
        uploadJson.callbackbody = obj['callback']
        uploadJson.key = obj['dir']
        return true;
    }
    return false;
};

function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//得到文件名的后缀
function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

//得到文件是本地名还是随机名
function calculate_object_name(filename) {
    g_object_name = g_object_name + '/' + randomString(file.name);
    // g_object_name = g_object_name + '/' + "${filename}"
    return '';
}

function get_uploaded_object_name(filename) {
    tmp_name = g_object_name
    tmp_name = tmp_name.replace("${filename}", filename);
    return tmp_name
}

//返回一个随机数字名称
function randomString(importUrl) {
    var importUrl = /\.[^\.]+$/.exec(importUrl);
    var d = new Date().getTime();
    var random = parseInt(Math.random() * 1000);
    return "zx" + d + importUrl;
}

function set_upload_param(up, filename, ret) {
    if (ret == false) {
        ret = get_signature()
    }
    g_object_name = uploadJson.key; //目录
    if (filename != '') {
        // suffix = get_suffix(filename) //得到后缀
        // calculate_object_name(filename) //得到本地或者随机名
        g_object_name = g_object_name + '/' + randomString(filename);
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': uploadJson.policyBase64,
        'OSSAccessKeyId': uploadJson.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': uploadJson.callbackbody,
        'signature': uploadJson.signature
    };
    up.setOption({
        'url': uploadJson.host,
        'multipart_params': new_multipart_params
    });
    up.start();
}

//配置
function filter(data) {
    var obj = "";
    if (data.flag == "video") {
        obj = [{ title: "files", extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv" }]
    } else {
        obj = [
            { title: "Image files", extensions: "jpg,gif,png,bmp" },
            { title: "Zip files", extensions: "zip,rar" }
        ];
    }
    return obj;
}


//用于点击选择店铺弹出table选择店铺页面
function showTableCheckShop(){
    layer.open({
        type:	2,
        area:	['800px','620px'],
        title:	'选择店铺',
        closeBtn:	1,//0表示不显示关闭按钮
        content:	ctx+'/live/checkShopShows.do',
        btn:	['全部'],
        yes:	function(index,layero){
            $("#shopId").val("");
            getCheckShopData("");
            refParTable();
            layer.close(index);
        },
        cancel:function(index){
        }
    });
}
//用于选择店铺双击回调
function getCheckShopData(shop_id,orgName){
    $("#shopId").val(shop_id);
    refParTable();
}