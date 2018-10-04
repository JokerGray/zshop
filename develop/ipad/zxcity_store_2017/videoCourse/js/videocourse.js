
$(function () {
    init('11')
})

var jsonUrl = {"11":'./json/zxcityApp.json','22':'./json/zmasterApp.json','33':'./json/zpad.json','44':'./json/aplatform.json'}
$('#navs').on('click', 'a', function () {
    $(this).addClass('active').siblings().removeClass('active')
    var videoType = $(this).attr('data-videoType')
    init(videoType)
})

$('#videoBox').on('click', '#videoList li', function () {
    // var data = {url:$(this).attr('data-videoUrl')}
    var html = template('video',{})
    layer.open({
        type: 1,
        shade:0.5,
        skin: 'service-class',
        title: '',
        area: ['70%', '50%'],
        shadeClose: false,
        scrollbar: false,
        content: html
    })

    // chimee插件使用
    var aggdPlugin = ChimeePlayer.popupFactory({
        name: 'time-ad',
        className: 'time-ad',
        title: '',
        offset: '0px 10px auto auto',
        operable: false
    });
    ChimeePlayer.install(aggdPlugin);
    var player = new ChimeePlayer({
        wrapper: '.chimee-container',
        src: $(this).attr('data-videoUrl'),
        // src: location.protocol+'//chimee.org/vod/1.mp4',
        isLive: false,
        autoplay: true,
        box:'native',
        controls: true,
        inline: true,
        plugin: [aggdPlugin.name]
    });
})

function init(videoType){
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: jsonUrl[videoType],
        success: function (res) {
            var html = template('videoListTpl',res);
            $('#videoBox').html(html)
        }
    })
}