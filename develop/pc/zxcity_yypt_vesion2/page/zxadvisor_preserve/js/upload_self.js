 
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
//上传OSS
function uploadOss(data) {
    var uploaderLabel = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: data.btn,
        //multi_selection: false, 
        // container: document.getElementById(data.dom),
        flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        thumb:{
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify:false,
            // 如果发现压缩后文件大小比原来还大，则使用原来图片
            // 此属性可能会影响图片自动纠正功能
            noCompressIfLarger: false
        },
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
                    if(data.type==1){ //头像
                        document.getElementById('ossfile').innerHTML = '';
                    }else if(data.type==2){

                        document.getElementById('ossfile1').innerHTML = '';
                    }
                } else if (data.flag == "video") {
                    document.getElementById('videoProgress').innerHTML = '';
                }
            },
            FilesAdded: function(up, files) {

                if (data.flag == "sendLocal") {
                    $("#imgUrl").attr("data-width",this.width);
                    $("#imgUrl").attr("data-height",this.height);
                    set_upload_param(uploaderLabel, '', false);


                        document.getElementById(data.btn).disabled = true;
                        plupload.each(files, function (file) {
                            document.getElementById('ossfile1').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
                            '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
                            '</div>';
                        });

                }else{
                    set_upload_param(uploaderLabel, '', false);
                    document.getElementById(data.btn).disabled = true;
                    plupload.each(files, function(file) {
                        console.log(file);
                        document.getElementById('videoProgress').innerHTML = '<div id="' + file.id + '">' + file.name + '(' + plupload.formatSize(file.size) + ')<b></b>' +
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
                   /* d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    var prog = d.getElementsByTagName('div')[0];
                    var progBar = prog.getElementsByTagName('div')[0];
                    progBar.style.width = file.percent + "%";*/
                    // progBar.style.width = 2 * file.percent + 'px';
                    /*progBar.setAttribute('aria-valuenow', file.percent);*/
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
    return uploaderLabel;
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
//注册资料上传回调
function regCallback(file, data) {
    layer.msg("上传成功");
    //获取文件后缀名
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var imgName = file.name;
    imgName = imgName.substr(0, imgName.indexOf('.'));
    var img = new Image();
    var fr = new mOxie.FileReader();
    img.onload = function() {
        this.onload = null;
        document.getElementById(data.imgDom).setAttribute("src", urls);
    };
    img.src = urls;
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
    data.editor.insertHtml(img);
    var html = data.editor.html();
    //图片宽高
    img2 = "<img src='" + urls + "' class='editor_img" + imgName + "' width='170' height='170' style='margin:20px;'/>";
    data.imgArr.push(img2);
    var userId = yyCache.get("userId");
    var editorTxt = localStorage.setItem("editorTxt_" + userId, html);
    localStorage.setItem("html", html);
    localStorage.setItem("imgArr", data.imgArr);
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
    var userId = yyCache.get("userId");
    var editorTxt = localStorage.setItem("q_editorTxt_" + userId, html);
    localStorage.setItem("html", html);
    localStorage.setItem("imgArr", data.imgArr);
}

//上传视频
function sendVideoCallback(file, data) {
    layer.msg("上传成功");
    var videoUrls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var videoName = get_uploaded_object_name(file.name);
    videoName = videoName.substr(0, videoName.indexOf('.'));
    $("#videoHide").html($("<video src='" + videoUrls + "' controls='controls' style='width:550px;'></video>"))
    sessionStorage.setItem("videoUrls", videoUrls);
}

//发表页面编辑器上传视频
function sendEditorVideoCallback(file, data) {
    layer.msg("上传成功");
    var videoUrls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var videoName = get_uploaded_object_name(file.name);
    videoName = videoName.substr(0, videoName.indexOf('.'));
    $("#videoHide").html($("<video src='" + videoUrls + "' controls='controls' style='max-width:950px;'></video>"));
    layer.msg("请上传视频封面!");
}

//发表页面编辑器上传视频的封面
function sendVideoCoverCallback(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    $("#videoHide").find("video").attr("poster", urls);
    $("#videoHide").html($("#videoHide").html());
}

//发表页面本地上传回调
function sendLocalCallback(file, data) {
    console.log(file);

    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var img = "<div class='item_box fl'>" +
        "<img id='imgUrl' src='" + urls + "' class='editor_img' width='600' />" +
        "</div>";
    $("#" + data.imgDom).attr("src",urls);
    $("#zxadver .inpt").hide();
    layer.msg("上传成功");
}

//发表多图本地上传回调
function sendLocalCallbacks(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    localStorage.setItem("urls", urls);
    var img = "<div class='item_box fl'><img src='" + urls + "' class='editor_img' width='170' height='170'/><i class='deleteI'></i></div>";
    $("#" + data.imgDom).html(img);
}

//上传视频
/*function sendVideoCallback(file, data) {
    layer.msg("上传成功");
    var videoName = file.name.split(".")[0];
    if (isNull($("#titleTxt").val())) {
        $("#titleTxt").val(videoName);
    }
    if (isNull($("textarea[name='videocontent']").val())) {
        $("textarea[name='videocontent']").val(videoName);
    }
    console.log(videoName)
    var videoUrls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var videoName = get_uploaded_object_name(file.name);
    videoName = videoName.substr(0, videoName.indexOf('.'));
    $("#videoHide").html($("<video src='" + videoUrls + "' controls='controls' style='max-width:950px;'></video>"))
    localStorage.setItem("videoUrls", videoUrls);
}*/

//图集添加图片
function sendAddImageCallback(file, data) {
    layer.msg("上传成功");
    var urls = uploadJson.host + "/" + get_uploaded_object_name(file.name);
    var imgName = get_uploaded_object_name(file.name);
    var str = '',
        txt = '';
    var name = $("#description .radio.checked").attr("name");
    if (name == 2 && $("#ossfile2").html() != '') {
        txt = '<textarea class="form-input" name="imgdesc" maxlength="200" placeholder="图片描述(不超过200个字)" disabled="disabled"></textarea>';
    } else {
        txt = '<textarea class="form-input" name="imgdesc" maxlength="200" placeholder="图片描述(不超过200个字)"></textarea>';
    }
    str += '<li class="atlas-upload"><div class="clearfix atlas-item"><div class="img">';
    str += '<img class="editor_img" src="' + urls + '" width="110" height="110"  name="' + imgName + '" /></div><div class="imgdesc">' + txt + '</div>';
    str += '<div class="imgoperate"><a><i class="fa fa-trash-o fa-2x" name="delI"></i></a></div>';
    str += '<div class="imgoperate"><a><i class="fa fa-bars fa-2x" ></i></a></div>';
    str += '</div></li>';
    $('#ossfile2').append(str);
}