var uploadParam = {
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

//可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
function get_signature() {
    now = timestamp = Date.parse(new Date()) / 1000;
    if (uploadParam.expire < now + 3) {
        body = send_request()
        var obj = eval("(" + body + ")");
        uploadParam.host = obj['host']
        uploadParam.policyBase64 = obj['policy']
        uploadParam.accessid = obj['accessid']
        uploadParam.signature = obj['signature']
        uploadParam.expire = parseInt(obj['expire'])
        uploadParam.callbackbody = obj['callback']
        uploadParam.key = obj['dir']
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
    return "zxdw" + random_string(24) + importUrl;
}

function set_upload_param(upObj, filename, ret) {
    if (ret == false) {
        ret = get_signature()
    }
    g_object_name = uploadParam.key; //目录
    if (filename != '') {
        g_object_name = g_object_name + '/' + randomString(filename);
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': uploadParam.policyBase64,
        'OSSAccessKeyId': uploadParam.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': uploadParam.callbackbody,
        'signature': uploadParam.signature,
    };
    upObj.setOption({
        'url': uploadParam.host,
        'multipart_params': new_multipart_params
    });
    upObj.start();
}

//上传文件类型过滤
function filterTypes(flag) {
    var obj = "";
    if (flag == "video") {
        obj = [{
            title: "files",
            extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv"
        }]
    } else {
        obj = [{
            title: "Image files",
            extensions: "jpg,jpeg,gif,png,bmp"
        },
        {
            title: "Zip files",
            extensions: "zip,rar"
        }]
    }
    return obj;
}

/**上传*/
function uploadOss(params){
	var oUploader = new plupload.Uploader({
		runtimes: 'html5, flash, silverlight, html4',
		browse_button: params.btn,
		flash_swf_url: '../assets/plupload-2.1.2/js/Moxie.swf',
		silverlight_xap_url: '../assets/plupload-2.1.2/js/Moxie.xap',
		url: 'http://oss.aliyuncs.com',
		filters: {
			mime_types: filterTypes(params.flag),
			max_file_size: params.size || "5mb", //最大只能上传5mb的文件
            prevent_duplicates: false //不允许选取重复文件
		},
		init: {
			PostInit: function(){
                //console.log(11111111);
			},
			FilesAdded: function(upObj, files){
                set_upload_param(oUploader, '', false);
			},
			BeforeUpload: function(upObj, file){
                //console.log(2222222);
                set_upload_param(upObj, file.name, true);
			},
			UploadProcess: function(upObj, file){

			},
			FileUploaded: function(upObj, file, res){
                if(res.status == 200){
                    if(params.flag == "editorImg"){
                        return editorImgShow(file, params);
                    }
                }
			},
			Error: function(upObj, err){
				if (err.code == -600) {
                    layer.msg("选择的文件过大,图片大小不能超过5M");
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
	oUploader.init();
}

/**回调函数*/
//上传图片至编辑器
function editorImgShow(file, res){
    layer.msg("上传成功");
    var img, img2, width, height;
    var urls = uploadParam.host + "/" + get_uploaded_object_name(file.name);
    var imgName = get_uploaded_object_name(file.name);
    imgName = imgName.substr(0, imgName.indexOf('.')).replace("user-dir/", "");
    //img = "<img src='" + urls + "' class='editor_img " + imgName + "' />";
    img = '<img src="'+urls+'" class="editor-img" style="display:block;max-width:96%;">'
    res.editor.insertHtml(img);
}
