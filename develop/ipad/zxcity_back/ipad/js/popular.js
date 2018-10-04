/*
 * 爆款
 * */

(function($){

    var tabLength = $(".pplarTab_wrapper").length; //tab标签有多少个
    var $topList = $(".pplarTab_wrapper .pplarTop");//所有的菜单top标签
    var $nameList = $(".pplarTab_wrapper .pplarName");//所有的菜单编号标签
    var $bgImg = $(".pplarImgs .pplarImg_wrapper");//所有的背景图
    $topList.hide(); //默认所有的top隐藏
    $bgImg.hide();//默认所有的背景图隐藏

    //点击添加按钮弹出窗
    $(".pplarTab_add").click(function(){
        window.parent.layer.open({
            type: 2,
            title: ['图片设置-爆款', 'height:46px;'],
            shadeClose: false,
            area: ['950px', '768px'],
            offset: '105px',
            anim: 5,
            content: ['addLayer.html', 'no']
        });
    });

    //点击按钮删除
    $("#pplTab").on('click','.deleteTab',function(){
        var $this = $(this);
        var indexOf =$this.parent().index();
        var $id = $this.parent().find("input").val();//获取当前删除部分的id
        if(tabLength>1){
            $bgImg.eq(indexOf).remove();
            $bgImg.eq(indexOf-1).show();
            $this.parent().remove();
            for(var i=0;i<tabLength;i++){
                $(".pplarTab_wrapper").eq(i).find(".pplarNum").html(i+1);
            }
            tabLength--;
        }else{
            layer.alert('只剩一条，不能再删了哟', {icon: 6});
        }
    });


    //点击图片弹出框
    $(".pplarImgs").on('click','.pplarImg_wrapper',function(){
        window.parent.layer.open({
            type: 2,
            title: ['图片设置', 'height:46px;'],
            shadeClose: false,
            area: ['1024px', '768px'],
            offset: '35px',
            anim: 5,
            content: ['addLayer.html', 'no']
        });

    });

    //点击菜单切换效果
    $("#pplTab").on('click','.pplarName',function(){
        var $index = $(this).parent().index();
        $topList.hide();
        $nameList.show();
        $bgImg.hide();
        $(this).hide();
        $topList.eq($index).show();
        $bgImg.eq($index).show();
    });

    //文字滚动
    $(document).ready(function (){
        $(".pplTxt-marquee").marquee();
    });


    //添加菜单
    function addTab(val,imgUrl,text,id){ //val指名称，imgUrl指背景图片地址，text指滚动文字
        //左侧菜单
        var shtml = '<li class="pplarTab_wrapper">' +
                        '<input type="hidden" value="'+ id +'"/>'+
            '<span class="pplarTop">TOP</span>' +
            '<div class="pplarNum-body">' +
                '<span class="pplarNum">' + (tabLength+1) + '</span>' +
                '<i class="pplar-arrow"></i>' +
            '</div>' +
            '<span class="pplarName" >' + val + '</span>' +
            '<span class="deleteTab glyphicon glyphicon-minus" aria-hidden="true"></span>' +
            '</li>';

        //背景图
        var imgHml = '<div class="pplarImg_wrapper">'+
                        '<input type="hidden" value="'+ id +'"/>'+
                        '<div class="pplarImg"><img src="'+ imgUrl +'" /></div>'+
                        '<div class="pplarText">'+
                            '<ul class="pplTxt-marquee">'+
                                '<li>'+ text +'</li>'+
                            '</ul>'+
                        '</div>'+
                    '</div>';
        $("#pplTab").append(shtml);
        $(".pplarImgs").append(imgHml);
        $bgImg.css("display","none");
        $bgImg.eq(tabLength).css("display","block");
        tabLength++;
        $topList.eq(tabLength).css("display","block");
        $nameList.eq(tabLength).css("display","none");
    };
})(jQuery);
