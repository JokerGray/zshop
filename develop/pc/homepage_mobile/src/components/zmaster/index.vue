<template>
    <div>
        <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
            <!-- slides -->
            <swiper-slide class="item1 animated">
                <div class="title animated">
                    <img src="./img/zhi.png" alt="" class="animated">
                    <span>大师</span>
                </div>
                <h3>人人都是经营大师</h3>
                <p>智者的修炼空间，创业者的私家花园，优秀者的同一首歌！</p>
                <img src="./img/wudaxian.png" alt="" class="title-img">
            </swiper-slide>
            <swiper-slide class="item2">
                <h3>大师圈</h3>
                <h5>智者的聚集地</h5>
                <p>
                    大师圈，智者的聚集地，相互
                    <br> 交流经营理念，管理哲学。让每个人都成为经营大师。
                    <br> 让大师们相 互 交流，评价，分享，收藏，
                    <br>让更多的的人学习更适合的经营 方式。
                    <br>互相学习，共同进步，主动出击让大师成为
                    <br> 你的朋友。大师圈，智者的聚集地。
                    <br> 想成为智者吗？从大师圈开始吧！最新的经营理念等你发现。
                </p>
                <img src="./img/dashiquan.png" alt="">
            </swiper-slide>
            <swiper-slide class="item2">
                <h3>智经营</h3>
                <h5>人人都可以成为经营大师</h5>
                <p>
                    六脉粉神剑,人事客项钱
                    <br> 为您解决经营上的大小事，教你如何经营吸引客户。
                </p>
                <h4>六脉神剑粉</h4>
                <p>
                    招揽顾客，通过客户定位找到你的 准客户，利用活动吸引顾客。
                    <br> 从 客户的角度出发，提供贴心服务。
                </p>
                <h4>人事客项钱</h4>
                <p>
                    从根源出发，吸纳人才， 智能化的管理
                    <br> 流程，让每个员工都有归属感，提升团队凝聚力,打造粉团队。
                </p>
                <img src="./img/zhijingyi.png" alt="">
            </swiper-slide>
            <swiper-slide class="item4">
                <h3>最好用的商家直播吸粉工具</h3>
                <div class="imgContent">
                    <div><img src="./img/img4.png"></div>
                    <div><img src="./img/img5.png"></div>
                    <div><img src="./img/img6.png"></div>
                    <div><img src="./img/img7.png"></div>
                </div>
                <ul class="logo">
                    <li>
                        <img src="./img/dmzb.png" alt="">
                        <br>
                        <br>
                        <span>店面直播</span>
                    </li>
                    <li>
                        <img src="./img/shsl.png" alt="">
                        <br>
                        <br>
                        <span>送花送礼</span>
                    </li>
                    <li>
                        <img src="./img/hdzb.png" alt="">
                        <br>
                        <br>
                        <span>活动直播</span>
                    </li>
                    <li>
                        <img src="./img/gkhd.png" alt="">
                        <br>
                        <br>
                        <span>顾客互动</span>
                    </li>
                    <li>
                        <img src="./img/bkbmn.png" alt="">
                        <br>
                        <br>
                        <span>边看边买</span>
                    </li>
                </ul>
            </swiper-slide>
            <swiper-slide class="item5">
                <h3>我的云店</h3>
                <div class="item5-cont">
                    <div>
                        <h5>形象宣传</h5>
                        <img src="./img/img1.png" alt="" class="imgOne">
                    </div>
                    <div>
                        <img src="./img/img2.png" alt="" class="imgTwo">
                        <h5>即时资讯</h5>
                    </div>
                    <div>
                        <h5 class="three">活动引流</h5>
                        <img src="./img/img3.png" alt="" class="imgThree">
                    </div>
                </div>
            </swiper-slide>
            <swiper-slide class="item6">
                <div class="boss item6-cont">
                    <div class="item6-cont_title">
                        老板用
                    </div>
                    <h3>门店远程监控 <span>在家也知道门店事</span></h3>
                    <p>
                        数据可视化——让商家及时调整经营策略，更好的服务客户
                        <br> 趋势分析——无需增加人工计算成本，轻松做“甩手”掌柜
                    </p>
                </div>
                <div class="user item6-cont">
                    <div class="item6-cont_title">
                        员工用
                    </div>
                    <h3>玩转店务 <span>多功能管店能手</span></h3>
                    <p>
                        快速开单，预约，让员工开心工作，马力全开；算绩效，算提成，
                        <br>算报表，一台手机轻松搞定，再也不用为手工帐而烦恼；
                        <br>更有多角色看板，店务管理更简单
                    </p>
                </div>
                <img src="./img/gongzuotai.png" alt="">
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
// swiper options example:
export default {
    name: 'carrousel',
    data() {
        return {
            swiperOption: {
                // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                notNextTick: true,
                speed: 700,
                direction: 'vertical',
                setWrapperSize: false,
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true,
                height: window.innerHeight,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                onInit: this.onInit,
                onSlideChangeStart: function(swiper) {
                    var $item = $(".swiper-slide").eq(swiper.activeIndex)
                    if (swiper.activeIndex == 0) {
                        $item.find(".title").removeClass("show")
                        $item.find("h3").removeClass("show")
                        $item.find("p").removeClass("show")
                        $item.find(".title-img").removeClass("show")
                    }
                    if (swiper.activeIndex == 1 || swiper.activeIndex == 2) {
                        $item.find("h3").removeClass("show")
                        $item.find("h5").removeClass("show")
                        $item.find("h4").removeClass("show")
                        $item.find("p").removeClass("show")
                        $item.find("img").removeClass("show")
                    }
                    if (swiper.activeIndex == 4) {
                        $item.find("h3").removeClass("show")
                        $item.find("h5").removeClass("show")
                        $item.find("img").removeClass("show")
                    }
                    if (swiper.activeIndex == 5) {
                        $item.find(".item6-cont").removeClass("show")
                        $item.find("img").removeClass("show")
                    }
                },
                onSlideChangeEnd(swiper) {
                    var $item = $(".swiper-slide").eq(swiper.activeIndex)
                    if (swiper.activeIndex == 0) {
                        $item.find(".title").addClass("show")
                        $item.find("h3").addClass("show")
                        $item.find("p").addClass("show")
                        $item.find(".title-img").addClass("show")
                    }
                    if (swiper.activeIndex == 1 || swiper.activeIndex == 2) {
                        $item.find("h3").addClass("show")
                        $item.find("h5").addClass("show")
                        $item.find("h4").addClass("show")
                        $item.find("p").addClass("show")
                        $item.find("img").addClass("show")
                    }
                    if (swiper.activeIndex == 4) {
                        $item.find("h3").addClass("show")
                        $item.find("h5").addClass("show")
                        $item.find("img").addClass("show")
                    }
                    if (swiper.activeIndex == 5) {
                        $item.find(".item6-cont").addClass("show")
                        $item.find("img").addClass("show")
                    }
                }
            }
        }
    },
    methods: {
        onInit: function (swiper) {
            this.$parent.swiper = swiper
            var $item = $(".swiper-slide").eq(swiper.activeIndex)
            if (swiper.activeIndex == 0) {
                $item.find(".title").addClass("show")
                $item.find("h3").addClass("show")
                $item.find("p").addClass("show")
                $item.find(".title-img").addClass("show")
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url(./index.less);
</style>
