$(function(){
    //ios嵌入固定模板
    var sHtml=`<html  lang="en"> 
                <head> 
                    <Title></Title> 
                    <meta charset="UTF-8" name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
                    <style type="text/css"> 
                        img {
                            width:100%;
                            height:auto;
                            }
                        body {
                            font-size:16px;
                            word-wrap:break-word;
                        }
                        p{
                            color: gray;
                        }
                    </style>
                </head> 
                <body>`,
        eHtml='</body></html>',
        ranges = [
                    '\ud83c[\udf00-\udfff]',
                    '\ud83d[\udc00-\ude4f]',
                    '\ud83d[\ude80-\udeff]'
                 ];
    //加载清除缓存
    sessionStorage.removeItem('picArray');
    sessionStorage.removeItem('videoUrl');

    $('.form-control').on('keyup',function(){
        $(this).val($(this).val().replace(new RegExp(ranges.join('|'), 'g'), '').replace(/\s+/g, ''));
    })

    $('#cover').click(function(){//上传视频
        $('#uploadVideo').click();
    })

    var editor=KindEditor.create('#momentEdit',{//调用kindeditor
        items:['images'],
        cssData: 'body{font-size: 14px;color: #999999;}',
        resizeType: 0,
        width: '600px'
    });

    uploadOss({//上传视频
        btn: 'uploadVideo',
        imgDom: "videoPreview",
        flag: "editorVideo"
    });

    uploadOss({//上传图片
        btn: 'uploadPic',
        imgDom: "picPreview",
        flag: "send",
        editor: editor
    });
    
    KindEditor.lang({
        images: '添加图片'
    });
    KindEditor.plugin('images', function(K) {//kindeditor自定义插件
        var self = this,
            name = 'images';
        self.clickToolbar(name, function() {
            $('#uploadPic').click();
        });
    });

    $('#add').click(function(){//点击上传图片
        $('span[data-name=images]').click();
    })

    function getData(){//获取圈子数据
        $('#circleList').select2({
            width: 263,
            height :42,
            placeholder: '请选择圈子',
            language: "zh-CN",
            ajax: {
                url: "/zxcity_restful/ws/rest",
                type: "post",
                dataType: "json",
                delay: 250,
                headers: {
                    apikey: sessionStorage.getItem('apikey') || 'test'
                },
                data: function(params){
                    // 传递到后端的参数
                    return {
                        cmd: 'circle/listAllMyCircleInfo',
                        data: JSON.stringify({
                                isJoin: 2,
                                page: params.page || 0,
                                row: 10,
                                userId: GetQueryString('userId'),
                                keyword: params.term
                            }), 
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 0;
                    var list = data.data;
                    // for (var i = 0, len = d_l.length; i < len; i++) {
                    //     d_l[i].id = d_l[i].id;   //circleName 后台传回来需要显示的  根据自己需要写值
                    // }
                    return {
                        results: list,
                        pagination: {
                            more: (params.page) < data.total
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: function (state) {
                if (state.loading) {
                    return state.text;
                } else {
                    return '<span><img src="'+state.circlePortrait+'" class="img-flag" style="width:34px;height:34px;border-radius:5px;float:left;margin:3px 10px 3px 0;"/>'+state.circleName+'</span>';
                }
            },
            templateSelection: function (state) {
                if (state.id) {
                    return '<span><img src="'+state.circlePortrait+'" class="img-flag" style="width:34px;height:34px;border-radius:5px;float:left;margin:3px 10px 3px 0;"/>'+state.circleName+'</span>';
                }else{
                    return state.text
                }
            }
        });
    }
    getData();

    $('.tab').on('click',function(){//切换图文视频
        $('.tab').removeClass('active');
        $(this).addClass('active');
        if($('#'+$(this).attr('id')+'Box').css('display')=='block'){
           return;
        }
        $('.box').hide();
        $('#'+$(this).attr('id')+'Box').show();
        let video=$('#preview').find('video')[0];
    })



    $('#save').click(function(){//保存
        if($('#momentTitle').val().trim()==''){
            layer.msg('请输入动态标题');
            return;
        }else if((editor.html()==''&&$('#picBox').css('display')=='block')||($('#momentContent').val().trim()==''&&$('#videoBox').css('display')=='block')){
            layer.msg('请输入动态内容');
            return;
        }else if(!$('#circleList').val()){
            layer.msg('请选择圈子');
            return;
        }else if($('#momentTitle').val().trim().length<4){
            layer.msg('标题字数在4~25字以内');
            return;
        }
        var params={
            userId: GetQueryString('userId'),
            recordTitle: $('#momentTitle').val().trim(),
            circleId: $('#circleList').val(),
            isShowShop: 0
        },
        video=$('#videoPreview').find('video')[0];
        if($('#picBox').css('display')=='block'){
            if(sessionStorage.getItem('picArray')){
                params['contentType']=1;
                params['contentSource']=JSON.parse(sessionStorage.getItem('picArray'));
            }else{
                params['contentType']=0;
                params['contentSource']=[];
            }
            params['recordContent']=sHtml+editor.html()+eHtml;
        }else if($('#videoBox').css('display')=='block'){//视频
            if(sessionStorage.getItem('videoUrl')){
                params['contentType']=2;
                params['contentSource']=[{
                    videoTimesize:video.duration,
                    videoCover: sessionStorage.getItem('videoUrl')+'?x-oss-process=video/snapshot,t_0,m_fast',
                    videoWidth:video.clientWidth,
                    videoHeight: video.clientHeight,
                    videoUrl: sessionStorage.getItem('videoUrl')
                }];
            }else{
                params['contentType']=0;
                params['contentSource']=[];
            }
            params['recordContent']=sHtml+$('#momentContent').val()+eHtml;
        }
        reqAjaxAsync('circle/insertCircleRecord',JSON.stringify(params)).done(function(res){//新增动态接口
            if(res.code==1){
                layer.msg(res.msg);
                setTimeout(function(){
                    window.location.reload();
                },500)
            }else{
                layer.msg('发布失败');
            }
        })
    })
})  