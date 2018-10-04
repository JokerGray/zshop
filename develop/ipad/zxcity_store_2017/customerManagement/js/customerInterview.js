(function($){
    var REQUEST_URL = {
        'list': 'shopDisplayTerminal/getCustomerInterviewDetail',//获取客户访谈页面接口
        'add':'shopDisplayTerminal/addCustomerInterview',//添加客户访谈接口
        'update_birth':'shopDisplayTerminal/updateCustomerBirthday'//修改客户生日接口
    };
    var employeeId = sessionStorage.getItem('backUserId'),
        employeeName = sessionStorage.getItem("username"),
        accountId = sessionStorage.getItem("accountId");
    var accountName = sessionStorage.getItem("accountName"),
    mobile = sessionStorage.getItem("accountMobile");
    var old_birthday = "";

    //日期选择
    $("#selDate").jeDate({
        isinitVal:true,
        skinCell:"mystyle",
        format:"YYYY-MM",
        isClear:false,
        isok:false,
        zIndex:3000,
        choosefun:function (elem, _date) {}
    });

    $(function(){
        $("#customerName").text(accountName);
        $("#customerMobile").text(mobile);
        getInterviewList();
    });

    //加载访谈数据
    function getInterviewList(){
        var param = {
            'accountId':accountId,
            'searchMonth': $("#selDate").text()
        };
        reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var sHtml = '', obj = res.data.interviewList;
                var birthday = res.data.birthday == "" ? "--" : res.data.birthday;
                $("#customerBirth").html(birthday);
                for(var i=0; i<obj.length; i++){
                    sHtml += '<li class="list-item">'
                        + '<div class="item-inner">'
                        + '<div class="desc">'+replaceHtmlCommon(obj[i].description)+'</div>'
                        + '<div class="waiter">访谈技师：'+obj[i].createrName+'</div>'
                        + '<div class="time">访谈时间：'+obj[i].createTime+'</div>'
                        + '</div></li>'
                }
                $(".list").find(".list-item:not(.add-item)").remove();
                $(".list .add-item").after(sHtml);
            }
        });

    }
    getInterviewList();

    $(".search-btn").click(function(){
        getInterviewList();
    });

    //更新客户生日
    $("#editBirthBtn").click(function(){
        old_birthday = $("#customerBirth").text();
        var sHtml = '<input type="text" placeholder="格式：2017-01-01" class="birth-input"><a class="save-btn" href="javascript:;"></a><a class="cancel-btn" href="javascript:;"></a>';
        $("#customerBirth").html(sHtml);
        if(old_birthday != "" && old_birthday != "--"){
            $("#customerBirth .birth-input").val(old_birthday);
        }
        $("#editBirthBtn").addClass("invisible");
    });
    $("#customerBirth").delegate(".save-btn", "click", function(){
        var reg = /^\d{4}(-)\d{2}\1\d{2}$/;
        var birthTxt = $.trim($("#customerBirth .birth-input").val());
        if(birthTxt == ""){
            layer.msg("请输入客户生日！");
            return;
        }
        if(!reg.test(birthTxt)){
            layer.msg("请按格式输入客户生日(如：2017-01-01)！");
            return;
        }
        var param = {
            'accountId':accountId,
            'birthday':birthTxt
        };
        var res = reqAjax(REQUEST_URL['update_birth'], JSON.stringify(param));
        if(res.code == 1){
            layer.msg("客户生日设置成功！");
            $("#customerBirth").html(birthTxt);
        }else{
            layer.msg(res.msg);
            $("#customerBirth").html("--");
        }
        $("#editBirthBtn").removeClass("invisible");
    }).delegate(".cancel-btn", "click", function(){
        old_birthday = old_birthday == ""?"--":old_birthday;
        $("#customerBirth").html(old_birthday);
        $("#editBirthBtn").removeClass("invisible");
    });

    //新增访谈内容
    $(".add-item .add-btn").click(function(){
        var sHtml = '<div class="add-box"><textarea id="newInterviewTxt" maxlength="80"></textarea></div>'
        layer.open({
            type: 1,
			title: '新增客户访谈内容',
			area: ['50%', '300px'], //宽高
			shadeClose: true, //开启遮罩关闭
			scrollbar: false,
			content: sHtml,
            btn: ['保存', '取消'],
            yes: function(index, layero){
                var description = $.trim($("#newInterviewTxt").val());
                if(description == ""){
                    layer.msg("请输入访谈内容！");
                    return;
                }
                description = description.replace(/([\ud800-\udbff][\u0000-\uffff])/g,'');
                var param = {
                    'employeeId':employeeId,
                    'employeeName':employeeName,
                    'accountId':accountId,
                    'accountName':accountName,
                    'description':description
                };
                reqAjaxAsync(REQUEST_URL['add'], JSON.stringify(param)).done(function(res){
                    if(res.code == 1){
                        layer.msg("访谈记录添加成功！");
                        getInterviewList();
                    }else{
                        layer.msg(res.msg);
                    }
                    layer.close(index);
                });

            },
            success: function(index, layero){

                $('#newInterviewTxt').keydown(function(){
                    var txt = $(this).val();
                    //alert(txt);
                    txt = txt.replace(/([\ud800-\udbff][\u0000-\uffff])/g,'');
                    $(this).val(txt);
                });
            }
        });
    });

})(jQuery);
