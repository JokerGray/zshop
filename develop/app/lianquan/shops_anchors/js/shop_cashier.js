$(function(){
    //根据参数名获取地址栏URL里的参数
    function getUrlParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
        r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
        return decodeURI(decodeURIComponent(r[2]));
        }
        return "";
    }
    // 店铺信息
    var shopId=getUrlParams('shopId');
    $('#hidImg').attr('data-shopid',shopId);
    // 切换页面
    $('.cash_btn').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var type=$(this).attr('data-type');
        var myshopId=$('#hidImg').attr('data-shopid');
        if(type=="0"){
            $('#iframes').attr("src","shop_anchors.html?shopId="+myshopId);
        }else if(type=="1"){
            $('#iframes').attr("src","balance_record.html?shopId="+myshopId);
        }
    });
    $('.cash_btn').eq(0).trigger('click');
});
