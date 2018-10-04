<template>
    <div>
        <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
            <!-- 脸圈 1-->
            <swiper-slide class="item1">
                <div class="cont ">
                    <img src="./img/lq.png" alt="">
                    <div class="icon icon1"><i class="hs"></i>无感就跳过</div>
                    <div class="icon icon2"><i class="lv"></i>上传照片，吸引粉丝，
                        <br>有机会成为"主脸"，"主播"</div>
                    <div class="icon icon3"><i class="ls"></i>喜欢就"比心"</div>
                    <span>脸圈</span>
                </div>
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 看脸时代
                    <br> 有颜有圈才有生活
                </p>
            </swiper-slide>
            <!-- 全民炫 2-->
            <swiper-slide class="item2">
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 开启视频2.0时代
                </p>
                <div class="cont ">
                    <span>全民炫</span>
                    <img src="./img/qmx.png" alt="">
                    <div class="icon icon1"><i class="hs"></i>最热门视频，
                        <br>最新活动推荐</div>
                    <div class="icon icon2"><i class="lv"></i>微视频展示，
                        <br>记录精彩瞬间</div>
                    <div class="icon icon3"><i class="ls"></i>随时随地，拍摄炫视频</div>
                </div>
            </swiper-slide>
            <!-- 约吧 1-->
            <swiper-slide class="item1">
                <div class="cont ">
                    <img src="./img/yb.png" alt="">
                    <div class="icon icon1"><i class="hs"></i>生活服务分类</div>
                    <div class="icon icon2 yb"><i class="lv"></i>服务分类 删选热门服务</div>
                    <div class="icon icon3 yb"><i class="ls"></i>搜罗全城，技能互换
                        <br>系统自动匹配需求及服务</div>
                    <span>约吧</span>
                </div>
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 我能我要，选你所想
                    <br> 生活服务需求全满足&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
            </swiper-slide>
            <!-- 玩家挣钱 2-->
            <swiper-slide class="item2">
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 做任务,搞活动
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;轻轻松松把钱赚
                </p>
                <div class="cont ">
                    <span>玩家挣钱</span>
                    <img src="./img/wjzq.png" alt="">
                    <div class="icon icon1 wjzq"><i class="lv"></i>不玩虚的 只按成交返佣</div>
                    <div class="icon icon2 wjzq"><i class="hs"></i>佣金0压力 买单者付佣金</div>
                    <div class="icon icon3 wjzq"><i class="ls"></i>人人均是您的揽客员</div>
                </div>
            </swiper-slide>
            <!-- 圈子 1-->
            <swiper-slide class="item1">
                <div class="cont ">
                    <img src="./img/qz.png" alt="">
                    <div class="icon icon1 qz"><i class="hs"></i>商家对圈子进行冠名，赞
                        <br>助或者领养，双方达成战
                        <br>略合作。</div>
                    <div class="icon icon2 qz"><i class="ls"></i>上传照片，吸引粉丝，
                        <br>有机会成为"主脸"，"主播"</div>
                    <div class="icon icon3 qz"><i class="lv"></i>个人根据兴趣发起或加入圈子</div>
                    <span>圈子</span>
                </div>
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 定制你的城市圈
                    <br> 社交无障碍，城市零距离
                </p>
            </swiper-slide>
            <!-- 粉天地 2-->
            <swiper-slide class="item2">
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 建立社群组织，打造粉团队
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;享受最高粉丝权益智慧活动
                </p>
                <div class="cont ">
                    <span>粉天地</span>
                    <img src="./img/ftd.png" alt="">
                    <div class="icon icon1 ftd"><i class="lv"></i>进入粉团队详情</div>
                    <div class="icon icon2 ftd"><i class="hs"></i>商家有偿组织自己的粉丝圈子，发布
                        <br>介绍，活动，动态，相册</div>
                    <div class="icon icon3 ftd"><i class="ls"></i>查找你喜欢的团队赶快加入他
                        <br>们吧，更多权益等着你。</div>
                </div>
            </swiper-slide>
            <!-- 云店 1-->
            <swiper-slide class="item1">
                <div class="cont ">
                    <img src="./img/yd.png" alt="">
                    <div class="icon icon1 yd"><i class="lv"></i>观看店铺视频，720°全景，
                        <br>直播或图片，体验不一
                        <br>样的线上购物</div>
                    <div class="icon icon2 yd"><i class="hs"></i>实时发送弹幕，提出对店
                        <br>铺的疑问或建议，互动性
                        <br>前所未有</div>
                    <div class="icon icon3 yd"><i class="ls"></i>最新店铺活动实时更新</div>
                    <span>云店</span>
                </div>
                <p class="logo yd">
                    <i class="before"></i>
                    <i class="after"></i> 传统电商质变升级
                    <br> 给每家线下实体店铺开通线上“云中店”
                </p>
            </swiper-slide>
            <!-- 智享头条 2-->
            <swiper-slide class="item2">
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 最新资讯，传媒变现
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我的频道我的喉舌我发声
                </p>
                <div class="cont ">
                    <span>智享头条</span>
                    <img src="./img/tt.png" alt="">
                    <div class="icon icon1 tt"><i class="ls"></i>最新活动资讯，最全城市
                        <br>信息，分类阅读波罗万象</div>
                    <div class="icon icon2 tt"><i class="hs"></i>频道订阅，一键筑成</div>
                    <div class="icon icon3 tt"><i class="lv"></i>信息智能筛选，根据个人兴
                        <br>趣爱好自动匹配推荐</div>
                </div>
            </swiper-slide>
            <!-- 娱乐 1-->
            <swiper-slide class="item1">
                <div class="cont ">
                    <img src="./img/yl.png" alt="">
                    <div class="icon icon1 yl"><i class="hs"></i>无感就跳过</div>
                    <div class="icon icon2 yl"><i class="lv"></i>上传照片，吸引粉丝，
                        <br>有机会成为"主脸"，"主播"</div>
                    <div class="icon icon3 yl"><i class="ls"></i>喜欢就"比心"</div>
                    <span>娱乐</span>
                </div>
                <p class="logo yl">
                    <i class="before"></i>
                    <i class="after"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;娱乐世界，多享多玩
                    <br> 人人都玩，不玩才怪
                </p>
            </swiper-slide>
            <!-- 泡圈聊天 2-->
            <swiper-slide class="item2">
                <p class="logo">
                    <i class="before"></i>
                    <i class="after"></i> 系统消息通知，精准推送
                    <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;建立属于自己的好友圈
                </p>
                <div class="cont ">
                    <span>泡圈聊天</span>
                    <img src="./img/pqlt.png" alt="">
                    <div class="icon icon1 lt"><i class="lv"></i>进入系统通知</div>
                    <div class="icon icon2 lt"><i class="hs"></i>群聊，圈组模式让你找到团队，共同
                        <br>分享生活，拥有团队归属感！</div>
                    <div class="icon icon3 lt"><i class="ls"></i>个人私聊模式，分享只属于你
                        <br>和他的小秘密</div>
                </div>
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
                // swiper configs 所有的配置同swiper官方api配置
                speed: 600,
                direction: 'vertical',
                setWrapperSize: false,
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true,
                height: window.innerHeight,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                onTransitionEnd(swiper) {
                    var $item = $(".swiper-slide").eq(swiper.activeIndex)
                    $(".swiper-slide").eq(swiper.activeIndex - 1).css("opacity", "0")
                    $(".swiper-slide").eq(swiper.activeIndex + 1).css("opacity", "0")
                    $item.css("opacity", "1")
                },
                onInit: this.onInit,
                onSlideChangeStart: function(swiper) {
                    var $item = $(".swiper-slide").eq(swiper.activeIndex)
                    $item.find("img").removeClass("show")
                    $item.find("span").removeClass("show")
                    $item.find(".icon1").removeClass("show")
                    $item.find(".icon2").removeClass("show")
                    $item.find(".icon3").removeClass("show")
                    $item.find(".logo").removeClass("show")
                    $item.find(".before").removeClass("show")
                    $item.find(".after").removeClass("show")
                },
                onSlideChangeEnd(swiper) {
                    var $item = $(".swiper-slide").eq(swiper.activeIndex)
                    $item.find("img").addClass("show")
                    $item.find("span").addClass("show")
                    $item.find(".icon1").addClass("show")
                    $item.find(".icon2").addClass("show")
                    $item.find(".icon3").addClass("show")
                    $item.find(".logo").addClass("show")
                    $item.find(".before").addClass("show")
                    $item.find(".after").addClass("show")
                }
            }
        }
    },
    methods: {
        onInit (swiper) {
            this.$parent.swiper = swiper
            var $item = $(".swiper-slide").eq(swiper.activeIndex)
            $item.find("img").addClass("show")
            $item.find("span").addClass("show")
            $item.find(".icon1").addClass("show")
            $item.find(".icon2").addClass("show")
            $item.find(".icon3").addClass("show")
            $item.find(".logo").addClass("show")
            $item.find(".before").addClass("show")
            $item.find(".after").addClass("show")
        }
    }
}
</script>
<style lang="less" scoped>
@import url(./index.less);
</style>
