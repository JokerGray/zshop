<template>
    <section class="menuList">
        <div @click="toggleSlide(0)">
            <div>
                <span>01</span>
                <img src="./img/menu.png" alt="">
                <span>店铺</span>
            </div>
        </div>
        <div @click="toggleSlide(1)"><div><span>02</span><img src="./img/menu.png" alt="">员工</div></div>
        <div class="active" @click="toggleSlide(2)"><div><span>03</span><img src="./img/menu.png" alt="">商品</div></div>
        <div @click="toggleSlide(3)"><div><span>04</span><img src="./img/menu.png" alt="">顾客</div></div>
    </section>
</template>
<script>
export default {}
</script>
<style scoped lang="scss">
.menuList{
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  >div{
    display: flex;
    align-items: center;
    min-height: 50px;
    text-align: center;
    font-size: 24px;
    border-bottom: 1px solid #00ccc0;
    cursor: pointer;
    color: #fff;
    background-color: #00aba2;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
    &.active{
      flex: 1;
      background-color: #00ccc0;
      >div img{
        display: block;
        margin: 0 auto;
        height: auto;
        transform: scale(1);
      }
    }
    >div{
      flex: 1;
      text-align: center;
      >span{
        font-size: 36px;
        vertical-align: text-bottom;
        line-height: 1;
      }
      img{
        display: inline;
        height: 0;
        margin: 0;
        transform: scale(0);
        transition: all 0.2s ease-in-out;
        transition-delay: 0.2s;
      }
    }
  }
}
</style>
