$(function () {
    // $('input,textarea').bind('input propertychange change', function () {
    //     detaInteract()
    // })
    // detaInteract();
    function AddActivity() {
        this.init();
    }
    $.extend(true, AddActivity.prototype, {
        init: function () {
            var that = this;
            var layer = layer;
            this.getParams();           
            this.getInfo();
            setTimeout(() => {
                var date = new Date();
                editType = that.params.type;
                if(that.params.type == 1){
                    $('.title-name').text('编辑活动');
                    $('#checkMan').css('display', 'block');
                    this.getCheckMan();
                    setTimeout(() => {
                        that.getData();
                    }, 1000);
                } else if (that.params.type == 2){
                    $('.title-name').text('补录活动');
                    $("#startDate").datetimepicker("setEndDate", date);
                    $('#checkMan').css('display','none');
                }else{
                    $('.title-name').text('新增活动');
                    $("#startDate").datetimepicker("setStartDate", date);
                    $('#checkMan').css('display', 'block');
                    this.getCheckMan();
                }
            }, 10);
        },
        getParams: function () {
            var url = location.search;
            var params = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            this.params = params;
        },
        ajaxAsy: function (cmd, datas, callback) {
            var that = this;
            var data = JSON.stringify(datas);
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                headers: {
                    apikey: 'test'
                },
                data: {
                    cmd: cmd,
                    data: data
                },
                beforeSend: function (request) {
                    layer.load(1, { shade: [0.3, "#fff"] })
                },
                success: function (re) {
                    callback(re);
                },
                error: function (re) {
                    parent.layer.msg('网络错误,稍后重试');
                },
                complete: function (re) {
                    layer.closeAll();
                }
            });
        },
        getCheckMan: function () {
            var that = this;
            var cmd = "fans/getShopPersonList";
            var datas = {
                merchantId: that.params.merchantId,
                userId: that.params.userId
            };
            that.ajaxAsy(cmd, datas, function (re) {
                if (re.code == 1) {
                    var data = re.data;
                    $('#approver').empty();
                    var option = '<option value="">请选择一个审批人</option>';
                    for (let i = 0; i < data.length; i++) {
                        option +=`
                            <option value="${data[i].userId}">${data[i].username}</option>
                        `;
                    }
                    $('#approver').html(option);
                    $('#approver').select2({
                        width: '100%' //,
                        //multiple:true
                    });                   
                } else {
                    parent.layer.msg(re.msg);
                }
            })
        },
        getInfo: function () {
            var that = this;
            var cmd = "fans/getShopInfo";
            var datas = {
                merchantId: that.params.merchantId
            };
            that.ajaxAsy(cmd, datas, function (re) {
                if (re.code == 1) {
                    var data = re.data;
                    var fansName;
                    var merchantName;
                    data.fansName ? fansName = data.fansName : fansName = '-';
                    data.merchantName ? merchantName = data.merchantName : merchantName = '-';
                    $('#fansName').text(fansName);
                    $('#merchantName').text(merchantName);
                    if(data.logo){
                        $('#userLogo').attr('src', data.logo);
                    }
                } else {
                    parent.layer.msg(re.msg);
                }
            })
        },
        getData: function () {
            var that = this;
            var cmd = "fans/getFansActivityDetail";
            var datas = {
                merchantId: that.params.merchantId,
                activityId: that.params.activityId,
                userId: that.params.userId
            };
            var callback = that.setData;
            that.ajaxAsy(cmd, datas, callback);
        },      
        setData: function (re) {
            if (re.code == 1) {
                var data = re.data;
                $('.budget-input').css('display','none');                
                $('#perBudget').css('display','block');               
                $('#staffInput').css('display','none');          
                $('#staffCheck').css('display','block');             
                if (data.name){
                    $("#activityName").val(data.name);
                    $("#detailTitle").text(data.name);
                }
                if (data.startTime){
                    $("#startDate").datetimepicker('update', data.startTime);
                    $("#selectTime").text(data.startTime);
                }
                if (data.place){
                    $('#place').val(data.place);
                    $('#selectAddress').text(data.place);
                    $('#lat').val(data.lat);
                    $('#lng').val(data.lng);
                }
                if (data.perBudget){
                    $('#perBudget').text(data.perBudget);
                }
                if (data.JoinNum) {
                    sumList = data.personList;
                    $('#staffNum').text('已选择' + data.JoinNum + '人');
                    $('#totalPeople').text(data.JoinNum);
                } else {
                    sumList = [];
                    $('#staffNum').val('已选择0人');
                }
                if (data.logo) {
                    $('#url').val(data.logo);
                    $('#upFace').attr('src', data.logo);
                    $('#coverImg').css('background-image', 'url(' + data.logo + ')')
                    $('.imgshadow').show();
                }
                if (data.process) {
                    editor.html(data.process);
                    $('#processContent').html(data.process);
                }
                if (data.nextAudUser) {
                    var nextAudUser = String(data.nextAudUser);
                    // $("#approver").val(nextAudUser);
                    // $("#approver").select2("val", data.nextAudUser);
                    $('#approver').val([data.nextAudUser]).trigger('change');
                }
            } else {
                parent.layer.msg(re.msg);
            }
        }
    })
    $.extend(true, AddActivity.prototype,layer)
    window.addActivity = new AddActivity();
    $('#activityName').bind('input propertychange change', function () {
        var content = $('#activityName').val();
        if(content.length > 20 ){
            parent.layer.msg("输入的活动名称太长,请控制在20个字以内!");
            content = content.substring(0,19);
            $('#activityName').val(content);
            return false;
        }else{
            $('#detailTitle').text(content);
            $('#titleContent').text(content);
        }
    });
    $('#startDate').datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        autoclose: true,
        // startDate: false,
        language: 'zh-CN',
        showMeridian: true,
        minView: 'hour'
    });
    $('#startDate').on('changeDate',function (res) {
        var nowTime = new Date(res.date);
        $('#selectTime').text(getSec(nowTime, 5) + ' ' + getSec(nowTime, 6) + ':00');
    })
    $('#place').on("click", function () {
        var place = $(this).val();
        if(place){
            var lng = $('input[name="lng"]').val();
            var lat = $('input[name="lat"]').val();
            layer.open({
                type: 2,
                area: ['800px', '500px'],
                btn: ['确定', '取消'],
                fix: false,
                maxmin: true,
                title: "选择地址",
                // content: encodeURI(encodeURI('map.html?place=' + place + '&lng=' + lng + '&lat=' + lat)),
                content: 'map.html?place=' + encodeURI(place) + '&lng=' + lng + '&lat=' + lat,
                yes: function (index, layero) {
                    var info = window["layui-layer-iframe" + index].callbackdata();
                    var adcode = info.adcode + "";
                    adcode = adcode.slice(0, 4);
                    $('input[name="address"]').val(info.address);
                    $('input[name="place"]').val(info.address);
                    $('#selectAddress').text(info.address);
                    $('input[name="lat"]').val(info.lat);
                    $('input[name="lng"]').val(info.lng);
                    $('input[name="adcode"]').val(adcode);
                    layer.close(index);
                }
            })
        }else{
            layer.open({
                type: 2,
                area: ['800px', '500px'],
                btn: ['确定', '取消'],
                fix: false,
                maxmin: true,
                title: "选择地址",
                content: 'map.html',
                yes: function (index, layero) {
                    var info = window["layui-layer-iframe" + index].callbackdata();
                    var adcode = info.adcode + "";
                    adcode = adcode.slice(0, 4);
                    $('input[name="address"]').val(info.address);
                    $('input[name="place"]').val(info.address);
                    $('#selectAddress').text(info.address);
                    $('input[name="lat"]').val(info.lat);
                    $('input[name="lng"]').val(info.lng);
                    $('input[name="adcode"]').val(adcode);
                    layer.close(index);
                }
            })
        }     
    })
    $('.imgshadow').off().on('click', function () {
        $('#upFace').click();
    })
    initUpload({
        dom: "upFace", flag: [{
            title: "图片文件",
            extensions: "jpg,png"
        }], fileSize: "10mb", UploadedCallback: function (src) {
            $('#url').val(src);
            $('#upFace').attr('src', src);
            $('#coverImg').css('background-image', 'url(' + src + ')')
            $('.imgshadow').show();
        }
    });
    // initUpload({
    //     dom: "videoShow", flag: [{
    //         title: "视频文件",
    //         extensions: "mp4,avi,rmvb,mkv,wmv,m4v,3gp"
    //     }], fileSize: "50mb", AddedCallback: getVideoPoster, UploadedCallback: function (src) {
    //         $('input[name="videoUrl"]').val(src)
    //     }
    // });
    createImg();
})
function str2utf8(str) {
    encoder = new TextEncoder('utf8');
    return encoder.encode(str);
}
//editor初始化
var editor;
KindEditor.ready(function (K) {
    editor = K.create('#introduce', {
        width: '100%',
        resizeType: 1,
        allowPreviewEmoticons: false,
        imageSizeLimit: '10MB', //批量上传图片单张最大容量
        imageUploadLimit: 100, //批量上传图片同时上传最多个数
        // allowImageUpload: true,
        uploadJson: '/zxcity_restful/ws/fans/upload_article_images.do',
        items: [
            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'image', 'multiimage', 'link'],
        afterSelectFile: function (params) {
            console.log(params)   
        },
        afterChange: function () {
            $('#processContent').html(this.html());
        }
    });
});
//参加人数统计
var sumList = [];
var cirList = [];
$('#staff').on("click", function () {
    var staff = $(this).val();
    if (staff) {
        sumList = JSON.stringify(sumList);
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            btn: ['确定'],
            title: false,
            content: 'selectPeople/selectPeople.html?sumPeople=' + sumList + '&merchantId=' + addActivity.params.merchantId,
            cancel: function (index, layero) {
                var info = window["layui-layer-iframe" + index].callbackdata();
                sumList = info.selectList;
                cirList = info.circleList;
                $('#staff').val('已选择' + info.sumNum + '人');
                $('#totalPeople').text(info.sumNum);
                layer.close(index);
            },
            yes: function (index, layero) {
                var info = window["layui-layer-iframe" + index].callbackdata();
                sumList = info.selectList;
                cirList = info.circleList;
                $('#staff').val('已选择' + info.sumNum + '人');
                $('#totalPeople').text(info.sumNum);
                layer.close(index);
            }
        })
    } else {
        layer.open({
            type: 2,
            area: ['80%', '80%'],
            btn: ['确定'],
            title: false,
            content: 'selectPeople/selectPeople.html?merchantId=' + addActivity.params.merchantId,
            cancel: function (index, layero) {
                var info = window["layui-layer-iframe" + index].callbackdata();
                console.log(info);
                sumList = info.selectList;
                cirList = info.circleList;
                $('#staff').val('已选择' + info.sumNum + '人');
                $('#totalPeople').text(info.sumNum);
                layer.close(index);
            },
            yes: function (index, layero) {
                var info = window["layui-layer-iframe" + index].callbackdata();
                sumList = info.selectList;
                cirList = info.circleList;
                $('#staff').val('已选择' + info.sumNum + '人');
                $('#totalPeople').text(info.sumNum);
                layer.close(index);
            }
        })
    }
})
var merchantId = getUrlParam('merchantId');

//查看人员
$('#checkPeople').on("click", function () {
    sumListStr = JSON.stringify(sumList);
    layer.open({
        type: 2,
        area: ['80%', '80%'],
        btn: false,
        title: false,
        content: 'showPeople/showPeople.html?sumPeople=' + sumListStr + '&merchantId=' + merchantId,
        cancel: function(){
            sumListStr = ''
        }
    })
})
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
var size = 0;
var OSSParams;
function createImg() {
    var imgContent = $('#imgBox').clone();
    imgContent.attr('id', '');
    var imgShowId = 'imgShow' + size;
    imgContent.find('#imgShow').attr('id', imgShowId).load(function () {
        $(this).siblings('.closeImg').show();
        $(this).parents('.imgContent').addClass('active');
        $(this).siblings('.noSrc').hide();
        if ($('.pictureBox .noSrc').not(':hidden').length < 1 && $('.imgContent').length < 10) createImg();
        // dataInteract();
    });
    $('#imgBox').parent().append(imgContent.show());
    initUpload({
        dom: imgShowId, flag: [{
            title: "图片文件",
            extensions: "jpg,png"
        }], fileSize: "10mb"
    })
    size++;
}

// oss上传
function initUpload(arg) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,html4',
        browse_button: arg.dom,
        multi_selection: false,
        unique_names: true,
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: arg.flag,
            max_file_size: arg.fileSize,
            prevent_duplicates: false
        }
    });
    uploader.init();
    uploader.bind('FilesAdded', function (up, files) {
        statrUpload(up, files[0]);
        if (arg.AddedCallback) {
            arg.AddedCallback(files)
        }
        // 进度
        // parent.window.index.progress(up, files, function () {
        //     if ($('#' + arg.dom).siblings('.closeImg')) {
        //         $('#' + arg.dom).siblings('.closeImg').trigger('click');
        //     } else {
        //         $('#upFace').attr('src', './image/upFace.png');
        //         $('.imgshadow').hide();
        //         $('#url').val('');
        //     }

        // });
    });
    uploader.bind('Error', function (up, err, file) {
        if (err.code == -600) {
            parent.layer.msg("选择的文件过大,视频大小限制在20M以内,图片大小限制在5M以内");
        } else if (err.code == -500) {
            parent.layer.msg('初始化错误')
        } else if (err.code == -601) {
            parent.layer.msg("不支持该文件格式");
        } else if (err.code == -602) {
            parent.layer.msg("这个文件已经上传过一遍了");
        } else {
            parent.layer.msg("系统繁忙，请稍后再试!");
        }
    });
    uploader.bind('FileUploaded', function (up, file, info) {
        if (info && info.status == 200) {
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + file.name;
            if (arg.UploadedCallback) {
                arg.UploadedCallback(src);
            } else {
                $('#' + arg.dom).attr('src', src);
            }
        } else {
            parent.layer.msg("系统繁忙，请稍后再试!");
        }
    });
    function statrUpload(up, file) {
        getOssParams().then(function (data) {
            file.name = randomName();
            var fileName = data['dir'] + '/' + file.name;
            up.setOption({
                url: data['host'],
                multipart_params: {
                    key: fileName,
                    policy: data['policy'],
                    OSSAccessKeyId: data['accessid'],
                    success_action_status: 200,
                    signature: data['signature']
                }
            });
            up.start()
        });
    }
    function randomName(len) {
        len = len || 23;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var str = '';
        for (i = 0; i < len; i++) {
            str += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return new Date().getTime() + str;
    }

    function getOssParams() {
        var defer = $.Deferred();
        if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
            defer.resolve(OSSParams);
        } else {
            $.ajax({
                url: '/zxcity_restful/ws/oss/ossUpload',
                dataType: 'json',
                success: function (data) {
                    OSSParams = data;
                    defer.resolve(data);
                },
                error: function () {
                    defer.reject();
                    parent.layer.closeAll();
                    parent.layer.msg("系统繁忙，请稍后再试!");
                }
            });
        }
        return defer.promise();
    }
};

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
//删除图片
function closeImg(dom) {
    $(dom).parents('.imgContent').remove();
    if ($('.pictureBox .noSrc').not(':hidden').length < 1 && $('.imgContent').length < 10) createImg();
    detaInteract();
}
function detaInteract() {
    var evt = new Event('detaInteract');
    evt.prefix = 'addActivity';
    var urllist = [];
    $('.imgShow').each(function () {
        if (this.src) urllist.push(this.src);
    })
    evt.params = {
        cover: $('#url').val(),
        name: $('#circleName').val(),
        startTime: $('#activityDate').val(),
        address: $('#address').val(),
        avePrice: $('#avePrice').val(),
        circleName: $('#selectCircle option:selected').text(),
        circleLogo: $('#selectCircle option:selected').attr('data-img'),
        applyQualification: $('input[name="radio"]:checked').val(),
        content: $('#circleDuc').val(),
        contentVideo: $('#videoUrl').val(),
        contentCoverUrl: $('.videoShow').attr('src'),
        contentUrl: urllist
    };
    parent.window.dispatchEvent(evt);
}
function unique(arr) {
    var newArr = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        　　　　if (newArr.indexOf(arr[i]) == -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
$('#cancelBtn').click(function () {
    parent.layer.closeAll();
})
var editType;
var canClick = true;
$('#submitBtn').click(function () {
    if (canClick == false){
        return false;
    }
    canClick = false;
    if (!/\S{4,25}$/.test($('#activityName').val())) {
        canClick = true;
        return parent.layer.msg('请正确输入4-20个字的活动名称')
    }
    if ($('#startDate').val() == "") {
        canClick = true;
        return parent.layer.msg('请选择活动开始时间')
    }
    if ($('#place').val() == "") {
        canClick = true;
        return parent.layer.msg('请选择活动地址')
    }   
    if (sumList.length < 1) {
        canClick = true;
        return parent.layer.msg('请选择参加人员')
    } else {
        var joinNum = sumList.length;
        var userIds = '';
        var circleId = '';
        for (let i = 0; i < sumList.length; i++) {
            if (i == sumList.length-1){
                userIds += sumList[i];
            }else{
                userIds += sumList[i] + ',';
            }
        }
        // cirList = unique(cirList);
        for (let j = 0; j < cirList.length; j++) {
            if (j == cirList.length - 1) {
                circleId += cirList[j];
            } else {
                circleId += cirList[j] + ',';
            }
        }
        var budget = Number($('#budget').val());
        var totalMoney = (joinNum * budget).toFixed(1);
    }
    // if ($('#url').val() == "" || !$('#url').val()) {
    //     return parent.layer.msg('请选择活动封面')
    // }    
    if ($('#processContent').html() == "") {
        canClick = true;
        return parent.layer.msg('请填写活动介绍')
    }
    if (editType == 0){
        if ($('#budget').val() == "" || !/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test($('#budget').val())) {
            canClick = true;
            return parent.layer.msg('请输入0-999999元的预算金额')
        }
        var cmd = "fans/createActivity"; 
        if ($('#approver').select2("data").length == 0 || $('#approver').select2("data")[0].id == "") {
            canClick = true;
            return layer.msg('请选择活动审批人')
        } else {
            var checkId = $('#approver').select2("data")[0].id;
        }
        var data = {
            userId: addActivity.params.userId,
            logo: $('#url').val(),
            name: $('#activityName').val(),
            startTime: $('#startDate').val(),
            userIds: userIds,
            circleId: circleId,
            place: $('#place').val(),
            process: $('#processContent').html(),
            perBudget: $('#budget').val(),
            joinNum: joinNum,
            totalMoney: totalMoney,
            lng: $('#lng').val(),
            lat: $('#lat').val(),
            merchantId: addActivity.params.merchantId,
            nextAudUser: checkId,
            type: 1
        }
    }else if (editType == 1){
        var cmd = "fans/updateCirclePerActivity"; 
        if ($('#approver').select2("data").length == 0 || $('#approver').select2("data")[0].id == "") {
            canClick = true;
            return layer.msg('请选择活动审批人')
        }else{
            var checkId = $('#approver').select2("data")[0].id;
        }
        var data = {
            // userId: addActivity.params.userId, 
            userId: addActivity.params.userId,
            id: addActivity.params.activityId,
            stepId: addActivity.params.stepId,
            logo: $('#url').val(),
            name: $('#activityName').val(),
            startTime: $('#startDate').val(),
            place: $('#place').val(),
            process: $('#processContent').html(),
            lng: $('#lng').val(),
            lat: $('#lat').val(),
            merchantId: addActivity.params.merchantId,
            nextAudUser: checkId,
            type: 2
        }
    }else if (editType == 2){
        if ($('#budget').val() == ""  || !/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test($('#budget').val()) ) {
            canClick = true;
            return parent.layer.msg('请输入0-999999元的预算金额')
        }
        var cmd = "fans/createActivity"; 
        var data = {
            // userId: addActivity.params.userId, 
            userId: addActivity.params.userId,
            logo: $('#url').val(),
            name: $('#activityName').val(),
            startTime: $('#startDate').val(),
            userIds: userIds,
            circleId: circleId,
            place: $('#place').val(),
            process: $('#processContent').html(),
            perBudget: $('#budget').val(),
            joinNum: joinNum,
            totalMoney: totalMoney,
            lng: $('#lng').val(),
            lat: $('#lat').val(),
            merchantId: addActivity.params.merchantId
        }
    }   
    addActivity.ajaxAsy(cmd, data, function (re) {
        if (re.code == 1) {
            parent.layer.msg('发布成功！')
            canClick = true;
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        } else {
            canClick = true;
            parent.layer.msg(re.msg);
        }
    })
})
