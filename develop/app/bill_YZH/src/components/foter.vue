<template>
  <div id="router">
    <ul>
      <li><router-link to="/zwz">转文赚</router-link></li>
      <li><router-link to="/fxz">分享赚</router-link></li>
      <li><router-link to="/qbz">抢标赚</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    mounted(){
      var h = window.screen.height;

      var ul = document.querySelector('#router ul');
      ul.style.top = h - ul.getBoundingClientRect().height -1 + 'px';
    }
  }
</script>

<style scoped>
  ul{
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    display: flex;
    flex-flow: row nowrap;
    background-color: #ff7733;
    position: absolute;
    left: 0;
  }
  ul li{
    flex: 0 0 calc(100%/3);
  }
  ul li a{
    font-size: 0.6rem;
    color: #fff;
  }
</style>
