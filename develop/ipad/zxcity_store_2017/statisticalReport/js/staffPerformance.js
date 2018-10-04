(function($){
    var REQUEST_URL = {
        'list':'shopStatistics/getBackUserAchievement'
    };
        // var shopList = [{shopId:1,shopName:'关谷店'}]
    var shopList = JSON.parse(sessionStorage.getItem("shopList"));
    var pageNo = 1, pageSize = 10;

    function loadShopList(){
        // if(shopList.length > 0){
        //     var shopArr = [{'id':'','text':'全部门店'}];
        //     for(var i=0; i<shopList.length; i++){
        //         var temp = {
        //             'id':shopList[i].shopId,
        //             'text':shopList[i].shopName
        //         }
        //         shopArr.push(temp);
        //     }
        //     //$("#shopSelector").html(sHtml);
        //     $('#shopSelector').select2({
        //         data:shopArr
        //     });
        // }
        if(shopList.length > 1){
            var shopArr = [{'id':'','text':'全部门店'}];
            for(var i=0; i<shopList.length; i++){
                var temp = {
                    'id':shopList[i].shopId,
                    'text':shopList[i].shopName
                };
                shopArr.push(temp);
            }
            //$("#shopSelector").html(sHtml);
            $('#shopSelector').select2({
                data:shopArr
            });
        }else{
            var shopArr = [{'id':shopList[0].shopId,'text':shopList[0].shopName}];
            $('#shopSelector').select2({
                data:shopArr
            });
            $('#shopSelector').attr('disabled','disabled');
        }
    }

    //日期选择
    initDate('#selDate','YYYY-MM');
    // $("#selDate").jeDate({
    //     isinitVal:true,
    //     skinCell:"mystyle",
    //     format:"YYYY-MM",
    //     isClear:false,
    //     isok:false,
    //     zIndex:3000,
    //     choosefun:function (elem, val, date) {
    //
    //     }
    // });

    function showListData(res){
        if(res.code == 1){
            var sHtml = '', obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr>'
                        + '<td>'+obj[i].user_name+'</td>'
                        + '<td>'+obj[i].achRecharge+'</td>'
                        + '<td>'+obj[i].achCard+'</td>'
                        + '<td>'+obj[i].achSale+'</td>'
                        + '<td>'+obj[i].achService+'</td>'
                        + '<td>'+obj[i].totelAch+'</td>'
                        + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>';
            }
            $("#listTable tbody").html(sHtml);
        }else{
            console.error(res.msg);
        }
    }

    function getStaffPerformanceList(){
        var staffName = $.trim($("#staffName").val());
        var shopListArr = shopList;

        if($("#shopSelector").val() != ""){
            shopListArr = [{'shopId':$("#shopSelector").val()}];
        }
        var param = {
            'shopList':shopListArr,
            'commMonth':$("#selDate").val(),
            'backUserName':staffName,
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
            //     $('#listPage').bootpag({
            //         total : Math.ceil(resData.total / 10),
            //         page : 1,
            //         leaps: false,
            //         maxVisible : 10
            //     }).on("page", function(event, num) {
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

    $(".search-btn").click(function(){
        getStaffPerformanceList();
    });

    $(function(){
        loadShopList();
        getStaffPerformanceList();
    });


    //返回
    $(".return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });
})(jQuery);
