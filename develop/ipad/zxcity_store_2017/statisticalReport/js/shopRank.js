(function($){
    var REQUEST_URL = {
        'project':'shopStatistics/queryProductRankDetials',//排行-项目
        'account':'shopStatistics/queryAccountRankDetials',//排行-顾客
        'adviser':'shopStatistics/queryAdviserRankDetials'//排行-顾问/技师
    };
    //2017.12.15更改开始
    var shopList = JSON.parse(sessionStorage.getItem('shopList'));
    //2017.12.15更改结束

    //项目类型
    var PROJECT_TYPE = {
        '1':'商品',
        '2':'服务',
        '3':'服务卡',
        '4':'套餐'
    };

    var merchantId = sessionStorage.getItem("merchantId"),
        shopId = sessionStorage.getItem("shopId");
    var pageNo = 1, pageSize = 10;


    //项目数据渲染
    function showProjectList(res, categoryTxt){
        var sHtml = '';
        sHtml += '<thead><tr><th>项目名称</th><th>项目类型</th><th>'+categoryTxt+'数量</th></tr></thead><tbody>';
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr><td>'+obj[i].goodsName+'</td>'
      + '<td>'+PROJECT_TYPE[obj[i].goodsType]+'</td>'
      + '<td>'+obj[i].goodsNum+'</td>'
      + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="3">暂无数据</td></tr>';
            }
        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#listTable").html(sHtml);
    }

    //项目
    function getProjectList(){
        var summaryType = $(".rank-type-tab a.active").index() + 1;
        var categoryTxt = $(".rank-type-tab a.active").text();
        var timeType = $(".time-type-tab a.active").index() + 1;
        var param = {
            'merchantId':merchantId,
            'summaryType':summaryType,//*{1:销售},{2:消耗}
            'timeType':timeType,//*{1:日},{2:月},{2:年}
            'pageNo':pageNo,
            'pageSize':pageSize,
            'shopList':shopList//2017.12.15添加
        };

        reqAjaxAsync(REQUEST_URL['project'], JSON.stringify(param)).done(function(resData){
            showProjectList(resData, categoryTxt);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['project'], JSON.stringify(param)).done(function(resData){
                    showProjectList(resData, categoryTxt);
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
            //         reqAjaxAsync(REQUEST_URL['project'], JSON.stringify(param)).done(function(resData){
            //             showProjectList(resData, categoryTxt);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $("#listPage").addClass("invisible");
            // }
        });

    }

    //顾客数据渲染
    function showAccountList(res){
        var sHtml = '';
        sHtml += '<thead><tr><th>客户名称</th><th>电话</th><th>充值金额</th><th>本金</th><th>卡项资金</th><th>消费金额</th></tr></thead><tbody>';
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr><td>'+obj[i].accountName+'</td>'
      + '<td>'+obj[i].mobile+'</td>'
      + '<td>'+obj[i].recharge+'</td>'
      + '<td>'+obj[i].principal+'</td>'
      + '<td>'+obj[i].interest+'</td>'
      + '<td>'+obj[i].sale+'</td>'
      + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>';
            }
        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#listTable").html(sHtml);
    }

    //顾客
    function getAccountList(){
        var timeType = $(".time-type-tab a.active").index() + 1;
        var param = {
            'merchantId':merchantId,
            'timeType':timeType,//*{1:日},{2:月},{2:年}
            'pageNo':pageNo,
            'pageSize':pageSize,
            'shopList':shopList//2017.12.15添加
        };

        reqAjaxAsync(REQUEST_URL['account'], JSON.stringify(param)).done(function(resData){
            showAccountList(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['account'], JSON.stringify(param)).done(function(resData){
                    showAccountList(resData);
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
            //         reqAjaxAsync(REQUEST_URL['account'], JSON.stringify(param)).done(function(resData){
            //             showAccountList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $("#listPage").addClass("invisible");
            // }
        });

    }

    //顾问、技师数据渲染
    function showAdviserList(res){
        var sHtml = '';
        sHtml += '<thead><tr><th>员工名称</th><th>所属店铺</th><th>绩效金额</th><th>订单量</th></tr></thead><tbody>';
        if(res.code == 1){
            var obj = res.data;
            if(obj.length > 0){
                for(var i=0; i<obj.length; i++){
                    sHtml += '<tr><td>'+obj[i].salesman+'</td>'
      + '<td>'+obj[i].shopName+'</td>'
      + '<td>'+obj[i].salePrice+'</td>'
      + '<td>'+obj[i].saleNum+'</td>'
      + '</tr>';
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>';
            }
        }else{
            layer.msg(res.msg);
        }
        sHtml += '</tbody>';
        $("#listTable").html(sHtml);
    }

    //顾问、技师
    function getAdviserList(summaryType){
        var timeType = $(".time-type-tab a.active").index() + 1;
        var param = {
            'merchantId':merchantId,
            'timeType':timeType,//*{1:日},{2:月},{2:年}
            'summaryType':summaryType,//{1:顾问},{2:技师}
            'pageNo':pageNo,
            'pageSize':pageSize,
            'shopList':shopList//2017.12.15添加
        };

        reqAjaxAsync(REQUEST_URL['adviser'], JSON.stringify(param)).done(function(resData){
            showAdviserList(resData);
            pagingInit('#listPage',resData.total,pageSize,function (page) {
                param['pageNo'] = page;
                reqAjaxAsync(REQUEST_URL['adviser'], JSON.stringify(param)).done(function(resData){
                    showAdviserList(resData);
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
            //         reqAjaxAsync(REQUEST_URL['adviser'], JSON.stringify(param)).done(function(resData){
            //             showAdviserList(resData);
            //         });
            //
            //     }).removeClass("invisible");
            // }else{
            //     $("#listPage").addClass("invisible");
            // }
        });

    }

    function init(_index){
        switch (_index) {
        case 0:
            $(".rank-type-tab").show();
            getProjectList();
            break;
        case 1:
            $(".rank-type-tab").hide();
            getAccountList();
            break;
        case 2:
            $(".rank-type-tab").hide();
            getAdviserList(2);
            break;
        case 3:
            $(".rank-type-tab").hide();
            getAdviserList(1);
            break;
        default:
            $(".rank-type-tab").show();
            getProjectList();

        }
    }

    //切换
    $(".main-tab ul>li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index();
        $(".time-type-tab .tab-item:eq(0)").addClass("active").siblings().removeClass("active");
        init(_index);
    });
    $(".rank-type-tab .tab-item").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        init(0);
    });
    $(".time-type-tab .tab-item").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(".main-tab ul>li.active").index();
        init(_index);
    });

    $(function(){
        getProjectList();
    });

    //返回
    $(".return-icon").click(function(){
        sessionStorage.setItem("prevPage", 11);
        $(this).attr("href", '../../index.html');
    });

})(jQuery);
