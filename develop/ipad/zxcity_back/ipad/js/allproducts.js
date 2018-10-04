//数据初始化
//菜单初始化
function loadNavList(data){
    if(data.length > 0){
        var sHtml = '';
        for(var i=0; i<data.length; i++){
            sHtml += '<li data-type="'+data[i].type+'" id="'+data[i].id+'" data-index="'+i+'" data-sort="'+data[i].sort+'"><a class="sub-content-link" href="javascript:void(0);">'+data[i].name+'</a><i class="glyphicon glyphicon-pencil edit-icon"></i><i class="remove-icon"></i></li>'
        }

        $(".aside-type-box ul").html(sHtml);
    }
}

//列表初始化
function loadContentList(data){
    var sHtml = '';
    sHtml += '<div class="sub-content content-'+i+'"><ul>'
    if(data.length > 0){
        var obj = data[i].list;
        for(var j=0; j<obj.length; j++){
            sHtml += '<li data-id="'+obj[i].id+'" data-type="'+obj[i].type+'">'
            + '<div class="pic"><img src="'+obj[j].img+'" alt=""></div>'
            + '<div class="info"><p class="name">'+obj[j].name+'</p><p class="price">'+obj[j].price+'</p>'
            + '</div></li>'
        }
    }
    sHtml += '<a class="add-content-pic" href="javascript:void(0);"></a></ul></div>';
    $(".type-content").html(sHtml);
}


function editType(_type, _typeName, _id){
    var sHtml = '<div class="pop-layer">'
        + '<div class="form-group"><label class="tit">选择类型</label>'
        + '<div><label class="radio-label"><input type="radio" value="1" name="productType" checked="checked">商品</label>'
        + '<label class="radio-label"><input type="radio" value="2" name="productType">服务</label>'
        + '</div></div>'
        + '<div class="form-group"><label class="tit">请输入类型名称</label>'
        + '<input type="text" class="form-control" name="typeName"></div>'
        + '<div class="form-group"><label class="tit">请输入排序号</label>'
        + '<input type="text" class="form-control" name="sortNum"></div>'
        + '<button class="btn" type="button">确定</button></div>'

    layer.open({
        title: false,
        type: 1,
        area: ['322px', '372px'], //宽高
        content: sHtml,
        success: function(layero, index){
            //如果参数存在，表示修改，否则表示新增
            if(_type && _typeName & _id){
                $(".pop-layer input[value="+_type+"]").prop("checked", true);
                $(".pop-layer input[name=typeName]").val(_typeName);
            }

            $(".pop-layer .btn").click(function(){
                var type = $(".pop-layer input[name=productType]:checked").val();
                var typeName = $(".pop-layer input[name=typeName]").val();
                var sortNum = $(".pop-layer input[name=sortNum]").val();
                if(typeName == ""){
                    layer.msg("请输入类型名称！");
                    return;
                }
                if(sortNum == ""){
                    layer.msg("请输入排序号！");
                    return;
                }
                if(_id){
                    $(".aside-type-box ul").find("li[data-id="+_id+"]").html(typeName+'<i class="remove-icon"></i>');
                    $(".type-content .content-"+_id).show().siblings().hide();

                }else{
                    var len = $(".aside-type-box ul").find("li").length;
                    var str1 = '<li data-type="'+type+'" id="'+data[i].id+'" data-index="'+i+'" data-sort="'+sortNum+'"><a class="sub-content-link" href="javascript:void(0);">'+typeName+'</a><i class="glyphicon glyphicon-pencil edit-icon"></i><i class="remove-icon"></i></li>'
                    $(".aside-type-box ul").append(str1);

                    var str = '<div class="sub-content content-'+len+'"><ul></ul>'
                        + '<a class="add-content-pic" href="javascript:void(0);"></a></div>';
                    $(".type-content").append(str);
                    $(".type-content .content-"+len).show().siblings().hide();
                }
                layer.close(index);
            });
        }
    });
}

//添加类别
$(".aside-type-box .add-type").click(function(){
    editType();
});
//点击类型切换
$(".aside-type-box ul").delegate("li .sub-content-link", "click", function(){
    var _index = $(this).parent().attr("data-index");
    $(".type-content .content-"+_index).show().siblings().hide();
});
//编辑类别
$(".aside-type-box ul").delegate("li .edit-icon", "click", function(event){
    var _id = $(this).parent().attr("id"),
        _type = $(this).parent().attr("data-type"),
        _typeName = $(this).find('.sub-content-link').html();
    editType(_type, _typeName, _id);
});
//删除类别
$(".aside-type-box ul").delegate("li .remove-icon", "click", function(event){
    event.stopProgapation();
    $(this).parent().remove();
    $(".type-content .content-"+$(this).parent().attr("data-index")).remove();
});

//点击标题切换到标题编辑
$(".page-title span").click(function(){
    $(".page-title input[type=text]").focus().val($(this).text());
    $(this).addClass("hidden").siblings().removeClass("hidden");
});
//输入框失焦显示输入内容
$(".page-title input[type=text]").blur(function(){
    var titleText = $(this).val();
    $(this).addClass("hidden").siblings().html(titleText).removeClass("hidden");
});

//编辑标题右侧内容
$(".detail-set-link a>i").click(function(){
    $(".detail-set-link input[type=text]").focus().val($(".detail-set-link a>span").text());
    $(".detail-set-link a").addClass("hidden").siblings().removeClass("hidden");
});
//输入框失焦显示输入内容
$(".detail-set-link input[type=text]").blur(function(){
    var titleText = $(this).val();
    $(".detail-set-link a>span").text(titleText);
    $(this).addClass("hidden").siblings().removeClass("hidden");
});

$(".detail-set-link a>span").click(function(){
    window.location.href="alldetail.html?title="+$(".detail-set-link a>span").text();
});

//添加商品
function addProductDialog(){

}

//添加服务
function addServiceDialog(){
    layer.open({
        type: 2,
        title: ['添加服务卡', 'height:46px;'],
        shadeClose: false,
        area: ['500px', '450px'],
        offset: '75px',
        anim: 5,
        content: ['addservice.html', 'no']
    });
}

//添加服务套餐
function addServiceCardDialog(){
    layer.open({
        type: 2,
        title: ['添加服务套餐', 'height:46px;'],
        shadeClose: false,
        area: ['900px', '580px'],
        offset: '75px',
        anim: 5,
        content: ['servicePackage.html', 'no']
    });
}

//添加图片
$(".type-content").delegate(".sub-content .add-content-pic", "click", function(){
    var _type = $(".aside-type-box ul").find("li.active").attr("data-type");
    if(_type == 1){
        addProductDialog();
    }else{
        var sHtml = '<div class="select-type-box"><div class="form-group">'
            //+ '<label><input type="radio" name="type" value="1">商品</label>'
            + '<label><input type="radio" name="type" value="2">服务卡</label>'
            + '<label><input type="radio" name="type" value="3">服务卡套餐</label></div>'
            + '<div class="form-group"><button type="button" class="btn btn-default">确定</button></div></div>';
        layer.open({
            type: 1,
            title: ['选择分类', 'height:46px;'],
            shadeClose: false,
            area: ['270px', '180px'],
            offset: '75px',
            anim: 5,
            content: sHtml,
            success: function(layro, index){
                $(".select-type-box .btn").click(function(){
                    var chk = $(".select-type-box input[type=radio]:checked").val();
                    if(chk){
                        if(chk == 2){
                            addServiceDialog();
                        }else{
                            addServiceCardDialog();
                        }
                        layer.close(index);
                    }else{
                        layer.msg("请选择要添加的产品类型！");
                        return;
                    }
                });
            }
        });
    }
});

//点击列表修改内容
$(".type-content").delegate(".sub-content ul>li .edit-btn", "click", function(){
    var id = $(this).attr("id"),
        type=$(this).attr("data-type");

}).delegate(".sub-content ul>li .remove-btn", "click", function(){
    var id = $(this).attr("id"),
        type=$(this).attr("data-type");
});
