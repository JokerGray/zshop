(function($){
    /**
     * 首页业务逻辑及相关操作
     */
    var cityId = 4201, pageNo = 1, pageSize = 10;

    //点击箭头滚动至内容显示区域
    $("#toShowContent").click(function(){
        var h = 0, topwrapH = $(".top-wrap").height();
        var _timer = setInterval(function(){
            h += 9;
            if(h < topwrapH+5){
                window.scrollTo(0, h);
            }else{
                clearInterval(_timer);
            }
        }, 1);

    });

    //视频精选排行
    function getAllCoolList(){
        var param = "{'cityId':"+cityId+", 'coolMorefield3 ':'hot', 'sStartpage':"+pageNo+",'sPagerows':"+pageSize+"}";
        var resData = CommonUtil.ajaxData("shopWeb/getAllCool", param);
        if(resData.code == 1){

        }
    }

    //加载约吧热销榜
    function getHotsellListData(){
        var param = "{'cityId':"+cityId+",'pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = CommonUtil.ajaxData("shopWeb/getTopRanking", param);
        if(resData.code == 1){
            var sHtml = '';
            var obj = resData.data;
            if(obj.length > 0){
                var len = obj.length > 9 ? 9 : obj.length;
                for(var i=0; i<len; i++){
                    sHtml += '<div class="list-con" data-uid="'+obj[i].serviceUserId+'">'
                        + '<div class="pull-left">'
                        + '<a class="pic" href="javascript:void(0);"><img src="'+obj[i].serviceUrl+'"></a>'
                        + '</div>'
                        + '<div class="pull-left detail">'
                        + '<p class="title">'+obj[i].serviceComment+'</p>'
                        + '<p><span class="label">'+obj[i].serviceName+'</span></p>'
                        + '<p class="num">【已售'+obj[i].orderNumber+'】</p>'
                        + '</div>'
                        + '</div>'
                }
            }else{
                sHtml = '暂无数据';
            }
            $(".hot-sell .item-list").html(sHtml);
        }
    }
    //getHotsellListData();

    //加载约吧牛人榜
    function getHotpersonListData(){
        var param = "{'cityId':"+cityId+",'pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = CommonUtil.ajaxData("shopWeb/getHotPersonList", param);
        if(resData.code == 1){

        }
    }
    //getHotpersonListData();
})(jQuery);
