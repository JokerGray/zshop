<template>
  <div id="app">
    <router-view class="menu" name="menu"></router-view>
    <router-view name="notification"></router-view>
    <transition name="fold">
      <router-view/>
    </transition>
    <router-view name="help"></router-view>
  </div>
</template>

<script>
import api from './api';
export default {
  name: 'App',
  methods: {
    test() {
      console.log(1);
    }
  },
  mounted() {
    // 测试登陆
    let that = this
    api.testAxios(13500000013, 123456).then(function(res) {
      that.$message({
        showClose: true,
        message: res.data.msg,
        type: 'success'
      });
    });
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html{
  overflow: hidden;
}
html, body{
  margin:0;
  height:100%;
}
#app{
  height: 100%;
}
</style>

<style scoped lang="scss">
.menu {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 200px;
  background-color: #eee;
  border-right: 1px solid #eee;
}
</style>
