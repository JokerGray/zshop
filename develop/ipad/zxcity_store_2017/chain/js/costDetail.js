(function ($) {
    var REQUIRE_URL = {
        'areaList': 'operations/getScMultipleShopConfigureList',
        'statisticsData': 'operations/getShopProfitSumByDate'
    };

    function initDate() {
        $("#yearDate").jeDate({
            isinitVal: true,
            skinCell: "mystyle",
            format: "YYYY-MM",
            isClear: false,
            isok: false,
            choosefun:function (el,val,date) {
                getStatisticsData()
            }
        });
        $("#monthDate").jeDate({
            isinitVal: true,
            skinCell: "mystyle",
            format: "YYYY-MM-DD",
            isClear: false,
            isok: false,
            choosefun:function (el,val,date) {
                getStatisticsData()
            }
        });
    }

    //获取片区列表
    function getAreaList() {
        // var id = getParams().id;
        var params = {
            'id': getParams().id
        };
        reqAjaxAsync(REQUIRE_URL['areaList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg);
                return
            }
            var html = template('areaListTp', res);
            $('#selector').html(html);
            getStatisticsData()
        })
    }

    //获取统计额
    function getStatisticsData() {
        var dateObj;
        $('.datetime').each(function (i, v) {
            if(!$(v).hasClass('hide')){
                dateObj = getStartAndEndDate($(v).val());
            }
        });
        var params = {
            id: $('#selector').val(),
            startDate: dateObj.startDate,
            endDate: dateObj.endDate,
            timeType: $('#dateTab .active').attr('data-type')
        };
        reqAjaxAsync(REQUIRE_URL['statisticsData'],JSON.stringify(params)).done(function (res) {
            if(res.code!==1){
                layer.msg(res.msg);
                return
            }
            template.defaults.imports.percent = function (a,b) {
                return (a/b*100).toFixed(2)!=="NaN"?(a/b*100).toFixed(2):"0.00"
            };
            var totalHtml = template('totalTp',res.data[0]);
            $('.total-amount').html(totalHtml);
            var costDetailHtml = template('costDetailTp',res.data[0]);
            $('.cost-detail').html(costDetailHtml);
        })
    }

    //获取起始日期和结束日期
    function getStartAndEndDate(val) {
        var startDate,endDate;
        var dateArr = val.split('-');
        var year = dateArr[0];
        var month = dateArr[1];
        if(dateArr.length===2){
            if(month==='04'||month==='06'||month==='09'||month==='11'){
                startDate = year+'-'+month+'-01';
                endDate = year+'-'+month+'-30';
            }else if(month==='02'){
                if(year%4===0&&year%100!==0){
                    startDate = year+'-'+month+'-01';
                    endDate = year+'-'+month+'-29';
                }else{
                    startDate = year+'-'+month+'-01';
                    endDate = year+'-'+month+'-28';
                }
            }else{
                startDate = year+'-'+month+'-01';
                endDate = year+'-'+month+'-31';
            }
        }else if(dateArr.length===3){
            startDate = val;
            // var date = new Date();
            // var YYYY = date.getFullYear(),
            //     MM = (date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1),
            //     DD = date.getDate()<10?('0'+date.getDate()):date.getDate();
            endDate = val;
        }
        return {startDate:startDate,endDate:endDate}
    }

    $("#dateTab .date-type").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var _index = $(this).index();
        var _elm = _index == 1 ? "monthDate" : "yearDate";
        $("#" + _elm).removeClass("hide").siblings().addClass("hide");
        getStatisticsData()
    });

    $('#selector').on('change',function () {
        getStatisticsData()
    });

    //返回按钮
    $('.return-icon').on('click',function () {
        window.history.back()
    });

    initDate();
    getAreaList();
})(jQuery);
