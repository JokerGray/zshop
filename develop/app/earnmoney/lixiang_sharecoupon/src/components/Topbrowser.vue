<!-- 提示跳转到其他浏览器 -->
<template>
    <section class="browserTips">
        <div class="tipsContent">
            <div class="tcontent">
                <div class="tipsText">1、点击右上角的 <img class="icon_menu" src="../assets/moreheng.png" alt="" srcset=""></div>
                <div class="tipsText">2、选择 <span class="textBg"><img class="icon_earth" src="../assets/diqiu.png"><span>在浏览器中打开</span></span></div>
                <img class="shapeup" src="../assets/shape_up@3x.png">
            </div>
        </div>
    </section>
</template>

<script>
export default {
  created () {
    // 若在微信或QQ内置浏览器中，则给出提示
    // this.show = window.navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common';
.browserTips{
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: -100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.12);
    z-index: 999;
    transition: all 0.2s ease-out;
}
.browserTips.active{
    top: 0;
}
.tipsContent{
    display: block;
    background-color: #fff;
}
.tcontent{
    display: block;
    margin: 0 auto;
    width: 80%;
    padding: pxToRem(80) pxToRem(50);
}
.tipsText{
    font-size: pxToRem(30);
    line-height: pxToRem(100);
    color: #000;
}
.icon_menu{
    width: pxToRem(60);
    height: pxToRem(60);
    vertical-align: middle;
}
.textBg{
    padding: pxToRem(16) pxToRem(32);
    border-radius: pxToRem(32);
    background-color: #999;
    color: #fff;

    span{
        height: pxToRem(38);
        line-height: pxToRem(38);
    }
}
.icon_earth{
    width: pxToRem(38);
    height: pxToRem(38);
    vertical-align: middle;
    margin-right: 0.5rem;
}
.shapeup{
    width: pxToRem(141);
    height: pxToRem(116);
    position: absolute;
    right: pxToRem(50);
    top: pxToRem(50);
}
</style>

