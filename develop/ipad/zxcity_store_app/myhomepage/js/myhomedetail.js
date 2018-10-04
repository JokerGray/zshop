(function($){
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-").replace(/(?=\b\d\b)/g,'0');
    var _module = getUrlParams('module'), _type = getUrlParams('type');
    var shopId = sessionStorage.getItem("shopId");
    var startTime = "", endTime = "", timeType = 1;
    var pageNo = 1, pageSize = 10;

    //初始进入时下拉菜单对应相应状态
    $(".select-ul li").each(function(){
        var lists = $(".select-ul li");
        for(var i=0;i<lists.length;i++){
            var dataType = lists.eq(i).attr("data-type");
            if(dataType == _type){
                lists.eq(i).addClass("active");
            }
        }
    });

    //下拉选择
    $(".select-ul li").click(function(){
        _type = $(this).attr("data-type");
        $(".select-ul li").removeClass("active");
        $(this).attr("class","active");
        $("#module1-select").attr("class","module1-select hide");
        $(this).parents(".module1-select").prev().find("span>i").attr("class","down-icon");
        getListDataOfmodule_1();
    });



    //客户回访下拉选项
    $(".maintitle").on("click",".title i",function(){
        var typeClass = $("#module1-select").attr("class");
        if(typeClass == "module1-select hide"){
            $("#module1-select").attr("class","module1-select");
            $(this).attr("class","up-icon");
        };
        if(typeClass == "module1-select"){
            $("#module1-select").attr("class","module1-select hide");
            $(this).attr("class","down-icon");
        }
    });

    //客户回访
    function showListOfmodule_1(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].accountId+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].createTime+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml = '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module1 .table-list table tbody").html(sHtml);
        }else{
            console.log(res.msg);
        }

    }
    function getListDataOfmodule_1(){
        var jsonData = "{'shopId':"+shopId+",'type':"+_type+", 'timeType':"+timeType+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageAccountVisitListDetails', jsonData);
        showListOfmodule_1(resData);
        if(resData.total > 0){
            $("#page1").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 6
            }).on('page', function(event, num){
                jsonData = "{'shopId':"+shopId+",'type':"+_type+", 'timeType':"+1+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageAccountVisitListDetails', jsonData);
                showListOfmodule_1(resData);
            }).removeClass("invisible");
        }else{
            $('#page1').addClass("invisible");
        }
    }


    //预售列表显示
    function showPresalesList(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td><div class="module2-serviceName">'+res.data[i].goodsName+'</div></td>'
                        + '<td>'+res.data[i].num + '/' + res.data[i].shouldPay +'</td>'
                        + '<td>'+res.data[i].status+'</td>'
                        + '<td>'+res.data[i].time+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="6">暂无数据</td></tr>'
            }
            $("#module2 table tbody").html(sHtml);
        }else{
            console.log(res.msg);
        }
    }
    //新客列表数据展示
    function showNewAccountList(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].id+'</td>'
                        + '<td>'+res.data[i].accountName+'</td>'
                        + '<td>'+res.data[i].mobile+'</td>'
                        + '<td>'+res.data[i].cardName+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module5 table tbody").html(sHtml);
        }else{
            console.log(res.msg);
        }
    }

    //预售数据加载
    function loadPresalesData(){
        startTime = "";
        endTime = "";
        var jsonData = "{'shopId':"+shopId+", 'type':2,'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePagePresalesDetails', jsonData);
        showPresalesList(resData);
        if(resData.total > 0){
            $("#page2").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 6
            }).on('page', function(event, num){
                var jsonData = "{'shopId':"+shopId+",'type':2,'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePagePresalesDetails', jsonData);
                showPresalesList(resData);
            }).removeClass("invisible");
        }else{
            $('#page2').addClass("invisible");
        }
    }
    //新客分析详情列表加载
    function loadNewAccountData(){
        var jsonData = "{'shopId':"+shopId+",'type':"+_type+",'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageNewAccountDetails', jsonData);
        showNewAccountList(resData);
        if(resData.total > 0){
            $("#page5").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 6
            }).on('page', function(event, num){
                var jsonData = "{'shopId':"+shopId+",'type':"+_type+",'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageNewAccountDetails', jsonData);
                showNewAccountList(resData);
            }).removeClass("invisible");
        }else{
            $('#page5').addClass("invisible");
        }
    }
    //卡项预警列表数据展示
  function showCardWarningList(res){
      var sHtml = "";
      if(res.code == 1){
          if(res.data.length > 0){
              for(var i=0, len=res.data.length; i<len; i++){
                  sHtml += '<tr>'
                      + '<td>'+res.data[i].card_name+'</td>'
                      + '<td>'+res.data[i].total_num+'</td>'
                      + '<td>'+res.data[i].consume_num+'</td>'
                      + '<td>'+res.data[i].remain_num+'</td>'
                      + '</tr>'
              }
          }else{
              sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
          }
          $("#module6 table tbody").html(sHtml);
      }else{
          layer.msg(res.msg);
      }
  }

    //客户卡项预警列表
    function loadCardWarningData(){
        var jsonData = "{'shopId':"+shopId+",'accountId':"+_type+",'pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageWarningDetails', jsonData);
        showCardWarningList(resData);
        if(resData.total > 0){
            $("#page6").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 10
            }).on('page', function(event, num){
                var jsonData = "{'shopId':"+shopId+",'accountId':"+_type+",'pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageWarningDetails', jsonData);
                showCardWarningList(resData);
            }).removeClass("invisible");
        }else{
            $('#page6').addClass("invisible");
        }
    }


    //赠送统计
    function showListOfmodule_8(res){
        var sHtml = "";
        if(res.code == 1){
            if(res.data.length > 0){
                for(var i=0, len=res.data.length; i<len; i++){
                    sHtml += '<tr>'
                        + '<td>'+res.data[i].typeName+'</td>'
                        + '<td>'+res.data[i].num+'</td>'
                        + '<td>'+res.data[i].time+'</td>'
                        + '<td>'+res.data[i].name+'</td>'
                        + '<td>'+(res.data[i].unitPrice||0)+'</td>'
                        + '</tr>'
                }
            }else{
                sHtml += '<tr><td colspan="4">暂无数据</td></tr>'
            }
            $("#module8 .table-list table tbody").html(sHtml);
        }else{
            console.log(res.msg);
        }
    }
    function getListDataOfmodule_8(){
        if(_type == 3){
            startTime = today;
            endTime = today;
        }
        var jsonData = "{'shopId':"+shopId+", 'timeType':"+_type+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+pageNo+",'pageSize':"+pageSize+"}";
        var resData = reqAjax('shopStatistics/myHomePageLargessListDetails', jsonData);
        showListOfmodule_8(resData);
        if(resData.total > 0){
            $("#page8").bootpag({
                total: Math.ceil(resData.total / pageSize),
                page: 1,
                maxVisible: 6
            }).on('page', function(event, num){
                jsonData = "{'shopId':"+shopId+", 'timeType':"+_type+", 'startData':'"+startTime+"','endData':'"+endTime+"','pageNo':"+num+",'pageSize':"+pageSize+"}";
                var resData = reqAjax('shopStatistics/myHomePageLargessListDetails', jsonData);
                showListOfmodule_8(resData);
            }).removeClass("invisible");
        }else{
            $('#page8').addClass("invisible");
        }
    }

    function init(){
        $("#module"+_module).removeClass("hide").siblings().addClass('hide');
        switch (_module) {
            case "1":
                $(".maintitle .title").html("<span>客户回访详情页<i class='down-icon'></i></span>");
                getListDataOfmodule_1();
                break;
            case "2":
                $(".maintitle .title").text("今日预售详情页");
                $(".date-wrap .date-tab").hide();
                $(".date-wrap .date-selector").removeClass("hide");
                loadPresalesData();
                break;
            case "5":
                $(".maintitle .title").text("新客分析详情页");
                $(".date-wrap .date-tab .year").hide();
                loadNewAccountData();
                break;
            case "6":
                $(".date-wrap").hide();
                $(".maintitle .title").text("客户卡项预警详情页");
                loadCardWarningData();
                break;
            case "8":
                $(".maintitle .title").text("赠送统计详情页");
                getListDataOfmodule_8();
                break;
            default:
        }
    }

    init();


    function reloadData(){
        switch(_module){
            case "1":
                startTime = "";
                endTime = "";
                getListDataOfmodule_1();
                break;
            case "2":
                startTime = "";
                endTime = "";
                loadPresalesData();
                break;
            case "5":
                //新客分析的参数时间类型为月时候，type=2
                startTime = "";
                endTime = "";
                _type = (_type == 1) ? 2 : _type;
                loadNewAccountData();
                break;
            case "6":
                startTime = "";
                endTime = "";
                loadCardWarningData();
                break;
            case "7":
                startTime = "";
                endTime = "";
                getListDataOfmodule_8();
                break;
        }
    }
})(jQuery);
