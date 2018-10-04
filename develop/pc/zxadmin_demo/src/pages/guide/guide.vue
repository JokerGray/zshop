<template>
    <section class="main">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="layer" ref="layer" @click.once="clearLayer"></div>
        <div class="logo" ref="logo">
            <div class="train" ref="train">
                <div class="text-zx"></div>
            </div>
            <div class="text-zxcs"></div>
            <div class="train-road-content">
                <div class="train-road"></div>
            </div>
        </div>
        <div class="title-content" ref="title"></div>
        <div class="card-content" ref="cards">
            <div class="wrapper">
                <span class="num num1"></span>
                <div class="bg bg1"></div>
                <p class="title1"></p>
                <div class="description">
                    <div class="t t1"></div>
                    <div class="p">该模块可以录入商品、服务、卡项、礼包和套盒，并且可以对商品做入库和分类管理</div>
                </div>
            </div>
            <div class="wrapper">
                <span class="num num2"></span>
                <div class="bg bg2"></div>
                <p class="title2"></p>
                <div class="description">
                    <div class="t t2"></div>
                    <div class="p">该模块可以录入商品、服务、卡项、礼包和套盒，并且可以对商品做入库和分类管理</div>
                </div>
            </div>
            <div class="wrapper">
                <span class="num num3"></span>
                <div class="bg bg3"></div>
                <p class="title3"></p>
                <div class="description">
                    <div class="t t3"></div>
                    <div class="p">该模块可以录入商品、服务、卡项、礼包和套盒，并且可以对商品做入库和分类管理</div>
                </div>
            </div>
            <div class="wrapper">
                <span class="num num4"></span>
                <div class="bg bg4"></div>
                <p class="title4"></p>
                <div class="description">
                    <div class="t t4"></div>
                    <div class="p">该模块可以录入商品、服务、卡项、礼包和套盒，并且可以对商品做入库和分类管理</div>
                </div>
            </div>
        </div>
        <p class="btn-content" ref="content">
            <router-link to="/entry/goods"><el-button size="medium" round>开始录入</el-button></router-link>
        </p>
        <div class="hide">
            <img src="./img/1-1.png" alt="">
            <img src="./img/1-2.png" alt="">
            <img src="./img/1-3.png" alt="">
            <img src="./img/2-1.png" alt="">
            <img src="./img/2-2.png" alt="">
            <img src="./img/2-3.png" alt="">
            <img src="./img/3-1.png" alt="">
            <img src="./img/3-2.png" alt="">
            <img src="./img/3-3.png" alt="">
            <img src="./img/4-3.png" alt="">
            <img src="./img/4-3.png" alt="">
            <img src="./img/4-3.png" alt="">
        </div>
    </section>
</template>

<script>
export default {
  data () {
    return {
      showBtn: false
    }
  },
  methods: {
    clearLayer () {
        this.$refs.layer.classList.remove('active')
        let t = 500
        var wapperList = this.$refs.cards.querySelectorAll('.wrapper')
        setTimeout(() => { wapperList[0].classList.add('active') }, t)
        setTimeout(() => { wapperList[0].querySelector('.bg').classList.add('animated', 'fadeIn') }, t)
        setTimeout(() => { wapperList[1].classList.add('active') }, t + 500)
        setTimeout(() => { wapperList[1].querySelector('.bg').classList.add('animated', 'fadeIn') }, t + 500)
        setTimeout(() => { wapperList[2].classList.add('active') }, t + 1000)
        setTimeout(() => { wapperList[2].querySelector('.bg').classList.add('animated', 'fadeIn') }, t + 1000)
        setTimeout(() => { wapperList[3].classList.add('active') }, t + 1500)
        setTimeout(() => { wapperList[3].querySelector('.bg').classList.add('animated', 'fadeIn') }, t + 1500)

        setTimeout(() => { wapperList[0].querySelector('.bg').classList.add('active') }, t + 2000)
        setTimeout(() => { wapperList[0].querySelector('span').classList.add('active') }, t + 2500)
        setTimeout(() => { wapperList[0].querySelector('p').classList.add('animated', 'fadeInRight') }, t + 3000)

        setTimeout(() => { wapperList[1].querySelector('.bg').classList.add('active') }, t + 3500)
        setTimeout(() => { wapperList[1].querySelector('span').classList.add('active') }, t + 4000)
        setTimeout(() => { wapperList[1].querySelector('p').classList.add('animated', 'fadeInRight') }, t + 4500)

        setTimeout(() => { wapperList[2].querySelector('.bg').classList.add('active') }, t + 5000)
        setTimeout(() => { wapperList[2].querySelector('span').classList.add('active') }, t + 5500)
        setTimeout(() => { wapperList[2].querySelector('p').classList.add('animated', 'fadeInRight') }, t + 6000)

        setTimeout(() => { wapperList[3].querySelector('.bg').classList.add('active') }, t + 6500)
        setTimeout(() => { wapperList[3].querySelector('span').classList.add('active') }, t + 7000)
        setTimeout(() => { wapperList[3].querySelector('p').classList.add('animated', 'fadeInRight') }, t + 7500)

        setTimeout(() => { this.$refs.content.classList.add('animated', 'fadeIn') }, t + 8500)

        setTimeout(() => { wapperList[0].classList.add('hover') }, t + 9000)
        setTimeout(() => { wapperList[1].classList.add('hover') }, t + 9000)
        setTimeout(() => { wapperList[2].classList.add('hover') }, t + 9000)
        setTimeout(() => { wapperList[3].classList.add('hover') }, t + 9000)
    }
  },
  mounted () {
    var logo = this.$refs.logo;
    setTimeout(() => { logo.querySelector('.train-road').classList.add('animated', 'bounceInRight') }, 0);
    setTimeout(() => { logo.querySelector('.train').classList.add('animated', 'bounceInRight') }, 600);
    setTimeout(() => { logo.querySelector('.text-zx').classList.add('animated', 'bounceInRight') }, 1200);

    setTimeout(() => { logo.querySelector('.text-zxcs').classList.add('animated', 'bounceInRight') }, 1800);

    setTimeout(() => { logo.classList.add('active') }, 2400);
    setTimeout(() => { this.$refs.title.classList.add('animated', 'fadeInUp') }, 4000)
    
    setTimeout(() => { this.$refs.layer.classList.add('active') }, 4500)
  }
}
</script>
<style lang="scss">
*{
    font-family: 'microsoft yahei ui',"Microsoft YaHei",-apple-system,BlinkMacSystemFont,"SF Pro SC","SF Pro Text","Helvetica Neue",Helvetica,"PingFang SC","Segoe UI",Roboto,"Hiragino Sans GB",'arial',SimSun,sans-serif;
}
</style>

<style scoped lang="scss" type="text/scss">
.hide{
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
}
.animated{
    visibility: visible !important;
}
@mixin img_icon($w, $h) {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;
    width: $w;
    height: $h;
}
.main{
    height: 100%;
}
.main-title{
    padding: 5rem 0;
    text-align: center;
    font-size: 2rem;
}
.entry{
    text-align: center;
}
.btn-toggle{
    position: fixed;
    left: 0;
    bottom: 5rem;
    border-radius: 0;
    z-index: 999;
    visibility: hidden;
}
.logo{
    position: relative;
    display: block;
    width: 100%;
    left: 0;
    margin: 60px auto 0;
    text-align: center;
    transform: translate3d(0, 350px, 0);
    transition: all 1.5s cubic-bezier(0.59, 0, 0.27, 1.01);
    &.active{
        transform: translate3d(0, 0, 0);
    }
    .train{
        position: relative;
        @include img_icon(147px, 49px);
        background-image: url(./img/train.png);
        margin-left: -165px;
        visibility: hidden;
    }
    .text-zx{
        position: absolute;
        top: -2px;
        left: 42px;
        @include img_icon(105px, 63px);
        background-image: url(./img/text-zx.png);
        visibility: hidden;
    }
    .text{
        @include img_icon(267px, 15px);
        background-image: url(./img/text.png);
        vertical-align: bottom;
        margin-left: 20px;
        visibility: hidden;
    }
    .text-zxcs{
        position: absolute;
        @include img_icon(132px, 48px);
        background-image: url(./img/text-zxcs.png);
        margin-left: 10px;
        visibility: hidden;
    }
    .train-road-content{
        line-height: 0;
    }
    .train-road{
        @include img_icon(278px, 2px);
        background-image: url(./img/train-road.png);
        visibility: hidden;
    }
}
.layer{
    z-index: -1;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: url(./img/text-continue.png) no-repeat;
    background-position: center;
    transition: all 1s ease-out;
    &.active{
        z-index: 999;
        animation: showText 1s infinite alternate;
    }
}

.title-content{
    @include img_icon(808px, 75px);
    background-image: url(./img/text.png);
    display: block;
    margin: 55px auto 60px;
    visibility: hidden;
}

.card-content{
    display: flex;
    justify-content: center;
    text-align: center;
    .wrapper{
        position: relative;
        display: inline-block;
        margin: 0;
        width: 345px;
        height: 420px;
        transition: all 0.5s ease-in-out;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0);
        margin-left: -1px;
        box-sizing: border-box;
        .num{
            position: absolute;
            left: 30px;
            top: 30px;
            opacity: 0;
            transition: all 0.2s ease-in-out;
            &.num1{
                @include img_icon(15px, 39px);
                background-image: url(./img/num1.png);
            }
            &.num2{
                @include img_icon(26px, 39px);
                background-image: url(./img/num2.png);
            }
            &.num3{
                @include img_icon(26px, 40px);
                background-image: url(./img/num3.png);
            }
            &.num4{
                @include img_icon(27px, 39px);
                background-image: url(./img/num4.png);
            }
            &.active{
                opacity: 1;
            }
        }
        >.bg{
            position: absolute;
            top: 50%;
            left: 50%;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            transform: translate3d(-50%, -50%, 0);
            visibility: hidden;
            transition: all 0.3s ease;
            &.bg1, &.bg4{
                transform: translate3d(-50%, -60%, 0);
            }
            @for $i from 1 through 4{
                &.bg#{$i}{
                    @include img_icon(100%, 200px);
                    background-image: url(./img/#{$i}-1.png);
                }
            }
            // 激活后第二状态
            @for $i from 1 through 4{
                &.active.bg#{$i}{
                    background-image: url(./img/#{$i}-2.png);
                }
            }
        }
        >p{
            @include img_icon(150px, 30px);
            display: block;
            margin: 320px auto 0;
            visibility: hidden;
            @for $i from 1 through 4{
                &.title#{$i}{
                    background-image: url(./img/p#{$i}.png);
                }
            }
        }
        &.active{
            border-color: rgba(0, 0, 0, 0.1);
            background-color: #fff;
            &.hover:hover{
                box-shadow: 0px 1px 20px 1px #dcd9d9;
                // 移入后第三状态
                .bg{
                    transform: translate3d(-50%, -85%, 0);
                }
                @for $i from 1 through 4{
                    .bg#{$i}{
                        background-image: url(./img/#{$i}-3.png);
                    }
                }
                >span{
                    transition-duration: 0.2s;
                    color: #42c0b2;
                }
                >p{
                    background: rgba(0,0,0,0);
                }
                .description{
                    bottom: 0;
                    .t{
                        opacity: 1;
                    }
                    .p{
                        color: rgba($color: #444, $alpha: 1);
                    }
                }
                @for $i from 1 through 4{
                    .num#{$i}{
                        background-image: url(./img/num#{$i}-1.png);
                    }
                }
            }
        }
    }
}
.btn-content{
    margin-top: 60px;
    text-align: center;
    font-size: 20px;
    visibility: hidden;
    .el-button{
        padding-left: 80px;
        padding-right: 80px;
        font-size: 22px;
        background-color: #00cdc1;
        color: #fff;
    }
}
.description{
    position: absolute;
    width: 100%;
    bottom: -50px;
    left: 0;
    transition: all 0.2s ease-in-out;
    .t{
        @include img_icon(149px, 28px);
        background-image: url(./img/t1.png);
        display: block;
        margin: 0 auto;
        opacity: 0;
    }
    @for $i from 1 through 4{
        .t#{$i}{
            background-image: url(./img/t#{$i}.png);
        }
    }
    .p{
        padding: 20px 45px 50px;
        font-size: 18px;
        color: rgba($color: #414141, $alpha: 0);
        text-align: left;
    }
}
.circle{
    position: fixed;
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    background-color: #00cdc1;
    animation: breathe 2.7s infinite alternate;
    &:nth-of-type(1){
        width: 300px;
        height: 300px;
        left: 0;
        bottom: 0;
        transform: translate3d(-50%, 50%, 0);
        animation-name: wander1;
        animation-duration: 10s;
    }
    &:nth-of-type(2){
        width: 200px;
        height: 200px;
        right: 0;
        top: 0;
        transform: translate3d(50%, -50%, 0);
    }
    &:nth-of-type(3){
        width: 200px;
        height: 200px;
        left: 0;
        top: 0px;
        transform: translate3d(0, 0, 0);
        background-color: rgba($color: #00cdc1, $alpha: 0.3);
        animation-name: wander;
        animation-duration: 20s;
    }
}

@keyframes breathe {
    0%{
        opacity: 0.2;
        box-shadow: 0 1px 2px rgba(255,255,255,0.5);
    }
    100%{
        opacity: 1;
        box-shadow: 0 1px 30px rgba(59,255,255,1);
    }
}
@keyframes wander{
    0%{
        transform: translate3d(50px, 0, 0)
    }
    25%{
        transform: translate3d(150px, 50px, 0)
    }
    75%{
        transform: translate3d(40px, 90px, 0)
    }
    100%{
        transform: translate3d(80px, 40px, 0)
    }
}
@keyframes wander1{
    from{
        transform: translate3d(-50%, 40%, 0) scale(.9);
    }
    to{
        transform: translate3d(-49%, 45%, 0) scale(1.1);
    }
}
@keyframes showText {
    0%{
        opacity: 0.2;
    }
    100%{
        opacity: 1;
    }
}
</style>
