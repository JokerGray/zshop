/**
 * author   robin
 * name     public javascript
 * project  pc zxcity toutiao
 * date     2017/8/11
 */
var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
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
var laytpl = layui.laytpl,
    layer = layui.layer;

//jq 序列化转换json 
$.fn.serializeJson = function() {
    var serializeObj = {};
    var array = this.serializeArray();
    var str = this.serialize();
    $(array).each(function() {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
}

//校验正则表达式
function reg(val, exp) {
    if (!exp.test(val)) {
        return false;
    } else {
        return true;
    }
}

//判断手机正则
function is_mobile(val) {
    return reg(val, mobileExp);
}
//判断密码正则
function is_password(val) {
    return reg(val, passwordExp);
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
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}

/**
 * @param 中文转码
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString2(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return "";
}

//ajax deferred
function reqAjaxAsync(cmd, data, async) {
    var defer = $.Deferred();
    var d = isNull(data) ? "" : JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": cmd,
            "data": d,
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

/** 针对瀑布流滑动请求事件
 *	d.last 父盒子中最后一个子元素
 *	callback 操作
 */
function waterfall(d, callback) {
    if (d.last.length > 0) {
        var obj = {
            last: d.last.offset().top + d.last.height() / 2,
            top: $(window).scrollTop(),
            h: $(window).height()
        };
        if (obj.last < (obj.h + obj.top)) {
            return d.end ? false : callback();
        }
    }
}

// 转换时间戳为字符串
function getTimeStr(currTime, createTime) {
    var createTime = Date.parse(new Date(createTime));
    var timeInterval = parseInt((currTime - createTime) / 1000);
    var result = "";
    var temp = "";
    if (timeInterval < 60) {
        result = "刚刚";
    } else if ((temp = timeInterval / 60) < 60) {
        result = parseInt(temp) + "分钟前";
    } else if ((temp = temp / 60) < 24) {
        result = parseInt(temp) + "小时前";
    } else if ((temp = temp / 24) < 30) {
        result = parseInt(temp) + "天前";
    } else if ((temp = temp / 30) < 12) {
        result = parseInt(temp) + "个月前";
    } else {
        result = parseInt(temp / 12) + "年前";
    }
    return result;
}

/**
 * @desc 将时间戳转换为YYYY-MM-DD HH:ii:ss
 * @access public
 * @param
 * @return string
 */
function getDates(times) {
    Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + "/ " + (this.getHours() < 10 ? "0" + this.getHours() : this.getHours()) + ":" + (this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes()) + ":" + (this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds());
    };
    var unixTimestamp = new Date(times) ;
    commonTime = unixTimestamp.toLocaleString();
    return commonTime;
}

//阻止冒泡
function stopPropagation(e) {
    e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

//获取右侧数据
function rPublish(url, d, tpl, listHtml) {
    reqAjaxAsync(url, d).done(function(res) {
        var data = res.data;
        if (res.code == 1) {
            if (!isNull(data)) {
                var getTpl = $(tpl).html();
                laytpl(getTpl).render(data, function(html) {
                    $(listHtml).html(html);
                });
            }
        } else {
            layer.msg(res.msg);
        }
    })
}

//获取导航列表
function getChannel(d) {
    var nav = localStorage.getItem("nav") || "首页";
    var more = localStorage.getItem("more") || "";
    var navNum = 8;
    var moreNum = navNum + 4;
    var data = {
        videoChannel: d.num
    };
    var cVideo = '视频';
    reqAjaxAsync(d.url, data).done(function(res) {
        if (res.code == 1) {
            if (!isNull(res.data)) {
                var li = "";
                li += '<li class="active"><a href="index.html">首页</a></li>';
                li += '<li><a href="hot.html">热点</a></li>';
                li += '<li><a href="videoList.html">视频</a></li>';
                li += '<li><a href="image.html">图片</a></li>';
                //TODO
                for (var i = 0; i < navNum; i++) {
                    // li += '<li><a href="' + res.data[i].iconUrl + '.html">' + res.data[i].channelName + '</a></li>';
                    li += '<li><a href="articleList.html?id='+ res.data[i].channelId +'">' + res.data[i].channelName + '</a></li>';
                }
                if (res.data.length > navNum) {
                    li += '<li class="more">';
                    li += '<a href="javascript:;">更多</a>';
                    li += '<div class="nav_box">';
                    var len = res.data.length > navNum + moreNum ? navNum + moreNum : res.data.length;
                    for (var i = navNum; i < len; i++) {
                        li += '<a href="articleList.html?id='+ res.data[i].channelId +'">' + res.data[i].channelName + "</a>";
                    }
                    li += '</div>';
                    li += '</li>';
                }
                d.dom.html(li);
                d.dom.find("li").each(function(i, v) {
                    var htm = $(v).find("a").html();
                    if (nav == htm) {
                        d.dom.find("li").removeClass("active");
                        $(this).addClass("active");
                    }
                });
                d.dom.find("li.more .nav_box a").each(function(i, v) {
                    var htm = $(v).html();
                    if (more == htm) {
                        d.dom.find("li.more .nav_box a").removeClass("active");
                        $(this).addClass("active");
                    }
                });
            }
        } else {
            layer.msg(res.msg);
        }
    });
}

// 返回当前元素距离页面的
function elOffset(elem) {
    var left = 0,
        top = 0,
        offsetParent = elem;

    while (offsetParent != null && offsetParent != document.body) {
        left += offsetParent.offsetLeft;
        top += offsetParent.offsetTop;

        offsetParent = offsetParent.offsetParent;
    }

    return {
        left: left,
        top: top
    };
}

/**
 * xx时间以前
 */
function timeAgo(date) {
    if (date != +date) return '';

    if (typeof date !== 'object') {
        date = new Date(date * 1000);
    }

    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        intervalType = '年';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = '月';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = '天';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = '小时';
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = '分钟';
                    } else {
                        interval = seconds;
                        intervalType = '秒';
                    }
                }
            }
        }
    }

    return intervalType === '秒' ? '刚刚' : interval + intervalType + '前';
}


/**
 * 数字格式转换
 */
function numFormat(number) {
    if (number != +number) return '';

    var sy = Math.pow(10, 9);
    var y = Math.pow(10, 8);
    var qw = Math.pow(10, 7);
    var sw = Math.pow(10, 5);
    var w = Math.pow(10, 4);
    var q = Math.pow(10, 3);
    var flag = '',
        value;

    if (number - sy >= 0) {
        // >=10亿，向下取整
        flag = '亿';
        value = Math.floor(number / y);
    } else if (number - y >= 0) {
        // 1亿=< 且 <10亿,取一位小数向下取整
        flag = '亿';
        value = (Number(Math.floor(number / qw) / 10).toFixed(1) + '').replace(/\.0$/, '');
    } else {
        if (number - sw > 0) {
            // 10万=< 且 <1亿，向下取整
            flag = '万';
            value = Math.floor(number / w);
        } else if (number - w >= 0) {
            // 1.1万=< 且 <10万取一位小数向下取整
            flag = '万';
            value = (Number(Math.floor(number / q) / 10).toFixed(1) + '').replace(/\.0$/, '');
        } else {
            // <1万，原样输出
            value = number;
        }
    }

    return value + flag;
}

// 视频时长格式转换
function durationFormat(duration) {
    if (duration != +duration) return '';

    var res = [],
        tmp;

    if (duration / 3600 >= 1) {
        tmp = Math.floor(duration / 3600);
        duration -= tmp * 3600;
        res.push(tmp);
    }

    if (duration / 60 >= 1) {
        tmp = Math.floor(duration / 60);
        duration -= tmp * 60;
        if (tmp < 10) tmp = '0' + tmp;
        res.push(tmp);
    } else {
        res.push('00');
    }

    if (duration < 10) duration = '0' + duration;
    res.push(duration);

    return res.join(':');
}

// 获取窗口大小
function getWinSize() {
    if (window.innerHeight && window.innerWidth) {
        return {
            winWidth: window.innerWidth,
            winHeight: window.innerHeight
        }
    }
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        return {
            winWidth: document.documentElement.clientWidth,
            winHeight: document.documentElement.clientHeight
        }
    }
}

// 获取当前滚动的高度
function getScrollTop(element) {
    if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
    }

    return element.scrollTop;
}

// 原生封装添加class
function addClass(elem, cls) {
    if (!hasClass(elem, cls)) {
        elem.className = elem.className === '' ? cls : elem.className + ' ' + cls
    }
}

// 原生封装删除class
function removeClass(elem, cls) {
    if (hasClass(elem, cls)) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' '
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ')
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '')
    }
}

// 原生封装是否存在此class
function hasClass(elem, cls) {
    cls = cls || ''
    if (cls.replace(/\s/g, '').length === 0) return false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}

// 动态生成script标签
function loadScript(url, resolve, reject) {
    var script = document.createElement('script');
    script.src = url;
    // script.crossOrigin = 'anonymous';
    script.onload = function() {
        resolve && resolve.call();
    };
    script.onerror = function() {
        reject && reject.call();
    };
    document.body.appendChild(script);
}

// 添加页面加载事件
function addWinLoadEvent(func) {
    var oldOnLoad = window.onload;
    if (typeof window.onload !== 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldOnLoad();
            func();
        }
    }
}

// 格式化图片内style标签
function formatImg(html) {
    var newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
        var match = match.replace(/style=\"(.*)\"/gi, '');
        return match;
    });
    return newContent;
}

//作家类型
function authorType(num) {
    var str = '';
    switch (num) {
        case 1:
            str = "新手期作者";
            break;
        case 2:
            str = "普通作者";
            break;
        case 3:
            str = "原创作者";
            break;
        case 4:
            str = "加V作者";
            break;
        case 5:
            str = "签约作者";
            break;
    }
    return str;
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
            max_file_size: data.size || "50mb", //最大只能上传50mb的文件
            prevent_duplicates: false //不允许选取重复文件
                // prevent_duplicates: true //不允许选取重复文件
        },
        //分片上传文件时，每片文件被切割成的大小，为数字时单位为字节。也可以使用一个带单位的字符串，如"200kb"。当该值为0时表示不使用分片上传功能
        // chunk_size: "5mb",
        init: {
            PostInit: function() {
                if (data.flag == "sendLocal") {
                    document.getElementById('ossfile').innerHTML = '';
                } else if (data.flag == "video" || data.flag == "editorVideo" || data.flag == "cover") {
                    document.getElementById('videoProgress').innerHTML = '';
                }
            },
            FilesAdded: function(up, files) {
                set_upload_param(uploaderLabel, '', false);
                if (data.flag == "sendLocal") {
                    document.getElementById(data.btn).disabled = true;
                    plupload.each(files, function(file) {
                        document.getElementById('ossfile').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
                            '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
                            '</div>';
                    });
                } else if (data.flag == "video" || data.flag == "editorVideo" || data.flag == "cover") {
                    document.getElementById(data.btn).disabled = true;
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
                if (data.flag == "sendLocal" || data.flag == "video" || data.flag == "editorVideo" || data.flag == "cover") {
                    var d = document.getElementById(file.id);
                    d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    var prog = d.getElementsByTagName('div')[0];
                    var progBar = prog.getElementsByTagName('div')[0];
                    progBar.style.width = file.percent + "%";
                    progBar.setAttribute('aria-valuenow', file.percent);
                    // progBar.style.width = 2 * file.percent + 'px';
                }
            },
            FileUploaded: function(up, file, info) {
                if (info.status == 200) {
                    if (data.flag == "reg") {
                        return regCallback(file, data);
                    } else if (data.flag == "send") {
                        return sendCallback(file, data);
                    } else if (data.flag == "sendQues") {
                        return sendCallbackQues(file, data);
                    } else if (data.flag == "sendVote") {
                        return sendCallbackVote(file, data);
                    } else if (data.flag == "editorVideo") {
                        return sendEditorVideoCallback(file, data);
                    } else if (data.flag == "cover") {
                        return sendVideoCoverCallback(file, data);
                    } else if (data.flag == "sendLocal") {
                        document.getElementById(data.btn).disabled = false;
                        return sendLocalCallback(file, data);
                    } else if (data.flag == "sendLocals") {
                        document.getElementById(data.btn).disabled = false;
                        return sendLocalCallbacks(file, data);
                    } else if (data.flag == "video") {
                        document.getElementById(data.btn).disabled = false;
                        return sendVideoCallback(file, data);
                    } else if (data.flag == "add") {
                        return sendAddImageCallback(file, data);
                    } else if (data.flag == "playerIcon") {
                        document.getElementById(data.btn).disabled = false;
                        return sendPlayerIconCallback(file, data);
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
                    layer.msg("选择的文件后缀不对");
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


//配置
function filter(data) {
    var obj = "";
    if (data.flag == "video" || data.flag == "editorVideo") {
        obj = [{
            title: "files",
            extensions: "mpg,mp4"
                // extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv"
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

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length; i++) {
        if (tt[i].checked) {
            g_object_name_type = tt[i].value;
            break;
        }
    }
}

//发表页面编辑器上传回调
function sendCallbackQues(file, data) {
    layer.msg("上传成功");
    var img, img2, width, height;
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var imgName = get_uploaded_object_name(file.name);
    imgName = imgName.substr(0, imgName.indexOf('.')).replace("user-dir/", "");
    localStorage.setItem("urls", urls);
    img = "<img src='" + urls + "' class='editor_img " + imgName + "' />";
    data.editor.insertHtml(img);
    var html = data.editor.html();
    //图片宽高
    img2 = "<img src='" + urls + "' class='editor_img" + imgName + "' width='170' height='170' style='margin:20px;'/>";
    data.imgArr.push(img2);
    var userId = localStorage.getItem("userId") || "";
    var editorTxt = localStorage.setItem("q_editorTxt_" + userId, html);
    localStorage.setItem("html", html);
    localStorage.setItem("imgArr", data.imgArr);
}