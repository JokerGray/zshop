function initKindEditor(){
    var editorOptions =  {
        resizeType : 0,
        allowPreviewEmoticons : false,
        uploadJson : 'upload_detail_image.do',
        //readonlyMode : true,
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
initKindEditor();

//选择规格子属性
$(".type-list ul").delegate("li .sub-item-list label", "click", function(){
    if($(this).find("input[type=checkbox]").prop('checked')){
        $(this).parents("li").find(".select-icon").addClass("selected");
    }else{
        var len = $(this).parent().find("input[type=checkbox]:checked").length;
        if(len == 0){
            $(this).parents("li").find(".select-icon").removeClass("selected");
        }
    }
}).delegate("li .select-icon", "click", function(){
    $(this).toggleClass("selected");
    if(!$(this).hasClass("selected")){
        $(this).parent().find("input[type=checkbox]").prop('checked',false);
    }
});

//选择添加
$(".type-list .btn-box .submit-btn").click(function(){
    var selectedLen = $(".type-list ul").find("li .select-icon.selected").length;
    if(selectedLen < 1){
        layer.msg("请选择商品规格！");
        return;
    }
    var aLi = $(".type-list ul").find("li");
    var arr = [], temp = {}, tid = "", typeStr = "", emptyStr = '';
    $.each($(aLi), function(i, item){
        if($(item).find(".select-icon").hasClass("selected")){
            tid = $(item).find(".select-icon").attr("data-id");

            var subItemList = $(item).find(".sub-item-list label");
            var subArr = [];
            $.each($(subItemList), function(){
                if($(this).find("input[type=checkbox]").prop("checked")){
                    subArr.push($(this).find("input[type=checkbox]").val());
                }
            });
            if(subArr.length < 1){
                emptyStr += $(item).find(".item-name").text()+'，';
            }else{
                typeStr += $(item).find(".item-name").text()+'，';
                temp[tid] = subArr;
                arr.push(subArr);
            }
        }
    });
    if(emptyStr != ''){
        layer.alert("【"+emptyStr.substring(0,emptyStr.length-1)+"】没有选择规格子属性，请选择子属性或者取消选择！");
        return;
    }else if(arr.length == 0){
        layer.alert("请选择商品规格！");
        return;
    }
    var sHtml = '';
    typeStr  = typeStr.substring(0, typeStr.length-1)
    sHtml += '<thead><tr><th>'+typeStr+'</th><th>数量</th><th>价格</th><th></th></tr></thead>';
    sHtml += '<tbody>'
    console.log(arr);
    var resultArr = doExchange(arr);
    for(var i=0; i<resultArr.length; i++){
        sHtml += '<tr><td>'+resultArr[i]+'</td>'
            + '<td><input type="text" class="num"></td><td><input type="text" class="price"></td>'
            + '<td><i class="glyphicon glyphicon-trash"></i></td>'
            + '</tr>'
    }

    sHtml += '</tbody>';
    $("#typeShowTable").html(sHtml);
});

function doExchange(arr){
    var len = arr.length;
   if(len>=2){
       var len1 = arr[0].length;
       var len2 = arr[1].length;
       var newlen = len1*len2;
       var temp = new Array(newlen);
       var index = 0;
       for(var i=0;i<len1;i++){
           for(var j=0;j<len2;j++){
               temp[index] = arr[0][i]+'，'+arr[1][j];
               index += 1;
           }
       }
       var newArray = new Array(len-1);
       for(var i=2;i<len;i++){
           newArray[i-1] = arr[i];
       }
       newArray[0] = temp;
       return doExchange(newArray);
   }
   else{
       return arr[0];
   }
}

function showTypeItemList(){
    var sHtml = '', subList = [];
    sHtml += '<li class="type-item clearfix">'
        + '<a class="select-icon selected" href="javascript:void(0);"></a>'
        + '<span class="item-name pull-left">大小</span>'
        + '<div class="sub-item-list pull-left">'
    for(var j=0; j<subList.length; j++){
        sHtml += '<label><input type="checkbox" value="'+subList[j].id+'">'+subList[j].name+'</label>'
    }

    sHtml += '</div></li>';
}


//自定义添加
$(".type-list .btn-box .diy-type-btn").click(function(){
    var sHtml = '<div class="add-type-box"><form>'
        + '<div class="form-group"><label>规格名称：</label><input type="text" name="name" maxLength="10"></div>'
        + '<div class="form-group"><label>子项内容：</label><input type="text" name="subItem" maxLength="10"><button type="button" class="btn add-btn">添加</button></div>'
        + '<div class="form-group clearfix"><ul class="item-list"></ul></div>'
        + '<div class="form-group"><button type="button" class="btn submit-btn">确定</button></div>'
        + '</form></div>'

    layer.open({
        type: 1,
        title: ['自定义添加规格', 'height:46px;'],
        shadeClose: false,
        area: ['400px', '500px'],
        offset: '75px',
        anim: 5,
        content: sHtml,
        success: function(layro, index){
            //添加子项
            $(".add-type-box .add-btn").click(function(){
                var subItem = $(".add-type-box input[name=subItem]").val();
                if($.trim(subItem) == ""){
                    layer.msg("请输入子项名称！");
                    return;
                }
                var str = '<li><span>'+subItem+'</span><a class="glyphicon glyphicon-minus-sign remove-btn" href="javascript:;"></a></li>';
                 $(".add-type-box input[name=subItem]").val("")
                $(".add-type-box .item-list").append(str);
            });
            //删除子项
            $(".add-type-box").delegate(".item-list li .remove-btn", "click", function(){
                $(this).parent().remove();
            });
            //确认添加规格
            $(".add-type-box .submit-btn").click(function(){
                var name = $(".add-type-box input[name=name]").val(),
                    subItem = $(".add-type-box input[name=subItem]").val(),
                    len = $(".add-type-box .item-list").find("li").length;
                if($.trim(name) == ""){
                    layer.msg("请输入规格名称！");
                    return;
                }
                if(len < 1){
                    layer.msg("每种规格至少有一个子项，请添加规格子项内容！");
                    return;
                }
            });

        }
    })
});
