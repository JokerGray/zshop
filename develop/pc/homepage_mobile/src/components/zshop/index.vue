<template>
    <div>
        <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
            <swiper-slide class="item1  animated">
                <h3>
                    <div>智享店务店面展示端</div>
                </h3>
                <h5>自助五屏 智能店务</h5>
                <div class="content">
                    <img src="./img/web_zhanshiduan_shouyepad.png" alt="" class="cont-img">
                    <img src="./img/web_zhanshiduan_shouye_yuansu1.png" alt="" class="icon icon1">
                    <img src="./img/web_zhanshiduan_shouye_yuansu2.png" alt="" class="icon icon2">
                    <img src="./img/web_zhanshiduan_shouye_yuansu3.png" alt="" class="icon icon3">
                    <img src="./img/web_zhanshiduan_shouye_yuansu4.png" alt="" class="icon icon4">
                    <img src="./img/web_zhanshiduan_shouye_yuansu5.png" alt="" class="icon icon5">
                    <img src="./img/web_zhanshiduan_shouye_yuansu6.png" alt="" class="icon icon6">
                </div>
                <br>
                <img src="./img/web_zhanshiduan_shouye_xiala.png" alt="" class="arrow">
            </swiper-slide>
            <swiper-slide class="item2">
                <div class="title clearfix">
                    <img src="./img/01.png" alt="">
                    <div class="title-cont">
                        <h3>销售店务店面展示端</h3>
                        <h3>(销售篇)</h3>
                        <p style="line-height: 1.5;">
                            还在为开单烦恼？留客费心思？拓客
                            <br> 找解决方案？智享店务店面系统让你
                            <br> 一键懂产品，一秒知客户，快速定制
                            <br> 服务方案，促进下单成功率
                        </p>
                    </div>
                </div>

                <video src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/seller.mp4"  poster="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/seller.mp4?x-oss-process=video/snapshot,t_18000" controls="controls" ></video>
                <a href="http://docs.izxcs.com/pad.html">
                    <img src="./img/web_zhanshiduan_erping_btn2.png" alt="">
                </a>
            </swiper-slide>
            <swiper-slide class="item3">
                <div class="title clearfix">
                    <img src="./img/02.png" alt="">
                    <div class="title-cont">
                        <h3>智享店务 终端店面展示端</h3>
                        <br>
                        <h3>前台服务篇</h3>
                        <p style="line-height: 1.5;">
                            前台使用展示端，可以帮排班，帮预
                            <br>约妥妥当当.
                            <br>点击客户预约，可以看到当天邀约客
                            <br>户的情况，点击新增预约，选择邀约
                            <br>客户，选择技师，添加邀约时间，
                            <br>选择房间，选择项目。
                        </p>
                    </div>
                </div>
                <video src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/foreground.mp4" poster="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/foreground.mp4?x-oss-process=video/snapshot,t_1000"></video>
                <a href="http://docs.izxcs.com/pad.html">
                    <img src="./img/web_zhanshiduan_erping_btn2.png" alt="">
                </a>
            </swiper-slide>
            <swiper-slide class="item2">
                <div class="title clearfix">
                    <img src="./img/03.png" alt="">
                    <div class="title-cont">
                        <h3>销售店务店面展示端</h3>
                        <h3 class="three">员工操作篇</h3>
                        <p style="line-height: 1.5;">
                            员工使用展示端，可以根据顾客购买
                            <br> 的服务卡项做消耗，开工单。
                        </p>
                    </div>
                </div>
                <video src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/staff.mp4"  poster="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/staff.mp4?x-oss-process=video/snapshot,t_1000"></video>
                <a href="http://docs.izxcs.com/pad.html">
                    <img src="./img/web_zhanshiduan_erping_btn2.png" alt="">
                </a>
            </swiper-slide>
            <swiper-slide class="item3">
                <div class="title clearfix">
                    <img src="./img/04.png" alt="">
                    <div class="title-cont">
                        <h3>智享店务 终端店面展示端</h3>
                        <br>
                        <h3>店长管理篇</h3>
                        <p style="line-height: 1.5;">
                            店长使用展示端，可以实时监管门
                            <br> 店运营，根据门店实时反馈的信息
                            <br> 或业绩信息，制定下一步营销计划
                        </p>
                    </div>
                </div>
                <video src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/shopkeeper.mp4"  poster="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/publicize/pad/shopkeeper.mp4?x-oss-process=video/snapshot,t_1000"></video>
                <a href="http://docs.izxcs.com/pad.html">
                    <img src="./img/web_zhanshiduan_erping_btn2.png" alt="">
                </a>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
export default {
    name: "",
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
                        $item.find("h3").removeClass("show")
                        $item.find("h5").removeClass("show")
                        $item.find(".cont-img").removeClass("show")
                        $item.find(".icon").removeClass("show")
                        $item.find(".arrow").removeClass("show")
                        $item.find("a").removeClass("bounce")
                    }
                },
                onSlideChangeEnd(swiper) {
                    var $item = $(".swiper-slide").eq(swiper.activeIndex)
                    if (swiper.activeIndex == 0) {
                        $item.find("h3").addClass("show")
                        $item.find("h5").addClass("show")
                        $item.find(".cont-img").addClass("show")
                        $item.find(".icon").addClass("show")
                        $item.find(".arrow").addClass("show")
                        $item.find("a").addClass("bounce")
                    }
                }
            }
        }
    },
    methods: {
        onInit (swiper) {
            this.$parent.swiper = swiper
            var $item = $(".swiper-slide").eq(swiper.activeIndex)
            if (swiper.activeIndex == 0) {
                $item.find("h3").addClass("show")
                $item.find("h5").addClass("show")
                $item.find(".cont-img").addClass("show")
                $item.find(".icon").addClass("show")
                $item.find(".arrow").addClass("show")
                $item.find("a").addClass("bounce")
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url(./index.less);
</style>
