$("#setBgImg .set-bg-inner").delegate(".pic-show .pic", "click", function(){
    $(this).parent().toggleClass("selected").siblings().removeClass("selected");
    var id = $(this).parent().attr("id");
    //layer.msg(id);
});

//确定选择
$("#setBgImg .submit-btn").click(function(){
    var len = $("#setBgImg .set-bg-inner").find(".selected").length;
    if(len < 1){
        layer.alert("请选择背景图！");
        return;
    }
});

//删除图片
$("#setBgImg .set-bg-inner").delegate(".mask .remove-icon", "click", function(){
	event.stopPropagation();
	var id = $(this).parents(".pic-item").attr("id");
	//layer.msg(id);
});
