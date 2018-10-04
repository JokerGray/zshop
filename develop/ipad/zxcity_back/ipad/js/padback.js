
    $(".show-menu ul>li").click(function(){
        var dataRel = $(this).attr("data-rel");
        $("#pageFrame").attr("src", dataRel+'.html');
        //导航切换效果
        var $i = $(".show-menu li i");
        $(this).siblings("li").removeClass("show-menu-active");
        $(this).addClass("show-menu-active");
        $i.removeClass("iActive");
        $(this).find("i").addClass("iActive");
    });

    //初始化菜单名称
    function initMenu(){

    }

    //编辑菜单
    $(".show-menu li .edit-btn").click(function(event){

        event.stopPropagation();
        var _that = this;
        //获取旧的导航名称
        var oldText = $(_that).siblings(".menu-text").text();
        //弹框内容
        var sHtml = '<div class="menu-edit-box">'
        + '<div class="form-group"><input type="text" name="menuText" class="form-control" maxlength="4" value="'+oldText+'"></div>'
        + '<div class="form-group"><button type="button" class="btn submit-btn">确定</button></div></div>';
        layer.open({
            title: '编辑导航名称',
            type: 1,
            area: ['300px', '200px'], //宽高
            content: sHtml,
            success: function(layero, index){
                //点击确定按钮
                $(".menu-edit-box .btn").click(function(){
                    //获取新输入的名称
                    var newText = $.trim($(".menu-edit-box input[name=menuText]").val());
                    //是否非空
                    if(menuText == ""){
                        layer.msg("导航名称不能为空！");
                        return;
                    }
                    //是否与旧名称相同
                    if(newText == oldText){

                    }
                    //将新输入的名称写入菜单中
                    $(_that).siblings(".menu-text").text(newText);
                    layer.close(index);
                });
            }
        });
    });

    $("#styleSetBox .bg-set .reselect-btn").click(function(){
        window.parent.layer.open({
            type: 2,
            title: ['设置背景图片', 'height:46px;'],
            shadeClose: false,
            area: ['860px', '750px'],
            offset: '75px',
            anim: 5,
            content: ['setbgimg.html', 'no']
        });
    });

    //风格设置
    $("#styleSetBox .style-choose input[name=styleType]").click(function(){
        var styleType = $(this).val();
        sessionStorage.setItem("styleType", styleType);
        window.location.reload();
    });

    $(function(){
        var styleType = sessionStorage.getItem("styleType");
        $("#styleSetBox .style-choose input[value="+styleType+"]").prop("checked", true);
    });
