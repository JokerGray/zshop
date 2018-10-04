
import './index.scss';

$(function(){

    function ShowContent(){
        this.init();
    }
    ShowContent.prototype = {
        init:function(){
            this.getParams();
            console.log(this.params);
            this.getContent();
        },
        getParams:function(){
            var url = location.search;
            var params = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            this.params=params;
        },
        getContent:function(){
            var that = this;
            var detailId=that.params.detailId,
            userId=that.params.userId,
            activityDetailType=Number(that.params.activityDetailType||"1");
            var datas= {
                detailId: detailId
            };
            var cmd='fans/getFansTeamNew';
            var version = sessionStorage.getItem('version') || "1", 
            apikey = sessionStorage.getItem('apikey') || "test"; 
            var data = JSON.stringify(datas);
            $.ajax({
                type: "POST",
                url: "/zxcity_restful/ws/rest",
                dataType: "json",
                async: true,
                data: {
                    cmd: cmd,
                    data: data,
                    version: version
                },
                beforeSend: function(request) {
                    request.setRequestHeader("apikey", apikey);
                },
                success: function(re) {
                    console.log(re);

                    if(re.code==1){
                        var html = template('showCont', re);
                        $('.content').html(html);
                        $("#processContent-detail").append(re.data.activityList[0].detailDetail)
                        //swiper轮播图初始化
                        var mySwiper = new Swiper('.active-process',{
                            direction: 'horizontal',
                            loop: false,
                            slidesPerView : 2,
                        })
                        var mySwiper = new Swiper('.fan-activity-box',{
                            direction: 'horizontal',
                            loop: false,
                            slidesPerView : 1,
                        })
                        var mySwiper = new Swiper ('.swiper-container', {
                            direction: 'horizontal',
                            loop: false,
                            
                            // 如果需要分页器
                            pagination: {
                              el: '.swiper-pagination',
                            },
                            
                            // 如果需要前进后退按钮
                            navigation: {
                              nextEl: '.swiper-button-next',
                              prevEl: '.swiper-button-prev',
                            },
                            
                            // 如果需要滚动条
                            scrollbar: {
                              el: '.swiper-scrollbar',
                            },
                            effect : 'coverflow',
                            slidesPerView: 1.2,
                            centeredSlides: true,
                            coverflowEffect: {
                              rotate: 0,
                              stretch: -20,
                              depth: -10,
                              modifier: 1,
                              slideShadows : false
                            },
                            on:{
                              touchSatrtFunc: function(){
                                  console.log(111)
                                  }
                              }
                          }) 
                        //  $('.play').on('click',function(){
                        //     $(this).hide();
                        //     $('.video')[0].play();
                        //     $('.video').click(function(){
                        //         $(this)[0].pause();
                        //         $('.play').show();
                        //          })
                        //     })

                        //  var title=re.data.activityList[0].detailName;
                        var title="粉团队详情";
                         var desc=re.data.activityList[0].detailDetail||"";
                         var img=re.data.activityList[0].detailPicurl||" ";
                         share(title,desc,img);				 
                    }else{
                        $('#contBlank').show();
                    }
                },
                error: function(re) {
                    console.log(re);
                }
            });
        }
    }
    var contents=new ShowContent();
});
