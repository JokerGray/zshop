(function($){
    var page = 1;
    var rows = 15;
    var locked = true;
    var userNo = yyCache.get("userno") || "";
    var username = yyCache.get("username") || "";
    var reviewId = sessionStorage.getItem("reviewId") || ""; //id
    var reviewUrl = sessionStorage.getItem("reviewUrl") || ""; //url
    var reviewType = sessionStorage.getItem("reviewType") || ""; ////1-审核 2-查看
    var opinion = sessionStorage.getItem("reviewOpinion") || "";
    var reviewStatu = sessionStorage.getItem("reviewStatu") || "";
    var pid = '';
    var userId = sessionStorage.getItem('lockUserId');
    var USER_URL = {
        COMPLAINHAND : 'operations/complaintHandling',//(审核)
        USERLOCK: 'operations/userStatusToggle'
    };

    var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
        form = layui.form;
    })

    if(reviewType == 1){
        $(".detail_box").find(".rightCon").eq(0).show();
        $(".detail_box").find(".rightCon").eq(1).hide();
    }else{
        $(".detail_box").find(".rightCon").eq(1).show();
        $(".detail_box").find(".rightCon").eq(0).hide();
        $("#reviewOpinion1").val(opinion);
        if(reviewStatu==1){
            $("#passResult").text("审核通过");
        }else if(reviewStatu==2){
            $("#passResult").text("审核未通过");
        }
    }

    $("#articFrame").attr("src",reviewUrl);

    //返回
    $("#backBtn").click(function(){
        history.back();
    });
    $("#backBtn1").click(function(){
        history.back();
    });

    //通过不通过切换时的交互
    form.on('radio(radios)', function(data){
        var val= data.value;
        if(val == 2){
            $(".noreom").show();
            document.getElementById('noResi').checked=true;
            var tex = $("input[name='reson']").eq(0).val();
            $("#reviewOpinion").val(tex);
        }else if(val == 1){
            $(".noreom").hide();
            $("#reviewOpinion").val("");
        }
        form.render();
    });

    //不予通过原因切换
    form.on('radio(resions)', function(data){
        var val= data.value;
        $("#reviewOpinion").val(val);
    });

    //审核
    $("#saveBtn").click(function(){
        var status = $("input[name='sex']:checked").val();
        var val = $.trim($("#reviewOpinion").val());
        var param = {
            id:reviewId,
            status:status, // 审核状态 0-未审核 1-审核已通过 2-审核未通过
            reviewOpinion:val, // 审核意见
            userName:username //审核人名称
        }
        if(locked){
            locked = false;
            //检测 修改 审核状态
            reqAjaxAsync(USER_URL.COMPLAINHAND, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                    //判断是否 锁定此账户 1 锁定 
                    var lockValue = $('input[name="lock"]:checked').val();
                    if (lockValue == 1) {
                        var lockParam = {
                            userId: userId
                        }
                        reqAjaxAsync(USER_URL.USERLOCK, JSON.stringify(lockParam)).done(function (res) {
                            if (res.code == 1) {
                                layer.msg(res.msg);
                                setTimeout(function () {
                                    history.back();
                                }, 500);
                            } else {
                                layer.msg(res.msg);
                                locked = true;
                            }
                        });
                    } else {
                        layer.msg(res.msg);
                        setTimeout(function () {
                            history.back();
                        }, 500);
                    }
                } else {
                    layer.msg(res.msg);
                    locked = true;
                }
            });
        }
    });

})(jQuery);