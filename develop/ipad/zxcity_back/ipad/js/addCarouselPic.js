(function($){

    $(function(){
        $(".edit-pic-info").append($("#carouselTemplate").html());
        //初始化编辑框
        initKindEditor();
    });

    //点击数字切换
    $("#addPicBox .num-box").delegate(".pic-num", "click", function(){
        var _index = $(this).index();
        $(".edit-pic-info").find(".sub-form:eq("+_index+")").show().siblings().hide();
        initKindEditor();
    });

    //添加
    $("#addPicBox .add-btn").click(function(){
        var len = $("#addPicBox .num-box").find('.pic-num').length;
        if(len >= 5){
            layer.msg("亲，最多加5张图，不能再多咯~~~");
            return ;
        }
        var tempObj = $(".edit-pic-info").find(".sub-form:eq("+(len-1)+")");
        var picUrl = $(tempObj).find("input[name=picUrl]").val();
        if(picUrl == ""){
            layer.msg("请先上传图片，再增加新的图片内容！");
            return;
        }

        var str = '<span class="pic-num">'+(len+1)+'</span>';
        $("#addPicBox .num-box").append(str);
        $(".edit-pic-info").find(".sub-form:lt("+(len)+")").hide();
        $(".edit-pic-info").append($("#carouselTemplate").html());
        initKindEditor();
    });
    //移除
    $("#addPicBox .remove-btn").click(function(){
        var len = $("#addPicBox .num-box").find('.pic-num').length;
        if(len == 1){
            layer.msg("亲，都被删完啦，必须保留一张图~~~");
            return;
        }
        var tempObj = $(".edit-pic-info").find(".sub-form:eq("+(len-1)+")");
        var picUrl = $(tempObj).find("input[name=picUrl]").val();
        if(picUrl != ""){
            layer.confirm('确定要删除当前图片信息么？', {btn: ['确定','取消']}, function(index){
                $("#addPicBox .num-box").find(".pic-num:eq("+(len-1)+")").remove();
                $(".edit-pic-info").find(".sub-form:eq("+(len-1)+")").remove();
                $(".edit-pic-info").find(".sub-form:eq("+(len-2)+")").show();
                layer.close(index);
            }, function(index){
                layer.close(index);
            });
        }
    });


    function initKindEditor(){
        var editorOptions =  {
            resizeType : 0,
            allowPreviewEmoticons : false,
            uploadJson : 'upload_detail_image.do',
            readonlyMode : true,
            items : [ 'image', 'source', 'undo', 'redo', 'preview',
                'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter',
                'justifyright', 'justifyfull', 'insertorderedlist',
                'insertunorderedlist', 'subscript', 'superscript',
                'clearhtml', 'formatblock', 'fontname', 'fontsize',
                'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'strikethrough', 'lineheight', 'removeformat', 'hr' ,'quickformat']
        }
        var editor = KindEditor.create('textarea[name="detail"]', editorOptions);
    }


    //导入
    $(".edit-pic-info").delegate(".import-btn", "click", function(){
        window.parent.layer.open({
            type: 2,
            title: false,
            skin: 'layui-layer-rim', //加上边框
            area: ['410px', '412px'],
            shade: 0.8,
            content: ['import.html', 'no']
        });
    });


})(jQuery);
