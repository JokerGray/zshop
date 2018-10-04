(function($){
    //初始化编辑框
    initKindEditor();

    //导入
    $(".pplImport").click(function(){
        var index = window.parent.layer.open({
            type: 2,
            title: false,
            skin: 'layui-layer-rim', //加上边框
            area: ['410px', '412px'],
            shade: 0.8,
            content: ['import.html', 'no']
        });
    });

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
            editor.readonly(true);//只读
        });

    }




})(jQuery);
