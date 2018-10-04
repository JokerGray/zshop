(function($){
    var shopId = sessionStorage.getItem("shopId"),
        employeeId = sessionStorage.getItem("backUserId"),
        shopName = sessionStorage.getItem("shopName");

    //销售报表
    var salesChart = echarts.init(document.getElementById('salesChart'));
    //消耗报表
    var consumptionChart = echarts.init(document.getElementById('consumptionChart'));

    var REQUEST_URL = {
        barDataUrl: 'shopStatistics/queryShopAchInfoSummeryDetials',//销售消耗柱状图
        //presaleUrl: 'shop/shopHomePagePresale',//定金预售
        largessUrl: 'shopStatistics/shopHomePageLargess',//门店赠送
        hotGoodsUrl: 'shopStatistics/shopHomePageHotGoods',//产品销售排行
        accountContributeUrl: 'shopStatistics/shopHomePageMaxAccountContribute',//客户贡献
        employeeContributeUrl: 'shopStatistics/shopHomePageMaxEmployeeContribute',//员工贡献
        sheGoUrl: 'shopStatistics/shopHomePageSheGo',//今日她来、功劳
        remindUrl: 'shopStatistics/myHomePageRemind'//提醒
    };

    //柱形图参数设置
    function barOptionSet(params){
        var option = {
            grid: {
                top: '3%',
                left: '5%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer:{
                    type: 'shadow'
                }
            },
            legend:{
                selectedMode: false,
            },
            xAxis: {
                axisTick: {
                    alignWithLabel: true
                },
                data: params.date
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '金额',
                type: 'bar',
                barWidth : '20px',
                data: params.num
            }]
        };
        return option;
    }

    //门店消耗销售业绩
    function storeHomePageAch(){
        var param = "{'shopId': " + shopId + ",'timeType': 2}";
        reqAjaxAsync(REQUEST_URL.barDataUrl, param).done(function(res){
            if(res.code == 1){
                var obj = res.data;
                var dateArr = [], salesArr = [], consumeArr = [];
                for(var i=0, len = obj.length; i<len; i++){
                    dateArr.push(obj[i].time);
                    salesArr.push(obj[i].salePrice);
                    consumeArr.push(obj[i].consumePrice);
                }
                salesChart.setOption(barOptionSet({'date':dateArr, 'num':salesArr}));
                consumptionChart.setOption(barOptionSet({'date':dateArr, 'num':consumeArr}));
            }
        });

    }

    //定金预售
    function storePresale(){
        var param = "{'shopId': " + shopId + "}";
        reqAjaxAsync(REQUEST_URL.presaleUrl, param).done(function(res){
            if(res.code == 1){
                $("#actualPay").text(res.data.actualPay);
                $("#balance").text(res.data.balance);
                var obj = res.data.accountList, sHtml = '';
                if(obj.length > 0){
                    for(var i=0, len=obj.length; i<len; i++){

                        if(i%2 == 0){
                            sHtml += '<div class="small-6 columns">';
                        }
                        sHtml += '<div class="item" data-accountId="'+obj[i].accountId+'">'
                            + '<p class="sub-title"><a href="javascript:void(0);">'+obj[i].accountName+'</a></p>'
                            + '<span class="color-grey count-num">'+obj[i].num+'</span>'
                            + '</div>';
                        if(i%2 == 1){
                            sHtml += '</div>';
                        }
                    }
                }else{
                    sHtml += '<div class="nodata"><p>今日暂无预售</p></div>';
                }
                $("#accountList").html(sHtml);
            }
        });

    }

    //哪个产品卖得最好
    function hotGoods(){
        var param = "{'shopId': " + shopId + "}";
        reqAjaxAsync(REQUEST_URL.hotGoodsUrl, param).done(function(res){
            if(res.code == 1){
                var obj = res.data.goodsList, sHtml = '';
                sHtml += '<div class="small-7 columns hot-goods">';
                if(obj.length > 0){
                    for(var i=0, len=obj.length; i<len; i++){
                        sHtml += '<div class="item">'
                            + '<p class="sub-title"><a data-type="'+obj[i].type+'" href="javascript:void(0);" data-goodsId="'+obj[i].goodsId+'" data-type="'+obj[i].type+'">'+obj[i].name+'</a></p>'
                            + '<span class="color-grey count-num">'+obj[i].price+'</span>'
                            + '</div>';
                    }
                }else{
                    sHtml += '<div class="nodata"><p>今日暂无产品出售</p></div>';
                }
                sHtml += '</div>';
                sHtml += '<div class="small-5 columns consume">'
                    + '<div class="item">'
                    + '<p class="sub-title"><a href="javascript:;">今日消耗</a></p>'
                    + '<span class="color-grey count-num">'+res.data.consumePrice+'</span></div></div>';

                $(".module-4 .module-con").html(sHtml);
            }else{
                console.error(res.msg);
            }
        });

    }

    //哪个客户贡献最大
    function getCustomerContribute(){
        var param = "{'shopId': " + shopId + "}";
        reqAjaxAsync(REQUEST_URL.accountContributeUrl, param).done(function(res){
            if(res.code == 1){
                var obj = res.data.accountList, sHtml = '';
                if(obj.length > 0){
                    for(var i=0, len=obj.length; i<len; i++){
                        if(i%2 == 0){
                            sHtml += '<div class="small-6 columns">';
                        }
                        sHtml += '<div class="item" data-employeeId="'+obj[i].accountId+'">'
                            + '<p class="sub-title"><a href="javascript:void(0);" data-aid="'+obj[i].accountId+'">'+obj[i].accountName+'</a></p>'
                            + '<span class="color-grey count-num">'+obj[i].price+'</span>'
                            + '</div>';
                        if(i%2 == 1){
                            sHtml += '</div>';
                        }
                    }
                }else {
                    sHtml += '<div class="nodata"><p>今日暂无客户贡献</p></div>';
                }
                $(".module-5 .module-con").html(sHtml);
            }else{
                console.error(res.msg);
            }
        });
    }


    //哪个员工贡献最大
    function getEmployeeContribute(){
        var param = "{'shopId': " + shopId + "}";
        reqAjaxAsync(REQUEST_URL.employeeContributeUrl, param).done(function(res){
            if(res.code == 1){
                var obj = res.data.employeeList, sHtml = '';
                if(obj.length > 0){
                    for(var i=0, len=obj.length; i<len; i++){
                        if(i%2 == 0){
                            sHtml += '<div class="small-6 columns">';
                        }
                        sHtml += '<div class="item" data-employeeId="'+obj[i].salesmanId+'">'
                            + '<p class="sub-title"><a href="javascript:void(0);" data-sid="'+obj[i].salesmanId+'">'+obj[i].salesman+'</a></p>'
                            + '<span class="color-grey count-num">'+obj[i].price+'</span>'
                            + '</div>';
                        if(i%2 == 1){
                            sHtml += '</div>';
                        }
                    }
                }else {
                    sHtml += '<div class="nodata"><p>今日暂无员工贡献</p></div>';
                }
                $(".module-6 .module-con").html(sHtml);
            }else{
                console.error(res.msg);
            }
        });
    }


    //门店赠送
    function storeLargess(){
        var param = "{'shopId': " + shopId + "}";
        reqAjaxAsync(REQUEST_URL.largessUrl, param).done(function(res){
            if(res.code == 1){
                $("#todayLargess").html(res.data.num);
            }else{
                console.error(res.msg);
            }
        });
    }

    //今日她来
    function sheGo(){
        var param = "{'shopId': " + shopId + ", 'employeeId': " + employeeId + "}";
        reqAjaxAsync(REQUEST_URL.sheGoUrl, param).done(function(res){
            if (res.code == 1) {
                var obj = res.data;
                $("#sheGoNum").html(obj.num);
                $("#sheGoCredit").html(obj.credit);
            } else {
                console.error(res.msg);
            }
        });

    }

    //提醒
    function remind(){
        var param = {'shopId':shopId};
        reqAjaxAsync(REQUEST_URL.remindUrl,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $("#saleRemindNum").text(res.data.remindNum);
                $("#bespokeRemindNum").text(res.data.bespokeNum);
            }
        });

    }

    function showDetail(title, pagetype, accID, type, goodsId){
        var toUrl = '../storeHomePage/storeHomeDetail.html?shopId='+shopId+'&module='+pagetype;
        if(accID && accID != ""){
            toUrl += '&accountId='+accID;
        }
        if(type){
            toUrl += '&type='+type;
        }
        if(goodsId && goodsId != ""){
            toUrl += '&goodsId='+goodsId;
        }
        window.parent.location.href = toUrl;
    }

    $(".module-4 .module-con").delegate(".hot-goods .sub-title a", "click", function(){
        showDetail('产品销售明细',2 , '',$(this).attr("data-type"), $(this).attr("data-goodsId"));
    });
    $(".module-4 .module-con").delegate(".consume .sub-title a", "click", function(){
        showDetail('今日消耗',2);
    });
    $(".module-5 .module-con").delegate(".item .sub-title a", "click", function(){
        showDetail('客户贡献分析', 3, $(this).attr("data-aid"));
    });
    $(".module-6 .module-con").delegate(".item .sub-title a", "click", function(){
        showDetail('员工贡献分析', 4, $(this).attr("data-sid"));
    });
    $("#todayLargess").click(function(){
        showDetail('门店赠送', 5, '');
    });
    $("#sheGoNum").click(function(){
        showDetail('今日她来', 6, '', 1);
    });
    $("#sheGoCredit").click(function(){
        showDetail('今日她来', 6, '', 2);
    });
    $("#saleRemindNum, #bespokeRemindNum").click(function(){
        showDetail('预测提醒',8 , '',$(this).attr("data-type"));
    });

    $("#shopSaleLink, #shopCostLink").click(function(){
        window.parent.location.href = "../statisticalReport/html/storePerformanceDetails.html?shopID="+shopId+"&shopName="+shopName+"&mType="+$(this).attr("data-type");
    });

    $(function(){
        storeHomePageAch();
        hotGoods();
        getCustomerContribute();
        getEmployeeContribute();
        storeLargess();
        sheGo();
        remind();
    });

})(jQuery);
