var params;
var loading;
$(document).ready(function () {
    loading = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    params = getParams();
    getSelect(params);
});

// 多账号点击
$('.cardSty1e').on('click', '.cardBox', function () {
    $('.cardBox').removeClass('active');
    $(this).addClass('active');
})


//加载下拉框
var accountsList = [];
function getSelect(data) {
    var cmd = "customer/getSubaccountDetail";
    var datas = {
        merchantId: data.merchantId,
        memberId: data.id
    };
    ajaxAsync(cmd, datas, function (re) {
        if (re.code == 1) {
            if (re.data.accountsList) {
                accountsList = re.data.accountsList;
                var optBox = '';
                for (var i = 0; i < accountsList.length; i++) {
                    if (accountsList[i].discount == 0 || accountsList[i].discount == 100){
                        var discount = '无折扣';
                    }else{
                        var discount = (accountsList[i].discount / 10).toFixed(1) + '折';
                    }
                    if(i == 0){
                        optBox += `<div class="swiper-slide">
                            <div class="cardBox active" subaccountId="${accountsList[i].subaccountId}" principal="${Number(accountsList[i].principal).toFixed(2)}" usableInterest="${Number(accountsList[i].usableInterest).toFixed(2)}" periodTime="${accountsList[i].accountName}">
                                <div class="cardBoxTitle">${accountsList[i].accountName}</div>
                                <div class="cardBoxMoney">
                                    <div>本金余额
                                        <span>${Number(accountsList[i].principal).toFixed(2)}</span>
                                    </div>
                                    <div>卡项余额
                                        <span>${Number(accountsList[i].usableInterest).toFixed(2)}</span>
                                    </div>
                                    <div>会员折扣
                                        <span>${discount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }else{
                        optBox += `<div class="swiper-slide">
                            <div class="cardBox" subaccountId="${accountsList[i].subaccountId}" principal="${Number(accountsList[i].principal).toFixed(2)}" usableInterest="${Number(accountsList[i].usableInterest).toFixed(2)}" periodTime="${accountsList[i].accountName}">
                                <div class="cardBoxTitle">${accountsList[i].accountName}</div>
                                <div class="cardBoxMoney">
                                    <div>本金余额
                                        <span>${Number(accountsList[i].principal).toFixed(2)}</span>
                                    </div>
                                    <div>卡项余额
                                        <span>${Number(accountsList[i].usableInterest).toFixed(2)}</span>
                                    </div>
                                    <div>会员折扣
                                        <span>${discount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                }
                $('#account').append(optBox);
                var swiper = new Swiper('.swiper-container', {
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    slidesPerView: 3,
                    spaceBetween: 30,
                    freeMode: true,
                });
            }
        } else {
            layer.msg(re.msg);
        }
    })
};

// 通用异步请求
function ajaxAsync(cmd, datas, callback) {
    var data = JSON.stringify(datas);
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        headers: {
            apikey: 'test'
        },
        data: {
            cmd: cmd,
            data: data
        },
        beforeSend: function (request) {
            layer.load(1, { shade: [0.3, "#fff"] })
        },
        success: function (re) {
            callback(re);
        },
        error: function (re) {
            layer.msg('网络错误,稍后重试')
        },
        complete: function (re) {
            layer.closeAll();
        }
    });
}
function getParams() {
    var url = location.search;
    var param = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return param;
}
//返回值
var callbackdata = function () {
    var subaccountId = $('#account .cardBox.active').attr('subaccountId');
    var returnDate = {
        subaccountId: subaccountId
    };
    return returnDate;
}