(function($){
    var ITEM_DESC = ['通过线上、线下大量活动、卡券、优惠吸引拓客。',
        '设定 “爆点”让体验顾客不得不留在店面，以便追销锁客。',
        '设定长期的、连续的追销系统让顾客连续消费，创造收益，让其成为长期稳定顾客。',
        '因应消费者权益向粉丝权益的消费升级改变，设定本商品及服务的粉丝权益，从而服务升级——供给侧改革，顾客变粉丝...',
        '建立粉团队，组织化发展，娱乐性实现 。体验参与、搭建平台、社会推动——变成员工、顾客、社会的共享性平台——...',
        '客户定位——你的顾客在哪？'];

    var projectType = getUrlParams("type") == "" ? 0 : getUrlParams("type");

    var activeIndex = 0; //当前选中的项目index
    var bgAngle = 0;//角度
    var oBlockElemArr = $("#circleAnimatedBox .circle-item").get();
    var increase = Math.PI * 2 / oBlockElemArr.length;
    var x = 0, y = 0, angleInit = Math.PI * 1.1667; /* 偏移 1.1667 */

    function reposition(index) {
        var abc = angleInit;
        abc = abc + increase * index * (-1);
        for (var i = 0; i < oBlockElemArr.length; i++) {
            var elem = oBlockElemArr[i];
            //半径, 圆心
            x = 149 * Math.cos(abc) + 164;
            y = 151 * Math.sin(abc) + 160;
            elem.style.position = 'absolute';
            elem.style.left = x + 'px';
            elem.style.top = y + 'px';
            abc += increase;
        }
    }




    //为文字描述框添加链接
    $("#listLink").click(function(){
        location.href = "list.html?type="+activeIndex;
    });

    //设置转盘事件
    $("#circleAnimatedBox .circle-item").rotate({
        bind: {
            click: function(){
                var _index = $(this).index();
                var colorCls = "color"+(_index+1);
                if(activeIndex == _index){
                    return;
                }
                var lastIndex = activeIndex;
                activeIndex = _index;

                //转背景图
                bgAngle += 60 * ((6 + lastIndex - _index) % 6);

                //设置连接线、文字边框及文字的颜色
                setTimeout(function(){
                    $("#fsjBox .connect-line, .list-link-wrapper, .list-link-wrapper .desc").removeClass("color1 color2 color3 color4 color5 color6").addClass(colorCls);
                    $("#listLink .desc").text(ITEM_DESC[activeIndex]);
                },100);



                $("#circleBg").rotate({
                    animateTo: bgAngle,
                    callback: function(){

                    }
                });

                $("#circleAnimatedBox").rotate({
                    animateTo : bgAngle,
                    callback : function() {
                    }
                });

                // issue: 第一次为什么会转360度?
                $("#circleAnimatedBox .circle-item").rotate({
                    animateTo : 360 - bgAngle
                });

            }
        }
    });

    function init(activeIndex){
        //转背景图
        bgAngle += 60 * ((6  - activeIndex) % 6);

        $("#circleBg").rotate({
            animateTo: bgAngle,
            callback: function(){
                //设置连接线、文字边框及文字的颜色
                $("#fsjBox .connect-line, .list-link-wrapper, .list-link-wrapper .desc").removeClass("color1 color2 color3 color4 color5 color6").addClass("color"+(activeIndex+1));
                $("#listLink .desc").text(ITEM_DESC[activeIndex]);
            }
        });

        $("#circleAnimatedBox").rotate({
            animateTo : bgAngle,
            callback : function() {
            }
        });


        $("#circleAnimatedBox .circle-item").rotate({
            animateTo : 360 - bgAngle
        });
    }

    $(function(){
        activeIndex = parseInt(projectType);
        reposition(0);
        //初始化描述内容
        $("#listLink .desc").text(ITEM_DESC[activeIndex]);

        init(activeIndex);
    });

})(jQuery);
