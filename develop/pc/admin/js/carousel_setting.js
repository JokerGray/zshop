var layer = layui.layer;
var laytpl = layui.laytpl;
var laypage = layui.laypage;
var imgObj = {}, artImgObj = {};
$.extend({
    platform: function(){
        this.pages = 1;
        this.cRows = 1;
        this.url = {
            getCarousel: 'queryScCmsCarouseList',
            upDateCarousel: 'updateScCmsCarouse',
            addCarousel: 'insertScCmsCarouse',
            channel: 'queryChannel',
            article: 'queryArticle',
            ossUpdate: 'OssUpdateBy3'
        };
        this.artData = {
            channelId: '',
            articleTitle: '',
            pagination: {
                page: 1,
                rows: 5
            }
        };
    }
})
$.platform.prototype = {
    constructor: $.platform,
    getCarousel: function(){
        var _this = this;
        var res = reqNewAjax(_this.url.getCarousel);
        if(res.code != 1) {
            return layer.msg(res.msg);
        } else {
            var data = res.data || '';
            if(!isNull(data)) {
                if(data.length > 5) {
                    $('#labelTabFoot').hide();
                } else {
                    $('#labelTabFoot').show();
                }
                var getTpl = $('#carouselList').html();
                laytpl(getTpl).render(data, function (html) {
                    $("#labelTabCon").html(html);
                });
                $.each(data, function(i, e){
                     imgObj[e.scCmsCarouselId] = e.scCmsResourcesList || [];
                })
            } else {
                $("#labelTabCon").html('');
            }
        }
    },
    getArticle: function(d){
        var _this = this;
        var res = reqNewAjax(_this.url.article, d);
        if(res.code != 1) {
            return layer.msg(res.msg);
        } else {
            var data = res.data || '';
            var total = res.total || '';
            _this.pages = Math.ceil(total / _this.artData.pagination.rows);
            if(!isNull(data)) {
                var getTpl = $('#articleList').html();
                laytpl(getTpl).render(data, function (html) {
                    $("#addArtTableCon").html(html);
                });
                $.each(data, function(i, e){
                    artImgObj[e.articleId] = e.scCmsResourcesList || [];
                })
            } else {
                $("#addArtTableCon").html('');
            }
        }
    },
    getArtPage: function(pages, d){
        var _this = this;
        laypage({
            cont: 'artPage', 
            pages: pages, 
            skip: true, 
            skin: '#2BC6FF',
            groups: 3, 
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getArticle(d);
            }
        }); 
    }
}
$(function(){
    //禁止输入空格
    inhibitTrim('#inpSelArticle');
    inhibitTrim('#addAdvertLink');
    var start = new $.platform();
    start.getCarousel();
    //点击编辑按钮
    $('#labelTabCon').on('click', '.updateTotalOpera', function(){
        $('#confirmAddSub').attr('updataType', 1);
        //重置需要编辑的图片
        setCarousel('hide', 'show');
        $('.OSSFilesBox').append('<img id="selectedImg" src="">');
        var _this = this;
        reqNewAjaxAsync('queryChannel', {}).done(function(res){
            if(res.code != 1) return layer.msg(res.msg);
            if(res.code == 1) {
                var data = res.data || '';
                if(!isNull(data)) {
                    getChannel(data, $('#selChannel'));
                    var channelId = $(_this).siblings('.carouselChannel').attr('channelId');
                    if(channelId) {
                        $('#selChannel').val(channelId); 
                        isAddAdvert();
                    } else {
                        $('#selChannel').val('advert');
                        isAddAdvert();
                    }
                }
            }
        });
        var articleId = $(this).siblings('.carouselArticle').attr('articleId');
        $('#inpSelArticle').val($(this).siblings('.carouselArticle').html());
        $('#inpSelArticle').attr('articleId', articleId)
        $('#selectedImg').attr('src', $(this).siblings('.carouselImgTd').find('img').attr('src'));
        $('#confirmAddSub').attr('carouselId', $(this).siblings('.carouselId').html());
        var advertUrl = $(this).attr('advertUrl');
        if(advertUrl) {
            $('#addAdvertLink').val($(this).attr('advertUrl'));
        } else {
            $('#addAdvertLink').val('');
        }
        var carouselId = $(this).siblings('.carouselId').html();
        $('#addFartImgList').html(imgList(imgObj, carouselId))
    })
    //频道下拉框点击事件
    $('#selChannel').change(function(){
        //是否选中广告
        isAddAdvert();
        $('#inpSelArticle').val('');
        $('#addFartImgList').html('');
    })
    //点击选择打开文章列表弹窗
    $('#clickBtnToArt').click(function(){
        $('#artSearchInp').val('');
        var selectedId = $('#selChannel').val();
        $('#selArtChannel').html($('#selChannel').html());
        $("#selArtChannel option[value='advert']").remove();
        $('#selArtChannel').val(selectedId);
        start.artData.channelId = selectedId;
        start.artData.articleTitle = '';
        start.getArticle(start.artData);
        start.getArtPage(start.pages, start.artData);
    })
    //文章频道和轮播图频道需要同步
    $('#selArtChannel').change(function(){
        $('#selChannel').val($(this).val());
        start.artData.channelId = $(this).val();
        start.getArticle(start.artData);
        start.getArtPage(start.pages, start.artData);
    })
    //文章弹窗中的搜索功能
    $('#artSearchIcon').click(function(){
        start.artData.articleTitle = $('#artSearchInp').val();
        start.getArticle(start.artData);
        start.getArtPage(start.pages, start.artData);
    })
    $('#artSearchInp').on('keyup', function(e){
        if(e.keyCode == '13') {
            $('#artSearchIcon').click();
        }
    })
    //文章选中
    $('#addArtTableCon').on('click', '.artSelectBtn', function(){
        var articleId = $(this).parent().siblings('.articleTit').attr('articleId');
        var articleTit = $(this).parent().siblings('.articleTit').html();
        $('#inpSelArticle').val(articleTit);
        $('#inpSelArticle').attr('articleId', articleId);
        $('#addFartImgList').html(imgList(artImgObj, articleId));
        $('#selChannel').val($(this).attr('channelId'));
    })
    //点击查看文章详情
    $('#addArtTableCon').on('click', '.artCheckBtn', function(){
        var articleId = $(this).parent().siblings('.articleTit').attr('articleId');
        var artHref = '/articleDetail.html?userId=0&articleId=' + articleId;
        $(this).find('a').attr('href', artHref);
    })
    //从文章中选择图片
    $('#addFartImgList').on('click', '.artImgBox', function(){
        $('.artImgBox').find('.artImgIcon').removeClass('active');
        $(this).find('.artImgIcon').addClass('active');
    })
    $('#verifyBtn').click(function(){
        $('#clickDrawImg').addClass('show').removeClass('hide');
        var imgSrc = $('.artImgBox').find('.artImgIcon.active').siblings('img').attr('src');
        if(imgSrc.indexOf('zxcity-app.oss') != -1) return $('#selectedImg').attr('src', imgSrc);
        if(imgSrc.indexOf('zxcity-app.oss') == -1) {
            var randomName = random_string(32) + '.' + imgSrc.match(/\.([^\.]+)$/)[1];
            var res = reqNewAjax(start.url.ossUpdate, {imgUrl: imgSrc, imgName: randomName});
            if(res.code != 1) return layer.msg(res.msg);
            if(res.code == 1) {
                $('#selectedImg').attr('src', res.data);
            }
        }
    })
    //图片OSS上传
    initUpload(document.querySelector('.selLocalfiles'));
    //图片裁切
    $('.setCarouselBox').on('click', '#clickDrawImg', function(){
        var jcropApi;
        $('#selectedImg').Jcrop({
            setImage: function(){
                console.log(this.getBounds())
            },
            onSelect: function (obj){
            	$("#x1").val(obj.x);
            	$("#y1").val(obj.y);
            	$("#x2").val(obj.x2);
            	$("#y2").val(obj.y2);
            	$("#w").val(obj.w);
            	$("#h").val(obj.h);
                // var ratio = this.getBounds()[0] / 690;
                var srcStr = $('#selectedImg').attr('src');
                if(srcStr.indexOf('?') != -1) {
                    srcStr = srcStr.substring(0, srcStr.indexOf('?'));
                }          
                srcStr = srcStr + '?x-oss-process=image/crop,x_'+ Math.floor(obj.x) +',y_'+ Math.floor(obj.y) +',w_'+ Math.floor(obj.w) +',h_'+ Math.floor(obj.h) +',g_nw';
                console.log(srcStr)
                $('#selectedImg').attr('src', srcStr);
            },
            aspectRatio: 23/12
            // maxSize: [690, 360],
            // minSize: [69, 36]
        }, function() {
              jcropApi = this;
              console.log(jcropApi.getBounds())
        });
    })
    //保存修改
    $('#confirmAddSub').click(function(){
        var flag = true;
        if(isNull($('#selChannel').val()) || isNull($('#inpSelArticle').val()) || $('#selectedImg').attr('src') == ''){
            layer.msg('请填写完整!');
            flag = false;
            return;
        } else {
            var carUrl = '';
            var data = {
                scCmsCarouselId: '', 
                scCmsCarouselArticleId: $('#inpSelArticle').attr('articleId'),
                scCmsCarouselImg: $('#selectedImg').attr('src'),
                scCmsCarouselName: $('#inpSelArticle').val(),
                scCmsCarouselUrl: $('#addAdvertLink').val()
            }
            if($('#selChannel').val() != 'advert'){
                $('#addAdvertLink').val('');
                data.scCmsCarouselUrl = '';
            } else {
                if(isNull($('#addAdvertLink').val())){
                    layer.msg('请填写广告链接!');
                    flag = false;
                    return;
                }
                data.scCmsCarouselArticleId = 0;
            }
            if($(this).attr('updatatype') == 0) {
                carUrl = start.url.addCarousel;
                data.scCmsCarouselId = '';
            } else if($(this).attr('updatatype') == 1) {
                carUrl = start.url.upDateCarousel;
                data.scCmsCarouselId = $(this).attr('carouselId');
            }
            reqNewAjaxAsync(carUrl, data).done(function(res){
                if(res.code == 1) {
                    layer.msg(res.msg);
                    start.getCarousel();
                    flag = true;
                } else {
                    layer.msg(res.msg);
                    flag = false;
                }
            })      
            $('#clickDrawImg').addClass('hide').removeClass('show');
        }
        if(flag) return $('#confirmAddSub').attr('data-dismiss', 'modal');
    })
    //添加按钮轮播图：
    $('#addCarouselBtn').click(function(){
        $('#addFartImgList').html('');
        reqNewAjaxAsync('queryChannel', {}).done(function(res){
            if(res.code != 1) return layer.msg(res.msg);
            if(res.code == 1) {
                var data = res.data || '';
                if(!isNull(data)) {
                    getChannel(data, $('#selChannel'));
                }
            }
        });
        $('#addAdvertLink').val('');
        $('#inpSelArticle').val('');
        $('#confirmAddSub').attr('updataType', 0);
        setCarousel('hide', 'show');
        $('.OSSFilesBox').append('<img id="selectedImg" src="">')
    })
})

//获取频道下拉select
function getChannel(data, dom) {
    var html = '<option value="">请选择</option>';
    html += '<option value="advert">广告</option>';
    $.each(data, function(i, v) {
        html += "<option value='" + $.trim(v.channelId) + "'>" + v.channelName + "</option>";
    });
    dom.html(html);
}
//选择广告时添加广告链接
function isAddAdvert(){
    if($('#selChannel').val() == 'advert') {
        $('.addAdvertBox').addClass('show').removeClass('hide');
        $('.addAdvLabel').html('添加广告语');
        $('#clickBtnToArt').addClass('hide').removeClass('show');
        $('#selArtfiles').addClass('hide').removeClass('show');
    } else {
        $('.addAdvertBox').addClass('hide').removeClass('show');
        $('.addAdvLabel').html('添加文章');
        $('#clickBtnToArt').addClass('show').removeClass('hide');
        $('#selArtfiles').addClass('show').removeClass('hide');
    }
}
//图片OSS上传
function initUpload(dom){
    var uploader = new plupload.Uploader({
        browse_button: dom,
        url: 'http://oss.aliyuncs.com',
        multi_selection: true,
        filters: {
            mime_types : [{ //只允许上传图片和zip文件
                title : "图片文件", 
                extensions : "jpg,jpeg,gif,png,bmp" 
            }],
            max_file_size : '10mb', //最大只能上传400kb的文件
            prevent_duplicates : false //允许选取重复文件
        }
    });
    uploader.bind('FilesAdded', function(up, files){
        statrUpload(up);
        console.log('开始');
        $(dom).siblings('.OSSFilesBox').find('.progressContent').show();
        plupload.each(files, function(file) {
            console.log('进度条')
            $(dom).siblings('.OSSFilesBox').find('.progressContent .progress-bar').css({'width': file.percent + "%", 'background-color': '#2BC6FF'});
        });
    })
    uploader.bind('UploadProgress', function(up, file){
        console.log('正在进行');
        $(dom).siblings('.OSSFilesBox').find('.progressContent .progress-bar').css({'width': file.percent + "%", 'background-color': '#2BC6FF'});
    })
    uploader.bind('Error', function(up, err){
        layer.msg('错误');
        if (err.code == -600) {
            layer.msg("选择的文件过大");
        } else if (err.code == -500) {
            layer.msg('初始化错误')
        } else if (err.code == -601) {
            layer.msg("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
        } else if (err.code == -602) {
            layer.msg("这个文件已经上传过一遍了");
        } else {
            layer.msg("系统繁忙，请稍后再试!");
        }
    })
    uploader.bind('FileUploaded', function(up, file, info){
        if (info && info.status == 200) {
            setCarousel('show', 'hide');
            var src = OSSParams.host + '/' + OSSParams.dir + '/' + OSSParams.randomName;
            $('#clickDrawImg').addClass('show').removeClass('hide');
            $('.OSSFilesBox').append('<img id="selectedImg" src="">');
            $('#selectedImg').attr('src', src);
            $(dom).siblings('.OSSFilesBox').find('.progressContent').fadeOut(200);
            layer.msg('上传成功');
        } else {
            layer.msg("上传失败，请重试");
        }
    })
    uploader.init();
}
function statrUpload(up) {
    getOssParams().then(function(data){
        var fileName = data['dir'] + '/' + data['randomName'];
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
        up.start();
    })
}
var OSSParams;
function getOssParams() {
    var defer = $.Deferred();
    if (OSSParams && OSSParams.expire > new Date().getTime() / 1000) {
        OSSParams.randomName = random_string(32);
        defer.resolve(OSSParams);
    } else {
        $.ajax({
			url: '/zxcity_restful/ws/oss/ossUpload',
            dataType: 'json',
            success: function(data) {
                OSSParams = data;
                OSSParams.randomName = random_string(32);
                defer.resolve(data);
            },
            error: function() {
            	defer.reject();
                console.log('上传参数获取失败！')
            }
        });
    }
    return defer.promise();
}
//点击轮播图设置,需要重置要编辑的图片
function setCarousel(addC, removeC) {
    $('.jcrop-holder').remove();
    $('.OSSFilesBox img').remove();
    $('#selectedImg').remove();
    $('#clickDrawImg').addClass(addC).removeClass(removeC);
}
//获取img标签集合
function imgList(obj, num){
    var str = '';
    $.each(obj[num], function(i,e){
        str += '<div class="artImgBox"><img src="'+ e.resourcesUrl +'" alt=""><i class="artImgIcon"></i></div>'
    })
    return str;
}