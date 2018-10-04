<template>
  <section>
    <el-menu default-active="2" class="menu">
        <el-menu-item index="1">
            <span slot="title">商品录入</span>
        </el-menu-item>
        <el-menu-item index="2">
            <span slot="title">服务与卡项</span>
        </el-menu-item>
        <el-menu-item index="3">
            <span slot="title">套餐录入</span>
        </el-menu-item>
        <el-menu-item index="4">
            <span slot="title">套盒录入</span>
      </el-menu-item>
    </el-menu>
    <el-input class="input-search" placeholder="搜索" prefix-icon="el-icon-search" v-model="input"></el-input>
  </section>
</template>

<script>
export default {
    data() {
    return {
      input: ''
    }
  }
}
</script>
<style scoped lang="scss">
.el-menu{
    border-right: none;
}
$color: #42c0b2;
.menu{
    .el-menu-item{
        font-size: 18px;
        color: #666;
        margin-left: 20px;
        border-left: 2px solid transparent;
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
        &.is-active{
            color: $color;
            border-left-color: $color;
            border-width: 4px;
            background: 0;
            span{
                color: $color;
                font-weight: 550;
            }
        }
    }
}
.input-search{
    position: relative;
    top: 50px;
    width: 144px;
    left: 28px;
    .el-input__inner{
        border-radius: 10px;
    }
}
</style>
<style>
.input-search .el-input__inner{
    border-radius: 40px;
    height: 34px;
    line-height: 34px;
}
.input-search .el-input__inner .el-input__icon{
    line-height: 34px;
}
.menu .el-menu-item>span{
    color:#999;
}
.menu .el-menu-item:hover{
    background: 0;
}
</style>
