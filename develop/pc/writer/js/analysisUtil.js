/**
 * 文章分析页面公用方法：
 */
//layDate获取input列表日期：
function analysisDate() {
    var yesterday = formatterDate(new Date().setDate(new Date().getDate() - 1));
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var startDate = {
            max: yesterday,
            istoday: false,
            choose: function(datas) {
                endDate.min = datas; //开始日选好后，重置结束日的最小日期
                var between = new Date(datas).getTime() + 30 * 24 * 60 * 60 * 1000;
                if(new Date().getTime() < between) {
                    between = new Date().getTime();
                }
                endDate.max = formatterDate(between);
                endDate.start = datas //将结束日的初始值设定为开始日
                if (!isNull($("#end").val())) {}
            }
        };
        var endDate = {
            max: yesterday,
            istoday: false,
            choose: function(datas) {
                startDate.max = datas; //结束日选好后，重置开始日的最大日期
                var between = new Date(datas).getTime() - 30 * 24 * 60 * 60 * 1000;
                startDate.min = formatterDate(between);
                if (!isNull($("#start").val())) {}
            }
        };
        $('#start').click(function() {
            startDate.elem = this;
            laydate(startDate);
            $('#TimeValue').val('');
        });

        $('#end').click(function() {
            endDate.elem = this;
            laydate(endDate);
            $('#TimeValue').val('');
        });
    });
}

//点击日期下拉框改变时间戳input：
function inpChangeDate(yesterday) {
    var sevenDay = formatterDate(new Date().setDate(new Date().getDate() - 8));
    var mouthDay = formatterDate(new Date().setDate(new Date().getDate() - 31));
    $('#TimeValue').change(function() {
        var day = $('#TimeValue').val();
        if (day === '0') {
            $('#start').val(yesterday)
            $('#end').val(yesterday)
        } else if (day == 1) {
            $('#start').val(sevenDay)
            $('#end').val(yesterday)
        } else if (day == 2) {
            $('#start').val(mouthDay)
            $('#end').val(yesterday)
        } else {
            $('#start').val('')
            $('#end').val('')
        }
    })
}

//导出Excel表格：
function exportExcelData(string, data) {
    window.location.href = '/zxcity_restful/ws/cms_new/' + string + '?data=' + JSON.stringify(data);
}