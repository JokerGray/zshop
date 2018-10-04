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
var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号

//ajax验证是否匹配key值
function isApikey(res) {
    if (res.code == 8) {
		console.log(res.msg)
    }
}

/**
 * 根据参数名获取地址栏URL里的参数
 */
function getQueryString(name) {
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
function reqNewAjax(cmd, d) {
    var reData;
    $.ajax({
        type: "POST",
        url: '/zxcity_restful/ws/rest',
        dataType: "json",
        async: false,
        data: {
            cmd: "cms_new/" + cmd,
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
//              location.href = "login.html";
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
            isApikey(re);
            reData = re;
            if (reData.code != 1) {
                layer.msg(reData.msg);
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
//          layer.load(0, {
//              shade: [0.1, '#fff']
//          });
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
//          layer.closeAll('loading');
            isApikey(data);
            defer.resolve(data);
        },
        error: function(err) {
//          layer.closeAll('loading');
//          layer.msg("系统繁忙，请稍后再试!");
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}

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
        serverUrl = '/zxcity_restful/ws/oss/ossUpload';
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
        suffix = filename.substring(pos);
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
    return "zx" + random_string(24) + importUrl;
}

function set_upload_param(up, filename, ret) {
    if (ret == false) {
        ret = get_signature()
    }
    g_object_name = uploadJson.key; //目录
    if (filename != '') {
		//suffix = get_suffix(filename) //得到后缀
        // calculate_object_name(filename) //得到本地或者随机名
        g_object_name = g_object_name + '/' + randomString(filename);
//      console.log(filename);
//      console.log(g_object_name);
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
            extensions: "jpg,png,bmp,jpeg"
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
        multi_selection: false, 
        container: document.getElementById(data.imgDom),
        flash_swf_url: '../plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: '../plupload-2.1.2/js/Moxie.xap',
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
            	//微信内嵌浏览器兼容
            	$('.uploads input').attr('accept','image/*');
//              if (data.flag == "sendLocal") {
//                  document.getElementById('ossfile').innerHTML = '';
//              } else if (data.flag == "video") {
//                  document.getElementById('videoProgress').innerHTML = '';
//              }
            },
            FilesAdded: function(up, files) {
                set_upload_param(uploaderLabel,'', false);
//              if (data.flag == "sendLocal") {
//                  document.getElementById(data.btn).disabled = true;
//                  plupload.each(files, function(file) {
//                      document.getElementById('ossfile').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
//                          '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
//                          '</div>';
//                  });
//              } else if (data.flag == "video") {
//                  document.getElementById(data.btn).disabled = true;
//                  plupload.each(files, function(file) {
//                      document.getElementById('videoProgress').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
//                          '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
//                          '</div>';
//                  });
//              }
            },
            BeforeUpload: function(up, file) {
//          	console.log(file);
                check_object_radio();
                set_upload_param(up, file.name, true);
            },
            UploadProgress: function(up, file) {
            	layer.load(1, {
				  shade: [0.1,'#fff'] //0.1透明度的白色背景
				});
//              if (data.flag == "sendLocal" || data.flag == "video") {
//                  var d = document.getElementById(file.id);
//                  d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
//                  var prog = d.getElementsByTagName('div')[0];
//                  var progBar = prog.getElementsByTagName('div')[0];
//                  progBar.style.width = file.percent + "%";
//                  // progBar.style.width = 2 * file.percent + 'px';
//                  progBar.setAttribute('aria-valuenow', file.percent);
//              }
            },
            FileUploaded: function(up, file, info) {
                if (info.status == 200) {
                    if (data.flag == "reg") {
                    	layer.closeAll('loading');
                        return regCallback(file, data);
//                  } else if (data.flag == "send") {
//                      return sendCallback(file, data);
//                  } else if (data.flag == "sendLocal") {
//                      document.getElementById(data.btn).disabled = false;
//                      return sendLocalCallback(file, data);
//                  } else if (data.flag == "sendLocals") {
//                      document.getElementById(data.btn).disabled = false;
//                      return sendLocalCallbacks(file, data);
//                  } else if (data.flag == "video") {
//                      document.getElementById(data.btn).disabled = false;
//                      return sendVideoCallback(file, data);
//                  } else if (data.flag == "add") {
//                      return sendAddImageCallback(file, data);
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
                    var u = navigator.userAgent;
					var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                    if(isiOS==true){
                    	layer.msg("不支持该格式文件上传,可能是系统版本过低,请更新最新版本");
                    }else{
                    	layer.msg("不支持该格式文件上传");
                    }
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


//上传回调(返回上传地址)
function regCallback(file, data) {
    layer.msg("上传成功");
    //获取文件后缀名
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    console.log(urls);
    sessionStorage.setItem('src',urls);
    $('#upload').css('background-image','url('+urls+')');
//  var imgName = file.name;
//  imgName = imgName.substr(0, imgName.indexOf('.'));
//  var img = new Image();
//  var fr = new mOxie.FileReader();
//  img.onload = function() {
//      this.onload = null;
//      document.getElementById(data.imgDom).setAttribute("src", urls);
//  };
//  img.src = urls;
}

//发表页面编辑器上传回调
function sendCallback(file, data) {
    layer.msg("上传成功");
    var img, img2, width, height;
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var imgName = get_uploaded_object_name(file.name);
    imgName = imgName.substr(0, imgName.indexOf('.')).replace("user-dir/", "");
    localStorage.setItem("urls", urls);
    img = "<img src='" + urls + "' class='editor_img " + imgName + "' />";
    console.log(imgName);
    var html = data.editor.html() + img;
    data.editor.html(html);
    //图片宽高
    img2 = "<img src='" + urls + "' class='editor_img" + imgName + "' width='170' height='170' style='margin:20px;'/>";
    data.imgArr.push(img2);
    var userId = sessionStorage.getItem("userId") || "";
    var editorTxt = sessionStorage.setItem("editorTxt_" + userId, html);
    sessionStorage.setItem("html", html);
    sessionStorage.setItem("imgArr", data.imgArr);
}

//发表页面本地上传回调
function sendLocalCallback(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    localStorage.setItem("urls", urls);
    var img = "<img src='" + urls + "' class='editor_img' width='170' height='170' style='margin:20px;' />";
    document.getElementById(data.imgDom).innerHTML = img;
}

//发表多图本地上传回调
function sendLocalCallbacks(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    localStorage.setItem("urls", urls);
    var img = "<img src='" + urls + "' class='editor_img' width='170' height='170' style='margin:20px;' />";
    $("#" + data.imgDom).append(img);
}

//上传视频
function sendVideoCallback(file, data) {
    layer.msg("上传成功");
    var videoUrls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var videoName = get_uploaded_object_name(file.name);
    videoName = videoName.substr(0, videoName.indexOf('.'));
    $("#videoHide").html($("<video src='" + videoUrls + "' controls='controls' style='max-width:950px;'></video>"))
    sessionStorage.setItem("videoUrls", videoUrls);
}

//图集添加图片
function sendAddImageCallback(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var imgName = get_uploaded_object_name(file.name);
    var str = '';
    str += '<div class="atlas-upload"><ul class="clearfix atlas-item"><li class="img">';
    str += '<img class="editor_img" src="' + urls + '" width="110" height="110"  name="' + imgName + '" /></li><li class="imgdesc"><textarea class="form-input" name="imgdesc" placeholder="图片描述(不超过200个字)"></textarea></li>';
    str += '<li class="imgoperate"><a><i class="fa fa-trash-o fa-2x" name="delI"></i></a>';
    str += '</li></ul></div>';
    $('#ossfile2').append(str);
    // document.getElementById('ossfile2').innerHTML += '<div class="atlas-upload"><ul class="clearfix atlas-item"><li class="img">' +
    //     '<img src="' + urls + '" width="110" height="110"  name="' + imgName + '" /></li><li class="imgdesc"><textarea class="form-input" name="imgdesc" placeholder="图片描述(不超过200个字)"></textarea></li>' +
    //     '<li class="imgoperate"><a><i class="fa fa-image fa-2x"></i></a><a><i class="fa fa-trash-o fa-2x" name="delI"></i></a><a><i class="fa fa-bars fa-2x"></i></a>' +
    //     '</li></ul></div>';
}