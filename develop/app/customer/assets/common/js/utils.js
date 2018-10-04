// 工具类
//获取缓存 通行证码
var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');
//获取缓存 版本号
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');

//获取地址栏参数列表
function getParams(){
    var url = location.search;
    var params = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
}

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

//ajax请求
function reqAjax(cmd, data){
    var reData;
    data = data.replace(/([\ud800-\udbff][\u0000-\uffff])/g,'');
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: false,//同步
        data: {
            "cmd": cmd,
            "data": data,
            "version": version
        },
        beforeSend: function(request){
            request.setRequestHeader("apikey", apikey);
        },
        success: function(re){
            reData = re;
        },
        error: function(re){
            var str1 = JSON.stringify(re);
            re.code = 9;
            re.msg = str1;
            reData = re;
        }
    });
    return reData;
}


function reqAjaxAsync(cmd, data, async, successfn) {
    data = data.replace(/([\ud800-\udbff][\u0000-\uffff])/g,'');
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
            layer.load(2, {
                shade: [0.1, '#fff'],
                zIndex:20000001
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


function isVisible(obj){
    var ret = true;
    if(obj.style.display === "none"){
        ret = false;
    }
    return ret;
}


function backZxcityStoreApp(){
    var ua = navigator.userAgent;
    if(ua.match(/iPhone|iPod/i) != null){
        document.location = 'backZxcityStoreApp://';
    }else if(ua.match(/Android/i) != null){
        document.location = 'intent:com.cnblogs.cn.client.android;end';
    }else if(ua.match(/iPad/i) != null){
        document.location = 'backZxcityStoreApp://';
    }
}

function getStringFomat(str){
    return str == null ? "-" : str;
}

/**
 * 脚本注入校验* @param s * @returns
 */
function replaceHtmlCommon(s){
    var str = s.replace(/(?:<[\/a-zA-Z]+[1-6]{0,1}\s*[^<|>]*(?:>)|%3C[\/a-zA-Z]+[1-6]{0,1}\s*[^%3C|%3E]*(?:%3E))/g, function() {
        return arguments[0].replace(/(?:(<)([\/a-zA-Z]+[1-6]{0,1}\s*[^<|>]*)(?:(>))|(%3C)([\/a-zA-Z]+[1-6]{0,1}\s*[^%3C|%3E]*)(?:(%3E)))/g, "%26lt;$2%26gt;");
    });
    return str;
}

function formatAllDate(date, _formate){
    var paddNum = function(num){
        num += "";
        return num.replace(/^(\d)$/,"0$1");
    };
    //指定格式字符
    var cfg = {
        yyyy : date.getFullYear(), //年 : 4位
        yy : date.getFullYear().toString().substring(2),//年 : 2位
        M  : date.getMonth() + 1,  //月 : 如果1位的时候不补0
        MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
        d  : date.getDate(),   //日 : 如果1位的时候不补0
        dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
        hh : paddNum(date.getHours()),  //时
        mm : paddNum(date.getMinutes()), //分
        ss : paddNum(date.getSeconds()) //秒
    };
    var format = _formate ? _formate : "yyyy-MM-dd hh:mm:ss";
    return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
}

//比较两个日期的大小  startdate：较近的日期  enddate：较远的日期
function compareDate(startdate,enddate){
    var arr=startdate.split("-");
    var starttime=new Date(arr[0],arr[1],arr[2]);
    var starttimes=starttime.getTime();

    var arrs=enddate.split("-");
    var lktime=new Date(arrs[0],arrs[1],arrs[2]);
    var lktimes=lktime.getTime();

    if(starttimes>=lktimes){
        return false;
    }else{
        return true;
    }
}

//求两个时间的天数差 日期格式为 YYYY-MM-dd
function daysBetween(DateOne,DateTwo){
    var OneMonth = DateOne.substring(5,7);
    var OneDay = DateOne.substring(8,11);
    var OneYear = DateOne.substring(0,DateTwo.indexOf ('-'));

    var TwoMonth = DateTwo.substring(5,7);
    var TwoDay = DateTwo.substring(8,11);
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
    return Math.abs(cha);
}

//计算两个时间的时间差
function between(date1,date2){
    date1 = date1.replace(new RegExp("-","gm"),"/");
    date2 = date2.replace(new RegExp("-","gm"),"/");
    var date3 = Math.abs(new Date(date2).getTime()-new Date(date1).getTime());  //时间差的毫秒数

    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));

    //计算出小时数
    var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));

    //计算相差分钟数
    var leave2=leave1%(3600*1000);       //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));

    //计算相差秒数
    var leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);

    var difObj = {
        'days':days,
        'hours':hours,
        'minutes':minutes,
        'seconds':seconds
    };

    return difObj;
}

//设置分页插件
function pagingInit(options) {
    //target,total,pageSize,fn,current=1
    //target:目标元素class或者id
    //total:数据条目总数
    //pageSize:每页显示数据的条目数
    //current:默认页码
    //fn:执行的回调函数
    $(options.target).html('');
    if(options.total>options.pageSize){
        var p = new Paging();
        p.init({
            target:options.target,
            pagesize:options.pageSize,
            count:options.total,
            prevTpl:'',
            nextTpl:'',
            current:options.current,
            callback:function (page, size, count) {
                options.fn(page,size,count)
            }
        });
    }
}

//设置日期选择插件
//单独日期选择
function initDate(domName, format, callback) {
    $(domName).jeDate({
        skinCell:'mystyle',
        format: format,//日期显示格式
        isTime: false,//是否显示时间
        isClear: false,//是否显示清空按钮
        onClose: false,//选中日期后是否关闭弹窗，false为关闭弹窗
        isinitVal: true,//是否初始化时间
        isToday: true,//是否显示今天按钮
        isok: false,//是否显示确定按钮
        maxDate: $.nowDate(0),
        choosefun: function (elem, val, date) {
            callback ? callback(elem, val, date) : null
        }
    })
}
// 日期联动
function dateLinkage(startDom,endDom,format,minDate) {
    // $(endDom).attr('disabled','disabled');
    var start = {
        skinCell:'mystyle',
        format: format,
        minDate: minDate||'', //设定最小日期为当前日期
        isinitVal: true,
        festival: false,
        ishmsVal: false,
        isClear: false,
        isToday: true,
        isok: false,
        maxDate: $.nowDate(0), //最大日期
        choosefun: function (elem, datas) {
            // $(endDom).attr('disabled',false);
            end.minDate = datas; //开始日选好后，重置结束日的最小日期
            endDates()
        }
    };
    var end = {
        skinCell:'mystyle',
        format: format,
        minDate: minDate||'', //设定最小日期为当前日期
        festival: false,
        isinitVal: true,
        isClear: false,
        isToday: true,
        isok: false,
        maxDate: $.nowDate(0), //最大日期
        choosefun: function (elem, datas) {
            start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
        }
    };
    //这里是日期联动的关键
    function endDates() {
        //将结束日期的事件改成 false 即可
        // end.trigger = false;
        $(endDom).jeDate(end);
    }
    $(startDom).jeDate(start);
    $(endDom).jeDate(end);
}