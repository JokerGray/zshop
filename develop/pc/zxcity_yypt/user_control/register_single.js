(function() {
    var userId = sessionStorage.getItem("userId");
    var subscriptionType = "0";
    //上传头像
    var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
    var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

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

    function send_request() {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xmlhttp != null) {
            serverUrl = getHP() + 'zxcity_restful/ws/oss/ossUpload';
            xmlhttp.open("POST", serverUrl, false);
            xmlhttp.send(null);
            return xmlhttp.responseText
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

    function get_signature() {
        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
        now = timestamp = Date.parse(new Date()) / 1000;
        if (expire < now + 3) {
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

    function get_suffix(filename) { //得到文件名的后缀
        pos = filename.lastIndexOf('.')
        suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }

    function calculate_object_name(filename) //得到文件是本地名还是随机名
    {
        g_object_name = g_object_name + '/' + "${filename}"
        return ''
    }

    function get_uploaded_object_name(filename) {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }

    function set_upload_param(up, filename, ret) {
        if (ret == false) {
            ret = get_signature()
        }
        g_object_name = key; //目录
        if (filename != '') {
            suffix = get_suffix(filename) //得到后缀
            calculate_object_name(filename) //得到本地或者随机名
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

    var uploaderLabel = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'uploadLabel',
        container: document.getElementById('contentLabel'),
        //flash_swf_url: 'common/lib/plupload-2.1.2/js/Moxie.swf',
        flash_swf_url: '../common/assets/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: '../common/assets/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: [ //只允许上传图片和zip,rar文件
                { title: "Image files", extensions: "jpg,gif,png,bmp" },
                { title: "Zip files", extensions: "zip,rar" }
            ],
            max_file_size: '10mb', //最大只能上传10mb的文件
            prevent_duplicates: true //不允许选取重复文件
        },

        init: {
            PostInit: function() {},

            FilesAdded: function(up, files) {
                set_upload_param(uploaderLabel, '', false); //上传到阿里云
            },

            BeforeUpload: function(up, file) {
                check_object_radio();
                set_upload_param(up, file.name, true);
            },

            UploadProgress: function(up, file) {},

            FileUploaded: function(up, file, info) {
                if (info.status == 200) {
                    var urls = host + "/" + get_uploaded_object_name(file.name);
                    console.log(file.name);
                    var imgName = file.name; //图片名字
                    imgName = imgName.substr(0, imgName.indexOf('.'));
                    console.log(urls);

                    var img = new Image();
                    //图片宽高
                    var width;
                    var height;
                    img.onload = function() {
                        width = this.width;
                        height = this.height;
                        this.onload = null;
                        var imgEle = "<img src='" + urls + "' width='110' height='110' name='" + imgName + "' ysWidth='" + width + "' ysHeight='" + height + "'>";
                        $(".signform-face-img").attr("src", urls);
                    };
                    img.src = urls;
                } else {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                }
            },

            Error: function(up, err) {
                if (err.code == -600) {
                    document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
                } else if (err.code == -601) {
                    document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
                } else if (err.code == -602) {
                    document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
                } else {
                    document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                }
            }
        }
    });
    uploaderLabel.init();
})(jQuery);