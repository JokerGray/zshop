/**
 * author:  qiurui
 * name:    公用js
 * date:    2017/11/29
 * version: 1.2.0
 */
var apikey = localStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = localStorage.getItem('version') || "1"; //获取缓存 版本号

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

/**
 * 检查登录状态
 */
function checkUserLogin() {
    if (localStorage.getItem("scSysUserInfo") == null) {
        //alert('您还没有登录！');
        location.href = 'login.html';
        return false;
    } else {
        var scSysUserInfo = JSON.parse(localStorage.getItem("scSysUserInfo"));
        console.log('当前登录平台ID：' + scSysUserInfo.id);
        console.log('当前登录平台用户：' + scSysUserInfo.username);
    }
}

// 序列化转对象
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

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
    if (val == null || val == "null" || val == undefined || val == "undefined" || val == "") {
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
            layer.load(0, {
                shade: [0.1, '#fff']
            });
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

/**
 * 通用接口同步调用方法NEW
 * @param cmd 接口访问地址 
 * @param data 接入参数
 */
function reqNewAjax(url, d) {
    var reData;
    $.ajax({
        type: "POST",
        url: "/zxcity-cms-new-ms/newms/" + url,
        dataType: "json",
        async: false,
        timeout: 5000,
        data: {
            "cmd": "",
            data: JSON.stringify(d),
            version: version
        },
        beforeSend: function(request) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
            layer.closeAll('loading');
            reData = re;
            if (re.code == "401") {
                layer.msg(re.msg);
                location.href = "login.html";
            }
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

// restful
function reqAjaxAsync(cmd, data, async, successfn) {
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
            layer.load(0, {
                shade: [0.1, '#fff']
            });
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

// newms
function reqNewAjaxAsync(url, data) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity-cms-new-ms/newms/" + url,
        dataType: "json",
        async: true, //默认为异步
        timeout: 5000,
        data: {
            "cmd": "",
            "data": JSON.stringify(data) || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(res) {
            layer.closeAll('loading');
            defer.resolve(res);
            if (res.code == "401") {
                layer.msg(res.msg);
                location.href = "login.html";
            }
        },
        error: function(err) {
            layer.closeAll('loading');
            defer.reject(err);
            layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}

function reqauthAjaxAsync(url, data, async) {
    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/" + url,
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": "",
            "data": JSON.stringify(data) || "",
            "version": version
        },
        beforeSend: function(request) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
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

//获取城市列表和领域列表
function getCity(provinceDom, cityDom) {
    reqNewAjaxAsync("provinces", {
        'code': '0'
    }).done(function(re) {
        if (re.code != 1) {
            layer.msg(re.msg);
            return false;
        }
        var province = re.data || [];
        var provinceHtml = '';
        for (var p = 0; p < province.length; p++) {
            provinceHtml += '<option value="' + province[p].code + '">';
            provinceHtml += province[p].areaname;
            provinceHtml += '</option>';
        }
        provinceDom.append(provinceHtml);
        provinceDom.on("change", function() {
            var pid = provinceDom.val();
            if (isNull(pid)) {
                cityDom.val("");
            }
            showCity(provinceDom, cityDom);
        });
    });
}

function showCity(provinceDom, cityDom) {
    var pid = provinceDom.val();
    cityDom.html('<option value="">请选择</option>');
    if (isNull(pid)) {
        return false;
    }
    reqNewAjaxAsync("provinces", {
        'code': pid
    }).done(function(re) {
        if (re.code != 1) {
            layer.msg(re.msg);
            return false;
        }
        var city = re.data || [];
        var cityHtml = '';
        for (var c = 0; c < city.length; c++) {
            cityHtml += '<option value="' + city[c].code + '">';
            cityHtml += city[c].areaname;
            cityHtml += '</option>';
        }
        cityDom.append(cityHtml);
    });
}

/**
 * @desc 将时间戳转换为YYYY.MM.DD格式
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
    return d.getFullYear() + "." + month + "." + day;
}

function format(d, fmt) {
    if (!fmt) fmt = 'yyyy-MM-dd'
    var date = new Date(d)
    if (date === 'Invalid Date') return ''
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt;
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

//获取审核状态
function getExamine() {
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
            $('select[name="examineType"]').append(scriptionTypeListHtml);
        }
    });
}

//获取权限状态：
function getAuthority() {
    var res = reqNewAjax('SelectAdministrators', {
        available: 1
    });
    if (res.code == 9) {
        layer.msg(res.msg);
        return false;
    }
    var getAuthorityList = res.data || [];
    if (getAuthorityList.length > 0) {
        var authorityTypeHtml = ''
        for (i = 0; i < getAuthorityList.length; i++) {
            authorityTypeHtml += '<option value="' + getAuthorityList[i].uId + '">';
            authorityTypeHtml += getAuthorityList[i].name;
            authorityTypeHtml += '</option>';
        }
        $('select[name="authorityType"]').append(authorityTypeHtml);
    }
}

//获取绑定用户下拉框：
function getAllUser(data, select) {
    var res = reqNewAjax('selectAllSub', data);
    if (res.code != 1) {
        layer.msg(res.msg);
        return false;
    }
    var getAuthorityList = res.data || [];
    if (getAuthorityList.length > 0) {
        var authorityTypeHtml = '<option value="">可搜索选择</option>';
        for (i = 0; i < getAuthorityList.length; i++) {
            authorityTypeHtml += '<option value="' + getAuthorityList[i].userId + '">';
            authorityTypeHtml += getAuthorityList[i].subscriptionName;
            authorityTypeHtml += '</option>';
        }
        $(select).html(authorityTypeHtml);
    }
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
    layer.load(0, {
        shade: [0.1, '#fff']
    });
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        serverUrl = '/zxcity-cms-new-ms/newms/ossUpload';
        xmlhttp.onreadystatechange = callbacksuccess;
        xmlhttp.open("POST", serverUrl, false);
        layer.closeAll('loading');
        xmlhttp.send(null);

        function callbacksuccess() {
            layer.closeAll('loading');
            if (xmlhttp.status == 200) {
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
    return random_string(32) + importUrl;
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
        'signature': uploadJson.signature,
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
        obj = [{
            title: "files",
            extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv"
        }]
    } else {
        obj = [{
            title: "Image files",
            extensions: "jpg,gif,png,bmp"
        }, {
            title: "Zip files",
            extensions: "zip,rar"
        }];
    }
    return obj;
}

//上传OSS
function uploadOss(data) {
    var uploaderLabel = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: data.btn,
        //multi_selection: false, 
        // container: document.getElementById(data.dom),
        flash_swf_url: '../assets/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: '../assets/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: filter(data),
            max_file_size: data.size || "10mb", //最大只能上传10mb的文件
            prevent_duplicates: false //不允许选取重复文件
                // prevent_duplicates: true //不允许选取重复文件
        },
        //分片上传文件时，每片文件被切割成的大小，为数字时单位为字节。也可以使用一个带单位的字符串，如"200kb"。当该值为0时表示不使用分片上传功能
        // chunk_size: "5mb",
        init: {
            PostInit: function() {
                if (data.flag == "sendLocal") {
                    $("#ossfile").html("");
                }
            },
            FilesAdded: function(up, files) {
                set_upload_param(uploaderLabel, '', false);
                if (data.flag == "sendLocal") {
                    plupload.each(files, function(file) {
                        $("#ossfile").html('<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
                            '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
                            '</div>');
                    });
                } else if (data.flag == "video") {
                    plupload.each(files, function(file) {
                        document.getElementById('videoProgress').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
                            '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
                            '</div>';
                    });
                }
            },
            BeforeUpload: function(up, file) {
                check_object_radio();
                set_upload_param(up, file.name, true);
            },
            UploadProgress: function(up, file) {
                if (data.flag == "sendLocal" || data.flag == "video") {
                    var d = document.getElementById(file.id);
                    $("b").html('<span>' + file.percent + "%</span>");
                    var prog = $("div").eq(0);
                    var progBar = prog.find('div').eq(0);
                    progBar.css({
                        width: file.percent + "%"
                    }).attr('aria-valuenow', file.percent);
                }
            },
            FileUploaded: function(up, file, info) {
                if (info.status == 200) {
                    if (data.flag == "reg") {
                        return regCallback(file, data);
                    } else if (data.flag == "send") {
                        return sendCallback(file, data);
                    } else if (data.flag == "sendLocal") {
                        return sendLocalCallback(file, data);
                    } else {
                        console.log("请传递标记");
                    }
                } else {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                }
            },

            Error: function(up, err) {
                if (err.code == -600) {
                    layer.msg("选择的文件过大");
                } else if (err.code == -601) {
                    layer.msg("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
                } else if (err.code == -602) {
                    layer.msg("这个文件已经上传过一遍了");
                } else {
                    layer.msg("系统繁忙，请稍后再试!");
                    console.log(err.response);
                }
            }
        }
    });
    uploaderLabel.init();
}

//发表多图本地上传回调
function sendLocalCallback(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    localStorage.setItem("urls", urls);
    var img = "<img src='" + urls + "' style='max-width:400px;' />";
    $("#" + data.imgDom).html(img);
}

//发表页面编辑器上传回调
function sendCallback(file, data) {
    layer.msg("上传成功");
    var img, img2, width, height;
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var imgName = get_uploaded_object_name(file.name);
    imgName = imgName.substr(0, imgName.indexOf('.'));
    localStorage.setItem("urls", urls);
    img = "<img src='" + urls + "' class='editor_img' name='" + imgName + "'/>";
    var html = data.editor.html() + img;
    data.editor.html(html);
    //图片宽高
    img2 = "<img src='" + urls + "' class='editor_img mr10 mt10'  name='" + imgName + "' width='170' height='170'/>";
    data.imgArr.push(img2);
    localStorage.setItem("html", html);
    localStorage.setItem("imgArr", data.imgArr);
}

//初始化kindeditor
function kindInit() {
    var editor = KindEditor.create('#applicationform', {
        items: [
            "source", "|", "undo", "redo", "|", "preview", "code", "cut", "copy", "paste", "plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright", "justifyfull", "insertorderedlist", "insertunorderedlist", "indent", "outdent", "subscript", "superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/", "formatblock",
            "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold", "italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "images", "table", "hr", "anchor", "link", "unlink", "|", "about"
        ],
        resizeType: 1
    });
    return editor;
}

//获取分类下拉列表
function optionType(dom, num) {
    $.ajax({
        type: "POST",
        url: "/zxcity-cms-new-ms/newms/selectAllfield",
        dataType: "json",
        data: {
            "cmd": "",
            "data": {},
            "version": 1
        },
        beforeSend: function(res) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            res.setRequestHeader("apikey", apikey);
        },
        error: function() {
            layer.closeAll('loading');
            layer.msg("获取分类下拉列表失败,请稍后再试");
        },
        success: function(res) {
            layer.closeAll('loading');
            if (res.code == 1) {
                var data = res.data || "";
                $.each(res.data, function(i, v) {
                    if (num == "all") {
                        dom.append("<option value='" + $.trim(v.channelId) + "'>" + v.channelName + "</option>");
                    }
                    if (v.videoChannel == num) {
                        dom.append("<option value='" + $.trim(v.channelId) + "'>" + v.channelName + "</option>");
                    }
                });
            } else {
                layer.msg(res.msg);
            }
        }
    });
}

function checkBoxType(callback) {
    $.ajax({
        type: "POST",
        url: "/zxcity-cms-new-ms/newms/selectAllfield",
        dataType: "json",
        data: {
            "cmd": "",
            "data": {},
            "version": 1
        },
        beforeSend: function(res) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            res.setRequestHeader("apikey", apikey);
        },
        error: function() {
            layer.closeAll('loading');
            layer.msg("获取分类下拉列表失败,请稍后再试");
        },
        success: callback
    });
}

//获取所有的标签
function getQueryArticleLabelAjax(cmd, dom, zxSelected) {
    dom.html("");
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        data: {
            "cmd": cmd,
            "version": "1",
            "data": ""
        },
        beforeSend: function(res) {
            layer.load(0, {
                shade: [0.1, '#fff']
            });
            res.setRequestHeader("apikey", apikey)
        },
        success: function(res) {
            layer.closeAll('loading');
            if (res.code == 1) {
                var data = res.data || "";
                var btn = "";
                $.each(data, function(i, v) {
                    btn += '<button class="btn btn-default mr10 mt10 ' + zxSelected + '" labelId="' + v.labelId + '">' + v.labelName + '</button>';
                });
                dom.append(btn);
            } else {
                layer.msg(res.msg);
            }
        },
        error: function() {
            layer.closeAll('loading');
            layer.msg("获取所有标签失败,请稍后再试");
        }
    })
}

//文章标题按键事件
function getKeyup(txt, len) {
    txt.keyup(function() {
        var thisLen = $(this).val().length;
        len.text(thisLen);
    });
    txt.keyup();
}

//审核状态
function examine(d) {
    var str = "";
    switch (d) {
        case 0:
            str = "未通过";
            break;
        case 1:
            str = "已通过";
            break;
        case 2:
            str = "待审核";
            break;
        case 3:
            str = "屏蔽";
            break;
        case 4:
            str = "黑名单";
            break;
        default:
            str = "";
            break;
    }
    return str;
}

//个人企业类型
function releaseType(d) {
    var str = "";
    switch (d) {
        case 0:
            str = "个";
            break;
        case 1:
            str = "企";
            break;
        default:
            str = "";
            break;
    }
    return str;
}

// 置顶的类型
function getStickAll(d) {
    var str = "";
    if (d[0] == "1") {
        str += "<li>领域置顶</li>";
    }
    // if (d[1] == "1") {
    //     str += "<li>首页推荐</li>";
    // }
    if (d[2] == "1") {
        str += "<li>首页置顶</li>";
    }
    return str;
}

//小时转换为天数、月数和年
function switchDate(d) {
    if (d < 30) {
        d += '天';
    } else if (d % 30 == 0 && d / 30 < 12) {
        d = d / 30 + '个月';
    } else if (d < 360 && d > 30) {
        d = Math.floor(d / 30) + '个月零' + d % 30 + '天';
    } else if (d % 360 > 29 && (d % 360) % 30 == 0) {
        d = Math.floor(d / 360) + '年零' + Math.floor((d % 360) / 30) + '个月';
    } else if (d % 360 > 29 && (d % 360) % 30 != 0) {
        d = Math.floor(d / 360) + '年' + Math.floor((d % 360) / 30) + '个月零' + (d % 360) % 30 + '天';
    } else if (d % 360 == 0) {
        d = d / 360 + '年';
    } else if (d % 360 < 30) {
        d = Math.floor(d / 360) + '年零' + d % 360 + '天';
    } else {
        d = 0;
    }
    return d;
}

//禁止在限定的input中输入空格
function inhibitTrim(html) {
    $(html).on('keydown', function(e) {
        e = e || window.event;
        if (e.keyCode == 32) {
            event.returnValue = false;
        }
    })
}

//input字数超过限制做提醒：
function limitInpNum(html, num) {
    $(html).on('input', function() {
        if ($(this).val().length > num) {
            layer.msg('标签名称不能超过' + num + '个字');
        }
    })
}

//对字符串的所有空格做处理
function delTrim(str) {
    return str.replace(/\s+/g, '');
}

//验证input中输入的是否为数字：
function ExamInpNum(html) {
    $(html).on('keyup', function() {
        if (!(/(^[0-9]\d*$)/.test($(html).val()))) {
            $(html).val('');
        }
    })
}

//点击单选按钮进行操作：
function operateSinCheck(curr, singleCheck, allCheck, checkNum, totalNum) {
    $(curr).toggleClass('active');
    if ($(singleCheck).length == totalNum) {
        $(allCheck).addClass('active');
    } else {
        $(allCheck).removeClass('active');
    }
    $(checkNum).html($(singleCheck).length);
}

//点击全选按钮全部选中：
function operateAllCheck(curr, allCheck, singleCheck, checkNum) {
    $(curr).find(allCheck).toggleClass('active');
    if ($(curr).find(allCheck).hasClass('active')) {
        $(singleCheck).addClass('active');
    } else {
        $(singleCheck).removeClass('active');
    }
    $(checkNum).html($(singleCheck + '.active').length);
}

//点击选择按钮选择
function operateCheckBox(curr, icon, sibling, color) {
    $(curr).find(icon).toggleClass('active');
    $(curr).find(sibling).toggleClass(color);
}

//重置checkBox：
function resetCheck(MutilCheck, singleCheck, checkNam) {
    $(MutilCheck).removeClass('active');
    if ($(singleCheck + '.active')) {
        $(singleCheck).removeClass('active');
    }
    $(checkNam).html('0');
}

// 格式化文章内容img标签style
function formatImg(html) {
    var newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
        var match = match.replace(/style=\"(.*)\"/gi, '');
        return match;
    });
    return newContent;
}

//转换时间
function switchTime(d) {
    var str = '';
    if (!isNull(d)) {
        var date = Number(d);
        var hours = new Date(date).getHours() >= 10 ? new Date(date).getHours() : '0' + new Date(date).getHours();
        var minutes = new Date(date).getMinutes() >= 10 ? new Date(date).getMinutes() : '0' + new Date(date).getMinutes();
        var seconds = new Date(date).getSeconds() >= 10 ? new Date(date).getSeconds() : '0' + new Date(date).getSeconds();
        var getTime = hours + ':' + minutes + ':' + seconds;
        date = format(new Date(date));
        str = date + ' ' + getTime;
    } else {
        str = '';
    }
    return str;
}

//转换日期
function switchCalendar(d) {
    var str = '';
    if (!isNull(d)) {
        var date = Number(d);
        date = format(new Date(date));
        str = date;
    } else {
        str = '';
    }
    return str;
}

/**
 * 获取样式名称
 * 1 单图 2单图图文 3三图 4 视频
 */
function getStyleName(param) {
    switch (param) {
        case "1":
            return "单图";
            break;
        case "2":
            return "单图图文";
            break;
        case "3":
            return "三图";
            break;
        case "4":
            return "视频";
            break;
        default:
            return "";
            break;
    }
}

/**
 * 获取平台
 * 1001:管理后台 1002:商户后台 1003:作家后台
 */
function getPlatform(param) {
    switch (param) {
        case "1001":
            return "管理后台";
            break;
        case "1002":
            return "商户后台";
            break;
        case "1003":
            return "作家后台";
            break;
        default:
            return "";
            break;
    }
}

/**
 * 获取内外部广告名称
 * 2001 内部广告 2002 外部广告
 */
function getSourceType(param) {
    switch (param) {
        case "2001":
            return "APP内部广告";
            break;
        case "2002":
            return "APP外部广告";
            break;
        default:
            return "";
            break;
    }
}

// 获取广告位
function getvAdvStyleName(dom, param) {
    reqNewAjaxAsync("selectscCmsAdvStyleName", param).done(function(res) {
        if (res.code == 1) {
            $.each(res.data, function(i, v) {
                if (v.scCmsAdvPlacePlatForm != 1001) {
                    dom.append($("<option value='" + v.scCmsAdvPlaceId + "'>" + v.scCmsAdvPlaceName + "</option>"));
                }
            });
        } else {
            layer.msg(res.msg);
        }
    });
}