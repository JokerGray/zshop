
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
            var merchantId=that.params.merchantId,
            userId=that.params.userId,
            activityDetailType=Number(that.params.activityDetailType||"1");
            var datas= {
                merchantId: merchantId
            };
            var cmd='pinkCircle/getMemberBusinesses';
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
       
                        var swiperList = ''
                        for(var i=0; i < re.data.businessList.length; i++ ){
                            swiperList += `
                                <div class="swiper-slide lvlNav" style="display: block; " data-lv="4">
                                    <div class="lvlicon" onclick="slideTo(`+ i +`)"> V`+ (i+1) +` </div>
                                </div>`
                        }
                        $('#lvlList').append(swiperList)

                        var Swiper2 = new Swiper('#pinkLvl-nav',{
                          on: {
                            slideChangeTransitionEnd: function(){
                                $('.lv-tubiao').text('V'+(this.activeIndex+1) )
                                $('.lv-name').text(re.data.businessList[this.activeIndex].businessName)
                                $('.qichong .num').text(re.data.businessList[this.activeIndex].depositThreshold)
                                $('.zengsong .num').text(re.data.businessList[this.activeIndex].interestMoney)
                                $('.zhekou .num').text(re.data.businessList[this.activeIndex].discount)
                                $('.jingfei .num').text(re.data.businessList[this.activeIndex].funds)

                                var giftAndRight =''
                                var gifts = ''
                                var rights = ''
                                re.data.businessList[this.activeIndex].memberPresentEntity.forEach(element => {
                                    // 礼品
                                    gifts += `
                                    <div class='gift-box'>
                                        <img src="`+ element.picUrl +`" alt="" class='gift-img'>
                                        <div class='gift-detail'>
                                            <div class='gi-describe'>`+ element.entityName +`</div>
                                            <div class='price-box'>
                                                <div>￥<span class='price'>`+ element.value +`</span>元</div>
                                                <div>x<span>`+ element.number +`</span></div>
                                            </div>
                                        </div>
                                        <div class='gift-bg'>
                                            <div class='gift-title'>礼品</div>
                                        </div>
                                    </div>
                                    `
                                });
                                re.data.businessList[this.activeIndex].memberPresentCards.forEach(element => {
                                    // 卡项
                                    rights += `
                                    <div class='gift-box'>
                                        <img src="`+ element.picUrl +`" alt="" class='gift-img'>
                                        <div class='gift-detail'>
                                            <div class='gi-describe'>`+ element.cardName +`</div>
                                            <div class='price-box'>
                                                <div>￥<span class='price'>`+ element.actualPrice +`</span>元</div>
                                                <div>x<span>`+ element.number +`</span></div>
                                            </div>
                                        </div>
                                        <div class='gift-bg'>
                                            <div class='gift-title'>服务卡</div>
                                        </div>
                                    </div>
                                    `
                                });
                                giftAndRight = gifts + rights
                                $('.gifts').html(' ')
                                $('.gifts').append(giftAndRight)

                                $('.privalege').html(' ')
                                if(re.data.businessList[this.activeIndex].memberPresentRights[0]){
                                    $(".privalege").append(re.data.businessList[this.activeIndex].memberPresentRights[0].content)
                                }
                                $('.jieshao').html(' ')
                                if(re.data.businessList[this.activeIndex].referralType ==0){
                                    var referal = `<div>尊享转介绍费<span class='jieshaofei'>0</span>元</div>`
                                    $('.jieshao').append(referal)
                                }else if(re.data.businessList[this.activeIndex].referralType ==1){
                                    var referal = `<div>尊享转介绍费<span class='jieshaofei'>`+ re.data.businessList[this.activeIndex].referralMoney +`</span>元</div>`
                                    $('.jieshao').append(referal)
                                }else{
                                    var referal = `<div>尊享转介绍费<span class='jieshaofei'>`+ re.data.businessList[this.activeIndex].referralMoney +`</span>%</div>`
                                    $('.jieshao').append(referal)
                                }
                            },
                          },
                          direction: 'horizontal',
                            loop: false,

                            effect : 'coverflow',
                            slidesPerView: 3,
                            centeredSlides: true,
                            coverflowEffect: {
                                rotate: 0,
                                stretch: -20,
                                depth: -10,
                                modifier: 1,
                                slideShadows : false
                            }
                        })
                        //点击滑动到相应选项，模板中的方法必须是注册在全局中的
                        window.slideTo = function (num){
                            Swiper2.slideTo(num)
                        }
                        var Swiper3 = new Swiper('#chairShow',{
                            direction: 'horizontal',
                            loop: false,

                            effect : 'coverflow',
                            slidesPerView: 1.2,
                            centeredSlides: true,
                            coverflowEffect: {
                              rotate: 0,
                              stretch: 20,
                              depth: -10,
                              modifier: 1,
                              slideShadows : false
                            }
                        });
                        var Swiper4 = new Swiper('#stageShow',{
                            direction: 'horizontal',
                            loop: false,

                            effect : 'coverflow',
                            slidesPerView: 1.2,
                            centeredSlides: true,
                            coverflowEffect: {
                              rotate: 0,
                              stretch: 20,
                              depth: -10,
                              modifier: 1,
                              slideShadows : false
                            }
                        });

                        //swiper轮播图初始化
                        var mySwiper = new Swiper ('#fengcai', {
                            direction: 'horizontal',
                            loop: false,

                            effect : 'coverflow',
                            slidesPerView: 1.2,
                            centeredSlides: true,
                            coverflowEffect: {
                              rotate: 0,
                              stretch: -20,
                              depth: -10,
                              modifier: 1,
                              slideShadows : false
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
                         var title=re.data.merchant.merchantName +"的粉丝权益";
                         var desc=re.data.merchant.merchantName ||"";
                         var img=re.data.merchant.bgUrl ||" ";
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
