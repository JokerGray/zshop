<template>
    <section class="menuList" ref="menuList">
        <div @click="toggleMenu(0)">
          <router-link class="content" to="/entry/shop">
              <span class="title">01</span>
              <img src="./img/1-3.png" alt="">
              <span class="text">店铺</span>
          </router-link>
        </div>
        <div @click="toggleMenu(1)">
          <router-link class="content" to="/entry/staff">
            <span class="title">02</span>
            <img src="./img/2-3.png" alt="">
            <span class="text">员工</span>
          </router-link>
        </div>
        <div class="active" @click="toggleMenu(2)">
          <router-link class="content" to="/entry/goods">
            <span class="title">03</span>
            <img src="./img/3-3.png" alt="">
            <span class="text">商品与服务</span>
          </router-link>
        </div>
        <div @click="toggleMenu(3)">
          <router-link class="content" to="/entry/customer">
            <span class="title">04</span>
            <img src="./img/4-3.png" alt="">
            <span class="text">顾客</span>
          </router-link>
        </div>
    </section>
</template>
<script>
export default {
  data () {
    return {
      menuList: [
        ['店铺', '店铺与设备'],
        ['员工', '员工录入'],
        ['商品', '商品与服务'],
        ['顾客', '顾客录入']
      ]
    }
  },
  methods: {
    toggleMenu (i) {
      var menus = this.$refs.menuList.children
      for (let j = 0; j < menus.length; j++) {
        menus[j].classList.remove('active')
        menus[j].querySelector('.text').textContent = this.menuList[j][0]
      }
      menus[i].classList.add('active')
      menus[i].querySelector('.text').textContent = this.menuList[i][1]
    }
  }
}
</script>
<style scoped lang="scss">
.menuList{
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #00ccc0;

  >div{
    display: flex;
    align-items: center;
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
      .content img{
        display: block;
        margin: 0 auto;
        width: 80%;
        height: auto;
        transform: scale(1);
      }
      .content p{
        display: block;
      }
      .title{
        display: inline-block;
        font-size: 48px;
        transform: translate3d(0, -20px, 0);
        transition: all 0.2s ease-in-out;
      }
      .text{
        margin-left: 0;
      }
    }
    .content{
      display: block;
      padding: 9px 0;
      flex: 1;
      color: #fff;
      text-decoration: none;
      text-align: center;

      >span{
        vertical-align: text-bottom;
        line-height: 1;
        font-size: 24px;
      }
      .text{
        margin-left: -8px;
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
