var laytpl =  layui.laytpl;
var laypage = layui.laypage;
var laydate = layui.laydate;
$.extend({
    platform: function(){
        this.url = {
            getCarousel: 'queryScCmsCarouseMsList'
        }
        this.pages = 1;
        this.data = {
            scCmsChannelName: '',
            scCmsCarouselName: '',
            scCmsCarouselCreatetime: '',
            subscriptionName: '',
            pagination: {
                page: 1,
                rows: 5
            }
        }
    }
})
$.platform.prototype = {
    constructor: $.platform,
    getCarouselList: function(d){
        var _this = this;
        var res = reqNewAjax(_this.url.getCarousel, d);
        if(res.code != 1) return layer.msg(res.msg);
        if(res.code == 1) {
            var total = res.total || '';
            _this.pages = Math.ceil(total/_this.data.pagination.rows);
            var data = res.data;
            if(!isNull(data)) {
                var getTpl = $('#getCarouselList').html();
                laytpl(getTpl).render(data, function(html){
                    $('#statement_con').html(html);
                }) 
            } else {
                $('#statement_con').html('');
            }
        }
    },
    getListPage: function(pages, d){
        var _this = this;
        laypage({
            cont: 'page', 
            pages: pages, 
            skip: true, 
            skin: '#2BC6FF',
            groups: 3, 
            jump: function(obj) {
                d.pagination.page = obj.curr;
                _this.getCarouselList(d);
            }
        })
    }
}
$(function(){
    //获取下拉框所有选项
    optionType($("#channelInp"), "all");
    //禁止输入空格
    inhibitTrim('#channelInp'), inhibitTrim('#artNameInp'), inhibitTrim('#authorInp'), inhibitTrim('#pushTimeInp');
    //清除输入的空格
    //初始化时间
    var today = format(new Date());
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        var startDate = {
            max: today,
            istoday: false,
            choose: function (datas) {
                // start.data.scCmsCarouselCreatetime = datas;
            }
        };
        $('#pushTimeInp').click(function () {
            startDate.elem = this;
            laydate(startDate);
        });
    });
    var start = new $.platform();
    start.getCarouselList(start.data);
    start.getListPage(start.pages, start.data); 
    $('#search_icon').click(function(){
        var channelVal = $('#channelInp').val(), channelText = '';
        if(channelVal) channelText = $('#channelInp option[value='+ channelVal +']').text();
        start.data.scCmsChannelName = channelText;
        start.data.scCmsCarouselName = $('#artNameInp').val();
        start.data.scCmsCarouselCreatetime = $('#pushTimeInp').val();
        start.data.subscriptionName = $('#authorInp').val();
        start.getCarouselList(start.data);
        start.getListPage(start.pages, start.data); 
    })
})
//获取具体时分秒
function getTime(d){
    var d = new Date(d);
    var h = d.getHours();
    var m =  d.getMinutes();
    var s = d.getSeconds();
    if(h < 10) {
        h = '0' + h;
    } 
    if(m < 10) {
        m = '0' + m;
    }  
    if(s < 10) {
        s = '0' + s;
    }  
    var str = h + ':' + m + ':' + s; 
    return str;
}