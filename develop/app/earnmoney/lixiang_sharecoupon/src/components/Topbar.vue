<!-- 顶端效果 -->
<template>
    <div>
        <section class="topbar">
            <img class="logo" src="../assets/logo.png">
            <div class="logoText">
                <div class="logoText1">智享城市</div>
                <div class="logoText2">智能经营 智慧生活</div>
            </div>
            <a href="//erweima.izxcs.com/erweima.php" class="download">下载APP</a>
        </section>
        <div class="tips">立刻下载APP查看你的玩家挣钱分享赚优惠券购买记录</div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '../assets/common';
.topbar{
    background-color: #333;
    color: #fff;
    padding: pxToRem(20) pxToRem(24) pxToRem(20) pxToRem(24);

    .logo{
        display: inline-block;
        width: pxToRem(64);
        height: pxToRem(64);
        vertical-align: top;
    }
    .logoText{
        height: pxToRem(64);
        display: inline-block;
        vertical-align: top;
    }
    .logoText1{
        margin-top: pxToRem(2);
        font-size: pxToRem(30);
    }
    .logoText2{
        margin-top: pxToRem(8);
        font-size: pxToRem(18);
    }
    .download{
        display: block;
        float: right;
        background-color: #fd3535;
        font-size: pxToRem(32);
        border-radius: pxToRem(4);
        padding: pxToRem(18) pxToRem(26);
        text-decoration: none;
        color: #fff;
    }
}
.tips{
    letter-spacing: 0.2px;
    font-size: pxToRem(26);
    background-color: #f65035;
    color: #fff;
    text-align: center;
    line-height: pxToRem(70);
}
</style>

