<!-- 卡片翻转效果 -->
<template>
    <section class="container">
        <div class="flipper" ref="flipper">
          <!-- 正面 -->
          <div class="front"><slot name="front"></slot></div>
          <!-- 反面 -->
          <div class="back"><slot name="back"></slot></div>
        </div>
    </section>
</template>
<script>
export default{
  props: {
    toggle: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    toggle (val) {
      this.$refs.flipper.classList[val ? 'remove' : 'add']('active')
    }
  }
}
</script>
<style scoped lang="scss">
.container{
  perspective: 1000px;
}
.flipper {
  transition: 0.8s;
  transform-style: preserve-3d;
  position: relative;
}
.front, .back {
  min-height: 100px;
  backface-visibility: hidden;
}
.front{
  z-index: 2;
  transform: rotateY(0deg);
}
.back{
  position: absolute;
  display: block;
  width: 100%;
  top: 0;
  transform: rotateY(180deg);
}
.flipper.active{
  transform: rotateY(-180deg);
}
</style>
