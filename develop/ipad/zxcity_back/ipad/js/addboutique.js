var editor = null;
//类型切换
$("#typeSelector").change(function(){
    var type = $(this).val();
    if(type == ""){
        layer.msg("请选择要添加的精品类型！");
        return;
    }
    if(type == 1){ //商品
        $(".content-box").html($("#productTemp").html());
        initKindEditor();
    }else if(type == 2){ //服务卡
        $(".content-box").html($("#serviceCardTemp").html());
        editor = null;
    }else if(type == 3){ //服务套餐
        $(".content-box").html($("#serviceTemp").html());
        initKindEditor();
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
    editor = KindEditor.create('textarea[name="detail"]', editorOptions);
    editor.readonly(false);
}

//清空内容
$("#resetBtn").click(function(){
    var type = $("#typeSelector").val();
    document.getElementById("mainForm").reset();
    $("#typeSelector").find("option[value="+type+"]").prop("selected", true);
    if(editor !== null){
        editor.readonly(false);
        editor.html("");
    }
});

//导入数据
$("#importBtn").click(function(){
    alert("导入");
    if(editor !== null){
        editor.readonly();
        editor.html("");
    }
});
