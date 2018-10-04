var layer = layui.layer;
window.onbeforeunload = function() {
    var text = $(".account-name").text();
    console.log(text)
};
(function($) {
    var arr1 = [];
    var arr2 = [];
    var userId = localStorage.getItem("userId"); //(读取列表)
    var paramInfo = "{'userId':" + userId + "}"; //(读取列表)
    var REQUEST_URL = {
        GETINFO: 'cms_new/pushSelect', //(读取列表)
        UPDATEINFO: 'cms_back/updateByPrimaryKeySelective' //(保存信息)
    }

    var curUrlPath = window.document.location.href,
        pathName = window.document.location.pathname,
        pos = curUrlPath.indexOf(pathName),
        localhostPaht = curUrlPath.substring(0, pos); //http://writer.zxtest.izxcs.com
    var localhostArr = localhostPaht.split('.');
    if (localhostArr[0] == 'http://writer') {
        locallastStr = localhostPaht.substring(localhostPaht.indexOf('.'), localhostPaht.length);
        localhostPaht = 'http://share' + locallastStr;
    }
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //二维码
    var qrcodeUrl = localhostPaht + "/24hours/share24/ewm.html?apptype=citynews&subtype=newsPersonHome&userId=" + userId; //'http://www.qq.com';
    //读取信息
    function getInfo() {
        reqAjaxAsync(REQUEST_URL.GETINFO, paramInfo).then(function(res) {
            isApikey(res);
            if (res.code == 1) {
                var row = res.data;
                var subscriptionTypeName = isNull(row.scCmsSubscriptionType) ? "" : row.scCmsSubscriptionType.channelName;
                var cityCode = isNull(row.city) ? "" : row.city.code;
                var provinceCode = isNull(row.province) ? "" : row.province.code;
                var provinceAreaName = isNull(row.province) ? "" : row.province.areaname;
                var cityAreaName = isNull(row.city) ? "" : row.city.areaname;
                var subscriptionImgUrl = isNull(row.subscriptionImgUrl) ? "images/zhanwei.png" : row.subscriptionImgUrl;
                $(".crumb").attr("data-subscriptionId", row.subscriptionId);
                $(".crumb").attr("data-examineUserId", row.examineUserId);
                $(".account-item-gd .field").attr("data-subscriptionTypeId", row.subscriptionTypeId);
                $(".account-item-gd .position").attr("data-cityCode", cityCode);
                $(".account-item-gd .position").attr("data-provinceCode", provinceCode);
                $(".account-assistData").val(row.assistData);
                $(".account-otherPapersImg").val(row.otherPapersImg);
                $(".account-enterprisePaperImg").val(row.enterprisePaperImg);
                $(".account-operationIdCard").val(row.operationIdCard);
                $(".account-operationIdCardImg").val(row.operationIdCardImg);
                $(".account-subscriptionType").val(row.subscriptionType);
                $(".account-item-gd .account-name").html(row.subscriptionName); //头条号名称
                $(".account-item-gd .account-intro").html(row.subscriptionSynopsis); //头条号介绍
                $(".account-item-gd input[name=accountIntro]").val(row.subscriptionSynopsis);
                $("#preview").attr('src', subscriptionImgUrl); //头条号头像
                $(".account-item-gd .contact").html(row.operationName); //联系人
                $(".account-item-gd .number").html(row.operationPhone); //联系电话
                $(".account-item-gd .field").html(subscriptionTypeName) //领域
                $(".account-item-gd .position").html(provinceAreaName + cityAreaName) //所在地
                $(".account-item-gd .website").html(row.webUrl) //网站
                $(".account-item-gd .company").html(row.companyName) //机构/公司名称
                $(".account-item-gd .address").html(row.companyAdderss) //公司机构地址
                $(".account-item-gd .mail").html(row.contactEmail) //联系邮箱
                arr1 = [row.subscriptionName, row.subscriptionSynopsis, row.subscriptionImgUrl, row.webUrl, row.companyName, row.companyAdderss, row.contactEmail];
            } else {
                console.error(res.msg);
            }
        })
    }

    //生成二维码
    function createQrcodeImg(id, wImg, hImg) {
        jQuery('#' + id).qrcode({
            width: wImg, //二维码的宽度  
            height: hImg, //二维码的高度  
            imgWidth: hImg / 4, //图片宽
            imgHeight: hImg / 4, //图片高
            render: 'canvas',
            text: qrcodeUrl
        });
    }

    //下载二维码
    function downloadQrcodeImg(_id, downloadId) {
        var canvas = $("#" + _id).find("canvas").get(0);
        try { //解决IE转base64时缓存不足，canvas转blob下载
            var blob = canvas.msToBlob();
            navigator.msSaveBlob(blob, 'qrcode.jpg');
        } catch (e) { //如果为其他浏览器，使用base64转码下载
            var url = canvas.toDataURL('image/jpeg');
            $("#" + downloadId).attr('href', url).get(0).click();
        }
        return false;
    }

    $(function() {
        getInfo();
        //生成二维码
        createQrcodeImg('qrCodeImg', 200, 200);
        createQrcodeImg('qrcode_290', 290, 290);
        createQrcodeImg('qrcode_370', 370, 370);
        createQrcodeImg('qrcode_530', 530, 530);
        createQrcodeImg('qrcode_690', 690, 690);
    });

    //点击修改
    $(".account-item-gd .modify").click(function() {
        var val = $(this).parent().attr("class");
        var prevVal = $(this).siblings("span").text();
        var inputVal = $(this).siblings("input").val();
        if (val == "account-item-gd") {
            $(this).siblings("span").hide();
            $(this).prev().val(prevVal);
            $(this).prev().show();
            $(this).parent().addClass("actve");
        } else {
            $(this).siblings("span").show().text(inputVal);
            $(this).prev().hide();
            $(this).parent().removeClass("actve");
        }
    });

    //失去焦点修改完毕
    // $(".account-item-gd .account-input").blur(function() {
    //     var val = $(this).val();
    //     $(this).hide();
    //     $(this).prev().show();
    //     $(this).prev().text(val);
    // });

    //上传头条号头像
    uploadOss({
        btn: 'uploadBtn',
        imgDom: "preview",
        flag: "reg"
    });

    //下载二维码
    $('#qrCodeImg').click(function() {
        downloadQrcodeImg("qrCodeImg", "qrCodeImgDownload");
    });

    //提交
    function submitFrom() {
        var subscriptionName = $(".account-item-gd input[name=accountName]").val(), //头条号名称
            subscriptionSynopsis = $(".account-item-gd input[name=accountIntro]").val(), //头条号介绍
            subscriptionId = $(".crumb").attr("data-subscriptionId"), //头条号ID
            webUrl = $(".account-item-gd .website").text(), //网站地址
            companyName = $(".account-item-gd .company").text(), //机构名称
            companyAdderss = $(".account-item-gd .address").text(), //地址
            contactEmail = $(".account-item-gd .mail").text(), //邮箱地址
            subscriptionImgUrl = $("#preview").attr("src"); //头条号头像
        arr2 = [subscriptionName || $(".account-name").text(), subscriptionSynopsis, subscriptionImgUrl, webUrl, companyName, companyAdderss, contactEmail];
        if (!Array.ExistsSameValues(arr1, arr2)) {
            return layer.msg("当前没有修改任何信息");
        }
        if (isNull(subscriptionSynopsis)) {
            layer.msg("头条号介绍不能为空");
            return false;
        }
        if (isNull(subscriptionImgUrl)) {
            layer.msg("头条号头像不能为空");
            return false;
        }
        var params = {
            examineTime: '',
            isExamine: 0,
            subscriptionId: subscriptionId,
            userId: userId,
            subscriptionSynopsis: subscriptionSynopsis,
            webUrl: webUrl,
            companyName: companyName,
            companyAdderss: companyAdderss,
            contactEmail: contactEmail,
            subscriptionImgUrl: subscriptionImgUrl
        };

        //判断公告号名称是否修改
        if (subscriptionName != "" && subscriptionName != localStorage.getItem('subscriptionName')) {
            params.subscriptionName = subscriptionName;
        }
        reqAjaxAsync(REQUEST_URL.UPDATEINFO, JSON.stringify(params)).then(function(res) {
            if (res.code == 1) {
                var d = res.data;
                layer.msg("提交成功");
                localStorage.setItem('subscriptionName', subscriptionName || $(".account-name").text());
                localStorage.setItem('subscriptionImgUrl', subscriptionImgUrl);
                setTimeout(function() {
                    location.reload();
                }, 500)
            } else {
                layer.msg(res.msg);
            }
        });
    }

    $("#submitBtn").click(function() {
        submitFrom();
    });

    //下载更多尺寸
    $("#downloadMore").click(function() {
        var sHtml = '<div class="table-container">' +
            '<table class="table table-striped table-hover">' +
            '<thead><tr><th>尺寸(像素)</th><th>边长(厘米)</th><th>建议扫描距离(米)</th><th>下载链接</th></tr></thead>' +
            '<tbody><tr><td><span>290 x 290</span></td><td><span>10</span></td><td><span>0.5</span></td><td><a class="download-link" data-size="290" href="javascript:;">下载</a></td></tr>' +
            '<tr><td><span>370 x 370</span></td><td><span>13</span></td><td><span>0.9</span></td><td><a class="download-link" data-size="370" href="javascript:;">下载</a></td></tr>' +
            '<tr><td><span>530 x 530</span></td><td><span>18</span></td><td><span>1.1</span></td><td><a class="download-link" data-size="530" href="javascript:;">下载</a></td></tr>' +
            '<tr><td><span>690 x 690</span></td><td><span>24</span></td><td><span>1.3</span></td><td><a class="download-link" data-size="690" href="javascript:;">下载</a></td></tr>' +
            '</tbody></table></div>'
        layer.open({
            type: 1,
            title: '下载更多尺寸的二维码',
            area: ['500px', '300px'], //宽高
            content: sHtml,
            success: function() {
                $(".table-container .table>tbody>tr>td .download-link").click(function() {
                    var dataSize = $(this).attr("data-size");
                    downloadQrcodeImg("qrcode_" + dataSize, "download_" + dataSize);
                });

            }
        });
    });


})(jQuery);