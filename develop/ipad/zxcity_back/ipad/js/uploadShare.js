(function($){
    //初始化编辑框
    initKindEditor();

    /*
     * 编辑框
     */
    function initKindEditor(){
        KindEditor.ready(function(K) {
            editor = K.create('textarea[name="detail"]', {
                resizeType : 0,
                allowPreviewEmoticons : false,
                uploadJson : 'upload_detail_image.do',
                items : [ 'image', 'source', 'undo', 'redo', 'preview',
                    'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter',
                    'justifyright', 'justifyfull', 'insertorderedlist',
                    'insertunorderedlist', 'subscript', 'superscript',
                    'clearhtml', 'formatblock', 'fontname', 'fontsize',
                    'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'strikethrough', 'lineheight', 'removeformat', 'hr' ,'quickformat']
            });
        });

    }

    //文字超出部分提示
    function moreWord(event,num){
        $(event).each(function(){
            var val = $(this).val();
            var valLength = val.length;
            if(valLength>num){
                layer.msg("文字超出限制哦，请重新输入");
                $(this).val("");
            }
        });
    };

    //判断标题是否超出
    $(".form-title-input").blur(function(){
        moreWord($(this),30);
    });

    //统计标题字数
    $(".upload-form-title").on("keydown keyup",".form-title-input",function(){
        var total = $(this).val();
        $(".upload-form-num").text(total.length);
    });





})(jQuery);
