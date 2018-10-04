(function($){
    var REQUEST_URL = {
        'list':'shopDisplayTerminal/queryShopBirthdayAccountList',//查询生日短信客户列表接口
        'send_msg':'shopDisplayTerminal/sendSMSBirthday'//发送生日祝福接口
    };
    var pageNo = 1, pageSize = 18, timeType = 1;
    var shopId = sessionStorage.getItem("shopId"),
        employeeId = sessionStorage.getItem("backUserId");

    function showListData(res){
        var sHtml = "";
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<li class="list-item" data-accountId="'+obj[i].accountId+'" data-accountName="'+obj[i].accountName+'" data-mobile="'+obj[i].mobile+'">'
                        + '<div class="row"><div class="small-3 columns">'
                        + '<div class="ava"><img src="../image/birth_ava.png"><i class="birth-icon"></i></div></div>'
                        + '<div class="small-6 columns info">'
                        + '<p class="name">'+obj[i].accountName+'</p>'
                        + '<p class="birth-date">生日：'+obj[i].birthday+'</p>'
                    if(obj[i].isToday == 1){
                        sHtml +=  '<p class="nowaday">今天</p>'
                    }

                    sHtml += '</div><div class="small-3 columns msg">'
                        + '<a href="javascript:;" class="send-msg-btn"><i class="icon"></i>'
                        + '<span class="txt">送祝福</span></a>'
                    if(obj[i].sendCount > 0){
                        sHtml +=  '<p class="send-msg-num">已发送'+obj[i].sendCount+'次</p>'
                    }
                        sHtml += '</div></div></li>'
                }
            }else{
                sHtml += '<li class="nodata">暂无数据</li>'
            }
            $("#birthList").html(sHtml);
        }else{
            layer.msg(res.msg);
        }
    }

    function getListData(){
        var param = {
            'shopId': shopId,
            'timeType': timeType,
            'pageNo':pageNo,
            'pageSize':pageSize
        };
        reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            showListData(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
                    showListData(resData);
                });
            })
            // if(resData.total > 0){
            //     $("#listPage").bootpag({
            //         total: Math.ceil(resData.total / pageSize),
            //         page: 1,
            //         leaps: false,
            //         maxVisible: 10
            //     }).on('page', function(event, num){
            //         param['pageNo'] = num;
            //         reqAjaxAsync(REQUEST_URL['list'], JSON.stringify(param)).done(function(resData){
            //             showListData(resData);
            //         });
            //     }).removeClass("invisible");
            // }else{
            //     $('#listPage').addClass("invisible");
            // }
        });
    }

    $("#birthList").delegate(".send-msg-btn", "click", function(){
        var accountId = $(this).parents(".list-item").attr("data-accountId"),
        accountName = $(this).parents(".list-item").attr("data-accountName"),
        mobile = $(this).parents(".list-item").attr("data-mobile");
        var sHtml = '<div class="add-box"><textarea id="msgTxt" maxlength="40" placeholder="祝福内容不超过40个字"></textarea></div>'
        layer.open({
            type: 1,
			title: '祝福短信内容',
			area: ['40%', '300px'], //宽高
			shadeClose: true, //开启遮罩关闭
			scrollbar: false,
			content: sHtml,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                var sendText = $.trim($("#msgTxt").val());
                if(sendText == ""){
                    layer.msg("请输入短信内容!");
                    return;
                }
                sendText = sendText.replace(/([\ud800-\udbff][\u0000-\uffff])/g,'');
                var param = {
                    'accountId': accountId,
                    'accountName': accountName,
                    'employeeId':employeeId,
                    'sendText':sendText,
                    'mobile':mobile
                };
                reqAjaxAsync(REQUEST_URL['send_msg'], JSON.stringify(param)).done(function(res){
                    if(res.code == 1){
                        layer.msg("发送成功!");
                        getListData();
                    }else{
                        layer.msg(res.msg);
                    }
                    layer.close(index);
                });
            },
            success: function(index, layero){
                $("#msgTxt").keyup(function(){
                    var txt = $(this).val();
                    if(isEmojiCharacter(txt)){
                        txt = txt.substring(0, txt.length-1);
                        console.log(txt);
                    }
                });
            }
        });
    });



    $(".main-tab .btn").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        timeType = $(this).index() + 1;
        getListData();
    });

    $(function(){
      getListData();
    });

    //返回
	$(".main-title .return-icon").click(function(){
		sessionStorage.setItem("prevPage", 10);
		$(this).attr("href", '../../index.html');
	});
})(jQuery)
