(function($){
    var REQUEST_URL = {
        'info':'shopStatistics/getTeamLeaderSaleInfo'
    };
    //获取当前日期
    var now = new Date();
    var today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-').replace(/(?=\b\d\b)/g,'0');

    var backUserId = sessionStorage.getItem("backUserId");
    var startTime = "", endTime = "";

    //设置时间默认时间为今天
    $(".datetime").val(today);
    //日期初始化
    function initDateTime(){
        //日期选择器初始化
        var start = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            maxDate: $.nowDate({DD:0}), //最大日期
            choosefun: function(elem, val, date){
                end.minDate = date; //开始日选好后，重置结束日的最小日期
                end.maxDate = $.nowDate({DD:"+30"},'YYYY-MM-DD',val);
                endDates($(elem).attr("id").replace("startTime",""));
            }
        };
        var end = {
            isinitVal:true,
            skinCell:"mystyle",
            format:"YYYY-MM-DD",
            isClear:false,
            isok:false,
            minDate: $.nowDate({DD:0}),
            maxDate: $.nowDate({DD:+30}),
            choosefun: function(elem, val, date){
                start.minDate = $.nowDate({DD:"-30"},'YYYY-MM-DD',val);
                start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
            }
        };
        //这里是日期联动的关键
        function endDates(n) {
            //将结束日期的事件改成 false 即可
            //end.trigger = false;
            $("#endTime"+n).jeDate(end);
        }
        $.jeDate('.start-time',start);
        $.jeDate('.end-time',end);
    }
    initDateTime();

    function getTeamLeaderSaleInfo(){
        startTime = $("#startTime").val();
        endTime = $("#endTime").val();
        var param = {
            'backUserId':backUserId,
            'startData':startTime,
            'endData':endTime
        };
        reqAjaxAsync(REQUEST_URL['info'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                $("#xseNum").text(res.data.salePrice);
                $("#xheNum").text(res.data.consumePrice);
                $("#czjeNum").text(res.data.rechargePrice);
                $("#xkrhNum").text(res.data.addAccount);
                $("#fwrcNum").text(res.data.serviceAccountNum);
                $("#yyrcNum").text(res.data.bespokeNum);
                $("#czrcNum").text(res.data.rechargeNum);
                $("#ddrcNum").text(res.data.accountCome);
                var teamList = res.data.TeamList;
                var sHtml = '';
                if(teamList.length > 0){
                    for(var i=0; i<teamList.length; i++){
                        sHtml += '<tr>'
                            + '<td>'+teamList[i].userName+'</td>'
                            + '<td>'+teamList[i].salePrice+'</td>'
                            + '<td>'+teamList[i].consumePrice+'</td>'
                            + '<td>'+teamList[i].rechargeNum+'</td>'
                            + '<td>'+teamList[i].rechargePrice+'</td>'
                            + '<td>'+teamList[i].accountCome+'</td>'
                            + '<td>'+teamList[i].addAccount+'</td>'
                            + '<td>'+teamList[i].serviceAccountNum+'</td>'
                            + '<td>'+teamList[i].bespokeNum+'</td>'
                            + '</tr>';
                    }
                }else{
                    sHtml += '<tr><td colspan="9">暂无数据</td></tr>';
                }
                $("#teamList tbody").html(sHtml);
            }else{
                layer.msg(res.msg);
            }
        });
    }
    getTeamLeaderSaleInfo();

    $("#searchBtn").click(function(){
        getTeamLeaderSaleInfo();
    });
})(jQuery);
