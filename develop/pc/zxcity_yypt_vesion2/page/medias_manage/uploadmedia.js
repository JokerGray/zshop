accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
expire = 0
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000;
imageArr = [];
//function getHP() {
//  return "http://192.168.3.42:8080/";
//}
//向php服务器发送请求
function send_request() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        serverUrl = '/zxcity_restful/ws/dazzle/ossUpload';
        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        return xmlhttp.responseText
    }
    else {
        alert("Your browser does not support XMLHTTP.");
    }
};

//设置上传的文件名是否随机
function check_object_radio() {
    //  得到上传文件名类型按钮的值
    g_object_name_type = "random_name";

}

function get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
        //      body是后台请求拿到的xml值
        body = send_request()
        var obj = eval("(" + body + ")");
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callback']
        key = obj['dir']
        return true;
    }
    return false;
};

//设置一个一定长度的随机字符串
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

//获取文件名后缀
function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

//生成一个随机文件名
function calculate_object_name(filename) {
    if (g_object_name_type == 'local_name') {
        g_object_name += "${filename}"
    }
    else if (g_object_name_type == 'random_name') {
        suffix = get_suffix(filename)
        g_object_name = key + random_string(10) + suffix
    }
    return ''
}
//获得上传文件名
function get_uploaded_object_name(filename) {
    if (g_object_name_type == 'local_name') {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }
    else if (g_object_name_type == 'random_name') {
        return g_object_name
    }
}
//设置上传参数
function set_upload_param(up, filename, ret) {
    console.log(host);
    if (ret == false) {
        ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': callbackbody,
        'signature': signature,
    };
    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });
    up.start();
}

//格式化视频长度
function formatSeconds(value) {
    var theTime = parseInt(value); // 秒
    var theTime0 = 0; //秒
    var theTime1 = 0; //分
    var theTime2 = 0; //小时
    theTime0 = parseInt(theTime % 60);
    if (theTime > 3600) {
        theTime1 = parseInt(theTime / 60 % 60);
        theTime2 = parseInt(theTime / 60 / 60);
    } else {
        theTime1 = parseInt(theTime / 60);
    }
    var result = "" + parseInt(theTime0);
    if (theTime0 < 10) {
        result = "0" + result;
    }
    result = "" + parseInt(theTime1) + ":" + result;
    if (theTime1 < 10) {
        result = "0" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + ":" + result;
        if (theTime2 < 10) {
            result = "0" + result;
        }
    }
    return result;
}

function ossUpload(btnid, $showBox, upType,callback) {
    var uploadFilter = {};
    // 根据上传类型配置
    if (upType == 'music') {
        uploadFilter = {
            mime_types: [ //只允许上传图片和zip,rar文件
                { title: "files", extensions: "mp3" }
            ],
            max_file_size: '20mb',
            prevent_duplicates: false
        }
    } else if (upType == "img") {
        uploadFilter = {
            mime_types: [ //只允许上传图片和zip,rar文件
                { title: "Image files", extensions: "jpg,gif,png,bmp" }
            ],
            max_file_size: '10mb', //最大只能上传10mb的文件
            prevent_duplicates: false //不允许选取重复文件
        }
    }
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: btnid,
        multi_selection: false,
        flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        filters: uploadFilter,
        init: {
            PostInit: function () {
            },
            FilesAdded: function (up, files) {
                set_upload_param(uploader, '', false);
                console.log(files);
                plupload.each(files, function (file) {
                    console.log(file);
                    console.log(file.id + file.name + file.size);
                });
            },

            BeforeUpload: function (up, file) {
                check_object_radio();
                set_upload_param(up, file.name, true);
                layindex = layer.load(1, { shade: [0.1, '#fff'] });
            },

            UploadProgress: function (up, file) {
                console.log(file.percent);
            },

            FileUploaded: function (up, file, info) {
                if (info.status == 200) {
                    var urls = host + "/" + get_uploaded_object_name(file.name);
                    console.log(urls);
                    // 区分上传后结果
                    if (upType == 'img') {
                        $showBox.find('.img_fl').html("");
                        $showBox.find('.img_fl').html('<img class="musicCover" data-src="' + urls + '" src="' + urls + '?x-oss-process=image/resize,m_fill,w_120,h_120,limit_0">');
                        $showBox.show();
                    } else if (upType == 'music') {
                        $showBox.find('.img_fr').html("");;
                        $showBox.find('.img_fr').html('<audio src="' + urls + '"></audio>');
                        var audioDom = $showBox.find('.img_fr').find('audio')[0];
                        audioDom.addEventListener("canplay", function () {
                            var timeDuration = parseInt(this.duration);
                            timeDuration = formatSeconds(timeDuration);
                            $showBox.find('.img_fr').append('<p class="musicUrl" data-url="' + urls + '">地址：' + urls + '</p>')
                            $showBox.find('.img_fr').append('<p class="musicDur" data-dur="' + timeDuration + '">时长：' + timeDuration + '</p>')
                            console.log(this.duration)
                            $showBox.show();
                        });
                    }
                    layer.close(layindex);
                    layer.msg("上传成功");
                    callback && callback();
                }
                else {
                    layer.msg(info.response);
                }
            },

            Error: function (up, err) {
                if (err.code == -600) {
                    layer.msg("您上传的文件太大了！");
                }
                else if (err.code == -601) {
                    layer.msg("错误的文件后缀名！");
                }
                else if (err.code == -602) {
                    layer.msg("已经上传过一遍了！");
                }
                else {
                    layer.msg("错误：err.response！");
                }
            }
        }
    });
    uploader.init();
}
