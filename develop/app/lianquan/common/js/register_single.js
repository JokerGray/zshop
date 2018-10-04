(function() {
    var userId = yyCache.get("userId");
    var subscriptionType = "0";
    $('#form-control').keyup(function() {
        var a = $('#form-control').val().length;
        if (a > 8) {
            var texts = $(this).val().substring(0, 8);
            $(this).val(texts);
        }
    })
    var register = {
        subscriptionName: $("input[name='subscriptionName']"),
        subscriptionSynopsis: $("textarea[name='subscriptionSynopsis']"),
        assistData: $("textarea[name='assistData']"),
        provinceCode: $("select[name='province']"),
        cityCode: $("select[name='city']"),
        subscriptionType: $("select[name='subscriptionType']"),
        operationPhone: $("input[name='operationPhone']"),
        contactEmail: $("input[name='contactEmail']"),
        checkInput: function() {
            if (this.subscriptionName.val().trim() == "") {
                layer.tips('请填写24小时名称！', this.subscriptionName.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.subscriptionName.focus();
                return false;
            }
            if (this.subscriptionName.val().trim() == "") {
                layer.tips('请填写24小时名称！', this.subscriptionName.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.subscriptionName.focus();
                return false;
            }
            if (this.subscriptionSynopsis.val().trim() == "") {
                layer.tips('请填写24小时介绍！', this.subscriptionSynopsis.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.subscriptionSynopsis.focus();
                return false;
            }
            if (this.provinceCode.val() == -1) {
                layer.tips('请选择所在地！', this.provinceCode.valueOf().selector, {
                    tips: [2, '#ff8b6f']
                });
                this.provinceCode.focus();
                return false;
            }
            if (this.subscriptionType.val() == -1) {
                layer.tips('请选择领域！', this.subscriptionType.valueOf().selector, {
                    tips: [2, '#ff8b6f']
                });
                this.subscriptionType.focus();
                return false;
            }
            if (this.operationPhone.val().trim() == "") {
                layer.tips('请填写运营者电话！', this.operationPhone.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.operationPhone.focus();
                return false;
            }
            // if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.operationPhone.val().trim()))) {
            //     layer.tips('请填写格式正确的运营者电话！', this.operationPhone.valueOf().selector, {
            //         tips: [3, '#ff8b6f']
            //     });
            //     this.operationPhone.focus();
            //     return false;
            // }
            if (this.contactEmail.val().trim() == "") {
                layer.tips('请填写联系邮箱！', this.contactEmail.valueOf().selector, {
                    tips: [1, '#ff8b6f']
                });
                this.contactEmail.focus();
                return false;
            }
            if (!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.contactEmail.val().trim()))) {
                layer.tips('请填写正确格式联系邮箱！', this.operationPhone.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.contactEmail.focus();
                return false;
            }
            this.sendSubmit();
        },
        sendSubmit: function() {
            layer.load(0, { shade: [0.1, '#fff'] });
            var cmd = "cms_back/selectByParentCode";
            var cmd = "cms_back/subRegister";
            var data = {};
            data.userId = userId;
            data.subscriptionName = this.subscriptionName.val().trim();
            data.subscriptionSynopsis = this.subscriptionSynopsis.val().trim();
            data.subscriptionImgUrl = "http://img4.duitang.com/uploads/item/201407/24/20140724104849_NJPAG.thumb.200_200_c.jpeg";
            data.assistData = this.assistData.val().trim();
            data.provinceCode = this.provinceCode.val();
            data.cityCode = this.cityCode.val();
            data.subscriptionTypeId = this.subscriptionType.val();
            data.otherPapersImg = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488463400655&di=0ff3f18063f4c4932b8d281f249ebfe7&imgtype=0&src=http%3A%2F%2Fimg.vlongbiz.com%2Fmember2009%2Fqazxsw708%2F1273729818.jpg";
            data.operationPhone = this.operationPhone.val().trim();
            data.contactEmail = this.contactEmail.val().trim();
            data.subscriptionType = subscriptionType;
            data = JSON.stringify(data);
            sessionStorage.setItem('subscriptionName', data.subscriptionName);
            sessionStorage.setItem('subscriptionType', data.subscriptionType);
            $.when(reqAjaxAsync(cmd, data)).done(function(re) {
                setTimeout(function() {
                    layer.closeAll('loading');
                    if (re.code == 1) {
                        layer.msg("注册成功！", { icon: 6 }, function() {
                            location.href = 'index.html';
                        });
                    } else {
                        layer.msg(re.msg);
                    }
                }, 2000)
            });
        }
    }
    $(".signform-checkbox").on("click", function() {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
            $("#signform_btn").removeClass("signform-submit").addClass("disabled");
        } else {
            $(this).addClass("checked");
            $("#signform_btn").removeClass("disabled").addClass("signform-submit");
        }
    });
    $(".signform-submit").on("click", function() {
        register.checkInput();
    });
    //	$(".signform-face-btn").on("click",function(){
    //		console.log(21);
    ////		layer.open({
    ////			type:2,
    ////			title:'上传头像',
    ////			content:'upload/upload_single_img.html',
    ////			area: ['800px', '600px']
    ////		});
    //	})
    //上传头像
    var apikey = yyCache.get('apikey',"test"); //获取缓存 通行证码
    var version = yyCache.get('version',"1"); //获取缓存 版本号

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
        //multi_selection: false,
        container: document.getElementById('contentLabel'),
        flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
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
    //	上传其他资质
    var uploaderLabel1 = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'uploadLabels',
        //multi_selection: false,
        container: document.getElementById('contentLabel'),
        flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
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
                set_upload_param(uploaderLabel1, '', false); //上传到阿里云
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
                    img.onload = function() {
                        this.onload = null;
                        var imgEle = "<img src='" + urls + "'  name='" + imgName + "'>";
                        $(".uploadLevel").attr("src", urls);
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
    uploaderLabel1.init();
})(jQuery);