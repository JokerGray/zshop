<template>
    <div id="app">
        <topNav :swiper="swiper"></topNav>
        <router-view></router-view>
    </div>
</template>
<script>
import topNav from '@/components/nav/index.vue'

export default {
    components: {
        topNav
    },
    data () {
        return {
            swiper: null
        }
    }
}
</script>
<style lang="less">
*{
    -webkit-tap-highlight-color: transparent;
}
html {
    line-height: 1;
}

html,
body,
#app {
    height: 100%;
    overflow: hidden;
}

.swiper-pagination {
    position: absolute;
    width: 100%;
    top: .8rem;
    right: 0;
    box-shadow: 0 5px 5px #d0d0d0;
    transition: all 1s ease;
    border-top:  1px solid #dadada;
    &>span {
        width: 100%;
        height: 80px;
        line-height: 80px;
        display: block;
        border-radius: 0;
        font-size: 30px;
        background: #fff;
        border-bottom: 1px solid #dadada;
        opacity: 1;
        color: #999;
        &.swiper-pagination-bullet-active {
            font-weight: bold;
            background: #e5e5e5;
            color: #333;
        }
    }
}
</style>
