(function($){
    var REQUEST_URL = {
        'detail':'shop/getOne',//详情
        'updateFav':'shop/updateFav',//点赞
        'delFav':'shop/delFav',//取消点赞
        'report':'base/addReportInformation'//举报
    };
    var srcArr = [];
    var oRole = sessionStorage.getItem("roleInfo");
    var id = getUrlParams("id"),
        projectType = getUrlParams("type"),
        userId = getUrlParams("userId") == "" ? sessionStorage.getItem("userId") : getUrlParams("userId"),
        backUserId = sessionStorage.getItem("backUserId");

    // 初始化清空页面
    function reset(){
        $(".show-info").empty();
        $("#txtCaption").empty();
        $(".show-author-name").empty();
        $(".show-author-date").empty();
    }

    //加载方案内容
    function loadProjectInfo(){
        var param = {
            'id':id,
            'backUserId':backUserId,
            'userId':userId
        };

        reqAjaxAsync(REQUEST_URL['detail'], JSON.stringify(param)).done(function(res){
            console.log(res);
            if(res.code == 1){
                $("#txtCaption").text(res.data.title);
                var userHead = res.data.userHead ? res.data.userHead :"../image/touxiang.png";
                $(".show-artice-img").attr("src", userHead);
                if(!res.data.institution || res.data.institution == ""){
                    $(".show-author-name").html(res.data.author);
                }else{
                    $(".show-author-name").html(res.data.author+"<em class='user-institution'>（"+res.data.institution+"）</em>");
                }

                $(".show-author-date").text(res.data.createTime);
                $(".show-info").html(res.data.content);

                if(res.data.isFav && res.data.isFav == 1){
                    $("#favBtn").attr("data-isFav", 1).addClass("active").text("已赞");
                }else{
                    $("#favBtn").attr("data-isFav", 0).removeClass("active").text("点赞");
                }

                var imgArr = $(".show-info").find("img");
                $.each(imgArr, function(i, item){
                    $(item).attr("src", $(item).attr("src")+"?x-oss-process=image/format,jpg");
                    $(item).wrap('<a data-index="'+i+'" class="img-show" href="javascript:;"></a>');
                    srcArr[i] = $(item).attr("src");
                });
            }else{
                layer.msg(res.msg);
            }
        });

    }

    $(".show-info").delegate(".img-show","click", function(){
        window.location.href="hyb-image-preview:"+$(this).attr("data-index")+';'+srcArr;
    });

    $(function(){
        reset();
        loadProjectInfo();
    });

    //绑定点赞和取消事件
    $("#favBtn").click(function(){
        var txt = $(this).text(),
            isFav = $(this).attr("data-isFav");
        var param = {
            'id':id,
            'userId':userId,
            'backUserId':backUserId
        };
        if(isFav == 1){
            reqAjaxAsync(REQUEST_URL['delFav'], JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    $("#favBtn").attr("data-isFav", 0).removeClass("active").text("点赞");
                }else{
                    layer.msg(res.msg);
                }
            });

        }else{
            reqAjaxAsync(REQUEST_URL['updateFav'], JSON.stringify(param)).done(function(res){
                if(res.code == 1){
                    $("#favBtn").attr("data-isFav", 1).addClass("active").text("已赞");
                }else{
                    layer.msg(res.msg);
                }
            });
        }
    });

    //举报
    $("#reportBtn").click(function(){
        var sHtml = '<div class="report-box">'
            + '<div class="reason-choose"><label><input name="report-type" type="radio" value="色情">色情</label>'
            + '<label><input name="report-type" type="radio" value="低俗">低俗</label>'
            + '<label><input name="report-type" type="radio" value="政治">政治</label>'
            + '<label><input name="report-type" type="radio" value="侵权">侵权</label>'
            + '<label><input name="report-type" type="radio" value="其他原因">其他原因</label>'
            +'</div>'
            + '<div class="reason-txt"><textarea id="otherReason" placeholder="请输入其他举报原因"></textarea></div></div>';
        layer.open({
            type: 1,
            title: ['举报'],
            shadeClose: true,
            scrollbar:false,
            content: sHtml,
            btn: ['确定', '取消'],
            yes: function(index){
                var chkTxt = $(".report-box").find("input[name=report-type]:checked").val();
                var reason = "";
                if(chkTxt == "其他原因"){
                    if($.trim($("#otherReason").val()) == ""){
                        layer.msg("请填写其他举报原因");
                        return;
                    }
                    reason = $("#otherReason").val();
                }else{
                    reason = chkTxt;
                }
                var param = {
                    'reviewType':'131',//后台固定参数，写死必传
                    'reviewId':id,//方案id
                    'reason':reason
                };

                reqAjaxAsync(REQUEST_URL['report'], JSON.stringify(param)).done(function(res){
                    if(res.code == 1){
                        layer.msg("举报成功！");
                    }else{
                        layer.msg(res.msg);
                    }
                    layer.close(index);
                });

            },
            cancel:function(index){
                layer.close(index);
            },
            success:function(layero,index){
                $(".report-box textarea").attr("disabled", "disabled");
                $(".report-box input[name=report-type]").click(function(){
                    $("#otherReason").val("");
                    if($(this).prop("checked") && $(this).val() == "其他原因"){
                        $(".report-box textarea").removeAttr("disabled");
                    }else{
                        $(".report-box textarea").attr("disabled", "disabled");
                    }

                });
            }
        });
    });

    $(".return-icon").click(function(){
        location.href = "list.html?type="+projectType;
    });

})(jQuery);
