<template>
    <section class="main">
      <img src="./home.jpg" alt="">
      <img class="animation" src="./animation.gif" alt="">
      <div class="entry" @click="toEntry"></div>
    </section>
</template>
<script>
export default {
    methods: {
        toEntry () {
            this.$router.push('/entry/goods')
        }
    }
}
</script>
<style scoped lang="scss">
.main{
    height: 100%;
    background-color: lightcyan;
}
.animation{
    position: absolute;
    top: 686px;
    left: 0;
}
.entry{
    position: absolute;
    width: 130px;
    height: 40px;
    top: 10px;
    left: 1300px;
    cursor: pointer;
}
</style>
