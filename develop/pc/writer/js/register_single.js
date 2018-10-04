var layer = layui.layer;

$(function() {
    var apikey = localStorage.getItem('apikey') || "";
    var version = localStorage.getItem('version') || "1";
    var userId = localStorage.getItem("userId") || "";
    var subscriptionType = localStorage.getItem("subscriptionType") || "";

    // 判断是否已认证
    if (subscriptionType == "1" || subscriptionType == "0") {
        layer.msg("您已经认证过了", function() {
            location.href = 'index.html';
        });
    }

    //获取城市和领域
    getCity();
    optionType($("[name='subscriptionType']"), 0);

    //上传头像
    uploadOss({
        //上传按钮
        btn: 'uploadLabel',
        //上传容器
        dom: "contentLabel",
        //上传图片位置
        imgDom: "faceImg",
        //标记是否为注册页面上传
        flag: "reg"
    });

    //上传其他资质
    uploadOss({
        btn: 'uploadLabels',
        dom: "contentLabels",
        imgDom: "otherImg",
        flag: "reg"
    });

    //checkbox click
    $("#signformCheckbox").click(function() {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
            $("#signform_btn").removeClass("signform-submit").addClass("disabled");
        } else {
            $(this).addClass("checked");
            $("#signform_btn").removeClass("disabled").addClass("signform-submit");
        }
    });

    //入驻个人资料
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
                layer.tips('请填写智享头条名称！', this.subscriptionName.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.subscriptionName.focus();
                return false;
            }
            if (this.subscriptionSynopsis.val().trim() == "") {
                layer.tips('请填写智享头条介绍！', this.subscriptionSynopsis.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.subscriptionSynopsis.focus();
                return false;
            }
            if ($("#faceImg").attr("src") == "images/facenormal.png") {
                layer.tips('请填写智享头条头像！', $("#faceImg").valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
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
            if ($("#otherImg").attr("src") == "images/facenormal.png") {
                $("#otherImg").attr("src", "");
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
                layer.tips('请填写正确格式联系邮箱！', this.contactEmail.valueOf().selector, {
                    tips: [3, '#ff8b6f']
                });
                this.contactEmail.focus();
                return false;
            }
            this.sendSubmit();
        },
        sendSubmit: function() {
            var cmd = "cms_back/selectByParentCode";
            var cmd = "cms_back/subRegister";
            var data = {};
            data.userId = userId;
            data.subscriptionName = this.subscriptionName.val().trim();
            data.subscriptionSynopsis = this.subscriptionSynopsis.val().trim();
            data.subscriptionImgUrl = $("#faceImg").attr("src");
            data.assistData = this.assistData.val().trim();
            data.provinceCode = this.provinceCode.val();
            data.cityCode = this.cityCode.val();
            data.subscriptionTypeId = this.subscriptionType.val();
            data.otherPapersImg = $("#otherImg").attr("src") || "";
            data.operationPhone = this.operationPhone.val().trim();
            data.contactEmail = this.contactEmail.val().trim();
            data.subscriptionType = 0;
            data = JSON.stringify(data);
            $.when(reqAjaxAsync(cmd, data)).done(function(re) {
                layer.closeAll('loading');
                if (re.code == 1) {
                    layer.msg(re.msg, {
                        icon: 6
                    }, function() {
                        location.href = 'login.html';
                    });
                } else {
                    layer.msg(re.msg);
                }
            });
        }
    }

    $("#signform_btn").on("click", function() {
        register.checkInput();
    });
});